import { useQuery } from '@tanstack/react-query';
import { AlertCircle } from 'lucide-react';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button.tsx';
import { HealthConditionsResponseSchema } from '@/schemas/health-condition.ts';
import { StepLayout } from '@/components/step-layout.tsx';
import { useRegistration } from '@/context/registration-context.tsx';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

async function fetchHealthConditions() {
  const res = await fetch('/api/health-conditions');
  if (!res.ok) throw new Error('Failed to fetch health conditions');
  const data = await res.json();
  return HealthConditionsResponseSchema.parse(data);
}

export function Health() {
  const { state, dispatch, nextStep } = useRegistration();
  const { data: conditions, isLoading } = useQuery({
    queryKey: ['health-conditions'],
    queryFn: fetchHealthConditions,
  });

  const form = useForm({
    defaultValues: {
      healthConditions: state.healthConditions,
    },
    onSubmit: ({ value }) => {
      dispatch({
        type: 'SET_HEALTH_CONDITIONS',
        payload: value.healthConditions,
      });
      nextStep();
    },
  });

  const handleToggle = (id: string, field: any) => {
    let newSelection: Array<string>;
    if (id === 'none') {
      newSelection = ['none'];
    } else {
      newSelection = field.state.value.includes(id)
        ? field.state.value.filter((x: string) => x !== id)
        : [...field.state.value.filter((x: string) => x !== 'none'), id];
    }
    field.handleChange(newSelection);
  };

  if (isLoading)
    return (
      <StepLayout title="Health Conditions">
        <p>Loading...</p>
      </StepLayout>
    );

  return (
    <StepLayout title="Health Conditions" description="Select all that apply">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <form.Field
          name="healthConditions"
          validators={{
            onChange: ({ value }) => {
              const result = z
                .array(z.string())
                .min(1, 'Please select at least one option')
                .safeParse(value);

              if (result.success) return undefined;
              return result.error.issues[0].message;
            },
          }}
        >
          {(field) => (
            <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
              {conditions?.map((c: any) => (
                <div key={c.id} className="flex items-center space-x-3 py-2">
                  <Checkbox
                    id={c.id}
                    checked={field.state.value.includes(c.id)}
                    onCheckedChange={() => handleToggle(c.id, field)}
                  />
                  <Label htmlFor={c.id} className="cursor-pointer flex-1">
                    {c.name}
                    {c.requiresMedicalClearance && (
                      <span className="ml-2 text-xs text-orange-600 font-medium">
                        (Requires doctor's note)
                      </span>
                    )}
                  </Label>
                </div>
              ))}
              {field.state.meta.isTouched &&
              field.state.meta.errors.length > 0 ? (
                <Alert variant="destructive" className="mt-2">
                  <AlertDescription>
                    {field.state.meta.errors.join(', ')}
                  </AlertDescription>
                </Alert>
              ) : null}
            </div>
          )}
        </form.Field>

        {state.requiresMedicalClearance && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Medical clearance required.</strong> You’ll need to upload
              a doctor’s note before activation.
            </AlertDescription>
          </Alert>
        )}

        <form.Subscribe
          selector={(state) => [state.isValid]}
          children={([isValid]) => (
            <Button type="submit" className="w-full mt-6" disabled={!isValid}>
              Continue to payment
            </Button>
          )}
        />
      </form>
    </StepLayout>
  );
}
