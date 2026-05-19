"use client";

import { useState, FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) { setError("Token manquant"); return; }
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setLoading(false); return; }
    setDone(true);
    setLoading(false);
  }

  if (done) return (
    <div className="max-w-sm mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Mot de passe réinitialisé</h1>
      <p className="text-sm text-gray-500 mb-6">Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</p>
      <Link href="/auth/login" className="bg-primary-600 text-white px-6 py-2 rounded-lg text-sm">Se connecter</Link>
    </div>
  );

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">Nouveau mot de passe</h1>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded mb-4">{error}</p>}
        {!token && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded mb-4">Lien invalide.</p>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Nouveau mot de passe" required minLength={6} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          <button type="submit" disabled={loading || !token}
            className="w-full bg-primary-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-primary-700 disabled:opacity-50">
            {loading ? "Réinitialisation..." : "Réinitialiser"}
          </button>
        </form>
      </div>
    </div>
  );
}
