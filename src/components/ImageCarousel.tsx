"use client";

import { useState } from "react";

export function ImageCarousel({ images }: { images: string[] }) {
  const [idx, setIdx] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-video bg-gray-100 flex items-center justify-center text-gray-400 text-sm rounded-lg">
        Pas d&apos;images
      </div>
    );
  }

  return (
    <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
      <img
        src={images[idx]}
        alt={`Photo ${idx + 1}`}
        className="w-full h-full object-contain"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={() => setIdx(i => (i === 0 ? images.length - 1 : i - 1))}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60 transition-colors text-lg"
          >
            ‹
          </button>
          <button
            onClick={() => setIdx(i => (i === images.length - 1 ? 0 : i + 1))}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60 transition-colors text-lg"
          >
            ›
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`w-2 h-2 rounded-full transition-colors ${i === idx ? "bg-white" : "bg-white/50"}`}
              />
            ))}
          </div>
          <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-0.5 rounded">
            {idx + 1}/{images.length}
          </div>
        </>
      )}
    </div>
  );
}
