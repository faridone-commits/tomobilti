"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export function Header() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-1.5">
            <span className="text-primary-600 text-xl font-bold">TOMOBILTI</span>
            <span className="text-[10px] text-gray-400 mt-1">Algérie</span>
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary-600">Accueil</Link>
            <Link href="/deposer" className="hover:text-primary-600">Vendre</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <Link href="/favoris" className="hidden md:block text-gray-500 hover:text-primary-600">❤️ Favoris</Link>
          {session?.user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 text-gray-700 hover:text-primary-600"
              >
                <span className="w-7 h-7 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-bold">
                  {session.user.name?.[0] || session.user.email?.[0] || "U"}
                </span>
                <span className="hidden md:inline">{session.user.name || "Mon compte"}</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-44 z-50">
                  <Link href="/mes-annonces" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-50">Mes annonces</Link>
                  <Link href="/favoris" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-50">Mes favoris</Link>
                  <button onClick={() => { setMenuOpen(false); signOut(); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">Déconnexion</button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/api/auth/signin"
              className="bg-primary-600 text-white px-4 py-1.5 rounded text-sm hover:bg-primary-700"
            >
              Connexion
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
