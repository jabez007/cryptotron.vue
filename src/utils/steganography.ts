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
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex: string) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(Number.parseInt(dec, 10)))

const escapeHtml = (input: string): string =>
  input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const TAG_OFFSET = 0xe0000
const TAG_MIN = 0xe0020
const TAG_MAX = 0xe007e
const ALT_TAG_OFFSET = 0xe00f0
const ALT_TAG_MIN = 0xe0110
const ALT_TAG_MAX = 0xe016e
const ZW_ZERO = '\u200c'
const ZW_ONE = '\u200d'
const ZW_SEP = '\u200b'

export type InvisibleEncodingMode = 'tags' | 'zero-width-binary' | 'variation-selectors'

const VS_OFFSET = 0xfe00
const VS_MIN = 0xfe00
const VS_MAX = 0xfe0f
const VS_SUP_MIN = 0xe0100
const VS_SUP_MAX = 0xe01ef
const BYTE_SEP = 0x20

const byteToVariationSelector = (byte: number): string =>
  byte <= 0x0f ? String.fromCodePoint(VS_OFFSET + byte) : String.fromCodePoint(0xe0100 + (byte - 0x10))

const variationSelectorToByte = (cp: number): number | null => {
  if (cp >= VS_MIN && cp <= VS_MAX) return cp - VS_OFFSET
  if (cp >= VS_SUP_MIN && cp <= VS_SUP_MAX) return cp - 0xe0100 + 0x10
  return null
}

export const tagsEncoder = (secret: string, cover: string, mode: InvisibleEncodingMode = 'tags'): string => {
  const unsupported: string[] = []
  const asciiCodes: number[] = []

  for (const char of secret) {
    const cp = char.codePointAt(0)
    if (cp !== undefined && cp >= 0x20 && cp <= 0x7e) {
      asciiCodes.push(cp)
    } else if (cp !== undefined) {
      unsupported.push(char)
    }
  }

  if (unsupported.length > 0) {
    const uniqueUnsupported = [...new Set(unsupported)].slice(0, 8)
    const suffix = unsupported.length > uniqueUnsupported.length ? ', ...' : ''
    throw new Error(
      `Invisible Tags supports printable ASCII only (U+0020-U+007E). Unsupported characters: ${uniqueUnsupported.join(' ')}${suffix}`,
    )
  }

  if (mode === 'zero-width-binary') {
    const invisible = asciiCodes
      .map((cp) => cp.toString(2).padStart(8, '0').replace(/0/g, ZW_ZERO).replace(/1/g, ZW_ONE))
      .join(ZW_SEP)
    return `${cover}${invisible}`
  }

  if (mode === 'variation-selectors') {
    const bytes = new TextEncoder().encode(secret)
    const invisible = [...bytes, BYTE_SEP].map(byteToVariationSelector).join('')
    return `${cover}${invisible}`
  }

  const invisible = asciiCodes.map((cp) => String.fromCodePoint(cp + TAG_OFFSET)).join('')
  return `${cover}${invisible}`
}

const decodeUtf8Bytes = (bytes: number[]): string => {
  if (bytes.length === 0) return ''

  const boundary = bytes.lastIndexOf(BYTE_SEP)
  const payload = boundary >= 0 ? bytes.slice(0, boundary) : bytes
  if (payload.length === 0) return ''

  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(new Uint8Array(payload))
  } catch {
    return ''
  }
}

const decodeVariationSelectors = (encodedText: string): string => {
  const bytes: number[] = []
  for (const char of encodedText) {
    const cp = char.codePointAt(0)
    if (cp === undefined) continue
    const byte = variationSelectorToByte(cp)
    if (byte !== null) bytes.push(byte)
  }

  if (bytes.length === 0) return ''

  const direct = decodeUtf8Bytes(bytes)
  if (direct.length > 0) return direct

  if (bytes.every((b) => b >= 0x0 && b <= 0xf)) {
    const hexBytes: number[] = []
    for (let i = 0; i + 1 < bytes.length; i += 2) {
      hexBytes.push((bytes[i] << 4) | bytes[i + 1])
    }
    return decodeUtf8Bytes(hexBytes)
  }

  return ''
}

