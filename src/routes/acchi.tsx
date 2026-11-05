import { createFileRoute } from '@tanstack/react-router'
import { AcchiGame } from './-acchi/AcchiGame'

export const Route = createFileRoute('/acchi')({
  component: AcchiPage,
  head: () => ({
    meta: [
      { title: 'あっち向いてホイ | Reflex Drill' },
      {
        name: 'description',
        content: '同じ方向・違う方向の指示に合わせて素早く向きを選ぶ、反射神経トレーニング。',
      },
    ],
  }),
})

function AcchiPage() {
  return <AcchiGame />
}
