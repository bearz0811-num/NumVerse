import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SCRIPT_CATALOG as BASE_CATALOG } from './script_catalog.mjs'
import archimedesCatalog from './catalog/archimedes.mjs'
import galileoCatalog from './catalog/galileo.mjs'
import newtonCatalog from './catalog/newton.mjs'
import gaussCatalog from './catalog/gauss.mjs'
import turingCatalog from './catalog/turing.mjs'

const AUTHORED = {
  ...archimedesCatalog,
  ...galileoCatalog,
  ...newtonCatalog,
  ...gaussCatalog,
  ...turingCatalog,
}

function enrichBook(book) {
  const authored = AUTHORED[book.id]
  if (!authored) return book
  return {
    ...book,
    episode: authored.episode || book.episode,
    setting: authored.setting || book.setting,
    era: authored.era || book.era,
    acts: authored.acts || book.acts,
    props: authored.props || book.props,
    objectives: authored.objectives || book.objectives,
    insights: authored.insights || book.insights,
    endingSummary: authored.endingSummary || book.endingSummary,
    legendNote:
      authored.legendNote !== undefined ? authored.legendNote : book.legendNote,
    beats: authored.beats,
    choices: authored.choices,
  }
}

const SCRIPT_CATALOG = BASE_CATALOG.map(enrichBook)

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SCRIPT_DIR = path.join(ROOT, 'src/data/scripts')
const MANIFEST_DIR = path.join(SCRIPT_DIR, 'pool-manifests')
const BANK = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'src/data/questionBank.json'), 'utf8'),
).questions
const BY_ID = new Map(BANK.map((q) => [q.id, q]))

const MAJOR_TASKS = [
  [/統計|四分位|盒狀圖|全距|機率/, (p) => `把${p}的多次紀錄排開，分清偶然波動與真正趨勢`],
  [/科學記號|指數/, (p) => `把${p}上過大或過小的量縮成能核對的記號`],
  [/整數|數與數線/, (p) => `以${p}為基準，把方向、差量與順序記清楚`],
  [/數列|級數/, (p) => `從${p}連續紀錄裡找出規律，推到尚未測量的一項`],
  [/因數|公因數|公倍數/, (p) => `拆開${p}的數量結構，找出能整齊分組的方式`],
  [/分數/, (p) => `核對${p}的份量，不能讓任何一份在換算時消失`],
  [/不等式/, (p) => `替${p}找出不能越過的上下界`],
  [/比例|相似/, (p) => `用比例把${p}的縮放與實際尺寸接起來`],
  [/坐標|函數/, (p) => `把${p}的位置與變化標上坐標，追蹤下一步會落在哪裡`],
  [/二次函數|一元二次/, (p) => `找出${p}形成的曲線、轉折與可行解`],
  [/方程式|聯立/, (p) => `把${p}裡未知的量列成條件，解出唯一可行的配置`],
  [/多項式|乘法公式|因式分解/, (p) => `整理${p}上的代數式，讓重複結構現形`],
  [/平方根|畢氏/, (p) => `用直角與距離核對${p}的實際長度`],
  [/立體幾何|柱體|錐體|空間中的/, (p) => `展開${p}的立體結構，核對表面與內部容量`],
  [/圓/, (p) => `沿${p}的圓弧、弦與切線追出隱藏關係`],
  [/三角形|尺規|平行|四邊形|推理證明|內心|外心|重心/, (p) => `核對${p}上的幾何關係，每一道線都要有理由`],
]

