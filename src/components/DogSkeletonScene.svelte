<script>
  import { T, useTask } from "@threlte/core";
  import { OrbitControls } from "@threlte/extras";
  import * as THREE from "three";
  import { onMount } from "svelte";
  import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
  import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

  let {
    isFlagColors = false,
    modelPath = "/models/dog_skeleton.gltf",
    modelType = "gltf",
    scale = 1.0,
  } = $props();

  let isMobile = $state(false);
  let isLandscape = $state(false);
  onMount(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const landscapeMedia = window.matchMedia("(orientation: landscape)");
    isMobile = media.matches;
    isLandscape = landscapeMedia.matches;

    const listener = (e) => {
      isMobile = e.matches;
    };
    const landscapeListener = (e) => {
      isLandscape = e.matches;
    };
    media.addEventListener("change", listener);
    landscapeMedia.addEventListener("change", landscapeListener);

    const handleRotate = (e) => {
      const step = 0.25;
      modelRotationY += e.detail.direction === "left" ? -step : step;
    };
    window.addEventListener("rotate-skeleton", handleRotate);

    return () => {
      media.removeEventListener("change", listener);
      landscapeMedia.removeEventListener("change", landscapeListener);
      window.removeEventListener("rotate-skeleton", handleRotate);
    };
  });

  // Rotate model slowly if no user interaction
  let modelRotationY = $state(0);
  useTask((delta) => {
    modelRotationY += delta * 0.15; // Auto-rotate speed
  });

  // Emissive white wireframe material
  const skeletonMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
    transparent: true,
    opacity: 0.85,
  });

  // Color mode active material
  const neonMaterial = new THREE.MeshBasicMaterial({
    color: 0xa000eb, // Purple neon
    wireframe: true,
    transparent: true,
    opacity: 0.9,
  });

  let activeMaterial = skeletonMaterial;

  let loadedModel = $state(null);
  let isGlbLoading = $state(false);

  const applyMaterial = (object) => {
    if (!object) return;
    object.traverse((child) => {
      if (child.isMesh) {
        child.material = activeMaterial;
      }
    });
  };

  let modelCenter = $state(new THREE.Vector3(0, 0, 0));
  let modelScale = $state(1.0);

  const processModel = (object) => {
    if (!object) return;

    // Force compute all matrices in the loaded model hierarchy relative to its root
    object.updateMatrixWorld(true);

    const box = new THREE.Box3();
    let hasMesh = false;

    object.traverse((child) => {
      if (child.isMesh && child.geometry) {
        if (!child.geometry.boundingBox) {
          child.geometry.computeBoundingBox();
        }

        // Get child local bounding box and apply its matrix relative to the model root
        const localBox = child.geometry.boundingBox.clone();
        localBox.applyMatrix4(child.matrixWorld);

        box.union(localBox);
        hasMesh = true;
      }
    });

    if (hasMesh) {
      const center = new THREE.Vector3();
      box.getCenter(center);
      modelCenter = center;

      // Calculate size and scale factor relative to target skeleton size (~3.2 units)
      const size = new THREE.Vector3();
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      const targetSize = 3.2;
      modelScale = targetSize / (maxDim || 1);
    } else {
      modelCenter = new THREE.Vector3(0, 0, 0);
      modelScale = 1.0;
    }
  };



  const loadGlb = (path) => {
    isGlbLoading = true;
    loadedModel = null;
    modelCenter = new THREE.Vector3(0, 0, 0);
    modelScale = 1.0;
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");
    loader.setDRACOLoader(dracoLoader);
    loader.load(
      path,
      (gltf) => {
        const modelScene = gltf.scene;
        processModel(modelScene);
        loadedModel = modelScene;
        isGlbLoading = false;
      },
      undefined,
      (err) => {
        console.error("Failed to load GLB model:", err);
        isGlbLoading = false;
      },
    );
  };

  $effect(() => {
    if (modelPath && modelType === "glb") {
      loadGlb(modelPath);
    } else {
      loadedModel = null;
    }
  });
</script>

<!-- Camera setup -->
<T.PerspectiveCamera
  makeDefault
  position={isMobile
    ? isLandscape
      ? [4.15, 2.49, 5.81]
      : [3.6, 2.16, 5.04]
    : [5, 3, 7]}
  fov={45}
