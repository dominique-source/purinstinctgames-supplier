export type ExchangeRate = {
  rate: number;
  asOf: string;
};

const CACHE_KEY = "purinstinct-supplier-order-usd-cad-rate";

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function readCache(): ExchangeRate | null {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ExchangeRate & { fetchedOn: string };
    if (parsed.fetchedOn !== todayISO()) return null;
    return { rate: parsed.rate, asOf: parsed.asOf };
  } catch {
    return null;
  }
}

function writeCache(value: ExchangeRate) {
  window.localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({ ...value, fetchedOn: todayISO() })
  );
}

export async function fetchUsdToCad(): Promise<ExchangeRate> {
  const cached = readCache();
  if (cached) return cached;

  const res = await fetch("https://api.frankfurter.dev/v1/latest?from=USD&to=CAD");
  if (!res.ok) throw new Error("Failed to fetch exchange rate");
  const data = (await res.json()) as { rates: { CAD: number }; date: string };
  const value: ExchangeRate = { rate: data.rates.CAD, asOf: data.date };
  writeCache(value);
  return value;
}
