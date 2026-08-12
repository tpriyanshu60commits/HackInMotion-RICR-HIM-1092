import { z } from 'zod';

export const saveLocationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    city: z.string().min(1, 'City is required'),
    area: z.string().optional(),
    country: z.string().optional(),
    latitude: z.number({ required_error: 'Latitude is required' }),
    longitude: z.number({ required_error: 'Longitude is required' }),
    locationType: z.enum(['home', 'work', 'school', 'other']).default('other'),
  }),
});
