import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useWorkoutPlanWizard } from '@/hooks/useWorkoutPlanWizard';
import { workoutPlanSchema, type WorkoutPlanFormData } from '@/validations/workout-plan';
import { useNavigate } from '@tanstack/react-router';
import AddPlanHeader from './add-plan-header/add-plan-header';
import AddPlanFooter from './add-plan-footer/add-plan-footer';

const defaultDayNames = [
  'Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'
];

export function AddPlanWizard() {
  const navigate = useNavigate()
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
      console.log("data", data)
      // onSave?.({
      //   name: data.name.trim(),
      //   description: data.description?.trim() || '',
      //   days: data.days
      // });
    } catch (error) {
      console.error('Error saving workout plan:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    return navigate({ to: '/plans' })
  }

  return (
    <FormProvider {...form}>
      <div className="h-screen bg-background">
        <AddPlanHeader
          currentStepData={currentStepData}
          currentStepNumber={currentStepNumber}
          totalSteps={totalSteps}
          handleCancel={handleCancel}
        />

        <div className="pt-[4rem] pb-[10rem] h-full overflow-y-auto w-full">
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
        <AddPlanFooter
          isFirstStep={isFirstStep}
          handleBack={handleBack}
          isLastStep={isLastStep}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          handleNext={handleNext}
        />
      </div>
    </FormProvider>
  );
}
