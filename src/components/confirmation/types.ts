import type { TicketTier } from '@/types';
import type { Ticket } from '@/generated/prisma/client';

export interface ConfirmationProps {
  orderId: string;
  buyerName: string;
  userEmail: string;
  tier: TicketTier;
  amount: number;
  paymentLink: string | null;
  tickets: Ticket[];
}
