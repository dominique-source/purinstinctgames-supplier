"use client";

import { useStore } from "@/lib/store";
import { PageFooter } from "./PageFooter";

export function CoverPage({ exportMode }: { exportMode?: boolean } = {}) {
  const { state, updateDateBadge } = useStore();
  const dateClassName =
    "bg-transparent border border-lime text-lime font-condensed font-black uppercase text-sm tracking-[0.1em] px-4 py-2 text-center focus:outline-none focus:bg-lime-10";

  return (
    <div className="flex flex-col min-h-full">
      <div className="bg-ink flex-1 flex flex-col items-center justify-center px-4 py-6 md:px-10 md:py-8 gap-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/intro.png"
          alt="PürInstinct Games — Supplier Order & Pricing Request"
          className="w-full max-w-5xl"
        />

        <div className="flex items-center gap-3">
          <span className="font-body font-bold uppercase text-[11px] tracking-[0.15em] text-graytext">
            Date
          </span>
          {exportMode ? (
            <div className={dateClassName}>{state.cover.dateBadge}</div>
          ) : (
            <input
              value={state.cover.dateBadge}
              onChange={(e) => updateDateBadge(e.target.value)}
              className={dateClassName}
            />
          )}
        </div>
      </div>
      <PageFooter pageNumber={1} />
    </div>
  );
}
