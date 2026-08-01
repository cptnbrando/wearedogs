/**
 * Texas geography for the fundraiser lawmaker map.
 *
 * Everything here is stored as real [longitude, latitude] pairs and projected
 * into SVG space at render time, so state outlines, highways, cities, landmarks
 * and lawmaker pins all register against each other automatically. Add a city
 * by dropping in its real coordinates — no hand-tuned SVG path math required.
 */

// Equirectangular projection tuned for Texas' mid-latitude (~31.5N).
const LNG_ORIGIN = -106.8;
const LAT_ORIGIN = 36.8;
const SCALE = 100; // SVG units per degree of latitude
const COS_LAT = Math.cos((31.5 * Math.PI) / 180); // longitude foreshortening

export function px(lng) {
  return (lng - LNG_ORIGIN) * SCALE * COS_LAT;
}

export function py(lat) {
  return (LAT_ORIGIN - lat) * SCALE;
}

/** Build an SVG path `d` from an array of [lng, lat] pairs. */
export function toPath(coords, close = false) {
  if (!coords || coords.length === 0) return "";
  const d = coords
    .map(([lng, lat], i) => `${i === 0 ? "M" : "L"}${px(lng).toFixed(1)},${py(lat).toFixed(1)}`)
    .join(" ");
  return close ? `${d} Z` : d;
}

/* ------------------------------------------------------------------ */
/* Border segments — composed into full outlines below                 */
/* ------------------------------------------------------------------ */

// Panhandle: NW corner east along the 36°30' parallel, then south on the 100th meridian.
const PANHANDLE_TOP = [
  [-103.0417, 36.5],
  [-100.0, 36.5],
  [-100.0, 34.5607],
];

// Red River — the Texas/Oklahoma line, west to east.
const RED_RIVER = [
  [-100.0, 34.5607],
  [-99.6, 34.4],
  [-99.2, 34.15],
  [-98.95, 34.2],
  [-98.6, 34.12],
  [-98.4, 34.08],
  [-98.1, 33.9],
  [-97.85, 33.9],
  [-97.6, 33.85],
  [-97.35, 33.9],
  [-97.2, 33.85],
  [-96.9, 33.75],
  [-96.75, 33.82],
  [-96.6, 33.85],
  [-96.35, 33.7],
  [-96.15, 33.75],
  [-95.9, 33.75],
  [-95.6, 33.68],
  [-95.2, 33.6],
  [-95.0, 33.55],
  [-94.75, 33.6],
  [-94.4816, 33.6367],
];

// Texas/Arkansas + upper Texas/Louisiana: the 94°02'37" meridian.
const EAST_MERIDIAN = [
  [-94.4816, 33.6367],
  [-94.0431, 33.6236],
  [-94.0431, 33.0195],
  [-94.0431, 32.0],
];

// Sabine River down to the Gulf at Sabine Pass.
const SABINE = [
  [-94.0431, 32.0],
  [-93.85, 31.6],
  [-93.55, 31.2],
  [-93.53, 31.05],
  [-93.72, 30.8],
  [-93.7, 30.4],
  [-93.75, 30.1],
  [-93.83, 29.9],
  [-93.93, 29.75],
];

// Gulf coast, Sabine Pass around to the mouth of the Rio Grande.
const GULF_COAST = [
  [-93.93, 29.75],
  [-94.4, 29.68],
  [-94.77, 29.3],
  [-95.1, 29.1],
  [-95.36, 28.94],
  [-95.8, 28.7],
  [-96.0, 28.6],
  [-96.4, 28.4],
  [-96.6, 28.32],
  [-96.9, 28.1],
  [-97.05, 27.83],
  [-97.2, 27.5],
  [-97.35, 27.3],
  [-97.28, 26.9],
  [-97.2, 26.6],
  [-97.17, 26.3],
  [-97.15, 26.07],
];

// Rio Grande, mouth at Boca Chica upstream to El Paso.
export const RIO_GRANDE = [
  [-97.15, 26.07],
  [-97.4, 26.06],
  [-97.7, 26.2],
  [-98.0, 26.06],
  [-98.2, 26.25],
  [-98.5, 26.4],
  [-98.8, 26.38],
  [-99.1, 26.9],
  [-99.3, 27.2],
  [-99.5, 27.5],
  [-99.8, 27.8],
  [-100.0, 28.2],
  [-100.3, 28.5],
  [-100.5, 28.71],
  [-100.65, 29.1],
  [-100.8, 29.3],
  [-101.05, 29.45],
  [-101.4, 29.65],
  [-101.8, 29.78],
  [-102.0, 29.8],
  [-102.35, 29.87],
  [-102.55, 29.78],
  [-102.7, 29.4],
  [-102.85, 29.22],
  [-103.05, 29.0],
  [-103.15, 28.98],
  [-103.3, 29.3],
  [-103.8, 29.52],
  [-104.3, 29.6],
  [-104.55, 29.9],
  [-104.7, 30.0],
  [-104.9, 30.4],
  [-105.0, 30.5],
  [-105.3, 30.8],
  [-105.6, 31.0],
  [-106.0, 31.4],
  [-106.3, 31.6],
  [-106.48, 31.75],
];

// Texas/New Mexico: west line, the 32nd parallel, then the panhandle's west edge.
const NM_BORDER = [
  [-106.48, 31.75],
  [-106.6167, 31.9],
  [-106.6167, 32.0008],
  [-103.0644, 32.0008],
  [-103.0644, 36.5],
  [-103.0417, 36.5],
];

export const TEXAS_OUTLINE = [
  ...PANHANDLE_TOP,
  ...RED_RIVER.slice(1),
  ...EAST_MERIDIAN.slice(1),
  ...SABINE.slice(1),
  ...GULF_COAST.slice(1),
  ...RIO_GRANDE.slice(1),
  ...NM_BORDER.slice(1),
];

/* ------------------------------------------------------------------ */
/* Neighbouring states & Mexico — simplified context shapes            */
/* ------------------------------------------------------------------ */

/**
 * Neighbouring states carry their cannabis status and roughly what that market
 * is worth a year, because "the money walks across the state line" is the whole
 * economic argument of the campaign.
 *
 * `cannabis`: "rec" = adult-use retail, "med" = medical programme only,
 * null = no claim made.
 * `revenue` figures are ANNUAL RETAIL SALES, rounded and approximate — they move
 * every reporting period, so treat them as orders of magnitude and re-check
 * before quoting them anywhere official.
 */
