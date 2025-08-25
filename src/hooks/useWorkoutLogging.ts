import { useEffect, useState, useCallback } from "react";
import { db } from "@/lib/database";
import type { WorkoutSet } from "@/lib/database";
import { exerciseService } from "@/lib/exercise-service";

export interface WorkoutSetData {
  exerciseId: string;
  weight: number;
  reps: number;
}

export type ExerciseLog = {
  exerciseId: string;
  exerciseName: string;
  exerciseImage: string;
  sessionId: number;
  date: Date;
};

type SetEntry = {
  weight: number;
  reps: number;
};

type Session = {
  date: Date;
  sessionId: number;
  exerciseId: string;
  exerciseName: string;
  exerciseImage: string;
  sets: SetEntry[];
};

export const useWorkoutLogs = () => {
  const [isSaving, setIsSaving] = useState(false);

  const saveWorkout = async (sets: WorkoutSetData[]): Promise<void> => {
    if (sets.length === 0) {
      throw new Error("No sets to save");
    }

    try {
      setIsSaving(true);
      const sessionId = await db.createWorkoutSession({});
      await db.saveWorkoutSets(sessionId, sets);
      setIsSaving(false);
    } catch (error) {
      console.error("Error saving workout:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    saveWorkout,
  };
};

export const useGetLastWorkoutSetsByExerciseId = (exerciseId: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [workoutSetData, setWorkoutSetData] = useState<WorkoutSet[] | null>(
    null
  );

  const fetchLastWorkoutData = async () => {
    const lastWorkoutSets = await db.getLastWorkoutSet(exerciseId);
    if (lastWorkoutSets) {
      setWorkoutSetData(lastWorkoutSets);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLastWorkoutData();
  }, [exerciseId]);

  return {
    workoutSetData,
    isLoading,
  };
};

export const useGetRecentWorkouts = (params: { 
  date?: Date;
  limit?: number;
  initialLimit?: number;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [recentWorkouts, setRecentWorkouts] = useState<ExerciseLog[] | null>(
    null
  );
  const [totalSessions, setTotalSessions] = useState<number>(0);
  const [hasMore, setHasMore] = useState(true);
  const [lastCursor, setLastCursor] = useState<number | null>(null);

  const initialLimit = params.initialLimit ?? 10;
  const loadMoreLimit = params.limit ?? 10;

  const fetchRecentWorkouts = useCallback(async (isLoadMore = false, cursor?: number) => {
    try {
      if (isLoadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      const response = await db.getRecentWorkoutLogs({
        limit: isLoadMore ? loadMoreLimit : initialLimit,
        date: params.date,
        cursor: cursor || undefined,
      });


      if (!response) {
        if (isLoadMore) {
          setIsLoadingMore(false);
        } else {
          setIsLoading(false);
        }
        setRecentWorkouts(null);
        return;
      }

      const { recentWorkoutLogs, totalSessions, hasMore: moreAvailable } = response;

      const exercises = [];
      for (const workout of recentWorkoutLogs) {
        for (const workoutExercise of workout.exercises) {
          const exercise = await exerciseService.getExerciseById(
            workoutExercise.exerciseId
          );
          exercises.push({
            exerciseId: workoutExercise.exerciseId,
            exerciseName: exercise?.name!,
            exerciseImage: exercise?.gifUrl!,
            weight: workoutExercise.weight,
            reps: workoutExercise.reps,
            sessionId: workout.id!,
            date: workout.date,
          });
        }
      }

      const groupedExercises = exercises.reduce<Record<number, Session>>(
        (
          acc,
          { sessionId, exerciseId, exerciseName, exerciseImage, weight, reps, date }
        ) => {
          if (!acc[sessionId]) {
            acc[sessionId] = {
              sessionId,
              exerciseId,
              exerciseName,
              exerciseImage,
              date,
              sets: [],
            };
          }

          acc[sessionId].sets.push({ weight, reps });

          return acc;
        },
        {}
      );

      const groupedExercisesArray = Object.values(groupedExercises);
      const sortedGroupedExercisesArray = groupedExercisesArray.sort(
        (a, b) => b.date.getTime() - a.date.getTime()
      );

      if (isLoadMore) {
        setRecentWorkouts(prev => prev ? [...prev, ...sortedGroupedExercisesArray] : sortedGroupedExercisesArray);
      } else {
        setRecentWorkouts(sortedGroupedExercisesArray);
      }

      setTotalSessions(totalSessions);
      setHasMore(moreAvailable);
      
      // Set cursor for next page
      if (recentWorkoutLogs.length > 0) {
        const lastSession = recentWorkoutLogs[recentWorkoutLogs.length - 1];
        setLastCursor(lastSession.id || null);
      }
    } catch (error) {
      console.error('Error fetching recent workouts:', error);
    } finally {
      if (isLoadMore) {
        setIsLoadingMore(false);
      } else {
        setIsLoading(false);
      }
    }
  }, [params.date, params.limit, initialLimit, loadMoreLimit]);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore || !lastCursor) return;
    await fetchRecentWorkouts(true, lastCursor);
  }, [hasMore, isLoadingMore, lastCursor, fetchRecentWorkouts]);

  useEffect(() => {
    fetchRecentWorkouts();
  }, [fetchRecentWorkouts]);

  return {
    recentWorkouts,
    isLoading,
    isLoadingMore,
    hasMore,
    totalSessions,
    loadMore,
    refetch: () => fetchRecentWorkouts(),
  };
};

export const useGetSessionDetails = (sessionId: number) => {
  const [isLoading, setIsLoading] = useState(true);
  const [sessionDetails, setSessionDetails] = useState<{
    exerciseName: string;
    exerciseId: string;
    createdAt: Date;
    sets: WorkoutSet[];
  }>({
    exerciseName: "",
    exerciseId: "",
    createdAt: new Date(),
    sets: [],
  });

  const fetchSessionDetails = async () => {
    const sessionDetails = await db.getWorkoutSetsBySession(sessionId);
    const exercise = await exerciseService.getExerciseById(sessionDetails[0].exerciseId);
   
    setSessionDetails({
      exerciseName: exercise?.name!,
      exerciseId: sessionDetails[0].exerciseId,
      createdAt: sessionDetails[0].createdAt,
      sets: sessionDetails,
    });
    setIsLoading(false);
  }

  useEffect(() => {
    fetchSessionDetails();
  }, [sessionId]);

  return {
    sessionDetails,
    isLoading,
  };
}

export const useDeleteWorkoutSession = (sessionId: number) => {
  const deleteWorkoutSession = async () => {
    await db.deleteWorkoutSession(sessionId);
  }

  return {
    deleteWorkoutSession,
  }
}

export const useUpdateWorkoutSession = (sessionId: number) => {
  const updateWorkoutSession = async (sets: WorkoutSetData[]) => {
    await db.updateWorkoutSession(sessionId, sets);
  }

  return {
    updateWorkoutSession,
  }
}