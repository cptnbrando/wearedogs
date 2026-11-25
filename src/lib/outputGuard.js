/**
 * outputGuard.js
 * The music stops when the way it was being heard goes away: headphones
 * unplugged, Bluetooth dropped, a phone call coming in. It stays stopped
 * until the listener presses play.
 *
 * What a browser lets a page know:
 *  - Phones pause the audio themselves in all three cases, and some start it
 *    again by themselves afterwards (the end of a call). The guard notices a
 *    pause the player did not ask for and makes it the player's own, so the
 *    button shows paused, and it stops a restart nobody asked for.
 *  - Computers keep playing, now through the speakers. The guard watches the
 *    list of sound outputs and pauses when one goes away. A browser that
 *    lists one entry for every output until it is granted the microphone
 *    cannot show an output leaving; there, nothing more can be known.
 */

/** A pause is the system's only if the player still thinks it is playing this long after. */
const CONFIRM_MS = 300;
/** A song about to end pauses by itself: not an interruption. */
const END_MARGIN_S = 0.75;
/** After an interruption, a restart the listener did not ask for is stopped for this long. */
const HOLD_MS = 15 * 60 * 1000;
const OUTPUT_KIND = "audiooutput";

/**
 * @typedef {object} GuardedPlayer
 * @property {boolean} isPlaying
 * @property {boolean} isLoading
 * @property {number} duration
 * @property {number} currentTrackIndex
 * @property {() => HTMLAudioElement} primaryAudio
 * @property {() => void} requestPause
 */

/** @returns {Promise<number>} how many sound outputs the browser lists; -1 when it will not say */
function countOutputs() {
  const devices = navigator.mediaDevices;
  if (!devices || typeof devices.enumerateDevices !== "function") return Promise.resolve(-1);
  return devices.enumerateDevices().then(
    (list) => list.filter((device) => device.kind === OUTPUT_KIND).length,
    () => -1,
  );
}

/**
 * Starts guarding a player. Call once, when its audio elements exist.
 * @param {GuardedPlayer} player
 * @param {HTMLAudioElement[]} elements - the elements the player makes sound with
 */
export function guardOutput(player, elements) {
  let heldUntil = 0;

  const interrupted = () => {
    heldUntil = Date.now() + HOLD_MS;
    player.requestPause();
  };

  elements.forEach((el) => {
    el.addEventListener("pause", () => {
      if (!player.isPlaying || el !== player.primaryAudio() || el.ended) return;
      if (player.duration > 0 && el.currentTime >= player.duration - END_MARGIN_S) return;
      const index = player.currentTrackIndex;
      // The player's own pauses clear isPlaying first; one that leaves it set came from outside
      setTimeout(() => {
        const sameSong = player.currentTrackIndex === index && el === player.primaryAudio();
        if (player.isPlaying && !player.isLoading && sameSong && el.paused) interrupted();
      }, CONFIRM_MS);
    });

    el.addEventListener("play", () => {
      // Pressing play sets isPlaying before this fires: the hold is over
      if (player.isPlaying) {
        heldUntil = 0;
        return;
      }
      if (Date.now() > heldUntil) return;
      // The system restarted the music after an interruption: the listener did not
      setTimeout(() => {
        if (!player.isPlaying && !player.isLoading && !el.paused) el.pause();
      }, CONFIRM_MS);
    });
  });

  const devices = navigator.mediaDevices;
  if (!devices || typeof devices.addEventListener !== "function") return;
  let outputs = -1;
  countOutputs().then((count) => (outputs = count));
  devices.addEventListener("devicechange", () => {
    countOutputs().then((count) => {
      const lost = outputs > 0 && count >= 0 && count < outputs;
      outputs = count;
      if (lost && player.isPlaying) interrupted();
    });
  });
}