export const NEIGHBORS = [
  {
    id: "ok",
    name: "OKLAHOMA",
    abbr: "OK",
    cannabis: "med",
    revenue: "~$700M/yr",
    labelAt: [-97.5, 35.6],
    coords: [
      [-103.0, 37.0],
      [-94.43, 37.0],
      [-94.43, 35.4],
      [-94.4816, 33.6367],
      ...[...RED_RIVER].reverse().slice(1),
      [-100.0, 36.5],
      [-103.0, 36.5],
      [-103.0, 37.0],
    ],
  },
  {
    id: "nm",
    name: "NEW MEXICO",
    abbr: "NM",
    cannabis: "rec",
    revenue: "~$1.1B/yr",
    labelAt: [-105.6, 34.2],
    coords: [
      [-109.05, 37.0],
      [-103.0, 37.0],
      [-103.0, 32.0008],
      [-106.6167, 32.0008],
      [-106.6167, 31.9],
      [-106.53, 31.78],
      [-108.21, 31.78],
      [-108.21, 31.33],
      [-109.05, 31.33],
    ],
  },
  {
    id: "ar",
    name: "ARKANSAS",
    abbr: "AR",
    cannabis: "med",
    revenue: "~$280M/yr",
    labelAt: [-92.6, 34.8],
    coords: [
      [-94.62, 36.5],
      [-90.15, 36.5],
      [-90.15, 36.0],
      [-89.7, 36.0],
      [-90.3, 35.0],
      [-91.0, 33.7],
      [-91.2, 33.0],
      [-94.0431, 33.0195],
      [-94.4816, 33.6367],
      [-94.43, 35.4],
      [-94.62, 36.5],
    ],
  },
  {
    id: "la",
    name: "LOUISIANA",
    abbr: "LA",
    cannabis: "med",
    revenue: "~$100M/yr",
    labelAt: [-92.2, 31.2],
    coords: [
      [-94.0431, 33.0195],
      [-91.16, 33.0],
      [-91.0, 32.0],
      [-91.6, 31.0],
      [-89.7, 31.0],
      [-89.6, 30.2],
      [-89.2, 29.0],
      [-90.5, 29.0],
      [-92.0, 29.55],
      [-93.3, 29.7],
      ...[...SABINE].reverse(),
    ],
  },
  {
    id: "mx",
    // Deliberately no cannabis claim: possession is decriminalised and a medical
    // framework exists, but there's no regulated retail market to put a number
    // on, so asserting either symbol here would be wrong.
    name: "MEXICO",
    abbr: "MX",
    cannabis: null,
    revenue: null,
    labelAt: [-102.8, 26.6],
    coords: [
      ...RIO_GRANDE,
      [-106.53, 31.78],
      [-108.5, 31.33],
      [-108.5, 24.0],
      [-97.0, 24.0],
      [-97.0, 25.5],
      [-97.15, 26.07],
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Interstates & major US routes                                       */
/* ------------------------------------------------------------------ */

export const HIGHWAYS = [
  {
    id: "i35",
    label: "I-35",
    kind: "interstate",
    shieldAt: [-97.36, 31.1],
    coords: [
      [-99.48, 27.53],
      [-99.24, 28.44],
      [-98.49, 29.42],
      [-98.12, 29.7],
      [-97.94, 29.88],
      [-97.74, 30.27],
      [-97.68, 30.63],
      [-97.36, 31.1],
      [-97.15, 31.55],
      [-97.13, 32.01],
      [-97.13, 33.21],
      [-97.13, 33.63],
      [-97.15, 33.9],
    ],
  },
  {
    id: "i35e",
    label: "I-35E",
    kind: "interstate",
    shieldAt: [-96.9, 32.5],
    coords: [
      [-97.13, 32.01],
      [-96.95, 32.35],
      [-96.8, 32.78],
      [-96.99, 33.02],
      [-97.13, 33.21],
    ],
  },
  {
    id: "i35w",
    label: "I-35W",
    kind: "interstate",
    shieldAt: [-97.33, 32.5],
    coords: [
      [-97.13, 32.01],
      [-97.28, 32.4],
      [-97.33, 32.76],
      [-97.25, 33.0],
      [-97.13, 33.21],
    ],
  },
  {
    id: "i10",
    label: "I-10",
    kind: "interstate",
    shieldAt: [-102.88, 30.89],
    coords: [
      [-106.49, 31.76],
      [-105.6, 31.42],
      [-104.83, 31.04],
      [-104.23, 31.06],
      [-103.6, 30.98],
      [-102.88, 30.89],
      [-101.2, 30.71],
      [-100.5, 30.6],
      [-99.77, 30.49],
      [-99.14, 30.05],
      [-98.73, 29.79],
      [-98.49, 29.42],
      [-97.96, 29.57],
      [-97.65, 29.68],
      [-96.54, 29.71],
      [-95.82, 29.79],
      [-95.37, 29.76],
      [-94.98, 29.73],
      [-94.4, 29.9],
      [-94.13, 30.08],
      [-93.75, 30.17],
    ],
  },
  {
    id: "i45",
    label: "I-45",
    kind: "interstate",
    shieldAt: [-96.16, 31.72],
    coords: [
      [-96.8, 32.78],
      [-96.47, 32.1],
      [-96.16, 31.72],
      [-95.55, 30.72],
      [-95.46, 30.31],
      [-95.37, 29.76],
      [-94.95, 29.38],
      [-94.8, 29.3],
    ],
  },
  {
    id: "i20",
    label: "I-20",
    kind: "interstate",
    shieldAt: [-101.48, 32.25],
    coords: [
      [-104.23, 31.06],
      [-103.49, 31.42],
      [-102.89, 31.59],
      [-102.37, 31.85],
      [-102.08, 32.0],
      [-101.48, 32.25],
      [-100.41, 32.47],
      [-99.73, 32.45],
      [-98.98, 32.39],
      [-97.8, 32.76],
      [-97.33, 32.75],
      [-96.8, 32.72],
      [-96.28, 32.74],
      [-95.86, 32.56],
      [-95.42, 32.48],
      [-94.74, 32.5],
      [-94.37, 32.54],
      [-94.04, 32.5],
    ],
  },
  {
    id: "i30",
    label: "I-30",
    kind: "interstate",
    shieldAt: [-95.6, 33.14],
    coords: [
      [-97.33, 32.75],
      [-96.8, 32.78],
      [-96.11, 33.14],
      [-95.6, 33.14],
      [-94.97, 33.16],
      [-94.05, 33.43],
    ],
  },
  {
    id: "i27",
    label: "I-27",
    kind: "interstate",
    shieldAt: [-101.71, 34.19],
    coords: [
      [-101.86, 33.58],
      [-101.71, 34.19],
      [-101.92, 34.98],
      [-101.83, 35.22],
    ],
  },
  {
    id: "i40",
    label: "I-40",
    kind: "interstate",
    shieldAt: [-100.25, 35.21],
    coords: [
      [-103.04, 35.18],
      [-102.5, 35.2],
      [-101.83, 35.22],
      [-100.9, 35.24],
      [-100.25, 35.21],
      [-100.0, 35.2],
    ],
  },
  {
    id: "i37",
    label: "I-37",
    kind: "interstate",
    shieldAt: [-98.18, 28.46],
    coords: [
      [-98.49, 29.42],
      [-98.48, 28.97],
      [-98.18, 28.46],
      [-97.83, 28.09],
      [-97.4, 27.8],
    ],
  },
  {
    id: "i69",
    label: "I-69",
    kind: "interstate",
    shieldAt: [-97.0, 28.81],
    coords: [
      [-99.48, 27.53],
      [-98.62, 27.88],
      [-98.12, 28.33],
      [-97.0, 28.81],
      [-96.27, 29.2],
      [-95.81, 29.56],
      [-95.37, 29.76],
      [-95.09, 30.34],
      [-94.93, 30.71],
      [-94.73, 31.34],
      [-94.66, 31.6],
      [-94.34, 32.16],
      [-94.37, 32.54],
      [-94.05, 33.43],
    ],
  },
  {
    id: "us287",
    label: "US-287",
    kind: "us",
    shieldAt: [-99.3, 34.2],
    coords: [
      [-101.83, 35.22],
      [-100.52, 34.98],
      [-99.9, 34.4],
      [-98.49, 33.91],
      [-97.8, 33.45],
      [-97.33, 32.75],
    ],
  },
  {
    id: "us83",
    label: "US-83",
    kind: "us",
    shieldAt: [-99.9, 30.5],
    coords: [
      [-100.2, 36.4],
      [-100.27, 35.5],
      [-100.52, 34.98],
      [-100.4, 34.0],
      [-99.78, 33.2],
      [-99.88, 32.4],
      [-99.9, 31.4],
      [-99.9, 30.5],
      [-99.78, 29.8],
      [-99.35, 28.9],
      [-99.1, 28.0],
      [-98.9, 27.2],
      [-98.23, 26.2],
      [-97.5, 25.95],
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Major rivers                                                        */
/* ------------------------------------------------------------------ */

export const RIVERS = [
  {
    id: "brazos",
    name: "BRAZOS",
    labelAt: [-96.9, 31.1],
    rotate: 52,
    coords: [
      [-100.5, 33.2],
      [-99.6, 33.0],
      [-98.9, 32.6],
      [-98.2, 32.3],
      [-97.6, 31.9],
      [-96.9, 31.1],
      [-96.4, 30.6],
      [-96.1, 30.0],
      [-95.7, 29.4],
      [-95.37, 28.88],
    ],
  },
  {
    id: "colorado",
    name: "COLORADO",
    labelAt: [-98.7, 30.9],
    rotate: 34,
    coords: [
      [-101.3, 32.5],
      [-100.7, 32.1],
      [-100.2, 31.8],
      [-99.4, 31.4],
      [-98.7, 30.9],
      [-98.4, 30.5],
      [-97.74, 30.27],
      [-96.9, 29.9],
      [-96.4, 29.4],
      [-95.98, 28.6],
    ],
  },
  {
    id: "trinity",
    name: "TRINITY",
    labelAt: [-95.6, 31.2],
    rotate: 62,
    coords: [
      [-97.1, 33.2],
      [-96.9, 32.9],
      [-96.6, 32.7],
      [-96.0, 32.0],
      [-95.6, 31.2],
      [-95.1, 30.5],
      [-94.8, 29.9],
      [-94.7, 29.75],
    ],
  },
  {
    id: "pecos",
    name: "PECOS",
    labelAt: [-102.3, 30.7],
    rotate: 62,
    coords: [
      [-104.4, 32.9],
      [-103.9, 32.3],
      [-103.6, 31.9],
      [-103.5, 31.4],
      [-102.9, 31.0],
      [-102.3, 30.7],
      [-101.8, 30.0],
      [-101.4, 29.65],
    ],
  },
  {
    id: "nueces",
    name: "NUECES",
    labelAt: [-99.2, 28.7],
    rotate: 26,
    coords: [
      [-100.2, 30.0],
      [-99.8, 29.3],
      [-99.2, 28.7],
      [-98.2, 28.2],
      [-97.6, 28.0],
      [-97.5, 27.87],
    ],
  },
  {
    id: "canadian",
    name: "CANADIAN",
    labelAt: [-101.5, 35.55],
    rotate: 0,
    coords: [
      [-103.0, 35.62],
      [-102.0, 35.6],
      [-101.0, 35.5],
      [-100.0, 35.4],
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Cities — `tier` controls what shows at which zoom level             */
/* tier 1: always visible.  tier 2: mid zoom.  tier 3: close zoom.     */
/* ------------------------------------------------------------------ */

export const CITIES = [
  { name: "HOUSTON", lng: -95.3698, lat: 29.7604, tier: 1, pop: "2.3M" },
  { name: "SAN ANTONIO", lng: -98.4936, lat: 29.4241, tier: 1, pop: "1.5M", anchor: "end" },
  // Dallas and Fort Worth are one metro on this map. Two tier-1 labels 28 miles
  // apart just stacked on each other, so they read as the single place people
  // actually call it — the midpoint of the two city centres. `short` is what the
  // map draws (a 17-character label swamped the metroplex); the full name is
  // kept for the quick-jump chip.
  {
    name: "DALLAS–FORT WORTH",
    short: "DFW",
    lng: -97.064,
    lat: 32.766,
    tier: 1,
    pop: "2.3M",
  },
  { name: "AUSTIN", lng: -97.7431, lat: 30.2672, tier: 1, pop: "980K", capital: true },
  { name: "EL PASO", lng: -106.485, lat: 31.7619, tier: 1, pop: "680K" },

  { name: "ARLINGTON", lng: -97.1081, lat: 32.7357, tier: 2, pop: "400K" },
  { name: "CORPUS CHRISTI", lng: -97.3964, lat: 27.8006, tier: 2, pop: "320K" },
  { name: "PLANO", lng: -96.6989, lat: 33.0198, tier: 2, pop: "290K" },
  { name: "LUBBOCK", lng: -101.8552, lat: 33.5779, tier: 2, pop: "260K" },
  { name: "LAREDO", lng: -99.4803, lat: 27.5306, tier: 2, pop: "255K" },
  { name: "AMARILLO", lng: -101.8313, lat: 35.222, tier: 2, pop: "200K" },
  { name: "BROWNSVILLE", lng: -97.4975, lat: 25.9017, tier: 2, pop: "190K" },
  { name: "MCALLEN", lng: -98.23, lat: 26.2034, tier: 2, pop: "145K" },
  { name: "WACO", lng: -97.1467, lat: 31.5493, tier: 2, pop: "140K" },
  { name: "MIDLAND", lng: -102.0779, lat: 31.9973, tier: 2, pop: "135K" },
  { name: "ODESSA", lng: -102.3676, lat: 31.8457, tier: 2, pop: "115K" },
  { name: "ABILENE", lng: -99.7331, lat: 32.4487, tier: 2, pop: "125K" },
  { name: "BEAUMONT", lng: -94.1266, lat: 30.0802, tier: 2, pop: "115K" },
  { name: "GALVESTON", lng: -94.7977, lat: 29.3013, tier: 2, pop: "53K" },
  { name: "TYLER", lng: -95.3011, lat: 32.3513, tier: 2, pop: "108K" },
  { name: "DENTON", lng: -97.1331, lat: 33.2148, tier: 2, pop: "150K" },
  { name: "KILLEEN", lng: -97.7278, lat: 31.1171, tier: 2, pop: "155K" },
  { name: "WICHITA FALLS", lng: -98.4934, lat: 33.9137, tier: 2, pop: "102K" },
  { name: "COLLEGE STATION", lng: -96.3344, lat: 30.628, tier: 2, pop: "120K" },
  { name: "SAN ANGELO", lng: -100.437, lat: 31.4638, tier: 2, pop: "100K" },
  { name: "TEXARKANA", lng: -94.0477, lat: 33.4251, tier: 2, pop: "36K" },
  { name: "LONGVIEW", lng: -94.7405, lat: 32.5007, tier: 2, pop: "82K" },
  { name: "VICTORIA", lng: -97.0036, lat: 28.8053, tier: 2, pop: "65K" },

  { name: "MCKINNEY", lng: -96.6398, lat: 33.1972, tier: 3, pop: "215K" },
  { name: "FLOWER MOUND", lng: -97.0969, lat: 33.0146, tier: 3, pop: "80K" },
  { name: "ROCKWALL", lng: -96.4597, lat: 32.9312, tier: 3, pop: "50K" },
  { name: "EDGEWOOD", lng: -95.8869, lat: 32.6982, tier: 3, pop: "1.5K" },
  { name: "MINEOLA", lng: -95.4883, lat: 32.6632, tier: 3, pop: "4.8K" },
  { name: "GEORGETOWN", lng: -97.6772, lat: 30.6333, tier: 3, pop: "96K" },
  { name: "CONROE", lng: -95.4561, lat: 30.3119, tier: 3, pop: "105K" },
  { name: "MONTGOMERY", lng: -95.6963, lat: 30.3888, tier: 3, pop: "2.1K" },
  { name: "BRENHAM", lng: -96.3977, lat: 30.1669, tier: 3, pop: "18K" },
  { name: "NEW BRAUNFELS", lng: -98.1245, lat: 29.703, tier: 3, pop: "108K" },
  { name: "ROUND ROCK", lng: -97.6789, lat: 30.5083, tier: 3, pop: "125K" },
  { name: "PORT ARTHUR", lng: -93.94, lat: 29.885, tier: 3, pop: "55K" },
  { name: "DEL RIO", lng: -100.8968, lat: 29.3627, tier: 3, pop: "34K" },
  { name: "EAGLE PASS", lng: -100.4995, lat: 28.7091, tier: 3, pop: "28K" },
  { name: "HARLINGEN", lng: -97.6961, lat: 26.1906, tier: 3, pop: "71K" },
  { name: "LUFKIN", lng: -94.7291, lat: 31.3382, tier: 3, pop: "34K" },
  { name: "NACOGDOCHES", lng: -94.6555, lat: 31.6035, tier: 3, pop: "32K" },
  { name: "SHERMAN", lng: -96.6089, lat: 33.6357, tier: 3, pop: "45K" },
  { name: "PARIS", lng: -95.5555, lat: 33.6609, tier: 3, pop: "25K" },
  { name: "BIG SPRING", lng: -101.4787, lat: 32.2504, tier: 3, pop: "26K" },
  { name: "PECOS", lng: -103.4932, lat: 31.4229, tier: 3, pop: "12K" },
  { name: "ALPINE", lng: -103.6613, lat: 30.3585, tier: 3, pop: "6K" },
  { name: "MARFA", lng: -104.0207, lat: 30.3095, tier: 3, pop: "1.8K" },
  { name: "PLEASANTON", lng: -98.4783, lat: 28.9672, tier: 3, pop: "11K" },

  /* ---- Regional hubs (tier 3) ---- */
  { name: "TEMPLE", lng: -97.3428, lat: 31.0982, tier: 3, pop: "82K" },
  { name: "BRYAN", lng: -96.37, lat: 30.6744, tier: 3, pop: "86K" },
  { name: "HUNTSVILLE", lng: -95.5508, lat: 30.7235, tier: 3, pop: "46K" },
  { name: "MARSHALL", lng: -94.3674, lat: 32.5449, tier: 3, pop: "23K" },
  { name: "PALESTINE", lng: -95.6308, lat: 31.7621, tier: 3, pop: "18K" },
  { name: "PLAINVIEW", lng: -101.7068, lat: 34.1848, tier: 3, pop: "20K" },
  { name: "SWEETWATER", lng: -100.4062, lat: 32.471, tier: 3, pop: "10K" },
  { name: "UVALDE", lng: -99.7862, lat: 29.2097, tier: 3, pop: "15K" },
  { name: "KINGSVILLE", lng: -97.8561, lat: 27.5159, tier: 3, pop: "25K" },
  { name: "EDINBURG", lng: -98.1633, lat: 26.3017, tier: 3, pop: "101K" },
  { name: "FORT STOCKTON", lng: -102.8794, lat: 30.8938, tier: 3, pop: "8K" },
  { name: "VAN HORN", lng: -104.8322, lat: 31.0393, tier: 3, pop: "2K" },
  { name: "ORANGE", lng: -93.7366, lat: 30.093, tier: 3, pop: "19K" },

  /* ---- DFW Metroplex (tier 4) ---- */
  { name: "IRVING", lng: -96.9489, lat: 32.814, tier: 4, pop: "256K" },
  { name: "GRAPEVINE", lng: -97.0781, lat: 32.9343, tier: 4, pop: "50K" },
  { name: "GARLAND", lng: -96.6389, lat: 32.9126, tier: 4, pop: "245K" },
  { name: "MESQUITE", lng: -96.5992, lat: 32.7668, tier: 4, pop: "150K" },
  { name: "FRISCO", lng: -96.8236, lat: 33.1507, tier: 4, pop: "225K" },
  { name: "ALLEN", lng: -96.6706, lat: 33.1032, tier: 4, pop: "110K" },
  { name: "RICHARDSON", lng: -96.7299, lat: 32.9483, tier: 4, pop: "120K" },
  { name: "CARROLLTON", lng: -96.8903, lat: 32.9537, tier: 4, pop: "135K" },
  { name: "LEWISVILLE", lng: -96.9942, lat: 33.0462, tier: 4, pop: "130K" },
  { name: "GRAND PRAIRIE", lng: -96.9978, lat: 32.746, tier: 4, pop: "200K" },
  { name: "EULESS", lng: -97.0819, lat: 32.8371, tier: 4, pop: "61K" },
  { name: "BEDFORD", lng: -97.1431, lat: 32.844, tier: 4, pop: "49K" },
  { name: "HURST", lng: -97.1706, lat: 32.8235, tier: 4, pop: "40K" },
  { name: "N. RICHLAND HILLS", lng: -97.2289, lat: 32.8343, tier: 4, pop: "70K" },
  { name: "SOUTHLAKE", lng: -97.1342, lat: 32.9412, tier: 4, pop: "31K" },
  { name: "KELLER", lng: -97.2289, lat: 32.9346, tier: 4, pop: "45K" },
  { name: "COLLEYVILLE", lng: -97.155, lat: 32.8807, tier: 4, pop: "26K" },
  { name: "COPPELL", lng: -96.99, lat: 32.9546, tier: 4, pop: "42K" },
  { name: "FARMERS BRANCH", lng: -96.8961, lat: 32.9268, tier: 4, pop: "36K" },
  { name: "ADDISON", lng: -96.8292, lat: 32.9618, tier: 4, pop: "16K" },
  { name: "DUNCANVILLE", lng: -96.9083, lat: 32.6518, tier: 4, pop: "40K" },
  { name: "DESOTO", lng: -96.857, lat: 32.5896, tier: 4, pop: "56K" },
  { name: "CEDAR HILL", lng: -96.9561, lat: 32.5885, tier: 4, pop: "49K" },
  { name: "LANCASTER", lng: -96.7561, lat: 32.5921, tier: 4, pop: "41K" },
  { name: "MANSFIELD", lng: -97.1417, lat: 32.5632, tier: 4, pop: "76K" },
  { name: "BURLESON", lng: -97.3208, lat: 32.5421, tier: 4, pop: "51K" },
  { name: "CLEBURNE", lng: -97.3867, lat: 32.3476, tier: 4, pop: "31K" },
  { name: "WAXAHACHIE", lng: -96.8483, lat: 32.3865, tier: 4, pop: "42K" },
  { name: "MIDLOTHIAN", lng: -96.9944, lat: 32.4826, tier: 4, pop: "35K" },
  { name: "ENNIS", lng: -96.6253, lat: 32.3293, tier: 4, pop: "20K" },
  { name: "CORSICANA", lng: -96.4689, lat: 32.0954, tier: 4, pop: "25K" },
  { name: "TERRELL", lng: -96.2753, lat: 32.7357, tier: 4, pop: "18K" },
  { name: "FORNEY", lng: -96.4719, lat: 32.7482, tier: 4, pop: "26K" },
  { name: "GREENVILLE", lng: -96.1108, lat: 33.1384, tier: 4, pop: "29K" },
  { name: "WYLIE", lng: -96.5389, lat: 33.0151, tier: 4, pop: "58K" },
  { name: "ROWLETT", lng: -96.5638, lat: 32.9029, tier: 4, pop: "63K" },
  { name: "SACHSE", lng: -96.5952, lat: 32.9762, tier: 4, pop: "27K" },
  { name: "MURPHY", lng: -96.613, lat: 33.0151, tier: 4, pop: "21K" },
  { name: "PROSPER", lng: -96.8011, lat: 33.2362, tier: 4, pop: "38K" },
  { name: "CELINA", lng: -96.7847, lat: 33.3245, tier: 4, pop: "30K" },
  { name: "LITTLE ELM", lng: -96.9375, lat: 33.1626, tier: 4, pop: "51K" },
  { name: "THE COLONY", lng: -96.8861, lat: 33.089, tier: 4, pop: "45K" },
  { name: "HIGHLAND VILLAGE", lng: -97.047, lat: 33.0918, tier: 4, pop: "16K" },
  { name: "TROPHY CLUB", lng: -97.1861, lat: 33.0037, tier: 4, pop: "13K" },
  { name: "ROANOKE", lng: -97.2258, lat: 33.004, tier: 4, pop: "10K" },
  { name: "ARGYLE", lng: -97.1836, lat: 33.1218, tier: 4, pop: "5K" },
  { name: "SAGINAW", lng: -97.3639, lat: 32.8601, tier: 4, pop: "24K" },
  { name: "WATAUGA", lng: -97.2547, lat: 32.8579, tier: 4, pop: "24K" },
  { name: "HALTOM CITY", lng: -97.2692, lat: 32.7996, tier: 4, pop: "46K" },
  { name: "WHITE SETTLEMENT", lng: -97.4586, lat: 32.7593, tier: 4, pop: "18K" },
  { name: "BENBROOK", lng: -97.4606, lat: 32.6732, tier: 4, pop: "24K" },
  { name: "CROWLEY", lng: -97.3628, lat: 32.5793, tier: 4, pop: "18K" },
  { name: "AZLE", lng: -97.5453, lat: 32.8957, tier: 4, pop: "13K" },
  { name: "WEATHERFORD", lng: -97.7972, lat: 32.7593, tier: 4, pop: "32K" },
  { name: "GRANBURY", lng: -97.7942, lat: 32.4421, tier: 4, pop: "11K" },
  { name: "MINERAL WELLS", lng: -98.1128, lat: 32.8085, tier: 4, pop: "15K" },
  { name: "KAUFMAN", lng: -96.3086, lat: 32.5885, tier: 4, pop: "8K" },
  { name: "SANGER", lng: -97.1739, lat: 33.3643, tier: 4, pop: "9K" },
  { name: "GAINESVILLE", lng: -97.1333, lat: 33.6259, tier: 4, pop: "17K" },
  { name: "DENISON", lng: -96.5367, lat: 33.7557, tier: 4, pop: "25K" },
  { name: "BONHAM", lng: -96.1778, lat: 33.5776, tier: 4, pop: "10K" },
  { name: "SULPHUR SPRINGS", lng: -95.6011, lat: 33.1384, tier: 4, pop: "16K" },
  { name: "MOUNT PLEASANT", lng: -94.9683, lat: 33.1568, tier: 4, pop: "16K" },

  /* ---- Greater Houston (tier 4) ---- */
  { name: "PASADENA", lng: -95.2091, lat: 29.6911, tier: 4, pop: "150K" },
  { name: "SUGAR LAND", lng: -95.6142, lat: 29.5994, tier: 4, pop: "111K" },
  { name: "KATY", lng: -95.8245, lat: 29.7858, tier: 4, pop: "22K" },
  { name: "PEARLAND", lng: -95.286, lat: 29.5636, tier: 4, pop: "125K" },
  { name: "THE WOODLANDS", lng: -95.4613, lat: 30.1658, tier: 4, pop: "115K" },
  { name: "SPRING", lng: -95.4172, lat: 30.0799, tier: 4, pop: "62K" },
  { name: "CYPRESS", lng: -95.6972, lat: 29.9691, tier: 4, pop: "190K" },
  { name: "BAYTOWN", lng: -94.9774, lat: 29.7355, tier: 4, pop: "83K" },
  { name: "LEAGUE CITY", lng: -95.0949, lat: 29.5075, tier: 4, pop: "115K" },
  { name: "MISSOURI CITY", lng: -95.5377, lat: 29.6186, tier: 4, pop: "75K" },
  { name: "FRIENDSWOOD", lng: -95.201, lat: 29.5294, tier: 4, pop: "41K" },
  { name: "HUMBLE", lng: -95.2622, lat: 29.9988, tier: 4, pop: "16K" },
  { name: "TOMBALL", lng: -95.6161, lat: 30.0972, tier: 4, pop: "12K" },
  { name: "RICHMOND", lng: -95.7607, lat: 29.5822, tier: 4, pop: "12K" },
  { name: "ROSENBERG", lng: -95.8085, lat: 29.5572, tier: 4, pop: "40K" },
  { name: "TEXAS CITY", lng: -94.9027, lat: 29.3838, tier: 4, pop: "51K" },
  { name: "LA PORTE", lng: -95.0193, lat: 29.6658, tier: 4, pop: "35K" },
  { name: "DEER PARK", lng: -95.1238, lat: 29.7052, tier: 4, pop: "34K" },
  { name: "STAFFORD", lng: -95.5577, lat: 29.6161, tier: 4, pop: "18K" },
  { name: "ALVIN", lng: -95.2441, lat: 29.4238, tier: 4, pop: "27K" },
  { name: "ANGLETON", lng: -95.4319, lat: 29.1694, tier: 4, pop: "19K" },
  { name: "LAKE JACKSON", lng: -95.4344, lat: 29.0339, tier: 4, pop: "28K" },
  { name: "SILSBEE", lng: -94.1774, lat: 30.3491, tier: 4, pop: "7K" },
  { name: "VIDOR", lng: -93.9977, lat: 30.1316, tier: 4, pop: "10K" },

  /* ---- Greater Austin (tier 4) ---- */
  { name: "CEDAR PARK", lng: -97.8203, lat: 30.5052, tier: 4, pop: "80K" },
  { name: "PFLUGERVILLE", lng: -97.62, lat: 30.4394, tier: 4, pop: "68K" },
  { name: "LEANDER", lng: -97.8531, lat: 30.5788, tier: 4, pop: "75K" },
  { name: "KYLE", lng: -97.8772, lat: 29.9891, tier: 4, pop: "57K" },
  { name: "SAN MARCOS", lng: -97.9414, lat: 29.8833, tier: 4, pop: "72K" },
  { name: "BUDA", lng: -97.8403, lat: 30.0855, tier: 4, pop: "18K" },
  { name: "BASTROP", lng: -97.3153, lat: 30.1105, tier: 4, pop: "10K" },
  { name: "LAKEWAY", lng: -97.9797, lat: 30.3646, tier: 4, pop: "20K" },
  { name: "HUTTO", lng: -97.5467, lat: 30.5427, tier: 4, pop: "31K" },
  { name: "TAYLOR", lng: -97.4092, lat: 30.571, tier: 4, pop: "17K" },
  { name: "ELGIN", lng: -97.3706, lat: 30.3499, tier: 4, pop: "10K" },
  { name: "DRIPPING SPRINGS", lng: -98.0867, lat: 30.1902, tier: 4, pop: "5K" },
  { name: "BELTON", lng: -97.4642, lat: 31.0568, tier: 4, pop: "24K" },

  /* ---- Greater San Antonio & Hill Country (tier 4) ---- */
  { name: "SCHERTZ", lng: -98.2695, lat: 29.5522, tier: 4, pop: "44K" },
  { name: "SEGUIN", lng: -97.9647, lat: 29.5688, tier: 4, pop: "31K" },
  { name: "BOERNE", lng: -98.732, lat: 29.7947, tier: 4, pop: "20K" },
  { name: "CONVERSE", lng: -98.3161, lat: 29.518, tier: 4, pop: "28K" },
  { name: "UNIVERSAL CITY", lng: -98.2905, lat: 29.548, tier: 4, pop: "20K" },
  { name: "HELOTES", lng: -98.69, lat: 29.5783, tier: 4, pop: "10K" },
  { name: "KERRVILLE", lng: -99.1403, lat: 30.0474, tier: 4, pop: "24K" },
  { name: "FREDERICKSBURG", lng: -98.872, lat: 30.2752, tier: 4, pop: "11K" },
  { name: "FLORESVILLE", lng: -98.1561, lat: 29.1338, tier: 4, pop: "7K" },

  /* ---- Rio Grande Valley & South (tier 4) ---- */
  { name: "MISSION", lng: -98.3253, lat: 26.2159, tier: 4, pop: "86K" },
  { name: "PHARR", lng: -98.1836, lat: 26.1948, tier: 4, pop: "80K" },
  { name: "WESLACO", lng: -97.9908, lat: 26.1595, tier: 4, pop: "41K" },
  { name: "SAN BENITO", lng: -97.6311, lat: 26.1326, tier: 4, pop: "24K" },
  { name: "RIO GRANDE CITY", lng: -98.8203, lat: 26.3798, tier: 4, pop: "15K" },
  { name: "ALICE", lng: -98.0697, lat: 27.7523, tier: 4, pop: "18K" },
  { name: "BEEVILLE", lng: -97.7486, lat: 28.4011, tier: 4, pop: "12K" },
  { name: "ROCKPORT", lng: -97.0544, lat: 28.0206, tier: 4, pop: "10K" },
  { name: "PORT LAVACA", lng: -96.6261, lat: 28.615, tier: 4, pop: "11K" },
  { name: "CARRIZO SPRINGS", lng: -99.8606, lat: 28.5222, tier: 4, pop: "5K" },

  /* ---- East & Central Texas (tier 4) ---- */
  { name: "KILGORE", lng: -94.8752, lat: 32.3862, tier: 4, pop: "13K" },
  { name: "HENDERSON", lng: -94.7994, lat: 32.1532, tier: 4, pop: "13K" },
  { name: "CARTHAGE", lng: -94.3374, lat: 32.1571, tier: 4, pop: "6K" },
  { name: "JACKSONVILLE", lng: -95.2705, lat: 31.9638, tier: 4, pop: "14K" },
  { name: "ATHENS", lng: -95.8555, lat: 32.2049, tier: 4, pop: "13K" },
  { name: "CROCKETT", lng: -95.4569, lat: 31.3182, tier: 4, pop: "6K" },
  { name: "CENTER", lng: -94.1791, lat: 31.7957, tier: 4, pop: "5K" },
  { name: "JASPER", lng: -93.9966, lat: 30.9204, tier: 4, pop: "7K" },
  { name: "WOODVILLE", lng: -94.4155, lat: 30.7749, tier: 4, pop: "2K" },
  { name: "MADISONVILLE", lng: -95.9111, lat: 30.9491, tier: 4, pop: "4K" },
  { name: "NAVASOTA", lng: -96.0872, lat: 30.3877, tier: 4, pop: "8K" },
  { name: "CALDWELL", lng: -96.6939, lat: 30.5316, tier: 4, pop: "4K" },
  { name: "GIDDINGS", lng: -96.9366, lat: 30.183, tier: 4, pop: "5K" },
  { name: "LA GRANGE", lng: -96.8767, lat: 29.9052, tier: 4, pop: "5K" },
  { name: "COLUMBUS", lng: -96.5397, lat: 29.706, tier: 4, pop: "4K" },
  { name: "WHARTON", lng: -96.1027, lat: 29.3116, tier: 4, pop: "9K" },
  { name: "EL CAMPO", lng: -96.2697, lat: 29.1963, tier: 4, pop: "11K" },
  { name: "BAY CITY", lng: -95.9694, lat: 28.9828, tier: 4, pop: "17K" },

  /* ---- West Texas & Panhandle (tier 4) ---- */
  { name: "CANYON", lng: -101.9188, lat: 34.9803, tier: 4, pop: "17K" },
  { name: "BORGER", lng: -101.3974, lat: 35.6678, tier: 4, pop: "12K" },
  { name: "PAMPA", lng: -100.9599, lat: 35.5362, tier: 4, pop: "17K" },
  { name: "DUMAS", lng: -101.9732, lat: 35.8656, tier: 4, pop: "14K" },
  { name: "HEREFORD", lng: -102.3977, lat: 34.8153, tier: 4, pop: "14K" },
  { name: "LEVELLAND", lng: -102.3777, lat: 33.5873, tier: 4, pop: "12K" },
  { name: "SNYDER", lng: -100.9176, lat: 32.7179, tier: 4, pop: "11K" },
  { name: "LAMESA", lng: -101.951, lat: 32.7376, tier: 4, pop: "9K" },
  { name: "ANDREWS", lng: -102.5457, lat: 32.3187, tier: 4, pop: "13K" },
  { name: "MONAHANS", lng: -102.8927, lat: 31.5943, tier: 4, pop: "7K" },
  { name: "BROWNWOOD", lng: -98.9911, lat: 31.7093, tier: 4, pop: "18K" },
  { name: "STEPHENVILLE", lng: -98.2023, lat: 32.2207, tier: 4, pop: "21K" },
  { name: "VERNON", lng: -99.2665, lat: 34.1548, tier: 4, pop: "10K" },
  { name: "CHILDRESS", lng: -100.204, lat: 34.4265, tier: 4, pop: "6K" },
  { name: "PRESIDIO", lng: -104.3708, lat: 29.5605, tier: 4, pop: "4K" },
];

/* ------------------------------------------------------------------ */
/* Landmarks                                                           */
/* ------------------------------------------------------------------ */

export const LANDMARKS = [
  { name: "TEXAS STATE CAPITOL", icon: "🏛️", lng: -97.7404, lat: 30.2747, tier: 1 },
  { name: "THE ALAMO", icon: "🏰", lng: -98.4861, lat: 29.426, tier: 1 },
  { name: "NASA JOHNSON SPACE CENTER", icon: "🚀", lng: -95.09, lat: 29.5593, tier: 2 },
  { name: "BIG BEND NATIONAL PARK", icon: "🏜️", lng: -103.2502, lat: 29.2498, tier: 1 },
  { name: "GUADALUPE PEAK", icon: "⛰️", lng: -104.8606, lat: 31.8914, tier: 2 },
  { name: "PALO DURO CANYON", icon: "🏞️", lng: -101.6874, lat: 34.9375, tier: 2 },
  { name: "PADRE ISLAND SEASHORE", icon: "🏖️", lng: -97.38, lat: 27.0, tier: 2 },
  { name: "PORT OF HOUSTON", icon: "⚓", lng: -95.0, lat: 29.72, tier: 3 },
  { name: "CADILLAC RANCH", icon: "🚗", lng: -101.9871, lat: 35.1872, tier: 3 },
  { name: "DEALEY PLAZA", icon: "📍", lng: -96.8083, lat: 32.7791, tier: 3 },
  { name: "AT&T STADIUM", icon: "🏟️", lng: -97.0945, lat: 32.7473, tier: 3 },
  { name: "FORT WORTH STOCKYARDS", icon: "🐂", lng: -97.3472, lat: 32.7887, tier: 3 },
  { name: "ENCHANTED ROCK", icon: "🪨", lng: -98.8195, lat: 30.5065, tier: 3 },
  { name: "CADDO LAKE", icon: "🌲", lng: -94.0313, lat: 32.7115, tier: 3 },
  { name: "SOUTH PADRE ISLAND", icon: "🌊", lng: -97.1681, lat: 26.1118, tier: 3 },
  { name: "LAKE AMISTAD", icon: "💧", lng: -101.05, lat: 29.5333, tier: 3 },
];

/* ------------------------------------------------------------------ */
/* Water labels                                                        */
/* ------------------------------------------------------------------ */

export const WATER_LABELS = [
  { name: "GULF OF AMERICA", lng: -92.9, lat: 26.4, size: 20 },
  { name: "RIO GRANDE", lng: -101.6, lat: 29.55, size: 12, rotate: -28 },
  { name: "RED RIVER", lng: -98.6, lat: 34.35, size: 11 },
  { name: "SABINE RIVER", lng: -93.6, lat: 31.4, size: 10, rotate: 72 },
];

/** Bounding box of Texas in projected SVG units. */
export const TEXAS_BBOX = (() => {
  const xs = TEXAS_OUTLINE.map(([lng]) => px(lng));
  const ys = TEXAS_OUTLINE.map(([, lat]) => py(lat));
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  return { x: minX, y: minY, w: Math.max(...xs) - minX, h: Math.max(...ys) - minY };
})();

/**
 * The default 16:9 view — Texas centred with the neighbouring states and the
 * Gulf filling the margins.
 */
export const DEFAULT_VIEW = (() => {
  const pad = 60;
  const h = TEXAS_BBOX.h + pad * 2;
  const w = (h * 16) / 9;
  return {
    x: TEXAS_BBOX.x + TEXAS_BBOX.w / 2 - w / 2,
    y: TEXAS_BBOX.y - pad,
    w,
    h,
  };
})();

/** A tight 16:9 window centred on a point, used when zooming to a lawmaker. */
export function viewAround(lng, lat, height = 300) {
  const w = (height * 16) / 9;
  return { x: px(lng) - w / 2, y: py(lat) - height / 2, w, h: height };
}

/* ------------------------------------------------------------------ */
/* City territory borders                                              */
/*                                                                     */
/* Real municipal limits for 200 towns aren't something we can ship by  */
/* hand, so we derive each city's catchment as a Voronoi cell over the  */
/* city points and clip the whole layer to the Texas outline in SVG.    */
/* The result reads like a county/metro boundary map and answers "what  */
/* am I looking at here" at any zoom.                                   */
/* ------------------------------------------------------------------ */

/** Clip a convex polygon to the half-plane of points nearer to A than to B. */
function clipHalfPlane(poly, ax, ay, bx, by) {
  if (poly.length === 0) return poly;
  const mx = (ax + bx) / 2;
  const my = (ay + by) / 2;
  const dx = bx - ax;
  const dy = by - ay;
  const side = (p) => (p[0] - mx) * dx + (p[1] - my) * dy;

  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const cur = poly[i];
    const prev = poly[(i + poly.length - 1) % poly.length];
    const curS = side(cur);
    const prevS = side(prev);
    const curIn = curS <= 0;
    const prevIn = prevS <= 0;

    if (curIn !== prevIn) {
      const t = prevS / (prevS - curS);
      out.push([prev[0] + t * (cur[0] - prev[0]), prev[1] + t * (cur[1] - prev[1])]);
    }
    if (curIn) out.push(cur);
  }
  return out;
}

/** Voronoi cells for the city list, in projected SVG space. */
export const CITY_CELLS = (() => {
  const pad = 200;
  const box = [
    [TEXAS_BBOX.x - pad, TEXAS_BBOX.y - pad],
    [TEXAS_BBOX.x + TEXAS_BBOX.w + pad, TEXAS_BBOX.y - pad],
    [TEXAS_BBOX.x + TEXAS_BBOX.w + pad, TEXAS_BBOX.y + TEXAS_BBOX.h + pad],
    [TEXAS_BBOX.x - pad, TEXAS_BBOX.y + TEXAS_BBOX.h + pad],
  ];

  const sites = CITIES.map((c) => ({ x: px(c.lng), y: py(c.lat) }));

  return CITIES.map((city, i) => {
    let cell = box;
    for (let j = 0; j < sites.length; j++) {
      if (i === j) continue;
      cell = clipHalfPlane(cell, sites[i].x, sites[i].y, sites[j].x, sites[j].y);
      if (cell.length === 0) break;
    }
    return {
      name: city.name,
      tier: city.tier,
      d:
        cell.length > 2
          ? cell
              .map((p, k) => `${k === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`)
              .join(" ") + " Z"
          : "",
    };
  }).filter((c) => c.d);
})();

/** The Texas outline as an SVG path — used as the clip for the border layer. */
export const TEXAS_PATH = toPath(TEXAS_OUTLINE, true);
