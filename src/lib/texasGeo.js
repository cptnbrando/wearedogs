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

export const NEIGHBORS = [
  {
    id: "ok",
    name: "OKLAHOMA",
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
    name: "MEXICO",
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
  { name: "DALLAS", lng: -96.797, lat: 32.7767, tier: 1, pop: "1.3M" },
  { name: "AUSTIN", lng: -97.7431, lat: 30.2672, tier: 1, pop: "980K", capital: true },
  // Fort Worth sits just west of Dallas — flip its label so the two don't stack.
  { name: "FORT WORTH", lng: -97.3308, lat: 32.7555, tier: 1, pop: "980K", anchor: "end" },
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
  { name: "GULF OF MEXICO", lng: -92.9, lat: 26.4, size: 22 },
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
