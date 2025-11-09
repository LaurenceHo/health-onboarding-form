import { z } from 'zod';
import { TierSchema } from '@/schemas/membership-tier.ts';

export const accountSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain one uppercase letter')
      .regex(/[0-9]/, 'Must contain one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const personalSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  phone: z.string().regex(/^\+?\d{10,15}$/, 'Invalid phone number'),
  dob: z.string().refine(
    (val) => {
      const age = new Date().getFullYear() - new Date(val).getFullYear();
      return age >= 16 && age <= 100;
    },
    { message: 'You must be 16 or older' },
  ),
});

export const addressSchema = z.object({
  street: z.string().min(5, 'Street address is required'),
  apt: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zip: z.string().regex(/^\d{4}?$/, 'Invalid ZIP code'),
});

export const paymentSchema = z.object({
  cardNumber: z.string().regex(/^\d{15,16}$/, 'Invalid card number'),
  expiry: z.string().regex(/^\d{2}\/\d{2}$/, 'Format: MM/YY'),
  cvv: z.string().regex(/^\d{3,4}$/, 'Invalid CVV'),
  billingZip: z.string().regex(/^\d{4}?$/, 'Invalid ZIP'),
});

export const legalSchema = z.object({
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms',
  }),
  agreeWaiver: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the waiver',
  }),
  marketingOptIn: z.boolean().default(false),
});

// Full schema (for final submit)
export const RegistrationSchema = z.object({
  selectedTier: TierSchema,
  account: accountSchema,
  personal: personalSchema,
  address: addressSchema,
  healthConditions: z.array(z.string()),
  payment: paymentSchema,
  legal: legalSchema,
});

export type RegistrationData = z.infer<typeof RegistrationSchema>;
