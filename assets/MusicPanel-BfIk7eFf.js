const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/BattlePanel-D_asRlkz.js","assets/vendor-B87WZ28s.js","assets/rolldown-runtime-CMxvf4Kt.js","assets/vendor-Dl9nCA7L.css","assets/BattlePanel-B1S5D9Lq.css"])))=>i.map(i=>d[i]);
import{$r as e,Ar as t,At as n,B as r,Bn as i,Cr as a,Ct as o,Dt as s,E as c,F as l,Fr as u,Hr as d,In as ee,Ir as te,Jr as f,Kr as p,Lr as ne,M as re,Mt as ie,Or as m,Pn as ae,Pr as oe,Qr as h,R as se,Rr as g,Sn as ce,Sr as _,T as v,Tr as le,Ur as y,Ut as ue,V as de,Yr as b,Yt as fe,Z as pe,Zr as x,_ as me,_r as S,ai as he,ar as ge,br as _e,ci as C,cr as ve,dt as ye,er as be,f as xe,fr as Se,gr as w,ht as Ce,ii as T,jr as E,k as we,kr as D,kt as Te,lr as Ee,lt as De,nr as Oe,oi as O,on as ke,or as k,pr as A,qn as Ae,qr as j,rt as je,si as M,ti as Me,tr as Ne,ut as Pe,v as Fe,wr as Ie,wt as Le,yn as Re,yr as ze,zt as Be}from"./vendor-B87WZ28s.js";import{a as N,i as Ve,r as He}from"./index-BQXVH-bv.js";import{t as Ue}from"./SwipeTabNav-BJEltpsN.js";var We=class{constructor(e,t){C(this,`canvas`,null),C(this,`gl`,null),C(this,`analyser`,null),C(this,`program`,null),C(this,`animationFrameId`,null),C(this,`startTime`,0),C(this,`vertexBuffer`,null),C(this,`audioTexture`,null),C(this,`uniforms`,{}),C(this,`frequencyBuffer`,null),this.canvas=e,this.analyser=t,this.frequencyBuffer=new Uint8Array(t?t.frequencyBinCount:128),this.gl=e.getContext(`webgl`)||e.getContext(`experimental-webgl`),this.gl||console.error(`WebGL not supported by this browser.`)}init(e){if(!this.gl)return;let t=this.gl;this.cleanupProgram();let n=this.compileShader(t.VERTEX_SHADER,`
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `),r=this.compileShader(t.FRAGMENT_SHADER,e);if(!n||!r)return;if(this.program=t.createProgram(),t.attachShader(this.program,n),t.attachShader(this.program,r),t.linkProgram(this.program),!t.getProgramParameter(this.program,t.LINK_STATUS)){console.error(`Shader program linking failed:`,t.getProgramInfoLog(this.program));return}t.useProgram(this.program);let i=new Float32Array([-1,-1,1,-1,-1,1,1,1]);this.vertexBuffer=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,this.vertexBuffer),t.bufferData(t.ARRAY_BUFFER,i,t.STATIC_DRAW);let a=t.getAttribLocation(this.program,`a_position`);t.enableVertexAttribArray(a),t.vertexAttribPointer(a,2,t.FLOAT,!1,0,0),this.audioTexture=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.audioTexture),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),this.uniforms={time:t.getUniformLocation(this.program,`u_time`),resolution:t.getUniformLocation(this.program,`u_resolution`),volume:t.getUniformLocation(this.program,`u_volume`),bass:t.getUniformLocation(this.program,`u_bass`),mid:t.getUniformLocation(this.program,`u_mid`),treble:t.getUniformLocation(this.program,`u_treble`),audioTexture:t.getUniformLocation(this.program,`u_audioTexture`)},this.startTime=performance.now(),this.resize()}setPreset(e){this.init(e)}compileShader(e,t){if(!this.gl)return null;let n=this.gl,r=n.createShader(e);return n.shaderSource(r,t),n.compileShader(r),n.getShaderParameter(r,n.COMPILE_STATUS)?r:(console.error(`Shader compilation error (${e===n.VERTEX_SHADER?`VERTEX`:`FRAGMENT`}):`,n.getShaderInfoLog(r)),n.deleteShader(r),null)}start(){this.stop();let e=()=>{this.renderFrame(),this.animationFrameId=requestAnimationFrame(e)};this.animationFrameId=requestAnimationFrame(e)}stop(){this.animationFrameId&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null)}resize(){if(!this.gl||!this.canvas)return;let e=this.gl,t=this.canvas.clientWidth,n=this.canvas.clientHeight;(this.canvas.width!==t||this.canvas.height!==n)&&(this.canvas.width=t,this.canvas.height=n,e.viewport(0,0,t,n))}renderFrame(){if(!this.gl||!this.program)return;let e=this.gl;this.resize(),e.useProgram(this.program),e.bindBuffer(e.ARRAY_BUFFER,this.vertexBuffer);let t=(performance.now()-this.startTime)/1e3,n=0,r=0,i=0,a=0;if(this.analyser){this.analyser.getByteFrequencyData(this.frequencyBuffer);let t=this.frequencyBuffer.length,o=0,s=0,c=0;for(let e=0;e<t;e++){let t=this.frequencyBuffer[e];n+=t,e<12?(r+=t,o++):e<64?(i+=t,s++):(a+=t,c++)}n=n/t/255,r=o>0?r/o/255:0,i=s>0?i/s/255:0,a=c>0?a/c/255:0,e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.audioTexture),e.texImage2D(e.TEXTURE_2D,0,e.LUMINANCE,t,1,0,e.LUMINANCE,e.UNSIGNED_BYTE,this.frequencyBuffer)}e.uniform1f(this.uniforms.time,t),e.uniform2f(this.uniforms.resolution,this.canvas.width,this.canvas.height),e.uniform1f(this.uniforms.volume,n),e.uniform1f(this.uniforms.bass,r),e.uniform1f(this.uniforms.mid,i),e.uniform1f(this.uniforms.treble,a),e.uniform1i(this.uniforms.audioTexture,0),e.drawArrays(e.TRIANGLE_STRIP,0,4)}cleanupProgram(){this.gl&&this.program&&(this.gl.deleteProgram(this.program),this.program=null)}destroy(){this.stop();let e=this.gl;e&&(this.cleanupProgram(),this.vertexBuffer&&(e.deleteBuffer(this.vertexBuffer),this.vertexBuffer=null),this.audioTexture&&(e.deleteTexture(this.audioTexture),this.audioTexture=null)),this.canvas=null,this.gl=null,this.analyser=null}},Ge=[{id:`kaleidosync`,name:`Kaleidosync`,fragmentShader:`
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
    `}],Ke={id:`no-signal`,name:`No Signal`,fragmentShader:`
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
  `},qe=E(`<div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 animate-pulse svelte-1o4jdf5"><div class="bg-black/75 border border-red-500/30 px-3 py-1.5 rounded text-[10px] font-mono tracking-widest text-red-500 font-bold uppercase shadow-[0_0_15px_rgba(239,68,68,0.25)] select-none svelte-1o4jdf5">NO SIGNAL</div></div>`),Je=E(`<div class="visualizer-container cursor-pointer svelte-1o4jdf5"><canvas class="visualizer-canvas svelte-1o4jdf5"></canvas> <!> <div class="visualizer-hover-overlay svelte-1o4jdf5"><!></div></div>`),Ye=E(`<div class="visualizer-container bg-[#050508]/40 border border-white/5 flex items-center justify-center svelte-1o4jdf5"><!></div>`),Xe=E(`<div class="vinyl-record-clicker cursor-pointer w-full h-full svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div><div class="groove g1 svelte-1o4jdf5"></div> <div class="groove g2 svelte-1o4jdf5"></div> <div class="groove g3 svelte-1o4jdf5"></div> <div class="groove g4 svelte-1o4jdf5"></div> <div class="record-label svelte-1o4jdf5"><img loading="lazy"/></div> <div class="spindle svelte-1o4jdf5"></div></div> <div></div></div>`),Ze=E(`<div class="spin-ring svelte-1o4jdf5"></div>`),Qe=E(`<div class="volume-popover svelte-1o4jdf5"><button class="ctrl ctrl-xs mr-2 border border-white/10 rounded-full p-1 hover:bg-white/10 svelte-1o4jdf5" aria-label="Mute"><!></button> <input type="range" class="vol-slider-pop svelte-1o4jdf5" min="0" max="1" step="0.01" aria-label="Volume"/> <span class="text-[10px] font-bold text-white/60 min-w-[28px] text-right font-mono select-none svelte-1o4jdf5"> </span></div>`),$e=E(`<div class="eq svelte-1o4jdf5"><div class="eq-b svelte-1o4jdf5"></div> <div class="eq-b svelte-1o4jdf5"></div> <div class="eq-b svelte-1o4jdf5"></div></div>`),et=E(`<span class="svelte-1o4jdf5"></span>`),tt=E(`<span class="text-amber-400 flex items-center gap-1 text-[9px] font-bold tracking-wider uppercase bg-amber-500/10 px-1.5 py-0.5 rounded flex-shrink-0 svelte-1o4jdf5" title="Failed to fetch music source from remote database"><!> Error Fetching</span>`),nt=E(`<span class="inst-chip-link svelte-1o4jdf5"><a target="_blank" class="svelte-1o4jdf5">i</a></span>`),rt=E(`<div><div class="tr-num svelte-1o4jdf5"><!></div> <img loading="lazy" class="tr-art svelte-1o4jdf5"/> <div class="tr-info svelte-1o4jdf5"><div class="flex items-center gap-1.5 min-w-0 svelte-1o4jdf5"><span> </span> <!></div> <span class="tr-meta svelte-1o4jdf5"> </span></div> <div class="flex items-center gap-2 flex-shrink-0 svelte-1o4jdf5"><!>  <button class="tr-share-btn svelte-1o4jdf5" title="Copy track link" aria-label="Share track"><!></button></div></div>`),it=E(`<div class="songs-layout svelte-1o4jdf5"><div><div><div class="vinyl-wrapper relative svelte-1o4jdf5"><!></div> <div class="track-info mt-2 svelte-1o4jdf5"><div class="flex items-center justify-center mb-1.5 svelte-1o4jdf5"><button class="player-share-btn svelte-1o4jdf5" title="Copy track link" aria-label="Share track"><!></button></div> <div><h2> </h2></div> <div><p> </p></div> <div><p> </p></div></div></div> <div class="player-controls-block svelte-1o4jdf5"><div class="progress-row svelte-1o4jdf5"><span class="ptime svelte-1o4jdf5"> </span> <div class="progress-wrap svelte-1o4jdf5"><div class="progress-fill svelte-1o4jdf5"></div> <input type="range" class="seek-input svelte-1o4jdf5" min="0" step="0.1" aria-label="Seek"/></div> <span class="ptime svelte-1o4jdf5"> </span></div> <div class="controls-row svelte-1o4jdf5"><button aria-label="Shuffle"><!></button> <button class="ctrl ctrl-md svelte-1o4jdf5" aria-label="Previous"><!></button> <button><!></button> <button class="ctrl ctrl-md svelte-1o4jdf5" aria-label="Next"><!></button> <button aria-label="Repeat"><!></button></div> <div class="w-full flex flex-col items-center gap-1.5 mt-2 px-1 svelte-1o4jdf5"><div><span><!> <span class="svelte-1o4jdf5">VOCAL</span></span> <div class="dj-fader-slot relative svelte-1o4jdf5"><div></div></div> <span><!> <span class="svelte-1o4jdf5">INST</span></span></div></div> <div class="relative flex justify-center items-center gap-3 mt-2 w-full svelte-1o4jdf5"><!> <div class="flex items-center gap-1.5 svelte-1o4jdf5"><button aria-label="Toggle Visualizer"><!></button> <button> </button></div> <div class="relative svelte-1o4jdf5"><button class="ctrl ctrl-xs vol-toggle-btn svelte-1o4jdf5" aria-label="Toggle volume slider"><!></button></div></div></div></div> <div><div class="mobile-close-bar hidden py-2 px-4 border-b border-white/5 flex items-center justify-between svelte-1o4jdf5"><span class="text-xs font-bold text-white/50 svelte-1o4jdf5">Track Library</span> <button class="px-3 py-1 bg-white/5 text-white/75 rounded-lg text-xs font-bold svelte-1o4jdf5">Back to player</button></div> <div class="tl-header flex justify-between items-center gap-3 svelte-1o4jdf5"><div class="flex items-center gap-2 svelte-1o4jdf5"><!><span class="svelte-1o4jdf5">TRACKS</span> <span class="tl-count svelte-1o4jdf5"> </span></div> <div class="flex items-center gap-1.5 ml-auto svelte-1o4jdf5"><span class="text-[9px] text-white/30 font-bold font-sans svelte-1o4jdf5">SORT BY:</span> <select class="bg-black/40 border border-white/10 rounded px-1.5 py-0.5 text-[10px] font-bold text-white/60 outline-none cursor-pointer hover:border-white/20 transition-all font-sans svelte-1o4jdf5"><option class="svelte-1o4jdf5">DEFAULT</option><option class="svelte-1o4jdf5">ARTIST</option><option class="svelte-1o4jdf5">ALBUM</option><option class="svelte-1o4jdf5">YEAR</option><option class="svelte-1o4jdf5">FILENAME</option><option class="svelte-1o4jdf5">GENRE</option><option class="svelte-1o4jdf5">SEASON</option></select></div></div> <div class="tracklist scroll-y svelte-1o4jdf5"></div></div></div>`),at=E(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><div class="sec-head svelte-1o4jdf5"><h2 class="sec-title svelte-1o4jdf5">Samples</h2> <p class="sec-sub svelte-1o4jdf5">MP3 · MP4 · WAV · OGG · YouTube · Instagram · TikTok</p></div> <div class="drop-zone svelte-1o4jdf5"><!> <p class="drop-title svelte-1o4jdf5">Drop files or paste a link</p> <p class="drop-sub svelte-1o4jdf5">Supports all major audio, video, and streaming links</p> <div class="link-row svelte-1o4jdf5"><input type="url" class="link-input svelte-1o4jdf5" placeholder="https://youtube.com/watch?v=..." aria-label="Paste link"/> <button class="add-btn svelte-1o4jdf5"><!>Add</button></div></div> <div class="empty-state svelte-1o4jdf5"><div class="wip-tape svelte-1o4jdf5">COMING SOON</div> <p class="svelte-1o4jdf5">Your samples will appear here once added.</p></div></div>`),ot=E(`<div class="svc-chip svelte-1o4jdf5"><span class="svelte-1o4jdf5"> </span><span class="svelte-1o4jdf5"> </span><!></div>`),st=E(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><div class="sec-head svelte-1o4jdf5"><h2 class="sec-title svelte-1o4jdf5">Playlists</h2> <p class="sec-sub svelte-1o4jdf5">Connect Spotify to sync playlists across all services
              automatically</p></div> <div class="spotify-card svelte-1o4jdf5"><div class="sp-icon svelte-1o4jdf5"><svg viewBox="0 0 24 24" fill="currentColor" width="30" height="30" class="svelte-1o4jdf5"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" class="svelte-1o4jdf5"></path></svg></div> <div class="sp-info svelte-1o4jdf5"><h3 class="svelte-1o4jdf5">Connect Spotify</h3> <p class="svelte-1o4jdf5">Import your playlists and sync across services</p></div> <button class="sp-btn svelte-1o4jdf5">Connect <!></button></div> <div class="svc-chips svelte-1o4jdf5"></div> <div class="empty-state mx-auto max-w-[380px] text-center svelte-1o4jdf5"><div class="wip-tape svelte-1o4jdf5">COMING SOON</div> <p class="svelte-1o4jdf5">Connect Spotify to see your playlists, automatically transcribed
              across all services.</p></div></div>`),ct=E(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><div class="sec-head svelte-1o4jdf5"><h2 class="sec-title svelte-1o4jdf5">Radio</h2> <p class="sec-sub svelte-1o4jdf5">Stream live broadcasts, dog shows, and podcast feeds</p></div> <div class="empty-state mx-auto max-w-[380px] text-center svelte-1o4jdf5"><div class="wip-tape svelte-1o4jdf5">COMING SOON</div> <p class="svelte-1o4jdf5">Live radio feeds will appear here once connected.</p></div></div>`),lt=E(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><!></div>`),ut=E(`<div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 animate-pulse svelte-1o4jdf5"><div class="bg-black/75 border border-red-500/30 px-4 py-2 rounded text-[12px] font-mono tracking-widest text-red-500 font-bold uppercase shadow-[0_0_20px_rgba(239,68,68,0.3)] select-none svelte-1o4jdf5">NO SIGNAL</div></div>`),dt=E(`<button> </button>`),ft=E(`<div class="visualizer-container fullscreen cursor-pointer svelte-1o4jdf5"><canvas class="visualizer-canvas svelte-1o4jdf5"></canvas> <!> <div class="visualizer-overlay svelte-1o4jdf5"><div class="flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-lg p-1 border border-white/10 svelte-1o4jdf5"></div></div></div>`),P=E(`<div class="mp-backdrop svelte-1o4jdf5"><div><header class="panel-header svelte-1o4jdf5"><div class="brand svelte-1o4jdf5"><button class="logo-btn svelte-1o4jdf5" aria-label="Open DOGS Info"><!></button> <h1 class="svelte-1o4jdf5"></h1></div> <button class="close-btn svelte-1o4jdf5" aria-label="Close panel"><!></button></header> <!> <div class="mp-body svelte-1o4jdf5"><!></div> <footer class="mp-footer svelte-1o4jdf5"><div class="mp-status svelte-1o4jdf5"><span class="mp-dot svelte-1o4jdf5"></span><span class="svelte-1o4jdf5">WE ARE DOGS</span></div> <span class="svelte-1o4jdf5">MUSIC</span></footer></div> <!> <canvas class="fader-fx-canvas pointer-events-none svelte-1o4jdf5"></canvas></div>`);function pt(oe,C){he(C,!0);let E=[{id:`songs`,label:`Songs`,icon:ce},{id:`samples`,label:`Samples`,icon:Be},{id:`playlists`,label:`Playlists`,icon:s},{id:`radio`,label:`Radio`,icon:i},{id:`battle`,label:`Battle`,icon:je}],pt=`/img/error_cover.png`;function mt(e){e.target.src.endsWith(pt)||(e.target.src=pt)}let ht=be(C,`isClosing`,3,!1),gt=be(C,`initialTrackId`,3,null),F=h(`songs`),I=h(`default`),L=h(!1),_t=h(!1),vt=h(!1),yt=h(null),R=h(!1),bt=h(0),xt=h(!1),St=h(null),z=null,B=!1,Ct=h(!1);y(()=>{N.isPlaying&&x(Ct,!0)});let wt=Me(()=>!N.isPlaying&&!g(Ct)?Ke.fragmentShader:Ge[g(bt)].fragmentShader);y(()=>{let e=N.analyser;return g(R)&&g(St)&&(z=new We(g(St),e),z.init(g(wt)),z.start()),()=>{z&&(z.destroy(),z=null)}}),y(()=>{let e=g(wt);z&&g(R)&&(z.setPreset(e),z.start())}),y(()=>{g(L)?!history.state?.tracklistOpen&&!B&&(history.pushState({tracklistOpen:!0},``),B=!0):B&&(history.back(),B=!1)}),Ie(()=>{B&&(history.back(),B=!1)});function Tt(e){!e.state?.tracklistOpen&&g(L)&&(x(L,!1),B=!1)}function Et(e){g(vt)&&g(yt)&&!g(yt).contains(e.target)&&!e.target.closest(`.vol-toggle-btn`)&&x(vt,!1)}let V=[{id:`hollywood`,title:`HOLLYWOOD`,artist:`YG`,album:`THE GENTLEMEN'S CLUB`,cover:`https://data.wearedogs.net/img/covers/2026/yg.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/yg.jpg`,src:`https://data.wearedogs.net/music/2026/HOLLYWOOD.mp3`,instrumental:`https://data.wearedogs.net/music/2026/HOLLYWOOD-free.mp3`,dateAdded:`2026-06-24T03:00:00-05:00`,year:2026,genre:`Hip-Hop`,attrib:`https://the-gentlemens-club.com/`},{id:`chicago`,title:`Chicago`,artist:`Michael Jackson`,album:`Xscape`,cover:`https://data.wearedogs.net/img/covers/2026/mj.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/mj.jpg`,src:`https://data.wearedogs.net/music/2026/Chicago.mp3`,instrumental:`https://data.wearedogs.net/music/2026/Chicago-free.mp3`,dateAdded:`2026-06-24T03:00:00-05:00`,year:2014,genre:`Pop`},{id:`rain`,title:`Pourin Rain (feat. Skratch Bastid)`,artist:`Zed's Dead`,album:`Return to the Return (of the Spectrum of Intergalactic Happiness)`,cover:`https://data.wearedogs.net/img/covers/2026/zd.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/zd.jpg`,src:`https://data.wearedogs.net/music/2026/Pourin.mp3`,instrumental:``,dateAdded:`2026-07-07T018:12:00-05:00`,year:2026,genre:`Electronic`,attrib:`https://shop.zedsdead.net/`},{id:`denchai`,title:`Den Chai`,artist:`The Buddha-Bar Lounge`,album:`Den Chai`,cover:`https://data.wearedogs.net/img/covers/2026/buddha.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/buddha.png`,src:`https://data.wearedogs.net/music/2026/DENCHAI.mp3`,instrumental:``,dateAdded:`2026-07-07T22:34:00-05:00`,year:2008,genre:`Lounge`,attrib:`https://open.spotify.com/artist/0du3MpnxBOpQEie1IV3u9v?si=2UO722ntTE--Ck_Ji7Go7Q`},{id:`rainbow`,title:`Rainbow in the Dark`,artist:`Das Racist`,album:`Shut Up, Dude`,cover:`https://data.wearedogs.net/img/covers/2026/rainbow.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/rainbow.png`,src:`https://data.wearedogs.net/music/2026/rainbow.mp3`,instrumental:`https://data.wearedogs.net/music/2026/rainbow-free.mp3`,dateAdded:`2026-07-08T16:35:00-05:00`,year:2010,genre:`Hip-Hop`,attrib:`https://dasracist.bandcamp.com/album/shut-up-dude`},{id:`hipsong`,title:`Hip Song`,artist:`Toby Fox / Trevor Alan Gomes`,album:`Deltarune`,cover:`https://data.wearedogs.net/img/covers/2026/deltarune.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/deltarune.png`,src:`https://data.wearedogs.net/music/2026/shop.mp3`,instrumental:`https://data.wearedogs.net/music/2026/shop-free.mp3`,dateAdded:`2026-07-09T01:22:00-05:00`,year:2021,genre:`Video Game`,attrib:`https://deltarune.com/`},{id:`sleepless`,title:`Sleepless`,artist:`deadmau5`,album:`> album title goes here <`,cover:`https://data.wearedogs.net/img/covers/2026/sleepless.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/sleepless.png`,src:``,instrumental:`https://data.wearedogs.net/music/2026/sleepless.mp3`,dateAdded:`2026-07-12T04:22:00-05:00`,year:2026,genre:`Electronic`,attrib:`https://deadmau5.com/`}];function Dt(e){return e.src?e.src.split(`/`).pop():``}function Ot(e){if(!e.dateAdded)return`Summer`;let t=new Date(e.dateAdded).getMonth();return t===11||t===0||t===1?`Winter`:t>=2&&t<=4?`Spring`:t>=5&&t<=7?`Summer`:`Fall`}let H=Me(()=>{let e=[...V];return g(I)===`artist`?e.sort((e,t)=>e.artist.localeCompare(t.artist)):g(I)===`album`?e.sort((e,t)=>e.album.localeCompare(t.album)):g(I)===`year`?e.sort((e,t)=>(e.year||0)-(t.year||0)):g(I)===`filename`?e.sort((e,t)=>Dt(e).localeCompare(Dt(t))):g(I)===`genre`?e.sort((e,t)=>(e.genre||``).localeCompare(t.genre||``)):g(I)===`season`&&e.sort((e,t)=>Ot(e).localeCompare(Ot(t))),e}),U=Me(()=>V[N.currentTrackIndex]),kt=h(0),At=h(0),jt=h(0),Mt=h(0),Nt=h(0),Pt=h(0),Ft=h(null),It=null;function Lt(e,t){e.stopPropagation();let n=`${window.location.origin}/music/${t.id}`;navigator.clipboard.writeText(n).then(()=>{x(Ft,t.id,!0),It&&clearTimeout(It),It=setTimeout(()=>{x(Ft,null)},2e3)}).catch(e=>{console.error(`Failed to copy share link:`,e)})}Ie(()=>{It&&clearTimeout(It)}),le(()=>{if(N.init(V),gt()){let e=V.findIndex(e=>e.id===gt());e!==-1&&N.loadTrack(e,!0)}else if(!N.hasPickedRandomTrack){N.hasPickedRandomTrack=!0;let e=Math.floor(Math.random()*V.length);N.loadTrack(e,!1)}});let W=h(null);function Rt(){let e=document.querySelector(`.track-row[data-track-id="${g(W)}"]`);e&&e.scrollIntoView({block:`nearest`,behavior:`smooth`})}function zt(e){x(W,e.id,!0);let t=V.findIndex(t=>t.id===e.id);N.currentTrackIndex===t&&!N.fetchErrors[e.id]?N.togglePlay():N.loadTrack(t,!0)}function Bt(){window.innerWidth<=640?x(L,!0):x(R,!g(R))}function Vt(){let t=!N.isInstrumental;N.setCrossfade(t)||(e(q),g(qt)||(x(qt,!0),setTimeout(()=>{x(qt,!1)},300)),g(q)===5?(tn(),x(Jt,!0),setTimeout(()=>{x(Jt,!1)},150)):g(q)===10?tn(35):g(q)>5&&g(q)<10?tn(8):g(q)>10&&Math.random()<.4&&tn(3))}function Ht(e){return!e||isNaN(e)?`0:00`:`${Math.floor(e/60)}:${Math.floor(e%60).toString().padStart(2,`0`)}`}function Ut(e){let t=document.activeElement;if(!(t&&(t.tagName===`INPUT`||t.tagName===`TEXTAREA`||t.isContentEditable))){if(e.shiftKey){if(e.key===`ArrowRight`){e.preventDefault(),x(F,E[(E.findIndex(e=>e.id===g(F))+1)%E.length].id,!0);return}else if(e.key===`ArrowLeft`){e.preventDefault(),x(F,E[(E.findIndex(e=>e.id===g(F))-1+E.length)%E.length].id,!0);return}}if(e.code===`Space`||e.key===` `)g(F)===`songs`&&(e.preventDefault(),N.togglePlay());else if(e.key===`ArrowDown`){if(g(F)===`songs`&&g(H).length>0){e.preventDefault();let t=g(H).findIndex(e=>e.id===g(W));if(t===-1){let e=V[N.currentTrackIndex];t=g(H).findIndex(t=>t.id===e?.id)}let n=(t+1)%g(H).length;x(W,g(H)[n].id,!0),Rt()}}else if(e.key===`ArrowUp`){if(g(F)===`songs`&&g(H).length>0){e.preventDefault();let t=g(H).findIndex(e=>e.id===g(W));if(t===-1){let e=V[N.currentTrackIndex];t=g(H).findIndex(t=>t.id===e?.id)}let n=(t-1+g(H).length)%g(H).length;x(W,g(H)[n].id,!0),Rt()}}else if(e.key===`Enter`&&g(F)===`songs`&&g(W)){e.preventDefault();let t=g(H).find(e=>e.id===g(W));t&&zt(t)}}}let G=0,Wt=0;function Gt(e){if(e.target&&(e.target.tagName===`INPUT`||e.target.closest(`button`)||e.target.closest(`.ctrl`))){G=0,Wt=0;return}G=e.touches[0].clientX,Wt=e.touches[0].clientY}function Kt(e){if(G===0||!e.changedTouches||e.changedTouches.length===0)return;let t=e.changedTouches[0].clientX-G,n=e.changedTouches[0].clientY-Wt;if(Math.abs(t)<=Math.abs(n)||Math.abs(t)<=60)return;let r=E.findIndex(e=>e.id===g(F));r!==-1&&(t<0&&r<E.length-1?x(F,E[r+1].id,!0):t>0&&r>0&&x(F,E[r-1].id,!0))}let K=h(null),q=h(0),qt=h(!1),Jt=h(!1),J,Y,X,Z=[],Q=[],Yt,Xt=h(!1);y(()=>(g(K)&&Qt(),()=>{Yt&&cancelAnimationFrame(Yt),window.removeEventListener(`resize`,$t),X&&(X.dispose(),X=null),J=null,Y=null,Z=[],Q=[]})),y(()=>{if(N.currentTrackIndex,g(F),ht(),x(q,0),x(Xt,!1),J){for(let e of Z)J.remove(e.mesh);for(let e of Q)J.remove(e.mesh)}Z=[],Q=[]});function Zt(){let e=document.querySelector(`.dj-fader-knob`);if(!e)return{x:window.innerWidth/2,y:window.innerHeight/2};let t=e.getBoundingClientRect();return{x:t.left+t.width*.15,y:window.innerHeight-(t.top+t.height*.85)}}function Qt(){if(!g(K))return;let e=window.innerWidth,t=window.innerHeight;g(K).width=e,g(K).height=t,J=new re,Y=new we(0,e,t,0,-1,1),X=new xe({canvas:g(K),alpha:!0,antialias:!0}),X.setSize(e,t,!1),X.setPixelRatio(Math.min(window.devicePixelRatio,2)),window.addEventListener(`resize`,$t),$()}function $t(){if(!g(K)||!X||!Y)return;let e=window.innerWidth,t=window.innerHeight;g(K).width=e,g(K).height=t,X.setSize(e,t,!1),Y.right=e,Y.top=t,Y.updateProjectionMatrix()}function $(){if(Yt=requestAnimationFrame($),!(!J||!Y||!X||!g(K))){if(g(q)>=10&&(x(Xt,!0),Math.random()<.22)){let e=Zt();en(e.x,e.y)}for(let e=Z.length-1;e>=0;e--){let t=Z[e];t.x+=t.vx,t.y+=t.vy,t.vy+=t.ay,t.life-=t.decay,t.mesh.position.set(t.x,t.y,0),t.mesh.material.opacity=t.life,t.life<=0&&(J.remove(t.mesh),t.mesh.geometry.dispose(),t.mesh.material.dispose(),Z.splice(e,1))}for(let e=Q.length-1;e>=0;e--){let t=Q[e];t.x+=t.vx,t.y+=t.vy,t.life-=t.decay;let n=t.startScale+(1-t.life)*88;t.mesh.scale.set(n,n,1),t.mesh.position.set(t.x,t.y,0),t.mesh.material.opacity=t.life*.16,t.life<=0&&(J.remove(t.mesh),t.mesh.geometry.dispose(),t.mesh.material.dispose(),Q.splice(e,1))}X.render(J,Y)}}function en(e,t){if(!J)return;let n=new me(5,8),r=.85+Math.random()*.12,i=new v(n,new c({color:new Fe(r,r,r*1.01),transparent:!0,opacity:.06,blending:1}));i.position.set(e,t,0),J.add(i),Q.push({mesh:i,x:e,y:t,vx:(Math.random()-.5)*.55+Math.sin(Date.now()*.001)*.22,vy:Math.random()*.7+1.25,startScale:1,life:1,decay:6e-4+Math.random()*4e-4})}function tn(e=25){if(!J||!g(K))return;let t=Zt(),n=t.x,r=t.y;for(let t=0;t<e;t++){let e=new v(new me(1.3,4),new c({color:new Fe(Math.random()<.4?16711765:16755200),transparent:!0,opacity:1,blending:2}));e.position.set(n,r,0),J.add(e);let t=Math.random()*Math.PI*2,i=Math.random()*4+2;Z.push({mesh:e,x:n,y:r,vx:Math.cos(t)*i,vy:Math.sin(t)*i,ay:-.15,life:1,decay:.02+Math.random()*.02})}}var nn=P();te(`keydown`,p,Ut),te(`popstate`,p,Tt),te(`click`,p,Et);var rn=j(nn);let an;var on=j(rn),sn=j(on),cn=j(sn);He(j(cn),{size:`panel`}),M(cn);var ln=b(cn,2);ln.textContent=`MUSIC`,M(sn);var un=b(sn,2);Ae(j(un),{size:20}),M(un),M(on);var dn=b(on,2);Ue(dn,{get tabs(){return E},get activeTab(){return g(F)},set activeTab(e){x(F,e,!0)}});var fn=b(dn,2),pn=j(fn),mn=e=>{var t=it(),i=j(t);let a;var s=j(i);let c;var f=j(s),p=j(f),re=e=>{var t=Je(),n=j(t);Ne(n,e=>x(St,e),()=>g(St));var r=b(n,2),i=e=>{D(e,qe())};_(r,e=>{!N.isPlaying&&!g(Ct)&&e(i)});var a=b(r,2);ue(j(a),{size:16,class:`text-white/70`}),M(a),M(t),u(`click`,t,()=>{x(xt,!0)}),D(e,t)},ae=e=>{var t=Ye();ue(j(t),{size:16,class:`text-white/20`}),M(t),D(e,t)},oe=e=>{var t=Xe(),n=j(t);let r;var i=b(j(n),8),a=j(i);let o;M(i),O(2),M(n);var s=b(n,2);let c;M(t),d(()=>{r=A(n,1,`vinyl-record svelte-1o4jdf5`,null,r,{spinning:N.isPlaying}),k(a,`src`,N.fetchErrors[g(U).id]||!g(U).cover?pt:g(U).cover),k(a,`alt`,g(U).album),o=A(a,1,`record-art svelte-1o4jdf5`,null,o,{loaded:g(_t)}),c=A(s,1,`tonearm svelte-1o4jdf5`,null,c,{playing:N.isPlaying})}),u(`click`,t,Bt),te(`load`,a,()=>x(_t,!0)),te(`error`,a,mt),ne(a),D(e,t)};_(p,e=>{g(R)&&!g(xt)?e(re):g(R)&&g(xt)?e(ae,1):e(oe,-1)}),M(f);var h=b(f,2),ce=j(h),v=j(ce),le=j(v),y=e=>{ee(e,{size:12,class:`text-[#22c55e]`})},me=e=>{Ce(e,{size:12})};_(le,e=>{g(Ft)===g(U).id?e(y):e(me,-1)}),M(v),M(ce);var S=b(ce,2);let he;var C=j(S);let be;var xe=j(C,!0);M(C),M(S);var T=b(S,2);let E;var we=j(T);let Te;var Ae=j(we,!0);M(we),M(T);var je=b(T,2);let Me;var Fe=j(je);let Ie;var Re=j(Fe,!0);M(Fe),M(je),M(h),M(s);var Ve=b(s,2),He=j(Ve),Ue=j(He),We=j(Ue,!0);M(Ue);var Ke=b(Ue,2),at=j(Ke),ot=b(at,2);ge(ot),M(Ke);var st=b(Ke,2),ct=j(st,!0);M(st),M(He);var lt=b(He,2),ut=j(lt);let dt;ye(j(ut),{size:15}),M(ut);var ft=b(ut,2);Pe(j(ft),{size:19}),M(ft);var P=b(ft,2);let ht;var gt=j(P),F=e=>{pe(e,{size:22})},z=e=>{D(e,Ze())},B=e=>{ie(e,{size:22,fill:`currentColor`})},wt=e=>{n(e,{size:22,fill:`currentColor`})};_(gt,e=>{N.fetchErrors[g(U).id]?e(F):N.isLoading?e(z,1):N.isPlaying?e(B,2):e(wt,-1)}),M(P);var Tt=b(P,2);De(j(Tt),{size:19}),M(Tt);var Et=b(Tt,2);let Dt;var Ot=j(Et),It=e=>{Le(e,{size:15})},Rt=e=>{o(e,{size:15})};_(Ot,e=>{N.repeatMode===2?e(It):e(Rt,-1)}),M(Et),M(lt);var Ut=b(lt,2),G=j(Ut);let Wt;var Gt=j(G);let Kt;Be(j(Gt),{size:12}),O(2),M(Gt);var K=b(Gt,2),J=j(K);let Y;M(K);var X=b(K,2);let Z;ke(j(X),{size:12}),O(2),M(X),M(G),M(Ut);var Q=b(Ut,2),Yt=j(Q),Xt=e=>{var t=Qe(),n=j(t),i=j(n),a=e=>{r(e,{size:12,class:`text-red-400`})},o=e=>{de(e,{size:12})};_(i,e=>{N.isMuted||N.volume===0?e(a):e(o,-1)}),M(n);var s=b(n,2);ge(s);var c=b(s,2),l=j(c);M(c),M(t),Ne(t,e=>x(yt,e),()=>g(yt)),d(e=>{ve(s,N.volume),m(l,`${e??``}%`)},[()=>Math.round(N.volume*100)]),u(`click`,n,()=>N.toggleMute()),u(`input`,s,e=>N.setVolume(parseFloat(e.target.value))),D(e,t)};_(Yt,e=>{g(vt)&&e(Xt)});var Zt=b(Yt,2),Qt=j(Zt);let $t;se(j(Qt),{size:13}),M(Qt);var $=b(Qt,2),en=j($,!0);M($),M(Zt);var tn=b(Zt,2),nn=j(tn),rn=j(nn),an=e=>{r(e,{size:13,class:`text-red-400`})},on=e=>{de(e,{size:13})};_(rn,e=>{N.isMuted||N.volume===0?e(an):e(on,-1)}),M(nn),M(tn),M(Q),M(Ve),M(i);var sn=b(i,2);let cn;var ln=j(sn),un=b(j(ln),2);M(ln);var dn=b(ln,2),fn=j(dn),pn=j(fn);fe(pn,{size:13});var mn=b(pn,3),hn=j(mn,!0);M(mn),M(fn);var gn=b(fn,2),_n=b(j(gn),2),vn=j(_n);vn.value=vn.__value=`default`;var yn=b(vn);yn.value=yn.__value=`artist`;var bn=b(yn);bn.value=bn.__value=`album`;var xn=b(bn);xn.value=xn.__value=`year`;var Sn=b(xn);Sn.value=Sn.__value=`filename`;var Cn=b(Sn);Cn.value=Cn.__value=`genre`;var wn=b(Cn);wn.value=wn.__value=`season`,M(_n),M(gn),M(dn);var Tn=b(dn,2);ze(Tn,21,()=>g(H),_e,(e,t,n)=>{var r=rt();let i;var a=j(r),o=j(a),s=e=>{D(e,$e())},c=e=>{var t=et();t.textContent=n+1,D(e,t)};_(o,e=>{V[N.currentTrackIndex].id===g(t).id&&N.isPlaying?e(s):e(c,-1)}),M(a);var l=b(a,2),f=b(l,2),p=j(f),re=j(p);let ie;var ae=j(re,!0);M(re);var oe=b(re,2),h=e=>{var t=tt();pe(j(t),{size:10}),O(),M(t),D(e,t)};_(oe,e=>{N.fetchErrors[g(t).id]&&e(h)}),M(p);var se=b(p,2),ce=j(se);M(se),M(f);var v=b(f,2),le=j(v),y=e=>{var n=nt(),r=j(n);M(n),d(()=>k(r,`href`,g(t).attrib)),u(`click`,r,e=>e.stopPropagation()),D(e,n)};_(le,e=>{g(t).attrib&&e(y)});var ue=b(le,2),de=j(ue),fe=e=>{ee(e,{size:12,class:`text-[#22c55e]`})},x=e=>{Ce(e,{size:12})};_(de,e=>{g(Ft)===g(t).id?e(fe):e(x,-1)}),M(ue),M(v),M(r),d(()=>{i=A(r,1,`track-row svelte-1o4jdf5`,null,i,{active:V[N.currentTrackIndex].id===g(t).id,"kb-focused":g(W)===g(t).id,"fetch-error":N.fetchErrors[g(t).id]}),k(r,`data-track-id`,g(t).id),k(l,`src`,N.fetchErrors[g(t).id]||!g(t).cover?pt:g(t).cover),k(l,`alt`,g(t).album),ie=A(re,1,`tr-title svelte-1o4jdf5`,null,ie,{"line-through":N.fetchErrors[g(t).id],"opacity-50":N.fetchErrors[g(t).id]}),m(ae,g(t).title),m(ce,`${g(t).artist??``} · ${g(t).album??``} (${(g(t).year||``)??``})`)}),u(`click`,r,()=>zt(g(t))),te(`error`,l,mt),ne(l),u(`click`,ue,e=>Lt(e,g(t))),D(e,r)}),M(Tn),M(sn),M(t),d((e,t)=>{a=A(i,1,`player-side svelte-1o4jdf5`,null,a,{"tracklist-open":g(L)}),c=A(s,1,`player-top-block transition-all duration-300 ease-in-out svelte-1o4jdf5`,null,c,{"opacity-0":g(L),"scale-95":g(L),"pointer-events-none":g(L)}),he=A(S,1,`scroll-container svelte-1o4jdf5`,null,he,{overflowing:g(At)>g(kt)}),Se(S,`--scroll-dist: -${g(At)-g(kt)}px`),be=A(C,1,`track-title scroll-text svelte-1o4jdf5`,null,be,{"animate-scroll":g(At)>g(kt)}),m(xe,g(U).title),E=A(T,1,`scroll-container svelte-1o4jdf5`,null,E,{overflowing:g(Mt)>g(jt)}),Se(T,`--scroll-dist: -${g(Mt)-g(jt)}px`),Te=A(we,1,`track-artist scroll-text svelte-1o4jdf5`,null,Te,{"animate-scroll":g(Mt)>g(jt)}),m(Ae,g(U).artist),Me=A(je,1,`scroll-container svelte-1o4jdf5`,null,Me,{overflowing:g(Pt)>g(Nt)}),Se(je,`--scroll-dist: -${g(Pt)-g(Nt)}px`),Ie=A(Fe,1,`track-album scroll-text svelte-1o4jdf5`,null,Ie,{"animate-scroll":g(Pt)>g(Nt)}),m(Re,g(U).album),m(We,e),Se(at,`width:${N.duration>0?N.currentTime/N.duration*100:0}%`),k(ot,`max`,N.duration||100),ve(ot,N.currentTime),m(ct,t),dt=A(ut,1,`ctrl ctrl-sm svelte-1o4jdf5`,null,dt,{"active-ctrl":N.isShuffled}),ht=A(P,1,`ctrl ctrl-play svelte-1o4jdf5`,null,ht,{"ctrl-error":N.fetchErrors[g(U).id]}),k(P,`aria-label`,N.isPlaying?`Pause`:`Play`),Dt=A(Et,1,`ctrl ctrl-sm svelte-1o4jdf5`,null,Dt,{"active-ctrl":N.repeatMode>0}),Wt=A(G,1,`dj-crossfader svelte-1o4jdf5`,null,Wt,{"fader-flash":g(Jt),"fader-fried":g(q)>=10}),Kt=A(Gt,1,`fader-label left-label flex items-center gap-1 svelte-1o4jdf5`,null,Kt,{active:!N.isInstrumental}),Y=A(J,1,`dj-fader-knob svelte-1o4jdf5`,null,Y,{right:N.isInstrumental,"knob-jiggle":g(qt),fried:g(q)>=10}),Z=A(X,1,`fader-label right-label flex items-center gap-1 svelte-1o4jdf5`,null,Z,{active:N.isInstrumental}),$t=A(Qt,1,`ctrl ctrl-xs svelte-1o4jdf5`,null,$t,{"active-ctrl":g(R)}),A($,1,`w-[90px] h-[20px] flex items-center justify-center rounded text-[9px] font-bold transition-all font-mono uppercase tracking-wider select-none cursor-pointer
                      ${g(R)?`bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/25 active:scale-95`:`bg-transparent border border-white/5 text-white/20 hover:text-white/40 hover:border-white/10`}`,`svelte-1o4jdf5`),k($,`title`,g(R)?`Click to cycle presets`:`Click to enable visualizer`),m(en,Ge[g(bt)].name),cn=A(sn,1,`tracklist-side svelte-1o4jdf5`,null,cn,{"show-mobile":g(L)}),m(hn,V.length)},[()=>Ht(N.currentTime),()=>Ht(N.duration)]),u(`click`,v,e=>Lt(e,g(U))),Oe(C,`clientWidth`,e=>x(At,e)),Oe(S,`clientWidth`,e=>x(kt,e)),Oe(we,`clientWidth`,e=>x(Mt,e)),Oe(T,`clientWidth`,e=>x(jt,e)),Oe(Fe,`clientWidth`,e=>x(Pt,e)),Oe(je,`clientWidth`,e=>x(Nt,e)),u(`input`,ot,e=>{N.currentTime=parseFloat(e.target.value)}),u(`change`,ot,e=>{N.play(parseFloat(e.target.value))}),u(`click`,ut,()=>N.isShuffled=!N.isShuffled),u(`click`,ft,()=>N.prevTrack()),u(`click`,P,()=>N.togglePlay()),u(`click`,Tt,()=>N.nextTrack()),u(`click`,Et,()=>{N.repeatMode=(N.repeatMode+1)%3}),u(`click`,G,Vt),u(`click`,Qt,()=>{x(R,!g(R))}),u(`click`,$,()=>{g(R)?x(bt,(g(bt)+1)%Ge.length):x(R,!0)}),u(`click`,nn,()=>{x(vt,!g(vt))}),u(`click`,un,()=>{x(L,!1)}),Ee(_n,()=>g(I),e=>x(I,e)),w(1,t,()=>l,()=>({duration:120,delay:120})),w(2,t,()=>l,()=>({duration:120})),D(e,t)},hn=e=>{var t=at(),n=b(j(t),2),r=j(n);Be(r,{size:36});var i=b(r,6),a=b(j(i),2);Te(j(a),{size:15}),O(),M(a),M(i),M(n),O(2),M(t),w(1,t,()=>l,()=>({duration:120,delay:120})),w(2,t,()=>l,()=>({duration:120})),D(e,t)},gn=e=>{var t=st(),n=b(j(t),2),r=b(j(n),4);ae(b(j(r)),{size:15}),M(r),M(n);var i=b(n,2);ze(i,20,()=>[{name:`Apple Music`,color:`#fc3c44`,icon:`🎵`},{name:`YouTube Music`,color:`#ff0000`,icon:`▶`},{name:`Amazon Music`,color:`#00a8e0`,icon:`♪`},{name:`Tidal`,color:`#00d4f5`,icon:`〰`}],_e,(e,t)=>{var n=ot(),r=j(n),i=j(r,!0);M(r);var a=b(r),o=j(a,!0);M(a),Re(b(a),{size:11}),M(n),d(()=>{Se(n,`--sc:${t.color??``}`),m(i,t.icon),m(o,t.name)}),D(e,n)}),M(i),O(2),M(t),w(1,t,()=>l,()=>({duration:120,delay:120})),w(2,t,()=>l,()=>({duration:120})),D(e,t)},_n=e=>{var t=ct();w(1,t,()=>l,()=>({duration:120,delay:120})),w(2,t,()=>l,()=>({duration:120})),D(e,t)},vn=e=>{var n=lt();a(j(n),()=>Ve(()=>import(`./BattlePanel-D_asRlkz.js`),__vite__mapDeps([0,1,2,3,4])),null,(e,n)=>{var r=t();S(f(r),()=>g(n).default,(e,t)=>{t(e,{get audioCore(){return N}})}),D(e,r)}),M(n),w(1,n,()=>l,()=>({duration:120,delay:120})),w(2,n,()=>l,()=>({duration:120})),D(e,n)};_(pn,e=>{g(F)===`songs`?e(mn):g(F)===`samples`?e(hn,1):g(F)===`playlists`?e(gn,2):g(F)===`radio`?e(_n,3):g(F)===`battle`&&e(vn,4)}),M(fn),O(2),M(rn);var yn=b(rn,2),bn=e=>{var t=ft(),n=j(t);Ne(n,e=>x(St,e),()=>g(St));var r=b(n,2),i=e=>{D(e,ut())};_(r,e=>{!N.isPlaying&&!g(Ct)&&e(i)});var a=b(r,2),o=j(a);ze(o,21,()=>Ge,_e,(e,t,n)=>{var r=dt(),i=j(r,!0);M(r),d(()=>{A(r,1,`px-2 py-1 rounded text-[9px] font-bold transition-all uppercase tracking-wider font-mono
                ${g(bt)===n?`bg-purple-600 text-white`:`text-white/40 hover:text-white/80`}`,`svelte-1o4jdf5`),m(i,g(t).name)}),u(`click`,r,()=>x(bt,n,!0)),D(e,r)}),M(o),M(a),M(t),u(`click`,t,e=>{e.stopPropagation(),x(xt,!1)}),u(`click`,a,e=>e.stopPropagation()),D(e,t)};_(yn,e=>{g(R)&&g(xt)&&e(bn)}),Ne(b(yn,2),e=>x(K,e),()=>g(K)),M(nn),d(()=>an=A(rn,1,`mp-container svelte-1o4jdf5`,null,an,{closing:ht(),"theme-inst":N.isInstrumental})),u(`click`,nn,function(...e){C.onClose?.apply(this,e)}),u(`click`,rn,e=>e.stopPropagation()),u(`click`,cn,()=>{N.isPlaying||window.dispatchEvent(new CustomEvent(`open-info-panel`))}),u(`click`,un,function(...e){C.onClose?.apply(this,e)}),u(`touchstart`,fn,Gt,void 0,!0),u(`touchend`,fn,Kt),D(oe,nn),T()}oe([`click`,`touchstart`,`touchend`,`input`,`change`]);export{pt as default};