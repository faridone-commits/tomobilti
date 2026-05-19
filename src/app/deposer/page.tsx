"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ImageUploader } from "../../components/ImageUploader";
import { WILAYAS, CARBURANTS, BOITES, CATEGORIES, ANNEES } from "../../lib/utils";

export default function DeposserPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [marque, setMarque] = useState("");
  const [modele, setModele] = useState("");
  const [allMarques, setAllMarques] = useState<string[]>([]);
  const [allModeles, setAllModeles] = useState<string[]>([]);
  const [showMarque, setShowMarque] = useState(false);
  const [showModele, setShowModele] = useState(false);
  const marqueRef = useRef<HTMLDivElement>(null);
  const modeleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/marques").then(r => r.json()).then(setAllMarques).catch(() => {});
  }, []);

  useEffect(() => {
    if (marque) {
      fetch(`/api/modeles?marque=${encodeURIComponent(marque)}`)
        .then(r => r.json()).then(setAllModeles).catch(() => {});
    } else {
      setAllModeles([]);
    }
  }, [marque]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (marqueRef.current && !marqueRef.current.contains(e.target as Node)) setShowMarque(false);
      if (modeleRef.current && !modeleRef.current.contains(e.target as Node)) setShowModele(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!session?.user) { router.push("/api/auth/signin"); return; }
    setSubmitting(true);
    const form = new FormData(e.currentTarget);
    const data: Record<string, unknown> = {};
    for (const [k, v] of form.entries()) if (k !== "photos") data[k] = v;
    const uploadedUrls: string[] = [];
    if (photos.length > 0) {
      const f = new FormData();
      photos.forEach(p => f.append("photos", p));
      const r = await fetch("/api/upload", { method: "POST", body: f });
      const d = await r.json();
      if (d.urls) uploadedUrls.push(...d.urls);
    }
    data.images = JSON.stringify(uploadedUrls);
    data.prix = parseFloat(data.prix as string);
    data.annee = data.annee ? parseInt(data.annee as string) : null;
    data.kilometrage = data.kilometrage ? parseInt(data.kilometrage as string) : null;
    const res = await fetch("/api/annonces", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (res.ok) router.push("/?posted=1");
    else { alert("Erreur lors de la publication"); setSubmitting(false); }
  }

  if (!session?.user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <h1 className="text-xl font-bold mb-4">Connectez-vous pour déposer une annonce</h1>
        <a href="/api/auth/signin" className="bg-primary-600 text-white px-6 py-2 rounded-lg text-sm">Se connecter</a>
      </div>
    );
  }

  const marqueList = marque
    ? allMarques.filter(m => m.toLowerCase().includes(marque.toLowerCase())).slice(0, 10)
    : allMarques.slice(0, 10);
  const modeleList = modele
    ? allModeles.filter(m => m.toLowerCase().includes(modele.toLowerCase())).slice(0, 10)
    : allModeles.slice(0, 10);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Déposer une annonce</h1>
      <p className="text-sm text-gray-500 mb-6">Publiez gratuitement votre annonce automobile.</p>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
            <input name="titre" required className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
            <div ref={marqueRef} className="relative">
              <input value={marque} onChange={e => setMarque(e.target.value)} onFocus={() => setShowMarque(true)}
                placeholder="ex: Renault" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
              {showMarque && marqueList.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg z-20 max-h-40 overflow-y-auto">
                  {marqueList.map(s => (
                    <button key={s} type="button" className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50"
                      onClick={() => { setMarque(s); setShowMarque(false); setModele(""); }}>{s}</button>
                  ))}
                </div>
              )}
            </div>
            <input type="hidden" name="marque" value={marque} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
            <div ref={modeleRef} className="relative">
              <input value={modele} onChange={e => setModele(e.target.value)} onFocus={() => setShowModele(true)}
                placeholder="ex: Clio" disabled={!marque}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm disabled:opacity-50" />
              {showModele && modeleList.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg z-20 max-h-40 overflow-y-auto">
                  {modeleList.map(s => (
                    <button key={s} type="button" className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50"
                      onClick={() => { setModele(s); setShowModele(false); }}>{s}</button>
                  ))}
                </div>
              )}
            </div>
            <input type="hidden" name="modele" value={modele} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prix (DA)</label>
            <input name="prix" type="number" required placeholder="ex: 1500000" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
            <select name="annee" className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
              <option value="">--</option>
              {ANNEES.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kilométrage</label>
            <input name="kilometrage" type="number" placeholder="ex: 50000" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Carburant</label>
            <select name="carburant" className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
              <option value="">--</option>
              {CARBURANTS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Boîte</label>
            <select name="boite" className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
              <option value="">--</option>
              {BOITES.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
            <select name="categorie" className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
              <option value="">--</option>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Wilaya</label>
            <select name="wilaya" className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
              <option value="">--</option>
              {WILAYAS.map(w => <option key={w}>{w}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
            <input name="ville" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input name="telephone" type="tel" placeholder="ex: 0555123456" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
          </div>
          <div className="sm:col-span-2">
            <ImageUploader photos={photos} onChange={setPhotos} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" rows={4} className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-y" />
          </div>
        </div>
        <button type="submit" disabled={submitting} className="bg-primary-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50">
          {submitting ? "Publication..." : "Publier l'annonce"}
        </button>
      </form>
    </div>
  );
}
