import { useFormContext } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { EXPERIENCE_LEVELS } from '@/types/user';
import type { OnboardingFormData } from '@/validations/onboarding';

interface ExperienceStepProps {
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function ExperienceStep({}: ExperienceStepProps) {
  const { watch, setValue, formState: { errors } } = useFormContext<OnboardingFormData>();
  const watchedValues = watch();
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-4">💪</div>
        <p className="text-muted-foreground">
          What's your experience level with fitness and working out?
        </p>
      </div>

      <div className="space-y-3">
        <Label>Experience Level</Label>
        <div className="space-y-3">
          {EXPERIENCE_LEVELS.map((level) => (
            <Card
              key={level.value}
              className={`p-6 cursor-pointer transition-all ${
                watchedValues.experienceLevel === level.value
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setValue('experienceLevel', level.value)}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  watchedValues.experienceLevel === level.value
                    ? 'border-primary bg-primary'
                    : 'border-muted'
                }`}>
                  {watchedValues.experienceLevel === level.value && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{level.label}</h3>
                  <p className="text-sm text-muted-foreground">{level.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
        {errors.experienceLevel && (
          <p className="text-sm text-destructive">{errors.experienceLevel.message}</p>
        )}
      </div>
    </div>
  );
}