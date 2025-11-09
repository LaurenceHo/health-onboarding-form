import { MembershipPlan } from './steps/membership-plan.tsx';
import { PersonalInfo } from './steps/personal-info.tsx';
import { Address } from './steps/address.tsx';
import { Health } from './steps/health.tsx';
import { Review } from './steps/review.tsx';
import { Payment } from '@/routes/sign-up/steps/payment.tsx';
import { Account } from '@/routes/sign-up/steps/account.tsx';
import { ProgressSteps } from '@/components/progress-steps.tsx';
import { useRegistration } from '@/context/registration-context.tsx';

export default function SignUpFlow() {
  const { state } = useRegistration();
  const step = state.step;

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <ProgressSteps />
      {step === 1 && <MembershipPlan />}
      {step === 2 && <Account />}
      {step === 3 && <PersonalInfo />}
      {step === 4 && <Address />}
      {step === 5 && <Health />}
      {step === 6 && <Payment />}
      {step === 7 && <Review />}
    </div>
  );
}
