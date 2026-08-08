import type { AppState, ItemRow, Zone } from "./types";

function row(
  slug: string,
  index: number,
  item: string,
  qty: number,
  size: string
): ItemRow {
  return {
    id: `${slug}-item-${index}`,
    item,
    qty,
    size,
    airUsd: 0,
    airCad: 0,
    seaUsd: 0,
    seaCad: 0,
  };
}

export const FEATURE_CALLOUTS = [
  "Premium Quality",
  "Easy System",
  "Quick Setup",
  "Indoor & Outdoor",
  "Custom Branding",
] as const;

export const INITIAL_ZONES: Zone[] = [
  {
    slug: "welcome-tent",
    pageNumber: 2,
    name: "Welcome Tent",
    accent: "lime",
    stats: [
      { value: "15 m × 10 m", caption: "Footprint" },
      { value: "5 m", caption: "Approx. height" },
      { value: "Wide / open", caption: "Front opening" },
    ],
    photo: null,
    items: [
      row("welcome-tent", 0, "Inflatable welcome tent", 1, "15 m x 10 m footprint"),
      row("welcome-tent", 1, "Branded inflatable cylinders", 2, "Supplier standard"),
      row("welcome-tent", 2, "Reception / check-in counters", 2, "Supplier standard"),
    ],
  },
  {
    slug: "main-field",
    pageNumber: 3,
    name: "Pürinstinct Main Field",
    accent: "lime",
    stats: [
      { value: "45 m × 13 m", caption: "Play area" },
      { value: "55 m × 20 m", caption: "Outer footprint" },
      { value: "25 m", caption: "Max. segment" },
    ],
    note: "Each 55 m long side must be divided so no individual barrier segment is longer than 25 m.",
    photo: null,
    items: [
      row("main-field", 0, "Playing field layout", 1, "45 m x 13 m"),
      row("main-field", 1, "Outer barrier system", 1, "55 m x 20 m footprint"),
      row("main-field", 2, "Long-side barrier modules", 6, "Max. 25 m each"),
      row("main-field", 3, "Access / junction gates", 4, "2 per 55 m long side"),
      row("main-field", 4, "Branded entry arch", 1, "Supplier standard"),
      row("main-field", 5, "Outdoor digital scoreboard", 1, "Supplier standard"),
      row("main-field", 6, "Branded inflatable cylinders", 8, "Supplier standard"),
      row("main-field", 7, "Rules sign / prism", 1, "Supplier standard"),
    ],
  },
  {
    slug: "agility-zone",
    pageNumber: 4,
    name: "Agility Zone",
    accent: "blue",
    stats: [
      { value: "18 m", caption: "Arena diameter" },
      { value: "Approx. 1.2 m", caption: "Wall height" },
      { value: "2 opposite", caption: "Openings" },
    ],
    photo: null,
    items: [
      row("agility-zone", 0, "Low-wall modular arena", 1, "18 m diameter / approx. 1.2 m wall"),
      row("agility-zone", 1, "Opposite access openings", 2, "90 cm x 120 cm each"),
      row("agility-zone", 2, "Separate canopy tent", 1, "Covers full 18 m arena"),
      row("agility-zone", 3, "Padded targets / ottomans", 5, "Supplier standard"),
      row("agility-zone", 4, "Branded inflatable cylinder", 1, "Supplier standard"),
      row("agility-zone", 5, "Rules sign / prism", 1, "Supplier standard"),
    ],
  },
  {
    slug: "hand-skills-zone",
    pageNumber: 5,
    name: "Hand Skills Zone",
    accent: "gold",
    stats: [
      { value: "18 m", caption: "Arena diameter" },
      { value: "Approx. 1.2 m", caption: "Wall height" },
      { value: "2 opposite", caption: "Doors" },
    ],
    photo: null,
    items: [
      row("hand-skills-zone", 0, "Premium modular arena", 1, "18 m diameter / approx. 1.2 m wall"),
      row("hand-skills-zone", 1, "Opposite access doors", 2, "90 cm each"),
      row("hand-skills-zone", 2, "Separate canopy tent", 1, "Covers full 18 m arena"),
      row("hand-skills-zone", 3, "Padded targets / ottomans", 5, "Supplier standard"),
      row("hand-skills-zone", 4, "Branded inflatable cylinder", 1, "Supplier standard"),
      row("hand-skills-zone", 5, "Rules sign / prism", 1, "Supplier standard"),
    ],
  },
  {
    slug: "foot-skills-zone",
    pageNumber: 6,
    name: "Foot Skills Zone",
    accent: "teal",
    stats: [
      { value: "10 m × 10 m", caption: "Zone size" },
      { value: "6 total", caption: "LED pads" },
      { value: "1 door", caption: "Access" },
    ],
    photo: null,
    items: [
      row("foot-skills-zone", 0, "Square modular barrier", 1, "10 m x 10 m"),
      row("foot-skills-zone", 1, "Access door", 1, "1 opening"),
      row("foot-skills-zone", 2, "Separate canopy tent", 1, "Covers full 10 m x 10 m zone"),
      row("foot-skills-zone", 3, "Interactive LED pads", 6, "6 total / one yellow"),
      row("foot-skills-zone", 4, "Branded inflatable cylinder", 1, "Supplier standard"),
      row("foot-skills-zone", 5, "Rules sign / prism", 1, "Supplier standard"),
    ],
  },
  {
    slug: "iq-zone",
    pageNumber: 7,
    name: "IQ Zone",
    accent: "purple",
    stats: [
      { value: "12 m × 12 m", caption: "Zone size" },
      { value: "2 opposite doors", caption: "Access" },
      { value: "1 button + 1 clock", caption: "Equipment" },
    ],
    photo: null,
    items: [
      row("iq-zone", 0, "Square modular barrier", 1, "12 m x 12 m"),
      row("iq-zone", 1, "Opposite access doors", 2, "2 opposite openings"),
      row("iq-zone", 2, "Separate canopy tent", 1, "Covers full 12 m x 12 m zone"),
      row("iq-zone", 3, "Wireless game button", 1, "1 unit"),
      row("iq-zone", 4, "Dual-color clock display", 1, "1 unit / 2 timers"),
      row("iq-zone", 5, "Rules sign / prism", 1, "Supplier standard"),
    ],
  },
  {
    slug: "speed-zone",
    pageNumber: 8,
    name: "Speed Zone",
    accent: "red",
    stats: [
      { value: "50 m × 12 m", caption: "Overall footprint" },
      { value: "25 m", caption: "Module 1" },
      { value: "25 m", caption: "Module 2" },
    ],
    note: "Build as two 25 m sections connected by one central junction / access gate. Finish end remains open.",
    photo: null,
    items: [
      row("speed-zone", 0, "Inflatable runway / barrier system", 1, "50 m x 12 m overall"),
      row("speed-zone", 1, "Central junction / access gate", 1, "At 25 m split"),
      row("speed-zone", 2, "Start arch", 1, "Supplier standard"),
      row("speed-zone", 3, "Finish arch", 1, "Supplier standard / open run-out beyond finish"),
      row("speed-zone", 4, "Branded inflatable cylinder", 1, "Supplier standard"),
      row("speed-zone", 5, "Rules sign / prism", 1, "Supplier standard"),
    ],
  },
  {
    slug: "miscellaneous",
    pageNumber: 9,
    name: "Miscellaneous",
    accent: "lime",
    stats: [
      { value: "15 ft H × 5 ft W", caption: "Leaderboard screen" },
      { value: "Supplier standard", caption: "LED display" },
      { value: "Full custom", caption: "Trailer exterior" },
    ],
    photo: null,
    items: [
      row("miscellaneous", 0, "Event speakers", 2, "Supplier standard"),
      row("miscellaneous", 1, "DJ table / booth", 1, "Supplier standard"),
      row("miscellaneous", 2, "Microphone", 1, "Supplier standard"),
      row("miscellaneous", 3, "LED leaderboard screen", 1, "15 ft high x 5 ft wide"),
      row("miscellaneous", 4, "LED screen support / truss", 1, "Sized for 15 ft x 5 ft screen"),
      row("miscellaneous", 5, "Freestanding LED display", 1, "Field-use display"),
      row("miscellaneous", 6, "Custom trailer exterior", 1, "Full exterior custom branding / size TBC"),
    ],
  },
];

export const INITIAL_STATE: AppState = {
  cover: { dateBadge: "AUGUST 2026" },
  zones: INITIAL_ZONES,
};

export const NAV_PAGES = [
  { pageNumber: 1, label: "Cover", slug: "cover" },
  ...INITIAL_ZONES.map((z) => ({
    pageNumber: z.pageNumber,
    label: z.name,
    slug: z.slug,
  })),
  { pageNumber: 10, label: "Final Quotation", slug: "quotation" },
];
