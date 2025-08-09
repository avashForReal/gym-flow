/**
 * Test utility for the new Fuse.js exercise service
 */

import { exerciseService } from './exercise-service';

export async function testExerciseService() {
  try {
    console.log('🧪 Testing Fuse.js Exercise Service...');
    
    // Initialize the service
    await exerciseService.initialize();
    console.log('✅ Exercise Service initialized');
    
    // Test search functionality
    const pushExercises = await exerciseService.searchExercises('push');
    console.log(`🔍 Found ${pushExercises.length} exercises matching "push"`);
    
    // Test category filtering
    const strengthExercises = await exerciseService.getExercisesByCategory('strength');
    console.log(`💪 Found ${strengthExercises.length} strength exercises`);
    
    // Test body part filtering
    const chestExercises = await exerciseService.getExercisesByBodyPart('chest');
    console.log(`🫁 Found ${chestExercises.length} chest exercises`);
    
    // Test equipment filtering
    const bodyWeightExercises = await exerciseService.getExercisesByEquipment('body weight');
    console.log(`🏃 Found ${bodyWeightExercises.length} body weight exercises`);
    
    // Test muscle targeting
    const bicepExercises = await exerciseService.getExercisesByMuscle('biceps');
    console.log(`💪 Found ${bicepExercises.length} bicep exercises`);
    
    // Test popular exercises
    const popularExercises = await exerciseService.getPopularExercises(10);
    console.log(`⭐ Top 10 popular exercises:`, popularExercises.slice(0, 5).map(e => e.name));
    
    // Test advanced search with filters
    const advancedSearch = await exerciseService.searchExercises('press', {
      bodyPart: 'chest',
      equipment: 'dumbbell',
      limit: 5
    });
    console.log(`🎯 Advanced search (chest press + dumbbell): ${advancedSearch.length} results`);
    
    // Test exercise stats
    const stats = await exerciseService.getExerciseStats();
    console.log(`📊 Exercise Stats:`, {
      total: stats.total,
      strengthCount: stats.categories['strength'] || 0,
      cardioCount: stats.categories['cardio'] || 0,
      bodyWeightCount: stats.equipment['body weight'] || 0
    });
    
    // Test filter options
    const filterOptions = await exerciseService.getFilterOptions();
    console.log(`🏷️ Available filters:`, {
      bodyParts: filterOptions.bodyParts.length,
      equipment: filterOptions.equipment.length,
      muscles: filterOptions.muscles.length
    });
    
    return {
      searchResults: pushExercises.length,
      strengthCount: strengthExercises.length,
      chestCount: chestExercises.length,
      bodyWeightCount: bodyWeightExercises.length,
      bicepCount: bicepExercises.length,
      popularCount: popularExercises.length,
      advancedSearchCount: advancedSearch.length,
      totalExercises: stats.total
    };
    
  } catch (error) {
    console.error('❌ Exercise Service test failed:', error);
    throw error;
  }
}

// Helper to demonstrate fuzzy search capabilities
export async function demonstrateFuzzySearch() {
  await exerciseService.initialize();
  
  console.log('🔍 Demonstrating Fuzzy Search capabilities:');
  
  const searchTerms = [
    'push up',      // Exact match
    'pushup',       // No space
    'psh up',       // Typo
    'bench pres',   // Typo
    'bicep curl',   // Common exercise
    'squat',        // Single word
  ];
  
  for (const term of searchTerms) {
    const results = await exerciseService.searchExercises(term, { limit: 3 });
    console.log(`  "${term}" → ${results.length} results: ${results.map(r => r.name).join(', ')}`);
  }
}
