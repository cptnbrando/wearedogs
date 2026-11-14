<script>
  import { onMount } from 'svelte';
  import { Share2, Smartphone, Wifi, WifiOff, Plus, Send, File, X, Radio } from 'lucide-svelte';
  import { detectPlatform, supportsFileShare, canShareFile, shareNearby, formatBytes } from './nearbyShare.js';
  import './dropTrain.scss';

  /** Switches Data Train to Air Train for files the share sheet refuses. */
  export let onUseAir = () => {};

  const MAX_TEXT_LENGTH = 16000;
  const MAX_STAGED = 50;
  const TEXT_PLACEHOLDER = 'A link, a note, an address…';
  const FULL_LIST = 'That is a full load. Send these before adding more.';
  const platform = detectPlatform();
  let canFiles = false;
  let canText = false;
  let checked = false;
  let staged = [];
  let nextId = 0;
  let draft = '';
  let notice = '';
  let actionError = '';
  let fileInput;
  $: shareable = staged.filter(entry => entry.ok);
  $: refused = staged.length - shareable.length;
  $: statusLabel = !checked ? 'Checking this browser…' : canFiles ? platform.service + ' ready' : canText ? 'Text only in this browser' : 'Not available in this browser';

  onMount(() => {
    canFiles = supportsFileShare();
    canText = !!navigator.share;
    checked = true;
  });

  function addFiles(event) {
    const files = Array.prototype.slice.call(event.target.files || []);
    event.target.value = '';
    actionError = '';
    notice = '';
    files.forEach(file => {
      const duplicate = staged.some(entry => entry.file.name === file.name && entry.file.size === file.size && entry.file.lastModified === file.lastModified);
      if (duplicate) return;
      if (staged.length >= MAX_STAGED) {
        actionError = FULL_LIST;
        return;
      }
      nextId += 1;
      staged = staged.concat({ id: nextId, file, ok: canShareFile(file) });
    });
  }

  /** Runs straight from the tap so the browser keeps the gesture the share sheet needs. */
  async function send(payload, done) {
    actionError = '';
    notice = '';
    try {
      const result = await shareNearby(payload);
      if (result !== 'shared') return;
      notice = 'Handed to the share sheet. Accept it on the other device.';
      done();
    } catch (error) {
      actionError = error.message;
    }
  }

  function sendFiles() {
    if (!shareable.length) return;
    send({ files: shareable.map(entry => entry.file) }, () => {});
  }

  function sendText(event) {
    event.preventDefault();
    const message = draft;
    if (!message.trim()) return;
    send({ text: message }, () => { if (draft === message) draft = ''; });
  }
</script>

<section class="dt-air dt-drop w-full flex flex-col sm:flex-col md:flex-col lg:flex-col xl:flex-col 2xl:flex-col" aria-label="Drop Train">
  <header class="dt-air-header">
    <div class="dt-heading"><Share2 size={19} aria-hidden="true" /><h2>Drop Train</h2><span>AirDrop & Quick Share. No internet.</span></div>
    <div class="dt-connection" class:dt-online={canFiles} role="status"><i></i>{statusLabel}</div>
  </header>

  {#if actionError}<p class="dt-error" role="alert">{actionError}</p>{/if}
  {#if notice}<p class="dt-notice" role="status">{notice}</p>{/if}

  {#if checked && !canFiles && !canText}
    <div class="dt-pair-grid">
      <div class="dt-pair-message"><WifiOff size={40} /><h3>This browser can't reach AirDrop or Quick Share.</h3>
        <p>Open Data Train in Safari on an iPhone, iPad or Mac, or in Chrome or Edge on Android, Windows or a Chromebook. Air Train works everywhere else.</p>
        <button class="dt-primary" onclick={onUseAir}><Radio size={16} />Use Air Train</button>
      </div>
    </div>
  {:else}
    <div class="dt-pair-grid" class:dt-drop-loaded={staged.length > 0}>
      <div class="dt-pair-intro">
        <div class="dt-device-symbols" aria-hidden="true"><Smartphone size={30} /><Wifi size={22} /><Smartphone size={30} /></div>
        <h3>No pairing.<br />Just nearby.</h3>
        <p class="dt-lead">Send to {platform.target} with {platform.service}. Files go device to device over Bluetooth and peer-to-peer Wi-Fi. This page never sees them.</p>
        <ol class="dt-steps">
          <li><span>1</span>Choose files or write a note.</li>
          <li><span>2</span>Tap Send, then pick {platform.service}.</li>
          <li><span>3</span>Choose the nearby device. Accept it there.</li>
        </ol>
        <p class="dt-pair-help">{platform.receive}</p>
      </div>
      <div class="dt-pair-action dt-drop-action">
        {#if canFiles}
          <div class="dt-drop-row">
            <button class={staged.length ? 'dt-secondary' : 'dt-primary'} onclick={() => fileInput.click()}><Plus size={17} />Choose files</button>
            {#if staged.length}<button class="dt-quiet" onclick={() => { staged = []; notice = ''; actionError = ''; }}>Clear</button>{/if}
            <input class="dt-file-input" bind:this={fileInput} type="file" multiple aria-label="Choose files to send nearby" onchange={addFiles} />
          </div>
          {#if staged.length}
            <ul class="dt-drop-list" aria-label="Files ready to send">
              {#each staged as entry (entry.id)}
                <li class:dt-drop-refused={!entry.ok}>
                  <File size={16} aria-hidden="true" />
                  <div class="dt-transfer-name"><strong title={entry.file.name}>{entry.file.name}</strong><span>{formatBytes(entry.file.size)}{entry.ok ? '' : ' · this browser won\'t share this type'}</span></div>
                  <button class="dt-icon-button" onclick={() => staged = staged.filter(item => item.id !== entry.id)} aria-label={'Remove ' + entry.file.name}><X size={15} /></button>
                </li>
              {/each}
            </ul>
            <button class="dt-primary dt-drop-send" disabled={!shareable.length} onclick={sendFiles}><Send size={17} />Send {shareable.length} {shareable.length === 1 ? 'file' : 'files'} with {platform.service}</button>
            {#if refused}<p class="dt-drop-refused-note">{refused === 1 ? 'One file needs' : refused + ' files need'} Air Train instead. <button onclick={onUseAir}>Open Air Train →</button></p>{/if}
          {/if}
        {:else if checked}
          <p class="dt-drop-refused-note">This browser shares text only. For files, <button onclick={onUseAir}>use Air Train →</button></p>
        {/if}
        {#if canText}
          <form class="dt-text-form dt-drop-text" onsubmit={sendText}>
            <label for="drop-text">{canFiles ? 'Or send a note' : 'Send a note nearby'}</label>
            <div class="dt-input-row"><textarea id="drop-text" bind:value={draft} maxlength={MAX_TEXT_LENGTH} rows="2" placeholder={TEXT_PLACEHOLDER}></textarea><button class="dt-secondary" type="submit" disabled={!draft.trim()} aria-label="Send note nearby"><Send size={18} /><span>Send</span></button></div>
          </form>
        {/if}
      </div>
    </div>
  {/if}
  <footer class="dt-footnote"><span><Wifi size={13} />No pairing link, no account · works without internet.</span></footer>
</section>
