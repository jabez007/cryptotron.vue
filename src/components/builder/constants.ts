import { MarkerType } from '@vue-flow/core'
import { caesar, vigenere } from '@jabez007/cryptotron.js'

export const availableCiphers = [
  {
    type: 'caesar',
    label: 'Caesar Cipher',
    defaultKey: { shift: 3 },
    encryptAlgorithm: caesar.encrypt,
    decryptAlgorithm: caesar.decrypt,
    cipherKeyComponent: () => import('@/components/keys/KeyCaesar.vue'),
  },
  {
    type: 'vigenere',
    label: 'Vigenère Cipher',
    defaultKey: { keyword: 'secret' },
    encryptAlgorithm: vigenere.encrypt,
    decryptAlgorithm: vigenere.decrypt,
    cipherKeyComponent: () => import('@/components/keys/KeyVigenere.vue'),
  },
  // Add more cipher types as needed
]

export const defaultNodes = [
  {
    id: '1',
    label: 'Caesar',
    data: {
      encryptAlgorithm: caesar.encrypt,
      decryptAlgorithm: caesar.decrypt,
      cipherKey: { shift: 3 },
      cipherKeyComponent: () => import('@/components/keys/KeyCaesar.vue'),
    },
    position: { x: 250, y: 5 },
  },
  {
    id: '2',
    label: 'Vigenère',
    data: {
      encryptAlgorithm: vigenere.encrypt,
      decryptAlgorithm: vigenere.decrypt,
      cipherKey: { keyword: 'foobar' },
      cipherKeyComponent: () => import('@/components/keys/KeyVigenere.vue'),
    },
    position: { x: 100, y: 100 },
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
]
