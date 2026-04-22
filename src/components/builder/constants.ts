import { MarkerType } from '@vue-flow/core'
import {
  affine,
  autokey,
  beaufort,
  caesar,
  columnar,
  polybius,
  railFence,
  substitution,
  vigenere,
} from '@jabez007/cryptotron.js'

export const availableCiphers = [
  {
    type: 'affine',
    label: 'Affine Cipher',
    defaultKey: { alpha: 3, beta: 1 },
    encryptAlgorithm: affine.encrypt,
    decryptAlgorithm: affine.decrypt,
    crackAlgorithm: affine.crack,
    cipherKeyComponent: () => import('@/components/keys/KeyAffine.vue'),
  },
  {
    type: 'autokey',
    label: 'Autokey Cipher',
    defaultKey: { primer: 'bytewalker' },
    encryptAlgorithm: autokey.encrypt,
    decryptAlgorithm: autokey.decrypt,
    crackAlgorithm: autokey.crack,
    cipherKeyComponent: () => import('@/components/keys/KeyAutokey.vue'),
  },
  {
    type: 'beaufort',
    label: 'Beaufort Cipher',
    defaultKey: { keyword: 'nightcity' },
    encryptAlgorithm: beaufort.encrypt,
    decryptAlgorithm: beaufort.decrypt,
    crackAlgorithm: beaufort.crack,
    cipherKeyComponent: () => import('@/components/keys/KeyBeaufort.vue'),
  },
  {
    type: 'caesar',
    label: 'Caesar Cipher',
    defaultKey: { shift: 13 },
    encryptAlgorithm: caesar.encrypt,
    decryptAlgorithm: caesar.decrypt,
    crackAlgorithm: caesar.crack,
    cipherKeyComponent: () => import('@/components/keys/KeyCaesar.vue'),
  },
  {
    type: 'columnar',
    label: 'Columnar Cipher',
    defaultKey: { keyword: 'NIGHTCITY' },
    encryptAlgorithm: columnar.encrypt,
    decryptAlgorithm: columnar.decrypt,
    crackAlgorithm: columnar.crack,
    cipherKeyComponent: () => import('@/components/keys/KeyColumnar.vue'),
  },
  {
    type: 'polybius',
    label: 'Polybius Square',
    defaultKey: { keyword: '', cipherChars: 'ABCDE' },
    encryptAlgorithm: polybius.encrypt,
    decryptAlgorithm: polybius.decrypt,
    crackAlgorithm: polybius.crack,
    cipherKeyComponent: () => import('@/components/keys/KeyPolybius.vue'),
  },
  {
    type: 'rail-fence',
    label: 'Rail-Fence Cipher',
    defaultKey: { rails: 3 },
    encryptAlgorithm: railFence.encrypt,
    decryptAlgorithm: railFence.decrypt,
    crackAlgorithm: railFence.crack,
    cipherKeyComponent: () => import('@/components/keys/KeyRailFence.vue'),
  },
  {
    type: 'substitution',
    label: 'Substitution Cipher',
    defaultKey: { cipherAlphabet: 'qwertyuiopasdfghjklzxcvbnm' },
    encryptAlgorithm: substitution.encrypt,
    decryptAlgorithm: substitution.decrypt,
    crackAlgorithm: substitution.crack,
    cipherKeyComponent: () => import('@/components/keys/KeySubstitution.vue'),
  },
  {
    type: 'vigenere',
    label: 'Vigenère Cipher',
    defaultKey: { keyword: 'mockraven' },
    encryptAlgorithm: vigenere.encrypt,
    decryptAlgorithm: vigenere.decrypt,
    crackAlgorithm: vigenere.crack,
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
      crackAlgorithm: cipher.crackAlgorithm,
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
