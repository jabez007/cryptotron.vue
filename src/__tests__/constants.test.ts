import { describe, it, expect } from 'vitest'
import { availableCiphers, cipherLookup } from '@/components/builder/constants'

// ─── columnar cipher entry ───────────────────────────────────────────────────

describe('availableCiphers – columnar entry', () => {
  const columnar = availableCiphers.find((c) => c.type === 'columnar')

  it('exists in availableCiphers', () => {
    expect(columnar).toBeDefined()
  })

  it('has the correct label', () => {
    expect(columnar?.label).toBe('Columnar Cipher')
  })

  it('has the correct defaultKey', () => {
    expect(columnar?.defaultKey).toEqual({ keyword: 'NIGHTCITY' })
  })

  it('has an encryptAlgorithm function', () => {
    expect(typeof columnar?.encryptAlgorithm).toBe('function')
  })

  it('has a decryptAlgorithm function', () => {
    expect(typeof columnar?.decryptAlgorithm).toBe('function')
  })

  it('has a crackAlgorithm function', () => {
    expect(typeof columnar?.crackAlgorithm).toBe('function')
  })

  it('has a cipherKeyComponent lazy loader', () => {
    expect(typeof columnar?.cipherKeyComponent).toBe('function')
  })
})

// ─── playfair cipher entry ───────────────────────────────────────────────────

describe('availableCiphers – playfair entry', () => {
  const playfair = availableCiphers.find((c) => c.type === 'playfair')

  it('exists in availableCiphers', () => {
    expect(playfair).toBeDefined()
  })

  it('has the correct label', () => {
    expect(playfair?.label).toBe('Playfair Cipher')
  })

  it('has the correct defaultKey', () => {
    expect(playfair?.defaultKey).toEqual({ keyword: 'MONARCHY' })
  })

  it('has an encryptAlgorithm function', () => {
    expect(typeof playfair?.encryptAlgorithm).toBe('function')
  })

  it('has a decryptAlgorithm function', () => {
    expect(typeof playfair?.decryptAlgorithm).toBe('function')
  })

  it('has a crackAlgorithm function', () => {
    expect(typeof playfair?.crackAlgorithm).toBe('function')
  })

  it('has a cipherKeyComponent lazy loader', () => {
    expect(typeof playfair?.cipherKeyComponent).toBe('function')
  })
})

// ─── cipherLookup map ────────────────────────────────────────────────────────

describe('cipherLookup', () => {
  it('contains columnar key', () => {
    expect(cipherLookup.has('columnar')).toBe(true)
  })

  it('contains playfair key', () => {
    expect(cipherLookup.has('playfair')).toBe(true)
  })

  it('columnar lookup entry has all required algorithm fields', () => {
    const entry = cipherLookup.get('columnar')
    expect(entry).toBeDefined()
    expect(typeof entry?.encryptAlgorithm).toBe('function')
    expect(typeof entry?.decryptAlgorithm).toBe('function')
    expect(typeof entry?.crackAlgorithm).toBe('function')
    expect(typeof entry?.cipherKeyComponent).toBe('function')
  })

  it('playfair lookup entry has all required algorithm fields', () => {
    const entry = cipherLookup.get('playfair')
    expect(entry).toBeDefined()
    expect(typeof entry?.encryptAlgorithm).toBe('function')
    expect(typeof entry?.decryptAlgorithm).toBe('function')
    expect(typeof entry?.crackAlgorithm).toBe('function')
    expect(typeof entry?.cipherKeyComponent).toBe('function')
  })

  it('columnar and playfair have distinct encrypt algorithms', () => {
    const col = cipherLookup.get('columnar')
    const pf = cipherLookup.get('playfair')
    expect(col?.encryptAlgorithm).not.toBe(pf?.encryptAlgorithm)
  })
})

// ─── all cipher entries have required shape ──────────────────────────────────

describe('availableCiphers – structural integrity', () => {
  it('every entry has type, label, defaultKey, and algorithm functions', () => {
    for (const cipher of availableCiphers) {
      expect(typeof cipher.type).toBe('string')
      expect(typeof cipher.label).toBe('string')
      expect(cipher.defaultKey).toBeDefined()
      expect(typeof cipher.encryptAlgorithm).toBe('function')
      expect(typeof cipher.decryptAlgorithm).toBe('function')
      expect(typeof cipher.crackAlgorithm).toBe('function')
      expect(typeof cipher.cipherKeyComponent).toBe('function')
    }
  })

  it('cipher types are unique', () => {
    const types = availableCiphers.map((c) => c.type)
    const unique = new Set(types)
    expect(unique.size).toBe(types.length)
  })
})

describe('builder steganography wrappers', () => {
  it('bacon builder wrapper rejects lossy input before baconEncoder', () => {
    const bacon = availableCiphers.find((cipher) => cipher.type === 'bacon')
    expect(bacon).toBeDefined()

    const encrypt = bacon!.encryptAlgorithm({ coverText: 'abcdefghij', exportMode: 'html' })
    expect(() => encrypt('abc123')).toThrow(/baconEncrypt/)
    expect(() => encrypt('abc123')).toThrow(/baconEncoder/)
  })

  it('acrostic builder wrapper rejects lossy input before generateAcrostic', () => {
    const acrostic = availableCiphers.find((cipher) => cipher.type === 'acrostic')
    expect(acrostic).toBeDefined()

    const encrypt = acrostic!.encryptAlgorithm({ mode: 'acrostic' })
    expect(() => encrypt('hello world')).toThrow(/acrosticEncrypt/)
    expect(() => encrypt('hello world')).toThrow(/generateAcrostic/)
  })
})
