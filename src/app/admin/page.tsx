import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'crypto';
import type { Metadata } from 'next';
import AdminLoginPage from '@/components/admin/AdminLoginPage';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { getPendingMessages } from '@/actions/moderation.actions';
import { getOrders } from '@/actions/booking.actions';

export const metadata: Metadata = {
  title: 'Admin — FET Black Tie Gala 2026',
};

async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get('admin_token')?.value ?? '';
  const dot = token.lastIndexOf('.');
  if (dot === -1) return false;
  const nonce = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = createHmac('sha256', process.env.ADMIN_SECRET!).update(nonce).digest('hex');
  try {
    return timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'));
  } catch {
    return false;
  }
}

export default async function AdminPage() {
  const authed = await isAdminAuthenticated();
  if (!authed) return <AdminLoginPage />;
  const [messages, orders] = await Promise.all([getPendingMessages(), getOrders()]);
  return <AdminDashboard messages={messages} orders={orders} />;
}
