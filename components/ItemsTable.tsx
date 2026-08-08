"use client";

import { Plus, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { computeZoneTotals } from "@/lib/totals";
import { formatCurrency } from "@/lib/format";
import { ACCENT_CLASSES } from "@/lib/accent";
import { CurrencyInput } from "./CurrencyInput";
import type { Zone } from "@/lib/types";

const HEAD_CELL = "px-3 py-3 text-left font-body font-bold uppercase text-[11px] tracking-[0.08em]";
const CELL = "px-3 py-2 border-b border-offwhite";
const TEXT_INPUT = "w-full bg-transparent font-body text-sm py-1 focus:outline-none focus:bg-offwhite";
const NUM_INPUT = "w-16 bg-transparent font-body text-sm py-1 text-right focus:outline-none focus:bg-offwhite";
const PRICE_INPUT = "w-24 bg-transparent font-body text-sm py-1 text-right focus:outline-none focus:bg-offwhite";

function TextField({
  exportMode,
  value,
  onChange,
  className,
}: {
  exportMode?: boolean;
  value: string;
  onChange: (value: string) => void;
  className: string;
}) {
  if (exportMode) return <div className={className}>{value}</div>;
  return (
    <input value={value} onChange={(e) => onChange(e.target.value)} className={className} />
  );
}

export function ItemsTable({ zone, exportMode }: { zone: Zone; exportMode?: boolean }) {
  const { updateItemText, updateItemNumber, addItem, removeItem } = useStore();
  const totals = computeZoneTotals(zone);
  const accentClasses = ACCENT_CLASSES[zone.accent];

  return (
    <div>
      <div className="overflow-x-auto bg-paper">
        <table className="w-full min-w-[820px] border-collapse">
          <thead>
            <tr className={`${accentClasses.bg} ${accentClasses.onBg}`}>
              <th className={HEAD_CELL}>Item</th>
              <th className={`${HEAD_CELL} text-right`}>Qty</th>
              <th className={HEAD_CELL}>Required Size</th>
              <th className={`${HEAD_CELL} text-right`}>Air USD</th>
              <th className={`${HEAD_CELL} text-right`}>Air CAD</th>
              <th className={`${HEAD_CELL} text-right`}>Sea USD</th>
              <th className={`${HEAD_CELL} text-right`}>Sea CAD</th>
              <th className={HEAD_CELL} aria-hidden />
            </tr>
          </thead>
          <tbody>
            {zone.items.map((it) => (
              <tr key={it.id}>
                <td className={CELL}>
                  <TextField
                    exportMode={exportMode}
                    value={it.item}
                    onChange={(v) => updateItemText(zone.slug, it.id, "item", v)}
                    className={TEXT_INPUT}
                  />
                </td>
                <td className={`${CELL} text-right`}>
                  {exportMode ? (
                    <div className={NUM_INPUT}>{it.qty}</div>
                  ) : (
                    <input
                      type="number"
                      value={it.qty}
                      onChange={(e) =>
                        updateItemNumber(zone.slug, it.id, "qty", parseInt(e.target.value, 10) || 0)
                      }
                      className={NUM_INPUT}
                    />
                  )}
                </td>
                <td className={CELL}>
                  <TextField
                    exportMode={exportMode}
                    value={it.size}
                    onChange={(v) => updateItemText(zone.slug, it.id, "size", v)}
                    className={TEXT_INPUT}
                  />
                </td>
                <td className={`${CELL} text-right`}>
                  <CurrencyInput
                    exportMode={exportMode}
                    value={it.airUsd}
                    onChange={(v) => updateItemNumber(zone.slug, it.id, "airUsd", v)}
                    className={PRICE_INPUT}
                  />
                </td>
                <td className={`${CELL} text-right`}>
                  <CurrencyInput
                    exportMode={exportMode}
                    value={it.airCad}
                    onChange={(v) => updateItemNumber(zone.slug, it.id, "airCad", v)}
                    className={PRICE_INPUT}
                  />
                </td>
                <td className={`${CELL} text-right`}>
                  <CurrencyInput
                    exportMode={exportMode}
                    value={it.seaUsd}
                    onChange={(v) => updateItemNumber(zone.slug, it.id, "seaUsd", v)}
                    className={PRICE_INPUT}
                  />
                </td>
                <td className={`${CELL} text-right`}>
                  <CurrencyInput
                    exportMode={exportMode}
                    value={it.seaCad}
                    onChange={(v) => updateItemNumber(zone.slug, it.id, "seaCad", v)}
                    className={PRICE_INPUT}
                  />
                </td>
                <td className={`${CELL} text-center`}>
                  {!exportMode && (
                    <button
                      onClick={() => removeItem(zone.slug, it.id)}
                      aria-label="Remove item"
                      className="w-6 h-6 flex items-center justify-center text-graytext hover:text-ink"
                    >
                      <X className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!exportMode && (
        <button
          onClick={() => addItem(zone.slug)}
          className="mt-2 flex items-center gap-2 font-body font-semibold uppercase text-xs tracking-[0.08em] text-ink hover:text-graytext"
        >
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          Add item
        </button>
      )}

      <div className="mt-4 bg-ink text-white px-5 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <span className="font-condensed font-bold uppercase text-sm tracking-[0.05em]">
          Zone Total — Air{" "}
          <span className="text-lime">USD {formatCurrency(totals.airUsd)}</span>{" "}
          <span className="text-white-50">/</span>{" "}
          <span className="text-lime">CAD {formatCurrency(totals.airCad)}</span>
        </span>
        <span className="font-condensed font-bold uppercase text-sm tracking-[0.05em]">
          Zone Total — Sea{" "}
          <span className="text-lime">USD {formatCurrency(totals.seaUsd)}</span>{" "}
          <span className="text-white-50">/</span>{" "}
          <span className="text-lime">CAD {formatCurrency(totals.seaCad)}</span>
        </span>
      </div>
    </div>
  );
}
