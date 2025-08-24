import { useEffect, useState } from "react";
import { db } from "@/lib/database";
import type { WorkoutSet } from "@/lib/database";

export interface WorkoutSetData {
  exerciseId: string;
  weight: number;
  reps: number;
}

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
  const [workoutSetData, setWorkoutSetData] = useState<WorkoutSet[] | null>(null);

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