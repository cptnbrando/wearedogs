const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/BattlePanel-B-rty92_.js","assets/vendor-hBqjuPxA.js","assets/rolldown-runtime-CMxvf4Kt.js","assets/vendor-Dl9nCA7L.css","assets/BattlePanel-B1S5D9Lq.css"])))=>i.map(i=>d[i]);
import{$n as e,$r as t,A as n,Ar as r,C as i,Dr as a,Et as o,Fn as s,Fr as c,Ft as l,Gr as u,H as d,Hr as f,Ht as p,Ir as m,It as h,J as g,K as _,L as v,Lr as ee,Mn as y,Mr as te,Or as ne,P as re,Rr as b,S as ie,St as ae,Tr as oe,Ur as se,Vr as x,Vt as ce,Wr as le,Wt as ue,Xr as S,Y as de,Yn as fe,Yr as C,Zt as pe,_i as w,_r as me,ai as T,ar as he,br as ge,bt as _e,ci as E,cr as ve,ei as D,g as ye,gi as O,gr as be,hi as k,ii as A,j as xe,jr as Se,lr as Ce,mi as we,mr as j,ni as M,oi as Te,pi as Ee,pr as De,pt as Oe,qn as ke,sn as Ae,st as je,ti as Me,tn as Ne,ur as Pe,wr as N,xr as P,xt as Fe,yn as Ie,zt as Le}from"./vendor-hBqjuPxA.js";import{t as Re}from"./index-BRh2efJ_.js";import{t as F}from"./AudioCore.svelte-DPVLbyii.js";import{t as ze}from"./DogsLogo-D-3RdT8H.js";import{t as Be}from"./settingsManager.svelte-xF_YPuIL.js";import{t as Ve}from"./SwipeTabNav-DqruL-Tc.js";var He=class{constructor(e,t){w(this,`canvas`,null),w(this,`gl`,null),w(this,`analyser`,null),w(this,`program`,null),w(this,`animationFrameId`,null),w(this,`startTime`,0),w(this,`vertexBuffer`,null),w(this,`audioTexture`,null),w(this,`uniforms`,{}),w(this,`frequencyBuffer`,null),this.canvas=e,this.analyser=t,this.frequencyBuffer=new Uint8Array(t?t.frequencyBinCount:128),this.gl=e.getContext(`webgl`)||e.getContext(`experimental-webgl`),this.gl||console.error(`WebGL not supported by this browser.`)}init(e){if(!this.gl)return;let t=this.gl;this.cleanupProgram();let n=this.compileShader(t.VERTEX_SHADER,`
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
  `},Ge=b(`<div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 animate-pulse svelte-1o4jdf5"><div class="bg-black/75 border border-red-500/30 px-3 py-1.5 rounded text-[10px] font-mono tracking-widest text-red-500 font-bold uppercase shadow-[0_0_15px_rgba(239,68,68,0.25)] select-none svelte-1o4jdf5">NO SIGNAL</div></div>`),Ke=b(`<div class="visualizer-container cursor-pointer svelte-1o4jdf5"><canvas class="visualizer-canvas svelte-1o4jdf5"></canvas> <!> <div class="visualizer-hover-overlay svelte-1o4jdf5"><!></div></div>`),qe=b(`<div class="visualizer-container bg-[#050508]/40 border border-white/5 flex items-center justify-center svelte-1o4jdf5"><!></div>`),Je=b(`<div class="vinyl-record-clicker cursor-pointer w-full h-full svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div><div class="groove g1 svelte-1o4jdf5"></div> <div class="groove g2 svelte-1o4jdf5"></div> <div class="groove g3 svelte-1o4jdf5"></div> <div class="groove g4 svelte-1o4jdf5"></div> <div class="record-label svelte-1o4jdf5"><img loading="lazy"/></div> <div class="spindle svelte-1o4jdf5"></div></div> <div></div></div>`),Ye=b(`<div class="cassette-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="cassette-tape svelte-1o4jdf5"><div class="cassette-label bg-gradient-to-r from-purple-800 to-pink-700 svelte-1o4jdf5"><span class="cassette-track-title svelte-1o4jdf5"> </span> <span class="cassette-brand svelte-1o4jdf5">WEAREDOGS AUDIO</span></div> <div class="cassette-window bg-zinc-950/80 svelte-1o4jdf5"><div></div> <div></div> <div></div> <div></div></div></div></div>`),Xe=b(`<div class="floppy-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="floppy-disk svelte-1o4jdf5"><div class="floppy-corner svelte-1o4jdf5"></div> <div class="floppy-write-protect svelte-1o4jdf5"></div> <div class="floppy-label bg-slate-100 text-slate-900 svelte-1o4jdf5"><div class="floppy-label-stripe bg-red-600 svelte-1o4jdf5"></div> <div class="floppy-label-stripe-blue bg-blue-600 svelte-1o4jdf5"></div> <div class="floppy-label-content svelte-1o4jdf5"><div class="floppy-song truncate font-mono svelte-1o4jdf5"> </div> <div class="floppy-artist truncate font-mono svelte-1o4jdf5"> </div></div></div> <div class="floppy-shutter-door bg-zinc-700 svelte-1o4jdf5"><div></div> <div class="floppy-shutter-opening bg-zinc-950 svelte-1o4jdf5"><div></div></div></div> <div></div></div></div>`),Ze=b(`<div></div>`),Qe=b(`<div class="musicbox-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="music-box svelte-1o4jdf5"><div></div> <div class="music-box-interior border border-amber-900/40 svelte-1o4jdf5"><div class="music-box-gears svelte-1o4jdf5"><div></div> <div></div></div> <div class="music-box-drum-wrap svelte-1o4jdf5"><div><div class="music-box-pins svelte-1o4jdf5"><div class="pin pin-1 svelte-1o4jdf5"></div> <div class="pin pin-2 svelte-1o4jdf5"></div> <div class="pin pin-3 svelte-1o4jdf5"></div> <div class="pin pin-4 svelte-1o4jdf5"></div> <div class="pin pin-5 svelte-1o4jdf5"></div> <div class="pin pin-6 svelte-1o4jdf5"></div></div></div></div> <div class="music-box-comb svelte-1o4jdf5"></div></div></div></div>`),$e=b(`<span></span>`),et=b(`<div class="spin-ring svelte-1o4jdf5"></div>`),tt=b(`<div class="volume-popover svelte-1o4jdf5"><button class="ctrl ctrl-xs mr-2 border border-white/10 rounded-full p-1 hover:bg-white/10 svelte-1o4jdf5" aria-label="Mute"><!></button> <input type="range" class="vol-slider-pop svelte-1o4jdf5" min="0" max="1" step="0.01" aria-label="Volume"/> <span class="text-[10px] font-bold text-white/60 min-w-[28px] text-right font-mono select-none svelte-1o4jdf5"> </span></div>`),nt=b(`<div class="eq svelte-1o4jdf5"><div class="eq-b svelte-1o4jdf5"></div> <div class="eq-b svelte-1o4jdf5"></div> <div class="eq-b svelte-1o4jdf5"></div></div>`),rt=b(`<span class="svelte-1o4jdf5"></span>`),it=b(`<span class="text-amber-400 flex items-center gap-1 text-[9px] font-bold tracking-wider uppercase bg-amber-500/10 px-1.5 py-0.5 rounded flex-shrink-0 svelte-1o4jdf5" title="Failed to fetch music source from remote database"><!> Error Fetching</span>`),at=b(`<span class="inst-chip-link svelte-1o4jdf5"><a target="_blank" class="svelte-1o4jdf5">i</a></span>`),ot=b(`<div><div class="tr-num svelte-1o4jdf5"><!></div> <img loading="lazy" class="tr-art svelte-1o4jdf5"/> <div class="tr-info svelte-1o4jdf5"><div class="flex items-center gap-1.5 min-w-0 svelte-1o4jdf5"><span> </span> <!></div> <span class="tr-meta svelte-1o4jdf5"> </span></div> <div class="flex items-center gap-2 flex-shrink-0 svelte-1o4jdf5"><!>  <button class="tr-share-btn svelte-1o4jdf5" title="Copy track link" aria-label="Share track"><!></button></div></div>`),st=b(`<div class="songs-layout svelte-1o4jdf5"><div><div><div class="vinyl-wrapper relative overflow-hidden svelte-1o4jdf5"><!></div> <div class="track-info mt-2 svelte-1o4jdf5"><div class="flex items-center justify-center mb-1.5 svelte-1o4jdf5"><button class="player-share-btn svelte-1o4jdf5" title="Copy track link" aria-label="Share track"><!></button></div> <div><h2> </h2></div> <div><p> </p></div> <div><p> </p></div></div></div> <div class="player-controls-block svelte-1o4jdf5"><div class="progress-row svelte-1o4jdf5"><span class="ptime svelte-1o4jdf5"> </span> <div class="progress-wrap waveform-slider-wrap relative h-9 flex items-end svelte-1o4jdf5"><div class="waveform-bars flex items-end justify-between absolute inset-0 pointer-events-none px-1 h-full svelte-1o4jdf5"></div> <input type="range" class="seek-input absolute inset-0 opacity-0 cursor-pointer w-full h-full svelte-1o4jdf5" min="0" step="0.1" aria-label="Seek"/></div> <span class="ptime svelte-1o4jdf5"> </span></div> <div class="controls-row svelte-1o4jdf5"><button aria-label="Shuffle"><!></button> <button class="ctrl ctrl-md svelte-1o4jdf5" aria-label="Previous"><!></button> <button><!></button> <button class="ctrl ctrl-md svelte-1o4jdf5" aria-label="Next"><!></button> <button aria-label="Repeat"><!></button></div> <div class="w-full flex flex-col items-center gap-1.5 mt-2 px-1 svelte-1o4jdf5"><div><span><!> <span class="svelte-1o4jdf5">VOCAL</span></span> <div class="dj-fader-slot relative svelte-1o4jdf5"><div></div></div> <span><!> <span class="svelte-1o4jdf5">INST</span></span></div></div> <div class="relative flex justify-center items-center gap-3 mt-2 w-full svelte-1o4jdf5"><!> <div class="flex items-center gap-1.5 svelte-1o4jdf5"><button aria-label="Toggle Visualizer"><!></button> <button> </button></div> <div class="relative svelte-1o4jdf5"><button class="ctrl ctrl-xs vol-toggle-btn svelte-1o4jdf5" aria-label="Toggle volume slider"><!></button></div></div></div></div> <div><div class="mobile-close-bar hidden py-2 px-4 border-b border-white/5 flex items-center justify-between svelte-1o4jdf5"><span class="text-xs font-bold text-white/50 svelte-1o4jdf5">Track Library</span> <button class="px-3 py-1 bg-white/5 text-white/75 rounded-lg text-xs font-bold svelte-1o4jdf5">Back to player</button></div> <div class="tl-header flex justify-between items-center gap-3 svelte-1o4jdf5"><div class="flex items-center gap-2 svelte-1o4jdf5"><!><span class="svelte-1o4jdf5">TRACKS</span> <span class="tl-count svelte-1o4jdf5"> </span></div> <div class="flex items-center gap-1.5 ml-auto svelte-1o4jdf5"><span class="text-[9px] text-white/30 font-bold font-sans svelte-1o4jdf5">SORT BY:</span> <select class="bg-black/40 border border-white/10 rounded px-1.5 py-0.5 text-[10px] font-bold text-white/60 outline-none cursor-pointer hover:border-white/20 transition-all font-sans svelte-1o4jdf5"><option class="svelte-1o4jdf5">DEFAULT</option><option class="svelte-1o4jdf5">ARTIST</option><option class="svelte-1o4jdf5">ALBUM</option><option class="svelte-1o4jdf5">YEAR</option><option class="svelte-1o4jdf5">FILENAME</option><option class="svelte-1o4jdf5">GENRE</option><option class="svelte-1o4jdf5">SEASON</option></select></div></div> <div class="tracklist scroll-y svelte-1o4jdf5"></div></div></div>`),ct=b(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><div class="sec-head svelte-1o4jdf5"><h2 class="sec-title svelte-1o4jdf5">Samples</h2> <p class="sec-sub svelte-1o4jdf5">MP3 · MP4 · WAV · OGG · YouTube · Instagram · TikTok</p></div> <div class="drop-zone svelte-1o4jdf5"><!> <p class="drop-title svelte-1o4jdf5">Drop files or paste a link</p> <p class="drop-sub svelte-1o4jdf5">Supports all major audio, video, and streaming links</p> <div class="link-row svelte-1o4jdf5"><input type="url" class="link-input svelte-1o4jdf5" placeholder="https://youtube.com/watch?v=..." aria-label="Paste link"/> <button class="add-btn svelte-1o4jdf5"><!>Add</button></div></div> <div class="empty-state svelte-1o4jdf5"><div class="wip-tape svelte-1o4jdf5">COMING SOON</div> <p class="svelte-1o4jdf5">Your samples will appear here once added.</p></div></div>`),lt=b(`<div class="svc-chip svelte-1o4jdf5"><span class="svelte-1o4jdf5"> </span><span class="svelte-1o4jdf5"> </span><!></div>`),ut=b(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><div class="sec-head svelte-1o4jdf5"><h2 class="sec-title svelte-1o4jdf5">Playlists</h2> <p class="sec-sub svelte-1o4jdf5">Connect Spotify to sync playlists across all services
              automatically</p></div> <div class="spotify-card svelte-1o4jdf5"><div class="sp-icon svelte-1o4jdf5"><svg viewBox="0 0 24 24" fill="currentColor" width="30" height="30" class="svelte-1o4jdf5"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" class="svelte-1o4jdf5"></path></svg></div> <div class="sp-info svelte-1o4jdf5"><h3 class="svelte-1o4jdf5">Connect Spotify</h3> <p class="svelte-1o4jdf5">Import your playlists and sync across services</p></div> <button class="sp-btn svelte-1o4jdf5">Connect <!></button></div> <div class="svc-chips svelte-1o4jdf5"></div> <div class="empty-state mx-auto max-w-[380px] text-center svelte-1o4jdf5"><div class="wip-tape svelte-1o4jdf5">COMING SOON</div> <p class="svelte-1o4jdf5">Connect Spotify to see your playlists, automatically transcribed
              across all services.</p></div></div>`),dt=b(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><div class="sec-head svelte-1o4jdf5"><h2 class="sec-title svelte-1o4jdf5">Radio</h2> <p class="sec-sub svelte-1o4jdf5">Stream live broadcasts, dog shows, and podcast feeds</p></div> <div class="empty-state mx-auto max-w-[380px] text-center svelte-1o4jdf5"><div class="wip-tape svelte-1o4jdf5">COMING SOON</div> <p class="svelte-1o4jdf5">Live radio feeds will appear here once connected.</p></div></div>`),ft=b(`<div class="app-loading-spinner svelte-1o4jdf5" aria-label="Loading..."></div>`),pt=b(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><!></div>`),mt=b(`<div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 animate-pulse svelte-1o4jdf5"><div class="bg-black/75 border border-red-500/30 px-4 py-2 rounded text-[12px] font-mono tracking-widest text-red-500 font-bold uppercase shadow-[0_0_20px_rgba(239,68,68,0.3)] select-none svelte-1o4jdf5">NO SIGNAL</div></div>`),ht=b(`<button> </button>`),gt=b(`<div class="visualizer-container fullscreen cursor-pointer svelte-1o4jdf5"><canvas class="visualizer-canvas svelte-1o4jdf5"></canvas> <!> <div class="visualizer-overlay svelte-1o4jdf5"><div class="flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-lg p-1 border border-white/10 svelte-1o4jdf5"></div></div></div>`),_t=b(`<div class="mp-backdrop svelte-1o4jdf5"><div><header class="panel-header svelte-1o4jdf5"><div class="brand svelte-1o4jdf5"><button class="logo-btn svelte-1o4jdf5" aria-label="Open DOGS Info"><!></button> <h1 class="svelte-1o4jdf5"></h1></div> <button class="close-btn svelte-1o4jdf5" aria-label="Close panel"><!></button></header> <!> <div class="mp-body svelte-1o4jdf5"><!></div> <footer class="mp-footer svelte-1o4jdf5"><div class="mp-status svelte-1o4jdf5"><span class="mp-dot svelte-1o4jdf5"></span><span class="svelte-1o4jdf5">WE ARE DOGS</span></div> <span class="svelte-1o4jdf5">MUSIC</span></footer></div> <!> <canvas class="fader-fx-canvas pointer-events-none svelte-1o4jdf5"></canvas></div>`);function vt(b,x){we(x,!0);let w=[{id:`songs`,label:`Songs`,icon:s},{id:`samples`,label:`Samples`,icon:pe},{id:`playlists`,label:`Playlists`,icon:Le},{id:`radio`,label:`Radio`,icon:e},{id:`battle`,label:`Battle`,icon:Oe}],vt=`/img/error_cover.png`;function yt(e){e.target.src.endsWith(vt)||(e.target.src=vt)}let bt=ve(x,`isClosing`,3,!1),xt=ve(x,`initialTrackId`,3,null),I=T(`songs`),L=T(`default`),St=T(null);S(()=>{u(I)===`battle`&&!u(St)&&Re(()=>import(`./BattlePanel-B-rty92_.js`).then(e=>{A(St,e.default,!0)}),__vite__mapDeps([0,1,2,3,4]))});let R=T(!1),Ct=T(!1),wt=T(!1),Tt=T(null),z=E(()=>F.isPlaying&&!bt()),B=T(!1),Et=T(0),Dt=T(!1),Ot=T(null),V=null,kt=!1,At=T(!1),jt=E(()=>{let e=u(W)?.id||`default`,t=[],n=0;for(let t=0;t<e.length;t++)n=e.charCodeAt(t)+((n<<5)-n);for(let e=0;e<60;e++){let r=Math.abs(Math.sin(n+e))*80+20;t.push(r)}return t});S(()=>{window.innerWidth<=640&&u(B)&&u(Et)===0&&u(R)&&A(R,!1)}),S(()=>{F.isPlaying&&A(At,!0)});let Mt=E(()=>!F.isPlaying&&!u(At)?We.fragmentShader:Ue[u(Et)].fragmentShader);S(()=>{let e=F.analyser;return u(B)&&u(Ot)&&!bt()&&(V=new He(u(Ot),e),V.init(u(Mt)),V.start()),()=>{V&&(V.destroy(),V=null)}}),S(()=>{let e=u(Mt);V&&u(B)&&(V.setPreset(e),V.start())}),S(()=>{u(R)?!history.state?.tracklistOpen&&!kt&&(history.pushState({tracklistOpen:!0},``),kt=!0):kt&&(history.back(),kt=!1)}),Se(()=>{kt&&(history.back(),kt=!1)});function Nt(e){!e.state?.tracklistOpen&&u(R)&&(A(R,!1),kt=!1)}function Pt(e){u(wt)&&u(Tt)&&!u(Tt).contains(e.target)&&!e.target.closest(`.vol-toggle-btn`)&&A(wt,!1)}let H=[{id:`hollywood`,title:`HOLLYWOOD`,artist:`YG`,album:`THE GENTLEMEN'S CLUB`,cover:`https://data.wearedogs.net/img/covers/2026/yg.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/yg.jpg`,src:`https://data.wearedogs.net/music/2026/HOLLYWOOD.mp3`,instrumental:`https://data.wearedogs.net/music/2026/HOLLYWOOD-free.mp3`,dateAdded:`2026-06-24T03:00:00-05:00`,year:2026,genre:`Hip-Hop`,attrib:`https://the-gentlemens-club.com/`},{id:`chicago`,title:`Chicago`,artist:`Michael Jackson`,album:`Xscape`,cover:`https://data.wearedogs.net/img/covers/2026/mj.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/mj.jpg`,src:`https://data.wearedogs.net/music/2026/Chicago.mp3`,instrumental:`https://data.wearedogs.net/music/2026/Chicago-free.mp3`,dateAdded:`2026-06-24T03:00:00-05:00`,year:2014,genre:`Pop`},{id:`rain`,title:`Pourin Rain (feat. Skratch Bastid)`,artist:`Zeds Dead`,album:`Return to the Return (of the Spectrum of Intergalactic Happiness)`,cover:`https://data.wearedogs.net/img/covers/2026/zd.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/zd.jpg`,src:`https://data.wearedogs.net/music/2026/Pourin.mp3`,instrumental:``,dateAdded:`2026-07-07T018:12:00-05:00`,year:2026,genre:`Electronic`,attrib:`https://shop.zedsdead.net/`},{id:`denchai`,title:`Den Chai`,artist:`The Buddha-Bar Lounge`,album:`Den Chai`,cover:`https://data.wearedogs.net/img/covers/2026/buddha.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/buddha.png`,src:``,instrumental:`https://data.wearedogs.net/music/2026/DENCHAI.mp3`,dateAdded:`2026-07-07T22:34:00-05:00`,year:2008,genre:`Lounge`,attrib:`https://open.spotify.com/artist/0du3MpnxBOpQEie1IV3u9v?si=2UO722ntTE--Ck_Ji7Go7Q`},{id:`rainbow`,title:`Rainbow in the Dark`,artist:`Das Racist`,album:`Shut Up, Dude`,cover:`https://data.wearedogs.net/img/covers/2026/rainbow.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/rainbow.png`,src:`https://data.wearedogs.net/music/2026/rainbow.mp3`,instrumental:`https://data.wearedogs.net/music/2026/rainbow-free.mp3`,dateAdded:`2026-07-08T16:35:00-05:00`,year:2010,genre:`Hip-Hop`,attrib:`https://dasracist.bandcamp.com/album/shut-up-dude`},{id:`hipsong`,title:`Hip Song`,artist:`Toby Fox / Trevor Alan Gomes`,album:`Deltarune`,cover:`https://data.wearedogs.net/img/covers/2026/deltarune.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/deltarune.png`,src:`https://data.wearedogs.net/music/2026/shop.mp3`,instrumental:`https://data.wearedogs.net/music/2026/shop-free.mp3`,dateAdded:`2026-07-09T01:22:00-05:00`,year:2021,genre:`Video Game`,attrib:`https://deltarune.com/`},{id:`sleepless`,title:`Sleepless`,artist:`deadmau5`,album:`> album title goes here <`,cover:`https://data.wearedogs.net/img/covers/2026/sleepless.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/sleepless.png`,src:``,instrumental:`https://data.wearedogs.net/music/2026/sleepless.mp3`,dateAdded:`2026-07-12T04:22:00-05:00`,year:2026,genre:`Electronic`,attrib:`https://deadmau5.com/`},{id:`skitzo`,title:`Skitzo (feat. Young Thug)`,artist:`Travis Scott`,album:`UTOPIA`,cover:`https://data.wearedogs.net/img/covers/2026/utopia.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/utopia.png`,src:`https://data.wearedogs.net/music/2026/skitzo.mp3`,instrumental:`https://data.wearedogs.net/music/2026/skitzo-free.mp3`,dateAdded:`2026-07-16T01:56:00-05:00`,year:2023,genre:`Hip-Hop`,attrib:`https://shop.travisscott.com/`}];function Ft(e){return e.src?e.src.split(`/`).pop():``}function It(e){if(!e.dateAdded)return`Summer`;let t=new Date(e.dateAdded).getMonth();return t===11||t===0||t===1?`Winter`:t>=2&&t<=4?`Spring`:t>=5&&t<=7?`Summer`:`Fall`}let U=E(()=>{let e=[...H];return u(L)===`artist`?e.sort((e,t)=>e.artist.localeCompare(t.artist)):u(L)===`album`?e.sort((e,t)=>e.album.localeCompare(t.album)):u(L)===`year`?e.sort((e,t)=>(e.year||0)-(t.year||0)):u(L)===`filename`?e.sort((e,t)=>Ft(e).localeCompare(Ft(t))):u(L)===`genre`?e.sort((e,t)=>(e.genre||``).localeCompare(t.genre||``)):u(L)===`season`&&e.sort((e,t)=>It(e).localeCompare(It(t))),e}),W=E(()=>H[F.currentTrackIndex]),Lt=T(0),Rt=T(0),zt=T(0),Bt=T(0),Vt=T(0),Ht=T(0),Ut=T(null),Wt=null;function Gt(e,t){e.stopPropagation();let n=`${window.location.origin}/music/${t.id}`;navigator.clipboard.writeText(n).then(()=>{A(Ut,t.id,!0),Wt&&clearTimeout(Wt),Wt=setTimeout(()=>{A(Ut,null)},2e3)}).catch(e=>{console.error(`Failed to copy share link:`,e)})}Se(()=>{Wt&&clearTimeout(Wt)}),te(()=>{if(F.init(H),xt()){let e=H.findIndex(e=>e.id===xt());e!==-1&&F.loadTrack(e,!0)}else if(!F.hasPickedRandomTrack){F.hasPickedRandomTrack=!0;let e=Math.floor(Math.random()*H.length);F.loadTrack(e,!1)}});let G=T(null);function Kt(){let e=document.querySelector(`.track-row[data-track-id="${u(G)}"]`);e&&e.scrollIntoView({block:`nearest`,behavior:`smooth`})}function qt(e){A(G,e.id,!0);let t=H.findIndex(t=>t.id===e.id);F.currentTrackIndex===t&&!F.fetchErrors[e.id]?F.togglePlay():F.loadTrack(t,!0)}function Jt(){window.innerWidth<=640?A(R,!0):A(B,!u(B))}function Yt(){let e=!F.isInstrumental;F.setCrossfade(e)||(Te(q),u(nn)||(A(nn,!0),setTimeout(()=>{A(nn,!1)},300)),u(q)===5?($(),A(rn,!0),setTimeout(()=>{A(rn,!1)},150)):u(q)===10?$(35):u(q)>5&&u(q)<10?$(8):u(q)>10&&Math.random()<.4&&$(3))}function Xt(e){return!e||isNaN(e)?`0:00`:`${Math.floor(e/60)}:${Math.floor(e%60).toString().padStart(2,`0`)}`}function Zt(e){let t=document.activeElement;if(!(t&&(t.tagName===`INPUT`||t.tagName===`TEXTAREA`||t.isContentEditable))){if(e.shiftKey){if(e.key===`ArrowRight`){e.preventDefault(),A(I,w[(w.findIndex(e=>e.id===u(I))+1)%w.length].id,!0);return}else if(e.key===`ArrowLeft`){e.preventDefault(),A(I,w[(w.findIndex(e=>e.id===u(I))-1+w.length)%w.length].id,!0);return}}if(e.code===`Space`||e.key===` `)u(I)===`songs`&&(e.preventDefault(),F.togglePlay());else if(e.key===`ArrowDown`){if(u(I)===`songs`&&u(U).length>0){e.preventDefault();let t=u(U).findIndex(e=>e.id===u(G));if(t===-1){let e=H[F.currentTrackIndex];t=u(U).findIndex(t=>t.id===e?.id)}let n=(t+1)%u(U).length;A(G,u(U)[n].id,!0),Kt()}}else if(e.key===`ArrowUp`){if(u(I)===`songs`&&u(U).length>0){e.preventDefault();let t=u(U).findIndex(e=>e.id===u(G));if(t===-1){let e=H[F.currentTrackIndex];t=u(U).findIndex(t=>t.id===e?.id)}let n=(t-1+u(U).length)%u(U).length;A(G,u(U)[n].id,!0),Kt()}}else if(e.key===`Enter`&&u(I)===`songs`&&u(G)){e.preventDefault();let t=u(U).find(e=>e.id===u(G));t&&qt(t)}}}let Qt=0,$t=0;function en(e){if(e.target&&(e.target.tagName===`INPUT`||e.target.closest(`button`)||e.target.closest(`.ctrl`))){Qt=0,$t=0;return}Qt=e.touches[0].clientX,$t=e.touches[0].clientY}function tn(e){if(Qt===0||!e.changedTouches||e.changedTouches.length===0)return;let t=e.changedTouches[0].clientX-Qt,n=e.changedTouches[0].clientY-$t;if(Math.abs(t)<=Math.abs(n)||Math.abs(t)<=60)return;let r=w.findIndex(e=>e.id===u(I));r!==-1&&(t<0&&r<w.length-1?A(I,w[r+1].id,!0):t>0&&r>0&&A(I,w[r-1].id,!0))}let K=T(null),q=T(0),nn=T(!1),rn=T(!1),J,Y,X,Z=[],Q=[],an,on=T(!1);S(()=>(u(K)&&cn(),()=>{an&&cancelAnimationFrame(an),window.removeEventListener(`resize`,ln),X&&(X.dispose(),X=null),J=null,Y=null,Z=[],Q=[]})),S(()=>{if(F.currentTrackIndex,u(I),bt(),A(q,0),A(on,!1),J){for(let e of Z)J.remove(e.mesh);for(let e of Q)J.remove(e.mesh)}Z=[],Q=[]});function sn(){let e=document.querySelector(`.dj-fader-knob`);if(!e)return{x:window.innerWidth/2,y:window.innerHeight/2};let t=e.getBoundingClientRect();return{x:t.left+t.width/2,y:window.innerHeight-(t.top+t.height/2)}}function cn(){if(!u(K))return;let e=window.innerWidth,t=window.innerHeight;u(K).width=e,u(K).height=t,J=new v,Y=new re(0,e,t,0,-1,1),X=new ye({canvas:u(K),alpha:!0,antialias:!0}),X.setSize(e,t,!1),X.setPixelRatio(Math.min(window.devicePixelRatio,2)),window.addEventListener(`resize`,ln),un()}function ln(){if(!u(K)||!X||!Y)return;let e=window.innerWidth,t=window.innerHeight;u(K).width=e,u(K).height=t,X.setSize(e,t,!1),Y.right=e,Y.top=t,Y.updateProjectionMatrix()}function un(){if(an=requestAnimationFrame(un),!(!J||!Y||!X||!u(K))){if(u(q)>=10&&(A(on,!0),Math.random()<.22)){let e=sn();dn(e.x,e.y)}for(let e=Z.length-1;e>=0;e--){let t=Z[e];t.x+=t.vx,t.y+=t.vy,t.vy+=t.ay,t.life-=t.decay,t.mesh.position.set(t.x,t.y,0),t.mesh.material.opacity=t.life,t.life<=0&&(J.remove(t.mesh),t.mesh.geometry.dispose(),t.mesh.material.dispose(),Z.splice(e,1))}for(let e=Q.length-1;e>=0;e--){let t=Q[e];t.x+=t.vx,t.y+=t.vy,t.life-=t.decay;let n=t.startScale+(1-t.life)*88;t.mesh.scale.set(n,n,1),t.mesh.position.set(t.x,t.y,0),t.mesh.material.opacity=t.life*.16,t.life<=0&&(J.remove(t.mesh),t.mesh.geometry.dispose(),t.mesh.material.dispose(),Q.splice(e,1))}X.render(J,Y)}}function dn(e,t){if(!J)return;let r=new ie(5,8),a=.85+Math.random()*.12,o=new n(r,new xe({color:new i(a,a,a*1.01),transparent:!0,opacity:.06,blending:1}));o.position.set(e,t,0),J.add(o),Q.push({mesh:o,x:e,y:t,vx:(Math.random()-.5)*.55+Math.sin(Date.now()*.001)*.22,vy:Math.random()*.7+1.25,startScale:1,life:1,decay:6e-4+Math.random()*4e-4})}function $(e=25){if(!J||!u(K))return;let t=sn(),r=t.x,a=t.y;for(let t=0;t<e;t++){let e=new n(new ie(1.3,4),new xe({color:new i(Math.random()<.4?16711765:16755200),transparent:!0,opacity:1,blending:2}));e.position.set(r,a,0),J.add(e);let t=Math.random()*Math.PI*2,o=Math.random()*4+2;Z.push({mesh:e,x:r,y:a,vx:Math.cos(t)*o,vy:Math.sin(t)*o,ay:-.15,life:1,decay:.02+Math.random()*.02})}}var fn=_t();se(`keydown`,t,Zt),se(`popstate`,t,Nt),se(`click`,t,Pt);var pn=D(fn);let mn;var hn=D(pn),gn=D(hn),_n=D(gn);ze(D(_n),{size:`panel`}),O(_n);var vn=M(_n,2);vn.textContent=`MUSIC`,O(gn);var yn=M(gn,2);he(D(yn),{size:20}),O(yn),O(hn);var bn=M(hn,2);Ve(bn,{get tabs(){return w},get activeTab(){return u(I)},set activeTab(e){A(I,e,!0)}});var xn=M(bn,2),Sn=D(xn),Cn=e=>{var t=st(),n=D(t);let i;var s=D(n);let v;var y=D(s),te=D(y),re=e=>{var t=Ke(),n=D(t);Ce(n,e=>A(Ot,e),()=>u(Ot));var i=M(n,2),a=e=>{m(e,Ge())};r(i,e=>{!F.isPlaying&&!u(At)&&e(a)});var o=M(i,2);Ne(D(o),{size:16,class:`text-white/70`}),O(o),O(t),f(`click`,t,()=>{A(Dt,!0)}),m(e,t)},b=e=>{var t=qe();Ne(D(t),{size:16,class:`text-white/20`}),O(t),m(e,t)},ie=e=>{var t=ee(),n=Me(t),i=e=>{var t=Je(),n=D(t);let r;var i=M(D(n),8),a=D(i);let o;O(i),k(2),O(n);var s=M(n,2);let c;O(t),C(()=>{r=P(n,1,`vinyl-record svelte-1o4jdf5`,null,r,{spinning:u(z)}),j(a,`src`,F.fetchErrors[u(W).id]||!u(W).cover?vt:u(W).cover),j(a,`alt`,u(W).album),o=P(a,1,`record-art svelte-1o4jdf5`,null,o,{loaded:u(Ct)}),c=P(s,1,`tonearm svelte-1o4jdf5`,null,c,{playing:u(z)})}),f(`click`,t,Jt),se(`load`,a,()=>A(Ct,!0)),se(`error`,a,yt),le(a),m(e,t)},o=e=>{let t=E(()=>F.duration>0?(1-F.currentTime/F.duration)*.45+.25:.48),n=E(()=>F.duration>0?F.currentTime/F.duration*.45+.25:.48);var r=Ye(),i=D(r),a=D(i),o=D(a),s=D(o,!0);O(o),k(2),O(a);var l=M(a,2),d=D(l);let p;var h=M(d,2);let g;var _=M(h,2);let v;var ee=M(_,2);let y;O(l),O(i),O(r),C(()=>{c(s,u(W).title),p=P(d,1,`spindle-left bg-zinc-900 svelte-1o4jdf5`,null,p,{spinning:u(z)}),g=P(h,1,`tape-roll-left bg-amber-950/70 svelte-1o4jdf5`,null,g,{spinning:u(z)}),ge(h,`width: ${u(t)*46}px; height: ${u(t)*46}px;`),v=P(_,1,`spindle-right bg-zinc-900 svelte-1o4jdf5`,null,v,{spinning:u(z)}),y=P(ee,1,`tape-roll-right bg-amber-950/70 svelte-1o4jdf5`,null,y,{spinning:u(z)}),ge(ee,`width: ${u(n)*46}px; height: ${u(n)*46}px;`)}),f(`click`,r,Jt),m(e,r)},s=e=>{var t=Xe(),n=D(t),r=M(D(n),4),i=M(D(r),4),a=D(i),o=D(a,!0);O(a);var s=M(a,2),l=D(s,!0);O(s),O(i),O(r);var d=M(r,2),p=D(d);let h;var g=M(p,2),_=D(g);let v;O(g),O(d);var ee=M(d,2);let y;O(n),O(t),C(()=>{c(o,u(W).title),c(l,u(W).artist||`WEAREDOGS`),h=P(p,1,`floppy-shutter-slider bg-zinc-400 svelte-1o4jdf5`,null,h,{open:u(z)}),v=P(_,1,`floppy-magnetic-disc bg-zinc-900 svelte-1o4jdf5`,null,v,{spinning:u(z)}),y=P(ee,1,`floppy-drive-led svelte-1o4jdf5`,null,y,{active:u(z)})}),f(`click`,t,Jt),m(e,t)},l=e=>{var t=Qe(),n=D(t),r=D(n);let i;var o=M(r,2),s=D(o),c=D(s);let l;var d=M(c,2);let p;O(s);var h=M(s,2),g=D(h);let _;O(h);var v=M(h,2);a(v,20,()=>Array(10),ne,(e,t,n)=>{var r=Ze();let i;C(e=>i=P(r,1,`comb-tooth svelte-1o4jdf5`,null,i,e),[()=>({vibrating:u(z)&&n%3==Math.floor(F.currentTime*4)%3})]),m(e,r)}),O(v),O(o),O(n),O(t),C(()=>{i=P(r,1,`music-box-key svelte-1o4jdf5`,null,i,{spinning:u(z)}),l=P(c,1,`music-box-gear gear-1 svelte-1o4jdf5`,null,l,{spinning:u(z)}),p=P(d,1,`music-box-gear gear-2 svelte-1o4jdf5`,null,p,{spinning:u(z)}),_=P(g,1,`music-box-drum bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 svelte-1o4jdf5`,null,_,{spinning:u(z)})}),f(`click`,t,Jt),m(e,t)};r(n,e=>{Be.musicDeckModel===`vinyl`?e(i):Be.musicDeckModel===`cassette`?e(o,1):Be.musicDeckModel===`floppy`?e(s,2):Be.musicDeckModel===`musicbox`&&e(l,3)}),m(e,t)};r(te,e=>{u(B)&&!u(Dt)?e(re):u(B)&&u(Dt)?e(b,1):e(ie,-1)}),O(y);var oe=M(y,2),x=D(oe),ce=D(x),S=D(ce),w=e=>{fe(e,{size:12,class:`text-[#22c55e]`})},T=e=>{o(e,{size:12})};r(S,e=>{u(Ut)===u(W).id?e(w):e(T,-1)}),O(ce),O(x);var he=M(x,2);let ve;var ye=D(he);let xe;var Se=D(ye,!0);O(ye),O(he);var we=M(he,2);let Te;var Ee=D(we);let Oe;var ke=D(Ee,!0);O(Ee),O(we);var Le=M(we,2);let Re;var ze=D(Le);let Ve;var He=D(ze,!0);O(ze),O(Le),O(oe),O(s);var We=M(s,2),ct=D(We),lt=D(ct),ut=D(lt,!0);O(lt);var dt=M(lt,2),ft=D(dt);a(ft,21,()=>u(jt),ne,(e,t,n)=>{let r=E(()=>F.duration>0?F.currentTime/F.duration:0),i=E(()=>n/60);var a=$e();let o;C(()=>{o=P(a,1,`waveform-bar transition-colors duration-100 rounded-t svelte-1o4jdf5`,null,o,{active:u(i)<=u(r)}),ge(a,`height: ${u(t)??``}%; width: 3px;`)}),m(e,a)}),O(ft);var pt=M(ft,2);De(pt),O(dt);var mt=M(dt,2),ht=D(mt,!0);O(mt),O(ct);var gt=M(ct,2),_t=D(gt);let bt;ae(D(_t),{size:15}),O(_t);var xt=M(_t,2);Fe(D(xt),{size:19}),O(xt);var I=M(xt,2);let St;var V=D(I),kt=e=>{je(e,{size:22})},Mt=e=>{m(e,et())},Nt=e=>{ue(e,{size:22,fill:`currentColor`})},Pt=e=>{p(e,{size:22,fill:`currentColor`})};r(V,e=>{F.fetchErrors[u(W).id]?e(kt):F.isLoading?e(Mt,1):F.isPlaying?e(Nt,2):e(Pt,-1)}),O(I);var Ft=M(I,2);_e(D(Ft),{size:19}),O(Ft);var It=M(Ft,2);let Wt;var Kt=D(It),Zt=e=>{h(e,{size:15})},Qt=e=>{l(e,{size:15})};r(Kt,e=>{F.repeatMode===2?e(Zt):e(Qt,-1)}),O(It),O(gt);var $t=M(gt,2),en=D($t);let tn;var K=D(en);let J;pe(D(K),{size:12}),k(2),O(K);var Y=M(K,2),X=D(Y);let Z;O(Y);var Q=M(Y,2);let an;Ie(D(Q),{size:12}),k(2),O(Q),O(en),O($t);var on=M($t,2),sn=D(on),cn=e=>{var t=tt(),n=D(t),i=D(n),a=e=>{g(e,{size:12,class:`text-red-400`})},o=e=>{de(e,{size:12})};r(i,e=>{F.isMuted||F.volume===0?e(a):e(o,-1)}),O(n);var s=M(n,2);De(s);var l=M(s,2),d=D(l);O(l),O(t),Ce(t,e=>A(Tt,e),()=>u(Tt)),C(e=>{be(s,F.volume),c(d,`${e??``}%`)},[()=>Math.round(F.volume*100)]),f(`click`,n,()=>F.toggleMute()),f(`input`,s,e=>F.setVolume(parseFloat(e.target.value))),m(e,t)};r(sn,e=>{u(wt)&&e(cn)});var ln=M(sn,2),un=D(ln);let dn;_(D(un),{size:13}),O(un);var $=M(un,2),fn=D($,!0);O($),O(ln);var pn=M(ln,2),mn=D(pn),hn=D(mn),gn=e=>{g(e,{size:13,class:`text-red-400`})},_n=e=>{de(e,{size:13})};r(hn,e=>{F.isMuted||F.volume===0?e(gn):e(_n,-1)}),O(mn),O(pn),O(on),O(We),O(n);var vn=M(n,2);let yn;var bn=D(vn),xn=M(D(bn),2);O(bn);var Sn=M(bn,2),Cn=D(Sn),wn=D(Cn);Ae(wn,{size:13});var Tn=M(wn,3),En=D(Tn,!0);O(Tn),O(Cn);var Dn=M(Cn,2),On=M(D(Dn),2),kn=D(On);kn.value=kn.__value=`default`;var An=M(kn);An.value=An.__value=`artist`;var jn=M(An);jn.value=jn.__value=`album`;var Mn=M(jn);Mn.value=Mn.__value=`year`;var Nn=M(Mn);Nn.value=Nn.__value=`filename`;var Pn=M(Nn);Pn.value=Pn.__value=`genre`;var Fn=M(Pn);Fn.value=Fn.__value=`season`,O(On),O(Dn),O(Sn);var In=M(Sn,2);a(In,21,()=>u(U),ne,(e,t,n)=>{var i=ot();let a;var s=D(i),l=D(s),d=e=>{m(e,nt())},p=e=>{var t=rt();t.textContent=n+1,m(e,t)};r(l,e=>{H[F.currentTrackIndex].id===u(t).id&&F.isPlaying?e(d):e(p,-1)}),O(s);var h=M(s,2),g=M(h,2),_=D(g),v=D(_);let ee;var y=D(v,!0);O(v);var te=M(v,2),ne=e=>{var t=it();je(D(t),{size:10}),k(),O(t),m(e,t)};r(te,e=>{F.fetchErrors[u(t).id]&&e(ne)}),O(_);var re=M(_,2),b=D(re);O(re),O(g);var ie=M(g,2),ae=D(ie),oe=e=>{var n=at(),r=D(n);O(n),C(()=>j(r,`href`,u(t).attrib)),f(`click`,r,e=>e.stopPropagation()),m(e,n)};r(ae,e=>{u(t).attrib&&e(oe)});var x=M(ae,2),ce=D(x),ue=e=>{fe(e,{size:12,class:`text-[#22c55e]`})},S=e=>{o(e,{size:12})};r(ce,e=>{u(Ut)===u(t).id?e(ue):e(S,-1)}),O(x),O(ie),O(i),C(()=>{a=P(i,1,`track-row svelte-1o4jdf5`,null,a,{active:H[F.currentTrackIndex].id===u(t).id,"kb-focused":u(G)===u(t).id,"fetch-error":F.fetchErrors[u(t).id]}),j(i,`data-track-id`,u(t).id),j(h,`src`,F.fetchErrors[u(t).id]||!u(t).cover?vt:u(t).cover),j(h,`alt`,u(t).album),ee=P(v,1,`tr-title svelte-1o4jdf5`,null,ee,{"line-through":F.fetchErrors[u(t).id],"opacity-50":F.fetchErrors[u(t).id]}),c(y,u(t).title),c(b,`${u(t).artist??``} · ${u(t).album??``} (${(u(t).year||``)??``})`)}),f(`click`,i,()=>qt(u(t))),se(`error`,h,yt),le(h),f(`click`,x,e=>Gt(e,u(t))),m(e,i)}),O(In),O(vn),O(t),C((e,t)=>{i=P(n,1,`player-side svelte-1o4jdf5`,null,i,{"tracklist-open":u(R)}),v=P(s,1,`player-top-block transition-all duration-300 ease-in-out svelte-1o4jdf5`,null,v,{"opacity-0":u(R),"scale-95":u(R),"pointer-events-none":u(R)}),ve=P(he,1,`scroll-container svelte-1o4jdf5`,null,ve,{overflowing:u(Rt)>u(Lt)}),ge(he,`--scroll-dist: -${u(Rt)-u(Lt)}px`),xe=P(ye,1,`track-title scroll-text svelte-1o4jdf5`,null,xe,{"animate-scroll":u(Rt)>u(Lt)}),c(Se,u(W).title),Te=P(we,1,`scroll-container svelte-1o4jdf5`,null,Te,{overflowing:u(Bt)>u(zt)}),ge(we,`--scroll-dist: -${u(Bt)-u(zt)}px`),Oe=P(Ee,1,`track-artist scroll-text svelte-1o4jdf5`,null,Oe,{"animate-scroll":u(Bt)>u(zt)}),c(ke,u(W).artist),Re=P(Le,1,`scroll-container svelte-1o4jdf5`,null,Re,{overflowing:u(Ht)>u(Vt)}),ge(Le,`--scroll-dist: -${u(Ht)-u(Vt)}px`),Ve=P(ze,1,`track-album scroll-text svelte-1o4jdf5`,null,Ve,{"animate-scroll":u(Ht)>u(Vt)}),c(He,u(W).album),c(ut,e),j(pt,`max`,F.duration||100),be(pt,F.currentTime),c(ht,t),bt=P(_t,1,`ctrl ctrl-sm svelte-1o4jdf5`,null,bt,{"active-ctrl":F.isShuffled}),St=P(I,1,`ctrl ctrl-play svelte-1o4jdf5`,null,St,{"ctrl-error":F.fetchErrors[u(W).id]}),j(I,`aria-label`,F.isPlaying?`Pause`:`Play`),Wt=P(It,1,`ctrl ctrl-sm svelte-1o4jdf5`,null,Wt,{"active-ctrl":F.repeatMode>0}),tn=P(en,1,`dj-crossfader svelte-1o4jdf5`,null,tn,{"fader-flash":u(rn),"fader-fried":u(q)>=10}),J=P(K,1,`fader-label left-label flex items-center gap-1 svelte-1o4jdf5`,null,J,{active:!F.isInstrumental}),Z=P(X,1,`dj-fader-knob svelte-1o4jdf5`,null,Z,{right:F.isInstrumental,"knob-jiggle":u(nn),fried:u(q)>=10}),an=P(Q,1,`fader-label right-label flex items-center gap-1 svelte-1o4jdf5`,null,an,{active:F.isInstrumental}),dn=P(un,1,`ctrl ctrl-xs svelte-1o4jdf5`,null,dn,{"active-ctrl":u(B)}),P($,1,`w-[90px] h-[20px] flex items-center justify-center rounded text-[9px] font-bold transition-all font-mono uppercase tracking-wider select-none cursor-pointer
                      ${u(B)?`bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/25 active:scale-95`:`bg-transparent border border-white/5 text-white/20 hover:text-white/40 hover:border-white/10`}`,`svelte-1o4jdf5`),j($,`title`,u(B)?`Click to cycle presets`:`Click to enable visualizer`),c(fn,Ue[u(Et)].name),yn=P(vn,1,`tracklist-side svelte-1o4jdf5`,null,yn,{"show-mobile":u(R)}),c(En,H.length)},[()=>Xt(F.currentTime),()=>Xt(F.duration)]),f(`click`,ce,e=>Gt(e,u(W))),Pe(ye,`clientWidth`,e=>A(Rt,e)),Pe(he,`clientWidth`,e=>A(Lt,e)),Pe(Ee,`clientWidth`,e=>A(Bt,e)),Pe(we,`clientWidth`,e=>A(zt,e)),Pe(ze,`clientWidth`,e=>A(Ht,e)),Pe(Le,`clientWidth`,e=>A(Vt,e)),f(`input`,pt,e=>{F.seek(parseFloat(e.target.value))}),f(`change`,pt,e=>{F.play(parseFloat(e.target.value))}),f(`click`,_t,()=>F.isShuffled=!F.isShuffled),f(`click`,xt,()=>F.prevTrack()),f(`click`,I,()=>F.togglePlay()),f(`click`,Ft,()=>F.nextTrack()),f(`click`,It,()=>{F.repeatMode=(F.repeatMode+1)%3}),f(`click`,en,Yt),f(`click`,un,()=>{A(B,!u(B))}),f(`click`,$,()=>{u(B)?A(Et,(u(Et)+1)%Ue.length):A(B,!0)}),f(`click`,mn,()=>{A(wt,!u(wt))}),f(`click`,xn,()=>{A(R,!1)}),me(On,()=>u(L),e=>A(L,e)),N(1,t,()=>d,()=>({duration:120,delay:120})),N(2,t,()=>d,()=>({duration:120})),m(e,t)},wn=e=>{var t=ct(),n=M(D(t),2),r=D(n);pe(r,{size:36});var i=M(r,6),a=M(D(i),2);ce(D(a),{size:15}),k(),O(a),O(i),O(n),k(2),O(t),N(1,t,()=>d,()=>({duration:120,delay:120})),N(2,t,()=>d,()=>({duration:120})),m(e,t)},Tn=e=>{var t=ut(),n=M(D(t),2),r=M(D(n),4);ke(M(D(r)),{size:15}),O(r),O(n);var i=M(n,2);a(i,20,()=>[{name:`Apple Music`,color:`#fc3c44`,icon:`🎵`},{name:`YouTube Music`,color:`#ff0000`,icon:`▶`},{name:`Amazon Music`,color:`#00a8e0`,icon:`♪`},{name:`Tidal`,color:`#00d4f5`,icon:`〰`}],ne,(e,t)=>{var n=lt(),r=D(n),i=D(r,!0);O(r);var a=M(r),o=D(a,!0);O(a),y(M(a),{size:11}),O(n),C(()=>{ge(n,`--sc:${t.color??``}`),c(i,t.icon),c(o,t.name)}),m(e,n)}),O(i),k(2),O(t),N(1,t,()=>d,()=>({duration:120,delay:120})),N(2,t,()=>d,()=>({duration:120})),m(e,t)},En=e=>{var t=dt();N(1,t,()=>d,()=>({duration:120,delay:120})),N(2,t,()=>d,()=>({duration:120})),m(e,t)},Dn=e=>{var t=pt(),n=D(t),i=e=>{let t=E(()=>u(St));var n=ee();oe(Me(n),()=>u(t),(e,t)=>{t(e,{get audioCore(){return F}})}),m(e,n)},a=e=>{m(e,ft())};r(n,e=>{u(St)?e(i):e(a,-1)}),O(t),N(1,t,()=>d,()=>({duration:120,delay:120})),N(2,t,()=>d,()=>({duration:120})),m(e,t)};r(Sn,e=>{u(I)===`songs`?e(Cn):u(I)===`samples`?e(wn,1):u(I)===`playlists`?e(Tn,2):u(I)===`radio`?e(En,3):u(I)===`battle`&&e(Dn,4)}),O(xn),k(2),O(pn);var On=M(pn,2),kn=e=>{var t=gt(),n=D(t);Ce(n,e=>A(Ot,e),()=>u(Ot));var i=M(n,2),o=e=>{m(e,mt())};r(i,e=>{!F.isPlaying&&!u(At)&&e(o)});var s=M(i,2),l=D(s);a(l,21,()=>Ue,ne,(e,t,n)=>{var r=ht(),i=D(r,!0);O(r),C(()=>{P(r,1,`px-2 py-1 rounded text-[9px] font-bold transition-all uppercase tracking-wider font-mono
                ${u(Et)===n?`bg-purple-600 text-white`:`text-white/40 hover:text-white/80`}`,`svelte-1o4jdf5`),c(i,u(t).name)}),f(`click`,r,()=>A(Et,n,!0)),m(e,r)}),O(l),O(s),O(t),f(`click`,t,e=>{e.stopPropagation(),A(Dt,!1)}),f(`click`,s,e=>e.stopPropagation()),m(e,t)};r(On,e=>{u(B)&&u(Dt)&&e(kn)}),Ce(M(On,2),e=>A(K,e),()=>u(K)),O(fn),C(()=>mn=P(pn,1,`mp-container svelte-1o4jdf5`,null,mn,{closing:bt(),"theme-inst":F.isInstrumental})),f(`click`,fn,function(...e){x.onClose?.apply(this,e)}),f(`click`,pn,e=>e.stopPropagation()),f(`click`,_n,()=>{F.isPlaying||window.dispatchEvent(new CustomEvent(`open-info-panel`))}),f(`click`,yn,function(...e){x.onClose?.apply(this,e)}),f(`touchstart`,xn,en,void 0,!0),f(`touchend`,xn,tn),m(b,fn),Ee()}x([`click`,`touchstart`,`touchend`,`input`,`change`]);export{vt as default};