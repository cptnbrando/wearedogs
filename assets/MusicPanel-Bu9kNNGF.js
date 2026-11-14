import{Aa as e,Ai as t,Bi as n,Ci as r,Ct as i,D as a,Da as o,Di as s,E as c,Ea as l,F as u,Fi as d,G as f,Gi as p,Hi as m,I as h,Ii as g,Ji as ee,Ki as _,Lt as v,Mi as te,Nr as ne,Oa as y,On as re,Pi as b,Qi as ie,Rt as ae,Si as x,Sn as oe,V as se,Vi as ce,Wn as le,Wt as ue,Xi as S,Zr as de,_a as C,ba as w,cn as fe,ct as pe,da as me,et as he,fa as T,fr as ge,ga as E,hi as D,ia as O,ji as _e,ka as k,la as ve,li as ye,lr as be,lt as xe,mi as Se,nn as Ce,or as we,ot as Te,qi as A,ra as j,si as Ee,tn as De,ua as M,ui as Oe,un as ke,va as Ae,vi as je,vn as Me,x as Ne,yi as Pe,zi as N,zt as Fe}from"./vendor-Bi9VKMrK.js";import{n as Ie,r as Le,t as P}from"./AudioCore.svelte-sG0Ox9DB.js";import{t as Re}from"./DogsLogo-CazSeN8g.js";import{n as ze}from"./goHome-D17FYWyE.js";import{t as Be}from"./doubleTap-C15pvH0v.js";import{t as Ve}from"./settingsManager.svelte-CeYopRvG.js";var He=class{constructor(t,n){e(this,`canvas`,null),e(this,`gl`,null),e(this,`analyser`,null),e(this,`program`,null),e(this,`animationFrameId`,null),e(this,`startTime`,0),e(this,`vertexBuffer`,null),e(this,`audioTexture`,null),e(this,`uniforms`,{}),e(this,`frequencyBuffer`,null),this.canvas=t,this.analyser=n,this.frequencyBuffer=new Uint8Array(n?n.frequencyBinCount:128),this.gl=t.getContext(`webgl`)||t.getContext(`experimental-webgl`),this.gl||console.error(`WebGL not supported by this browser.`)}init(e){if(!this.gl)return;let t=this.gl;this.cleanupProgram();let n=this.compileShader(t.VERTEX_SHADER,`
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
  `},Ge=`I understand the creator of this sick beat Nxnja has a copyright notice on his music distribution website.\r
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
`,Ke=m(`<div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 animate-pulse svelte-1o4jdf5"><div class="bg-black/75 border border-red-500/30 px-3 py-1.5 rounded text-[10px] font-mono tracking-widest text-red-500 font-bold uppercase shadow-[0_0_15px_rgba(239,68,68,0.25)] select-none svelte-1o4jdf5">NO SIGNAL</div></div>`),qe=m(`<div class="visualizer-container cursor-pointer svelte-1o4jdf5"><canvas class="visualizer-canvas svelte-1o4jdf5"></canvas> <!> <div class="visualizer-hover-overlay svelte-1o4jdf5"><!></div></div>`),Je=m(`<div class="visualizer-container bg-[#050508]/40 border border-white/5 flex items-center justify-center svelte-1o4jdf5"><!></div>`),Ye=m(`<div class="vinyl-record-clicker cursor-pointer w-full h-full svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div><div class="groove g1 svelte-1o4jdf5"></div> <div class="groove g2 svelte-1o4jdf5"></div> <div class="groove g3 svelte-1o4jdf5"></div> <div class="groove g4 svelte-1o4jdf5"></div> <div class="record-label svelte-1o4jdf5"><img loading="lazy"/></div> <div class="spindle svelte-1o4jdf5"></div></div> <div></div></div>`),Xe=m(`<div class="cassette-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="cassette-tape svelte-1o4jdf5"><div class="cassette-label bg-gradient-to-r from-purple-800 to-pink-700 svelte-1o4jdf5"><span class="cassette-track-title svelte-1o4jdf5"> </span> <span class="cassette-brand svelte-1o4jdf5">WEAREDOGS AUDIO</span></div> <div class="cassette-window bg-zinc-950/80 svelte-1o4jdf5"><div></div> <div></div> <div></div> <div></div></div></div></div>`),Ze=m(`<div class="floppy-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="floppy-disk svelte-1o4jdf5"><div class="floppy-corner svelte-1o4jdf5"></div> <div class="floppy-write-protect svelte-1o4jdf5"></div> <div class="floppy-label bg-slate-100 text-slate-900 svelte-1o4jdf5"><div class="floppy-label-stripe bg-red-600 svelte-1o4jdf5"></div> <div class="floppy-label-stripe-blue bg-blue-600 svelte-1o4jdf5"></div> <div class="floppy-label-content svelte-1o4jdf5"><div class="floppy-song truncate font-mono svelte-1o4jdf5"> </div> <div class="floppy-artist truncate font-mono svelte-1o4jdf5"> </div></div></div> <div class="floppy-shutter-door bg-zinc-700 svelte-1o4jdf5"><div></div> <div class="floppy-shutter-opening bg-zinc-950 svelte-1o4jdf5"><div></div></div></div> <div></div></div></div>`),Qe=m(`<div></div>`),$e=m(`<div class="musicbox-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="music-box svelte-1o4jdf5"><div></div> <div class="music-box-interior border border-amber-900/40 svelte-1o4jdf5"><div class="music-box-gears svelte-1o4jdf5"><div></div> <div></div></div> <div class="music-box-drum-wrap svelte-1o4jdf5"><div><div class="music-box-pins svelte-1o4jdf5"><div class="pin pin-1 svelte-1o4jdf5"></div> <div class="pin pin-2 svelte-1o4jdf5"></div> <div class="pin pin-3 svelte-1o4jdf5"></div> <div class="pin pin-4 svelte-1o4jdf5"></div> <div class="pin pin-5 svelte-1o4jdf5"></div> <div class="pin pin-6 svelte-1o4jdf5"></div></div></div></div> <div class="music-box-comb svelte-1o4jdf5"></div></div></div></div>`),et=m(`<button aria-label="Download track"><!></button>`),tt=m(`<span></span>`),nt=m(`<div class="spin-ring svelte-1o4jdf5"></div>`),rt=m(`<div class="volume-popover svelte-1o4jdf5"><button class="ctrl ctrl-xs mr-2 border border-white/10 rounded-full p-1 hover:bg-white/10 svelte-1o4jdf5" aria-label="Mute"><!></button> <input type="range" class="vol-slider-pop svelte-1o4jdf5" min="0" max="1" step="0.01" aria-label="Volume"/> <span class="text-[10px] font-bold text-white/60 min-w-[28px] text-right font-mono select-none svelte-1o4jdf5"> </span></div>`),it=m(`<div class="eq svelte-1o4jdf5"><div class="eq-b svelte-1o4jdf5"></div> <div class="eq-b svelte-1o4jdf5"></div> <div class="eq-b svelte-1o4jdf5"></div></div>`),at=m(`<span class="svelte-1o4jdf5"></span>`),ot=m(`<span class="text-amber-400 flex items-center gap-1 text-[9px] font-bold tracking-wider uppercase bg-amber-500/10 px-1.5 py-0.5 rounded flex-shrink-0 svelte-1o4jdf5" title="Failed to fetch music source from remote database"><!> Error Fetching</span>`),st=m(`<button class="cursor-pointer svelte-1o4jdf5" style="background: none; border: none; padding: 0; color: inherit; font: inherit;">i</button>`),ct=m(`<a target="_blank" class="svelte-1o4jdf5">i</a>`),lt=m(`<span class="inst-chip-link svelte-1o4jdf5"><!></span>`),ut=m(`<div><div class="tr-num svelte-1o4jdf5"><!></div> <img loading="lazy" class="tr-art svelte-1o4jdf5"/> <div class="tr-info svelte-1o4jdf5"><div class="flex items-center gap-1.5 min-w-0 svelte-1o4jdf5"><span> </span> <!></div> <span class="tr-meta svelte-1o4jdf5"> </span></div> <div class="flex items-center gap-2 flex-shrink-0 svelte-1o4jdf5"><!>  <button class="tr-share-btn svelte-1o4jdf5" title="Copy track link" aria-label="Share track"><!></button> <!></div></div>`),dt=m(`<div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 animate-pulse svelte-1o4jdf5"><div class="bg-black/75 border border-red-500/30 px-4 py-2 rounded text-[12px] font-mono tracking-widest text-red-500 font-bold uppercase shadow-[0_0_20px_rgba(239,68,68,0.3)] select-none svelte-1o4jdf5">NO SIGNAL</div></div>`),ft=m(`<button> </button>`),pt=m(`<div class="visualizer-container fullscreen cursor-pointer svelte-1o4jdf5"><canvas class="visualizer-canvas svelte-1o4jdf5"></canvas> <!> <div class="visualizer-overlay svelte-1o4jdf5"><div class="flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-lg p-1 border border-white/10 svelte-1o4jdf5"></div></div></div>`),mt=m(`<div class="arigato-modal-backdrop svelte-1o4jdf5"><div class="arigato-modal-content svelte-1o4jdf5"><header class="arigato-modal-header svelte-1o4jdf5"><h2 class="svelte-1o4jdf5">ARIGATO INFO</h2> <button class="arigato-close-btn svelte-1o4jdf5"><!></button></header> <div class="arigato-modal-body scroll-y svelte-1o4jdf5"><div class="merch-link-container svelte-1o4jdf5"><a href="https://nxnjaa.beatstars.com/" target="_blank" rel="noopener noreferrer" class="merch-link-btn svelte-1o4jdf5"><!> NXNJA MERCH & MUSIC</a></div> <p class="intro-text svelte-1o4jdf5"></p> <div class="tos-box svelte-1o4jdf5"><div class="tos-microtext svelte-1o4jdf5"></div></div> <p class="outro-text svelte-1o4jdf5"></p></div></div></div>`),ht=m(`<div class="mp-backdrop svelte-1o4jdf5"><div><header class="panel-header svelte-1o4jdf5"><div class="brand svelte-1o4jdf5"><button class="logo-btn svelte-1o4jdf5" aria-label="Go to the DOGS home page"><!></button> <h1 class="svelte-1o4jdf5"></h1></div> <button class="close-btn svelte-1o4jdf5" aria-label="Close panel"><!></button></header> <div class="mp-body svelte-1o4jdf5"><div class="songs-layout svelte-1o4jdf5"><div><div><div><!></div>  <div class="track-info mt-2 svelte-1o4jdf5"><div class="flex items-center justify-center gap-1.5 mb-1.5 svelte-1o4jdf5"><button class="player-share-btn svelte-1o4jdf5" title="Copy track link" aria-label="Share track"><!></button> <!></div> <div><h2> </h2></div> <div><p> </p></div> <div><p> </p></div></div></div> <div class="player-controls-block svelte-1o4jdf5"><div class="progress-row svelte-1o4jdf5"><span class="ptime svelte-1o4jdf5"> </span> <div class="progress-wrap waveform-slider-wrap relative h-9 flex items-end svelte-1o4jdf5"><div class="waveform-bars flex items-end justify-between absolute inset-0 pointer-events-none px-1 h-full svelte-1o4jdf5"></div> <input type="range" class="seek-input absolute inset-0 opacity-0 cursor-pointer w-full h-full svelte-1o4jdf5" min="0" step="0.1" aria-label="Seek"/></div> <span class="ptime svelte-1o4jdf5"> </span></div> <div class="controls-row svelte-1o4jdf5"><button aria-label="Shuffle"><!></button> <button class="ctrl ctrl-md svelte-1o4jdf5" aria-label="Previous"><!></button> <button><!></button> <button class="ctrl ctrl-md svelte-1o4jdf5" aria-label="Next"><!></button> <button aria-label="Repeat"><!></button></div> <div class="w-full flex flex-col items-center gap-1.5 mt-2 px-1 svelte-1o4jdf5"><div><span><!> <span class="svelte-1o4jdf5">VOCAL</span></span> <div class="dj-fader-slot relative svelte-1o4jdf5"><div></div></div> <span><!> <span class="svelte-1o4jdf5">INST</span></span></div></div> <div class="relative flex justify-center items-center gap-3 mt-2 w-full svelte-1o4jdf5"><!> <div class="flex items-center gap-1.5 svelte-1o4jdf5"><button aria-label="Toggle Visualizer"><!></button> <button> </button></div> <div class="relative svelte-1o4jdf5"><button class="ctrl ctrl-xs vol-toggle-btn svelte-1o4jdf5" aria-label="Toggle volume slider"><!></button></div></div></div></div> <div><div class="mobile-close-bar hidden py-2 px-4 border-b border-white/5 flex items-center justify-between svelte-1o4jdf5"><span class="text-xs font-bold text-white/50 svelte-1o4jdf5">Track Library</span> <button class="px-3 py-1 bg-white/5 text-white/75 rounded-lg text-xs font-bold svelte-1o4jdf5">Back to player</button></div> <div class="tl-header flex justify-between items-center gap-3 svelte-1o4jdf5"><div class="flex items-center gap-2 svelte-1o4jdf5"><!><span class="svelte-1o4jdf5">TRACKS</span> <span class="tl-count svelte-1o4jdf5"> </span></div> <div class="flex items-center gap-1.5 ml-auto svelte-1o4jdf5"><span class="text-[9px] text-white/30 font-bold font-sans svelte-1o4jdf5">SORT BY:</span> <select class="bg-black/40 border border-white/10 rounded px-1.5 py-0.5 text-[10px] font-bold text-white/60 outline-none cursor-pointer hover:border-white/20 transition-all font-sans svelte-1o4jdf5"><option class="svelte-1o4jdf5">DEFAULT</option><option class="svelte-1o4jdf5">ARTIST</option><option class="svelte-1o4jdf5">ALBUM</option><option class="svelte-1o4jdf5">YEAR</option><option class="svelte-1o4jdf5">FILENAME</option><option class="svelte-1o4jdf5">GENRE</option><option class="svelte-1o4jdf5">SEASON</option></select></div></div> <div class="tracklist scroll-y svelte-1o4jdf5"></div></div></div></div> <footer class="mp-footer svelte-1o4jdf5"><div class="mp-status svelte-1o4jdf5"><span class="mp-dot svelte-1o4jdf5"></span><span class="svelte-1o4jdf5">🐕</span></div> <span class="svelte-1o4jdf5">MUSIC</span></footer></div> <!> <canvas class="fader-fx-canvas pointer-events-none svelte-1o4jdf5"></canvas> <!></div>`);function gt(e,p){o(p,!0);let m=`/img/error_cover.png`;function gt(e){e.target.src.endsWith(m)||(e.target.src=m)}let _t=Ee(p,`isClosing`,3,!1),vt=Ee(p,`initialTrackId`,3,null),yt=Be(()=>p.onClose()),F=C(`default`),I=C(!1),bt=C(!1),xt=C(!1),St=C(null),Ct=w(()=>!!P.fetchErrors[P.library[P.currentTrackIndex]?.id]),L=w(()=>P.isPlaying&&!_t()&&!S(Ct)),R=C(!1),z=C(0),wt=C(!1),B=C(null),V=null,H=!1,Tt=C(!1),Et=C(!1),Dt=w(()=>{let e=Ge.split(/`{5,}/);return{intro:e[0]||``,tos:e[1]||``,outro:e[2]||``}});function Ot(e){if(!e)return``;let t=e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`);return t=t.replace(/(https?:\/\/[^\s]+)/g,`<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>`),t=t.replace(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/g,`<a href="mailto:$1">$1</a>`),t.replace(/\n/g,`<br>`)}let kt=w(()=>{let e=S(G);if(!e)return Array(60).fill(10);if(P.waveformPeaks[e.id])return P.waveformPeaks[e.id];let t=e.id,n=[],r=0;for(let e=0;e<t.length;e++)r=(r<<5)-r+t.charCodeAt(e),r|=0;let i=Math.abs(r)%1e3;for(let e=0;e<60;e++){let t=e/59,r=Math.sin(i+t*Math.PI*4),a=Math.cos(i*1.5+t*Math.PI*10)*.4,o=Math.sin(i*2.3+t*Math.PI*22)*.15,s=Math.abs(r+a+o)/1.55,c=Math.sin(t*Math.PI),l=(s*70+15)*c;n.push(Math.max(10,Math.round(l)))}return n});O(()=>{window.innerWidth<=640&&S(R)&&S(z)===0&&ie(()=>S(I))&&E(I,!1)}),O(()=>{P.isPlaying&&E(Tt,!0)});let At=w(()=>!P.isPlaying&&!S(Tt)?We.fragmentShader:Ue[S(z)].fragmentShader);O(()=>{let e=P.analyser;return S(R)&&S(B)&&!_t()&&(V=new He(S(B),e),V.init(S(At)),V.start()),()=>{V&&(V.destroy(),V=null)}}),O(()=>{let e=S(At);V&&S(R)&&(V.setPreset(e),V.start())}),O(()=>{S(I)?!history.state?.tracklistOpen&&!H&&(history.pushState({tracklistOpen:!0},``),H=!0):H&&(history.back(),H=!1)}),d(()=>{H&&(history.back(),H=!1)});function jt(e){!e.state?.tracklistOpen&&S(I)&&(E(I,!1),H=!1)}function Mt(e){S(xt)&&S(St)&&!S(St).contains(e.target)&&!e.target.closest(`.vol-toggle-btn`)&&E(xt,!1)}let U=w(()=>Ie.unlocked?Le:Le.filter(e=>e.public!==!1));function Nt(e){return e.src?e.src.split(`/`).pop():``}function Pt(e){if(!e.dateAdded)return`Summer`;let t=new Date(e.dateAdded).getMonth();return t===11||t===0||t===1?`Winter`:t>=2&&t<=4?`Spring`:t>=5&&t<=7?`Summer`:`Fall`}let W=w(()=>{let e=[...S(U)];return S(F)===`artist`?e.sort((e,t)=>e.artist.localeCompare(t.artist)):S(F)===`album`?e.sort((e,t)=>e.album.localeCompare(t.album)):S(F)===`year`?e.sort((e,t)=>(e.year||0)-(t.year||0)):S(F)===`filename`?e.sort((e,t)=>Nt(e).localeCompare(Nt(t))):S(F)===`genre`?e.sort((e,t)=>(e.genre||``).localeCompare(t.genre||``)):S(F)===`season`&&e.sort((e,t)=>Pt(e).localeCompare(Pt(t))),e}),G=w(()=>S(U)[P.currentTrackIndex]??S(U)[0]);O(()=>{let e=S(U);if(P.library===e||P.library.length===0)return;let t=P.library[P.currentTrackIndex]?.id;P.init(e);let n=e.findIndex(e=>e.id===t);n===-1?(P.pause(),P.loadTrack(0,!1)):P.currentTrackIndex=n});let Ft=C(0),It=C(0),Lt=C(0),Rt=C(0),zt=C(0),Bt=C(0),Vt=C(null),Ht=null;function Ut(e,t){e.stopPropagation();let n=`${window.location.origin}/music/${t.id}`;navigator.clipboard.writeText(n).then(()=>{E(Vt,t.id,!0),Ht&&clearTimeout(Ht),Ht=setTimeout(()=>{E(Vt,null)},2e3)}).catch(e=>{console.error(`Failed to copy share link:`,e)})}let Wt=C(null);async function Gt(e,t){e.stopPropagation();let n=t.instrumental||t.src;if(!(!n||S(Wt))){E(Wt,t.id,!0);try{let e=await fetch(n,Ie.fetchOptionsFor(n));if(!e.ok)throw Error(`Fetch failed with status ${e.status}`);let r=URL.createObjectURL(await e.blob()),i=document.createElement(`a`);i.href=r,i.download=decodeURIComponent(n.split(`/`).pop()||``)||`${t.id}.mp3`,document.body.appendChild(i),i.click(),i.remove(),setTimeout(()=>URL.revokeObjectURL(r),6e4)}catch(e){console.error(`Failed to download track:`,e)}finally{E(Wt,null)}}}d(()=>{Ht&&clearTimeout(Ht)}),g(()=>{if(Ie.revalidate(),P.init(S(U)),vt()){let e=S(U).findIndex(e=>e.id===vt());e!==-1&&P.loadTrack(e,!0)}else if(!P.hasPickedRandomTrack){P.hasPickedRandomTrack=!0;let e=Math.floor(Math.random()*S(U).length);P.loadTrack(e,!1)}});let K=C(null);function Kt(){let e=document.querySelector(`.track-row[data-track-id="${S(K)}"]`);e&&e.scrollIntoView({block:`nearest`,behavior:`smooth`})}function qt(e){E(K,e.id,!0);let t=S(U).findIndex(t=>t.id===e.id);P.currentTrackIndex===t&&!P.fetchErrors[e.id]?P.togglePlay():P.loadTrack(t,!0)}function Jt(){window.innerWidth<=640?E(I,!0):E(R,!S(R))}function Yt(e){window.innerWidth>640||e.target.closest(`.scroll-container`)&&E(I,!0)}function Xt(){let e=!P.isInstrumental;P.setCrossfade(e)||(Ae(J),S($t)||(E($t,!0),setTimeout(()=>{E($t,!1)},300)),S(J)===5?(un(),E(en,!0),setTimeout(()=>{E(en,!1)},150)):S(J)===10?un(35):S(J)>5&&S(J)<10?un(8):S(J)>10&&Math.random()<.4&&un(3))}function Zt(e){return!e||isNaN(e)?`0:00`:`${Math.floor(e/60)}:${Math.floor(e%60).toString().padStart(2,`0`)}`}function Qt(e){let t=document.activeElement;if(!(t&&(t.tagName===`INPUT`||t.tagName===`TEXTAREA`||t.isContentEditable))){if(e.code===`Space`||e.key===` `)e.preventDefault(),P.togglePlay();else if(e.key===`ArrowDown`){if(S(W).length>0){e.preventDefault();let t=S(W).findIndex(e=>e.id===S(K));if(t===-1){let e=S(U)[P.currentTrackIndex];t=S(W).findIndex(t=>t.id===e?.id)}let n=(t+1)%S(W).length;E(K,S(W)[n].id,!0),Kt()}}else if(e.key===`ArrowUp`){if(S(W).length>0){e.preventDefault();let t=S(W).findIndex(e=>e.id===S(K));if(t===-1){let e=S(U)[P.currentTrackIndex];t=S(W).findIndex(t=>t.id===e?.id)}let n=(t-1+S(W).length)%S(W).length;E(K,S(W)[n].id,!0),Kt()}}else if(e.key===`Enter`&&S(K)){e.preventDefault();let t=S(W).find(e=>e.id===S(K));t&&qt(t)}}}let q=C(null),J=C(0),$t=C(!1),en=C(!1),Y,X,Z,Q=[],$=[],tn,nn=C(!1);O(()=>(S(q)&&on(),()=>{tn&&cancelAnimationFrame(tn),window.removeEventListener(`resize`,sn),window.visualViewport?.removeEventListener(`resize`,sn),Z&&(Z.dispose(),Z=null),Y=null,X=null,Q=[],$=[]})),O(()=>{if(P.currentTrackIndex,_t(),E(J,0),E(nn,!1),Y){for(let e of Q)Y.remove(e.mesh);for(let e of $)Y.remove(e.mesh)}Q=[],$=[]});function rn(){if(!S(q))return{width:window.innerWidth,height:window.innerHeight};let e=S(q).getBoundingClientRect();return{width:e.width||window.innerWidth,height:e.height||window.innerHeight}}function an(){let{width:e,height:t}=rn(),n=document.querySelector(`.dj-fader-knob`);if(!n)return{x:e/2,y:t/2};let r=S(q)?S(q).getBoundingClientRect():{left:0,top:0},i=n.getBoundingClientRect();return{x:i.left+i.width/2-r.left,y:t-(i.top+i.height/2-r.top)}}function on(){if(!S(q))return;let{width:e,height:t}=rn();S(q).width=e,S(q).height=t,Y=new f,X=new se(0,e,t,0,-1,1),Z=new Ne({canvas:S(q),alpha:!0,antialias:!0}),Z.setSize(e,t,!1),Z.setPixelRatio(Math.min(window.devicePixelRatio,2)),window.addEventListener(`resize`,sn),window.visualViewport?.addEventListener(`resize`,sn),cn()}function sn(){if(!S(q)||!Z||!X)return;let{width:e,height:t}=rn();S(q).width=e,S(q).height=t,Z.setSize(e,t,!1),X.right=e,X.top=t,X.updateProjectionMatrix()}function cn(){if(tn=requestAnimationFrame(cn),!(!Y||!X||!Z||!S(q))){if(S(J)>=10&&(E(nn,!0),Math.random()<.22)){let e=an();ln(e.x,e.y)}for(let e=Q.length-1;e>=0;e--){let t=Q[e];t.x+=t.vx,t.y+=t.vy,t.vy+=t.ay,t.life-=t.decay,t.mesh.position.set(t.x,t.y,0),t.mesh.material.opacity=t.life,t.life<=0&&(Y.remove(t.mesh),t.mesh.geometry.dispose(),t.mesh.material.dispose(),Q.splice(e,1))}for(let e=$.length-1;e>=0;e--){let t=$[e];t.x+=t.vx,t.y+=t.vy,t.life-=t.decay;let n=t.startScale+(1-t.life)*88;t.mesh.scale.set(n,n,1),t.mesh.position.set(t.x,t.y,0),t.mesh.material.opacity=t.life*.16,t.life<=0&&(Y.remove(t.mesh),t.mesh.geometry.dispose(),t.mesh.material.dispose(),$.splice(e,1))}Z.render(Y,X)}}function ln(e,t){if(!Y)return;let n=new c(5,8),r=.85+Math.random()*.12,i=new u(n,new h({color:new a(r,r,r*1.01),transparent:!0,opacity:.06,blending:1}));i.position.set(e,t,0),Y.add(i),$.push({mesh:i,x:e,y:t,vx:(Math.random()-.5)*.55+Math.sin(Date.now()*.001)*.22,vy:Math.random()*.7+1.25,startScale:1,life:1,decay:6e-4+Math.random()*4e-4})}function un(e=25){if(!Y||!S(q))return;let t=an(),n=t.x,r=t.y;for(let t=0;t<e;t++){let e=new u(new c(1.3,4),new h({color:new a(Math.random()<.4?16711765:16755200),transparent:!0,opacity:1,blending:2}));e.position.set(n,r,0),Y.add(e);let t=Math.random()*Math.PI*2,i=Math.random()*4+2;Q.push({mesh:e,x:n,y:r,vx:Math.cos(t)*i,vy:Math.sin(t)*i,ay:-.15,life:1,decay:.02+Math.random()*.02})}}var dn=ht();A(`keydown`,ve,Qt),A(`popstate`,ve,jt),A(`click`,ve,Mt);var fn=M(dn);let pn;var mn=M(fn),hn=M(mn),gn=M(hn);Re(M(gn),{size:`panel`}),k(gn);var _n=T(gn,2);_n.textContent=`MUSIC`,k(hn);var vn=T(hn,2);de(M(vn),{size:20}),k(vn),k(mn);var yn=T(mn,2),bn=M(yn),xn=M(bn);let Sn;var Cn=M(xn);let wn;var Tn=M(Cn);let En;var Dn=M(Tn),On=e=>{var t=qe(),r=M(t);ye(r,e=>E(B,e),()=>S(B));var i=T(r,2),a=e=>{n(e,Ke())};b(i,e=>{!P.isPlaying&&!S(Tt)&&e(a)});var o=T(i,2);oe(M(o),{size:16,class:`text-white/70`}),k(o),k(t),_(`click`,t,()=>{E(wt,!0)}),n(e,t)},kn=e=>{var t=Je();oe(M(t),{size:16,class:`text-white/20`}),k(t),n(e,t)},An=e=>{var t=ce(),i=me(t),a=e=>{var t=Ye(),i=M(t);let a;var o=T(M(i),8),s=M(o);let c;k(o),y(2),k(i);var l=T(i,2);let u;k(t),j(()=>{a=r(i,1,`vinyl-record svelte-1o4jdf5`,null,a,{spinning:S(L)}),D(s,`src`,P.fetchErrors[S(G).id]||!S(G).cover?m:S(G).cover),D(s,`alt`,S(G).album),c=r(s,1,`record-art svelte-1o4jdf5`,null,c,{loaded:S(bt)}),u=r(l,1,`tonearm svelte-1o4jdf5`,null,u,{playing:S(L)})}),_(`click`,t,Jt),A(`load`,s,()=>E(bt,!0)),A(`error`,s,gt),ee(s),n(e,t)},o=e=>{let t=w(()=>P.duration>0?(1-P.currentTime/P.duration)*.45+.25:.48),i=w(()=>P.duration>0?P.currentTime/P.duration*.45+.25:.48);var a=Xe(),o=M(a),s=M(o),c=M(s),l=M(c,!0);k(c),y(2),k(s);var u=T(s,2),d=M(u);let f;var p=T(d,2);let m;var h=T(p,2);let g;var ee=T(h,2);let v;k(u),k(o),k(a),j(()=>{N(l,S(G).title),f=r(d,1,`spindle-left bg-zinc-900 svelte-1o4jdf5`,null,f,{spinning:S(L)}),m=r(p,1,`tape-roll-left bg-amber-950/70 svelte-1o4jdf5`,null,m,{spinning:S(L)}),x(p,`width: ${S(t)*46}px; height: ${S(t)*46}px;`),g=r(h,1,`spindle-right bg-zinc-900 svelte-1o4jdf5`,null,g,{spinning:S(L)}),v=r(ee,1,`tape-roll-right bg-amber-950/70 svelte-1o4jdf5`,null,v,{spinning:S(L)}),x(ee,`width: ${S(i)*46}px; height: ${S(i)*46}px;`)}),_(`click`,a,Jt),n(e,a)},s=e=>{var t=Ze(),i=M(t),a=T(M(i),4),o=T(M(a),4),s=M(o),c=M(s,!0);k(s);var l=T(s,2),u=M(l,!0);k(l),k(o),k(a);var d=T(a,2),f=M(d);let p;var m=T(f,2),h=M(m);let g;k(m),k(d);var ee=T(d,2);let v;k(i),k(t),j(()=>{N(c,S(G).title),N(u,S(G).artist||`WEAREDOGS`),p=r(f,1,`floppy-shutter-slider bg-zinc-400 svelte-1o4jdf5`,null,p,{open:S(L)}),g=r(h,1,`floppy-magnetic-disc bg-zinc-900 svelte-1o4jdf5`,null,g,{spinning:S(L)}),v=r(ee,1,`floppy-drive-led svelte-1o4jdf5`,null,v,{active:S(L)})}),_(`click`,t,Jt),n(e,t)},c=e=>{var t=$e(),i=M(t),a=M(i);let o;var s=T(a,2),c=M(s),l=M(c);let u;var d=T(l,2);let f;k(c);var p=T(c,2),m=M(p);let h;k(p);var g=T(p,2);_e(g,20,()=>Array(10),te,(e,t,i)=>{var a=Qe();let o;j(e=>o=r(a,1,`comb-tooth svelte-1o4jdf5`,null,o,e),[()=>({vibrating:S(L)&&i%3==Math.floor(P.currentTime*4)%3})]),n(e,a)}),k(g),k(s),k(i),k(t),j(()=>{o=r(a,1,`music-box-key svelte-1o4jdf5`,null,o,{spinning:S(L)}),u=r(l,1,`music-box-gear gear-1 svelte-1o4jdf5`,null,u,{spinning:S(L)}),f=r(d,1,`music-box-gear gear-2 svelte-1o4jdf5`,null,f,{spinning:S(L)}),h=r(m,1,`music-box-drum bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 svelte-1o4jdf5`,null,h,{spinning:S(L)})}),_(`click`,t,Jt),n(e,t)};b(i,e=>{Ve.musicDeckModel===`vinyl`?e(a):Ve.musicDeckModel===`cassette`?e(o,1):Ve.musicDeckModel===`floppy`?e(s,2):Ve.musicDeckModel===`musicbox`&&e(c,3)}),n(e,t)};b(Dn,e=>{S(R)&&!S(wt)?e(On):S(R)&&S(wt)?e(kn,1):e(An,-1)}),k(Tn);var jn=T(Tn,2),Mn=M(jn),Nn=M(Mn),Pn=M(Nn),Fn=e=>{ne(e,{size:12,class:`text-[#22c55e]`})},In=e=>{ue(e,{size:12})};b(Pn,e=>{S(Vt)===S(G).id?e(Fn):e(In,-1)}),k(Nn);var Ln=T(Nn,2),Rn=e=>{var t=et();let i;be(M(t),{size:12}),k(t),j(()=>{i=r(t,1,`player-download-btn svelte-1o4jdf5`,null,i,{downloading:S(Wt)===S(G).id}),D(t,`title`,S(G).instrumental?`Download instrumental`:`Download track`)}),_(`click`,t,e=>Gt(e,S(G))),n(e,t)};b(Ln,e=>{(S(G).instrumental||S(G).src)&&e(Rn)}),k(Mn);var zn=T(Mn,2);let Bn;var Vn=M(zn);let Hn;var Un=M(Vn,!0);k(Vn),k(zn);var Wn=T(zn,2);let Gn;var Kn=M(Wn);let qn;var Jn=M(Kn,!0);k(Kn),k(Wn);var Yn=T(Wn,2);let Xn;var Zn=M(Yn);let Qn;var $n=M(Zn,!0);k(Zn),k(Yn),k(jn),k(Cn);var er=T(Cn,2),tr=M(er),nr=M(tr),rr=M(nr,!0);k(nr);var ir=T(nr,2),ar=M(ir);_e(ar,21,()=>S(kt),te,(e,t,i)=>{let a=w(()=>P.duration>0?P.currentTime/P.duration:0),o=w(()=>i/60);var s=tt();let c;j(()=>{c=r(s,1,`waveform-bar transition-colors duration-100 rounded-full svelte-1o4jdf5`,null,c,{active:S(o)<=S(a)}),x(s,`height: ${S(t)??``}%; width: 3px;`)}),n(e,s)}),k(ar);var or=T(ar,2);Se(or),k(ir);var sr=T(ir,2),cr=M(sr,!0);k(sr),k(tr);var lr=T(tr,2),ur=M(lr);let dr;Fe(M(ur),{size:15}),k(ur);var fr=T(ur,2);ae(M(fr),{size:19}),k(fr);var pr=T(fr,2);let mr;var hr=M(pr),gr=e=>{i(e,{size:22})},_r=e=>{n(e,nt())},vr=e=>{ke(e,{size:22,fill:`currentColor`})},yr=e=>{fe(e,{size:22,fill:`currentColor`})};b(hr,e=>{P.fetchErrors[S(G).id]?e(gr):P.isLoading?e(_r,1):P.isPlaying?e(vr,2):e(yr,-1)}),k(pr);var br=T(pr,2);v(M(br),{size:19}),k(br);var xr=T(br,2);let Sr;var Cr=M(xr),wr=e=>{Ce(e,{size:15})},Tr=e=>{ge(e,{size:15})},Er=e=>{De(e,{size:15})};b(Cr,e=>{P.repeatMode===2?e(wr):P.repeatMode===3?e(Tr,1):e(Er,-1)}),k(xr),k(lr);var Dr=T(lr,2),Or=M(Dr);let kr;var Ar=M(Or);let jr;Me(M(Ar),{size:12}),y(2),k(Ar);var Mr=T(Ar,2),Nr=M(Mr);let Pr;k(Mr);var Fr=T(Mr,2);let Ir;le(M(Fr),{size:12}),y(2),k(Fr),k(Or),k(Dr);var Lr=T(Dr,2),Rr=M(Lr),zr=e=>{var t=rt(),r=M(t),i=M(r),a=e=>{pe(e,{size:12,class:`text-red-400`})},o=e=>{xe(e,{size:12})};b(i,e=>{P.isMuted||P.volume===0?e(a):e(o,-1)}),k(r);var s=T(r,2);Se(s);var c=T(s,2),l=M(c);k(c),k(t),ye(t,e=>E(St,e),()=>S(St)),j(e=>{je(s,P.volume),N(l,`${e??``}%`)},[()=>Math.round(P.volume*100)]),_(`click`,r,()=>P.toggleMute()),_(`input`,s,e=>P.setVolume(parseFloat(e.target.value))),n(e,t)};b(Rr,e=>{S(xt)&&e(zr)});var Br=T(Rr,2),Vr=M(Br);let Hr;Te(M(Vr),{size:13}),k(Vr);var Ur=T(Vr,2),Wr=M(Ur,!0);k(Ur),k(Br);var Gr=T(Br,2),Kr=M(Gr),qr=M(Kr),Jr=e=>{pe(e,{size:13,class:`text-red-400`})},Yr=e=>{xe(e,{size:13})};b(qr,e=>{P.isMuted||P.volume===0?e(Jr):e(Yr,-1)}),k(Kr),k(Gr),k(Lr),k(er),k(xn);var Xr=T(xn,2);let Zr;var Qr=M(Xr),$r=T(M(Qr),2);k(Qr);var ei=T(Qr,2),ti=M(ei),ni=M(ti);re(ni,{size:13});var ri=T(ni,3),ii=M(ri,!0);k(ri),k(ti);var ai=T(ti,2),oi=T(M(ai),2),si=M(oi);si.value=si.__value=`default`;var ci=T(si);ci.value=ci.__value=`artist`;var li=T(ci);li.value=li.__value=`album`;var ui=T(li);ui.value=ui.__value=`year`;var di=T(ui);di.value=di.__value=`filename`;var fi=T(di);fi.value=fi.__value=`genre`;var pi=T(fi);pi.value=pi.__value=`season`,k(oi),k(ai),k(ei);var mi=T(ei,2);_e(mi,21,()=>S(W),te,(e,t,a)=>{var o=ut();let s;var c=M(o),l=M(c),u=e=>{n(e,it())},d=e=>{var t=at();t.textContent=a+1,n(e,t)};b(l,e=>{S(G).id===S(t).id&&P.isPlaying?e(u):e(d,-1)}),k(c);var f=T(c,2),p=T(f,2),h=M(p),g=M(h);let v;var te=M(g,!0);k(g);var re=T(g,2),ie=e=>{var t=ot();i(M(t),{size:10}),y(),k(t),n(e,t)};b(re,e=>{P.fetchErrors[S(t).id]&&e(ie)}),k(h);var ae=T(h,2),x=M(ae);k(ae),k(p);var oe=T(p,2),se=M(oe),ce=e=>{var r=lt(),i=M(r),a=e=>{var t=st();_(`click`,t,e=>{e.stopPropagation(),E(Et,!0)}),n(e,t)},o=e=>{var r=ct();j(()=>D(r,`href`,S(t).attrib)),_(`click`,r,e=>e.stopPropagation()),n(e,r)};b(i,e=>{S(t).id===`arigato`?e(a):e(o,-1)}),k(r),n(e,r)};b(se,e=>{S(t).attrib&&e(ce)});var le=T(se,2),de=M(le),C=e=>{ne(e,{size:12,class:`text-[#22c55e]`})},w=e=>{ue(e,{size:12})};b(de,e=>{S(Vt)===S(t).id?e(C):e(w,-1)}),k(le);var fe=T(le,2),pe=e=>{var i=et();let a;be(M(i),{size:12}),k(i),j(()=>{a=r(i,1,`tr-download-btn svelte-1o4jdf5`,null,a,{downloading:S(Wt)===S(t).id}),D(i,`title`,S(t).instrumental?`Download instrumental`:`Download track`)}),_(`click`,i,e=>Gt(e,S(t))),n(e,i)};b(fe,e=>{(S(t).instrumental||S(t).src)&&e(pe)}),k(oe),k(o),j(()=>{s=r(o,1,`track-row svelte-1o4jdf5`,null,s,{active:S(G).id===S(t).id,"kb-focused":S(K)===S(t).id,"fetch-error":P.fetchErrors[S(t).id]}),D(o,`data-track-id`,S(t).id),D(f,`src`,P.fetchErrors[S(t).id]||!S(t).cover?m:S(t).cover),D(f,`alt`,S(t).album),v=r(g,1,`tr-title svelte-1o4jdf5`,null,v,{"line-through":P.fetchErrors[S(t).id],"opacity-50":P.fetchErrors[S(t).id]}),N(te,S(t).title),N(x,`${S(t).artist??``} · ${S(t).album??``} (${(S(t).year||``)??``})`)}),_(`click`,o,()=>qt(S(t))),A(`error`,f,gt),ee(f),_(`click`,le,e=>Ut(e,S(t))),n(e,o)}),k(mi),k(Xr),k(bn),k(yn),y(2),k(fn);var hi=T(fn,2),gi=e=>{var t=pt(),i=M(t);ye(i,e=>E(B,e),()=>S(B));var a=T(i,2),o=e=>{n(e,dt())};b(a,e=>{!P.isPlaying&&!S(Tt)&&e(o)});var s=T(a,2),c=M(s);_e(c,21,()=>Ue,te,(e,t,i)=>{var a=ft(),o=M(a,!0);k(a),j(()=>{r(a,1,`px-2 py-1 rounded text-[9px] font-bold transition-all uppercase tracking-wider font-mono
                ${S(z)===i?`bg-purple-600 text-white`:`text-white/40 hover:text-white/80`}`,`svelte-1o4jdf5`),N(o,S(t).name)}),_(`click`,a,()=>E(z,i,!0)),n(e,a)}),k(c),k(s),k(t),_(`click`,t,e=>{e.stopPropagation(),E(wt,!1)}),_(`click`,s,e=>e.stopPropagation()),n(e,t)};b(hi,e=>{S(R)&&S(wt)&&e(gi)});var _i=T(hi,2);ye(_i,e=>E(q,e),()=>S(q));var vi=T(_i,2),yi=e=>{var r=mt(),i=M(r),a=M(i),o=T(M(a),2);de(M(o),{size:16}),k(o),k(a);var c=T(a,2),l=M(c),u=M(l);we(M(u),{size:14}),y(),k(u),k(l);var d=T(l,2);t(d,()=>Ot(S(Dt).intro),!0),k(d);var f=T(d,2),p=M(f);t(p,()=>Ot(S(Dt).tos),!0),k(p),k(f);var m=T(f,2);t(m,()=>Ot(S(Dt).outro),!0),k(m),k(c),k(i),k(r),_(`click`,r,()=>E(Et,!1)),_(`click`,i,e=>e.stopPropagation()),_(`click`,o,()=>E(Et,!1)),s(3,r,()=>he,()=>({duration:150})),n(e,r)};b(vi,e=>{S(Et)&&e(yi)}),k(dn),j((e,t)=>{pn=r(fn,1,`mp-container svelte-1o4jdf5`,null,pn,{closing:_t(),"theme-inst":P.isInstrumental}),Sn=r(xn,1,`player-side svelte-1o4jdf5`,null,Sn,{"tracklist-open":S(I)}),wn=r(Cn,1,`player-top-block transition-all duration-300 ease-in-out svelte-1o4jdf5`,null,wn,{"opacity-0":S(I),"scale-95":S(I),"pointer-events-none":S(I)}),En=r(Tn,1,`vinyl-wrapper relative overflow-hidden svelte-1o4jdf5`,null,En,{"deck-glitch":S(Ct)}),Bn=r(zn,1,`scroll-container svelte-1o4jdf5`,null,Bn,{overflowing:S(It)>S(Ft)}),x(zn,`--scroll-dist: -${S(It)-S(Ft)}px`),Hn=r(Vn,1,`track-title scroll-text svelte-1o4jdf5`,null,Hn,{"animate-scroll":S(It)>S(Ft)}),N(Un,S(G).title),Gn=r(Wn,1,`scroll-container svelte-1o4jdf5`,null,Gn,{overflowing:S(Rt)>S(Lt)}),x(Wn,`--scroll-dist: -${S(Rt)-S(Lt)}px`),qn=r(Kn,1,`track-artist scroll-text svelte-1o4jdf5`,null,qn,{"animate-scroll":S(Rt)>S(Lt)}),N(Jn,S(G).artist),Xn=r(Yn,1,`scroll-container svelte-1o4jdf5`,null,Xn,{overflowing:S(Bt)>S(zt)}),x(Yn,`--scroll-dist: -${S(Bt)-S(zt)}px`),Qn=r(Zn,1,`track-album scroll-text svelte-1o4jdf5`,null,Qn,{"animate-scroll":S(Bt)>S(zt)}),N($n,S(G).album),N(rr,e),D(or,`max`,P.duration||100),je(or,P.currentTime),N(cr,t),dr=r(ur,1,`ctrl ctrl-sm svelte-1o4jdf5`,null,dr,{"active-ctrl":P.isShuffled}),mr=r(pr,1,`ctrl ctrl-play svelte-1o4jdf5`,null,mr,{"ctrl-error":P.fetchErrors[S(G).id]}),D(pr,`aria-label`,P.isPlaying?`Pause`:`Play`),Sr=r(xr,1,`ctrl ctrl-sm svelte-1o4jdf5`,null,Sr,{"active-ctrl":P.repeatMode>0}),D(xr,`title`,P.repeatMode===1?`Repeat: all`:P.repeatMode===2?`Repeat: one`:P.repeatMode===3?`Stop after current track`:`Repeat: off`),kr=r(Or,1,`dj-crossfader svelte-1o4jdf5`,null,kr,{"fader-flash":S(en),"fader-fried":S(J)>=10}),jr=r(Ar,1,`fader-label left-label flex items-center gap-1 svelte-1o4jdf5`,null,jr,{active:!P.isInstrumental}),Pr=r(Nr,1,`dj-fader-knob svelte-1o4jdf5`,null,Pr,{right:P.isInstrumental,"knob-jiggle":S($t),fried:S(J)>=10}),Ir=r(Fr,1,`fader-label right-label flex items-center gap-1 svelte-1o4jdf5`,null,Ir,{active:P.isInstrumental}),Hr=r(Vr,1,`ctrl ctrl-xs svelte-1o4jdf5`,null,Hr,{"active-ctrl":S(R)}),r(Ur,1,`w-[90px] h-[20px] flex items-center justify-center rounded text-[9px] font-bold transition-all font-mono uppercase tracking-wider select-none cursor-pointer
                      ${S(R)?`bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/25 active:scale-95`:`bg-transparent border border-white/5 text-white/20 hover:text-white/40 hover:border-white/10`}`,`svelte-1o4jdf5`),D(Ur,`title`,S(R)?`Click to cycle presets`:`Click to enable visualizer`),N(Wr,Ue[S(z)].name),Zr=r(Xr,1,`tracklist-side svelte-1o4jdf5`,null,Zr,{"show-mobile":S(I)}),N(ii,S(U).length)},[()=>Zt(P.currentTime),()=>Zt(P.duration)]),_(`click`,dn,yt),_(`click`,fn,e=>e.stopPropagation()),_(`click`,gn,function(...e){ze?.apply(this,e)}),_(`click`,vn,function(...e){p.onClose?.apply(this,e)}),_(`click`,jn,Yt),_(`click`,Nn,e=>Ut(e,S(G))),Oe(Vn,`clientWidth`,e=>E(It,e)),Oe(zn,`clientWidth`,e=>E(Ft,e)),Oe(Kn,`clientWidth`,e=>E(Rt,e)),Oe(Wn,`clientWidth`,e=>E(Lt,e)),Oe(Zn,`clientWidth`,e=>E(Bt,e)),Oe(Yn,`clientWidth`,e=>E(zt,e)),_(`input`,or,e=>{P.seek(parseFloat(e.target.value))}),_(`change`,or,e=>{P.isPlaying||P.play(parseFloat(e.target.value))}),_(`click`,ur,()=>P.setShuffle(!P.isShuffled)),_(`click`,fr,()=>P.prevTrack()),_(`click`,pr,()=>P.togglePlay()),_(`click`,br,()=>P.nextTrack()),_(`click`,xr,()=>{P.repeatMode=(P.repeatMode+1)%4}),_(`click`,Or,Xt),_(`click`,Vr,()=>{E(R,!S(R))}),_(`click`,Ur,()=>{S(R)?E(z,(S(z)+1)%Ue.length):E(R,!0)}),_(`click`,Kr,()=>{E(xt,!S(xt))}),_(`click`,$r,()=>{E(I,!1)}),Pe(oi,()=>S(F),e=>E(F,e)),s(1,bn,()=>he,()=>({duration:120,delay:120})),s(2,bn,()=>he,()=>({duration:120})),n(e,dn),l()}p([`click`,`input`,`change`]);export{gt as default};