import { MarkerType } from '@vue-flow/core'
import {
  affine,
  autokey,
  beaufort,
  caesar,
  columnar,
  polybius,
  playfair,
  railFence,
  substitution,
  vigenere,
} from '@jabez007/cryptotron.js'
import { generateAcrostic } from '@/utils/text-gen'
import {
  baconDecoder,
  baconEncoder,
  tagsDecoder,
  tagsEncoder,
  toHtmlSnippet,
  toMarkdown,
  type InvisibleEncodingMode,
} from '@/utils/steganography'
import type { AcrosticMode } from '@/components/keys/KeyAcrostic.vue'

type CipherCategory = 'classical' | 'steganography'
type CipherPlacement = 'any' | 'terminal'
const STEGO_PLAINTEXT_PATTERN = /^[a-z]+$/

const validateStegoPlaintext = (
  input: string,
  wrapperName: 'baconEncrypt' | 'acrosticEncrypt',
  helperName: 'baconEncoder' | 'generateAcrostic',
) => {
  if (!STEGO_PLAINTEXT_PATTERN.test(input)) {
    throw new Error(
      `[${wrapperName}] Rejecting lossy input before ${helperName}: expected lowercase ASCII letters matching /^[a-z]+$/.`,
    )
  }
}

const baconEncrypt =
  (key: { coverText?: string; exportMode?: 'html' | 'markdown' }) => (input: string) => {
    validateStegoPlaintext(input, 'baconEncrypt', 'baconEncoder')
    const preview = baconEncoder(input, key.coverText ?? '')
    return (key.exportMode ?? 'html') === 'html' ? toHtmlSnippet(preview) : toMarkdown(preview)
  }

const baconDecrypt = () => (input: string) => baconDecoder(input)
const unsupportedCrack = () => {
  throw new Error('Crack is not supported for this steganography technique.')
}

const emojiSmugglingEncrypt =
  (key: {
    coverText?: string
    encodingMode?: InvisibleEncodingMode
    interleave?: boolean
  }) =>
  (input: string) =>
    tagsEncoder(
      input,
      key.coverText ?? '👍',
      key.encodingMode ?? 'variation-selectors',
      key.interleave ?? false,
    )

const emojiSmugglingDecrypt = () => (input: string) => tagsDecoder(input)

const acrosticEncrypt = (key: { mode?: AcrosticMode }) => (input: string) => {
  if (!input) return ''
  validateStegoPlaintext(input, 'acrosticEncrypt', 'generateAcrostic')
  return generateAcrostic(input, key.mode ?? 'acrostic')
}

const stripAcrosticMetadata = (line: string) => line.trim().replace(/^(\[[^\]]+\]\s*)+/, '')

const acrosticDecrypt = (key: { mode?: AcrosticMode }) => (input: string) => {
  const lines = input.split('\n').filter((line) => line.trim().length > 0)
  const mode = key.mode ?? 'acrostic'

  if (mode === 'acrostic') {
    return lines.map((line) => stripAcrosticMetadata(line)[0] || '').join('')
  }

  if (mode === 'telestic') {
    return lines
      .map((line) => {
        const content = stripAcrosticMetadata(line)
        return content[content.length - 1] || ''
      })
      .join('')
  }

  return lines
    .map((line) => {
      const content = stripAcrosticMetadata(line)
      if (content.length < 2) return content
      return content[0] + content[content.length - 1]
    })
    .join('')
}

