import { Card } from "@/components/ui/card"
import { Calendar, Clock, Dumbbell, Users } from "lucide-react"

type PlansStatsProps = {
    totalPlans: number
    totalExercises: number
    averageDaysPerWeek: number
    latestPlan: string
}

const PlansStats = ({ totalPlans, totalExercises, latestPlan, averageDaysPerWeek }: PlansStatsProps) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <Card className="p-2 bg-white/80 dark:bg-slate-800/80 border-none shadow-none flex items-center">
                <div className="flex items-center gap-2 w-full">
                    <div className="w-7 h-7 bg-gradient-to-br from-primary/20 to-primary/40 rounded-lg flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] text-muted-foreground font-medium leading-none">Total Plans</p>
                        <p className="text-sm font-bold leading-tight">{totalPlans}</p>
                    </div>
                </div>
            </Card>
            <Card className="p-2 bg-white/80 dark:bg-slate-800/80 border-none shadow-none flex items-center">
                <div className="flex items-center gap-2 w-full">
                    <div className="w-7 h-7 bg-gradient-to-br from-indigo-400/20 to-indigo-600/30 rounded-lg flex items-center justify-center">
                        <Dumbbell className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] text-muted-foreground font-medium leading-none">Total Exercises</p>
                        <p className="text-base font-bold leading-tight">
                            {totalExercises}
                        </p>
                    </div>
                </div>
            </Card>
            <Card className="p-2 bg-white/80 dark:bg-slate-800/80 border-none shadow-none flex items-center">
                <div className="flex items-center gap-2 w-full">
                    <div className="w-7 h-7 bg-gradient-to-br from-emerald-400/20 to-emerald-600/30 rounded-lg flex items-center justify-center">
                        <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] text-muted-foreground font-medium leading-none">Avg Days/Week</p>
                        <p className="text-base font-bold leading-tight">
                            {averageDaysPerWeek}
                        </p>
                    </div>
                </div>
            </Card>
            <Card className="p-2 bg-white/80 dark:bg-slate-800/80 border-none shadow-none flex items-center">
                <div className="flex items-center gap-2 w-full">
                    <div className="w-7 h-7 bg-gradient-to-br from-pink-400/20 to-pink-600/30 rounded-lg flex items-center justify-center">
                        <Users className="h-4 w-4 text-pink-600 dark:text-pink-300" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] text-muted-foreground font-medium leading-none">Latest Plan</p>
                        <p className="text-xs font-bold truncate max-w-16 leading-tight">
                            {latestPlan}
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default PlansStats