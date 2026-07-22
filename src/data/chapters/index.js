import { ERAS, MATHEMATICIANS } from '../../lib/numverse/constants'
import { archimedesPrime } from './archimedesPrime'
import { archimedesYouth } from './archimedesYouth'

/** Playable chapter content. */
export const chaptersById = {
  ARCHIMEDES_YOUTH: archimedesYouth,
  ARCHIMEDES_PRIME: archimedesPrime,
}

/** All 15 chapter ids in mathematician × era order. */
export const allChapterIds = MATHEMATICIANS.flatMap((m) =>
  ERAS.map((era) => m.chapters[era]),
)

export function getChapter(chapterId) {
  return chaptersById[chapterId] || null
}

/**
 * After completing a chapter, unlock the next era for same mathematician if any.
 */
export function nextUnlockFor(chapterId) {
  const chapter = getChapter(chapterId)
  return chapter?.nextChapterId || null
}

export function isChapterPlayable(chapterId) {
  return Boolean(chaptersById[chapterId]?.nodes?.length)
}
