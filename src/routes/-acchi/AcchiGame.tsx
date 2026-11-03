import {
  TOTAL_ROUNDS,
  acchiInstructionLabel,
  directionLabel,
  directionSymbol,
  summarizeResults,
} from '#/lib/acchi'
import { formatAccuracy, formatResponseMs } from '#/lib/records'
import { AcchiAtmosphere } from '../-index/AcchiAtmosphere'
import { ButtonRow } from '../-index/ButtonRow'
import { DirectionCaption, PromptArea } from '../-index/PromptArea'
import { DirectionPad } from '../-index/DirectionPad'
import { FeedbackBanner } from '../-index/FeedbackBanner'
import { GameBrand } from '../-index/GameBrand'
import { GameCopy } from '../-index/GameCopy'
import { GamePanel } from '../-index/GamePanel'
import { GameShell } from '../-index/GameShell'
import { GameStage } from '../-index/GameStage'
import { GhostButton } from '../-index/GhostButton'
import { GhostLink } from '../-index/GhostLink'
import { HistoryPanel } from '../-index/HistoryPanel'
import { InstructionDisplay } from '../-index/InstructionDisplay'
import { PlayPanel } from '../-index/PlayPanel'
import { PrimaryButton } from '../-index/PrimaryButton'
import { RecordStats } from '../-index/RecordStats'
import { ResultHeading } from '../-index/ResultHeading'
import { RoundMeter } from '../-index/RoundMeter'
import { SrOnly } from '../-index/SrOnly'
import { useAcchiGame } from './useAcchiGame'

export function AcchiGame() {
  const { state, startGame, answer, resetToIdle } = useAcchiGame()
  const summary = summarizeResults(state.results)
  const { records } = state

  return (
    <GameShell>
      <AcchiAtmosphere />

      <GameStage>
        <GameBrand title="あっち向いてホイ" lead="指示を見て、遅れて向く顔に素早く反応しろ。" />

        {state.phase === 'idle' ? (
          <GamePanel aria-labelledby="acchi-start-heading">
            <SrOnly as="h2" id="acchi-start-heading">
              スタート
            </SrOnly>
            <GameCopy>
              「同じ方向」「違う方向」のあと、1〜3秒で相手の向きが出る。
              指示どおりの方向を、反射で選べ。全{TOTAL_ROUNDS}問。
            </GameCopy>

            <RecordStats
              items={[
                {
                  label: 'ベスト正答率',
                  value: records.sessions.length === 0 ? '—' : formatAccuracy(records.bestAccuracy),
                },
                {
                  label: '最速平均回答',
                  value:
                    records.bestAverageResponseMs === null
                      ? '—'
                      : formatResponseMs(records.bestAverageResponseMs),
                },
                {
                  label: 'プレイ回数',
                  value: records.sessions.length,
                },
              ]}
            />

            <ButtonRow>
              <PrimaryButton type="button" onClick={startGame}>
                スタート
              </PrimaryButton>
              <GhostLink to="/">ゲーム一覧</GhostLink>
            </ButtonRow>
          </GamePanel>
        ) : null}

        {state.phase === 'waiting' || state.phase === 'answering' || state.phase === 'feedback' ? (
          <PlayPanel aria-live="polite">
            <RoundMeter round={state.round} total={TOTAL_ROUNDS} />
            <InstructionDisplay
              text={state.instruction ? acchiInstructionLabel(state.instruction) : ''}
            />
            <PromptArea
              waiting={state.phase === 'waiting'}
              waitingText="向きが出るまで待機…"
              testId="system-direction"
              direction
            >
              {state.systemDirection ? (
                <>
                  <span aria-hidden="true">{directionSymbol(state.systemDirection)}</span>
                  <SrOnly>{directionLabel(state.systemDirection)}</SrOnly>
                  <DirectionCaption>{directionLabel(state.systemDirection)}</DirectionCaption>
                </>
              ) : null}
            </PromptArea>

            {state.phase === 'feedback' && state.lastResult ? (
              <FeedbackBanner
                correct={state.lastResult.correct}
                detail={formatResponseMs(state.lastResult.responseMs)}
              />
            ) : (
              <DirectionPad disabled={state.phase !== 'answering'} onSelect={answer} />
            )}
          </PlayPanel>
        ) : null}

        {state.phase === 'result' ? (
          <GamePanel aria-labelledby="acchi-result-heading">
            <ResultHeading id="acchi-result-heading">結果</ResultHeading>
            <RecordStats
              items={[
                {
                  label: '正答率',
                  value: formatAccuracy(summary.accuracy),
                  testId: 'result-accuracy',
                },
                {
                  label: '平均回答速度',
                  value: formatResponseMs(summary.averageResponseMs),
                  testId: 'result-speed',
                },
                {
                  label: '正解数',
                  value: `${summary.correctCount} / ${summary.totalRounds}`,
                },
              ]}
            />
            <GameCopy>記録はブラウザの localStorage に保存しました。</GameCopy>
            <ButtonRow>
              <PrimaryButton type="button" onClick={startGame}>
                もう一度
              </PrimaryButton>
              <GhostButton type="button" onClick={resetToIdle}>
                トップへ
              </GhostButton>
              <GhostLink to="/">ゲーム一覧</GhostLink>
            </ButtonRow>
          </GamePanel>
        ) : null}

        {records.sessions.length > 0 && state.phase === 'idle' ? (
          <HistoryPanel sessions={records.sessions} headingId="acchi-history-heading" />
        ) : null}
      </GameStage>
    </GameShell>
  )
}
