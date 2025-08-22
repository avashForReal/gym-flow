import Dexie, { type EntityTable } from "dexie";
export interface UserProfile {
  id?: number;
  name: string;
  age: number;
  heightCm: number;
  heightFeet: number;
  heightInches: number;
  weightKg: number;
  weightLbs: number;
  targetWeightKg: number;
  targetWeightLbs: number;
  gender: "male" | "female" | "other" | "prefer-not-to-say";
  activityLevel:
    | "sedentary"
    | "lightly-active"
    | "moderately-active"
    | "very-active"
    | "extremely-active";
  primaryGoal:
    | "lose-weight"
    | "gain-muscle"
    | "get-stronger"
    | "improve-endurance"
    | "general-fitness"
    | "sport-specific";
  experienceLevel: "beginner" | "intermediate" | "advanced" | "expert";
  preferredUnits: "metric" | "imperial";
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkoutPlan {
  id: number;
  name: string;
  description?: string;
  days: WorkoutPlanDay[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkoutPlanDay {
  id: number;
  planId: number;
  dayIndex: number; // 0..6 (7 days)
  name: string;
  isRestDay: boolean;
  exercises: WorkoutPlanExercise[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkoutPlanExercise {
  id: number;
  planId: number;
  dayId: number;
  exerciseId: string; // from json dataset
  createdAt: Date;
  updatedAt: Date;
}

export class GymFlowDatabase extends Dexie {
  users!: EntityTable<UserProfile, "id">;
  workoutPlans!: EntityTable<WorkoutPlan, "id">;
  workoutPlanDays!: EntityTable<WorkoutPlanDay, "id">;
  workoutPlanExercises!: EntityTable<WorkoutPlanExercise, "id">;

  constructor() {
    super("GymFlowDB");

    this.version(1).stores({
      users: "++id, name, createdAt, updatedAt",
      workoutPlans: "++id, name, createdAt, updatedAt",
      workoutPlanDays: "++id, planId, dayIndex, createdAt, updatedAt",
      workoutPlanExercises:
        "++id, planId, dayId, exerciseId, createdAt, updatedAt",
    });

    this.users.hook("creating", function (_primKey, obj, _trans) {
      obj.createdAt = new Date();
      obj.updatedAt = new Date();
    });

    this.users.hook(
      "updating",
      function (modifications, _primKey, _obj, _trans) {
        (modifications as any).updatedAt = new Date();
      }
    );
  }

  async getCurrentUser(): Promise<UserProfile | undefined> {
    return await this.users.orderBy("id").first();
  }

  async getUserById(id: number): Promise<UserProfile | undefined> {
    return await this.users.get(id);
  }

  async createUser(
    userData: Omit<UserProfile, "id" | "createdAt" | "updatedAt">
  ): Promise<number> {
    await this.users.clear();

    const id = await this.users.add(userData as UserProfile);
    if (typeof id === "undefined") {
      throw new Error("Failed to create user");
    }
    return id;
  }

  async updateUser(id: number, updates: Partial<UserProfile>): Promise<number> {
    const updated = await this.users.update(id, updates);
    if (typeof updated === "undefined") {
      throw new Error(`Failed to update user with id ${id}`);
    }
    return updated;
  }

  async isFirstTimeUser(): Promise<boolean> {
    const user = await this.users.orderBy("id").first();
    return !user;
  }

  async clearAllData(): Promise<void> {
    await Promise.all([this.users.clear()]);
  }

  async exportData(): Promise<object> {
    const [users] = await Promise.all([this.users.toArray()]);

    return {
      users,
      exportDate: new Date(),
      version: 1,
    };
  }

  // Workout Plan Operations
  async createWorkoutPlan(planData: {
    name: string;
    description?: string;
    days: Array<{
      dayIndex: number;
      name: string;
      customName?: string;
      isRestDay: boolean;
      exercises: Array<{ exerciseId: string }>;
    }>;
  }): Promise<number> {
    const now = new Date();

    // Create the plan
    const planId = await this.workoutPlans.add({
      name: planData.name,
      description: planData.description,
      createdAt: now,
      updatedAt: now,
    } as WorkoutPlan);

    if (typeof planId === "undefined") {
      throw new Error("Failed to create workout plan");
    }

    // Create the days and exercises
    for (const dayData of planData.days) {
      const dayName = dayData.customName
        ? `${dayData.name} [${dayData.customName}]`
        : dayData.name;

      const dayId = await this.workoutPlanDays.add({
        planId: planId as number,
        dayIndex: dayData.dayIndex,
        name: dayName,
        isRestDay: dayData.isRestDay,
        createdAt: now,
        updatedAt: now,
      } as WorkoutPlanDay);

      if (typeof dayId === "undefined") {
        throw new Error(`Failed to create day ${dayData.dayIndex}`);
      }

      // Add exercises for this day
      for (const exercise of dayData.exercises) {
        await this.workoutPlanExercises.add({
          planId: planId as number,
          dayId: dayId as number,
          exerciseId: exercise.exerciseId,
          createdAt: now,
          updatedAt: now,
        } as WorkoutPlanExercise);
      }
    }

    return planId as number;
  }

  async updateWorkoutPlan(planId: number, planData: {
    name: string;
    description?: string;
    days: Array<{
      dayIndex: number;
      name: string;
      customName?: string;
      isRestDay: boolean;
      exercises: Array<{ exerciseId: string }>;
    }>;
  }): Promise<number> {
    const now = new Date();

    // Update the plan
    await this.workoutPlans.update(planId, {
      name: planData.name,
      description: planData.description,
      updatedAt: now,
    });

    await this.workoutPlanDays.where("planId").equals(planId).delete();
    await this.workoutPlanExercises.where("planId").equals(planId).delete();

    // Update the days and exercises
    for (const dayData of planData.days) {
      const dayName = dayData.customName
        ? `${dayData.name} [${dayData.customName}]`
        : dayData.name;

      const dayId = await this.workoutPlanDays.add({
        planId: planId as number,
        dayIndex: dayData.dayIndex,
        name: dayName,
        isRestDay: dayData.isRestDay,
        createdAt: now,
        updatedAt: now,
      } as WorkoutPlanDay);

      if (typeof dayId === "undefined") {
        throw new Error(`Failed to create day ${dayData.dayIndex}`);
      }

      // Add exercises for this day
      for (const exercise of dayData.exercises) {
        await this.workoutPlanExercises.add({
          planId: planId as number,
          dayId: dayId as number,
          exerciseId: exercise.exerciseId,
          createdAt: now,
          updatedAt: now,
        } as WorkoutPlanExercise);
      }
    }

    return planId as number;
  }

  async getWorkoutPlans(): Promise<WorkoutPlan[]> {
    const plans = await this.workoutPlans
      .orderBy("createdAt")
      .reverse()
      .toArray();

    // Load days and exercises for each plan
    for (const plan of plans) {
      const days = await this.workoutPlanDays
        .where("planId")
        .equals(plan.id)
        .toArray();
      days.sort((a, b) => a.dayIndex - b.dayIndex);

      for (const day of days) {
        day.exercises = await this.workoutPlanExercises
          .where("dayId")
          .equals(day.id)
          .toArray();
      }

      plan.days = days;
    }

    return plans.sort((_, b) => (b.isActive ? 1 : -1));
  } 

  async getWorkoutPlan(planId: number): Promise<WorkoutPlan | undefined> {
    const plan = await this.workoutPlans.get(planId);
    if (!plan) return undefined;

    const days = await this.workoutPlanDays
      .where("planId")
      .equals(planId)
      .toArray();
    days.sort((a, b) => a.dayIndex - b.dayIndex);

    for (const day of days) {
      day.exercises = await this.workoutPlanExercises
        .where("dayId")
        .equals(day.id)
        .toArray();
    }

    plan.days = days;
    return plan;
  }

  async deleteWorkoutPlan(planId: number): Promise<void> {
    // Delete exercises first
    const days = await this.workoutPlanDays
      .where("planId")
      .equals(planId)
      .toArray();
    for (const day of days) {
      await this.workoutPlanExercises.where("dayId").equals(day.id).delete();
    }

    // Delete days
    await this.workoutPlanDays.where("planId").equals(planId).delete();

    // Delete plan
    await this.workoutPlans.delete(planId);
  }

  async toggleActivePlan(planId: number, isActive: boolean): Promise<void> {
    for (const plan of await this.workoutPlans.toArray()) {
      if (plan.isActive) {
        await this.workoutPlans.update(plan.id, { isActive: false });
      }
    }

    await this.workoutPlans.update(planId, { isActive });
  }
}

export const db = new GymFlowDatabase();
