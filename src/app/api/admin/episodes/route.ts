import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { seasonSlug } from "@/lib/slugify";
const prisma = new PrismaClient();

export async function GET() {
  const episodes = await prisma.episode.findMany({
    orderBy: [
      { season: { seasonNumber: 'asc' } },
      { episodeNumber: 'asc' }
    ],
    include: {
      season: true
    }
  });
  return NextResponse.json({ episodes });
}

export async function POST(req: NextRequest) {
  const b = await req.json(); // { seasonNumber, episodeNumber, title, description, datePublished, durationMinutes, videoKind, videoSourceUrl, thumbUrl }
  const season = await prisma.season.findFirst({ where: { seasonNumber: Number(b.seasonNumber) } });
  if (!season) return NextResponse.json({ error: "Season not found" }, { status: 400 });
  const ep = await prisma.episode.create({
    data: {
      seasonId: season.id,
      episodeNumber: Number(b.episodeNumber),
      title: b.title,
      description: b.description ?? null,
      url: b.videoSourceUrl ?? "",
      image: b.thumbUrl ?? null,
      userId: "000000000000000000000000" // Временный ID пользователя
    }
  });
  return NextResponse.json({ ok: true, episode: ep, seasonPath: `/${seasonSlug(season.seasonNumber)}/` });
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const episodeId = searchParams.get('id');
    
    if (!episodeId) {
      return NextResponse.json({ error: "Episode ID is required" }, { status: 400 });
    }

    // Проверяем, существует ли эпизод
    const episode = await prisma.episode.findUnique({
      where: { id: episodeId },
      include: { season: true }
    });

    if (!episode) {
      return NextResponse.json({ error: "Episode not found" }, { status: 404 });
    }

    // Удаляем эпизод
    await prisma.episode.delete({
      where: { id: episodeId }
    });

    return NextResponse.json({ 
      success: true, 
      message: `Episode "${episode.title}" deleted successfully` 
    });

  } catch (error) {
    console.error('Delete episode error:', error);
    return NextResponse.json({ 
      error: "Failed to delete episode" 
    }, { status: 500 });
  }
}
