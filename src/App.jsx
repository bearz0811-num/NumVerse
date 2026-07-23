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
  // 阿基米德・壯年
  CHECKPOINT_P1_LINK: '重連',
  CHECKPOINT_P1_WALL: '城牆',
  CHECKPOINT_P2_CATAPULT: '投石',
  CHECKPOINT_P2_CATAPULT_PROBLEM: '投石・題面',
  CHECKPOINT_P2_CATAPULT_QUIZ: '投石・答題',
  CHECKPOINT_P3_CRANE: '起重',
  CHECKPOINT_P3_CRANE_PROBLEM: '起重・題面',
  CHECKPOINT_P3_CRANE_EXPAND: '起重・展開',
  CHECKPOINT_P3_CRANE_QUIZ: '起重・答題',
  CHECKPOINT_P4_GEAR: '齒輪',
  CHECKPOINT_P4_GEAR_PROBLEM: '齒輪・題面',
  CHECKPOINT_P4_GEAR_SIMPLIFY: '齒輪・化簡',
  CHECKPOINT_P5_RANGE: '測距',
  CHECKPOINT_P5_RANGE_PROBLEM: '測距・題面',
  CHECKPOINT_P5_RANGE_QUIZ: '測距・答題',
  CHECKPOINT_P6_CALIB: '校準',
  CHECKPOINT_P6_CALIB_PROBLEM: '校準・題面',
  CHECKPOINT_P6_CALIB_QUIZ: '校準・答題',
  // 阿基米德・暮年
  CHECKPOINT_E1_LINK: '連線',
  CHECKPOINT_E2_REUNION: '再會',
  CHECKPOINT_E3_CHORD: '弦長',
  CHECKPOINT_E3_CHORD_PROBLEM: '弦長・題面',
  CHECKPOINT_E3_CHORD_QUIZ: '弦長・答題',
  CHECKPOINT_E4_ANGLE: '圓心角',
  CHECKPOINT_E4_ANGLE_PROBLEM: '圓心角・題面',
  CHECKPOINT_E4_ANGLE_QUIZ: '圓心角・答題',
  CHECKPOINT_E5_ARC: '弧長',
  CHECKPOINT_E5_ARC_PROBLEM: '弧長・題面',
  CHECKPOINT_E5_ARC_QUIZ: '弧長・答題',
  CHECKPOINT_E6_CONE: '圓錐',
  CHECKPOINT_E6_CONE_PROBLEM: '圓錐・題面',
  CHECKPOINT_E6_CONE_LINK: '圓錐・對應',
  CHECKPOINT_E6_CONE_QUIZ: '圓錐・底半徑',
  CHECKPOINT_E6_CONE_OUTRO: '圓錐・頓悟',
  CHECKPOINT_E7_SECTOR: '扇形',
  CHECKPOINT_E7_SECTOR_PROBLEM: '扇形・題面',
  CHECKPOINT_E7_SECTOR_QUIZ: '扇形・答題',
  CHECKPOINT_E8_CIRCLES: '勿碰圓',
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
        knowledgeCard: data?.knowledgeCard || null,
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
  // Prod build：整段 early-return，避免掛上 aside（字串仍可能留在 bundle，verify-prod 會檢查 UI 閘）
  if (!import.meta.env.DEV) return null
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

function filterLines(lines, story = {}, { suppressEurekaGainCopy = false } = {}) {
  return (lines || []).filter((line) => {
    if (
      suppressEurekaGainCopy &&
      /獲得【Eureka|Eureka 幣\s*[×xX]/.test(String(line?.text || ''))
    ) {
      return false
    }
    if (!line.whenStory) return true
    return Object.entries(line.whenStory).every(
      ([key, value]) => story[key] === value,
    )
  })
}

function chapterEurekaSettled(save, chapterId) {
  if (!chapterId) return false
  const claimed = save?.progress?.claimed_rewards || []
  const completed = save?.progress?.completed_chapters || []
  return (
    claimed.includes(`chapter:${chapterId}`) || completed.includes(chapterId)
  )
}

