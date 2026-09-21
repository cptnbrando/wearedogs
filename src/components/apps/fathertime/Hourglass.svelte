<script>
  import { onMount, onDestroy, untrack } from "svelte";
  import * as THREE from "three";

  let { now = new Date(), currentMode = $bindable("minute") } = $props();

  // Canvas and Three.js state
  let containerEl = $state();
  let canvasEl = $state();
  let renderer, scene, camera;
  let rig; // idle sway + hop; holds the hourglass and the effects
  let frameGroup; // the hourglass itself; rotation.x is the flip
  let grainMesh, grainInkMesh, trickleMesh;
  let animationId = null;
  let reducedMotion = false;

  // Flip state
  let isFlipping = false;
  let flipStartTime = 0;
  const FLIP_MS = 1150;
  let startRotation = 0;
  let targetRotation = 0;
  let currentGroupRotation = 0;
  let landedAt = -1; // timestamp of the last landing, drives the squash

  // Neck gate: how many second-grains may still drop
  let gateOpenCount = 0;

  const MODES = ["minute", "hour", "day"];

  let particles = [];
  let trickleParticles = [];
  const TRICKLE_COUNT = 40;

  // Hourglass geometry constants
  const BULB_HEIGHT = 3.8;
  const NECK_RADIUS = 0.28;
  const CAP_RADIUS = 1.65;
  const GRAIN_GEO_RADIUS = 0.12;

  // Fixed physics rate, rendered with interpolation so it is equally smooth
  // at 60, 120 or 144 Hz (the old loop stepped once per frame).
  const STEP_MS = 1000 / 60;
  const GRAVITY = -0.0095;
  let accumulator = 0;
  let lastTimestamp = 0;

  // Palette — flat, saturated, a little storybook
  const INK = 0x1b1436;
  const GOLD = 0xf6bb3a;
  const GOLD_DEEP = 0xc9832a;
  const SEA = 0x2ec4c7;

  // Grains: golden sand for seconds, sea blue for minutes, ruby for hours
  const GRAINS_CONFIG = {
    small: { radius: 0.125, color: 0xffd65c, mass: 1.0 },
    medium: { radius: 0.18, color: 0x38b6ff, mass: 1.6 },
    large: { radius: 0.27, color: 0xff5470, mass: 2.8 },
  };

  /**
   * Profile radius of the glass at height y: a funnel out of the neck that
   * rounds into a full shoulder, rather than a straight cone.
   */
  function glassRadiusAt(y) {
    const t = Math.min(1.0, Math.abs(y) / BULB_HEIGHT);
    return NECK_RADIUS + Math.pow(Math.sin(t * Math.PI * 0.5), 0.9) * (CAP_RADIUS - NECK_RADIUS);
  }

  /** True when the +Y bulb is currently the upper one. */
  function topIsPositiveY() {
    return Math.cos(currentGroupRotation) >= 0;
  }

  function inBottom(p) {
    return topIsPositiveY() ? p.pos.y < 0 : p.pos.y > 0;
  }

  function randomSpotInBulb(radius, positiveY, out) {
    const py = (positiveY ? 1 : -1) * (1.2 + Math.random() * (BULB_HEIGHT - 1.4));
    const rMax = Math.max(0.1, glassRadiusAt(py) - radius - 0.05);
    const theta = Math.random() * Math.PI * 2;
    const r = Math.random() * rMax;
    return out.set(Math.cos(theta) * r, py, Math.sin(theta) * r);
  }

  /** Build the sand from the clock: grains already "spent" start in the bottom. */
  function initParticles() {
    particles = [];
    trickleParticles = [];
    gateOpenCount = 0;

    const mode = currentMode;
    const d = now || new Date();
    const sec = d.getSeconds();
    const min = d.getMinutes();
    const hr = d.getHours();
    const topPos = topIsPositiveY();

    const spawnGroup = (type, count, isTop) => {
      const config = GRAINS_CONFIG[type];
      for (let i = 0; i < count; i++) {
        const pos = randomSpotInBulb(config.radius, isTop ? topPos : !topPos, new THREE.Vector3());
        particles.push({
          pos,
          prev: pos.clone(),
          vel: new THREE.Vector3(),
          type,
          radius: config.radius,
          color: config.color,
          mass: config.mass,
          appear: 0, // 0 -> 1 pop-in
          touching: false,
        });
      }
    };

    spawnGroup("small", 60 - sec, true);
    spawnGroup("small", sec, false);
    if (mode === "hour" || mode === "day") {
      spawnGroup("medium", 60 - min, true);
      spawnGroup("medium", min, false);
    }
    if (mode === "day") {
      spawnGroup("large", 24 - hr, true);
      spawnGroup("large", hr, false);
    }

    for (let i = 0; i < TRICKLE_COUNT; i++) {
      const pos = new THREE.Vector3(0, 9999, 0);
      trickleParticles.push({
        pos,
        prev: pos.clone(),
        vel: new THREE.Vector3(),
        size: 0.6 + Math.random() * 0.8,
        delay: i * 2, // stagger the first launch so the stream isn't a clump
      });
    }

    // Pre-settle so the piles are already at rest on the first frame
    const g = topPos ? GRAVITY : -GRAVITY;
    for (let step = 0; step < 110; step++) runPhysicsStep(g, 0);
    for (const p of particles) p.prev.copy(p.pos);

    rebuildGrainMeshes();
  }

  function rebuildGrainMeshes() {
    if (!scene || !frameGroup) return;

    for (const m of [grainMesh, grainInkMesh, trickleMesh]) {
      if (!m) continue;
      frameGroup.remove(m);
      m.geometry.dispose();
      m.material.dispose();
      m.dispose();
    }
    grainMesh = grainInkMesh = trickleMesh = null;

    const count = particles.length;
    if (count > 0) {
      const geo = new THREE.IcosahedronGeometry(GRAIN_GEO_RADIUS, 1);
      grainMesh = new THREE.InstancedMesh(geo, toonMaterial(0xffffff), count);
      grainInkMesh = new THREE.InstancedMesh(geo.clone(), inkMaterial(0.022), count);
      // Colours never change after spawn — set them once, not every frame
      const c = new THREE.Color();
      particles.forEach((p, i) => grainMesh.setColorAt(i, c.set(p.color)));
      grainMesh.instanceColor.needsUpdate = true;
      grainMesh.frustumCulled = grainInkMesh.frustumCulled = false;
      frameGroup.add(grainInkMesh, grainMesh);
    }

    trickleMesh = new THREE.InstancedMesh(
      new THREE.IcosahedronGeometry(0.034, 0),
      new THREE.MeshBasicMaterial({ color: 0xffe9a3 }),
      TRICKLE_COUNT,
    );
    trickleMesh.frustumCulled = false;
    frameGroup.add(trickleMesh);
  }

  /** Send every `type` grain in the bottom back up, in a puff. */
  function returnGrainsToTop(type) {
    const topPos = topIsPositiveY();
    let moved = 0;
    for (const p of particles) {
      if (p.type !== type || !inBottom(p)) continue;
      randomSpotInBulb(p.radius, topPos, p.pos);
      p.prev.copy(p.pos);
      p.vel.set(0, 0, 0);
      p.appear = 0;
      moved++;
    }
    if (moved > 0) {
      const dir = topPos ? 1 : -1;
      poof(0, -2.2 * dir, 1.0, 4, 0.7);
      poof(0, 2.2 * dir, 1.0, 5, 0.8);
    }
  }

  /** Drop one `type` grain from just under the neck. */
  function dropOneGrain(type) {
    const topPos = topIsPositiveY();
    const grain = particles.find((p) => p.type === type && !inBottom(p));
    if (!grain) return;
    // far enough under the neck that the glass is wide enough to hold it
    const drop = 0.2 + grain.radius * 2.2;
    grain.pos.set((Math.random() - 0.5) * 0.05, topPos ? -drop : drop, (Math.random() - 0.5) * 0.05);
    grain.prev.copy(grain.pos);
    grain.vel.set(0, topPos ? -0.05 : 0.05, 0);
  }

  /**
   * Keep the sand honest with the clock. `expected` grains of `type` belong
   * in the bottom bulb. Seconds trickle through the gate; minutes and hours
   * are too big for the neck and drop one at a time.
   */
  function reconcile(type, expected) {
    const have = particles.reduce((n, p) => n + (p.type === type && inBottom(p) ? 1 : 0), 0);
    if (have - expected > 1) {
      returnGrainsToTop(type); // rollover: 59 spent grains, 0 expected
      return;
    }
    const deficit = expected - have;
    if (deficit > 6) {
      // Far behind (tab was asleep, or a missed flip): don't fire a burst
      // through the neck — just put the sand where the clock says it is.
      const topPos = topIsPositiveY();
      let left = deficit;
      for (const p of particles) {
        if (left === 0) break;
        if (p.type !== type || inBottom(p)) continue;
        randomSpotInBulb(p.radius, !topPos, p.pos);
        p.prev.copy(p.pos);
        p.vel.set(0, 0, 0);
        p.appear = 0;
        left--;
      }
      return;
    }
    if (type === "small") {
      gateOpenCount = Math.max(0, Math.min(deficit, 2));
      for (let k = 2; k < deficit; k++) dropOneGrain(type); // clogged neck: catch up
    } else {
      for (let k = 0; k < deficit; k++) dropOneGrain(type);
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
  let boundaryMin = new Date().getMinutes();
  let boundaryHr = new Date().getHours();
  let boundaryDay = new Date().getDate();
  let firstInit = true;

  // Rebuild the sand ONLY when the mode changes. `now` is read untracked:
  // tracking it re-ran this every second and respawned every grain at random,
  // which is what made the old hourglass twitch once a second.
  $effect(() => {
    currentMode;
    untrack(() => {
      initParticles();
      const d = now || new Date();
      boundaryMin = d.getMinutes();
      boundaryHr = d.getHours();
      boundaryDay = d.getDate();
      if (!firstInit) poof(0, 0, 1.4, 6, 1.0);
      firstInit = false;
    });
  });

  // Once a second: flip on the mode's boundary, otherwise release sand.
  $effect(() => {
    if (!now) return;
    const sec = now.getSeconds();
    const min = now.getMinutes();
    const hr = now.getHours();
    const date = now.getDate();

    untrack(() => {
      if (lastSec === -1) {
        lastSec = sec;
        return;
      }
      if (isFlipping || sec === lastSec) return;
      lastSec = sec;

      const mode = currentMode;
      if (mode === "minute" && min !== boundaryMin) {
        boundaryMin = min;
        return triggerFlip();
      }
      if (mode === "hour" && hr !== boundaryHr) {
        boundaryHr = hr;
        boundaryMin = min;
        return triggerFlip();
      }
      if (mode === "day" && date !== boundaryDay) {
        boundaryDay = date;
        return triggerFlip();
      }

      if (mode === "day") reconcile("large", hr);
      if (mode !== "minute") reconcile("medium", min);
      reconcile("small", sec);
      if (gateOpenCount > 0) sparkle(0, 0, 0.5, 0.55);
    });
  });

  /** One fixed step: gravity, funnel, glass, neck gate, grain-on-grain. */
  function runPhysicsStep(gravY, gravZ) {
    const topPos = gravY < 0;
    const gateY = topPos ? 0.06 : -0.06;
    let hasTopGrains = false;

    for (const p of particles) {
      p.prev.copy(p.pos);
      p.wasAbove = topPos ? p.pos.y > gateY : p.pos.y < gateY;

      p.vel.y += gravY * p.mass;
      p.vel.z += gravZ * p.mass;

      const isTopBulb = topPos ? p.pos.y > 0.1 : p.pos.y < -0.1;
      if (isTopBulb) {
        hasTopGrains = true;
        if (p.type === "small") {
          // Funnel: sand drifts toward the neck
          p.vel.x -= p.pos.x * 0.014;
          p.vel.z -= p.pos.z * 0.014;
        } else if (Math.abs(p.pos.y) < 1.3) {
          // Big grains can't pass — ring them around the hole instead of
          // letting them plug it and starve the second-grains.
          const r = Math.hypot(p.pos.x, p.pos.z) || 1;
          if (r < 0.55) {
            p.vel.x += (p.pos.x / r) * 0.006;
            p.vel.z += (p.pos.z / r) * 0.006;
          }
        }
      }

      // Resting grains bleed energy faster: piles go still instead of fizzing
      p.vel.multiplyScalar(p.touching ? 0.9 : 0.95);
      p.touching = false;
      p.pos.add(p.vel);

      // Glass wall
      const rMax = Math.max(0.001, glassRadiusAt(p.pos.y) - p.radius - 0.02);
      const r = Math.hypot(p.pos.x, p.pos.z);
      if (r > rMax) {
        const k = (rMax / (r || 1)) * 0.99;
        p.pos.x *= k;
        p.pos.z *= k;
        p.vel.x *= -0.1;
        p.vel.z *= -0.1;
        p.touching = true;
      }

      // End caps
      const maxY = BULB_HEIGHT + 0.15 - p.radius;
      if (p.pos.y > maxY) {
        p.pos.y = maxY;
        p.vel.y *= -0.1;
        p.touching = true;
      } else if (p.pos.y < -maxY) {
        p.pos.y = -maxY;
        p.vel.y *= -0.1;
        p.touching = true;
      }

    }

    // Fine sand stream under the neck
    for (const t of trickleParticles) {
      t.prev.copy(t.pos);
      if (t.delay > 0) {
        t.delay--;
        continue;
      }
      const spent = t.pos.y > 9000 || (topPos ? t.pos.y < -1.9 : t.pos.y > 1.9);
      if (spent) {
        if (hasTopGrains && !isFlipping) {
          t.pos.set((Math.random() - 0.5) * 0.07, topPos ? 0.12 : -0.12, (Math.random() - 0.5) * 0.07);
          t.vel.set((Math.random() - 0.5) * 0.004, (topPos ? -1 : 1) * (0.05 + Math.random() * 0.02), (Math.random() - 0.5) * 0.004);
        } else {
          t.pos.set(0, 9999, 0);
        }
        t.prev.copy(t.pos);
        continue;
      }
      t.vel.y += gravY * 1.5;
      t.vel.z += gravZ * 1.5;
      t.vel.multiplyScalar(0.94);
      t.pos.add(t.vel);
      const rMax = Math.max(0.02, glassRadiusAt(t.pos.y) - 0.03);
      const r = Math.hypot(t.pos.x, t.pos.z);
      if (r > rMax) {
        const k = (rMax / (r || 1)) * 0.98;
        t.pos.x *= k;
        t.pos.z *= k;
      }
    }

    // Grain-on-grain (2 passes for solid stacking)
    const n = particles.length;
    for (let pass = 0; pass < 2; pass++) {
      for (let i = 0; i < n; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < n; j++) {
          const p2 = particles[j];
          const dy = p2.pos.y - p1.pos.y;
          const minDist = p1.radius + p2.radius;
          if (dy > minDist || dy < -minDist) continue;
          const dx = p2.pos.x - p1.pos.x;
          const dz = p2.pos.z - p1.pos.z;
          const distSq = dx * dx + dy * dy + dz * dz;
          if (distSq >= minDist * minDist) continue;

          const dist = Math.sqrt(distSq) || 1;
          const push = ((minDist - dist) * 0.5) / dist;
          const px = dx * push;
          const py = dy * push;
          const pz = dz * push;

          p1.pos.x -= px;
          p1.pos.y -= py;
          p1.pos.z -= pz;
          p2.pos.x += px;
          p2.pos.y += py;
          p2.pos.z += pz;

          p1.vel.x -= px * 0.06;
          p1.vel.y -= py * 0.06;
          p1.vel.z -= pz * 0.06;
          p2.vel.x += px * 0.06;
          p2.vel.y += py * 0.06;
          p2.vel.z += pz * 0.06;
          p1.touching = p2.touching = true;
        }
      }
    }

    // Neck gate — only a second-grain holding a ticket gets through. Checked
    // last: the weight of the pile shoves grains through the neck during
    // collision resolution, not just under their own velocity.
    for (const p of particles) {
      if (!p.wasAbove) continue;
      const crossed = topPos ? p.pos.y <= gateY : p.pos.y >= gateY;
      if (!crossed) continue;
      if (p.type === "small" && gateOpenCount > 0 && Math.hypot(p.pos.x, p.pos.z) < NECK_RADIUS) {
        gateOpenCount--;
      } else {
        p.pos.y = gateY + (topPos ? 0.001 : -0.001);
        if (topPos ? p.vel.y < 0 : p.vel.y > 0) p.vel.y *= -0.1;
        p.touching = true;
      }
    }
  }

  // ── Easing ──
  const easeOutBack = (t) => 1 + 2.4 * Math.pow(t - 1, 3) + 1.4 * Math.pow(t - 1, 2);
  // Wind-up, swing through, small overshoot, settle
  function easeInOutBack(t) {
    const c = 1.2 * 1.525;
    return t < 0.5
      ? (Math.pow(2 * t, 2) * ((c + 1) * 2 * t - c)) / 2
      : (Math.pow(2 * t - 2, 2) * ((c + 1) * (t * 2 - 2) + c) + 2) / 2;
  }

  // ── Effects: four-point sparkles and swirly puffs, pooled sprites ──
  let sparkles = [];
  let puffs = [];
  let nextAmbientSparkle = 0;

  function makeCanvasTexture(size, draw) {
    const c = document.createElement("canvas");
    c.width = c.height = size;
    draw(c.getContext("2d"), size);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  function starTexture() {
    return makeCanvasTexture(64, (ctx, s) => {
      const h = s / 2;
      const glow = ctx.createRadialGradient(h, h, 0, h, h, h);
      glow.addColorStop(0, "rgba(255,246,200,0.55)");
      glow.addColorStop(1, "rgba(255,246,200,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, s, s);
      ctx.translate(h, h);
      ctx.fillStyle = "#fffdf0";
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const r = i % 2 === 0 ? h * 0.95 : h * 0.13;
        const a = (i / 8) * Math.PI * 2;
        ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fill();
    });
  }

  function puffTexture() {
    return makeCanvasTexture(128, (ctx, s) => {
      const h = s / 2;
      const lobes = [
        [0, 4, 34],
        [-24, -6, 24],
        [24, -4, 26],
        [-6, -26, 22],
        [16, 24, 20],
        [-22, 22, 18],
      ];
      const blob = (grow, fill) => {
        ctx.fillStyle = fill;
        for (const [x, y, r] of lobes) {
          ctx.beginPath();
          ctx.arc(h + x, h + y, r + grow, 0, Math.PI * 2);
          ctx.fill();
        }
      };
      blob(5, "#1b1436"); // ink outline
      blob(0, "#fffaf0");
      // the curl
      ctx.strokeStyle = "rgba(150,132,214,0.75)";
      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      ctx.beginPath();
      for (let a = 0; a < Math.PI * 3.4; a += 0.15) {
        const r = 3 + a * 2.6;
        const x = h + Math.cos(a) * r;
        const y = h + 2 + Math.sin(a) * r;
        a === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    });
  }

  function buildEffects() {
    const starMat = new THREE.SpriteMaterial({
      map: starTexture(),
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });
    const puffMat = new THREE.SpriteMaterial({ map: puffTexture(), transparent: true, depthWrite: false, depthTest: false });
    const pool = (mat, count, order) =>
      Array.from({ length: count }, () => {
        const sprite = new THREE.Sprite(mat.clone());
        sprite.visible = false;
        sprite.renderOrder = order;
        rig.add(sprite);
        return { sprite, life: 0, ttl: 1, size: 1, vel: new THREE.Vector3(), spin: 0 };
      });
    sparkles = pool(starMat, 10, 20);
    puffs = pool(puffMat, 12, 10);
    starMat.dispose();
    puffMat.dispose();
  }

  function sparkle(x, y, z, size = 0.5) {
    const s = sparkles.find((k) => k.life <= 0);
    if (!s) return;
    s.sprite.position.set(x, y, z);
    s.life = s.ttl = 0.55 + Math.random() * 0.35;
    s.size = size;
    s.spin = (Math.random() - 0.5) * 3;
    s.sprite.visible = true;
  }

  /** A ring of puffs bursting from (x, y). */
  function poof(x, y, z, count, size) {
    if (reducedMotion) return;
    for (let i = 0; i < count; i++) {
      const p = puffs.find((k) => k.life <= 0);
      if (!p) return;
      const a = (i / count) * Math.PI * 2 + Math.random() * 0.6;
      p.sprite.position.set(x + Math.cos(a) * 0.35, y + Math.sin(a) * 0.12, z);
      p.vel.set(Math.cos(a) * 2.6, 0.5 + Math.abs(Math.sin(a)) * 1.2, 0);
      p.life = p.ttl = 0.6 + Math.random() * 0.25;
      p.size = size * (0.75 + Math.random() * 0.5);
      p.spin = (Math.random() - 0.5) * 4;
      p.sprite.material.rotation = Math.random() * Math.PI;
      p.sprite.visible = true;
    }
  }

  function updateEffects(dt, timestamp) {
    for (const s of sparkles) {
      if (s.life <= 0) continue;
      s.life -= dt;
      const t = 1 - Math.max(0, s.life) / s.ttl;
      const k = Math.sin(Math.PI * t); // blink open, blink shut
      s.sprite.scale.setScalar(s.size * k);
      s.sprite.material.rotation += s.spin * dt;
      if (s.life <= 0) s.sprite.visible = false;
    }
    for (const p of puffs) {
      if (p.life <= 0) continue;
      p.life -= dt;
      const t = 1 - Math.max(0, p.life) / p.ttl;
      // pop out fast, then curl away to nothing
      const k = t < 0.3 ? easeOutBack(t / 0.3) : 1 - Math.pow((t - 0.3) / 0.7, 2);
      p.sprite.scale.setScalar(Math.max(0.001, p.size * k));
      p.sprite.position.addScaledVector(p.vel, dt);
      p.vel.multiplyScalar(Math.pow(0.04, dt));
      p.sprite.material.rotation += p.spin * dt;
      if (p.life <= 0) p.sprite.visible = false;
    }

    // Idle glints on the glass and the sand
    if (!reducedMotion && timestamp > nextAmbientSparkle) {
      nextAmbientSparkle = timestamp + 500 + Math.random() * 1100;
      const y = (Math.random() - 0.5) * BULB_HEIGHT * 1.7;
      const a = Math.random() * Math.PI - Math.PI / 2;
      const r = glassRadiusAt(y) * (0.55 + Math.random() * 0.4);
      sparkle(Math.sin(a) * r, y, 0.4 + Math.cos(a) * r, 0.28 + Math.random() * 0.3);
    }
  }

  // ── Materials ──
  let toonRamp = null;
  function toonMaterial(color) {
    if (!toonRamp) {
      // three hard bands: shadow, mid, lit
      toonRamp = new THREE.DataTexture(
        new Uint8Array([118, 118, 118, 255, 196, 196, 196, 255, 255, 255, 255, 255]),
        3,
        1,
        THREE.RGBAFormat,
      );
      toonRamp.minFilter = toonRamp.magFilter = THREE.NearestFilter;
      toonRamp.needsUpdate = true;
    }
    return new THREE.MeshToonMaterial({ color, gradientMap: toonRamp });
  }

  /** Ink outline: the same mesh, inflated along its normals, back faces only. */
  function inkMaterial(thickness) {
    return new THREE.ShaderMaterial({
      uniforms: { uT: { value: thickness }, uColor: { value: new THREE.Color(INK) } },
      vertexShader: `
        uniform float uT;
        void main() {
          vec4 p = vec4(position + normalize(normal) * uT, 1.0);
          #ifdef USE_INSTANCING
            p = instanceMatrix * p;
          #endif
          gl_Position = projectionMatrix * modelViewMatrix * p;
        }`,
      fragmentShader: `
        uniform vec3 uColor;
        void main() { gl_FragColor = vec4(uColor, 1.0); }`,
      side: THREE.BackSide,
    });
  }

  /** Cel-shaded glass: clear body, aqua rim band, ink edge, one painted glint. */
  function glassMaterial() {
    return new THREE.ShaderMaterial({
      uniforms: {
        uInk: { value: new THREE.Color(INK) },
        uRim: { value: new THREE.Color(0xa8f0ff) },
        uTint: { value: new THREE.Color(0x7fd8ff) },
      },
      vertexShader: `
        varying vec3 vN;
        varying vec3 vV;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vN = normalize(normalMatrix * normal);
          vV = normalize(-mv.xyz);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        uniform vec3 uInk;
        uniform vec3 uRim;
        uniform vec3 uTint;
        varying vec3 vN;
        varying vec3 vV;
        void main() {
          vec3 n = normalize(vN);
          vec3 v = normalize(vV);
          bool nearWall = dot(n, v) > 0.0;
          if (!nearWall) n = -n;                // treat both walls as facing us
          float fres = 1.0 - dot(n, v);
          vec3 col = uTint;
          float a = 0.13;
          if (fres > 0.86)      { col = uInk; a = 0.92; }
          else if (fres > 0.60) { col = uRim; a = 0.40; }
          // painted highlight, near wall only
          float glint = dot(n, normalize(vec3(-0.52, 0.5, 0.69)));
          if (nearWall && glint > 0.984 && fres < 0.60) { col = vec3(1.0); a = 0.88; }
          gl_FragColor = vec4(col, a);
        }`,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  }

  /** Adds a toon mesh plus its ink shell. */
  function addInked(parent, geometry, color, ink = 0.05) {
    const mesh = new THREE.Mesh(geometry, toonMaterial(color));
    const shell = new THREE.Mesh(geometry, inkMaterial(ink));
    mesh.add(shell);
    parent.add(mesh);
    return mesh;
  }

  const lathe = (pts, segments = 40) =>
    new THREE.LatheGeometry(
      pts.map(([r, y]) => new THREE.Vector2(r, y)),
      segments,
    );

  function buildHourglass() {
    // Caps: a chunky stepped plinth, mirrored top and bottom
    const R = CAP_RADIUS;
    const capGeo = lathe([
      [0.001, 0],
      [R + 0.02, 0],
      [R + 0.08, 0.1],
      [R + 0.08, 0.2],
      [R + 0.34, 0.26],
      [R + 0.4, 0.36],
      [R + 0.4, 0.5],
      [R + 0.3, 0.6],
      [0.001, 0.62],
    ]);
    const bottomCap = addInked(frameGroup, capGeo, GOLD, 0.055);
    bottomCap.position.y = -BULB_HEIGHT - 0.02;
    bottomCap.rotation.x = Math.PI; // plinth grows away from the glass
    const topCap = addInked(frameGroup, capGeo, GOLD, 0.055);
    topCap.position.y = BULB_HEIGHT + 0.02;

    // Sea-green inlay around each plinth
    const inlayGeo = new THREE.TorusGeometry(R + 0.41, 0.045, 8, 48);
    for (const y of [-BULB_HEIGHT - 0.45, BULB_HEIGHT + 0.45]) {
      const inlay = new THREE.Mesh(inlayGeo, toonMaterial(SEA));
      inlay.rotation.x = Math.PI / 2;
      inlay.position.y = y;
      frameGroup.add(inlay);
    }

    // Turned posts with a bead in the middle
    const H = BULB_HEIGHT;
    const postGeo = lathe(
      [
        [0.001, -H],
        [0.17, -H],
        [0.17, -H + 0.25],
        [0.09, -H + 0.5],
        [0.085, -0.5],
        [0.18, -0.22],
        [0.2, 0],
        [0.18, 0.22],
        [0.085, 0.5],
        [0.09, H - 0.5],
        [0.17, H - 0.25],
        [0.17, H],
        [0.001, H],
      ],
      14,
    );
    // Four posts on the diagonals: with the idle sway (±24°) none of them
    // ever swings across the middle of the glass and hides the sand.
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const post = addInked(frameGroup, postGeo, GOLD_DEEP, 0.04);
      post.position.set(Math.cos(a) * (R + 0.16), 0, Math.sin(a) * (R + 0.16));
    }

    // Collar at the neck
    const collar = addInked(frameGroup, new THREE.TorusGeometry(NECK_RADIUS + 0.07, 0.085, 10, 28), GOLD, 0.035);
    collar.rotation.x = Math.PI / 2;

    // Glass
    const profile = [];
    for (let i = 0; i <= 48; i++) {
      const y = (i / 48 - 0.5) * BULB_HEIGHT * 2;
      profile.push([glassRadiusAt(y), y]);
    }
    const glass = new THREE.Mesh(lathe(profile, 48), glassMaterial());
    glass.renderOrder = 5; // after the sand
    frameGroup.add(glass);
  }

  // ── Frame loop ──
  const _m = new THREE.Object3D();
  const _v = new THREE.Vector3();

  function frame(timestamp) {
    const canvas = canvasEl;
    if (!renderer || !scene || !canvas) return;

    const dtMs = lastTimestamp ? Math.min(100, timestamp - lastTimestamp) : STEP_MS;
    lastTimestamp = timestamp;
    const dt = dtMs / 1000;

    // Flip: wind-up, swing, overshoot — with a hop and a stretch
    let hop = 0;
    let stretch = 0;
    if (isFlipping) {
      const progress = Math.min(1, (timestamp - flipStartTime) / FLIP_MS);
      const eased = reducedMotion ? progress : easeInOutBack(progress);
      currentGroupRotation = startRotation + (targetRotation - startRotation) * eased;
      hop = Math.sin(Math.PI * progress) * 0.42;
      stretch = Math.sin(Math.PI * progress) * 0.06;
      if (progress >= 1) {
        isFlipping = false;
        currentGroupRotation = targetRotation % (Math.PI * 2);
        landedAt = timestamp;
        poof(0, -BULB_HEIGHT - 0.5, 1.2, 8, 1.15);
        sparkle(0, -BULB_HEIGHT - 0.2, 1.6, 0.9);
      }
    }
    // Landing squash: a quick damped wobble
    let squash = 0;
    if (landedAt >= 0 && !reducedMotion) {
      const t = (timestamp - landedAt) / 1000;
      if (t < 0.9) squash = 0.085 * Math.exp(-6 * t) * Math.cos(19 * t);
      else landedAt = -1;
    }
    if (reducedMotion) hop = stretch = 0;

    frameGroup.rotation.x = currentGroupRotation;
    frameGroup.scale.set(1 + squash * 0.6 - stretch * 0.5, 1 - squash + stretch, 1 + squash * 0.6 - stretch * 0.5);

    // Idle: a slow turn and a gentle bob, like everything on the Great Sea
    const s = timestamp / 1000;
    if (!reducedMotion) {
      rig.rotation.y = Math.sin(s * 0.55) * 0.42;
      rig.rotation.z = Math.sin(s * 0.9 + 1) * 0.018;
      rig.position.y = Math.sin(s * 1.25) * 0.07 + hop;
    }

    // Physics at a fixed rate; gravity follows the flip in the glass's own frame
    const gravY = GRAVITY * Math.cos(currentGroupRotation);
    const gravZ = -GRAVITY * Math.sin(currentGroupRotation);
    accumulator = Math.min(accumulator + dtMs, STEP_MS * 4);
    while (accumulator >= STEP_MS) {
      runPhysicsStep(gravY, gravZ);
      accumulator -= STEP_MS;
    }
    const alpha = accumulator / STEP_MS;

    if (grainMesh) {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.appear < 1) p.appear = Math.min(1, p.appear + dt * 3.2);
        _m.position.lerpVectors(p.prev, p.pos, alpha);
        _m.scale.setScalar((p.radius / GRAIN_GEO_RADIUS) * (p.appear < 1 ? Math.max(0.001, easeOutBack(p.appear)) : 1));
        _m.updateMatrix();
        grainMesh.setMatrixAt(i, _m.matrix);
        grainInkMesh.setMatrixAt(i, _m.matrix);
      }
      grainMesh.instanceMatrix.needsUpdate = true;
      grainInkMesh.instanceMatrix.needsUpdate = true;
    }

    if (trickleMesh) {
      for (let i = 0; i < trickleParticles.length; i++) {
        const t = trickleParticles[i];
        _m.position.copy(_v.lerpVectors(t.prev, t.pos, alpha));
        _m.scale.setScalar(t.size);
        _m.updateMatrix();
        trickleMesh.setMatrixAt(i, _m.matrix);
      }
      trickleMesh.instanceMatrix.needsUpdate = true;
    }

    updateEffects(dt, timestamp);

    renderer.render(scene, camera);
    animationId = requestAnimationFrame(frame);
    canvas.__threeAnimationId = animationId;
  }

  function disposeRenderer(rendererInstance, sceneInstance) {
    if (sceneInstance) {
      sceneInstance.traverse((object) => {
        if (!object.isMesh && !object.isSprite) return;
        object.geometry?.dispose();
        for (const mat of Array.isArray(object.material) ? object.material : [object.material]) {
          mat?.map?.dispose();
          mat?.dispose();
        }
      });
    }
    toonRamp?.dispose();
    toonRamp = null;
    if (rendererInstance) {
      try {
        rendererInstance.dispose();
      } catch (e) {
        console.warn("Error disposing Three.js renderer:", e);
      }
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

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    canvas.__threeRenderer = renderer;

    scene = new THREE.Scene();
    canvas.__threeScene = scene;

    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.35, 14.2);
    camera.lookAt(0, 0, 0);

    rig = new THREE.Group();
    frameGroup = new THREE.Group();
    rig.add(frameGroup);
    scene.add(rig);

    buildHourglass();
    buildEffects();
    rebuildGrainMeshes();

    // One strong key light so the toon bands read; flat fill everywhere else
    scene.add(new THREE.AmbientLight(0xfff4e0, 1.0));
    const key = new THREE.DirectionalLight(0xffffff, 2.6);
    key.position.set(-3, 5, 6);
    scene.add(key);

    lastTimestamp = 0;
    accumulator = 0;
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
    reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    containerEl?.addEventListener("wheel", handleWheel, { passive: false });
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
        canvas.__threeRenderer = null;
        canvas.__threeScene = null;
      }
      disposeRenderer(renderer, scene);
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
      <span class="dot-key sec-key">&#9679;</span>
      {#if currentMode === "minute"}
        1 grain = 1 sec
      {:else}
        sec &nbsp;<span class="dot-key min-key">&#9679;</span> min
        {#if currentMode === "day"}
          &nbsp;<span class="dot-key hr-key">&#9679;</span> hr
        {/if}
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
    --accent: #ffd65c;
  }
  .hourglass-widget.hour-mode {
    --accent: #38b6ff;
  }
  .hourglass-widget.day-mode {
    --accent: #ff5470;
  }

  canvas {
    display: block;
    width: 160px;
    height: 240px;
    /* a patch of open-sea sky behind the glass */
    background: radial-gradient(
      ellipse 60% 48% at 50% 50%,
      rgba(64, 196, 255, 0.13),
      rgba(64, 196, 255, 0.04) 55%,
      transparent 75%
    );
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
    color: var(--accent, #ffd65c);
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

  /* Legend dots match the grains: gold seconds, sea-blue minutes, ruby hours */
  .dot-key {
    line-height: 1;
  }
  .sec-key {
    color: #ffd65c;
    font-size: 6px;
  }
  .min-key {
    color: #38b6ff;
    font-size: 9px;
  }
  .hr-key {
    color: #ff5470;
    font-size: 12px;
  }
</style>
