import { PageTransition } from '@/components/ui/PageTransition';

export const revalidate = 3600;

interface InfoPageProps {
  params: Promise<{ locale: string }>;
}

export default async function InfoPage({ params }: InfoPageProps) {
  const { locale } = await params;
  const isKo = locale === 'ko';

  return (
    <PageTransition>
      <div className="px-8 md:px-16 pt-16 pb-24">
        <div className="max-w-xl">
          <div className="mb-16 text-center">
            <h1 className="font-heading text-lg md:text-xl font-light tracking-[0.3em] text-ink">
              Info
            </h1>
            <div className="mt-3 mx-auto w-6 h-px bg-warm-300" />
          </div>

          <div className="space-y-8">
            {/* Website */}
            <div>
              <dt className="font-body text-[10px] tracking-[0.3em] uppercase text-warm-300 mb-1">
                Website
              </dt>
              <dd>
                <a
                  href="https://heeang.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-ink hover:text-warm-500 transition-colors"
                >
                  heeang.com
                </a>
              </dd>
            </div>

            {/* Email */}
            <div>
              <dt className="font-body text-[10px] tracking-[0.3em] uppercase text-warm-300 mb-1">
                Email
              </dt>
              <dd>
                <a
                  href="mailto:hello@heeang.com"
                  className="font-body text-sm text-ink hover:text-warm-500 transition-colors"
                >
                  hello@heeang.com
                </a>
              </dd>
            </div>

            {/* Instagram */}
            <div>
              <dt className="font-body text-[10px] tracking-[0.3em] uppercase text-warm-300 mb-1">
                Instagram
              </dt>
              <dd>
                <a
                  href="https://instagram.com/heeang.jewelry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-ink hover:text-warm-500 transition-colors"
                >
                  @heeang.jewelry
                </a>
              </dd>
            </div>

            {/* Location */}
            <div>
              <dt className="font-body text-[10px] tracking-[0.3em] uppercase text-warm-300 mb-1">
                Location
              </dt>
              <dd className="font-body text-sm text-warm-500">
                {isKo ? '서울, 대한민국' : 'Seoul, South Korea'}
              </dd>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
