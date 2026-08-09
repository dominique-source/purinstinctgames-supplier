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
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { INITIAL_ZONES } from "./data";
import { makeId } from "./format";
import { fetchUsdToCad } from "./exchangeRate";
import { db, ensureAnonymousAuth, firebaseConfigured } from "./firebase";
import { uploadDataUrl, deleteIfExists } from "./imageStorage";
import type { AppState, CoverData, ItemRow, ShippingMethod, Zone } from "./types";

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
  loading: boolean;
  configured: boolean;
  updateDateBadge: (value: string) => void;
  setCoverPhoto: () => void;
  setCoverPhotoCrop: (photo: string, photoOriginal: string) => Promise<void>;
  setZonePhoto: (slug: string) => void;
  setZonePhotoCrop: (slug: string, photo: string, photoOriginal: string) => Promise<void>;
  updateItemText: (slug: string, itemId: string, field: TextItemField, value: string) => void;
  updateItemNumber: (slug: string, itemId: string, field: NumericItemField, value: number) => void;
  addItem: (slug: string) => void;
  removeItem: (slug: string, itemId: string) => void;
  toggleItemAvailability: (slug: string, itemId: string, method: ShippingMethod) => void;
  exchangeRate: ExchangeRateState;
};

const StoreContext = createContext<StoreValue | null>(null);

const DEFAULT_COVER: CoverData = { dateBadge: "AUGUST 2026", photo: null, photoOriginal: null };

