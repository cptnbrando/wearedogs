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

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  // Play Procedural sound
  function playProcedural(type) {
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

    const basePitch = knobPitch;

    if (type === "woof") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(140 * basePitch, now);
      osc.frequency.exponentialRampToValueAtTime(60 * basePitch, now + 0.18 / knobSpeed);
      
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22 / knobSpeed);
      osc.start(now);
      osc.stop(now + 0.22 / knobSpeed);
    } else if (type === "yip") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(550 * basePitch, now);
      osc.frequency.exponentialRampToValueAtTime(320 * basePitch, now + 0.1 / knobSpeed);
      
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12 / knobSpeed);
      osc.start(now);
      osc.stop(now + 0.12 / knobSpeed);
    } else {
      // growl
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(180 * basePitch, now);
      osc.frequency.linearRampToValueAtTime(250 * basePitch, now + 0.15 / knobSpeed);
      osc.frequency.exponentialRampToValueAtTime(90 * basePitch, now + 0.45 / knobSpeed);
      
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45 / knobSpeed);
      osc.start(now);
      osc.stop(now + 0.45 / knobSpeed);
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

  // Unified Launchpad triggers
  function triggerPad(idx) {
    activePadIndex = idx;
    setTimeout(() => {
      if (activePadIndex === idx) activePadIndex = null;
    }, 250);

    if (idx === 0) {
      playProcedural("woof");
    } else if (idx === 1) {
      playProcedural("yip");
    } else if (idx === 2) {
      playProcedural("growl");
    } else {
      // Custom clips from samplerStore
      const customIdx = idx - 3;
      if (customIdx >= 0 && customIdx < samplerStore.customClips.length) {
        const clip = samplerStore.customClips[customIdx];
        playCustomClip(clip);
      }
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
      canvasCtx.strokeStyle = "#ff55bb"; // OP-1 pink
      canvasCtx.lineWidth = 2.5;
      canvasCtx.shadowBlur = 10;
      canvasCtx.shadowColor = "#ff55bb";

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
    
    // Woof, Yip, Growl
    if (key === "q") triggerPad(0);
    else if (key === "w") triggerPad(1);
    else if (key === "e") triggerPad(2);
    
    // Custom triggers mapped to keys in samplerStore
    const matchClipIdx = samplerStore.customClips.findIndex(c => c.key === key);
    if (matchClipIdx !== -1) {
      triggerPad(matchClipIdx + 3);
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

<div class="soundboard-layout animated-pane">
  <div class="op1-chassis">
    <!-- LCD Display screen (Waveform + Info indicators) -->
    <div class="op1-screen-unit">
      <div class="screen-grid-details">
        <span class="patch-name">CANINE SAMPLER SYNTH</span>
        <span class="cutoff-freq">FREQ: {Math.round(knobCutoff)}Hz</span>
        <span class="pitch-pct">PITCH: {knobPitch.toFixed(2)}x</span>
      </div>

      <!-- Oscilloscope CRT Canvas -->
      <canvas bind:this={canvasRef} width="400" height="110" class=" CRT-canvas"></canvas>

      <div class="screen-footer-hud">
        <span class="hud-item"><Activity size={10} /> OP-1 ENGINE ACTIVE</span>
        <span class="hud-item"><Zap size={10} /> RATE: {knobSpeed.toFixed(2)}x</span>
      </div>
    </div>

    <!-- Encoders knobs row (Colored circles) -->
    <div class="encoders-deck">
      <!-- Knob 1: Pitch (Cyan) -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
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
      <!-- svelte-ignore a11y_no_static_element_interactions -->
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
      <!-- svelte-ignore a11y_no_static_element_interactions -->
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
      <!-- svelte-ignore a11y_no_static_element_interactions -->
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

    <!-- Novation Launchpad Pad Matrix grid (4x4) -->
    <div class="launchpad-grid-wrapper">
      <div class="launchpad-tag">LAUNCHPAD SAMPLES GRID</div>
      
      <div class="launchpad-grid">
        <!-- Pad 1: Deep Woof -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div 
          class="pad-card procedural-pad pad-blue" 
          class:active={activePadIndex === 0}
          onclick={() => triggerPad(0)}
        >
          <span class="pad-key">Q</span>
          <span class="pad-emoji">🐕</span>
          <span class="pad-label">Deep Woof</span>
        </div>

        <!-- Pad 2: Puppy Yip -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div 
          class="pad-card procedural-pad pad-cyan" 
          class:active={activePadIndex === 1}
          onclick={() => triggerPad(1)}
        >
          <span class="pad-key">W</span>
          <span class="pad-emoji">🐶</span>
          <span class="pad-label">Puppy Yip</span>
        </div>

        <!-- Pad 3: Playful Growl -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div 
          class="pad-card procedural-pad pad-orange" 
          class:active={activePadIndex === 2}
          onclick={() => triggerPad(2)}
        >
          <span class="pad-key">E</span>
          <span class="pad-emoji">🐺</span>
          <span class="pad-label">Playful Growl</span>
        </div>

        <!-- Pads 4-16: Custom slices loaded from samplerStore -->
        {#each Array(13) as _, i}
          {@const customIdx = i}
          {@const clip = samplerStore.customClips[customIdx]}
          
          {#if clip}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div 
              class="pad-card custom-pad" 
              class:active={activePadIndex === customIdx + 3}
              style="--pad-glow: {clip.color}; border-color: {clip.color}44"
              onclick={() => triggerPad(customIdx + 3)}
            >
              <span class="pad-key">{clip.key.toUpperCase()}</span>
              <button class="delete-clip-btn" onclick={(e) => deleteClip(clip.id, e)} title="Delete Clip">✕</button>
              <span class="pad-show-tag">{clip.show.replace(" S1", "")}</span>
              <span class="pad-label">{clip.title}</span>
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
      <div class="clip-counter">TOTAL CUSTOM PADS: {samplerStore.customClips.length}/13</div>
    </footer>
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
</style>
