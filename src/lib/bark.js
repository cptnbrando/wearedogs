/**
 * bark.js
 * A short "woof", made on the spot with Web Audio: no sound file to fetch.
 * The DOGS logo on both sides of the landing card barks when tapped
 * (DogsSide.svelte, ProjectsSide.svelte). One audio context, made on the
 * first bark (a tap is the gesture browsers want before sound).
 */

/** The woof: a growl that drops in pitch, roughed up with a puff of breath. */
const START_HZ = 560;
const END_HZ = 240;
const LENGTH_S = 0.2;
const ATTACK_S = 0.012;
const VOLUME = 0.35;
const BREATH_VOLUME = 0.25;
const MOUTH_HZ = 1100;
const MOUTH_Q = 1.4;
/** Taps closer together than this get one bark, so a double tap is not a pile-up. */
const MIN_GAP_MS = 180;

let ctx = null;
let lastBark = 0;

/** Barks once. Quietly does nothing where Web Audio is missing. */
export function bark() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  const now = Date.now();
  if (!AudioContextClass || now - lastBark < MIN_GAP_MS) return;
  lastBark = now;
  if (!ctx) ctx = new AudioContextClass();
  if (ctx.state === "suspended") ctx.resume();

  const t = ctx.currentTime;
  const mouth = ctx.createBiquadFilter();
  mouth.type = "bandpass";
  mouth.frequency.value = MOUTH_HZ;
  mouth.Q.value = MOUTH_Q;
  const level = ctx.createGain();
  level.gain.setValueAtTime(0.0001, t);
  level.gain.exponentialRampToValueAtTime(VOLUME, t + ATTACK_S);
  level.gain.exponentialRampToValueAtTime(0.0001, t + LENGTH_S);
  mouth.connect(level);
  level.connect(ctx.destination);

  const voice = ctx.createOscillator();
  voice.type = "sawtooth";
  voice.frequency.setValueAtTime(START_HZ, t);
  voice.frequency.exponentialRampToValueAtTime(END_HZ, t + LENGTH_S);
  voice.connect(mouth);

  // Breath: a burst of noise through the same mouth
  const samples = Math.ceil(ctx.sampleRate * LENGTH_S);
  const noise = ctx.createBuffer(1, samples, ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < samples; i++) data[i] = (Math.random() * 2 - 1) * BREATH_VOLUME;
  const breath = ctx.createBufferSource();
  breath.buffer = noise;
  breath.connect(mouth);

  voice.start(t);
  breath.start(t);
  voice.stop(t + LENGTH_S);
  breath.stop(t + LENGTH_S);
}
