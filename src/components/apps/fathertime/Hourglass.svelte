<script>
  import { onMount, onDestroy } from "svelte";
  import * as THREE from "three";

  let { now = new Date(), currentMode = $bindable("minute") } = $props();

  // Canvas and Three.js state
  let containerEl = $state();
  let canvasEl = $state();
  let renderer, scene, camera, frameGroup;
  let instancedMesh, trickleMesh;
  let animationId = null;

  // Rotation flip state
  let isFlipping = false;
  let flipStartTime = 0;
  let flipDuration = 700; // ms
  let startRotation = 0;
  let targetRotation = 0;
  let currentGroupRotation = 0;

  // Neck Gate state
  let gateOpenCount = 0;

  // Modes
  const MODES = ["minute", "hour", "day"];

  // Particles array
  let particles = [];
  let trickleParticles = [];
  const TRICKLE_COUNT = 45;

  // Hourglass geometry constants
  const BULB_HEIGHT = 3.8;
  const NECK_RADIUS = 0.28;
  const CAP_RADIUS = 1.65;

  // Grains config
  const GRAINS_CONFIG = {
    small: {
      radius: 0.08,
      color: 0x7dd3fc,
      mass: 1.0,
    },
    medium: {
      radius: 0.15,
      color: 0xc084fc,
      mass: 1.6,
    },
    large: {
      radius: 0.26,
      color: 0xff55bb,
      mass: 2.8,
    },
  };

  /**
   * Helper to return profile radius of the glass bulb at a given height y.
   * @param {number} y
   */
  function glassRadiusAt(y) {
    const d = Math.abs(y);
    const t = Math.min(1.0, d / BULB_HEIGHT);
    return NECK_RADIUS + Math.pow(t, 1.4) * (CAP_RADIUS - NECK_RADIUS);
  }

  /**
   * Sync particles array to time parameters.
   */
  function initParticles() {
    particles = [];
    trickleParticles = [];
    gateOpenCount = 0;

    const mode = currentMode;
    const d = now || new Date();
    const sec = d.getSeconds();
    const min = d.getMinutes();
    const hr = d.getHours(); // 0 to 23

    let smallTop = 60,
      smallBottom = 0;
    let mediumTop = 0,
      mediumBottom = 0;
    let largeTop = 0,
      largeBottom = 0;

    if (mode === "minute") {
      smallBottom = sec;
      smallTop = 60 - sec;
    } else if (mode === "hour") {
      smallBottom = sec;
      smallTop = 60 - sec;
      mediumBottom = min;
      mediumTop = 60 - min;
    } else {
      // day
      smallBottom = sec;
      smallTop = 60 - sec;
      mediumBottom = min;
      mediumTop = 60 - min;
      largeBottom = hr;
      largeTop = 24 - hr;
    }

    const isBaseOrientation = Math.cos(currentGroupRotation) >= 0;
    const topIsPositiveY = isBaseOrientation;

    const spawnGroup = (type, count, isTop) => {
      const config = GRAINS_CONFIG[type];
      for (let i = 0; i < count; i++) {
        // Spawn randomly distributed inside the target bulb volume
        let py = isTop
          ? 1.2 + Math.random() * (BULB_HEIGHT - 1.4)
          : -1.2 - Math.random() * (BULB_HEIGHT - 1.4);
        const rMax = Math.max(0.1, glassRadiusAt(py) - config.radius - 0.05);
        const theta = Math.random() * Math.PI * 2;
        const r = Math.random() * rMax;

        particles.push({
          pos: new THREE.Vector3(Math.cos(theta) * r, py, Math.sin(theta) * r),
          vel: new THREE.Vector3(0, 0, 0),
          type,
          radius: config.radius,
          color: config.color,
          mass: config.mass,
        });
      }
    };

    spawnGroup("small", smallTop, topIsPositiveY);
    spawnGroup("small", smallBottom, !topIsPositiveY);

    if (mode === "hour" || mode === "day") {
      spawnGroup("medium", mediumTop, topIsPositiveY);
      spawnGroup("medium", mediumBottom, !topIsPositiveY);
    }
    if (mode === "day") {
      spawnGroup("large", largeTop, topIsPositiveY);
      spawnGroup("large", largeBottom, !topIsPositiveY);
    }

    // Initialize visual trickle stream
    const targetColor = GRAINS_CONFIG.small.color;
    for (let i = 0; i < TRICKLE_COUNT; i++) {
      const yOffset = (Math.random() - 0.5) * BULB_HEIGHT * 1.5;
      trickleParticles.push({
        pos: new THREE.Vector3(
          (Math.random() - 0.5) * 0.08,
          yOffset,
          (Math.random() - 0.5) * 0.08,
        ),
        vel: new THREE.Vector3(0, -0.06 - Math.random() * 0.04, 0),
        color: targetColor,
        active: true,
      });
    }

    // Pre-settle particles so they appear as static, stable piles instantly on mount
    const localGravY = topIsPositiveY ? -0.009 : 0.009;
    for (let step = 0; step < 85; step++) {
      runPhysicsStep(0, localGravY, 0);
    }

    recreateInstancedMesh();
  }

  function recreateInstancedMesh() {
    if (!scene || !frameGroup) return;

    if (instancedMesh) {
      frameGroup.remove(instancedMesh);
      instancedMesh.dispose();
    }
    if (trickleMesh) {
      frameGroup.remove(trickleMesh);
      trickleMesh.dispose();
    }

    const count = particles.length;
    if (count > 0) {
      const particleGeo = new THREE.DodecahedronGeometry(0.12, 0);
      const particleMat = new THREE.MeshStandardMaterial({
        roughness: 0.9,
        metalness: 0.05,
      });
      instancedMesh = new THREE.InstancedMesh(particleGeo, particleMat, count);
      frameGroup.add(instancedMesh);
    }

    const trickleGeo = new THREE.BoxGeometry(0.04, 0.04, 0.04);
    const trickleMat = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.65,
    });
    trickleMesh = new THREE.InstancedMesh(
      trickleGeo,
      trickleMat,
      TRICKLE_COUNT,
    );
    frameGroup.add(trickleMesh);
  }

  function teleportGrains(type, toTop) {
    const isBaseOrientation = Math.cos(currentGroupRotation) >= 0;
    const targetTop = isBaseOrientation ? toTop : !toTop;

    particles.forEach((p) => {
      if (p.type === type) {
        let py = targetTop
          ? 1.2 + Math.random() * (BULB_HEIGHT - 1.4)
          : -1.2 - Math.random() * (BULB_HEIGHT - 1.4);
        const rMax = Math.max(0.1, glassRadiusAt(py) - p.radius - 0.05);
        const theta = Math.random() * Math.PI * 2;
        const r = Math.random() * rMax;
        p.pos.set(Math.cos(theta) * r, py, Math.sin(theta) * r);
        p.vel.set(0, 0, 0);
      }
    });
  }

  function teleportOneGrain(type, toTop) {
    const isBaseOrientation = Math.cos(currentGroupRotation) >= 0;
    const targetTop = isBaseOrientation ? toTop : !toTop;

    const grain = particles.find(
      (p) => p.type === type && (targetTop ? p.pos.y < 0 : p.pos.y > 0),
    );
    if (grain) {
      grain.pos.set(
        (Math.random() - 0.5) * 0.05,
        targetTop ? 0.22 : -0.22,
        (Math.random() - 0.5) * 0.05,
      );
      grain.vel.set(0, targetTop ? 0.05 : -0.05, 0);
    }
  }

  function triggerFlip() {
    if (isFlipping) return;
    isFlipping = true;
    flipStartTime = performance.now();
    startRotation = currentGroupRotation;
    targetRotation = currentGroupRotation + Math.PI;
  }

  // Time boundary state
  let lastSec = -1;
  let lastMin = -1;
  let lastHr = -1;

  let boundaryMin = new Date().getMinutes();
  let boundaryHr = new Date().getHours();
  let boundaryDay = new Date().getDate();

  $effect(() => {
    const mode = currentMode;
    initParticles();

    const d = now || new Date();
    boundaryMin = d.getMinutes();
    boundaryHr = d.getHours();
    boundaryDay = d.getDate();
  });

  $effect(() => {
    if (!now) return;
    const sec = now.getSeconds();
    const min = now.getMinutes();
    const hr = now.getHours();
    const date = now.getDate();

    if (lastSec === -1) {
      lastSec = sec;
      lastMin = min;
      lastHr = hr;
      return;
    }
    if (isFlipping) return;

    const mode = currentMode;

    // Check full flips
    if (mode === "minute" && min !== boundaryMin) {
      boundaryMin = min;
      triggerFlip();
      lastSec = sec;
      lastMin = min;
      lastHr = hr;
      return;
    }
    if (mode === "hour" && hr !== boundaryHr) {
      boundaryHr = hr;
      triggerFlip();
      lastSec = sec;
      lastMin = min;
      lastHr = hr;
      return;
    }
    if (mode === "day" && date !== boundaryDay) {
      boundaryDay = date;
      triggerFlip();
      lastSec = sec;
      lastMin = min;
      lastHr = hr;
      return;
    }

    if (sec === lastSec) return;

    // Tick release
    gateOpenCount++;

    if (mode === "hour") {
      if (min !== lastMin) {
        teleportGrains("small", true);
        teleportOneGrain("medium", false);
      }
    } else if (mode === "day") {
      if (min !== lastMin) {
        teleportGrains("small", true);
        teleportOneGrain("medium", false);
      }
      if (hr !== lastHr) {
        teleportGrains("medium", true);
        teleportOneGrain("large", false);
      }
    }

    lastSec = sec;
    lastMin = min;
    lastHr = hr;
  });

  /**
   * Run one step of gravity, funnel forces, collisions, and particle stacking.
   */
  function runPhysicsStep(localGravX, localGravY, localGravZ) {
    const topIsPositiveY = localGravY < 0;
    const topGrainsCount = particles.filter((p) =>
      topIsPositiveY ? p.pos.y > 0.1 : p.pos.y < -0.1,
    ).length;
    const hasTopGrains = topGrainsCount > 0;

    // 1. Particle velocities & gravity & funnel
    particles.forEach((p) => {
      p.vel.x += localGravX * p.mass;
      p.vel.y += localGravY * p.mass;
      p.vel.z += localGravZ * p.mass;

      // Funnel draw force towards center vertical axis for top grains
      const isTopBulb = topIsPositiveY ? p.pos.y > 0.1 : p.pos.y < -0.1;
      if (isTopBulb) {
        p.vel.x += -p.pos.x * 0.014;
        p.vel.z += -p.pos.z * 0.014;
      }

      p.vel.x *= 0.95;
      p.vel.y *= 0.95;
      p.vel.z *= 0.95;

      p.pos.add(p.vel);

      // Glass collision
      const rMax = Math.max(p.radius, glassRadiusAt(p.pos.y) - p.radius - 0.02);
      const r = Math.sqrt(p.pos.x * p.pos.x + p.pos.z * p.pos.z);
      if (r > rMax) {
        p.pos.x = rMax * (p.pos.x / (r || 1)) * 0.99;
        p.pos.z = rMax * (p.pos.z / (r || 1)) * 0.99;
        p.vel.x *= -0.1;
        p.vel.z *= -0.1;
      }

      // Caps collision
      const maxY = BULB_HEIGHT + 0.15;
      if (p.pos.y > maxY - p.radius) {
        p.pos.y = maxY - p.radius;
        p.vel.y *= -0.1;
      }
      if (p.pos.y < -maxY + p.radius) {
        p.pos.y = -maxY + p.radius;
        p.vel.y *= -0.1;
      }

      // Neck Gate block
      const gateY = localGravY < 0 ? 0.06 : -0.06;
      const isCrossingGate =
        localGravY < 0
          ? p.pos.y - p.vel.y > gateY && p.pos.y <= gateY
          : p.pos.y - p.vel.y < gateY && p.pos.y >= gateY;

      if (isCrossingGate) {
        const rad = Math.sqrt(p.pos.x * p.pos.x + p.pos.z * p.pos.z);
        if (gateOpenCount > 0 && rad < 0.28) {
          gateOpenCount--;
        } else {
          p.pos.y = gateY;
          p.vel.y = -p.vel.y * 0.1;
        }
      }
    });

    // 2. Trickle stream particles update
    trickleParticles.forEach((p) => {
      p.vel.x += localGravX * 1.5;
      p.vel.y += localGravY * 1.5;
      p.vel.z += localGravZ * 1.5;

      p.vel.x *= 0.92;
      p.vel.y *= 0.92;
      p.vel.z *= 0.92;
      p.pos.add(p.vel);

      const rMax = Math.max(0.02, glassRadiusAt(p.pos.y) - 0.02);
      const r = Math.sqrt(p.pos.x * p.pos.x + p.pos.z * p.pos.z);
      if (r > rMax) {
        p.pos.x = rMax * (p.pos.x / (r || 1)) * 0.98;
        p.pos.z = rMax * (p.pos.z / (r || 1)) * 0.98;
      }

      const isBottom = localGravY < 0 ? p.pos.y < -1.8 : p.pos.y > 1.8;
      if (isBottom) {
        if (hasTopGrains && !isFlipping) {
          p.pos.set(
            (Math.random() - 0.5) * 0.08,
            localGravY < 0 ? 0.15 : -0.15,
            (Math.random() - 0.5) * 0.08,
          );
          p.vel.set(0, localGravY < 0 ? -0.06 : 0.06, 0);
          p.active = true;
        } else {
          p.pos.set(0, 9999, 0);
          p.active = false;
        }
      }
    });

    // 3. Particle-particle collision resolver (2 iterations for solid pile stacking)
    for (let step = 0; step < 2; step++) {
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p2.pos.x - p1.pos.x;
          const dy = p2.pos.y - p1.pos.y;
          const dz = p2.pos.z - p1.pos.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          const minDist = p1.radius + p2.radius;

          if (dist < minDist) {
            const overlap = minDist - dist;
            const nx = dx / (dist || 1);
            const ny = dy / (dist || 1);
            const nz = dz / (dist || 1);

            const pushX = nx * overlap * 0.5;
            const pushY = ny * overlap * 0.5;
            const pushZ = nz * overlap * 0.5;

            p1.pos.x -= pushX;
            p1.pos.y -= pushY;
            p1.pos.z -= pushZ;

            p2.pos.x += pushX;
            p2.pos.y += pushY;
            p2.pos.z += pushZ;

            p1.vel.x -= pushX * 0.06;
            p1.vel.y -= pushY * 0.06;
            p1.vel.z -= pushZ * 0.06;

            p2.vel.x += pushX * 0.06;
            p2.vel.y += pushY * 0.06;
            p2.vel.z += pushZ * 0.06;
          }
        }
      }
    }
  }

  /**
   * Render frame and execute particle-particle physics.
   */
  function frame(timestamp) {
    const canvas = canvasEl;
    if (!renderer || !scene || !canvas) return;

    let gravityY = -0.0095;

    if (isFlipping) {
      const elapsed = timestamp - flipStartTime;
      const progress = Math.min(1.0, elapsed / flipDuration);
      const ease = 1 - Math.pow(1 - progress, 3);
      currentGroupRotation =
        startRotation + (targetRotation - startRotation) * ease;

      if (frameGroup) {
        frameGroup.rotation.x = currentGroupRotation;
      }

      if (progress >= 1.0) {
        isFlipping = false;
        currentGroupRotation = currentGroupRotation % (Math.PI * 2);
        if (frameGroup) {
          frameGroup.rotation.x = currentGroupRotation;
        }
      }
    }

    const cosR = Math.cos(currentGroupRotation);
    const sinR = Math.sin(currentGroupRotation);
    const localGravY = gravityY * cosR;
    const localGravZ = gravityY * sinR;

    // Run continuous dynamic physics solver for every frame!
    runPhysicsStep(0, localGravY, localGravZ);

    // Update main instanced mesh
    if (instancedMesh) {
      const dummy = new THREE.Object3D();
      particles.forEach((p, i) => {
        dummy.position.copy(p.pos);
        dummy.scale.setScalar(p.radius / 0.12);
        dummy.updateMatrix();
        instancedMesh.setMatrixAt(i, dummy.matrix);
        instancedMesh.setColorAt(i, new THREE.Color(p.color));
      });
      instancedMesh.instanceMatrix.needsUpdate = true;
      if (instancedMesh.instanceColor) {
        instancedMesh.instanceColor.needsUpdate = true;
      }
    }

    // Update trickle instanced mesh
    if (trickleMesh) {
      const dummy = new THREE.Object3D();
      trickleParticles.forEach((p, i) => {
        dummy.position.copy(p.pos);
        dummy.scale.setScalar(1);
        dummy.updateMatrix();
        trickleMesh.setMatrixAt(i, dummy.matrix);
        trickleMesh.setColorAt(i, new THREE.Color(p.color));
      });
      trickleMesh.instanceMatrix.needsUpdate = true;
      if (trickleMesh.instanceColor) {
        trickleMesh.instanceColor.needsUpdate = true;
      }
    }

    renderer.render(scene, camera);
    animationId = requestAnimationFrame(frame);
    canvas.__threeAnimationId = animationId;
  }

  function disposeRenderer(rendererInstance, sceneInstance) {
    if (rendererInstance) {
      try {
        rendererInstance.dispose();
      } catch (e) {
        console.warn("Error disposing Three.js renderer:", e);
      }
    }
    if (sceneInstance) {
      sceneInstance.traverse((object) => {
        if (object.isMesh) {
          object.geometry?.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((mat) => mat.dispose());
          } else {
            object.material?.dispose();
          }
        }
      });
    }
  }

  function initThree() {
    const canvas = canvasEl;
    if (!canvas) return;

    if (canvas.__threeAnimationId) {
      cancelAnimationFrame(canvas.__threeAnimationId);
      canvas.__threeAnimationId = null;
    }
    if (canvas.__threeRenderer) {
      disposeRenderer(canvas.__threeRenderer, canvas.__threeScene);
      canvas.__threeRenderer = null;
      canvas.__threeScene = null;
    }

    const width = 160;
    const height = 240;

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    canvas.__threeRenderer = renderer;

    scene = new THREE.Scene();
    canvas.__threeScene = scene;

    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 13.0);

    frameGroup = new THREE.Group();
    scene.add(frameGroup);

    // End Caps Material (dark plastic/wood)
    const capMat = new THREE.MeshStandardMaterial({
      color: 0x181822,
      roughness: 0.55,
      metalness: 0.5,
    });
    const capGeo = new THREE.CylinderGeometry(
      CAP_RADIUS + 0.15,
      CAP_RADIUS + 0.15,
      0.4,
      24,
    );

    const topCap = new THREE.Mesh(capGeo, capMat);
    topCap.position.y = BULB_HEIGHT + 0.2;
    frameGroup.add(topCap);

    const bottomCap = new THREE.Mesh(capGeo, capMat);
    bottomCap.position.y = -BULB_HEIGHT - 0.2;
    frameGroup.add(bottomCap);

    // Pillars Material (chrome metal)
    const pillarMat = new THREE.MeshStandardMaterial({
      color: 0x888899,
      roughness: 0.12,
      metalness: 0.95,
    });
    const pillarGeo = new THREE.CylinderGeometry(
      0.08,
      0.08,
      BULB_HEIGHT * 2 + 0.4,
      12,
    );

    const angles = [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3];
    const rOffset = CAP_RADIUS - 0.05;
    angles.forEach((angle) => {
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.set(
        Math.cos(angle) * rOffset,
        0,
        Math.sin(angle) * rOffset,
      );
      frameGroup.add(pillar);
    });

    // Glass lathe
    const points = [];
    for (let i = 0; i <= 25; i++) {
      const t = i / 25;
      const y = (t - 0.5) * BULB_HEIGHT * 2;
      const r = glassRadiusAt(y);
      points.push(new THREE.Vector2(r, y));
    }
    const glassGeo = new THREE.LatheGeometry(points, 36);
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.16,
      roughness: 0.05,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    frameGroup.add(glassMesh);

    recreateInstancedMesh();

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.25);
    dirLight.position.set(2, 4, 6);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x7dd3fc, 1.5, 8);
    pointLight.position.set(0, 0, 1);
    scene.add(pointLight);

    animationId = requestAnimationFrame(frame);
    canvas.__threeAnimationId = animationId;
  }

  function cycleMode(dir) {
    if (isFlipping) return;
    const idx = MODES.indexOf(currentMode);
    currentMode = MODES[(idx + dir + 3) % 3];
  }

  function handleModeCycle() {
    cycleMode(1);
  }

  function handleWheel(e) {
    if (!e.shiftKey) return;
    e.preventDefault();
    e.stopPropagation();
    cycleMode(e.deltaY > 0 ? 1 : -1);
  }

  onMount(() => {
    containerEl?.addEventListener("wheel", handleWheel, { passive: false });
    initParticles();
    initThree();
  });

  onDestroy(() => {
    containerEl?.removeEventListener("wheel", handleWheel);

    if (animationId) {
      cancelAnimationFrame(animationId);
      const canvas = canvasEl;
      if (canvas && canvas.__threeAnimationId === animationId) {
        canvas.__threeAnimationId = null;
      }
    }

    if (renderer) {
      const canvas = canvasEl;
      if (canvas && canvas.__threeRenderer === renderer) {
        disposeRenderer(renderer, scene);
        canvas.__threeRenderer = null;
        canvas.__threeScene = null;
      } else {
        disposeRenderer(renderer, scene);
      }
    }
  });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  bind:this={containerEl}
  class="hourglass-widget"
  class:minute-mode={currentMode === "minute"}
  class:hour-mode={currentMode === "hour"}
  class:day-mode={currentMode === "day"}
  onclick={handleModeCycle}
  role="button"
  tabindex="0"
  aria-label={`Hourglass clock in ${currentMode} mode. Click or Shift+scroll to cycle.`}
  onkeydown={(e) => e.key === "Enter" && handleModeCycle()}
