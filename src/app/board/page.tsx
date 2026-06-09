import type { Metadata } from 'next';
import ProjectorBoard from '@/components/board/ProjectorBoard';
import { getApprovedMessages } from '@/actions/moderation.actions';

export const metadata: Metadata = {
  title: 'Message Board — FET Gala',
};

export const revalidate = 10; // ISR: revalidate every 10 seconds

export default async function BoardPage() {
  const messages = await getApprovedMessages();
  return <ProjectorBoard messages={messages} />;
}
