"use client";

import Link from "next/link";

const BRANDS = [
  "Renault", "Hyundai", "Kia", "Dacia", "Peugeot", "Toyota",
  "Volkswagen", "Mercedes", "BMW", "Chevrolet", "Nissan", "MG",
  "Fiat", "Ford", "Honda", "Mitsubishi", "Suzuki", "Audi",
  "Jeep", "Citroën", "Mazda", "Opel", "Seat", "Skoda",
  "Land Rover", "Volvo", "Porsche", "Lexus", "Mini", "Subaru",
  "Haval", "Chery", "DFSK",
];

export function BrandGrid() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-3">
      {BRANDS.map(brand => (
        <Link
          key={brand}
          href={`/recherche?marque=${encodeURIComponent(brand)}`}
          className="bg-white rounded-lg border border-gray-200 p-3 flex flex-col items-center gap-1.5 hover:shadow-md hover:border-primary-300 transition-all group"
        >
          <div className="w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <img
              src={`/brands/${encodeURIComponent(brand)}.png`}
              alt={brand}
              className="w-9 h-9 object-contain"
              onError={e => {
                (e.target as HTMLImageElement).style.display = "none";
                (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
              }}
            />
            <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-500 hidden">
              {brand[0]}
            </div>
          </div>
          <span className="text-[10px] text-center text-gray-600 group-hover:text-primary-600 transition-colors leading-tight font-medium">
            {brand}
          </span>
        </Link>
      ))}
    </div>
  );
}
