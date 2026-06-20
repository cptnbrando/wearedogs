<script>
  let activeBarkIdx = $state(null);
  let audioContext = null;

  function initAudio() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function playBarkSound(pitch, type) {
    initAudio();
    if (!audioContext) return;

    activeBarkIdx = type;
    setTimeout(() => activeBarkIdx = null, 400);

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(audioContext.destination);

    const now = audioContext.currentTime;

    if (type === "woof") {
      // Deep Woof
      osc.type = "triangle";
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.18);
      
      gain.gain.setValueAtTime(0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === "yip") {
      // Puppy Yip
      osc.type = "sine";
      osc.frequency.setValueAtTime(550, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.1);
      
      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else {
      // Playful Growl/Howl
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(250, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.45);
      
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
      osc.start(now);
      osc.stop(now + 0.45);
    }
  }
</script>

<div class="soundboard-layout animated-pane">
  <h2>Dog Sound Synthesizer</h2>
  <p class="description">Tap tiles to play procedural canine sound waves.</p>

  <div class="bark-grid">
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="bark-card"
      class:pulse-active={activeBarkIdx === 'woof'}
      onclick={() => playBarkSound(1, 'woof')}
    >
      <span class="bark-emoji">🐕</span>
      <h3>Deep Woof</h3>
      <p>Low frequency guard dog response.</p>
    </div>

    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="bark-card"
      class:pulse-active={activeBarkIdx === 'yip'}
      onclick={() => playBarkSound(2, 'yip')}
    >
      <span class="bark-emoji">🐶</span>
      <h3>Puppy Yip</h3>
      <p>High pitch playful alert.</p>
    </div>

    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="bark-card"
      class:pulse-active={activeBarkIdx === 'growl'}
      onclick={() => playBarkSound(3, 'growl')}
    >
      <span class="bark-emoji">🐺</span>
      <h3>Playful Growl</h3>
      <p>Mid frequency husky howling vocalization.</p>
    </div>
  </div>
</div>

<style>
  .soundboard-layout {
    padding: 24px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
    color: white;
  }

  .description {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.45);
    margin: 4px 0 20px 0;
  }

  .bark-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-top: 10px;
  }

  .bark-card {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 24px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .bark-card:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-4px);
    border-color: rgba(255, 85, 187, 0.4);
  }

  .bark-emoji {
    font-size: 2.5rem;
    display: block;
    margin-bottom: 12px;
  }

  .bark-card h3 {
    margin: 0 0 6px 0;
    font-size: 1rem;
    color: white;
  }

  .bark-card p {
    margin: 0;
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.4);
    line-height: 1.4;
  }

  .bark-card.pulse-active {
    background: rgba(255, 85, 187, 0.2);
    border-color: #ff55bb;
    box-shadow: 0 0 20px rgba(255, 85, 187, 0.3);
    transform: scale(0.96);
  }

  .animated-pane {
    animation: paneFadeIn 0.3s ease forwards;
  }

  @keyframes paneFadeIn {
    0% { opacity: 0; transform: translateY(8px); }
    100% { opacity: 1; transform: translateY(0); }
  }
</style>
