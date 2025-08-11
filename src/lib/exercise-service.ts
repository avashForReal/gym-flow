import Fuse from 'fuse.js';
import type { IFuseOptions } from 'fuse.js';
import { DataLoader } from '@/data/load';
import type { Exercise as ExerciseData } from '@/data/types';

export interface ExerciseSearchOptions {
  category?: 'strength' | 'cardio' | 'flexibility' | 'sports';
  bodyPart?: string;
  equipment?: string;
  muscle?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  limit?: number;
}

export interface ExerciseStats {
  total: number;
  categories: Record<string, number>;
  equipment: Record<string, number>;
  bodyParts: Record<string, number>;
  muscles: Record<string, number>;
}

class ExerciseService {
  private fuse: Fuse<ExerciseData> | null = null;
  private exercises: ExerciseData[] = [];
  private initialized = false;
  private fuseOptions: IFuseOptions<ExerciseData> = {
    keys: [
      { name: 'name', weight: 0.7 },
      { name: 'targetMuscles', weight: 0.5 },
      { name: 'bodyParts', weight: 0.4 },
      { name: 'equipments', weight: 0.3 },
      { name: 'secondaryMuscles', weight: 0.2 }
    ],
    threshold: 0.3,
    distance: 100,
    includeScore: true,
    includeMatches: true,
    minMatchCharLength: 2
  };

