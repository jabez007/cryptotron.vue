import { describe, it, expect } from 'vitest'
import {
  baconEncoder,
  baconDecoder,
  toHtmlSnippet,
  toMarkdown,
  type StyledChar,
} from '@/utils/steganography'

// ─── baconEncoder ────────────────────────────────────────────────────────────

describe('baconEncoder', () => {
  it('encodes a single letter into 5 styled chars', () => {
    // 'A' → index 0 → binary '00000' → all 'a'
    const result = baconEncoder('A', 'HELLO')
    expect(result).toHaveLength(5)
    result.forEach((sc) => expect(sc.type).toBe('a'))
  })

  it('encodes letter B correctly (00001 → aaaab)', () => {
    // 'B' → index 1 → binary '00001' → aaaab
    const result = baconEncoder('B', 'HELLO')
    const types = result.map((sc) => sc.type)
    expect(types).toEqual(['a', 'a', 'a', 'a', 'b'])
  })

  it('encodes letter Z correctly (11001 → bbaab)', () => {
    // 'Z' → index 25 → binary '11001' → bbaab
    const result = baconEncoder('Z', 'HELLO')
    const types = result.map((sc) => sc.type)
    expect(types).toEqual(['b', 'b', 'a', 'a', 'b'])
  })

  it('preserves the cover text characters', () => {
    const cover = 'HELLO'
    const result = baconEncoder('A', cover)
    const chars = result.map((sc) => sc.char).join('')
    expect(chars).toBe(cover)
  })

  it('preserves cover text including non-alpha characters', () => {
    // 'A' needs 5 alpha chars; cover has exactly 5 alpha + punctuation
    const cover = 'He!lo?'
    // 5 alpha chars, but only first 5 alpha are used (H,e,l,o + need one more)
    // Actually 'He!lo?' has H,e,l,o = 4 alpha — not enough for 'A'
    // Use a cover with 5 alpha chars and punctuation
    const cover2 = 'H.e!l,l?o'
    const result = baconEncoder('A', cover2)
    expect(result.map((s) => s.char).join('')).toBe(cover2)
  })

  it('non-alpha characters in cover text always get type "a"', () => {
    // Secret 'B' = 00001 (aaaab) — needs 5 alpha chars
    // Use cover with enough alpha chars + non-alpha
    const cover = 'ab! cde'
    const result = baconEncoder('B', cover)
    // '!' and spaces should be type 'a'
    const nonAlpha = result.filter((sc) => !/[A-Za-z]/.test(sc.char))
    nonAlpha.forEach((sc) => expect(sc.type).toBe('a'))
  })

  it('converts lowercase secret letters to uppercase before encoding', () => {
    const resultLower = baconEncoder('a', 'HELLO')
    const resultUpper = baconEncoder('A', 'HELLO')
    expect(resultLower.map((s) => s.type)).toEqual(resultUpper.map((s) => s.type))
  })

  it('strips non-alphabetic characters from secret before encoding', () => {
    // 'A1' strips to 'A' → needs only 5 alpha chars
    const result = baconEncoder('A1', 'HELLO')
    expect(result).toHaveLength(5)
  })

  it('handles multi-letter secret spanning cover text', () => {
    // 'AB' = 00000 00001 = 10 bits, need 10 alpha chars
    const cover = 'ABCDEFGHIJ'
    const result = baconEncoder('AB', cover)
    expect(result).toHaveLength(10)
    const types = result.map((sc) => sc.type)
    // 'A' = 00000, 'B' = 00001
    expect(types).toEqual(['a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'b'])
  })

  it('throws when cover text has too few alphabetic characters', () => {
    expect(() => baconEncoder('AB', 'Hi')).toThrow(
      /Cover text too short: need 10 letters, got 2/,
    )
  })

  it('throws with correct counts in the error message', () => {
    // 'C' needs 5 alpha chars; give it 3
    expect(() => baconEncoder('C', 'abc')).toThrow(/need 5 letters, got 3/)
  })

  it('extra cover chars beyond secret bits get type "a"', () => {
    // 'A' = 5 bits, cover = 8 alpha chars → last 3 should be type 'a'
    const result = baconEncoder('A', 'ABCDEFGH')
    const types = result.map((sc) => sc.type)
    // 'A' = 00000 → first 5 are all 'a', then remaining 3 also 'a'
    expect(types.slice(5)).toEqual(['a', 'a', 'a'])
  })

  it('returns cover-length array when secret is empty string', () => {
    // No bits to embed, every char stays as-is with type 'a'
    const result = baconEncoder('', 'Hello')
    expect(result).toHaveLength(5)
    result.forEach((sc) => expect(sc.type).toBe('a'))
  })

  it('handles secret with only non-alpha chars (strips to empty)', () => {
    const result = baconEncoder('123!@#', 'Hello')
    result.forEach((sc) => expect(sc.type).toBe('a'))
  })
})

// ─── toMarkdown ──────────────────────────────────────────────────────────────

describe('toMarkdown', () => {
  it('wraps type-b chars in bold markdown', () => {
    const styled: StyledChar[] = [
      { char: 'H', type: 'a', carriesBit: true },
      { char: 'i', type: 'b', carriesBit: true },
    ]
    expect(toMarkdown(styled)).toBe('<!--BACON:CARRIERS=2-->\nH**i**')
  })

  it('leaves type-a chars as plain text', () => {
    const styled: StyledChar[] = [{ char: 'X', type: 'a', carriesBit: true }]
    expect(toMarkdown(styled)).toBe('<!--BACON:CARRIERS=1-->\nX')
  })

  it('handles empty array', () => {
    expect(toMarkdown([])).toBe('<!--BACON:CARRIERS=0-->\n')
  })

  it('handles all type-b chars', () => {
    const styled: StyledChar[] = [
      { char: 'A', type: 'b', carriesBit: true },
      { char: 'B', type: 'b', carriesBit: true },
    ]
    expect(toMarkdown(styled)).toBe('<!--BACON:CARRIERS=2-->\n**A****B**')
  })

  it('round-trips through baconEncoder for letter B', () => {
    // 'B' = 00001 → aaaab → first 4 chars plain, last one bold
    const encoded = baconEncoder('B', 'HELLO')
    const md = toMarkdown(encoded)
    expect(md).toBe('<!--BACON:CARRIERS=5-->\nHELL**O**')
  })
})

// ─── toHtmlSnippet ───────────────────────────────────────────────────────────

describe('toHtmlSnippet', () => {
  it('wraps each char in a span with the correct class', () => {
    const styled: StyledChar[] = [
      { char: 'H', type: 'a', carriesBit: true },
      { char: 'i', type: 'b', carriesBit: true },
    ]
    const html = toHtmlSnippet(styled)
    expect(html).toContain('<span class="b-a">H</span>')
    expect(html).toContain('<span class="b-b">i</span>')
  })

  it('includes the <style> block', () => {
    const html = toHtmlSnippet([{ char: 'A', type: 'a', carriesBit: true }])
    expect(html).toContain('<style>')
    expect(html).toContain('.b-a')
    expect(html).toContain('.b-b')
  })

  it('wraps output in a <p> tag', () => {
    const html = toHtmlSnippet([{ char: 'X', type: 'a', carriesBit: true }])
    expect(html).toContain('<p data-bacon-carriers="1">')
    expect(html).toContain('</p>')
  })

  it('escapes the < character as &lt;', () => {
    const styled: StyledChar[] = [{ char: '<', type: 'a', carriesBit: true }]
    const html = toHtmlSnippet(styled)
    expect(html).toContain('&lt;')
  })

  it('escapes ampersands', () => {
    const styled: StyledChar[] = [{ char: '&', type: 'a', carriesBit: true }]
    expect(toHtmlSnippet(styled)).toContain('&amp;')
  })

  it('escapes double quotes', () => {
    const styled: StyledChar[] = [{ char: '"', type: 'a', carriesBit: true }]
    expect(toHtmlSnippet(styled)).toContain('&quot;')
  })

  it('escapes single quotes', () => {
    const styled: StyledChar[] = [{ char: "'", type: 'a', carriesBit: true }]
    expect(toHtmlSnippet(styled)).toContain('&#39;')
  })

  it('escapes greater-than sign as &gt;', () => {
    const styled: StyledChar[] = [{ char: '>', type: 'a', carriesBit: true }]
    expect(toHtmlSnippet(styled)).toContain('&gt;')
  })

  it('handles empty array', () => {
    const html = toHtmlSnippet([])
    expect(html).toContain('<p data-bacon-carriers="0"></p>')
  })

  it('raw < is not present unescaped inside span content', () => {
    const styled: StyledChar[] = [{ char: '<', type: 'a' }]
    const html = toHtmlSnippet(styled)
    // The inner content of the span should be &lt;, not a raw <
    expect(html).toContain('>&lt;<')
  })
})

// ─── baconDecoder ────────────────────────────────────────────────────────────

describe('baconDecoder', () => {
  it('decodes markdown bold to recover hidden letter B', () => {
    // 'B' = 00001 → types: aaaab → "HELL**O**"
    const result = baconDecoder('<!--BACON:CARRIERS=5-->\nHELL**O**')
    expect(result).toBe('B')
  })

  it('decodes HTML <strong> tags', () => {
    const html = '<p data-bacon-carriers="5">HELL<strong>O</strong></p>'
    expect(baconDecoder(html)).toBe('B')
  })

  it('decodes HTML <b> tags', () => {
    const html = '<p data-bacon-carriers="5">HELL<b>O</b></p>'
    expect(baconDecoder(html)).toBe('B')
  })

  it('decodes span with b-b class', () => {
    const html =
      '<p data-bacon-carriers="5"><span class="b-a">H</span><span class="b-a">E</span><span class="b-a">L</span><span class="b-a">L</span><span class="b-b">O</span></p>'
    expect(baconDecoder(html)).toBe('B')
  })

  it('round-trips encode then decode via markdown for every letter', () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const cover = 'ABCDE'
    for (const letter of letters) {
      const encoded = baconEncoder(letter, cover)
      const md = toMarkdown(encoded)
      expect(baconDecoder(md)).toBe(letter)
    }
  })

  it('round-trips encode then decode for multi-letter secret via markdown', () => {
    const secret = 'HELLO'
    const cover = 'ABCDEFGHIJKLMNOPQRSTUVWXY'
    const encoded = baconEncoder(secret, cover)
    const md = toMarkdown(encoded)
    expect(baconDecoder(md)).toBe('HELLO')
  })

  it('round-trips encode then decode for multi-letter secret via clean span HTML', () => {
    const secret = 'HI'
    const cover = 'ABCDEFGHIJ'
    const encoded = baconEncoder(secret, cover)
    const cleanHtml = toHtmlSnippet(encoded)
    expect(baconDecoder(cleanHtml)).toBe('HI')
  })

  it('returns empty string when no alpha chars present', () => {
    expect(baconDecoder('<!--BACON:CARRIERS=0-->\n123 !@#')).toBe('')
  })

  it('returns empty string when fewer than 5 alpha chars', () => {
    expect(baconDecoder('<!--BACON:CARRIERS=4-->\nabcd')).toBe('')
  })

  it('ignores trailing bits that do not form a complete group of 5', () => {
    const encoded = baconEncoder('A', 'ABCDE')
    const md = toMarkdown(encoded)
    const mdWith7 = md + 'FG'
    expect(baconDecoder(mdWith7)).toBe('A')
  })

  it('is case-insensitive for plaintext alpha input', () => {
    const result = baconDecoder('<!--BACON:CARRIERS=5-->\nhell**o**')
    expect(result).toBe('B')
  })

  it('handles <strong> and <b> tags mixed', () => {
    const html = '<p data-bacon-carriers="5"><strong>H</strong>ELL<b>O</b></p>'
    expect(baconDecoder(html)).toBe('R')
  })

  it('handles extra whitespace and newlines in plain text', () => {
    const result = baconDecoder('<!--BACON:CARRIERS=5-->\nHE\nLL**O**')
    expect(result).toBe('B')
  })
})

// ─── encode/decode symmetry edge cases ──────────────────────────────────────

describe('encode/decode symmetry', () => {
  it('encodes and decodes a two-letter secret via markdown', () => {
    const secret = 'OK'
    const cover = 'ABCDEFGHIJ'
    const encoded = baconEncoder(secret, cover)
    const md = toMarkdown(encoded)
    const decoded = baconDecoder(md)
    expect(decoded).toBe('OK')
  })

  it('handles cover text with punctuation and spaces correctly', () => {
    const secret = 'A'
    const cover = 'H.e!l,l?o'
    const encoded = baconEncoder(secret, cover)
    expect(encoded.map((s) => s.char).join('')).toBe(cover)
    const md = toMarkdown(encoded)
    expect(baconDecoder(md)).toBe('A')
  })

  it('round-trip with cover longer than needed only decodes secret length', () => {
    // 'Z' = 11001 → needs 5 alpha; use 10 alpha.
    // baconEncoder sets carriesBit=true for first 5, false for rest.
    // toMarkdown sets carrierCount=5.
    // baconDecoder stops after 5 bits and returns only 'Z'.
    const secret = 'Z'
    const cover = 'ABCDEFGHIJ' // 10 alpha chars
    const encoded = baconEncoder(secret, cover)
    const md = toMarkdown(encoded)
    expect(baconDecoder(md)).toBe('Z')
  })
})