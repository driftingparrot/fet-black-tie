'use client';
import { useState, useEffect, useRef, useTransition } from 'react';
import { processQRScan } from '@/actions/checkin.actions';
import { adminLogin } from '@/actions/moderation.actions';
import { Button } from '@/components/ui/button';
import { TIER_LABELS } from '@/types';
import type { CheckInResult } from '@/types';

interface Props {
  initialQrSlug: string;
}

export default function GatekeeperClient({ initialQrSlug }: Props) {
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [qrInput, setQrInput] = useState(initialQrSlug);
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'success' | 'denied' | 'error'>(
    'idle'
  );
  const [checkInResult, setCheckInResult] = useState<CheckInResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingQr, setPendingQr] = useState<string | null>(null);
  const [isLoginPending, startLoginTransition] = useTransition();
  const [isScanPending, startScanTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function clearResult() {
    setCheckInResult(null);
    setScanState('idle');
    setErrorMessage(null);
    setQrInput('');
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  async function doScan(slug: string) {
    const trimmed = slug.trim();
    if (!trimmed) return;
    setScanState('scanning');

    startScanTransition(async () => {
      const result = await processQRScan(trimmed);

      if ('error' in result) {
        if (result.error === 'Unauthorized') {
          setPendingQr(trimmed);
          setIsUnauthorized(true);
        } else {
          setScanState('error');
          setErrorMessage(result.error);
        }
        return;
      }

      setCheckInResult(result);
      setScanState(result.denied ? 'denied' : 'success');
      setQrInput('');
    });
  }

  function handleScan(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void doScan(qrInput);
  }

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    startLoginTransition(async () => {
      const formData = new FormData(e.currentTarget);
      const result = await adminLogin(formData);
      if ('success' in result && result.success) {
        setIsUnauthorized(false);
        setLoginError(null);
        if (pendingQr) {
          void doScan(pendingQr);
        }
      } else if ('error' in result) {
        setLoginError(result.error ?? 'Login failed');
      }
    });
  }

  useEffect(() => {
    if (initialQrSlug) {
      void doScan(initialQrSlug);
    } else {
      inputRef.current?.focus();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Login screen
  if (isUnauthorized) {
    return (
      <div className="min-h-dvh bg-bg flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="font-display text-5xl text-text uppercase">GATEKEEPER</h1>
            <p className="font-sans text-text-muted text-sm mt-2">Staff access only</p>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              name="secret"
              placeholder="Enter staff PIN"
              required
              autoFocus
              className="w-full bg-surface border border-gold/20 rounded-lg px-4 py-4 text-text placeholder:text-text-muted focus:outline-none focus:border-gold/60 font-sans text-base text-center tracking-widest"
            />
            {loginError && (
              <p role="alert" className="font-sans text-sm text-red text-center">
                {loginError}
              </p>
            )}
            <Button
              type="submit"
              disabled={isLoginPending}
              className="bg-gold hover:bg-gold-light text-bg font-heading text-base py-5"
            >
              {isLoginPending ? 'Checking...' : 'Enter'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Main scanner UI
  return (
    <div className="min-h-dvh bg-bg flex flex-col">
      {/* Top bar */}
      <div className="bg-surface border-b border-gold/10 px-4 py-3 flex items-center justify-between">
        <h1 className="font-heading text-lg text-text uppercase tracking-wide">Gatekeeper</h1>
        <span className="font-sans text-xs text-success bg-success/10 px-2 py-1 rounded-full">
          ● ACTIVE
        </span>
      </div>

      {/* Scan input */}
      <div className="px-4 py-6">
        <form onSubmit={handleScan} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={qrInput}
            onChange={(e) => setQrInput(e.target.value)}
            placeholder="QR slug or scan a QR code"
            className="flex-1 bg-surface border border-gold/20 rounded-lg px-4 py-3 text-text placeholder:text-text-muted focus:outline-none focus:border-gold/60 font-sans text-sm"
          />
          <Button
            type="submit"
            disabled={isScanPending || !qrInput.trim()}
            className="bg-gold hover:bg-gold-light text-bg font-heading px-6 py-3 disabled:opacity-50"
          >
            {isScanPending ? '...' : 'Scan'}
          </Button>
        </form>
        <p className="font-sans text-text-muted text-xs mt-2 text-center">
          Type a QR slug or use a QR scanner pointed at your device
        </p>
      </div>

      {/* Results */}
      {scanState === 'success' && checkInResult && (
        <AllowedCard result={checkInResult} onNext={clearResult} />
      )}
      {scanState === 'denied' && checkInResult && (
        <DeniedCard result={checkInResult} onNext={clearResult} />
      )}
      {scanState === 'error' && (
        <ErrorCard message={errorMessage ?? 'Unknown error'} onRetry={clearResult} />
      )}

      {scanState === 'idle' && (
        <div className="flex-1 flex items-center justify-center text-center px-6">
          <div>
            <p className="font-display text-6xl text-surface-2 uppercase select-none">SCAN QR</p>
            <p className="font-sans text-text-muted text-sm mt-2">Waiting for next ticket...</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Result Cards ────────────────────────────────────────────────────────────

function AllowedCard({ result, onNext }: { result: CheckInResult; onNext: () => void }) {
  return (
    <div className="mx-4 mt-2 rounded-2xl p-8 bg-success/10 border-2 border-success text-center">
      <p className="font-display text-7xl text-success uppercase">ALLOWED</p>
      <p className="font-heading text-2xl text-text mt-2">{result.buyerName}</p>
      <p className="font-sans text-text-muted mt-1">{TIER_LABELS[result.tier]}</p>
      <p className="font-sans text-success mt-2 text-sm">{result.message}</p>
      <p className="font-sans text-text-muted text-xs mt-1">
        Slots: {result.slotsUsed} / {result.slotsTotal}
      </p>
      <button
        onClick={onNext}
        className="mt-6 font-heading text-sm text-success underline uppercase tracking-wide"
      >
        Next →
      </button>
    </div>
  );
}

function DeniedCard({ result, onNext }: { result: CheckInResult; onNext: () => void }) {
  return (
    <div className="mx-4 mt-2 rounded-2xl p-8 bg-red/10 border-2 border-red text-center">
      <p className="font-display text-7xl text-red uppercase">DENIED</p>
      <p className="font-heading text-2xl text-text mt-2">{result.buyerName}</p>
      <p className="font-sans text-text-muted mt-1">{TIER_LABELS[result.tier]}</p>
      <p className="font-sans text-red mt-2 text-sm">{result.message}</p>
      <button
        onClick={onNext}
        className="mt-6 font-heading text-sm text-red underline uppercase tracking-wide"
      >
        Next →
      </button>
    </div>
  );
}

function ErrorCard({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="mx-4 mt-2 rounded-2xl p-6 bg-surface border border-red/20 text-center">
      <p className="font-heading text-lg text-red">Scan Error</p>
      <p className="font-sans text-text-muted text-sm mt-1">{message}</p>
      <button onClick={onRetry} className="mt-4 font-sans text-sm text-text-muted underline">
        Try again
      </button>
    </div>
  );
}
