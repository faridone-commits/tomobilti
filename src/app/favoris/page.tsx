"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { AnnonceCard } from "../../components/AnnonceCard";

export default function FavorisPage() {
  const { data: session } = useSession();
  const [annonces, setAnnonces] = useState([]);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/favoris").then(r => r.json()).then(setAnnonces).catch(() => {});
    }
  }, [session]);

  if (!session?.user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <h1 className="text-xl font-bold mb-4">Connectez-vous pour voir vos favoris</h1>
        <a href="/api/auth/signin" className="bg-primary-600 text-white px-6 py-2 rounded-lg text-sm">Se connecter</a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold text-gray-900 mb-4">Mes favoris</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {(annonces as Array<Record<string, unknown>>).map((a: any) => (
          <AnnonceCard key={a.id} a={{ ...a, createdAt: a.createdAt || new Date().toISOString() }} />
        ))}
      </div>
      {annonces.length === 0 && <p className="text-center text-gray-400 py-12">Aucun favori.</p>}
    </div>
  );
}
