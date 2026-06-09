import type { FapshiInitiateResponse, FapshiStatusResponse } from '@/types';

const BASE = process.env.FAPSHI_BASE_URL!;
const HEADERS = {
  'Content-Type': 'application/json',
  apiuser: process.env.FAPSHI_API_USER!,
  apikey: process.env.FAPSHI_API_KEY!,
};

export async function initiatePayment(params: {
  amount: number;
  email: string;
  externalId: string;
  redirectUrl?: string;
  message?: string;
}): Promise<FapshiInitiateResponse> {
  const res = await fetch(`${BASE}/initiate-pay`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Fapshi initiate-pay failed (${res.status}): ${err}`);
  }
  return res.json();
}

export async function getPaymentStatus(transId: string): Promise<FapshiStatusResponse> {
  const res = await fetch(`${BASE}/payment-status/${transId}`, {
    method: 'GET',
    headers: HEADERS,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Fapshi payment-status failed (${res.status}): ${err}`);
  }
  return res.json();
}

export async function expirePayment(transId: string): Promise<void> {
  const res = await fetch(`${BASE}/expire-pay`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ transId }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Fapshi expire-pay failed (${res.status}): ${err}`);
  }
}

export async function getBalance(): Promise<{ balance: number }> {
  const res = await fetch(`${BASE}/balance`, {
    method: 'GET',
    headers: HEADERS,
  });
  if (!res.ok) throw new Error(`Fapshi balance failed (${res.status})`);
  return res.json();
}
