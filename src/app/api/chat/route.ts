import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const SYSTEM_PROMPT = `Tu es un assistant virtuel pour le site TOMOBILTI, un marché automobile algérien.
Tu aides les utilisateurs à naviguer, comprendre les fonctionnalités du site, déposer des annonces, etc.
Réponds de manière concise et en français. Si on te demande des choses hors-sujet, ramène la conversation sur l'automobile ou le site.`;

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    if (!message) return NextResponse.json({ reply: "Bonjour ! Comment puis-je vous aider ?" });

    if (!GEMINI_API_KEY) {
      const replies = [
        "Vous pouvez déposer une annonce gratuitement depuis la page 'Vendre'.",
        "Pour contacter un vendeur, utilisez le bouton WhatsApp ou téléphone sur l'annonce.",
        "Les annonces sont triées par date de publication. Utilisez les filtres pour affiner votre recherche.",
        "Vous pouvez gérer vos annonces depuis votre profil, rubrique 'Mes annonces'.",
        "Les photos sont redimensionnées automatiquement si elles dépassent 500 Ko.",
      ];
      return NextResponse.json({ reply: replies[Math.floor(Math.random() * replies.length)] });
    }

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
          { role: "model", parts: [{ text: "Compris. Je suis l'assistant TOMOBILTI." }] },
          { role: "user", parts: [{ text: message }] },
        ],
      }),
    });

    const data = await res.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Désolé, je n'ai pas compris.";
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ reply: "Désolé, erreur de connexion. Réessayez plus tard." });
  }
}
