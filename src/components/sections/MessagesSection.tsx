'use client';
import { useRef, useState, useTransition } from 'react';
import { submitAnonymousMessage } from '@/actions/moderation.actions';
import { Button } from '@/components/ui/button';

export default function MessagesSection() {
  const [content, setContent] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [result, setResult] = useState<{ success?: boolean; error?: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(formRef.current!);
    startTransition(async () => {
      const res = await submitAnonymousMessage(formData);
      setResult(res);
      if (res.success) {
        setContent('');
        setDisplayName('');
        formRef.current?.reset();
      }
    });
  }

  const inputClass =
    'w-full bg-surface border border-gold/20 rounded-lg px-4 py-3 text-text placeholder:text-text-muted focus:outline-none focus:border-gold/60 transition-colors font-sans text-sm';

  return (
    <section id="messages" aria-label="Send an anonymous message" className="bg-bg py-24 px-6">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="font-display text-7xl md:text-8xl text-text uppercase">SEND A MESSAGE</h2>
        <p className="font-script text-2xl text-gold-light/80 mt-2 mb-12">
          Your words, displayed on the night
        </p>

        {result?.success ? (
          <div
            role="status"
            className="bg-surface border border-gold/20 rounded-2xl p-8 text-center"
          >
            <p className="font-heading text-xl text-gold mb-2">Message sent!</p>
            <p className="font-sans text-text-muted text-sm">
              It may appear on the projector board tonight.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setResult(null)}
              className="mt-6 border-gold/40 text-gold hover:bg-gold/10"
            >
              Send another
            </Button>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
            <div>
              <label htmlFor="displayName" className="sr-only">
                Your name (optional)
              </label>
              <input
                id="displayName"
                name="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name (optional)"
                className={inputClass}
                maxLength={80}
              />
            </div>
            <div>
              <label htmlFor="content" className="sr-only">
                Message
              </label>
              <textarea
                id="content"
                name="content"
                rows={4}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your message... (max 500 chars)"
                className={`${inputClass} resize-none`}
                maxLength={500}
              />
              <p className="font-sans text-text-muted text-xs text-right mt-1" aria-live="polite">
                {content.length} / 500
              </p>
            </div>
            {result?.error && (
              <p role="alert" className="font-sans text-sm text-red">
                {result.error}
              </p>
            )}
            <Button
              type="submit"
              disabled={isPending}
              className="bg-gold hover:bg-gold-light text-bg font-heading text-base w-full py-5 disabled:opacity-60"
            >
              {isPending ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
