<script>
  import { onMount, tick } from 'svelte';
  import { X, Copy, Download, QrCode, ArrowRight } from 'lucide-svelte';
  import { decodeSave, summarizeSave } from './dogsIncSaveCode.js';
  import { createSaveLink } from './saveLink.js';
  import { formatMoney } from './dogsIncEngine.js';
  import { copyText } from '../../../lib/clipboard.js';

  /** @type {object} engine snapshot (for "your company on this device") */
  export let snap;
  /** @type {() => string} transfer code for the company right now */
  export let getCode;
  /** @type {(state: object) => void} replaces this device's company */
  export let onImport;
  /** @type {() => void} */
  export let onClose;
  /** @type {string|null} code from a scanned link, offered for import on open */
  export let incomingCode = null;

  const QR_OPTIONS = { width: 240, margin: 2, errorCorrectionLevel: 'M' };
  const TEXT = {
    sendTitle: 'Move your company',
    sendLead: "Scan this with your other device's camera. It opens DOGS INC there with this company.",
    sendNote: 'It carries your company as it is right now. Play on one device at a time.',
    copy: 'Copy save link',
    copied: 'Link copied. Open it on your other device, or send it with Data Train.',
    copyFailed: 'Copy is unavailable here. Select the link below and copy it.',
    receive: 'Load a save instead',
    receiveTitle: 'Load a company',
    receiveLead: 'Paste a save link or code from your other device.',
    receivePlaceholder: 'Paste the link or code',
    load: 'Load',
    back: 'Show my QR code',
    confirmTitle: 'Load this company?',
    confirmLead: 'It replaces the company on this device. This cannot be undone.',
    incoming: 'Incoming',
    current: 'On this device',
    accept: 'Load it',
    keep: 'Keep mine',
    invalid: "That isn't a DOGS INC save link or code. Copy it again from the other device.",
    qrFailed: 'Could not draw the QR code. Use Copy save link instead.',
    done: 'Company loaded. Welcome back to the office.',
    backToWork: 'Back to work',
    doneTitle: 'Company moved in',
  };

  let view = 'send';
  let qrImage = '';
  let link = '';
  let pasted = '';
  let incoming = null;
  let notice = '';
  let error = '';
  let closeButton;

  onMount(async () => {
    if (incomingCode) showIncoming(incomingCode);
    else await showSend();
    await tick();
    if (closeButton) closeButton.focus();
  });

  /** Draws the QR for the company as it is at this moment. */
  async function showSend() {
    view = 'send';
    error = '';
    notice = '';
    link = createSaveLink(getCode());
    try {
      const QRCode = (await import('qrcode')).default;
      qrImage = await QRCode.toDataURL(link, QR_OPTIONS);
    } catch (err) {
      error = TEXT.qrFailed;
    }
  }

  /** @param {string} code */
  function showIncoming(code) {
    incoming = decodeSave(code);
    notice = '';
    error = incoming ? '' : TEXT.invalid;
    view = incoming ? 'confirm' : 'receive';
  }

  async function copyLink() {
    notice = '';
    error = '';
    if (await copyText(link)) notice = TEXT.copied;
    else error = TEXT.copyFailed;
  }

  function submitPaste(event) {
    event.preventDefault();
    showIncoming(pasted);
  }

  function accept() {
    onImport(incoming);
    incoming = null;
    notice = TEXT.done;
    view = 'done';
  }

  /** @param {number} count @param {string} word @returns {string} e.g. 1 floor, 3 floors */
  const plural = (count, word) => count + ' ' + word + (count === 1 ? '' : 's');

  const handleKey = (event) => {
    if (event.key === 'Escape') onClose();
  };

  $: mine = summarizeSave({ cash: snap.cash, goalsDone: snap.goalsDone, owned: snap.owned });
  $: theirs = incoming ? summarizeSave(incoming) : null;
</script>

<svelte:window onkeydown={handleKey} />

