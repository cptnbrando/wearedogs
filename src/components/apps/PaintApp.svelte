<script>
  import { Paintbrush } from "lucide-svelte";
  import { onMount } from "svelte";

  let isDrawing = $state(false);
  let strokeColor = $state("#00bfff");
  let strokeWidth = $state(6);
  let canvasRef = $state();
  let ctx = null;

  function initPaint() {
    if (canvasRef) {
      ctx = canvasRef.getContext("2d");
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      clearCanvas();
    }
  }

  function clearCanvas() {
    if (ctx && canvasRef) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.fillRect(0, 0, canvasRef.width, canvasRef.height);
    }
  }

  function startDraw(e) {
    isDrawing = true;
    const rect = canvasRef.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function draw(e) {
    if (!isDrawing) return;
    const rect = canvasRef.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function stopDraw() {
    isDrawing = false;
  }

  onMount(() => {
    initPaint();
  });
</script>

<div class="paint-layout animated-pane">
  <div class="paint-sidebar">
    <h3>Sketch Pad</h3>
    
    <div class="color-picker-box">
      <span class="label">BRUSH COLOR</span>
      <div class="colors-row">
        {#each ['#00bfff', '#ff55bb', '#ffcc00', '#00ff66', '#ffffff'] as color}
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <span
            class="color-dot"
            class:active={strokeColor === color}
            style="background: {color}"
            onclick={() => strokeColor = color}
          ></span>
        {/each}
      </div>
    </div>

    <div class="brush-size-box">
      <label for="brush-width-slider">BRUSH WIDTH: {strokeWidth}px</label>
      <input id="brush-width-slider" type="range" min="2" max="24" bind:value={strokeWidth} />
    </div>

    <button class="clear-canvas-btn" onclick={clearCanvas}>
      CLEAR CANVAS
    </button>
  </div>

  <div class="canvas-container">
    <canvas
      bind:this={canvasRef}
      width="420"
      height="320"
      onmousedown={startDraw}
      onmousemove={draw}
      onmouseup={stopDraw}
      onmouseleave={stopDraw}
    ></canvas>
  </div>
</div>

<style>
  .paint-layout {
    display: grid;
    grid-template-columns: 180px 1fr;
    gap: 20px;
    height: 100%;
    align-items: center;
    padding: 20px;
  }

  .paint-sidebar {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 16px;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .paint-sidebar h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 700;
    color: white;
  }

  .color-picker-box, .brush-size-box {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .color-picker-box .label, .brush-size-box label {
    font-size: 0.6rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.35);
  }

  .colors-row {
    display: flex;
    gap: 8px;
  }

  .color-dot {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 2px solid transparent;
  }

  .color-dot.active {
    transform: scale(1.15);
    border-color: white;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
  }

  .brush-size-box input[type="range"] {
    width: 100%;
    accent-color: #ffcc00;
  }

  .clear-canvas-btn {
    margin-top: auto;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: white;
    border-radius: 8px;
    padding: 10px;
    font-size: 0.75rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .clear-canvas-btn:hover {
    background: rgba(255, 51, 68, 0.15);
    border-color: rgba(255, 51, 68, 0.3);
    color: #ff3344;
  }

  .canvas-container {
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.4);
    border: 2px solid rgba(255, 204, 0, 0.25);
    border-radius: 12px;
    overflow: hidden;
    height: 320px;
    box-shadow: 0 0 20px rgba(255, 204, 0, 0.05);
  }

  .canvas-container canvas {
    cursor: crosshair;
  }

  .animated-pane {
    animation: paneFadeIn 0.3s ease forwards;
  }

  @keyframes paneFadeIn {
    0% { opacity: 0; transform: translateY(8px); }
    100% { opacity: 1; transform: translateY(0); }
  }
</style>
