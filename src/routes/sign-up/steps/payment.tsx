import { useForm } from '@tanstack/react-form';
import { Button } from '@/components/ui/button.tsx';
import { StepLayout } from '@/components/step-layout.tsx';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRegistration } from '@/context/registration-context.tsx';
import { Alert, AlertDescription } from '@/components/ui/alert.tsx';

export function Payment() {
  const { state, dispatch, nextStep } = useRegistration();

  const form = useForm({
    defaultValues: state.payment,
    onSubmit: ({ value }) => {
      dispatch({ type: 'UPDATE_PAYMENT', payload: value });
      nextStep();
    },
  });

  // Luhn Algorithm for real card validation
  const isValidLuhn = (num: string): boolean => {
    const cleaned = num.replace(/\D/g, '');
    if (cleaned.length < 13 || cleaned.length > 19) return false;
    let sum = 0;
    let alternate = false;
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i], 10);
      if (alternate) {
        digit *= 2;
        if (digit > 9) digit = (digit % 10) + 1;
      }
      sum += digit;
      alternate = !alternate;
    }
    return sum % 10 === 0;
  };

  return (
    <StepLayout title="Payment Details">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <form.Field
          name="cardNumber"
          validators={{
            onChange: ({ value }) => {
              const cleaned = value.replace(/\D/g, ''); // remove spaces/dashes
              if (!cleaned) return 'Card number is required';
              if (cleaned.length < 13 || cleaned.length > 19)
                return 'Invalid card length';
              if (!isValidLuhn(cleaned)) return 'Invalid card number';
              return undefined;
            },
          }}
        >
          {(field) => (
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="4242 4242 4242 4242"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '').slice(0, 19);
                  const formatted =
                    digits
                      .match(/.{1,4}/g)
                      ?.join(' ')
                      .slice(0, 19) || digits;
                  field.handleChange(formatted);
                }}
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

        <div className="grid grid-cols-2 gap-4">
          <form.Field
            name="expiry"
            validators={{
              onChange: ({ value }) => {
                const cleaned = value.replace(/\D/g, '');
                if (!cleaned) return 'Expiry is required';
                if (!/^(0[1-9]|1[0-2])[0-9]{2}$/.test(cleaned))
                  return 'Invalid expiry date';

                const month = parseInt(cleaned.slice(0, 2), 10);
                const year = parseInt(cleaned.slice(2), 10) + 2000;
                const now = new Date();
                const expiry = new Date(year, month); // month is 1-indexed in Date

                if (expiry < now) return 'Card is expired';
                return undefined;
              },
            }}
          >
            {(field) => (
              <div>
                <Label htmlFor="expiry">Expiry (MM/YY)</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
                    if (val.length >= 3) {
                      val = val.slice(0, 2) + '/' + val.slice(2);
                    }
                    field.handleChange(val);
                  }}
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
            name="cvv"
            validators={{
              onChange: ({ value }) => {
                const cleaned = value.replace(/\D/g, '');
                if (!cleaned) return 'CVV is required';
                if (!/^[0-9]{3,4}$/.test(cleaned)) return 'Invalid CVV';
                return undefined;
              },
            }}
          >
            {(field) => (
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(
                      e.target.value.replace(/\D/g, '').slice(0, 4),
                    )
                  }
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
          name="billingZip"
          validators={{
            onChange: ({ value }) => {
              if (!value.trim()) return 'Billing ZIP is required';
              if (!/^\d{4}?$/.test(value.trim())) return 'Invalid ZIP code';
              return undefined;
            },
          }}
        >
          {(field) => (
            <div>
              <Label htmlFor="billingZip">Billing ZIP</Label>
              <Input
                id="billingZip"
                placeholder="2000"
                value={field.state.value}
                onBlur={field.handleBlur}
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

        <form.Subscribe
          selector={(state) => [state.isValid]}
          children={([isValid]) => (
            <Button type="submit" className="w-full mt-6" disabled={!isValid}>
              Continue to review
            </Button>
          )}
        />
      </form>
    </StepLayout>
  );
}
