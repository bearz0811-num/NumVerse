export const PRODUCT_NAME_ZH = '數感宇宙：理性的神殿'
export const PRODUCT_NAME_EN = 'NumVerse: Temple of Reason'

export const SAVE_KEY = 'NUMVERSE_SAVE_DATA'
export const SAVE_VERSION = '1.0.0-MVP'

export const SANITY_MAX = 5
export const INSIGHT_MAX = 6

/** @type {const} */
export const ERAS = ['YOUTH', 'PRIME', 'ELDER']

/** @type {const} */
export const MATHEMATICIANS = [
  {
    id: 'ARCHIMEDES',
    label: '阿基米德',
    icon: '🏛️',
    chapters: {
      YOUTH: 'ARCHIMEDES_YOUTH',
      PRIME: 'ARCHIMEDES_PRIME',
      ELDER: 'ARCHIMEDES_ELDER',
    },
  },
  {
    id: 'GALILEO',
    label: '伽利略',
    icon: '🔭',
    chapters: {
      YOUTH: 'GALILEO_YOUTH',
      PRIME: 'GALILEO_PRIME',
      ELDER: 'GALILEO_ELDER',
    },
  },
  {
    id: 'NEWTON',
    label: '牛頓',
    icon: '🍎',
    chapters: {
      YOUTH: 'NEWTON_YOUTH',
      PRIME: 'NEWTON_PRIME',
      ELDER: 'NEWTON_ELDER',
    },
  },
  {
    id: 'GAUSS',
    label: '高斯',
    icon: '👑',
    chapters: {
      YOUTH: 'GAUSS_YOUTH',
      PRIME: 'GAUSS_PRIME',
      ELDER: 'GAUSS_ELDER',
    },
  },
  {
    id: 'TURING',
    label: '圖靈',
    icon: '💻',
    chapters: {
      YOUTH: 'TURING_YOUTH',
      PRIME: 'TURING_PRIME',
      ELDER: 'TURING_ELDER',
    },
  },
]

export const ERA_LABEL = {
  YOUTH: '青年／國一',
  PRIME: '壯年／國二',
  ELDER: '暮年／國三',
}

/** 大廳節點圖短標 */
export const ERA_SHORT = {
  YOUTH: '青年',
  PRIME: '壯年',
  ELDER: '暮年',
}

export const EMPTY_FLAGS = {
  determinism_vs_freewill: 0,
  platonism_vs_constructivism: 0,
  utility_vs_aesthetics: 0,
  coldlogic_vs_empathy: 0,
}

/** gradeBand 1=國一(七上+七下), 2=國二, 3=國三 */
export function gradesForBand(band) {
  if (band === 1) return [{ grade: 7, half: 1 }, { grade: 7, half: 2 }]
  if (band === 2) return [{ grade: 8, half: 1 }, { grade: 8, half: 2 }]
  return [{ grade: 9, half: 1 }, { grade: 9, half: 2 }]
}
