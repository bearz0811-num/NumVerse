import { useMemo } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

/**
 * Match inline TeX islands mixed into Chinese prose.
 * Longer / more specific patterns first.
 */
const MATH_PATTERN = new RegExp(
  [
    String.raw`\\dfrac\{[^{}]+\}\{[^{}]+\}`,
    String.raw`\\tfrac\{[^{}]+\}\{[^{}]+\}`,
    String.raw`\\frac\{[^{}]+\}\{[^{}]+\}`,
    String.raw`\\sqrt\{[^{}]+\}`,
    String.raw`\\overparen\{[^{}]+\}`,
    String.raw`\\overline\{[^{}]+\}`,
    String.raw`\\widehat\{[^{}]+\}`,
    String.raw`\\text\{[^{}]*\}`,
    String.raw`\\triangle\s*[A-Za-z]{0,6}`,
    String.raw`\\angle\s*[A-Za-z]{0,6}`,
    String.raw`\\(?:times|div|pm|leq|geq|neq|cdot|approx|infty|pi)\b`,
    // 120^{\circ}, x^{2}, 9^3, 40^\circ, 2^5
    String.raw`[A-Za-z0-9]+(?:_\{[^{}]+\})?(?:\^\{[^{}]+\}|\^\\circ|\^[A-Za-z0-9]+)`,
    String.raw`\^\{\\circ\}`,
    String.raw`\^\\circ`,
    String.raw`\\circ`,
    String.raw`\\[a-zA-Z]+`,
  ].join('|'),
  'g',
)

const ENV_BLOCK =
  /\\begin\{([a-zA-Z*]+)\}([\s\S]*?)\\end\{\1\}/g

/** Fix mistaken single "\ " linebreaks inside cases/matrix (should be \\). */
function normalizeEnvTex(tex) {
  return tex.replace(
    /\\begin\{(cases|matrix|pmatrix|bmatrix|vmatrix|array)\}([\s\S]*?)\\end\{\1\}/g,
    (full, name, body) => {
      // turn "\ " (one backslash + space) into "\\" when it separates rows
      const fixedBody = body.replace(/([^\\])\\ (?=\S)/g, '$1\\\\ ')
      return `\\begin{${name}}${fixedBody}\\end{${name}}`
    },
  )
}

function renderKatex(tex, displayMode = false) {
  try {
    return katex.renderToString(normalizeEnvTex(tex), {
      throwOnError: false,
      displayMode,
      strict: 'ignore',
      output: 'html',
    })
  } catch {
    return null
  }
}

