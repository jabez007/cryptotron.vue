const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export type BaconType = 'a' | 'b'

export interface StyledChar {
  char: string
  type: BaconType
  carriesBit: boolean
}

const encodeChar = (char: string): string => {
  const idx = ALPHABET.indexOf(char)
  return idx.toString(2).padStart(5, '0').replace(/0/g, 'a').replace(/1/g, 'b')
}

const decodeChunk = (chunk: string): string => {
  const binary = chunk.replace(/a/g, '0').replace(/b/g, '1')
  const idx = Number.parseInt(binary, 2)
  return ALPHABET[idx] ?? ''
}

export const baconEncoder = (secret: string, cover: string): StyledChar[] => {
  const cleaned = secret.toUpperCase().replace(/[^A-Z]/g, '')
  const bits = [...cleaned].map(encodeChar).join('')

  const alphaCount = [...cover].filter((c) => /[A-Za-z]/.test(c)).length
  if (alphaCount < bits.length) {
    throw new Error(`Cover text too short: need ${bits.length} letters, got ${alphaCount}.`)
  }

  let bitIndex = 0
  return [...cover].map((char) => {
    if (!/[A-Za-z]/.test(char) || bitIndex >= bits.length) {
      return { char, type: 'a', carriesBit: false }
    }

    const type = bits[bitIndex] as BaconType
    bitIndex += 1
    return { char, type, carriesBit: true }
  })
}

export const toHtmlSnippet = (styled: StyledChar[]): string => {
  const carrierCount = styled.filter(({ carriesBit }) => carriesBit).length
  const spans = styled
    .map(({ char, type, carriesBit }) =>
      carriesBit
        ? `<span class="b-${type}">${escapeHtml(char)}</span>`
        : `<span class="b-n">${escapeHtml(char)}</span>`,
    )
    .join('')

  return `<style>\n.b-a{font-weight:400;color:#e5e7eb;}\n.b-b{font-weight:700;color:#00ff41;text-shadow:0 0 5px #00ff41;}\n.b-n{font-weight:400;color:#e5e7eb;}\n</style>\n<p data-bacon-carriers="${carrierCount}">${spans}</p>`
}

export const toMarkdown = (styled: StyledChar[]): string => {
  const carrierCount = styled.filter(({ carriesBit }) => carriesBit).length
  const markdownBody = styled.map(({ char, type }) => (type === 'b' ? `**${char}**` : char)).join('')
  return `<!--BACON:CARRIERS=${carrierCount}-->\n${markdownBody}`
}

export const baconDecoder = (styledInput: string): string => {
  const carrierCountMatch =
    styledInput.match(/data-bacon-carriers=["'](\d+)["']/i) ?? styledInput.match(/<!--\s*BACON:CARRIERS=(\d+)\s*-->/i)
  const carrierCount = carrierCountMatch ? Number.parseInt(carrierCountMatch[1], 10) : null

  const normalized = decodeHtmlEntities(
    styledInput
      .replace(/<\s*style\b[^>]*>[\s\S]*?<\s*\/\s*style>/gim, '')
      .replace(/<\s*script\b[^>]*>[\s\S]*?<\s*\/\s*script>/gim, '')
      .replace(/\*\*([^*]+)\*\*/g, (_, inner: string) => `[[B]]${inner}[[/B]]`)
      .replace(/<\s*strong\b[^>]*>(.*?)<\s*\/\s*strong>/gim, '[[B]]$1[[/B]]')
      .replace(/<\s*b\b[^>]*>(.*?)<\s*\/\s*b>/gim, '[[B]]$1[[/B]]')
      .replace(/<\s*span\b[^>]*class=["'][^"']*b-b[^"']*["'][^>]*>(.*?)<\s*\/\s*span>/gim, '[[B]]$1[[/B]]')
      .replace(/<\s*span\b[^>]*class=["'][^"']*b-a[^"']*["'][^>]*>(.*?)<\s*\/\s*span>/gim, '[[A]]$1[[/A]]')
      .replace(/<\s*span\b[^>]*class=["'][^"']*b-n[^"']*["'][^>]*>(.*?)<\s*\/\s*span>/gim, '$1')
      .replace(/<[^>]+>/g, ''),
  )

  const bits: BaconType[] = []
  let inBold = false
  let inExplicitA = false
  let consumedCarriers = 0

  for (let i = 0; i < normalized.length; i += 1) {
    if (normalized.startsWith('[[B]]', i)) {
      inBold = true
      i += 4
      continue
    }
    if (normalized.startsWith('[[/B]]', i)) {
      inBold = false
      i += 5
      continue
    }
    if (normalized.startsWith('[[A]]', i)) {
      inExplicitA = true
      i += 4
      continue
    }
    if (normalized.startsWith('[[/A]]', i)) {
      inExplicitA = false
      i += 5
      continue
    }

    if (carrierCount !== null && consumedCarriers >= carrierCount) {
      continue
    }

    const char = normalized[i]
    if (/[A-Za-z]/.test(char) && (inBold || inExplicitA || carrierCount !== null)) {
      bits.push(inBold ? 'b' : 'a')
      consumedCarriers += 1
    }
  }

  let output = ''
  for (let i = 0; i + 4 < bits.length; i += 5) {
    output += decodeChunk(bits.slice(i, i + 5).join(''))
  }

  return output
}

const decodeHtmlEntities = (input: string): string =>
  input
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")

const escapeHtml = (input: string): string =>
  input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
