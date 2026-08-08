"use client";

import { useEffect, useRef, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { CoverPage } from "@/components/CoverPage";
import { ZonePage } from "@/components/ZonePage";
import { QuotationPage } from "@/components/QuotationPage";
import { useStore } from "@/lib/store";
import { canvasesToPdf, EXPORT_PAGE_WIDTH_PX } from "@/lib/pdf";
import type { Zone } from "@/lib/types";

function renderPage(pageNumber: number, zones: Zone[], exportMode?: boolean) {
  if (pageNumber === 1) return <CoverPage exportMode={exportMode} />;
  if (pageNumber === 10) return <QuotationPage />;
  const zone = zones.find((z) => z.pageNumber === pageNumber);
  if (!zone) return null;
  return <ZonePage zone={zone} exportMode={exportMode} />;
}

export default function Home() {
  const { state } = useStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [exportPageNumber, setExportPageNumber] = useState<number | null>(null);
  const exporting = exportPageNumber !== null;
  const exportRootRef = useRef<HTMLDivElement>(null);
  const canvasesRef = useRef<HTMLCanvasElement[]>([]);

  useEffect(() => {
    if (exportPageNumber === null) return;
    let cancelled = false;

    (async () => {
      const html2canvas = (await import("html2canvas")).default;
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      );
      if (cancelled || !exportRootRef.current) return;

      const canvas = await html2canvas(exportRootRef.current, {
        scale: 2,
        backgroundColor: "#F4F4EF",
        useCORS: true,
      });
      if (cancelled) return;
      canvasesRef.current.push(canvas);

      if (exportPageNumber < 10) {
        setExportPageNumber(exportPageNumber + 1);
      } else {
        canvasesToPdf(canvasesRef.current, state.cover.dateBadge);
        canvasesRef.current = [];
        setExportPageNumber(null);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exportPageNumber]);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onExport={() => {
          canvasesRef.current = [];
          setExportPageNumber(1);
        }}
        exporting={exporting}
      />

      <main className="flex-1 bg-offwhite">
        {renderPage(currentPage, state.zones)}
      </main>

      <div
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: -100000,
          width: EXPORT_PAGE_WIDTH_PX,
        }}
      >
        <div ref={exportRootRef} style={{ width: EXPORT_PAGE_WIDTH_PX, background: "#F4F4EF" }}>
          {exportPageNumber !== null && renderPage(exportPageNumber, state.zones, true)}
        </div>
      </div>
    </div>
  );
}
