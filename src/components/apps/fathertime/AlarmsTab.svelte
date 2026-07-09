<script>
  import { onMount, onDestroy } from "svelte";
  import { Plus, Trash2, AlarmClock, Bell, BellOff } from "lucide-svelte";

  let alarms = $state([]);
  let newAlarmTime = $state("07:00");
  let newAlarmLabel = $state("Alarm");
  let newAlarmDays = $state([true, true, true, true, true, true, true]); // Mon-Sun
  const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

  let activeAlarmFired = $state(null); // The alarm that is currently ringing
  let checkInterval = null;
  let alarmSoundCtx = null;
  let alarmOscillatorInterval = null;

  function loadAlarms() {
    try {
      const stored = localStorage.getItem("father_time_alarms");
      if (stored) {
        alarms = JSON.parse(stored);
      } else {
        // Sample default alarm
        alarms = [
          { id: 1, time: "07:30", label: "Morning Wakeup", active: true, days: [true, true, true, true, true, false, false] }
        ];
        saveAlarms();
      }
    } catch (e) {
      console.error(e);
    }
  }

  function saveAlarms() {
    try {
      localStorage.setItem("father_time_alarms", JSON.stringify(alarms));
    } catch (e) {
      console.error(e);
    }
  }

  function addAlarm() {
    if (!newAlarmTime) return;
    const newAlarm = {
      id: Date.now(),
      time: newAlarmTime,
      label: newAlarmLabel || "Alarm",
      active: true,
      days: [...newAlarmDays]
    };
    alarms.push(newAlarm);
    alarms.sort((a, b) => a.time.localeCompare(b.time));
    saveAlarms();
    newAlarmLabel = "Alarm";
  }

  function deleteAlarm(id) {
    alarms = alarms.filter(a => a.id !== id);
    saveAlarms();
  }

  function toggleAlarmActive(alarm) {
    alarm.active = !alarm.active;
    saveAlarms();
  }

  function toggleDay(index) {
    newAlarmDays[index] = !newAlarmDays[index];
  }

  // Active checking loop to see if an alarm matches the current time
  function startAlarmChecker() {
    checkInterval = setInterval(() => {
      if (activeAlarmFired) return; // already ringing

      const now = new Date();
      const currentHours = now.getHours().toString().padStart(2, "0");
      const currentMins = now.getMinutes().toString().padStart(2, "0");
      const currentHHMM = `${currentHours}:${currentMins}`;
      
      // JavaScript getDay(): 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      // Our days array mapping: 0 = Mon, 1 = Tue, ..., 5 = Sat, 6 = Sun
      let dayIndex = now.getDay() - 1;
      if (dayIndex === -1) dayIndex = 6; // Sunday index fix

      alarms.forEach(alarm => {
        if (alarm.active && alarm.time === currentHHMM && alarm.days[dayIndex]) {
          // If we haven't checked/fired this exact alarm recently
          if (!alarm.lastFiredDate || alarm.lastFiredDate !== now.getDate()) {
            fireAlarm(alarm);
          }
        }
      });
    }, 5000); // Check every 5s
  }

  function fireAlarm(alarm) {
    alarm.lastFiredDate = new Date().getDate();
    activeAlarmFired = alarm;
    playAlarmSound();
  }

  function playAlarmSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      alarmSoundCtx = new AudioCtx();
      let state = true;

      alarmOscillatorInterval = setInterval(() => {
        if (!activeAlarmFired || !alarmSoundCtx) {
          clearInterval(alarmOscillatorInterval);
          return;
        }

        const osc = alarmSoundCtx.createOscillator();
        const gainNode = alarmSoundCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(alarmSoundCtx.destination);

        // alternating alarm chime frequencies
        const freq = state ? 800 : 1000;
        state = !state;

        osc.frequency.setValueAtTime(freq, alarmSoundCtx.currentTime);
        gainNode.gain.setValueAtTime(0.5, alarmSoundCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, alarmSoundCtx.currentTime + 0.25);

        osc.start();
        osc.stop(alarmSoundCtx.currentTime + 0.3);
      }, 350);
    } catch (e) {
      console.error(e);
    }
  }

  function stopAlarm() {
    activeAlarmFired = null;
    if (alarmOscillatorInterval) clearInterval(alarmOscillatorInterval);
    if (alarmSoundCtx) {
      alarmSoundCtx.close();
      alarmSoundCtx = null;
    }
  }

  function snoozeAlarm() {
    if (!activeAlarmFired) return;
    const current = activeAlarmFired;
    stopAlarm();

    // Schedule a temporary snooze alarm 5 minutes later
    const snoozeTime = new Date(Date.now() + 5 * 60 * 1000);
    const snoozeHours = snoozeTime.getHours().toString().padStart(2, "0");
    const snoozeMins = snoozeTime.getMinutes().toString().padStart(2, "0");

    const snoozeAlarmObj = {
      id: Date.now(),
      time: `${snoozeHours}:${snoozeMins}`,
      label: `Snooze: ${current.label}`,
      active: true,
      days: [true, true, true, true, true, true, true], // Trigger today
      isSnoozeOnly: true
    };

    alarms.push(snoozeAlarmObj);
    saveAlarms();
  }

  onMount(() => {
    loadAlarms();
    startAlarmChecker();
  });

  onDestroy(() => {
    clearInterval(checkInterval);
    if (alarmOscillatorInterval) clearInterval(alarmOscillatorInterval);
    if (alarmSoundCtx) alarmSoundCtx.close();
  });
