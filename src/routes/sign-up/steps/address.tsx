import { StepLayout } from '@/components/step-layout.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRegistration } from '@/context/registration-context.tsx';
import { Alert, AlertDescription } from '@/components/ui/alert.tsx';
import { useForm } from '@tanstack/react-form';

export function Address() {
  const { state, dispatch, nextStep } = useRegistration();

  const form = useForm({
    defaultValues: state.address,
    onSubmit: ({ value }) => {
      dispatch({ type: 'UPDATE_ADDRESS', payload: value });
      nextStep();
    },
  });

  return (
    <StepLayout title="Billing Address">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        {/* Street */}
        <form.Field
          name="street"
          validators={{
            onChange: ({ value }) =>
              !value || value.trim().length < 5
                ? 'Street address is required (min 5 characters)'
                : undefined,
          }}
        >
          {(field) => (
            <div>
              <Label>Street Address</Label>
              <Input
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="123 Main St"
              />
              {field.state.meta.isTouched &&
                field.state.meta.errors.length > 0 && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>
                      {field.state.meta.errors.join(', ')}
                    </AlertDescription>
                  </Alert>
                )}
            </div>
          )}
        </form.Field>

        {/* Apt (optional) */}
        <form.Field name="apt">
          {(field) => (
            <div>
              <Label>Apt, Suite, etc. (optional)</Label>
              <Input
                value={field.state.value || ''}
                onBlur={field.handleBlur}
                onChange={(e) =>
                  field.handleChange(e.target.value || undefined)
                }
                placeholder="Apt 4B"
              />
            </div>
          )}
        </form.Field>

        {/* City + State */}
        <div className="grid grid-cols-2 gap-4">
          <form.Field
            name="city"
            validators={{
              onChange: ({ value }) =>
                !value || value.trim().length < 2
                  ? 'City is required'
                  : undefined,
            }}
          >
            {(field) => (
              <div>
                <Label>City</Label>
                <Input
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Sydney"
                />
                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertDescription>
                        {field.state.meta.errors.join(', ')}
                      </AlertDescription>
                    </Alert>
                  )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="state"
            validators={{
              onChange: ({ value }) =>
                !value || value.trim().length < 2
                  ? 'State is required'
                  : undefined,
            }}
          >
            {(field) => (
              <div>
                <Label>State</Label>
                <Input
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="NSW"
                />
                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertDescription>
                        {field.state.meta.errors.join(', ')}
                      </AlertDescription>
                    </Alert>
                  )}
              </div>
            )}
          </form.Field>
        </div>

        {/* ZIP */}
        <form.Field
          name="zip"
          validators={{
            onChange: ({ value }) => {
              const cleaned = value.replace(/\D/g, '');
              if (!cleaned) return 'ZIP code is required';
              if (!/^\d{4}?$/.test(value.trim())) return 'Invalid ZIP code';
              return undefined;
            },
          }}
        >
          {(field) => (
            <div>
              <Label>ZIP Code</Label>
              <Input
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="2000"
              />
              {field.state.meta.isTouched &&
                field.state.meta.errors.length > 0 && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>
                      {field.state.meta.errors.join(', ')}
                    </AlertDescription>
                  </Alert>
                )}
            </div>
          )}
        </form.Field>

        {/* Submit Button */}
        <form.Subscribe
          selector={(state) => [state.isValid, state.isSubmitting]}
          children={([isValid, isSubmitting]) => (
            <Button
              type="submit"
              className="w-full mt-6"
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Continue to health'}
            </Button>
          )}
        />
      </form>
    </StepLayout>
  );
}
