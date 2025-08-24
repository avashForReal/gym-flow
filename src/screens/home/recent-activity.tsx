import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetRecentWorkouts } from "@/hooks/useWorkoutLogging";
import { Clock, History } from "lucide-react"
import RecentActivityCard from "./recent-activity-card";

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
                    <RecentActivityCard key={index} workout={workout} />
                ))}
            </div>
        </Card>
    )


}

export default RecentActivity