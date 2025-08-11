import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import type { PlanScheduleFormData, WorkoutDay } from '@/validations/workout-plan';
import { useCallback } from 'react';

interface PlanScheduleStepProps {
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function PlanScheduleStep({ }: PlanScheduleStepProps) {
  const { watch, setValue, formState: { errors } } = useFormContext<PlanScheduleFormData>();
  const days = watch('days') || [];

  const updateDayName = useCallback((dayIndex: number, customName: string) => {
    const updatedDays = [...days];
    updatedDays[dayIndex] = {
      ...updatedDays[dayIndex],
      customName: customName.trim() || undefined
    };
    setValue('days', updatedDays, { shouldValidate: true });
  }, [days, setValue]);

  const toggleRestDay = useCallback((dayIndex: number) => {
    const updatedDays = [...days];
    const currentDay = updatedDays[dayIndex];
    updatedDays[dayIndex] = {
      ...currentDay,
      isRestDay: !currentDay.isRestDay,
      exercises: !currentDay.isRestDay ? [] : currentDay.exercises,
      customName: currentDay.isRestDay ? '' : 'Rest Day'
    };
    setValue('days', updatedDays, { shouldValidate: true });
  }, [days, setValue]);

  const getDisplayName = (day: WorkoutDay) => {
    if (day.customName) {
      return `${day.name} [${day.customName}]`;
    }
    return day.name;
  };

  return (
    <div className="space-y-3 px-1">
      <div className="space-y-2">
        {days.map((day) => (
          <Card key={day.dayIndex} className="p-2">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${day.isRestDay
                  ? 'bg-muted text-muted-foreground'
                  : 'bg-primary text-primary-foreground'
                  }`}>
                  {day.dayIndex + 1}
                </div>
                <div>
                  <span className="font-medium text-sm">{getDisplayName(day)}</span>
                  <span className="block text-[0.7rem] text-muted-foreground">
                    {day.isRestDay ? 'Rest Day' : `${day.exercises.length} ex`}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-lg" aria-label={day.isRestDay ? "Rest" : "Workout"}>
                  {day.isRestDay ? "😴" : "🏋️"}
                </span>
                <Switch
                  checked={day.isRestDay}
                  onCheckedChange={() => toggleRestDay(day.dayIndex)}
                  className="form-switch scale-90"
                />
              </div>
            </div>
            <Input
              placeholder="Custom name (e.g. Push day)"
              value={day.customName ?? ''}
              disabled={day.isRestDay}
              onChange={(e) => updateDayName(day.dayIndex, e.target.value)}
              className="h-8 text-base form-input mt-1"
              inputMode="text"
              autoComplete="off"
            />
          </Card>
        ))}
      </div>

      {errors.days && (
        <p className="text-xs text-destructive">{errors.days.message}</p>
      )}
    </div>
  );
}
