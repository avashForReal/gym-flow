import { AddPlan } from '../screens/plans-wizard/add-plan/add-plan'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/add-plan')({
  component: AddPlan,
})

