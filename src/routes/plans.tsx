import { Plans } from '@/screens/plans/plans'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/plans')({
  component: Plans,
})

