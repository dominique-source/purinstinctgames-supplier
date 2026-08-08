"use client";

import { X } from "lucide-react";
import { NAV_PAGES } from "@/lib/data";

export function ExportDialog({
  selectedPages,
  onToggle,
  onSelectAll,
  onSelectNone,
  onConfirm,
  onCancel,
}: {
  selectedPages: Set<number>;
  onToggle: (pageNumber: number) => void;
  onSelectAll: () => void;
  onSelectNone: () => void;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const count = selectedPages.size;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 px-4">
      <div className="w-full max-w-md bg-offwhite border border-lime">
        <div className="bg-ink text-white flex items-center justify-between px-5 py-4">
          <h2 className="font-condensed font-black italic uppercase text-lg">
            Choose Pages to Export
          </h2>
          <button onClick={onCancel} aria-label="Close">
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="px-5 py-4">
          <div className="flex items-center gap-4 pb-3 mb-2 border-b border-graytext/30">
            <button
              onClick={onSelectAll}
              className="font-body font-semibold uppercase text-xs tracking-[0.08em] text-ink hover:text-graytext"
            >
              Select All
            </button>
            <button
              onClick={onSelectNone}
              className="font-body font-semibold uppercase text-xs tracking-[0.08em] text-ink hover:text-graytext"
            >
              Select None
            </button>
          </div>

          <ul className="max-h-80 overflow-y-auto">
            {NAV_PAGES.map((p) => (
              <li key={p.slug}>
                <label className="flex items-center gap-3 py-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedPages.has(p.pageNumber)}
                    onChange={() => onToggle(p.pageNumber)}
                    className="w-4 h-4 accent-lime"
                  />
                  <span className="font-condensed font-bold text-xs text-graytext w-5">
                    {String(p.pageNumber).padStart(2, "0")}
                  </span>
                  <span className="font-body text-sm text-ink">{p.label}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-t border-graytext/30">
          <span className="font-body text-xs text-graytext uppercase tracking-[0.08em]">
            {count} of {NAV_PAGES.length} selected
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="font-body font-semibold uppercase text-xs tracking-[0.08em] text-ink hover:text-graytext px-3 py-2"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={count === 0}
              className="bg-lime text-ink font-condensed font-black uppercase text-sm px-5 py-2.5 disabled:opacity-40"
            >
              Export {count > 0 ? `${count} Page${count > 1 ? "s" : ""}` : ""}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
