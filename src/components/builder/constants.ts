import { MarkerType } from '@vue-flow/core'
import { affine, autokey, beaufort, caesar, substitution, vigenere } from '@jabez007/cryptotron.js'

export const availableCiphers = [
  {
    type: 'affine',
    label: 'Affine Cipher',
    defaultKey: { alpha: 3, beta: 1 },
    encryptAlgorithm: affine.encrypt,
    decryptAlgorithm: affine.decrypt,
    cipherKeyComponent: () => import('@/components/keys/KeyAffine.vue'),
  },
  {
    type: 'autokey',
    label: 'Autokey Cipher',
    defaultKey: { primer: 'bytewalker' },
    encryptAlgorithm: autokey.encrypt,
    decryptAlgorithm: autokey.decrypt,
    cipherKeyComponent: () => import('@/components/keys/KeyAutokey.vue'),
  },
  {
    type: 'beaufort',
    label: 'Beaufort Cipher',
    defaultKey: { keyword: 'lumberjack' },
    encryptAlgorithm: beaufort.encrypt,
    decryptAlgorithm: beaufort.decrypt,
    cipherKeyComponent: () => import('@/components/keys/KeyBeaufort.vue'),
  },
  {
    type: 'caesar',
    label: 'Caesar Cipher',
    defaultKey: { shift: 13 },
    encryptAlgorithm: caesar.encrypt,
    decryptAlgorithm: caesar.decrypt,
    cipherKeyComponent: () => import('@/components/keys/KeyCaesar.vue'),
  },
  {
    type: 'substitution',
    label: 'Substitution Cipher',
    defaultKey: { cipherAlphabet: 'qwertyuiopasdfghjklzxcvbnm' },
    encryptAlgorithm: substitution.encrypt,
    decryptAlgorithm: substitution.decrypt,
    cipherKeyComponent: () => import('@/components/keys/KeySubstitution.vue'),
  },
  {
    type: 'vigenere',
    label: 'Vigenère Cipher',
    defaultKey: { keyword: 'mockraven' },
    encryptAlgorithm: vigenere.encrypt,
    decryptAlgorithm: vigenere.decrypt,
    cipherKeyComponent: () => import('@/components/keys/KeyVigenere.vue'),
  },
  // Add more cipher types as needed
]

export const cipherLookup = new Map(
  availableCiphers.map((cipher) => [
    cipher.type,
    {
      encryptAlgorithm: cipher.encryptAlgorithm,
      decryptAlgorithm: cipher.decryptAlgorithm,
      cipherKeyComponent: cipher.cipherKeyComponent,
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
      cipherKey: { keyword: 'mockraven' },
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