const decodeZeroWidthBinary = (encodedText: string): string => {
  let bits = ''
  for (const char of encodedText) {
    if (char === ZW_ZERO) bits += '0'
    else if (char === ZW_ONE) bits += '1'
    else if (char === ZW_SEP) bits += ' '
  }

  if (!bits.trim()) return ''

  const decodeChunk = (chunk: string): string => {
    if (!/^[01]{7,8}$/.test(chunk)) return ''
    const code = Number.parseInt(chunk, 2)
    return code >= 0x20 && code <= 0x7e ? String.fromCharCode(code) : ''
  }

  const tokens = bits
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .filter((chunk) => chunk.length > 0)

  let tokenOutput = ''
  for (const token of tokens) tokenOutput += decodeChunk(token)
  if (tokenOutput.length > 0) return tokenOutput

  const compact = bits.replace(/\s+/g, '')
  const tryFixedWidth = (value: string, width: 7 | 8 | 16): string => {
    if (value.length < width || value.length % width !== 0) return ''
    let out = ''
    for (let i = 0; i < value.length; i += width) {
      const code = Number.parseInt(value.slice(i, i + width), 2)
      if (code < 0x20 || code > 0x7e) return ''
      out += String.fromCharCode(code)
    }
    return out
  }

  const reverseBits = compact.replace(/[01]/g, (b) => (b === '0' ? '1' : '0'))
  const widths: (7 | 8 | 16)[] = [8, 7, 16]

  for (const candidate of [compact, reverseBits]) {
    for (const width of widths) {
      const direct = tryFixedWidth(candidate, width)
      if (direct.length > 0) return direct

      for (let offset = 1; offset < width; offset += 1) {
        const sliced = candidate.slice(offset)
        const maybe = tryFixedWidth(sliced, width)
        if (maybe.length > 0) return maybe
      }
    }
  }

  return ''
}

export const detectTagsPayloadFormat = (encodedText: string): string => {
  let hasPrimary = false
  let hasAlt = false

  for (const char of encodedText) {
    const cp = char.codePointAt(0)
    if (cp === undefined) continue
    if (cp >= TAG_MIN && cp <= TAG_MAX) hasPrimary = true
    if (cp >= ALT_TAG_MIN && cp <= ALT_TAG_MAX) hasAlt = true
  }

  if (hasPrimary && hasAlt) return 'Unicode Tags + Alt Tags'
  if (hasPrimary) return 'Unicode Tags'
  if (hasAlt) return 'Alt Tags'

  const variationSecret = decodeVariationSelectors(encodedText)
  if (variationSecret.length > 0) return 'Variation Selectors (UTF-8 bytes)'

  const zeroWidthSecret = decodeZeroWidthBinary(encodedText)
  if (zeroWidthSecret.length > 0) return 'Zero-width Binary'

  return 'No hidden payload detected'
}

export const tagsDecoder = (encodedText: string): string => {
  let secret = ''
  for (const char of encodedText) {
    const cp = char.codePointAt(0)
    if (cp === undefined) continue

    if (cp >= TAG_MIN && cp <= TAG_MAX) {
      secret += String.fromCodePoint(cp - TAG_OFFSET)
      continue
    }

    if (cp >= ALT_TAG_MIN && cp <= ALT_TAG_MAX) {
      secret += String.fromCodePoint(cp - ALT_TAG_OFFSET)
      continue
    }
  }

  if (secret.length > 0) return secret
  const variationSecret = decodeVariationSelectors(encodedText)
  if (variationSecret.length > 0) return variationSecret
  return decodeZeroWidthBinary(encodedText)
}

export const stripTagsPayload = (encodedText: string): string => {
  let cover = ''
  for (const char of encodedText) {
    const cp = char.codePointAt(0)
    if (cp === undefined) {
      cover += char
      continue
    }

    const isPrimaryTag = cp >= TAG_MIN && cp <= TAG_MAX
    const isAltTag = cp >= ALT_TAG_MIN && cp <= ALT_TAG_MAX
    const isVariationSelector = (cp >= VS_MIN && cp <= VS_MAX) || (cp >= VS_SUP_MIN && cp <= VS_SUP_MAX)
    const isZeroWidthPayload = char === ZW_ZERO || char === ZW_ONE || char === ZW_SEP
    if (!isPrimaryTag && !isAltTag && !isVariationSelector && !isZeroWidthPayload) {
      cover += char
    }
  }
  return cover
}

export const splitTagsMessage = (encodedText: string): { cover: string; secret: string } => ({
  cover: stripTagsPayload(encodedText),
  secret: tagsDecoder(encodedText),
})
