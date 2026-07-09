<script>
  import { onMount, onDestroy } from "svelte";
  import { Play, Pause, ChevronLeft, ChevronRight, Volume2, Radio } from "lucide-svelte";
  import { Metronome } from "./metronome.svelte.js";
  import MetronomeVisual from "./MetronomeVisual.svelte";

  let { metronome } = $props();
  
  // Local UI states matching metronome scheduler
  let isPlaying = $derived(metronome.isPlaying);
  let bpm = $state(120);
  let timeSignature = $state(4);
  let subdivision = $state(1);
  let soundType = $state("woodblock");
  let swing = $state(0);
  let vibrate = $state(false);

  // Animation variables
  let activeBeatIndex = $state(-1);
  let activeSubIndex = $state(-1);
  
  // Tap tempo buffer
  let lastTapTime = 0;
  let tapIntervals = [];

  function toggleMetronome() {
    metronome.toggle();
  }

  function handleTapTempo() {
    const now = Date.now();
    if (lastTapTime > 0) {
      const interval = now - lastTapTime;
      if (interval < 2500) { // Max interval is 2.5s (~24 BPM)
        tapIntervals.push(interval);
        if (tapIntervals.length > 4) tapIntervals.shift();
        
        // Calculate average
        const avg = tapIntervals.reduce((a, b) => a + b, 0) / tapIntervals.length;
        const newBpm = Math.round(60000 / avg);
        if (newBpm >= 30 && newBpm <= 300) {
          bpm = newBpm;
        }
      } else {
        tapIntervals = [];
      }
    }
    lastTapTime = now;
  }

  function incrementBpm(amount) {
    bpm = Math.min(Math.max(bpm + amount, 30), 300);
  }

  // Update metronome class properties whenever local values change
  $effect(() => {
    metronome.setBpm(bpm);
  });
  $effect(() => {
    metronome.timeSignature = timeSignature;
  });
  $effect(() => {
    metronome.subdivision = subdivision;
  });
  $effect(() => {
    metronome.soundType = soundType;
  });
  $effect(() => {
    metronome.swing = swing;
  });
  $effect(() => {
    metronome.vibrate = vibrate;
  });

  // Pendulum animation loop
  function animatePendulum(timestamp) {
    if (!animStartTime) animStartTime = timestamp;
    
    if (isPlaying) {
      // Angular frequency = 2 * PI * frequency
      // One full oscillation (left to right and back) takes (60 / BPM) * 2 seconds
      // So frequency = BPM / 120
      const freq = bpm / 120;
      const t = (timestamp - animStartTime) / 1000;
      
      // Calculate angle: oscillates between -30 and +30 degrees
      pendulumAngle = Math.sin(2 * Math.PI * freq * t) * 32;
    } else {
      // Settle down to center
      pendulumAngle = pendulumAngle * 0.92;
      if (Math.abs(pendulumAngle) < 0.1) pendulumAngle = 0;
    }

    animationId = requestAnimationFrame(animatePendulum);
  }

  onMount(() => {
    metronome.onBeatCallback = (details) => {
      activeBeatIndex = details.beatIndex - 1;
      activeSubIndex = details.subIndex;
      
      // Clear visual highlights after short delay
      setTimeout(() => {
        if (activeBeatIndex === details.beatIndex - 1) {
          activeBeatIndex = -1;
          activeSubIndex = -1;
        }
      }, 100);
    };
  });

  onDestroy(() => {
    metronome.stop();
  });
</script>

