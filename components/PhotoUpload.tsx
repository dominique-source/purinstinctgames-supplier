"use client";

import { useRef, useState } from "react";
import { ImagePlus, Crop, X } from "lucide-react";
import { downscaleImage } from "@/lib/cropImage";
import { PhotoCropModal } from "./PhotoCropModal";

const MAX_SOURCE_DIMENSION = 2400;

export function PhotoUpload({
  photo,
  photoOriginal,
  onCropped,
  onRemove,
  aspect = 21 / 9,
  className = "w-full h-full min-h-[220px]",
  exportMode,
}: {
  photo: string | null;
  photoOriginal?: string | null;
  onCropped: (photo: string, photoOriginal: string) => void | Promise<void>;
  onRemove: () => void;
  aspect?: number;
  className?: string;
  exportMode?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [cropSource, setCropSource] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const raw = reader.result as string;
      const downscaled = await downscaleImage(raw, MAX_SOURCE_DIMENSION);
      setCropSource(downscaled);
    };
    reader.readAsDataURL(file);
  }

  function openReposition() {
    setCropSource(photoOriginal || photo);
  }

  if (photo) {
    return (
      <>
        <div className={`relative border border-lime ${className}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo} alt="Zone reference" className="w-full h-full object-cover" />
          {!exportMode && (
            <div className="absolute top-2 right-2 flex items-center gap-2">
              <button
                onClick={openReposition}
                className="w-7 h-7 flex items-center justify-center bg-ink text-white"
                aria-label="Reposition photo"
                title="Reposition photo"
              >
                <Crop className="w-4 h-4" strokeWidth={1.5} />
              </button>
              <button
                onClick={onRemove}
                className="w-7 h-7 flex items-center justify-center bg-ink text-white"
                aria-label="Remove photo"
                title="Remove photo"
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
          )}
        </div>
        {cropSource && (
          <PhotoCropModal
            image={cropSource}
            aspect={aspect}
            onCancel={() => setCropSource(null)}
            onApply={async (cropped) => {
              await onCropped(cropped, cropSource);
              setCropSource(null);
            }}
          />
        )}
      </>
    );
  }

  return (
    <>
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
      {cropSource && (
        <PhotoCropModal
          image={cropSource}
          aspect={aspect}
          onCancel={() => setCropSource(null)}
          onApply={async (cropped) => {
            await onCropped(cropped, cropSource);
            setCropSource(null);
          }}
        />
      )}
    </>
  );
}
