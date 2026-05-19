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
  const markdownBody = styled
    .map(({ char, type }) => (type === 'b' ? `**${char}**` : char))
    .join('')
  return `<!--BACON:CARRIERS=${carrierCount}-->\n${markdownBody}`
}

export const baconDecoder = (styledInput: string): string => {
  const carrierCountMatch =
    styledInput.match(/data-bacon-carriers=["'](\d+)["']/i) ??
    styledInput.match(/<!--\s*BACON:CARRIERS=(\d+)\s*-->/i)
  const carrierCount = carrierCountMatch ? Number.parseInt(carrierCountMatch[1], 10) : null

  const normalized = decodeHtmlEntities(
    styledInput
      .replace(/<\s*style\b[^>]*>[\s\S]*?<\s*\/\s*style>/gim, '')
      .replace(/<\s*script\b[^>]*>[\s\S]*?<\s*\/\s*script>/gim, '')
      .replace(/\*\*([^*]+)\*\*/g, (_, inner: string) => `[[B]]${inner}[[/B]]`)
      .replace(/<\s*strong\b[^>]*>(.*?)<\s*\/\s*strong>/gim, '[[B]]$1[[/B]]')
      .replace(/<\s*b\b[^>]*>(.*?)<\s*\/\s*b>/gim, '[[B]]$1[[/B]]')
      .replace(
        /<\s*span\b[^>]*class=["'][^"']*b-b[^"']*["'][^>]*>(.*?)<\s*\/\s*span>/gim,
        '[[B]]$1[[/B]]',
      )
      .replace(
        /<\s*span\b[^>]*class=["'][^"']*b-a[^"']*["'][^>]*>(.*?)<\s*\/\s*span>/gim,
        '[[A]]$1[[/A]]',
      )
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
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex: string) =>
      String.fromCodePoint(Number.parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(Number.parseInt(dec, 10)))

const escapeHtml = (input: string): string =>
  input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const TAG_OFFSET = 0xe0000
const TAG_START = '\u{e0001}'
const TAG_END = '\u{e007f}'
const TAG_MIN = 0xe0020
const TAG_MAX = 0xe007e
const ALT_TAG_OFFSET = 0xe00f0
const ALT_TAG_MIN = 0xe0110
const ALT_TAG_MAX = 0xe016e
const ZW_ZERO = '\u200c'
const ZW_ONE = '\u200d'
const ZW_SEP = '\u200b'

export type InvisibleEncodingMode =
  | 'tags'
  | 'zero-width-binary'
  | 'variation-selectors'
  | 'variation-selectors-legacy'
  | 'variation-selectors-nibbles'

const VS_OFFSET = 0xfe00
const VS_MIN = 0xfe00
const VS_MAX = 0xfe0f
const VS_SUP_MIN = 0xe0100
const VS_SUP_MAX = 0xe01ef
const BYTE_SEP = 0x20

const byteToVariationSelector = (byte: number): string =>
  byte <= 0x0f
    ? String.fromCodePoint(VS_OFFSET + byte)
    : String.fromCodePoint(0xe0100 + (byte - 0x10))

const variationSelectorToByte = (cp: number): number | null => {
  if (cp >= VS_MIN && cp <= VS_MAX) return cp - VS_OFFSET
  if (cp >= VS_SUP_MIN && cp <= VS_SUP_MAX) return cp - 0xe0100 + 0x10
  return null
}

export const tagsEncoder = (
  secret: string,
  cover: string,
  mode: InvisibleEncodingMode = 'tags',
  interleave: boolean = false,
): string => {
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

  let invisible = ''

  if (mode === 'variation-selectors-nibbles') {
    const bytes = new TextEncoder().encode(secret)
    const selectors: string[] = []
    for (const b of bytes) {
      const high = (b >> 4) & 0x0f
      const low = b & 0x0f
      selectors.push(String.fromCodePoint(VS_OFFSET + high))
      selectors.push(String.fromCodePoint(VS_OFFSET + low))
    }
    invisible = selectors.join('')
  } else if (mode === 'variation-selectors-legacy') {
    const tokens: number[] = []
    for (const char of secret.toLowerCase()) {
      if (char >= 'a' && char <= 'z') {
        const num = char.charCodeAt(0) - 96
        const digits = num.toString(10).split('').map(Number)
        tokens.push(...digits)
      } else if (char === ' ') {
        const digits = (27).toString(10).split('').map(Number)
        tokens.push(...digits)
      } else {
        continue
      }
      tokens.push(10)
    }
    invisible = tokens.map(byteToVariationSelector).join('')
  } else if (mode === 'variation-selectors') {
    const bytes = new TextEncoder().encode(secret)
    invisible = [...bytes, BYTE_SEP].map(byteToVariationSelector).join('')
  } else if (mode === 'zero-width-binary') {
    invisible = asciiCodes
      .map((cp) => cp.toString(2).padStart(8, '0').replace(/0/g, ZW_ZERO).replace(/1/g, ZW_ONE))
      .join(ZW_SEP)
  } else {
    if (unsupported.length > 0) {
      const uniqueUnsupported = [...new Set(unsupported)].slice(0, 8)
      const suffix = unsupported.length > uniqueUnsupported.length ? ', ...' : ''
      throw new Error(
        `Emoji Smuggling (Tags mode) supports printable ASCII only (U+0020-U+007E). Unsupported characters: ${uniqueUnsupported.join(' ')}${suffix}`,
      )
    }
    invisible =
      TAG_START + asciiCodes.map((cp) => String.fromCodePoint(cp + TAG_OFFSET)).join('') + TAG_END
  }

  if (!interleave) {
    return `${cover}${invisible}`
  }

  const coverChars = [...cover]
  const payloadChars = [...invisible]
  let result = ''
  let payloadIdx = 0

  for (let i = 0; i < coverChars.length; i += 1) {
    result += coverChars[i]
    if (payloadIdx < payloadChars.length) {
      result += payloadChars[payloadIdx]
      payloadIdx += 1
    }
  }

  if (payloadIdx < payloadChars.length) {
    result += payloadChars.slice(payloadIdx).join('')
  }

  return result
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

const isLikelyReadableText = (value: string): boolean => {
  if (value.length === 0) return false

  let printable = 0
  for (const char of value) {
    const cp = char.codePointAt(0)
    if (cp === undefined) continue
    if (cp === 0x09 || cp === 0x0a || cp === 0x0d) {
      printable += 1
      continue
    }
    if (cp >= 0x20) {
      printable += 1
      continue
    }
  }

  return printable / value.length >= 0.85
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
  if (isLikelyReadableText(direct)) return direct

  if (bytes.every((b) => b >= 0x0 && b <= 0xf)) {
    const hexBytes: number[] = []
    for (let i = 0; i + 1 < bytes.length; i += 2) {
      hexBytes.push((bytes[i] << 4) | bytes[i + 1])
    }
    const hexDecoded = decodeUtf8Bytes(hexBytes)
    if (isLikelyReadableText(hexDecoded)) return hexDecoded
  }

  // Compatibility fallback seen in some web emoji tools:
  // variation-selector values encode decimal digits and VS-11 (value 10) acts as token separator.
  // Example groups: 8|5|12|12|15|27|23|15|18|12|4 -> "hello world".
  if (bytes.includes(10) && bytes.every((b) => b >= 0 && b <= 10)) {
    const groups: number[][] = []
    let current: number[] = []

    for (const value of bytes) {
      if (value === 10) {
        if (current.length > 0) groups.push(current)
        current = []
      } else {
        current.push(value)
      }
    }
    if (current.length > 0) groups.push(current)

    if (groups.length > 0) {
      let out = ''
      for (const group of groups) {
        const num = Number.parseInt(group.join(''), 10)
        if (Number.isNaN(num)) return ''
        if (num >= 1 && num <= 26) {
          out += String.fromCharCode(96 + num)
          continue
        }
        if (num === 27) {
          out += ' '
          continue
        }
        return ''
      }
      if (out.length > 0) return out
    }
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
  const zeroWidthSecret = decodeZeroWidthBinary(encodedText)
  if (zeroWidthSecret.length > 0) return 'Zero-width Binary'

  const variationBytes: number[] = []
  for (const char of encodedText) {
    const cp = char.codePointAt(0)
    if (cp === undefined) continue
    const byte = variationSelectorToByte(cp)
    if (byte !== null) variationBytes.push(byte)
  }

  if (variationBytes.length > 0) {
    const variationSecret = decodeVariationSelectors(encodedText)
    if (variationSecret.length > 0) {
      if (variationBytes.every((b) => b >= 0x0 && b <= 0xf)) {
        return 'Variation Selectors (4-bit nibbles)'
      }
      return 'Variation Selectors (UTF-8 bytes)'
    }
  }

  let hasPrimary = false
  let hasAlt = false

  for (const char of encodedText) {
    const cp = char.codePointAt(0)
    if (cp === undefined) continue
    if ((cp >= TAG_MIN && cp <= TAG_MAX) || char === TAG_START || char === TAG_END)
      hasPrimary = true
    if (cp >= ALT_TAG_MIN && cp <= ALT_TAG_MAX) hasAlt = true
  }

  if (hasPrimary && hasAlt) return 'Unicode Tags + Alt Tags'
  if (hasPrimary) return 'Unicode Tags'
  if (hasAlt) return 'Alt Tags'

  return 'No hidden payload detected'
}

export const tagsDecoder = (encodedText: string): string => {
  // 1. Try Zero-width Binary
  const zeroWidthSecret = decodeZeroWidthBinary(encodedText)
  if (zeroWidthSecret.length > 0) return zeroWidthSecret

  // 2. Try Variation Selectors
  const variationSecret = decodeVariationSelectors(encodedText)
  if (variationSecret.length > 0) return variationSecret

  // 3. Try Standard Unicode Tags
  let primarySecret = ''
  for (const char of encodedText) {
    const cp = char.codePointAt(0)
    if (cp !== undefined && cp >= TAG_MIN && cp <= TAG_MAX) {
      primarySecret += String.fromCodePoint(cp - TAG_OFFSET)
    }
  }
  if (primarySecret.length > 0) return primarySecret

  // 4. Try Alt Tags (with readability check to avoid VS overlap garbage)
  let altSecret = ''
  for (const char of encodedText) {
    const cp = char.codePointAt(0)
    if (cp !== undefined && cp >= ALT_TAG_MIN && cp <= ALT_TAG_MAX) {
      altSecret += String.fromCodePoint(cp - ALT_TAG_OFFSET)
    }
  }
  if (isLikelyReadableText(altSecret)) return altSecret

  return ''
}

export const stripTagsPayload = (encodedText: string): string => {
  const chars = [...encodedText]
  let cover = ''

  const isMarker = (char: string | undefined): boolean => {
    if (char === undefined) return false
    const cp = char.codePointAt(0)
    if (cp === undefined) return false
    return (
      (cp >= TAG_MIN && cp <= TAG_MAX) ||
      char === TAG_START ||
      char === TAG_END ||
      (cp >= ALT_TAG_MIN && cp <= ALT_TAG_MAX) ||
      char === ZW_ZERO ||
      char === ZW_ONE ||
      char === ZW_SEP
    )
  }

  for (let i = 0; i < chars.length; i += 1) {
    const char = chars[i]
    const cp = char.codePointAt(0)
    if (cp === undefined) {
      cover += char
      continue
    }

    if (isMarker(char)) {
      continue
    }

    const isVariationSelector = (cp >= VS_MIN && cp <= VS_MAX) || (cp >= VS_SUP_MIN && cp <= VS_SUP_MAX)
    if (isVariationSelector) {
      if (isMarker(chars[i - 1]) || isMarker(chars[i + 1])) {
        continue
      }
    }

    cover += char
  }
  return cover
}

export const splitTagsMessage = (encodedText: string): { cover: string; secret: string } => ({
  cover: stripTagsPayload(encodedText),
  secret: tagsDecoder(encodedText),
})
