/**
 * fingerprintEngine.js
 * The Fingerprint app's state machine: consent, collection, the server's
 * "seen before?" answer and forgetting. FingerprintApp.svelte only renders the
 * state this publishes.
 *
 * Nothing is read or sent before accept(). Raw readings stay on the page; the
 * Worker only receives per-signal hashes (deviceSignals.js hashTrait) plus a
 * random local ID, and salts and re-hashes them before storing.
 */

import { collectSignals, hashTrait } from "../../deviceSignals.js";
import { readBrowser, readHardware, readAsync } from "./fingerprintCollectors.js";
import { fetchNetwork, sendProfile, forgetMe, hasLocalId } from "./fingerprintClient.js";
import META from "./fingerprintSignals.json";

// Same names and order as SIGNAL_KEYS in workers/api/src/routes/fingerprint.js. The first
// nine come from deviceSignals.js collectSignals(), as the like button sends them.
export const SERVER_SIGNAL_KEYS = [
  "ua", "platform", "lang", "tz", "screen", "hardware", "webgl", "canvas", "audio",
  "fonts", "math", "voices", "intl", "media", "features", "gpu",
];
// Survive incognito, cleared storage and browser scrambling; they make up the visitor ID
const VISITOR_ID_KEYS = ["ua", "platform", "lang", "tz", "screen", "hardware", "gpu", "fonts", "math", "intl", "features"];
const VISITOR_ID_LENGTH = 12;
const VISITOR_ID_GROUP = 4;
const MAX_LIST_ITEMS = 12;
// About 2^33 people are alive: past that, a combination is effectively one of a kind
const WORLD_BITS = 33;
const BIT_BAR_MAX = 10;
// Lets the "collecting" state paint before the synchronous canvas and font probes run
const PAINT_DELAY_MS = 30;
const MISSING = "Not available";
const NETWORK_OFFLINE = "Our server could not be reached, so there is no network view this time. Your IP, ISP, location and TLS details are still visible to every site you visit.";
const DATE_OPTIONS = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };

/** @typedef {{ key: string, label: string, value: string, why: string, bits: number, level: string, bar: number, missing: boolean }} SignalRow */
/** @typedef {{ id: string, title: string, blurb: string, rows: SignalRow[], notice: string }} SignalGroup */
/**
 * @typedef {object} FingerprintState
 * @property {"intro"|"consent"|"declined"|"collecting"|"done"} phase
 * @property {SignalGroup[]} groups
 * @property {string} visitorId
 * @property {number} bits rough combined entropy of the device signals
 * @property {string} rarity plain-words reading of bits
 * @property {{ status: string, headline: string, detail: string, facts: {label: string, value: string}[] }} server
 * @property {boolean} hadLocalId an earlier run's ID was already in this browser
 * @property {boolean} forgetting
 */

/** Drives one visitor's run of the Fingerprint app. */
export class FingerprintSession {
  /** @param {(state: FingerprintState) => void} onChange receives every new state */
  constructor(onChange) {
    this.onChange = onChange;
    this.readings = {};
    this.network = undefined;
    this.state = {
      phase: "intro",
      groups: [],
      visitorId: "",
      bits: 0,
      rarity: "",
      server: serverState("idle"),
      hadLocalId: false,
      forgetting: false,
    };
  }

  /** @param {Partial<FingerprintState>} patch */
  set(patch) {
    this.state = Object.assign({}, this.state, patch);
    this.onChange(this.state);
  }

  /** The "Fingerprint me" button: shows the consent banner, collects nothing. */
  askConsent() {
    this.set({ phase: "consent" });
  }

  decline() {
    this.set({ phase: this.state.groups.length ? "done" : "declined" });
  }

  /** Consent given: read everything the browser allows, then ask the server. */
  accept() {
    this.readings = {};
    this.network = undefined;
    this.set({ phase: "collecting", groups: [], visitorId: "", bits: 0, rarity: "", hadLocalId: hasLocalId(), server: serverState("pending") });
    const network = fetchNetwork().then((data) => data, () => null);
    setTimeout(() => this.collect(network), PAINT_DELAY_MS);
  }

