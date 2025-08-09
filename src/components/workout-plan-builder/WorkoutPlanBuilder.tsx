import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Calendar, Dumbbell, Search, X } from 'lucide-react';
import { exerciseService } from '@/lib/exercise-service';
import type { Exercise as ExerciseData } from '@/data/types';

interface WorkoutDay {
  dayIndex: number;
  name: string;
  customName?: string;
  isRestDay: boolean;
  exercises: ExerciseData[];
}

interface WorkoutPlanBuilderProps {
  onSave?: (plan: {
    name: string;
    description: string;
    days: WorkoutDay[];
  }) => void;
  onCancel?: () => void;
  initialPlan?: {
    name: string;
    description: string;
    days: WorkoutDay[];
  };
}

const defaultDayNames = [
  'Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'
];

export function WorkoutPlanBuilder({ onSave, onCancel, initialPlan }: WorkoutPlanBuilderProps) {
  const [planName, setPlanName] = useState(initialPlan?.name || '');
  const [planDescription, setPlanDescription] = useState(initialPlan?.description || '');
  const [days, setDays] = useState<WorkoutDay[]>(() => 
    initialPlan?.days || Array.from({ length: 7 }, (_, index) => ({
      dayIndex: index,
      name: defaultDayNames[index],
      isRestDay: false,
      exercises: []
    }))
  );
  
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [exerciseSearchQuery, setExerciseSearchQuery] = useState('');
  const [exerciseSearchResults, setExerciseSearchResults] = useState<ExerciseData[]>([]);
  const [bodyParts, setBodyParts] = useState<string[]>([]);
  const [selectedBodyPart, setSelectedBodyPart] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize exercise service and load body parts
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

  // Search exercises when query or body part changes
  useEffect(() => {
    const searchExercises = async () => {
      if (!exerciseSearchQuery.trim() && !selectedBodyPart) {
        setExerciseSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await exerciseService.searchExercises(exerciseSearchQuery, {
          bodyPart: selectedBodyPart || undefined,
          limit: 20
        });
        setExerciseSearchResults(results);
      } catch (error) {
        console.error('Exercise search failed:', error);
        setExerciseSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchExercises, 300);
    return () => clearTimeout(debounceTimer);
  }, [exerciseSearchQuery, selectedBodyPart]);

  const updateDayName = (dayIndex: number, customName: string) => {
    setDays(prev => prev.map(day => 
      day.dayIndex === dayIndex 
        ? { ...day, customName: customName.trim() || undefined }
        : day
    ));
  };

  const toggleRestDay = (dayIndex: number) => {
    setDays(prev => prev.map(day => 
      day.dayIndex === dayIndex 
        ? { ...day, isRestDay: !day.isRestDay, exercises: day.isRestDay ? day.exercises : [] }
        : day
    ));
  };

  const addExerciseToDay = (dayIndex: number, exercise: ExerciseData) => {
    setDays(prev => prev.map(day => {
      if (day.dayIndex === dayIndex) {
        // Check if exercise already exists
        const exerciseExists = day.exercises.some(ex => ex.exerciseId === exercise.exerciseId);
        if (exerciseExists) return day;
        
        return {
          ...day,
          exercises: [...day.exercises, exercise],
          isRestDay: false // Adding exercise automatically makes it not a rest day
        };
      }
      return day;
    }));
  };

  const removeExerciseFromDay = (dayIndex: number, exerciseId: string) => {
    setDays(prev => prev.map(day => {
      if (day.dayIndex === dayIndex) {
        const updatedExercises = day.exercises.filter(ex => ex.exerciseId !== exerciseId);
        return {
          ...day,
          exercises: updatedExercises,
          isRestDay: updatedExercises.length === 0 ? true : day.isRestDay // Auto rest day if no exercises
        };
      }
      return day;
    }));
  };

  const getDisplayName = (day: WorkoutDay) => {
    if (day.customName) {
      return `${day.name} [${day.customName}]`;
    }
    return day.name;
  };

  const handleSave = () => {
    if (!planName.trim()) {
      alert('Please enter a workout plan name');
      return;
    }

    onSave?.({
      name: planName.trim(),
      description: planDescription.trim(),
      days
    });
  };

  const isFormValid = planName.trim().length > 0;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Plan Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Workout Plan Details
          </CardTitle>
          <CardDescription>
            Create a comprehensive 7-day workout plan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="planName">Plan Name *</Label>
            <Input
              id="planName"
              placeholder="e.g., Push Pull Legs, Full Body Beginner..."
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="planDescription">Description (Optional)</Label>
            <Textarea
              id="planDescription"
              placeholder="Describe your workout plan goals, target audience, or any special notes..."
              value={planDescription}
              onChange={(e) => setPlanDescription(e.target.value)}
              className="form-input min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* 7-Day Layout */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5" />
            Weekly Schedule
          </CardTitle>
          <CardDescription>
            Configure each day of your workout plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {days.map((day) => (
              <Card 
                key={day.dayIndex}
                className={`cursor-pointer transition-all ${
                  selectedDay === day.dayIndex 
                    ? 'border-primary bg-primary/5' 
                    : day.isRestDay 
                      ? 'border-muted bg-muted/20' 
                      : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedDay(selectedDay === day.dayIndex ? null : day.dayIndex)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold">
                      {getDisplayName(day)}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={day.isRestDay}
                        onCheckedChange={() => toggleRestDay(day.dayIndex)}
                        className="scale-75"
                      />
                      <span className="text-xs text-muted-foreground">Rest</span>
                    </div>
                  </div>
                  
                  {/* Custom Name Input */}
                  <Input
                    placeholder="Add custom name..."
                    value={day.customName || ''}
                    onChange={(e) => updateDayName(day.dayIndex, e.target.value)}
                    className="text-xs h-7"
                    onClick={(e) => e.stopPropagation()}
                  />
                </CardHeader>
                
                <CardContent className="pt-0">
                  {day.isRestDay ? (
                    <div className="text-center py-4">
                      <div className="text-2xl mb-2">😴</div>
                      <p className="text-xs text-muted-foreground">Rest Day</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">
                          {day.exercises.length} exercise{day.exercises.length !== 1 ? 's' : ''}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDay(day.dayIndex);
                          }}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      {day.exercises.slice(0, 3).map((exercise) => (
                        <div key={exercise.exerciseId} className="flex items-center justify-between">
                          <span className="text-xs truncate flex-1">{exercise.name}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-4 w-4 p-0 text-destructive hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeExerciseFromDay(day.dayIndex, exercise.exerciseId);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      
                      {day.exercises.length > 3 && (
                        <p className="text-xs text-muted-foreground text-center">
                          +{day.exercises.length - 3} more
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Exercise Selection Panel */}
      {selectedDay !== null && !days[selectedDay].isRestDay && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Add Exercises to {getDisplayName(days[selectedDay])}
            </CardTitle>
            <CardDescription>
              Search for exercises by name or filter by body part
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search and Filter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Search Exercises</Label>
                <Input
                  placeholder="Search by exercise name..."
                  value={exerciseSearchQuery}
                  onChange={(e) => setExerciseSearchQuery(e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="space-y-2">
                <Label>Filter by Body Part</Label>
                <select
                  value={selectedBodyPart}
                  onChange={(e) => setSelectedBodyPart(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md form-input"
                >
                  <option value="">All Body Parts</option>
                  {bodyParts.map(part => (
                    <option key={part} value={part}>{part}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Exercise Results */}
            {isLoading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-sm text-muted-foreground mt-2">Searching exercises...</p>
              </div>
            )}

            {!isLoading && exerciseSearchResults.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {exerciseSearchResults.map((exercise) => (
                  <Card 
                    key={exercise.exerciseId}
                    className="cursor-pointer hover:border-primary/50 transition-all"
                    onClick={() => addExerciseToDay(selectedDay, exercise)}
                  >
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">{exercise.name}</h4>
                        <div className="flex flex-wrap gap-1">
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
                        <div className="flex flex-wrap gap-1">
                          {exercise.equipments.slice(0, 2).map(eq => (
                            <Badge key={eq} variant="outline" className="text-xs">
                              {eq}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!isLoading && (exerciseSearchQuery || selectedBodyPart) && exerciseSearchResults.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No exercises found matching your criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button 
          onClick={handleSave}
          disabled={!isFormValid}
          className="bg-primary text-primary-foreground"
        >
          Save Workout Plan
        </Button>
      </div>
    </div>
  );
}
