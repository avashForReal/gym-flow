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

interface WorkoutPlan {
  id: number;
  name: string;
  days: WorkoutPlanDay[];
  createdAt: Date;
  updatedAt: Date;
}

interface WorkoutPlanDay {
  id: number;
  planId: number;
  dayIndex: number; // 0..6 (7 days)
  name: string;
  isRestDay: boolean;
  exercises: WorkoutPlanExercise[];
  createdAt: Date;
  updatedAt: Date;
}

interface WorkoutPlanExercise {
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
      workoutPlanExercises: "++id, planId, dayId, exerciseId, createdAt, updatedAt",
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
    await Promise.all([
      this.users.clear(),
    ]);
  }

  async exportData(): Promise<object> {
    const [users] =
      await Promise.all([
        this.users.toArray(),
      ]);

    return {
      users,
      exportDate: new Date(),
      version: 1,
    };
  }
}

export const db = new GymFlowDatabase();
