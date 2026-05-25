import { describe, expect, it } from 'vitest'
import { isSteganographyType, validateSteganographyTopology } from '@/components/builder/utils'

describe('builder steganography topology', () => {
  it('recognizes steganography node types', () => {
    expect(isSteganographyType('bacon')).toBe(true)
    expect(isSteganographyType('emoji-smuggling')).toBe(true)
    expect(isSteganographyType('acrostic')).toBe(true)
    expect(isSteganographyType('caesar')).toBe(false)
  })

  it('allows graphs with no steganography nodes', () => {
    const error = validateSteganographyTopology(
      [
        { id: '1', data: { type: 'caesar' } },
        { id: '2', data: { type: 'vigenere' } },
      ],
      [{ source: '1', target: '2' }],
    )

    expect(error).toBeNull()
  })

  it('rejects graphs with multiple steganography nodes', () => {
    const error = validateSteganographyTopology(
      [
        { id: '1', data: { type: 'bacon' } },
        { id: '2', data: { type: 'emoji-smuggling' } },
      ],
      [],
    )

    expect(error).toMatch(/Only one steganography node/)
  })

  it('rejects graphs where steganography is not terminal', () => {
    const error = validateSteganographyTopology(
      [
        { id: '1', data: { type: 'caesar' } },
        { id: '2', data: { type: 'bacon' } },
        { id: '3', data: { type: 'vigenere' } },
      ],
      [
        { source: '1', target: '2' },
        { source: '2', target: '3' },
      ],
    )

    expect(error).toMatch(/last step in encryption/)
  })

  it('rejects graphs with multiple inputs into a steganography node', () => {
    const error = validateSteganographyTopology(
      [
        { id: '1', data: { type: 'caesar' } },
        { id: '2', data: { type: 'vigenere' } },
        { id: '3', data: { type: 'emoji-smuggling' } },
      ],
      [
        { source: '1', target: '3' },
        { source: '2', target: '3' },
      ],
    )

    expect(error).toMatch(/only accept one input path/)
  })

  it('allows a classical chain that ends in a steganography node', () => {
    const error = validateSteganographyTopology(
      [
        { id: '1', data: { type: 'caesar' } },
        { id: '2', data: { type: 'vigenere' } },
        { id: '3', data: { type: 'acrostic' } },
      ],
      [
        { source: '1', target: '2' },
        { source: '2', target: '3' },
      ],
    )

    expect(error).toBeNull()
  })
})
