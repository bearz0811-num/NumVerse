import { useMemo } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

/**
 * Match inline TeX islands mixed into Chinese prose.
 * Longer / more specific patterns first.
 */
const MATH_PATTERN = new RegExp(
  [
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

function renderKatex(tex) {
  try {
    return katex.renderToString(tex, {
      throwOnError: false,
      displayMode: false,
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
  const parts = []
  let last = 0
  MATH_PATTERN.lastIndex = 0

  for (const match of src.matchAll(MATH_PATTERN)) {
    const start = match.index ?? 0
    if (start > last) {
      parts.push({ type: 'text', value: src.slice(last, start) })
    }
    parts.push({ type: 'math', value: match[0].trim() })
    last = start + match[0].length
  }

  if (last < src.length) {
    parts.push({ type: 'text', value: src.slice(last) })
  }

  // Merge adjacent math pieces separated only by spaces (e.g. 98 \times 65)
  const merged = []
  for (let i = 0; i < parts.length; i++) {
    const cur = parts[i]
    if (
      cur.type === 'math' &&
      merged.length >= 2 &&
      merged[merged.length - 1].type === 'text' &&
      /^\s+$/.test(merged[merged.length - 1].value) &&
      merged[merged.length - 2].type === 'math'
    ) {
      const gap = merged.pop()
      const prev = merged.pop()
      merged.push({
        type: 'math',
        value: `${prev.value}${gap.value}${cur.value}`,
      })
    } else if (
      cur.type === 'text' &&
      merged.length &&
      merged[merged.length - 1].type === 'math' &&
      // attach trailing plain digits/idents tightly used as operands after command? skip
      false
    ) {
      merged.push(cur)
    } else {
      merged.push(cur)
    }
  }

  // Also pull surrounding number operands into math: "98 \times 65"
  const withOperands = []
  for (let i = 0; i < merged.length; i++) {
    let part = merged[i]
    if (part.type !== 'math') {
      withOperands.push(part)
      continue
    }

    let tex = part.value
    // left operand from previous text
    if (withOperands.length && withOperands[withOperands.length - 1].type === 'text') {
      const prev = withOperands[withOperands.length - 1]
      const m = prev.value.match(/(.*?)([+\-]?\d+(?:\.\d+)?|(?:\([^)]+\)))\s*$/)
      if (m && /\\(?:times|div|pm|cdot|leq|geq|neq|approx)/.test(tex)) {
        withOperands[withOperands.length - 1] = {
          type: 'text',
          value: m[1],
        }
        if (!withOperands[withOperands.length - 1].value) withOperands.pop()
        tex = `${m[2]} ${tex}`
      }
    }
    // right operand from next text
    if (i + 1 < merged.length && merged[i + 1].type === 'text') {
      const next = merged[i + 1]
      const m = next.value.match(/^\s*([+\-]?\d+(?:\.\d+)?|(?:\([^)]+\)))(.*)$/)
      if (m && /\\(?:times|div|pm|cdot|leq|geq|neq|approx)|^.+\s\\(?:times|div)/.test(tex)) {
        tex = `${tex} ${m[1]}`
        merged[i + 1] = { type: 'text', value: m[2] }
      }
    }

    withOperands.push({ type: 'math', value: tex })
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
        const html = renderKatex(part.value)
        if (!html) return <span key={i}>{part.value}</span>
        return (
          <span
            key={i}
            className="math-inline"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )
      })}
    </span>
  )
}
