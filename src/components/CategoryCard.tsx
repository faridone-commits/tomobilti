"use client";

import Link from "next/link";

type Props = {
  title: string;
  icon: string;
  color: string;
  link: string;
};

export function CategoryCard({ title, icon, color, link }: Props) {
  return (
    <Link
      href={link}
      className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3 hover:shadow-md transition-shadow group"
    >
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="font-semibold text-sm group-hover:text-primary-600 transition-colors">{title}</p>
        <p className="text-xs text-gray-400">Voir les offres</p>
      </div>
    </Link>
  );
}
