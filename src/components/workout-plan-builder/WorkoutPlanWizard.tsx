import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Calendar, 
  Dumbbell, 
  Search, 
  X,
  Plus,
  Moon,
  Zap
} from 'lucide-react';
import { exerciseService } from '@/lib/exercise-service';
import type { Exercise as ExerciseData } from '@/data/types';

interface WorkoutDay {
  dayIndex: number;
  name: string;
  customName?: string;
  isRestDay: boolean;
  exercises: ExerciseData[];
}

interface WorkoutPlanWizardProps {
  onSave?: (plan: {
    name: string;
    description: string;
    days: WorkoutDay[];
  }) => void;
  onCancel?: () => void;
}

type WizardStep = 'basics' | 'schedule' | 'exercises' | 'review';

const defaultDayNames = [
  'Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'
];

const stepTitles = {
  basics: 'Plan Details',
  schedule: 'Weekly Schedule', 
  exercises: 'Add Exercises',
  review: 'Review & Save'
};

const stepProgress = {
  basics: 25,
  schedule: 50,
  exercises: 75,
  review: 100
};

export function WorkoutPlanWizard({ onSave, onCancel }: WorkoutPlanWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('basics');
  const [planName, setPlanName] = useState('');
  const [planDescription, setPlanDescription] = useState('');
  const [days, setDays] = useState<WorkoutDay[]>(() => 
    Array.from({ length: 7 }, (_, index) => ({
      dayIndex: index,
      name: defaultDayNames[index],
      isRestDay: false,
      exercises: []
    }))
  );
  
  // Exercise selection state
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [exerciseSearchQuery, setExerciseSearchQuery] = useState('');
  const [exerciseSearchResults, setExerciseSearchResults] = useState<ExerciseData[]>([]);
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

  const nextStep = () => {
    const steps: WizardStep[] = ['basics', 'schedule', 'exercises', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const steps: WizardStep[] = ['basics', 'schedule', 'exercises', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

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
        const exerciseExists = day.exercises.some(ex => ex.exerciseId === exercise.exerciseId);
        if (exerciseExists) return day;
        
        return {
          ...day,
          exercises: [...day.exercises, exercise],
          isRestDay: false
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
          isRestDay: updatedExercises.length === 0 ? true : day.isRestDay
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

  const canProceed = () => {
    switch (currentStep) {
      case 'basics':
        return planName.trim().length > 0;
      case 'schedule':
        return true; // Always can proceed from schedule
      case 'exercises':
        return true; // Always can proceed from exercises
      case 'review':
        return true;
      default:
        return false;
    }
  };

  const handleSave = () => {
    onSave?.({
      name: planName.trim(),
      description: planDescription.trim(),
      days
    });
  };

  const getActiveDaysCount = () => days.filter(day => !day.isRestDay).length;
  const getTotalExercisesCount = () => days.reduce((total, day) => total + day.exercises.length, 0);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex-shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={currentStep === 'basics' ? onCancel : prevStep}
            className="h-10 w-10 p-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="text-center flex-1 mx-4">
            <h1 className="font-bold text-lg">{stepTitles[currentStep]}</h1>
            <Progress 
              value={stepProgress[currentStep]} 
              className="h-1 mt-2 max-w-32 mx-auto"
            />
          </div>
          
          {onCancel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="h-10 w-10 p-0"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Step 1: Basics */}
        {currentStep === 'basics' && (
          <div className="p-4 space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-bold mb-2">Let's create your workout plan</h2>
              <p className="text-muted-foreground text-sm">
                Give your plan a name and describe your goals
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Plan Name *</label>
                <Input
                  placeholder="e.g., Bulk up plan, Maintenance plan, etc."
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  className="h-12 text-base form-input"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description (Optional)</label>
                <Textarea
                  placeholder="Describe your goals, target muscles, or any notes..."
                  value={planDescription}
                  onChange={(e) => setPlanDescription(e.target.value)}
                  className="min-h-[100px] text-base form-input"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Schedule */}
        {currentStep === 'schedule' && (
          <div className="p-4 space-y-6">
            <div className="text-center mb-6">
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
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                        day.isRestDay 
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
                        <Moon className="h-4 w-4 text-muted-foreground" />
                        <Switch
                          checked={day.isRestDay}
                          onCheckedChange={() => toggleRestDay(day.dayIndex)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Input
                    placeholder="Add custom name (e.g., Push Day, Legs)..."
                    value={day.customName || ''}
                    onChange={(e) => updateDayName(day.dayIndex, e.target.value)}
                    className="h-10 text-sm"
                  />
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Exercises */}
        {currentStep === 'exercises' && (
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
                {days.filter(day => !day.isRestDay).map((day) => (
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
                {days[selectedDayIndex].exercises.length > 0 && (
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
                )}

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
          </div>
        )}

        {/* Step 4: Review */}
        {currentStep === 'review' && (
          <div className="p-4 space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-xl font-bold mb-2">Review your plan</h2>
              <p className="text-muted-foreground text-sm">
                Everything looks good? Let's save your workout plan!
              </p>
            </div>

            <Card className="p-4">
              <h3 className="font-bold text-lg mb-1">{planName}</h3>
              {planDescription && (
                <p className="text-sm text-muted-foreground mb-4">{planDescription}</p>
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
        )}
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 p-4 border-t border-border bg-background">
        {currentStep === 'review' ? (
          <Button 
            onClick={handleSave}
            className="w-full h-12 text-base font-medium"
          >
            <Check className="h-5 w-5 mr-2" />
            Create Workout Plan
          </Button>
        ) : (
          <Button 
            onClick={nextStep}
            disabled={!canProceed()}
            className="w-full h-12 text-base font-medium"
          >
            Continue
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
