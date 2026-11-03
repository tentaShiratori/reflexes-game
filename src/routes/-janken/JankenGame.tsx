import {
  TOTAL_ROUNDS,
  getHandLabel,
  getInstructionLabel,
  listHands,
  summarizeResults,
} from '#/lib/janken'
import { formatAccuracy, formatResponseMs } from '#/lib/records'
import { ButtonRow } from '../-index/ButtonRow'
import { ChoiceButton } from '../-index/ChoiceButton'
import { ChoiceGrid } from '../-index/ChoiceGrid'
import { FeedbackBanner } from '../-index/FeedbackBanner'
import { GameAtmosphere } from '../-index/GameAtmosphere'
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
import { PromptArea } from '../-index/PromptArea'
import { RecordStats } from '../-index/RecordStats'
import { ResultHeading } from '../-index/ResultHeading'
import { RoundMeter } from '../-index/RoundMeter'
import { SrOnly } from '../-index/SrOnly'
import { useJankenGame } from './useJankenGame'

export function JankenGame() {
  const { state, startGame, answer, resetToIdle } = useJankenGame()
  const summary = summarizeResults(state.results)
  const { records } = state

  return (
    <GameShell>
      <GameAtmosphere />

      <GameStage>
        <GameBrand title="後だしじゃんけん" lead="指示を見て、遅れて出る手に素早く合わせろ。" />

        {state.phase === 'idle' ? (
          <GamePanel aria-labelledby="start-heading">
            <SrOnly as="h2" id="start-heading">
              スタート
            </SrOnly>
            <GameCopy>
              「負けて」「勝って」「あいこで」のあと、1〜3秒で相手の手が出る。
              指示どおりの手を、反射で選べ。全{TOTAL_ROUNDS}問。
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
              text={state.instruction ? getInstructionLabel(state.instruction) : ''}
            />
            <PromptArea waiting={state.phase === 'waiting'} waitingText="手が出るまで待機…">
              {state.systemHand ? getHandLabel(state.systemHand) : ''}
            </PromptArea>

            {state.phase === 'feedback' && state.lastResult ? (
              <FeedbackBanner
                correct={state.lastResult.correct}
                detail={formatResponseMs(state.lastResult.responseMs)}
              />
            ) : (
              <ChoiceGrid>
                {listHands().map((hand) => (
                  <ChoiceButton
                    key={hand}
                    type="button"
                    disabled={state.phase !== 'answering'}
                    onClick={() => answer(hand)}
                  >
                    {getHandLabel(hand)}
                  </ChoiceButton>
                ))}
              </ChoiceGrid>
            )}
          </PlayPanel>
        ) : null}

        {state.phase === 'result' ? (
          <GamePanel aria-labelledby="result-heading">
            <ResultHeading id="result-heading">結果</ResultHeading>
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
          <HistoryPanel sessions={records.sessions} headingId="history-heading" />
        ) : null}
      </GameStage>
    </GameShell>
  )
}
