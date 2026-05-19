import { prisma } from "../../lib/db";
import { AnnonceCard } from "../../components/AnnonceCard";
import Link from "next/link";

type Props = {
  searchParams: Promise<{
    q?: string; marque?: string; modele?: string; wilaya?: string;
    carburant?: string; anneeMin?: string; prixMax?: string; categorie?: string;
  }>;
};

export default async function RecherchePage({ searchParams }: Props) {
  const p = await searchParams;
  const where: Record<string, unknown> = {};

  if (p.q) where.titre = { contains: p.q };
  if (p.marque) where.marque = p.marque;
  if (p.modele) where.modele = p.modele;
  if (p.wilaya) where.wilaya = p.wilaya;
  if (p.carburant) where.carburant = p.carburant;
  if (p.categorie) where.categorie = p.categorie;
  if (p.anneeMin) where.annee = { gte: parseInt(p.anneeMin) };
  if (p.prixMax) where.prix = { lte: parseFloat(p.prixMax) };

  const annonces = await prisma.annonce.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-primary-600">Accueil</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">Résultats de recherche</span>
      </div>
      <h1 className="text-xl font-bold text-gray-900 mb-1">
        {(p.marque || p.modele) ? `${p.marque || ""} ${p.modele || ""}`.trim() : "Résultats"}
      </h1>
      <p className="text-sm text-gray-500 mb-4">{annonces.length} annonce{annonces.length !== 1 ? "s" : ""}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {annonces.map(a => (
          <AnnonceCard key={a.id} a={{ ...a, createdAt: a.createdAt.toISOString() }} />
        ))}
      </div>
      {annonces.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400 mb-4">Aucune annonce trouvée</p>
          <Link href="/" className="text-primary-600 hover:underline text-sm">Voir toutes les annonces</Link>
        </div>
      )}
    </div>
  );
}
