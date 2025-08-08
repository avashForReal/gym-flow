import { useFormContext } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { PRIMARY_GOALS, ACTIVITY_LEVELS, EXPERIENCE_LEVELS, GENDER_OPTIONS } from '@/types/user';
import type { OnboardingFormData } from '@/validations/onboarding';

interface ReviewStepProps {
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function ReviewStep({}: ReviewStepProps) {
  const { watch } = useFormContext<OnboardingFormData>();
  const formData = watch();
  const isMetric = formData.preferredUnits === 'metric';
  
  const getGoalLabel = (value: string | null) => 
    PRIMARY_GOALS.find(g => g.value === value)?.label || 'Not specified';
  
  const getActivityLabel = (value: string | null) => 
    ACTIVITY_LEVELS.find(a => a.value === value)?.label || 'Not specified';
  
  const getExperienceLabel = (value: string | null) => 
    EXPERIENCE_LEVELS.find(e => e.value === value)?.label || 'Not specified';
  
  const getGenderLabel = (value: string | null) => 
    GENDER_OPTIONS.find(g => g.value === value)?.label || 'Not specified';

  const getGoalIcon = (value: string | null) => {
    switch(value) {
      case 'lose-weight': return '🏃‍♂️';
      case 'gain-muscle': return '💪';
      case 'get-stronger': return '🏋️‍♂️';
      case 'improve-endurance': return '🚴‍♂️';
      case 'general-fitness': return '🎯';
      case 'sport-specific': return '⚽';
      default: return '🎯';
    }
  };

  const getActivityIcon = (value: string | null) => {
    switch(value) {
      case 'sedentary': return '🪑';
      case 'lightly-active': return '🚶‍♂️';
      case 'moderately-active': return '🏃‍♂️';
      case 'very-active': return '🏃‍♂️💨';
      case 'extremely-active': return '🔥';
      default: return '🚶‍♂️';
    }
  };

  const getExperienceIcon = (value: string | null) => {
    switch(value) {
      case 'beginner': return '🌱';
      case 'intermediate': return '🌿';
      case 'advanced': return '🌳';
      case 'expert': return '🏆';
      default: return '🌱';
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-3xl mb-3">✨</div>
        <p className="text-sm font-medium text-muted-foreground/80">
          Review your information before we create your profile.
        </p>
      </div>

      <Card className="glass p-4 border border-border/50">
        <div className="space-y-3">
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium">📝 Name</span>
              <span className="font-bold text-foreground truncate ml-2">{formData.name || 'Not set'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium">🎂 Age</span>
              <span className="font-bold text-foreground">{formData.age ? `${formData.age} years` : 'Not set'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium">📏 Height</span>
              <span className="font-bold text-foreground">
                {isMetric 
                  ? (formData.heightCm ? `${formData.heightCm}cm` : 'Not set')
                  : (formData.heightFeet && formData.heightInches 
                      ? `${formData.heightFeet}'${formData.heightInches}"` 
                      : 'Not set'
                    )
                }
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium">⚖️ Weight</span>
              <span className="font-bold text-foreground">
                {formData.weight ? `${formData.weight}${isMetric ? 'kg' : 'lbs'}` : 'Not set'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-medium">{formData.gender === 'male' ? '👨' : formData.gender === 'female' ? '👩' : '👤'} Gender</span>
              <span className="font-bold text-foreground">{getGenderLabel(formData.gender)}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border/40 my-3"></div>

          {/* Goals - Compact Grid */}
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex items-center justify-between py-1">
              <span className="text-muted-foreground font-semibold">{getGoalIcon(formData.primaryGoal)} Goal</span>
              <span className="font-bold text-primary">{getGoalLabel(formData.primaryGoal)}</span>
            </div>
            {formData.targetWeight && (
              <div className="flex items-center justify-between py-1">
                <span className="text-muted-foreground font-semibold">🎯 Target</span>
                <span className="font-bold text-accent">{formData.targetWeight} {isMetric ? 'kg' : 'lbs'}</span>
              </div>
            )}
            <div className="flex items-center justify-between py-1">
              <span className="text-muted-foreground font-semibold">{getActivityIcon(formData.activityLevel)} Activity</span>
              <span className="font-bold text-foreground">{getActivityLabel(formData.activityLevel)}</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-muted-foreground font-semibold">{getExperienceIcon(formData.experienceLevel)} Level</span>
              <span className="font-bold text-foreground">{getExperienceLabel(formData.experienceLevel)}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Compact Ready Section */}
      <div className="bg-gradient-to-r from-primary/15 to-accent/15 border-2 border-primary/30 rounded-xl p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-xl flex-shrink-0 shadow-lg">
            🚀
          </div>
          <div>
            <h4 className="font-black text-lg gradient-text tracking-tight">LET'S GO!</h4>
            <p className="text-xs font-semibold text-muted-foreground/90">
              Your data is stored locally on your device. We do not collect any data from you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}