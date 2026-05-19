"use client";

import Link from "next/link";
import { useRef } from "react";

const CATEGORIES = [
  { title: "SUV", link: "/recherche?categorie=SUV", icon: "🚙", desc: "Tout-terrain & urbains" },
  { title: "Berline", link: "/recherche?categorie=Berline", icon: "🚗", desc: "Élégance & confort" },
  { title: "Citadine", link: "/recherche?categorie=Citadine", icon: "🚐", desc: "Pratiques & économiques" },
  { title: "Sport", link: "/recherche?categorie=Sport", icon: "🏎️", desc: "Performance & vitesse" },
  { title: "Break", link: "/recherche?categorie=Break", icon: "🚙", desc: "Espace & polyvalence" },
  { title: "4x4", link: "/recherche?categorie=4x4", icon: "🧗", desc: "Aventures & robustesse" },
  { title: "Électrique", link: "/recherche?carburant=%C3%89lectrique", icon: "⚡", desc: "Zéro émission" },
  { title: "Utilitaire", link: "/recherche?categorie=Utilitaire", icon: "📦", desc: "Travail & transport" },
];

export function CategoryCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  }

  return (
    <div className="relative group">
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-9 h-9 bg-white shadow-md rounded-full flex items-center justify-center text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
      >
        ‹
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-9 h-9 bg-white shadow-md rounded-full flex items-center justify-center text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
      >
        ›
      </button>
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scroll-smooth pb-2 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {CATEGORIES.map(cat => (
          <Link
            key={cat.title}
            href={cat.link}
            className="flex-none w-40 bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg hover:border-primary-200 transition-all group/card"
          >
            <div className="w-11 h-11 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl flex items-center justify-center text-xl mb-3 group-hover/card:scale-110 transition-transform">
              {cat.icon}
            </div>
            <p className="font-semibold text-sm text-gray-900 group-hover/card:text-primary-600 transition-colors">{cat.title}</p>
            <p className="text-xs text-gray-400 mt-0.5">{cat.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
