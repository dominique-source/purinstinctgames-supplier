"use client";

import { useStore } from "@/lib/store";
import { ACCENT_CLASSES } from "@/lib/accent";
import { PageHeader } from "./PageHeader";
import { PageFooter } from "./PageFooter";
import { PhotoUpload } from "./PhotoUpload";
import { ItemsTable } from "./ItemsTable";
import type { Zone } from "@/lib/types";

export function ZonePage({ zone, exportMode }: { zone: Zone; exportMode?: boolean }) {
  const { setZonePhoto, setZonePhotoCrop } = useStore();
  const accentClasses = ACCENT_CLASSES[zone.accent];

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader title={zone.name} pageNumber={zone.pageNumber} accent={zone.accent} />

      <div className="flex-1 px-6 py-8 md:px-10 md:py-10 space-y-6">
        <PhotoUpload
          photo={zone.photo}
          photoOriginal={zone.photoOriginal}
          onCropped={(photo, photoOriginal) => setZonePhotoCrop(zone.slug, photo, photoOriginal)}
          onRemove={() => setZonePhoto(zone.slug)}
          aspect={21 / 9}
          className="w-full aspect-[21/9] min-h-[220px]"
          exportMode={exportMode}
        />

        <div className="bg-paper border border-offwhite px-6 py-5">
          <h2 className={`font-condensed font-bold uppercase text-xs tracking-[0.15em] ${accentClasses.text}`}>
            Required Size
          </h2>
          <div className="mt-3 flex flex-wrap items-start justify-center gap-x-12 gap-y-4">
            {zone.stats.map((stat) => (
              <div key={stat.caption} className="text-center">
                <div className="font-condensed font-black text-2xl md:text-3xl leading-none">
                  {stat.value}
                </div>
                <div className="mt-1 font-body text-graytext text-xs uppercase tracking-[0.05em]">
                  {stat.caption}
                </div>
              </div>
            ))}
          </div>
          {zone.note && (
            <div className="mt-5 bg-offwhite px-4 py-3 font-body text-graytext text-xs leading-relaxed text-center">
              {zone.note}
            </div>
          )}
        </div>

        <ItemsTable zone={zone} exportMode={exportMode} />
      </div>

      <PageFooter pageNumber={zone.pageNumber} />
    </div>
  );
}
