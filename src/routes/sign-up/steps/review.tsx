import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { StepLayout } from '@/components/step-layout.tsx';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useRegistration } from '@/context/registration-context.tsx';

export function Review() {
  const { state, dispatch } = useRegistration();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const allAgreed = state.legal.agreeTerms && state.legal.agreeWaiver;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        selectedTier: state.selectedTier,
        account: {
          email: state.account.email,
          password: state.account.password,
          confirmPassword: state.account.confirmPassword,
        },
        personal: state.personal,
        address: state.address,
        healthConditions: state.healthConditions,
        payment: {
          cardNumber: state.payment.cardNumber.replace(/\s/g, ''),
          expiry: state.payment.expiry,
          cvv: state.payment.cvv,
          billingZip: state.payment.billingZip,
        },
        legal: state.legal,
      };

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      console.log('Registration successful:', data);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS UI
  if (success) {
    return (
      <StepLayout title="Welcome!">
        <div className="text-center py-12 space-y-6">
          <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto" />
          <h2 className="text-2xl font-bold">Account Created Successfully!</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Welcome to TanStack Gym, {state.personal.firstName}! Your{' '}
            {state.selectedTier?.name} membership is now active.
          </p>
          <Button asChild>
            <a href="/dashboard">Go to Dashboard</a>
          </Button>
        </div>
      </StepLayout>
    );
  }

  return (
    <StepLayout title="Review & Confirm">
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold">Plan</h3>
          <p>
            {state.selectedTier?.name} — ${state.selectedTier?.price}/
            {state.selectedTier?.billingPeriod}
          </p>
        </div>
        <div>
          <h3 className="font-semibold">Contact</h3>
          <p>
            {state.personal.firstName} {state.personal.lastName}
            <br />
            {state.account.email}
          </p>
        </div>
        {state.requiresMedicalClearance && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Medical clearance required</AlertDescription>
          </Alert>
        )}
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="terms"
              checked={state.legal.agreeTerms}
              onCheckedChange={(v) =>
                dispatch({ type: 'UPDATE_LEGAL', payload: { agreeTerms: !!v } })
              }
            />
            <Label htmlFor="terms" className="cursor-pointer">
              I agree to the{' '}
              <a href="/terms" className="underline">
                Terms of Service
              </a>
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox
              id="waiver"
              checked={state.legal.agreeWaiver}
              onCheckedChange={(v) =>
                dispatch({
                  type: 'UPDATE_LEGAL',
                  payload: { agreeWaiver: !!v },
                })
              }
            />
            <Label htmlFor="waiver" className="cursor-pointer">
              I agree to the{' '}
              <a href="/waiver" className="underline">
                Liability Waiver
              </a>
            </Label>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          size="lg"
          className="w-full"
          onClick={handleSubmit}
          disabled={!allAgreed || isSubmitting}
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </Button>
      </div>
    </StepLayout>
  );
}
