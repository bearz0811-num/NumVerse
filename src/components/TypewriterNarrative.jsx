import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import MathText from './MathText.jsx'

const HISTORY_MAX = 2
const TYPE_MS = 36

function speakerPrefix(speaker) {
  if (speaker === 'narrator') return '>'
  if (speaker === 'SYS') return '> 系統:'
  return `> ${speaker}:`
}

/** 一般字元逐字；`$...$` 整段當一個單位，避免打字中露出半截 TeX。 */
function splitTypeUnits(text) {
  const src = String(text || '')
  const units = []
  let last = 0
  const re = /\$([^$\n]+)\$/g
  for (const match of src.matchAll(re)) {
    const start = match.index ?? 0
    if (start > last) {
      units.push(...Array.from(src.slice(last, start)))
    }
    units.push(match[0])
    last = start + match[0].length
  }
  if (last < src.length) {
    units.push(...Array.from(src.slice(last)))
  }
  return units
}

/**
 * 打字機敘事（狀態自管）：
 * - 逐字出現
 * - 未完成：繼續＝顯示完整
 * - 已完成：繼續＝下一句
 */
const TypewriterNarrative = forwardRef(function TypewriterNarrative(
  {
    lineKey,
    history,
    line,
    hasMore,
    canGoPrev,
    onAdvance,
    onPrev,
    onBuffGranted,
  },
  ref,
) {
  const text = line?.text || ''
  const units = useMemo(() => splitTypeUnits(text), [text])
  const [shown, setShown] = useState(0)
  const done = shown >= units.length
  const partial = units.slice(0, shown).join('')
  const shownRef = useRef(shown)
  const lenRef = useRef(units.length)
  const onAdvanceRef = useRef(onAdvance)
  const grantedKeyRef = useRef(null)
  shownRef.current = shown
  lenRef.current = units.length
  onAdvanceRef.current = onAdvance

  useEffect(() => {
    setShown(0)
    grantedKeyRef.current = null
  }, [lineKey])

  useEffect(() => {
    if (!line) return
    if (shown >= units.length) return
    const t = window.setTimeout(() => {
      setShown((n) => n + 1)
    }, TYPE_MS)
    return () => window.clearTimeout(t)
  }, [line, shown, units.length, lineKey])

  // 整句顯示完畢，且含「獲得狀態」→ 立刻寫入狀態列
  useEffect(() => {
    if (!done || !line) return
    const m = String(line.text || '').match(/獲得狀態[：:]\s*([^）)\n]+)/)
    if (!m) return
    const key = `${lineKey}:${m[1].trim()}`
    if (grantedKeyRef.current === key) return
    grantedKeyRef.current = key
    onBuffGranted?.(m[1].trim())
  }, [done, line, lineKey, onBuffGranted])

  function continueOrReveal() {
    if (shownRef.current < lenRef.current) {
      setShown(lenRef.current)
      return
    }
    onAdvanceRef.current?.()
  }

  useImperativeHandle(ref, () => ({
    continueOrReveal,
  }))

  if (!line) return null

  return (
    <>
      <div className="nv-type-log">
        {history.map((h, i) => (
          <div
            key={`${h.speaker}-${i}-${(h.text || '').slice(0, 12)}`}
            className={`nv-line nv-line-fade fade-${history.length - i}`}
          >
            <span className="nv-speaker">{speakerPrefix(h.speaker)}</span>{' '}
            <MathText text={h.text} />
          </div>
        ))}
        <div className={`nv-line nv-line-current${done ? '' : ' is-typing'}`}>
          <span className="nv-speaker">{speakerPrefix(line.speaker)}</span>{' '}
          <MathText text={partial} />
          {!done ? (
            <span className="nv-cursor" aria-hidden>
              ▌
            </span>
          ) : null}
        </div>
      </div>
      <div className="nv-row">
        <button
          type="button"
          className="nv-btn"
          disabled={!canGoPrev}
          onClick={onPrev}
        >
          前一句 _
        </button>
        <button
          type="button"
          className="nv-btn primary"
          onClick={continueOrReveal}
        >
          {done ? (hasMore ? '繼續 _' : '下一步 _') : '顯示完整 _'}
        </button>
      </div>
    </>
  )
})

export default TypewriterNarrative
export { HISTORY_MAX }
