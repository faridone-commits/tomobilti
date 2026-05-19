"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { formatPrix } from "@/lib/utils";

export default function MesAnnoncesContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [annonces, setAnnonces] = useState<any[]>([]);

  useEffect(() => {
    if (session?.user) fetch("/api/annonces?mine=1").then(r => r.json()).then(setAnnonces).catch(() => {});
  }, [session]);

  async function supprimer(id: string) {
    if (!confirm("Supprimer cette annonce ?")) return;
    const res = await fetch(`/api/annonces/${id}`, { method: "DELETE" });
    if (res.ok) setAnnonces(p => p.filter(a => a.id !== id));
  }

  if (!session?.user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <h1 className="text-xl font-bold mb-4">Connectez-vous pour voir vos annonces</h1>
        <a href="/api/auth/signin" className="bg-primary-600 text-white px-6 py-2 rounded-lg text-sm">Se connecter</a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {searchParams.get("updated") && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2 rounded">Annonce mise à jour</div>
      )}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900">Mes annonces ({annonces.length})</h1>
        <Link href="/deposer" className="bg-primary-600 text-white px-4 py-1.5 rounded text-sm">+ Nouvelle</Link>
      </div>
      {annonces.length === 0 ? (
        <p className="text-center text-gray-400 py-12">Vous n&apos;avez pas encore d&apos;annonces.</p>
      ) : (
        <div className="space-y-3">
          {annonces.map(a => (
            <div key={a.id} className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4">
              <div className="w-20 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                {JSON.parse(a.images || "[]")[0] ? (
                  <img src={JSON.parse(a.images)[0]} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Pas d'image</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/annonce/${a.id}`} className="font-medium text-sm text-gray-900 hover:text-primary-600 line-clamp-1">{a.titre}</Link>
                <p className="text-sm font-bold text-primary-600 mt-0.5">{formatPrix(a.prix)}</p>
                <p className="text-xs text-gray-400">{new Date(a.createdAt).toLocaleDateString("fr-DZ")}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link href={`/annonce/${a.id}/edit`} className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded text-xs hover:bg-gray-200">Modifier</Link>
                <button onClick={() => supprimer(a.id)} className="bg-red-50 text-red-600 px-3 py-1.5 rounded text-xs hover:bg-red-100">Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
