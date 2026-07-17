const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/BattlePanel-CT4yOAjB.js","assets/vendor-DQG336B7.js","assets/rolldown-runtime-CMxvf4Kt.js","assets/vendor-Dl9nCA7L.css","assets/BattlePanel-B1S5D9Lq.css"])))=>i.map(i=>d[i]);
import{$r as e,A as t,An as n,Ar as r,Br as i,Bt as a,C as o,Cr as s,Er as c,Fr as l,Ft as u,Gn as d,H as f,Hr as p,Ir as m,J as h,Jr as g,K as ee,L as te,Nn as ne,Nr as _,Or as v,P as re,Pr as y,Pt as ie,Qr as b,Rt as ae,S as oe,Sr as x,Tr as se,Tt as ce,Ur as S,Ut as le,Vr as ue,Vt as de,Xt as fe,Y as pe,Zn as me,Zr as he,_n as ge,bt as _e,cr as ve,di as ye,dr as be,ei as C,en as xe,fi as Se,fr as w,ft as Ce,g as we,hi as T,hr as Te,ii as Ee,j as E,kr as De,mi as D,mr as Oe,ni as O,oi as k,on as ke,or as Ae,ot as je,pi as A,qn as Me,qr as j,ri as M,rr as Ne,sr as Pe,vr as Fe,xt as Ie,yr as N,yt as Le,zr as P}from"./vendor-DQG336B7.js";import{t as Re}from"./index-B2nnqK5P.js";import{t as F}from"./AudioCore.svelte-ZRP--gZd.js";import{t as ze}from"./DogsLogo-YKmcXLWz.js";import{t as Be}from"./settingsManager.svelte-CmsfscX2.js";import{t as Ve}from"./SwipeTabNav-CDjykPeW.js";var He=class{constructor(e,t){T(this,`canvas`,null),T(this,`gl`,null),T(this,`analyser`,null),T(this,`program`,null),T(this,`animationFrameId`,null),T(this,`startTime`,0),T(this,`vertexBuffer`,null),T(this,`audioTexture`,null),T(this,`uniforms`,{}),T(this,`frequencyBuffer`,null),this.canvas=e,this.analyser=t,this.frequencyBuffer=new Uint8Array(t?t.frequencyBinCount:128),this.gl=e.getContext(`webgl`)||e.getContext(`experimental-webgl`),this.gl||console.error(`WebGL not supported by this browser.`)}init(e){if(!this.gl)return;let t=this.gl;this.cleanupProgram();let n=this.compileShader(t.VERTEX_SHADER,`
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
  `},Ge=m(`<div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 animate-pulse svelte-1o4jdf5"><div class="bg-black/75 border border-red-500/30 px-3 py-1.5 rounded text-[10px] font-mono tracking-widest text-red-500 font-bold uppercase shadow-[0_0_15px_rgba(239,68,68,0.25)] select-none svelte-1o4jdf5">NO SIGNAL</div></div>`),Ke=m(`<div class="visualizer-container cursor-pointer svelte-1o4jdf5"><canvas class="visualizer-canvas svelte-1o4jdf5"></canvas> <!> <div class="visualizer-hover-overlay svelte-1o4jdf5"><!></div></div>`),qe=m(`<div class="visualizer-container bg-[#050508]/40 border border-white/5 flex items-center justify-center svelte-1o4jdf5"><!></div>`),Je=m(`<div class="vinyl-record-clicker cursor-pointer w-full h-full svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div><div class="groove g1 svelte-1o4jdf5"></div> <div class="groove g2 svelte-1o4jdf5"></div> <div class="groove g3 svelte-1o4jdf5"></div> <div class="groove g4 svelte-1o4jdf5"></div> <div class="record-label svelte-1o4jdf5"><img loading="lazy"/></div> <div class="spindle svelte-1o4jdf5"></div></div> <div></div></div>`),Ye=m(`<div class="cassette-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="cassette-tape svelte-1o4jdf5"><div class="cassette-label bg-gradient-to-r from-purple-800 to-pink-700 svelte-1o4jdf5"><span class="cassette-track-title svelte-1o4jdf5"> </span> <span class="cassette-brand svelte-1o4jdf5">WEAREDOGS AUDIO</span></div> <div class="cassette-window bg-zinc-950/80 svelte-1o4jdf5"><div></div> <div></div> <div></div> <div></div></div></div></div>`),Xe=m(`<div class="floppy-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="floppy-disk svelte-1o4jdf5"><div class="floppy-corner svelte-1o4jdf5"></div> <div class="floppy-write-protect svelte-1o4jdf5"></div> <div class="floppy-label bg-slate-100 text-slate-900 svelte-1o4jdf5"><div class="floppy-label-stripe bg-red-600 svelte-1o4jdf5"></div> <div class="floppy-label-stripe-blue bg-blue-600 svelte-1o4jdf5"></div> <div class="floppy-label-content svelte-1o4jdf5"><div class="floppy-song truncate font-mono svelte-1o4jdf5"> </div> <div class="floppy-artist truncate font-mono svelte-1o4jdf5"> </div></div></div> <div class="floppy-shutter-door bg-zinc-700 svelte-1o4jdf5"><div></div> <div class="floppy-shutter-opening bg-zinc-950 svelte-1o4jdf5"><div></div></div></div> <div></div></div></div>`),Ze=m(`<div></div>`),Qe=m(`<div class="musicbox-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="music-box svelte-1o4jdf5"><div></div> <div class="music-box-interior border border-amber-900/40 svelte-1o4jdf5"><div class="music-box-gears svelte-1o4jdf5"><div></div> <div></div></div> <div class="music-box-drum-wrap svelte-1o4jdf5"><div><div class="music-box-pins svelte-1o4jdf5"><div class="pin pin-1 svelte-1o4jdf5"></div> <div class="pin pin-2 svelte-1o4jdf5"></div> <div class="pin pin-3 svelte-1o4jdf5"></div> <div class="pin pin-4 svelte-1o4jdf5"></div> <div class="pin pin-5 svelte-1o4jdf5"></div> <div class="pin pin-6 svelte-1o4jdf5"></div></div></div></div> <div class="music-box-comb svelte-1o4jdf5"></div></div></div></div>`),$e=m(`<span></span>`),et=m(`<div class="spin-ring svelte-1o4jdf5"></div>`),tt=m(`<div class="volume-popover svelte-1o4jdf5"><button class="ctrl ctrl-xs mr-2 border border-white/10 rounded-full p-1 hover:bg-white/10 svelte-1o4jdf5" aria-label="Mute"><!></button> <input type="range" class="vol-slider-pop svelte-1o4jdf5" min="0" max="1" step="0.01" aria-label="Volume"/> <span class="text-[10px] font-bold text-white/60 min-w-[28px] text-right font-mono select-none svelte-1o4jdf5"> </span></div>`),nt=m(`<div class="eq svelte-1o4jdf5"><div class="eq-b svelte-1o4jdf5"></div> <div class="eq-b svelte-1o4jdf5"></div> <div class="eq-b svelte-1o4jdf5"></div></div>`),rt=m(`<span class="svelte-1o4jdf5"></span>`),it=m(`<span class="text-amber-400 flex items-center gap-1 text-[9px] font-bold tracking-wider uppercase bg-amber-500/10 px-1.5 py-0.5 rounded flex-shrink-0 svelte-1o4jdf5" title="Failed to fetch music source from remote database"><!> Error Fetching</span>`),at=m(`<span class="inst-chip-link svelte-1o4jdf5"><a target="_blank" class="svelte-1o4jdf5">i</a></span>`),ot=m(`<div><div class="tr-num svelte-1o4jdf5"><!></div> <img loading="lazy" class="tr-art svelte-1o4jdf5"/> <div class="tr-info svelte-1o4jdf5"><div class="flex items-center gap-1.5 min-w-0 svelte-1o4jdf5"><span> </span> <!></div> <span class="tr-meta svelte-1o4jdf5"> </span></div> <div class="flex items-center gap-2 flex-shrink-0 svelte-1o4jdf5"><!>  <button class="tr-share-btn svelte-1o4jdf5" title="Copy track link" aria-label="Share track"><!></button></div></div>`),st=m(`<div class="songs-layout svelte-1o4jdf5"><div><div><div class="vinyl-wrapper relative overflow-hidden svelte-1o4jdf5"><!></div> <div class="track-info mt-2 svelte-1o4jdf5"><div class="flex items-center justify-center mb-1.5 svelte-1o4jdf5"><button class="player-share-btn svelte-1o4jdf5" title="Copy track link" aria-label="Share track"><!></button></div> <div><h2> </h2></div> <div><p> </p></div> <div><p> </p></div></div></div> <div class="player-controls-block svelte-1o4jdf5"><div class="progress-row svelte-1o4jdf5"><span class="ptime svelte-1o4jdf5"> </span> <div class="progress-wrap waveform-slider-wrap relative h-9 flex items-end svelte-1o4jdf5"><div class="waveform-bars flex items-end justify-between absolute inset-0 pointer-events-none px-1 h-full svelte-1o4jdf5"></div> <input type="range" class="seek-input absolute inset-0 opacity-0 cursor-pointer w-full h-full svelte-1o4jdf5" min="0" step="0.1" aria-label="Seek"/></div> <span class="ptime svelte-1o4jdf5"> </span></div> <div class="controls-row svelte-1o4jdf5"><button aria-label="Shuffle"><!></button> <button class="ctrl ctrl-md svelte-1o4jdf5" aria-label="Previous"><!></button> <button><!></button> <button class="ctrl ctrl-md svelte-1o4jdf5" aria-label="Next"><!></button> <button aria-label="Repeat"><!></button></div> <div class="w-full flex flex-col items-center gap-1.5 mt-2 px-1 svelte-1o4jdf5"><div><span><!> <span class="svelte-1o4jdf5">VOCAL</span></span> <div class="dj-fader-slot relative svelte-1o4jdf5"><div></div></div> <span><!> <span class="svelte-1o4jdf5">INST</span></span></div></div> <div class="relative flex justify-center items-center gap-3 mt-2 w-full svelte-1o4jdf5"><!> <div class="flex items-center gap-1.5 svelte-1o4jdf5"><button aria-label="Toggle Visualizer"><!></button> <button> </button></div> <div class="relative svelte-1o4jdf5"><button class="ctrl ctrl-xs vol-toggle-btn svelte-1o4jdf5" aria-label="Toggle volume slider"><!></button></div></div></div></div> <div><div class="mobile-close-bar hidden py-2 px-4 border-b border-white/5 flex items-center justify-between svelte-1o4jdf5"><span class="text-xs font-bold text-white/50 svelte-1o4jdf5">Track Library</span> <button class="px-3 py-1 bg-white/5 text-white/75 rounded-lg text-xs font-bold svelte-1o4jdf5">Back to player</button></div> <div class="tl-header flex justify-between items-center gap-3 svelte-1o4jdf5"><div class="flex items-center gap-2 svelte-1o4jdf5"><!><span class="svelte-1o4jdf5">TRACKS</span> <span class="tl-count svelte-1o4jdf5"> </span></div> <div class="flex items-center gap-1.5 ml-auto svelte-1o4jdf5"><span class="text-[9px] text-white/30 font-bold font-sans svelte-1o4jdf5">SORT BY:</span> <select class="bg-black/40 border border-white/10 rounded px-1.5 py-0.5 text-[10px] font-bold text-white/60 outline-none cursor-pointer hover:border-white/20 transition-all font-sans svelte-1o4jdf5"><option class="svelte-1o4jdf5">DEFAULT</option><option class="svelte-1o4jdf5">ARTIST</option><option class="svelte-1o4jdf5">ALBUM</option><option class="svelte-1o4jdf5">YEAR</option><option class="svelte-1o4jdf5">FILENAME</option><option class="svelte-1o4jdf5">GENRE</option><option class="svelte-1o4jdf5">SEASON</option></select></div></div> <div class="tracklist scroll-y svelte-1o4jdf5"></div></div></div>`),ct=m(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><div class="sec-head svelte-1o4jdf5"><h2 class="sec-title svelte-1o4jdf5">Samples</h2> <p class="sec-sub svelte-1o4jdf5">MP3 · MP4 · WAV · OGG · YouTube · Instagram · TikTok</p></div> <div class="drop-zone svelte-1o4jdf5"><!> <p class="drop-title svelte-1o4jdf5">Drop files or paste a link</p> <p class="drop-sub svelte-1o4jdf5">Supports all major audio, video, and streaming links</p> <div class="link-row svelte-1o4jdf5"><input type="url" class="link-input svelte-1o4jdf5" placeholder="https://youtube.com/watch?v=..." aria-label="Paste link"/> <button class="add-btn svelte-1o4jdf5"><!>Add</button></div></div> <div class="empty-state svelte-1o4jdf5"><div class="wip-tape svelte-1o4jdf5">COMING SOON</div> <p class="svelte-1o4jdf5">Your samples will appear here once added.</p></div></div>`),lt=m(`<div class="svc-chip svelte-1o4jdf5"><span class="svelte-1o4jdf5"> </span><span class="svelte-1o4jdf5"> </span><!></div>`),ut=m(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><div class="sec-head svelte-1o4jdf5"><h2 class="sec-title svelte-1o4jdf5">Playlists</h2> <p class="sec-sub svelte-1o4jdf5">Connect Spotify to sync playlists across all services
              automatically</p></div> <div class="spotify-card svelte-1o4jdf5"><div class="sp-icon svelte-1o4jdf5"><svg viewBox="0 0 24 24" fill="currentColor" width="30" height="30" class="svelte-1o4jdf5"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" class="svelte-1o4jdf5"></path></svg></div> <div class="sp-info svelte-1o4jdf5"><h3 class="svelte-1o4jdf5">Connect Spotify</h3> <p class="svelte-1o4jdf5">Import your playlists and sync across services</p></div> <button class="sp-btn svelte-1o4jdf5">Connect <!></button></div> <div class="svc-chips svelte-1o4jdf5"></div> <div class="empty-state mx-auto max-w-[380px] text-center svelte-1o4jdf5"><div class="wip-tape svelte-1o4jdf5">COMING SOON</div> <p class="svelte-1o4jdf5">Connect Spotify to see your playlists, automatically transcribed
              across all services.</p></div></div>`),dt=m(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><div class="sec-head svelte-1o4jdf5"><h2 class="sec-title svelte-1o4jdf5">Radio</h2> <p class="sec-sub svelte-1o4jdf5">Stream live broadcasts, dog shows, and podcast feeds</p></div> <div class="empty-state mx-auto max-w-[380px] text-center svelte-1o4jdf5"><div class="wip-tape svelte-1o4jdf5">COMING SOON</div> <p class="svelte-1o4jdf5">Live radio feeds will appear here once connected.</p></div></div>`),ft=m(`<div class="app-loading-spinner svelte-1o4jdf5" aria-label="Loading..."></div>`),pt=m(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><!></div>`),mt=m(`<div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 animate-pulse svelte-1o4jdf5"><div class="bg-black/75 border border-red-500/30 px-4 py-2 rounded text-[12px] font-mono tracking-widest text-red-500 font-bold uppercase shadow-[0_0_20px_rgba(239,68,68,0.3)] select-none svelte-1o4jdf5">NO SIGNAL</div></div>`),ht=m(`<button> </button>`),gt=m(`<div class="visualizer-container fullscreen cursor-pointer svelte-1o4jdf5"><canvas class="visualizer-canvas svelte-1o4jdf5"></canvas> <!> <div class="visualizer-overlay svelte-1o4jdf5"><div class="flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-lg p-1 border border-white/10 svelte-1o4jdf5"></div></div></div>`),_t=m(`<div class="mp-backdrop svelte-1o4jdf5"><div><header class="panel-header svelte-1o4jdf5"><div class="brand svelte-1o4jdf5"><button class="logo-btn svelte-1o4jdf5" aria-label="Open DOGS Info"><!></button> <h1 class="svelte-1o4jdf5"></h1></div> <button class="close-btn svelte-1o4jdf5" aria-label="Close panel"><!></button></header> <!> <div class="mp-body svelte-1o4jdf5"><!></div> <footer class="mp-footer svelte-1o4jdf5"><div class="mp-status svelte-1o4jdf5"><span class="mp-dot svelte-1o4jdf5"></span><span class="svelte-1o4jdf5">WE ARE DOGS</span></div> <span class="svelte-1o4jdf5">MUSIC</span></footer></div> <!> <canvas class="fader-fx-canvas pointer-events-none svelte-1o4jdf5"></canvas></div>`);function vt(m,T){Se(T,!0);let P=[{id:`songs`,label:`Songs`,icon:ne},{id:`samples`,label:`Samples`,icon:fe},{id:`playlists`,label:`Playlists`,icon:ae},{id:`radio`,label:`Radio`,icon:me},{id:`battle`,label:`Battle`,icon:Ce}],vt=`/img/error_cover.png`;function yt(e){e.target.src.endsWith(vt)||(e.target.src=vt)}let bt=Ae(T,`isClosing`,3,!1),xt=Ae(T,`initialTrackId`,3,null),I=M(`songs`),L=M(`default`),St=M(null);g(()=>{S(I)===`battle`&&!S(St)&&Re(()=>import(`./BattlePanel-CT4yOAjB.js`).then(e=>{O(St,e.default,!0)}),__vite__mapDeps([0,1,2,3,4]))});let R=M(!1),Ct=M(!1),wt=M(!1),Tt=M(null),z=k(()=>F.isPlaying&&!bt()),B=M(!1),Et=M(0),Dt=M(!1),Ot=M(null),V=null,kt=!1,At=M(!1),jt=k(()=>{let e=S(W)?.id||`default`,t=[],n=0;for(let t=0;t<e.length;t++)n=e.charCodeAt(t)+((n<<5)-n);for(let e=0;e<60;e++){let r=Math.abs(Math.sin(n+e))*80+20;t.push(r)}return t});g(()=>{window.innerWidth<=640&&S(B)&&S(Et)===0&&S(R)&&O(R,!1)}),g(()=>{F.isPlaying&&O(At,!0)});let Mt=k(()=>!F.isPlaying&&!S(At)?We.fragmentShader:Ue[S(Et)].fragmentShader);g(()=>{let e=F.analyser;return S(B)&&S(Ot)&&!bt()&&(V=new He(S(Ot),e),V.init(S(Mt)),V.start()),()=>{V&&(V.destroy(),V=null)}}),g(()=>{let e=S(Mt);V&&S(B)&&(V.setPreset(e),V.start())}),g(()=>{S(R)?!history.state?.tracklistOpen&&!kt&&(history.pushState({tracklistOpen:!0},``),kt=!0):kt&&(history.back(),kt=!1)}),De(()=>{kt&&(history.back(),kt=!1)});function Nt(e){!e.state?.tracklistOpen&&S(R)&&(O(R,!1),kt=!1)}function Pt(e){S(wt)&&S(Tt)&&!S(Tt).contains(e.target)&&!e.target.closest(`.vol-toggle-btn`)&&O(wt,!1)}let H=[{id:`hollywood`,title:`HOLLYWOOD`,artist:`YG`,album:`THE GENTLEMEN'S CLUB`,cover:`https://data.wearedogs.net/img/covers/2026/yg.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/yg.jpg`,src:`https://data.wearedogs.net/music/2026/HOLLYWOOD.mp3`,instrumental:`https://data.wearedogs.net/music/2026/HOLLYWOOD-free.mp3`,dateAdded:`2026-06-24T03:00:00-05:00`,year:2026,genre:`Hip-Hop`,attrib:`https://the-gentlemens-club.com/`},{id:`chicago`,title:`Chicago`,artist:`Michael Jackson`,album:`Xscape`,cover:`https://data.wearedogs.net/img/covers/2026/mj.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/mj.jpg`,src:`https://data.wearedogs.net/music/2026/Chicago.mp3`,instrumental:`https://data.wearedogs.net/music/2026/Chicago-free.mp3`,dateAdded:`2026-06-24T03:00:00-05:00`,year:2014,genre:`Pop`},{id:`rain`,title:`Pourin Rain (feat. Skratch Bastid)`,artist:`Zeds Dead`,album:`Return to the Return (of the Spectrum of Intergalactic Happiness)`,cover:`https://data.wearedogs.net/img/covers/2026/zd.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/zd.jpg`,src:`https://data.wearedogs.net/music/2026/Pourin.mp3`,instrumental:``,dateAdded:`2026-07-07T018:12:00-05:00`,year:2026,genre:`Electronic`,attrib:`https://shop.zedsdead.net/`},{id:`denchai`,title:`Den Chai`,artist:`The Buddha-Bar Lounge`,album:`Den Chai`,cover:`https://data.wearedogs.net/img/covers/2026/buddha.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/buddha.png`,src:``,instrumental:`https://data.wearedogs.net/music/2026/DENCHAI.mp3`,dateAdded:`2026-07-07T22:34:00-05:00`,year:2008,genre:`Lounge`,attrib:`https://open.spotify.com/artist/0du3MpnxBOpQEie1IV3u9v?si=2UO722ntTE--Ck_Ji7Go7Q`},{id:`rainbow`,title:`Rainbow in the Dark`,artist:`Das Racist`,album:`Shut Up, Dude`,cover:`https://data.wearedogs.net/img/covers/2026/rainbow.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/rainbow.png`,src:`https://data.wearedogs.net/music/2026/rainbow.mp3`,instrumental:`https://data.wearedogs.net/music/2026/rainbow-free.mp3`,dateAdded:`2026-07-08T16:35:00-05:00`,year:2010,genre:`Hip-Hop`,attrib:`https://dasracist.bandcamp.com/album/shut-up-dude`},{id:`hipsong`,title:`Hip Song`,artist:`Toby Fox / Trevor Alan Gomes`,album:`Deltarune`,cover:`https://data.wearedogs.net/img/covers/2026/deltarune.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/deltarune.png`,src:`https://data.wearedogs.net/music/2026/shop.mp3`,instrumental:`https://data.wearedogs.net/music/2026/shop-free.mp3`,dateAdded:`2026-07-09T01:22:00-05:00`,year:2021,genre:`Video Game`,attrib:`https://deltarune.com/`},{id:`sleepless`,title:`Sleepless`,artist:`deadmau5`,album:`> album title goes here <`,cover:`https://data.wearedogs.net/img/covers/2026/sleepless.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/sleepless.png`,src:``,instrumental:`https://data.wearedogs.net/music/2026/sleepless.mp3`,dateAdded:`2026-07-12T04:22:00-05:00`,year:2026,genre:`Electronic`,attrib:`https://deadmau5.com/`},{id:`skitzo`,title:`Skitzo (feat. Young Thug)`,artist:`Travis Scott`,album:`UTOPIA`,cover:`https://data.wearedogs.net/img/covers/2026/utopia.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/utopia.png`,src:`https://data.wearedogs.net/music/2026/skitzo.mp3`,instrumental:`https://data.wearedogs.net/music/2026/skitzo-free.mp3`,dateAdded:`2026-07-16T01:56:00-05:00`,year:2023,genre:`Hip-Hop`,attrib:`https://shop.travisscott.com/`}];function Ft(e){return e.src?e.src.split(`/`).pop():``}function It(e){if(!e.dateAdded)return`Summer`;let t=new Date(e.dateAdded).getMonth();return t===11||t===0||t===1?`Winter`:t>=2&&t<=4?`Spring`:t>=5&&t<=7?`Summer`:`Fall`}let U=k(()=>{let e=[...H];return S(L)===`artist`?e.sort((e,t)=>e.artist.localeCompare(t.artist)):S(L)===`album`?e.sort((e,t)=>e.album.localeCompare(t.album)):S(L)===`year`?e.sort((e,t)=>(e.year||0)-(t.year||0)):S(L)===`filename`?e.sort((e,t)=>Ft(e).localeCompare(Ft(t))):S(L)===`genre`?e.sort((e,t)=>(e.genre||``).localeCompare(t.genre||``)):S(L)===`season`&&e.sort((e,t)=>It(e).localeCompare(It(t))),e}),W=k(()=>H[F.currentTrackIndex]),Lt=M(0),Rt=M(0),zt=M(0),Bt=M(0),Vt=M(0),Ht=M(0),Ut=M(null),Wt=null;function Gt(e,t){e.stopPropagation();let n=`${window.location.origin}/music/${t.id}`;navigator.clipboard.writeText(n).then(()=>{O(Ut,t.id,!0),Wt&&clearTimeout(Wt),Wt=setTimeout(()=>{O(Ut,null)},2e3)}).catch(e=>{console.error(`Failed to copy share link:`,e)})}De(()=>{Wt&&clearTimeout(Wt)}),r(()=>{if(F.init(H),xt()){let e=H.findIndex(e=>e.id===xt());e!==-1&&F.loadTrack(e,!0)}else if(!F.hasPickedRandomTrack){F.hasPickedRandomTrack=!0;let e=Math.floor(Math.random()*H.length);F.loadTrack(e,!1)}});let G=M(null);function Kt(){let e=document.querySelector(`.track-row[data-track-id="${S(G)}"]`);e&&e.scrollIntoView({block:`nearest`,behavior:`smooth`})}function qt(e){O(G,e.id,!0);let t=H.findIndex(t=>t.id===e.id);F.currentTrackIndex===t&&!F.fetchErrors[e.id]?F.togglePlay():F.loadTrack(t,!0)}function Jt(){window.innerWidth<=640?O(R,!0):O(B,!S(B))}function Yt(){let e=!F.isInstrumental;F.setCrossfade(e)||(Ee(q),S(nn)||(O(nn,!0),setTimeout(()=>{O(nn,!1)},300)),S(q)===5?($(),O(rn,!0),setTimeout(()=>{O(rn,!1)},150)):S(q)===10?$(35):S(q)>5&&S(q)<10?$(8):S(q)>10&&Math.random()<.4&&$(3))}function Xt(e){return!e||isNaN(e)?`0:00`:`${Math.floor(e/60)}:${Math.floor(e%60).toString().padStart(2,`0`)}`}function Zt(e){let t=document.activeElement;if(!(t&&(t.tagName===`INPUT`||t.tagName===`TEXTAREA`||t.isContentEditable))){if(e.shiftKey){if(e.key===`ArrowRight`){e.preventDefault(),O(I,P[(P.findIndex(e=>e.id===S(I))+1)%P.length].id,!0);return}else if(e.key===`ArrowLeft`){e.preventDefault(),O(I,P[(P.findIndex(e=>e.id===S(I))-1+P.length)%P.length].id,!0);return}}if(e.code===`Space`||e.key===` `)S(I)===`songs`&&(e.preventDefault(),F.togglePlay());else if(e.key===`ArrowDown`){if(S(I)===`songs`&&S(U).length>0){e.preventDefault();let t=S(U).findIndex(e=>e.id===S(G));if(t===-1){let e=H[F.currentTrackIndex];t=S(U).findIndex(t=>t.id===e?.id)}let n=(t+1)%S(U).length;O(G,S(U)[n].id,!0),Kt()}}else if(e.key===`ArrowUp`){if(S(I)===`songs`&&S(U).length>0){e.preventDefault();let t=S(U).findIndex(e=>e.id===S(G));if(t===-1){let e=H[F.currentTrackIndex];t=S(U).findIndex(t=>t.id===e?.id)}let n=(t-1+S(U).length)%S(U).length;O(G,S(U)[n].id,!0),Kt()}}else if(e.key===`Enter`&&S(I)===`songs`&&S(G)){e.preventDefault();let t=S(U).find(e=>e.id===S(G));t&&qt(t)}}}let Qt=0,$t=0;function en(e){if(e.target&&(e.target.tagName===`INPUT`||e.target.closest(`button`)||e.target.closest(`.ctrl`))){Qt=0,$t=0;return}Qt=e.touches[0].clientX,$t=e.touches[0].clientY}function tn(e){if(Qt===0||!e.changedTouches||e.changedTouches.length===0)return;let t=e.changedTouches[0].clientX-Qt,n=e.changedTouches[0].clientY-$t;if(Math.abs(t)<=Math.abs(n)||Math.abs(t)<=60)return;let r=P.findIndex(e=>e.id===S(I));r!==-1&&(t<0&&r<P.length-1?O(I,P[r+1].id,!0):t>0&&r>0&&O(I,P[r-1].id,!0))}let K=M(null),q=M(0),nn=M(!1),rn=M(!1),J,Y,X,Z=[],Q=[],an,on=M(!1);g(()=>(S(K)&&cn(),()=>{an&&cancelAnimationFrame(an),window.removeEventListener(`resize`,ln),X&&(X.dispose(),X=null),J=null,Y=null,Z=[],Q=[]})),g(()=>{if(F.currentTrackIndex,S(I),bt(),O(q,0),O(on,!1),J){for(let e of Z)J.remove(e.mesh);for(let e of Q)J.remove(e.mesh)}Z=[],Q=[]});function sn(){let e=document.querySelector(`.dj-fader-knob`);if(!e)return{x:window.innerWidth/2,y:window.innerHeight/2};let t=e.getBoundingClientRect();return{x:t.left+t.width/2,y:window.innerHeight-(t.top+t.height/2)}}function cn(){if(!S(K))return;let e=window.innerWidth,t=window.innerHeight;S(K).width=e,S(K).height=t,J=new te,Y=new re(0,e,t,0,-1,1),X=new we({canvas:S(K),alpha:!0,antialias:!0}),X.setSize(e,t,!1),X.setPixelRatio(Math.min(window.devicePixelRatio,2)),window.addEventListener(`resize`,ln),un()}function ln(){if(!S(K)||!X||!Y)return;let e=window.innerWidth,t=window.innerHeight;S(K).width=e,S(K).height=t,X.setSize(e,t,!1),Y.right=e,Y.top=t,Y.updateProjectionMatrix()}function un(){if(an=requestAnimationFrame(un),!(!J||!Y||!X||!S(K))){if(S(q)>=10&&(O(on,!0),Math.random()<.22)){let e=sn();dn(e.x,e.y)}for(let e=Z.length-1;e>=0;e--){let t=Z[e];t.x+=t.vx,t.y+=t.vy,t.vy+=t.ay,t.life-=t.decay,t.mesh.position.set(t.x,t.y,0),t.mesh.material.opacity=t.life,t.life<=0&&(J.remove(t.mesh),t.mesh.geometry.dispose(),t.mesh.material.dispose(),Z.splice(e,1))}for(let e=Q.length-1;e>=0;e--){let t=Q[e];t.x+=t.vx,t.y+=t.vy,t.life-=t.decay;let n=t.startScale+(1-t.life)*88;t.mesh.scale.set(n,n,1),t.mesh.position.set(t.x,t.y,0),t.mesh.material.opacity=t.life*.16,t.life<=0&&(J.remove(t.mesh),t.mesh.geometry.dispose(),t.mesh.material.dispose(),Q.splice(e,1))}X.render(J,Y)}}function dn(e,n){if(!J)return;let r=new oe(5,8),i=.85+Math.random()*.12,a=new t(r,new E({color:new o(i,i,i*1.01),transparent:!0,opacity:.06,blending:1}));a.position.set(e,n,0),J.add(a),Q.push({mesh:a,x:e,y:n,vx:(Math.random()-.5)*.55+Math.sin(Date.now()*.001)*.22,vy:Math.random()*.7+1.25,startScale:1,life:1,decay:6e-4+Math.random()*4e-4})}function $(e=25){if(!J||!S(K))return;let n=sn(),r=n.x,i=n.y;for(let n=0;n<e;n++){let e=new t(new oe(1.3,4),new E({color:new o(Math.random()<.4?16711765:16755200),transparent:!0,opacity:1,blending:2}));e.position.set(r,i,0),J.add(e);let n=Math.random()*Math.PI*2,a=Math.random()*4+2;Z.push({mesh:e,x:r,y:i,vx:Math.cos(n)*a,vy:Math.sin(n)*a,ay:-.15,life:1,decay:.02+Math.random()*.02})}}var fn=_t();ue(`keydown`,he,Zt),ue(`popstate`,he,Nt),ue(`click`,he,Pt);var pn=b(fn);let mn;var hn=b(pn),gn=b(hn),_n=b(gn);ze(b(_n),{size:`panel`}),D(_n);var vn=C(_n,2);vn.textContent=`MUSIC`,D(gn);var yn=C(gn,2);Ne(b(yn),{size:20}),D(yn),D(hn);var bn=C(hn,2);Ve(bn,{get tabs(){return P},get activeTab(){return S(I)},set activeTab(e){O(I,e,!0)}});var xn=C(bn,2),Sn=b(xn),Cn=t=>{var n=st(),r=b(n);let a;var o=b(r);let s;var d=b(o),m=b(d),g=e=>{var t=Ke(),n=b(t);Pe(n,e=>O(Ot,e),()=>S(Ot));var r=C(n,2),a=e=>{y(e,Ge())};v(r,e=>{!F.isPlaying&&!S(At)&&e(a)});var o=C(r,2);xe(b(o),{size:16,class:`text-white/70`}),D(o),D(t),i(`click`,t,()=>{O(Dt,!0)}),y(e,t)},te=e=>{var t=qe();xe(b(t),{size:16,class:`text-white/20`}),D(t),y(e,t)},ne=t=>{var n=l(),r=e(n),a=e=>{var t=Je(),n=b(t);let r;var a=C(b(n),8),o=b(a);let s;D(a),A(2),D(n);var c=C(n,2);let l;D(t),j(()=>{r=N(n,1,`vinyl-record svelte-1o4jdf5`,null,r,{spinning:S(z)}),w(o,`src`,F.fetchErrors[S(W).id]||!S(W).cover?vt:S(W).cover),w(o,`alt`,S(W).album),s=N(o,1,`record-art svelte-1o4jdf5`,null,s,{loaded:S(Ct)}),l=N(c,1,`tonearm svelte-1o4jdf5`,null,l,{playing:S(z)})}),i(`click`,t,Jt),ue(`load`,o,()=>O(Ct,!0)),ue(`error`,o,yt),p(o),y(e,t)},o=e=>{let t=k(()=>F.duration>0?(1-F.currentTime/F.duration)*.45+.25:.48),n=k(()=>F.duration>0?F.currentTime/F.duration*.45+.25:.48);var r=Ye(),a=b(r),o=b(a),s=b(o),c=b(s,!0);D(s),A(2),D(o);var l=C(o,2),u=b(l);let d;var f=C(u,2);let p;var m=C(f,2);let h;var g=C(m,2);let ee;D(l),D(a),D(r),j(()=>{_(c,S(W).title),d=N(u,1,`spindle-left bg-zinc-900 svelte-1o4jdf5`,null,d,{spinning:S(z)}),p=N(f,1,`tape-roll-left bg-amber-950/70 svelte-1o4jdf5`,null,p,{spinning:S(z)}),Fe(f,`width: ${S(t)*46}px; height: ${S(t)*46}px;`),h=N(m,1,`spindle-right bg-zinc-900 svelte-1o4jdf5`,null,h,{spinning:S(z)}),ee=N(g,1,`tape-roll-right bg-amber-950/70 svelte-1o4jdf5`,null,ee,{spinning:S(z)}),Fe(g,`width: ${S(n)*46}px; height: ${S(n)*46}px;`)}),i(`click`,r,Jt),y(e,r)},s=e=>{var t=Xe(),n=b(t),r=C(b(n),4),a=C(b(r),4),o=b(a),s=b(o,!0);D(o);var c=C(o,2),l=b(c,!0);D(c),D(a),D(r);var u=C(r,2),d=b(u);let f;var p=C(d,2),m=b(p);let h;D(p),D(u);var g=C(u,2);let ee;D(n),D(t),j(()=>{_(s,S(W).title),_(l,S(W).artist||`WEAREDOGS`),f=N(d,1,`floppy-shutter-slider bg-zinc-400 svelte-1o4jdf5`,null,f,{open:S(z)}),h=N(m,1,`floppy-magnetic-disc bg-zinc-900 svelte-1o4jdf5`,null,h,{spinning:S(z)}),ee=N(g,1,`floppy-drive-led svelte-1o4jdf5`,null,ee,{active:S(z)})}),i(`click`,t,Jt),y(e,t)},u=e=>{var t=Qe(),n=b(t),r=b(n);let a;var o=C(r,2),s=b(o),l=b(s);let u;var d=C(l,2);let f;D(s);var p=C(s,2),m=b(p);let h;D(p);var g=C(p,2);se(g,20,()=>Array(10),c,(e,t,n)=>{var r=Ze();let i;j(e=>i=N(r,1,`comb-tooth svelte-1o4jdf5`,null,i,e),[()=>({vibrating:S(z)&&n%3==Math.floor(F.currentTime*4)%3})]),y(e,r)}),D(g),D(o),D(n),D(t),j(()=>{a=N(r,1,`music-box-key svelte-1o4jdf5`,null,a,{spinning:S(z)}),u=N(l,1,`music-box-gear gear-1 svelte-1o4jdf5`,null,u,{spinning:S(z)}),f=N(d,1,`music-box-gear gear-2 svelte-1o4jdf5`,null,f,{spinning:S(z)}),h=N(m,1,`music-box-drum bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 svelte-1o4jdf5`,null,h,{spinning:S(z)})}),i(`click`,t,Jt),y(e,t)};v(r,e=>{Be.musicDeckModel===`vinyl`?e(a):Be.musicDeckModel===`cassette`?e(o,1):Be.musicDeckModel===`floppy`?e(s,2):Be.musicDeckModel===`musicbox`&&e(u,3)}),y(t,n)};v(m,e=>{S(B)&&!S(Dt)?e(g):S(B)&&S(Dt)?e(te,1):e(ne,-1)}),D(d);var re=C(d,2),ae=b(re),oe=b(ae),me=b(oe),he=e=>{Me(e,{size:12,class:`text-[#22c55e]`})},ye=e=>{ce(e,{size:12})};v(me,e=>{S(Ut)===S(W).id?e(he):e(ye,-1)}),D(oe),D(ae);var Se=C(ae,2);let Ce;var we=b(Se);let T;var Ee=b(we,!0);D(we),D(Se);var E=C(Se,2);let De;var Ae=b(E);let M;var Ne=b(Ae,!0);D(Ae),D(E);var P=C(E,2);let Re;var ze=b(P);let Ve;var He=b(ze,!0);D(ze),D(P),D(re),D(o);var We=C(o,2),ct=b(We),lt=b(ct),ut=b(lt,!0);D(lt);var dt=C(lt,2),ft=b(dt);se(ft,21,()=>S(jt),c,(e,t,n)=>{let r=k(()=>F.duration>0?F.currentTime/F.duration:0),i=k(()=>n/60);var a=$e();let o;j(()=>{o=N(a,1,`waveform-bar transition-colors duration-100 rounded-t svelte-1o4jdf5`,null,o,{active:S(i)<=S(r)}),Fe(a,`height: ${S(t)??``}%; width: 3px;`)}),y(e,a)}),D(ft);var pt=C(ft,2);be(pt),D(dt);var mt=C(dt,2),ht=b(mt,!0);D(mt),D(ct);var gt=C(ct,2),_t=b(gt);let bt;Ie(b(_t),{size:15}),D(_t);var xt=C(_t,2);_e(b(xt),{size:19}),D(xt);var I=C(xt,2);let St;var V=b(I),kt=e=>{je(e,{size:22})},Mt=e=>{y(e,et())},Nt=e=>{le(e,{size:22,fill:`currentColor`})},Pt=e=>{de(e,{size:22,fill:`currentColor`})};v(V,e=>{F.fetchErrors[S(W).id]?e(kt):F.isLoading?e(Mt,1):F.isPlaying?e(Nt,2):e(Pt,-1)}),D(I);var Ft=C(I,2);Le(b(Ft),{size:19}),D(Ft);var It=C(Ft,2);let Wt;var Kt=b(It),Zt=e=>{u(e,{size:15})},Qt=e=>{ie(e,{size:15})};v(Kt,e=>{F.repeatMode===2?e(Zt):e(Qt,-1)}),D(It),D(gt);var $t=C(gt,2),en=b($t);let tn;var K=b(en);let J;fe(b(K),{size:12}),A(2),D(K);var Y=C(K,2),X=b(Y);let Z;D(Y);var Q=C(Y,2);let an;ge(b(Q),{size:12}),A(2),D(Q),D(en),D($t);var on=C($t,2),sn=b(on),cn=e=>{var t=tt(),n=b(t),r=b(n),a=e=>{h(e,{size:12,class:`text-red-400`})},o=e=>{pe(e,{size:12})};v(r,e=>{F.isMuted||F.volume===0?e(a):e(o,-1)}),D(n);var s=C(n,2);be(s);var c=C(s,2),l=b(c);D(c),D(t),Pe(t,e=>O(Tt,e),()=>S(Tt)),j(e=>{Oe(s,F.volume),_(l,`${e??``}%`)},[()=>Math.round(F.volume*100)]),i(`click`,n,()=>F.toggleMute()),i(`input`,s,e=>F.setVolume(parseFloat(e.target.value))),y(e,t)};v(sn,e=>{S(wt)&&e(cn)});var ln=C(sn,2),un=b(ln);let dn;ee(b(un),{size:13}),D(un);var $=C(un,2),fn=b($,!0);D($),D(ln);var pn=C(ln,2),mn=b(pn),hn=b(mn),gn=e=>{h(e,{size:13,class:`text-red-400`})},_n=e=>{pe(e,{size:13})};v(hn,e=>{F.isMuted||F.volume===0?e(gn):e(_n,-1)}),D(mn),D(pn),D(on),D(We),D(r);var vn=C(r,2);let yn;var bn=b(vn),xn=C(b(bn),2);D(bn);var Sn=C(bn,2),Cn=b(Sn),wn=b(Cn);ke(wn,{size:13});var Tn=C(wn,3),En=b(Tn,!0);D(Tn),D(Cn);var Dn=C(Cn,2),On=C(b(Dn),2),kn=b(On);kn.value=kn.__value=`default`;var An=C(kn);An.value=An.__value=`artist`;var jn=C(An);jn.value=jn.__value=`album`;var Mn=C(jn);Mn.value=Mn.__value=`year`;var Nn=C(Mn);Nn.value=Nn.__value=`filename`;var Pn=C(Nn);Pn.value=Pn.__value=`genre`;var Fn=C(Pn);Fn.value=Fn.__value=`season`,D(On),D(Dn),D(Sn);var In=C(Sn,2);se(In,21,()=>S(U),c,(e,t,n)=>{var r=ot();let a;var o=b(r),s=b(o),c=e=>{y(e,nt())},l=e=>{var t=rt();t.textContent=n+1,y(e,t)};v(s,e=>{H[F.currentTrackIndex].id===S(t).id&&F.isPlaying?e(c):e(l,-1)}),D(o);var u=C(o,2),d=C(u,2),f=b(d),m=b(f);let h;var g=b(m,!0);D(m);var ee=C(m,2),te=e=>{var t=it();je(b(t),{size:10}),A(),D(t),y(e,t)};v(ee,e=>{F.fetchErrors[S(t).id]&&e(te)}),D(f);var ne=C(f,2),re=b(ne);D(ne),D(d);var ie=C(d,2),ae=b(ie),oe=e=>{var n=at(),r=b(n);D(n),j(()=>w(r,`href`,S(t).attrib)),i(`click`,r,e=>e.stopPropagation()),y(e,n)};v(ae,e=>{S(t).attrib&&e(oe)});var x=C(ae,2),se=b(x),le=e=>{Me(e,{size:12,class:`text-[#22c55e]`})},de=e=>{ce(e,{size:12})};v(se,e=>{S(Ut)===S(t).id?e(le):e(de,-1)}),D(x),D(ie),D(r),j(()=>{a=N(r,1,`track-row svelte-1o4jdf5`,null,a,{active:H[F.currentTrackIndex].id===S(t).id,"kb-focused":S(G)===S(t).id,"fetch-error":F.fetchErrors[S(t).id]}),w(r,`data-track-id`,S(t).id),w(u,`src`,F.fetchErrors[S(t).id]||!S(t).cover?vt:S(t).cover),w(u,`alt`,S(t).album),h=N(m,1,`tr-title svelte-1o4jdf5`,null,h,{"line-through":F.fetchErrors[S(t).id],"opacity-50":F.fetchErrors[S(t).id]}),_(g,S(t).title),_(re,`${S(t).artist??``} · ${S(t).album??``} (${(S(t).year||``)??``})`)}),i(`click`,r,()=>qt(S(t))),ue(`error`,u,yt),p(u),i(`click`,x,e=>Gt(e,S(t))),y(e,r)}),D(In),D(vn),D(n),j((e,t)=>{a=N(r,1,`player-side svelte-1o4jdf5`,null,a,{"tracklist-open":S(R)}),s=N(o,1,`player-top-block transition-all duration-300 ease-in-out svelte-1o4jdf5`,null,s,{"opacity-0":S(R),"scale-95":S(R),"pointer-events-none":S(R)}),Ce=N(Se,1,`scroll-container svelte-1o4jdf5`,null,Ce,{overflowing:S(Rt)>S(Lt)}),Fe(Se,`--scroll-dist: -${S(Rt)-S(Lt)}px`),T=N(we,1,`track-title scroll-text svelte-1o4jdf5`,null,T,{"animate-scroll":S(Rt)>S(Lt)}),_(Ee,S(W).title),De=N(E,1,`scroll-container svelte-1o4jdf5`,null,De,{overflowing:S(Bt)>S(zt)}),Fe(E,`--scroll-dist: -${S(Bt)-S(zt)}px`),M=N(Ae,1,`track-artist scroll-text svelte-1o4jdf5`,null,M,{"animate-scroll":S(Bt)>S(zt)}),_(Ne,S(W).artist),Re=N(P,1,`scroll-container svelte-1o4jdf5`,null,Re,{overflowing:S(Ht)>S(Vt)}),Fe(P,`--scroll-dist: -${S(Ht)-S(Vt)}px`),Ve=N(ze,1,`track-album scroll-text svelte-1o4jdf5`,null,Ve,{"animate-scroll":S(Ht)>S(Vt)}),_(He,S(W).album),_(ut,e),w(pt,`max`,F.duration||100),Oe(pt,F.currentTime),_(ht,t),bt=N(_t,1,`ctrl ctrl-sm svelte-1o4jdf5`,null,bt,{"active-ctrl":F.isShuffled}),St=N(I,1,`ctrl ctrl-play svelte-1o4jdf5`,null,St,{"ctrl-error":F.fetchErrors[S(W).id]}),w(I,`aria-label`,F.isPlaying?`Pause`:`Play`),Wt=N(It,1,`ctrl ctrl-sm svelte-1o4jdf5`,null,Wt,{"active-ctrl":F.repeatMode>0}),tn=N(en,1,`dj-crossfader svelte-1o4jdf5`,null,tn,{"fader-flash":S(rn),"fader-fried":S(q)>=10}),J=N(K,1,`fader-label left-label flex items-center gap-1 svelte-1o4jdf5`,null,J,{active:!F.isInstrumental}),Z=N(X,1,`dj-fader-knob svelte-1o4jdf5`,null,Z,{right:F.isInstrumental,"knob-jiggle":S(nn),fried:S(q)>=10}),an=N(Q,1,`fader-label right-label flex items-center gap-1 svelte-1o4jdf5`,null,an,{active:F.isInstrumental}),dn=N(un,1,`ctrl ctrl-xs svelte-1o4jdf5`,null,dn,{"active-ctrl":S(B)}),N($,1,`w-[90px] h-[20px] flex items-center justify-center rounded text-[9px] font-bold transition-all font-mono uppercase tracking-wider select-none cursor-pointer
                      ${S(B)?`bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/25 active:scale-95`:`bg-transparent border border-white/5 text-white/20 hover:text-white/40 hover:border-white/10`}`,`svelte-1o4jdf5`),w($,`title`,S(B)?`Click to cycle presets`:`Click to enable visualizer`),_(fn,Ue[S(Et)].name),yn=N(vn,1,`tracklist-side svelte-1o4jdf5`,null,yn,{"show-mobile":S(R)}),_(En,H.length)},[()=>Xt(F.currentTime),()=>Xt(F.duration)]),i(`click`,oe,e=>Gt(e,S(W))),ve(we,`clientWidth`,e=>O(Rt,e)),ve(Se,`clientWidth`,e=>O(Lt,e)),ve(Ae,`clientWidth`,e=>O(Bt,e)),ve(E,`clientWidth`,e=>O(zt,e)),ve(ze,`clientWidth`,e=>O(Ht,e)),ve(P,`clientWidth`,e=>O(Vt,e)),i(`input`,pt,e=>{F.seek(parseFloat(e.target.value))}),i(`change`,pt,e=>{F.play(parseFloat(e.target.value))}),i(`click`,_t,()=>F.isShuffled=!F.isShuffled),i(`click`,xt,()=>F.prevTrack()),i(`click`,I,()=>F.togglePlay()),i(`click`,Ft,()=>F.nextTrack()),i(`click`,It,()=>{F.repeatMode=(F.repeatMode+1)%3}),i(`click`,en,Yt),i(`click`,un,()=>{O(B,!S(B))}),i(`click`,$,()=>{S(B)?O(Et,(S(Et)+1)%Ue.length):O(B,!0)}),i(`click`,mn,()=>{O(wt,!S(wt))}),i(`click`,xn,()=>{O(R,!1)}),Te(On,()=>S(L),e=>O(L,e)),x(1,n,()=>f,()=>({duration:120,delay:120})),x(2,n,()=>f,()=>({duration:120})),y(t,n)},wn=e=>{var t=ct(),n=C(b(t),2),r=b(n);fe(r,{size:36});var i=C(r,6),o=C(b(i),2);a(b(o),{size:15}),A(),D(o),D(i),D(n),A(2),D(t),x(1,t,()=>f,()=>({duration:120,delay:120})),x(2,t,()=>f,()=>({duration:120})),y(e,t)},Tn=e=>{var t=ut(),r=C(b(t),2),i=C(b(r),4);d(C(b(i)),{size:15}),D(i),D(r);var a=C(r,2);se(a,20,()=>[{name:`Apple Music`,color:`#fc3c44`,icon:`🎵`},{name:`YouTube Music`,color:`#ff0000`,icon:`▶`},{name:`Amazon Music`,color:`#00a8e0`,icon:`♪`},{name:`Tidal`,color:`#00d4f5`,icon:`〰`}],c,(e,t)=>{var r=lt(),i=b(r),a=b(i,!0);D(i);var o=C(i),s=b(o,!0);D(o),n(C(o),{size:11}),D(r),j(()=>{Fe(r,`--sc:${t.color??``}`),_(a,t.icon),_(s,t.name)}),y(e,r)}),D(a),A(2),D(t),x(1,t,()=>f,()=>({duration:120,delay:120})),x(2,t,()=>f,()=>({duration:120})),y(e,t)},En=e=>{var t=dt();x(1,t,()=>f,()=>({duration:120,delay:120})),x(2,t,()=>f,()=>({duration:120})),y(e,t)},Dn=t=>{var n=pt(),r=b(n),i=t=>{let n=k(()=>S(St));var r=l();s(e(r),()=>S(n),(e,t)=>{t(e,{get audioCore(){return F}})}),y(t,r)},a=e=>{y(e,ft())};v(r,e=>{S(St)?e(i):e(a,-1)}),D(n),x(1,n,()=>f,()=>({duration:120,delay:120})),x(2,n,()=>f,()=>({duration:120})),y(t,n)};v(Sn,e=>{S(I)===`songs`?e(Cn):S(I)===`samples`?e(wn,1):S(I)===`playlists`?e(Tn,2):S(I)===`radio`?e(En,3):S(I)===`battle`&&e(Dn,4)}),D(xn),A(2),D(pn);var On=C(pn,2),kn=e=>{var t=gt(),n=b(t);Pe(n,e=>O(Ot,e),()=>S(Ot));var r=C(n,2),a=e=>{y(e,mt())};v(r,e=>{!F.isPlaying&&!S(At)&&e(a)});var o=C(r,2),s=b(o);se(s,21,()=>Ue,c,(e,t,n)=>{var r=ht(),a=b(r,!0);D(r),j(()=>{N(r,1,`px-2 py-1 rounded text-[9px] font-bold transition-all uppercase tracking-wider font-mono
                ${S(Et)===n?`bg-purple-600 text-white`:`text-white/40 hover:text-white/80`}`,`svelte-1o4jdf5`),_(a,S(t).name)}),i(`click`,r,()=>O(Et,n,!0)),y(e,r)}),D(s),D(o),D(t),i(`click`,t,e=>{e.stopPropagation(),O(Dt,!1)}),i(`click`,o,e=>e.stopPropagation()),y(e,t)};v(On,e=>{S(B)&&S(Dt)&&e(kn)}),Pe(C(On,2),e=>O(K,e),()=>S(K)),D(fn),j(()=>mn=N(pn,1,`mp-container svelte-1o4jdf5`,null,mn,{closing:bt(),"theme-inst":F.isInstrumental})),i(`click`,fn,function(...e){T.onClose?.apply(this,e)}),i(`click`,pn,e=>e.stopPropagation()),i(`click`,_n,()=>{F.isPlaying||window.dispatchEvent(new CustomEvent(`open-info-panel`))}),i(`click`,yn,function(...e){T.onClose?.apply(this,e)}),i(`touchstart`,xn,en,void 0,!0),i(`touchend`,xn,tn),y(m,fn),ye()}P([`click`,`touchstart`,`touchend`,`input`,`change`]);export{vt as default};