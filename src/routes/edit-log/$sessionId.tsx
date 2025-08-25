import EditLog from '@/screens/edit-log/edit-log'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/edit-log/$sessionId')({
  component: EditLog,
})

