"use client";

import { useRef, useState } from "react";
import { Crop, RotateCcw, Upload } from "lucide-react";
import { downscaleImage } from "@/lib/cropImage";
import { PhotoCropModal } from "./PhotoCropModal";

const MAX_SOURCE_DIMENSION = 2400;
const DEFAULT_IMAGE = "/images/intro.png";
const ASPECT = 4 / 3;

export function CoverImageUpload({
  photo,
  photoOriginal,
  onCropped,
  onReset,
  exportMode,
}: {
  photo: string | null;
  photoOriginal?: string | null;
  onCropped: (photo: string, photoOriginal: string) => void;
  onReset: () => void;
  exportMode?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [cropSource, setCropSource] = useState<string | null>(null);
  const displaySrc = photo ?? DEFAULT_IMAGE;
  const isCustom = !!photo;

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
    setCropSource(photoOriginal || displaySrc);
  }

  return (
    <div className="relative w-full max-w-5xl">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={displaySrc}
        alt="PürInstinct Games — Supplier Order & Pricing Request"
        className="w-full"
      />
      {!exportMode && (
        <div className="absolute top-2 right-2 flex items-center gap-2">
          <button
            onClick={() => inputRef.current?.click()}
            className="w-7 h-7 flex items-center justify-center bg-ink text-white"
            aria-label="Upload new cover image"
            title="Upload new cover image"
          >
            <Upload className="w-4 h-4" strokeWidth={1.5} />
          </button>
          <button
            onClick={openReposition}
            className="w-7 h-7 flex items-center justify-center bg-ink text-white"
            aria-label="Reposition cover image"
            title="Reposition cover image"
          >
            <Crop className="w-4 h-4" strokeWidth={1.5} />
          </button>
          {isCustom && (
            <button
              onClick={onReset}
              className="w-7 h-7 flex items-center justify-center bg-ink text-white"
              aria-label="Reset to default image"
              title="Reset to default image"
            >
              <RotateCcw className="w-4 h-4" strokeWidth={1.5} />
            </button>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
      )}
      {cropSource && (
        <PhotoCropModal
          image={cropSource}
          aspect={ASPECT}
          onCancel={() => setCropSource(null)}
          onApply={(cropped) => {
            onCropped(cropped, cropSource);
            setCropSource(null);
          }}
        />
      )}
    </div>
  );
}
