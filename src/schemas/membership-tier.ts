import { z } from 'zod';

// Zod schema for a single membership tier
export const TierSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  name: z.string().min(1, 'Name is required'),
  price: z.number().positive('Price must be a positive number'),
  billingPeriod: z.enum(['month', 'year'], {
    message: 'Billing period must be "month" or "year"',
  }),
  features: z.array(z.string()).min(1, 'At least one feature is required'),
  accessHours: z.string().optional(), // Some tiers might not have this
});

// Type inference from the schema
export type Tier = z.infer<typeof TierSchema>;

// Optional: Schema for the API response (array of tiers)
export const TiersResponseSchema = z.array(TierSchema);

export type TiersResponse = z.infer<typeof TiersResponseSchema>;
