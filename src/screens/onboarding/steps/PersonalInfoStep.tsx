/**
 * Personal information step for onboarding
 */

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import type { UserProfileFormData } from '@/types/user';
import { GENDER_OPTIONS } from '@/types/user';

interface PersonalInfoStepProps {
  formData: Partial<UserProfileFormData>;
  updateFormData: (updates: Partial<UserProfileFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function PersonalInfoStep({ formData, updateFormData }: PersonalInfoStepProps) {
  const isMetric = formData.preferredUnits === 'metric';

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-4">👤</div>
        <p className="text-muted-foreground">
          Help us personalize your experience with some basic information
        </p>
      </div>

      <div className="space-y-4">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">What should we call you?</Label>
          <Input
            id="name"
            placeholder="Enter your name"
            value={formData.name || ''}
            onChange={(e) => updateFormData({ name: e.target.value })}
            className="form-input"
          />
        </div>

        {/* Units preference */}
        <div className="space-y-2">
          <Label>Preferred measurement system</Label>
          <div className="grid grid-cols-2 gap-2">
            <Card
              className={`p-4 cursor-pointer transition-all ${
                isMetric ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}
              onClick={() => updateFormData({ preferredUnits: 'metric' })}
            >
              <div className="text-center">
                <div className="font-semibold">Metric</div>
                <div className="text-sm text-muted-foreground">kg, cm</div>
              </div>
            </Card>
            <Card
              className={`p-4 cursor-pointer transition-all ${
                !isMetric ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}
              onClick={() => updateFormData({ preferredUnits: 'imperial' })}
            >
              <div className="text-center">
                <div className="font-semibold">Imperial</div>
                <div className="text-sm text-muted-foreground">lbs, ft/in</div>
              </div>
            </Card>
          </div>
        </div>

        {/* Physical stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="height">
              Height ({isMetric ? 'cm' : 'ft/in'})
            </Label>
            <Input
              id="height"
              type="number"
              placeholder={isMetric ? '175' : '5\'10"'}
              value={formData.height || ''}
              onChange={(e) => updateFormData({ height: e.target.value })}
              className="form-input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">
              Weight ({isMetric ? 'kg' : 'lbs'})
            </Label>
            <Input
              id="weight"
              type="number"
              placeholder={isMetric ? '70' : '155'}
              value={formData.weight || ''}
              onChange={(e) => updateFormData({ weight: e.target.value })}
              className="form-input"
            />
          </div>
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Label>Gender (optional)</Label>
          <Select 
            value={formData.gender || ''} 
            onValueChange={(value) => updateFormData({ gender: value as any })}
          >
            <SelectTrigger className="form-input">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              {GENDER_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}