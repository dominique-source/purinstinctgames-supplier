"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Check, X } from "lucide-react";
import { cropImage, type PixelCrop } from "@/lib/cropImage";

const OUTPUT_WIDTH = 1600;

export function PhotoCropModal({
  image,
  aspect,
  onCancel,
  onApply,
}: {
  image: string;
  aspect: number;
  onCancel: () => void;
  onApply: (croppedDataUrl: string) => void | Promise<void>;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelCrop | null>(null);
  const [saving, setSaving] = useState(false);

  const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  async function handleApply() {
    if (!croppedAreaPixels) return;
    setSaving(true);
    try {
      const outputHeight = Math.round(OUTPUT_WIDTH / aspect);
      const result = await cropImage(image, croppedAreaPixels, OUTPUT_WIDTH, outputHeight);
      await onApply(result);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 px-4">
      <div className="w-full max-w-2xl bg-offwhite border border-lime">
        <div className="bg-ink text-white flex items-center justify-between px-5 py-4">
          <h2 className="font-condensed font-black italic uppercase text-lg">
            Reposition Photo
          </h2>
          <button onClick={onCancel} aria-label="Close">
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="relative w-full bg-ink" style={{ aspectRatio: aspect, maxHeight: "60vh" }}>
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            restrictPosition={true}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="px-5 py-4 flex items-center gap-4">
          <span className="font-body font-bold uppercase text-[11px] tracking-[0.15em] text-graytext shrink-0">
            Zoom
          </span>
          <input
            type="range"
            min={1}
            max={4}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-full accent-lime"
          />
        </div>

        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-graytext/30">
          <button
            onClick={onCancel}
            className="font-body font-semibold uppercase text-xs tracking-[0.08em] text-ink hover:text-graytext px-3 py-2"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={!croppedAreaPixels || saving}
            className="flex items-center gap-2 bg-lime text-ink font-condensed font-black uppercase text-sm px-5 py-2.5 disabled:opacity-40"
          >
            <Check className="w-4 h-4" strokeWidth={2} />
            {saving ? "Saving…" : "Apply"}
          </button>
        </div>
      </div>
    </div>
  );
}
