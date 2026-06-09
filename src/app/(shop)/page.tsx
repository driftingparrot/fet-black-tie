import HeroSection from '@/components/sections/HeroSection';
import CountdownSection from '@/components/sections/CountdownSection';
import TicketsSection from '@/components/sections/TicketsSection';
import EventDetailsSection from '@/components/sections/EventDetailsSection';
import MessagesSection from '@/components/sections/MessagesSection';
import { EventJsonLd, OrganizationJsonLd, WebSiteJsonLd } from '@/components/seo/JsonLd';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FET Black Tie Gala 2026 — Tickets & Event Details',
  description:
    'Get your tickets for the FET Black Tie Gala on 4 July 2026 at The Millennium Hall, University of Buea. Classic from 5,000 XAF · VIP from 10,000 XAF · Table of 5 at 30,000 XAF. Featuring the Mister & Miss FET pageant.',
  openGraph: {
    title: 'FET Black Tie Gala 2026 — Tickets & Event Details',
    description:
      'Get your tickets for the FET Black Tie Gala on 4 July 2026 at The Millennium Hall, University of Buea. Classic from 5,000 XAF · VIP from 10,000 XAF · Table of 5 at 30,000 XAF.',
  },
};

export default function HomePage() {
  return (
    <main id="main-content">
      <EventJsonLd />
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <HeroSection />
      <CountdownSection />
      <TicketsSection />
      <EventDetailsSection />
      <MessagesSection />
    </main>
  );
}
