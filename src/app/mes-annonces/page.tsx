import { Suspense } from "react";
import MesAnnoncesContent from "./MesAnnoncesContent";

export default function MesAnnoncesPage() {
  return <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-400">Chargement...</div>}><MesAnnoncesContent /></Suspense>;
}
