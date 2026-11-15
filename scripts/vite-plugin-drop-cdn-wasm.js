const ORT_WASM_ASSET = /(^|\/)ort-wasm-[^/]*\.wasm$/;

/**
 * Keeps onnxruntime's 26 MB wasm out of the deploy. Bundling onnxruntime-web
 * emits the file from its `new URL()` fallback, but @huggingface/transformers
 * always points `wasmPaths` at jsDelivr before that fallback can run, so nothing
 * ever fetches the local copy. If Wiretap starts self-hosting the runtime
 * instead, remove this plugin.
 *
 * @returns {import('vite').Plugin}
 */
export default function dropCdnWasm() {
  return {
    name: "drop-cdn-wasm",
    apply: "build",
    enforce: "post",
    generateBundle(_options, bundle) {
      for (const fileName of Object.keys(bundle)) {
        if (ORT_WASM_ASSET.test(fileName)) delete bundle[fileName];
      }
    },
  };
}
