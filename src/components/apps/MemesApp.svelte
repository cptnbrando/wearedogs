<script>
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import BaseApp from "./BaseApp.svelte";
    import {
        Download,
        Upload,
        RefreshCw,
        Sparkles,
        Smile,
        UserMinus,
        UserPlus,
    } from "lucide-svelte";

    let canvasEl = $state(null);
    let ctx;
    let templateImg = null;

    let activeTab = $state("generator"); // 'generator' | 'browse'

    const BROWSE_MEMES = [
        {
            title: "Overthinking Dog",
            description:
                "When they ask who's a good boy but never define the parameters of goodness.",
            url: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&q=80",
        },
        {
            title: "Executive Decision",
            description:
                "Dressed for success, ready to bark at the board of directors.",
            url: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&q=80",
        },
        {
            title: "Distracted Puppy",
            description:
                "Me looking at another dog walking past while walking with my owner.",
            url: "https://images.unsplash.com/photo-1537151608828-ea2b117b6f86?w=600&q=80",
        },
        {
            title: "Existential Golden",
            description: "We fetch the ball, but does the ball ever fetch us?",
            url: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&q=80",
        },
        {
            title: "Tech Support Shiba",
            description: "Have you tried booping the snout and restarting?",
            url: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=300&q=80",
        },
        {
            title: "Dramatic Husky",
            description: "When the food bowl is only 90% full.",
            url: "https://images.unsplash.com/photo-1531804055935-76f44d7c3621?w=600&q=80",
        },
    ];

    async function downloadMemeUrl(url, filename) {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (err) {
            window.open(url, "_blank");
        }
    }

    // Meme Texts
    let exFriendName = $state("MUDASIR");
    let newFriendName = $state("SALMAN");
    let mainYourName = $state("ASIF");

    // Position & Scale states
    let exX = $state(200);
    let exY = $state(430);
    let exScale = $state(0.85);

    let newX = $state(730);
    let newY = $state(430);
    let newScale = $state(0.85);

    // Image Elements
    let exFriendImgEl = null;
    let newFriendImgEl = null;

    const dogPresets = [
        {
            name: "Cheems",
            url: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=300&q=80",
        },
        {
            name: "Doge",
            url: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300&q=80",
        },
        {
            name: "Siberian Husky",
            url: "https://images.unsplash.com/photo-1531804055935-76f44d7c3621?w=300&q=80",
        },
    ];

    onMount(() => {
        // Load the background template image
        templateImg = new Image();
        templateImg.src = "/memes/template/friendship.png";
        templateImg.onload = () => {
            if (canvasEl) {
                canvasEl.width = templateImg.naturalWidth || 1000;
                canvasEl.height = templateImg.naturalHeight || 750;
                ctx = canvasEl.getContext("2d");
                redraw();
            }
        };
    });

    // Helper to trigger redraw whenever input values change
    $effect(() => {
        // Track states reactively
        const _1 = exFriendName;
        const _2 = newFriendName;
        const _3 = mainYourName;
        const _4 = exX;
        const _5 = exY;
        const _6 = exScale;
        const _7 = newX;
        const _8 = newY;
        const _9 = newScale;
        redraw();
    });

    function redraw() {
        if (!ctx || !canvasEl || !templateImg) return;

        const w = canvasEl.width;
        const h = canvasEl.height;

        // 1. Draw Template Background
        ctx.drawImage(templateImg, 0, 0, w, h);

        // 2. Draw Ex-Friend image (Bottom-Left)
        if (exFriendImgEl) {
            ctx.save();
            const iw = exFriendImgEl.width * exScale;
            const ih = exFriendImgEl.height * exScale;
            // Draw centered at exX, exY
            ctx.translate(exX, exY);
            ctx.drawImage(exFriendImgEl, -iw / 2, -ih / 2, iw, ih);

            // Draw Ex-Friend Red X
            ctx.strokeStyle = "#ef4444";
            ctx.lineWidth = 14;
            ctx.beginPath();
            ctx.moveTo(-iw / 2 + 10, -ih / 2 + 10);
            ctx.lineTo(iw / 2 - 10, ih / 2 - 10);
            ctx.moveTo(iw / 2 - 10, -ih / 2 + 10);
            ctx.lineTo(-iw / 2 + 10, ih / 2 - 10);
            ctx.stroke();
            ctx.restore();
        }

        // 3. Draw New Best Friend image (Bottom-Right)
        if (newFriendImgEl) {
            ctx.save();
            const iw = newFriendImgEl.width * newScale;
            const ih = newFriendImgEl.height * newScale;
            ctx.translate(newX, newY);
            ctx.drawImage(newFriendImgEl, -iw / 2, -ih / 2, iw, ih);
            ctx.restore();
        }

        // 4. Draw Custom Retro Word Art Text Overlay
        // Top: Friendship ended with [Ex-Friend]
        drawWordArt(
            `Friendship ended with ${exFriendName}`,
            w / 2,
            70,
            "#ef4444",
            "#ffffff",
            "50px",
        );

        // Center labels/hands
        drawWordArt(
            `${mainYourName} + ${newFriendName}`,
            w / 2,
            190,
            "#eab308",
            "#000000",
            "42px",
        );

        // Bottom: Now [New Friend] is my best friend
        drawWordArt(
            `Now ${newFriendName} is my best friend`,
            w / 2,
            h - 80,
            "#22c55e",
            "#ffffff",
            "55px",
        );
    }

    function drawWordArt(text, x, y, fillColor, strokeColor, fontSize) {
        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `bold ${fontSize} "Impact", "Comic Sans MS", sans-serif`;

        // Shadow/Outline
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 8;
        ctx.strokeText(text, x, y);

        // Fill
        ctx.fillStyle = fillColor;
        ctx.fillText(text, x, y);
        ctx.restore();
    }

    // Handlers for file loading
    function handleExFriendUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                exFriendImgEl = img;
                redraw();
            };
        };
        reader.readAsDataURL(file);
    }

    function handleNewFriendUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                newFriendImgEl = img;
                redraw();
            };
        };
        reader.readAsDataURL(file);
    }

    // Apply dog presets
    function applyExPreset(url) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = url;
        img.onload = () => {
            exFriendImgEl = img;
            redraw();
        };
    }

    function applyNewPreset(url) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = url;
        img.onload = () => {
            newFriendImgEl = img;
            redraw();
        };
    }

    function downloadMeme() {
        if (!canvasEl) return;
        const link = document.createElement("a");
        link.download = `friendship_ended_with_${exFriendName.toLowerCase()}.png`;
        link.href = canvasEl.toDataURL("image/png");
        link.click();
    }

    function resetMeme() {
        exFriendName = "MUDASIR";
        newFriendName = "SALMAN";
        mainYourName = "ASIF";
        exX = 200;
        exY = 430;
        exScale = 0.85;
        newX = 730;
        newY = 430;
        newScale = 0.85;
        exFriendImgEl = null;
        newFriendImgEl = null;
        redraw();
    }
