import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vite-plus/test'
import { Home } from './index'

afterEach(() => {
  cleanup()
})

describe('Home', () => {
  it('renders the welcome heading', () => {
    render(<Home />)

    expect(screen.getByRole('heading', { name: 'Welcome to TanStack Start' })).toBeInTheDocument()
  })

  it('points editors at the index route file', () => {
    render(<Home />)

    expect(screen.getByText('src/routes/index.tsx')).toBeInTheDocument()
  })
})
