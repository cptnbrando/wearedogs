<script>
  import { onMount, tick } from 'svelte';
  import QRCode from 'qrcode';
  import { ArrowUpRight, Link, Copy, RefreshCw, Monitor, Smartphone, Check, X, Plus, Send, Radio, ClipboardPaste, Info } from 'lucide-svelte';
  import { TransferSession } from './transferSession.js';
  import { createPairingLink, parsePairingLink, takePairingLink } from './pairingLink.js';
  import { copyText } from '../../../lib/clipboard.js';
  import TransferList from './TransferList.svelte';

  const MAX_TEXT_LENGTH = 16000;
  const COPY_ERROR = 'Copy is unavailable here. Select the text and copy it manually.';
  const PASTE_EMPTY = 'Your clipboard is empty, or this browser blocked access. Paste into the box instead.';
  const TEXT_PLACEHOLDER = 'Copy and paste anything';
  const HELP_POINTS = [
    'Your browsers find each other through PeerJS, a free pairing service. Files and text then travel device to device, encrypted. Nothing is stored on DOGS servers.',
    'Works on different networks too. If it won\'t connect, turn on your phone\'s hotspot and join your laptop to it.',
    'Up to 100 MB per file, and 200 MB waiting in your inbox.',
    'Save files before you leave. Closing or refreshing the page ends the session.',
  ];
  const QR_OPTIONS = { width: 264, margin: 4, errorCorrectionLevel: 'M' };
  const STATUS_LABELS = {
    idle: 'Ready to pair', starting: 'Preparing your connection…', waiting: 'Waiting for your other device',
    connecting: 'Connecting · approve on the other device', pending: 'Device requesting access',
    connected: 'Connected', disconnected: 'Connection ended',
    error: 'Connection needs attention', unsupported: 'Browser not supported',
  };
  let session;
  let state = { status: 'starting', items: [], code: '', secret: '', peerName: '', busy: false };
  let qrImage = '';
  let pairLink = '';
  let pastedLink = '';
  let draft = '';
  let notice = '';
  let actionError = '';
  let fileInput;
  let disposed = false;
  let currentQrLink = '';
  let mobilePane = 'sent';
  let canPaste = false;
  let helpOpen = false;
  let helpClose;
  $: connected = state.status === 'connected';
  $: sentItems = state.items.filter(item => item.direction === 'sent');
  $: receivedItems = state.items.filter(item => item.direction === 'received');
  $: pairLink = createPairingLink(state.code, state.secret);
  $: if (pairLink && pairLink !== currentQrLink && state.status === 'waiting') drawQr(pairLink);

  onMount(() => {
    canPaste = !!(navigator.clipboard && navigator.clipboard.readText);
    session = new TransferSession({ onChange: next => { if (!disposed) state = next; } });
    const invite = takePairingLink() || parsePairingLink(location.hash);
    if (invite) run(() => session.join(invite.code, invite.secret));
    else run(() => session.host());
    window.addEventListener('hashchange', joinUpdatedLink);
    return () => {
      disposed = true;
      window.removeEventListener('hashchange', joinUpdatedLink);
      session.destroy();
    };
  });

  function joinUpdatedLink() {
    const invite = parsePairingLink(location.hash);
    if (!invite || connected || state.items.length) return;
    history.replaceState(history.state, '', location.pathname + location.search);
    run(() => session.join(invite.code, invite.secret));
  }

  async function drawQr(link) {
    currentQrLink = link;
    try {
      const image = await QRCode.toDataURL(link, QR_OPTIONS);
      if (!disposed && currentQrLink === link) qrImage = image;
    } catch {
      actionError = 'Could not draw the QR code. Use Copy pairing link instead.';
    }
  }

  /** Keep failures local to the action; connection errors come from the session. */
  async function run(action) {
    actionError = '';
    notice = '';
    try { await action(); }
    catch (error) { if (!disposed) actionError = error.message; }
  }

  async function copy(value, label) {
    await run(async () => {
      if (!(await copyText(value))) throw new Error(COPY_ERROR);
      notice = label;
    });
  }

  function joinLink(event) {
    event.preventDefault();
    const invite = parsePairingLink(pastedLink);
    if (!invite) {
      actionError = 'Paste the complete Air Train pairing link, including the part after #.';
      return;
    }
    run(() => session.join(invite.code, invite.secret));
  }

  async function sendFiles(event) {
    const files = Array.prototype.slice.call(event.target.files || []);
    event.target.value = '';
    if (!files.length) return;
    mobilePane = 'sent';
    await run(() => session.sendFiles(files));
  }

  async function sendText(event) {
    event.preventDefault();
    if (!draft.trim() || !connected) return;
    const message = draft;
    await run(async () => {
      const accepted = await session.sendText(message);
      if (!accepted) return;
      if (draft === message) draft = '';
    });
  }

  /** Pull the clipboard into the draft; browsers ask permission on the first tap. */
  async function pasteDraft() {
    await run(async () => {
      const text = await navigator.clipboard.readText();
      if (!text) throw new Error(PASTE_EMPTY);
      draft = text.slice(0, MAX_TEXT_LENGTH);
    });
  }

  async function openHelp() {
    helpOpen = true;
    await tick();
    if (helpClose) helpClose.focus();
  }

  function closeHelp() {
    helpOpen = false;
  }

  function restart() {
    qrImage = '';
    currentQrLink = '';
    run(() => session.host());
  }
