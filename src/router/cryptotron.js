const name = 'cryptotron';

export default function (path) {
  return {
    path: path || '/',
    component: () => import('../views/Home.vue'),
    children: [
      {
        path: '',
        name: `${name}-home`,
        component: () => import('../views/About.vue'),
      },
      {
        path: 'affine',
        name: `${name}-affine`,
        component: () => import('../views/AffineCipher.vue'),
      },
      {
        path: 'autokey',
        name: `${name}-autokey`,
        component: () => import('../views/AutokeyCipher.vue'),
      },
      {
        path: 'bacon',
        name: `${name}-bacon`,
        component: () => import('../views/BaconianCipher.vue'),
      },
      {
        path: 'beaufort',
        name: `${name}-beaufort`,
        component: () => import('../views/BeaufortCipher.vue'),
      },
      {
        path: 'builder/:sharedJson?',
        name: `${name}-builder`,
        component: () => import('../views/BYOA.vue'),
        props: true,
      },
      {
        path: 'caesar',
        name: `${name}-caesar`,
        component: () => import('../views/CaesarCipher.vue'),
      },
      {
        path: 'columnar-transposition',
        name: `${name}-columnar-transposition`,
        component: () => import('../views/ColumnarTranspositionCipher.vue'),
      },
      {
        path: 'desideratum',
        name: `${name}-desideratum`,
        component: () => import('../views/Desideratum.vue'),
      },
      {
        path: 'four-square',
        name: `${name}-four-square`,
        component: () => import('../views/FourSquareCipher.vue'),
      },
      {
        path: 'huffman',
        name: `${name}-huffman`,
        component: () => import('../views/HuffmanianCipher.vue'),
      },
      {
        path: 'morellet',
        name: `${name}-morellet`,
        component: () => import('../views/MorelletCipher.vue'),
      },
      {
        path: 'polybius',
        name: `${name}-polybius`,
        component: () => import('../views/PolybiusCipher.vue'),
      },
      {
        path: 'railfence',
        name: `${name}-railfence`,
        component: () => import('../views/RailFenceCipher.vue'),
      },
      {
        path: 'runningKey',
        name: `${name}-runningKey`,
        component: () => import('../views/RunningKeyCipher.vue'),
      },
      {
        path: 'substitution',
        name: `${name}-substitution`,
        component: () => import('../views/SubstitutionCipher.vue'),
      },
      {
        path: 'vigenere',
        name: `${name}-vigenere`,
        component: () => import('../views/VigenereCipher.vue'),
      },
    ],
  };
}
