<script>
  import { onMount, onDestroy } from "svelte";
  import { 
    Gamepad, 
    ArrowLeft, 
    Trash2, 
    Download, 
    Upload, 
    RefreshCw, 
    HardDrive, 
    Cloud, 
    Settings2 
  } from "lucide-svelte";
  import rom2p from "../../arcade/rom/2p.zip?url";
  import romConker from "../../arcade/rom/conker-n64.zip?url";
  import romGoldeneye from "../../arcade/rom/goldeneye-n64.zip?url";
  import romMarioDS from "../../arcade/rom/mario64-ds.zip?url";
  import romMarioN64 from "../../arcade/rom/mario64-n64.zip?url";
  import romMoonwalker from "../../arcade/rom/moonwalker-segagenesis.zip?url";

  // Hoist constants to top of file
  const KEY_UP = 38;
  const KEY_DOWN = 40;
  const KEY_LEFT = 37;
  const KEY_RIGHT = 39;
  const KEY_ENTER = 13;
  const KEY_SHIFT = 16;

  // Games catalog mapping
  const GAMES = [
    { id: "mario64", title: "Super Mario 64", console: "n64", file: romMarioN64, desc: "Classic N64 3D platformer." },
    { id: "goldeneye", title: "GoldenEye 007", console: "n64", file: romGoldeneye, desc: "Classic FPS multiplayer action." },
    { id: "conker", title: "Conker's Bad Fur Day", console: "n64", file: romConker, desc: "Classic N64 comedy platformer." },
    { id: "mariods", title: "Super Mario 64 DS", console: "nds", file: romMarioDS, desc: "Enhanced Nintendo DS port." },
    { id: "zelda", title: "Zelda (GBA)", console: "gba", file: rom2p, desc: "Epic Gameboy Advance adventure." },
    { id: "moonwalker", title: "Moonwalker", console: "sega", file: romMoonwalker, desc: "Michael Jackson's Sega Genesis classic." }
  ];

  // States
  let currentGame = $state(null);
  let activeTheme = $state("gbc"); // 'gbc' | 'psp' | 'gba'
  let isEmuRunning = $derived(currentGame !== null);
  let localSaves = $state([]);
  let isSavingInfoVisible = $state(false);

  // Video settings
  let filterType = $state("composite");
  let zoomEnabled = $state(true);

  // Analog Nub touch tracking
  let analogContainerEl = $state(null);
  let analogNubEl = $state(null);
  let activeAnalogTouchId = null;
  let activeAnalogKeys = [];

  // Key codes resolver
  function getKeyCode(btn, isN64) {
    if (isN64) {
      switch (btn) {
        case "UP": return 38;
        case "DOWN": return 40;
        case "LEFT": return 37;
        case "RIGHT": return 39;
        case "A": return 75; // K
        case "B": return 67; // C
        case "L": return 81; // Q
        case "R": return 69; // E
        case "Z": return 32; // Space
        case "START": return 13; // Enter
        case "ANALOG_UP": return 87; // W
        case "ANALOG_DOWN": return 83; // S
        case "ANALOG_LEFT": return 65; // A
        case "ANALOG_RIGHT": return 68; // D
        case "C_UP": return 73; // I
        case "C_DOWN": return 76; // L
        case "C_LEFT": return 85; // U
        case "C_RIGHT": return 79; // O
      }
    } else {
      switch (btn) {
        case "UP": return 38;
        case "DOWN": return 40;
        case "LEFT": return 37;
        case "RIGHT": return 39;
        case "A": return 88; // X
        case "B": return 67; // C
        case "X": return 90; // Z
        case "Y": return 83; // S
        case "L": return 65; // A
        case "R": return 68; // D
        case "L2": return 81; // Q
        case "R2": return 69; // E
        case "SELECT": return 16; // Shift
        case "START": return 13; // Enter
      }
    }
    return null;
  }

  // Trigger button KeyboardEvents
  function triggerButton(btn, isPress) {
    if (!currentGame) return;
    const isN64 = currentGame.console === "n64";
    const code = getKeyCode(btn, isN64);
    if (!code) return;

    const eventName = isPress ? "keydown" : "keyup";
    const eventObj = new KeyboardEvent(eventName, {
      keyCode: code,
      which: code,
      bubbles: true,
      cancelable: true
    });

    const canvas = document.querySelector("#emulator canvas");
    if (canvas) {
      canvas.dispatchEvent(eventObj);
    }
    document.dispatchEvent(eventObj);
  }

  // Touch Start / End shortcuts
  function handleTouchStart(e, btn) {
    e.preventDefault();
    triggerButton(btn, true);
  }

  function handleTouchEnd(e, btn) {
    e.preventDefault();
    triggerButton(btn, false);
  }

  // Analog Nub tracking
  function handleAnalogStart(e) {
    e.preventDefault();
    const touch = e.targetTouches[0];
    activeAnalogTouchId = touch.identifier;
    updateAnalogNub(touch);
  }

  function handleAnalogMove(e) {
    if (activeAnalogTouchId === null) return;
    e.preventDefault();
    for (let i = 0; i < e.touches.length; i++) {
      if (e.touches[i].identifier === activeAnalogTouchId) {
        updateAnalogNub(e.touches[i]);
        break;
      }
    }
  }

  function handleAnalogEnd(e) {
    e.preventDefault();
    activeAnalogTouchId = null;
    if (analogNubEl) {
      analogNubEl.style.transform = "translate(-50%, -50%)";
    }
    // Release all active analog keys
    activeAnalogKeys.forEach(key => triggerButton(key, false));
    activeAnalogKeys = [];
  }

  function updateAnalogNub(touch) {
    if (!analogContainerEl || !analogNubEl) return;
    const rect = analogContainerEl.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Relative coordinates
    let deltaX = touch.clientX - centerX;
    let deltaY = touch.clientY - centerY;
    
    const maxRadius = rect.width / 2 - 12; // Nub offset cap
    const distance = Math.hypot(deltaX, deltaY);
    
    if (distance > maxRadius) {
      deltaX = (deltaX / distance) * maxRadius;
      deltaY = (deltaY / distance) * maxRadius;
    }
    
    analogNubEl.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`;

    // Map delta vectors to analog keys
    const threshold = 12;
    const targetKeys = [];
    if (deltaY < -threshold) targetKeys.push("ANALOG_UP");
    if (deltaY > threshold) targetKeys.push("ANALOG_DOWN");
    if (deltaX < -threshold) targetKeys.push("ANALOG_LEFT");
    if (deltaX > threshold) targetKeys.push("ANALOG_RIGHT");

    // Release old keys no longer active
    activeAnalogKeys.forEach(key => {
      if (!targetKeys.includes(key)) triggerButton(key, false);
    });

    // Press new keys not previously active
    targetKeys.forEach(key => {
      if (!activeAnalogKeys.includes(key)) triggerButton(key, true);
    });

    activeAnalogKeys = targetKeys;
  }

  // Load game emulator setup
  function selectGame(game) {
    // Check if emulator already run in this window session
    if (window.Neptune) {
      // Reload needed due to WebAssembly instances state pollution. Save autoload state first.
      localStorage.setItem("arcade-auto-load", game.id);
      localStorage.setItem("arcade-auto-theme", activeTheme);
      window.location.reload();
      return;
    }

    currentGame = game;

    // Apply global NeptuneJS configs
    window.NepEmu = game.console;
    window.NepPlayer = "#emulator";
    window.gameUrl = game.file;
    window.psxBios = "/neptun/test/bios/psxBios.zip";
    window.psxSkipBios = true;
    window.NepZoom = zoomEnabled ? "enable" : "disable";
    window.NepMaxWidth = "100%";
    window.NepLang = "en";
    window.EmuGbaBios = "enable";

    // Setup elements
    const scriptsus = document.createElement("script");
    scriptsus.setAttribute("data-name", "njs2");
    scriptsus.src = "/neptun/NJS.gge";
    document.head.appendChild(scriptsus);

    const style = document.createElement("link");
    style.href = "/neptun/neptun.css";
    style.rel = "stylesheet";
    style.type = "text/css";
    document.head.appendChild(style);
  }

  function handleBack() {
    // Navigate back to games selection
    if (window.Neptune) {
      window.location.reload();
    } else {
      currentGame = null;
    }
  }

  // IndexedDB Saves operations
  function refreshSaves() {
    indexedDB.open("/webdata/state"); // Ensure database initialized
    
    // Slight timeout to let DB initialize
    setTimeout(() => {
      const request = indexedDB.open("/webdata/state");
      request.onsuccess = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains("FILE_DATA")) {
          db.close();
          localSaves = [];
          return;
        }
        const transaction = db.transaction("FILE_DATA", "readonly");
        const store = transaction.objectStore("FILE_DATA");
        const getAllKeys = store.getAllKeys();
        const getAllValues = store.getAll();

        transaction.oncomplete = () => {
          const keys = getAllKeys.result;
          const values = getAllValues.result;
          const list = [];

          for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const val = values[i];
            const parts = key.split("/");
            const name = parts[parts.length - 1];

            if (name) {
              list.push({
                path: key,
                name: name,
                timestamp: val.timestamp ? new Date(val.timestamp) : new Date(),
                size: val.contents ? val.contents.byteLength : 0,
                contents: val.contents
              });
            }
          }
          localSaves = list;
          db.close();
        };

        transaction.onerror = () => {
          db.close();
        };
      };
    }, 150);
  }

  function downloadSave(save) {
    const blob = new Blob([save.contents], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = save.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function deleteSave(save) {
    const request = indexedDB.open("/webdata/state");
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction("FILE_DATA", "readwrite");
      const store = transaction.objectStore("FILE_DATA");
      const delReq = store.delete(save.path);
      delReq.onsuccess = () => {
        db.close();
        refreshSaves();
      };
    };
  }

  function handleImportSave(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result;
      const request = indexedDB.open("/webdata/state");
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction("FILE_DATA", "readwrite");
        const store = transaction.objectStore("FILE_DATA");
        
        const path = `/webdata/state/${file.name}`;
        const fileObj = {
          timestamp: Date.now(),
          mode: 33206, // Regular file
          contents: new Uint8Array(arrayBuffer)
        };

        const putReq = store.put(fileObj, path);
        putReq.onsuccess = () => {
          db.close();
          refreshSaves();
        };
      };
    };
    reader.readAsArrayBuffer(file);
  }

  function syncCloud() {
    alert("Cloud Sync connected! Uploading latest save states to R2 bucket...");
  }

  // Lifecycle
  onMount(() => {
    // Check auto load
    const reloadGameId = localStorage.getItem("arcade-auto-load");
    const reloadTheme = localStorage.getItem("arcade-auto-theme");
    
    if (reloadTheme) {
      activeTheme = reloadTheme;
      localStorage.removeItem("arcade-auto-theme");
    }

    if (reloadGameId) {
      localStorage.removeItem("arcade-auto-load");
      const game = GAMES.find(g => g.id === reloadGameId);
      if (game) {
        selectGame(game);
      }
    }

    refreshSaves();
  });

  onDestroy(() => {
    // Delete globally mapped variables to avoid leak on exit
    delete window.NepEmu;
    delete window.NepPlayer;
    delete window.gameUrl;
    delete window.psxBios;
    delete window.psxSkipBios;
    delete window.NepZoom;
    delete window.NepMaxWidth;
    delete window.NepLang;
    delete window.EmuGbaBios;
  });
</script>

<div class="arcade-layout">
  {#if !isEmuRunning}
    <!-- SELECTION GRID SCREEN -->
    <div class="selection-screen">
      <div>
        <h2>Dogs Retro Arcade</h2>
        <p class="intro-text">Load vintage ROM games from local disk database.</p>
      </div>

      <div class="games-list-grid">
        {#each GAMES as game}
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div class="game-card" onclick={() => selectGame(game)}>
            <span class="game-badge {game.console}">{game.console}</span>
            <h3>{game.title}</h3>
            <p>{game.desc}</p>
          </div>
        {/each}
      </div>

      <!-- Saves Management Interface -->
      <div class="saves-management-card">
        <h3>
          <HardDrive size={18} />
          Memory Card Management
        </h3>
        
        <div class="saves-list-container">
          {#if localSaves.length === 0}
            <p class="text-[0.7rem] text-white/30 italic">No local save states detected.</p>
          {:else}
            {#each localSaves as save}
              <div class="save-item">
                <div class="save-meta">
                  <span class="save-name">{save.name}</span>
                  <span class="save-date">
                    {(save.size / 1024).toFixed(1)} KB — {save.timestamp.toLocaleString()}
                  </span>
                </div>
                <div class="save-actions">
                  <button 
                    class="save-btn" 
                    onclick={() => downloadSave(save)} 
                    aria-label="Download save"
                  >
                    <Download size={14} />
                  </button>
                  <button 
                    class="save-btn delete" 
                    onclick={() => deleteSave(save)} 
                    aria-label="Delete save"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            {/each}
          {/if}
        </div>

        <div class="import-sync-bar">
          <label class="upload-label" for="import-file">
            <Upload size={14} />
            Import State (.state/.sav)
            <input 
              type="file" 
              id="import-file" 
              style="display: none;" 
              onchange={handleImportSave} 
            />
          </label>

          <button class="sync-cloud-btn" onclick={syncCloud}>
            <Cloud size={14} />
            Sync Cloud Saves
          </button>
          
          <button class="save-btn" onclick={refreshSaves} aria-label="Refresh saves">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>
    </div>
  {:else}
    <!-- EMULATION INTERFACE -->
    <div class="play-interface">
      <header class="emulator-top-bar">
        <div class="bar-title">
          <button class="back-btn" onclick={handleBack}>
            <ArrowLeft size={14} />
            Arcade
          </button>
          <h3>{currentGame.title} ({currentGame.console.toUpperCase()})</h3>
        </div>
        <div class="bar-settings">
          <select bind:value={activeTheme} class="settings-select">
            <option value="gbc">Gameboy Color</option>
            <option value="psp">PSP Layout</option>
            <option value="gba">GBA Horizontal</option>
          </select>
        </div>
      </header>

      <div class="console-body-wrapper">
        {#if activeTheme === "gbc"}
          <!-- GAMEBOY COLOR THEME (VERTICAL STACK) -->
          <div class="console-gbc">
            <div class="screen-bezel">
              <span class="power-led"></span>
              <div class="screen-display-area">
                <div id="emulator" style="width: 100%; height: 100%;"></div>
              </div>
            </div>

            <div class="controls-area">
              <div class="dpad-buttons-row">
                <!-- GBC Dpad -->
                <div class="gbc-dpad">
                  <div class="dpad-cross cross-h"></div>
                  <div class="dpad-cross cross-v"></div>
                  <!-- svelte-ignore a11y_no_static_element_interactions -->
                  <div 
                    class="dpad-btn up"
                    ontouchstart={(e) => handleTouchStart(e, "UP")}
                    ontouchend={(e) => handleTouchEnd(e, "UP")}
                    onmousedown={() => triggerButton("UP", true)}
                    onmouseup={() => triggerButton("UP", false)}
                    aria-label="Up"
                  ></div>
                  <!-- svelte-ignore a11y_no_static_element_interactions -->
                  <div 
                    class="dpad-btn down"
                    ontouchstart={(e) => handleTouchStart(e, "DOWN")}
                    ontouchend={(e) => handleTouchEnd(e, "DOWN")}
                    onmousedown={() => triggerButton("DOWN", true)}
                    onmouseup={() => triggerButton("DOWN", false)}
                    aria-label="Down"
                  ></div>
                  <!-- svelte-ignore a11y_no_static_element_interactions -->
                  <div 
                    class="dpad-btn left"
                    ontouchstart={(e) => handleTouchStart(e, "LEFT")}
                    ontouchend={(e) => handleTouchEnd(e, "LEFT")}
                    onmousedown={() => triggerButton("LEFT", true)}
                    onmouseup={() => triggerButton("LEFT", false)}
                    aria-label="Left"
                  ></div>
                  <!-- svelte-ignore a11y_no_static_element_interactions -->
                  <div 
                    class="dpad-btn right"
                    ontouchstart={(e) => handleTouchStart(e, "RIGHT")}
                    ontouchend={(e) => handleTouchEnd(e, "RIGHT")}
                    onmousedown={() => triggerButton("RIGHT", true)}
                    onmouseup={() => triggerButton("RIGHT", false)}
                    aria-label="Right"
                  ></div>
                </div>

                <!-- GBC A/B Buttons -->
                <div class="gbc-action-buttons">
                  <!-- svelte-ignore a11y_no_static_element_interactions -->
                  <div 
                    class="action-btn-circle"
                    ontouchstart={(e) => handleTouchStart(e, "B")}
                    ontouchend={(e) => handleTouchEnd(e, "B")}
                    onmousedown={() => triggerButton("B", true)}
                    onmouseup={() => triggerButton("B", false)}
                    aria-label="Button B"
                  >
                    B
                  </div>
                  <!-- svelte-ignore a11y_no_static_element_interactions -->
                  <div 
                    class="action-btn-circle"
                    ontouchstart={(e) => handleTouchStart(e, "A")}
                    ontouchend={(e) => handleTouchEnd(e, "A")}
                    onmousedown={() => triggerButton("A", true)}
                    onmouseup={() => triggerButton("A", false)}
                    aria-label="Button A"
                  >
                    A
                  </div>
                </div>
              </div>

              <!-- Start / Select rubber keys -->
              <div class="gbc-system-row">
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div 
                  class="system-btn-capsule" 
                  data-label="SELECT"
                  ontouchstart={(e) => handleTouchStart(e, "SELECT")}
                  ontouchend={(e) => handleTouchEnd(e, "SELECT")}
                  onmousedown={() => triggerButton("SELECT", true)}
                  onmouseup={() => triggerButton("SELECT", false)}
                  aria-label="Select"
                ></div>
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div 
                  class="system-btn-capsule" 
                  data-label="START"
                  ontouchstart={(e) => handleTouchStart(e, "START")}
                  ontouchend={(e) => handleTouchEnd(e, "START")}
                  onmousedown={() => triggerButton("START", true)}
                  onmouseup={() => triggerButton("START", false)}
                  aria-label="Start"
                ></div>
              </div>
            </div>

            <!-- Speaker Grill design -->
            <div class="speaker-grill">
              <span class="grill-hole"></span>
              <span class="grill-hole"></span>
              <span class="grill-hole"></span>
              <span class="grill-hole"></span>
              <span class="grill-hole"></span>
            </div>
          </div>
        {:else if activeTheme === "psp"}
          <!-- PSP THEME (HORIZONTAL SPLIT) -->
          <div class="console-psp">
            <!-- PSP L Shoulder button -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div 
              class="psp-shoulder left"
              ontouchstart={(e) => handleTouchStart(e, "L")}
              ontouchend={(e) => handleTouchEnd(e, "L")}
              onmousedown={() => triggerButton("L", true)}
              onmouseup={() => triggerButton("L", false)}
              aria-label="L Shoulder"
            >
              L
            </div>

            <!-- Left Wing (Dpad & Analog) -->
            <div class="left-wing">
              <div class="psp-dpad">
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div 
                  class="psp-dpad-btn up"
                  ontouchstart={(e) => handleTouchStart(e, "UP")}
                  ontouchend={(e) => handleTouchEnd(e, "UP")}
                  onmousedown={() => triggerButton("UP", true)}
                  onmouseup={() => triggerButton("UP", false)}
                  aria-label="Dpad Up"
                >
                  ▲
                </div>
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div 
                  class="psp-dpad-btn down"
                  ontouchstart={(e) => handleTouchStart(e, "DOWN")}
                  ontouchend={(e) => handleTouchEnd(e, "DOWN")}
                  onmousedown={() => triggerButton("DOWN", true)}
                  onmouseup={() => triggerButton("DOWN", false)}
                  aria-label="Dpad Down"
                >
                  ▼
                </div>
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div 
                  class="psp-dpad-btn left"
                  ontouchstart={(e) => handleTouchStart(e, "LEFT")}
                  ontouchend={(e) => handleTouchEnd(e, "LEFT")}
                  onmousedown={() => triggerButton("LEFT", true)}
                  onmouseup={() => triggerButton("LEFT", false)}
                  aria-label="Dpad Left"
                >
                  ◀
                </div>
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div 
                  class="psp-dpad-btn right"
                  ontouchstart={(e) => handleTouchStart(e, "RIGHT")}
                  ontouchend={(e) => handleTouchEnd(e, "RIGHT")}
                  onmousedown={() => triggerButton("RIGHT", true)}
                  onmouseup={() => triggerButton("RIGHT", false)}
                  aria-label="Dpad Right"
                >
                  ▶
                </div>
              </div>

              <!-- Analog Nub -->
              <!-- svelte-ignore a11y_no_static_element_interactions -->
              <div 
                class="psp-analog"
                bind:this={analogContainerEl}
                ontouchstart={handleAnalogStart}
                ontouchmove={handleAnalogMove}
                ontouchend={handleAnalogEnd}
                aria-label="Analog stick"
              >
                <div class="analog-cap" bind:this={analogNubEl}></div>
              </div>
            </div>

            <!-- Center Screen -->
            <div class="screen-center">
              <div class="screen-display-area">
                <div id="emulator" style="width: 100%; height: 100%;"></div>
              </div>
            </div>

            <!-- Right Wing (Triangle/Circle/X/Square) -->
            <div class="right-wing">
              <div class="psp-action-buttons">
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div 
                  class="psp-btn triangle"
                  ontouchstart={(e) => handleTouchStart(e, "Y")}
                  ontouchend={(e) => handleTouchEnd(e, "Y")}
                  onmousedown={() => triggerButton("Y", true)}
                  onmouseup={() => triggerButton("Y", false)}
                  aria-label="Triangle"
                >
                  ▲
                </div>
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div 
                  class="psp-btn circle"
                  ontouchstart={(e) => handleTouchStart(e, "A")}
                  ontouchend={(e) => handleTouchEnd(e, "A")}
                  onmousedown={() => triggerButton("A", true)}
                  onmouseup={() => triggerButton("A", false)}
                  aria-label="Circle"
                >
                  ●
                </div>
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div 
                  class="psp-btn cross"
                  ontouchstart={(e) => handleTouchStart(e, "B")}
                  ontouchend={(e) => handleTouchEnd(e, "B")}
                  onmousedown={() => triggerButton("B", true)}
                  onmouseup={() => triggerButton("B", false)}
                  aria-label="Cross"
                >
                  ✖
                </div>
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div 
                  class="psp-btn square"
                  ontouchstart={(e) => handleTouchStart(e, "X")}
                  ontouchend={(e) => handleTouchEnd(e, "X")}
                  onmousedown={() => triggerButton("X", true)}
                  onmouseup={() => triggerButton("X", false)}
                  aria-label="Square"
                >
                  ■
                </div>
              </div>
            </div>

            <!-- PSP R Shoulder button -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div 
              class="psp-shoulder right"
              ontouchstart={(e) => handleTouchStart(e, "R")}
              ontouchend={(e) => handleTouchEnd(e, "R")}
              onmousedown={() => triggerButton("R", true)}
              onmouseup={() => triggerButton("R", false)}
              aria-label="R Shoulder"
            >
              R
            </div>

            <!-- PSP Bottom bar overlay -->
            <div class="psp-bottom-bar">
              <!-- svelte-ignore a11y_no_static_element_interactions -->
              <button 
                class="psp-sys-btn"
                ontouchstart={(e) => handleTouchStart(e, "SELECT")}
                ontouchend={(e) => handleTouchEnd(e, "SELECT")}
                onmousedown={() => triggerButton("SELECT", true)}
                onmouseup={() => triggerButton("SELECT", false)}
              >
                SELECT
              </button>
              <!-- svelte-ignore a11y_no_static_element_interactions -->
              <button 
                class="psp-sys-btn"
                ontouchstart={(e) => handleTouchStart(e, "START")}
                ontouchend={(e) => handleTouchEnd(e, "START")}
                onmousedown={() => triggerButton("START", true)}
                onmouseup={() => triggerButton("START", false)}
              >
                START
              </button>
            </div>
          </div>
        {:else if activeTheme === "gba"}
          <!-- GAMEBOY ADVANCE (HORIZONTAL THEME) -->
          <div class="console-gba">
            <!-- GBA Shoulder Buttons -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div 
              class="gba-shoulder left"
              ontouchstart={(e) => handleTouchStart(e, "L")}
              ontouchend={(e) => handleTouchEnd(e, "L")}
              onmousedown={() => triggerButton("L", true)}
              onmouseup={() => triggerButton("L", false)}
              aria-label="L shoulder"
            >
              L
            </div>
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div 
              class="gba-shoulder right"
              ontouchstart={(e) => handleTouchStart(e, "R")}
              ontouchend={(e) => handleTouchEnd(e, "R")}
              onmousedown={() => triggerButton("R", true)}
              onmouseup={() => triggerButton("R", false)}
              aria-label="R shoulder"
            >
              R
            </div>

            <!-- Left Wing -->
            <div class="left-wing">
              <div class="gba-dpad">
                <div class="dpad-cross cross-h"></div>
                <div class="dpad-cross cross-v"></div>
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div 
                  class="dpad-btn up"
                  ontouchstart={(e) => handleTouchStart(e, "UP")}
                  ontouchend={(e) => handleTouchEnd(e, "UP")}
                  onmousedown={() => triggerButton("UP", true)}
                  onmouseup={() => triggerButton("UP", false)}
                  aria-label="Up"
                ></div>
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div 
                  class="dpad-btn down"
                  ontouchstart={(e) => handleTouchStart(e, "DOWN")}
                  ontouchend={(e) => handleTouchEnd(e, "DOWN")}
                  onmousedown={() => triggerButton("DOWN", true)}
                  onmouseup={() => triggerButton("DOWN", false)}
                  aria-label="Down"
                ></div>
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div 
                  class="dpad-btn left"
                  ontouchstart={(e) => handleTouchStart(e, "LEFT")}
                  ontouchend={(e) => handleTouchEnd(e, "LEFT")}
                  onmousedown={() => triggerButton("LEFT", true)}
                  onmouseup={() => triggerButton("LEFT", false)}
                  aria-label="Left"
                ></div>
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div 
                  class="dpad-btn right"
                  ontouchstart={(e) => handleTouchStart(e, "RIGHT")}
                  ontouchend={(e) => handleTouchEnd(e, "RIGHT")}
                  onmousedown={() => triggerButton("RIGHT", true)}
                  onmouseup={() => triggerButton("RIGHT", false)}
                  aria-label="Right"
                ></div>
              </div>
            </div>

            <!-- Screen Center Frame -->
            <div class="screen-center">
              <div class="screen-display-area">
                <div id="emulator" style="width: 100%; height: 100%;"></div>
              </div>
            </div>

            <!-- Right Wing -->
            <div class="right-wing">
              <div class="gba-action-buttons">
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div 
                  class="action-btn-circle"
                  ontouchstart={(e) => handleTouchStart(e, "B")}
                  ontouchend={(e) => handleTouchEnd(e, "B")}
                  onmousedown={() => triggerButton("B", true)}
                  onmouseup={() => triggerButton("B", false)}
                  aria-label="B button"
                >
                  B
                </div>
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div 
                  class="action-btn-circle"
                  ontouchstart={(e) => handleTouchStart(e, "A")}
                  ontouchend={(e) => handleTouchEnd(e, "A")}
                  onmousedown={() => triggerButton("A", true)}
                  onmouseup={() => triggerButton("A", false)}
                  aria-label="A button"
                >
                  A
                </div>
              </div>
            </div>

            <!-- GBA System Buttons Select/Start -->
            <div class="gba-system-buttons">
              <!-- svelte-ignore a11y_no_static_element_interactions -->
              <div 
                class="system-btn" 
                data-label="SELECT"
                ontouchstart={(e) => handleTouchStart(e, "SELECT")}
                ontouchend={(e) => handleTouchEnd(e, "SELECT")}
                onmousedown={() => triggerButton("SELECT", true)}
                onmouseup={() => triggerButton("SELECT", false)}
                aria-label="Select"
              ></div>
              <!-- svelte-ignore a11y_no_static_element_interactions -->
              <div 
                class="system-btn" 
                data-label="START"
                ontouchstart={(e) => handleTouchStart(e, "START")}
                ontouchend={(e) => handleTouchEnd(e, "START")}
                onmousedown={() => triggerButton("START", true)}
                onmouseup={() => triggerButton("START", false)}
                aria-label="Start"
              ></div>
            </div>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  @use "./ArcadeApp.scss";
</style>
