export interface ProductImage {
  id: string;
  r2_key: string;
  variants: {
    thumbnail: string;
    medium: string;
    large: string;
    blur: string;
  };
  alt_ko: string;
  alt_en: string;
  sort_order: number;
}

export interface Product {
  id: string;
  category: 'art' | 'sale';
  title_ko: string;
  title_en: string;
  description_ko: string;
  description_en: string;
  price: number | null;
  price_usd: number | null;
  currency: string;
  is_available: boolean;
  images: ProductImage[];
}

const BLUR_PLACEHOLDER =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAFCAYAAABirU3bAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAP0lEQVR4nGNgYPj/n4EBCBgZGf8zMDL+Z2Bk/M/AxPCfgZHhPwMjE8N/BkYmhv8MTMwMIJaAJIAsAUkAAQYAVKoMY1l8tycAAAAASUVORK5CYII=';

const createPlaceholderImage = (id: string, seed: number): ProductImage => ({
  id,
  r2_key: `placeholder/${id}`,
  variants: {
    thumbnail: `https://picsum.photos/seed/${seed}/400/500`,
    medium: `https://picsum.photos/seed/${seed}/800/1000`,
    large: `https://picsum.photos/seed/${seed}/1600/2000`,
    blur: BLUR_PLACEHOLDER,
  },
  alt_ko: '주얼리 이미지',
  alt_en: 'Jewelry image',
  sort_order: 0,
});

export const mockArtProducts: Product[] = [
  {
    id: 'art-1',
    category: 'art',
    title_ko: '달빛 반지',
    title_en: 'Moonlight Ring',
    description_ko:
      '은과 문스톤으로 만든 유니크 아트 피스. 달빛을 머금은 듯한 오팔빛 광채가 특징입니다.',
    description_en:
      'A unique art piece crafted in silver and moonstone. Features an opalescent glow reminiscent of moonlight.',
    price: null,
    price_usd: null,
    currency: 'KRW',
    is_available: true,
    images: [
      createPlaceholderImage('art-1-1', 101),
      createPlaceholderImage('art-1-2', 102),
    ],
  },
  {
    id: 'art-2',
    category: 'art',
    title_ko: '바다의 기억',
    title_en: 'Memory of the Sea',
    description_ko:
      '산호와 터키석을 결합한 작품. 바다의 깊은 색감을 표현했습니다.',
    description_en:
      'A piece combining coral and turquoise, expressing the deep colors of the sea.',
    price: null,
    price_usd: null,
    currency: 'KRW',
    is_available: true,
    images: [createPlaceholderImage('art-2-1', 201)],
  },
  {
    id: 'art-3',
    category: 'art',
    title_ko: '숲의 속삭임',
    title_en: 'Whisper of the Forest',
    description_ko:
      '녹색 에메랄드와 골드의 조화. 자연에서 영감을 받은 유기적 형태.',
    description_en:
      'A harmony of green emerald and gold. Organic forms inspired by nature.',
    price: null,
    price_usd: null,
    currency: 'KRW',
    is_available: true,
    images: [createPlaceholderImage('art-3-1', 301)],
  },
  {
    id: 'art-4',
    category: 'art',
    title_ko: '시간의 흔적',
    title_en: 'Traces of Time',
    description_ko:
      '빈티지 골드에 다이아몬드를 세팅한 작품. 시간이 만들어낸 아름다움.',
    description_en: 'Diamond set in vintage gold. Beauty created by time.',
    price: null,
    price_usd: null,
    currency: 'KRW',
    is_available: true,
    images: [createPlaceholderImage('art-4-1', 401)],
  },
  {
    id: 'art-5',
    category: 'art',
    title_ko: '별의 조각',
    title_en: 'Fragment of Stars',
    description_ko:
      '메테오라이트와 플래티넘으로 만든 브로치. 우주의 신비를 담았습니다.',
    description_en:
      'A brooch crafted from meteorite and platinum, capturing the mystery of the cosmos.',
    price: null,
    price_usd: null,
    currency: 'KRW',
    is_available: true,
    images: [createPlaceholderImage('art-5-1', 501)],
  },
  {
    id: 'art-6',
    category: 'art',
    title_ko: '새벽의 이슬',
    title_en: 'Morning Dew',
    description_ko:
      '물방울 형태의 사파이어 팬던트. 새벽 이슬처럼 영롱한 빛.',
    description_en:
      'A teardrop sapphire pendant. Translucent light like morning dew.',
    price: null,
    price_usd: null,
    currency: 'KRW',
    is_available: true,
    images: [createPlaceholderImage('art-6-1', 601)],
  },
];

