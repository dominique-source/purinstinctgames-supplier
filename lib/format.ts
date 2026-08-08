export function formatCurrency(value: number): string {
  if (!Number.isFinite(value)) return "0.00";
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function parseCurrencyInput(raw: string): number {
  const cleaned = raw.replace(/[^0-9.-]/g, "");
  const value = parseFloat(cleaned);
  return Number.isFinite(value) ? value : 0;
}

export function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

let counter = 0;
export function makeId(prefix: string): string {
  counter += 1;
  return `${prefix}-new-${Date.now()}-${counter}`;
}
