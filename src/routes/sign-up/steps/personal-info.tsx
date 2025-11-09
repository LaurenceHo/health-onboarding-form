import { z } from 'zod';
import { useForm } from '@tanstack/react-form';
import { Button } from '@/components/ui/button.tsx';
import { StepLayout } from '@/components/step-layout.tsx';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRegistration } from '@/context/registration-context.tsx';
import { Alert, AlertDescription } from '@/components/ui/alert.tsx';

export function PersonalInfo() {
  const { state, dispatch, nextStep } = useRegistration();

  const form = useForm({
    defaultValues: state.personal,
    onSubmit: ({ value }) => {
      dispatch({ type: 'UPDATE_PERSONAL', payload: value });
      nextStep();
    },
  });

  return (
    <StepLayout title="Personal Information">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <form.Field
            name="firstName"
            validators={{
              onChange: ({ value }) => {
                const result = z
                  .string()
                  .min(1, 'First name is required')
                  .safeParse(value);

                if (result.success) return undefined;
                return result.error.issues[0].message;
              },
            }}
          >
            {(field) => (
              <div>
                <Label htmlFor={field.name}>First Name</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
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

          <form.Field
            name="lastName"
            validators={{
              onChange: ({ value }) => {
                const result = z
                  .string()
                  .min(1, 'Last name is required')
                  .safeParse(value);

                if (result.success) return undefined;
                return result.error.issues[0].message;
              },
            }}
          >
            {(field) => (
              <div>
                <Label htmlFor={field.name}>Last Name</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
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
        </div>

        <form.Field
          name="phone"
          validators={{
            onChange: ({ value }) => {
              const cleaned = value.replace(/\D/g, '');
              if (!cleaned) return 'Phone is required';
              if (!/^\+?\d{10,15}$/.test('+' + cleaned))
                return 'Invalid phone (10-15 digits, optional +)';
              return undefined;
            },
          }}
        >
          {(field) => (
            <div>
              <Label>Phone Number</Label>
              <Input
                placeholder="+1234567890"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
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
          name="dob"
          validators={{
            onChange: ({ value }) => {
              const result = z
                .string()
                .min(1, 'Date of birth is required')
                .safeParse(value);

              if (result.success) return undefined;
              return result.error.issues[0].message;
            },
          }}
        >
          {(field) => (
            <div>
              <Label htmlFor={field.name}>Date of Birth</Label>
              <Input
                id={field.name}
                name={field.name}
                type="date"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
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

        <form.Subscribe
          selector={(state) => [state.isValid]}
          children={([isValid]) => (
            <Button type="submit" className="w-full mt-6" disabled={!isValid}>
              Continue to address
            </Button>
          )}
        />
      </form>
    </StepLayout>
  );
}
