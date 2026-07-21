import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SCRIPT_DIR = path.join(ROOT, 'src/data/scripts')
const bank = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'src/data/questionBank.json'), 'utf8'),
).questions
const byId = new Map(bank.map((q) => [q.id, q]))
const errors = []
const warnings = []

const scriptFiles = fs
  .readdirSync(SCRIPT_DIR)
  .filter((name) => /^g[789]h[12]-.+\.json$/.test(name))
  .sort()

function fail(scriptId, message) {
  errors.push(`${scriptId}: ${message}`)
}

function numberTokens(text) {
  return String(text || '').match(/[+-]?\d+(?:\.\d+)?/g) || []
}

function sameNumbers(a, b) {
  return JSON.stringify(numberTokens(a)) === JSON.stringify(numberTokens(b))
}

function reachableNodes(script) {
  const byNode = new Map(script.nodes.map((node) => [node.id, node]))
  const seen = new Set()
  const queue = [script.nodes[0]?.id]
  while (queue.length) {
    const id = queue.shift()
    if (!id || seen.has(id)) continue
    seen.add(id)
    const node = byNode.get(id)
    if (!node) continue
    const nextIds = [
      node.next,
      node.onCorrect,
      ...(node.choices || []).map((choice) => choice.next),
    ].filter(Boolean)
    queue.push(...nextIds)
  }
  return seen
}