  constructor() {
    this.initialize();
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      console.log('🔍 Initializing Exercise Service with Fuse.js...');
      
      this.exercises = await DataLoader.loadExercises();
      this.fuse = new Fuse(this.exercises, this.fuseOptions);
      this.initialized = true;
      
      console.log(`✅ Exercise Service ready with ${this.exercises.length} exercises`);
    } catch (error) {
      console.error('❌ Failed to initialize Exercise Service:', error);
      throw error;
    }
  }

  private ensureInitialized(): void {
    if (!this.initialized || !this.fuse) {
      throw new Error('Exercise Service not initialized. Call initialize() first.');
    }
  }

  /**
   * Search exercises with fuzzy matching
   */
  async searchExercises(query: string, options: ExerciseSearchOptions = {}): Promise<ExerciseData[]> {
    await this.initialize();
    this.ensureInitialized();

    let results: ExerciseData[];

    if (query.trim()) {
      // Use Fuse.js for fuzzy search
      const fuseResults = this.fuse!.search(query);
      results = fuseResults.map(result => result.item);
    } else {
      // No search query, return all exercises
      results = [...this.exercises];
    }

    // Apply filters
    results = this.applyFilters(results, options);

    // Apply limit
    if (options.limit) {
      results = results.slice(0, options.limit);
    }

    return results;
  }

  /**
   * Get exercises by category
   */
  async getExercisesByCategory(category: ExerciseSearchOptions['category']): Promise<ExerciseData[]> {
    await this.initialize();
    return this.applyFilters(this.exercises, { category });
  }

  /**
   * Get exercises by body part
   */
  async getExercisesByBodyPart(bodyPart: string): Promise<ExerciseData[]> {
    await this.initialize();
    return this.applyFilters(this.exercises, { bodyPart });
  }

  /**
   * Get exercises by equipment
   */
  async getExercisesByEquipment(equipment: string): Promise<ExerciseData[]> {
    await this.initialize();
    return this.applyFilters(this.exercises, { equipment });
  }

  /**
   * Get exercises by target muscle
   */
  async getExercisesByMuscle(muscle: string): Promise<ExerciseData[]> {
    await this.initialize();
    return this.applyFilters(this.exercises, { muscle });
  }

  /**
   * Get popular/recommended exercises (body weight first, then common equipment)
   */
  async getPopularExercises(limit: number = 20): Promise<ExerciseData[]> {
    await this.initialize();
    
    // Prioritize body weight exercises as "popular"
    const bodyWeightExercises = this.exercises
      .filter(exercise => exercise.equipments.includes('body weight'))
      .slice(0, Math.floor(limit * 0.6)); // 60% body weight

    // Add some dumbbell exercises
    const dumbbellExercises = this.exercises
      .filter(exercise => 
        exercise.equipments.includes('dumbbell') && 
        !bodyWeightExercises.some(bw => bw.exerciseId === exercise.exerciseId)
      )
      .slice(0, Math.floor(limit * 0.4)); // 40% dumbbell

    return [...bodyWeightExercises, ...dumbbellExercises].slice(0, limit);
  }

  /**
   * Get exercise by ID
   */
  async getExerciseById(exerciseId: string): Promise<ExerciseData | undefined> {
    await this.initialize();
    return this.exercises.find(exercise => exercise.exerciseId === exerciseId);
  }

  /**
   * Get exercise statistics
   */
  async getExerciseStats(): Promise<ExerciseStats> {
    await this.initialize();

    const stats: ExerciseStats = {
      total: this.exercises.length,
      categories: {},
      equipment: {},
      bodyParts: {},
      muscles: {}
    };

    // Count categories, equipment, body parts, and muscles
    this.exercises.forEach(exercise => {
      // Categories (we'll categorize based on body parts and equipment)
      const category = this.categorizeExercise(exercise);
      stats.categories[category] = (stats.categories[category] || 0) + 1;

      // Equipment
      exercise.equipments.forEach(eq => {
        stats.equipment[eq] = (stats.equipment[eq] || 0) + 1;
      });

      // Body parts
      exercise.bodyParts.forEach(part => {
        stats.bodyParts[part] = (stats.bodyParts[part] || 0) + 1;
      });

      // Muscles
      [...exercise.targetMuscles, ...exercise.secondaryMuscles].forEach(muscle => {
        stats.muscles[muscle] = (stats.muscles[muscle] || 0) + 1;
      });
    });

    return stats;
  }

  /**
   * Get unique values for filtering
   */
  async getFilterOptions(): Promise<{
    bodyParts: string[];
    muscles: string[];
  }> {
    await this.initialize();

    const bodyParts = [...new Set(this.exercises.flatMap(e => e.bodyParts))].sort();
    const muscles = [...new Set(this.exercises.flatMap(e => [...e.targetMuscles, ...e.secondaryMuscles]))].sort();

    return { bodyParts, muscles };
  }

  private applyFilters(exercises: ExerciseData[], options: ExerciseSearchOptions): ExerciseData[] {
    let filtered = exercises;

    if (options.category) {
      filtered = filtered.filter(exercise => this.categorizeExercise(exercise) === options.category);
    }

    if (options.bodyPart) {
      filtered = filtered.filter(exercise => 
        exercise.bodyParts.some(part => part.toLowerCase() === options.bodyPart!.toLowerCase())
      );
    }

    if (options.equipment) {
      filtered = filtered.filter(exercise => 
        exercise.equipments.some(eq => eq.toLowerCase() === options.equipment!.toLowerCase())
      );
    }

    if (options.muscle) {
      filtered = filtered.filter(exercise => 
        [...exercise.targetMuscles, ...exercise.secondaryMuscles]
          .some(muscle => muscle.toLowerCase() === options.muscle!.toLowerCase())
      );
    }

    if (options.difficulty) {
      filtered = filtered.filter(exercise => this.determineDifficulty(exercise) === options.difficulty);
    }

    return filtered;
  }

  private categorizeExercise(exercise: ExerciseData): 'strength' | 'cardio' | 'flexibility' | 'sports' {
    // Smart categorization based on body parts and equipment
    if (exercise.bodyParts.includes('cardio')) {
      return 'cardio';
    }
    
    if (exercise.equipments.some(eq => 
      ['yoga mat', 'stability ball', 'foam roller', 'roller'].includes(eq.toLowerCase())
    )) {
      return 'flexibility';
    }
    
    if (exercise.bodyParts.some(part => 
      ['chest', 'back', 'shoulders', 'upper arms', 'lower arms', 'upper legs', 'lower legs', 'waist'].includes(part)
    )) {
      return 'strength';
    }
    
    return 'sports';
  }

  private determineDifficulty(exercise: ExerciseData): 'beginner' | 'intermediate' | 'advanced' {
    // Simple heuristic based on equipment and exercise complexity
    if (exercise.equipments.includes('body weight')) {
      return 'beginner';
    }
    
    if (exercise.equipments.some(eq => 
      ['barbell', 'olympic barbell', 'smith machine', 'leverage machine'].includes(eq)
    )) {
      return 'advanced';
    }
    
    return 'intermediate';
  }
}

// Export singleton instance
export const exerciseService = new ExerciseService();

// Export class for testing
export { ExerciseService };
