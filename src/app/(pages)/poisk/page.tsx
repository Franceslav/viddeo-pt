import { PrismaClient } from "@prisma/client";
import { seasonSlug } from "@/lib/slugify";
const prisma = new PrismaClient();

export const metadata = {
  title: "Поиск по «Южному парку»: сезоны, серии, персонажи",
  description: "Найдите сезоны, серии и персонажей «Южного парка»."
};

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const q = (resolvedSearchParams?.q ?? "").trim();
  let episodes: unknown[] = [], seasons: unknown[] = [], people: unknown[] = [];
  if (q) {
    episodes = await prisma.episode.findMany({
      where: { OR: [{ title: { contains: q, mode: "insensitive" } }, { titleEn: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }] },
      include: { season: { select: { seasonNumber: true } } },
      take: 20
    });
    seasons = await prisma.season.findMany({
      where: { OR: [{ title: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }] },
      take: 10
    });
    people = await prisma.character.findMany({
      where: { OR: [{ name: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }] },
      take: 10
    });
  }

  return (
    <main className="mx-auto max-w-4xl p-6 space-y-8">
      <h1 className="text-2xl font-bold">Поиск</h1>
      <form method="GET" className="flex gap-2">
        <input name="q" defaultValue={q} className="border rounded p-2 flex-1" placeholder="Введите запрос…" />
        <button className="border rounded px-4">Найти</button>
      </form>

      {q && (
        <>
          <section>
            <h2 className="text-xl font-semibold mb-2">Серии</h2>
            {episodes.length === 0 ? <p>Ничего не найдено.</p> : (
              <ul className="list-disc list-inside">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {episodes.map((ep: any) => (
                  <li key={ep.id}>
                    <a className="underline" href={`/${seasonSlug(ep.season.seasonNumber)}/${ep.slug}/`}>
                      Сезон {ep.season.seasonNumber}, серия {ep.episodeNumber}: {ep.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Сезоны</h2>
            {seasons.length === 0 ? <p>Ничего не найдено.</p> : (
              <ul className="list-disc list-inside">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {seasons.map((s: any) => (
                  <li key={s.id}>
                    <a className="underline" href={`/${seasonSlug(s.seasonNumber)}/`}>Сезон {s.seasonNumber}</a>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Персонажи</h2>
            {people.length === 0 ? <p>Ничего не найдено.</p> : (
              <ul className="list-disc list-inside">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {people.map((p: any) => (
                  <li key={p.id}>
                    <a className="underline" href={`/personazhi/${p.slug}/`}>{p.name}</a>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </main>
  );
}
