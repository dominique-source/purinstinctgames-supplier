import type { Zone, ZoneTotals } from "./types";

export function computeZoneTotals(zone: Zone): ZoneTotals {
  return zone.items.reduce<ZoneTotals>(
    (acc, item) => ({
      airUsd: acc.airUsd + item.airUsd,
      airCad: acc.airCad + item.airCad,
      seaUsd: acc.seaUsd + item.seaUsd,
      seaCad: acc.seaCad + item.seaCad,
    }),
    { airUsd: 0, airCad: 0, seaUsd: 0, seaCad: 0 }
  );
}

export function computeGrandTotals(zones: Zone[]): ZoneTotals {
  return zones.reduce<ZoneTotals>(
    (acc, zone) => {
      const zt = computeZoneTotals(zone);
      return {
        airUsd: acc.airUsd + zt.airUsd,
        airCad: acc.airCad + zt.airCad,
        seaUsd: acc.seaUsd + zt.seaUsd,
        seaCad: acc.seaCad + zt.seaCad,
      };
    },
    { airUsd: 0, airCad: 0, seaUsd: 0, seaCad: 0 }
  );
}
