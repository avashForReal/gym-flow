import { useCallback, useMemo, useState } from "react";
import {
  WelcomeStep,
  PersonalInfoStep,
  GoalsStep,
  ExperienceStep,
  ReviewStep,
} from "@/screens/onboarding/steps";
import type { OnboardingFormData } from "@/validations/onboarding";
import type { UseFormReturn } from "react-hook-form";

type UseOnboardingFlowProps = {
  form: UseFormReturn<OnboardingFormData>;
};

const STEPS = [
  { id: "welcome", title: "Welcome to GymFlow", component: WelcomeStep },
  { id: "personal", title: "Personal Info", component: PersonalInfoStep },
  { id: "goals", title: "Goals", component: GoalsStep },
  { id: "experience", title: "Experience", component: ExperienceStep },
  { id: "review", title: "Review", component: ReviewStep },
];

const getFieldsForStep = (
  stepId: (typeof STEPS)[number]["id"],
  preferredUnits: "metric" | "imperial"
): (keyof OnboardingFormData)[] => {
  switch (stepId) {
    case "personal":
      return preferredUnits === "metric"
        ? ["name", "age", "heightCm", "weight", "gender"]
        : ["name", "age", "heightFeet", "heightInches", "weight", "gender"];
    case "goals":
      return ["primaryGoal", "targetWeight", "activityLevel"];
    case "experience":
      return ["experienceLevel"];
    default:
      return [];
  }
};

export const useOnboardingFlow = ({ form }: UseOnboardingFlowProps) => {
  const { trigger, watch } = form;
  const watchedValues = watch();

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
    const fieldsToValidate = getFieldsForStep(
      currentStep.id,
      watchedValues.preferredUnits
    );
    return await trigger(fieldsToValidate, { shouldFocus: true });
  }, [currentStep.id, form.trigger]);

  const handleNext = useCallback(async () => {
    if (currentStepNumber === 0) {
      setCurrentStep({
        id: STEPS[currentStepNumber + 1].id,
        stepNumber: currentStepNumber + 1,
      });
      return;
    }
    const isStepValid = await validateCurrentStep();
    if (isStepValid && currentStepNumber < totalSteps - 1) {
      setCurrentStep({
        id: STEPS[currentStepNumber + 1].id,
        stepNumber: currentStepNumber + 1,
      });
    }
  }, [currentStep]);

  const handleBack = useCallback(() => {
    if (currentStepNumber > 0) {
      setCurrentStep({
        id: STEPS[currentStepNumber - 1].id,
        stepNumber: currentStepNumber - 1,
      });
    }
  }, [currentStep]);

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
