import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDeleteWorkoutSession, useGetSessionDetails, type ExerciseLog } from "@/hooks/useWorkoutLogging"
import { capitalizeFirst } from "@/lib/string-helper"
import SessionDetailsModal from "../../home/session-details-modal"
import { useNavigate } from "@tanstack/react-router"
import { Dumbbell, Eye, Pencil, Trash } from "lucide-react"
import { useState } from "react"

type LogsCardProps = {
    workout: ExerciseLog
    handleLogExercise: (exerciseId: string) => void
    refetch: () => Promise<void>
}

const LogsCard = ({ workout, handleLogExercise, refetch }: LogsCardProps) => {
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)
    const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)
    const { sessionDetails } = useGetSessionDetails(workout.sessionId);
    const { deleteWorkoutSession } = useDeleteWorkoutSession(workout.sessionId);

    const handleEditLog = () => {
        navigate({ to: '/edit-log/$sessionId', params: { sessionId: workout.sessionId.toString() } })
    }

    const handleDeleteLog = () => {
        setDeleteAlertOpen(true)
    }

    const handleConfirmDeleteLog = async() => {
        deleteWorkoutSession()
        await refetch()
        setDeleteAlertOpen(false)
    }

    return (
        <>
            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border-slate-200 dark:border-slate-700 shadow-sm transition hover:shadow-lg gap-1">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
                                <Dumbbell className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                    {workout.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </div>
                                <CardTitle className="text-base font-semibold leading-tight">
                                    {capitalizeFirst(workout.exerciseName)}
                                </CardTitle>
                            </div>
                        </div>
                        <div className="flex flex-row gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
                                onClick={() => setIsOpen(true)}
                                aria-label="View Details"
                            >
                                <Eye className="h-5 w-5 text-blue-500" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
                                onClick={handleEditLog}
                                aria-label="Edit Log"
                            >
                                <Pencil className="h-5 w-5 text-blue-500" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
                                onClick={handleDeleteLog}
                                aria-label="Delete Log"
                            >
                                <Trash className="h-5 w-5 text-red-600" />
                            </Button>
                        </div>
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

            <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Log?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this log? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction asChild>
                            <Button
                                variant="destructive"
                                className="bg-red-800 hover:bg-red-700"
                                onClick={handleConfirmDeleteLog}
                            >
                                Confirm
                            </Button>
                        </AlertDialogAction>
                        <AlertDialogCancel asChild>
                            <Button
                                variant="outline"
                                onClick={() => setDeleteAlertOpen(false)}
                            >
                                Cancel
                            </Button>
                        </AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>


            <SessionDetailsModal
                sessionDetails={sessionDetails}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    )
}

export default LogsCard