const REPLACEMENTS = [
  [/阿強|小強|阿明|小明|小林|阿芬|小芬|老張|阿光|他/g, '你'],
  [/台北市某週一到週日的每日最高氣溫（單位：攝氏度）/g, '現場連續七次測得的最高讀數（單位：刻度）'],
  [/七天最高氣溫/g, '七次讀數'],
  [/老師|媽媽|爸爸|同學|同一家攤位老闆/g, '同行者'],
  [/九年三班|九年甲班|九年乙班|八年級|九年級|七年甲班|三年甲班|某年級|某班|A 班|B 班/g, '觀測組'],
  [/甲、乙兩班/g, '甲、乙兩批紀錄'],
  [/上學的方式/g, '訊號分類'],
  [/家長接送/g, '丁類'],
  [/機車接送/g, '丁類中的第一種'],
  [/(\d+)\s*位學生/g, '$1 筆紀錄'],
  [/學生人數/g, '紀錄筆數'],
  [/學生/g, '觀測值'],
  [/數學平時測驗|數學測驗|數學小考|第一次段考數學成績|體能測驗|投籃測驗/g, '現場測量'],
  [/成績/g, '讀數'],
  [/身高|體重/g, '測量值'],
  [/滿分/g, '最高刻度'],
  [/人數/g, '筆數'],
  [/夜市|商店|飲料店|麵包店|便利商店|學校|教室|班上|社區/g, '現場'],
  [/攤位|攤/g, '測點'],
  [/外送平台|手機平台|平台/g, '紀錄系統'],
  [/手機/g, '測繪板'],
  [/螢幕/g, '圖板'],
  [/用雙指將地圖畫面放大/g, '將地圖按比例放大'],
  [/捷運/g, '快速通道'],
  [/上學/g, '前往測點'],
  [/家裡/g, '起點'],
  [/等車/g, '等待'],
  [/捷運站|火車站/g, '基準站'],
  [/珍珠奶茶|水果茶|手搖飲|飲料|烤肉串|紅豆麵包|菠蘿麵包|蘋果汁|芭樂汁|地瓜球|娃娃|宵夜|炸雞/g, '樣品'],
  [/腳踏車|汽車/g, '測試車'],
  [/球員卡|卡片/g, '記錄片'],
  [/公園|花圃|農地|田地/g, '試驗區'],
  [/外送員|司機/g, '記錄員'],
  [/顧客|會員/g, '參與者'],
  [/門票/g, '記錄片'],
  [/全票/g, '甲類記錄'],
  [/半票/g, '乙類記錄'],
  [/雞排/g, '樣品'],
  [/購買|買/g, '取用'],
  [/付/g, '交付'],
  [/價格/g, '讀數'],
  [/步行/g, '甲類'],
  [/公車/g, '乙類'],
  [/騎自行車/g, '丙類'],
  [/平方公尺/g, '平方格'],
  [/平方公分/g, '平方小格'],
  [/公里/g, '里程格'],
  [/公尺/g, '長度格'],
  [/公分/g, '小格'],
  [/新台幣/g, '銀幣'],
  [/((?:x|y|k|\d+(?:\.\d+)?))\s*元/g, '$1 枚'],
  [/多少元/g, '多少枚'],
  [/單位：元/g, '單位：刻度'],
]

function scrubModern(text, book, prop) {
  let rewritten = String(text || '')
  for (const [pattern, value] of REPLACEMENTS) {
    rewritten = rewritten.replace(pattern, value)
  }
  if (book) {
    rewritten = rewritten
      .replace(/某城市/g, book.setting)
      .replace(/某展覽/g, '這次試驗')
      .replace(/某組資料/g, `${prop}上的一組資料`)
  }
  return rewritten
}

function contextualize(text, book, beat, prop, seed) {
  const rewritten = scrubModern(text, book, prop)
  const safeBeat = scrubModern(beat, book, prop).replace(
    /[+-]?\d+(?:\.\d+)?/g,
    '關鍵答案',
  )
  const leads = [
    `${safeBeat}。${book.mathematician}在${prop}上留下這組條件：`,
    `要讓${safeBeat}繼續，你得先解開${prop}旁這一筆：`,
    `${prop}的紀錄停在這一行；下一步正等著它：`,
    `${book.mathematician}把${safeBeat}剛測到的數字推到你面前：`,
    `現場只剩${prop}上的這份計算還沒核對：`,
  ]
  return `${leads[Math.abs(Number(seed)) % leads.length]}${rewritten}`
}

function contextualizeOption(text) {
  return scrubModern(text)
}

function taskFor(slot, prop) {
  const subchapter = slot.chapterIncludes.replace(`${slot.major} `, '')
  const haystack = `${slot.knowledgePoint} ${subchapter}`
  const found = MAJOR_TASKS.find(([pattern]) => pattern.test(haystack))
  return found ? found[1](prop) : `把${prop}上的條件逐項核對`
}

