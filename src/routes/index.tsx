import { createFileRoute } from '@tanstack/react-router'
import { JankenGame } from './-index/JankenGame'

export const Route = createFileRoute('/')({ component: Home })

export function Home() {
  return <JankenGame />
}
