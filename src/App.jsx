import { useEffect, useMemo, useRef, useState } from 'react'
import MathText, { MathBlock } from './components/MathText.jsx'
import TypewriterNarrative, {
  HISTORY_MAX,
} from './components/TypewriterNarrative.jsx'
import {
  getChapter,
  isChapterPlayable,
  nextUnlockFor,
} from './data/chapters'
import questionBank from './data/questionBank.json'
import {
  ERA_LABEL,
  ERA_SHORT,
  ERAS,
  INSIGHT_MAX,
  MATHEMATICIANS,
  PRODUCT_NAME_EN,
  PRODUCT_NAME_ZH,
  SANITY_MAX,
} from './lib/numverse/constants'

function speakerPrefix(speaker) {
  if (speaker === 'narrator') return '>'
  if (speaker === 'SYS') return '> 系統:'
  return `> ${speaker}:`
}

/** 檢查點代碼 → 畫面上的短名（內部 id 不變） */
const CHECKPOINT_LABEL = {
  CHECKPOINT_START: '起始',
  CHECKPOINT_1_LINK: '連線',
  CHECKPOINT_2_BATH: '澡堂',
  CHECKPOINT_2_BATH_PROBLEM: '澡堂・題面',
  CHECKPOINT_2_BATH_QUIZ: '澡堂・答題',
  CHECKPOINT_3_LEDGER: '帳冊',
  CHECKPOINT_3_LEDGER_PROBLEM: '帳冊・題面',
  CHECKPOINT_3_LEDGER_QUIZ: '帳冊・答題',
  CHECKPOINT_4_FORGE: '工坊',
  CHECKPOINT_4_FORGE_PROBLEM: '工坊・題面',
  CHECKPOINT_4_FORGE_QUIZ: '工坊・答題',
  CHECKPOINT_5_DENSITY: '密度',
  CHECKPOINT_5_DENSITY_PROBLEM: '密度・題面',
  CHECKPOINT_5_DENSITY_QUIZ: '密度・答題',
  CHECKPOINT_6_BALANCE: '天平',
  CHECKPOINT_6_BALANCE_PROBLEM: '天平・題面',
  CHECKPOINT_6_BALANCE_QUIZ: '天平・答題',
}

function checkpointLabel(id) {
  if (!id) return '—'
  return CHECKPOINT_LABEL[id] || id
}

/** 章節 id → 大廳顯示用標題（有劇本資料用 title，否則推數學家＋年段） */
function chapterLobbyMeta(chapterId) {
  const data = getChapter(chapterId)
  for (const m of MATHEMATICIANS) {
    for (const era of ERAS) {
      if (m.chapters[era] !== chapterId) continue
      const index =
        MATHEMATICIANS.findIndex((x) => x.id === m.id) * ERAS.length +
        ERAS.indexOf(era) +
        1
      return {
        id: chapterId,
        mathematicianId: m.id,
        mathematicianLabel: m.label,
        icon: m.icon,
        era,
        eraLabel: ERA_LABEL[era],
        eraShort: ERA_SHORT[era],
        chapterIndex: index,
        title: data?.title || `${m.label}・${ERA_SHORT[era]}`,
        subtitle: data?.subtitle || null,
        endings: data?.endings || [],
        eurekaMax: Number(data?.eurekaMax) || (data?.endings?.length || 0) + 1,
        playable: Boolean(data?.nodes?.length),
      }
    }
  }
  return {
    id: chapterId,
    title: chapterId,
    endings: [],
    eurekaMax: 0,
    playable: false,
  }
}

function getBankQuestion(id) {
  return questionBank.questions?.find((q) => q.id === Number(id)) || null
}

function DevBankAside({ bankRef }) {
  if (!bankRef?.id) return null
  const q = getBankQuestion(bankRef.id)
  return (
    <aside className="nv-dev-aside" aria-label="開發用題庫參照">
      <div className="nv-dev-title">DEV・題庫參照</div>
      <div className="nv-dev-meta">原始編號：#{bankRef.id}</div>
      {bankRef.note ? <p className="nv-dev-note">{bankRef.note}</p> : null}
      {q ? (
        <>
          <div className="nv-dev-meta">
            {q.grade}年{q.half === 1 ? '上' : '下'}｜{q.chapter}
          </div>
          <div className="nv-dev-meta">答案：{String(q.answer)}</div>
          <div className="nv-dev-stem">
            <MathText text={q.question} />
          </div>
          {q.options?.length ? (
            <ul className="nv-dev-opts">
              {q.options.map((o) => (
                <li key={o.letter}>
                  {o.letter}. <MathText text={o.text} />
                </li>
              ))}
            </ul>
          ) : null}
        </>
      ) : (
        <p className="nv-err">題庫找不到 id={bankRef.id}</p>
      )}
    </aside>
  )
}
import {
  checkBankAnswer,
  drawPracticeQuestion,
} from './lib/numverse/practice'
import {
  applyFlags,
  clearSession,
  completeChapter,
  grantSessionNodeEureka,
  loadSave,
  patchStory,
  persistSave,
  restoreCheckpoint,
  startChapterSession,
  syncEurekaToCompleted,
  unlockChapter,
  updateSession,
  writeCheckpoint,
} from './lib/numverse/save'

