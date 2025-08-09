import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dumbbell, Search, Plus, Calendar } from 'lucide-react';
import type { PlanExercisesFormData, WorkoutDay } from '@/validations/workout-plan';
import type { Exercise } from '@/data/types';
import { useCallback, useEffect, useState } from 'react';
import { exerciseService } from '@/lib/exercise-service';

interface PlanExercisesStepProps {
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function PlanExercisesStep({ }: PlanExercisesStepProps) {
  const { watch, setValue, formState: { errors } } = useFormContext<PlanExercisesFormData>();
  const days = watch('days') || [];

  // Exercise selection state
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [exerciseSearchQuery, setExerciseSearchQuery] = useState('');
  const [exerciseSearchResults, setExerciseSearchResults] = useState<Exercise[]>([]);
  const [bodyParts, setBodyParts] = useState<string[]>([]);
  const [selectedBodyPart, setSelectedBodyPart] = useState<string>('');
  const [isLoadingExercises, setIsLoadingExercises] = useState(false);

  // Initialize exercise service
  useEffect(() => {
    const initializeData = async () => {
      try {
        await exerciseService.initialize();
        const filterOptions = await exerciseService.getFilterOptions();
        setBodyParts(filterOptions.bodyParts);
      } catch (error) {
        console.error('Failed to initialize exercise service:', error);
      }
    };
    
    initializeData();
  }, []);

  // Search exercises
  useEffect(() => {
    const searchExercises = async () => {
      if (!exerciseSearchQuery.trim() && !selectedBodyPart) {
        setExerciseSearchResults([]);
        return;
      }

      setIsLoadingExercises(true);
      try {
        const results = await exerciseService.searchExercises(exerciseSearchQuery, {
          bodyPart: selectedBodyPart || undefined,
          limit: 15
        });
        setExerciseSearchResults(results);
      } catch (error) {
        console.error('Exercise search failed:', error);
        setExerciseSearchResults([]);
      } finally {
        setIsLoadingExercises(false);
      }
    };

    const debounceTimer = setTimeout(searchExercises, 300);
    return () => clearTimeout(debounceTimer);
  }, [exerciseSearchQuery, selectedBodyPart]);

  const addExerciseToDay = useCallback((dayIndex: number, exercise: Exercise) => {
    const updatedDays = [...days];
    const day = updatedDays[dayIndex];
    
    // Check if exercise already exists
    const exerciseExists = day.exercises.some(ex => ex.exerciseId === exercise.exerciseId);
    if (exerciseExists) return;
    
    updatedDays[dayIndex] = {
      ...day,
      exercises: [...day.exercises, exercise],
      isRestDay: false
    };
    
    setValue('days', updatedDays, { shouldValidate: true });
  }, [days, setValue]);

  // const removeExerciseFromDay = useCallback((dayIndex: number, exerciseId: string) => {
  //   const updatedDays = [...days];
  //   const day = updatedDays[dayIndex];
    
  //   updatedDays[dayIndex] = {
  //     ...day,
  //     exercises: day.exercises.filter(ex => ex.exerciseId !== exerciseId),
  //     isRestDay: day.exercises.length === 1 ? true : day.isRestDay
  //   };
    
  //   setValue('days', updatedDays, { shouldValidate: true });
  // }, [days, setValue]);

  const getDisplayName = (day: WorkoutDay) => {
    if (day.customName) {
      return `${day.name} [${day.customName}]`;
    }
    return day.name;
  };

  const activeDays = days.filter(day => !day.isRestDay);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="text-center mb-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Dumbbell className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold mb-2">Add exercises to your days</h2>
          <p className="text-muted-foreground text-sm">
            Select a day and add exercises from our database
          </p>
        </div>
      </div>

      {/* Day Selection */}
      <div className="p-4 border-b border-border">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {activeDays.map((day) => (
            <Button
              key={day.dayIndex}
              variant={selectedDayIndex === day.dayIndex ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDayIndex(day.dayIndex)}
              className="flex-shrink-0 h-12 px-4"
            >
              <div className="text-center">
                <div className="text-xs font-bold">{getDisplayName(day)}</div>
                <div className="text-xs opacity-75">{day.exercises.length} exercises</div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {selectedDayIndex !== null && !days[selectedDayIndex].isRestDay && (
        <div className="flex-1 flex flex-col">
          {/* Exercise Search */}
          <div className="p-4 border-b border-border space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search exercises..."
                value={exerciseSearchQuery}
                onChange={(e) => setExerciseSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2">
              <Button
                variant={selectedBodyPart === '' ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedBodyPart('')}
                className="flex-shrink-0"
              >
                All
              </Button>
              {bodyParts.slice(0, 8).map(part => (
                <Button
                  key={part}
                  variant={selectedBodyPart === part ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedBodyPart(part)}
                  className="flex-shrink-0 text-xs"
                >
                  {part}
                </Button>
              ))}
            </div>
          </div>

          {/* Current Day Exercises */}
          {/* {days[selectedDayIndex].exercises.length > 0 && (
            <div className="p-4 border-b border-border">
              <h3 className="font-medium mb-3">Added Exercises</h3>
              <div className="space-y-2">
                {days[selectedDayIndex].exercises.map((exercise) => (
                  <div key={exercise.exerciseId} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{exercise.name}</p>
                      <div className="flex gap-1 mt-1">
                        {exercise.bodyParts.slice(0, 2).map(part => (
                          <Badge key={part} variant="secondary" className="text-xs">
                            {part}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExerciseFromDay(selectedDayIndex, exercise.exerciseId)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )} */}

          {/* Exercise Results */}
          <div className="flex-1 overflow-y-auto p-4">
            {isLoadingExercises && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                <p className="text-sm text-muted-foreground">Searching exercises...</p>
              </div>
            )}

            {!isLoadingExercises && exerciseSearchResults.length > 0 && (
              <div className="space-y-3">
                {exerciseSearchResults.map((exercise) => (
                  <Card 
                    key={exercise.exerciseId}
                    className="p-4 cursor-pointer hover:border-primary/50 transition-all active:scale-95"
                    onClick={() => addExerciseToDay(selectedDayIndex, exercise)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-2">{exercise.name}</h4>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {exercise.bodyParts.slice(0, 2).map(part => (
                            <Badge key={part} variant="secondary" className="text-xs">
                              {part}
                            </Badge>
                          ))}
                          {exercise.bodyParts.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{exercise.bodyParts.length - 2}
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-1">
                          {exercise.equipments.slice(0, 2).map(eq => (
                            <Badge key={eq} variant="outline" className="text-xs">
                              {eq}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Plus className="h-5 w-5 text-muted-foreground ml-3" />
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {!isLoadingExercises && (exerciseSearchQuery || selectedBodyPart) && exerciseSearchResults.length === 0 && (
              <div className="text-center py-8">
                <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No exercises found</p>
                <p className="text-xs text-muted-foreground mt-1">Try a different search or filter</p>
              </div>
            )}

            {!exerciseSearchQuery && !selectedBodyPart && (
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Search for exercises to add</p>
                <p className="text-xs text-muted-foreground mt-1">Use the search bar or filter by body part</p>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedDayIndex === null && (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Select a day to add exercises</p>
            <p className="text-xs text-muted-foreground mt-1">Choose from your active training days above</p>
          </div>
        </div>
      )}

      {errors.days && (
        <div className="p-4 border-t border-border">
          <p className="text-sm text-destructive">{errors.days.message}</p>
        </div>
      )}
    </div>
  );
}