export const mockShopProducts: Product[] = [
  {
    id: 'shop-1',
    category: 'sale',
    title_ko: '미니멀 골드 링',
    title_en: 'Minimal Gold Ring',
    description_ko:
      '14K 골드로 제작한 데일리 반지. 심플하면서도 세련된 디자인.',
    description_en:
      'A daily ring crafted in 14K gold. Simple yet sophisticated design.',
    price: 180000,
    price_usd: 13500,
    currency: 'KRW',
    is_available: true,
    images: [createPlaceholderImage('shop-1-1', 701)],
  },
  {
    id: 'shop-2',
    category: 'sale',
    title_ko: '펄 드롭 이어링',
    title_en: 'Pearl Drop Earrings',
    description_ko: '담수진주와 스털링 실버의 조합. 우아한 드롭 디자인.',
    description_en:
      'Freshwater pearl and sterling silver combination. Elegant drop design.',
    price: 95000,
    price_usd: 7200,
    currency: 'KRW',
    is_available: true,
    images: [createPlaceholderImage('shop-2-1', 801)],
  },
  {
    id: 'shop-3',
    category: 'sale',
    title_ko: '체인 네크리스',
    title_en: 'Chain Necklace',
    description_ko: '섬세한 체인 네크리스. 레이어드하기 좋은 길이.',
    description_en: 'Delicate chain necklace. Perfect length for layering.',
    price: 120000,
    price_usd: 9000,
    currency: 'KRW',
    is_available: true,
    images: [createPlaceholderImage('shop-3-1', 901)],
  },
  {
    id: 'shop-4',
    category: 'sale',
    title_ko: '시그니처 뱅글',
    title_en: 'Signature Bangle',
    description_ko: '희앙의 시그니처 뱅글. 매끈한 곡선이 손목을 감쌉니다.',
    description_en: 'Heeang signature bangle. Smooth curves embrace the wrist.',
    price: 250000,
    price_usd: 19000,
    currency: 'KRW',
    is_available: true,
    images: [createPlaceholderImage('shop-4-1', 1001)],
  },
  {
    id: 'shop-5',
    category: 'sale',
    title_ko: '원석 팬던트',
    title_en: 'Gemstone Pendant',
    description_ko: '자연석을 세팅한 원 오브 어 카인드 팬던트.',
    description_en: 'One-of-a-kind pendant with natural gemstone setting.',
    price: 320000,
    price_usd: 24000,
    currency: 'KRW',
    is_available: false,
    images: [createPlaceholderImage('shop-5-1', 1101)],
  },
  {
    id: 'shop-6',
    category: 'sale',
    title_ko: '실버 허그 링',
    title_en: 'Silver Hug Ring',
    description_ko: '925 스털링 실버 오픈 링. 손가락을 감싸는 디자인.',
    description_en:
      '925 sterling silver open ring. Design that wraps around the finger.',
    price: 68000,
    price_usd: 5200,
    currency: 'KRW',
    is_available: true,
    images: [createPlaceholderImage('shop-6-1', 1201)],
  },
];

export function getProduct(id: string): Product | undefined {
  return [...mockArtProducts, ...mockShopProducts].find((p) => p.id === id);
}
