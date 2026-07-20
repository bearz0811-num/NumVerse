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
  ListChecks,
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
      className={`min-h-svh px-4 py-6 text-slate-100 ${shaking ? 'animate-shake' : ''}`}
    >
      <div className="mx-auto flex w-full max-w-xl flex-col gap-5">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 -mx-4 border-b border-slate-800/80 bg-slate-950/85 px-4 py-4 backdrop-blur-md">
          <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
            <div
              className={`flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-slate-900 px-4 py-3 ${
                goldPulse ? 'animate-gold-pop' : ''
              }`}
            >
              <Coins className="size-7 text-amber-400" />
              <div className="leading-tight">
                <p className="font-body text-sm tracking-wide text-slate-400">
                  我的總資產
                </p>
                <p className="font-display text-2xl font-bold text-amber-400">
                  ${formatGold(displayWallet)}{' '}
                  <span className="text-sm font-semibold text-amber-500/80">
                    Gold
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-slate-900 px-4 py-3">
              <Flame className="size-7 text-orange-400" />
              <div className="leading-tight text-right">
                <p className="font-body text-sm text-slate-400">連勝</p>
                <p className="font-display text-xl font-bold text-orange-300">
                  {streak}{' '}
                  <span className="text-sm font-semibold text-slate-400">
                    (x{multiplier.toFixed(1)})
                  </span>
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="text-center">
          <h1 className="font-display text-3xl font-extrabold tracking-[0.18em] text-cyan-300 drop-shadow-[0_0_18px_rgba(34,211,238,0.35)] md:text-4xl">
            MATH WAGER
          </h1>
          <p className="mt-2 font-body text-lg text-slate-400">
            下注 · 解題 · 收割
          </p>
        </div>

        {/* Question Card */}
        <section className="rounded-3xl border border-slate-700/80 bg-slate-900/90 p-6 shadow-[0_0_40px_rgba(15,23,42,0.8)] md:p-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 font-body text-base font-semibold tracking-wide text-cyan-300">
                {question.knowledgePoint}
              </span>
              <span className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-1.5 font-body text-sm font-semibold text-slate-300">
                {question.difficulty}
              </span>
              <span className="rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 font-body text-sm font-semibold text-violet-300">
                {choiceMode ? '選擇題' : '填數字'}
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 font-body text-lg font-semibold text-amber-400">
              <Gem className="size-5" />
              本題底金：${formatGold(question.baseValue)} Gold
            </span>
          </div>
          <p className="font-body text-2xl font-semibold leading-relaxed whitespace-pre-wrap text-slate-50 md:text-3xl">
            <MathText text={question.question} />
          </p>
        </section>

        {/* Stage 1 */}
        {stage === STAGE.STRATEGY && (
          <section className="flex flex-col gap-4">
            <p className="text-center font-body text-lg text-slate-400">
              選擇策略後開始作答
            </p>

            <button
              type="button"
              onClick={chooseSafe}
              className="rounded-3xl border border-emerald-500/40 bg-emerald-500/10 p-5 text-left transition hover:border-emerald-400 hover:bg-emerald-500/20 active:scale-[0.98] md:p-6"
            >
              <div className="mb-2 flex items-center gap-2 font-display text-xl font-bold text-emerald-300 md:text-2xl">
                <Shield className="size-7" />
                【🛡️ 穩健作答】
              </div>
              <p className="font-body text-lg text-slate-300">
                Win: +${formatGold(Math.round(question.baseValue * multiplier))}{' '}
                | Loss: $0（零風險）
              </p>
            </button>

            <button
              type="button"
              onClick={chooseBold}
              className="rounded-3xl border border-amber-500/40 bg-amber-500/10 p-5 text-left transition hover:border-amber-400 hover:bg-amber-500/20 active:scale-[0.98] md:p-6"
            >
              <div className="mb-2 flex items-center gap-2 font-display text-xl font-bold text-amber-300 md:text-2xl">
                <Zap className="size-7" />
                【⚡ 自信爆擊】
              </div>
              <p className="font-body text-lg text-slate-300">
                Win: +$
                {formatGold(Math.round(question.baseValue * 3 * multiplier))} |
                Loss: -${formatGold(question.baseValue)}
              </p>
            </button>

            <button
              type="button"
              onClick={skipQuestion}
              className="rounded-3xl border border-slate-600 bg-slate-800/80 p-5 text-left transition hover:border-slate-400 hover:bg-slate-800 active:scale-[0.98] md:p-6"
            >
              <div className="mb-2 flex items-center gap-2 font-display text-xl font-bold text-slate-200 md:text-2xl">
                <RefreshCw className="size-7 text-cyan-300" />
                【🃏 戰術換題】
              </div>
              <p className="font-body text-lg text-slate-400">
                花費 ${SKIP_FEE} Gold 直接跳下一題
              </p>
            </button>
          </section>
        )}

        {/* Stage 2 */}
        {stage === STAGE.ANSWER && (
          <section className="flex flex-col gap-4">
            <div
              className={`rounded-2xl border px-4 py-3 text-center font-body text-base font-semibold md:text-lg ${modeBadge.className}`}
            >
              {modeBadge.label}
            </div>

            {choiceMode ? (
              <>
                <div className="flex items-center justify-center gap-2 font-body text-sm tracking-widest text-slate-500">
                  <ListChecks className="size-4" />
                  點選選項 · 鍵盤 A–D · Enter 送出
                </div>
                <div className="flex flex-col gap-3">
                  {(question.options || []).map((opt) => {
                    const selected = input === opt.letter
                    return (
                      <button
                        key={opt.letter}
                        type="button"
                        onClick={() => setInput(opt.letter)}
                        className={`rounded-2xl border p-4 text-left transition active:scale-[0.99] ${
                          selected
                            ? 'border-cyan-400 bg-cyan-500/20 shadow-[0_0_24px_rgba(34,211,238,0.25)]'
                            : 'border-slate-700 bg-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="font-display flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-xl font-bold text-cyan-300">
                            {opt.letter}
                          </span>
                          <span className="font-body pt-1.5 text-lg font-semibold leading-snug text-slate-100 md:text-xl">
                            <MathText text={opt.text} />
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </>
            ) : (
              <>
                <div className="rounded-3xl border border-slate-700 bg-slate-950 px-4 py-5 md:px-6 md:py-6">
                  <div className="mb-2 flex items-center justify-center gap-2 font-body text-sm tracking-widest text-slate-500">
                    <Keyboard className="size-4" />
                    可用鍵盤直接輸入 · Enter 送出
                  </div>
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
                    placeholder="輸入答案…"
                    className="w-full bg-transparent text-center font-display text-5xl font-bold tracking-wider text-cyan-200 caret-cyan-300 outline-none placeholder:text-slate-600 md:text-6xl"
                    aria-label="答案輸入"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {keys.map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        if (key === '-') toggleNeg()
                        else appendDigit(key)
                      }}
                      className="flex h-16 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800 font-display text-3xl font-bold text-slate-100 transition hover:border-cyan-500/50 hover:bg-slate-700 active:scale-95 md:h-[4.5rem]"
                      aria-label={key === '-' ? 'Negative' : key}
                    >
                      {key}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={backspace}
                  className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-800/80 font-display text-lg font-bold text-slate-200 transition hover:bg-slate-700 active:scale-[0.98]"
                >
                  <Delete className="size-6" />
                  刪除
                </button>
              </>
            )}

            <button
              type="button"
              onClick={submitAnswer}
              disabled={!canSubmit}
              className="flex h-16 items-center justify-center gap-2 rounded-2xl bg-cyan-500 font-display text-xl font-bold text-slate-950 shadow-[0_0_28px_rgba(34,211,238,0.35)] transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none active:scale-[0.98]"
            >
              <Send className="size-6" />
              送出答案
            </button>
          </section>
        )}

        {/* Stage 3 */}
        {stage === STAGE.RESULT && result && (
          <section className="flex flex-col gap-5">
            <div
              className={`rounded-3xl border p-7 text-center md:p-8 ${
                result.correct
                  ? 'border-emerald-500/40 bg-emerald-500/10'
                  : 'border-rose-500/40 bg-rose-500/10'
              }`}
            >
              <div className="mb-4 flex justify-center">
                {result.correct ? (
                  <PartyPopper className="size-14 text-emerald-400" />
                ) : (
                  <XCircle className="size-14 text-rose-400" />
                )}
              </div>

              <p
                className={`font-display text-5xl font-extrabold tracking-wide md:text-6xl ${
                  result.correct ? 'text-emerald-400' : 'text-rose-500'
                }`}
              >
                {result.delta >= 0 ? '+' : '-'}$
                {formatGold(Math.abs(result.delta))} Gold
              </p>

              <p className="mt-3 font-body text-xl text-slate-300">
                {result.correct ? '開牌成功！資產進帳' : '開牌失敗…'}
              </p>

              {!result.correct && (
                <div className="mt-5 rounded-2xl border border-slate-700 bg-slate-950/70 px-5 py-4 text-left">
                  <p className="font-body text-lg text-slate-400">正確答案：</p>
                  <p className="mt-1 font-display text-2xl font-bold text-cyan-300">
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
                  <p className="mt-2 font-body text-base text-slate-400">
                    知識點：{question.knowledgePoint} · {question.difficulty}
                  </p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={goNextQuestion}
              className="flex h-16 items-center justify-center gap-2 rounded-2xl bg-amber-500 font-display text-xl font-bold text-slate-950 shadow-[0_0_28px_rgba(245,158,11,0.35)] transition hover:bg-amber-400 active:scale-[0.98]"
            >
              下一題 →
              <span className="text-base font-semibold text-slate-800/70">
                (Space)
              </span>
            </button>
          </section>
        )}
      </div>

      {bailoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-amber-500/40 bg-slate-900 p-8 text-center shadow-[0_0_50px_rgba(245,158,11,0.25)]">
            <p className="font-display text-3xl font-extrabold text-amber-400">
              破產救濟
            </p>
            <p className="mt-4 font-body text-xl text-slate-300">
              資產低於 ${BAILOUT_THRESHOLD}，系統發放救濟金{' '}
              <span className="font-bold text-amber-400">
                ${formatGold(BAILOUT_AMOUNT)} Gold
              </span>
              ，繼續戰！
            </p>
            <button
              type="button"
              onClick={claimBailout}
              className="mt-6 w-full rounded-2xl bg-amber-500 py-4 font-display text-xl font-bold text-slate-950 transition hover:bg-amber-400"
            >
              領取救濟金
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.45s ease-in-out; }

        @keyframes gold-pop {
          0% { transform: scale(1); box-shadow: 0 0 0 rgba(251,191,36,0); }
          40% { transform: scale(1.06); box-shadow: 0 0 24px rgba(251,191,36,0.45); }
          100% { transform: scale(1); box-shadow: 0 0 0 rgba(251,191,36,0); }
        }
        .animate-gold-pop { animation: gold-pop 0.65s ease-out; }
      `}</style>
    </div>
  )
}
