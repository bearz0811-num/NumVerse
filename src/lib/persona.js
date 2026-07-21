/**
 * Persona-aware address + line filling (feature 2: name/dialogue fusion).
 *
 * Goal: avoid dead `${playerName}` swaps. Each speaker addresses the player in
 * their own voice, and the featured mathematician warms up as the story
 * progresses.
 */

function nickname(name) {
  const n = String(name || '').trim()
  if (!n) return '你'
  // Strip a common family-name char for a casual short form; fall back to tail.
  if (n.length >= 3) return n.slice(-2)
  return n
}

/**
 * @param {string} speaker
 * @param {string} name     player name
 * @param {{ mathematicianTrust?: number, mathematicianSpeaker?: string }} [ctx]
 */
export function addressPlayer(speaker, name, ctx = {}) {
  const full = String(name || '旅人').trim() || '旅人'
  const featuredSpeaker = ctx.mathematicianSpeaker || 'Archimedes'
  switch (speaker) {
    case 'Numi':
      return nickname(full)
    case 'NumNum':
      return full
    default:
      if (speaker === featuredSpeaker || speaker === 'Mathematician') {
        const trust =
          ctx.mathematicianTrust ?? ctx.archimedesTrust ?? 0
        if (trust >= 0.66) return full
        if (trust >= 0.33) return full
        return '陌生人'
      }
      return full
  }
}

/**
 * Fill a template line for a given speaker. Supports:
 *   {{playerName}}  -> full name
 *   {{address}}     -> speaker-appropriate address (nickname / full / 外鄉人)
 */
export function fillPersona(text, speaker, name, ctx = {}) {
  const full = String(name || '旅人').trim() || '旅人'
  return String(text ?? '')
    .replaceAll('{{playerName}}', full)
    .replaceAll('{{address}}', addressPlayer(speaker, full, ctx))
}
