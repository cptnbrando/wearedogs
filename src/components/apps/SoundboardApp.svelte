<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<script>
  import { onMount, onDestroy } from "svelte";
  import { 
    Volume2, Activity, Play, Trash2, Keyboard, Sliders, Zap
  } from "lucide-svelte";
  import { samplerStore } from "../../lib/samplerStore.svelte.js";

  // Sampler state
  let audioCtx = null;
  let activePadIndex = $state(null);
  let activeOscillators = [];
  let activeAudioElements = [];

  // OP-1 Encoders (Knobs) state
  let knobPitch = $state(1.0); // 0.5 to 2.0
  let knobSpeed = $state(1.0); // 0.5 to 2.0
  let knobVolume = $state(0.7); // 0.0 to 1.0
  let knobCutoff = $state(2000); // 200Hz to 10000Hz (Lowpass)

  // Dragging states for custom visual knobs
  let activeDragKnob = $state(null); // 'pitch' | 'speed' | 'volume' | 'cutoff'
  let dragStartY = 0;
  let dragStartVal = 0;

  // Visualizer Oscilloscope Ref
  let canvasRef = $state();
  let canvasCtx = null;
  let waveAmplitude = $state(0);
  let animationFrameId = null;

  // Kits data definitions
  const KITS = [
    {
      id: "canine",
      name: "Canine Synth",
      color: "#00bfff",
      glow: "rgba(0, 191, 255, 0.4)",
      sounds: [
        { id: "woof", type: "procedural", proceduralType: "woof", label: "Deep Woof", emoji: "🐕", key: "q", color: "pad-blue" },
        { id: "yip", type: "procedural", proceduralType: "yip", label: "Puppy Yip", emoji: "🐶", key: "w", color: "pad-cyan" },
        { id: "growl", type: "procedural", proceduralType: "growl", label: "Playful Growl", emoji: "🐺", key: "e", color: "pad-orange" },
        { id: "husky", type: "procedural", proceduralType: "woof", options: { pitch: 1.3, speed: 1.1 }, label: "Husky Bark", emoji: "🦊", key: "r", color: "pad-blue" },
        { id: "chihuahua", type: "procedural", proceduralType: "yip", options: { pitch: 1.5 }, label: "Chihuahua", emoji: "🐩", key: "t", color: "pad-cyan" },
        { id: "guard", type: "procedural", proceduralType: "woof", options: { pitch: 0.7, speed: 0.8 }, label: "Guard Bark", emoji: "👹", key: "y", color: "pad-orange" },
        { id: "growllow", type: "procedural", proceduralType: "growl", options: { pitch: 0.6, speed: 0.8 }, label: "Angry Growl", emoji: "🦁", key: "u", color: "pad-orange" },
        { id: "boof", type: "procedural", proceduralType: "woof", options: { pitch: 0.5, speed: 0.7 }, label: "Boof", emoji: "🐻", key: "i", color: "pad-blue" },
        { id: "squeak", type: "procedural", proceduralType: "yip", options: { pitch: 2.0, speed: 1.5 }, label: "Squeaky Toy", emoji: "🧸", key: "o", color: "pad-cyan" },
        { id: "whistle", type: "procedural", proceduralType: "yip", options: { pitch: 3.5, speed: 0.8 }, label: "Dog Whistle", emoji: "😗", key: "p", color: "pad-cyan" },
        { id: "bigbark", type: "procedural", proceduralType: "woof", options: { pitch: 0.9, speed: 1.0 }, label: "Big Bark", emoji: "🐕‍🦺", key: "a", color: "pad-blue" },
        { id: "lilgrowl", type: "procedural", proceduralType: "growl", options: { pitch: 1.2 }, label: "Lil Growl", emoji: "🐈", key: "s", color: "pad-orange" },
        { id: "subwoofer", type: "procedural", proceduralType: "woof", options: { pitch: 0.4, speed: 0.6 }, label: "Sub Woofer", emoji: "🔊", key: "d", color: "pad-blue" },
        { id: "speedyip", type: "procedural", proceduralType: "yip", options: { pitch: 1.1, speed: 2.0 }, label: "Speedy Yip", emoji: "⚡", key: "f", color: "pad-cyan" },
        { id: "slowbark", type: "procedural", proceduralType: "woof", options: { pitch: 0.8, speed: 0.5 }, label: "Slow Bark", emoji: "🐢", key: "g", color: "pad-blue" },
        { id: "echobark", type: "procedural", proceduralType: "woof", options: { pitch: 1.0, speed: 0.3 }, label: "Echo Bark", emoji: "🌀", key: "h", color: "pad-blue" }
      ]
    },
    {
      id: "minecraft",
      name: "Minecraft Blocks",
      color: "#00ff66",
      glow: "rgba(0, 255, 102, 0.4)",
      sounds: [
        { id: "mc-large", type: "file", url: "https://data.wearedogs.net/music/soundboard/minecraft-large.mp3", label: "MC Large", emoji: "🧱", key: "q", color: "pad-blue" },
        { id: "mc-medium", type: "file", url: "https://data.wearedogs.net/music/soundboard/minecraft-medium.mp3", label: "MC Medium", emoji: "🪵", key: "w", color: "pad-orange" },
        { id: "mc-small", type: "file", url: "https://data.wearedogs.net/music/soundboard/minecraft-small.mp3", label: "MC Small", emoji: "🪨", key: "e", color: "pad-cyan" },
        { id: "mc-tiny", type: "file", url: "https://data.wearedogs.net/music/soundboard/minecraft-tiny.mp3", label: "MC Tiny", emoji: "💎", key: "r", color: "pad-pink" },
        { id: "mc-large-slow", type: "file", url: "https://data.wearedogs.net/music/soundboard/minecraft-large.mp3", options: { pitch: 0.7, speed: 0.7 }, label: "MC Giant Block", emoji: "🏔️", key: "t", color: "pad-blue" },
        { id: "mc-medium-fast", type: "file", url: "https://data.wearedogs.net/music/soundboard/minecraft-medium.mp3", options: { pitch: 1.5, speed: 1.5 }, label: "MC Wood Chop", emoji: "🪓", key: "y", color: "pad-orange" },
        { id: "mc-small-pitch", type: "file", url: "https://data.wearedogs.net/music/soundboard/minecraft-small.mp3", options: { pitch: 1.8, speed: 1.2 }, label: "MC Pebble Kick", emoji: "👟", key: "u", color: "pad-cyan" },
        { id: "mc-tiny-slow", type: "file", url: "https://data.wearedogs.net/music/soundboard/minecraft-tiny.mp3", options: { pitch: 0.5, speed: 0.8 }, label: "MC Giant Gem", emoji: "👑", key: "i", color: "pad-pink" },
        { id: "mc-pro-grass", type: "procedural", proceduralType: "woof", options: { pitch: 2.2, speed: 2.0 }, label: "Procedural Grass", emoji: "🌱", key: "o", color: "pad-orange" },
        { id: "mc-pro-stone", type: "procedural", proceduralType: "growl", options: { pitch: 0.3, speed: 1.5 }, label: "Procedural Stone", emoji: "⛰️", key: "p", color: "pad-blue" },
        { id: "mc-pro-sand", type: "procedural", proceduralType: "growl", options: { pitch: 0.5, speed: 2.5 }, label: "Procedural Sand", emoji: "⏳", key: "a", color: "pad-cyan" },
        { id: "mc-pro-gravel", type: "procedural", proceduralType: "growl", options: { pitch: 0.4, speed: 1.8 }, label: "Procedural Gravel", emoji: "🪰", key: "s", color: "pad-blue" },
        { id: "mc-pro-anvil", type: "procedural", proceduralType: "yip", options: { pitch: 0.3, speed: 0.5 }, label: "Procedural Anvil", emoji: "⚓", key: "d", color: "pad-cyan" },
        { id: "mc-pro-glass", type: "procedural", proceduralType: "yip", options: { pitch: 2.5, speed: 1.8 }, label: "Procedural Glass", emoji: "🍷", key: "f", color: "pad-pink" },
        { id: "mc-pro-water", type: "procedural", proceduralType: "yip", options: { pitch: 0.8, speed: 0.3 }, label: "Procedural Splash", emoji: "💧", key: "g", color: "pad-blue" },
        { id: "mc-pro-lava", type: "procedural", proceduralType: "growl", options: { pitch: 0.2, speed: 0.4 }, label: "Procedural Sizzle", emoji: "🔥", key: "h", color: "pad-orange" }
      ]
    },
    {
      id: "tips-island",
      name: "Tips & Island",
      color: "#ff55bb",
      glow: "rgba(255, 85, 187, 0.4)",
      sounds: [
        { id: "li-break", type: "file", url: "https://data.wearedogs.net/music/soundboard/loveisland-break.mp3", label: "LI Break", emoji: "🏝️", key: "q", color: "pad-pink" },
        { id: "li-text", type: "file", url: "https://data.wearedogs.net/music/soundboard/loveisland-text.mp3", label: "LI Text", emoji: "💬", key: "w", color: "pad-pink" },
        { id: "tip-med", type: "file", url: "https://data.wearedogs.net/music/soundboard/tip-medium.mp3", label: "Tip Medium", emoji: "🪙", key: "e", color: "pad-orange" },
        { id: "tip-small", type: "file", url: "https://data.wearedogs.net/music/soundboard/tip-small.mp3", label: "Tip Small", emoji: "💰", key: "r", color: "pad-orange" },
        { id: "tip-tiny", type: "file", url: "https://data.wearedogs.net/music/soundboard/tip-tiny.mp3", label: "Tip Tiny", emoji: "💎", key: "t", color: "pad-cyan" },
        { id: "li-break-fast", type: "file", url: "https://data.wearedogs.net/music/soundboard/loveisland-break.mp3", options: { pitch: 1.5, speed: 1.5 }, label: "LI Break Fast", emoji: "🏃‍♀️", key: "y", color: "pad-pink" },
        { id: "li-text-slow", type: "file", url: "https://data.wearedogs.net/music/soundboard/loveisland-text.mp3", options: { pitch: 0.7, speed: 0.7 }, label: "LI Text Slow", emoji: "🐌", key: "u", color: "pad-pink" },
        { id: "tip-med-slow", type: "file", url: "https://data.wearedogs.net/music/soundboard/tip-medium.mp3", options: { pitch: 0.6, speed: 0.6 }, label: "Tip Med Low", emoji: "📉", key: "i", color: "pad-orange" },
        { id: "tip-small-fast", type: "file", url: "https://data.wearedogs.net/music/soundboard/tip-small.mp3", options: { pitch: 1.4, speed: 1.4 }, label: "Tip Small High", emoji: "📈", key: "o", color: "pad-orange" },
        { id: "tip-tiny-pitch", type: "file", url: "https://data.wearedogs.net/music/soundboard/tip-tiny.mp3", options: { pitch: 1.8, speed: 1.8 }, label: "Tip Tiny High", emoji: "✨", key: "p", color: "pad-cyan" },
        { id: "pro-island-drum", type: "procedural", proceduralType: "woof", options: { pitch: 0.3, speed: 1.5 }, label: "Island Tom", emoji: "🥁", key: "a", color: "pad-blue" },
        { id: "pro-island-shaker", type: "procedural", proceduralType: "growl", options: { pitch: 2.5, speed: 3.0 }, label: "Island Shaker", emoji: "🌾", key: "s", color: "pad-blue" },
        { id: "pro-island-whistle", type: "procedural", proceduralType: "yip", options: { pitch: 2.2, speed: 1.0 }, label: "Island Whistle", emoji: "🎽", key: "d", color: "pad-cyan" },
        { id: "pro-island-wave", type: "procedural", proceduralType: "growl", options: { pitch: 0.1, speed: 0.2 }, label: "Ocean Breeze", emoji: "🌊", key: "f", color: "pad-blue" },
        { id: "pro-island-rim", type: "procedural", proceduralType: "yip", options: { pitch: 1.8, speed: 2.5 }, label: "Island Rimshot", emoji: "🥢", key: "g", color: "pad-cyan" },
        { id: "pro-island-gong", type: "procedural", proceduralType: "growl", options: { pitch: 0.15, speed: 0.3 }, label: "Island Gong", emoji: "🔔", key: "h", color: "pad-orange" }
      ]
    },
    {
      id: "arcade",
      name: "Arcade SFX",
      color: "#00bfff",
      glow: "rgba(0, 191, 255, 0.4)",
      sounds: [
        { id: "arc-coin", type: "procedural", proceduralType: "coin", label: "Insert Coin", emoji: "👾", key: "q", color: "pad-cyan" },
        { id: "arc-laser", type: "procedural", proceduralType: "laser", label: "Laser Beam", emoji: "🔫", key: "w", color: "pad-blue" },
        { id: "arc-explosion", type: "procedural", proceduralType: "explosion", label: "Explosion", emoji: "💥", key: "e", color: "pad-orange" },
        { id: "arc-jump", type: "procedural", proceduralType: "jump", label: "Retro Jump", emoji: "🦘", key: "r", color: "pad-cyan" },
        { id: "arc-powerup", type: "procedural", proceduralType: "powerup", label: "Power Up", emoji: "⭐", key: "t", color: "pad-pink" },
        { id: "arc-defeat", type: "procedural", proceduralType: "defeat", label: "Game Over", emoji: "💀", key: "y", color: "pad-orange" },
        { id: "arc-warp", type: "procedural", proceduralType: "warp", label: "Teleport", emoji: "🌀", key: "u", color: "pad-blue" },
        { id: "arc-zap", type: "procedural", proceduralType: "zap", label: "Zap!", emoji: "⚡", key: "i", color: "pad-cyan" },
        { id: "arc-coin-double", type: "procedural", proceduralType: "coin", options: { speed: 2.0, pitch: 1.2 }, label: "Double Coin", emoji: "💰", key: "o", color: "pad-cyan" },
        { id: "arc-laser-rapid", type: "procedural", proceduralType: "laser", options: { speed: 2.0 }, label: "Rapid Fire", emoji: "🛸", key: "p", color: "pad-blue" },
        { id: "arc-explosion-low", type: "procedural", proceduralType: "explosion", options: { pitch: 0.5, speed: 0.6 }, label: "Big Bang", emoji: "🪐", key: "a", color: "pad-orange" },
        { id: "arc-jump-high", type: "procedural", proceduralType: "jump", options: { pitch: 1.5 }, label: "High Jump", emoji: "🪁", key: "s", color: "pad-cyan" },
        { id: "arc-powerup-fast", type: "procedural", proceduralType: "powerup", options: { speed: 1.5 }, label: "Speed Up", emoji: "🏎️", key: "d", color: "pad-pink" },
        { id: "arc-defeat-deep", type: "procedural", proceduralType: "defeat", options: { pitch: 0.6 }, label: "Deep Defeat", emoji: "🩸", key: "f", color: "pad-orange" },
        { id: "arc-warp-fast", type: "procedural", proceduralType: "warp", options: { speed: 2.0 }, label: "Hyperdrive", emoji: "☄️", key: "g", color: "pad-blue" },
        { id: "arc-zap-tiny", type: "procedural", proceduralType: "zap", options: { pitch: 2.0, speed: 2.0 }, label: "Tiny Spark", emoji: "✨", key: "h", color: "pad-cyan" }
      ]
    },
    {
      id: "custom",
      name: "User Sampler",
      color: "#ffcc00",
      glow: "rgba(255, 204, 0, 0.4)",
      sounds: []
    }
  ];

  let activeKitIndex = $state(0);
  let activeKit = $derived(KITS[activeKitIndex]);

  function selectKit(idx) {
    activeKitIndex = idx;
  }

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  // Play Procedural sound
  function playProcedural(type, options = {}) {
    initAudio();
    if (!audioCtx) return;

    // Trigger visualizer amplitude pulse
    waveAmplitude = 1.0;
    
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    // Apply OP-1 Knobs
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(knobCutoff, now);
    gain.gain.setValueAtTime(knobVolume * 0.7, now);

    const basePitch = knobPitch * (options.pitch || 1.0);
    const speed = knobSpeed * (options.speed || 1.0);

    if (type === "woof") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(140 * basePitch, now);
      osc.frequency.exponentialRampToValueAtTime(60 * basePitch, now + 0.18 / speed);
      
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22 / speed);
      osc.start(now);
      osc.stop(now + 0.22 / speed);
    } else if (type === "yip") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(550 * basePitch, now);
      osc.frequency.exponentialRampToValueAtTime(320 * basePitch, now + 0.1 / speed);
      
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12 / speed);
      osc.start(now);
      osc.stop(now + 0.12 / speed);
    } else if (type === "growl") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(180 * basePitch, now);
      osc.frequency.linearRampToValueAtTime(250 * basePitch, now + 0.15 / speed);
      osc.frequency.exponentialRampToValueAtTime(90 * basePitch, now + 0.45 / speed);
      
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45 / speed);
      osc.start(now);
      osc.stop(now + 0.45 / speed);
    } else if (type === "coin") {
      osc.type = "sine";
      const duration = 0.3 / speed;
      osc.frequency.setValueAtTime(987.77 * basePitch, now);
      osc.frequency.setValueAtTime(1318.51 * basePitch, now + 0.08 / speed);
      
      gain.gain.setValueAtTime(knobVolume * 0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
      osc.start(now);
      osc.stop(now + duration);
    } else if (type === "laser") {
      osc.type = "sawtooth";
      const duration = 0.25 / speed;
      osc.frequency.setValueAtTime(1200 * basePitch, now);
      osc.frequency.exponentialRampToValueAtTime(100 * basePitch, now + duration);
      
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
      osc.start(now);
      osc.stop(now + duration);
    } else if (type === "explosion") {
      osc.type = "sawtooth";
      const duration = 0.6 / speed;
      osc.frequency.setValueAtTime(100 * basePitch, now);
      osc.frequency.linearRampToValueAtTime(10 * basePitch, now + duration);
      
      filter.frequency.setValueAtTime(knobCutoff, now);
      filter.frequency.exponentialRampToValueAtTime(50, now + duration);
      
      gain.gain.setValueAtTime(knobVolume * 0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
      osc.start(now);
      osc.stop(now + duration);
    } else if (type === "jump") {
      osc.type = "triangle";
      const duration = 0.2 / speed;
      osc.frequency.setValueAtTime(150 * basePitch, now);
      osc.frequency.exponentialRampToValueAtTime(600 * basePitch, now + duration);
      
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
      osc.start(now);
      osc.stop(now + duration);
    } else if (type === "powerup") {
      osc.type = "sine";
      const duration = 0.45 / speed;
      const t = 0.08 / speed;
      osc.frequency.setValueAtTime(330 * basePitch, now);
      osc.frequency.setValueAtTime(440 * basePitch, now + t);
      osc.frequency.setValueAtTime(554 * basePitch, now + t * 2);
      osc.frequency.setValueAtTime(660 * basePitch, now + t * 3);
      osc.frequency.setValueAtTime(880 * basePitch, now + t * 4);
      
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
      osc.start(now);
      osc.stop(now + duration);
    } else if (type === "defeat") {
      osc.type = "triangle";
      const duration = 0.5 / speed;
      const t = 0.12 / speed;
      osc.frequency.setValueAtTime(440 * basePitch, now);
      osc.frequency.setValueAtTime(415 * basePitch, now + t);
      osc.frequency.setValueAtTime(370 * basePitch, now + t * 2);
      osc.frequency.setValueAtTime(293 * basePitch, now + t * 3);
      osc.frequency.linearRampToValueAtTime(100 * basePitch, now + duration);
      
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
      osc.start(now);
      osc.stop(now + duration);
    } else if (type === "warp") {
      osc.type = "sine";
      const duration = 0.45 / speed;
      for (let i = 0; i < 20; i++) {
        const stepTime = now + (i * 0.02) / speed;
        const freq = (600 + Math.sin(i * 1.5) * 150) * basePitch;
        osc.frequency.setValueAtTime(freq, stepTime);
      }
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
      osc.start(now);
      osc.stop(now + duration);
    } else if (type === "zap") {
      osc.type = "sawtooth";
      const duration = 0.15 / speed;
      osc.frequency.setValueAtTime(800 * basePitch, now);
      osc.frequency.exponentialRampToValueAtTime(2000 * basePitch, now + duration);
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
      osc.start(now);
      osc.stop(now + duration);
    }

    activeOscillators.push(osc);
  }

  // Play Video audio slice
  function playCustomClip(clip) {
    // Trigger visualizer amplitude pulse
    waveAmplitude = 0.8;
    
    // Create new Audio element for streaming
    const audio = new Audio(clip.videoUrl);
    audio.crossOrigin = "anonymous";
    audio.currentTime = clip.start;
    audio.volume = knobVolume;
    audio.playbackRate = knobSpeed * knobPitch;
    
    if (typeof audio.preservesPitch !== "undefined") {
      audio.preservesPitch = false; // pitch shift with speed
    }

    // Set filter utilizing Web Audio (if possible/supported, otherwise direct player playback)
    initAudio();
    if (audioCtx) {
      try {
        const source = audioCtx.createMediaElementSource(audio);
        const filter = audioCtx.createBiquadFilter();
        const gain = audioCtx.createGain();

        source.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(knobCutoff, audioCtx.currentTime);
        gain.gain.setValueAtTime(knobVolume, audioCtx.currentTime);
      } catch (err) {
        // Fallback to direct element routing if already wired
        audio.volume = knobVolume;
      }
    }

    audio.play();
    activeAudioElements.push(audio);

    // Stop exactly at clip endpoint (taking rate into account)
    const clipDurationSec = (clip.end - clip.start) / (knobSpeed * knobPitch);
    
    const stopTimer = setTimeout(() => {
      audio.pause();
      audio.remove();
      activeAudioElements = activeAudioElements.filter(a => a !== audio);
    }, clipDurationSec * 1000);
  }

  // Play direct audio file
  function playAudioFile(url, options = {}) {
    waveAmplitude = 0.8;
    const audio = new Audio(url);
    audio.crossOrigin = "anonymous";
    
    const pitchMultiplier = options.pitch || 1.0;
    const speedMultiplier = options.speed || 1.0;
    
    audio.volume = knobVolume;
    audio.playbackRate = knobSpeed * knobPitch * speedMultiplier * pitchMultiplier;

    if (typeof audio.preservesPitch !== "undefined") {
      audio.preservesPitch = false;
    }

    initAudio();
    if (audioCtx) {
      try {
        const source = audioCtx.createMediaElementSource(audio);
        const filter = audioCtx.createBiquadFilter();
        const gain = audioCtx.createGain();

        source.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(knobCutoff, audioCtx.currentTime);
        gain.gain.setValueAtTime(knobVolume, audioCtx.currentTime);
      } catch (err) {
        audio.volume = knobVolume;
      }
    }

    audio.play();
    activeAudioElements.push(audio);

    audio.onended = () => {
      audio.remove();
      activeAudioElements = activeAudioElements.filter(a => a !== audio);
    };
  }

  // Unified Launchpad triggers
  function triggerPad(idx) {
    activePadIndex = idx;
    setTimeout(() => {
      if (activePadIndex === idx) activePadIndex = null;
    }, 250);

    const sounds = activeKit.id === "custom" ? samplerStore.customClips : activeKit.sounds;
    const sound = sounds[idx];
    if (!sound) return;

    if (activeKit.id === "custom") {
      playCustomClip(sound);
    } else if (sound.type === "procedural") {
      playProcedural(sound.proceduralType, sound.options || {});
    } else if (sound.type === "file") {
      playAudioFile(sound.url, sound.options || {});
    }
  }

  // Remove custom clips
  function deleteClip(id, e) {
    e.stopPropagation();
    samplerStore.removeClip(id);
  }

  // CRT Oscilloscope waveform generator loop
  function startVisualizer() {
    canvasCtx = canvasRef.getContext("2d");
    
    function draw() {
      if (!canvasRef) return;
      
      const width = canvasRef.width;
      const height = canvasRef.height;
      
      canvasCtx.fillStyle = "rgba(10, 10, 15, 0.2)"; // trailing decay
      canvasCtx.fillRect(0, 0, width, height);

      // CRT phosphor grid scanlines
      canvasCtx.strokeStyle = "rgba(255, 255, 255, 0.02)";
      canvasCtx.lineWidth = 1;
      for (let i = 0; i < width; i += 20) {
        canvasCtx.beginPath();
        canvasCtx.moveTo(i, 0);
        canvasCtx.lineTo(i, height);
        canvasCtx.stroke();
      }
      for (let i = 0; i < height; i += 20) {
        canvasCtx.beginPath();
        canvasCtx.moveTo(0, i);
        canvasCtx.lineTo(width, i);
        canvasCtx.stroke();
      }

      // Draw Oscilloscope waveform
      canvasCtx.beginPath();
      canvasCtx.strokeStyle = activeKit.color;
      canvasCtx.lineWidth = 2.5;
      canvasCtx.shadowBlur = 10;
      canvasCtx.shadowColor = activeKit.color;

      const time = Date.now() * 0.015;
      
      for (let x = 0; x < width; x++) {
        // Multi-frequency synthesized sine waves scaled by waveAmplitude
        const scale1 = Math.sin(x * 0.05 + time) * 35;
        const scale2 = Math.cos(x * 0.12 - time * 0.5) * 15;
        const noise = (Math.random() - 0.5) * 4;
        
        const y = (height / 2) + (scale1 + scale2 + noise) * waveAmplitude;
        
        if (x === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }
      }
      canvasCtx.stroke();
      canvasCtx.shadowBlur = 0; // reset

      // Slowly decay amplitude back to rest state (flatline noise)
      if (waveAmplitude > 0.02) {
        waveAmplitude *= 0.94;
      } else {
        waveAmplitude = 0.02; // subtle flat line wiggle
      }

      animationFrameId = requestAnimationFrame(draw);
    }
    draw();
  }

  // Keyboard controls key bindings
  function handleKeydown(e) {
    const key = e.key.toLowerCase();
    
    // Switch kits using keys 1-5
    if (key === "1") {
      selectKit(0);
      return;
    } else if (key === "2") {
      selectKit(1);
      return;
    } else if (key === "3") {
      selectKit(2);
      return;
    } else if (key === "4") {
      selectKit(3);
      return;
    } else if (key === "5") {
      selectKit(4);
      return;
    }
    
    // Dynamic keyboard triggering of sounds mapped to the key properties of the active kit
    const currentSounds = activeKit.id === "custom" ? samplerStore.customClips : activeKit.sounds;
    const matchIdx = currentSounds.findIndex(s => s.key === key);
    if (matchIdx !== -1 && matchIdx < 16) {
      triggerPad(matchIdx);
    }
  }

  // Reset knob to default values
  function resetKnob(knob) {
    if (knob === "pitch") knobPitch = 1.0;
    else if (knob === "speed") knobSpeed = 1.0;
    else if (knob === "volume") knobVolume = 0.7;
    else if (knob === "cutoff") knobCutoff = 2000;
  }

  // Clicking and dragging encoders (knobs) handlers
  function startKnobDrag(knob, e) {
    activeDragKnob = knob;
    dragStartY = e.clientY;
    
    if (knob === "pitch") dragStartVal = knobPitch;
    else if (knob === "speed") dragStartVal = knobSpeed;
    else if (knob === "volume") dragStartVal = knobVolume;
    else if (knob === "cutoff") dragStartVal = knobCutoff;

    window.addEventListener("mousemove", handleKnobDrag);
    window.addEventListener("mouseup", stopKnobDrag);
  }

  function handleKnobDrag(e) {
    if (!activeDragKnob) return;
    const deltaY = dragStartY - e.clientY; // drag up to increase

    if (activeDragKnob === "pitch") {
      knobPitch = Math.max(0.5, Math.min(2.0, dragStartVal + deltaY * 0.008));
    } else if (activeDragKnob === "speed") {
      knobSpeed = Math.max(0.5, Math.min(2.0, dragStartVal + deltaY * 0.008));
    } else if (activeDragKnob === "volume") {
      knobVolume = Math.max(0.0, Math.min(1.0, dragStartVal + deltaY * 0.008));
    } else if (activeDragKnob === "cutoff") {
      knobCutoff = Math.max(200, Math.min(10000, dragStartVal + deltaY * 40));
    }
  }

  function stopKnobDrag() {
    activeDragKnob = null;
    window.removeEventListener("mousemove", handleKnobDrag);
    window.removeEventListener("mouseup", stopKnobDrag);
  }

  // Touch and drag support for mobile / tablet devices
  let lastTapTimes = {};
  function handleTouchStart(knob, e) {
    // Check for double-tap to reset
    const now = Date.now();
    const lastTap = lastTapTimes[knob] || 0;
    if (now - lastTap < 300) {
      resetKnob(knob);
      lastTapTimes[knob] = 0;
      if (e.cancelable) e.preventDefault();
      return;
    }
    lastTapTimes[knob] = now;

    activeDragKnob = knob;
    const touch = e.touches[0];
    dragStartY = touch.clientY;

    if (knob === "pitch") dragStartVal = knobPitch;
    else if (knob === "speed") dragStartVal = knobSpeed;
    else if (knob === "volume") dragStartVal = knobVolume;
    else if (knob === "cutoff") dragStartVal = knobCutoff;

    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", stopTouchDrag);
    window.addEventListener("touchcancel", stopTouchDrag);
  }

  function handleTouchMove(e) {
    if (!activeDragKnob) return;
    if (e.cancelable) e.preventDefault();
    
    const touch = e.touches[0];
    const deltaY = dragStartY - touch.clientY; // drag up to increase

    if (activeDragKnob === "pitch") {
      knobPitch = Math.max(0.5, Math.min(2.0, dragStartVal + deltaY * 0.008));
    } else if (activeDragKnob === "speed") {
      knobSpeed = Math.max(0.5, Math.min(2.0, dragStartVal + deltaY * 0.008));
    } else if (activeDragKnob === "volume") {
      knobVolume = Math.max(0.0, Math.min(1.0, dragStartVal + deltaY * 0.008));
    } else if (activeDragKnob === "cutoff") {
      knobCutoff = Math.max(200, Math.min(10000, dragStartVal + deltaY * 40));
    }
  }

  function stopTouchDrag() {
    activeDragKnob = null;
    window.removeEventListener("touchmove", handleTouchMove);
    window.removeEventListener("touchend", stopTouchDrag);
    window.removeEventListener("touchcancel", stopTouchDrag);
  }

  onMount(() => {
    startVisualizer();
  });

  onDestroy(() => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    activeOscillators.forEach(o => { try { o.stop(); } catch(e) {} });
    activeAudioElements.forEach(a => { try { a.pause(); a.remove(); } catch(e) {} });
  });
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="soundboard-layout animated-pane w-full min-h-screen flex items-center justify-center p-3 sm:p-5 md:p-8 xl:p-12 2xl:p-16 bg-[#09090d]">
  <div class="op1-chassis w-full max-w-[620px] sm:max-w-[820px] md:max-w-[900px] lg:max-w-[1000px] xl:max-w-5xl 2xl:max-w-[1300px] flex flex-col sm:grid sm:grid-cols-12 gap-4 sm:gap-6 bg-[#18181f] border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-2xl">
    <!-- Left Column: Screen + Knobs -->
    <div class="chassis-left col-span-12 sm:col-span-5 flex flex-col gap-3">
      <!-- LCD Display screen (Waveform + Info indicators) -->
      <div class="op1-screen-unit">
        <div class="screen-grid-details">
          <span class="patch-name" style="color: {activeKit.color}">{activeKit.name.toUpperCase()}</span>
          <span class="cutoff-freq">FREQ: {Math.round(knobCutoff)}Hz</span>
          <span class="pitch-pct">PITCH: {knobPitch.toFixed(2)}x</span>
        </div>

        <!-- Oscilloscope CRT Canvas -->
        <canvas bind:this={canvasRef} width="400" height="110" class="CRT-canvas"></canvas>

        <div class="screen-footer-hud">
          <span class="hud-item"><Activity size={10} /> OP-1 ENGINE ACTIVE</span>
          <span class="hud-item"><Zap size={10} /> RATE: {knobSpeed.toFixed(2)}x</span>
        </div>
      </div>

      <!-- Kit Selector Presets Selector Row (looks like OP-1 preset buttons) -->
      <div class="kit-selector-row flex justify-between items-center bg-black/40 border border-white/5 rounded-xl px-3 py-2">
        <span class="kit-selector-label text-[10px] font-bold text-white/30 tracking-wider">PRESET KITS:</span>
        <div class="flex gap-2">
          {#each KITS as kit, i}
            <button
              class="kit-btn"
              class:active={activeKitIndex === i}
              style="--kit-color: {kit.color}; --kit-glow: {kit.glow}"
              onclick={() => selectKit(i)}
              title={kit.name}
            >
              {i + 1}
            </button>
          {/each}
        </div>
      </div>

      <!-- Encoders knobs row (Colored circles) -->
      <div class="encoders-deck">
        <!-- Knob 1: Pitch (Cyan) -->
        <div 
          class="encoder-slot"
          onmousedown={(e) => startKnobDrag("pitch", e)}
          ontouchstart={(e) => handleTouchStart("pitch", e)}
          ondblclick={() => resetKnob("pitch")}
        >
          <div class="knob-cap color-cyan" style="transform: rotate({(knobPitch - 1.25) * 180}deg)">
            <div class="notch"></div>
          </div>
          <span class="knob-title">PITCH</span>
          <span class="knob-value">{knobPitch.toFixed(2)}x</span>
        </div>

        <!-- Knob 2: Playback Speed (Green) -->
        <div 
          class="encoder-slot"
          onmousedown={(e) => startKnobDrag("speed", e)}
          ontouchstart={(e) => handleTouchStart("speed", e)}
          ondblclick={() => resetKnob("speed")}
        >
          <div class="knob-cap color-green" style="transform: rotate({(knobSpeed - 1.25) * 180}deg)">
            <div class="notch"></div>
          </div>
          <span class="knob-title">SPEED</span>
          <span class="knob-value">{knobSpeed.toFixed(2)}x</span>
        </div>

        <!-- Knob 3: Master Volume (Orange) -->
        <div 
          class="encoder-slot"
          onmousedown={(e) => startKnobDrag("volume", e)}
          ontouchstart={(e) => handleTouchStart("volume", e)}
          ondblclick={() => resetKnob("volume")}
        >
          <div class="knob-cap color-orange" style="transform: rotate({(knobVolume - 0.5) * 270}deg)">
            <div class="notch"></div>
          </div>
          <span class="knob-title">VOL</span>
          <span class="knob-value">{Math.round(knobVolume * 100)}%</span>
        </div>

        <!-- Knob 4: Lowpass Cutoff (Pink) -->
        <div 
          class="encoder-slot"
          onmousedown={(e) => startKnobDrag("cutoff", e)}
          ontouchstart={(e) => handleTouchStart("cutoff", e)}
          ondblclick={() => resetKnob("cutoff")}
        >
          <div class="knob-cap color-pink" style="transform: rotate({((knobCutoff - 200) / 9800 - 0.5) * 270}deg)">
            <div class="notch"></div>
          </div>
          <span class="knob-title">FILTER</span>
          <span class="knob-value">{Math.round(knobCutoff)}Hz</span>
        </div>
      </div>
    </div>

    <!-- Right Column: Launchpad + Footer -->
    <div class="chassis-right col-span-12 sm:col-span-7 flex flex-col justify-between gap-3">
      <!-- Novation Launchpad Pad Matrix grid (4x4) -->
      <div class="launchpad-grid-wrapper">
        <div class="launchpad-tag">LAUNCHPAD SAMPLES GRID ({activeKit.name.toUpperCase()})</div>
        
        <div class="launchpad-grid">
          {#each Array(16) as _, i}
            {@const sound = activeKit.id === "custom" ? samplerStore.customClips[i] : activeKit.sounds[i]}
            
            {#if sound}
              <div 
                class="pad-card {sound.color || ''} {activeKit.id === 'custom' ? 'custom-pad' : 'procedural-pad'}"
                class:active={activePadIndex === i}
                style="{activeKit.id === 'custom' ? `--pad-glow: ${sound.color}; border-color: ${sound.color}44` : ''}"
                onclick={() => triggerPad(i)}
              >
                <span class="pad-key">{sound.key.toUpperCase()}</span>
                {#if activeKit.id === "custom"}
                  <button class="delete-clip-btn" onclick={(e) => deleteClip(sound.id, e)} title="Delete Clip">✕</button>
                  <span class="pad-show-tag">{sound.show.replace(" S1", "")}</span>
                {:else}
                  <span class="pad-emoji">{sound.emoji}</span>
                {/if}
                <span class="pad-label">{sound.label || sound.title}</span>
              </div>
            {:else}
              <div class="pad-card empty-pad">
                <span class="empty-dot"></span>
              </div>
            {/if}
          {/each}
        </div>
      </div>

      <!-- Sampler details footer -->
      <footer class="op1-footer">
        <div class="kb-badge"><Keyboard size={12} /> REMIX MAPPED TRIGGERS ENABLED</div>
        {#if activeKit.id === "custom"}
          <div class="clip-counter">TOTAL CUSTOM PADS: {samplerStore.customClips.length}/16</div>
        {:else}
          <div class="clip-counter">PRESET SOUNDS: 16/16</div>
        {/if}
      </footer>
    </div>
  </div>
</div>

<style>
  .soundboard-layout {
    padding: 20px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #09090d;
  }

  /* ── OP-1 Hardware Chassis ── */
  .op1-chassis {
    width: 100%;
    max-width: 620px;
    background: #18181f;
    border: 2px solid rgba(255, 255, 255, 0.08);
    border-radius: 24px;
    box-shadow: 
      0 30px 70px rgba(0, 0, 0, 0.8),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  /* ── LCD Screen ── */
  .op1-screen-unit {
    background: #0a0a0f;
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 10px 14px;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.8);
  }

  .screen-grid-details {
    display: flex;
    justify-content: space-between;
    font-family: monospace;
    font-size: 0.65rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.45);
    z-index: 2;
  }

  .patch-name {
    color: #ff55bb;
  }

  .CRT-canvas {
    align-self: center;
    background: transparent;
    z-index: 1;
    margin: 4px 0;
  }

  .screen-footer-hud {
    display: flex;
    justify-content: space-between;
    font-family: monospace;
    font-size: 0.6rem;
    color: rgba(255, 255, 255, 0.3);
    z-index: 2;
  }

  .hud-item {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  /* ── Encoders Deck ── */
  .encoders-deck {
    display: flex;
    justify-content: space-around;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.04);
    border-radius: 12px;
    padding: 10px 0;
  }

  .encoder-slot {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    cursor: ns-resize; /* drag indicator */
    min-width: 80px;
    user-select: none;
    touch-action: none;
  }

  .knob-cap {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    position: relative;
    box-shadow: 
      0 4px 8px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .knob-cap .notch {
    position: absolute;
    width: 3px;
    height: 12px;
    border-radius: 2px;
    background: white;
    top: 3px;
  }

  /* OP-1 Knobs Colors */
  .color-cyan { background: #00bfff; }
  .color-green { background: #00ff66; }
  .color-orange { background: #ffcc00; }
  .color-pink { background: #ff55bb; }

  .knob-title {
    font-size: 0.58rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.35);
    letter-spacing: 0.05em;
  }

  .knob-value {
    font-size: 0.65rem;
    font-family: monospace;
    color: white;
    font-weight: 700;
  }

  /* ── Launchpad ── */
  .launchpad-grid-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .launchpad-tag {
    font-size: 0.58rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.3);
    letter-spacing: 0.08em;
  }

  .launchpad-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }

  .pad-card {
    height: 60px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 8px;
    position: relative;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
    overflow: hidden;
  }

  .pad-key {
    position: absolute;
    top: 4px;
    left: 6px;
    font-size: 0.52rem;
    font-family: monospace;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.25);
  }

  .pad-emoji {
    font-size: 1.1rem;
    margin-bottom: 2px;
  }

  .pad-label {
    font-size: 0.62rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.55);
    text-align: center;
    max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Kit Preset Buttons */
  .kit-btn {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #252530;
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.4);
    font-family: monospace;
    font-size: 0.65rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: inset 0 1px 2px rgba(255,255,255,0.05), 0 2px 4px rgba(0,0,0,0.3);
  }

  .kit-btn:hover {
    color: white;
    border-color: rgba(255, 255, 255, 0.3);
    background: #303040;
  }

  .kit-btn.active {
    background: var(--kit-color);
    color: black;
    border-color: var(--kit-color);
    box-shadow: 0 0 12px var(--kit-glow);
  }

  /* Neon pad colors */
  .pad-blue:hover { border-color: #0077ff; background: rgba(0, 119, 255, 0.04); }
  .pad-blue.active { background: #0077ff; color: black; box-shadow: 0 0 15px #0077ff; }

  .pad-cyan:hover { border-color: #00bfff; background: rgba(0, 191, 255, 0.04); }
  .pad-cyan.active { background: #00bfff; color: black; box-shadow: 0 0 15px #00bfff; }

  .pad-orange:hover { border-color: #ffcc00; background: rgba(255, 204, 0, 0.04); }
  .pad-orange.active { background: #ffcc00; color: black; box-shadow: 0 0 15px #ffcc00; }

  /* Custom pad */
  .custom-pad {
    padding: 10px 4px 4px 4px;
    justify-content: space-between;
  }

  .custom-pad:hover {
    background: rgba(255, 255, 255, 0.04);
    box-shadow: 0 0 10px var(--pad-glow);
  }

  .custom-pad.active {
    background: var(--pad-glow);
    color: black;
    border-color: var(--pad-glow);
    box-shadow: 0 0 20px var(--pad-glow);
  }

  .custom-pad.active .pad-label, .custom-pad.active .pad-show-tag, .custom-pad.active .pad-key {
    color: black;
  }

  .pad-show-tag {
    font-size: 0.52rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.3);
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .delete-clip-btn {
    position: absolute;
    top: 4px;
    right: 6px;
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.25);
    font-size: 0.6rem;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .custom-pad:hover .delete-clip-btn {
    opacity: 1;
  }

  .delete-clip-btn:hover {
    color: #ff3344 !important;
  }

  /* Empty pad slot */
  .empty-pad {
    cursor: default;
    background: transparent;
    border: 1px dashed rgba(255, 255, 255, 0.03);
  }

  .empty-dot {
    width: 4px;
    height: 4px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 50%;
  }

  /* ── Hardware Footer ── */
  .op1-footer {
    display: flex;
    justify-content: space-between;
    font-size: 0.65rem;
    color: rgba(255, 255, 255, 0.3);
    font-weight: 500;
    border-top: 1px solid rgba(255, 255, 255, 0.04);
    padding-top: 12px;
  }

  .kb-badge {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  /* Love Island pad color styling */
  .pad-pink:hover { border-color: #ff55bb; background: rgba(255, 85, 187, 0.04); }
  .pad-pink.active { background: #ff55bb; color: black; box-shadow: 0 0 15px #ff55bb; }

  /* ── Mobile Portrait Responsiveness ── */
  @media (max-width: 480px) {
    .soundboard-layout {
      padding: 10px;
    }
    .op1-chassis {
      padding: 12px;
      gap: 12px;
      border-radius: 16px;
    }
    .op1-screen-unit {
      padding: 8px 10px;
    }
    .encoders-deck {
      padding: 8px 0;
    }
    .encoder-slot {
      min-width: 65px;
      gap: 4px;
    }
    .knob-cap {
      width: 32px;
      height: 32px;
    }
    .knob-cap .notch {
      height: 10px;
    }
    .knob-value {
      font-size: 0.6rem;
    }
    .launchpad-grid {
      gap: 8px;
    }
    .pad-card {
      height: 52px;
    }
    .pad-emoji {
      font-size: 1rem;
    }
    .pad-label {
      font-size: 0.58rem;
      max-width: 72px;
    }
  }

  /* ── Mobile Landscape Responsiveness (Side-by-side) ── */
  @media (max-height: 580px) and (orientation: landscape) {
    .soundboard-layout {
      padding: 8px;
    }
    .op1-chassis {
      max-width: 820px;
      display: grid;
      grid-template-columns: 1fr 1.2fr;
      gap: 10px;
      padding: 10px;
      border-radius: 16px;
    }
    .op1-screen-unit {
      padding: 6px 10px;
    }
    .CRT-canvas {
      height: 75px;
    }
    .encoders-deck {
      padding: 6px 0;
    }
    .encoder-slot {
      min-width: 60px;
      gap: 3px;
    }
    .knob-cap {
      width: 28px;
      height: 28px;
    }
    .knob-cap .notch {
      height: 9px;
      top: 2px;
    }
    .knob-value {
      font-size: 0.58rem;
    }
    .launchpad-grid {
      gap: 6px;
    }
    .pad-card {
      height: 48px;
    }
    .pad-emoji {
      font-size: 0.9rem;
    }
    .pad-label {
      font-size: 0.55rem;
      max-width: 70px;
    }
    .op1-footer {
      padding-top: 6px;
    }
  }
</style>
