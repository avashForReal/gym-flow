import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetRecentWorkouts } from "@/hooks/useWorkoutLogging";
import { capitalizeFirst } from "@/lib/string-helper";
import { Clock, Eye, History } from "lucide-react"

const RecentActivity = () => {
    const { recentWorkouts, isLoading } = useGetRecentWorkouts();

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!recentWorkouts) {
        return (
            <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200 dark:border-slate-700">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Clock className="h-5 w-5" />
                        Recent Activity
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <History className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="font-medium mb-2">No Recent Workouts</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Start your first workout to see your activity here
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200 dark:border-slate-700 gap-2 px-2">
            <div className="pb-4 px-4">
                <div className="flex items-center justify-start gap-2 text-base font-semibold">
                    <Clock className="h-5 w-5" />
                    Recent Activity
                </div>
            </div>
            <div className="px-2 pb-4 flex flex-col gap-3">
                {recentWorkouts.map((workout, index) => (
                    <div
                        key={index}
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
                        <div className="flex-1 flex justify-between mr-2">
                            <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate max-w-[160px] overflow-hidden whitespace-nowrap">
                                {capitalizeFirst(workout.exerciseName)}
                            </div>
                            <div className="flex items-center gap-1 mt-1 text-xs">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 px-2 py-1 dark:border-slate-700 flex items-center gap-1 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition text-slate-700 dark:text-slate-200"
                                >
                                    <Eye className="h-4 w-4 text-slate-500 dark:text-slate-300" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    )


}

export default RecentActivity