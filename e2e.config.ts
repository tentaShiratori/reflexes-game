import type { E2EConfig } from 'e2e'
import { web } from '@e2e-dev/web'
import { gateway } from 'ai'

const app = {
  url: process.env.APP_URL ?? 'http://localhost:3000',
  command: {
    // Use node + local vp so mise-managed pnpm shims are not required.
    executable: 'node',
    args: ['./node_modules/vite-plus/bin/vp', 'dev', '--port', '3000'],
    reuseExisting: true,
  },
}

export default {
  // The Vercel AI Gateway serves the model id and reads AI_GATEWAY_API_KEY, or the OIDC token of a linked Vercel project.
  agents: {
    default: {
      model: gateway('openai/gpt-6-luna-fast'),
      system: 'You are a thorough QA agent. Verify every outcome.',
    },
  },
  targets: [
    {
      engine: web(),
      app,
    },
  ],
} satisfies E2EConfig
