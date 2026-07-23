import { beforeEach, describe, expect, it } from 'vitest'
import {
  completeChapter,
  createDefaultSave,
  grantSessionNodeEureka,
  startChapterSession,
} from './save.js'

const CHAPTER_ID = 'ARCHIMEDES_YOUTH'
const ENDINGS = [
  { id: 'ending_cold', title: '理性的冷酷神殿', eurekaReward: 1 },
  { id: 'ending_warm', title: '溫暖的理性之光', eurekaReward: 1 },
]

const bathNode = {
  id: 'act1_eureka',
  type: 'narrative',
  rewards: { eurekaCoin: 1 },
}

const endingCold = {
  id: 'ending_cold',
  type: 'ending',
  rewards: { eurekaCoin: 1 },
}

const endingWarm = {
  id: 'ending_warm',
  type: 'ending',
  rewards: { eurekaCoin: 1 },
}

function memoryLocalStorage() {
  const store = new Map()
  return {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => {
      store.set(k, String(v))
    },
    removeItem: (k) => {
      store.delete(k)
    },
    clear: () => store.clear(),
  }
}

beforeEach(() => {
  globalThis.localStorage = memoryLocalStorage()
})

function beginFreshSession(save = createDefaultSave()) {
  return startChapterSession(save, CHAPTER_ID)
}

describe('Eureka settlement (方案 B)', () => {
  it('首通：章內頓悟＋結局進 pending，通關一次入帳、無 bonus', () => {
    let save = beginFreshSession()

    let r = grantSessionNodeEureka(save, bathNode)
    expect(r.granted).toEqual({ eurekaCoin: 1 })
    save = r.save
    expect(save.current_session.eurekaPending).toBe(1)

    r = grantSessionNodeEureka(save, endingCold)
    expect(r.granted).toEqual({ eurekaCoin: 1 })
    save = r.save
    expect(save.current_session.eurekaPending).toBe(2)

    const done = completeChapter(save, CHAPTER_ID, {}, {
      endingId: 'ending_cold',
      endings: ENDINGS,
    })
    expect(done.granted).toEqual({ eurekaCoin: 2 })
    expect(done.endingUnlock).toMatchObject({
      endingId: 'ending_cold',
      isNew: true,
      bonusEureka: 0,
      unlockedCount: 1,
      totalEndings: 2,
    })
    expect(done.save.player.eurekaCoin).toBe(2)
    expect(done.save.progress.claimed_rewards).toContain(`chapter:${CHAPTER_ID}`)
    expect(done.save.progress.eureka_by_chapter[CHAPTER_ID]).toBe(2)
    expect(done.save.progress.unlockedEndings[CHAPTER_ID]).toEqual(['ending_cold'])
    expect(done.save.current_session).toBeNull()
  })

  it('重玩同結局：不進 pending、不補發、幣不變', () => {
    let save = beginFreshSession()
    save = grantSessionNodeEureka(save, bathNode).save
    save = grantSessionNodeEureka(save, endingCold).save
    save = completeChapter(save, CHAPTER_ID, {}, {
      endingId: 'ending_cold',
      endings: ENDINGS,
    }).save
    expect(save.player.eurekaCoin).toBe(2)

    save = beginFreshSession(save)
    expect(grantSessionNodeEureka(save, bathNode).granted).toBeNull()
    expect(grantSessionNodeEureka(save, endingCold).granted).toBeNull()
    expect(save.current_session.eurekaPending).toBe(0)

    const done = completeChapter(save, CHAPTER_ID, {}, {
      endingId: 'ending_cold',
      endings: ENDINGS,
    })
    expect(done.granted).toBeNull()
    expect(done.endingUnlock).toMatchObject({
      isNew: false,
      bonusEureka: 0,
      unlockedCount: 1,
    })
    expect(done.save.player.eurekaCoin).toBe(2)
  })

  it('重玩新結局：章內／結局節點不 pending，completeChapter 只補 bonusEureka', () => {
    let save = beginFreshSession()
    save = grantSessionNodeEureka(save, bathNode).save
    save = grantSessionNodeEureka(save, endingCold).save
    save = completeChapter(save, CHAPTER_ID, {}, {
      endingId: 'ending_cold',
      endings: ENDINGS,
    }).save

    save = beginFreshSession(save)
    expect(grantSessionNodeEureka(save, bathNode).granted).toBeNull()
    const warmGrant = grantSessionNodeEureka(save, endingWarm)
    expect(warmGrant.granted).toBeNull()
    expect(warmGrant.save.current_session.eurekaPending).toBe(0)
    save = warmGrant.save

    const done = completeChapter(save, CHAPTER_ID, {}, {
      endingId: 'ending_warm',
      endings: ENDINGS,
    })
    expect(done.granted).toEqual({ eurekaCoin: 1 })
    expect(done.endingUnlock).toMatchObject({
      endingId: 'ending_warm',
      isNew: true,
      bonusEureka: 1,
      unlockedCount: 2,
    })
    expect(done.save.player.eurekaCoin).toBe(3)
    expect(done.save.progress.eureka_by_chapter[CHAPTER_ID]).toBe(3)
    expect(done.save.progress.unlockedEndings[CHAPTER_ID]).toEqual([
      'ending_cold',
      'ending_warm',
    ])
  })

  it('同節點不重複 pending', () => {
    let save = beginFreshSession()
    save = grantSessionNodeEureka(save, bathNode).save
    const again = grantSessionNodeEureka(save, bathNode)
    expect(again.granted).toBeNull()
    expect(again.save.current_session.eurekaPending).toBe(1)
  })
})
