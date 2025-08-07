import { useFormContext } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PRIMARY_GOALS, ACTIVITY_LEVELS } from '@/types/user';
import type { OnboardingFormData } from '@/validations/onboarding';

interface GoalsStepProps {
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function GoalsStep({}: GoalsStepProps) {
  const { register, watch, setValue, formState: { errors } } = useFormContext<OnboardingFormData>();
  const watchedValues = watch();
  const isMetric = watchedValues.preferredUnits === 'metric';
  // Target weight is now required for all goals

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-4">🎯</div>
        <p className="text-muted-foreground">
          What's your primary fitness goal? This helps us tailor your experience.
        </p>
      </div>

      <div className="space-y-6">
        {/* Primary Goal */}
        <div className="space-y-3">
          <Label className='font-semibold'>Primary Goal</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {PRIMARY_GOALS.map((goal) => (
              <Card
                key={goal.value}
                className={`p-4 cursor-pointer transition-all ${watchedValues.primaryGoal === goal.value
                  ? 'border-primary bg-primary/5'
                  : 'border-border'
                  }`}
                onClick={() => setValue('primaryGoal', goal.value)}
              >
                <div className="text-center space-y-2">
                  <div className="text-2xl">{goal.icon}</div>
                  <div className="font-semibold text-sm">{goal.label}</div>
                </div>
              </Card>
            ))}
          </div>
          {errors.primaryGoal && (
            <p className="text-sm text-destructive">{errors.primaryGoal.message}</p>
          )}
        </div>

        {/* Target Weight (required) */}
        <div className="space-y-2">
          <Label htmlFor="targetWeight" className='font-semibold'>
            Target Weight ({isMetric ? 'kg' : 'lbs'})
          </Label>
          <Input
            id="targetWeight"
            type="number"
            placeholder={`e.g. ${isMetric ? '65' : '145'}`}
            {...register('targetWeight')}
            className="form-input"
          />
          {errors.targetWeight && (
            <p className="text-sm text-destructive">{errors.targetWeight.message}</p>
          )}
        </div>

        {/* Activity Level */}
        <div className="space-y-3">
          <Label className='font-semibold'>Current Activity Level</Label>
          <Select
            value={watchedValues.activityLevel || ''}
            onValueChange={(value) => setValue('activityLevel', value as any)}
          >
            <SelectTrigger className="form-input h-[52px]!">
              <SelectValue placeholder="Select your activity level" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {ACTIVITY_LEVELS.map((level) => (
                <SelectItem key={level.value} value={level.value} className="py-4 h-[60px] flex items-center">
                  <div className="space-y-1 w-full">
                    <div className="font-medium text-sm">{level.label}</div>
                    <div className="text-xs text-muted-foreground leading-tight">{level.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.activityLevel && (
            <p className="text-sm text-destructive">{errors.activityLevel.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}