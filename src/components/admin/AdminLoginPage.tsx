'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { adminLogin } from '@/actions/moderation.actions';
import { Button } from '@/components/ui/button';

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const formData = new FormData(e.currentTarget);
      const result = await adminLogin(formData);
      if ('success' in result && result.success) {
        router.refresh();
      } else if ('error' in result) {
        setError(result.error ?? 'Login failed');
      }
    });
  }

  return (
    <div className="min-h-dvh bg-bg flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-5xl text-text uppercase">ADMIN</h1>
          <p className="font-sans text-text-muted text-sm mt-2">FET Black Tie Gala 2026</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label htmlFor="secret" className="sr-only">
            Admin password
          </label>
          <input
            id="secret"
            type="password"
            name="secret"
            placeholder="Admin password"
            required
            autoFocus
            className="w-full bg-surface border border-gold/20 rounded-lg px-4 py-4 text-text placeholder:text-text-muted focus:outline-none focus:border-gold/60 font-sans text-base"
          />
          {error && (
            <p role="alert" className="font-sans text-sm text-red text-center">
              {error}
            </p>
          )}
          <Button
            type="submit"
            disabled={isPending}
            className="bg-gold hover:bg-gold-light text-bg font-heading text-base py-5"
          >
            {isPending ? 'Verifying...' : 'Login'}
          </Button>
        </form>
      </div>
    </div>
  );
}