function tokenize(text) {
  if (!text) return []
  const src = String(text)

  // 0) Pull $...$ inline math first
  const dollarSplit = []
  {
    let last = 0
    const re = /\$([^$\n]+)\$/g
    for (const match of src.matchAll(re)) {
      const start = match.index ?? 0
      if (start > last) {
        dollarSplit.push({ type: 'raw', value: src.slice(last, start) })
      }
      dollarSplit.push({ type: 'math', value: match[1].trim(), display: false })
      last = start + match[0].length
    }
    if (last < src.length) {
      dollarSplit.push({ type: 'raw', value: src.slice(last) })
    }
    if (!dollarSplit.length) {
      dollarSplit.push({ type: 'raw', value: src })
    }
  }

  const parts = []
  for (const piece of dollarSplit) {
    if (piece.type === 'math') {
      parts.push(piece)
      continue
    }

    const chunkSrc = piece.value
    // 1) Pull out full \begin...\end environments first (must not be shredded)
    const envSpans = []
    ENV_BLOCK.lastIndex = 0
    for (const match of chunkSrc.matchAll(ENV_BLOCK)) {
      envSpans.push({
        start: match.index ?? 0,
        end: (match.index ?? 0) + match[0].length,
        value: match[0],
      })
    }

    const segments = []
    let cursor = 0
    for (const env of envSpans) {
      if (env.start > cursor) {
        segments.push({ type: 'chunk', value: chunkSrc.slice(cursor, env.start) })
      }
      segments.push({ type: 'env', value: env.value })
      cursor = env.end
    }
    if (cursor < chunkSrc.length) {
      segments.push({ type: 'chunk', value: chunkSrc.slice(cursor) })
    }

    // 2) Tokenize remaining prose chunks with inline math pattern
    for (const seg of segments) {
      if (seg.type === 'env') {
        parts.push({ type: 'math', value: seg.value, display: false })
        continue
      }

      const chunk = seg.value
      let last = 0
      MATH_PATTERN.lastIndex = 0
      for (const match of chunk.matchAll(MATH_PATTERN)) {
        const start = match.index ?? 0
        if (start > last) {
          parts.push({ type: 'text', value: chunk.slice(last, start) })
        }
        parts.push({ type: 'math', value: match[0].trim(), display: false })
        last = start + match[0].length
      }
      if (last < chunk.length) {
        parts.push({ type: 'text', value: chunk.slice(last) })
      }
    }
  }

  // 3) Merge adjacent math pieces separated only by spaces (e.g. 98 \times 65)
  const merged = []
  for (let i = 0; i < parts.length; i++) {
    const cur = parts[i]
    if (
      cur.type === 'math' &&
      !cur.display &&
      merged.length >= 2 &&
      merged[merged.length - 1].type === 'text' &&
      /^\s+$/.test(merged[merged.length - 1].value) &&
      merged[merged.length - 2].type === 'math' &&
      !merged[merged.length - 2].display
    ) {
      const gap = merged.pop()
      const prev = merged.pop()
      merged.push({
        type: 'math',
        display: false,
        value: `${prev.value}${gap.value}${cur.value}`,
      })
    } else {
      merged.push(cur)
    }
  }

  // 4) Pull surrounding number operands into math: "98 \times 65"
  const withOperands = []
  for (let i = 0; i < merged.length; i++) {
    const part = merged[i]
    if (part.type !== 'math' || part.display) {
      withOperands.push(part)
      continue
    }

    let tex = part.value
    if (withOperands.length && withOperands[withOperands.length - 1].type === 'text') {
      const prev = withOperands[withOperands.length - 1]
      const m = prev.value.match(/(.*?)([+-]?\d+(?:\.\d+)?|(?:\([^)]+\)))\s*$/)
      if (m && /\\(?:times|div|pm|cdot|leq|geq|neq|approx)/.test(tex)) {
        withOperands[withOperands.length - 1] = { type: 'text', value: m[1] }
        if (!withOperands[withOperands.length - 1].value) withOperands.pop()
        tex = `${m[2]} ${tex}`
      }
    }
    if (i + 1 < merged.length && merged[i + 1].type === 'text') {
      const next = merged[i + 1]
      const m = next.value.match(/^\s*([+-]?\d+(?:\.\d+)?|(?:\([^)]+\)))(.*)$/)
      if (m && /\\(?:times|div|pm|cdot|leq|geq|neq|approx)/.test(tex)) {
        tex = `${tex} ${m[1]}`
        merged[i + 1] = { type: 'text', value: m[2] }
      }
    }

    withOperands.push({ type: 'math', display: false, value: tex })
  }

  return withOperands.filter((p) => p.value !== '')
}

export default function MathText({ text, className = '' }) {
  const parts = useMemo(() => tokenize(text), [text])

  return (
    <span className={`math-text ${className}`.trim()}>
      {parts.map((part, i) => {
        if (part.type === 'text') {
          return <span key={i}>{part.value}</span>
        }
        const html = renderKatex(part.value, Boolean(part.display))
        if (!html) return <span key={i}>{part.value}</span>
        return (
          <span
            key={i}
            className={part.display ? 'math-display' : 'math-inline'}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )
      })}
    </span>
  )
}

/** 整段算式（題目 math 欄）用 display 模式一次渲染，避免被拆爛 */
export function MathBlock({ tex, className = '' }) {
  const html = useMemo(() => renderKatex(String(tex || ''), true), [tex])
  if (!tex) return null
  if (!html) {
    return <div className={`nv-math-fallback ${className}`.trim()}>{tex}</div>
  }
  return (
    <div
      className={`math-block ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
