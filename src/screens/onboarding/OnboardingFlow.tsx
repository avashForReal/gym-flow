import { useCallback, useMemo, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  WelcomeStep,
  PersonalInfoStep,
  GoalsStep,
  ExperienceStep,
  ReviewStep
} from './steps';
import { useCreateUserProfile } from '@/stores/userStore';
import { LoaderWrapper } from '@/components/loader/loader';
import { onboardingSchema, type OnboardingFormData } from '@/validations/onboarding';

type OnboardingFlowProps = {
  isLoading: boolean;
}

const STEPS = [
  { id: 'welcome', title: 'Welcome to GymFlow', component: WelcomeStep },
  { id: 'personal', title: 'Personal Info', component: PersonalInfoStep },
  { id: 'goals', title: 'Goals', component: GoalsStep },
  { id: 'experience', title: 'Experience', component: ExperienceStep },
  { id: 'review', title: 'Review', component: ReviewStep },
];

export function OnboardingFlow({ isLoading = false }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<{
    id: string;
    stepNumber: number;
  }>({
    id: STEPS[0].id,
    stepNumber: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createUserProfile = useCreateUserProfile();

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      name: '',
      preferredUnits: 'imperial',
      heightCm: '',
      heightFeet: null,
      heightInches: null,
      weight: '',
      targetWeight: null,
      gender: null,
      primaryGoal: null,
      activityLevel: null,
      experienceLevel: null,
    },
    mode: 'onBlur',
  });

  const { handleSubmit, watch, trigger } = form;
  const watchedValues = watch();

  const currentStepNumber = currentStep.stepNumber;
  const currentStepData = useMemo(() => STEPS[currentStepNumber], [currentStepNumber]);
  const StepComponent = useMemo(() => currentStepData.component, [currentStepData]);
  const progress = useMemo(() => ((currentStepNumber + 1) / STEPS.length) * 100, [currentStepNumber]);

  const handleNext = useCallback(async () => {
    if (currentStepNumber === 0) {
      setCurrentStep({
        id: STEPS[currentStepNumber + 1].id,
        stepNumber: currentStepNumber + 1,
      });
      return;
    }

    const isStepValid = await validateCurrentStep();
    if (isStepValid && currentStepNumber < STEPS.length - 1) {
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

  const getFieldsForStep = (stepId: typeof STEPS[number]['id']): (keyof OnboardingFormData)[] => {
    switch (stepId) {
      case 'personal':
        return watchedValues.preferredUnits === 'metric'
          ? ['name', 'heightCm', 'weight', 'gender']
          : ['name', 'heightFeet', 'heightInches', 'weight', 'gender'];
      case 'goals':
        return ['primaryGoal', 'targetWeight', 'activityLevel'];
      case 'experience':
        return ['experienceLevel'];
      default:
        return [];
    }
  };

  const validateCurrentStep = async (): Promise<boolean> => {
    const fieldsToValidate = getFieldsForStep(currentStep.id);
    return await trigger(fieldsToValidate, { shouldFocus: true });
  };

  const onSubmit = async (data: OnboardingFormData) => {
    try {
      setIsSubmitting(true);

      let heightInCm: number;
      if (data.preferredUnits === 'imperial') {
        const feet = parseInt(data.heightFeet || '0');
        const inches = parseInt(data.heightInches || '0');
        // Convert feet and inches to cm (1 foot = 30.48 cm, 1 inch = 2.54 cm)
        heightInCm = Math.round((feet * 30.48) + (inches * 2.54));
      } else {
        heightInCm = parseInt(data.heightCm || '0');
      }

      // Convert weight to kg if imperial
      let weightInKg: number;
      if (data.preferredUnits === 'imperial') {
        // Convert pounds to kg (1 lb = 0.453592 kg)
        weightInKg = Math.round(parseFloat(data.weight) * 0.453592 * 10) / 10; // Round to 1 decimal
      } else {
        weightInKg = parseFloat(data.weight);
      }

      // Convert target weight to kg if provided and imperial
      let targetWeightInKg: number | undefined;
      if (data.targetWeight && data.targetWeight.trim() !== '') {
        if (data.preferredUnits === 'imperial') {
          targetWeightInKg = Math.round(parseFloat(data.targetWeight) * 0.453592 * 10) / 10;
        } else {
          targetWeightInKg = parseFloat(data.targetWeight);
        }
      }

      const userProfile = {
        name: data.name,
        height: heightInCm,
        weight: weightInKg,
        gender: data.gender || 'prefer-not-to-say',
        activityLevel: data.activityLevel || 'moderately-active',
        primaryGoal: data.primaryGoal || 'general-fitness',
        targetWeight: targetWeightInKg,
        experienceLevel: data.experienceLevel || 'beginner',
        preferredUnits: data.preferredUnits,
      };

      console.log("userProfile", userProfile);
      // await createUserProfile(userProfile);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // Handle error (show toast, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LoaderWrapper isLoading={isLoading} size='large'>
      <FormProvider {...form}>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            {/* Progress header */}
            <div className="mb-8 text-center">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center text-2xl">
                  🔥
                </div>
                <div>
                  <h1 className="text-2xl font-black gradient-text">GYMFLOW</h1>
                  <p className="text-xs text-muted-foreground font-medium tracking-wide uppercase">
                    SETUP YOUR PROFILE
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Step {currentStepNumber + 1} of {STEPS.length}</span>
                  <span>{Math.round(progress)}% complete</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>

            {/* Step content */}
            <Card className="  glass p-8 border border-border/50">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">{currentStepData.title}</h2>
                </div>

                <StepComponent
                  onNext={handleNext}
                  onBack={handleBack}
                  isFirst={currentStepNumber === 0}
                  isLast={currentStepNumber === STEPS.length - 1}
                />

                {/* Navigation buttons */}
                {currentStepNumber > 0 && (
                  <div className="flex justify-between pt-6 border-t border-border/50">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      disabled={isSubmitting}
                      className="modern-btn"
                    >
                      ← Back
                    </Button>

                    {currentStepNumber === STEPS.length - 1 ? (
                      <Button
                        onClick={handleSubmit(onSubmit as any)}
                        disabled={isSubmitting}
                        className="modern-btn bg-gradient-to-r from-primary to-accent text-white border-0"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Setting up...</span>
                          </div>
                        ) : (
                          'Complete Setup 🚀'
                        )}
                      </Button>
                    ) : (
                      <Button
                        onClick={handleNext}
                        disabled={isSubmitting}
                        className="modern-btn bg-primary text-primary-foreground"
                      >
                        Next →
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </Card>

            {/* Step indicators */}
            <div className="flex justify-center space-x-2 mt-6">
              {STEPS.map((step, index) => (
                <div
                  key={step.id}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${index <= currentStepNumber
                    ? 'bg-primary scale-110'
                    : 'bg-muted scale-100'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </FormProvider>
    </LoaderWrapper>
  );
}