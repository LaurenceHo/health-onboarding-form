import { useQuery } from '@tanstack/react-query';
import type { Tier } from '@/schemas/membership-tier';
import { useRegistration } from '@/context/registration-context.tsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const fetchTiers = async (): Promise<Array<Tier>> => {
  const res = await fetch('/api/subscriptions');
  if (!res.ok) throw new Error('Failed');
  return res.json();
};

export function MembershipPlan() {
  const { dispatch, nextStep, state } = useRegistration();
  const { data: tiers, isLoading } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: fetchTiers,
  });

  if (isLoading) return <p className="text-center">Loading plans...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-8">
        Choose Your Membership
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers?.map((tier) => {
          const isSelected = state.selectedTier?.id === tier.id;
          return (
            <Card
              key={tier.id}
              className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary shadow-lg' : ''}`}
              onClick={() => dispatch({ type: 'SET_TIER', payload: tier })}
            >
              <CardHeader>
                <CardTitle>{tier.name}</CardTitle>
                <CardDescription>{tier.accessHours}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  ${tier.price}
                  <span className="text-sm font-normal">
                    /{tier.billingPeriod}
                  </span>
                </p>
                <ul className="mt-4 space-y-2 text-sm">
                  {tier.features.map((f, i) => (
                    <li key={i}>• {f}</li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={isSelected ? 'default' : 'outline'}
                >
                  {isSelected ? 'Selected' : 'Select'}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      <div className="mt-10 text-center">
        <Button size="lg" onClick={nextStep} disabled={!state.selectedTier}>
          Continue to Personal Info
        </Button>
      </div>
    </div>
  );
}
