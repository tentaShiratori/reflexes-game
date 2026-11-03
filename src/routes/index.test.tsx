import { cleanup, render, screen } from '@testing-library/react'
import { Provider, createStore } from 'jotai'
import { afterEach, describe, expect, it } from 'vite-plus/test'
import { Home } from './index'

afterEach(() => {
  cleanup()
  localStorage.clear()
})

describe('Home', () => {
  it('renders the janken game', () => {
    const store = createStore()
    render(
      <Provider store={store}>
        <Home />
      </Provider>,
    )

    expect(screen.getByRole('heading', { name: '後だしじゃんけん' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'スタート' })).toBeInTheDocument()
  })
})
