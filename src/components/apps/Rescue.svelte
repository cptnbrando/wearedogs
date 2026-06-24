<script>
  import BaseApp from "./BaseApp.svelte";
  import { onDestroy } from "svelte";
  import {
    Radio,
    Heart,
    Zap,
    Activity,
    PhoneCall,
    MessageSquare,
    ExternalLink,
    Compass,
    AlertCircle,
    ShieldAlert,
  } from "lucide-svelte";

  let isBroadcasting = $state(false);
  let latitude = $state(-3.4682); // Simulated lost location (Amazon Rainforest)
  let longitude = $state(-62.2157);
  let signalRange = $state(0); // active signal range in km
  let battery = $state(94);
  let heartRate = $state(72);
  let gpsPrecision = $state(28); // in meters
  let pulseActive = $state(false);

  let isSynced = $state(false);
  let isLocating = $state(false);
  let syncError = $state("");
  let areaInfo = $state(null);
  let networkSignal = $state("UNKNOWN");
  let networkType = $state("NONE");
  let networkRtt = $state("—");

  let broadcastInterval = null;
  let coordinateInterval = null;

  // Web Audio Context for synthesizer feedback beep
  let audioCtx = null;

  function syncDeviceData() {
    syncError = "";
    isLocating = true;
    if (!navigator.geolocation) {
      syncError = "No GPS support";
      isLocating = false;
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        gpsPrecision = position.coords.accuracy || 3;

        try {
          // 1. Fetch Reverse Geocoding
          const geoUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
          const geoRes = await fetch(geoUrl);
          if (!geoRes.ok) throw new Error("Reverse geocode failed");
          const geoData = await geoRes.json();

          const countryCode = geoData.countryCode;
          const countryName = geoData.countryName;
          const city = geoData.locality || geoData.city;
          const principalSubdivision = geoData.principalSubdivision;

          // Find timezone
          const timezoneItem = geoData.localityInfo?.informative?.find(
            (i) => i.description === "time zone",
          );
          const timezone = timezoneItem ? timezoneItem.name : "UTC";

          let countryIntelligence = null;
          if (countryCode) {
            // 2. Fetch Country Info from ApiCountries
            const countryUrl = `https://www.apicountries.com/alpha/${countryCode}`;
            const countryRes = await fetch(countryUrl);
            if (countryRes.ok) {
              countryIntelligence = await countryRes.json();
            }
          }

          if (countryIntelligence) {
            areaInfo = {
              country: countryName || countryIntelligence.name,
              countryCode: countryCode || countryIntelligence.alpha2Code,
              city: city || countryIntelligence.capital || "Unknown",
              state: principalSubdivision || "",
              timezone: timezone,
              population: countryIntelligence.population,
              languages:
                countryIntelligence.languages?.map((l) => l.name).join(", ") ||
                "Unknown",
              currency:
                countryIntelligence.currencies
                  ?.map((c) => `${c.name} (${c.symbol || c.code})`)
                  .join(", ") || "Unknown",
              flagUrl:
                countryIntelligence.flags?.svg ||
                countryIntelligence.flag ||
                "",
              capital: countryIntelligence.capital || "Unknown",
              region: countryIntelligence.region || "Unknown",
              subregion: countryIntelligence.subregion || "Unknown",
              borders: countryIntelligence.borders?.join(", ") || "None",
            };
          } else {
            // Fallback if country info fetch failed but reverse geocode succeeded
            areaInfo = {
              country: countryName || "Unknown",
              countryCode: countryCode || "",
              city: city || "Unknown",
              state: principalSubdivision || "",
              timezone: timezone,
              population: null,
              languages: "Unknown",
              currency: "Unknown",
              flagUrl: "",
              capital: "Unknown",
              region: "Unknown",
              subregion: "Unknown",
              borders: "None",
            };
          }
          isSynced = true;
          updateNetworkInfo();
        } catch (err) {
          console.warn("Error resolving geolocation data:", err);
          syncError = "Failed to fetch area data";
        } finally {
          isLocating = false;
        }
      },
      (error) => {
        console.warn("Geolocation permission error:", error);
        if (error.code === error.PERMISSION_DENIED) {
          syncError = "Denied";
        } else {
          syncError = "Timeout";
        }
        isLocating = false;
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 },
    );
  }

  function updateNetworkInfo() {
    if (typeof navigator !== "undefined" && navigator.connection) {
      const conn = navigator.connection;
      networkType = conn.effectiveType
        ? conn.effectiveType.toUpperCase()
        : "ACTIVE";
      networkSignal = conn.downlink ? `${conn.downlink} Mbps` : "STABLE";
      networkRtt = conn.rtt ? `${conn.rtt} ms` : "—";
    } else {
      networkType = "ONLINE";
      networkSignal = "STABLE";
    }
  }

  function playSOSBeep() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sine";
      // high-tech homing beacon frequency
      osc.frequency.setValueAtTime(1250, audioCtx.currentTime);

      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.06, audioCtx.currentTime + 0.05); // low volume
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audioCtx.currentTime + 0.35,
      ); // quick decay

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch (err) {
      console.warn("Web Audio API blocked or unsupported:", err);
    }
  }

  function startBroadcast() {
    isBroadcasting = true;
    signalRange = 12;
    gpsPrecision = 28;

    // Pulse beep and range increase loop
    broadcastInterval = setInterval(() => {
      if (signalRange < 1850) {
        signalRange += Math.floor(Math.random() * 45) + 15;
      }
      if (Math.random() > 0.85 && battery > 1) {
        battery -= 1;
      }
      playSOSBeep();
      pulseActive = true;
      setTimeout(() => {
        pulseActive = false;
      }, 400);
    }, 1800);

    // Drifting coordinates and heartbeat pulse
    coordinateInterval = setInterval(() => {
      if (!isSynced) {
        latitude += (Math.random() - 0.5) * 0.00008;
        longitude += (Math.random() - 0.5) * 0.00008;
        gpsPrecision = Math.max(3, gpsPrecision - (Math.random() * 3 - 0.8));
      } else {
        // High accuracy micro-drifting for actual device GPS
        latitude += (Math.random() - 0.5) * 0.000005;
        longitude += (Math.random() - 0.5) * 0.000005;
        gpsPrecision = Math.max(2, gpsPrecision + (Math.random() * 0.4 - 0.2));
      }
      heartRate = Math.floor(68 + Math.random() * 12);
    }, 2000);
  }

  function stopBroadcast() {
    isBroadcasting = false;
    clearInterval(broadcastInterval);
    clearInterval(coordinateInterval);
    signalRange = 0;
    gpsPrecision = isSynced ? gpsPrecision : 28;
  }

  function toggleBroadcast() {
    if (isBroadcasting) {
      stopBroadcast();
    } else {
      startBroadcast();
    }
  }

  onDestroy(() => {
    clearInterval(broadcastInterval);
    clearInterval(coordinateInterval);
  });

  const resources = [
    {
      title: "Mental Health & Crisis",
      icon: "🚨",
      desc: "Immediate help for suicide prevention, mental distress, or crisis support.",
      hotline: "988 (Call/Text)",
      url: "tel:988",
      website: "https://988lifeline.org",
      linkText: "988lifeline.org",
      color: "#ff3344",
    },
    {
      title: "Drug & Substance Abuse",
      icon: "💊",
      desc: "Confidential recovery guidance for drug and substance use disorders.",
      hotline: "1-800-662-4357",
      url: "tel:18006624357",
      website: "https://www.samhsa.gov/find-help/national-helpline",
      linkText: "samhsa.gov",
      color: "#ff7800",
    },
    {
      title: "Alcohol Addiction",
      icon: "🍺",
      desc: "Support, recovery paths, and intervention assistance for alcohol misuse.",
      hotline: "1-800-662-4357",
      url: "tel:18006624357",
      website: "https://www.aa.org",
      linkText: "aa.org",
      color: "#ffcc00",
    },
    {
      title: "Marijuana Addiction",
      icon: "🌿",
      desc: "Counseling and cessation support resources for cannabis dependency.",
      hotline: "1-800-662-4357",
      url: "tel:18006624357",
      website: "https://www.samhsa.gov/marijuana",
      linkText: "samhsa.gov",
      color: "#00ff66",
    },
    {
      title: "Gambling Addiction",
      icon: "🎲",
      desc: "Assistance for sports betting, slot play, and risky financial behaviors.",
      hotline: "1-800-522-4700",
      url: "tel:18005224700",
      website: "https://www.ncpgambling.org",
      linkText: "ncpgambling.org",
      color: "#00bfff",
    },
    {
      title: "Gaming & Internet Overuse",
      icon: "🎮",
      desc: "Support for digital obsession, screen dependency, and console burnout.",
      hotline: "1-800-662-4357",
      url: "tel:18006624357",
      website: "https://gamequitters.com",
      linkText: "gamequitters.com",
      color: "#b400ff",
    },
    {
      title: "Shopping Addiction",
      icon: "🛍️",
      desc: "Counseling for compulsive shopping, debt habits, and spending vices.",
      hotline: "1-800-662-4357",
      url: "tel:18006624357",
      website: "https://www.debtorsanonymous.org",
      linkText: "debtorsanonymous.org",
      color: "#ff00b4",
    },
    {
      title: "Porn & Intimacy Addiction",
      icon: "🔞",
      desc: "Support and recovery channels for sexual and pornography compulsive dependencies.",
      hotline: "1-800-662-4357",
      url: "tel:18006624357",
      website: "https://saa-recovery.org",
      linkText: "saa-recovery.org",
      color: "#ff33aa",
    },
  ];
