import { createFileRoute } from '@tanstack/react-router'
import { ReactionGame } from './-reaction/ReactionGame'

export const Route = createFileRoute('/reaction')({ component: ReactionPage })

function ReactionPage() {
  return <ReactionGame />
}
