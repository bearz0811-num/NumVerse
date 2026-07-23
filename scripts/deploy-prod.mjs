/**
 * Production deploy with NumVerse domain hygiene.
 * - vercel --prod
 * - ensure numverse.vercel.app points at the new deployment
 * - strip legacy mathwager.vercel.app alias if it reappears
 * - run verify-prod.mjs
 *
 * Project production domain should be numverse.vercel.app only
 * (mathwager.vercel.app was removed from Vercel project domains 2026-07-23).
 *
 * Usage: node scripts/deploy-prod.mjs
 */
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function run(cmd, args) {
  console.log('>', cmd, args.join(' '))
  const r = spawnSync(cmd, args, {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  if (r.stdout) process.stdout.write(r.stdout)
  if (r.stderr) process.stderr.write(r.stderr)
  if (r.status !== 0) {
    throw new Error(`${cmd} ${args.join(' ')} exited ${r.status}`)
  }
  return `${r.stdout || ''}\n${r.stderr || ''}`
}

function extractDeploymentHost(out) {
  const fromJson = out.match(
    /"url"\s*:\s*"(numverse-[a-z0-9-]+\.vercel\.app)"/,
  )
  if (fromJson) return fromJson[1]
  const fromHttps = out.match(
    /https:\/\/(numverse-[a-z0-9-]+\.vercel\.app)/,
  )
  if (fromHttps) return fromHttps[1]
  return null
}

function main() {
  const out = run('vercel', ['--prod', '--yes'])
  const host = extractDeploymentHost(out)
  if (!host) {
    throw new Error('Could not parse deployment host from vercel --prod output')
  }
  console.log('Deployment host:', host)

  run('vercel', ['alias', 'set', host, 'numverse.vercel.app'])

  const rm = spawnSync(
    'vercel',
    ['alias', 'remove', 'mathwager.vercel.app', '--yes'],
    { cwd: root, encoding: 'utf8' },
  )
  if (rm.stdout) process.stdout.write(rm.stdout)
  if (rm.stderr) process.stderr.write(rm.stderr)
  if (rm.status === 0) console.log('Removed mathwager.vercel.app alias')
  else console.log('mathwager alias remove: already gone or not owned')

  // Re-pin after remove (some projects re-default production alias)
  run('vercel', ['alias', 'set', host, 'numverse.vercel.app'])

  run('node', ['scripts/verify-prod.mjs', 'https://numverse.vercel.app'])
  console.log('\ndeploy-prod done → https://numverse.vercel.app')
}

try {
  main()
} catch (e) {
  console.error(e)
  process.exit(1)
}
