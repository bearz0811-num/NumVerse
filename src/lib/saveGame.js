const LEGACY_SAVE_KEY = 'numip-rpg-save-v1'
const SAVE_PREFIX = 'numip-rpg-save-v2:'
const INDEX_KEY = 'numip-rpg-save-index-v2'

function saveKey(scriptId) {
  return `${SAVE_PREFIX}${scriptId}`
}

function readIndex() {
  try {
    return JSON.parse(localStorage.getItem(INDEX_KEY) || '[]')
  } catch {
    return []
  }
}

function writeIndex(ids) {
  localStorage.setItem(INDEX_KEY, JSON.stringify([...new Set(ids)]))
}

function migrateLegacySave() {
  try {
    const raw = localStorage.getItem(LEGACY_SAVE_KEY)
    if (!raw) return null
    const legacy = JSON.parse(raw)
    if (!legacy?.scriptId) return null
    localStorage.setItem(saveKey(legacy.scriptId), JSON.stringify(legacy))
    writeIndex([...readIndex(), legacy.scriptId])
    localStorage.removeItem(LEGACY_SAVE_KEY)
    return legacy
  } catch {
    return null
  }
}

export function loadSave(scriptId = null) {
  migrateLegacySave()
  try {
    if (scriptId) {
      const raw = localStorage.getItem(saveKey(scriptId))
      return raw ? JSON.parse(raw) : null
    }

    const saves = readIndex()
      .map((id) => localStorage.getItem(saveKey(id)))
      .filter(Boolean)
      .map((raw) => JSON.parse(raw))
    return saves.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))[0] || null
  } catch {
    return null
  }
}

export function loadAllSaves() {
  migrateLegacySave()
  return Object.fromEntries(
    readIndex()
      .map((id) => [id, loadSave(id)])
      .filter(([, save]) => Boolean(save)),
  )
}

export function saveGame(state) {
  const payload = {
    version: 1,
    scriptId: state.scriptId,
    playerName: state.playerName,
    nodeId: state.nodeId,
    pageIndex: state.pageIndex,
    usedQuestionIds: state.usedQuestionIds,
    correctCount: state.correctCount,
    attemptCount: state.attemptCount,
    trail: state.trail,
    quiz: state.quiz,
    choiceHistory: state.choiceHistory ?? {},
    objective: state.objective ?? null,
    updatedAt: Date.now(),
  }
  localStorage.setItem(saveKey(payload.scriptId), JSON.stringify(payload))
  writeIndex([...readIndex(), payload.scriptId])
  return payload
}

export function clearSave(scriptId = null) {
  if (!scriptId) {
    for (const id of readIndex()) localStorage.removeItem(saveKey(id))
    localStorage.removeItem(INDEX_KEY)
    localStorage.removeItem(LEGACY_SAVE_KEY)
    return
  }
  localStorage.removeItem(saveKey(scriptId))
  writeIndex(readIndex().filter((id) => id !== scriptId))
}

export function hasSaveFor(scriptId) {
  return Boolean(loadSave(scriptId))
}
