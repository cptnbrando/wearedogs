const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/BattlePanel-Dy3j8f_-.js","assets/vendor-B1QhM8cf.js","assets/rolldown-runtime-CMxvf4Kt.js","assets/vendor-Dl9nCA7L.css","assets/BattlePanel-B1S5D9Lq.css"])))=>i.map(i=>d[i]);
import{$t as e,A as t,Ar as n,Bn as r,Cn as i,Cr as a,Dr as o,Dt as s,En as c,Fr as l,G as ee,Gr as te,H as ne,Hr as u,I as re,Ir as ie,It as ae,Jr as d,Kr as f,Lr as p,N as oe,Nr as m,Nt as se,Or as h,Ot as ce,Pr as g,Pt as le,Qr as ue,Rn as de,S as _,Sr as v,Ut as fe,Vr as y,W as pe,Wn as me,Xr as b,Zn as he,Zr as x,_r as S,ai as C,ar as ge,br as _e,cr as ve,ei as ye,er as be,fr as xe,g as Se,gr as w,ht as Ce,ii as we,jt as T,k as Te,kr as Ee,lr as De,mt as Oe,nr as ke,oi as E,or as D,pr as O,pt as Ae,qr as je,qt as Me,ri as Ne,si as k,st as Pe,tr as Fe,tt as Ie,un as Le,wr as Re,x as ze,yr as Be,yt as Ve,z as A}from"./vendor-B1QhM8cf.js";import{t as He}from"./index-DudM-otu.js";import{t as j}from"./AudioCore.svelte-CMh2GeeJ.js";import{t as Ue}from"./DogsLogo-Dk7kEfxs.js";import We from"./SwipeTabNav--jClqSqJ.js";var Ge=class{constructor(e,t){k(this,`canvas`,null),k(this,`gl`,null),k(this,`analyser`,null),k(this,`program`,null),k(this,`animationFrameId`,null),k(this,`startTime`,0),k(this,`vertexBuffer`,null),k(this,`audioTexture`,null),k(this,`uniforms`,{}),k(this,`frequencyBuffer`,null),this.canvas=e,this.analyser=t,this.frequencyBuffer=new Uint8Array(t?t.frequencyBinCount:128),this.gl=e.getContext(`webgl`)||e.getContext(`experimental-webgl`),this.gl||console.error(`WebGL not supported by this browser.`)}init(e){if(!this.gl)return;let t=this.gl;this.cleanupProgram();let n=this.compileShader(t.VERTEX_SHADER,`
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `),r=this.compileShader(t.FRAGMENT_SHADER,e);if(!n||!r)return;if(this.program=t.createProgram(),t.attachShader(this.program,n),t.attachShader(this.program,r),t.linkProgram(this.program),!t.getProgramParameter(this.program,t.LINK_STATUS)){console.error(`Shader program linking failed:`,t.getProgramInfoLog(this.program));return}t.useProgram(this.program);let i=new Float32Array([-1,-1,1,-1,-1,1,1,1]);this.vertexBuffer=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,this.vertexBuffer),t.bufferData(t.ARRAY_BUFFER,i,t.STATIC_DRAW);let a=t.getAttribLocation(this.program,`a_position`);t.enableVertexAttribArray(a),t.vertexAttribPointer(a,2,t.FLOAT,!1,0,0),this.audioTexture=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.audioTexture),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),this.uniforms={time:t.getUniformLocation(this.program,`u_time`),resolution:t.getUniformLocation(this.program,`u_resolution`),volume:t.getUniformLocation(this.program,`u_volume`),bass:t.getUniformLocation(this.program,`u_bass`),mid:t.getUniformLocation(this.program,`u_mid`),treble:t.getUniformLocation(this.program,`u_treble`),audioTexture:t.getUniformLocation(this.program,`u_audioTexture`)},this.startTime=performance.now(),this.resize()}setPreset(e){this.init(e)}compileShader(e,t){if(!this.gl)return null;let n=this.gl,r=n.createShader(e);return n.shaderSource(r,t),n.compileShader(r),n.getShaderParameter(r,n.COMPILE_STATUS)?r:(console.error(`Shader compilation error (${e===n.VERTEX_SHADER?`VERTEX`:`FRAGMENT`}):`,n.getShaderInfoLog(r)),n.deleteShader(r),null)}start(){this.stop();let e=()=>{this.renderFrame(),this.animationFrameId=requestAnimationFrame(e)};this.animationFrameId=requestAnimationFrame(e)}stop(){this.animationFrameId&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null)}resize(){if(!this.gl||!this.canvas)return;let e=this.gl,t=this.canvas.clientWidth,n=this.canvas.clientHeight;(this.canvas.width!==t||this.canvas.height!==n)&&(this.canvas.width=t,this.canvas.height=n,e.viewport(0,0,t,n))}renderFrame(){if(!this.gl||!this.program)return;let e=this.gl;this.resize(),e.useProgram(this.program),e.bindBuffer(e.ARRAY_BUFFER,this.vertexBuffer);let t=(performance.now()-this.startTime)/1e3,n=0,r=0,i=0,a=0;if(this.analyser){this.analyser.getByteFrequencyData(this.frequencyBuffer);let t=this.frequencyBuffer.length,o=0,s=0,c=0;for(let e=0;e<t;e++){let t=this.frequencyBuffer[e];n+=t,e<12?(r+=t,o++):e<64?(i+=t,s++):(a+=t,c++)}n=n/t/255,r=o>0?r/o/255:0,i=s>0?i/s/255:0,a=c>0?a/c/255:0,e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.audioTexture),e.texImage2D(e.TEXTURE_2D,0,e.LUMINANCE,t,1,0,e.LUMINANCE,e.UNSIGNED_BYTE,this.frequencyBuffer)}e.uniform1f(this.uniforms.time,t),e.uniform2f(this.uniforms.resolution,this.canvas.width,this.canvas.height),e.uniform1f(this.uniforms.volume,n),e.uniform1f(this.uniforms.bass,r),e.uniform1f(this.uniforms.mid,i),e.uniform1f(this.uniforms.treble,a),e.uniform1i(this.uniforms.audioTexture,0),e.drawArrays(e.TRIANGLE_STRIP,0,4)}cleanupProgram(){this.gl&&this.program&&(this.gl.deleteProgram(this.program),this.program=null)}destroy(){this.stop();let e=this.gl;e&&(this.cleanupProgram(),this.vertexBuffer&&(e.deleteBuffer(this.vertexBuffer),this.vertexBuffer=null),this.audioTexture&&(e.deleteTexture(this.audioTexture),this.audioTexture=null)),this.canvas=null,this.gl=null,this.analyser=null}},Ke=[{id:`kaleidosync`,name:`Kaleidosync`,fragmentShader:`
      precision mediump float;
      
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform float u_volume;
      uniform float u_bass;
      uniform float u_mid;
      uniform float u_treble;
      uniform sampler2D u_audioTexture;
      
      #define PI 3.14159265359
      
      // Cosine based palette generators
      vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ) {
        return a + b*cos( 6.28318*(c*t+d) );
      }
      
      void main() {
        // Normalize coordinates, center is (0,0)
        vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
        
        // Dynamic zoom driven by volume and bass
        float zoom = 1.0 - (u_bass * 0.15 + u_volume * 0.1);
        uv *= zoom;
        
        // Polar coordinates
        float r = length(uv);
        float a = atan(uv.y, uv.x);
        
        // Kaleidoscope mirror segments
        float segments = 8.0 + floor(u_mid * 4.0); // More segments on high mids
        float segmentAngle = 2.0 * PI / segments;
        
        // Dynamic rotation based on time and audio treble
        float rot = u_time * 0.15 + u_treble * 0.2;
        a += rot;
        
        // Kaleidoscope folding
        float localAngle = mod(a, segmentAngle);
        localAngle = abs(localAngle - segmentAngle * 0.5);
        
        // Cartesian back-transformation
        vec2 p = r * vec2(cos(localAngle), sin(localAngle));
        
        // Audio warping waves
        float wave = texture2D(u_audioTexture, vec2(r * 0.5, 0.0)).r;
        p.x -= wave * (0.05 + u_bass * 0.1);
        
        // Fractal feedback mapping
        for(float i = 0.0; i < 4.0; i++) {
          p = abs(p) / dot(p, p) - vec2(0.8 + u_bass * 0.05);
        }
        
        // Generate beautiful coloring based on polar coordinates and frequency
        float colorFactor = length(p) * 0.15 + u_time * 0.2 + wave * 0.3;
        
        // High-end neon color palette
        vec3 color = palette(
          colorFactor,
          vec3(0.5, 0.5, 0.5),                                  // Brightness
          vec3(0.5, 0.5, 0.5),                                  // Contrast
          vec3(1.0, 1.0, 1.0),                                  // Frequency
          vec3(0.0, 0.33, 0.67) + vec3(u_bass * 0.1, 0.0, u_treble * 0.2) // Phase
        );
        
        // Vingette and glow
        float glow = 0.15 / (r + 0.02);
        color += vec3(glow * 0.12 * (1.0 + u_bass));
        
        // Soft audio-modulated background glow
        color += vec3(0.08, 0.04, 0.12) * (1.0 + u_bass * 1.5) * (1.0 - r * 0.8);
        
        gl_FragColor = vec4(color, 1.0);
      }
    `},{id:`neon-tunnel`,name:`Neon Tunnel`,fragmentShader:`
      precision mediump float;
      
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform float u_volume;
      uniform float u_bass;
      uniform float u_mid;
      uniform float u_treble;
      uniform sampler2D u_audioTexture;
      
      #define PI 3.14159265359
      
      void main() {
        vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
        
        float r = length(uv);
        float a = atan(uv.y, uv.x);
        
        // 3D Perspective mapping to tunnel
        float tunnelDepth = 1.0 / (r + 0.01);
        float tunnelAngle = a / (2.0 * PI) + 0.5;
        
        // Read frequency data at polar angles
        float freq = texture2D(u_audioTexture, vec2(tunnelAngle, 0.0)).r;
        
        // Animate coordinate systems moving through the tunnel
        float z = tunnelDepth + u_time * 1.2 - freq * 0.25;
        float x = tunnelAngle * 6.0 + u_time * 0.1 + sin(z * 0.5) * 0.2;
        
        // Procedural grid lines inside the tunnel
        float gridX = abs(sin(x * PI));
        float gridZ = abs(sin(z * PI));
        
        // Neon edge glows modulated by audio
        float glowX = smoothstep(0.92 - u_mid * 0.05, 1.0, gridX);
        float glowZ = smoothstep(0.92 - u_bass * 0.05, 1.0, gridZ);
        
        // Grid pattern
        float finalGlow = max(glowX, glowZ);
        
        // Radial color gradient that rotates and changes phase
        vec3 neonColor = vec3(
          sin(u_time * 0.2 + z * 0.05) * 0.5 + 0.5,
          cos(u_time * 0.3 + z * 0.08) * 0.5 + 0.5,
          sin(u_time * 0.1 - z * 0.1) * 0.5 + 0.5
        );
        
        // Glow scaling
        vec3 finalColor = finalGlow * neonColor * 2.2;
        
        // Add brightness tunnel ring pulses
        float ringPulse = sin(z * 3.0 - u_time * 5.0) * 0.5 + 0.5;
        finalColor += neonColor * ringPulse * 0.35 * u_bass;
        
        // Darken center to give depth
        finalColor *= smoothstep(0.0, 0.5, r);
        
        // Bass flash glow in center
        finalColor += vec3(0.8, 0.4, 1.0) * (0.015 / (r + 0.015)) * u_bass * 1.2;
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `},{id:`cyber-grid`,name:`Cyber Grid`,fragmentShader:`
      precision mediump float;
      
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform float u_volume;
      uniform float u_bass;
      uniform float u_mid;
      uniform float u_treble;
      uniform sampler2D u_audioTexture;
      
      void main() {
        // Normalized screen coords
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
        
        // perspective projection simulation for the ground grid
        if (p.y < 0.15) {
          // Perspective grid coordinates
          float depth = 0.15 - p.y;
          float z = 1.0 / (depth + 0.001);
          float x = p.x * z * 0.5;
          
          // Audio waves deforming the grid coordinates
          float wave = texture2D(u_audioTexture, vec2(abs(x) * 0.05, 0.0)).r;
          z += wave * u_bass * 8.0;
          
          // Animate grid scroll
          x += sin(z * 0.05) * 0.1;
          z -= u_time * 4.0;
          
          // Grid lines calculations
          float gridLineX = smoothstep(0.04 + u_treble * 0.02, 0.0, abs(sin(x * 2.0) / z));
          float gridLineZ = smoothstep(0.04 + u_bass * 0.02, 0.0, abs(sin(z * 0.2) / z));
          
          float gridIntensity = max(gridLineX, gridLineZ) * (p.y + 0.25) * 3.5;
          
          // Deep cyber blue & magenta colors
          vec3 gridColor = mix(
            vec3(0.0, 0.6, 1.0), // Cyber Cyan
            vec3(1.0, 0.0, 0.6), // Vapor Magenta
            sin(z * 0.02 + u_time) * 0.5 + 0.5
          );
          
          vec3 finalColor = gridIntensity * gridColor;
          
          // Horizon glow
          float horizonGlow = smoothstep(0.0, 0.15, p.y + 0.1);
          finalColor += gridColor * (0.01 / (abs(p.y - 0.15) + 0.01)) * (0.5 + u_bass * 0.5);
          
          gl_FragColor = vec4(finalColor, 1.0);
        } else {
          // Cyber sky background with audio bars rising
          float distToHorizon = p.y - 0.15;
          
          // Horizon sunset glow
          vec3 sunColor = vec3(1.0, 0.1, 0.5); // Pink sunset
          vec3 skyColor = vec3(0.05, 0.02, 0.1); // Dark sky
          
          vec3 finalColor = mix(sunColor, skyColor, smoothstep(0.0, 0.8, distToHorizon));
          
          // Add neon audio equalizer bars rising from the horizon (centered skinnier layout)
          float scaleX = 0.6;
          float startX = 0.2;
          float mappedX = (uv.x - startX) / scaleX;
          
          if (mappedX >= 0.0 && mappedX <= 1.0) {
            float numBars = 16.0;
            float barIndex = floor(mappedX * numBars);
            float localBarX = fract(mappedX * numBars);
            
            // Fetch frequency for this bar
            float barFreq = texture2D(u_audioTexture, vec2(barIndex / numBars, 0.0)).r;
            
            // Bar height driven by frequency
            float barHeight = 0.15 + barFreq * 0.55;
            
            // Render glowing bars
            if (uv.y > 0.2 && uv.y < barHeight && localBarX > 0.15 && localBarX < 0.85) {
              float barGlow = smoothstep(0.0, 0.4, 1.0 - abs(localBarX - 0.5) * 2.0);
              
              // Equalizer neon color gradient (from pink to cyan)
              vec3 barColor = mix(
                vec3(1.0, 0.0, 0.6), // bottom pink
                vec3(0.0, 0.8, 1.0), // top cyan
                (uv.y - 0.2) / 0.55
              );
              
              finalColor += barColor * barGlow * 1.5;
            }
          }
          
          // Distant star dots pulsing to treble
          float stars = fract(sin(dot(uv.xy, vec2(12.9898, 78.233))) * 43758.5453);
          if (stars > 0.998 && uv.y > 0.4) {
            finalColor += vec3(1.0) * (0.5 + u_treble * 0.5);
          }
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      }
    `}],qe={id:`no-signal`,name:`No Signal`,fragmentShader:`
    precision mediump float;
    
    uniform float u_time;
    uniform vec2 u_resolution;
    
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }
    
    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      
      // High-frequency analog noise
      float noise = hash(uv + u_time * 15.0);
      
      // Horizontal scanlines
      float scanline = sin(uv.y * 450.0) * 0.12;
      
      // Slowly drifting vertical bar
      float bar = sin(uv.y * 2.5 + u_time * 1.8) * 0.05;
      
      // Subtle color chromatic aberration tint (shift screen coordinates per channel)
      float r = hash(uv + u_time * 15.0 + vec2(0.005, 0.0));
      float g = hash(uv + u_time * 15.0 + vec2(0.0, 0.005));
      float b = hash(uv + u_time * 15.0 + vec2(-0.005, -0.005));
      
      vec3 color = vec3(r - scanline + bar, g - scanline + bar, b - scanline + bar);
      
      // Apply dark retro vignetting
      float vignette = uv.x * (1.0 - uv.x) * uv.y * (1.0 - uv.y) * 16.0;
      vignette = clamp(pow(vignette, 0.3), 0.0, 1.0);
      color *= vignette * 0.85;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `},Je=n(`<div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 animate-pulse svelte-1o4jdf5"><div class="bg-black/75 border border-red-500/30 px-3 py-1.5 rounded text-[10px] font-mono tracking-widest text-red-500 font-bold uppercase shadow-[0_0_15px_rgba(239,68,68,0.25)] select-none svelte-1o4jdf5">NO SIGNAL</div></div>`),Ye=n(`<div class="visualizer-container cursor-pointer svelte-1o4jdf5"><canvas class="visualizer-canvas svelte-1o4jdf5"></canvas> <!> <div class="visualizer-hover-overlay svelte-1o4jdf5"><!></div></div>`),Xe=n(`<div class="visualizer-container bg-[#050508]/40 border border-white/5 flex items-center justify-center svelte-1o4jdf5"><!></div>`),Ze=n(`<div class="vinyl-record-clicker cursor-pointer w-full h-full svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div><div class="groove g1 svelte-1o4jdf5"></div> <div class="groove g2 svelte-1o4jdf5"></div> <div class="groove g3 svelte-1o4jdf5"></div> <div class="groove g4 svelte-1o4jdf5"></div> <div class="record-label svelte-1o4jdf5"><img loading="lazy"/></div> <div class="spindle svelte-1o4jdf5"></div></div> <div></div></div>`),Qe=n(`<div class="spin-ring svelte-1o4jdf5"></div>`),$e=n(`<div class="volume-popover svelte-1o4jdf5"><button class="ctrl ctrl-xs mr-2 border border-white/10 rounded-full p-1 hover:bg-white/10 svelte-1o4jdf5" aria-label="Mute"><!></button> <input type="range" class="vol-slider-pop svelte-1o4jdf5" min="0" max="1" step="0.01" aria-label="Volume"/> <span class="text-[10px] font-bold text-white/60 min-w-[28px] text-right font-mono select-none svelte-1o4jdf5"> </span></div>`),et=n(`<div class="eq svelte-1o4jdf5"><div class="eq-b svelte-1o4jdf5"></div> <div class="eq-b svelte-1o4jdf5"></div> <div class="eq-b svelte-1o4jdf5"></div></div>`),tt=n(`<span class="svelte-1o4jdf5"></span>`),nt=n(`<span class="text-amber-400 flex items-center gap-1 text-[9px] font-bold tracking-wider uppercase bg-amber-500/10 px-1.5 py-0.5 rounded flex-shrink-0 svelte-1o4jdf5" title="Failed to fetch music source from remote database"><!> Error Fetching</span>`),rt=n(`<span class="inst-chip-link svelte-1o4jdf5"><a target="_blank" class="svelte-1o4jdf5">i</a></span>`),it=n(`<div><div class="tr-num svelte-1o4jdf5"><!></div> <img loading="lazy" class="tr-art svelte-1o4jdf5"/> <div class="tr-info svelte-1o4jdf5"><div class="flex items-center gap-1.5 min-w-0 svelte-1o4jdf5"><span> </span> <!></div> <span class="tr-meta svelte-1o4jdf5"> </span></div> <div class="flex items-center gap-2 flex-shrink-0 svelte-1o4jdf5"><!>  <button class="tr-share-btn svelte-1o4jdf5" title="Copy track link" aria-label="Share track"><!></button></div></div>`),at=n(`<div class="songs-layout svelte-1o4jdf5"><div><div><div class="vinyl-wrapper relative svelte-1o4jdf5"><!></div> <div class="track-info mt-2 svelte-1o4jdf5"><div class="flex items-center justify-center mb-1.5 svelte-1o4jdf5"><button class="player-share-btn svelte-1o4jdf5" title="Copy track link" aria-label="Share track"><!></button></div> <div><h2> </h2></div> <div><p> </p></div> <div><p> </p></div></div></div> <div class="player-controls-block svelte-1o4jdf5"><div class="progress-row svelte-1o4jdf5"><span class="ptime svelte-1o4jdf5"> </span> <div class="progress-wrap svelte-1o4jdf5"><div class="progress-fill svelte-1o4jdf5"></div> <input type="range" class="seek-input svelte-1o4jdf5" min="0" step="0.1" aria-label="Seek"/></div> <span class="ptime svelte-1o4jdf5"> </span></div> <div class="controls-row svelte-1o4jdf5"><button aria-label="Shuffle"><!></button> <button class="ctrl ctrl-md svelte-1o4jdf5" aria-label="Previous"><!></button> <button><!></button> <button class="ctrl ctrl-md svelte-1o4jdf5" aria-label="Next"><!></button> <button aria-label="Repeat"><!></button></div> <div class="w-full flex flex-col items-center gap-1.5 mt-2 px-1 svelte-1o4jdf5"><div><span><!> <span class="svelte-1o4jdf5">VOCAL</span></span> <div class="dj-fader-slot relative svelte-1o4jdf5"><div></div></div> <span><!> <span class="svelte-1o4jdf5">INST</span></span></div></div> <div class="relative flex justify-center items-center gap-3 mt-2 w-full svelte-1o4jdf5"><!> <div class="flex items-center gap-1.5 svelte-1o4jdf5"><button aria-label="Toggle Visualizer"><!></button> <button> </button></div> <div class="relative svelte-1o4jdf5"><button class="ctrl ctrl-xs vol-toggle-btn svelte-1o4jdf5" aria-label="Toggle volume slider"><!></button></div></div></div></div> <div><div class="mobile-close-bar hidden py-2 px-4 border-b border-white/5 flex items-center justify-between svelte-1o4jdf5"><span class="text-xs font-bold text-white/50 svelte-1o4jdf5">Track Library</span> <button class="px-3 py-1 bg-white/5 text-white/75 rounded-lg text-xs font-bold svelte-1o4jdf5">Back to player</button></div> <div class="tl-header flex justify-between items-center gap-3 svelte-1o4jdf5"><div class="flex items-center gap-2 svelte-1o4jdf5"><!><span class="svelte-1o4jdf5">TRACKS</span> <span class="tl-count svelte-1o4jdf5"> </span></div> <div class="flex items-center gap-1.5 ml-auto svelte-1o4jdf5"><span class="text-[9px] text-white/30 font-bold font-sans svelte-1o4jdf5">SORT BY:</span> <select class="bg-black/40 border border-white/10 rounded px-1.5 py-0.5 text-[10px] font-bold text-white/60 outline-none cursor-pointer hover:border-white/20 transition-all font-sans svelte-1o4jdf5"><option class="svelte-1o4jdf5">DEFAULT</option><option class="svelte-1o4jdf5">ARTIST</option><option class="svelte-1o4jdf5">ALBUM</option><option class="svelte-1o4jdf5">YEAR</option><option class="svelte-1o4jdf5">FILENAME</option><option class="svelte-1o4jdf5">GENRE</option><option class="svelte-1o4jdf5">SEASON</option></select></div></div> <div class="tracklist scroll-y svelte-1o4jdf5"></div></div></div>`),ot=n(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><div class="sec-head svelte-1o4jdf5"><h2 class="sec-title svelte-1o4jdf5">Samples</h2> <p class="sec-sub svelte-1o4jdf5">MP3 · MP4 · WAV · OGG · YouTube · Instagram · TikTok</p></div> <div class="drop-zone svelte-1o4jdf5"><!> <p class="drop-title svelte-1o4jdf5">Drop files or paste a link</p> <p class="drop-sub svelte-1o4jdf5">Supports all major audio, video, and streaming links</p> <div class="link-row svelte-1o4jdf5"><input type="url" class="link-input svelte-1o4jdf5" placeholder="https://youtube.com/watch?v=..." aria-label="Paste link"/> <button class="add-btn svelte-1o4jdf5"><!>Add</button></div></div> <div class="empty-state svelte-1o4jdf5"><div class="wip-tape svelte-1o4jdf5">COMING SOON</div> <p class="svelte-1o4jdf5">Your samples will appear here once added.</p></div></div>`),st=n(`<div class="svc-chip svelte-1o4jdf5"><span class="svelte-1o4jdf5"> </span><span class="svelte-1o4jdf5"> </span><!></div>`),ct=n(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><div class="sec-head svelte-1o4jdf5"><h2 class="sec-title svelte-1o4jdf5">Playlists</h2> <p class="sec-sub svelte-1o4jdf5">Connect Spotify to sync playlists across all services
              automatically</p></div> <div class="spotify-card svelte-1o4jdf5"><div class="sp-icon svelte-1o4jdf5"><svg viewBox="0 0 24 24" fill="currentColor" width="30" height="30" class="svelte-1o4jdf5"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" class="svelte-1o4jdf5"></path></svg></div> <div class="sp-info svelte-1o4jdf5"><h3 class="svelte-1o4jdf5">Connect Spotify</h3> <p class="svelte-1o4jdf5">Import your playlists and sync across services</p></div> <button class="sp-btn svelte-1o4jdf5">Connect <!></button></div> <div class="svc-chips svelte-1o4jdf5"></div> <div class="empty-state mx-auto max-w-[380px] text-center svelte-1o4jdf5"><div class="wip-tape svelte-1o4jdf5">COMING SOON</div> <p class="svelte-1o4jdf5">Connect Spotify to see your playlists, automatically transcribed
              across all services.</p></div></div>`),lt=n(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><div class="sec-head svelte-1o4jdf5"><h2 class="sec-title svelte-1o4jdf5">Radio</h2> <p class="sec-sub svelte-1o4jdf5">Stream live broadcasts, dog shows, and podcast feeds</p></div> <div class="empty-state mx-auto max-w-[380px] text-center svelte-1o4jdf5"><div class="wip-tape svelte-1o4jdf5">COMING SOON</div> <p class="svelte-1o4jdf5">Live radio feeds will appear here once connected.</p></div></div>`),ut=n(`<div class="app-loading-spinner svelte-1o4jdf5" aria-label="Loading..."></div>`),dt=n(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><!></div>`),ft=n(`<div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 animate-pulse svelte-1o4jdf5"><div class="bg-black/75 border border-red-500/30 px-4 py-2 rounded text-[12px] font-mono tracking-widest text-red-500 font-bold uppercase shadow-[0_0_20px_rgba(239,68,68,0.3)] select-none svelte-1o4jdf5">NO SIGNAL</div></div>`),pt=n(`<button> </button>`),mt=n(`<div class="visualizer-container fullscreen cursor-pointer svelte-1o4jdf5"><canvas class="visualizer-canvas svelte-1o4jdf5"></canvas> <!> <div class="visualizer-overlay svelte-1o4jdf5"><div class="flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-lg p-1 border border-white/10 svelte-1o4jdf5"></div></div></div>`),M=n(`<div class="mp-backdrop svelte-1o4jdf5"><div><header class="panel-header svelte-1o4jdf5"><div class="brand svelte-1o4jdf5"><button class="logo-btn svelte-1o4jdf5" aria-label="Open DOGS Info"><!></button> <h1 class="svelte-1o4jdf5"></h1></div> <button class="close-btn svelte-1o4jdf5" aria-label="Close panel"><!></button></header> <!> <div class="mp-body svelte-1o4jdf5"><!></div> <footer class="mp-footer svelte-1o4jdf5"><div class="mp-status svelte-1o4jdf5"><span class="mp-dot svelte-1o4jdf5"></span><span class="svelte-1o4jdf5">WE ARE DOGS</span></div> <span class="svelte-1o4jdf5">MUSIC</span></footer></div> <!> <canvas class="fader-fx-canvas pointer-events-none svelte-1o4jdf5"></canvas></div>`);function ht(n,m){we(m,!0);let k=[{id:`songs`,label:`Songs`,icon:c},{id:`samples`,label:`Samples`,icon:fe},{id:`playlists`,label:`Playlists`,icon:T},{id:`radio`,label:`Radio`,icon:me},{id:`battle`,label:`Battle`,icon:Pe}],ht=`/img/error_cover.png`;function gt(e){e.target.src.endsWith(ht)||(e.target.src=ht)}let _t=be(m,`isClosing`,3,!1),vt=be(m,`initialTrackId`,3,null),N=x(`songs`),P=x(`default`),yt=x(null);u(()=>{p(N)===`battle`&&!p(yt)&&He(()=>import(`./BattlePanel-Dy3j8f_-.js`).then(e=>{b(yt,e.default,!0)}),__vite__mapDeps([0,1,2,3,4]))});let F=x(!1),bt=x(!1),xt=x(!1),St=x(null),I=x(!1),Ct=x(0),wt=x(!1),Tt=x(null),L=null,R=!1,Et=x(!1);u(()=>{j.isPlaying&&b(Et,!0)});let Dt=ye(()=>!j.isPlaying&&!p(Et)?qe.fragmentShader:Ke[p(Ct)].fragmentShader);u(()=>{let e=j.analyser;return p(I)&&p(Tt)&&(L=new Ge(p(Tt),e),L.init(p(Dt)),L.start()),()=>{L&&(L.destroy(),L=null)}}),u(()=>{let e=p(Dt);L&&p(I)&&(L.setPreset(e),L.start())}),u(()=>{p(F)?!history.state?.tracklistOpen&&!R&&(history.pushState({tracklistOpen:!0},``),R=!0):R&&(history.back(),R=!1)}),a(()=>{R&&(history.back(),R=!1)});function Ot(e){!e.state?.tracklistOpen&&p(F)&&(b(F,!1),R=!1)}function kt(e){p(xt)&&p(St)&&!p(St).contains(e.target)&&!e.target.closest(`.vol-toggle-btn`)&&b(xt,!1)}let z=[{id:`hollywood`,title:`HOLLYWOOD`,artist:`YG`,album:`THE GENTLEMEN'S CLUB`,cover:`https://data.wearedogs.net/img/covers/2026/yg.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/yg.jpg`,src:`https://data.wearedogs.net/music/2026/HOLLYWOOD.mp3`,instrumental:`https://data.wearedogs.net/music/2026/HOLLYWOOD-free.mp3`,dateAdded:`2026-06-24T03:00:00-05:00`,year:2026,genre:`Hip-Hop`,attrib:`https://the-gentlemens-club.com/`},{id:`chicago`,title:`Chicago`,artist:`Michael Jackson`,album:`Xscape`,cover:`https://data.wearedogs.net/img/covers/2026/mj.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/mj.jpg`,src:`https://data.wearedogs.net/music/2026/Chicago.mp3`,instrumental:`https://data.wearedogs.net/music/2026/Chicago-free.mp3`,dateAdded:`2026-06-24T03:00:00-05:00`,year:2014,genre:`Pop`},{id:`rain`,title:`Pourin Rain (feat. Skratch Bastid)`,artist:`Zed's Dead`,album:`Return to the Return (of the Spectrum of Intergalactic Happiness)`,cover:`https://data.wearedogs.net/img/covers/2026/zd.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/zd.jpg`,src:`https://data.wearedogs.net/music/2026/Pourin.mp3`,instrumental:``,dateAdded:`2026-07-07T018:12:00-05:00`,year:2026,genre:`Electronic`,attrib:`https://shop.zedsdead.net/`},{id:`denchai`,title:`Den Chai`,artist:`The Buddha-Bar Lounge`,album:`Den Chai`,cover:`https://data.wearedogs.net/img/covers/2026/buddha.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/buddha.png`,src:`https://data.wearedogs.net/music/2026/DENCHAI.mp3`,instrumental:``,dateAdded:`2026-07-07T22:34:00-05:00`,year:2008,genre:`Lounge`,attrib:`https://open.spotify.com/artist/0du3MpnxBOpQEie1IV3u9v?si=2UO722ntTE--Ck_Ji7Go7Q`},{id:`rainbow`,title:`Rainbow in the Dark`,artist:`Das Racist`,album:`Shut Up, Dude`,cover:`https://data.wearedogs.net/img/covers/2026/rainbow.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/rainbow.png`,src:`https://data.wearedogs.net/music/2026/rainbow.mp3`,instrumental:`https://data.wearedogs.net/music/2026/rainbow-free.mp3`,dateAdded:`2026-07-08T16:35:00-05:00`,year:2010,genre:`Hip-Hop`,attrib:`https://dasracist.bandcamp.com/album/shut-up-dude`},{id:`hipsong`,title:`Hip Song`,artist:`Toby Fox / Trevor Alan Gomes`,album:`Deltarune`,cover:`https://data.wearedogs.net/img/covers/2026/deltarune.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/deltarune.png`,src:`https://data.wearedogs.net/music/2026/shop.mp3`,instrumental:`https://data.wearedogs.net/music/2026/shop-free.mp3`,dateAdded:`2026-07-09T01:22:00-05:00`,year:2021,genre:`Video Game`,attrib:`https://deltarune.com/`},{id:`sleepless`,title:`Sleepless`,artist:`deadmau5`,album:`> album title goes here <`,cover:`https://data.wearedogs.net/img/covers/2026/sleepless.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/sleepless.png`,src:``,instrumental:`https://data.wearedogs.net/music/2026/sleepless.mp3`,dateAdded:`2026-07-12T04:22:00-05:00`,year:2026,genre:`Electronic`,attrib:`https://deadmau5.com/`}];function At(e){return e.src?e.src.split(`/`).pop():``}function jt(e){if(!e.dateAdded)return`Summer`;let t=new Date(e.dateAdded).getMonth();return t===11||t===0||t===1?`Winter`:t>=2&&t<=4?`Spring`:t>=5&&t<=7?`Summer`:`Fall`}let B=ye(()=>{let e=[...z];return p(P)===`artist`?e.sort((e,t)=>e.artist.localeCompare(t.artist)):p(P)===`album`?e.sort((e,t)=>e.album.localeCompare(t.album)):p(P)===`year`?e.sort((e,t)=>(e.year||0)-(t.year||0)):p(P)===`filename`?e.sort((e,t)=>At(e).localeCompare(At(t))):p(P)===`genre`?e.sort((e,t)=>(e.genre||``).localeCompare(t.genre||``)):p(P)===`season`&&e.sort((e,t)=>jt(e).localeCompare(jt(t))),e}),V=ye(()=>z[j.currentTrackIndex]),Mt=x(0),Nt=x(0),Pt=x(0),Ft=x(0),It=x(0),Lt=x(0),Rt=x(null),zt=null;function Bt(e,t){e.stopPropagation();let n=`${window.location.origin}/music/${t.id}`;navigator.clipboard.writeText(n).then(()=>{b(Rt,t.id,!0),zt&&clearTimeout(zt),zt=setTimeout(()=>{b(Rt,null)},2e3)}).catch(e=>{console.error(`Failed to copy share link:`,e)})}a(()=>{zt&&clearTimeout(zt)}),Re(()=>{if(j.init(z),vt()){let e=z.findIndex(e=>e.id===vt());e!==-1&&j.loadTrack(e,!0)}else if(!j.hasPickedRandomTrack){j.hasPickedRandomTrack=!0;let e=Math.floor(Math.random()*z.length);j.loadTrack(e,!1)}});let H=x(null);function Vt(){let e=document.querySelector(`.track-row[data-track-id="${p(H)}"]`);e&&e.scrollIntoView({block:`nearest`,behavior:`smooth`})}function Ht(e){b(H,e.id,!0);let t=z.findIndex(t=>t.id===e.id);j.currentTrackIndex===t&&!j.fetchErrors[e.id]?j.togglePlay():j.loadTrack(t,!0)}function Ut(){window.innerWidth<=640?b(F,!0):b(I,!p(I))}function Wt(){let e=!j.isInstrumental;j.setCrossfade(e)||(ue(G),p(Xt)||(b(Xt,!0),setTimeout(()=>{b(Xt,!1)},300)),p(G)===5?($(),b(Zt,!0),setTimeout(()=>{b(Zt,!1)},150)):p(G)===10?$(35):p(G)>5&&p(G)<10?$(8):p(G)>10&&Math.random()<.4&&$(3))}function Gt(e){return!e||isNaN(e)?`0:00`:`${Math.floor(e/60)}:${Math.floor(e%60).toString().padStart(2,`0`)}`}function Kt(e){let t=document.activeElement;if(!(t&&(t.tagName===`INPUT`||t.tagName===`TEXTAREA`||t.isContentEditable))){if(e.shiftKey){if(e.key===`ArrowRight`){e.preventDefault(),b(N,k[(k.findIndex(e=>e.id===p(N))+1)%k.length].id,!0);return}else if(e.key===`ArrowLeft`){e.preventDefault(),b(N,k[(k.findIndex(e=>e.id===p(N))-1+k.length)%k.length].id,!0);return}}if(e.code===`Space`||e.key===` `)p(N)===`songs`&&(e.preventDefault(),j.togglePlay());else if(e.key===`ArrowDown`){if(p(N)===`songs`&&p(B).length>0){e.preventDefault();let t=p(B).findIndex(e=>e.id===p(H));if(t===-1){let e=z[j.currentTrackIndex];t=p(B).findIndex(t=>t.id===e?.id)}let n=(t+1)%p(B).length;b(H,p(B)[n].id,!0),Vt()}}else if(e.key===`ArrowUp`){if(p(N)===`songs`&&p(B).length>0){e.preventDefault();let t=p(B).findIndex(e=>e.id===p(H));if(t===-1){let e=z[j.currentTrackIndex];t=p(B).findIndex(t=>t.id===e?.id)}let n=(t-1+p(B).length)%p(B).length;b(H,p(B)[n].id,!0),Vt()}}else if(e.key===`Enter`&&p(N)===`songs`&&p(H)){e.preventDefault();let t=p(B).find(e=>e.id===p(H));t&&Ht(t)}}}let qt=0,U=0;function Jt(e){if(e.target&&(e.target.tagName===`INPUT`||e.target.closest(`button`)||e.target.closest(`.ctrl`))){qt=0,U=0;return}qt=e.touches[0].clientX,U=e.touches[0].clientY}function Yt(e){if(qt===0||!e.changedTouches||e.changedTouches.length===0)return;let t=e.changedTouches[0].clientX-qt,n=e.changedTouches[0].clientY-U;if(Math.abs(t)<=Math.abs(n)||Math.abs(t)<=60)return;let r=k.findIndex(e=>e.id===p(N));r!==-1&&(t<0&&r<k.length-1?b(N,k[r+1].id,!0):t>0&&r>0&&b(N,k[r-1].id,!0))}let W=x(null),G=x(0),Xt=x(!1),Zt=x(!1),K,q,J,Y=[],X=[],Qt,$t=x(!1);u(()=>(p(W)&&en(),()=>{Qt&&cancelAnimationFrame(Qt),window.removeEventListener(`resize`,Q),J&&(J.dispose(),J=null),K=null,q=null,Y=[],X=[]})),u(()=>{if(j.currentTrackIndex,p(N),_t(),b(G,0),b($t,!1),K){for(let e of Y)K.remove(e.mesh);for(let e of X)K.remove(e.mesh)}Y=[],X=[]});function Z(){let e=document.querySelector(`.dj-fader-knob`);if(!e)return{x:window.innerWidth/2,y:window.innerHeight/2};let t=e.getBoundingClientRect();return{x:t.left+t.width*.15,y:window.innerHeight-(t.top+t.height*.85)}}function en(){if(!p(W))return;let e=window.innerWidth,t=window.innerHeight;p(W).width=e,p(W).height=t,K=new re,q=new oe(0,e,t,0,-1,1),J=new Se({canvas:p(W),alpha:!0,antialias:!0}),J.setSize(e,t,!1),J.setPixelRatio(Math.min(window.devicePixelRatio,2)),window.addEventListener(`resize`,Q),tn()}function Q(){if(!p(W)||!J||!q)return;let e=window.innerWidth,t=window.innerHeight;p(W).width=e,p(W).height=t,J.setSize(e,t,!1),q.right=e,q.top=t,q.updateProjectionMatrix()}function tn(){if(Qt=requestAnimationFrame(tn),!(!K||!q||!J||!p(W))){if(p(G)>=10&&(b($t,!0),Math.random()<.22)){let e=Z();nn(e.x,e.y)}for(let e=Y.length-1;e>=0;e--){let t=Y[e];t.x+=t.vx,t.y+=t.vy,t.vy+=t.ay,t.life-=t.decay,t.mesh.position.set(t.x,t.y,0),t.mesh.material.opacity=t.life,t.life<=0&&(K.remove(t.mesh),t.mesh.geometry.dispose(),t.mesh.material.dispose(),Y.splice(e,1))}for(let e=X.length-1;e>=0;e--){let t=X[e];t.x+=t.vx,t.y+=t.vy,t.life-=t.decay;let n=t.startScale+(1-t.life)*88;t.mesh.scale.set(n,n,1),t.mesh.position.set(t.x,t.y,0),t.mesh.material.opacity=t.life*.16,t.life<=0&&(K.remove(t.mesh),t.mesh.geometry.dispose(),t.mesh.material.dispose(),X.splice(e,1))}J.render(K,q)}}function nn(e,n){if(!K)return;let r=new ze(5,8),i=.85+Math.random()*.12,a=new Te(r,new t({color:new _(i,i,i*1.01),transparent:!0,opacity:.06,blending:1}));a.position.set(e,n,0),K.add(a),X.push({mesh:a,x:e,y:n,vx:(Math.random()-.5)*.55+Math.sin(Date.now()*.001)*.22,vy:Math.random()*.7+1.25,startScale:1,life:1,decay:6e-4+Math.random()*4e-4})}function $(e=25){if(!K||!p(W))return;let n=Z(),r=n.x,i=n.y;for(let n=0;n<e;n++){let e=new Te(new ze(1.3,4),new t({color:new _(Math.random()<.4?16711765:16755200),transparent:!0,opacity:1,blending:2}));e.position.set(r,i,0),K.add(e);let n=Math.random()*Math.PI*2,a=Math.random()*4+2;Y.push({mesh:e,x:r,y:i,vx:Math.cos(n)*a,vy:Math.sin(n)*a,ay:-.15,life:1,decay:.02+Math.random()*.02})}}var rn=M();l(`keydown`,te,Kt),l(`popstate`,te,Ot),l(`click`,te,kt);var an=f(rn);let on;var sn=f(an),cn=f(sn),ln=f(cn);Ue(f(ln),{size:`panel`}),E(ln);var un=d(ln,2);un.textContent=`MUSIC`,E(cn);var dn=d(cn,2);he(f(dn),{size:20}),E(dn),E(sn);var fn=d(sn,2);We(fn,{get tabs(){return k},get activeTab(){return p(N)},set activeTab(e){b(N,e,!0)}});var pn=d(fn,2),mn=f(pn),hn=t=>{var n=at(),i=f(n);let a;var c=f(i);let te;var u=f(c),re=f(u),oe=e=>{var t=Ye(),n=f(t);Fe(n,e=>b(Tt,e),()=>p(Tt));var r=d(n,2),i=e=>{h(e,Je())};v(r,e=>{!j.isPlaying&&!p(Et)&&e(i)});var a=d(r,2);Me(f(a),{size:16,class:`text-white/70`}),E(a),E(t),g(`click`,t,()=>{b(wt,!0)}),h(e,t)},m=e=>{var t=Xe();Me(f(t),{size:16,class:`text-white/20`}),E(t),h(e,t)},se=e=>{var t=Ze(),n=f(t);let r;var i=d(f(n),8),a=f(i);let o;E(i),C(2),E(n);var s=d(n,2);let c;E(t),y(()=>{r=O(n,1,`vinyl-record svelte-1o4jdf5`,null,r,{spinning:j.isPlaying}),D(a,`src`,j.fetchErrors[p(V).id]||!p(V).cover?ht:p(V).cover),D(a,`alt`,p(V).album),o=O(a,1,`record-art svelte-1o4jdf5`,null,o,{loaded:p(bt)}),c=O(s,1,`tonearm svelte-1o4jdf5`,null,c,{playing:j.isPlaying})}),g(`click`,t,Ut),l(`load`,a,()=>b(bt,!0)),l(`error`,a,gt),ie(a),h(e,t)};v(re,e=>{p(I)&&!p(wt)?e(oe):p(I)&&p(wt)?e(m,1):e(se,-1)}),E(u);var ue=d(u,2),de=f(ue),_=f(de),me=f(_),he=e=>{r(e,{size:12,class:`text-[#22c55e]`})},x=e=>{Ve(e,{size:12})};v(me,e=>{p(Rt)===p(V).id?e(he):e(x,-1)}),E(_),E(de);var S=d(de,2);let ye;var be=f(S);let Se;var we=f(be,!0);E(be),E(S);var T=d(S,2);let Te;var Ee=f(T);let je;var Ne=f(Ee,!0);E(Ee),E(T);var k=d(T,2);let Pe;var Re=f(k);let ze;var He=f(Re,!0);E(Re),E(k),E(ue),E(c);var Ue=d(c,2),We=f(Ue),Ge=f(We),qe=f(Ge,!0);E(Ge);var ot=d(Ge,2),st=f(ot),ct=d(st,2);ge(ct),E(ot);var lt=d(ot,2),ut=f(lt,!0);E(lt),E(We);var dt=d(We,2),ft=f(dt);let pt;Ce(f(ft),{size:15}),E(ft);var mt=d(ft,2);Oe(f(mt),{size:19}),E(mt);var M=d(mt,2);let _t;var vt=f(M),N=e=>{Ie(e,{size:22})},yt=e=>{h(e,Qe())},L=e=>{ae(e,{size:22,fill:`currentColor`})},R=e=>{le(e,{size:22,fill:`currentColor`})};v(vt,e=>{j.fetchErrors[p(V).id]?e(N):j.isLoading?e(yt,1):j.isPlaying?e(L,2):e(R,-1)}),E(M);var Dt=d(M,2);Ae(f(Dt),{size:19}),E(Dt);var Ot=d(Dt,2);let kt;var At=f(Ot),jt=e=>{ce(e,{size:15})},zt=e=>{s(e,{size:15})};v(At,e=>{j.repeatMode===2?e(jt):e(zt,-1)}),E(Ot),E(dt);var Vt=d(dt,2),Kt=f(Vt);let qt;var U=f(Kt);let Jt;fe(f(U),{size:12}),C(2),E(U);var Yt=d(U,2),W=f(Yt);let K;E(Yt);var q=d(Yt,2);let J;Le(f(q),{size:12}),C(2),E(q),E(Kt),E(Vt);var Y=d(Vt,2),X=f(Y),Qt=e=>{var t=$e(),n=f(t),r=f(n),i=e=>{pe(e,{size:12,class:`text-red-400`})},a=e=>{ee(e,{size:12})};v(r,e=>{j.isMuted||j.volume===0?e(i):e(a,-1)}),E(n);var s=d(n,2);ge(s);var c=d(s,2),l=f(c);E(c),E(t),Fe(t,e=>b(St,e),()=>p(St)),y(e=>{ve(s,j.volume),o(l,`${e??``}%`)},[()=>Math.round(j.volume*100)]),g(`click`,n,()=>j.toggleMute()),g(`input`,s,e=>j.setVolume(parseFloat(e.target.value))),h(e,t)};v(X,e=>{p(xt)&&e(Qt)});var $t=d(X,2),Z=f($t);let en;ne(f(Z),{size:13}),E(Z);var Q=d(Z,2),tn=f(Q,!0);E(Q),E($t);var nn=d($t,2),$=f(nn),rn=f($),an=e=>{pe(e,{size:13,class:`text-red-400`})},on=e=>{ee(e,{size:13})};v(rn,e=>{j.isMuted||j.volume===0?e(an):e(on,-1)}),E($),E(nn),E(Y),E(Ue),E(i);var sn=d(i,2);let cn;var ln=f(sn),un=d(f(ln),2);E(ln);var dn=d(ln,2),fn=f(dn),pn=f(fn);e(pn,{size:13});var mn=d(pn,3),hn=f(mn,!0);E(mn),E(fn);var gn=d(fn,2),_n=d(f(gn),2),vn=f(_n);vn.value=vn.__value=`default`;var yn=d(vn);yn.value=yn.__value=`artist`;var bn=d(yn);bn.value=bn.__value=`album`;var xn=d(bn);xn.value=xn.__value=`year`;var Sn=d(xn);Sn.value=Sn.__value=`filename`;var Cn=d(Sn);Cn.value=Cn.__value=`genre`;var wn=d(Cn);wn.value=wn.__value=`season`,E(_n),E(gn),E(dn);var Tn=d(dn,2);Be(Tn,21,()=>p(B),_e,(e,t,n)=>{var i=it();let a;var s=f(i),c=f(s),ee=e=>{h(e,et())},te=e=>{var t=tt();t.textContent=n+1,h(e,t)};v(c,e=>{z[j.currentTrackIndex].id===p(t).id&&j.isPlaying?e(ee):e(te,-1)}),E(s);var ne=d(s,2),u=d(ne,2),re=f(u),ae=f(re);let oe;var m=f(ae,!0);E(ae);var se=d(ae,2),ce=e=>{var t=nt();Ie(f(t),{size:10}),C(),E(t),h(e,t)};v(se,e=>{j.fetchErrors[p(t).id]&&e(ce)}),E(re);var le=d(re,2),ue=f(le);E(le),E(u);var de=d(u,2),_=f(de),fe=e=>{var n=rt(),r=f(n);E(n),y(()=>D(r,`href`,p(t).attrib)),g(`click`,r,e=>e.stopPropagation()),h(e,n)};v(_,e=>{p(t).attrib&&e(fe)});var pe=d(_,2),me=f(pe),b=e=>{r(e,{size:12,class:`text-[#22c55e]`})},he=e=>{Ve(e,{size:12})};v(me,e=>{p(Rt)===p(t).id?e(b):e(he,-1)}),E(pe),E(de),E(i),y(()=>{a=O(i,1,`track-row svelte-1o4jdf5`,null,a,{active:z[j.currentTrackIndex].id===p(t).id,"kb-focused":p(H)===p(t).id,"fetch-error":j.fetchErrors[p(t).id]}),D(i,`data-track-id`,p(t).id),D(ne,`src`,j.fetchErrors[p(t).id]||!p(t).cover?ht:p(t).cover),D(ne,`alt`,p(t).album),oe=O(ae,1,`tr-title svelte-1o4jdf5`,null,oe,{"line-through":j.fetchErrors[p(t).id],"opacity-50":j.fetchErrors[p(t).id]}),o(m,p(t).title),o(ue,`${p(t).artist??``} · ${p(t).album??``} (${(p(t).year||``)??``})`)}),g(`click`,i,()=>Ht(p(t))),l(`error`,ne,gt),ie(ne),g(`click`,pe,e=>Bt(e,p(t))),h(e,i)}),E(Tn),E(sn),E(n),y((e,t)=>{a=O(i,1,`player-side svelte-1o4jdf5`,null,a,{"tracklist-open":p(F)}),te=O(c,1,`player-top-block transition-all duration-300 ease-in-out svelte-1o4jdf5`,null,te,{"opacity-0":p(F),"scale-95":p(F),"pointer-events-none":p(F)}),ye=O(S,1,`scroll-container svelte-1o4jdf5`,null,ye,{overflowing:p(Nt)>p(Mt)}),xe(S,`--scroll-dist: -${p(Nt)-p(Mt)}px`),Se=O(be,1,`track-title scroll-text svelte-1o4jdf5`,null,Se,{"animate-scroll":p(Nt)>p(Mt)}),o(we,p(V).title),Te=O(T,1,`scroll-container svelte-1o4jdf5`,null,Te,{overflowing:p(Ft)>p(Pt)}),xe(T,`--scroll-dist: -${p(Ft)-p(Pt)}px`),je=O(Ee,1,`track-artist scroll-text svelte-1o4jdf5`,null,je,{"animate-scroll":p(Ft)>p(Pt)}),o(Ne,p(V).artist),Pe=O(k,1,`scroll-container svelte-1o4jdf5`,null,Pe,{overflowing:p(Lt)>p(It)}),xe(k,`--scroll-dist: -${p(Lt)-p(It)}px`),ze=O(Re,1,`track-album scroll-text svelte-1o4jdf5`,null,ze,{"animate-scroll":p(Lt)>p(It)}),o(He,p(V).album),o(qe,e),xe(st,`width:${j.duration>0?j.currentTime/j.duration*100:0}%`),D(ct,`max`,j.duration||100),ve(ct,j.currentTime),o(ut,t),pt=O(ft,1,`ctrl ctrl-sm svelte-1o4jdf5`,null,pt,{"active-ctrl":j.isShuffled}),_t=O(M,1,`ctrl ctrl-play svelte-1o4jdf5`,null,_t,{"ctrl-error":j.fetchErrors[p(V).id]}),D(M,`aria-label`,j.isPlaying?`Pause`:`Play`),kt=O(Ot,1,`ctrl ctrl-sm svelte-1o4jdf5`,null,kt,{"active-ctrl":j.repeatMode>0}),qt=O(Kt,1,`dj-crossfader svelte-1o4jdf5`,null,qt,{"fader-flash":p(Zt),"fader-fried":p(G)>=10}),Jt=O(U,1,`fader-label left-label flex items-center gap-1 svelte-1o4jdf5`,null,Jt,{active:!j.isInstrumental}),K=O(W,1,`dj-fader-knob svelte-1o4jdf5`,null,K,{right:j.isInstrumental,"knob-jiggle":p(Xt),fried:p(G)>=10}),J=O(q,1,`fader-label right-label flex items-center gap-1 svelte-1o4jdf5`,null,J,{active:j.isInstrumental}),en=O(Z,1,`ctrl ctrl-xs svelte-1o4jdf5`,null,en,{"active-ctrl":p(I)}),O(Q,1,`w-[90px] h-[20px] flex items-center justify-center rounded text-[9px] font-bold transition-all font-mono uppercase tracking-wider select-none cursor-pointer
                      ${p(I)?`bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/25 active:scale-95`:`bg-transparent border border-white/5 text-white/20 hover:text-white/40 hover:border-white/10`}`,`svelte-1o4jdf5`),D(Q,`title`,p(I)?`Click to cycle presets`:`Click to enable visualizer`),o(tn,Ke[p(Ct)].name),cn=O(sn,1,`tracklist-side svelte-1o4jdf5`,null,cn,{"show-mobile":p(F)}),o(hn,z.length)},[()=>Gt(j.currentTime),()=>Gt(j.duration)]),g(`click`,_,e=>Bt(e,p(V))),ke(be,`clientWidth`,e=>b(Nt,e)),ke(S,`clientWidth`,e=>b(Mt,e)),ke(Ee,`clientWidth`,e=>b(Ft,e)),ke(T,`clientWidth`,e=>b(Pt,e)),ke(Re,`clientWidth`,e=>b(Lt,e)),ke(k,`clientWidth`,e=>b(It,e)),g(`input`,ct,e=>{j.currentTime=parseFloat(e.target.value)}),g(`change`,ct,e=>{j.play(parseFloat(e.target.value))}),g(`click`,ft,()=>j.isShuffled=!j.isShuffled),g(`click`,mt,()=>j.prevTrack()),g(`click`,M,()=>j.togglePlay()),g(`click`,Dt,()=>j.nextTrack()),g(`click`,Ot,()=>{j.repeatMode=(j.repeatMode+1)%3}),g(`click`,Kt,Wt),g(`click`,Z,()=>{b(I,!p(I))}),g(`click`,Q,()=>{p(I)?b(Ct,(p(Ct)+1)%Ke.length):b(I,!0)}),g(`click`,$,()=>{b(xt,!p(xt))}),g(`click`,un,()=>{b(F,!1)}),De(_n,()=>p(P),e=>b(P,e)),w(1,n,()=>A,()=>({duration:120,delay:120})),w(2,n,()=>A,()=>({duration:120})),h(t,n)},gn=e=>{var t=ot(),n=d(f(t),2),r=f(n);fe(r,{size:36});var i=d(r,6),a=d(f(i),2);se(f(a),{size:15}),C(),E(a),E(i),E(n),C(2),E(t),w(1,t,()=>A,()=>({duration:120,delay:120})),w(2,t,()=>A,()=>({duration:120})),h(e,t)},_n=e=>{var t=ct(),n=d(f(t),2),r=d(f(n),4);de(d(f(r)),{size:15}),E(r),E(n);var a=d(n,2);Be(a,20,()=>[{name:`Apple Music`,color:`#fc3c44`,icon:`🎵`},{name:`YouTube Music`,color:`#ff0000`,icon:`▶`},{name:`Amazon Music`,color:`#00a8e0`,icon:`♪`},{name:`Tidal`,color:`#00d4f5`,icon:`〰`}],_e,(e,t)=>{var n=st(),r=f(n),a=f(r,!0);E(r);var s=d(r),c=f(s,!0);E(s),i(d(s),{size:11}),E(n),y(()=>{xe(n,`--sc:${t.color??``}`),o(a,t.icon),o(c,t.name)}),h(e,n)}),E(a),C(2),E(t),w(1,t,()=>A,()=>({duration:120,delay:120})),w(2,t,()=>A,()=>({duration:120})),h(e,t)},vn=e=>{var t=lt();w(1,t,()=>A,()=>({duration:120,delay:120})),w(2,t,()=>A,()=>({duration:120})),h(e,t)},yn=e=>{var t=dt(),n=f(t),r=e=>{let t=ye(()=>p(yt));var n=Ee();S(je(n),()=>p(t),(e,t)=>{t(e,{get audioCore(){return j}})}),h(e,n)},i=e=>{h(e,ut())};v(n,e=>{p(yt)?e(r):e(i,-1)}),E(t),w(1,t,()=>A,()=>({duration:120,delay:120})),w(2,t,()=>A,()=>({duration:120})),h(e,t)};v(mn,e=>{p(N)===`songs`?e(hn):p(N)===`samples`?e(gn,1):p(N)===`playlists`?e(_n,2):p(N)===`radio`?e(vn,3):p(N)===`battle`&&e(yn,4)}),E(pn),C(2),E(an);var bn=d(an,2),xn=e=>{var t=mt(),n=f(t);Fe(n,e=>b(Tt,e),()=>p(Tt));var r=d(n,2),i=e=>{h(e,ft())};v(r,e=>{!j.isPlaying&&!p(Et)&&e(i)});var a=d(r,2),s=f(a);Be(s,21,()=>Ke,_e,(e,t,n)=>{var r=pt(),i=f(r,!0);E(r),y(()=>{O(r,1,`px-2 py-1 rounded text-[9px] font-bold transition-all uppercase tracking-wider font-mono
                ${p(Ct)===n?`bg-purple-600 text-white`:`text-white/40 hover:text-white/80`}`,`svelte-1o4jdf5`),o(i,p(t).name)}),g(`click`,r,()=>b(Ct,n,!0)),h(e,r)}),E(s),E(a),E(t),g(`click`,t,e=>{e.stopPropagation(),b(wt,!1)}),g(`click`,a,e=>e.stopPropagation()),h(e,t)};v(bn,e=>{p(I)&&p(wt)&&e(xn)}),Fe(d(bn,2),e=>b(W,e),()=>p(W)),E(rn),y(()=>on=O(an,1,`mp-container svelte-1o4jdf5`,null,on,{closing:_t(),"theme-inst":j.isInstrumental})),g(`click`,rn,function(...e){m.onClose?.apply(this,e)}),g(`click`,an,e=>e.stopPropagation()),g(`click`,ln,()=>{j.isPlaying||window.dispatchEvent(new CustomEvent(`open-info-panel`))}),g(`click`,dn,function(...e){m.onClose?.apply(this,e)}),g(`touchstart`,pn,Jt,void 0,!0),g(`touchend`,pn,Yt),h(n,rn),Ne()}m([`click`,`touchstart`,`touchend`,`input`,`change`]);export{ht as default};