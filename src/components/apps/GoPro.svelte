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

    function getSeasonsForShow(showKey) {
        const show = catalog[showKey];
        if (!show || !show.episodes) return [1];
        const seasons = new Set();
        show.episodes.forEach((ep) => {
            seasons.add(getEpisodeSeason(ep));
        });
        return Array.from(seasons).sort((a, b) => a - b);
    }

    async function checkLocalFile(file) {
        if (!file) {
            streamUrl = "";
            return;
        }
        try {
          if(file.startsWith("https://data.wearedogs.net")) {
            console.log(file);
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
            streamUrl = activeShow.baseUrl
                ? encodeURI(activeShow.baseUrl + file)
                : "";
        } catch {
            streamUrl = activeShow.baseUrl
                ? encodeURI(activeShow.baseUrl + file)
                : "";
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

    function scheduleNextTick() {
        if (activeRepeatKey === null) return;
        repeatTimer = setTimeout(() => {
            if (activeRepeatKey === null) return;
            const pct = parseInt(activeRepeatKey) * 10;
            jumpToPercent(pct);
            triggerDotAnimation();
            scheduleNextTick();
        }, repeatInterval);
    }

    function startRepeating(key) {
        if (activeRepeatKey === key) return;
        stopRepeating();
        activeRepeatKey = key;
        const pct = parseInt(key) * 10;
        jumpToPercent(pct);
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
        <!-- NETFLIX-STYLE CATALOG SELECTOR -->
        <div class="catalog-container">
            <!-- Cinematic Hero Spotlight Banner -->
            <div
                class="hero-spotlight {activeShowKey
                    .replace(/\s+/g, '-')
                    .toLowerCase()}"
            >
                <div class="hero-content">
                    <span class="hero-show-tag">{activeShowKey}</span>
                    <h1 class="hero-title">
                        S01E{(currentEpisodeIndex + 1)
                            .toString()
                            .padStart(2, "0")}: {currentEpisode.title}
                    </h1>

                    <p class="hero-fact">
                        <strong>Trivia:</strong>
                        {activeShow.meta.facts}
                    </p>

                    <!-- Meta details grid -->
                    <div class="hero-meta-badges">
                        <span class="badge score">{activeShow.meta.score}</span>
                        <span class="badge rating"
                            >{activeShow.meta.rating}</span
                        >
                        <span class="badge runtime"
                            >{activeShow.meta.runtime}</span
                        >
                        <span class="badge release"
                            >{activeShow.meta.release}</span
                        >
                        <span class="badge viewers"
                            >{activeShow.meta.viewers} Viewers</span
                        >
                        <span class="badge budget"
                            >{activeShow.meta.budget} Budget</span
                        >
                    </div>

                    <!-- Cast List -->
                    <div class="hero-cast">
                        <span class="meta-label">Cast:</span>
                        <div class="cast-tags">
                            {#each activeShow.meta.actors as actor}
                                <span class="hero-cast-tag">{actor}</span>
                            {/each}
                        </div>
                    </div>

                    <div class="hero-actions">
                        <button
                            class="hero-play-btn"
                            onclick={() =>
                                playEpisode(activeShowKey, currentEpisodeIndex)}
                        >
                            <Play size={18} fill="currentColor" /> Play Episode
                        </button>

                        <div class="hero-external-links">
                            <a
                                href={activeShow.meta.wiki}
                                target="_blank"
                                rel="noopener noreferrer"
                                class="hero-link-btn">Wikipedia</a
                            >
                            <a
                                href={activeShow.meta.imdb}
                                target="_blank"
                                rel="noopener noreferrer"
                                class="hero-link-btn">IMDb</a
                            >
                            <a
                                href={activeShow.meta.tomatoes}
                                target="_blank"
                                rel="noopener noreferrer"
                                class="hero-link-btn">Rotten Tomatoes</a
                            >
                        </div>
                    </div>
                </div>
            </div>

            <!-- Show Shelves / Rows -->
            <div class="catalog-shelves">
                {#each Object.keys(catalog) as showKey}
                    {@const seasons = getSeasonsForShow(showKey)}
                    {@const activeSeason =
                        selectedSeasons[showKey] || seasons[0] || 1}
                    <div class="shelf-container">
                        <div class="shelf-header">
                            <h2 class="shelf-title">
                                {showKey}
                            </h2>
                            {#if seasons.length > 1}
                                <div class="season-selector-tabs">
                                    {#each seasons as s}
                                        <button
                                            class="season-tab-btn"
                                            class:active={activeSeason === s}
                                            onclick={() =>
                                                (selectedSeasons[showKey] = s)}
                                        >
                                            Season {s}
                                        </button>
                                    {/each}
                                </div>
                            {/if}
                        </div>

                        <div class="cards-row">
                            {#each catalog[showKey].episodes.filter((ep) => getEpisodeSeason(ep) === activeSeason) as ep, seasonIdx}
                                {@const actualIndex =
                                    catalog[showKey].episodes.indexOf(ep)}
                                <!-- svelte-ignore a11y_click_events_have_key_events -->
                                <!-- svelte-ignore a11y_no_static_element_interactions -->
                                <div
                                    class="episode-card"
                                    class:active={activeShowKey === showKey &&
                                        currentEpisodeIndex === actualIndex}
                                    onclick={() =>
                                        playEpisode(showKey, actualIndex)}
                                >
                                    <div class="card-thumbnail">
                                        <span class="thumbnail-number"
                                            >{(seasonIdx + 1)
                                                .toString()
                                                .padStart(2, "0")}</span
                                        >
                                        <div class="thumbnail-overlay">
                                            <div class="play-icon-glow">
                                                <Play
                                                    size={16}
                                                    fill="currentColor"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-info">
                                        <span class="card-episode-num"
                                            >Episode {seasonIdx + 1}</span
                                        >
                                        <span class="card-title-text"
                                            >{ep.title}</span
                                        >
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {/if}

    <!-- PERSISTENT PLAYER CONTAINER -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        bind:this={playerContainerEl}
        class="player-view-container"
        class:hidden={!isPlayingEpisode}
        class:maximized={isMaximized}
        onmousemove={handleMouseMove}
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
            <button class="exit-player-btn" onclick={exitToCatalog}>
                <ArrowLeft size={16} /> Exit to Catalog
            </button>

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
                    <button class="skip-intro-hud-btn" onclick={skipIntro}>
                        <SkipForward size={14} /> Skip Theme Intro
                    </button>
                {/if}

                <!-- Quick skip outro trigger -->
                {#if isInOutroRange}
                    <button class="skip-outro-hud-btn" onclick={skipOutro}>
                        <SkipForward size={14} /> Skip Outro
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
</div>

<style>
    .gopro-layout {
        position: relative;
        width: 100%;
        height: 100%;
        background: #07070a;
        overflow: hidden;
        font-family:
            "Inter",
            -apple-system,
            sans-serif;
    }

    /* ── Catalog Selector ── */
    .catalog-container {
        width: 100%;
        height: 100%;
        overflow-y: auto;
        padding: 24px;
        display: flex;
        flex-direction: column;
        gap: 32px;
        background: radial-gradient(
            circle at top right,
            rgba(255, 85, 187, 0.08),
            rgba(0, 0, 0, 0.95)
        );
        box-sizing: border-box;
    }

    .hero-spotlight {
        position: relative;
        width: 100%;
        min-height: 380px;
        border-radius: 20px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding: 36px;
        box-sizing: border-box;
        box-shadow:
            0 24px 50px rgba(0, 0, 0, 0.6),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.05);
        transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .hero-spotlight.batman-beyond {
        background: linear-gradient(
                to right,
                rgba(0, 0, 0, 0.95) 45%,
                rgba(255, 51, 68, 0.08)
            ),
            radial-gradient(
                circle at 80% 20%,
                rgba(255, 51, 68, 0.2),
                rgba(0, 0, 0, 0.9)
            );
        border-left: 4px solid #ff3344;
    }

    .hero-spotlight.mr.-bean {
        background: linear-gradient(
                to right,
                rgba(0, 0, 0, 0.95) 45%,
                rgba(255, 204, 0, 0.05)
            ),
            radial-gradient(
                circle at 80% 20%,
                rgba(255, 204, 0, 0.15),
                rgba(0, 0, 0, 0.9)
            );
        border-left: 4px solid #ffcc00;
    }

    .hero-content {
        max-width: 65%;
        display: flex;
        flex-direction: column;
        gap: 12px;
        z-index: 2;
    }

    .hero-show-tag {
        font-size: 0.72rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.15em;
        color: rgba(255, 255, 255, 0.5);
    }

    .hero-title {
        font-size: 1.8rem;
        font-weight: 800;
        color: white;
        margin: 0;
        line-height: 1.2;
        letter-spacing: -0.02em;
    }

    .hero-fact {
        font-size: 0.82rem;
        color: rgba(255, 255, 255, 0.6);
        margin: 4px 0;
        line-height: 1.5;
        font-style: italic;
    }

    .hero-meta-badges {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin: 4px 0;
    }

    .badge {
        font-size: 0.68rem;
        font-weight: 700;
        padding: 4px 10px;
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.08);
        color: rgba(255, 255, 255, 0.8);
    }

    .badge.score {
        background: rgba(255, 85, 187, 0.12);
        border-color: rgba(255, 85, 187, 0.25);
        color: #ff55bb;
    }

    .hero-cast {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.72rem;
    }

    .meta-label {
        font-weight: 700;
        color: rgba(255, 255, 255, 0.35);
        text-transform: uppercase;
    }

    .cast-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
    }

    .hero-cast-tag {
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 4px;
        padding: 2px 6px;
        color: rgba(255, 255, 255, 0.7);
    }

    .hero-actions {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-top: 10px;
    }

    .hero-play-btn {
        background: white;
        border: none;
        color: black;
        border-radius: 12px;
        padding: 10px 24px;
        font-size: 0.85rem;
        font-weight: 800;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        box-shadow: 0 4px 20px rgba(255, 255, 255, 0.25);
    }

    .hero-play-btn:hover {
        background: #ff55bb;
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(255, 85, 187, 0.4);
    }

    .hero-external-links {
        display: flex;
        gap: 8px;
    }

    .hero-link-btn {
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 10px;
        color: rgba(255, 255, 255, 0.8);
        padding: 8px 16px;
        font-size: 0.75rem;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.2s;
    }

    .hero-link-btn:hover {
        background: rgba(255, 255, 255, 0.12);
        border-color: rgba(255, 255, 255, 0.2);
        color: white;
    }

    .catalog-shelves {
        display: flex;
        flex-direction: column;
        gap: 28px;
    }

    .shelf-container {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .shelf-header {
        display: flex;
        align-items: center;
        gap: 16px;
        width: 100%;
        margin-bottom: 4px;
    }

    .shelf-header::after {
        content: "";
        flex-grow: 1;
        height: 1px;
        background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0.08),
            transparent
        );
        order: 2;
    }

    .shelf-title {
        font-size: 0.95rem;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.9);
        margin: 0;
        order: 1;
    }

    .season-selector-tabs {
        display: flex;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 20px;
        padding: 2px;
        order: 3;
    }

    .season-tab-btn {
        background: transparent;
        border: none;
        color: rgba(255, 255, 255, 0.5);
        padding: 5px 12px;
        font-size: 0.7rem;
        font-weight: 700;
        border-radius: 18px;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .season-tab-btn:hover {
        color: white;
    }

    .season-tab-btn.active {
        background: rgba(255, 255, 255, 0.08);
        color: #ff3344;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }

    .cards-row {
        display: flex;
        gap: 14px;
        overflow-x: auto;
        padding: 4px 4px 16px 4px;
        margin: 0 -4px;
        scroll-behavior: smooth;
    }

    .episode-card {
        flex: 0 0 170px;
        background: rgba(20, 20, 28, 0.45);
        border: 1px solid rgba(255, 255, 255, 0.04);
        border-radius: 12px;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        display: flex;
        flex-direction: column;
        user-select: none;
    }

    .episode-card:hover {
        transform: scale(1.04) translateY(-3px);
        background: rgba(30, 30, 42, 0.6);
        border-color: rgba(255, 255, 255, 0.12);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
    }

    .episode-card.active {
        border-color: #ff55bb;
        background: rgba(255, 85, 187, 0.06);
        box-shadow: 0 0 15px rgba(255, 85, 187, 0.15);
    }

    .card-thumbnail {
        position: relative;
        width: 100%;
        height: 96px;
        background: linear-gradient(135deg, #13131c 0%, #08080c 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid rgba(255, 255, 255, 0.02);
        overflow: hidden;
    }

    .thumbnail-number {
        font-size: 2rem;
        font-weight: 800;
        font-family: monospace;
        opacity: 0.1;
        letter-spacing: -0.05em;
        color: white;
        transition: opacity 0.3s;
    }

    .episode-card:hover .thumbnail-number {
        opacity: 0.2;
    }

    .thumbnail-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.25s ease;
    }

    .episode-card:hover .thumbnail-overlay {
        opacity: 1;
    }

    .play-icon-glow {
        color: white;
        background: rgba(255, 85, 187, 0.9);
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 12px #ff55bb;
        transform: scale(0.85);
        transition: transform 0.25s ease;
    }

    .episode-card:hover .play-icon-glow {
        transform: scale(1);
    }

    .card-info {
        padding: 8px 10px;
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .card-episode-num {
        font-size: 0.6rem;
        font-weight: 700;
        color: #ff55bb;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .card-title-text {
        font-size: 0.75rem;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.9);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    /* ── Persistent Player Container ── */
    .player-view-container {
        position: relative;
        width: 100%;
        height: 100%;
        background: black;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        overflow: hidden;
    }

    .player-view-container.maximized {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 9999;
        background: black;
    }

    .player-view-container.hidden {
        display: none !important;
    }

    .player-video-core {
        width: 100%;
        height: 100%;
        object-fit: contain;
        transition: filter 0.3s ease;
        background: black;
    }

    /* Floating Overlays */
    .player-overlay-top {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        padding: 20px;
        box-sizing: border-box;
        background: linear-gradient(to bottom, rgba(0, 0, 0, 0.8), transparent);
        z-index: 10;
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;
        transition:
            opacity 0.3s ease,
            transform 0.3s ease;
    }

    .player-overlay-bottom {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.9) 60%,
            transparent
        );
        z-index: 10;
        display: flex;
        flex-direction: column;
        transition:
            opacity 0.3s ease,
            transform 0.3s ease;
    }

    .player-overlay-top.hidden {
        opacity: 0;
        transform: translateY(-10px);
        pointer-events: none;
    }

    .player-overlay-bottom.hidden {
        opacity: 0;
        transform: translateY(10px);
        pointer-events: none;
    }

    .exit-player-btn {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 20px;
        color: white;
        padding: 8px 16px;
        font-size: 0.78rem;
        font-weight: 700;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        backdrop-filter: blur(10px);
        transition: all 0.2s;
        justify-self: flex-start;
    }

    .exit-player-btn:hover {
        background: white;
        color: black;
        box-shadow: 0 0 15px rgba(255, 255, 255, 0.25);
    }

    .player-episode-info-hud {
        display: flex;
        align-items: center;
        gap: 8px;
        background: rgba(10, 10, 15, 0.75);
        padding: 8px 16px;
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(15px);
        justify-self: center;
    }

    .hud-show-title {
        font-weight: 800;
        color: #ff55bb;
        font-size: 0.72rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
    }

    .hud-sep {
        color: rgba(255, 255, 255, 0.25);
        font-size: 0.72rem;
    }

    .hud-episode-title {
        font-weight: 600;
        color: white;
        font-size: 0.75rem;
    }

    .player-drawer-toggles {
        display: flex;
        gap: 8px;
        justify-self: flex-end;
    }

    /* ── Drawer Buttons override ── */
    .player-drawer-toggles .icon-header-btn {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.12);
        color: rgba(255, 255, 255, 0.7);
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(10px);
        transition: all 0.2s;
    }

    .player-drawer-toggles .icon-header-btn:hover {
        background: rgba(255, 255, 255, 0.15);
        color: white;
    }

    .player-drawer-toggles .icon-header-btn.active {
        color: #ff55bb;
        border-color: rgba(255, 85, 187, 0.4);
        background: rgba(255, 85, 187, 0.15);
        box-shadow: 0 0 10px rgba(255, 85, 187, 0.2);
    }

    .source-alert {
        position: absolute;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 204, 0, 0.85);
        backdrop-filter: blur(10px);
        color: black;
        font-size: 0.72rem;
        font-weight: 700;
        padding: 6px 16px;
        border-radius: 20px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        z-index: 5;
        animation: alertBounce 1s infinite alternate;
    }

    @keyframes alertBounce {
        0% {
            transform: translate(-50%, 0);
        }
        100% {
            transform: translate(-50%, -4px);
        }
    }

    /* Video Filters CSS rules */
    .grayscale {
        filter: grayscale(100%);
    }
    .monochrome {
        filter: contrast(350%) grayscale(100%) brightness(120%);
    }
    .highcontrast {
        filter: contrast(180%) saturate(140%);
    }
    .cyberpunk {
        filter: hue-rotate(90deg) saturate(220%) contrast(110%);
    }
    .nightvision {
        filter: sepia(100%) hue-rotate(60deg) saturate(320%) contrast(140%)
            brightness(95%);
    }

    /* HUD Overlays */
    .video-hud {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        pointer-events: none;
        z-index: 2;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 20px;
        box-sizing: border-box;
        font-family: monospace;
        font-size: 0.7rem;
        color: rgba(255, 255, 255, 0.35);
    }

    .rec-indicator {
        position: absolute;
        top: 28px;
        left: 28px;
        display: flex;
        align-items: flex-start;
        gap: 8px;
        font-weight: 700;
        color: #ff3344;
    }

    .rec-dot {
        width: 8px;
        height: 8px;
        background: #ff3344;
        border-radius: 50%;
        box-shadow: 0 0 10px #ff3344;
        animation: flashDot 1.2s infinite;
        flex-shrink: 0;
        margin-top: 4px;
    }

    @keyframes flashDot {
        0%,
        100% {
            opacity: 0.3;
        }
        50% {
            opacity: 1;
        }
    }

    .hud-show-info-group {
        display: flex;
        flex-direction: column;
        gap: 2px;
        max-width: 10vw;
        word-wrap: break-word;
        overflow-wrap: break-word;
        white-space: normal;
        text-align: left;
        line-height: 1.2;
    }

    .hud-indicator-show-name {
        font-weight: 700;
        font-size: 0.95rem;
        color: #ff3344;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        line-height: 1;
    }

    .hud-indicator-ep-details {
        font-size: 0.65rem;
        color: rgba(255, 255, 255, 0.45);
        text-transform: lowercase;
    }

    .hud-indicator-ep-separator {
        display: none;
    }

    @media (max-width: 1200px) {
        .rec-indicator {
            align-items: center;
        }
        .rec-dot {
            margin-top: 0;
        }
        .hud-show-info-group {
            flex-direction: row;
            align-items: center;
            gap: 6px;
            max-width: 80vw;
        }
        .hud-indicator-ep-separator {
            display: inline;
            color: rgba(255, 255, 255, 0.3);
            margin: 0 2px;
        }
    }

    .hud-corners .corner {
        position: absolute;
        width: 14px;
        height: 14px;
        border: 1px solid rgba(255, 255, 255, 0.25);
    }

    .hud-corners .corner.tl {
        top: 20px;
        left: 20px;
        border-right: none;
        border-bottom: none;
    }
    .hud-corners .corner.tr {
        top: 20px;
        right: 20px;
        border-left: none;
        border-bottom: none;
    }
    .hud-corners .corner.bl {
        bottom: 20px;
        left: 20px;
        border-right: none;
        border-top: none;
    }
    .hud-corners .corner.br {
        bottom: 20px;
        right: 20px;
        border-left: none;
        border-top: none;
    }

    /* ── Timeline ── */
    .sampler-timeline {
        padding: 12px 20px;
        background: rgba(0, 0, 0, 0.4);
        border-top: 1px solid rgba(255, 255, 255, 0.04);
        display: flex;
        flex-direction: column;
        gap: 8px;
        position: relative;
    }

    .timeline-headers {
        display: flex;
        justify-content: space-between;
        font-size: 0.72rem;
        font-family: monospace;
    }

    .timeline-time {
        color: rgba(255, 255, 255, 0.5);
    }

    .slice-points-desc {
        color: rgba(255, 255, 255, 0.35);
    }

    .slice-points-desc .highlight {
        color: #ff55bb;
        font-weight: 700;
    }

    .timeline-track-outer {
        height: 12px;
        display: flex;
        align-items: center;
        position: relative;
    }

    .timeline-track {
        width: 100%;
        height: 4px;
        background: rgba(255, 255, 255, 0.15);
        border-radius: 2px;
        cursor: pointer;
        position: relative;
        transition: height 0.15s;
    }

    .timeline-track:hover {
        height: 6px;
    }

    .selection-range-overlay {
        position: absolute;
        height: 100%;
        background: rgba(255, 85, 187, 0.25);
        border-left: 2px solid #ff55bb;
        border-right: 2px solid #ff55bb;
        box-shadow: 0 0 10px rgba(255, 85, 187, 0.2);
    }

    .playhead {
        position: absolute;
        width: 12px;
        height: 12px;
        background: white;
        border-radius: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
        pointer-events: none;
    }

    .skip-intro-hud-btn,
    .skip-outro-hud-btn {
        position: absolute;
        right: 20px;
        bottom: 40px;
        background: #ff55bb;
        border: none;
        color: white;
        border-radius: 20px;
        padding: 6px 14px;
        font-size: 0.7rem;
        font-weight: 700;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        box-shadow: 0 4px 15px rgba(255, 85, 187, 0.3);
        z-index: 10;
        animation: neonPulse 1.5s infinite alternate;
    }

    @keyframes neonPulse {
        0% {
            box-shadow: 0 0 5px #ff55bb;
        }
        100% {
            box-shadow: 0 0 15px #ff55bb;
        }
    }

    /* ── Player controls ── */
    .player-controls-panel {
        background: rgba(10, 10, 15, 0.75);
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        padding: 16px 20px;
        display: flex;
        flex-direction: column;
        gap: 14px;
        backdrop-filter: blur(20px);
    }

    .controls-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
    }

    .play-btn-group {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .btn-circular {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.08);
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
        transition: all 0.2s;
    }

    .btn-circular:hover {
        background: rgba(255, 255, 255, 0.12);
        border-color: rgba(255, 255, 255, 0.18);
    }

    .btn-circular.play-toggle {
        background: white;
        color: black;
        width: 38px;
        height: 38px;
        border: none;
    }

    .btn-circular.play-toggle:hover {
        transform: scale(1.06);
        background: rgba(255, 255, 255, 0.9);
    }

    .speed-group {
        display: flex;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 8px;
        overflow: hidden;
    }

    .speed-btn {
        background: transparent;
        border: none;
        color: rgba(255, 255, 255, 0.5);
        font-size: 0.72rem;
        font-weight: 700;
        padding: 6px 12px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .speed-btn.active {
        background: rgba(255, 255, 255, 0.12);
        color: white;
    }

    .loop-group {
        display: flex;
        gap: 6px;
    }

    .loop-btn {
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.06);
        color: rgba(255, 255, 255, 0.55);
        border-radius: 6px;
        font-size: 0.7rem;
        font-weight: 700;
        padding: 6px 10px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .loop-btn:hover {
        color: white;
        background: rgba(255, 255, 255, 0.08);
    }

    .loop-btn.active {
        color: #ffcc00;
        border-color: rgba(255, 204, 0, 0.35);
        background: rgba(255, 204, 0, 0.12);
    }

    .volume-slider-box {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .vol-icon {
        color: rgba(255, 255, 255, 0.45);
    }

    .volume-slider {
        width: 70px;
        accent-color: white;
        height: 4px;
        cursor: pointer;
        margin-right: 8px;
    }

    /* Audio Video Filters */
    .grid-filters {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
    }

    .filter-panel-box {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 10px;
        padding: 10px 12px;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .box-tag {
        font-size: 0.58rem;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.35);
        letter-spacing: 0.08em;
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .filter-selector-row {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
    }

    .filter-select-btn {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.05);
        color: rgba(255, 255, 255, 0.5);
        border-radius: 6px;
        font-size: 0.68rem;
        padding: 4px 8px;
        cursor: pointer;
        text-transform: capitalize;
        transition: all 0.2s;
    }

    .filter-select-btn:hover {
        color: white;
        background: rgba(255, 255, 255, 0.08);
    }

    .filter-select-btn.active {
        background: rgba(0, 255, 102, 0.1);
        color: #00ff66;
        border-color: rgba(0, 255, 102, 0.3);
    }

    /* Clipper Workbench styling */
    .sampler-clipper-box {
        background: rgba(255, 85, 187, 0.03);
        border: 1px dashed rgba(255, 85, 187, 0.25);
        border-radius: 12px;
        padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .bpm-control-box {
        display: flex;
        align-items: center;
        gap: 10px;
        background: rgba(0, 0, 0, 0.4);
        padding: 4px 10px;
        border-radius: 8px;
        border: 1px solid rgba(255, 85, 187, 0.25);
        width: 40%;
    }

    .bpm-label {
        font-size: 0.65rem;
        font-weight: 800;
        color: #ff55bb;
        font-family: monospace;
    }

    .bpm-input {
        background: transparent;
        border: none;
        border-bottom: 1px solid rgba(255, 85, 187, 0.3);
        color: #ff55bb;
        font-family: monospace;
        font-size: 0.75rem;
        font-weight: 800;
        width: 32px;
        padding: 0;
        text-align: center;
        outline: none;
    }

    .bpm-input:focus {
        border-bottom-color: #ff55bb;
    }

    /* Hide spin buttons for webkit and firefox */
    .bpm-input::-webkit-outer-spin-button,
    .bpm-input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    .bpm-input {
        -moz-appearance: textfield;
    }

    .bpm-slider {
        accent-color: #ff55bb;
        height: 3px;
        cursor: pointer;
        flex: 1;
    }

    .clipper-header-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .clipper-tag {
        font-size: 0.6rem;
        font-weight: 700;
        color: #ff55bb;
        letter-spacing: 0.08em;
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .loop-selection-btn {
        background: transparent;
        border: 1px solid rgba(255, 85, 187, 0.25);
        color: rgba(255, 85, 187, 0.8);
        border-radius: 4px;
        font-size: 0.65rem;
        font-weight: 700;
        padding: 4px 8px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .loop-selection-btn.active {
        background: rgba(255, 85, 187, 0.15);
        color: #ff55bb;
        border-color: #ff55bb;
    }

    .clipper-main-controls {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
        align-items: center;
    }

    .endpoint-set-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .clip-action-btn {
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.08);
        color: white;
        border-radius: 6px;
        padding: 6px;
        font-size: 0.75rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
    }

    .clip-action-btn:hover {
        background: rgba(255, 255, 255, 0.1);
    }

    .nudge-group {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4px;
    }

    .nudge-btn {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.06);
        color: rgba(255, 255, 255, 0.55);
        font-family: monospace;
        font-size: 0.65rem;
        padding: 3px;
        cursor: pointer;
        border-radius: 4px;
        transition: all 0.2s;
    }

    .nudge-btn:hover {
        color: white;
        background: rgba(255, 255, 255, 0.08);
    }

    .sampler-export-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .clip-name-input {
        background: #050508;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 6px;
        color: white;
        font-size: 0.75rem;
        padding: 6px 10px;
    }

    .clip-name-input::placeholder {
        color: rgba(255, 255, 255, 0.25);
    }

    .send-sampler-btn {
        background: #ff55bb;
        border: none;
        color: white;
        border-radius: 6px;
        padding: 8px;
        font-size: 0.75rem;
        font-weight: 700;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        transition: all 0.2s;
    }

    .send-sampler-btn:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 4px 15px rgba(255, 85, 187, 0.35);
    }

    .send-sampler-btn:disabled {
        background: rgba(255, 255, 255, 0.05);
        color: rgba(255, 255, 255, 0.18);
        cursor: not-allowed;
    }

    /* ── Cinema Footer ── */
    .cinema-footer {
        height: 32px;
        padding: 0 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.06);
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: rgba(0, 0, 0, 0.5);
        font-size: 0.65rem;
        color: rgba(255, 255, 255, 0.35);
    }

    .cache-status {
        display: flex;
        align-items: center;
        gap: 6px;
        font-family: monospace;
        font-weight: 700;
    }

    .green-indicator-glow {
        width: 6px;
        height: 6px;
        background: #00ff66;
        border-radius: 50%;
        box-shadow: 0 0 6px #00ff66;
    }

    .quick-kb-hint {
        font-weight: 500;
    }

    /* ── Drawers (Wiki & Checkpoints) ── */
    .meta-drawer {
        position: absolute;
        top: 0;
        right: 0;
        width: 320px;
        height: 100%;
        background: rgba(13, 13, 20, 0.96);
        border-left: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: -10px 0 35px rgba(0, 0, 0, 0.6);
        z-index: 100;
        display: flex;
        flex-direction: column;
        animation: drawerSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        backdrop-filter: blur(15px);
    }

    @keyframes drawerSlideIn {
        0% {
            transform: translateX(100%);
        }
        100% {
            transform: translateX(0);
        }
    }

    .drawer-header {
        height: 60px;
        padding: 0 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .drawer-header h2 {
        margin: 0;
        font-size: 0.9rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: white;
    }

    .close-drawer {
        background: transparent;
        border: none;
        color: rgba(255, 255, 255, 0.45);
        font-size: 1.1rem;
        cursor: pointer;
        transition: color 0.2s;
    }

    .close-drawer:hover {
        color: white;
    }

    .drawer-body {
        flex-grow: 1;
        padding: 20px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .meta-item {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .d-label {
        font-size: 0.65rem;
        font-weight: 700;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.35);
        letter-spacing: 0.05em;
    }

    .cast-list {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
    }

    .cast-tag {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 4px;
        padding: 4px 8px;
        font-size: 0.72rem;
        color: rgba(255, 255, 255, 0.85);
    }

    .meta-item p {
        margin: 0;
        font-size: 0.8rem;
        color: rgba(255, 255, 255, 0.75);
        line-height: 1.45;
    }

    .fact-text {
        font-style: italic;
        background: rgba(255, 204, 0, 0.04);
        border-left: 2px solid #ffcc00;
        padding: 8px 12px;
        border-radius: 0 6px 6px 0;
    }

    .meta-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
    }

    .meta-cell {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        padding: 8px;
    }

    .meta-cell p {
        margin: 4px 0 0 0;
        font-size: 0.82rem;
        font-weight: 600;
        color: white;
    }

    .ratings-badge {
        background: rgba(255, 85, 187, 0.1);
        border: 1px solid rgba(255, 85, 187, 0.2);
        color: #ff55bb;
        border-radius: 8px;
        padding: 8px;
        text-align: center;
        font-weight: 700;
        font-size: 0.82rem;
        letter-spacing: 0.05em;
    }

    .meta-links {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: 10px;
    }

    .link-btn {
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 8px;
        color: rgba(255, 255, 255, 0.85);
        padding: 8px;
        text-align: center;
        text-decoration: none;
        font-size: 0.78rem;
        font-weight: 600;
        transition: all 0.2s;
    }

    .link-btn:hover {
        background: white;
        color: black;
    }

    .add-mark-btn {
        background: rgba(0, 191, 255, 0.12);
        border: 1px solid rgba(0, 191, 255, 0.3);
        color: #00bfff;
        border-radius: 8px;
        padding: 10px;
        width: 100%;
        cursor: pointer;
        font-size: 0.78rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: all 0.2s;
    }

    .add-mark-btn:hover {
        background: rgba(0, 191, 255, 0.2);
        box-shadow: 0 0 15px rgba(0, 191, 255, 0.15);
    }

    .marks-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: 10px;
    }

    .empty-marks {
        text-align: center;
        color: rgba(255, 255, 255, 0.3);
        font-size: 0.75rem;
        line-height: 1.4;
        padding: 40px 10px;
    }

    .mark-row {
        display: flex;
        align-items: center;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        overflow: hidden;
    }

    .mark-info {
        flex-grow: 1;
        padding: 8px 12px;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: background 0.2s;
    }

    .mark-info:hover {
        background: rgba(255, 255, 255, 0.06);
    }

    .mark-name {
        font-size: 0.8rem;
        color: white;
        max-width: 160px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .mark-time {
        font-size: 0.72rem;
        font-family: monospace;
        color: #00ff66;
    }

    .delete-mark {
        background: transparent;
        border: none;
        color: rgba(255, 51, 68, 0.55);
        width: 32px;
        height: 100%;
        align-self: stretch;
        cursor: pointer;
        transition: all 0.2s;
        border-left: 1px solid rgba(255, 255, 255, 0.04);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .delete-mark:hover {
        background: rgba(255, 51, 68, 0.15);
        color: #ff3344;
    }

    /* ── Bottom Left Indicator Dot & Particles ── */
    .bottom-left-indicator {
        position: absolute;
        bottom: 20px;
        left: 20px;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 15;
        pointer-events: none;
    }

    .indicator-baseline-dot {
        width: 6px;
        height: 6px;
        background: rgba(255, 255, 255, 0.15);
        border-radius: 50%;
        box-shadow: 0 0 4px rgba(255, 255, 255, 0.1);
        transition: background 0.3s;
    }

    .indicator-particle {
        position: absolute;
        border-radius: 50%;
        background: var(--color);
        transform-origin: center;
        animation-duration: 0.35s;
        animation-fill-mode: forwards;
        animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
    }

    .indicator-particle.core-dot {
        width: 6px;
        height: 6px;
        animation-name: coreDotFlash;
    }

    @keyframes coreDotFlash {
        0% {
            transform: scale(1);
            background: #ff3344;
            box-shadow: 0 0 10px #ff3344;
        }
        100% {
            transform: scale(1);
            background: rgba(255, 51, 68, 0.4);
            box-shadow: 0 0 2px rgba(255, 51, 68, 0.2);
        }
    }

    .indicator-particle.sparkle {
        width: 4px;
        height: 4px;
        border-radius: 0;
        clip-path: polygon(
            50% 0%,
            61% 39%,
            100% 50%,
            61% 61%,
            50% 100%,
            39% 61%,
            0% 50%,
            39% 39%
        );
        animation-name: sparkleShoot;
    }

    @keyframes sparkleShoot {
        0% {
            transform: translate(0, 0) scale(0.5) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translate(var(--tx), var(--ty)) scale(1.2) rotate(180deg);
            opacity: 0;
        }
    }

    .indicator-particle.pixel {
        width: 3px;
        height: 3px;
        border-radius: 0;
        animation-name: pixelDisperse;
    }

    @keyframes pixelDisperse {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(var(--tx), var(--ty)) scale(0.2);
            opacity: 0;
        }
    }

    .indicator-particle.ring {
        width: 8px;
        height: 8px;
        background: transparent !important;
        border: 2px solid var(--color);
        animation-name: ringExpand;
    }

    @keyframes ringExpand {
        0% {
            transform: scale(0.8);
            opacity: 1;
            box-shadow:
                inset 0 0 4px var(--color),
                0 0 4px var(--color);
        }
        100% {
            transform: scale(3.8);
            opacity: 0;
            box-shadow:
                inset 0 0 10px var(--color),
                0 0 10px var(--color);
        }
    }

    .indicator-particle.glitch-red,
    .indicator-particle.glitch-white {
        width: 6px;
        height: 6px;
        animation-name: glitchShift;
    }

    @keyframes glitchShift {
        0% {
            transform: translate(-3px, 0) scale(1);
            opacity: 0.8;
        }
        20% {
            transform: translate(4px, -2px) scale(1.1);
        }
        40% {
            transform: translate(-2px, 3px) scale(0.9);
        }
        60% {
            transform: translate(3px, 1px) scale(1.2);
        }
        80% {
            transform: translate(-1px, -1px) scale(1);
        }
        100% {
            transform: translate(0, 0) scale(0.5);
            opacity: 0;
        }
    }

    .indicator-particle.pulse {
        width: 6px;
        height: 6px;
        animation-name: pulseZoom;
    }

    @keyframes pulseZoom {
        0% {
            transform: scale(1);
            opacity: 1;
            box-shadow: 0 0 15px var(--color);
        }
        50% {
            transform: scale(2.5);
            opacity: 0.8;
            box-shadow: 0 0 25px var(--color);
        }
        100% {
            transform: scale(0.2);
            opacity: 0;
        }
    }

    .download-prompt-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 50;
        backdrop-filter: blur(10px);
    }

    .download-prompt-box {
        background: rgba(15, 15, 20, 0.95);
        border: 2px solid #ff3344;
        border-radius: 16px;
        padding: 24px;
        max-width: 420px;
        text-align: center;
        box-shadow: 0 10px 40px rgba(255, 51, 68, 0.25);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
    }

    .warning-icon {
        font-size: 2.5rem;
    }

    .download-prompt-box h3 {
        color: #ff3344;
        margin: 0;
        font-weight: 800;
        font-size: 1.1rem;
        letter-spacing: 0.05em;
        text-transform: uppercase;
    }

    .download-prompt-box p {
        color: rgba(255, 255, 255, 0.7);
        font-size: 0.82rem;
        line-height: 1.5;
        margin: 0;
    }

    .code-box {
        background: #000;
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 8px;
        padding: 8px 16px;
        width: 100%;
        box-sizing: border-box;
    }

    .code-box code {
        color: #00ff66;
        font-family: monospace;
        font-size: 0.75rem;
        user-select: all;
    }

    .close-prompt-btn {
        background: #ff3344;
        border: none;
        color: white;
        font-weight: 700;
        font-size: 0.75rem;
        padding: 8px 24px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .close-prompt-btn:hover {
        background: #ff5566;
        box-shadow: 0 0 15px rgba(255, 51, 68, 0.4);
    }

    /* ── Mobile Layout Adjustments for GoPro ── */
    @media (max-width: 768px) {
        .catalog-container {
            padding: 12px;
            gap: 20px;
            background: radial-gradient(
                circle at top right,
                rgba(255, 85, 187, 0.08),
                rgba(0, 0, 0, 0.98)
            );
        }

        .hero-spotlight {
            min-height: auto;
            padding: 16px;
            border-radius: 12px;
        }

        .hero-content {
            max-width: 100%;
            gap: 8px;
        }

        .hero-title {
            font-size: 1.3rem;
        }

        .hero-fact {
            font-size: 0.72rem;
            line-height: 1.4;
        }

        .hero-meta-badges {
            gap: 4px;
        }

        .badge {
            font-size: 0.6rem;
            padding: 3px 8px;
        }

        .hero-cast {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
        }

        .cast-tags {
            gap: 4px;
        }

        .hero-actions {
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
            margin-top: 8px;
            width: 100%;
        }

        .hero-play-btn {
            width: 100%;
            justify-content: center;
            box-sizing: border-box;
            padding: 10px 20px;
        }

        .hero-external-links {
            width: 100%;
            justify-content: center;
            flex-wrap: wrap;
            gap: 6px;
        }

        .hero-link-btn {
            flex-grow: 1;
            text-align: center;
            padding: 6px 10px;
            font-size: 0.68rem;
        }

        .shelf-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
        }

        .season-selector-tabs {
            align-self: flex-start;
        }

        .cards-row {
            gap: 10px;
            padding-bottom: 12px;
        }

        .episode-card {
            flex: 0 0 140px;
        }

        .card-thumbnail {
            height: 80px;
        }

        /* Video Player HUD Layouts */
        .hud-show-info-group {
            max-width: 16.666vw;
        }

        .player-overlay-top {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
            padding: 12px;
        }

        .player-episode-info-hud {
            align-self: stretch;
            justify-content: center;
            padding: 6px 12px;
        }

        .player-drawer-toggles {
            align-self: flex-end;
        }

        .player-controls-panel {
            padding: 12px;
            gap: 12px;
        }

        .controls-row {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
        }

        .play-btn-group {
            justify-content: center;
            flex-wrap: wrap;
        }

        .speed-group {
            justify-content: center;
        }

        .loop-group {
            justify-content: center;
            flex-wrap: wrap;
            gap: 4px;
        }

        .volume-slider-box {
            justify-content: center;
            width: 100%;
        }

        .volume-slider {
            flex-grow: 1;
            max-width: 200px;
        }

        .grid-filters {
            grid-template-columns: 1fr;
            gap: 10px;
        }

        .filter-selector-row {
            justify-content: center;
        }

        .sampler-clipper-box {
            gap: 8px;
            padding: 8px;
        }

        .clipper-header-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
        }

        .bpm-control-box {
            width: 100%;
            box-sizing: border-box;
            justify-content: center;
        }

        .timeline-headers {
            flex-direction: column;
            align-items: center;
            gap: 4px;
            text-align: center;
        }
    }
</style>
