import { defineConfig, lazyPlugins } from 'vite-plus'
import { devtools } from '@tanstack/devtools-vite'
import { cloudflareTest } from '@cloudflare/vitest-plugin'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import { styledComponentsSSRPlugin } from './scripts/styled-components-ssr-plugin'

const isTest = Boolean(process.env.VITEST)

const appPlugins = lazyPlugins(() => [
  styledComponentsSSRPlugin(),
  devtools(),
  cloudflare({ viteEnvironment: { name: 'ssr' } }),
  tailwindcss(),
  tanstackStart(),
  viteReact(),
])

const vitestPlugins = [styledComponentsSSRPlugin(), tailwindcss(), tanstackStart(), viteReact()]

const config = defineConfig({
  fmt: {
    singleQuote: true,
    semi: false,
  },
  lint: {
    jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
    rules: { 'vite-plus/prefer-vite-plus-imports': 'error' },
    options: { typeAware: true, typeCheck: true },
    ignorePatterns: ['dist/**', 'coverage/**', '.wrangler/**', '.e2e/**', 'src/routeTree.gen.ts'],
  },
  resolve: { tsconfigPaths: true },
  plugins: isTest ? vitestPlugins : appPlugins,
  test: {
    server: {
      deps: {
        inline: [/@tanstack\/(start-server-core|react-start)/],
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.{test,spec}.{ts,tsx}',
        'src/**/*.worker.test.ts',
        'src/**/*.worker.test.tsx',
        'src/test/**',
        'src/routeTree.gen.ts',
        'src/styles.css',
        'src/server.ts',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
    projects: [
      {
        test: {
          name: 'unit',
          environment: 'jsdom',
          setupFiles: ['./src/test/setup.ts'],
          include: ['src/**/*.{test,spec}.{ts,tsx}'],
          exclude: ['src/**/*.worker.test.ts', 'src/**/*.worker.test.tsx', '**/node_modules/**'],
        },
      },
      {
        plugins: [
          cloudflareTest({
            main: 'src/server.ts',
            wrangler: { configPath: 'wrangler.jsonc' },
          }),
        ],
        test: {
          name: 'worker',
          environment: 'node',
          include: ['src/**/*.worker.test.ts', 'src/**/*.worker.test.tsx'],
          exclude: ['**/node_modules/**'],
        },
      },
    ],
  },
})

export default config
