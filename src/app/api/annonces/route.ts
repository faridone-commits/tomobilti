import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { auth } from "../../../lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const session = await auth();

  if (searchParams.get("mine") === "1") {
    if (!session?.user?.id) return NextResponse.json([]);
    const annonces = await prisma.annonce.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(annonces);
  }

  if (searchParams.get("perBrand") === "1") {
    const brands = await prisma.annonce.findMany({
      distinct: ["marque"],
      orderBy: { createdAt: "desc" },
      take: 30,
    });
    const unique = brands.filter(b => b.marque).reduce((acc, a) => {
      if (a.marque && !acc.some(x => x.marque === a.marque)) acc.push(a);
      return acc;
    }, [] as typeof brands);
    return NextResponse.json(unique);
  }

  const where: Record<string, unknown> = {};
  const q = searchParams.get("q");
  const marque = searchParams.get("marque");
  const modele = searchParams.get("modele");
  const wilaya = searchParams.get("wilaya");
  const carburant = searchParams.get("carburant");
  const categorie = searchParams.get("categorie");
  const anneeMin = searchParams.get("anneeMin");
  const prixMax = searchParams.get("prixMax");

  if (q) where.titre = { contains: q };
  if (marque) where.marque = marque;
  if (modele) where.modele = modele;
  if (wilaya) where.wilaya = wilaya;
  if (carburant) where.carburant = carburant;
  if (categorie) where.categorie = categorie;
  if (anneeMin) where.annee = { gte: parseInt(anneeMin) };
  if (prixMax) where.prix = { lte: parseFloat(prixMax) };

  const annonces = await prisma.annonce.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json(annonces);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const annonce = await prisma.annonce.create({
      data: {
        titre: body.titre,
        description: body.description || null,
        prix: parseFloat(body.prix),
        marque: body.marque || null,
        modele: body.modele || null,
        annee: body.annee ? parseInt(body.annee) : null,
        kilometrage: body.kilometrage ? parseInt(body.kilometrage) : null,
        carburant: body.carburant || null,
        boite: body.boite || null,
        wilaya: body.wilaya || null,
        ville: body.ville || null,
        telephone: body.telephone || null,
        images: body.images || "[]",
        categorie: body.categorie || null,
        userId: session.user.id,
      },
    });
    return NextResponse.json(annonce, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Erreur lors de la création" }, { status: 400 });
  }
}
