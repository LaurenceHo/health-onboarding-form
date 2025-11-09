import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { StepLayout } from '@/components/step-layout.tsx';
import { useRegistration } from '@/context/registration-context.tsx';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function Account() {
  const { state, dispatch, nextStep } = useRegistration();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { email, password, confirmPassword } = state.account;

  const form = useForm({
    defaultValues: {
      email,
      password,
      confirmPassword,
    },
    onSubmit: ({ value }) => {
      dispatch({ type: 'UPDATE_ACCOUNT', payload: value });
      nextStep();
    },
  });

  return (
    <StepLayout
      title="Create Your Account"
      description="You'll use this to log in later"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-5"
      >
        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) => {
              const result = z
                .string()
                .min(1, 'Email is required')
                .email('Invalid email address')
                .safeParse(value);

              if (result.success) return undefined;
              return result.error.issues[0].message;
            },
          }}
        >
          {(field) => (
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.isTouched && field.state.meta.errors.length ? (
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
          name="password"
          validators={{
            onChange: ({ value }) => {
              const result = z
                .string()
                .min(8, 'Password must be at least 8 characters')
                .refine(
                  (p) => /[A-Z]/.test(p),
                  'Password must contain at least one uppercase letter',
                )
                .refine(
                  (p) => /[0-9]/.test(p),
                  'Password must contain at least one number',
                )
                .safeParse(value);

              if (result.success) return undefined;
              return result.error.issues[0].message;
            },
          }}
        >
          {(field) => (
            <div>
              <Label htmlFor={field.name}>Password</Label>
              <div className="relative">
                <Input
                  id={field.name}
                  name={field.name}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Must be 8+ chars, 1 uppercase, 1 number
              </p>
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
          name="confirmPassword"
          validators={{
            onChange: ({ value }) => {
              const result = z
                .string()
                .min(1, 'Please confirm your password')
                .safeParse(value);

              if (result.success) return undefined;
              return result.error.issues[0].message;
            },
            onChangeAsync: ({ value }) => {
              if (value !== form.getFieldValue('password')) {
                return 'Passwords do not match';
              }
            },
          }}
        >
          {(field) => (
            <div>
              <Label htmlFor={field.name}>Confirm Password</Label>
              <div className="relative">
                <Input
                  id={field.name}
                  name={field.name}
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
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
              Continue to personal information
            </Button>
          )}
        />
      </form>
    </StepLayout>
  );
}
