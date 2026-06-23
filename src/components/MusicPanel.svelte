<script>
  import BasePanel from "./BasePanel.svelte";

  let { isClosing = false, onClose } = $props();
</script>

<BasePanel title="Music Sampler" {isClosing} {onClose} />
