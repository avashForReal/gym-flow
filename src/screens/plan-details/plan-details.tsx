import { useState, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { usePlans } from '@/hooks/usePlans'
import { useExercisesByIds } from '@/hooks/useExercises'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Dumbbell } from 'lucide-react'
import { Route } from '@/routes/plan-details/$planId'
import { Loader } from '@/components/loader/loader'
import PlanDetailsHeader from './plan-details-header'
import PlanDetailsExerciseCard from './plan-details-exercise-card'

export default function PlanDetails() {
    const navigate = useNavigate()
    const { planId } = Route.useParams();
    const { dayIndex } = Route.useSearch() as { dayIndex: number }

    const { isLoading, getPlanById } = usePlans({
        enableFetchPlans: true
    });
    const plan = getPlanById(Number(planId));

    const [selectedDayIndex, setSelectedDayIndex] = useState(dayIndex || 0)

    const exerciseIds = useMemo(() => {
        if (!plan || !plan.days[selectedDayIndex]) return []
        return plan.days[selectedDayIndex].exercises.map(ex => ex.exerciseId)
    }, [plan, selectedDayIndex])

    const { exercises, isLoadingExercises } = useExercisesByIds(exerciseIds)

    const selectedDay = plan?.days[selectedDayIndex]
    const isRestDay = selectedDay?.isRestDay || false

    const handleAddToLog = (exerciseId: string) => {
        navigate({
            to: '/add-log/$exerciseId',
            params: {
                exerciseId
            },
            search: {
                planId: planId,
                dayIndex: selectedDayIndex
            }
        })
    }

    const handleBackToPlans = () => {
        navigate({ to: '/plans' })
    }

    if (isLoading) {
        return <Loader />
    }

    if (!plan) {
        return <div>Plan not found</div>
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            {/* Header */}
            <div className="p-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-border/50">
                <PlanDetailsHeader
                    planName={plan.name}
                    planDescription={plan.description}
                    handleBackToPlans={handleBackToPlans}
                />

                {/* Day Selection */}
                <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
                    {plan.days.map((day, index) => (
                        <Button
                            key={index}
                            variant={selectedDayIndex === index ? "default" : "outline"}
                            size="sm"
                            className="flex-shrink-0"
                            onClick={() => setSelectedDayIndex(index)}
                        >
                            {day.name}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {isRestDay ? (
                    <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-slate-800 rounded-lg shadow">
                        <Calendar className="h-10 w-10 text-muted-foreground mb-3" />
                        <h3 className="text-lg font-semibold mb-2">Rest Day</h3>
                        <p className="text-sm text-muted-foreground">
                            Take a break and recover.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                {selectedDay?.name}
                            </h2>
                            <Badge variant="secondary">
                                {exercises.length} exercises
                            </Badge>
                        </div>

                        {isLoadingExercises ? (
                            <div className="space-y-3">
                                {[...Array(3)].map((_, i) => (
                                    <Card key={i} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-border/40">
                                        <CardContent className="p-4">
                                            <div className="animate-pulse">
                                                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                                                <div className="h-3 bg-muted rounded w-1/2"></div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : exercises.length === 0 ? (
                            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-border/40">
                                <CardContent className="p-8 text-center">
                                    <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">No Exercises</h3>
                                    <p className="text-muted-foreground">
                                        This day doesn't have any exercises planned yet.
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-3">
                                {exercises.map((exercise) => (
                                    <PlanDetailsExerciseCard
                                        key={exercise.exerciseId}
                                        exercise={exercise}
                                        onAddToLog={handleAddToLog}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}