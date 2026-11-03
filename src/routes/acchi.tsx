import { createFileRoute } from '@tanstack/react-router'
import { AcchiGame } from './-acchi/AcchiGame'

export const Route = createFileRoute('/acchi')({
  component: AcchiGame,
  head: () => ({
    meta: [
      { title: 'あっち向いてホイ | Reflex Drill' },
      {
        name: 'description',
        content: '指示に合わせて遅れて向く顔に素早く反応する、反射神経トレーニングゲーム。',
      },
    ],
  }),
})
