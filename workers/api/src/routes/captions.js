/**
 * /captions: speech to text for the Captions app (src/components/apps/captions),
 * and the owner's saved caption projects.
 *
 *   POST /captions/pass { token }                     -> { pass, expires }
 *   GET  /captions/allowance                          -> { mine, all }   seconds left today
 *   POST /captions/transcribe { pass, audio, seconds, language?, hint? }
 *                                                     -> { segments, language, mine, all }
 *   GET    /captions/projects                         -> { projects: [{ id, name, updatedAt }] }   owner
 *   GET    /captions/projects/<id>                    -> { id, name, body, updatedAt }             owner
 *   PUT    /captions/projects/<id> { name, body }     -> { saved: true, updatedAt }                owner
 *   DELETE /captions/projects/<id>                    -> { deleted: true }                         owner
 *
 * Transcription runs on Workers AI (Whisper). The account's free allowance is
 * 10,000 neurons a day, about 214 minutes of audio, and on the Free plan it
 * stops there until midnight UTC; nothing is billed. This route stops earlier,
 * so the day's allowance is shared out: every visitor gets a little, all
 * visitors together get a part, and the owner (lib/admin.js) can use the rest.
 *
 * The page sends the sound in short pieces, already shrunk to a small MP3, as
 * base64 text in JSON. Nothing is stored: the audio goes to the model and the
 * words come back. The only record is the day's tally of seconds, kept per
 * visitor under a salted hash of their network address and deleted the next
 * day. One Turnstile check buys a pass for PASS_MINUTES, so a long video is
 * not checked piece by piece.
 */
import { reply, readBoundedBody, JSON_TYPE } from "../lib/http.js";
import { hash } from "../lib/hash.js";
import { spendWrites } from "../lib/budget.js";
import { verifyTurnstile } from "../lib/turnstile.js";
import { ADMIN_CORS, isAdmin } from "../lib/admin.js";

const APP = "captions";
const MODEL = "@cf/openai/whisper-large-v3-turbo";
const TURNSTILE_ACTION = "captions";
const PASS_MINUTES = 30;
const MINUTE_MS = 60 * 1000;
const PASS_LABEL = "captions-pass";
const PASS_PATTERN = /^(\d{13})\.([0-9a-f]{32})$/;
const PASS_HASH_LENGTH = 32;
const PERSON_HASH_LENGTH = 16;

/** Seconds of audio a day: everything, all visitors together, and one visitor. */
const ALL_DAILY_SECONDS = 180 * 60;
const VISITORS_DAILY_SECONDS = 60 * 60;
const VISITOR_DAILY_SECONDS = 20 * 60;
const MAX_PIECE_SECONDS = 150;
/** A 150-second piece at 32 kbps is about 600 KB, 800 KB as base64. */
const MAX_AUDIO_LENGTH = 1200 * 1024;
const MAX_TRANSCRIBE_BYTES = MAX_AUDIO_LENGTH + 4096;
const BASE64_PATTERN = /^[A-Za-z0-9+/]+=*$/;
const LANGUAGE_PATTERN = /^[a-z]{2,3}$/;
const MAX_HINT_LENGTH = 200;
const HINT_PREFIX = "Names and words that may be heard: ";
const MAX_SEGMENTS = 600;
const MAX_WORDS = 6000;
const MAX_TEXT_LENGTH = 600;
const MAX_WORD_LENGTH = 60;
const TIME_DECIMALS = 100;
const MAX_TOKEN_LENGTH = 2048;
const SMALL_BODY_BYTES = 4096;

const COUNTER_PREFIX = "captions:";
const DAY_STAMP_LENGTH = 10;
/** Two counter inserts on first use and their updates, per reservation. */
const TALLY_WRITE_ROWS = 6;
const CAPTIONS_DAILY_WRITE_CAP = 6000;
const ENSURE_COUNTER_SQL = "INSERT OR IGNORE INTO counters (name, value) VALUES (?1, 0)";
const READ_COUNTERS_SQL = "SELECT name, value FROM counters WHERE name IN (?1, ?2, ?3)";
const DELETE_OLD_TALLIES_SQL = "DELETE FROM counters WHERE name LIKE 'captions:%' AND name < ?1";

