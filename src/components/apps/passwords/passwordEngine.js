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

/**
 * The symbol vault: characters no ordinary generator offers, but that plenty of
 * password fields will take. Strictly opt-in, one character at a time — nothing
 * in here is ever on by default. The degree sign (U+00B0) leads the list.
 *
 * Every entry is a single code point that NFC and NFKC both leave alone, so
 * what is generated is exactly what gets pasted and stored, even on a site that
 * normalises passwords. Left out on purpose:
 *   - lookalikes of ordinary characters or of each other (º and ˚ vs °, × vs x,
 *     – vs -, µ vs μ, ∑ vs Σ, β vs ß, ◆ vs ♦, ☆ vs ★), which nobody can match
 *     back to the vault by eye
 *   - emoji too dark to read on this UI (🐾)
 *   - anything normalisation would rewrite (² ½ ™ … ″)
 *   - the space, which sites like to trim off the ends
 */
export const SYMBOL_VAULT = [
  { label: 'Signs', chars: [...'°§¶±÷¬¿«»†‡•‰‽©®'] },
  { label: 'ASCII outcasts', chars: [...'"\'`\\<>'] },
  { label: 'Currency', chars: [...'¢£€¥¤₿'] },
  { label: 'Math', chars: [...'∞≈≤≥√∫∇⊕'] },
  { label: 'Arrows', chars: [...'←↑→↓↔⇒'] },
  { label: 'Shapes', chars: [...'★♠♣♥♦♪♫☼☯☢⚡■▲⌘✓'] },
  { label: 'Letters', chars: [...'ßæøñçüåé'] },
  { label: 'Greek & Cyrillic', chars: [...'λπψθξδΣΩΔЖЯДФЩЮ'] },
  { label: 'Emoji', chars: [...'🐶🐕🦴🎸🔥💀👽🚀'] }
];

export const VAULT_CHARS = SYMBOL_VAULT.flatMap((group) => group.chars);

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
  const pools = [];

  if (options.useLowercase) pools.push(CHAR_SETS.lowercase);
  if (options.useUppercase) pools.push(CHAR_SETS.uppercase);
  if (options.useNumbers) pools.push(CHAR_SETS.numbers);
  if (options.useSymbols && options.symbolPool) pools.push(options.symbolPool);
  if (options.useVault && options.vaultPool) pools.push(options.vaultPool);

  return pools;
}

/**
 * How many characters the option set can draw from. Counted in code points:
 * a vault emoji is one character, not the two UTF-16 halves `.length` sees.
 * @param {object} options
 * @returns {number}
 */
export function countPool(options) {
  return Array.from(buildPools(options).join('')).length;
}

/**
 * Build a password that draws from every active pool at least once.
 * Returns an empty string when the options leave no characters to pick from.
 * @param {object} options
 * @returns {string}
 */
export function generatePassword(options) {
  // Sample whole code points, never UTF-16 halves, so a vault emoji survives intact.
  const pools = buildPools(options).map((pool) => Array.from(pool));
  if (!pools.length) return '';

  const combined = [].concat(...pools);
  const length = Math.max(MIN_PASSWORD_LENGTH, Math.min(MAX_PASSWORD_LENGTH, Math.round(options.length)));
  const chars = [];

  // Seed one guaranteed character per pool, then fill the remainder freely.
  for (let i = 0; i < pools.length && i < length; i++) {
    chars.push(pools[i][randomIndex(pools[i].length)]);
  }
  for (let i = chars.length; i < length; i++) {
    chars.push(combined[randomIndex(combined.length)]);
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
  const poolSize = countPool(options);
  if (poolSize < 2) return 0;
  const length = Math.max(MIN_PASSWORD_LENGTH, Math.min(MAX_PASSWORD_LENGTH, Math.round(options.length)));
  return length * (Math.log(poolSize) / Math.LN2);
}