</script>

<div class="alarms-tab animated-pane flex flex-col p-4 md:p-6 w-full max-w-3xl mx-auto gap-4 relative">
  
  <!-- Add Alarm Box -->
  <div class="border border-white/5 bg-black/25 p-4 rounded-xl w-full">
    <h3 class="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
      <AlarmClock size={14} class="text-red-400" />
      Create New Alarm
    </h3>
    
    <div class="flex flex-col md:flex-row items-center gap-4">
      <div class="flex items-center gap-3 w-full md:w-auto">
        <input 
          type="time" 
          bind:value={newAlarmTime} 
          class="alarm-time-input"
          aria-label="Alarm time input"
        />
        <input 
          type="text" 
          placeholder="Alarm Tag Label" 
          bind:value={newAlarmLabel} 
          class="alarm-label-input"
          aria-label="Alarm text tag"
        />
      </div>

      <!-- Day Toggles -->
      <div class="flex items-center gap-1.5 w-full md:w-auto justify-center md:justify-start">
        {#each DAY_LABELS as label, idx}
          <button 
            class="day-btn" 
            class:active={newAlarmDays[idx]}
            onclick={() => toggleDay(idx)}
            aria-label={`Toggle alarm for ${label}`}
          >
            {label}
          </button>
        {/each}
      </div>

      <button 
        class="add-alarm-btn w-full md:w-auto md:ml-auto"
        onclick={addAlarm}
      >
        <Plus size={16} />
        <span>ADD</span>
      </button>
    </div>
  </div>

  <!-- Alarms List -->
  <div class="flex-1 w-full overflow-y-auto border border-white/5 bg-black/25 rounded-xl p-4 scroll-container relative min-h-[140px]">
    {#if alarms.length === 0}
      <div class="absolute inset-0 flex items-center justify-center text-xs text-white/30 italic">
        No alarms set. Set a time and click ADD above.
      </div>
    {:else}
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {#each alarms as alarm (alarm.id)}
          <div class="alarm-card flex flex-col justify-between p-3 rounded-lg border border-white/5 bg-white/2" class:dim={!alarm.active}>
            <div class="flex items-start justify-between">
              <div>
                <span class="alarm-time-display font-mono text-2xl font-bold">{alarm.time}</span>
                <p class="text-[10px] text-white/40 mt-0.5 truncate max-w-[150px]">{alarm.label}</p>
              </div>
              <div class="flex items-center gap-2">
                <button 
                  class="toggle-switch" 
                  class:on={alarm.active} 
                  onclick={() => toggleAlarmActive(alarm)}
                  aria-label="Toggle alarm status"
                >
                  <span class="switch-handle"></span>
                </button>
                <button 
                  class="p-1 hover:text-red-400 text-white/40 transition-colors"
                  onclick={() => deleteAlarm(alarm.id)}
                  aria-label="Delete alarm"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            <!-- Active days layout -->
            <div class="flex gap-1.5 mt-3 border-t border-white/5 pt-2">
              {#each DAY_LABELS as label, idx}
                <span class="text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border
                      {alarm.days[idx] ? 'text-red-400 border-red-500/30' : 'text-white/20 border-transparent'}"
                >
                  {label}
                </span>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Alarm Fired Overlay -->
  {#if activeAlarmFired}
    <div class="alarm-alert-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md">
      <div class="alarm-modal p-8 border border-red-500/25 bg-[#0f0f15] rounded-2xl flex flex-col items-center max-w-sm w-full mx-4 shadow-2xl shadow-red-500/10">
        <div class="pulse-alarm-icon w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-6">
          <Bell size={32} class="text-red-400 animate-bounce" />
        </div>
        
        <span class="font-mono text-5xl font-extrabold text-white tracking-widest mb-2">{activeAlarmFired.time}</span>
        <h4 class="text-xs uppercase tracking-wider text-red-400 font-bold mb-6">{activeAlarmFired.label}</h4>

        <div class="flex gap-4 w-full">
          <button 
            class="alarm-action-btn snooze w-1/2"
            onclick={snoozeAlarm}
          >
            SNOOZE
          </button>
          <button 
            class="alarm-action-btn stop w-1/2"
            onclick={stopAlarm}
          >
            STOP
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .alarm-time-input {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    padding: 8px 12px;
    color: white;
    font-family: monospace;
    font-size: 0.95rem;
    outline: none;
    cursor: pointer;
  }

  .alarm-time-input:focus,
  .alarm-label-input:focus {
    border-color: rgba(239, 68, 68, 0.45);
    background: rgba(255, 255, 255, 0.06);
  }

  .alarm-label-input {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    padding: 8px 12px;
    color: white;
    font-size: 0.82rem;
    outline: none;
  }

  .day-btn {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.45);
    font-size: 0.72rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .day-btn:hover {
    color: white;
    border-color: rgba(255, 255, 255, 0.2);
  }

  .day-btn.active {
    background: rgba(239, 68, 68, 0.15);
    border-color: rgba(239, 68, 68, 0.35);
    color: #ef4444;
  }

  .add-alarm-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 8px 18px;
    border-radius: 8px;
    background: rgba(239, 68, 68, 0.15);
    border: 1px solid rgba(239, 68, 68, 0.35);
    color: #ef4444;
    cursor: pointer;
    font-weight: 700;
    font-size: 0.8rem;
    transition: all 0.2s ease;
  }

  .add-alarm-btn:hover {
    background: rgba(239, 68, 68, 0.25);
    box-shadow: 0 0 12px rgba(239, 68, 68, 0.2);
  }

  .alarm-card {
    transition: opacity 0.2s ease, border-color 0.2s ease;
  }

  .alarm-card.dim {
    opacity: 0.45;
  }

  .alarm-time-display {
    color: white;
  }

  .toggle-switch {
    width: 32px;
    height: 18px;
    border-radius: 9px;
    background: rgba(255, 255, 255, 0.1);
    position: relative;
    cursor: pointer;
    border: none;
    outline: none;
    transition: background 0.2s ease;
  }

  .toggle-switch.on {
    background: #ef4444;
  }

  .switch-handle {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: white;
    position: absolute;
    top: 2px;
    left: 2px;
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .toggle-switch.on .switch-handle {
    transform: translateX(14px);
  }

  .alarm-action-btn {
    padding: 12px;
    border-radius: 10px;
    font-size: 0.85rem;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .alarm-action-btn.snooze {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.8);
  }

  .alarm-action-btn.snooze:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }

  .alarm-action-btn.stop {
    background: rgba(239, 68, 68, 0.15);
    border: 1px solid rgba(239, 68, 68, 0.35);
    color: #ef4444;
  }

  .alarm-action-btn.stop:hover {
    background: rgba(239, 68, 68, 0.25);
    box-shadow: 0 0 15px rgba(239, 68, 68, 0.25);
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
</style>
