<script>
  import { onMount, onDestroy, untrack } from "svelte";
  import {
    Volume2,
    Activity,
    Play,
    Trash2,
    Keyboard,
    Sliders,
    Zap,
  } from "lucide-svelte";
  import { samplerStore } from "../../lib/samplerStore.svelte.js";

  // Sampler state
  let audioCtx = null;
  let analyserNode = null;
  let activePads = $state(Array(16).fill(0));
  let activeVoices = $state([]);
  let isError = $state(false);
  let failedPads = $state(new Set());

  // Preload Buffer Caching
  const bufferCache = new Map();
  let preloadedCount = $state(0);
  const MAX_VOICES = 12;

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
      id: "canine_sfx",
      name: "Canine & SFX",
      color: "#00bfff",
      glow: "rgba(0, 191, 255, 0.4)",
      sounds: [
        {
          id: "woof",
          type: "procedural",
          proceduralType: "woof",
          label: "Deep Woof",
          emoji: "🐕",
          key: "q",
          color: "pad-blue",
        },
        {
          id: "yip",
          type: "procedural",
          proceduralType: "yip",
          label: "Puppy Yip",
          emoji: "🐶",
          key: "w",
          color: "pad-cyan",
        },
        {
          id: "growl",
          type: "procedural",
          proceduralType: "growl",
          label: "Playful Growl",
          emoji: "🐺",
          key: "e",
          color: "pad-orange",
        },
        {
          id: "li-break",
          type: "file",
          url: "https://data.wearedogs.net/music/soundboard/loveisland-break.mp3",
          label: "LI Break",
          emoji: "🏝️",
          key: "r",
          color: "pad-pink",
        },
        {
          id: "li-text",
          type: "file",
          url: "https://data.wearedogs.net/music/soundboard/loveisland-text.mp3",
          label: "LI Text",
          emoji: "💬",
          key: "t",
          color: "pad-pink",
        },
        {
          id: "mc-large",
          type: "file",
          url: "https://data.wearedogs.net/music/soundboard/minecraft-large.mp3",
          label: "MC Large",
          emoji: "🧱",
          key: "y",
          color: "pad-blue",
        },
        {
          id: "mc-medium",
          type: "file",
          url: "https://data.wearedogs.net/music/soundboard/minecraft-medium.mp3",
          label: "MC Medium",
          emoji: "🪵",
          key: "u",
          color: "pad-orange",
        },
        {
          id: "mc-small",
          type: "file",
          url: "https://data.wearedogs.net/music/soundboard/minecraft-small.mp3",
          label: "MC Small",
          emoji: "🪨",
          key: "i",
          color: "pad-cyan",
        },
        {
          id: "mc-tiny",
          type: "file",
          url: "https://data.wearedogs.net/music/soundboard/minecraft-tiny.mp3",
          label: "MC Tiny",
          emoji: "💎",
          key: "o",
          color: "pad-pink",
        },
        {
          id: "tip-med",
          type: "file",
          url: "https://data.wearedogs.net/music/soundboard/tip-medium.mp3",
          label: "Tip Medium",
          emoji: "🪙",
          key: "p",
          color: "pad-orange",
        },
        {
          id: "tip-small",
          type: "file",
          url: "https://data.wearedogs.net/music/soundboard/tip-small.mp3",
          label: "Tip Small",
          emoji: "💰",
          key: "a",
          color: "pad-orange",
        },
        {
          id: "tip-tiny",
          type: "file",
          url: "https://data.wearedogs.net/music/soundboard/tip-tiny.mp3",
          label: "Tip Tiny",
          emoji: "💎",
          key: "s",
          color: "pad-cyan",
        },
      ],
    },
    {
      id: "kit2",
      name: "Kit 2 (Empty)",
      color: "#00ff66",
      glow: "rgba(0, 255, 102, 0.4)",
      sounds: [],
    },
    {
      id: "kit3",
      name: "Kit 3 (Empty)",
      color: "#ff55bb",
      glow: "rgba(255, 85, 187, 0.4)",
      sounds: [],
    },
    {
      id: "kit4",
      name: "Kit 4 (Empty)",
      color: "#ffcc00",
      glow: "rgba(255, 204, 0, 0.4)",
      sounds: [],
    },
    {
      id: "custom",
      name: "User Sampler",
      color: "#ffcc00",
      glow: "rgba(255, 204, 0, 0.4)",
      sounds: [],
    },
  ];

  let activeKitIndex = $state(0);
  let activeKit = $derived(KITS[activeKitIndex]);

  function selectKit(idx) {
    activeKitIndex = idx;
  }

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      analyserNode = audioCtx.createAnalyser();
      analyserNode.fftSize = 512;
      analyserNode.connect(audioCtx.destination);
    }
  }

  // Preloader & buffer allocator voice pooling functions
  async function preloadAudioFile(url) {
    if (bufferCache.has(url)) return bufferCache.get(url);
    initAudio();
    if (!audioCtx) return null;
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
      bufferCache.set(url, audioBuffer);
      preloadedCount = bufferCache.size;
      return audioBuffer;
    } catch (err) {
      console.warn("Preload failed for:", url, err);
      return null;
    }
  }

  // Svelte 5 reactive kit preload trigger
  $effect(() => {
    const sounds = activeKit.sounds;
    if (sounds && sounds.length > 0) {
      sounds.forEach((sound) => {
        if (sound.type === "file" && sound.url) {
          preloadAudioFile(sound.url);
        }
      });
    }
  });

  function allocateVoice(sourceNode, gainNode) {
    if (activeVoices.length >= MAX_VOICES) {
      const oldest = activeVoices.shift();
      try {
        if (oldest.audioEl) {
          oldest.audioEl.pause();
          oldest.audioEl.remove();
        } else {
          oldest.sourceNode.stop();
          oldest.sourceNode.disconnect();
        }
      } catch (e) {}
    }
    const voice = { sourceNode, gainNode, startTime: audioCtx.currentTime };
    activeVoices.push(voice);

    sourceNode.onended = () => {
      activeVoices = activeVoices.filter((v) => v !== voice);
    };
  }

  function allocateMediaVoice(audioEl, gainNode) {
    if (activeVoices.length >= MAX_VOICES) {
      const oldest = activeVoices.shift();
      try {
        if (oldest.audioEl) {
          oldest.audioEl.pause();
          oldest.audioEl.remove();
        } else {
          oldest.sourceNode.stop();
          oldest.sourceNode.disconnect();
        }
      } catch (e) {}
    }
    activeVoices.push({ audioEl, gainNode, startTime: audioCtx.currentTime });
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
    gain.connect(analyserNode);

    // Apply OP-1 Knobs
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(knobCutoff, now);
    gain.gain.setValueAtTime(knobVolume * 0.7, now);

    const basePitch = knobPitch * (options.pitch || 1.0);
    const speed = knobSpeed * (options.speed || 1.0);

    if (type === "woof") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(140 * basePitch, now);
      osc.frequency.exponentialRampToValueAtTime(
        60 * basePitch,
        now + 0.18 / speed,
      );

      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22 / speed);
      osc.start(now);
      osc.stop(now + 0.22 / speed);
    } else if (type === "yip") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(550 * basePitch, now);
      osc.frequency.exponentialRampToValueAtTime(
        320 * basePitch,
        now + 0.1 / speed,
      );

      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12 / speed);
      osc.start(now);
      osc.stop(now + 0.12 / speed);
    } else if (type === "growl") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(180 * basePitch, now);
      osc.frequency.linearRampToValueAtTime(
        250 * basePitch,
        now + 0.15 / speed,
      );
      osc.frequency.exponentialRampToValueAtTime(
        90 * basePitch,
        now + 0.45 / speed,
      );

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
      osc.frequency.exponentialRampToValueAtTime(
        100 * basePitch,
        now + duration,
      );

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
      osc.frequency.exponentialRampToValueAtTime(
        600 * basePitch,
        now + duration,
      );

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
      osc.frequency.exponentialRampToValueAtTime(
        2000 * basePitch,
        now + duration,
      );
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
      osc.start(now);
      osc.stop(now + duration);
    }

    allocateVoice(osc, gain);
  }

  // Play Video audio slice
  function playCustomClip(clip, padIdx = null) {
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

    const triggerErrorAnimation = () => {
      isError = true;
      if (padIdx !== null) {
        failedPads.add(padIdx);
        failedPads = new Set(failedPads);
        setTimeout(() => {
          failedPads.delete(padIdx);
          failedPads = new Set(failedPads);
        }, 1500);
      }
      setTimeout(() => {
        isError = false;
      }, 1500);
    };

    audio.onerror = () => {
      triggerErrorAnimation();
    };

    // Set filter utilizing Web Audio (if possible/supported, otherwise direct player playback)
    initAudio();
    if (audioCtx) {
      try {
        const source = audioCtx.createMediaElementSource(audio);
        const filter = audioCtx.createBiquadFilter();
        const gain = audioCtx.createGain();

        source.connect(filter);
        filter.connect(gain);
        gain.connect(analyserNode);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(knobCutoff, audioCtx.currentTime);
        gain.gain.setValueAtTime(knobVolume, audioCtx.currentTime);

        allocateMediaVoice(audio, gain);
      } catch (err) {
        // Fallback to direct element routing if already wired
        audio.volume = knobVolume;
      }
    }

    audio.play().catch((err) => {
      triggerErrorAnimation();
    });

    // Stop exactly at clip endpoint (taking rate into account)
    const clipDurationSec = (clip.end - clip.start) / (knobSpeed * knobPitch);

    setTimeout(() => {
      try {
        audio.pause();
        audio.remove();
      } catch (e) {}
      activeVoices = activeVoices.filter((v) => v.audioEl !== audio);
    }, clipDurationSec * 1000);
  }

  // Play direct audio file (leverages preloaded memory buffers for instant triggers)
  async function playAudioFile(url, options = {}, padIdx = null) {
    waveAmplitude = 1.0;
    initAudio();
    if (!audioCtx) return;

    const triggerErrorAnimation = () => {
      isError = true;
      if (padIdx !== null) {
        failedPads.add(padIdx);
        failedPads = new Set(failedPads);
        setTimeout(() => {
          failedPads.delete(padIdx);
          failedPads = new Set(failedPads);
        }, 1500);
      }
      setTimeout(() => {
        isError = false;
      }, 1500);
    };

    let buffer = bufferCache.get(url);
    if (!buffer) {
      buffer = await preloadAudioFile(url);
      if (!buffer) {
        // Fallback: try direct HTML5 Audio play
        try {
          const fallbackAudio = new Audio(url);
          fallbackAudio.crossOrigin = "anonymous";
          fallbackAudio.volume = knobVolume;
          fallbackAudio.playbackRate =
            knobSpeed *
            knobPitch *
            (options.speed || 1.0) *
            (options.pitch || 1.0);
          if (typeof fallbackAudio.preservesPitch !== "undefined") {
            fallbackAudio.preservesPitch = false;
          }
          const gainNode = audioCtx.createGain();
          const source = audioCtx.createMediaElementSource(fallbackAudio);
          source.connect(gainNode);
          gainNode.connect(analyserNode);
          fallbackAudio.play().catch(triggerErrorAnimation);
          allocateMediaVoice(fallbackAudio, gainNode);
          fallbackAudio.onended = () => {
            fallbackAudio.remove();
            activeVoices = activeVoices.filter(
              (v) => v.audioEl !== fallbackAudio,
            );
          };
        } catch (e) {
          triggerErrorAnimation();
        }
        return;
      }
    }

    try {
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;

      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      source.connect(filter);
      filter.connect(gain);
      gain.connect(analyserNode);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(knobCutoff, audioCtx.currentTime);
      gain.gain.setValueAtTime(knobVolume, audioCtx.currentTime);

      const pitchMultiplier = options.pitch || 1.0;
      const speedMultiplier = options.speed || 1.0;
      source.playbackRate.setValueAtTime(
        knobSpeed * knobPitch * speedMultiplier * pitchMultiplier,
        audioCtx.currentTime,
      );

      const now = audioCtx.currentTime;
      source.start(now);

      allocateVoice(source, gain);
    } catch (err) {
      console.error("Audio buffer play error:", err);
      triggerErrorAnimation();
    }
  }

  // Unified Launchpad triggers
  function triggerPad(idx) {
    activePads[idx] += 1;
    setTimeout(() => {
      activePads[idx] = Math.max(0, activePads[idx] - 1);
    }, 250);

    const sounds =
      activeKit.id === "custom" ? samplerStore.customClips : activeKit.sounds;
    const sound = sounds[idx];
    if (!sound) return;

    if (activeKit.id === "custom") {
      playCustomClip(sound, idx);
    } else if (sound.type === "procedural") {
      playProcedural(sound.proceduralType, sound.options || {});
    } else if (sound.type === "file") {
      playAudioFile(sound.url, sound.options || {}, idx);
    }
  }

  // Remove custom clips
  function deleteClip(id, e) {
    e.stopPropagation();
    samplerStore.removeClip(id);
  }

  function handlePadTouchStart(idx, e) {
    if (e.target.closest('.delete-clip-btn')) {
      return;
    }
    if (e.cancelable) e.preventDefault();
    triggerPad(idx);
  }

  function handlePadClick(idx, e) {
    if (e.target.closest('.delete-clip-btn')) {
      return;
    }
    triggerPad(idx);
  }

  // CRT Oscilloscope real Analyser time-domain waveform drawing loop
  function startVisualizer() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    if (!canvasRef) return;
    canvasCtx = canvasRef.getContext("2d");

    const dataArray = new Uint8Array(256);

    function draw() {
      if (!canvasRef) return;

      const width = canvasRef.width;
      const height = canvasRef.height;

      canvasCtx.fillStyle = "rgba(10, 10, 15, 0.25)"; // trailing phosphor decay
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

      if (analyserNode) {
        analyserNode.getByteTimeDomainData(dataArray);
      } else {
        // Flatline noise fallback
        for (let i = 0; i < 256; i++) {
          dataArray[i] = 128;
        }
      }

      const sliceWidth = width / 256;
      let x = 0;

      for (let i = 0; i < 256; i++) {
        const v = dataArray[i] / 128.0; // range 0.0 to 2.0
        // Add subtle flatline wiggle if no active sounds are playing
        const wiggle =
          (Math.sin(i * 0.05 + Date.now() * 0.015) * 1.5 +
            (Math.random() - 0.5) * 0.5) *
          (waveAmplitude > 0.02 ? 1.0 : 0.1);
        const y = (v * height) / 2 + wiggle;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }
        x += sliceWidth;
      }
      canvasCtx.stroke();
      canvasCtx.shadowBlur = 0; // reset

      // Slowly decay amplitude back to rest state
      if (waveAmplitude > 0.02) {
        waveAmplitude *= 0.94;
      } else {
        waveAmplitude = 0.02;
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
    const currentSounds =
      activeKit.id === "custom" ? samplerStore.customClips : activeKit.sounds;
    const matchIdx = currentSounds.findIndex((s) => s.key === key);
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

  // Keyboard controls for encoder knobs
  function handleKnobKeydown(knob, e) {
    if (e.key === "ArrowUp" || e.key === "ArrowRight") {
      if (knob === "pitch") knobPitch = Math.min(2.0, knobPitch + 0.05);
      else if (knob === "speed") knobSpeed = Math.min(2.0, knobSpeed + 0.05);
      else if (knob === "volume") knobVolume = Math.min(1.0, knobVolume + 0.05);
      else if (knob === "cutoff")
        knobCutoff = Math.min(10000, knobCutoff + 200);
      e.preventDefault();
    } else if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
      if (knob === "pitch") knobPitch = Math.max(0.5, knobPitch - 0.05);
      else if (knob === "speed") knobSpeed = Math.max(0.5, knobSpeed - 0.05);
      else if (knob === "volume") knobVolume = Math.max(0.0, knobVolume - 0.05);
      else if (knob === "cutoff") knobCutoff = Math.max(200, knobCutoff - 200);
      e.preventDefault();
    }
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

  // Container dimensions for auto-scaling
  let containerWidth = $state(0);
  let containerHeight = $state(0);

  // Derived state to determine if we should stack elements (portrait) or use side-by-side (landscape)
  let isPortrait = $derived(containerWidth < 640);
  let isMobileLandscape = $derived(!isPortrait && containerHeight < 450);

  // Target base size of the OP-1 chassis
  let baseWidth = $derived(isPortrait ? 360 : 800);
  let baseHeight = $derived(isPortrait ? 740 : isMobileLandscape ? 310 : 395);

  // Scaling factor to fit completely in both width and height inside the panel container
  let scale = $derived.by(() => {
    if (!containerWidth || !containerHeight) return 1;
    if (isMobileLandscape) {
      // Full bleed width (no safety margins on sides)
      const scaleX = containerWidth / baseWidth;
      const scaleY = containerHeight / baseHeight;
      return Math.min(scaleX, scaleY, 1.25);
    }
    // Allow small 8px safety padding around the chassis
    const scaleX = (containerWidth - 16) / baseWidth;
    const scaleY = (containerHeight - 16) / baseHeight;
    return Math.min(scaleX, scaleY, 1.25); // cap maximum upscale at 1.25x
  });

  $effect(() => {
    if (canvasRef) {
      untrack(() => {
        startVisualizer();
      });
    }
  });

  onDestroy(() => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    activeVoices.forEach((v) => {
      try {
        if (v.audioEl) {
          v.audioEl.pause();
          v.audioEl.remove();
        } else if (v.sourceNode) {
          v.sourceNode.stop();
          v.sourceNode.disconnect();
        }
      } catch (e) {}
    });
    activeVoices = [];
  });
