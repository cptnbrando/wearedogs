<!-- svelte-ignore a11y_media_has_caption -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<script>
  import { onMount, onDestroy } from "svelte";
  import BaseApp from "./BaseApp.svelte";
  import { WiretapEngine } from "../../lib/WiretapEngine.js";
  import { createZip } from "../../lib/zip.js";
  import DogsLogo from "../DogsLogo.svelte";
  import dogsLogoPng from "../../assets/dogs-logo-cropped.png";
  import {
    Mic,
    MicOff,
    Video,
    VideoOff,
    Play,
    Pause,
    Download,
    RefreshCw,
    Camera,
    Info,
    AlertCircle,
    Copy,
    Check,
    Trash2,
    Volume2,
    Sliders,
    Hourglass,
    List,
    FileText,
  } from "lucide-svelte";

  // State Management
  const engine = new WiretapEngine();

  let audioDevices = $state([]);
  let videoDevices = $state([]);
  let selectedAudioDevice = $state("");
  let selectedVideoDevice = $state("");
  let isPermissionsGranted = $state(false);
  let isCheckingPermissions = $state(true);

  // Settings collapse state
  let isInputsCollapsed = $state(true);
  let isPrickSettingsCollapsed = $state(true);

  // Prick Mode State Variables
  let mode = $state("recorder"); // "recorder" or "prick"
  let triggerThreshold = $state(0.35);
  let clipLength = $state(4); // default 3 seconds
  let liveVolume = $state(0);
  let clips = $state([]);

  // Real-time Visuals
  let liveTranscript = $state({ final: "", interim: "" });
  let liveWaveform = $state(Array(32).fill(0));
  let decodedPeaks = $state([]);
  let livePeaks = $state(Array(100).fill(0));
  let livePeaksCount = $state(0);
  let livePeaksDuration = $state(0);
  let recordingStartDate = $state(null);

  // Playback Info
  let playbackProgress = $state(0);
  let currentTime = $state(0);
  let duration = $state(0);
  let isCopied = $state(false);

  // Live Camera preview variables
  let enableVideo = $state(false);
  let videoEl = $state(null);
  let cameraStream = null;
  let hiddenVideoEl = null;

  // Playback Media for Unified Video Viewport
  let playbackMedia = $state(null); // { url, isVideo, title, duration, timestamp, peaks }
  let playerCurrentTime = $state(0);
  let playerDuration = $state(0);
  let playerProgress = $derived(
    playerDuration > 0 ? playerCurrentTime / playerDuration : 0,
  );
  let mediaPlaybackEl = $state(null);
  let isMediaPaused = $state(true);
  let isMediaPlaying = $derived(!isMediaPaused);

  // Clock Overlay Variables
  let currentTimeObj = $state(new Date());
  let clockInterval = null;

  let HUDTime = $derived.by(() => {
    if (playbackMedia && playbackMedia.timestamp) {
      return new Date(
        playbackMedia.timestamp.getTime() + playerCurrentTime * 1000,
      );
    }
    return currentTimeObj;
  });

  const dateStr = $derived(
    HUDTime.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    }),
  );

  // Location Geocoding Variables
  let locationText = $state("Dallas, TX");
  let deviceCoords = $state(null);
  let isLocating = $state(false);

  // Canvas Drawing Loop Variables
  let canvasEl = null;
  let canvasCtx = null;
  let canvasDrawLoopId = null;
  let logoImage = null;

  // Sync timelines
  let displayCurrentTime = $derived(
    playbackMedia ? playerCurrentTime : currentTime,
  );
  let displayDuration = $derived(playbackMedia ? playerDuration : duration);
  let displayProgress = $derived(
    playbackMedia ? playerProgress : playbackProgress,
  );

  // Engine state representation
  let engineState = $state({
    isRecording: false,
    isPlaying: false,
    isDecoding: false,
    hasRecording: false,
    clipCapturingState: "idle",
  });

  // Track state changes from the engine
  engine.onStateChange = (state) => {
    engineState = state;
  };

  engine.onLiveTranscript = (transcript) => {
    liveTranscript = transcript;
    scrollTranscriptIntoView();
  };

  engine.onLiveWaveform = (data) => {
    liveWaveform = data.slice(0, 32).map((val) => val / 255);
  };

  engine.onAudioDecoded = (peaks) => {
    decodedPeaks = peaks;
  };

  engine.onLivePeaksUpdate = (peaks, count, dur) => {
    livePeaks = peaks;
    livePeaksCount = count;
    livePeaksDuration = dur;
  };

  engine.onPlaybackProgress = (progress, time, dur) => {
    playbackProgress = progress;
    currentTime = time;
    duration = dur;
  };

  engine.onClipAdded = (newClip, updatedClips) => {
    clips = [...updatedClips];
  };

  engine.onClipsCleared = () => {
    clips = [];
  };

  engine.onLiveVolumeUpdate = (amp) => {
    liveVolume = amp;
  };

  // Sync state variables dynamically to the engine
  $effect(() => {
    engine.mode = mode;
    engine.threshold = triggerThreshold;
    engine.clipLength = clipLength;
    engine.cameraStream = cameraStream;
  });

  // Start/stop live monitoring based on permission grant and audio device selection
  $effect(() => {
    if (isPermissionsGranted && selectedAudioDevice) {
      engine.startMonitoring(selectedAudioDevice);
    }
  });

  // Update clock when video is on/going
  $effect(() => {
    const isVideoGoing = playbackMedia || enableVideo;
    if (isVideoGoing) {
      if (!clockInterval) {
        clockInterval = setInterval(() => {
          currentTimeObj = new Date();
        }, 30);
      }
    } else {
      if (clockInterval) {
        clearInterval(clockInterval);
        clockInterval = null;
      }
    }
  });

  // Autoscroll transcript container during live recording
  let transcriptContainer = $state(null);
  function scrollTranscriptIntoView() {
    if (transcriptContainer) {
      transcriptContainer.scrollTop = transcriptContainer.scrollHeight;
    }
  }

  // Enumerate hardware devices
  async function initDevices() {
    try {
      isCheckingPermissions = true;
      await engine.requestPermissions();
      isPermissionsGranted = true;

      const { audio, video } = await engine.getDevices();
      audioDevices = audio;
      videoDevices = video;

      if (audio.length > 0) selectedAudioDevice = audio[0].deviceId;
      if (video.length > 0) selectedVideoDevice = video[0].deviceId;
    } catch (err) {
      console.warn("Permissions denied or device list unavailable:", err);
      isPermissionsGranted = false;
    } finally {
      isCheckingPermissions = false;
    }
  }

  // Handle camera preview stream update
  async function updateCameraStream() {
    if (typeof document === "undefined") return;

    if (!hiddenVideoEl) {
      hiddenVideoEl = document.createElement("video");
      hiddenVideoEl.muted = true;
      hiddenVideoEl.playsInline = true;
      hiddenVideoEl.setAttribute("playsinline", "");
      hiddenVideoEl.setAttribute("muted", "");
      hiddenVideoEl.style.position = "absolute";
      hiddenVideoEl.style.width = "1px";
      hiddenVideoEl.style.height = "1px";
      hiddenVideoEl.style.opacity = "0";
      hiddenVideoEl.style.pointerEvents = "none";
      document.body.appendChild(hiddenVideoEl);
    }

    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      cameraStream = null;
    }

    if (enableVideo && selectedVideoDevice) {
      try {
        cameraStream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: selectedVideoDevice } },
        });
        hiddenVideoEl.srcObject = cameraStream;
        hiddenVideoEl.onloadedmetadata = () => {
          hiddenVideoEl
            .play()
            .catch((err) => console.warn("Hidden video play failed:", err));
        };
      } catch (err) {
        console.error("Webcam stream access failed:", err);
        enableVideo = false;
      }
    } else {
      hiddenVideoEl.srcObject = null;
    }
  }

  // Reactive updates to video toggle or device selector change
  $effect(() => {
    updateCameraStream();
  });

  // Initialize canvas backing store
  function ensureCanvasInitialized() {
    if (!canvasEl) {
      canvasEl = document.createElement("canvas");
      canvasEl.width = 640;
      canvasEl.height = 480;
      canvasCtx = canvasEl.getContext("2d");

      // Paint first frame black to initialize buffers
      canvasCtx.fillStyle = "#0c0c0f";
      canvasCtx.fillRect(0, 0, canvasEl.width, canvasEl.height);
    }
  }

  // Start canvas frame loop
  function startCanvasDrawLoop() {
    ensureCanvasInitialized();
    if (!canvasDrawLoopId) {
      canvasDrawLoopId = requestAnimationFrame(drawCanvasFrame);
    }
  }

  // Stop canvas frame loop
  function stopCanvasDrawLoop() {
    if (canvasDrawLoopId && !enableVideo && !engineState.isRecording) {
      cancelAnimationFrame(canvasDrawLoopId);
      canvasDrawLoopId = null;
    }
  }

  // Automatically manage canvas draw loop
  $effect(() => {
    if (enableVideo || engineState.isRecording) {
      startCanvasDrawLoop();
    } else {
      stopCanvasDrawLoop();
    }
  });

  // Automatically bind canvas stream to video element for live display
  $effect(() => {
    if (enableVideo && !playbackMedia && videoEl && canvasEl) {
      const stream = canvasEl.captureStream(30);
      if (videoEl.srcObject !== stream) {
        videoEl.srcObject = stream;
      }
    }
  });

  // Synchronous canvas render function
  function renderCanvas() {
    if (canvasCtx && canvasEl) {
      // 1. Draw webcam feed or background grid
      if (enableVideo && hiddenVideoEl && hiddenVideoEl.readyState >= 2) {
        canvasCtx.drawImage(
          hiddenVideoEl,
          0,
          0,
          canvasEl.width,
          canvasEl.height,
        );
      } else {
        canvasCtx.fillStyle = "#0c0c0f";
        canvasCtx.fillRect(0, 0, canvasEl.width, canvasEl.height);

        canvasCtx.strokeStyle = "rgba(0, 255, 102, 0.08)";
        canvasCtx.lineWidth = 1;
        const gridSpacing = 40;
        for (let x = 0; x < canvasEl.width; x += gridSpacing) {
          canvasCtx.beginPath();
          canvasCtx.moveTo(x, 0);
          canvasCtx.lineTo(x, canvasEl.height);
          canvasCtx.stroke();
        }
        for (let y = 0; y < canvasEl.height; y += gridSpacing) {
          canvasCtx.beginPath();
          canvasCtx.moveTo(0, y);
          canvasCtx.lineTo(canvasEl.width, y);
          canvasCtx.stroke();
        }

        canvasCtx.fillStyle = "rgba(0, 255, 102, 0.05)";
        canvasCtx.font = "bold 48px monospace";
        canvasCtx.textAlign = "center";
        canvasCtx.textBaseline = "middle";
        canvasCtx.fillText(
          "WIRETAP SYSTEM",
          canvasEl.width / 2,
          canvasEl.height / 2,
        );
      }

      // 2. Draw semi-transparent HUD background banners
      canvasCtx.fillStyle = "rgba(0, 0, 0, 0.45)";
      canvasCtx.fillRect(0, 0, canvasEl.width, 45); // top banner
      canvasCtx.fillRect(0, canvasEl.height - 45, canvasEl.width, 45); // bottom banner

      const now = new Date();

      // Top-right HUD clock
      canvasCtx.font = "bold 11px monospace";
      canvasCtx.fillStyle = "#00ff66";
      canvasCtx.textAlign = "right";
      canvasCtx.fillText(formatUTCTime(now), canvasEl.width - 15, 16);
      canvasCtx.fillText(
        formatLocalTimeWithCentiseconds(now),
        canvasEl.width - 15,
        28,
      );

      canvasCtx.fillStyle = "rgba(255, 255, 255, 0.7)";
      canvasCtx.font = "9px monospace";
      canvasCtx.fillText(dateStr, canvasEl.width - 15, 38);

      // Location
      canvasCtx.fillStyle = "rgba(255, 255, 255, 0.9)";
      canvasCtx.font = "bold 9px monospace";
      canvasCtx.fillText(
        `LOC: ${locationText || "MANUAL"}`,
        canvasEl.width - 15,
        48,
      );

      // Top-left HUD status badge
      const isClipping =
        mode === "prick" && engineState.clipCapturingState === "capturing";
      canvasCtx.fillStyle = isClipping
        ? "#0066ff"
        : engineState.isRecording
          ? "#ff3344"
          : "#eab308";
      canvasCtx.fillRect(15, 12, isClipping ? 68 : 60, 18);
      canvasCtx.fillStyle = "#ffffff";
      canvasCtx.font = "bold 9px monospace";
      canvasCtx.textAlign = "center";
      canvasCtx.fillText(
        isClipping
          ? "CLIPPING"
          : engineState.isRecording
            ? "LIVE REC"
            : "LIVE FEED",
        isClipping ? 49 : 45,
        24,
      );

      // Bottom-right: DOGS & Logo
      canvasCtx.fillStyle = "#00ff66";
      canvasCtx.font = "bold 11px monospace";
      canvasCtx.textAlign = "right";
      if (logoImage) {
        canvasCtx.drawImage(
          logoImage,
          canvasEl.width - 32,
          canvasEl.height - 28,
          16,
          16,
        );
        canvasCtx.fillText("DOGS", canvasEl.width - 38, canvasEl.height - 16);
      } else {
        canvasCtx.fillText("DOGS", canvasEl.width - 15, canvasEl.height - 16);
      }

      // Bottom-left: Waveform visualizer
      const barWidth = 3;
      const barGap = 1.5;
      const startX = 15;
      const startY = canvasEl.height - 15;

      for (let i = 0; i < overlayWaveformBars.length; i++) {
        const val = overlayWaveformBars[i];
        canvasCtx.fillStyle = "#00ff66";
        const barHeight = Math.max(2, val * 20);
        canvasCtx.fillRect(
          startX + i * (barWidth + barGap),
          startY - barHeight,
          barWidth,
          barHeight,
        );
      }
    }
  }

  // Canvas Draw Loop to bake overlays into recorded video in real-time
  function drawCanvasFrame() {
    if (!enableVideo && !engineState.isRecording) return;
    renderCanvas();
    canvasDrawLoopId = requestAnimationFrame(drawCanvasFrame);
  }

  // Start recording voice and transcription
  async function startRecording() {
    try {
      livePeaks = Array(100).fill(0);
      livePeaksCount = 0;
      livePeaksDuration = 0;
      decodedPeaks = [];
      playbackProgress = 0;
      currentTime = 0;
      duration = 0;
      recordingStartDate = new Date();
      playbackMedia = null; // Reset playback player when recording starts

      // Ensure canvas is active to physically record the HUD overlays
      ensureCanvasInitialized();
      renderCanvas(); // Render immediately to make sure stream tracks have frames
      startCanvasDrawLoop();

      const canvasStream = canvasEl.captureStream(30);
      const videoTrack = canvasStream.getVideoTracks()[0];

      await engine.startRecording(selectedAudioDevice, videoTrack);
      liveTranscript = { final: "", interim: "" };
    } catch (err) {
      console.error("Start recording failed:", err);
    }
  }

  // Stop recording voice and transcription
  function stopRecording() {
    engine.stopRecording();
    stopCanvasDrawLoop();
  }

  // Custom pointer drag scrubbing logic for timeline
  function handleWaveformPointerDown(e) {
    const rect = e.currentTarget.getBoundingClientRect();

    function updateProgress(clientX) {
      const clickX = clientX - rect.left;
      const pct = Math.max(0, Math.min(1, clickX / rect.width));
      if (playbackMedia && mediaPlaybackEl) {
        mediaPlaybackEl.currentTime = pct * (mediaPlaybackEl.duration || 1);
      } else {
        engine.seek(pct);
      }
    }

    updateProgress(e.clientX);

    function onPointerMove(moveEvent) {
      updateProgress(moveEvent.clientX);
    }

    function onPointerUp() {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  }

  // Copy transcript text to clipboard
  function copyTranscript() {
    const text = liveTranscript.final || "No transcript available.";
    navigator.clipboard.writeText(text).then(() => {
      isCopied = true;
      setTimeout(() => {
        isCopied = false;
      }, 2000);
    });
  }

  // Reset recording state
  function reset() {
    engine.reset();
    liveTranscript = { final: "", interim: "" };
    liveWaveform = Array(32).fill(0);
    decodedPeaks = [];
    livePeaks = Array(100).fill(0);
    livePeaksCount = 0;
    livePeaksDuration = 0;
    recordingStartDate = null;
    clips = [];
    liveVolume = 0;
    playbackMedia = null;
    deviceCoords = null;
  }

  // Format seconds to readable timer format (MM:SS or H:MM:SS)
  function formatTime(secs) {
    if (isNaN(secs) || secs === Infinity || secs === -Infinity) return "0:00";
    const totalSeconds = Math.round(secs);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    }
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  // Format starting Date plus relative offset into hh:mm:ss am/pm format
  function formatWallClockTime(startDate, offsetSecs) {
    if (
      !startDate ||
      isNaN(offsetSecs) ||
      offsetSecs === Infinity ||
      offsetSecs === -Infinity
    )
      return "";
    const baseDate =
      startDate instanceof Date ? startDate : new Date(startDate);
    const time = new Date(baseDate.getTime() + offsetSecs * 1000);
    return time
      .toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
      .toLowerCase();
  }

  // Get GPS/Device Location
  async function getDeviceLocation() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }
    isLocating = true;
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        deviceCoords = { latitude, longitude };
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=12&addressdetails=1`,
          );
          if (!res.ok) throw new Error("Geocoding failed");
          const data = await res.json();
          if (data && data.address) {
            const city =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              data.address.suburb ||
              "";
            const state = data.address.state || "";
            if (city && state) {
              locationText = `${city}, ${state}`;
            } else if (city || state) {
              locationText = city || state;
            } else {
              locationText = `${latitude.toFixed(3)}°, ${longitude.toFixed(3)}°`;
            }
          } else {
            locationText = `${latitude.toFixed(3)}°, ${longitude.toFixed(3)}°`;
          }
        } catch (err) {
          console.warn("Geocoding failed, fallback to coordinates:", err);
          locationText = `${latitude.toFixed(3)}°, ${longitude.toFixed(3)}°`;
        } finally {
          isLocating = false;
        }
      },
      (err) => {
        console.warn("GPS Location failed:", err);
        alert(`Location access failed: ${err.message}`);
        isLocating = false;
      },
    );
  }

  // Get date range string for clips
  function getDateRangeStr(startDate, endDate) {
    if (!startDate || !endDate) return "";
    const startStr = startDate.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
    const endStr = endDate.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
    if (startStr === endStr) {
      return startStr;
    } else {
      return `${startStr} - ${endStr}`;
    }
  }

  // Generate metadata JSON string
  function getClipMetadataJSON(clip) {
    const end = new Date(clip.timestamp.getTime() + clip.duration * 1000);
    const metadata = {
      start_utc: clip.timestamp.toISOString(),
      end_utc: end.toISOString(),
      start_local_time: clip.timestamp.toString(),
      end_local_time: end.toString(),
      dates: getDateRangeStr(clip.timestamp, end),
      duration_seconds: clip.duration,
      location: deviceCoords
        ? `${deviceCoords.latitude.toFixed(6)}, ${deviceCoords.longitude.toFixed(6)}`
        : locationText || "MANUAL",
    };
    return JSON.stringify(metadata, null, 2);
  }

  // ZIP and download a single recorded clip with its metadata JSON
  async function downloadClipAsZip(clip, index) {
    try {
      const filesToZip = [];
      const arrayBuffer = await clip.blob.arrayBuffer();
      const mediaData = new Uint8Array(arrayBuffer);

      const formattedDate = clip.timestamp.toISOString().replace(/[:.]/g, "-");
      const mediaFilename = `clip-${index + 1}-${formattedDate}.webm`;
      filesToZip.push({
        name: mediaFilename,
        data: mediaData,
      });

      // Add metadata JSON
      const jsonStr = getClipMetadataJSON(clip);
      const encoder = new TextEncoder();
      const jsonData = encoder.encode(jsonStr);
      filesToZip.push({
        name: `clip-${index + 1}-${formattedDate}-metadata.json`,
        data: jsonData,
      });

      const zipBlob = await createZip(filesToZip);
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `clip-${index + 1}-${formattedDate}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Single clip ZIP download failed:", err);
      alert("Download failed.");
    }
  }

  // ZIP and download all recorded clips with their metadata JSONs
  let isZipping = $state(false);
  async function downloadAllClipsAsZip() {
    if (clips.length === 0) return;
    isZipping = true;
    try {
      const filesToZip = [];
      for (let i = 0; i < clips.length; i++) {
        const c = clips[i];

        // Add WebM file
        const arrayBuffer = await c.blob.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const formattedDate = c.timestamp.toISOString().replace(/[:.]/g, "-");
        const mediaFilename = `clip-${i + 1}-${formattedDate}.webm`;
        filesToZip.push({
          name: mediaFilename,
          data,
        });

        // Add metadata JSON file
        const jsonStr = getClipMetadataJSON(c);
        const encoder = new TextEncoder();
        const jsonData = encoder.encode(jsonStr);
        const jsonFilename = `clip-${i + 1}-${formattedDate}-metadata.json`;
        filesToZip.push({
          name: jsonFilename,
          data: jsonData,
        });
      }
      const zipBlob = await createZip(filesToZip);
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `prick-clips-${Date.now()}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("ZIP packaging failed:", err);
      alert("ZIP packaging failed.");
    } finally {
      isZipping = false;
    }
  }

  // Play clip in unified video viewport
  function playClipInViewport(clip) {
    playbackMedia = {
      url: clip.url,
      isVideo: clip.isVideo,
      title: `${clip.isVideo ? "Video" : "Audio"} Clip`,
      duration: clip.duration,
      timestamp: clip.timestamp,
      peaks: clip.peaks,
    };
  }

  // Play full recording in unified video viewport
  function playFullRecording() {
    playbackMedia = {
      url: engine.audioUrl,
      isVideo: engine.mimeType.startsWith("video"),
      title: "Full Recording",
      duration: duration,
      timestamp: recordingStartDate,
      peaks: decodedPeaks,
    };
  }

  // Local Time Centiseconds Format
  function formatLocalTimeWithCentiseconds(d) {
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const seconds = String(d.getSeconds()).padStart(2, "0");
    const ms = String(d.getMilliseconds()).padStart(3, "0");
    const centiseconds = ms.slice(0, 2);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes}:${seconds}:${centiseconds} ${ampm}`;
  }

  // UTC Time Format
  function formatUTCTime(d) {
    const hours = String(d.getUTCHours()).padStart(2, "0");
    const minutes = String(d.getUTCMinutes()).padStart(2, "0");
    const seconds = String(d.getUTCSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds} UTC`;
  }

  // Resample peaks for mini-visualizer overlay
  let overlayWaveformBars = $derived.by(() => {
    if (playbackMedia) {
      if (playbackMedia.peaks) {
        return resamplePeaksForOverlay(playbackMedia.peaks);
      }
      if (decodedPeaks.length > 0 && playbackMedia.title === "Full Recording") {
        return resamplePeaksForOverlay(decodedPeaks);
      }
      return Array(20).fill(0.2);
    } else {
      // Live feed waveform
      return liveWaveform.slice(0, 20).map((v) => Math.max(0.1, v));
    }
  });

  function resamplePeaksForOverlay(peaksArray) {
    if (peaksArray.length === 0) return Array(20).fill(0);
    const result = [];
    const step = peaksArray.length / 20;
    for (let i = 0; i < 20; i++) {
      let max = 0;
      const start = Math.floor(i * step);
      const end = Math.min(Math.floor((i + 1) * step), peaksArray.length);
      for (let j = start; j < end; j++) {
        if (peaksArray[j] > max) max = peaksArray[j];
      }
      result.push(max);
    }
    const maxVal = Math.max(...result) || 1.0;
    return result.map((p) => p / (maxVal > 0.1 ? maxVal : 1));
  }

  function handlePlayerTimeUpdate(e) {
    playerCurrentTime = e.currentTarget.currentTime;
    playerDuration = e.currentTarget.duration || 1;
  }

  onMount(() => {
    initDevices();
    isInputsCollapsed = window.innerWidth < 768 || window.innerHeight < 500;
    isPrickSettingsCollapsed =
      window.innerWidth < 768 || window.innerHeight < 500;
    const img = new Image();
    img.src = dogsLogoPng;
    img.onload = () => {
      logoImage = img;
    };
  });

  onDestroy(() => {
    engine.reset();
    stopRecording();
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }
    if (clockInterval) {
      clearInterval(clockInterval);
    }
  });
</script>

<BaseApp
  title="Wiretap"
  description="Hacker-style voice recorder with live transcripts and responsive camera monitoring."
  themeColor="#00ff66"
>
  <div
    class="wiretap-layout w-full h-full flex flex-col justify-between"
    class:video-active={playbackMedia || enableVideo}
  >
    <!-- Permissions Block -->
    {#if isCheckingPermissions}
      <div
        class="flex-1 flex flex-col items-center justify-center text-center p-6"
      >
        <RefreshCw class="w-8 h-8 text-[#00ff66] animate-spin mb-4" />
        <p class="text-sm font-mono text-white/50 tracking-wider">
          ENUMERATING RECORDING DEVICES...
        </p>
      </div>
    {:else if !isPermissionsGranted}
      <div
        class="permission-container flex-1 flex flex-col items-center justify-center text-center p-6 max-w-md mx-auto"
      >
        <AlertCircle
          class="alert-icon w-12 h-12 text-[#ff3344] mb-4 animate-pulse"
        />
        <div class="permission-text-block">
          <h3
            class="text-lg font-mono font-bold text-white uppercase tracking-wider mb-2"
          >
            ACCESS REQUIRED
          </h3>
          <p class="text-xs text-white/60 mb-6 leading-relaxed">
            Wiretap requires camera and microphone permissions to capture
            surveillance streams and generate transcriptions.
          </p>
        </div>
        <button
          onclick={initDevices}
          class="px-6 py-3 bg-[#00ff66] text-black font-mono font-bold text-xs uppercase rounded hover:bg-[#00d75f] active:scale-95 transition-all shadow-[0_0_15px_rgba(0,255,102,0.3)] hover:shadow-[0_0_25px_rgba(0,255,102,0.5)] cursor-pointer"
        >
          GRANT ACCESS
        </button>
      </div>
    {:else}
      <!-- Responsive Dashboard -->
      <div
        class="dashboard-grid w-full h-full flex flex-col xl:grid xl:grid-cols-12 gap-4 flex-grow overflow-hidden p-2"
      >
        <!-- Left Panel: Device Setup & Live Video Feed (Col 1-5 on Desktop) -->
        <div class="xl:col-span-5 flex flex-col gap-4 min-h-0">
          <!-- Device Settings Panel -->
          <div class="glass-card flex flex-col gap-3 p-4" data-card="inputs">
            <button
              onclick={() => (isInputsCollapsed = !isInputsCollapsed)}
              class="panel-header w-full flex items-center justify-between cursor-pointer focus:outline-none select-none text-left border-none bg-transparent p-0"
            >
              <span class="flex items-center gap-2">
                <span class="pulse-indicator"></span> INPUTS
              </span>
              <span
                class="text-[9px] text-[#00ff66]/70 border border-[#00ff66]/20 rounded px-1.5 py-0.5 font-mono uppercase tracking-wider"
              >
                {isInputsCollapsed ? "EXPAND" : "COLLAPSE"}
              </span>
            </button>

            {#if !isInputsCollapsed}
              <div class="flex flex-col gap-3">
                <!-- Audio Input -->
                <div class="flex flex-col gap-1">
                  <label for="mic-select" class="input-label"
                    >MICROPHONE SOURCE</label
                  >
                  <div
                    class="flex items-center gap-2 bg-black/35 border border-white/10 rounded px-2 py-1 w-full min-w-0 overflow-hidden"
                  >
                    <Mic class="w-4 h-4 text-[#00ff66] flex-shrink-0" />
                    <select
                      id="mic-select"
                      bind:value={selectedAudioDevice}
                      disabled={engineState.isRecording}
                      class="flex-1 min-w-0 w-full bg-transparent text-white text-xs font-mono border-none outline-none py-1 cursor-pointer disabled:opacity-50 truncate"
                    >
                      {#each audioDevices as dev}
                        <option value={dev.deviceId} class="bg-neutral-900">
                          {dev.label ||
                            `Microphone ${dev.deviceId.slice(0, 5)}`}
                        </option>
                      {/each}
                    </select>
                  </div>
                </div>

                <!-- Video Input -->
                <div class="flex flex-col gap-1">
                  <label for="camera-select" class="input-label"
                    >CAMERA SOURCE</label
                  >
                  <div
                    class="flex items-center gap-2 bg-black/35 border border-white/10 rounded px-2 py-1 w-full min-w-0 overflow-hidden"
                  >
                    <Camera class="w-4 h-4 text-[#00ff66] flex-shrink-0" />
                    <select
                      id="camera-select"
                      bind:value={selectedVideoDevice}
                      disabled={engineState.isRecording}
                      class="flex-1 min-w-0 w-full bg-transparent text-white text-xs font-mono border-none outline-none py-1 cursor-pointer disabled:opacity-50 truncate"
                    >
                      {#each videoDevices as dev}
                        <option value={dev.deviceId} class="bg-neutral-900">
                          {dev.label || `Webcam ${dev.deviceId.slice(0, 5)}`}
                        </option>
                      {/each}
                    </select>
                  </div>
                </div>

                <!-- Video Toggle -->
                <div
                  class="flex items-center justify-between border-t border-white/5 pt-3 mt-1"
                >
                  <span class="input-label">MONITOR</span>
                  <button
                    onclick={() => (enableVideo = !enableVideo)}
                    class="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono uppercase transition-all duration-200 border cursor-pointer {enableVideo
                      ? 'bg-[#00ff66] text-black border-[#00ff66]'
                      : 'bg-transparent text-white/60 border-white/10'}"
                  >
                    {#if enableVideo}
                      <Video class="w-3.5 h-3.5" /> VIDEO ON
                    {:else}
                      <VideoOff class="w-3.5 h-3.5" /> VIDEO OFF
                    {/if}
                  </button>
                </div>

                <!-- Surveillance Location -->
                <div
                  class="flex flex-col gap-1 border-t border-white/5 pt-3 mt-1"
                >
                  <label for="location-input" class="input-label"
                    >LOCATION</label
                  >
                  <div
                    class="flex items-center gap-2 bg-black/35 border border-white/10 rounded px-2 py-1 w-full min-w-0"
                  >
                    <input
                      id="location-input"
                      type="text"
                      bind:value={locationText}
                      oninput={() => {
                        deviceCoords = null;
                      }}
                      placeholder="Type location manually..."
                      class="flex-1 bg-transparent text-white text-xs font-mono border-none outline-none py-1 min-w-0"
                    />
                    <button
                      onclick={getDeviceLocation}
                      disabled={isLocating}
                      class="px-2 py-1 bg-[#00ff66]/10 hover:bg-[#00ff66]/20 text-[#00ff66] border border-[#00ff66]/20 rounded text-[9px] font-mono uppercase tracking-wider transition-all cursor-pointer disabled:opacity-40"
                    >
                      {#if isLocating}
                        LOCATING...
                      {:else}
                        GPS
                      {/if}
                    </button>
                  </div>
                </div>
              </div>
            {/if}
          </div>

          <!-- Video Viewport / Playback Player -->
          {#if playbackMedia || enableVideo}
            <div
              class="glass-card flex-1 min-h-[180px] md:min-h-[240px] relative overflow-hidden flex flex-col justify-center bg-black/90 border-2 border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]"
              data-card="viewport"
            >
              <!-- Scanlines overlay -->
              <div
                class="absolute inset-0 scanlines pointer-events-none opacity-25 z-10"
              ></div>

              {#if playbackMedia}
                {#if playbackMedia.isVideo}
                  <!-- Playback Video Player -->
                  <video
                    bind:this={mediaPlaybackEl}
                    bind:paused={isMediaPaused}
                    src={playbackMedia.url}
                    controls
                    autoplay
                    class="w-full h-full object-contain bg-neutral-950 max-h-[300px] z-0"
                    ontimeupdate={handlePlayerTimeUpdate}
                  ></video>
                {:else}
                  <!-- Playback Audio Player with visualizer center stage -->
                  <div
                    class="w-full h-[240px] flex flex-col justify-between items-center bg-neutral-950 p-4 pt-16 z-0"
                  >
                    <div
                      class="flex-grow flex items-center justify-center gap-1.5 w-full max-w-[220px]"
                    >
                      {#each overlayWaveformBars as val, idx}
                        {@const isFilled = idx / 20 <= playerProgress}
                        <div
                          class="w-1.5 rounded-sm transition-all duration-75 {isFilled
                            ? 'bg-[#00ff66]'
                            : 'bg-white/10'}"
                          style="height: {Math.max(8, val * 100)}%;"
                        ></div>
                      {/each}
                    </div>
                    <audio
                      bind:this={mediaPlaybackEl}
                      bind:paused={isMediaPaused}
                      src={playbackMedia.url}
                      controls
                      autoplay
                      class="w-full max-w-[280px] h-8 mt-2 pointer-events-auto"
                      ontimeupdate={handlePlayerTimeUpdate}
                    ></audio>
                  </div>
                {/if}
              {:else}
                <!-- Live Video Feed -->
                <video
                  bind:this={videoEl}
                  autoplay
                  playsinline
                  muted
                  class="w-full h-full object-cover bg-neutral-950 max-h-[300px]"
                ></video>
              {/if}

              <!-- Surveillance Head-up Display Overlays (always visible to align with playback clip or live feed) -->
              {#if true}
                <div
                  class="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-3 select-none"
                >
                  <!-- Top Row -->
                  <div
                    class="w-full flex justify-between items-start pointer-events-none"
                  >
                    <!-- HUD Status / Action Button -->
                    <div class="flex flex-col gap-1.5 pointer-events-auto">
                      {#if playbackMedia}
                        <button
                          onclick={() => (playbackMedia = null)}
                          class="bg-[#00ff66] hover:bg-[#00d75f] text-black text-[9px] font-mono font-bold tracking-widest px-2.5 py-1 rounded flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-[0_0_10px_rgba(0,255,102,0.2)]"
                        >
                          &larr; LIVE STREAM
                        </button>
                        <div
                          class="bg-black/60 text-white/60 text-[8px] font-mono tracking-wider px-1.5 py-0.5 rounded border border-white/5 uppercase w-max"
                        >
                          PLAYBACK
                        </div>
                      {:else if engineState.isRecording}
                        {#if mode === "prick" && engineState.clipCapturingState === "capturing"}
                          <div
                            class="bg-[#0066ff] text-white text-[9px] font-mono font-bold tracking-widest px-2.5 py-0.5 rounded flex items-center gap-1.5 animate-pulse"
                          >
                            <span
                              class="w-1.5 h-1.5 rounded-full bg-white animate-ping"
                            ></span> CLIPPING
                          </div>
                        {:else}
                          <div
                            class="bg-red-600/90 text-white text-[9px] font-mono font-bold tracking-widest px-2 py-0.5 rounded flex items-center gap-1 animate-pulse"
                          >
                            <span class="w-1.5 h-1.5 rounded-full bg-white"
                            ></span> LIVE REC
                          </div>
                        {/if}
                      {:else}
                        <div
                          class="bg-yellow-600/90 text-white text-[9px] font-mono font-bold tracking-widest px-2 py-0.5 rounded flex items-center gap-1"
                        >
                          <span class="w-1.5 h-1.5 rounded-full bg-white"
                          ></span> LIVE FEED
                        </div>
                      {/if}
                    </div>

                    <!-- Top Right HUD Overlay -->
                    {#if !playbackMedia || !playbackMedia.isVideo}
                      <div
                        class="text-right flex flex-col items-end gap-0.5 font-mono text-[9px] text-[#00ff66] bg-black/60 px-2 py-1.5 rounded border border-[#00ff66]/10 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                      >
                        <div class="font-bold tracking-wider">
                          {formatUTCTime(HUDTime)}
                        </div>
                        <div class="tracking-wide">
                          {formatLocalTimeWithCentiseconds(HUDTime)}
                        </div>
                        <div class="text-white/70">{dateStr}</div>
                        <div
                          class="text-white/90 font-bold border-t border-[#00ff66]/20 mt-1 pt-0.5"
                        >
                          LOC: {locationText || "MANUAL"}
                        </div>
                      </div>
                    {/if}
                  </div>

                  <!-- Bottom Row -->
                  <div
                    class="w-full flex justify-between items-end pointer-events-none"
                  >
                    <!-- Bottom Left HUD Waveform -->
                    {#if !playbackMedia || !playbackMedia.isVideo}
                      <div
                        class="bg-black/70 border border-[#00ff66]/20 rounded p-1.5 flex items-end gap-[1.5px] h-9 w-28 pointer-events-none"
                      >
                        {#each overlayWaveformBars as val, idx}
                          {@const isFilled =
                            !playbackMedia || idx / 20 <= playerProgress}
                          <div
                            class="flex-grow rounded-sm transition-all duration-75 {isFilled
                              ? 'bg-[#00ff66]'
                              : 'bg-white/10'}"
                            style="height: {Math.max(4, val * 100)}%;"
                          ></div>
                        {/each}
                      </div>
                    {/if}

                    <!-- Bottom Right HUD Logo -->
                    {#if !playbackMedia || !playbackMedia.isVideo}
                      <div
                        class="flex items-center gap-1.5 font-mono font-bold tracking-widest text-[#00ff66] bg-black/60 px-2 py-1 rounded border border-[#00ff66]/10"
                      >
                        <span>DOGS</span>
                        <DogsLogo size="panel" />
                      </div>
                    {/if}
                  </div>
                </div>
              {/if}
            </div>
          {/if}
        </div>

        <!-- Right Panel: Recorder controls, Visualizer & Transcription (Col 6-12 on Desktop) -->
        <div class="xl:col-span-7 flex flex-col gap-4 min-h-0">
          <!-- Conditionally Render: Live Transcript or Prick Clips Panel -->
          {#if mode === "recorder"}
            <!-- Live Transcript Card -->
            <div
              class="glass-card flex-1 flex flex-col p-4 min-h-[180px] overflow-hidden"
              class:taller-clips={!isInputsCollapsed ||
                (mode === "prick" && !isPrickSettingsCollapsed)}
              data-card="clips"
            >
              <div
                class="flex items-center justify-between border-b border-white/5 pb-2 mb-3"
              >
                <h3 class="panel-header uppercase">
                  <span
                    class="pulse-indicator bg-[#00ff66]"
                    class:recording={engineState.isRecording}
                  ></span>
                  Live Transcript
                </h3>

                <button
                  onclick={copyTranscript}
                  disabled={!liveTranscript.final}
                  class="flex items-center gap-1.5 text-[10px] text-white/50 hover:text-[#00ff66] font-mono bg-white/5 border border-white/10 hover:border-[#00ff66]/35 rounded px-2.5 py-1 transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                >
                  {#if isCopied}
                    <Check class="w-3 h-3 text-[#00ff66]" /> COPIED
                  {:else}
                    <Copy class="w-3 h-3" /> COPY
                  {/if}
                </button>
              </div>

              <!-- Scrolling Transcript Content -->
              <div
                bind:this={transcriptContainer}
                class="flex-grow overflow-y-auto bg-black/40 border border-white/5 rounded p-3 font-mono text-sm leading-relaxed text-white/85 max-h-[220px] xl:max-h-none"
              >
                {#if engineState.isRecording}
                  <span class="text-white">{liveTranscript.final}</span>
                  <span class="text-[#00ff66]/80 italic"
                    >{liveTranscript.interim}</span
                  >
                  {#if !liveTranscript.final && !liveTranscript.interim}
                    <span
                      class="text-white/20 animate-pulse block text-center py-8"
                    >
                      Awaiting transcription capture...
                    </span>
                  {/if}
                {:else}
                  <span class="text-white">
                    {liveTranscript.final ||
                      "Press Record to capture speech-to-text transcript."}
                  </span>
                {/if}
              </div>
            </div>
          {:else}
            <!-- Prick Clips Card -->
            <div
              class="glass-card flex-1 flex flex-col p-4 min-h-[180px] overflow-hidden"
              class:taller-clips={!isInputsCollapsed ||
                (mode === "prick" && !isPrickSettingsCollapsed)}
              data-card="clips"
            >
              <div
                class="flex items-center justify-between border-b border-white/5 pb-2 mb-3"
              >
                <h3 class="panel-header uppercase flex items-center gap-2">
                  <span
                    class="pulse-indicator bg-[#00ff66]"
                    class:recording={engineState.isRecording}
                  ></span>
                  Clips
                  {#if clips.length > 0}
                    <span
                      class="text-[10px] font-mono text-[#00ff66] font-normal"
                    >
                      [ {clips.length} clip{clips.length === 1 ? "" : "s"} ]
                    </span>
                  {/if}
                </h3>

                <div class="flex items-center gap-2">
                  <button
                    onclick={downloadAllClipsAsZip}
                    disabled={clips.length === 0 || isZipping}
                    class="flex items-center gap-1.5 text-[10px] text-white/50 hover:text-[#00ff66] font-mono bg-white/5 border border-white/10 hover:border-[#00ff66]/35 rounded px-2.5 py-1 transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <Download class="w-3 h-3" />
                    {#if isZipping}ZIPPING...{:else}ZIP ALL{/if}
                  </button>

                  <button
                    onclick={() => {
                      clips = [];
                      engine.clips = [];
                    }}
                    disabled={clips.length === 0}
                    class="flex items-center gap-1.5 text-[10px] text-white/50 hover:text-[#ff3344] font-mono bg-white/5 border border-white/10 hover:border-[#ff3344]/35 rounded px-2.5 py-1 transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <Trash2 class="w-3 h-3" /> CLEAR
                  </button>
                </div>
              </div>

              <!-- Scrolling Clips Content -->
              <div
                class="flex-grow overflow-y-auto bg-black/40 border border-white/5 rounded p-3 font-mono text-xs max-h-[220px] xl:max-h-none flex flex-col gap-2 min-h-0"
              >
                {#if clips.length === 0}
                  <div
                    class="flex-grow flex flex-col items-center justify-center text-center py-8 text-white/20 select-none"
                  >
                    {#if engineState.isRecording}
                      <div class="flex items-center gap-2 mb-1 animate-pulse">
                        <span class="w-2 h-2 bg-[#00ff66] rounded-full"></span>
                        <span
                          class="text-xs uppercase tracking-wider text-[#00ff66]"
                        >
                          MONITORING SOUND SENSORS...
                        </span>
                      </div>
                      <span class="text-[10px]">
                        Clips will record automatically when volume crosses
                        trigger threshold.
                      </span>
                    {:else}
                      <Volume2 class="w-8 h-8 mb-2 opacity-30" />
                      <span>
                        Press Record to start monitoring and capture prick
                        clips.
                      </span>
                    {/if}
                  </div>
                {:else}
                  {#each clips as clip, index (clip.id)}
                    <div
                      class="flex items-center justify-between gap-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded p-2.5 transition-all"
                    >
                      <!-- Clip media / icon thumbnail -->
                      <div
                        class="flex-shrink-0 w-16 h-12 relative bg-neutral-900 rounded overflow-hidden border border-white/10 flex items-center justify-center"
                      >
                        {#if clip.isVideo}
                          <video
                            src={clip.url}
                            muted
                            loop
                            playsinline
                            class="w-full h-full object-cover"
                          ></video>
                        {:else}
                          <Volume2 class="w-5 h-5 text-[#00ff66]" />
                        {/if}
                      </div>

                      <!-- Metadata -->
                      <div class="flex-grow min-w-0 text-left">
                        <div
                          class="flex items-center gap-1.5 text-white/90 font-bold mb-0.5"
                        >
                          <span class="truncate"
                            >{clip.isVideo ? "VIDEO" : "AUDIO"} CLIP</span
                          >
                          <span class="text-white/45 text-[10px] font-normal"
                            >{clip.duration.toFixed(1)}s</span
                          >
                        </div>
                        <div class="text-[10px] text-white/40 leading-none">
                          {clip.timestamp.toLocaleDateString()}
                          {clip.timestamp.toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </div>
                      </div>

                      <!-- Interactive buttons -->
                      <div class="flex items-center gap-1.5 flex-shrink-0">
                        <!-- Play in Unified Monitor Viewport -->
                        <button
                          onclick={() => playClipInViewport(clip)}
                          class="p-1.5 bg-[#00ff66]/10 hover:bg-[#00ff66]/20 text-[#00ff66] border border-[#00ff66]/20 rounded transition-all cursor-pointer"
                          title="Play Clip in Surveillance Panel"
                        >
                          <Play class="w-3.5 h-3.5" />
                        </button>

                        <!-- Download Clip -->
                        <button
                          onclick={() => downloadClipAsZip(clip, index)}
                          class="p-1.5 bg-white/5 hover:bg-white/10 text-white/70 border border-white/10 rounded transition-all cursor-pointer"
                          title="Download Clip ZIP"
                        >
                          <Download class="w-3.5 h-3.5" />
                        </button>

                        <!-- Delete Clip -->
                        <button
                          onclick={() => {
                            clips = clips.filter((c) => c.id !== clip.id);
                            engine.clips = engine.clips.filter(
                              (c) => c.id !== clip.id,
                            );
                          }}
                          class="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded transition-all cursor-pointer"
                          title="Delete Clip"
                        >
                          <Trash2 class="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  {/each}
                {/if}
              </div>
            </div>
          {/if}

          <!-- Audio Stream Control & Visualizer Card -->
          <div
            class="glass-card p-4 flex flex-col justify-between gap-4"
            data-card="monitor"
          >
            <!-- Controls / Waveform layout -->
            <div class="flex flex-col gap-3">
              <!-- Live Waveform & Timeline Player -->
              {#if engineState.isRecording || decodedPeaks.length > 0 || playbackMedia}
                {@const isLiveScrolling =
                  engineState.isRecording && livePeaksDuration > 10}
                {@const timelineStart = isLiveScrolling
                  ? livePeaksDuration - 10
                  : 0}
                {@const totalTime = engineState.isRecording
                  ? Math.max(10, livePeaksDuration)
                  : displayDuration}
                {@const peaksToRender = engineState.isRecording
                  ? livePeaks
                  : playbackMedia && playbackMedia.peaks
                    ? playbackMedia.peaks
                    : decodedPeaks}
                {@const timelineStartDate = playbackMedia
                  ? playbackMedia.timestamp
                  : recordingStartDate}
                <div class="flex flex-col gap-2 text-left">
                  <div class="flex items-center justify-between">
                    <span
                      class="input-label text-[10px] {engineState.isRecording
                        ? 'text-[#ff3344]'
                        : ''}"
                    >
                      {#if engineState.isRecording}
                        LIVE SURVEILLANCE AUDIO MONITOR
                      {:else}
                        PLAYBACK TIMELINE & AUDIO WAVEFORM
                      {/if}
                    </span>
                    <span
                      class="text-[10px] font-mono tracking-wider {engineState.isRecording
                        ? 'text-[#ff3344]'
                        : 'text-white/50'}"
                    >
                      {#if engineState.isRecording}
                        RECORDING: {formatTime(livePeaksDuration)}
                      {:else}
                        {formatTime(displayCurrentTime)} / {formatTime(
                          displayDuration,
                        )}
                      {/if}
                    </span>
                  </div>

                  <!-- Waveform grid -->
                  <div
                    class="flex items-center justify-between w-full h-16 gap-[2px] bg-black/45 border rounded px-2 relative select-none {engineState.isRecording
                      ? 'border-[#ff3344]/30'
                      : 'border-white/10 hover:border-white/20 cursor-ew-resize'}"
                    onpointerdown={!engineState.isRecording
                      ? handleWaveformPointerDown
                      : null}
                  >
                    <!-- Vertical grid lines -->
                    <div
                      class="absolute left-[25%] top-0 w-[1px] h-full border-l border-dashed border-white/10 pointer-events-none z-0"
                    ></div>
                    <div
                      class="absolute left-[50%] top-0 w-[1px] h-full border-l border-dashed border-white/10 pointer-events-none z-0"
                    ></div>
                    <div
                      class="absolute left-[75%] top-0 w-[1px] h-full border-l border-dashed border-white/10 pointer-events-none z-0"
                    ></div>

                    {#each peaksToRender as peak, idx}
                      {@const isActive = engineState.isRecording
                        ? idx < livePeaksCount
                        : idx / peaksToRender.length <= displayProgress}
                      <div
                        class="flex-1 rounded-sm transition-colors duration-100 {isActive
                          ? 'bg-[#00ff66]'
                          : 'bg-white/20'} z-10"
                        style="height: {Math.max(4, peak * 80)}%;"
                      ></div>
                    {/each}
                  </div>

                  <!-- Waveform Timestamps -->
                  <div
                    class="relative h-8 text-[9px] font-mono text-white/40 mt-1 select-none border-t border-white/5 pt-1.5"
                  >
                    <!-- Column 0 -->
                    <div
                      class="absolute left-0 top-1.5 text-left flex flex-col gap-0.5"
                    >
                      <span class="text-white/60"
                        >{formatTime(timelineStart)}</span
                      >
                      <span class="text-white/25 text-[8px] tracking-tight">
                        {formatWallClockTime(timelineStartDate, timelineStart)}
                      </span>
                    </div>
                    <!-- Column 1 -->
                    <div
                      class="absolute left-[25%] top-1.5 -translate-x-1/2 text-center flex flex-col gap-0.5"
                    >
                      <span class="text-white/60">
                        {formatTime(
                          isLiveScrolling
                            ? livePeaksDuration - 7.5
                            : totalTime * 0.25,
                        )}
                      </span>
                      <span class="text-white/25 text-[8px] tracking-tight">
                        {formatWallClockTime(
                          timelineStartDate,
                          isLiveScrolling
                            ? livePeaksDuration - 7.5
                            : totalTime * 0.25,
                        )}
                      </span>
                    </div>
                    <!-- Column 2 -->
                    <div
                      class="absolute left-[50%] top-1.5 -translate-x-1/2 text-center flex flex-col gap-0.5"
                    >
                      <span class="text-white/60">
                        {formatTime(
                          isLiveScrolling
                            ? livePeaksDuration - 5
                            : totalTime * 0.5,
                        )}
                      </span>
                      <span class="text-white/25 text-[8px] tracking-tight">
                        {formatWallClockTime(
                          timelineStartDate,
                          isLiveScrolling
                            ? livePeaksDuration - 5
                            : totalTime * 0.5,
                        )}
                      </span>
                    </div>
                    <!-- Column 3 -->
                    <div
                      class="absolute left-[75%] top-1.5 -translate-x-1/2 text-center flex flex-col gap-0.5"
                    >
                      <span class="text-white/60">
                        {formatTime(
                          isLiveScrolling
                            ? livePeaksDuration - 2.5
                            : totalTime * 0.75,
                        )}
                      </span>
                      <span class="text-white/25 text-[8px] tracking-tight">
                        {formatWallClockTime(
                          timelineStartDate,
                          isLiveScrolling
                            ? livePeaksDuration - 2.5
                            : totalTime * 0.75,
                        )}
                      </span>
                    </div>
                    <!-- Column 4 -->
                    <div
                      class="absolute right-0 top-1.5 text-right flex flex-col gap-0.5"
                    >
                      <span class="text-white/60">
                        {formatTime(
                          isLiveScrolling ? livePeaksDuration : totalTime,
                        )}
                      </span>
                      <span class="text-white/25 text-[8px] tracking-tight">
                        {formatWallClockTime(
                          timelineStartDate,
                          isLiveScrolling ? livePeaksDuration : totalTime,
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              {/if}

              <!-- Trigger Threshold controls when in Prick Mode -->
              {#if mode === "prick"}
                <div
                  class="flex flex-col gap-3 border-t border-white/5 pt-3 mt-1 text-left"
                >
                  <button
                    onclick={() =>
                      (isPrickSettingsCollapsed = !isPrickSettingsCollapsed)}
                    class="panel-header w-full flex items-center justify-between cursor-pointer focus:outline-none select-none text-left border-none bg-transparent p-0"
                  >
                    <span class="flex items-center gap-2">
                      <span
                        class="w-1.5 h-1.5 rounded-full transition-all duration-75 flex-shrink-0 {liveVolume >
                        triggerThreshold
                          ? 'bg-[#00ff66] shadow-[0_0_8px_#00ff66]'
                          : 'bg-white/20'}"
                      ></span> SENSORS
                    </span>
                    <span
                      class="text-[9px] text-[#00ff66]/70 border border-[#00ff66]/20 rounded px-1.5 py-0.5 font-mono uppercase tracking-wider"
                    >
                      {isPrickSettingsCollapsed ? "EXPAND" : "COLLAPSE"}
                    </span>
                  </button>

                  {#if !isPrickSettingsCollapsed}
                    <div class="flex flex-col gap-3">
                      <!-- Trigger Threshold -->
                      <div class="flex flex-col gap-1">
                        <div class="flex items-center justify-between">
                          <span
                            class="input-label text-[10px] flex items-center gap-1.5"
                          >
                            <Sliders class="w-3.5 h-3.5 text-[#00ff66]" /> THRESHOLD
                          </span>
                          <span
                            class="text-[10px] font-mono text-white/50 tracking-wider"
                          >
                            THRESHOLD: {triggerThreshold.toFixed(2)} (LIVE: {liveVolume.toFixed(
                              2,
                            )})
                          </span>
                        </div>
                        <div
                          class="flex items-center gap-4 bg-black/45 border border-white/10 rounded px-3 py-2"
                        >
                          <!-- Trigger Indicator Light -->
                          <span
                            class="w-2.5 h-2.5 rounded-full transition-all duration-75 flex-shrink-0 {liveVolume >
                            triggerThreshold
                              ? 'bg-[#00ff66] shadow-[0_0_8px_#00ff66]'
                              : 'bg-white/10'}"
                            title={liveVolume > triggerThreshold
                              ? "Triggered"
                              : "Monitoring"}
                          ></span>

                          <!-- The slider -->
                          <input
                            type="range"
                            min="0.01"
                            max="1.0"
                            step="0.01"
                            bind:value={triggerThreshold}
                            class="flex-grow h-1 bg-white/15 rounded-lg appearance-none cursor-pointer accent-[#00ff66]"
                          />

                          <!-- Live volume bar gauge -->
                          <div
                            class="w-24 h-2.5 bg-white/5 rounded border border-white/10 overflow-hidden relative flex items-center"
                          >
                            <div
                              class="h-full bg-[#00ff66]/80 transition-all duration-75"
                              style="width: {liveVolume * 100}%"
                            ></div>
                            <!-- Threshold tick mark line -->
                            <div
                              class="absolute top-0 bottom-0 w-[2px] bg-red-500"
                              style="left: {triggerThreshold * 100}%"
                              title="Threshold marker"
                            ></div>
                          </div>
                        </div>
                      </div>

                      <!-- Clip Length control -->
                      <div class="flex flex-col gap-1">
                        <div class="flex items-center justify-between">
                          <span
                            class="input-label text-[10px] flex items-center gap-1.5"
                          >
                            <Hourglass class="w-3.5 h-3.5 text-[#00ff66]" /> DURATION
                          </span>
                          <span
                            class="text-[10px] font-mono text-white/50 tracking-wider"
                          >
                            LENGTH: {clipLength}s
                          </span>
                        </div>
                        <div
                          class="flex items-center gap-4 bg-black/45 border border-white/10 rounded px-3 py-2"
                        >
                          <input
                            type="range"
                            min="1"
                            max="10"
                            step="1"
                            bind:value={clipLength}
                            class="flex-grow h-1 bg-white/15 rounded-lg appearance-none cursor-pointer accent-[#00ff66]"
                          />
                        </div>
                      </div>
                    </div>
                  {/if}
                </div>
              {/if}
            </div>

            <!-- Lower action bar -->
            <div
              class="flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-3"
            >
              <!-- Mode Toggle & Status info -->
              <div class="flex items-center gap-4 flex-wrap">
                <!-- Cyberpunk Mode Slide Toggle -->
                <div
                  class="flex items-center gap-1 bg-black/40 border border-white/10 rounded p-1"
                >
                  <button
                    onclick={() => (mode = "recorder")}
                    disabled={engineState.isRecording}
                    class="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed {mode ===
                    'recorder'
                      ? 'bg-[#00ff66] text-black font-bold'
                      : 'text-white/60 hover:text-white'}"
                  >
                    LISTEN
                  </button>
                  <button
                    onclick={() => (mode = "prick")}
                    disabled={engineState.isRecording}
                    class="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed {mode ===
                    'prick'
                      ? 'bg-[#00ff66] text-black font-bold'
                      : 'text-white/60 hover:text-white'}"
                  >
                    PRICKS
                  </button>
                </div>

                <!-- Status indicator -->
                <div class="flex items-center gap-2">
                  {#if engineState.isRecording}
                    {#if mode === "prick" && engineState.clipCapturingState === "capturing"}
                      <span
                        class="flex items-center gap-1 text-xs text-[#0066ff] font-mono font-bold tracking-widest uppercase animate-pulse"
                      >
                        <span
                          class="w-2 h-2 bg-[#0066ff] rounded-full animate-ping mr-1"
                        ></span> CLIP
                      </span>
                    {:else}
                      <span
                        class="flex items-center gap-1 text-xs text-red-500 font-mono font-bold tracking-widest uppercase"
                      >
                        <span
                          class="w-2 h-2 bg-red-600 rounded-full animate-ping mr-1"
                        ></span> REC
                      </span>
                    {/if}
                  {:else if engineState.isDecoding}
                    <span
                      class="text-xs text-[#00ff66] font-mono font-bold animate-pulse tracking-wide uppercase"
                    >
                      DECODING AUDIO...
                    </span>
                  {:else}
                    <span
                      class="text-xs text-white/30 font-mono tracking-wider uppercase"
                    >
                      IDLE
                    </span>
                  {/if}
                </div>
              </div>

              <!-- Main Interactive buttons -->
              <div class="flex items-center gap-2">
                <!-- Record / Stop Button -->
                {#if engineState.isRecording}
                  <button
                    onclick={stopRecording}
                    class="px-5 py-2.5 bg-[#ff3344] text-white font-mono text-xs font-bold uppercase rounded hover:bg-red-600 active:scale-95 transition-all shadow-[0_0_15px_rgba(255,51,68,0.2)] cursor-pointer"
                  >
                    STOP
                  </button>
                {:else if !playbackMedia}
                  <button
                    onclick={startRecording}
                    disabled={engineState.isDecoding || engineState.isPlaying}
                    class="px-5 py-2.5 bg-[#00ff66] text-black font-mono text-xs font-bold uppercase rounded hover:bg-[#00d75f] active:scale-95 transition-all shadow-[0_0_15px_rgba(0,255,102,0.25)] cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                  >
                    RECORD
                  </button>
                {/if}

                <!-- Playback toggle (Full Recording or Clip Playback) -->
                {#if playbackMedia}
                  <!-- Exit Playback button -->
                  <button
                    onclick={() => {
                      if (mediaPlaybackEl) {
                        mediaPlaybackEl.pause();
                      }
                      playbackMedia = null;
                    }}
                    class="px-4 py-2.5 bg-[#ff3344]/20 hover:bg-[#ff3344]/30 text-[#ff3344] border border-[#ff3344]/30 font-mono text-xs font-bold uppercase rounded active:scale-95 transition-all cursor-pointer"
                    title="Exit Playback"
                  >
                    Exit Playback
                  </button>

                  <!-- Play/Pause for the currently playing clip/recording -->
                  {#if isMediaPlaying}
                    <button
                      onclick={() => {
                        if (mediaPlaybackEl) mediaPlaybackEl.pause();
                      }}
                      class="p-2.5 bg-white/10 hover:bg-white/15 text-white rounded active:scale-95 transition-all cursor-pointer"
                      title="Pause"
                    >
                      <Pause class="w-4 h-4" />
                    </button>
                  {:else}
                    <button
                      onclick={() => {
                        if (mediaPlaybackEl) mediaPlaybackEl.play();
                      }}
                      class="p-2.5 bg-[#00ff66] hover:bg-[#00d75f] text-black rounded active:scale-95 transition-all cursor-pointer"
                      title="Play"
                    >
                      <Play class="w-4 h-4" />
                    </button>
                  {/if}
                {:else if decodedPeaks.length > 0}
                  <!-- Full recording Play/Pause toggle -->
                  {#if engineState.isPlaying}
                    <button
                      onclick={() => engine.pause()}
                      class="p-2.5 bg-white/10 hover:bg-white/15 text-white rounded active:scale-95 transition-all cursor-pointer"
                      title="Pause"
                    >
                      <Pause class="w-4 h-4" />
                    </button>
                  {:else}
                    <button
                      onclick={() => playFullRecording()}
                      disabled={engineState.isDecoding}
                      class="p-2.5 bg-[#00ff66] hover:bg-[#00d75f] text-black rounded active:scale-95 transition-all cursor-pointer"
                      title="Play"
                    >
                      <Play class="w-4 h-4" />
                    </button>
                  {/if}

                  <!-- Save Recording -->
                  <button
                    onclick={() => engine.download()}
                    class="p-2.5 bg-white/10 hover:bg-white/15 text-white rounded active:scale-95 transition-all cursor-pointer"
                    title="Download recorded file"
                  >
                    <Download class="w-4 h-4" />
                  </button>

                  <!-- Reset -->
                  <button
                    onclick={reset}
                    class="p-2.5 border border-white/10 hover:bg-white/5 text-white/50 hover:text-white rounded active:scale-95 transition-all cursor-pointer"
                    title="Reset wiretap"
                  >
                    <RefreshCw class="w-4 h-4" />
                  </button>
                {/if}
              </div>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</BaseApp>

<style lang="scss">
  @use "../../styles/Wiretap.scss";
</style>
