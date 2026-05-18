import { RiTa } from 'rita'

/**
 * A highly realistic corpus of system log messages.
 * Includes standard log levels and technical terminology.
 */
const REALISTIC_LOGS = [
  "Connection established to remote host 192.168.1.104.",
  "Database migration completed successfully in 450ms.",
  "User session initialized for UID 4029.",
  "Incoming packet validated against firewall rules.",
  "Memory allocation successful for buffer 0xAF02.",
  "File system integrity check passed for /dev/sda1.",
  "Background task 'IndexArchives' started.",
  "Resource usage within nominal limits (CPU: 12%, MEM: 44%).",
  "Authentication successful for admin via local terminal.",
  "DHCP lease renewed for interface eth0.",
  "Kernel modules loaded: crypt_aes, virtio_net.",
  "System clock synchronized with NTP pool server.",
  "Warning: High disk I/O detected on volume 'Secondary'.",
  "Optimizing database indices for faster query performance.",
  "Snapshot created for persistent volume 'Archive_Root'.",
  "SSH connection closed from 10.0.0.5 port 54322.",
  "Process 882 terminated with exit code 0.",
  "Scheduled maintenance task 'PurgeLogs' completed.",
  "New node registered in cluster 'Spire_Gamma'.",
  "API request handled: GET /v1/status (200 OK).",
]

const LOG_LEVELS = ['INFO', 'INFO', 'INFO', 'WARN', 'DEBUG', 'DEBUG']
const SUBSYSTEMS = ['SYS', 'NET', 'AUTH', 'DB', 'FS', 'SEC']

/**
 * Generates a realistic timestamp string for a given date.
 */
const getTimestamp = (date: Date) => {
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

/**
 * Generates realistic, newline-separated system logs.
 * Can target either a word count or a precise alphabetic character count.
 */
export const generateThematicFiller = (targetWordCount: number, targetAlphaCount?: number): string => {
  const markov = RiTa.markov(2)
  markov.addText(REALISTIC_LOGS)

  const grammar = RiTa.grammar({
    start: '$sentence',
    sentence: '$subject $verb $object. | $fragment.',
    subject: 'The $adj $noun',
    adj: 'persistent | encrypted | virtual | local | remote | secondary',
    noun: 'volume | listener | gateway | socket | daemon | worker',
    verb: 'started | stopped | resumed | initialized',
    object: 'successfully | in background | on port 8080',
    fragment: '$subsystem: $adj $noun $status',
    subsystem: 'NET | SYS | AUTH | KERN | USER',
    status: 'up | down | active | pending | failed',
  })

  let lines: string[] = []
  let currentWordCount = 0
  let currentAlphaCount = 0

  // Calculate timestamps over the last 5 minutes
  // If targetAlphaCount is provided, use it for the estimate
  const totalEntriesGuess = targetAlphaCount 
    ? Math.ceil(targetAlphaCount / 30) 
    : Math.ceil(targetWordCount / 10)
  
  const fiveMinutesAgo = Date.now() - 5 * 60 * 1000
  const timeStep = (5 * 60 * 1000) / (totalEntriesGuess || 1)

  while (
    (targetAlphaCount && currentAlphaCount < targetAlphaCount) || 
    (!targetAlphaCount && currentWordCount < targetWordCount)
  ) {
    const level = LOG_LEVELS[Math.floor(Math.random() * LOG_LEVELS.length)]
    const sub = SUBSYSTEMS[Math.floor(Math.random() * SUBSYSTEMS.length)]
    
    const entryTime = new Date(fiveMinutesAgo + lines.length * timeStep + Math.random() * timeStep)
    const ts = getTimestamp(entryTime)
    const pid = Math.floor(Math.random() * 9000) + 1000

    const roll = Math.random()
    let content = ''
    if (roll < 0.6) {
      content = markov.generate()
    } else {
      content = grammar.expand()
    }

    if (content) {
      const fullLine = `[${ts}] [${level}] [${sub}] [PID:${pid}] ${content}`
      
      // If we have a targetAlphaCount, check if this line would overfill too much
      if (targetAlphaCount) {
        const lineAlphaCount = [...fullLine].filter(c => /[A-Za-z]/.test(c)).length
        // If we already have enough or this line is huge, we might want to trim or stop
        // But we need at least one line.
        currentAlphaCount += lineAlphaCount
      }

      lines.push(fullLine)
      currentWordCount += fullLine.split(/\s+/).length
    }
    
    // Safety break
    if (lines.length > 200) break
  }

  return lines.join('\n')
}

/**
 * Generates an acrostic sentence.
 */
export const generateAcrostic = (secret: string): string => {
  const letters = secret.toLowerCase().replace(/[^a-z]/g, '').split('')
  const words = letters.map((char) => {
    const candidates = RiTa.searchSync(new RegExp(`^${char}`, 'i'), {
      limit: 50,
      pos: 'nn|jj|vb',
    })

    if (candidates.length > 0) {
      const thematic = candidates.filter((w) =>
        /sync|node|data|crypt|core|pulse|link|void|dark|neon|host|port|scan|test/i.test(w),
      )
      const pool = thematic.length > 0 ? thematic : candidates
      return pool[Math.floor(Math.random() * pool.length)]
    }

    return char.toUpperCase()
  })

  return words.join(' ')
}

/**
 * Generates cover text specifically for Bacon's Cipher.
 */
export const generateBaconCover = (bitLength: number): string => {
  // We need exactly bitLength alphabetic characters to avoid suspicious trailing text.
  return generateThematicFiller(0, bitLength)
}
