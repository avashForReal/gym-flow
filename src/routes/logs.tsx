import { createFileRoute } from '@tanstack/react-router'
import Logs from '@/screens/logs/logs'

export const Route = createFileRoute('/logs')({
  component: Logs,
})

