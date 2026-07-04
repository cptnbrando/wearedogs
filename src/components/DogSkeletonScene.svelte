<script>
  import { T, useTask } from "@threlte/core";
  import { OrbitControls, useGltf } from "@threlte/extras";
  import * as THREE from "three";

  let { isFlagColors = false } = $props();

  // Load GLTF model if it exists
  const gltf = useGltf("/models/dog_skeleton.gltf");

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
    opacity: 0.85
  });

  // Color mode active material
  const neonMaterial = new THREE.MeshBasicMaterial({
    color: 0xa000eb, // Purple neon
    wireframe: true,
    transparent: true,
    opacity: 0.9
  });

  let activeMaterial = $derived(isFlagColors ? neonMaterial : skeletonMaterial);
</script>

<!-- Camera setup -->
<T.PerspectiveCamera
  makeDefault
  position={[5, 3, 7]}
  fov={45}
>
  <OrbitControls
    enableDamping
    autoRotate
    autoRotateSpeed={0.8}
    enableZoom={true}
    enablePan={true}
  />
</T.PerspectiveCamera>

<!-- Scene items -->
<T.Group rotation.y={modelRotationY}>
  {#if $gltf}
    <!-- Load from GLTF structure and override materials with wireframe -->
    <T.Primitive
      object={$gltf.scene}
      oncreate={(obj) => {
        obj.traverse((child) => {
          if (child.isMesh) {
            child.material = activeMaterial;
          }
        });
      }}
    />
  {:else}
    <!-- Procedural glowing skeleton dog fallback -->
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
      <T.Mesh position={[2.2, 0.7, 0]} rotation={[0, 0, -Math.PI / 6]} material={activeMaterial}>
        <T.CylinderGeometry args={[0.15, 0.25, 0.6, 8]} />
      </T.Mesh>

      <!-- Neck -->
      <T.Mesh position={[1.4, 0.35, 0]} rotation={[0, 0, -Math.PI / 4]} material={activeMaterial}>
        <T.CylinderGeometry args={[0.06, 0.08, 0.9, 8]} />
      </T.Mesh>

      <!-- Tail -->
      <T.Mesh position={[-1.7, 0.5, 0]} rotation={[0, 0, Math.PI / 3]} material={activeMaterial}>
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
          <T.Mesh position={[-0.1, 0.3, 0]} rotation={[0, 0, Math.PI / 12]} material={activeMaterial}>
            <T.CylinderGeometry args={[0.06, 0.04, 0.7, 8]} />
          </T.Mesh>
          <!-- Lower leg -->
          <T.Mesh position={[0.02, -0.3, 0]} material={activeMaterial}>
            <T.CylinderGeometry args={[0.03, 0.03, 0.6, 8]} />
          </T.Mesh>
        </T.Group>
      {/each}
    </T.Group>
  {/if}
</T.Group>
