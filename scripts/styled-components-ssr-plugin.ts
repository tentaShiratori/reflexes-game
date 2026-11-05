import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import type { Plugin } from 'vite'

const VIRTUAL_ID = '\0styled-components-ssr'
const require = createRequire(import.meta.url)
const styledComponentsSSR = require.resolve('styled-components/dist/styled-components.esm.js')
const styledRequire = createRequire(styledComponentsSSR)

/**
 * Cloudflare/Vitest SSR sets `ssr.target = "webworker"`, which remaps
 * styled-components via its package.json `browser` field to the DOM-only build.
 * Serve the universal ESM build through a virtual id so that remap never runs.
 */
export function styledComponentsSSRPlugin(): Plugin {
  return {
    name: 'styled-components-ssr',
    enforce: 'pre',
    resolveId(id, importer) {
      if (id === 'styled-components') {
        return VIRTUAL_ID
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
