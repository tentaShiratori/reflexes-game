import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vite-plus/test'

vi.mock('#/components/JankenGame', () => ({
  JankenGame: () => <div>後だしじゃんけんゲーム</div>,
}))

const { Home } = await import('./index')

afterEach(() => {
  cleanup()
})

describe('Home', () => {
  it('renders the janken game', () => {
    render(<Home />)

    expect(screen.getByText('後だしじゃんけんゲーム')).toBeInTheDocument()
  })
})