function propFor(slot, book, index) {
  const subchapter = slot.chapterIncludes.replace(`${slot.major} `, '')
  const kind = `${slot.knowledgePoint} ${subchapter}`
  const act = book.acts[Math.floor(index / 3)]
  if (/統計|四分位|盒狀圖|全距|機率/.test(kind)) return `${act}紀錄表`
  if (/坐標|函數/.test(kind)) return `${act}坐標圖`
  if (/數列|級數/.test(kind)) return `${act}連續紀錄`
  if (/柱體|錐體|空間中的|立體/.test(kind)) return `${act}立體模型`
  if (/圓|三角形|尺規|平行|四邊形|相似|幾何|內心|外心|重心/.test(kind)) {
    return `${act}幾何圖`
  }
  if (/因數|公因數|公倍數/.test(kind)) return `${act}分組表`
  return book.props[index % book.props.length]
}

function mathematicianLine(book, moment, fallback) {
  const lines = {
    阿基米德: {
      invite: '別只看。把手伸進問題裡，數字才會動。',
      success: '好。它肯動了——趁現在追下去。',
      choose: '兩邊都重要。{{address}}，替我砍出第一條路。',
    },
    伽利略: {
      invite: '先別信我。量過、算過，再決定眼睛看見的是什麼。',
      success: '記下來。能重做的結果，才有資格走進論辯。',
      choose: '{{address}}，你選先看哪一個；我們讓觀測回答。',
    },
    牛頓: {
      invite: '別猜原因。把量與量之間的關係寫下來。',
      success: '吻合。這條關係可以留下。',
      choose: '時間不夠。{{address}}，選一邊，我處理另一邊。',
    },
    高斯: {
      invite: '先找結構。漫無目的地計算，只會把誤差藏深。',
      success: '很好。結果與結構彼此驗證。',
      choose: '{{address}}，先處理最能縮小誤差的那一邊。',
    },
    '艾倫・圖靈': {
      invite: '把你的做法說成步驟。說不清楚的地方，正是問題藏身處。',
      success: '這一步能被另一個人重做。保留它。',
      choose: '{{address}}，選一條規則。我們看它會把狀態帶去哪裡。',
    },
  }
  return lines[book.mathematician]?.[moment] || fallback
}

function beatFor(book, index, slot) {
  const act = book.acts[Math.floor(index / 3)]
  const authored = book.beats?.[index]
  if (authored) {
    return {
      act,
      title: authored.scene,
      text: authored.scene,
      problem: authored.problem,
      aside: authored.aside || null,
    }
  }
  const phases = [
    `你們開始${act}`,
    `${act}進到最難量的一段`,
    `${act}只剩一次能驗證的機會`,
  ]
  return {
    act,
    title: `${act}・${slot.knowledgePoint}`,
    text: phases[index % 3],
    problem: null,
  }
}

function makeRewrites(slot, book, beat, prop) {
  return Object.fromEntries(
    slot.questionIds.map((id) => {
      const q = BY_ID.get(id)
      if (!q) throw new Error(`${book.id}: missing question ${id}`)
      const options = q.options?.length
        ? Object.fromEntries(
            q.options.map((option) => [
              option.letter,
              contextualizeOption(option.text),
            ]),
          )
        : undefined
      return [
        id,
        {
          question: contextualize(q.question, book, beat.text, prop, id),
          ...(options ? { options } : {}),
          preserveImage: Boolean(q.image),
          ...(q.image ? { imageAlt: `${prop}的資料圖` } : {}),
        },
      ]
    }),
  )
}

