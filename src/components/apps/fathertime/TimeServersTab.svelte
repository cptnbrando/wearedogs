<script>
  import { onMount, onDestroy } from "svelte";
  import { ShieldAlert, RefreshCw, MapPin, Radio } from "lucide-svelte";
  import worldMapSvg from "../../../assets/world-map.svg?raw";

  let containerEl = $state();
  let selectedServerId = $state(null);
  let isSyncing = $state(false);

  // Time servers list
  let servers = $state([
    { id: "android", host: "time.android.com", name: "Google NTP (Android)", city: "Mountain View, USA", x: 125, y: 380, ping: null, offset: null, status: "Ready", stratum: 2 },
    { id: "windows", host: "time.windows.com", name: "Microsoft NTP", city: "Redmond, USA", x: 120, y: 360, ping: null, offset: null, status: "Ready", stratum: 2 },
    { id: "nist", host: "time.nist.gov", name: "NIST Atomic Clock", city: "Boulder, USA", x: 155, y: 378, ping: null, offset: null, status: "Ready", stratum: 1 },
    { id: "apple_euro", host: "time.euro.apple.com", name: "Apple Europe", city: "Frankfurt, Germany", x: 435, y: 350, ping: null, offset: null, status: "Ready", stratum: 2 },
    { id: "uk_pool", host: "uk.pool.ntp.org", name: "UK NTP Pool", city: "London, UK", x: 415, y: 345, ping: null, offset: null, status: "Ready", stratum: 2 },
    { id: "jp_pool", host: "jp.pool.ntp.org", name: "Japan NTP Pool", city: "Tokyo, Japan", x: 688, y: 385, ping: null, offset: null, status: "Ready", stratum: 2 },
    { id: "br_pool", host: "br.pool.ntp.org", name: "Brazil NTP Pool", city: "São Paulo, Brazil", x: 315, y: 585, ping: null, offset: null, status: "Ready", stratum: 2 },
    { id: "za_pool", host: "za.pool.ntp.org", name: "South Africa Pool", city: "Johannesburg, SA", x: 485, y: 605, ping: null, offset: null, status: "Ready", stratum: 2 },
    { id: "au_pool", host: "au.pool.ntp.org", name: "Australia NTP Pool", city: "Sydney, Australia", x: 725, y: 620, ping: null, offset: null, status: "Ready", stratum: 2 }
  ]);

  // Inject pins into the SVG element on mount/render
  function injectServerPins() {
    if (!containerEl) return;
    const svg = containerEl.querySelector("svg");
    if (!svg) return;

    // Remove existing server pins group if any
    const oldGroup = svg.querySelector(".server-pins");
    if (oldGroup) oldGroup.remove();

    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("class", "server-pins");

    servers.forEach((srv) => {
      // Create group for pin + radar pulse
      const pg = document.createElementNS("http://www.w3.org/2000/svg", "g");
      pg.setAttribute("id", `pin-${srv.id}`);
      pg.setAttribute("class", "server-pin-group cursor-pointer");
      pg.style.transition = "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)";
      
      // Radar outer pulse
      const pulse = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      pulse.setAttribute("cx", srv.x);
      pulse.setAttribute("cy", srv.y);
      pulse.setAttribute("r", 12);
      pulse.setAttribute("fill", "rgba(56, 189, 248, 0.2)");
      pulse.setAttribute("stroke", "rgba(56, 189, 248, 0.6)");
      pulse.setAttribute("stroke-width", "1");
      pulse.setAttribute("class", "radar-pulse-ring");
      pg.appendChild(pulse);

      // Core center dot
      const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      dot.setAttribute("cx", srv.x);
      dot.setAttribute("cy", srv.y);
      dot.setAttribute("r", 4.5);
      dot.setAttribute("fill", "#38bdf8");
      dot.setAttribute("stroke", "#ffffff");
      dot.setAttribute("stroke-width", "1.5");
      dot.setAttribute("class", "radar-dot");
      pg.appendChild(dot);

      // Click handler
      pg.addEventListener("click", () => {
        selectServer(srv.id);
      });

      g.appendChild(pg);
    });

    svg.appendChild(g);
    
    // Set map dimensions to fit neatly
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.style.maxHeight = "360px";
  }

  function selectServer(id) {
    selectedServerId = id;
    
    // Highlight pin visually in SVG by adding class
    if (!containerEl) return;
    const svg = containerEl.querySelector("svg");
    if (!svg) return;

    svg.querySelectorAll(".server-pin-group").forEach((el) => {
      el.classList.remove("selected-pin");
      const pulse = el.querySelector(".radar-pulse-ring");
      if (pulse) {
        pulse.setAttribute("fill", "rgba(56, 189, 248, 0.2)");
        pulse.setAttribute("stroke", "rgba(56, 189, 248, 0.6)");
      }
    });

    const activePin = svg.querySelector(`#pin-${id}`);
    if (activePin) {
      activePin.classList.add("selected-pin");
      const pulse = activePin.querySelector(".radar-pulse-ring");
      if (pulse) {
        pulse.setAttribute("fill", "rgba(244, 63, 94, 0.3)");
        pulse.setAttribute("stroke", "rgba(244, 63, 94, 0.8)");
      }
    }
  }

  async function syncAndCompare() {
    if (isSyncing) return;
    isSyncing = true;
    
    // Clear old pings
    servers.forEach(s => {
      s.status = "Syncing...";
      s.ping = null;
      s.offset = null;
    });

    // Simulate RTT/pings sequentially to make the UI look active
    for (let i = 0; i < servers.length; i++) {
      const srv = servers[i];
      await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 250));
      
      // Calculate a realistic latency based on region (assuming user is in US midwest)
      let basePing = 30; // Chicago base
      if (srv.id.includes("windows")) basePing = 45; // Redmond
      else if (srv.id.includes("nist")) basePing = 20; // Boulder
      else if (srv.id.includes("euro") || srv.id.includes("uk")) basePing = 95; // Europe
      else if (srv.id.includes("jp")) basePing = 140; // Asia
      else if (srv.id.includes("br")) basePing = 160; // S. America
      else if (srv.id.includes("za")) basePing = 260; // S. Africa
      else if (srv.id.includes("au")) basePing = 220; // Australia

      srv.ping = Math.round(basePing + (Math.random() - 0.5) * 15);
      // NTP clock offsets are in ms (range -8ms to +8ms)
      srv.offset = parseFloat(((Math.random() - 0.5) * 4).toFixed(3));
      srv.status = "Synced";
    }

    isSyncing = false;
  }

  onMount(() => {
    injectServerPins();
    syncAndCompare();
  });

  $effect(() => {
    if (containerEl) {
      injectServerPins();
      if (selectedServerId) {
        selectServer(selectedServerId);
      }
    }
  });
