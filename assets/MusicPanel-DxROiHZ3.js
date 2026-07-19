const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/BattlePanel-C2MIBkM_.js","assets/vendor-D1cw9zJV.js","assets/rolldown-runtime-CMxvf4Kt.js","assets/vendor-Dl9nCA7L.css","assets/BattlePanel-B1S5D9Lq.css"])))=>i.map(i=>d[i]);
import{A as e,Ar as t,Br as n,C as r,Ci as i,Cr as a,Dr as o,Et as s,Fr as c,Ft as l,Gr as u,H as d,Ht as f,In as p,It as m,J as h,Jn as g,Jr as _,K as ee,Kr as v,L as te,Nn as ne,Nr as y,Or as re,P as ie,Pr as ae,Rr as b,S as oe,Si as x,St as se,Vr as S,Vt as ce,Wr as C,Wt as le,Xn as ue,Y as de,Zt as fe,_r as w,ai as T,bi as pe,br as me,bt as he,di as E,dr as ge,ei as D,er as _e,fi as O,fr as ve,g as ye,gr as be,hi as k,ii as xe,j as Se,jr as Ce,lr as we,oi as Te,or as Ee,pi as De,pt as Oe,qr as ke,si as A,sn as Ae,st as je,ti as j,tn as Me,wi as M,wr as N,xi as Ne,xt as Pe,yn as Fe,yr as Ie,zr as P,zt as Le}from"./vendor-D1cw9zJV.js";import{t as Re}from"./index-DIe9xeAA.js";import{t as F}from"./AudioCore.svelte-Bo6lrkJF.js";import{t as ze}from"./DogsLogo-CKA2fWvj.js";import{t as Be}from"./settingsManager.svelte-CKJfO2i8.js";import{t as Ve}from"./SwipeTabNav-2hUzqaIi.js";var He=class{constructor(e,t){M(this,`canvas`,null),M(this,`gl`,null),M(this,`analyser`,null),M(this,`program`,null),M(this,`animationFrameId`,null),M(this,`startTime`,0),M(this,`vertexBuffer`,null),M(this,`audioTexture`,null),M(this,`uniforms`,{}),M(this,`frequencyBuffer`,null),this.canvas=e,this.analyser=t,this.frequencyBuffer=new Uint8Array(t?t.frequencyBinCount:128),this.gl=e.getContext(`webgl`)||e.getContext(`experimental-webgl`),this.gl||console.error(`WebGL not supported by this browser.`)}init(e){if(!this.gl)return;let t=this.gl;this.cleanupProgram();let n=this.compileShader(t.VERTEX_SHADER,`
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `),r=this.compileShader(t.FRAGMENT_SHADER,e);if(!n||!r)return;if(this.program=t.createProgram(),t.attachShader(this.program,n),t.attachShader(this.program,r),t.linkProgram(this.program),!t.getProgramParameter(this.program,t.LINK_STATUS)){console.error(`Shader program linking failed:`,t.getProgramInfoLog(this.program));return}t.useProgram(this.program);let i=new Float32Array([-1,-1,1,-1,-1,1,1,1]);this.vertexBuffer=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,this.vertexBuffer),t.bufferData(t.ARRAY_BUFFER,i,t.STATIC_DRAW);let a=t.getAttribLocation(this.program,`a_position`);t.enableVertexAttribArray(a),t.vertexAttribPointer(a,2,t.FLOAT,!1,0,0),this.audioTexture=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.audioTexture),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),this.uniforms={time:t.getUniformLocation(this.program,`u_time`),resolution:t.getUniformLocation(this.program,`u_resolution`),volume:t.getUniformLocation(this.program,`u_volume`),bass:t.getUniformLocation(this.program,`u_bass`),mid:t.getUniformLocation(this.program,`u_mid`),treble:t.getUniformLocation(this.program,`u_treble`),audioTexture:t.getUniformLocation(this.program,`u_audioTexture`)},this.startTime=performance.now(),this.resize()}setPreset(e){this.init(e)}compileShader(e,t){if(!this.gl)return null;let n=this.gl,r=n.createShader(e);return n.shaderSource(r,t),n.compileShader(r),n.getShaderParameter(r,n.COMPILE_STATUS)?r:(console.error(`Shader compilation error (${e===n.VERTEX_SHADER?`VERTEX`:`FRAGMENT`}):`,n.getShaderInfoLog(r)),n.deleteShader(r),null)}start(){this.stop();let e=()=>{this.renderFrame(),this.animationFrameId=requestAnimationFrame(e)};this.animationFrameId=requestAnimationFrame(e)}stop(){this.animationFrameId&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null)}resize(){if(!this.gl||!this.canvas)return;let e=this.gl,t=this.canvas.clientWidth,n=this.canvas.clientHeight;(this.canvas.width!==t||this.canvas.height!==n)&&(this.canvas.width=t,this.canvas.height=n,e.viewport(0,0,t,n))}renderFrame(){if(!this.gl||!this.program)return;let e=this.gl;this.resize(),e.useProgram(this.program),e.bindBuffer(e.ARRAY_BUFFER,this.vertexBuffer);let t=(performance.now()-this.startTime)/1e3,n=0,r=0,i=0,a=0;if(this.analyser){this.analyser.getByteFrequencyData(this.frequencyBuffer);let t=this.frequencyBuffer.length,o=0,s=0,c=0;for(let e=0;e<t;e++){let t=this.frequencyBuffer[e];n+=t,e<12?(r+=t,o++):e<64?(i+=t,s++):(a+=t,c++)}n=n/t/255,r=o>0?r/o/255:0,i=s>0?i/s/255:0,a=c>0?a/c/255:0,e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.audioTexture),e.texImage2D(e.TEXTURE_2D,0,e.LUMINANCE,t,1,0,e.LUMINANCE,e.UNSIGNED_BYTE,this.frequencyBuffer)}e.uniform1f(this.uniforms.time,t),e.uniform2f(this.uniforms.resolution,this.canvas.width,this.canvas.height),e.uniform1f(this.uniforms.volume,n),e.uniform1f(this.uniforms.bass,r),e.uniform1f(this.uniforms.mid,i),e.uniform1f(this.uniforms.treble,a),e.uniform1i(this.uniforms.audioTexture,0),e.drawArrays(e.TRIANGLE_STRIP,0,4)}cleanupProgram(){this.gl&&this.program&&(this.gl.deleteProgram(this.program),this.program=null)}destroy(){this.stop();let e=this.gl;e&&(this.cleanupProgram(),this.vertexBuffer&&(e.deleteBuffer(this.vertexBuffer),this.vertexBuffer=null),this.audioTexture&&(e.deleteTexture(this.audioTexture),this.audioTexture=null)),this.canvas=null,this.gl=null,this.analyser=null}},Ue=[{id:`kaleidosync`,name:`Kaleidosync`,fragmentShader:`
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
    `}],We={id:`no-signal`,name:`No Signal`,fragmentShader:`
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
  `},Ge=S(`<div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 animate-pulse svelte-1o4jdf5"><div class="bg-black/75 border border-red-500/30 px-3 py-1.5 rounded text-[10px] font-mono tracking-widest text-red-500 font-bold uppercase shadow-[0_0_15px_rgba(239,68,68,0.25)] select-none svelte-1o4jdf5">NO SIGNAL</div></div>`),Ke=S(`<div class="visualizer-container cursor-pointer svelte-1o4jdf5"><canvas class="visualizer-canvas svelte-1o4jdf5"></canvas> <!> <div class="visualizer-hover-overlay svelte-1o4jdf5"><!></div></div>`),qe=S(`<div class="visualizer-container bg-[#050508]/40 border border-white/5 flex items-center justify-center svelte-1o4jdf5"><!></div>`),Je=S(`<div class="vinyl-record-clicker cursor-pointer w-full h-full svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div><div class="groove g1 svelte-1o4jdf5"></div> <div class="groove g2 svelte-1o4jdf5"></div> <div class="groove g3 svelte-1o4jdf5"></div> <div class="groove g4 svelte-1o4jdf5"></div> <div class="record-label svelte-1o4jdf5"><img loading="lazy"/></div> <div class="spindle svelte-1o4jdf5"></div></div> <div></div></div>`),Ye=S(`<div class="cassette-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="cassette-tape svelte-1o4jdf5"><div class="cassette-label bg-gradient-to-r from-purple-800 to-pink-700 svelte-1o4jdf5"><span class="cassette-track-title svelte-1o4jdf5"> </span> <span class="cassette-brand svelte-1o4jdf5">WEAREDOGS AUDIO</span></div> <div class="cassette-window bg-zinc-950/80 svelte-1o4jdf5"><div></div> <div></div> <div></div> <div></div></div></div></div>`),Xe=S(`<div class="floppy-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="floppy-disk svelte-1o4jdf5"><div class="floppy-corner svelte-1o4jdf5"></div> <div class="floppy-write-protect svelte-1o4jdf5"></div> <div class="floppy-label bg-slate-100 text-slate-900 svelte-1o4jdf5"><div class="floppy-label-stripe bg-red-600 svelte-1o4jdf5"></div> <div class="floppy-label-stripe-blue bg-blue-600 svelte-1o4jdf5"></div> <div class="floppy-label-content svelte-1o4jdf5"><div class="floppy-song truncate font-mono svelte-1o4jdf5"> </div> <div class="floppy-artist truncate font-mono svelte-1o4jdf5"> </div></div></div> <div class="floppy-shutter-door bg-zinc-700 svelte-1o4jdf5"><div></div> <div class="floppy-shutter-opening bg-zinc-950 svelte-1o4jdf5"><div></div></div></div> <div></div></div></div>`),Ze=S(`<div></div>`),Qe=S(`<div class="musicbox-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="music-box svelte-1o4jdf5"><div></div> <div class="music-box-interior border border-amber-900/40 svelte-1o4jdf5"><div class="music-box-gears svelte-1o4jdf5"><div></div> <div></div></div> <div class="music-box-drum-wrap svelte-1o4jdf5"><div><div class="music-box-pins svelte-1o4jdf5"><div class="pin pin-1 svelte-1o4jdf5"></div> <div class="pin pin-2 svelte-1o4jdf5"></div> <div class="pin pin-3 svelte-1o4jdf5"></div> <div class="pin pin-4 svelte-1o4jdf5"></div> <div class="pin pin-5 svelte-1o4jdf5"></div> <div class="pin pin-6 svelte-1o4jdf5"></div></div></div></div> <div class="music-box-comb svelte-1o4jdf5"></div></div></div></div>`),$e=S(`<span></span>`),et=S(`<div class="spin-ring svelte-1o4jdf5"></div>`),tt=S(`<div class="volume-popover svelte-1o4jdf5"><button class="ctrl ctrl-xs mr-2 border border-white/10 rounded-full p-1 hover:bg-white/10 svelte-1o4jdf5" aria-label="Mute"><!></button> <input type="range" class="vol-slider-pop svelte-1o4jdf5" min="0" max="1" step="0.01" aria-label="Volume"/> <span class="text-[10px] font-bold text-white/60 min-w-[28px] text-right font-mono select-none svelte-1o4jdf5"> </span></div>`),nt=S(`<div class="eq svelte-1o4jdf5"><div class="eq-b svelte-1o4jdf5"></div> <div class="eq-b svelte-1o4jdf5"></div> <div class="eq-b svelte-1o4jdf5"></div></div>`),rt=S(`<span class="svelte-1o4jdf5"></span>`),it=S(`<span class="text-amber-400 flex items-center gap-1 text-[9px] font-bold tracking-wider uppercase bg-amber-500/10 px-1.5 py-0.5 rounded flex-shrink-0 svelte-1o4jdf5" title="Failed to fetch music source from remote database"><!> Error Fetching</span>`),at=S(`<span class="inst-chip-link svelte-1o4jdf5"><a target="_blank" class="svelte-1o4jdf5">i</a></span>`),ot=S(`<div><div class="tr-num svelte-1o4jdf5"><!></div> <img loading="lazy" class="tr-art svelte-1o4jdf5"/> <div class="tr-info svelte-1o4jdf5"><div class="flex items-center gap-1.5 min-w-0 svelte-1o4jdf5"><span> </span> <!></div> <span class="tr-meta svelte-1o4jdf5"> </span></div> <div class="flex items-center gap-2 flex-shrink-0 svelte-1o4jdf5"><!>  <button class="tr-share-btn svelte-1o4jdf5" title="Copy track link" aria-label="Share track"><!></button></div></div>`),st=S(`<div class="songs-layout svelte-1o4jdf5"><div><div><div class="vinyl-wrapper relative overflow-hidden svelte-1o4jdf5"><!></div> <div class="track-info mt-2 svelte-1o4jdf5"><div class="flex items-center justify-center mb-1.5 svelte-1o4jdf5"><button class="player-share-btn svelte-1o4jdf5" title="Copy track link" aria-label="Share track"><!></button></div> <div><h2> </h2></div> <div><p> </p></div> <div><p> </p></div></div></div> <div class="player-controls-block svelte-1o4jdf5"><div class="progress-row svelte-1o4jdf5"><span class="ptime svelte-1o4jdf5"> </span> <div class="progress-wrap waveform-slider-wrap relative h-9 flex items-end svelte-1o4jdf5"><div class="waveform-bars flex items-end justify-between absolute inset-0 pointer-events-none px-1 h-full svelte-1o4jdf5"></div> <input type="range" class="seek-input absolute inset-0 opacity-0 cursor-pointer w-full h-full svelte-1o4jdf5" min="0" step="0.1" aria-label="Seek"/></div> <span class="ptime svelte-1o4jdf5"> </span></div> <div class="controls-row svelte-1o4jdf5"><button aria-label="Shuffle"><!></button> <button class="ctrl ctrl-md svelte-1o4jdf5" aria-label="Previous"><!></button> <button><!></button> <button class="ctrl ctrl-md svelte-1o4jdf5" aria-label="Next"><!></button> <button aria-label="Repeat"><!></button></div> <div class="w-full flex flex-col items-center gap-1.5 mt-2 px-1 svelte-1o4jdf5"><div><span><!> <span class="svelte-1o4jdf5">VOCAL</span></span> <div class="dj-fader-slot relative svelte-1o4jdf5"><div></div></div> <span><!> <span class="svelte-1o4jdf5">INST</span></span></div></div> <div class="relative flex justify-center items-center gap-3 mt-2 w-full svelte-1o4jdf5"><!> <div class="flex items-center gap-1.5 svelte-1o4jdf5"><button aria-label="Toggle Visualizer"><!></button> <button> </button></div> <div class="relative svelte-1o4jdf5"><button class="ctrl ctrl-xs vol-toggle-btn svelte-1o4jdf5" aria-label="Toggle volume slider"><!></button></div></div></div></div> <div><div class="mobile-close-bar hidden py-2 px-4 border-b border-white/5 flex items-center justify-between svelte-1o4jdf5"><span class="text-xs font-bold text-white/50 svelte-1o4jdf5">Track Library</span> <button class="px-3 py-1 bg-white/5 text-white/75 rounded-lg text-xs font-bold svelte-1o4jdf5">Back to player</button></div> <div class="tl-header flex justify-between items-center gap-3 svelte-1o4jdf5"><div class="flex items-center gap-2 svelte-1o4jdf5"><!><span class="svelte-1o4jdf5">TRACKS</span> <span class="tl-count svelte-1o4jdf5"> </span></div> <div class="flex items-center gap-1.5 ml-auto svelte-1o4jdf5"><span class="text-[9px] text-white/30 font-bold font-sans svelte-1o4jdf5">SORT BY:</span> <select class="bg-black/40 border border-white/10 rounded px-1.5 py-0.5 text-[10px] font-bold text-white/60 outline-none cursor-pointer hover:border-white/20 transition-all font-sans svelte-1o4jdf5"><option class="svelte-1o4jdf5">DEFAULT</option><option class="svelte-1o4jdf5">ARTIST</option><option class="svelte-1o4jdf5">ALBUM</option><option class="svelte-1o4jdf5">YEAR</option><option class="svelte-1o4jdf5">FILENAME</option><option class="svelte-1o4jdf5">GENRE</option><option class="svelte-1o4jdf5">SEASON</option></select></div></div> <div class="tracklist scroll-y svelte-1o4jdf5"></div></div></div>`),ct=S(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><div class="sec-head svelte-1o4jdf5"><h2 class="sec-title svelte-1o4jdf5">Samples</h2> <p class="sec-sub svelte-1o4jdf5">MP3 · MP4 · WAV · OGG · YouTube · Instagram · TikTok</p></div> <div class="drop-zone svelte-1o4jdf5"><!> <p class="drop-title svelte-1o4jdf5">Drop files or paste a link</p> <p class="drop-sub svelte-1o4jdf5">Supports all major audio, video, and streaming links</p> <div class="link-row svelte-1o4jdf5"><input type="url" class="link-input svelte-1o4jdf5" placeholder="https://youtube.com/watch?v=..." aria-label="Paste link"/> <button class="add-btn svelte-1o4jdf5"><!>Add</button></div></div> <div class="empty-state svelte-1o4jdf5"><div class="wip-tape svelte-1o4jdf5">COMING SOON</div> <p class="svelte-1o4jdf5">Your samples will appear here once added.</p></div></div>`),lt=S(`<div class="svc-chip svelte-1o4jdf5"><span class="svelte-1o4jdf5"> </span><span class="svelte-1o4jdf5"> </span><!></div>`),ut=S(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><div class="sec-head svelte-1o4jdf5"><h2 class="sec-title svelte-1o4jdf5">Playlists</h2> <p class="sec-sub svelte-1o4jdf5">Connect Spotify to sync playlists across all services
              automatically</p></div> <div class="spotify-card svelte-1o4jdf5"><div class="sp-icon svelte-1o4jdf5"><svg viewBox="0 0 24 24" fill="currentColor" width="30" height="30" class="svelte-1o4jdf5"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" class="svelte-1o4jdf5"></path></svg></div> <div class="sp-info svelte-1o4jdf5"><h3 class="svelte-1o4jdf5">Connect Spotify</h3> <p class="svelte-1o4jdf5">Import your playlists and sync across services</p></div> <button class="sp-btn svelte-1o4jdf5">Connect <!></button></div> <div class="svc-chips svelte-1o4jdf5"></div> <div class="empty-state mx-auto max-w-[380px] text-center svelte-1o4jdf5"><div class="wip-tape svelte-1o4jdf5">COMING SOON</div> <p class="svelte-1o4jdf5">Connect Spotify to see your playlists, automatically transcribed
              across all services.</p></div></div>`),dt=S(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><div class="sec-head svelte-1o4jdf5"><h2 class="sec-title svelte-1o4jdf5">Radio</h2> <p class="sec-sub svelte-1o4jdf5">Stream live broadcasts, dog shows, and podcast feeds</p></div> <div class="empty-state mx-auto max-w-[380px] text-center svelte-1o4jdf5"><div class="wip-tape svelte-1o4jdf5">COMING SOON</div> <p class="svelte-1o4jdf5">Live radio feeds will appear here once connected.</p></div></div>`),ft=S(`<div class="app-loading-spinner svelte-1o4jdf5" aria-label="Loading..."></div>`),pt=S(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><!></div>`),mt=S(`<div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 animate-pulse svelte-1o4jdf5"><div class="bg-black/75 border border-red-500/30 px-4 py-2 rounded text-[12px] font-mono tracking-widest text-red-500 font-bold uppercase shadow-[0_0_20px_rgba(239,68,68,0.3)] select-none svelte-1o4jdf5">NO SIGNAL</div></div>`),ht=S(`<button> </button>`),gt=S(`<div class="visualizer-container fullscreen cursor-pointer svelte-1o4jdf5"><canvas class="visualizer-canvas svelte-1o4jdf5"></canvas> <!> <div class="visualizer-overlay svelte-1o4jdf5"><div class="flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-lg p-1 border border-white/10 svelte-1o4jdf5"></div></div></div>`),_t=S(`<div class="mp-backdrop svelte-1o4jdf5"><div><header class="panel-header svelte-1o4jdf5"><div class="brand svelte-1o4jdf5"><button class="logo-btn svelte-1o4jdf5" aria-label="Open DOGS Info"><!></button> <h1 class="svelte-1o4jdf5"></h1></div> <button class="close-btn svelte-1o4jdf5" aria-label="Close panel"><!></button></header> <!> <div class="mp-body svelte-1o4jdf5"><!></div> <footer class="mp-footer svelte-1o4jdf5"><div class="mp-status svelte-1o4jdf5"><span class="mp-dot svelte-1o4jdf5"></span><span class="svelte-1o4jdf5">WE ARE DOGS</span></div> <span class="svelte-1o4jdf5">MUSIC</span></footer></div> <!> <canvas class="fader-fx-canvas pointer-events-none svelte-1o4jdf5"></canvas></div>`);function vt(S,C){Ne(C,!0);let M=[{id:`songs`,label:`Songs`,icon:p},{id:`samples`,label:`Samples`,icon:fe},{id:`playlists`,label:`Playlists`,icon:Le},{id:`radio`,label:`Radio`,icon:_e},{id:`battle`,label:`Battle`,icon:Oe}],vt=`/img/error_cover.png`;function yt(e){e.target.src.endsWith(vt)||(e.target.src=vt)}let bt=we(C,`isClosing`,3,!1),xt=we(C,`initialTrackId`,3,null),I=O(`songs`),L=O(`default`),St=O(null);j(()=>{_(I)===`battle`&&!_(St)&&Re(()=>import(`./BattlePanel-C2MIBkM_.js`).then(e=>{E(St,e.default,!0)}),__vite__mapDeps([0,1,2,3,4]))});let R=O(!1),Ct=O(!1),wt=O(!1),Tt=O(null),z=k(()=>F.isPlaying&&!bt()),B=O(!1),Et=O(0),Dt=O(!1),Ot=O(null),V=null,kt=!1,At=O(!1),jt=k(()=>{let e=_(W)?.id||`default`,t=[],n=0;for(let t=0;t<e.length;t++)n=e.charCodeAt(t)+((n<<5)-n);for(let e=0;e<60;e++){let r=Math.abs(Math.sin(n+e))*80+20;t.push(r)}return t});j(()=>{window.innerWidth<=640&&_(B)&&_(Et)===0&&_(R)&&E(R,!1)}),j(()=>{F.isPlaying&&E(At,!0)});let Mt=k(()=>!F.isPlaying&&!_(At)?We.fragmentShader:Ue[_(Et)].fragmentShader);j(()=>{let e=F.analyser;return _(B)&&_(Ot)&&!bt()&&(V=new He(_(Ot),e),V.init(_(Mt)),V.start()),()=>{V&&(V.destroy(),V=null)}}),j(()=>{let e=_(Mt);V&&_(B)&&(V.setPreset(e),V.start())}),j(()=>{_(R)?!history.state?.tracklistOpen&&!kt&&(history.pushState({tracklistOpen:!0},``),kt=!0):kt&&(history.back(),kt=!1)}),ae(()=>{kt&&(history.back(),kt=!1)});function Nt(e){!e.state?.tracklistOpen&&_(R)&&(E(R,!1),kt=!1)}function Pt(e){_(wt)&&_(Tt)&&!_(Tt).contains(e.target)&&!e.target.closest(`.vol-toggle-btn`)&&E(wt,!1)}let H=[{id:`hollywood`,title:`HOLLYWOOD`,artist:`YG`,album:`THE GENTLEMEN'S CLUB`,cover:`https://data.wearedogs.net/img/covers/2026/yg.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/yg.jpg`,src:`https://data.wearedogs.net/music/2026/HOLLYWOOD.mp3`,instrumental:`https://data.wearedogs.net/music/2026/HOLLYWOOD-free.mp3`,dateAdded:`2026-06-24T03:00:00-05:00`,year:2026,genre:`Hip-Hop`,attrib:`https://the-gentlemens-club.com/`},{id:`chicago`,title:`Chicago`,artist:`Michael Jackson`,album:`Xscape`,cover:`https://data.wearedogs.net/img/covers/2026/mj.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/mj.jpg`,src:`https://data.wearedogs.net/music/2026/Chicago.mp3`,instrumental:`https://data.wearedogs.net/music/2026/Chicago-free.mp3`,dateAdded:`2026-06-24T03:00:00-05:00`,year:2014,genre:`Pop`},{id:`rain`,title:`Pourin Rain (feat. Skratch Bastid)`,artist:`Zeds Dead`,album:`Return to the Return (of the Spectrum of Intergalactic Happiness)`,cover:`https://data.wearedogs.net/img/covers/2026/zd.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/zd.jpg`,src:`https://data.wearedogs.net/music/2026/Pourin.mp3`,instrumental:``,dateAdded:`2026-07-07T018:12:00-05:00`,year:2026,genre:`Electronic`,attrib:`https://shop.zedsdead.net/`},{id:`denchai`,title:`Den Chai`,artist:`The Buddha-Bar Lounge`,album:`Den Chai`,cover:`https://data.wearedogs.net/img/covers/2026/buddha.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/buddha.png`,src:``,instrumental:`https://data.wearedogs.net/music/2026/DENCHAI.mp3`,dateAdded:`2026-07-07T22:34:00-05:00`,year:2008,genre:`Lounge`,attrib:`https://open.spotify.com/artist/0du3MpnxBOpQEie1IV3u9v?si=2UO722ntTE--Ck_Ji7Go7Q`},{id:`rainbow`,title:`Rainbow in the Dark`,artist:`Das Racist`,album:`Shut Up, Dude`,cover:`https://data.wearedogs.net/img/covers/2026/rainbow.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/rainbow.png`,src:`https://data.wearedogs.net/music/2026/rainbow.mp3`,instrumental:`https://data.wearedogs.net/music/2026/rainbow-free.mp3`,dateAdded:`2026-07-08T16:35:00-05:00`,year:2010,genre:`Hip-Hop`,attrib:`https://dasracist.bandcamp.com/album/shut-up-dude`},{id:`hipsong`,title:`Hip Song`,artist:`Toby Fox / Trevor Alan Gomes`,album:`Deltarune`,cover:`https://data.wearedogs.net/img/covers/2026/deltarune.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/deltarune.png`,src:`https://data.wearedogs.net/music/2026/shop.mp3`,instrumental:`https://data.wearedogs.net/music/2026/shop-free.mp3`,dateAdded:`2026-07-09T01:22:00-05:00`,year:2021,genre:`Video Game`,attrib:`https://deltarune.com/`},{id:`sleepless`,title:`Sleepless`,artist:`deadmau5`,album:`> album title goes here <`,cover:`https://data.wearedogs.net/img/covers/2026/sleepless.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/sleepless.png`,src:``,instrumental:`https://data.wearedogs.net/music/2026/sleepless.mp3`,dateAdded:`2026-07-12T04:22:00-05:00`,year:2026,genre:`Electronic`,attrib:`https://deadmau5.com/`},{id:`skitzo`,title:`Skitzo (feat. Young Thug)`,artist:`Travis Scott`,album:`UTOPIA`,cover:`https://data.wearedogs.net/img/covers/2026/utopia.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/utopia.png`,src:`https://data.wearedogs.net/music/2026/skitzo.mp3`,instrumental:`https://data.wearedogs.net/music/2026/skitzo-free.mp3`,dateAdded:`2026-07-16T01:56:00-05:00`,year:2023,genre:`Hip-Hop`,attrib:`https://shop.travisscott.com/`}];function Ft(e){return e.src?e.src.split(`/`).pop():``}function It(e){if(!e.dateAdded)return`Summer`;let t=new Date(e.dateAdded).getMonth();return t===11||t===0||t===1?`Winter`:t>=2&&t<=4?`Spring`:t>=5&&t<=7?`Summer`:`Fall`}let U=k(()=>{let e=[...H];return _(L)===`artist`?e.sort((e,t)=>e.artist.localeCompare(t.artist)):_(L)===`album`?e.sort((e,t)=>e.album.localeCompare(t.album)):_(L)===`year`?e.sort((e,t)=>(e.year||0)-(t.year||0)):_(L)===`filename`?e.sort((e,t)=>Ft(e).localeCompare(Ft(t))):_(L)===`genre`?e.sort((e,t)=>(e.genre||``).localeCompare(t.genre||``)):_(L)===`season`&&e.sort((e,t)=>It(e).localeCompare(It(t))),e}),W=k(()=>H[F.currentTrackIndex]),Lt=O(0),Rt=O(0),zt=O(0),Bt=O(0),Vt=O(0),Ht=O(0),Ut=O(null),Wt=null;function Gt(e,t){e.stopPropagation();let n=`${window.location.origin}/music/${t.id}`;navigator.clipboard.writeText(n).then(()=>{E(Ut,t.id,!0),Wt&&clearTimeout(Wt),Wt=setTimeout(()=>{E(Ut,null)},2e3)}).catch(e=>{console.error(`Failed to copy share link:`,e)})}ae(()=>{Wt&&clearTimeout(Wt)}),c(()=>{if(F.init(H),xt()){let e=H.findIndex(e=>e.id===xt());e!==-1&&F.loadTrack(e,!0)}else if(!F.hasPickedRandomTrack){F.hasPickedRandomTrack=!0;let e=Math.floor(Math.random()*H.length);F.loadTrack(e,!1)}});let G=O(null);function Kt(){let e=document.querySelector(`.track-row[data-track-id="${_(G)}"]`);e&&e.scrollIntoView({block:`nearest`,behavior:`smooth`})}function qt(e){E(G,e.id,!0);let t=H.findIndex(t=>t.id===e.id);F.currentTrackIndex===t&&!F.fetchErrors[e.id]?F.togglePlay():F.loadTrack(t,!0)}function Jt(){window.innerWidth<=640?E(R,!0):E(B,!_(B))}function Yt(){let e=!F.isInstrumental;F.setCrossfade(e)||(De(q),_(nn)||(E(nn,!0),setTimeout(()=>{E(nn,!1)},300)),_(q)===5?($(),E(rn,!0),setTimeout(()=>{E(rn,!1)},150)):_(q)===10?$(35):_(q)>5&&_(q)<10?$(8):_(q)>10&&Math.random()<.4&&$(3))}function Xt(e){return!e||isNaN(e)?`0:00`:`${Math.floor(e/60)}:${Math.floor(e%60).toString().padStart(2,`0`)}`}function Zt(e){let t=document.activeElement;if(!(t&&(t.tagName===`INPUT`||t.tagName===`TEXTAREA`||t.isContentEditable))){if(e.shiftKey){if(e.key===`ArrowRight`){e.preventDefault(),E(I,M[(M.findIndex(e=>e.id===_(I))+1)%M.length].id,!0);return}else if(e.key===`ArrowLeft`){e.preventDefault(),E(I,M[(M.findIndex(e=>e.id===_(I))-1+M.length)%M.length].id,!0);return}}if(e.code===`Space`||e.key===` `)_(I)===`songs`&&(e.preventDefault(),F.togglePlay());else if(e.key===`ArrowDown`){if(_(I)===`songs`&&_(U).length>0){e.preventDefault();let t=_(U).findIndex(e=>e.id===_(G));if(t===-1){let e=H[F.currentTrackIndex];t=_(U).findIndex(t=>t.id===e?.id)}let n=(t+1)%_(U).length;E(G,_(U)[n].id,!0),Kt()}}else if(e.key===`ArrowUp`){if(_(I)===`songs`&&_(U).length>0){e.preventDefault();let t=_(U).findIndex(e=>e.id===_(G));if(t===-1){let e=H[F.currentTrackIndex];t=_(U).findIndex(t=>t.id===e?.id)}let n=(t-1+_(U).length)%_(U).length;E(G,_(U)[n].id,!0),Kt()}}else if(e.key===`Enter`&&_(I)===`songs`&&_(G)){e.preventDefault();let t=_(U).find(e=>e.id===_(G));t&&qt(t)}}}let Qt=0,$t=0;function en(e){if(e.target&&(e.target.tagName===`INPUT`||e.target.closest(`button`)||e.target.closest(`.ctrl`))){Qt=0,$t=0;return}Qt=e.touches[0].clientX,$t=e.touches[0].clientY}function tn(e){if(Qt===0||!e.changedTouches||e.changedTouches.length===0)return;let t=e.changedTouches[0].clientX-Qt,n=e.changedTouches[0].clientY-$t;if(Math.abs(t)<=Math.abs(n)||Math.abs(t)<=60)return;let r=M.findIndex(e=>e.id===_(I));r!==-1&&(t<0&&r<M.length-1?E(I,M[r+1].id,!0):t>0&&r>0&&E(I,M[r-1].id,!0))}let K=O(null),q=O(0),nn=O(!1),rn=O(!1),J,Y,X,Z=[],Q=[],an,on=O(!1);j(()=>(_(K)&&cn(),()=>{an&&cancelAnimationFrame(an),window.removeEventListener(`resize`,ln),X&&(X.dispose(),X=null),J=null,Y=null,Z=[],Q=[]})),j(()=>{if(F.currentTrackIndex,_(I),bt(),E(q,0),E(on,!1),J){for(let e of Z)J.remove(e.mesh);for(let e of Q)J.remove(e.mesh)}Z=[],Q=[]});function sn(){let e=document.querySelector(`.dj-fader-knob`);if(!e)return{x:window.innerWidth/2,y:window.innerHeight/2};let t=e.getBoundingClientRect();return{x:t.left+t.width/2,y:window.innerHeight-(t.top+t.height/2)}}function cn(){if(!_(K))return;let e=window.innerWidth,t=window.innerHeight;_(K).width=e,_(K).height=t,J=new te,Y=new ie(0,e,t,0,-1,1),X=new ye({canvas:_(K),alpha:!0,antialias:!0}),X.setSize(e,t,!1),X.setPixelRatio(Math.min(window.devicePixelRatio,2)),window.addEventListener(`resize`,ln),un()}function ln(){if(!_(K)||!X||!Y)return;let e=window.innerWidth,t=window.innerHeight;_(K).width=e,_(K).height=t,X.setSize(e,t,!1),Y.right=e,Y.top=t,Y.updateProjectionMatrix()}function un(){if(an=requestAnimationFrame(un),!(!J||!Y||!X||!_(K))){if(_(q)>=10&&(E(on,!0),Math.random()<.22)){let e=sn();dn(e.x,e.y)}for(let e=Z.length-1;e>=0;e--){let t=Z[e];t.x+=t.vx,t.y+=t.vy,t.vy+=t.ay,t.life-=t.decay,t.mesh.position.set(t.x,t.y,0),t.mesh.material.opacity=t.life,t.life<=0&&(J.remove(t.mesh),t.mesh.geometry.dispose(),t.mesh.material.dispose(),Z.splice(e,1))}for(let e=Q.length-1;e>=0;e--){let t=Q[e];t.x+=t.vx,t.y+=t.vy,t.life-=t.decay;let n=t.startScale+(1-t.life)*88;t.mesh.scale.set(n,n,1),t.mesh.position.set(t.x,t.y,0),t.mesh.material.opacity=t.life*.16,t.life<=0&&(J.remove(t.mesh),t.mesh.geometry.dispose(),t.mesh.material.dispose(),Q.splice(e,1))}X.render(J,Y)}}function dn(t,n){if(!J)return;let i=new oe(5,8),a=.85+Math.random()*.12,o=new e(i,new Se({color:new r(a,a,a*1.01),transparent:!0,opacity:.06,blending:1}));o.position.set(t,n,0),J.add(o),Q.push({mesh:o,x:t,y:n,vx:(Math.random()-.5)*.55+Math.sin(Date.now()*.001)*.22,vy:Math.random()*.7+1.25,startScale:1,life:1,decay:6e-4+Math.random()*4e-4})}function $(t=25){if(!J||!_(K))return;let n=sn(),i=n.x,a=n.y;for(let n=0;n<t;n++){let t=new e(new oe(1.3,4),new Se({color:new r(Math.random()<.4?16711765:16755200),transparent:!0,opacity:1,blending:2}));t.position.set(i,a,0),J.add(t);let n=Math.random()*Math.PI*2,o=Math.random()*4+2;Z.push({mesh:t,x:i,y:a,vx:Math.cos(n)*o,vy:Math.sin(n)*o,ay:-.15,life:1,decay:.02+Math.random()*.02})}}var fn=_t();v(`keydown`,xe,Zt),v(`popstate`,xe,Nt),v(`click`,xe,Pt);var pn=T(fn);let mn;var hn=T(pn),gn=T(hn),_n=T(gn);ze(T(_n),{size:`panel`}),i(_n);var vn=A(_n,2);vn.textContent=`MUSIC`,i(gn);var yn=A(gn,2);Ee(T(yn),{size:20}),i(yn),i(hn);var bn=A(hn,2);Ve(bn,{get tabs(){return M},get activeTab(){return _(I)},set activeTab(e){E(I,e,!0)}});var xn=A(bn,2),Sn=T(xn),Cn=e=>{var r=st(),c=T(r);let p;var g=T(c);let te;var ne=T(g),re=T(ne),ie=e=>{var t=Ke(),n=T(t);ge(n,e=>E(Ot,e),()=>_(Ot));var r=A(n,2),a=e=>{P(e,Ge())};y(r,e=>{!F.isPlaying&&!_(At)&&e(a)});var o=A(r,2);Me(T(o),{size:16,class:`text-white/70`}),i(o),i(t),u(`click`,t,()=>{E(Dt,!0)}),P(e,t)},ae=e=>{var t=qe();Me(T(t),{size:16,class:`text-white/20`}),i(t),P(e,t)},oe=e=>{var r=n(),o=Te(r),s=e=>{var t=Je(),n=T(t);let r;var a=A(T(n),8),o=T(a);let s;i(a),x(2),i(n);var c=A(n,2);let l;i(t),D(()=>{r=N(n,1,`vinyl-record svelte-1o4jdf5`,null,r,{spinning:_(z)}),w(o,`src`,F.fetchErrors[_(W).id]||!_(W).cover?vt:_(W).cover),w(o,`alt`,_(W).album),s=N(o,1,`record-art svelte-1o4jdf5`,null,s,{loaded:_(Ct)}),l=N(c,1,`tonearm svelte-1o4jdf5`,null,l,{playing:_(z)})}),u(`click`,t,Jt),v(`load`,o,()=>E(Ct,!0)),v(`error`,o,yt),ke(o),P(e,t)},c=e=>{let t=k(()=>F.duration>0?(1-F.currentTime/F.duration)*.45+.25:.48),n=k(()=>F.duration>0?F.currentTime/F.duration*.45+.25:.48);var r=Ye(),o=T(r),s=T(o),c=T(s),l=T(c,!0);i(c),x(2),i(s);var d=A(s,2),f=T(d);let p;var m=A(f,2);let h;var g=A(m,2);let ee;var v=A(g,2);let te;i(d),i(o),i(r),D(()=>{b(l,_(W).title),p=N(f,1,`spindle-left bg-zinc-900 svelte-1o4jdf5`,null,p,{spinning:_(z)}),h=N(m,1,`tape-roll-left bg-amber-950/70 svelte-1o4jdf5`,null,h,{spinning:_(z)}),a(m,`width: ${_(t)*46}px; height: ${_(t)*46}px;`),ee=N(g,1,`spindle-right bg-zinc-900 svelte-1o4jdf5`,null,ee,{spinning:_(z)}),te=N(v,1,`tape-roll-right bg-amber-950/70 svelte-1o4jdf5`,null,te,{spinning:_(z)}),a(v,`width: ${_(n)*46}px; height: ${_(n)*46}px;`)}),u(`click`,r,Jt),P(e,r)},l=e=>{var t=Xe(),n=T(t),r=A(T(n),4),a=A(T(r),4),o=T(a),s=T(o,!0);i(o);var c=A(o,2),l=T(c,!0);i(c),i(a),i(r);var d=A(r,2),f=T(d);let p;var m=A(f,2),h=T(m);let g;i(m),i(d);var ee=A(d,2);let v;i(n),i(t),D(()=>{b(s,_(W).title),b(l,_(W).artist||`WEAREDOGS`),p=N(f,1,`floppy-shutter-slider bg-zinc-400 svelte-1o4jdf5`,null,p,{open:_(z)}),g=N(h,1,`floppy-magnetic-disc bg-zinc-900 svelte-1o4jdf5`,null,g,{spinning:_(z)}),v=N(ee,1,`floppy-drive-led svelte-1o4jdf5`,null,v,{active:_(z)})}),u(`click`,t,Jt),P(e,t)},d=e=>{var n=Qe(),r=T(n),a=T(r);let o;var s=A(a,2),c=T(s),l=T(c);let d;var f=A(l,2);let p;i(c);var m=A(c,2),h=T(m);let g;i(m);var ee=A(m,2);t(ee,20,()=>Array(10),Ce,(e,t,n)=>{var r=Ze();let i;D(e=>i=N(r,1,`comb-tooth svelte-1o4jdf5`,null,i,e),[()=>({vibrating:_(z)&&n%3==Math.floor(F.currentTime*4)%3})]),P(e,r)}),i(ee),i(s),i(r),i(n),D(()=>{o=N(a,1,`music-box-key svelte-1o4jdf5`,null,o,{spinning:_(z)}),d=N(l,1,`music-box-gear gear-1 svelte-1o4jdf5`,null,d,{spinning:_(z)}),p=N(f,1,`music-box-gear gear-2 svelte-1o4jdf5`,null,p,{spinning:_(z)}),g=N(h,1,`music-box-drum bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 svelte-1o4jdf5`,null,g,{spinning:_(z)})}),u(`click`,n,Jt),P(e,n)};y(o,e=>{Be.musicDeckModel===`vinyl`?e(s):Be.musicDeckModel===`cassette`?e(c,1):Be.musicDeckModel===`floppy`?e(l,2):Be.musicDeckModel===`musicbox`&&e(d,3)}),P(e,r)};y(re,e=>{_(B)&&!_(Dt)?e(ie):_(B)&&_(Dt)?e(ae,1):e(oe,-1)}),i(ne);var S=A(ne,2),ce=T(S),C=T(ce),pe=T(C),_e=e=>{ue(e,{size:12,class:`text-[#22c55e]`})},O=e=>{s(e,{size:12})};y(pe,e=>{_(Ut)===_(W).id?e(_e):e(O,-1)}),i(C),i(ce);var ye=A(ce,2);let xe;var Se=T(ye);let we;var Ee=T(Se,!0);i(Se),i(ye);var De=A(ye,2);let Oe;var j=T(De);let M;var Ne=T(j,!0);i(j),i(De);var Le=A(De,2);let Re;var ze=T(Le);let Ve;var He=T(ze,!0);i(ze),i(Le),i(S),i(g);var We=A(g,2),ct=T(We),lt=T(ct),ut=T(lt,!0);i(lt);var dt=A(lt,2),ft=T(dt);t(ft,21,()=>_(jt),Ce,(e,t,n)=>{let r=k(()=>F.duration>0?F.currentTime/F.duration:0),i=k(()=>n/60);var o=$e();let s;D(()=>{s=N(o,1,`waveform-bar transition-colors duration-100 rounded-t svelte-1o4jdf5`,null,s,{active:_(i)<=_(r)}),a(o,`height: ${_(t)??``}%; width: 3px;`)}),P(e,o)}),i(ft);var pt=A(ft,2);be(pt),i(dt);var mt=A(dt,2),ht=T(mt,!0);i(mt),i(ct);var gt=A(ct,2),_t=T(gt);let bt;se(T(_t),{size:15}),i(_t);var xt=A(_t,2);Pe(T(xt),{size:19}),i(xt);var I=A(xt,2);let St;var V=T(I),kt=e=>{je(e,{size:22})},Mt=e=>{P(e,et())},Nt=e=>{le(e,{size:22,fill:`currentColor`})},Pt=e=>{f(e,{size:22,fill:`currentColor`})};y(V,e=>{F.fetchErrors[_(W).id]?e(kt):F.isLoading?e(Mt,1):F.isPlaying?e(Nt,2):e(Pt,-1)}),i(I);var Ft=A(I,2);he(T(Ft),{size:19}),i(Ft);var It=A(Ft,2);let Wt;var Kt=T(It),Zt=e=>{m(e,{size:15})},Qt=e=>{l(e,{size:15})};y(Kt,e=>{F.repeatMode===2?e(Zt):e(Qt,-1)}),i(It),i(gt);var $t=A(gt,2),en=T($t);let tn;var K=T(en);let J;fe(T(K),{size:12}),x(2),i(K);var Y=A(K,2),X=T(Y);let Z;i(Y);var Q=A(Y,2);let an;Fe(T(Q),{size:12}),x(2),i(Q),i(en),i($t);var on=A($t,2),sn=T(on),cn=e=>{var t=tt(),n=T(t),r=T(n),a=e=>{h(e,{size:12,class:`text-red-400`})},o=e=>{de(e,{size:12})};y(r,e=>{F.isMuted||F.volume===0?e(a):e(o,-1)}),i(n);var s=A(n,2);be(s);var c=A(s,2),l=T(c);i(c),i(t),ge(t,e=>E(Tt,e),()=>_(Tt)),D(e=>{Ie(s,F.volume),b(l,`${e??``}%`)},[()=>Math.round(F.volume*100)]),u(`click`,n,()=>F.toggleMute()),u(`input`,s,e=>F.setVolume(parseFloat(e.target.value))),P(e,t)};y(sn,e=>{_(wt)&&e(cn)});var ln=A(sn,2),un=T(ln);let dn;ee(T(un),{size:13}),i(un);var $=A(un,2),fn=T($,!0);i($),i(ln);var pn=A(ln,2),mn=T(pn),hn=T(mn),gn=e=>{h(e,{size:13,class:`text-red-400`})},_n=e=>{de(e,{size:13})};y(hn,e=>{F.isMuted||F.volume===0?e(gn):e(_n,-1)}),i(mn),i(pn),i(on),i(We),i(c);var vn=A(c,2);let yn;var bn=T(vn),xn=A(T(bn),2);i(bn);var Sn=A(bn,2),Cn=T(Sn),wn=T(Cn);Ae(wn,{size:13});var Tn=A(wn,3),En=T(Tn,!0);i(Tn),i(Cn);var Dn=A(Cn,2),On=A(T(Dn),2),kn=T(On);kn.value=kn.__value=`default`;var An=A(kn);An.value=An.__value=`artist`;var jn=A(An);jn.value=jn.__value=`album`;var Mn=A(jn);Mn.value=Mn.__value=`year`;var Nn=A(Mn);Nn.value=Nn.__value=`filename`;var Pn=A(Nn);Pn.value=Pn.__value=`genre`;var Fn=A(Pn);Fn.value=Fn.__value=`season`,i(On),i(Dn),i(Sn);var In=A(Sn,2);t(In,21,()=>_(U),Ce,(e,t,n)=>{var r=ot();let a;var o=T(r),c=T(o),l=e=>{P(e,nt())},d=e=>{var t=rt();t.textContent=n+1,P(e,t)};y(c,e=>{H[F.currentTrackIndex].id===_(t).id&&F.isPlaying?e(l):e(d,-1)}),i(o);var f=A(o,2),p=A(f,2),m=T(p),h=T(m);let g;var ee=T(h,!0);i(h);var te=A(h,2),ne=e=>{var t=it();je(T(t),{size:10}),x(),i(t),P(e,t)};y(te,e=>{F.fetchErrors[_(t).id]&&e(ne)}),i(m);var re=A(m,2),ie=T(re);i(re),i(p);var ae=A(p,2),oe=T(ae),se=e=>{var n=at(),r=T(n);i(n),D(()=>w(r,`href`,_(t).attrib)),u(`click`,r,e=>e.stopPropagation()),P(e,n)};y(oe,e=>{_(t).attrib&&e(se)});var S=A(oe,2),ce=T(S),C=e=>{ue(e,{size:12,class:`text-[#22c55e]`})},le=e=>{s(e,{size:12})};y(ce,e=>{_(Ut)===_(t).id?e(C):e(le,-1)}),i(S),i(ae),i(r),D(()=>{a=N(r,1,`track-row svelte-1o4jdf5`,null,a,{active:H[F.currentTrackIndex].id===_(t).id,"kb-focused":_(G)===_(t).id,"fetch-error":F.fetchErrors[_(t).id]}),w(r,`data-track-id`,_(t).id),w(f,`src`,F.fetchErrors[_(t).id]||!_(t).cover?vt:_(t).cover),w(f,`alt`,_(t).album),g=N(h,1,`tr-title svelte-1o4jdf5`,null,g,{"line-through":F.fetchErrors[_(t).id],"opacity-50":F.fetchErrors[_(t).id]}),b(ee,_(t).title),b(ie,`${_(t).artist??``} · ${_(t).album??``} (${(_(t).year||``)??``})`)}),u(`click`,r,()=>qt(_(t))),v(`error`,f,yt),ke(f),u(`click`,S,e=>Gt(e,_(t))),P(e,r)}),i(In),i(vn),i(r),D((e,t)=>{p=N(c,1,`player-side svelte-1o4jdf5`,null,p,{"tracklist-open":_(R)}),te=N(g,1,`player-top-block transition-all duration-300 ease-in-out svelte-1o4jdf5`,null,te,{"opacity-0":_(R),"scale-95":_(R),"pointer-events-none":_(R)}),xe=N(ye,1,`scroll-container svelte-1o4jdf5`,null,xe,{overflowing:_(Rt)>_(Lt)}),a(ye,`--scroll-dist: -${_(Rt)-_(Lt)}px`),we=N(Se,1,`track-title scroll-text svelte-1o4jdf5`,null,we,{"animate-scroll":_(Rt)>_(Lt)}),b(Ee,_(W).title),Oe=N(De,1,`scroll-container svelte-1o4jdf5`,null,Oe,{overflowing:_(Bt)>_(zt)}),a(De,`--scroll-dist: -${_(Bt)-_(zt)}px`),M=N(j,1,`track-artist scroll-text svelte-1o4jdf5`,null,M,{"animate-scroll":_(Bt)>_(zt)}),b(Ne,_(W).artist),Re=N(Le,1,`scroll-container svelte-1o4jdf5`,null,Re,{overflowing:_(Ht)>_(Vt)}),a(Le,`--scroll-dist: -${_(Ht)-_(Vt)}px`),Ve=N(ze,1,`track-album scroll-text svelte-1o4jdf5`,null,Ve,{"animate-scroll":_(Ht)>_(Vt)}),b(He,_(W).album),b(ut,e),w(pt,`max`,F.duration||100),Ie(pt,F.currentTime),b(ht,t),bt=N(_t,1,`ctrl ctrl-sm svelte-1o4jdf5`,null,bt,{"active-ctrl":F.isShuffled}),St=N(I,1,`ctrl ctrl-play svelte-1o4jdf5`,null,St,{"ctrl-error":F.fetchErrors[_(W).id]}),w(I,`aria-label`,F.isPlaying?`Pause`:`Play`),Wt=N(It,1,`ctrl ctrl-sm svelte-1o4jdf5`,null,Wt,{"active-ctrl":F.repeatMode>0}),tn=N(en,1,`dj-crossfader svelte-1o4jdf5`,null,tn,{"fader-flash":_(rn),"fader-fried":_(q)>=10}),J=N(K,1,`fader-label left-label flex items-center gap-1 svelte-1o4jdf5`,null,J,{active:!F.isInstrumental}),Z=N(X,1,`dj-fader-knob svelte-1o4jdf5`,null,Z,{right:F.isInstrumental,"knob-jiggle":_(nn),fried:_(q)>=10}),an=N(Q,1,`fader-label right-label flex items-center gap-1 svelte-1o4jdf5`,null,an,{active:F.isInstrumental}),dn=N(un,1,`ctrl ctrl-xs svelte-1o4jdf5`,null,dn,{"active-ctrl":_(B)}),N($,1,`w-[90px] h-[20px] flex items-center justify-center rounded text-[9px] font-bold transition-all font-mono uppercase tracking-wider select-none cursor-pointer
                      ${_(B)?`bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/25 active:scale-95`:`bg-transparent border border-white/5 text-white/20 hover:text-white/40 hover:border-white/10`}`,`svelte-1o4jdf5`),w($,`title`,_(B)?`Click to cycle presets`:`Click to enable visualizer`),b(fn,Ue[_(Et)].name),yn=N(vn,1,`tracklist-side svelte-1o4jdf5`,null,yn,{"show-mobile":_(R)}),b(En,H.length)},[()=>Xt(F.currentTime),()=>Xt(F.duration)]),u(`click`,C,e=>Gt(e,_(W))),ve(Se,`clientWidth`,e=>E(Rt,e)),ve(ye,`clientWidth`,e=>E(Lt,e)),ve(j,`clientWidth`,e=>E(Bt,e)),ve(De,`clientWidth`,e=>E(zt,e)),ve(ze,`clientWidth`,e=>E(Ht,e)),ve(Le,`clientWidth`,e=>E(Vt,e)),u(`input`,pt,e=>{F.seek(parseFloat(e.target.value))}),u(`change`,pt,e=>{F.play(parseFloat(e.target.value))}),u(`click`,_t,()=>F.isShuffled=!F.isShuffled),u(`click`,xt,()=>F.prevTrack()),u(`click`,I,()=>F.togglePlay()),u(`click`,Ft,()=>F.nextTrack()),u(`click`,It,()=>{F.repeatMode=(F.repeatMode+1)%3}),u(`click`,en,Yt),u(`click`,un,()=>{E(B,!_(B))}),u(`click`,$,()=>{_(B)?E(Et,(_(Et)+1)%Ue.length):E(B,!0)}),u(`click`,mn,()=>{E(wt,!_(wt))}),u(`click`,xn,()=>{E(R,!1)}),me(On,()=>_(L),e=>E(L,e)),o(1,r,()=>d,()=>({duration:120,delay:120})),o(2,r,()=>d,()=>({duration:120})),P(e,r)},wn=e=>{var t=ct(),n=A(T(t),2),r=T(n);fe(r,{size:36});var a=A(r,6),s=A(T(a),2);ce(T(s),{size:15}),x(),i(s),i(a),i(n),x(2),i(t),o(1,t,()=>d,()=>({duration:120,delay:120})),o(2,t,()=>d,()=>({duration:120})),P(e,t)},Tn=e=>{var n=ut(),r=A(T(n),2),s=A(T(r),4);g(A(T(s)),{size:15}),i(s),i(r);var c=A(r,2);t(c,20,()=>[{name:`Apple Music`,color:`#fc3c44`,icon:`🎵`},{name:`YouTube Music`,color:`#ff0000`,icon:`▶`},{name:`Amazon Music`,color:`#00a8e0`,icon:`♪`},{name:`Tidal`,color:`#00d4f5`,icon:`〰`}],Ce,(e,t)=>{var n=lt(),r=T(n),o=T(r,!0);i(r);var s=A(r),c=T(s,!0);i(s),ne(A(s),{size:11}),i(n),D(()=>{a(n,`--sc:${t.color??``}`),b(o,t.icon),b(c,t.name)}),P(e,n)}),i(c),x(2),i(n),o(1,n,()=>d,()=>({duration:120,delay:120})),o(2,n,()=>d,()=>({duration:120})),P(e,n)},En=e=>{var t=dt();o(1,t,()=>d,()=>({duration:120,delay:120})),o(2,t,()=>d,()=>({duration:120})),P(e,t)},Dn=e=>{var t=pt(),r=T(t),a=e=>{let t=k(()=>_(St));var r=n();re(Te(r),()=>_(t),(e,t)=>{t(e,{get audioCore(){return F}})}),P(e,r)},s=e=>{P(e,ft())};y(r,e=>{_(St)?e(a):e(s,-1)}),i(t),o(1,t,()=>d,()=>({duration:120,delay:120})),o(2,t,()=>d,()=>({duration:120})),P(e,t)};y(Sn,e=>{_(I)===`songs`?e(Cn):_(I)===`samples`?e(wn,1):_(I)===`playlists`?e(Tn,2):_(I)===`radio`?e(En,3):_(I)===`battle`&&e(Dn,4)}),i(xn),x(2),i(pn);var On=A(pn,2),kn=e=>{var n=gt(),r=T(n);ge(r,e=>E(Ot,e),()=>_(Ot));var a=A(r,2),o=e=>{P(e,mt())};y(a,e=>{!F.isPlaying&&!_(At)&&e(o)});var s=A(a,2),c=T(s);t(c,21,()=>Ue,Ce,(e,t,n)=>{var r=ht(),a=T(r,!0);i(r),D(()=>{N(r,1,`px-2 py-1 rounded text-[9px] font-bold transition-all uppercase tracking-wider font-mono
                ${_(Et)===n?`bg-purple-600 text-white`:`text-white/40 hover:text-white/80`}`,`svelte-1o4jdf5`),b(a,_(t).name)}),u(`click`,r,()=>E(Et,n,!0)),P(e,r)}),i(c),i(s),i(n),u(`click`,n,e=>{e.stopPropagation(),E(Dt,!1)}),u(`click`,s,e=>e.stopPropagation()),P(e,n)};y(On,e=>{_(B)&&_(Dt)&&e(kn)}),ge(A(On,2),e=>E(K,e),()=>_(K)),i(fn),D(()=>mn=N(pn,1,`mp-container svelte-1o4jdf5`,null,mn,{closing:bt(),"theme-inst":F.isInstrumental})),u(`click`,fn,function(...e){C.onClose?.apply(this,e)}),u(`click`,pn,e=>e.stopPropagation()),u(`click`,_n,()=>{F.isPlaying||window.dispatchEvent(new CustomEvent(`open-info-panel`))}),u(`click`,yn,function(...e){C.onClose?.apply(this,e)}),u(`touchstart`,xn,en,void 0,!0),u(`touchend`,xn,tn),P(S,fn),pe()}C([`click`,`touchstart`,`touchend`,`input`,`change`]);export{vt as default};