import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// минимальный CSV парсер (без зависимостей): разбиение по строкам и запятым
function parseCsv(text: string): string[][] {
  // простой случай: без кавычек с запятыми внутри
  return text.split(/\r?\n/).filter(Boolean).map(r => r.split(",").map(c => c.trim()));
}

export async function POST(req: NextRequest) {

  const form = await req.formData();
  const kind = String(form.get("kind") || "");
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const text = await file.text();
  const rows = parseCsv(text);
  if (rows.length === 0) return NextResponse.json({ error: "Empty CSV" }, { status: 400 });

  const header = rows[0].map(h => h.toLowerCase());
  const data = rows.slice(1);

  let created = 0;

  if (kind === "season") {
    const idx = Object.fromEntries(header.map((h, i) => [h, i]));
    for (const row of data) {
      const seasonNumber = Number(row[idx.seasonnumber]);
      if (!seasonNumber) continue;
      const existingSeason = await prisma.season.findFirst({
        where: { seasonNumber }
      });
      
      if (existingSeason) {
        await prisma.season.update({
          where: { id: existingSeason.id },
          data: {
            year: row[idx.year] ? Number(row[idx.year]) : null,
            title: row[idx.titleru] || "",
            description: row[idx.description] || null,
            poster: row[idx.posterurl] || null
          }
        });
      } else {
        await prisma.season.create({
          data: {
            seasonNumber,
            year: row[idx.year] ? Number(row[idx.year]) : null,
            title: row[idx.titleru] || "",
            description: row[idx.description] || null,
            poster: row[idx.posterurl] || null
          }
        });
      }
      created++;
    }
  } else if (kind === "episode") {
    const idx = Object.fromEntries(header.map((h, i) => [h, i]));
    for (const row of data) {
      const seasonNumber = Number(row[idx.seasonnumber]);
      const episodeNumber = Number(row[idx.episodenumber]);
      const title = row[idx.titleru];
      if (!seasonNumber || !episodeNumber || !title) continue;

      const season = await prisma.season.findFirst({ where: { seasonNumber } });
      if (!season) continue;

      const existingEpisode = await prisma.episode.findFirst({
        where: { 
          seasonId: season.id,
          episodeNumber 
        }
      });
      
      if (existingEpisode) {
        await prisma.episode.update({
          where: { id: existingEpisode.id },
          data: {
            title,
            description: row[idx.description] || "",
            url: row[idx.videosourceurl] || "",
            image: row[idx.thumburl] || null
          }
        });
      } else {
        await prisma.episode.create({
          data: {
            seasonId: season.id,
            episodeNumber,
            title,
            description: row[idx.description] || "",
            url: row[idx.videosourceurl] || "",
            image: row[idx.thumburl] || null,
            userId: "000000000000000000000000" // Временный ID пользователя
          }
        });
      }
      created++;
    }
  } else if (kind === "character") {
    const idx = Object.fromEntries(header.map((h, i) => [h, i]));
    for (const row of data) {
      const name = row[idx.nameru];
      if (!name) continue;
      
      // Check if character already exists by name
      const existingCharacter = await prisma.character.findFirst({
        where: { name }
      });
      
      if (existingCharacter) {
        await prisma.character.update({
          where: { id: existingCharacter.id },
          data: {
            description: row[idx.description] || "",
            image: row[idx.imageurl] || undefined
          }
        });
      } else {
        await prisma.character.create({
          data: {
            name,
            description: row[idx.description] || "",
            image: row[idx.imageurl] || undefined
          }
        });
      }
      created++;
    }
  } else {
    return NextResponse.json({ error: "Unknown kind" }, { status: 400 });
  }

  return NextResponse.json({ ok: true, kind, created });
}
