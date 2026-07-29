const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/BattlePanel-BGKN6PBQ.js","assets/vendor-Ckc42K-4.js","assets/rolldown-runtime-CMxvf4Kt.js","assets/vendor-Dl9nCA7L.css","assets/BattlePanel-B1S5D9Lq.css"])))=>i.map(i=>d[i]);
import{$r as e,A as t,Bn as n,Br as r,Bt as i,C as a,Cn as o,Ct as s,Di as c,Ei as l,Fr as u,Gr as d,Gt as f,Ir as p,Jt as m,Kr as h,Kt as ee,L as g,Ln as te,Mr as _,Nr as ne,Oi as v,Or as y,P as re,Pr as ie,Q as ae,Qn as oe,Qr as se,Rr as b,S as ce,Ti as le,Tr as ue,Tt as de,U as x,Ur as S,Ut as fe,Wr as C,Xr as w,Y as pe,Yr as me,Z as he,Zr as ge,_i as T,ai as E,an as _e,bi as D,br as ve,di as ye,dn as be,er as xe,fi as O,g as Se,gi as k,gr as Ce,gt as we,hr as Te,ir as Ee,j as De,ki as A,kr as j,kt as Oe,li as ke,oi as M,pr as Ae,tn as je,ui as N,ur as Me,ut as Ne,vi as Pe,wr as Fe,wt as Ie,xr as P,zr as Le,zt as Re}from"./vendor-Ckc42K-4.js";import{t as ze}from"./index-BrZ_1F2I.js";import{t as F}from"./AudioCore.svelte-Cmh40rPX.js";import{t as Be}from"./DogsLogo-DYnc2HuI.js";import{t as Ve}from"./settingsManager.svelte-Dw9c1kGG.js";import{t as He}from"./SwipeTabNav-CmcgxuXM.js";var Ue=class{constructor(e,t){A(this,`canvas`,null),A(this,`gl`,null),A(this,`analyser`,null),A(this,`program`,null),A(this,`animationFrameId`,null),A(this,`startTime`,0),A(this,`vertexBuffer`,null),A(this,`audioTexture`,null),A(this,`uniforms`,{}),A(this,`frequencyBuffer`,null),this.canvas=e,this.analyser=t,this.frequencyBuffer=new Uint8Array(t?t.frequencyBinCount:128),this.gl=e.getContext(`webgl`)||e.getContext(`experimental-webgl`),this.gl||console.error(`WebGL not supported by this browser.`)}init(e){if(!this.gl)return;let t=this.gl;this.cleanupProgram();let n=this.compileShader(t.VERTEX_SHADER,`
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
  `},Ke=`I understand the creator of this sick beat Nxnja has a copyright notice on his music distribution website.\r
\r
https://nxnjaa.beatstars.com/music\r
\r
While this track in particular is not on that website, his terms of sevice is here\r
\r
\r
\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\r
Website Terms of Use\r
https://nxnjaa.beatstars.com Terms & Conditions\r
\r
\r
Effective date: July 8, 2024\r
\r
\r
\r
https://nxnjaa.beatstars.com ("Website", "us", "we", or "our") operates the https://nxnjaa.beatstars.com and other related websites (the "Service").\r
\r
\r
\r
Set forth below are the Terms and Conditions governing the Service (the “Terms and Conditions”), which may expand or change from time to time. As used herein, the term "you" or "your" or “user” refers to an individual, representing yourself or, if applicable, acting as legal representative for a group, business entity or corporation.\r
\r
\r
\r
CAREFULLY READ THESE TERMS AND CONDITIONS. BY AVAILING YOURSELF OF THE WEBSITE OR RELATED SERVICES, YOU ARE CONSENTING TO BE BOUND BY THESE TERMS AND CONDITIONS AS SUCH TERMS MAY BE MODIFIED FROM TIME TO TIME AS DESCRIBED BELOW.\r
\r
\r
\r
Use of Materials Found on the Website: The information, artwork, text, video, audio, pictures, software and other intellectual property (collectively, "Materials") contained on the Website are protected by copyright and international laws. You may only access and use the Materials for personal or educational purposes or as expressly provided for in these Terms and Conditions. You may not otherwise reproduce, distribute, publicly perform, publicly display, modify or create derivative works of the Materials, unless authorized by the appropriate copyright owner(s). In the event that you print Materials found on the Website, you must include any copyright notice originally included with the Materials on all copies. You may not link directly to any media file located on the Website Server, except where explicitly allowed to do so. You should not attempt to claim any Materials as your own work. Any computer software downloadable or otherwise available on the Website is provided subject to the terms of the applicable license agreement. Before using any of our logos, please contact us at nightvibes.records@gmail.com\r
\r
\r
\r
\r
Copyright and Trademark Infringement Policy and Notification Procedure: BeatStars Inc. (“BeatStars”) does not own the musical compositions, sound recordings, art or other written or visual images (collectively, the "Content") posted by us to the Website. All Content is posted by us and we have represented and warranted to BeatStars that, among other things, neither the Content nor the names, trademarks and service marks under which Content is promoted (collectively, the "Name") infringes any third party's copyright, patent, trademark, trade secret or other proprietary rights, rights of publicity or privacy, or moral rights (see the section titled 'Representations and Warranties' of the current BeatStars Terms of Service here. Buyers are subject to clear any samples on any composition purchased.\r
\r
\r
\r
\r
Since BeatStars is not in a position to determine who has the prevailing claim to use any particular Content or Name posted to the Website, its policy on such matters is that they be resolved directly by the parties alleging misuse of their Content and/or Name (the "Complainants'') and us. Immediately notify us about allegations of infringement by clicking the Contact link and contacting us directly.\r
\r
\r
\r
\r
Complainants may notify us concerning any Content and/or Name being used on the Website in violation of their rights by sending an email to nightvibes.records@gmail.com. We shall use information provided by Complainants in accordance with our then-current Privacy Policy and as reasonably necessary to address any allegations contained therein. In most cases, soon after receiving written notice alleging infringement, we will either remove the allegedly infringing Content and/or Name from those web pages identified or, at our election, remove those web pages entirely.\r
\r
\r
\r
\r
Refund policy: We do not offer refunds. If there are any issues with a premium service or an ordered item please contact nightvibes.records@gmail.com immediately, we aim to solve any issue amicably. Premium services (recurring billings) can be canceled anytime for any reason. Cancellations by the individual, group or company that signed up for the premium service (collectively, the "Subscriber") will be effective after the paid period. In case of cancellation by the Subscriber the period that is already paid for will not be reimbursed. The premium service will then remain active until the end of the paid period. We reserve the right to cancel premium services for any reason at any time without notification. If we cancel a premium service before its expiration date, the Subscriber might be entitled to a pro-rated refund of the last payment. No refund will be given if a user violates the Terms and Conditions of the Website or any relevant License Agreement.\r
\r
\r
\r
\r
Premium service can be canceled by emailing nightvibes.records@gmail.com with cancellation request and artist name or order ID. Cancellation will be confirmed by email.\r
\r
\r
\r
\r
Your Conduct: You shall use the Website for lawful purposes only. You shall not post or transmit via the Website any material which violates or infringes in any way upon the rights of others, which is unlawful, threatening, abusive, defamatory, invasive of privacy or publicity rights, vulgar, obscene, profane or otherwise objectionable, which encourages conduct that would constitute a criminal offense, give rise to civil liability or otherwise violate any law, or which, without our express prior approval, contains advertising or any solicitation with respect to products or services.\r
\r
\r
\r
\r
In addition, if we feel that a user abuses the Website site in any way, we reserve the right to share certain information with third parties in accordance with our then-current Privacy Policy. Abuses include (but are not limited to) possible copyright infringement, possible libel and slander, possible credit card fraud. We reserve the right to refuse service, terminate accounts, and/or cancel orders at its sole discretion and without notification.\r
\r
\r
\r
\r
Content: The Website offers a wide selection and variety of content to our members and users. Content may contain profanity or otherwise inappropriate or offensive material for children or other members and/or users. Members and/or users must evaluate and bear the risk associated with the use of the Website and related services. We suggest that parents should supervise their children’s on-line activities and consider using parental control tools available to help provide an appropriate on-line environment for their children. Users are also encouraged to contact us for evaluation of possible offensive material. We Reserve the right to act on such notices at our sole discretion.\r
\r
\r
\r
\r
Warranty Disclaimer. YOU EXPRESSLY AGREE THAT USE OF THE WEBSITE AND RELATED SERVICES IS AT YOUR SOLE RISK. THE WEBSITE, MATERIALS AND RELATED SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. WE NOR BEATSTARS MAKES ANY REPRESENTATIONS OR WARRANTIES WITH REGARD TO THE WEBSITE OR ANY MATERIALS THEREIN, WHETHER EXPRESS OR IMPLIED, ARISING BY LAW OR OTHERWISE, INCLUDING, WITHOUT LIMITATION, ANY IMPLIED WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE OR NON-INFRINGEMENT OR ANY IMPLIED WARRANTY ARISING OUT OF COURSE OF PERFORMANCE, COURSE OF DEALING OR USAGE OF TRADE. IN ADDITION, WE NOR BEATSTARS MAKE ANY REPRESENTATIONS THAT THE OPERATION OF THE WEBSITE WILL BE UNINTERRUPTED OR ERROR-FREE. WE NOR BEATSTARS WILL BE LIABLE FOR THE CONSEQUENCES OF ANY INTERRUPTIONS OR ERRORS ON THE WEBSITE. IT IS YOUR RESPONSIBILITY TO EVALUATE THE ACCURACY, COMPLETENESS OR USEFULNESS OF ANY OPINION, ADVICE, INFORMATION OR OTHER CONTENT OR MATERIALS PROVIDED IN CONNECTION WITH OR OTHERWISE AVAILABLE THROUGH THE WEBSITE. PLEASE SEEK THE ADVICE OF PROFESSIONALS, AS APPROPRIATE, REGARDING THE EVALUATION OF ANY SUCH OPINION, ADVICE, INFORMATION OR OTHER CONTENT. UNDER NO CIRCUMSTANCE WILL BEATSTARS BE LIABLE FOR ANY LOSS OR DAMAGE CAUSED BY YOUR RELIANCE ON INFORMATION OBTAINED THROUGH THE WEBSITE, OTHER THAN AS REQUIRED UNDER APPLICABLE CONSUMER-PROTECTION LAW. SOME JURISDICTIONS DO NOT ALLOW THE DISCLAIMER OF CERTAIN WARRANTIES OR LIMITATION OF CERTAIN TYPES OF DAMAGES, SO SOME OF THE ABOVE DISCLAIMER MAY NOT APPLY TO YOU AND NOTHING CONTAINED HEREIN SHOULD BE CONSTRUED AS EXCLUDING OR LIMITING ANY LIABILITY BEYOND WHAT IS PERMITTED UNDER APPLICABLE LAW.\r
\r
\r
\r
\r
Limitation of Liability. By availing yourself of the Website, Materials or related services, you agree to release and hold us, BeatStars and the employees, officers, directors, shareholders, agents, representatives affiliates, subsidiaries, advertising, promotion and fulfillment agencies, any entity controlling, controlled by or under common control with BeatStars, any third-party providers or sources of information or data and legal advisers (collectively, "BeatStars Affiliates") harmless from any and all losses, damages, rights, claims and actions of any kind arising from or related to the Website, Materials or related services including but not limited to: (a) telephone, electronic, hardware or software, network, Internet or computer malfunctions, failures or difficulties of any kind; (b) failed, incomplete, garbled or delayed computer transmissions; (c) any condition caused by events beyond the control of BeatStars that may cause the Website or related services to be disrupted or corrupted; (d) any injuries, losses or damages of any kind arising in connection with or as a result of your use of the Website, Materials or related services; or (e) any printing or typographical errors in any materials associated with the Website, Materials or related services. In addition, you agree to defend, indemnify and hold us and BeatStars Affiliates harmless from any claim, suit or demand, including reasonable attorney's fees, made by a third party due to or arising out of your utilizing the Website, Materials or related services, your violation or breach of these Terms and Conditions, your violation of any rights of a third party, or any other act or omission by you. IN NO EVENT WILL WE OR BEATSTARS BE LIABLE FOR ANY INDIRECT, STATUTORY, INCIDENTAL, SPECIAL OR CONSEQUENTIAL DAMAGES OR ANY LOSS OF REVENUE ARISING OUT OF YOUR AVAILMENT OF MATERIALS (HOWEVER ARISING, INCLUDING NEGLIGENCE), EVEN IF WE OR BEATSTARS WAS ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.\r
\r
\r
\r
\r
General Provisions: You agree to comply with all applicable laws regarding the transmission of technical data exported from the United States or the country in which you reside. Your correspondence or business dealings with, or participation in promotions of or with parties found on or through the Website, including payment and delivery of related goods or services, and any other terms, conditions, warranties or representations applicable to such dealings, are solely between you and such parties. These Terms and Conditions are governed in all respects by the laws of the Tours, Indre et Loire, FR as such laws are applied to agreements entered into and to be performed entirely within Tours, Indre et Loire, FR residents. Legal proceedings related to the matters herein shall be brought in and adjudicated solely in the courts of Tours, Indre et Loire, FR. Both parties consent to extraterritorial service of process and submit to the jurisdiction of said courts. If any provision of these Terms and Conditions is held to be invalid or unenforceable, such provision shall be struck and the remaining provisions shall be enforced. Our Failure to act with respect to a breach by you or others does not waive our right to act with respect to subsequent or similar breaches. These Terms and Conditions set forth the entire understanding and agreement of the parties as to the subject matter hereof and supersede all prior proposals, discussions or agreements with respect thereto. A printed version of these Terms and Conditions and of any notice given in electronic form shall be admissible in judicial or administrative proceedings based upon or relating to these Terms and Conditions to the same extent and subject to the same conditions as other business documents and records originally generated and maintained in printed form.\r
\r
\r
\r
\r
YouTube\r
\r
\r
\r
\r
By accessing and/or using the Website, You agree to YouTube's Terms of Service.\r
\r
\r
\r
\r
Age requirements for use of the Service: This Service is available for individuals aged 13 years or older. If you are 13 or older but under the age of 18, you should review these Terms and Conditions with your parent or guardian to make sure that you and your parent or guardian understand these Terms and Conditions.\r
\r
\r
\r
\r
Modification of Terms and Conditions: From time to time we may modify these Terms and Conditions in our sole discretion. When such modification is made, we will post a revised version of these Terms and Conditions on the Website. Modifications will be effective when they are posted. We are not required to provide you with notification that any such modification has been made. It is your responsibility to review these Terms and Conditions from time to time to be aware of any such modifications. Each time you log on to the Website, you will be deemed to have accepted any such modifications.\r
\r
\r
\r
https://nxnjaa.beatstars.com Privacy Policy\r
\r
\r
\r
Effective date: May 1, 2024\r
\r
\r
\r
\r
https://nxnjaa.beatstars.com ("Website", "us", "we", or "our") are committed to protecting your privacy online. We are also committed to providing you with the very best experience we can on our website (the “Website”). In order to enhance your experience on our Website we gather certain personal information about you that helps us customize our content to your tastes and preferences. Please read the following Privacy Policy to understand how your personal information will be treated as you make full use of our Website.\r
\r
\r
\r
\r
We operate the Website and other related websites and applications (the "Service").\r
\r
\r
\r
\r
This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.\r
\r
\r
\r
\r
We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy. Unless otherwise defined in this Privacy Policy, terms used in this Privacy Policy have the same meanings as in our Terms and Conditions.\r
\r
\r
\r
Definitions\r
\r
\r
Personal Data\r
\r
\r
\r
Personal Data means data about a living individual who can be identified from those data (or from those and other information either in our possession or likely to come into our possession).\r
\r
\r
\r
Usage Data\r
\r
\r
\r
Usage Data is data collected automatically either generated by the use of the Service or from the Service infrastructure itself (for example, the duration of a page visit).\r
\r
\r
\r
Cookies\r
\r
\r
\r
Cookies are small pieces of data stored on a User's device.\r
\r
\r
\r
Data Controller\r
\r
\r
\r
Data Controller means a person who (either alone or jointly or in common with other persons) determines the purposes for which and the manner in which any personal data are, or are to be, processed.\r
\r
\r
\r
\r
For the purpose of this Privacy Policy, we are a Data Controller of your data.\r
\r
\r
\r
Data Processor (or Service Providers)\r
\r
\r
\r
Data Processor (or Service Provider) means any person (other than an employee of the Data Controller) who processes the data on behalf of the Data Controller.\r
\r
\r
\r
\r
We may use the services of various Service Providers in order to process your data more effectively.\r
\r
\r
\r
Data Subject\r
\r
\r
\r
Data Subject is any living individual who is the subject of Personal Data.\r
\r
\r
\r
User\r
\r
\r
\r
The User is the individual using our Service. The User corresponds to the Data Subject, who is the subject of Personal Data.\r
\r
\r
\r
Information Collection and Use\r
\r
\r
\r
We collect several different types of information for various purposes to provide and improve our Service to you.\r
\r
\r
\r
Types of Data Collected\r
\r
\r
Personal Data\r
\r
\r
\r
While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:\r
\r
\r
\r
\r
Email address\r
\r
First name and last name\r
\r
Phone number\r
\r
Address, State, Province, ZIP/Postal code, City\r
\r
Cookies and Usage Data\r
\r
\r
\r
\r
We may use your Personal Data to contact you with newsletters, marketing or promotional materials and other information that may be of interest to you. You may opt out of receiving any, or all, of these communications from us by following the unsubscribe link or instructions provided in any email we send or by contacting us.\r
\r
\r
\r
Usage Data\r
\r
\r
\r
We may also collect information that your browser sends whenever you visit our Service or when you access the Service by or through a mobile device ("Usage Data").\r
\r
\r
\r
\r
This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.\r
\r
\r
\r
\r
When you access the Service by or through a mobile device, this Usage Data may include information such as the type of mobile device you use, your mobile device unique ID, the IP address of your mobile device, your mobile operating system, the type of mobile Internet browser you use, unique device identifiers and other diagnostic data.\r
\r
\r
\r
Location Data\r
\r
\r
\r
We may use and store information about your location if you give us permission to do so ("Location Data"). We use this data to provide features of our Service, to improve and customize our Service.\r
\r
\r
\r
\r
You can enable or disable location services when you use our Service at any time, through your device settings.\r
\r
\r
\r
Tracking Cookies Data\r
\r
\r
\r
We use cookies and similar tracking technologies to track the activity on our Service and hold certain information.\r
\r
\r
\r
\r
Cookies are files with small amount of data which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your device. Tracking technologies also used are beacons, tags, and scripts to collect and track information and to improve and analyze our Service.\r
\r
\r
\r
\r
You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.\r
\r
\r
\r
\r
Examples of Cookies we use:\r
\r
\r
\r
Session Cookies. We use Session Cookies to operate our Service.\r
\r
Preference Cookies. We use Preference Cookies to remember your preferences and various settings.\r
\r
Security Cookies. We use Security Cookies for security purposes.\r
\r
\r
\r
Use of Data\r
\r
\r
\r
Our primary goal in collecting personal information is to provide you, the user, with a customized experience on our Website. We use the collected data for various purposes including:\r
\r
\r
\r
\r
To provide and maintain our Service\r
\r
To notify you about changes to our Service or updates to our Website\r
\r
To allow you to participate in interactive features of our Service when you choose to do so\r
\r
To provide customer support\r
\r
To gather analysis or valuable information so that we can improve our Service\r
\r
To monitor the usage of our Service, estimate the size of our audience and measure certain traffic patterns\r
\r
To detect, prevent and address technical issues\r
\r
To provide you with news, special offers and general information about other goods, services and events which we offer that are similar to those that you have already purchased or enquired about unless you have opted not to receive such information\r
\r
To provide such capabilities as personalization services, interactive communications, online shopping, and personalized communication between you and the artists you prefer.\r
\r
To track the progress and number of entries in our promotions and contests\r
\r
To track visits to and business conducted at our online store\r
\r
To contact you on behalf of certain artists, other third parties, deliver targeted advertisements that may be of interest to you and information regarding special events regarding the Website and BeatStars.\r
\r
\r
\r
\r
In addition, if we feel that a user abuses the Website In any way, we reserve the right to share certain information with third parties. Abuses include (but are not limited to) possible copyright infringement, possible libel and slander, possible credit card fraud.\r
\r
\r
\r
Sharing of Data\r
\r
\r
\r
We do not sell, rent, or trade your personal information with others. However, when one or more of our business partners co-sponsor a service, promotion and/or contest, we may share some or all of the information collected in connection with such service, promotion or contest with the co-sponsor(s). If you do not want your information to be shared, you will be able to choose not to allow the transfer by not using or signing up for that particular service, promotion or contest.\r
\r
\r
\r
\r
In addition, when you make a purchase through our online store, or sign up to receive promotional items from us, we may share some of your personal information with third parties helping us to complete your transaction or send you the items you signed up to receive. When we share your information with such third parties, we will work to ensure that only the information necessary to complete your transaction is disclosed. This Privacy Policy does not apply to such third parties.\r
\r
\r
\r
Social Media\r
\r
\r
\r
If you share our content through social media, for example by liking us on Facebook, following or tweeting about us on Twitter, or giving us a '+1' via Google Plus, those social networks will record that you have done so and may set a cookie for this purpose.\r
\r
\r
\r
\r
In some cases, where a page on our Website includes content from a social network, such as a Twitter feed, or Facebook comments box, those services may set a cookie even where you do not click a button. As is the case for all cookies, we cannot access those set by social networks, just as those social networks cannot access cookies we set ourselves.\r
\r
\r
\r
Third Party Platform Advertising\r
\r
\r
\r
We may share your information with third party platform providers (such as Facebook, Google, Twitter and Datacrushers) to serve targeted advertising/content to you via the relevant third-party platform based on your profile/interests. Your information is used by the third-party platform provider to identify your account and serve advertisements to you.\r
\r
\r
\r
\r
Facebook Conversion Tracking Pixel\r
\r
\r
\r
\r
Our Website utilizes the Conversion Tracking Pixel service of Facebook. This tool allows us to follow the actions of users after they are redirected to a provider's Website by clicking on a Facebook advertisement. We are thus able to record the efficiency of Facebook advertisements for statistical and market research purposes. The collected data remain anonymous and we cannot see the personal data of any individual user, however the collected data is saved and processed by Facebook. Facebook is able to connect this data with your Facebook account and the data is used for their own advertising purposes in accordance with their policy found under: https://www.facebook.com/about/privacy. Please click here if you would like to revoke your permission: https://www.facebook.com/ads/website\\_custom\\_audiences/.\r
\r
\r
\r
Datacrushers\r
\r
\r
\r
\r
Datacrushers is a revenue discovery platform and global leader in site-wide revenue, shopping cart abandonment recovery, and acceleration. Shopping cart data and email addresses are shared with us that have opted in for the Service. We are bound by their terms and conditions located at: https://www.datacrushers.com/terms-and-conditions.\r
\r
\r
\r
\r
YouTube\r
\r
\r
\r
\r
You acknowledge and agree that this Website uses YouTube API Services. By accessing and/or using the Website, You agree to YouTube's Terms of Service and the YouTube Privacy Policy.\r
\r
\r
\r
Retention of Data\r
\r
\r
\r
We will retain your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your Personal Data to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.\r
\r
\r
\r
\r
We will also retain Usage Data for internal analysis purposes. Usage Data is generally retained for a shorter period of time, except when this data is used to strengthen the security or to improve the functionality of our Service, or we are legally obligated to retain this data for longer time periods.\r
\r
\r
\r
Transfer of Data\r
\r
\r
\r
Your information, including Personal Data, may be transferred to \\- and maintained on \\- computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ than those from your jurisdiction.\r
\r
\r
\r
\r
If you are located outside United States and choose to provide information to us, please note that we transfer the data, including Personal Data, to United States and process it there.\r
\r
\r
\r
\r
Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer.\r
\r
\r
\r
\r
We will take all steps reasonably necessary to ensure that your data is treated securely and in accordance with this Privacy Policy and no transfer of your Personal Data will take place to an organization or a country unless there are adequate controls in place including the security of your data and other personal information.\r
\r
\r
\r
Disclosure of Data\r
\r
\r
Business Transaction\r
\r
\r
\r
If we are involved in a merger, acquisition or asset sale, your Personal Data may be transferred. We will provide notice before your Personal Data is transferred and becomes subject to a different Privacy Policy.\r
\r
\r
\r
Disclosure for Law Enforcement\r
\r
\r
\r
Under certain circumstances, we and/or BeatStars. may be required to disclose your Personal Data if required to do so by law or in response to valid requests by public authorities (e.g. a court or a government agency).\r
\r
\r
\r
Legal Requirements\r
\r
\r
\r
We may disclose your Personal Data in the good faith belief that such action is necessary to:\r
\r
\r
\r
\r
To comply with a legal obligation\r
\r
To comply with a legal obligation\r
\r
To protect and defend the rights or property\r
\r
To prevent or investigate possible wrongdoing in connection with the Service\r
\r
To protect the personal safety of users of the Service or the public\r
\r
To protect against legal liability\r
\r
\r
\r
Security of Data\r
\r
\r
\r
The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.\r
\r
\r
\r
"Do Not Track" Signals\r
\r
\r
\r
We do not support Do Not Track ("DNT"). Do Not Track is a preference you can set in your web browser to inform websites that you do not want to be tracked.\r
\r
\r
\r
\r
You can enable or disable Do Not Track by visiting the Preferences or Settings page of your web browser.\r
\r
\r
\r
Your Rights\r
\r
\r
\r
We aim to take reasonable steps to allow you to correct, amend, delete, or limit the use of your Personal Data.\r
\r
\r
\r
\r
Whenever made possible, you can update your Personal Data directly within your account settings section. If you are unable to change your Personal Data, please contact us to make the required changes.\r
\r
\r
\r
\r
If you wish to be informed what Personal Data we hold about you and if you want it to be removed from our systems, please contact us at nightvibes.records@gmail.com with your specific request.\r
\r
\r
\r
\r
In certain circumstances, you have the right:\r
\r
\r
\r
\r
To access and receive a copy of the Personal Data we hold about you\r
\r
To rectify any Personal Data held about you that is inaccurate\r
\r
To request the deletion of Personal Data held about you\r
\r
\r
\r
\r
You have the right to data portability for the information you provide to us . You can request to obtain a copy of your Personal Data in a commonly used electronic format so that you can manage and move it.\r
\r
\r
\r
\r
Please note that we may ask you to verify your identity before responding to such requests.\r
\r
\r
\r
Service Providers\r
\r
\r
\r
We may employ third party companies and individuals to facilitate our Service ("Service Providers"), to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used.\r
\r
\r
\r
\r
These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.\r
\r
\r
\r
Analytics\r
\r
\r
\r
We may use third-party Service Providers to monitor and analyze the use of our Service.\r
\r
\r
\r
Google Analytics\r
\r
\r
\r
\r
Google Analytics is a web analytics service offered by Google that tracks and reports website traffic. Google uses the data collected to track and monitor the use of our Service. This data is shared with other Google services. Google may use the collected data to contextualize and personalize the ads of its own advertising network.\r
\r
\r
\r
\r
For more information on the privacy practices of Google, please visit the Google Privacy Terms web page: http://www.google.com/intl/en/policies/privacy/\r
\r
\r
\r
Payments\r
\r
\r
\r
We may provide paid products and/or services within the Service. In that case, we use third-party services for payment processing (e.g. payment processors).\r
\r
\r
\r
\r
We will not store or collect your payment card details. That information is provided directly to our third-party payment processors whose use of your personal information is governed by their Privacy Policy. These payment processors adhere to the standards set by PCI-DSS as managed by the PCI Security Standards Council, which is a joint effort of brands like Visa, Mastercard, American Express and Discover. PCI-DSS requirements help ensure the secure handling of payment information.\r
\r
\r
\r
\r
The payment processors we work with are:\r
\r
\r
\r
\r
PayPal or Braintree\r
\r
\r
\r
\r
Their Privacy Policy can be viewed at https://www.paypal.com/webapps/mpp/ua/privacy-full\r
\r
\r
\r
\r
Stripe\r
\r
\r
\r
\r
Their Privacy Policy can be viewed at https://stripe.com/us/privacy\r
\r
\r
\r
Links to Other Websites\r
\r
\r
\r
Our Service may contain links to other websites that are not operated by us. If you click on a third-party link, you will be directed to that third party's website. We strongly advise you to review the Privacy Policy of every site you visit.\r
\r
\r
\r
\r
We have no control over and assume no responsibility for the content, privacy policies or practices of any third-party websites or services.\r
\r
\r
\r
Children's Privacy\r
\r
\r
\r
Our Service does not address anyone under the age of 18 ("Children").\r
\r
\r
\r
\r
We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or guardian and you are aware that your Children has provided us with Personal Data, please contact us at nightvibes.records@gmail.com. If we become aware that we have collected Personal Data from children without verification of parental consent, we will take steps to remove that information from our servers.\r
\r
\r
\r
Changes to This Privacy Policy\r
\r
\r
\r
We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.\r
\r
\r
\r
\r
We will let you know via email and/or a prominent notice on our Service, prior to the change becoming effective and update the "effective date" at the top of this Privacy Policy.\r
\r
\r
\r
\r
You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.\r
\r
\r
\r
Contact Us\r
\r
\r
\r
If you have any questions about this Privacy Policy, please contact us:\r
\r
\r
\r
\r
By email: nightvibes.records@gmail.com\r
\r
\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\r
\r
Now I didn't get this beat over on that website, I got it off a youtube ripper website whom's terms of service is this:\r
\r
By choosing to download, you acknowledge that the audio or video content you are accessing is for personal and non-commercial use only. You agree not to distribute, copy, modify or otherwise use the downloaded content for any commercial purpose, including but not limited to resale, public performance or broadcast. Any use of the content beyond the scope of these terms may result in a violation of applicable copyright law and the Terms of Service. We assume no liability for any unauthorized or improper use of the content, and the user assumes full responsibility for complying with all relevant laws and contractual obligations.\r
\r
There ain't nothing commercial about my music yet. so we're just holding it hostage here. send us an email if you don't like that and i'll take it down.\r
`,qe=h(`<div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 animate-pulse svelte-1o4jdf5"><div class="bg-black/75 border border-red-500/30 px-3 py-1.5 rounded text-[10px] font-mono tracking-widest text-red-500 font-bold uppercase shadow-[0_0_15px_rgba(239,68,68,0.25)] select-none svelte-1o4jdf5">NO SIGNAL</div></div>`),Je=h(`<div class="visualizer-container cursor-pointer svelte-1o4jdf5"><canvas class="visualizer-canvas svelte-1o4jdf5"></canvas> <!> <div class="visualizer-hover-overlay svelte-1o4jdf5"><!></div></div>`),Ye=h(`<div class="visualizer-container bg-[#050508]/40 border border-white/5 flex items-center justify-center svelte-1o4jdf5"><!></div>`),Xe=h(`<div class="vinyl-record-clicker cursor-pointer w-full h-full svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div><div class="groove g1 svelte-1o4jdf5"></div> <div class="groove g2 svelte-1o4jdf5"></div> <div class="groove g3 svelte-1o4jdf5"></div> <div class="groove g4 svelte-1o4jdf5"></div> <div class="record-label svelte-1o4jdf5"><img loading="lazy"/></div> <div class="spindle svelte-1o4jdf5"></div></div> <div></div></div>`),Ze=h(`<div class="cassette-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="cassette-tape svelte-1o4jdf5"><div class="cassette-label bg-gradient-to-r from-purple-800 to-pink-700 svelte-1o4jdf5"><span class="cassette-track-title svelte-1o4jdf5"> </span> <span class="cassette-brand svelte-1o4jdf5">WEAREDOGS AUDIO</span></div> <div class="cassette-window bg-zinc-950/80 svelte-1o4jdf5"><div></div> <div></div> <div></div> <div></div></div></div></div>`),Qe=h(`<div class="floppy-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="floppy-disk svelte-1o4jdf5"><div class="floppy-corner svelte-1o4jdf5"></div> <div class="floppy-write-protect svelte-1o4jdf5"></div> <div class="floppy-label bg-slate-100 text-slate-900 svelte-1o4jdf5"><div class="floppy-label-stripe bg-red-600 svelte-1o4jdf5"></div> <div class="floppy-label-stripe-blue bg-blue-600 svelte-1o4jdf5"></div> <div class="floppy-label-content svelte-1o4jdf5"><div class="floppy-song truncate font-mono svelte-1o4jdf5"> </div> <div class="floppy-artist truncate font-mono svelte-1o4jdf5"> </div></div></div> <div class="floppy-shutter-door bg-zinc-700 svelte-1o4jdf5"><div></div> <div class="floppy-shutter-opening bg-zinc-950 svelte-1o4jdf5"><div></div></div></div> <div></div></div></div>`),$e=h(`<div></div>`),et=h(`<div class="musicbox-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="music-box svelte-1o4jdf5"><div></div> <div class="music-box-interior border border-amber-900/40 svelte-1o4jdf5"><div class="music-box-gears svelte-1o4jdf5"><div></div> <div></div></div> <div class="music-box-drum-wrap svelte-1o4jdf5"><div><div class="music-box-pins svelte-1o4jdf5"><div class="pin pin-1 svelte-1o4jdf5"></div> <div class="pin pin-2 svelte-1o4jdf5"></div> <div class="pin pin-3 svelte-1o4jdf5"></div> <div class="pin pin-4 svelte-1o4jdf5"></div> <div class="pin pin-5 svelte-1o4jdf5"></div> <div class="pin pin-6 svelte-1o4jdf5"></div></div></div></div> <div class="music-box-comb svelte-1o4jdf5"></div></div></div></div>`),tt=h(`<span></span>`),nt=h(`<div class="spin-ring svelte-1o4jdf5"></div>`),rt=h(`<div class="volume-popover svelte-1o4jdf5"><button class="ctrl ctrl-xs mr-2 border border-white/10 rounded-full p-1 hover:bg-white/10 svelte-1o4jdf5" aria-label="Mute"><!></button> <input type="range" class="vol-slider-pop svelte-1o4jdf5" min="0" max="1" step="0.01" aria-label="Volume"/> <span class="text-[10px] font-bold text-white/60 min-w-[28px] text-right font-mono select-none svelte-1o4jdf5"> </span></div>`),it=h(`<div class="eq svelte-1o4jdf5"><div class="eq-b svelte-1o4jdf5"></div> <div class="eq-b svelte-1o4jdf5"></div> <div class="eq-b svelte-1o4jdf5"></div></div>`),at=h(`<span class="svelte-1o4jdf5"></span>`),ot=h(`<span class="text-amber-400 flex items-center gap-1 text-[9px] font-bold tracking-wider uppercase bg-amber-500/10 px-1.5 py-0.5 rounded flex-shrink-0 svelte-1o4jdf5" title="Failed to fetch music source from remote database"><!> Error Fetching</span>`),st=h(`<button class="cursor-pointer svelte-1o4jdf5" style="background: none; border: none; padding: 0; color: inherit; font: inherit;">i</button>`),ct=h(`<a target="_blank" class="svelte-1o4jdf5">i</a>`),lt=h(`<span class="inst-chip-link svelte-1o4jdf5"><!></span>`),ut=h(`<div><div class="tr-num svelte-1o4jdf5"><!></div> <img loading="lazy" class="tr-art svelte-1o4jdf5"/> <div class="tr-info svelte-1o4jdf5"><div class="flex items-center gap-1.5 min-w-0 svelte-1o4jdf5"><span> </span> <!></div> <span class="tr-meta svelte-1o4jdf5"> </span></div> <div class="flex items-center gap-2 flex-shrink-0 svelte-1o4jdf5"><!>  <button class="tr-share-btn svelte-1o4jdf5" title="Copy track link" aria-label="Share track"><!></button></div></div>`),dt=h(`<div class="songs-layout svelte-1o4jdf5"><div><div><div class="vinyl-wrapper relative overflow-hidden svelte-1o4jdf5"><!></div> <div class="track-info mt-2 svelte-1o4jdf5"><div class="flex items-center justify-center mb-1.5 svelte-1o4jdf5"><button class="player-share-btn svelte-1o4jdf5" title="Copy track link" aria-label="Share track"><!></button></div> <div><h2> </h2></div> <div><p> </p></div> <div><p> </p></div></div></div> <div class="player-controls-block svelte-1o4jdf5"><div class="progress-row svelte-1o4jdf5"><span class="ptime svelte-1o4jdf5"> </span> <div class="progress-wrap waveform-slider-wrap relative h-9 flex items-end svelte-1o4jdf5"><div class="waveform-bars flex items-end justify-between absolute inset-0 pointer-events-none px-1 h-full svelte-1o4jdf5"></div> <input type="range" class="seek-input absolute inset-0 opacity-0 cursor-pointer w-full h-full svelte-1o4jdf5" min="0" step="0.1" aria-label="Seek"/></div> <span class="ptime svelte-1o4jdf5"> </span></div> <div class="controls-row svelte-1o4jdf5"><button aria-label="Shuffle"><!></button> <button class="ctrl ctrl-md svelte-1o4jdf5" aria-label="Previous"><!></button> <button><!></button> <button class="ctrl ctrl-md svelte-1o4jdf5" aria-label="Next"><!></button> <button aria-label="Repeat"><!></button></div> <div class="w-full flex flex-col items-center gap-1.5 mt-2 px-1 svelte-1o4jdf5"><div><span><!> <span class="svelte-1o4jdf5">VOCAL</span></span> <div class="dj-fader-slot relative svelte-1o4jdf5"><div></div></div> <span><!> <span class="svelte-1o4jdf5">INST</span></span></div></div> <div class="relative flex justify-center items-center gap-3 mt-2 w-full svelte-1o4jdf5"><!> <div class="flex items-center gap-1.5 svelte-1o4jdf5"><button aria-label="Toggle Visualizer"><!></button> <button> </button></div> <div class="relative svelte-1o4jdf5"><button class="ctrl ctrl-xs vol-toggle-btn svelte-1o4jdf5" aria-label="Toggle volume slider"><!></button></div></div></div></div> <div><div class="mobile-close-bar hidden py-2 px-4 border-b border-white/5 flex items-center justify-between svelte-1o4jdf5"><span class="text-xs font-bold text-white/50 svelte-1o4jdf5">Track Library</span> <button class="px-3 py-1 bg-white/5 text-white/75 rounded-lg text-xs font-bold svelte-1o4jdf5">Back to player</button></div> <div class="tl-header flex justify-between items-center gap-3 svelte-1o4jdf5"><div class="flex items-center gap-2 svelte-1o4jdf5"><!><span class="svelte-1o4jdf5">TRACKS</span> <span class="tl-count svelte-1o4jdf5"> </span></div> <div class="flex items-center gap-1.5 ml-auto svelte-1o4jdf5"><span class="text-[9px] text-white/30 font-bold font-sans svelte-1o4jdf5">SORT BY:</span> <select class="bg-black/40 border border-white/10 rounded px-1.5 py-0.5 text-[10px] font-bold text-white/60 outline-none cursor-pointer hover:border-white/20 transition-all font-sans svelte-1o4jdf5"><option class="svelte-1o4jdf5">DEFAULT</option><option class="svelte-1o4jdf5">ARTIST</option><option class="svelte-1o4jdf5">ALBUM</option><option class="svelte-1o4jdf5">YEAR</option><option class="svelte-1o4jdf5">FILENAME</option><option class="svelte-1o4jdf5">GENRE</option><option class="svelte-1o4jdf5">SEASON</option></select></div></div> <div class="tracklist scroll-y svelte-1o4jdf5"></div></div></div>`),ft=h(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><div class="sec-head svelte-1o4jdf5"><h2 class="sec-title svelte-1o4jdf5">Samples</h2> <p class="sec-sub svelte-1o4jdf5">MP3 · MP4 · WAV · OGG · YouTube · Instagram · TikTok</p></div> <div class="drop-zone svelte-1o4jdf5"><!> <p class="drop-title svelte-1o4jdf5">Drop files or paste a link</p> <p class="drop-sub svelte-1o4jdf5">Supports all major audio, video, and streaming links</p> <div class="link-row svelte-1o4jdf5"><input type="url" class="link-input svelte-1o4jdf5" placeholder="https://youtube.com/watch?v=..." aria-label="Paste link"/> <button class="add-btn svelte-1o4jdf5"><!>Add</button></div></div> <div class="empty-state svelte-1o4jdf5"><div class="wip-tape svelte-1o4jdf5">COMING SOON</div> <p class="svelte-1o4jdf5">Your samples will appear here once added.</p></div></div>`),pt=h(`<div class="svc-chip svelte-1o4jdf5"><span class="svelte-1o4jdf5"> </span><span class="svelte-1o4jdf5"> </span><!></div>`),mt=h(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><div class="sec-head svelte-1o4jdf5"><h2 class="sec-title svelte-1o4jdf5">Playlists</h2> <p class="sec-sub svelte-1o4jdf5">Connect Spotify to sync playlists across all services
              automatically</p></div> <div class="spotify-card svelte-1o4jdf5"><div class="sp-icon svelte-1o4jdf5"><svg viewBox="0 0 24 24" fill="currentColor" width="30" height="30" class="svelte-1o4jdf5"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" class="svelte-1o4jdf5"></path></svg></div> <div class="sp-info svelte-1o4jdf5"><h3 class="svelte-1o4jdf5">Connect Spotify</h3> <p class="svelte-1o4jdf5">Import your playlists and sync across services</p></div> <button class="sp-btn svelte-1o4jdf5">Connect <!></button></div> <div class="svc-chips svelte-1o4jdf5"></div> <div class="empty-state mx-auto max-w-[380px] text-center svelte-1o4jdf5"><div class="wip-tape svelte-1o4jdf5">COMING SOON</div> <p class="svelte-1o4jdf5">Connect Spotify to see your playlists, automatically transcribed
              across all services.</p></div></div>`),ht=h(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><div class="sec-head svelte-1o4jdf5"><h2 class="sec-title svelte-1o4jdf5">Radio</h2> <p class="sec-sub svelte-1o4jdf5">Stream live broadcasts, dog shows, and podcast feeds</p></div> <div class="empty-state mx-auto max-w-[380px] text-center svelte-1o4jdf5"><div class="wip-tape svelte-1o4jdf5">COMING SOON</div> <p class="svelte-1o4jdf5">Live radio feeds will appear here once connected.</p></div></div>`),gt=h(`<div class="app-loading-spinner svelte-1o4jdf5" aria-label="Loading..."></div>`),_t=h(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><!></div>`),vt=h(`<div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 animate-pulse svelte-1o4jdf5"><div class="bg-black/75 border border-red-500/30 px-4 py-2 rounded text-[12px] font-mono tracking-widest text-red-500 font-bold uppercase shadow-[0_0_20px_rgba(239,68,68,0.3)] select-none svelte-1o4jdf5">NO SIGNAL</div></div>`),yt=h(`<button> </button>`),bt=h(`<div class="visualizer-container fullscreen cursor-pointer svelte-1o4jdf5"><canvas class="visualizer-canvas svelte-1o4jdf5"></canvas> <!> <div class="visualizer-overlay svelte-1o4jdf5"><div class="flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-lg p-1 border border-white/10 svelte-1o4jdf5"></div></div></div>`),xt=h(`<div class="arigato-modal-backdrop svelte-1o4jdf5"><div class="arigato-modal-content svelte-1o4jdf5"><header class="arigato-modal-header svelte-1o4jdf5"><h2 class="svelte-1o4jdf5">ARIGATO INFO</h2> <button class="arigato-close-btn svelte-1o4jdf5"><!></button></header> <div class="arigato-modal-body scroll-y svelte-1o4jdf5"><div class="merch-link-container svelte-1o4jdf5"><a href="https://nxnjaa.beatstars.com/" target="_blank" rel="noopener noreferrer" class="merch-link-btn svelte-1o4jdf5"><!> NXNJA MERCH & MUSIC</a></div> <p class="intro-text svelte-1o4jdf5"></p> <div class="tos-box svelte-1o4jdf5"><div class="tos-microtext svelte-1o4jdf5"></div></div> <p class="outro-text svelte-1o4jdf5"></p></div></div></div>`),St=h(`<div class="mp-backdrop svelte-1o4jdf5"><div><header class="panel-header svelte-1o4jdf5"><div class="brand svelte-1o4jdf5"><button class="logo-btn svelte-1o4jdf5" aria-label="Open DOGS Info"><!></button> <h1 class="svelte-1o4jdf5"></h1></div> <button class="close-btn svelte-1o4jdf5" aria-label="Close panel"><!></button></header> <!> <div class="mp-body svelte-1o4jdf5"><!></div> <footer class="mp-footer svelte-1o4jdf5"><div class="mp-status svelte-1o4jdf5"><span class="mp-dot svelte-1o4jdf5"></span><span class="svelte-1o4jdf5">🐕</span></div> <span class="svelte-1o4jdf5">MUSIC</span></footer></div> <!> <canvas class="fader-fx-canvas pointer-events-none svelte-1o4jdf5"></canvas> <!></div>`);function Ct(h,me){l(me,!0);let A=[{id:`songs`,label:`Songs`,icon:n},{id:`samples`,label:`Samples`,icon:je},{id:`playlists`,label:`Playlists`,icon:fe},{id:`radio`,label:`Radio`,icon:Ee},{id:`battle`,label:`Battle`,icon:we}],Ct=`/img/error_cover.png`;function wt(e){e.target.src.endsWith(Ct)||(e.target.src=Ct)}let Tt=Ae(me,`isClosing`,3,!1),Et=Ae(me,`initialTrackId`,3,null),I=T(`songs`),L=T(`default`),Dt=T(null);M(()=>{e(I)===`battle`&&!e(Dt)&&ze(()=>import(`./BattlePanel-BGKN6PBQ.js`).then(e=>{k(Dt,e.default,!0)}),__vite__mapDeps([0,1,2,3,4]))});let R=T(!1),Ot=T(!1),kt=T(!1),At=T(null),z=D(()=>F.isPlaying&&!Tt()),B=T(!1),jt=T(0),Mt=T(!1),Nt=T(null),V=null,H=!1,Pt=T(!1),Ft=T(!1),It=D(()=>{let e=Ke.split(/`{5,}/);return{intro:e[0]||``,tos:e[1]||``,outro:e[2]||``}});function Lt(e){if(!e)return``;let t=e.replace(/(https?:\/\/[^\s]+)/g,`<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>`);return t=t.replace(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/g,`<a href="mailto:$1">$1</a>`),t.replace(/\n/g,`<br>`)}let Rt=D(()=>{let t=e(G);if(!t)return Array(60).fill(10);if(F.waveformPeaks[t.id])return F.waveformPeaks[t.id];let n=t.id,r=[],i=0;for(let e=0;e<n.length;e++)i=(i<<5)-i+n.charCodeAt(e),i|=0;let a=Math.abs(i)%1e3;for(let e=0;e<60;e++){let t=e/59,n=Math.sin(a+t*Math.PI*4),i=Math.cos(a*1.5+t*Math.PI*10)*.4,o=Math.sin(a*2.3+t*Math.PI*22)*.15,s=Math.abs(n+i+o)/1.55,c=Math.sin(t*Math.PI),l=(s*70+15)*c;r.push(Math.max(10,Math.round(l)))}return r});M(()=>{window.innerWidth<=640&&e(B)&&e(jt)===0&&e(R)&&k(R,!1)}),M(()=>{F.isPlaying&&k(Pt,!0)});let zt=D(()=>!F.isPlaying&&!e(Pt)?Ge.fragmentShader:We[e(jt)].fragmentShader);M(()=>{let t=F.analyser;return e(B)&&e(Nt)&&!Tt()&&(V=new Ue(e(Nt),t),V.init(e(zt)),V.start()),()=>{V&&(V.destroy(),V=null)}}),M(()=>{let t=e(zt);V&&e(B)&&(V.setPreset(t),V.start())}),M(()=>{e(R)?!history.state?.tracklistOpen&&!H&&(history.pushState({tracklistOpen:!0},``),H=!0):H&&(history.back(),H=!1)}),Le(()=>{H&&(history.back(),H=!1)});function Bt(t){!t.state?.tracklistOpen&&e(R)&&(k(R,!1),H=!1)}function Vt(t){e(kt)&&e(At)&&!e(At).contains(t.target)&&!t.target.closest(`.vol-toggle-btn`)&&k(kt,!1)}let U=[{id:`hollywood`,title:`HOLLYWOOD`,artist:`YG`,album:`THE GENTLEMEN'S CLUB`,cover:`https://data.wearedogs.net/img/covers/2026/yg.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/yg.jpg`,src:`https://data.wearedogs.net/music/2026/HOLLYWOOD.mp3`,instrumental:`https://data.wearedogs.net/music/2026/HOLLYWOOD-free.mp3`,dateAdded:`2026-06-24T03:00:00-05:00`,year:2026,genre:`Hip-Hop`,attrib:`https://the-gentlemens-club.com/`},{id:`chicago`,title:`Chicago`,artist:`Michael Jackson`,album:`Xscape`,cover:`https://data.wearedogs.net/img/covers/2026/mj.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/mj.jpg`,src:`https://data.wearedogs.net/music/2026/Chicago.mp3`,instrumental:`https://data.wearedogs.net/music/2026/Chicago-free.mp3`,dateAdded:`2026-06-24T03:00:00-05:00`,year:2014,genre:`Pop`},{id:`rain`,title:`Pourin Rain (ft. Skratch Bastid)`,artist:`Zeds Dead`,album:`Return to the Return (of the Spectrum of Intergalactic Happiness)`,cover:`https://data.wearedogs.net/img/covers/2026/zd.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/zd.jpg`,src:`https://data.wearedogs.net/music/2026/Pourin.mp3`,instrumental:``,dateAdded:`2026-07-07T018:12:00-05:00`,year:2026,genre:`Electronic`,attrib:`https://shop.zedsdead.net/`},{id:`denchai`,title:`Den Chai`,artist:`The Buddha-Bar Lounge`,album:`Den Chai`,cover:`https://data.wearedogs.net/img/covers/2026/buddha.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/buddha.png`,src:``,instrumental:`https://data.wearedogs.net/music/2026/DENCHAI.mp3`,dateAdded:`2026-07-07T22:34:00-05:00`,year:2008,genre:`Lounge`,attrib:`https://open.spotify.com/artist/0du3MpnxBOpQEie1IV3u9v?si=2UO722ntTE--Ck_Ji7Go7Q`},{id:`rainbow`,title:`Rainbow in the Dark`,artist:`Das Racist`,album:`Shut Up, Dude`,cover:`https://data.wearedogs.net/img/covers/2026/rainbow.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/rainbow.png`,src:`https://data.wearedogs.net/music/2026/rainbow.mp3`,instrumental:`https://data.wearedogs.net/music/2026/rainbow-free.mp3`,dateAdded:`2026-07-08T16:35:00-05:00`,year:2010,genre:`Hip-Hop`,attrib:`https://dasracist.bandcamp.com/album/shut-up-dude`},{id:`hipsong`,title:`Hip Song`,artist:`Toby Fox / Trevor Alan Gomes`,album:`Deltarune`,cover:`https://data.wearedogs.net/img/covers/2026/deltarune.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/deltarune.png`,src:`https://data.wearedogs.net/music/2026/shop.mp3`,instrumental:`https://data.wearedogs.net/music/2026/shop-free.mp3`,dateAdded:`2026-07-09T01:22:00-05:00`,year:2021,genre:`Video Game`,attrib:`https://deltarune.com/`},{id:`sleepless`,title:`Sleepless`,artist:`deadmau5`,album:`> album title goes here <`,cover:`https://data.wearedogs.net/img/covers/2026/sleepless.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/sleepless.png`,src:``,instrumental:`https://data.wearedogs.net/music/2026/sleepless.mp3`,dateAdded:`2026-07-12T04:22:00-05:00`,year:2026,genre:`Electronic`,attrib:`https://deadmau5.com/`},{id:`skitzo`,title:`Skitzo (ft. Young Thug)`,artist:`Travis Scott`,album:`UTOPIA`,cover:`https://data.wearedogs.net/img/covers/2026/utopia.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/utopia.png`,src:`https://data.wearedogs.net/music/2026/skitzo.mp3`,instrumental:`https://data.wearedogs.net/music/2026/skitzo-free.mp3`,dateAdded:`2026-07-16T01:56:00-05:00`,year:2023,genre:`Hip-Hop`,attrib:`https://shop.travisscott.com/`},{id:`slow`,title:`SLOW FT. DOGS`,artist:`Sweet Boy Sonnet`,album:`Where do I put my love?`,cover:`https://data.wearedogs.net/img/covers/2026/slow.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/slow.png`,src:`https://data.wearedogs.net/music/2026/SLOW-FT-DOGS.mp3`,instrumental:``,dateAdded:`2026-07-20T02:49:34-05:00`,year:2026,genre:`Electronic`,attrib:`https://sweetboysonnet.com/`},{id:`arigato`,title:`ARIGATO`,artist:`Nxnja`,album:`ARIGATO`,cover:`https://data.wearedogs.net/img/covers/2026/arigato.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/arigato.png`,src:``,instrumental:`https://data.wearedogs.net/music/2026/arigato.mp3`,dateAdded:`2026-07-23T00:39:56-05:00`,year:2026,genre:`Hip-Hop`,attrib:`https://nxnjaa.beatstars.com/`},{id:`exile`,title:`What's Beneath the Chicken Coop`,artist:`Trevor Sensor`,album:`On Account of Exile, Vol. 2`,cover:`https://data.wearedogs.net/img/covers/2026/exile.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/exile.png`,src:`https://data.wearedogs.net/music/2026/exile.mp3`,instrumental:``,dateAdded:`2026-07-23T00:52:43-05:00`,year:2021,genre:`Indie Rock`,attrib:`https://trevorsensorofficial.com/`}];function Ht(e){return e.src?e.src.split(`/`).pop():``}function Ut(e){if(!e.dateAdded)return`Summer`;let t=new Date(e.dateAdded).getMonth();return t===11||t===0||t===1?`Winter`:t>=2&&t<=4?`Spring`:t>=5&&t<=7?`Summer`:`Fall`}let W=D(()=>{let t=[...U];return e(L)===`artist`?t.sort((e,t)=>e.artist.localeCompare(t.artist)):e(L)===`album`?t.sort((e,t)=>e.album.localeCompare(t.album)):e(L)===`year`?t.sort((e,t)=>(e.year||0)-(t.year||0)):e(L)===`filename`?t.sort((e,t)=>Ht(e).localeCompare(Ht(t))):e(L)===`genre`?t.sort((e,t)=>(e.genre||``).localeCompare(t.genre||``)):e(L)===`season`&&t.sort((e,t)=>Ut(e).localeCompare(Ut(t))),t}),G=D(()=>U[F.currentTrackIndex]),Wt=T(0),Gt=T(0),Kt=T(0),qt=T(0),Jt=T(0),Yt=T(0),Xt=T(null),K=null;function Zt(e,t){e.stopPropagation();let n=`${window.location.origin}/music/${t.id}`;navigator.clipboard.writeText(n).then(()=>{k(Xt,t.id,!0),K&&clearTimeout(K),K=setTimeout(()=>{k(Xt,null)},2e3)}).catch(e=>{console.error(`Failed to copy share link:`,e)})}Le(()=>{K&&clearTimeout(K)}),r(()=>{if(F.init(U),Et()){let e=U.findIndex(e=>e.id===Et());e!==-1&&F.loadTrack(e,!0)}else if(!F.hasPickedRandomTrack){F.hasPickedRandomTrack=!0;let e=Math.floor(Math.random()*U.length);F.loadTrack(e,!1)}});let q=T(null);function Qt(){let t=document.querySelector(`.track-row[data-track-id="${e(q)}"]`);t&&t.scrollIntoView({block:`nearest`,behavior:`smooth`})}function $t(e){k(q,e.id,!0);let t=U.findIndex(t=>t.id===e.id);F.currentTrackIndex===t&&!F.fetchErrors[e.id]?F.togglePlay():F.loadTrack(t,!0)}function en(){window.innerWidth<=640?k(R,!0):k(B,!e(B))}function tn(){let t=!F.isInstrumental;F.setCrossfade(t)||(Pe(Y),e(ln)||(k(ln,!0),setTimeout(()=>{k(ln,!1)},300)),e(Y)===5?(yn(),k(un,!0),setTimeout(()=>{k(un,!1)},150)):e(Y)===10?yn(35):e(Y)>5&&e(Y)<10?yn(8):e(Y)>10&&Math.random()<.4&&yn(3))}function nn(e){return!e||isNaN(e)?`0:00`:`${Math.floor(e/60)}:${Math.floor(e%60).toString().padStart(2,`0`)}`}function rn(t){let n=document.activeElement;if(!(n&&(n.tagName===`INPUT`||n.tagName===`TEXTAREA`||n.isContentEditable))){if(t.shiftKey){if(t.key===`ArrowRight`){t.preventDefault(),k(I,A[(A.findIndex(t=>t.id===e(I))+1)%A.length].id,!0);return}else if(t.key===`ArrowLeft`){t.preventDefault(),k(I,A[(A.findIndex(t=>t.id===e(I))-1+A.length)%A.length].id,!0);return}}if(t.code===`Space`||t.key===` `)e(I)===`songs`&&(t.preventDefault(),F.togglePlay());else if(t.key===`ArrowDown`){if(e(I)===`songs`&&e(W).length>0){t.preventDefault();let n=e(W).findIndex(t=>t.id===e(q));if(n===-1){let t=U[F.currentTrackIndex];n=e(W).findIndex(e=>e.id===t?.id)}let r=(n+1)%e(W).length;k(q,e(W)[r].id,!0),Qt()}}else if(t.key===`ArrowUp`){if(e(I)===`songs`&&e(W).length>0){t.preventDefault();let n=e(W).findIndex(t=>t.id===e(q));if(n===-1){let t=U[F.currentTrackIndex];n=e(W).findIndex(e=>e.id===t?.id)}let r=(n-1+e(W).length)%e(W).length;k(q,e(W)[r].id,!0),Qt()}}else if(t.key===`Enter`&&e(I)===`songs`&&e(q)){t.preventDefault();let n=e(W).find(t=>t.id===e(q));n&&$t(n)}}}let an=0,on=0;function sn(e){if(e.target&&(e.target.tagName===`INPUT`||e.target.closest(`button`)||e.target.closest(`.ctrl`))){an=0,on=0;return}an=e.touches[0].clientX,on=e.touches[0].clientY}function cn(t){if(an===0||!t.changedTouches||t.changedTouches.length===0)return;let n=t.changedTouches[0].clientX-an,r=t.changedTouches[0].clientY-on;if(Math.abs(n)<=Math.abs(r)||Math.abs(n)<=60)return;let i=A.findIndex(t=>t.id===e(I));i!==-1&&(n<0&&i<A.length-1?k(I,A[i+1].id,!0):n>0&&i>0&&k(I,A[i-1].id,!0))}let J=T(null),Y=T(0),ln=T(!1),un=T(!1),X,Z,Q,dn=[],$=[],fn,pn=T(!1);M(()=>(e(J)&&hn(),()=>{fn&&cancelAnimationFrame(fn),window.removeEventListener(`resize`,gn),Q&&(Q.dispose(),Q=null),X=null,Z=null,dn=[],$=[]})),M(()=>{if(F.currentTrackIndex,e(I),Tt(),k(Y,0),k(pn,!1),X){for(let e of dn)X.remove(e.mesh);for(let e of $)X.remove(e.mesh)}dn=[],$=[]});function mn(){let e=document.querySelector(`.dj-fader-knob`);if(!e)return{x:window.innerWidth/2,y:window.innerHeight/2};let t=e.getBoundingClientRect();return{x:t.left+t.width/2,y:window.innerHeight-(t.top+t.height/2)}}function hn(){if(!e(J))return;let t=window.innerWidth,n=window.innerHeight;e(J).width=t,e(J).height=n,X=new g,Z=new re(0,t,n,0,-1,1),Q=new Se({canvas:e(J),alpha:!0,antialias:!0}),Q.setSize(t,n,!1),Q.setPixelRatio(Math.min(window.devicePixelRatio,2)),window.addEventListener(`resize`,gn),_n()}function gn(){if(!e(J)||!Q||!Z)return;let t=window.innerWidth,n=window.innerHeight;e(J).width=t,e(J).height=n,Q.setSize(t,n,!1),Z.right=t,Z.top=n,Z.updateProjectionMatrix()}function _n(){if(fn=requestAnimationFrame(_n),!(!X||!Z||!Q||!e(J))){if(e(Y)>=10&&(k(pn,!0),Math.random()<.22)){let e=mn();vn(e.x,e.y)}for(let e=dn.length-1;e>=0;e--){let t=dn[e];t.x+=t.vx,t.y+=t.vy,t.vy+=t.ay,t.life-=t.decay,t.mesh.position.set(t.x,t.y,0),t.mesh.material.opacity=t.life,t.life<=0&&(X.remove(t.mesh),t.mesh.geometry.dispose(),t.mesh.material.dispose(),dn.splice(e,1))}for(let e=$.length-1;e>=0;e--){let t=$[e];t.x+=t.vx,t.y+=t.vy,t.life-=t.decay;let n=t.startScale+(1-t.life)*88;t.mesh.scale.set(n,n,1),t.mesh.position.set(t.x,t.y,0),t.mesh.material.opacity=t.life*.16,t.life<=0&&(X.remove(t.mesh),t.mesh.geometry.dispose(),t.mesh.material.dispose(),$.splice(e,1))}Q.render(X,Z)}}function vn(e,n){if(!X)return;let r=new ce(5,8),i=.85+Math.random()*.12,o=new t(r,new De({color:new a(i,i,i*1.01),transparent:!0,opacity:.06,blending:1}));o.position.set(e,n,0),X.add(o),$.push({mesh:o,x:e,y:n,vx:(Math.random()-.5)*.55+Math.sin(Date.now()*.001)*.22,vy:Math.random()*.7+1.25,startScale:1,life:1,decay:6e-4+Math.random()*4e-4})}function yn(n=25){if(!X||!e(J))return;let r=mn(),i=r.x,o=r.y;for(let e=0;e<n;e++){let e=new t(new ce(1.3,4),new De({color:new a(Math.random()<.4?16711765:16755200),transparent:!0,opacity:1,blending:2}));e.position.set(i,o,0),X.add(e);let n=Math.random()*Math.PI*2,r=Math.random()*4+2;dn.push({mesh:e,x:i,y:o,vx:Math.cos(n)*r,vy:Math.sin(n)*r,ay:-.15,life:1,decay:.02+Math.random()*.02})}}var bn=St();ge(`keydown`,ke,rn),ge(`popstate`,ke,Bt),ge(`click`,ke,Vt);var xn=N(bn);let Sn;var Cn=N(xn),wn=N(Cn),Tn=N(wn);Be(N(Tn),{size:`panel`}),v(Tn);var En=O(Tn,2);En.textContent=`MUSIC`,v(wn);var Dn=O(wn,2);Me(N(Dn),{size:20}),v(Dn),v(Cn);var On=O(Cn,2);He(On,{get tabs(){return A},get activeTab(){return e(I)},set activeTab(e){k(I,e,!0)}});var kn=O(On,2),An=N(kn),jn=t=>{var n=dt(),r=N(n);let a;var l=N(r);let f;var h=N(l),g=N(h),te=t=>{var n=Je(),r=N(n);Te(r,e=>k(Nt,e),()=>e(Nt));var i=O(r,2),a=e=>{C(e,qe())};b(i,t=>{!F.isPlaying&&!e(Pt)&&t(a)});var o=O(i,2);_e(N(o),{size:16,class:`text-white/70`}),v(o),v(n),w(`click`,n,()=>{k(Mt,!0)}),C(t,n)},ne=e=>{var t=Ye();_e(N(t),{size:16,class:`text-white/20`}),v(t),C(e,t)},re=t=>{var n=d(),r=ye(n),i=t=>{var n=Xe(),r=N(n);let i;var a=O(N(r),8),o=N(a);let s;v(a),c(2),v(r);var l=O(r,2);let u;v(n),E(()=>{i=j(r,1,`vinyl-record svelte-1o4jdf5`,null,i,{spinning:e(z)}),P(o,`src`,F.fetchErrors[e(G).id]||!e(G).cover?Ct:e(G).cover),P(o,`alt`,e(G).album),s=j(o,1,`record-art svelte-1o4jdf5`,null,s,{loaded:e(Ot)}),u=j(l,1,`tonearm svelte-1o4jdf5`,null,u,{playing:e(z)})}),w(`click`,n,en),ge(`load`,o,()=>k(Ot,!0)),ge(`error`,o,wt),se(o),C(t,n)},a=t=>{let n=D(()=>F.duration>0?(1-F.currentTime/F.duration)*.45+.25:.48),r=D(()=>F.duration>0?F.currentTime/F.duration*.45+.25:.48);var i=Ze(),a=N(i),o=N(a),s=N(o),l=N(s,!0);v(s),c(2),v(o);var u=O(o,2),d=N(u);let f;var p=O(d,2);let m;var h=O(p,2);let ee;var g=O(h,2);let te;v(u),v(a),v(i),E(()=>{S(l,e(G).title),f=j(d,1,`spindle-left bg-zinc-900 svelte-1o4jdf5`,null,f,{spinning:e(z)}),m=j(p,1,`tape-roll-left bg-amber-950/70 svelte-1o4jdf5`,null,m,{spinning:e(z)}),y(p,`width: ${e(n)*46}px; height: ${e(n)*46}px;`),ee=j(h,1,`spindle-right bg-zinc-900 svelte-1o4jdf5`,null,ee,{spinning:e(z)}),te=j(g,1,`tape-roll-right bg-amber-950/70 svelte-1o4jdf5`,null,te,{spinning:e(z)}),y(g,`width: ${e(r)*46}px; height: ${e(r)*46}px;`)}),w(`click`,i,en),C(t,i)},o=t=>{var n=Qe(),r=N(n),i=O(N(r),4),a=O(N(i),4),o=N(a),s=N(o,!0);v(o);var c=O(o,2),l=N(c,!0);v(c),v(a),v(i);var u=O(i,2),d=N(u);let f;var p=O(d,2),m=N(p);let h;v(p),v(u);var ee=O(u,2);let g;v(r),v(n),E(()=>{S(s,e(G).title),S(l,e(G).artist||`WEAREDOGS`),f=j(d,1,`floppy-shutter-slider bg-zinc-400 svelte-1o4jdf5`,null,f,{open:e(z)}),h=j(m,1,`floppy-magnetic-disc bg-zinc-900 svelte-1o4jdf5`,null,h,{spinning:e(z)}),g=j(ee,1,`floppy-drive-led svelte-1o4jdf5`,null,g,{active:e(z)})}),w(`click`,n,en),C(t,n)},s=t=>{var n=et(),r=N(n),i=N(r);let a;var o=O(i,2),s=N(o),c=N(s);let l;var d=O(c,2);let f;v(s);var m=O(s,2),h=N(m);let ee;v(m);var g=O(m,2);u(g,20,()=>Array(10),p,(t,n,r)=>{var i=$e();let a;E(e=>a=j(i,1,`comb-tooth svelte-1o4jdf5`,null,a,e),[()=>({vibrating:e(z)&&r%3==Math.floor(F.currentTime*4)%3})]),C(t,i)}),v(g),v(o),v(r),v(n),E(()=>{a=j(i,1,`music-box-key svelte-1o4jdf5`,null,a,{spinning:e(z)}),l=j(c,1,`music-box-gear gear-1 svelte-1o4jdf5`,null,l,{spinning:e(z)}),f=j(d,1,`music-box-gear gear-2 svelte-1o4jdf5`,null,f,{spinning:e(z)}),ee=j(h,1,`music-box-drum bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 svelte-1o4jdf5`,null,ee,{spinning:e(z)})}),w(`click`,n,en),C(t,n)};b(r,e=>{Ve.musicDeckModel===`vinyl`?e(i):Ve.musicDeckModel===`cassette`?e(a,1):Ve.musicDeckModel===`floppy`?e(o,2):Ve.musicDeckModel===`musicbox`&&e(s,3)}),C(t,n)};b(g,t=>{e(B)&&!e(Mt)?t(te):e(B)&&e(Mt)?t(ne,1):t(re,-1)}),v(h);var ie=O(h,2),oe=N(ie),ce=N(oe),le=N(ce),fe=e=>{xe(e,{size:12,class:`text-[#22c55e]`})},me=e=>{Oe(e,{size:12})};b(le,t=>{e(Xt)===e(G).id?t(fe):t(me,-1)}),v(ce),v(oe);var T=O(oe,2);let Se;var we=N(T);let Ee;var De=N(we,!0);v(we),v(T);var A=O(T,2);let ke;var M=N(A);let Ae;var Me=N(M,!0);v(M),v(A);var Pe=O(A,2);let Le;var ze=N(Pe);let Be;var He=N(ze,!0);v(ze),v(Pe),v(ie),v(l);var Ue=O(l,2),Ge=N(Ue),Ke=N(Ge),ft=N(Ke,!0);v(Ke);var pt=O(Ke,2),mt=N(pt);u(mt,21,()=>e(Rt),p,(t,n,r)=>{let i=D(()=>F.duration>0?F.currentTime/F.duration:0),a=D(()=>r/60);var o=tt();let s;E(()=>{s=j(o,1,`waveform-bar transition-colors duration-100 rounded-full svelte-1o4jdf5`,null,s,{active:e(a)<=e(i)}),y(o,`height: ${e(n)??``}%; width: 3px;`)}),C(t,o)}),v(mt);var ht=O(mt,2);ve(ht),v(pt);var gt=O(pt,2),_t=N(gt,!0);v(gt),v(Ge);var vt=O(Ge,2),yt=N(vt);let bt;de(N(yt),{size:15}),v(yt);var xt=O(yt,2);Ie(N(xt),{size:19}),v(xt);var St=O(xt,2);let Tt;var Et=N(St),I=e=>{Ne(e,{size:22})},Dt=e=>{C(e,nt())},V=e=>{m(e,{size:22,fill:`currentColor`})},H=e=>{ee(e,{size:22,fill:`currentColor`})};b(Et,t=>{F.fetchErrors[e(G).id]?t(I):F.isLoading?t(Dt,1):F.isPlaying?t(V,2):t(H,-1)}),v(St);var It=O(St,2);s(N(It),{size:19}),v(It);var Lt=O(It,2);let zt;var Bt=N(Lt),Vt=e=>{i(e,{size:15})},Ht=e=>{Re(e,{size:15})};b(Bt,e=>{F.repeatMode===2?e(Vt):e(Ht,-1)}),v(Lt),v(vt);var Ut=O(vt,2),K=N(Ut);let Qt;var rn=N(K);let an;je(N(rn),{size:12}),c(2),v(rn);var on=O(rn,2),sn=N(on);let cn;v(on);var J=O(on,2);let X;o(N(J),{size:12}),c(2),v(J),v(K),v(Ut);var Z=O(Ut,2),Q=N(Z),dn=t=>{var n=rt(),r=N(n),i=N(r),a=e=>{he(e,{size:12,class:`text-red-400`})},o=e=>{ae(e,{size:12})};b(i,e=>{F.isMuted||F.volume===0?e(a):e(o,-1)}),v(r);var s=O(r,2);ve(s);var c=O(s,2),l=N(c);v(c),v(n),Te(n,e=>k(At,e),()=>e(At)),E(e=>{Fe(s,F.volume),S(l,`${e??``}%`)},[()=>Math.round(F.volume*100)]),w(`click`,r,()=>F.toggleMute()),w(`input`,s,e=>F.setVolume(parseFloat(e.target.value))),C(t,n)};b(Q,t=>{e(kt)&&t(dn)});var $=O(Q,2),fn=N($);let pn;pe(N(fn),{size:13}),v(fn);var mn=O(fn,2),hn=N(mn,!0);v(mn),v($);var gn=O($,2),_n=N(gn),vn=N(_n),yn=e=>{he(e,{size:13,class:`text-red-400`})},bn=e=>{ae(e,{size:13})};b(vn,e=>{F.isMuted||F.volume===0?e(yn):e(bn,-1)}),v(_n),v(gn),v(Z),v(Ue),v(r);var xn=O(r,2);let Sn;var Cn=N(xn),wn=O(N(Cn),2);v(Cn);var Tn=O(Cn,2),En=N(Tn),Dn=N(En);be(Dn,{size:13});var On=O(Dn,3),kn=N(On,!0);v(On),v(En);var An=O(En,2),jn=O(N(An),2),Mn=N(jn);Mn.value=Mn.__value=`default`;var Nn=O(Mn);Nn.value=Nn.__value=`artist`;var Pn=O(Nn);Pn.value=Pn.__value=`album`;var Fn=O(Pn);Fn.value=Fn.__value=`year`;var In=O(Fn);In.value=In.__value=`filename`;var Ln=O(In);Ln.value=Ln.__value=`genre`;var Rn=O(Ln);Rn.value=Rn.__value=`season`,v(jn),v(An),v(Tn);var zn=O(Tn,2);u(zn,21,()=>e(W),p,(t,n,r)=>{var i=ut();let a;var o=N(i),s=N(o),l=e=>{C(e,it())},u=e=>{var t=at();t.textContent=r+1,C(e,t)};b(s,t=>{U[F.currentTrackIndex].id===e(n).id&&F.isPlaying?t(l):t(u,-1)}),v(o);var d=O(o,2),f=O(d,2),p=N(f),m=N(p);let h;var ee=N(m,!0);v(m);var g=O(m,2),te=e=>{var t=ot();Ne(N(t),{size:10}),c(),v(t),C(e,t)};b(g,t=>{F.fetchErrors[e(n).id]&&t(te)}),v(p);var _=O(p,2),ne=N(_);v(_),v(f);var y=O(f,2),re=N(y),ie=t=>{var r=lt(),i=N(r),a=e=>{var t=st();w(`click`,t,e=>{e.stopPropagation(),k(Ft,!0)}),C(e,t)},o=t=>{var r=ct();E(()=>P(r,`href`,e(n).attrib)),w(`click`,r,e=>e.stopPropagation()),C(t,r)};b(i,t=>{e(n).id===`arigato`?t(a):t(o,-1)}),v(r),C(t,r)};b(re,t=>{e(n).attrib&&t(ie)});var ae=O(re,2),oe=N(ae),ce=e=>{xe(e,{size:12,class:`text-[#22c55e]`})},le=e=>{Oe(e,{size:12})};b(oe,t=>{e(Xt)===e(n).id?t(ce):t(le,-1)}),v(ae),v(y),v(i),E(()=>{a=j(i,1,`track-row svelte-1o4jdf5`,null,a,{active:U[F.currentTrackIndex].id===e(n).id,"kb-focused":e(q)===e(n).id,"fetch-error":F.fetchErrors[e(n).id]}),P(i,`data-track-id`,e(n).id),P(d,`src`,F.fetchErrors[e(n).id]||!e(n).cover?Ct:e(n).cover),P(d,`alt`,e(n).album),h=j(m,1,`tr-title svelte-1o4jdf5`,null,h,{"line-through":F.fetchErrors[e(n).id],"opacity-50":F.fetchErrors[e(n).id]}),S(ee,e(n).title),S(ne,`${e(n).artist??``} · ${e(n).album??``} (${(e(n).year||``)??``})`)}),w(`click`,i,()=>$t(e(n))),ge(`error`,d,wt),se(d),w(`click`,ae,t=>Zt(t,e(n))),C(t,i)}),v(zn),v(xn),v(n),E((t,n)=>{a=j(r,1,`player-side svelte-1o4jdf5`,null,a,{"tracklist-open":e(R)}),f=j(l,1,`player-top-block transition-all duration-300 ease-in-out svelte-1o4jdf5`,null,f,{"opacity-0":e(R),"scale-95":e(R),"pointer-events-none":e(R)}),Se=j(T,1,`scroll-container svelte-1o4jdf5`,null,Se,{overflowing:e(Gt)>e(Wt)}),y(T,`--scroll-dist: -${e(Gt)-e(Wt)}px`),Ee=j(we,1,`track-title scroll-text svelte-1o4jdf5`,null,Ee,{"animate-scroll":e(Gt)>e(Wt)}),S(De,e(G).title),ke=j(A,1,`scroll-container svelte-1o4jdf5`,null,ke,{overflowing:e(qt)>e(Kt)}),y(A,`--scroll-dist: -${e(qt)-e(Kt)}px`),Ae=j(M,1,`track-artist scroll-text svelte-1o4jdf5`,null,Ae,{"animate-scroll":e(qt)>e(Kt)}),S(Me,e(G).artist),Le=j(Pe,1,`scroll-container svelte-1o4jdf5`,null,Le,{overflowing:e(Yt)>e(Jt)}),y(Pe,`--scroll-dist: -${e(Yt)-e(Jt)}px`),Be=j(ze,1,`track-album scroll-text svelte-1o4jdf5`,null,Be,{"animate-scroll":e(Yt)>e(Jt)}),S(He,e(G).album),S(ft,t),P(ht,`max`,F.duration||100),Fe(ht,F.currentTime),S(_t,n),bt=j(yt,1,`ctrl ctrl-sm svelte-1o4jdf5`,null,bt,{"active-ctrl":F.isShuffled}),Tt=j(St,1,`ctrl ctrl-play svelte-1o4jdf5`,null,Tt,{"ctrl-error":F.fetchErrors[e(G).id]}),P(St,`aria-label`,F.isPlaying?`Pause`:`Play`),zt=j(Lt,1,`ctrl ctrl-sm svelte-1o4jdf5`,null,zt,{"active-ctrl":F.repeatMode>0}),Qt=j(K,1,`dj-crossfader svelte-1o4jdf5`,null,Qt,{"fader-flash":e(un),"fader-fried":e(Y)>=10}),an=j(rn,1,`fader-label left-label flex items-center gap-1 svelte-1o4jdf5`,null,an,{active:!F.isInstrumental}),cn=j(sn,1,`dj-fader-knob svelte-1o4jdf5`,null,cn,{right:F.isInstrumental,"knob-jiggle":e(ln),fried:e(Y)>=10}),X=j(J,1,`fader-label right-label flex items-center gap-1 svelte-1o4jdf5`,null,X,{active:F.isInstrumental}),pn=j(fn,1,`ctrl ctrl-xs svelte-1o4jdf5`,null,pn,{"active-ctrl":e(B)}),j(mn,1,`w-[90px] h-[20px] flex items-center justify-center rounded text-[9px] font-bold transition-all font-mono uppercase tracking-wider select-none cursor-pointer
                      ${e(B)?`bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/25 active:scale-95`:`bg-transparent border border-white/5 text-white/20 hover:text-white/40 hover:border-white/10`}`,`svelte-1o4jdf5`),P(mn,`title`,e(B)?`Click to cycle presets`:`Click to enable visualizer`),S(hn,We[e(jt)].name),Sn=j(xn,1,`tracklist-side svelte-1o4jdf5`,null,Sn,{"show-mobile":e(R)}),S(kn,U.length)},[()=>nn(F.currentTime),()=>nn(F.duration)]),w(`click`,ce,t=>Zt(t,e(G))),Ce(we,`clientWidth`,e=>k(Gt,e)),Ce(T,`clientWidth`,e=>k(Wt,e)),Ce(M,`clientWidth`,e=>k(qt,e)),Ce(A,`clientWidth`,e=>k(Kt,e)),Ce(ze,`clientWidth`,e=>k(Yt,e)),Ce(Pe,`clientWidth`,e=>k(Jt,e)),w(`input`,ht,e=>{F.seek(parseFloat(e.target.value))}),w(`change`,ht,e=>{F.isPlaying||F.play(parseFloat(e.target.value))}),w(`click`,yt,()=>F.setShuffle(!F.isShuffled)),w(`click`,xt,()=>F.prevTrack()),w(`click`,St,()=>F.togglePlay()),w(`click`,It,()=>F.nextTrack()),w(`click`,Lt,()=>{F.repeatMode=(F.repeatMode+1)%3}),w(`click`,K,tn),w(`click`,fn,()=>{k(B,!e(B))}),w(`click`,mn,()=>{e(B)?k(jt,(e(jt)+1)%We.length):k(B,!0)}),w(`click`,_n,()=>{k(kt,!e(kt))}),w(`click`,wn,()=>{k(R,!1)}),ue(jn,()=>e(L),e=>k(L,e)),_(1,n,()=>x,()=>({duration:120,delay:120})),_(2,n,()=>x,()=>({duration:120})),C(t,n)},Mn=e=>{var t=ft(),n=O(N(t),2),r=N(n);je(r,{size:36});var i=O(r,6),a=O(N(i),2);f(N(a),{size:15}),c(),v(a),v(i),v(n),c(2),v(t),_(1,t,()=>x,()=>({duration:120,delay:120})),_(2,t,()=>x,()=>({duration:120})),C(e,t)},Nn=e=>{var t=mt(),n=O(N(t),2),r=O(N(n),4);oe(O(N(r)),{size:15}),v(r),v(n);var i=O(n,2);u(i,20,()=>[{name:`Apple Music`,color:`#fc3c44`,icon:`🎵`},{name:`YouTube Music`,color:`#ff0000`,icon:`▶`},{name:`Amazon Music`,color:`#00a8e0`,icon:`♪`},{name:`Tidal`,color:`#00d4f5`,icon:`〰`}],p,(e,t)=>{var n=pt(),r=N(n),i=N(r,!0);v(r);var a=O(r),o=N(a,!0);v(a),te(O(a),{size:11}),v(n),E(()=>{y(n,`--sc:${t.color??``}`),S(i,t.icon),S(o,t.name)}),C(e,n)}),v(i),c(2),v(t),_(1,t,()=>x,()=>({duration:120,delay:120})),_(2,t,()=>x,()=>({duration:120})),C(e,t)},Pn=e=>{var t=ht();_(1,t,()=>x,()=>({duration:120,delay:120})),_(2,t,()=>x,()=>({duration:120})),C(e,t)},Fn=t=>{var n=_t(),r=N(n),i=t=>{let n=D(()=>e(Dt));var r=d();ne(ye(r),()=>e(n),(e,t)=>{t(e,{get audioCore(){return F}})}),C(t,r)},a=e=>{C(e,gt())};b(r,t=>{e(Dt)?t(i):t(a,-1)}),v(n),_(1,n,()=>x,()=>({duration:120,delay:120})),_(2,n,()=>x,()=>({duration:120})),C(t,n)};b(An,t=>{e(I)===`songs`?t(jn):e(I)===`samples`?t(Mn,1):e(I)===`playlists`?t(Nn,2):e(I)===`radio`?t(Pn,3):e(I)===`battle`&&t(Fn,4)}),v(kn),c(2),v(xn);var In=O(xn,2),Ln=t=>{var n=bt(),r=N(n);Te(r,e=>k(Nt,e),()=>e(Nt));var i=O(r,2),a=e=>{C(e,vt())};b(i,t=>{!F.isPlaying&&!e(Pt)&&t(a)});var o=O(i,2),s=N(o);u(s,21,()=>We,p,(t,n,r)=>{var i=yt(),a=N(i,!0);v(i),E(()=>{j(i,1,`px-2 py-1 rounded text-[9px] font-bold transition-all uppercase tracking-wider font-mono
                ${e(jt)===r?`bg-purple-600 text-white`:`text-white/40 hover:text-white/80`}`,`svelte-1o4jdf5`),S(a,e(n).name)}),w(`click`,i,()=>k(jt,r,!0)),C(t,i)}),v(s),v(o),v(n),w(`click`,n,e=>{e.stopPropagation(),k(Mt,!1)}),w(`click`,o,e=>e.stopPropagation()),C(t,n)};b(In,t=>{e(B)&&e(Mt)&&t(Ln)});var Rn=O(In,2);Te(Rn,e=>k(J,e),()=>e(J));var zn=O(Rn,2),Bn=t=>{var n=xt(),r=N(n),i=N(r),a=O(N(i),2);Me(N(a),{size:16}),v(a),v(i);var o=O(i,2),s=N(o),l=N(s);te(N(l),{size:14}),c(),v(l),v(s);var u=O(s,2);ie(u,()=>Lt(e(It).intro),!0),v(u);var d=O(u,2),f=N(d);ie(f,()=>Lt(e(It).tos),!0),v(f),v(d);var p=O(d,2);ie(p,()=>Lt(e(It).outro),!0),v(p),v(o),v(r),v(n),w(`click`,n,()=>k(Ft,!1)),w(`click`,r,e=>e.stopPropagation()),w(`click`,a,()=>k(Ft,!1)),_(3,n,()=>x,()=>({duration:150})),C(t,n)};b(zn,t=>{e(Ft)&&t(Bn)}),v(bn),E(()=>Sn=j(xn,1,`mp-container svelte-1o4jdf5`,null,Sn,{closing:Tt(),"theme-inst":F.isInstrumental})),w(`click`,bn,function(...e){me.onClose?.apply(this,e)}),w(`click`,xn,e=>e.stopPropagation()),w(`click`,Tn,()=>{F.isPlaying||window.dispatchEvent(new CustomEvent(`open-info-panel`))}),w(`click`,Dn,function(...e){me.onClose?.apply(this,e)}),w(`touchstart`,kn,sn,void 0,!0),w(`touchend`,kn,cn),C(h,bn),le()}me([`click`,`touchstart`,`touchend`,`input`,`change`]);export{Ct as default};