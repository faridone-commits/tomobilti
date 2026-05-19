"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setLoading(false); return; }
    setSent(true);
    setLoading(false);
  }

  if (sent) return (
    <div className="max-w-sm mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Email envoyé</h1>
      <p className="text-sm text-gray-500 mb-6">Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.</p>
      <Link href="/auth/login" className="text-primary-600 hover:underline text-sm">Retour à la connexion</Link>
    </div>
  );

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">Mot de passe oublié</h1>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Votre email" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
          <button type="submit" disabled={loading}
            className="w-full bg-primary-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-primary-700 disabled:opacity-50">
            {loading ? "Envoi..." : "Envoyer le lien"}
          </button>
        </form>
        <p className="text-xs text-gray-500 text-center mt-4">
          <Link href="/auth/login" className="text-primary-600 hover:underline">Retour à la connexion</Link>
        </p>
      </div>
    </div>
  );
}
