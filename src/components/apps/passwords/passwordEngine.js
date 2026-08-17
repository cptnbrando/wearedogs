// Character pools, CSPRNG sampling, and entropy math for the Password Generator app.
// Kept free of Svelte so the generation rules stay testable and reusable.

export const MIN_PASSWORD_LENGTH = 4;
export const MAX_PASSWORD_LENGTH = 200;
export const DEFAULT_PASSWORD_LENGTH = 30;

export const CHAR_SETS = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.?/|~'
};

/** Glyphs that are easy to misread across common fonts (l vs 1 vs I, O vs 0). */
export const AMBIGUOUS_CHARS = 'Il1|O0oB8S5Z2G6';

export const READABILITY_MODES = {
  ALL: 'all',
  READABLE: 'readable',
  SAYABLE: 'sayable'
};

/** Entropy thresholds in bits, ordered weakest first. Colors track the active theme. */
export const STRENGTH_TIERS = [
  { id: 'weak', label: 'Weak', minBits: 0, color: 'var(--color-neon-red, #ff3344)' },
  { id: 'fair', label: 'Fair', minBits: 45, color: 'var(--color-neon-orange, #ff8800)' },
  { id: 'strong', label: 'Strong', minBits: 80, color: 'var(--color-neon-green, #00d75f)' },
  { id: 'fortress', label: 'Fortress', minBits: 128, color: 'var(--color-neon-purple, #a000eb)' }
];

const UINT32_CEILING = 4294967296;
const RANDOM_BUFFER = new Uint32Array(1);

/**
 * Draw an unbiased integer in [0, range) from the platform CSPRNG.
 * Values landing in the ragged tail of the uint32 space are rejected and
 * redrawn so no character is ever slightly more likely than its neighbours.
 * @param {number} range
 * @returns {number}
 */
function randomIndex(range) {
  const limit = UINT32_CEILING - (UINT32_CEILING % range);
  let value = limit;
  while (value >= limit) {
    crypto.getRandomValues(RANDOM_BUFFER);
    value = RANDOM_BUFFER[0];
  }
  return value % range;
}

/**
 * Resolve the active option set into the individual character pools it allows.
 * Each surviving pool is guaranteed at least one slot in the final password.
 * @param {object} options
 * @returns {string[]}
 */
export function buildPools(options) {
  const isSayable = options.mode === READABILITY_MODES.SAYABLE;
  const pools = [];

  if (options.useLowercase) pools.push(CHAR_SETS.lowercase);
  if (options.useUppercase) pools.push(CHAR_SETS.uppercase);
  if (options.useNumbers && !isSayable) pools.push(CHAR_SETS.numbers);
  if (options.useSymbols && !isSayable && options.symbolPool) pools.push(options.symbolPool);

  if (options.mode !== READABILITY_MODES.READABLE) return pools;

  return pools
    .map((pool) => pool.split('').filter((char) => AMBIGUOUS_CHARS.indexOf(char) === -1).join(''))
    .filter(Boolean);
}

/**
 * Build a password that draws from every active pool at least once.
 * Returns an empty string when the options leave no characters to pick from.
 * @param {object} options
 * @returns {string}
 */
export function generatePassword(options) {
  const pools = buildPools(options);
  if (!pools.length) return '';

  const combined = pools.join('');
  const length = Math.max(MIN_PASSWORD_LENGTH, Math.min(MAX_PASSWORD_LENGTH, Math.round(options.length)));
  const chars = [];

  // Seed one guaranteed character per pool, then fill the remainder freely.
  for (let i = 0; i < pools.length && i < length; i++) {
    chars.push(pools[i].charAt(randomIndex(pools[i].length)));
  }
  for (let i = chars.length; i < length; i++) {
    chars.push(combined.charAt(randomIndex(combined.length)));
  }

  // Fisher-Yates, so the guaranteed characters never sit in a predictable prefix.
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomIndex(i + 1);
    const swap = chars[i];
    chars[i] = chars[j];
    chars[j] = swap;
  }

  return chars.join('');
}

/**
 * Shannon entropy of the option set, in bits, assuming uniform independent draws.
 * @param {object} options
 * @returns {number}
 */
export function calculateEntropy(options) {
  const poolSize = buildPools(options).join('').length;
  if (poolSize < 2) return 0;
  const length = Math.max(MIN_PASSWORD_LENGTH, Math.min(MAX_PASSWORD_LENGTH, Math.round(options.length)));
  return length * (Math.log(poolSize) / Math.LN2);
}

/**
 * Map an entropy score onto its strength tier.
 * @param {number} bits
 * @returns {{ id: string, label: string, minBits: number, color: string }}
 */
export function getStrengthTier(bits) {
  let tier = STRENGTH_TIERS[0];
  for (let i = 0; i < STRENGTH_TIERS.length; i++) {
    if (bits >= STRENGTH_TIERS[i].minBits) tier = STRENGTH_TIERS[i];
  }
  return tier;
}