</script>

<svelte:window onkeydown={(event) => { if (helpOpen && event.key === 'Escape') closeHelp(); }} />

<section class="dt-air w-full flex flex-col sm:flex-col md:flex-col lg:flex-col xl:flex-col 2xl:flex-col" aria-label="Air Train">
  <header class="dt-air-header">
    <div class="dt-heading"><Radio size={19} aria-hidden="true" /><h2>Air Train</h2><span>Files & text. Both ways.</span></div>
    <div class="dt-connection" class:dt-online={connected} role="status"><i></i>{STATUS_LABELS[state.status] || state.status}</div>
    {#if connected}<button class="dt-quiet dt-disconnect" onclick={() => session.disconnect()}>Disconnect</button>{/if}
    {#if !connected && state.items.length}<button class="dt-quiet dt-disconnect" onclick={restart}>Clear session & reconnect</button>{/if}
  </header>

  {#if state.error || actionError}
    <p class="dt-error" role="alert">{actionError || state.error}</p>
  {/if}
  {#if notice}<p class="dt-notice" role="status">{notice}</p>{/if}

  {#if !connected && !state.items.length}
    <div class="dt-pair-grid">
      <div class="dt-pair-intro">
        <div class="dt-device-symbols" aria-hidden="true"><Monitor size={34} /><span>↔</span><Smartphone size={28} /></div>
        <h3>Your devices.<br />One connection.</h3>
        <p class="dt-lead">That photo on your phone. That track on your laptop. Get them where you want them.</p>
        <ol class="dt-steps">
          <li><span>1</span>Scan with your phone's camera.</li>
          <li><span>2</span>Open the link. Approve on this device.</li>
          <li><span>3</span>Send files or paste text, either way.</li>
        </ol>
        <p class="dt-pair-help">Keep both pages open. Use the same Wi-Fi for the best connection.</p>
      </div>
      <div class="dt-pair-action">
        {#if state.status === 'waiting'}
          {#if qrImage}<img class="dt-qr" src={qrImage} width="264" height="264" alt="Scan this pairing QR code with your other device's camera" />{/if}
          <p class="dt-qr-caption">Scan to connect to this device</p>
          <button class="dt-primary" onclick={() => copy(pairLink, 'Pairing link copied. Open it on your other device.')}><Copy size={16} />Copy pairing link</button>
          <details class="dt-join"><summary>Already have a pairing link?</summary>
            <form onsubmit={joinLink}>
              <label for="train-link">Pairing link from your other device</label>
              <div class="dt-input-row"><input id="train-link" bind:value={pastedLink} placeholder="Paste the full link" autocomplete="off" spellcheck="false" /><button class="dt-secondary" type="submit">Connect</button></div>
            </form>
          </details>
        {:else if state.status === 'pending'}
          <div class="dt-pair-message"><Smartphone size={40} /><h3>Let this device aboard?</h3><p>{state.pendingName || 'Another device'} has your pairing link. Approve only if you just scanned it.</p>
            <div class="dt-input-row"><button class="dt-primary" onclick={() => run(() => session.acceptPeer())}><Check size={17} />Allow connection</button><button class="dt-secondary" onclick={() => run(() => session.rejectPeer())}><X size={17} />Decline</button></div>
          </div>
        {:else if state.status === 'starting' || state.status === 'connecting' || state.status === 'waiting'}
          <div class="dt-pair-message"><Radio size={42} /><h3>{state.status === 'connecting' ? 'Almost there.' : 'Making a connection.'}</h3><p>{state.status === 'connecting' ? 'Look for the connection request on your other device and choose Allow connection.' : 'Preparing a private pairing link for your other device.'}</p><button class="dt-quiet" onclick={restart}>Start over</button></div>
        {:else}
          <div class="dt-pair-message"><Link size={40} /><h3>{state.status === 'unsupported' ? 'A newer browser is needed.' : 'Ready for another connection?'}</h3><p>{state.status === 'unsupported' ? 'This browser cannot create a secure device connection. Try a current browser on both devices, or use QR Train for small offline transfers.' : 'Make a fresh link, then scan it on your other device. Previous links will no longer work.'}</p>
            {#if state.status !== 'unsupported'}<button class="dt-primary" onclick={restart}><RefreshCw size={16} />New connection</button>{/if}
          </div>
        {/if}
      </div>
    </div>
  {:else}
    <div class="dt-workspace">
      <nav class="dt-pane-switch" aria-label="Transfer lists"><button class:dt-selected={mobilePane === 'sent'} aria-pressed={mobilePane === 'sent'} onclick={() => mobilePane = 'sent'}>Sending · {sentItems.length}</button><button class:dt-selected={mobilePane === 'received'} aria-pressed={mobilePane === 'received'} onclick={() => mobilePane = 'received'}>Received · {receivedItems.length}</button></nav>
      <div class="dt-panes">
        <section class="dt-pane" class:dt-mobile-hidden={mobilePane !== 'sent'} aria-label="Outgoing transfers">
          <div class="dt-pane-title"><div><Monitor size={18} /><h3>This device</h3></div><span>{sentItems.length} sent / queued</span></div>
          <TransferList items={sentItems} direction="sent" onCopy={(text) => copy(text, 'Text copied.')} onCancel={(id) => run(() => session.cancelTransfer(id))} onRemove={(id) => session.removeItem(id)} />
        </section>
        <section class="dt-pane" class:dt-mobile-hidden={mobilePane !== 'received'} aria-label="Incoming transfers">
          <div class="dt-pane-title"><div><Smartphone size={18} /><h3>{state.peerName || 'Other device'}</h3></div><span>{receivedItems.length} received</span></div>
          <TransferList items={receivedItems} direction="received" onCopy={(text) => copy(text, 'Text copied. Paste it anywhere on this device.')} onCancel={(id) => run(() => session.cancelTransfer(id))} onRemove={(id) => session.removeItem(id)} />
        </section>
      </div>
      <div class="dt-send-dock">
        <div class="dt-file-action"><button class="dt-primary" disabled={!connected} onclick={() => fileInput.click()}><Plus size={18} />Send files</button><span>Photos, audio, anything.<br />Up to 100 MB per file.</span><input class="dt-file-input" bind:this={fileInput} type="file" multiple aria-label="Choose files to send" onchange={sendFiles} /></div>
        <form class="dt-text-form" onsubmit={sendText}><label for="train-text">Send text to your other device</label><div class="dt-input-row"><textarea id="train-text" bind:value={draft} maxlength={MAX_TEXT_LENGTH} rows="2" placeholder={TEXT_PLACEHOLDER}></textarea>{#if canPaste}<button class="dt-secondary" type="button" disabled={!connected} onclick={pasteDraft} aria-label="Paste from clipboard"><ClipboardPaste size={18} /><span>Paste</span></button>{/if}<button class="dt-secondary" type="submit" disabled={!connected || !draft.trim()} aria-label="Send text"><Send size={18} /><span>Send</span></button></div></form>
      </div>
    </div>
  {/if}
  <footer class="dt-footnote"><span><ArrowUpRight size={13} />{connected ? 'Direct device connection · save received files before leaving.' : 'Internet needed to pair · no account needed.'}</span><button type="button" class="dt-help-open" onclick={openHelp}><Info size={13} />How sharing works</button></footer>
  {#if helpOpen}
    <div class="dt-help-layer">
      <button type="button" class="dt-help-scrim" tabindex="-1" aria-label="Close how sharing works" onclick={closeHelp}></button>
      <div class="dt-help" role="dialog" aria-modal="true" aria-labelledby="dt-help-title">
        <div class="dt-help-head"><h3 id="dt-help-title">How sharing works</h3><button type="button" class="dt-icon-button" bind:this={helpClose} onclick={closeHelp} aria-label="Close"><X size={16} /></button></div>
        <ul>{#each HELP_POINTS as point}<li>{point}</li>{/each}</ul>
      </div>
    </div>
  {/if}
</section>
