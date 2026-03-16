import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center">
      <p className="font-heading text-8xl font-light text-ink/20 select-none">
        404
      </p>
      <h1 className="font-heading text-2xl font-light tracking-wider text-ink mt-4">
        Page Not Found
      </h1>
      <div className="mt-3 w-8 h-px bg-warm-300 mx-auto" />
      <p className="mt-6 text-sm text-ink/50">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="mt-8 text-sm tracking-widest uppercase border-b border-ink/30 pb-0.5 hover:border-ink transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
