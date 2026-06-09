import { z } from 'zod';

export const TierSchema = z.enum(['CLASSIC', 'CLASSIC_COUPLE', 'VIP', 'VIP_COUPLE', 'TABLE_OF_5']);
