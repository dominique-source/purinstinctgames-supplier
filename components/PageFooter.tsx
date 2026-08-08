export function PageFooter({ pageNumber }: { pageNumber: number }) {
  return (
    <div className="bg-ink text-white flex items-center justify-between px-6 py-3 md:px-10">
      <span className="font-body text-[11px] uppercase tracking-[0.1em] text-graytext">
        Dimensions and quantities only. Supplier to finalize engineering,
        materials and production details.
      </span>
      <span className="font-condensed font-bold uppercase text-xs tracking-[0.1em]">
        PürInstinct Games | {String(pageNumber).padStart(2, "0")}
      </span>
    </div>
  );
}
