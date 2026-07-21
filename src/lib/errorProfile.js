import { normalizeAnswer } from './rpgUtils'

/**
 * Classify a wrong answer so downstream feedback (template or AI) can react to
 * *how* the player was wrong, not just that they were wrong.
 *
 * kinds:
 *   too_big      numeric guess larger than the answer
 *   too_small    numeric guess smaller than the answer
 *   sign         right magnitude, wrong +/- sign
 *   wrong_option choice question, picked a different letter
 *   unclear      unparseable / non-comparable input
 *
 * @param {object} question
 * @param {string} raw player's raw input
 * @returns {{ kind: string, expected: string, got: string, expectedNum: number|null, gotNum: number|null }}
 */
export function classifyError(question, raw) {
  const expected = normalizeAnswer(question?.answer)
  const got = normalizeAnswer(raw)

  if (question?.answerType === 'choice') {
    return {
      kind: 'wrong_option',
      expected,
      got: got.toUpperCase(),
      expectedNum: null,
      gotNum: null,
    }
  }

  const expectedNum = toNumber(expected)
  const gotNum = toNumber(got)

  if (expectedNum === null || gotNum === null) {
    return { kind: 'unclear', expected, got, expectedNum, gotNum }
  }

  if (gotNum === expectedNum) {
    // Not actually wrong numerically (e.g. format mismatch upstream).
    return { kind: 'unclear', expected, got, expectedNum, gotNum }
  }

  if (
    Math.abs(gotNum) === Math.abs(expectedNum) &&
    Math.sign(gotNum) !== Math.sign(expectedNum)
  ) {
    return { kind: 'sign', expected, got, expectedNum, gotNum }
  }

  return {
    kind: gotNum > expectedNum ? 'too_big' : 'too_small',
    expected,
    got,
    expectedNum,
    gotNum,
  }
}

function toNumber(value) {
  const cleaned = String(value ?? '').replace(/^\+/, '')
  const fraction = cleaned.match(/^(-?\d+)\/(\d+)$/)
  if (fraction) {
    const denom = Number(fraction[2])
    if (denom !== 0) return Number(fraction[1]) / denom
  }
  const n = Number(cleaned)
  return Number.isNaN(n) ? null : n
}
