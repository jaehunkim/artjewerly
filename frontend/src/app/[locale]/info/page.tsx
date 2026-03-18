import { PageTransition } from '@/components/ui/PageTransition';

export const revalidate = 3600;

interface InfoPageProps {
  params: Promise<{ locale: string }>;
}

const artistNote = {
  ko: {
    title: '매일의 도약',
    paragraphs: [
      '서로 얽히고 설켜 자라나는 형태의 아름다움에 매료되어, 버섯에 처음 호기심을 가지게 되었다. 좁은 공간을 비집고 자라나는 버섯의 군집은 \'증식의 이미지\'를 주제로 하여 장신구를 만들 영감을 주었다. 그리고 자연에서 버섯의 생장과 역할에 대해 알아가면서 더욱더 깊은 흥미를 느끼게 되었다. 인간이 알아채지 못할 만큼 우리는 균류와 가까이에 밀접해 있다. 한발 한발 내딛는 땅속에도 버섯의 뿌리라고도 볼 수 있는 균사체가 상상도 못 할 범위로 넓게 퍼져있다. 아직도 과학적으로 밝혀지지 않은 부분이 많은 미지의 존재인 버섯은 여전히 내 작품에서 큰 존재감을 가지고 있다. 그 특성들은 장신구 작가가 되고 나서부터 끊임없이 내 작품의 모티브가 되고 있다.',
      '이전에 겪어보지 못했던 상황들의 연속으로 많은 사람의 생활이 변했다. 이제는 점점 적응해가는 분위기이지만 아마도 개개인에게 저마다 다른 변화나 흔적을 남겼을 거라 짐작된다. 나 자신도 많은 변화가 있었다. 부정적 혹은 긍정적이라고 결론지을 수 없는 일들 속에서 창작하며 스스로 재미를 찾기 위해서 전에 해오던 것과 다른 시도를 해보았다.',
      '버섯의 갓 아래 주름살을 강조, 확대, 반복해 주요 조형 요소로 삼아 장신구를 만들어왔다. 실제 버섯을 연상시키는 비대칭의 군집 형태들이 주였다. 이번 전시에는 앞뒷면이 함께 보이는 재구성된 형태의 버섯이나, 구체적 형태에서 벗어나 단순하면서 대칭이 되는 형태들을 만들고 싶었다. 기계로 만들어진 완벽한 대칭보다는 손으로 만들어진 자연스러운 대칭을 표현하였다.',
      '점토와 금속을 주로 다뤘던 나는 반투명하고 가벼우면서도 단단한 재료에 흥미를 느끼게 되었다. 반투명한 것은 또렷이 보이지 않고 그래서 신비롭다. 무언가 담기는 공간을 생각해보면 은밀하고 비밀스럽다. 플라스틱이나 합성수지와 같이 반투명한 형태 안에 무엇인가 담기는 공간을 만들고 싶었다. 무언가 그 공간에서 밖으로 나오면 어떤 일이 일어날지 상상하며 \'공간에서 공간으로 이전\'에서 떠오르는 형태를 작품으로 풀어냈다. 어딘가로 이동하며 퍼지고 피어나는 포자들처럼, 반투명 동그란 집에서 밖으로 나와 피워낸 모양을 형상화했다.',
      '재료나 형태 외에도 작품 형태를 이루는 \'레이어\' 자체도 변화를 주었다. 레이어는 주름살을 표현하면서도 버섯의 뿌리를 표현하는 선적인 요소로도 작품에 표현되었다. 지금까지는 주로 밀대로 얇게 밀어진 점토 레이어들을 가위로 자르고 겹겹이 쌓아 형태 표면을 덮어왔다면 이번 전시에는 레이어의 느낌을 다르게 표현해보고 싶었다. 도구의 개입을 최소화해서 이전보다 레이어들이 더 두껍고, 손으로 빚은 자유로운 형태가 되었다. 이 레이어들이 모여 이룬 형태가 이전 작업과는 또 다르게 보였으면 한다.',
      '새로운 방향으로 나아가려는 하루하루의 작은 시도들은 비록 소소하고 화려하지 않을지 모른다. 한 걸음을 내딛는 것이 어렵지만 매일 조금씩 나아가고 시간이 지나 결과물이 쌓인다면 그다음에는 새로운 방향으로 전진해가기가 더 쉬워지지 않을까 생각한다. 보는 사람들에게 내 작품이 이전과는 또 다르게 조금 더 새롭게 느껴지길 바라는 바다.',
    ],
    signature: '2021년 초겨울, 김희앙',
  },
  en: {
    title: 'Leap of Everyday',
    paragraphs: [
      'I first became curious about mushrooms as aesthetic beings, fascinated by the beauty of mushrooms\' forms growing intertwined. Mushrooms growing in a narrow space inspired me to create jewelry with the theme of \'image of proliferation\'. And as I learned about the growth and role of mushrooms in nature, I became more and more deeply interested. We are so close to fungi that we don\'t even notice them. Mycelia, which can also be seen as the root of a mushroom, are spread in an unimaginable range in the ground under our feet. Mushrooms, still unknown entities with many scientific mysteries, have a great presence in my work. Those characteristics have been the motifs of my works since I became a jewelry artist.',
      'Many people\'s lives have changed as a result of unprecedented situations. We are gradually getting used to them, but it is clear that everyone has experienced different changes, which must have left traces in their lives. There have been many changes in myself as well, which cannot be clearly concluded as negative or positive. In order to rediscover the fun of creation, I tried something different from what I had done before.',
      'I have been making jewelry by highlighting, magnifying, and repeating gills under the mushroom caps as the main sculptural elements. The main shapes were asymmetrical clusters, which are reminiscent of actual mushrooms. For this exhibition, I wanted to create a mushroom in a reconstructed form, in which the front and back sides can be seen together, or to create simple and symmetrical forms that break away from specific forms. I expressed a natural symmetry created by hand rather than using a perfect symmetry made by machine.',
      'Having mainly worked with clay and metal, I became interested in translucent, light and hard materials. Objects behind translucent materials are not clearly visible, which invokes mysteriousness. Also, a space that can contain something arouses a sense of privacy and secrecy. Combining the two, I wanted to create a translucent space with plastic or resin. I imagined what would happen when something came out of that space and expressed the form created from "moving from a space to a space." Like spores that move, spread, and then bloom, it embodies the shape of spores coming out of a semi-transparent round house and blooming.',
      'In addition to the material and form, the \'layers\' that make up the form of my work have also changed. In my work, layers are expressed as linear elements that express the gills and roots of mushrooms. Until now, I had pushed pieces of clay thinly with a rolling pin like paper, cut them with scissors, and stacked them layer by layer to cover the surface of a shape, but in this exhibition, I wanted to express the feeling of layers differently. By minimizing the intervention of tools, layers are now thicker than before, resulting in freehand shapes.',
      'Small attempts to move in a new direction might be trivial and not that glamorous. It is difficult to make a step forward everyday, but I think we can eventually get to take a new direction when small progresses are accumulated day by day. I hope the visitors will feel this sense of progress and find my work a little newer than before.',
    ],
    signature: 'Early winter 2021, Hee-ang Kim',
  },
};

