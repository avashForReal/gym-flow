import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dumbbell, Search, Plus } from 'lucide-react';
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
          {/* Exercise Search - Mobile Optimized */}
          <div className="p-3 border-b border-border space-y-3 bg-background">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search exercises..."
                value={exerciseSearchQuery}
                onChange={(e) => setExerciseSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base border-2 focus:border-primary"
              />
            </div>
            
            {/* Body Part Filters - Mobile Optimized */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <Button
                variant={selectedBodyPart === '' ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedBodyPart('')}
                className="flex-shrink-0 h-10 px-3 text-sm font-medium"
              >
                All
              </Button>
              {bodyParts.slice(0, 8).map(part => (
                <Button
                  key={part}
                  variant={selectedBodyPart === part ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedBodyPart(part)}
                  className="flex-shrink-0 h-10 px-3 text-sm font-medium whitespace-nowrap"
                >
                  {part}
                </Button>
              ))}
            </div>
          </div>

          {/* Exercise Results - Mobile Optimized */}
          <div className="flex-1 overflow-y-auto p-3">
            {isLoadingExercises && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Searching exercises...</p>
              </div>
            )}

            {!isLoadingExercises && exerciseSearchResults.length > 0 && (
              <div className="space-y-2">
                {exerciseSearchResults.map((exercise) => (
                  <Card 
                    key={exercise.exerciseId} 
                    className="p-3 hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-primary/30"
                    onClick={() => addExerciseToDay(selectedDayIndex, exercise)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm mb-1 line-clamp-2">{exercise.name}</h3>
                        <div className="flex flex-wrap gap-1">
                          {exercise.bodyParts.slice(0, 3).map(part => (
                            <Badge key={part} variant="secondary" className="text-xs px-2 py-1">
                              {part}
                            </Badge>
                          ))}
                          {exercise.bodyParts.length > 3 && (
                            <Badge variant="outline" className="text-xs px-2 py-1">
                              +{exercise.bodyParts.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          addExerciseToDay(selectedDayIndex, exercise);
                        }}
                        className="h-8 w-8 p-0 text-primary hover:text-primary hover:bg-primary/10 ml-2 flex-shrink-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {!isLoadingExercises && (exerciseSearchQuery || selectedBodyPart) && exerciseSearchResults.length === 0 && (
              <div className="text-center py-12">
                <Dumbbell className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground font-medium mb-2">No exercises found</p>
                <p className="text-xs text-muted-foreground">Try a different search term or filter.</p>
              </div>
            )}

            {!isLoadingExercises && !exerciseSearchQuery && !selectedBodyPart && (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground font-medium mb-2">Search for exercises</p>
                <p className="text-xs text-muted-foreground">Type to search or use filters above.</p>
              </div>
            )}
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
    </div>
  );
}
