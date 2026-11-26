/**
 * Air Train's log: each message that crosses the connection, said in a few
 * words (NearbyTransfer's Log section shows them, lib/tether.svelte.js keeps
 * them). Only what kind of message it is and where it goes: never the
 * pairing secret, the resume key, or anything inside a file or a note.
 */

const BYTES_PER_MB = 1024 * 1024;
const MAX_TEXT = 80;

/** What each player message asks for (lib/playerSync.js). */
const MUSIC_WORDS = {
  ping: "asks what is playing",
  pong: "says what is playing",
  state_change: "playing now",
  time_update: "where the song is",
  cmd_play: "play",
  cmd_take: "you take the sound",
  cmd_pause: "pause",
  cmd_seek: "jump to",
  cmd_next: "next song",
  cmd_prev: "previous song",
  cmd_track: "play this song",
};

/** Transfer and pairing messages (transferSession.js, transferPieces.js). */
const PACKET_WORDS = {
  hello: "hello: asks to come aboard (proves it has the pairing link)",
  welcome: "welcome: let aboard",
  reject: "declined",
  offer: "offers",
  ready: "ready for it",
  ack: "has",
  end: "that was all of it",
  complete: "got it all",
  cancel: "cancelled",
  "transfer-error": "could not take it",
};

const mb = (bytes) => (bytes / BYTES_PER_MB).toFixed(1) + " MB";
const short = (text) => String(text).slice(0, MAX_TEXT);

/**
 * @param {object} payload - an app message ({ k, ... })
 * @returns {string}
 */
export function describeApp(payload) {
  switch (payload.k) {
    case "music": {
      const msg = payload.msg || {};
      let text = "music: " + (MUSIC_WORDS[msg.type] || msg.type);
      if (msg.trackId) text += " · " + short(msg.trackId);
      if (typeof msg.currentTime === "number" && msg.type !== "time_update") text += " @ " + msg.currentTime.toFixed(1) + " s";
      if (typeof msg.isPlaying === "boolean" && msg.type !== "time_update") text += msg.isPlaying ? " · playing" : " · paused";
      return text;
    }
    case "preset":
      return "visualizer preset: " + short(payload.name);
    case "tether":
      return payload.on ? "tether: switched on" : "tether: switched off";
    case "bell":
      return "where to ring this device next time";
    case "beat":
      return "heartbeat: still here?";
    case "beat-back":
      return "heartbeat: still here";
    case "bye":
      return "goodbye: hanging up";
    case "brb":
      return "be right back: reloading";
    default:
      return "app message: " + short(payload.k);
  }
}

/**
 * @param {object} packet - a transfer or pairing message
 * @returns {string}
 */
export function describePacket(packet) {
  const words = PACKET_WORDS[packet.type] || packet.type;
  if (packet.type === "offer") return `${words} ${short(packet.name)} (${packet.kind}, ${mb(packet.size)})`;
  if (packet.type === "ack") return `${words} ${mb(packet.offset)}`;
  if (packet.type === "transfer-error" && packet.reason) return `${words}: ${short(packet.reason)}`;
  return words;
}
