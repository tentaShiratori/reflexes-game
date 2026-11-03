import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

export function Home() {
  return (
    <div className="game-shell">
      <div className="game-atmosphere hub-atmosphere" aria-hidden="true" />

      <main className="game-stage hub-stage">
        <header className="game-brand">
          <p className="game-kicker">Reflex Drill</p>
          <h1 className="game-title">Reflex Drill</h1>
          <p className="game-lead">反射で答えろ。遅れて出る合図に間に合うか。</p>
        </header>

        <nav className="game-menu" aria-label="トレーニング一覧">
          <Link to="/janken" className="game-menu-link">
            <span className="game-menu-name">後だしじゃんけん</span>
            <span className="game-menu-desc">指示どおりの手を、遅れて出る相手に合わせる</span>
          </Link>
          <Link to="/acchi" className="game-menu-link">
            <span className="game-menu-name">あっち向いてホイ</span>
            <span className="game-menu-desc">同じ方向か違う方向か、遅れて向く顔に反応する</span>
          </Link>
        </nav>
      </main>
    </div>
  )
}