>
  <OrbitControls
    enableDamping
    autoRotate
    autoRotateSpeed={0.8}
    enableZoom={false}
    enablePan={false}
    minPolarAngle={1.23}
    maxPolarAngle={1.23}
    target={isMobile
      ? isLandscape
        ? [0, -1.0, 0]
        : [0, 0.1, 0]
      : [0, -0.6, 0]}
  />
</T.PerspectiveCamera>

<!-- Lighting for external materials/textures (only active for GLB) -->
{#if modelType === "glb"}
  <T.AmbientLight intensity={1.5} />
  <T.DirectionalLight position={[10, 10, 10]} intensity={1.8} />
  <T.DirectionalLight position={[-10, 5, -10]} intensity={0.8} />
{/if}

<!-- Scene items -->
<T.Group rotation.y={modelRotationY} scale={[scale, scale, scale]}>
  {#if modelType === "gltf"}
    <!-- Procedural glowing skeleton dog -->
    <T.Group position={[0, -0.5, 0]}>
      <!-- Spine / Spine line -->
      <T.Mesh material={activeMaterial}>
        <T.CylinderGeometry args={[0.04, 0.04, 3, 8]} />
        <T.Group rotation={[0, 0, Math.PI / 2]} />
      </T.Mesh>

      <!-- Ribcage -->
      {#each [-0.8, -0.4, 0, 0.4, 0.8] as xOffset}
        <T.Mesh position={[xOffset, -0.1, 0]} material={activeMaterial}>
          <T.TorusGeometry args={[0.6, 0.02, 8, 24]} />
          <T.Group rotation={[0, Math.PI / 2, 0]} />
        </T.Mesh>
      {/each}

      <!-- Skull / Head -->
      <T.Mesh position={[1.8, 0.8, 0]} material={activeMaterial}>
        <T.SphereGeometry args={[0.4, 12, 12]} />
      </T.Mesh>
      <!-- Snout -->
      <T.Mesh
        position={[2.2, 0.7, 0]}
        rotation={[0, 0, -Math.PI / 6]}
        material={activeMaterial}
      >
        <T.CylinderGeometry args={[0.15, 0.25, 0.6, 8]} />
      </T.Mesh>

      <!-- Neck -->
      <T.Mesh
        position={[1.4, 0.35, 0]}
        rotation={[0, 0, -Math.PI / 4]}
        material={activeMaterial}
      >
        <T.CylinderGeometry args={[0.06, 0.08, 0.9, 8]} />
      </T.Mesh>

      <!-- Tail -->
      <T.Mesh
        position={[-1.7, 0.5, 0]}
        rotation={[0, 0, Math.PI / 3]}
        material={activeMaterial}
      >
        <T.CylinderGeometry args={[0.02, 0.04, 1.2, 8]} />
      </T.Mesh>

      <!-- Front Legs (left/right) -->
      {#each [-0.25, 0.25] as zOffset}
        <T.Group position={[1.2, -0.7, zOffset]}>
          <!-- Shoulder/Arm -->
          <T.Mesh position={[0, 0.3, 0]} material={activeMaterial}>
            <T.CylinderGeometry args={[0.04, 0.04, 0.7, 8]} />
          </T.Mesh>
          <!-- Lower leg -->
          <T.Mesh position={[0.05, -0.3, 0]} material={activeMaterial}>
            <T.CylinderGeometry args={[0.03, 0.03, 0.6, 8]} />
          </T.Mesh>
        </T.Group>
      {/each}

      <!-- Back Legs (left/right) -->
      {#each [-0.25, 0.25] as zOffset}
        <T.Group position={[-1.2, -0.7, zOffset]}>
          <!-- Hip/Thigh -->
          <T.Mesh
            position={[-0.1, 0.3, 0]}
            rotation={[0, 0, Math.PI / 12]}
            material={activeMaterial}
          >
            <T.CylinderGeometry args={[0.06, 0.04, 0.7, 8]} />
          </T.Mesh>
          <!-- Lower leg -->
          <T.Mesh position={[0.02, -0.3, 0]} material={activeMaterial}>
            <T.CylinderGeometry args={[0.03, 0.03, 0.6, 8]} />
          </T.Mesh>
        </T.Group>
      {/each}
    </T.Group>
  {:else if modelType === "glb" && loadedModel}
    <!-- Render loaded GLB group scaled and offset centered to align pivot rotation -->
    <T.Group scale={[modelScale, modelScale, modelScale]}>
      <T.Group position={[-modelCenter.x, -modelCenter.y, -modelCenter.z]}>
        <T is={loadedModel} />
      </T.Group>
    </T.Group>
  {/if}
</T.Group>
