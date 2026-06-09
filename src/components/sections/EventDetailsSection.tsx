import { Calendar, MapPin, Music, Shirt } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';

export default function EventDetailsSection() {
  return (
    <section aria-label="Event Details" className="bg-surface-2 py-24 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left: Event Details */}
        <div>
          <h2 className="font-display text-6xl md:text-7xl text-text uppercase mb-10">THE EVENT</h2>
          <ul className="flex flex-col gap-5">
            <li className="flex items-start gap-3 font-sans text-text">
              <Calendar className="h-5 w-5 text-gold mt-0.5 shrink-0" aria-hidden="true" />
              <span>Saturday, 4th of July, 2026</span>
            </li>
            <li className="flex items-start gap-3 font-sans text-text">
              <MapPin className="h-5 w-5 text-gold mt-0.5 shrink-0" aria-hidden="true" />
              <span>The Millennium Hall, University of Buea, Cameroon</span>
            </li>
            <li className="flex items-start gap-3 font-sans text-text">
              <Shirt className="h-5 w-5 text-gold mt-0.5 shrink-0" aria-hidden="true" />
              <span>Black Tie Formal Dress Code</span>
            </li>
            <li className="flex items-start gap-3 font-sans text-text">
              <Music className="h-5 w-5 text-gold mt-0.5 shrink-0" aria-hidden="true" />
              <span>Live Music · Fine Dining · Mister &amp; Miss FET Pageant</span>
            </li>
          </ul>
          <p className="font-sans text-text-muted leading-relaxed mt-8">
            Join the Faculty of Engineering and Technology for an unforgettable evening celebrating
            academic excellence, innovation, and the bonds of our community.
          </p>
        </div>
        {/* Right: Messages teaser */}
        <div className="bg-surface rounded-2xl p-8 border border-gold/10">
          <h2 className="font-display text-5xl text-text uppercase mb-4">LEAVE A MESSAGE</h2>
          <p className="font-sans text-text-muted leading-relaxed mb-8">
            Send an anonymous message to be displayed on the night&apos;s projector board for all to
            see.
          </p>
          <a
            href="#messages"
            className={buttonVariants({
              variant: 'outline',
              className: 'border-gold/40 text-gold hover:bg-gold/10 hover:text-gold-light',
            })}
          >
            Write a Message
          </a>
        </div>
      </div>
    </section>
  );
}
