import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from 'lucide-react';
import type { PlanBasicsFormData } from '@/validations/workout-plan';

interface PlanBasicsStepProps {
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function PlanBasicsStep({ }: PlanBasicsStepProps) {
  const { register, formState: { errors } } = useFormContext<PlanBasicsFormData>();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold mb-2">Let's create your workout plan</h2>
        <p className="text-muted-foreground text-sm">
          Give your plan a name and describe your goals
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="font-semibold">Plan Name *</Label>
          <Input
            id="name"
            placeholder="e.g., Bulk up plan, Maintenance plan, etc."
            {...register('name')}
            className="h-12 text-base form-input"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description" className="font-semibold">Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Describe your goals, target muscles, or any notes..."
            {...register('description')}
            className="min-h-[100px] text-base form-input"
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