const combos = new Set()
for (const file of scriptFiles) {
  const script = JSON.parse(fs.readFileSync(path.join(SCRIPT_DIR, file), 'utf8'))
  const id = script.id || file
  const nodes = script.nodes || []
  const nodeIds = nodes.map((node) => node.id)
  const nodeIdSet = new Set(nodeIds)
  const quizzes = nodes.filter((node) => node.type === 'quiz')
  const choices = nodes.filter((node) => node.type === 'choice')
  const eurekas = nodes.filter((node) => node.type === 'eureka')
  const objectives = nodes.filter((node) => node.objective)
  const usedIds = new Set()

  if (nodeIds.length !== nodeIdSet.size) fail(id, 'duplicate node id')
  if (quizzes.length !== 15) fail(id, `expected 15 quizzes, got ${quizzes.length}`)
  if (choices.length !== 5) fail(id, `expected 5 choices, got ${choices.length}`)
  if (eurekas.length !== 2) fail(id, `expected 2 Eureka nodes, got ${eurekas.length}`)
  if (objectives.length < 4) fail(id, `expected at least 4 objective updates, got ${objectives.length}`)
  if (!nodes[0]) fail(id, 'missing opening node')
  if (id !== 'g7h1-archimedes' && script.beats?.length !== 15) {
    fail(id, `expected 15 authored scene beats, got ${script.beats?.length || 0}`)
  }

  const combo = `${script.grade}-${script.half}-${script.mathematician}`
  if (combos.has(combo)) fail(id, `duplicate grade/mathematician combo ${combo}`)
  combos.add(combo)

  for (const node of nodes) {
    for (const [field, target] of [
      ['next', node.next],
      ['onCorrect', node.onCorrect],
    ]) {
      if (target && !nodeIdSet.has(target)) {
        fail(id, `${node.id}.${field} points to missing ${target}`)
      }
    }
    for (const choice of node.choices || []) {
      if (!nodeIdSet.has(choice.next)) {
        fail(id, `${node.id} choice points to missing ${choice.next}`)
      }
    }
  }

  const reached = reachableNodes(script)
  for (const nodeId of nodeIds) {
    if (!reached.has(nodeId)) fail(id, `unreachable node ${nodeId}`)
  }

  for (const eureka of eurekas) {
    const speakers = new Set((eureka.lines || []).map((line) => line.speaker))
    if (!speakers.has('player')) fail(id, `${eureka.id} lacks player insight`)
    if (!speakers.has(script.mathematicianSpeaker || 'Archimedes')) {
      fail(id, `${eureka.id} lacks mathematician insight`)
    }
    const moments = (eureka.lines || []).filter((line) => line.eurekaMoment)
    if (moments.length !== 1) {
      fail(id, `${eureka.id} must mark exactly one Eureka visual moment`)
    }
  }

  for (const [quizIndex, quiz] of quizzes.entries()) {
    const authoredBeat = script.beats?.[quizIndex]
    if (authoredBeat) {
      if (quiz.scene !== authoredBeat.scene) {
        fail(id, `${quiz.id} scene does not match authored beat`)
      }
      if (quiz.pool?.major !== authoredBeat.major) {
        fail(id, `${quiz.id} pool major does not match authored scene`)
      }
      if (quiz.sceneAdapt?.sceneNeed !== authoredBeat.problem) {
        fail(id, `${quiz.id} scene need does not match authored problem`)
      }
    }
    const candidateIds = quiz.pool?.questionIds || []
    if (candidateIds.length < 3) {
      fail(id, `${quiz.id} has fewer than 3 candidates`)
    }
    for (const qid of candidateIds) {
      if (usedIds.has(qid)) fail(id, `question ${qid} reused within book`)
      usedIds.add(qid)
      const q = byId.get(qid)
      if (!q) {
        fail(id, `${quiz.id} references missing question ${qid}`)
        continue
      }
      if (q.grade !== script.grade || q.half !== script.half) {
        fail(id, `${quiz.id}/${qid} comes from wrong term`)
      }
      if (!q.chapter.includes(quiz.pool.chapterIncludes)) {
        fail(id, `${quiz.id}/${qid} chapter mismatch`)
      }
      if (quiz.pool.major && !q.chapter.startsWith(quiz.pool.major)) {
        fail(id, `${quiz.id}/${qid} major mismatch`)
      }
      if (
        quiz.pool.knowledgePoint &&
        q.knowledgePoint !== quiz.pool.knowledgePoint
      ) {
        fail(id, `${quiz.id}/${qid} knowledge point mismatch`)
      }

      if (id === 'g7h1-archimedes') continue
      const rewrite =
        quiz.sceneAdapt?.rewrites?.[qid] ||
        quiz.sceneAdapt?.rewrites?.[String(qid)]
      if (!rewrite?.question) {
        fail(id, `${quiz.id}/${qid} lacks scene rewrite`)
        continue
      }
      if (!sameNumbers(q.question, rewrite.question)) {
        fail(id, `${quiz.id}/${qid} changed question numbers`)
      }
      if (q.image && !rewrite.preserveImage) {
        fail(id, `${quiz.id}/${qid} hides a required question image`)
      }
      for (const option of q.options || []) {
        const changed = rewrite.options?.[option.letter]
        if (changed == null) {
          fail(id, `${quiz.id}/${qid} option ${option.letter} lacks rewrite`)
        } else if (!sameNumbers(option.text, changed)) {
          fail(id, `${quiz.id}/${qid} option ${option.letter} changed numbers`)
        }
      }
      if (
        /夜市|珍珠奶茶|外送平台|捷運|手機|便利商店|球員卡|門票|學生|攤位|雞排|上學/.test(
          `${rewrite.question} ${Object.values(rewrite.options || {}).join(' ')}`,
        )
      ) {
        fail(id, `${quiz.id}/${qid} retains unrelated modern scenario`)
      }
    }
  }

  const repeated = new Map()
  for (const line of nodes.flatMap((node) => [
    ...(node.lines || []),
    ...(node.setup || []),
  ])) {
    if (!line.text) continue
    repeated.set(line.text, (repeated.get(line.text) || 0) + 1)
  }
  const worst = [...repeated].filter(([, count]) => count >= 8)
  if (worst.length) warnings.push(`${id}: highly repeated dialogue (${worst.length})`)
}

if (scriptFiles.length !== 30) {
  errors.push(`registry data: expected 30 script JSON files, got ${scriptFiles.length}`)
}
if (combos.size !== 30) {
  errors.push(`matrix: expected 30 unique combinations, got ${combos.size}`)
}

for (const warning of warnings) console.warn(`WARN ${warning}`)
if (errors.length) {
  for (const error of errors) console.error(`ERROR ${error}`)
  console.error(`\n${errors.length} validation error(s)`)
  process.exit(1)
}
console.log(
  `validated ${scriptFiles.length} scripts, ${scriptFiles.length * 15} quiz anchors, ${scriptFiles.length * 2} shared Eureka nodes`,
)
