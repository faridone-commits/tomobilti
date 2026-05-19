"use client";

import { useState, useEffect } from "react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookies-accepted");
    if (!accepted) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem("cookies-accepted", "true");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 text-white px-4 py-4 shadow-lg">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-4">
        <p className="text-sm flex-1">
          En poursuivant votre navigation sur Tomobilti, vous acceptez l&apos;utilisation de cookies
          nécessaires au fonctionnement du site et à la personnalisation du contenu.
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={accept}
            className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors"
          >
            Accepter
          </button>
          <button
            onClick={accept}
            className="border border-gray-500 hover:border-gray-400 text-gray-300 hover:text-white text-sm px-6 py-2 rounded-lg transition-colors"
          >
            Refuser
          </button>
        </div>
      </div>
    </div>
  );
}