</script>

<div class="time-servers-tab animated-pane flex flex-col h-full p-4 md:p-6 w-full max-w-4xl mx-auto justify-between gap-5">
  <div class="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3">
    <div>
      <h2 class="text-xs uppercase tracking-widest text-sky-400 font-bold mb-1">NTP Time Servers</h2>
      <p class="text-[10px] text-white/40">Audit network clock offset & sync speeds globally</p>
    </div>
    
    <button 
      class="sync-btn"
      disabled={isSyncing}
      onclick={syncAndCompare}
    >
      <RefreshCw size={14} class={isSyncing ? "animate-spin" : ""} />
      <span>{isSyncing ? "AUDITING..." : "SYNC & COMPARE"}</span>
    </button>
  </div>

  <!-- Map Display Panel -->
  <div 
    bind:this={containerEl}
    class="flex-grow w-full border border-white/5 bg-black/20 rounded-2xl overflow-hidden relative min-h-[180px] max-h-[360px] flex items-center justify-center"
  >
    <!-- Map Canvas Injector -->
    <div class="map-wrapper w-full h-full">
      {@html worldMapSvg}
    </div>

    <!-- Active overlay displaying selected server info on the map -->
    {#if selectedServerId}
      {@const srv = servers.find(s => s.id === selectedServerId)}
      <div class="absolute bottom-3 left-3 bg-[#0d0d15]/95 border border-sky-400/30 p-3 rounded-xl max-w-xs text-xs shadow-2xl backdrop-blur-md">
        <div class="flex items-center gap-1.5 font-bold text-white mb-1">
          <MapPin size={12} class="text-sky-400" />
          <span>{srv.name}</span>
        </div>
        <p class="text-[10px] text-white/40 mb-2">Location: {srv.city} | Stratum: {srv.stratum}</p>
        <div class="grid grid-cols-2 gap-2 text-[10px] font-mono">
          <div class="bg-white/2 px-2 py-1 rounded">
            <span class="text-white/30 block text-[8px]">LATENCY</span>
            <span class="text-sky-400 font-bold">{srv.ping ? `${srv.ping}ms` : "checking..."}</span>
          </div>
          <div class="bg-white/2 px-2 py-1 rounded">
            <span class="text-white/30 block text-[8px]">CLOCK OFFSET</span>
            <span class="font-bold" class:text-emerald-400={srv.offset >= 0} class:text-rose-400={srv.offset < 0}>
              {srv.offset ? `${srv.offset > 0 ? "+" : ""}${srv.offset}ms` : "calculating..."}
            </span>
          </div>
        </div>
      </div>
    {/if}
  </div>

  <!-- Server Table Compare -->
  <div class="w-full overflow-y-auto border border-white/5 bg-black/15 rounded-xl scroll-container max-h-[150px]">
    <table class="w-full text-left text-xs divide-y divide-white/5">
      <thead>
        <tr class="bg-white/3 text-white/40 font-bold uppercase tracking-wider text-[9px]">
          <th class="py-2 px-3">Server Hostname</th>
          <th class="py-2 px-3">Location Node</th>
          <th class="py-2 px-3 text-right">Ping (RTT)</th>
          <th class="py-2 px-3 text-right">Local Offset</th>
          <th class="py-2 px-3 text-right">Stratum</th>
          <th class="py-2 px-3 text-right">Status</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-white/5 font-mono">
        {#each servers as srv (srv.id)}
          <tr 
            class="hover:bg-white/3 cursor-pointer transition-colors {selectedServerId === srv.id ? 'bg-sky-400/5' : ''}"
            onclick={() => selectServer(srv.id)}
          >
            <td class="py-2 px-3 font-semibold text-white/80">{srv.host}</td>
            <td class="py-2 px-3 text-white/50 text-[10px]">{srv.city}</td>
            <td class="py-2 px-3 text-right text-sky-400 font-medium">
              {srv.ping ? `${srv.ping} ms` : "---"}
            </td>
            <td class="py-2 px-3 text-right font-medium" class:text-emerald-400={srv.offset >= 0} class:text-rose-400={srv.offset < 0}>
              {srv.offset ? `${srv.offset > 0 ? "+" : ""}${srv.offset} ms` : "---"}
            </td>
            <td class="py-2 px-3 text-right text-white/40 text-[10px]">Lvl {srv.stratum}</td>
            <td class="py-2 px-3 text-right">
              <span class="inline-block px-1.5 py-0.5 rounded text-[8px] font-bold 
                    {srv.status === 'Synced' ? 'bg-emerald-500/15 text-emerald-400' : ''}
                    {srv.status === 'Syncing...' ? 'bg-amber-500/15 text-amber-400' : ''}
                    {srv.status === 'Ready' ? 'bg-white/5 text-white/45' : ''}"
              >
                {srv.status}
              </span>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style>
  .sync-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 8px;
    background: rgba(56, 189, 248, 0.15);
    border: 1px solid rgba(56, 189, 248, 0.35);
    color: #38bdf8;
    cursor: pointer;
    font-weight: 700;
    font-size: 0.8rem;
    transition: all 0.2s ease;
  }

  .sync-btn:hover {
    background: rgba(56, 189, 248, 0.25);
    box-shadow: 0 0 12px rgba(56, 189, 248, 0.25);
  }

  .sync-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .map-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }

  /* Style embedded SVG */
  .map-wrapper :global(svg) {
    background: transparent;
  }
  .map-wrapper :global(path) {
    fill: rgba(255, 255, 255, 0.035);
    stroke: rgba(255, 255, 255, 0.08);
    stroke-width: 0.5px;
    transition: fill 0.3s ease;
  }

  .map-wrapper :global(path:hover) {
    fill: rgba(255, 255, 255, 0.06);
  }

  /* Custom animated styles for SVG pins */
  :global(.radar-pulse-ring) {
    transform-origin: center;
    animation: radarPulse 1.8s infinite ease-out;
  }

  :global(.server-pin-group:hover) {
    transform: scale(1.3);
  }

  :global(.selected-pin) {
    transform: scale(1.4);
  }

  @keyframes radarPulse {
    0% {
      r: 4.5;
      stroke-opacity: 1;
      fill-opacity: 0.4;
    }
    100% {
      r: 16;
      stroke-opacity: 0;
      fill-opacity: 0;
    }
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
