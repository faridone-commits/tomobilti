"use client";

type Props = {
  telephone: string | null;
  whatsappLink: string | null;
  titre: string;
};

export function AnnonceActions({ telephone, whatsappLink, titre }: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      {telephone && (
        <a
          href={`tel:${telephone}`}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-700 transition-colors"
        >
          📞 {telephone}
        </a>
      )}
      {whatsappLink && (
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
        >
          💬 WhatsApp
        </a>
      )}
      <button
        onClick={() => {
          if (typeof navigator !== "undefined" && navigator.share) {
            navigator.share({ title: titre, url: window.location.href });
          } else {
            navigator.clipboard?.writeText(window.location.href);
          }
        }}
        className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors"
      >
        🔗 Partager
      </button>
    </div>
  );
}
