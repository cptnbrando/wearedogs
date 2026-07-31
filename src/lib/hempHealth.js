/**
 * The HEALTH tab: what actually kills Texans, next to what the state just
 * made a felony. Every figure carries its source — the argument only works
 * if the numbers survive being checked.
 *
 * Deliberately includes the numbers that cut against us (cannabis ED visits
 * are real and rising). A page that admits its own weak spot is the one
 * worth believing.
 */

/** Yearly deaths, biggest first. `value` drives the bars; null = no bar. */
export const DEATH_STATS = [
  {
    label: "Alcohol — U.S.",
    value: 178307,
    display: "178,307",
    scope: "us",
    tone: "bad",
    note: "Average annual deaths from excessive alcohol use, 2020–2021 — up 29% from 2016–2017. Each death cuts an average of 24 years off a life.",
    source: "CDC, MMWR / Alcohol Facts & Stats",
    url: "https://www.cdc.gov/alcohol/facts-stats/index.html",
  },
  {
    label: "Alcohol — TEXAS",
    value: 13701,
    display: "13,701",
    scope: "tx",
    tone: "bad",
    note: "Alcohol-attributable deaths per year in Texas — about one death for every 1,581 adults. 63.5% from chronic causes like alcohol use disorder.",
    source: "CDC Alcohol-Related Disease Impact (ARDI), Texas",
    url: "https://nccd.cdc.gov/DPH_ARDI/default/default.aspx",
  },
  {
    label: "All drug overdose — TEXAS",
    value: 4980,
    display: "4,980",
    scope: "tx",
    tone: "warn",
    note: "Every drug overdose death in Texas in 2024 combined — down nearly 15% year over year. Methamphetamine was involved in 42%, more than any other drug.",
    source: "USAFacts / Texas DSHS drug-related deaths",
    url: "https://usafacts.org/answers/how-many-drug-overdose-deaths-happen-every-year-in-the-us/state/texas/",
  },
  {
    label: "Cannabis overdose — anywhere",
    value: 0,
    display: "0",
    scope: "us",
    tone: "good",
    note: "No death has ever been attributed to cannabis toxicity alone. The DEA's own fact sheet says no fatal overdose has been reported; NIDA says a life-threatening overdose is unlikely. Deaths involving cannabis are indirect — impaired driving, drug combinations, cardiac events in at-risk people.",
    source: "DEA drug fact sheet · NIDA",
    url: "https://www.dea.gov/factsheets/marijuana",
  },
];

/** Emergency-department load — the honest middle ground. */
export const ED_STATS = [
  {
    label: "Alcohol-specific ED visits",
    value: 5372000,
    display: "5.4M",
    tone: "bad",
    note: "Alcohol-specific emergency department visits per year (2021–2022), roughly double the 2003–2004 rate.",
    source: "CDC / NCHS Health E-Stat 109",
    url: "https://www.cdc.gov/nchs/data/hestat/hestat109.htm",
  },
  {
    label: "Cannabis-related ED visits",
    value: 896418,
    display: "896,418",
    tone: "warn",
    note: "Cannabis-related ED visits in 2023, up 4.6% from 2022. Real, rising, and worth regulating for — and overwhelmingly non-fatal: anxiety, panic, and cannabinoid hyperemesis, not organ failure.",
    source: "SAMHSA / DAWN 2023",
    url: "https://library.samhsa.gov/sites/default/files/pep23-07-03-001.pdf",
  },
];

/** Share of all drug-related ED visits, by substance. */
export const ED_SHARE = [
  { label: "Alcohol", pct: 45.0, tone: "bad" },
  { label: "Cannabis", pct: 11.9, tone: "warn" },
];

export const ED_SHARE_NOTE =
  "Alcohol appears in nearly four times as many drug-related emergency visits as cannabis — 45.0% vs 11.9% of 7.59 million visits in 2023.";

export const ED_SHARE_SOURCE = {
  label: "SAMHSA, Findings from Drug-Related Emergency Department Visits, 2023",
  url: "https://library.samhsa.gov/sites/default/files/pep23-07-03-001.pdf",
};

/**
 * The bottom line, stated plainly enough to quote in an email to a
 * lawmaker. Ratios computed from the figures above, not asserted.
 */
export const HEALTH_TAKEAWAYS = [
  "Alcohol kills roughly 13,701 Texans a year. It is sold on a Sunday at any grocery store in the state.",
  "Every drug overdose in Texas combined — fentanyl, meth, everything — comes to 4,980 deaths a year, about a third of the alcohol toll.",
  "Cannabis toxicity alone has never killed a documented adult. The product Texas made a state jail felony today is the one with a death count of zero.",
  "Cannabis is not harmless — 896,418 emergency visits in 2023 says otherwise. That is an argument for dosage caps, testing, and age limits. It is not an argument for prison.",
  "A ban does not remove the demand; it moves it to an untested market with no dose printed on the label and no lab behind it.",
];

/** Primary research worth reading in full. */
export const HEALTH_RESEARCH = [
  {
    label:
      "CDC — Deaths from Excessive Alcohol Use, United States, 2016–2021 (MMWR)",
    url: "https://www.cdc.gov/mmwr/volumes/73/wr/mm7308a1.htm",
  },
  {
    label: "CDC — Facts About U.S. Deaths from Excessive Alcohol Use",
    url: "https://www.cdc.gov/alcohol/facts-stats/index.html",
  },
  {
    label: "CDC ARDI — state-level alcohol-attributable deaths",
    url: "https://nccd.cdc.gov/DPH_ARDI/default/default.aspx",
  },
  {
    label: "CDC/NCHS — ED visits for alcohol-specific diagnoses, 2003–2022",
    url: "https://www.cdc.gov/nchs/data/hestat/hestat109.htm",
  },
  {
    label: "SAMHSA DAWN — Drug-Related Emergency Department Visits, 2023",
    url: "https://library.samhsa.gov/sites/default/files/pep23-07-03-001.pdf",
  },
  {
    label: "NIDA — Overdose death rates and trends",
    url: "https://nida.nih.gov/research-topics/trends-statistics/overdose-death-rates",
  },
  {
    label: "DEA — Marijuana drug fact sheet ('no reported fatal overdose')",
    url: "https://www.dea.gov/factsheets/marijuana",
  },
  {
    label: "Texas DSHS — Drug-related deaths dashboard",
    url: "https://healthdata.dshs.texas.gov/dashboard/drugs-and-alcohol/all-drugs/drug-related-deaths",
  },
  {
    label:
      "Texas DSHS — Alcohol-Related Polysubstance Overdose Deaths in Texas, 2010–2019 (PDF)",
    url: "https://www.dshs.texas.gov/sites/default/files/chs/data/Alcohol-related%20Opioid%20Polysubstance%20Report_Final.pdf",
  },
  {
    label: "America's Health Rankings — excessive drinking in Texas",
    url: "https://www.americashealthrankings.org/explore/measures/ExcessDrink/TX",
  },
];

export const HEALTH_METHOD =
  "Figures are the most recent published by each agency and are not all from the same year — U.S. alcohol deaths are a 2020–2021 annual average, Texas overdose deaths are 2024, ED figures are 2021–2023. Death counts and ED visits measure different things and are shown separately rather than combined.";