<div class="dogsinc-transfer-layer">
  <button type="button" class="dogsinc-transfer-scrim" tabindex="-1" aria-label="Close" onclick={onClose}></button>
  <div class="dogsinc-transfer" role="dialog" aria-modal="true" aria-labelledby="dogsinc-transfer-title">
    <div class="dogsinc-transfer-head">
      <h3 id="dogsinc-transfer-title">
        {view === 'receive' ? TEXT.receiveTitle : view === 'confirm' ? TEXT.confirmTitle : view === 'done' ? TEXT.doneTitle : TEXT.sendTitle}
      </h3>
      <button type="button" class="dogsinc-transfer-x" bind:this={closeButton} onclick={onClose} aria-label="Close"><X size={16} /></button>
    </div>

    {#if view === 'send'}
      <p class="dogsinc-transfer-lead">{TEXT.sendLead}</p>
      <div class="dogsinc-transfer-qr">
        {#if qrImage}<img src={qrImage} width="240" height="240" alt="QR code that opens DOGS INC with this company on another device" />{/if}
      </div>
      <button type="button" class="dogsinc-transfer-primary" onclick={copyLink}><Copy size={15} />{TEXT.copy}</button>
      <p class="dogsinc-transfer-link">{link}</p>
      <p class="dogsinc-transfer-note">{TEXT.sendNote}</p>
      <button type="button" class="dogsinc-transfer-quiet" onclick={() => { view = 'receive'; error = ''; notice = ''; }}>
        <Download size={14} />{TEXT.receive}
      </button>
    {:else if view === 'receive'}
      <p class="dogsinc-transfer-lead">{TEXT.receiveLead}</p>
      <form class="dogsinc-transfer-form" onsubmit={submitPaste}>
        <label class="dogsinc-sr" for="dogsinc-save-input">{TEXT.receiveLead}</label>
        <input id="dogsinc-save-input" bind:value={pasted} placeholder={TEXT.receivePlaceholder} autocomplete="off" spellcheck="false" />
        <button type="submit" class="dogsinc-transfer-primary" disabled={!pasted.trim()}>{TEXT.load}<ArrowRight size={15} /></button>
      </form>
      <button type="button" class="dogsinc-transfer-quiet" onclick={showSend}><QrCode size={14} />{TEXT.back}</button>
    {:else if view === 'confirm' && theirs}
      <p class="dogsinc-transfer-lead">{TEXT.confirmLead}</p>
      <div class="dogsinc-transfer-compare">
        <dl class="is-incoming">
          <dt>{TEXT.incoming}</dt>
          <dd class="dogsinc-transfer-cash">{formatMoney(theirs.cash)}</dd>
          <dd>{plural(theirs.floors, 'floor')} · {theirs.employees} staff</dd>
          <dd>{plural(theirs.missions, 'mission')} done</dd>
        </dl>
        <dl>
          <dt>{TEXT.current}</dt>
          <dd class="dogsinc-transfer-cash">{formatMoney(mine.cash)}</dd>
          <dd>{plural(mine.floors, 'floor')} · {mine.employees} staff</dd>
          <dd>{plural(mine.missions, 'mission')} done</dd>
        </dl>
      </div>
      <div class="dogsinc-transfer-actions">
        <button type="button" class="dogsinc-transfer-primary" onclick={accept}>{TEXT.accept}</button>
        <button type="button" class="dogsinc-transfer-secondary" onclick={onClose}>{TEXT.keep}</button>
      </div>
    {:else if view === 'done'}
      <button type="button" class="dogsinc-transfer-primary" onclick={onClose}>{TEXT.backToWork}</button>
    {/if}

    {#if error}<p class="dogsinc-transfer-error" role="alert">{error}</p>{/if}
    {#if notice}<p class="dogsinc-transfer-notice" role="status">{notice}</p>{/if}
  </div>
</div>

<style lang="scss">
  @use "../../../styles/dogsinc-variables" as *;

  // Floats over the whole game (above the drawer); never moves the tower or click box.
  .dogsinc-transfer-layer {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 8;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
  }

  .dogsinc-transfer-scrim {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 0;
    border: 0;
    background: $dogsinc-scrim;
    cursor: default;
  }

  .dogsinc-transfer {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    width: 100%;
    max-width: 360px;
    max-height: 100%;
    padding: 16px;
    overflow-y: auto;
    border: 1px solid $dogsinc-gold;
    border-radius: 12px;
    background: $dogsinc-drawer-bg;
    color: $dogsinc-ink;
    font-family: $dogsinc-mono;
    font-size: 13px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6), 0 0 18px $dogsinc-gold-glow;
  }

  .dogsinc-transfer-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;

    h3 {
      margin: 0;
      color: $dogsinc-gold;
      font-size: 15px;
      letter-spacing: 0.04em;
    }
  }

  .dogsinc-transfer-x {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    padding: 0;
    border: 1px solid $dogsinc-line;
    border-radius: 8px;
    background: transparent;
    color: $dogsinc-dim;
    cursor: pointer;
  }

  .dogsinc-transfer-lead,
  .dogsinc-transfer-note {
    margin: 0;
    line-height: 1.5;
    color: $dogsinc-dim;
  }

  .dogsinc-transfer-note {
    font-size: 11px;
  }

  .dogsinc-transfer-qr {
    display: flex;
    justify-content: center;
    min-height: 200px;

    img {
      display: block;
      width: 200px;
      height: 200px;
      border-radius: 8px;
      background: $dogsinc-qr-paper;
    }
  }

  .dogsinc-transfer-link {
    margin: 0;
    padding: 6px 8px;
    border-radius: 6px;
    background: $dogsinc-hover-bg;
    color: $dogsinc-dim;
    font-size: 10px;
    word-break: break-all;
    user-select: all;
  }

  .dogsinc-transfer-primary,
  .dogsinc-transfer-secondary,
  .dogsinc-transfer-quiet {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 40px;
    padding: 8px 12px;
    border-radius: 8px;
    font: inherit;
    font-weight: 700;
    cursor: pointer;
  }

  .dogsinc-transfer-primary {
    border: 0;
    background: $dogsinc-gold;
    color: $dogsinc-on-gold;

    &:disabled {
      opacity: 0.5;
      cursor: default;
    }
  }

  .dogsinc-transfer-secondary {
    border: 1px solid $dogsinc-line;
    background: transparent;
    color: $dogsinc-ink;
  }

  .dogsinc-transfer-quiet {
    min-height: 34px;
    border: 0;
    background: transparent;
    color: $dogsinc-dim;
    font-weight: 400;
    text-decoration: underline;
  }

  .dogsinc-transfer-form {
    display: flex;
    gap: 8px;

    input {
      flex: 1;
      min-width: 0;
      padding: 8px 10px;
      border: 1px solid $dogsinc-line;
      border-radius: 8px;
      background: $dogsinc-stage-bg;
      color: $dogsinc-ink;
      font: inherit;
      font-size: 16px; // 16px stops iOS zooming into the field
    }
  }

  .dogsinc-transfer-compare {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;

    dl {
      margin: 0;
      padding: 10px;
      border: 1px solid $dogsinc-line;
      border-radius: 8px;

      &.is-incoming {
        border-color: $dogsinc-gold;
        background: $dogsinc-gold-soft;
      }
    }

    dt {
      margin-bottom: 4px;
      font-size: 10px;
      letter-spacing: 0.12em;
      color: $dogsinc-dim;
      text-transform: uppercase;
    }

    dd {
      margin: 0;
      font-size: 11px;
      line-height: 1.5;
    }
  }

  .dogsinc-transfer-cash {
    color: $dogsinc-gold;
    font-size: 15px !important;
    font-weight: 700;
  }

  .dogsinc-transfer-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .dogsinc-transfer-error,
  .dogsinc-transfer-notice {
    margin: 0;
    font-size: 12px;
    line-height: 1.45;
  }

  .dogsinc-transfer-error {
    color: $dogsinc-frenzy;
  }

  .dogsinc-transfer-notice {
    color: $dogsinc-ink;
  }

  .dogsinc-sr {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  // Short portrait phones: smaller QR, no raw link text, so the card fits without scrolling.
  @media (max-height: 640px) and (orientation: portrait) {
    .dogsinc-transfer {
      padding: 12px;
      gap: 8px;
    }

    .dogsinc-transfer-qr {
      min-height: 0;

      img {
        width: 150px;
        height: 150px;
      }
    }

    .dogsinc-transfer-link {
      display: none;
    }
  }

  // Landscape phones: QR beside the text so the card fits the short screen.
  @media (orientation: landscape) and (max-height: 500px) {
    .dogsinc-transfer {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      align-content: start;
      max-width: 560px;
      padding: 12px;
      gap: 6px 14px;

      > :global(*) {
        grid-column: 2;
      }
    }

    .dogsinc-transfer-head {
      grid-column: 1 / -1 !important;
    }

    .dogsinc-transfer-qr {
      grid-column: 1 !important;
      grid-row: 2 / 7;
      min-height: 0;

      img {
        width: 136px;
        height: 136px;
      }
    }

    .dogsinc-transfer-link,
    .dogsinc-transfer-note {
      display: none;
    }
  }

  // TV / ultra-wide: bigger card and QR so it scans from the couch.
  @media (min-width: $dogsinc-bp-tv) and (min-height: 501px) {
    .dogsinc-transfer {
      max-width: 460px;
      font-size: 16px;
    }

    .dogsinc-transfer-qr img {
      width: 280px;
      height: 280px;
    }
  }
</style>
