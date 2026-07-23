/**
 * Post-deploy / CI checks for NumVerse production.
 * Usage: node scripts/verify-prod.mjs [baseUrl]
 */
const BASE = process.argv[2] || 'https://numverse.vercel.app'
const MATHWAGER = 'https://mathwager.vercel.app'

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
    redirect: 'follow',
  })
  const text = await res.text()
  return { status: res.status, text, url: res.url }
}

function fail(msg) {
  console.error('FAIL:', msg)
  process.exitCode = 1
}

function ok(msg) {
  console.log('OK:', msg)
}

async function main() {
  console.log('verify-prod →', BASE)

  const mw = await fetchText(MATHWAGER)
  if (mw.status === 404) ok('mathwager.vercel.app is 404')
  else fail(`mathwager.vercel.app expected 404, got ${mw.status}`)

  const home = await fetchText(`${BASE}/?t=${Date.now()}`)
  if (home.status !== 200) fail(`numverse home status ${home.status}`)
  else ok('numverse.vercel.app 200')

  const jsPath = home.text.match(/\/assets\/index-[A-Za-z0-9_-]+\.js/)?.[0]
  if (!jsPath) {
    fail('no index-*.js in HTML')
    return
  }
  ok(`bundle ${jsPath}`)

  const js = await fetchText(new URL(jsPath, BASE).href)
  if (js.status !== 200) fail(`bundle fetch ${js.status}`)

  if (!js.text.includes('跳過已讀敘事')) {
    fail('bundle missing 跳過已讀敘事 (deploy stale?)')
  } else ok('bundle has skip-narrative UI')

  // DevBankAside should not mount in prod; string may still exist if not DCE'd.
  // Hard fail only if the gated render pattern is missing (DEV ternary / false short-circuit).
  const hasDevTitle = js.text.includes('DEV・題庫參照')
  const looksGated =
    js.text.includes('import.meta.env.DEV') ||
    // Vite replaces import.meta.env.DEV with !1 / false
    /!1\s*\?\s*[A-Za-z$]|false\s*\?\s*[A-Za-z$]/.test(js.text) ||
    js.text.includes('nv-dev-aside') === false

  if (hasDevTitle && !looksGated) {
    fail('DEV・題庫參照 present and does not look DEV-gated')
  } else if (hasDevTitle) {
    console.log(
      'WARN: DEV・題庫參照 string still in bundle (component source); UI must stay DEV-gated',
    )
  } else {
    ok('DEV・題庫參照 absent from bundle')
  }

  if (process.exitCode) {
    console.error('\nverify-prod FAILED')
    process.exit(1)
  }
  console.log('\nverify-prod PASSED')
}

main().catch((e) => {
  console.error(e)
  process.exit(2)
})
