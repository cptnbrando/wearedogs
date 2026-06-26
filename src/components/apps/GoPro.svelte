<script>
    import { onMount, onDestroy } from "svelte";
    import {
        Play,
        Pause,
        RotateCcw,
        SkipForward,
        Info,
        Download,
        Music,
        Bookmark,
        Trash2,
        Sliders,
        Volume2,
        Eye,
        EyeOff,
        Radio,
        Tv,
        Maximize,
        Minimize,
        ArrowLeft,
    } from "lucide-svelte";
    import { samplerStore } from "../../lib/samplerStore.svelte.js";
    import { catalog as cachedCatalog } from "./videos.js";
    import GoProRemapper from "./GoProRemapper.svelte";
    import GoProCatalog from "./GoProCatalog.svelte";

    // State Management (Runes)
    let catalog = $state(cachedCatalog);
    let activeShowKey = $state("Batman Beyond");
    let currentEpisodeIndex = $state(0);
    let activeShow = $derived(
        catalog[activeShowKey] || {
            episodes: [],
            meta: { actors: [], facts: "" },
        },
    );
    let currentEpisode = $derived(
        activeShow.episodes[currentEpisodeIndex] || { title: "", file: "" },
    );

    // Local file caching & pre-flight existence checks
    let streamUrl = $state("");
    let showDownloadPrompt = $state(false);

    // Seasons selection state
    let selectedSeasons = $state({}); // key: showKey, value: seasonNum

    function getEpisodeSeason(ep) {
        if (!ep || !ep.file) return 1;
        const match = ep.file.match(/S([0-9]+)/i);
        return match ? parseInt(match[1], 10) : 1;
    }

    async function checkLocalFile(file) {
        if (!file) {
            streamUrl = "";
            return;
        }
        try {
          if(file.startsWith("https://data.wearedogs.net")) {
            streamUrl = file;
            return file;
          }
            const folder = activeShowKey === "Batman Beyond" ? "/batman/" : "/";

            // Check for the standard file name first (e.g. S01 E01 - Rebirth, Part 1 of 2.ia.mp4)
            let path = `${folder}${file}`;
            let res = await fetch(encodeURI(path), { method: "HEAD" });
            if (res.ok) {
              streamUrl = encodeURI(path);
              return;
            }

            // If local file is not present, use the remote URL directly
            streamUrl = file;
        } catch {
            streamUrl = "";
        }
    }

    function handleVideoError() {
        isChangingEpisode = false;
        if (
            streamUrl &&
            (streamUrl.startsWith("http://") ||
                streamUrl.startsWith("https://"))
        ) {
            showDownloadPrompt = true;
        }
    }

    $effect(() => {
        if (currentEpisode && currentEpisode.file) {
            showDownloadPrompt = false;
            checkLocalFile(currentEpisode.file);
        }
    });

    // Auto skips
    $effect(() => {
        if (autoSkipIntro && isInIntroRange && videoEl && isPlaying) {
            skipIntro();
        }
    });

    $effect(() => {
        if (autoSkipOutro && isInOutroRange && videoEl && isPlaying) {
            skipOutro();
        }
    });

    $effect(() => {
        const url = streamUrl;
        const active = isPlayingEpisode;

        if (url && active && videoEl) {
            const playVideo = () => {
                videoEl.play().catch((err) => {
                    console.warn("Autoplay failed:", err);
                });
            };

            if (videoEl.readyState >= 3) {
                playVideo();
            } else {
                videoEl.addEventListener("canplay", playVideo, { once: true });
                return () => {
                    videoEl.removeEventListener("canplay", playVideo);
                };
            }
        }
    });

    // Player State
    let videoEl = $state(null);
    let isPlaying = $state(false);
    let currentTime = $state(0);
    let duration = $state(0);
    let playbackRate = $state(1);
    let isMuted = $state(false);
    let volume = $state(0.8);
    let hudVisible = $state(true);

    // Auto skip & remapper states
    let isRemapperOpen = $state(false);
    let autoSkipIntro = $state(false);
    let autoSkipOutro = $state(false);
    let isCursorHidden = $state(false);
    let cursorTimeout = null;
    let flashSkipIntroGlow = $state(false);
    let flashSkipOutroGlow = $state(false);

    // Playback Loop Modes: 'none' | 'episode' | 'season' | 'shuffle'
    let loopMode = $state("none");

    // Filters State
    let activeVideoFilter = $state("normal"); // 'normal' | 'grayscale' | 'monochrome' | 'highcontrast' | 'cyberpunk' | 'nightvision'
    let activeAudioFilter = $state("normal"); // 'normal' | 'funny' | 'vocal' | 'reverb'

    // Clipping State
    let clipStart = $state(0);
    let clipEnd = $state(0);
    let isClipLoopActive = $state(false);
    let clipName = $state("");

    // Storage Cache / Checkpoints State
    let checkpoints = $state([]);
    let isMetadataOpen = $state(false);
    let isCheckpointsOpen = $state(false);
    let localCacheProgress = $state(92.4); // Mock cache progress percentage

    // View & Fullscreen Overlay States
    let isPlayingEpisode = $state(false);
    let controlsVisible = $state(true);
    let playerContainerEl = $state(null);
    let isFullscreen = $state(false);
    let isMaximized = $state(false);
    let isChangingEpisode = false;
    let controlsTimeout = null;

    // Dot animation indicators state
    let lastNumberPressTime = 0;
    let activeEffectType = "ring";
    let dotEffectsList = ["sparkles", "pixels", "ring", "glitch", "pulse"];
    let dotParticles = $state([]);

    // BPM and beat repeating configurations
    let bpm = $state(120);
    let repeatInterval = $derived(bpm > 0 ? 15000 / bpm : BPM_MAX);
    const BPM_MAX = 180;
    const BPM_MIN = 24;

    // Key repeating timer variables
    let activeRepeatKey = null;
    let repeatTimer = null;

    function getMappedTime(key) {
        const storageKey = `gopro_remapper_${activeShowKey}_${currentEpisode.title}`;
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    const match = parsed.find(m => m.key === key);
                    if (match) return match.time;
                } catch {}
            }
        }
        return duration * (parseInt(key) * 10) / 100;
    }

    function jumpToMappedKey(key) {
        if (!videoEl || duration === 0) return;
        const target = getMappedTime(key);
        videoEl.currentTime = target;
        if (controlsVisible) {
            resetControlsTimer();
        }
    }

    function scheduleNextTick() {
        if (activeRepeatKey === null) return;
        repeatTimer = setTimeout(() => {
            if (activeRepeatKey === null) return;
            jumpToMappedKey(activeRepeatKey);
            triggerDotAnimation();
            scheduleNextTick();
        }, repeatInterval);
    }

    function startRepeating(key) {
        if (activeRepeatKey === key) return;
        stopRepeating();
        activeRepeatKey = key;
        jumpToMappedKey(key);
        triggerDotAnimation();
        scheduleNextTick();
    }

    function stopRepeating() {
        activeRepeatKey = null;
        if (repeatTimer) {
            clearTimeout(repeatTimer);
            repeatTimer = null;
        }
    }

    function handleBpmBlur() {
        if (bpm === null || bpm === undefined || isNaN(bpm) || bpm < BPM_MIN) {
            bpm = BPM_MIN;
        } else if (bpm > BPM_MAX) {
            bpm = BPM_MAX;
        }
    }

    function triggerDotAnimation() {
        const now = Date.now();
        // If break is more than 1 second, choose a new randomized style
        if (now - lastNumberPressTime > 1000) {
            const currentIdx = dotEffectsList.indexOf(activeEffectType);
            let nextIdx;
            do {
                nextIdx = Math.floor(Math.random() * dotEffectsList.length);
            } while (nextIdx === currentIdx && dotEffectsList.length > 1);
            activeEffectType = dotEffectsList[nextIdx];
        }
        lastNumberPressTime = now;

        const timestamp = now;
        let newParticles = [];
        if (activeEffectType === "sparkles") {
            for (let i = 0; i < 5; i++) {
                const angle = (i * 2 * Math.PI) / 5;
                const distance = 25 + Math.random() * 15;
                const tx = Math.cos(angle) * distance;
                const ty = Math.sin(angle) * distance;
                newParticles.push({
                    id: Math.random(),
                    type: "sparkle",
                    style: `--tx: ${tx}px; --ty: ${ty}px; --color: #ff3344;`,
                });
            }
        } else if (activeEffectType === "pixels") {
            for (let i = 0; i < 8; i++) {
                const tx = (Math.random() - 0.5) * 60;
                const ty = (Math.random() - 0.5) * 60;
                newParticles.push({
                    id: Math.random(),
                    type: "pixel",
                    style: `--tx: ${tx}px; --ty: ${ty}px; --color: #ffffff;`,
                });
            }
        } else if (activeEffectType === "ring") {
            newParticles.push({
                id: Math.random(),
                type: "ring",
                style: `--color: #ff3344;`,
            });
        } else if (activeEffectType === "glitch") {
            newParticles.push({
                id: Math.random(),
                type: "glitch-red",
                style: `--color: #ff3344;`,
            });
            newParticles.push({
                id: Math.random(),
                type: "glitch-white",
                style: `--color: #ffffff;`,
            });
        } else if (activeEffectType === "pulse") {
            newParticles.push({
                id: Math.random(),
                type: "pulse",
                style: `--color: #ff3344;`,
            });
        }

        newParticles.push({
            id: Math.random(),
            type: "core-dot",
            style: `--color: #ff3344;`,
        });

        dotParticles = [...dotParticles, ...newParticles];

        setTimeout(() => {
            dotParticles = dotParticles.filter(
                (p) => !newParticles.some((np) => np.id === p.id),
            );
        }, 400);
    }

    // Web Audio Context setup
    let audioCtx = null;
    let audioSource = null;
    let audioGainNode = null;
    let activeFilterNode = null;

    function initAudio() {
        if (audioCtx) return;
        try {
            const AudioContextClass =
                window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContextClass({
                latencyHint: "interactive",
            });
            if (videoEl) {
                audioSource = audioCtx.createMediaElementSource(videoEl);
                audioGainNode = audioCtx.createGain();
                audioGainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
                applyAudioFilterGraph();
            }
        } catch (e) {
            console.error("Web Audio Init failed:", e);
        }
    }

    function applyAudioFilterGraph() {
        if (!audioCtx || !audioSource) return;

        // Disconnect existing filters
        audioSource.disconnect();
        if (activeFilterNode) {
            activeFilterNode.disconnect();
            activeFilterNode = null;
        }
        audioGainNode.disconnect();

        const now = audioCtx.currentTime;

        if (activeAudioFilter === "normal") {
            audioSource.connect(audioGainNode);
            audioGainNode.connect(audioCtx.destination);
        } else if (activeAudioFilter === "funny") {
            // Distortion + highpass + lowpass
            const highpass = audioCtx.createBiquadFilter();
            highpass.type = "highpass";
            highpass.frequency.setValueAtTime(800, now);

            const lowpass = audioCtx.createBiquadFilter();
            lowpass.type = "lowpass";
            lowpass.frequency.setValueAtTime(3200, now);

            const shaper = audioCtx.createWaveShaper();
            const makeDistortionCurve = (amount) => {
                const k = amount;
                const n_samples = 44100;
                const curve = new Float32Array(n_samples);
                const deg = Math.PI / 180;
                for (let i = 0; i < n_samples; ++i) {
                    const x = (i * 2) / n_samples - 1;
                    curve[i] =
                        ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
                }
                return curve;
            };
            shaper.curve = makeDistortionCurve(100);
            shaper.oversample = "4x";

            audioSource.connect(highpass);
            highpass.connect(shaper);
            shaper.connect(lowpass);
            lowpass.connect(audioGainNode);
            audioGainNode.connect(audioCtx.destination);

            activeFilterNode = highpass; // track head node of chain
        } else if (activeAudioFilter === "vocal") {
            // Bandpass centered at speech frequencies
            const bandpass = audioCtx.createBiquadFilter();
            bandpass.type = "bandpass";
            bandpass.frequency.setValueAtTime(1500, now);
            bandpass.Q.setValueAtTime(1.5, now);

            const boost = audioCtx.createGain();
            boost.gain.setValueAtTime(1.8, now);

            audioSource.connect(bandpass);
            bandpass.connect(boost);
            boost.connect(audioGainNode);
            audioGainNode.connect(audioCtx.destination);

            activeFilterNode = bandpass;
        } else if (activeAudioFilter === "reverb") {
            // Procedural impulse response convolution
            const convolver = audioCtx.createConvolver();
            const rate = audioCtx.sampleRate;
            const length = rate * 2.2;
            const impulse = audioCtx.createBuffer(2, length, rate);
            const left = impulse.getChannelData(0);
            const right = impulse.getChannelData(1);
            for (let i = 0; i < length; i++) {
                const decay = Math.exp(-i / (rate * 0.7));
                left[i] = (Math.random() * 2 - 1) * decay;
                right[i] = (Math.random() * 2 - 1) * decay;
            }
            convolver.buffer = impulse;

            const mix = audioCtx.createGain();
            mix.gain.setValueAtTime(0.5, now);

            // Connect dry
            audioSource.connect(audioGainNode);
            // Connect wet
            audioSource.connect(convolver);
            convolver.connect(mix);
            mix.connect(audioGainNode);

            audioGainNode.connect(audioCtx.destination);

            activeFilterNode = convolver;
        }
    }

    // Monitor audio filter state
    $effect(() => {
        activeAudioFilter;
        if (audioCtx) {
            applyAudioFilterGraph();
        }
    });

    // Track video element events
    function handlePlay() {
        isPlaying = true;
        initAudio();
        if (audioCtx && audioCtx.state === "suspended") {
            audioCtx.resume();
        }

        if (isChangingEpisode) {
            isChangingEpisode = false;
            if (controlsVisible) {
                resetControlsTimer();
            }
        } else {
            resetControlsTimer();
        }
    }

    function handlePause() {
        isPlaying = false;
        if (isChangingEpisode) {
            return;
        }
        controlsVisible = true;
        if (controlsTimeout) {
            clearTimeout(controlsTimeout);
        }
    }

    function handleTimeUpdate() {
        if (!videoEl) return;
        currentTime = videoEl.currentTime;

        // Handle range A-B looping
        if (isClipLoopActive && clipEnd > clipStart) {
            if (currentTime >= clipEnd || currentTime < clipStart) {
                videoEl.currentTime = clipStart;
            }
        }
    }

    function handleLoadedMetadata() {
        if (!videoEl) return;
        duration = videoEl.duration;
        clipEnd = duration;
        clipStart = 0;
    }

    function togglePlay() {
        if (!videoEl) return;
        if (isPlaying) {
            videoEl.pause();
        } else {
            videoEl.play().catch((err) => console.warn(err));
        }
    }

    function handleVolumeChange(e) {
        volume = parseFloat(e.target.value);
        isMuted = volume === 0;
        if (videoEl) videoEl.volume = volume;
        if (audioGainNode && audioCtx) {
            audioGainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
        }
    }

    function seekRelative(secs) {
        if (!videoEl) return;
        let target = videoEl.currentTime + secs;
        if (target < 0) target = 0;
        if (target > duration) target = duration;
        videoEl.currentTime = target;
        if (controlsVisible) {
            resetControlsTimer();
        }
    }

    // YouTube-style jumping keys
    function jumpToPercent(percent) {
        if (!videoEl || duration === 0) return;
        const target = duration * (percent / 100);
        if (typeof videoEl.fastSeek === "function") {
            videoEl.fastSeek(target);
        } else {
            videoEl.currentTime = target;
        }
        if (controlsVisible) {
            resetControlsTimer();
        }
    }

    function handleRateChange(rate) {
        playbackRate = rate;
        if (videoEl) videoEl.playbackRate = rate;
    }

    // Replay, shuffle, automatic playback chaining
    function handleEpisodeEnded() {
        if (loopMode === "episode") {
            if (videoEl) {
                videoEl.currentTime = 0;
                videoEl.play();
            }
        } else if (loopMode === "season") {
            nextEpisode();
        } else if (loopMode === "shuffle") {
            const len = activeShow.episodes.length;
            if (len > 0) {
                isChangingEpisode = true;
                const randIdx = Math.floor(Math.random() * len);
                currentEpisodeIndex = randIdx;
            }
        } else {
            // Default: sequential play
            const len = activeShow.episodes.length;
            if (currentEpisodeIndex < len - 1) {
                nextEpisode();
            } else {
                isPlaying = false;
            }
        }
    }

    function nextEpisode() {
        isChangingEpisode = true;
        const len = activeShow.episodes.length;
        if (len > 0) {
            currentEpisodeIndex = (currentEpisodeIndex + 1) % len;
        }
        if (controlsVisible) {
            resetControlsTimer();
        }
    }

    function prevEpisode() {
        isChangingEpisode = true;
        const len = activeShow.episodes.length;
        if (len > 0) {
            currentEpisodeIndex = (currentEpisodeIndex - 1 + len) % len;
        }
        if (controlsVisible) {
            resetControlsTimer();
        }
    }

    function switchShow(showKey) {
        activeShowKey = showKey;
        currentEpisodeIndex = 0;
        checkpoints = [];
        isClipLoopActive = false;
        loadCheckpoints();
    }

    // Skip Intro points
    let isInIntroRange = $derived(
        currentTime >= activeShow.introStart &&
            currentTime <= activeShow.introEnd,
    );

    function skipIntro() {
        if (!videoEl) return;
        videoEl.currentTime = activeShow.introEnd;
        resetControlsTimer();
    }

    // Precise frame-by-frame adjustments (+-.05s is 50ms)
    function adjustClipStart(amount) {
        clipStart = Math.max(0, Math.min(clipStart + amount, clipEnd - 0.05));
        if (videoEl) videoEl.currentTime = clipStart;
    }

    function adjustClipEnd(amount) {
        clipEnd = Math.max(
            clipStart + 0.05,
            Math.min(clipEnd + amount, duration),
        );
        if (videoEl) videoEl.currentTime = clipEnd;
    }

    function setClipA() {
        clipStart = currentTime;
        if (clipStart > clipEnd) clipEnd = duration;
    }

    function setClipB() {
        clipEnd = currentTime;
        if (clipEnd < clipStart) clipStart = 0;
    }

    function sendToSoundboard() {
        if (clipEnd <= clipStart) return;
        const title = clipName.trim() || `${currentEpisode.title} Slice`;
        samplerStore.addClip({
            title,
            show: activeShowKey,
            episode: currentEpisode.title,
            videoUrl: streamUrl,
            start: clipStart,
            end: clipEnd,
            duration: clipEnd - clipStart,
        });
        clipName = "";
        alert(`Success: Clip "${title}" added to Soundboard launcher pads!`);
    }

    // Checkpoint persistence
    function loadCheckpoints() {
        if (typeof window !== "undefined") {
            const data = localStorage.getItem(
                `gopro_checkpoints_${activeShowKey}`,
            );
            if (data) {
                try {
                    checkpoints = JSON.parse(data);
                } catch (e) {
                    console.error(e);
                }
            }
        }
    }

    function saveCheckpoints() {
        if (typeof window !== "undefined") {
            localStorage.setItem(
                `gopro_checkpoints_${activeShowKey}`,
                JSON.stringify(checkpoints),
            );
        }
    }

    function addCheckpoint() {
        const name = prompt(
            "Name your checkpoint timestamp:",
            `Checkpoint at ${formatTime(currentTime)}`,
        );
        if (name === null) return;
        checkpoints.push({
            id: Date.now(),
            name: name.trim() || `Mark ${checkpoints.length + 1}`,
            time: currentTime,
        });
        saveCheckpoints();
    }

    function removeCheckpoint(id) {
        checkpoints = checkpoints.filter((c) => c.id !== id);
        saveCheckpoints();
    }

    function loadCheckpointTime(time) {
        if (videoEl) {
            videoEl.currentTime = time;
            videoEl.play().catch((err) => console.warn(err));
        }
    }

    function formatTime(secs) {
        const m = Math.floor(secs / 60);
        const s = Math.floor(secs % 60);
        const ms = Math.floor((secs % 1) * 100);
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
    }

    function getEpisodeDetails(showKey, epIndex) {
        const show = catalog[showKey];
        if (!show || !show.episodes)
            return { season: 1, episode: 1, title: "" };
        const targetEp = show.episodes[epIndex];
        if (!targetEp) return { season: 1, episode: 1, title: "" };

        const season = getEpisodeSeason(targetEp);
        const seasonEps = show.episodes.filter(
            (ep) => getEpisodeSeason(ep) === season,
        );
        const idxInSeason = seasonEps.indexOf(targetEp);
        const episodeNum = idxInSeason !== -1 ? idxInSeason + 1 : 1;

        return {
            season,
            episode: episodeNum,
            title: targetEp.title,
        };
    }

    // Outro configurations specific to shows
    const showOutroLengths = {
        "Batman Beyond": 40,
        "Mr. Bean": 30,
    };

    let showOutroLength = $derived(showOutroLengths[activeShowKey] || 30);
    let isInOutroRange = $derived(
        duration > 0 && currentTime >= duration - showOutroLength,
    );

    let currentEpisodeDetails = $derived(
        getEpisodeDetails(activeShowKey, currentEpisodeIndex),
    );

    function skipOutro() {
        if (!videoEl) return;
        videoEl.currentTime = duration;
        resetControlsTimer();
    }

    // Keyboard Shortcuts Handler
    function handleKeydown(e) {
        if (document.activeElement.tagName === "INPUT") return;

        // Context-dependent: when selector view is active
        if (!isPlayingEpisode) {
            const showKeys = Object.keys(catalog);
            if (e.key === "ArrowUp") {
                e.preventDefault();
                const idx = showKeys.indexOf(activeShowKey);
                const nextIdx = (idx - 1 + showKeys.length) % showKeys.length;
                switchShow(showKeys[nextIdx]);
            } else if (e.key === "ArrowDown") {
                e.preventDefault();
                const idx = showKeys.indexOf(activeShowKey);
                const nextIdx = (idx + 1) % showKeys.length;
                switchShow(showKeys[nextIdx]);
            } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                const maxEpisodes = activeShow.episodes.length;
                if (maxEpisodes > 0) {
                    currentEpisodeIndex =
                        (currentEpisodeIndex - 1 + maxEpisodes) % maxEpisodes;
                }
            } else if (e.key === "ArrowRight") {
                e.preventDefault();
                const maxEpisodes = activeShow.episodes.length;
                if (maxEpisodes > 0) {
                    currentEpisodeIndex =
                        (currentEpisodeIndex + 1) % maxEpisodes;
                }
            } else if (e.key === "Enter") {
                e.preventDefault();
                playEpisode(activeShowKey, currentEpisodeIndex);
            }
            return;
        }

        // Context-dependent: when player view is active
        if (e.key === " ") {
            e.preventDefault();
            togglePlay();
        } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            seekRelative(-5);
        } else if (e.key === "ArrowRight") {
            e.preventDefault();
            seekRelative(5);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            volume = Math.min(1, volume + 0.05);
            if (videoEl) videoEl.volume = volume;
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            volume = Math.max(0, volume - 0.05);
            if (videoEl) videoEl.volume = volume;
        } else if (e.key >= "0" && e.key <= "9") {
            e.preventDefault();
            if (e.repeat) return;
            startRepeating(e.key);
        } else if (e.key === "i" || e.key === "I") {
            e.preventDefault();
            skipIntro();
            flashSkipIntroGlow = true;
            setTimeout(() => { flashSkipIntroGlow = false; }, 300);
        } else if (e.key === "o" || e.key === "O") {
            e.preventDefault();
            skipOutro();
            flashSkipOutroGlow = true;
            setTimeout(() => { flashSkipOutroGlow = false; }, 300);
        } else if (e.key === "a" || e.key === "A") {
            setClipA();
        } else if (e.key === "b" || e.key === "B") {
            setClipB();
        } else if (e.key === "[") {
            adjustClipStart(-0.05);
        } else if (e.key === "]") {
            adjustClipStart(0.05);
        } else if (e.key === "{") {
            adjustClipEnd(-0.05);
        } else if (e.key === "}") {
            adjustClipEnd(0.05);
        } else if (e.key === "s" || e.key === "S") {
            if (isInIntroRange) skipIntro();
        }
    }

    function handleKeyup(e) {
        if (document.activeElement.tagName === "INPUT") return;
        if (e.key >= "0" && e.key <= "9") {
            if (activeRepeatKey === e.key) {
                stopRepeating();
            }
        }
    }

    // Reactively scroll active card into view when navigating via keyboard in selector mode
    $effect(() => {
        if (!isPlayingEpisode) {
            // Trigger scrolling after DOM updates
            const showKey = activeShowKey;
            const epIndex = currentEpisodeIndex;
            setTimeout(() => {
                const activeCard = document.querySelector(
                    ".episode-card.active",
                );
                if (activeCard) {
                    activeCard.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest",
                        inline: "nearest",
                    });
                }
            }, 50);
        }
    });

    // View state controllers
    function playEpisode(showKey, episodeIndex) {
        if (showKey !== undefined) activeShowKey = showKey;
        if (episodeIndex !== undefined) currentEpisodeIndex = episodeIndex;
        isPlayingEpisode = true;
        controlsVisible = true;
        isChangingEpisode = false; // Reset transition flag so player starts fresh
    }

    function exitToCatalog() {
        if (videoEl) {
            videoEl.pause();
        }
        isPlayingEpisode = false;
        isMaximized = false;
        stopRepeating();
        if (
            document.fullscreenElement &&
            document.fullscreenElement === playerContainerEl
        ) {
            document.exitFullscreen().catch((err) => console.error(err));
        }
    }

    function toggleFullscreen() {
        if (!playerContainerEl) return;

        // Detect if site/page is already in browser-level fullscreen
        const isSiteFullscreen =
            document.fullscreenElement &&
            document.fullscreenElement !== playerContainerEl;

        if (isSiteFullscreen) {
            isMaximized = !isMaximized;
        } else {
            if (!document.fullscreenElement) {
                playerContainerEl.requestFullscreen().catch((err) => {
                    console.error("Fullscreen request failed:", err);
                });
            } else {
                document.exitFullscreen().catch((err) => {
                    console.error("Exit fullscreen failed:", err);
                });
            }
        }
    }

    function handleVideoClick(e) {
        e.preventDefault();
        controlsVisible = !controlsVisible;
        if (controlsVisible) {
            resetControlsTimer();
        }
    }

    function handleVideoDblClick(e) {
        e.preventDefault();
        toggleFullscreen();
    }

    function handleFullscreenChange() {
        isFullscreen = document.fullscreenElement === playerContainerEl;
        if (!document.fullscreenElement) {
            isMaximized = false;
        }
    }

    function resetControlsTimer() {
        controlsVisible = true;
        if (controlsTimeout) {
            clearTimeout(controlsTimeout);
        }
        if (isPlaying && isPlayingEpisode) {
            controlsTimeout = setTimeout(() => {
                const activeEl = document.activeElement;
                const isInteracting =
                    activeEl &&
                    (activeEl.tagName === "INPUT" ||
                        activeEl.tagName === "SELECT" ||
                        activeEl.closest(".player-controls-panel"));
                if (isPlaying && !isInteracting) {
                    controlsVisible = false;
                }
            }, 3000);
        }
    }

    function handleMouseMove() {
        resetControlsTimer();
        
        isCursorHidden = false;
        if (cursorTimeout) clearTimeout(cursorTimeout);
        if (isFullscreen && isPlaying) {
            cursorTimeout = setTimeout(() => {
                isCursorHidden = true;
            }, 3000);
        }
    }

    onMount(async () => {
        loadCheckpoints();
        document.addEventListener("fullscreenchange", handleFullscreenChange);

        try {
            const res = await fetch("/videos.json");
            if (res.ok) {
                const data = await res.json();
                if (data && typeof data === "object") {
                    catalog = data;
                }
            }
        } catch (e) {
            console.warn(
                "Failed to fetch dynamic video catalog, using cached backup:",
                e,
            );
        }
    });

    onDestroy(() => {
        if (audioCtx) {
            audioCtx.close();
        }
        stopRepeating();
        if (controlsTimeout) clearTimeout(controlsTimeout);
        if (cursorTimeout) clearTimeout(cursorTimeout);
        document.removeEventListener(
            "fullscreenchange",
            handleFullscreenChange,
        );
    });
