<script>
  // A coffee mug with a dollar sign in it: buying DOGS a coffee is a tip.
  // Drawn on Lucide's grid and stroke so it sits beside the other icons
  // (the mug is Lucide's "coffee"; the dollar is thinner so it fits inside).
  import { Icon } from "lucide-svelte";

  /** @type {{ size?: number, class?: string }} */
  let { size = 24, class: className = "" } = $props();

  const TIP_ICON_NODE = [
    ["path", { d: "M6 2v2" }],
    ["path", { d: "M10 2v2" }],
    ["path", { d: "M14 2v2" }],
    ["path", { d: "M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1" }],
    ["path", { d: "M12.25 12H9.4a1.4 1.4 0 0 0 0 2.8h1.2a1.4 1.4 0 0 1 0 2.8H7.75", "stroke-width": "1.75" }],
    ["path", { d: "M10 10.6v1.4M10 17.6V19", "stroke-width": "1.75" }],
  ];
</script>

<Icon name="tip" {size} class={className} iconNode={TIP_ICON_NODE} />
