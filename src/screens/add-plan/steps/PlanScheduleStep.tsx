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
    <div className="space-y-2 px-1">
      <div className="flex flex-col gap-6 ml-2">
        {days.map((day) => {
          const isRest = day.isRestDay;
          return (
            <Card
              key={day.dayIndex}
              className={`!gap-2 relative flex flex-row items-center px-3 py-2 rounded-lg shadow-sm border transition-colors min-w-0 w-full
                ${isRest
                  ? "bg-muted/80 border-dashed border-muted-foreground/30 opacity-80"
                  : "bg-background border-primary/30"
                }
              `}
            >
              <div className="absolute -left-4 -top-4 flex flex-col items-center justify-center mr-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1
                    ${isRest
                      ? "bg-muted text-muted-foreground border border-muted-foreground/30"
                      : "bg-primary text-primary-foreground border border-primary/60"
                    }
                  `}
                >
                  {day.dayIndex + 1}
                </div>
              </div>

              <div className="flex flex-col items-center justify-center mr-3">
                <span className="text-lg" aria-label={isRest ? "Rest" : "Workout"}>
                  {isRest ? "😴" : "🏋️"}
                </span>
              </div>

              {/* Main info */}
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <span className={`font-semibold text-sm truncate ${isRest ? "text-muted-foreground" : ""}`}>
                    {getDisplayName(day)}
                  </span>
                </div>
                <span className={`block italic font-semibold text-[0.7rem] ${isRest ? "text-muted-foreground/70" : "text-primary/70"}`}>
                  {isRest ? "Rest Day" : `${day.exercises.length} exercise${day.exercises.length === 1 ? "" : "s"}`}
                </span>
                <Input
                  placeholder="Custom name (e.g. Push day)"
                  value={day.customName ?? ''}
                  disabled={isRest}
                  onChange={(e) => updateDayName(day.dayIndex, e.target.value)}
                  className={`h-7 mt-1 px-2 py-1 rounded border max-w-xs
                    ${isRest
                      ? "bg-muted text-muted-foreground border-muted-foreground/20 opacity-70"
                      : "bg-background border-primary/20"
                    }
                  `}
                  inputMode="text"
                  autoComplete="off"
                  maxLength={24}
                />
              </div>

              <Switch
                checked={isRest}
                onCheckedChange={() => toggleRestDay(day.dayIndex)}
                className="form-switch scale-90"
              />
            </Card>
          );
        })}
      </div>

      {errors.days && (
        <p className="text-xs text-destructive mt-1">{errors.days.message}</p>
      )}
    </div>
  );
}
