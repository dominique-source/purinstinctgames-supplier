import jsPDF from "jspdf";

const PAGE_WIDTH_MM = 297;
const PAGE_HEIGHT_MM = 210;

export function canvasesToPdf(canvases: HTMLCanvasElement[], dateLabel: string): void {
  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  canvases.forEach((canvas, index) => {
    if (index > 0) pdf.addPage();
    const imgData = canvas.toDataURL("image/jpeg", 0.92);
    const imgHeightMm = (canvas.height / canvas.width) * PAGE_WIDTH_MM;
    const y = imgHeightMm < PAGE_HEIGHT_MM ? (PAGE_HEIGHT_MM - imgHeightMm) / 2 : 0;
    pdf.addImage(imgData, "JPEG", 0, y, PAGE_WIDTH_MM, imgHeightMm);
  });

  const safeDate = dateLabel.trim().replace(/\s+/g, "_").replace(/[^A-Za-z0-9_-]/g, "");
  pdf.save(`PurInstinct_Games_Supplier_Order_${safeDate || "export"}.pdf`);
}

export const EXPORT_PAGE_WIDTH_PX = 1754;
