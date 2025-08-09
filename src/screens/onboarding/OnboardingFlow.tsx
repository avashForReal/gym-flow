import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

import { useCreateUserProfile } from '@/stores/userStore';
import { LoaderWrapper } from '@/components/loader/loader';
import { onboardingSchema, type OnboardingFormData } from '@/validations/onboarding';
import { getConvertedMeasurements } from '../../lib/convert-values';
import type { UserProfile } from '@/lib/database';
import { useOnboardingFlow } from '@/hooks/useOnboardingFlow';
import Logo from '@/components/logo/logo';

type OnboardingFlowProps = {
  isLoading: boolean;
}

export function OnboardingFlow({ isLoading = false }: OnboardingFlowProps) {
  const createUserProfile = useCreateUserProfile();

  // Add class to body to allow scrolling during onboarding
  useEffect(() => {
    document.body.classList.add('onboarding-active');
    document.documentElement.classList.add('onboarding-active');

    return () => {
      document.body.classList.remove('onboarding-active');
      document.documentElement.classList.remove('onboarding-active');
    };
  }, []);

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      name: '',
      preferredUnits: 'metric',
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
  const { handleSubmit } = form;

  const {
    isSubmitting,
    totalSteps,
    isFirstStep,
    isLastStep,
    currentStepData,
    currentStepNumber,
    progress,
    StepComponent,
    setIsSubmitting,
    handleNext,
    handleBack,
  } = useOnboardingFlow({
    form
  });

  const onSubmit = async (data: OnboardingFormData) => {
    try {
      setIsSubmitting(true);
      const { heightCm, heightFeet, heightInches, weightKg, weightLbs, targetWeightKg, targetWeightLbs } = getConvertedMeasurements({
        preferredUnits: data.preferredUnits,
        heightCm: data.heightCm!,
        heightFeet: data.heightFeet!,
        heightInches: data.heightInches!,
        weight: data.weight!,
        targetWeight: data.targetWeight!,
      });

      const userProfile: UserProfile = {
        id: 1,
        name: data.name,
        age: parseInt(data.age),
        heightCm,
        heightFeet,
        heightInches,
        weightKg,
        weightLbs,
        targetWeightKg,
        targetWeightLbs,
        gender: data.gender || 'prefer-not-to-say',
        activityLevel: data.activityLevel || 'moderately-active',
        primaryGoal: data.primaryGoal || 'general-fitness',
        experienceLevel: data.experienceLevel || 'beginner',
        preferredUnits: data.preferredUnits,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await createUserProfile(userProfile);
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
        <div className="onboarding-container">
          <div className="container mx-auto max-w-md p-4 py-8">
            {/* Progress header */}
            <div className="mb-6 text-center">
              <div className="mb-4">
                <Logo />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Step {currentStepNumber + 1} of {totalSteps}</span>
                  <span>{currentStepData.icon}&nbsp;{currentStepData.title}</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>

            {/* Step content */}
            <Card className="glass p-6 border border-border/50">
              <div className="space-y-4">
                <StepComponent
                  onNext={handleNext}
                  onBack={handleBack}
                  isFirst={isFirstStep}
                  isLast={isLastStep}
                />

                {/* Navigation buttons */}
                {currentStepNumber > 0 && (
                  <div className="flex justify-between pt-4 border-t border-border/50 gap-3">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      disabled={isSubmitting}
                      className="modern-btn flex-1"
                    >
                      ← Back
                    </Button>

                    {isLastStep ? (
                      <Button
                        onClick={handleSubmit(onSubmit as any)}
                        disabled={isSubmitting}
                        className="modern-btn bg-gradient-to-r from-primary to-accent text-white border-0 flex-1"
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
                        className="modern-btn bg-primary text-primary-foreground flex-1"
                      >
                        Next →
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </Card>

            {/* Step indicators */}
            <div className="flex justify-center space-x-2 mt-4 mb-8">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${index <= currentStepNumber
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