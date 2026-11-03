import { createFileRoute } from '@tanstack/react-router'
import { JankenGame } from '#/components/JankenGame'

export const Route = createFileRoute('/janken')({
  component: JankenPage,
  head: () => ({
    meta: [
      { title: '後だしじゃんけん | Reflex Drill' },
      {
        name: 'description',
        content: '指示に合わせて後出しの手を素早く選ぶ、反射神経トレーニングゲーム。',
      },
    ],
  }),
})

function JankenPage() {
  return <JankenGame />
}