const PROJECT_ID_PATTERN = /^[a-z0-9]{8,32}$/;
const MAX_PROJECTS = 300;
const MAX_PROJECT_BYTES = 400 * 1024;
const MAX_PROJECT_NAME = 120;
const PROJECT_WRITE_ROWS = 1;
const LIST_PROJECTS_SQL = "SELECT id, name, updated_at AS updatedAt FROM caption_projects ORDER BY updated_at DESC LIMIT ?1";
const READ_PROJECT_SQL = "SELECT id, name, body, updated_at AS updatedAt FROM caption_projects WHERE id = ?1";
const SAVE_PROJECT_SQL = `INSERT INTO caption_projects (id, name, body, updated_at)
  SELECT ?1, ?2, ?3, ?4
  WHERE EXISTS (SELECT 1 FROM caption_projects WHERE id = ?1) OR (SELECT COUNT(*) FROM caption_projects) < ?5
  ON CONFLICT(id) DO UPDATE SET name = ?2, body = ?3, updated_at = ?4`;
const DELETE_PROJECT_SQL = "DELETE FROM caption_projects WHERE id = ?1";

const USED_UP_MINE = "You have used today's free transcription minutes. They come back at midnight UTC. The in-browser transcriber still works.";
const USED_UP_ALL = "Today's free transcription minutes are used up for everyone. They come back at midnight UTC. The in-browser transcriber still works.";
const MODEL_FAILED = "The transcriber could not read that piece. Try again, or use the in-browser transcriber.";

export default {
  path: "/captions",
  cors: ADMIN_CORS,

  /**
   * @param {Request} request
   * @param {object} env
   * @param {ExecutionContext} ctx
   * @param {{ ip: string, ipKey: string, cors: object, url: URL }} visitor
   */
  async handle(request, env, ctx, visitor) {
    const { cors, url, ipKey } = visitor;
    if (!env.HASH_SALT) return reply(500, { error: "Not configured" }, cors);
    const { success } = await env.CAPTIONS_LIMITER.limit({ key: ipKey });
    if (!success) return reply(429, { error: "Slow down" }, cors);

    const [, , action, id] = url.pathname.split("/");
    if (action === "pass" && request.method === "POST") return givePass(request, env, visitor);
    if (action === "allowance" && request.method === "GET") return reply(200, await allowance(env, request, ipKey), cors);
    if (action === "transcribe" && request.method === "POST") return transcribe(request, env, visitor);
    if (action === "projects") return projects(request, env, cors, id);
    return reply(404, { error: "Not found" }, cors);
  },

  /** Hourly: yesterday's tallies, and the network hashes in their names, are deleted. */
  async scheduled(env) {
    await env.DB.prepare(DELETE_OLD_TALLIES_SQL).bind(COUNTER_PREFIX + today()).run();
  },
};

const today = () => new Date().toISOString().slice(0, DAY_STAMP_LENGTH);

/** Today's three tallies for this visitor: everything, all visitors, and their own. */
async function tallyNames(env, ipKey) {
  const day = COUNTER_PREFIX + today();
  const person = await hash(env.HASH_SALT, "captions-ip", ipKey, PERSON_HASH_LENGTH);
  return { all: `${day}:all`, visitors: `${day}:visitors`, mine: `${day}:ip:${person}` };
}

/**
 * Seconds this visitor, and everyone, may still transcribe today.
 * @returns {Promise<{ mine: number, all: number }>}
 */
async function allowance(env, request, ipKey) {
  const names = await tallyNames(env, ipKey);
  const { results } = await env.DB.prepare(READ_COUNTERS_SQL).bind(names.all, names.visitors, names.mine).all();
  const used = { [names.all]: 0, [names.visitors]: 0, [names.mine]: 0 };
  results.forEach((row) => {
    used[row.name] = row.value;
  });
  const all = Math.max(0, ALL_DAILY_SECONDS - used[names.all]);
  if (await isAdmin(request, env)) return { mine: all, all };
  const visitors = Math.max(0, VISITORS_DAILY_SECONDS - used[names.visitors]);
  const mine = Math.max(0, VISITOR_DAILY_SECONDS - used[names.mine]);
  return { mine: Math.min(mine, visitors, all), all: Math.min(visitors, all) };
}

/**
 * Takes `seconds` from every tally in `limits` at once, or from none.
 * @param {object} env
 * @param {number} seconds may be negative, to hand unused seconds back
 * @param {{ name: string, cap: number }[]} limits
 * @returns {Promise<boolean>} false when one of them would go over its cap
 */
