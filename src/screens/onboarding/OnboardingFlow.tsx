import { useCallback, useMemo, useState } from 'react';
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
import type { UserProfileFormData } from '@/types/user';
import { useCreateUserProfile } from '@/stores/userStore';
import { LoaderWrapper } from '@/components/loader/loader';

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
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Partial<UserProfileFormData>>({
    preferredUnits: 'metric',
  });

  const createUserProfile = useCreateUserProfile();

  const currentStepData = useMemo(() => STEPS[currentStep], [currentStep]);
  const StepComponent = useMemo(() => currentStepData.component, [currentStepData]);
  const progress = useMemo(() => ((currentStep + 1) / STEPS.length) * 100, [currentStep]);

  const handleNext = useCallback(() => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const updateFormData = (updates: Partial<UserProfileFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleComplete = async () => {
    try {
      setIsSubmitting(true);
      
      // Convert height to cm based on units
      let heightInCm: number;
      if (formData.preferredUnits === 'imperial') {
        const feet = parseInt(formData.heightFeet || '0');
        const inches = parseInt(formData.heightInches || '0');
        // Convert feet and inches to cm (1 foot = 30.48 cm, 1 inch = 2.54 cm)
        heightInCm = Math.round((feet * 30.48) + (inches * 2.54));
      } else {
        heightInCm = parseInt(formData.heightCm || '0');
      }

      // Convert weight to kg if imperial
      let weightInKg: number;
      if (formData.preferredUnits === 'imperial') {
        // Convert pounds to kg (1 lb = 0.453592 kg)
        weightInKg = Math.round(parseFloat(formData.weight || '0') * 0.453592 * 10) / 10; // Round to 1 decimal
      } else {
        weightInKg = parseFloat(formData.weight || '0');
      }

      // Convert target weight to kg if provided and imperial
      let targetWeightInKg: number | undefined;
      if (formData.targetWeight) {
        if (formData.preferredUnits === 'imperial') {
          targetWeightInKg = Math.round(parseFloat(formData.targetWeight) * 0.453592 * 10) / 10;
        } else {
          targetWeightInKg = parseFloat(formData.targetWeight);
        }
      }

      const userProfile = {
        name: formData.name || '',
        height: heightInCm,
        weight: weightInKg,
        gender: formData.gender || 'prefer-not-to-say',
        activityLevel: formData.activityLevel || 'moderately-active',
        primaryGoal: formData.primaryGoal || 'general-fitness',
        targetWeight: targetWeightInKg,
        experienceLevel: formData.experienceLevel || 'beginner',
        preferredUnits: formData.preferredUnits || 'metric',
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
    <LoaderWrapper isLoading={isLoading}>
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
                <span>Step {currentStep + 1} of {STEPS.length}</span>
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
                formData={formData}
                updateFormData={updateFormData}
                onNext={handleNext}
                onBack={handleBack}
                isFirst={currentStep === 0}
                isLast={currentStep === STEPS.length - 1}
              />

              {/* Navigation buttons */}
              {currentStep > 0 && (
                <div className="flex justify-between pt-6 border-t border-border/50">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={isSubmitting}
                    className="modern-btn"
                  >
                    ← Back
                  </Button>

                  {currentStep === STEPS.length - 1 ? (
                    <Button
                      onClick={handleComplete}
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
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index <= currentStep
                    ? 'bg-primary scale-110'
                    : 'bg-muted scale-100'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </LoaderWrapper>
  );
}