</script>

<div
    class="memes-app flex flex-col h-full bg-zinc-950 text-zinc-100 font-mono overflow-hidden"
>
    <!-- Header -->
    <header
        class="border-b border-zinc-800 bg-zinc-900/50 p-4 flex items-center justify-between gap-3"
    >
        <!-- Left: Reset Template button -->
        <div>
            {#if activeTab === "generator"}
                <button
                    onclick={resetMeme}
                    class="flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded text-xs transition-all"
                >
                    <RefreshCw size={13} /> Reset Template
                </button>
            {/if}
        </div>

        <!-- Right: Tab selector buttons -->
        <div
            class="flex bg-black/40 border border-zinc-850 p-1 rounded-lg gap-1"
        >
            <button
                class="px-3 py-1.5 rounded-md text-xs font-bold transition-all"
                class:bg-zinc-800={activeTab === "generator"}
                class:text-white={activeTab === "generator"}
                class:text-zinc-400={activeTab !== "generator"}
                onclick={() => (activeTab = "generator")}
            >
                🎨 MEME GENERATOR
            </button>
            <button
                class="px-3 py-1.5 rounded-md text-xs font-bold transition-all"
                class:bg-zinc-800={activeTab === "browse"}
                class:text-white={activeTab === "browse"}
                class:text-zinc-400={activeTab !== "browse"}
                onclick={() => (activeTab = "browse")}
            >
                🖼️ BROWSE MEMES
            </button>
        </div>
    </header>

    <div class="relative flex-grow min-h-0">
        {#if activeTab === "generator"}
            <!-- Main Workspace -->
            <div
                transition:fade={{ duration: 150 }}
                class="absolute inset-0 p-4 grid grid-cols-1 xl:grid-cols-12 gap-6 overflow-y-auto"
            >
                <!-- Left panel: Controls (Col 5) -->
                <section class="xl:col-span-5 flex flex-col gap-4">
                    <!-- Text Overlays Card -->
                    <div
                        class="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3"
                    >
                        <h2
                            class="text-xs font-bold text-white uppercase tracking-widest border-b border-zinc-800 pb-1.5 flex items-center gap-2"
                        >
                            <Smile size={14} class="text-[#ff55bb]" /> Word Art Captioning
                        </h2>

                        <div class="flex flex-col gap-2">
                            <label
                                class="text-[10px] text-zinc-500 font-bold"
                                for="ex-friend-name">EX-FRIEND NAME</label
                            >
                            <input
                                id="ex-friend-name"
                                type="text"
                                bind:value={exFriendName}
                                class="bg-zinc-950 border border-zinc-800 px-3 py-2 rounded text-xs focus:border-[#ff55bb] focus:outline-none"
                            />
                        </div>

                        <div class="flex flex-col gap-2">
                            <label
                                class="text-[10px] text-zinc-500 font-bold"
                                for="new-friend-name"
                                >NEW BEST FRIEND NAME</label
                            >
                            <input
                                id="new-friend-name"
                                type="text"
                                bind:value={newFriendName}
                                class="bg-zinc-950 border border-zinc-800 px-3 py-2 rounded text-xs focus:border-emerald-500 focus:outline-none"
                            />
                        </div>

                        <div class="flex flex-col gap-2">
                            <label
                                class="text-[10px] text-zinc-500 font-bold"
                                for="your-name">YOUR NAME</label
                            >
                            <input
                                id="your-name"
                                type="text"
                                bind:value={mainYourName}
                                class="bg-zinc-950 border border-zinc-800 px-3 py-2 rounded text-xs focus:border-yellow-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <!-- Ex-Friend Setup Card -->
                    <div
                        class="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3"
                    >
                        <h2
                            class="text-xs font-bold text-white uppercase tracking-widest border-b border-zinc-800 pb-1.5 flex items-center gap-2"
                        >
                            <UserMinus size={14} class="text-red-500" /> Ex-Friend
                            Photo Placement
                        </h2>

                        <div class="flex gap-2">
                            <label
                                class="flex-1 flex flex-col items-center justify-center border border-dashed border-zinc-850 hover:border-zinc-700 bg-zinc-950/60 p-4 rounded-lg cursor-pointer text-center text-xs gap-1.5 transition-all"
                            >
                                <Upload size={16} class="text-zinc-500" />
                                <span class="text-[10px]">Upload Photo</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onchange={handleExFriendUpload}
                                    class="hidden"
                                />
                            </label>

                            <div class="flex-1 flex flex-col gap-1.5">
                                <span class="text-[9px] text-zinc-500 font-bold"
                                    >DOG PRESETS</span
                                >
                                <div class="flex flex-col gap-1">
                                    {#each dogPresets as preset}
                                        <button
                                            class="text-[10px] text-left hover:text-white px-2 py-1 bg-zinc-950 border border-zinc-850 rounded hover:border-zinc-700 transition-all"
                                            onclick={() =>
                                                applyExPreset(preset.url)}
                                        >
                                            🐶 {preset.name}
                                        </button>
                                    {/each}
                                </div>
                            </div>
                        </div>

                        <!-- Positioning controls -->
                        <div
                            class="flex flex-col gap-2 mt-2 pt-2 border-t border-zinc-800/40"
                        >
                            <div
                                class="flex justify-between text-[9px] text-zinc-500"
                            >
                                <span>POSITION X: {exX}px</span>
                                <span>POSITION Y: {exY}px</span>
                            </div>
                            <div class="grid grid-cols-2 gap-2">
                                <input
                                    type="range"
                                    min="0"
                                    max="1000"
                                    bind:value={exX}
                                    class="w-full accent-[#ff55bb]"
                                />
                                <input
                                    type="range"
                                    min="0"
                                    max="750"
                                    bind:value={exY}
                                    class="w-full accent-[#ff55bb]"
                                />
                            </div>
                            <div
                                class="flex justify-between text-[9px] text-zinc-500 mt-1"
                            >
                                <span>SCALE: {exScale.toFixed(2)}x</span>
                            </div>
                            <input
                                type="range"
                                min="0.1"
                                max="3"
                                step="0.05"
                                bind:value={exScale}
                                class="w-full accent-[#ff55bb]"
                            />
                        </div>
                    </div>

                    <!-- New Friend Setup Card -->
                    <div
                        class="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3"
                    >
                        <h2
                            class="text-xs font-bold text-white uppercase tracking-widest border-b border-zinc-800 pb-1.5 flex items-center gap-2"
                        >
                            <UserPlus size={14} class="text-emerald-500" /> New Best
                            Friend Photo Placement
                        </h2>

                        <div class="flex gap-2">
                            <label
                                class="flex-1 flex flex-col items-center justify-center border border-dashed border-zinc-850 hover:border-zinc-700 bg-zinc-950/60 p-4 rounded-lg cursor-pointer text-center text-xs gap-1.5 transition-all"
                            >
                                <Upload size={16} class="text-zinc-500" />
                                <span class="text-[10px]">Upload Photo</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onchange={handleNewFriendUpload}
                                    class="hidden"
                                />
                            </label>

                            <div class="flex-1 flex flex-col gap-1.5">
                                <span class="text-[9px] text-zinc-500 font-bold"
                                    >DOG PRESETS</span
                                >
                                <div class="flex flex-col gap-1">
                                    {#each dogPresets as preset}
                                        <button
                                            class="text-[10px] text-left hover:text-white px-2 py-1 bg-zinc-950 border border-zinc-850 rounded hover:border-zinc-700 transition-all"
                                            onclick={() =>
                                                applyNewPreset(preset.url)}
                                        >
                                            🐶 {preset.name}
                                        </button>
                                    {/each}
                                </div>
                            </div>
                        </div>

                        <!-- Positioning controls -->
                        <div
                            class="flex flex-col gap-2 mt-2 pt-2 border-t border-zinc-800/40"
                        >
                            <div
                                class="flex justify-between text-[9px] text-zinc-500"
                            >
                                <span>POSITION X: {newX}px</span>
                                <span>POSITION Y: {newY}px</span>
                            </div>
                            <div class="grid grid-cols-2 gap-2">
                                <input
                                    type="range"
                                    min="0"
                                    max="1000"
                                    bind:value={newX}
                                    class="w-full accent-emerald-500"
                                />
                                <input
                                    type="range"
                                    min="0"
                                    max="750"
                                    bind:value={newY}
                                    class="w-full accent-emerald-500"
                                />
                            </div>
                            <div
                                class="flex justify-between text-[9px] text-zinc-500 mt-1"
                            >
                                <span>SCALE: {newScale.toFixed(2)}x</span>
                            </div>
                            <input
                                type="range"
                                min="0.1"
                                max="3"
                                step="0.05"
                                bind:value={newScale}
                                class="w-full accent-emerald-500"
                            />
                        </div>
                    </div>
                </section>

                <!-- Right panel: Interactive Canvas Show (Col 7) -->
                <section
                    class="xl:col-span-7 flex flex-col gap-4 justify-between"
                >
                    <div
                        class="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col items-center justify-center flex-grow relative min-h-[300px]"
                    >
                        <span
                            class="text-[10px] text-zinc-500 font-bold tracking-widest absolute top-3 left-4"
                            >CANVAS WORKSPACE</span
                        >

                        <!-- Scaling display container to fit parent screen widths -->
                        <div
                            class="w-full max-w-full overflow-hidden flex justify-center items-center p-2 rounded border border-zinc-950 bg-black/60 shadow-inner"
                        >
                            <canvas
                                bind:this={canvasEl}
                                class="max-w-full h-auto block rounded border border-zinc-800"
                            ></canvas>
                        </div>
                    </div>

                    <!-- Download Button deck -->
                    <button
                        onclick={downloadMeme}
                        class="w-full py-4 bg-gradient-to-r from-[#ff55bb] to-purple-600 hover:from-[#ff66cc] hover:to-purple-500 text-white font-extrabold rounded-xl text-sm tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-950/20"
                    >
                        <Download size={16} /> GENERATE & DOWNLOAD MEME
                    </button>
                </section>
            </div>
        {:else if activeTab === "browse"}
            <!-- Browse gallery grid of memes -->
            <div
                transition:fade={{ duration: 150 }}
                class="absolute inset-0 p-6 overflow-y-auto"
            >
                <div
                    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {#each BROWSE_MEMES as meme}
                        <div
                            class="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden shadow-lg hover:border-zinc-700 transition-all flex flex-col"
                        >
                            <div
                                class="aspect-video relative overflow-hidden group bg-black/45"
                            >
                                <img
                                    src={meme.url}
                                    alt={meme.title}
                                    class="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                                />
                            </div>
                            <div
                                class="p-4 flex flex-col flex-grow justify-between gap-3 bg-zinc-900/40"
                            >
                                <div>
                                    <h3
                                        class="text-xs font-bold text-white tracking-wide"
                                    >
                                        {meme.title}
                                    </h3>
                                    <p
                                        class="text-[10px] text-zinc-400 mt-1 leading-relaxed font-sans"
                                    >
                                        {meme.description}
                                    </p>
                                </div>
                                <button
                                    onclick={() =>
                                        downloadMemeUrl(
                                            meme.url,
                                            `${meme.title.toLowerCase().replace(/ /g, "_")}.jpg`,
                                        )}
                                    class="w-full py-2 bg-zinc-850 hover:bg-zinc-800 text-zinc-300 hover:text-white font-bold rounded-lg text-[10px] tracking-wider transition-colors flex items-center justify-center gap-1 border border-zinc-800"
                                >
                                    <Download size={12} /> DOWNLOAD IMAGE
                                </button>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
    .memes-app {
        box-sizing: border-box;
    }
    .memes-app::-webkit-scrollbar {
        display: none;
    }
</style>
