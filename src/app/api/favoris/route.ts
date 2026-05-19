import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { auth } from "../../../lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json([]);

  const favoris = await prisma.favori.findMany({
    where: { userId: session.user.id },
    include: { annonce: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(favoris.map(f => f.annonce));
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  }

  const { annonceId } = await request.json();
  if (!annonceId) return NextResponse.json({ error: "annonceId required" }, { status: 400 });

  const existing = await prisma.favori.findUnique({
    where: { userId_annonceId: { userId: session.user.id, annonceId } },
  });

  if (existing) {
    await prisma.favori.delete({ where: { id: existing.id } });
    return NextResponse.json({ favori: false });
  }

  await prisma.favori.create({
    data: { userId: session.user.id, annonceId },
  });

  return NextResponse.json({ favori: true });
}
