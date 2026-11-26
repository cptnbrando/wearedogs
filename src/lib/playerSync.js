/**
 * The music player's sync messages: how one player follows another.
 *
 * Players talk in small messages: "state_change" and "pong" say what is
 * playing, "time_update" keeps the progress bar moving, and "cmd_*" ask the
 * player that has the sound to do something. They travel between this
 * browser's tabs (a BroadcastChannel) and, when a device is tethered
 * (src/lib/tether.svelte.js), to that device over its Air Train connection.
 *
 * One player has the sound (the "master", by its tab id). The others mirror
 * it and act as its remote controls. AudioCore sends the messages; this file
 * is what it does when one arrives.
 *
 * Lockup songs (lib/musicLock) open only with the calculator passcode, and
 * the passcode never crosses the tether. A lockup song picked on a remote is
 * played by the remote itself; the device with the sound, which may not have
 * the song, goes quiet until the next song it has.
 */
import { isLockupUrl } from "./musicLock.svelte.js";

/**
 * A song picked on a remote control. Asked of the device with the sound,
 * unless it is a lockup song: then this device takes the sound and plays it.
 * @param {object} core - the AudioCore
 * @param {number} index - the song, in this device's library
 * @returns {boolean} true when it was asked of the other device, false when it plays here
 */
export function askRemote(core, index) {
  const track = core.library[index];
  if (!isLockupUrl(track.src) && !isLockupUrl(track.instrumental)) {
    core.broadcast({ type: "cmd_track", trackId: track.id, trackIndex: index });
    return true;
  }
  core.masterIsRemote = false;
  core.masterTabId = core.tabId;
  return false;
}

/**
 * The library index a sync message means, or -1 when this device does not have that song.
 * @param {object} core - the AudioCore
 * @param {{ trackId?: string, trackIndex?: number }} msg
 * @param {boolean} remote - from the tethered device, which goes by id
 */
function syncIndex(core, msg, remote) {
  if (typeof msg.trackId === "string") {
    const byId = core.library.findIndex((t) => t.id === msg.trackId);
    if (byId !== -1 || remote) return byId;
  }
  const index = msg.trackIndex;
  return Number.isInteger(index) && index >= 0 && index < core.library.length ? index : -1;
}

/**
 * Carries out one sync message on a player.
 * @param {object} core - the AudioCore
 * @param {object} msg - a sync message from another tab, or from the tethered device
 * @param {boolean} remote - it came over the tether
 * @param {number[]} repeatModes - the repeat modes the player knows
 */
export function applySyncMessage(core, msg, remote, repeatModes) {
  if (!msg || msg.uuid === core.tabId) return;

  core.isSyncing = true;
  try {
    switch (msg.type) {
      case "ping":
        if (core.isPlaying && core.masterTabId === core.tabId) {
          core.broadcastState("pong");
        }
        break;
      case "pong":
      case "state_change": {
        const selfPlaying = core.isPlaying && core.masterTabId === core.tabId;
        // Both devices were playing when they tethered: one keeps the sound.
        // The same rule runs on both, so they agree without asking.
        if (remote && msg.type === "pong" && selfPlaying && core.tabId > String(msg.uuid)) break;
        // The player with the sound gives it up to a player that is taking it
        // (it names itself), and listens to its own followers (they name this
        // one). Anything else is a tab that has not heard who is playing: it
        // is told, and changes nothing here.
        if (selfPlaying && msg.masterTabId !== core.tabId && msg.masterTabId !== msg.uuid) {
          core.isSyncing = false;
          core.broadcastState("pong");
          break;
        }
        core.masterTabId = msg.masterTabId;
        core.masterIsRemote = remote && !!msg.masterTabId && msg.masterTabId !== core.tabId;
        // Who is playing is worth knowing even when this player cannot name
        // the song yet (its library is not loaded, or does not have it)
        const index = syncIndex(core, msg, remote);
        if (index === -1) {
          // A song only the other device has (a lockup song): it plays there, and this one goes quiet
          if (core.masterIsRemote) {
            core.isPlaying = msg.isPlaying;
            if (core.trackAudio && !core.trackAudio.paused) core.trackAudio.pause();
            if (core.instAudio && !core.instAudio.paused) core.instAudio.pause();
          }
          break;
        }
        core.isInstrumental = msg.isInstrumental;
        if (typeof msg.isShuffled === "boolean" && msg.isShuffled !== core.isShuffled) core.setShuffle(msg.isShuffled);
        if (repeatModes.indexOf(msg.repeatMode) !== -1) core.repeatMode = msg.repeatMode;
        if (core.currentTrackIndex !== index) {
          core.currentTrackIndex = index;
          const isSelfMaster = core.masterTabId === core.tabId;
          core.loadTrack(index, isSelfMaster && msg.isPlaying);
        } else {
          const isSelfMaster = core.masterTabId === core.tabId;
          const wasPlaying = core.isPlaying;
          core.isPlaying = msg.isPlaying;
          if (isSelfMaster) {
            // Only a change of play state moves the playhead: a follower
            // flipping shuffle or VOX / INS must not make the song skip
            if (msg.isPlaying && !wasPlaying) {
              core.play(msg.currentTime);
            } else if (!msg.isPlaying && wasPlaying) {
              core.pause();
            } else {
              core.applyCrossfade();
            }
          } else {
            core.currentTime = msg.currentTime;
            if (core.trackAudio && !core.trackAudio.paused) core.trackAudio.pause();
            if (core.instAudio && !core.instAudio.paused) core.instAudio.pause();
          }
        }
        break;
      }
      case "cmd_track": {
        // The remote control picked a song: the device with the sound plays it
        if (core.masterTabId && core.masterTabId !== core.tabId) break;
        const index = syncIndex(core, msg, remote);
        if (index === -1) break;
        core.isSyncing = false;
        core.masterTabId = core.tabId;
        core.masterIsRemote = false;
        core.loadTrack(index, true);
        break;
      }
      case "time_update":
        if (core.masterTabId !== core.tabId) {
          core.currentTime = msg.currentTime;
          core.duration = msg.duration;
          core.isPlaying = msg.isPlaying;
        }
        break;
      // A command changes what plays here, and every other tab and the
      // tethered device must hear about it: carried out as this tab's own act.
      case "cmd_play":
        core.isSyncing = false;
        core.masterTabId = core.tabId;
        core.masterIsRemote = false;
        core.play(msg.currentTime);
        break;
      case "cmd_pause":
        core.isSyncing = false;
        core.pause();
        break;
      case "cmd_seek":
        core.isSyncing = false;
        core.seek(msg.currentTime);
        break;
      case "cmd_next":
        core.isSyncing = false;
        core.nextTrack();
        break;
      case "cmd_prev":
        core.isSyncing = false;
        core.prevTrack();
        break;
    }
  } catch (e) {
    console.warn("Failed to process sync message:", e);
  } finally {
    core.isSyncing = false;
  }
}
