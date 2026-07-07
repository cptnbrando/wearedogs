<script>
  import { BookOpen, Calendar, History, ArrowRight } from "lucide-svelte";

  let selectedMilestoneId = $state(1);

  const MILESTONES = [
    {
      id: 1,
      era: "3500 BC",
      title: "Sundials & Obelisks",
      summary: "First division of the day into equal parts",
      description: "Ancient Egyptian obelisks cast moving shadows, creating the world's first public clocks. Later, pocket sundials allowed travelers to measure time based on the Sun's altitude.",
      breakthrough: "Establishing the concept of dividing daylight into hours."
    },
    {
      id: 2,
      era: "1500 BC",
      title: "Water Clocks (Clepsydrae)",
      summary: "First clock independent of astronomical conditions",
      description: "Used by Persians and Babylonians, water clocks measured time by the steady flow of water out of or into a graduated vessel. It worked at night and in cloudy weather.",
      breakthrough: "Measuring time via rate-of-flow mechanics."
    },
    {
      id: 3,
      era: "8th Century AD",
      title: "Hourglasses (Sands of Time)",
      summary: "Portable and reusable timer units",
      description: "Made of two glass bulbs connected by a narrow neck, allowing sand to flow from top to bottom. Widely used on ships, in churches, and during cooking to measure set durations.",
      breakthrough: "Sealed, reusable, gravity-driven measurement."
    },
    {
      id: 4,
      era: "1283 AD",
      title: "Verge Escapement Clocks",
      summary: "First purely mechanical clock structures",
      description: "Developed in medieval Europe, mechanical clocks utilized falling weights controlled by an oscillating verge escapement. They struck bells in monastery towers.",
      breakthrough: "Converting continuous falling mass into discrete ticks."
    },
    {
      id: 5,
      era: "1656 AD",
      title: "The Pendulum Clock",
      summary: "Christiaan Huygens brings precision to seconds",
      description: "Inspired by Galileo's studies of pendulums, Christiaan Huygens built the first pendulum clock. It reduced clock errors from 15 minutes a day to under 15 seconds.",
      breakthrough: "Using natural harmonic oscillators for timing consistency."
    },
    {
      id: 6,
      era: "1675 AD",
      title: "Pocket Watches",
      summary: "Portable spring-driven personal timepieces",
      description: "The introduction of the spiral balance spring (hairspring) allowed mechanical clocks to be miniaturized into a pocket watch format without losing accuracy.",
      breakthrough: "Replacing heavy gravity weights with spring tension."
    },
    {
      id: 7,
      era: "1761 AD",
      title: "Marine Chronometer (H4)",
      summary: "John Harrison solves the longitude problem",
      description: "Carpenter John Harrison built a highly precise sea watch that could withstand ship motions and temp changes. It allowed sailors to accurately determine longitude, saving thousands of lives.",
      breakthrough: "Temperature-compensated mechanics resilient to motion."
    },
    {
      id: 8,
      era: "1859 AD",
      title: "Big Ben (Great Clock of Westminster)",
      summary: "The pinnacle of large mechanical accuracy",
      description: "Designed by Edmund Beckett Denison, Big Ben features a gravity escapement that isolates the pendulum from external wind and weather forces, setting a new standard for public towers.",
      breakthrough: "Weather-isolated gravity escapement."
    },
    {
      id: 9,
      era: "1927 AD",
      title: "Quartz Crystal Clocks",
      summary: "Electricity vibrating quartz minerals",
      description: "Warren Marrison and J.W. Horton discovered that passing electricity through a quartz crystal causes it to vibrate at a highly stable frequency (usually 32,768 Hz).",
      breakthrough: "Replacing mechanical pendulums with high-frequency piezo-electricity."
    },
    {
      id: 10,
      era: "1955 AD",
      title: "Cesium Atomic Clocks",
      summary: "Defining the standard SI second",
      description: "Louis Essen built the first cesium atomic clock. It measured the resonance frequency of cesium-133 atoms, defining the SI second as exactly 9,192,631,770 oscillations. Error rate: 1 sec in 1.4 million years.",
      breakthrough: "Using stable atomic transition levels as the ultimate pendulum."
    },
    {
      id: 11,
      era: "21st Century",
      title: "Quantum Optical Lattice Clocks",
      summary: "Lasers probing strontium atoms in a grid",
      description: "Modern quantum clocks trap strontium or ytterbium atoms in grids of laser light (optical lattices). They operate at optical frequencies, losing less than a second in the entire age of the universe.",
      breakthrough: "Strontium grid quantum mapping at optical frequencies."
    }
  ];

  let activeNode = $derived(MILESTONES.find(m => m.id === selectedMilestoneId));

  function selectMilestone(id) {
    selectedMilestoneId = id;
  }