/** 重玩時隱藏「又獲得 Eureka」的劇情字（與 grantSessionNodeEureka 方案 B 對齊） */
function shouldSuppressEurekaCopy(save, node) {
  if (!save?.current_session || !node) return false
  const chapterId = save.current_session.chapter_id
  if (node.type === 'ending') {
    return (save.progress?.unlockedEndings?.[chapterId] || []).includes(node.id)
  }
  return chapterEurekaSettled(save, chapterId)
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
  const [screen, setScreen] = useState('boot') // boot | lobby | chapter | practice | crash | archive | settlement
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
  const [endingToast, setEndingToast] = useState(null) // unlock banner (legacy / optional)
  const [knowledgeToast, setKnowledgeToast] = useState(null) // chapter knowledge card
  const [settlement, setSettlement] = useState(null) // chapter clear summary
  const [coinPulse, setCoinPulse] = useState(false)
  const [archiveChapterId, setArchiveChapterId] = useState(null)
  const [selectedChapterId, setSelectedChapterId] = useState('ARCHIMEDES_YOUTH')
  const primaryKeyRef = useRef(() => {})
  const typewriterRef = useRef(null)
  const pendingJumpRef = useRef(null)
  const skipAutoTokenRef = useRef('')

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
    const skipTag = session.skipNarrative ? '｜跳過敘事' : ''
    const chapterTitle = chapter?.title || '未知章節'
    return `${chapterTitle}篇｜檢查點 ${checkpointLabel(session.checkpoint_id)}｜理智 [${bar(session.sanity, SANITY_MAX)}] ${session.sanity}/${SANITY_MAX}｜靈感 [${bar(session.insight, INSIGHT_MAX, '💡', '·')}] ${session.insight}/${INSIGHT_MAX}${buffTag}${skipTag}`
  }, [session, story, chapter?.title])

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

  useEffect(() => {
    if (!knowledgeToast) return undefined
    const t = window.setTimeout(() => setKnowledgeToast(null), 5600)
    return () => window.clearTimeout(t)
  }, [knowledgeToast])

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
    setSettlement(null)
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
    const endingDef = ch?.endings?.find((e) => e.id === endingId)
    const nextCh = unlock ? getChapter(unlock) : null

    if (endingUnlock?.isNew && endingUnlock.bonusEureka > 0) {
      showEurekaGain(endingUnlock.bonusEureka)
    } else if (
      granted?.eurekaCoin &&
      !(Number(fromSave.current_session?.eurekaPending) > 0)
    ) {
      showEurekaGain(granted.eurekaCoin)
    }

    setSettlement({
      chapterTitle: ch?.title || chapterId,
      endingTitle: endingUnlock?.title || endingDef?.title || null,
      badgeIcon: endingUnlock?.badgeIcon || endingDef?.badgeIcon || '🏆',
      isNewEnding: Boolean(endingUnlock?.isNew),
      unlockedCount:
        endingUnlock?.unlockedCount ??
        (next.progress?.unlockedEndings?.[chapterId] || []).length,
      totalEndings: endingUnlock?.totalEndings || ch?.endings?.length || 0,
      knowledgeLine: ch?.knowledgeCard?.line || null,
      unlockedNextTitle: nextCh?.title || null,
      unlockTeaser: unlock ? ch?.unlockTeaser || null : null,
    })
    setEndingToast(null)
    setKnowledgeToast(null)
    setSave(next)
    setScreen('settlement')
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

  function beginChapter(chapterId, { skipNarrative: skip = false } = {}) {
    if (!isChapterPlayable(chapterId)) return
    if (!save.progress.unlocked_chapters.includes(chapterId)) return
    let next = startChapterSession(save, chapterId, chapterRewardOf)

    // 壯年／暮年開場：依前一章「最近一次結局」寫入 story
    const seedStory = {}
    if (chapterId === 'ARCHIMEDES_PRIME') {
      const ye = save.progress?.lastEndingId?.ARCHIMEDES_YOUTH
      if (ye) seedStory.youth_ending = ye
    }
    if (chapterId === 'GALILEO_PRIME') {
      const ye = save.progress?.lastEndingId?.GALILEO_YOUTH
      if (ye) seedStory.youth_ending = ye
    }
    if (chapterId === 'ARCHIMEDES_ELDER') {
      const ye = save.progress?.lastEndingId?.ARCHIMEDES_YOUTH
      const pe = save.progress?.lastEndingId?.ARCHIMEDES_PRIME
      if (ye) seedStory.youth_ending = ye
      if (pe) seedStory.prime_ending = pe
    }
    if (chapterId === 'GALILEO_ELDER') {
      const ye = save.progress?.lastEndingId?.GALILEO_YOUTH
      const pe = save.progress?.lastEndingId?.GALILEO_PRIME
      if (ye) seedStory.youth_ending = ye
      if (pe) seedStory.prime_ending = pe
    }
    if (Object.keys(seedStory).length) {
      next = updateSession(next, {
        story: { ...(next.current_session?.story || {}), ...seedStory },
      })
    }
    if (skip) {
      next = updateSession(next, { skipNarrative: true })
    }

    skipAutoTokenRef.current = ''
    setAnalysis(null)
    setInsightNote(null)
    setJumpTarget(null)
    setFlavorLines([])
    setLineHistory([])
    setQuizInput('')
    setScreen('chapter')
    enterNode(0, next)
  }

  function activeLinesFor(n, st = story) {
    if (!n) return []
    const suppress = shouldSuppressEurekaCopy(save, n)
    const opts = { suppressEurekaGainCopy: suppress }
    if (n.type === 'philosophy') {
      return filterLines(
        [{ speaker: 'SYS', text: n.prompt }, ...(n.lines || [])],
        st,
        opts,
      )
    }
    if (n.type === 'quiz' || n.type === 'problem') {
      return filterLines(n.setup || [], st, opts)
    }
    return filterLines(n.lines || [], st, opts)
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

  function playFlavor(lines, nextSave, jumpId = null) {
    // 跳過敘事：branch／哲學選完後的短回饋也略過，直接進下一節或結局
    if (nextSave.current_session?.skipNarrative) {
      setSave(nextSave)
      setFlavorLines([])
      setJumpTarget(null)
      if (jumpId) {
        jumpToNodeId(jumpId, nextSave)
        return
      }
      goNextNode(nextSave)
      return
    }
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

  // 跳過已讀敘事：自動略過 narrative／problem／branch；quiz 略過 setup 進答題
  useEffect(() => {
    if (screen !== 'chapter') return
    if (!session?.skipNarrative || !node) return

    const token = `${session.chapter_id}:${node.id}:${phase}:${nodeIndex}`
    if (skipAutoTokenRef.current === token) return
    skipAutoTokenRef.current = token

    if (phase === 'flavor') {
      const jump = pendingJumpRef.current
      setFlavorLines([])
      setJumpTarget(null)
      if (jump) jumpToNodeId(jump, save)
      else goNextNode(save)
      return
    }

    if (node.type === 'narrative' && phase === 'lines') {
      goNextNode()
      return
    }
    if (node.type === 'problem' && (phase === 'lines' || phase === 'problem')) {
      goNextNode()
      return
    }
    if (node.type === 'quiz' && phase === 'lines') {
      setPhase('quiz')
      return
    }
    if (
      (node.type === 'branch' || node.type === 'command') &&
      (phase === 'lines' || phase === 'choices')
    ) {
      const opts = node.options || []
      const pick =
        opts.find((o) => o.kind && o.kind !== 'insight') ||
        opts.find((o) => !/靈感/.test(o.label || '')) ||
        opts[0]
      if (pick) onBranchOrCommandPick(pick)
    }
  }, [screen, session?.skipNarrative, session?.chapter_id, node, nodeIndex, phase, save])

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

  function submitQuiz(answerOverride) {
    if (!node?.question || !session) return
    const value =
      answerOverride != null && String(answerOverride).trim() !== ''
        ? answerOverride
        : quizInput
    if (!String(value || '').trim()) return
    const ok = checkStoryAnswer(node.question, value)
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
    const hint = node?.hint
    const body =
      (typeof hint === 'string' ? hint : hint?.text) ||
      '先標出已知與未知，再想哪個公式或等式能把它們連起來。'
    const who = typeof hint === 'object' && hint?.speaker ? hint.speaker : null
    setInsightNote(who ? `${who}：${body}` : body)
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
    if (screen === 'settlement') {
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

  if (screen === 'settlement' && settlement) {
    return (
      <div className="nv-root">
        {eurekaToast ? (
          <div key={eurekaToast.key} className="nv-eureka-toast">
            獲得 Eureka 幣 +{eurekaToast.amount}
          </div>
        ) : null}
        <div className="nv-crt">
          <div className="nv-scanlines" aria-hidden />
          <header className="nv-header">
            <div className="nv-header-titles">
              <div>{PRODUCT_NAME_ZH}</div>
              <div className="nv-muted">章節結算</div>
            </div>
            <div className={`nv-coin-bar${coinPulse ? ' pulse' : ''}`}>
              🪙 Eureka 幣：{eurekaCoin}
            </div>
          </header>
          <PanelBox>
            <div className="nv-settlement">
              <div className="nv-settlement-kicker">章節完成</div>
              <div className="nv-settlement-title">【{settlement.chapterTitle}】</div>
              {settlement.endingTitle ? (
                <div className="nv-settlement-ending">
                  {settlement.badgeIcon}{' '}
                  {settlement.isNewEnding ? '新結局' : '結局'}：【
                  {settlement.endingTitle}】
                </div>
              ) : null}
              {settlement.totalEndings ? (
                <div className="nv-settlement-meta">
                  結局進度：{settlement.unlockedCount}/{settlement.totalEndings}
                </div>
              ) : null}
              {settlement.knowledgeLine ? (
                <div className="nv-settlement-knowledge">
                  📒 {settlement.knowledgeLine}
                </div>
              ) : null}
              {settlement.unlockedNextTitle ? (
                <div className="nv-settlement-unlock">
                  已解鎖：{settlement.unlockedNextTitle}
                  {settlement.unlockTeaser ? (
                    <div className="nv-settlement-teaser">
                      {settlement.unlockTeaser}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </PanelBox>
          <div className="nv-row">
            <button type="button" className="nv-btn primary" onClick={goLobby}>
              回大廳 _
            </button>
          </div>
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
        {knowledgeToast ? (
          <div
            key={knowledgeToast.key}
            className={`nv-knowledge-toast${endingToast ? ' is-offset' : ''}`}
          >
            <div className="nv-knowledge-toast-title">
              📒【{knowledgeToast.title}】學到什麼
            </div>
            <div className="nv-knowledge-toast-body">{knowledgeToast.line}</div>
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
                🔒 本章劇本尚未開放
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
                {selected.knowledgeCard?.line ? (
                  <div className="nv-chapter-card-stats nv-knowledge-line">
                    📒 {selected.knowledgeCard.line}
                  </div>
                ) : null}
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
              {hasCompleted && canEnter ? (
                <button
                  type="button"
                  className="nv-btn"
                  onClick={() =>
                    beginChapter(selectedChapterId, { skipNarrative: true })
                  }
                >
                  跳過已讀敘事 _
                </button>
              ) : null}
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
            {MATHEMATICIANS.map((m) => {
              const playableHere = ERAS.some((era) =>
                isChapterPlayable(m.chapters[era]),
              )
              if (!playableHere) {
                return (
                  <div key={m.id} className="nv-map-row nv-map-soon-row">
                    <span className="nv-map-name">
                      {m.icon} {m.label}
                    </span>
                    <span className="nv-map-soon-label">籌備中</span>
                  </div>
                )
              }
              return (
                <div key={m.id} className="nv-map-row">
                  <span className="nv-map-name">
                    {m.icon} {m.label}
                  </span>
                  <div className="nv-map-eras">
                    {ERAS.map((era, i) => {
                      const id = m.chapters[era]
                      const unlocked =
                        save.progress.unlocked_chapters.includes(id)
                      const completed =
                        save.progress.completed_chapters.includes(id)
                      const playable = isChapterPlayable(id)
                      const selected = id === selectedChapterId
                      return (
                        <span key={era} className="nv-map-era">
                          {i > 0 ? (
                            <span className="nv-arrow">───&gt;</span>
                          ) : null}
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
                            {completed
                              ? '：✓'
                              : !unlocked
                                ? '：🔒'
                                : playable
                                  ? ''
                                  : '：…'}
                          </button>
                        </span>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
          <PanelBox>
            🌌 可玩：阿基米德三章＋伽利略三章｜全館進度：
            {completedCount}/15
            {completedCount >= 15 ? '［終章已開放］' : '（其餘籌備中）'}
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
                      onClick={() => submitQuiz(o.letter)}
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
                {!node.question.options ? (
                  <button
                    type="button"
                    className="nv-btn primary"
                    disabled={!quizInput.trim()}
                    onClick={() => submitQuiz()}
                  >
                    [1] 送出
                  </button>
                ) : null}
                <button type="button" className="nv-btn" onClick={useInsightHint}>
                  {node.question.options ? '[1]' : '[2]'} 靈感提示 (−1)
                </button>
              </div>
              {insightNote ? <p className="nv-ok">{insightNote}</p> : null}
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
      {import.meta.env.DEV ? <DevBankAside bankRef={bankRefForDev} /> : null}
    </div>
  )
}
