"use client";

import { useStore } from "@/lib/store";
import { PageFooter } from "./PageFooter";

export function CoverPage({ exportMode }: { exportMode?: boolean } = {}) {
  const { state, updateDateBadge, exchangeRate } = useStore();
  const dateClassName =
    "bg-transparent border border-lime text-lime font-condensed font-black uppercase text-sm tracking-[0.1em] px-4 py-2 text-center focus:outline-none focus:bg-lime-10";

  const rateLabel = exchangeRate.rate
    ? `1 USD = ${exchangeRate.rate.toFixed(4)} CAD`
    : exchangeRate.error
      ? "Rate unavailable"
      : "Loading…";

  return (
    <div className="flex flex-col min-h-full">
      <div className="bg-ink flex-1 flex flex-col items-center justify-center px-4 py-6 md:px-10 md:py-8 gap-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/intro.png"
          alt="PürInstinct Games — Supplier Order & Pricing Request"
          className="w-full max-w-5xl"
        />

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
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

          <div className="flex items-center gap-3">
            <span className="font-body font-bold uppercase text-[11px] tracking-[0.15em] text-graytext">
              Exchange Rate
            </span>
            <div className="flex items-baseline gap-2">
              <span className={dateClassName}>{rateLabel}</span>
              {exchangeRate.asOf && (
                <span className="font-body text-graytext text-[10px] uppercase tracking-[0.05em]">
                  as of {exchangeRate.asOf}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <PageFooter pageNumber={1} />
    </div>
  );
}
