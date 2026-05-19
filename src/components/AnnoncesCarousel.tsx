"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { formatPrix } from "@/lib/utils";
import { getCarImage } from "@/lib/carImages";

type Annonce = {
  id: string;
  titre: string;
  prix: number;
  images: string;
  marque: string | null;
  modele: string | null;
  annee: number | null;
  kilometrage: number | null;
  wilaya: string | null;
};

export function AnnoncesCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [annonces, setAnnonces] = useState<Annonce[]>([]);

  useEffect(() => {
    fetch("/api/annonces?perBrand=1")
      .then(r => r.json())
      .then(setAnnonces)
      .catch(() => {});
  }, []);

  function scroll(dir: "left" | "right") {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -340 : 340, behavior: "smooth" });
  }

  if (annonces.length === 0) return null;

  return (
    <div className="relative group">
      <button onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-9 h-9 bg-white shadow-md rounded-full flex items-center justify-center text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50 text-lg"
      >‹</button>
      <button onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-9 h-9 bg-white shadow-md rounded-full flex items-center justify-center text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50 text-lg"
      >›</button>
      <div ref={scrollRef} className="flex gap-3 overflow-x-auto scroll-smooth pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {annonces.map(a => {
          const brandImage = getCarImage(a.marque || "");
          return (
            <Link key={a.id} href={`/annonce/${a.id}`}
              className="flex-none w-[320px] bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group/card"
            >
              <div className="aspect-[16/10] bg-gray-100 relative overflow-hidden">
                {brandImage ? (
                  <img src={brandImage} alt={a.titre}
                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Pas d'image</div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <p className="text-white font-bold text-sm">{formatPrix(a.prix)}</p>
                </div>
              </div>
              <div className="p-3">
                <p className="font-semibold text-sm text-gray-900 line-clamp-1 group-hover/card:text-primary-600 transition-colors">
                  {a.marque} {a.modele} {a.annee}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{a.wilaya || ""}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
