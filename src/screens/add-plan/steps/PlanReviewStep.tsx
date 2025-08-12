import { useFormContext } from 'react-hook-form';
import { Moon, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
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
    <div className="space-y-4 px-4 py-2">
      {/* Compact Plan Header */}
      <div className="text-center space-y-2 mb-4">
        <h2 className="text-xl font-bold text-gray-900">{name}</h2>
        {description && (
          <p className="text-gray-600 text-sm">{description}</p>
        )}
      </div>

      {/* Compact Stats Row */}
      <div className="flex justify-center gap-6 mb-4">
        <div className="text-center">
          <p className="text-lg font-bold text-blue-600">{getActiveDaysCount()}</p>
          <p className="text-xs text-gray-500">Active Days</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-green-600">{getTotalExercisesCount()}</p>
          <p className="text-xs text-gray-500">Exercises</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-purple-600">{7 - getActiveDaysCount()}</p>
          <p className="text-xs text-gray-500">Rest Days</p>
        </div>
      </div>

      {/* Compact Weekly Schedule */}
      <div className="space-y-3">
        {days.map((day) => (
          <Card
            key={day.dayIndex}
            className={`overflow-hidden transition-all duration-200 px-2 py-1 rounded-lg ${
              day.isRestDay
                ? 'border border-gray-200 bg-gray-50/60'
                : 'border border-blue-200 bg-blue-50/40 hover:bg-blue-50/60'
            }`}
          >
            <div className="flex items-center gap-2 min-h-8">
              {/* Day Number Badge */}
              <div
                className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  day.isRestDay
                    ? 'bg-gray-100 text-gray-600 border border-gray-200'
                    : 'bg-blue-500 text-white'
                }`}
              >
                {day.dayIndex + 1}
              </div>

              {/* Day Content */}
              <div className="flex-1 min-w-0 flex items-center justify-between">
                <h4 className="font-semibold text-gray-900 text-xs truncate">{getDisplayName(day)}</h4>
                <div className="flex items-center gap-2">
                  {day.isRestDay ? (
                    <>
                      <Moon className="h-3 w-3 text-gray-500" />
                      <span className="text-[10px] text-gray-500 ml-1 hidden xs:inline">Rest</span>
                    </>
                  ) : (
                    <>
                      <Zap className="h-3 w-3 text-blue-500" />
                      <span className="text-[10px] text-blue-600 font-medium ml-1">
                        {day.exercises.length} exercises
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}