import { QUESTION_BANK } from '../data/questions'

const DIFF_RANK = { 易: 0, 中: 1, 難: 2 }

/**
 * @param {object} pool
 * @param {{ excludeIds?: Set<number|string>, preferDifficulty?: string }} [opts]
 */
export function filterPool(pool, opts = {}) {
  const exclude = opts.excludeIds ?? new Set()
  const chapterNeedle = pool.chapterIncludes ?? ''
  const kp = pool.knowledgePoint
  const allowedIds = pool.questionIds?.length
    ? new Set(pool.questionIds)
    : null

  let hits = QUESTION_BANK.filter((q) => {
    if (exclude.has(q.id)) return false
    if (allowedIds && !allowedIds.has(q.id)) return false
    if (pool.grade != null && q.grade !== pool.grade) return false
    if (pool.half != null && q.half !== pool.half) return false
    if (chapterNeedle && !String(q.chapter).includes(chapterNeedle)) return false
    if (kp && q.knowledgePoint !== kp) return false
    return true
  })

  if (hits.length === 0 && kp) {
    hits = QUESTION_BANK.filter((q) => {
      if (exclude.has(q.id)) return false
      if (allowedIds && !allowedIds.has(q.id)) return false
      if (pool.grade != null && q.grade !== pool.grade) return false
      if (pool.half != null && q.half !== pool.half) return false
      if (chapterNeedle && !String(q.chapter).includes(chapterNeedle)) return false
      return true
    })
  }

  if (opts.preferDifficulty && hits.length > 1) {
    const target = DIFF_RANK[opts.preferDifficulty] ?? 1
    hits = [...hits].sort(
      (a, b) =>
        Math.abs((DIFF_RANK[a.difficulty] ?? 1) - target) -
        Math.abs((DIFF_RANK[b.difficulty] ?? 1) - target),
    )
    const best = Math.abs((DIFF_RANK[hits[0].difficulty] ?? 1) - target)
    hits = hits.filter(
      (q) => Math.abs((DIFF_RANK[q.difficulty] ?? 1) - target) === best,
    )
  }

  return hits
}

export function drawQuestion(pool, opts = {}) {
  const hits = filterPool(pool, opts)
  if (hits.length === 0) return null
  const i = Math.floor(Math.random() * hits.length)
  return hits[i]
}

export function drawSimilarQuestion(failedQuestion, pool, excludeIds) {
  const exclude = new Set(excludeIds)
  exclude.add(failedQuestion.id)

  const similarPool = {
    grade: pool.grade,
    half: pool.half,
    chapterIncludes: pool.chapterIncludes,
    knowledgePoint: failedQuestion.knowledgePoint || pool.knowledgePoint,
    questionIds: pool.questionIds,
  }

  let q = drawQuestion(similarPool, {
    excludeIds: exclude,
    preferDifficulty: failedQuestion.difficulty,
  })

  if (!q) {
    q = drawQuestion(
      {
        grade: pool.grade,
        half: pool.half,
        chapterIncludes: pool.chapterIncludes,
        questionIds: pool.questionIds,
      },
      { excludeIds: exclude, preferDifficulty: failedQuestion.difficulty },
    )
  }

  return q
}
