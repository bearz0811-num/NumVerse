import {
  EMPTY_FLAGS,
  INSIGHT_MAX,
  SANITY_MAX,
  SAVE_KEY,
  SAVE_VERSION,
} from './constants'

export function createDefaultSave() {
  return {
    user_id: 'LOCAL_GUEST_2026',
    meta: {
      version: SAVE_VERSION,
      last_updated: new Date().toISOString(),
      language: 'zh-TW',
    },
    player: {
      eurekaCoin: 0,
    },
    progress: {
      unlocked_chapters: ['ARCHIMEDES_YOUTH'],
      completed_chapters: [],
      practice_unlocked: [],
      claimed_rewards: [],
      eureka_by_chapter: {},
      unlockedEndings: {},
      lastEndingId: {},
    },
    current_session: null,
    philosophy_flags: { ...EMPTY_FLAGS },
  }
}

export function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return createDefaultSave()
    const data = JSON.parse(raw)
    const base = createDefaultSave()
    return {
      ...base,
      ...data,
      meta: { ...base.meta, ...data.meta },
      player: {
        ...base.player,
        ...(data.player || {}),
        eurekaCoin: Number(data.player?.eurekaCoin ?? data.eurekaCoin ?? 0) || 0,
      },
      progress: {
        ...base.progress,
        ...data.progress,
        claimed_rewards: Array.isArray(data.progress?.claimed_rewards)
          ? data.progress.claimed_rewards
          : [],
        eureka_by_chapter:
          data.progress?.eureka_by_chapter &&
          typeof data.progress.eureka_by_chapter === 'object'
            ? data.progress.eureka_by_chapter
            : {},
        unlockedEndings:
          data.progress?.unlockedEndings &&
          typeof data.progress.unlockedEndings === 'object'
            ? data.progress.unlockedEndings
            : {},
        lastEndingId:
          data.progress?.lastEndingId &&
          typeof data.progress.lastEndingId === 'object'
            ? data.progress.lastEndingId
            : {},
      },
      philosophy_flags: {
        ...EMPTY_FLAGS,
        ...data.philosophy_flags,
      },
    }
  } catch {
    return createDefaultSave()
  }
}

export function persistSave(save) {
  const next = {
    ...save,
    meta: {
      ...save.meta,
      version: SAVE_VERSION,
      last_updated: new Date().toISOString(),
      language: 'zh-TW',
    },
  }
  localStorage.setItem(SAVE_KEY, JSON.stringify(next))
  return next
}

export function startChapterSession(save, chapterId, chapterRewardOf) {
  const base = syncEurekaToCompleted(save, chapterRewardOf)
  return persistSave({
    ...base,
    current_session: {
      chapter_id: chapterId,
      checkpoint_id: 'CHECKPOINT_START',
      node_id: null,
      sanity: SANITY_MAX,
      insight: INSIGHT_MAX,
      story: {},
      eurekaPending: 0,
      eurekaClaimed: [],
      skipNarrative: false,
      snapshot: {
        checkpoint_id: 'CHECKPOINT_START',
        node_id: null,
        sanity: SANITY_MAX,
        insight: INSIGHT_MAX,
        story: {},
      },
    },
  })
}

export function writeCheckpoint(save, { checkpointId, nodeId, sanity, insight, story }) {
  if (!save.current_session) return save
  const storyState = story ?? save.current_session.story ?? {}
  const session = {
    ...save.current_session,
    checkpoint_id: checkpointId,
    node_id: nodeId,
    sanity,
    insight,
    story: storyState,
    snapshot: {
      checkpoint_id: checkpointId,
      node_id: nodeId,
      sanity,
      insight,
      story: { ...storyState },
    },
  }
  return persistSave({ ...save, current_session: session })
}

export function updateSession(save, patch) {
  if (!save.current_session) return save
  return persistSave({
    ...save,
    current_session: { ...save.current_session, ...patch },
  })
}

export function restoreCheckpoint(save) {
  const snap = save.current_session?.snapshot
  if (!snap) return save
  return persistSave({
    ...save,
    current_session: {
      ...save.current_session,
      checkpoint_id: snap.checkpoint_id,
      node_id: snap.node_id,
      sanity: snap.sanity,
      insight: snap.insight,
      story: { ...(snap.story || {}) },
    },
  })
}

export function patchStory(save, patch) {
  if (!save.current_session) return save
  return updateSession(save, {
    story: { ...(save.current_session.story || {}), ...patch },
  })
}

export function applyFlags(save, deltas) {
  const flags = { ...save.philosophy_flags }
  for (const [key, delta] of Object.entries(deltas || {})) {
    if (key in flags) flags[key] = (flags[key] || 0) + delta
  }
  return persistSave({ ...save, philosophy_flags: flags })
}

/**
 * 通關結算：入帳 pending、解鎖結局成就。
 * @returns {{
 *   save: object,
 *   granted: { eurekaCoin?: number } | null,
 *   endingUnlock: null | {
 *     endingId: string,
 *     isNew: boolean,
 *     title?: string,
 *     badgeIcon?: string,
 *     unlockedCount: number,
 *     totalEndings: number,
 *     bonusEureka: number,
 *   }
 * }}
 */
