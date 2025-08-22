import { getActiveDaysCount, getTotalExercisesCount, usePlans } from '@/hooks/usePlans'
import PlansHeader from './plans-header/plans-header'
import PlansEmpty from './plans-empty/plans-empty'
import { useMemo } from 'react'
import PlansStats from './plans-stats/plans-stats'
import PlansCard from './plans-card/plans-card'

export const Plans = () => {
  const {
    workoutPlans,
    isLoading,
    toggleActivePlan,
    handleDeletePlan
  } = usePlans({
    enableFetchPlans: true
  });

  const hasPlans = useMemo(() => workoutPlans.length > 0, [workoutPlans]);

  const averageDaysPerWeek = useMemo(() => {
    return Math.round(workoutPlans.reduce((total, plan) => total + getActiveDaysCount(plan), 0) / workoutPlans.length)
  }, [workoutPlans])

  const totalExercises = useMemo(() => {
    return workoutPlans.reduce((total, plan) => total + getTotalExercisesCount(plan), 0)
  }, [workoutPlans])

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Loading workout plans...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <PlansHeader />

      <div className="p-4 space-y-6">
        {
          !hasPlans && (
            <PlansEmpty />
          )
        }

        {hasPlans && (
          <div className='space-y-4'>
            {/* Stats */}
            <PlansStats
              totalPlans={workoutPlans.length}
              totalExercises={totalExercises}
              averageDaysPerWeek={averageDaysPerWeek}
              latestPlan={workoutPlans[0]?.name || 'N/A'}
            />

            <div className="space-y-4">
              {workoutPlans.map((plan) => (
                <PlansCard
                  key={plan.id}
                  plan={plan}
                  handleSetActivePlan={toggleActivePlan}
                  handleDeletePlan={handleDeletePlan}
                />
              ))}
            </div>
          </div>

        )}
      </div>
    </div>
  )
}