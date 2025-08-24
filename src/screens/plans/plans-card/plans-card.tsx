import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getActiveDaysCount, getTotalExercisesCount } from "@/hooks/usePlans"
import type { WorkoutPlan } from "@/lib/database"
import { Calendar, Edit, Trash2 } from "lucide-react"
import { useNavigate } from "@tanstack/react-router"

type PlansCardProps = {
  plan: WorkoutPlan
  handleSetActivePlan: (planId: number, isActive: boolean) => Promise<void>
  handleDeletePlan: (planId: number) => Promise<void>
}

const PlansCard = ({ plan, handleSetActivePlan, handleDeletePlan }: PlansCardProps) => {
  const navigate = useNavigate()

  const activeDaysCount = getActiveDaysCount(plan)
  const totalExercises = getTotalExercisesCount(plan)
  const avgExercisesPerDay = activeDaysCount > 0 ? Math.ceil(totalExercises / activeDaysCount) : 0
  const isActivePlan = plan.isActive

  const handleEdit = (planId: number) => {
    navigate({
      to: '/edit-plans/$planId',
      params: {
        planId: planId.toString()
      }
    })
  }

  const handleDelete = async () => {
    if (isActivePlan) {
      alert("Cannot delete an active plan. Please set another plan as active first.")
      return
    }

    if (confirm("Are you sure you want to delete this workout plan?")) {
      await handleDeletePlan(plan.id)
    }
  }

  const handleViewDetails = () => {
    navigate({ to: '/plan-details/$planId', params: { planId: plan.id.toString() } })
  }

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-border/40 hover:border-primary/30 transition-all duration-200 hover:shadow-md active:scale-[0.98] py-0">
      <CardContent className="p-4">
        {/* Header with name and actions */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
              {plan.name}
            </h3>
            {plan.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                {plan.description}
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-1 ml-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10 hover:text-primary"
              onClick={() => handleEdit(plan.id)}
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 rounded-lg ${isActivePlan
                ? 'text-muted-foreground/50 cursor-not-allowed'
                : 'text-destructive hover:text-destructive hover:bg-destructive/10'
                }`}
              onClick={handleDelete}
              title={isActivePlan ? "Cannot delete active plan" : "Delete plan"}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Compact stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-2.5 bg-primary/5 rounded-lg">
            <p className="text-lg font-bold text-primary">{activeDaysCount}</p>
            <p className="text-xs text-muted-foreground font-medium">Active Days</p>
          </div>
          <div className="text-center p-2.5 bg-primary/5 rounded-lg">
            <p className="text-lg font-bold text-primary">{avgExercisesPerDay}</p>
            <p className="text-xs text-muted-foreground font-medium">Avg. Exercises</p>
          </div>
          <div className="text-center p-2.5 bg-muted/20 rounded-lg">
            <p className="text-lg font-bold text-muted-foreground">{totalExercises}</p>
            <p className="text-xs text-muted-foreground font-medium">Total</p>
          </div>
        </div>

        {/* Active plan indicator */}
        <div className="mb-3">
          <Button
            variant={isActivePlan ? "default" : "outline"}
            size="sm"
            className={`w-full h-9 text-xs ${isActivePlan
              ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 cursor-default"
              : "bg-primary/5 hover:bg-primary/10 border-primary/20 hover:border-primary/30 text-primary"
              }`}
            onClick={() => {
              handleSetActivePlan(plan.id, !plan.isActive);
            }}
          >
            {isActivePlan ? (
              <>
                <span className="mr-1">✓</span> Active Plan
              </>
            ) : (
              "Set as Active Plan"
            )}
          </Button>
        </div>

        {/* Action button */}
        <Button
          variant="outline"
          className="w-full h-10 rounded-lg border-2 hover:border-primary/50 transition-all"
          onClick={handleViewDetails}
        >
          <Calendar className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </CardContent>
    </Card>
  )
}

export default PlansCard