/**
 * Review step for onboarding
 */

import React from 'react';
import { Card } from '@/components/ui/card';
import type { UserProfileFormData } from '@/types/user';
import { PRIMARY_GOALS, ACTIVITY_LEVELS, EXPERIENCE_LEVELS, GENDER_OPTIONS } from '@/types/user';

interface ReviewStepProps {
  formData: Partial<UserProfileFormData>;
  updateFormData: (updates: Partial<UserProfileFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function ReviewStep({ formData }: ReviewStepProps) {
  const isMetric = formData.preferredUnits === 'metric';
  
  const getGoalLabel = (value?: string) => 
    PRIMARY_GOALS.find(g => g.value === value)?.label || 'Not specified';
  
  const getActivityLabel = (value?: string) => 
    ACTIVITY_LEVELS.find(a => a.value === value)?.label || 'Not specified';
  
  const getExperienceLabel = (value?: string) => 
    EXPERIENCE_LEVELS.find(e => e.value === value)?.label || 'Not specified';
  
  const getGenderLabel = (value?: string) => 
    GENDER_OPTIONS.find(g => g.value === value)?.label || 'Not specified';

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-4">✅</div>
        <p className="text-muted-foreground">
          Let's review your information before we create your profile
        </p>
      </div>

      <Card className="  glass p-6 space-y-4">
        <h3 className="font-semibold text-lg mb-4 gradient-text">Your Profile Summary</h3>
        
        <div className="grid gap-4">
          {/* Personal Info */}
          <div className="flex justify-between items-center py-2 border-b border-border/30">
            <span className="text-muted-foreground">Name</span>
            <span className="font-medium">{formData.name || 'Not specified'}</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-border/30">
            <span className="text-muted-foreground">Height</span>
            <span className="font-medium">
              {formData.height ? `${formData.height} ${isMetric ? 'cm' : 'ft/in'}` : 'Not specified'}
            </span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-border/30">
            <span className="text-muted-foreground">Weight</span>
            <span className="font-medium">
              {formData.weight ? `${formData.weight} ${isMetric ? 'kg' : 'lbs'}` : 'Not specified'}
            </span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-border/30">
            <span className="text-muted-foreground">Gender</span>
            <span className="font-medium">{getGenderLabel(formData.gender)}</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-border/30">
            <span className="text-muted-foreground">Units</span>
            <span className="font-medium capitalize">{formData.preferredUnits}</span>
          </div>

          {/* Goals */}
          <div className="flex justify-between items-center py-2 border-b border-border/30">
            <span className="text-muted-foreground">Primary Goal</span>
            <span className="font-medium">{getGoalLabel(formData.primaryGoal)}</span>
          </div>

          {formData.targetWeight && (
            <div className="flex justify-between items-center py-2 border-b border-border/30">
              <span className="text-muted-foreground">Target Weight</span>
              <span className="font-medium">
                {formData.targetWeight} {isMetric ? 'kg' : 'lbs'}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center py-2 border-b border-border/30">
            <span className="text-muted-foreground">Activity Level</span>
            <span className="font-medium">{getActivityLabel(formData.activityLevel)}</span>
          </div>

          <div className="flex justify-between items-center py-2">
            <span className="text-muted-foreground">Experience</span>
            <span className="font-medium">{getExperienceLabel(formData.experienceLevel)}</span>
          </div>
        </div>
      </Card>

      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="text-primary text-lg">🚀</div>
          <div className="text-sm">
            <strong>Ready to start your fitness journey?</strong>
            <br />
            Your data is stored locally on your device and never leaves your control. 
            You can edit this information anytime in your profile settings.
          </div>
        </div>
      </div>
    </div>
  );
}