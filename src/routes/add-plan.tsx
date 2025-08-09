import { AddPlanWizard } from '@/screens/add-plan/AddPlanWizard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/add-plan')({
  component: AddPlanWizard,
})

