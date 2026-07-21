export function fillPlayer(text, playerName) {
  return String(text ?? '').replaceAll('{{playerName}}', playerName || '旅人')
}

export function normalizeAnswer(input) {
  return String(input ?? '')
    .trim()
    .replace(/[０-９]/g, (d) =>
      String.fromCharCode(d.charCodeAt(0) - 0xff10 + 0x30),
    )
    .replace(/．/g, '.')
    .replace(/／/g, '/')
    .replace(/\s+/g, '')
}

export function checkAnswer(question, userInput) {
  if (!question) return false
  const expected = normalizeAnswer(question.answer)
  const got = normalizeAnswer(userInput)

  if (question.answerType === 'choice') {
    return got.toUpperCase() === expected.toUpperCase()
  }

  // number: allow leading + and simple fraction equality later; MVP string match
  const a = got.replace(/^\+/, '')
  const b = expected.replace(/^\+/, '')
  if (a === b) return true

  const na = Number(a)
  const nb = Number(b)
  if (!Number.isNaN(na) && !Number.isNaN(nb) && na === nb) return true

  return false
}

export function findNode(script, nodeId) {
  return script.nodes.find((n) => n.id === nodeId) ?? null
}

export function accuracyPercent(correctCount, attemptCount) {
  if (!attemptCount) return 0
  return Math.round((correctCount / attemptCount) * 1000) / 10
}

/**
 * Keep a line only if it has no whenChoice, or every key matches choiceHistory.
 * whenChoice: { choiceNodeId: optionId }
 */
export function lineMatchesChoices(line, choiceHistory = {}) {
  const cond = line?.whenChoice
  if (!cond || typeof cond !== 'object') return true
  return Object.entries(cond).every(
    ([choiceId, optionId]) => choiceHistory[choiceId] === optionId,
  )
}

export function filterLinesByChoices(lines, choiceHistory = {}) {
  return (lines || []).filter((l) => lineMatchesChoices(l, choiceHistory))
}
