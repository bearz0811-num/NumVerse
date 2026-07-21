import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const BANK_PATH = path.join(ROOT, 'src/data/questionBank.json')
const OUTPUT_DIR = path.join(ROOT, 'src/data/scripts/pool-manifests')

const TERMS = [
  {
    id: 'g7h1',
    grade: 7,
    half: 1,
    majors: [
      ['整數運算與科學記號', 7],
      ['因數分解與分數運算', 3],
      ['二元一次聯立方程式', 3],
      ['平面直角坐標系', 2],
    ],
  },
  {
    id: 'g7h2',
    grade: 7,
    half: 2,
    majors: [
      ['一元一次方程式', 3],
      ['比例', 3],
      ['一元一次不等式', 2],
      ['因數分解與分數運算', 2],
      ['生活中的幾何圖形', 2],
      ['統計圖表與資料分析', 2],
      ['平面直角坐標系', 1],
    ],
  },
  {
    id: 'g8h1',
    grade: 8,
    half: 1,
    majors: [
      ['數列與等差級數', 4],
      ['乘法公式與多項式', 4],
      ['平方根與畢氏定理', 4],
      ['函數及其圖形', 3],
    ],
  },
  {
    id: 'g8h2',
    grade: 8,
    half: 2,
    majors: [
      ['三角形的性質與尺規作圖', 4],
      ['平行與四邊形', 3],
      ['一元二次方程式', 3],
      ['因式分解', 2],
      ['統計資料處理與圖表', 2],
      ['平方根與畢氏定理', 1],
    ],
  },
  {
    id: 'g9h1',
    grade: 9,
    half: 1,
    majors: [
      ['比例線段與相似形', 6],
      ['二次函數', 4],
      ['圓的性質', 3],
      ['統計與機率', 2],
    ],
  },
  {
    id: 'g9h2',
    grade: 9,
    half: 2,
    majors: [
      ['圓的性質', 4],
      ['統計與機率', 4],
      ['推理證明與三角形的心', 4],
      ['立體幾何圖形', 3],
    ],
  },
]

const STORY_WORDS =
  /阿強|小芬|老張|小明|小林|媽媽|老師|同學|學生|夜市|捷運|外送|飲料|手機|遊戲|平台|公園|學校|班上|班級|考試|測驗|門票|攤位|店|元|公里/

function storyScore(q) {
  const text = `${q.question} ${(q.options || []).map((o) => o.text).join(' ')}`
  return (
    (q.image ? 2400 : 0) +
    (STORY_WORDS.test(text) ? 1000 : 0) +
    text.length
  )
}

function buildTerm(term, questions) {
  const inTerm = questions.filter(
    (q) => q.grade === term.grade && q.half === term.half,
  )
  const slots = []
  const library = []
  const globallyUsed = new Set()

  for (const [major, needed] of term.majors) {
    const groups = new Map()
    for (const q of inTerm.filter((item) => item.chapter.startsWith(major))) {
      const key = `${q.chapter}|||${q.knowledgePoint}`
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key).push(q)
    }

    const chunks = []
    for (const [key, values] of groups) {
      const [chapter, knowledgePoint] = key.split('|||')
      const ranked = [...values].sort((a, b) => storyScore(a) - storyScore(b))
      let i = 0
      let chunkIndex = 0
      while (i < ranked.length) {
        const remaining = ranked.length - i
        // Prefer triples; allow pairs for scarce majors / leftovers so authored
        // scene beats can still draw from the same major more than once.
        const size = remaining >= 3 ? 3 : remaining >= 2 ? 2 : 0
        if (!size) break
        const questions = ranked.slice(i, i + size)
        chunks.push({
          chapter,
          knowledgePoint,
          questions,
          chunkIndex,
          score:
            questions.reduce((sum, q) => sum + storyScore(q), 0) +
            chunkIndex * 120,
        })
        i += size
        chunkIndex += 1
      }
    }

    // Prefer one slot per knowledge point before using a second chunk.
    chunks.sort(
      (a, b) => a.chunkIndex - b.chunkIndex || a.score - b.score,
    )
    library.push(
      ...chunks.map((chunk) => ({
        major,
        chapterIncludes: chunk.chapter,
        knowledgePoint: chunk.knowledgePoint,
        questionIds: chunk.questions.map((q) => q.id),
      })),
    )
    const picked = chunks.slice(0, needed)
    if (picked.length !== needed) {
      throw new Error(
        `${term.id} / ${major}: need ${needed} slots, only ${picked.length}`,
      )
    }

    for (const chunk of picked) {
      const ids = chunk.questions.map((q) => q.id)
      if (ids.some((id) => globallyUsed.has(id))) {
        throw new Error(`${term.id}: duplicate question id`)
      }
      ids.forEach((id) => globallyUsed.add(id))
      slots.push({
        slot: slots.length + 1,
        major,
        chapterIncludes: chunk.chapter,
        knowledgePoint: chunk.knowledgePoint,
        questionIds: ids,
      })
    }
  }

  if (slots.length !== 15) {
    throw new Error(`${term.id}: expected 15 slots, got ${slots.length}`)
  }
  return {
    id: term.id,
    grade: term.grade,
    half: term.half,
    description:
      '同年段共用候選題；各劇本依當下研究場景重新安排槽位與完整改寫題面。',
    slots,
    library,
  }
}

fs.mkdirSync(OUTPUT_DIR, { recursive: true })
const bank = JSON.parse(fs.readFileSync(BANK_PATH, 'utf8')).questions
for (const term of TERMS) {
  const manifest = buildTerm(term, bank)
  fs.writeFileSync(
    path.join(OUTPUT_DIR, `${term.id}.json`),
    `${JSON.stringify(manifest, null, 2)}\n`,
  )
  console.log(
    `${term.id}: ${manifest.slots.length} slots / ${manifest.slots.flatMap((s) => s.questionIds).length} candidates`,
  )
}
