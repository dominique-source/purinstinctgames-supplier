"use client";

import { Award, Puzzle, Zap, SunMedium, Palette } from "lucide-react";
import { useStore } from "@/lib/store";
import { PageFooter } from "./PageFooter";

const FEATURES = [
  { label: "Premium Quality", icon: Award },
  { label: "Easy System", icon: Puzzle },
  { label: "Quick Setup", icon: Zap },
  { label: "Indoor & Outdoor", icon: SunMedium },
  { label: "Custom Branding", icon: Palette },
];

export function CoverPage() {
  const { state, updateDateBadge } = useStore();

  return (
    <div className="flex flex-col min-h-full">
      <div className="bg-ink text-white flex-1 flex flex-col px-6 py-6 md:px-14 md:py-10">
        <div className="flex items-center justify-between">
          <div className="w-9 h-9 flex items-center justify-center border border-lime text-lime font-condensed font-black italic text-lg">
            P
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:block font-body font-bold uppercase text-[11px] tracking-[0.15em] text-graytext">
              Supplier Order &amp; Pricing Request
            </span>
            <span className="bg-lime text-ink font-condensed font-black text-sm px-3 py-1">
              01 / 10
            </span>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center py-16 md:py-24">
          <h1 className="font-condensed font-black italic uppercase text-6xl md:text-8xl lg:text-9xl leading-[0.95] tracking-tight">
            Pürinstinct
            <br />
            <span className="text-lime">Games</span>
          </h1>
          <p className="mt-6 font-condensed font-bold uppercase text-xl md:text-3xl tracking-[0.08em] text-white-90">
            Supplier Order &amp; Pricing Request
          </p>
          <p className="mt-4 max-w-2xl font-body text-graytext text-sm md:text-base">
            Modular sports activation system — required sizes, quantities and
            supplier pricing only
          </p>

          <div className="mt-10 flex items-center gap-3">
            <span className="font-body font-bold uppercase text-[11px] tracking-[0.15em] text-graytext">
              Date
            </span>
            <input
              value={state.cover.dateBadge}
              onChange={(e) => updateDateBadge(e.target.value)}
              className="bg-transparent border border-lime text-lime font-condensed font-black uppercase text-sm tracking-[0.1em] px-4 py-2 text-center focus:outline-none focus:bg-lime-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 md:gap-4 pt-8 border-t border-white-10">
          {FEATURES.map(({ label, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center text-center gap-2">
              <div className="w-11 h-11 rounded-full border border-lime text-lime flex items-center justify-center">
                <Icon className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <span className="font-body font-semibold uppercase text-[11px] tracking-[0.08em] text-white-80">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
      <PageFooter pageNumber={1} />
    </div>
  );
}