export function completeChapter(
  save,
  chapterId,
  rewards = {},
  { endingId = null, endings = [] } = {},
) {
  const completed = new Set(save.progress.completed_chapters)
  completed.add(chapterId)
  const practice = new Set(save.progress.practice_unlocked)
  practice.add(chapterId)

  const pending = Number(save.current_session?.eurekaPending) || 0
  const fallback = Number(rewards?.eurekaCoin) || 0
  const clearAmount = pending > 0 ? pending : fallback
  const claimKey = `chapter:${chapterId}`
  const claimed = new Set(save.progress?.claimed_rewards || [])
  const byChapter = { ...(save.progress?.eureka_by_chapter || {}) }
  const unlockedEndings = { ...(save.progress?.unlockedEndings || {}) }
  const lastEndingId = { ...(save.progress?.lastEndingId || {}) }
  let eurekaCoin = Number(save.player?.eurekaCoin) || 0
  let grantedTotal = 0

  const alreadyCleared = claimed.has(claimKey)
  if (clearAmount > 0 && !alreadyCleared) {
    claimed.add(claimKey)
    byChapter[chapterId] = (Number(byChapter[chapterId]) || 0) + clearAmount
    eurekaCoin += clearAmount
    grantedTotal += clearAmount
  }

  let endingUnlock = null
  if (endingId) {
    lastEndingId[chapterId] = endingId
    const list = [...(unlockedEndings[chapterId] || [])]
    const isNew = !list.includes(endingId)
    const endingDef = endings.find((e) => e.id === endingId)
    let bonusEureka = 0
    if (isNew) {
      list.push(endingId)
      unlockedEndings[chapterId] = list
      // 重玩解鎖新結局：章級 clear 已領過，補發該結局的 Eureka
      if (alreadyCleared) {
        bonusEureka = Number(endingDef?.eurekaReward) || 1
        eurekaCoin += bonusEureka
        byChapter[chapterId] = (Number(byChapter[chapterId]) || 0) + bonusEureka
        grantedTotal += bonusEureka
      }
    }
    endingUnlock = {
      endingId,
      isNew,
      title: endingDef?.title,
      badgeIcon: endingDef?.badgeIcon,
      unlockedCount: (unlockedEndings[chapterId] || list).length,
      totalEndings: endings.length || list.length,
      bonusEureka,
    }
  }

  const next = persistSave({
    ...save,
    player: {
      ...(save.player || {}),
      eurekaCoin,
    },
    progress: {
      ...save.progress,
      completed_chapters: [...completed],
      practice_unlocked: [...practice],
      claimed_rewards: [...claimed],
      eureka_by_chapter: byChapter,
      unlockedEndings,
      lastEndingId,
    },
    current_session: null,
  })
  return {
    save: next,
    granted: grantedTotal > 0 ? { eurekaCoin: grantedTotal } : null,
    endingUnlock,
  }
}

export function unlockChapter(save, chapterId) {
  const unlocked = new Set(save.progress.unlocked_chapters)
  unlocked.add(chapterId)
  return persistSave({
    ...save,
    progress: {
      ...save.progress,
      unlocked_chapters: [...unlocked],
    },
  })
}

export function clearSession(save, chapterRewardOf) {
  const base = chapterRewardOf ? syncEurekaToCompleted(save, chapterRewardOf) : save
  return persistSave({ ...base, current_session: null })
}

/**
 * 章內頓悟：先加進 session.eurekaPending（畫面可顯示／toast）。
 * 真正入帳要等 completeChapter；中止會丟掉 pending。
 *
 * 重玩防假加總（方案 B）：
 * - 章已通關／已 chapter: 入帳 → 章內頓悟不再 pending
 * - 結局已在 unlockedEndings → 不發
 * - 章已入帳但碰到「尚未解鎖的新結局」→ 不進 pending（由 completeChapter bonusEureka 補發）
 */
export function grantSessionNodeEureka(save, node) {
  const amount = Number(node?.rewards?.eurekaCoin) || 0
  if (!save.current_session || !node?.id || amount <= 0) {
    return { save, granted: null }
  }

  const chapterId = save.current_session.chapter_id
  const claimedRewards = new Set(save.progress?.claimed_rewards || [])
  const completed = new Set(save.progress?.completed_chapters || [])
  const chapterSettled =
    claimedRewards.has(`chapter:${chapterId}`) || completed.has(chapterId)

  if (node.type === 'ending') {
    const unlocked = save.progress?.unlockedEndings?.[chapterId] || []
    if (unlocked.includes(node.id)) {
      return { save, granted: null }
    }
    if (chapterSettled) {
      return { save, granted: null }
    }
  } else if (chapterSettled) {
    return { save, granted: null }
  }

  const claimed = new Set(save.current_session.eurekaClaimed || [])
  if (claimed.has(node.id)) {
    return { save, granted: null }
  }
  claimed.add(node.id)
  const next = updateSession(save, {
    eurekaPending: (Number(save.current_session.eurekaPending) || 0) + amount,
    eurekaClaimed: [...claimed],
  })
  return { save: next, granted: { eurekaCoin: amount } }
}

/**
 * 永久庫依「已通關章」的實際入帳紀錄重算。
 * 未通關的 pending 不在這裡；中止／重玩只會丟掉 session。
 */
export function syncEurekaToCompleted(save, chapterRewardOf) {
  const completed = save.progress?.completed_chapters || []
  const byChapter = { ...(save.progress?.eureka_by_chapter || {}) }
  const claimed = []
  let total = 0
  for (const id of completed) {
    const stored = Number(byChapter[id]) || 0
    const fallback = Number(chapterRewardOf?.(id)) || 0
    const amount = stored > 0 ? stored : fallback
    if (amount <= 0) continue
    byChapter[id] = amount
    claimed.push(`chapter:${id}`)
    total += amount
  }
  // 丟掉未通關章的暫存紀錄
  for (const key of Object.keys(byChapter)) {
    if (!completed.includes(key)) delete byChapter[key]
  }
  return {
    ...save,
    player: {
      ...(save.player || {}),
      eurekaCoin: total,
    },
    progress: {
      ...save.progress,
      claimed_rewards: claimed,
      eureka_by_chapter: byChapter,
    },
  }
}
