const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/BattlePanel-BdHm-dPb.js","assets/vendor-DfMWaZoH.js","assets/rolldown-runtime-CMxvf4Kt.js","assets/vendor-Dl9nCA7L.css","assets/BattlePanel-B1S5D9Lq.css"])))=>i.map(i=>d[i]);
import{$n as e,A as t,C as n,Er as r,Et as i,Fn as a,Ft as o,Gr as s,H as c,Hr as l,Ht as u,Ir as d,It as f,J as p,K as m,Kr as h,L as g,Lr as _,Mn as ee,Mr as v,Nr as te,Or as ne,P as re,Rr as ie,S as ae,Sr as y,St as oe,Tr as b,Ur as x,Vt as se,Wr as ce,Wt as le,Xr as S,Y as ue,Yn as de,Zr as C,Zt as fe,_i as w,_r as pe,ai as T,ar as me,bt as he,cr as ge,ei as _e,g as ve,gi as E,hi as ye,hr as D,j as be,jr as O,kr as xe,li as k,lr as Se,mi as Ce,mr as we,ni as Te,oi as A,pt as Ee,qn as De,ri as j,si as Oe,sn as ke,st as Ae,ti as M,tn as je,ur as Me,vi as N,vr as Ne,xr as Pe,xt as Fe,yn as Ie,zr as P,zt as Le}from"./vendor-DfMWaZoH.js";import{t as Re}from"./index-CIG1whpg.js";import{t as F}from"./AudioCore.svelte-BjfToHPE.js";import{t as ze}from"./DogsLogo-D4aFPQNd.js";import{t as Be}from"./settingsManager.svelte-Bp1LFZws.js";import{t as Ve}from"./SwipeTabNav-B75MIc5S.js";var He=class{constructor(e,t){N(this,`canvas`,null),N(this,`gl`,null),N(this,`analyser`,null),N(this,`program`,null),N(this,`animationFrameId`,null),N(this,`startTime`,0),N(this,`vertexBuffer`,null),N(this,`audioTexture`,null),N(this,`uniforms`,{}),N(this,`frequencyBuffer`,null),this.canvas=e,this.analyser=t,this.frequencyBuffer=new Uint8Array(t?t.frequencyBinCount:128),this.gl=e.getContext(`webgl`)||e.getContext(`experimental-webgl`),this.gl||console.error(`WebGL not supported by this browser.`)}init(e){if(!this.gl)return;let t=this.gl;this.cleanupProgram();let n=this.compileShader(t.VERTEX_SHADER,`
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
  `},Ge=P(`<div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 animate-pulse svelte-1o4jdf5"><div class="bg-black/75 border border-red-500/30 px-3 py-1.5 rounded text-[10px] font-mono tracking-widest text-red-500 font-bold uppercase shadow-[0_0_15px_rgba(239,68,68,0.25)] select-none svelte-1o4jdf5">NO SIGNAL</div></div>`),Ke=P(`<div class="visualizer-container cursor-pointer svelte-1o4jdf5"><canvas class="visualizer-canvas svelte-1o4jdf5"></canvas> <!> <div class="visualizer-hover-overlay svelte-1o4jdf5"><!></div></div>`),qe=P(`<div class="visualizer-container bg-[#050508]/40 border border-white/5 flex items-center justify-center svelte-1o4jdf5"><!></div>`),Je=P(`<div class="vinyl-record-clicker cursor-pointer w-full h-full svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div><div class="groove g1 svelte-1o4jdf5"></div> <div class="groove g2 svelte-1o4jdf5"></div> <div class="groove g3 svelte-1o4jdf5"></div> <div class="groove g4 svelte-1o4jdf5"></div> <div class="record-label svelte-1o4jdf5"><img loading="lazy"/></div> <div class="spindle svelte-1o4jdf5"></div></div> <div></div></div>`),Ye=P(`<div class="cassette-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="cassette-tape svelte-1o4jdf5"><div class="cassette-label bg-gradient-to-r from-purple-800 to-pink-700 svelte-1o4jdf5"><span class="cassette-track-title svelte-1o4jdf5"> </span> <span class="cassette-brand svelte-1o4jdf5">WEAREDOGS AUDIO</span></div> <div class="cassette-window bg-zinc-950/80 svelte-1o4jdf5"><div></div> <div></div> <div></div> <div></div></div></div></div>`),Xe=P(`<div class="floppy-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="floppy-disk svelte-1o4jdf5"><div class="floppy-corner svelte-1o4jdf5"></div> <div class="floppy-write-protect svelte-1o4jdf5"></div> <div class="floppy-label bg-slate-100 text-slate-900 svelte-1o4jdf5"><div class="floppy-label-stripe bg-red-600 svelte-1o4jdf5"></div> <div class="floppy-label-stripe-blue bg-blue-600 svelte-1o4jdf5"></div> <div class="floppy-label-content svelte-1o4jdf5"><div class="floppy-song truncate font-mono svelte-1o4jdf5"> </div> <div class="floppy-artist truncate font-mono svelte-1o4jdf5"> </div></div></div> <div class="floppy-shutter-door bg-zinc-700 svelte-1o4jdf5"><div></div> <div class="floppy-shutter-opening bg-zinc-950 svelte-1o4jdf5"><div></div></div></div> <div></div></div></div>`),Ze=P(`<div></div>`),Qe=P(`<div class="musicbox-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="music-box svelte-1o4jdf5"><div></div> <div class="music-box-interior border border-amber-900/40 svelte-1o4jdf5"><div class="music-box-gears svelte-1o4jdf5"><div></div> <div></div></div> <div class="music-box-drum-wrap svelte-1o4jdf5"><div><div class="music-box-pins svelte-1o4jdf5"><div class="pin pin-1 svelte-1o4jdf5"></div> <div class="pin pin-2 svelte-1o4jdf5"></div> <div class="pin pin-3 svelte-1o4jdf5"></div> <div class="pin pin-4 svelte-1o4jdf5"></div> <div class="pin pin-5 svelte-1o4jdf5"></div> <div class="pin pin-6 svelte-1o4jdf5"></div></div></div></div> <div class="music-box-comb svelte-1o4jdf5"></div></div></div></div>`),$e=P(`<span></span>`),et=P(`<div class="spin-ring svelte-1o4jdf5"></div>`),tt=P(`<div class="volume-popover svelte-1o4jdf5"><button class="ctrl ctrl-xs mr-2 border border-white/10 rounded-full p-1 hover:bg-white/10 svelte-1o4jdf5" aria-label="Mute"><!></button> <input type="range" class="vol-slider-pop svelte-1o4jdf5" min="0" max="1" step="0.01" aria-label="Volume"/> <span class="text-[10px] font-bold text-white/60 min-w-[28px] text-right font-mono select-none svelte-1o4jdf5"> </span></div>`),nt=P(`<div class="eq svelte-1o4jdf5"><div class="eq-b svelte-1o4jdf5"></div> <div class="eq-b svelte-1o4jdf5"></div> <div class="eq-b svelte-1o4jdf5"></div></div>`),rt=P(`<span class="svelte-1o4jdf5"></span>`),it=P(`<span class="text-amber-400 flex items-center gap-1 text-[9px] font-bold tracking-wider uppercase bg-amber-500/10 px-1.5 py-0.5 rounded flex-shrink-0 svelte-1o4jdf5" title="Failed to fetch music source from remote database"><!> Error Fetching</span>`),at=P(`<span class="inst-chip-link svelte-1o4jdf5"><a target="_blank" class="svelte-1o4jdf5">i</a></span>`),ot=P(`<div><div class="tr-num svelte-1o4jdf5"><!></div> <img loading="lazy" class="tr-art svelte-1o4jdf5"/> <div class="tr-info svelte-1o4jdf5"><div class="flex items-center gap-1.5 min-w-0 svelte-1o4jdf5"><span> </span> <!></div> <span class="tr-meta svelte-1o4jdf5"> </span></div> <div class="flex items-center gap-2 flex-shrink-0 svelte-1o4jdf5"><!>  <button class="tr-share-btn svelte-1o4jdf5" title="Copy track link" aria-label="Share track"><!></button></div></div>`),st=P(`<div class="songs-layout svelte-1o4jdf5"><div><div><div class="vinyl-wrapper relative overflow-hidden svelte-1o4jdf5"><!></div> <div class="track-info mt-2 svelte-1o4jdf5"><div class="flex items-center justify-center mb-1.5 svelte-1o4jdf5"><button class="player-share-btn svelte-1o4jdf5" title="Copy track link" aria-label="Share track"><!></button></div> <div><h2> </h2></div> <div><p> </p></div> <div><p> </p></div></div></div> <div class="player-controls-block svelte-1o4jdf5"><div class="progress-row svelte-1o4jdf5"><span class="ptime svelte-1o4jdf5"> </span> <div class="progress-wrap waveform-slider-wrap relative h-9 flex items-end svelte-1o4jdf5"><div class="waveform-bars flex items-end justify-between absolute inset-0 pointer-events-none px-1 h-full svelte-1o4jdf5"></div> <input type="range" class="seek-input absolute inset-0 opacity-0 cursor-pointer w-full h-full svelte-1o4jdf5" min="0" step="0.1" aria-label="Seek"/></div> <span class="ptime svelte-1o4jdf5"> </span></div> <div class="controls-row svelte-1o4jdf5"><button aria-label="Shuffle"><!></button> <button class="ctrl ctrl-md svelte-1o4jdf5" aria-label="Previous"><!></button> <button><!></button> <button class="ctrl ctrl-md svelte-1o4jdf5" aria-label="Next"><!></button> <button aria-label="Repeat"><!></button></div> <div class="w-full flex flex-col items-center gap-1.5 mt-2 px-1 svelte-1o4jdf5"><div><span><!> <span class="svelte-1o4jdf5">VOCAL</span></span> <div class="dj-fader-slot relative svelte-1o4jdf5"><div></div></div> <span><!> <span class="svelte-1o4jdf5">INST</span></span></div></div> <div class="relative flex justify-center items-center gap-3 mt-2 w-full svelte-1o4jdf5"><!> <div class="flex items-center gap-1.5 svelte-1o4jdf5"><button aria-label="Toggle Visualizer"><!></button> <button> </button></div> <div class="relative svelte-1o4jdf5"><button class="ctrl ctrl-xs vol-toggle-btn svelte-1o4jdf5" aria-label="Toggle volume slider"><!></button></div></div></div></div> <div><div class="mobile-close-bar hidden py-2 px-4 border-b border-white/5 flex items-center justify-between svelte-1o4jdf5"><span class="text-xs font-bold text-white/50 svelte-1o4jdf5">Track Library</span> <button class="px-3 py-1 bg-white/5 text-white/75 rounded-lg text-xs font-bold svelte-1o4jdf5">Back to player</button></div> <div class="tl-header flex justify-between items-center gap-3 svelte-1o4jdf5"><div class="flex items-center gap-2 svelte-1o4jdf5"><!><span class="svelte-1o4jdf5">TRACKS</span> <span class="tl-count svelte-1o4jdf5"> </span></div> <div class="flex items-center gap-1.5 ml-auto svelte-1o4jdf5"><span class="text-[9px] text-white/30 font-bold font-sans svelte-1o4jdf5">SORT BY:</span> <select class="bg-black/40 border border-white/10 rounded px-1.5 py-0.5 text-[10px] font-bold text-white/60 outline-none cursor-pointer hover:border-white/20 transition-all font-sans svelte-1o4jdf5"><option class="svelte-1o4jdf5">DEFAULT</option><option class="svelte-1o4jdf5">ARTIST</option><option class="svelte-1o4jdf5">ALBUM</option><option class="svelte-1o4jdf5">YEAR</option><option class="svelte-1o4jdf5">FILENAME</option><option class="svelte-1o4jdf5">GENRE</option><option class="svelte-1o4jdf5">SEASON</option></select></div></div> <div class="tracklist scroll-y svelte-1o4jdf5"></div></div></div>`),ct=P(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><div class="sec-head svelte-1o4jdf5"><h2 class="sec-title svelte-1o4jdf5">Samples</h2> <p class="sec-sub svelte-1o4jdf5">MP3 · MP4 · WAV · OGG · YouTube · Instagram · TikTok</p></div> <div class="drop-zone svelte-1o4jdf5"><!> <p class="drop-title svelte-1o4jdf5">Drop files or paste a link</p> <p class="drop-sub svelte-1o4jdf5">Supports all major audio, video, and streaming links</p> <div class="link-row svelte-1o4jdf5"><input type="url" class="link-input svelte-1o4jdf5" placeholder="https://youtube.com/watch?v=..." aria-label="Paste link"/> <button class="add-btn svelte-1o4jdf5"><!>Add</button></div></div> <div class="empty-state svelte-1o4jdf5"><div class="wip-tape svelte-1o4jdf5">COMING SOON</div> <p class="svelte-1o4jdf5">Your samples will appear here once added.</p></div></div>`),lt=P(`<div class="svc-chip svelte-1o4jdf5"><span class="svelte-1o4jdf5"> </span><span class="svelte-1o4jdf5"> </span><!></div>`),ut=P(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><div class="sec-head svelte-1o4jdf5"><h2 class="sec-title svelte-1o4jdf5">Playlists</h2> <p class="sec-sub svelte-1o4jdf5">Connect Spotify to sync playlists across all services
              automatically</p></div> <div class="spotify-card svelte-1o4jdf5"><div class="sp-icon svelte-1o4jdf5"><svg viewBox="0 0 24 24" fill="currentColor" width="30" height="30" class="svelte-1o4jdf5"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" class="svelte-1o4jdf5"></path></svg></div> <div class="sp-info svelte-1o4jdf5"><h3 class="svelte-1o4jdf5">Connect Spotify</h3> <p class="svelte-1o4jdf5">Import your playlists and sync across services</p></div> <button class="sp-btn svelte-1o4jdf5">Connect <!></button></div> <div class="svc-chips svelte-1o4jdf5"></div> <div class="empty-state mx-auto max-w-[380px] text-center svelte-1o4jdf5"><div class="wip-tape svelte-1o4jdf5">COMING SOON</div> <p class="svelte-1o4jdf5">Connect Spotify to see your playlists, automatically transcribed
              across all services.</p></div></div>`),dt=P(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><div class="sec-head svelte-1o4jdf5"><h2 class="sec-title svelte-1o4jdf5">Radio</h2> <p class="sec-sub svelte-1o4jdf5">Stream live broadcasts, dog shows, and podcast feeds</p></div> <div class="empty-state mx-auto max-w-[380px] text-center svelte-1o4jdf5"><div class="wip-tape svelte-1o4jdf5">COMING SOON</div> <p class="svelte-1o4jdf5">Live radio feeds will appear here once connected.</p></div></div>`),ft=P(`<div class="app-loading-spinner svelte-1o4jdf5" aria-label="Loading..."></div>`),pt=P(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><!></div>`),mt=P(`<div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 animate-pulse svelte-1o4jdf5"><div class="bg-black/75 border border-red-500/30 px-4 py-2 rounded text-[12px] font-mono tracking-widest text-red-500 font-bold uppercase shadow-[0_0_20px_rgba(239,68,68,0.3)] select-none svelte-1o4jdf5">NO SIGNAL</div></div>`),ht=P(`<button> </button>`),gt=P(`<div class="visualizer-container fullscreen cursor-pointer svelte-1o4jdf5"><canvas class="visualizer-canvas svelte-1o4jdf5"></canvas> <!> <div class="visualizer-overlay svelte-1o4jdf5"><div class="flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-lg p-1 border border-white/10 svelte-1o4jdf5"></div></div></div>`),_t=P(`<div class="mp-backdrop svelte-1o4jdf5"><div><header class="panel-header svelte-1o4jdf5"><div class="brand svelte-1o4jdf5"><button class="logo-btn svelte-1o4jdf5" aria-label="Open DOGS Info"><!></button> <h1 class="svelte-1o4jdf5"></h1></div> <button class="close-btn svelte-1o4jdf5" aria-label="Close panel"><!></button></header> <!> <div class="mp-body svelte-1o4jdf5"><!></div> <footer class="mp-footer svelte-1o4jdf5"><div class="mp-status svelte-1o4jdf5"><span class="mp-dot svelte-1o4jdf5"></span><span class="svelte-1o4jdf5">WE ARE DOGS</span></div> <span class="svelte-1o4jdf5">MUSIC</span></footer></div> <!> <canvas class="fader-fx-canvas pointer-events-none svelte-1o4jdf5"></canvas></div>`);function vt(l,N){ye(N,!0);let P=[{id:`songs`,label:`Songs`,icon:a},{id:`samples`,label:`Samples`,icon:fe},{id:`playlists`,label:`Playlists`,icon:Le},{id:`radio`,label:`Radio`,icon:e},{id:`battle`,label:`Battle`,icon:Ee}],vt=`/img/error_cover.png`;function yt(e){e.target.src.endsWith(vt)||(e.target.src=vt)}let bt=ge(N,`isClosing`,3,!1),xt=ge(N,`initialTrackId`,3,null),I=A(`songs`),St=A(`default`),Ct=A(null);C(()=>{h(I)===`battle`&&!h(Ct)&&Re(()=>import(`./BattlePanel-BdHm-dPb.js`).then(e=>{T(Ct,e.default,!0)}),__vite__mapDeps([0,1,2,3,4]))});let L=A(!1),wt=A(!1),Tt=A(!1),Et=A(null),R=k(()=>F.isPlaying&&!bt()),z=A(!1),Dt=A(0),Ot=A(!1),kt=A(null),B=null,V=!1,At=A(!1),jt=k(()=>{let e=h(W)?.id||`default`,t=[],n=0;for(let t=0;t<e.length;t++)n=e.charCodeAt(t)+((n<<5)-n);for(let e=0;e<60;e++){let r=Math.abs(Math.sin(n+e))*80+20;t.push(r)}return t});C(()=>{window.innerWidth<=640&&h(z)&&h(Dt)===0&&h(L)&&T(L,!1)}),C(()=>{F.isPlaying&&T(At,!0)});let Mt=k(()=>!F.isPlaying&&!h(At)?We.fragmentShader:Ue[h(Dt)].fragmentShader);C(()=>{let e=F.analyser;return h(z)&&h(kt)&&!bt()&&(B=new He(h(kt),e),B.init(h(Mt)),B.start()),()=>{B&&(B.destroy(),B=null)}}),C(()=>{let e=h(Mt);B&&h(z)&&(B.setPreset(e),B.start())}),C(()=>{h(L)?!history.state?.tracklistOpen&&!V&&(history.pushState({tracklistOpen:!0},``),V=!0):V&&(history.back(),V=!1)}),v(()=>{V&&(history.back(),V=!1)});function Nt(e){!e.state?.tracklistOpen&&h(L)&&(T(L,!1),V=!1)}function Pt(e){h(Tt)&&h(Et)&&!h(Et).contains(e.target)&&!e.target.closest(`.vol-toggle-btn`)&&T(Tt,!1)}let H=[{id:`hollywood`,title:`HOLLYWOOD`,artist:`YG`,album:`THE GENTLEMEN'S CLUB`,cover:`https://data.wearedogs.net/img/covers/2026/yg.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/yg.jpg`,src:`https://data.wearedogs.net/music/2026/HOLLYWOOD.mp3`,instrumental:`https://data.wearedogs.net/music/2026/HOLLYWOOD-free.mp3`,dateAdded:`2026-06-24T03:00:00-05:00`,year:2026,genre:`Hip-Hop`,attrib:`https://the-gentlemens-club.com/`},{id:`chicago`,title:`Chicago`,artist:`Michael Jackson`,album:`Xscape`,cover:`https://data.wearedogs.net/img/covers/2026/mj.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/mj.jpg`,src:`https://data.wearedogs.net/music/2026/Chicago.mp3`,instrumental:`https://data.wearedogs.net/music/2026/Chicago-free.mp3`,dateAdded:`2026-06-24T03:00:00-05:00`,year:2014,genre:`Pop`},{id:`rain`,title:`Pourin Rain (feat. Skratch Bastid)`,artist:`Zeds Dead`,album:`Return to the Return (of the Spectrum of Intergalactic Happiness)`,cover:`https://data.wearedogs.net/img/covers/2026/zd.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/zd.jpg`,src:`https://data.wearedogs.net/music/2026/Pourin.mp3`,instrumental:``,dateAdded:`2026-07-07T018:12:00-05:00`,year:2026,genre:`Electronic`,attrib:`https://shop.zedsdead.net/`},{id:`denchai`,title:`Den Chai`,artist:`The Buddha-Bar Lounge`,album:`Den Chai`,cover:`https://data.wearedogs.net/img/covers/2026/buddha.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/buddha.png`,src:``,instrumental:`https://data.wearedogs.net/music/2026/DENCHAI.mp3`,dateAdded:`2026-07-07T22:34:00-05:00`,year:2008,genre:`Lounge`,attrib:`https://open.spotify.com/artist/0du3MpnxBOpQEie1IV3u9v?si=2UO722ntTE--Ck_Ji7Go7Q`},{id:`rainbow`,title:`Rainbow in the Dark`,artist:`Das Racist`,album:`Shut Up, Dude`,cover:`https://data.wearedogs.net/img/covers/2026/rainbow.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/rainbow.png`,src:`https://data.wearedogs.net/music/2026/rainbow.mp3`,instrumental:`https://data.wearedogs.net/music/2026/rainbow-free.mp3`,dateAdded:`2026-07-08T16:35:00-05:00`,year:2010,genre:`Hip-Hop`,attrib:`https://dasracist.bandcamp.com/album/shut-up-dude`},{id:`hipsong`,title:`Hip Song`,artist:`Toby Fox / Trevor Alan Gomes`,album:`Deltarune`,cover:`https://data.wearedogs.net/img/covers/2026/deltarune.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/deltarune.png`,src:`https://data.wearedogs.net/music/2026/shop.mp3`,instrumental:`https://data.wearedogs.net/music/2026/shop-free.mp3`,dateAdded:`2026-07-09T01:22:00-05:00`,year:2021,genre:`Video Game`,attrib:`https://deltarune.com/`},{id:`sleepless`,title:`Sleepless`,artist:`deadmau5`,album:`> album title goes here <`,cover:`https://data.wearedogs.net/img/covers/2026/sleepless.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/sleepless.png`,src:``,instrumental:`https://data.wearedogs.net/music/2026/sleepless.mp3`,dateAdded:`2026-07-12T04:22:00-05:00`,year:2026,genre:`Electronic`,attrib:`https://deadmau5.com/`},{id:`skitzo`,title:`Skitzo (feat. Young Thug)`,artist:`Travis Scott`,album:`UTOPIA`,cover:`https://data.wearedogs.net/img/covers/2026/utopia.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/utopia.png`,src:`https://data.wearedogs.net/music/2026/skitzo.mp3`,instrumental:`https://data.wearedogs.net/music/2026/skitzo-free.mp3`,dateAdded:`2026-07-16T01:56:00-05:00`,year:2023,genre:`Hip-Hop`,attrib:`https://shop.travisscott.com/`}];function Ft(e){return e.src?e.src.split(`/`).pop():``}function It(e){if(!e.dateAdded)return`Summer`;let t=new Date(e.dateAdded).getMonth();return t===11||t===0||t===1?`Winter`:t>=2&&t<=4?`Spring`:t>=5&&t<=7?`Summer`:`Fall`}let U=k(()=>{let e=[...H];return h(St)===`artist`?e.sort((e,t)=>e.artist.localeCompare(t.artist)):h(St)===`album`?e.sort((e,t)=>e.album.localeCompare(t.album)):h(St)===`year`?e.sort((e,t)=>(e.year||0)-(t.year||0)):h(St)===`filename`?e.sort((e,t)=>Ft(e).localeCompare(Ft(t))):h(St)===`genre`?e.sort((e,t)=>(e.genre||``).localeCompare(t.genre||``)):h(St)===`season`&&e.sort((e,t)=>It(e).localeCompare(It(t))),e}),W=k(()=>H[F.currentTrackIndex]),Lt=A(0),Rt=A(0),zt=A(0),Bt=A(0),Vt=A(0),Ht=A(0),Ut=A(null),Wt=null;function Gt(e,t){e.stopPropagation();let n=`${window.location.origin}/music/${t.id}`;navigator.clipboard.writeText(n).then(()=>{T(Ut,t.id,!0),Wt&&clearTimeout(Wt),Wt=setTimeout(()=>{T(Ut,null)},2e3)}).catch(e=>{console.error(`Failed to copy share link:`,e)})}v(()=>{Wt&&clearTimeout(Wt)}),te(()=>{if(F.init(H),xt()){let e=H.findIndex(e=>e.id===xt());e!==-1&&F.loadTrack(e,!0)}else if(!F.hasPickedRandomTrack){F.hasPickedRandomTrack=!0;let e=Math.floor(Math.random()*H.length);F.loadTrack(e,!1)}});let G=A(null);function Kt(){let e=document.querySelector(`.track-row[data-track-id="${h(G)}"]`);e&&e.scrollIntoView({block:`nearest`,behavior:`smooth`})}function qt(e){T(G,e.id,!0);let t=H.findIndex(t=>t.id===e.id);F.currentTrackIndex===t&&!F.fetchErrors[e.id]?F.togglePlay():F.loadTrack(t,!0)}function Jt(){window.innerWidth<=640?T(L,!0):T(z,!h(z))}function Yt(){let e=!F.isInstrumental;F.setCrossfade(e)||(Oe(q),h(nn)||(T(nn,!0),setTimeout(()=>{T(nn,!1)},300)),h(q)===5?($(),T(rn,!0),setTimeout(()=>{T(rn,!1)},150)):h(q)===10?$(35):h(q)>5&&h(q)<10?$(8):h(q)>10&&Math.random()<.4&&$(3))}function Xt(e){return!e||isNaN(e)?`0:00`:`${Math.floor(e/60)}:${Math.floor(e%60).toString().padStart(2,`0`)}`}function Zt(e){let t=document.activeElement;if(!(t&&(t.tagName===`INPUT`||t.tagName===`TEXTAREA`||t.isContentEditable))){if(e.shiftKey){if(e.key===`ArrowRight`){e.preventDefault(),T(I,P[(P.findIndex(e=>e.id===h(I))+1)%P.length].id,!0);return}else if(e.key===`ArrowLeft`){e.preventDefault(),T(I,P[(P.findIndex(e=>e.id===h(I))-1+P.length)%P.length].id,!0);return}}if(e.code===`Space`||e.key===` `)h(I)===`songs`&&(e.preventDefault(),F.togglePlay());else if(e.key===`ArrowDown`){if(h(I)===`songs`&&h(U).length>0){e.preventDefault();let t=h(U).findIndex(e=>e.id===h(G));if(t===-1){let e=H[F.currentTrackIndex];t=h(U).findIndex(t=>t.id===e?.id)}let n=(t+1)%h(U).length;T(G,h(U)[n].id,!0),Kt()}}else if(e.key===`ArrowUp`){if(h(I)===`songs`&&h(U).length>0){e.preventDefault();let t=h(U).findIndex(e=>e.id===h(G));if(t===-1){let e=H[F.currentTrackIndex];t=h(U).findIndex(t=>t.id===e?.id)}let n=(t-1+h(U).length)%h(U).length;T(G,h(U)[n].id,!0),Kt()}}else if(e.key===`Enter`&&h(I)===`songs`&&h(G)){e.preventDefault();let t=h(U).find(e=>e.id===h(G));t&&qt(t)}}}let Qt=0,$t=0;function en(e){if(e.target&&(e.target.tagName===`INPUT`||e.target.closest(`button`)||e.target.closest(`.ctrl`))){Qt=0,$t=0;return}Qt=e.touches[0].clientX,$t=e.touches[0].clientY}function tn(e){if(Qt===0||!e.changedTouches||e.changedTouches.length===0)return;let t=e.changedTouches[0].clientX-Qt,n=e.changedTouches[0].clientY-$t;if(Math.abs(t)<=Math.abs(n)||Math.abs(t)<=60)return;let r=P.findIndex(e=>e.id===h(I));r!==-1&&(t<0&&r<P.length-1?T(I,P[r+1].id,!0):t>0&&r>0&&T(I,P[r-1].id,!0))}let K=A(null),q=A(0),nn=A(!1),rn=A(!1),J,Y,X,Z=[],Q=[],an,on=A(!1);C(()=>(h(K)&&cn(),()=>{an&&cancelAnimationFrame(an),window.removeEventListener(`resize`,ln),X&&(X.dispose(),X=null),J=null,Y=null,Z=[],Q=[]})),C(()=>{if(F.currentTrackIndex,h(I),bt(),T(q,0),T(on,!1),J){for(let e of Z)J.remove(e.mesh);for(let e of Q)J.remove(e.mesh)}Z=[],Q=[]});function sn(){let e=document.querySelector(`.dj-fader-knob`);if(!e)return{x:window.innerWidth/2,y:window.innerHeight/2};let t=e.getBoundingClientRect();return{x:t.left+t.width/2,y:window.innerHeight-(t.top+t.height/2)}}function cn(){if(!h(K))return;let e=window.innerWidth,t=window.innerHeight;h(K).width=e,h(K).height=t,J=new g,Y=new re(0,e,t,0,-1,1),X=new ve({canvas:h(K),alpha:!0,antialias:!0}),X.setSize(e,t,!1),X.setPixelRatio(Math.min(window.devicePixelRatio,2)),window.addEventListener(`resize`,ln),un()}function ln(){if(!h(K)||!X||!Y)return;let e=window.innerWidth,t=window.innerHeight;h(K).width=e,h(K).height=t,X.setSize(e,t,!1),Y.right=e,Y.top=t,Y.updateProjectionMatrix()}function un(){if(an=requestAnimationFrame(un),!(!J||!Y||!X||!h(K))){if(h(q)>=10&&(T(on,!0),Math.random()<.22)){let e=sn();dn(e.x,e.y)}for(let e=Z.length-1;e>=0;e--){let t=Z[e];t.x+=t.vx,t.y+=t.vy,t.vy+=t.ay,t.life-=t.decay,t.mesh.position.set(t.x,t.y,0),t.mesh.material.opacity=t.life,t.life<=0&&(J.remove(t.mesh),t.mesh.geometry.dispose(),t.mesh.material.dispose(),Z.splice(e,1))}for(let e=Q.length-1;e>=0;e--){let t=Q[e];t.x+=t.vx,t.y+=t.vy,t.life-=t.decay;let n=t.startScale+(1-t.life)*88;t.mesh.scale.set(n,n,1),t.mesh.position.set(t.x,t.y,0),t.mesh.material.opacity=t.life*.16,t.life<=0&&(J.remove(t.mesh),t.mesh.geometry.dispose(),t.mesh.material.dispose(),Q.splice(e,1))}X.render(J,Y)}}function dn(e,r){if(!J)return;let i=new ae(5,8),a=.85+Math.random()*.12,o=new t(i,new be({color:new n(a,a,a*1.01),transparent:!0,opacity:.06,blending:1}));o.position.set(e,r,0),J.add(o),Q.push({mesh:o,x:e,y:r,vx:(Math.random()-.5)*.55+Math.sin(Date.now()*.001)*.22,vy:Math.random()*.7+1.25,startScale:1,life:1,decay:6e-4+Math.random()*4e-4})}function $(e=25){if(!J||!h(K))return;let r=sn(),i=r.x,a=r.y;for(let r=0;r<e;r++){let e=new t(new ae(1.3,4),new be({color:new n(Math.random()<.4?16711765:16755200),transparent:!0,opacity:1,blending:2}));e.position.set(i,a,0),J.add(e);let r=Math.random()*Math.PI*2,o=Math.random()*4+2;Z.push({mesh:e,x:i,y:a,vx:Math.cos(r)*o,vy:Math.sin(r)*o,ay:-.15,life:1,decay:.02+Math.random()*.02})}}var fn=_t();ce(`keydown`,_e,Zt),ce(`popstate`,_e,Nt),ce(`click`,_e,Pt);var pn=M(fn);let mn;var hn=M(pn),gn=M(hn),_n=M(gn);ze(M(_n),{size:`panel`}),w(_n);var vn=j(_n,2);vn.textContent=`MUSIC`,w(gn);var yn=j(gn,2);me(M(yn),{size:20}),w(yn),w(hn);var bn=j(hn,2);Ve(bn,{get tabs(){return P},get activeTab(){return h(I)},set activeTab(e){T(I,e,!0)}});var xn=j(bn,2),Sn=M(xn),Cn=e=>{var t=st(),n=M(t);let r;var a=M(n);let l;var g=M(a),ee=M(g),v=e=>{var t=Ke(),n=M(t);Se(n,e=>T(kt,e),()=>h(kt));var r=j(n,2),i=e=>{_(e,Ge())};O(r,e=>{!F.isPlaying&&!h(At)&&e(i)});var a=j(r,2);je(M(a),{size:16,class:`text-white/70`}),w(a),w(t),x(`click`,t,()=>{T(Ot,!0)}),_(e,t)},te=e=>{var t=qe();je(M(t),{size:16,class:`text-white/20`}),w(t),_(e,t)},re=e=>{var t=ie(),n=Te(t),r=e=>{var t=Je(),n=M(t);let r;var i=j(M(n),8),a=M(i);let o;w(i),E(2),w(n);var c=j(n,2);let l;w(t),S(()=>{r=y(n,1,`vinyl-record svelte-1o4jdf5`,null,r,{spinning:h(R)}),D(a,`src`,F.fetchErrors[h(W).id]||!h(W).cover?vt:h(W).cover),D(a,`alt`,h(W).album),o=y(a,1,`record-art svelte-1o4jdf5`,null,o,{loaded:h(wt)}),l=y(c,1,`tonearm svelte-1o4jdf5`,null,l,{playing:h(R)})}),x(`click`,t,Jt),ce(`load`,a,()=>T(wt,!0)),ce(`error`,a,yt),s(a),_(e,t)},i=e=>{let t=k(()=>F.duration>0?(1-F.currentTime/F.duration)*.45+.25:.48),n=k(()=>F.duration>0?F.currentTime/F.duration*.45+.25:.48);var r=Ye(),i=M(r),a=M(i),o=M(a),s=M(o,!0);w(o),E(2),w(a);var c=j(a,2),l=M(c);let u;var f=j(l,2);let p;var m=j(f,2);let g;var ee=j(m,2);let v;w(c),w(i),w(r),S(()=>{d(s,h(W).title),u=y(l,1,`spindle-left bg-zinc-900 svelte-1o4jdf5`,null,u,{spinning:h(R)}),p=y(f,1,`tape-roll-left bg-amber-950/70 svelte-1o4jdf5`,null,p,{spinning:h(R)}),Pe(f,`width: ${h(t)*46}px; height: ${h(t)*46}px;`),g=y(m,1,`spindle-right bg-zinc-900 svelte-1o4jdf5`,null,g,{spinning:h(R)}),v=y(ee,1,`tape-roll-right bg-amber-950/70 svelte-1o4jdf5`,null,v,{spinning:h(R)}),Pe(ee,`width: ${h(n)*46}px; height: ${h(n)*46}px;`)}),x(`click`,r,Jt),_(e,r)},a=e=>{var t=Xe(),n=M(t),r=j(M(n),4),i=j(M(r),4),a=M(i),o=M(a,!0);w(a);var s=j(a,2),c=M(s,!0);w(s),w(i),w(r);var l=j(r,2),u=M(l);let f;var p=j(u,2),m=M(p);let g;w(p),w(l);var ee=j(l,2);let v;w(n),w(t),S(()=>{d(o,h(W).title),d(c,h(W).artist||`WEAREDOGS`),f=y(u,1,`floppy-shutter-slider bg-zinc-400 svelte-1o4jdf5`,null,f,{open:h(R)}),g=y(m,1,`floppy-magnetic-disc bg-zinc-900 svelte-1o4jdf5`,null,g,{spinning:h(R)}),v=y(ee,1,`floppy-drive-led svelte-1o4jdf5`,null,v,{active:h(R)})}),x(`click`,t,Jt),_(e,t)},o=e=>{var t=Qe(),n=M(t),r=M(n);let i;var a=j(r,2),o=M(a),s=M(o);let c;var l=j(s,2);let u;w(o);var d=j(o,2),f=M(d);let p;w(d);var m=j(d,2);ne(m,20,()=>Array(10),xe,(e,t,n)=>{var r=Ze();let i;S(e=>i=y(r,1,`comb-tooth svelte-1o4jdf5`,null,i,e),[()=>({vibrating:h(R)&&n%3==Math.floor(F.currentTime*4)%3})]),_(e,r)}),w(m),w(a),w(n),w(t),S(()=>{i=y(r,1,`music-box-key svelte-1o4jdf5`,null,i,{spinning:h(R)}),c=y(s,1,`music-box-gear gear-1 svelte-1o4jdf5`,null,c,{spinning:h(R)}),u=y(l,1,`music-box-gear gear-2 svelte-1o4jdf5`,null,u,{spinning:h(R)}),p=y(f,1,`music-box-drum bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 svelte-1o4jdf5`,null,p,{spinning:h(R)})}),x(`click`,t,Jt),_(e,t)};O(n,e=>{Be.musicDeckModel===`vinyl`?e(r):Be.musicDeckModel===`cassette`?e(i,1):Be.musicDeckModel===`floppy`?e(a,2):Be.musicDeckModel===`musicbox`&&e(o,3)}),_(e,t)};O(ee,e=>{h(z)&&!h(Ot)?e(v):h(z)&&h(Ot)?e(te,1):e(re,-1)}),w(g);var ae=j(g,2),se=M(ae),C=M(se),me=M(C),ge=e=>{de(e,{size:12,class:`text-[#22c55e]`})},_e=e=>{i(e,{size:12})};O(me,e=>{h(Ut)===h(W).id?e(ge):e(_e,-1)}),w(C),w(se);var ve=j(se,2);let ye;var be=M(ve);let Ce;var A=M(be,!0);w(be),w(ve);var Ee=j(ve,2);let De;var Oe=M(Ee);let N;var P=M(Oe,!0);w(Oe),w(Ee);var Le=j(Ee,2);let Re;var ze=M(Le);let Ve;var He=M(ze,!0);w(ze),w(Le),w(ae),w(a);var We=j(a,2),ct=M(We),lt=M(ct),ut=M(lt,!0);w(lt);var dt=j(lt,2),ft=M(dt);ne(ft,21,()=>h(jt),xe,(e,t,n)=>{let r=k(()=>F.duration>0?F.currentTime/F.duration:0),i=k(()=>n/60);var a=$e();let o;S(()=>{o=y(a,1,`waveform-bar transition-colors duration-100 rounded-t svelte-1o4jdf5`,null,o,{active:h(i)<=h(r)}),Pe(a,`height: ${h(t)??``}%; width: 3px;`)}),_(e,a)}),w(ft);var pt=j(ft,2);we(pt),w(dt);var mt=j(dt,2),ht=M(mt,!0);w(mt),w(ct);var gt=j(ct,2),_t=M(gt);let bt;oe(M(_t),{size:15}),w(_t);var xt=j(_t,2);Fe(M(xt),{size:19}),w(xt);var I=j(xt,2);let Ct;var B=M(I),V=e=>{Ae(e,{size:22})},Mt=e=>{_(e,et())},Nt=e=>{le(e,{size:22,fill:`currentColor`})},Pt=e=>{u(e,{size:22,fill:`currentColor`})};O(B,e=>{F.fetchErrors[h(W).id]?e(V):F.isLoading?e(Mt,1):F.isPlaying?e(Nt,2):e(Pt,-1)}),w(I);var Ft=j(I,2);he(M(Ft),{size:19}),w(Ft);var It=j(Ft,2);let Wt;var Kt=M(It),Zt=e=>{f(e,{size:15})},Qt=e=>{o(e,{size:15})};O(Kt,e=>{F.repeatMode===2?e(Zt):e(Qt,-1)}),w(It),w(gt);var $t=j(gt,2),en=M($t);let tn;var K=M(en);let J;fe(M(K),{size:12}),E(2),w(K);var Y=j(K,2),X=M(Y);let Z;w(Y);var Q=j(Y,2);let an;Ie(M(Q),{size:12}),E(2),w(Q),w(en),w($t);var on=j($t,2),sn=M(on),cn=e=>{var t=tt(),n=M(t),r=M(n),i=e=>{p(e,{size:12,class:`text-red-400`})},a=e=>{ue(e,{size:12})};O(r,e=>{F.isMuted||F.volume===0?e(i):e(a,-1)}),w(n);var o=j(n,2);we(o);var s=j(o,2),c=M(s);w(s),w(t),Se(t,e=>T(Et,e),()=>h(Et)),S(e=>{pe(o,F.volume),d(c,`${e??``}%`)},[()=>Math.round(F.volume*100)]),x(`click`,n,()=>F.toggleMute()),x(`input`,o,e=>F.setVolume(parseFloat(e.target.value))),_(e,t)};O(sn,e=>{h(Tt)&&e(cn)});var ln=j(sn,2),un=M(ln);let dn;m(M(un),{size:13}),w(un);var $=j(un,2),fn=M($,!0);w($),w(ln);var pn=j(ln,2),mn=M(pn),hn=M(mn),gn=e=>{p(e,{size:13,class:`text-red-400`})},_n=e=>{ue(e,{size:13})};O(hn,e=>{F.isMuted||F.volume===0?e(gn):e(_n,-1)}),w(mn),w(pn),w(on),w(We),w(n);var vn=j(n,2);let yn;var bn=M(vn),xn=j(M(bn),2);w(bn);var Sn=j(bn,2),Cn=M(Sn),wn=M(Cn);ke(wn,{size:13});var Tn=j(wn,3),En=M(Tn,!0);w(Tn),w(Cn);var Dn=j(Cn,2),On=j(M(Dn),2),kn=M(On);kn.value=kn.__value=`default`;var An=j(kn);An.value=An.__value=`artist`;var jn=j(An);jn.value=jn.__value=`album`;var Mn=j(jn);Mn.value=Mn.__value=`year`;var Nn=j(Mn);Nn.value=Nn.__value=`filename`;var Pn=j(Nn);Pn.value=Pn.__value=`genre`;var Fn=j(Pn);Fn.value=Fn.__value=`season`,w(On),w(Dn),w(Sn);var In=j(Sn,2);ne(In,21,()=>h(U),xe,(e,t,n)=>{var r=ot();let a;var o=M(r),c=M(o),l=e=>{_(e,nt())},u=e=>{var t=rt();t.textContent=n+1,_(e,t)};O(c,e=>{H[F.currentTrackIndex].id===h(t).id&&F.isPlaying?e(l):e(u,-1)}),w(o);var f=j(o,2),p=j(f,2),m=M(p),g=M(m);let ee;var v=M(g,!0);w(g);var te=j(g,2),ne=e=>{var t=it();Ae(M(t),{size:10}),E(),w(t),_(e,t)};O(te,e=>{F.fetchErrors[h(t).id]&&e(ne)}),w(m);var re=j(m,2),ie=M(re);w(re),w(p);var ae=j(p,2),oe=M(ae),b=e=>{var n=at(),r=M(n);w(n),S(()=>D(r,`href`,h(t).attrib)),x(`click`,r,e=>e.stopPropagation()),_(e,n)};O(oe,e=>{h(t).attrib&&e(b)});var se=j(oe,2),le=M(se),ue=e=>{de(e,{size:12,class:`text-[#22c55e]`})},C=e=>{i(e,{size:12})};O(le,e=>{h(Ut)===h(t).id?e(ue):e(C,-1)}),w(se),w(ae),w(r),S(()=>{a=y(r,1,`track-row svelte-1o4jdf5`,null,a,{active:H[F.currentTrackIndex].id===h(t).id,"kb-focused":h(G)===h(t).id,"fetch-error":F.fetchErrors[h(t).id]}),D(r,`data-track-id`,h(t).id),D(f,`src`,F.fetchErrors[h(t).id]||!h(t).cover?vt:h(t).cover),D(f,`alt`,h(t).album),ee=y(g,1,`tr-title svelte-1o4jdf5`,null,ee,{"line-through":F.fetchErrors[h(t).id],"opacity-50":F.fetchErrors[h(t).id]}),d(v,h(t).title),d(ie,`${h(t).artist??``} · ${h(t).album??``} (${(h(t).year||``)??``})`)}),x(`click`,r,()=>qt(h(t))),ce(`error`,f,yt),s(f),x(`click`,se,e=>Gt(e,h(t))),_(e,r)}),w(In),w(vn),w(t),S((e,t)=>{r=y(n,1,`player-side svelte-1o4jdf5`,null,r,{"tracklist-open":h(L)}),l=y(a,1,`player-top-block transition-all duration-300 ease-in-out svelte-1o4jdf5`,null,l,{"opacity-0":h(L),"scale-95":h(L),"pointer-events-none":h(L)}),ye=y(ve,1,`scroll-container svelte-1o4jdf5`,null,ye,{overflowing:h(Rt)>h(Lt)}),Pe(ve,`--scroll-dist: -${h(Rt)-h(Lt)}px`),Ce=y(be,1,`track-title scroll-text svelte-1o4jdf5`,null,Ce,{"animate-scroll":h(Rt)>h(Lt)}),d(A,h(W).title),De=y(Ee,1,`scroll-container svelte-1o4jdf5`,null,De,{overflowing:h(Bt)>h(zt)}),Pe(Ee,`--scroll-dist: -${h(Bt)-h(zt)}px`),N=y(Oe,1,`track-artist scroll-text svelte-1o4jdf5`,null,N,{"animate-scroll":h(Bt)>h(zt)}),d(P,h(W).artist),Re=y(Le,1,`scroll-container svelte-1o4jdf5`,null,Re,{overflowing:h(Ht)>h(Vt)}),Pe(Le,`--scroll-dist: -${h(Ht)-h(Vt)}px`),Ve=y(ze,1,`track-album scroll-text svelte-1o4jdf5`,null,Ve,{"animate-scroll":h(Ht)>h(Vt)}),d(He,h(W).album),d(ut,e),D(pt,`max`,F.duration||100),pe(pt,F.currentTime),d(ht,t),bt=y(_t,1,`ctrl ctrl-sm svelte-1o4jdf5`,null,bt,{"active-ctrl":F.isShuffled}),Ct=y(I,1,`ctrl ctrl-play svelte-1o4jdf5`,null,Ct,{"ctrl-error":F.fetchErrors[h(W).id]}),D(I,`aria-label`,F.isPlaying?`Pause`:`Play`),Wt=y(It,1,`ctrl ctrl-sm svelte-1o4jdf5`,null,Wt,{"active-ctrl":F.repeatMode>0}),tn=y(en,1,`dj-crossfader svelte-1o4jdf5`,null,tn,{"fader-flash":h(rn),"fader-fried":h(q)>=10}),J=y(K,1,`fader-label left-label flex items-center gap-1 svelte-1o4jdf5`,null,J,{active:!F.isInstrumental}),Z=y(X,1,`dj-fader-knob svelte-1o4jdf5`,null,Z,{right:F.isInstrumental,"knob-jiggle":h(nn),fried:h(q)>=10}),an=y(Q,1,`fader-label right-label flex items-center gap-1 svelte-1o4jdf5`,null,an,{active:F.isInstrumental}),dn=y(un,1,`ctrl ctrl-xs svelte-1o4jdf5`,null,dn,{"active-ctrl":h(z)}),y($,1,`w-[90px] h-[20px] flex items-center justify-center rounded text-[9px] font-bold transition-all font-mono uppercase tracking-wider select-none cursor-pointer
                      ${h(z)?`bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/25 active:scale-95`:`bg-transparent border border-white/5 text-white/20 hover:text-white/40 hover:border-white/10`}`,`svelte-1o4jdf5`),D($,`title`,h(z)?`Click to cycle presets`:`Click to enable visualizer`),d(fn,Ue[h(Dt)].name),yn=y(vn,1,`tracklist-side svelte-1o4jdf5`,null,yn,{"show-mobile":h(L)}),d(En,H.length)},[()=>Xt(F.currentTime),()=>Xt(F.duration)]),x(`click`,C,e=>Gt(e,h(W))),Me(be,`clientWidth`,e=>T(Rt,e)),Me(ve,`clientWidth`,e=>T(Lt,e)),Me(Oe,`clientWidth`,e=>T(Bt,e)),Me(Ee,`clientWidth`,e=>T(zt,e)),Me(ze,`clientWidth`,e=>T(Ht,e)),Me(Le,`clientWidth`,e=>T(Vt,e)),x(`input`,pt,e=>{F.seek(parseFloat(e.target.value))}),x(`change`,pt,e=>{F.play(parseFloat(e.target.value))}),x(`click`,_t,()=>F.isShuffled=!F.isShuffled),x(`click`,xt,()=>F.prevTrack()),x(`click`,I,()=>F.togglePlay()),x(`click`,Ft,()=>F.nextTrack()),x(`click`,It,()=>{F.repeatMode=(F.repeatMode+1)%3}),x(`click`,en,Yt),x(`click`,un,()=>{T(z,!h(z))}),x(`click`,$,()=>{h(z)?T(Dt,(h(Dt)+1)%Ue.length):T(z,!0)}),x(`click`,mn,()=>{T(Tt,!h(Tt))}),x(`click`,xn,()=>{T(L,!1)}),Ne(On,()=>h(St),e=>T(St,e)),b(1,t,()=>c,()=>({duration:120,delay:120})),b(2,t,()=>c,()=>({duration:120})),_(e,t)},wn=e=>{var t=ct(),n=j(M(t),2),r=M(n);fe(r,{size:36});var i=j(r,6),a=j(M(i),2);se(M(a),{size:15}),E(),w(a),w(i),w(n),E(2),w(t),b(1,t,()=>c,()=>({duration:120,delay:120})),b(2,t,()=>c,()=>({duration:120})),_(e,t)},Tn=e=>{var t=ut(),n=j(M(t),2),r=j(M(n),4);De(j(M(r)),{size:15}),w(r),w(n);var i=j(n,2);ne(i,20,()=>[{name:`Apple Music`,color:`#fc3c44`,icon:`🎵`},{name:`YouTube Music`,color:`#ff0000`,icon:`▶`},{name:`Amazon Music`,color:`#00a8e0`,icon:`♪`},{name:`Tidal`,color:`#00d4f5`,icon:`〰`}],xe,(e,t)=>{var n=lt(),r=M(n),i=M(r,!0);w(r);var a=j(r),o=M(a,!0);w(a),ee(j(a),{size:11}),w(n),S(()=>{Pe(n,`--sc:${t.color??``}`),d(i,t.icon),d(o,t.name)}),_(e,n)}),w(i),E(2),w(t),b(1,t,()=>c,()=>({duration:120,delay:120})),b(2,t,()=>c,()=>({duration:120})),_(e,t)},En=e=>{var t=dt();b(1,t,()=>c,()=>({duration:120,delay:120})),b(2,t,()=>c,()=>({duration:120})),_(e,t)},Dn=e=>{var t=pt(),n=M(t),i=e=>{let t=k(()=>h(Ct));var n=ie();r(Te(n),()=>h(t),(e,t)=>{t(e,{get audioCore(){return F}})}),_(e,n)},a=e=>{_(e,ft())};O(n,e=>{h(Ct)?e(i):e(a,-1)}),w(t),b(1,t,()=>c,()=>({duration:120,delay:120})),b(2,t,()=>c,()=>({duration:120})),_(e,t)};O(Sn,e=>{h(I)===`songs`?e(Cn):h(I)===`samples`?e(wn,1):h(I)===`playlists`?e(Tn,2):h(I)===`radio`?e(En,3):h(I)===`battle`&&e(Dn,4)}),w(xn),E(2),w(pn);var On=j(pn,2),kn=e=>{var t=gt(),n=M(t);Se(n,e=>T(kt,e),()=>h(kt));var r=j(n,2),i=e=>{_(e,mt())};O(r,e=>{!F.isPlaying&&!h(At)&&e(i)});var a=j(r,2),o=M(a);ne(o,21,()=>Ue,xe,(e,t,n)=>{var r=ht(),i=M(r,!0);w(r),S(()=>{y(r,1,`px-2 py-1 rounded text-[9px] font-bold transition-all uppercase tracking-wider font-mono
                ${h(Dt)===n?`bg-purple-600 text-white`:`text-white/40 hover:text-white/80`}`,`svelte-1o4jdf5`),d(i,h(t).name)}),x(`click`,r,()=>T(Dt,n,!0)),_(e,r)}),w(o),w(a),w(t),x(`click`,t,e=>{e.stopPropagation(),T(Ot,!1)}),x(`click`,a,e=>e.stopPropagation()),_(e,t)};O(On,e=>{h(z)&&h(Ot)&&e(kn)}),Se(j(On,2),e=>T(K,e),()=>h(K)),w(fn),S(()=>mn=y(pn,1,`mp-container svelte-1o4jdf5`,null,mn,{closing:bt(),"theme-inst":F.isInstrumental})),x(`click`,fn,function(...e){N.onClose?.apply(this,e)}),x(`click`,pn,e=>e.stopPropagation()),x(`click`,_n,()=>{F.isPlaying||window.dispatchEvent(new CustomEvent(`open-info-panel`))}),x(`click`,yn,function(...e){N.onClose?.apply(this,e)}),x(`touchstart`,xn,en,void 0,!0),x(`touchend`,xn,tn),_(l,fn),Ce()}l([`click`,`touchstart`,`touchend`,`input`,`change`]);export{vt as default};