async function reserve(env, seconds, limits) {
  const names = limits.map((limit) => limit.name);
  const marks = names.map((_, i) => `?${i + 2}`).join(", ");
  const over = limits.map((_, i) => `(name = ?${i + 2} AND value + ?1 > ?${i + 2 + limits.length})`).join(" OR ");
  const sql = `UPDATE counters SET value = value + ?1 WHERE name IN (${marks})
    AND NOT EXISTS (SELECT 1 FROM counters WHERE ${over}) RETURNING name`;
  const outcome = await env.DB.batch([
    ...names.map((name) => env.DB.prepare(ENSURE_COUNTER_SQL).bind(name)),
    env.DB.prepare(sql).bind(seconds, ...names, ...limits.map((limit) => limit.cap)),
  ]);
  return outcome[outcome.length - 1].results.length === names.length;
}

/** One Turnstile check, answered with a pass that is good for this network for a while. */
async function givePass(request, env, { ip, ipKey, cors }) {
  const data = await readJson(request, SMALL_BODY_BYTES);
  if (!data || typeof data.token !== "string" || !data.token || data.token.length > MAX_TOKEN_LENGTH) {
    return reply(400, { error: "Bad request" }, cors);
  }
  if (!(await verifyTurnstile(env, data.token, ip, TURNSTILE_ACTION))) return reply(403, { error: "Verification failed" }, cors);
  const expires = Date.now() + PASS_MINUTES * MINUTE_MS;
  return reply(200, { pass: `${expires}.${await passSignature(env, expires, ipKey)}`, expires }, cors);
}

const passSignature = (env, expires, ipKey) => hash(env.HASH_SALT, PASS_LABEL, `${expires}:${ipKey}`, PASS_HASH_LENGTH);

async function passIsGood(env, pass, ipKey) {
  const match = typeof pass === "string" ? PASS_PATTERN.exec(pass) : null;
  if (!match || Number(match[1]) < Date.now()) return false;
  return (await passSignature(env, match[1], ipKey)) === match[2];
}

/** One piece of audio in, its words out. */
async function transcribe(request, env, { ipKey, cors }) {
  const piece = await readPiece(request);
  if (!piece) return reply(400, { error: "Bad request" }, cors);
  // 401 tells the page to fetch a new pass and send the piece again
  if (!(await passIsGood(env, piece.pass, ipKey))) return reply(401, { error: "Pass expired" }, cors);

  const admin = await isAdmin(request, env);
  const names = await tallyNames(env, ipKey);
  const limits = admin
    ? [{ name: names.all, cap: ALL_DAILY_SECONDS }]
    : [
        { name: names.all, cap: ALL_DAILY_SECONDS },
        { name: names.visitors, cap: VISITORS_DAILY_SECONDS },
        { name: names.mine, cap: VISITOR_DAILY_SECONDS },
      ];
  const funded = await spendWrites(env, APP, TALLY_WRITE_ROWS, CAPTIONS_DAILY_WRITE_CAP);
  if (!funded) return reply(429, { error: USED_UP_ALL }, cors);
  if (!(await reserve(env, piece.seconds, limits))) {
    const left = await allowance(env, request, ipKey);
    return reply(429, { error: left.all < piece.seconds ? USED_UP_ALL : USED_UP_MINE, ...left }, cors);
  }

  let result;
  try {
    const input = { audio: piece.audio, vad_filter: true };
    if (piece.language) input.language = piece.language;
    if (piece.hint) input.initial_prompt = `${HINT_PREFIX}${piece.hint}.`;
    result = await env.AI.run(MODEL, input);
  } catch {
    // Nothing was transcribed, so the seconds go back
    await reserve(env, -piece.seconds, limits.map((limit) => ({ name: limit.name, cap: Number.MAX_SAFE_INTEGER })));
    return reply(502, { error: MODEL_FAILED }, cors);
  }
  const info = (result && result.transcription_info) || {};
  return reply(200, {
    segments: cleanSegments(result && result.segments),
    language: typeof info.language === "string" ? info.language.slice(0, 8) : "",
    ...(await allowance(env, request, ipKey)),
  }, cors);
}

const roundTime = (value) => (Number.isFinite(value) && value >= 0 ? Math.round(value * TIME_DECIMALS) / TIME_DECIMALS : 0);

/**
 * The model's answer, cut down to what the page uses and bounded.
 * @param {any} raw
 * @returns {{ start: number, end: number, text: string, words: { w: string, s: number, e: number }[] }[]}
 */
