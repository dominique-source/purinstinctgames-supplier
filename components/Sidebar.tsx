"use client";

import { NAV_PAGES } from "@/lib/data";
import { Download, Loader2 } from "lucide-react";

export function Sidebar({
  currentPage,
  onNavigate,
  onExport,
  exporting,
}: {
  currentPage: number;
  onNavigate: (pageNumber: number) => void;
  onExport: () => void;
  exporting: boolean;
}) {
  return (
    <>
      <nav className="hidden md:flex md:flex-col md:w-64 md:shrink-0 bg-ink text-white h-screen sticky top-0">
        <div className="px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center border border-lime text-lime font-condensed font-black italic">
              P
            </div>
            <span className="font-condensed font-black italic uppercase text-sm tracking-wide">
              PürInstinct Games
            </span>
          </div>
        </div>
        <ul className="flex-1 overflow-y-auto py-4">
          {NAV_PAGES.map((p) => (
            <li key={p.slug}>
              <button
                onClick={() => onNavigate(p.pageNumber)}
                className={`w-full text-left px-6 py-2.5 font-body text-sm flex items-center gap-3 border-l-2 ${
                  currentPage === p.pageNumber
                    ? "border-lime text-lime bg-white/5"
                    : "border-transparent text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="font-condensed font-bold text-xs w-5 text-graytext">
                  {String(p.pageNumber).padStart(2, "0")}
                </span>
                {p.label}
              </button>
            </li>
          ))}
        </ul>
        <div className="p-4 border-t border-white/10">
          <button
            onClick={onExport}
            disabled={exporting}
            className="w-full flex items-center justify-center gap-2 bg-lime text-ink font-condensed font-black uppercase text-sm py-3 px-4 disabled:opacity-60"
          >
            {exporting ? (
              <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
            ) : (
              <Download className="w-4 h-4" strokeWidth={1.5} />
            )}
            {exporting ? "Exporting…" : "Export PDF"}
          </button>
        </div>
      </nav>

      <nav className="md:hidden bg-ink text-white sticky top-0 z-20">
        <div className="flex items-center gap-1 overflow-x-auto px-3 py-2">
          {NAV_PAGES.map((p) => (
            <button
              key={p.slug}
              onClick={() => onNavigate(p.pageNumber)}
              className={`shrink-0 font-body text-xs px-3 py-2 whitespace-nowrap ${
                currentPage === p.pageNumber
                  ? "bg-lime text-ink font-bold"
                  : "text-white/70"
              }`}
            >
              {String(p.pageNumber).padStart(2, "0")} {p.label}
            </button>
          ))}
          <button
            onClick={onExport}
            disabled={exporting}
            className="shrink-0 flex items-center gap-1.5 bg-lime text-ink font-condensed font-black uppercase text-xs px-3 py-2 ml-1 disabled:opacity-60"
          >
            {exporting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={1.5} />
            ) : (
              <Download className="w-3.5 h-3.5" strokeWidth={1.5} />
            )}
            Export
          </button>
        </div>
      </nav>
    </>
  );
}
