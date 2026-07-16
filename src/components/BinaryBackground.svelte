<script>
  import { onMount } from "svelte";

  let { isFlagColors = false } = $props();

  let canvas = $state();

  onMount(() => {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationFrame;
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Matrix rain setup
    const fontSize = 14;
    let columns = Math.floor(canvas.width / fontSize);
    let drops = Array(columns).fill(0);

    const draw = () => {
      // Very transparent black background to create trails
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Binary character color
      // In color mode, use active neon color based on active theme, else standard dim white/gray
      const theme =
        document.documentElement.getAttribute("data-theme") || "default";
      ctx.fillStyle = isFlagColors
        ? theme === "default"
          ? "rgba(214, 26, 44, 0.45)"
          : "rgba(160, 0, 235, 0.45)"
        : "rgba(255, 255, 255, 0.15)";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Random binary digit
        const text = Math.random() > 0.5 ? "1" : "0";
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(text, x, y);

        // Reset drop to top if it goes offscreen or randomly
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animationFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resizeCanvas);
    };
  });
</script>

<canvas
  bind:this={canvas}
  class="absolute top-0 left-0 w-full h-full pointer-events-none z-0 opacity-40"
></canvas>
