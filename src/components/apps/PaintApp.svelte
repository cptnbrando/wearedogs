<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<script>
  import { 
    Paintbrush, Eraser, Image, Sparkles, Check, X, Undo2, Redo2 
  } from "lucide-svelte";
  import { onMount, onDestroy } from "svelte";

  let isDrawing = $state(false);
  let strokeColor = $state("#00bfff");
  let strokeWidth = $state(6);
  let canvasRef = $state();
  let canvasContainerRef = $state();
  let ctx = null;
  let dpr = $state(1);

  // Creative features
  let brushMode = $state("normal"); // "normal" | "neon" | "rainbow" | "spray" | "eraser"
  let rainbowHue = 0;
  
  // Undo/Redo Stacks
  let undoStack = $state([]);
  let redoStack = $state([]);

  // Image insertion and Placement Mode
  let pastedImage = $state(null);
  let pastedImageUrl = $state("");
  let imgX = $state(0);
  let imgY = $state(0);
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

  // Pagination for mobile controls
  let activeTab = $state("brush"); // "brush" | "modes" | "actions"

  function resizeCanvas() {
    if (!canvasRef || !canvasContainerRef) return;
    const rect = canvasContainerRef.getBoundingClientRect();
    const newWidth = Math.floor(rect.width);
    const newHeight = Math.floor(rect.height);

    if (newWidth <= 0 || newHeight <= 0) return;

    dpr = window.devicePixelRatio || 1;
    const targetPhysicalWidth = newWidth * dpr;
    const targetPhysicalHeight = newHeight * dpr;

    // Only resize if the dimensions actually changed
    if (canvasRef.width === targetPhysicalWidth && canvasRef.height === targetPhysicalHeight) {
      return;
    }

    // Capture the current contents
    let tempCanvas = null;
    if (ctx && canvasRef.width > 0 && canvasRef.height > 0) {
      tempCanvas = document.createElement("canvas");
      tempCanvas.width = canvasRef.width;
      tempCanvas.height = canvasRef.height;
      const tempCtx = tempCanvas.getContext("2d");
      tempCtx.drawImage(canvasRef, 0, 0);
    }

    canvasRef.width = targetPhysicalWidth;
    canvasRef.height = targetPhysicalHeight;
    canvasRef.style.width = `${newWidth}px`;
    canvasRef.style.height = `${newHeight}px`;

    ctx = canvasRef.getContext("2d");
    
    if (tempCanvas && ctx) {
      // Draw old pixels exactly
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(tempCanvas, 0, 0, targetPhysicalWidth, targetPhysicalHeight);
      ctx.scale(dpr, dpr);
    } else {
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, newWidth, newHeight);
    }
  }

  function clearCanvas() {
    if (ctx && canvasRef) {
      saveHistory();
      ctx.clearRect(0, 0, canvasRef.width / dpr, canvasRef.height / dpr);
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
      const previous = undoStack.pop();
      if (previous.width === canvasRef.width && previous.height === canvasRef.height) {
        redoStack.push(current);
        ctx.putImageData(previous, 0, 0);
      } else {
        redoStack = [];
      }
    }
  }

  function redo() {
    if (redoStack.length > 0 && canvasRef && ctx) {
      const current = ctx.getImageData(0, 0, canvasRef.width, canvasRef.height);
      const next = redoStack.pop();
      if (next.width === canvasRef.width && next.height === canvasRef.height) {
        undoStack.push(current);
        ctx.putImageData(next, 0, 0);
      } else {
        undoStack = [];
      }
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
        let scale = 1;
        const cw = canvasRef ? (canvasRef.width / dpr) : 420;
        const ch = canvasRef ? (canvasRef.height / dpr) : 320;
        if (img.width > cw || img.height > ch) {
          scale = Math.min(cw / img.width, ch / img.height);
        }
        initialScale = scale;
        imgScale = scale;
        imgRotation = 0;
        imgX = cw / 2;
        imgY = ch / 2;
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

  function stampImage() {
    if (ctx && canvasRef && pastedImage) {
      saveHistory();
      ctx.save();
      ctx.translate(imgX, imgY);
      ctx.rotate((imgRotation * Math.PI) / 180);
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

  let resizeObserver = null;

  onMount(() => {
    resizeCanvas();
    window.addEventListener("paste", handlePaste);

    if (window.ResizeObserver && canvasContainerRef) {
      resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(() => {
          resizeCanvas();
        });
      });
      resizeObserver.observe(canvasContainerRef);
    }
  });

  onDestroy(() => {
    window.removeEventListener("paste", handlePaste);
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
  });
</script>

<div class="paint-layout animated-pane">
  <div class="paint-sidebar">
    <h3>Sketch Pad</h3>
    
    {#if pastedImage}
      <div class="image-controls-box animated-pane">
        <span class="label">Image Controls</span>
        
        <div class="control-item">
          <label for="img-scale-slider">
            <span class="desktop-only-label">SCALE: </span>{imgScale.toFixed(2)}x
          </label>
          <input id="img-scale-slider" type="range" min="0.1" max="3.0" step="0.05" bind:value={imgScale} />
        </div>

        <div class="control-item">
          <label for="img-rotate-slider">
            <span class="desktop-only-label">ROTATE: </span>{imgRotation}°
          </label>
          <input id="img-rotate-slider" type="range" min="-180" max="180" step="5" bind:value={imgRotation} />
        </div>

        <div class="placement-actions">
          <button class="action-btn stamp-btn" onclick={stampImage} title="Place Image">
            <Check size={14} /> <span class="place-text">PLACE</span>
          </button>
          <button class="action-btn cancel-btn" onclick={cancelImagePlacement} title="Cancel">
            <X size={14} /> <span class="cancel-text">CANCEL</span>
          </button>
        </div>
      </div>
    {:else}
      <!-- Mobile Pagination Tab Bar -->
      <div class="mobile-tabs-bar">
        <button 
          class="tab-btn" 
          class:active={activeTab === 'brush'} 
          onclick={() => activeTab = 'brush'}
        >
          Brush
        </button>
        <button 
          class="tab-btn" 
          class:active={activeTab === 'modes'} 
          onclick={() => activeTab = 'modes'}
        >
          Modes
        </button>
        <button 
          class="tab-btn" 
          class:active={activeTab === 'actions'} 
          onclick={() => activeTab = 'actions'}
        >
          Actions
        </button>
      </div>

      <!-- Standard Brush Controls -->
      <div class="brush-settings animated-pane">
        <div class="color-picker-box" class:hidden-mobile={activeTab !== 'brush'}>
          <span class="label">BRUSH COLOR</span>
          <div class="colors-row">
            {#each ['#00bfff', '#ff55bb', '#ffcc00', '#00ff66', '#ffffff'] as color}
              <span
                class="color-dot"
                class:active={strokeColor === color && brushMode !== 'eraser'}
                style="background: {color}"
                onclick={() => { strokeColor = color; if (brushMode === 'eraser') brushMode = 'normal'; }}
              ></span>
            {/each}
          </div>
        </div>

        <div class="brush-size-box" class:hidden-mobile={activeTab !== 'brush'}>
          <label for="brush-width-slider">
            <span class="desktop-only-label">BRUSH WIDTH: </span>{strokeWidth}px
          </label>
          <input id="brush-width-slider" type="range" min="2" max="24" bind:value={strokeWidth} />
        </div>

        <div class="brush-modes-box" class:hidden-mobile={activeTab !== 'modes'}>
          <span class="label">BRUSH TYPE</span>
          <div class="brush-modes-grid">
            <button 
              class="mode-btn" 
              class:active={brushMode === 'normal'} 
              onclick={() => brushMode = 'normal'}
              title="Solid Brush"
            >
              <Paintbrush size={14} /> <span class="mode-text">Solid</span>
            </button>
            <button 
              class="mode-btn" 
              class:active={brushMode === 'neon'} 
              onclick={() => brushMode = 'neon'}
              title="Neon Glow Effect"
            >
              <Sparkles size={14} /> <span class="mode-text">Neon</span>
            </button>
            <button 
              class="mode-btn" 
              class:active={brushMode === 'rainbow'} 
              onclick={() => brushMode = 'rainbow'}
              title="Rainbow Hue Cycle"
            >
              🌈 <span class="mode-text">Rainbow</span>
            </button>
            <button 
              class="mode-btn" 
              class:active={brushMode === 'spray'} 
              onclick={() => brushMode = 'spray'}
              title="Spray/Airbrush"
            >
              💨 <span class="mode-text">Spray</span>
            </button>
            <button 
              class="mode-btn" 
              class:active={brushMode === 'eraser'} 
              onclick={() => brushMode = 'eraser'}
              title="Eraser"
            >
              <Eraser size={14} /> <span class="mode-text">Eraser</span>
            </button>
          </div>
        </div>

        <div class="history-actions" class:hidden-mobile={activeTab !== 'actions'}>
          <button class="history-btn" onclick={undo} disabled={undoStack.length === 0} title="Undo">
            <Undo2 size={14} />
          </button>
          <button class="history-btn" onclick={redo} disabled={redoStack.length === 0} title="Redo">
            <Redo2 size={14} />
          </button>
        </div>

        <div class="extra-actions" class:hidden-mobile={activeTab !== 'actions'}>
          <button class="import-btn" onclick={() => fileInputRef.click()}>
            <Image size={14} /> <span class="import-text">IMPORT</span>
          </button>
          <input 
            type="file" 
            accept="image/*" 
            bind:this={fileInputRef} 
            onchange={handleFileChange} 
            style="display: none;" 
          />
        </div>

        <button 
          class="clear-canvas-btn" 
          class:hidden-mobile={activeTab !== 'actions'} 
          onclick={clearCanvas}
        >
          CLEAR CANVAS
        </button>
      </div>
    {/if}
  </div>

  <div bind:this={canvasContainerRef} class="canvas-container" onpaste={handlePaste}>
    <canvas
      bind:this={canvasRef}
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
    display: flex;
    flex-direction: row; /* Default layout: left-sidebar, right-canvas */
    gap: 20px;
    height: 100%;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    overflow: hidden;
  }

  @media (max-width: 767px) and (orientation: portrait) {
    .paint-layout {
      flex-direction: column;
      gap: 12px;
      padding: 12px;
    }
  }

  .paint-sidebar {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    width: 180px; /* Default sidebar width */
    height: 100%;
    box-sizing: border-box;
    order: 1;
    overflow-y: auto;
    overflow-x: hidden;
    flex-shrink: 0;
  }

  @media (min-width: 1024px) {
    .paint-sidebar {
      width: 210px;
    }
  }

  @media (min-width: 1280px) {
    .paint-sidebar {
      width: 240px;
    }
  }

  /* Mobile Landscape sidebar adjustments */
  @media (max-width: 767px) and (orientation: landscape) {
    .paint-sidebar {
      width: 100px;
      padding: 8px;
      gap: 10px;
    }
  }

  /* Mobile Portrait bottom tabbed layout */
  @media (max-width: 767px) and (orientation: portrait) {
    .paint-sidebar {
      width: 100%;
      height: 106px;
      padding: 12px;
      gap: 12px;
      order: 2;
      overflow: hidden;
    }
  }

  .paint-sidebar h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 700;
    color: white;
    letter-spacing: 0.05em;
  }

  @media (max-width: 767px) {
    .paint-sidebar h3 {
      display: none;
    }
  }

  .mobile-tabs-bar {
    display: none;
  }

  @media (max-width: 767px) and (orientation: portrait) {
    .mobile-tabs-bar {
      display: flex;
      width: 100%;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      margin-bottom: 4px;
      gap: 4px;
    }
  }

  .tab-btn {
    flex: 1;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    color: rgba(255, 255, 255, 0.4);
    font-size: 0.75rem;
    font-weight: 700;
    padding: 8px 0;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    transition: all 0.2s ease;
  }

  .tab-btn:hover {
    color: rgba(255, 255, 255, 0.8);
  }

  .tab-btn.active {
    color: #ffcc00;
    border-bottom-color: #ffcc00;
  }

  .brush-settings, .image-controls-box {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 14px;
    height: 100%;
    width: 100%;
  }

  @media (max-width: 767px) and (orientation: portrait) {
    .brush-settings, .image-controls-box {
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      gap: 16px;
      height: 38px;
      overflow-x: auto;
      overflow-y: hidden;
      scrollbar-width: none;
      -webkit-overflow-scrolling: touch;
    }
    
    .brush-settings::-webkit-scrollbar, .image-controls-box::-webkit-scrollbar {
      display: none;
    }
  }

  .color-picker-box, .brush-size-box, .brush-modes-box, .control-item {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
    flex-shrink: 0;
  }

  @media (max-width: 767px) and (orientation: portrait) {
    .color-picker-box, .brush-size-box, .brush-modes-box, .control-item {
      flex-direction: row;
      align-items: center;
      gap: 6px;
    }
  }

  .label {
    font-size: 0.6rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.35);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  @media (max-width: 767px) {
    .label {
      display: none;
    }
  }

  .colors-row {
    display: flex;
    gap: 8px;
  }

  @media (max-width: 767px) and (orientation: landscape) {
    .colors-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 6px;
    }
  }

  @media (max-width: 767px) and (orientation: portrait) {
    .colors-row {
      gap: 6px;
    }
  }

  .color-dot {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    border: 2px solid transparent;
  }

  @media (max-width: 767px) {
    .color-dot {
      width: 18px;
      height: 18px;
    }
  }

  .color-dot.active {
    transform: scale(1.15);
    border-color: white;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
  }

  .brush-size-box label, .control-item label {
    font-size: 0.65rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.7);
    white-space: nowrap;
  }

  .brush-size-box input[type="range"], .control-item input[type="range"] {
    width: 100%;
    accent-color: #ffcc00;
    background: rgba(255, 255, 255, 0.08);
    height: 6px;
    border-radius: 3px;
    cursor: pointer;
  }

  @media (max-width: 767px) and (orientation: portrait) {
    .brush-size-box input[type="range"], .control-item input[type="range"] {
      width: 90px;
    }
  }

  .brush-modes-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    width: 100%;
  }

  @media (max-width: 767px) and (orientation: landscape) {
    .brush-modes-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 6px;
    }
  }

  @media (max-width: 767px) and (orientation: portrait) {
    .brush-modes-grid {
      grid-template-columns: repeat(5, 1fr);
      gap: 5px;
      width: 100%;
    }
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
    white-space: nowrap;
  }

  @media (max-width: 767px) {
    .mode-btn {
      padding: 6px 8px;
      font-size: 0.6rem;
    }
  }

  @media (max-width: 767px) and (orientation: portrait) {
    .mode-btn {
      padding: 6px 3px;
      gap: 4px;
      font-size: 0.58rem;
    }
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

  @media (max-width: 767px) and (orientation: portrait) {
    .history-actions {
      margin-top: 0;
      flex-shrink: 0;
    }
  }

  .history-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    color: rgba(255, 255, 255, 0.7);
    border-radius: 8px;
    flex: 1;
    padding: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  @media (max-width: 767px) and (orientation: portrait) {
    .history-btn {
      padding: 8px 12px;
    }
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

  @media (max-width: 767px) and (orientation: portrait) {
    .extra-actions {
      margin-top: 0;
      flex-shrink: 0;
    }
  }

  .import-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    background: rgba(0, 191, 255, 0.08);
    border: 1px solid rgba(0, 191, 255, 0.2);
    color: #00bfff;
    border-radius: 8px;
    width: 100%;
    padding: 8px;
    font-size: 0.7rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    letter-spacing: 0.05em;
    white-space: nowrap;
  }

  @media (max-width: 767px) and (orientation: portrait) {
    .import-btn {
      padding: 8px 12px;
    }
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

  @media (max-width: 767px) and (orientation: portrait) {
    .placement-actions {
      margin-top: 0;
    }
  }

  .action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    border-radius: 8px;
    flex: 1;
    padding: 8px 4px;
    font-size: 0.68rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  @media (max-width: 767px) and (orientation: portrait) {
    .action-btn {
      padding: 6px 12px;
    }
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
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.4);
    border-radius: 8px;
    margin-top: auto;
    padding: 10px;
    width: 100%;
    font-size: 0.7rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    letter-spacing: 0.08em;
    white-space: nowrap;
  }

  @media (max-width: 767px) and (orientation: portrait) {
    .clear-canvas-btn {
      margin-top: 0;
      padding: 8px 12px;
      width: auto;
      flex-shrink: 0;
    }
  }

  .clear-canvas-btn:hover {
    background: rgba(255, 51, 68, 0.15);
    border-color: rgba(255, 51, 68, 0.3);
    color: #ff3344;
  }

  .canvas-container {
    position: relative;
    flex-grow: 1;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
    border: 2px solid rgba(255, 204, 0, 0.2);
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    overflow: hidden;
    order: 2;
  }

  @media (max-width: 767px) and (orientation: portrait) {
    .canvas-container {
      order: 1;
    }
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

  .desktop-only-label {
    display: none;
  }

  @media (min-width: 768px) {
    .desktop-only-label {
      display: inline;
    }
  }

  /* Inline visibility adjustments for mobile landscape */
  @media (max-width: 767px) and (orientation: landscape) {
    .mode-text, .import-text, .place-text, .cancel-text {
      display: none;
    }
  }

  @media (max-width: 767px) and (orientation: portrait) {
    .hidden-mobile {
      display: none !important;
    }
  }
</style>