<div class="metronome-tab animated-pane flex flex-col md:flex-row items-center gap-6 justify-around h-full p-4 md:p-6 w-full max-w-4xl mx-auto">
  
  <!-- Left Side: Metronome Visual (hidden on 2xl where sidebar renders it instead) -->
  <div class="flex 2xl:hidden flex-col items-center justify-center flex-shrink-0">
    <MetronomeVisual bpm={bpm} isPlaying={isPlaying} />
  </div>

  <!-- Right Side: Config Controls Dashboard -->
  <div class="flex-1 max-w-md w-full flex flex-col justify-between">
    <div class="w-full text-center md:text-left mb-4">
      <h2 class="text-xs uppercase tracking-widest text-violet-400 font-bold mb-1">Mechanical Metronome</h2>
      <p class="text-[10px] text-white/40">Synchronized rhythm scheduler & oscillator</p>
    </div>

    <!-- BPM Dial Display -->
    <div class="flex items-center justify-center gap-4 my-2 select-none">
      <button 
        class="p-2 border border-white/10 bg-white/3 hover:bg-white/8 rounded-xl text-white/80 transition-colors"
        onclick={() => incrementBpm(-1)}
        aria-label="Decrease BPM by 1"
      >
        <ChevronLeft size={16} />
      </button>
      <div class="text-center w-28">
        <span class="font-mono text-5xl font-black text-violet-400 tracking-tighter">{bpm}</span>
        <span class="text-[9px] text-white/30 block uppercase tracking-widest font-bold">BPM</span>
      </div>
      <button 
        class="p-2 border border-white/10 bg-white/3 hover:bg-white/8 rounded-xl text-white/80 transition-colors"
        onclick={() => incrementBpm(1)}
        aria-label="Increase BPM by 1"
      >
        <ChevronRight size={16} />
      </button>
    </div>

    <!-- BPM Slider -->
    <input 
      type="range" 
      min="30" 
      max="280" 
      bind:value={bpm} 
      class="w-full accent-violet-400 cursor-pointer h-1 rounded-lg bg-white/10 mb-4"
      aria-label="BPM slider range"
    />

    <!-- Tap Tempo Button -->
    <button 
      class="w-full py-2 bg-white/4 border border-white/8 hover:bg-white/8 rounded-xl text-xs font-bold text-white/70 hover:text-white transition-all uppercase tracking-wider mb-6 flex items-center justify-center gap-1.5"
      onclick={handleTapTempo}
    >
      <Radio size={12} />
      TAP TEMPO
    </button>

    <!-- Settings Grid -->
    <div class="grid grid-cols-2 gap-3 mb-6 text-xs text-white/70">
      
      <!-- Time Signature Selector -->
      <div class="flex flex-col gap-1">
        <label for="time-sig-select" class="text-[9px] font-bold text-white/45 uppercase tracking-wider">Time Signature</label>
        <select 
          id="time-sig-select"
          bind:value={timeSignature} 
          class="select-field"
        >
          <option value={2}>2/4 (Duple)</option>
          <option value={3}>3/4 (Triple)</option>
          <option value={4}>4/4 (Common)</option>
          <option value={5}>5/4 (Odd)</option>
          <option value={6}>6/8 (Compound)</option>
        </select>
      </div>

      <!-- Subdivision Selector -->
      <div class="flex flex-col gap-1">
        <label for="subdivision-select" class="text-[9px] font-bold text-white/45 uppercase tracking-wider">Subdivision</label>
        <select 
          id="subdivision-select"
          bind:value={subdivision} 
          class="select-field"
        >
          <option value={1}>Quarter Notes</option>
          <option value={2}>Eighth Notes</option>
          <option value={4}>Sixteenth Notes</option>
          <option value={3}>Triplets</option>
        </select>
      </div>

      <!-- Sound Selector -->
      <div class="flex flex-col gap-1">
        <label for="click-sound-select" class="text-[9px] font-bold text-white/45 uppercase tracking-wider">Click Sound</label>
        <select 
          id="click-sound-select"
          bind:value={soundType} 
          class="select-field"
        >
          <option value="woodblock">Classic Woodblock</option>
          <option value="cowbell">Metal Cowbell</option>
          <option value="electronic">Synth Beep</option>
          <option value="tick">Mechanical Tick</option>
        </select>
      </div>

      <!-- Swing Selector -->
      <div class="flex flex-col gap-1">
        <label for="swing-select" class="text-[9px] font-bold text-white/45 uppercase tracking-wider">Swing (Subdivisions)</label>
        <select 
          id="swing-select"
          bind:value={swing} 
          class="select-field"
        >
          <option value={0}>Straight (0%)</option>
          <option value={30}>Light Swing (30%)</option>
          <option value={60}>Medium Swing (60%)</option>
          <option value={90}>Heavy Swing (90%)</option>
        </select>
      </div>
    </div>

    <!-- Beat indicators visual display -->
    <div class="flex gap-2 justify-center mb-6">
      {#each Array(timeSignature) as _, idx}
        <div 
          class="w-6 h-6 rounded-full border flex items-center justify-center text-[9px] font-bold transition-all duration-100
            {activeBeatIndex === idx ? 'bg-violet-500 text-white border-violet-500 scale-110' : ''}
            {activeBeatIndex !== idx && idx === 0 ? 'border-violet-500/30 text-violet-400' : ''}
            {activeBeatIndex !== idx && idx !== 0 ? 'border-white/10 text-white/30' : ''}"
        >
          {idx + 1}
        </div>
      {/each}
    </div>

    <!-- Toggle Buttons -->
    <div class="flex items-center gap-3 w-full justify-center">
      <button 
        class="control-btn play-btn"
        class:active={isPlaying}
        onclick={toggleMetronome}
        aria-label={isPlaying ? "Stop metronome" : "Start metronome"}
      >
        {#if isPlaying}
          <Pause size={15} fill="currentColor" />
          <span class="text-xs font-bold ml-1.5">STOP</span>
        {:else}
          <Play size={15} fill="currentColor" />
          <span class="text-xs font-bold ml-1.5">START</span>
        {/if}
      </button>

      <button 
        class="control-btn bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white"
        onclick={() => (vibrate = !vibrate)}
        aria-label={vibrate ? "Disable vibration click" : "Enable vibration click"}
      >
        <Volume2 size={15} />
        <span class="text-xs font-semibold ml-1.5">{vibrate ? "VIBE ON" : "VIBE OFF"}</span>
      </button>
    </div>
  </div>
</div>

<style>
  .select-field {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    padding: 7px 10px;
    color: white;
    font-size: 0.78rem;
    outline: none;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .select-field:focus {
    border-color: rgba(139, 92, 246, 0.45);
    background: rgba(255, 255, 255, 0.06);
  }

  .select-field option {
    background: #0f0f15;
    color: white;
  }

  .control-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    padding: 10px 20px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .play-btn {
    background: rgba(139, 92, 246, 0.15);
    border: 1px solid rgba(139, 92, 246, 0.35);
    color: #a78bfa;
    min-width: 110px;
  }

  .play-btn:hover {
    background: rgba(139, 92, 246, 0.25);
    box-shadow: 0 0 15px rgba(139, 92, 246, 0.2);
  }

  .play-btn.active {
    background: rgba(239, 68, 68, 0.15);
    border-color: rgba(239, 68, 68, 0.35);
    color: #ef4444;
  }

  .play-btn.active:hover {
    background: rgba(239, 68, 68, 0.25);
    box-shadow: 0 0 15px rgba(239, 68, 68, 0.2);
  }
</style>
