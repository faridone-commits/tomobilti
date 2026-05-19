"use client";

import { useState, useRef } from "react";

const MAX_PHOTOS = 8;
const MAX_SIZE_KB = 500;

function resizeImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let { width, height } = img;
      if (width > 1200) {
        height = (height / width) * 1200;
        width = 1200;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(blob => {
        if (blob) resolve(blob);
        else reject(new Error("Compression failed"));
      }, "image/jpeg", 0.8);
    };
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = URL.createObjectURL(file);
  });
}

type Props = {
  photos: File[];
  onChange: (files: File[]) => void;
};

export function ImageUploader({ photos, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [processing, setProcessing] = useState(false);

  async function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (photos.length + files.length > MAX_PHOTOS) {
      alert(`Maximum ${MAX_PHOTOS} photos`);
      return;
    }
    setProcessing(true);
    const processed: File[] = [];
    for (const file of files) {
      if (file.size > MAX_SIZE_KB * 1024) {
        const blob = await resizeImage(file);
        processed.push(new File([blob], file.name, { type: "image/jpeg" }));
      } else {
        processed.push(file);
      }
    }
    onChange([...photos, ...processed]);
    setProcessing(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function remove(idx: number) {
    onChange(photos.filter((_, i) => i !== idx));
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Photos ({photos.length}/{MAX_PHOTOS})
      </label>
      <div className="flex flex-wrap gap-2 mb-2">
        {photos.map((f, i) => (
          <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
            <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-xs"
            >
              ×
            </button>
          </div>
        ))}
        {photos.length < MAX_PHOTOS && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={processing}
            className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-2xl text-gray-400 hover:border-primary-400 hover:text-primary-500 transition-colors disabled:opacity-50"
          >
            +
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleSelect}
      />
      <p className="text-xs text-gray-400">
        JPG/PNG, max {MAX_SIZE_KB}KB par photo (redimensionnement automatique)
      </p>
    </div>
  );
}
