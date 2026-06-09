import { z } from 'zod';

export const FapshiWebhookSchema = z.object({
  transId: z.string(),
  status: z.enum(['CREATED', 'PENDING', 'SUCCESSFUL', 'FAILED', 'EXPIRED']),
  amount: z.number(),
  revenue: z.number().optional(),
  medium: z.string().optional(),
  name: z.string().optional(),
  externalId: z.string().optional(),
});

export type FapshiWebhookPayload = z.infer<typeof FapshiWebhookSchema>;
