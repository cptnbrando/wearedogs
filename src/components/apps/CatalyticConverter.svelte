<script>
  import { onDestroy, onMount } from "svelte";
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
  import * as fflate from "fflate";

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
  let convertedFiles = $state([]); // array of { blob, name }
  let zipDownloads = $state(false);
  let errorMessage = $state("");
  let currentNotice = $state("Refining Format Molecules");

  // Bulk state variables
  let bulkFiles = $state([]);
  let isBulkMode = $derived(bulkFiles.length > 0);
  let isConvertingBulk = $state(false);
  let overallProgress = $state(0);
  let currentConvertingIndex = $state(0);
  let batchImageFormat = $state("png");
  let batchAudioFormat = $state("mp3");
  let batchVideoFormat = $state("mp4");

  // Image size parameters
  let originalWidth = $state(0);
  let originalHeight = $state(0);
  let targetWidth = $state(0);
  let targetHeight = $state(0);
  let keepAspectRatio = $state(true);
  let keepTens = $state(true);

  // Quality & compression parameters
  let quality = $state(92); // 0 to 100
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

  // Selection Anchor and Format Handler
  function handleFormatSelection(format, event) {
    if (conversionStatus !== "idle" || !file) return;

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

  onMount(() => {
    window.addEventListener("keydown", handleKeydown);
  });

  onDestroy(() => {
    window.removeEventListener("keydown", handleKeydown);
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
    } else {
      fileType = "unsupported";
      errorMessage =
        "Unsupported file type. Please upload an image, audio, or video file.";
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

  function resetState() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
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
        zipData[item.name] = item.blob;
      });

      const promises = Object.entries(zipData).map(async ([name, blob]) => {
        const arrayBuffer = await blob.arrayBuffer();
        return [name, new Uint8Array(arrayBuffer)];
      });

      try {
        const entries = await Promise.all(promises);
        const zipObj = Object.fromEntries(entries);

        fflate.zip(zipObj, (err, data) => {
          if (err) {
            console.error("Error creating ZIP:", err);
            return;
          }
          const blob = new Blob([data], { type: "application/zip" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          const baseName = file.name.substring(0, file.name.lastIndexOf("."));
          a.download = `${baseName}_converted.zip`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        });
      } catch (err) {
        console.error("Failed to build ZIP archive:", err);
      }
    } else {
      convertedFiles.forEach((item) => {
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

      fflate.unzip(uint8Array, (err, unzipped) => {
        if (err) {
          errorMessage = "Could not extract ZIP file: " + err.message;
          conversionStatus = "error";
          return;
        }

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
      }

      if (type === "unsupported") continue;

      const inputFmt = ext === "jpeg" ? "jpg" : ext;
      let outputFmt = "";
      if (type === "image") outputFmt = inputFmt === "png" ? "jpg" : "png";
      else if (type === "audio") outputFmt = "mp3";
      else if (type === "video") outputFmt = "mp4";

      list.push({
        file: f,
        fileType: type,
        inputFormat: inputFmt,
        outputFormat: outputFmt,
        status: "idle",
        errorMsg: "",
        progress: 0,
        convertedBlob: null,
        convertedFileName: "",
        originalWidth: 0,
        originalHeight: 0,
        targetWidth: 0,
        targetHeight: 0,
        keepAspectRatio: true,
        keepTens: false,
        quality: 90,
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

      if (item.status === "done" || !item.outputFormat) continue;

      item.status = "converting";
      item.progress = 10;

      try {
        currentNotice = `Converting ${i + 1}/${bulkFiles.length}: ${item.file.name}`;

        let resultBlob;
        if (item.fileType === "image") {
          const tempUrl = URL.createObjectURL(item.file);
          resultBlob = await convertImage(
            tempUrl,
            item.outputFormat,
            item.targetWidth || 800,
            item.targetHeight || 600,
            item.quality,
          );
          URL.revokeObjectURL(tempUrl);
        } else if (item.fileType === "audio" || item.fileType === "video") {
          const isTargetVideo = ["mp4", "mov", "mkv", "avi"].includes(
            item.outputFormat,
          );
          const isTargetAudio = ["mp3", "wav", "m4a", "aac", "webm"].includes(
            item.outputFormat,
          );

          let bulkAudioBuffer = null;
          if (isTargetVideo || isTargetAudio) {
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

          if (item.fileType === "audio" && isTargetVideo) {
            if (!bulkAudioBuffer) {
              throw new Error(
                "Failed to decode audio track for video encoding.",
              );
            }
            resultBlob = await convertAudioToVideo(
              bulkAudioBuffer,
              item.outputFormat,
              (p) => {
                item.progress = Math.round(10 + p * 0.85);
              },
            );
          } else if (item.fileType === "video" && isTargetAudio) {
            if (!bulkAudioBuffer) {
              throw new Error("No audio track detected in this video file.");
            }
            resultBlob = await convertAudio(
              item.file,
              bulkAudioBuffer,
              item.outputFormat,
              item.audioSampleRate || "keep",
              item.compression || 15,
            );
          } else if (item.fileType === "audio") {
            resultBlob = await convertAudio(
              item.file,
              bulkAudioBuffer,
              item.outputFormat,
              item.audioSampleRate || "keep",
              item.compression || 15,
            );
          } else if (item.fileType === "video") {
            resultBlob = await convertVideo(item.file, item.outputFormat);
          }
        }

        item.convertedBlob = resultBlob;
        const nameParts = item.file.name.split(".");
        nameParts.pop();
        item.convertedFileName = `${nameParts.join(".")}.${item.outputFormat}`;
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

  // Compress all converted files back into a single ZIP
  async function downloadAllAsZip() {
    currentNotice = "Zipping Converted Molecules";
    const zipData = {};

    for (const bf of bulkFiles) {
      if (bf.status === "done" && bf.convertedBlob) {
        zipData[bf.convertedFileName] = bf.convertedBlob;
      }
    }

    if (Object.keys(zipData).length === 0) return;

    const promises = Object.entries(zipData).map(async ([name, blob]) => {
      const arrayBuffer = await blob.arrayBuffer();
      return [name, new Uint8Array(arrayBuffer)];
    });

    try {
      const entries = await Promise.all(promises);
      const zipObj = Object.fromEntries(entries);

      fflate.zip(zipObj, (err, data) => {
        if (err) {
          alert("Error creating ZIP: " + err.message);
          return;
        }
        const blob = new Blob([data], { type: "application/zip" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "catalytic-converted-files.zip";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    } catch (err) {
      alert("Failed to build ZIP archive: " + err.message);
    }
  }

  function applyBatchImageFormat(fmt) {
    batchImageFormat = fmt;
    for (const bf of bulkFiles) {
      if (bf.fileType === "image") {
        bf.outputFormat = fmt;
      }
    }
  }

  function applyBatchAudioFormat(fmt) {
    batchAudioFormat = fmt;
    for (const bf of bulkFiles) {
      if (bf.fileType === "audio") {
        bf.outputFormat = fmt;
      }
    }
  }

  function applyBatchVideoFormat(fmt) {
    batchVideoFormat = fmt;
    for (const bf of bulkFiles) {
      if (bf.fileType === "video") {
        bf.outputFormat = fmt;
      }
    }
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
    accept="image/*,audio/*,video/*,.zip"
    multiple
    onchange={handleFileSelect}
  />

  <div class="app-content-scroll">
    {#if isBulkMode}
      <!-- BULK DASHBOARD -->
      <div class="bulk-mode-container">
        <!-- Back and Reset -->
        <div class="back-bar flex items-center justify-between w-full">
          <button class="back-btn" onclick={resetState} type="button">
            <ArrowLeft size={14} /> Reset Batch
          </button>
        </div>

        <!-- Global Batch Presets -->
        <div class="bulk-batch-header">
          <div class="batch-title">Batch Output Formats</div>
          <div class="batch-presets">
            {#if bulkFiles.some((f) => f.fileType === "image")}
              <div class="preset-group">
                <span>🖼️ Images ➔</span>
                <select
                  value={batchImageFormat}
                  onchange={(e) => applyBatchImageFormat(e.target.value)}
                  class="preset-select"
                  disabled={isConvertingBulk}
                >
                  <option value="png">PNG</option>
                  <option value="jpg">JPG</option>
                  <option value="webp">WEBP</option>
                  <option value="avif">AVIF</option>
                  <option value="svg">SVG</option>
                </select>
              </div>
            {/if}

            {#if bulkFiles.some((f) => f.fileType === "audio")}
              <div class="preset-group">
                <span>🎵 Audios ➔</span>
                <select
                  value={batchAudioFormat}
                  onchange={(e) => applyBatchAudioFormat(e.target.value)}
                  class="preset-select"
                  disabled={isConvertingBulk}
                >
                  <option value="mp3">MP3</option>
                  <option value="wav">WAV</option>
                  <option value="m4a">M4A</option>
                  <option value="aac">AAC</option>
                  <option value="webm">WEBM</option>
                </select>
              </div>
            {/if}

            {#if bulkFiles.some((f) => f.fileType === "video")}
              <div class="preset-group">
                <span>🎞️ Videos ➔</span>
                <select
                  value={batchVideoFormat}
                  onchange={(e) => applyBatchVideoFormat(e.target.value)}
                  class="preset-select"
                  disabled={isConvertingBulk}
                >
                  <option value="mp4">MP4</option>
                  <option value="mov">MOV</option>
                  <option value="mkv">MKV</option>
                  <option value="avi">AVI</option>
                </select>
              </div>
            {/if}
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
                <select
                  bind:value={item.outputFormat}
                  class="format-selector"
                  disabled={isConvertingBulk || item.status === "done"}
                >
                  {#each formatMap[item.fileType] || [] as fmt}
                    <option value={fmt}>{fmt.toUpperCase()}</option>
                  {/each}
                </select>

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

                {#if item.status === "done" && item.convertedBlob}
                  <button
                    class="item-action-btn"
                    onclick={() => {
                      const url = URL.createObjectURL(item.convertedBlob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = item.convertedFileName;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }}
                    type="button"
                    title="Download converted file"
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
            <div class="progress-bar-wrap !w-full">
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
            Clear Batch
          </button>

          {#if bulkFiles.some((f) => f.status === "done")}
            <button
              class="action-btn download !m-0"
              onclick={downloadAllAsZip}
              type="button"
            >
              <Download size={14} /> ZIP & DOWNLOAD ALL
            </button>
          {:else}
            <button
              class="action-btn convert-launch !m-0"
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
    {:else if conversionStatus === "idle" && !file}
      <!-- UPLOAD ZONE -->
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
      <div
        class="upload-dropzone"
        class:dragging={isDragging}
        ondragover={handleDragOver}
        ondragleave={handleDragLeave}
        ondrop={handleDrop}
        onclick={() => document.getElementById("file-input").click()}
        role="button"
        tabindex="0"
      >
        <div class="icon-wrap">
          <Upload size={38} />
        </div>
        <h3>Drop file or click to select</h3>
        <p class="upload-sub">
          Supports JPG, PNG, WEBP, AVIF, SVG, MP3, WAV, M4A, AAC, WEBM, MP4,
          MOV, MKV, AVI
        </p>
      </div>

      <!-- Supported formats legend -->
      <div
        class="supported-formats-legend mt-4 p-4 rounded-lg bg-white/[0.02] border border-white/5 flex flex-col gap-2.5"
      >
        <h4
          class="text-xs font-bold text-white/40 uppercase tracking-wider font-mono"
        >
          SUPPORTED CONVERSIONS
        </h4>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-sans text-white/70"
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
          <div
            class="flex flex-col gap-1.5 col-span-1 sm:col-span-2 md:col-span-1"
          >
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
          class="flex flex-col gap-2 w-full max-w-[280px] max-h-[150px] overflow-y-auto pr-1"
        >
          {#each convertedFiles as item}
            <div
              class="converted-info-card !p-3 flex !flex-row items-center justify-between gap-3 text-left"
            >
              <span class="filename !text-[11px] truncate flex-1"
                >{item.name}</span
              >
              <span class="filesize !text-[10px] flex-shrink-0"
                >{formatBytes(item.blob?.size || 0)}</span
              >
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
            <span>Zip downloads</span>
          </label>
        {/if}

        <div class="success-actions">
          <button class="action-btn download" onclick={downloadFile}>
            <Download size={16} /> DOWNLOAD {#if convertedFiles.length > 1 && !zipDownloads}ALL{/if}
          </button>
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
      <div class="file-loaded-panel">
        <div class="back-bar">
          <button class="back-btn" onclick={resetState}>
            <ArrowLeft size={14} /> Back
          </button>
        </div>

        <div
          class="grid grid-cols-1 sm:grid-cols-12 gap-5 md:gap-6 items-start w-full"
        >
          <!-- Left Column -->
          <div class="sm:col-span-6 flex flex-col gap-4">
            <div class="meta-section">
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

          <!-- Right Column -->
          <div class="sm:col-span-6 flex flex-col justify-between gap-5 h-full">
            <div class="selection-section flex flex-col gap-4">
              <h3>Select Output Format</h3>

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
                class="shortcut-tip flex flex-col items-center justify-center gap-1 mt-3 text-[10px] text-white/35 font-mono text-center bg-white/[0.01] border border-white/5 rounded-lg p-2.5"
              >
                <div class="flex items-center gap-1.5 text-white/55">
                  <Keyboard size={12} />
                  <span>Press [1-9] or Arrow keys + Enter to select.</span>
                </div>
                <div
                  class="flex flex-col gap-0.5 mt-1 text-[9px] text-white/30"
                >
                  <span>• Ctrl/Shift + Click: Multiple format selections</span>
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
</div>

<style lang="scss">
  @use "../../styles/CatalyticConverter.scss";
</style>
