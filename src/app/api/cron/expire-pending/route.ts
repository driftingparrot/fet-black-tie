import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const cutoff = new Date(Date.now() - 25 * 60 * 60 * 1000);
  const result = await prisma.order.updateMany({
    where: { status: 'PENDING', createdAt: { lt: cutoff } },
    data: { status: 'EXPIRED' },
  });

  return NextResponse.json({ expired: result.count });
}
