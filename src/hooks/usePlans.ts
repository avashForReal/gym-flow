import { db, type WorkoutPlan } from "@/lib/database";
import { useEffect, useState } from "react";

type UsePlansProps = {
  enableFetchPlans?: boolean;
};

export const usePlans = ({ enableFetchPlans = true }: UsePlansProps) => {
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (enableFetchPlans) {
      loadWorkoutPlans();
    }
  }, [enableFetchPlans]);

  const loadWorkoutPlans = async () => {
    try {
      setIsLoading(true);
      const plans = await db.getWorkoutPlans();
      setWorkoutPlans(plans);
    } catch (error) {
      console.error("Failed to load workout plans:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePlan = async (planData: {
    name: string;
    description?: string;
    days: Array<{
      dayIndex: number;
      name: string;
      customName?: string;
      isRestDay: boolean;
      exercises: Array<{ exerciseId: string }>;
    }>;
  }) => {
    try {
      await db.createWorkoutPlan(planData);
      await loadWorkoutPlans();
      setIsCreating(false);
    } catch (error) {
      console.error("Failed to save workout plan:", error);
      alert("Failed to save workout plan. Please try again.");
    }
  };

  const handleDeletePlan = async (planId: number) => {
    if (!confirm("Are you sure you want to delete this workout plan?")) {
      return;
    }
    try {
      await db.deleteWorkoutPlan(planId);
      await loadWorkoutPlans();
    } catch (error) {
      console.error("Failed to delete workout plan:", error);
      alert("Failed to delete workout plan. Please try again.");
    }
  };

  const toggleActivePlan = async (planId: number, isActive: boolean) => {
    await db.toggleActivePlan(planId, isActive);
    await loadWorkoutPlans();
  };

  return {
    activePlan: getActivePlan(workoutPlans),
    workoutPlans,
    isCreating,
    isLoading,
    setIsCreating,
    handleSavePlan,
    handleDeletePlan,
    toggleActivePlan
  };
};

export const getActiveDaysCount = (plan: WorkoutPlan) => {
  return plan.days.filter((day: any) => !day.isRestDay).length;
};

export const getTotalExercisesCount = (plan: WorkoutPlan) => {
  return plan.days.reduce(
    (total: number, day: any) => total + day.exercises.length,
    0
  );
};

export const getActivePlan = (workoutPlans: WorkoutPlan[]) => {
  return workoutPlans.find((plan: WorkoutPlan) => plan.isActive);
};
