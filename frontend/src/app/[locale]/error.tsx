'use client';

import { useEffect } from 'react';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center">
      <p className="font-heading text-8xl font-light text-ink/20 select-none">
        Error
      </p>
      <h1 className="font-heading text-2xl font-light tracking-wider text-ink mt-4">
        Something went wrong
      </h1>
      <div className="mt-3 w-8 h-px bg-warm-300 mx-auto" />
      <p className="mt-6 text-sm text-ink/50">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="mt-8 text-sm tracking-widest uppercase border-b border-ink/30 pb-0.5 hover:border-ink transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
