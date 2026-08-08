"use client";

import { useEffect, useRef, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { CoverPage } from "@/components/CoverPage";
import { ZonePage } from "@/components/ZonePage";
import { QuotationPage } from "@/components/QuotationPage";
import { ExportDialog } from "@/components/ExportDialog";
import { useStore } from "@/lib/store";
import { canvasesToPdf, EXPORT_PAGE_WIDTH_PX } from "@/lib/pdf";
import { NAV_PAGES } from "@/lib/data";
import type { Zone } from "@/lib/types";

function renderPage(pageNumber: number, zones: Zone[], exportMode?: boolean) {
  if (pageNumber === 1) return <CoverPage exportMode={exportMode} />;
  if (pageNumber === 10) return <QuotationPage />;
  const zone = zones.find((z) => z.pageNumber === pageNumber);
  if (!zone) return null;
  return <ZonePage zone={zone} exportMode={exportMode} />;
}

const ALL_PAGE_NUMBERS = NAV_PAGES.map((p) => p.pageNumber);

export default function Home() {
  const { state } = useStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(
    () => new Set(ALL_PAGE_NUMBERS)
  );
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportQueue, setExportQueue] = useState<number[] | null>(null);
  const [exportIndex, setExportIndex] = useState(0);
  const exporting = exportQueue !== null;
  const exportRootRef = useRef<HTMLDivElement>(null);
  const canvasesRef = useRef<HTMLCanvasElement[]>([]);

  useEffect(() => {
    if (exportQueue === null) return;
    let cancelled = false;

    (async () => {
      const html2canvas = (await import("html2canvas")).default;
      await new Promise<void>((resolve) => setTimeout(resolve, 50));
      if (cancelled || !exportRootRef.current) return;

      const canvas = await html2canvas(exportRootRef.current, {
        scale: 2,
        backgroundColor: "#F4F4EF",
        useCORS: true,
      });
      if (cancelled) return;
      canvasesRef.current.push(canvas);

      if (exportIndex < exportQueue.length - 1) {
        setExportIndex(exportIndex + 1);
      } else {
        canvasesToPdf(canvasesRef.current, state.cover.dateBadge);
        canvasesRef.current = [];
        setExportQueue(null);
        setExportIndex(0);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exportQueue, exportIndex]);

  const exportPageNumber = exportQueue !== null ? exportQueue[exportIndex] : null;

  return (
    <div className="flex min-h-screen">
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onOpenExport={() => setExportDialogOpen(true)}
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

      {exportDialogOpen && (
        <ExportDialog
          selectedPages={selectedPages}
          onToggle={(pageNumber) =>
            setSelectedPages((prev) => {
              const next = new Set(prev);
              if (next.has(pageNumber)) next.delete(pageNumber);
              else next.add(pageNumber);
              return next;
            })
          }
          onSelectAll={() => setSelectedPages(new Set(ALL_PAGE_NUMBERS))}
          onSelectNone={() => setSelectedPages(new Set())}
          onCancel={() => setExportDialogOpen(false)}
          onConfirm={() => {
            const queue = ALL_PAGE_NUMBERS.filter((n) => selectedPages.has(n));
            if (queue.length === 0) return;
            canvasesRef.current = [];
            setExportIndex(0);
            setExportQueue(queue);
            setExportDialogOpen(false);
          }}
        />
      )}
    </div>
  );
}
