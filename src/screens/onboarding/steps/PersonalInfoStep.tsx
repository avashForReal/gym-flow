import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { GENDER_OPTIONS } from '@/types/user';
import type { PersonalInfoFormData } from '@/validations/onboarding';

interface PersonalInfoStepProps {
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function PersonalInfoStep({}: PersonalInfoStepProps) {
  const { register, watch, setValue, formState: { errors } } = useFormContext<PersonalInfoFormData>();
  const watchedValues = watch();
  const isMetric = watchedValues.preferredUnits === 'metric';

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-4">👤</div>
        <p className="text-muted-foreground">
          Help us personalize your experience with some basic information.
        </p>
      </div>

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
          <Label className='font-semibold'>Preferred measurement system?</Label>
          <div className="grid grid-cols-2 gap-2">
            <Card
              className={`p-4 cursor-pointer transition-all ${
                isMetric ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setValue('preferredUnits', 'metric')}
            >
              <div className="text-center">
                <div className="font-semibold">Metric</div>
                <div className="text-sm text-muted-foreground">kg, cm</div>
              </div>
            </Card>
            <Card
              className={`p-4 cursor-pointer transition-all ${
                !isMetric ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setValue('preferredUnits', 'imperial')}
            >
              <div className="text-center">
                <div className="font-semibold">Imperial</div>
                <div className="text-sm text-muted-foreground">lbs, ft/in</div>
              </div>
            </Card>
          </div>
        </div>

        {/* Physical stats */}
        <div className="grid grid-cols-2 gap-4">
          {/* Height Section */}
          <div className="space-y-2">
            <Label htmlFor="height" className='font-semibold'>
              Height {isMetric ? '(cm)' : ''}
            </Label>
            {isMetric ? (
              <div>
                <Input
                  id="height"
                  type="number"
                  placeholder="175"
                  {...register('heightCm')}
                  className="form-input"
                />
                {errors.heightCm && (
                  <p className="text-sm text-destructive mt-1">{errors.heightCm.message}</p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="heightFeet" className="text-sm text-muted-foreground">Feet</Label>
                  <Input
                    id="heightFeet"
                    type="number"
                    placeholder="5"
                    min="3"
                    max="8"
                    {...register('heightFeet')}
                    className="form-input"
                  />
                  {errors.heightFeet && (
                    <p className="text-xs text-destructive mt-1">{errors.heightFeet.message}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="heightInches" className="text-sm text-muted-foreground">Inches</Label>
                  <Input
                    id="heightInches"
                    type="number"
                    placeholder="10"
                    min="0"
                    max="11"
                    {...register('heightInches')}
                    className="form-input"
                  />
                  {errors.heightInches && (
                    <p className="text-xs text-destructive mt-1">{errors.heightInches.message}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Weight Section */}
          <div className="space-y-2 flex flex-col">
            <Label htmlFor="weight" className='font-semibold'>
              Weight ({isMetric ? 'kg' : 'lbs'})
            </Label>
            <div className="flex-1 flex items-end">
              <Input
                id="weight"
                type="number"
                placeholder={isMetric ? '70' : '155'}
                {...register('weight')}
                className="form-input"
              />
            </div>
            {errors.weight && (
              <p className="text-sm text-destructive">{errors.weight.message}</p>
            )}
          </div>
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Label className='font-semibold'>Gender</Label>
          <Select 
            value={watchedValues.gender || ''} 
            onValueChange={(value) => setValue('gender', value as any)}
          >
            <SelectTrigger className="form-input">
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
  );
}