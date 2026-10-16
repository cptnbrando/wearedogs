import{$i as e,Ai as t,Bn as n,Ci as r,Cr as i,D as a,Di as o,Gi as s,H as c,I as l,K as u,Ki as d,Kr as f,L as p,Lt as m,Mi as h,Ni as g,O as _,Oi as v,Qi as y,Qr as b,Ri as x,Rr as ee,Rt as te,S as ne,Si as S,Tn as re,Tt as ie,Wi as ae,Wr as oe,Wt as se,Zi as C,Zr as ce,_i as le,ai as w,ar as ue,ca as T,cr as de,en as fe,fi as pe,gi as E,hn as me,ki as he,la as D,ln as ge,lt as _e,mi as ve,ni as ye,nr as be,oa as xe,oi as O,pi as Se,qi as k,qr as Ce,sa as we,sn as Te,st as Ee,ta as A,ti as De,tn as Oe,tt as ke,ua as j,ui as Ae,ut as je,vi as Me,wi as M,xi as N,yn as Ne,zi as P,zt as Pe}from"./vendor-B11YeUvQ.js";import{n as Fe,r as Ie,t as F}from"./AudioCore.svelte-_DQ9FB57.js";import{t as Le}from"./DogsLogo-pNvGNHHo.js";import{t as Re}from"./doubleTap-C15pvH0v.js";import{t as ze}from"./settingsManager.svelte-DEVyI9ur.js";var Be=class{constructor(e,t){j(this,`canvas`,null),j(this,`gl`,null),j(this,`analyser`,null),j(this,`program`,null),j(this,`animationFrameId`,null),j(this,`startTime`,0),j(this,`vertexBuffer`,null),j(this,`audioTexture`,null),j(this,`uniforms`,{}),j(this,`frequencyBuffer`,null),this.canvas=e,this.analyser=t,this.frequencyBuffer=new Uint8Array(t?t.frequencyBinCount:128),this.gl=e.getContext(`webgl`)||e.getContext(`experimental-webgl`),this.gl||console.error(`WebGL not supported by this browser.`)}init(e){if(!this.gl)return;let t=this.gl;this.cleanupProgram();let n=this.compileShader(t.VERTEX_SHADER,`
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `),r=this.compileShader(t.FRAGMENT_SHADER,e);if(!n||!r)return;if(this.program=t.createProgram(),t.attachShader(this.program,n),t.attachShader(this.program,r),t.linkProgram(this.program),!t.getProgramParameter(this.program,t.LINK_STATUS)){console.error(`Shader program linking failed:`,t.getProgramInfoLog(this.program));return}t.useProgram(this.program);let i=new Float32Array([-1,-1,1,-1,-1,1,1,1]);this.vertexBuffer=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,this.vertexBuffer),t.bufferData(t.ARRAY_BUFFER,i,t.STATIC_DRAW);let a=t.getAttribLocation(this.program,`a_position`);t.enableVertexAttribArray(a),t.vertexAttribPointer(a,2,t.FLOAT,!1,0,0),this.audioTexture=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.audioTexture),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),this.uniforms={time:t.getUniformLocation(this.program,`u_time`),resolution:t.getUniformLocation(this.program,`u_resolution`),volume:t.getUniformLocation(this.program,`u_volume`),bass:t.getUniformLocation(this.program,`u_bass`),mid:t.getUniformLocation(this.program,`u_mid`),treble:t.getUniformLocation(this.program,`u_treble`),audioTexture:t.getUniformLocation(this.program,`u_audioTexture`)},this.startTime=performance.now(),this.resize()}setPreset(e){this.init(e)}compileShader(e,t){if(!this.gl)return null;let n=this.gl,r=n.createShader(e);return n.shaderSource(r,t),n.compileShader(r),n.getShaderParameter(r,n.COMPILE_STATUS)?r:(console.error(`Shader compilation error (${e===n.VERTEX_SHADER?`VERTEX`:`FRAGMENT`}):`,n.getShaderInfoLog(r)),n.deleteShader(r),null)}start(){this.stop();let e=()=>{this.renderFrame(),this.animationFrameId=requestAnimationFrame(e)};this.animationFrameId=requestAnimationFrame(e)}stop(){this.animationFrameId&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null)}resize(){if(!this.gl||!this.canvas)return;let e=this.gl,t=this.canvas.clientWidth,n=this.canvas.clientHeight;(this.canvas.width!==t||this.canvas.height!==n)&&(this.canvas.width=t,this.canvas.height=n,e.viewport(0,0,t,n))}renderFrame(){if(!this.gl||!this.program)return;let e=this.gl;this.resize(),e.useProgram(this.program),e.bindBuffer(e.ARRAY_BUFFER,this.vertexBuffer);let t=(performance.now()-this.startTime)/1e3,n=0,r=0,i=0,a=0;if(this.analyser){this.analyser.getByteFrequencyData(this.frequencyBuffer);let t=this.frequencyBuffer.length,o=0,s=0,c=0;for(let e=0;e<t;e++){let t=this.frequencyBuffer[e];n+=t,e<12?(r+=t,o++):e<64?(i+=t,s++):(a+=t,c++)}n=n/t/255,r=o>0?r/o/255:0,i=s>0?i/s/255:0,a=c>0?a/c/255:0,e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.audioTexture),e.texImage2D(e.TEXTURE_2D,0,e.LUMINANCE,t,1,0,e.LUMINANCE,e.UNSIGNED_BYTE,this.frequencyBuffer)}e.uniform1f(this.uniforms.time,t),e.uniform2f(this.uniforms.resolution,this.canvas.width,this.canvas.height),e.uniform1f(this.uniforms.volume,n),e.uniform1f(this.uniforms.bass,r),e.uniform1f(this.uniforms.mid,i),e.uniform1f(this.uniforms.treble,a),e.uniform1i(this.uniforms.audioTexture,0),e.drawArrays(e.TRIANGLE_STRIP,0,4)}cleanupProgram(){this.gl&&this.program&&(this.gl.deleteProgram(this.program),this.program=null)}destroy(){this.stop();let e=this.gl;e&&(this.cleanupProgram(),this.vertexBuffer&&(e.deleteBuffer(this.vertexBuffer),this.vertexBuffer=null),this.audioTexture&&(e.deleteTexture(this.audioTexture),this.audioTexture=null)),this.canvas=null,this.gl=null,this.analyser=null}},Ve=[{id:`kaleidosync`,name:`Kaleidosync`,fragmentShader:`
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
    `}],He={id:`no-signal`,name:`No Signal`,fragmentShader:`
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
  `},Ue=`I understand the creator of this sick beat Nxnja has a copyright notice on his music distribution website.\r
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
`,We=M(`<div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 animate-pulse svelte-1o4jdf5"><div class="bg-black/75 border border-red-500/30 px-3 py-1.5 rounded text-[10px] font-mono tracking-widest text-red-500 font-bold uppercase shadow-[0_0_15px_rgba(239,68,68,0.25)] select-none svelte-1o4jdf5">NO SIGNAL</div></div>`),Ge=M(`<div class="visualizer-container cursor-pointer svelte-1o4jdf5"><canvas class="visualizer-canvas svelte-1o4jdf5"></canvas> <!> <div class="visualizer-hover-overlay svelte-1o4jdf5"><!></div></div>`),Ke=M(`<div class="visualizer-container bg-[#050508]/40 border border-white/5 flex items-center justify-center svelte-1o4jdf5"><!></div>`),qe=M(`<div class="vinyl-record-clicker cursor-pointer w-full h-full svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div><div class="groove g1 svelte-1o4jdf5"></div> <div class="groove g2 svelte-1o4jdf5"></div> <div class="groove g3 svelte-1o4jdf5"></div> <div class="groove g4 svelte-1o4jdf5"></div> <div class="record-label svelte-1o4jdf5"><img loading="lazy"/></div> <div class="spindle svelte-1o4jdf5"></div></div> <div></div></div>`),Je=M(`<div class="cassette-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="cassette-tape svelte-1o4jdf5"><div class="cassette-label bg-gradient-to-r from-purple-800 to-pink-700 svelte-1o4jdf5"><span class="cassette-track-title svelte-1o4jdf5"> </span> <span class="cassette-brand svelte-1o4jdf5">WEAREDOGS AUDIO</span></div> <div class="cassette-window bg-zinc-950/80 svelte-1o4jdf5"><div></div> <div></div> <div></div> <div></div></div></div></div>`),Ye=M(`<div class="floppy-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="floppy-disk svelte-1o4jdf5"><div class="floppy-corner svelte-1o4jdf5"></div> <div class="floppy-write-protect svelte-1o4jdf5"></div> <div class="floppy-label bg-slate-100 text-slate-900 svelte-1o4jdf5"><div class="floppy-label-stripe bg-red-600 svelte-1o4jdf5"></div> <div class="floppy-label-stripe-blue bg-blue-600 svelte-1o4jdf5"></div> <div class="floppy-label-content svelte-1o4jdf5"><div class="floppy-song truncate font-mono svelte-1o4jdf5"> </div> <div class="floppy-artist truncate font-mono svelte-1o4jdf5"> </div></div></div> <div class="floppy-shutter-door bg-zinc-700 svelte-1o4jdf5"><div></div> <div class="floppy-shutter-opening bg-zinc-950 svelte-1o4jdf5"><div></div></div></div> <div></div></div></div>`),Xe=M(`<div></div>`),Ze=M(`<div class="musicbox-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="music-box svelte-1o4jdf5"><div></div> <div class="music-box-interior border border-amber-900/40 svelte-1o4jdf5"><div class="music-box-gears svelte-1o4jdf5"><div></div> <div></div></div> <div class="music-box-drum-wrap svelte-1o4jdf5"><div><div class="music-box-pins svelte-1o4jdf5"><div class="pin pin-1 svelte-1o4jdf5"></div> <div class="pin pin-2 svelte-1o4jdf5"></div> <div class="pin pin-3 svelte-1o4jdf5"></div> <div class="pin pin-4 svelte-1o4jdf5"></div> <div class="pin pin-5 svelte-1o4jdf5"></div> <div class="pin pin-6 svelte-1o4jdf5"></div></div></div></div> <div class="music-box-comb svelte-1o4jdf5"></div></div></div></div>`),Qe=M(`<button aria-label="Download track"><!></button>`),$e=M(`<span></span>`),et=M(`<div class="spin-ring svelte-1o4jdf5"></div>`),tt=M(`<div class="volume-popover svelte-1o4jdf5"><button class="ctrl ctrl-xs mr-2 border border-white/10 rounded-full p-1 hover:bg-white/10 svelte-1o4jdf5" aria-label="Mute"><!></button> <input type="range" class="vol-slider-pop svelte-1o4jdf5" min="0" max="1" step="0.01" aria-label="Volume"/> <span class="text-[10px] font-bold text-white/60 min-w-[28px] text-right font-mono select-none svelte-1o4jdf5"> </span></div>`),nt=M(`<div class="eq svelte-1o4jdf5"><div class="eq-b svelte-1o4jdf5"></div> <div class="eq-b svelte-1o4jdf5"></div> <div class="eq-b svelte-1o4jdf5"></div></div>`),rt=M(`<span class="svelte-1o4jdf5"></span>`),it=M(`<span class="text-amber-400 flex items-center gap-1 text-[9px] font-bold tracking-wider uppercase bg-amber-500/10 px-1.5 py-0.5 rounded flex-shrink-0 svelte-1o4jdf5" title="Failed to fetch music source from remote database"><!> Error Fetching</span>`),at=M(`<button class="cursor-pointer svelte-1o4jdf5" style="background: none; border: none; padding: 0; color: inherit; font: inherit;">i</button>`),ot=M(`<a target="_blank" class="svelte-1o4jdf5">i</a>`),st=M(`<span class="inst-chip-link svelte-1o4jdf5"><!></span>`),ct=M(`<div><div class="tr-num svelte-1o4jdf5"><!></div> <img loading="lazy" class="tr-art svelte-1o4jdf5"/> <div class="tr-info svelte-1o4jdf5"><div class="flex items-center gap-1.5 min-w-0 svelte-1o4jdf5"><span> </span> <!></div> <span class="tr-meta svelte-1o4jdf5"> </span></div> <div class="flex items-center gap-2 flex-shrink-0 svelte-1o4jdf5"><!>  <button class="tr-share-btn svelte-1o4jdf5" title="Copy track link" aria-label="Share track"><!></button> <!></div></div>`),lt=M(`<div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 animate-pulse svelte-1o4jdf5"><div class="bg-black/75 border border-red-500/30 px-4 py-2 rounded text-[12px] font-mono tracking-widest text-red-500 font-bold uppercase shadow-[0_0_20px_rgba(239,68,68,0.3)] select-none svelte-1o4jdf5">NO SIGNAL</div></div>`),ut=M(`<button> </button>`),dt=M(`<div class="visualizer-container fullscreen cursor-pointer svelte-1o4jdf5"><canvas class="visualizer-canvas svelte-1o4jdf5"></canvas> <!> <div class="visualizer-overlay svelte-1o4jdf5"><div class="flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-lg p-1 border border-white/10 svelte-1o4jdf5"></div></div></div>`),ft=M(`<div class="arigato-modal-backdrop svelte-1o4jdf5"><div class="arigato-modal-content svelte-1o4jdf5"><header class="arigato-modal-header svelte-1o4jdf5"><h2 class="svelte-1o4jdf5">ARIGATO INFO</h2> <button class="arigato-close-btn svelte-1o4jdf5"><!></button></header> <div class="arigato-modal-body scroll-y svelte-1o4jdf5"><div class="merch-link-container svelte-1o4jdf5"><a href="https://nxnjaa.beatstars.com/" target="_blank" rel="noopener noreferrer" class="merch-link-btn svelte-1o4jdf5"><!> NXNJA MERCH & MUSIC</a></div> <p class="intro-text svelte-1o4jdf5"></p> <div class="tos-box svelte-1o4jdf5"><div class="tos-microtext svelte-1o4jdf5"></div></div> <p class="outro-text svelte-1o4jdf5"></p></div></div></div>`),pt=M(`<div class="mp-backdrop svelte-1o4jdf5"><div><header class="panel-header svelte-1o4jdf5"><div class="brand svelte-1o4jdf5"><button class="logo-btn svelte-1o4jdf5" aria-label="Open DOGS Info"><!></button> <h1 class="svelte-1o4jdf5"></h1></div> <button class="close-btn svelte-1o4jdf5" aria-label="Close panel"><!></button></header> <div class="mp-body svelte-1o4jdf5"><div class="songs-layout svelte-1o4jdf5"><div><div><div><!></div>  <div class="track-info mt-2 svelte-1o4jdf5"><div class="flex items-center justify-center gap-1.5 mb-1.5 svelte-1o4jdf5"><button class="player-share-btn svelte-1o4jdf5" title="Copy track link" aria-label="Share track"><!></button> <!></div> <div><h2> </h2></div> <div><p> </p></div> <div><p> </p></div></div></div> <div class="player-controls-block svelte-1o4jdf5"><div class="progress-row svelte-1o4jdf5"><span class="ptime svelte-1o4jdf5"> </span> <div class="progress-wrap waveform-slider-wrap relative h-9 flex items-end svelte-1o4jdf5"><div class="waveform-bars flex items-end justify-between absolute inset-0 pointer-events-none px-1 h-full svelte-1o4jdf5"></div> <input type="range" class="seek-input absolute inset-0 opacity-0 cursor-pointer w-full h-full svelte-1o4jdf5" min="0" step="0.1" aria-label="Seek"/></div> <span class="ptime svelte-1o4jdf5"> </span></div> <div class="controls-row svelte-1o4jdf5"><button aria-label="Shuffle"><!></button> <button class="ctrl ctrl-md svelte-1o4jdf5" aria-label="Previous"><!></button> <button><!></button> <button class="ctrl ctrl-md svelte-1o4jdf5" aria-label="Next"><!></button> <button aria-label="Repeat"><!></button></div> <div class="w-full flex flex-col items-center gap-1.5 mt-2 px-1 svelte-1o4jdf5"><div><span><!> <span class="svelte-1o4jdf5">VOCAL</span></span> <div class="dj-fader-slot relative svelte-1o4jdf5"><div></div></div> <span><!> <span class="svelte-1o4jdf5">INST</span></span></div></div> <div class="relative flex justify-center items-center gap-3 mt-2 w-full svelte-1o4jdf5"><!> <div class="flex items-center gap-1.5 svelte-1o4jdf5"><button aria-label="Toggle Visualizer"><!></button> <button> </button></div> <div class="relative svelte-1o4jdf5"><button class="ctrl ctrl-xs vol-toggle-btn svelte-1o4jdf5" aria-label="Toggle volume slider"><!></button></div></div></div></div> <div><div class="mobile-close-bar hidden py-2 px-4 border-b border-white/5 flex items-center justify-between svelte-1o4jdf5"><span class="text-xs font-bold text-white/50 svelte-1o4jdf5">Track Library</span> <button class="px-3 py-1 bg-white/5 text-white/75 rounded-lg text-xs font-bold svelte-1o4jdf5">Back to player</button></div> <div class="tl-header flex justify-between items-center gap-3 svelte-1o4jdf5"><div class="flex items-center gap-2 svelte-1o4jdf5"><!><span class="svelte-1o4jdf5">TRACKS</span> <span class="tl-count svelte-1o4jdf5"> </span></div> <div class="flex items-center gap-1.5 ml-auto svelte-1o4jdf5"><span class="text-[9px] text-white/30 font-bold font-sans svelte-1o4jdf5">SORT BY:</span> <select class="bg-black/40 border border-white/10 rounded px-1.5 py-0.5 text-[10px] font-bold text-white/60 outline-none cursor-pointer hover:border-white/20 transition-all font-sans svelte-1o4jdf5"><option class="svelte-1o4jdf5">DEFAULT</option><option class="svelte-1o4jdf5">ARTIST</option><option class="svelte-1o4jdf5">ALBUM</option><option class="svelte-1o4jdf5">YEAR</option><option class="svelte-1o4jdf5">FILENAME</option><option class="svelte-1o4jdf5">GENRE</option><option class="svelte-1o4jdf5">SEASON</option></select></div></div> <div class="tracklist scroll-y svelte-1o4jdf5"></div></div></div></div> <footer class="mp-footer svelte-1o4jdf5"><div class="mp-status svelte-1o4jdf5"><span class="mp-dot svelte-1o4jdf5"></span><span class="svelte-1o4jdf5">🐕</span></div> <span class="svelte-1o4jdf5">MUSIC</span></footer></div> <!> <canvas class="fader-fx-canvas pointer-events-none svelte-1o4jdf5"></canvas> <!></div>`);function mt(o,j){we(j,!0);let M=`/img/error_cover.png`;function mt(e){e.target.src.endsWith(M)||(e.target.src=M)}let ht=oe(j,`isClosing`,3,!1),gt=oe(j,`initialTrackId`,3,null),_t=Re(()=>j.onClose()),I=y(`default`),L=y(!1),vt=y(!1),yt=y(!1),bt=y(null),xt=A(()=>!!F.fetchErrors[F.library[F.currentTrackIndex]?.id]),R=A(()=>F.isPlaying&&!ht()&&!h(xt)),z=y(!1),B=y(0),St=y(!1),Ct=y(null),V=null,H=!1,wt=y(!1),Tt=y(!1),Et=A(()=>{let e=Ue.split(/`{5,}/);return{intro:e[0]||``,tos:e[1]||``,outro:e[2]||``}});function Dt(e){if(!e)return``;let t=e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`);return t=t.replace(/(https?:\/\/[^\s]+)/g,`<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>`),t=t.replace(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/g,`<a href="mailto:$1">$1</a>`),t.replace(/\n/g,`<br>`)}let Ot=A(()=>{let e=h(G);if(!e)return Array(60).fill(10);if(F.waveformPeaks[e.id])return F.waveformPeaks[e.id];let t=e.id,n=[],r=0;for(let e=0;e<t.length;e++)r=(r<<5)-r+t.charCodeAt(e),r|=0;let i=Math.abs(r)%1e3;for(let e=0;e<60;e++){let t=e/59,r=Math.sin(i+t*Math.PI*4),a=Math.cos(i*1.5+t*Math.PI*10)*.4,o=Math.sin(i*2.3+t*Math.PI*22)*.15,s=Math.abs(r+a+o)/1.55,c=Math.sin(t*Math.PI),l=(s*70+15)*c;n.push(Math.max(10,Math.round(l)))}return n});P(()=>{window.innerWidth<=640&&h(z)&&h(B)===0&&g(()=>h(L))&&C(L,!1)}),P(()=>{F.isPlaying&&C(wt,!0)});let kt=A(()=>!F.isPlaying&&!h(wt)?He.fragmentShader:Ve[h(B)].fragmentShader);P(()=>{let e=F.analyser;return h(z)&&h(Ct)&&!ht()&&(V=new Be(h(Ct),e),V.init(h(kt)),V.start()),()=>{V&&(V.destroy(),V=null)}}),P(()=>{let e=h(kt);V&&h(z)&&(V.setPreset(e),V.start())}),P(()=>{h(L)?!history.state?.tracklistOpen&&!H&&(history.pushState({tracklistOpen:!0},``),H=!0):H&&(history.back(),H=!1)}),le(()=>{H&&(history.back(),H=!1)});function At(e){!e.state?.tracklistOpen&&h(L)&&(C(L,!1),H=!1)}function jt(e){h(yt)&&h(bt)&&!h(bt).contains(e.target)&&!e.target.closest(`.vol-toggle-btn`)&&C(yt,!1)}let U=A(()=>Fe.unlocked?Ie:Ie.filter(e=>e.public!==!1));function Mt(e){return e.src?e.src.split(`/`).pop():``}function Nt(e){if(!e.dateAdded)return`Summer`;let t=new Date(e.dateAdded).getMonth();return t===11||t===0||t===1?`Winter`:t>=2&&t<=4?`Spring`:t>=5&&t<=7?`Summer`:`Fall`}let W=A(()=>{let e=[...h(U)];return h(I)===`artist`?e.sort((e,t)=>e.artist.localeCompare(t.artist)):h(I)===`album`?e.sort((e,t)=>e.album.localeCompare(t.album)):h(I)===`year`?e.sort((e,t)=>(e.year||0)-(t.year||0)):h(I)===`filename`?e.sort((e,t)=>Mt(e).localeCompare(Mt(t))):h(I)===`genre`?e.sort((e,t)=>(e.genre||``).localeCompare(t.genre||``)):h(I)===`season`&&e.sort((e,t)=>Nt(e).localeCompare(Nt(t))),e}),G=A(()=>h(U)[F.currentTrackIndex]??h(U)[0]);P(()=>{let e=h(U);if(F.library===e||F.library.length===0)return;let t=F.library[F.currentTrackIndex]?.id;F.init(e);let n=e.findIndex(e=>e.id===t);n===-1?(F.pause(),F.loadTrack(0,!1)):F.currentTrackIndex=n});let Pt=y(0),Ft=y(0),It=y(0),Lt=y(0),Rt=y(0),zt=y(0),Bt=y(null),Vt=null;function Ht(e,t){e.stopPropagation();let n=`${window.location.origin}/music/${t.id}`;navigator.clipboard.writeText(n).then(()=>{C(Bt,t.id,!0),Vt&&clearTimeout(Vt),Vt=setTimeout(()=>{C(Bt,null)},2e3)}).catch(e=>{console.error(`Failed to copy share link:`,e)})}let Ut=y(null);async function Wt(e,t){e.stopPropagation();let n=t.instrumental||t.src;if(!(!n||h(Ut))){C(Ut,t.id,!0);try{let e=await fetch(n,Fe.fetchOptionsFor(n));if(!e.ok)throw Error(`Fetch failed with status ${e.status}`);let r=URL.createObjectURL(await e.blob()),i=document.createElement(`a`);i.href=r,i.download=decodeURIComponent(n.split(`/`).pop()||``)||`${t.id}.mp3`,document.body.appendChild(i),i.click(),i.remove(),setTimeout(()=>URL.revokeObjectURL(r),6e4)}catch(e){console.error(`Failed to download track:`,e)}finally{C(Ut,null)}}}le(()=>{Vt&&clearTimeout(Vt)}),Me(()=>{if(Fe.revalidate(),F.init(h(U)),gt()){let e=h(U).findIndex(e=>e.id===gt());e!==-1&&F.loadTrack(e,!0)}else if(!F.hasPickedRandomTrack){F.hasPickedRandomTrack=!0;let e=Math.floor(Math.random()*h(U).length);F.loadTrack(e,!1)}});let K=y(null);function Gt(){let e=document.querySelector(`.track-row[data-track-id="${h(K)}"]`);e&&e.scrollIntoView({block:`nearest`,behavior:`smooth`})}function Kt(e){C(K,e.id,!0);let t=h(U).findIndex(t=>t.id===e.id);F.currentTrackIndex===t&&!F.fetchErrors[e.id]?F.togglePlay():F.loadTrack(t,!0)}function qt(){window.innerWidth<=640?C(L,!0):C(z,!h(z))}function Jt(e){window.innerWidth>640||e.target.closest(`.scroll-container`)&&C(L,!0)}function Yt(){let t=!F.isInstrumental;F.setCrossfade(t)||(e(J),h(Qt)||(C(Qt,!0),setTimeout(()=>{C(Qt,!1)},300)),h(J)===5?(ln(),C($t,!0),setTimeout(()=>{C($t,!1)},150)):h(J)===10?ln(35):h(J)>5&&h(J)<10?ln(8):h(J)>10&&Math.random()<.4&&ln(3))}function Xt(e){return!e||isNaN(e)?`0:00`:`${Math.floor(e/60)}:${Math.floor(e%60).toString().padStart(2,`0`)}`}function Zt(e){let t=document.activeElement;if(!(t&&(t.tagName===`INPUT`||t.tagName===`TEXTAREA`||t.isContentEditable))){if(e.code===`Space`||e.key===` `)e.preventDefault(),F.togglePlay();else if(e.key===`ArrowDown`){if(h(W).length>0){e.preventDefault();let t=h(W).findIndex(e=>e.id===h(K));if(t===-1){let e=h(U)[F.currentTrackIndex];t=h(W).findIndex(t=>t.id===e?.id)}let n=(t+1)%h(W).length;C(K,h(W)[n].id,!0),Gt()}}else if(e.key===`ArrowUp`){if(h(W).length>0){e.preventDefault();let t=h(W).findIndex(e=>e.id===h(K));if(t===-1){let e=h(U)[F.currentTrackIndex];t=h(W).findIndex(t=>t.id===e?.id)}let n=(t-1+h(W).length)%h(W).length;C(K,h(W)[n].id,!0),Gt()}}else if(e.key===`Enter`&&h(K)){e.preventDefault();let t=h(W).find(e=>e.id===h(K));t&&Kt(t)}}}let q=y(null),J=y(0),Qt=y(!1),$t=y(!1),Y,X,Z,Q=[],$=[],en,tn=y(!1);P(()=>(h(q)&&an(),()=>{en&&cancelAnimationFrame(en),window.removeEventListener(`resize`,on),window.visualViewport?.removeEventListener(`resize`,on),Z&&(Z.dispose(),Z=null),Y=null,X=null,Q=[],$=[]})),P(()=>{if(F.currentTrackIndex,ht(),C(J,0),C(tn,!1),Y){for(let e of Q)Y.remove(e.mesh);for(let e of $)Y.remove(e.mesh)}Q=[],$=[]});function nn(){if(!h(q))return{width:window.innerWidth,height:window.innerHeight};let e=h(q).getBoundingClientRect();return{width:e.width||window.innerWidth,height:e.height||window.innerHeight}}function rn(){let{width:e,height:t}=nn(),n=document.querySelector(`.dj-fader-knob`);if(!n)return{x:e/2,y:t/2};let r=h(q)?h(q).getBoundingClientRect():{left:0,top:0},i=n.getBoundingClientRect();return{x:i.left+i.width/2-r.left,y:t-(i.top+i.height/2-r.top)}}function an(){if(!h(q))return;let{width:e,height:t}=nn();h(q).width=e,h(q).height=t,Y=new u,X=new c(0,e,t,0,-1,1),Z=new ne({canvas:h(q),alpha:!0,antialias:!0}),Z.setSize(e,t,!1),Z.setPixelRatio(Math.min(window.devicePixelRatio,2)),window.addEventListener(`resize`,on),window.visualViewport?.addEventListener(`resize`,on),sn()}function on(){if(!h(q)||!Z||!X)return;let{width:e,height:t}=nn();h(q).width=e,h(q).height=t,Z.setSize(e,t,!1),X.right=e,X.top=t,X.updateProjectionMatrix()}function sn(){if(en=requestAnimationFrame(sn),!(!Y||!X||!Z||!h(q))){if(h(J)>=10&&(C(tn,!0),Math.random()<.22)){let e=rn();cn(e.x,e.y)}for(let e=Q.length-1;e>=0;e--){let t=Q[e];t.x+=t.vx,t.y+=t.vy,t.vy+=t.ay,t.life-=t.decay,t.mesh.position.set(t.x,t.y,0),t.mesh.material.opacity=t.life,t.life<=0&&(Y.remove(t.mesh),t.mesh.geometry.dispose(),t.mesh.material.dispose(),Q.splice(e,1))}for(let e=$.length-1;e>=0;e--){let t=$[e];t.x+=t.vx,t.y+=t.vy,t.life-=t.decay;let n=t.startScale+(1-t.life)*88;t.mesh.scale.set(n,n,1),t.mesh.position.set(t.x,t.y,0),t.mesh.material.opacity=t.life*.16,t.life<=0&&(Y.remove(t.mesh),t.mesh.geometry.dispose(),t.mesh.material.dispose(),$.splice(e,1))}Z.render(Y,X)}}function cn(e,t){if(!Y)return;let n=new a(5,8),r=.85+Math.random()*.12,i=new l(n,new p({color:new _(r,r,r*1.01),transparent:!0,opacity:.06,blending:1}));i.position.set(e,t,0),Y.add(i),$.push({mesh:i,x:e,y:t,vx:(Math.random()-.5)*.55+Math.sin(Date.now()*.001)*.22,vy:Math.random()*.7+1.25,startScale:1,life:1,decay:6e-4+Math.random()*4e-4})}function ln(e=25){if(!Y||!h(q))return;let t=rn(),n=t.x,r=t.y;for(let t=0;t<e;t++){let e=new l(new a(1.3,4),new p({color:new _(Math.random()<.4?16711765:16755200),transparent:!0,opacity:1,blending:2}));e.position.set(n,r,0),Y.add(e);let t=Math.random()*Math.PI*2,i=Math.random()*4+2;Q.push({mesh:e,x:n,y:r,vx:Math.cos(t)*i,vy:Math.sin(t)*i,ay:-.15,life:1,decay:.02+Math.random()*.02})}}var un=pt();he(`keydown`,ae,Zt),he(`popstate`,ae,At),he(`click`,ae,jt);var dn=s(un);let fn;var pn=s(dn),mn=s(pn),hn=s(mn);Le(s(hn),{size:`panel`}),D(hn);var gn=k(hn,2);gn.textContent=`MUSIC`,D(mn);var _n=k(mn,2);ee(s(_n),{size:20}),D(_n),D(pn);var vn=k(pn,2),yn=s(vn),bn=s(yn);let xn;var Sn=s(bn);let Cn;var wn=s(Sn);let Tn;var En=s(wn),Dn=e=>{var t=Ge(),n=s(t);f(n,e=>C(Ct,e),()=>h(Ct));var r=k(n,2),i=e=>{S(e,We())};E(r,e=>{!F.isPlaying&&!h(wt)&&e(i)});var a=k(r,2);Ne(s(a),{size:16,class:`text-white/70`}),D(a),D(t),v(`click`,t,()=>{C(St,!0)}),S(e,t)},On=e=>{var t=Ke();Ne(s(t),{size:16,class:`text-white/20`}),D(t),S(e,t)},kn=e=>{var n=r(),i=d(n),a=e=>{var n=qe(),r=s(n);let i;var a=k(s(r),8),o=s(a);let c;D(a),T(2),D(r);var l=k(r,2);let u;D(n),x(()=>{i=O(r,1,`vinyl-record svelte-1o4jdf5`,null,i,{spinning:h(R)}),b(o,`src`,F.fetchErrors[h(G).id]||!h(G).cover?M:h(G).cover),b(o,`alt`,h(G).album),c=O(o,1,`record-art svelte-1o4jdf5`,null,c,{loaded:h(vt)}),u=O(l,1,`tonearm svelte-1o4jdf5`,null,u,{playing:h(R)})}),v(`click`,n,qt),he(`load`,o,()=>C(vt,!0)),he(`error`,o,mt),t(o),S(e,n)},o=e=>{let t=A(()=>F.duration>0?(1-F.currentTime/F.duration)*.45+.25:.48),n=A(()=>F.duration>0?F.currentTime/F.duration*.45+.25:.48);var r=Je(),i=s(r),a=s(i),o=s(a),c=s(o,!0);D(o),T(2),D(a);var l=k(a,2),u=s(l);let d;var f=k(u,2);let p;var m=k(f,2);let g;var _=k(m,2);let y;D(l),D(i),D(r),x(()=>{N(c,h(G).title),d=O(u,1,`spindle-left bg-zinc-900 svelte-1o4jdf5`,null,d,{spinning:h(R)}),p=O(f,1,`tape-roll-left bg-amber-950/70 svelte-1o4jdf5`,null,p,{spinning:h(R)}),w(f,`width: ${h(t)*46}px; height: ${h(t)*46}px;`),g=O(m,1,`spindle-right bg-zinc-900 svelte-1o4jdf5`,null,g,{spinning:h(R)}),y=O(_,1,`tape-roll-right bg-amber-950/70 svelte-1o4jdf5`,null,y,{spinning:h(R)}),w(_,`width: ${h(n)*46}px; height: ${h(n)*46}px;`)}),v(`click`,r,qt),S(e,r)},c=e=>{var t=Ye(),n=s(t),r=k(s(n),4),i=k(s(r),4),a=s(i),o=s(a,!0);D(a);var c=k(a,2),l=s(c,!0);D(c),D(i),D(r);var u=k(r,2),d=s(u);let f;var p=k(d,2),m=s(p);let g;D(p),D(u);var _=k(u,2);let y;D(n),D(t),x(()=>{N(o,h(G).title),N(l,h(G).artist||`WEAREDOGS`),f=O(d,1,`floppy-shutter-slider bg-zinc-400 svelte-1o4jdf5`,null,f,{open:h(R)}),g=O(m,1,`floppy-magnetic-disc bg-zinc-900 svelte-1o4jdf5`,null,g,{spinning:h(R)}),y=O(_,1,`floppy-drive-led svelte-1o4jdf5`,null,y,{active:h(R)})}),v(`click`,t,qt),S(e,t)},l=e=>{var t=Ze(),n=s(t),r=s(n);let i;var a=k(r,2),o=s(a),c=s(o);let l;var u=k(c,2);let d;D(o);var f=k(o,2),p=s(f);let m;D(f);var g=k(f,2);Se(g,20,()=>Array(10),ve,(e,t,n)=>{var r=Xe();let i;x(e=>i=O(r,1,`comb-tooth svelte-1o4jdf5`,null,i,e),[()=>({vibrating:h(R)&&n%3==Math.floor(F.currentTime*4)%3})]),S(e,r)}),D(g),D(a),D(n),D(t),x(()=>{i=O(r,1,`music-box-key svelte-1o4jdf5`,null,i,{spinning:h(R)}),l=O(c,1,`music-box-gear gear-1 svelte-1o4jdf5`,null,l,{spinning:h(R)}),d=O(u,1,`music-box-gear gear-2 svelte-1o4jdf5`,null,d,{spinning:h(R)}),m=O(p,1,`music-box-drum bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 svelte-1o4jdf5`,null,m,{spinning:h(R)})}),v(`click`,t,qt),S(e,t)};E(i,e=>{ze.musicDeckModel===`vinyl`?e(a):ze.musicDeckModel===`cassette`?e(o,1):ze.musicDeckModel===`floppy`?e(c,2):ze.musicDeckModel===`musicbox`&&e(l,3)}),S(e,n)};E(En,e=>{h(z)&&!h(St)?e(Dn):h(z)&&h(St)?e(On,1):e(kn,-1)}),D(wn);var An=k(wn,2),jn=s(An),Mn=s(jn),Nn=s(Mn),Pn=e=>{i(e,{size:12,class:`text-[#22c55e]`})},Fn=e=>{se(e,{size:12})};E(Nn,e=>{h(Bt)===h(G).id?e(Pn):e(Fn,-1)}),D(Mn);var In=k(Mn,2),Ln=e=>{var t=Qe();let n;ue(s(t),{size:12}),D(t),x(()=>{n=O(t,1,`player-download-btn svelte-1o4jdf5`,null,n,{downloading:h(Ut)===h(G).id}),b(t,`title`,h(G).instrumental?`Download instrumental`:`Download track`)}),v(`click`,t,e=>Wt(e,h(G))),S(e,t)};E(In,e=>{(h(G).instrumental||h(G).src)&&e(Ln)}),D(jn);var Rn=k(jn,2);let zn;var Bn=s(Rn);let Vn;var Hn=s(Bn,!0);D(Bn),D(Rn);var Un=k(Rn,2);let Wn;var Gn=s(Un);let Kn;var qn=s(Gn,!0);D(Gn),D(Un);var Jn=k(Un,2);let Yn;var Xn=s(Jn);let Zn;var Qn=s(Xn,!0);D(Xn),D(Jn),D(An),D(Sn);var $n=k(Sn,2),er=s($n),tr=s(er),nr=s(tr,!0);D(tr);var rr=k(tr,2),ir=s(rr);Se(ir,21,()=>h(Ot),ve,(e,t,n)=>{let r=A(()=>F.duration>0?F.currentTime/F.duration:0),i=A(()=>n/60);var a=$e();let o;x(()=>{o=O(a,1,`waveform-bar transition-colors duration-100 rounded-full svelte-1o4jdf5`,null,o,{active:h(i)<=h(r)}),w(a,`height: ${h(t)??``}%; width: 3px;`)}),S(e,a)}),D(ir);var ar=k(ir,2);ce(ar),D(rr);var or=k(rr,2),sr=s(or,!0);D(or),D(er);var cr=k(er,2),lr=s(cr);let ur;Pe(s(lr),{size:15}),D(lr);var dr=k(lr,2);te(s(dr),{size:19}),D(dr);var fr=k(dr,2);let pr;var mr=s(fr),hr=e=>{ie(e,{size:22})},gr=e=>{S(e,et())},_r=e=>{ge(e,{size:22,fill:`currentColor`})},vr=e=>{Te(e,{size:22,fill:`currentColor`})};E(mr,e=>{F.fetchErrors[h(G).id]?e(hr):F.isLoading?e(gr,1):F.isPlaying?e(_r,2):e(vr,-1)}),D(fr);var yr=k(fr,2);m(s(yr),{size:19}),D(yr);var br=k(yr,2);let xr;var Sr=s(br),Cr=e=>{Oe(e,{size:15})},wr=e=>{de(e,{size:15})},Tr=e=>{fe(e,{size:15})};E(Sr,e=>{F.repeatMode===2?e(Cr):F.repeatMode===3?e(wr,1):e(Tr,-1)}),D(br),D(cr);var Er=k(cr,2),Dr=s(Er);let Or;var kr=s(Dr);let Ar;me(s(kr),{size:12}),T(2),D(kr);var jr=k(kr,2),Mr=s(jr);let Nr;D(jr);var Pr=k(jr,2);let Fr;n(s(Pr),{size:12}),T(2),D(Pr),D(Dr),D(Er);var Ir=k(Er,2),Lr=s(Ir),Rr=e=>{var t=tt(),n=s(t),r=s(n),i=e=>{_e(e,{size:12,class:`text-red-400`})},a=e=>{je(e,{size:12})};E(r,e=>{F.isMuted||F.volume===0?e(i):e(a,-1)}),D(n);var o=k(n,2);ce(o);var c=k(o,2),l=s(c);D(c),D(t),f(t,e=>C(bt,e),()=>h(bt)),x(e=>{De(o,F.volume),N(l,`${e??``}%`)},[()=>Math.round(F.volume*100)]),v(`click`,n,()=>F.toggleMute()),v(`input`,o,e=>F.setVolume(parseFloat(e.target.value))),S(e,t)};E(Lr,e=>{h(yt)&&e(Rr)});var zr=k(Lr,2),Br=s(zr);let Vr;Ee(s(Br),{size:13}),D(Br);var Hr=k(Br,2),Ur=s(Hr,!0);D(Hr),D(zr);var Wr=k(zr,2),Gr=s(Wr),Kr=s(Gr),qr=e=>{_e(e,{size:13,class:`text-red-400`})},Jr=e=>{je(e,{size:13})};E(Kr,e=>{F.isMuted||F.volume===0?e(qr):e(Jr,-1)}),D(Gr),D(Wr),D(Ir),D($n),D(bn);var Yr=k(bn,2);let Xr;var Zr=s(Yr),Qr=k(s(Zr),2);D(Zr);var $r=k(Zr,2),ei=s($r),ti=s(ei);re(ti,{size:13});var ni=k(ti,3),ri=s(ni,!0);D(ni),D(ei);var ii=k(ei,2),ai=k(s(ii),2),oi=s(ai);oi.value=oi.__value=`default`;var si=k(oi);si.value=si.__value=`artist`;var ci=k(si);ci.value=ci.__value=`album`;var li=k(ci);li.value=li.__value=`year`;var ui=k(li);ui.value=ui.__value=`filename`;var di=k(ui);di.value=di.__value=`genre`;var fi=k(di);fi.value=fi.__value=`season`,D(ai),D(ii),D($r);var pi=k($r,2);Se(pi,21,()=>h(W),ve,(e,n,r)=>{var a=ct();let o;var c=s(a),l=s(c),u=e=>{S(e,nt())},d=e=>{var t=rt();t.textContent=r+1,S(e,t)};E(l,e=>{h(G).id===h(n).id&&F.isPlaying?e(u):e(d,-1)}),D(c);var f=k(c,2),p=k(f,2),m=s(p),g=s(m);let _;var y=s(g,!0);D(g);var ee=k(g,2),te=e=>{var t=it();ie(s(t),{size:10}),T(),D(t),S(e,t)};E(ee,e=>{F.fetchErrors[h(n).id]&&e(te)}),D(m);var ne=k(m,2),re=s(ne);D(ne),D(p);var ae=k(p,2),oe=s(ae),ce=e=>{var t=st(),r=s(t),i=e=>{var t=at();v(`click`,t,e=>{e.stopPropagation(),C(Tt,!0)}),S(e,t)},a=e=>{var t=ot();x(()=>b(t,`href`,h(n).attrib)),v(`click`,t,e=>e.stopPropagation()),S(e,t)};E(r,e=>{h(n).id===`arigato`?e(i):e(a,-1)}),D(t),S(e,t)};E(oe,e=>{h(n).attrib&&e(ce)});var le=k(oe,2),w=s(le),de=e=>{i(e,{size:12,class:`text-[#22c55e]`})},fe=e=>{se(e,{size:12})};E(w,e=>{h(Bt)===h(n).id?e(de):e(fe,-1)}),D(le);var pe=k(le,2),me=e=>{var t=Qe();let r;ue(s(t),{size:12}),D(t),x(()=>{r=O(t,1,`tr-download-btn svelte-1o4jdf5`,null,r,{downloading:h(Ut)===h(n).id}),b(t,`title`,h(n).instrumental?`Download instrumental`:`Download track`)}),v(`click`,t,e=>Wt(e,h(n))),S(e,t)};E(pe,e=>{(h(n).instrumental||h(n).src)&&e(me)}),D(ae),D(a),x(()=>{o=O(a,1,`track-row svelte-1o4jdf5`,null,o,{active:h(G).id===h(n).id,"kb-focused":h(K)===h(n).id,"fetch-error":F.fetchErrors[h(n).id]}),b(a,`data-track-id`,h(n).id),b(f,`src`,F.fetchErrors[h(n).id]||!h(n).cover?M:h(n).cover),b(f,`alt`,h(n).album),_=O(g,1,`tr-title svelte-1o4jdf5`,null,_,{"line-through":F.fetchErrors[h(n).id],"opacity-50":F.fetchErrors[h(n).id]}),N(y,h(n).title),N(re,`${h(n).artist??``} · ${h(n).album??``} (${(h(n).year||``)??``})`)}),v(`click`,a,()=>Kt(h(n))),he(`error`,f,mt),t(f),v(`click`,le,e=>Ht(e,h(n))),S(e,a)}),D(pi),D(Yr),D(yn),D(vn),T(2),D(dn);var mi=k(dn,2),hi=e=>{var t=dt(),n=s(t);f(n,e=>C(Ct,e),()=>h(Ct));var r=k(n,2),i=e=>{S(e,lt())};E(r,e=>{!F.isPlaying&&!h(wt)&&e(i)});var a=k(r,2),o=s(a);Se(o,21,()=>Ve,ve,(e,t,n)=>{var r=ut(),i=s(r,!0);D(r),x(()=>{O(r,1,`px-2 py-1 rounded text-[9px] font-bold transition-all uppercase tracking-wider font-mono
                ${h(B)===n?`bg-purple-600 text-white`:`text-white/40 hover:text-white/80`}`,`svelte-1o4jdf5`),N(i,h(t).name)}),v(`click`,r,()=>C(B,n,!0)),S(e,r)}),D(o),D(a),D(t),v(`click`,t,e=>{e.stopPropagation(),C(St,!1)}),v(`click`,a,e=>e.stopPropagation()),S(e,t)};E(mi,e=>{h(z)&&h(St)&&e(hi)});var gi=k(mi,2);f(gi,e=>C(q,e),()=>h(q));var _i=k(gi,2),vi=e=>{var t=ft(),n=s(t),r=s(n),i=k(s(r),2);ee(s(i),{size:16}),D(i),D(r);var a=k(r,2),o=s(a),c=s(o);be(s(c),{size:14}),T(),D(c),D(o);var l=k(o,2);pe(l,()=>Dt(h(Et).intro),!0),D(l);var u=k(l,2),d=s(u);pe(d,()=>Dt(h(Et).tos),!0),D(d),D(u);var f=k(u,2);pe(f,()=>Dt(h(Et).outro),!0),D(f),D(a),D(n),D(t),v(`click`,t,()=>C(Tt,!1)),v(`click`,n,e=>e.stopPropagation()),v(`click`,i,()=>C(Tt,!1)),Ae(3,t,()=>ke,()=>({duration:150})),S(e,t)};E(_i,e=>{h(Tt)&&e(vi)}),D(un),x((e,t)=>{fn=O(dn,1,`mp-container svelte-1o4jdf5`,null,fn,{closing:ht(),"theme-inst":F.isInstrumental}),xn=O(bn,1,`player-side svelte-1o4jdf5`,null,xn,{"tracklist-open":h(L)}),Cn=O(Sn,1,`player-top-block transition-all duration-300 ease-in-out svelte-1o4jdf5`,null,Cn,{"opacity-0":h(L),"scale-95":h(L),"pointer-events-none":h(L)}),Tn=O(wn,1,`vinyl-wrapper relative overflow-hidden svelte-1o4jdf5`,null,Tn,{"deck-glitch":h(xt)}),zn=O(Rn,1,`scroll-container svelte-1o4jdf5`,null,zn,{overflowing:h(Ft)>h(Pt)}),w(Rn,`--scroll-dist: -${h(Ft)-h(Pt)}px`),Vn=O(Bn,1,`track-title scroll-text svelte-1o4jdf5`,null,Vn,{"animate-scroll":h(Ft)>h(Pt)}),N(Hn,h(G).title),Wn=O(Un,1,`scroll-container svelte-1o4jdf5`,null,Wn,{overflowing:h(Lt)>h(It)}),w(Un,`--scroll-dist: -${h(Lt)-h(It)}px`),Kn=O(Gn,1,`track-artist scroll-text svelte-1o4jdf5`,null,Kn,{"animate-scroll":h(Lt)>h(It)}),N(qn,h(G).artist),Yn=O(Jn,1,`scroll-container svelte-1o4jdf5`,null,Yn,{overflowing:h(zt)>h(Rt)}),w(Jn,`--scroll-dist: -${h(zt)-h(Rt)}px`),Zn=O(Xn,1,`track-album scroll-text svelte-1o4jdf5`,null,Zn,{"animate-scroll":h(zt)>h(Rt)}),N(Qn,h(G).album),N(nr,e),b(ar,`max`,F.duration||100),De(ar,F.currentTime),N(sr,t),ur=O(lr,1,`ctrl ctrl-sm svelte-1o4jdf5`,null,ur,{"active-ctrl":F.isShuffled}),pr=O(fr,1,`ctrl ctrl-play svelte-1o4jdf5`,null,pr,{"ctrl-error":F.fetchErrors[h(G).id]}),b(fr,`aria-label`,F.isPlaying?`Pause`:`Play`),xr=O(br,1,`ctrl ctrl-sm svelte-1o4jdf5`,null,xr,{"active-ctrl":F.repeatMode>0}),b(br,`title`,F.repeatMode===1?`Repeat: all`:F.repeatMode===2?`Repeat: one`:F.repeatMode===3?`Stop after current track`:`Repeat: off`),Or=O(Dr,1,`dj-crossfader svelte-1o4jdf5`,null,Or,{"fader-flash":h($t),"fader-fried":h(J)>=10}),Ar=O(kr,1,`fader-label left-label flex items-center gap-1 svelte-1o4jdf5`,null,Ar,{active:!F.isInstrumental}),Nr=O(Mr,1,`dj-fader-knob svelte-1o4jdf5`,null,Nr,{right:F.isInstrumental,"knob-jiggle":h(Qt),fried:h(J)>=10}),Fr=O(Pr,1,`fader-label right-label flex items-center gap-1 svelte-1o4jdf5`,null,Fr,{active:F.isInstrumental}),Vr=O(Br,1,`ctrl ctrl-xs svelte-1o4jdf5`,null,Vr,{"active-ctrl":h(z)}),O(Hr,1,`w-[90px] h-[20px] flex items-center justify-center rounded text-[9px] font-bold transition-all font-mono uppercase tracking-wider select-none cursor-pointer
                      ${h(z)?`bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/25 active:scale-95`:`bg-transparent border border-white/5 text-white/20 hover:text-white/40 hover:border-white/10`}`,`svelte-1o4jdf5`),b(Hr,`title`,h(z)?`Click to cycle presets`:`Click to enable visualizer`),N(Ur,Ve[h(B)].name),Xr=O(Yr,1,`tracklist-side svelte-1o4jdf5`,null,Xr,{"show-mobile":h(L)}),N(ri,h(U).length)},[()=>Xt(F.currentTime),()=>Xt(F.duration)]),v(`click`,un,_t),v(`click`,dn,e=>e.stopPropagation()),v(`click`,hn,()=>{F.isPlaying||window.dispatchEvent(new CustomEvent(`open-info-panel`))}),v(`click`,_n,function(...e){j.onClose?.apply(this,e)}),v(`click`,An,Jt),v(`click`,Mn,e=>Ht(e,h(G))),Ce(Bn,`clientWidth`,e=>C(Ft,e)),Ce(Rn,`clientWidth`,e=>C(Pt,e)),Ce(Gn,`clientWidth`,e=>C(Lt,e)),Ce(Un,`clientWidth`,e=>C(It,e)),Ce(Xn,`clientWidth`,e=>C(zt,e)),Ce(Jn,`clientWidth`,e=>C(Rt,e)),v(`input`,ar,e=>{F.seek(parseFloat(e.target.value))}),v(`change`,ar,e=>{F.isPlaying||F.play(parseFloat(e.target.value))}),v(`click`,lr,()=>F.setShuffle(!F.isShuffled)),v(`click`,dr,()=>F.prevTrack()),v(`click`,fr,()=>F.togglePlay()),v(`click`,yr,()=>F.nextTrack()),v(`click`,br,()=>{F.repeatMode=(F.repeatMode+1)%4}),v(`click`,Dr,Yt),v(`click`,Br,()=>{C(z,!h(z))}),v(`click`,Hr,()=>{h(z)?C(B,(h(B)+1)%Ve.length):C(z,!0)}),v(`click`,Gr,()=>{C(yt,!h(yt))}),v(`click`,Qr,()=>{C(L,!1)}),ye(ai,()=>h(I),e=>C(I,e)),Ae(1,yn,()=>ke,()=>({duration:120,delay:120})),Ae(2,yn,()=>ke,()=>({duration:120})),S(o,un),xe()}o([`click`,`input`,`change`]);export{mt as default};