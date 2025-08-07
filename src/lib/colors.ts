/**
 * Gym-focused color system
 * Optimized for workout tracking and gym environments
 */

export const gymColors = {
  // Workout type colors
  strength: 'var(--strength)',
  cardio: 'var(--cardio)',
  flexibility: 'var(--flexibility)',
  rest: 'var(--rest)',

  // Progress indicators
  progress: {
    excellent: 'var(--progress-excellent)',
    good: 'var(--progress-good)',
    average: 'var(--progress-average)',
    needsWork: 'var(--progress-needs-work)',
  },

  // Weight plate colors (standard gym equipment)
  plates: {
    red: 'var(--plate-red)', // 25kg/55lb
    blue: 'var(--plate-blue)', // 20kg/45lb
    yellow: 'var(--plate-yellow)', // 15kg/35lb
    green: 'var(--plate-green)', // 10kg/25lb
    white: 'var(--plate-white)', // 2.5kg/5lb
  },
} as const;

/**
 * Tailwind-compatible color classes
 */
export const gymColorClasses = {
  // Workout type colors
  strength: 'bg-strength text-white',
  cardio: 'bg-cardio text-white',
  flexibility: 'bg-flexibility text-white',
  rest: 'bg-rest text-white',

  // Progress indicators
  progress: {
    excellent: 'bg-progress-excellent text-white',
    good: 'bg-progress-good text-white',
    average: 'bg-progress-average text-white',
    needsWork: 'bg-progress-needs-work text-white',
  },

  // Weight plate colors
  plates: {
    red: 'bg-plate-red text-white',
    blue: 'bg-plate-blue text-white',
    yellow: 'bg-plate-yellow text-black',
    green: 'bg-plate-green text-white',
    white: 'bg-plate-white text-black',
  },
} as const;

/**
 * Get workout type color based on exercise category
 */
export function getWorkoutTypeColor(type: 'strength' | 'cardio' | 'flexibility' | 'rest'): string {
  return gymColors[type];
}

/**
 * Get progress color based on performance percentage
 */
export function getProgressColor(percentage: number): string {
  if (percentage >= 90) return gymColors.progress.excellent;
  if (percentage >= 75) return gymColors.progress.good;
  if (percentage >= 60) return gymColors.progress.average;
  return gymColors.progress.needsWork;
}

/**
 * Get weight plate color for visual weight representation
 */
export function getPlateColor(weight: number): string {
  // Standard Olympic plate colors
  if (weight >= 25) return gymColors.plates.red;
  if (weight >= 20) return gymColors.plates.blue;
  if (weight >= 15) return gymColors.plates.yellow;
  if (weight >= 10) return gymColors.plates.green;
  return gymColors.plates.white;
}

/**
 * Workout type definitions with colors and metadata
 */
export const workoutTypes = {
  strength: {
    label: 'Strength',
    color: gymColors.strength,
    description: 'Raw power & heavy lifting',
    icon: '🔥',
  },
  cardio: {
    label: 'Cardio',
    color: gymColors.cardio,
    description: 'Heart pumping endurance',
    icon: '⚡',
  },
  flexibility: {
    label: 'Flexibility',
    color: gymColors.flexibility,
    description: 'Mobility & recovery',
    icon: '🌟',
  },
  rest: {
    label: 'Rest',
    color: gymColors.rest,
    description: 'Recovery & restoration',
    icon: '🛌',
  },
} as const;

export type WorkoutType = keyof typeof workoutTypes;