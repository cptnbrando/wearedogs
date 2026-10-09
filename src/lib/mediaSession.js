/**
 * Media Session bridge for the music player.
 *
 * Lock-screen and notification controls (Android, iOS), Bluetooth and wired
 * headset buttons, car head units, smartwatches and keyboard media keys all
 * reach the page through navigator.mediaSession action handlers. This module
 * registers those handlers once and keeps the OS's view of the player (track
 * metadata, playing/paused, position) in step with AudioCore.
 *
 * Repeat and shuffle have no Media Session action: the spec's action list
 * stops at play, pause, stop, the seek actions, previoustrack and nexttrack
 * (plus ad, call and slide actions), and neither Android's media notification nor iOS's
 * lock screen offers a web page any extra buttons. Those stay in the player.
 *
 * Everything is feature-detected; on browsers without mediaSession (Chrome 40
 * and friends) every export is a no-op.
 */

const SESSION = typeof navigator !== "undefined" && navigator.mediaSession ? navigator.mediaSession : null;
// Lock screens and headsets that don't say how far to jump get this
const SEEK_STEP_S = 10;
// One cover image, offered at the sizes OSes ask for, so each picks a match
// instead of skipping the artwork
const ARTWORK_SIZES = ["96x96", "128x128", "192x192", "256x256", "384x384", "512x512"];
const ARTWORK_TYPES = {
  webp: "image/webp",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  avif: "image/avif",
};
const EXTENSION_PATTERN = /\.([a-z0-9]+)(?:[?#].*)?$/i;
const PLAYBACK_PLAYING = "playing";
const PLAYBACK_PAUSED = "paused";

let boundPlayer = null;
let shownTrackId = null;

/**
 * The slice of AudioCore the OS controls drive.
 * @typedef {object} SessionPlayer
 * @property {boolean} isPlaying
 * @property {number} currentTime seconds
 * @property {number} duration seconds (0 while unknown)
 * @property {() => Promise<void>} togglePlay
 * @property {() => void} requestPause pauses (or asks the playing tab to)
 * @property {() => void} prevTrack
 * @property {(autoplay?: boolean) => void} nextTrack
 * @property {(time: number, fast?: boolean) => void} seek
 */

/**
 * The OS-facing handler for every supported action. Exported so the
 * behaviour can be exercised without a lock screen.
 * @param {SessionPlayer} player
 * @returns {Record<string, (details?: MediaSessionActionDetails) => void>}
 */
export function createActionHandlers(player) {
  const seekBy = (offset) => {
    const end = player.duration > 0 ? player.duration : Infinity;
    player.seek(Math.max(0, Math.min(end, (player.currentTime || 0) + offset)));
  };
  return {
    // Headsets send play and pause separately; acting on the button that was
    // pressed (not toggling) keeps a desynced device from flipping the wrong way
    play: () => {
      if (!player.isPlaying) player.togglePlay();
    },
    pause: () => {
      if (player.isPlaying) player.requestPause();
    },
    stop: () => {
      player.requestPause();
      player.seek(0);
    },
    previoustrack: () => player.prevTrack(),
    nexttrack: () => player.nextTrack(),
    seekbackward: (details) => seekBy(-((details && details.seekOffset) || SEEK_STEP_S)),
    seekforward: (details) => seekBy((details && details.seekOffset) || SEEK_STEP_S),
    seekto: (details) => {
      if (!details || !isFinite(details.seekTime)) return;
      player.seek(Math.max(0, details.seekTime), !!details.fastSeek);
    },
  };
}

/**
 * Hands the OS controls to the player. Safe to call repeatedly.
 * @param {SessionPlayer} player
 */
export function bindMediaSession(player) {
  if (!SESSION || typeof SESSION.setActionHandler !== "function" || boundPlayer === player) return;
  boundPlayer = player;
  const handlers = createActionHandlers(player);
  Object.keys(handlers).forEach((action) => {
    // Browsers throw on actions they don't know (stop, seekto on older ones)
    try {
      SESSION.setActionHandler(action, handlers[action]);
    } catch (e) {
      /* unsupported here; the rest still register */
    }
  });
}

/**
 * Cover art at every size, typed by its file extension when it has one.
 * @param {string | undefined} cover
 * @returns {MediaImage[]}
 */
function artworkFor(cover) {
  if (!cover) return [];
  let src;
  try {
    src = new URL(cover, window.location.href).href;
  } catch (e) {
    return [];
  }
  const ext = EXTENSION_PATTERN.exec(src.split(/[?#]/)[0]);
  const type = ext ? ARTWORK_TYPES[ext[1].toLowerCase()] : undefined;
  return ARTWORK_SIZES.map((sizes) => (type ? { src, sizes, type } : { src, sizes }));
}

/**
 * Lock-screen title/artist/album/art. Only rebuilt when the track changes, so
 * play/pause doesn't make the notification reload its artwork.
 * @param {{ id: string, title?: string, artist?: string, album?: string, cover?: string }} track
 */
function showTrack(track) {
  if (track.id === shownTrackId || typeof MediaMetadata === "undefined") return;
  try {
    SESSION.metadata = new MediaMetadata({
      title: track.title || "",
      artist: track.artist || "",
      album: track.album || "",
      artwork: artworkFor(track.cover),
    });
    shownTrackId = track.id;
  } catch (e) {
    console.warn("Media Session metadata rejected:", e);
  }
}

/**
 * The scrubber on the lock screen. setPositionState throws on a NaN or
 * negative duration, a position past the end or a zero rate, so every value
 * is checked first; an unknown duration clears the state instead.
 * @param {number} duration
 * @param {number} position
 * @param {number} rate
 */
function showPosition(duration, position, rate) {
  if (typeof SESSION.setPositionState !== "function") return;
  try {
    if (!(duration > 0) || !isFinite(duration)) return SESSION.setPositionState();
    SESSION.setPositionState({
      duration,
      playbackRate: rate > 0 && isFinite(rate) ? rate : 1,
      position: position > 0 && isFinite(position) ? Math.min(position, duration) : 0,
    });
  } catch (e) {
    /* an older implementation that rejects the clear call: nothing to show */
  }
}

/**
 * Pushes the player's current state to the OS.
 * @param {{ track?: object, isPlaying: boolean, duration: number, position: number, rate: number }} state
 */
export function syncMediaSession(state) {
  if (!SESSION || !state.track) return;
  showTrack(state.track);
  try {
    SESSION.playbackState = state.isPlaying ? PLAYBACK_PLAYING : PLAYBACK_PAUSED;
  } catch (e) {
    /* read-only in some early implementations */
  }
  showPosition(state.duration, state.position, state.rate);
}