</script>

<svelte:window
    onkeydown={handleKeydown}
    onkeyup={handleKeyup}
    onblur={stopRepeating}
/>

<div class="gopro-layout animated-pane">
    {#if !isPlayingEpisode}
        <GoProCatalog
            bind:catalog
            bind:activeShowKey
            bind:currentEpisodeIndex
            bind:selectedSeasons
            {playEpisode}
        />
    {/if}

    <!-- PERSISTENT PLAYER CONTAINER -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        bind:this={playerContainerEl}
        class="player-view-container"
        class:hidden={!isPlayingEpisode}
        class:maximized={isMaximized}
        onmousemove={handleMouseMove}
        style="cursor: {isCursorHidden ? 'none' : 'auto'}"
    >
        <!-- Slick Bottom Left Indicator Dot -->
        <div class="bottom-left-indicator">
            {#each dotParticles as particle (particle.id)}
                <div
                    class="indicator-particle {particle.type}"
                    style={particle.style}
                ></div>
            {/each}
            <div class="indicator-baseline-dot"></div>
        </div>
        <!-- HTML5 Video Element -->
        <!-- svelte-ignore a11y_media_has_caption -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <video
            bind:this={videoEl}
            src={streamUrl}
            crossorigin="anonymous"
            preload="auto"
            class="player-video-core {activeVideoFilter}"
            onclick={handleVideoClick}
            ondblclick={handleVideoDblClick}
            onplay={handlePlay}
            onpause={handlePause}
            ontimeupdate={handleTimeUpdate}
            onloadedmetadata={handleLoadedMetadata}
            onended={handleEpisodeEnded}
            onerror={handleVideoError}
        ></video>

        {#if showDownloadPrompt}
            <div class="download-prompt-overlay">
                <div class="download-prompt-box">
                    <span class="warning-icon">⚠️</span>
                    <h3>Local Copy Required</h3>
                    <p>
                        The remote video could not be loaded due to network or
                        CORS restrictions. Please download this episode to run
                        it locally.
                    </p>
                    <div class="code-box">
                        <code>bash src/components/apps/get-vid/download.sh</code
                        >
                    </div>
                    <button
                        class="close-prompt-btn"
                        onclick={() => (showDownloadPrompt = false)}
                    >
                        Dismiss
                    </button>
                </div>
            </div>
        {/if}

        <!-- Top Floating Overlay HUD -->
        <div class="player-overlay-top" class:hidden={!controlsVisible}>
            <div class="flex gap-2 font-sans text-xs">
                <button class="exit-player-btn flex items-center gap-1.5" onclick={exitToCatalog}>
                    <ArrowLeft size={14} /> Exit to Catalog
                </button>
                <button class="exit-player-btn bg-white/5 border border-white/10" onclick={() => (isRemapperOpen = true)}>
                    ⚙️ Key Remap
                </button>
            </div>

            <div class="player-episode-info-hud">
                <span class="hud-show-title">{activeShowKey}</span>
                <span class="hud-sep">/</span>
                <span class="hud-episode-title"
                    >S01E{(currentEpisodeIndex + 1).toString().padStart(2, "0")}
                    - {currentEpisode.title}</span
                >
            </div>

            <div class="player-drawer-toggles">
                <button
                    class="icon-header-btn"
                    class:active={isMetadataOpen}
                    onclick={() => {
                        isMetadataOpen = !isMetadataOpen;
                        if (isMetadataOpen) isCheckpointsOpen = false;
                    }}
                    title="Show Facts"
                >
                    <Info size={16} />
                </button>
                <button
                    class="icon-header-btn"
                    class:active={isCheckpointsOpen}
                    onclick={() => {
                        isCheckpointsOpen = !isCheckpointsOpen;
                        if (isCheckpointsOpen) isMetadataOpen = false;
                    }}
                    title="Episode Checkpoints"
                >
                    <Bookmark size={16} />
                </button>
            </div>
        </div>

        <!-- Flashing center crosshairs / grid HUD (pointer-events none, visible when HUD active) -->
        {#if hudVisible}
            <div class="video-hud">
                <div class="rec-indicator">
                    <span class="rec-dot"></span>
                    <div class="hud-show-info-group">
                        <span class="hud-indicator-show-name"
                            >{activeShow.symbol || activeShowKey}</span
                        >
                        <span class="hud-indicator-ep-details">
                            s{currentEpisodeDetails.season
                                .toString()
                                .padStart(
                                    2,
                                    "0",
                                )}e{currentEpisodeDetails.episode
                                .toString()
                                .padStart(2, "0")}
                        </span>
                        <span class="hud-indicator-ep-separator">-</span>
                        <span class="hud-indicator-ep-details">
                            {currentEpisodeDetails.title}
                        </span>
                    </div>
                </div>
                <div class="hud-corners">
                    <div class="corner tl"></div>
                    <div class="corner tr"></div>
                    <div class="corner bl"></div>
                    <div class="corner br"></div>
                </div>
            </div>
        {/if}

        <!-- Bottom Floating Overlay HUD (Timeline & Controls) -->
        <div class="player-overlay-bottom" class:hidden={!controlsVisible}>
            <!-- Timeline & Precision A-B selection bar -->
            <div class="sampler-timeline">
                <div class="timeline-headers">
                    <span class="timeline-time"
                        >{formatTime(currentTime)} / {formatTime(
                            duration,
                        )}</span
                    >
                    <span class="slice-points-desc">
                        Slice: <span class="highlight"
                            >{formatTime(clipStart)}</span
                        >
                        to <span class="highlight">{formatTime(clipEnd)}</span>
                        ({formatTime(clipEnd - clipStart)})
                    </span>
                </div>

                <div class="timeline-track-outer">
                    <!-- Interactive timeline scrubber -->
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <div
                        class="timeline-track"
                        onclick={(e) => {
                            if (!videoEl || duration === 0) return;
                            const rect =
                                e.currentTarget.getBoundingClientRect();
                            const pct = (e.clientX - rect.left) / rect.width;
                            videoEl.currentTime = duration * pct;
                        }}
                    >
                        <!-- Loop Range indicator -->
                        {#if duration > 0}
                            <div
                                class="selection-range-overlay"
                                style="left: {(clipStart / duration) *
                                    100}%; width: {((clipEnd - clipStart) /
                                    duration) *
                                    100}%"
                            ></div>
                            <div
                                class="playhead"
                                style="left: {(currentTime / duration) * 100}%"
                            ></div>
                        {/if}
                    </div>
                </div>

                <!-- Quick skip intro trigger -->
                {#if isInIntroRange}
                    <button 
                        class="skip-intro-hud-btn transition-all duration-300 font-sans" 
                        class:scale-105={flashSkipIntroGlow}
                        class:bg-cyan-500={flashSkipIntroGlow}
                        class:text-black={flashSkipIntroGlow}
                        onclick={skipIntro}
                    >
                        <SkipForward size={14} /> Skip Theme Intro [I]
                    </button>
                {/if}

                <!-- Quick skip outro trigger -->
                {#if isInOutroRange}
                    <button 
                        class="skip-outro-hud-btn transition-all duration-300 font-sans"
                        class:scale-105={flashSkipOutroGlow}
                        class:bg-cyan-500={flashSkipOutroGlow}
                        class:text-black={flashSkipOutroGlow}
                        onclick={skipOutro}
                    >
                        <SkipForward size={14} /> Skip Outro [O]
                    </button>
                {/if}
            </div>

            <!-- Controls panel tray -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                class="player-controls-panel"
                onmouseenter={() => {
                    if (controlsTimeout) clearTimeout(controlsTimeout);
                    controlsVisible = true;
                }}
                onmouseleave={resetControlsTimer}
            >
                <!-- Media row controls -->
                <div class="controls-row">
                    <div class="play-btn-group">
                        <button
                            class="btn-circular"
                            onclick={prevEpisode}
                            title="Prev Episode"
                        >
                            ⏮
                        </button>
                        <button
                            class="btn-circular play-toggle"
                            onclick={togglePlay}
                            title="Play/Pause"
                        >
                            {#if isPlaying}
                                <Pause size={18} fill="black" />
                            {:else}
                                <Play size={18} fill="black" />
                            {/if}
                        </button>
                        <button
                            class="btn-circular"
                            onclick={nextEpisode}
                            title="Next Episode"
                        >
                            ⏭
                        </button>
                        <button
                            class="btn-circular"
                            onclick={() => seekRelative(-10)}
                            title="Back 10s"
                        >
                            -10s
                        </button>
                        <button
                            class="btn-circular"
                            onclick={() => seekRelative(10)}
                            title="Forward 10s"
                        >
                            +10s
                        </button>
                    </div>

                    <div class="speed-group">
                        {#each [1, 2, 3, 4] as rate}
                            <button
                                class="speed-btn"
                                class:active={playbackRate === rate}
                                onclick={() => handleRateChange(rate)}
                            >
                                {rate}x
                            </button>
                        {/each}
                    </div>

                    <div class="loop-group flex items-center gap-3 font-sans">
                        <label class="flex items-center gap-1.5 cursor-pointer text-[10px] font-bold text-white/50 select-none">
                            <input type="checkbox" bind:checked={autoSkipIntro} class="accent-cyan-500 rounded cursor-pointer w-3.5 h-3.5" />
                            <span>Auto Skip Intro</span>
                        </label>
                        <label class="flex items-center gap-1.5 cursor-pointer text-[10px] font-bold text-white/50 select-none">
                            <input type="checkbox" bind:checked={autoSkipOutro} class="accent-cyan-500 rounded cursor-pointer w-3.5 h-3.5" />
                            <span>Auto Skip Outro</span>
                        </label>
                    </div>

                    <div class="loop-group">
                        <button
                            class="loop-btn"
                            class:active={loopMode === "episode"}
                            onclick={() =>
                                (loopMode =
                                    loopMode === "episode"
                                        ? "none"
                                        : "episode")}
                            title="Repeat Episode"
                        >
                            🔁 Loop Ep
                        </button>
                        <button
                            class="loop-btn"
                            class:active={loopMode === "season"}
                            onclick={() =>
                                (loopMode =
                                    loopMode === "season" ? "none" : "season")}
                            title="Repeat Season"
                        >
                            🔂 Season
                        </button>
                        <button
                            class="loop-btn"
                            class:active={loopMode === "shuffle"}
                            onclick={() =>
                                (loopMode =
                                    loopMode === "shuffle"
                                        ? "none"
                                        : "shuffle")}
                            title="Shuffle Play"
                        >
                            🔀 Shuffle
                        </button>
                    </div>

                    <div class="volume-slider-box">
                        <Volume2 size={16} class="vol-icon" />
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={volume}
                            oninput={handleVolumeChange}
                            class="volume-slider"
                        />

                        <button
                            class="btn-circular fullscreen-toggle"
                            onclick={toggleFullscreen}
                            title="Toggle Fullscreen"
                        >
                            {#if isFullscreen || isMaximized}
                                <Minimize size={16} />
                            {:else}
                                <Maximize size={16} />
                            {/if}
                        </button>
                    </div>
                </div>

                <!-- Filters & Tech HUD Controls -->
                <div class="controls-row grid-filters">
                    <div class="filter-panel-box">
                        <span class="box-tag"
                            ><Tv size={12} /> VIDEO FILTERS</span
                        >
                        <div class="filter-selector-row">
                            {#each ["normal", "grayscale", "monochrome", "highcontrast", "cyberpunk", "nightvision"] as f}
                                <button
                                    class="filter-select-btn"
                                    class:active={activeVideoFilter === f}
                                    onclick={() => (activeVideoFilter = f)}
                                >
                                    {f}
                                </button>
                            {/each}
                        </div>
                    </div>

                    <div class="filter-panel-box">
                        <span class="box-tag"
                            ><Radio size={12} /> AUDIO SYNTH EFFECTS</span
                        >
                        <div class="filter-selector-row">
                            {#each ["normal", "funny", "vocal", "reverb"] as f}
                                <button
                                    class="filter-select-btn"
                                    class:active={activeAudioFilter === f}
                                    onclick={() => (activeAudioFilter = f)}
                                >
                                    {f === "funny"
                                        ? "funny mic"
                                        : f === "vocal"
                                          ? "vocal boost"
                                          : f}
                                </button>
                            {/each}
                        </div>
                    </div>
                </div>

                <!-- Precision Sampling & Clipping Area -->
                <div class="sampler-clipper-box">
                    <div class="clipper-header-row">
                        <span class="clipper-tag"
                            ><Music size={12} /> SAMPLER WORKBENCH</span
                        >
                        <div class="bpm-control-box">
                            <span class="bpm-label">BPM</span>
                            <input
                                type="number"
                                min={BPM_MIN}
                                max={BPM_MAX}
                                bind:value={bpm}
                                onblur={handleBpmBlur}
                                class="bpm-input"
                            />
                            <input
                                type="range"
                                min={BPM_MIN}
                                max={BPM_MAX}
                                step="1"
                                bind:value={bpm}
                                class="bpm-slider"
                            />
                        </div>
                        <button
                            class="loop-selection-btn"
                            class:active={isClipLoopActive}
                            onclick={() =>
                                (isClipLoopActive = !isClipLoopActive)}
                        >
                            🔁 Loop Selection
                        </button>
                    </div>

                    <div class="clipper-main-controls">
                        <div class="endpoint-set-group">
                            <button class="clip-action-btn" onclick={setClipA}
                                >Set Start [A]</button
                            >
                            <div class="nudge-group">
                                <button
                                    class="nudge-btn"
                                    onclick={() => adjustClipStart(-0.05)}
                                    title="Nudge start back 50ms">-.05s</button
                                >
                                <button
                                    class="nudge-btn"
                                    onclick={() => adjustClipStart(0.05)}
                                    title="Nudge start forward 50ms"
                                    >+.05s</button
                                >
                            </div>
                        </div>

                        <div class="endpoint-set-group">
                            <button class="clip-action-btn" onclick={setClipB}
                                >Set End [B]</button
                            >
                            <div class="nudge-group">
                                <button
                                    class="nudge-btn"
                                    onclick={() => adjustClipEnd(-0.05)}
                                    title="Nudge end back 50ms">-.05s</button
                                >
                                <button
                                    class="nudge-btn"
                                    onclick={() => adjustClipEnd(0.05)}
                                    title="Nudge end forward 50ms">+.05s</button
                                >
                            </div>
                        </div>

                        <div class="sampler-export-group">
                            <input
                                type="text"
                                placeholder="Name your audio clip..."
                                bind:value={clipName}
                                class="clip-name-input"
                            />
                            <button
                                class="send-sampler-btn"
                                disabled={clipEnd <= clipStart}
                                onclick={sendToSoundboard}
                            >
                                <Music size={14} /> Send to Launcher pads
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tech details footer stats -->
            <footer class="cinema-footer">
                <div class="cache-status">
                    <span class="green-indicator-glow"></span>
                    <span>CACHE: {localCacheProgress}% SECURE</span>
                </div>
                <div class="quick-kb-hint">
                    💡 Space: Play/Pause | Arrow Keys: Seek/Vol | 1-9: Jump % |
                    A/B: Set Slice | [ / ]: Fine-tune
                </div>
            </footer>
        </div>
    </div>

    <!-- Sidebar drawers (can open over the layout) -->
    <!-- Sidebar Stats Wiki details -->
    {#if isMetadataOpen}
        <div class="meta-drawer">
            <div class="drawer-header">
                <h2>{activeShowKey} Wiki Stats</h2>
                <button
                    onclick={() => (isMetadataOpen = false)}
                    class="close-drawer">✕</button
                >
            </div>
            <div class="drawer-body">
                <div class="meta-item">
                    <span class="d-label">🎭 Main Cast:</span>
                    <div class="cast-list">
                        {#each activeShow.meta.actors as actor}
                            <span class="cast-tag">{actor}</span>
                        {/each}
                    </div>
                </div>

                <div class="meta-item">
                    <span class="d-label">📍 Filming Location:</span>
                    <p>{activeShow.meta.location}</p>
                </div>

                <div class="meta-item">
                    <span class="d-label">💰 Episode Budget:</span>
                    <p>{activeShow.meta.budget}</p>
                </div>

                <div class="meta-item">
                    <span class="d-label">💡 Trivia Fact:</span>
                    <p class="fact-text">{activeShow.meta.facts}</p>
                </div>

                <div class="meta-grid">
                    <div class="meta-cell">
                        <span class="d-label">📅 Release Date</span>
                        <p>{activeShow.meta.release}</p>
                    </div>
                    <div class="meta-cell">
                        <span class="d-label">⭐ Rating</span>
                        <p>{activeShow.meta.rating}</p>
                    </div>
                    <div class="meta-cell">
                        <span class="d-label">👥 Viewers</span>
                        <p>{activeShow.meta.viewers}</p>
                    </div>
                    <div class="meta-cell">
                        <span class="d-label">⏱️ Runtime</span>
                        <p>{activeShow.meta.runtime}</p>
                    </div>
                </div>

                <div class="ratings-badge">{activeShow.meta.score}</div>

                <div class="meta-links">
                    <a
                        href={activeShow.meta.wiki}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="link-btn">Wikipedia</a
                    >
                    <a
                        href={activeShow.meta.imdb}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="link-btn">IMDb</a
                    >
                    <a
                        href={activeShow.meta.tomatoes}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="link-btn">Rotten Tomatoes</a
                    >
                </div>
            </div>
        </div>
    {/if}

    <!-- Sidebar Checkpoints -->
    {#if isCheckpointsOpen}
        <div class="meta-drawer checkpoints-drawer">
            <div class="drawer-header">
                <h2>Episode Checkpoints</h2>
                <button
                    onclick={() => (isCheckpointsOpen = false)}
                    class="close-drawer">✕</button
                >
            </div>
            <div class="drawer-body">
                <button class="add-mark-btn" onclick={addCheckpoint}>
                    <Bookmark size={14} /> Add Current Playhead
                </button>

                <div class="marks-list">
                    {#if checkpoints.length === 0}
                        <p class="empty-marks">
                            No checkpoints saved. Click button above to bookmark
                            custom frames.
                        </p>
                    {:else}
                        {#each checkpoints as mark}
                            <div class="mark-row">
                                <!-- svelte-ignore a11y_click_events_have_key_events -->
                                <!-- svelte-ignore a11y_no_static_element_interactions -->
                                <div
                                    class="mark-info"
                                    onclick={() =>
                                        loadCheckpointTime(mark.time)}
                                >
                                    <span class="mark-name">{mark.name}</span>
                                    <span class="mark-time"
                                        >{formatTime(mark.time)}</span
                                    >
                                </div>
                                <button
                                    class="delete-mark"
                                    onclick={() => removeCheckpoint(mark.id)}
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        {/each}
                    {/if}
                </div>
            </div>
        </div>
    {/if}

    <!-- Keybind Remapper Drawer -->
    <GoProRemapper 
        bind:isOpen={isRemapperOpen} 
        showKey={activeShowKey} 
        episodeTitle={currentEpisode.title} 
        duration={duration} 
    />
</div>

<style lang="scss">
  @import "../../styles/gopro.scss";
</style>
