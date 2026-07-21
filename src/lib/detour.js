/**
 * Wrong-answer hint + feedback generation.
 *
 * On wrong: keep the SAME question; companions give a hint; player retries
 * until correct. No similar-question detours.
 *
 * Layering (all graceful):
 *   1. generateHintAI()    — async, personality-driven, error-aware
 *   2. generateHint()      — sync templates / per-anchor detourVariants
 * AI failure always falls back to (2). Endings/history are never touched.
 */

import { requestAI } from './ai/client'
import { addressPlayer } from './persona'

function fill(text, ctx) {
  return String(text).replaceAll('{{playerName}}', ctx.playerName || '你')
}

const MAX_HINT_CHARS = 100

const KIND_SPEAKER = {
  too_small: 'Numi',
  too_big: 'NumNum',
  sign: 'NumNum',
  wrong_option: 'Numi',
  unclear: 'NumNum',
}

const KIND_TEMPLATES = {
  too_small: [
    '太小了！再往上推一點，別怕數字變大。',
    '這還不夠。把漏掉的那一段補上，再算一次。',
  ],
  too_big: [
    '太大了。深呼吸，看看哪一步多算進去了。',
    '數字爆掉了。把多餘的部分找出來，再試一次。',
  ],
  sign: [
    '大小差不多，方向反了。往上正、往下負，再對一次。',
  ],
  wrong_option: [
    '這個不對。回頭對一下條件，再挑一次。',
    '先排除明顯離譜的，剩下的再比一次。',
  ],
  unclear: [
    '先別急，把條件一步步列出來再填。',
    '慢一點，先確定問的是什麼，再算一次。',
  ],
}

function pickFrom(list, ctx) {
  const pick = list[Math.floor(Math.random() * list.length)]
  const lines = Array.isArray(pick) ? pick : [pick]
  return lines.map((line) => ({ ...line, text: fill(line.text, ctx) }))
}

function templateHint(script, ctx) {
  const kind = ctx.errorProfile?.kind
  if (kind && KIND_TEMPLATES[kind]) {
    const speaker = KIND_SPEAKER[kind] || 'NumNum'
    const variants = KIND_TEMPLATES[kind]
    const text = variants[Math.floor(Math.random() * variants.length)]
    return [{ speaker, text }]
  }

  const nodeLines = ctx.node?.detourVariants
  const pool = nodeLines?.length ? nodeLines : script.detourTemplates
  if (!pool?.length) return [{ speaker: 'NumNum', text: '再看一次，同一題慢慢來。' }]
  return pickFrom(pool, ctx)
}

/** Sync, always-succeeds fallback. */
export function generateHint(script, ctx = {}) {
  return templateHint(script, ctx)
}

/** @deprecated use generateHint */
export function generateDetour(script, ctx = {}) {
  return generateHint(script, ctx)
}

function sanitizeLine(text) {
  if (!text) return null
  const joined = String(text)
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 2)
    .join('')
  const stripped = joined
    .replace(/^["「『]+/, '')
    .replace(/["」』]+$/, '')
    .replace(/\s+/g, '')
    .trim()
  if (!stripped) return null
  if (stripped.length <= MAX_HINT_CHARS) return stripped

  const window = stripped.slice(0, MAX_HINT_CHARS)
  const cut = Math.max(
    window.lastIndexOf('。'),
    window.lastIndexOf('！'),
    window.lastIndexOf('？'),
    window.lastIndexOf('…'),
  )
  if (cut >= 12) return window.slice(0, cut + 1)
  return null
}

const PERSONA = {
  NumNum:
    '你是 NumNum，數感宇宙的夥伴，個性謹慎、愛秩序、重視正負號與步驟，語氣冷靜，稱呼玩家全名。',
  Numi:
    '你是 Numi，數感宇宙的夥伴，個性衝動、大咧咧、愛追黃金螺旋，語氣熱血親切，可用暱稱。',
}

/**
 * Async hint for retrying the same question. Never rejects.
 */
export async function generateHintAI(script, ctx = {}) {
  const kind = ctx.errorProfile?.kind || 'unclear'
  const speaker = KIND_SPEAKER[kind] || 'NumNum'

  const kindDesc = {
    too_small: '玩家算出的數字比正確答案小',
    too_big: '玩家算出的數字比正確答案大',
    sign: '玩家的數字大小對，但正負號相反',
    wrong_option: '玩家選錯了選項',
    unclear: '玩家的作答無法判讀',
  }[kind]

  const scene =
    ctx.node?.scene || ctx.sceneAdapt?.setting || script.setting || script.episode
  const mathematician = script.mathematician || '數學家'
  const stem = (ctx.questionText || '').slice(0, 120)
  const retry = ctx.retryCount || 1

  const system = [
    PERSONA[speaker],
    `你們正處於「${scene}」，與${mathematician}一起解題。`,
    '玩家答錯了，會繼續做同一題，直到答對。',
    '只用繁體中文寫 1～2 句完整提示，約 40～80 字，必須寫完整句。',
    '給方向性提示（哪裡可能算錯、該注意什麼），不可說出正確答案、不可直接給出算式結果。',
    '融入當下場景；不要出現「知識點」「選項」「類似題」「繞路」等系統詞。',
    '不要用「是A不是B」這類生硬對仗句。',
  ].join('')

  const user = [
    `玩家名字：${ctx.playerName || '旅人'}`,
    `場景：${scene}`,
    stem ? `題目大意：${stem}` : '',
    `狀況：${kindDesc}。`,
    `這是第 ${retry} 次答錯，請給更明確一點的提示（仍不可洩漏答案）。`,
    '請用你的口吻說 1～2 句，引導玩家再試同一題。',
  ]
    .filter(Boolean)
    .join('\n')

  const text = await requestAI({ system, user, maxTokens: 200, temperature: 0.85 })
  const line = sanitizeLine(text)
  if (!line) return generateHint(script, ctx)
  return [{ speaker, text: line }]
}

/** @deprecated use generateHintAI */
export async function generateDetourAI(script, ctx = {}) {
  return generateHintAI(script, ctx)
}

/** Prefer per-anchor success; else one short global line. */
export function pickCorrectFeedback(script, ctx = {}) {
  const node = ctx.node
  if (node?.successVariants?.length) return pickFrom(node.successVariants, ctx)

  const list = script.correctFeedback ?? []
  if (!list.length) return [{ speaker: 'narrator', text: '算清楚了。' }]
  return pickFrom(list, ctx)
}

export function getForceContinueFeedback(script, ctx = {}) {
  if (ctx.node?.forceContinueVariants?.length) {
    return ctx.node.forceContinueVariants.map((line) => ({
      ...line,
      text: fill(line.text, ctx),
    }))
  }
  return (script.forceContinueFeedback ?? []).map((line) => ({
    ...line,
    text: fill(line.text, ctx),
  }))
}

export { addressPlayer }
