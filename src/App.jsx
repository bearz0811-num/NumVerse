import { useEffect, useMemo, useRef, useState } from 'react'
import MathText from './components/MathText.jsx'
import { scriptList, scriptsById } from './data/scripts'
import { adaptQuestion } from './lib/adaptQuestion'
import {
  generateHintAI,
  pickCorrectFeedback,
} from './lib/detour'
import { classifyError } from './lib/errorProfile'
import { generateEndingJournalAI, summarizeTrail } from './lib/journal'
import { drawQuestion } from './lib/questionPool'
import {
  clearSave,
  loadAllSaves,
  loadSave,
  saveGame,
} from './lib/saveGame'
import {
  accuracyPercent,
  checkAnswer,
  filterLinesByChoices,
  findNode,
} from './lib/rpgUtils'
import { fillPersona } from './lib/persona'

const SCRIPTS = scriptsById
const MAX_VISIBLE = 3
const TYPE_MS = 28

const GRADES = [
  { grade: 7, half: 1, label: '七上' },
  { grade: 7, half: 2, label: '七下' },
  { grade: 8, half: 1, label: '八上' },
  { grade: 8, half: 2, label: '八下' },
  { grade: 9, half: 1, label: '九上' },
  { grade: 9, half: 2, label: '九下' },
]

const MATHS = ['阿基米德', '伽利略', '牛頓', '高斯', '艾倫・圖靈']

const SPEAKER_CLASS = {
  narrator: 'spk-narrator',
  NumNum: 'spk-numnum',
  Numi: 'spk-numi',
  Archimedes: 'spk-archimedes',
  Mathematician: 'spk-mathematician',
  King: 'spk-king',
  Captain: 'spk-king',
  player: 'spk-player',
}

function speakerLabel(speaker, playerName, script) {
  if (speaker === 'narrator') return null
  if (speaker === 'player') return playerName || '你'
  if (speaker === 'Mathematician') return script?.mathematician || '數學家'
  if (speaker === 'Archimedes') return '阿基米德'
  if (speaker === 'King') return '希倫王'
  if (speaker === 'Captain') return '親衛隊長'
  if (script?.speakerLabels?.[speaker]) return script.speakerLabels[speaker]
  return speaker
}

function speakerClass(speaker) {
  if (SPEAKER_CLASS[speaker]) return SPEAKER_CLASS[speaker]
  return speaker === 'narrator' ? 'spk-narrator' : 'spk-supporting'
}

function nodeLines(node, choiceHistory = {}) {
  if (!node) return []
  let lines = []
  if (node.lines?.length) lines = node.lines
  else if (node.pages?.length) lines = node.pages.flat()
  return filterLinesByChoices(lines, choiceHistory)
}

function quizSetupLines(node, choiceHistory = {}) {
  return filterLinesByChoices(node?.setup || [], choiceHistory)
}

// The featured mathematician warms up as the story advances.
function mathematicianTrust(script, nodeId) {
  if (!script?.nodes?.length || !nodeId) return 0
  const idx = script.nodes.findIndex((n) => n.id === nodeId)
  if (idx < 0) return 0
  return idx / Math.max(1, script.nodes.length - 1)
}

function LineView({ entry, playerName, age, script }) {
  const label = speakerLabel(entry.speaker, playerName, script)
  const cls = speakerClass(entry.speaker)
  const shown = entry.full.slice(0, entry.shownLen)
  const typing = entry.shownLen < entry.full.length
  return (
    <div className={`term-line ${cls} age-${age}${typing ? ' typing' : ''}`}>
      {label ? <span className="term-prefix">{label}: </span> : null}
      <MathText text={shown} className="math-text" />
      {typing ? <span className="caret">▍</span> : null}
    </div>
  )
}

function emptyPlay() {
  return {
    nodeId: null,
    usedQuestionIds: [],
    correctCount: 0,
    attemptCount: 0,
    quiz: null,
    trail: [], // per-anchor outcome for the ending journal
    journal: null,
    choiceHistory: {}, // { choiceNodeId: optionId }
    objective: null,
    awaitingChoice: false,
    // typewriter
    queue: [],
    visible: [], // {speaker, full, shownLen}
    afterQueue: null, // 'show-quiz' | 'show-choice' | { go: nodeId } | 'ending-stats'
    inputLocked: false,
  }
}

