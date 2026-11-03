import { runQualityChecks } from '../../scripts/quality-checks.mjs'

const MAX_OUTPUT_CHARS = 12_000

async function readStdin() {
  const chunks = []
  for await (const chunk of process.stdin) {
    chunks.push(chunk)
  }
  return Buffer.concat(chunks).toString('utf8')
}

function truncate(text) {
  if (text.length <= MAX_OUTPUT_CHARS) {
    return text
  }
  return `${text.slice(0, MAX_OUTPUT_CHARS)}\n…(truncated)`
}

function writeJson(payload) {
  process.stdout.write(`${JSON.stringify(payload)}\n`)
}

const raw = await readStdin()
/** @type {{ status?: string, loop_count?: number }} */
let payload = {}
try {
  payload = raw ? JSON.parse(raw) : {}
} catch {
  process.stderr.write('[stop-quality-checks] failed to parse stdin JSON; continuing\n')
}

if (payload.status === 'aborted' || payload.status === 'error') {
  process.stderr.write(
    `[stop-quality-checks] status=${payload.status ?? 'unknown'}; skipping checks\n`,
  )
  writeJson({})
  process.exit(0)
}

const { ok, failures } = runQualityChecks()

if (ok) {
  writeJson({})
  process.exit(0)
}

const failure = failures[0]
const message = [
  'stop hook の品質チェックが失敗しました。修正してから続行してください。',
  '',
  `Command: pnpm ${failure.name === 'fmt' ? 'exec vp fmt --check' : failure.name}`,
  `Exit code: ${failure.code}`,
  '',
  '```text',
  truncate(failure.output || '(no output)'),
  '```',
].join('\n')

writeJson({ followup_message: message })
process.exit(0)