  /** @param {Promise<object|null>} network */
  collect(network) {
    const browser = readBrowser();
    const hardware = readHardware();
    this.readings = Object.assign({}, browser, hardware);
    this.publish();

    Promise.all([readAsync(), collectSignals()])
      .then(([extra, base]) => {
        Object.assign(this.readings, extra);
        const signals = serverSignals(base, this.readings);
        this.set({ visitorId: visitorId(signals) });
        this.publish();
        return network.then((data) => this.report(data, signals));
      })
      .catch(() => this.set({ phase: "done", server: serverState("unavailable") }));
  }

  /**
   * @param {object|null} network the Worker's /network reply, or null when unreachable
   * @param {Object<string, string>} signals
   */
  report(network, signals) {
    this.network = network;
    this.publish();
    if (!network) return this.set({ phase: "done", server: serverState("unavailable") });
    return sendProfile(signals).then(
      (result) => this.set({ phase: "done", server: describeMatch(result) }),
      () => this.set({ phase: "done", server: serverState("unavailable") }),
    );
  }

  /** Rebuilds the on-screen groups from whatever has been read so far. */
  publish() {
    const groups = buildGroups(this.readings, this.network);
    const bits = groups
      .filter((group) => group.id !== "network")
      .reduce((total, group) => total + group.rows.reduce((sum, row) => sum + (row.missing ? 0 : row.bits), 0), 0);
    this.set({ groups, bits, rarity: rarity(bits) });
  }

  /** Deletes the server record and cookie, and drops the local ID. */
  forget() {
    if (this.state.forgetting) return;
    this.set({ forgetting: true });
    forgetMe().then(
      (count) => this.set({ forgetting: false, hadLocalId: false, server: serverState("forgotten", count) }),
      () => this.set({ forgetting: false, hadLocalId: false, server: serverState("forgetFailed") }),
    );
  }
}

/**
 * The hashes the Worker matches on, in SERVER_SIGNAL_KEYS order.
 * @param {Object<string, string>} base collectSignals() output
 * @param {Object<string, any>} r raw readings
 * @returns {Object<string, string>}
 */
function serverSignals(base, r) {
  const webgl = r.webglInfo;
  const extra = {
    fonts: r.fonts ? r.fonts.found.join(",") : "",
    math: r.math.values,
    voices: r.voices ? r.voices.names.join(",") : "",
    intl: r.intl,
    media: `${r.codecs}|${r.prefs}`,
    features: r.features.present.join(","),
    gpu: webgl ? `${webgl.vendor}|${webgl.renderer}` : "",
  };
  const signals = {};
  SERVER_SIGNAL_KEYS.forEach((key) => {
    signals[key] = key in extra ? hashTrait(extra[key]) : base[key] || "";
  });
  return signals;
}

/** @returns {string} the stable signals' combined hash, grouped for reading aloud */
function visitorId(signals) {
  const id = hashTrait(VISITOR_ID_KEYS.map((key) => signals[key]).join("|")).slice(0, VISITOR_ID_LENGTH).toUpperCase();
  const parts = [];
  for (let i = 0; i < id.length; i += VISITOR_ID_GROUP) parts.push(id.slice(i, i + VISITOR_ID_GROUP));
  return parts.join("-");
}

/** @returns {string} what a rough bit count means in people */
function rarity(bits) {
  if (!bits) return "";
  if (bits >= WORLD_BITS) {
    return "Taken at face value, that is past the ~33 bits it takes to tell every person alive apart. The signals overlap, so the true figure is lower, but large studies still find most desktop browsers unique.";
  }
  const people = Math.pow(2, Math.round(bits));
  return `Taken at face value, about 1 in ${people.toLocaleString()} browsers would share this combination. The signals overlap, so treat that as an upper bound.`;
}

