import { useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import {
  Coins,
  Flame,
  Gem,
  Shield,
  Zap,
  RefreshCw,
  Delete,
  Send,
  PartyPopper,
  XCircle,
  Keyboard,
} from 'lucide-react'
import { QUESTION_BANK } from './data/questions'
import MathText from './components/MathText'

const STORAGE_KEY = 'math-wager-wallet'
const START_BALANCE = 1000
const SKIP_FEE = 20
const BAILOUT_THRESHOLD = 20
const BAILOUT_AMOUNT = 500

const STAGE = {
  STRATEGY: 'strategy',
  ANSWER: 'answer',
  RESULT: 'result',
}

function loadWallet() {
  const raw = localStorage.getItem(STORAGE_KEY)
  const n = Number(raw)
  return Number.isFinite(n) ? n : START_BALANCE
}

function formatGold(n) {
  return Math.round(n).toLocaleString('en-US')
}

/** streak 0 → x1.0, streak 3 → x1.5, soft-cap 3.0 */
function getStreakMultiplier(streak) {
  return Math.min(1 + (streak * 0.5) / 3, 3)
}

function pickQuestion(excludeId) {
  const pool =
    QUESTION_BANK.length <= 1
      ? QUESTION_BANK
      : QUESTION_BANK.filter((q) => q.id !== excludeId)
  return pool[Math.floor(Math.random() * pool.length)]
}

function isChoiceQuestion(q) {
  return q?.answerType === 'choice'
}

function normalizeAnswer(value) {
  return String(value).trim().replace(/^\+/, '').replace(/−/g, '-').replace(/－/g, '-')
}

function parseNumeric(value) {
  const v = normalizeAnswer(value)
  if (!v) return null
  const frac = v.match(/^([+-]?\d+(?:\.\d+)?)\s*\/\s*([+-]?\d+(?:\.\d+)?)$/)
  if (frac) {
    const a = Number(frac[1])
    const b = Number(frac[2])
    if (!Number.isFinite(a) || !Number.isFinite(b) || b === 0) return null
    return a / b
  }
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

function answersMatch(user, correct, answerType) {
  if (answerType === 'choice') {
    return normalizeAnswer(user).toUpperCase() === normalizeAnswer(correct).toUpperCase()
  }
  const u = normalizeAnswer(user)
  const c = normalizeAnswer(correct)
  if (u === c) return true
  const un = parseNumeric(u)
  const cn = parseNumeric(c)
  if (un != null && cn != null) return Math.abs(un - cn) < 1e-9
  return false
}

/** 允許數字、負號、小數點、分數斜線 */
function sanitizeAnswerInput(value) {
  let next = String(value).replace(/[^\d./-]/g, '')

  const hasNeg = next.includes('-')
  next = next.replace(/-/g, '')
  if (hasNeg) next = `-${next}`

  // only one slash
  const slashParts = next.split('/')
  if (slashParts.length > 2) {
    next = `${slashParts[0]}/${slashParts.slice(1).join('')}`
  }

  // each side at most one dot
  next = next
    .split('/')
    .map((part) => {
      const bits = part.split('.')
      if (bits.length <= 2) return part
      return `${bits[0]}.${bits.slice(1).join('')}`
    })
    .join('/')

  return next
}

function useCountUp(target, duration = 600) {
  const [display, setDisplay] = useState(target)
  const prev = useRef(target)

  useEffect(() => {
    const from = prev.current
    const to = target
    if (from === to) {
      setDisplay(to)
      return
    }

    const start = performance.now()
    let raf

    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - (1 - t) ** 3
      setDisplay(Math.round(from + (to - from) * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
      else prev.current = to
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])

  return display
}

function fireWinConfetti() {
  const defaults = {
    spread: 62,
    ticks: 90,
    gravity: 1.1,
    colors: ['#fbbf24', '#f59e0b', '#22d3ee', '#a3e635', '#ffffff'],
  }
  confetti({ ...defaults, particleCount: 80, origin: { y: 0.65 } })
  confetti({
    ...defaults,
    particleCount: 40,
    angle: 60,
    origin: { x: 0, y: 0.7 },
  })
  confetti({
    ...defaults,
    particleCount: 40,
    angle: 120,
    origin: { x: 1, y: 0.7 },
  })
}

export default function App() {
  const [wallet, setWallet] = useState(loadWallet)
  const [streak, setStreak] = useState(0)
  const [stage, setStage] = useState(STAGE.STRATEGY)
  const [question, setQuestion] = useState(() => pickQuestion())
  const [strategy, setStrategy] = useState(null) // 'safe' | 'bold'
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [shaking, setShaking] = useState(false)
  const [bailoutOpen, setBailoutOpen] = useState(false)
  const [goldPulse, setGoldPulse] = useState(false)

  const inputRef = useRef(null)
  const submitRef = useRef(() => {})
  const displayWallet = useCountUp(wallet)
  const multiplier = getStreakMultiplier(streak)
  const choiceMode = isChoiceQuestion(question)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(wallet))
  }, [wallet])

  useEffect(() => {
    if (wallet < BAILOUT_THRESHOLD && !bailoutOpen && stage !== STAGE.ANSWER) {
      setBailoutOpen(true)
    }
  }, [wallet, bailoutOpen, stage])

  useEffect(() => {
    if (stage === STAGE.ANSWER && !isChoiceQuestion(question)) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 50)
      return () => window.clearTimeout(id)
    }
  }, [stage, question.id])

  const applyWalletDelta = (delta) => {
    setWallet((w) => Math.max(0, w + delta))
    if (delta !== 0) {
      setGoldPulse(true)
      window.setTimeout(() => setGoldPulse(false), 700)
    }
  }

  const goNextQuestion = () => {
    setQuestion(pickQuestion(question.id))
    setStrategy(null)
    setInput('')
    setResult(null)
    setStage(STAGE.STRATEGY)
  }

  useEffect(() => {
    if (stage !== STAGE.RESULT || bailoutOpen) return

    const onKeyDown = (e) => {
      if (e.repeat) return
      if (e.code !== 'Space' && e.key !== ' ') return
      e.preventDefault()
      goNextQuestion()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [stage, bailoutOpen, question.id])

  const chooseSafe = () => {
    setStrategy('safe')
    setInput('')
    setStage(STAGE.ANSWER)
  }

  const chooseBold = () => {
    setStrategy('bold')
    setInput('')
    setStage(STAGE.ANSWER)
  }

  const skipQuestion = () => {
    if (wallet < SKIP_FEE) {
      setBailoutOpen(true)
      return
    }
    applyWalletDelta(-SKIP_FEE)
    goNextQuestion()
  }

  const appendDigit = (d) => {
    setInput((prev) => sanitizeAnswerInput(prev + d))
    inputRef.current?.focus()
  }

  const toggleNeg = () => {
    setInput((prev) => {
      if (!prev || prev === '-') return prev === '-' ? '' : '-'
      return prev.startsWith('-') ? prev.slice(1) : `-${prev}`
    })
    inputRef.current?.focus()
  }

  const backspace = () => {
    setInput((prev) => prev.slice(0, -1))
    inputRef.current?.focus()
  }

  const submitAnswerWith = (value) => {
    if (!value || value === '-' || value === '.' || value === '-.' || value === '/') return

    const correct = answersMatch(value, question.answer, question.answerType)

    let delta = 0
    if (correct) {
      const base =
        strategy === 'bold' ? question.baseValue * 3 : question.baseValue
      delta = Math.round(base * multiplier)
      applyWalletDelta(delta)
      setStreak((s) => s + 1)
      fireWinConfetti()
    } else {
      if (strategy === 'bold') {
        delta = -question.baseValue
        applyWalletDelta(delta)
      }
      setStreak(0)
      setShaking(true)
      window.setTimeout(() => setShaking(false), 500)
    }

    setResult({ correct, delta })
    setStage(STAGE.RESULT)
  }

  const submitAnswer = () => submitAnswerWith(input)
  submitRef.current = submitAnswer

  // choice keyboard A-D / Enter
  useEffect(() => {
    if (stage !== STAGE.ANSWER || !isChoiceQuestion(question) || bailoutOpen) return

    const onKeyDown = (e) => {
      const key = e.key.toUpperCase()
      if (['A', 'B', 'C', 'D'].includes(key)) {
        e.preventDefault()
        setInput(key)
        return
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        submitRef.current()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [stage, question.id, bailoutOpen])

  const claimBailout = () => {
    applyWalletDelta(BAILOUT_AMOUNT)
    setBailoutOpen(false)
  }

  const canSubmit = choiceMode
    ? Boolean(input)
    : Boolean(input) &&
      input !== '-' &&
      input !== '.' &&
      input !== '-.' &&
      input !== '/'

  const modeBadge =
    strategy === 'bold'
      ? {
          label: `⚡ 爆擊模式中：答對 +$${formatGold(Math.round(question.baseValue * 3 * multiplier))} / 答錯 -$${formatGold(question.baseValue)}`,
          className:
            'border-amber-400/40 bg-amber-500/15 text-amber-300 shadow-[0_0_24px_rgba(251,191,36,0.2)]',
        }
      : {
          label: `🛡️ 穩健模式中：答對 +$${formatGold(Math.round(question.baseValue * multiplier))} / 答錯 $0`,
          className:
            'border-emerald-400/40 bg-emerald-500/15 text-emerald-300 shadow-[0_0_24px_rgba(52,211,153,0.2)]',
        }

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '0', '/']

  return (
    <div
      className={`flex h-svh flex-col overflow-hidden px-3 py-2 text-slate-100 ${shaking ? 'animate-shake' : ''}`}
    >
      <div className="mx-auto flex h-full w-full max-w-lg min-h-0 flex-col gap-2">
        {/* Top Bar */}
        <header className="flex shrink-0 items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <h1 className="font-display shrink-0 text-sm font-extrabold tracking-[0.14em] text-cyan-300">
              MATH WAGER
            </h1>
            <div
              className={`flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-slate-900 px-2 py-1 ${
                goldPulse ? 'animate-gold-pop' : ''
              }`}
            >
              <Coins className="size-4 text-amber-400" />
              <p className="font-display text-sm font-bold text-amber-400">
                ${formatGold(displayWallet)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-slate-900 px-2 py-1">
            <Flame className="size-4 text-orange-400" />
            <p className="font-display text-sm font-bold text-orange-300">
              {streak}
              <span className="ml-1 text-[11px] font-semibold text-slate-400">
                x{multiplier.toFixed(1)}
              </span>
            </p>
          </div>
        </header>

        {/* Question: height = content only (no flex-1 empty void) */}
        <section className="shrink-0 rounded-xl border border-slate-700/80 bg-slate-900/90 p-3">
          <div className="mb-1.5 flex flex-wrap items-center justify-between gap-1.5">
            <div className="flex min-w-0 flex-wrap items-center gap-1">
              <span className="max-w-[10rem] truncate rounded border border-cyan-500/30 bg-cyan-500/10 px-1.5 py-0.5 font-body text-[11px] font-semibold text-cyan-300">
                {question.knowledgePoint}
              </span>
              <span className="rounded border border-slate-600 bg-slate-800 px-1.5 py-0.5 font-body text-[11px] font-semibold text-slate-300">
                {question.difficulty}
              </span>
              <span className="rounded border border-violet-500/30 bg-violet-500/10 px-1.5 py-0.5 font-body text-[11px] font-semibold text-violet-300">
                {choiceMode ? '選擇' : '數字'}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 font-body text-xs font-semibold text-amber-400">
              <Gem className="size-3.5" />${formatGold(question.baseValue)}
            </span>
          </div>
          <div className="max-h-[38svh] overflow-y-auto font-body text-[15px] font-semibold leading-snug text-slate-50">
            <MathText text={question.question} />
          </div>
        </section>

        {/* Controls sit right under the question */}
        <div className="flex min-h-0 shrink-0 flex-col gap-1.5">
          {/* Stage 1 */}
          {stage === STAGE.STRATEGY && (
            <section className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={chooseSafe}
                className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-left transition active:scale-[0.99]"
              >
                <div className="flex items-center gap-1.5 font-display text-sm font-bold text-emerald-300">
                  <Shield className="size-4" />
                  穩健作答
                </div>
                <p className="font-body text-xs text-slate-300">
                  +${formatGold(Math.round(question.baseValue * multiplier))} /
                  錯 $0
                </p>
              </button>

              <button
                type="button"
                onClick={chooseBold}
                className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-left transition active:scale-[0.99]"
              >
                <div className="flex items-center gap-1.5 font-display text-sm font-bold text-amber-300">
                  <Zap className="size-4" />
                  自信爆擊
                </div>
                <p className="font-body text-xs text-slate-300">
                  +$
                  {formatGold(
                    Math.round(question.baseValue * 3 * multiplier),
                  )}{' '}
                  / 錯 -${formatGold(question.baseValue)}
                </p>
              </button>

              <button
                type="button"
                onClick={skipQuestion}
                className="rounded-xl border border-slate-600 bg-slate-800/80 px-3 py-2 text-left transition active:scale-[0.99]"
              >
                <div className="flex items-center gap-1.5 font-display text-sm font-bold text-slate-200">
                  <RefreshCw className="size-4 text-cyan-300" />
                  戰術換題 · ${SKIP_FEE}
                </div>
              </button>
            </section>
          )}

          {/* Stage 2 */}
          {stage === STAGE.ANSWER && (
            <section className="flex flex-col gap-1.5">
              <div
                className={`rounded-lg border px-2 py-1 text-center font-body text-[11px] font-semibold leading-tight ${modeBadge.className}`}
              >
                {modeBadge.label}
              </div>

              {choiceMode ? (
                <div className="grid grid-cols-2 gap-1.5">
                  {(question.options || []).map((opt) => {
                    const selected = input === opt.letter
                    return (
                      <button
                        key={opt.letter}
                        type="button"
                        onClick={() => setInput(opt.letter)}
                        className={`rounded-lg border p-2 text-left transition active:scale-[0.99] ${
                          selected
                            ? 'border-cyan-400 bg-cyan-500/20'
                            : 'border-slate-700 bg-slate-800/80'
                        }`}
                      >
                        <div className="flex items-start gap-1.5">
                          <span className="font-display flex size-6 shrink-0 items-center justify-center rounded-md bg-slate-900 text-xs font-bold text-cyan-300">
                            {opt.letter}
                          </span>
                          <span className="font-body line-clamp-2 text-xs font-semibold leading-snug text-slate-100">
                            <MathText text={opt.text} />
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-2 py-1.5">
                    <Keyboard className="size-3.5 shrink-0 text-slate-500" />
                    <input
                      ref={inputRef}
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck={false}
                      value={input}
                      onChange={(e) =>
                        setInput(sanitizeAnswerInput(e.target.value))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          submitAnswer()
                        }
                      }}
                      placeholder="答案…"
                      className="w-full bg-transparent text-center font-display text-2xl font-bold tracking-wider text-cyan-200 caret-cyan-300 outline-none placeholder:text-slate-600"
                      aria-label="答案輸入"
                    />
                    <button
                      type="button"
                      onClick={backspace}
                      className="flex size-8 shrink-0 items-center justify-center rounded-md border border-slate-700 bg-slate-800 text-slate-200"
                      aria-label="Backspace"
                    >
                      <Delete className="size-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-6 gap-1">
                    {keys.map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          if (key === '-') toggleNeg()
                          else appendDigit(key)
                        }}
                        className="flex h-9 items-center justify-center rounded-md border border-slate-700 bg-slate-800 font-display text-base font-bold text-slate-100 active:scale-95"
                        aria-label={key === '-' ? 'Negative' : key}
                      >
                        {key}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <button
                type="button"
                onClick={submitAnswer}
                disabled={!canSubmit}
                className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-cyan-500 font-display text-sm font-bold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 active:scale-[0.99]"
              >
                <Send className="size-4" />
                送出答案
              </button>
            </section>
          )}

          {/* Stage 3 */}
          {stage === STAGE.RESULT && result && (
            <section className="flex flex-col gap-1.5">
              <div
                className={`rounded-xl border px-3 py-3 text-center ${
                  result.correct
                    ? 'border-emerald-500/40 bg-emerald-500/10'
                    : 'border-rose-500/40 bg-rose-500/10'
                }`}
              >
                <div className="mb-1 flex justify-center">
                  {result.correct ? (
                    <PartyPopper className="size-7 text-emerald-400" />
                  ) : (
                    <XCircle className="size-7 text-rose-400" />
                  )}
                </div>

                <p
                  className={`font-display text-3xl font-extrabold tracking-wide ${
                    result.correct ? 'text-emerald-400' : 'text-rose-500'
                  }`}
                >
                  {result.delta >= 0 ? '+' : '-'}$
                  {formatGold(Math.abs(result.delta))}
                </p>

                <p className="mt-0.5 font-body text-sm text-slate-300">
                  {result.correct ? '開牌成功！' : '開牌失敗…'}
                </p>

                {!result.correct && (
                  <div className="mt-2 rounded-lg border border-slate-700 bg-slate-950/70 px-2.5 py-2 text-left">
                    <p className="font-body text-xs text-slate-400">正確答案</p>
                    <p className="font-display text-lg font-bold text-cyan-300">
                      {choiceMode ? (
                        <>
                          {question.answer}.{' '}
                          <MathText
                            text={
                              question.options?.find(
                                (o) => o.letter === question.answer,
                              )?.text || ''
                            }
                          />
                        </>
                      ) : (
                        <MathText text={String(question.answer)} />
                      )}
                    </p>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={goNextQuestion}
                className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-amber-500 font-display text-sm font-bold text-slate-950 transition hover:bg-amber-400 active:scale-[0.99]"
              >
                下一題 →
                <span className="text-xs font-semibold text-slate-800/70">
                  Space
                </span>
              </button>
            </section>
          )}
        </div>
      </div>

      {bailoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-amber-500/40 bg-slate-900 p-5 text-center">
            <p className="font-display text-xl font-extrabold text-amber-400">
              破產救濟
            </p>
            <p className="mt-2 font-body text-sm text-slate-300">
              資產低於 ${BAILOUT_THRESHOLD}，發放{' '}
              <span className="font-bold text-amber-400">
                ${formatGold(BAILOUT_AMOUNT)}
              </span>
            </p>
            <button
              type="button"
              onClick={claimBailout}
              className="mt-4 w-full rounded-xl bg-amber-500 py-2.5 font-display text-sm font-bold text-slate-950"
            >
              領取救濟金
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-4px); }
          40% { transform: translateX(4px); }
          60% { transform: translateX(-3px); }
          80% { transform: translateX(3px); }
        }
        .animate-shake { animation: shake 0.4s ease-in-out; }

        @keyframes gold-pop {
          0% { transform: scale(1); }
          40% { transform: scale(1.06); }
          100% { transform: scale(1); }
        }
        .animate-gold-pop { animation: gold-pop 0.5s ease-out; }
      `}</style>
    </div>
  )
}
