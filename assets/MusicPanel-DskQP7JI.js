const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/BattlePanel-CC8_VBTu.js","assets/vendor-C6nLembe.js","assets/rolldown-runtime-CMxvf4Kt.js","assets/vendor-Dl9nCA7L.css","assets/BattlePanel-B1S5D9Lq.css"])))=>i.map(i=>d[i]);
import{$r as e,$t as t,A as n,Br as r,Bt as i,C as a,Cr as o,Ct as s,Dt as c,Fr as l,Gr as u,Gt as d,H as f,Hr as p,Ht as m,Ir as h,It as g,J as ee,Jr as te,K as ne,Kr as _,L as re,Ln as ie,Lt as ae,Mr as v,Or as y,P as oe,Pn as se,Pr as b,S as ce,St as le,Ut as ue,Vr as de,Y as fe,Yn as pe,Yr as x,Zn as me,_i as he,_r as S,ai as ge,bi as C,bn as _e,br as ve,ci as w,cr as ye,ct as be,dr as xe,ei as T,fi as E,fr as Se,g as Ce,gr as we,ii as D,j as Te,jr as Ee,kr as De,li as O,ln as Oe,mt as ke,oi as k,pr as Ae,qr as je,ri as Me,rn as Ne,tr as Pe,ui as Fe,vi as Ie,wr as A,xi as j,xt as Le,yi as M,yr as Re,zr as N}from"./vendor-C6nLembe.js";import{t as ze}from"./index-BGQuEvMz.js";import{t as P}from"./AudioCore.svelte-CFLlBFRf.js";import{t as Be}from"./DogsLogo-Chuj6v3Y.js";import{t as Ve}from"./settingsManager.svelte-Chs3TINf.js";import{t as He}from"./SwipeTabNav-DU4rSN1Z.js";var Ue=class{constructor(e,t){j(this,`canvas`,null),j(this,`gl`,null),j(this,`analyser`,null),j(this,`program`,null),j(this,`animationFrameId`,null),j(this,`startTime`,0),j(this,`vertexBuffer`,null),j(this,`audioTexture`,null),j(this,`uniforms`,{}),j(this,`frequencyBuffer`,null),this.canvas=e,this.analyser=t,this.frequencyBuffer=new Uint8Array(t?t.frequencyBinCount:128),this.gl=e.getContext(`webgl`)||e.getContext(`experimental-webgl`),this.gl||console.error(`WebGL not supported by this browser.`)}init(e){if(!this.gl)return;let t=this.gl;this.cleanupProgram();let n=this.compileShader(t.VERTEX_SHADER,`
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
  `},Ke=p(`<div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 animate-pulse svelte-1o4jdf5"><div class="bg-black/75 border border-red-500/30 px-3 py-1.5 rounded text-[10px] font-mono tracking-widest text-red-500 font-bold uppercase shadow-[0_0_15px_rgba(239,68,68,0.25)] select-none svelte-1o4jdf5">NO SIGNAL</div></div>`),qe=p(`<div class="visualizer-container cursor-pointer svelte-1o4jdf5"><canvas class="visualizer-canvas svelte-1o4jdf5"></canvas> <!> <div class="visualizer-hover-overlay svelte-1o4jdf5"><!></div></div>`),Je=p(`<div class="visualizer-container bg-[#050508]/40 border border-white/5 flex items-center justify-center svelte-1o4jdf5"><!></div>`),Ye=p(`<div class="vinyl-record-clicker cursor-pointer w-full h-full svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div><div class="groove g1 svelte-1o4jdf5"></div> <div class="groove g2 svelte-1o4jdf5"></div> <div class="groove g3 svelte-1o4jdf5"></div> <div class="groove g4 svelte-1o4jdf5"></div> <div class="record-label svelte-1o4jdf5"><img loading="lazy"/></div> <div class="spindle svelte-1o4jdf5"></div></div> <div></div></div>`),Xe=p(`<div class="cassette-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="cassette-tape svelte-1o4jdf5"><div class="cassette-label bg-gradient-to-r from-purple-800 to-pink-700 svelte-1o4jdf5"><span class="cassette-track-title svelte-1o4jdf5"> </span> <span class="cassette-brand svelte-1o4jdf5">WEAREDOGS AUDIO</span></div> <div class="cassette-window bg-zinc-950/80 svelte-1o4jdf5"><div></div> <div></div> <div></div> <div></div></div></div></div>`),Ze=p(`<div class="floppy-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="floppy-disk svelte-1o4jdf5"><div class="floppy-corner svelte-1o4jdf5"></div> <div class="floppy-write-protect svelte-1o4jdf5"></div> <div class="floppy-label bg-slate-100 text-slate-900 svelte-1o4jdf5"><div class="floppy-label-stripe bg-red-600 svelte-1o4jdf5"></div> <div class="floppy-label-stripe-blue bg-blue-600 svelte-1o4jdf5"></div> <div class="floppy-label-content svelte-1o4jdf5"><div class="floppy-song truncate font-mono svelte-1o4jdf5"> </div> <div class="floppy-artist truncate font-mono svelte-1o4jdf5"> </div></div></div> <div class="floppy-shutter-door bg-zinc-700 svelte-1o4jdf5"><div></div> <div class="floppy-shutter-opening bg-zinc-950 svelte-1o4jdf5"><div></div></div></div> <div></div></div></div>`),Qe=p(`<div></div>`),$e=p(`<div class="musicbox-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="music-box svelte-1o4jdf5"><div></div> <div class="music-box-interior border border-amber-900/40 svelte-1o4jdf5"><div class="music-box-gears svelte-1o4jdf5"><div></div> <div></div></div> <div class="music-box-drum-wrap svelte-1o4jdf5"><div><div class="music-box-pins svelte-1o4jdf5"><div class="pin pin-1 svelte-1o4jdf5"></div> <div class="pin pin-2 svelte-1o4jdf5"></div> <div class="pin pin-3 svelte-1o4jdf5"></div> <div class="pin pin-4 svelte-1o4jdf5"></div> <div class="pin pin-5 svelte-1o4jdf5"></div> <div class="pin pin-6 svelte-1o4jdf5"></div></div></div></div> <div class="music-box-comb svelte-1o4jdf5"></div></div></div></div>`),et=p(`<span></span>`),tt=p(`<div class="spin-ring svelte-1o4jdf5"></div>`),nt=p(`<div class="volume-popover svelte-1o4jdf5"><button class="ctrl ctrl-xs mr-2 border border-white/10 rounded-full p-1 hover:bg-white/10 svelte-1o4jdf5" aria-label="Mute"><!></button> <input type="range" class="vol-slider-pop svelte-1o4jdf5" min="0" max="1" step="0.01" aria-label="Volume"/> <span class="text-[10px] font-bold text-white/60 min-w-[28px] text-right font-mono select-none svelte-1o4jdf5"> </span></div>`),rt=p(`<div class="eq svelte-1o4jdf5"><div class="eq-b svelte-1o4jdf5"></div> <div class="eq-b svelte-1o4jdf5"></div> <div class="eq-b svelte-1o4jdf5"></div></div>`),it=p(`<span class="svelte-1o4jdf5"></span>`),at=p(`<span class="text-amber-400 flex items-center gap-1 text-[9px] font-bold tracking-wider uppercase bg-amber-500/10 px-1.5 py-0.5 rounded flex-shrink-0 svelte-1o4jdf5" title="Failed to fetch music source from remote database"><!> Error Fetching</span>`),ot=p(`<span class="inst-chip-link svelte-1o4jdf5"><a target="_blank" class="svelte-1o4jdf5">i</a></span>`),st=p(`<div><div class="tr-num svelte-1o4jdf5"><!></div> <img loading="lazy" class="tr-art svelte-1o4jdf5"/> <div class="tr-info svelte-1o4jdf5"><div class="flex items-center gap-1.5 min-w-0 svelte-1o4jdf5"><span> </span> <!></div> <span class="tr-meta svelte-1o4jdf5"> </span></div> <div class="flex items-center gap-2 flex-shrink-0 svelte-1o4jdf5"><!>  <button class="tr-share-btn svelte-1o4jdf5" title="Copy track link" aria-label="Share track"><!></button></div></div>`),ct=p(`<div class="songs-layout svelte-1o4jdf5"><div><div><div class="vinyl-wrapper relative overflow-hidden svelte-1o4jdf5"><!></div> <div class="track-info mt-2 svelte-1o4jdf5"><div class="flex items-center justify-center mb-1.5 svelte-1o4jdf5"><button class="player-share-btn svelte-1o4jdf5" title="Copy track link" aria-label="Share track"><!></button></div> <div><h2> </h2></div> <div><p> </p></div> <div><p> </p></div></div></div> <div class="player-controls-block svelte-1o4jdf5"><div class="progress-row svelte-1o4jdf5"><span class="ptime svelte-1o4jdf5"> </span> <div class="progress-wrap waveform-slider-wrap relative h-9 flex items-end svelte-1o4jdf5"><div class="waveform-bars flex items-end justify-between absolute inset-0 pointer-events-none px-1 h-full svelte-1o4jdf5"></div> <input type="range" class="seek-input absolute inset-0 opacity-0 cursor-pointer w-full h-full svelte-1o4jdf5" min="0" step="0.1" aria-label="Seek"/></div> <span class="ptime svelte-1o4jdf5"> </span></div> <div class="controls-row svelte-1o4jdf5"><button aria-label="Shuffle"><!></button> <button class="ctrl ctrl-md svelte-1o4jdf5" aria-label="Previous"><!></button> <button><!></button> <button class="ctrl ctrl-md svelte-1o4jdf5" aria-label="Next"><!></button> <button aria-label="Repeat"><!></button></div> <div class="w-full flex flex-col items-center gap-1.5 mt-2 px-1 svelte-1o4jdf5"><div><span><!> <span class="svelte-1o4jdf5">VOCAL</span></span> <div class="dj-fader-slot relative svelte-1o4jdf5"><div></div></div> <span><!> <span class="svelte-1o4jdf5">INST</span></span></div></div> <div class="relative flex justify-center items-center gap-3 mt-2 w-full svelte-1o4jdf5"><!> <div class="flex items-center gap-1.5 svelte-1o4jdf5"><button aria-label="Toggle Visualizer"><!></button> <button> </button></div> <div class="relative svelte-1o4jdf5"><button class="ctrl ctrl-xs vol-toggle-btn svelte-1o4jdf5" aria-label="Toggle volume slider"><!></button></div></div></div></div> <div><div class="mobile-close-bar hidden py-2 px-4 border-b border-white/5 flex items-center justify-between svelte-1o4jdf5"><span class="text-xs font-bold text-white/50 svelte-1o4jdf5">Track Library</span> <button class="px-3 py-1 bg-white/5 text-white/75 rounded-lg text-xs font-bold svelte-1o4jdf5">Back to player</button></div> <div class="tl-header flex justify-between items-center gap-3 svelte-1o4jdf5"><div class="flex items-center gap-2 svelte-1o4jdf5"><!><span class="svelte-1o4jdf5">TRACKS</span> <span class="tl-count svelte-1o4jdf5"> </span></div> <div class="flex items-center gap-1.5 ml-auto svelte-1o4jdf5"><span class="text-[9px] text-white/30 font-bold font-sans svelte-1o4jdf5">SORT BY:</span> <select class="bg-black/40 border border-white/10 rounded px-1.5 py-0.5 text-[10px] font-bold text-white/60 outline-none cursor-pointer hover:border-white/20 transition-all font-sans svelte-1o4jdf5"><option class="svelte-1o4jdf5">DEFAULT</option><option class="svelte-1o4jdf5">ARTIST</option><option class="svelte-1o4jdf5">ALBUM</option><option class="svelte-1o4jdf5">YEAR</option><option class="svelte-1o4jdf5">FILENAME</option><option class="svelte-1o4jdf5">GENRE</option><option class="svelte-1o4jdf5">SEASON</option></select></div></div> <div class="tracklist scroll-y svelte-1o4jdf5"></div></div></div>`),lt=p(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><div class="sec-head svelte-1o4jdf5"><h2 class="sec-title svelte-1o4jdf5">Samples</h2> <p class="sec-sub svelte-1o4jdf5">MP3 · MP4 · WAV · OGG · YouTube · Instagram · TikTok</p></div> <div class="drop-zone svelte-1o4jdf5"><!> <p class="drop-title svelte-1o4jdf5">Drop files or paste a link</p> <p class="drop-sub svelte-1o4jdf5">Supports all major audio, video, and streaming links</p> <div class="link-row svelte-1o4jdf5"><input type="url" class="link-input svelte-1o4jdf5" placeholder="https://youtube.com/watch?v=..." aria-label="Paste link"/> <button class="add-btn svelte-1o4jdf5"><!>Add</button></div></div> <div class="empty-state svelte-1o4jdf5"><div class="wip-tape svelte-1o4jdf5">COMING SOON</div> <p class="svelte-1o4jdf5">Your samples will appear here once added.</p></div></div>`),ut=p(`<div class="svc-chip svelte-1o4jdf5"><span class="svelte-1o4jdf5"> </span><span class="svelte-1o4jdf5"> </span><!></div>`),dt=p(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><div class="sec-head svelte-1o4jdf5"><h2 class="sec-title svelte-1o4jdf5">Playlists</h2> <p class="sec-sub svelte-1o4jdf5">Connect Spotify to sync playlists across all services
              automatically</p></div> <div class="spotify-card svelte-1o4jdf5"><div class="sp-icon svelte-1o4jdf5"><svg viewBox="0 0 24 24" fill="currentColor" width="30" height="30" class="svelte-1o4jdf5"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" class="svelte-1o4jdf5"></path></svg></div> <div class="sp-info svelte-1o4jdf5"><h3 class="svelte-1o4jdf5">Connect Spotify</h3> <p class="svelte-1o4jdf5">Import your playlists and sync across services</p></div> <button class="sp-btn svelte-1o4jdf5">Connect <!></button></div> <div class="svc-chips svelte-1o4jdf5"></div> <div class="empty-state mx-auto max-w-[380px] text-center svelte-1o4jdf5"><div class="wip-tape svelte-1o4jdf5">COMING SOON</div> <p class="svelte-1o4jdf5">Connect Spotify to see your playlists, automatically transcribed
              across all services.</p></div></div>`),ft=p(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><div class="sec-head svelte-1o4jdf5"><h2 class="sec-title svelte-1o4jdf5">Radio</h2> <p class="sec-sub svelte-1o4jdf5">Stream live broadcasts, dog shows, and podcast feeds</p></div> <div class="empty-state mx-auto max-w-[380px] text-center svelte-1o4jdf5"><div class="wip-tape svelte-1o4jdf5">COMING SOON</div> <p class="svelte-1o4jdf5">Live radio feeds will appear here once connected.</p></div></div>`),pt=p(`<div class="app-loading-spinner svelte-1o4jdf5" aria-label="Loading..."></div>`),mt=p(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><!></div>`),ht=p(`<div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 animate-pulse svelte-1o4jdf5"><div class="bg-black/75 border border-red-500/30 px-4 py-2 rounded text-[12px] font-mono tracking-widest text-red-500 font-bold uppercase shadow-[0_0_20px_rgba(239,68,68,0.3)] select-none svelte-1o4jdf5">NO SIGNAL</div></div>`),gt=p(`<button> </button>`),_t=p(`<div class="visualizer-container fullscreen cursor-pointer svelte-1o4jdf5"><canvas class="visualizer-canvas svelte-1o4jdf5"></canvas> <!> <div class="visualizer-overlay svelte-1o4jdf5"><div class="flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-lg p-1 border border-white/10 svelte-1o4jdf5"></div></div></div>`),vt=p(`<div class="mp-backdrop svelte-1o4jdf5"><div><header class="panel-header svelte-1o4jdf5"><div class="brand svelte-1o4jdf5"><button class="logo-btn svelte-1o4jdf5" aria-label="Open DOGS Info"><!></button> <h1 class="svelte-1o4jdf5"></h1></div> <button class="close-btn svelte-1o4jdf5" aria-label="Close panel"><!></button></header> <!> <div class="mp-body svelte-1o4jdf5"><!></div> <footer class="mp-footer svelte-1o4jdf5"><div class="mp-status svelte-1o4jdf5"><span class="mp-dot svelte-1o4jdf5"></span><span class="svelte-1o4jdf5">WE ARE DOGS</span></div> <span class="svelte-1o4jdf5">MUSIC</span></footer></div> <!> <canvas class="fader-fx-canvas pointer-events-none svelte-1o4jdf5"></canvas></div>`);function yt(u,p){Ie(p,!0);let j=[{id:`songs`,label:`Songs`,icon:ie},{id:`samples`,label:`Samples`,icon:t},{id:`playlists`,label:`Playlists`,icon:i},{id:`radio`,label:`Radio`,icon:Pe},{id:`battle`,label:`Battle`,icon:ke}],yt=`/img/error_cover.png`;function bt(e){e.target.src.endsWith(yt)||(e.target.src=yt)}let xt=xe(p,`isClosing`,3,!1),St=xe(p,`initialTrackId`,3,null),F=O(`songs`),I=O(`default`),Ct=O(null);T(()=>{x(F)===`battle`&&!x(Ct)&&ze(()=>import(`./BattlePanel-CC8_VBTu.js`).then(e=>{w(Ct,e.default,!0)}),__vite__mapDeps([0,1,2,3,4]))});let L=O(!1),wt=O(!1),Tt=O(!1),Et=O(null),R=E(()=>P.isPlaying&&!xt()),z=O(!1),Dt=O(0),Ot=O(!1),kt=O(null),B=null,V=!1,At=O(!1),jt=E(()=>{let e=x(W)?.id||`default`,t=[],n=0;for(let t=0;t<e.length;t++)n=e.charCodeAt(t)+((n<<5)-n);for(let e=0;e<60;e++){let r=Math.abs(Math.sin(n+e))*80+20;t.push(r)}return t});T(()=>{window.innerWidth<=640&&x(z)&&x(Dt)===0&&x(L)&&w(L,!1)}),T(()=>{P.isPlaying&&w(At,!0)});let Mt=E(()=>!P.isPlaying&&!x(At)?Ge.fragmentShader:We[x(Dt)].fragmentShader);T(()=>{let e=P.analyser;return x(z)&&x(kt)&&!xt()&&(B=new Ue(x(kt),e),B.init(x(Mt)),B.start()),()=>{B&&(B.destroy(),B=null)}}),T(()=>{let e=x(Mt);B&&x(z)&&(B.setPreset(e),B.start())}),T(()=>{x(L)?!history.state?.tracklistOpen&&!V&&(history.pushState({tracklistOpen:!0},``),V=!0):V&&(history.back(),V=!1)}),l(()=>{V&&(history.back(),V=!1)});function Nt(e){!e.state?.tracklistOpen&&x(L)&&(w(L,!1),V=!1)}function Pt(e){x(Tt)&&x(Et)&&!x(Et).contains(e.target)&&!e.target.closest(`.vol-toggle-btn`)&&w(Tt,!1)}let H=[{id:`hollywood`,title:`HOLLYWOOD`,artist:`YG`,album:`THE GENTLEMEN'S CLUB`,cover:`https://data.wearedogs.net/img/covers/2026/yg.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/yg.jpg`,src:`https://data.wearedogs.net/music/2026/HOLLYWOOD.mp3`,instrumental:`https://data.wearedogs.net/music/2026/HOLLYWOOD-free.mp3`,dateAdded:`2026-06-24T03:00:00-05:00`,year:2026,genre:`Hip-Hop`,attrib:`https://the-gentlemens-club.com/`},{id:`chicago`,title:`Chicago`,artist:`Michael Jackson`,album:`Xscape`,cover:`https://data.wearedogs.net/img/covers/2026/mj.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/mj.jpg`,src:`https://data.wearedogs.net/music/2026/Chicago.mp3`,instrumental:`https://data.wearedogs.net/music/2026/Chicago-free.mp3`,dateAdded:`2026-06-24T03:00:00-05:00`,year:2014,genre:`Pop`},{id:`rain`,title:`Pourin Rain (feat. Skratch Bastid)`,artist:`Zeds Dead`,album:`Return to the Return (of the Spectrum of Intergalactic Happiness)`,cover:`https://data.wearedogs.net/img/covers/2026/zd.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/zd.jpg`,src:`https://data.wearedogs.net/music/2026/Pourin.mp3`,instrumental:``,dateAdded:`2026-07-07T018:12:00-05:00`,year:2026,genre:`Electronic`,attrib:`https://shop.zedsdead.net/`},{id:`denchai`,title:`Den Chai`,artist:`The Buddha-Bar Lounge`,album:`Den Chai`,cover:`https://data.wearedogs.net/img/covers/2026/buddha.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/buddha.png`,src:``,instrumental:`https://data.wearedogs.net/music/2026/DENCHAI.mp3`,dateAdded:`2026-07-07T22:34:00-05:00`,year:2008,genre:`Lounge`,attrib:`https://open.spotify.com/artist/0du3MpnxBOpQEie1IV3u9v?si=2UO722ntTE--Ck_Ji7Go7Q`},{id:`rainbow`,title:`Rainbow in the Dark`,artist:`Das Racist`,album:`Shut Up, Dude`,cover:`https://data.wearedogs.net/img/covers/2026/rainbow.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/rainbow.png`,src:`https://data.wearedogs.net/music/2026/rainbow.mp3`,instrumental:`https://data.wearedogs.net/music/2026/rainbow-free.mp3`,dateAdded:`2026-07-08T16:35:00-05:00`,year:2010,genre:`Hip-Hop`,attrib:`https://dasracist.bandcamp.com/album/shut-up-dude`},{id:`hipsong`,title:`Hip Song`,artist:`Toby Fox / Trevor Alan Gomes`,album:`Deltarune`,cover:`https://data.wearedogs.net/img/covers/2026/deltarune.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/deltarune.png`,src:`https://data.wearedogs.net/music/2026/shop.mp3`,instrumental:`https://data.wearedogs.net/music/2026/shop-free.mp3`,dateAdded:`2026-07-09T01:22:00-05:00`,year:2021,genre:`Video Game`,attrib:`https://deltarune.com/`},{id:`sleepless`,title:`Sleepless`,artist:`deadmau5`,album:`> album title goes here <`,cover:`https://data.wearedogs.net/img/covers/2026/sleepless.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/sleepless.png`,src:``,instrumental:`https://data.wearedogs.net/music/2026/sleepless.mp3`,dateAdded:`2026-07-12T04:22:00-05:00`,year:2026,genre:`Electronic`,attrib:`https://deadmau5.com/`},{id:`skitzo`,title:`Skitzo (feat. Young Thug)`,artist:`Travis Scott`,album:`UTOPIA`,cover:`https://data.wearedogs.net/img/covers/2026/utopia.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/utopia.png`,src:`https://data.wearedogs.net/music/2026/skitzo.mp3`,instrumental:`https://data.wearedogs.net/music/2026/skitzo-free.mp3`,dateAdded:`2026-07-16T01:56:00-05:00`,year:2023,genre:`Hip-Hop`,attrib:`https://shop.travisscott.com/`}];function Ft(e){return e.src?e.src.split(`/`).pop():``}function It(e){if(!e.dateAdded)return`Summer`;let t=new Date(e.dateAdded).getMonth();return t===11||t===0||t===1?`Winter`:t>=2&&t<=4?`Spring`:t>=5&&t<=7?`Summer`:`Fall`}let U=E(()=>{let e=[...H];return x(I)===`artist`?e.sort((e,t)=>e.artist.localeCompare(t.artist)):x(I)===`album`?e.sort((e,t)=>e.album.localeCompare(t.album)):x(I)===`year`?e.sort((e,t)=>(e.year||0)-(t.year||0)):x(I)===`filename`?e.sort((e,t)=>Ft(e).localeCompare(Ft(t))):x(I)===`genre`?e.sort((e,t)=>(e.genre||``).localeCompare(t.genre||``)):x(I)===`season`&&e.sort((e,t)=>It(e).localeCompare(It(t))),e}),W=E(()=>H[P.currentTrackIndex]),Lt=O(0),Rt=O(0),zt=O(0),Bt=O(0),Vt=O(0),Ht=O(0),Ut=O(null),Wt=null;function Gt(e,t){e.stopPropagation();let n=`${window.location.origin}/music/${t.id}`;navigator.clipboard.writeText(n).then(()=>{w(Ut,t.id,!0),Wt&&clearTimeout(Wt),Wt=setTimeout(()=>{w(Ut,null)},2e3)}).catch(e=>{console.error(`Failed to copy share link:`,e)})}l(()=>{Wt&&clearTimeout(Wt)}),h(()=>{if(P.init(H),St()){let e=H.findIndex(e=>e.id===St());e!==-1&&P.loadTrack(e,!0)}else if(!P.hasPickedRandomTrack){P.hasPickedRandomTrack=!0;let e=Math.floor(Math.random()*H.length);P.loadTrack(e,!1)}});let G=O(null);function Kt(){let e=document.querySelector(`.track-row[data-track-id="${x(G)}"]`);e&&e.scrollIntoView({block:`nearest`,behavior:`smooth`})}function qt(e){w(G,e.id,!0);let t=H.findIndex(t=>t.id===e.id);P.currentTrackIndex===t&&!P.fetchErrors[e.id]?P.togglePlay():P.loadTrack(t,!0)}function Jt(){window.innerWidth<=640?w(L,!0):w(z,!x(z))}function Yt(){let e=!P.isInstrumental;P.setCrossfade(e)||(Fe(q),x(nn)||(w(nn,!0),setTimeout(()=>{w(nn,!1)},300)),x(q)===5?($(),w(rn,!0),setTimeout(()=>{w(rn,!1)},150)):x(q)===10?$(35):x(q)>5&&x(q)<10?$(8):x(q)>10&&Math.random()<.4&&$(3))}function Xt(e){return!e||isNaN(e)?`0:00`:`${Math.floor(e/60)}:${Math.floor(e%60).toString().padStart(2,`0`)}`}function Zt(e){let t=document.activeElement;if(!(t&&(t.tagName===`INPUT`||t.tagName===`TEXTAREA`||t.isContentEditable))){if(e.shiftKey){if(e.key===`ArrowRight`){e.preventDefault(),w(F,j[(j.findIndex(e=>e.id===x(F))+1)%j.length].id,!0);return}else if(e.key===`ArrowLeft`){e.preventDefault(),w(F,j[(j.findIndex(e=>e.id===x(F))-1+j.length)%j.length].id,!0);return}}if(e.code===`Space`||e.key===` `)x(F)===`songs`&&(e.preventDefault(),P.togglePlay());else if(e.key===`ArrowDown`){if(x(F)===`songs`&&x(U).length>0){e.preventDefault();let t=x(U).findIndex(e=>e.id===x(G));if(t===-1){let e=H[P.currentTrackIndex];t=x(U).findIndex(t=>t.id===e?.id)}let n=(t+1)%x(U).length;w(G,x(U)[n].id,!0),Kt()}}else if(e.key===`ArrowUp`){if(x(F)===`songs`&&x(U).length>0){e.preventDefault();let t=x(U).findIndex(e=>e.id===x(G));if(t===-1){let e=H[P.currentTrackIndex];t=x(U).findIndex(t=>t.id===e?.id)}let n=(t-1+x(U).length)%x(U).length;w(G,x(U)[n].id,!0),Kt()}}else if(e.key===`Enter`&&x(F)===`songs`&&x(G)){e.preventDefault();let t=x(U).find(e=>e.id===x(G));t&&qt(t)}}}let Qt=0,$t=0;function en(e){if(e.target&&(e.target.tagName===`INPUT`||e.target.closest(`button`)||e.target.closest(`.ctrl`))){Qt=0,$t=0;return}Qt=e.touches[0].clientX,$t=e.touches[0].clientY}function tn(e){if(Qt===0||!e.changedTouches||e.changedTouches.length===0)return;let t=e.changedTouches[0].clientX-Qt,n=e.changedTouches[0].clientY-$t;if(Math.abs(t)<=Math.abs(n)||Math.abs(t)<=60)return;let r=j.findIndex(e=>e.id===x(F));r!==-1&&(t<0&&r<j.length-1?w(F,j[r+1].id,!0):t>0&&r>0&&w(F,j[r-1].id,!0))}let K=O(null),q=O(0),nn=O(!1),rn=O(!1),J,Y,X,Z=[],Q=[],an,on=O(!1);T(()=>(x(K)&&cn(),()=>{an&&cancelAnimationFrame(an),window.removeEventListener(`resize`,ln),X&&(X.dispose(),X=null),J=null,Y=null,Z=[],Q=[]})),T(()=>{if(P.currentTrackIndex,x(F),xt(),w(q,0),w(on,!1),J){for(let e of Z)J.remove(e.mesh);for(let e of Q)J.remove(e.mesh)}Z=[],Q=[]});function sn(){let e=document.querySelector(`.dj-fader-knob`);if(!e)return{x:window.innerWidth/2,y:window.innerHeight/2};let t=e.getBoundingClientRect();return{x:t.left+t.width/2,y:window.innerHeight-(t.top+t.height/2)}}function cn(){if(!x(K))return;let e=window.innerWidth,t=window.innerHeight;x(K).width=e,x(K).height=t,J=new re,Y=new oe(0,e,t,0,-1,1),X=new Ce({canvas:x(K),alpha:!0,antialias:!0}),X.setSize(e,t,!1),X.setPixelRatio(Math.min(window.devicePixelRatio,2)),window.addEventListener(`resize`,ln),un()}function ln(){if(!x(K)||!X||!Y)return;let e=window.innerWidth,t=window.innerHeight;x(K).width=e,x(K).height=t,X.setSize(e,t,!1),Y.right=e,Y.top=t,Y.updateProjectionMatrix()}function un(){if(an=requestAnimationFrame(un),!(!J||!Y||!X||!x(K))){if(x(q)>=10&&(w(on,!0),Math.random()<.22)){let e=sn();dn(e.x,e.y)}for(let e=Z.length-1;e>=0;e--){let t=Z[e];t.x+=t.vx,t.y+=t.vy,t.vy+=t.ay,t.life-=t.decay,t.mesh.position.set(t.x,t.y,0),t.mesh.material.opacity=t.life,t.life<=0&&(J.remove(t.mesh),t.mesh.geometry.dispose(),t.mesh.material.dispose(),Z.splice(e,1))}for(let e=Q.length-1;e>=0;e--){let t=Q[e];t.x+=t.vx,t.y+=t.vy,t.life-=t.decay;let n=t.startScale+(1-t.life)*88;t.mesh.scale.set(n,n,1),t.mesh.position.set(t.x,t.y,0),t.mesh.material.opacity=t.life*.16,t.life<=0&&(J.remove(t.mesh),t.mesh.geometry.dispose(),t.mesh.material.dispose(),Q.splice(e,1))}X.render(J,Y)}}function dn(e,t){if(!J)return;let r=new ce(5,8),i=.85+Math.random()*.12,o=new n(r,new Te({color:new a(i,i,i*1.01),transparent:!0,opacity:.06,blending:1}));o.position.set(e,t,0),J.add(o),Q.push({mesh:o,x:e,y:t,vx:(Math.random()-.5)*.55+Math.sin(Date.now()*.001)*.22,vy:Math.random()*.7+1.25,startScale:1,life:1,decay:6e-4+Math.random()*4e-4})}function $(e=25){if(!J||!x(K))return;let t=sn(),r=t.x,i=t.y;for(let t=0;t<e;t++){let e=new n(new ce(1.3,4),new Te({color:new a(Math.random()<.4?16711765:16755200),transparent:!0,opacity:1,blending:2}));e.position.set(r,i,0),J.add(e);let t=Math.random()*Math.PI*2,o=Math.random()*4+2;Z.push({mesh:e,x:r,y:i,vx:Math.cos(t)*o,vy:Math.sin(t)*o,ay:-.15,life:1,decay:.02+Math.random()*.02})}}var fn=vt();je(`keydown`,Me,Zt),je(`popstate`,Me,Nt),je(`click`,Me,Pt);var pn=D(fn);let mn;var hn=D(pn),gn=D(hn),_n=D(gn);Be(D(_n),{size:`panel`}),C(_n);var vn=k(_n,2);vn.textContent=`MUSIC`,C(gn);var yn=k(gn,2);ye(D(yn),{size:20}),C(yn),C(hn);var bn=k(hn,2);He(bn,{get tabs(){return j},get activeTab(){return x(F)},set activeTab(e){w(F,e,!0)}});var xn=k(bn,2),Sn=D(xn),Cn=n=>{var i=ct(),a=D(i);let l;var u=D(a);let p;var m=D(u),h=D(m),re=e=>{var t=qe(),n=D(t);Se(n,e=>w(kt,e),()=>x(kt));var i=k(n,2),a=e=>{r(e,Ke())};b(i,e=>{!P.isPlaying&&!x(At)&&e(a)});var o=k(i,2);Ne(D(o),{size:16,class:`text-white/70`}),C(o),C(t),_(`click`,t,()=>{w(Ot,!0)}),r(e,t)},ie=e=>{var t=Je();Ne(D(t),{size:16,class:`text-white/20`}),C(t),r(e,t)},oe=t=>{var n=de(),i=ge(n),a=t=>{var n=Ye(),i=D(n);let a;var o=k(D(i),8),s=D(o);let c;C(o),M(2),C(i);var l=k(i,2);let u;C(n),e(()=>{a=A(i,1,`vinyl-record svelte-1o4jdf5`,null,a,{spinning:x(R)}),S(s,`src`,P.fetchErrors[x(W).id]||!x(W).cover?yt:x(W).cover),S(s,`alt`,x(W).album),c=A(s,1,`record-art svelte-1o4jdf5`,null,c,{loaded:x(wt)}),u=A(l,1,`tonearm svelte-1o4jdf5`,null,u,{playing:x(R)})}),_(`click`,n,Jt),je(`load`,s,()=>w(wt,!0)),je(`error`,s,bt),te(s),r(t,n)},s=t=>{let n=E(()=>P.duration>0?(1-P.currentTime/P.duration)*.45+.25:.48),i=E(()=>P.duration>0?P.currentTime/P.duration*.45+.25:.48);var a=Xe(),s=D(a),c=D(s),l=D(c),u=D(l,!0);C(l),M(2),C(c);var d=k(c,2),f=D(d);let p;var m=k(f,2);let h;var g=k(m,2);let ee;var te=k(g,2);let ne;C(d),C(s),C(a),e(()=>{N(u,x(W).title),p=A(f,1,`spindle-left bg-zinc-900 svelte-1o4jdf5`,null,p,{spinning:x(R)}),h=A(m,1,`tape-roll-left bg-amber-950/70 svelte-1o4jdf5`,null,h,{spinning:x(R)}),o(m,`width: ${x(n)*46}px; height: ${x(n)*46}px;`),ee=A(g,1,`spindle-right bg-zinc-900 svelte-1o4jdf5`,null,ee,{spinning:x(R)}),ne=A(te,1,`tape-roll-right bg-amber-950/70 svelte-1o4jdf5`,null,ne,{spinning:x(R)}),o(te,`width: ${x(i)*46}px; height: ${x(i)*46}px;`)}),_(`click`,a,Jt),r(t,a)},c=t=>{var n=Ze(),i=D(n),a=k(D(i),4),o=k(D(a),4),s=D(o),c=D(s,!0);C(s);var l=k(s,2),u=D(l,!0);C(l),C(o),C(a);var d=k(a,2),f=D(d);let p;var m=k(f,2),h=D(m);let g;C(m),C(d);var ee=k(d,2);let te;C(i),C(n),e(()=>{N(c,x(W).title),N(u,x(W).artist||`WEAREDOGS`),p=A(f,1,`floppy-shutter-slider bg-zinc-400 svelte-1o4jdf5`,null,p,{open:x(R)}),g=A(h,1,`floppy-magnetic-disc bg-zinc-900 svelte-1o4jdf5`,null,g,{spinning:x(R)}),te=A(ee,1,`floppy-drive-led svelte-1o4jdf5`,null,te,{active:x(R)})}),_(`click`,n,Jt),r(t,n)},l=t=>{var n=$e(),i=D(n),a=D(i);let o;var s=k(a,2),c=D(s),l=D(c);let u;var d=k(l,2);let f;C(c);var p=k(c,2),m=D(p);let h;C(p);var g=k(p,2);Ee(g,20,()=>Array(10),v,(t,n,i)=>{var a=Qe();let o;e(e=>o=A(a,1,`comb-tooth svelte-1o4jdf5`,null,o,e),[()=>({vibrating:x(R)&&i%3==Math.floor(P.currentTime*4)%3})]),r(t,a)}),C(g),C(s),C(i),C(n),e(()=>{o=A(a,1,`music-box-key svelte-1o4jdf5`,null,o,{spinning:x(R)}),u=A(l,1,`music-box-gear gear-1 svelte-1o4jdf5`,null,u,{spinning:x(R)}),f=A(d,1,`music-box-gear gear-2 svelte-1o4jdf5`,null,f,{spinning:x(R)}),h=A(m,1,`music-box-drum bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 svelte-1o4jdf5`,null,h,{spinning:x(R)})}),_(`click`,n,Jt),r(t,n)};b(i,e=>{Ve.musicDeckModel===`vinyl`?e(a):Ve.musicDeckModel===`cassette`?e(s,1):Ve.musicDeckModel===`floppy`?e(c,2):Ve.musicDeckModel===`musicbox`&&e(l,3)}),r(t,n)};b(h,e=>{x(z)&&!x(Ot)?e(re):x(z)&&x(Ot)?e(ie,1):e(oe,-1)}),C(m);var se=k(m,2),ce=D(se),pe=D(ce),he=D(pe),ye=e=>{me(e,{size:12,class:`text-[#22c55e]`})},xe=e=>{c(e,{size:12})};b(he,e=>{x(Ut)===x(W).id?e(ye):e(xe,-1)}),C(pe),C(ce);var T=k(ce,2);let Ce;var Te=D(T);let De;var O=D(Te,!0);C(Te),C(T);var ke=k(T,2);let Me;var Pe=D(ke);let Fe;var Ie=D(Pe,!0);C(Pe),C(ke);var j=k(ke,2);let ze;var Be=D(j);let He;var Ue=D(Be,!0);C(Be),C(j),C(se),C(u);var Ge=k(u,2),lt=D(Ge),ut=D(lt),dt=D(ut,!0);C(ut);var ft=k(ut,2),pt=D(ft);Ee(pt,21,()=>x(jt),v,(t,n,i)=>{let a=E(()=>P.duration>0?P.currentTime/P.duration:0),s=E(()=>i/60);var c=et();let l;e(()=>{l=A(c,1,`waveform-bar transition-colors duration-100 rounded-t svelte-1o4jdf5`,null,l,{active:x(s)<=x(a)}),o(c,`height: ${x(n)??``}%; width: 3px;`)}),r(t,c)}),C(pt);var mt=k(pt,2);we(mt),C(ft);var ht=k(ft,2),gt=D(ht,!0);C(ht),C(lt);var _t=k(lt,2),vt=D(_t);let xt;s(D(vt),{size:15}),C(vt);var St=k(vt,2);le(D(St),{size:19}),C(St);var F=k(St,2);let Ct;var B=D(F),V=e=>{be(e,{size:22})},Mt=e=>{r(e,tt())},Nt=e=>{d(e,{size:22,fill:`currentColor`})},Pt=e=>{ue(e,{size:22,fill:`currentColor`})};b(B,e=>{P.fetchErrors[x(W).id]?e(V):P.isLoading?e(Mt,1):P.isPlaying?e(Nt,2):e(Pt,-1)}),C(F);var Ft=k(F,2);Le(D(Ft),{size:19}),C(Ft);var It=k(Ft,2);let Wt;var Kt=D(It),Zt=e=>{ae(e,{size:15})},Qt=e=>{g(e,{size:15})};b(Kt,e=>{P.repeatMode===2?e(Zt):e(Qt,-1)}),C(It),C(_t);var $t=k(_t,2),en=D($t);let tn;var K=D(en);let J;t(D(K),{size:12}),M(2),C(K);var Y=k(K,2),X=D(Y);let Z;C(Y);var Q=k(Y,2);let an;_e(D(Q),{size:12}),M(2),C(Q),C(en),C($t);var on=k($t,2),sn=D(on),cn=t=>{var n=nt(),i=D(n),a=D(i),o=e=>{ee(e,{size:12,class:`text-red-400`})},s=e=>{fe(e,{size:12})};b(a,e=>{P.isMuted||P.volume===0?e(o):e(s,-1)}),C(i);var c=k(i,2);we(c);var l=k(c,2),u=D(l);C(l),C(n),Se(n,e=>w(Et,e),()=>x(Et)),e(e=>{Re(c,P.volume),N(u,`${e??``}%`)},[()=>Math.round(P.volume*100)]),_(`click`,i,()=>P.toggleMute()),_(`input`,c,e=>P.setVolume(parseFloat(e.target.value))),r(t,n)};b(sn,e=>{x(Tt)&&e(cn)});var ln=k(sn,2),un=D(ln);let dn;ne(D(un),{size:13}),C(un);var $=k(un,2),fn=D($,!0);C($),C(ln);var pn=k(ln,2),mn=D(pn),hn=D(mn),gn=e=>{ee(e,{size:13,class:`text-red-400`})},_n=e=>{fe(e,{size:13})};b(hn,e=>{P.isMuted||P.volume===0?e(gn):e(_n,-1)}),C(mn),C(pn),C(on),C(Ge),C(a);var vn=k(a,2);let yn;var bn=D(vn),xn=k(D(bn),2);C(bn);var Sn=k(bn,2),Cn=D(Sn),wn=D(Cn);Oe(wn,{size:13});var Tn=k(wn,3),En=D(Tn,!0);C(Tn),C(Cn);var Dn=k(Cn,2),On=k(D(Dn),2),kn=D(On);kn.value=kn.__value=`default`;var An=k(kn);An.value=An.__value=`artist`;var jn=k(An);jn.value=jn.__value=`album`;var Mn=k(jn);Mn.value=Mn.__value=`year`;var Nn=k(Mn);Nn.value=Nn.__value=`filename`;var Pn=k(Nn);Pn.value=Pn.__value=`genre`;var Fn=k(Pn);Fn.value=Fn.__value=`season`,C(On),C(Dn),C(Sn);var In=k(Sn,2);Ee(In,21,()=>x(U),v,(t,n,i)=>{var a=st();let o;var s=D(a),l=D(s),u=e=>{r(e,rt())},d=e=>{var t=it();t.textContent=i+1,r(e,t)};b(l,e=>{H[P.currentTrackIndex].id===x(n).id&&P.isPlaying?e(u):e(d,-1)}),C(s);var f=k(s,2),p=k(f,2),m=D(p),h=D(m);let g;var ee=D(h,!0);C(h);var ne=k(h,2),re=e=>{var t=at();be(D(t),{size:10}),M(),C(t),r(e,t)};b(ne,e=>{P.fetchErrors[x(n).id]&&e(re)}),C(m);var ie=k(m,2),ae=D(ie);C(ie),C(p);var v=k(p,2),y=D(v),oe=t=>{var i=ot(),a=D(i);C(i),e(()=>S(a,`href`,x(n).attrib)),_(`click`,a,e=>e.stopPropagation()),r(t,i)};b(y,e=>{x(n).attrib&&e(oe)});var se=k(y,2),ce=D(se),le=e=>{me(e,{size:12,class:`text-[#22c55e]`})},ue=e=>{c(e,{size:12})};b(ce,e=>{x(Ut)===x(n).id?e(le):e(ue,-1)}),C(se),C(v),C(a),e(()=>{o=A(a,1,`track-row svelte-1o4jdf5`,null,o,{active:H[P.currentTrackIndex].id===x(n).id,"kb-focused":x(G)===x(n).id,"fetch-error":P.fetchErrors[x(n).id]}),S(a,`data-track-id`,x(n).id),S(f,`src`,P.fetchErrors[x(n).id]||!x(n).cover?yt:x(n).cover),S(f,`alt`,x(n).album),g=A(h,1,`tr-title svelte-1o4jdf5`,null,g,{"line-through":P.fetchErrors[x(n).id],"opacity-50":P.fetchErrors[x(n).id]}),N(ee,x(n).title),N(ae,`${x(n).artist??``} · ${x(n).album??``} (${(x(n).year||``)??``})`)}),_(`click`,a,()=>qt(x(n))),je(`error`,f,bt),te(f),_(`click`,se,e=>Gt(e,x(n))),r(t,a)}),C(In),C(vn),C(i),e((e,t)=>{l=A(a,1,`player-side svelte-1o4jdf5`,null,l,{"tracklist-open":x(L)}),p=A(u,1,`player-top-block transition-all duration-300 ease-in-out svelte-1o4jdf5`,null,p,{"opacity-0":x(L),"scale-95":x(L),"pointer-events-none":x(L)}),Ce=A(T,1,`scroll-container svelte-1o4jdf5`,null,Ce,{overflowing:x(Rt)>x(Lt)}),o(T,`--scroll-dist: -${x(Rt)-x(Lt)}px`),De=A(Te,1,`track-title scroll-text svelte-1o4jdf5`,null,De,{"animate-scroll":x(Rt)>x(Lt)}),N(O,x(W).title),Me=A(ke,1,`scroll-container svelte-1o4jdf5`,null,Me,{overflowing:x(Bt)>x(zt)}),o(ke,`--scroll-dist: -${x(Bt)-x(zt)}px`),Fe=A(Pe,1,`track-artist scroll-text svelte-1o4jdf5`,null,Fe,{"animate-scroll":x(Bt)>x(zt)}),N(Ie,x(W).artist),ze=A(j,1,`scroll-container svelte-1o4jdf5`,null,ze,{overflowing:x(Ht)>x(Vt)}),o(j,`--scroll-dist: -${x(Ht)-x(Vt)}px`),He=A(Be,1,`track-album scroll-text svelte-1o4jdf5`,null,He,{"animate-scroll":x(Ht)>x(Vt)}),N(Ue,x(W).album),N(dt,e),S(mt,`max`,P.duration||100),Re(mt,P.currentTime),N(gt,t),xt=A(vt,1,`ctrl ctrl-sm svelte-1o4jdf5`,null,xt,{"active-ctrl":P.isShuffled}),Ct=A(F,1,`ctrl ctrl-play svelte-1o4jdf5`,null,Ct,{"ctrl-error":P.fetchErrors[x(W).id]}),S(F,`aria-label`,P.isPlaying?`Pause`:`Play`),Wt=A(It,1,`ctrl ctrl-sm svelte-1o4jdf5`,null,Wt,{"active-ctrl":P.repeatMode>0}),tn=A(en,1,`dj-crossfader svelte-1o4jdf5`,null,tn,{"fader-flash":x(rn),"fader-fried":x(q)>=10}),J=A(K,1,`fader-label left-label flex items-center gap-1 svelte-1o4jdf5`,null,J,{active:!P.isInstrumental}),Z=A(X,1,`dj-fader-knob svelte-1o4jdf5`,null,Z,{right:P.isInstrumental,"knob-jiggle":x(nn),fried:x(q)>=10}),an=A(Q,1,`fader-label right-label flex items-center gap-1 svelte-1o4jdf5`,null,an,{active:P.isInstrumental}),dn=A(un,1,`ctrl ctrl-xs svelte-1o4jdf5`,null,dn,{"active-ctrl":x(z)}),A($,1,`w-[90px] h-[20px] flex items-center justify-center rounded text-[9px] font-bold transition-all font-mono uppercase tracking-wider select-none cursor-pointer
                      ${x(z)?`bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/25 active:scale-95`:`bg-transparent border border-white/5 text-white/20 hover:text-white/40 hover:border-white/10`}`,`svelte-1o4jdf5`),S($,`title`,x(z)?`Click to cycle presets`:`Click to enable visualizer`),N(fn,We[x(Dt)].name),yn=A(vn,1,`tracklist-side svelte-1o4jdf5`,null,yn,{"show-mobile":x(L)}),N(En,H.length)},[()=>Xt(P.currentTime),()=>Xt(P.duration)]),_(`click`,pe,e=>Gt(e,x(W))),Ae(Te,`clientWidth`,e=>w(Rt,e)),Ae(T,`clientWidth`,e=>w(Lt,e)),Ae(Pe,`clientWidth`,e=>w(Bt,e)),Ae(ke,`clientWidth`,e=>w(zt,e)),Ae(Be,`clientWidth`,e=>w(Ht,e)),Ae(j,`clientWidth`,e=>w(Vt,e)),_(`input`,mt,e=>{P.seek(parseFloat(e.target.value))}),_(`change`,mt,e=>{P.play(parseFloat(e.target.value))}),_(`click`,vt,()=>P.isShuffled=!P.isShuffled),_(`click`,St,()=>P.prevTrack()),_(`click`,F,()=>P.togglePlay()),_(`click`,Ft,()=>P.nextTrack()),_(`click`,It,()=>{P.repeatMode=(P.repeatMode+1)%3}),_(`click`,en,Yt),_(`click`,un,()=>{w(z,!x(z))}),_(`click`,$,()=>{x(z)?w(Dt,(x(Dt)+1)%We.length):w(z,!0)}),_(`click`,mn,()=>{w(Tt,!x(Tt))}),_(`click`,xn,()=>{w(L,!1)}),ve(On,()=>x(I),e=>w(I,e)),y(1,i,()=>f,()=>({duration:120,delay:120})),y(2,i,()=>f,()=>({duration:120})),r(n,i)},wn=e=>{var n=lt(),i=k(D(n),2),a=D(i);t(a,{size:36});var o=k(a,6),s=k(D(o),2);m(D(s),{size:15}),M(),C(s),C(o),C(i),M(2),C(n),y(1,n,()=>f,()=>({duration:120,delay:120})),y(2,n,()=>f,()=>({duration:120})),r(e,n)},Tn=t=>{var n=dt(),i=k(D(n),2),a=k(D(i),4);pe(k(D(a)),{size:15}),C(a),C(i);var s=k(i,2);Ee(s,20,()=>[{name:`Apple Music`,color:`#fc3c44`,icon:`🎵`},{name:`YouTube Music`,color:`#ff0000`,icon:`▶`},{name:`Amazon Music`,color:`#00a8e0`,icon:`♪`},{name:`Tidal`,color:`#00d4f5`,icon:`〰`}],v,(t,n)=>{var i=ut(),a=D(i),s=D(a,!0);C(a);var c=k(a),l=D(c,!0);C(c),se(k(c),{size:11}),C(i),e(()=>{o(i,`--sc:${n.color??``}`),N(s,n.icon),N(l,n.name)}),r(t,i)}),C(s),M(2),C(n),y(1,n,()=>f,()=>({duration:120,delay:120})),y(2,n,()=>f,()=>({duration:120})),r(t,n)},En=e=>{var t=ft();y(1,t,()=>f,()=>({duration:120,delay:120})),y(2,t,()=>f,()=>({duration:120})),r(e,t)},Dn=e=>{var t=mt(),n=D(t),i=e=>{let t=E(()=>x(Ct));var n=de();De(ge(n),()=>x(t),(e,t)=>{t(e,{get audioCore(){return P}})}),r(e,n)},a=e=>{r(e,pt())};b(n,e=>{x(Ct)?e(i):e(a,-1)}),C(t),y(1,t,()=>f,()=>({duration:120,delay:120})),y(2,t,()=>f,()=>({duration:120})),r(e,t)};b(Sn,e=>{x(F)===`songs`?e(Cn):x(F)===`samples`?e(wn,1):x(F)===`playlists`?e(Tn,2):x(F)===`radio`?e(En,3):x(F)===`battle`&&e(Dn,4)}),C(xn),M(2),C(pn);var On=k(pn,2),kn=t=>{var n=_t(),i=D(n);Se(i,e=>w(kt,e),()=>x(kt));var a=k(i,2),o=e=>{r(e,ht())};b(a,e=>{!P.isPlaying&&!x(At)&&e(o)});var s=k(a,2),c=D(s);Ee(c,21,()=>We,v,(t,n,i)=>{var a=gt(),o=D(a,!0);C(a),e(()=>{A(a,1,`px-2 py-1 rounded text-[9px] font-bold transition-all uppercase tracking-wider font-mono
                ${x(Dt)===i?`bg-purple-600 text-white`:`text-white/40 hover:text-white/80`}`,`svelte-1o4jdf5`),N(o,x(n).name)}),_(`click`,a,()=>w(Dt,i,!0)),r(t,a)}),C(c),C(s),C(n),_(`click`,n,e=>{e.stopPropagation(),w(Ot,!1)}),_(`click`,s,e=>e.stopPropagation()),r(t,n)};b(On,e=>{x(z)&&x(Ot)&&e(kn)}),Se(k(On,2),e=>w(K,e),()=>x(K)),C(fn),e(()=>mn=A(pn,1,`mp-container svelte-1o4jdf5`,null,mn,{closing:xt(),"theme-inst":P.isInstrumental})),_(`click`,fn,function(...e){p.onClose?.apply(this,e)}),_(`click`,pn,e=>e.stopPropagation()),_(`click`,_n,()=>{P.isPlaying||window.dispatchEvent(new CustomEvent(`open-info-panel`))}),_(`click`,yn,function(...e){p.onClose?.apply(this,e)}),_(`touchstart`,xn,en,void 0,!0),_(`touchend`,xn,tn),r(u,fn),he()}u([`click`,`touchstart`,`touchend`,`input`,`change`]);export{yt as default};