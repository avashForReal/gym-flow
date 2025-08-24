import PlanDetails from '@/screens/plan-details/plan-details'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/plan-details/$planId')({
  component: PlanDetails,
})
