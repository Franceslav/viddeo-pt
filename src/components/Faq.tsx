type QA = { q: string; a: string };

export default function Faq({ items }: { items: QA[] }) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold mb-3">Частые вопросы</h2>
      <div className="divide-y">
        {items.map((it, i) => (
          <details key={i} className="py-3">
            <summary className="cursor-pointer font-medium">{it.q}</summary>
            <p className="mt-2 opacity-90">{it.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function faqJsonLd(items: QA[], pageUrl: string) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map(it => ({
      "@type": "Question",
      "name": it.q,
      "acceptedAnswer": { "@type": "Answer", "text": it.a }
    })),
    "url": pageUrl
  }, null, 2);
}

export const defaultFaq = [
  { q: "Где смотреть серии «Южного парка»?", a: "Мы показываем только официальные встраивания и ссылки на правообладателей. Если серия недоступна, вы увидите карточку с описанием и источником."},
  { q: "Как найти серии по сезонам?", a: "Откройте нужный сезон на главной странице: там полный список серий с датами и описаниями."},
  { q: "Есть ли страницы персонажей?", a: "Да, у каждого персонажа своя карточка с биографией и списком эпизодов."},
  { q: "Как устроены ссылки?", a: "ЧПУ: /sezon-01/ и /sezon-01/seriya-01-nazvanie/ — оптимально для индексации."},
  { q: "Есть ли карта сайта?", a: "Да, sitemap.xml формируется динамически и обновляется при изменениях."}
];
