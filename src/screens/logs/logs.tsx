import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetRecentWorkouts } from "@/hooks/useWorkoutLogging"
import { useNavigate } from "@tanstack/react-router"
import { Activity, Dumbbell, Plus } from "lucide-react"
import LogsHeader from "./logs-header/logs-header"
import { useState } from "react"
import ExerciseDrawer from "./exercise-drawer/exercise-drawer"

const Logs = () => {
  const navigate = useNavigate()
  const { recentWorkouts, isLoading } = useGetRecentWorkouts()

  const [isExerciseDrawerOpen, setIsExerciseDrawerOpen] = useState(false)

  const handleLogExercise = (exerciseId: string) => {
    navigate({ to: '/add-log/$exerciseId', params: { exerciseId }, from: '/logs' })
  }

  if (isLoading) {
    return (
      <div className="px-4 py-4 space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/3"></div>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
            ))}
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <LogsHeader
          setIsExerciseDrawerOpen={setIsExerciseDrawerOpen}
        />

        <div className="px-4 py-4">
          <div className="space-y-4">
            {recentWorkouts && recentWorkouts.length > 0 ? (
              recentWorkouts.map((workout, index) => (
                <Card key={index} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200 dark:border-slate-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <Dumbbell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <CardTitle>{workout.exerciseName}</CardTitle>
                          {/* <CardDescription>
                              {workout.weight} lbs × {workout.reps} reps
                            </CardDescription> */}
                        </div>
                      </div>
                      <div className="text-right">
                        {/* <p className="text-sm font-medium">{workout.weight * workout.reps} lbs</p> */}
                        <p className="text-xs text-slate-600 dark:text-slate-400">volume</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLogExercise(workout.exerciseId)}
                      >
                        Log Again
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
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
        </div>
      </div>

      {isExerciseDrawerOpen && (
        <ExerciseDrawer
          setIsExerciseDrawerOpen={setIsExerciseDrawerOpen}
        />
      )}

    </>
  )
}

export default Logs