import { z } from 'zod';

export const HealthConditionSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  requiresMedicalClearance: z.boolean(),
});

export type HealthCondition = z.infer<typeof HealthConditionSchema>;

export const HealthConditionsResponseSchema = z.array(HealthConditionSchema);
export type HealthConditionsResponse = z.infer<
  typeof HealthConditionsResponseSchema
>;
