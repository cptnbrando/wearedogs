<script>
  import { ArrowRightLeft, Sparkles, Calculator, CalendarClock, Globe2, CornerDownLeft } from "lucide-svelte";
  import {
    UNITS,
    unitById,
    fmtNum,
    parseDurationList,
    runQuery,
    answerDurationConvert,
    answerDateMath,
    answerZoneConvert,
    CITY_OPTIONS,
    localZone,
  } from "../../../lib/timeMath.js";

  const EXAMPLES = [
    "2,418,187,620 seconds to years",
    "420.7372 years to months",
    "4 weeks 2 days 13 hours after jan 6 2026 2:14pm in tulsa ok",
    "2pm in beijing is what in tulsa time?",
  ];

  const MODES = [
    { id: "smart", label: "Smart Query", icon: Sparkles },
    { id: "duration", label: "Duration", icon: Calculator },
    { id: "datemath", label: "Date Math", icon: CalendarClock },
    { id: "zones", label: "Time Zones", icon: Globe2 },
  ];

  let mode = $state("smart");
  let result = $state(null);

  // Smart query
  let query = $state("");

  // Duration form
  let durValue = $state("2418187620");
  let durFrom = $state("seconds");
  let durTo = $state("years");

  // Date math form
  let dmDuration = $state("4 weeks 2 days 13 hours");
  let dmDirection = $state("after");
  let dmDate = $state(defaultLocalDateTime());
  let dmPlace = $state("local");

  // Zone form
  let znTime = $state("14:00");
  let znDate = $state("");
  let znFrom = $state("Asia/Shanghai");
  let znTo = $state("local");

  function defaultLocalDateTime() {
    const n = new Date();
    const p = (x) => String(x).padStart(2, "0");
    return `${n.getFullYear()}-${p(n.getMonth() + 1)}-${p(n.getDate())}T${p(n.getHours())}:${p(n.getMinutes())}`;
  }

  function placeFromOption(tzValue) {
    if (tzValue === "local") return { label: "Local Time", tz: localZone() };
    const opt = CITY_OPTIONS.find((c) => c.tz === tzValue);
    return { label: opt ? opt.label : tzValue, tz: tzValue };
  }

  function runSmart() {
    result = runQuery(query);
  }

  function runExample(ex) {
    mode = "smart";
    query = ex;
    runSmart();
  }

  function runDuration() {
    const parsed = parseDurationList(`${durValue} ${durFrom}`);
    if (!parsed) {
      result = { type: "error", message: "Enter a valid number to convert." };
      return;
    }
    result = answerDurationConvert(parsed, durTo === "all" ? null : unitById(durTo));
  }

  function runDateMath() {
    const dur = parseDurationList(dmDuration);
    if (!dur) {
      result = { type: "error", message: 'Couldn\'t read that duration. Try "4 weeks 2 days 13 hours".' };
      return;
    }
    result = answerDateMath(dur, dmDirection, dmDate.replace("T", " "), placeFromOption(dmPlace));
  }

  function runZones() {
    const when = `${znDate} ${znTime}`.trim();
    result = answerZoneConvert(when, placeFromOption(znFrom), placeFromOption(znTo));
  }

  const inputCls =
    "bg-black/25 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-sky-400/50 transition-colors";
  const selectCls =
    "bg-white/5 border border-white/10 rounded-lg px-2.5 py-2 text-white text-[11px] font-semibold outline-none cursor-pointer hover:bg-white/8";
  const runBtnCls =
    "flex items-center justify-center gap-1.5 px-4 py-2 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 border border-sky-500/30 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all active:scale-95 cursor-pointer";
</script>

<div
  class="converter-tab animated-pane flex flex-col h-full p-4 md:p-6 w-full max-w-4xl mx-auto gap-4 overflow-y-auto scroll-container"
