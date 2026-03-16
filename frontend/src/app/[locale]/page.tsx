import { Link } from '@/lib/i18n/routing';
import { PageTransition } from '@/components/ui/PageTransition';

export const revalidate = 3600;

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  return (
    <PageTransition>
      <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
        {/* Background image — full bleed */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://picsum.photos/seed/heeang-hero/1600/2000"
            srcSet="https://picsum.photos/seed/heeang-hero/800/1000 800w, https://picsum.photos/seed/heeang-hero/1600/2000 1600w"
            sizes="100vw"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
          />
          {/* Subtle dark scrim so text reads */}
          <div className="absolute inset-0 bg-ink/20" />
        </div>

        {/* Center lockup */}
        <div className="relative z-10 text-center text-cream">
          <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl font-light tracking-[0.25em] mb-3">
            HEEANG
          </h1>
          <p className="font-body text-xs tracking-[0.5em] uppercase opacity-80 mb-12">
            {locale === 'en' ? 'Art Jewelry' : '아트 주얼리'}
          </p>
          <Link
            href="/art"
            className="font-body text-xs tracking-[0.3em] uppercase border-b border-cream/60 pb-0.5 hover:border-cream transition-colors duration-300"
          >
            {locale === 'en' ? 'Explore' : '둘러보기'}
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-cream/60">
          <span className="font-body text-[10px] tracking-[0.4em] uppercase">
            {locale === 'en' ? 'Scroll' : '스크롤'}
          </span>
          <div className="w-px h-8 bg-cream/40" />
        </div>
      </div>
    </PageTransition>
  );
}