function makeQuiz(book, slot, index, next) {
  const anchor = index + 1
  const beat = beatFor(book, index, slot)
  const prop = propFor(slot, book, index)
  const task = taskFor(slot, prop)
  const numnumPrompts = [
    '先把條件排穩。方向一亂，後面的結果全會跟著偏。',
    '別被場面催快。先找基準，再動數字。',
    '把已知與未知分開。眼前真正缺的是哪一個量？',
  ]
  const numiPrompts = [
    '快，但不要猜。讓答案真的推動眼前這件事。',
    '我先壓住現場，你把這一筆算到底！',
    '它又開始變了——別慌，照你剛才排好的順序來。',
  ]
  const quiz = {
    id: `q${String(anchor).padStart(2, '0')}`,
    type: 'quiz',
    anchor,
    scene: beat.title,
    ...(anchor === 4
      ? { objective: book.objectives?.[1] || `完成${book.acts[1]}，找出第一個可靠規律` }
      : anchor === 8
        ? { objective: book.objectives?.[2] || `讓${book.acts[2]}通過現場驗證` }
        : anchor === 12
          ? { objective: book.objectives?.[3] || `撐過${book.acts[3]}，完成最後推論` }
          : {}),
    setup: [
      {
        speaker: 'narrator',
        text: beat.problem
          ? `${beat.title}。${beat.problem}`
          : `${beat.text}。${prop}就在眼前，前一步的誤差已經開始放大。`,
      },
      ...(beat.aside || []),
      {
        speaker: 'Mathematician',
        text: `${task}。${mathematicianLine(book, 'invite', '{{address}}，這一筆交給你。')}`,
      },
      {
        speaker: anchor % 2 ? 'NumNum' : 'Numi',
        text:
          anchor % 2
            ? numnumPrompts[index % numnumPrompts.length]
            : numiPrompts[index % numiPrompts.length],
      },
    ],
    pool: {
      grade: book.grade,
      half: book.half,
      major: slot.major,
      chapterIncludes: slot.chapterIncludes,
      knowledgePoint: slot.knowledgePoint,
      questionIds: slot.questionIds,
    },
    sceneAdapt: {
      sceneId: `${book.id}-scene-${String(anchor).padStart(2, '0')}`,
      setting: book.setting,
      cast: ['玩家', 'NumNum', 'Numi', book.mathematician],
      props: [prop, ...book.props.filter((p) => p !== prop).slice(0, 2)],
      sceneNeed: beat.problem || task,
      rewrites: makeRewrites(slot, book, beat, prop),
    },
    successVariants: [
      [
        {
          speaker: 'narrator',
          text: `${prop}上的數字對上了。${beat.act}終於能往前推。`,
        },
      ],
      [
        {
          speaker: 'Mathematician',
          text: mathematicianLine(book, 'success', '這個結果站得住。繼續。'),
        },
      ],
      [
        {
          speaker: anchor % 2 ? 'NumNum' : 'Numi',
          text: anchor % 2 ? '條件吻合。' : '成了，下一步！',
        },
      ],
    ],
    detourVariants: [
      [{ speaker: 'NumNum', text: '有一個條件沒對上。從基準再走一次。' }],
      [{ speaker: 'Numi', text: '先別放掉這題。眼前這一步還需要它。' }],
    ],
    onCorrect: next,
    onWrong: 'retry-same-question',
  }
  const previousChoiceAnchor = [2, 5, 8, 11, 14].indexOf(anchor)
  if (previousChoiceAnchor >= 0) {
    const choiceNumber = previousChoiceAnchor + 1
    quiz.setup.push(
      {
        speaker: 'NumNum',
        text: '剛才先核過的基準在這裡派上用場了。',
        whenChoice: { [`choice_${choiceNumber}`]: 'measure' },
      },
      {
        speaker: 'Numi',
        text: '剛才搶下的現場紀錄還熱著。就用這一筆。',
        whenChoice: { [`choice_${choiceNumber}`]: 'observe' },
      },
    )
  }
  return quiz
}

