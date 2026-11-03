import { cleanup, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vite-plus/test'
import { renderWithRouter } from '#/test/renderWithRouter'
import { HubHome } from './-index/HubHome'

afterEach(() => {
  cleanup()
})

describe('Home', () => {
  it('renders the hub with both training links', async () => {
    renderWithRouter(<HubHome />, { path: '/' })

    expect(await screen.findByRole('heading', { name: 'Reflex Drill' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /後だしじゃんけん/ })).toHaveAttribute(
      'href',
      '/janken',
    )
    expect(screen.getByRole('link', { name: /あっち向いてホイ/ })).toHaveAttribute('href', '/acchi')
  })
})
