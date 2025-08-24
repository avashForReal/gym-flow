import { useEffect, useState } from "react";
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

  const updateWorkoutSet = async (
    setId: number,
    updates: {
      weight?: number;
      reps?: number;
    }
  ): Promise<void> => {
    try {
      await db.updateWorkoutSet(setId, updates);
    } catch (error) {
      console.error("Error updating workout set:", error);
      throw error;
    }
  };

  const deleteWorkoutSet = async (setId: number): Promise<void> => {
    try {
      await db.deleteWorkoutSet(setId);
    } catch (error) {
      console.error("Error deleting workout set:", error);
      throw error;
    }
  };

  return {
    isSaving,
    saveWorkout,
    updateWorkoutSet,
    deleteWorkoutSet,
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

export const useGetRecentWorkouts = (params: { date?: Date }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [recentWorkouts, setRecentWorkouts] = useState<ExerciseLog[] | null>(
    null
  );
  const [totalSessions, setTotalSessions] = useState<number>(0);

  const fetchRecentWorkouts = async () => {
    const response = await db.getRecentWorkoutLogs(params);
    if (!response) return null;

    const { recentWorkoutLogs, totalSessions } = response;

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
    setRecentWorkouts(sortedGroupedExercisesArray);
    setTotalSessions(totalSessions);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRecentWorkouts();
  }, []);

  return {
    recentWorkouts,
    isLoading,
    totalSessions,
  };
};

export const useGetSessionDetails = (sessionId: number) => {
  const [isLoading, setIsLoading] = useState(true);
  const [sessionDetails, setSessionDetails] = useState<{
    exerciseName: string;
    createdAt: Date;
    sets: WorkoutSet[];
  }>({
    exerciseName: "",
    createdAt: new Date(),
    sets: [],
  });

  const fetchSessionDetails = async () => {
    const sessionDetails = await db.getWorkoutSetsBySession(sessionId);
    const exercise = await exerciseService.getExerciseById(sessionDetails[0].exerciseId);
   
    setSessionDetails({
      exerciseName: exercise?.name!,
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