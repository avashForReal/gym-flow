import { Button } from "@/components/ui/button"
import { useGetSessionDetails, type ExerciseLog } from "@/hooks/useWorkoutLogging"
import { capitalizeFirst } from "@/lib/string-helper"
import { Eye } from "lucide-react"
import SessionsDetailsModal from "./session-details-modal"
import { useState } from "react"

const RecentActivityCard = ({ workout }: { workout: ExerciseLog }) => {
    const { sessionDetails } = useGetSessionDetails(workout.sessionId);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div
                className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-white/90 via-slate-50/80 to-slate-100/70 dark:from-slate-800/90 dark:via-slate-900/80 dark:to-slate-800/70 border"
                style={{ minHeight: 64 }}
            >
                {workout.exerciseImage && (
                    <div className="flex-shrink-0 relative">
                        <img
                            src={workout.exerciseImage}
                            alt={workout.exerciseName || "Exercise"}
                            className="w-14 h-14 rounded-lg object-cover"
                        />
                    </div>
                )}

                <div className="flex justify-between w-full pr-2">
                    <div className="flex flex-col gap-1">
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                            {workout.date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        <div className="flex-1 flex justify-between mr-2">
                            <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate max-w-[160px] overflow-hidden whitespace-nowrap">
                                {capitalizeFirst(workout.exerciseName)}
                            </div>

                        </div>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-xs">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 py-1 dark:border-slate-700 flex items-center gap-1 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition text-slate-700 dark:text-slate-200"
                            onClick={() => setIsOpen(true)}
                        >
                            <Eye className="h-4 w-4 text-slate-500 dark:text-slate-300" />
                        </Button>
                    </div>
                </div>
            </div>

            <SessionsDetailsModal sessionDetails={sessionDetails} isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    )
}

export default RecentActivityCard