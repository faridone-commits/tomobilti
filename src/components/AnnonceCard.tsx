"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { formatPrix } from "../lib/utils";
import { useState } from "react";

type Annonce = {
  id: string;
  titre: string;
  prix: number;
  marque: string | null;
  modele: string | null;
  annee: number | null;
  kilometrage: number | null;
  carburant: string | null;
  boite: string | null;
  wilaya: string | null;
  images: string;
  createdAt: string;
  telephone: string | null;
  userId: string | null;
};

export function AnnonceCard({ a }: { a: Annonce }) {
  const images: string[] = JSON.parse(a.images || "[]");
  const { data: session } = useSession();
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  async function toggleFav(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!session?.user) return;
    setFavLoading(true);
    try {
      const res = await fetch("/api/favoris", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ annonceId: a.id }),
      });
      if (res.ok) setIsFav(!isFav);
    } finally {
      setFavLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
      <Link href={`/annonce/${a.id}`} className="block">
        <div className="relative aspect-[4/3] bg-gray-100">
          {images.length > 0 ? (
            <img
              src={images[0]}
              alt={a.titre}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              Pas d&apos;image
            </div>
          )}
          <div className="absolute top-2 left-2 bg-primary-600 text-white text-xs font-bold px-2 py-0.5 rounded">
            {formatPrix(a.prix)}
          </div>
          {session?.user && (
            <button
              onClick={toggleFav}
              disabled={favLoading}
              className="absolute top-2 right-2 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center text-sm hover:bg-white transition-colors"
            >
              {isFav ? "❤️" : "🤍"}
            </button>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {a.titre}
          </h3>
          <div className="mt-1.5 flex flex-wrap gap-1.5 text-xs text-gray-500">
            {a.annee && <span className="bg-gray-100 px-1.5 py-0.5 rounded">{a.annee}</span>}
            {a.kilometrage != null && (
              <span className="bg-gray-100 px-1.5 py-0.5 rounded">{a.kilometrage.toLocaleString("fr-DZ")} km</span>
            )}
            {a.carburant && <span className="bg-gray-100 px-1.5 py-0.5 rounded">{a.carburant}</span>}
            {a.boite && <span className="bg-gray-100 px-1.5 py-0.5 rounded">{a.boite}</span>}
          </div>
          <div className="mt-1 text-xs text-gray-400">{a.wilaya || ""}</div>
        </div>
      </Link>
    </div>
  );
}
