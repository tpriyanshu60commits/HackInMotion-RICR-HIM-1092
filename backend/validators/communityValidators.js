import { z } from 'zod';

export const createReportSchema = z.object({
  body: z.object({
    category: z.enum([
      'smoke',
      'waste burning',
      'heavy pollution',
      'unusual odor',
      'dust',
      'industrial emission',
      'other',
    ]),
    description: z.string().min(5, 'Description must be at least 5 characters').max(500),
    latitude: z.number({ required_error: 'Latitude is required' }),
    longitude: z.number({ required_error: 'Longitude is required' }),
    city: z.string().optional(),
  }),
});
