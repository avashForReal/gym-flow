import EditPlan from '@/screens/edit-plan/edit-plan'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/edit-plans/$planId')({
  component: EditPlan,
})

