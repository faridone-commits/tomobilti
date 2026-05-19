import { prisma } from "../src/lib/db";
import { hashSync } from "bcryptjs";
import fs from "fs";
import path from "path";

const MARQUES: Record<string, string[]> = {
  "Renault": ["Clio", "Symbol", "Megane", "Captur", "Duster", "Kangoo", "Logan", "Sandero", "Talisman", "Koleos", "Espace", "Trafic", "Master", "Zoé", "Twingo"],
  "Hyundai": ["i10", "i20", "i30", "Elantra", "Tucson", "Santa Fe", "Kona", "Accent", "Sonata", "Grandeur", "Creta", "Venue", "Staria", "H-1", "Palisade"],
  "Kia": ["Picanto", "Rio", "Ceed", "Sportage", "Sorento", "Stonic", "Seltos", "Carnival", "Optima", "Cerato", "Niro", "EV6", "Soul", "Mohave"],
  "Dacia": ["Sandero", "Logan", "Duster", "Lodgy", "Dokker", "Jogger", "Spring"],
  "Peugeot": ["208", "308", "508", "2008", "3008", "5008", "Rifter", "Partner", "107", "207", "301", "406", "407", "Boxer", "Expert", "Landtrek"],
  "Toyota": ["Yaris", "Corolla", "RAV4", "Hilux", "Land Cruiser", "CH-R", "Camry", "Avalon", "Fortuner", "Prado", "Hiace", "Supra", "Yaris Cross", "Proace"],
  "Volkswagen": ["Golf", "Polo", "Passat", "Tiguan", "Touareg", "T-Cross", "T-Roc", "Arteon", "Jetta", "Multivan", "Caddy", "Crafter", "Amarok", "Scirocco", "Touran"],
  "Mercedes": ["Classe A", "Classe C", "Classe E", "Classe S", "GLC", "GLE", "Classe G", "GLA", "GLB", "GLS", "Classe B", "Vito", "Sprinter", "AMG GT", "EQC"],
  "BMW": ["Serie 1", "Serie 3", "Serie 5", "Serie 7", "X1", "X3", "X5", "X6", "X7", "Z4", "i4", "iX", "M3", "M5", "X2", "X4"],
  "Chevrolet": ["Spark", "Aveo", "Cruze", "Malibu", "Captiva", "Trailblazer", "Camaro", "Suburban", "Tahoe", "Colorado", "Trax", "Equinox", "Blazer"],
  "Nissan": ["Micra", "Qashqai", "X-Trail", "Patrol", "Navara", "Juke", "Sentra", "Altima", "Pathfinder", "Armada", "Leaf", "Note", "370Z", "GT-R"],
  "MG": ["MG3", "MG5", "ZS", "HS", "Marvel R", "MG6", "RX5", "MG4", "MG EHS"],
  "Fiat": ["Panda", "500", "Punto", "Tipo", "Doblo", "Ducato", "500X", "500L", "Bravo", "Fiorino", "Strada"],
  "Ford": ["Fiesta", "Focus", "Kuga", "Ranger", "EcoSport", "Transit", "Mustang", "Explorer", "F-150", "Everest", "Tourneo", "Galaxy", "Mondeo"],
  "Honda": ["Civic", "HR-V", "CR-V", "Accord", "Jazz", "City", "Pilot", "Odyssey"],
  "Mitsubishi": ["Outlander", "Pajero", "L200", "ASX", "Lancer", "Space Star", "Eclipse Cross", "Montero"],
  "Suzuki": ["Swift", "Vitara", "Jimny", "S-Cross", "Alto", "Baleno", "Celerio", "Ignis", "Grand Vitara"],
  "Audi": ["A1", "A3", "A4", "A6", "A8", "Q3", "Q5", "Q7", "Q8", "e-tron", "TT", "R8", "RS3", "RS6"],
  "Jeep": ["Renegade", "Compass", "Cherokee", "Grand Cherokee", "Wrangler", "Gladiator", "Avenger"],
  "Citroën": ["C1", "C3", "C4", "C5", "C8", "Berlingo", "Jumpy", "Jumper", "DS3", "DS4", "DS7", "C4 Picasso", "C5 Aircross"],
  "Mazda": ["2", "3", "6", "CX-3", "CX-5", "CX-60", "MX-5", "RX-8", "CX-30"],
  "Opel": ["Corsa", "Astra", "Insignia", "Mokka", "Crossland", "Grandland", "Combo", "Vivaro", "Zafira"],
  "Seat": ["Ibiza", "Leon", "Arona", "Ateca", "Tarraco", "Alhambra", "Mii"],
  "Skoda": ["Fabia", "Octavia", "Superb", "Kamiq", "Karoq", "Kodiaq", "Scala", "Enyaq"],
  "Land Rover": ["Range Rover", "Range Rover Sport", "Range Rover Evoque", "Range Rover Velar", "Discovery", "Discovery Sport", "Defender", "Freelander"],
  "Volvo": ["XC40", "XC60", "XC90", "S60", "S90", "V60", "V90", "C40"],
  "Porsche": ["911", "Cayenne", "Macan", "Panamera", "Taycan", "Cayman", "Boxster"],
  "Lexus": ["UX", "NX", "RX", "ES", "IS", "LS", "LX", "GX", "LM"],
  "Mini": ["Cooper", "Countryman", "Clubman", "Cabrio"],
  "Subaru": ["Impreza", "Forester", "Outback", "XV", "Legacy", "BRZ"],
  "Haval": ["H6", "H2", "H9", "Jolion", "Dargo"],
  "Chery": ["Arrizo 5", "Arrizo 6", "Tiggo 2", "Tiggo 4", "Tiggo 7", "Tiggo 8", "QQ"],
  "DFSK": ["Glory 580", "Glory 500", "Seres 3", "Fengon", "Aixia"],
};