export const availableCiphers = [
  {
    type: 'affine',
    label: 'Affine Cipher',
    category: 'classical' as CipherCategory,
    placement: 'any' as CipherPlacement,
    defaultKey: { alpha: 3, beta: 1 },
    encryptAlgorithm: affine.encrypt,
    decryptAlgorithm: affine.decrypt,
    crackAlgorithm: affine.crack,
    cipherKeyComponent: () => import('@/components/keys/KeyAffine.vue'),
  },
  {
    type: 'autokey',
    label: 'Autokey Cipher',
    category: 'classical' as CipherCategory,
    placement: 'any' as CipherPlacement,
    defaultKey: { primer: 'bytewalker' },
    encryptAlgorithm: autokey.encrypt,
    decryptAlgorithm: autokey.decrypt,
    crackAlgorithm: autokey.crack,
    cipherKeyComponent: () => import('@/components/keys/KeyAutokey.vue'),
  },
  {
    type: 'beaufort',
    label: 'Beaufort Cipher',
    category: 'classical' as CipherCategory,
    placement: 'any' as CipherPlacement,
    defaultKey: { keyword: 'nightcity' },
    encryptAlgorithm: beaufort.encrypt,
    decryptAlgorithm: beaufort.decrypt,
    crackAlgorithm: beaufort.crack,
    cipherKeyComponent: () => import('@/components/keys/KeyBeaufort.vue'),
  },
  {
    type: 'caesar',
    label: 'Caesar Cipher',
    category: 'classical' as CipherCategory,
    placement: 'any' as CipherPlacement,
    defaultKey: { shift: 13 },
    encryptAlgorithm: caesar.encrypt,
    decryptAlgorithm: caesar.decrypt,
    crackAlgorithm: caesar.crack,
    cipherKeyComponent: () => import('@/components/keys/KeyCaesar.vue'),
  },
  {
    type: 'columnar',
    label: 'Columnar Cipher',
    category: 'classical' as CipherCategory,
    placement: 'any' as CipherPlacement,
    defaultKey: { keyword: 'NIGHTCITY' },
    encryptAlgorithm: columnar.encrypt,
    decryptAlgorithm: columnar.decrypt,
    crackAlgorithm: columnar.crack,
    cipherKeyComponent: () => import('@/components/keys/KeyColumnar.vue'),
  },
  {
    type: 'playfair',
    label: 'Playfair Cipher',
    category: 'classical' as CipherCategory,
    placement: 'any' as CipherPlacement,
    defaultKey: { keyword: 'MONARCHY' },
    encryptAlgorithm: playfair.encrypt,
    decryptAlgorithm: playfair.decrypt,
    crackAlgorithm: playfair.crack,
    cipherKeyComponent: () => import('@/components/keys/KeyPlayfair.vue'),
  },
  {
    type: 'polybius',
    label: 'Polybius Square',
    category: 'classical' as CipherCategory,
    placement: 'any' as CipherPlacement,
    defaultKey: { keyword: '', cipherChars: 'ABCDE' },
    encryptAlgorithm: polybius.encrypt,
    decryptAlgorithm: polybius.decrypt,
    crackAlgorithm: polybius.crack,
    cipherKeyComponent: () => import('@/components/keys/KeyPolybius.vue'),
  },
  {
    type: 'rail-fence',
    label: 'Rail-Fence Cipher',
    category: 'classical' as CipherCategory,
    placement: 'any' as CipherPlacement,
    defaultKey: { rails: 3 },
    encryptAlgorithm: railFence.encrypt,
    decryptAlgorithm: railFence.decrypt,
    crackAlgorithm: railFence.crack,
    cipherKeyComponent: () => import('@/components/keys/KeyRailFence.vue'),
  },
  {
    type: 'substitution',
    label: 'Substitution Cipher',
    category: 'classical' as CipherCategory,
    placement: 'any' as CipherPlacement,
    defaultKey: { cipherAlphabet: 'qwertyuiopasdfghjklzxcvbnm' },
    encryptAlgorithm: substitution.encrypt,
    decryptAlgorithm: substitution.decrypt,
    crackAlgorithm: substitution.crack,
    cipherKeyComponent: () => import('@/components/keys/KeySubstitution.vue'),
  },
  {
    type: 'vigenere',
    label: 'Vigenère Cipher',
    category: 'classical' as CipherCategory,
    placement: 'any' as CipherPlacement,
    defaultKey: { keyword: 'mockraven' },
    encryptAlgorithm: vigenere.encrypt,
    decryptAlgorithm: vigenere.decrypt,
    crackAlgorithm: vigenere.crack,
    cipherKeyComponent: () => import('@/components/keys/KeyVigenere.vue'),
  },
  {
    type: 'bacon',
    label: "Bacon's Encoding",
    category: 'steganography' as CipherCategory,
    placement: 'terminal' as CipherPlacement,
    defaultKey: { coverText: '', exportMode: 'html' as const },
    encryptAlgorithm: baconEncrypt,
    decryptAlgorithm: baconDecrypt,
    crackAlgorithm: unsupportedCrack,
    cipherKeyComponent: () => import('@/components/keys/KeyBacon.vue'),
  },
  {
    type: 'emoji-smuggling',
    label: 'Emoji Smuggling',
    category: 'steganography' as CipherCategory,
    placement: 'terminal' as CipherPlacement,
    defaultKey: {
      coverText: '👍',
      encodingMode: 'variation-selectors' as const,
      interleave: false,
    },
    encryptAlgorithm: emojiSmugglingEncrypt,
    decryptAlgorithm: emojiSmugglingDecrypt,
    crackAlgorithm: unsupportedCrack,
    cipherKeyComponent: () => import('@/components/keys/KeyEmojiSmuggling.vue'),
  },
  {
    type: 'acrostic',
    label: 'Acrostics',
    category: 'steganography' as CipherCategory,
    placement: 'terminal' as CipherPlacement,
    defaultKey: { coverText: '', mode: 'acrostic' as const },
    encryptAlgorithm: acrosticEncrypt,
    decryptAlgorithm: acrosticDecrypt,
    crackAlgorithm: unsupportedCrack,
    cipherKeyComponent: () => import('@/components/keys/KeyAcrostic.vue'),
  },
]

