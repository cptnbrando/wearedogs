<script>
  import { X, Bookmark, Trash2, Sliders, ArrowLeft, ArrowRight, Download, Upload, RotateCcw } from "lucide-svelte";
  
  let { isOpen = $bindable(false), showKey, episodeTitle, duration = 100 } = $props();

  // Load mappings from localStorage per episode or use default percentages (1 = 10%, 2 = 20%, etc.)
  let keyMappings = $state(Array(10).fill(0).map((_, i) => ({
    key: i.toString(),
    time: Math.round(duration * (i === 0 ? 0 : i * 10) / 100)
  })));

  const storageKey = $derived(`gopro_remapper_${showKey}_${episodeTitle}`);

  $effect(() => {
    if (storageKey) {
      loadMappings();
    }
  });

  function loadMappings() {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        keyMappings = JSON.parse(saved);
        return;
      } catch {}
    }
    resetToDefaults();
  }

  function saveMappings() {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify(keyMappings));
    }
  }

  function resetToDefaults() {
    keyMappings = Array(10).fill(0).map((_, i) => ({
      key: i.toString(),
      time: Math.round(duration * (i === 0 ? 0 : i * 10) / 100)
    }));
    saveMappings();
  }

  function nudge(index, amount) {
    keyMappings[index].time = Math.max(0, Math.min(duration, keyMappings[index].time + amount));
    saveMappings();
  }

  function formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  function exportBindings() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(keyMappings));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `gopro_keybinds_${showKey}_${episodeTitle}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  function handleImport(e) {
    if (!e.target.files || e.target.files.length === 0) return;
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed) && parsed.length === 10) {
          keyMappings = parsed;
          saveMappings();
          alert("Key bindings imported successfully!");
        } else {
          alert("Invalid file format. Make sure it contains 10 key mappings.");
        }
      } catch (err) {
        alert("Failed to parse JSON file.");
      }
    };
    fileReader.readAsText(e.target.files[0]);
  }
</script>

{#if isOpen}
  <div class="meta-drawer remapper-drawer">
    <div class="drawer-header">
      <h2>0-9 Keys Remapper</h2>
      <button onclick={() => (isOpen = false)} class="close-drawer">✕</button>
    </div>
    <div class="drawer-body flex flex-col gap-4 max-h-[85vh] overflow-y-auto p-4 font-sans text-white">
      <p class="text-[10px] text-white/50 leading-relaxed uppercase tracking-wider">
        Remap keys 0-9 to custom frame timestamps for this episode.
      </p>

      <div class="flex flex-col gap-2">
        {#each keyMappings as mapping, i}
          <div class="flex items-center justify-between bg-white/[0.02] border border-white/5 p-2 rounded-lg gap-2 text-xs">
            <span class="font-mono font-bold text-cyan-400 bg-white/5 px-2 py-0.5 rounded">Key {mapping.key}</span>
            
            <div class="flex items-center gap-1">
              <button 
                class="bg-white/5 hover:bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-bold"
                onclick={() => nudge(i, -1)}
                title="Nudge back 1s"
              >
                ◀ -1s
              </button>
              <input 
                type="number"
                min="0"
                max={duration}
                bind:value={mapping.time}
                onchange={saveMappings}
                class="w-16 bg-black/40 border border-white/10 text-center text-xs text-white rounded outline-none px-1"
              />
              <button 
                class="bg-white/5 hover:bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-bold"
                onclick={() => nudge(i, 1)}
                title="Nudge forward 1s"
              >
                +1s ▶
              </button>
            </div>
            <span class="text-[10px] text-white/40 font-mono w-12 text-right">{formatTime(mapping.time)}</span>
          </div>
        {/each}
      </div>

      <!-- Action buttons -->
      <div class="flex flex-col gap-2 mt-2 pt-3 border-t border-white/5">
        <div class="flex gap-2">
          <button 
            class="flex-1 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-bold flex items-center justify-center gap-1"
            onclick={exportBindings}
          >
            <Upload size={12} /> Export JSON
          </button>
          <label class="flex-1 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-bold flex items-center justify-center gap-1 cursor-pointer text-center">
            <Download size={12} /> Import JSON
            <input type="file" accept=".json" onchange={handleImport} class="hidden" />
          </label>
        </div>
        <button 
          class="w-full py-1.5 bg-red-600/20 border border-red-500/20 hover:bg-red-600/30 text-red-400 rounded text-xs font-bold flex items-center justify-center gap-1"
          onclick={resetToDefaults}
        >
          <RotateCcw size={12} /> Reset to Defaults
        </button>
      </div>
    </div>
  </div>
{/if}
