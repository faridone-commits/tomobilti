"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { WILAYAS, CARBURANTS, ANNEES } from "../lib/utils";

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [marque, setMarque] = useState(searchParams.get("marque") || "");
  const [modele, setModele] = useState(searchParams.get("modele") || "");
  const [wilaya, setWilaya] = useState(searchParams.get("wilaya") || "");
  const [anneeMin, setAnneeMin] = useState(searchParams.get("anneeMin") || "");
  const [prixMax, setPrixMax] = useState(searchParams.get("prixMax") || "");
  const [carburant, setCarburant] = useState(searchParams.get("carburant") || "");

  const [marques, setMarques] = useState<string[]>([]);
  const [marqueSuggestions, setMarqueSuggestions] = useState<string[]>([]);
  const [showMarqueList, setShowMarqueList] = useState(false);
  const marqueRef = useRef<HTMLDivElement>(null);

  const [modeles, setModeles] = useState<string[]>([]);
  const [modeleSuggestions, setModeleSuggestions] = useState<string[]>([]);
  const [showModeleList, setShowModeleList] = useState(false);
  const modeleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/marques").then(r => r.json()).then(setMarques).catch(() => {});
  }, []);

  useEffect(() => {
    if (marque) {
      fetch(`/api/modeles?marque=${encodeURIComponent(marque)}`)
        .then(r => r.json()).then(setModeles).catch(() => {});
    } else {
      setModeles([]);
    }
  }, [marque]);

  useEffect(() => {
    if (modele.length > 0) {
      setModeleSuggestions(modeles.filter(m => m.toLowerCase().includes(modele.toLowerCase())));
      setShowModeleList(true);
    } else {
      setModeleSuggestions(modeles);
      setShowModeleList(modeles.length > 0);
    }
  }, [modele, modeles]);

  useEffect(() => {
    if (marque.length > 0) {
      setMarqueSuggestions(marques.filter(m => m.toLowerCase().includes(marque.toLowerCase())));
      setShowMarqueList(true);
    } else {
      setMarqueSuggestions(marques);
    }
  }, [marque, marques]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (marqueRef.current && !marqueRef.current.contains(e.target as Node)) setShowMarqueList(false);
      if (modeleRef.current && !modeleRef.current.contains(e.target as Node)) setShowModeleList(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function search() {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (marque) params.set("marque", marque);
    if (modele) params.set("modele", modele);
    if (wilaya) params.set("wilaya", wilaya);
    if (anneeMin) params.set("anneeMin", anneeMin);
    if (prixMax) params.set("prixMax", prixMax);
    if (carburant) params.set("carburant", carburant);
    router.push(`/recherche?${params.toString()}`);
  }

  return (
    <div className="bg-gray-150 rounded-lg shadow-sm border border-gray-300 p-4 space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
        <input value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === "Enter" && search()}
          placeholder="Mot-clé..." className="col-span-2 md:col-span-1 border border-gray-300 rounded px-3 py-2 text-sm" />

        <div ref={marqueRef} className="relative">
          <input value={marque} onChange={e => setMarque(e.target.value)} onFocus={() => setShowMarqueList(true)}
            placeholder="Marque" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
          {showMarqueList && marqueSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg z-20 max-h-60 overflow-y-auto">
              {marqueSuggestions.map(m => (
                <button key={m} type="button" className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50"
                  onClick={() => { setMarque(m); setShowMarqueList(false); }}>{m}</button>
              ))}
            </div>
          )}
        </div>

        <div ref={modeleRef} className="relative">
          <input value={modele} onChange={e => setModele(e.target.value)} onFocus={() => setShowModeleList(true)}
            placeholder="Modèle" disabled={!marque}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm disabled:opacity-50" />
          {showModeleList && modeleSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg z-20 max-h-60 overflow-y-auto">
              {modeleSuggestions.map(m => (
                <button key={m} type="button" className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50"
                  onClick={() => { setModele(m); setShowModeleList(false); }}>{m}</button>
              ))}
            </div>
          )}
        </div>

        <select value={wilaya} onChange={e => setWilaya(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm">
          <option value="">Wilaya</option>
          {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
        </select>
        <select value={carburant} onChange={e => setCarburant(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm">
          <option value="">Carburant</option>
          {CARBURANTS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={anneeMin} onChange={e => setAnneeMin(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm">
          <option value="">Année min</option>
          {ANNEES.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <input value={prixMax} onChange={e => setPrixMax(e.target.value)} type="number"
          placeholder="Prix max (M DA)" className="border border-gray-300 rounded px-3 py-2 text-sm [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
      </div>
      <button onClick={search} className="bg-primary-600 text-white px-5 py-2 rounded text-sm hover:bg-primary-700 transition-colors font-medium">
        Rechercher
      </button>
    </div>
  );
}
