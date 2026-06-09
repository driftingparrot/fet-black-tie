import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book Tickets — FET Black Tie Gala 2026',
  description: 'Select your ticket tier and complete your booking for the FET Black Tie Gala.',
};

export default function BookingPage() {
  return (
    <main id="main-content" className="min-h-dvh bg-bg px-6 py-24">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="font-display text-7xl text-text uppercase">BOOK TICKETS</h1>
        <p className="font-sans text-text-muted mt-6">Booking coming soon.</p>
      </div>
    </main>
  );
}
