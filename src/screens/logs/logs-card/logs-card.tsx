import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetSessionDetails, type ExerciseLog } from "@/hooks/useWorkoutLogging"
import SessionDetailsModal from "@/screens/home/session-details-modal"
import { Dumbbell } from "lucide-react"
import { useState } from "react"

type LogsCardProps = {
    workout: ExerciseLog
    handleLogExercise: (exerciseId: string) => void
}

const LogsCard = ({ workout, handleLogExercise }: LogsCardProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const { sessionDetails } = useGetSessionDetails(workout.sessionId)

    return (
        <>
            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border-slate-200 dark:border-slate-700 shadow-sm transition hover:shadow-lg">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
                                <Dumbbell className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                    {workout.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                                </div>
                                <CardTitle className="text-base font-semibold leading-tight">
                                    {workout.exerciseName}
                                </CardTitle>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
                            onClick={() => setIsOpen(true)}
                            aria-label="View Details"
                        >
                            {/* Eye icon (Lucide Eye) */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M1.5 12s3.5-7 10.5-7 10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="flex items-center justify-between mt-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => handleLogExercise(workout.exerciseId)}
                        >
                            Log Again
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <SessionDetailsModal
                sessionDetails={sessionDetails}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    )
}

export default LogsCard