'use server';
import { prisma } from '@/lib/db/prisma';
import { cookies } from 'next/headers';

async function requireAdmin() {
  const store = await cookies();
  if (store.get('admin_token')?.value !== process.env.ADMIN_SECRET) {
    throw new Error('Unauthorized');
  }
}

export async function submitAnonymousMessage(formData: FormData) {
  const content = String(formData.get('content') ?? '').trim();
  const displayName = String(formData.get('displayName') ?? '').trim() || null;
  if (!content || content.length > 500) return { error: 'Message must be 1–500 characters.' };
  await prisma.anonymousMessage.create({ data: { content, displayName } });
  return { success: true };
}

export async function approveMessage(id: string) {
  await requireAdmin();
  await prisma.anonymousMessage.update({
    where: { id },
    data: { status: 'APPROVED', approvedAt: new Date() },
  });
}

export async function deleteMessage(id: string) {
  await requireAdmin();
  await prisma.anonymousMessage.update({ where: { id }, data: { status: 'DELETED' } });
}

export async function getPendingMessages() {
  await requireAdmin();
  return prisma.anonymousMessage.findMany({
    where: { status: 'PENDING' },
    orderBy: { createdAt: 'asc' },
  });
}

export async function getApprovedMessages() {
  return prisma.anonymousMessage.findMany({
    where: { status: 'APPROVED' },
    orderBy: { approvedAt: 'asc' },
  });
}

export async function adminLogin(formData: FormData) {
  const secret = String(formData.get('secret') ?? '');
  if (secret !== process.env.ADMIN_SECRET) return { error: 'Wrong password' };
  const { cookies: getCookies } = await import('next/headers');
  const store = await getCookies();
  store.set('admin_token', secret, { httpOnly: true, sameSite: 'strict', maxAge: 86400 * 7 });
  return { success: true };
}
