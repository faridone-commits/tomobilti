import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const marque = searchParams.get("marque");

  if (!marque) return NextResponse.json([]);

  const models = await prisma.modele.findMany({
    where: { marque: { nom: marque } },
    orderBy: { nom: "asc" },
  });

  return NextResponse.json(models.map(m => m.nom));
}
