const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/BattlePanel-BECXB5Qn.js","assets/vendor-a-eVwjvB.js","assets/rolldown-runtime-CMxvf4Kt.js","assets/vendor-Dl9nCA7L.css","assets/BattlePanel-B1S5D9Lq.css"])))=>i.map(i=>d[i]);
import{A as e,Br as t,Bt as n,C as r,Ci as i,Et as a,Fr as o,Gr as s,Gt as c,H as l,Hr as u,Ht as d,Ir as f,It as p,J as m,Jr as h,K as g,Kr as _,L as v,Ln as ee,Lt as te,Mr as ne,Or as y,P as re,Pn as ie,Pr as b,Qt as ae,S as oe,Si as se,St as ce,Ti as x,Tr as S,Ut as le,Vr as ue,Y as de,Yn as fe,Yr as C,Zn as pe,_r as me,ai as he,bn as ge,br as _e,bt as ve,ci as w,cn as ye,fi as T,fr as be,g as xe,gi as E,j as Se,jr as Ce,kr as we,mi as Te,ni as D,nn as Ee,oi as O,pi as k,pr as De,pt as Oe,qr as ke,si as Ae,sr as je,st as Me,ti as A,tr as Ne,ur as Pe,vr as j,wi as M,wr as Fe,xi as Ie,xr as Le,xt as Re,zr as N}from"./vendor-a-eVwjvB.js";import{t as ze}from"./index-Ddkr8J7s.js";import{t as P}from"./AudioCore.svelte-DFuI3EBi.js";import{t as Be}from"./DogsLogo-CrnVwqpK.js";import{t as Ve}from"./settingsManager.svelte-DCY71nfj.js";import{t as He}from"./SwipeTabNav-c_iabOWa.js";var Ue=class{constructor(e,t){x(this,`canvas`,null),x(this,`gl`,null),x(this,`analyser`,null),x(this,`program`,null),x(this,`animationFrameId`,null),x(this,`startTime`,0),x(this,`vertexBuffer`,null),x(this,`audioTexture`,null),x(this,`uniforms`,{}),x(this,`frequencyBuffer`,null),this.canvas=e,this.analyser=t,this.frequencyBuffer=new Uint8Array(t?t.frequencyBinCount:128),this.gl=e.getContext(`webgl`)||e.getContext(`experimental-webgl`),this.gl||console.error(`WebGL not supported by this browser.`)}init(e){if(!this.gl)return;let t=this.gl;this.cleanupProgram();let n=this.compileShader(t.VERTEX_SHADER,`
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
  `},Ke=u(`<div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 animate-pulse svelte-1o4jdf5"><div class="bg-black/75 border border-red-500/30 px-3 py-1.5 rounded text-[10px] font-mono tracking-widest text-red-500 font-bold uppercase shadow-[0_0_15px_rgba(239,68,68,0.25)] select-none svelte-1o4jdf5">NO SIGNAL</div></div>`),qe=u(`<div class="visualizer-container cursor-pointer svelte-1o4jdf5"><canvas class="visualizer-canvas svelte-1o4jdf5"></canvas> <!> <div class="visualizer-hover-overlay svelte-1o4jdf5"><!></div></div>`),Je=u(`<div class="visualizer-container bg-[#050508]/40 border border-white/5 flex items-center justify-center svelte-1o4jdf5"><!></div>`),Ye=u(`<div class="vinyl-record-clicker cursor-pointer w-full h-full svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div><div class="groove g1 svelte-1o4jdf5"></div> <div class="groove g2 svelte-1o4jdf5"></div> <div class="groove g3 svelte-1o4jdf5"></div> <div class="groove g4 svelte-1o4jdf5"></div> <div class="record-label svelte-1o4jdf5"><img loading="lazy"/></div> <div class="spindle svelte-1o4jdf5"></div></div> <div></div></div>`),Xe=u(`<div class="cassette-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="cassette-tape svelte-1o4jdf5"><div class="cassette-label bg-gradient-to-r from-purple-800 to-pink-700 svelte-1o4jdf5"><span class="cassette-track-title svelte-1o4jdf5"> </span> <span class="cassette-brand svelte-1o4jdf5">WEAREDOGS AUDIO</span></div> <div class="cassette-window bg-zinc-950/80 svelte-1o4jdf5"><div></div> <div></div> <div></div> <div></div></div></div></div>`),Ze=u(`<div class="floppy-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="floppy-disk svelte-1o4jdf5"><div class="floppy-corner svelte-1o4jdf5"></div> <div class="floppy-write-protect svelte-1o4jdf5"></div> <div class="floppy-label bg-slate-100 text-slate-900 svelte-1o4jdf5"><div class="floppy-label-stripe bg-red-600 svelte-1o4jdf5"></div> <div class="floppy-label-stripe-blue bg-blue-600 svelte-1o4jdf5"></div> <div class="floppy-label-content svelte-1o4jdf5"><div class="floppy-song truncate font-mono svelte-1o4jdf5"> </div> <div class="floppy-artist truncate font-mono svelte-1o4jdf5"> </div></div></div> <div class="floppy-shutter-door bg-zinc-700 svelte-1o4jdf5"><div></div> <div class="floppy-shutter-opening bg-zinc-950 svelte-1o4jdf5"><div></div></div></div> <div></div></div></div>`),Qe=u(`<div></div>`),$e=u(`<div class="musicbox-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="music-box svelte-1o4jdf5"><div></div> <div class="music-box-interior border border-amber-900/40 svelte-1o4jdf5"><div class="music-box-gears svelte-1o4jdf5"><div></div> <div></div></div> <div class="music-box-drum-wrap svelte-1o4jdf5"><div><div class="music-box-pins svelte-1o4jdf5"><div class="pin pin-1 svelte-1o4jdf5"></div> <div class="pin pin-2 svelte-1o4jdf5"></div> <div class="pin pin-3 svelte-1o4jdf5"></div> <div class="pin pin-4 svelte-1o4jdf5"></div> <div class="pin pin-5 svelte-1o4jdf5"></div> <div class="pin pin-6 svelte-1o4jdf5"></div></div></div></div> <div class="music-box-comb svelte-1o4jdf5"></div></div></div></div>`),et=u(`<span></span>`),tt=u(`<div class="spin-ring svelte-1o4jdf5"></div>`),nt=u(`<div class="volume-popover svelte-1o4jdf5"><button class="ctrl ctrl-xs mr-2 border border-white/10 rounded-full p-1 hover:bg-white/10 svelte-1o4jdf5" aria-label="Mute"><!></button> <input type="range" class="vol-slider-pop svelte-1o4jdf5" min="0" max="1" step="0.01" aria-label="Volume"/> <span class="text-[10px] font-bold text-white/60 min-w-[28px] text-right font-mono select-none svelte-1o4jdf5"> </span></div>`),rt=u(`<div class="eq svelte-1o4jdf5"><div class="eq-b svelte-1o4jdf5"></div> <div class="eq-b svelte-1o4jdf5"></div> <div class="eq-b svelte-1o4jdf5"></div></div>`),it=u(`<span class="svelte-1o4jdf5"></span>`),at=u(`<span class="text-amber-400 flex items-center gap-1 text-[9px] font-bold tracking-wider uppercase bg-amber-500/10 px-1.5 py-0.5 rounded flex-shrink-0 svelte-1o4jdf5" title="Failed to fetch music source from remote database"><!> Error Fetching</span>`),ot=u(`<span class="inst-chip-link svelte-1o4jdf5"><a target="_blank" class="svelte-1o4jdf5">i</a></span>`),st=u(`<div><div class="tr-num svelte-1o4jdf5"><!></div> <img loading="lazy" class="tr-art svelte-1o4jdf5"/> <div class="tr-info svelte-1o4jdf5"><div class="flex items-center gap-1.5 min-w-0 svelte-1o4jdf5"><span> </span> <!></div> <span class="tr-meta svelte-1o4jdf5"> </span></div> <div class="flex items-center gap-2 flex-shrink-0 svelte-1o4jdf5"><!>  <button class="tr-share-btn svelte-1o4jdf5" title="Copy track link" aria-label="Share track"><!></button></div></div>`),ct=u(`<div class="songs-layout svelte-1o4jdf5"><div><div><div class="vinyl-wrapper relative overflow-hidden svelte-1o4jdf5"><!></div> <div class="track-info mt-2 svelte-1o4jdf5"><div class="flex items-center justify-center mb-1.5 svelte-1o4jdf5"><button class="player-share-btn svelte-1o4jdf5" title="Copy track link" aria-label="Share track"><!></button></div> <div><h2> </h2></div> <div><p> </p></div> <div><p> </p></div></div></div> <div class="player-controls-block svelte-1o4jdf5"><div class="progress-row svelte-1o4jdf5"><span class="ptime svelte-1o4jdf5"> </span> <div class="progress-wrap waveform-slider-wrap relative h-9 flex items-end svelte-1o4jdf5"><div class="waveform-bars flex items-end justify-between absolute inset-0 pointer-events-none px-1 h-full svelte-1o4jdf5"></div> <input type="range" class="seek-input absolute inset-0 opacity-0 cursor-pointer w-full h-full svelte-1o4jdf5" min="0" step="0.1" aria-label="Seek"/></div> <span class="ptime svelte-1o4jdf5"> </span></div> <div class="controls-row svelte-1o4jdf5"><button aria-label="Shuffle"><!></button> <button class="ctrl ctrl-md svelte-1o4jdf5" aria-label="Previous"><!></button> <button><!></button> <button class="ctrl ctrl-md svelte-1o4jdf5" aria-label="Next"><!></button> <button aria-label="Repeat"><!></button></div> <div class="w-full flex flex-col items-center gap-1.5 mt-2 px-1 svelte-1o4jdf5"><div><span><!> <span class="svelte-1o4jdf5">VOCAL</span></span> <div class="dj-fader-slot relative svelte-1o4jdf5"><div></div></div> <span><!> <span class="svelte-1o4jdf5">INST</span></span></div></div> <div class="relative flex justify-center items-center gap-3 mt-2 w-full svelte-1o4jdf5"><!> <div class="flex items-center gap-1.5 svelte-1o4jdf5"><button aria-label="Toggle Visualizer"><!></button> <button> </button></div> <div class="relative svelte-1o4jdf5"><button class="ctrl ctrl-xs vol-toggle-btn svelte-1o4jdf5" aria-label="Toggle volume slider"><!></button></div></div></div></div> <div><div class="mobile-close-bar hidden py-2 px-4 border-b border-white/5 flex items-center justify-between svelte-1o4jdf5"><span class="text-xs font-bold text-white/50 svelte-1o4jdf5">Track Library</span> <button class="px-3 py-1 bg-white/5 text-white/75 rounded-lg text-xs font-bold svelte-1o4jdf5">Back to player</button></div> <div class="tl-header flex justify-between items-center gap-3 svelte-1o4jdf5"><div class="flex items-center gap-2 svelte-1o4jdf5"><!><span class="svelte-1o4jdf5">TRACKS</span> <span class="tl-count svelte-1o4jdf5"> </span></div> <div class="flex items-center gap-1.5 ml-auto svelte-1o4jdf5"><span class="text-[9px] text-white/30 font-bold font-sans svelte-1o4jdf5">SORT BY:</span> <select class="bg-black/40 border border-white/10 rounded px-1.5 py-0.5 text-[10px] font-bold text-white/60 outline-none cursor-pointer hover:border-white/20 transition-all font-sans svelte-1o4jdf5"><option class="svelte-1o4jdf5">DEFAULT</option><option class="svelte-1o4jdf5">ARTIST</option><option class="svelte-1o4jdf5">ALBUM</option><option class="svelte-1o4jdf5">YEAR</option><option class="svelte-1o4jdf5">FILENAME</option><option class="svelte-1o4jdf5">GENRE</option><option class="svelte-1o4jdf5">SEASON</option></select></div></div> <div class="tracklist scroll-y svelte-1o4jdf5"></div></div></div>`),lt=u(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><div class="sec-head svelte-1o4jdf5"><h2 class="sec-title svelte-1o4jdf5">Samples</h2> <p class="sec-sub svelte-1o4jdf5">MP3 · MP4 · WAV · OGG · YouTube · Instagram · TikTok</p></div> <div class="drop-zone svelte-1o4jdf5"><!> <p class="drop-title svelte-1o4jdf5">Drop files or paste a link</p> <p class="drop-sub svelte-1o4jdf5">Supports all major audio, video, and streaming links</p> <div class="link-row svelte-1o4jdf5"><input type="url" class="link-input svelte-1o4jdf5" placeholder="https://youtube.com/watch?v=..." aria-label="Paste link"/> <button class="add-btn svelte-1o4jdf5"><!>Add</button></div></div> <div class="empty-state svelte-1o4jdf5"><div class="wip-tape svelte-1o4jdf5">COMING SOON</div> <p class="svelte-1o4jdf5">Your samples will appear here once added.</p></div></div>`),ut=u(`<div class="svc-chip svelte-1o4jdf5"><span class="svelte-1o4jdf5"> </span><span class="svelte-1o4jdf5"> </span><!></div>`),dt=u(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><div class="sec-head svelte-1o4jdf5"><h2 class="sec-title svelte-1o4jdf5">Playlists</h2> <p class="sec-sub svelte-1o4jdf5">Connect Spotify to sync playlists across all services
              automatically</p></div> <div class="spotify-card svelte-1o4jdf5"><div class="sp-icon svelte-1o4jdf5"><svg viewBox="0 0 24 24" fill="currentColor" width="30" height="30" class="svelte-1o4jdf5"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" class="svelte-1o4jdf5"></path></svg></div> <div class="sp-info svelte-1o4jdf5"><h3 class="svelte-1o4jdf5">Connect Spotify</h3> <p class="svelte-1o4jdf5">Import your playlists and sync across services</p></div> <button class="sp-btn svelte-1o4jdf5">Connect <!></button></div> <div class="svc-chips svelte-1o4jdf5"></div> <div class="empty-state mx-auto max-w-[380px] text-center svelte-1o4jdf5"><div class="wip-tape svelte-1o4jdf5">COMING SOON</div> <p class="svelte-1o4jdf5">Connect Spotify to see your playlists, automatically transcribed
              across all services.</p></div></div>`),ft=u(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><div class="sec-head svelte-1o4jdf5"><h2 class="sec-title svelte-1o4jdf5">Radio</h2> <p class="sec-sub svelte-1o4jdf5">Stream live broadcasts, dog shows, and podcast feeds</p></div> <div class="empty-state mx-auto max-w-[380px] text-center svelte-1o4jdf5"><div class="wip-tape svelte-1o4jdf5">COMING SOON</div> <p class="svelte-1o4jdf5">Live radio feeds will appear here once connected.</p></div></div>`),pt=u(`<div class="app-loading-spinner svelte-1o4jdf5" aria-label="Loading..."></div>`),mt=u(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><!></div>`),ht=u(`<div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 animate-pulse svelte-1o4jdf5"><div class="bg-black/75 border border-red-500/30 px-4 py-2 rounded text-[12px] font-mono tracking-widest text-red-500 font-bold uppercase shadow-[0_0_20px_rgba(239,68,68,0.3)] select-none svelte-1o4jdf5">NO SIGNAL</div></div>`),gt=u(`<button> </button>`),_t=u(`<div class="visualizer-container fullscreen cursor-pointer svelte-1o4jdf5"><canvas class="visualizer-canvas svelte-1o4jdf5"></canvas> <!> <div class="visualizer-overlay svelte-1o4jdf5"><div class="flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-lg p-1 border border-white/10 svelte-1o4jdf5"></div></div></div>`),vt=u(`<div class="mp-backdrop svelte-1o4jdf5"><div><header class="panel-header svelte-1o4jdf5"><div class="brand svelte-1o4jdf5"><button class="logo-btn svelte-1o4jdf5" aria-label="Open DOGS Info"><!></button> <h1 class="svelte-1o4jdf5"></h1></div> <button class="close-btn svelte-1o4jdf5" aria-label="Close panel"><!></button></header> <!> <div class="mp-body svelte-1o4jdf5"><!></div> <footer class="mp-footer svelte-1o4jdf5"><div class="mp-status svelte-1o4jdf5"><span class="mp-dot svelte-1o4jdf5"></span><span class="svelte-1o4jdf5">WE ARE DOGS</span></div> <span class="svelte-1o4jdf5">MUSIC</span></footer></div> <!> <canvas class="fader-fx-canvas pointer-events-none svelte-1o4jdf5"></canvas></div>`);function yt(s,u){se(u,!0);let x=[{id:`songs`,label:`Songs`,icon:ee},{id:`samples`,label:`Samples`,icon:ae},{id:`playlists`,label:`Playlists`,icon:n},{id:`radio`,label:`Radio`,icon:Ne},{id:`battle`,label:`Battle`,icon:Oe}],yt=`/img/error_cover.png`;function bt(e){e.target.src.endsWith(yt)||(e.target.src=yt)}let xt=Pe(u,`isClosing`,3,!1),St=Pe(u,`initialTrackId`,3,null),F=k(`songs`),I=k(`default`),Ct=k(null);D(()=>{C(F)===`battle`&&!C(Ct)&&ze(()=>import(`./BattlePanel-BECXB5Qn.js`).then(e=>{T(Ct,e.default,!0)}),__vite__mapDeps([0,1,2,3,4]))});let L=k(!1),wt=k(!1),Tt=k(!1),Et=k(null),R=E(()=>P.isPlaying&&!xt()),z=k(!1),Dt=k(0),Ot=k(!1),kt=k(null),B=null,V=!1,At=k(!1),jt=E(()=>{let e=C(W);if(!e)return Array(60).fill(10);if(P.waveformPeaks[e.id])return P.waveformPeaks[e.id];let t=e.id,n=[],r=0;for(let e=0;e<t.length;e++)r=(r<<5)-r+t.charCodeAt(e),r|=0;let i=Math.abs(r)%1e3;for(let e=0;e<60;e++){let t=e/59,r=Math.sin(i+t*Math.PI*4),a=Math.cos(i*1.5+t*Math.PI*10)*.4,o=Math.sin(i*2.3+t*Math.PI*22)*.15,s=Math.abs(r+a+o)/1.55,c=Math.sin(t*Math.PI),l=(s*70+15)*c;n.push(Math.max(10,Math.round(l)))}return n});D(()=>{window.innerWidth<=640&&C(z)&&C(Dt)===0&&C(L)&&T(L,!1)}),D(()=>{P.isPlaying&&T(At,!0)});let Mt=E(()=>!P.isPlaying&&!C(At)?Ge.fragmentShader:We[C(Dt)].fragmentShader);D(()=>{let e=P.analyser;return C(z)&&C(kt)&&!xt()&&(B=new Ue(C(kt),e),B.init(C(Mt)),B.start()),()=>{B&&(B.destroy(),B=null)}}),D(()=>{let e=C(Mt);B&&C(z)&&(B.setPreset(e),B.start())}),D(()=>{C(L)?!history.state?.tracklistOpen&&!V&&(history.pushState({tracklistOpen:!0},``),V=!0):V&&(history.back(),V=!1)}),o(()=>{V&&(history.back(),V=!1)});function Nt(e){!e.state?.tracklistOpen&&C(L)&&(T(L,!1),V=!1)}function Pt(e){C(Tt)&&C(Et)&&!C(Et).contains(e.target)&&!e.target.closest(`.vol-toggle-btn`)&&T(Tt,!1)}let H=[{id:`hollywood`,title:`HOLLYWOOD`,artist:`YG`,album:`THE GENTLEMEN'S CLUB`,cover:`https://data.wearedogs.net/img/covers/2026/yg.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/yg.jpg`,src:`https://data.wearedogs.net/music/2026/HOLLYWOOD.mp3`,instrumental:`https://data.wearedogs.net/music/2026/HOLLYWOOD-free.mp3`,dateAdded:`2026-06-24T03:00:00-05:00`,year:2026,genre:`Hip-Hop`,attrib:`https://the-gentlemens-club.com/`},{id:`chicago`,title:`Chicago`,artist:`Michael Jackson`,album:`Xscape`,cover:`https://data.wearedogs.net/img/covers/2026/mj.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/mj.jpg`,src:`https://data.wearedogs.net/music/2026/Chicago.mp3`,instrumental:`https://data.wearedogs.net/music/2026/Chicago-free.mp3`,dateAdded:`2026-06-24T03:00:00-05:00`,year:2014,genre:`Pop`},{id:`rain`,title:`Pourin Rain (feat. Skratch Bastid)`,artist:`Zeds Dead`,album:`Return to the Return (of the Spectrum of Intergalactic Happiness)`,cover:`https://data.wearedogs.net/img/covers/2026/zd.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/zd.jpg`,src:`https://data.wearedogs.net/music/2026/Pourin.mp3`,instrumental:``,dateAdded:`2026-07-07T018:12:00-05:00`,year:2026,genre:`Electronic`,attrib:`https://shop.zedsdead.net/`},{id:`denchai`,title:`Den Chai`,artist:`The Buddha-Bar Lounge`,album:`Den Chai`,cover:`https://data.wearedogs.net/img/covers/2026/buddha.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/buddha.png`,src:``,instrumental:`https://data.wearedogs.net/music/2026/DENCHAI.mp3`,dateAdded:`2026-07-07T22:34:00-05:00`,year:2008,genre:`Lounge`,attrib:`https://open.spotify.com/artist/0du3MpnxBOpQEie1IV3u9v?si=2UO722ntTE--Ck_Ji7Go7Q`},{id:`rainbow`,title:`Rainbow in the Dark`,artist:`Das Racist`,album:`Shut Up, Dude`,cover:`https://data.wearedogs.net/img/covers/2026/rainbow.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/rainbow.png`,src:`https://data.wearedogs.net/music/2026/rainbow.mp3`,instrumental:`https://data.wearedogs.net/music/2026/rainbow-free.mp3`,dateAdded:`2026-07-08T16:35:00-05:00`,year:2010,genre:`Hip-Hop`,attrib:`https://dasracist.bandcamp.com/album/shut-up-dude`},{id:`hipsong`,title:`Hip Song`,artist:`Toby Fox / Trevor Alan Gomes`,album:`Deltarune`,cover:`https://data.wearedogs.net/img/covers/2026/deltarune.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/deltarune.png`,src:`https://data.wearedogs.net/music/2026/shop.mp3`,instrumental:`https://data.wearedogs.net/music/2026/shop-free.mp3`,dateAdded:`2026-07-09T01:22:00-05:00`,year:2021,genre:`Video Game`,attrib:`https://deltarune.com/`},{id:`sleepless`,title:`Sleepless`,artist:`deadmau5`,album:`> album title goes here <`,cover:`https://data.wearedogs.net/img/covers/2026/sleepless.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/sleepless.png`,src:``,instrumental:`https://data.wearedogs.net/music/2026/sleepless.mp3`,dateAdded:`2026-07-12T04:22:00-05:00`,year:2026,genre:`Electronic`,attrib:`https://deadmau5.com/`},{id:`skitzo`,title:`Skitzo (feat. Young Thug)`,artist:`Travis Scott`,album:`UTOPIA`,cover:`https://data.wearedogs.net/img/covers/2026/utopia.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/utopia.png`,src:`https://data.wearedogs.net/music/2026/skitzo.mp3`,instrumental:`https://data.wearedogs.net/music/2026/skitzo-free.mp3`,dateAdded:`2026-07-16T01:56:00-05:00`,year:2023,genre:`Hip-Hop`,attrib:`https://shop.travisscott.com/`},{id:`slow`,title:`SLOW ft. DOGS`,artist:`Sweet Boy Sonnet`,album:`Where do I put my love?`,cover:`https://data.wearedogs.net/img/covers/2026/slow.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/slow.png`,src:`https://data.wearedogs.net/music/2026/SLOW-FT-DOGS.mp3`,instrumental:``,dateAdded:`2026-07-20T02:49:34-05:00`,year:2026,genre:`Electronic`,attrib:`https://sweetboysonnet.com/`}];function Ft(e){return e.src?e.src.split(`/`).pop():``}function It(e){if(!e.dateAdded)return`Summer`;let t=new Date(e.dateAdded).getMonth();return t===11||t===0||t===1?`Winter`:t>=2&&t<=4?`Spring`:t>=5&&t<=7?`Summer`:`Fall`}let U=E(()=>{let e=[...H];return C(I)===`artist`?e.sort((e,t)=>e.artist.localeCompare(t.artist)):C(I)===`album`?e.sort((e,t)=>e.album.localeCompare(t.album)):C(I)===`year`?e.sort((e,t)=>(e.year||0)-(t.year||0)):C(I)===`filename`?e.sort((e,t)=>Ft(e).localeCompare(Ft(t))):C(I)===`genre`?e.sort((e,t)=>(e.genre||``).localeCompare(t.genre||``)):C(I)===`season`&&e.sort((e,t)=>It(e).localeCompare(It(t))),e}),W=E(()=>H[P.currentTrackIndex]),Lt=k(0),Rt=k(0),zt=k(0),Bt=k(0),Vt=k(0),Ht=k(0),Ut=k(null),Wt=null;function Gt(e,t){e.stopPropagation();let n=`${window.location.origin}/music/${t.id}`;navigator.clipboard.writeText(n).then(()=>{T(Ut,t.id,!0),Wt&&clearTimeout(Wt),Wt=setTimeout(()=>{T(Ut,null)},2e3)}).catch(e=>{console.error(`Failed to copy share link:`,e)})}o(()=>{Wt&&clearTimeout(Wt)}),f(()=>{if(P.init(H),St()){let e=H.findIndex(e=>e.id===St());e!==-1&&P.loadTrack(e,!0)}else if(!P.hasPickedRandomTrack){P.hasPickedRandomTrack=!0;let e=Math.floor(Math.random()*H.length);P.loadTrack(e,!1)}});let G=k(null);function Kt(){let e=document.querySelector(`.track-row[data-track-id="${C(G)}"]`);e&&e.scrollIntoView({block:`nearest`,behavior:`smooth`})}function qt(e){T(G,e.id,!0);let t=H.findIndex(t=>t.id===e.id);P.currentTrackIndex===t&&!P.fetchErrors[e.id]?P.togglePlay():P.loadTrack(t,!0)}function Jt(){window.innerWidth<=640?T(L,!0):T(z,!C(z))}function Yt(){let e=!P.isInstrumental;P.setCrossfade(e)||(Te(q),C(nn)||(T(nn,!0),setTimeout(()=>{T(nn,!1)},300)),C(q)===5?($(),T(rn,!0),setTimeout(()=>{T(rn,!1)},150)):C(q)===10?$(35):C(q)>5&&C(q)<10?$(8):C(q)>10&&Math.random()<.4&&$(3))}function Xt(e){return!e||isNaN(e)?`0:00`:`${Math.floor(e/60)}:${Math.floor(e%60).toString().padStart(2,`0`)}`}function Zt(e){let t=document.activeElement;if(!(t&&(t.tagName===`INPUT`||t.tagName===`TEXTAREA`||t.isContentEditable))){if(e.shiftKey){if(e.key===`ArrowRight`){e.preventDefault(),T(F,x[(x.findIndex(e=>e.id===C(F))+1)%x.length].id,!0);return}else if(e.key===`ArrowLeft`){e.preventDefault(),T(F,x[(x.findIndex(e=>e.id===C(F))-1+x.length)%x.length].id,!0);return}}if(e.code===`Space`||e.key===` `)C(F)===`songs`&&(e.preventDefault(),P.togglePlay());else if(e.key===`ArrowDown`){if(C(F)===`songs`&&C(U).length>0){e.preventDefault();let t=C(U).findIndex(e=>e.id===C(G));if(t===-1){let e=H[P.currentTrackIndex];t=C(U).findIndex(t=>t.id===e?.id)}let n=(t+1)%C(U).length;T(G,C(U)[n].id,!0),Kt()}}else if(e.key===`ArrowUp`){if(C(F)===`songs`&&C(U).length>0){e.preventDefault();let t=C(U).findIndex(e=>e.id===C(G));if(t===-1){let e=H[P.currentTrackIndex];t=C(U).findIndex(t=>t.id===e?.id)}let n=(t-1+C(U).length)%C(U).length;T(G,C(U)[n].id,!0),Kt()}}else if(e.key===`Enter`&&C(F)===`songs`&&C(G)){e.preventDefault();let t=C(U).find(e=>e.id===C(G));t&&qt(t)}}}let Qt=0,$t=0;function en(e){if(e.target&&(e.target.tagName===`INPUT`||e.target.closest(`button`)||e.target.closest(`.ctrl`))){Qt=0,$t=0;return}Qt=e.touches[0].clientX,$t=e.touches[0].clientY}function tn(e){if(Qt===0||!e.changedTouches||e.changedTouches.length===0)return;let t=e.changedTouches[0].clientX-Qt,n=e.changedTouches[0].clientY-$t;if(Math.abs(t)<=Math.abs(n)||Math.abs(t)<=60)return;let r=x.findIndex(e=>e.id===C(F));r!==-1&&(t<0&&r<x.length-1?T(F,x[r+1].id,!0):t>0&&r>0&&T(F,x[r-1].id,!0))}let K=k(null),q=k(0),nn=k(!1),rn=k(!1),J,Y,X,Z=[],Q=[],an,on=k(!1);D(()=>(C(K)&&cn(),()=>{an&&cancelAnimationFrame(an),window.removeEventListener(`resize`,ln),X&&(X.dispose(),X=null),J=null,Y=null,Z=[],Q=[]})),D(()=>{if(P.currentTrackIndex,C(F),xt(),T(q,0),T(on,!1),J){for(let e of Z)J.remove(e.mesh);for(let e of Q)J.remove(e.mesh)}Z=[],Q=[]});function sn(){let e=document.querySelector(`.dj-fader-knob`);if(!e)return{x:window.innerWidth/2,y:window.innerHeight/2};let t=e.getBoundingClientRect();return{x:t.left+t.width/2,y:window.innerHeight-(t.top+t.height/2)}}function cn(){if(!C(K))return;let e=window.innerWidth,t=window.innerHeight;C(K).width=e,C(K).height=t,J=new v,Y=new re(0,e,t,0,-1,1),X=new xe({canvas:C(K),alpha:!0,antialias:!0}),X.setSize(e,t,!1),X.setPixelRatio(Math.min(window.devicePixelRatio,2)),window.addEventListener(`resize`,ln),un()}function ln(){if(!C(K)||!X||!Y)return;let e=window.innerWidth,t=window.innerHeight;C(K).width=e,C(K).height=t,X.setSize(e,t,!1),Y.right=e,Y.top=t,Y.updateProjectionMatrix()}function un(){if(an=requestAnimationFrame(un),!(!J||!Y||!X||!C(K))){if(C(q)>=10&&(T(on,!0),Math.random()<.22)){let e=sn();dn(e.x,e.y)}for(let e=Z.length-1;e>=0;e--){let t=Z[e];t.x+=t.vx,t.y+=t.vy,t.vy+=t.ay,t.life-=t.decay,t.mesh.position.set(t.x,t.y,0),t.mesh.material.opacity=t.life,t.life<=0&&(J.remove(t.mesh),t.mesh.geometry.dispose(),t.mesh.material.dispose(),Z.splice(e,1))}for(let e=Q.length-1;e>=0;e--){let t=Q[e];t.x+=t.vx,t.y+=t.vy,t.life-=t.decay;let n=t.startScale+(1-t.life)*88;t.mesh.scale.set(n,n,1),t.mesh.position.set(t.x,t.y,0),t.mesh.material.opacity=t.life*.16,t.life<=0&&(J.remove(t.mesh),t.mesh.geometry.dispose(),t.mesh.material.dispose(),Q.splice(e,1))}X.render(J,Y)}}function dn(t,n){if(!J)return;let i=new oe(5,8),a=.85+Math.random()*.12,o=new e(i,new Se({color:new r(a,a,a*1.01),transparent:!0,opacity:.06,blending:1}));o.position.set(t,n,0),J.add(o),Q.push({mesh:o,x:t,y:n,vx:(Math.random()-.5)*.55+Math.sin(Date.now()*.001)*.22,vy:Math.random()*.7+1.25,startScale:1,life:1,decay:6e-4+Math.random()*4e-4})}function $(t=25){if(!J||!C(K))return;let n=sn(),i=n.x,a=n.y;for(let n=0;n<t;n++){let t=new e(new oe(1.3,4),new Se({color:new r(Math.random()<.4?16711765:16755200),transparent:!0,opacity:1,blending:2}));t.position.set(i,a,0),J.add(t);let n=Math.random()*Math.PI*2,o=Math.random()*4+2;Z.push({mesh:t,x:i,y:a,vx:Math.cos(n)*o,vy:Math.sin(n)*o,ay:-.15,life:1,decay:.02+Math.random()*.02})}}var fn=vt();ke(`keydown`,he,Zt),ke(`popstate`,he,Nt),ke(`click`,he,Pt);var pn=O(fn);let mn;var hn=O(pn),gn=O(hn),_n=O(gn);Be(O(_n),{size:`panel`}),M(_n);var vn=w(_n,2);vn.textContent=`MUSIC`,M(gn);var yn=w(gn,2);je(O(yn),{size:20}),M(yn),M(hn);var bn=w(hn,2);He(bn,{get tabs(){return x},get activeTab(){return C(F)},set activeTab(e){T(F,e,!0)}});var xn=w(bn,2),Sn=O(xn),Cn=e=>{var n=ct(),r=O(n);let o;var s=O(r);let u;var d=O(s),f=O(d),v=e=>{var n=qe(),r=O(n);be(r,e=>T(kt,e),()=>C(kt));var i=w(r,2),a=e=>{t(e,Ke())};b(i,e=>{!P.isPlaying&&!C(At)&&e(a)});var o=w(i,2);Ee(O(o),{size:16,class:`text-white/70`}),M(o),M(n),_(`click`,n,()=>{T(Ot,!0)}),t(e,n)},ee=e=>{var n=Je();Ee(O(n),{size:16,class:`text-white/20`}),M(n),t(e,n)},re=e=>{var n=ue(),r=Ae(n),a=e=>{var n=Ye(),r=O(n);let a;var o=w(O(r),8),s=O(o);let c;M(o),i(2),M(r);var l=w(r,2);let u;M(n),A(()=>{a=S(r,1,`vinyl-record svelte-1o4jdf5`,null,a,{spinning:C(R)}),j(s,`src`,P.fetchErrors[C(W).id]||!C(W).cover?yt:C(W).cover),j(s,`alt`,C(W).album),c=S(s,1,`record-art svelte-1o4jdf5`,null,c,{loaded:C(wt)}),u=S(l,1,`tonearm svelte-1o4jdf5`,null,u,{playing:C(R)})}),_(`click`,n,Jt),ke(`load`,s,()=>T(wt,!0)),ke(`error`,s,bt),h(s),t(e,n)},o=e=>{let n=E(()=>P.duration>0?(1-P.currentTime/P.duration)*.45+.25:.48),r=E(()=>P.duration>0?P.currentTime/P.duration*.45+.25:.48);var a=Xe(),o=O(a),s=O(o),c=O(s),l=O(c,!0);M(c),i(2),M(s);var u=w(s,2),d=O(u);let f;var p=w(d,2);let m;var h=w(p,2);let g;var v=w(h,2);let ee;M(u),M(o),M(a),A(()=>{N(l,C(W).title),f=S(d,1,`spindle-left bg-zinc-900 svelte-1o4jdf5`,null,f,{spinning:C(R)}),m=S(p,1,`tape-roll-left bg-amber-950/70 svelte-1o4jdf5`,null,m,{spinning:C(R)}),Fe(p,`width: ${C(n)*46}px; height: ${C(n)*46}px;`),g=S(h,1,`spindle-right bg-zinc-900 svelte-1o4jdf5`,null,g,{spinning:C(R)}),ee=S(v,1,`tape-roll-right bg-amber-950/70 svelte-1o4jdf5`,null,ee,{spinning:C(R)}),Fe(v,`width: ${C(r)*46}px; height: ${C(r)*46}px;`)}),_(`click`,a,Jt),t(e,a)},s=e=>{var n=Ze(),r=O(n),i=w(O(r),4),a=w(O(i),4),o=O(a),s=O(o,!0);M(o);var c=w(o,2),l=O(c,!0);M(c),M(a),M(i);var u=w(i,2),d=O(u);let f;var p=w(d,2),m=O(p);let h;M(p),M(u);var g=w(u,2);let v;M(r),M(n),A(()=>{N(s,C(W).title),N(l,C(W).artist||`WEAREDOGS`),f=S(d,1,`floppy-shutter-slider bg-zinc-400 svelte-1o4jdf5`,null,f,{open:C(R)}),h=S(m,1,`floppy-magnetic-disc bg-zinc-900 svelte-1o4jdf5`,null,h,{spinning:C(R)}),v=S(g,1,`floppy-drive-led svelte-1o4jdf5`,null,v,{active:C(R)})}),_(`click`,n,Jt),t(e,n)},c=e=>{var n=$e(),r=O(n),i=O(r);let a;var o=w(i,2),s=O(o),c=O(s);let l;var u=w(c,2);let d;M(s);var f=w(s,2),p=O(f);let m;M(f);var h=w(f,2);Ce(h,20,()=>Array(10),ne,(e,n,r)=>{var i=Qe();let a;A(e=>a=S(i,1,`comb-tooth svelte-1o4jdf5`,null,a,e),[()=>({vibrating:C(R)&&r%3==Math.floor(P.currentTime*4)%3})]),t(e,i)}),M(h),M(o),M(r),M(n),A(()=>{a=S(i,1,`music-box-key svelte-1o4jdf5`,null,a,{spinning:C(R)}),l=S(c,1,`music-box-gear gear-1 svelte-1o4jdf5`,null,l,{spinning:C(R)}),d=S(u,1,`music-box-gear gear-2 svelte-1o4jdf5`,null,d,{spinning:C(R)}),m=S(p,1,`music-box-drum bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 svelte-1o4jdf5`,null,m,{spinning:C(R)})}),_(`click`,n,Jt),t(e,n)};b(r,e=>{Ve.musicDeckModel===`vinyl`?e(a):Ve.musicDeckModel===`cassette`?e(o,1):Ve.musicDeckModel===`floppy`?e(s,2):Ve.musicDeckModel===`musicbox`&&e(c,3)}),t(e,n)};b(f,e=>{C(z)&&!C(Ot)?e(v):C(z)&&C(Ot)?e(ee,1):e(re,-1)}),M(d);var ie=w(d,2),oe=O(ie),se=O(oe),x=O(se),fe=e=>{pe(e,{size:12,class:`text-[#22c55e]`})},he=e=>{a(e,{size:12})};b(x,e=>{C(Ut)===C(W).id?e(fe):e(he,-1)}),M(se),M(oe);var xe=w(oe,2);let Se;var we=O(xe);let Te;var D=O(we,!0);M(we),M(xe);var k=w(xe,2);let Oe;var je=O(k);let Ne;var Pe=O(je,!0);M(je),M(k);var Ie=w(k,2);let ze;var Be=O(Ie);let He;var Ue=O(Be,!0);M(Be),M(Ie),M(ie),M(s);var Ge=w(s,2),lt=O(Ge),ut=O(lt),dt=O(ut,!0);M(ut);var ft=w(ut,2),pt=O(ft);Ce(pt,21,()=>C(jt),ne,(e,n,r)=>{let i=E(()=>P.duration>0?P.currentTime/P.duration:0),a=E(()=>r/60);var o=et();let s;A(()=>{s=S(o,1,`waveform-bar transition-colors duration-100 rounded-full svelte-1o4jdf5`,null,s,{active:C(a)<=C(i)}),Fe(o,`height: ${C(n)??``}%; width: 3px;`)}),t(e,o)}),M(pt);var mt=w(pt,2);me(mt),M(ft);var ht=w(ft,2),gt=O(ht,!0);M(ht),M(lt);var _t=w(lt,2),vt=O(_t);let xt;ce(O(vt),{size:15}),M(vt);var St=w(vt,2);Re(O(St),{size:19}),M(St);var F=w(St,2);let Ct;var B=O(F),V=e=>{Me(e,{size:22})},Mt=e=>{t(e,tt())},Nt=e=>{c(e,{size:22,fill:`currentColor`})},Pt=e=>{le(e,{size:22,fill:`currentColor`})};b(B,e=>{P.fetchErrors[C(W).id]?e(V):P.isLoading?e(Mt,1):P.isPlaying?e(Nt,2):e(Pt,-1)}),M(F);var Ft=w(F,2);ve(O(Ft),{size:19}),M(Ft);var It=w(Ft,2);let Wt;var Kt=O(It),Zt=e=>{te(e,{size:15})},Qt=e=>{p(e,{size:15})};b(Kt,e=>{P.repeatMode===2?e(Zt):e(Qt,-1)}),M(It),M(_t);var $t=w(_t,2),en=O($t);let tn;var K=O(en);let J;ae(O(K),{size:12}),i(2),M(K);var Y=w(K,2),X=O(Y);let Z;M(Y);var Q=w(Y,2);let an;ge(O(Q),{size:12}),i(2),M(Q),M(en),M($t);var on=w($t,2),sn=O(on),cn=e=>{var n=nt(),r=O(n),i=O(r),a=e=>{m(e,{size:12,class:`text-red-400`})},o=e=>{de(e,{size:12})};b(i,e=>{P.isMuted||P.volume===0?e(a):e(o,-1)}),M(r);var s=w(r,2);me(s);var c=w(s,2),l=O(c);M(c),M(n),be(n,e=>T(Et,e),()=>C(Et)),A(e=>{_e(s,P.volume),N(l,`${e??``}%`)},[()=>Math.round(P.volume*100)]),_(`click`,r,()=>P.toggleMute()),_(`input`,s,e=>P.setVolume(parseFloat(e.target.value))),t(e,n)};b(sn,e=>{C(Tt)&&e(cn)});var ln=w(sn,2),un=O(ln);let dn;g(O(un),{size:13}),M(un);var $=w(un,2),fn=O($,!0);M($),M(ln);var pn=w(ln,2),mn=O(pn),hn=O(mn),gn=e=>{m(e,{size:13,class:`text-red-400`})},_n=e=>{de(e,{size:13})};b(hn,e=>{P.isMuted||P.volume===0?e(gn):e(_n,-1)}),M(mn),M(pn),M(on),M(Ge),M(r);var vn=w(r,2);let yn;var bn=O(vn),xn=w(O(bn),2);M(bn);var Sn=w(bn,2),Cn=O(Sn),wn=O(Cn);ye(wn,{size:13});var Tn=w(wn,3),En=O(Tn,!0);M(Tn),M(Cn);var Dn=w(Cn,2),On=w(O(Dn),2),kn=O(On);kn.value=kn.__value=`default`;var An=w(kn);An.value=An.__value=`artist`;var jn=w(An);jn.value=jn.__value=`album`;var Mn=w(jn);Mn.value=Mn.__value=`year`;var Nn=w(Mn);Nn.value=Nn.__value=`filename`;var Pn=w(Nn);Pn.value=Pn.__value=`genre`;var Fn=w(Pn);Fn.value=Fn.__value=`season`,M(On),M(Dn),M(Sn);var In=w(Sn,2);Ce(In,21,()=>C(U),ne,(e,n,r)=>{var o=st();let s;var c=O(o),l=O(c),u=e=>{t(e,rt())},d=e=>{var n=it();n.textContent=r+1,t(e,n)};b(l,e=>{H[P.currentTrackIndex].id===C(n).id&&P.isPlaying?e(u):e(d,-1)}),M(c);var f=w(c,2),p=w(f,2),m=O(p),g=O(m);let v;var ee=O(g,!0);M(g);var te=w(g,2),ne=e=>{var n=at();Me(O(n),{size:10}),i(),M(n),t(e,n)};b(te,e=>{P.fetchErrors[C(n).id]&&e(ne)}),M(m);var y=w(m,2),re=O(y);M(y),M(p);var ie=w(p,2),ae=O(ie),oe=e=>{var r=ot(),i=O(r);M(r),A(()=>j(i,`href`,C(n).attrib)),_(`click`,i,e=>e.stopPropagation()),t(e,r)};b(ae,e=>{C(n).attrib&&e(oe)});var se=w(ae,2),ce=O(se),x=e=>{pe(e,{size:12,class:`text-[#22c55e]`})},le=e=>{a(e,{size:12})};b(ce,e=>{C(Ut)===C(n).id?e(x):e(le,-1)}),M(se),M(ie),M(o),A(()=>{s=S(o,1,`track-row svelte-1o4jdf5`,null,s,{active:H[P.currentTrackIndex].id===C(n).id,"kb-focused":C(G)===C(n).id,"fetch-error":P.fetchErrors[C(n).id]}),j(o,`data-track-id`,C(n).id),j(f,`src`,P.fetchErrors[C(n).id]||!C(n).cover?yt:C(n).cover),j(f,`alt`,C(n).album),v=S(g,1,`tr-title svelte-1o4jdf5`,null,v,{"line-through":P.fetchErrors[C(n).id],"opacity-50":P.fetchErrors[C(n).id]}),N(ee,C(n).title),N(re,`${C(n).artist??``} · ${C(n).album??``} (${(C(n).year||``)??``})`)}),_(`click`,o,()=>qt(C(n))),ke(`error`,f,bt),h(f),_(`click`,se,e=>Gt(e,C(n))),t(e,o)}),M(In),M(vn),M(n),A((e,t)=>{o=S(r,1,`player-side svelte-1o4jdf5`,null,o,{"tracklist-open":C(L)}),u=S(s,1,`player-top-block transition-all duration-300 ease-in-out svelte-1o4jdf5`,null,u,{"opacity-0":C(L),"scale-95":C(L),"pointer-events-none":C(L)}),Se=S(xe,1,`scroll-container svelte-1o4jdf5`,null,Se,{overflowing:C(Rt)>C(Lt)}),Fe(xe,`--scroll-dist: -${C(Rt)-C(Lt)}px`),Te=S(we,1,`track-title scroll-text svelte-1o4jdf5`,null,Te,{"animate-scroll":C(Rt)>C(Lt)}),N(D,C(W).title),Oe=S(k,1,`scroll-container svelte-1o4jdf5`,null,Oe,{overflowing:C(Bt)>C(zt)}),Fe(k,`--scroll-dist: -${C(Bt)-C(zt)}px`),Ne=S(je,1,`track-artist scroll-text svelte-1o4jdf5`,null,Ne,{"animate-scroll":C(Bt)>C(zt)}),N(Pe,C(W).artist),ze=S(Ie,1,`scroll-container svelte-1o4jdf5`,null,ze,{overflowing:C(Ht)>C(Vt)}),Fe(Ie,`--scroll-dist: -${C(Ht)-C(Vt)}px`),He=S(Be,1,`track-album scroll-text svelte-1o4jdf5`,null,He,{"animate-scroll":C(Ht)>C(Vt)}),N(Ue,C(W).album),N(dt,e),j(mt,`max`,P.duration||100),_e(mt,P.currentTime),N(gt,t),xt=S(vt,1,`ctrl ctrl-sm svelte-1o4jdf5`,null,xt,{"active-ctrl":P.isShuffled}),Ct=S(F,1,`ctrl ctrl-play svelte-1o4jdf5`,null,Ct,{"ctrl-error":P.fetchErrors[C(W).id]}),j(F,`aria-label`,P.isPlaying?`Pause`:`Play`),Wt=S(It,1,`ctrl ctrl-sm svelte-1o4jdf5`,null,Wt,{"active-ctrl":P.repeatMode>0}),tn=S(en,1,`dj-crossfader svelte-1o4jdf5`,null,tn,{"fader-flash":C(rn),"fader-fried":C(q)>=10}),J=S(K,1,`fader-label left-label flex items-center gap-1 svelte-1o4jdf5`,null,J,{active:!P.isInstrumental}),Z=S(X,1,`dj-fader-knob svelte-1o4jdf5`,null,Z,{right:P.isInstrumental,"knob-jiggle":C(nn),fried:C(q)>=10}),an=S(Q,1,`fader-label right-label flex items-center gap-1 svelte-1o4jdf5`,null,an,{active:P.isInstrumental}),dn=S(un,1,`ctrl ctrl-xs svelte-1o4jdf5`,null,dn,{"active-ctrl":C(z)}),S($,1,`w-[90px] h-[20px] flex items-center justify-center rounded text-[9px] font-bold transition-all font-mono uppercase tracking-wider select-none cursor-pointer
                      ${C(z)?`bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/25 active:scale-95`:`bg-transparent border border-white/5 text-white/20 hover:text-white/40 hover:border-white/10`}`,`svelte-1o4jdf5`),j($,`title`,C(z)?`Click to cycle presets`:`Click to enable visualizer`),N(fn,We[C(Dt)].name),yn=S(vn,1,`tracklist-side svelte-1o4jdf5`,null,yn,{"show-mobile":C(L)}),N(En,H.length)},[()=>Xt(P.currentTime),()=>Xt(P.duration)]),_(`click`,se,e=>Gt(e,C(W))),De(we,`clientWidth`,e=>T(Rt,e)),De(xe,`clientWidth`,e=>T(Lt,e)),De(je,`clientWidth`,e=>T(Bt,e)),De(k,`clientWidth`,e=>T(zt,e)),De(Be,`clientWidth`,e=>T(Ht,e)),De(Ie,`clientWidth`,e=>T(Vt,e)),_(`input`,mt,e=>{P.seek(parseFloat(e.target.value))}),_(`change`,mt,e=>{P.isPlaying||P.play(parseFloat(e.target.value))}),_(`click`,vt,()=>P.setShuffle(!P.isShuffled)),_(`click`,St,()=>P.prevTrack()),_(`click`,F,()=>P.togglePlay()),_(`click`,Ft,()=>P.nextTrack()),_(`click`,It,()=>{P.repeatMode=(P.repeatMode+1)%3}),_(`click`,en,Yt),_(`click`,un,()=>{T(z,!C(z))}),_(`click`,$,()=>{C(z)?T(Dt,(C(Dt)+1)%We.length):T(z,!0)}),_(`click`,mn,()=>{T(Tt,!C(Tt))}),_(`click`,xn,()=>{T(L,!1)}),Le(On,()=>C(I),e=>T(I,e)),y(1,n,()=>l,()=>({duration:120,delay:120})),y(2,n,()=>l,()=>({duration:120})),t(e,n)},wn=e=>{var n=lt(),r=w(O(n),2),a=O(r);ae(a,{size:36});var o=w(a,6),s=w(O(o),2);d(O(s),{size:15}),i(),M(s),M(o),M(r),i(2),M(n),y(1,n,()=>l,()=>({duration:120,delay:120})),y(2,n,()=>l,()=>({duration:120})),t(e,n)},Tn=e=>{var n=dt(),r=w(O(n),2),a=w(O(r),4);fe(w(O(a)),{size:15}),M(a),M(r);var o=w(r,2);Ce(o,20,()=>[{name:`Apple Music`,color:`#fc3c44`,icon:`🎵`},{name:`YouTube Music`,color:`#ff0000`,icon:`▶`},{name:`Amazon Music`,color:`#00a8e0`,icon:`♪`},{name:`Tidal`,color:`#00d4f5`,icon:`〰`}],ne,(e,n)=>{var r=ut(),i=O(r),a=O(i,!0);M(i);var o=w(i),s=O(o,!0);M(o),ie(w(o),{size:11}),M(r),A(()=>{Fe(r,`--sc:${n.color??``}`),N(a,n.icon),N(s,n.name)}),t(e,r)}),M(o),i(2),M(n),y(1,n,()=>l,()=>({duration:120,delay:120})),y(2,n,()=>l,()=>({duration:120})),t(e,n)},En=e=>{var n=ft();y(1,n,()=>l,()=>({duration:120,delay:120})),y(2,n,()=>l,()=>({duration:120})),t(e,n)},Dn=e=>{var n=mt(),r=O(n),i=e=>{let n=E(()=>C(Ct));var r=ue();we(Ae(r),()=>C(n),(e,t)=>{t(e,{get audioCore(){return P}})}),t(e,r)},a=e=>{t(e,pt())};b(r,e=>{C(Ct)?e(i):e(a,-1)}),M(n),y(1,n,()=>l,()=>({duration:120,delay:120})),y(2,n,()=>l,()=>({duration:120})),t(e,n)};b(Sn,e=>{C(F)===`songs`?e(Cn):C(F)===`samples`?e(wn,1):C(F)===`playlists`?e(Tn,2):C(F)===`radio`?e(En,3):C(F)===`battle`&&e(Dn,4)}),M(xn),i(2),M(pn);var On=w(pn,2),kn=e=>{var n=_t(),r=O(n);be(r,e=>T(kt,e),()=>C(kt));var i=w(r,2),a=e=>{t(e,ht())};b(i,e=>{!P.isPlaying&&!C(At)&&e(a)});var o=w(i,2),s=O(o);Ce(s,21,()=>We,ne,(e,n,r)=>{var i=gt(),a=O(i,!0);M(i),A(()=>{S(i,1,`px-2 py-1 rounded text-[9px] font-bold transition-all uppercase tracking-wider font-mono
                ${C(Dt)===r?`bg-purple-600 text-white`:`text-white/40 hover:text-white/80`}`,`svelte-1o4jdf5`),N(a,C(n).name)}),_(`click`,i,()=>T(Dt,r,!0)),t(e,i)}),M(s),M(o),M(n),_(`click`,n,e=>{e.stopPropagation(),T(Ot,!1)}),_(`click`,o,e=>e.stopPropagation()),t(e,n)};b(On,e=>{C(z)&&C(Ot)&&e(kn)}),be(w(On,2),e=>T(K,e),()=>C(K)),M(fn),A(()=>mn=S(pn,1,`mp-container svelte-1o4jdf5`,null,mn,{closing:xt(),"theme-inst":P.isInstrumental})),_(`click`,fn,function(...e){u.onClose?.apply(this,e)}),_(`click`,pn,e=>e.stopPropagation()),_(`click`,_n,()=>{P.isPlaying||window.dispatchEvent(new CustomEvent(`open-info-panel`))}),_(`click`,yn,function(...e){u.onClose?.apply(this,e)}),_(`touchstart`,xn,en,void 0,!0),_(`touchend`,xn,tn),t(s,fn),Ie()}s([`click`,`touchstart`,`touchend`,`input`,`change`]);export{yt as default};