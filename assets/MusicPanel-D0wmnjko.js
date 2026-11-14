import{Aa as e,Ai as t,Bi as n,Bt as r,Ci as i,Cn as a,D as o,Da as s,Di as c,Ea as l,Fi as u,Gi as d,Gn as f,Gt as p,H as m,Hi as h,I as g,Ii as _,Ji as ee,K as te,Ki as v,L as ne,Mi as re,O as ie,Oa as y,Pi as b,Pr as ae,Qi as oe,Qr as se,Rt as ce,S as le,Si as x,Vi as ue,Xi as S,_a as C,ba as w,da as de,dn as fe,fa as T,ga as E,hi as D,ia as O,ji as pe,ka as k,kn as me,la as he,li as ge,ln as _e,lt as ve,mi as ye,nn as be,pr as xe,qi as Se,ra as A,rn as Ce,si as we,sr as Te,st as Ee,tt as De,ua as j,ui as M,ur as Oe,ut as ke,va as Ae,vi as je,wt as Me,yi as Ne,yn as Pe,zi as N,zt as Fe}from"./vendor-uRbubvIP.js";import{n as Ie,r as Le,t as P}from"./AudioCore.svelte-Cxx2P2IU.js";import{t as Re}from"./DogsLogo-ClhUQOrr.js";import{t as ze}from"./doubleTap-C15pvH0v.js";import{t as Be}from"./settingsManager.svelte-D_dxAvNl.js";var Ve=class{constructor(t,n){e(this,`canvas`,null),e(this,`gl`,null),e(this,`analyser`,null),e(this,`program`,null),e(this,`animationFrameId`,null),e(this,`startTime`,0),e(this,`vertexBuffer`,null),e(this,`audioTexture`,null),e(this,`uniforms`,{}),e(this,`frequencyBuffer`,null),this.canvas=t,this.analyser=n,this.frequencyBuffer=new Uint8Array(n?n.frequencyBinCount:128),this.gl=t.getContext(`webgl`)||t.getContext(`experimental-webgl`),this.gl||console.error(`WebGL not supported by this browser.`)}init(e){if(!this.gl)return;let t=this.gl;this.cleanupProgram();let n=this.compileShader(t.VERTEX_SHADER,`
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `),r=this.compileShader(t.FRAGMENT_SHADER,e);if(!n||!r)return;if(this.program=t.createProgram(),t.attachShader(this.program,n),t.attachShader(this.program,r),t.linkProgram(this.program),!t.getProgramParameter(this.program,t.LINK_STATUS)){console.error(`Shader program linking failed:`,t.getProgramInfoLog(this.program));return}t.useProgram(this.program);let i=new Float32Array([-1,-1,1,-1,-1,1,1,1]);this.vertexBuffer=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,this.vertexBuffer),t.bufferData(t.ARRAY_BUFFER,i,t.STATIC_DRAW);let a=t.getAttribLocation(this.program,`a_position`);t.enableVertexAttribArray(a),t.vertexAttribPointer(a,2,t.FLOAT,!1,0,0),this.audioTexture=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.audioTexture),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),this.uniforms={time:t.getUniformLocation(this.program,`u_time`),resolution:t.getUniformLocation(this.program,`u_resolution`),volume:t.getUniformLocation(this.program,`u_volume`),bass:t.getUniformLocation(this.program,`u_bass`),mid:t.getUniformLocation(this.program,`u_mid`),treble:t.getUniformLocation(this.program,`u_treble`),audioTexture:t.getUniformLocation(this.program,`u_audioTexture`)},this.startTime=performance.now(),this.resize()}setPreset(e){this.init(e)}compileShader(e,t){if(!this.gl)return null;let n=this.gl,r=n.createShader(e);return n.shaderSource(r,t),n.compileShader(r),n.getShaderParameter(r,n.COMPILE_STATUS)?r:(console.error(`Shader compilation error (${e===n.VERTEX_SHADER?`VERTEX`:`FRAGMENT`}):`,n.getShaderInfoLog(r)),n.deleteShader(r),null)}start(){this.stop();let e=()=>{this.renderFrame(),this.animationFrameId=requestAnimationFrame(e)};this.animationFrameId=requestAnimationFrame(e)}stop(){this.animationFrameId&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null)}resize(){if(!this.gl||!this.canvas)return;let e=this.gl,t=this.canvas.clientWidth,n=this.canvas.clientHeight;(this.canvas.width!==t||this.canvas.height!==n)&&(this.canvas.width=t,this.canvas.height=n,e.viewport(0,0,t,n))}renderFrame(){if(!this.gl||!this.program)return;let e=this.gl;this.resize(),e.useProgram(this.program),e.bindBuffer(e.ARRAY_BUFFER,this.vertexBuffer);let t=(performance.now()-this.startTime)/1e3,n=0,r=0,i=0,a=0;if(this.analyser){this.analyser.getByteFrequencyData(this.frequencyBuffer);let t=this.frequencyBuffer.length,o=0,s=0,c=0;for(let e=0;e<t;e++){let t=this.frequencyBuffer[e];n+=t,e<12?(r+=t,o++):e<64?(i+=t,s++):(a+=t,c++)}n=n/t/255,r=o>0?r/o/255:0,i=s>0?i/s/255:0,a=c>0?a/c/255:0,e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.audioTexture),e.texImage2D(e.TEXTURE_2D,0,e.LUMINANCE,t,1,0,e.LUMINANCE,e.UNSIGNED_BYTE,this.frequencyBuffer)}e.uniform1f(this.uniforms.time,t),e.uniform2f(this.uniforms.resolution,this.canvas.width,this.canvas.height),e.uniform1f(this.uniforms.volume,n),e.uniform1f(this.uniforms.bass,r),e.uniform1f(this.uniforms.mid,i),e.uniform1f(this.uniforms.treble,a),e.uniform1i(this.uniforms.audioTexture,0),e.drawArrays(e.TRIANGLE_STRIP,0,4)}cleanupProgram(){this.gl&&this.program&&(this.gl.deleteProgram(this.program),this.program=null)}destroy(){this.stop();let e=this.gl;e&&(this.cleanupProgram(),this.vertexBuffer&&(e.deleteBuffer(this.vertexBuffer),this.vertexBuffer=null),this.audioTexture&&(e.deleteTexture(this.audioTexture),this.audioTexture=null)),this.canvas=null,this.gl=null,this.analyser=null}},He=[{id:`kaleidosync`,name:`Kaleidosync`,fragmentShader:`
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
    `}],Ue={id:`no-signal`,name:`No Signal`,fragmentShader:`
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
  `},We=`I understand the creator of this sick beat Nxnja has a copyright notice on his music distribution website.\r
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
`,Ge=h(`<div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 animate-pulse svelte-1o4jdf5"><div class="bg-black/75 border border-red-500/30 px-3 py-1.5 rounded text-[10px] font-mono tracking-widest text-red-500 font-bold uppercase shadow-[0_0_15px_rgba(239,68,68,0.25)] select-none svelte-1o4jdf5">NO SIGNAL</div></div>`),Ke=h(`<div class="visualizer-container cursor-pointer svelte-1o4jdf5"><canvas class="visualizer-canvas svelte-1o4jdf5"></canvas> <!> <div class="visualizer-hover-overlay svelte-1o4jdf5"><!></div></div>`),qe=h(`<div class="visualizer-container bg-[#050508]/40 border border-white/5 flex items-center justify-center svelte-1o4jdf5"><!></div>`),Je=h(`<div class="vinyl-record-clicker cursor-pointer w-full h-full svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div><div class="groove g1 svelte-1o4jdf5"></div> <div class="groove g2 svelte-1o4jdf5"></div> <div class="groove g3 svelte-1o4jdf5"></div> <div class="groove g4 svelte-1o4jdf5"></div> <div class="record-label svelte-1o4jdf5"><img loading="lazy"/></div> <div class="spindle svelte-1o4jdf5"></div></div> <div></div></div>`),Ye=h(`<div class="cassette-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="cassette-tape svelte-1o4jdf5"><div class="cassette-label bg-gradient-to-r from-purple-800 to-pink-700 svelte-1o4jdf5"><span class="cassette-track-title svelte-1o4jdf5"> </span> <span class="cassette-brand svelte-1o4jdf5">WEAREDOGS AUDIO</span></div> <div class="cassette-window bg-zinc-950/80 svelte-1o4jdf5"><div></div> <div></div> <div></div> <div></div></div></div></div>`),Xe=h(`<div class="floppy-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="floppy-disk svelte-1o4jdf5"><div class="floppy-corner svelte-1o4jdf5"></div> <div class="floppy-write-protect svelte-1o4jdf5"></div> <div class="floppy-label bg-slate-100 text-slate-900 svelte-1o4jdf5"><div class="floppy-label-stripe bg-red-600 svelte-1o4jdf5"></div> <div class="floppy-label-stripe-blue bg-blue-600 svelte-1o4jdf5"></div> <div class="floppy-label-content svelte-1o4jdf5"><div class="floppy-song truncate font-mono svelte-1o4jdf5"> </div> <div class="floppy-artist truncate font-mono svelte-1o4jdf5"> </div></div></div> <div class="floppy-shutter-door bg-zinc-700 svelte-1o4jdf5"><div></div> <div class="floppy-shutter-opening bg-zinc-950 svelte-1o4jdf5"><div></div></div></div> <div></div></div></div>`),Ze=h(`<div></div>`),Qe=h(`<div class="musicbox-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="music-box svelte-1o4jdf5"><div></div> <div class="music-box-interior border border-amber-900/40 svelte-1o4jdf5"><div class="music-box-gears svelte-1o4jdf5"><div></div> <div></div></div> <div class="music-box-drum-wrap svelte-1o4jdf5"><div><div class="music-box-pins svelte-1o4jdf5"><div class="pin pin-1 svelte-1o4jdf5"></div> <div class="pin pin-2 svelte-1o4jdf5"></div> <div class="pin pin-3 svelte-1o4jdf5"></div> <div class="pin pin-4 svelte-1o4jdf5"></div> <div class="pin pin-5 svelte-1o4jdf5"></div> <div class="pin pin-6 svelte-1o4jdf5"></div></div></div></div> <div class="music-box-comb svelte-1o4jdf5"></div></div></div></div>`),$e=h(`<button aria-label="Download track"><!></button>`),et=h(`<span></span>`),tt=h(`<div class="spin-ring svelte-1o4jdf5"></div>`),nt=h(`<div class="volume-popover svelte-1o4jdf5"><button class="ctrl ctrl-xs mr-2 border border-white/10 rounded-full p-1 hover:bg-white/10 svelte-1o4jdf5" aria-label="Mute"><!></button> <input type="range" class="vol-slider-pop svelte-1o4jdf5" min="0" max="1" step="0.01" aria-label="Volume"/> <span class="text-[10px] font-bold text-white/60 min-w-[28px] text-right font-mono select-none svelte-1o4jdf5"> </span></div>`),rt=h(`<div class="eq svelte-1o4jdf5"><div class="eq-b svelte-1o4jdf5"></div> <div class="eq-b svelte-1o4jdf5"></div> <div class="eq-b svelte-1o4jdf5"></div></div>`),it=h(`<span class="svelte-1o4jdf5"></span>`),at=h(`<span class="text-amber-400 flex items-center gap-1 text-[9px] font-bold tracking-wider uppercase bg-amber-500/10 px-1.5 py-0.5 rounded flex-shrink-0 svelte-1o4jdf5" title="Failed to fetch music source from remote database"><!> Error Fetching</span>`),ot=h(`<button class="cursor-pointer svelte-1o4jdf5" style="background: none; border: none; padding: 0; color: inherit; font: inherit;">i</button>`),st=h(`<a target="_blank" class="svelte-1o4jdf5">i</a>`),ct=h(`<span class="inst-chip-link svelte-1o4jdf5"><!></span>`),lt=h(`<div><div class="tr-num svelte-1o4jdf5"><!></div> <img loading="lazy" class="tr-art svelte-1o4jdf5"/> <div class="tr-info svelte-1o4jdf5"><div class="flex items-center gap-1.5 min-w-0 svelte-1o4jdf5"><span> </span> <!></div> <span class="tr-meta svelte-1o4jdf5"> </span></div> <div class="flex items-center gap-2 flex-shrink-0 svelte-1o4jdf5"><!>  <button class="tr-share-btn svelte-1o4jdf5" title="Copy track link" aria-label="Share track"><!></button> <!></div></div>`),ut=h(`<div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 animate-pulse svelte-1o4jdf5"><div class="bg-black/75 border border-red-500/30 px-4 py-2 rounded text-[12px] font-mono tracking-widest text-red-500 font-bold uppercase shadow-[0_0_20px_rgba(239,68,68,0.3)] select-none svelte-1o4jdf5">NO SIGNAL</div></div>`),dt=h(`<button> </button>`),ft=h(`<div class="visualizer-container fullscreen cursor-pointer svelte-1o4jdf5"><canvas class="visualizer-canvas svelte-1o4jdf5"></canvas> <!> <div class="visualizer-overlay svelte-1o4jdf5"><div class="flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-lg p-1 border border-white/10 svelte-1o4jdf5"></div></div></div>`),pt=h(`<div class="arigato-modal-backdrop svelte-1o4jdf5"><div class="arigato-modal-content svelte-1o4jdf5"><header class="arigato-modal-header svelte-1o4jdf5"><h2 class="svelte-1o4jdf5">ARIGATO INFO</h2> <button class="arigato-close-btn svelte-1o4jdf5"><!></button></header> <div class="arigato-modal-body scroll-y svelte-1o4jdf5"><div class="merch-link-container svelte-1o4jdf5"><a href="https://nxnjaa.beatstars.com/" target="_blank" rel="noopener noreferrer" class="merch-link-btn svelte-1o4jdf5"><!> NXNJA MERCH & MUSIC</a></div> <p class="intro-text svelte-1o4jdf5"></p> <div class="tos-box svelte-1o4jdf5"><div class="tos-microtext svelte-1o4jdf5"></div></div> <p class="outro-text svelte-1o4jdf5"></p></div></div></div>`),mt=h(`<div class="mp-backdrop svelte-1o4jdf5"><div><header class="panel-header svelte-1o4jdf5"><div class="brand svelte-1o4jdf5"><button class="logo-btn svelte-1o4jdf5" aria-label="Open DOGS Info"><!></button> <h1 class="svelte-1o4jdf5"></h1></div> <button class="close-btn svelte-1o4jdf5" aria-label="Close panel"><!></button></header> <div class="mp-body svelte-1o4jdf5"><div class="songs-layout svelte-1o4jdf5"><div><div><div><!></div>  <div class="track-info mt-2 svelte-1o4jdf5"><div class="flex items-center justify-center gap-1.5 mb-1.5 svelte-1o4jdf5"><button class="player-share-btn svelte-1o4jdf5" title="Copy track link" aria-label="Share track"><!></button> <!></div> <div><h2> </h2></div> <div><p> </p></div> <div><p> </p></div></div></div> <div class="player-controls-block svelte-1o4jdf5"><div class="progress-row svelte-1o4jdf5"><span class="ptime svelte-1o4jdf5"> </span> <div class="progress-wrap waveform-slider-wrap relative h-9 flex items-end svelte-1o4jdf5"><div class="waveform-bars flex items-end justify-between absolute inset-0 pointer-events-none px-1 h-full svelte-1o4jdf5"></div> <input type="range" class="seek-input absolute inset-0 opacity-0 cursor-pointer w-full h-full svelte-1o4jdf5" min="0" step="0.1" aria-label="Seek"/></div> <span class="ptime svelte-1o4jdf5"> </span></div> <div class="controls-row svelte-1o4jdf5"><button aria-label="Shuffle"><!></button> <button class="ctrl ctrl-md svelte-1o4jdf5" aria-label="Previous"><!></button> <button><!></button> <button class="ctrl ctrl-md svelte-1o4jdf5" aria-label="Next"><!></button> <button aria-label="Repeat"><!></button></div> <div class="w-full flex flex-col items-center gap-1.5 mt-2 px-1 svelte-1o4jdf5"><div><span><!> <span class="svelte-1o4jdf5">VOCAL</span></span> <div class="dj-fader-slot relative svelte-1o4jdf5"><div></div></div> <span><!> <span class="svelte-1o4jdf5">INST</span></span></div></div> <div class="relative flex justify-center items-center gap-3 mt-2 w-full svelte-1o4jdf5"><!> <div class="flex items-center gap-1.5 svelte-1o4jdf5"><button aria-label="Toggle Visualizer"><!></button> <button> </button></div> <div class="relative svelte-1o4jdf5"><button class="ctrl ctrl-xs vol-toggle-btn svelte-1o4jdf5" aria-label="Toggle volume slider"><!></button></div></div></div></div> <div><div class="mobile-close-bar hidden py-2 px-4 border-b border-white/5 flex items-center justify-between svelte-1o4jdf5"><span class="text-xs font-bold text-white/50 svelte-1o4jdf5">Track Library</span> <button class="px-3 py-1 bg-white/5 text-white/75 rounded-lg text-xs font-bold svelte-1o4jdf5">Back to player</button></div> <div class="tl-header flex justify-between items-center gap-3 svelte-1o4jdf5"><div class="flex items-center gap-2 svelte-1o4jdf5"><!><span class="svelte-1o4jdf5">TRACKS</span> <span class="tl-count svelte-1o4jdf5"> </span></div> <div class="flex items-center gap-1.5 ml-auto svelte-1o4jdf5"><span class="text-[9px] text-white/30 font-bold font-sans svelte-1o4jdf5">SORT BY:</span> <select class="bg-black/40 border border-white/10 rounded px-1.5 py-0.5 text-[10px] font-bold text-white/60 outline-none cursor-pointer hover:border-white/20 transition-all font-sans svelte-1o4jdf5"><option class="svelte-1o4jdf5">DEFAULT</option><option class="svelte-1o4jdf5">ARTIST</option><option class="svelte-1o4jdf5">ALBUM</option><option class="svelte-1o4jdf5">YEAR</option><option class="svelte-1o4jdf5">FILENAME</option><option class="svelte-1o4jdf5">GENRE</option><option class="svelte-1o4jdf5">SEASON</option></select></div></div> <div class="tracklist scroll-y svelte-1o4jdf5"></div></div></div></div> <footer class="mp-footer svelte-1o4jdf5"><div class="mp-status svelte-1o4jdf5"><span class="mp-dot svelte-1o4jdf5"></span><span class="svelte-1o4jdf5">🐕</span></div> <span class="svelte-1o4jdf5">MUSIC</span></footer></div> <!> <canvas class="fader-fx-canvas pointer-events-none svelte-1o4jdf5"></canvas> <!></div>`);function ht(e,d){s(d,!0);let h=`/img/error_cover.png`;function ht(e){e.target.src.endsWith(h)||(e.target.src=h)}let gt=we(d,`isClosing`,3,!1),_t=we(d,`initialTrackId`,3,null),vt=ze(()=>d.onClose()),F=C(`default`),I=C(!1),yt=C(!1),bt=C(!1),xt=C(null),St=w(()=>!!P.fetchErrors[P.library[P.currentTrackIndex]?.id]),L=w(()=>P.isPlaying&&!gt()&&!S(St)),R=C(!1),z=C(0),Ct=C(!1),B=C(null),V=null,H=!1,wt=C(!1),Tt=C(!1),Et=w(()=>{let e=We.split(/`{5,}/);return{intro:e[0]||``,tos:e[1]||``,outro:e[2]||``}});function Dt(e){if(!e)return``;let t=e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`);return t=t.replace(/(https?:\/\/[^\s]+)/g,`<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>`),t=t.replace(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/g,`<a href="mailto:$1">$1</a>`),t.replace(/\n/g,`<br>`)}let Ot=w(()=>{let e=S(G);if(!e)return Array(60).fill(10);if(P.waveformPeaks[e.id])return P.waveformPeaks[e.id];let t=e.id,n=[],r=0;for(let e=0;e<t.length;e++)r=(r<<5)-r+t.charCodeAt(e),r|=0;let i=Math.abs(r)%1e3;for(let e=0;e<60;e++){let t=e/59,r=Math.sin(i+t*Math.PI*4),a=Math.cos(i*1.5+t*Math.PI*10)*.4,o=Math.sin(i*2.3+t*Math.PI*22)*.15,s=Math.abs(r+a+o)/1.55,c=Math.sin(t*Math.PI),l=(s*70+15)*c;n.push(Math.max(10,Math.round(l)))}return n});O(()=>{window.innerWidth<=640&&S(R)&&S(z)===0&&oe(()=>S(I))&&E(I,!1)}),O(()=>{P.isPlaying&&E(wt,!0)});let kt=w(()=>!P.isPlaying&&!S(wt)?Ue.fragmentShader:He[S(z)].fragmentShader);O(()=>{let e=P.analyser;return S(R)&&S(B)&&!gt()&&(V=new Ve(S(B),e),V.init(S(kt)),V.start()),()=>{V&&(V.destroy(),V=null)}}),O(()=>{let e=S(kt);V&&S(R)&&(V.setPreset(e),V.start())}),O(()=>{S(I)?!history.state?.tracklistOpen&&!H&&(history.pushState({tracklistOpen:!0},``),H=!0):H&&(history.back(),H=!1)}),u(()=>{H&&(history.back(),H=!1)});function At(e){!e.state?.tracklistOpen&&S(I)&&(E(I,!1),H=!1)}function jt(e){S(bt)&&S(xt)&&!S(xt).contains(e.target)&&!e.target.closest(`.vol-toggle-btn`)&&E(bt,!1)}let U=w(()=>Ie.unlocked?Le:Le.filter(e=>e.public!==!1));function Mt(e){return e.src?e.src.split(`/`).pop():``}function Nt(e){if(!e.dateAdded)return`Summer`;let t=new Date(e.dateAdded).getMonth();return t===11||t===0||t===1?`Winter`:t>=2&&t<=4?`Spring`:t>=5&&t<=7?`Summer`:`Fall`}let W=w(()=>{let e=[...S(U)];return S(F)===`artist`?e.sort((e,t)=>e.artist.localeCompare(t.artist)):S(F)===`album`?e.sort((e,t)=>e.album.localeCompare(t.album)):S(F)===`year`?e.sort((e,t)=>(e.year||0)-(t.year||0)):S(F)===`filename`?e.sort((e,t)=>Mt(e).localeCompare(Mt(t))):S(F)===`genre`?e.sort((e,t)=>(e.genre||``).localeCompare(t.genre||``)):S(F)===`season`&&e.sort((e,t)=>Nt(e).localeCompare(Nt(t))),e}),G=w(()=>S(U)[P.currentTrackIndex]??S(U)[0]);O(()=>{let e=S(U);if(P.library===e||P.library.length===0)return;let t=P.library[P.currentTrackIndex]?.id;P.init(e);let n=e.findIndex(e=>e.id===t);n===-1?(P.pause(),P.loadTrack(0,!1)):P.currentTrackIndex=n});let Pt=C(0),Ft=C(0),It=C(0),Lt=C(0),Rt=C(0),zt=C(0),Bt=C(null),Vt=null;function Ht(e,t){e.stopPropagation();let n=`${window.location.origin}/music/${t.id}`;navigator.clipboard.writeText(n).then(()=>{E(Bt,t.id,!0),Vt&&clearTimeout(Vt),Vt=setTimeout(()=>{E(Bt,null)},2e3)}).catch(e=>{console.error(`Failed to copy share link:`,e)})}let Ut=C(null);async function Wt(e,t){e.stopPropagation();let n=t.instrumental||t.src;if(!(!n||S(Ut))){E(Ut,t.id,!0);try{let e=await fetch(n,Ie.fetchOptionsFor(n));if(!e.ok)throw Error(`Fetch failed with status ${e.status}`);let r=URL.createObjectURL(await e.blob()),i=document.createElement(`a`);i.href=r,i.download=decodeURIComponent(n.split(`/`).pop()||``)||`${t.id}.mp3`,document.body.appendChild(i),i.click(),i.remove(),setTimeout(()=>URL.revokeObjectURL(r),6e4)}catch(e){console.error(`Failed to download track:`,e)}finally{E(Ut,null)}}}u(()=>{Vt&&clearTimeout(Vt)}),_(()=>{if(Ie.revalidate(),P.init(S(U)),_t()){let e=S(U).findIndex(e=>e.id===_t());e!==-1&&P.loadTrack(e,!0)}else if(!P.hasPickedRandomTrack){P.hasPickedRandomTrack=!0;let e=Math.floor(Math.random()*S(U).length);P.loadTrack(e,!1)}});let K=C(null);function Gt(){let e=document.querySelector(`.track-row[data-track-id="${S(K)}"]`);e&&e.scrollIntoView({block:`nearest`,behavior:`smooth`})}function Kt(e){E(K,e.id,!0);let t=S(U).findIndex(t=>t.id===e.id);P.currentTrackIndex===t&&!P.fetchErrors[e.id]?P.togglePlay():P.loadTrack(t,!0)}function qt(){window.innerWidth<=640?E(I,!0):E(R,!S(R))}function Jt(e){window.innerWidth>640||e.target.closest(`.scroll-container`)&&E(I,!0)}function Yt(){let e=!P.isInstrumental;P.setCrossfade(e)||(Ae(J),S(Qt)||(E(Qt,!0),setTimeout(()=>{E(Qt,!1)},300)),S(J)===5?(ln(),E($t,!0),setTimeout(()=>{E($t,!1)},150)):S(J)===10?ln(35):S(J)>5&&S(J)<10?ln(8):S(J)>10&&Math.random()<.4&&ln(3))}function Xt(e){return!e||isNaN(e)?`0:00`:`${Math.floor(e/60)}:${Math.floor(e%60).toString().padStart(2,`0`)}`}function Zt(e){let t=document.activeElement;if(!(t&&(t.tagName===`INPUT`||t.tagName===`TEXTAREA`||t.isContentEditable))){if(e.code===`Space`||e.key===` `)e.preventDefault(),P.togglePlay();else if(e.key===`ArrowDown`){if(S(W).length>0){e.preventDefault();let t=S(W).findIndex(e=>e.id===S(K));if(t===-1){let e=S(U)[P.currentTrackIndex];t=S(W).findIndex(t=>t.id===e?.id)}let n=(t+1)%S(W).length;E(K,S(W)[n].id,!0),Gt()}}else if(e.key===`ArrowUp`){if(S(W).length>0){e.preventDefault();let t=S(W).findIndex(e=>e.id===S(K));if(t===-1){let e=S(U)[P.currentTrackIndex];t=S(W).findIndex(t=>t.id===e?.id)}let n=(t-1+S(W).length)%S(W).length;E(K,S(W)[n].id,!0),Gt()}}else if(e.key===`Enter`&&S(K)){e.preventDefault();let t=S(W).find(e=>e.id===S(K));t&&Kt(t)}}}let q=C(null),J=C(0),Qt=C(!1),$t=C(!1),Y,X,Z,Q=[],$=[],en,tn=C(!1);O(()=>(S(q)&&an(),()=>{en&&cancelAnimationFrame(en),window.removeEventListener(`resize`,on),window.visualViewport?.removeEventListener(`resize`,on),Z&&(Z.dispose(),Z=null),Y=null,X=null,Q=[],$=[]})),O(()=>{if(P.currentTrackIndex,gt(),E(J,0),E(tn,!1),Y){for(let e of Q)Y.remove(e.mesh);for(let e of $)Y.remove(e.mesh)}Q=[],$=[]});function nn(){if(!S(q))return{width:window.innerWidth,height:window.innerHeight};let e=S(q).getBoundingClientRect();return{width:e.width||window.innerWidth,height:e.height||window.innerHeight}}function rn(){let{width:e,height:t}=nn(),n=document.querySelector(`.dj-fader-knob`);if(!n)return{x:e/2,y:t/2};let r=S(q)?S(q).getBoundingClientRect():{left:0,top:0},i=n.getBoundingClientRect();return{x:i.left+i.width/2-r.left,y:t-(i.top+i.height/2-r.top)}}function an(){if(!S(q))return;let{width:e,height:t}=nn();S(q).width=e,S(q).height=t,Y=new te,X=new m(0,e,t,0,-1,1),Z=new le({canvas:S(q),alpha:!0,antialias:!0}),Z.setSize(e,t,!1),Z.setPixelRatio(Math.min(window.devicePixelRatio,2)),window.addEventListener(`resize`,on),window.visualViewport?.addEventListener(`resize`,on),sn()}function on(){if(!S(q)||!Z||!X)return;let{width:e,height:t}=nn();S(q).width=e,S(q).height=t,Z.setSize(e,t,!1),X.right=e,X.top=t,X.updateProjectionMatrix()}function sn(){if(en=requestAnimationFrame(sn),!(!Y||!X||!Z||!S(q))){if(S(J)>=10&&(E(tn,!0),Math.random()<.22)){let e=rn();cn(e.x,e.y)}for(let e=Q.length-1;e>=0;e--){let t=Q[e];t.x+=t.vx,t.y+=t.vy,t.vy+=t.ay,t.life-=t.decay,t.mesh.position.set(t.x,t.y,0),t.mesh.material.opacity=t.life,t.life<=0&&(Y.remove(t.mesh),t.mesh.geometry.dispose(),t.mesh.material.dispose(),Q.splice(e,1))}for(let e=$.length-1;e>=0;e--){let t=$[e];t.x+=t.vx,t.y+=t.vy,t.life-=t.decay;let n=t.startScale+(1-t.life)*88;t.mesh.scale.set(n,n,1),t.mesh.position.set(t.x,t.y,0),t.mesh.material.opacity=t.life*.16,t.life<=0&&(Y.remove(t.mesh),t.mesh.geometry.dispose(),t.mesh.material.dispose(),$.splice(e,1))}Z.render(Y,X)}}function cn(e,t){if(!Y)return;let n=new o(5,8),r=.85+Math.random()*.12,i=new g(n,new ne({color:new ie(r,r,r*1.01),transparent:!0,opacity:.06,blending:1}));i.position.set(e,t,0),Y.add(i),$.push({mesh:i,x:e,y:t,vx:(Math.random()-.5)*.55+Math.sin(Date.now()*.001)*.22,vy:Math.random()*.7+1.25,startScale:1,life:1,decay:6e-4+Math.random()*4e-4})}function ln(e=25){if(!Y||!S(q))return;let t=rn(),n=t.x,r=t.y;for(let t=0;t<e;t++){let e=new g(new o(1.3,4),new ne({color:new ie(Math.random()<.4?16711765:16755200),transparent:!0,opacity:1,blending:2}));e.position.set(n,r,0),Y.add(e);let t=Math.random()*Math.PI*2,i=Math.random()*4+2;Q.push({mesh:e,x:n,y:r,vx:Math.cos(t)*i,vy:Math.sin(t)*i,ay:-.15,life:1,decay:.02+Math.random()*.02})}}var un=mt();Se(`keydown`,he,Zt),Se(`popstate`,he,At),Se(`click`,he,jt);var dn=j(un);let fn;var pn=j(dn),mn=j(pn),hn=j(mn);Re(j(hn),{size:`panel`}),k(hn);var gn=T(hn,2);gn.textContent=`MUSIC`,k(mn);var _n=T(mn,2);se(j(_n),{size:20}),k(_n),k(pn);var vn=T(pn,2),yn=j(vn),bn=j(yn);let xn;var Sn=j(bn);let Cn;var wn=j(Sn);let Tn;var En=j(wn),Dn=e=>{var t=Ke(),r=j(t);ge(r,e=>E(B,e),()=>S(B));var i=T(r,2),o=e=>{n(e,Ge())};b(i,e=>{!P.isPlaying&&!S(wt)&&e(o)});var s=T(i,2);a(j(s),{size:16,class:`text-white/70`}),k(s),k(t),v(`click`,t,()=>{E(Ct,!0)}),n(e,t)},On=e=>{var t=qe();a(j(t),{size:16,class:`text-white/20`}),k(t),n(e,t)},kn=e=>{var t=ue(),r=de(t),a=e=>{var t=Je(),r=j(t);let a;var o=T(j(r),8),s=j(o);let c;k(o),y(2),k(r);var l=T(r,2);let u;k(t),A(()=>{a=i(r,1,`vinyl-record svelte-1o4jdf5`,null,a,{spinning:S(L)}),D(s,`src`,P.fetchErrors[S(G).id]||!S(G).cover?h:S(G).cover),D(s,`alt`,S(G).album),c=i(s,1,`record-art svelte-1o4jdf5`,null,c,{loaded:S(yt)}),u=i(l,1,`tonearm svelte-1o4jdf5`,null,u,{playing:S(L)})}),v(`click`,t,qt),Se(`load`,s,()=>E(yt,!0)),Se(`error`,s,ht),ee(s),n(e,t)},o=e=>{let t=w(()=>P.duration>0?(1-P.currentTime/P.duration)*.45+.25:.48),r=w(()=>P.duration>0?P.currentTime/P.duration*.45+.25:.48);var a=Ye(),o=j(a),s=j(o),c=j(s),l=j(c,!0);k(c),y(2),k(s);var u=T(s,2),d=j(u);let f;var p=T(d,2);let m;var h=T(p,2);let g;var _=T(h,2);let ee;k(u),k(o),k(a),A(()=>{N(l,S(G).title),f=i(d,1,`spindle-left bg-zinc-900 svelte-1o4jdf5`,null,f,{spinning:S(L)}),m=i(p,1,`tape-roll-left bg-amber-950/70 svelte-1o4jdf5`,null,m,{spinning:S(L)}),x(p,`width: ${S(t)*46}px; height: ${S(t)*46}px;`),g=i(h,1,`spindle-right bg-zinc-900 svelte-1o4jdf5`,null,g,{spinning:S(L)}),ee=i(_,1,`tape-roll-right bg-amber-950/70 svelte-1o4jdf5`,null,ee,{spinning:S(L)}),x(_,`width: ${S(r)*46}px; height: ${S(r)*46}px;`)}),v(`click`,a,qt),n(e,a)},s=e=>{var t=Xe(),r=j(t),a=T(j(r),4),o=T(j(a),4),s=j(o),c=j(s,!0);k(s);var l=T(s,2),u=j(l,!0);k(l),k(o),k(a);var d=T(a,2),f=j(d);let p;var m=T(f,2),h=j(m);let g;k(m),k(d);var _=T(d,2);let ee;k(r),k(t),A(()=>{N(c,S(G).title),N(u,S(G).artist||`WEAREDOGS`),p=i(f,1,`floppy-shutter-slider bg-zinc-400 svelte-1o4jdf5`,null,p,{open:S(L)}),g=i(h,1,`floppy-magnetic-disc bg-zinc-900 svelte-1o4jdf5`,null,g,{spinning:S(L)}),ee=i(_,1,`floppy-drive-led svelte-1o4jdf5`,null,ee,{active:S(L)})}),v(`click`,t,qt),n(e,t)},c=e=>{var t=Qe(),r=j(t),a=j(r);let o;var s=T(a,2),c=j(s),l=j(c);let u;var d=T(l,2);let f;k(c);var p=T(c,2),m=j(p);let h;k(p);var g=T(p,2);pe(g,20,()=>Array(10),re,(e,t,r)=>{var a=Ze();let o;A(e=>o=i(a,1,`comb-tooth svelte-1o4jdf5`,null,o,e),[()=>({vibrating:S(L)&&r%3==Math.floor(P.currentTime*4)%3})]),n(e,a)}),k(g),k(s),k(r),k(t),A(()=>{o=i(a,1,`music-box-key svelte-1o4jdf5`,null,o,{spinning:S(L)}),u=i(l,1,`music-box-gear gear-1 svelte-1o4jdf5`,null,u,{spinning:S(L)}),f=i(d,1,`music-box-gear gear-2 svelte-1o4jdf5`,null,f,{spinning:S(L)}),h=i(m,1,`music-box-drum bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 svelte-1o4jdf5`,null,h,{spinning:S(L)})}),v(`click`,t,qt),n(e,t)};b(r,e=>{Be.musicDeckModel===`vinyl`?e(a):Be.musicDeckModel===`cassette`?e(o,1):Be.musicDeckModel===`floppy`?e(s,2):Be.musicDeckModel===`musicbox`&&e(c,3)}),n(e,t)};b(En,e=>{S(R)&&!S(Ct)?e(Dn):S(R)&&S(Ct)?e(On,1):e(kn,-1)}),k(wn);var An=T(wn,2),jn=j(An),Mn=j(jn),Nn=j(Mn),Pn=e=>{ae(e,{size:12,class:`text-[#22c55e]`})},Fn=e=>{p(e,{size:12})};b(Nn,e=>{S(Bt)===S(G).id?e(Pn):e(Fn,-1)}),k(Mn);var In=T(Mn,2),Ln=e=>{var t=$e();let r;Oe(j(t),{size:12}),k(t),A(()=>{r=i(t,1,`player-download-btn svelte-1o4jdf5`,null,r,{downloading:S(Ut)===S(G).id}),D(t,`title`,S(G).instrumental?`Download instrumental`:`Download track`)}),v(`click`,t,e=>Wt(e,S(G))),n(e,t)};b(In,e=>{(S(G).instrumental||S(G).src)&&e(Ln)}),k(jn);var Rn=T(jn,2);let zn;var Bn=j(Rn);let Vn;var Hn=j(Bn,!0);k(Bn),k(Rn);var Un=T(Rn,2);let Wn;var Gn=j(Un);let Kn;var qn=j(Gn,!0);k(Gn),k(Un);var Jn=T(Un,2);let Yn;var Xn=j(Jn);let Zn;var Qn=j(Xn,!0);k(Xn),k(Jn),k(An),k(Sn);var $n=T(Sn,2),er=j($n),tr=j(er),nr=j(tr,!0);k(tr);var rr=T(tr,2),ir=j(rr);pe(ir,21,()=>S(Ot),re,(e,t,r)=>{let a=w(()=>P.duration>0?P.currentTime/P.duration:0),o=w(()=>r/60);var s=et();let c;A(()=>{c=i(s,1,`waveform-bar transition-colors duration-100 rounded-full svelte-1o4jdf5`,null,c,{active:S(o)<=S(a)}),x(s,`height: ${S(t)??``}%; width: 3px;`)}),n(e,s)}),k(ir);var ar=T(ir,2);ye(ar),k(rr);var or=T(rr,2),sr=j(or,!0);k(or),k(er);var cr=T(er,2),lr=j(cr);let ur;r(j(lr),{size:15}),k(lr);var dr=T(lr,2);Fe(j(dr),{size:19}),k(dr);var fr=T(dr,2);let pr;var mr=j(fr),hr=e=>{Me(e,{size:22})},gr=e=>{n(e,tt())},_r=e=>{fe(e,{size:22,fill:`currentColor`})},vr=e=>{_e(e,{size:22,fill:`currentColor`})};b(mr,e=>{P.fetchErrors[S(G).id]?e(hr):P.isLoading?e(gr,1):P.isPlaying?e(_r,2):e(vr,-1)}),k(fr);var yr=T(fr,2);ce(j(yr),{size:19}),k(yr);var br=T(yr,2);let xr;var Sr=j(br),Cr=e=>{Ce(e,{size:15})},wr=e=>{xe(e,{size:15})},Tr=e=>{be(e,{size:15})};b(Sr,e=>{P.repeatMode===2?e(Cr):P.repeatMode===3?e(wr,1):e(Tr,-1)}),k(br),k(cr);var Er=T(cr,2),Dr=j(Er);let Or;var kr=j(Dr);let Ar;Pe(j(kr),{size:12}),y(2),k(kr);var jr=T(kr,2),Mr=j(jr);let Nr;k(jr);var Pr=T(jr,2);let Fr;f(j(Pr),{size:12}),y(2),k(Pr),k(Dr),k(Er);var Ir=T(Er,2),Lr=j(Ir),Rr=e=>{var t=nt(),r=j(t),i=j(r),a=e=>{ve(e,{size:12,class:`text-red-400`})},o=e=>{ke(e,{size:12})};b(i,e=>{P.isMuted||P.volume===0?e(a):e(o,-1)}),k(r);var s=T(r,2);ye(s);var c=T(s,2),l=j(c);k(c),k(t),ge(t,e=>E(xt,e),()=>S(xt)),A(e=>{je(s,P.volume),N(l,`${e??``}%`)},[()=>Math.round(P.volume*100)]),v(`click`,r,()=>P.toggleMute()),v(`input`,s,e=>P.setVolume(parseFloat(e.target.value))),n(e,t)};b(Lr,e=>{S(bt)&&e(Rr)});var zr=T(Lr,2),Br=j(zr);let Vr;Ee(j(Br),{size:13}),k(Br);var Hr=T(Br,2),Ur=j(Hr,!0);k(Hr),k(zr);var Wr=T(zr,2),Gr=j(Wr),Kr=j(Gr),qr=e=>{ve(e,{size:13,class:`text-red-400`})},Jr=e=>{ke(e,{size:13})};b(Kr,e=>{P.isMuted||P.volume===0?e(qr):e(Jr,-1)}),k(Gr),k(Wr),k(Ir),k($n),k(bn);var Yr=T(bn,2);let Xr;var Zr=j(Yr),Qr=T(j(Zr),2);k(Zr);var $r=T(Zr,2),ei=j($r),ti=j(ei);me(ti,{size:13});var ni=T(ti,3),ri=j(ni,!0);k(ni),k(ei);var ii=T(ei,2),ai=T(j(ii),2),oi=j(ai);oi.value=oi.__value=`default`;var si=T(oi);si.value=si.__value=`artist`;var ci=T(si);ci.value=ci.__value=`album`;var li=T(ci);li.value=li.__value=`year`;var ui=T(li);ui.value=ui.__value=`filename`;var di=T(ui);di.value=di.__value=`genre`;var fi=T(di);fi.value=fi.__value=`season`,k(ai),k(ii),k($r);var pi=T($r,2);pe(pi,21,()=>S(W),re,(e,t,r)=>{var a=lt();let o;var s=j(a),c=j(s),l=e=>{n(e,rt())},u=e=>{var t=it();t.textContent=r+1,n(e,t)};b(c,e=>{S(G).id===S(t).id&&P.isPlaying?e(l):e(u,-1)}),k(s);var d=T(s,2),f=T(d,2),m=j(f),g=j(m);let _;var te=j(g,!0);k(g);var ne=T(g,2),re=e=>{var t=at();Me(j(t),{size:10}),y(),k(t),n(e,t)};b(ne,e=>{P.fetchErrors[S(t).id]&&e(re)}),k(m);var ie=T(m,2),oe=j(ie);k(ie),k(f);var se=T(f,2),ce=j(se),le=e=>{var r=ct(),i=j(r),a=e=>{var t=ot();v(`click`,t,e=>{e.stopPropagation(),E(Tt,!0)}),n(e,t)},o=e=>{var r=st();A(()=>D(r,`href`,S(t).attrib)),v(`click`,r,e=>e.stopPropagation()),n(e,r)};b(i,e=>{S(t).id===`arigato`?e(a):e(o,-1)}),k(r),n(e,r)};b(ce,e=>{S(t).attrib&&e(le)});var x=T(ce,2),ue=j(x),C=e=>{ae(e,{size:12,class:`text-[#22c55e]`})},w=e=>{p(e,{size:12})};b(ue,e=>{S(Bt)===S(t).id?e(C):e(w,-1)}),k(x);var de=T(x,2),fe=e=>{var r=$e();let a;Oe(j(r),{size:12}),k(r),A(()=>{a=i(r,1,`tr-download-btn svelte-1o4jdf5`,null,a,{downloading:S(Ut)===S(t).id}),D(r,`title`,S(t).instrumental?`Download instrumental`:`Download track`)}),v(`click`,r,e=>Wt(e,S(t))),n(e,r)};b(de,e=>{(S(t).instrumental||S(t).src)&&e(fe)}),k(se),k(a),A(()=>{o=i(a,1,`track-row svelte-1o4jdf5`,null,o,{active:S(G).id===S(t).id,"kb-focused":S(K)===S(t).id,"fetch-error":P.fetchErrors[S(t).id]}),D(a,`data-track-id`,S(t).id),D(d,`src`,P.fetchErrors[S(t).id]||!S(t).cover?h:S(t).cover),D(d,`alt`,S(t).album),_=i(g,1,`tr-title svelte-1o4jdf5`,null,_,{"line-through":P.fetchErrors[S(t).id],"opacity-50":P.fetchErrors[S(t).id]}),N(te,S(t).title),N(oe,`${S(t).artist??``} · ${S(t).album??``} (${(S(t).year||``)??``})`)}),v(`click`,a,()=>Kt(S(t))),Se(`error`,d,ht),ee(d),v(`click`,x,e=>Ht(e,S(t))),n(e,a)}),k(pi),k(Yr),k(yn),k(vn),y(2),k(dn);var mi=T(dn,2),hi=e=>{var t=ft(),r=j(t);ge(r,e=>E(B,e),()=>S(B));var a=T(r,2),o=e=>{n(e,ut())};b(a,e=>{!P.isPlaying&&!S(wt)&&e(o)});var s=T(a,2),c=j(s);pe(c,21,()=>He,re,(e,t,r)=>{var a=dt(),o=j(a,!0);k(a),A(()=>{i(a,1,`px-2 py-1 rounded text-[9px] font-bold transition-all uppercase tracking-wider font-mono
                ${S(z)===r?`bg-purple-600 text-white`:`text-white/40 hover:text-white/80`}`,`svelte-1o4jdf5`),N(o,S(t).name)}),v(`click`,a,()=>E(z,r,!0)),n(e,a)}),k(c),k(s),k(t),v(`click`,t,e=>{e.stopPropagation(),E(Ct,!1)}),v(`click`,s,e=>e.stopPropagation()),n(e,t)};b(mi,e=>{S(R)&&S(Ct)&&e(hi)});var gi=T(mi,2);ge(gi,e=>E(q,e),()=>S(q));var _i=T(gi,2),vi=e=>{var r=pt(),i=j(r),a=j(i),o=T(j(a),2);se(j(o),{size:16}),k(o),k(a);var s=T(a,2),l=j(s),u=j(l);Te(j(u),{size:14}),y(),k(u),k(l);var d=T(l,2);t(d,()=>Dt(S(Et).intro),!0),k(d);var f=T(d,2),p=j(f);t(p,()=>Dt(S(Et).tos),!0),k(p),k(f);var m=T(f,2);t(m,()=>Dt(S(Et).outro),!0),k(m),k(s),k(i),k(r),v(`click`,r,()=>E(Tt,!1)),v(`click`,i,e=>e.stopPropagation()),v(`click`,o,()=>E(Tt,!1)),c(3,r,()=>De,()=>({duration:150})),n(e,r)};b(_i,e=>{S(Tt)&&e(vi)}),k(un),A((e,t)=>{fn=i(dn,1,`mp-container svelte-1o4jdf5`,null,fn,{closing:gt(),"theme-inst":P.isInstrumental}),xn=i(bn,1,`player-side svelte-1o4jdf5`,null,xn,{"tracklist-open":S(I)}),Cn=i(Sn,1,`player-top-block transition-all duration-300 ease-in-out svelte-1o4jdf5`,null,Cn,{"opacity-0":S(I),"scale-95":S(I),"pointer-events-none":S(I)}),Tn=i(wn,1,`vinyl-wrapper relative overflow-hidden svelte-1o4jdf5`,null,Tn,{"deck-glitch":S(St)}),zn=i(Rn,1,`scroll-container svelte-1o4jdf5`,null,zn,{overflowing:S(Ft)>S(Pt)}),x(Rn,`--scroll-dist: -${S(Ft)-S(Pt)}px`),Vn=i(Bn,1,`track-title scroll-text svelte-1o4jdf5`,null,Vn,{"animate-scroll":S(Ft)>S(Pt)}),N(Hn,S(G).title),Wn=i(Un,1,`scroll-container svelte-1o4jdf5`,null,Wn,{overflowing:S(Lt)>S(It)}),x(Un,`--scroll-dist: -${S(Lt)-S(It)}px`),Kn=i(Gn,1,`track-artist scroll-text svelte-1o4jdf5`,null,Kn,{"animate-scroll":S(Lt)>S(It)}),N(qn,S(G).artist),Yn=i(Jn,1,`scroll-container svelte-1o4jdf5`,null,Yn,{overflowing:S(zt)>S(Rt)}),x(Jn,`--scroll-dist: -${S(zt)-S(Rt)}px`),Zn=i(Xn,1,`track-album scroll-text svelte-1o4jdf5`,null,Zn,{"animate-scroll":S(zt)>S(Rt)}),N(Qn,S(G).album),N(nr,e),D(ar,`max`,P.duration||100),je(ar,P.currentTime),N(sr,t),ur=i(lr,1,`ctrl ctrl-sm svelte-1o4jdf5`,null,ur,{"active-ctrl":P.isShuffled}),pr=i(fr,1,`ctrl ctrl-play svelte-1o4jdf5`,null,pr,{"ctrl-error":P.fetchErrors[S(G).id]}),D(fr,`aria-label`,P.isPlaying?`Pause`:`Play`),xr=i(br,1,`ctrl ctrl-sm svelte-1o4jdf5`,null,xr,{"active-ctrl":P.repeatMode>0}),D(br,`title`,P.repeatMode===1?`Repeat: all`:P.repeatMode===2?`Repeat: one`:P.repeatMode===3?`Stop after current track`:`Repeat: off`),Or=i(Dr,1,`dj-crossfader svelte-1o4jdf5`,null,Or,{"fader-flash":S($t),"fader-fried":S(J)>=10}),Ar=i(kr,1,`fader-label left-label flex items-center gap-1 svelte-1o4jdf5`,null,Ar,{active:!P.isInstrumental}),Nr=i(Mr,1,`dj-fader-knob svelte-1o4jdf5`,null,Nr,{right:P.isInstrumental,"knob-jiggle":S(Qt),fried:S(J)>=10}),Fr=i(Pr,1,`fader-label right-label flex items-center gap-1 svelte-1o4jdf5`,null,Fr,{active:P.isInstrumental}),Vr=i(Br,1,`ctrl ctrl-xs svelte-1o4jdf5`,null,Vr,{"active-ctrl":S(R)}),i(Hr,1,`w-[90px] h-[20px] flex items-center justify-center rounded text-[9px] font-bold transition-all font-mono uppercase tracking-wider select-none cursor-pointer
                      ${S(R)?`bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/25 active:scale-95`:`bg-transparent border border-white/5 text-white/20 hover:text-white/40 hover:border-white/10`}`,`svelte-1o4jdf5`),D(Hr,`title`,S(R)?`Click to cycle presets`:`Click to enable visualizer`),N(Ur,He[S(z)].name),Xr=i(Yr,1,`tracklist-side svelte-1o4jdf5`,null,Xr,{"show-mobile":S(I)}),N(ri,S(U).length)},[()=>Xt(P.currentTime),()=>Xt(P.duration)]),v(`click`,un,vt),v(`click`,dn,e=>e.stopPropagation()),v(`click`,hn,()=>{P.isPlaying||window.dispatchEvent(new CustomEvent(`open-info-panel`))}),v(`click`,_n,function(...e){d.onClose?.apply(this,e)}),v(`click`,An,Jt),v(`click`,Mn,e=>Ht(e,S(G))),M(Bn,`clientWidth`,e=>E(Ft,e)),M(Rn,`clientWidth`,e=>E(Pt,e)),M(Gn,`clientWidth`,e=>E(Lt,e)),M(Un,`clientWidth`,e=>E(It,e)),M(Xn,`clientWidth`,e=>E(zt,e)),M(Jn,`clientWidth`,e=>E(Rt,e)),v(`input`,ar,e=>{P.seek(parseFloat(e.target.value))}),v(`change`,ar,e=>{P.isPlaying||P.play(parseFloat(e.target.value))}),v(`click`,lr,()=>P.setShuffle(!P.isShuffled)),v(`click`,dr,()=>P.prevTrack()),v(`click`,fr,()=>P.togglePlay()),v(`click`,yr,()=>P.nextTrack()),v(`click`,br,()=>{P.repeatMode=(P.repeatMode+1)%4}),v(`click`,Dr,Yt),v(`click`,Br,()=>{E(R,!S(R))}),v(`click`,Hr,()=>{S(R)?E(z,(S(z)+1)%He.length):E(R,!0)}),v(`click`,Gr,()=>{E(bt,!S(bt))}),v(`click`,Qr,()=>{E(I,!1)}),Ne(ai,()=>S(F),e=>E(F,e)),c(1,yn,()=>De,()=>({duration:120,delay:120})),c(2,yn,()=>De,()=>({duration:120})),n(e,un),l()}d([`click`,`input`,`change`]);export{ht as default};