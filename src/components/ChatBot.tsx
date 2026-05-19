"use client";

import { useState, useRef, useEffect } from "react";

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([
    { role: "bot", text: "👋 Bonjour ! Je suis l'assistant TOMOBILTI. Posez-moi une question sur le site, les annonces, ou la navigation." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(m => [...m, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setMessages(m => [...m, { role: "bot", text: data.reply || data.error || "Désolé, je n'ai pas compris." }]);
    } catch {
      setMessages(m => [...m, { role: "bot", text: "Erreur de connexion. Réessayez." }]);
    }
    setLoading(false);
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-20 right-4 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 flex flex-col">
          <div className="bg-primary-600 text-white px-4 py-3 rounded-t-lg flex items-center justify-between">
            <span className="font-medium text-sm">Assistant TOMOBILTI</span>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white">✕</button>
          </div>
          <div className="h-80 overflow-y-auto p-3 space-y-2 text-sm">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-lg ${m.role === "user" ? "bg-primary-100 text-gray-800" : "bg-gray-100 text-gray-700"}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-gray-400 text-xs">Écrit...</div>}
            <div ref={endRef} />
          </div>
          <div className="border-t border-gray-200 p-2 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Votre message..."
              className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm"
            />
            <button onClick={send} disabled={loading} className="bg-primary-600 text-white px-3 py-1.5 rounded text-sm hover:bg-primary-700 disabled:opacity-50">
              Envoyer
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 right-4 w-12 h-12 bg-primary-600 text-white rounded-full shadow-lg flex items-center justify-center text-xl hover:bg-primary-700 transition-colors z-50"
      >
        {open ? "✕" : "💬"}
      </button>
    </>
  );
}
