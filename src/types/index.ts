import type { TicketTier, OrderStatus } from '@/generated/prisma/client';

export type { TicketTier, OrderStatus };

export const TIER_PRICE: Record<TicketTier, number> = {
  CLASSIC: 5_000,
  CLASSIC_COUPLE: 9_000,
  VIP: 10_000,
  VIP_COUPLE: 18_000,
  TABLE_OF_5: 30_000,
};

export const TIER_SLOTS: Record<TicketTier, number> = {
  CLASSIC: 1,
  CLASSIC_COUPLE: 2,
  VIP: 1,
  VIP_COUPLE: 2,
  TABLE_OF_5: 5,
};

export const TIER_LABELS: Record<TicketTier, string> = {
  CLASSIC: 'Classic',
  CLASSIC_COUPLE: 'Classic Couple',
  VIP: 'VIP Classic',
  VIP_COUPLE: 'VIP Couple',
  TABLE_OF_5: 'Table of 5',
};

export const ALL_TIERS = Object.keys(TIER_PRICE) as TicketTier[];

export interface FapshiInitiateResponse {
  message: string;
  link: string;
  transId: string;
  dateInitiated: string;
}

export interface FapshiStatusResponse {
  transId: string;
  status: 'CREATED' | 'PENDING' | 'SUCCESSFUL' | 'FAILED' | 'EXPIRED';
  amount: number;
  revenue?: number;
  medium?: string;
  name?: string;
  externalId?: string;
}

export interface CheckInResult {
  allowed: boolean;
  partial: boolean;
  denied: boolean;
  buyerName: string;
  tier: TicketTier;
  slotsUsed: number;
  slotsTotal: number;
  message: string;
}