function cleanSegments(raw) {
  if (!Array.isArray(raw)) return [];
  let wordBudget = MAX_WORDS;
  return raw.slice(0, MAX_SEGMENTS).map((segment) => {
    const words = (Array.isArray(segment.words) ? segment.words : []).slice(0, wordBudget).map((word) => ({
      w: String(word.word || "").trim().slice(0, MAX_WORD_LENGTH),
      s: roundTime(word.start),
      e: roundTime(word.end),
    })).filter((word) => word.w);
    wordBudget -= words.length;
    return {
      start: roundTime(segment.start),
      end: roundTime(segment.end),
      text: String(segment.text || "").trim().slice(0, MAX_TEXT_LENGTH),
      words,
    };
  }).filter((segment) => segment.text);
}

/** @returns {Promise<{ pass: string, audio: string, seconds: number, language: string, hint: string } | null>} */
async function readPiece(request) {
  const data = await readJson(request, MAX_TRANSCRIBE_BYTES);
  if (!data || typeof data.audio !== "string" || !data.audio || data.audio.length > MAX_AUDIO_LENGTH) return null;
  if (!BASE64_PATTERN.test(data.audio)) return null;
  const seconds = Math.ceil(Number(data.seconds));
  if (!Number.isInteger(seconds) || seconds < 1 || seconds > MAX_PIECE_SECONDS) return null;
  const language = typeof data.language === "string" && LANGUAGE_PATTERN.test(data.language) ? data.language : "";
  // Letters, digits, spaces and commas only: the hint becomes part of the model's prompt
  const hint = typeof data.hint === "string" ? data.hint.replace(/[^\p{L}\p{N} ,'-]/gu, "").trim().slice(0, MAX_HINT_LENGTH) : "";
  return { pass: data.pass, audio: data.audio, seconds, language, hint };
}

/** The owner's saved projects. */
async function projects(request, env, cors, id) {
  if (!(await isAdmin(request, env))) return reply(401, { error: "Sign in" }, cors);
  if (!id) {
    if (request.method !== "GET") return reply(405, { error: "Method not allowed" }, cors);
    const { results } = await env.DB.prepare(LIST_PROJECTS_SQL).bind(MAX_PROJECTS).all();
    return reply(200, { projects: results }, cors);
  }
  if (!PROJECT_ID_PATTERN.test(id)) return reply(400, { error: "Bad request" }, cors);

  if (request.method === "GET") {
    const row = await env.DB.prepare(READ_PROJECT_SQL).bind(id).first();
    return row ? reply(200, row, cors) : reply(404, { error: "Not found" }, cors);
  }
  if (request.method === "DELETE") {
    if (!(await spendWrites(env, APP, PROJECT_WRITE_ROWS, CAPTIONS_DAILY_WRITE_CAP))) return reply(503, { error: "Please try again tomorrow" }, cors);
    await env.DB.prepare(DELETE_PROJECT_SQL).bind(id).run();
    return reply(200, { deleted: true }, cors);
  }
  if (request.method !== "PUT") return reply(405, { error: "Method not allowed" }, cors);

  const data = await readJson(request, MAX_PROJECT_BYTES);
  if (!data || typeof data.name !== "string" || typeof data.body !== "string") return reply(400, { error: "Bad request" }, cors);
  const name = data.name.trim().slice(0, MAX_PROJECT_NAME) || "Untitled";
  if (!(await spendWrites(env, APP, PROJECT_WRITE_ROWS, CAPTIONS_DAILY_WRITE_CAP))) return reply(503, { error: "Please try again tomorrow" }, cors);
  const updatedAt = Date.now();
  const saved = await env.DB.prepare(SAVE_PROJECT_SQL).bind(id, name, data.body, updatedAt, MAX_PROJECTS).run();
  if (!saved.meta.changes) return reply(409, { error: "The project shelf is full. Delete one first." }, cors);
  return reply(200, { saved: true, updatedAt }, cors);
}

/** @returns {Promise<any>} the parsed JSON body, or null when it is too big or not JSON */
async function readJson(request, maxBytes) {
  if (!(request.headers.get("Content-Type") || "").startsWith(JSON_TYPE)) return null;
  const body = await readBoundedBody(request, maxBytes);
  if (body === null) return null;
  try {
    return JSON.parse(body);
  } catch {
    return null;
  }
}