function makeChoice(book, choiceNumber, nextQuiz) {
  const actIndex = Math.min(choiceNumber - 1, book.acts.length - 1)
  const act = book.acts[actIndex]
  const first = book.props[(choiceNumber * 2 - 2) % book.props.length]
  const second = book.props[(choiceNumber * 2 - 1) % book.props.length]
  const id = `choice_${choiceNumber}`
  const authored = book.choices?.[choiceNumber - 1]
  const prompt =
    authored?.prompt || `${act}被兩個問題同時卡住。時間只夠先處理一邊。`
  const firstLabel = authored?.firstLabel || `先檢查${first}`
  const secondLabel = authored?.secondLabel || `先追查${second}`
  return [
    {
      id,
      type: 'choice',
      lines: [
        {
          speaker: 'narrator',
          text: prompt,
        },
        {
          speaker: 'NumNum',
          text: `先查${first}。基準不穩，後面每一步都會歪。`,
        },
        {
          speaker: 'Numi',
          text: `我選${second}。現場正在變，再慢就看不到了。`,
        },
        {
          speaker: 'Mathematician',
          text: mathematicianLine(book, 'choose', '{{address}}，你決定先走哪邊。'),
        },
      ],
      choices: [
        { id: 'measure', label: firstLabel, next: `${id}_measure` },
        { id: 'observe', label: secondLabel, next: `${id}_observe` },
      ],
    },
    {
      id: `${id}_measure`,
      type: 'narrative',
      lines: [
        {
          speaker: 'narrator',
          text:
            authored?.firstResult ||
            `你和 NumNum 壓住${first}，把每一道基準重新核過。`,
        },
        {
          speaker: 'Mathematician',
          text: `好。現在至少知道，接下來的差不是量具自己造成的。`,
        },
      ],
      next: nextQuiz,
    },
    {
      id: `${id}_observe`,
      type: 'narrative',
      lines: [
        {
          speaker: 'narrator',
          text:
            authored?.secondResult ||
            `你跟著 Numi 追到${second}旁，在變化消失前記下最後一筆。`,
        },
        {
          speaker: 'Mathematician',
          text: `抓到了。把這筆帶回去，和原來的條件一起算。`,
        },
      ],
      next: nextQuiz,
    },
  ]
}

function makeEureka(book, number, next) {
  const insight = book.insights[number - 1]
  return {
    id: `eureka_${number}`,
    type: 'eureka',
    eurekaId: `${book.id}-insight-${number}`,
    lines: [
      {
        speaker: 'Mathematician',
        text: `等等。剛才你算出的結果，正好把我漏掉的那一段補上了。`,
      },
      { speaker: 'player', text: insight },
      {
        speaker: 'Mathematician',
        text: `對。你看見的和我一樣——我們一起想通了。Eureka！`,
        eurekaMoment: true,
      },
      {
        speaker: 'narrator',
        text: `暖黃從你們之間猛然亮起，不像門，也不像火。那個剛被理解的念頭，第一次有了重量。`,
      },
      { speaker: 'Numi', text: '這次是兩個人的……甜得發亮。' },
      { speaker: 'NumNum', text: '記住它。光退了，推理還會留下。' },
    ],
    next,
  }
}

function makeTransition(book, number, next) {
  const act = book.acts[number - 1]
  const previous = book.acts[number - 2]
  const prop = book.props[(number + 1) % book.props.length]
  const pressure = [
    '門外的聲音近了一層，留給你們的空白正在縮小。',
    '原先穩定的讀數突然偏了一格；這不是能略過的小差。',
    '風向、光線與人的耐心同時在變。再拖，剛才的證據就會失效。',
  ][number % 3]
  return {
    id: `transition_${number}`,
    type: 'narrative',
    lines: [
      {
        speaker: 'narrator',
        text: `${previous}告一段落，${prop}卻送來新的壞消息。${pressure}`,
      },
      {
        speaker: 'Mathematician',
        text: `我們還不能停。下一步是${act}；剛才算出的結果，正好是唯一能帶過去的東西。`,
      },
      {
        speaker: 'Numi',
        text: '那就帶著它走。這次我不先衝——至少等你們把方向說完。',
      },
    ],
    next,
  }
}