const exhibition = {
  ko: {
    title: '매일의 도약',
    subtitle: '김희앙 개인전',
    date: '2021.11.24 (수) - 2021.12.7 (화)',
    venue: '학고재 아트센터 1F',
    address: '서울특별시 종로구 삼청로 48-4',
    hours: '화-일 10:00-18:00',
    credits: [
      { role: '디자인', name: '배준민' },
      { role: '작품 사진', name: 'KC Studio' },
      { role: '번역', name: '김희앙' },
      { role: '번역 검수', name: '김지선' },
      { role: '도록 및 포스터 디자인', name: '배준민' },
      { role: '사이트 개발 및 디자인', name: '김재헌' },
    ],
    sponsor: '서울문화재단, 서울특별시',
  },
  en: {
    title: 'Leap of Everyday',
    subtitle: 'Hee-ang Kim Solo Exhibition',
    date: 'Nov 24 - Dec 7, 2021',
    venue: 'Hakgojae Art Center 1F',
    address: 'Samcheong-ro 48-4, Jongno-gu, Seoul, Korea',
    hours: 'Tue-Sun 10:00-18:00',
    credits: [
      { role: 'Design', name: 'Junmin Bae' },
      { role: 'Photo', name: 'KC Studio' },
      { role: 'Translation', name: 'Hee-ang Kim' },
      { role: 'Proofreading', name: 'Jiseon Kim' },
      { role: 'Catalog & Poster', name: 'Junmin Bae' },
      { role: 'Web Development', name: 'Jaehun Kim' },
    ],
    sponsor: 'Seoul Foundation for Arts and Culture, Seoul Metropolitan Government',
  },
};

