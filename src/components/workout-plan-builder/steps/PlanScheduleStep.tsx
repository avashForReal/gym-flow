import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Calendar } from 'lucide-react';
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
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold mb-2">Plan your weekly schedule</h2>
        <p className="text-muted-foreground text-sm">
          Customize each day and mark rest days
        </p>
      </div>

      <div className="space-y-3">
        {days.map((day) => (
          <Card key={day.dayIndex} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${day.isRestDay
                    ? 'bg-muted text-muted-foreground'
                    : 'bg-primary text-primary-foreground'
                  }`}>
                  {day.dayIndex + 1}
                </div>
                <div>
                  <p className="font-medium">{getDisplayName(day)}</p>
                  <p className="text-xs text-muted-foreground">
                    {day.isRestDay ? 'Rest Day' : `${day.exercises.length} exercises`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 text-muted-foreground mb-2" >
                    {
                      day.isRestDay ? (<>😴</>) : (<>🏋️</>)
                    }
                  </div>
                  <Switch
                    checked={day.isRestDay}
                    onCheckedChange={() => toggleRestDay(day.dayIndex)}
                    className='form-switch'
                  />
                </div>
              </div>
            </div>
            <Input
              placeholder="Add custom name (e.g., Push Day, Legs)..."
              value={day.customName ?? ''}
              disabled={day.isRestDay}
              onChange={(e) => updateDayName(day.dayIndex, e.target.value)}
              className="h-10 text-sm form-input"
              inputMode="text"
              autoComplete="off"
            />
          </Card>
        ))}
      </div>

      {errors.days && (
        <p className="text-sm text-destructive">{errors.days.message}</p>
      )}
    </div>
  );
}
