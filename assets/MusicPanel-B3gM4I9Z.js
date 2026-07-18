const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/BattlePanel-DWH4vq0r.js","assets/vendor-1LxW4PuQ.js","assets/rolldown-runtime-CMxvf4Kt.js","assets/vendor-Dl9nCA7L.css","assets/BattlePanel-B1S5D9Lq.css"])))=>i.map(i=>d[i]);
import{$r as e,A as t,Ar as n,Br as r,C as i,Cr as a,Dr as o,Er as s,Et as c,Fr as l,Ft as u,H as d,Hr as f,Ht as p,Ir as m,It as h,J as g,Jn as ee,Jr as _,K as v,Kn as te,L as ne,Lr as y,P as re,Pn as ie,Pr as b,Qn as ae,Qr as oe,S as se,St as ce,Ur as le,Vr as x,Vt as ue,Wr as S,Wt as de,Y as fe,Yr as C,Zt as pe,ai as me,br as w,bt as he,cr as ge,ei as _e,fi as ve,fr as ye,g as be,gi as T,gr as xe,hi as E,hr as Se,ii as D,ir as Ce,j as we,jn as Te,jr as Ee,kr as O,lr as De,mi as k,pi as Oe,pr as A,pt as ke,ri as j,si as M,sn as Ae,sr as je,st as Me,ti as N,tn as Ne,vn as Pe,wr as Fe,xt as Ie,yr as Le,zt as Re}from"./vendor-1LxW4PuQ.js";import{t as ze}from"./index-CH4_Am7_.js";import{t as P}from"./AudioCore.svelte-eYBnN3Mc.js";import{t as Be}from"./DogsLogo-CSXh-tH2.js";import{t as Ve}from"./settingsManager.svelte-Cg-jF7vZ.js";import{t as He}from"./SwipeTabNav-0OHaZ1-q.js";var Ue=class{constructor(e,t){T(this,`canvas`,null),T(this,`gl`,null),T(this,`analyser`,null),T(this,`program`,null),T(this,`animationFrameId`,null),T(this,`startTime`,0),T(this,`vertexBuffer`,null),T(this,`audioTexture`,null),T(this,`uniforms`,{}),T(this,`frequencyBuffer`,null),this.canvas=e,this.analyser=t,this.frequencyBuffer=new Uint8Array(t?t.frequencyBinCount:128),this.gl=e.getContext(`webgl`)||e.getContext(`experimental-webgl`),this.gl||console.error(`WebGL not supported by this browser.`)}init(e){if(!this.gl)return;let t=this.gl;this.cleanupProgram();let n=this.compileShader(t.VERTEX_SHADER,`
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `),r=this.compileShader(t.FRAGMENT_SHADER,e);if(!n||!r)return;if(this.program=t.createProgram(),t.attachShader(this.program,n),t.attachShader(this.program,r),t.linkProgram(this.program),!t.getProgramParameter(this.program,t.LINK_STATUS)){console.error(`Shader program linking failed:`,t.getProgramInfoLog(this.program));return}t.useProgram(this.program);let i=new Float32Array([-1,-1,1,-1,-1,1,1,1]);this.vertexBuffer=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,this.vertexBuffer),t.bufferData(t.ARRAY_BUFFER,i,t.STATIC_DRAW);let a=t.getAttribLocation(this.program,`a_position`);t.enableVertexAttribArray(a),t.vertexAttribPointer(a,2,t.FLOAT,!1,0,0),this.audioTexture=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.audioTexture),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),this.uniforms={time:t.getUniformLocation(this.program,`u_time`),resolution:t.getUniformLocation(this.program,`u_resolution`),volume:t.getUniformLocation(this.program,`u_volume`),bass:t.getUniformLocation(this.program,`u_bass`),mid:t.getUniformLocation(this.program,`u_mid`),treble:t.getUniformLocation(this.program,`u_treble`),audioTexture:t.getUniformLocation(this.program,`u_audioTexture`)},this.startTime=performance.now(),this.resize()}setPreset(e){this.init(e)}compileShader(e,t){if(!this.gl)return null;let n=this.gl,r=n.createShader(e);return n.shaderSource(r,t),n.compileShader(r),n.getShaderParameter(r,n.COMPILE_STATUS)?r:(console.error(`Shader compilation error (${e===n.VERTEX_SHADER?`VERTEX`:`FRAGMENT`}):`,n.getShaderInfoLog(r)),n.deleteShader(r),null)}start(){this.stop();let e=()=>{this.renderFrame(),this.animationFrameId=requestAnimationFrame(e)};this.animationFrameId=requestAnimationFrame(e)}stop(){this.animationFrameId&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null)}resize(){if(!this.gl||!this.canvas)return;let e=this.gl,t=this.canvas.clientWidth,n=this.canvas.clientHeight;(this.canvas.width!==t||this.canvas.height!==n)&&(this.canvas.width=t,this.canvas.height=n,e.viewport(0,0,t,n))}renderFrame(){if(!this.gl||!this.program)return;let e=this.gl;this.resize(),e.useProgram(this.program),e.bindBuffer(e.ARRAY_BUFFER,this.vertexBuffer);let t=(performance.now()-this.startTime)/1e3,n=0,r=0,i=0,a=0;if(this.analyser){this.analyser.getByteFrequencyData(this.frequencyBuffer);let t=this.frequencyBuffer.length,o=0,s=0,c=0;for(let e=0;e<t;e++){let t=this.frequencyBuffer[e];n+=t,e<12?(r+=t,o++):e<64?(i+=t,s++):(a+=t,c++)}n=n/t/255,r=o>0?r/o/255:0,i=s>0?i/s/255:0,a=c>0?a/c/255:0,e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.audioTexture),e.texImage2D(e.TEXTURE_2D,0,e.LUMINANCE,t,1,0,e.LUMINANCE,e.UNSIGNED_BYTE,this.frequencyBuffer)}e.uniform1f(this.uniforms.time,t),e.uniform2f(this.uniforms.resolution,this.canvas.width,this.canvas.height),e.uniform1f(this.uniforms.volume,n),e.uniform1f(this.uniforms.bass,r),e.uniform1f(this.uniforms.mid,i),e.uniform1f(this.uniforms.treble,a),e.uniform1i(this.uniforms.audioTexture,0),e.drawArrays(e.TRIANGLE_STRIP,0,4)}cleanupProgram(){this.gl&&this.program&&(this.gl.deleteProgram(this.program),this.program=null)}destroy(){this.stop();let e=this.gl;e&&(this.cleanupProgram(),this.vertexBuffer&&(e.deleteBuffer(this.vertexBuffer),this.vertexBuffer=null),this.audioTexture&&(e.deleteTexture(this.audioTexture),this.audioTexture=null)),this.canvas=null,this.gl=null,this.analyser=null}},We=[{id:`kaleidosync`,name:`Kaleidosync`,fragmentShader:`
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
    `}],Ge={id:`no-signal`,name:`No Signal`,fragmentShader:`
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
  `},Ke=y(`<div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 animate-pulse svelte-1o4jdf5"><div class="bg-black/75 border border-red-500/30 px-3 py-1.5 rounded text-[10px] font-mono tracking-widest text-red-500 font-bold uppercase shadow-[0_0_15px_rgba(239,68,68,0.25)] select-none svelte-1o4jdf5">NO SIGNAL</div></div>`),qe=y(`<div class="visualizer-container cursor-pointer svelte-1o4jdf5"><canvas class="visualizer-canvas svelte-1o4jdf5"></canvas> <!> <div class="visualizer-hover-overlay svelte-1o4jdf5"><!></div></div>`),Je=y(`<div class="visualizer-container bg-[#050508]/40 border border-white/5 flex items-center justify-center svelte-1o4jdf5"><!></div>`),Ye=y(`<div class="vinyl-record-clicker cursor-pointer w-full h-full svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div><div class="groove g1 svelte-1o4jdf5"></div> <div class="groove g2 svelte-1o4jdf5"></div> <div class="groove g3 svelte-1o4jdf5"></div> <div class="groove g4 svelte-1o4jdf5"></div> <div class="record-label svelte-1o4jdf5"><img loading="lazy"/></div> <div class="spindle svelte-1o4jdf5"></div></div> <div></div></div>`),Xe=y(`<div class="cassette-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="cassette-tape svelte-1o4jdf5"><div class="cassette-label bg-gradient-to-r from-purple-800 to-pink-700 svelte-1o4jdf5"><span class="cassette-track-title svelte-1o4jdf5"> </span> <span class="cassette-brand svelte-1o4jdf5">WEAREDOGS AUDIO</span></div> <div class="cassette-window bg-zinc-950/80 svelte-1o4jdf5"><div></div> <div></div> <div></div> <div></div></div></div></div>`),Ze=y(`<div class="floppy-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="floppy-disk svelte-1o4jdf5"><div class="floppy-corner svelte-1o4jdf5"></div> <div class="floppy-write-protect svelte-1o4jdf5"></div> <div class="floppy-label bg-slate-100 text-slate-900 svelte-1o4jdf5"><div class="floppy-label-stripe bg-red-600 svelte-1o4jdf5"></div> <div class="floppy-label-stripe-blue bg-blue-600 svelte-1o4jdf5"></div> <div class="floppy-label-content svelte-1o4jdf5"><div class="floppy-song truncate font-mono svelte-1o4jdf5"> </div> <div class="floppy-artist truncate font-mono svelte-1o4jdf5"> </div></div></div> <div class="floppy-shutter-door bg-zinc-700 svelte-1o4jdf5"><div></div> <div class="floppy-shutter-opening bg-zinc-950 svelte-1o4jdf5"><div></div></div></div> <div></div></div></div>`),Qe=y(`<div></div>`),$e=y(`<div class="musicbox-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="music-box svelte-1o4jdf5"><div></div> <div class="music-box-interior border border-amber-900/40 svelte-1o4jdf5"><div class="music-box-gears svelte-1o4jdf5"><div></div> <div></div></div> <div class="music-box-drum-wrap svelte-1o4jdf5"><div><div class="music-box-pins svelte-1o4jdf5"><div class="pin pin-1 svelte-1o4jdf5"></div> <div class="pin pin-2 svelte-1o4jdf5"></div> <div class="pin pin-3 svelte-1o4jdf5"></div> <div class="pin pin-4 svelte-1o4jdf5"></div> <div class="pin pin-5 svelte-1o4jdf5"></div> <div class="pin pin-6 svelte-1o4jdf5"></div></div></div></div> <div class="music-box-comb svelte-1o4jdf5"></div></div></div></div>`),et=y(`<span></span>`),tt=y(`<div class="spin-ring svelte-1o4jdf5"></div>`),nt=y(`<div class="volume-popover svelte-1o4jdf5"><button class="ctrl ctrl-xs mr-2 border border-white/10 rounded-full p-1 hover:bg-white/10 svelte-1o4jdf5" aria-label="Mute"><!></button> <input type="range" class="vol-slider-pop svelte-1o4jdf5" min="0" max="1" step="0.01" aria-label="Volume"/> <span class="text-[10px] font-bold text-white/60 min-w-[28px] text-right font-mono select-none svelte-1o4jdf5"> </span></div>`),rt=y(`<div class="eq svelte-1o4jdf5"><div class="eq-b svelte-1o4jdf5"></div> <div class="eq-b svelte-1o4jdf5"></div> <div class="eq-b svelte-1o4jdf5"></div></div>`),it=y(`<span class="svelte-1o4jdf5"></span>`),at=y(`<span class="text-amber-400 flex items-center gap-1 text-[9px] font-bold tracking-wider uppercase bg-amber-500/10 px-1.5 py-0.5 rounded flex-shrink-0 svelte-1o4jdf5" title="Failed to fetch music source from remote database"><!> Error Fetching</span>`),ot=y(`<span class="inst-chip-link svelte-1o4jdf5"><a target="_blank" class="svelte-1o4jdf5">i</a></span>`),st=y(`<div><div class="tr-num svelte-1o4jdf5"><!></div> <img loading="lazy" class="tr-art svelte-1o4jdf5"/> <div class="tr-info svelte-1o4jdf5"><div class="flex items-center gap-1.5 min-w-0 svelte-1o4jdf5"><span> </span> <!></div> <span class="tr-meta svelte-1o4jdf5"> </span></div> <div class="flex items-center gap-2 flex-shrink-0 svelte-1o4jdf5"><!>  <button class="tr-share-btn svelte-1o4jdf5" title="Copy track link" aria-label="Share track"><!></button></div></div>`),ct=y(`<div class="songs-layout svelte-1o4jdf5"><div><div><div class="vinyl-wrapper relative overflow-hidden svelte-1o4jdf5"><!></div> <div class="track-info mt-2 svelte-1o4jdf5"><div class="flex items-center justify-center mb-1.5 svelte-1o4jdf5"><button class="player-share-btn svelte-1o4jdf5" title="Copy track link" aria-label="Share track"><!></button></div> <div><h2> </h2></div> <div><p> </p></div> <div><p> </p></div></div></div> <div class="player-controls-block svelte-1o4jdf5"><div class="progress-row svelte-1o4jdf5"><span class="ptime svelte-1o4jdf5"> </span> <div class="progress-wrap waveform-slider-wrap relative h-9 flex items-end svelte-1o4jdf5"><div class="waveform-bars flex items-end justify-between absolute inset-0 pointer-events-none px-1 h-full svelte-1o4jdf5"></div> <input type="range" class="seek-input absolute inset-0 opacity-0 cursor-pointer w-full h-full svelte-1o4jdf5" min="0" step="0.1" aria-label="Seek"/></div> <span class="ptime svelte-1o4jdf5"> </span></div> <div class="controls-row svelte-1o4jdf5"><button aria-label="Shuffle"><!></button> <button class="ctrl ctrl-md svelte-1o4jdf5" aria-label="Previous"><!></button> <button><!></button> <button class="ctrl ctrl-md svelte-1o4jdf5" aria-label="Next"><!></button> <button aria-label="Repeat"><!></button></div> <div class="w-full flex flex-col items-center gap-1.5 mt-2 px-1 svelte-1o4jdf5"><div><span><!> <span class="svelte-1o4jdf5">VOCAL</span></span> <div class="dj-fader-slot relative svelte-1o4jdf5"><div></div></div> <span><!> <span class="svelte-1o4jdf5">INST</span></span></div></div> <div class="relative flex justify-center items-center gap-3 mt-2 w-full svelte-1o4jdf5"><!> <div class="flex items-center gap-1.5 svelte-1o4jdf5"><button aria-label="Toggle Visualizer"><!></button> <button> </button></div> <div class="relative svelte-1o4jdf5"><button class="ctrl ctrl-xs vol-toggle-btn svelte-1o4jdf5" aria-label="Toggle volume slider"><!></button></div></div></div></div> <div><div class="mobile-close-bar hidden py-2 px-4 border-b border-white/5 flex items-center justify-between svelte-1o4jdf5"><span class="text-xs font-bold text-white/50 svelte-1o4jdf5">Track Library</span> <button class="px-3 py-1 bg-white/5 text-white/75 rounded-lg text-xs font-bold svelte-1o4jdf5">Back to player</button></div> <div class="tl-header flex justify-between items-center gap-3 svelte-1o4jdf5"><div class="flex items-center gap-2 svelte-1o4jdf5"><!><span class="svelte-1o4jdf5">TRACKS</span> <span class="tl-count svelte-1o4jdf5"> </span></div> <div class="flex items-center gap-1.5 ml-auto svelte-1o4jdf5"><span class="text-[9px] text-white/30 font-bold font-sans svelte-1o4jdf5">SORT BY:</span> <select class="bg-black/40 border border-white/10 rounded px-1.5 py-0.5 text-[10px] font-bold text-white/60 outline-none cursor-pointer hover:border-white/20 transition-all font-sans svelte-1o4jdf5"><option class="svelte-1o4jdf5">DEFAULT</option><option class="svelte-1o4jdf5">ARTIST</option><option class="svelte-1o4jdf5">ALBUM</option><option class="svelte-1o4jdf5">YEAR</option><option class="svelte-1o4jdf5">FILENAME</option><option class="svelte-1o4jdf5">GENRE</option><option class="svelte-1o4jdf5">SEASON</option></select></div></div> <div class="tracklist scroll-y svelte-1o4jdf5"></div></div></div>`),lt=y(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><div class="sec-head svelte-1o4jdf5"><h2 class="sec-title svelte-1o4jdf5">Samples</h2> <p class="sec-sub svelte-1o4jdf5">MP3 · MP4 · WAV · OGG · YouTube · Instagram · TikTok</p></div> <div class="drop-zone svelte-1o4jdf5"><!> <p class="drop-title svelte-1o4jdf5">Drop files or paste a link</p> <p class="drop-sub svelte-1o4jdf5">Supports all major audio, video, and streaming links</p> <div class="link-row svelte-1o4jdf5"><input type="url" class="link-input svelte-1o4jdf5" placeholder="https://youtube.com/watch?v=..." aria-label="Paste link"/> <button class="add-btn svelte-1o4jdf5"><!>Add</button></div></div> <div class="empty-state svelte-1o4jdf5"><div class="wip-tape svelte-1o4jdf5">COMING SOON</div> <p class="svelte-1o4jdf5">Your samples will appear here once added.</p></div></div>`),ut=y(`<div class="svc-chip svelte-1o4jdf5"><span class="svelte-1o4jdf5"> </span><span class="svelte-1o4jdf5"> </span><!></div>`),dt=y(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><div class="sec-head svelte-1o4jdf5"><h2 class="sec-title svelte-1o4jdf5">Playlists</h2> <p class="sec-sub svelte-1o4jdf5">Connect Spotify to sync playlists across all services
              automatically</p></div> <div class="spotify-card svelte-1o4jdf5"><div class="sp-icon svelte-1o4jdf5"><svg viewBox="0 0 24 24" fill="currentColor" width="30" height="30" class="svelte-1o4jdf5"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" class="svelte-1o4jdf5"></path></svg></div> <div class="sp-info svelte-1o4jdf5"><h3 class="svelte-1o4jdf5">Connect Spotify</h3> <p class="svelte-1o4jdf5">Import your playlists and sync across services</p></div> <button class="sp-btn svelte-1o4jdf5">Connect <!></button></div> <div class="svc-chips svelte-1o4jdf5"></div> <div class="empty-state mx-auto max-w-[380px] text-center svelte-1o4jdf5"><div class="wip-tape svelte-1o4jdf5">COMING SOON</div> <p class="svelte-1o4jdf5">Connect Spotify to see your playlists, automatically transcribed
              across all services.</p></div></div>`),ft=y(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><div class="sec-head svelte-1o4jdf5"><h2 class="sec-title svelte-1o4jdf5">Radio</h2> <p class="sec-sub svelte-1o4jdf5">Stream live broadcasts, dog shows, and podcast feeds</p></div> <div class="empty-state mx-auto max-w-[380px] text-center svelte-1o4jdf5"><div class="wip-tape svelte-1o4jdf5">COMING SOON</div> <p class="svelte-1o4jdf5">Live radio feeds will appear here once connected.</p></div></div>`),pt=y(`<div class="app-loading-spinner svelte-1o4jdf5" aria-label="Loading..."></div>`),mt=y(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><!></div>`),ht=y(`<div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 animate-pulse svelte-1o4jdf5"><div class="bg-black/75 border border-red-500/30 px-4 py-2 rounded text-[12px] font-mono tracking-widest text-red-500 font-bold uppercase shadow-[0_0_20px_rgba(239,68,68,0.3)] select-none svelte-1o4jdf5">NO SIGNAL</div></div>`),gt=y(`<button> </button>`),_t=y(`<div class="visualizer-container fullscreen cursor-pointer svelte-1o4jdf5"><canvas class="visualizer-canvas svelte-1o4jdf5"></canvas> <!> <div class="visualizer-overlay svelte-1o4jdf5"><div class="flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-lg p-1 border border-white/10 svelte-1o4jdf5"></div></div></div>`),vt=y(`<div class="mp-backdrop svelte-1o4jdf5"><div><header class="panel-header svelte-1o4jdf5"><div class="brand svelte-1o4jdf5"><button class="logo-btn svelte-1o4jdf5" aria-label="Open DOGS Info"><!></button> <h1 class="svelte-1o4jdf5"></h1></div> <button class="close-btn svelte-1o4jdf5" aria-label="Close panel"><!></button></header> <!> <div class="mp-body svelte-1o4jdf5"><!></div> <footer class="mp-footer svelte-1o4jdf5"><div class="mp-status svelte-1o4jdf5"><span class="mp-dot svelte-1o4jdf5"></span><span class="svelte-1o4jdf5">WE ARE DOGS</span></div> <span class="svelte-1o4jdf5">MUSIC</span></footer></div> <!> <canvas class="fader-fx-canvas pointer-events-none svelte-1o4jdf5"></canvas></div>`);function yt(r,y){Oe(y,!0);let T=[{id:`songs`,label:`Songs`,icon:ie},{id:`samples`,label:`Samples`,icon:pe},{id:`playlists`,label:`Playlists`,icon:Re},{id:`radio`,label:`Radio`,icon:ae},{id:`battle`,label:`Battle`,icon:ke}],yt=`/img/error_cover.png`;function bt(e){e.target.src.endsWith(yt)||(e.target.src=yt)}let xt=je(y,`isClosing`,3,!1),St=je(y,`initialTrackId`,3,null),F=D(`songs`),I=D(`default`),Ct=D(null);C(()=>{S(F)===`battle`&&!S(Ct)&&ze(()=>import(`./BattlePanel-DWH4vq0r.js`).then(e=>{j(Ct,e.default,!0)}),__vite__mapDeps([0,1,2,3,4]))});let L=D(!1),wt=D(!1),Tt=D(!1),Et=D(null),R=M(()=>P.isPlaying&&!xt()),z=D(!1),Dt=D(0),Ot=D(!1),kt=D(null),B=null,V=!1,At=D(!1),jt=M(()=>{let e=S(W)?.id||`default`,t=[],n=0;for(let t=0;t<e.length;t++)n=e.charCodeAt(t)+((n<<5)-n);for(let e=0;e<60;e++){let r=Math.abs(Math.sin(n+e))*80+20;t.push(r)}return t});C(()=>{window.innerWidth<=640&&S(z)&&S(Dt)===0&&S(L)&&j(L,!1)}),C(()=>{P.isPlaying&&j(At,!0)});let Mt=M(()=>!P.isPlaying&&!S(At)?Ge.fragmentShader:We[S(Dt)].fragmentShader);C(()=>{let e=P.analyser;return S(z)&&S(kt)&&!xt()&&(B=new Ue(S(kt),e),B.init(S(Mt)),B.start()),()=>{B&&(B.destroy(),B=null)}}),C(()=>{let e=S(Mt);B&&S(z)&&(B.setPreset(e),B.start())}),C(()=>{S(L)?!history.state?.tracklistOpen&&!V&&(history.pushState({tracklistOpen:!0},``),V=!0):V&&(history.back(),V=!1)}),n(()=>{V&&(history.back(),V=!1)});function Nt(e){!e.state?.tracklistOpen&&S(L)&&(j(L,!1),V=!1)}function Pt(e){S(Tt)&&S(Et)&&!S(Et).contains(e.target)&&!e.target.closest(`.vol-toggle-btn`)&&j(Tt,!1)}let H=[{id:`hollywood`,title:`HOLLYWOOD`,artist:`YG`,album:`THE GENTLEMEN'S CLUB`,cover:`https://data.wearedogs.net/img/covers/2026/yg.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/yg.jpg`,src:`https://data.wearedogs.net/music/2026/HOLLYWOOD.mp3`,instrumental:`https://data.wearedogs.net/music/2026/HOLLYWOOD-free.mp3`,dateAdded:`2026-06-24T03:00:00-05:00`,year:2026,genre:`Hip-Hop`,attrib:`https://the-gentlemens-club.com/`},{id:`chicago`,title:`Chicago`,artist:`Michael Jackson`,album:`Xscape`,cover:`https://data.wearedogs.net/img/covers/2026/mj.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/mj.jpg`,src:`https://data.wearedogs.net/music/2026/Chicago.mp3`,instrumental:`https://data.wearedogs.net/music/2026/Chicago-free.mp3`,dateAdded:`2026-06-24T03:00:00-05:00`,year:2014,genre:`Pop`},{id:`rain`,title:`Pourin Rain (feat. Skratch Bastid)`,artist:`Zeds Dead`,album:`Return to the Return (of the Spectrum of Intergalactic Happiness)`,cover:`https://data.wearedogs.net/img/covers/2026/zd.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/zd.jpg`,src:`https://data.wearedogs.net/music/2026/Pourin.mp3`,instrumental:``,dateAdded:`2026-07-07T018:12:00-05:00`,year:2026,genre:`Electronic`,attrib:`https://shop.zedsdead.net/`},{id:`denchai`,title:`Den Chai`,artist:`The Buddha-Bar Lounge`,album:`Den Chai`,cover:`https://data.wearedogs.net/img/covers/2026/buddha.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/buddha.png`,src:``,instrumental:`https://data.wearedogs.net/music/2026/DENCHAI.mp3`,dateAdded:`2026-07-07T22:34:00-05:00`,year:2008,genre:`Lounge`,attrib:`https://open.spotify.com/artist/0du3MpnxBOpQEie1IV3u9v?si=2UO722ntTE--Ck_Ji7Go7Q`},{id:`rainbow`,title:`Rainbow in the Dark`,artist:`Das Racist`,album:`Shut Up, Dude`,cover:`https://data.wearedogs.net/img/covers/2026/rainbow.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/rainbow.png`,src:`https://data.wearedogs.net/music/2026/rainbow.mp3`,instrumental:`https://data.wearedogs.net/music/2026/rainbow-free.mp3`,dateAdded:`2026-07-08T16:35:00-05:00`,year:2010,genre:`Hip-Hop`,attrib:`https://dasracist.bandcamp.com/album/shut-up-dude`},{id:`hipsong`,title:`Hip Song`,artist:`Toby Fox / Trevor Alan Gomes`,album:`Deltarune`,cover:`https://data.wearedogs.net/img/covers/2026/deltarune.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/deltarune.png`,src:`https://data.wearedogs.net/music/2026/shop.mp3`,instrumental:`https://data.wearedogs.net/music/2026/shop-free.mp3`,dateAdded:`2026-07-09T01:22:00-05:00`,year:2021,genre:`Video Game`,attrib:`https://deltarune.com/`},{id:`sleepless`,title:`Sleepless`,artist:`deadmau5`,album:`> album title goes here <`,cover:`https://data.wearedogs.net/img/covers/2026/sleepless.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/sleepless.png`,src:``,instrumental:`https://data.wearedogs.net/music/2026/sleepless.mp3`,dateAdded:`2026-07-12T04:22:00-05:00`,year:2026,genre:`Electronic`,attrib:`https://deadmau5.com/`},{id:`skitzo`,title:`Skitzo (feat. Young Thug)`,artist:`Travis Scott`,album:`UTOPIA`,cover:`https://data.wearedogs.net/img/covers/2026/utopia.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/utopia.png`,src:`https://data.wearedogs.net/music/2026/skitzo.mp3`,instrumental:`https://data.wearedogs.net/music/2026/skitzo-free.mp3`,dateAdded:`2026-07-16T01:56:00-05:00`,year:2023,genre:`Hip-Hop`,attrib:`https://shop.travisscott.com/`}];function Ft(e){return e.src?e.src.split(`/`).pop():``}function It(e){if(!e.dateAdded)return`Summer`;let t=new Date(e.dateAdded).getMonth();return t===11||t===0||t===1?`Winter`:t>=2&&t<=4?`Spring`:t>=5&&t<=7?`Summer`:`Fall`}let U=M(()=>{let e=[...H];return S(I)===`artist`?e.sort((e,t)=>e.artist.localeCompare(t.artist)):S(I)===`album`?e.sort((e,t)=>e.album.localeCompare(t.album)):S(I)===`year`?e.sort((e,t)=>(e.year||0)-(t.year||0)):S(I)===`filename`?e.sort((e,t)=>Ft(e).localeCompare(Ft(t))):S(I)===`genre`?e.sort((e,t)=>(e.genre||``).localeCompare(t.genre||``)):S(I)===`season`&&e.sort((e,t)=>It(e).localeCompare(It(t))),e}),W=M(()=>H[P.currentTrackIndex]),Lt=D(0),Rt=D(0),zt=D(0),Bt=D(0),Vt=D(0),Ht=D(0),Ut=D(null),Wt=null;function Gt(e,t){e.stopPropagation();let n=`${window.location.origin}/music/${t.id}`;navigator.clipboard.writeText(n).then(()=>{j(Ut,t.id,!0),Wt&&clearTimeout(Wt),Wt=setTimeout(()=>{j(Ut,null)},2e3)}).catch(e=>{console.error(`Failed to copy share link:`,e)})}n(()=>{Wt&&clearTimeout(Wt)}),Ee(()=>{if(P.init(H),St()){let e=H.findIndex(e=>e.id===St());e!==-1&&P.loadTrack(e,!0)}else if(!P.hasPickedRandomTrack){P.hasPickedRandomTrack=!0;let e=Math.floor(Math.random()*H.length);P.loadTrack(e,!1)}});let G=D(null);function Kt(){let e=document.querySelector(`.track-row[data-track-id="${S(G)}"]`);e&&e.scrollIntoView({block:`nearest`,behavior:`smooth`})}function qt(e){j(G,e.id,!0);let t=H.findIndex(t=>t.id===e.id);P.currentTrackIndex===t&&!P.fetchErrors[e.id]?P.togglePlay():P.loadTrack(t,!0)}function Jt(){window.innerWidth<=640?j(L,!0):j(z,!S(z))}function Yt(){let e=!P.isInstrumental;P.setCrossfade(e)||(me(q),S(nn)||(j(nn,!0),setTimeout(()=>{j(nn,!1)},300)),S(q)===5?($(),j(rn,!0),setTimeout(()=>{j(rn,!1)},150)):S(q)===10?$(35):S(q)>5&&S(q)<10?$(8):S(q)>10&&Math.random()<.4&&$(3))}function Xt(e){return!e||isNaN(e)?`0:00`:`${Math.floor(e/60)}:${Math.floor(e%60).toString().padStart(2,`0`)}`}function Zt(e){let t=document.activeElement;if(!(t&&(t.tagName===`INPUT`||t.tagName===`TEXTAREA`||t.isContentEditable))){if(e.shiftKey){if(e.key===`ArrowRight`){e.preventDefault(),j(F,T[(T.findIndex(e=>e.id===S(F))+1)%T.length].id,!0);return}else if(e.key===`ArrowLeft`){e.preventDefault(),j(F,T[(T.findIndex(e=>e.id===S(F))-1+T.length)%T.length].id,!0);return}}if(e.code===`Space`||e.key===` `)S(F)===`songs`&&(e.preventDefault(),P.togglePlay());else if(e.key===`ArrowDown`){if(S(F)===`songs`&&S(U).length>0){e.preventDefault();let t=S(U).findIndex(e=>e.id===S(G));if(t===-1){let e=H[P.currentTrackIndex];t=S(U).findIndex(t=>t.id===e?.id)}let n=(t+1)%S(U).length;j(G,S(U)[n].id,!0),Kt()}}else if(e.key===`ArrowUp`){if(S(F)===`songs`&&S(U).length>0){e.preventDefault();let t=S(U).findIndex(e=>e.id===S(G));if(t===-1){let e=H[P.currentTrackIndex];t=S(U).findIndex(t=>t.id===e?.id)}let n=(t-1+S(U).length)%S(U).length;j(G,S(U)[n].id,!0),Kt()}}else if(e.key===`Enter`&&S(F)===`songs`&&S(G)){e.preventDefault();let t=S(U).find(e=>e.id===S(G));t&&qt(t)}}}let Qt=0,$t=0;function en(e){if(e.target&&(e.target.tagName===`INPUT`||e.target.closest(`button`)||e.target.closest(`.ctrl`))){Qt=0,$t=0;return}Qt=e.touches[0].clientX,$t=e.touches[0].clientY}function tn(e){if(Qt===0||!e.changedTouches||e.changedTouches.length===0)return;let t=e.changedTouches[0].clientX-Qt,n=e.changedTouches[0].clientY-$t;if(Math.abs(t)<=Math.abs(n)||Math.abs(t)<=60)return;let r=T.findIndex(e=>e.id===S(F));r!==-1&&(t<0&&r<T.length-1?j(F,T[r+1].id,!0):t>0&&r>0&&j(F,T[r-1].id,!0))}let K=D(null),q=D(0),nn=D(!1),rn=D(!1),J,Y,X,Z=[],Q=[],an,on=D(!1);C(()=>(S(K)&&cn(),()=>{an&&cancelAnimationFrame(an),window.removeEventListener(`resize`,ln),X&&(X.dispose(),X=null),J=null,Y=null,Z=[],Q=[]})),C(()=>{if(P.currentTrackIndex,S(F),xt(),j(q,0),j(on,!1),J){for(let e of Z)J.remove(e.mesh);for(let e of Q)J.remove(e.mesh)}Z=[],Q=[]});function sn(){let e=document.querySelector(`.dj-fader-knob`);if(!e)return{x:window.innerWidth/2,y:window.innerHeight/2};let t=e.getBoundingClientRect();return{x:t.left+t.width/2,y:window.innerHeight-(t.top+t.height/2)}}function cn(){if(!S(K))return;let e=window.innerWidth,t=window.innerHeight;S(K).width=e,S(K).height=t,J=new ne,Y=new re(0,e,t,0,-1,1),X=new be({canvas:S(K),alpha:!0,antialias:!0}),X.setSize(e,t,!1),X.setPixelRatio(Math.min(window.devicePixelRatio,2)),window.addEventListener(`resize`,ln),un()}function ln(){if(!S(K)||!X||!Y)return;let e=window.innerWidth,t=window.innerHeight;S(K).width=e,S(K).height=t,X.setSize(e,t,!1),Y.right=e,Y.top=t,Y.updateProjectionMatrix()}function un(){if(an=requestAnimationFrame(un),!(!J||!Y||!X||!S(K))){if(S(q)>=10&&(j(on,!0),Math.random()<.22)){let e=sn();dn(e.x,e.y)}for(let e=Z.length-1;e>=0;e--){let t=Z[e];t.x+=t.vx,t.y+=t.vy,t.vy+=t.ay,t.life-=t.decay,t.mesh.position.set(t.x,t.y,0),t.mesh.material.opacity=t.life,t.life<=0&&(J.remove(t.mesh),t.mesh.geometry.dispose(),t.mesh.material.dispose(),Z.splice(e,1))}for(let e=Q.length-1;e>=0;e--){let t=Q[e];t.x+=t.vx,t.y+=t.vy,t.life-=t.decay;let n=t.startScale+(1-t.life)*88;t.mesh.scale.set(n,n,1),t.mesh.position.set(t.x,t.y,0),t.mesh.material.opacity=t.life*.16,t.life<=0&&(J.remove(t.mesh),t.mesh.geometry.dispose(),t.mesh.material.dispose(),Q.splice(e,1))}X.render(J,Y)}}function dn(e,n){if(!J)return;let r=new se(5,8),a=.85+Math.random()*.12,o=new t(r,new we({color:new i(a,a,a*1.01),transparent:!0,opacity:.06,blending:1}));o.position.set(e,n,0),J.add(o),Q.push({mesh:o,x:e,y:n,vx:(Math.random()-.5)*.55+Math.sin(Date.now()*.001)*.22,vy:Math.random()*.7+1.25,startScale:1,life:1,decay:6e-4+Math.random()*4e-4})}function $(e=25){if(!J||!S(K))return;let n=sn(),r=n.x,a=n.y;for(let n=0;n<e;n++){let e=new t(new se(1.3,4),new we({color:new i(Math.random()<.4?16711765:16755200),transparent:!0,opacity:1,blending:2}));e.position.set(r,a,0),J.add(e);let n=Math.random()*Math.PI*2,o=Math.random()*4+2;Z.push({mesh:e,x:r,y:a,vx:Math.cos(n)*o,vy:Math.sin(n)*o,ay:-.15,life:1,decay:.02+Math.random()*.02})}}var fn=vt();f(`keydown`,oe,Zt),f(`popstate`,oe,Nt),f(`click`,oe,Pt);var pn=e(fn);let mn;var hn=e(pn),gn=e(hn),_n=e(gn);Be(e(_n),{size:`panel`}),E(_n);var vn=N(_n,2);vn.textContent=`MUSIC`,E(gn);var yn=N(gn,2);Ce(e(yn),{size:20}),E(yn),E(hn);var bn=N(hn,2);He(bn,{get tabs(){return T},get activeTab(){return S(F)},set activeTab(e){j(F,e,!0)}});var xn=N(bn,2),Sn=e(xn),Cn=t=>{var n=ct(),r=e(n);let i;var te=e(r);let ne;var y=e(te),re=e(y),ie=t=>{var n=qe(),r=e(n);ge(r,e=>j(kt,e),()=>S(kt));var i=N(r,2),a=e=>{l(e,Ke())};O(i,e=>{!P.isPlaying&&!S(At)&&e(a)});var o=N(i,2);Ne(e(o),{size:16,class:`text-white/70`}),E(o),E(n),x(`click`,n,()=>{j(Ot,!0)}),l(t,n)},ae=t=>{var n=Je();Ne(e(n),{size:16,class:`text-white/20`}),E(n),l(t,n)},oe=t=>{var n=m(),r=_e(n),i=t=>{var n=Ye(),r=e(n);let i;var a=N(e(r),8),o=e(a);let s;E(a),k(2),E(r);var c=N(r,2);let u;E(n),_(()=>{i=w(r,1,`vinyl-record svelte-1o4jdf5`,null,i,{spinning:S(R)}),A(o,`src`,P.fetchErrors[S(W).id]||!S(W).cover?yt:S(W).cover),A(o,`alt`,S(W).album),s=w(o,1,`record-art svelte-1o4jdf5`,null,s,{loaded:S(wt)}),u=w(c,1,`tonearm svelte-1o4jdf5`,null,u,{playing:S(R)})}),x(`click`,n,Jt),f(`load`,o,()=>j(wt,!0)),f(`error`,o,bt),le(o),l(t,n)},a=t=>{let n=M(()=>P.duration>0?(1-P.currentTime/P.duration)*.45+.25:.48),r=M(()=>P.duration>0?P.currentTime/P.duration*.45+.25:.48);var i=Xe(),a=e(i),o=e(a),s=e(o),c=e(s,!0);E(s),k(2),E(o);var u=N(o,2),d=e(u);let f;var p=N(d,2);let m;var h=N(p,2);let g;var ee=N(h,2);let v;E(u),E(a),E(i),_(()=>{b(c,S(W).title),f=w(d,1,`spindle-left bg-zinc-900 svelte-1o4jdf5`,null,f,{spinning:S(R)}),m=w(p,1,`tape-roll-left bg-amber-950/70 svelte-1o4jdf5`,null,m,{spinning:S(R)}),Le(p,`width: ${S(n)*46}px; height: ${S(n)*46}px;`),g=w(h,1,`spindle-right bg-zinc-900 svelte-1o4jdf5`,null,g,{spinning:S(R)}),v=w(ee,1,`tape-roll-right bg-amber-950/70 svelte-1o4jdf5`,null,v,{spinning:S(R)}),Le(ee,`width: ${S(r)*46}px; height: ${S(r)*46}px;`)}),x(`click`,i,Jt),l(t,i)},c=t=>{var n=Ze(),r=e(n),i=N(e(r),4),a=N(e(i),4),o=e(a),s=e(o,!0);E(o);var c=N(o,2),u=e(c,!0);E(c),E(a),E(i);var d=N(i,2),f=e(d);let p;var m=N(f,2),h=e(m);let g;E(m),E(d);var ee=N(d,2);let v;E(r),E(n),_(()=>{b(s,S(W).title),b(u,S(W).artist||`WEAREDOGS`),p=w(f,1,`floppy-shutter-slider bg-zinc-400 svelte-1o4jdf5`,null,p,{open:S(R)}),g=w(h,1,`floppy-magnetic-disc bg-zinc-900 svelte-1o4jdf5`,null,g,{spinning:S(R)}),v=w(ee,1,`floppy-drive-led svelte-1o4jdf5`,null,v,{active:S(R)})}),x(`click`,n,Jt),l(t,n)},u=t=>{var n=$e(),r=e(n),i=e(r);let a;var c=N(i,2),u=e(c),d=e(u);let f;var p=N(d,2);let m;E(u);var h=N(u,2),g=e(h);let ee;E(h);var v=N(h,2);s(v,20,()=>Array(10),o,(e,t,n)=>{var r=Qe();let i;_(e=>i=w(r,1,`comb-tooth svelte-1o4jdf5`,null,i,e),[()=>({vibrating:S(R)&&n%3==Math.floor(P.currentTime*4)%3})]),l(e,r)}),E(v),E(c),E(r),E(n),_(()=>{a=w(i,1,`music-box-key svelte-1o4jdf5`,null,a,{spinning:S(R)}),f=w(d,1,`music-box-gear gear-1 svelte-1o4jdf5`,null,f,{spinning:S(R)}),m=w(p,1,`music-box-gear gear-2 svelte-1o4jdf5`,null,m,{spinning:S(R)}),ee=w(g,1,`music-box-drum bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 svelte-1o4jdf5`,null,ee,{spinning:S(R)})}),x(`click`,n,Jt),l(t,n)};O(r,e=>{Ve.musicDeckModel===`vinyl`?e(i):Ve.musicDeckModel===`cassette`?e(a,1):Ve.musicDeckModel===`floppy`?e(c,2):Ve.musicDeckModel===`musicbox`&&e(u,3)}),l(t,n)};O(re,e=>{S(z)&&!S(Ot)?e(ie):S(z)&&S(Ot)?e(ae,1):e(oe,-1)}),E(y);var se=N(y,2),ue=e(se),C=e(ue),me=e(C),ve=e=>{ee(e,{size:12,class:`text-[#22c55e]`})},be=e=>{c(e,{size:12})};O(me,e=>{S(Ut)===S(W).id?e(ve):e(be,-1)}),E(C),E(ue);var T=N(ue,2);let D;var Ce=e(T);let we;var Te=e(Ce,!0);E(Ce),E(T);var Ee=N(T,2);let Oe;var ke=e(Ee);let je;var Fe=e(ke,!0);E(ke),E(Ee);var Re=N(Ee,2);let ze;var Be=e(Re);let He;var Ue=e(Be,!0);E(Be),E(Re),E(se),E(te);var Ge=N(te,2),lt=e(Ge),ut=e(lt),dt=e(ut,!0);E(ut);var ft=N(ut,2),pt=e(ft);s(pt,21,()=>S(jt),o,(e,t,n)=>{let r=M(()=>P.duration>0?P.currentTime/P.duration:0),i=M(()=>n/60);var a=et();let o;_(()=>{o=w(a,1,`waveform-bar transition-colors duration-100 rounded-t svelte-1o4jdf5`,null,o,{active:S(i)<=S(r)}),Le(a,`height: ${S(t)??``}%; width: 3px;`)}),l(e,a)}),E(pt);var mt=N(pt,2);ye(mt),E(ft);var ht=N(ft,2),gt=e(ht,!0);E(ht),E(lt);var _t=N(lt,2),vt=e(_t);let xt;ce(e(vt),{size:15}),E(vt);var St=N(vt,2);Ie(e(St),{size:19}),E(St);var F=N(St,2);let Ct;var B=e(F),V=e=>{Me(e,{size:22})},Mt=e=>{l(e,tt())},Nt=e=>{de(e,{size:22,fill:`currentColor`})},Pt=e=>{p(e,{size:22,fill:`currentColor`})};O(B,e=>{P.fetchErrors[S(W).id]?e(V):P.isLoading?e(Mt,1):P.isPlaying?e(Nt,2):e(Pt,-1)}),E(F);var Ft=N(F,2);he(e(Ft),{size:19}),E(Ft);var It=N(Ft,2);let Wt;var Kt=e(It),Zt=e=>{h(e,{size:15})},Qt=e=>{u(e,{size:15})};O(Kt,e=>{P.repeatMode===2?e(Zt):e(Qt,-1)}),E(It),E(_t);var $t=N(_t,2),en=e($t);let tn;var K=e(en);let J;pe(e(K),{size:12}),k(2),E(K);var Y=N(K,2),X=e(Y);let Z;E(Y);var Q=N(Y,2);let an;Pe(e(Q),{size:12}),k(2),E(Q),E(en),E($t);var on=N($t,2),sn=e(on),cn=t=>{var n=nt(),r=e(n),i=e(r),a=e=>{g(e,{size:12,class:`text-red-400`})},o=e=>{fe(e,{size:12})};O(i,e=>{P.isMuted||P.volume===0?e(a):e(o,-1)}),E(r);var s=N(r,2);ye(s);var c=N(s,2),u=e(c);E(c),E(n),ge(n,e=>j(Et,e),()=>S(Et)),_(e=>{Se(s,P.volume),b(u,`${e??``}%`)},[()=>Math.round(P.volume*100)]),x(`click`,r,()=>P.toggleMute()),x(`input`,s,e=>P.setVolume(parseFloat(e.target.value))),l(t,n)};O(sn,e=>{S(Tt)&&e(cn)});var ln=N(sn,2),un=e(ln);let dn;v(e(un),{size:13}),E(un);var $=N(un,2),fn=e($,!0);E($),E(ln);var pn=N(ln,2),mn=e(pn),hn=e(mn),gn=e=>{g(e,{size:13,class:`text-red-400`})},_n=e=>{fe(e,{size:13})};O(hn,e=>{P.isMuted||P.volume===0?e(gn):e(_n,-1)}),E(mn),E(pn),E(on),E(Ge),E(r);var vn=N(r,2);let yn;var bn=e(vn),xn=N(e(bn),2);E(bn);var Sn=N(bn,2),Cn=e(Sn),wn=e(Cn);Ae(wn,{size:13});var Tn=N(wn,3),En=e(Tn,!0);E(Tn),E(Cn);var Dn=N(Cn,2),On=N(e(Dn),2),kn=e(On);kn.value=kn.__value=`default`;var An=N(kn);An.value=An.__value=`artist`;var jn=N(An);jn.value=jn.__value=`album`;var Mn=N(jn);Mn.value=Mn.__value=`year`;var Nn=N(Mn);Nn.value=Nn.__value=`filename`;var Pn=N(Nn);Pn.value=Pn.__value=`genre`;var Fn=N(Pn);Fn.value=Fn.__value=`season`,E(On),E(Dn),E(Sn);var In=N(Sn,2);s(In,21,()=>S(U),o,(t,n,r)=>{var i=st();let a;var o=e(i),s=e(o),u=e=>{l(e,rt())},d=e=>{var t=it();t.textContent=r+1,l(e,t)};O(s,e=>{H[P.currentTrackIndex].id===S(n).id&&P.isPlaying?e(u):e(d,-1)}),E(o);var p=N(o,2),m=N(p,2),h=e(m),g=e(h);let v;var te=e(g,!0);E(g);var ne=N(g,2),y=t=>{var n=at();Me(e(n),{size:10}),k(),E(n),l(t,n)};O(ne,e=>{P.fetchErrors[S(n).id]&&e(y)}),E(h);var re=N(h,2),ie=e(re);E(re),E(m);var ae=N(m,2),oe=e(ae),se=t=>{var r=ot(),i=e(r);E(r),_(()=>A(i,`href`,S(n).attrib)),x(`click`,i,e=>e.stopPropagation()),l(t,r)};O(oe,e=>{S(n).attrib&&e(se)});var ce=N(oe,2),ue=e(ce),de=e=>{ee(e,{size:12,class:`text-[#22c55e]`})},fe=e=>{c(e,{size:12})};O(ue,e=>{S(Ut)===S(n).id?e(de):e(fe,-1)}),E(ce),E(ae),E(i),_(()=>{a=w(i,1,`track-row svelte-1o4jdf5`,null,a,{active:H[P.currentTrackIndex].id===S(n).id,"kb-focused":S(G)===S(n).id,"fetch-error":P.fetchErrors[S(n).id]}),A(i,`data-track-id`,S(n).id),A(p,`src`,P.fetchErrors[S(n).id]||!S(n).cover?yt:S(n).cover),A(p,`alt`,S(n).album),v=w(g,1,`tr-title svelte-1o4jdf5`,null,v,{"line-through":P.fetchErrors[S(n).id],"opacity-50":P.fetchErrors[S(n).id]}),b(te,S(n).title),b(ie,`${S(n).artist??``} · ${S(n).album??``} (${(S(n).year||``)??``})`)}),x(`click`,i,()=>qt(S(n))),f(`error`,p,bt),le(p),x(`click`,ce,e=>Gt(e,S(n))),l(t,i)}),E(In),E(vn),E(n),_((e,t)=>{i=w(r,1,`player-side svelte-1o4jdf5`,null,i,{"tracklist-open":S(L)}),ne=w(te,1,`player-top-block transition-all duration-300 ease-in-out svelte-1o4jdf5`,null,ne,{"opacity-0":S(L),"scale-95":S(L),"pointer-events-none":S(L)}),D=w(T,1,`scroll-container svelte-1o4jdf5`,null,D,{overflowing:S(Rt)>S(Lt)}),Le(T,`--scroll-dist: -${S(Rt)-S(Lt)}px`),we=w(Ce,1,`track-title scroll-text svelte-1o4jdf5`,null,we,{"animate-scroll":S(Rt)>S(Lt)}),b(Te,S(W).title),Oe=w(Ee,1,`scroll-container svelte-1o4jdf5`,null,Oe,{overflowing:S(Bt)>S(zt)}),Le(Ee,`--scroll-dist: -${S(Bt)-S(zt)}px`),je=w(ke,1,`track-artist scroll-text svelte-1o4jdf5`,null,je,{"animate-scroll":S(Bt)>S(zt)}),b(Fe,S(W).artist),ze=w(Re,1,`scroll-container svelte-1o4jdf5`,null,ze,{overflowing:S(Ht)>S(Vt)}),Le(Re,`--scroll-dist: -${S(Ht)-S(Vt)}px`),He=w(Be,1,`track-album scroll-text svelte-1o4jdf5`,null,He,{"animate-scroll":S(Ht)>S(Vt)}),b(Ue,S(W).album),b(dt,e),A(mt,`max`,P.duration||100),Se(mt,P.currentTime),b(gt,t),xt=w(vt,1,`ctrl ctrl-sm svelte-1o4jdf5`,null,xt,{"active-ctrl":P.isShuffled}),Ct=w(F,1,`ctrl ctrl-play svelte-1o4jdf5`,null,Ct,{"ctrl-error":P.fetchErrors[S(W).id]}),A(F,`aria-label`,P.isPlaying?`Pause`:`Play`),Wt=w(It,1,`ctrl ctrl-sm svelte-1o4jdf5`,null,Wt,{"active-ctrl":P.repeatMode>0}),tn=w(en,1,`dj-crossfader svelte-1o4jdf5`,null,tn,{"fader-flash":S(rn),"fader-fried":S(q)>=10}),J=w(K,1,`fader-label left-label flex items-center gap-1 svelte-1o4jdf5`,null,J,{active:!P.isInstrumental}),Z=w(X,1,`dj-fader-knob svelte-1o4jdf5`,null,Z,{right:P.isInstrumental,"knob-jiggle":S(nn),fried:S(q)>=10}),an=w(Q,1,`fader-label right-label flex items-center gap-1 svelte-1o4jdf5`,null,an,{active:P.isInstrumental}),dn=w(un,1,`ctrl ctrl-xs svelte-1o4jdf5`,null,dn,{"active-ctrl":S(z)}),w($,1,`w-[90px] h-[20px] flex items-center justify-center rounded text-[9px] font-bold transition-all font-mono uppercase tracking-wider select-none cursor-pointer
                      ${S(z)?`bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/25 active:scale-95`:`bg-transparent border border-white/5 text-white/20 hover:text-white/40 hover:border-white/10`}`,`svelte-1o4jdf5`),A($,`title`,S(z)?`Click to cycle presets`:`Click to enable visualizer`),b(fn,We[S(Dt)].name),yn=w(vn,1,`tracklist-side svelte-1o4jdf5`,null,yn,{"show-mobile":S(L)}),b(En,H.length)},[()=>Xt(P.currentTime),()=>Xt(P.duration)]),x(`click`,C,e=>Gt(e,S(W))),De(Ce,`clientWidth`,e=>j(Rt,e)),De(T,`clientWidth`,e=>j(Lt,e)),De(ke,`clientWidth`,e=>j(Bt,e)),De(Ee,`clientWidth`,e=>j(zt,e)),De(Be,`clientWidth`,e=>j(Ht,e)),De(Re,`clientWidth`,e=>j(Vt,e)),x(`input`,mt,e=>{P.seek(parseFloat(e.target.value))}),x(`change`,mt,e=>{P.play(parseFloat(e.target.value))}),x(`click`,vt,()=>P.isShuffled=!P.isShuffled),x(`click`,St,()=>P.prevTrack()),x(`click`,F,()=>P.togglePlay()),x(`click`,Ft,()=>P.nextTrack()),x(`click`,It,()=>{P.repeatMode=(P.repeatMode+1)%3}),x(`click`,en,Yt),x(`click`,un,()=>{j(z,!S(z))}),x(`click`,$,()=>{S(z)?j(Dt,(S(Dt)+1)%We.length):j(z,!0)}),x(`click`,mn,()=>{j(Tt,!S(Tt))}),x(`click`,xn,()=>{j(L,!1)}),xe(On,()=>S(I),e=>j(I,e)),a(1,n,()=>d,()=>({duration:120,delay:120})),a(2,n,()=>d,()=>({duration:120})),l(t,n)},wn=t=>{var n=lt(),r=N(e(n),2),i=e(r);pe(i,{size:36});var o=N(i,6),s=N(e(o),2);ue(e(s),{size:15}),k(),E(s),E(o),E(r),k(2),E(n),a(1,n,()=>d,()=>({duration:120,delay:120})),a(2,n,()=>d,()=>({duration:120})),l(t,n)},Tn=t=>{var n=dt(),r=N(e(n),2),i=N(e(r),4);te(N(e(i)),{size:15}),E(i),E(r);var c=N(r,2);s(c,20,()=>[{name:`Apple Music`,color:`#fc3c44`,icon:`🎵`},{name:`YouTube Music`,color:`#ff0000`,icon:`▶`},{name:`Amazon Music`,color:`#00a8e0`,icon:`♪`},{name:`Tidal`,color:`#00d4f5`,icon:`〰`}],o,(t,n)=>{var r=ut(),i=e(r),a=e(i,!0);E(i);var o=N(i),s=e(o,!0);E(o),Te(N(o),{size:11}),E(r),_(()=>{Le(r,`--sc:${n.color??``}`),b(a,n.icon),b(s,n.name)}),l(t,r)}),E(c),k(2),E(n),a(1,n,()=>d,()=>({duration:120,delay:120})),a(2,n,()=>d,()=>({duration:120})),l(t,n)},En=e=>{var t=ft();a(1,t,()=>d,()=>({duration:120,delay:120})),a(2,t,()=>d,()=>({duration:120})),l(e,t)},Dn=t=>{var n=mt(),r=e(n),i=e=>{let t=M(()=>S(Ct));var n=m();Fe(_e(n),()=>S(t),(e,t)=>{t(e,{get audioCore(){return P}})}),l(e,n)},o=e=>{l(e,pt())};O(r,e=>{S(Ct)?e(i):e(o,-1)}),E(n),a(1,n,()=>d,()=>({duration:120,delay:120})),a(2,n,()=>d,()=>({duration:120})),l(t,n)};O(Sn,e=>{S(F)===`songs`?e(Cn):S(F)===`samples`?e(wn,1):S(F)===`playlists`?e(Tn,2):S(F)===`radio`?e(En,3):S(F)===`battle`&&e(Dn,4)}),E(xn),k(2),E(pn);var On=N(pn,2),kn=t=>{var n=_t(),r=e(n);ge(r,e=>j(kt,e),()=>S(kt));var i=N(r,2),a=e=>{l(e,ht())};O(i,e=>{!P.isPlaying&&!S(At)&&e(a)});var c=N(i,2),u=e(c);s(u,21,()=>We,o,(t,n,r)=>{var i=gt(),a=e(i,!0);E(i),_(()=>{w(i,1,`px-2 py-1 rounded text-[9px] font-bold transition-all uppercase tracking-wider font-mono
                ${S(Dt)===r?`bg-purple-600 text-white`:`text-white/40 hover:text-white/80`}`,`svelte-1o4jdf5`),b(a,S(n).name)}),x(`click`,i,()=>j(Dt,r,!0)),l(t,i)}),E(u),E(c),E(n),x(`click`,n,e=>{e.stopPropagation(),j(Ot,!1)}),x(`click`,c,e=>e.stopPropagation()),l(t,n)};O(On,e=>{S(z)&&S(Ot)&&e(kn)}),ge(N(On,2),e=>j(K,e),()=>S(K)),E(fn),_(()=>mn=w(pn,1,`mp-container svelte-1o4jdf5`,null,mn,{closing:xt(),"theme-inst":P.isInstrumental})),x(`click`,fn,function(...e){y.onClose?.apply(this,e)}),x(`click`,pn,e=>e.stopPropagation()),x(`click`,_n,()=>{P.isPlaying||window.dispatchEvent(new CustomEvent(`open-info-panel`))}),x(`click`,yn,function(...e){y.onClose?.apply(this,e)}),x(`touchstart`,xn,en,void 0,!0),x(`touchend`,xn,tn),l(r,fn),ve()}r([`click`,`touchstart`,`touchend`,`input`,`change`]);export{yt as default};