import g7h1Archimedes from './g7h1-archimedes.json'
import g7h2Archimedes from './g7h2-archimedes.json'
import g8h1Archimedes from './g8h1-archimedes.json'
import g8h2Archimedes from './g8h2-archimedes.json'
import g9h1Archimedes from './g9h1-archimedes.json'
import g9h2Archimedes from './g9h2-archimedes.json'
import g7h1Galileo from './g7h1-galileo.json'
import g7h2Galileo from './g7h2-galileo.json'
import g8h1Galileo from './g8h1-galileo.json'
import g8h2Galileo from './g8h2-galileo.json'
import g9h1Galileo from './g9h1-galileo.json'
import g9h2Galileo from './g9h2-galileo.json'
import g7h1Newton from './g7h1-newton.json'
import g7h2Newton from './g7h2-newton.json'
import g8h1Newton from './g8h1-newton.json'
import g8h2Newton from './g8h2-newton.json'
import g9h1Newton from './g9h1-newton.json'
import g9h2Newton from './g9h2-newton.json'
import g7h1Gauss from './g7h1-gauss.json'
import g7h2Gauss from './g7h2-gauss.json'
import g8h1Gauss from './g8h1-gauss.json'
import g8h2Gauss from './g8h2-gauss.json'
import g9h1Gauss from './g9h1-gauss.json'
import g9h2Gauss from './g9h2-gauss.json'
import g7h1Turing from './g7h1-turing.json'
import g7h2Turing from './g7h2-turing.json'
import g8h1Turing from './g8h1-turing.json'
import g8h2Turing from './g8h2-turing.json'
import g9h1Turing from './g9h1-turing.json'
import g9h2Turing from './g9h2-turing.json'

const allScripts = [
  g7h1Archimedes,
  g7h2Archimedes,
  g8h1Archimedes,
  g8h2Archimedes,
  g9h1Archimedes,
  g9h2Archimedes,
  g7h1Galileo,
  g7h2Galileo,
  g8h1Galileo,
  g8h2Galileo,
  g9h1Galileo,
  g9h2Galileo,
  g7h1Newton,
  g7h2Newton,
  g8h1Newton,
  g8h2Newton,
  g9h1Newton,
  g9h2Newton,
  g7h1Gauss,
  g7h2Gauss,
  g8h1Gauss,
  g8h2Gauss,
  g9h1Gauss,
  g9h2Gauss,
  g7h1Turing,
  g7h2Turing,
  g8h1Turing,
  g8h2Turing,
  g9h1Turing,
  g9h2Turing,
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
