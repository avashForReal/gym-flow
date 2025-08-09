import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';
import { useWorkoutPlanWizard } from '@/hooks/useWorkoutPlanWizard';
import { workoutPlanSchema, type WorkoutPlanFormData } from '@/validations/workout-plan';
import type { WorkoutDay } from '@/validations/workout-plan';

interface WorkoutPlanWizardProps {
  onSave?: (plan: {
    name: string;
    description: string;
    days: WorkoutDay[];
  }) => void;
  onCancel?: () => void;
}

const defaultDayNames = [
  'Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'
];

export function WorkoutPlanWizard({ onSave, onCancel }: WorkoutPlanWizardProps) {
  const form = useForm<WorkoutPlanFormData>({
    resolver: zodResolver(workoutPlanSchema),
    defaultValues: {
      name: '',
      description: '',
      days: Array.from({ length: 7 }, (_, index) => ({
        dayIndex: index,
        name: defaultDayNames[index],
        isRestDay: false,
        exercises: []
      }))
    },
    mode: 'onBlur',
  });
  const { handleSubmit } = form;

  const {
    isSubmitting,
    totalSteps,
    isFirstStep,
    isLastStep,
    currentStepNumber,
    currentStepData,
    progress,
    StepComponent,
    setIsSubmitting,
    handleNext,
    handleBack,
  } = useWorkoutPlanWizard({
    form
  });

  const onSubmit = async (data: WorkoutPlanFormData) => {
    try {
      setIsSubmitting(true);
      onSave?.({
        name: data.name.trim(),
        description: data.description?.trim() || '',
        days: data.days
      });
    } catch (error) {
      console.error('Error saving workout plan:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...form}>
      <div className="h-screen bg-background">
        {/* Header - fixed at top */}
        <div className="fixed top-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-border z-20">
          <div className="flex items-center justify-between px-4 py-3">
            {
              !isFirstStep && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="h-8 w-8 p-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )
            }

            <div className="text-center flex-1 mx-3">
              <h1 className="font-bold text-base">{currentStepData.title}</h1>
              <div className="flex items-center justify-center gap-1 mt-1">
                <span className="text-xs text-muted-foreground">
                  Step {currentStepNumber + 1} of {totalSteps}
                </span>
              </div>
              <Progress
                value={progress}
                className="h-1 mt-1 max-w-24 mx-auto"
              />
            </div>

            {onCancel && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancel}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Content - with top and bottom padding to account for fixed header and footer */}
        <div className="pt-[5rem] pb-20 h-full overflow-y-auto">
          <div className="p-4">
            <StepComponent
              onNext={handleNext}
              onBack={handleBack}
              isFirst={isFirstStep}
              isLast={isLastStep}
            />
          </div>
        </div>

        {/* Footer - fixed at bottom above navigation */}
        <div className="fixed bottom-[5rem] left-0 right-0 bg-background border-t border-border z-20">
          <div className="p-4">
            {isLastStep ? (
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="w-full h-12 text-base font-medium"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    Create Workout Plan
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={isSubmitting}
                className="w-full h-12 text-base font-medium"
              >
                Continue
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
