<script>
    import { onMount, onDestroy } from "svelte";
    import { Play, Pause, MapPin, Eye, Info, ShieldAlert, Sparkles } from "lucide-svelte";

    // FBI Wanted API & Fallback Profiles
    let fbiProfiles = $state([]);
    let loadingFbi = $state(false);
    let selectedProfile = $state(null);
    let activeHotspot = $state("dubai"); // "dubai" or "france"

    // Bodycam overlay states
    let bodycamActive = $state(true);
    let bodycamTime = $state("00:00:00");
    let bodycamTimer = null;
    let bodycamSeconds = 0;

    const fallbackProfiles = [
        {
            title: "THE MOTHMAN (CASE #339)",
            description: "Winged humanoid sighted around dark forests. Red reflective eyes.",
            images: [{ original: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=400&q=80" }],
            details: "Height: 7ft | Wingspan: 10ft | Threat: Critical"
        },
        {
            title: "CHUPACABRA (CASE #821)",
            description: "Spotted depleting livestock near Mexico hotspots. High agility.",
            images: [{ original: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80" }],
            details: "Length: 4ft | Weight: 90lbs | Threat: High"
        },
        {
            title: "BURJ SHADOW FLIER (CASE #902)",
            description: "High altitude flyer detected circling Dubai towers at night.",
            images: [{ original: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80" }],
            details: "Wingspan: 14ft | Speed: 90mph | Threat: Medium"
        }
    ];

    async function fetchFBIProfiles() {
        loadingFbi = true;
        try {
            // FBI Wanted list endpoint
            const res = await fetch("https://api.fbi.gov/wanted/v1/list?pageSize=5&category=Seeking%20Information");
            if (!res.ok) throw new Error("CORS or server error");
            const data = await res.json();
            if (data && data.items && data.items.length > 0) {
                fbiProfiles = data.items.map(item => ({
                    title: item.title ? item.title.toUpperCase() : "CLASSIFIED SUBJECT",
                    description: item.description || "Classified details under investigation.",
                    images: item.images && item.images.length > 0 ? [{ original: item.images[0].original }] : [{ original: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=400&q=80" }],
                    details: item.details ? item.details.replace(/<[^>]*>/g, "") : "Details restricted to Level 4 authorization."
                }));
            } else {
                fbiProfiles = fallbackProfiles;
            }
        } catch (e) {
            console.warn("FBI Wanted API fetch failed/blocked. Using local dossiers:", e);
            fbiProfiles = fallbackProfiles;
        } finally {
            loadingFbi = false;
        }
    }

    // Canvas Nightvision Bodycam Animation
    let canvasEl = $state();
    let ctx;
    let animationFrameId;
    let creatureX = 60;
    let creatureY = 40;
    let creatureSpeedX = 1.2;
    let creatureSpeedY = 0.6;

    onMount(() => {
        fetchFBIProfiles();

        // Bodycam Clock timer
        bodycamTimer = setInterval(() => {
            bodycamSeconds++;
            const hrs = Math.floor(bodycamSeconds / 3600).toString().padStart(2, "0");
            const mins = Math.floor((bodycamSeconds % 3600) / 60).toString().padStart(2, "0");
            const secs = (bodycamSeconds % 60).toString().padStart(2, "0");
            bodycamTime = `${hrs}:${mins}:${secs}`;
        }, 1000);

        // Nightvision simulation
        if (canvasEl) {
            ctx = canvasEl.getContext("2d");
            
            function renderBodycam() {
                if (!ctx || !canvasEl) return;
                const w = canvasEl.width;
                const h = canvasEl.height;

                // 1. Dark green background
                ctx.fillStyle = "rgba(6, 26, 8, 1)";
                ctx.fillRect(0, 0, w, h);

                // 2. Grainy Noise
                ctx.fillStyle = "rgba(0, 255, 0, 0.12)";
                for (let i = 0; i < 300; i++) {
                    const nx = Math.random() * w;
                    const ny = Math.random() * h;
                    ctx.fillRect(nx, ny, 1.5, 1.5);
                }

                // 3. Horizontal Scanlines
                ctx.strokeStyle = "rgba(0, 255, 0, 0.04)";
                ctx.lineWidth = 1;
                for (let y = 0; y < h; y += 3) {
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(w, y);
                    ctx.stroke();
                }

                // 4. Moving fuzzy creature silhouette
                creatureX += creatureSpeedX;
                creatureY += creatureSpeedY;
                if (creatureX > w + 15 || creatureX < -15) creatureSpeedX = -creatureSpeedX;
                if (creatureY > h + 10 || creatureY < -10) creatureSpeedY = -creatureSpeedY;

                const grad = ctx.createRadialGradient(creatureX, creatureY, 1, creatureX, creatureY, 12);
                grad.addColorStop(0, "rgba(0, 240, 80, 0.75)");
                grad.addColorStop(0.5, "rgba(0, 160, 40, 0.25)");
                grad.addColorStop(1, "rgba(0, 0, 0, 0)");
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(creatureX, creatureY, 12, 0, Math.PI * 2);
                ctx.fill();

                // Blinking red eyes of the creature
                if (Math.random() > 0.08) {
                    ctx.fillStyle = "rgba(255, 20, 20, 0.95)";
                    ctx.fillRect(creatureX - 3, creatureY - 1, 2, 2);
                    ctx.fillRect(creatureX + 2, creatureY - 1, 2, 2);
                }

                // VCR Static scan-jump
                if (Math.random() > 0.98) {
                    ctx.fillStyle = "rgba(0, 255, 0, 0.4)";
                    ctx.fillRect(0, Math.random() * h, w, Math.random() * 4);
                }

                animationFrameId = requestAnimationFrame(renderBodycam);
            }
            renderBodycam();
        }
    });

    onDestroy(() => {
        if (bodycamTimer) clearInterval(bodycamTimer);
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
    });
</script>

<div class="missing-creatures-app flex flex-col h-full bg-[#0a0c10] text-zinc-300 font-sans overflow-y-auto w-full">
    <!-- Header -->
    <header class="border-b border-red-500/20 bg-zinc-950/70 p-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
            <span class="p-1 bg-red-600/10 border border-red-500/30 rounded text-red-500 font-mono text-[10px] tracking-widest uppercase">SWARM OUTPOST</span>
            <h1 class="text-lg font-bold tracking-widest text-white uppercase">MISSING CREATURES RADAR</h1>
        </div>
        <div class="flex items-center gap-4 text-xs font-mono">
            <div class="flex items-center gap-1.5 text-emerald-500 animate-pulse">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>RADAR ONLINE</span>
            </div>
        </div>
    </header>

    <!-- Main Content Layout -->
    <main class="flex-grow p-4 grid grid-cols-1 xl:grid-cols-12 gap-4">
        
        <!-- Left: Hotspot map & Comparison panel (Col 4) -->
        <section class="xl:col-span-4 flex flex-col gap-4">
            <div class="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
                <h2 class="text-sm font-bold text-white tracking-widest uppercase mb-3 flex items-center gap-2">
                    <MapPin size={14} class="text-red-500" /> SIGHTING HOTSPOTS
                </h2>
                
                <!-- Mock Map Visual -->
                <div class="relative bg-zinc-950 border border-zinc-800 rounded-lg h-44 overflow-hidden mb-3 flex items-center justify-center">
                    <!-- Grid background -->
                    <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px]"></div>
                    
                    <span class="text-[9px] font-mono text-zinc-600 absolute top-2 left-2">GLOBAL SURVEY MODE</span>
                    
                    <!-- Dubai Hotspot -->
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <div 
                        class="absolute cursor-pointer group"
                        style="top: 48%; left: 62%;"
                        onclick={() => activeHotspot = "dubai"}
                    >
                        <span class="absolute -inset-2.5 rounded-full bg-cyan-500/20 animate-ping"></span>
                        <span class="relative block w-2.5 h-2.5 rounded-full border border-cyan-400 bg-cyan-500" class:bg-red-500={activeHotspot === "dubai"}></span>
                        <div class="absolute top-4 left-1/2 -translate-x-1/2 bg-black/85 border border-zinc-800 rounded px-1.5 py-0.5 text-[8px] tracking-widest font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity">DUBAI</div>
                    </div>

                    <!-- France Hotspot -->
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <div 
                        class="absolute cursor-pointer group"
                        style="top: 38%; left: 45%;"
                        onclick={() => activeHotspot = "france"}
                    >
                        <span class="absolute -inset-2.5 rounded-full bg-cyan-500/20 animate-ping"></span>
                        <span class="relative block w-2.5 h-2.5 rounded-full border border-cyan-400 bg-cyan-500" class:bg-red-500={activeHotspot === "france"}></span>
                        <div class="absolute top-4 left-1/2 -translate-x-1/2 bg-black/85 border border-zinc-800 rounded px-1.5 py-0.5 text-[8px] tracking-widest font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity">FRANCE</div>
                    </div>
                </div>

                <!-- Hotspot comparison stats -->
                <div class="flex gap-2 mb-3">
                    <button 
                        class="flex-1 px-3 py-2 border rounded-lg text-left transition-all"
                        class:bg-red-650={activeHotspot === "dubai"}
                        class:border-red-500={activeHotspot === "dubai"}
                        class:bg-zinc-950={activeHotspot !== "dubai"}
                        class:border-zinc-800={activeHotspot !== "dubai"}
                        onclick={() => activeHotspot = "dubai"}
                    >
                        <div class="text-[10px] text-zinc-500 font-mono">HOTSPOT A</div>
                        <div class="font-bold text-white text-xs">DUBAI, UAE</div>
                        <div class="text-[10px] font-mono text-cyan-400 mt-1">42 sightings / yr</div>
                    </button>
                    <button 
                        class="flex-1 px-3 py-2 border rounded-lg text-left transition-all"
                        class:bg-red-650={activeHotspot === "france"}
                        class:border-red-500={activeHotspot === "france"}
                        class:bg-zinc-950={activeHotspot !== "france"}
                        class:border-zinc-800={activeHotspot !== "france"}
                        onclick={() => activeHotspot = "france"}
                    >
                        <div class="text-[10px] text-zinc-500 font-mono">HOTSPOT B</div>
                        <div class="font-bold text-white text-xs">FRANCE (CATACOMBS)</div>
                        <div class="text-[10px] font-mono text-cyan-400 mt-1">78 sightings / yr</div>
                    </button>
                </div>

                <div class="bg-zinc-950/80 border border-zinc-800 rounded-lg p-3 text-xs">
                    {#if activeHotspot === "dubai"}
                        <span class="text-white font-bold block mb-1">Dubai Hotspot Assessment:</span>
                        <p class="text-zinc-400 font-sans leading-relaxed">Creatures spotted circling high rise skyscrapers (Burj Khalifa). Behavior resembles high-speed nocturnal gliding. Sightings increase during dust storms.</p>
                    {:else}
                        <span class="text-white font-bold block mb-1">France Catacombs Assessment:</span>
                        <p class="text-zinc-400 font-sans leading-relaxed">Concentration in dark chambers and tunnel networks. Deep ultrasonic vibration triggers. Sightings often report shadow figures with reflective claws.</p>
                    {/if}
                </div>
            </div>

            <!-- Mexico Stats view -->
            <div class="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
                <h2 class="text-sm font-bold text-white tracking-widest uppercase mb-3 flex items-center gap-2">
                    <ShieldAlert size={14} class="text-yellow-500" /> SIGHTINGS CASE PROGRESSION
                </h2>
                <div class="bg-zinc-950 border border-zinc-800 rounded-lg p-3 flex items-center gap-4">
                    <div class="flex-shrink-0 w-12 h-12 bg-red-600/10 border border-red-500/30 rounded-full flex items-center justify-center text-red-500 font-bold font-mono text-sm animate-pulse">
                        MX
                    </div>
                    <div>
                        <div class="text-[10px] font-mono text-zinc-500">MEXICO RADAR DETECTIONS</div>
                        <div class="text-lg font-bold text-white font-mono">490,000 CASES</div>
                        <p class="text-[10px] text-zinc-400">Sightings list remains active. Investigation level: Critical.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Center: Investigator Polaroid Pinboard (Col 5) -->
        <section class="xl:col-span-5 flex flex-col gap-4">
            <div class="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col flex-grow">
                <h2 class="text-sm font-bold text-white tracking-widest uppercase mb-3 flex items-center justify-between">
                    <span>🕵️ INVESTIGATOR PINBOARD</span>
                    {#if loadingFbi}
                        <span class="text-[10px] font-mono text-yellow-500 animate-pulse">POLLING FBI ARCHIVE...</span>
                    {/if}
                </h2>

                <!-- Pinboard Cork Grid scrollable container -->
                <div class="grid grid-cols-2 gap-3 max-h-[460px] overflow-y-auto p-2 bg-[#1b1715] border border-zinc-950 rounded-lg shadow-inner flex-grow">
                    {#each fbiProfiles as p, i}
                        <!-- Polaroid Card -->
                        <!-- svelte-ignore a11y_click_events_have_key_events -->
                        <!-- svelte-ignore a11y_no_static_element_interactions -->
                        <div 
                            class="polaroid bg-[#eae6df] border-4 border-white shadow-lg p-2 flex flex-col cursor-pointer transition-all relative text-black"
                            style="transform: rotate({((i % 3) - 1) * 2}deg)"
                            onclick={() => selectedProfile = p}
                        >
                            <!-- Dossier Pin tape -->
                            <div class="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-3.5 bg-yellow-500/30 rotate-3 border-y border-yellow-500/10"></div>
                            
                            <div class="w-full aspect-[4/3] bg-zinc-950 overflow-hidden mb-2 relative border border-black/10">
                                <img src={p.images[0].original} alt={p.title} class="w-full h-full object-cover grayscale contrast-125" />
                                <div class="absolute inset-0 bg-yellow-950/10 mix-blend-color-burn"></div>
                            </div>
                            <div class="font-mono text-[9px] tracking-tight uppercase font-bold text-red-700 truncate">{p.title}</div>
                            <div class="font-serif italic text-[8px] text-zinc-600 truncate">{p.description}</div>
                        </div>
                    {/each}
                </div>
            </div>
        </section>

        <!-- Right: Bodycam Simulated Player & Case files details (Col 3) -->
        <section class="xl:col-span-3 flex flex-col gap-4">
            <!-- Simulated Bodycam Player -->
            <div class="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col">
                <h2 class="text-sm font-bold text-white tracking-widest uppercase mb-3 flex items-center justify-between">
                    <span>📹 BODYCAM LIVE FEED</span>
                    <span class="text-[9px] font-mono bg-red-600 px-1 py-0.5 rounded text-white animate-pulse">REC</span>
                </h2>
                
                <div class="relative w-full aspect-video bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800">
                    <canvas bind:this={canvasEl} class="w-full h-full block" width="320" height="180"></canvas>
                    
                    <!-- HUD overlays -->
                    <div class="absolute top-2 left-2 text-[8px] font-mono text-emerald-400 select-none pointer-events-none flex flex-col leading-tight">
                        <span>AXON BODY 3</span>
                        <span>UNIT: R-12</span>
                        <span>VOLT: 89%</span>
                    </div>
                    <div class="absolute top-2 right-2 text-[8px] font-mono text-emerald-400 select-none pointer-events-none">
                        {bodycamTime}
                    </div>
                    <div class="absolute bottom-2 left-2 text-[8px] font-mono text-emerald-400 select-none pointer-events-none">
                        ISO 1600 | 24FPS
                    </div>
                </div>
            </div>

            <!-- Profile Details File Drawer -->
            <div class="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex-grow flex flex-col">
                <h2 class="text-sm font-bold text-white tracking-widest uppercase mb-2 flex items-center gap-2">
                    <Info size={14} class="text-cyan-400" /> DOSSIER DOS-404
                </h2>
                <div class="bg-zinc-950/60 border border-zinc-800 rounded-lg p-3 text-xs leading-relaxed font-sans flex-grow overflow-y-auto">
                    {#if selectedProfile}
                        <h3 class="text-red-500 font-mono font-bold tracking-wider mb-1 uppercase">{selectedProfile.title}</h3>
                        <p class="text-zinc-300 font-serif italic mb-2">"{selectedProfile.description}"</p>
                        <hr class="border-zinc-800 my-2" />
                        <span class="text-zinc-500 font-mono block text-[10px]">ANALYSIS / EVIDENCE:</span>
                        <p class="text-zinc-400 text-[11px] leading-relaxed mt-1 font-mono">{selectedProfile.details}</p>
                    {:else}
                        <div class="h-full flex items-center justify-center flex-col text-center text-zinc-500 py-6">
                            <span class="text-xl mb-1">📂</span>
                            <span>SELECT A DOSSIER FROM THE INVESTIGATOR PINBOARD TO OPEN</span>
                        </div>
                    {/if}
                </div>
            </div>
        </section>

    </main>
</div>

<style lang="scss">
  .missing-creatures-app {
    box-sizing: border-box;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  .polaroid {
    &:hover {
      transform: scale(1.03) rotate(0deg) !important;
      z-index: 10;
    }
  }

  .bg-red-650 {
    background: rgba(239, 68, 68, 0.15);
  }
</style>