function buildInitialState(): AppState {
  return {
    cover: { ...DEFAULT_COVER },
    zones: INITIAL_ZONES.map((z) => ({ ...z, items: z.items.map((it) => ({ ...it })) })),
  };
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(buildInitialState);
  const [loading, setLoading] = useState(firebaseConfigured);
  const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const [exchangeRate, setExchangeRate] = useState<ExchangeRateState>({
    rate: null,
    asOf: null,
    loading: true,
    error: false,
  });

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
    if (!firebaseConfigured || !db) return;

    let cancelled = false;
    const unsubscribers: Array<() => void> = [];
    const seenDocs = new Set<string>();
    const expectedDocs = 1 + INITIAL_ZONES.length;

    function markSeen(key: string) {
      seenDocs.add(key);
      if (seenDocs.size >= expectedDocs) setLoading(false);
    }

    ensureAnonymousAuth().then(() => {
      const database = db;
      if (cancelled || !database) return;

      unsubscribers.push(
        onSnapshot(doc(database, "cover", "main"), (snap) => {
          const data = snap.data() as Partial<CoverData> | undefined;
          setState((prev) => ({
            ...prev,
            cover: {
              dateBadge: data?.dateBadge ?? prev.cover.dateBadge,
              photo: data?.photo ?? null,
              photoOriginal: data?.photoOriginal ?? null,
            },
          }));
          markSeen("cover");
        })
      );

      INITIAL_ZONES.forEach((zoneSeed) => {
        unsubscribers.push(
          onSnapshot(doc(database, "zones", zoneSeed.slug), (snap) => {
            const data = snap.data() as
              | { items?: ItemRow[]; photo?: string | null; photoOriginal?: string | null }
              | undefined;
            setState((prev) => ({
              ...prev,
              zones: prev.zones.map((z) =>
                z.slug !== zoneSeed.slug
                  ? z
                  : {
                      ...z,
                      items: data?.items !== undefined ? data.items : zoneSeed.items,
                      photo: data?.photo ?? null,
                      photoOriginal: data?.photoOriginal ?? null,
                    }
              ),
            }));
            markSeen(zoneSeed.slug);
          })
        );
      });
    });

    return () => {
      cancelled = true;
      unsubscribers.forEach((u) => u());
    };
  }, []);

  const scheduleSave = useCallback((key: string, fn: () => void, delay = 300) => {
    if (saveTimers.current[key]) clearTimeout(saveTimers.current[key]);
    saveTimers.current[key] = setTimeout(fn, delay);
  }, []);

  const scheduleZoneItemsSave = useCallback(
    (slug: string, zones: Zone[]) => {
      const database = db;
      if (!database) return;
      scheduleSave(`zone:${slug}`, () => {
        const zone = zones.find((z) => z.slug === slug);
        if (!zone) return;
        setDoc(doc(database, "zones", slug), { items: zone.items }, { merge: true }).catch(() => {});
      });
    },
    [scheduleSave]
  );

  const updateDateBadge = useCallback(
    (value: string) => {
      const database = db;
      setState((prev) => {
        const next = { ...prev, cover: { ...prev.cover, dateBadge: value } };
        if (database) {
          scheduleSave("cover:dateBadge", () => {
            setDoc(doc(database, "cover", "main"), { dateBadge: value }, { merge: true }).catch(() => {});
          });
        }
        return next;
      });
    },
    [scheduleSave]
  );

  const setCoverPhoto = useCallback(() => {
    setState((prev) => ({ ...prev, cover: { ...prev.cover, photo: null, photoOriginal: null } }));
    if (db) {
      setDoc(doc(db, "cover", "main"), { photo: null, photoOriginal: null }, { merge: true }).catch(() => {});
    }
    deleteIfExists("cover/photo.jpg");
    deleteIfExists("cover/photoOriginal.jpg");
  }, []);

  const setCoverPhotoCrop = useCallback(async (photo: string, photoOriginal: string) => {
    if (!db) return;
    const [photoUrl, photoOriginalUrl] = await Promise.all([
      uploadDataUrl("cover/photo.jpg", photo),
      uploadDataUrl("cover/photoOriginal.jpg", photoOriginal),
    ]);
    setState((prev) => ({
      ...prev,
      cover: { ...prev.cover, photo: photoUrl, photoOriginal: photoOriginalUrl },
    }));
    await setDoc(
      doc(db, "cover", "main"),
      { photo: photoUrl, photoOriginal: photoOriginalUrl },
      { merge: true }
    );
  }, []);

  const setZonePhoto = useCallback((slug: string) => {
    setState((prev) => ({
      ...prev,
      zones: prev.zones.map((z) => (z.slug === slug ? { ...z, photo: null, photoOriginal: null } : z)),
    }));
    if (db) {
      setDoc(doc(db, "zones", slug), { photo: null, photoOriginal: null }, { merge: true }).catch(() => {});
    }
    deleteIfExists(`zones/${slug}/photo.jpg`);
    deleteIfExists(`zones/${slug}/photoOriginal.jpg`);
  }, []);

  const setZonePhotoCrop = useCallback(async (slug: string, photo: string, photoOriginal: string) => {
    if (!db) return;
    const [photoUrl, photoOriginalUrl] = await Promise.all([
      uploadDataUrl(`zones/${slug}/photo.jpg`, photo),
      uploadDataUrl(`zones/${slug}/photoOriginal.jpg`, photoOriginal),
    ]);
    setState((prev) => ({
      ...prev,
      zones: prev.zones.map((z) =>
        z.slug === slug ? { ...z, photo: photoUrl, photoOriginal: photoOriginalUrl } : z
      ),
    }));
    await setDoc(
      doc(db, "zones", slug),
      { photo: photoUrl, photoOriginal: photoOriginalUrl },
      { merge: true }
    );
  }, []);

  const updateItemText = useCallback(
    (slug: string, itemId: string, field: TextItemField, value: string) => {
      setState((prev) => {
        const next = {
          ...prev,
          zones: prev.zones.map((z) =>
            z.slug !== slug
              ? z
              : { ...z, items: z.items.map((it) => (it.id === itemId ? { ...it, [field]: value } : it)) }
          ),
        };
        scheduleZoneItemsSave(slug, next.zones);
        return next;
      });
    },
    [scheduleZoneItemsSave]
  );

  const updateItemNumber = useCallback(
    (slug: string, itemId: string, field: NumericItemField, value: number) => {
      setState((prev) => {
        const next = {
          ...prev,
          zones: prev.zones.map((z) =>
            z.slug !== slug
              ? z
              : { ...z, items: z.items.map((it) => (it.id === itemId ? { ...it, [field]: value } : it)) }
          ),
        };
        scheduleZoneItemsSave(slug, next.zones);
        return next;
      });
    },
    [scheduleZoneItemsSave]
  );

  const addItem = useCallback(
    (slug: string) => {
      setState((prev) => {
        const next = {
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
        };
        scheduleZoneItemsSave(slug, next.zones);
        return next;
      });
    },
    [scheduleZoneItemsSave]
  );

  const removeItem = useCallback(
    (slug: string, itemId: string) => {
      setState((prev) => {
        const next = {
          ...prev,
          zones: prev.zones.map((z) =>
            z.slug !== slug ? z : { ...z, items: z.items.filter((it) => it.id !== itemId) }
          ),
        };
        scheduleZoneItemsSave(slug, next.zones);
        return next;
      });
    },
    [scheduleZoneItemsSave]
  );

  const toggleItemAvailability = useCallback(
    (slug: string, itemId: string, method: ShippingMethod) => {
      const flagKey = method === "air" ? "airNotAvailable" : "seaNotAvailable";
      const usdKey = method === "air" ? "airUsd" : "seaUsd";
      const cadKey = method === "air" ? "airCad" : "seaCad";
      setState((prev) => {
        const next = {
          ...prev,
          zones: prev.zones.map((z) =>
            z.slug !== slug
              ? z
              : {
                  ...z,
                  items: z.items.map((it) => {
                    if (it.id !== itemId) return it;
                    const nextFlag = !it[flagKey];
                    return nextFlag
                      ? { ...it, [flagKey]: true, [usdKey]: 0, [cadKey]: 0 }
                      : { ...it, [flagKey]: false };
                  }),
                }
          ),
        };
        scheduleZoneItemsSave(slug, next.zones);
        return next;
      });
    },
    [scheduleZoneItemsSave]
  );

  const value = useMemo<StoreValue>(
    () => ({
      state,
      loading,
      configured: firebaseConfigured,
      updateDateBadge,
      setCoverPhoto,
      setCoverPhotoCrop,
      setZonePhoto,
      setZonePhotoCrop,
      updateItemText,
      updateItemNumber,
      addItem,
      removeItem,
      toggleItemAvailability,
      exchangeRate,
    }),
    [
      state,
      loading,
      updateDateBadge,
      setCoverPhoto,
      setCoverPhotoCrop,
      setZonePhoto,
      setZonePhotoCrop,
      updateItemText,
      updateItemNumber,
      addItem,
      removeItem,
      toggleItemAvailability,
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
