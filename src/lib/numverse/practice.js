import bank from '../../data/questionBank.json'
import { gradesForBand } from './constants'

/**
 * Draw a random question for a grade band (1=國一, 2=國二, 3=國三).
 * Avoids ids in `used`.
 */
export function drawPracticeQuestion(gradeBand, used = []) {
  const pairs = gradesForBand(gradeBand)
  const pool = bank.questions.filter((q) =>
    pairs.some((p) => q.grade === p.grade && q.half === p.half),
  )
  const fresh = pool.filter((q) => !used.includes(q.id))
  const source = fresh.length ? fresh : pool
  if (!source.length) return null
  return source[Math.floor(Math.random() * source.length)]
}

export function checkBankAnswer(question, raw) {
  if (!question) return false
  const value = String(raw ?? '')
    .trim()
    .toUpperCase()
  if (question.answerType === 'choice' || question.options?.length) {
    const correct = String(question.answer ?? question.correctAnswer ?? '')
      .trim()
      .toUpperCase()
    return value === correct
  }
  const correct = String(question.answer ?? question.correctAnswer ?? '').trim()
  const norm = (s) =>
    String(s)
      .replace(/\s+/g, '')
      .replace(/^\+/, '')
  return norm(value) === norm(correct)
}
