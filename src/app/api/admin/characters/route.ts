import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  const characters = await prisma.character.findMany({
    orderBy: { name: 'asc' }
  });
  return NextResponse.json({ characters });
}

export async function POST(req: NextRequest) {
  const b = await req.json(); // { name, nameEn, description, image }
  const ch = await prisma.character.create({
    data: {
      name: b.name,
      description: b.description ?? null, 
      image: b.image ?? null
    }
  });
  return NextResponse.json({ ok: true, character: ch, path: `/personazhi/${ch.id}/` });
}
