import { describe, it, expect } from 'vitest'
import {
  tagsEncoder,
  tagsDecoder,
  baconDecoder,
  detectTagsPayloadFormat,
  stripTagsPayload,
  splitTagsMessage,
} from '@/utils/steganography'

describe('Invisible Steganography (Tags, ZW, VS)', () => {
  describe('tagsEncoder & tagsDecoder', () => {
    it('round-trips printable ASCII using default "tags" mode', () => {
      const secret = 'Secret'
      const cover = 'Hello'
      const encoded = tagsEncoder(secret, cover, 'tags')
      expect(encoded).toContain(cover)
      expect(tagsDecoder(encoded)).toBe(secret)
    })

    it('round-trips using "zero-width-binary" mode', () => {
      const secret = 'Hi'
      const cover = '🌍'
      const encoded = tagsEncoder(secret, cover, 'zero-width-binary')
      expect(encoded).toContain(cover)
      expect(tagsDecoder(encoded)).toBe(secret)
    })

    it('round-trips using "variation-selectors" mode (UTF-8 bytes)', () => {
      const secret = 'Byte'
      const cover = 'Cover'
      const encoded = tagsEncoder(secret, cover, 'variation-selectors')
      expect(encoded).toContain(cover)
      expect(tagsDecoder(encoded)).toBe(secret)
    })

    it('round-trips using "variation-selectors-nibbles" mode', () => {
      const secret = 'Nibble'
      const cover = 'Cover'
      const encoded = tagsEncoder(secret, cover, 'variation-selectors-nibbles')
      expect(encoded).toContain(cover)
      expect(tagsDecoder(encoded)).toBe(secret)
    })

    it('round-trips using "variation-selectors-legacy" mode', () => {
      const secret = 'hello world' // Legacy mode only supports a-z and space
      const cover = 'Cover'
      const encoded = tagsEncoder(secret, cover, 'variation-selectors-legacy')
      expect(encoded).toContain(cover)
      expect(tagsDecoder(encoded)).toBe(secret)
    })

    it('supports interleaving payload with cover text', () => {
      const secret = 'X'
      const cover = 'ABC'
      const encoded = tagsEncoder(secret, cover, 'tags', true)
      // Interleaved: cover[0] + first_tag_char + cover[1] ...
      expect(encoded.startsWith('A')).toBe(true)
      expect(tagsDecoder(encoded)).toBe(secret)
    })

    it('throws error for non-ASCII characters in "tags" mode', () => {
      expect(() => tagsEncoder('🚀', 'cover', 'tags')).toThrow(
        /Emoji Smuggling \(Tags mode\) supports printable ASCII only/,
      )
    })
  })

  describe('detectTagsPayloadFormat', () => {
    it('detects "Unicode Tags"', () => {
      const encoded = tagsEncoder('Msg', 'Cover', 'tags')
      expect(detectTagsPayloadFormat(encoded)).toBe('Unicode Tags')
    })

    it('detects "Zero-width Binary"', () => {
      const encoded = tagsEncoder('Msg', 'Cover', 'zero-width-binary')
      expect(detectTagsPayloadFormat(encoded)).toBe('Zero-width Binary')
    })

    it('detects "Variation Selectors (4-bit nibbles)"', () => {
      const encoded = tagsEncoder('Msg', 'Cover', 'variation-selectors-nibbles')
      expect(detectTagsPayloadFormat(encoded)).toBe('Variation Selectors (4-bit nibbles)')
    })

    it('detects "Variation Selectors (UTF-8 bytes)"', () => {
      const encoded = tagsEncoder('Msg', 'Cover', 'variation-selectors')
      expect(detectTagsPayloadFormat(encoded)).toBe('Variation Selectors (UTF-8 bytes)')
    })

    it('detects "Variation Selectors (legacy decimal-token format)"', () => {
      const encoded = tagsEncoder('hello', 'Cover', 'variation-selectors-legacy')
      expect(detectTagsPayloadFormat(encoded)).toBe('Variation Selectors (legacy decimal-token format)')
    })

    it('returns "No hidden payload detected" for plain text', () => {
      expect(detectTagsPayloadFormat('Plain Text')).toBe('No hidden payload detected')
    })
  })

  describe('stripTagsPayload', () => {
    it('removes tags from the message', () => {
      const secret = 'Secret'
      const cover = 'Original Cover'
      const encoded = tagsEncoder(secret, cover, 'tags')
      expect(stripTagsPayload(encoded)).toBe(cover)
    })

    it('removes zero-width characters', () => {
      const secret = 'Secret'
      const cover = 'Original Cover'
      const encoded = tagsEncoder(secret, cover, 'zero-width-binary')
      expect(stripTagsPayload(encoded)).toBe(cover)
    })

    it('removes variation selectors unconditionally', () => {
      const secret = 'Secret'
      const cover = 'Original Cover'
      const encoded = tagsEncoder(secret, cover, 'variation-selectors')
      expect(stripTagsPayload(encoded)).toBe(cover)

      // Test that VS in normal emojis are also stripped (as intended by the new rule)
      const emojiWithVS = '\u{263A}\u{FE0F}' // ☺️
      expect(stripTagsPayload(emojiWithVS)).toBe('\u{263A}')

      // Test stripping VS when adjacent to a marker
      const stegoVS = '\u{FE00}\u{E0041}' // VS-1 followed by TAG 'A'
      expect(stripTagsPayload('Hello' + stegoVS)).toBe('Hello')
    })
  })

  describe('splitTagsMessage', () => {
    it('returns both cover and secret', () => {
      const secret = 'Secret'
      const cover = 'Cover'
      const encoded = tagsEncoder(secret, cover, 'tags')
      const result = splitTagsMessage(encoded)
      expect(result.cover).toBe(cover)
      expect(result.secret).toBe(secret)
    })
  })

  describe('Edge Cases and Advanced Decoding', () => {
    it('decodes HTML entities in baconDecoder (numerical)', () => {
      const input = '<!--BACON:CARRIERS=5-->\n&#65;BCD**E**'
      expect(baconDecoder(input)).toBe('B')
    })

    it('does not crash on out-of-range HTML entities in baconDecoder', () => {
      // These should be handled gracefully by returning \uFFFD
      const inputHex = '<!--BACON:CARRIERS=5-->\n&#x110000;BCDE'
      const inputDec = '<!--BACON:CARRIERS=5-->\n&#1114112;BCDE'
      expect(() => baconDecoder(inputHex)).not.toThrow()
      expect(() => baconDecoder(inputDec)).not.toThrow()
    })

    it('handles compact zero-width binary (no separators)', () => {
      const ZW_ZERO = '\u200c'
      const ZW_ONE = '\u200d'
      const compact = ZW_ZERO + ZW_ONE + ZW_ZERO + ZW_ZERO + ZW_ZERO + ZW_ZERO + ZW_ZERO + ZW_ONE
      expect(tagsDecoder(compact)).toBe('A')
    })

    it('decodes Alt Tags if readable', () => {
      const ALT_TAG_OFFSET = 0xe00f0
      const secret = 'Hi'
      const encoded = [...secret].map(c => String.fromCodePoint(c.charCodeAt(0) + ALT_TAG_OFFSET)).join('')
      expect(tagsDecoder(encoded)).toBe(secret)
    })

    it('detects Alt Tags format (using a range that triggers it)', () => {
      const ALT_TAG_MIN = 0xe00f1
      const encoded = String.fromCodePoint(ALT_TAG_MIN)
      expect(detectTagsPayloadFormat(encoded)).toBe('Alt Tags')
    })
  })

  describe('Remaining Gaps', () => {
    it('legacy variation selectors ignores non-alpha non-space', () => {
      const secret = 'a! b'
      const cover = 'Cover'
      const encoded = tagsEncoder(secret, cover, 'variation-selectors-legacy')
      expect(tagsDecoder(encoded)).toBe('a b')
    })

    it('interleaving handles payload longer than cover', () => {
      const secret = 'LongSecret'
      const cover = 'A'
      const encoded = tagsEncoder(secret, cover, 'tags', true)
      expect(encoded.startsWith('A')).toBe(true)
      expect(tagsDecoder(encoded)).toBe(secret)
    })

    it('variation legacy decoder handles invalid numbers', () => {
      const VS_OFFSET = 0xfe00
      const encoded = String.fromCodePoint(VS_OFFSET + 3) + String.fromCodePoint(VS_OFFSET + 0) + String.fromCodePoint(VS_OFFSET + 10)
      // 30 is not 1-26 or 27, so it returns '0'
      expect(tagsDecoder(encoded)).toBe('0')
    })

    it('zero width decoder handles non-ascii results', () => {
      const ZW_ONE = '\u200d'
      const encoded = (ZW_ONE).repeat(8)
      expect(tagsDecoder(encoded)).toBe('')
    })
  })
})
