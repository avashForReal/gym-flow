import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

type LogsHeaderProps = {
    setIsExerciseDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const LogsHeader = ({ setIsExerciseDrawerOpen }: LogsHeaderProps) => {
    return (
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-border/50">
            <div className="p-4 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                        Workout Logs
                    </h1>
                    <p className="text-muted-foreground text-xs mt-0.5">
                        Track your training progress.
                    </p>
                </div>
                <Button
                    className="h-8 px-2 rounded-md"
                    onClick={() => setIsExerciseDrawerOpen(true)}
                >
                    Choose Exercise
                    <ArrowRight className="h-3 w-3 mr-1" />
                </Button>
            </div>
        </div>
    )
}

export default LogsHeader