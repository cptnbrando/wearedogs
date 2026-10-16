/**
 * Jak & Daxter soundboard kit: 20 pads in a 4x5 grid, one category per row.
 * Files live on the data host under music/soundboard/jak/.
 */
const JAK_SOUND_DIR = "https://data.wearedogs.net/music/soundboard/jak/";
const JAK_PAD_ROWS = 5;

/**
 * Each row: [id, file, label, emoji, key]. Row order sets grid order.
 * @type {{ color: string, pads: string[][] }[]}
 */
const JAK_ROWS = [
  {
    color: "pad-orange", // oddities & money
    pads: [
      ["jak-zap", "zap.mp3", "Zap", "⚡", "q"],
      ["jak-slide", "slide.mp3", "Slide", "🛝", "w"],
      ["jak-money", "MONEY.mp3", "Money", "🤑", "e"],
      ["jak-secret", "secret.mp3", "Secret", "✨", "r"],
    ],
  },
  {
    color: "pad-pink", // hits & breaks
    pads: [
      ["jak-punch", "punch.mp3", "Punch", "👊", "a"],
      ["jak-break", "break.mp3", "Crate", "📦", "s"],
      ["jak-crack", "CRACK.mp3", "Crack", "💥", "d"],
      ["jak-crystal", "crystal.mp3", "Crystal", "💎", "f"],
    ],
  },
  {
    color: "pad-cyan", // zoomer & rings
    pads: [
      ["jak-boost", "boost.mp3", "Boost", "🚀", "z"],
      ["jak-rev", "rev.mp3", "Rev", "🏍️", "x"],
      ["jak-rev2", "rev2.mp3", "Rev 2", "💨", "c"],
      ["jak-warp", "warp.mp3", "Ring", "⭕", "v"],
    ],
  },
  {
    color: "pad-red", // bombs
    pads: [
      ["jak-bomb1", "BOMB1.mp3", "Bomb 1", "🔴", "t"],
      ["jak-bomb2", "BOMB2.mp3", "Bomb 2", "💣", "y"],
      ["jak-bomb3", "BOMB3.mp3", "Bomb 3", "🧨", "u"],
      ["jak-bomb4", "BOMB4.mp3", "Bomb 4", "🌋", "i"],
    ],
  },
  {
    color: "pad-red", // bomb load, eco blast, fail & eel
    pads: [
      ["jak-load", "LOAD.mp3", "Bomb Load", "🎯", "g"],
      ["jak-yellow", "YELLOW.mp3", "Eco", "🟡", "h"],
      ["jak-lose", "lose.mp3", "Lose", "🎻", "j"],
      ["jak-eel", "eel.mp3", "Eel", "🐍", "k"],
    ],
  },
];

export const JAK_KIT = {
  id: "jak",
  name: "Jak",
  color: "#ff8a00",
  glow: "rgba(255, 138, 0, 0.4)",
  rows: JAK_PAD_ROWS,
  sounds: JAK_ROWS.reduce(
    (all, row) =>
      all.concat(
        row.pads.map(([id, file, label, emoji, key]) => ({
          id,
          type: "file",
          url: JAK_SOUND_DIR + file,
          label,
          emoji,
          key,
          color: row.color,
        })),
      ),
    [],
  ),
};
