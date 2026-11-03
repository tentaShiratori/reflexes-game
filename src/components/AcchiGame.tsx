import {
  ACCHI_INSTRUCTION_LABELS,
  DIRECTION_LABELS,
  DIRECTION_SYMBOLS,
  DIRECTIONS,
  TOTAL_ROUNDS,
  summarizeResults,
} from '#/lib/acchi'
import { formatAccuracy, formatResponseMs } from '#/lib/records'
import { useAcchiGame } from '#/lib/useAcchiGame'
import { Link } from '@tanstack/react-router'

export function AcchiGame() {
  const { state, startGame, answer, resetToIdle } = useAcchiGame()
  const summary = summarizeResults(state.results)
  const { records } = state

  return (
    <div className="game-shell">
      <div className="game-atmosphere acchi-atmosphere" aria-hidden="true" />

      <main className="game-stage">
        <header className="game-brand">
          <p className="game-kicker">Reflex Drill</p>
          <h1 className="game-title">あっち向いてホイ</h1>
          <p className="game-lead">指示を見て、遅れて向く顔に素早く反応しろ。</p>
        </header>

        {state.phase === 'idle' ? (
          <section className="game-panel" aria-labelledby="acchi-start-heading">
            <h2 id="acchi-start-heading" className="sr-only">
              スタート
            </h2>
            <p className="game-copy">
              「同じ方向」「違う方向」のあと、1〜3秒で相手の向きが出る。
              指示どおりの方向を、反射で選べ。全{TOTAL_ROUNDS}問。
            </p>

            <dl className="record-grid">
              <div>
                <dt>ベスト正答率</dt>
                <dd>
                  {records.sessions.length === 0 ? '—' : formatAccuracy(records.bestAccuracy)}
                </dd>
              </div>
              <div>
                <dt>最速平均回答</dt>
                <dd>
                  {records.bestAverageResponseMs === null
                    ? '—'
                    : formatResponseMs(records.bestAverageResponseMs)}
                </dd>
              </div>
              <div>
                <dt>プレイ回数</dt>
                <dd>{records.sessions.length}</dd>
              </div>
            </dl>

            <div className="button-row">
              <button type="button" className="primary-button" onClick={startGame}>
                スタート
              </button>
              <Link to="/" className="ghost-button link-button">
                ゲーム一覧
              </Link>
            </div>
          </section>
        ) : null}

        {state.phase === 'waiting' || state.phase === 'answering' || state.phase === 'feedback' ? (
          <section className="game-panel play-panel" aria-live="polite">
            <div className="round-meter">
              <span>
                {state.round} / {TOTAL_ROUNDS}
              </span>
              <div className="round-track">
                <div
                  className="round-fill"
                  style={{ width: `${(state.round / TOTAL_ROUNDS) * 100}%` }}
                />
              </div>
            </div>

            <p className="instruction-label">指示</p>
            <p className="instruction-text" data-testid="instruction">
              {state.instruction ? ACCHI_INSTRUCTION_LABELS[state.instruction] : ''}
            </p>

            <div className="system-hand-area">
              {state.phase === 'waiting' ? (
                <p className="waiting-pulse" data-testid="waiting">
                  向きが出るまで待機…
                </p>
              ) : (
                <div className="system-hand system-direction" data-testid="system-direction">
                  {state.systemDirection ? (
                    <>
                      <span aria-hidden="true">{DIRECTION_SYMBOLS[state.systemDirection]}</span>
                      <span className="sr-only">{DIRECTION_LABELS[state.systemDirection]}</span>
                      <span className="direction-caption">
                        {DIRECTION_LABELS[state.systemDirection]}
                      </span>
                    </>
                  ) : null}
                </div>
              )}
            </div>

            {state.phase === 'feedback' && state.lastResult ? (
              <p
                className={state.lastResult.correct ? 'feedback ok' : 'feedback miss'}
                data-testid="feedback"
              >
                {state.lastResult.correct ? '正解' : '不正解'} ·{' '}
                {formatResponseMs(state.lastResult.responseMs)}
              </p>
            ) : (
              <div className="direction-pad" role="group" aria-label="方向選択">
                {DIRECTIONS.map((direction) => (
                  <button
                    key={direction}
                    type="button"
                    className={`hand-button direction-button direction-${direction}`}
                    disabled={state.phase !== 'answering'}
                    onClick={() => answer(direction)}
                    aria-label={DIRECTION_LABELS[direction]}
                  >
                    <span aria-hidden="true">{DIRECTION_SYMBOLS[direction]}</span>
                    <span>{DIRECTION_LABELS[direction]}</span>
                  </button>
                ))}
              </div>
            )}
          </section>
        ) : null}

        {state.phase === 'result' ? (
          <section className="game-panel" aria-labelledby="acchi-result-heading">
            <h2 id="acchi-result-heading" className="result-heading">
              結果
            </h2>
            <dl className="record-grid result-grid">
              <div>
                <dt>正答率</dt>
                <dd data-testid="result-accuracy">{formatAccuracy(summary.accuracy)}</dd>
              </div>
              <div>
                <dt>平均回答速度</dt>
                <dd data-testid="result-speed">{formatResponseMs(summary.averageResponseMs)}</dd>
              </div>
              <div>
                <dt>正解数</dt>
                <dd>
                  {summary.correctCount} / {summary.totalRounds}
                </dd>
              </div>
            </dl>
            <p className="game-copy">記録はブラウザの localStorage に保存しました。</p>
            <div className="button-row">
              <button type="button" className="primary-button" onClick={startGame}>
                もう一度
              </button>
              <button type="button" className="ghost-button" onClick={resetToIdle}>
                トップへ
              </button>
              <Link to="/" className="ghost-button link-button">
                ゲーム一覧
              </Link>
            </div>
          </section>
        ) : null}

        {records.sessions.length > 0 && state.phase === 'idle' ? (
          <section className="history-panel" aria-labelledby="acchi-history-heading">
            <h2 id="acchi-history-heading">直近の記録</h2>
            <ul className="history-list">
              {records.sessions.slice(0, 5).map((session) => (
                <li key={session.playedAt}>
                  <span>{formatAccuracy(session.accuracy)}</span>
                  <span>{formatResponseMs(session.averageResponseMs)}</span>
                  <time dateTime={session.playedAt}>
                    {new Date(session.playedAt).toLocaleString('ja-JP')}
                  </time>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </main>
    </div>
  )
}