</script>

<BaseApp
  title="Ghost Murmur Beacon"
  description="Emergency signaling protocol & recovery support network."
  graphicSrc="/rescue.png"
  themeColor="#00bfff"
>
  <div class="rescue-layout">
    <!-- Left Column: SOS Homing Beacon -->
    <div class="column beacon-system">
      <div class="system-tag-row">
        <span class="system-status-indicator" class:active={isBroadcasting}
        ></span>
        <span class="system-title-tag">GHOST MURMUR v1.0.9 // TRANSMITTER</span>
      </div>

      <p class="intel-brief">
        <strong>Intel Note:</strong> The CIA <em>Ghost Murmur</em> project was rumored
        to detect heartbeats from orbit, tens of thousands of kilometers away. Because
        of the limits of physical wave attenuation (a heart can't beat hard enough),
        it is likely a cover story to mask real incognito informational spies and
        assets. This page serves as a localized, high-gain homing beacon, should
        you ever need to come down from space.
      </p>

      <div class="radar-box">
        <!-- Radar background grids -->
        <div class="radar-grid">
          <span class="grid-ring ring-1"></span>
          <span class="grid-ring ring-2"></span>
          <span class="grid-ring ring-3"></span>
          <span class="radar-sweep" class:sweeping={isBroadcasting}></span>
        </div>

        {#if isBroadcasting}
          <div class="ping-waves">
            <span class="wave pulse-1" class:pulsing={pulseActive}></span>
            <span class="wave pulse-2" class:pulsing={pulseActive}></span>
            <span class="wave pulse-3" class:pulsing={pulseActive}></span>
          </div>
        {/if}

        <button
          class="sos-trigger-btn"
          class:broadcasting={isBroadcasting}
          onclick={toggleBroadcast}
          aria-label={isBroadcasting ? "Stop SOS Beacon" : "Start SOS Beacon"}
        >
          <div class="btn-glow"></div>
          <div class="btn-content">
            <Radio
              size={36}
              class="radio-icon {isBroadcasting ? 'flashing' : ''}"
            />
            <span class="sos-text"
              >{isBroadcasting ? "ACTIVE SOS" : "EMIT BEACON"}</span
            >
          </div>
        </button>
      </div>

      <!-- Telemetry Dashboard -->
      <div class="telemetry-panel">
        <div class="tel-grid">
          <div class="tel-card coordinates-card">
            <div class="card-header-row">
              <span class="tel-lbl"><Compass size={12} /> COORDINATES</span>
              <button
                class="sync-btn"
                class:synced={isSynced}
                class:error={syncError !== ""}
                disabled={isLocating}
                onclick={syncDeviceData}
              >
                {isLocating
                  ? "SYNCING..."
                  : isSynced
                    ? "SYNCED"
                    : syncError
                      ? syncError.toUpperCase()
                      : "SYNC NOW"}
              </button>
            </div>
            <span class="tel-val font-mono">
              {latitude.toFixed(5)}°{latitude >= 0 ? "N" : "S"}, {Math.abs(
                longitude,
              ).toFixed(5)}°{longitude >= 0 ? "E" : "W"}
            </span>
            <span class="tel-sub"
              >Source: {isSynced ? "DEVICE GPS" : "SIMULATED TELEMETRY"} (±{gpsPrecision.toFixed(
                1,
              )}m)</span
            >
          </div>
          <div class="tel-card">
            <span class="tel-lbl"><Activity size={12} /> GHOST BIOMETRIC</span>
            <span class="tel-val font-mono" class:pulse-color={isBroadcasting}>
              {heartRate} BPM
            </span>
            <span class="tel-sub"
              >Heartbeat Lock: {isBroadcasting ? "EMULATED" : "STANDBY"}</span
            >
          </div>
          <div class="tel-card">
            <span class="tel-lbl"><Zap size={12} /> TRANSMISSION</span>
            <span class="tel-val font-mono">
              {isBroadcasting ? `${signalRange} KM` : "INACTIVE"}
            </span>
            <span class="tel-sub">
              {#if isSynced && networkType !== "NONE"}
                Net: {networkType} ({networkSignal})
              {:else}
                Frequency: 406.025 MHz
              {/if}
            </span>
          </div>
          <div class="tel-card">
            <span class="tel-lbl"><AlertCircle size={12} /> SYSTEM CELL</span>
            <span class="tel-val font-mono">{battery}% BATTERY</span>
            <span class="tel-sub">
              {#if isSynced && networkRtt !== "—"}
                RTT: {networkRtt}
              {:else}
                Homing Relay: Stable
              {/if}
            </span>
          </div>
          {#if isSynced && areaInfo}
            <div class="tel-card area-intelligence-card">
              <span class="tel-lbl intel-header">
                <Compass size={12} /> LOCAL AREA BRIEF
              </span>
              <div class="intel-body">
                {#if areaInfo.flagUrl}
                  <img
                    src={areaInfo.flagUrl}
                    alt="{areaInfo.country} Flag"
                    class="intel-flag"
                  />
                {/if}
                <div class="intel-stats">
                  <div class="intel-row">
                    <span class="intel-key">Country:</span>
                    <span class="intel-val-highlight"
                      >{areaInfo.country} ({areaInfo.countryCode})</span
                    >
                  </div>
                  <div class="intel-row">
                    <span class="intel-key">Location:</span>
                    <span class="intel-val-text"
                      >{areaInfo.city}{areaInfo.state
                        ? `, ${areaInfo.state}`
                        : ""}</span
                    >
                  </div>
                  {#if areaInfo.population}
                    <div class="intel-row">
                      <span class="intel-key">Population:</span>
                      <span class="intel-val-text font-mono"
                        >{new Intl.NumberFormat().format(
                          areaInfo.population,
                        )}</span
                      >
                    </div>
                  {/if}
                  <div class="intel-row">
                    <span class="intel-key">Language:</span>
                    <span class="intel-val-text">{areaInfo.languages}</span>
                  </div>
                  <div class="intel-row">
                    <span class="intel-key">Capital:</span>
                    <span class="intel-val-text">{areaInfo.capital}</span>
                  </div>
                  <div class="intel-row">
                    <span class="intel-key">Currency:</span>
                    <span class="intel-val-text font-mono"
                      >{areaInfo.currency}</span
                    >
                  </div>
                  <div class="intel-row">
                    <span class="intel-key">Timezone:</span>
                    <span class="intel-val-text font-mono"
                      >{areaInfo.timezone}</span
                    >
                  </div>
                  {#if areaInfo.borders && areaInfo.borders !== "None"}
                    <div class="intel-row">
                      <span class="intel-key">Borders:</span>
                      <span class="intel-val-text">{areaInfo.borders}</span>
                    </div>
                  {/if}
                </div>
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>

    <!-- Right Column: Support Resources -->
    <div class="column support-services">
      <div class="support-header">
        <ShieldAlert size={20} class="support-alert-icon" />
        <div>
          <h3>HUMAN SUPPORT RESOURCES</h3>
          <p class="support-subtitle">
            Guidance and hotlines for addictions, crises, and vices.
          </p>
        </div>
      </div>

      <div class="resources-grid scroll-container">
        {#each resources as item}
          <div class="resource-card" style="--card-neon-color: {item.color}">
            <div class="card-title-row">
              <span class="card-icon">{item.icon}</span>
              <h4>{item.title}</h4>
            </div>
            <p class="card-desc">{item.desc}</p>
            <div class="card-actions">
              <a
                href={item.url}
                class="action-btn dial-btn"
                title="Call Hotline"
              >
                <PhoneCall size={12} />
                <span>{item.hotline}</span>
              </a>
              <a
                href={item.website}
                target="_blank"
                rel="noopener noreferrer"
                class="action-btn web-btn"
                title="Visit Website"
              >
                <ExternalLink size={12} />
                <span>{item.linkText}</span>
              </a>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Disclaimer / Confidentiality Notice underneath -->
    <div class="disclaimer-note">
      <strong>Confidentiality Notice:</strong> These hotlines are free, but
      there are a lot of bastards on this planet. Say the wrong word to the
      wrong person, you go to jail,
      <a href="https://en.wikipedia.org/wiki/MKUltra" target="_blank">
        or far worse
      </a>. In a lot of places, all
      <a href="https://www.flocksafety.com/" target="_blank"
        >telecommunications are tapped</a
      >, recorded, stored, and
      <a href="https://www.palantir.com/" target="_blank">analyzed</a>. Social
      credit systems are on the rise worldwide. These services here are
      American. The American government runs over a hundred hotlines nationwide,
      specifically designed to entrap, target, locate, and imprison anybody who
      calls them, if they say specific things. If they have specific problems.
      The government does not help anybody. They monetize, record, and sell.
      They imprison. Lock up. Sandwiches. Padded walls. Group showers. These
      state and federal services even have enough funding to run multi-million
      dollar ad campaigns to make the honeypots look more enticing. Only ever
      saying that they're there to help you. They're not. Nobody is here to
      truly help you. The government is here to keep order and horde wealth,
      that's it. Use the "most likely to narc" stat for each service to
      determine if your problem will be helped or hurt by them. Thank you
      America.
    </div>
  </div>
</BaseApp>

<!-- Dog shooting 
 https://www.police1.com/body-camera/bwc-released-in-fatal-ois-of-pet-dog-who-approached-lapd-officer-during-wellness-check
 https://www.youtube.com/watch?v=ggvwai1ml5c 
-->
<!-- Sonya Massey https://www.pbs.org/newshour/nation/former-illinois-deputy-who-killed-sonya-massey-is-sentenced-to-20-years-in-prison -->
<!-- Sydney Wilson https://www.youtube.com/watch?v=SDNagD8ljXI -->

<style>
  .rescue-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    height: 100%;
    overflow: hidden;
  }

  .column {
    display: flex;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.015);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 20px;
    box-sizing: border-box;
    overflow: hidden;
    height: 100%;
  }

  /* ── Column 1: SOS Beacon ── */
  .beacon-system {
    gap: 16px;
  }

  .system-tag-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .system-status-indicator {
    width: 8px;
    height: 8px;
    background: rgba(255, 255, 255, 0.25);
    border-radius: 50%;
    box-shadow: 0 0 4px rgba(255, 255, 255, 0.25);
    transition: all 0.3s ease;
  }

  .system-status-indicator.active {
    background: #00ff66;
    box-shadow:
      0 0 10px #00ff66,
      0 0 20px #00ff66;
    animation: statusPulse 1s infinite alternate;
  }

  @keyframes statusPulse {
    from {
      opacity: 0.6;
    }
    to {
      opacity: 1;
    }
  }

  .system-title-tag {
    font-size: 0.7rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.4);
    letter-spacing: 0.12em;
    font-family: monospace;
  }

  .intel-brief {
    font-size: 0.78rem;
    line-height: 1.45;
    color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.01);
    border: 1px solid rgba(255, 255, 255, 0.04);
    border-radius: 10px;
    padding: 12px;
    margin: 0;
    font-family: "Inter", sans-serif;
  }

  .intel-brief em,
  .disclaimer-note a {
    color: #00bfff;
    font-style: normal;
    font-weight: 600;
  }

  /* Radar Area */
  .radar-box {
    position: relative;
    flex-grow: 1;
    min-height: 200px;
    background: rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(0, 191, 255, 0.15);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .radar-grid {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    opacity: 0.3;
  }

  .grid-ring {
    position: absolute;
    border: 1px dashed rgba(0, 191, 255, 0.3);
    border-radius: 50%;
  }

  .grid-ring.ring-1 {
    width: 120px;
    height: 120px;
  }
  .grid-ring.ring-2 {
    width: 220px;
    height: 220px;
  }
  .grid-ring.ring-3 {
    width: 320px;
    height: 320px;
  }

  .radar-sweep {
    position: absolute;
    width: 150%;
    height: 150%;
    background: conic-gradient(
      from 0deg,
      rgba(0, 191, 255, 0.07) 0deg,
      transparent 90deg
    );
    border-radius: 50%;
    opacity: 0;
    transform: rotate(0deg);
  }

  .radar-sweep.sweeping {
    opacity: 1;
    animation: sweep 4s infinite linear;
  }

  @keyframes sweep {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* Expand waves on active beep */
  .ping-waves {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }

  .wave {
    position: absolute;
    border: 1px solid rgba(255, 120, 0, 0.6);
    border-radius: 50%;
    width: 60px;
    height: 60px;
    opacity: 0;
  }

  .wave.pulsing {
    animation: pingPulse 1.5s cubic-bezier(0.1, 0.8, 0.1, 1) forwards;
  }

  .wave.pulse-2 {
    animation-delay: 0.2s;
  }
  .wave.pulse-3 {
    animation-delay: 0.4s;
  }

  @keyframes pingPulse {
    0% {
      width: 60px;
      height: 60px;
      opacity: 0.9;
      border-color: rgba(255, 120, 0, 0.8);
    }
    100% {
      width: 450px;
      height: 450px;
      opacity: 0;
      border-color: rgba(255, 50, 0, 0);
    }
  }

  /* Trigger Button */
  .sos-trigger-btn {
    position: relative;
    width: 110px;
    height: 110px;
    border-radius: 50%;
    border: 2px solid rgba(0, 191, 255, 0.5);
    background: rgba(10, 10, 15, 0.7);
    color: #00bfff;
    cursor: pointer;
    z-index: 5;
    outline: none;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .sos-trigger-btn:hover {
    transform: scale(1.06);
    border-color: #00bfff;
    box-shadow: 0 0 30px rgba(0, 191, 255, 0.35);
  }

  .sos-trigger-btn.broadcasting {
    border-color: #ff3344;
    color: #ff3344;
    box-shadow: 0 0 40px rgba(255, 51, 68, 0.4);
    animation: triggerFlashing 1.8s infinite alternate;
  }

  @keyframes triggerFlashing {
    0% {
      box-shadow: 0 0 25px rgba(255, 51, 68, 0.2);
    }
    100% {
      box-shadow: 0 0 45px rgba(255, 51, 68, 0.55);
    }
  }

  .btn-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .sos-text {
    font-size: 0.68rem;
    font-weight: 900;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-family: "Outfit", sans-serif;
  }

  :global(.radio-icon.flashing) {
    animation: iconFlash 0.9s infinite step-end;
  }

  @keyframes iconFlash {
    50% {
      opacity: 0.4;
    }
  }

  /* Telemetry Dashboard */
  .telemetry-panel {
    background: rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.04);
    border-radius: 12px;
    padding: 12px;
  }

  .tel-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .tel-card {
    display: flex;
    flex-direction: column;
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.01);
    border: 1px solid rgba(255, 255, 255, 0.03);
    border-radius: 8px;
  }

  .tel-card.coordinates-card {
    grid-column: 1 / -1;
  }

  .area-intelligence-card {
    grid-column: 1 / -1;
    background: rgba(0, 191, 255, 0.03) !important;
    border: 1px solid rgba(0, 191, 255, 0.15) !important;
    border-radius: 10px;
    padding: 14px;
    animation: intelligenceFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes intelligenceFadeIn {
    0% {
      opacity: 0;
      transform: translateY(6px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .intel-header {
    color: #00bfff !important;
    font-weight: 700;
    letter-spacing: 0.1em;
    display: flex;
    align-items: center;
    gap: 6px;
    border-bottom: 1px solid rgba(0, 191, 255, 0.1);
    padding-bottom: 6px;
    margin-bottom: 10px;
  }

  .intel-body {
    display: flex;
    gap: 16px;
    align-items: flex-start;
  }

  .intel-flag {
    width: 60px;
    height: auto;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.15);
    flex-shrink: 0;
  }

  .intel-stats {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .intel-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.72rem;
    line-height: 1.4;
    border-bottom: 1px dashed rgba(255, 255, 255, 0.03);
    padding-bottom: 3px;
  }

  .intel-key {
    color: rgba(255, 255, 255, 0.4);
    font-weight: 500;
  }

  .intel-val-highlight {
    color: #00bfff;
    font-weight: 700;
  }

  .intel-val-text {
    color: rgba(255, 255, 255, 0.85);
    text-align: right;
    max-width: 70%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .card-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 4px;
  }

  .sync-btn {
    background: rgba(0, 191, 255, 0.1);
    border: 1px solid rgba(0, 191, 255, 0.25);
    color: #00bfff;
    border-radius: 4px;
    padding: 2px 8px;
    font-size: 0.58rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: "Outfit", sans-serif;
  }

  .sync-btn:hover {
    background: rgba(0, 191, 255, 0.2);
    border-color: #00bfff;
    box-shadow: 0 0 8px rgba(0, 191, 255, 0.25);
  }

  .sync-btn.synced {
    background: rgba(0, 255, 102, 0.1);
    border-color: rgba(0, 255, 102, 0.35);
    color: #00ff66;
    cursor: default;
  }

  .sync-btn.synced:hover {
    box-shadow: none;
  }

  .sync-btn.error {
    background: rgba(255, 51, 68, 0.1);
    border-color: rgba(255, 51, 68, 0.3);
    color: #ff3344;
  }

  .tel-lbl {
    font-size: 0.55rem;
    color: rgba(255, 255, 255, 0.35);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 4px;
    font-family: "Outfit", sans-serif;
  }

  .tel-val {
    font-size: 0.8rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.9);
  }

  .font-mono {
    font-family: monospace;
  }

  .tel-sub {
    font-size: 0.58rem;
    color: rgba(255, 255, 255, 0.3);
    margin-top: 2px;
  }

  .pulse-color {
    color: #ff7800 !important;
    text-shadow: 0 0 8px rgba(255, 120, 0, 0.4);
  }

  /* ── Column 2: Support Services ── */
  .support-services {
    gap: 16px;
  }

  .support-header {
    display: flex;
    align-items: center;
    gap: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    padding-bottom: 14px;
  }

  :global(.support-alert-icon) {
    color: #00bfff;
    filter: drop-shadow(0 0 6px rgba(0, 191, 255, 0.4));
  }

  .support-header h3 {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 800;
    color: white;
    letter-spacing: 0.05em;
    font-family: "Outfit", sans-serif;
  }

  .support-subtitle {
    margin: 2px 0 0 0;
    font-size: 0.72rem;
    color: rgba(255, 255, 255, 0.4);
  }

  .resources-grid {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow-y: auto;
    padding-right: 4px;
  }

  /* Custom styled scrollbars */
  .scroll-container::-webkit-scrollbar {
    width: 4px;
  }
  .scroll-container::-webkit-scrollbar-track {
    background: transparent;
  }
  .scroll-container::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 2px;
  }
  .scroll-container::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .resource-card {
    background: rgba(255, 255, 255, 0.01);
    border: 1px solid rgba(255, 255, 255, 0.04);
    border-left: 3px solid var(--card-neon-color, #ffffff);
    border-radius: 10px;
    padding: 10px 14px;
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 12px;
    transition: all 0.2s ease;
  }

  .resource-card:hover {
    background: rgba(255, 255, 255, 0.03);
    border-color: rgba(255, 255, 255, 0.08);
    transform: translateY(-1px);
  }

  .card-title-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 2px;
    grid-column: 1 / 2;
  }

  .card-icon {
    font-size: 0.95rem;
  }

  .resource-card h4 {
    margin: 0;
    font-size: 0.82rem;
    font-weight: 700;
    color: white;
  }

  .card-desc {
    margin: 0;
    font-size: 0.68rem;
    color: rgba(255, 255, 255, 0.45);
    line-height: 1.35;
    grid-column: 1 / 2;
  }

  .card-actions {
    grid-column: 2 / 3;
    grid-row: 1 / 3;
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: stretch;
  }

  .action-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    padding: 6px 10px;
    color: white;
    text-decoration: none;
    font-size: 0.65rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: monospace;
    justify-content: flex-start;
  }

  .dial-btn {
    border-color: rgba(0, 255, 102, 0.2);
    color: #00ff66;
    background: rgba(0, 255, 102, 0.03);
  }

  .dial-btn:hover {
    background: rgba(0, 255, 102, 0.12);
    border-color: #00ff66;
    box-shadow: 0 0 10px rgba(0, 255, 102, 0.15);
  }

  .web-btn {
    border-color: rgba(0, 191, 255, 0.2);
    color: #00bfff;
    background: rgba(0, 191, 255, 0.03);
  }

  .web-btn:hover {
    background: rgba(0, 191, 255, 0.12);
    border-color: #00bfff;
    box-shadow: 0 0 10px rgba(0, 191, 255, 0.15);
  }

  .disclaimer-note {
    grid-column: 1 / -1;
    font-size: 0.65rem;
    line-height: 1.4;
    color: rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.005);
    border: 1px dashed rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 8px 12px;
  }

  /* ── Mobile Portrait Layout (Width <= 768px) ── */
  @media (max-width: 768px) {
    .rescue-layout {
      grid-template-columns: 1fr;
      gap: 16px;
      height: auto;
      overflow: visible;
    }

    .column {
      height: auto;
      min-height: auto;
      padding: 16px;
      overflow: visible;
    }

    .radar-box {
      min-height: 200px;
    }

    .resources-grid {
      overflow: visible;
      height: auto;
    }

    .tel-grid > :not(.coordinates-card):not(.area-intelligence-card) {
      display: none !important;
    }
  }

  /* ── Landscape Layout / Short Screens (Height <= 580px) ── */
  @media (max-height: 580px) {
    .rescue-layout {
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      height: auto;
      overflow: visible;
    }

    .column {
      height: auto;
      min-height: auto;
      padding: 12px;
      overflow: visible;
    }

    .intel-brief {
      font-size: 0.72rem;
      padding: 8px;
    }

    .radar-box {
      min-height: 160px;
    }

    .resources-grid {
      overflow: visible;
      height: auto;
    }

    .tel-grid > :not(.coordinates-card):not(.area-intelligence-card) {
      display: none !important;
    }
  }

  /* ── Extra Small Mobile Stacking (Width <= 600px) ── */
  @media (max-width: 600px) {
    .rescue-layout {
      grid-template-columns: 1fr !important;
    }

    .resource-card {
      grid-template-columns: 1fr !important;
      padding: 12px !important;
      gap: 8px !important;
    }

    .card-actions {
      grid-column: 1 / -1 !important;
      grid-row: auto !important;
      flex-direction: row !important;
      justify-content: flex-start !important;
      width: 100% !important;
      gap: 8px !important;
    }

    .action-btn {
      flex: 1 !important;
      justify-content: center !important;
      font-size: 0.6rem !important;
      padding: 6px 8px !important;
    }
  }
</style>
