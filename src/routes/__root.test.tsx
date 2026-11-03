import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vite-plus/test'

vi.mock('@tanstack/react-router', () => ({
  HeadContent: () => <meta data-testid="head-content" />,
  Scripts: () => <div data-testid="scripts" />,
  createRootRoute: (options: unknown) => options,
}))

vi.mock('@tanstack/react-devtools', () => ({
  TanStackDevtools: () => <div data-testid="devtools" />,
}))

vi.mock('@tanstack/react-router-devtools', () => ({
  TanStackRouterDevtoolsPanel: () => null,
}))

vi.mock('../styles.css?url', () => ({
  default: '/styles.css',
}))

const { RootDocument, rootHead } = await import('./__root')

afterEach(() => {
  cleanup()
})

describe('RootDocument', () => {
  it('renders children and client shell widgets', () => {
    render(
      <RootDocument>
        <main>hello</main>
      </RootDocument>,
    )

    expect(screen.getByText('hello')).toBeInTheDocument()
    expect(screen.getByTestId('devtools')).toBeInTheDocument()
    expect(screen.getByTestId('scripts')).toBeInTheDocument()
  })
})

describe('rootHead', () => {
  it('defines document metadata', () => {
    const head = rootHead()

    expect(head.meta).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ charSet: 'utf-8' }),
        expect.objectContaining({ title: '後だしじゃんけん | Reflex Drill' }),
      ]),
    )
    expect(head.links).toEqual([
      expect.objectContaining({ rel: 'stylesheet', href: '/styles.css' }),
    ])
  })
})