>
  <!-- Mode pills -->
  <div class="flex flex-wrap gap-1.5 shrink-0">
    {#each MODES as m}
      <button
        class="mode-pill text-[10px]"
        class:active={mode === m.id}
        onclick={() => (mode = m.id)}
        role="tab"
        aria-selected={mode === m.id}
      >
        <m.icon size={11} />
        <span>{m.label}</span>
      </button>
    {/each}
  </div>

  <!-- SMART QUERY -->
  {#if mode === "smart"}
    <div class="shrink-0 flex flex-col gap-2.5">
      <div class="flex items-center gap-2 border border-white/8 bg-black/20 px-3 py-2.5 rounded-xl focus-within:border-sky-400/40 transition-colors">
        <Sparkles size={15} class="text-sky-400/70 shrink-0" />
        <input
          type="text"
          placeholder='Ask anything... e.g. "2pm in beijing is what in tulsa time?"'
          bind:value={query}
          onkeydown={(e) => e.key === "Enter" && runSmart()}
          class="bg-transparent border-none text-xs text-white outline-none flex-1"
          aria-label="Time conversion query"
        />
        <button class={runBtnCls} onclick={runSmart}>
          <CornerDownLeft size={11} /> Ask
        </button>
      </div>

      <div class="flex flex-wrap gap-1.5">
        {#each EXAMPLES as ex}
          <button
            class="text-[9px] font-mono text-white/45 hover:text-sky-400 border border-white/8 hover:border-sky-400/30 bg-white/2 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
            onclick={() => runExample(ex)}
          >
            {ex}
          </button>
        {/each}
      </div>
    </div>
  {/if}

  <!-- DURATION CONVERTER -->
  {#if mode === "duration"}
    <div class="shrink-0 border border-white/5 bg-black/20 rounded-xl p-4 flex flex-wrap items-end gap-3">
      <div class="flex flex-col gap-1 flex-1 min-w-[140px]">
        <span class="text-[9px] uppercase font-bold text-white/40 tracking-wider">Amount</span>
        <input type="text" inputmode="decimal" bind:value={durValue} class={inputCls} onkeydown={(e) => e.key === "Enter" && runDuration()} aria-label="Duration amount" />
      </div>
      <div class="flex flex-col gap-1">
        <span class="text-[9px] uppercase font-bold text-white/40 tracking-wider">From</span>
        <select bind:value={durFrom} class={selectCls} aria-label="From unit">
          {#each UNITS as u}<option value={u.id}>{u.label}</option>{/each}
        </select>
      </div>
      <ArrowRightLeft size={14} class="text-white/30 mb-2.5" />
      <div class="flex flex-col gap-1">
        <span class="text-[9px] uppercase font-bold text-white/40 tracking-wider">To</span>
        <select bind:value={durTo} class={selectCls} aria-label="To unit">
          <option value="all">All units</option>
          {#each UNITS as u}<option value={u.id}>{u.label}</option>{/each}
        </select>
      </div>
      <button class={runBtnCls} onclick={runDuration}>Convert</button>
    </div>
  {/if}

  <!-- DATE MATH -->
  {#if mode === "datemath"}
    <div class="shrink-0 border border-white/5 bg-black/20 rounded-xl p-4 flex flex-wrap items-end gap-3">
      <div class="flex flex-col gap-1 flex-1 min-w-[170px]">
        <span class="text-[9px] uppercase font-bold text-white/40 tracking-wider">Duration</span>
        <input type="text" placeholder="4 weeks 2 days 13 hours" bind:value={dmDuration} class={inputCls} aria-label="Duration to add or subtract" />
      </div>
      <div class="flex flex-col gap-1">
        <span class="text-[9px] uppercase font-bold text-white/40 tracking-wider">Direction</span>
        <select bind:value={dmDirection} class={selectCls} aria-label="Before or after">
          <option value="after">After</option>
          <option value="before">Before</option>
        </select>
      </div>
      <div class="flex flex-col gap-1">
        <span class="text-[9px] uppercase font-bold text-white/40 tracking-wider">Date & Time</span>
        <input type="datetime-local" bind:value={dmDate} class={inputCls} aria-label="Base date and time" />
      </div>
      <div class="flex flex-col gap-1">
        <span class="text-[9px] uppercase font-bold text-white/40 tracking-wider">Timezone</span>
        <select bind:value={dmPlace} class={selectCls} aria-label="Timezone of the base date">
          {#each CITY_OPTIONS as c}<option value={c.tz}>{c.label}</option>{/each}
        </select>
      </div>
      <button class={runBtnCls} onclick={runDateMath}>Compute</button>
    </div>
  {/if}

  <!-- TIME ZONES -->
  {#if mode === "zones"}
    <div class="shrink-0 border border-white/5 bg-black/20 rounded-xl p-4 flex flex-wrap items-end gap-3">
      <div class="flex flex-col gap-1">
        <span class="text-[9px] uppercase font-bold text-white/40 tracking-wider">Time</span>
        <input type="time" bind:value={znTime} class={inputCls} aria-label="Time to convert" />
      </div>
      <div class="flex flex-col gap-1">
        <span class="text-[9px] uppercase font-bold text-white/40 tracking-wider">Date (optional)</span>
        <input type="date" bind:value={znDate} class={inputCls} aria-label="Date to convert" />
      </div>
      <div class="flex flex-col gap-1">
        <span class="text-[9px] uppercase font-bold text-white/40 tracking-wider">In</span>
        <select bind:value={znFrom} class={selectCls} aria-label="Source timezone">
          {#each CITY_OPTIONS as c}<option value={c.tz}>{c.label}</option>{/each}
        </select>
      </div>
      <ArrowRightLeft size={14} class="text-white/30 mb-2.5" />
      <div class="flex flex-col gap-1">
        <span class="text-[9px] uppercase font-bold text-white/40 tracking-wider">Becomes</span>
        <select bind:value={znTo} class={selectCls} aria-label="Target timezone">
          {#each CITY_OPTIONS as c}<option value={c.tz}>{c.label}</option>{/each}
        </select>
      </div>
      <button class={runBtnCls} onclick={runZones}>Convert</button>
    </div>
  {/if}

  <!-- RESULTS -->
  <div class="flex-1 min-h-[200px]">
    {#if !result}
      <div class="h-full flex flex-col items-center justify-center text-center border border-white/5 bg-black/15 rounded-2xl p-6 select-none">
        <ArrowRightLeft size={22} class="text-white/10 mb-2" />
        <p class="text-xs text-white/30 italic max-w-sm">
          Convert durations across units, add or subtract time from any date, and translate clock times between world timezones.
        </p>
      </div>
    {:else if result.type === "error"}
      <div class="border border-red-400/20 bg-red-400/5 rounded-2xl p-5">
        <p class="text-xs text-red-300/90 leading-relaxed">{result.message}</p>
      </div>
    {:else if result.type === "convert"}
      <div class="flex flex-col gap-3">
        <!-- Primary answer -->
        <div class="border border-sky-400/20 bg-sky-400/5 rounded-2xl p-5 text-center">
          <p class="text-[10px] text-white/45 uppercase tracking-wider font-bold mb-1.5">{result.inputLabel}</p>
          {#if result.target}
            <span class="font-mono text-2xl md:text-3xl font-black text-sky-400 break-all">
              {fmtNum(result.target.value)}
            </span>
            <span class="text-xs text-white/60 font-bold ml-2">{result.target.unit.label.toLowerCase()}</span>
          {:else}
            <span class="font-mono text-xl font-black text-sky-400">
              {fmtNum(result.totalMs / 1000)} <span class="text-sm text-white/60">seconds total</span>
            </span>
          {/if}
          <!-- Composite breakdown chips -->
          <div class="flex flex-wrap gap-1.5 justify-center mt-3.5">
            {#if result.breakdown.sign < 0}<span class="text-white/40 text-xs font-mono">−</span>{/if}
            {#each result.breakdown.parts as bp}
              <span class="bg-white/4 border border-white/8 px-2.5 py-1 rounded-lg text-[11px] font-mono">
                <span class="text-white font-bold">{bp.value.toLocaleString("en-US")}</span>
                <span class="text-white/45 ml-1">{bp.unit.short}</span>
              </span>
            {/each}
          </div>
        </div>

        <!-- All units table -->
        <div class="border border-white/5 bg-black/15 rounded-2xl p-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-1.5">
            {#each result.rows as row}
              <div
                class="flex items-baseline justify-between gap-3 px-2 py-1 rounded-md {row.isTarget ? 'bg-sky-400/10 border border-sky-400/20' : ''}"
              >
                <span class="text-[10px] uppercase font-bold tracking-wider {row.isTarget ? 'text-sky-400' : 'text-white/40'}">{row.unit.label}</span>
                <span class="font-mono text-[11px] {row.isTarget ? 'text-sky-300 font-bold' : 'text-white/75'} text-right break-all">{fmtNum(row.value)}</span>
              </div>
            {/each}
          </div>
          <p class="text-[9px] text-white/25 mt-3 text-center">
            Months and years use Gregorian averages — 30.436875 days per month, 365.2425 days per year.
          </p>
        </div>
      </div>
    {:else if result.type === "zone"}
      <div class="flex flex-col gap-3">
        <div class="border border-sky-400/20 bg-sky-400/5 rounded-2xl p-5 text-center">
          <p class="text-[10px] text-white/45 uppercase tracking-wider font-bold mb-1.5">
            {result.src.time} in {result.src.label} ({result.src.abbrev}, {result.src.offset})
          </p>
          <span class="font-mono text-2xl md:text-3xl font-black text-sky-400">{result.tgt.time}</span>
          <span class="text-xs text-white/60 font-bold ml-2">in {result.tgt.label}</span>
          <p class="text-[11px] text-white/50 mt-2 font-mono">
            {result.tgt.date} · {result.tgt.abbrev} ({result.tgt.offset})
            <span
              class="ml-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider {result.dayNote === 'same day'
                ? 'bg-white/5 text-white/40'
                : 'bg-amber-400/10 text-amber-300 border border-amber-400/20'}">{result.dayNote}</span
            >
          </p>
        </div>
        <div class="border border-white/5 bg-black/15 rounded-2xl p-4 flex flex-col gap-1.5 text-[11px] font-mono">
          <div class="flex justify-between gap-4"><span class="text-white/35 uppercase text-[9px] font-bold tracking-wider pt-0.5">Source</span><span class="text-white/75 text-right">{result.src.date} · {result.src.time} ({result.src.abbrev})</span></div>
          <div class="flex justify-between gap-4"><span class="text-white/35 uppercase text-[9px] font-bold tracking-wider pt-0.5">Your local</span><span class="text-white/75 text-right">{result.local}</span></div>
          <div class="flex justify-between gap-4"><span class="text-white/35 uppercase text-[9px] font-bold tracking-wider pt-0.5">UTC</span><span class="text-white/75 text-right">{result.utc}</span></div>
        </div>
      </div>
    {:else if result.type === "datemath"}
      <div class="flex flex-col gap-3">
        <div class="border border-sky-400/20 bg-sky-400/5 rounded-2xl p-5 text-center">
          <p class="text-[10px] text-white/45 uppercase tracking-wider font-bold mb-1.5">
            {result.durationLabel} {result.direction} {result.base}
          </p>
          <span class="font-mono text-xl md:text-2xl font-black text-sky-400">{result.resultZoned}</span>
          <p class="text-[11px] text-white/50 mt-1.5">{result.placeLabel} ({result.tz})</p>
        </div>
        <div class="border border-white/5 bg-black/15 rounded-2xl p-4 flex flex-col gap-1.5 text-[11px] font-mono">
          {#if !result.sameZoneAsLocal}
            <div class="flex justify-between gap-4"><span class="text-white/35 uppercase text-[9px] font-bold tracking-wider pt-0.5">Your local</span><span class="text-white/75 text-right">{result.resultLocal}</span></div>
          {/if}
          <div class="flex justify-between gap-4"><span class="text-white/35 uppercase text-[9px] font-bold tracking-wider pt-0.5">UTC</span><span class="text-white/75 text-right">{result.resultUtc}</span></div>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .mode-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 9999px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    background: transparent;
    color: rgba(255, 255, 255, 0.45);
    cursor: pointer;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    white-space: nowrap;
    transition: all 0.2s ease;
  }

  .mode-pill:hover {
    color: white;
    background: rgba(255, 255, 255, 0.03);
  }

  .mode-pill.active {
    color: white;
    background: rgba(56, 189, 248, 0.15);
    border-color: rgba(56, 189, 248, 0.3);
  }

  .scroll-container {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
  }
  .scroll-container::-webkit-scrollbar {
    width: 5px;
  }
  .scroll-container::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  select option {
    background: #0f0f15;
    color: white;
  }

  /* Native pickers on dark background */
  input[type="datetime-local"]::-webkit-calendar-picker-indicator,
  input[type="date"]::-webkit-calendar-picker-indicator,
  input[type="time"]::-webkit-calendar-picker-indicator {
    filter: invert(0.6);
    cursor: pointer;
  }
</style>
