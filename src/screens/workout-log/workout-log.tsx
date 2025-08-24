import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Save } from 'lucide-react'
import { Route } from '@/routes/add-log/$exerciseId'
import { useSingleExerciseById } from '@/hooks/useExercises'
import WorkoutLogHeader from './workout-log-header'
import { useWorkoutLogs } from '@/hooks/useWorkoutLogging'
import { capitalizeFirst } from '@/lib/string-helper'
import WorkoutLogHistory from './workout-log-history'

export function WorkoutLog() {
    const navigate = useNavigate()
    const { exerciseId } = Route.useParams()
    const { planId, dayIndex } = Route.useSearch() as { planId: string, dayIndex: number }

    const { exercise } = useSingleExerciseById(exerciseId)
    const { saveWorkout, isSaving } = useWorkoutLogs()

    const [sets, setSets] = useState<Array<{ weight: string; reps: string }>>([
        { weight: '', reps: '' }
    ])
    const [validationErrors, setValidationErrors] = useState<string[]>([])


    const validateSets = (): boolean => {
        const errors: string[] = []
        sets.forEach((set, index) => {
            if (!set.weight.trim()) {
                errors.push(`Set ${index + 1}: Weight is required`)
            } else if (isNaN(parseFloat(set.weight)) || parseFloat(set.weight) <= 0) {
                errors.push(`Set ${index + 1}: Weight must be a positive number`)
            }

            if (!set.reps.trim()) {
                errors.push(`Set ${index + 1}: Reps are required`)
            } else if (isNaN(parseInt(set.reps)) || parseInt(set.reps) <= 0) {
                errors.push(`Set ${index + 1}: Reps must be a positive number`)
            }
        })

        setValidationErrors(errors)
        return errors.length === 0
    }

    const handleAddSet = () => {
        setSets([...sets, { weight: '', reps: '' }])
        setValidationErrors([]) 
    }

    const handleUpdateSet = (index: number, field: 'weight' | 'reps', value: string) => {
        const newSets = [...sets]
        newSets[index] = { ...newSets[index], [field]: value }
        setSets(newSets)
        setValidationErrors([]) 
    }

    const handleRemoveSet = (index: number) => {
        if (sets.length > 1) {
            setSets(sets.filter((_, i) => i !== index))
            setValidationErrors([])
        }
    }

    const handleSaveWorkout = async () => {
        try {
            setValidationErrors([])
            if (!validateSets()) {
                return
            }
            const workoutSets = sets.map(set => ({
                exerciseId,
                weight: parseFloat(set.weight),
                reps: parseInt(set.reps),
            }))
            await saveWorkout(workoutSets)
            alert('Workout saved successfully!')
            navigate({ to: '/plan-details/$planId', params: { planId }, search: { dayIndex } })
        } catch (error) {
            console.error('Error saving workout:', error)
            alert('Failed to save workout. Please try again.')
        }
    }

    const handleBack = () => {
        navigate({ to: '/plan-details/$planId', params: { planId }, search: { dayIndex } })
    }

    if (!exercise) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                <div className="p-4 flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <p className="text-muted-foreground mb-4">Exercise not found</p>
                        <Button onClick={handleBack}>Back to Plans</Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            {/* Header */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-border/50">
                <WorkoutLogHeader
                    handleBack={handleBack}
                />
            </div>

            <h2 className="px-4 pt-2 block text-base font-semibold text-slate-900 dark:text-white tracking-tight mb-1 truncate">
                {capitalizeFirst(exercise.name)}
            </h2>

            {/* Content */}
            <div className="px-4 pb-4 space-y-4">
                <WorkoutLogHistory exerciseId={exerciseId} />

                {validationErrors.length > 0 && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                        <div className="text-red-600 dark:text-red-400 text-sm font-medium mb-2">
                            Please fix the following errors:
                        </div>
                        <ul className="text-sm text-red-600 dark:text-red-400 space-y-1">
                            {validationErrors.map((error, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <span className="text-red-500">•</span>
                                    <span>{error}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="space-y-3">
                    <div className="flex items-center gap-2 justify-between">
                        <span className="font-semibold text-base text-slate-900 dark:text-white">Sets</span>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-auto px-2 flex items-center gap-1"
                            onClick={handleAddSet}
                            aria-label="Add Set"
                        >
                            <Plus className="h-4 w-4" />
                            <span className="text-xs font-medium">Add set</span>
                        </Button>
                    </div>

                    <div className="space-y-2">
                        {sets.map((set, index) => (
                            <div
                                key={index}
                                className={`flex items-center gap-3 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-border/30 px-3 py-2 shadow-sm${index === 0 ? " mt-2" : ""}`}
                            >
                                {/* Set number in a nice badge */}
                                <div className="flex flex-col items-center justify-center mr-2">
                                    <span className="rounded-full bg-primary/10 text-primary font-bold text-xs w-7 h-7 flex items-center justify-center border border-primary/30">
                                        {index + 1}
                                    </span>
                                    {/* <span className="text-[10px] text-muted-foreground mt-1">Set</span> */}
                                </div>
                                {/* Inputs in a row, each with label above */}
                                <div className="flex flex-1 gap-4">
                                    <div className="flex flex-col items-start">
                                        <Input
                                            id={`weight-${index}`}
                                            type="number"
                                            placeholder="Weight"
                                            value={set.weight}
                                            onChange={(e) => handleUpdateSet(index, 'weight', e.target.value)}
                                            className="h-8 text-xs w-24 form-input"
                                        />
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <Input
                                            id={`reps-${index}`}
                                            type="number"
                                            placeholder="Reps"
                                            value={set.reps}
                                            onChange={(e) => handleUpdateSet(index, 'reps', e.target.value)}
                                            className="h-8 text-xs w-20 form-input"
                                        />
                                    </div>
                                </div>
                                {sets.length > 1 && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                        onClick={() => handleRemoveSet(index)}
                                        aria-label={`Remove set ${index + 1}`}
                                    >
                                        ×
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Save Button */}
                <Button
                    className="w-full h-12 rounded-lg"
                    onClick={handleSaveWorkout}
                    disabled={isSaving}
                >
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Workout'}
                </Button>
            </div>
        </div>
    )
}
