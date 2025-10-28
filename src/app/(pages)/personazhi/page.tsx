import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const dynamic = "force-static";

export const metadata = {
  title: "Персонажи «Южный парк»: список и эпизоды",
  description: "Полный список персонажей «Южного парка» с карточками и ссылками на серии."
};

export default async function CharactersIndex() {
  const people = await prisma.character.findMany({
    select: { id: true, name: true, image: true }
  });

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold mb-4">Персонажи</h1>
      {people.length === 0 ? <p>Пока нет персонажей.</p> : (
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {people.map(p => (
            <li key={p.id} className="border rounded-xl p-3">
              <a href={`/personazhi/${p.id}/`} className="block">
                {p.image && <img src={p.image} alt={p.name} className="rounded-lg mb-2 w-full aspect-square object-cover" loading="lazy" />}
                <div className="font-medium">{p.name}</div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
