export const WILAYAS = [
  "Adrar","Chlef","Laghouat","Oum El Bouaghi","Batna","Béjaïa","Biskra","Béchar",
  "Blida","Bouira","Tamanrasset","Tébessa","Tlemcen","Tiaret","Tizi Ouzou","Alger",
  "Djelfa","Jijel","Sétif","Saïda","Skikda","Sidi Bel Abbès","Annaba","Guelma",
  "Constantine","Médéa","Mostaganem","M'Sila","Mascara","Ouargla","Oran","Bayadh",
  "Illizi","Bordj Bou Arreridj","Boumerdès","El Tarf","Tindouf","Tissemsilt",
  "El Oued","Khenchela","Souk Ahras","Tipaza","Mila","Aïn Defla","Naâma",
  "Aïn Témouchent","Ghardaïa","Relizane",
];

export const CARBURANTS = ["Essence","Diesel","GPL","Électrique","Hybride"];
export const BOITES = ["Manuelle","Automatique"];
export const CATEGORIES = ["SUV","Berline","Citadine","Break","Cabriolet","Sport","Monospace","4x4"];

export const ANNEE_COURANTE = new Date().getFullYear();
export const ANNEES = Array.from({ length: ANNEE_COURANTE - 1995 + 1 }, (_, i) => ANNEE_COURANTE - i);

export function formatPrix(p: number): string {
  if (p >= 1) return `${p.toLocaleString("fr-DZ")}M DA`;
  return `${(p * 1000).toLocaleString("fr-DZ")}K DA`;
}

export function genererTitre(marque?: string | null, modele?: string | null, annee?: number | null): string {
  const parts = [marque, modele, annee].filter(Boolean);
  return parts.join(" ") || "Annonce automobile";
}
