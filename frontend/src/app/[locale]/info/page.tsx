import { PageTransition } from '@/components/ui/PageTransition';

export const revalidate = 3600;

interface InfoPageProps {
  params: Promise<{ locale: string }>;
}

const brandStory = {
  ko: {
    title: 'HEEANG',
    subtitle: '아트 주얼리',
    story: [
      '희앙은 서울을 기반으로 하는 아트 주얼리 브랜드입니다.',
      '각 작품은 자연과 감정, 시간의 흐름에서 영감을 받아 제작됩니다. 손으로 직접 제작하는 모든 피스는 단 하나만 존재하는 유니크한 작품입니다.',
      '금속과 원석이 만나는 지점에서, 희앙은 착용자의 이야기를 담을 수 있는 오브제를 만듭니다.',
    ],
    contactTitle: '문의',
    contactNote:
      '작품 구매 및 커미션 문의는 이메일로 연락 주세요. 모든 문의에는 48시간 내 답변을 드립니다.',
    email: 'hello@heeang.com',
    instagram: '@heeang.jewelry',
    location: '서울, 대한민국',
  },
  en: {
    title: 'HEEANG',
    subtitle: 'Art Jewelry',
    story: [
      'Heeang is a Seoul-based art jewelry brand.',
      'Each piece is created from inspiration drawn from nature, emotion, and the passage of time. Every handcrafted piece is a unique, one-of-a-kind work of art.',
      'At the intersection of metal and gemstone, Heeang creates objects that can hold the wearer\'s story.',
    ],
    contactTitle: 'Contact',
    contactNote:
      'For purchase and commission inquiries, please reach out via email. All inquiries receive a response within 48 hours.',
    email: 'hello@heeang.com',
    instagram: '@heeang.jewelry',
    location: 'Seoul, South Korea',
  },
};

export default async function InfoPage({ params }: InfoPageProps) {
  const { locale } = await params;
  const content = locale === 'en' ? brandStory.en : brandStory.ko;

  return (
    <PageTransition>
      <div className="px-8 md:px-16 pt-16 pb-24">
        <div className="max-w-xl">
          {/* Header */}
          <div className="mb-16">
            <h1 className="font-heading text-4xl md:text-5xl font-light tracking-wider text-ink">
              {content.title}
            </h1>
            <p className="mt-2 font-body text-xs tracking-[0.3em] uppercase text-warm-400">
              {content.subtitle}
            </p>
            <div className="mt-4 w-8 h-px bg-warm-300" />
          </div>

          {/* Brand story */}
          <div className="space-y-6 mb-20">
            {content.story.map((paragraph, i) => (
              <p
                key={i}
                className="font-body text-sm leading-loose text-warm-500"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-warm-200 mb-16" />

          {/* Contact */}
          <div>
            <h2 className="font-heading text-2xl font-light tracking-wider text-ink mb-6">
              {content.contactTitle}
            </h2>
            <p className="font-body text-sm leading-loose text-warm-500 mb-8">
              {content.contactNote}
            </p>

            <dl className="space-y-4">
              <div>
                <dt className="font-body text-[10px] tracking-[0.3em] uppercase text-warm-300 mb-1">
                  Email
                </dt>
                <dd>
                  <a
                    href={`mailto:${content.email}`}
                    className="font-body text-sm text-ink hover:text-warm-500 transition-colors"
                  >
                    {content.email}
                  </a>
                </dd>
              </div>
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
                    {content.instagram}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-body text-[10px] tracking-[0.3em] uppercase text-warm-300 mb-1">
                  Location
                </dt>
                <dd className="font-body text-sm text-warm-500">
                  {content.location}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
