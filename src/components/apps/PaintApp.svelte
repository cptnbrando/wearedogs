<script>
  import { 
    Paintbrush, Eraser, Image, Sparkles, Check, X, Undo2, Redo2 
  } from "lucide-svelte";
  import { onMount, onDestroy } from "svelte";

  let isDrawing = $state(false);
  let strokeColor = $state("#00bfff");
  let strokeWidth = $state(6);
  let canvasRef = $state();
  let ctx = null;

  // Creative features
  let brushMode = $state("normal"); // "normal" | "neon" | "rainbow" | "spray" | "eraser"
  let rainbowHue = 0;
  
  // Undo/Redo Stacks
  let undoStack = $state([]);
  let redoStack = $state([]);

  // Image insertion and Placement Mode
  let pastedImage = $state(null);
  let pastedImageUrl = $state("");
  let imgX = $state(210);
  let imgY = $state(160);
  let imgScale = $state(1);
  let imgRotation = $state(0);
  let initialScale = 1;
  let fileInputRef = $state();

  // Dragging states for image placement
  let isDraggingImage = false;
  let imgDragStartX = 0;
  let imgDragStartY = 0;
  let imgDragStartValX = 0;
  let imgDragStartValY = 0;

  function initPaint() {
    if (canvasRef) {
      ctx = canvasRef.getContext("2d");
      clearCanvas();
    }
  }

  function clearCanvas() {
    if (ctx && canvasRef) {
      saveHistory();
      ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
    }
  }

  function saveHistory() {
    if (canvasRef && ctx) {
      const snapshot = ctx.getImageData(0, 0, canvasRef.width, canvasRef.height);
      undoStack.push(snapshot);
      if (undoStack.length > 30) {
        undoStack.shift();
      }
      redoStack = []; // Reset redo on new action
    }
  }

  function undo() {
    if (undoStack.length > 0 && canvasRef && ctx) {
      const current = ctx.getImageData(0, 0, canvasRef.width, canvasRef.height);
      redoStack.push(current);
      const previous = undoStack.pop();
      ctx.putImageData(previous, 0, 0);
    }
  }

  function redo() {
    if (redoStack.length > 0 && canvasRef && ctx) {
      const current = ctx.getImageData(0, 0, canvasRef.width, canvasRef.height);
      undoStack.push(current);
      const next = redoStack.pop();
      ctx.putImageData(next, 0, 0);
    }
  }

  function applyBrushSettings(x, y) {
    if (!ctx) return;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.shadowBlur = 0;

    if (brushMode === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
      ctx.lineWidth = strokeWidth * 2;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.lineWidth = strokeWidth;

      if (brushMode === "neon") {
        ctx.shadowBlur = 15;
        ctx.shadowColor = strokeColor;
        ctx.strokeStyle = strokeColor;
      } else if (brushMode === "rainbow") {
        rainbowHue = (rainbowHue + 3) % 360;
        ctx.strokeStyle = `hsl(${rainbowHue}, 100%, 50%)`;
      } else {
        ctx.strokeStyle = strokeColor;
      }
    }
  }

  function sprayDots(x, y) {
    if (!ctx) return;
    ctx.fillStyle = strokeColor;
    const radius = strokeWidth * 2.5;
    const density = 15;
    for (let i = 0; i < density; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * radius;
      const dotX = x + Math.cos(angle) * r;
      const dotY = y + Math.sin(angle) * r;
      ctx.fillRect(dotX, dotY, 1.5, 1.5);
    }
  }

  // Mouse Draw Handlers
  function startDraw(e) {
    if (pastedImage) return; // Dragging image instead
    isDrawing = true;
    saveHistory();
    const rect = canvasRef.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    applyBrushSettings(x, y);
    if (brushMode === "spray") {
      sprayDots(x, y);
    } else {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  }

  function draw(e) {
    if (!isDrawing || pastedImage) return;
    const rect = canvasRef.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    applyBrushSettings(x, y);
    if (brushMode === "spray") {
      sprayDots(x, y);
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  }

  // Touch Draw Handlers
  function startDrawTouch(e) {
    if (pastedImage) return; // Dragging image instead
    if (e.cancelable) e.preventDefault();
    isDrawing = true;
    saveHistory();
    const rect = canvasRef.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    applyBrushSettings(x, y);
    if (brushMode === "spray") {
      sprayDots(x, y);
    } else {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  }

  function drawTouch(e) {
    if (!isDrawing || pastedImage) return;
    if (e.cancelable) e.preventDefault();
    const rect = canvasRef.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    applyBrushSettings(x, y);
    if (brushMode === "spray") {
      sprayDots(x, y);
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  }

  function stopDraw() {
    isDrawing = false;
  }

  // Image Import and Paste functions
  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      loadImage(file);
    }
  }

  function loadImage(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Fit within canvas bounds (420 width, 320 height)
        let scale = 1;
        if (img.width > 420 || img.height > 320) {
          scale = Math.min(420 / img.width, 320 / img.height);
        }
        initialScale = scale;
        imgScale = scale;
        imgRotation = 0;
        imgX = 210;
        imgY = 160;
        pastedImage = img;
        pastedImageUrl = event.target.result;
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  function handlePaste(e) {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          loadImage(file);
          break;
        }
      }
    }
  }

  // Dragging Pasted Image (Mouse)
  function startImageDrag(e) {
    isDraggingImage = true;
    imgDragStartX = e.clientX;
    imgDragStartY = e.clientY;
    imgDragStartValX = imgX;
    imgDragStartValY = imgY;
    window.addEventListener("mousemove", handleImageDrag);
    window.addEventListener("mouseup", stopImageDrag);
  }

  function handleImageDrag(e) {
    if (!isDraggingImage) return;
    const deltaX = e.clientX - imgDragStartX;
    const deltaY = e.clientY - imgDragStartY;
    imgX = imgDragStartValX + deltaX;
    imgY = imgDragStartValY + deltaY;
  }

  function stopImageDrag() {
    isDraggingImage = false;
    window.removeEventListener("mousemove", handleImageDrag);
    window.removeEventListener("mouseup", stopImageDrag);
  }

  // Dragging Pasted Image (Touch)
  function startImageTouchDrag(e) {
    isDraggingImage = true;
    const touch = e.touches[0];
    imgDragStartX = touch.clientX;
    imgDragStartY = touch.clientY;
    imgDragStartValX = imgX;
    imgDragStartValY = imgY;
    window.addEventListener("touchmove", handleImageTouchDrag, { passive: false });
    window.addEventListener("touchend", stopImageTouchDrag);
    window.addEventListener("touchcancel", stopImageTouchDrag);
  }

  function handleImageTouchDrag(e) {
    if (!isDraggingImage) return;
    if (e.cancelable) e.preventDefault();
    const touch = e.touches[0];
    const deltaX = touch.clientX - imgDragStartX;
    const deltaY = touch.clientY - imgDragStartY;
    imgX = imgDragStartValX + deltaX;
    imgY = imgDragStartValY + deltaY;
  }

  function stopImageTouchDrag() {
    isDraggingImage = false;
    window.removeEventListener("touchmove", handleImageTouchDrag);
    window.removeEventListener("touchend", stopImageTouchDrag);
    window.removeEventListener("touchcancel", stopImageTouchDrag);
  }

  function stampImage() {
    if (ctx && canvasRef && pastedImage) {
      saveHistory();
      ctx.save();
      
      // Move to target center
      ctx.translate(imgX, imgY);
      ctx.rotate((imgRotation * Math.PI) / 180);
      
      // Draw image scaled relative to center
      const w = pastedImage.width * imgScale;
      const h = pastedImage.height * imgScale;
      
      ctx.drawImage(pastedImage, -w / 2, -h / 2, w, h);
      ctx.restore();
      
      pastedImage = null;
      pastedImageUrl = "";
    }
  }

  function cancelImagePlacement() {
    pastedImage = null;
    pastedImageUrl = "";
  }

  onMount(() => {
    initPaint();
    window.addEventListener("paste", handlePaste);
  });

  onDestroy(() => {
    window.removeEventListener("paste", handlePaste);
  });
