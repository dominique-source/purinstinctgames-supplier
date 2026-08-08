"use client";

import { useRef } from "react";
import { ImagePlus, X } from "lucide-react";

export function PhotoUpload({
  photo,
  onChange,
  className = "w-full h-full min-h-[220px]",
}: {
  photo: string | null;
  onChange: (dataUrl: string | null) => void;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  }

  if (photo) {
    return (
      <div className={`relative border border-lime ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo} alt="Zone reference" className="w-full h-full object-cover" />
        <button
          onClick={() => onChange(null)}
          className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-ink text-white"
          aria-label="Remove photo"
        >
          <X className="w-4 h-4" strokeWidth={1.5} />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => inputRef.current?.click()}
      className={`border border-dashed border-lime flex flex-col items-center justify-center gap-3 text-graytext hover:text-ink ${className}`}
    >
      <ImagePlus className="w-8 h-8 text-lime" strokeWidth={1.5} />
      <span className="font-body font-semibold uppercase text-xs tracking-[0.1em]">
        Add reference photo
      </span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </button>
  );
}
