const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/BattlePanel-BuVjmixV.js","assets/vendor-C0XfeHh8.js","assets/rolldown-runtime-CMxvf4Kt.js","assets/vendor-Dl9nCA7L.css","assets/BattlePanel-B1S5D9Lq.css"])))=>i.map(i=>d[i]);
import{C as e,Ci as t,Cr as n,Ct as r,Dr as i,Er as a,F as o,Fr as s,Gr as c,Gt as l,H as u,Hr as d,Ht as f,In as p,Jr as m,Lr as h,M as g,Mr as _,Pr as v,Qn as y,Qr as b,R as ee,Rr as te,Rt as ne,Si as x,Sn as re,Sr as ie,Tt as ae,Ur as S,Wr as oe,Wt as se,X as ce,Xr as le,Y as ue,Yr as C,Zr as de,_ as fe,an as pe,bi as me,br as w,ci as he,di as T,dn as ge,dr as _e,er as ve,fi as E,gr as ye,gt as be,hi as D,hr as xe,ir as Se,j as Ce,jr as O,kt as we,li as k,mr as Te,ni as A,oi as Ee,pi as De,q as Oe,qt as ke,ri as j,si as M,tn as Ae,ut as je,w as Me,wi as N,wt as Ne,xi as Pe,yr as Fe,zn as Ie,zr as Le,zt as Re}from"./vendor-C0XfeHh8.js";import{t as ze}from"./index-EgxWF8No.js";import{t as P}from"./AudioCore.svelte-cEKiyYHM.js";import{t as Be}from"./DogsLogo-CqgWGZtA.js";import{t as Ve}from"./settingsManager.svelte-USV4IZR0.js";import He from"./SwipeTabNav-nh5rFR9C.js";var Ue=class{constructor(e,t){N(this,`canvas`,null),N(this,`gl`,null),N(this,`analyser`,null),N(this,`program`,null),N(this,`animationFrameId`,null),N(this,`startTime`,0),N(this,`vertexBuffer`,null),N(this,`audioTexture`,null),N(this,`uniforms`,{}),N(this,`frequencyBuffer`,null),this.canvas=e,this.analyser=t,this.frequencyBuffer=new Uint8Array(t?t.frequencyBinCount:128),this.gl=e.getContext(`webgl`)||e.getContext(`experimental-webgl`),this.gl||console.error(`WebGL not supported by this browser.`)}init(e){if(!this.gl)return;let t=this.gl;this.cleanupProgram();let n=this.compileShader(t.VERTEX_SHADER,`
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
  `},Ke=c(`<div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 animate-pulse svelte-1o4jdf5"><div class="bg-black/75 border border-red-500/30 px-3 py-1.5 rounded text-[10px] font-mono tracking-widest text-red-500 font-bold uppercase shadow-[0_0_15px_rgba(239,68,68,0.25)] select-none svelte-1o4jdf5">NO SIGNAL</div></div>`),qe=c(`<div class="visualizer-container cursor-pointer svelte-1o4jdf5"><canvas class="visualizer-canvas svelte-1o4jdf5"></canvas> <!> <div class="visualizer-hover-overlay svelte-1o4jdf5"><!></div></div>`),Je=c(`<div class="visualizer-container bg-[#050508]/40 border border-white/5 flex items-center justify-center svelte-1o4jdf5"><!></div>`),Ye=c(`<div class="vinyl-record-clicker cursor-pointer w-full h-full svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div><div class="groove g1 svelte-1o4jdf5"></div> <div class="groove g2 svelte-1o4jdf5"></div> <div class="groove g3 svelte-1o4jdf5"></div> <div class="groove g4 svelte-1o4jdf5"></div> <div class="record-label svelte-1o4jdf5"><img loading="lazy"/></div> <div class="spindle svelte-1o4jdf5"></div></div> <div></div></div>`),Xe=c(`<div class="cassette-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="cassette-tape svelte-1o4jdf5"><div class="cassette-label bg-gradient-to-r from-purple-800 to-pink-700 svelte-1o4jdf5"><span class="cassette-track-title svelte-1o4jdf5"> </span> <span class="cassette-brand svelte-1o4jdf5">WEAREDOGS AUDIO</span></div> <div class="cassette-window bg-zinc-950/80 svelte-1o4jdf5"><div></div> <div></div> <div></div> <div></div></div></div></div>`),Ze=c(`<div class="floppy-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="floppy-disk svelte-1o4jdf5"><div class="floppy-corner svelte-1o4jdf5"></div> <div class="floppy-write-protect svelte-1o4jdf5"></div> <div class="floppy-label bg-slate-100 text-slate-900 svelte-1o4jdf5"><div class="floppy-label-stripe bg-red-600 svelte-1o4jdf5"></div> <div class="floppy-label-stripe-blue bg-blue-600 svelte-1o4jdf5"></div> <div class="floppy-label-content svelte-1o4jdf5"><div class="floppy-song truncate font-mono svelte-1o4jdf5"> </div> <div class="floppy-artist truncate font-mono svelte-1o4jdf5"> </div></div></div> <div class="floppy-shutter-door bg-zinc-700 svelte-1o4jdf5"><div></div> <div class="floppy-shutter-opening bg-zinc-950 svelte-1o4jdf5"><div></div></div></div> <div></div></div></div>`),Qe=c(`<div></div>`),$e=c(`<div class="musicbox-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="music-box svelte-1o4jdf5"><div></div> <div class="music-box-interior border border-amber-900/40 svelte-1o4jdf5"><div class="music-box-gears svelte-1o4jdf5"><div></div> <div></div></div> <div class="music-box-drum-wrap svelte-1o4jdf5"><div><div class="music-box-pins svelte-1o4jdf5"><div class="pin pin-1 svelte-1o4jdf5"></div> <div class="pin pin-2 svelte-1o4jdf5"></div> <div class="pin pin-3 svelte-1o4jdf5"></div> <div class="pin pin-4 svelte-1o4jdf5"></div> <div class="pin pin-5 svelte-1o4jdf5"></div> <div class="pin pin-6 svelte-1o4jdf5"></div></div></div></div> <div class="music-box-comb svelte-1o4jdf5"></div></div></div></div>`),et=c(`<span></span>`),tt=c(`<div class="spin-ring svelte-1o4jdf5"></div>`),nt=c(`<div class="volume-popover svelte-1o4jdf5"><button class="ctrl ctrl-xs mr-2 border border-white/10 rounded-full p-1 hover:bg-white/10 svelte-1o4jdf5" aria-label="Mute"><!></button> <input type="range" class="vol-slider-pop svelte-1o4jdf5" min="0" max="1" step="0.01" aria-label="Volume"/> <span class="text-[10px] font-bold text-white/60 min-w-[28px] text-right font-mono select-none svelte-1o4jdf5"> </span></div>`),rt=c(`<div class="eq svelte-1o4jdf5"><div class="eq-b svelte-1o4jdf5"></div> <div class="eq-b svelte-1o4jdf5"></div> <div class="eq-b svelte-1o4jdf5"></div></div>`),it=c(`<span class="svelte-1o4jdf5"></span>`),at=c(`<span class="text-amber-400 flex items-center gap-1 text-[9px] font-bold tracking-wider uppercase bg-amber-500/10 px-1.5 py-0.5 rounded flex-shrink-0 svelte-1o4jdf5" title="Failed to fetch music source from remote database"><!> Error Fetching</span>`),ot=c(`<span class="inst-chip-link svelte-1o4jdf5"><a target="_blank" class="svelte-1o4jdf5">i</a></span>`),st=c(`<div><div class="tr-num svelte-1o4jdf5"><!></div> <img loading="lazy" class="tr-art svelte-1o4jdf5"/> <div class="tr-info svelte-1o4jdf5"><div class="flex items-center gap-1.5 min-w-0 svelte-1o4jdf5"><span> </span> <!></div> <span class="tr-meta svelte-1o4jdf5"> </span></div> <div class="flex items-center gap-2 flex-shrink-0 svelte-1o4jdf5"><!>  <button class="tr-share-btn svelte-1o4jdf5" title="Copy track link" aria-label="Share track"><!></button></div></div>`),ct=c(`<div class="songs-layout svelte-1o4jdf5"><div><div><div class="vinyl-wrapper relative overflow-hidden svelte-1o4jdf5"><!></div> <div class="track-info mt-2 svelte-1o4jdf5"><div class="flex items-center justify-center mb-1.5 svelte-1o4jdf5"><button class="player-share-btn svelte-1o4jdf5" title="Copy track link" aria-label="Share track"><!></button></div> <div><h2> </h2></div> <div><p> </p></div> <div><p> </p></div></div></div> <div class="player-controls-block svelte-1o4jdf5"><div class="progress-row svelte-1o4jdf5"><span class="ptime svelte-1o4jdf5"> </span> <div class="progress-wrap waveform-slider-wrap relative h-9 flex items-end svelte-1o4jdf5"><div class="waveform-bars flex items-end justify-between absolute inset-0 pointer-events-none px-1 h-full svelte-1o4jdf5"></div> <input type="range" class="seek-input absolute inset-0 opacity-0 cursor-pointer w-full h-full svelte-1o4jdf5" min="0" step="0.1" aria-label="Seek"/></div> <span class="ptime svelte-1o4jdf5"> </span></div> <div class="controls-row svelte-1o4jdf5"><button aria-label="Shuffle"><!></button> <button class="ctrl ctrl-md svelte-1o4jdf5" aria-label="Previous"><!></button> <button><!></button> <button class="ctrl ctrl-md svelte-1o4jdf5" aria-label="Next"><!></button> <button aria-label="Repeat"><!></button></div> <div class="w-full flex flex-col items-center gap-1.5 mt-2 px-1 svelte-1o4jdf5"><div><span><!> <span class="svelte-1o4jdf5">VOCAL</span></span> <div class="dj-fader-slot relative svelte-1o4jdf5"><div></div></div> <span><!> <span class="svelte-1o4jdf5">INST</span></span></div></div> <div class="relative flex justify-center items-center gap-3 mt-2 w-full svelte-1o4jdf5"><!> <div class="flex items-center gap-1.5 svelte-1o4jdf5"><button aria-label="Toggle Visualizer"><!></button> <button> </button></div> <div class="relative svelte-1o4jdf5"><button class="ctrl ctrl-xs vol-toggle-btn svelte-1o4jdf5" aria-label="Toggle volume slider"><!></button></div></div></div></div> <div><div class="mobile-close-bar hidden py-2 px-4 border-b border-white/5 flex items-center justify-between svelte-1o4jdf5"><span class="text-xs font-bold text-white/50 svelte-1o4jdf5">Track Library</span> <button class="px-3 py-1 bg-white/5 text-white/75 rounded-lg text-xs font-bold svelte-1o4jdf5">Back to player</button></div> <div class="tl-header flex justify-between items-center gap-3 svelte-1o4jdf5"><div class="flex items-center gap-2 svelte-1o4jdf5"><!><span class="svelte-1o4jdf5">TRACKS</span> <span class="tl-count svelte-1o4jdf5"> </span></div> <div class="flex items-center gap-1.5 ml-auto svelte-1o4jdf5"><span class="text-[9px] text-white/30 font-bold font-sans svelte-1o4jdf5">SORT BY:</span> <select class="bg-black/40 border border-white/10 rounded px-1.5 py-0.5 text-[10px] font-bold text-white/60 outline-none cursor-pointer hover:border-white/20 transition-all font-sans svelte-1o4jdf5"><option class="svelte-1o4jdf5">DEFAULT</option><option class="svelte-1o4jdf5">ARTIST</option><option class="svelte-1o4jdf5">ALBUM</option><option class="svelte-1o4jdf5">YEAR</option><option class="svelte-1o4jdf5">FILENAME</option><option class="svelte-1o4jdf5">GENRE</option><option class="svelte-1o4jdf5">SEASON</option></select></div></div> <div class="tracklist scroll-y svelte-1o4jdf5"></div></div></div>`),lt=c(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><div class="sec-head svelte-1o4jdf5"><h2 class="sec-title svelte-1o4jdf5">Samples</h2> <p class="sec-sub svelte-1o4jdf5">MP3 · MP4 · WAV · OGG · YouTube · Instagram · TikTok</p></div> <div class="drop-zone svelte-1o4jdf5"><!> <p class="drop-title svelte-1o4jdf5">Drop files or paste a link</p> <p class="drop-sub svelte-1o4jdf5">Supports all major audio, video, and streaming links</p> <div class="link-row svelte-1o4jdf5"><input type="url" class="link-input svelte-1o4jdf5" placeholder="https://youtube.com/watch?v=..." aria-label="Paste link"/> <button class="add-btn svelte-1o4jdf5"><!>Add</button></div></div> <div class="empty-state svelte-1o4jdf5"><div class="wip-tape svelte-1o4jdf5">COMING SOON</div> <p class="svelte-1o4jdf5">Your samples will appear here once added.</p></div></div>`),ut=c(`<div class="svc-chip svelte-1o4jdf5"><span class="svelte-1o4jdf5"> </span><span class="svelte-1o4jdf5"> </span><!></div>`),dt=c(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><div class="sec-head svelte-1o4jdf5"><h2 class="sec-title svelte-1o4jdf5">Playlists</h2> <p class="sec-sub svelte-1o4jdf5">Connect Spotify to sync playlists across all services
              automatically</p></div> <div class="spotify-card svelte-1o4jdf5"><div class="sp-icon svelte-1o4jdf5"><svg viewBox="0 0 24 24" fill="currentColor" width="30" height="30" class="svelte-1o4jdf5"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" class="svelte-1o4jdf5"></path></svg></div> <div class="sp-info svelte-1o4jdf5"><h3 class="svelte-1o4jdf5">Connect Spotify</h3> <p class="svelte-1o4jdf5">Import your playlists and sync across services</p></div> <button class="sp-btn svelte-1o4jdf5">Connect <!></button></div> <div class="svc-chips svelte-1o4jdf5"></div> <div class="empty-state mx-auto max-w-[380px] text-center svelte-1o4jdf5"><div class="wip-tape svelte-1o4jdf5">COMING SOON</div> <p class="svelte-1o4jdf5">Connect Spotify to see your playlists, automatically transcribed
              across all services.</p></div></div>`),ft=c(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><div class="sec-head svelte-1o4jdf5"><h2 class="sec-title svelte-1o4jdf5">Radio</h2> <p class="sec-sub svelte-1o4jdf5">Stream live broadcasts, dog shows, and podcast feeds</p></div> <div class="empty-state mx-auto max-w-[380px] text-center svelte-1o4jdf5"><div class="wip-tape svelte-1o4jdf5">COMING SOON</div> <p class="svelte-1o4jdf5">Live radio feeds will appear here once connected.</p></div></div>`),pt=c(`<div class="app-loading-spinner svelte-1o4jdf5" aria-label="Loading..."></div>`),mt=c(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><!></div>`),ht=c(`<div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 animate-pulse svelte-1o4jdf5"><div class="bg-black/75 border border-red-500/30 px-4 py-2 rounded text-[12px] font-mono tracking-widest text-red-500 font-bold uppercase shadow-[0_0_20px_rgba(239,68,68,0.3)] select-none svelte-1o4jdf5">NO SIGNAL</div></div>`),gt=c(`<button> </button>`),_t=c(`<div class="visualizer-container fullscreen cursor-pointer svelte-1o4jdf5"><canvas class="visualizer-canvas svelte-1o4jdf5"></canvas> <!> <div class="visualizer-overlay svelte-1o4jdf5"><div class="flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-lg p-1 border border-white/10 svelte-1o4jdf5"></div></div></div>`),vt=c(`<div class="mp-backdrop svelte-1o4jdf5"><div><header class="panel-header svelte-1o4jdf5"><div class="brand svelte-1o4jdf5"><button class="logo-btn svelte-1o4jdf5" aria-label="Open DOGS Info"><!></button> <h1 class="svelte-1o4jdf5"></h1></div> <button class="close-btn svelte-1o4jdf5" aria-label="Close panel"><!></button></header> <!> <div class="mp-body svelte-1o4jdf5"><!></div> <footer class="mp-footer svelte-1o4jdf5"><div class="mp-status svelte-1o4jdf5"><span class="mp-dot svelte-1o4jdf5"></span><span class="svelte-1o4jdf5">WE ARE DOGS</span></div> <span class="svelte-1o4jdf5">MUSIC</span></footer></div> <!> <canvas class="fader-fx-canvas pointer-events-none svelte-1o4jdf5"></canvas></div>`);function yt(c,m){Pe(m,!0);let N=[{id:`songs`,label:`Songs`,icon:Ie},{id:`samples`,label:`Samples`,icon:Ae},{id:`playlists`,label:`Playlists`,icon:f},{id:`radio`,label:`Radio`,icon:Se},{id:`battle`,label:`Battle`,icon:be}],yt=`/img/error_cover.png`;function bt(e){e.target.src.endsWith(yt)||(e.target.src=yt)}let xt=Te(m,`isClosing`,3,!1),St=Te(m,`initialTrackId`,3,null),F=E(`songs`),I=E(`default`),Ct=E(null);j(()=>{b(F)===`battle`&&!b(Ct)&&ze(()=>import(`./BattlePanel-BuVjmixV.js`).then(e=>{T(Ct,e.default,!0)}),__vite__mapDeps([0,1,2,3,4]))});let L=E(!1),wt=E(!1),Tt=E(!1),Et=E(null),R=D(()=>P.isPlaying&&!xt()),z=E(!1),Dt=E(0),Ot=E(!1),kt=E(null),B=null,V=!1,At=E(!1),jt=D(()=>{let e=b(W)?.id||`default`,t=[],n=0;for(let t=0;t<e.length;t++)n=e.charCodeAt(t)+((n<<5)-n);for(let e=0;e<60;e++){let r=Math.abs(Math.sin(n+e))*80+20;t.push(r)}return t});j(()=>{window.innerWidth<=640&&b(z)&&b(Dt)===0&&b(L)&&T(L,!1)}),j(()=>{P.isPlaying&&T(At,!0)});let Mt=D(()=>!P.isPlaying&&!b(At)?Ge.fragmentShader:We[b(Dt)].fragmentShader);j(()=>{let e=P.analyser;return b(z)&&b(kt)&&!xt()&&(B=new Ue(b(kt),e),B.init(b(Mt)),B.start()),()=>{B&&(B.destroy(),B=null)}}),j(()=>{let e=b(Mt);B&&b(z)&&(B.setPreset(e),B.start())}),j(()=>{b(L)?!history.state?.tracklistOpen&&!V&&(history.pushState({tracklistOpen:!0},``),V=!0):V&&(history.back(),V=!1)}),te(()=>{V&&(history.back(),V=!1)});function Nt(e){!e.state?.tracklistOpen&&b(L)&&(T(L,!1),V=!1)}function Pt(e){b(Tt)&&b(Et)&&!b(Et).contains(e.target)&&!e.target.closest(`.vol-toggle-btn`)&&T(Tt,!1)}let H=[{id:`hollywood`,title:`HOLLYWOOD`,artist:`YG`,album:`THE GENTLEMEN'S CLUB`,cover:`https://data.wearedogs.net/img/covers/2026/yg.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/yg.jpg`,src:`https://data.wearedogs.net/music/2026/HOLLYWOOD.mp3`,instrumental:`https://data.wearedogs.net/music/2026/HOLLYWOOD-free.mp3`,dateAdded:`2026-06-24T03:00:00-05:00`,year:2026,genre:`Hip-Hop`,attrib:`https://the-gentlemens-club.com/`},{id:`chicago`,title:`Chicago`,artist:`Michael Jackson`,album:`Xscape`,cover:`https://data.wearedogs.net/img/covers/2026/mj.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/mj.jpg`,src:`https://data.wearedogs.net/music/2026/Chicago.mp3`,instrumental:`https://data.wearedogs.net/music/2026/Chicago-free.mp3`,dateAdded:`2026-06-24T03:00:00-05:00`,year:2014,genre:`Pop`},{id:`rain`,title:`Pourin Rain (feat. Skratch Bastid)`,artist:`Zeds Dead`,album:`Return to the Return (of the Spectrum of Intergalactic Happiness)`,cover:`https://data.wearedogs.net/img/covers/2026/zd.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/zd.jpg`,src:`https://data.wearedogs.net/music/2026/Pourin.mp3`,instrumental:``,dateAdded:`2026-07-07T018:12:00-05:00`,year:2026,genre:`Electronic`,attrib:`https://shop.zedsdead.net/`},{id:`denchai`,title:`Den Chai`,artist:`The Buddha-Bar Lounge`,album:`Den Chai`,cover:`https://data.wearedogs.net/img/covers/2026/buddha.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/buddha.png`,src:``,instrumental:`https://data.wearedogs.net/music/2026/DENCHAI.mp3`,dateAdded:`2026-07-07T22:34:00-05:00`,year:2008,genre:`Lounge`,attrib:`https://open.spotify.com/artist/0du3MpnxBOpQEie1IV3u9v?si=2UO722ntTE--Ck_Ji7Go7Q`},{id:`rainbow`,title:`Rainbow in the Dark`,artist:`Das Racist`,album:`Shut Up, Dude`,cover:`https://data.wearedogs.net/img/covers/2026/rainbow.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/rainbow.png`,src:`https://data.wearedogs.net/music/2026/rainbow.mp3`,instrumental:`https://data.wearedogs.net/music/2026/rainbow-free.mp3`,dateAdded:`2026-07-08T16:35:00-05:00`,year:2010,genre:`Hip-Hop`,attrib:`https://dasracist.bandcamp.com/album/shut-up-dude`},{id:`hipsong`,title:`Hip Song`,artist:`Toby Fox / Trevor Alan Gomes`,album:`Deltarune`,cover:`https://data.wearedogs.net/img/covers/2026/deltarune.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/deltarune.png`,src:`https://data.wearedogs.net/music/2026/shop.mp3`,instrumental:`https://data.wearedogs.net/music/2026/shop-free.mp3`,dateAdded:`2026-07-09T01:22:00-05:00`,year:2021,genre:`Video Game`,attrib:`https://deltarune.com/`},{id:`sleepless`,title:`Sleepless`,artist:`deadmau5`,album:`> album title goes here <`,cover:`https://data.wearedogs.net/img/covers/2026/sleepless.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/sleepless.png`,src:``,instrumental:`https://data.wearedogs.net/music/2026/sleepless.mp3`,dateAdded:`2026-07-12T04:22:00-05:00`,year:2026,genre:`Electronic`,attrib:`https://deadmau5.com/`},{id:`skitzo`,title:`Skitzo (feat. Young Thug)`,artist:`Travis Scott`,album:`UTOPIA`,cover:`https://data.wearedogs.net/img/covers/2026/utopia.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/utopia.png`,src:`https://data.wearedogs.net/music/2026/skitzo.mp3`,instrumental:`https://data.wearedogs.net/music/2026/skitzo-free.mp3`,dateAdded:`2026-07-16T01:56:00-05:00`,year:2023,genre:`Hip-Hop`,attrib:`https://shop.travisscott.com/`}];function Ft(e){return e.src?e.src.split(`/`).pop():``}function It(e){if(!e.dateAdded)return`Summer`;let t=new Date(e.dateAdded).getMonth();return t===11||t===0||t===1?`Winter`:t>=2&&t<=4?`Spring`:t>=5&&t<=7?`Summer`:`Fall`}let U=D(()=>{let e=[...H];return b(I)===`artist`?e.sort((e,t)=>e.artist.localeCompare(t.artist)):b(I)===`album`?e.sort((e,t)=>e.album.localeCompare(t.album)):b(I)===`year`?e.sort((e,t)=>(e.year||0)-(t.year||0)):b(I)===`filename`?e.sort((e,t)=>Ft(e).localeCompare(Ft(t))):b(I)===`genre`?e.sort((e,t)=>(e.genre||``).localeCompare(t.genre||``)):b(I)===`season`&&e.sort((e,t)=>It(e).localeCompare(It(t))),e}),W=D(()=>H[P.currentTrackIndex]),Lt=E(0),Rt=E(0),zt=E(0),Bt=E(0),Vt=E(0),Ht=E(0),Ut=E(null),Wt=null;function Gt(e,t){e.stopPropagation();let n=`${window.location.origin}/music/${t.id}`;navigator.clipboard.writeText(n).then(()=>{T(Ut,t.id,!0),Wt&&clearTimeout(Wt),Wt=setTimeout(()=>{T(Ut,null)},2e3)}).catch(e=>{console.error(`Failed to copy share link:`,e)})}te(()=>{Wt&&clearTimeout(Wt)}),Le(()=>{if(P.init(H),St()){let e=H.findIndex(e=>e.id===St());e!==-1&&P.loadTrack(e,!0)}else if(!P.hasPickedRandomTrack){P.hasPickedRandomTrack=!0;let e=Math.floor(Math.random()*H.length);P.loadTrack(e,!1)}});let G=E(null);function Kt(){let e=document.querySelector(`.track-row[data-track-id="${b(G)}"]`);e&&e.scrollIntoView({block:`nearest`,behavior:`smooth`})}function qt(e){T(G,e.id,!0);let t=H.findIndex(t=>t.id===e.id);P.currentTrackIndex===t&&!P.fetchErrors[e.id]?P.togglePlay():P.loadTrack(t,!0)}function Jt(){window.innerWidth<=640?T(L,!0):T(z,!b(z))}function Yt(){let e=!P.isInstrumental;P.setCrossfade(e)||(De(q),b(nn)||(T(nn,!0),setTimeout(()=>{T(nn,!1)},300)),b(q)===5?($(),T(rn,!0),setTimeout(()=>{T(rn,!1)},150)):b(q)===10?$(35):b(q)>5&&b(q)<10?$(8):b(q)>10&&Math.random()<.4&&$(3))}function Xt(e){return!e||isNaN(e)?`0:00`:`${Math.floor(e/60)}:${Math.floor(e%60).toString().padStart(2,`0`)}`}function Zt(e){let t=document.activeElement;if(!(t&&(t.tagName===`INPUT`||t.tagName===`TEXTAREA`||t.isContentEditable))){if(e.shiftKey){if(e.key===`ArrowRight`){e.preventDefault(),T(F,N[(N.findIndex(e=>e.id===b(F))+1)%N.length].id,!0);return}else if(e.key===`ArrowLeft`){e.preventDefault(),T(F,N[(N.findIndex(e=>e.id===b(F))-1+N.length)%N.length].id,!0);return}}if(e.code===`Space`||e.key===` `)b(F)===`songs`&&(e.preventDefault(),P.togglePlay());else if(e.key===`ArrowDown`){if(b(F)===`songs`&&b(U).length>0){e.preventDefault();let t=b(U).findIndex(e=>e.id===b(G));if(t===-1){let e=H[P.currentTrackIndex];t=b(U).findIndex(t=>t.id===e?.id)}let n=(t+1)%b(U).length;T(G,b(U)[n].id,!0),Kt()}}else if(e.key===`ArrowUp`){if(b(F)===`songs`&&b(U).length>0){e.preventDefault();let t=b(U).findIndex(e=>e.id===b(G));if(t===-1){let e=H[P.currentTrackIndex];t=b(U).findIndex(t=>t.id===e?.id)}let n=(t-1+b(U).length)%b(U).length;T(G,b(U)[n].id,!0),Kt()}}else if(e.key===`Enter`&&b(F)===`songs`&&b(G)){e.preventDefault();let t=b(U).find(e=>e.id===b(G));t&&qt(t)}}}let Qt=0,$t=0;function en(e){if(e.target&&(e.target.tagName===`INPUT`||e.target.closest(`button`)||e.target.closest(`.ctrl`))){Qt=0,$t=0;return}Qt=e.touches[0].clientX,$t=e.touches[0].clientY}function tn(e){if(Qt===0||!e.changedTouches||e.changedTouches.length===0)return;let t=e.changedTouches[0].clientX-Qt,n=e.changedTouches[0].clientY-$t;if(Math.abs(t)<=Math.abs(n)||Math.abs(t)<=60)return;let r=N.findIndex(e=>e.id===b(F));r!==-1&&(t<0&&r<N.length-1?T(F,N[r+1].id,!0):t>0&&r>0&&T(F,N[r-1].id,!0))}let K=E(null),q=E(0),nn=E(!1),rn=E(!1),J,Y,X,Z=[],Q=[],an,on=E(!1);j(()=>(b(K)&&cn(),()=>{an&&cancelAnimationFrame(an),window.removeEventListener(`resize`,ln),X&&(X.dispose(),X=null),J=null,Y=null,Z=[],Q=[]})),j(()=>{if(P.currentTrackIndex,b(F),xt(),T(q,0),T(on,!1),J){for(let e of Z)J.remove(e.mesh);for(let e of Q)J.remove(e.mesh)}Z=[],Q=[]});function sn(){let e=document.querySelector(`.dj-fader-knob`);if(!e)return{x:window.innerWidth/2,y:window.innerHeight/2};let t=e.getBoundingClientRect();return{x:t.left+t.width/2,y:window.innerHeight-(t.top+t.height/2)}}function cn(){if(!b(K))return;let e=window.innerWidth,t=window.innerHeight;b(K).width=e,b(K).height=t,J=new ee,Y=new o(0,e,t,0,-1,1),X=new fe({canvas:b(K),alpha:!0,antialias:!0}),X.setSize(e,t,!1),X.setPixelRatio(Math.min(window.devicePixelRatio,2)),window.addEventListener(`resize`,ln),un()}function ln(){if(!b(K)||!X||!Y)return;let e=window.innerWidth,t=window.innerHeight;b(K).width=e,b(K).height=t,X.setSize(e,t,!1),Y.right=e,Y.top=t,Y.updateProjectionMatrix()}function un(){if(an=requestAnimationFrame(un),!(!J||!Y||!X||!b(K))){if(b(q)>=10&&(T(on,!0),Math.random()<.22)){let e=sn();dn(e.x,e.y)}for(let e=Z.length-1;e>=0;e--){let t=Z[e];t.x+=t.vx,t.y+=t.vy,t.vy+=t.ay,t.life-=t.decay,t.mesh.position.set(t.x,t.y,0),t.mesh.material.opacity=t.life,t.life<=0&&(J.remove(t.mesh),t.mesh.geometry.dispose(),t.mesh.material.dispose(),Z.splice(e,1))}for(let e=Q.length-1;e>=0;e--){let t=Q[e];t.x+=t.vx,t.y+=t.vy,t.life-=t.decay;let n=t.startScale+(1-t.life)*88;t.mesh.scale.set(n,n,1),t.mesh.position.set(t.x,t.y,0),t.mesh.material.opacity=t.life*.16,t.life<=0&&(J.remove(t.mesh),t.mesh.geometry.dispose(),t.mesh.material.dispose(),Q.splice(e,1))}X.render(J,Y)}}function dn(t,n){if(!J)return;let r=new e(5,8),i=.85+Math.random()*.12,a=new Ce(r,new g({color:new Me(i,i,i*1.01),transparent:!0,opacity:.06,blending:1}));a.position.set(t,n,0),J.add(a),Q.push({mesh:a,x:t,y:n,vx:(Math.random()-.5)*.55+Math.sin(Date.now()*.001)*.22,vy:Math.random()*.7+1.25,startScale:1,life:1,decay:6e-4+Math.random()*4e-4})}function $(t=25){if(!J||!b(K))return;let n=sn(),r=n.x,i=n.y;for(let n=0;n<t;n++){let t=new Ce(new e(1.3,4),new g({color:new Me(Math.random()<.4?16711765:16755200),transparent:!0,opacity:1,blending:2}));t.position.set(r,i,0),J.add(t);let n=Math.random()*Math.PI*2,a=Math.random()*4+2;Z.push({mesh:t,x:r,y:i,vx:Math.cos(n)*a,vy:Math.sin(n)*a,ay:-.15,life:1,decay:.02+Math.random()*.02})}}var fn=vt();le(`keydown`,Ee,Zt),le(`popstate`,Ee,Nt),le(`click`,Ee,Pt);var pn=M(fn);let mn;var hn=M(pn),gn=M(hn),_n=M(gn);Be(M(_n),{size:`panel`}),t(_n);var vn=k(_n,2);vn.textContent=`MUSIC`,t(gn);var yn=k(gn,2);_e(M(yn),{size:20}),t(yn),t(hn);var bn=k(hn,2);He(bn,{get tabs(){return N},get activeTab(){return b(F)},set activeTab(e){T(F,e,!0)}});var xn=k(bn,2),Sn=M(xn),Cn=e=>{var o=ct(),c=M(o);let f;var p=M(c);let m;var g=M(p),_=M(g),y=e=>{var n=qe(),r=M(n);xe(r,e=>T(kt,e),()=>b(kt));var i=k(r,2),a=e=>{S(e,Ke())};h(i,e=>{!P.isPlaying&&!b(At)&&e(a)});var o=k(i,2);pe(M(o),{size:16,class:`text-white/70`}),t(o),t(n),C(`click`,n,()=>{T(Ot,!0)}),S(e,n)},ee=e=>{var n=Je();pe(M(n),{size:16,class:`text-white/20`}),t(n),S(e,n)},te=e=>{var n=oe(),r=he(n),o=e=>{var n=Ye(),r=M(n);let a;var o=k(M(r),8),s=M(o);let c;t(o),x(2),t(r);var l=k(r,2);let u;t(n),A(()=>{a=i(r,1,`vinyl-record svelte-1o4jdf5`,null,a,{spinning:b(R)}),w(s,`src`,P.fetchErrors[b(W).id]||!b(W).cover?yt:b(W).cover),w(s,`alt`,b(W).album),c=i(s,1,`record-art svelte-1o4jdf5`,null,c,{loaded:b(wt)}),u=i(l,1,`tonearm svelte-1o4jdf5`,null,u,{playing:b(R)})}),C(`click`,n,Jt),le(`load`,s,()=>T(wt,!0)),le(`error`,s,bt),de(s),S(e,n)},c=e=>{let n=D(()=>P.duration>0?(1-P.currentTime/P.duration)*.45+.25:.48),r=D(()=>P.duration>0?P.currentTime/P.duration*.45+.25:.48);var o=Xe(),s=M(o),c=M(s),l=M(c),u=M(l,!0);t(l),x(2),t(c);var f=k(c,2),p=M(f);let m;var h=k(p,2);let g;var _=k(h,2);let v;var y=k(_,2);let ee;t(f),t(s),t(o),A(()=>{d(u,b(W).title),m=i(p,1,`spindle-left bg-zinc-900 svelte-1o4jdf5`,null,m,{spinning:b(R)}),g=i(h,1,`tape-roll-left bg-amber-950/70 svelte-1o4jdf5`,null,g,{spinning:b(R)}),a(h,`width: ${b(n)*46}px; height: ${b(n)*46}px;`),v=i(_,1,`spindle-right bg-zinc-900 svelte-1o4jdf5`,null,v,{spinning:b(R)}),ee=i(y,1,`tape-roll-right bg-amber-950/70 svelte-1o4jdf5`,null,ee,{spinning:b(R)}),a(y,`width: ${b(r)*46}px; height: ${b(r)*46}px;`)}),C(`click`,o,Jt),S(e,o)},l=e=>{var n=Ze(),r=M(n),a=k(M(r),4),o=k(M(a),4),s=M(o),c=M(s,!0);t(s);var l=k(s,2),u=M(l,!0);t(l),t(o),t(a);var f=k(a,2),p=M(f);let m;var h=k(p,2),g=M(h);let _;t(h),t(f);var v=k(f,2);let y;t(r),t(n),A(()=>{d(c,b(W).title),d(u,b(W).artist||`WEAREDOGS`),m=i(p,1,`floppy-shutter-slider bg-zinc-400 svelte-1o4jdf5`,null,m,{open:b(R)}),_=i(g,1,`floppy-magnetic-disc bg-zinc-900 svelte-1o4jdf5`,null,_,{spinning:b(R)}),y=i(v,1,`floppy-drive-led svelte-1o4jdf5`,null,y,{active:b(R)})}),C(`click`,n,Jt),S(e,n)},u=e=>{var n=$e(),r=M(n),a=M(r);let o;var c=k(a,2),l=M(c),u=M(l);let d;var f=k(u,2);let p;t(l);var m=k(l,2),h=M(m);let g;t(m);var _=k(m,2);v(_,20,()=>Array(10),s,(e,t,n)=>{var r=Qe();let a;A(e=>a=i(r,1,`comb-tooth svelte-1o4jdf5`,null,a,e),[()=>({vibrating:b(R)&&n%3==Math.floor(P.currentTime*4)%3})]),S(e,r)}),t(_),t(c),t(r),t(n),A(()=>{o=i(a,1,`music-box-key svelte-1o4jdf5`,null,o,{spinning:b(R)}),d=i(u,1,`music-box-gear gear-1 svelte-1o4jdf5`,null,d,{spinning:b(R)}),p=i(f,1,`music-box-gear gear-2 svelte-1o4jdf5`,null,p,{spinning:b(R)}),g=i(h,1,`music-box-drum bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 svelte-1o4jdf5`,null,g,{spinning:b(R)})}),C(`click`,n,Jt),S(e,n)};h(r,e=>{Ve.musicDeckModel===`vinyl`?e(o):Ve.musicDeckModel===`cassette`?e(c,1):Ve.musicDeckModel===`floppy`?e(l,2):Ve.musicDeckModel===`musicbox`&&e(u,3)}),S(e,n)};h(_,e=>{b(z)&&!b(Ot)?e(y):b(z)&&b(Ot)?e(ee,1):e(te,-1)}),t(g);var se=k(g,2),fe=M(se),me=M(fe),_e=M(me),E=e=>{ve(e,{size:12,class:`text-[#22c55e]`})},be=e=>{we(e,{size:12})};h(_e,e=>{b(Ut)===b(W).id?e(E):e(be,-1)}),t(me),t(fe);var Se=k(fe,2);let Ce;var Te=M(Se);let Ee;var De=M(Te,!0);t(Te),t(Se);var j=k(Se,2);let Me;var N=M(j);let Pe;var Ie=M(N,!0);t(N),t(j);var Le=k(j,2);let ze;var Be=M(Le);let He;var Ue=M(Be,!0);t(Be),t(Le),t(se),t(p);var Ge=k(p,2),lt=M(Ge),ut=M(lt),dt=M(ut,!0);t(ut);var ft=k(ut,2),pt=M(ft);v(pt,21,()=>b(jt),s,(e,t,n)=>{let r=D(()=>P.duration>0?P.currentTime/P.duration:0),o=D(()=>n/60);var s=et();let c;A(()=>{c=i(s,1,`waveform-bar transition-colors duration-100 rounded-t svelte-1o4jdf5`,null,c,{active:b(o)<=b(r)}),a(s,`height: ${b(t)??``}%; width: 3px;`)}),S(e,s)}),t(pt);var mt=k(pt,2);Fe(mt),t(ft);var ht=k(ft,2),gt=M(ht,!0);t(ht),t(lt);var _t=k(lt,2),vt=M(_t);let xt;ae(M(vt),{size:15}),t(vt);var St=k(vt,2);Ne(M(St),{size:19}),t(St);var F=k(St,2);let Ct;var B=M(F),V=e=>{je(e,{size:22})},Mt=e=>{S(e,tt())},Nt=e=>{ke(e,{size:22,fill:`currentColor`})},Pt=e=>{l(e,{size:22,fill:`currentColor`})};h(B,e=>{P.fetchErrors[b(W).id]?e(V):P.isLoading?e(Mt,1):P.isPlaying?e(Nt,2):e(Pt,-1)}),t(F);var Ft=k(F,2);r(M(Ft),{size:19}),t(Ft);var It=k(Ft,2);let Wt;var Kt=M(It),Zt=e=>{Re(e,{size:15})},Qt=e=>{ne(e,{size:15})};h(Kt,e=>{P.repeatMode===2?e(Zt):e(Qt,-1)}),t(It),t(_t);var $t=k(_t,2),en=M($t);let tn;var K=M(en);let J;Ae(M(K),{size:12}),x(2),t(K);var Y=k(K,2),X=M(Y);let Z;t(Y);var Q=k(Y,2);let an;re(M(Q),{size:12}),x(2),t(Q),t(en),t($t);var on=k($t,2),sn=M(on),cn=e=>{var n=nt(),r=M(n),i=M(r),a=e=>{ue(e,{size:12,class:`text-red-400`})},o=e=>{ce(e,{size:12})};h(i,e=>{P.isMuted||P.volume===0?e(a):e(o,-1)}),t(r);var s=k(r,2);Fe(s);var c=k(s,2),l=M(c);t(c),t(n),xe(n,e=>T(Et,e),()=>b(Et)),A(e=>{ie(s,P.volume),d(l,`${e??``}%`)},[()=>Math.round(P.volume*100)]),C(`click`,r,()=>P.toggleMute()),C(`input`,s,e=>P.setVolume(parseFloat(e.target.value))),S(e,n)};h(sn,e=>{b(Tt)&&e(cn)});var ln=k(sn,2),un=M(ln);let dn;Oe(M(un),{size:13}),t(un);var $=k(un,2),fn=M($,!0);t($),t(ln);var pn=k(ln,2),mn=M(pn),hn=M(mn),gn=e=>{ue(e,{size:13,class:`text-red-400`})},_n=e=>{ce(e,{size:13})};h(hn,e=>{P.isMuted||P.volume===0?e(gn):e(_n,-1)}),t(mn),t(pn),t(on),t(Ge),t(c);var vn=k(c,2);let yn;var bn=M(vn),xn=k(M(bn),2);t(bn);var Sn=k(bn,2),Cn=M(Sn),wn=M(Cn);ge(wn,{size:13});var Tn=k(wn,3),En=M(Tn,!0);t(Tn),t(Cn);var Dn=k(Cn,2),On=k(M(Dn),2),kn=M(On);kn.value=kn.__value=`default`;var An=k(kn);An.value=An.__value=`artist`;var jn=k(An);jn.value=jn.__value=`album`;var Mn=k(jn);Mn.value=Mn.__value=`year`;var Nn=k(Mn);Nn.value=Nn.__value=`filename`;var Pn=k(Nn);Pn.value=Pn.__value=`genre`;var Fn=k(Pn);Fn.value=Fn.__value=`season`,t(On),t(Dn),t(Sn);var In=k(Sn,2);v(In,21,()=>b(U),s,(e,n,r)=>{var a=st();let o;var s=M(a),c=M(s),l=e=>{S(e,rt())},u=e=>{var t=it();t.textContent=r+1,S(e,t)};h(c,e=>{H[P.currentTrackIndex].id===b(n).id&&P.isPlaying?e(l):e(u,-1)}),t(s);var f=k(s,2),p=k(f,2),m=M(p),g=M(m);let _;var v=M(g,!0);t(g);var y=k(g,2),ee=e=>{var n=at();je(M(n),{size:10}),x(),t(n),S(e,n)};h(y,e=>{P.fetchErrors[b(n).id]&&e(ee)}),t(m);var te=k(m,2),ne=M(te);t(te),t(p);var re=k(p,2),ie=M(re),ae=e=>{var r=ot(),i=M(r);t(r),A(()=>w(i,`href`,b(n).attrib)),C(`click`,i,e=>e.stopPropagation()),S(e,r)};h(ie,e=>{b(n).attrib&&e(ae)});var oe=k(ie,2),se=M(oe),ce=e=>{ve(e,{size:12,class:`text-[#22c55e]`})},ue=e=>{we(e,{size:12})};h(se,e=>{b(Ut)===b(n).id?e(ce):e(ue,-1)}),t(oe),t(re),t(a),A(()=>{o=i(a,1,`track-row svelte-1o4jdf5`,null,o,{active:H[P.currentTrackIndex].id===b(n).id,"kb-focused":b(G)===b(n).id,"fetch-error":P.fetchErrors[b(n).id]}),w(a,`data-track-id`,b(n).id),w(f,`src`,P.fetchErrors[b(n).id]||!b(n).cover?yt:b(n).cover),w(f,`alt`,b(n).album),_=i(g,1,`tr-title svelte-1o4jdf5`,null,_,{"line-through":P.fetchErrors[b(n).id],"opacity-50":P.fetchErrors[b(n).id]}),d(v,b(n).title),d(ne,`${b(n).artist??``} · ${b(n).album??``} (${(b(n).year||``)??``})`)}),C(`click`,a,()=>qt(b(n))),le(`error`,f,bt),de(f),C(`click`,oe,e=>Gt(e,b(n))),S(e,a)}),t(In),t(vn),t(o),A((e,t)=>{f=i(c,1,`player-side svelte-1o4jdf5`,null,f,{"tracklist-open":b(L)}),m=i(p,1,`player-top-block transition-all duration-300 ease-in-out svelte-1o4jdf5`,null,m,{"opacity-0":b(L),"scale-95":b(L),"pointer-events-none":b(L)}),Ce=i(Se,1,`scroll-container svelte-1o4jdf5`,null,Ce,{overflowing:b(Rt)>b(Lt)}),a(Se,`--scroll-dist: -${b(Rt)-b(Lt)}px`),Ee=i(Te,1,`track-title scroll-text svelte-1o4jdf5`,null,Ee,{"animate-scroll":b(Rt)>b(Lt)}),d(De,b(W).title),Me=i(j,1,`scroll-container svelte-1o4jdf5`,null,Me,{overflowing:b(Bt)>b(zt)}),a(j,`--scroll-dist: -${b(Bt)-b(zt)}px`),Pe=i(N,1,`track-artist scroll-text svelte-1o4jdf5`,null,Pe,{"animate-scroll":b(Bt)>b(zt)}),d(Ie,b(W).artist),ze=i(Le,1,`scroll-container svelte-1o4jdf5`,null,ze,{overflowing:b(Ht)>b(Vt)}),a(Le,`--scroll-dist: -${b(Ht)-b(Vt)}px`),He=i(Be,1,`track-album scroll-text svelte-1o4jdf5`,null,He,{"animate-scroll":b(Ht)>b(Vt)}),d(Ue,b(W).album),d(dt,e),w(mt,`max`,P.duration||100),ie(mt,P.currentTime),d(gt,t),xt=i(vt,1,`ctrl ctrl-sm svelte-1o4jdf5`,null,xt,{"active-ctrl":P.isShuffled}),Ct=i(F,1,`ctrl ctrl-play svelte-1o4jdf5`,null,Ct,{"ctrl-error":P.fetchErrors[b(W).id]}),w(F,`aria-label`,P.isPlaying?`Pause`:`Play`),Wt=i(It,1,`ctrl ctrl-sm svelte-1o4jdf5`,null,Wt,{"active-ctrl":P.repeatMode>0}),tn=i(en,1,`dj-crossfader svelte-1o4jdf5`,null,tn,{"fader-flash":b(rn),"fader-fried":b(q)>=10}),J=i(K,1,`fader-label left-label flex items-center gap-1 svelte-1o4jdf5`,null,J,{active:!P.isInstrumental}),Z=i(X,1,`dj-fader-knob svelte-1o4jdf5`,null,Z,{right:P.isInstrumental,"knob-jiggle":b(nn),fried:b(q)>=10}),an=i(Q,1,`fader-label right-label flex items-center gap-1 svelte-1o4jdf5`,null,an,{active:P.isInstrumental}),dn=i(un,1,`ctrl ctrl-xs svelte-1o4jdf5`,null,dn,{"active-ctrl":b(z)}),i($,1,`w-[90px] h-[20px] flex items-center justify-center rounded text-[9px] font-bold transition-all font-mono uppercase tracking-wider select-none cursor-pointer
                      ${b(z)?`bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/25 active:scale-95`:`bg-transparent border border-white/5 text-white/20 hover:text-white/40 hover:border-white/10`}`,`svelte-1o4jdf5`),w($,`title`,b(z)?`Click to cycle presets`:`Click to enable visualizer`),d(fn,We[b(Dt)].name),yn=i(vn,1,`tracklist-side svelte-1o4jdf5`,null,yn,{"show-mobile":b(L)}),d(En,H.length)},[()=>Xt(P.currentTime),()=>Xt(P.duration)]),C(`click`,me,e=>Gt(e,b(W))),ye(Te,`clientWidth`,e=>T(Rt,e)),ye(Se,`clientWidth`,e=>T(Lt,e)),ye(N,`clientWidth`,e=>T(Bt,e)),ye(j,`clientWidth`,e=>T(zt,e)),ye(Be,`clientWidth`,e=>T(Ht,e)),ye(Le,`clientWidth`,e=>T(Vt,e)),C(`input`,mt,e=>{P.seek(parseFloat(e.target.value))}),C(`change`,mt,e=>{P.play(parseFloat(e.target.value))}),C(`click`,vt,()=>P.isShuffled=!P.isShuffled),C(`click`,St,()=>P.prevTrack()),C(`click`,F,()=>P.togglePlay()),C(`click`,Ft,()=>P.nextTrack()),C(`click`,It,()=>{P.repeatMode=(P.repeatMode+1)%3}),C(`click`,en,Yt),C(`click`,un,()=>{T(z,!b(z))}),C(`click`,$,()=>{b(z)?T(Dt,(b(Dt)+1)%We.length):T(z,!0)}),C(`click`,mn,()=>{T(Tt,!b(Tt))}),C(`click`,xn,()=>{T(L,!1)}),n(On,()=>b(I),e=>T(I,e)),O(1,o,()=>u,()=>({duration:120,delay:120})),O(2,o,()=>u,()=>({duration:120})),S(e,o)},wn=e=>{var n=lt(),r=k(M(n),2),i=M(r);Ae(i,{size:36});var a=k(i,6),o=k(M(a),2);se(M(o),{size:15}),x(),t(o),t(a),t(r),x(2),t(n),O(1,n,()=>u,()=>({duration:120,delay:120})),O(2,n,()=>u,()=>({duration:120})),S(e,n)},Tn=e=>{var n=dt(),r=k(M(n),2),i=k(M(r),4);y(k(M(i)),{size:15}),t(i),t(r);var o=k(r,2);v(o,20,()=>[{name:`Apple Music`,color:`#fc3c44`,icon:`🎵`},{name:`YouTube Music`,color:`#ff0000`,icon:`▶`},{name:`Amazon Music`,color:`#00a8e0`,icon:`♪`},{name:`Tidal`,color:`#00d4f5`,icon:`〰`}],s,(e,n)=>{var r=ut(),i=M(r),o=M(i,!0);t(i);var s=k(i),c=M(s,!0);t(s),p(k(s),{size:11}),t(r),A(()=>{a(r,`--sc:${n.color??``}`),d(o,n.icon),d(c,n.name)}),S(e,r)}),t(o),x(2),t(n),O(1,n,()=>u,()=>({duration:120,delay:120})),O(2,n,()=>u,()=>({duration:120})),S(e,n)},En=e=>{var t=ft();O(1,t,()=>u,()=>({duration:120,delay:120})),O(2,t,()=>u,()=>({duration:120})),S(e,t)},Dn=e=>{var n=mt(),r=M(n),i=e=>{let t=D(()=>b(Ct));var n=oe();_(he(n),()=>b(t),(e,t)=>{t(e,{get audioCore(){return P}})}),S(e,n)},a=e=>{S(e,pt())};h(r,e=>{b(Ct)?e(i):e(a,-1)}),t(n),O(1,n,()=>u,()=>({duration:120,delay:120})),O(2,n,()=>u,()=>({duration:120})),S(e,n)};h(Sn,e=>{b(F)===`songs`?e(Cn):b(F)===`samples`?e(wn,1):b(F)===`playlists`?e(Tn,2):b(F)===`radio`?e(En,3):b(F)===`battle`&&e(Dn,4)}),t(xn),x(2),t(pn);var On=k(pn,2),kn=e=>{var n=_t(),r=M(n);xe(r,e=>T(kt,e),()=>b(kt));var a=k(r,2),o=e=>{S(e,ht())};h(a,e=>{!P.isPlaying&&!b(At)&&e(o)});var c=k(a,2),l=M(c);v(l,21,()=>We,s,(e,n,r)=>{var a=gt(),o=M(a,!0);t(a),A(()=>{i(a,1,`px-2 py-1 rounded text-[9px] font-bold transition-all uppercase tracking-wider font-mono
                ${b(Dt)===r?`bg-purple-600 text-white`:`text-white/40 hover:text-white/80`}`,`svelte-1o4jdf5`),d(o,b(n).name)}),C(`click`,a,()=>T(Dt,r,!0)),S(e,a)}),t(l),t(c),t(n),C(`click`,n,e=>{e.stopPropagation(),T(Ot,!1)}),C(`click`,c,e=>e.stopPropagation()),S(e,n)};h(On,e=>{b(z)&&b(Ot)&&e(kn)}),xe(k(On,2),e=>T(K,e),()=>b(K)),t(fn),A(()=>mn=i(pn,1,`mp-container svelte-1o4jdf5`,null,mn,{closing:xt(),"theme-inst":P.isInstrumental})),C(`click`,fn,function(...e){m.onClose?.apply(this,e)}),C(`click`,pn,e=>e.stopPropagation()),C(`click`,_n,()=>{P.isPlaying||window.dispatchEvent(new CustomEvent(`open-info-panel`))}),C(`click`,yn,function(...e){m.onClose?.apply(this,e)}),C(`touchstart`,xn,en,void 0,!0),C(`touchend`,xn,tn),S(c,fn),me()}m([`click`,`touchstart`,`touchend`,`input`,`change`]);export{yt as default};