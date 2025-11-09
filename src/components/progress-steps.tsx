import { Progress } from '@/components/ui/progress';
import { useRegistration } from '@/context/registration-context.tsx';

const steps = [
  'Plan',
  'Account',
  'Personal',
  'Address',
  'Health',
  'Payment',
  'Review',
];

export function ProgressSteps() {
  const { state, progress } = useRegistration();

  return (
    <div className="mb-10">
      <Progress value={progress} className="h-2 mb-3" />
      <div className="flex justify-between text-sm text-muted-foreground">
        {steps.map((label, i) => (
          <span
            key={label}
            className={`font-medium ${state.step > i + 1 ? 'text-primary' : ''} ${state.step === i + 1 ? 'text-foreground font-bold' : ''}`}
          >
            {label}
          </span>
        ))}
      </div>
      <p className="text-center text-sm mt-2">
        Step {state.step} of {steps.length}
      </p>
    </div>
  );
}