function makeScript(book, manifest) {
  const slots = [...manifest.slots]
  let arranged
  if (book.beats?.length === 15) {
    const available = (manifest.library || manifest.slots).map((slot, index) => ({
      ...slot,
      libraryIndex: index,
    }))
    const taken = new Set()
    arranged = book.beats.map((beat, index) => {
      const found = available.find(
        (slot) => slot.major === beat.major && !taken.has(slot.libraryIndex),
      )
      if (!found) {
        throw new Error(
          `${book.id}: beat ${index + 1} needs another pool for ${beat.major}`,
        )
      }
      taken.add(found.libraryIndex)
      return found
    })
  } else {
    // Rotate the shared curriculum slots per book. Same grade bank, different
    // moments and props; whole-book major coverage remains identical.
    const rotation =
      [...book.id].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % slots.length
    arranged = [...slots.slice(rotation), ...slots.slice(0, rotation)]
  }

  const afterQuiz = {
    1: 'choice_1',
    2: 'q03',
    3: 'transition_2',
    4: 'choice_2',
    5: 'q06',
    6: 'q07',
    7: 'choice_3',
    8: 'q09',
    9: 'eureka_1',
    10: 'choice_4',
    11: 'q12',
    12: 'transition_5',
    13: 'choice_5',
    14: 'eureka_2',
    15: 'ending_history',
  }

  const nodes = [
    {
      id: 'opening',
      type: 'narrative',
      objective:
        book.objectives?.[0] ||
        `進入${book.setting}，弄清楚${book.acts[0]}為何停住`,
      lines: [
        { speaker: 'narrator', text: '數學世界的藍紫色安靜得像一張沒有折痕的紙。' },
        { speaker: 'Numi', text: '那邊有一點光——很細，還在抖。' },
        { speaker: 'NumNum', text: '不是 Eureka。只是有人卡在一個還沒想通的問題前。' },
        {
          speaker: 'narrator',
          text: `你們追著微光穿過薄紙般的界面。${book.era}，${book.setting}。`,
        },
        {
          speaker: 'narrator',
          text: `${book.mathematician}站在${book.props[0]}旁，手裡那一步已經停了很久。`,
        },
        { speaker: 'Mathematician', text: '你們是誰？算了——如果看得懂數字，就過來。' },
        { speaker: 'Numi', text: '{{playerName}}也在！我們不是來旁觀的。' },
      ],
      next: 'q01',
    },
  ]

  for (let i = 0; i < 15; i += 1) {
    const anchor = i + 1
    nodes.push(makeQuiz(book, arranged[i], i, afterQuiz[anchor]))
    if ([1, 4, 7, 10, 13].includes(anchor)) {
      const choiceNumber = [1, 4, 7, 10, 13].indexOf(anchor) + 1
      nodes.push(...makeChoice(book, choiceNumber, `q${String(anchor + 1).padStart(2, '0')}`))
    }
    if (anchor === 9) nodes.push(makeEureka(book, 1, 'transition_4'))
    if (anchor === 14) nodes.push(makeEureka(book, 2, 'q15'))
    if (anchor === 3) nodes.push(makeTransition(book, 2, 'q04'))
    if (anchor === 9) nodes.push(makeTransition(book, 4, 'q10'))
    if (anchor === 12) nodes.push(makeTransition(book, 5, 'q13'))
  }

  nodes.push({
    id: 'ending_history',
    type: 'narrative',
    objective: `記住${book.mathematician}留下的答案`,
    lines: [
      {
        speaker: 'narrator',
        text: `${book.acts[4]}完成了。現場安靜下來，只有${book.props[0]}還留著剛才的痕跡。`,
      },
      { speaker: 'Mathematician', text: '{{address}}，今天不是你替我算完。是我們一起把它想通。' },
      { speaker: 'Numi', text: '那道光退了……可是我還記得它的味道。' },
      { speaker: 'NumNum', text: '因為答案不是光。答案會留在能被重做的步驟裡。' },
      { speaker: 'narrator', text: '——時間向前推去。' },
      { speaker: 'narrator', text: book.endingSummary },
      {
        speaker: 'narrator',
        text: `眼前的${book.setting}慢慢褪色。藍紫色的安靜重新包圍你們。`,
      },
      { speaker: 'Numi', text: '{{playerName}}，下次再有人快想通時，我們還會聽見。' },
    ],
    next: 'ending_stats',
  })
  nodes.push({
    id: 'ending_stats',
    type: 'ending',
    next: null,
    lines: [
      { speaker: 'narrator', text: `【劇本結束】${book.gradeLabel} × ${book.mathematician}` },
      { speaker: 'NumNum', text: '這趟路的每一次重算，數字都記得。' },
      { speaker: 'Numi', text: '下次見，{{playerName}}！' },
    ],
  })

  return {
    ...book,
    version: 1,
    title: `${book.gradeLabel} × ${book.mathematician}`,
    language: 'zh-TW',
    companions: ['NumNum', 'Numi'],
    journalTitle: book.episode.split('：')[0],
    notes: [
      '玩家本人與 NumNum、Numi 一起冒險。',
      '題目只從所選年段 questionBank 抽取。',
      '題面依當下研究場景整段改寫；數字、算式、答案不變。',
      '答錯保留同一題並給提示，直到答對。',
      'Eureka 僅在玩家與數學家共同領悟關鍵知識時觸發。',
      ...(book.legendNote ? [book.legendNote] : []),
    ],
    detourTemplates: [
      [{ speaker: 'NumNum', text: '條件還在。慢一點，沿同一條路再走一次。' }],
      [{ speaker: 'Numi', text: '別換題。眼前這件事還等著我們把它算開。' }],
      [{ speaker: 'Mathematician', text: '我也沒放棄。重看剛才那一步。' }],
    ],
    correctFeedback: [
      [{ speaker: 'narrator', text: '數字對上，眼前的阻礙鬆開了一格。' }],
    ],
    nodes,
  }
}

