import type { UserProfile } from "@/lib/database";

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  isComplete: boolean;
}

export interface OnboardingData {
  currentStep: number;
  totalSteps: number;
  steps: OnboardingStep[];
  userData: Partial<UserProfile>;
}

export type ActivityLevel = UserProfile['activityLevel'];
export type PrimaryGoal = UserProfile['primaryGoal'];
export type ExperienceLevel = UserProfile['experienceLevel'];
export type Gender = UserProfile['gender'];
export type Units = UserProfile['preferredUnits'];

// Helper types for form validation
export interface UserProfileFormData {
  name: string;
  heightCm: string;
  heightFeet?: string;
  heightInches?: string;
  weight: string;
  gender: Gender;
  activityLevel: ActivityLevel;
  primaryGoal: PrimaryGoal;
  targetWeight?: string;
  experienceLevel: ExperienceLevel;
  preferredUnits: Units;
}

// Constants for dropdown options
export const ACTIVITY_LEVELS: { value: ActivityLevel; label: string; description: string }[] = [
  { value: 'sedentary', label: 'Sedentary', description: 'Little to no exercise' },
  { value: 'lightly-active', label: 'Lightly Active', description: 'Light exercise 1-3 days/week' },
  { value: 'moderately-active', label: 'Moderately Active', description: 'Moderate exercise 3-5 days/week' },
  { value: 'very-active', label: 'Very Active', description: 'Hard exercise 6-7 days/week' },
  { value: 'extremely-active', label: 'Extremely Active', description: 'Very hard exercise, physical job' },
];

export const PRIMARY_GOALS: { value: PrimaryGoal; label: string; icon: string }[] = [
  { value: 'lose-weight', label: 'Lose Weight', icon: '⚖️' },
  { value: 'gain-muscle', label: 'Build Muscle', icon: '💪' },
  { value: 'get-stronger', label: 'Get Stronger', icon: '🔥' },
  { value: 'improve-endurance', label: 'Improve Endurance', icon: '⚡' },
  { value: 'general-fitness', label: 'General Fitness', icon: '🌟' },
  { value: 'sport-specific', label: 'Sport Performance', icon: '🏆' },
];

export const EXPERIENCE_LEVELS: { value: ExperienceLevel; label: string; description: string }[] = [
  { value: 'beginner', label: 'Beginner', description: 'New to working out' },
  { value: 'intermediate', label: 'Intermediate', description: '6 months - 2 years experience' },
  { value: 'advanced', label: 'Advanced', description: '2+ years consistent training' },
  { value: 'expert', label: 'Expert', description: 'Competitive athlete/trainer' },
];

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
];