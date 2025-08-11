import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { PlanBasicsFormData } from '@/validations/workout-plan';
import { scrollInputIntoView } from '@/lib/input-helper';

export function PlanBasicsStep() {
  const { register, formState: { errors } } = useFormContext<PlanBasicsFormData>();

  return (
    <div className="space-y-2 px-2">
      <div className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor="name" className="font-semibold text-xs">Plan Name *</Label>
          <Input
            id="name"
            placeholder="e.g. Bulk, Maintenance"
            {...register('name')}
            className="h-10 text-base form-input"
            autoComplete="off"
            inputMode="text"
            onFocus={scrollInputIntoView}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="description" className="font-semibold text-xs">Description</Label>
          <Textarea
            id="description"
            placeholder="Goals, target muscles, notes..."
            {...register('description')}
            className="min-h-[44px] text-base form-input"
            inputMode="text"
          />
          {errors.description && (
            <p className="text-xs text-destructive">{errors.description.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
