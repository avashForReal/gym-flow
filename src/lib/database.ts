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

// Workout-related types (we'll expand these later)
export interface Exercise {
  id?: number;
  name: string;
  category: "strength" | "cardio" | "flexibility" | "sports";
  muscleGroups: string[];
  equipment?: string;
  instructions?: string;
  createdAt: Date;
}

export interface WorkoutSet {
  id?: number;
  exerciseId: number;
  workoutId: number;
  setNumber: number;
  weight?: number; // in kg
  reps?: number;
  duration?: number; // in seconds for cardio
  distance?: number; // in meters for cardio
  rpe?: number; // Rate of Perceived Exertion (1-10)
  notes?: string;
  createdAt: Date;
}

export interface Workout {
  id?: number;
  name?: string;
  date: Date;
  duration?: number; // in minutes
  notes?: string;
  userId: number;
  exercises: number[]; // Exercise IDs
  createdAt: Date;
  updatedAt: Date;
}

export interface PersonalRecord {
  id?: number;
  userId: number;
  exerciseId: number;
  type: "weight" | "reps" | "duration" | "distance";
  value: number;
  date: Date;
  workoutId?: number;
  createdAt: Date;
}

// Database class
export class GymFlowDatabase extends Dexie {
  // Tables
  users!: EntityTable<UserProfile, "id">;
  exercises!: EntityTable<Exercise, "id">;
  workouts!: EntityTable<Workout, "id">;
  workoutSets!: EntityTable<WorkoutSet, "id">;
  personalRecords!: EntityTable<PersonalRecord, "id">;

  constructor() {
    super("GymFlowDB");

    this.version(1).stores({
      users: "++id, name, email, createdAt, updatedAt",
      exercises: "++id, name, category, muscleGroups, createdAt",
      workouts: "++id, name, date, userId, createdAt, updatedAt",
      workoutSets: "++id, exerciseId, workoutId, setNumber, createdAt",
      personalRecords: "++id, userId, exerciseId, type, value, date, createdAt",
    });

    // Hooks for automatic timestamps
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

    this.workouts.hook("creating", function (_primKey, obj, _trans) {
      obj.createdAt = new Date();
      obj.updatedAt = new Date();
    });

    this.workouts.hook(
      "updating",
      function (modifications, _primKey, _obj, _trans) {
        (modifications as any).updatedAt = new Date();
      }
    );

    this.workoutSets.hook("creating", function (_primKey, obj, _trans) {
      obj.createdAt = new Date();
    });

    this.personalRecords.hook("creating", function (_primKey, obj, _trans) {
      obj.createdAt = new Date();
    });

    this.exercises.hook("creating", function (_primKey, obj, _trans) {
      obj.createdAt = new Date();
    });
  }

  // User-related methods (Single user system)
  async getCurrentUser(): Promise<UserProfile | undefined> {
    // Single user system: get the one and only user profile
    return await this.users.orderBy("id").first();
  }

  async getUserById(id: number): Promise<UserProfile | undefined> {
    return await this.users.get(id);
  }

  async createUser(
    userData: Omit<UserProfile, "id" | "createdAt" | "updatedAt">
  ): Promise<number> {
    // Single user system: replace any existing user profile
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
    // For single user system, just check if user profile exists
    const user = await this.users.orderBy("id").first();
    return !user;
  }

  // Exercise-related methods (we'll expand these)
  async getExercisesByCategory(
    category: Exercise["category"]
  ): Promise<Exercise[]> {
    return await this.exercises.where("category").equals(category).toArray();
  }

  async searchExercises(query: string): Promise<Exercise[]> {
    return await this.exercises
      .filter(
        (exercise) =>
          exercise.name.toLowerCase().includes(query.toLowerCase()) ||
          exercise.muscleGroups.some((muscle) =>
            muscle.toLowerCase().includes(query.toLowerCase())
          )
      )
      .toArray();
  }

  // Workout-related methods (we'll expand these)
  async getUserWorkouts(userId: number, limit?: number): Promise<Workout[]> {
    let query = this.workouts.where("userId").equals(userId).reverse();
    if (limit) {
      query = query.limit(limit);
    }
    return await query.toArray();
  }

  async getWorkoutSets(workoutId: number): Promise<WorkoutSet[]> {
    return await this.workoutSets
      .where("workoutId")
      .equals(workoutId)
      .sortBy("setNumber");
  }

  // Personal Records methods
  async getUserPRs(
    userId: number,
    exerciseId?: number
  ): Promise<PersonalRecord[]> {
    let query = this.personalRecords.where("userId").equals(userId);
    if (exerciseId) {
      query = query.and((record) => record.exerciseId === exerciseId);
    }
    return await query.reverse().toArray();
  }

  // Database utilities
  async clearAllData(): Promise<void> {
    await Promise.all([
      this.users.clear(),
      this.exercises.clear(),
      this.workouts.clear(),
      this.workoutSets.clear(),
      this.personalRecords.clear(),
    ]);
  }

  async exportData(): Promise<object> {
    const [users, exercises, workouts, workoutSets, personalRecords] =
      await Promise.all([
        this.users.toArray(),
        this.exercises.toArray(),
        this.workouts.toArray(),
        this.workoutSets.toArray(),
        this.personalRecords.toArray(),
      ]);

    return {
      users,
      exercises,
      workouts,
      workoutSets,
      personalRecords,
      exportDate: new Date(),
      version: 1,
    };
  }
}

export const db = new GymFlowDatabase();
