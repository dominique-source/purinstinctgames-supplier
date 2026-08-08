export type ZoneAccent = "lime" | "blue" | "gold" | "teal" | "purple" | "red";

export type ItemRow = {
  id: string;
  item: string;
  qty: number;
  size: string;
  airUsd: number;
  airCad: number;
  seaUsd: number;
  seaCad: number;
  airNotAvailable?: boolean;
  seaNotAvailable?: boolean;
};

export type ShippingMethod = "air" | "sea";

export type ZoneStat = {
  value: string;
  caption: string;
};

export type Zone = {
  slug: string;
  pageNumber: number;
  name: string;
  accent: ZoneAccent;
  stats: ZoneStat[];
  note?: string;
  photo: string | null;
  photoOriginal?: string | null;
  items: ItemRow[];
};

export type CoverData = {
  dateBadge: string;
};

export type AppState = {
  cover: CoverData;
  zones: Zone[];
};

export type ZoneTotals = {
  airUsd: number;
  airCad: number;
  seaUsd: number;
  seaCad: number;
};
