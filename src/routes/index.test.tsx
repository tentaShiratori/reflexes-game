import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vite-plus/test'

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    children,
    to,
    className,
  }: {
    children: React.ReactNode
    to: string
    className?: string
  }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
  createFileRoute: () => (options: { component: unknown }) => options,
}))

const { Home } = await import('./index')

afterEach(() => {
  cleanup()
})

describe('Home', () => {
  it('renders the hub with both training links', () => {
    render(<Home />)

    expect(screen.getByRole('heading', { name: 'Reflex Drill' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /後だしじゃんけん/ })).toHaveAttribute(
      'href',
      '/janken',
    )
    expect(screen.getByRole('link', { name: /あっち向いてホイ/ })).toHaveAttribute('href', '/acchi')
  })
})
