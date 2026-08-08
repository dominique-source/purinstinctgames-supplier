"use client";

import { useStore } from "@/lib/store";
import { computeGrandTotals } from "@/lib/totals";
import { formatCurrency } from "@/lib/format";
import { PageHeader } from "./PageHeader";
import { PageFooter } from "./PageFooter";

export function QuotationPage() {
  const { state } = useStore();
  const totals = computeGrandTotals(state.zones);

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader title="Final Quotation" pageNumber={10} />

      <div className="flex-1 px-6 py-10 md:px-14 md:py-16 flex flex-col items-center justify-center">
        <div className="grid sm:grid-cols-2 gap-6 w-full max-w-3xl">
          <div className="bg-paper border border-offwhite p-8">
            <h2 className="font-condensed font-bold uppercase text-xs tracking-[0.15em] text-graytext">
              By Air
            </h2>
            <dl className="mt-6 space-y-5">
              <div>
                <dt className="font-body text-graytext text-xs uppercase tracking-[0.05em]">
                  Total USD
                </dt>
                <dd className="font-condensed font-black text-4xl md:text-5xl">
                  {formatCurrency(totals.airUsd)}
                </dd>
              </div>
              <div>
                <dt className="font-body text-graytext text-xs uppercase tracking-[0.05em]">
                  Total CAD
                </dt>
                <dd className="font-condensed font-black text-4xl md:text-5xl">
                  {formatCurrency(totals.airCad)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-paper border border-offwhite p-8">
            <h2 className="font-condensed font-bold uppercase text-xs tracking-[0.15em] text-graytext">
              By Sea
            </h2>
            <dl className="mt-6 space-y-5">
              <div>
                <dt className="font-body text-graytext text-xs uppercase tracking-[0.05em]">
                  Total USD
                </dt>
                <dd className="font-condensed font-black text-4xl md:text-5xl">
                  {formatCurrency(totals.seaUsd)}
                </dd>
              </div>
              <div>
                <dt className="font-body text-graytext text-xs uppercase tracking-[0.05em]">
                  Total CAD
                </dt>
                <dd className="font-condensed font-black text-4xl md:text-5xl">
                  {formatCurrency(totals.seaCad)}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <p className="mt-8 max-w-2xl text-center font-body text-graytext text-xs leading-relaxed">
          Every listed item must have four separate price entries: AIR USD,
          AIR CAD, SEA USD and SEA CAD. Each zone also requires separate AIR
          and SEA totals in both USD and CAD.
        </p>
      </div>

      <PageFooter pageNumber={10} />
    </div>
  );
}
