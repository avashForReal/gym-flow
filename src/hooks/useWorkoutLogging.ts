import { useEffect, useState } from "react";
import { db } from "@/lib/database";
import type { WorkoutSet } from "@/lib/database";
import { exerciseService } from "@/lib/exercise-service";

export interface WorkoutSetData {
  exerciseId: string;
  weight: number;
  reps: number;
}

type ExerciseLog = {
  exerciseId: string;
  exerciseName: string;
  exerciseImage: string;
  sessionId: number;
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

export const useGetRecentWorkouts = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [recentWorkouts, setRecentWorkouts] = useState<ExerciseLog[] | null>(
    null
  );

  const fetchRecentWorkouts = async () => {
    const recentWorkouts = await db.getRecentWorkoutLogs();
    if (!recentWorkouts) return null;

    const exercises = [];
    for (const workout of recentWorkouts) {
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
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRecentWorkouts();
  }, []);

  return {
    recentWorkouts,
    isLoading,
  };
};
