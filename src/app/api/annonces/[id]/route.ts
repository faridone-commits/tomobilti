import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import { auth } from "../../../../lib/auth";

type Props = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Props) {
  const { id } = await params;
  const a = await prisma.annonce.findUnique({ where: { id } });
  if (!a) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(a);
}

export async function PUT(request: NextRequest, { params }: Props) {
  const session = await auth();
  const { id } = await params;
  const annonce = await prisma.annonce.findUnique({ where: { id } });
  if (!annonce) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (annonce.userId && annonce.userId !== session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const body = await request.json();
  const updated = await prisma.annonce.update({
    where: { id },
    data: {
      titre: body.titre,
      description: body.description,
      prix: parseFloat(body.prix),
      marque: body.marque,
      modele: body.modele,
      annee: body.annee ? parseInt(body.annee) : null,
      kilometrage: body.kilometrage ? parseInt(body.kilometrage) : null,
      carburant: body.carburant,
      boite: body.boite,
      wilaya: body.wilaya,
      ville: body.ville,
      telephone: body.telephone,
      images: body.images,
      categorie: body.categorie,
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: Props) {
  const session = await auth();
  const { id } = await params;
  const annonce = await prisma.annonce.findUnique({ where: { id } });
  if (!annonce) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (annonce.userId && annonce.userId !== session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }
  await prisma.annonce.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