/**
 * @param {Object<string, any>} r raw readings
 * @param {object|null|undefined} network undefined while pending
 * @returns {SignalGroup[]}
 */
function buildGroups(r, network) {
  const values = Object.assign(networkValues(network, r.timezone), deviceValues(r));
  return META.groups.map((group) => {
    const isNetwork = group.id === "network";
    // Twelve "not available" rows say less than one line saying why
    const offline = isNetwork && network === null;
    return {
      id: group.id,
      title: group.title,
      blurb: group.blurb,
      notice: offline ? NETWORK_OFFLINE : "",
      rows: offline
        ? []
        : Object.keys(META.signals)
          .filter((key) => META.signals[key].group === group.id)
          .map((key) => row(key, values[key], isNetwork && network === undefined)),
    };
  });
}

/** @returns {SignalRow} */
function row(key, value, pending) {
  const meta = META.signals[key];
  const missing = !value;
  const level = missing ? "none" : META.levels.filter((step) => meta.bits <= step.max)[0].label;
  return {
    key,
    label: meta.label,
    value: missing ? (pending ? "Waiting for the server…" : MISSING) : String(value),
    why: meta.why,
    bits: meta.bits,
    level,
    bar: missing ? 0 : Math.min(meta.bits / BIT_BAR_MAX, 1),
    missing,
  };
}

/** @returns {Object<string, string>} display text for every browser and hardware row */
function deviceValues(r) {
  const webgl = r.webglInfo;
  const voices = r.voices;
  return {
    ua: r.ua,
    uaHints: r.uaHints,
    platform: r.platform,
    languages: r.languages,
    timezone: r.timezone && r.timezone.label,
    intl: r.intl,
    privacy: r.privacy,
    storageApis: r.storageApis,
    plugins: r.plugins && list(r.plugins.split(", ")),
    mimeTypes: r.mimeTypes,
    automation: r.automation,
    connection: r.connection,
    features: r.features && `${r.features.present.length} of ${r.features.total} · ${list(r.features.present)}`,
    codecs: r.codecs,
    prefs: r.prefs,
    screen: r.screen,
    viewport: r.viewport,
    cpu: r.cpu,
    memory: r.memory,
    touch: r.touch,
    battery: r.battery,
    mediaDevices: r.mediaDevices,
    gpu: webgl && [webgl.vendor, webgl.renderer].filter(Boolean).join(" · "),
    webgl: webgl && `${webgl.version} · limits #${hashTrait(webgl.limits)}`,
    webglExt: webgl && `${webgl.extensions.length} extensions · #${hashTrait(webgl.extensions.join(","))}`,
    canvas: r.canvas && `#${r.canvas}`,
    audio: r.audio && `${r.audio} · #${hashTrait(r.audio)}`,
    fonts: r.fonts && `${r.fonts.found.length} of ${r.fonts.total} · ${list(r.fonts.found)}`,
    voices: voices && voices.names.length
      ? `${voices.names.length} voices, ${voices.local} on-device${voices.preferred ? ` · default ${voices.preferred}` : ""} · ${list(voices.names)}`
      : "",
    math: r.math && `${r.math.count} functions · #${hashTrait(r.math.values)}`,
    storageQuota: r.storageQuota,
  };
}

