/**
 * The music player's colours (Settings > Music Player Color).
 *
 * A palette is four colours, each as an "r, g, b" triplet so the stylesheet
 * can use it at any opacity (src/styles/music-panel.scss reads them as
 * --mp-vox-rgb, --mp-ins-rgb, --mp-deep-rgb and --mp-ink-rgb):
 *   vox   paints the player while the VOX mix plays: play button, active
 *         song, badges, glows
 *   ins   takes over while the INS mix plays
 *   deep  is the far end of the player's gradients
 *   ink   is what sits on top of a filled accent (the play triangle)
 *
 * Every palette is tuned for the player's near-black panel. The defaults in
 * src/styles/_variables.scss ($mp-default-*) repeat DEFAULT_MUSIC_PALETTE,
 * for the first paint before this module has run.
 */

export const DEFAULT_MUSIC_PALETTE = "gold";

export const MUSIC_PALETTES = [
  {
    id: "gold",
    name: "Gold",
    desc: "DOGS gold on black, cream when the vocals drop out",
    vox: "230, 185, 0",
    ins: "255, 236, 170",
    deep: "255, 122, 0",
    ink: "8, 8, 10",
  },
  {
    id: "ember",
    name: "Ember",
    desc: "Hot orange into a red glow, amber for instrumentals",
    vox: "255, 94, 0",
    ins: "255, 176, 64",
    deep: "255, 40, 90",
    ink: "8, 8, 10",
  },
  {
    id: "acid",
    name: "Acid",
    desc: "Lime that cuts through the dark, mint for instrumentals",
    vox: "190, 255, 60",
    ins: "60, 255, 190",
    deep: "40, 215, 120",
    ink: "8, 8, 10",
  },
  {
    id: "ice",
    name: "Ice",
    desc: "Cold sky blue, near white for instrumentals",
    vox: "110, 195, 255",
    ins: "205, 235, 255",
    deep: "80, 120, 255",
    ink: "8, 8, 10",
  },
  {
    id: "bone",
    name: "Bone",
    desc: "No color at all: warm white and steel on black",
    vox: "236, 230, 216",
    ins: "160, 166, 176",
    deep: "150, 140, 120",
    ink: "8, 8, 10",
  },
];

export const MUSIC_PALETTE_IDS = MUSIC_PALETTES.map((palette) => palette.id);

/**
 * The custom properties that put a palette on the player.
 * @param {string} id - a MUSIC_PALETTES id; anything else gives the default
 * @returns {string} an inline style for the player's container
 */
export function musicPaletteStyle(id) {
  const palette = MUSIC_PALETTES.find((entry) => entry.id === id) || MUSIC_PALETTES[0];
  return `--mp-vox-rgb: ${palette.vox}; --mp-ins-rgb: ${palette.ins}; --mp-deep-rgb: ${palette.deep}; --mp-ink-rgb: ${palette.ink};`;
}
