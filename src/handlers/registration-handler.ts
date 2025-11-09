import { HttpResponse, http } from 'msw';
import { RegistrationSchema } from '@/schemas/registration.ts';

export const registerHandler = http.post(
  '/api/register',
  async ({ request }) => {
    const body = await request.json();
    const parsed = RegistrationSchema.parse(body);

    // Simulate validation delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Simulate 10% chance of server error (for testing error UI)
    if (Math.random() < 0.1) {
      return new HttpResponse(
        JSON.stringify({ error: 'Server error. Please try again later.' }),
        { status: 500 },
      );
    }

    // Simulate email already exists
    if (parsed.account.email === 'test@exists.com') {
      return new HttpResponse(
        JSON.stringify({ error: 'This email is already registered.' }),
        { status: 409 },
      );
    }

    // Success!
    console.log('Registration successful:', body);
    return HttpResponse.json({
      success: true,
      message: 'Account created successfully!',
      userId: crypto.randomUUID(),
      membership: parsed.selectedTier,
    });
  },
);
