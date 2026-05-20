"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export function Header() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  function closeMobile() {
    setMobileNavOpen(false);
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5">
          <span className="text-primary-600 text-xl font-bold">TOMOBILTI</span>
          <span className="text-[10px] text-gray-400 mt-1">Algérie</span>
        </Link>

        <nav className="hidden md:flex items-center gap-4 text-sm text-gray-600">
          <Link href="/" className="hover:text-primary-600">Accueil</Link>
          <Link href="/deposer" className="hover:text-primary-600">Vendre</Link>
          <Link href="/favoris" className="hover:text-primary-600">Favoris</Link>
        </nav>

        <div className="flex items-center gap-2 md:gap-3 text-sm">
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 text-gray-600 active:text-primary-600"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileNavOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {session?.user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 text-gray-700 active:text-primary-600"
              >
                <span className="w-7 h-7 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-bold">
                  {session.user.name?.[0] || session.user.email?.[0] || "U"}
                </span>
                <span className="hidden md:inline">{session.user.name || "Mon compte"}</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-44 z-50">
                  <Link href="/mes-annonces" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-gray-50">Mes annonces</Link>
                  <Link href="/favoris" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-gray-50">Mes favoris</Link>
                  <button onClick={() => { setMenuOpen(false); signOut(); }} className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-gray-50">Déconnexion</button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="bg-primary-600 text-white px-4 py-1.5 rounded text-sm hover:bg-primary-700 active:bg-primary-800"
            >
              Connexion
            </Link>
          )}
        </div>
      </div>

      {mobileNavOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white shadow-lg" style={{ zIndex: 60 }}>
          <div className="max-w-7xl mx-auto px-4 py-2 divide-y divide-gray-100">
            <div className="py-1 space-y-0.5">
              <Link href="/" onClick={closeMobile} className="block px-3 py-3 text-sm text-gray-700 rounded-lg active:bg-gray-100">Accueil</Link>
              <Link href="/deposer" onClick={closeMobile} className="block px-3 py-3 text-sm text-gray-700 rounded-lg active:bg-gray-100">Vendre</Link>
              <Link href="/favoris" onClick={closeMobile} className="block px-3 py-3 text-sm text-gray-700 rounded-lg active:bg-gray-100">Favoris</Link>
            </div>
            {session?.user && (
              <div className="py-1 space-y-0.5">
                <Link href="/mes-annonces" onClick={closeMobile} className="block px-3 py-3 text-sm text-gray-700 rounded-lg active:bg-gray-100">Mes annonces</Link>
                <button onClick={() => { closeMobile(); signOut(); }} className="block w-full text-left px-3 py-3 text-sm text-red-600 rounded-lg active:bg-red-50">Déconnexion</button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
