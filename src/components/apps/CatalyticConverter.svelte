<script>
  import { onDestroy, onMount } from "svelte";
  import { fly } from "svelte/transition";
  import {
    Upload,
    Download,
    FileImage,
    FileAudio,
    RefreshCw,
    Flame,
    CheckCircle,
    ArrowLeft,
    Keyboard,
    AlertCircle,
    Link2,
    Link2Off,
    FileVideo,
    FileJson,
    Undo,
    Trash2,
    Loader2,
  } from "lucide-svelte";
  import {
    convertImage,
    convertAudio,
    convertVideo,
    convertAudioToVideo,
  } from "../../lib/convert.js";
  import {
    convertData,
    headerFromOpts,
    detectDataFormat,
  } from "../../lib/dog.js";
  import {
    conversions,
    saveConversion,
    getConversion,
    clearConversions,
  } from "../../lib/conversionHistory.svelte.js";
  import { createZip, unzip } from "../../lib/zip.js";

  // State variables
  let isDragging = $state(false);
  let file = $state(null);
  let fileType = $state(""); // 'image' | 'audio' | 'unsupported'
  let inputFormat = $state(""); // e.g. 'jpg', 'png', 'webp', 'mp3', 'wav', 'm4a'
  let selectedFormats = $state([]); // selected output formats
  let selectionAnchor = $state(""); // anchor for range selection
  let conversionStatus = $state("idle"); // 'idle' | 'converting' | 'done' | 'error'
  let progress = $state(0);
  let previewUrl = $state("");
  let convertedFiles = $state([]); // array of { blob, name, kind?, text?, url? }
  let dataPreviewText = $state(""); // input preview for data files
  let rawDataText = $state(""); // full input text for data files
  let previewFullText = $state(""); // untruncated text behind the preview pane
  let previewFmt = $state(""); // which format the preview pane is showing
  let editingInput = $state(false); // preview pane is an editable textarea
  let previewSize = $state(0); // potential output size of the previewed format
  let currentConversionId = $state(null); // history entry backing the done view
  let showDogInfo = $state(false); // .dog format spec page
  let previewMaximized = $state(false); // input text pane expanded over the whole site
  let maximizedOutput = $state(null); // { name, text } — converted text expanded over the whole site

  // .dog encoding options — drives the header line of dog output
  const DOG_PRESETS = {
    classic: { indent: 2, block: "track", case: "any", flow: "block", bools: "truefalse" },
    tight: { indent: 1, block: "track", case: "any", flow: "block", bools: "10" },
    mini: { indent: 2, block: "track", case: "any", flow: "line", bools: "10" },
    wire: { indent: 2, block: "track", case: "any", flow: "wire", bools: "10" },
  };
  let dogPreset = $state("classic");
  let showDogEncoding = $state(false); // customize panel open/closed
  let dogOpts = $state({ ...DOG_PRESETS.classic });
  let dogHeaderPreview = $derived(headerFromOpts(dogOpts));

  const v1Keys = ["indent", "block", "case", "flow", "bools"];
  const v1Shape = (o) => JSON.stringify(v1Keys.map((k) => o[k]));

  function applyDogPreset(name) {
    dogPreset = name;
    if (DOG_PRESETS[name]) dogOpts = { ...dogOpts, ...DOG_PRESETS[name] };
  }

  function setDogOpt(key, value) {
    dogOpts = { ...dogOpts, [key]: value };
    const match = Object.entries(DOG_PRESETS).find(
      ([, p]) => v1Shape(p) === v1Shape(dogOpts),
    );
    dogPreset = match ? match[0] : "custom";
  }
  let zipDownloads = $state(false);
  let errorMessage = $state("");
  let currentNotice = $state("Refining Format Molecules");

  // Bulk state variables
  let bulkFiles = $state([]);
  let isBulkMode = $derived(bulkFiles.length > 0);
  let isConvertingBulk = $state(false);
  let overallProgress = $state(0);
  let currentConvertingIndex = $state(0);
  let batchImageFormats = $state(["png"]);
  let batchAudioFormats = $state(["mp3"]);
  let batchVideoFormats = $state(["mp4"]);
  let batchDataFormats = $state(["json"]);
  let bulkZipDownloads = $state(false);
  let bulkAllComplete = $derived(
    !isConvertingBulk &&
      bulkFiles.length > 0 &&
      bulkFiles.every((f) => f.status === "done" || f.status === "error") &&
      bulkFiles.some((f) => f.status === "done"),
  );

  // Image size parameters
  let originalWidth = $state(0);
  let originalHeight = $state(0);
  let targetWidth = $state(0);
  let targetHeight = $state(0);
  let keepAspectRatio = $state(true);
  let keepTens = $state(true);

  // Quality & compression parameters
  let quality = $state(80); // 0 to 100
  let compression = $state(15); // 0 to 100

  // Audio parameters
  let audioBitrate = $state("192"); // kbps
  let audioSampleRate = $state("keep"); // 'keep' | sample rate number

  // Audio preview helper
  let audioContext = null;
  let audioBuffer = null;

  // Available output formats based on detected type
  const formatMap = {
    image: ["png", "jpg", "webp", "avif", "svg"],
    audio: ["mp3", "wav", "m4a", "aac", "webm", "mp4", "mov", "mkv", "avi"],
    video: ["mp4", "mov", "mkv", "avi", "mp3", "wav", "m4a", "aac", "webm"],
    data: ["dog", "json", "js", "yml", "ts", "md"],
  };

  let availableFormats = $derived(fileType ? formatMap[fileType] || [] : []);

  let formatGroups = $derived(
    fileType === "image"
      ? [
          {
            name: "Image Formats",
            color: "#ff5e00",
            formats: ["png", "jpg", "webp", "avif", "svg"],
          },
        ]
      : fileType === "audio"
        ? [
            {
              name: "Audio Formats",
              color: "#00ffff",
              formats: ["mp3", "wav", "m4a", "aac", "webm"],
            },
            {
              name: "Video Formats",
              color: "#a855f7",
              formats: ["mp4", "mov", "mkv", "avi"],
            },
          ]
        : fileType === "video"
          ? [
              {
                name: "Video Formats",
                color: "#a855f7",
                formats: ["mp4", "mov", "mkv", "avi"],
              },
              {
                name: "Audio Formats",
                color: "#00ffff",
                formats: ["mp3", "wav", "m4a", "aac", "webm"],
              },
            ]
          : fileType === "data"
            ? [
                {
                  name: "Data Formats",
                  color: "#4ade80",
                  formats: ["dog", "json", "js", "yml", "ts", "md"],
                },
              ]
            : [],
  );

  const hasQualitySupport = $derived(
    selectedFormats.some((f) => f === "jpg" || f === "webp"),
  );
  const hasCompressionSupport = $derived(
    selectedFormats.some((f) => f === "png" || f === "webp"),
  );

  const notices = [
    "Refining Format Molecules",
    "Microwaving the Pizza",
    "Flipping the Pancakes",
    "Flapping the Flapjacks",
    "Cheesing the Cheesecake",
    "Moving the Needle",
    "Baking the Goods",
    "Baking the Cookies",
    "Painting the Painting",
    "Doing the Laundry",
    "Spinning the Gears",
    "vacuuming the Car",
    "Investigating 311",
    "Playing Polymerization",
    "Popping the Popcorn",
    "Teabagging the Teabag",
    "Lickin my Fingers",
    "Feeding to Ditto",
    "Roasting the Marshmallows",
    "Bending the Spoon",
    "Surfing the Big One",
    "Petting the Dog",
    "Layering the Lasagna",
    "Chopping the Onion",
    "Shifting the Shapes",
    "Sanding the Silverware",
    "Firing the Clay",
    "Heating up the Kiln",
    "Microwaving the Leftovers",
    "Chasing the Mailman",
    "Pushing the Limits",
    "Bursting the Bubbles",
    "Ironing the Pants",
    "Paying the 'LectricBill",
    "Bribing the Policemen",
    "Karate Chopping the Salad",
    "Tipping the Waitress",
    "Pressure Washin the Winder",
    "Lickin the Lightbulbs",
    "Eating the Bologna",
    "Tuning the Pianos",
    "Feeding the Pidgeons",
    "Fighting the Fake News",
    "Kicking the Nazis",
    "Doing git push-ups",
    "Doing Sit-Ups",
    "Doing git pull-ups",
    `Doing git revert --no-commit "HEAD~$c..HEAD"-Ups`,
  ];

  // Touch-and-hold format selector for mobile viewports
  let holdTimeout = null;
  let ignoreNextClick = false;

  function handleFormatPointerDown(format, event) {
    if (conversionStatus !== "idle" || !file) return;

    ignoreNextClick = false;
    holdTimeout = setTimeout(() => {
      // Toggle selection (like Ctrl+click)
      if (selectedFormats.includes(format)) {
        selectedFormats = selectedFormats.filter((f) => f !== format);
      } else {
        selectedFormats = [...selectedFormats, format];
      }
      selectionAnchor = format;

      ignoreNextClick = true;
      if (navigator.vibrate) {
        navigator.vibrate(35); // Haptic feedback tick
      }
    }, 450); // 450ms hold trigger threshold
  }

  function handleFormatPointerUp(format, event) {
    if (holdTimeout) {
      clearTimeout(holdTimeout);
      holdTimeout = null;
    }
  }

  // Selection Anchor and Format Handler
  function handleFormatSelection(format, event) {
    if (conversionStatus !== "idle" || !file) return;

    if (ignoreNextClick) {
      ignoreNextClick = false;
      return;
    }

    const isCtrl = event.ctrlKey || event.metaKey;
    const isShift = event.shiftKey;

    if (isCtrl || isShift) {
      // Toggle/Add selection (both Ctrl and Shift click/enter do this, no range selection)
      if (selectedFormats.includes(format)) {
        selectedFormats = selectedFormats.filter((f) => f !== format);
      } else {
        selectedFormats = [...selectedFormats, format];
      }
      selectionAnchor = format;
    } else {
      // Single select
      selectedFormats = [format];
      selectionAnchor = format;
    }
  }

  // Keyboard focus navigation for formats grid
  function moveFocus(key) {
    const buttons = Array.from(document.querySelectorAll(".format-opt-btn"));
    if (buttons.length === 0) return;

    const active = document.activeElement;
    if (!buttons.includes(active)) {
      buttons[0].focus();
      return;
    }

    const index = buttons.indexOf(active);
    let nextIndex = index;

    // Calculate columns in the grid by comparing top offsets
    let cols = 0;
    if (buttons.length > 1) {
      const firstTop = buttons[0].getBoundingClientRect().top;
      for (const btn of buttons) {
        if (Math.abs(btn.getBoundingClientRect().top - firstTop) < 5) {
          cols++;
        } else {
          break;
        }
      }
    }
    if (cols === 0) cols = 2; // fallback

    if (key === "ArrowLeft") {
      nextIndex = index - 1;
    } else if (key === "ArrowRight") {
      nextIndex = index + 1;
    } else if (key === "ArrowUp") {
      nextIndex = index - cols;
    } else if (key === "ArrowDown") {
      nextIndex = index + cols;
    }

    if (nextIndex >= 0 && nextIndex < buttons.length) {
      buttons[nextIndex].focus();
    }
  }

  // Keyboard shortcut listener
  function handleKeydown(e) {
    if (conversionStatus !== "idle" || !file) return;
    if (editingInput || ["TEXTAREA", "INPUT"].includes(document.activeElement?.tagName)) return;

    // Numbers 1-9 to select formats
    const num = parseInt(e.key);
    if (!isNaN(num) && num >= 1 && num <= 9 && availableFormats[num - 1]) {
      selectedFormats = [availableFormats[num - 1]];
      selectionAnchor = availableFormats[num - 1];
    } else if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      const active = document.activeElement;
      if (active && active.classList.contains("format-opt-btn")) {
        // Let standard browser click handle it
        return;
      }
      if (selectedFormats.length > 0) {
        startConversion();
      }
    } else if (
      ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)
    ) {
      e.preventDefault();
      moveFocus(e.key);
    }
  }

  let copiedKey = $state(""); // which copy button just fired, for feedback

  // Live preview: converting a data file re-renders the preview pane in the
  // last-clicked output format, instantly on every click.
  $effect(() => {
    if (fileType !== "data" || !rawDataText) return;
    const fmt = selectionAnchor;
    const inFmt = inputFormat;
    const src = rawDataText;
    const opts = { ...dogOpts };
    let cancelled = false;
    (async () => {
      try {
        let text, size;
        if (!fmt || (fmt === inFmt && fmt !== "dog")) {
          text = src;
          size = new Blob([src]).size;
        } else {
          const blob = convertData(src, inFmt, fmt, opts);
          text = await blob.text();
          size = blob.size;
        }
        if (cancelled) return;
        previewFullText = text;
        // Show the full file; only guard against truly huge payloads.
        dataPreviewText =
          text.length > 400000
            ? text.slice(0, 400000) + "\n… (truncated for display — Copy still grabs everything)"
            : text;
        previewFmt = fmt || inFmt;
        previewSize = size;
      } catch (err) {
        if (!cancelled) {
          dataPreviewText = "conversion error: " + err.message;
          previewFullText = "";
          previewSize = 0;
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  });

  // Full-screen text panes, same mechanic as the fundraiser map: Escape has
  // to be swallowed in the capture phase, before TitlePage's window listener
  // closes the whole app over it.
  function handleFullscreenEsc(e) {
    if (e.key !== "Escape") return;
    if (!previewMaximized && !maximizedOutput) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    if (maximizedOutput) maximizedOutput = null;
    else previewMaximized = false;
  }

  // Expands a converted text output over the whole site, full (untruncated) text.
  async function expandOutput(item) {
    let text = item.text || "";
    try {
      if (item.blob) text = await item.blob.text();
    } catch {}
    if (text.length > 400000) {
      text =
        text.slice(0, 400000) +
        "\n… (truncated for display — Copy still grabs everything)";
    }
    maximizedOutput = { name: item.name, text, blob: item.blob };
  }

  // Copies the FULL text of a blob/File or string (previews are truncated).
  async function copyPreviewText(source, key) {
    try {
      const text = typeof source === "string" ? source : await source.text();
      await navigator.clipboard.writeText(text);
      copiedKey = key;
      setTimeout(() => {
        if (copiedKey === key) copiedKey = "";
      }, 1500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  }

  // "Enter text" flow: an empty editable data document, no file needed.
  function startTextEntry() {
    resetState(false);
    fileType = "data";
    inputFormat = "dog";
    rawDataText = "";
    file = { name: "typed.dog", size: 0 };
    selectedFormats = ["json"];
    selectionAnchor = "json";
    editingInput = true;
  }

  // Typing/pasting into the preview edits the SOURCE: re-detect its format
  // (dog / json / yml) and refresh the synthetic file identity.
  function handleInputEdit(e) {
    rawDataText = e.target.value;
    const fmt = detectDataFormat(rawDataText);
    if (fmt !== inputFormat) {
      inputFormat = fmt;
      if (selectedFormats.length === 1 && selectedFormats[0] === fmt) {
        selectedFormats = [fmt === "dog" ? "json" : "dog"];
        selectionAnchor = selectedFormats[0];
      }
    }
    const base = (file?.name ?? "typed.dog").replace(/\.[^.]+$/, "");
    file = { name: base + "." + fmt, size: new Blob([rawDataText]).size };
  }

  // Feeds a converted output back in as the new input, ready for another format.
  async function reconvertOutput(item) {
    if (!item.blob) return;
    const text = await item.blob.text();
    const name = item.name;
    const size = item.blob.size;
    resetState();
    fileType = "data";
    rawDataText = text;
    inputFormat = detectDataFormat(text);
    file = { name, size };
    selectedFormats = [inputFormat === "dog" ? "json" : "dog"];
    selectionAnchor = selectedFormats[0];
  }

  // Restores a recorded conversion into the completed-conversion view.
  function restoreConversion(id) {
    const entry = getConversion(id);
    if (!entry) return false;
    convertedFiles.forEach((f) => {
      if (f.url) URL.revokeObjectURL(f.url);
    });
    file = { name: entry.inputName, size: entry.inputSize };
    convertedFiles = entry.items.map((it) => {
      const o = { name: it.name, kind: it.kind, blob: it.blob };
      if (it.blob && it.kind !== "text") {
        o.url = URL.createObjectURL(it.blob);
      }
      return o;
    });
    entry.items.forEach((it, i) => {
      if (it.blob && it.kind === "text") {
        it.blob
          .text()
          .then((t) => {
            if (convertedFiles[i]) convertedFiles[i].text = t.slice(0, 2000);
          })
          .catch(() => {});
      }
    });
    currentConversionId = entry.id;
    errorMessage = "";
    progress = 100;
    conversionStatus = "done";
    return true;
  }

  // Opens a history-menu entry as its own browser-history entry, then shows it.
  function openHistoryEntry(id) {
    const d = (history.state?.depth ?? 2) + 1;
    history.pushState(
      { view: "toolbox", app: "converter", depth: d, conversionId: id },
      "",
      `/apps/converter?c=${id}`,
    );
    restoreConversion(id);
  }

  function handleConverterPop(e) {
    const id =
      e.state?.conversionId ??
      new URLSearchParams(window.location.search).get("c");
    if (id) {
      restoreConversion(id);
    } else if (conversionStatus === "done") {
      resetState(false);
    }
  }

  onMount(() => {
    window.addEventListener("keydown", handleFullscreenEsc, true);
    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("popstate", handleConverterPop);
    // /.dog deep link opens straight to the format spec
    if (window.__openDogSpec) {
      showDogInfo = true;
      delete window.__openDogSpec;
    }
    // Deep link / back-into-app: restore the conversion named by the URL
    const c =
      history.state?.conversionId ??
      new URLSearchParams(window.location.search).get("c");
    if (c) restoreConversion(c);
  });

  onDestroy(() => {
    window.removeEventListener("keydown", handleFullscreenEsc, true);
    window.removeEventListener("keydown", handleKeydown);
    window.removeEventListener("popstate", handleConverterPop);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  });

  // Handle Drag/Drop events
  function handleDragOver(e) {
    e.preventDefault();
    isDragging = true;
  }

  function handleDragLeave() {
    isDragging = false;
  }

  function handleDrop(e) {
    e.preventDefault();
    isDragging = false;
    if (e.dataTransfer.items) {
      const entries = [];
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        const entry = e.dataTransfer.items[i].webkitGetAsEntry();
        if (entry) {
          entries.push(entry);
        }
      }
      traverseEntries(entries);
    } else if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);
      if (files.length === 1 && files[0].name.endsWith(".zip")) {
        processZipFile(files[0]);
      } else if (files.length > 0) {
        processMultipleFiles(files);
      }
    }
  }

  function handleFileSelect(e) {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      // Clear the input so selecting the same file(s) again re-fires change
      e.target.value = "";
      if (files.length === 1 && files[0].name.endsWith(".zip")) {
        processZipFile(files[0]);
      } else if (files.length > 0) {
        processMultipleFiles(files);
      }
    }
  }

  // Detect and analyze file type/format
  async function processFile(selectedFile) {
    if (selectedFile.name.endsWith(".zip")) {
      await processZipFile(selectedFile);
      return;
    }
    resetState();
    file = selectedFile;
    const name = file.name.toLowerCase();
    const ext = name.split(".").pop();

    if (
      file.type.startsWith("image/") ||
      ["jpg", "jpeg", "png", "webp", "gif", "avif", "svg"].includes(ext)
    ) {
      fileType = "image";
      inputFormat = ext === "jpeg" ? "jpg" : ext;
      previewUrl = URL.createObjectURL(file);
      // Auto-select a default different format
      selectedFormats = [inputFormat === "png" ? "jpg" : "png"];
      selectionAnchor = selectedFormats[0];

      // Read dimensions
      const img = new Image();
      img.src = previewUrl;
      img.onload = () => {
        originalWidth = img.naturalWidth;
        originalHeight = img.naturalHeight;
        targetWidth = originalWidth;
        targetHeight = originalHeight;
      };
    } else if (
      file.type.startsWith("audio/") ||
      ["mp3", "wav", "m4a", "ogg", "aac", "webm"].includes(ext)
    ) {
      fileType = "audio";
      inputFormat = ext;
      previewUrl = URL.createObjectURL(file);
      selectedFormats = [inputFormat === "mp3" ? "wav" : "mp3"];
      selectionAnchor = selectedFormats[0];

      // Load audio data in background for actual WAV encoding if needed
      try {
        const arrayBuffer = await file.arrayBuffer();
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      } catch (err) {
        console.error("Failed to decode audio data:", err);
      }
    } else if (
      file.type.startsWith("video/") ||
      ["mp4", "mov", "mkv", "avi", "webm"].includes(ext)
    ) {
      fileType = "video";
      inputFormat = ext;
      previewUrl = URL.createObjectURL(file);
      selectedFormats = [inputFormat === "mp4" ? "mov" : "mp4"];
      selectionAnchor = selectedFormats[0];

      // Decode audio track from video in background if present
      try {
        const arrayBuffer = await file.arrayBuffer();
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      } catch (err) {
        console.warn(
          "Failed to decode audio track from video (might have no audio):",
          err,
        );
      }
    } else if (["dog", "json", "yml", "yaml", "ts", "js", "md"].includes(ext)) {
      fileType = "data";
      inputFormat = ext === "yaml" ? "yml" : ext;
      selectedFormats = [inputFormat === "dog" ? "json" : "dog"];
      selectionAnchor = selectedFormats[0];
      try {
        rawDataText = await file.text();
      } catch (err) {
        console.error("Failed to read data file for preview:", err);
      }
    } else {
      fileType = "unsupported";
      errorMessage =
        "Unsupported file type. Please upload an image, audio, video, or data (.dog/.json) file.";
      conversionStatus = "error";
    }
  }

  function handleWidthChange(e) {
    targetWidth = parseInt(e.target.value) || 10;
    if (keepAspectRatio && originalWidth > 0) {
      targetHeight = Math.round(targetWidth / (originalWidth / originalHeight));
    }
  }

  function handleHeightChange(e) {
    targetHeight = parseInt(e.target.value) || 10;
    if (keepAspectRatio && originalHeight > 0) {
      targetWidth = Math.round(targetHeight * (originalWidth / originalHeight));
    }
  }

  function handleAspectRatioToggle() {
    keepAspectRatio = !keepAspectRatio;
    if (keepAspectRatio && originalWidth > 0) {
      targetHeight = Math.round(targetWidth / (originalWidth / originalHeight));
    }
  }

  function handleTensToggle() {
    keepTens = !keepTens;
    if (keepTens && originalWidth > 0) {
      // Snap width and height to the nearest 10% increment of original
      const stepW = Math.round(originalWidth * 0.1);
      targetWidth = Math.max(stepW, Math.round(targetWidth / stepW) * stepW);
      if (keepAspectRatio) {
        targetHeight = Math.round(
          targetWidth / (originalWidth / originalHeight),
        );
      } else if (originalHeight > 0) {
        const stepH = Math.round(originalHeight * 0.1);
        targetHeight = Math.max(
          stepH,
          Math.round(targetHeight / stepH) * stepH,
        );
      }
    }
  }

  function resetToOriginal() {
    if (originalWidth > 0 && originalHeight > 0) {
      targetWidth = originalWidth;
      targetHeight = originalHeight;
    }
  }

  function resetState(pushHistoryEntry = true) {
    // Leaving a completed conversion: push a fresh entry so browser Back
    // returns to the completed view (restored via its ?c= id).
    if (
      pushHistoryEntry &&
      currentConversionId &&
      conversionStatus === "done"
    ) {
      const d = (history.state?.depth ?? 2) + 1;
      history.pushState(
        { view: "toolbox", app: "converter", depth: d },
        "",
        "/apps/converter",
      );
    }
    currentConversionId = null;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    convertedFiles.forEach((f) => {
      if (f.url) URL.revokeObjectURL(f.url);
    });
    dataPreviewText = "";
    editingInput = false;
    previewMaximized = false;
    maximizedOutput = null;
    file = null;
    fileType = "";
    inputFormat = "";
    selectedFormats = [];
    selectionAnchor = "";
    conversionStatus = "idle";
    progress = 0;
    previewUrl = "";
    convertedFiles = [];
    zipDownloads = false;
    errorMessage = "";
    audioBuffer = null;
    originalWidth = 0;
    originalHeight = 0;
    targetWidth = 0;
    targetHeight = 0;
    keepAspectRatio = true;
    keepTens = true;
    quality = 92;
    compression = 15;
    audioBitrate = "192";
    audioSampleRate = "keep";
    if (audioContext) {
      audioContext.close();
      audioContext = null;
    }
    bulkFiles = [];
    isConvertingBulk = false;
    overallProgress = 0;
    currentConvertingIndex = 0;
    batchImageFormats = ["png"];
    batchAudioFormats = ["mp3"];
    batchVideoFormats = ["mp4"];
    batchDataFormats = ["json"];
    bulkZipDownloads = false;
    currentNotice = "Refining Format Molecules";
    // Clear the native input too, otherwise re-selecting the same
    // file(s) after a completed run never fires a change event
    const fileInput = document.getElementById("file-input");
    if (fileInput) fileInput.value = "";
  }

  // Run Conversion
  async function startConversion() {
    if (!file || selectedFormats.length === 0) return;
    conversionStatus = "converting";
    progress = 0;
    convertedFiles = [];
    currentNotice = notices[Math.floor(Math.random() * notices.length)];

    try {
      for (let i = 0; i < selectedFormats.length; i++) {
        const currentFormat = selectedFormats[i];
        currentNotice = `Refining Molecule: ${currentFormat.toUpperCase()}`;

        const startProgress = Math.round((i / selectedFormats.length) * 100);
        const endProgress = Math.round(
          ((i + 1) / selectedFormats.length) * 100,
        );
        const progressSpan = endProgress - startProgress;

        let currentSubProgress = 0;
        const interval = setInterval(() => {
          currentSubProgress += 10;
          if (currentSubProgress >= 90) clearInterval(interval);
          progress = Math.round(
            startProgress + (currentSubProgress / 100) * progressSpan,
          );
        }, 100);

        let resultBlob = null;
        let resultFileName = "";

        if (fileType === "image") {
          resultBlob = await convertImage(
            previewUrl,
            currentFormat,
            targetWidth,
            targetHeight,
            quality,
            compression,
          );
          const originalBase = file.name.substring(
            0,
            file.name.lastIndexOf("."),
          );
          resultFileName = `${originalBase}.${currentFormat}`;
        } else if (fileType === "audio") {
          const isTargetVideo = ["mp4", "mov", "mkv", "avi"].includes(
            currentFormat,
          );
          if (!audioBuffer) {
            try {
              const arrayBuffer = await file.arrayBuffer();
              audioContext = new (window.AudioContext ||
                window.webkitAudioContext)();
              audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            } catch (err) {
              console.error("Failed to decode audio data on-the-fly:", err);
            }
          }
          if (isTargetVideo) {
            clearInterval(interval);
            if (!audioBuffer) {
              throw new Error(
                "Failed to decode audio data for video encoding.",
              );
            }
            resultBlob = await convertAudioToVideo(
              audioBuffer,
              currentFormat,
              (pct) => {
                progress = Math.round(
                  startProgress + (pct / 100) * progressSpan,
                );
              },
            );
          } else {
            resultBlob = await convertAudio(
              file,
              audioBuffer,
              currentFormat,
              audioSampleRate,
              compression,
            );
          }
          const originalBase = file.name.substring(
            0,
            file.name.lastIndexOf("."),
          );
          resultFileName = `${originalBase}_converted.${currentFormat}`;
        } else if (fileType === "data") {
          const text = rawDataText || (await file.text());
          resultBlob = convertData(text, inputFormat, currentFormat, dogOpts);
          const originalBase = file.name.substring(
            0,
            file.name.lastIndexOf("."),
          );
          resultFileName = `${originalBase}.${currentFormat}`;
        } else if (fileType === "video") {
          const isTargetAudio = ["mp3", "wav", "m4a", "aac", "webm"].includes(
            currentFormat,
          );
          if (isTargetAudio) {
            if (!audioBuffer) {
              try {
                const arrayBuffer = await file.arrayBuffer();
                audioContext = new (window.AudioContext ||
                  window.webkitAudioContext)();
                audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
              } catch (err) {
                console.error(
                  "Failed to decode video audio track on-the-fly:",
                  err,
                );
              }
            }
            if (!audioBuffer) {
              throw new Error("No audio track detected in this video file.");
            }
            resultBlob = await convertAudio(
              file,
              audioBuffer,
              currentFormat,
              audioSampleRate,
              compression,
            );
          } else {
            resultBlob = await convertVideo(file, currentFormat);
          }
          const originalBase = file.name.substring(
            0,
            file.name.lastIndexOf("."),
          );
          resultFileName = `${originalBase}_converted.${currentFormat}`;
        }

        clearInterval(interval);
        progress = endProgress;

        if (resultBlob) {
          convertedFiles.push({
            blob: resultBlob,
            name: resultFileName,
          });
        }
      }

      // Build previews for every converted output
      for (const item of convertedFiles) {
        const t = item.blob?.type || "";
        if (t.startsWith("image/")) {
          item.kind = "image";
          item.url = URL.createObjectURL(item.blob);
        } else if (t.startsWith("video/")) {
          item.kind = "video";
          item.url = URL.createObjectURL(item.blob);
        } else if (t.startsWith("audio/")) {
          item.kind = "audio";
          item.url = URL.createObjectURL(item.blob);
        } else {
          item.kind = "text";
          try {
            item.text = (await item.blob.text()).slice(0, 2000);
          } catch (err) {
            console.error("Failed to read converted text for preview:", err);
          }
        }
      }

      // Record in session history and give the completed view its own
      // browser-history entry so Back can always return to it.
      try {
        currentConversionId = await saveConversion({
          inputName: file.name,
          inputSize: file.size,
          items: convertedFiles,
        });
        const d = (history.state?.depth ?? 2) + 1;
        history.pushState(
          {
            view: "toolbox",
            app: "converter",
            depth: d,
            conversionId: currentConversionId,
          },
          "",
          `/apps/converter?c=${currentConversionId}`,
        );
      } catch (err) {
        console.warn("Failed to record conversion history:", err);
      }

      progress = 100;
      setTimeout(() => {
        conversionStatus = "done";
      }, 300);
    } catch (err) {
      console.error(err);
      errorMessage =
        err.message || "An error occurred during format conversion.";
      conversionStatus = "error";
    }
  }

  async function downloadFile() {
    if (convertedFiles.length === 0) return;

    if (zipDownloads) {
      const zipData = {};
      convertedFiles.forEach((item) => {
        if (item.blob) zipData[item.name] = item.blob;
      });

      const promises = Object.entries(zipData).map(async ([name, blob]) => {
        const arrayBuffer = await blob.arrayBuffer();
        return { name, data: new Uint8Array(arrayBuffer) };
      });

      try {
        const filesToZip = await Promise.all(promises);
        const blob = await createZip(filesToZip);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const baseName = file
          ? file.name.substring(0, file.name.lastIndexOf("."))
          : "converted";
        a.download = `${baseName}_converted.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Failed to build ZIP archive:", err);
      }
    } else {
      convertedFiles.forEach((item) => {
        if (!item.blob) return;
        const url = URL.createObjectURL(item.blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = item.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }
  }

  function formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  // Directory traversal helpers
  async function traverseEntries(entries) {
    const files = [];
    const queue = [...entries];

    while (queue.length > 0) {
      const entry = queue.shift();
      if (entry.isFile) {
        const fileObj = await getFileFromEntry(entry);
        files.push(fileObj);
      } else if (entry.isDirectory) {
        const dirReader = entry.createReader();
        const subEntries = await readAllEntries(dirReader);
        queue.push(...subEntries);
      }
    }

    if (files.length > 0) {
      processMultipleFiles(files);
    }
  }

  function getFileFromEntry(entry) {
    return new Promise((resolve) => {
      entry.file((file) => resolve(file));
    });
  }

  function readAllEntries(dirReader) {
    return new Promise((resolve) => {
      dirReader.readEntries((entries) => resolve(entries));
    });
  }

  // ZIP file extractor
  async function processZipFile(zipFile) {
    currentNotice = "Extracting ZIP Molecules";
    conversionStatus = "converting";
    progress = 10;

    try {
      const arrayBuffer = await zipFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      unzip(uint8Array)
        .then((unzipped) => {
          const extractedFiles = [];
          for (const [path, data] of Object.entries(unzipped)) {
            if (path.endsWith("/") || data.length === 0) continue;

            const filename = path.split("/").pop();
            const ext = filename.split(".").pop().toLowerCase();

            let mime = "application/octet-stream";
            if (
              ["png", "jpg", "jpeg", "webp", "gif", "avif", "svg"].includes(ext)
            ) {
              mime = `image/${ext === "jpg" || ext === "jpeg" ? "jpeg" : ext}`;
            } else if (
              ["mp3", "wav", "m4a", "aac", "webm", "ogg"].includes(ext)
            ) {
              mime = `audio/${ext}`;
            } else if (["mp4", "mov", "mkv", "avi"].includes(ext)) {
              mime = `video/${ext}`;
            }

            const fileObj = new File([data], filename, { type: mime });
            extractedFiles.push(fileObj);
          }

          if (extractedFiles.length === 0) {
            errorMessage = "No supported files found inside the ZIP.";
            conversionStatus = "error";
            return;
          }

          conversionStatus = "idle";
          processMultipleFiles(extractedFiles);
        })
        .catch((err) => {
          errorMessage = "Could not extract ZIP file: " + err.message;
          conversionStatus = "error";
        });
    } catch (err) {
      errorMessage = "Error reading ZIP file: " + err.message;
      conversionStatus = "error";
    }
  }

  // Process batch list
  function processMultipleFiles(files) {
    const list = [];
    for (const f of files) {
      const name = f.name.toLowerCase();
      const ext = name.split(".").pop();
      let type = "unsupported";
      if (["png", "jpg", "jpeg", "webp", "gif", "avif", "svg"].includes(ext)) {
        type = "image";
      } else if (["mp3", "wav", "m4a", "ogg", "aac", "webm"].includes(ext)) {
        type = "audio";
      } else if (["mp4", "mov", "mkv", "avi"].includes(ext)) {
        type = "video";
      } else if (["dog", "json", "yml", "yaml", "ts", "js", "md"].includes(ext)) {
        type = "data";
      }

      if (type === "unsupported") continue;

      const inputFmt = ext === "jpeg" ? "jpg" : ext;
      let outputFmts = [];
      if (type === "image") outputFmts = [...batchImageFormats];
      else if (type === "audio") outputFmts = [...batchAudioFormats];
      else if (type === "video") outputFmts = [...batchVideoFormats];
      else if (type === "data") outputFmts = [...batchDataFormats];

      list.push({
        file: f,
        fileType: type,
        inputFormat: inputFmt,
        outputFormats: outputFmts,
        status: "idle",
        errorMsg: "",
        progress: 0,
        convertedFiles: [],
        originalWidth: 0,
        originalHeight: 0,
        targetWidth: 0,
        targetHeight: 0,
        keepAspectRatio: true,
        keepTens: false,
        quality: 80,
        compression: 15,
        audioBitrate: "192",
        audioSampleRate: "keep",
      });
    }

    if (list.length === 1) {
      processFile(list[0].file);
    } else if (list.length > 1) {
      bulkFiles = list;
      for (const item of bulkFiles) {
        if (item.fileType === "image") {
          const url = URL.createObjectURL(item.file);
          const img = new Image();
          img.src = url;
          img.onload = () => {
            item.originalWidth = img.naturalWidth;
            item.originalHeight = img.naturalHeight;
            item.targetWidth = img.naturalWidth;
            item.targetHeight = img.naturalHeight;
            URL.revokeObjectURL(url);
          };
        }
      }
    }
  }

  // Bulk convert sequential runner
  async function startBulkConversion() {
    isConvertingBulk = true;
    overallProgress = 0;
    currentConvertingIndex = 0;

    for (let i = 0; i < bulkFiles.length; i++) {
      currentConvertingIndex = i;
      const item = bulkFiles[i];

      const formats = (item.outputFormats || []).filter(Boolean);
      if (item.status === "done" || formats.length === 0) continue;

      item.status = "converting";
      item.progress = 5;
      item.convertedFiles = [];

      try {
        // Decode the audio track once per file, shared across all target formats
        let bulkAudioBuffer = null;
        if (item.fileType === "audio" || item.fileType === "video") {
          try {
            const arrayBuffer = await item.file.arrayBuffer();
            const audioCtx = new (window.AudioContext ||
              window.webkitAudioContext)();
            bulkAudioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
            audioCtx.close();
          } catch (err) {
            console.warn(
              "Failed to decode audio track during batch conversion:",
              err,
            );
          }
        }

        const nameParts = item.file.name.split(".");
        nameParts.pop();
        const baseName = nameParts.join(".");

        for (let fi = 0; fi < formats.length; fi++) {
          const fmt = formats[fi];
          currentNotice = `Converting ${i + 1}/${bulkFiles.length}: ${item.file.name} ➔ ${fmt.toUpperCase()}`;

          let resultBlob = null;
          if (item.fileType === "image") {
            const tempUrl = URL.createObjectURL(item.file);
            try {
              resultBlob = await convertImage(
                tempUrl,
                fmt,
                item.targetWidth || 800,
                item.targetHeight || 600,
                item.quality,
                item.compression,
              );
            } finally {
              URL.revokeObjectURL(tempUrl);
            }
          } else if (item.fileType === "audio" || item.fileType === "video") {
            const isTargetVideo = ["mp4", "mov", "mkv", "avi"].includes(fmt);
            const isTargetAudio = ["mp3", "wav", "m4a", "aac", "webm"].includes(
              fmt,
            );

            if (item.fileType === "audio" && isTargetVideo) {
              if (!bulkAudioBuffer) {
                throw new Error(
                  "Failed to decode audio track for video encoding.",
                );
              }
              resultBlob = await convertAudioToVideo(
                bulkAudioBuffer,
                fmt,
                (p) => {
                  item.progress = Math.round(
                    ((fi + p / 100) / formats.length) * 100,
                  );
                },
              );
            } else if (item.fileType === "video" && isTargetAudio) {
              if (!bulkAudioBuffer) {
                throw new Error("No audio track detected in this video file.");
              }
              resultBlob = await convertAudio(
                item.file,
                bulkAudioBuffer,
                fmt,
                item.audioSampleRate || "keep",
                item.compression || 15,
              );
            } else if (item.fileType === "audio") {
              resultBlob = await convertAudio(
                item.file,
                bulkAudioBuffer,
                fmt,
                item.audioSampleRate || "keep",
                item.compression || 15,
              );
            } else if (item.fileType === "video") {
              resultBlob = await convertVideo(item.file, fmt);
            }
          } else if (item.fileType === "data") {
            const text = await item.file.text();
            resultBlob = convertData(text, item.inputFormat, fmt, dogOpts);
          }

          if (resultBlob) {
            item.convertedFiles.push({
              blob: resultBlob,
              name: `${baseName}.${fmt}`,
            });
          }
          item.progress = Math.round(((fi + 1) / formats.length) * 100);
        }

        item.status = "done";
        item.progress = 100;
      } catch (err) {
        item.status = "error";
        item.errorMsg = err.message || "Conversion failed";
        item.progress = 0;
      }

      overallProgress = Math.round(((i + 1) / bulkFiles.length) * 100);
    }

    isConvertingBulk = false;
    currentNotice = "Batch Processing Complete";
  }

  function triggerDownload(blob, name) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Download every converted file — zipped, or staggered individual downloads
  async function downloadAllConverted() {
    const doneFiles = bulkFiles
      .filter((bf) => bf.status === "done")
      .flatMap((bf) => bf.convertedFiles);

    if (doneFiles.length === 0) return;

    if (bulkZipDownloads) {
      currentNotice = "Zipping Converted Molecules";
      try {
        const filesToZip = await Promise.all(
          doneFiles.map(async ({ name, blob }) => ({
            name,
            data: new Uint8Array(await blob.arrayBuffer()),
          })),
        );
        const blob = await createZip(filesToZip);
        triggerDownload(blob, "catalytic-converted-files.zip");
      } catch (err) {
        alert("Failed to build ZIP archive: " + err.message);
      }
    } else {
      for (const f of doneFiles) {
        triggerDownload(f.blob, f.name);
        // Stagger so the browser doesn't swallow rapid consecutive downloads
        await new Promise((r) => setTimeout(r, 200));
      }
    }
  }

  function batchFormatsFor(type) {
    return type === "image"
      ? batchImageFormats
      : type === "audio"
        ? batchAudioFormats
        : type === "data"
          ? batchDataFormats
          : batchVideoFormats;
  }

  function syncBatchFormats(type) {
    const fmts = batchFormatsFor(type).filter(Boolean);
    for (const bf of bulkFiles) {
      if (bf.fileType === type && bf.status !== "done") {
        bf.outputFormats = [...fmts];
      }
    }
  }

  function setBatchFormat(type, index, fmt) {
    batchFormatsFor(type)[index] = fmt;
    syncBatchFormats(type);
  }

  function addBatchFormat(type) {
    const arr = batchFormatsFor(type);
    const next = formatMap[type].find((f) => !arr.includes(f));
    if (next) {
      arr.push(next);
      syncBatchFormats(type);
    }
  }

  function removeBatchFormat(type, index) {
    const arr = batchFormatsFor(type);
    if (arr.length <= 1) return;
    arr.splice(index, 1);
    syncBatchFormats(type);
  }

  function removeBulkFile(index) {
    bulkFiles = bulkFiles.filter((_, i) => i !== index);
  }
</script>

<div class="converter-app animated-pane">
  <!-- <div class="app-header">
    <div class="title-wrap">
      <span class="converter-flame-icon"><Flame size={24} /></span>
      <h2>Catalytic Converter</h2>
    </div>
    <p class="description">
      a way to convert anything into anything. all data stays in your browser.
      batch file support.
    </p>
  </div> -->

  <input
    type="file"
    id="file-input"
    class="hidden"
    accept="image/*,audio/*,video/*,.zip,.dog,.json,.yml,.yaml,.ts,.js,.md"
    multiple
    onchange={handleFileSelect}
  />

  <div class="app-content-scroll">
    {#if showDogInfo}
      <!-- .DOG FORMAT SPECIFICATION PAGE -->
      <div class="flex flex-col gap-5 font-mono text-white/70 text-xs leading-relaxed">
        <div class="back-bar">
          <button class="back-btn" onclick={() => (showDogInfo = false)} type="button">
            <ArrowLeft size={14} /> Back
          </button>
        </div>

        <div class="flex flex-col gap-1">
          <h2 class="text-2xl font-bold text-[#4ade80] tracking-tight font-sans">
            THE .DOG FORMAT <span class="text-white/30 text-sm align-top">v1</span>
          </h2>
          <p class="text-[10px] text-white/35 uppercase tracking-widest">
            Proprietary text encoding · DOGS Data Interchange Division · MIME text/x-dog
          </p>
        </div>

        <p class="text-white/60 font-sans text-sm max-w-2xl">
          <span class="text-[#4ade80]">.dog</span> is a self-describing, line-oriented,
          punctuation-free data encoding. Where other formats demand quotes, commas,
          colons, and braces, .dog demands <em>nothing</em>. Chicken scratch is
          syntactically legal. The parser bends to the writer, never the reverse.
        </p>

        <!-- Self-describing header -->
        <div class="p-4 rounded-lg bg-white/2 border border-white/5 flex flex-col gap-2">
          <h3 class="text-[11px] font-bold text-white/40 uppercase tracking-wider">Self-Describing Header &amp; Versions</h3>
          <p class="font-sans text-white/55"><span class="text-[#4ade80]">dog 1</span> is the first, non-customizable version of the spec: it uses default rules and has a header with exactly two words [dog versionNumber]. By incrementing the version number to <span class="text-[#4ade80]">dog 2</span>, you get to add customizing keywords to the header, allowing for tremendous flexibility. The document describes itself, and works how you need it to.</p>
          <pre class="bg-black/40 rounded p-2.5 text-[#4ade80]/85 overflow-x-auto select-text cursor-text m-0">dog 1
dog 2 flow=line fs=2space kv=space block=track case=any punct=none bools=10</pre>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-[11px]">
              <thead><tr class="text-white/35 uppercase text-[9px]">
                <th class="py-1 pr-4">rule</th><th class="py-1">meaning</th>
              </tr></thead>
              <tbody class="text-white/60">
                <tr class="border-t border-white/5"><td class="py-1 pr-4 text-[#4ade80]/80 whitespace-nowrap align-top">indent=2</td><td class="py-1 align-top">field lines start with exactly 2 spaces</td></tr>
                <tr class="border-t border-white/5"><td class="py-1 pr-4 text-[#4ade80]/80 whitespace-nowrap align-top">kv=space</td><td class="py-1 align-top">key, one space, value; value runs to end of line</td></tr>
                <tr class="border-t border-white/5"><td class="py-1 pr-4 text-[#4ade80]/80 whitespace-nowrap align-top">block=track</td><td class="py-1 align-top">a block opens at column 0 with <code>track &lt;name&gt;</code></td></tr>
                <tr class="border-t border-white/5"><td class="py-1 pr-4 text-[#4ade80]/80 whitespace-nowrap align-top">end=blank</td><td class="py-1 align-top">a blank line closes the block</td></tr>
                <tr class="border-t border-white/5"><td class="py-1 pr-4 text-[#4ade80]/80 whitespace-nowrap align-top">case=any</td><td class="py-1 align-top">capitalization never matters — keys or values</td></tr>
                <tr class="border-t border-white/5"><td class="py-1 pr-4 text-[#4ade80]/80 whitespace-nowrap align-top">punct=none</td><td class="py-1 align-top">no quotes, commas, colons, or semicolons. ever.</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Type coercion + continuation -->
        <div class="p-4 rounded-lg bg-white/2 border border-white/5 flex flex-col gap-2">
          <h3 class="text-[11px] font-bold text-white/40 uppercase tracking-wider">DOGS, the file format, why?</h3>
          <p class="font-sans text-white/55">Could you imagine an internet where the data being passed around globally does not contain trillions of repeated curly braces, or hyphens, or semicolons, or anything unnecessary? .dog is here to fix that. This spec is still in development, but the goal is a full set of parsers and converters that can aid integration in many languages and applications, along with as much customization such that json yml and other formats can be valid .dog syntax too.</p>
          <p class="font-sans text-white/55">For now, the following is valid DOGS syntax.</p>
          <pre class="bg-black/40 rounded p-2.5 text-[#4ade80]/85 overflow-x-auto select-text cursor-text m-0">track GRIEF2
  sampleHeavy true
  sampleInfo : 13 Years of Grief by Black Label Society,
              no change in pitch at all,
            "chopped a little" {"{}"}::``  ← all legal, all preserved</pre>
            <p class="font-sans text-white/55">Try converting various JSON objects into DOGS objects, play around with the customizer, and use it in different ways.</p>
        </div>

        <!-- Comparison -->
        <div class="p-4 rounded-lg bg-white/2 border border-white/5 flex flex-col gap-2">
          <h3 class="text-[11px] font-bold text-white/40 uppercase tracking-wider">Comparative Analysis</h3>
          <div class="overflow-x-auto">
            <table class="w-full min-w-[560px] text-left text-[11px]">
              <thead><tr class="text-white/35 uppercase text-[9px]">
                <th class="py-1 pr-3"></th>
                <th class="py-1 pr-3 text-[#4ade80] whitespace-nowrap">.dog</th>
                <th class="py-1 pr-3 whitespace-nowrap">JSON</th>
                <th class="py-1 pr-3 whitespace-nowrap">YAML</th>
                <th class="py-1 pr-3 whitespace-nowrap">XML</th>
              </tr></thead>
              <tbody class="text-white/60">
                <tr class="border-t border-white/5"><td class="py-1 pr-3 text-white/40">quotes required</td><td class="py-1 pr-3 align-top text-[#4ade80]">never</td><td class="py-1 pr-3 align-top">always</td><td class="py-1 pr-3 align-top">sometimes*</td><td class="py-1 pr-3 align-top">attributes</td></tr>
                <tr class="border-t border-white/5"><td class="py-1 pr-3 text-white/40">trailing comma crash</td><td class="py-1 pr-3 align-top text-[#4ade80]">impossible</td><td class="py-1 pr-3 align-top">yes</td><td class="py-1 pr-3 align-top">n/a</td><td class="py-1 pr-3 align-top">n/a</td></tr>
                <tr class="border-t border-white/5"><td class="py-1 pr-3 text-white/40">*"sometimes" rules to memorize</td><td class="py-1 pr-3 align-top text-[#4ade80]">0</td><td class="py-1 pr-3 align-top">0</td><td class="py-1 pr-3 align-top">~63</td><td class="py-1 pr-3 align-top">~9</td></tr>
                <tr class="border-t border-white/5"><td class="py-1 pr-3 text-white/40">self-describing</td><td class="py-1 pr-3 align-top text-[#4ade80]">line 1</td><td class="py-1 pr-3 align-top">no</td><td class="py-1 pr-3 align-top">no</td><td class="py-1 pr-3 align-top">DTD (lol)</td></tr>
                <tr class="border-t border-white/5"><td class="py-1 pr-3 text-white/40">handwriting tolerance</td><td class="py-1 pr-3 align-top text-[#4ade80]">chicken scratch</td><td class="py-1 pr-3 align-top">strict</td><td class="py-1 pr-3 align-top">indent-fragile</td><td class="py-1 pr-3 align-top">hostile</td></tr>
                <tr class="border-t border-white/5"><td class="py-1 pr-3 text-white/40">size (80-track catalog)</td><td class="py-1 pr-3 align-top text-[#4ade80]">15,649 B</td><td class="py-1 pr-3 align-top">21,618 B (+38%)</td><td class="py-1 pr-3 align-top">~18,900 B (+21%)</td><td class="py-1 pr-3 align-top">~29,000 B (+85%)</td></tr>
                <tr class="border-t border-white/5"><td class="py-1 pr-3 text-white/40">reference parser</td><td class="py-1 pr-3 align-top text-[#4ade80]">~60 lines</td><td class="py-1 pr-3 align-top">native</td><td class="py-1 pr-3 align-top">libyaml: ~19k lines</td><td class="py-1 pr-3 align-top">expat: ~15k lines</td></tr>
                <tr class="border-t border-white/5"><td class="py-1 pr-3 text-white/40">nesting</td><td class="py-1 pr-3 align-top text-red-400">flat blocks only</td><td class="py-1 pr-3 align-top">arbitrary</td><td class="py-1 pr-3 align-top">arbitrary</td><td class="py-1 pr-3 align-top">arbitrary</td></tr>
                <tr class="border-t border-white/5"><td class="py-1 pr-3 text-white/40">keys with spaces</td><td class="py-1 pr-3 align-top text-red-400">no</td><td class="py-1 pr-3 align-top">yes</td><td class="py-1 pr-3 align-top">yes</td><td class="py-1 pr-3 align-top">no</td></tr>
                <tr class="border-t border-white/5"><td class="py-1 pr-3 text-white/40">values starting with spaces</td><td class="py-1 pr-3 align-top text-red-400">trimmed</td><td class="py-1 pr-3 align-top">preserved</td><td class="py-1 pr-3 align-top">quoted</td><td class="py-1 pr-3 align-top">preserved</td></tr>
              </tbody>
            </table>
          </div>
          <p class="text-[10px] text-white/35 font-sans">Honest cons in red. A flat, typeless, line-based format cannot nest and does not pretend to. If you need nesting, convert to JSON — the converter is right behind you.</p>
        </div>

        <!-- The punctuation tax -->
        <div class="p-4 rounded-lg bg-white/2 border border-white/5 flex flex-col gap-2">
          <h3 class="text-[11px] font-bold text-white/40 uppercase tracking-wider">The Punctuation Tax</h3>
          <p class="font-sans text-white/55">Identical payload, measured (music-catalog, 80 blocks, 10 fields each):</p>
          <div class="flex flex-col gap-1.5">
            <div class="flex items-center gap-2"><span class="w-10 text-[#4ade80]">.dog</span><div class="h-3 rounded bg-[#4ade80]/70" style="width: 54%"></div><span class="text-white/40 whitespace-nowrap shrink-0">15.6 KB</span></div>
            <div class="flex items-center gap-2"><span class="w-10 text-white/50">.yml</span><div class="h-3 rounded bg-white/25" style="width: 65%"></div><span class="text-white/40 whitespace-nowrap shrink-0">~18.9 KB</span></div>
            <div class="flex items-center gap-2"><span class="w-10 text-white/50">.ts</span><div class="h-3 rounded bg-white/25" style="width: 70%"></div><span class="text-white/40 whitespace-nowrap shrink-0">20.5 KB</span></div>
            <div class="flex items-center gap-2"><span class="w-10 text-white/50">.json</span><div class="h-3 rounded bg-white/25" style="width: 74%"></div><span class="text-white/40 whitespace-nowrap shrink-0">21.6 KB</span></div>
          </div>
          <p class="text-[10px] text-white/35 font-sans">Every byte JSON spends on <code>"":,{"{}"}</code> is a byte .dog spends on data. 38% overhead, zero information gained.</p>
        </div>

        <!-- Showcase -->
        <div class="p-4 rounded-lg bg-white/2 border border-white/5 flex flex-col gap-3">
          <h3 class="text-[11px] font-bold text-white/40 uppercase tracking-wider">Where It Shines</h3>

          <div class="flex flex-col gap-1">
            <span class="text-[#4ade80] font-bold">🤖 LLM context &amp; config</span>
            <p class="font-sans text-white/55 m-0">Uncompressed bytes are tokens, and tokens are money. .dog carries none of JSON's <code>"":,{"{}"}</code> token tax — the same data costs ~30% fewer tokens in a prompt. The thinnest way to hand structured data to a model.</p>
          </div>

          <div class="flex flex-col gap-1">
            <span class="text-[#4ade80] font-bold">📱 Typed on a phone</span>
            <p class="font-sans text-white/55 m-0">Every character in a .dog file is on the primary mobile keyboard. JSON demands a symbol-layer trip for every brace, quote, colon, and comma. Field notes, inventories, set lists — thumbs only.</p>
          </div>

          <div class="flex flex-col gap-1">
            <span class="text-[#4ade80] font-bold">📊 CSV without the comma problem</span>
            <p class="font-sans text-white/55 m-0">CSV dies the moment a value contains a comma, then invents quoting, then invents escaped quotes. .dog has zero reserved characters. <code class="text-[#4ade80]/80">venue Tulsa, OK</code> just works.</p>
          </div>

          <div class="flex flex-col gap-1">
            <span class="text-[#4ade80] font-bold">🔀 Clean git diffs</span>
            <p class="font-sans text-white/55 m-0">One field per line, no trailing commas. Changing one value is a one-line diff; adding a field never touches its neighbors. JSON's comma churn and bracket reflow disappear.</p>
          </div>

          <div class="flex flex-col gap-1">
            <span class="text-[#4ade80] font-bold">📡 Append-only logs &amp; streams</span>
            <p class="font-sans text-white/55 m-0">A JSON array can't be appended to without rewriting the file. A .dog file can: <code class="text-[#4ade80]/80">echo a new block &gt;&gt; events.dog</code>. Tail it, grep it, stream it one block per line.</p>
          </div>

          <div class="flex flex-col gap-1">
            <span class="text-[#4ade80] font-bold">🎵 Human catalogs (the origin story)</span>
            <p class="font-sans text-white/55 m-0">Built to catalog 80 mixtape tracks by hand. Chicken scratch, half-remembered sample notes, and mid-thought line breaks all parse — because the parser bends to the writer.</p>
          </div>

          <p class="text-[10px] text-white/35 font-sans m-0">Honest caveat: over a gzipped wire, JSON's punctuation compresses away — the raw-byte win matters where data lives uncompressed: prompts, editors, terminals, diffs, and thumbs.</p>
        </div>
      </div>
    {:else if isBulkMode}
      <!-- BULK DASHBOARD -->
      <div class="bulk-mode-container">
        <!-- Back and Reset -->
        <div class="back-bar flex items-center justify-between w-full">
          <button class="back-btn" onclick={resetState} type="button">
            <ArrowLeft size={14} />
          </button>
        </div>

        <!-- Global Batch Presets -->
        <div class="bulk-batch-header">
          <div class="batch-title">Batch Output Formats</div>
          <div class="batch-presets">
            {#each [["image", "🖼️ Images", batchImageFormats], ["audio", "🎵 Audios", batchAudioFormats], ["video", "🎞️ Videos", batchVideoFormats], ["data", "🐶 Data", batchDataFormats]] as [type, label, fmts]}
              {#if bulkFiles.some((f) => f.fileType === type)}
                <div class="preset-group">
                  <span>{label} ➔</span>
                  {#each fmts as fmt, i}
                    <span class="preset-chip">
                      <select
                        value={fmt}
                        onchange={(e) =>
                          setBatchFormat(type, i, e.target.value)}
                        class="preset-select"
                        disabled={isConvertingBulk}
                      >
                        {#each formatMap[type] as opt}
                          <option
                            value={opt}
                            disabled={opt !== fmt && fmts.includes(opt)}
                            >{opt.toUpperCase()}</option
                          >
                        {/each}
                      </select>
                      {#if fmts.length > 1}
                        <button
                          class="chip-remove"
                          onclick={() => removeBatchFormat(type, i)}
                          disabled={isConvertingBulk}
                          type="button"
                          title="Remove this output format"
                        >
                          ×
                        </button>
                      {/if}
                    </span>
                  {/each}
                  {#if fmts.length < formatMap[type].length}
                    <button
                      class="chip-add"
                      onclick={() => addBatchFormat(type)}
                      disabled={isConvertingBulk}
                      type="button"
                      title="Add another output format"
                    >
                      +
                    </button>
                  {/if}
                </div>
              {/if}
            {/each}
          </div>
        </div>

        <!-- Scrollable Files List -->
        <div class="bulk-file-list">
          {#each bulkFiles as item, index}
            <div class="bulk-file-card">
              <div class="file-info">
                <div class="mini-preview">
                  {#if item.fileType === "image"}
                    <FileImage size={18} class="text-[#ff5e00]" />
                  {:else if item.fileType === "audio"}
                    <FileAudio size={18} class="text-[#00ffff]" />
                  {:else if item.fileType === "video"}
                    <FileVideo size={18} class="text-[#a855f7]" />
                  {:else if item.fileType === "data"}
                    <FileJson size={18} class="text-[#4ade80]" />
                  {/if}
                </div>
                <div class="meta">
                  <span class="name" title={item.file.name}
                    >{item.file.name}</span
                  >
                  <span class="size">{formatBytes(item.file.size)}</span>
                </div>
              </div>

              <div class="controls-status">
                <div class="file-format-cell">
                  <select
                    value={item.outputFormats[0]}
                    onchange={(e) => (item.outputFormats[0] = e.target.value)}
                    class="format-selector"
                    disabled={isConvertingBulk || item.status === "done"}
                  >
                    {#each formatMap[item.fileType] || [] as fmt}
                      <option value={fmt}>{fmt.toUpperCase()}</option>
                    {/each}
                  </select>
                  {#if item.outputFormats.length > 1}
                    <span
                      class="extra-formats"
                      title={"Also converting to: " +
                        item.outputFormats
                          .slice(1)
                          .map((f) => f.toUpperCase())
                          .join(", ")}
                    >
                      +{item.outputFormats.length - 1}
                    </span>
                  {/if}
                </div>

                <div
                  class="status-badge"
                  class:idle={item.status === "idle"}
                  class:converting={item.status === "converting"}
                  class:done={item.status === "done"}
                  class:error={item.status === "error"}
                >
                  {#if item.status === "idle"}
                    <span class="text-white/20">•</span>
                  {:else if item.status === "converting"}
                    <Loader2 size={12} class="animate-spin text-[#ff8800]" />
                  {:else if item.status === "done"}
                    <CheckCircle size={12} class="text-[#4ade80]" />
                  {:else if item.status === "error"}
                    <AlertCircle
                      size={12}
                      class="text-[#f87171]"
                      title={item.errorMsg}
                    />
                  {/if}
                </div>

                {#if item.status === "done" && item.convertedFiles.length > 0}
                  <button
                    class="item-action-btn"
                    onclick={async () => {
                      for (const cf of item.convertedFiles) {
                        triggerDownload(cf.blob, cf.name);
                        await new Promise((r) => setTimeout(r, 200));
                      }
                    }}
                    disabled={isConvertingBulk}
                    type="button"
                    title="Download converted file(s)"
                  >
                    <Download size={12} />
                  </button>
                {:else}
                  <button
                    class="item-action-btn delete-btn"
                    onclick={() => removeBulkFile(index)}
                    disabled={isConvertingBulk}
                    type="button"
                    title="Remove from batch"
                  >
                    <Trash2 size={12} />
                  </button>
                {/if}
              </div>
            </div>
          {/each}
        </div>

        {#if isConvertingBulk || bulkFiles.some((f) => f.status === "done" || f.status === "error")}
          <div class="bulk-progress-panel">
            <div class="progress-header">
              <span>Overall Progress</span>
              <span>{overallProgress}%</span>
            </div>
            <div class="progress-bar-wrap w-full!">
              <div
                class="progress-bar-fill"
                style="width: {overallProgress}%"
              ></div>
            </div>
            <div class="text-[10px] text-white/40 mt-1 font-mono text-center">
              {currentNotice}
            </div>
          </div>
        {/if}

        <!-- Actions -->
        <div class="bulk-actions-row">
          <button
            class="action-btn secondary"
            onclick={resetState}
            disabled={isConvertingBulk}
            type="button"
          >
            Clear
          </button>

          <div class="flex items-center gap-3">
            <label
              class="flex items-center gap-2 text-xs text-white/50 cursor-pointer select-none hover:text-white/70 transition-colors"
              class:opacity-40={isConvertingBulk}
            >
              <input
                type="checkbox"
                bind:checked={bulkZipDownloads}
                disabled={isConvertingBulk}
                class="accent-[#ff5e00] rounded border-white/10"
              />
              <span>Zip</span>
            </label>
            {#if bulkFiles.some((f) => f.status === "done")}
              <button
                class="action-btn download m-0!"
                onclick={downloadAllConverted}
                disabled={!bulkAllComplete}
                type="button"
              >
                <Download size={14} /> DOWNLOAD ALL
              </button>
            {:else}
              <button
                class="action-btn convert-launch m-0!"
                onclick={startBulkConversion}
                disabled={isConvertingBulk || bulkFiles.length === 0}
                type="button"
              >
                <RefreshCw
                  size={14}
                  class={isConvertingBulk ? "animate-spin" : ""}
                /> BATCH CONVERT
              </button>
            {/if}
          </div>
        </div>
      </div>
    {:else if conversionStatus === "idle" && !file}
      <!-- UPLOAD ZONE -->
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
      <div
        class="upload-dropzone relative"
        class:dragging={isDragging}
        ondragover={handleDragOver}
        ondragleave={handleDragLeave}
        ondrop={handleDrop}
        onclick={() => document.getElementById("file-input").click()}
        role="button"
        tabindex="0"
      >
        <button
          class="absolute top-2 right-2 px-2 py-1 rounded bg-black/40 border border-white/10 text-[10px] text-white/50 hover:text-[#4ade80] hover:border-[#4ade80]/40 font-mono uppercase cursor-pointer transition-colors"
          onclick={(e) => {
            e.stopPropagation();
            startTextEntry();
          }}
          type="button"
          title="Paste or type data instead of uploading a file"
        >
          ⌨️ paste / type text
        </button>
        <div class="icon-wrap">
          <Upload size={38} />
        </div>
        <h3>Drop file or click to select</h3>
        <p class="upload-sub">
          Supports JPG, PNG, WEBP, AVIF, SVG, MP3, WAV, M4A, AAC, WEBM, MP4,
          MOV, MKV, AVI, DOG, JSON, YML, TS, JS, MD
        </p>
      </div>

      <!-- Supported formats legend -->
      <div
        class="supported-formats-legend mt-4 p-4 rounded-lg bg-white/2 border border-white/5 flex flex-col gap-2.5"
      >
        <h4
          class="text-xs font-bold text-white/40 uppercase tracking-wider font-mono"
        >
          SUPPORTED CONVERSIONS
        </h4>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans text-white/70"
        >
          <div class="flex flex-col gap-1.5">
            <span class="font-bold text-[#ff5e00]">🖼️ IMG</span>
            <div class="flex flex-wrap items-center gap-2">
              <span
                class="px-1.5 py-0.5 rounded bg-white/5 font-mono text-[10px]"
                >JPG</span
              >
              <span class="text-white/30 font-mono">➔</span>
              <span
                class="px-1.5 py-0.5 rounded bg-white/5 font-mono text-[10px]"
                >PNG</span
              >
              <span class="text-white/30 font-mono">➔</span>
              <span
                class="px-1.5 py-0.5 rounded bg-white/5 font-mono text-[10px]"
                >WEBP</span
              >
              <span class="text-white/30 font-mono">➔</span>
              <span
                class="px-1.5 py-0.5 rounded bg-white/5 font-mono text-[10px]"
                >AVIF</span
              >
              <span class="text-white/30 font-mono">➔</span>
              <span
                class="px-1.5 py-0.5 rounded bg-white/5 font-mono text-[10px]"
                >SVG</span
              >
            </div>
          </div>
          <div class="flex flex-col gap-1.5">
            <span class="font-bold text-[#00ffff]">🎵 AUDIO</span>
            <div class="flex flex-wrap items-center gap-2">
              <span
                class="px-1.5 py-0.5 rounded bg-white/5 font-mono text-[10px]"
                >MP3</span
              >
              <span class="text-white/30 font-mono">➔</span>
              <span
                class="px-1.5 py-0.5 rounded bg-white/5 font-mono text-[10px]"
                >WAV</span
              >
              <span class="text-white/30 font-mono">➔</span>
              <span
                class="px-1.5 py-0.5 rounded bg-white/5 font-mono text-[10px]"
                >M4A</span
              >
              <span class="text-white/30 font-mono">➔</span>
              <span
                class="px-1.5 py-0.5 rounded bg-white/5 font-mono text-[10px]"
                >AAC</span
              >
              <span class="text-white/30 font-mono">➔</span>
              <span
                class="px-1.5 py-0.5 rounded bg-white/5 font-mono text-[10px]"
                >WEBM</span
              >
            </div>
          </div>
          <div class="flex flex-col gap-1.5">
            <span class="flex items-center gap-2">
              <span class="font-bold text-[#4ade80]">🐶 DATA</span>
              <button
                class="px-1.5 py-0.5 rounded bg-[#4ade80]/10 border border-[#4ade80]/30 text-[9px] text-[#4ade80] hover:bg-[#4ade80]/20 font-mono uppercase cursor-pointer transition-colors"
                onclick={() => (showDogInfo = true)}
                type="button"
                title="Read the .dog format specification"
              >
                .DOG SPEC
              </button>
            </span>
            <div class="flex flex-wrap items-center gap-2">
              <span
                class="px-1.5 py-0.5 rounded bg-white/5 font-mono text-[10px]"
                >DOG</span
              >
              <span class="text-white/30 font-mono">➔</span>
              <span
                class="px-1.5 py-0.5 rounded bg-white/5 font-mono text-[10px]"
                >JSON</span
              >
              <span class="text-white/30 font-mono">➔</span>
              <span
                class="px-1.5 py-0.5 rounded bg-white/5 font-mono text-[10px]"
                >JS</span
              >
              <span class="text-white/30 font-mono">➔</span>
              <span
                class="px-1.5 py-0.5 rounded bg-white/5 font-mono text-[10px]"
                >YML</span
              >
              <span class="text-white/30 font-mono">➔</span>
              <span
                class="px-1.5 py-0.5 rounded bg-white/5 font-mono text-[10px]"
                >TS</span
              >
              <span class="text-white/30 font-mono">➔</span>
              <span
                class="px-1.5 py-0.5 rounded bg-white/5 font-mono text-[10px]"
                >MD</span
              >
            </div>
          </div>
          <div class="flex flex-col gap-1.5">
            <span class="font-bold text-[#a855f7]">🎞️ VID</span>
            <div class="flex flex-wrap items-center gap-2">
              <span
                class="px-1.5 py-0.5 rounded bg-white/5 font-mono text-[10px]"
                >MP4</span
              >
              <span class="text-white/30 font-mono">➔</span>
              <span
                class="px-1.5 py-0.5 rounded bg-white/5 font-mono text-[10px]"
                >MOV</span
              >
              <span class="text-white/30 font-mono">➔</span>
              <span
                class="px-1.5 py-0.5 rounded bg-white/5 font-mono text-[10px]"
                >MKV</span
              >
              <span class="text-white/30 font-mono">➔</span>
              <span
                class="px-1.5 py-0.5 rounded bg-white/5 font-mono text-[10px]"
                >AVI</span
              >
            </div>
          </div>
        </div>
      </div>
      <!-- Conversion history (this browser session) -->
      {#if conversions.entries.length > 0}
        <div
          class="mt-4 p-4 rounded-lg bg-white/2 border border-white/5 flex flex-col gap-2.5"
        >
          <div class="flex items-center justify-between">
            <h4
              class="text-xs font-bold text-white/40 uppercase tracking-wider font-mono"
            >
              CONVERSION HISTORY
            </h4>
            <button
              class="text-[10px] font-mono text-white/30 hover:text-red-400 transition-colors uppercase"
              onclick={clearConversions}
              type="button"
            >
              Clear
            </button>
          </div>
          <div class="flex flex-col gap-1.5 max-h-50 overflow-y-auto pr-1">
            {#each [...conversions.entries].reverse() as h (h.id)}
              <button
                class="flex items-center justify-between gap-3 text-left text-xs font-mono bg-white/2 hover:bg-white/6 border border-white/5 rounded-lg px-3 py-2 transition-colors cursor-pointer"
                onclick={() => openHistoryEntry(h.id)}
                type="button"
                title="Reopen this conversion"
              >
                <span class="text-white/70 truncate flex-1">{h.inputName}</span>
                <span class="text-white/35 shrink-0"
                  >➔ {h.items.map((i) => i.name.split(".").pop().toUpperCase()).join(", ")}</span
                >
                <span class="text-white/25 shrink-0"
                  >{new Date(h.ts).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}</span
                >
              </button>
            {/each}
          </div>
        </div>
      {/if}
    {:else if conversionStatus === "converting"}
      <!-- CONVERTING STATE -->
      <div class="converting-panel">
        <div class="engine-wrap">
          <div class="catalytic-canister">
            <div class="honeycomb-grid">
              <span class="spark s1"></span>
              <span class="spark s2"></span>
              <span class="spark s3"></span>
            </div>
            <span class="cylinder-flame"><Flame size={48} /></span>
          </div>
        </div>
        <h3>{currentNotice}...</h3>
        <div class="progress-bar-wrap">
          <div class="progress-bar-fill" style="width: {progress}%"></div>
        </div>
        <p class="progress-text">{progress}% Completed</p>
      </div>
    {:else if conversionStatus === "done"}
      <!-- SUCCESS PANEL -->
      <div class="success-panel">
        <CheckCircle class="text-green-400" size={54} />
        <h3>Conversion Complete!</h3>
        <div
          class="flex flex-col gap-2 w-full max-w-105 max-h-[38vh] overflow-y-auto pr-1 mx-auto"
        >
          {#each convertedFiles as item}
            <div
              class="converted-info-card p-3! flex flex-col! gap-2 text-left w-full max-w-none!"
            >
              <div class="flex flex-row items-center justify-between gap-3">
                <span class="filename text-[11px]! truncate flex-1"
                  >{item.name}</span
                >
                <span class="filesize text-[10px]! shrink-0"
                  >{formatBytes(item.blob?.size || 0)}</span
                >
                {#if file && file.size > 0 && item.blob}
                  <span
                    class="text-[10px] font-mono shrink-0"
                    class:text-green-400={item.blob.size <= file.size}
                    class:text-red-400={item.blob.size > file.size}
                    title="Size vs original ({formatBytes(file.size)})"
                  >
                    {item.blob.size <= file.size ? "" : "+"}{Math.round(
                      ((item.blob.size - file.size) / file.size) * 100,
                    )}%
                  </span>
                {/if}
                {#if item.kind === "text" && item.blob}
                  <button
                    class="px-2 py-0.5 rounded bg-black/40 border border-white/10 text-[9px] text-white/60 hover:text-white font-mono uppercase shrink-0 cursor-pointer transition-colors"
                    onclick={() => copyPreviewText(item.blob, item.name)}
                    type="button"
                    title="Copy full converted text"
                  >
                    {copiedKey === item.name ? "Copied!" : "Copy"}
                  </button>
                  <button
                    class="px-2 py-0.5 rounded bg-black/40 border border-white/10 text-[9px] text-white/60 hover:text-white font-mono uppercase shrink-0 cursor-pointer transition-colors"
                    onclick={() => expandOutput(item)}
                    type="button"
                    title="View full screen"
                    aria-label="View {item.name} full screen"
                  >
                    ⤢
                  </button>
                {/if}
              </div>
              {#if item.kind === "text" && item.text}
                <pre
                  class="w-full max-h-32 overflow-y-auto text-[9px] leading-snug font-mono text-white/60 whitespace-pre-wrap bg-black/30 rounded p-2 m-0 select-text cursor-text">{item.text}</pre>
              {:else if item.kind === "image" && item.url}
                <img
                  src={item.url}
                  alt="{item.name} preview"
                  class="w-full max-h-40 object-contain rounded bg-black/30"
                />
              {:else if item.kind === "audio" && item.url}
                <audio controls src={item.url} class="w-full h-8"></audio>
              {:else if item.kind === "video" && item.url}
                <!-- svelte-ignore a11y_media_has_caption -->
                <video
                  controls
                  src={item.url}
                  class="w-full max-h-40 rounded bg-black/30"
                ></video>
              {/if}
            </div>
          {/each}
        </div>

        {#if convertedFiles.length > 1}
          <label
            class="flex items-center gap-2 text-xs text-white/50 cursor-pointer select-none mt-2 hover:text-white/70 transition-colors"
          >
            <input
              type="checkbox"
              bind:checked={zipDownloads}
              class="accent-[#ff5e00] rounded border-white/10"
            />
            <span>Zip</span>
          </label>
        {/if}

        <div class="success-actions">
          <button class="action-btn download" onclick={downloadFile}>
            <Download size={16} /> DOWNLOAD {#if convertedFiles.length > 1 && !zipDownloads}ALL{/if}
          </button>
          {#if convertedFiles.some((it) => it.kind === "text" && it.blob && /\.(dog|json|yml|ts|js|md)$/.test(it.name))}
            <button
              class="action-btn secondary"
              onclick={() =>
                reconvertOutput(
                  convertedFiles.find(
                    (it) =>
                      it.kind === "text" &&
                      it.blob &&
                      /\.(dog|json|yml|ts|js|md)$/.test(it.name),
                  ),
                )}
              title="Feed the output back in and convert it to another format"
            >
              ♻ RECONVERT
            </button>
          {/if}
          <button class="action-btn secondary" onclick={resetState}>
            CONVERT ANOTHER
          </button>
        </div>
      </div>
    {:else if conversionStatus === "error"}
      <!-- ERROR PANEL -->
      <div class="error-panel">
        <AlertCircle class="text-red-400" size={54} />
        <h3>Refinement Failed</h3>
        <p class="error-msg">{errorMessage}</p>
        <button class="action-btn secondary" onclick={resetState}>
          TRY AGAIN
        </button>
      </div>
    {:else}
      <!-- FILE LOADED, CHOOSE OUTPUT -->
      <div
        class="file-loaded-panel"
        class:max-h-full={fileType === "data"}
        class:overflow-hidden={fileType === "data"}
      >
        <div class="back-bar">
          <button class="back-btn" onclick={resetState}>
            <ArrowLeft size={14} /> Back
          </button>
        </div>

        <div
          class={fileType === "data"
            ? "flex flex-col gap-4 w-full flex-1 min-h-0"
            : "grid grid-cols-1 sm:grid-cols-12 gap-5 md:gap-6 items-start w-full"}
        >
          <!-- Left Column (full-width on top for data files) -->
          <div
            class={"flex flex-col gap-4 " +
              (fileType === "data" ? "flex-1 min-h-0" : "sm:col-span-6")}
          >
            <div
              class={"meta-section" +
                (fileType === "data"
                  ? showDogEncoding
                    ? " flex-col sm:flex-row"
                    : " flex-col"
                  : "") +
                (fileType === "data" && previewMaximized
                  ? " fixed inset-0 z-[99999] bg-black! max-h-[100dvh] rounded-none!"
                  : "")}
              class:flex-1={fileType === "data"}
              class:min-h-0={fileType === "data"}
              class:items-stretch={fileType === "data" && showDogEncoding}
            >
              {#if fileType === "image"}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div
                  class="preview-box image-preview cursor-pointer hover:opacity-80 transition-opacity relative group"
                  onclick={() => document.getElementById("file-input").click()}
                  title="Click to select another file"
                >
                  <img src={previewUrl} alt="Upload preview" />
                  <div
                    class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-[10px] text-white font-bold font-sans uppercase"
                  >
                    Replace
                  </div>
                </div>
              {:else if fileType === "audio"}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div
                  class="preview-box audio-preview cursor-pointer hover:opacity-80 transition-opacity relative group"
                  onclick={() => document.getElementById("file-input").click()}
                  title="Click to select another file"
                >
                  <FileAudio size={48} class="text-[#00ffff]" />
                  <span class="audio-badge">Audio Wave Decoded</span>
                  <div
                    class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-[10px] text-white font-bold font-sans uppercase"
                  >
                    Replace
                  </div>
                </div>
              {:else if fileType === "data"}
                <div
                  class="preview-box audio-preview w-full! h-auto! flex-1 min-w-0 min-h-20 relative group"
                >
                  <!-- top left: file info chip (truncates with … before it can hit Customize) -->
                  <span
                    class="absolute top-1.5 left-2 z-10 max-w-[calc(100%-150px)] overflow-hidden text-ellipsis whitespace-nowrap text-[9px] font-mono text-white/50 bg-black/60 px-1.5 py-0.5 rounded pointer-events-none"
                    >{file.name} · {formatBytes(file.size)}{previewFmt &&
                    previewFmt !== inputFormat
                      ? ` · ${inputFormat.toUpperCase()} ➔ ${previewFmt.toUpperCase()} · ${formatBytes(previewSize)}`
                      : ` · ${inputFormat.toUpperCase()}`}{#if previewFmt && previewFmt !== inputFormat && file?.size}
                      {" "}<span
                        class={previewSize <= file.size
                          ? "text-green-400"
                          : "text-red-400"}
                        >({previewSize <= file.size ? "" : "+"}{Math.round(
                          ((previewSize - file.size) / file.size) * 100,
                        )}%)</span
                      >{/if}</span
                  >
                  <!-- top right: Customize + full screen, always -->
                  <div class="absolute top-1.5 right-1.5 z-10 flex gap-1.5">
                    {#if selectedFormats.includes("dog")}
                      <button
                        class={"px-1.5 py-0.5 rounded text-[9px] font-mono uppercase border transition-colors cursor-pointer " +
                          (showDogEncoding
                            ? "border-[#4ade80]/60 text-[#4ade80] bg-[#4ade80]/10"
                            : "border-white/10 text-white/50 bg-black/60 hover:text-white")}
                        onclick={() => (showDogEncoding = !showDogEncoding)}
                        type="button"
                        title="Customize the .dog encoding header"
                      >
                        Customize
                      </button>
                    {/if}
                    <button
                      class={"px-1.5 py-0.5 rounded text-[9px] font-mono uppercase border transition-colors cursor-pointer " +
                        (previewMaximized
                          ? "border-[#4ade80]/60 text-[#4ade80] bg-[#4ade80]/10"
                          : "border-white/10 text-white/50 bg-black/60 hover:text-white")}
                      onclick={() => (previewMaximized = !previewMaximized)}
                      type="button"
                      title={previewMaximized
                        ? "Exit full screen (Esc)"
                        : "Full screen"}
                      aria-label={previewMaximized
                        ? "Exit full screen"
                        : "Full screen"}
                    >
                      {previewMaximized ? "⤡" : "⤢"}
                    </button>
                  </div>
                  <!-- bottom right: Copy + Replace -->
                  <div
                    class="absolute bottom-1.5 right-1.5 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <button
                      class={"px-2 py-0.5 rounded border text-[10px] font-mono uppercase cursor-pointer transition-colors " +
                        (editingInput
                          ? "border-[#4ade80]/60 text-[#4ade80] bg-[#4ade80]/10"
                          : "bg-black/60 border-white/10 text-white/70 hover:text-white")}
                      onclick={() => (editingInput = !editingInput)}
                      type="button"
                      title="Type or paste directly into the preview"
                    >
                      {editingInput ? "Done" : "Edit"}
                    </button>
                    <button
                      class="px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[10px] text-white/70 hover:text-white font-mono uppercase cursor-pointer"
                      onclick={() => copyPreviewText(previewFullText, "input")}
                      type="button"
                      title="Copy previewed text"
                    >
                      {copiedKey === "input" ? "Copied!" : "Copy"}
                    </button>
                    <button
                      class="px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[10px] text-white/70 hover:text-white font-mono uppercase cursor-pointer"
                      onclick={() =>
                        document.getElementById("file-input").click()}
                      type="button"
                      title="Select another file"
                    >
                      Replace
                    </button>
                  </div>
                  {#if editingInput}
                    <!-- svelte-ignore a11y_autofocus -->
                    <textarea
                      class="w-full flex-1 min-h-0 overflow-y-auto text-left text-[13px] leading-relaxed font-mono text-[#4ade80]/85 bg-transparent whitespace-pre-wrap px-3 pb-3 pt-7 m-0 outline-none resize-none border-0"
                      placeholder="paste or type your data here — dog, json, or yml. format auto-detects as you go."
                      value={rawDataText}
                      oninput={handleInputEdit}
                      autofocus
                    ></textarea>
                  {:else}
                    <pre
                      class="w-full flex-1 min-h-0 overflow-y-auto text-left text-[13px] leading-relaxed font-mono text-[#4ade80]/85 whitespace-pre-wrap px-3 pb-3 pt-7 m-0 select-text cursor-text">{dataPreviewText}</pre>
                  {/if}
                </div>

                <!-- .dog Encoding sidebar — slides in from the right via Customize -->
                {#if selectedFormats.includes("dog") && showDogEncoding}
                  <div
                    class="w-full sm:w-56 shrink-0 self-stretch max-h-[55%] sm:max-h-full min-h-0 overflow-y-auto overscroll-contain p-3 rounded-lg bg-white/2 border border-white/5 flex flex-col gap-2.5 text-left [&>*]:shrink-0"
                    transition:fly={{ x: 200, duration: 200 }}
                  >
                    <span
                      class="text-[10px] font-bold text-[#4ade80] uppercase tracking-wider font-mono"
                      >DOG ENCODING</span
                    >
                    <p class="text-[9px] font-sans text-white/40 m-0 leading-snug">
                      untouched defaults = <span class="text-[#4ade80]">dog 1</span>. change anything and the header becomes <span class="text-[#4ade80]">dog 2</span>, carrying your rules.
                    </p>
                    <div class="flex items-center gap-1.5 flex-wrap">
                      {#each [...Object.keys(DOG_PRESETS), "custom"] as p}
                        <button
                          class={"px-2 py-0.5 rounded text-[9px] font-mono uppercase border transition-colors cursor-pointer " +
                            (dogPreset === p
                              ? "border-[#4ade80] text-[#4ade80] bg-[#4ade80]/10"
                              : "border-white/10 text-white/40 hover:text-white/70")}
                          onclick={() => p !== "custom" && applyDogPreset(p)}
                          type="button"
                          disabled={p === "custom"}
                        >
                          {p}
                        </button>
                      {/each}
                    </div>
                    <label
                      class="flex flex-col gap-0.5 text-white/40 text-[10px] font-mono"
                    >
                      flow
                      <select
                        class="dog-select"
                        value={dogOpts.flow}
                        onchange={(e) => setDogOpt("flow", e.target.value)}
                      >
                        <option value="block">block (multi-line)</option>
                        <option value="line">line (block per line)</option>
                        <option value="wire">wire (one line total)</option>
                      </select>
                    </label>
                    <label
                      class="flex flex-col gap-0.5 text-white/40 text-[10px] font-mono"
                      class:opacity-30={dogOpts.flow !== "block"}
                    >
                      indent
                      <select
                        class="dog-select"
                        value={String(dogOpts.indent)}
                        onchange={(e) =>
                          setDogOpt("indent", Number(e.target.value))}
                        disabled={dogOpts.flow !== "block"}
                      >
                        {#each [1, 2, 3, 4, 6, 8] as n}
                          <option value={String(n)}
                            >{n} space{n > 1 ? "s" : ""}</option
                          >
                        {/each}
                      </select>
                    </label>
                    <label
                      class="flex flex-col gap-0.5 text-white/40 text-[10px] font-mono"
                    >
                      bools
                      <select
                        class="dog-select"
                        value={dogOpts.bools}
                        onchange={(e) => setDogOpt("bools", e.target.value)}
                      >
                        <option value="truefalse">true / false</option>
                        <option value="tf">t / f</option>
                        <option value="10">1 / 0</option>
                        <option value="yn">y / n</option>
                      </select>
                    </label>
                    <label
                      class="flex flex-col gap-0.5 text-white/40 text-[10px] font-mono"
                    >
                      case
                      <select
                        class="dog-select"
                        value={dogOpts.case}
                        onchange={(e) => setDogOpt("case", e.target.value)}
                      >
                        <option value="any">any</option>
                        <option value="exact">exact</option>
                      </select>
                    </label>
                    <label
                      class="flex flex-col gap-0.5 text-white/40 text-[10px] font-mono"
                    >
                      block keyword
                      <input
                        class="dog-select"
                        value={dogOpts.block}
                        oninput={(e) =>
                          setDogOpt(
                            "block",
                            e.target.value.replace(/[^A-Za-z0-9]/g, "") ||
                              "track",
                          )}
                      />
                    </label>
                                        <pre
                      class="bg-black/40 rounded px-2 py-1 text-[9px] text-[#4ade80]/80 whitespace-pre-wrap break-all select-text cursor-text m-0 mt-auto">{dogHeaderPreview}</pre>
                  </div>
                {/if}
              {:else if fileType === "video"}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div
                  class="preview-box audio-preview cursor-pointer hover:opacity-80 transition-opacity relative group"
                  onclick={() => document.getElementById("file-input").click()}
                  title="Click to select another file"
                >
                  <FileVideo size={48} class="text-[#a855f7]" />
                  <span class="audio-badge">Video Frame Decoded</span>
                  <div
                    class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-[10px] text-white font-bold font-sans uppercase"
                  >
                    Replace
                  </div>
                </div>
              {/if}

              {#if fileType !== "data"}
                <div class="details">
                  <span class="file-name-label">{file.name}</span>
                  <span class="file-size-label">{formatBytes(file.size)}</span>
                  <div class="badge-row">
                    <span class="format-badge input"
                      >{inputFormat.toUpperCase()}</span
                    >
                    <span class="arrow-trans">➔</span>
                    <span class="format-badge output">
                      {selectedFormats.length > 0
                        ? selectedFormats.map((f) => f.toUpperCase()).join(", ")
                        : "?"}
                    </span>
                  </div>
                </div>
              {/if}
            </div>


            <!-- Settings Panel (Quality, Compression, Dimensions) -->
            {#if fileType === "image" || fileType === "audio"}
              <div class="settings-control-panel">
                <h3>Configuration Parameters</h3>

                {#if fileType === "image"}
                  <!-- Dimensions Control -->
                  <div class="settings-group">
                    <div
                      class="settings-group-header flex items-center justify-between gap-3 mb-2.5"
                    >
                      <span
                        class="text-xs font-bold text-white/50 uppercase tracking-wide"
                        >Resolution</span
                      >
                      <div class="flex items-center gap-2">
                        <button
                          class="aspect-link-btn"
                          class:linked={keepTens}
                          onclick={handleTensToggle}
                          type="button"
                        >
                          {#if keepTens}
                            <span>10%</span>
                          {:else}
                            <span class="opacity-40">Free</span>
                          {/if}
                        </button>

                        <button
                          class="aspect-link-btn"
                          class:linked={keepAspectRatio}
                          onclick={handleAspectRatioToggle}
                          type="button"
                        >
                          {#if keepAspectRatio}
                            <Link2 size={12} class="mr-1 inline" /><span
                              >Fixed Aspect</span
                            >
                          {:else}
                            <Link2Off
                              size={12}
                              class="mr-1 inline opacity-40"
                            /><span>Unlinked (Free)</span>
                          {/if}
                        </button>

                        <button
                          class="aspect-link-btn"
                          onclick={resetToOriginal}
                          type="button"
                          title="Reset to original dimensions"
                        >
                          <Undo size={12} class="mr-1 inline" /><span
                            >Reset</span
                          >
                        </button>
                      </div>
                    </div>

                    <div
                      class="sliders-row grid grid-cols-2 gap-3.5 max-sm:grid-cols-1"
                    >
                      <div class="slider-field">
                        <div
                          class="slider-label flex justify-between items-center text-[11px] mb-1 font-mono"
                        >
                          <span class="text-white/40">Width</span>
                          <div class="flex items-center gap-0.5">
                            <input
                              type="number"
                              min="10"
                              max={Math.max(5000, originalWidth * 2)}
                              value={targetWidth}
                              oninput={handleWidthChange}
                              class="value-input"
                            />
                            <span class="text-white/30">px</span>
                          </div>
                        </div>
                        <input
                          type="range"
                          min={keepTens && originalWidth > 0
                            ? Math.round(originalWidth * 0.1)
                            : 10}
                          max={keepTens && originalWidth > 0
                            ? Math.round(originalWidth * 2)
                            : Math.max(5000, originalWidth * 2)}
                          step={keepTens && originalWidth > 0
                            ? Math.round(originalWidth * 0.1)
                            : 1}
                          bind:value={targetWidth}
                          oninput={handleWidthChange}
                          class="param-slider"
                        />
                      </div>

                      <div class="slider-field">
                        <div
                          class="slider-label flex justify-between items-center text-[11px] mb-1 font-mono"
                        >
                          <span class="text-white/40">Height</span>
                          <div class="flex items-center gap-0.5">
                            <input
                              type="number"
                              min="10"
                              max={Math.max(5000, originalHeight * 2)}
                              value={targetHeight}
                              oninput={handleHeightChange}
                              class="value-input"
                            />
                            <span class="text-white/30">px</span>
                          </div>
                        </div>
                        <input
                          type="range"
                          min={keepTens && originalHeight > 0
                            ? Math.round(originalHeight * 0.1)
                            : 10}
                          max={keepTens && originalHeight > 0
                            ? Math.round(originalHeight * 2)
                            : Math.max(5000, originalHeight * 2)}
                          step={keepTens && originalHeight > 0
                            ? Math.round(originalHeight * 0.1)
                            : 1}
                          bind:value={targetHeight}
                          oninput={handleHeightChange}
                          class="param-slider"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Quality & Compression Sliders -->
                  <div class="settings-group">
                    <div
                      class="sliders-row grid grid-cols-2 gap-3.5 mt-2 max-sm:grid-cols-1"
                    >
                      <div
                        class="slider-field"
                        class:opacity-30={!hasQualitySupport}
                      >
                        <div
                          class="slider-label flex justify-between items-center text-[11px] mb-1 font-mono"
                        >
                          <span class="text-white/40">Quality Factor</span>
                          <div class="flex items-center gap-0.5">
                            <input
                              type="number"
                              min="1"
                              max="100"
                              bind:value={quality}
                              class="value-input quality-input"
                              disabled={!hasQualitySupport}
                            />
                            <span class="text-white/30">%</span>
                          </div>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="100"
                          bind:value={quality}
                          class="param-slider"
                          disabled={!hasQualitySupport}
                        />
                      </div>

                      <div
                        class="slider-field"
                        class:opacity-30={!hasCompressionSupport}
                      >
                        <div
                          class="slider-label flex justify-between items-center text-[11px] mb-1 font-mono"
                        >
                          <span class="text-white/40">Compression Level</span>
                          <div class="flex items-center gap-0.5">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              bind:value={compression}
                              class="value-input compression-input"
                              disabled={!hasCompressionSupport}
                            />
                            <span class="text-white/30">%</span>
                          </div>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          bind:value={compression}
                          class="param-slider"
                          disabled={!hasCompressionSupport}
                        />
                      </div>
                    </div>
                  </div>
                {/if}

                {#if fileType === "audio"}
                  <div class="settings-group">
                    <div
                      class="sliders-row grid grid-cols-2 gap-3.5 max-sm:grid-cols-1"
                    >
                      {#if selectedFormats.includes("mp3")}
                        <div class="slider-field">
                          <div
                            class="slider-label flex justify-between items-center text-[11px] mb-1 font-mono"
                          >
                            <span class="text-white/40">MP3 Compression</span>
                            <div class="flex items-center gap-0.5">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                bind:value={compression}
                                class="value-input compression-input"
                              />
                              <span class="text-white/30">%</span>
                            </div>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            bind:value={compression}
                            class="param-slider"
                          />
                        </div>
                      {:else if selectedFormats.some( (f) => ["m4a", "aac", "webm"].includes(f), )}
                        <div class="slider-field">
                          <div
                            class="slider-label flex justify-between text-[11px] mb-1 font-mono"
                          >
                            <span class="text-white/40">Target Bitrate</span>
                          </div>
                          <select
                            bind:value={audioBitrate}
                            class="param-select"
                          >
                            <option value="96">96 kbps (Low)</option>
                            <option value="128">128 kbps (Standard)</option>
                            <option value="192">192 kbps (Medium)</option>
                            <option value="256">256 kbps (High)</option>
                            <option value="320">320 kbps (Extreme)</option>
                          </select>
                        </div>
                      {/if}

                      <div class="slider-field">
                        <div
                          class="slider-label flex justify-between text-[11px] mb-1 font-mono"
                        >
                          <span class="text-white/40"
                            >Sample Rate Resampler</span
                          >
                        </div>
                        <select
                          bind:value={audioSampleRate}
                          class="param-select"
                        >
                          <option value="keep">Keep Original Rate</option>
                          <option value="44100">44.1 kHz (CD Quality)</option>
                          <option value="32000">32.0 kHz (FM Radio)</option>
                          <option value="22050">22.05 kHz (AM Radio)</option>
                          <option value="11025">11.025 kHz (Low Quality)</option
                          >
                        </select>
                      </div>
                    </div>
                  </div>
                {/if}
              </div>
            {/if}
          </div>

          <!-- Right Column (drops below the preview for data files) -->
          <div
            class={"flex flex-col justify-between gap-5 " +
              (fileType === "data" ? "shrink-0" : "sm:col-span-6 h-full")}
          >
            <div class="selection-section flex flex-col gap-4">
              {#each formatGroups as group}
                <div>
                  <div
                    class="text-[11px] font-bold uppercase tracking-wider mb-2 font-mono"
                    style="color: {group.color};"
                  >
                    {group.name}
                  </div>
                  <div
                    class="format-options-grid grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3"
                  >
                    {#each availableFormats as format, index}
                      {#if group.formats.includes(format)}
                        <button
                          class="format-opt-btn"
                          class:selected={selectedFormats.includes(format)}
                          onclick={(e) => handleFormatSelection(format, e)}
                          onpointerdown={(e) =>
                            handleFormatPointerDown(format, e)}
                          onpointerup={(e) => handleFormatPointerUp(format, e)}
                          onpointerleave={(e) =>
                            handleFormatPointerUp(format, e)}
                        >
                          <span class="format-num">{index + 1}</span>
                          <span class="format-label"
                            >{format.toUpperCase()}</span
                          >
                        </button>
                      {/if}
                    {/each}
                  </div>
                </div>
              {/each}

              <div
                class="shortcut-tip flex flex-col items-center justify-center gap-1 mt-3 text-[10px] text-white/35 font-mono text-center bg-white/1 border border-white/5 rounded-lg p-2.5"
              >
                <div class="flex items-center gap-1.5 text-white/55">
                  <Keyboard size={12} />
                  <span>Press [1-9] or Arrow keys + Enter to select.</span>
                </div>
                <div
                  class="flex flex-col gap-0.5 mt-1 text-[9px] text-white/30"
                >
                  <span>• Shift+Click or Touch+Hold: Multi-select</span>
                </div>
              </div>
            </div>

            <button
              class="action-btn convert-launch"
              disabled={selectedFormats.length === 0}
              onclick={startConversion}
            >
              <RefreshCw size={16} /> CONVERT
            </button>
          </div>
        </div>
      </div>
    {/if}
  </div>

  <!-- Full-screen converted text pane — same overlay mechanic as the
       fundraiser map's full screen (Esc or the button closes it) -->
  {#if maximizedOutput}
    <div
      class="fixed inset-0 z-[99999] bg-black max-h-[100dvh] p-2 sm:p-4 flex flex-col gap-2"
    >
      <div class="flex items-center justify-between gap-3 shrink-0">
        <span class="text-[11px] font-mono text-white/60 truncate"
          >{maximizedOutput.name}</span
        >
        <div class="flex gap-1.5 shrink-0">
          {#if maximizedOutput.blob}
            <button
              class="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-white/70 hover:text-white font-mono uppercase cursor-pointer transition-colors"
              onclick={() =>
                copyPreviewText(maximizedOutput.blob, "fullscreen")}
              type="button"
              title="Copy full converted text"
            >
              {copiedKey === "fullscreen" ? "Copied!" : "Copy"}
            </button>
          {/if}
          <button
            class="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-white/70 hover:text-white font-mono uppercase cursor-pointer transition-colors"
            onclick={() => (maximizedOutput = null)}
            type="button"
            title="Exit full screen (Esc)"
            aria-label="Exit full screen"
          >
            ⤡ Close
          </button>
        </div>
      </div>
      <pre
        class="flex-1 min-h-0 w-full overflow-y-auto text-left text-[13px] leading-relaxed font-mono text-[#4ade80]/85 whitespace-pre-wrap bg-black/30 border border-white/5 rounded-lg p-3 m-0 select-text cursor-text">{maximizedOutput.text}</pre>
    </div>
  {/if}
</div>

<style lang="scss">
  @use "../../styles/CatalyticConverter.scss";

  .dog-select {
    width: 100%;
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    padding: 4px 8px;
    color: rgba(255, 255, 255, 0.75);
    font-family: inherit;
    font-size: 10px;
    outline: none;
    cursor: pointer;

    &:focus {
      border-color: #4ade80;
    }

    option {
      background: #0a0a0a;
      color: rgba(255, 255, 255, 0.8);
    }
  }
</style>
