import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";

  const marques = await prisma.marque.findMany({
    where: q ? { nom: { contains: q } } : {},
    orderBy: { nom: "asc" },
    take: 50,
  });

  return NextResponse.json(marques.map(m => m.nom));
}
