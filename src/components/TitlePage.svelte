<script>
  import "../lib/i18n.js";
  import { ChartNoAxesColumn, Component } from "lucide-svelte";
  import WeAreDogs from "./WeAreDogs.svelte";
</script>

<WeAreDogs />

<button
  class="absolute bottom-6 left-6 border-2 border-white cursor-pointer p-2"
>
  <ChartNoAxesColumn />
</button>

<button
  class="absolute bottom-6 right-6 border-2 border-white cursor-pointer p-2"
>
  <Component />
</button>