/** @returns {Object<string, string>} display text for the network rows */
function networkValues(network, timezone) {
  if (!network) return {};
  const cf = network.cf || {};
  const headers = network.headers || {};
  const deviceZone = timezone ? timezone.zone : "";
  const join = (parts) => parts.filter((part) => part !== undefined && part !== null && part !== "").join(" · ");
  return {
    ip: network.ip && `${network.ip} (IPv${network.ipVersion})`,
    isp: join([cf.asn && `AS${cf.asn}`, cf.asOrganization]),
    location: join([cf.city, cf.region, cf.postalCode, cf.country, cf.continent, cf.isEUCountry && "EU"]),
    coords: cf.latitude && `${cf.latitude}, ${cf.longitude}`,
    edgeTz: cf.timezone,
    vpnHint: vpnHint(deviceZone, cf.timezone),
    colo: cf.colo,
    protocol: cf.httpProtocol,
    tls: join([cf.tlsVersion, cf.tlsCipher]),
    tlsHello: join([
      cf.tlsClientCiphersSha1 && `ciphers ${cf.tlsClientCiphersSha1}`,
      cf.tlsClientExtensionsSha1 && `extensions ${cf.tlsClientExtensionsSha1}`,
      cf.tlsClientHelloLength && `hello ${cf.tlsClientHelloLength} bytes`,
    ]),
    rtt: cf.clientTcpRtt && `${cf.clientTcpRtt} ms`,
    headers: join(Object.keys(headers).map((name) => `${name}: ${headers[name]}`)),
  };
}

function vpnHint(deviceZone, networkZone) {
  if (!deviceZone || !networkZone) return "";
  if (deviceZone === networkZone) return "Device and network time zones agree.";
  return `Device says ${deviceZone}, network says ${networkZone}: a VPN or proxy, or just a neighbouring zone.`;
}

/** @returns {string} the first MAX_LIST_ITEMS items, then a count of the rest */
function list(items) {
  const shown = items.filter(Boolean);
  if (!shown.length) return "";
  if (shown.length <= MAX_LIST_ITEMS) return shown.join(", ");
  return `${shown.slice(0, MAX_LIST_ITEMS).join(", ")} + ${shown.length - MAX_LIST_ITEMS} more`;
}

function formatDate(time) {
  if (!time) return "";
  try {
    return new Date(time).toLocaleString(undefined, DATE_OPTIONS);
  } catch {
    return new Date(time).toString();
  }
}

/**
 * @param {"idle"|"pending"|"unavailable"|"forgotten"|"forgetFailed"} status
 * @param {number} [count] records deleted, for "forgotten"
 */
function serverState(status, count) {
  const copy = {
    idle: ["", ""],
    pending: ["Asking the DOGS server…", "Checking whether this device has been here before."],
    unavailable: [
      "Server unavailable",
      "Everything below was read in your browser and stays here. Nothing was saved, so there is no \"seen before\" answer this time.",
    ],
    forgotten: [
      "Forgotten",
      `${count || 0} server record${count === 1 ? "" : "s"} deleted, the cookie expired and the local ID removed. Run it again and you start over as a first visit, unless the signals give you away.`,
    ],
    forgetFailed: [
      "Partly forgotten",
      "The local ID is gone, but the server could not be reached to delete its record and cookie. Try again later.",
    ],
  }[status];
  return { status, headline: copy[0], detail: copy[1], facts: [] };
}

/** @returns {FingerprintState["server"]} the Worker's answer in plain words */
function describeMatch(result) {
  const facts = [
    { label: "First seen", value: formatDate(result.firstSeen) },
    { label: "Visits", value: String(result.visits || 1) },
  ];
  const unsaved = result.saved === false ? " Today's storage budget is used up, so this visit was not saved." : "";
  if (result.status !== "returning") {
    const next = unsaved || " Its hashes are saved now, so next time we should know it, even if you clear your storage. Probably.";
    return { status: "new", headline: "First visit", detail: `We have not seen this device before.${next}`, facts };
  }
  const how = {
    cookie: "Recognised by the cookie our server set last time.",
    local: "Recognised by the ID stored in this browser. The cookie was missing, so a new one was set.",
    signals: "Recognised by device signals alone: your cookie and stored ID were gone, and the hashes still matched.",
  }[result.method] || "Recognised.";
  const matched = result.matched ? result.matched.length : 0;
  facts.push({ label: "Last seen", value: formatDate(result.lastSeen) });
  facts.push({ label: "Signals matching", value: `${matched} of ${result.compared || SERVER_SIGNAL_KEYS.length}${result.sameNetwork ? " · same network" : ""}` });
  return { status: "returning", headline: "Seen before", detail: how + unsaved, facts };
}
