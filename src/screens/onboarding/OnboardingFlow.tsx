import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

import { useCreateUserProfile } from '@/stores/userStore';
import { LoaderWrapper } from '@/components/loader/loader';
import { onboardingSchema, type OnboardingFormData } from '@/validations/onboarding';
import { useOnboardingFlow } from './hook/useOnboardingFlow';
import { getConvertedMeasurements } from './helper/convert-values';

type OnboardingFlowProps = {
  isLoading: boolean;
}


export function OnboardingFlow({ isLoading = false }: OnboardingFlowProps) {
  const createUserProfile = useCreateUserProfile();

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
    currentStepNumber,
    currentStepData,
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

      const userProfile = {
        name: data.name,
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
                  <span>Step {currentStepNumber + 1} of {totalSteps}</span>
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
                  isFirst={isFirstStep}
                  isLast={isLastStep}
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

                    {isLastStep ? (
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
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                  key={index}
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