import { z } from 'zod';
import { TierSchema } from './tier.schema';

export const BookingSchema = z.object({
  buyerName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  userEmail: z.string().email('Enter a valid email address'),
  phoneNumber: z
    .string()
    .regex(/^6[5-9]\d{7}$/, 'Enter a valid Cameroonian mobile number (e.g. 670000000)'),
  tier: TierSchema,
});

export type BookingInput = z.infer<typeof BookingSchema>;
