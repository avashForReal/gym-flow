import { useCallback, useMemo, useState } from "react";
import {
  PlanBasicsStep,
  PlanScheduleStep,
  PlanExercisesStep,
  PlanReviewStep,
} from "@/screens/add-plan/steps";
import type { WorkoutPlanFormData } from "@/validations/workout-plan";
import type { UseFormReturn } from "react-hook-form";

type UseWorkoutPlanWizardProps = {
  form: UseFormReturn<WorkoutPlanFormData>;
};

const STEPS = [
  { id: "basics", title: "Plan Details", component: PlanBasicsStep },
  { id: "schedule", title: "Plan Schedule", component: PlanScheduleStep },
  { id: "exercises", title: "Add Exercises", component: PlanExercisesStep },
  { id: "review", title: "Review & Save", component: PlanReviewStep },
];

const getFieldsForStep = (
  stepId: (typeof STEPS)[number]["id"]
): (keyof WorkoutPlanFormData)[] => {
  switch (stepId) {
    case "basics":
      return ["name", "description"];
    case "schedule":
      return ["days"];
    case "exercises":
      return ["days"];
    case "review":
      return ["name", "description", "days"];
    default:
      return [];
  }
};

export const useWorkoutPlanWizard = ({ form }: UseWorkoutPlanWizardProps) => {
  const { trigger } = form;

  const [currentStep, setCurrentStep] = useState<{
    id: string;
    stepNumber: number;
  }>({
    id: STEPS[0].id,
    stepNumber: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = STEPS.length;
  const currentStepNumber = currentStep.stepNumber;
  const isFirstStep = currentStepNumber === 0;
  const isLastStep = currentStepNumber === totalSteps - 1;
  const currentStepData = useMemo(
    () => STEPS[currentStepNumber],
    [currentStepNumber]
  );
  const StepComponent = useMemo(
    () => currentStepData.component,
    [currentStepData]
  );
  const progress = useMemo(
    () => ((currentStepNumber + 1) / STEPS.length) * 100,
    [currentStepNumber]
  );

  const validateCurrentStep = useCallback(async (): Promise<boolean> => {
    const fieldsToValidate = getFieldsForStep(currentStep.id);
    return await trigger(fieldsToValidate, { shouldFocus: true });
  }, [currentStep.id, trigger]);

  const handleNext = useCallback(async () => {
    const isStepValid = await validateCurrentStep();
    if (isStepValid && currentStepNumber < totalSteps - 1) {
      setCurrentStep({
        id: STEPS[currentStepNumber + 1].id,
        stepNumber: currentStepNumber + 1,
      });
    }
  }, [currentStepNumber, totalSteps, validateCurrentStep]);

  const handleBack = useCallback(() => {
    if (currentStepNumber > 0) {
      setCurrentStep({
        id: STEPS[currentStepNumber - 1].id,
        stepNumber: currentStepNumber - 1,
      });
    }
  }, [currentStepNumber]);

  return {
    totalSteps,
    isFirstStep,
    isLastStep,
    currentStep,
    isSubmitting,
    currentStepNumber,
    currentStepData,
    progress,
    StepComponent,
    setCurrentStep,
    setIsSubmitting,
    handleNext,
    handleBack,
  };
};
