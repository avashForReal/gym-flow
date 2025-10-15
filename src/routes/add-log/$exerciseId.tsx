import { WorkoutLog } from '../../screens/workout-log/workout-log'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/add-log/$exerciseId')({
  component: WorkoutLog,
})