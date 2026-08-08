"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { INITIAL_STATE } from "./data";
import { makeId } from "./format";
import { fetchUsdToCad } from "./exchangeRate";
import type { AppState, ItemRow } from "./types";

const STORAGE_KEY = "purinstinct-supplier-order-state";

type NumericItemField = "qty" | "airUsd" | "airCad" | "seaUsd" | "seaCad";
type TextItemField = "item" | "size";

type ExchangeRateState = {
  rate: number | null;
  asOf: string | null;
  loading: boolean;
  error: boolean;
};

type StoreValue = {
  state: AppState;
  updateDateBadge: (value: string) => void;
  setZonePhoto: (slug: string, photo: string | null) => void;
  updateItemText: (slug: string, itemId: string, field: TextItemField, value: string) => void;
  updateItemNumber: (slug: string, itemId: string, field: NumericItemField, value: number) => void;
  addItem: (slug: string) => void;
  removeItem: (slug: string, itemId: string) => void;
  exchangeRate: ExchangeRateState;
};

const StoreContext = createContext<StoreValue | null>(null);

function loadState(): AppState {
  if (typeof window === "undefined") return INITIAL_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw) as AppState;
    if (!parsed.cover || !Array.isArray(parsed.zones)) return INITIAL_STATE;
    return parsed;
  } catch {
    return INITIAL_STATE;
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const hydrated = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [exchangeRate, setExchangeRate] = useState<ExchangeRateState>({
    rate: null,
    asOf: null,
    loading: true,
    error: false,
  });

  useEffect(() => {
    setState(loadState());
    hydrated.current = true;
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchUsdToCad()
      .then((r) => {
        if (!cancelled) setExchangeRate({ rate: r.rate, asOf: r.asOf, loading: false, error: false });
      })
      .catch(() => {
        if (!cancelled) setExchangeRate((prev) => ({ ...prev, loading: false, error: true }));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, 300);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [state]);

  const updateDateBadge = useCallback((value: string) => {
    setState((prev) => ({ ...prev, cover: { ...prev.cover, dateBadge: value } }));
  }, []);

  const setZonePhoto = useCallback((slug: string, photo: string | null) => {
    setState((prev) => ({
      ...prev,
      zones: prev.zones.map((z) => (z.slug === slug ? { ...z, photo } : z)),
    }));
  }, []);

  const updateItemText = useCallback(
    (slug: string, itemId: string, field: TextItemField, value: string) => {
      setState((prev) => ({
        ...prev,
        zones: prev.zones.map((z) =>
          z.slug !== slug
            ? z
            : {
                ...z,
                items: z.items.map((it) =>
                  it.id === itemId ? { ...it, [field]: value } : it
                ),
              }
        ),
      }));
    },
    []
  );

  const updateItemNumber = useCallback(
    (slug: string, itemId: string, field: NumericItemField, value: number) => {
      setState((prev) => ({
        ...prev,
        zones: prev.zones.map((z) =>
          z.slug !== slug
            ? z
            : {
                ...z,
                items: z.items.map((it) =>
                  it.id === itemId ? { ...it, [field]: value } : it
                ),
              }
        ),
      }));
    },
    []
  );

  const addItem = useCallback((slug: string) => {
    setState((prev) => ({
      ...prev,
      zones: prev.zones.map((z) =>
        z.slug !== slug
          ? z
          : {
              ...z,
              items: [
                ...z.items,
                {
                  id: makeId(slug),
                  item: "",
                  qty: 1,
                  size: "",
                  airUsd: 0,
                  airCad: 0,
                  seaUsd: 0,
                  seaCad: 0,
                } satisfies ItemRow,
              ],
            }
      ),
    }));
  }, []);

  const removeItem = useCallback((slug: string, itemId: string) => {
    setState((prev) => ({
      ...prev,
      zones: prev.zones.map((z) =>
        z.slug !== slug ? z : { ...z, items: z.items.filter((it) => it.id !== itemId) }
      ),
    }));
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      state,
      updateDateBadge,
      setZonePhoto,
      updateItemText,
      updateItemNumber,
      addItem,
      removeItem,
      exchangeRate,
    }),
    [
      state,
      updateDateBadge,
      setZonePhoto,
      updateItemText,
      updateItemNumber,
      addItem,
      removeItem,
      exchangeRate,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
