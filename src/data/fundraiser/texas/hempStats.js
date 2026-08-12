/**
 * Money figures for the Texas hemp campaign's STATS panel.
 *
 * READ THIS BEFORE QUOTING ANY OF IT.
 *
 * Every number carries a `basis` so the UI can show how much weight it holds:
 *
 *  - "reported"  — published by a state agency or a named economic study, with
 *                  the period it covers. Re-check before a press cycle; these
 *                  move every quarter.
 *  - "derived"   — arithmetic on a reported figure (a tax take from a known rate
 *                  times reported sales). Both inputs are shown so it can be
 *                  audited.
 *  - "modelled"  — an estimate with no per-item source. Only the metro splits.
 *  - "none"      — no reliable public figure exists. Says so instead of guessing.
 *
 * Two traps that already caught earlier drafts of this file:
 *  1. New Mexico's "$1 billion" headline is CUMULATIVE since April 2022, not
 *     annual. Annual is roughly half that. Don't mix the two.
 *  2. Oklahoma reports on a fiscal year, Arkansas on a calendar year. Comparing
 *     them without saying which is which overstates one of them.
 */

/** Texas — the market this campaign is about. */
export const TEXAS_STATS = {
  label: "TEXAS",
  retail: "$5.5B",
  retailValue: 5_500_000_000,
  tax: "$268M",
  taxValue: 268_000_000,
  impact: "$10.3B",
  jobs: "53,300",
  businesses: "8,500+",
  retailers: "7,500+",
  retailerSales: "$4.3B",
  basis: "reported",
  source:
    'Whitney Economics, "Hemp-Derived Cannabinoids in the Lone Star State" (March 2025).',
  note: "Texas levies no cannabis excise tax — hemp sells under ordinary sales tax, so $268M is what the state already collects and stands to lose. Jobs were 50,100 in 2023.",
};

/**
 * Neighbours, annual. `revenueValue` / `taxValue` are for the bar charts; null
 * means no bar, because no figure is being claimed.
 */
export const NEIGHBOR_STATS = [
  {
    state: "New Mexico",
    abbr: "NM",
    status: "rec",
    statusLabel: "Adult-use retail",
    revenue: "$590M",
    revenueValue: 590_000_000,
    period: "calendar 2024",
    taxRate: "12% excise (13% from Jul 2025)",
    tax: "~$71M",
    taxValue: 71_000_000,
    basis: "derived",
    drive: "10 hrs from Dallas",
    note: "Sales rose ~6% over 2023; adult-use is 76% of the market. Tax is 12% of reported sales. Cumulative sales since the April 2022 launch passed $1.01B by March 2024 — that headline is not an annual number.",
  },
  {
    state: "Oklahoma",
    abbr: "OK",
    status: "med",
    statusLabel: "Medical only",
    revenue: "~$690M",
    revenueValue: 690_000_000,
    period: "FY2025, annualised",
    taxRate: "7% excise",
    tax: "~$48M",
    taxValue: 48_000_000,
    basis: "reported",
    drive: "3 hrs from Dallas",
    note: "$575.3M of sales and $40.3M of tax over the first 10 months of FY2025, annualised. The market is shrinking: calendar-2025 sales were $445M through September.",
  },
  {
    state: "Arkansas",
    abbr: "AR",
    status: "med",
    statusLabel: "Medical only",
    revenue: "$291.1M",
    revenueValue: 291_100_000,
    period: "calendar 2025",
    taxRate: "6.5% sales + 4% privilege",
    tax: "$32.3M",
    taxValue: 32_300_000,
    basis: "reported",
    drive: "5 hrs from Dallas",
    note: "An annual record, up 5.5% on 2024, from just 37 dispensaries serving 115,113 registered patients.",
  },
  {
    state: "Louisiana",
    abbr: "LA",
    status: "med",
    statusLabel: "Medical only",
    revenue: "Not published",
    revenueValue: null,
    period: "—",
    taxRate: "State sales tax only",
    tax: "Not published",
    taxValue: null,
    basis: "none",
    drive: "6 hrs from Dallas",
    note: "Deliberately blank: Louisiana publishes no clean annual retail total. There are 23 current retailers — and therapeutic-marijuana fees came to $6.36M in FY2024/25. A $106M \"Marijuana & Controlled Dangerous Substance\" tax line exists but is not cannabis-retail specific, so it is not used here.",
  },
  {
    // The entry that makes the argument by itself: prohibition doesn't remove
    // the market, it removes the tax.
    state: "Mexico",
    abbr: "MX",
    status: "none",
    statusLabel: "No regulated retail",
    revenue: "Illicit only",
    revenueValue: null,
    period: "—",
    taxRate: "None — no legal market",
    tax: "$0",
    taxValue: 0,
    basis: "contested",
    drive: "1,254 mi of Texas border",
    note: "Possession up to 5g is decriminalised but no commercial market was ever built, so nothing is taxed. Bills to regulate it are projected at ~$1B/yr. Meanwhile US legalisation cut cartel marijuana revenue ~25% since 2021 and border seizures 83% since 2015 — legal supply displaced the illegal one.",
  },
];

/**
 * Per-metro splits. MODELLED, not reported: nobody publishes hemp retail by
 * Texas metro, so the statewide $5.5B is allocated by each metro's share of the
 * state's ~31.3M people. Shares sum to well under 100% — the rest of Texas is
 * everywhere else.
 */
export const CITY_STATS = [
  { city: "Dallas–Fort Worth", metroPop: "8.1M", share: "26%", revenue: "~$1.4B", revenueValue: 1_418_000_000 },
  { city: "Houston", metroPop: "7.5M", share: "24%", revenue: "~$1.3B", revenueValue: 1_320_000_000 },
  { city: "San Antonio", metroPop: "2.7M", share: "9%", revenue: "~$475M", revenueValue: 475_000_000 },
  { city: "Austin", metroPop: "2.5M", share: "8%", revenue: "~$440M", revenueValue: 440_000_000 },
  { city: "El Paso", metroPop: "870K", share: "3%", revenue: "~$155M", revenueValue: 155_000_000 },
];

export const CITY_STATS_METHOD =
  "Estimated, not reported: statewide $5.5B split by each metro's share of Texas' ~31.3M people. No per-metro hemp sales data is published anywhere.";

/** Shown once at the bottom of the sheet so the sourcing isn't buried. */
export const STATS_SOURCES = [
  'Texas: Whitney Economics, "Hemp-Derived Cannabinoids in the Lone Star State" (Mar 2025) — $5.5B sales, $268M tax, $10.3B impact, 53,300 jobs.',
  "New Mexico: NM Taxation & Revenue / Governor's office — $590M calendar 2024, 12% excise.",
  "Oklahoma: OMMA licensing and tax data — $575.3M sales and $40.3M tax over 10 months of FY2025.",
  "Arkansas: AR Dept. of Finance & Administration — $291.1M sales, $32.3M tax, calendar 2025.",
  "Louisiana: no clean annual retail total published.",
  "Mexico: no regulated retail market; figures on the illicit trade are contested.",
];
