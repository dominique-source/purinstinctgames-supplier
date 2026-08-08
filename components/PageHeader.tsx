import type { ZoneAccent } from "@/lib/types";
import { ACCENT_CLASSES } from "@/lib/accent";

export function PageHeader({
  title,
  pageNumber,
  accent = "lime",
}: {
  title: string;
  pageNumber: number;
  accent?: ZoneAccent;
}) {
  return (
    <div>
      <div className="bg-ink text-white flex items-center justify-between px-6 py-4 md:px-10">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 flex items-center justify-center border border-lime text-lime font-condensed font-black italic text-lg">
            P
          </div>
          <h1 className="font-condensed font-black italic uppercase text-2xl md:text-3xl tracking-tight">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:block font-body font-bold uppercase text-[11px] tracking-[0.15em] text-graytext">
            Supplier Order &amp; Pricing Request
          </span>
          <span className="bg-lime text-ink font-condensed font-black text-sm px-3 py-1">
            {String(pageNumber).padStart(2, "0")} / 10
          </span>
        </div>
      </div>
      <div className={`h-1 ${ACCENT_CLASSES[accent].bg}`} />
    </div>
  );
}