export default function App() {
  const [phase, setPhase] = useState('title')
  const [playerName, setPlayerName] = useState('')
  const [nameDraft, setNameDraft] = useState('')
  const [gradeSel, setGradeSel] = useState(null)
  const [scriptId, setScriptId] = useState(null)
  const [play, setPlay] = useState(emptyPlay)
  const [input, setInput] = useState('')
  const [existingSave, setExistingSave] = useState(null)
  const [savesByScript, setSavesByScript] = useState({})
  const logRef = useRef(null)
  const rootRef = useRef(null)
  const playRef = useRef(play)
  playRef.current = play
  const submittingRef = useRef(false)
  const journalReqRef = useRef(false)

  function focusShell() {
    // 答完後選項按鈕卸載會丟焦點，Enter 就沒人接
    rootRef.current?.focus({ preventScroll: true })
  }

  const script = scriptId ? SCRIPTS[scriptId] : null
  const node = script && play.nodeId ? findNode(script, play.nodeId) : null

  useEffect(() => {
    setExistingSave(loadSave())
    setSavesByScript(loadAllSaves())
  }, [])

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [play.visible, play.quiz, phase])

  // 進遊戲／答完題後把焦點抓回殼層，否則 Enter 無效
  useEffect(() => {
    if (phase !== 'play') return
    const answeringNumber =
      play.quiz?.awaitingAnswer &&
      play.quiz?.revealed &&
      play.quiz?.question?.answerType === 'number'
    if (answeringNumber) return
    focusShell()
  }, [
    phase,
    play.nodeId,
    play.quiz?.awaitingAnswer,
    play.quiz?.revealed,
    play.quiz?.questionId,
    play.quiz?.question?.answerType,
  ])

  // 進到結局、對話播完 → 生成個人化冒險日誌（AI，失敗退回模板）
  useEffect(() => {
    if (phase !== 'ending') return
    if (play.queue.length > 0) return
    if (journalReqRef.current || play.journal !== null) return
    journalReqRef.current = true
    const ctx = {
      playerName,
      summary: summarizeTrail(play.trail),
      correctCount: play.correctCount,
      attemptCount: play.attemptCount,
      script,
    }
    let alive = true
    generateEndingJournalAI(ctx).then((text) => {
      if (alive) setPlay((p) => ({ ...p, journal: text }))
    })
    return () => {
      alive = false
    }
  }, [
    phase,
    play.queue.length,
    play.journal,
    playerName,
    play.trail,
    play.correctCount,
    play.attemptCount,
    script,
  ])

  // typewriter tick
  useEffect(() => {
    if (phase !== 'play' && phase !== 'ending') return
    const cur = play.visible[play.visible.length - 1]
    if (!cur || cur.shownLen >= cur.full.length) return
    const t = setTimeout(() => {
      setPlay((p) => {
        const visible = [...p.visible]
        const last = { ...visible[visible.length - 1] }
        if (!last || last.shownLen >= last.full.length) return p
        last.shownLen = Math.min(last.full.length, last.shownLen + 1)
        visible[visible.length - 1] = last
        return { ...p, visible }
      })
    }, TYPE_MS)
    return () => clearTimeout(t)
  }, [phase, play.visible])

  const availableScripts = useMemo(() => {
    if (!gradeSel) return []
    return scriptList.filter((s) => {
      const full = SCRIPTS[s.id]
      return full?.grade === gradeSel.grade && full?.half === gradeSel.half
    })
  }, [gradeSel])

  function persist(next, sid = scriptId, name = playerName) {
    if (!sid || !next.nodeId) return
    const payload = saveGame({
      scriptId: sid,
      playerName: name,
      nodeId: next.nodeId,
      usedQuestionIds: next.usedQuestionIds,
      correctCount: next.correctCount,
      attemptCount: next.attemptCount,
      trail: next.trail,
      quiz: next.quiz,
      choiceHistory: next.choiceHistory,
      objective: next.objective,
      // resume at node start of dialogue for simplicity
      lineIndex: 0,
    })
    setExistingSave(payload)
    setSavesByScript((current) => ({ ...current, [sid]: payload }))
  }

  function pushLines(base, lines, afterQueue = null) {
    const trust = mathematicianTrust(script, base?.nodeId)
    const filled = (lines || []).map((l) => ({
      speaker: l.speaker,
      full: fillPersona(l.text, l.speaker, playerName, {
        mathematicianTrust: trust,
        mathematicianSpeaker: script?.mathematicianSpeaker || 'Archimedes',
      }),
      shownLen: 0,
      eurekaMoment: Boolean(l.eurekaMoment),
    }))
    const [first, ...rest] = filled
    if (!first) {
      return finishQueue({ ...base, queue: [], visible: base.visible, afterQueue })
    }
    return {
      ...base,
      queue: rest,
      visible: trimVisible([...(base.visible || []), first]),
      afterQueue,
      inputLocked: false,
      awaitingChoice: false,
    }
  }

  function withObjective(base, node) {
    if (!node?.objective) return base
    return { ...base, objective: node.objective }
  }

  function trimVisible(list) {
    return list.slice(-MAX_VISIBLE)
  }

  function finishQueue(state) {
    const after = state.afterQueue
    if (!after) return { ...state, afterQueue: null }

    if (after === 'show-quiz') {
      return {
        ...state,
        afterQueue: null,
        inputLocked: false,
        quiz: state.quiz
          ? { ...state.quiz, revealed: true, awaitingAnswer: true }
          : null,
      }
    }
    if (after === 'show-choice') {
      return {
        ...state,
        afterQueue: null,
        awaitingChoice: true,
        inputLocked: false,
      }
    }
    if (after === 'ending-stats') {
      setPhase('ending')
      return { ...state, afterQueue: null }
    }
    if (after?.go) {
      setTimeout(() => goToNode(after.go, state), 0)
      return { ...state, afterQueue: null }
    }
    return { ...state, afterQueue: null }
  }

  function startNewGame(sid, name) {
    const s = SCRIPTS[sid]
    clearSave(sid)
    setSavesByScript((current) => {
      const next = { ...current }
      delete next[sid]
      return next
    })
    journalReqRef.current = false
    setScriptId(sid)
    setPlayerName(name)
    const start = s.nodes[0]
    let base = withObjective(
      { ...emptyPlay(), nodeId: start.id },
      start,
    )
    const after =
      start.type === 'choice'
        ? 'show-choice'
        : start.type === 'ending'
          ? 'ending-stats'
          : null
    const next = pushLines(base, nodeLines(start, base.choiceHistory), after)
    setPlay(next)
    setPhase('play')
    persist(next, sid, name)
  }

  function continueGame(targetScriptId = scriptId || existingSave?.scriptId) {
    const save = loadSave(targetScriptId)
    if (!save || !SCRIPTS[save.scriptId]) return
    const s = SCRIPTS[save.scriptId]
    setScriptId(save.scriptId)
    setPlayerName(save.playerName || '旅人')
    setGradeSel({
      grade: s.grade,
      half: s.half,
      label: s.gradeLabel,
    })
    const n = findNode(s, save.nodeId) || s.nodes[0]
    let next = {
      ...emptyPlay(),
      nodeId: n.id,
      usedQuestionIds: save.usedQuestionIds ?? [],
      correctCount: save.correctCount ?? 0,
      attemptCount: save.attemptCount ?? 0,
      trail: save.trail ?? [],
      quiz: save.quiz ?? null,
      choiceHistory: save.choiceHistory ?? {},
      objective: save.objective ?? n.objective ?? null,
    }
    next = withObjective(next, n)
    journalReqRef.current = false
    if (n.type === 'quiz' && save.quiz) {
      next = pushLines(
        next,
        quizSetupLines(n, next.choiceHistory),
        'show-quiz',
      )
      next.quiz = save.quiz
    } else if (n.type === 'quiz') {
      // redraw
      setPlay(next)
      setPhase('play')
      setTimeout(() => beginQuiz(n, next), 0)
      return
    } else if (n.type === 'choice') {
      next = pushLines(
        next,
        nodeLines(n, next.choiceHistory),
        'show-choice',
      )
    } else {
      next = pushLines(
        next,
        nodeLines(n, next.choiceHistory),
        n.type === 'ending' ? 'ending-stats' : null,
      )
    }
    setPlay(next)
    setPhase(n.type === 'ending' ? 'ending' : 'play')
  }

  function goToNode(nodeId, base = playRef.current) {
    const s = SCRIPTS[scriptId]
    const target = findNode(s, nodeId)
    if (!target) return

    if (target.type === 'quiz') {
      beginQuiz(target, withObjective({ ...base, visible: base.visible || [] }, target))
      return
    }

    let state = withObjective(
      {
        ...base,
        nodeId: target.id,
        quiz: null,
        queue: [],
        awaitingChoice: false,
      },
      target,
    )

    if (target.type === 'choice') {
      const next = pushLines(
        state,
        nodeLines(target, state.choiceHistory),
        'show-choice',
      )
      setPlay(next)
      persist(next)
      return
    }

    const after = target.type === 'ending' ? 'ending-stats' : null
    const next = pushLines(
      state,
      nodeLines(target, state.choiceHistory),
      after,
    )
    setPlay(next)
    persist(next)
  }

  function beginQuiz(quizNode, base) {
    const used = new Set(base.usedQuestionIds)
    const q = drawQuestion(quizNode.pool, { excludeIds: used })
    if (!q) {
      const next = pushLines(
        { ...base, nodeId: quizNode.id, quiz: null },
        [{ speaker: 'NumNum', text: '這段先略過。' }],
        { go: quizNode.onCorrect },
      )
      setPlay(next)
      return
    }
    used.add(q.id)
    const adapted = adaptQuestion(q, quizNode.sceneAdapt, { playerName })
    const next = pushLines(
      {
        ...withObjective(base, quizNode),
        nodeId: quizNode.id,
        usedQuestionIds: [...used],
        awaitingChoice: false,
        quiz: {
          questionId: q.id,
          question: q,
          adapted,
          retryCount: 0,
          detourCount: 0,
          isDetour: false,
          awaitingAnswer: false,
          revealed: false,
        },
      },
      quizSetupLines(quizNode, base.choiceHistory),
      'show-quiz',
    )
    // mark awaiting when revealed
    setPlay({
      ...next,
      quiz: { ...next.quiz, awaitingAnswer: false, revealed: false },
    })
    persist(next)
  }

  function pickChoice(option) {
    const n = findNode(script, play.nodeId)
    if (!n || n.type !== 'choice' || !play.awaitingChoice) return
    if (!option?.next) return
    const history = {
      ...(play.choiceHistory || {}),
      [n.id]: option.id,
    }
    const label = fillPersona(option.label, 'player', playerName, {
      mathematicianTrust: mathematicianTrust(script, play.nodeId),
      mathematicianSpeaker: script?.mathematicianSpeaker || 'Archimedes',
    })
    const stamped = {
      ...play,
      choiceHistory: history,
      awaitingChoice: false,
      queue: [],
      visible: trimVisible([
        ...(play.visible || []),
        {
          speaker: 'player',
          full: label,
          shownLen: label.length,
        },
      ]),
    }
    persist(stamped)
    setPlay(stamped)
    queueMicrotask(() => goToNode(option.next, stamped))
  }

  function onShowQuiz(state) {
    return {
      ...state,
      quiz: state.quiz
        ? { ...state.quiz, revealed: true, awaitingAnswer: true }
        : null,
      afterQueue: null,
    }
  }

  function advance() {
    setPlay((p) => {
      if (p.awaitingChoice) return p

      const cur = p.visible[p.visible.length - 1]
      if (cur && cur.shownLen < cur.full.length) {
        const visible = [...p.visible]
        visible[visible.length - 1] = { ...cur, shownLen: cur.full.length }
        return { ...p, visible }
      }

      if (p.queue.length > 0) {
        const [nextLine, ...rest] = p.queue
        return {
          ...p,
          queue: rest,
          visible: trimVisible([...p.visible, { ...nextLine, shownLen: 0 }]),
        }
      }

      if (p.afterQueue === 'show-quiz') {
        return onShowQuiz(p)
      }
      if (p.afterQueue === 'show-choice') {
        return {
          ...p,
          afterQueue: null,
          awaitingChoice: true,
        }
      }
      if (p.afterQueue === 'ending-stats') {
        setPhase('ending')
        return { ...p, afterQueue: null }
      }
      if (p.afterQueue?.go) {
        const dest = p.afterQueue.go
        const cleared = { ...p, afterQueue: null }
        setTimeout(() => goToNode(dest, cleared), 0)
        return cleared
      }

      const n = findNode(script, p.nodeId)
      if (n && (n.type === 'narrative' || n.type === 'eureka') && n.next) {
        const snap = { ...p, afterQueue: null }
        setTimeout(() => goToNode(n.next, snap), 0)
        return snap
      }
      if (n?.type === 'ending') {
        setPhase('ending')
      }
      return p
    })
  }

  async function submitAnswer(raw) {
    if (!play.quiz?.awaitingAnswer || !node || node.type !== 'quiz') return
    if (submittingRef.current) return
    submittingRef.current = true
    try {
      const q = play.quiz.question
      const ok = checkAnswer(q, raw)
      const attemptCount = play.attemptCount + 1
      const correctCount = play.correctCount + (ok ? 1 : 0)
      setInput('')

      if (ok) {
        const feedback = pickCorrectFeedback(script, { playerName, node })
        const entry = {
          anchor: node.anchor,
          scene: node.scene || play.quiz.adapted?.setting || '',
          knowledgePoint: q.knowledgePoint || q.chapter || '',
          passed: true,
          firstTry: (play.quiz.retryCount || 0) === 0,
          retries: play.quiz.retryCount || 0,
          // keep old key for any leftover journal/save readers
          detours: play.quiz.retryCount || 0,
        }
        const next = pushLines(
          {
            ...play,
            attemptCount,
            correctCount,
            trail: [...play.trail, entry],
            quiz: { ...play.quiz, awaitingAnswer: false, revealed: false },
            queue: [],
          },
          feedback,
          { go: node.onCorrect },
        )
        setPlay(next)
        persist(next)
        queueMicrotask(focusShell)
        return
      }

      // 錯了不換題：同題重答到對；AI／模板只給提示
      const retryCount = (play.quiz.retryCount || play.quiz.detourCount || 0) + 1
      setPlay((p) =>
        p.quiz ? { ...p, quiz: { ...p.quiz, awaitingAnswer: false } } : p,
      )

      const errorProfile = classifyError(q, raw)
      const questionText = play.quiz.adapted?.displayQuestion || q.question
      const hintLines = await generateHintAI(script, {
        playerName,
        node,
        errorProfile,
        questionText,
        sceneAdapt: node.sceneAdapt,
        retryCount,
      })

      const base = playRef.current
      const next = pushLines(
        {
          ...base,
          attemptCount,
          correctCount,
          quiz: {
            ...base.quiz,
            retryCount,
            detourCount: retryCount,
            isDetour: false,
            awaitingAnswer: false,
            revealed: false,
          },
          queue: [],
        },
        hintLines,
        'show-quiz',
      )
      setPlay(next)
      persist(next)
      queueMicrotask(focusShell)
    } finally {
      submittingRef.current = false
    }
  }

  function onKeyDown(e) {
    if (phase !== 'play') return
    if (e.key !== 'Enter') return
    // 焦點在按鈕上時交給按鈕自己的 click，避免連跳兩次
    if (e.target instanceof HTMLElement && e.target.closest('button')) return
    e.preventDefault()
    if (play.awaitingChoice) return
    if (play.quiz?.awaitingAnswer && play.quiz.revealed) {
      if (play.quiz.question.answerType === 'choice') return
      if (input.trim()) submitAnswer(input)
      return
    }
    advance()
  }

  const quizReady =
    play.quiz?.revealed &&
    play.quiz?.awaitingAnswer &&
    play.queue.length === 0

  const choiceReady =
    Boolean(play.awaitingChoice) &&
    node?.type === 'choice' &&
    play.queue.length === 0

  const canAdvanceDialogue =
    phase === 'play' &&
    !play.awaitingChoice &&
    !(quizReady && play.quiz?.question?.answerType === 'choice')
  const currentLine = play.visible[play.visible.length - 1]
  const eurekaActive = Boolean(currentLine?.eurekaMoment)

  return (
    <div
      className="rpg-root"
      ref={rootRef}
      onKeyDown={onKeyDown}
      tabIndex={0}
    >
      <div className={`rpg-shell ${eurekaActive ? 'eureka-glow' : ''}`}>
        {eurekaActive ? (
          <div className="eureka-burst" aria-hidden="true">
            <span className="eureka-ring ring-one" />
            <span className="eureka-ring ring-two" />
            <span className="eureka-word">EUREKA</span>
          </div>
        ) : null}
        {phase === 'title' && (
          <section className="panel">
            <h1 className="hero-title">NUMIP</h1>
            <div className="btn-row">
              <button type="button" className="btn primary" onClick={() => setPhase('name')}>
                開始冒險
              </button>
              {existingSave ? (
                <button
                  type="button"
                  className="btn"
                  onClick={() => continueGame(existingSave.scriptId)}
                >
                  繼續進度
                </button>
              ) : null}
            </div>
          </section>
        )}

        {phase === 'name' && (
          <section className="panel">
            <h2>你的名字</h2>
            <input
              className="term-input"
              value={nameDraft}
              maxLength={12}
              placeholder="輸入名字"
              autoFocus
              onChange={(e) => setNameDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && nameDraft.trim()) {
                  setPlayerName(nameDraft.trim())
                  setPhase('grade')
                }
              }}
            />
            <div className="btn-row">
              <button
                type="button"
                className="btn primary"
                disabled={!nameDraft.trim()}
                onClick={() => {
                  setPlayerName(nameDraft.trim())
                  setPhase('grade')
                }}
              >
                下一步
              </button>
            </div>
          </section>
        )}

        {phase === 'grade' && (
          <section className="panel">
            <h2>選擇年段</h2>
            <div className="grid-3">
              {GRADES.map((g) => {
                const open = scriptList.some((s) => {
                  const full = SCRIPTS[s.id]
                  return full?.grade === g.grade && full?.half === g.half
                })
                return (
                  <button
                    key={g.label}
                    type="button"
                    className="btn chip"
                    disabled={!open}
                    onClick={() => {
                      setGradeSel(g)
                      setPhase('script')
                    }}
                  >
                    {g.label}
                    {!open ? '（即將開放）' : ''}
                  </button>
                )
              })}
            </div>
          </section>
        )}

        {phase === 'resume' && (
          <section className="panel">
            <h2>發現存檔</h2>
            <p className="muted">
              {existingSave?.playerName} · {SCRIPTS[scriptId]?.title}
            </p>
            <div className="btn-row">
              <button
                type="button"
                className="btn primary"
                onClick={() => continueGame(scriptId)}
              >
                繼續進度
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => startNewGame(scriptId, playerName)}
              >
                新開一局
              </button>
            </div>
          </section>
        )}

        {phase === 'script' && (
          <section className="panel">
            <h2>選擇劇本 · {gradeSel?.label}</h2>
            <div className="grid-2">
              {MATHS.map((m) => {
                const short = m.replace('艾倫・', '')
                const found = availableScripts.find(
                  (s) =>
                    s.mathematician === m ||
                    String(s.mathematician).includes(short),
                )
                const sid = found?.id
                const save = sid ? savesByScript[sid] : null
                return (
                  <button
                    key={m}
                    type="button"
                    className="btn chip"
                    disabled={!sid}
                    onClick={() => {
                      if (!sid) return
                      if (save) {
                        setScriptId(sid)
                        setPhase('resume')
                        return
                      }
                      startNewGame(sid, playerName)
                    }}
                  >
                    {m}
                    {!sid ? '（即將開放）' : save ? '（有存檔）' : ''}
                  </button>
                )
              })}
            </div>
            <button type="button" className="btn ghost" onClick={() => setPhase('grade')}>
              返回年段
            </button>
          </section>
        )}

        {(phase === 'play' || phase === 'ending') && script && (
          <section className="term-stage">
            {play.objective ? (
              <div className="objective-bar" aria-live="polite">
                <span className="objective-label">目前目標</span>
                <span className="objective-text">{play.objective}</span>
              </div>
            ) : null}
            <div className="term-log" ref={logRef}>
              <div className="term-log-inner">
              {play.visible.map((entry, i) => {
                const age = play.visible.length - 1 - i
                return (
                  <LineView
                    key={`${entry.speaker}-${i}-${entry.full.slice(0, 12)}`}
                    entry={entry}
                    playerName={playerName}
                    age={age}
                    script={script}
                  />
                )
              })}

              {choiceReady && (
                <div className="choice-block">
                  {(node.choices || []).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className="btn choice"
                      onClick={() => pickChoice(opt)}
                    >
                      <MathText
                        text={fillPersona(opt.label, 'player', playerName, {
                          mathematicianTrust: mathematicianTrust(
                            script,
                            play.nodeId,
                          ),
                          mathematicianSpeaker:
                            script?.mathematicianSpeaker || 'Archimedes',
                        })}
                        className="math-text"
                      />
                    </button>
                  ))}
                </div>
              )}

              {quizReady && (
                <div className="quiz-block">
                  {play.quiz.isDetour ? (
                    <div className="tag">再試一次</div>
                  ) : null}
                  <div className="quiz-q">
                    <MathText
                      text={
                        play.quiz.adapted?.displayQuestion ||
                        play.quiz.question.question
                      }
                      className="math-text"
                    />
                  </div>
                  {(play.quiz.adapted
                    ? play.quiz.adapted.displayImage
                    : play.quiz.question.image) && (
                    <figure className="question-figure">
                      <img
                        src={
                          play.quiz.adapted
                            ? play.quiz.adapted.displayImage
                            : play.quiz.question.image
                        }
                        alt={
                          (play.quiz.adapted
                            ? play.quiz.adapted.displayImageAlt
                            : play.quiz.question.imageAlt) || '題目附圖'
                        }
                      />
                    </figure>
                  )}
                  {play.quiz.adapted?.displayOptions ? (
                    <div className="choices">
                      {play.quiz.adapted.displayOptions.map((opt) => (
                        <button
                          key={opt.letter}
                          type="button"
                          className="btn choice"
                          onClick={() => submitAnswer(opt.letter)}
                        >
                          <span className="choice-letter">{opt.letter}.</span>{' '}
                          <MathText text={opt.text} className="math-text" />
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              )}

              {phase === 'ending' && play.queue.length === 0 && (
                <div className="ending-stats">
                  {play.journal === null ? (
                    <p className="journal loading">……正在翻閱這一局的旅程……</p>
                  ) : (
                    <p className="journal">{play.journal}</p>
                  )}
                  <p>
                    正確率：
                    <strong>
                      {accuracyPercent(play.correctCount, play.attemptCount)}%
                    </strong>
                    （{play.correctCount} / {play.attemptCount}）
                  </p>
                  <div className="btn-row">
                    <button
                      type="button"
                      className="btn primary"
                      onClick={() => {
                        clearSave(scriptId)
                        journalReqRef.current = false
                        setPlay(emptyPlay())
                        setPhase('title')
                        setSavesByScript((current) => {
                          const next = { ...current }
                          delete next[scriptId]
                          return next
                        })
                        setExistingSave(loadSave())
                      }}
                    >
                      回到標題
                    </button>
                  </div>
                </div>
              )}
              </div>
            </div>

            {phase === 'play' && (
              <div className="term-prompt-bar">
              <div className="term-prompt">
                {choiceReady ? (
                  <span className="muted">選擇一條路</span>
                ) : quizReady && play.quiz.question.answerType === 'number' ? (
                  <>
                    <span className="prompt-mark">&gt;</span>
                    <input
                      className="term-input grow"
                      value={input}
                      placeholder="輸入答案後 Enter"
                      autoFocus
                      onChange={(e) => setInput(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn primary"
                      disabled={!input.trim()}
                      onClick={() => submitAnswer(input)}
                    >
                      提交
                    </button>
                  </>
                ) : quizReady && play.quiz.question.answerType === 'choice' ? (
                  <span className="muted">選 A–D</span>
                ) : (
                  <>
                    <span className="prompt-mark">&gt;</span>
                    <button
                      type="button"
                      className="btn primary grow"
                      onClick={advance}
                      disabled={!canAdvanceDialogue}
                    >
                      繼續 · Enter
                    </button>
                  </>
                )}
              </div>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  )
}
