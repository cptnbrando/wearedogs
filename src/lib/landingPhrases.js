/**
 * Landing-page phrase catalogue for the WEAREDOGS title text.
 *
 * Every phrase is a list of word keys. Each key is resolved per language from
 * worldwidedogs.json (`we`, `are`, `dogs`, `go`, `run`, `this` plus their `_p`
 * pronunciation fields). The special `symbols` key renders the four chant
 * symbols in a random order that is fixed for the lifetime of the page load.
 */

export const RANDOM_PHRASE_ID = "random";
export const SYMBOLS_WORD_KEY = "symbols";
export const CHANT_SYMBOLS = ["%", "#", "$", "@"];

const SYMBOL_PRONUNCIATIONS = {
  "%": "percent",
  "#": "hash",
  $: "dollar",
  "@": "at",
};

export const LANDING_PHRASES = [
  {
    id: "we-are-dogs",
    label: "WE ARE DOGS",
    desc: "The classic three-line title",
    words: ["we", "are", "dogs"],
  },
  {
    id: "dogs",
    label: "DOGS",
    desc: "One word. That's it.",
    words: ["dogs"],
  },
  {
    id: "go-dogs",
    label: "GO DOGS",
    desc: "Game-day chant",
    words: ["go", "dogs"],
  },
  {
    id: "dogs-run-this",
    label: "DOGS RUN THIS %#$@",
    desc: "Symbols shuffle on every load",
    words: ["dogs", "run", "this", SYMBOLS_WORD_KEY],
  },
  {
    id: "dogs-dogs-dogs",
    label: "DOGS DOGS DOGS",
    desc: "Triple stack",
    words: ["dogs", "dogs", "dogs"],
  },
];

export const LANDING_PHRASE_IDS = LANDING_PHRASES.map((phrase) => phrase.id);

/** Look up a phrase by id, falling back to the classic WE ARE DOGS */
export function getPhraseById(id) {
  return LANDING_PHRASES.find((phrase) => phrase.id === id) || LANDING_PHRASES[0];
}

/**
 * Pick one phrase at random (page load, and idle rotation when the setting is "random").
 * @param {object} [exclude] phrase to leave out so a swap always shows something new
 */
export function pickRandomPhrase(exclude) {
  const pool = LANDING_PHRASES.filter((phrase) => phrase !== exclude);
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Return the four chant symbols in a fresh random order (Fisher-Yates) */
export function shuffleSymbols() {
  const symbols = CHANT_SYMBOLS.slice();
  for (let i = symbols.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = symbols[i];
    symbols[i] = symbols[j];
    symbols[j] = tmp;
  }
  return symbols;
}

/**
 * Resolve a phrase into displayable lines for one language.
 * @param {{words: string[]}} phrase
 * @param {Record<string, string>|undefined} translation entry from worldwidedogs.json
 * @param {string[]} symbols shuffled chant symbols for this page load
 * @returns {{text: string, pron: string}[]}
 */
export function resolvePhraseWords(phrase, translation, symbols) {
  return phrase.words.map((key) => {
    if (key === SYMBOLS_WORD_KEY) {
      return {
        text: symbols.join(""),
        pron: symbols.map((s) => SYMBOL_PRONUNCIATIONS[s] || s).join(" "),
      };
    }
    return {
      text: (translation && translation[key]) || "",
      pron: (translation && translation[key + "_p"]) || "",
    };
  });
}