export const cipherLookup = new Map(
  availableCiphers.map((cipher) => [
    cipher.type,
    {
      encryptAlgorithm: cipher.encryptAlgorithm,
      decryptAlgorithm: cipher.decryptAlgorithm,
      crackAlgorithm: cipher.crackAlgorithm,
      cipherKeyComponent: cipher.cipherKeyComponent,
      category: cipher.category,
      placement: cipher.placement,
    },
  ]),
)

export const defaultNodes = [
  {
    id: '1',
    label: 'Caesar',
    data: {
      label: 'Caesar',
      type: 'caesar',
      encryptAlgorithm: caesar.encrypt,
      decryptAlgorithm: caesar.decrypt,
      crackAlgorithm: caesar.crack,
      cipherKey: { shift: 13 },
      cipherKeyComponent: () => import('@/components/keys/KeyCaesar.vue'),
    },
    position: { x: 250, y: 5 },
  },
  {
    id: '2',
    label: 'Vigenère',
    data: {
      label: 'Vigenère',
      type: 'vigenere',
      encryptAlgorithm: vigenere.encrypt,
      decryptAlgorithm: vigenere.decrypt,
      crackAlgorithm: vigenere.crack,
      cipherKey: { keyword: 'mockraven' },
      cipherKeyComponent: () => import('@/components/keys/KeyVigenere.vue'),
    },
    position: { x: 100, y: 100 },
  },
  {
    id: '3',
    label: 'Acrostics',
    data: {
      label: 'Acrostics',
      type: 'acrostic',
      encryptAlgorithm: acrosticEncrypt,
      decryptAlgorithm: acrosticDecrypt,
      crackAlgorithm: unsupportedCrack,
      cipherKey: { coverText: '', mode: 'acrostic' as const },
      cipherKeyComponent: () => import('@/components/keys/KeyAcrostic.vue'),
    },
    position: { x: 250, y: 195 },
  },
]

export const defaultEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    updatable: true,
    animated: true,
    markerEnd: MarkerType.Arrow,
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    updatable: true,
    animated: true,
    markerEnd: MarkerType.Arrow,
  },
]