>
  <canvas bind:this={canvasEl} width="160" height="240"></canvas>

  <div class="mode-metadata">
    <span class="mode-tag">{currentMode} Glass</span>
    <span class="mode-desc">
      {#if currentMode === "minute"}
        <span class="dot-key s-key">&#9679;</span> 1 grain = 1 sec
      {:else if currentMode === "hour"}
        <span class="dot-key s-key">&#9679;</span> sec &nbsp;
        <span class="dot-key l-key">&#9679;</span> min
      {:else}
        <span class="dot-key s-key">&#9679;</span> min &nbsp;
        <span class="dot-key l-key">&#9679;</span> hr
      {/if}
    </span>
  </div>
</div>

<style>
  .hourglass-widget {
    width: 184px;
    min-width: 184px;
    min-height: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    padding: 12px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    transition:
      background 0.3s ease,
      box-shadow 0.3s ease;
    user-select: none;
    overflow: hidden;
  }

  .hourglass-widget:hover {
    background: rgba(255, 255, 255, 0.04);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.45);
  }

  .hourglass-widget.minute-mode {
    --accent: #7dd3fc;
  }
  .hourglass-widget.hour-mode {
    --accent: #60a5fa;
  }
  .hourglass-widget.day-mode {
    --accent: #c084fc;
  }

  canvas {
    display: block;
    width: 160px;
    height: 240px;
    background: transparent;
  }

  .mode-metadata {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    height: 36px;
    justify-content: center;
  }

  .mode-tag {
    color: var(--accent, #7dd3fc);
    font-size: 9px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    padding: 2px 8px;
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    background: rgba(255, 255, 255, 0.02);
    white-space: nowrap;
    transition: color 0.3s ease;
  }

  .mode-desc {
    display: flex;
    align-items: center;
    font-size: 8px;
    color: rgba(255, 255, 255, 0.3);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 700;
    gap: 3px;
    white-space: nowrap;
  }

  .dot-key {
    line-height: 1;
  }
  .s-key {
    color: #fcd34d;
    font-size: 6px;
  }
  .l-key {
    color: #60a5fa;
    font-size: 10px;
  }

  .day-mode .s-key {
    color: #818cf8;
  }
  .day-mode .l-key {
    color: #c084fc;
  }
  .minute-mode .s-key {
    color: #7dd3fc;
    font-size: 8px;
  }
</style>