export default async function InfoPage({ params }: InfoPageProps) {
  const { locale } = await params;
  const isKo = locale === 'ko';
  const note = isKo ? artistNote.ko : artistNote.en;
  const ex = isKo ? exhibition.ko : exhibition.en;

  return (
    <PageTransition>
      {/* Hero banner with background image */}
      <div
        className="relative h-[300px] md:h-[400px] bg-cover bg-center"
        style={{ backgroundImage: 'url(/images/bg-artistnote.jpg)' }}
      >
        <div className="absolute inset-0 bg-ink/30" />
        <div className="relative h-full flex items-end px-8 md:px-16 pb-10">
          <div>
            <h1 className="font-heading text-3xl md:text-4xl font-light tracking-wider text-cream">
              {note.title}
            </h1>
            <p className="mt-2 font-body text-xs tracking-[0.3em] uppercase text-cream/70">
              {isKo ? '아티스트 노트' : 'Artist Note'}
            </p>
          </div>
        </div>
      </div>

      <div className="px-8 md:px-16 pt-16 pb-24">
        <div className="max-w-2xl">
          {/* Artist Note */}
          <div className="space-y-6 mb-16">
            {note.paragraphs.map((p, i) => (
              <p
                key={i}
                className="font-body text-sm leading-[2] text-warm-500"
              >
                {p}
              </p>
            ))}
            <p className="font-body text-sm text-ink mt-8 tracking-wider">
              {note.signature}
            </p>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-warm-200 mb-16" />

          {/* Exhibition Info */}
          <div className="mb-16">
            <h2 className="font-heading text-2xl font-light tracking-wider text-ink mb-2">
              {ex.title}
            </h2>
            <p className="font-body text-xs tracking-[0.2em] uppercase text-warm-400 mb-8">
              {ex.subtitle}
            </p>

            <div className="space-y-3 mb-8">
              <p className="font-body text-sm text-warm-500">{ex.date}</p>
              <p className="font-body text-sm text-warm-500">{ex.venue}</p>
              <p className="font-body text-sm text-warm-500">{ex.address}</p>
              <p className="font-body text-sm text-warm-500">{ex.hours}</p>
            </div>

            {/* Credits */}
            <div className="space-y-2 mb-8">
              {ex.credits.map((c, i) => (
                <div key={i} className="flex gap-4">
                  <span className="font-body text-xs text-warm-400 w-32 flex-shrink-0 tracking-wider">
                    {c.role}
                  </span>
                  <span className="font-body text-xs text-warm-500">
                    {c.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Sponsor */}
            <p className="font-body text-[10px] tracking-wider text-warm-300 uppercase">
              {isKo ? '후원' : 'Sponsor'}: {ex.sponsor}
            </p>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-warm-200 mb-16" />

          {/* Contact */}
          <div>
            <h2 className="font-heading text-2xl font-light tracking-wider text-ink mb-8">
              {isKo ? '문의' : 'Contact'}
            </h2>
            <dl className="space-y-4">
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
              <div>
                <dt className="font-body text-[10px] tracking-[0.3em] uppercase text-warm-300 mb-1">
                  Location
                </dt>
                <dd className="font-body text-sm text-warm-500">
                  {isKo ? '서울, 대한민국' : 'Seoul, South Korea'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