const WILAYAS = [
  "Alger","Oran","Constantine","Annaba","Blida","Sétif","Tizi Ouzou","Béjaïa","Tlemcen","Chlef",
  "Batna","Biskra","Tébessa","Djelfa","Médéa","Mostaganem","M'Sila","Ouargla","Saïda","Skikda",
  "Tiaret","Bouira","Béchar","Adrar","Boumerdès","Sidi Bel Abbès",
];

const CARBURANTS = ["Essence","Diesel","GPL","Électrique","Hybride"];
const BOITES = ["Manuelle","Automatique"];
const CATEGORIES = ["SUV","Berline","Citadine","Break","Sport","4x4"];
const DESCRIPTIONS = [
  "Très bon état, entretien régulier, première main. Factures disponibles.",
  "Véhicule en parfait état, révision récente, pneus neufs. Propriétaire unique.",
  "Occasion en excellent état, intérieur propre, carrosserie impeccable.",
  "Véhicule bien entretenu, vidange faite, courroie de distribution changée.",
  "Très bonne voiture, clim, direction assistée, vitres électriques.",
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  // Admin
  await prisma.admin.upsert({
    where: { email: "admin@tomobilti.dz" },
    update: {},
    create: {
      email: "admin@tomobilti.dz",
      password: hashSync("admin2026", 10),
      nom: "Admin TOMOBILTI",
    },
  });

  // Marques et modèles
  for (const [marque, modeles] of Object.entries(MARQUES)) {
    await prisma.marque.upsert({
      where: { nom: marque },
      update: {},
      create: { nom: marque, actif: true },
    });

    const dbMarque = await prisma.marque.findUnique({ where: { nom: marque } });
    if (!dbMarque) continue;

    for (const modele of modeles) {
      await prisma.modele.upsert({
        where: { nom_marqueId: { nom: modele, marqueId: dbMarque.id } },
        update: {},
        create: { nom: modele, marqueId: dbMarque.id },
      });
    }
  }

  // Annonces d'exemple
  const annoncesCount = await prisma.annonce.count();
  if (annoncesCount === 0) {
    const allMarques = Object.keys(MARQUES);
    const CAR_IMAGES: Record<string, string> = {
      "Renault": "/cars/Renault.jpg",
      "Hyundai": "/cars/Hyundai.jpg",
      "Kia": "/cars/Kia.jpg",
      "Dacia": "/cars/Dacia.jpg",
      "Peugeot": "/cars/Peugeot.jpg",
      "Toyota": "/cars/Toyota.jpg",
      "Volkswagen": "/cars/Volkswagen.jpg",
      "Mercedes": "/cars/Mercedes.jpg",
      "BMW": "/cars/BMW.jpg",
      "Chevrolet": "/cars/Chevrolet.jpg",
      "Nissan": "/cars/Nissan.jpg",
      "MG": "/cars/MG.jpg",
      "Fiat": "/cars/Fiat.jpg",
      "Ford": "/cars/Ford.jpg",
      "Honda": "/cars/Honda.jpg",
      "Mitsubishi": "/cars/Mitsubishi.jpg",
      "Suzuki": "/cars/Suzuki.jpg",
      "Audi": "/cars/Audi.jpg",
      "Jeep": "/cars/Jeep.jpg",
      "Citroën": "/cars/Citroën.jpg",
      "Mazda": "/cars/Mazda.jpg",
      "Opel": "/cars/Opel.jpg",
      "Seat": "/cars/Seat.jpg",
      "Skoda": "/cars/Skoda.jpg",
      "Land Rover": "/cars/Land Rover.jpg",
      "Volvo": "/cars/Volvo.jpg",
      "Porsche": "/cars/Porsche.jpg",
      "Lexus": "/cars/Lexus.jpg",
      "Mini": "/cars/Mini.jpg",
      "Subaru": "/cars/Subaru.jpg",
      "Haval": "/cars/Haval.jpg",
      "Chery": "/cars/Chery.jpg",
    };

    for (let i = 0; i < 24; i++) {
      const marque = randomItem(allMarques);
      const modele = randomItem(MARQUES[marque]);
      const annee = randomItem([2020, 2021, 2022, 2023, 2024, 2025, 2026]);
      const prix = randomItem([45, 55, 65, 75, 85, 100, 120, 150, 180, 200, 250, 300]);
      const km = randomItem([10000, 20000, 30000, 40000, 50000, 60000, 80000, 100000]);
      const carburant = randomItem(CARBURANTS);
      const boite = randomItem(BOITES);
      const wilaya = randomItem(WILAYAS);
      const categorie = randomItem(CATEGORIES);
      const brandImage = CAR_IMAGES[marque];
      const images = brandImage ? [brandImage] : [];

      await prisma.annonce.create({
        data: {
          titre: `${marque} ${modele} ${annee}`,
          description: randomItem(DESCRIPTIONS),
          prix: prix,
          marque,
          modele,
          annee,
          kilometrage: km,
          carburant,
          boite,
          wilaya,
          ville: wilaya,
          telephone: `055${String(Math.floor(100000 + Math.random() * 900000))}`,
          images: JSON.stringify(images),
          categorie,
        },
      });
    }
  }

  console.log("✅ Admin créé (admin@tomobilti.dz / admin2026)");
  console.log("✅ Marques et modèles créés");
  console.log("✅ Annonces d'exemple créées");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
