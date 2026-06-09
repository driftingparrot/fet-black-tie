'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { approveMessage, deleteMessage } from '@/actions/moderation.actions';
import { Button } from '@/components/ui/button';
import { TIER_LABELS } from '@/types';
import type { AnonymousMessage } from '@/generated/prisma/client';
import type { OrderSummary } from '@/actions/booking.actions';

interface Props {
  messages: AnonymousMessage[];
  orders: OrderSummary[];
}

type Tab = 'messages' | 'orders';

function statusColor(status: string): string {
  if (status === 'SUCCESSFUL') return 'text-[#22c55e]';
  if (status === 'FAILED' || status === 'EXPIRED') return 'text-red';
  return 'text-[#f59e0b]';
}

export default function AdminDashboard({ messages, orders }: Props) {
  const [tab, setTab] = useState<Tab>('messages');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleApprove(id: string) {
    startTransition(async () => {
      await approveMessage(id);
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteMessage(id);
      router.refresh();
    });
  }

  return (
    <div className="min-h-dvh bg-bg">
      {/* Header */}
      <div className="bg-surface border-b border-gold/10 px-6 py-4 flex items-center justify-between">
        <h1 className="font-heading text-xl text-text uppercase tracking-wide">Admin Dashboard</h1>
        <p className="font-sans text-text-muted text-xs">FET Black Tie Gala 2026</p>
      </div>

      {/* Tabs */}
      <div className="bg-surface-2 border-b border-gold/10 px-6 flex gap-0">
        {(['messages', 'orders'] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`font-heading text-sm uppercase tracking-wide px-4 py-3 border-b-2 transition-colors ${
              tab === t
                ? 'border-gold text-gold'
                : 'border-transparent text-text-muted hover:text-text'
            }`}
          >
            {t === 'messages' ? `Messages (${messages.length})` : `Orders (${orders.length})`}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-6 py-8 max-w-5xl mx-auto">
        {tab === 'messages' ? (
          <div className="flex flex-col gap-4">
            {messages.length === 0 ? (
              <p className="font-sans text-text-muted text-center py-12">No pending messages</p>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="bg-surface rounded-xl border border-gold/10 p-5">
                  <p className="font-sans text-text leading-relaxed">{msg.content}</p>
                  {msg.displayName && (
                    <p className="font-sans text-text-muted text-sm mt-1">— {msg.displayName}</p>
                  )}
                  <p className="font-sans text-text-muted text-xs mt-2">
                    {new Date(msg.createdAt).toLocaleString('en-CM')}
                  </p>
                  <div className="flex gap-3 mt-4">
                    <Button
                      type="button"
                      size="sm"
                      disabled={isPending}
                      onClick={() => handleApprove(msg.id)}
                      className="bg-success/10 text-success border border-success/30 hover:bg-success/20 font-heading text-xs uppercase tracking-wide"
                    >
                      Approve
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      disabled={isPending}
                      onClick={() => handleDelete(msg.id)}
                      className="font-heading text-xs uppercase tracking-wide"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            {orders.length === 0 ? (
              <p className="font-sans text-text-muted text-center py-12">No orders yet</p>
            ) : (
              <table className="w-full font-sans text-sm">
                <thead>
                  <tr className="text-left border-b border-gold/10">
                    {['Name', 'Tier', 'Amount (XAF)', 'Status', 'Date'].map((h) => (
                      <th
                        key={h}
                        className="font-heading text-xs text-text-muted uppercase tracking-wide pb-3 pr-4 last:pr-0"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-gold/5 hover:bg-surface/50">
                      <td className="py-3 pr-4">
                        <p className="text-text">{order.buyerName}</p>
                        <p className="text-text-muted text-xs">{order.userEmail}</p>
                      </td>
                      <td className="py-3 pr-4 text-gold font-heading text-xs uppercase tracking-wide">
                        {TIER_LABELS[order.tier]}
                      </td>
                      <td className="py-3 pr-4 text-text font-display text-base">
                        {order.amount.toLocaleString('fr-CM')}
                      </td>
                      <td
                        className={`py-3 pr-4 font-heading text-xs uppercase tracking-wide ${statusColor(order.status)}`}
                      >
                        {order.status}
                      </td>
                      <td className="py-3 text-text-muted text-xs">
                        {new Date(order.createdAt).toLocaleDateString('en-CM')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
