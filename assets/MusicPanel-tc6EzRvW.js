import{$ as e,$r as t,At as n,Bi as r,Br as i,Bt as a,C as o,Ct as s,Di as c,Dr as l,Ei as u,En as d,F as f,Fi as p,Gr as m,Hi as h,Hn as ee,Ir as g,Jr as _,Lr as te,M as ne,Mi as v,Mr as re,Ni as ie,Nr as y,Or as b,Q as ae,Qr as oe,R as se,Ti as x,Tr as ce,Tt as le,Ui as S,Vi as ue,Vr as C,Vt as de,W as fe,Wi as w,X as pe,Yr as me,Yt as he,Zr as T,_ as ge,ai as E,an as _e,ci as ve,di as ye,dn as be,dt as xe,fi as D,ii as Se,j as Ce,ji as O,li as k,ni as A,qn as we,qr as Te,qt as Ee,ri as j,sr as De,tn as Oe,ui as M,vi as N,w as ke,wi as Ae,wt as je,xr as Me,yi as P}from"./vendor-BW0dN03S.js";import{n as Ne,r as Pe,t as F}from"./AudioCore.svelte-DeI4_7-B.js";import{t as Fe}from"./DogsLogo-DhOh7AIM.js";import{t as Ie}from"./settingsManager.svelte-DqNaylqg.js";var Le=class{constructor(e,t){w(this,`canvas`,null),w(this,`gl`,null),w(this,`analyser`,null),w(this,`program`,null),w(this,`animationFrameId`,null),w(this,`startTime`,0),w(this,`vertexBuffer`,null),w(this,`audioTexture`,null),w(this,`uniforms`,{}),w(this,`frequencyBuffer`,null),this.canvas=e,this.analyser=t,this.frequencyBuffer=new Uint8Array(t?t.frequencyBinCount:128),this.gl=e.getContext(`webgl`)||e.getContext(`experimental-webgl`),this.gl||console.error(`WebGL not supported by this browser.`)}init(e){if(!this.gl)return;let t=this.gl;this.cleanupProgram();let n=this.compileShader(t.VERTEX_SHADER,`
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `),r=this.compileShader(t.FRAGMENT_SHADER,e);if(!n||!r)return;if(this.program=t.createProgram(),t.attachShader(this.program,n),t.attachShader(this.program,r),t.linkProgram(this.program),!t.getProgramParameter(this.program,t.LINK_STATUS)){console.error(`Shader program linking failed:`,t.getProgramInfoLog(this.program));return}t.useProgram(this.program);let i=new Float32Array([-1,-1,1,-1,-1,1,1,1]);this.vertexBuffer=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,this.vertexBuffer),t.bufferData(t.ARRAY_BUFFER,i,t.STATIC_DRAW);let a=t.getAttribLocation(this.program,`a_position`);t.enableVertexAttribArray(a),t.vertexAttribPointer(a,2,t.FLOAT,!1,0,0),this.audioTexture=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.audioTexture),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),this.uniforms={time:t.getUniformLocation(this.program,`u_time`),resolution:t.getUniformLocation(this.program,`u_resolution`),volume:t.getUniformLocation(this.program,`u_volume`),bass:t.getUniformLocation(this.program,`u_bass`),mid:t.getUniformLocation(this.program,`u_mid`),treble:t.getUniformLocation(this.program,`u_treble`),audioTexture:t.getUniformLocation(this.program,`u_audioTexture`)},this.startTime=performance.now(),this.resize()}setPreset(e){this.init(e)}compileShader(e,t){if(!this.gl)return null;let n=this.gl,r=n.createShader(e);return n.shaderSource(r,t),n.compileShader(r),n.getShaderParameter(r,n.COMPILE_STATUS)?r:(console.error(`Shader compilation error (${e===n.VERTEX_SHADER?`VERTEX`:`FRAGMENT`}):`,n.getShaderInfoLog(r)),n.deleteShader(r),null)}start(){this.stop();let e=()=>{this.renderFrame(),this.animationFrameId=requestAnimationFrame(e)};this.animationFrameId=requestAnimationFrame(e)}stop(){this.animationFrameId&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null)}resize(){if(!this.gl||!this.canvas)return;let e=this.gl,t=this.canvas.clientWidth,n=this.canvas.clientHeight;(this.canvas.width!==t||this.canvas.height!==n)&&(this.canvas.width=t,this.canvas.height=n,e.viewport(0,0,t,n))}renderFrame(){if(!this.gl||!this.program)return;let e=this.gl;this.resize(),e.useProgram(this.program),e.bindBuffer(e.ARRAY_BUFFER,this.vertexBuffer);let t=(performance.now()-this.startTime)/1e3,n=0,r=0,i=0,a=0;if(this.analyser){this.analyser.getByteFrequencyData(this.frequencyBuffer);let t=this.frequencyBuffer.length,o=0,s=0,c=0;for(let e=0;e<t;e++){let t=this.frequencyBuffer[e];n+=t,e<12?(r+=t,o++):e<64?(i+=t,s++):(a+=t,c++)}n=n/t/255,r=o>0?r/o/255:0,i=s>0?i/s/255:0,a=c>0?a/c/255:0,e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.audioTexture),e.texImage2D(e.TEXTURE_2D,0,e.LUMINANCE,t,1,0,e.LUMINANCE,e.UNSIGNED_BYTE,this.frequencyBuffer)}e.uniform1f(this.uniforms.time,t),e.uniform2f(this.uniforms.resolution,this.canvas.width,this.canvas.height),e.uniform1f(this.uniforms.volume,n),e.uniform1f(this.uniforms.bass,r),e.uniform1f(this.uniforms.mid,i),e.uniform1f(this.uniforms.treble,a),e.uniform1i(this.uniforms.audioTexture,0),e.drawArrays(e.TRIANGLE_STRIP,0,4)}cleanupProgram(){this.gl&&this.program&&(this.gl.deleteProgram(this.program),this.program=null)}destroy(){this.stop();let e=this.gl;e&&(this.cleanupProgram(),this.vertexBuffer&&(e.deleteBuffer(this.vertexBuffer),this.vertexBuffer=null),this.audioTexture&&(e.deleteTexture(this.audioTexture),this.audioTexture=null)),this.canvas=null,this.gl=null,this.analyser=null}},Re=[{id:`kaleidosync`,name:`Kaleidosync`,fragmentShader:`
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
    `}],ze={id:`no-signal`,name:`No Signal`,fragmentShader:`
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
  `},Be=`I understand the creator of this sick beat Nxnja has a copyright notice on his music distribution website.\r
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
`,Ve=E(`<div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 animate-pulse svelte-1o4jdf5"><div class="bg-black/75 border border-red-500/30 px-3 py-1.5 rounded text-[10px] font-mono tracking-widest text-red-500 font-bold uppercase shadow-[0_0_15px_rgba(239,68,68,0.25)] select-none svelte-1o4jdf5">NO SIGNAL</div></div>`),He=E(`<div class="visualizer-container cursor-pointer svelte-1o4jdf5"><canvas class="visualizer-canvas svelte-1o4jdf5"></canvas> <!> <div class="visualizer-hover-overlay svelte-1o4jdf5"><!></div></div>`),Ue=E(`<div class="visualizer-container bg-[#050508]/40 border border-white/5 flex items-center justify-center svelte-1o4jdf5"><!></div>`),We=E(`<div class="vinyl-record-clicker cursor-pointer w-full h-full svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div><div class="groove g1 svelte-1o4jdf5"></div> <div class="groove g2 svelte-1o4jdf5"></div> <div class="groove g3 svelte-1o4jdf5"></div> <div class="groove g4 svelte-1o4jdf5"></div> <div class="record-label svelte-1o4jdf5"><img loading="lazy"/></div> <div class="spindle svelte-1o4jdf5"></div></div> <div></div></div>`),Ge=E(`<div class="cassette-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="cassette-tape svelte-1o4jdf5"><div class="cassette-label bg-gradient-to-r from-purple-800 to-pink-700 svelte-1o4jdf5"><span class="cassette-track-title svelte-1o4jdf5"> </span> <span class="cassette-brand svelte-1o4jdf5">WEAREDOGS AUDIO</span></div> <div class="cassette-window bg-zinc-950/80 svelte-1o4jdf5"><div></div> <div></div> <div></div> <div></div></div></div></div>`),Ke=E(`<div class="floppy-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="floppy-disk svelte-1o4jdf5"><div class="floppy-corner svelte-1o4jdf5"></div> <div class="floppy-write-protect svelte-1o4jdf5"></div> <div class="floppy-label bg-slate-100 text-slate-900 svelte-1o4jdf5"><div class="floppy-label-stripe bg-red-600 svelte-1o4jdf5"></div> <div class="floppy-label-stripe-blue bg-blue-600 svelte-1o4jdf5"></div> <div class="floppy-label-content svelte-1o4jdf5"><div class="floppy-song truncate font-mono svelte-1o4jdf5"> </div> <div class="floppy-artist truncate font-mono svelte-1o4jdf5"> </div></div></div> <div class="floppy-shutter-door bg-zinc-700 svelte-1o4jdf5"><div></div> <div class="floppy-shutter-opening bg-zinc-950 svelte-1o4jdf5"><div></div></div></div> <div></div></div></div>`),qe=E(`<div></div>`),Je=E(`<div class="musicbox-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="music-box svelte-1o4jdf5"><div></div> <div class="music-box-interior border border-amber-900/40 svelte-1o4jdf5"><div class="music-box-gears svelte-1o4jdf5"><div></div> <div></div></div> <div class="music-box-drum-wrap svelte-1o4jdf5"><div><div class="music-box-pins svelte-1o4jdf5"><div class="pin pin-1 svelte-1o4jdf5"></div> <div class="pin pin-2 svelte-1o4jdf5"></div> <div class="pin pin-3 svelte-1o4jdf5"></div> <div class="pin pin-4 svelte-1o4jdf5"></div> <div class="pin pin-5 svelte-1o4jdf5"></div> <div class="pin pin-6 svelte-1o4jdf5"></div></div></div></div> <div class="music-box-comb svelte-1o4jdf5"></div></div></div></div>`),Ye=E(`<span></span>`),Xe=E(`<div class="spin-ring svelte-1o4jdf5"></div>`),Ze=E(`<div class="volume-popover svelte-1o4jdf5"><button class="ctrl ctrl-xs mr-2 border border-white/10 rounded-full p-1 hover:bg-white/10 svelte-1o4jdf5" aria-label="Mute"><!></button> <input type="range" class="vol-slider-pop svelte-1o4jdf5" min="0" max="1" step="0.01" aria-label="Volume"/> <span class="text-[10px] font-bold text-white/60 min-w-[28px] text-right font-mono select-none svelte-1o4jdf5"> </span></div>`),Qe=E(`<div class="eq svelte-1o4jdf5"><div class="eq-b svelte-1o4jdf5"></div> <div class="eq-b svelte-1o4jdf5"></div> <div class="eq-b svelte-1o4jdf5"></div></div>`),$e=E(`<span class="svelte-1o4jdf5"></span>`),et=E(`<span class="text-amber-400 flex items-center gap-1 text-[9px] font-bold tracking-wider uppercase bg-amber-500/10 px-1.5 py-0.5 rounded flex-shrink-0 svelte-1o4jdf5" title="Failed to fetch music source from remote database"><!> Error Fetching</span>`),tt=E(`<button class="cursor-pointer svelte-1o4jdf5" style="background: none; border: none; padding: 0; color: inherit; font: inherit;">i</button>`),nt=E(`<a target="_blank" class="svelte-1o4jdf5">i</a>`),rt=E(`<span class="inst-chip-link svelte-1o4jdf5"><!></span>`),it=E(`<div><div class="tr-num svelte-1o4jdf5"><!></div> <img loading="lazy" class="tr-art svelte-1o4jdf5"/> <div class="tr-info svelte-1o4jdf5"><div class="flex items-center gap-1.5 min-w-0 svelte-1o4jdf5"><span> </span> <!></div> <span class="tr-meta svelte-1o4jdf5"> </span></div> <div class="flex items-center gap-2 flex-shrink-0 svelte-1o4jdf5"><!>  <button class="tr-share-btn svelte-1o4jdf5" title="Copy track link" aria-label="Share track"><!></button></div></div>`),at=E(`<div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 animate-pulse svelte-1o4jdf5"><div class="bg-black/75 border border-red-500/30 px-4 py-2 rounded text-[12px] font-mono tracking-widest text-red-500 font-bold uppercase shadow-[0_0_20px_rgba(239,68,68,0.3)] select-none svelte-1o4jdf5">NO SIGNAL</div></div>`),ot=E(`<button> </button>`),st=E(`<div class="visualizer-container fullscreen cursor-pointer svelte-1o4jdf5"><canvas class="visualizer-canvas svelte-1o4jdf5"></canvas> <!> <div class="visualizer-overlay svelte-1o4jdf5"><div class="flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-lg p-1 border border-white/10 svelte-1o4jdf5"></div></div></div>`),ct=E(`<div class="arigato-modal-backdrop svelte-1o4jdf5"><div class="arigato-modal-content svelte-1o4jdf5"><header class="arigato-modal-header svelte-1o4jdf5"><h2 class="svelte-1o4jdf5">ARIGATO INFO</h2> <button class="arigato-close-btn svelte-1o4jdf5"><!></button></header> <div class="arigato-modal-body scroll-y svelte-1o4jdf5"><div class="merch-link-container svelte-1o4jdf5"><a href="https://nxnjaa.beatstars.com/" target="_blank" rel="noopener noreferrer" class="merch-link-btn svelte-1o4jdf5"><!> NXNJA MERCH & MUSIC</a></div> <p class="intro-text svelte-1o4jdf5"></p> <div class="tos-box svelte-1o4jdf5"><div class="tos-microtext svelte-1o4jdf5"></div></div> <p class="outro-text svelte-1o4jdf5"></p></div></div></div>`),lt=E(`<div class="mp-backdrop svelte-1o4jdf5"><div><header class="panel-header svelte-1o4jdf5"><div class="brand svelte-1o4jdf5"><button class="logo-btn svelte-1o4jdf5" aria-label="Open DOGS Info"><!></button> <h1 class="svelte-1o4jdf5"></h1></div> <button class="close-btn svelte-1o4jdf5" aria-label="Close panel"><!></button></header> <div class="mp-body svelte-1o4jdf5"><div class="songs-layout svelte-1o4jdf5"><div><div><div class="vinyl-wrapper relative overflow-hidden svelte-1o4jdf5"><!></div> <div class="track-info mt-2 svelte-1o4jdf5"><div class="flex items-center justify-center mb-1.5 svelte-1o4jdf5"><button class="player-share-btn svelte-1o4jdf5" title="Copy track link" aria-label="Share track"><!></button></div> <div><h2> </h2></div> <div><p> </p></div> <div><p> </p></div></div></div> <div class="player-controls-block svelte-1o4jdf5"><div class="progress-row svelte-1o4jdf5"><span class="ptime svelte-1o4jdf5"> </span> <div class="progress-wrap waveform-slider-wrap relative h-9 flex items-end svelte-1o4jdf5"><div class="waveform-bars flex items-end justify-between absolute inset-0 pointer-events-none px-1 h-full svelte-1o4jdf5"></div> <input type="range" class="seek-input absolute inset-0 opacity-0 cursor-pointer w-full h-full svelte-1o4jdf5" min="0" step="0.1" aria-label="Seek"/></div> <span class="ptime svelte-1o4jdf5"> </span></div> <div class="controls-row svelte-1o4jdf5"><button aria-label="Shuffle"><!></button> <button class="ctrl ctrl-md svelte-1o4jdf5" aria-label="Previous"><!></button> <button><!></button> <button class="ctrl ctrl-md svelte-1o4jdf5" aria-label="Next"><!></button> <button aria-label="Repeat"><!></button></div> <div class="w-full flex flex-col items-center gap-1.5 mt-2 px-1 svelte-1o4jdf5"><div><span><!> <span class="svelte-1o4jdf5">VOCAL</span></span> <div class="dj-fader-slot relative svelte-1o4jdf5"><div></div></div> <span><!> <span class="svelte-1o4jdf5">INST</span></span></div></div> <div class="relative flex justify-center items-center gap-3 mt-2 w-full svelte-1o4jdf5"><!> <div class="flex items-center gap-1.5 svelte-1o4jdf5"><button aria-label="Toggle Visualizer"><!></button> <button> </button></div> <div class="relative svelte-1o4jdf5"><button class="ctrl ctrl-xs vol-toggle-btn svelte-1o4jdf5" aria-label="Toggle volume slider"><!></button></div></div></div></div> <div><div class="mobile-close-bar hidden py-2 px-4 border-b border-white/5 flex items-center justify-between svelte-1o4jdf5"><span class="text-xs font-bold text-white/50 svelte-1o4jdf5">Track Library</span> <button class="px-3 py-1 bg-white/5 text-white/75 rounded-lg text-xs font-bold svelte-1o4jdf5">Back to player</button></div> <div class="tl-header flex justify-between items-center gap-3 svelte-1o4jdf5"><div class="flex items-center gap-2 svelte-1o4jdf5"><!><span class="svelte-1o4jdf5">TRACKS</span> <span class="tl-count svelte-1o4jdf5"> </span></div> <div class="flex items-center gap-1.5 ml-auto svelte-1o4jdf5"><span class="text-[9px] text-white/30 font-bold font-sans svelte-1o4jdf5">SORT BY:</span> <select class="bg-black/40 border border-white/10 rounded px-1.5 py-0.5 text-[10px] font-bold text-white/60 outline-none cursor-pointer hover:border-white/20 transition-all font-sans svelte-1o4jdf5"><option class="svelte-1o4jdf5">DEFAULT</option><option class="svelte-1o4jdf5">ARTIST</option><option class="svelte-1o4jdf5">ALBUM</option><option class="svelte-1o4jdf5">YEAR</option><option class="svelte-1o4jdf5">FILENAME</option><option class="svelte-1o4jdf5">GENRE</option><option class="svelte-1o4jdf5">SEASON</option></select></div></div> <div class="tracklist scroll-y svelte-1o4jdf5"></div></div></div></div> <footer class="mp-footer svelte-1o4jdf5"><div class="mp-status svelte-1o4jdf5"><span class="mp-dot svelte-1o4jdf5"></span><span class="svelte-1o4jdf5">🐕</span></div> <span class="svelte-1o4jdf5">MUSIC</span></footer></div> <!> <canvas class="fader-fx-canvas pointer-events-none svelte-1o4jdf5"></canvas> <!></div>`);function ut(w,E){ue(E,!0);let ve=`/img/error_cover.png`;function ut(e){e.target.src.endsWith(ve)||(e.target.src=ve)}let dt=ce(E,`isClosing`,3,!1),ft=ce(E,`initialTrackId`,3,null),I=v(`default`),L=v(!1),pt=v(!1),mt=v(!1),ht=v(null),R=p(()=>F.isPlaying&&!dt()),z=v(!1),B=v(0),gt=v(!1),_t=v(null),V=null,H=!1,vt=v(!1),yt=v(!1),bt=p(()=>{let e=Be.split(/`{5,}/);return{intro:e[0]||``,tos:e[1]||``,outro:e[2]||``}});function xt(e){if(!e)return``;let t=e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`);return t=t.replace(/(https?:\/\/[^\s]+)/g,`<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>`),t=t.replace(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/g,`<a href="mailto:$1">$1</a>`),t.replace(/\n/g,`<br>`)}let St=p(()=>{let e=D(G);if(!e)return Array(60).fill(10);if(F.waveformPeaks[e.id])return F.waveformPeaks[e.id];let t=e.id,n=[],r=0;for(let e=0;e<t.length;e++)r=(r<<5)-r+t.charCodeAt(e),r|=0;let i=Math.abs(r)%1e3;for(let e=0;e<60;e++){let t=e/59,r=Math.sin(i+t*Math.PI*4),a=Math.cos(i*1.5+t*Math.PI*10)*.4,o=Math.sin(i*2.3+t*Math.PI*22)*.15,s=Math.abs(r+a+o)/1.55,c=Math.sin(t*Math.PI),l=(s*70+15)*c;n.push(Math.max(10,Math.round(l)))}return n});P(()=>{window.innerWidth<=640&&D(z)&&D(B)===0&&D(L)&&O(L,!1)}),P(()=>{F.isPlaying&&O(vt,!0)});let Ct=p(()=>!F.isPlaying&&!D(vt)?ze.fragmentShader:Re[D(B)].fragmentShader);P(()=>{let e=F.analyser;return D(z)&&D(_t)&&!dt()&&(V=new Le(D(_t),e),V.init(D(Ct)),V.start()),()=>{V&&(V.destroy(),V=null)}}),P(()=>{let e=D(Ct);V&&D(z)&&(V.setPreset(e),V.start())}),P(()=>{D(L)?!history.state?.tracklistOpen&&!H&&(history.pushState({tracklistOpen:!0},``),H=!0):H&&(history.back(),H=!1)}),oe(()=>{H&&(history.back(),H=!1)});function wt(e){!e.state?.tracklistOpen&&D(L)&&(O(L,!1),H=!1)}function Tt(e){D(mt)&&D(ht)&&!D(ht).contains(e.target)&&!e.target.closest(`.vol-toggle-btn`)&&O(mt,!1)}let U=p(()=>Ne.unlocked?Pe:Pe.filter(e=>e.public!==!1));function Et(e){return e.src?e.src.split(`/`).pop():``}function Dt(e){if(!e.dateAdded)return`Summer`;let t=new Date(e.dateAdded).getMonth();return t===11||t===0||t===1?`Winter`:t>=2&&t<=4?`Spring`:t>=5&&t<=7?`Summer`:`Fall`}let W=p(()=>{let e=[...D(U)];return D(I)===`artist`?e.sort((e,t)=>e.artist.localeCompare(t.artist)):D(I)===`album`?e.sort((e,t)=>e.album.localeCompare(t.album)):D(I)===`year`?e.sort((e,t)=>(e.year||0)-(t.year||0)):D(I)===`filename`?e.sort((e,t)=>Et(e).localeCompare(Et(t))):D(I)===`genre`?e.sort((e,t)=>(e.genre||``).localeCompare(t.genre||``)):D(I)===`season`&&e.sort((e,t)=>Dt(e).localeCompare(Dt(t))),e}),G=p(()=>D(U)[F.currentTrackIndex]??D(U)[0]);P(()=>{let e=D(U);if(F.library===e||F.library.length===0)return;let t=F.library[F.currentTrackIndex]?.id;F.init(e);let n=e.findIndex(e=>e.id===t);n===-1?(F.pause(),F.loadTrack(0,!1)):F.currentTrackIndex=n});let Ot=v(0),kt=v(0),At=v(0),jt=v(0),Mt=v(0),Nt=v(0),Pt=v(null),Ft=null;function It(e,t){e.stopPropagation();let n=`${window.location.origin}/music/${t.id}`;navigator.clipboard.writeText(n).then(()=>{O(Pt,t.id,!0),Ft&&clearTimeout(Ft),Ft=setTimeout(()=>{O(Pt,null)},2e3)}).catch(e=>{console.error(`Failed to copy share link:`,e)})}oe(()=>{Ft&&clearTimeout(Ft)}),t(()=>{if(Ne.revalidate(),F.init(D(U)),ft()){let e=D(U).findIndex(e=>e.id===ft());e!==-1&&F.loadTrack(e,!0)}else if(!F.hasPickedRandomTrack){F.hasPickedRandomTrack=!0;let e=Math.floor(Math.random()*D(U).length);F.loadTrack(e,!1)}});let K=v(null);function Lt(){let e=document.querySelector(`.track-row[data-track-id="${D(K)}"]`);e&&e.scrollIntoView({block:`nearest`,behavior:`smooth`})}function Rt(e){O(K,e.id,!0);let t=D(U).findIndex(t=>t.id===e.id);F.currentTrackIndex===t&&!F.fetchErrors[e.id]?F.togglePlay():F.loadTrack(t,!0)}function zt(){window.innerWidth<=640?O(L,!0):O(z,!D(z))}function Bt(){let e=!F.isInstrumental;F.setCrossfade(e)||(ie(J),D(Ut)||(O(Ut,!0),setTimeout(()=>{O(Ut,!1)},300)),D(J)===5?($t(),O(Wt,!0),setTimeout(()=>{O(Wt,!1)},150)):D(J)===10?$t(35):D(J)>5&&D(J)<10?$t(8):D(J)>10&&Math.random()<.4&&$t(3))}function Vt(e){return!e||isNaN(e)?`0:00`:`${Math.floor(e/60)}:${Math.floor(e%60).toString().padStart(2,`0`)}`}function Ht(e){let t=document.activeElement;if(!(t&&(t.tagName===`INPUT`||t.tagName===`TEXTAREA`||t.isContentEditable))){if(e.code===`Space`||e.key===` `)e.preventDefault(),F.togglePlay();else if(e.key===`ArrowDown`){if(D(W).length>0){e.preventDefault();let t=D(W).findIndex(e=>e.id===D(K));if(t===-1){let e=D(U)[F.currentTrackIndex];t=D(W).findIndex(t=>t.id===e?.id)}let n=(t+1)%D(W).length;O(K,D(W)[n].id,!0),Lt()}}else if(e.key===`ArrowUp`){if(D(W).length>0){e.preventDefault();let t=D(W).findIndex(e=>e.id===D(K));if(t===-1){let e=D(U)[F.currentTrackIndex];t=D(W).findIndex(t=>t.id===e?.id)}let n=(t-1+D(W).length)%D(W).length;O(K,D(W)[n].id,!0),Lt()}}else if(e.key===`Enter`&&D(K)){e.preventDefault();let t=D(W).find(e=>e.id===D(K));t&&Rt(t)}}}let q=v(null),J=v(0),Ut=v(!1),Wt=v(!1),Y,X,Z,Q=[],$=[],Gt,Kt=v(!1);P(()=>(D(q)&&Yt(),()=>{Gt&&cancelAnimationFrame(Gt),window.removeEventListener(`resize`,Xt),window.visualViewport?.removeEventListener(`resize`,Xt),Z&&(Z.dispose(),Z=null),Y=null,X=null,Q=[],$=[]})),P(()=>{if(F.currentTrackIndex,dt(),O(J,0),O(Kt,!1),Y){for(let e of Q)Y.remove(e.mesh);for(let e of $)Y.remove(e.mesh)}Q=[],$=[]});function qt(){if(!D(q))return{width:window.innerWidth,height:window.innerHeight};let e=D(q).getBoundingClientRect();return{width:e.width||window.innerWidth,height:e.height||window.innerHeight}}function Jt(){let{width:e,height:t}=qt(),n=document.querySelector(`.dj-fader-knob`);if(!n)return{x:e/2,y:t/2};let r=D(q)?D(q).getBoundingClientRect():{left:0,top:0},i=n.getBoundingClientRect();return{x:i.left+i.width/2-r.left,y:t-(i.top+i.height/2-r.top)}}function Yt(){if(!D(q))return;let{width:e,height:t}=qt();D(q).width=e,D(q).height=t,Y=new se,X=new f(0,e,t,0,-1,1),Z=new ge({canvas:D(q),alpha:!0,antialias:!0}),Z.setSize(e,t,!1),Z.setPixelRatio(Math.min(window.devicePixelRatio,2)),window.addEventListener(`resize`,Xt),window.visualViewport?.addEventListener(`resize`,Xt),Zt()}function Xt(){if(!D(q)||!Z||!X)return;let{width:e,height:t}=qt();D(q).width=e,D(q).height=t,Z.setSize(e,t,!1),X.right=e,X.top=t,X.updateProjectionMatrix()}function Zt(){if(Gt=requestAnimationFrame(Zt),!(!Y||!X||!Z||!D(q))){if(D(J)>=10&&(O(Kt,!0),Math.random()<.22)){let e=Jt();Qt(e.x,e.y)}for(let e=Q.length-1;e>=0;e--){let t=Q[e];t.x+=t.vx,t.y+=t.vy,t.vy+=t.ay,t.life-=t.decay,t.mesh.position.set(t.x,t.y,0),t.mesh.material.opacity=t.life,t.life<=0&&(Y.remove(t.mesh),t.mesh.geometry.dispose(),t.mesh.material.dispose(),Q.splice(e,1))}for(let e=$.length-1;e>=0;e--){let t=$[e];t.x+=t.vx,t.y+=t.vy,t.life-=t.decay;let n=t.startScale+(1-t.life)*88;t.mesh.scale.set(n,n,1),t.mesh.position.set(t.x,t.y,0),t.mesh.material.opacity=t.life*.16,t.life<=0&&(Y.remove(t.mesh),t.mesh.geometry.dispose(),t.mesh.material.dispose(),$.splice(e,1))}Z.render(Y,X)}}function Qt(e,t){if(!Y)return;let n=new o(5,8),r=.85+Math.random()*.12,i=new Ce(n,new ne({color:new ke(r,r,r*1.01),transparent:!0,opacity:.06,blending:1}));i.position.set(e,t,0),Y.add(i),$.push({mesh:i,x:e,y:t,vx:(Math.random()-.5)*.55+Math.sin(Date.now()*.001)*.22,vy:Math.random()*.7+1.25,startScale:1,life:1,decay:6e-4+Math.random()*4e-4})}function $t(e=25){if(!Y||!D(q))return;let t=Jt(),n=t.x,r=t.y;for(let t=0;t<e;t++){let e=new Ce(new o(1.3,4),new ne({color:new ke(Math.random()<.4?16711765:16755200),transparent:!0,opacity:1,blending:2}));e.position.set(n,r,0),Y.add(e);let t=Math.random()*Math.PI*2,i=Math.random()*4+2;Q.push({mesh:e,x:n,y:r,vx:Math.cos(t)*i,vy:Math.sin(t)*i,ay:-.15,life:1,decay:.02+Math.random()*.02})}}var en=lt();M(`keydown`,Ae,Ht),M(`popstate`,Ae,wt),M(`click`,Ae,Tt);var tn=x(en);let nn;var rn=x(tn),an=x(rn),on=x(an);Fe(x(on),{size:`panel`}),S(on);var sn=c(on,2);sn.textContent=`MUSIC`,S(an);var cn=c(an,2);Me(x(cn),{size:20}),S(cn),S(rn);var ln=c(rn,2),un=x(ln),dn=x(un);let fn;var pn=x(dn);let mn;var hn=x(pn),gn=x(hn),_n=e=>{var t=He(),n=x(t);l(n,e=>O(_t,e),()=>D(_t));var r=c(n,2),i=e=>{j(e,Ve())};T(r,e=>{!F.isPlaying&&!D(vt)&&e(i)});var a=c(r,2);_e(x(a),{size:16,class:`text-white/70`}),S(a),S(t),k(`click`,t,()=>{O(gt,!0)}),j(e,t)},vn=e=>{var t=Ue();_e(x(t),{size:16,class:`text-white/20`}),S(t),j(e,t)},yn=e=>{var t=Se(),n=u(t),r=e=>{var t=We(),n=x(t);let r;var i=c(x(n),8),a=x(i);let o;S(i),h(2),S(n);var s=c(n,2);let l;S(t),N(()=>{r=C(n,1,`vinyl-record svelte-1o4jdf5`,null,r,{spinning:D(R)}),y(a,`src`,F.fetchErrors[D(G).id]||!D(G).cover?ve:D(G).cover),y(a,`alt`,D(G).album),o=C(a,1,`record-art svelte-1o4jdf5`,null,o,{loaded:D(pt)}),l=C(s,1,`tonearm svelte-1o4jdf5`,null,l,{playing:D(R)})}),k(`click`,t,zt),M(`load`,a,()=>O(pt,!0)),M(`error`,a,ut),ye(a),j(e,t)},a=e=>{let t=p(()=>F.duration>0?(1-F.currentTime/F.duration)*.45+.25:.48),n=p(()=>F.duration>0?F.currentTime/F.duration*.45+.25:.48);var r=Ge(),a=x(r),o=x(a),s=x(o),l=x(s,!0);S(s),h(2),S(o);var u=c(o,2),d=x(u);let f;var m=c(d,2);let ee;var g=c(m,2);let _;var te=c(g,2);let ne;S(u),S(a),S(r),N(()=>{A(l,D(G).title),f=C(d,1,`spindle-left bg-zinc-900 svelte-1o4jdf5`,null,f,{spinning:D(R)}),ee=C(m,1,`tape-roll-left bg-amber-950/70 svelte-1o4jdf5`,null,ee,{spinning:D(R)}),i(m,`width: ${D(t)*46}px; height: ${D(t)*46}px;`),_=C(g,1,`spindle-right bg-zinc-900 svelte-1o4jdf5`,null,_,{spinning:D(R)}),ne=C(te,1,`tape-roll-right bg-amber-950/70 svelte-1o4jdf5`,null,ne,{spinning:D(R)}),i(te,`width: ${D(n)*46}px; height: ${D(n)*46}px;`)}),k(`click`,r,zt),j(e,r)},o=e=>{var t=Ke(),n=x(t),r=c(x(n),4),i=c(x(r),4),a=x(i),o=x(a,!0);S(a);var s=c(a,2),l=x(s,!0);S(s),S(i),S(r);var u=c(r,2),d=x(u);let f;var p=c(d,2),m=x(p);let h;S(p),S(u);var ee=c(u,2);let g;S(n),S(t),N(()=>{A(o,D(G).title),A(l,D(G).artist||`WEAREDOGS`),f=C(d,1,`floppy-shutter-slider bg-zinc-400 svelte-1o4jdf5`,null,f,{open:D(R)}),h=C(m,1,`floppy-magnetic-disc bg-zinc-900 svelte-1o4jdf5`,null,h,{spinning:D(R)}),g=C(ee,1,`floppy-drive-led svelte-1o4jdf5`,null,g,{active:D(R)})}),k(`click`,t,zt),j(e,t)},s=e=>{var t=Je(),n=x(t),r=x(n);let i;var a=c(r,2),o=x(a),s=x(o);let l;var u=c(s,2);let d;S(o);var f=c(o,2),p=x(f);let m;S(f);var h=c(f,2);_(h,20,()=>Array(10),me,(e,t,n)=>{var r=qe();let i;N(e=>i=C(r,1,`comb-tooth svelte-1o4jdf5`,null,i,e),[()=>({vibrating:D(R)&&n%3==Math.floor(F.currentTime*4)%3})]),j(e,r)}),S(h),S(a),S(n),S(t),N(()=>{i=C(r,1,`music-box-key svelte-1o4jdf5`,null,i,{spinning:D(R)}),l=C(s,1,`music-box-gear gear-1 svelte-1o4jdf5`,null,l,{spinning:D(R)}),d=C(u,1,`music-box-gear gear-2 svelte-1o4jdf5`,null,d,{spinning:D(R)}),m=C(p,1,`music-box-drum bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 svelte-1o4jdf5`,null,m,{spinning:D(R)})}),k(`click`,t,zt),j(e,t)};T(n,e=>{Ie.musicDeckModel===`vinyl`?e(r):Ie.musicDeckModel===`cassette`?e(a,1):Ie.musicDeckModel===`floppy`?e(o,2):Ie.musicDeckModel===`musicbox`&&e(s,3)}),j(e,t)};T(gn,e=>{D(z)&&!D(gt)?e(_n):D(z)&&D(gt)?e(vn,1):e(yn,-1)}),S(hn);var bn=c(hn,2),xn=x(bn),Sn=x(xn),Cn=x(Sn),wn=e=>{De(e,{size:12,class:`text-[#22c55e]`})},Tn=e=>{n(e,{size:12})};T(Cn,e=>{D(Pt)===D(G).id?e(wn):e(Tn,-1)}),S(Sn),S(xn);var En=c(xn,2);let Dn;var On=x(En);let kn;var An=x(On,!0);S(On),S(En);var jn=c(En,2);let Mn;var Nn=x(jn);let Pn;var Fn=x(Nn,!0);S(Nn),S(jn);var In=c(jn,2);let Ln;var Rn=x(In);let zn;var Bn=x(Rn,!0);S(Rn),S(In),S(bn),S(pn);var Vn=c(pn,2),Hn=x(Vn),Un=x(Hn),Wn=x(Un,!0);S(Un);var Gn=c(Un,2),Kn=x(Gn);_(Kn,21,()=>D(St),me,(e,t,n)=>{let r=p(()=>F.duration>0?F.currentTime/F.duration:0),a=p(()=>n/60);var o=Ye();let s;N(()=>{s=C(o,1,`waveform-bar transition-colors duration-100 rounded-full svelte-1o4jdf5`,null,s,{active:D(a)<=D(r)}),i(o,`height: ${D(t)??``}%; width: 3px;`)}),j(e,o)}),S(Kn);var qn=c(Kn,2);re(qn),S(Gn);var Jn=c(Gn,2),Yn=x(Jn,!0);S(Jn),S(Hn);var Xn=c(Hn,2),Zn=x(Xn);let Qn;le(x(Zn),{size:15}),S(Zn);var $n=c(Zn,2);je(x($n),{size:19}),S($n);var er=c($n,2);let tr;var nr=x(er),rr=e=>{xe(e,{size:22})},ir=e=>{j(e,Xe())},ar=e=>{he(e,{size:22,fill:`currentColor`})},or=e=>{Ee(e,{size:22,fill:`currentColor`})};T(nr,e=>{F.fetchErrors[D(G).id]?e(rr):F.isLoading?e(ir,1):F.isPlaying?e(ar,2):e(or,-1)}),S(er);var sr=c(er,2);s(x(sr),{size:19}),S(sr);var cr=c(sr,2);let lr;var ur=x(cr),dr=e=>{de(e,{size:15})},fr=e=>{we(e,{size:15})},pr=e=>{a(e,{size:15})};T(ur,e=>{F.repeatMode===2?e(dr):F.repeatMode===3?e(fr,1):e(pr,-1)}),S(cr),S(Xn);var mr=c(Xn,2),hr=x(mr);let gr;var _r=x(hr);let vr;Oe(x(_r),{size:12}),h(2),S(_r);var yr=c(_r,2),br=x(yr);let xr;S(yr);var Sr=c(yr,2);let Cr;d(x(Sr),{size:12}),h(2),S(Sr),S(hr),S(mr);var wr=c(mr,2),Tr=x(wr),Er=t=>{var n=Ze(),r=x(n),i=x(r),a=e=>{ae(e,{size:12,class:`text-red-400`})},o=t=>{e(t,{size:12})};T(i,e=>{F.isMuted||F.volume===0?e(a):e(o,-1)}),S(r);var s=c(r,2);re(s);var u=c(s,2),d=x(u);S(u),S(n),l(n,e=>O(ht,e),()=>D(ht)),N(e=>{g(s,F.volume),A(d,`${e??``}%`)},[()=>Math.round(F.volume*100)]),k(`click`,r,()=>F.toggleMute()),k(`input`,s,e=>F.setVolume(parseFloat(e.target.value))),j(t,n)};T(Tr,e=>{D(mt)&&e(Er)});var Dr=c(Tr,2),Or=x(Dr);let kr;pe(x(Or),{size:13}),S(Or);var Ar=c(Or,2),jr=x(Ar,!0);S(Ar),S(Dr);var Mr=c(Dr,2),Nr=x(Mr),Pr=x(Nr),Fr=e=>{ae(e,{size:13,class:`text-red-400`})},Ir=t=>{e(t,{size:13})};T(Pr,e=>{F.isMuted||F.volume===0?e(Fr):e(Ir,-1)}),S(Nr),S(Mr),S(wr),S(Vn),S(dn);var Lr=c(dn,2);let Rr;var zr=x(Lr),Br=c(x(zr),2);S(zr);var Vr=c(zr,2),Hr=x(Vr),Ur=x(Hr);be(Ur,{size:13});var Wr=c(Ur,3),Gr=x(Wr,!0);S(Wr),S(Hr);var Kr=c(Hr,2),qr=c(x(Kr),2),Jr=x(qr);Jr.value=Jr.__value=`default`;var Yr=c(Jr);Yr.value=Yr.__value=`artist`;var Xr=c(Yr);Xr.value=Xr.__value=`album`;var Zr=c(Xr);Zr.value=Zr.__value=`year`;var Qr=c(Zr);Qr.value=Qr.__value=`filename`;var $r=c(Qr);$r.value=$r.__value=`genre`;var ei=c($r);ei.value=ei.__value=`season`,S(qr),S(Kr),S(Vr);var ti=c(Vr,2);_(ti,21,()=>D(W),me,(e,t,r)=>{var i=it();let a;var o=x(i),s=x(o),l=e=>{j(e,Qe())},u=e=>{var t=$e();t.textContent=r+1,j(e,t)};T(s,e=>{D(G).id===D(t).id&&F.isPlaying?e(l):e(u,-1)}),S(o);var d=c(o,2),f=c(d,2),p=x(f),m=x(p);let ee;var g=x(m,!0);S(m);var _=c(m,2),te=e=>{var t=et();xe(x(t),{size:10}),h(),S(t),j(e,t)};T(_,e=>{F.fetchErrors[D(t).id]&&e(te)}),S(p);var ne=c(p,2),v=x(ne);S(ne),S(f);var re=c(f,2),ie=x(re),b=e=>{var n=rt(),r=x(n),i=e=>{var t=tt();k(`click`,t,e=>{e.stopPropagation(),O(yt,!0)}),j(e,t)},a=e=>{var n=nt();N(()=>y(n,`href`,D(t).attrib)),k(`click`,n,e=>e.stopPropagation()),j(e,n)};T(r,e=>{D(t).id===`arigato`?e(i):e(a,-1)}),S(n),j(e,n)};T(ie,e=>{D(t).attrib&&e(b)});var ae=c(ie,2),oe=x(ae),se=e=>{De(e,{size:12,class:`text-[#22c55e]`})},ce=e=>{n(e,{size:12})};T(oe,e=>{D(Pt)===D(t).id?e(se):e(ce,-1)}),S(ae),S(re),S(i),N(()=>{a=C(i,1,`track-row svelte-1o4jdf5`,null,a,{active:D(G).id===D(t).id,"kb-focused":D(K)===D(t).id,"fetch-error":F.fetchErrors[D(t).id]}),y(i,`data-track-id`,D(t).id),y(d,`src`,F.fetchErrors[D(t).id]||!D(t).cover?ve:D(t).cover),y(d,`alt`,D(t).album),ee=C(m,1,`tr-title svelte-1o4jdf5`,null,ee,{"line-through":F.fetchErrors[D(t).id],"opacity-50":F.fetchErrors[D(t).id]}),A(g,D(t).title),A(v,`${D(t).artist??``} · ${D(t).album??``} (${(D(t).year||``)??``})`)}),k(`click`,i,()=>Rt(D(t))),M(`error`,d,ut),ye(d),k(`click`,ae,e=>It(e,D(t))),j(e,i)}),S(ti),S(Lr),S(un),S(ln),h(2),S(tn);var ni=c(tn,2),ri=e=>{var t=st(),n=x(t);l(n,e=>O(_t,e),()=>D(_t));var r=c(n,2),i=e=>{j(e,at())};T(r,e=>{!F.isPlaying&&!D(vt)&&e(i)});var a=c(r,2),o=x(a);_(o,21,()=>Re,me,(e,t,n)=>{var r=ot(),i=x(r,!0);S(r),N(()=>{C(r,1,`px-2 py-1 rounded text-[9px] font-bold transition-all uppercase tracking-wider font-mono
                ${D(B)===n?`bg-purple-600 text-white`:`text-white/40 hover:text-white/80`}`,`svelte-1o4jdf5`),A(i,D(t).name)}),k(`click`,r,()=>O(B,n,!0)),j(e,r)}),S(o),S(a),S(t),k(`click`,t,e=>{e.stopPropagation(),O(gt,!1)}),k(`click`,a,e=>e.stopPropagation()),j(e,t)};T(ni,e=>{D(z)&&D(gt)&&e(ri)});var ii=c(ni,2);l(ii,e=>O(q,e),()=>D(q));var ai=c(ii,2),oi=e=>{var t=ct(),n=x(t),r=x(n),i=c(x(r),2);Me(x(i),{size:16}),S(i),S(r);var a=c(r,2),o=x(a),s=x(o);ee(x(s),{size:14}),h(),S(s),S(o);var l=c(o,2);Te(l,()=>xt(D(bt).intro),!0),S(l);var u=c(l,2),d=x(u);Te(d,()=>xt(D(bt).tos),!0),S(d),S(u);var f=c(u,2);Te(f,()=>xt(D(bt).outro),!0),S(f),S(a),S(n),S(t),k(`click`,t,()=>O(yt,!1)),k(`click`,n,e=>e.stopPropagation()),k(`click`,i,()=>O(yt,!1)),m(3,t,()=>fe,()=>({duration:150})),j(e,t)};T(ai,e=>{D(yt)&&e(oi)}),S(en),N((e,t)=>{nn=C(tn,1,`mp-container svelte-1o4jdf5`,null,nn,{closing:dt(),"theme-inst":F.isInstrumental}),fn=C(dn,1,`player-side svelte-1o4jdf5`,null,fn,{"tracklist-open":D(L)}),mn=C(pn,1,`player-top-block transition-all duration-300 ease-in-out svelte-1o4jdf5`,null,mn,{"opacity-0":D(L),"scale-95":D(L),"pointer-events-none":D(L)}),Dn=C(En,1,`scroll-container svelte-1o4jdf5`,null,Dn,{overflowing:D(kt)>D(Ot)}),i(En,`--scroll-dist: -${D(kt)-D(Ot)}px`),kn=C(On,1,`track-title scroll-text svelte-1o4jdf5`,null,kn,{"animate-scroll":D(kt)>D(Ot)}),A(An,D(G).title),Mn=C(jn,1,`scroll-container svelte-1o4jdf5`,null,Mn,{overflowing:D(jt)>D(At)}),i(jn,`--scroll-dist: -${D(jt)-D(At)}px`),Pn=C(Nn,1,`track-artist scroll-text svelte-1o4jdf5`,null,Pn,{"animate-scroll":D(jt)>D(At)}),A(Fn,D(G).artist),Ln=C(In,1,`scroll-container svelte-1o4jdf5`,null,Ln,{overflowing:D(Nt)>D(Mt)}),i(In,`--scroll-dist: -${D(Nt)-D(Mt)}px`),zn=C(Rn,1,`track-album scroll-text svelte-1o4jdf5`,null,zn,{"animate-scroll":D(Nt)>D(Mt)}),A(Bn,D(G).album),A(Wn,e),y(qn,`max`,F.duration||100),g(qn,F.currentTime),A(Yn,t),Qn=C(Zn,1,`ctrl ctrl-sm svelte-1o4jdf5`,null,Qn,{"active-ctrl":F.isShuffled}),tr=C(er,1,`ctrl ctrl-play svelte-1o4jdf5`,null,tr,{"ctrl-error":F.fetchErrors[D(G).id]}),y(er,`aria-label`,F.isPlaying?`Pause`:`Play`),lr=C(cr,1,`ctrl ctrl-sm svelte-1o4jdf5`,null,lr,{"active-ctrl":F.repeatMode>0}),y(cr,`title`,F.repeatMode===1?`Repeat: all`:F.repeatMode===2?`Repeat: one`:F.repeatMode===3?`Stop after current track`:`Repeat: off`),gr=C(hr,1,`dj-crossfader svelte-1o4jdf5`,null,gr,{"fader-flash":D(Wt),"fader-fried":D(J)>=10}),vr=C(_r,1,`fader-label left-label flex items-center gap-1 svelte-1o4jdf5`,null,vr,{active:!F.isInstrumental}),xr=C(br,1,`dj-fader-knob svelte-1o4jdf5`,null,xr,{right:F.isInstrumental,"knob-jiggle":D(Ut),fried:D(J)>=10}),Cr=C(Sr,1,`fader-label right-label flex items-center gap-1 svelte-1o4jdf5`,null,Cr,{active:F.isInstrumental}),kr=C(Or,1,`ctrl ctrl-xs svelte-1o4jdf5`,null,kr,{"active-ctrl":D(z)}),C(Ar,1,`w-[90px] h-[20px] flex items-center justify-center rounded text-[9px] font-bold transition-all font-mono uppercase tracking-wider select-none cursor-pointer
                      ${D(z)?`bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/25 active:scale-95`:`bg-transparent border border-white/5 text-white/20 hover:text-white/40 hover:border-white/10`}`,`svelte-1o4jdf5`),y(Ar,`title`,D(z)?`Click to cycle presets`:`Click to enable visualizer`),A(jr,Re[D(B)].name),Rr=C(Lr,1,`tracklist-side svelte-1o4jdf5`,null,Rr,{"show-mobile":D(L)}),A(Gr,D(U).length)},[()=>Vt(F.currentTime),()=>Vt(F.duration)]),k(`click`,en,function(...e){E.onClose?.apply(this,e)}),k(`click`,tn,e=>e.stopPropagation()),k(`click`,on,()=>{F.isPlaying||window.dispatchEvent(new CustomEvent(`open-info-panel`))}),k(`click`,cn,function(...e){E.onClose?.apply(this,e)}),k(`click`,Sn,e=>It(e,D(G))),b(On,`clientWidth`,e=>O(kt,e)),b(En,`clientWidth`,e=>O(Ot,e)),b(Nn,`clientWidth`,e=>O(jt,e)),b(jn,`clientWidth`,e=>O(At,e)),b(Rn,`clientWidth`,e=>O(Nt,e)),b(In,`clientWidth`,e=>O(Mt,e)),k(`input`,qn,e=>{F.seek(parseFloat(e.target.value))}),k(`change`,qn,e=>{F.isPlaying||F.play(parseFloat(e.target.value))}),k(`click`,Zn,()=>F.setShuffle(!F.isShuffled)),k(`click`,$n,()=>F.prevTrack()),k(`click`,er,()=>F.togglePlay()),k(`click`,sr,()=>F.nextTrack()),k(`click`,cr,()=>{F.repeatMode=(F.repeatMode+1)%4}),k(`click`,hr,Bt),k(`click`,Or,()=>{O(z,!D(z))}),k(`click`,Ar,()=>{D(z)?O(B,(D(B)+1)%Re.length):O(z,!0)}),k(`click`,Nr,()=>{O(mt,!D(mt))}),k(`click`,Br,()=>{O(L,!1)}),te(qr,()=>D(I),e=>O(I,e)),m(1,un,()=>fe,()=>({duration:120,delay:120})),m(2,un,()=>fe,()=>({duration:120})),j(w,en),r()}ve([`click`,`input`,`change`]);export{ut as default};