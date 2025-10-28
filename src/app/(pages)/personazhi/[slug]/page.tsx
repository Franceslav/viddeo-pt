import { notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { jsonLd, personMeta } from "@/lib/seo";
import Link from "next/link";
const prisma = new PrismaClient();

export async function generateStaticParams() {
  const people = await prisma.character.findMany({ select: { id: true } });
  return people.map(p => ({ slug: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ch = await prisma.character.findUnique({ where: { id: slug } });
  if (!ch) return {};
  const meta = personMeta(ch.name);
  return {
    title: meta.title,
    description: meta.description,
    openGraph: { title: meta.title, description: meta.description, images: ch.image ? [{ url: ch.image }] : undefined },
    alternates: { canonical: `/personazhi/${slug}/` }
  };
}

export default async function CharacterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ch = await prisma.character.findUnique({
    where: { id: slug },
    include: {
      characterComments: {
        include: { user: true },
        orderBy: { createdAt: "desc" }
      }
    }
  });
  if (!ch) return notFound();

  const meta = personMeta(ch.name);

  const json = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": ch.name,
    "url": `/personazhi/${slug}/`,
    "image": ch.image,
    "description": ch.description?.slice(0, 180)
  };

  // Пока просто показываем информацию о персонаже

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <nav aria-label="Хлебные крошки" className="text-sm">
        <Link href="/" className="underline">Главная</Link> {" › "}
        <Link href="/personazhi/" className="underline">Персонажи</Link> {" › "}
        <span>{ch.name}</span>
      </nav>

      <header className="flex gap-4 items-center">
        {ch.image && <img src={ch.image} alt={ch.name} width={96} height={96} className="rounded-xl border" loading="lazy" />}
        <div>
          <h1 className="text-2xl font-bold">{meta.h1}</h1>
          {ch.description && <p className="text-sm opacity-80">{ch.description}</p>}
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold mb-2">О персонаже</h2>
        <p>Информация о персонаже {ch.name}.</p>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(json) }} />
    </main>
  );
}
