// Shared time-unit state for every rate figure in the stats panel.
// Components multiply their per-day values by RATE_UNITS[idx].perDay so a
// single toggle re-denominates the whole dashboard at once.

export const RATE_UNITS = [
  { id: "second", noun: "second", short: "sec", perDay: 1 / 86_400 },
  { id: "hour", noun: "hour", short: "hr", perDay: 1 / 24 },
  { id: "day", noun: "day", short: "day", perDay: 1 },
  { id: "week", noun: "week", short: "wk", perDay: 7 },
  // Mean Gregorian month (365.2425 / 12)
  { id: "month", noun: "month", short: "mo", perDay: 30.436875 },
  { id: "year", noun: "year", short: "yr", perDay: 365.25 },
];

export const rateUnitState = $state({ idx: 0 });

/** Step the unit forward (dir = 1) or back (dir = -1), wrapping around. */
export function cycleRateUnit(dir = 1) {
  rateUnitState.idx =
    (rateUnitState.idx + dir + RATE_UNITS.length) % RATE_UNITS.length;
}
