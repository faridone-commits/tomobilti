import { Suspense } from "react";
import { prisma } from "../lib/db";
import { AnnonceCard } from "../components/AnnonceCard";
import { FilterBar } from "../components/FilterBar";
import { AnnoncesCarousel } from "../components/AnnoncesCarousel";
import { BrandGrid } from "../components/BrandGrid";
import { ChatBot } from "../components/ChatBot";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const annonces = await prisma.annonce.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const total = await prisma.annonce.count();

  return (
    <>
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'radial-gradient(circle at 25% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px'}} />
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              Trouvez la voiture <br />
              <span className="text-primary-400">de vos rêves</span>
            </h1>
            <p className="mt-3 text-gray-300 text-sm md:text-base">
              Des milliers d&apos;annonces de voitures neuves et d&apos;occasion en Algérie.
            </p>
            <a
              href="/deposer"
              className="mt-5 inline-block bg-primary-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              Déposer une annonce
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Filters */}
        <Suspense fallback={<div className="h-20 bg-white rounded-lg border border-gray-200 animate-pulse" />}>
          <FilterBar />
        </Suspense>

        {/* Stats */}
        <p className="text-sm text-gray-500">
          <strong className="text-gray-700">{total}</strong> annonces disponibles
        </p>

        {/* Categories */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Annonces récentes par marque</h2>
          <AnnoncesCarousel />
        </section>

        {/* Popular Brands */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Marques populaires</h2>
          <BrandGrid />
        </section>

        {/* Latest Listings */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Dernières annonces</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {annonces.map(a => (
              <AnnonceCard
                key={a.id}
                a={{ ...a, createdAt: a.createdAt.toISOString() }}
              />
            ))}
          </div>
          {annonces.length === 0 && (
            <p className="text-center text-gray-400 py-8 text-sm">Aucune annonce pour le moment</p>
          )}
        </section>
      </div>

      <ChatBot />
    </>
  );
}
