import { useFormContext } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Moon, Zap } from 'lucide-react';
import type { PlanReviewFormData, WorkoutDay } from '@/validations/workout-plan';

interface PlanReviewStepProps {
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function PlanReviewStep({ }: PlanReviewStepProps) {
  const { watch } = useFormContext<PlanReviewFormData>();
  const { name, description, days } = watch();

  const getDisplayName = (day: WorkoutDay) => {
    if (day.customName) {
      return `${day.name} [${day.customName}]`;
    }
    return day.name;
  };

  const getActiveDaysCount = () => days.filter(day => !day.isRestDay).length;
  const getTotalExercisesCount = () => days.reduce((total, day) => total + day.exercises.length, 0);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-xl font-bold mb-2">Review your plan</h2>
        <p className="text-muted-foreground text-sm">
          Everything looks good? Let's save your workout plan!
        </p>
      </div>

      <Card className="p-4">
        <h3 className="font-bold text-lg mb-1">{name}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
        )}
        
        <div className="grid grid-cols-3 gap-4 text-center mb-4">
          <div>
            <p className="text-2xl font-bold text-primary">{getActiveDaysCount()}</p>
            <p className="text-xs text-muted-foreground">Active Days</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">{getTotalExercisesCount()}</p>
            <p className="text-xs text-muted-foreground">Exercises</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">{7 - getActiveDaysCount()}</p>
            <p className="text-xs text-muted-foreground">Rest Days</p>
          </div>
        </div>

        <div className="space-y-3">
          {days.map((day) => (
            <div key={day.dayIndex} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  day.isRestDay 
                    ? 'bg-muted text-muted-foreground' 
                    : 'bg-primary text-primary-foreground'
                }`}>
                  {day.dayIndex + 1}
                </div>
                <div>
                  <p className="font-medium text-sm">{getDisplayName(day)}</p>
                  <p className="text-xs text-muted-foreground">
                    {day.isRestDay ? 'Rest Day' : `${day.exercises.length} exercises`}
                  </p>
                </div>
              </div>
              {day.isRestDay ? (
                <Moon className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Zap className="h-4 w-4 text-primary" />
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
