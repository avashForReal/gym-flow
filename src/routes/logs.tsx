import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Activity, Calendar, TrendingUp, Clock } from 'lucide-react'

export const Route = createFileRoute('/logs')({
  component: LogsPage,
})

function LogsPage() {
  const recentWorkouts = [
    {
      id: 1,
      name: "Push Day",
      date: "2024-01-15",
      duration: "45 min",
      exercises: 6,
      sets: 18
    },
    {
      id: 2,
      name: "Pull Day", 
      date: "2024-01-13",
      duration: "50 min",
      exercises: 5,
      sets: 15
    },
    {
      id: 3,
      name: "Legs Day",
      date: "2024-01-11", 
      duration: "55 min",
      exercises: 7,
      sets: 21
    }
  ]

  const stats = [
    {
      label: "This Week",
      value: "4",
      unit: "workouts",
      icon: Calendar,
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      label: "Total Time",
      value: "3.5",
      unit: "hours",
      icon: Clock,
      color: "text-green-600 dark:text-green-400"
    },
    {
      label: "Avg Duration",
      value: "52",
      unit: "min",
      icon: TrendingUp,
      color: "text-purple-600 dark:text-purple-400"
    }
  ]

  return (
    <div className="px-4 py-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Workout Logs</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Track your training progress</p>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Start
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200 dark:border-slate-700">
              <CardContent className="p-3">
                <div className="flex flex-col items-center text-center">
                  <div className={`p-2 bg-slate-100 dark:bg-slate-700/50 rounded-lg mb-2`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">{stat.label}</p>
                  <p className="font-semibold text-sm">
                    {stat.value} <span className="text-xs font-normal">{stat.unit}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Workouts */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Workouts</h2>
          <div className="space-y-4">
            {recentWorkouts.map((workout) => (
              <Card key={workout.id} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <CardTitle>{workout.name}</CardTitle>
                        <CardDescription>
                          {workout.date} • {workout.duration}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{workout.exercises} exercises</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{workout.sets} sets</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Repeat Workout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {recentWorkouts.length === 0 && (
          <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200 dark:border-slate-700">
            <CardContent className="text-center py-12">
              <Activity className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="font-medium mb-2">No Workout Logs</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Start your first workout to see your logs here
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Start Your First Workout
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
  )
}
