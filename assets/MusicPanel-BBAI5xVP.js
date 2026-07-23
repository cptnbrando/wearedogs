const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/BattlePanel-BECXB5Qn.js","assets/vendor-a-eVwjvB.js","assets/rolldown-runtime-CMxvf4Kt.js","assets/vendor-Dl9nCA7L.css","assets/BattlePanel-B1S5D9Lq.css"])))=>i.map(i=>d[i]);
import{A as e,Ar as t,Br as n,Bt as r,C as i,Ci as a,Et as o,Fr as s,Gr as c,Gt as l,H as u,Hr as d,Ht as f,Ir as p,It as m,J as h,Jr as ee,K as te,Kr as g,L as ne,Ln as re,Lt as ie,Mr as ae,Or as _,P as oe,Pn as se,Pr as v,Qt as ce,S as y,Si as le,St as ue,Ti as b,Tr as x,Ut as de,Vr as fe,Y as pe,Yn as me,Yr as S,Zn as he,_r as ge,ai as C,bn as _e,br as ve,bt as ye,ci as w,cn as be,fi as T,fr as xe,g as Se,gi as E,j as Ce,jr as we,kr as Te,mi as Ee,ni as D,nn as De,oi as O,pi as k,pr as Oe,pt as ke,qr as Ae,si as je,sr as Me,st as Ne,ti as A,tr as Pe,ur as Fe,vr as j,wi as M,wr as Ie,xi as Le,xr as Re,xt as ze,zr as N}from"./vendor-a-eVwjvB.js";import{t as Be}from"./index-6fL7jjOu.js";import{t as P}from"./AudioCore.svelte-DFuI3EBi.js";import{t as Ve}from"./DogsLogo-CrnVwqpK.js";import{t as He}from"./settingsManager.svelte-DCY71nfj.js";import{t as Ue}from"./SwipeTabNav-c_iabOWa.js";var We=class{constructor(e,t){b(this,`canvas`,null),b(this,`gl`,null),b(this,`analyser`,null),b(this,`program`,null),b(this,`animationFrameId`,null),b(this,`startTime`,0),b(this,`vertexBuffer`,null),b(this,`audioTexture`,null),b(this,`uniforms`,{}),b(this,`frequencyBuffer`,null),this.canvas=e,this.analyser=t,this.frequencyBuffer=new Uint8Array(t?t.frequencyBinCount:128),this.gl=e.getContext(`webgl`)||e.getContext(`experimental-webgl`),this.gl||console.error(`WebGL not supported by this browser.`)}init(e){if(!this.gl)return;let t=this.gl;this.cleanupProgram();let n=this.compileShader(t.VERTEX_SHADER,`
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
  `},qe=`I understand the creator of this sick beat Nxnja has a copyright notice on his music distribution website.\r
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
`,Je=d(`<div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 animate-pulse svelte-1o4jdf5"><div class="bg-black/75 border border-red-500/30 px-3 py-1.5 rounded text-[10px] font-mono tracking-widest text-red-500 font-bold uppercase shadow-[0_0_15px_rgba(239,68,68,0.25)] select-none svelte-1o4jdf5">NO SIGNAL</div></div>`),Ye=d(`<div class="visualizer-container cursor-pointer svelte-1o4jdf5"><canvas class="visualizer-canvas svelte-1o4jdf5"></canvas> <!> <div class="visualizer-hover-overlay svelte-1o4jdf5"><!></div></div>`),Xe=d(`<div class="visualizer-container bg-[#050508]/40 border border-white/5 flex items-center justify-center svelte-1o4jdf5"><!></div>`),Ze=d(`<div class="vinyl-record-clicker cursor-pointer w-full h-full svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div><div class="groove g1 svelte-1o4jdf5"></div> <div class="groove g2 svelte-1o4jdf5"></div> <div class="groove g3 svelte-1o4jdf5"></div> <div class="groove g4 svelte-1o4jdf5"></div> <div class="record-label svelte-1o4jdf5"><img loading="lazy"/></div> <div class="spindle svelte-1o4jdf5"></div></div> <div></div></div>`),Qe=d(`<div class="cassette-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="cassette-tape svelte-1o4jdf5"><div class="cassette-label bg-gradient-to-r from-purple-800 to-pink-700 svelte-1o4jdf5"><span class="cassette-track-title svelte-1o4jdf5"> </span> <span class="cassette-brand svelte-1o4jdf5">WEAREDOGS AUDIO</span></div> <div class="cassette-window bg-zinc-950/80 svelte-1o4jdf5"><div></div> <div></div> <div></div> <div></div></div></div></div>`),$e=d(`<div class="floppy-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="floppy-disk svelte-1o4jdf5"><div class="floppy-corner svelte-1o4jdf5"></div> <div class="floppy-write-protect svelte-1o4jdf5"></div> <div class="floppy-label bg-slate-100 text-slate-900 svelte-1o4jdf5"><div class="floppy-label-stripe bg-red-600 svelte-1o4jdf5"></div> <div class="floppy-label-stripe-blue bg-blue-600 svelte-1o4jdf5"></div> <div class="floppy-label-content svelte-1o4jdf5"><div class="floppy-song truncate font-mono svelte-1o4jdf5"> </div> <div class="floppy-artist truncate font-mono svelte-1o4jdf5"> </div></div></div> <div class="floppy-shutter-door bg-zinc-700 svelte-1o4jdf5"><div></div> <div class="floppy-shutter-opening bg-zinc-950 svelte-1o4jdf5"><div></div></div></div> <div></div></div></div>`),et=d(`<div></div>`),tt=d(`<div class="musicbox-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="music-box svelte-1o4jdf5"><div></div> <div class="music-box-interior border border-amber-900/40 svelte-1o4jdf5"><div class="music-box-gears svelte-1o4jdf5"><div></div> <div></div></div> <div class="music-box-drum-wrap svelte-1o4jdf5"><div><div class="music-box-pins svelte-1o4jdf5"><div class="pin pin-1 svelte-1o4jdf5"></div> <div class="pin pin-2 svelte-1o4jdf5"></div> <div class="pin pin-3 svelte-1o4jdf5"></div> <div class="pin pin-4 svelte-1o4jdf5"></div> <div class="pin pin-5 svelte-1o4jdf5"></div> <div class="pin pin-6 svelte-1o4jdf5"></div></div></div></div> <div class="music-box-comb svelte-1o4jdf5"></div></div></div></div>`),nt=d(`<span></span>`),rt=d(`<div class="spin-ring svelte-1o4jdf5"></div>`),it=d(`<div class="volume-popover svelte-1o4jdf5"><button class="ctrl ctrl-xs mr-2 border border-white/10 rounded-full p-1 hover:bg-white/10 svelte-1o4jdf5" aria-label="Mute"><!></button> <input type="range" class="vol-slider-pop svelte-1o4jdf5" min="0" max="1" step="0.01" aria-label="Volume"/> <span class="text-[10px] font-bold text-white/60 min-w-[28px] text-right font-mono select-none svelte-1o4jdf5"> </span></div>`),at=d(`<div class="eq svelte-1o4jdf5"><div class="eq-b svelte-1o4jdf5"></div> <div class="eq-b svelte-1o4jdf5"></div> <div class="eq-b svelte-1o4jdf5"></div></div>`),ot=d(`<span class="svelte-1o4jdf5"></span>`),st=d(`<span class="text-amber-400 flex items-center gap-1 text-[9px] font-bold tracking-wider uppercase bg-amber-500/10 px-1.5 py-0.5 rounded flex-shrink-0 svelte-1o4jdf5" title="Failed to fetch music source from remote database"><!> Error Fetching</span>`),ct=d(`<button class="cursor-pointer svelte-1o4jdf5" style="background: none; border: none; padding: 0; color: inherit; font: inherit;">i</button>`),lt=d(`<a target="_blank" class="svelte-1o4jdf5">i</a>`),ut=d(`<span class="inst-chip-link svelte-1o4jdf5"><!></span>`),dt=d(`<div><div class="tr-num svelte-1o4jdf5"><!></div> <img loading="lazy" class="tr-art svelte-1o4jdf5"/> <div class="tr-info svelte-1o4jdf5"><div class="flex items-center gap-1.5 min-w-0 svelte-1o4jdf5"><span> </span> <!></div> <span class="tr-meta svelte-1o4jdf5"> </span></div> <div class="flex items-center gap-2 flex-shrink-0 svelte-1o4jdf5"><!>  <button class="tr-share-btn svelte-1o4jdf5" title="Copy track link" aria-label="Share track"><!></button></div></div>`),ft=d(`<div class="songs-layout svelte-1o4jdf5"><div><div><div class="vinyl-wrapper relative overflow-hidden svelte-1o4jdf5"><!></div> <div class="track-info mt-2 svelte-1o4jdf5"><div class="flex items-center justify-center mb-1.5 svelte-1o4jdf5"><button class="player-share-btn svelte-1o4jdf5" title="Copy track link" aria-label="Share track"><!></button></div> <div><h2> </h2></div> <div><p> </p></div> <div><p> </p></div></div></div> <div class="player-controls-block svelte-1o4jdf5"><div class="progress-row svelte-1o4jdf5"><span class="ptime svelte-1o4jdf5"> </span> <div class="progress-wrap waveform-slider-wrap relative h-9 flex items-end svelte-1o4jdf5"><div class="waveform-bars flex items-end justify-between absolute inset-0 pointer-events-none px-1 h-full svelte-1o4jdf5"></div> <input type="range" class="seek-input absolute inset-0 opacity-0 cursor-pointer w-full h-full svelte-1o4jdf5" min="0" step="0.1" aria-label="Seek"/></div> <span class="ptime svelte-1o4jdf5"> </span></div> <div class="controls-row svelte-1o4jdf5"><button aria-label="Shuffle"><!></button> <button class="ctrl ctrl-md svelte-1o4jdf5" aria-label="Previous"><!></button> <button><!></button> <button class="ctrl ctrl-md svelte-1o4jdf5" aria-label="Next"><!></button> <button aria-label="Repeat"><!></button></div> <div class="w-full flex flex-col items-center gap-1.5 mt-2 px-1 svelte-1o4jdf5"><div><span><!> <span class="svelte-1o4jdf5">VOCAL</span></span> <div class="dj-fader-slot relative svelte-1o4jdf5"><div></div></div> <span><!> <span class="svelte-1o4jdf5">INST</span></span></div></div> <div class="relative flex justify-center items-center gap-3 mt-2 w-full svelte-1o4jdf5"><!> <div class="flex items-center gap-1.5 svelte-1o4jdf5"><button aria-label="Toggle Visualizer"><!></button> <button> </button></div> <div class="relative svelte-1o4jdf5"><button class="ctrl ctrl-xs vol-toggle-btn svelte-1o4jdf5" aria-label="Toggle volume slider"><!></button></div></div></div></div> <div><div class="mobile-close-bar hidden py-2 px-4 border-b border-white/5 flex items-center justify-between svelte-1o4jdf5"><span class="text-xs font-bold text-white/50 svelte-1o4jdf5">Track Library</span> <button class="px-3 py-1 bg-white/5 text-white/75 rounded-lg text-xs font-bold svelte-1o4jdf5">Back to player</button></div> <div class="tl-header flex justify-between items-center gap-3 svelte-1o4jdf5"><div class="flex items-center gap-2 svelte-1o4jdf5"><!><span class="svelte-1o4jdf5">TRACKS</span> <span class="tl-count svelte-1o4jdf5"> </span></div> <div class="flex items-center gap-1.5 ml-auto svelte-1o4jdf5"><span class="text-[9px] text-white/30 font-bold font-sans svelte-1o4jdf5">SORT BY:</span> <select class="bg-black/40 border border-white/10 rounded px-1.5 py-0.5 text-[10px] font-bold text-white/60 outline-none cursor-pointer hover:border-white/20 transition-all font-sans svelte-1o4jdf5"><option class="svelte-1o4jdf5">DEFAULT</option><option class="svelte-1o4jdf5">ARTIST</option><option class="svelte-1o4jdf5">ALBUM</option><option class="svelte-1o4jdf5">YEAR</option><option class="svelte-1o4jdf5">FILENAME</option><option class="svelte-1o4jdf5">GENRE</option><option class="svelte-1o4jdf5">SEASON</option></select></div></div> <div class="tracklist scroll-y svelte-1o4jdf5"></div></div></div>`),pt=d(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><div class="sec-head svelte-1o4jdf5"><h2 class="sec-title svelte-1o4jdf5">Samples</h2> <p class="sec-sub svelte-1o4jdf5">MP3 · MP4 · WAV · OGG · YouTube · Instagram · TikTok</p></div> <div class="drop-zone svelte-1o4jdf5"><!> <p class="drop-title svelte-1o4jdf5">Drop files or paste a link</p> <p class="drop-sub svelte-1o4jdf5">Supports all major audio, video, and streaming links</p> <div class="link-row svelte-1o4jdf5"><input type="url" class="link-input svelte-1o4jdf5" placeholder="https://youtube.com/watch?v=..." aria-label="Paste link"/> <button class="add-btn svelte-1o4jdf5"><!>Add</button></div></div> <div class="empty-state svelte-1o4jdf5"><div class="wip-tape svelte-1o4jdf5">COMING SOON</div> <p class="svelte-1o4jdf5">Your samples will appear here once added.</p></div></div>`),mt=d(`<div class="svc-chip svelte-1o4jdf5"><span class="svelte-1o4jdf5"> </span><span class="svelte-1o4jdf5"> </span><!></div>`),ht=d(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><div class="sec-head svelte-1o4jdf5"><h2 class="sec-title svelte-1o4jdf5">Playlists</h2> <p class="sec-sub svelte-1o4jdf5">Connect Spotify to sync playlists across all services
              automatically</p></div> <div class="spotify-card svelte-1o4jdf5"><div class="sp-icon svelte-1o4jdf5"><svg viewBox="0 0 24 24" fill="currentColor" width="30" height="30" class="svelte-1o4jdf5"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" class="svelte-1o4jdf5"></path></svg></div> <div class="sp-info svelte-1o4jdf5"><h3 class="svelte-1o4jdf5">Connect Spotify</h3> <p class="svelte-1o4jdf5">Import your playlists and sync across services</p></div> <button class="sp-btn svelte-1o4jdf5">Connect <!></button></div> <div class="svc-chips svelte-1o4jdf5"></div> <div class="empty-state mx-auto max-w-[380px] text-center svelte-1o4jdf5"><div class="wip-tape svelte-1o4jdf5">COMING SOON</div> <p class="svelte-1o4jdf5">Connect Spotify to see your playlists, automatically transcribed
              across all services.</p></div></div>`),gt=d(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><div class="sec-head svelte-1o4jdf5"><h2 class="sec-title svelte-1o4jdf5">Radio</h2> <p class="sec-sub svelte-1o4jdf5">Stream live broadcasts, dog shows, and podcast feeds</p></div> <div class="empty-state mx-auto max-w-[380px] text-center svelte-1o4jdf5"><div class="wip-tape svelte-1o4jdf5">COMING SOON</div> <p class="svelte-1o4jdf5">Live radio feeds will appear here once connected.</p></div></div>`),_t=d(`<div class="app-loading-spinner svelte-1o4jdf5" aria-label="Loading..."></div>`),vt=d(`<div class="tab-scroll scroll-y svelte-1o4jdf5"><!></div>`),yt=d(`<div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 animate-pulse svelte-1o4jdf5"><div class="bg-black/75 border border-red-500/30 px-4 py-2 rounded text-[12px] font-mono tracking-widest text-red-500 font-bold uppercase shadow-[0_0_20px_rgba(239,68,68,0.3)] select-none svelte-1o4jdf5">NO SIGNAL</div></div>`),bt=d(`<button> </button>`),xt=d(`<div class="visualizer-container fullscreen cursor-pointer svelte-1o4jdf5"><canvas class="visualizer-canvas svelte-1o4jdf5"></canvas> <!> <div class="visualizer-overlay svelte-1o4jdf5"><div class="flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-lg p-1 border border-white/10 svelte-1o4jdf5"></div></div></div>`),St=d(`<div class="arigato-modal-backdrop svelte-1o4jdf5"><div class="arigato-modal-content svelte-1o4jdf5"><header class="arigato-modal-header svelte-1o4jdf5"><h2 class="svelte-1o4jdf5">ARIGATO INFO</h2> <button class="arigato-close-btn svelte-1o4jdf5"><!></button></header> <div class="arigato-modal-body scroll-y svelte-1o4jdf5"><div class="merch-link-container svelte-1o4jdf5"><a href="https://nxnjaa.beatstars.com/" target="_blank" rel="noopener noreferrer" class="merch-link-btn svelte-1o4jdf5"><!> NXNJA MERCH & MUSIC</a></div> <p class="intro-text svelte-1o4jdf5"></p> <div class="tos-box svelte-1o4jdf5"><div class="tos-microtext svelte-1o4jdf5"></div></div> <p class="outro-text svelte-1o4jdf5"></p></div></div></div>`),Ct=d(`<div class="mp-backdrop svelte-1o4jdf5"><div><header class="panel-header svelte-1o4jdf5"><div class="brand svelte-1o4jdf5"><button class="logo-btn svelte-1o4jdf5" aria-label="Open DOGS Info"><!></button> <h1 class="svelte-1o4jdf5"></h1></div> <button class="close-btn svelte-1o4jdf5" aria-label="Close panel"><!></button></header> <!> <div class="mp-body svelte-1o4jdf5"><!></div> <footer class="mp-footer svelte-1o4jdf5"><div class="mp-status svelte-1o4jdf5"><span class="mp-dot svelte-1o4jdf5"></span><span class="svelte-1o4jdf5">WE ARE DOGS</span></div> <span class="svelte-1o4jdf5">MUSIC</span></footer></div> <!> <canvas class="fader-fx-canvas pointer-events-none svelte-1o4jdf5"></canvas> <!></div>`);function wt(c,d){le(d,!0);let b=[{id:`songs`,label:`Songs`,icon:re},{id:`samples`,label:`Samples`,icon:ce},{id:`playlists`,label:`Playlists`,icon:r},{id:`radio`,label:`Radio`,icon:Pe},{id:`battle`,label:`Battle`,icon:ke}],wt=`/img/error_cover.png`;function Tt(e){e.target.src.endsWith(wt)||(e.target.src=wt)}let Et=Fe(d,`isClosing`,3,!1),Dt=Fe(d,`initialTrackId`,3,null),F=k(`songs`),I=k(`default`),Ot=k(null);D(()=>{S(F)===`battle`&&!S(Ot)&&Be(()=>import(`./BattlePanel-BECXB5Qn.js`).then(e=>{T(Ot,e.default,!0)}),__vite__mapDeps([0,1,2,3,4]))});let L=k(!1),kt=k(!1),At=k(!1),jt=k(null),R=E(()=>P.isPlaying&&!Et()),z=k(!1),Mt=k(0),Nt=k(!1),Pt=k(null),B=null,V=!1,Ft=k(!1),It=k(!1),Lt=E(()=>{let e=qe.split(/`{5,}/);return{intro:e[0]||``,tos:e[1]||``,outro:e[2]||``}});function Rt(e){if(!e)return``;let t=e.replace(/(https?:\/\/[^\s]+)/g,`<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>`);return t=t.replace(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/g,`<a href="mailto:$1">$1</a>`),t.replace(/\n/g,`<br>`)}let zt=E(()=>{let e=S(W);if(!e)return Array(60).fill(10);if(P.waveformPeaks[e.id])return P.waveformPeaks[e.id];let t=e.id,n=[],r=0;for(let e=0;e<t.length;e++)r=(r<<5)-r+t.charCodeAt(e),r|=0;let i=Math.abs(r)%1e3;for(let e=0;e<60;e++){let t=e/59,r=Math.sin(i+t*Math.PI*4),a=Math.cos(i*1.5+t*Math.PI*10)*.4,o=Math.sin(i*2.3+t*Math.PI*22)*.15,s=Math.abs(r+a+o)/1.55,c=Math.sin(t*Math.PI),l=(s*70+15)*c;n.push(Math.max(10,Math.round(l)))}return n});D(()=>{window.innerWidth<=640&&S(z)&&S(Mt)===0&&S(L)&&T(L,!1)}),D(()=>{P.isPlaying&&T(Ft,!0)});let Bt=E(()=>!P.isPlaying&&!S(Ft)?Ke.fragmentShader:Ge[S(Mt)].fragmentShader);D(()=>{let e=P.analyser;return S(z)&&S(Pt)&&!Et()&&(B=new We(S(Pt),e),B.init(S(Bt)),B.start()),()=>{B&&(B.destroy(),B=null)}}),D(()=>{let e=S(Bt);B&&S(z)&&(B.setPreset(e),B.start())}),D(()=>{S(L)?!history.state?.tracklistOpen&&!V&&(history.pushState({tracklistOpen:!0},``),V=!0):V&&(history.back(),V=!1)}),s(()=>{V&&(history.back(),V=!1)});function Vt(e){!e.state?.tracklistOpen&&S(L)&&(T(L,!1),V=!1)}function Ht(e){S(At)&&S(jt)&&!S(jt).contains(e.target)&&!e.target.closest(`.vol-toggle-btn`)&&T(At,!1)}let H=[{id:`hollywood`,title:`HOLLYWOOD`,artist:`YG`,album:`THE GENTLEMEN'S CLUB`,cover:`https://data.wearedogs.net/img/covers/2026/yg.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/yg.jpg`,src:`https://data.wearedogs.net/music/2026/HOLLYWOOD.mp3`,instrumental:`https://data.wearedogs.net/music/2026/HOLLYWOOD-free.mp3`,dateAdded:`2026-06-24T03:00:00-05:00`,year:2026,genre:`Hip-Hop`,attrib:`https://the-gentlemens-club.com/`},{id:`chicago`,title:`Chicago`,artist:`Michael Jackson`,album:`Xscape`,cover:`https://data.wearedogs.net/img/covers/2026/mj.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/mj.jpg`,src:`https://data.wearedogs.net/music/2026/Chicago.mp3`,instrumental:`https://data.wearedogs.net/music/2026/Chicago-free.mp3`,dateAdded:`2026-06-24T03:00:00-05:00`,year:2014,genre:`Pop`},{id:`rain`,title:`Pourin Rain (feat. Skratch Bastid)`,artist:`Zeds Dead`,album:`Return to the Return (of the Spectrum of Intergalactic Happiness)`,cover:`https://data.wearedogs.net/img/covers/2026/zd.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/zd.jpg`,src:`https://data.wearedogs.net/music/2026/Pourin.mp3`,instrumental:``,dateAdded:`2026-07-07T018:12:00-05:00`,year:2026,genre:`Electronic`,attrib:`https://shop.zedsdead.net/`},{id:`denchai`,title:`Den Chai`,artist:`The Buddha-Bar Lounge`,album:`Den Chai`,cover:`https://data.wearedogs.net/img/covers/2026/buddha.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/buddha.png`,src:``,instrumental:`https://data.wearedogs.net/music/2026/DENCHAI.mp3`,dateAdded:`2026-07-07T22:34:00-05:00`,year:2008,genre:`Lounge`,attrib:`https://open.spotify.com/artist/0du3MpnxBOpQEie1IV3u9v?si=2UO722ntTE--Ck_Ji7Go7Q`},{id:`rainbow`,title:`Rainbow in the Dark`,artist:`Das Racist`,album:`Shut Up, Dude`,cover:`https://data.wearedogs.net/img/covers/2026/rainbow.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/rainbow.png`,src:`https://data.wearedogs.net/music/2026/rainbow.mp3`,instrumental:`https://data.wearedogs.net/music/2026/rainbow-free.mp3`,dateAdded:`2026-07-08T16:35:00-05:00`,year:2010,genre:`Hip-Hop`,attrib:`https://dasracist.bandcamp.com/album/shut-up-dude`},{id:`hipsong`,title:`Hip Song`,artist:`Toby Fox / Trevor Alan Gomes`,album:`Deltarune`,cover:`https://data.wearedogs.net/img/covers/2026/deltarune.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/deltarune.png`,src:`https://data.wearedogs.net/music/2026/shop.mp3`,instrumental:`https://data.wearedogs.net/music/2026/shop-free.mp3`,dateAdded:`2026-07-09T01:22:00-05:00`,year:2021,genre:`Video Game`,attrib:`https://deltarune.com/`},{id:`sleepless`,title:`Sleepless`,artist:`deadmau5`,album:`> album title goes here <`,cover:`https://data.wearedogs.net/img/covers/2026/sleepless.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/sleepless.png`,src:``,instrumental:`https://data.wearedogs.net/music/2026/sleepless.mp3`,dateAdded:`2026-07-12T04:22:00-05:00`,year:2026,genre:`Electronic`,attrib:`https://deadmau5.com/`},{id:`skitzo`,title:`Skitzo (feat. Young Thug)`,artist:`Travis Scott`,album:`UTOPIA`,cover:`https://data.wearedogs.net/img/covers/2026/utopia.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/utopia.png`,src:`https://data.wearedogs.net/music/2026/skitzo.mp3`,instrumental:`https://data.wearedogs.net/music/2026/skitzo-free.mp3`,dateAdded:`2026-07-16T01:56:00-05:00`,year:2023,genre:`Hip-Hop`,attrib:`https://shop.travisscott.com/`},{id:`slow`,title:`SLOW ft. DOGS`,artist:`Sweet Boy Sonnet`,album:`Where do I put my love?`,cover:`https://data.wearedogs.net/img/covers/2026/slow.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/slow.png`,src:`https://data.wearedogs.net/music/2026/SLOW-FT-DOGS.mp3`,instrumental:``,dateAdded:`2026-07-20T02:49:34-05:00`,year:2026,genre:`Electronic`,attrib:`https://sweetboysonnet.com/`},{id:`arigato`,title:`ARIGATO`,artist:`Nxnja`,album:`ARIGATO`,cover:`https://data.wearedogs.net/img/covers/2026/arigato.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/arigato.png`,src:``,instrumental:`https://data.wearedogs.net/music/2026/arigato.mp3`,dateAdded:`2026-07-23T00:39:56-05:00`,year:2026,genre:`Hip-Hop`,attrib:`https://nxnjaa.beatstars.com/`},{id:`exile`,title:`What's Beneath the Chicken Coop`,artist:`Trevor Sensor`,album:`On Account of Exile, Vol. 2`,cover:`https://data.wearedogs.net/img/covers/2026/exile.webp`,altCover:`https://data.wearedogs.net/img/covers/2026/exile.png`,src:`https://data.wearedogs.net/music/2026/exile.mp3`,instrumental:``,dateAdded:`2026-07-23T00:52:43-05:00`,year:2021,genre:`Indie Rock`,attrib:`https://trevorsensorofficial.com/`}];function Ut(e){return e.src?e.src.split(`/`).pop():``}function Wt(e){if(!e.dateAdded)return`Summer`;let t=new Date(e.dateAdded).getMonth();return t===11||t===0||t===1?`Winter`:t>=2&&t<=4?`Spring`:t>=5&&t<=7?`Summer`:`Fall`}let U=E(()=>{let e=[...H];return S(I)===`artist`?e.sort((e,t)=>e.artist.localeCompare(t.artist)):S(I)===`album`?e.sort((e,t)=>e.album.localeCompare(t.album)):S(I)===`year`?e.sort((e,t)=>(e.year||0)-(t.year||0)):S(I)===`filename`?e.sort((e,t)=>Ut(e).localeCompare(Ut(t))):S(I)===`genre`?e.sort((e,t)=>(e.genre||``).localeCompare(t.genre||``)):S(I)===`season`&&e.sort((e,t)=>Wt(e).localeCompare(Wt(t))),e}),W=E(()=>H[P.currentTrackIndex]),Gt=k(0),Kt=k(0),qt=k(0),Jt=k(0),Yt=k(0),Xt=k(0),Zt=k(null),G=null;function Qt(e,t){e.stopPropagation();let n=`${window.location.origin}/music/${t.id}`;navigator.clipboard.writeText(n).then(()=>{T(Zt,t.id,!0),G&&clearTimeout(G),G=setTimeout(()=>{T(Zt,null)},2e3)}).catch(e=>{console.error(`Failed to copy share link:`,e)})}s(()=>{G&&clearTimeout(G)}),p(()=>{if(P.init(H),Dt()){let e=H.findIndex(e=>e.id===Dt());e!==-1&&P.loadTrack(e,!0)}else if(!P.hasPickedRandomTrack){P.hasPickedRandomTrack=!0;let e=Math.floor(Math.random()*H.length);P.loadTrack(e,!1)}});let K=k(null);function $t(){let e=document.querySelector(`.track-row[data-track-id="${S(K)}"]`);e&&e.scrollIntoView({block:`nearest`,behavior:`smooth`})}function en(e){T(K,e.id,!0);let t=H.findIndex(t=>t.id===e.id);P.currentTrackIndex===t&&!P.fetchErrors[e.id]?P.togglePlay():P.loadTrack(t,!0)}function tn(){window.innerWidth<=640?T(L,!0):T(z,!S(z))}function nn(){let e=!P.isInstrumental;P.setCrossfade(e)||(Ee(J),S(un)||(T(un,!0),setTimeout(()=>{T(un,!1)},300)),S(J)===5?(yn(),T(dn,!0),setTimeout(()=>{T(dn,!1)},150)):S(J)===10?yn(35):S(J)>5&&S(J)<10?yn(8):S(J)>10&&Math.random()<.4&&yn(3))}function rn(e){return!e||isNaN(e)?`0:00`:`${Math.floor(e/60)}:${Math.floor(e%60).toString().padStart(2,`0`)}`}function an(e){let t=document.activeElement;if(!(t&&(t.tagName===`INPUT`||t.tagName===`TEXTAREA`||t.isContentEditable))){if(e.shiftKey){if(e.key===`ArrowRight`){e.preventDefault(),T(F,b[(b.findIndex(e=>e.id===S(F))+1)%b.length].id,!0);return}else if(e.key===`ArrowLeft`){e.preventDefault(),T(F,b[(b.findIndex(e=>e.id===S(F))-1+b.length)%b.length].id,!0);return}}if(e.code===`Space`||e.key===` `)S(F)===`songs`&&(e.preventDefault(),P.togglePlay());else if(e.key===`ArrowDown`){if(S(F)===`songs`&&S(U).length>0){e.preventDefault();let t=S(U).findIndex(e=>e.id===S(K));if(t===-1){let e=H[P.currentTrackIndex];t=S(U).findIndex(t=>t.id===e?.id)}let n=(t+1)%S(U).length;T(K,S(U)[n].id,!0),$t()}}else if(e.key===`ArrowUp`){if(S(F)===`songs`&&S(U).length>0){e.preventDefault();let t=S(U).findIndex(e=>e.id===S(K));if(t===-1){let e=H[P.currentTrackIndex];t=S(U).findIndex(t=>t.id===e?.id)}let n=(t-1+S(U).length)%S(U).length;T(K,S(U)[n].id,!0),$t()}}else if(e.key===`Enter`&&S(F)===`songs`&&S(K)){e.preventDefault();let t=S(U).find(e=>e.id===S(K));t&&en(t)}}}let on=0,sn=0;function cn(e){if(e.target&&(e.target.tagName===`INPUT`||e.target.closest(`button`)||e.target.closest(`.ctrl`))){on=0,sn=0;return}on=e.touches[0].clientX,sn=e.touches[0].clientY}function ln(e){if(on===0||!e.changedTouches||e.changedTouches.length===0)return;let t=e.changedTouches[0].clientX-on,n=e.changedTouches[0].clientY-sn;if(Math.abs(t)<=Math.abs(n)||Math.abs(t)<=60)return;let r=b.findIndex(e=>e.id===S(F));r!==-1&&(t<0&&r<b.length-1?T(F,b[r+1].id,!0):t>0&&r>0&&T(F,b[r-1].id,!0))}let q=k(null),J=k(0),un=k(!1),dn=k(!1),Y,X,Z,Q=[],$=[],fn,pn=k(!1);D(()=>(S(q)&&hn(),()=>{fn&&cancelAnimationFrame(fn),window.removeEventListener(`resize`,gn),Z&&(Z.dispose(),Z=null),Y=null,X=null,Q=[],$=[]})),D(()=>{if(P.currentTrackIndex,S(F),Et(),T(J,0),T(pn,!1),Y){for(let e of Q)Y.remove(e.mesh);for(let e of $)Y.remove(e.mesh)}Q=[],$=[]});function mn(){let e=document.querySelector(`.dj-fader-knob`);if(!e)return{x:window.innerWidth/2,y:window.innerHeight/2};let t=e.getBoundingClientRect();return{x:t.left+t.width/2,y:window.innerHeight-(t.top+t.height/2)}}function hn(){if(!S(q))return;let e=window.innerWidth,t=window.innerHeight;S(q).width=e,S(q).height=t,Y=new ne,X=new oe(0,e,t,0,-1,1),Z=new Se({canvas:S(q),alpha:!0,antialias:!0}),Z.setSize(e,t,!1),Z.setPixelRatio(Math.min(window.devicePixelRatio,2)),window.addEventListener(`resize`,gn),_n()}function gn(){if(!S(q)||!Z||!X)return;let e=window.innerWidth,t=window.innerHeight;S(q).width=e,S(q).height=t,Z.setSize(e,t,!1),X.right=e,X.top=t,X.updateProjectionMatrix()}function _n(){if(fn=requestAnimationFrame(_n),!(!Y||!X||!Z||!S(q))){if(S(J)>=10&&(T(pn,!0),Math.random()<.22)){let e=mn();vn(e.x,e.y)}for(let e=Q.length-1;e>=0;e--){let t=Q[e];t.x+=t.vx,t.y+=t.vy,t.vy+=t.ay,t.life-=t.decay,t.mesh.position.set(t.x,t.y,0),t.mesh.material.opacity=t.life,t.life<=0&&(Y.remove(t.mesh),t.mesh.geometry.dispose(),t.mesh.material.dispose(),Q.splice(e,1))}for(let e=$.length-1;e>=0;e--){let t=$[e];t.x+=t.vx,t.y+=t.vy,t.life-=t.decay;let n=t.startScale+(1-t.life)*88;t.mesh.scale.set(n,n,1),t.mesh.position.set(t.x,t.y,0),t.mesh.material.opacity=t.life*.16,t.life<=0&&(Y.remove(t.mesh),t.mesh.geometry.dispose(),t.mesh.material.dispose(),$.splice(e,1))}Z.render(Y,X)}}function vn(t,n){if(!Y)return;let r=new y(5,8),a=.85+Math.random()*.12,o=new e(r,new Ce({color:new i(a,a,a*1.01),transparent:!0,opacity:.06,blending:1}));o.position.set(t,n,0),Y.add(o),$.push({mesh:o,x:t,y:n,vx:(Math.random()-.5)*.55+Math.sin(Date.now()*.001)*.22,vy:Math.random()*.7+1.25,startScale:1,life:1,decay:6e-4+Math.random()*4e-4})}function yn(t=25){if(!Y||!S(q))return;let n=mn(),r=n.x,a=n.y;for(let n=0;n<t;n++){let t=new e(new y(1.3,4),new Ce({color:new i(Math.random()<.4?16711765:16755200),transparent:!0,opacity:1,blending:2}));t.position.set(r,a,0),Y.add(t);let n=Math.random()*Math.PI*2,o=Math.random()*4+2;Q.push({mesh:t,x:r,y:a,vx:Math.cos(n)*o,vy:Math.sin(n)*o,ay:-.15,life:1,decay:.02+Math.random()*.02})}}var bn=Ct();Ae(`keydown`,C,an),Ae(`popstate`,C,Vt),Ae(`click`,C,Ht);var xn=O(bn);let Sn;var Cn=O(xn),wn=O(Cn),Tn=O(wn);Ve(O(Tn),{size:`panel`}),M(Tn);var En=w(Tn,2);En.textContent=`MUSIC`,M(wn);var Dn=w(wn,2);Me(O(Dn),{size:20}),M(Dn),M(Cn);var On=w(Cn,2);Ue(On,{get tabs(){return b},get activeTab(){return S(F)},set activeTab(e){T(F,e,!0)}});var kn=w(On,2),An=O(kn),jn=e=>{var t=ft(),r=O(t);let i;var s=O(r);let c;var d=O(s),f=O(d),p=e=>{var t=Ye(),r=O(t);xe(r,e=>T(Pt,e),()=>S(Pt));var i=w(r,2),a=e=>{n(e,Je())};v(i,e=>{!P.isPlaying&&!S(Ft)&&e(a)});var o=w(i,2);De(O(o),{size:16,class:`text-white/70`}),M(o),M(t),g(`click`,t,()=>{T(Nt,!0)}),n(e,t)},ne=e=>{var t=Xe();De(O(t),{size:16,class:`text-white/20`}),M(t),n(e,t)},re=e=>{var t=fe(),r=je(t),i=e=>{var t=Ze(),r=O(t);let i;var o=w(O(r),8),s=O(o);let c;M(o),a(2),M(r);var l=w(r,2);let u;M(t),A(()=>{i=x(r,1,`vinyl-record svelte-1o4jdf5`,null,i,{spinning:S(R)}),j(s,`src`,P.fetchErrors[S(W).id]||!S(W).cover?wt:S(W).cover),j(s,`alt`,S(W).album),c=x(s,1,`record-art svelte-1o4jdf5`,null,c,{loaded:S(kt)}),u=x(l,1,`tonearm svelte-1o4jdf5`,null,u,{playing:S(R)})}),g(`click`,t,tn),Ae(`load`,s,()=>T(kt,!0)),Ae(`error`,s,Tt),ee(s),n(e,t)},o=e=>{let t=E(()=>P.duration>0?(1-P.currentTime/P.duration)*.45+.25:.48),r=E(()=>P.duration>0?P.currentTime/P.duration*.45+.25:.48);var i=Qe(),o=O(i),s=O(o),c=O(s),l=O(c,!0);M(c),a(2),M(s);var u=w(s,2),d=O(u);let f;var p=w(d,2);let m;var h=w(p,2);let ee;var te=w(h,2);let ne;M(u),M(o),M(i),A(()=>{N(l,S(W).title),f=x(d,1,`spindle-left bg-zinc-900 svelte-1o4jdf5`,null,f,{spinning:S(R)}),m=x(p,1,`tape-roll-left bg-amber-950/70 svelte-1o4jdf5`,null,m,{spinning:S(R)}),Ie(p,`width: ${S(t)*46}px; height: ${S(t)*46}px;`),ee=x(h,1,`spindle-right bg-zinc-900 svelte-1o4jdf5`,null,ee,{spinning:S(R)}),ne=x(te,1,`tape-roll-right bg-amber-950/70 svelte-1o4jdf5`,null,ne,{spinning:S(R)}),Ie(te,`width: ${S(r)*46}px; height: ${S(r)*46}px;`)}),g(`click`,i,tn),n(e,i)},s=e=>{var t=$e(),r=O(t),i=w(O(r),4),a=w(O(i),4),o=O(a),s=O(o,!0);M(o);var c=w(o,2),l=O(c,!0);M(c),M(a),M(i);var u=w(i,2),d=O(u);let f;var p=w(d,2),m=O(p);let h;M(p),M(u);var ee=w(u,2);let te;M(r),M(t),A(()=>{N(s,S(W).title),N(l,S(W).artist||`WEAREDOGS`),f=x(d,1,`floppy-shutter-slider bg-zinc-400 svelte-1o4jdf5`,null,f,{open:S(R)}),h=x(m,1,`floppy-magnetic-disc bg-zinc-900 svelte-1o4jdf5`,null,h,{spinning:S(R)}),te=x(ee,1,`floppy-drive-led svelte-1o4jdf5`,null,te,{active:S(R)})}),g(`click`,t,tn),n(e,t)},c=e=>{var t=tt(),r=O(t),i=O(r);let a;var o=w(i,2),s=O(o),c=O(s);let l;var u=w(c,2);let d;M(s);var f=w(s,2),p=O(f);let m;M(f);var h=w(f,2);we(h,20,()=>Array(10),ae,(e,t,r)=>{var i=et();let a;A(e=>a=x(i,1,`comb-tooth svelte-1o4jdf5`,null,a,e),[()=>({vibrating:S(R)&&r%3==Math.floor(P.currentTime*4)%3})]),n(e,i)}),M(h),M(o),M(r),M(t),A(()=>{a=x(i,1,`music-box-key svelte-1o4jdf5`,null,a,{spinning:S(R)}),l=x(c,1,`music-box-gear gear-1 svelte-1o4jdf5`,null,l,{spinning:S(R)}),d=x(u,1,`music-box-gear gear-2 svelte-1o4jdf5`,null,d,{spinning:S(R)}),m=x(p,1,`music-box-drum bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 svelte-1o4jdf5`,null,m,{spinning:S(R)})}),g(`click`,t,tn),n(e,t)};v(r,e=>{He.musicDeckModel===`vinyl`?e(i):He.musicDeckModel===`cassette`?e(o,1):He.musicDeckModel===`floppy`?e(s,2):He.musicDeckModel===`musicbox`&&e(c,3)}),n(e,t)};v(f,e=>{S(z)&&!S(Nt)?e(p):S(z)&&S(Nt)?e(ne,1):e(re,-1)}),M(d);var oe=w(d,2),se=O(oe),y=O(se),le=O(y),b=e=>{he(e,{size:12,class:`text-[#22c55e]`})},me=e=>{o(e,{size:12})};v(le,e=>{S(Zt)===S(W).id?e(b):e(me,-1)}),M(y),M(se);var C=w(se,2);let Se;var Ce=O(C);let Te;var Ee=O(Ce,!0);M(Ce),M(C);var D=w(C,2);let k;var ke=O(D);let Me;var Pe=O(ke,!0);M(ke),M(D);var Fe=w(D,2);let Le;var Be=O(Fe);let Ve;var Ue=O(Be,!0);M(Be),M(Fe),M(oe),M(s);var We=w(s,2),Ke=O(We),qe=O(Ke),pt=O(qe,!0);M(qe);var mt=w(qe,2),ht=O(mt);we(ht,21,()=>S(zt),ae,(e,t,r)=>{let i=E(()=>P.duration>0?P.currentTime/P.duration:0),a=E(()=>r/60);var o=nt();let s;A(()=>{s=x(o,1,`waveform-bar transition-colors duration-100 rounded-full svelte-1o4jdf5`,null,s,{active:S(a)<=S(i)}),Ie(o,`height: ${S(t)??``}%; width: 3px;`)}),n(e,o)}),M(ht);var gt=w(ht,2);ge(gt),M(mt);var _t=w(mt,2),vt=O(_t,!0);M(_t),M(Ke);var yt=w(Ke,2),bt=O(yt);let xt;ue(O(bt),{size:15}),M(bt);var St=w(bt,2);ze(O(St),{size:19}),M(St);var Ct=w(St,2);let Et;var Dt=O(Ct),F=e=>{Ne(e,{size:22})},Ot=e=>{n(e,rt())},B=e=>{l(e,{size:22,fill:`currentColor`})},V=e=>{de(e,{size:22,fill:`currentColor`})};v(Dt,e=>{P.fetchErrors[S(W).id]?e(F):P.isLoading?e(Ot,1):P.isPlaying?e(B,2):e(V,-1)}),M(Ct);var Lt=w(Ct,2);ye(O(Lt),{size:19}),M(Lt);var Rt=w(Lt,2);let Bt;var Vt=O(Rt),Ht=e=>{ie(e,{size:15})},Ut=e=>{m(e,{size:15})};v(Vt,e=>{P.repeatMode===2?e(Ht):e(Ut,-1)}),M(Rt),M(yt);var Wt=w(yt,2),G=O(Wt);let $t;var an=O(G);let on;ce(O(an),{size:12}),a(2),M(an);var sn=w(an,2),cn=O(sn);let ln;M(sn);var q=w(sn,2);let Y;_e(O(q),{size:12}),a(2),M(q),M(G),M(Wt);var X=w(Wt,2),Z=O(X),Q=e=>{var t=it(),r=O(t),i=O(r),a=e=>{h(e,{size:12,class:`text-red-400`})},o=e=>{pe(e,{size:12})};v(i,e=>{P.isMuted||P.volume===0?e(a):e(o,-1)}),M(r);var s=w(r,2);ge(s);var c=w(s,2),l=O(c);M(c),M(t),xe(t,e=>T(jt,e),()=>S(jt)),A(e=>{ve(s,P.volume),N(l,`${e??``}%`)},[()=>Math.round(P.volume*100)]),g(`click`,r,()=>P.toggleMute()),g(`input`,s,e=>P.setVolume(parseFloat(e.target.value))),n(e,t)};v(Z,e=>{S(At)&&e(Q)});var $=w(Z,2),fn=O($);let pn;te(O(fn),{size:13}),M(fn);var mn=w(fn,2),hn=O(mn,!0);M(mn),M($);var gn=w($,2),_n=O(gn),vn=O(_n),yn=e=>{h(e,{size:13,class:`text-red-400`})},bn=e=>{pe(e,{size:13})};v(vn,e=>{P.isMuted||P.volume===0?e(yn):e(bn,-1)}),M(_n),M(gn),M(X),M(We),M(r);var xn=w(r,2);let Sn;var Cn=O(xn),wn=w(O(Cn),2);M(Cn);var Tn=w(Cn,2),En=O(Tn),Dn=O(En);be(Dn,{size:13});var On=w(Dn,3),kn=O(On,!0);M(On),M(En);var An=w(En,2),jn=w(O(An),2),Mn=O(jn);Mn.value=Mn.__value=`default`;var Nn=w(Mn);Nn.value=Nn.__value=`artist`;var Pn=w(Nn);Pn.value=Pn.__value=`album`;var Fn=w(Pn);Fn.value=Fn.__value=`year`;var In=w(Fn);In.value=In.__value=`filename`;var Ln=w(In);Ln.value=Ln.__value=`genre`;var Rn=w(Ln);Rn.value=Rn.__value=`season`,M(jn),M(An),M(Tn);var zn=w(Tn,2);we(zn,21,()=>S(U),ae,(e,t,r)=>{var i=dt();let s;var c=O(i),l=O(c),u=e=>{n(e,at())},d=e=>{var t=ot();t.textContent=r+1,n(e,t)};v(l,e=>{H[P.currentTrackIndex].id===S(t).id&&P.isPlaying?e(u):e(d,-1)}),M(c);var f=w(c,2),p=w(f,2),m=O(p),h=O(m);let te;var ne=O(h,!0);M(h);var re=w(h,2),ie=e=>{var t=st();Ne(O(t),{size:10}),a(),M(t),n(e,t)};v(re,e=>{P.fetchErrors[S(t).id]&&e(ie)}),M(m);var ae=w(m,2),_=O(ae);M(ae),M(p);var oe=w(p,2),se=O(oe),ce=e=>{var r=ut(),i=O(r),a=e=>{var t=ct();g(`click`,t,e=>{e.stopPropagation(),T(It,!0)}),n(e,t)},o=e=>{var r=lt();A(()=>j(r,`href`,S(t).attrib)),g(`click`,r,e=>e.stopPropagation()),n(e,r)};v(i,e=>{S(t).id===`arigato`?e(a):e(o,-1)}),M(r),n(e,r)};v(se,e=>{S(t).attrib&&e(ce)});var y=w(se,2),le=O(y),ue=e=>{he(e,{size:12,class:`text-[#22c55e]`})},b=e=>{o(e,{size:12})};v(le,e=>{S(Zt)===S(t).id?e(ue):e(b,-1)}),M(y),M(oe),M(i),A(()=>{s=x(i,1,`track-row svelte-1o4jdf5`,null,s,{active:H[P.currentTrackIndex].id===S(t).id,"kb-focused":S(K)===S(t).id,"fetch-error":P.fetchErrors[S(t).id]}),j(i,`data-track-id`,S(t).id),j(f,`src`,P.fetchErrors[S(t).id]||!S(t).cover?wt:S(t).cover),j(f,`alt`,S(t).album),te=x(h,1,`tr-title svelte-1o4jdf5`,null,te,{"line-through":P.fetchErrors[S(t).id],"opacity-50":P.fetchErrors[S(t).id]}),N(ne,S(t).title),N(_,`${S(t).artist??``} · ${S(t).album??``} (${(S(t).year||``)??``})`)}),g(`click`,i,()=>en(S(t))),Ae(`error`,f,Tt),ee(f),g(`click`,y,e=>Qt(e,S(t))),n(e,i)}),M(zn),M(xn),M(t),A((e,t)=>{i=x(r,1,`player-side svelte-1o4jdf5`,null,i,{"tracklist-open":S(L)}),c=x(s,1,`player-top-block transition-all duration-300 ease-in-out svelte-1o4jdf5`,null,c,{"opacity-0":S(L),"scale-95":S(L),"pointer-events-none":S(L)}),Se=x(C,1,`scroll-container svelte-1o4jdf5`,null,Se,{overflowing:S(Kt)>S(Gt)}),Ie(C,`--scroll-dist: -${S(Kt)-S(Gt)}px`),Te=x(Ce,1,`track-title scroll-text svelte-1o4jdf5`,null,Te,{"animate-scroll":S(Kt)>S(Gt)}),N(Ee,S(W).title),k=x(D,1,`scroll-container svelte-1o4jdf5`,null,k,{overflowing:S(Jt)>S(qt)}),Ie(D,`--scroll-dist: -${S(Jt)-S(qt)}px`),Me=x(ke,1,`track-artist scroll-text svelte-1o4jdf5`,null,Me,{"animate-scroll":S(Jt)>S(qt)}),N(Pe,S(W).artist),Le=x(Fe,1,`scroll-container svelte-1o4jdf5`,null,Le,{overflowing:S(Xt)>S(Yt)}),Ie(Fe,`--scroll-dist: -${S(Xt)-S(Yt)}px`),Ve=x(Be,1,`track-album scroll-text svelte-1o4jdf5`,null,Ve,{"animate-scroll":S(Xt)>S(Yt)}),N(Ue,S(W).album),N(pt,e),j(gt,`max`,P.duration||100),ve(gt,P.currentTime),N(vt,t),xt=x(bt,1,`ctrl ctrl-sm svelte-1o4jdf5`,null,xt,{"active-ctrl":P.isShuffled}),Et=x(Ct,1,`ctrl ctrl-play svelte-1o4jdf5`,null,Et,{"ctrl-error":P.fetchErrors[S(W).id]}),j(Ct,`aria-label`,P.isPlaying?`Pause`:`Play`),Bt=x(Rt,1,`ctrl ctrl-sm svelte-1o4jdf5`,null,Bt,{"active-ctrl":P.repeatMode>0}),$t=x(G,1,`dj-crossfader svelte-1o4jdf5`,null,$t,{"fader-flash":S(dn),"fader-fried":S(J)>=10}),on=x(an,1,`fader-label left-label flex items-center gap-1 svelte-1o4jdf5`,null,on,{active:!P.isInstrumental}),ln=x(cn,1,`dj-fader-knob svelte-1o4jdf5`,null,ln,{right:P.isInstrumental,"knob-jiggle":S(un),fried:S(J)>=10}),Y=x(q,1,`fader-label right-label flex items-center gap-1 svelte-1o4jdf5`,null,Y,{active:P.isInstrumental}),pn=x(fn,1,`ctrl ctrl-xs svelte-1o4jdf5`,null,pn,{"active-ctrl":S(z)}),x(mn,1,`w-[90px] h-[20px] flex items-center justify-center rounded text-[9px] font-bold transition-all font-mono uppercase tracking-wider select-none cursor-pointer
                      ${S(z)?`bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/25 active:scale-95`:`bg-transparent border border-white/5 text-white/20 hover:text-white/40 hover:border-white/10`}`,`svelte-1o4jdf5`),j(mn,`title`,S(z)?`Click to cycle presets`:`Click to enable visualizer`),N(hn,Ge[S(Mt)].name),Sn=x(xn,1,`tracklist-side svelte-1o4jdf5`,null,Sn,{"show-mobile":S(L)}),N(kn,H.length)},[()=>rn(P.currentTime),()=>rn(P.duration)]),g(`click`,y,e=>Qt(e,S(W))),Oe(Ce,`clientWidth`,e=>T(Kt,e)),Oe(C,`clientWidth`,e=>T(Gt,e)),Oe(ke,`clientWidth`,e=>T(Jt,e)),Oe(D,`clientWidth`,e=>T(qt,e)),Oe(Be,`clientWidth`,e=>T(Xt,e)),Oe(Fe,`clientWidth`,e=>T(Yt,e)),g(`input`,gt,e=>{P.seek(parseFloat(e.target.value))}),g(`change`,gt,e=>{P.isPlaying||P.play(parseFloat(e.target.value))}),g(`click`,bt,()=>P.setShuffle(!P.isShuffled)),g(`click`,St,()=>P.prevTrack()),g(`click`,Ct,()=>P.togglePlay()),g(`click`,Lt,()=>P.nextTrack()),g(`click`,Rt,()=>{P.repeatMode=(P.repeatMode+1)%3}),g(`click`,G,nn),g(`click`,fn,()=>{T(z,!S(z))}),g(`click`,mn,()=>{S(z)?T(Mt,(S(Mt)+1)%Ge.length):T(z,!0)}),g(`click`,_n,()=>{T(At,!S(At))}),g(`click`,wn,()=>{T(L,!1)}),Re(jn,()=>S(I),e=>T(I,e)),_(1,t,()=>u,()=>({duration:120,delay:120})),_(2,t,()=>u,()=>({duration:120})),n(e,t)},Mn=e=>{var t=pt(),r=w(O(t),2),i=O(r);ce(i,{size:36});var o=w(i,6),s=w(O(o),2);f(O(s),{size:15}),a(),M(s),M(o),M(r),a(2),M(t),_(1,t,()=>u,()=>({duration:120,delay:120})),_(2,t,()=>u,()=>({duration:120})),n(e,t)},Nn=e=>{var t=ht(),r=w(O(t),2),i=w(O(r),4);me(w(O(i)),{size:15}),M(i),M(r);var o=w(r,2);we(o,20,()=>[{name:`Apple Music`,color:`#fc3c44`,icon:`🎵`},{name:`YouTube Music`,color:`#ff0000`,icon:`▶`},{name:`Amazon Music`,color:`#00a8e0`,icon:`♪`},{name:`Tidal`,color:`#00d4f5`,icon:`〰`}],ae,(e,t)=>{var r=mt(),i=O(r),a=O(i,!0);M(i);var o=w(i),s=O(o,!0);M(o),se(w(o),{size:11}),M(r),A(()=>{Ie(r,`--sc:${t.color??``}`),N(a,t.icon),N(s,t.name)}),n(e,r)}),M(o),a(2),M(t),_(1,t,()=>u,()=>({duration:120,delay:120})),_(2,t,()=>u,()=>({duration:120})),n(e,t)},Pn=e=>{var t=gt();_(1,t,()=>u,()=>({duration:120,delay:120})),_(2,t,()=>u,()=>({duration:120})),n(e,t)},Fn=e=>{var t=vt(),r=O(t),i=e=>{let t=E(()=>S(Ot));var r=fe();Te(je(r),()=>S(t),(e,t)=>{t(e,{get audioCore(){return P}})}),n(e,r)},a=e=>{n(e,_t())};v(r,e=>{S(Ot)?e(i):e(a,-1)}),M(t),_(1,t,()=>u,()=>({duration:120,delay:120})),_(2,t,()=>u,()=>({duration:120})),n(e,t)};v(An,e=>{S(F)===`songs`?e(jn):S(F)===`samples`?e(Mn,1):S(F)===`playlists`?e(Nn,2):S(F)===`radio`?e(Pn,3):S(F)===`battle`&&e(Fn,4)}),M(kn),a(2),M(xn);var In=w(xn,2),Ln=e=>{var t=xt(),r=O(t);xe(r,e=>T(Pt,e),()=>S(Pt));var i=w(r,2),a=e=>{n(e,yt())};v(i,e=>{!P.isPlaying&&!S(Ft)&&e(a)});var o=w(i,2),s=O(o);we(s,21,()=>Ge,ae,(e,t,r)=>{var i=bt(),a=O(i,!0);M(i),A(()=>{x(i,1,`px-2 py-1 rounded text-[9px] font-bold transition-all uppercase tracking-wider font-mono
                ${S(Mt)===r?`bg-purple-600 text-white`:`text-white/40 hover:text-white/80`}`,`svelte-1o4jdf5`),N(a,S(t).name)}),g(`click`,i,()=>T(Mt,r,!0)),n(e,i)}),M(s),M(o),M(t),g(`click`,t,e=>{e.stopPropagation(),T(Nt,!1)}),g(`click`,o,e=>e.stopPropagation()),n(e,t)};v(In,e=>{S(z)&&S(Nt)&&e(Ln)});var Rn=w(In,2);xe(Rn,e=>T(q,e),()=>S(q));var zn=w(Rn,2),Bn=e=>{var r=St(),i=O(r),o=O(i),s=w(O(o),2);Me(O(s),{size:16}),M(s),M(o);var c=w(o,2),l=O(c),d=O(l);se(O(d),{size:14}),a(),M(d),M(l);var f=w(l,2);t(f,()=>Rt(S(Lt).intro),!0),M(f);var p=w(f,2),m=O(p);t(m,()=>Rt(S(Lt).tos),!0),M(m),M(p);var h=w(p,2);t(h,()=>Rt(S(Lt).outro),!0),M(h),M(c),M(i),M(r),g(`click`,r,()=>T(It,!1)),g(`click`,i,e=>e.stopPropagation()),g(`click`,s,()=>T(It,!1)),_(3,r,()=>u,()=>({duration:150})),n(e,r)};v(zn,e=>{S(It)&&e(Bn)}),M(bn),A(()=>Sn=x(xn,1,`mp-container svelte-1o4jdf5`,null,Sn,{closing:Et(),"theme-inst":P.isInstrumental})),g(`click`,bn,function(...e){d.onClose?.apply(this,e)}),g(`click`,xn,e=>e.stopPropagation()),g(`click`,Tn,()=>{P.isPlaying||window.dispatchEvent(new CustomEvent(`open-info-panel`))}),g(`click`,Dn,function(...e){d.onClose?.apply(this,e)}),g(`touchstart`,kn,cn,void 0,!0),g(`touchend`,kn,ln),n(c,bn),Le()}c([`click`,`touchstart`,`touchend`,`input`,`change`]);export{wt as default};