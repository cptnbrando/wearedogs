<script>
  import { ArrowDownLeft, ArrowUpRight, File, MessageSquare, Download, Copy, X } from 'lucide-svelte';
  export let items = [];
  export let direction = 'sent';
  export let onCopy;
  export let onCancel;
  export let onRemove;

  const KB = 1024;
  const MB = KB * KB;
  const formatBytes = (bytes) => bytes < KB ? bytes + ' B' : bytes < MB ? (bytes / KB).toFixed(1) + ' KB' : (bytes / MB).toFixed(1) + ' MB';
</script>

<div class="dt-transfer-list w-full flex flex-col sm:flex-col md:flex-col lg:flex-col xl:flex-col 2xl:flex-col">
  {#if !items.length}
    <div class="dt-empty">
      {#if direction === 'sent'}<ArrowUpRight size={32} /><h4>Send something over.</h4><p>Choose files or paste text below.<br />Your other device gets them here.</p>
      {:else}<ArrowDownLeft size={32} /><h4>Room for your next arrival.</h4><p>Files and text from your other device<br />will appear here, ready to save or copy.</p>{/if}
    </div>
  {:else}
    {#each items as item (item.id)}
      <article class="dt-transfer" class:dt-failed={item.status === 'error'}>
        <div class="dt-transfer-top">
          {#if item.kind === 'text'}<MessageSquare size={18} />{:else}<File size={18} />{/if}
          <div class="dt-transfer-name"><strong title={item.name}>{item.kind === 'text' ? 'Text message' : item.name}</strong><span>{item.kind === 'file' ? formatBytes(item.size) + ' · ' : ''}{item.status === 'complete' ? (direction === 'sent' ? 'Delivered' : 'Received') : item.status}</span></div>
          {#if item.status === 'complete' || item.status === 'cancelled' || item.status === 'error'}
            <button class="dt-icon-button" onclick={() => onRemove(item.id)} aria-label={'Remove ' + (item.name || 'text message')}><X size={15} /></button>
          {:else}<button class="dt-icon-button" onclick={() => onCancel(item.id)} aria-label={'Cancel ' + (item.name || 'text message')}><X size={15} /></button>{/if}
        </div>
        {#if item.kind === 'text'}<pre class="dt-message">{item.text}</pre>{/if}
        {#if item.status === 'transferring' || item.status === 'waiting'}<progress value={item.progress || 0} max="100" aria-label={'Transfer progress for ' + item.name}></progress>{/if}
        {#if item.error}<p class="dt-item-error">{item.error}</p>{/if}
        {#if item.url && item.mime.indexOf('image/') === 0}<img class="dt-preview" src={item.url} alt={'Preview of ' + item.name} loading="lazy" />
        {:else if item.url && item.mime.indexOf('audio/') === 0}<audio class="dt-preview-audio" src={item.url} controls preload="metadata"></audio>{/if}
        {#if item.status === 'complete' && direction === 'received'}
          {#if item.kind === 'file'}<a class="dt-save" href={item.url} download={item.name}><Download size={15} />Save file</a>
          {:else}<button class="dt-save" onclick={() => onCopy(item.text)}><Copy size={15} />Copy text</button>{/if}
        {/if}
      </article>
    {/each}
  {/if}
</div>
