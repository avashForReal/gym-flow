import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { GENDER_OPTIONS } from '@/types/user';
import type { PersonalInfoFormData } from '@/validations/onboarding';
import { useMemo, useCallback } from 'react';
import { scrollInputIntoView } from '@/lib/input-helper';

interface PersonalInfoStepProps {
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function PersonalInfoStep({ }: PersonalInfoStepProps) {
  const { register, watch, setValue, formState: { errors }, clearErrors, trigger } = useFormContext<PersonalInfoFormData>();
  const watchedValues = watch();
  const isMetric = useMemo(() => watchedValues.preferredUnits === 'metric', [watchedValues.preferredUnits]);

  const handleUnitToggle = useCallback((units: 'metric' | 'imperial') => {
    clearErrors(['heightCm', 'heightFeet', 'heightInches']);
    setValue('preferredUnits', units, { shouldValidate: false });
    setValue('weight', '', { shouldValidate: false });
    if (units === 'metric') {
      setValue('heightFeet', null, { shouldValidate: false });
      setValue('heightInches', null, { shouldValidate: false });
      trigger(['heightCm', 'weight'], {
        shouldFocus: true,
      });
    } else {
      setValue('heightCm', '', { shouldValidate: false });
      trigger(['heightFeet', 'heightInches', 'weight'], {
        shouldFocus: true,
      });
    }
  }, [setValue, clearErrors]);

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className='font-semibold'>What should we call you?</Label>
          <Input
            id="name"
            placeholder="Enter your name"
            {...register('name')}
            className="form-input"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        {/* Units preference */}
        <div className="space-y-2">
          <Label className='font-semibold text-sm'>Preferred measurement system?</Label>
          <div className="grid grid-cols-2 gap-2">
            <Card
              className={`p-3 cursor-pointer transition-all ${isMetric ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                }`}
              onClick={() => handleUnitToggle('metric')}
            >
              <div className="text-center">
                <div className="font-semibold text-sm">Metric</div>
                <div className="text-xs text-muted-foreground">kg, cm</div>
              </div>
            </Card>
            <Card
              className={`p-3 cursor-pointer transition-all ${!isMetric ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                }`}
              onClick={() => handleUnitToggle('imperial')}
            >
              <div className="text-center">
                <div className="font-semibold text-sm">Imperial</div>
                <div className="text-xs text-muted-foreground">lbs, ft/in</div>
              </div>
            </Card>
          </div>
        </div>

        {/* Physical stats */}
        <div className="grid grid-cols-2 gap-3">
          {/* Height Section */}
          <div className="space-y-2">
            <Label htmlFor="height" className='font-semibold text-sm'>
              Height {isMetric ? '(cm)' : ''}
            </Label>
            {isMetric ? (
              <div className="space-y-1">
                <Input
                  id="height"
                  type="number"
                  placeholder="Height in cm"
                  {...register('heightCm')}
                  className="form-input"
                  inputMode="numeric"
                  onFocus={scrollInputIntoView}
                />
                {/* Reserve space for error message to prevent layout shift */}
                <div className="min-h-[1.25rem]">
                  {errors.heightCm && (
                    <p className="text-sm text-destructive">{errors.heightCm.message}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="heightFeet" className="text-sm text-muted-foreground">Feet</Label>
                  <Input
                    id="heightFeet"
                    inputMode="numeric"
                    type="number"
                    placeholder="Height in feet"
                    min="3"
                    max="8"
                    {...register('heightFeet')}
                    className="form-input"
                    onFocus={scrollInputIntoView}
                  />
                  {/* Reserve space for error message */}
                  <div className="min-h-[1rem]">
                    {errors.heightFeet && (
                      <p className="text-xs text-destructive">{errors.heightFeet.message}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="heightInches" className="text-sm text-muted-foreground">Inches</Label>
                  <Input
                    id="heightInches"
                    inputMode="numeric"
                    type="number"
                    placeholder="Height in inches"
                    min="0"
                    max="11"
                    {...register('heightInches')}
                    className="form-input"
                    onFocus={scrollInputIntoView}
                  />
                  {/* Reserve space for error message */}
                  <div className="min-h-[1rem]">
                    {errors.heightInches && (
                      <p className="text-xs text-destructive">{errors.heightInches.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Weight Section */}
          <div className="space-y-2">
            <Label htmlFor="weight" className='font-semibold text-sm'>
              Weight ({isMetric ? 'kg' : 'lbs'})
            </Label>
            {isMetric ? (
              <div className="space-y-1">
                <Input
                  id="weight"
                  type="number"
                  placeholder="Weight in kg"
                  {...register('weight')}
                  className="form-input"
                  inputMode="numeric"
                  onFocus={scrollInputIntoView}
                />
                {/* Reserve space for error message to match metric height */}
                <div className="min-h-[1.25rem]">
                  {errors.weight && (
                    <p className="text-sm text-destructive">{errors.weight.message}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                {/* Add invisible label to match height section structure */}
                <div className="text-sm text-transparent select-none">Weight</div>
                <Input
                  id="weight"
                  type="number"
                  placeholder="Weight in lbs"
                  {...register('weight')}
                  className="form-input"
                  inputMode="numeric"
                  onFocus={scrollInputIntoView}
                />
                {/* Reserve space for error message to match imperial height total */}
                <div className="min-h-[1rem]">
                  {errors.weight && (
                    <p className="text-xs text-destructive">{errors.weight.message}</p>
                  )}
                </div>
                {/* Add second invisible error space to match height section */}
                <div className="min-h-[1rem]"></div>
              </div>
            )}
          </div>
        </div>

        {/* Age and Gender */}
        <div className="grid grid-cols-2 gap-3">
          {/* Age */}
          <div className="space-y-2">
            <Label className='font-semibold text-sm'>Age</Label>
            <Input
              id="age"
              type="number"
              placeholder="Enter your age"
              {...register('age')}
              className="form-input"
              min={1}
              step={1}
              onKeyDown={(e) => {
                if (e.key === '.' || e.key === '-' || e.key === 'e' || e.key === 'E') {
                  e.preventDefault();
                }
              }}
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                target.value = target.value.replace(/[^0-9]/g, '');
              }}
              inputMode="numeric"
              onFocus={scrollInputIntoView}
            />
            {errors.age && (
              <p className="text-sm text-destructive">{errors.age.message}</p>
            )}
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label className='font-semibold text-sm'>Gender</Label>
            <Select
              value={watchedValues.gender || ''}
              onValueChange={(value) => setValue('gender', value as any)}
            >
              <SelectTrigger className="form-input w-full">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                {GENDER_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className="text-sm text-destructive">{errors.gender.message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}