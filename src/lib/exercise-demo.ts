/**
 * Demo showing how to use the new Exercise Service with Fuse.js
 * Run this in browser console to test the exercise system
 */

import { exerciseService } from './exercise-service';

// Example usage patterns for the exercise service
export const exerciseDemo = {
  
  // Basic search
  async searchDemo() {
    console.log('=== Basic Search Demo ===');
    
    // Search for push exercises
    const pushExercises = await exerciseService.searchExercises('push', { limit: 5 });
    console.log('Push exercises:', pushExercises.map(e => e.name));
    
    // Search with typos (fuzzy search)
    const typoResults = await exerciseService.searchExercises('benchpres', { limit: 3 });
    console.log('Typo search "benchpres":', typoResults.map(e => e.name));
  },
  
  // Category filtering
  async categoryDemo() {
    console.log('=== Category Demo ===');
    
    const strength = await exerciseService.getExercisesByCategory('strength');
    const cardio = await exerciseService.getExercisesByCategory('cardio');
    
    console.log(`Strength: ${strength.length}, Cardio: ${cardio.length}`);
    console.log('Sample strength:', strength.slice(0, 3).map(e => e.name));
    console.log('Sample cardio:', cardio.slice(0, 3).map(e => e.name));
  },
  
  // Equipment filtering
  async equipmentDemo() {
    console.log('=== Equipment Demo ===');
    
    const bodyWeight = await exerciseService.getExercisesByEquipment('body weight');
    const dumbbell = await exerciseService.getExercisesByEquipment('dumbbell');
    const barbell = await exerciseService.getExercisesByEquipment('barbell');
    
    console.log(`Body Weight: ${bodyWeight.length}`);
    console.log(`Dumbbell: ${dumbbell.length}`);
    console.log(`Barbell: ${barbell.length}`);
    
    console.log('Sample body weight exercises:', bodyWeight.slice(0, 5).map(e => e.name));
  },
  
  // Body part targeting
  async bodyPartDemo() {
    console.log('=== Body Part Demo ===');
    
    const chest = await exerciseService.getExercisesByBodyPart('chest');
    const back = await exerciseService.getExercisesByBodyPart('back');
    const legs = await exerciseService.getExercisesByBodyPart('upper legs');
    
    console.log(`Chest: ${chest.length}, Back: ${back.length}, Legs: ${legs.length}`);
    console.log('Sample chest exercises:', chest.slice(0, 3).map(e => e.name));
  },
  
  // Advanced filtering
  async advancedDemo() {
    console.log('=== Advanced Filtering Demo ===');
    
    // Chest exercises with dumbbells
    const chestDumbbell = await exerciseService.searchExercises('', {
      bodyPart: 'chest',
      equipment: 'dumbbell',
      limit: 5
    });
    console.log('Chest + Dumbbell:', chestDumbbell.map(e => e.name));
    
    // Back exercises targeting lats
    const backLats = await exerciseService.searchExercises('', {
      bodyPart: 'back',
      muscle: 'lats',
      limit: 5
    });
    console.log('Back + Lats:', backLats.map(e => e.name));
    
    // Beginner-friendly exercises
    const beginnerExercises = await exerciseService.searchExercises('', {
      difficulty: 'beginner',
      limit: 10
    });
    console.log('Beginner exercises:', beginnerExercises.map(e => e.name));
  },
  
  // Popular exercises
  async popularDemo() {
    console.log('=== Popular Exercises Demo ===');
    
    const popular = await exerciseService.getPopularExercises(10);
    console.log('Top 10 popular exercises:', popular.map(e => e.name));
  },
  
  // Exercise details
  async detailsDemo() {
    console.log('=== Exercise Details Demo ===');
    
    // Get a specific exercise by ID
    const pushUp = await exerciseService.getExerciseById('0br45wL'); // From your JSON
    if (pushUp) {
      console.log('Push-up details:', {
        name: pushUp.name,
        bodyParts: pushUp.bodyParts,
        targetMuscles: pushUp.targetMuscles,
        equipment: pushUp.equipments,
        instructions: pushUp.instructions.slice(0, 2) // First 2 steps
      });
    }
  },
  
  // Statistics
  async statsDemo() {
    console.log('=== Statistics Demo ===');
    
    const stats = await exerciseService.getExerciseStats();
    console.log('Exercise Statistics:', {
      total: stats.total,
      topCategories: Object.entries(stats.categories)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3),
      topEquipment: Object.entries(stats.equipment)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5),
      topBodyParts: Object.entries(stats.bodyParts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
    });
  },
  
  // Run all demos
  async runAll() {
    await exerciseService.initialize();
    console.log('🚀 Running all Exercise Service demos...\n');
    
    await this.searchDemo();
    console.log('');
    await this.categoryDemo();
    console.log('');
    await this.equipmentDemo();
    console.log('');
    await this.bodyPartDemo();
    console.log('');
    await this.advancedDemo();
    console.log('');
    await this.popularDemo();
    console.log('');
    await this.detailsDemo();
    console.log('');
    await this.statsDemo();
    
    console.log('\n✅ All demos completed!');
  }
};

// Global access for browser console testing
if (typeof window !== 'undefined') {
  (window as any).exerciseDemo = exerciseDemo;
  (window as any).exerciseService = exerciseService;
}