</script>

<svelte:window onkeydown={handleKeydown} />

<div
  class="soundboard-layout animated-pane w-full h-full"
  class:mobile-landscape-layout={isMobileLandscape}
  bind:clientWidth={containerWidth}
  bind:clientHeight={containerHeight}
>
  <div
    class="chassis-wrapper"
    style="width: {baseWidth * scale}px; height: {baseHeight *
      scale}px; margin: auto; display: flex; align-items: center; justify-content: center; overflow: visible; flex-shrink: 0;"
  >
    <div
      class="chassis-scaler"
      style="width: {baseWidth}px; height: {baseHeight}px; transform: scale({scale}); transform-origin: center center; flex-shrink: 0; display: flex;"
    >
      <div
        class="op1-chassis w-full h-full"
        class:grid-layout={!isPortrait}
        class:chassis-error={isError}
      >
        <!-- Left Column: Screen + Knobs -->
        <div class="chassis-left flex flex-col justify-between gap-3">
          <!-- LCD Display screen (Waveform + Info indicators) -->
          {#if !isMobileLandscape}
            <div class="op1-screen-unit">
              {#if isError}
                <div class="screen-error-overlay">
                  <span class="error-msg">ERR: FETCH FAILED</span>
                  <span class="error-sub">CHECK CLOUD DATA</span>
                </div>
              {/if}

              <div class="screen-grid-details">
                <span class="patch-name" style="color: {activeKit.color}"
                  >{activeKit.name.toUpperCase()}</span
                >
                <span class="cutoff-freq">FREQ: {Math.round(knobCutoff)}Hz</span
                >
                <span class="pitch-pct">PITCH: {knobPitch.toFixed(2)}x</span>
              </div>

              <!-- Oscilloscope CRT Canvas -->
              <canvas
                bind:this={canvasRef}
                width="400"
                height="110"
                class="CRT-canvas"
              ></canvas>

              <div class="screen-footer-hud">
                <span class="hud-item"
                  ><Activity size={10} /> OP-1 ENGINE ACTIVE</span
                >
                <span class="hud-item"
                  ><Zap size={10} /> RATE: {knobSpeed.toFixed(2)}x</span
                >
              </div>
            </div>
          {/if}

          <!-- Kit Selector Presets Selector Row (looks like OP-1 preset buttons) -->
          <div
            class="kit-selector-row flex justify-between items-center bg-black/40 border border-white/5 rounded-xl px-3 py-2"
          >
            <span
              class="kit-selector-label text-[10px] font-bold text-white/30 tracking-wider"
              >PRESET KITS:</span
            >
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
              role="slider"
              aria-label="Pitch"
              aria-valuemin="0.5"
              aria-valuemax="2.0"
              aria-valuenow={knobPitch}
              tabindex="0"
              onmousedown={(e) => startKnobDrag("pitch", e)}
              ontouchstart={(e) => handleTouchStart("pitch", e)}
              ondblclick={() => resetKnob("pitch")}
              onkeydown={(e) => handleKnobKeydown("pitch", e)}
            >
              <div
                class="knob-cap color-cyan"
                style="transform: rotate({(knobPitch - 1.25) * 180}deg)"
              >
                <div class="notch"></div>
              </div>
              <span class="knob-title">PITCH</span>
              <span class="knob-value">{knobPitch.toFixed(2)}x</span>
            </div>

            <!-- Knob 2: Playback Speed (Green) -->
            <div
              class="encoder-slot"
              role="slider"
              aria-label="Playback Speed"
              aria-valuemin="0.5"
              aria-valuemax="2.0"
              aria-valuenow={knobSpeed}
              tabindex="0"
              onmousedown={(e) => startKnobDrag("speed", e)}
              ontouchstart={(e) => handleTouchStart("speed", e)}
              ondblclick={() => resetKnob("speed")}
              onkeydown={(e) => handleKnobKeydown("speed", e)}
            >
              <div
                class="knob-cap color-green"
                style="transform: rotate({(knobSpeed - 1.25) * 180}deg)"
              >
                <div class="notch"></div>
              </div>
              <span class="knob-title">SPEED</span>
              <span class="knob-value">{knobSpeed.toFixed(2)}x</span>
            </div>

            <!-- Knob 3: Master Volume (Orange) -->
            <div
              class="encoder-slot"
              role="slider"
              aria-label="Master Volume"
              aria-valuemin="0.0"
              aria-valuemax="1.0"
              aria-valuenow={knobVolume}
              tabindex="0"
              onmousedown={(e) => startKnobDrag("volume", e)}
              ontouchstart={(e) => handleTouchStart("volume", e)}
              ondblclick={() => resetKnob("volume")}
              onkeydown={(e) => handleKnobKeydown("volume", e)}
            >
              <div
                class="knob-cap color-orange"
                style="transform: rotate({(knobVolume - 0.5) * 270}deg)"
              >
                <div class="notch"></div>
              </div>
              <span class="knob-title">VOL</span>
              <span class="knob-value">{Math.round(knobVolume * 100)}%</span>
            </div>

            <!-- Knob 4: Lowpass Cutoff (Pink) -->
            <div
              class="encoder-slot"
              role="slider"
              aria-label="Lowpass Filter Cutoff"
              aria-valuemin="200"
              aria-valuemax="10000"
              aria-valuenow={knobCutoff}
              tabindex="0"
              onmousedown={(e) => startKnobDrag("cutoff", e)}
              ontouchstart={(e) => handleTouchStart("cutoff", e)}
              ondblclick={() => resetKnob("cutoff")}
              onkeydown={(e) => handleKnobKeydown("cutoff", e)}
            >
              <div
                class="knob-cap color-pink"
                style="transform: rotate({((knobCutoff - 200) / 9800 - 0.5) *
                  270}deg)"
              >
                <div class="notch"></div>
              </div>
              <span class="knob-title">FILTER</span>
              <span class="knob-value">{Math.round(knobCutoff)}Hz</span>
            </div>
          </div>
        </div>

        <!-- Right Column: Launchpad + Footer -->
        <div class="chassis-right flex flex-col justify-between gap-3">
          <!-- Novation Launchpad Pad Matrix grid (4x4) -->
          <div class="launchpad-grid-wrapper">
            <div class="launchpad-tag">
              LAUNCHPAD SAMPLES GRID ({activeKit.name.toUpperCase()})
            </div>

            <div class="launchpad-grid">
              {#each Array(16) as _, i}
                {@const sound =
                  activeKit.id === "custom"
                    ? samplerStore.customClips[i]
                    : activeKit.sounds[i]}

                {#if sound}
                  <button
                    type="button"
                    class="pad-card {sound.color || ''} {activeKit.id ===
                    'custom'
                      ? 'custom-pad'
                      : 'procedural-pad'}"
                    class:active={activePads[i] > 0}
                    class:pad-error={failedPads.has(i)}
                    style={activeKit.id === "custom"
                      ? `--pad-glow: ${sound.color}; border-color: ${sound.color}44`
                      : ""}
                    onclick={(e) => handlePadClick(i, e)}
                    ontouchstart={(e) => handlePadTouchStart(i, e)}
                  >
                    <span class="pad-key">{sound.key.toUpperCase()}</span>
                    {#if failedPads.has(i)}
                      <span class="pad-emoji">⚠️</span>
                      <span class="pad-label">ERROR</span>
                    {:else}
                      {#if activeKit.id === "custom"}
                        <span
                          role="button"
                          tabindex="0"
                          class="delete-clip-btn"
                          onclick={(e) => deleteClip(sound.id, e)}
                          onkeydown={(e) => {
                            if (e.key === "Enter" || e.key === " ")
                              deleteClip(sound.id, e);
                          }}
                          title="Delete Clip"
                        >
                          ✕
                        </span>
                        <span class="pad-show-tag"
                          >{sound.show.replace(" S1", "")}</span
                        >
                      {:else}
                        <span class="pad-emoji">{sound.emoji}</span>
                      {/if}
                      <span class="pad-label">{sound.label || sound.title}</span
                      >
                    {/if}
                  </button>
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
            <div class="kb-badge"><Keyboard size={12} /> TRIGGERS ENABLED</div>
            {#if activeKit.id === "custom"}
              <div class="clip-counter">
                TOTAL CUSTOM PADS: {samplerStore.customClips.length}/16
              </div>
            {:else}
              <div class="clip-counter">
                PRESET SOUNDS: {activeKit.sounds.length}/16
              </div>
            {/if}
          </footer>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .soundboard-layout {
    padding: 8px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #09090d;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .soundboard-layout.mobile-landscape-layout {
    padding: 0;
  }

  .chassis-scaler {
    /* Scale container properties */
  }

  /* ── OP-1 Hardware Chassis ── */
  .op1-chassis {
    width: 100%;
    height: 100%;
    background: #18181f;
    border: 2px solid rgba(255, 255, 255, 0.08);
    border-radius: 24px;
    box-shadow:
      0 30px 70px rgba(0, 0, 0, 0.8),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    transition:
      border-color 0.2s,
      box-shadow 0.2s;
  }

  .op1-chassis.grid-layout {
    display: grid;
    grid-template-columns: 5fr 7fr;
    gap: 16px;
    padding: 16px;
  }

  /* Chassis error state */
  .chassis-error {
    animation: chassis-shake 0.25s ease-in-out;
    border-color: #ff3344 !important;
    box-shadow: 0 0 20px rgba(255, 51, 68, 0.2) !important;
  }

  @keyframes chassis-shake {
    0%,
    100% {
      transform: translate(0, 0);
    }
    25% {
      transform: translate(-2px, 1px);
    }
    75% {
      transform: translate(2px, -1px);
    }
  }

  /* LCD Screen Error Banner overlaying only visualizer area */
  .screen-error-overlay {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: rgba(15, 5, 5, 0.92);
    color: #ff3344;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10;
    font-family: monospace;
    border-radius: 8px;
    border: 1px solid #ff3344;
    padding: 6px 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.6);
    animation: flash-error 0.5s infinite alternate;
    pointer-events: none;
    width: 75%;
    text-align: center;
  }
  @keyframes flash-error {
    0% {
      opacity: 0.85;
    }
    100% {
      opacity: 1;
    }
  }
  .error-msg {
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.05em;
  }
  .error-sub {
    font-size: 0.5rem;
    opacity: 0.7;
    margin-top: 1px;
  }

  /* Pad Error State */
  .pad-card.pad-error {
    border-color: #ff3344 !important;
    background: rgba(255, 51, 68, 0.1) !important;
    box-shadow:
      inset 0 0 10px rgba(255, 51, 68, 0.2),
      0 0 10px rgba(255, 51, 68, 0.15) !important;
    color: #ff3344 !important;
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
  .color-cyan {
    background: #00bfff;
  }
  .color-green {
    background: #00ff66;
  }
  .color-orange {
    background: #ffcc00;
  }
  .color-pink {
    background: #ff55bb;
  }

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
    box-shadow:
      inset 0 1px 2px rgba(255, 255, 255, 0.05),
      0 2px 4px rgba(0, 0, 0, 0.3);
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
  .pad-blue:hover {
    border-color: #0077ff;
    background: rgba(0, 119, 255, 0.04);
  }
  .pad-blue.active {
    background: #0077ff;
    color: black;
    box-shadow: 0 0 15px #0077ff;
  }

  .pad-cyan:hover {
    border-color: #00bfff;
    background: rgba(0, 191, 255, 0.04);
  }
  .pad-cyan.active {
    background: #00bfff;
    color: black;
    box-shadow: 0 0 15px #00bfff;
  }

  .pad-orange:hover {
    border-color: #ffcc00;
    background: rgba(255, 204, 0, 0.04);
  }
  .pad-orange.active {
    background: #ffcc00;
    color: black;
    box-shadow: 0 0 15px #ffcc00;
  }

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

  .custom-pad.active .pad-label,
  .custom-pad.active .pad-show-tag,
  .custom-pad.active .pad-key {
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
  .pad-pink:hover {
    border-color: #ff55bb;
    background: rgba(255, 85, 187, 0.04);
  }
  .pad-pink.active {
    background: #ff55bb;
    color: black;
    box-shadow: 0 0 15px #ff55bb;
  }
</style>
