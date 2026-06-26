/**
 * VisualizerEngine manages WebGL rendering contexts, compiling GLSL shaders,
 * binding frequency-domain textures, and managing the requestAnimationFrame loop.
 */
export class VisualizerEngine {
  canvas = null;
  gl = null;
  analyser = null;
  program = null;
  animationFrameId = null;
  startTime = 0;
  
  // WebGL resources
  vertexBuffer = null;
  audioTexture = null;
  
  // Uniform locations cache
  uniforms = {};
  
  // Frequency analysis buffers
  frequencyBuffer = null;
  
  constructor(canvas, analyser) {
    this.canvas = canvas;
    this.analyser = analyser;
    this.frequencyBuffer = new Uint8Array(analyser ? analyser.frequencyBinCount : 128);
    
    // Get WebGL context (support experimental for older potato targets)
    this.gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!this.gl) {
      console.error("WebGL not supported by this browser.");
    }
  }

  /**
   * Compiles a preset shader on the canvas.
   * @param {string} fragmentShaderSource 
   */
  init(fragmentShaderSource) {
    if (!this.gl) return;
    const gl = this.gl;
    
    // Clean up existing program if any
    this.cleanupProgram();
    
    // Create Vertex Shader (Simple screen-space quad clip coordinates)
    const vsSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;
    
    const vertexShader = this.compileShader(gl.VERTEX_SHADER, vsSource);
    const fragmentShader = this.compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    if (!vertexShader || !fragmentShader) return;
    
    // Link program
    this.program = gl.createProgram();
    gl.attachShader(this.program, vertexShader);
    gl.attachShader(this.program, fragmentShader);
    gl.linkProgram(this.program);
    
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.error("Shader program linking failed:", gl.getProgramInfoLog(this.program));
      return;
    }
    
    gl.useProgram(this.program);
    
    // Set up screen-space triangle strip coordinates mapping [-1, 1] bounds
    const vertices = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
       1.0,  1.0,
    ]);
    
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    
    // Bind position attributes
    const aPosition = gl.getAttribLocation(this.program, "a_position");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    
    // Set up audio frequency texture mapping
    this.audioTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.audioTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    
    // Cache uniform locations
    this.uniforms = {
      time: gl.getUniformLocation(this.program, "u_time"),
      resolution: gl.getUniformLocation(this.program, "u_resolution"),
      volume: gl.getUniformLocation(this.program, "u_volume"),
      bass: gl.getUniformLocation(this.program, "u_bass"),
      mid: gl.getUniformLocation(this.program, "u_mid"),
      treble: gl.getUniformLocation(this.program, "u_treble"),
      audioTexture: gl.getUniformLocation(this.program, "u_audioTexture")
    };
    
    this.startTime = performance.now();
    this.resize();
  }

  /**
   * Switches visualizer fragment shader preset.
   * @param {string} fragmentShaderSource 
   */
  setPreset(fragmentShaderSource) {
    this.init(fragmentShaderSource);
  }

  /**
   * Helper to compile individual shader stages.
   */
  compileShader(type, source) {
    if (!this.gl) return null;
    const gl = this.gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(`Shader compilation error (${type === gl.VERTEX_SHADER ? "VERTEX" : "FRAGMENT"}):`, gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  /**
   * Start rendering animation frames loop.
   */
  start() {
    this.stop();
    const tick = () => {
      this.renderFrame();
      this.animationFrameId = requestAnimationFrame(tick);
    };
    this.animationFrameId = requestAnimationFrame(tick);
  }

  /**
   * Stop rendering loop.
   */
  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Updates rendering viewport dimensions.
   */
  resize() {
    if (!this.gl || !this.canvas) return;
    const gl = this.gl;
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
  }

  /**
   * Execute draw call mapping variables and audio texture.
   */
  renderFrame() {
    if (!this.gl || !this.program) return;
    const gl = this.gl;
    
    // Check sizing
    this.resize();
    
    gl.useProgram(this.program);
    
    // Bind position buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    
    // Calculate uniforms variables
    const elapsedSeconds = (performance.now() - this.startTime) / 1000;
    
    let vol = 0;
    let bass = 0;
    let mid = 0;
    let treble = 0;
    
    if (this.analyser) {
      this.analyser.getByteFrequencyData(this.frequencyBuffer);
      const binCount = this.frequencyBuffer.length;
      
      // Separate frequency bands energy averages
      let bassCount = 0;
      let midCount = 0;
      let trebleCount = 0;
      
      for (let i = 0; i < binCount; i++) {
        const val = this.frequencyBuffer[i];
        vol += val;
        
        // Define frequency bands indices (out of 128 bins)
        if (i < 12) { // Bass (approx <250Hz)
          bass += val;
          bassCount++;
        } else if (i < 64) { // Midrange (approx 250Hz-2kHz)
          mid += val;
          midCount++;
        } else { // Treble (approx >2kHz)
          treble += val;
          trebleCount++;
        }
      }
      
      vol = vol / binCount / 255.0;
      bass = bassCount > 0 ? (bass / bassCount / 255.0) : 0;
      mid = midCount > 0 ? (mid / midCount / 255.0) : 0;
      treble = trebleCount > 0 ? (treble / trebleCount / 255.0) : 0;
      
      // Update WebGL Texture mapping frequency bins data array
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.audioTexture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.LUMINANCE,
        binCount,
        1,
        0,
        gl.LUMINANCE,
        gl.UNSIGNED_BYTE,
        this.frequencyBuffer
      );
    }
    
    // Set uniforms
    gl.uniform1f(this.uniforms.time, elapsedSeconds);
    gl.uniform2f(this.uniforms.resolution, this.canvas.width, this.canvas.height);
    gl.uniform1f(this.uniforms.volume, vol);
    gl.uniform1f(this.uniforms.bass, bass);
    gl.uniform1f(this.uniforms.mid, mid);
    gl.uniform1f(this.uniforms.treble, treble);
    gl.uniform1i(this.uniforms.audioTexture, 0);
    
    // Execute Draw Call
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  /**
   * Delete shader programs.
   */
  cleanupProgram() {
    if (this.gl && this.program) {
      this.gl.deleteProgram(this.program);
      this.program = null;
    }
  }

  /**
   * Release WebGL buffers, textures, and contexts references.
   */
  destroy() {
    this.stop();
    const gl = this.gl;
    if (gl) {
      this.cleanupProgram();
      if (this.vertexBuffer) {
        gl.deleteBuffer(this.vertexBuffer);
        this.vertexBuffer = null;
      }
      if (this.audioTexture) {
        gl.deleteTexture(this.audioTexture);
        this.audioTexture = null;
      }
    }
    this.canvas = null;
    this.gl = null;
    this.analyser = null;
  }
}
