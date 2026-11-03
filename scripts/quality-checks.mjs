import { spawnSync } from 'node:child_process'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const thisFile = fileURLToPath(import.meta.url)

export const QUALITY_STEPS = [
  { name: 'dead-code', args: ['dead-code'] },
  { name: 'fmt', args: ['exec', 'vp', 'fmt', '--check'] },
  { name: 'lint', args: ['lint'] },
  { name: 'typecheck', args: ['typecheck'] },
  { name: 'test', args: ['test'] },
]

export function sanitizePathForHooks() {
  const sep = path.delimiter
  const skip = ['.cursor-server', '.vscode-server']
  const cleaned = (process.env.PATH || '')
    .split(sep)
    .filter((entry) => entry && !skip.some((fragment) => entry.includes(fragment)))

  const miseShims = path.join(
    process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local'),
    'mise',
    'shims',
  )
  const unixShims = path.join(os.homedir(), '.local', 'share', 'mise', 'shims')

  process.env.PATH = [miseShims, unixShims, ...cleaned].join(sep)
}

function pnpmCommand() {
  return process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'
}

/**
 * @returns {{ ok: boolean, failures: Array<{ name: string, code: number, output: string }> }}
 */
export function runQualityChecks() {
  sanitizePathForHooks()

  const failures = []
  const pnpm = pnpmCommand()

  for (const step of QUALITY_STEPS) {
    const result = spawnSync(pnpm, step.args, {
      cwd: root,
      encoding: 'utf8',
      env: process.env,
      shell: process.platform === 'win32',
    })
    const output = `${result.stdout || ''}${result.stderr || ''}`.trim()
    const code = result.status ?? 1

    process.stderr.write(
      code === 0 ? `[quality] ${step.name}: ok\n` : `[quality] ${step.name}: failed (${code})\n`,
    )

    if (code !== 0) {
      failures.push({ name: step.name, code, output })
      break
    }
  }

  return { ok: failures.length === 0, failures }
}

const isDirectRun = Boolean(process.argv[1]) && path.resolve(process.argv[1]) === thisFile

if (isDirectRun) {
  const { ok, failures } = runQualityChecks()
  if (!ok) {
    for (const failure of failures) {
      process.stderr.write(`\n--- ${failure.name} (exit ${failure.code}) ---\n${failure.output}\n`)
    }
    process.exit(1)
  }
}
