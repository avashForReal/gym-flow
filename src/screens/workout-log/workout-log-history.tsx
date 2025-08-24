import { useGetLastWorkoutSetsByExerciseId } from "@/hooks/useWorkoutLogging"

type WorkoutLogHistoryProps = {
    exerciseId: string
}

const WorkoutLogHistory = ({ exerciseId }: WorkoutLogHistoryProps) => {
    const { workoutSetData: lastWorkoutData } = useGetLastWorkoutSetsByExerciseId(exerciseId);

    if (!lastWorkoutData) return null;

    return (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
                <span className="text-blue-700 dark:text-blue-300 text-sm font-semibold tracking-tight">
                    Last Workout:&nbsp;
                    <span className="font-normal text-blue-600 dark:text-blue-400">
                        {lastWorkoutData[0].createdAt.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}
                    </span>
                </span>
                <span className="ml-auto text-xs text-blue-700 dark:text-blue-300 font-medium">
                    {lastWorkoutData.length} set{lastWorkoutData.length > 1 ? 's' : ''}
                </span>
            </div>
            <div className="flex flex-col gap-1">
                {lastWorkoutData.map((set, idx) => (
                    <div
                        key={set.id ?? idx}
                        className="flex gap-4 text-xs sm:text-sm items-center px-2 py-1 rounded-md hover:bg-blue-100/60 dark:hover:bg-blue-900/40 transition"
                    >
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 font-bold mr-2 text-xs">
                            {idx + 1}
                        </span>
                        <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">Weight</span>
                            <span className="font-bold text-blue-700 dark:text-blue-200">{set.weight}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">Reps</span>
                            <span className="font-bold text-blue-700 dark:text-blue-200">{set.reps}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default WorkoutLogHistory