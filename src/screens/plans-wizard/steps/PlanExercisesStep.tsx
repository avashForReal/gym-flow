import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Dumbbell, Plus } from 'lucide-react';
import type { PlanExercisesFormData, WorkoutDay } from '@/validations/workout-plan';
import type { Exercise } from '@/data/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ExerciseFilterDrawer from './ExerciseFilterDrawer';
import SinglExerciseCard from './SinglExerciseCard';
import { useExercisesByIds } from '@/hooks/useExercises';

interface PlanExercisesStepProps {
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function PlanExercisesStep({ }: PlanExercisesStepProps) {
  const { watch, setValue } = useFormContext<PlanExercisesFormData>();
  const days = watch('days') || [];

  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [exerciseDetails, setExerciseDetails] = useState<Record<string, Exercise>>({});

  const allExerciseIds = useMemo(() => {
    return days.flatMap(day => day.exercises.map(ex => ex.exerciseId));
  }, [days]);

  const { exercises, isLoadingExercises } = useExercisesByIds(allExerciseIds);

  useEffect(() => {
    setExerciseDetails(exercises.reduce((acc, exercise) => {
      acc[exercise.exerciseId] = exercise;
      return acc;
    }, {} as Record<string, Exercise>));
  }, [exercises, isLoadingExercises]);

  const addExerciseToDay = useCallback((dayIndex: number, exercise: Exercise) => {
    const updatedDays = [...days];
    const day = updatedDays[dayIndex];

    const exerciseExists = day.exercises.some(ex => ex.exerciseId === exercise.exerciseId);
    if (exerciseExists) return;

    updatedDays[dayIndex] = {
      ...day,
      exercises: [...day.exercises, exercise],
      isRestDay: false
    };

    setValue('days', updatedDays, { shouldValidate: true });
    setExerciseDetails(prev => ({
      ...prev,
      [exercise.exerciseId]: exercise
    }));
  }, [days, setValue]);

  const removeExerciseFromDay = useCallback((dayIndex: number, exerciseId: string) => {
    const updatedDays = [...days];
    const day = updatedDays[dayIndex];
    updatedDays[dayIndex] = {
      ...day,
      exercises: day.exercises.filter(ex => ex.exerciseId !== exerciseId),
      isRestDay: false
    };
    setValue('days', updatedDays, { shouldValidate: true });
  }, [days, setValue]);

  const getDisplayName = (day: WorkoutDay) => {
    if (day.customName) {
      return `${day.name} [${day.customName}]`;
    }
    return day.name;
  };

  const activeDays = days.filter(day => !day.isRestDay);

  return (
    <div className="flex flex-col h-full">
      {/* Day Selection - Mobile Optimized */}
      <div className="p-3 border-b border-border bg-muted/20">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {activeDays.map((day) => (
            <Button
              key={day.dayIndex}
              variant={selectedDayIndex === day.dayIndex ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDayIndex(day.dayIndex)}
              className="flex-shrink-0 h-14 px-4 min-w-[80px]"
            >
              <div className="text-center">
                <div className="text-sm font-semibold">{getDisplayName(day)}</div>
                <div className="text-xs opacity-75 mt-0.5">{day.exercises.length} exercises</div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {selectedDayIndex !== null && !days[selectedDayIndex].isRestDay && (
        <div className="flex-1 flex flex-col">
          {/* Current Day Exercises */}
          <div className="p-3 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">Current Exercises</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFilterDrawerOpen(true)}
                className="h-8 px-3 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Exercise
              </Button>
            </div>

            <div className='h-full overflow-y-auto mb-16'>
              {
                days[selectedDayIndex].exercises.length > 0 ? (
                  <div className="space-y-2">
                    {days[selectedDayIndex].exercises.map((exerciseRef) => {
                      const exercise = exerciseDetails[exerciseRef.exerciseId];
                      if (!exercise) return null;

                      return (
                        <SinglExerciseCard
                          key={exerciseRef.exerciseId}
                          exercise={exercise}
                          onAddToDay={() => addExerciseToDay(selectedDayIndex, exercise)}
                          onRemoveFromDay={() => removeExerciseFromDay(selectedDayIndex, exercise.exerciseId)}
                          isSelected={true}
                          isDayList={true}
                        />
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground text-sm mb-2">No exercises added yet</p>
                    <p className="text-xs text-muted-foreground">Tap "Add Exercise" to get started</p>
                  </div>
                )
              }
            </div>
          </div>
        </div>
      )}

      {selectedDayIndex === null && (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <Dumbbell className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground font-medium mb-2">Select a day</p>
            <p className="text-xs text-muted-foreground">Choose a day above to manage exercises for that day.</p>
          </div>
        </div>
      )}

      {isFilterDrawerOpen && (
        <ExerciseFilterDrawer
          setIsFilterDrawerOpen={setIsFilterDrawerOpen}
          selectedDay={days[selectedDayIndex!]}
          onAddExercise={(exercise) => addExerciseToDay(selectedDayIndex!, exercise)}
          onRemoveExercise={(exercise) => removeExerciseFromDay(selectedDayIndex!, exercise.exerciseId)}
        />
      )}
    </div>
  );
}