</script>

<div class="history-tab animated-pane flex flex-col md:flex-row items-stretch gap-5 h-full p-4 md:p-6 w-full max-w-5xl mx-auto overflow-hidden">
  
  <!-- Left Side: Interactive vertical timeline list -->
  <div class="w-full md:w-5/12 flex flex-col justify-between">
    <div class="mb-4">
      <h2 class="text-xs uppercase tracking-widest text-violet-400 font-bold mb-1 flex items-center gap-1.5">
        <History size={14} />
        Chronology of Time
      </h2>
      <p class="text-[10px] text-white/40">From shadows to quantum optical vibrations</p>
    </div>

    <!-- Timeline scroll grid -->
    <div class="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 scroll-container min-h-[160px] max-h-[360px] md:max-h-none">
      {#each MILESTONES as item}
        <button 
          class="timeline-node-card text-left p-3 border border-white/5 bg-white/2 rounded-xl transition-all duration-200"
          class:active={selectedMilestoneId === item.id}
          onclick={() => selectMilestone(item.id)}
        >
          <div class="flex items-center justify-between gap-2">
            <span class="badge text-[9px] font-extrabold font-mono px-2 py-0.5 rounded
                  {selectedMilestoneId === item.id ? 'bg-violet-500/20 text-violet-400' : 'bg-white/5 text-white/45'}"
            >
              {item.era}
            </span>
            <ArrowRight size={12} class="text-violet-400/40 node-arrow transition-transform" />
          </div>
          <h4 class="font-bold text-xs text-white/90 mt-2 truncate">{item.title}</h4>
          <p class="text-[10px] text-white/45 mt-0.5 truncate">{item.summary}</p>
        </button>
      {/each}
    </div>
  </div>

  <!-- Right Side: Milestone detail viewport -->
  <div class="flex-1 border border-white/5 bg-black/20 p-5 rounded-2xl flex flex-col justify-between overflow-y-auto scroll-container">
    <div>
      <div class="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
        <div>
          <span class="text-[10px] font-bold text-violet-400 font-mono tracking-wider">{activeNode.era}</span>
          <h3 class="text-base font-extrabold text-white mt-0.5">{activeNode.title}</h3>
        </div>
        <div class="w-9 h-9 rounded-full bg-violet-500/10 border border-violet-500/30 flex items-center justify-center">
          <Calendar size={16} class="text-violet-400" />
        </div>
      </div>

      <p class="text-xs text-white/70 leading-relaxed font-normal mb-5">
        {activeNode.description}
      </p>

      <div class="border border-violet-500/15 bg-violet-500/5 p-3.5 rounded-xl">
        <span class="text-[9px] font-bold uppercase tracking-wider text-violet-400 block mb-1">KEY BREAKTHROUGH</span>
        <p class="text-xs text-white/80 italic font-medium leading-snug">
          "{activeNode.breakthrough}"
        </p>
      </div>
    </div>

    <div class="mt-8 pt-3 border-t border-white/5 flex items-center justify-between text-[9px] text-white/30">
      <span>FATHER TIME HISTORY MODULE</span>
      <span>EPOCH {activeNode.id} OF {MILESTONES.length}</span>
    </div>
  </div>
</div>

<style>
  .timeline-node-card {
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0,0,0,0.15);
  }

  .timeline-node-card:hover {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.08);
  }

  .timeline-node-card.active {
    background: rgba(139, 92, 246, 0.06);
    border-color: rgba(139, 92, 246, 0.35);
    box-shadow: 0 0 15px rgba(139, 92, 246, 0.1);
  }

  .timeline-node-card.active .node-arrow {
    transform: translateX(4px);
    color: rgb(167, 139, 250);
  }

  .scroll-container {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
  }
  .scroll-container::-webkit-scrollbar {
    width: 5px;
  }
  .scroll-container::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
</style>
