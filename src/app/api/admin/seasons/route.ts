import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { seasonSlug } from "@/lib/slugify";
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function GET() {
  const seasons = await prisma.season.findMany({
    orderBy: { seasonNumber: 'asc' },
    include: {
      episodes: {
        orderBy: { episodeNumber: 'asc' }
      }
    }
  });
  return NextResponse.json({ seasons });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // { seasonNumber, title, description, poster }
    console.log('POST /api/admin/seasons - body:', body);

    // Используем номер сезона из формы
    const seasonNumber = Number(body.seasonNumber);
    console.log('Parsed seasonNumber:', seasonNumber);
    
    if (!seasonNumber || seasonNumber < 1) {
      return NextResponse.json({ 
        error: "Номер сезона должен быть положительным числом" 
      }, { status: 400 });
    }
    
    // Проверяем, что сезон с таким номером не существует
    const existingSeason = await prisma.season.findFirst({
      where: { 
        seasonNumber: seasonNumber 
      }
    });
    
    if (existingSeason) {
      return NextResponse.json({ 
        error: `Сезон ${seasonNumber} уже существует` 
      }, { status: 400 });
    }
    
    const slug = seasonSlug(seasonNumber);
    console.log('Generated slug:', slug);

    const created = await prisma.season.create({
      data: {
        seasonNumber: seasonNumber,
        year: null,
        title: body.title || `Сезон ${seasonNumber}`,
        description: body.description ?? null,
        poster: body.poster ?? null,
        slug
      }
    });
    console.log('Created season:', created);
    
    // Ревалидируем страницы после создания сезона
    try {
      revalidatePath(`/sezon-${String(seasonNumber).padStart(2, '0')}`);
      revalidatePath('/'); // Ревалидируем главную страницу с карточками сезонов
      revalidatePath('/sitemap.xml'); // Обновляем карту сайта
      console.log('Pages revalidated successfully');
    } catch (revalidateError) {
      console.error('Revalidation error:', revalidateError);
    }
    
    // Возвращаем ответ
    return NextResponse.json({ 
      ok: true, 
      season: created,
      message: `Сезон ${seasonNumber} успешно создан`
    });
  } catch (error) {
    console.error('Error creating season:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Failed to create season" 
    }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const seasonId = searchParams.get('id');
    
    if (!seasonId) {
      return NextResponse.json({ error: "Season ID is required" }, { status: 400 });
    }

    // Проверяем, существует ли сезон
    const season = await prisma.season.findUnique({
      where: { id: seasonId },
      include: { episodes: true }
    });

    if (!season) {
      return NextResponse.json({ error: "Season not found" }, { status: 404 });
    }

    // Проверяем, есть ли эпизоды в сезоне
    if (season.episodes.length > 0) {
      return NextResponse.json({ 
        error: `Cannot delete season with ${season.episodes.length} episodes. Delete episodes first.` 
      }, { status: 400 });
    }

    // Удаляем сезон
    await prisma.season.delete({
      where: { id: seasonId }
    });

    return NextResponse.json({ 
      success: true, 
      message: `Season ${season.seasonNumber} deleted successfully` 
    });

  } catch (error) {
    console.error('Delete season error:', error);
    return NextResponse.json({ 
      error: "Failed to delete season" 
    }, { status: 500 });
  }
}