function bar(current, max, fill = '█', empty = '░') {
  return Array.from({ length: max }, (_, i) => (i < current ? fill : empty)).join(
    '',
  )
}

function checkStoryAnswer(question, raw) {
  const value = String(raw ?? '')
    .trim()
    .toUpperCase()
  if (question.answerType === 'choice') {
    return value === String(question.answer).trim().toUpperCase()
  }
  const norm = (s) => String(s).replace(/\s+/g, '').replace(/^\+/, '')
  return norm(value) === norm(question.answer)
}

function filterLines(lines, story = {}) {
  return (lines || []).filter((line) => {
    if (!line.whenStory) return true
    return Object.entries(line.whenStory).every(
      ([key, value]) => story[key] === value,
    )
  })
}

/** 台詞出現「（獲得狀態：xxx）」時才寫入狀態列 */
function extractGrantedBuff(text) {
  const m = String(text || '').match(/獲得狀態[：:]\s*([^）)\n]+)/)
  return m ? m[1].trim() : null
}

/** 姐弟解題抉擇時：往前找最近的題面（problem）一起顯示；答題後劇情分歧不掛題 */
function findLinkedQuestion(chapter, nodeIndex) {
  if (!chapter?.nodes) return null
  for (let i = nodeIndex - 1; i >= 0; i -= 1) {
    const n = chapter.nodes[i]
    if (n.type === 'problem' && n.question) {
      return { scene: n.scene, question: n.question }
    }
    if (n.type === 'quiz') return null
  }
  return null
}

/** 終端機風格外框（避免中英混排把 ASCII 框撐歪） */
function PanelBox({ children, tone = 'normal' }) {
  return (
    <div className={`nv-panel-box${tone === 'error' ? ' is-error' : ''}`}>
      <div className="nv-panel-box-inner">{children}</div>
    </div>
  )
}

