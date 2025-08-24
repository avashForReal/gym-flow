import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DatePicker } from "@/components/ui/date-picker"
import { useGetRecentWorkouts } from "@/hooks/useWorkoutLogging"
import { useNavigate } from "@tanstack/react-router"
import { Activity, Plus, Loader2 } from "lucide-react"
import LogsHeader from "./logs-header/logs-header"
import { useState } from "react"
import ExerciseDrawer from "./exercise-drawer/exercise-drawer"
import LogsCard from "./logs-card/logs-card"

const Logs = () => {
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const {
    recentWorkouts,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore
  } = useGetRecentWorkouts({
    initialLimit: 10,
    limit: 10,
    date: selectedDate || undefined
  })

  const [isExerciseDrawerOpen, setIsExerciseDrawerOpen] = useState(false)

  const handleLogExercise = (exerciseId: string) => {
    navigate({ to: '/add-log/$exerciseId', params: { exerciseId }, from: '/logs' })
  }

  const handleLoadMore = async () => {
    await loadMore()
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

        <div className="px-5 pt-2">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">
              {selectedDate ? 'Exercises for ' + selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              }) : 'Last Logged Exercises'}
            </h2>
          </div>

          {/* Date Filter */}
          <div className="mb-4">
            <DatePicker
              selectedDate={selectedDate}
              onDateChange={(date) => {
                setSelectedDate(date);
              }}
              placeholder="Pick a date"
            />
          </div>
        </div>

        <div className="px-4 py-4">
          <div className="space-y-4">
            {recentWorkouts && recentWorkouts.length > 0 ? (
              <>
                {recentWorkouts.map((workout, index) => (
                  <LogsCard key={index} workout={workout} handleLogExercise={handleLogExercise} />
                ))}

                {/* Load More Button */}
                {hasMore && (
                  <div className="flex justify-center pt-4">
                    <Button
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      variant="outline"
                      className="w-full max-w-xs"
                    >
                      {isLoadingMore ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        'Load More'
                      )}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200 dark:border-slate-700">
                <CardContent className="text-center py-12">
                  <Activity className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="font-medium mb-2">
                    {selectedDate ? 'No Workouts Found' : 'No Workout Logs'}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    {selectedDate
                      ? `No workouts were logged on ${selectedDate.toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}.`
                      : 'Log your first exercise to see your logs here!'
                    }
                  </p>
                  {
                    !selectedDate && (
                      <Button onClick={() => setIsExerciseDrawerOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Start Your First Workout
                      </Button>
                    )
                  }
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