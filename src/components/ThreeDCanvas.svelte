<script>
  import { Canvas } from "@threlte/core";
  import DogSkeletonScene from "./DogSkeletonScene.svelte";

  let { isFlagColors = false } = $props();
</script>

<div class="canvas-container w-full h-full select-none pointer-events-auto">
  <Canvas>
    <DogSkeletonScene isFlagColors={isFlagColors} />
  </Canvas>
</div>

<style>
  .canvas-container {
    width: 100%;
    height: 100%;
    position: relative;
    background: transparent;
  }
</style>