</script>

<div class="paint-layout animated-pane">
  <div class="paint-sidebar">
    <h3>Sketch Pad</h3>
    
    {#if pastedImage}
      <div class="image-controls-box animated-pane">
        <span class="label">Image Controls</span>
        
        <div class="control-item">
          <label for="img-scale-slider">SCALE: {imgScale.toFixed(2)}x</label>
          <input id="img-scale-slider" type="range" min="0.1" max="3.0" step="0.05" bind:value={imgScale} />
        </div>

        <div class="control-item">
          <label for="img-rotate-slider">ROTATE: {imgRotation}°</label>
          <input id="img-rotate-slider" type="range" min="-180" max="180" step="5" bind:value={imgRotation} />
        </div>

        <div class="placement-actions">
          <button class="action-btn stamp-btn" onclick={stampImage}>
            <Check size={14} /> PLACE
          </button>
          <button class="action-btn cancel-btn" onclick={cancelImagePlacement}>
            <X size={14} /> CANCEL
          </button>
        </div>
      </div>
    {:else}
      <!-- Standard Brush Controls -->
      <div class="brush-settings animated-pane">
        <div class="color-picker-box">
          <span class="label">BRUSH COLOR</span>
          <div class="colors-row">
            {#each ['#00bfff', '#ff55bb', '#ffcc00', '#00ff66', '#ffffff'] as color}
              <!-- svelte-ignore a11y_click_events_have_key_events -->
              <!-- svelte-ignore a11y_no_static_element_interactions -->
              <span
                class="color-dot"
                class:active={strokeColor === color && brushMode !== 'eraser'}
                style="background: {color}"
                onclick={() => { strokeColor = color; if (brushMode === 'eraser') brushMode = 'normal'; }}
              ></span>
            {/each}
          </div>
        </div>

        <div class="brush-size-box">
          <label for="brush-width-slider">BRUSH WIDTH: {strokeWidth}px</label>
          <input id="brush-width-slider" type="range" min="2" max="24" bind:value={strokeWidth} />
        </div>

        <div class="brush-modes-box">
          <span class="label">BRUSH TYPE</span>
          <div class="brush-modes-grid">
            <button 
              class="mode-btn" 
              class:active={brushMode === 'normal'} 
              onclick={() => brushMode = 'normal'}
              title="Solid Brush"
            >
              <Paintbrush size={14} /> Solid
            </button>
            <button 
              class="mode-btn" 
              class:active={brushMode === 'neon'} 
              onclick={() => brushMode = 'neon'}
              title="Neon Glow Effect"
            >
              <Sparkles size={14} /> Neon
            </button>
            <button 
              class="mode-btn" 
              class:active={brushMode === 'rainbow'} 
              onclick={() => brushMode = 'rainbow'}
              title="Rainbow Hue Cycle"
            >
              🌈 Rainbow
            </button>
            <button 
              class="mode-btn" 
              class:active={brushMode === 'spray'} 
              onclick={() => brushMode = 'spray'}
              title="Spray/Airbrush"
            >
              💨 Spray
            </button>
            <button 
              class="mode-btn" 
              class:active={brushMode === 'eraser'} 
              onclick={() => brushMode = 'eraser'}
              title="Eraser"
            >
              <Eraser size={14} /> Eraser
            </button>
          </div>
        </div>

        <div class="history-actions">
          <button class="history-btn" onclick={undo} disabled={undoStack.length === 0} title="Undo">
            <Undo2 size={14} />
          </button>
          <button class="history-btn" onclick={redo} disabled={redoStack.length === 0} title="Redo">
            <Redo2 size={14} />
          </button>
        </div>

        <div class="extra-actions">
          <button class="import-btn" onclick={() => fileInputRef.click()}>
            <Image size={14} /> IMPORT IMAGE
          </button>
          <input 
            type="file" 
            accept="image/*" 
            bind:this={fileInputRef} 
            onchange={handleFileChange} 
            style="display: none;" 
          />
        </div>
      </div>
    {/if}

    <button class="clear-canvas-btn" onclick={clearCanvas}>
      CLEAR CANVAS
    </button>
  </div>

  <div class="canvas-container" onpaste={handlePaste}>
    <canvas
      bind:this={canvasRef}
      width="420"
      height="320"
      onmousedown={startDraw}
      onmousemove={draw}
      onmouseup={stopDraw}
      onmouseleave={stopDraw}
      ontouchstart={startDrawTouch}
      ontouchmove={drawTouch}
      ontouchend={stopDraw}
      ontouchcancel={stopDraw}
    ></canvas>

    {#if pastedImage}
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div 
        class="image-overlay"
        style="
          position: absolute;
          left: 0;
          top: 0;
          width: {pastedImage.width}px;
          height: {pastedImage.height}px;
          transform-origin: center center;
          transform: translate({imgX - pastedImage.width/2}px, {imgY - pastedImage.height/2}px) scale({imgScale}) rotate({imgRotation}deg);
          cursor: move;
          pointer-events: auto;
        "
        onmousedown={startImageDrag}
        ontouchstart={startImageTouchDrag}
      >
        <img src={pastedImageUrl} alt="pasted" style="width: 100%; height: 100%; pointer-events: none; border: 2px dashed #ffcc00;" />
      </div>
    {/if}
  </div>
</div>

<style>
  .paint-layout {
    display: grid;
    grid-template-columns: 200px 1fr;
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
    gap: 14px;
    overflow-y: auto;
  }

  .paint-sidebar h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 700;
    color: white;
    letter-spacing: 0.05em;
  }

  .brush-settings, .image-controls-box {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .color-picker-box, .brush-size-box, .brush-modes-box, .control-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .color-picker-box .label, .brush-size-box label, .brush-modes-box .label, .control-item label {
    font-size: 0.6rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.35);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .colors-row {
    display: flex;
    gap: 8px;
  }

  .color-dot {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    border: 2px solid transparent;
  }

  .color-dot.active {
    transform: scale(1.15);
    border-color: white;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
  }

  .brush-size-box input[type="range"], .control-item input[type="range"] {
    width: 100%;
    accent-color: #ffcc00;
    background: rgba(255, 255, 255, 0.08);
    height: 6px;
    border-radius: 3px;
    cursor: pointer;
  }

  .brush-modes-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .mode-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    color: rgba(255, 255, 255, 0.65);
    border-radius: 8px;
    padding: 6px 4px;
    font-size: 0.65rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .mode-btn:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.15);
    color: white;
  }

  .mode-btn.active {
    background: rgba(255, 204, 0, 0.12);
    border-color: #ffcc00;
    color: #ffcc00;
    box-shadow: 0 0 10px rgba(255, 204, 0, 0.15);
  }

  .history-actions {
    display: flex;
    gap: 8px;
    margin-top: 4px;
  }

  .history-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    color: rgba(255, 255, 255, 0.7);
    border-radius: 8px;
    padding: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .history-btn:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.15);
    color: white;
  }

  .history-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .extra-actions {
    display: flex;
    margin-top: 4px;
  }

  .import-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    background: rgba(0, 191, 255, 0.08);
    border: 1px solid rgba(0, 191, 255, 0.2);
    color: #00bfff;
    border-radius: 8px;
    padding: 8px;
    font-size: 0.7rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    letter-spacing: 0.05em;
  }

  .import-btn:hover {
    background: rgba(0, 191, 255, 0.15);
    border-color: #00bfff;
  }

  .placement-actions {
    display: flex;
    gap: 8px;
    margin-top: 8px;
  }

  .action-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    border-radius: 8px;
    padding: 8px 4px;
    font-size: 0.68rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .stamp-btn {
    background: rgba(0, 255, 102, 0.08);
    border: 1px solid rgba(0, 255, 102, 0.25);
    color: #00ff66;
  }

  .stamp-btn:hover {
    background: rgba(0, 255, 102, 0.15);
    border-color: #00ff66;
  }

  .cancel-btn {
    background: rgba(255, 51, 68, 0.08);
    border: 1px solid rgba(255, 51, 68, 0.25);
    color: #ff3344;
  }

  .cancel-btn:hover {
    background: rgba(255, 51, 68, 0.15);
    border-color: #ff3344;
  }

  .clear-canvas-btn {
    margin-top: auto;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.4);
    border-radius: 8px;
    padding: 10px;
    font-size: 0.7rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    letter-spacing: 0.08em;
  }

  .clear-canvas-btn:hover {
    background: rgba(255, 51, 68, 0.15);
    border-color: rgba(255, 51, 68, 0.3);
    color: #ff3344;
  }

  .canvas-container {
    position: relative;
    width: 420px;
    height: 320px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
    border: 2px solid rgba(255, 204, 0, 0.2);
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    overflow: hidden;
  }

  .canvas-container canvas {
    position: absolute;
    left: 0;
    top: 0;
    cursor: crosshair;
    touch-action: none;
    z-index: 1;
  }

  .image-overlay {
    z-index: 2;
    touch-action: none;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 15px rgba(255, 204, 0, 0.25);
  }

  .image-overlay img {
    box-shadow: 0 0 0 1px #ffcc00;
  }

  .animated-pane {
    animation: paneFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes paneFadeIn {
    0% { opacity: 0; transform: translateY(4px); }
    100% { opacity: 1; transform: translateY(0); }
  }
</style>
