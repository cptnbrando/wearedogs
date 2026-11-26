<script>
  /**
   * AirLog: Air Train's log, opened from its footer. Every message that
   * crosses the connection, live, each way, in words (sessionLog.js), with how
   * the connection runs (straight between the devices, or through a relay)
   * and what is and is not sent. The heartbeat and the playing song's time go
   * by several times a second, so they are counted, not listed.
   */
  import { onMount } from "svelte";
  import { ArrowUp, ArrowDown, Info, Trash2, X, Lock } from "lucide-svelte";
  import { tether } from "../../../lib/tether.svelte.js";

  const ROUTE_EVERY_MS = 5000;
  const ROUTE_WORDS = {
    direct: "Straight between your two devices.",
    relay: "Through a free relay server, because a network blocked the straight way. It passes the encrypted data on and cannot read it.",
    "": "Not connected right now.",
  };
  const SENT_WORDS = "What goes across: the files and notes you send; the music player's buttons, the song's id and where it is; the visualizer preset's name and the sound's loudness for its picture; a heartbeat every few seconds. Never your passcodes, PINs or keys. The free PeerJS server only introduces the two devices; after that it sees nothing.";
  const TIME_FORMAT = { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false };

  /** @type {{ onClose: () => void }} */
  let { onClose } = $props();

  let route = $state("");
  let listEl = $state(null);
  let entries = $derived(tether.log.slice().reverse());

  onMount(() => {
    const look = () => tether.route().then((found) => (route = found));
    look();
    const timer = setInterval(look, ROUTE_EVERY_MS);
    return () => clearInterval(timer);
  });

  const timeOf = (at) => new Date(at).toLocaleTimeString([], TIME_FORMAT);
</script>

<section class="dt-log flex min-h-0 flex-col gap-2 p-3 md:p-4 2xl:gap-3 2xl:p-6" aria-label="Air Train log">
  <div class="flex flex-row items-center justify-between gap-2">
    <h3 class="dt-log-title text-sm md:text-base 2xl:text-xl">Log · live</h3>
    <div class="flex flex-row items-center gap-1 md:gap-2">
      <button type="button" class="dt-icon-button" onclick={() => tether.clearLog()} aria-label="Clear the log" title="Clear the log"><Trash2 size={15} /></button>
      <button type="button" class="dt-icon-button" onclick={onClose} aria-label="Close the log" title="Close the log"><X size={16} /></button>
    </div>
  </div>

  <div class="dt-log-facts grid grid-cols-1 gap-1 text-xs sm:grid-cols-2 md:grid-cols-2 md:text-sm lg:grid-cols-2 xl:grid-cols-3 2xl:text-base">
    <p><Lock size={12} aria-hidden="true" /> Encrypted end to end between your devices (WebRTC, DTLS).</p>
    <p>Route: {ROUTE_WORDS[route] || ROUTE_WORDS[""]}</p>
    <p>Heartbeats {tether.beats} · song-time and visualizer ticks {tether.ticks}{tether.loopStopped ? " · loop stopped" : ""}</p>
  </div>
  <p class="dt-log-sent text-xs md:text-sm 2xl:text-base">{SENT_WORDS}</p>

  <ol class="dt-log-list min-h-0 flex-1 overflow-y-auto text-xs md:text-sm 2xl:text-base" bind:this={listEl} aria-live="off">
    {#each entries as entry (entry.id)}
      <li class="dt-log-row flex flex-row items-start gap-2 py-1" class:is-out={entry.dir === "out"} class:is-in={entry.dir === "in"} class:is-loop={entry.kind === "loop"}>
        <span class="dt-log-time shrink-0">{timeOf(entry.at)}</span>
        <span class="dt-log-dir shrink-0" title={entry.dir === "out" ? "Sent from this device" : entry.dir === "in" ? "Came from the other device" : "On this device"}>
          {#if entry.dir === "out"}<ArrowUp size={13} aria-label="sent" />{:else if entry.dir === "in"}<ArrowDown size={13} aria-label="received" />{:else}<Info size={13} aria-label="note" />{/if}
        </span>
        <span class="dt-log-text min-w-0">{entry.text}</span>
      </li>
    {:else}
      <li class="dt-log-empty py-2">Nothing yet. Connect, send something, or play music while tethered.</li>
    {/each}
  </ol>
</section>
