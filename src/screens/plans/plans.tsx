import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Calendar, Dumbbell, Clock, Users, Edit, Trash2 } from 'lucide-react'
import { WorkoutPlanWizard } from '@/components/workout-plan-builder/WorkoutPlanWizard'
import { usePlans } from '@/hooks/usePlans'

export const Plans = () => {
  const {
    workoutPlans,
    isCreating,
    isLoading,
    setIsCreating,
    handleSavePlan,
    handleDeletePlan,
    getActiveDaysCount,
    getTotalExercisesCount,
  } = usePlans();

  if (isCreating) {
    return (
      <WorkoutPlanWizard
        onSave={handleSavePlan}
        onCancel={() => setIsCreating(false)}
      />
    )
  }

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
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Workout Plans
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Create and manage your routines
              </p>
            </div>
            <Button
              onClick={() => setIsCreating(true)}
              className="h-12 px-6 rounded-full bg-gradient-to-r from-primary to-accent text-white border-0 shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Plan
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">

        {/* Quick Stats */}
        {workoutPlans.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Total Plans</p>
                  <p className="text-lg font-bold">{workoutPlans.length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Dumbbell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Total Exercises</p>
                  <p className="text-lg font-bold">
                    {workoutPlans.reduce((total, plan) => total + getTotalExercisesCount(plan), 0)}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Avg Days/Week</p>
                  <p className="text-lg font-bold">
                    {workoutPlans.length > 0
                      ? Math.round(workoutPlans.reduce((total, plan) => total + getActiveDaysCount(plan), 0) / workoutPlans.length)
                      : 0}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Latest</p>
                  <p className="text-sm font-bold truncate max-w-16">
                    {workoutPlans[0]?.name || 'None'}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Plans Grid */}
        {workoutPlans.length > 0 ? (
          <div className="space-y-4">
            {workoutPlans.map((plan) => (
              <Card key={plan.id} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all hover:shadow-lg active:scale-[0.99]">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                      {plan.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {plan.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 rounded-full hover:bg-primary/10"
                        onClick={() => {
                          // TODO: Implement edit functionality
                          console.log('Edit plan:', plan.id)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeletePlan(plan.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-primary/5 rounded-xl">
                      <p className="text-xl font-bold text-primary">{getActiveDaysCount(plan)}</p>
                      <p className="text-xs text-muted-foreground font-medium">Active Days</p>
                    </div>
                    <div className="text-center p-3 bg-primary/5 rounded-xl">
                      <p className="text-xl font-bold text-primary">{getTotalExercisesCount(plan)}</p>
                      <p className="text-xs text-muted-foreground font-medium">Exercises</p>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-xl">
                      <p className="text-xl font-bold text-muted-foreground">{plan.days.filter((d: any) => d.isRestDay).length}</p>
                      <p className="text-xs text-muted-foreground font-medium">Rest Days</p>
                    </div>
                  </div>

                  {/* Day Preview */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-muted-foreground mb-3">Weekly Schedule</p>
                    <div className="flex gap-2 justify-center">
                      {plan.days.map((day: any, index: number) => (
                        <div
                          key={index}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${day.isRestDay
                              ? 'bg-muted/50 text-muted-foreground'
                              : 'bg-gradient-to-br from-primary to-accent text-white shadow-md'
                            }`}
                          title={day.name}
                        >
                          {index + 1}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 h-12 rounded-xl border-2 hover:border-primary/50 transition-all"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button
                      className="flex-1 h-12 rounded-xl bg-gradient-to-r from-primary to-accent text-white border-0 shadow-lg hover:shadow-xl transition-all"
                    >
                      <Dumbbell className="h-4 w-4 mr-2" />
                      Start Workout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Empty State */
          <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-border/50 text-center py-16">
            <CardContent>
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Dumbbell className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Ready to start training?</h3>
              <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                Create your first workout plan and begin your fitness journey with a structured routine.
              </p>
              <Button
                onClick={() => setIsCreating(true)}
                className="h-12 px-8 rounded-full bg-gradient-to-r from-primary to-accent text-white border-0 shadow-lg hover:shadow-xl transition-all"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Plan
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}