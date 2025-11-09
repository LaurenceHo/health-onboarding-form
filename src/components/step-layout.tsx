import type { ReactNode } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useRegistration } from '@/context/registration-context.tsx';

interface StepLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export function StepLayout({ children, title, description }: StepLayoutProps) {
  const { prevStep } = useRegistration();

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="p-6 pb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        {description && (
          <p className="text-muted-foreground text-sm mt-1">{description}</p>
        )}
      </div>
      <CardContent className="px-6 pb-8">{children}</CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
      </CardFooter>
    </Card>
  );
}
