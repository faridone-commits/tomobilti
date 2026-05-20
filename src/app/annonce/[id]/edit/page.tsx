"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { ImageUploader } from "@/components/ImageUploader";
import { WILAYAS, CARBURANTS, BOITES, CATEGORIES, ANNEES } from "@/lib/utils";

export default function EditAnnoncePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newPhotos, setNewPhotos] = useState<File[]>([]);

  useEffect(() => {
    fetch(`/api/annonces/${id}`)
      .then(r => r.json())
      .then(d => {
        setForm({
          titre: d.titre || "",
          description: d.description || "",
          prix: d.prix?.toString() || "",
          marque: d.marque || "",
          modele: d.modele || "",
          annee: d.annee?.toString() || "",
          kilometrage: d.kilometrage?.toString() || "",
          carburant: d.carburant || "",
          boite: d.boite || "",
          wilaya: d.wilaya || "",
          ville: d.ville || "",
          telephone: d.telephone || "",
          categorie: d.categorie || "",
        });
        try { setExistingImages(JSON.parse(d.images || "[]")); } catch { setExistingImages([]); }
      })
      .catch(() => router.push("/mes-annonces"));
  }, [id, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    let allImages = [...existingImages];
    if (newPhotos.length > 0) {
      const fd = new FormData();
      newPhotos.forEach(p => fd.append("photos", p));
      const r = await fetch("/api/upload", { method: "POST", body: fd });
      const d = await r.json();
      if (d.urls) allImages.push(...d.urls);
    }

    const res = await fetch(`/api/annonces/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, images: JSON.stringify(allImages) }),
    });
    if (res.ok) router.push("/mes-annonces?updated=1");
    else alert("Erreur");
    setLoading(false);
  }

  function removeExisting(i: number) {
    setExistingImages(prev => prev.filter((_, idx) => idx !== i));
  }

  if (!session?.user) return <div className="max-w-lg mx-auto px-4 py-20 text-center text-gray-500">Connectez-vous</div>;

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Modifier l&apos;annonce</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
            <input value={form.titre || ""} onChange={set("titre")} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
            <input value={form.marque || ""} onChange={set("marque")} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
            <input value={form.modele || ""} onChange={set("modele")} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prix (DA)</label>
            <input value={form.prix || ""} onChange={set("prix")} type="number" required className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
            <select value={form.annee || ""} onChange={set("annee")} className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
              <option value="">--</option>
              {ANNEES.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kilométrage</label>
            <input value={form.kilometrage || ""} onChange={set("kilometrage")} type="number" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Carburant</label>
            <select value={form.carburant || ""} onChange={set("carburant")} className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
              <option value="">--</option>
              {CARBURANTS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Boîte</label>
            <select value={form.boite || ""} onChange={set("boite")} className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
              <option value="">--</option>
              {BOITES.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
            <select value={form.categorie || ""} onChange={set("categorie")} className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
              <option value="">--</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Wilaya</label>
            <select value={form.wilaya || ""} onChange={set("wilaya")} className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
              <option value="">--</option>
              {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
            <input value={form.ville || ""} onChange={set("ville")} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input value={form.telephone || ""} onChange={set("telephone")} type="tel" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Photos existantes</label>
            <div className="flex flex-wrap gap-2">
              {existingImages.map((url, i) => (
                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeExisting(i)}
                    className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-xs">×</button>
                </div>
              ))}
              {existingImages.length === 0 && <p className="text-xs text-gray-400">Aucune photo</p>}
            </div>
          </div>
          <div className="sm:col-span-2">
            <ImageUploader photos={newPhotos} onChange={setNewPhotos} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description || ""} onChange={set("description")} rows={4} className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-y" />
          </div>
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={loading}
            className="bg-primary-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50">
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
          <button type="button" onClick={() => router.push("/mes-annonces")}
            className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg text-sm hover:bg-gray-200">Annuler</button>
        </div>
      </form>
    </div>
  );
}