function variableName(id) {
  return id.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase())
}

fs.mkdirSync(SCRIPT_DIR, { recursive: true })
for (const book of SCRIPT_CATALOG) {
  const termId = `g${book.grade}h${book.half}`
  const manifest = JSON.parse(
    fs.readFileSync(path.join(MANIFEST_DIR, `${termId}.json`), 'utf8'),
  )
  const script = makeScript(book, manifest)
  fs.writeFileSync(
    path.join(SCRIPT_DIR, `${book.id}.json`),
    `${JSON.stringify(script, null, 2)}\n`,
  )
}

const allIds = ['g7h1-archimedes', ...SCRIPT_CATALOG.map((book) => book.id)]
const imports = allIds
  .map(
    (id) =>
      `import ${variableName(id)} from './${id}.json'`,
  )
  .join('\n')
const variables = allIds.map(variableName)
const registry = `${imports}

const allScripts = [
  ${variables.join(',\n  ')},
]

/** @type {Record<string, object>} */
export const scriptsById = Object.fromEntries(
  allScripts.map((script) => [script.id, script]),
)

export const scriptList = allScripts.map((script) => ({
  id: script.id,
  title: script.title,
  gradeLabel: script.gradeLabel,
  mathematician: script.mathematician,
  episode: script.episode,
}))

export const archimedesG7H1 = g7h1Archimedes
`
fs.writeFileSync(path.join(SCRIPT_DIR, 'index.js'), registry)

const rows = SCRIPT_CATALOG.map(
  (book) =>
    `| ${book.gradeLabel} | ${book.mathematician} | ${book.episode} | ${book.setting} | ${book.insights.join('／')} | ${book.legendNote || '史實研究主題'} |`,
)
const matrix = `# Numip 文字冒險劇本矩陣（30）

同年段五位數學家共用該年段題庫；每本依研究場景挑選可自然介入的知識點，題面與選項整段改寫。六本代表六個研究主題／關鍵事件，不硬切成六段完整傳記。

| 年段 | 數學家 | 劇本主題 | 主要場景 | 兩次共同領悟 | 史料註記 |
|---|---|---|---|---|---|
| 七上 | 阿基米德 | 敘拉古：王冠、Eureka、防衛與最後一刻 | 敘拉古 | 排水量對應體積／槓桿力矩 | 王冠與臨終語屬傳統記載 |
${rows.join('\n')}

## 固定規格
- 玩家本人與 NumNum、Numi 入場。
- 每本 15 題、5 個選擇短支線、4 段任務目標、2 次共同 Eureka。
- 題目只來自 questionBank；數字、算式、未知數、選項字母、正確答案不變。
- 結局忠於該數學家的史實收束；傳說只作動機並明確標註。
`
fs.writeFileSync(path.join(ROOT, 'docs/script-matrix-30.md'), matrix)

console.log(`generated ${SCRIPT_CATALOG.length} scripts; registry has ${allIds.length}`)
