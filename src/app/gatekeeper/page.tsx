import type { Metadata } from 'next';
import GatekeeperClient from '@/components/gatekeeper/GatekeeperClient';

export const metadata: Metadata = {
  title: 'Gatekeeper — FET Black Tie Gala 2026',
};

interface Props {
  searchParams: Promise<{ qr?: string }>;
}

export default async function GatekeeperPage({ searchParams }: Props) {
  const { qr } = await searchParams;
  return <GatekeeperClient initialQrSlug={qr ?? ''} />;
}
