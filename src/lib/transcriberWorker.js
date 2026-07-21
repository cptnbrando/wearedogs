import { pipeline, env } from "@xenova/transformers";

// Configure ONNX runtime inside dedicated Web Worker
env.allowLocalModels = false;
env.useBrowserCache = true;

let transcriber = null;

self.onmessage = async (e) => {
  const { type, pcmData } = e.data;

  if (type === "transcribe") {
    try {
      if (!transcriber) {
        self.postMessage({ status: "progress", progress: 15, text: "Loading in-browser Whisper AI model..." });
        transcriber = await pipeline("automatic-speech-recognition", "Xenova/whisper-tiny.en", {
          progress_callback: (p) => {
            if (p && p.status === "progress" && p.progress) {
              const pct = Math.round(p.progress);
              self.postMessage({ status: "progress", progress: Math.min(80, Math.max(15, pct)), text: `Loading model weights... (${pct}%)` });
            }
          },
        });
      }

      self.postMessage({ status: "progress", progress: 85, text: "Transcribing audio in background Web Worker..." });

      const result = await transcriber(pcmData, {
        chunk_length_s: 30,
        stride_length_s: 5,
      });

      const fullText = result && result.text ? result.text.trim() : "No speech recognized.";
      self.postMessage({ status: "complete", progress: 100, text: fullText });
    } catch (err) {
      console.error("Worker transcription error:", err);
      self.postMessage({ status: "error", progress: 0, error: err.message || "Worker processing error" });
    }
  }
};
