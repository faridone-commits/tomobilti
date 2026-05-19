import { notFound } from "next/navigation";
import { prisma } from "../../../lib/db";
import { ImageCarousel } from "../../../components/ImageCarousel";
import { AnnonceActions } from "../../../components/AnnonceActions";
import { ChatBot } from "../../../components/ChatBot";
import Link from "next/link";
import { formatPrix } from "../../../lib/utils";

type Props = { params: Promise<{ id: string }> };

export default async function AnnonceDetailPage({ params }: Props) {
  const { id } = await params;
  const a = await prisma.annonce.findUnique({ where: { id } });
  if (!a) notFound();

  const images: string[] = JSON.parse(a.images || "[]");
  const date = new Date(a.createdAt).toLocaleDateString("fr-DZ", {
    day: "numeric", month: "long", year: "numeric",
  });

  const whatsappLink = a.telephone
    ? `https://wa.me/213${a.telephone.replace(/^0+/, "")}?text=Bonjour%2C%20je%20suis%20int%C3%A9ress%C3%A9%20par%20votre%20annonce%20%3A%20${encodeURIComponent(a.titre)}`
    : null;

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Link href="/" className="text-sm text-primary-600 hover:underline mb-4 inline-block">
          &larr; Retour aux annonces
        </Link>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <ImageCarousel images={images} />

          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex-1">{a.titre}</h1>
              <p className="text-2xl font-bold text-primary-600 whitespace-nowrap">{formatPrix(a.prix)}</p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {a.annee && <Badge label={String(a.annee)} />}
              {a.kilometrage != null && <Badge label={`${a.kilometrage.toLocaleString("fr-DZ")} km`} />}
              {a.carburant && <Badge label={a.carburant} />}
              {a.boite && <Badge label={a.boite} />}
              {a.marque && <Badge label={a.marque} />}
              {a.modele && <Badge label={a.modele} />}
            </div>

            <div className="mt-4 text-sm text-gray-500">
              <p>{a.wilaya}{a.ville ? ` - ${a.ville}` : ""}</p>
              <p>Publiée le {date}</p>
              {a.id && <p className="mt-1 text-xs">Réf: {a.id.slice(0, 8)}</p>}
            </div>

            {a.description && (
              <div className="mt-4">
                <h3 className="font-medium text-gray-900 text-sm mb-1">Description</h3>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{a.description}</p>
              </div>
            )}

            <div className="mt-6">
              <AnnonceActions telephone={a.telephone} whatsappLink={whatsappLink} titre={a.titre} />
            </div>
          </div>
        </div>
      </div>
      <ChatBot />
    </>
  );
}

function Badge({ label }: { label: string }) {
  return <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded text-xs font-medium">{label}</span>;
}
