<script>
  import { onMount, onDestroy } from "svelte";
  import * as THREE from "three";

  let { productTitle = "WOOF CLASSIC T-SHIRT" } = $props();

  let containerEl = $state(null);
  let renderer, scene, camera, shirtGroup;
  let animationFrameId;

  // Interaction state
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };

  function createLogoTexture(title) {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");

    // Draw background color (same as shirt color to blend)
    ctx.fillStyle = "#111111";
    ctx.fillRect(0, 0, 256, 256);

    // Draw logo/text
    ctx.font = "bold 24px monospace";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("WEAREDOGS", 128, 110);

    ctx.font = "14px sans-serif";
    ctx.fillStyle = "#888888";
    ctx.fillText(title, 128, 150);

    return new THREE.CanvasTexture(canvas);
  }

  function initThree() {
    if (!containerEl) return;

    const width = containerEl.clientWidth || 300;
    const height = containerEl.clientHeight || 400;

    // 1. Scene & Camera
    scene = new THREE.Scene();
    scene.background = null; // transparent background

    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 8;

    // 2. Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerEl.appendChild(renderer.domElement);

    // 3. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
    dirLight2.position.set(-5, -5, -2);
    scene.add(dirLight2);

    // 4. Create 3D Shirt Model
    shirtGroup = new THREE.Group();

    // Materials
    const texture = createLogoTexture(productTitle);
    const frontMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.7,
      metalness: 0.1,
      color: 0x222222
    });
    const baseMaterial = new THREE.MeshStandardMaterial({
      roughness: 0.7,
      metalness: 0.1,
      color: 0x222222
    });

    // Torso (Cylinder)
    const torsoGeom = new THREE.CylinderGeometry(1.2, 1.2, 2.5, 32);
    // Apply front material just to a specific part, or just wrap around
    const torso = new THREE.Mesh(torsoGeom, [baseMaterial, frontMaterial, baseMaterial]);
    shirtGroup.add(torso);

    // Left Sleeve
    const leftSleeveGeom = new THREE.CylinderGeometry(0.4, 0.45, 1.0, 16);
    const leftSleeve = new THREE.Mesh(leftSleeveGeom, baseMaterial);
    leftSleeve.position.set(-1.4, 0.7, 0);
    leftSleeve.rotation.z = Math.PI / 4;
    shirtGroup.add(leftSleeve);

    // Right Sleeve
    const rightSleeveGeom = new THREE.CylinderGeometry(0.4, 0.45, 1.0, 16);
    const rightSleeve = new THREE.Mesh(rightSleeveGeom, baseMaterial);
    rightSleeve.position.set(1.4, 0.7, 0);
    rightSleeve.rotation.z = -Math.PI / 4;
    shirtGroup.add(rightSleeve);

    // Neck Collar (Torus)
    const collarGeom = new THREE.TorusGeometry(0.5, 0.1, 16, 100);
    const collar = new THREE.Mesh(collarGeom, baseMaterial);
    collar.position.set(0, 1.25, 0);
    collar.rotation.x = Math.PI / 2;
    shirtGroup.add(collar);

    scene.add(shirtGroup);

    // Initial rotation
    shirtGroup.rotation.y = 0;
    shirtGroup.rotation.x = 0.1;

    // 5. Animation Loop
    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      
      // Gentle auto-rotation when not dragging
      if (!isDragging) {
        shirtGroup.rotation.y += 0.005;
      }
      
      renderer.render(scene, camera);
    }
    animate();
  }

  // Handle Drag / Touch
  function handleMouseDown(e) {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
  }

  function handleMouseMove(e) {
    if (!isDragging || !shirtGroup) return;

    const deltaMove = {
      x: e.clientX - previousMousePosition.x,
      y: e.clientY - previousMousePosition.y
    };

    shirtGroup.rotation.y += deltaMove.x * 0.005;
    shirtGroup.rotation.x += deltaMove.y * 0.005;

    previousMousePosition = { x: e.clientX, y: e.clientY };
  }

  function handleMouseUp() {
    isDragging = false;
  }

  function handleTouchStart(e) {
    if (e.touches.length === 1) {
      isDragging = true;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }

  function handleTouchMove(e) {
    if (!isDragging || !shirtGroup || e.touches.length !== 1) return;

    const deltaMove = {
      x: e.touches[0].clientX - previousMousePosition.x,
      y: e.touches[0].clientY - previousMousePosition.y
    };

    shirtGroup.rotation.y += deltaMove.x * 0.008;
    shirtGroup.rotation.x += deltaMove.y * 0.008;

    previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }

  // Handle resize
  function handleResize() {
    if (!renderer || !camera || !containerEl) return;
    const width = containerEl.clientWidth;
    const height = containerEl.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  // Re-create texture when product title changes
  $effect(() => {
    if (shirtGroup && productTitle) {
      // Find the mesh with multiple materials (the torso)
      const torso = shirtGroup.children.find(child => child.geometry.type === "CylinderGeometry" && child.position.x === 0);
      if (torso && Array.isArray(torso.material)) {
        // Dispose old texture
        if (torso.material[1].map) torso.material[1].map.dispose();
        // Create and assign new texture
        torso.material[1].map = createLogoTexture(productTitle);
        torso.material[1].needsUpdate = true;
      }
    }
  });

  onMount(() => {
    initThree();
    window.addEventListener("resize", handleResize);
  });

  onDestroy(() => {
    window.removeEventListener("resize", handleResize);
    cancelAnimationFrame(animationFrameId);
    if (renderer) {
      renderer.dispose();
    }
  });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div 
  bind:this={containerEl} 
  class="w-full h-full cursor-grab active:cursor-grabbing relative overflow-hidden"
  onmousedown={handleMouseDown}
  onmousemove={handleMouseMove}
  onmouseup={handleMouseUp}
  onmouseleave={handleMouseUp}
  ontouchstart={handleTouchStart}
  ontouchmove={handleTouchMove}
  ontouchend={handleMouseUp}
>
  <div class="absolute bottom-2 left-2 text-[10px] text-white/40 select-none pointer-events-none">
    DRAG TO ROTATE 360°
  </div>
</div>
