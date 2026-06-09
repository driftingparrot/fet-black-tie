import type { Metadata } from 'next';
import BookingForm from '@/components/forms/BookingForm';

export const metadata: Metadata = {
  title: 'Book Tickets — FET Black Tie Gala 2026',
  description:
    'Secure your seat at the FET Black Tie Gala. Choose your tier and pay securely via Fapshi.',
};

export default function BookingPage() {
  return (
    <main className="min-h-dvh bg-bg py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-12 text-center">
          <p className="font-sans text-gold text-sm uppercase tracking-[0.3em] mb-4">
            FACULTY OF ENGINEERING AND TECHNOLOGY
          </p>
          <h1 className="font-display text-7xl md:text-8xl text-text uppercase">BOOK TICKETS</h1>
          <p className="font-script text-2xl text-gold-light/80 mt-2">
            Secure your evening of elegance
          </p>
        </div>
        <BookingForm />
      </div>
    </main>
  );
}
