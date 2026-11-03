import { createFileRoute } from '@tanstack/react-router'
import { AcchiGame } from '#/components/AcchiGame'

export const Route = createFileRoute('/acchi')({
  component: AcchiPage,
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

export function AcchiPage() {
  return <AcchiGame />
}
