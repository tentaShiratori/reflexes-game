import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { readFileSync } from 'node:fs'
import type { Plugin } from 'vite'

const VIRTUAL_ID = '\0styled-components-ssr'
const require = createRequire(import.meta.url)
const styledComponentsSSR = require.resolve('styled-components/dist/styled-components.esm.js')
const styledRequire = createRequire(styledComponentsSSR)

function emotionEsmEntry(packageName: string, fileName: string): string {
  const packageJson = styledRequire.resolve(`${packageName}/package.json`)
  return join(dirname(packageJson), 'dist', fileName)
}

const emotionEsmBuilds: Record<string, string> = {
  '@emotion/is-prop-valid': emotionEsmEntry(
    '@emotion/is-prop-valid',
    'emotion-is-prop-valid.esm.js',
  ),
  '@emotion/memoize': emotionEsmEntry('@emotion/memoize', 'emotion-memoize.esm.js'),
}

/**
 * Cloudflare/Vitest SSR sets `ssr.target = "webworker"`, which remaps
 * styled-components via its package.json `browser` field to the DOM-only build.
 * Serve the universal ESM build through a virtual id so that remap never runs.
 *
 * Only rewrite styled-components during SSR so the browser keeps the normal
 * client build. Emotion packages publish a broken `exports.import` CJS shim;
 * force their real ESM builds so Vite/workers do not hit `exports is not defined`
 * or a missing default export.
 */
export function styledComponentsSSRPlugin(): Plugin {
  return {
    name: 'styled-components-ssr',
    enforce: 'pre',
    resolveId(id, importer, options) {
      if (id in emotionEsmBuilds) {
        return emotionEsmBuilds[id]
      }
      if (id === 'styled-components') {
        if (options?.ssr) {
          return VIRTUAL_ID
        }
        return null
      }
      if (importer === VIRTUAL_ID) {
        try {
          return styledRequire.resolve(id)
        } catch {
          return null
        }
      }
      return null
    },
    load(id) {
      if (id === VIRTUAL_ID) {
        return readFileSync(styledComponentsSSR, 'utf8')
      }
      return null
    },
  }
}
