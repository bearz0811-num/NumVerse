/**
 * Feature 3: personalized ending journal.
 *
 * Turns the player's answer trail into a 100~150 char, second-person diary
 * shown after the fixed historical ending and before the raw stats.
 * AI-first with a deterministic template fallback. Never invents math content
 * and never alters the historical ending.
 */

import { requestAI } from './ai/client'

export function summarizeTrail(trail = []) {
  const firstTry = []
  const detoured = []
  const failed = []
  const stuck = new Map()

  for (const t of trail) {
    const retries = t.retries ?? t.detours ?? 0
    if (t.passed && t.firstTry) firstTry.push(t.scene)
    else if (t.passed && retries > 0) detoured.push(t.scene)
    if (!t.passed) failed.push(t.scene)
    if (retries > 0 || !t.passed) {
      const key = t.knowledgePoint || t.scene
      if (key) stuck.set(key, (stuck.get(key) || 0) + retries + (t.passed ? 0 : 1))
    }
  }

  let mostStuck = null
  let max = 0
  for (const [key, n] of stuck) {
    if (n > max) {
      max = n
      mostStuck = key
    }
  }

  return { firstTry, detoured, failed, mostStuck }
}

export function composeJournalTemplate(ctx) {
  const { playerName, summary, script = {} } = ctx
  const name = playerName || '旅人'
  const mathematician = script.mathematician || '那位數學家'
  const place = script.journalTitle || script.setting || script.episode || '冒險'
  const ending =
    script.endingSummary ||
    `${mathematician}留下的思考，越過時代繼續往前`
  const parts = []

  if (summary.firstTry.length) {
    parts.push(`你在「${summary.firstTry[0]}」一次就算準，讓${mathematician}抬起了眼`)
  } else {
    parts.push('你一路跌撞，卻沒有一次真的放棄')
  }

  if (summary.detoured.length) {
    parts.push(`在「${summary.detoured[0]}」想了又想，才把數字想通`)
  }
  if (summary.failed.length) {
    parts.push(`「${summary.failed[0]}」的結還沒解開，你記在了心裡`)
  }

  const body = parts.join('；')
  return `【${name}的${place}日誌】\n${body}。最後，你和 NumNum、Numi 陪${mathematician}走完這段路；${ending}。`
}

export async function generateEndingJournalAI(ctx) {
  const { playerName, summary, correctCount, attemptCount, script = {} } = ctx
  const mathematician = script.mathematician || '數學家'
  const episode = script.episode || '這段冒險'
  const ending = script.endingSummary || '忠於劇本提供的固定史實結局'
  const journalTitle = script.journalTitle || episode

  const system = [
    '你是旁白，為玩家寫一段專屬的冒險日誌。',
    '繁體中文，第二人稱「你」，100~150 字，溫暖略帶史詩感。',
    `同行的數學家是${mathematician}，劇本是「${episode}」。`,
    `忠於固定史實結局：${ending}。克制、點到為止，不血腥。`,
    '不得杜撰數學題目內容，只根據提供的場景與表現書寫。',
    `開頭用「【玩家名的${journalTitle}日誌】」當標題。`,
  ].join('')

  const user = [
    `玩家名字：${playerName || '旅人'}`,
    `答對 ${correctCount} / 作答 ${attemptCount} 題。`,
    summary.firstTry.length
      ? `一次答對的場景：${summary.firstTry.join('、')}`
      : '幾乎沒有一次就答對的場景。',
    summary.detoured.length ? `重試後才通的場景：${summary.detoured.join('、')}` : '',
    summary.failed.length ? `最後沒通過的場景：${summary.failed.join('、')}` : '',
    summary.mostStuck ? `最常卡住的地方：${summary.mostStuck}` : '',
    '請寫出這段日誌。',
  ]
    .filter(Boolean)
    .join('\n')

  const text = await requestAI({
    system,
    user,
    maxTokens: 320,
    temperature: 0.85,
    timeoutMs: 6000,
  })

  const cleaned = text?.trim()
  if (cleaned && cleaned.length >= 60 && cleaned.length <= 260) return cleaned
  return composeJournalTemplate(ctx)
}
