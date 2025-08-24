import { Button } from "@/components/ui/button"
import { capitalizeFirst } from "@/lib/string-helper"
import { ArrowLeft } from "lucide-react"

type WorkoutLogHeaderProps = {
    handleBack: () => void
    exerciseName: string
}

const WorkoutLogHeader = ({ handleBack, exerciseName }: WorkoutLogHeaderProps) => {
    return (
        <div className="flex items-center gap-2 p-2">
            <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 p-0"
                onClick={handleBack}
            >
                <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1 min-w-0">
                <span className="font-semibold text-base text-slate-900 dark:text-white">
                    Log Workout
                </span>
                <span className="block text-xs text-muted-foreground truncate">
                    {capitalizeFirst(exerciseName)}
                </span>
            </div>
        </div>
    )
}

export default WorkoutLogHeader