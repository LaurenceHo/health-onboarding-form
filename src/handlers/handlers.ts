import { HttpResponse, http } from 'msw';
import membershipTiers from './mock/membership-tiers.json';
import healthConditions from './mock/health-conditions.json';
import { registerHandler } from '@/handlers/registration-handler.ts';

export const handlers = [
  http.get('/api/subscriptions', () => {
    return HttpResponse.json(membershipTiers);
  }),

  http.get('/api/health-conditions', () => {
    return HttpResponse.json(healthConditions);
  }),

  registerHandler,
];