export default function App() {
  const [save, setSave] = useState(() => {
    const raw = loadSave()
    return persistSave(
      syncEurekaToCompleted(
        raw,
        (id) => Number(getChapter(id)?.rewards?.eurekaCoin) || 0,
      ),
    )
  })
  const [screen, setScreen] = useState('boot') // boot | lobby | chapter | practice | crash | archive
  const [nodeIndex, setNodeIndex] = useState(0)
  const [lineIndex, setLineIndex] = useState(0)
  const [phase, setPhase] = useState('lines') // lines | choices | quiz | analysis | crash
  const [quizInput, setQuizInput] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [insightNote, setInsightNote] = useState(null)
  const [practiceQ, setPracticeQ] = useState(null)
  const [practiceUsed, setPracticeUsed] = useState([])
  const [practiceFeedback, setPracticeFeedback] = useState(null)

  const [flavorLines, setFlavorLines] = useState([])
  const [lineHistory, setLineHistory] = useState([])
  const [eurekaToast, setEurekaToast] = useState(null) // { amount, key }
  const [endingToast, setEndingToast] = useState(null) // unlock banner
  const [coinPulse, setCoinPulse] = useState(false)
  const [archiveChapterId, setArchiveChapterId] = useState(null)
  const [selectedChapterId, setSelectedChapterId] = useState('ARCHIMEDES_YOUTH')
  const primaryKeyRef = useRef(() => {})
  const typewriterRef = useRef(null)
  const pendingJumpRef = useRef(null)

  function setJumpTarget(nodeId) {
    pendingJumpRef.current = nodeId || null
  }

  const session = save.current_session
  const chapter = session ? getChapter(session.chapter_id) : null
  const node = chapter?.nodes?.[nodeIndex] || null
  const story = session?.story || {}

  const completedCount = save.progress.completed_chapters.length
  const eurekaBank = Number(save.player?.eurekaCoin) || 0
  const eurekaPending = Number(session?.eurekaPending) || 0
  const eurekaCoin = eurekaBank + eurekaPending
  const statusLine = useMemo(() => {
    if (!session) return '待命'
    const buff = story.buff || story.buff2
    const buffTag = buff ? `｜狀態：${buff}` : ''
    return `阿基米德・青年篇｜檢查點 ${checkpointLabel(session.checkpoint_id)}｜理智 [${bar(session.sanity, SANITY_MAX)}] ${session.sanity}/${SANITY_MAX}｜靈感 [${bar(session.insight, INSIGHT_MAX, '💡', '·')}] ${session.insight}/${INSIGHT_MAX}${buffTag}`
  }, [session, story])

  useEffect(() => {
    persistSave(save)
  }, [save])

  useEffect(() => {
    if (!eurekaToast) return undefined
    const t = window.setTimeout(() => setEurekaToast(null), 2200)
    return () => window.clearTimeout(t)
  }, [eurekaToast])

  useEffect(() => {
    if (!endingToast) return undefined
    const t = window.setTimeout(() => setEndingToast(null), 4200)
    return () => window.clearTimeout(t)
  }, [endingToast])

  function showEurekaGain(amount) {
    if (!amount) return
    setEurekaToast({ amount, key: Date.now() })
    setCoinPulse(true)
    window.setTimeout(() => setCoinPulse(false), 600)
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext
      if (!Ctx) return
      const ctx = new Ctx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(820, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(1240, ctx.currentTime + 0.1)
      gain.gain.setValueAtTime(0.05, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.2)
      window.setTimeout(() => ctx.close(), 300)
    } catch {
      /* ignore audio failures */
    }
  }

  function chapterRewardOf(chapterId) {
    return Number(getChapter(chapterId)?.rewards?.eurekaCoin) || 0
  }

  function applyNodeEureka(fromSave, n) {
    const { save: next, granted } = grantSessionNodeEureka(fromSave, n)
    if (granted?.eurekaCoin) showEurekaGain(granted.eurekaCoin)
    return next
  }

  function goLobby() {
    setScreen('lobby')
    setPhase('lines')
    setAnalysis(null)
    setInsightNote(null)
    setJumpTarget(null)
    setFlavorLines([])
    setLineHistory([])
    setNodeIndex(0)
    setLineIndex(0)
    setQuizInput('')
    window.scrollTo(0, 0)
  }

  function beginChapter(chapterId) {
    if (!isChapterPlayable(chapterId)) return
    if (!save.progress.unlocked_chapters.includes(chapterId)) return
    let next = startChapterSession(save, chapterId, chapterRewardOf)
    setSave(next)
    setNodeIndex(0)
    setLineIndex(0)
    setPhase('lines')
    setQuizInput('')
    setAnalysis(null)
    setInsightNote(null)
    setJumpTarget(null)
    setFlavorLines([])
    setLineHistory([])
    setScreen('chapter')
    const ch = getChapter(chapterId)
    const first = ch?.nodes?.[0]
    if (first?.checkpoint) {
      next = writeCheckpoint(next, {
        checkpointId: first.checkpoint,
        nodeId: first.id,
        sanity: SANITY_MAX,
        insight: INSIGHT_MAX,
        story: {},
      })
      setSave(next)
    }
  }

  function activeLinesFor(n, st = story) {
    if (!n) return []
    if (n.type === 'philosophy') {
      return filterLines(
        [{ speaker: 'SYS', text: n.prompt }, ...(n.lines || [])],
        st,
      )
    }
    if (n.type === 'quiz' || n.type === 'problem') {
      return filterLines(n.setup || [], st)
    }
    return filterLines(n.lines || [], st)
  }

  function advanceLines() {
    if (!node) return
    const lines = activeLinesFor(node)
    if (lineIndex + 1 < lines.length) {
      setLineIndex(lineIndex + 1)
      return
    }
    if (node.type === 'narrative') {
      goNextNode()
      return
    }
    if (node.type === 'command' || node.type === 'branch') {
      setPhase('choices')
      return
    }
    if (node.type === 'quiz') {
      setPhase('quiz')
      return
    }
    if (node.type === 'problem') {
      setPhase('problem')
      return
    }
    if (node.type === 'philosophy') {
      setPhase('choices')
      return
    }
    if (node.type === 'ending') {
      finishChapter()
      return
    }
  }

  function enterNode(index, fromSave = save) {
    const ch = getChapter(fromSave.current_session.chapter_id)
    const n = ch.nodes[index]
    setNodeIndex(index)
    setLineIndex(0)
    setQuizInput('')
    setInsightNote(null)
    setAnalysis(null)
    setJumpTarget(null)
    setFlavorLines([])
    if (n?.type === 'ending') {
      setLineHistory([])
    }
    if (!n) return
    const st = fromSave.current_session.story || {}
    let working = fromSave
    // 若已選定結局，禁止誤入另一條 ending
    if (
      n.type === 'ending' &&
      st.chosenEndingId &&
      n.id !== st.chosenEndingId
    ) {
      jumpToNodeId(st.chosenEndingId, fromSave)
      return
    }
    // 章內頓悟：先加 pending（toast）；通關才入永久庫
    if (
      (n.type === 'narrative' || n.type === 'philosophy' || n.type === 'ending') &&
      n.rewards?.eurekaCoin
    ) {
      working = applyNodeEureka(working, n)
    }
    if (n.checkpoint) {
      const updated = writeCheckpoint(working, {
        checkpointId: n.checkpoint,
        nodeId: n.id,
        sanity: working.current_session.sanity,
        insight: working.current_session.insight,
        story: st,
      })
      setSave(updated)
    } else {
      setSave(updateSession(working, { node_id: n.id }))
    }
    if (n.type === 'quiz') {
      setPhase(filterLines(n.setup || [], st).length ? 'lines' : 'quiz')
    } else if (n.type === 'problem') {
      setPhase(filterLines(n.setup || [], st).length ? 'lines' : 'problem')
    } else if (n.type === 'philosophy') {
      setPhase('lines')
    } else if (n.type === 'command' || n.type === 'branch') {
      setPhase(filterLines(n.lines || [], st).length ? 'lines' : 'choices')
    } else {
      setPhase('lines')
    }
  }

  function jumpToNodeId(nodeId, fromSave = save) {
    const ch = getChapter(fromSave.current_session.chapter_id)
    const idx = ch.nodes.findIndex((n) => n.id === nodeId)
    if (idx < 0) {
      finishChapter(fromSave)
      return
    }
    enterNode(idx, fromSave)
  }

  function goNextNode(fromSave = save) {
    const ch = getChapter(fromSave.current_session.chapter_id)
    const jump = pendingJumpRef.current
    // 結局只允許 jump 進入，禁止線性走到下一則 ending
    if (jump) {
      setJumpTarget(null)
      jumpToNodeId(jump, fromSave)
      return
    }
    let nextIdx = nodeIndex + 1
    while (nextIdx < ch.nodes.length && ch.nodes[nextIdx].type === 'ending') {
      nextIdx += 1
    }
    if (nextIdx >= ch.nodes.length) {
      finishChapter(fromSave)
      return
    }
    enterNode(nextIdx, fromSave)
  }

  function finishChapter(fromSave = save) {
    const chapterId = fromSave.current_session.chapter_id
    const ch = getChapter(chapterId)
    const endingId =
      fromSave.current_session?.story?.chosenEndingId || null
    const { save: completed, granted, endingUnlock } = completeChapter(
      fromSave,
      chapterId,
      ch?.rewards,
      { endingId, endings: ch?.endings || [] },
    )
    let next = completed
    const unlock = nextUnlockFor(chapterId)
    if (unlock) next = unlockChapter(next, unlock)
    if (endingUnlock?.isNew) {
      setEndingToast({
        key: Date.now(),
        ...endingUnlock,
      })
      if (endingUnlock.bonusEureka > 0) {
        showEurekaGain(endingUnlock.bonusEureka)
      }
    } else if (
      granted?.eurekaCoin &&
      !(Number(fromSave.current_session?.eurekaPending) > 0)
    ) {
      showEurekaGain(granted.eurekaCoin)
    }
    setSave(next)
    setScreen('lobby')
    setPhase('lines')
    setJumpTarget(null)
    setFlavorLines([])
    setLineHistory([])
    setNodeIndex(0)
    setLineIndex(0)
    setQuizInput('')
    setAnalysis(null)
    setInsightNote(null)
    window.scrollTo(0, 0)
  }

  function playFlavor(lines, nextSave, jumpId = null) {
    setSave(nextSave)
    setFlavorLines(lines || [])
    setJumpTarget(jumpId)
    setPhase('flavor')
    setLineIndex(0)
  }

  function pushHistory(line) {
    if (!line) return
    setLineHistory((prev) => [...prev, line].slice(-HISTORY_MAX))
  }

  function onBranchOrCommandPick(option) {
    if (!session) return
    let nextSave = save
    if (option.kind === 'insight') {
      if (session.insight <= 0) {
        setInsightNote('靈感值不足。請改用姐姐推導或自行思考。')
        return
      }
      nextSave = updateSession(save, { insight: session.insight - 1 })
    }
    if (option.story) {
      nextSave = patchStory(nextSave, option.story)
    }
    if (option.flags) {
      nextSave = applyFlags(nextSave, option.flags)
    }
    setInsightNote(null)
    if (option.resultLines?.length) {
      playFlavor(option.resultLines, nextSave, option.endingId || null)
      return
    }
    if (option.endingId) {
      jumpToNodeId(option.endingId, nextSave)
      return
    }
    goNextNode(nextSave)
  }

  function onPhilosophyPick(option) {
    let next = applyFlags(save, option.flags || {})
    if (option.endingId) {
      next = patchStory(next, { chosenEndingId: option.endingId })
    }
    next = updateSession(next, { node_id: node.id })
    if (option.resultLines?.length) {
      playFlavor(option.resultLines, next, option.endingId || null)
      return
    }
    if (option.endingId) {
      jumpToNodeId(option.endingId, next)
      return
    }
    goNextNode(next)
  }

  function continueTypewriter(currentLine) {
    if (!currentLine) return
    // 交給 TypewriterNarrative：未打完則顯示完整；已打完才會呼叫 onAdvance
    typewriterRef.current?.continueOrReveal()
  }

  function advanceAfterTyped(currentLine) {
    pushHistory(currentLine)
    if (phase === 'flavor') {
      advanceFlavorWithSave(save)
      return
    }
    advanceLines()
  }

  function advanceFlavorWithSave(fromSave) {
    if (lineIndex + 1 < flavorLines.length) {
      setLineIndex(lineIndex + 1)
      return
    }
    const jump = pendingJumpRef.current
    setFlavorLines([])
    if (jump) {
      setJumpTarget(null)
      jumpToNodeId(jump, fromSave)
      return
    }
    goNextNode(fromSave)
  }

  function advanceFlavor() {
    advanceFlavorWithSave(save)
  }

  function goPrevTypewriter() {
    if (lineIndex <= 0) return
    setLineHistory((prev) => prev.slice(0, -1))
    setLineIndex(lineIndex - 1)
  }

  function submitQuiz() {
    if (!node?.question || !session) return
    const ok = checkStoryAnswer(node.question, quizInput)
    if (ok) {
      let next = writeCheckpoint(save, {
        checkpointId: node.checkpoint || session.checkpoint_id,
        nodeId: node.id,
        sanity: session.sanity,
        insight: session.insight,
      })
      setSave(next)
      setAnalysis(null)
      setQuizInput('')
      goNextNode(next)
      return
    }
    // wrong
    const sanity = Math.max(0, session.sanity - 1)
    let next = updateSession(save, { sanity })
    setSave(next)
    setAnalysis(node.analysis || { speaker: '姐姐', text: '再檢查一次條件與未知數。' })
    setPhase('analysis')
    if (sanity <= 0) {
      setPhase('crash')
      setScreen('crash')
    }
  }

  function retryAfterAnalysis() {
    setQuizInput('')
    setPhase('quiz')
    setAnalysis(null)
  }

  function useInsightHint() {
    if (!session || session.insight <= 0) {
      setInsightNote('靈感值不足。')
      return
    }
    const next = updateSession(save, { insight: session.insight - 1 })
    setSave(next)
    setInsightNote(
      node.analysis?.text ||
        '弟弟：先標出「已知／未知」，再看哪兩個量成比例或能列等式。',
    )
  }

  function doCrashRestore() {
    const restored = restoreCheckpoint(save)
    setSave(restored)
    const ch = getChapter(restored.current_session.chapter_id)
    const snapNodeId = restored.current_session.snapshot?.node_id
    const idx = Math.max(
      0,
      ch.nodes.findIndex((n) => n.id === snapNodeId),
    )
    setScreen('chapter')
    enterNode(idx === -1 ? 0 : idx, restored)
  }

  function startPractice(chapterId) {
    if (!save.progress.practice_unlocked.includes(chapterId)) return
    const ch = getChapter(chapterId)
    const q = drawPracticeQuestion(ch?.gradeBand || 1, [])
    setPracticeUsed(q ? [q.id] : [])
    setPracticeQ(q)
    setPracticeFeedback(null)
    setQuizInput('')
    setScreen('practice')
  }

  function submitPractice() {
    if (!practiceQ) return
    const ok = checkBankAnswer(practiceQ, quizInput)
    if (ok) {
      setPracticeFeedback({ ok: true, text: '正確。載入下一題…' })
      const nextUsed = [...practiceUsed, practiceQ.id]
      const ch = getChapter('ARCHIMEDES_YOUTH')
      const q = drawPracticeQuestion(ch.gradeBand, nextUsed)
      setPracticeUsed(nextUsed)
      setTimeout(() => {
        setPracticeQ(q)
        setPracticeFeedback(null)
        setQuizInput('')
      }, 600)
      return
    }
    setPracticeFeedback({
      ok: false,
      text: '不正確。查看原題條件後重試（練習模式不扣理智值）。',
    })
  }

  // Space / Enter → 目前畫面的主按鈕（繼續／進入／送出／還原…）
  primaryKeyRef.current = () => {
    if (screen === 'boot') {
      goLobby()
      return
    }
    if (screen === 'crash') {
      doCrashRestore()
      return
    }
    if (screen === 'practice') {
      if (String(quizInput || '').trim()) submitPractice()
      return
    }
    if (screen !== 'chapter' || !node) return
    if (phase === 'lines' || phase === 'flavor') {
      continueTypewriter(
        (phase === 'flavor' ? flavorLines : activeLinesFor(node))[lineIndex],
      )
      return
    }
    if (phase === 'problem') {
      goNextNode()
      return
    }
    if (phase === 'analysis') {
      retryAfterAnalysis()
      return
    }
    if (phase === 'quiz' && String(quizInput || '').trim()) {
      submitQuiz()
    }
  }

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key !== 'Enter' && e.key !== ' ') return
      if (e.repeat) return
      const t = e.target
      const typing =
        t?.tagName === 'INPUT' ||
        t?.tagName === 'TEXTAREA' ||
        t?.isContentEditable
      // 輸入框內：Enter 由 input 自己送出；空白不搶成「繼續」
      if (typing) return
      e.preventDefault()
      primaryKeyRef.current()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // ——— screens ———

  if (screen === 'boot') {
    return (
      <div className="nv-root">
        <div className="nv-crt">
          <div className="nv-scanlines" aria-hidden />
          <pre className="nv-boot">
{`> 啟動 數感終端機…
> ${PRODUCT_NAME_EN}
> ${PRODUCT_NAME_ZH}`}
          </pre>
          <button type="button" className="nv-btn" onClick={goLobby}>
            [1] 進入大廳
          </button>
        </div>
      </div>
    )
  }

  if (screen === 'crash') {
    return (
      <div className="nv-root">
        <div className="nv-crt nv-crash">
          <div className="nv-scanlines" aria-hidden />
          <PanelBox tone="error">
            <div>[系統錯誤] 系統崩潰 — 邏輯崩解</div>
            <div>理智值: [░░░░░] 0/5</div>
            <div>&gt; 終端：邏輯崩潰。正在載入最近檢查點快照…</div>
            <div>&gt; 檢查點：{checkpointLabel(session?.snapshot?.checkpoint_id)}</div>
          </PanelBox>
          <button type="button" className="nv-btn primary" onClick={doCrashRestore}>
            還原檢查點
          </button>
        </div>
      </div>
    )
  }

  if (screen === 'lobby') {
    const selected = chapterLobbyMeta(selectedChapterId)
    const selectedUnlocked =
      save.progress.unlockedEndings?.[selectedChapterId] || []
    const selectedEndingTotal = selected.endings.length
    const selectedEurekaGot =
      Number(save.progress.eureka_by_chapter?.[selectedChapterId]) || 0
    const selectedEurekaMax =
      selected.eurekaMax || selectedEndingTotal + (selected.playable ? 1 : 0)
    const canEnter =
      save.progress.unlocked_chapters.includes(selectedChapterId) &&
      selected.playable
    const hasCompleted = save.progress.completed_chapters.includes(
      selectedChapterId,
    )
    const practiceOn = save.progress.practice_unlocked.includes(
      selectedChapterId,
    )

    return (
      <div className="nv-root">
        {eurekaToast ? (
          <div key={eurekaToast.key} className="nv-eureka-toast">
            獲得 Eureka 幣 +{eurekaToast.amount}
          </div>
        ) : null}
        {endingToast ? (
          <div key={endingToast.key} className="nv-ending-toast">
            <div className="nv-ending-toast-title">成功解鎖新結局！</div>
            <div className="nv-ending-toast-body">
              {endingToast.badgeIcon || '🏆'}【{endingToast.title}】
            </div>
            <div className="nv-ending-toast-meta">
              章節進度：{endingToast.unlockedCount}/
              {endingToast.totalEndings}（
              {endingToast.totalEndings
                ? Math.round(
                    (endingToast.unlockedCount / endingToast.totalEndings) *
                      100,
                  )
                : 0}
              %）
              {endingToast.bonusEureka > 0
                ? ` ｜ Eureka 幣 +${endingToast.bonusEureka}`
                : ''}
            </div>
          </div>
        ) : null}
        <div className="nv-crt">
          <div className="nv-scanlines" aria-hidden />
          <header className="nv-header nv-header-lobby">
            <div className="nv-header-titles">
              <div>{PRODUCT_NAME_ZH}</div>
              <div className="nv-muted">{PRODUCT_NAME_EN}</div>
            </div>
            <div className={`nv-coin-bar lobby${coinPulse ? ' pulse' : ''}`}>
              🪙 Eureka 幣：{eurekaCoin}
            </div>
          </header>
          <PanelBox>[座標] 台北・2026・終端機</PanelBox>

          <div className="nv-chapter-card">
            <div className="nv-chapter-card-title">
              【{selected.title}篇】
            </div>
            {selected.subtitle ? (
              <div className="nv-chapter-card-stats">{selected.subtitle}</div>
            ) : null}
            {!selected.playable ? (
              <div className="nv-chapter-card-stats">
                🔒 本章劇本尚未開放（MVP 僅阿基米德・青年可玩）
              </div>
            ) : (
              <>
                <div className="nv-chapter-card-stats">
                  🏆 結局完成度：{selectedUnlocked.length} /{' '}
                  {selectedEndingTotal || '—'}
                  {selectedEndingTotal
                    ? `（${Math.round((selectedUnlocked.length / selectedEndingTotal) * 100)}%）`
                    : ''}
                </div>
                <div className="nv-chapter-card-stats">
                  🟡 Eureka 幣已獲得：{selectedEurekaGot} /{' '}
                  {selectedEurekaMax || '—'}
                </div>
              </>
            )}
            <div className="nv-row">
              <button
                type="button"
                className="nv-btn primary"
                disabled={!canEnter}
                onClick={() => beginChapter(selectedChapterId)}
              >
                {hasCompleted ? '再次進入 _' : '進入 _'}
              </button>
              <button
                type="button"
                className="nv-btn"
                disabled={!selected.endings.length}
                onClick={() => {
                  setArchiveChapterId(selectedChapterId)
                  setScreen('archive')
                }}
              >
                結局圖鑑 _
              </button>
              {practiceOn ? (
                <button
                  type="button"
                  className="nv-btn"
                  onClick={() => startPractice(selectedChapterId)}
                >
                  練習 _
                </button>
              ) : null}
            </div>
          </div>

          <div className="nv-map">
            {MATHEMATICIANS.map((m) => (
              <div key={m.id} className="nv-map-row">
                <span className="nv-map-name">
                  {m.icon} {m.label}
                </span>
                <div className="nv-map-eras">
                  {ERAS.map((era, i) => {
                    const id = m.chapters[era]
                    const unlocked = save.progress.unlocked_chapters.includes(id)
                    const completed =
                      save.progress.completed_chapters.includes(id)
                    const playable = isChapterPlayable(id)
                    const selected = id === selectedChapterId
                    return (
                      <span key={era} className="nv-map-era">
                        {i > 0 ? <span className="nv-arrow">───&gt;</span> : null}
                        <button
                          type="button"
                          className={`nv-chip${completed ? ' done' : ''}${selected ? ' selected' : ''}${!unlocked ? ' locked' : ''}${unlocked && !playable ? ' soon' : ''}`}
                          onClick={() => setSelectedChapterId(id)}
                          title={
                            unlocked
                              ? playable
                                ? ERA_LABEL[era]
                                : `${ERA_LABEL[era]}（尚未開放）`
                              : `${ERA_LABEL[era]}（未解鎖）`
                          }
                        >
                          {ERA_SHORT[era]}
                          {completed ? '：✓' : !unlocked ? '：🔒' : playable ? '' : '：…'}
                        </button>
                      </span>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
          <PanelBox>
            🌌 理性的神殿（終章）［進度：{completedCount}/15］
            {completedCount >= 15 ? '［已開放］' : '（🔒 需通關 15/15）'}
          </PanelBox>
        </div>
      </div>
    )
  }

  if (screen === 'archive') {
    const ch = getChapter(archiveChapterId)
    const unlocked = save.progress.unlockedEndings?.[archiveChapterId] || []
    const endings = ch?.endings || []
    return (
      <div className="nv-root">
        <div className="nv-crt">
          <div className="nv-scanlines" aria-hidden />
          <PanelBox>
            🏆 結局圖鑑｜{ch?.title || archiveChapterId}（{unlocked.length}/
            {endings.length}）
          </PanelBox>
          <div className="nv-archive-list">
            {endings.map((ending) => {
              const open = unlocked.includes(ending.id)
              return (
                <div
                  key={ending.id}
                  className={`nv-archive-card${open ? ' open' : ' locked'}`}
                >
                  {open ? (
                    <>
                      <div className="nv-archive-title">
                        {ending.badgeIcon}【{ending.title}】（已解鎖）
                      </div>
                      <p className="nv-archive-desc">{ending.description}</p>
                    </>
                  ) : (
                    <>
                      <div className="nv-archive-title">🔒【？？？？？？？？】（未解鎖）</div>
                      <p className="nv-archive-desc nv-muted">
                        hint: {ending.hint || '尚未發現此結局的條件……'}
                      </p>
                    </>
                  )}
                </div>
              )
            })}
          </div>
          <button type="button" className="nv-btn" onClick={goLobby}>
            返回大廳 _
          </button>
        </div>
      </div>
    )
  }

  if (screen === 'practice') {
    return (
      <div className="nv-root">
        <div className="nv-crt">
          <div className="nv-scanlines" aria-hidden />
          <PanelBox>[練習] 阿基米德・青年｜國一題庫（七上＋七下）隨機</PanelBox>
          {practiceQ ? (
            <div className="nv-body">
              <div className="nv-line">
                <MathText text={practiceQ.question} />
              </div>
              {practiceQ.image ? (
                <img
                  className="nv-qimg"
                  src={practiceQ.image}
                  alt="題目圖"
                />
              ) : null}
              {practiceQ.options?.length ? (
                <div className="nv-options">
                  {practiceQ.options.map((o) => (
                    <button
                      key={o.letter}
                      type="button"
                      className="nv-btn"
                      onClick={() => setQuizInput(o.letter)}
                    >
                      {o.letter}. <MathText text={o.text} />
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  className="nv-input"
                  value={quizInput}
                  placeholder="輸入數值答案"
                  onChange={(e) => setQuizInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && submitPractice()}
                />
              )}
              <div className="nv-row">
                <button type="button" className="nv-btn primary" onClick={submitPractice}>
                  送出
                </button>
                <button type="button" className="nv-btn" onClick={goLobby}>
                  大廳
                </button>
              </div>
              {practiceFeedback ? (
                <p className={practiceFeedback.ok ? 'nv-ok' : 'nv-err'}>
                  {practiceFeedback.text}
                </p>
              ) : null}
            </div>
          ) : (
            <p className="nv-err">題庫無題可抽。</p>
          )}
        </div>
      </div>
    )
  }

  // chapter play
  if (!chapter || !node || !session) {
    return (
      <div className="nv-root">
        <div className="nv-crt">
          <p>工作階段遺失</p>
          <button type="button" className="nv-btn" onClick={goLobby}>
            大廳
          </button>
        </div>
      </div>
    )
  }

  const displayLines =
    phase === 'flavor' ? flavorLines : activeLinesFor(node)
  const currentLine = displayLines[lineIndex]
  const lineKey = `${node.id}:${phase}:${lineIndex}:${currentLine?.text || ''}`
  const linkedQuestion =
    node.type === 'branch' ? findLinkedQuestion(chapter, nodeIndex) : null
  const bankRefForDev =
    node.question?.bankRef || linkedQuestion?.question?.bankRef || null

  return (
    <div className="nv-root">
      <div className="nv-crt">
        <div className="nv-scanlines" aria-hidden />
        <PanelBox>{statusLine}</PanelBox>
        <div className={`nv-coin-bar${coinPulse ? ' pulse' : ''}`}>
          🪙 Eureka 幣：{eurekaCoin}
        </div>
        {eurekaToast ? (
          <div key={eurekaToast.key} className="nv-eureka-toast">
            獲得 Eureka 幣 +{eurekaToast.amount}
          </div>
        ) : null}

        <div className="nv-body">
          {(phase === 'lines' || phase === 'flavor') && currentLine ? (
            <TypewriterNarrative
              ref={typewriterRef}
              lineKey={lineKey}
              history={lineHistory}
              line={currentLine}
              hasMore={lineIndex + 1 < displayLines.length}
              canGoPrev={lineIndex > 0}
              onPrev={goPrevTypewriter}
              onAdvance={() => advanceAfterTyped(currentLine)}
              onBuffGranted={(buff) => {
                setSave((prev) => patchStory(prev, { buff }))
              }}
            />
          ) : null}

          {phase === 'problem' && node.question ? (
            <>
              <div className="nv-line">
                <MathText text={node.question.stem} />
              </div>
              {node.question.math ? (
                <div className="nv-math">
                  <MathBlock tex={node.question.math} />
                </div>
              ) : null}
              <button
                type="button"
                className="nv-btn primary"
                onClick={() => goNextNode()}
              >
                繼續 _
              </button>
            </>
          ) : null}

          {phase === 'choices' &&
          (node.type === 'command' || node.type === 'branch') ? (
            <>
              {linkedQuestion?.question ? (
                <div className="nv-branch-question">
                  <div className="nv-line">
                    <MathText text={linkedQuestion.question.stem} />
                  </div>
                  {linkedQuestion.question.math ? (
                    <div className="nv-math">
                      <MathBlock tex={linkedQuestion.question.math} />
                    </div>
                  ) : null}
                </div>
              ) : null}
              <p className="nv-prompt">{node.prompt}</p>
              <div className="nv-options">
                {node.options.map((opt, i) => (
                  <button
                    key={opt.id}
                    type="button"
                    className="nv-btn"
                    onClick={() => onBranchOrCommandPick(opt)}
                  >
                    [{i + 1}] {opt.label}
                    <span className="nv-detail">
                      <MathText text={opt.detail} />
                    </span>
                  </button>
                ))}
              </div>
              {insightNote ? <p className="nv-err">{insightNote}</p> : null}
            </>
          ) : null}

          {phase === 'choices' && node.type === 'philosophy' ? (
            <>
              {node.prompt ? <p className="nv-prompt">{node.prompt}</p> : null}
              <p className="nv-note">{node.note}</p>
              <div className="nv-philosophy-stances">
                {(node.lines || []).map((line, i) => (
                  <div key={`${line.speaker}-${i}`} className="nv-line">
                    <span className="nv-speaker">{speakerPrefix(line.speaker)}</span>{' '}
                    <MathText text={line.text} />
                  </div>
                ))}
              </div>
              <div className="nv-options">
                {node.options.map((opt, i) => (
                  <button
                    key={opt.id}
                    type="button"
                    className="nv-btn"
                    onClick={() => onPhilosophyPick(opt)}
                  >
                    [{i + 1}] {opt.label}
                    <span className="nv-detail">
                      {opt.detail ? (
                        <>
                          <MathText text={opt.detail} />
                          {opt.flagNote ? ` ｜ ${opt.flagNote}` : ''}
                        </>
                      ) : (
                        <>=&gt; {opt.flagNote}</>
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </>
          ) : null}

          {phase === 'quiz' && node.question ? (
            <>
              <div className="nv-line">
                <MathText text={node.question.stem} />
              </div>
              {node.question.math ? (
                <div className="nv-math">
                  <MathBlock tex={node.question.math} />
                </div>
              ) : null}
              {node.question.options ? (
                <div className="nv-options">
                  {node.question.options.map((o) => (
                    <button
                      key={o.letter}
                      type="button"
                      className="nv-btn"
                      onClick={() => setQuizInput(o.letter)}
                    >
                      {o.letter}. {o.text}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  className="nv-input"
                  value={quizInput}
                  autoFocus
                  placeholder="輸入答案"
                  onChange={(e) => setQuizInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && submitQuiz()}
                />
              )}
              <div className="nv-row">
                <button
                  type="button"
                  className="nv-btn primary"
                  disabled={!quizInput.trim()}
                  onClick={submitQuiz}
                >
                  [1] 送出
                </button>
                <button type="button" className="nv-btn" onClick={useInsightHint}>
                  [2] 靈感提示 (−1)
                </button>
              </div>
              {insightNote ? <p className="nv-ok">{insightNote}</p> : null}
              {quizInput && node.question.options ? (
                <p className="nv-muted">已選：{quizInput}</p>
              ) : null}
            </>
          ) : null}

          {phase === 'analysis' && analysis ? (
            <>
              <PanelBox tone="error">
                <div>[系統錯誤] 偵測到邏輯異常！</div>
                <div>
                  理智值: [{bar(session.sanity, SANITY_MAX)}] {session.sanity}/
                  {SANITY_MAX}（−1）
                </div>
              </PanelBox>
              <div className="nv-line">
                <span className="nv-speaker">{speakerPrefix(analysis.speaker)}</span>{' '}
                <MathText text={analysis.text} />
              </div>
              <div className="nv-row">
                <button type="button" className="nv-btn primary" onClick={retryAfterAnalysis}>
                  [1] 重試
                </button>
                <button type="button" className="nv-btn" onClick={useInsightHint}>
                  [2] 靈感提示 (−1)
                </button>
              </div>
              {insightNote ? <p className="nv-ok">{insightNote}</p> : null}
            </>
          ) : null}
        </div>

        <button
          type="button"
          className="nv-btn ghost"
          onClick={() => {
            setSave(clearSession(save, chapterRewardOf))
            goLobby()
          }}
        >
          中止並回大廳
        </button>
      </div>
      <DevBankAside bankRef={bankRefForDev} />
    </div>
  )
}
