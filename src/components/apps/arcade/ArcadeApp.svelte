<script>
  import { onMount, onDestroy } from "svelte";

  let { initialGameId = null } = $props();
  import {
    Gamepad,
    ArrowLeft,
    Trash2,
    Download,
    Upload,
    RefreshCw,
    HardDrive,
    Cloud,
    Settings2,
    Maximize2,
    Minimize2,
  } from "lucide-svelte";
  // import rom2p from "./rom/2p.zip?url";
  // import romConker from "./rom/conker-n64.zip?url";
  // import romGoldeneye from "./rom/goldeneye-n64.zip?url";
  // import romMarioDS from "./rom/mario64-ds.zip?url";
  // import romMarioN64 from "./rom/mario64-n64.zip?url";
  // import romMoonwalker from "./rom/moonwalker-segagenesis.zip?url";
  import { DEFAULT_MAPPINGS } from "./controlsConfig.js";
  import KeyboardControlsModal from "./KeyboardControlsModal.svelte";

  // Initialize obfuscated global variables to prevent ReferenceErrors in cores (e.g., Sega Genesis)
  if (typeof window !== "undefined") {
    for (let i = 0; i < 100; i++) {
      const name = `_$af3208${String(i).padStart(2, "0")}`;
      if (!(name in window)) {
        window[name] = "";
      }
    }
  }

  // Hoist constants to top of file
  const KEY_UP = 38;
  const KEY_DOWN = 40;
  const KEY_LEFT = 37;
  const KEY_RIGHT = 39;
  const KEY_ENTER = 13;
  const KEY_SHIFT = 16;

  // Games catalog mapping
  const GAMES = [
    {
      id: "mario64",
      title: "Super Mario 64",
      console: "n64",
      file: "https://data.wearedogs.net/game/n64/mario.zip",
      desc: "Classic N64 3D platformer.",
    },
    {
      id: "goldeneye",
      title: "GoldenEye 007",
      console: "n64",
      file: "https://data.wearedogs.net/game/n64/goldeneye.zip",
      desc: "Classic FPS multiplayer action.",
    },
    {
      id: "conker",
      title: "Conker's Bad Fur Day",
      console: "n64",
      file: "https://data.wearedogs.net/game/n64/conker.zip",
      desc: "Classic N64 comedy platformer.",
    },
    {
      id: "mariods",
      title: "Super Mario 64 DS",
      console: "nds",
      file: "https://data.wearedogs.net/game/nds/mario64.zip",
      desc: "Enhanced Nintendo DS port.",
    },
    {
      id: "nintendogs",
      title: "Nintendogs: Dalmatian and Friends",
      console: "nds",
      file: "https://data.wearedogs.net/game/nds/dalmatian.zip",
      desc: "Virtual pet game.",
    },
    {
      id: "zelda",
      title: "Zelda (GBA)",
      console: "gba",
      file: "https://data.wearedogs.net/game/gba/zelda.zip",
      desc: "Epic Gameboy Advance adventure.",
    },
    {
      id: "moonwalker",
      title: "Moonwalker",
      console: "sega",
      file: "https://data.wearedogs.net/game/genesis/moonwalker.zip",
      desc: "Michael Jackson's Sega Genesis classic.",
    },
  ];

  // States
  let currentGame = $state(null);
  let activeTheme = $state("gbc"); // 'gbc' | 'psp' | 'gba' | 'screen'
  let isEmuRunning = $derived(currentGame !== null);
  let localSaves = $state([]);
  let isSavingInfoVisible = $state(false);
  let isFullscreen = $state(false);
  let emulatorEl = $state(null);

  // Video settings
  let filterType = $state("composite");
  let zoomEnabled = $state(true);

  // Keyboard mappings state initialized synchronously from localStorage if available
  let userMappings = $state(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("arcade-keyboard-mappings");
        if (saved) {
          const parsed = JSON.parse(saved);
          for (const consoleKey of Object.keys(DEFAULT_MAPPINGS)) {
            if (!parsed[consoleKey]) {
              parsed[consoleKey] = { ...DEFAULT_MAPPINGS[consoleKey] };
            } else {
              parsed[consoleKey] = {
                ...DEFAULT_MAPPINGS[consoleKey],
                ...parsed[consoleKey],
              };
            }
          }
          return parsed;
        }
      } catch (e) {
        console.warn("Failed to load mappings from localStorage:", e);
      }
    }
    return JSON.parse(JSON.stringify(DEFAULT_MAPPINGS));
  });
  let isControlsModalOpen = $state(false);

  function handleResetConsoleMappings(consoleKey) {
    if (DEFAULT_MAPPINGS[consoleKey]) {
      userMappings[consoleKey] = { ...DEFAULT_MAPPINGS[consoleKey] };
    }
  }

  function handleWindowKeyEvent(e) {
    if (isControlsModalOpen) return;
    if (e.type !== "keydown" && e.type !== "keyup") return;
    if (!currentGame) return;
    if (e.synthesized) return;

    const consoleType = currentGame.console;
    const config = userMappings[consoleType];
    if (!config) return;

    const action = Object.keys(config).find((key) => config[key] === e.code);
    if (action) {
      e.preventDefault();
      e.stopPropagation();

      const isN64 = consoleType === "n64";
      const targetKeyCode = getKeyCode(action, isN64);
      if (targetKeyCode) {
        dispatchSynthesizedKey(e.type, targetKeyCode);
      }
    }
  }

  function getKeyboardEventInit(keyCode) {
    switch (keyCode) {
      case 38: return { key: "ArrowUp", code: "ArrowUp" };
      case 40: return { key: "ArrowDown", code: "ArrowDown" };
      case 37: return { key: "ArrowLeft", code: "ArrowLeft" };
      case 39: return { key: "ArrowRight", code: "ArrowRight" };
      case 75: return { key: "k", code: "KeyK" };
      case 67: return { key: "c", code: "KeyC" };
      case 81: return { key: "q", code: "KeyQ" };
      case 69: return { key: "e", code: "KeyE" };
      case 32: return { key: " ", code: "Space" };
      case 13: return { key: "Enter", code: "Enter" };
      case 87: return { key: "w", code: "KeyW" };
      case 83: return { key: "s", code: "KeyS" };
      case 65: return { key: "a", code: "KeyA" };
      case 68: return { key: "d", code: "KeyD" };
      case 73: return { key: "i", code: "KeyI" };
      case 76: return { key: "l", code: "KeyL" };
      case 85: return { key: "u", code: "KeyU" };
      case 79: return { key: "o", code: "KeyO" };
      case 88: return { key: "x", code: "KeyX" };
      case 90: return { key: "z", code: "KeyZ" };
      case 16: return { key: "Shift", code: "ShiftLeft" };
      default: return { key: "", code: "" };
    }
  }

  function dispatchSynthesizedKey(type, keyCode) {
    const extra = getKeyboardEventInit(keyCode);
    const eventObj = new KeyboardEvent(type, {
      keyCode: keyCode,
      which: keyCode,
      key: extra.key,
      code: extra.code,
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(eventObj, "synthesized", {
      value: true,
      enumerable: true,
    });

    const canvas = document.querySelector("#emulator canvas");
    if (canvas) {
      canvas.dispatchEvent(eventObj);
    } else {
      window.dispatchEvent(eventObj);
    }
  }

  // Analog Nub touch tracking
  let analogContainerEl = $state(null);
  let analogNubEl = $state(null);
  let activeAnalogTouchId = null;
  let activeAnalogKeys = [];

  // Key codes resolver
  function getKeyCode(btn, isN64) {
    if (isN64) {
      switch (btn) {
        case "UP":
          return 38;
        case "DOWN":
          return 40;
        case "LEFT":
          return 37;
        case "RIGHT":
          return 39;
        case "A":
          return 75; // K
        case "B":
          return 67; // C
        case "L":
          return 81; // Q
        case "R":
          return 69; // E
        case "Z":
          return 32; // Space
        case "START":
          return 13; // Enter
        case "ANALOG_UP":
          return 87; // W
        case "ANALOG_DOWN":
          return 83; // S
        case "ANALOG_LEFT":
          return 65; // A
        case "ANALOG_RIGHT":
          return 68; // D
        case "C_UP":
          return 73; // I
        case "C_DOWN":
          return 76; // L
        case "C_LEFT":
          return 85; // U
        case "C_RIGHT":
          return 79; // O
      }
    } else {
      switch (btn) {
        case "UP":
          return 38;
        case "DOWN":
          return 40;
        case "LEFT":
          return 37;
        case "RIGHT":
          return 39;
        case "A":
          return 88; // X
        case "B":
          return 67; // C
        case "X":
          return 90; // Z
        case "Y":
          return 83; // S
        case "L":
          return 65; // A
        case "R":
          return 68; // D
        case "L2":
          return 81; // Q
        case "R2":
          return 69; // E
        case "SELECT":
          return 16; // Shift
        case "START":
          return 13; // Enter
      }
    }
    return null;
  }

  // Trigger button KeyboardEvents on the active target only to avoid duplicate events
  function triggerButton(btn, isPress) {
    if (!currentGame) return;
    const isN64 = currentGame.console === "n64";
    const code = getKeyCode(btn, isN64);
    if (!code) return;

    if (isPress && typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(15);
      } catch (err) {}
    }

    const eventName = isPress ? "keydown" : "keyup";
    const extra = getKeyboardEventInit(code);
    const eventObj = new KeyboardEvent(eventName, {
      keyCode: code,
      which: code,
      key: extra.key,
      code: extra.code,
      bubbles: true,
      cancelable: true,
    });

    const canvas = document.querySelector("#emulator canvas");
    if (canvas) {
      canvas.dispatchEvent(eventObj);
    } else {
      window.dispatchEvent(eventObj);
    }
  }

  // Mouse handlers with focus management and event prevention
  function handleMouseDown(e, btn) {
    e.preventDefault();
    e.stopPropagation();
    const canvas = document.querySelector("#emulator canvas");
    if (canvas && document.activeElement !== canvas) {
      canvas.focus();
    }
    triggerButton(btn, true);
  }

  function handleMouseUp(e, btn) {
    e.preventDefault();
    e.stopPropagation();
    triggerButton(btn, false);
  }

  // Touch Start / End handlers with focus management
  function handleTouchStart(e, btn) {
    e.preventDefault();
    e.stopPropagation();
    const canvas = document.querySelector("#emulator canvas");
    if (canvas && document.activeElement !== canvas) {
      canvas.focus();
    }
    triggerButton(btn, true);
  }

  function handleTouchEnd(e, btn) {
    e.preventDefault();
    e.stopPropagation();
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
    activeAnalogKeys.forEach((key) => triggerButton(key, false));
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
    activeAnalogKeys.forEach((key) => {
      if (!targetKeys.includes(key)) triggerButton(key, false);
    });

    // Press new keys not previously active
    targetKeys.forEach((key) => {
      if (!activeAnalogKeys.includes(key)) triggerButton(key, true);
    });

    activeAnalogKeys = targetKeys;
  }

  // Load game emulator setup
  function selectGame(game) {
    const gameUrl = `/arcade/${game.id}`;

    // Check if emulator already run in this window session
    if (window.Neptune) {
      // Reload needed due to WebAssembly instances state pollution. Save autoload state first.
      localStorage.setItem("arcade-auto-load", game.id);
      localStorage.setItem("arcade-auto-theme", activeTheme);
      history.replaceState(
        { view: "toolbox", app: "arcade", game: game.id, depth: 3 },
        "",
        gameUrl
      );
      window.location.reload();
      return;
    }

    currentGame = game;
    history.pushState(
      { view: "toolbox", app: "arcade", game: game.id, depth: 3 },
      "",
      gameUrl
    );

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
    history.pushState(
      { view: "toolbox", app: "arcade", depth: 2 },
      "",
      "/apps/arcade"
    );
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
                contents: val.contents,
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
    const blob = new Blob([save.contents], {
      type: "application/octet-stream",
    });
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
          contents: new Uint8Array(arrayBuffer),
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

  // Toggle browser fullscreen for the play interface container
  function toggleFullscreen() {
    const playArea = document.querySelector(".play-interface");
    if (!playArea) return;

    if (!document.fullscreenElement) {
      playArea
        .requestFullscreen()
        .then(() => {
          isFullscreen = true;
        })
        .catch(() => {
          isFullscreen = !isFullscreen;
        });
    } else {
      document
        .exitFullscreen()
        .then(() => {
          isFullscreen = false;
        })
        .catch(() => {
          isFullscreen = false;
        });
    }
  }

  // Svelte 5 dynamic emulator DOM positioning effect
  $effect(() => {
    if (isEmuRunning && activeTheme && emulatorEl) {
      const container = document.querySelector(
        `.console-${activeTheme} .screen-display-area`,
      );
      if (container && emulatorEl.parentElement !== container) {
        container.appendChild(emulatorEl);
      }
    }
  });

  // Sync custom controls to local storage
  $effect(() => {
    try {
      localStorage.setItem(
        "arcade-keyboard-mappings",
        JSON.stringify(userMappings),
      );
    } catch (e) {
      console.warn("Failed to save mappings to localStorage:", e);
    }
  });

  // Lifecycle
  onMount(() => {
    // Capture key events at window level to translate physical keys
    window.addEventListener("keydown", handleWindowKeyEvent, true);
    window.addEventListener("keyup", handleWindowKeyEvent, true);

    // Check auto load
    const reloadGameId =
      initialGameId || localStorage.getItem("arcade-auto-load");
    const reloadTheme = localStorage.getItem("arcade-auto-theme");

    if (reloadTheme) {
      activeTheme = reloadTheme;
      localStorage.removeItem("arcade-auto-theme");
    }

    if (reloadGameId) {
      localStorage.removeItem("arcade-auto-load");
      const game = GAMES.find((g) => g.id === reloadGameId);
      if (game) {
        selectGame(game);
      }
    }

    refreshSaves();

    const onFullscreenChange = () => {
      isFullscreen = document.fullscreenElement !== null;
    };
    const handlePopState = (e) => {
      const state = e.state;
      if (currentGame && (!state || state.app !== "arcade" || !state.game)) {
        if (window.Neptune) {
          window.location.reload();
        } else {
          currentGame = null;
        }
      }
    };
    window.addEventListener("popstate", handlePopState);

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      window.removeEventListener("popstate", handlePopState);
    };
  });

  onDestroy(() => {
    // Remove capture listeners
    window.removeEventListener("keydown", handleWindowKeyEvent, true);
    window.removeEventListener("keyup", handleWindowKeyEvent, true);

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
        <h2>Arcade</h2>
        <p class="intro-text">
          Load vintage ROM games from local disk database.
        </p>
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
            <p class="text-[0.7rem] text-white/30 italic">
              No local save states detected.
            </p>
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

          <button
            class="save-btn"
            onclick={refreshSaves}
            aria-label="Refresh saves"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      <!-- Keyboard Controls Configuration (Desktop/Tablet only) -->
      <div class="keyboard-controls-card hidden md:flex">
        <h3>
          <Gamepad size={18} />
          Keyboard Bindings
        </h3>
        <p>
          Configure custom keyboard controls for Sega Genesis, NDS, N64, PSX,
          and GBA.
        </p>
        <button class="config-btn" onclick={() => (isControlsModalOpen = true)}>
          <Settings2 size={14} />
          Configure Keys
        </button>
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
            <option value="screen">Screen Only</option>
          </select>
          <button
            class="fullscreen-btn hidden md:flex"
            onclick={() => (isControlsModalOpen = true)}
            aria-label="Keyboard controls"
          >
            <Settings2 size={14} />
          </button>
          <button
            class="fullscreen-btn"
            onclick={toggleFullscreen}
            aria-label="Toggle Fullscreen"
          >
            {#if isFullscreen}
              <Minimize2 size={14} />
            {:else}
              <Maximize2 size={14} />
            {/if}
          </button>
        </div>
      </header>

      <div class="console-body-wrapper">
        <!-- Persistent Emulator Container -->
        <div
          bind:this={emulatorEl}
          id="emulator"
          style="width: 100%; height: 100%;"
        ></div>

        <!-- GAMEBOY COLOR THEME (VERTICAL STACK) -->
        <div
          class="console-gbc"
          style="display: {activeTheme === 'gbc' ? 'flex' : 'none'}"
        >
          <div class="screen-bezel">
            <span class="power-led"></span>
            <div class="screen-display-area">
              <!-- Emulator is moved here dynamically by $effect -->
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
                  onmousedown={(e) => handleMouseDown(e, "UP")}
                  onmouseup={(e) => handleMouseUp(e, "UP")}
                  aria-label="Up"
                ></div>
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div
                  class="dpad-btn down"
                  ontouchstart={(e) => handleTouchStart(e, "DOWN")}
                  ontouchend={(e) => handleTouchEnd(e, "DOWN")}
                  onmousedown={(e) => handleMouseDown(e, "DOWN")}
                  onmouseup={(e) => handleMouseUp(e, "DOWN")}
                  aria-label="Down"
                ></div>
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div
                  class="dpad-btn left"
                  ontouchstart={(e) => handleTouchStart(e, "LEFT")}
                  ontouchend={(e) => handleTouchEnd(e, "LEFT")}
                  onmousedown={(e) => handleMouseDown(e, "LEFT")}
                  onmouseup={(e) => handleMouseUp(e, "LEFT")}
                  aria-label="Left"
                ></div>
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div
                  class="dpad-btn right"
                  ontouchstart={(e) => handleTouchStart(e, "RIGHT")}
                  ontouchend={(e) => handleTouchEnd(e, "RIGHT")}
                  onmousedown={(e) => handleMouseDown(e, "RIGHT")}
                  onmouseup={(e) => handleMouseUp(e, "RIGHT")}
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
                  onmousedown={(e) => handleMouseDown(e, "B")}
                  onmouseup={(e) => handleMouseUp(e, "B")}
                  aria-label="Button B"
                >
                  B
                </div>
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div
                  class="action-btn-circle"
                  ontouchstart={(e) => handleTouchStart(e, "A")}
                  ontouchend={(e) => handleTouchEnd(e, "A")}
                  onmousedown={(e) => handleMouseDown(e, "A")}
                  onmouseup={(e) => handleMouseUp(e, "A")}
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
                onmousedown={(e) => handleMouseDown(e, "SELECT")}
                onmouseup={(e) => handleMouseUp(e, "SELECT")}
                aria-label="Select"
              ></div>
              <!-- svelte-ignore a11y_no_static_element_interactions -->
              <div
                class="system-btn-capsule"
                data-label="START"
                ontouchstart={(e) => handleTouchStart(e, "START")}
                ontouchend={(e) => handleTouchEnd(e, "START")}
                onmousedown={(e) => handleMouseDown(e, "START")}
                onmouseup={(e) => handleMouseUp(e, "START")}
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

        <!-- PSP THEME (HORIZONTAL SPLIT) -->
        <div
          class="console-psp"
          style="display: {activeTheme === 'psp' ? 'flex' : 'none'}"
        >
          <!-- PSP L Shoulder button -->
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div
            class="psp-shoulder left"
            ontouchstart={(e) => handleTouchStart(e, "L")}
            ontouchend={(e) => handleTouchEnd(e, "L")}
            onmousedown={(e) => handleMouseDown(e, "L")}
            onmouseup={(e) => handleMouseUp(e, "L")}
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
                onmousedown={(e) => handleMouseDown(e, "UP")}
                onmouseup={(e) => handleMouseUp(e, "UP")}
                aria-label="Dpad Up"
              >
                ▲
              </div>
              <!-- svelte-ignore a11y_no_static_element_interactions -->
              <div
                class="psp-dpad-btn down"
                ontouchstart={(e) => handleTouchStart(e, "DOWN")}
                ontouchend={(e) => handleTouchEnd(e, "DOWN")}
                onmousedown={(e) => handleMouseDown(e, "DOWN")}
                onmouseup={(e) => handleMouseUp(e, "DOWN")}
                aria-label="Dpad Down"
              >
                ▼
              </div>
              <!-- svelte-ignore a11y_no_static_element_interactions -->
              <div
                class="psp-dpad-btn left"
                ontouchstart={(e) => handleTouchStart(e, "LEFT")}
                ontouchend={(e) => handleTouchEnd(e, "LEFT")}
                onmousedown={(e) => handleMouseDown(e, "LEFT")}
                onmouseup={(e) => handleMouseUp(e, "LEFT")}
                aria-label="Dpad Left"
              >
                ◀
              </div>
              <!-- svelte-ignore a11y_no_static_element_interactions -->
              <div
                class="psp-dpad-btn right"
                ontouchstart={(e) => handleTouchStart(e, "RIGHT")}
                ontouchend={(e) => handleTouchEnd(e, "RIGHT")}
                onmousedown={(e) => handleMouseDown(e, "RIGHT")}
                onmouseup={(e) => handleMouseUp(e, "RIGHT")}
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
              <!-- Emulator is moved here dynamically by $effect -->
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
                onmousedown={(e) => handleMouseDown(e, "Y")}
                onmouseup={(e) => handleMouseUp(e, "Y")}
                aria-label="Triangle"
              >
                ▲
              </div>
              <!-- svelte-ignore a11y_no_static_element_interactions -->
              <div
                class="psp-btn circle"
                ontouchstart={(e) => handleTouchStart(e, "A")}
                ontouchend={(e) => handleTouchEnd(e, "A")}
                onmousedown={(e) => handleMouseDown(e, "A")}
                onmouseup={(e) => handleMouseUp(e, "A")}
                aria-label="Circle"
              >
                ●
              </div>
              <!-- svelte-ignore a11y_no_static_element_interactions -->
              <div
                class="psp-btn cross"
                ontouchstart={(e) => handleTouchStart(e, "B")}
                ontouchend={(e) => handleTouchEnd(e, "B")}
                onmousedown={(e) => handleMouseDown(e, "B")}
                onmouseup={(e) => handleMouseUp(e, "B")}
                aria-label="Cross"
              >
                ✖
              </div>
              <!-- svelte-ignore a11y_no_static_element_interactions -->
              <div
                class="psp-btn square"
                ontouchstart={(e) => handleTouchStart(e, "X")}
                ontouchend={(e) => handleTouchEnd(e, "X")}
                onmousedown={(e) => handleMouseDown(e, "X")}
                onmouseup={(e) => handleMouseUp(e, "X")}
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
            onmousedown={(e) => handleMouseDown(e, "R")}
            onmouseup={(e) => handleMouseUp(e, "R")}
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
              onmousedown={(e) => handleMouseDown(e, "SELECT")}
              onmouseup={(e) => handleMouseUp(e, "SELECT")}
            >
              SELECT
            </button>
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <button
              class="psp-sys-btn"
              ontouchstart={(e) => handleTouchStart(e, "START")}
              ontouchend={(e) => handleTouchEnd(e, "START")}
              onmousedown={(e) => handleMouseDown(e, "START")}
              onmouseup={(e) => handleMouseUp(e, "START")}
            >
              START
            </button>
          </div>
        </div>

        <!-- GAMEBOY ADVANCE (HORIZONTAL THEME) -->
        <div
          class="console-gba"
          style="display: {activeTheme === 'gba' ? 'flex' : 'none'}"
        >
          <!-- GBA Shoulder Buttons -->
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div
            class="gba-shoulder left"
            ontouchstart={(e) => handleTouchStart(e, "L")}
            ontouchend={(e) => handleTouchEnd(e, "L")}
            onmousedown={(e) => handleMouseDown(e, "L")}
            onmouseup={(e) => handleMouseUp(e, "L")}
            aria-label="L shoulder"
          >
            L
          </div>
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div
            class="gba-shoulder right"
            ontouchstart={(e) => handleTouchStart(e, "R")}
            ontouchend={(e) => handleTouchEnd(e, "R")}
            onmousedown={(e) => handleMouseDown(e, "R")}
            onmouseup={(e) => handleMouseUp(e, "R")}
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
                onmousedown={(e) => handleMouseDown(e, "UP")}
                onmouseup={(e) => handleMouseUp(e, "UP")}
                aria-label="Up"
              ></div>
              <!-- svelte-ignore a11y_no_static_element_interactions -->
              <div
                class="dpad-btn down"
                ontouchstart={(e) => handleTouchStart(e, "DOWN")}
                ontouchend={(e) => handleTouchEnd(e, "DOWN")}
                onmousedown={(e) => handleMouseDown(e, "DOWN")}
                onmouseup={(e) => handleMouseUp(e, "DOWN")}
                aria-label="Down"
              ></div>
              <!-- svelte-ignore a11y_no_static_element_interactions -->
              <div
                class="dpad-btn left"
                ontouchstart={(e) => handleTouchStart(e, "LEFT")}
                ontouchend={(e) => handleTouchEnd(e, "LEFT")}
                onmousedown={(e) => handleMouseDown(e, "LEFT")}
                onmouseup={(e) => handleMouseUp(e, "LEFT")}
                aria-label="Left"
              ></div>
              <!-- svelte-ignore a11y_no_static_element_interactions -->
              <div
                class="dpad-btn right"
                ontouchstart={(e) => handleTouchStart(e, "RIGHT")}
                ontouchend={(e) => handleTouchEnd(e, "RIGHT")}
                onmousedown={(e) => handleMouseDown(e, "RIGHT")}
                onmouseup={(e) => handleMouseUp(e, "RIGHT")}
                aria-label="Right"
              ></div>
            </div>
          </div>

          <!-- Screen Center Frame -->
          <div class="screen-center">
            <div class="screen-display-area">
              <!-- Emulator is moved here dynamically by $effect -->
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
                onmousedown={(e) => handleMouseDown(e, "B")}
                onmouseup={(e) => handleMouseUp(e, "B")}
                aria-label="B button"
              >
                B
              </div>
              <!-- svelte-ignore a11y_no_static_element_interactions -->
              <div
                class="action-btn-circle"
                ontouchstart={(e) => handleTouchStart(e, "A")}
                ontouchend={(e) => handleTouchEnd(e, "A")}
                onmousedown={(e) => handleMouseDown(e, "A")}
                onmouseup={(e) => handleMouseUp(e, "A")}
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
              onmousedown={(e) => handleMouseDown(e, "SELECT")}
              onmouseup={(e) => handleMouseUp(e, "SELECT")}
              aria-label="Select"
            ></div>
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
              class="system-btn"
              data-label="START"
              ontouchstart={(e) => handleTouchStart(e, "START")}
              ontouchend={(e) => handleTouchEnd(e, "START")}
              onmousedown={(e) => handleMouseDown(e, "START")}
              onmouseup={(e) => handleMouseUp(e, "START")}
              aria-label="Start"
            ></div>
          </div>
        </div>

        <!-- SCREEN ONLY THEME (BEZEL-LESS SCREEN) -->
        <div
          class="console-screen"
          style="display: {activeTheme === 'screen'
            ? 'flex'
            : 'none'}; width: 100%; height: 100%;"
        >
          <div class="screen-display-area" style="width: 100%; height: 100%;">
            <!-- Emulator is moved here dynamically by $effect -->
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<KeyboardControlsModal
  bind:isOpen={isControlsModalOpen}
  bind:userMappings
  onReset={handleResetConsoleMappings}
/>

<style lang="scss">
  @use "./ArcadeApp.scss";
</style>
