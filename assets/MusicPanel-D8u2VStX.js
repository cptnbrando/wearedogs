import{$ as e,$r as t,Ar as n,C as r,Cr as i,Di as a,Dn as o,Dr as s,Ei as c,Et as l,F as u,Fi as d,Fr as f,Gi as p,Hi as m,Hr as h,Ht as g,Jt as _,Ki as v,Li as y,M as ee,Ni as b,Oi as te,Pi as x,Pr as ne,Q as re,R as ie,Rr as ae,Tt as oe,Ui as se,Un as ce,Ur as S,Vt as le,W as ue,Wi as C,X as de,Xr as fe,Xt as pe,Yn as me,Yr as he,Zr as ge,_ as _e,ai as w,bi as T,di as E,ei as ve,fi as D,fn as ye,ft as be,ii as O,j as xe,jt as Se,ki as k,kr as Ce,lr as we,mi as A,nn as Te,oi as Ee,on as De,pi as Oe,qr as ke,si as j,ti as Ae,ui as je,w as Me,wt as Ne,xi as M,zr as Pe}from"./vendor-BTH2uoYm.js";import{n as Fe,r as Ie,t as N}from"./AudioCore.svelte-CjgLhFrx.js";import{t as Le}from"./DogsLogo-D0kQVxkO.js";import{t as Re}from"./settingsManager.svelte-Bu5yZO_R.js";var ze=class{constructor(e,t){v(this,`canvas`,null),v(this,`gl`,null),v(this,`analyser`,null),v(this,`program`,null),v(this,`animationFrameId`,null),v(this,`startTime`,0),v(this,`vertexBuffer`,null),v(this,`audioTexture`,null),v(this,`uniforms`,{}),v(this,`frequencyBuffer`,null),this.canvas=e,this.analyser=t,this.frequencyBuffer=new Uint8Array(t?t.frequencyBinCount:128),this.gl=e.getContext(`webgl`)||e.getContext(`experimental-webgl`),this.gl||console.error(`WebGL not supported by this browser.`)}init(e){if(!this.gl)return;let t=this.gl;this.cleanupProgram();let n=this.compileShader(t.VERTEX_SHADER,`
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `),r=this.compileShader(t.FRAGMENT_SHADER,e);if(!n||!r)return;if(this.program=t.createProgram(),t.attachShader(this.program,n),t.attachShader(this.program,r),t.linkProgram(this.program),!t.getProgramParameter(this.program,t.LINK_STATUS)){console.error(`Shader program linking failed:`,t.getProgramInfoLog(this.program));return}t.useProgram(this.program);let i=new Float32Array([-1,-1,1,-1,-1,1,1,1]);this.vertexBuffer=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,this.vertexBuffer),t.bufferData(t.ARRAY_BUFFER,i,t.STATIC_DRAW);let a=t.getAttribLocation(this.program,`a_position`);t.enableVertexAttribArray(a),t.vertexAttribPointer(a,2,t.FLOAT,!1,0,0),this.audioTexture=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.audioTexture),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),this.uniforms={time:t.getUniformLocation(this.program,`u_time`),resolution:t.getUniformLocation(this.program,`u_resolution`),volume:t.getUniformLocation(this.program,`u_volume`),bass:t.getUniformLocation(this.program,`u_bass`),mid:t.getUniformLocation(this.program,`u_mid`),treble:t.getUniformLocation(this.program,`u_treble`),audioTexture:t.getUniformLocation(this.program,`u_audioTexture`)},this.startTime=performance.now(),this.resize()}setPreset(e){this.init(e)}compileShader(e,t){if(!this.gl)return null;let n=this.gl,r=n.createShader(e);return n.shaderSource(r,t),n.compileShader(r),n.getShaderParameter(r,n.COMPILE_STATUS)?r:(console.error(`Shader compilation error (${e===n.VERTEX_SHADER?`VERTEX`:`FRAGMENT`}):`,n.getShaderInfoLog(r)),n.deleteShader(r),null)}start(){this.stop();let e=()=>{this.renderFrame(),this.animationFrameId=requestAnimationFrame(e)};this.animationFrameId=requestAnimationFrame(e)}stop(){this.animationFrameId&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null)}resize(){if(!this.gl||!this.canvas)return;let e=this.gl,t=this.canvas.clientWidth,n=this.canvas.clientHeight;(this.canvas.width!==t||this.canvas.height!==n)&&(this.canvas.width=t,this.canvas.height=n,e.viewport(0,0,t,n))}renderFrame(){if(!this.gl||!this.program)return;let e=this.gl;this.resize(),e.useProgram(this.program),e.bindBuffer(e.ARRAY_BUFFER,this.vertexBuffer);let t=(performance.now()-this.startTime)/1e3,n=0,r=0,i=0,a=0;if(this.analyser){this.analyser.getByteFrequencyData(this.frequencyBuffer);let t=this.frequencyBuffer.length,o=0,s=0,c=0;for(let e=0;e<t;e++){let t=this.frequencyBuffer[e];n+=t,e<12?(r+=t,o++):e<64?(i+=t,s++):(a+=t,c++)}n=n/t/255,r=o>0?r/o/255:0,i=s>0?i/s/255:0,a=c>0?a/c/255:0,e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.audioTexture),e.texImage2D(e.TEXTURE_2D,0,e.LUMINANCE,t,1,0,e.LUMINANCE,e.UNSIGNED_BYTE,this.frequencyBuffer)}e.uniform1f(this.uniforms.time,t),e.uniform2f(this.uniforms.resolution,this.canvas.width,this.canvas.height),e.uniform1f(this.uniforms.volume,n),e.uniform1f(this.uniforms.bass,r),e.uniform1f(this.uniforms.mid,i),e.uniform1f(this.uniforms.treble,a),e.uniform1i(this.uniforms.audioTexture,0),e.drawArrays(e.TRIANGLE_STRIP,0,4)}cleanupProgram(){this.gl&&this.program&&(this.gl.deleteProgram(this.program),this.program=null)}destroy(){this.stop();let e=this.gl;e&&(this.cleanupProgram(),this.vertexBuffer&&(e.deleteBuffer(this.vertexBuffer),this.vertexBuffer=null),this.audioTexture&&(e.deleteTexture(this.audioTexture),this.audioTexture=null)),this.canvas=null,this.gl=null,this.analyser=null}},Be=[{id:`kaleidosync`,name:`Kaleidosync`,fragmentShader:`
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
    `}],Ve={id:`no-signal`,name:`No Signal`,fragmentShader:`
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
  `},He=`I understand the creator of this sick beat Nxnja has a copyright notice on his music distribution website.\r
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
`,Ue=j(`<div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 animate-pulse svelte-1o4jdf5"><div class="bg-black/75 border border-red-500/30 px-3 py-1.5 rounded text-[10px] font-mono tracking-widest text-red-500 font-bold uppercase shadow-[0_0_15px_rgba(239,68,68,0.25)] select-none svelte-1o4jdf5">NO SIGNAL</div></div>`),We=j(`<div class="visualizer-container cursor-pointer svelte-1o4jdf5"><canvas class="visualizer-canvas svelte-1o4jdf5"></canvas> <!> <div class="visualizer-hover-overlay svelte-1o4jdf5"><!></div></div>`),Ge=j(`<div class="visualizer-container bg-[#050508]/40 border border-white/5 flex items-center justify-center svelte-1o4jdf5"><!></div>`),Ke=j(`<div class="vinyl-record-clicker cursor-pointer w-full h-full svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div><div class="groove g1 svelte-1o4jdf5"></div> <div class="groove g2 svelte-1o4jdf5"></div> <div class="groove g3 svelte-1o4jdf5"></div> <div class="groove g4 svelte-1o4jdf5"></div> <div class="record-label svelte-1o4jdf5"><img loading="lazy"/></div> <div class="spindle svelte-1o4jdf5"></div></div> <div></div></div>`),qe=j(`<div class="cassette-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="cassette-tape svelte-1o4jdf5"><div class="cassette-label bg-gradient-to-r from-purple-800 to-pink-700 svelte-1o4jdf5"><span class="cassette-track-title svelte-1o4jdf5"> </span> <span class="cassette-brand svelte-1o4jdf5">WEAREDOGS AUDIO</span></div> <div class="cassette-window bg-zinc-950/80 svelte-1o4jdf5"><div></div> <div></div> <div></div> <div></div></div></div></div>`),Je=j(`<div class="floppy-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="floppy-disk svelte-1o4jdf5"><div class="floppy-corner svelte-1o4jdf5"></div> <div class="floppy-write-protect svelte-1o4jdf5"></div> <div class="floppy-label bg-slate-100 text-slate-900 svelte-1o4jdf5"><div class="floppy-label-stripe bg-red-600 svelte-1o4jdf5"></div> <div class="floppy-label-stripe-blue bg-blue-600 svelte-1o4jdf5"></div> <div class="floppy-label-content svelte-1o4jdf5"><div class="floppy-song truncate font-mono svelte-1o4jdf5"> </div> <div class="floppy-artist truncate font-mono svelte-1o4jdf5"> </div></div></div> <div class="floppy-shutter-door bg-zinc-700 svelte-1o4jdf5"><div></div> <div class="floppy-shutter-opening bg-zinc-950 svelte-1o4jdf5"><div></div></div></div> <div></div></div></div>`),Ye=j(`<div></div>`),Xe=j(`<div class="musicbox-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="music-box svelte-1o4jdf5"><div></div> <div class="music-box-interior border border-amber-900/40 svelte-1o4jdf5"><div class="music-box-gears svelte-1o4jdf5"><div></div> <div></div></div> <div class="music-box-drum-wrap svelte-1o4jdf5"><div><div class="music-box-pins svelte-1o4jdf5"><div class="pin pin-1 svelte-1o4jdf5"></div> <div class="pin pin-2 svelte-1o4jdf5"></div> <div class="pin pin-3 svelte-1o4jdf5"></div> <div class="pin pin-4 svelte-1o4jdf5"></div> <div class="pin pin-5 svelte-1o4jdf5"></div> <div class="pin pin-6 svelte-1o4jdf5"></div></div></div></div> <div class="music-box-comb svelte-1o4jdf5"></div></div></div></div>`),Ze=j(`<span></span>`),Qe=j(`<div class="spin-ring svelte-1o4jdf5"></div>`),$e=j(`<div class="volume-popover svelte-1o4jdf5"><button class="ctrl ctrl-xs mr-2 border border-white/10 rounded-full p-1 hover:bg-white/10 svelte-1o4jdf5" aria-label="Mute"><!></button> <input type="range" class="vol-slider-pop svelte-1o4jdf5" min="0" max="1" step="0.01" aria-label="Volume"/> <span class="text-[10px] font-bold text-white/60 min-w-[28px] text-right font-mono select-none svelte-1o4jdf5"> </span></div>`),et=j(`<div class="eq svelte-1o4jdf5"><div class="eq-b svelte-1o4jdf5"></div> <div class="eq-b svelte-1o4jdf5"></div> <div class="eq-b svelte-1o4jdf5"></div></div>`),tt=j(`<span class="svelte-1o4jdf5"></span>`),nt=j(`<span class="text-amber-400 flex items-center gap-1 text-[9px] font-bold tracking-wider uppercase bg-amber-500/10 px-1.5 py-0.5 rounded flex-shrink-0 svelte-1o4jdf5" title="Failed to fetch music source from remote database"><!> Error Fetching</span>`),rt=j(`<button class="cursor-pointer svelte-1o4jdf5" style="background: none; border: none; padding: 0; color: inherit; font: inherit;">i</button>`),it=j(`<a target="_blank" class="svelte-1o4jdf5">i</a>`),at=j(`<span class="inst-chip-link svelte-1o4jdf5"><!></span>`),ot=j(`<div><div class="tr-num svelte-1o4jdf5"><!></div> <img loading="lazy" class="tr-art svelte-1o4jdf5"/> <div class="tr-info svelte-1o4jdf5"><div class="flex items-center gap-1.5 min-w-0 svelte-1o4jdf5"><span> </span> <!></div> <span class="tr-meta svelte-1o4jdf5"> </span></div> <div class="flex items-center gap-2 flex-shrink-0 svelte-1o4jdf5"><!>  <button class="tr-share-btn svelte-1o4jdf5" title="Copy track link" aria-label="Share track"><!></button></div></div>`),st=j(`<div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 animate-pulse svelte-1o4jdf5"><div class="bg-black/75 border border-red-500/30 px-4 py-2 rounded text-[12px] font-mono tracking-widest text-red-500 font-bold uppercase shadow-[0_0_20px_rgba(239,68,68,0.3)] select-none svelte-1o4jdf5">NO SIGNAL</div></div>`),ct=j(`<button> </button>`),lt=j(`<div class="visualizer-container fullscreen cursor-pointer svelte-1o4jdf5"><canvas class="visualizer-canvas svelte-1o4jdf5"></canvas> <!> <div class="visualizer-overlay svelte-1o4jdf5"><div class="flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-lg p-1 border border-white/10 svelte-1o4jdf5"></div></div></div>`),ut=j(`<div class="arigato-modal-backdrop svelte-1o4jdf5"><div class="arigato-modal-content svelte-1o4jdf5"><header class="arigato-modal-header svelte-1o4jdf5"><h2 class="svelte-1o4jdf5">ARIGATO INFO</h2> <button class="arigato-close-btn svelte-1o4jdf5"><!></button></header> <div class="arigato-modal-body scroll-y svelte-1o4jdf5"><div class="merch-link-container svelte-1o4jdf5"><a href="https://nxnjaa.beatstars.com/" target="_blank" rel="noopener noreferrer" class="merch-link-btn svelte-1o4jdf5"><!> NXNJA MERCH & MUSIC</a></div> <p class="intro-text svelte-1o4jdf5"></p> <div class="tos-box svelte-1o4jdf5"><div class="tos-microtext svelte-1o4jdf5"></div></div> <p class="outro-text svelte-1o4jdf5"></p></div></div></div>`),dt=j(`<div class="mp-backdrop svelte-1o4jdf5"><div><header class="panel-header svelte-1o4jdf5"><div class="brand svelte-1o4jdf5"><button class="logo-btn svelte-1o4jdf5" aria-label="Open DOGS Info"><!></button> <h1 class="svelte-1o4jdf5"></h1></div> <button class="close-btn svelte-1o4jdf5" aria-label="Close panel"><!></button></header> <div class="mp-body svelte-1o4jdf5"><div class="songs-layout svelte-1o4jdf5"><div><div><div class="vinyl-wrapper relative overflow-hidden svelte-1o4jdf5"><!></div> <div class="track-info mt-2 svelte-1o4jdf5"><div class="flex items-center justify-center mb-1.5 svelte-1o4jdf5"><button class="player-share-btn svelte-1o4jdf5" title="Copy track link" aria-label="Share track"><!></button></div> <div><h2> </h2></div> <div><p> </p></div> <div><p> </p></div></div></div> <div class="player-controls-block svelte-1o4jdf5"><div class="progress-row svelte-1o4jdf5"><span class="ptime svelte-1o4jdf5"> </span> <div class="progress-wrap waveform-slider-wrap relative h-9 flex items-end svelte-1o4jdf5"><div class="waveform-bars flex items-end justify-between absolute inset-0 pointer-events-none px-1 h-full svelte-1o4jdf5"></div> <input type="range" class="seek-input absolute inset-0 opacity-0 cursor-pointer w-full h-full svelte-1o4jdf5" min="0" step="0.1" aria-label="Seek"/></div> <span class="ptime svelte-1o4jdf5"> </span></div> <div class="controls-row svelte-1o4jdf5"><button aria-label="Shuffle"><!></button> <button class="ctrl ctrl-md svelte-1o4jdf5" aria-label="Previous"><!></button> <button><!></button> <button class="ctrl ctrl-md svelte-1o4jdf5" aria-label="Next"><!></button> <button aria-label="Repeat"><!></button></div> <div class="w-full flex flex-col items-center gap-1.5 mt-2 px-1 svelte-1o4jdf5"><div><span><!> <span class="svelte-1o4jdf5">VOCAL</span></span> <div class="dj-fader-slot relative svelte-1o4jdf5"><div></div></div> <span><!> <span class="svelte-1o4jdf5">INST</span></span></div></div> <div class="relative flex justify-center items-center gap-3 mt-2 w-full svelte-1o4jdf5"><!> <div class="flex items-center gap-1.5 svelte-1o4jdf5"><button aria-label="Toggle Visualizer"><!></button> <button> </button></div> <div class="relative svelte-1o4jdf5"><button class="ctrl ctrl-xs vol-toggle-btn svelte-1o4jdf5" aria-label="Toggle volume slider"><!></button></div></div></div></div> <div><div class="mobile-close-bar hidden py-2 px-4 border-b border-white/5 flex items-center justify-between svelte-1o4jdf5"><span class="text-xs font-bold text-white/50 svelte-1o4jdf5">Track Library</span> <button class="px-3 py-1 bg-white/5 text-white/75 rounded-lg text-xs font-bold svelte-1o4jdf5">Back to player</button></div> <div class="tl-header flex justify-between items-center gap-3 svelte-1o4jdf5"><div class="flex items-center gap-2 svelte-1o4jdf5"><!><span class="svelte-1o4jdf5">TRACKS</span> <span class="tl-count svelte-1o4jdf5"> </span></div> <div class="flex items-center gap-1.5 ml-auto svelte-1o4jdf5"><span class="text-[9px] text-white/30 font-bold font-sans svelte-1o4jdf5">SORT BY:</span> <select class="bg-black/40 border border-white/10 rounded px-1.5 py-0.5 text-[10px] font-bold text-white/60 outline-none cursor-pointer hover:border-white/20 transition-all font-sans svelte-1o4jdf5"><option class="svelte-1o4jdf5">DEFAULT</option><option class="svelte-1o4jdf5">ARTIST</option><option class="svelte-1o4jdf5">ALBUM</option><option class="svelte-1o4jdf5">YEAR</option><option class="svelte-1o4jdf5">FILENAME</option><option class="svelte-1o4jdf5">GENRE</option><option class="svelte-1o4jdf5">SEASON</option></select></div></div> <div class="tracklist scroll-y svelte-1o4jdf5"></div></div></div></div> <footer class="mp-footer svelte-1o4jdf5"><div class="mp-status svelte-1o4jdf5"><span class="mp-dot svelte-1o4jdf5"></span><span class="svelte-1o4jdf5">🐕</span></div> <span class="svelte-1o4jdf5">MUSIC</span></footer></div> <!> <canvas class="fader-fx-canvas pointer-events-none svelte-1o4jdf5"></canvas> <!></div>`);function ft(v,j){se(j,!0);let je=`/img/error_cover.png`;function ft(e){e.target.src.endsWith(je)||(e.target.src=je)}let pt=s(j,`isClosing`,3,!1),mt=s(j,`initialTrackId`,3,null),P=x(`default`),F=x(!1),ht=x(!1),gt=x(!1),_t=x(null),I=y(()=>N.isPlaying&&!pt()),L=x(!1),R=x(0),vt=x(!1),z=x(null),B=null,V=!1,yt=x(!1),bt=x(!1),xt=y(()=>{let e=He.split(/`{5,}/);return{intro:e[0]||``,tos:e[1]||``,outro:e[2]||``}});function St(e){if(!e)return``;let t=e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`);return t=t.replace(/(https?:\/\/[^\s]+)/g,`<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>`),t=t.replace(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/g,`<a href="mailto:$1">$1</a>`),t.replace(/\n/g,`<br>`)}let Ct=y(()=>{let e=A(W);if(!e)return Array(60).fill(10);if(N.waveformPeaks[e.id])return N.waveformPeaks[e.id];let t=e.id,n=[],r=0;for(let e=0;e<t.length;e++)r=(r<<5)-r+t.charCodeAt(e),r|=0;let i=Math.abs(r)%1e3;for(let e=0;e<60;e++){let t=e/59,r=Math.sin(i+t*Math.PI*4),a=Math.cos(i*1.5+t*Math.PI*10)*.4,o=Math.sin(i*2.3+t*Math.PI*22)*.15,s=Math.abs(r+a+o)/1.55,c=Math.sin(t*Math.PI),l=(s*70+15)*c;n.push(Math.max(10,Math.round(l)))}return n});M(()=>{window.innerWidth<=640&&A(L)&&A(R)===0&&A(F)&&b(F,!1)}),M(()=>{N.isPlaying&&b(yt,!0)});let wt=y(()=>!N.isPlaying&&!A(yt)?Ve.fragmentShader:Be[A(R)].fragmentShader);M(()=>{let e=N.analyser;return A(L)&&A(z)&&!pt()&&(B=new ze(A(z),e),B.init(A(wt)),B.start()),()=>{B&&(B.destroy(),B=null)}}),M(()=>{let e=A(wt);B&&A(L)&&(B.setPreset(e),B.start())}),M(()=>{A(F)?!history.state?.tracklistOpen&&!V&&(history.pushState({tracklistOpen:!0},``),V=!0):V&&(history.back(),V=!1)}),ve(()=>{V&&(history.back(),V=!1)});function Tt(e){!e.state?.tracklistOpen&&A(F)&&(b(F,!1),V=!1)}function Et(e){A(gt)&&A(_t)&&!A(_t).contains(e.target)&&!e.target.closest(`.vol-toggle-btn`)&&b(gt,!1)}let H=y(()=>Fe.unlocked?Ie:Ie.filter(e=>e.public!==!1));function Dt(e){return e.src?e.src.split(`/`).pop():``}function Ot(e){if(!e.dateAdded)return`Summer`;let t=new Date(e.dateAdded).getMonth();return t===11||t===0||t===1?`Winter`:t>=2&&t<=4?`Spring`:t>=5&&t<=7?`Summer`:`Fall`}let U=y(()=>{let e=[...A(H)];return A(P)===`artist`?e.sort((e,t)=>e.artist.localeCompare(t.artist)):A(P)===`album`?e.sort((e,t)=>e.album.localeCompare(t.album)):A(P)===`year`?e.sort((e,t)=>(e.year||0)-(t.year||0)):A(P)===`filename`?e.sort((e,t)=>Dt(e).localeCompare(Dt(t))):A(P)===`genre`?e.sort((e,t)=>(e.genre||``).localeCompare(t.genre||``)):A(P)===`season`&&e.sort((e,t)=>Ot(e).localeCompare(Ot(t))),e}),W=y(()=>A(H)[N.currentTrackIndex]??A(H)[0]);M(()=>{let e=A(H);if(N.library===e||N.library.length===0)return;let t=N.library[N.currentTrackIndex]?.id;N.init(e);let n=e.findIndex(e=>e.id===t);n===-1?(N.pause(),N.loadTrack(0,!1)):N.currentTrackIndex=n});let kt=x(0),At=x(0),jt=x(0),Mt=x(0),Nt=x(0),Pt=x(0),Ft=x(null),It=null;function Lt(e,t){e.stopPropagation();let n=`${window.location.origin}/music/${t.id}`;navigator.clipboard.writeText(n).then(()=>{b(Ft,t.id,!0),It&&clearTimeout(It),It=setTimeout(()=>{b(Ft,null)},2e3)}).catch(e=>{console.error(`Failed to copy share link:`,e)})}ve(()=>{It&&clearTimeout(It)}),Ae(()=>{if(Fe.revalidate(),N.init(A(H)),mt()){let e=A(H).findIndex(e=>e.id===mt());e!==-1&&N.loadTrack(e,!0)}else if(!N.hasPickedRandomTrack){N.hasPickedRandomTrack=!0;let e=Math.floor(Math.random()*A(H).length);N.loadTrack(e,!1)}});let G=x(null);function Rt(){let e=document.querySelector(`.track-row[data-track-id="${A(G)}"]`);e&&e.scrollIntoView({block:`nearest`,behavior:`smooth`})}function zt(e){b(G,e.id,!0);let t=A(H).findIndex(t=>t.id===e.id);N.currentTrackIndex===t&&!N.fetchErrors[e.id]?N.togglePlay():N.loadTrack(t,!0)}function Bt(){window.innerWidth<=640?b(F,!0):b(L,!A(L))}function Vt(){let e=!N.isInstrumental;N.setCrossfade(e)||(d(q),A(Wt)||(b(Wt,!0),setTimeout(()=>{b(Wt,!1)},300)),A(q)===5?(en(),b(Gt,!0),setTimeout(()=>{b(Gt,!1)},150)):A(q)===10?en(35):A(q)>5&&A(q)<10?en(8):A(q)>10&&Math.random()<.4&&en(3))}function Ht(e){return!e||isNaN(e)?`0:00`:`${Math.floor(e/60)}:${Math.floor(e%60).toString().padStart(2,`0`)}`}function Ut(e){let t=document.activeElement;if(!(t&&(t.tagName===`INPUT`||t.tagName===`TEXTAREA`||t.isContentEditable))){if(e.code===`Space`||e.key===` `)e.preventDefault(),N.togglePlay();else if(e.key===`ArrowDown`){if(A(U).length>0){e.preventDefault();let t=A(U).findIndex(e=>e.id===A(G));if(t===-1){let e=A(H)[N.currentTrackIndex];t=A(U).findIndex(t=>t.id===e?.id)}let n=(t+1)%A(U).length;b(G,A(U)[n].id,!0),Rt()}}else if(e.key===`ArrowUp`){if(A(U).length>0){e.preventDefault();let t=A(U).findIndex(e=>e.id===A(G));if(t===-1){let e=A(H)[N.currentTrackIndex];t=A(U).findIndex(t=>t.id===e?.id)}let n=(t-1+A(U).length)%A(U).length;b(G,A(U)[n].id,!0),Rt()}}else if(e.key===`Enter`&&A(G)){e.preventDefault();let t=A(U).find(e=>e.id===A(G));t&&zt(t)}}}let K=x(null),q=x(0),Wt=x(!1),Gt=x(!1),J,Y,X,Z=[],Q=[],Kt,qt=x(!1);M(()=>(A(K)&&Xt(),()=>{Kt&&cancelAnimationFrame(Kt),window.removeEventListener(`resize`,Zt),window.visualViewport?.removeEventListener(`resize`,Zt),X&&(X.dispose(),X=null),J=null,Y=null,Z=[],Q=[]})),M(()=>{if(N.currentTrackIndex,pt(),b(q,0),b(qt,!1),J){for(let e of Z)J.remove(e.mesh);for(let e of Q)J.remove(e.mesh)}Z=[],Q=[]});function Jt(){if(!A(K))return{width:window.innerWidth,height:window.innerHeight};let e=A(K).getBoundingClientRect();return{width:e.width||window.innerWidth,height:e.height||window.innerHeight}}function Yt(){let{width:e,height:t}=Jt(),n=document.querySelector(`.dj-fader-knob`);if(!n)return{x:e/2,y:t/2};let r=A(K)?A(K).getBoundingClientRect():{left:0,top:0},i=n.getBoundingClientRect();return{x:i.left+i.width/2-r.left,y:t-(i.top+i.height/2-r.top)}}function Xt(){if(!A(K))return;let{width:e,height:t}=Jt();A(K).width=e,A(K).height=t,J=new ie,Y=new u(0,e,t,0,-1,1),X=new _e({canvas:A(K),alpha:!0,antialias:!0}),X.setSize(e,t,!1),X.setPixelRatio(Math.min(window.devicePixelRatio,2)),window.addEventListener(`resize`,Zt),window.visualViewport?.addEventListener(`resize`,Zt),Qt()}function Zt(){if(!A(K)||!X||!Y)return;let{width:e,height:t}=Jt();A(K).width=e,A(K).height=t,X.setSize(e,t,!1),Y.right=e,Y.top=t,Y.updateProjectionMatrix()}function Qt(){if(Kt=requestAnimationFrame(Qt),!(!J||!Y||!X||!A(K))){if(A(q)>=10&&(b(qt,!0),Math.random()<.22)){let e=Yt();$t(e.x,e.y)}for(let e=Z.length-1;e>=0;e--){let t=Z[e];t.x+=t.vx,t.y+=t.vy,t.vy+=t.ay,t.life-=t.decay,t.mesh.position.set(t.x,t.y,0),t.mesh.material.opacity=t.life,t.life<=0&&(J.remove(t.mesh),t.mesh.geometry.dispose(),t.mesh.material.dispose(),Z.splice(e,1))}for(let e=Q.length-1;e>=0;e--){let t=Q[e];t.x+=t.vx,t.y+=t.vy,t.life-=t.decay;let n=t.startScale+(1-t.life)*88;t.mesh.scale.set(n,n,1),t.mesh.position.set(t.x,t.y,0),t.mesh.material.opacity=t.life*.16,t.life<=0&&(J.remove(t.mesh),t.mesh.geometry.dispose(),t.mesh.material.dispose(),Q.splice(e,1))}X.render(J,Y)}}function $t(e,t){if(!J)return;let n=new r(5,8),i=.85+Math.random()*.12,a=new xe(n,new ee({color:new Me(i,i,i*1.01),transparent:!0,opacity:.06,blending:1}));a.position.set(e,t,0),J.add(a),Q.push({mesh:a,x:e,y:t,vx:(Math.random()-.5)*.55+Math.sin(Date.now()*.001)*.22,vy:Math.random()*.7+1.25,startScale:1,life:1,decay:6e-4+Math.random()*4e-4})}function en(e=25){if(!J||!A(K))return;let t=Yt(),n=t.x,i=t.y;for(let t=0;t<e;t++){let e=new xe(new r(1.3,4),new ee({color:new Me(Math.random()<.4?16711765:16755200),transparent:!0,opacity:1,blending:2}));e.position.set(n,i,0),J.add(e);let t=Math.random()*Math.PI*2,a=Math.random()*4+2;Z.push({mesh:e,x:n,y:i,vx:Math.cos(t)*a,vy:Math.sin(t)*a,ay:-.15,life:1,decay:.02+Math.random()*.02})}}var tn=dt();D(`keydown`,c,Ut),D(`popstate`,c,Tt),D(`click`,c,Et);var nn=a(tn);let rn;var an=a(nn),on=a(an),sn=a(on);Le(a(sn),{size:`panel`}),p(sn);var cn=k(sn,2);cn.textContent=`MUSIC`,p(on);var ln=k(on,2);i(a(ln),{size:20}),p(ln),p(an);var un=k(an,2),dn=a(un),fn=a(dn);let pn;var mn=a(fn);let hn;var gn=a(mn),_n=a(gn),vn=e=>{var n=We(),r=a(n);Ce(r,e=>b(z,e),()=>A(z));var i=k(r,2),o=e=>{w(e,Ue())};t(i,e=>{!N.isPlaying&&!A(yt)&&e(o)});var s=k(i,2);De(a(s),{size:16,class:`text-white/70`}),p(s),p(n),E(`click`,n,()=>{b(vt,!0)}),w(e,n)},yn=e=>{var t=Ge();De(a(t),{size:16,class:`text-white/20`}),p(t),w(e,t)},bn=e=>{var n=Ee(),r=te(n),i=e=>{var t=Ke(),n=a(t);let r;var i=k(a(n),8),o=a(i);let s;p(i),C(2),p(n);var c=k(n,2);let l;p(t),T(()=>{r=S(n,1,`vinyl-record svelte-1o4jdf5`,null,r,{spinning:A(I)}),f(o,`src`,N.fetchErrors[A(W).id]||!A(W).cover?je:A(W).cover),f(o,`alt`,A(W).album),s=S(o,1,`record-art svelte-1o4jdf5`,null,s,{loaded:A(ht)}),l=S(c,1,`tonearm svelte-1o4jdf5`,null,l,{playing:A(I)})}),E(`click`,t,Bt),D(`load`,o,()=>b(ht,!0)),D(`error`,o,ft),Oe(o),w(e,t)},o=e=>{let t=y(()=>N.duration>0?(1-N.currentTime/N.duration)*.45+.25:.48),n=y(()=>N.duration>0?N.currentTime/N.duration*.45+.25:.48);var r=qe(),i=a(r),o=a(i),s=a(o),c=a(s,!0);p(s),C(2),p(o);var l=k(o,2),u=a(l);let d;var f=k(u,2);let m;var g=k(f,2);let _;var v=k(g,2);let ee;p(l),p(i),p(r),T(()=>{O(c,A(W).title),d=S(u,1,`spindle-left bg-zinc-900 svelte-1o4jdf5`,null,d,{spinning:A(I)}),m=S(f,1,`tape-roll-left bg-amber-950/70 svelte-1o4jdf5`,null,m,{spinning:A(I)}),h(f,`width: ${A(t)*46}px; height: ${A(t)*46}px;`),_=S(g,1,`spindle-right bg-zinc-900 svelte-1o4jdf5`,null,_,{spinning:A(I)}),ee=S(v,1,`tape-roll-right bg-amber-950/70 svelte-1o4jdf5`,null,ee,{spinning:A(I)}),h(v,`width: ${A(n)*46}px; height: ${A(n)*46}px;`)}),E(`click`,r,Bt),w(e,r)},s=e=>{var t=Je(),n=a(t),r=k(a(n),4),i=k(a(r),4),o=a(i),s=a(o,!0);p(o);var c=k(o,2),l=a(c,!0);p(c),p(i),p(r);var u=k(r,2),d=a(u);let f;var m=k(d,2),h=a(m);let g;p(m),p(u);var _=k(u,2);let v;p(n),p(t),T(()=>{O(s,A(W).title),O(l,A(W).artist||`WEAREDOGS`),f=S(d,1,`floppy-shutter-slider bg-zinc-400 svelte-1o4jdf5`,null,f,{open:A(I)}),g=S(h,1,`floppy-magnetic-disc bg-zinc-900 svelte-1o4jdf5`,null,g,{spinning:A(I)}),v=S(_,1,`floppy-drive-led svelte-1o4jdf5`,null,v,{active:A(I)})}),E(`click`,t,Bt),w(e,t)},c=e=>{var t=Xe(),n=a(t),r=a(n);let i;var o=k(r,2),s=a(o),c=a(s);let l;var u=k(c,2);let d;p(s);var f=k(s,2),m=a(f);let h;p(f);var g=k(f,2);fe(g,20,()=>Array(10),ge,(e,t,n)=>{var r=Ye();let i;T(e=>i=S(r,1,`comb-tooth svelte-1o4jdf5`,null,i,e),[()=>({vibrating:A(I)&&n%3==Math.floor(N.currentTime*4)%3})]),w(e,r)}),p(g),p(o),p(n),p(t),T(()=>{i=S(r,1,`music-box-key svelte-1o4jdf5`,null,i,{spinning:A(I)}),l=S(c,1,`music-box-gear gear-1 svelte-1o4jdf5`,null,l,{spinning:A(I)}),d=S(u,1,`music-box-gear gear-2 svelte-1o4jdf5`,null,d,{spinning:A(I)}),h=S(m,1,`music-box-drum bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 svelte-1o4jdf5`,null,h,{spinning:A(I)})}),E(`click`,t,Bt),w(e,t)};t(r,e=>{Re.musicDeckModel===`vinyl`?e(i):Re.musicDeckModel===`cassette`?e(o,1):Re.musicDeckModel===`floppy`?e(s,2):Re.musicDeckModel===`musicbox`&&e(c,3)}),w(e,n)};t(_n,e=>{A(L)&&!A(vt)?e(vn):A(L)&&A(vt)?e(yn,1):e(bn,-1)}),p(gn);var xn=k(gn,2),Sn=a(xn),Cn=a(Sn),wn=a(Cn),Tn=e=>{we(e,{size:12,class:`text-[#22c55e]`})},En=e=>{Se(e,{size:12})};t(wn,e=>{A(Ft)===A(W).id?e(Tn):e(En,-1)}),p(Cn),p(Sn);var Dn=k(Sn,2);let On;var kn=a(Dn);let An;var jn=a(kn,!0);p(kn),p(Dn);var Mn=k(Dn,2);let Nn;var Pn=a(Mn);let Fn;var In=a(Pn,!0);p(Pn),p(Mn);var Ln=k(Mn,2);let Rn;var zn=a(Ln);let Bn;var Vn=a(zn,!0);p(zn),p(Ln),p(xn),p(mn);var Hn=k(mn,2),Un=a(Hn),Wn=a(Un),Gn=a(Wn,!0);p(Wn);var Kn=k(Wn,2),qn=a(Kn);fe(qn,21,()=>A(Ct),ge,(e,t,n)=>{let r=y(()=>N.duration>0?N.currentTime/N.duration:0),i=y(()=>n/60);var a=Ze();let o;T(()=>{o=S(a,1,`waveform-bar transition-colors duration-100 rounded-full svelte-1o4jdf5`,null,o,{active:A(i)<=A(r)}),h(a,`height: ${A(t)??``}%; width: 3px;`)}),w(e,a)}),p(qn);var Jn=k(qn,2);ne(Jn),p(Kn);var Yn=k(Kn,2),Xn=a(Yn,!0);p(Yn),p(Un);var Zn=k(Un,2),Qn=a(Zn);let $n;l(a(Qn),{size:15}),p(Qn);var er=k(Qn,2);oe(a(er),{size:19}),p(er);var $=k(er,2);let tr;var nr=a($),rr=e=>{be(e,{size:22})},ir=e=>{w(e,Qe())},ar=e=>{pe(e,{size:22,fill:`currentColor`})},or=e=>{_(e,{size:22,fill:`currentColor`})};t(nr,e=>{N.fetchErrors[A(W).id]?e(rr):N.isLoading?e(ir,1):N.isPlaying?e(ar,2):e(or,-1)}),p($);var sr=k($,2);Ne(a(sr),{size:19}),p(sr);var cr=k(sr,2);let lr;var ur=a(cr),dr=e=>{g(e,{size:15})},fr=e=>{me(e,{size:15})},pr=e=>{le(e,{size:15})};t(ur,e=>{N.repeatMode===2?e(dr):N.repeatMode===3?e(fr,1):e(pr,-1)}),p(cr),p(Zn);var mr=k(Zn,2),hr=a(mr);let gr;var _r=a(hr);let vr;Te(a(_r),{size:12}),C(2),p(_r);var yr=k(_r,2),br=a(yr);let xr;p(yr);var Sr=k(yr,2);let Cr;o(a(Sr),{size:12}),C(2),p(Sr),p(hr),p(mr);var wr=k(mr,2),Tr=a(wr),Er=n=>{var r=$e(),i=a(r),o=a(i),s=e=>{re(e,{size:12,class:`text-red-400`})},c=t=>{e(t,{size:12})};t(o,e=>{N.isMuted||N.volume===0?e(s):e(c,-1)}),p(i);var l=k(i,2);ne(l);var u=k(l,2),d=a(u);p(u),p(r),Ce(r,e=>b(_t,e),()=>A(_t)),T(e=>{ae(l,N.volume),O(d,`${e??``}%`)},[()=>Math.round(N.volume*100)]),E(`click`,i,()=>N.toggleMute()),E(`input`,l,e=>N.setVolume(parseFloat(e.target.value))),w(n,r)};t(Tr,e=>{A(gt)&&e(Er)});var Dr=k(Tr,2),Or=a(Dr);let kr;de(a(Or),{size:13}),p(Or);var Ar=k(Or,2),jr=a(Ar,!0);p(Ar),p(Dr);var Mr=k(Dr,2),Nr=a(Mr),Pr=a(Nr),Fr=e=>{re(e,{size:13,class:`text-red-400`})},Ir=t=>{e(t,{size:13})};t(Pr,e=>{N.isMuted||N.volume===0?e(Fr):e(Ir,-1)}),p(Nr),p(Mr),p(wr),p(Hn),p(fn);var Lr=k(fn,2);let Rr;var zr=a(Lr),Br=k(a(zr),2);p(zr);var Vr=k(zr,2),Hr=a(Vr),Ur=a(Hr);ye(Ur,{size:13});var Wr=k(Ur,3),Gr=a(Wr,!0);p(Wr),p(Hr);var Kr=k(Hr,2),qr=k(a(Kr),2),Jr=a(qr);Jr.value=Jr.__value=`default`;var Yr=k(Jr);Yr.value=Yr.__value=`artist`;var Xr=k(Yr);Xr.value=Xr.__value=`album`;var Zr=k(Xr);Zr.value=Zr.__value=`year`;var Qr=k(Zr);Qr.value=Qr.__value=`filename`;var $r=k(Qr);$r.value=$r.__value=`genre`;var ei=k($r);ei.value=ei.__value=`season`,p(qr),p(Kr),p(Vr);var ti=k(Vr,2);fe(ti,21,()=>A(U),ge,(e,n,r)=>{var i=ot();let o;var s=a(i),c=a(s),l=e=>{w(e,et())},u=e=>{var t=tt();t.textContent=r+1,w(e,t)};t(c,e=>{A(W).id===A(n).id&&N.isPlaying?e(l):e(u,-1)}),p(s);var d=k(s,2),m=k(d,2),h=a(m),g=a(h);let _;var v=a(g,!0);p(g);var y=k(g,2),ee=e=>{var t=nt();be(a(t),{size:10}),C(),p(t),w(e,t)};t(y,e=>{N.fetchErrors[A(n).id]&&e(ee)}),p(h);var te=k(h,2),x=a(te);p(te),p(m);var ne=k(m,2),re=a(ne),ie=e=>{var r=at(),i=a(r),o=e=>{var t=rt();E(`click`,t,e=>{e.stopPropagation(),b(bt,!0)}),w(e,t)},s=e=>{var t=it();T(()=>f(t,`href`,A(n).attrib)),E(`click`,t,e=>e.stopPropagation()),w(e,t)};t(i,e=>{A(n).id===`arigato`?e(o):e(s,-1)}),p(r),w(e,r)};t(re,e=>{A(n).attrib&&e(ie)});var ae=k(re,2),oe=a(ae),se=e=>{we(e,{size:12,class:`text-[#22c55e]`})},ce=e=>{Se(e,{size:12})};t(oe,e=>{A(Ft)===A(n).id?e(se):e(ce,-1)}),p(ae),p(ne),p(i),T(()=>{o=S(i,1,`track-row svelte-1o4jdf5`,null,o,{active:A(W).id===A(n).id,"kb-focused":A(G)===A(n).id,"fetch-error":N.fetchErrors[A(n).id]}),f(i,`data-track-id`,A(n).id),f(d,`src`,N.fetchErrors[A(n).id]||!A(n).cover?je:A(n).cover),f(d,`alt`,A(n).album),_=S(g,1,`tr-title svelte-1o4jdf5`,null,_,{"line-through":N.fetchErrors[A(n).id],"opacity-50":N.fetchErrors[A(n).id]}),O(v,A(n).title),O(x,`${A(n).artist??``} · ${A(n).album??``} (${(A(n).year||``)??``})`)}),E(`click`,i,()=>zt(A(n))),D(`error`,d,ft),Oe(d),E(`click`,ae,e=>Lt(e,A(n))),w(e,i)}),p(ti),p(Lr),p(dn),p(un),C(2),p(nn);var ni=k(nn,2),ri=e=>{var n=lt(),r=a(n);Ce(r,e=>b(z,e),()=>A(z));var i=k(r,2),o=e=>{w(e,st())};t(i,e=>{!N.isPlaying&&!A(yt)&&e(o)});var s=k(i,2),c=a(s);fe(c,21,()=>Be,ge,(e,t,n)=>{var r=ct(),i=a(r,!0);p(r),T(()=>{S(r,1,`px-2 py-1 rounded text-[9px] font-bold transition-all uppercase tracking-wider font-mono
                ${A(R)===n?`bg-purple-600 text-white`:`text-white/40 hover:text-white/80`}`,`svelte-1o4jdf5`),O(i,A(t).name)}),E(`click`,r,()=>b(R,n,!0)),w(e,r)}),p(c),p(s),p(n),E(`click`,n,e=>{e.stopPropagation(),b(vt,!1)}),E(`click`,s,e=>e.stopPropagation()),w(e,n)};t(ni,e=>{A(L)&&A(vt)&&e(ri)});var ii=k(ni,2);Ce(ii,e=>b(K,e),()=>A(K));var ai=k(ii,2),oi=e=>{var t=ut(),n=a(t),r=a(n),o=k(a(r),2);i(a(o),{size:16}),p(o),p(r);var s=k(r,2),c=a(s),l=a(c);ce(a(l),{size:14}),C(),p(l),p(c);var u=k(c,2);he(u,()=>St(A(xt).intro),!0),p(u);var d=k(u,2),f=a(d);he(f,()=>St(A(xt).tos),!0),p(f),p(d);var m=k(d,2);he(m,()=>St(A(xt).outro),!0),p(m),p(s),p(n),p(t),E(`click`,t,()=>b(bt,!1)),E(`click`,n,e=>e.stopPropagation()),E(`click`,o,()=>b(bt,!1)),ke(3,t,()=>ue,()=>({duration:150})),w(e,t)};t(ai,e=>{A(bt)&&e(oi)}),p(tn),T((e,t)=>{rn=S(nn,1,`mp-container svelte-1o4jdf5`,null,rn,{closing:pt(),"theme-inst":N.isInstrumental}),pn=S(fn,1,`player-side svelte-1o4jdf5`,null,pn,{"tracklist-open":A(F)}),hn=S(mn,1,`player-top-block transition-all duration-300 ease-in-out svelte-1o4jdf5`,null,hn,{"opacity-0":A(F),"scale-95":A(F),"pointer-events-none":A(F)}),On=S(Dn,1,`scroll-container svelte-1o4jdf5`,null,On,{overflowing:A(At)>A(kt)}),h(Dn,`--scroll-dist: -${A(At)-A(kt)}px`),An=S(kn,1,`track-title scroll-text svelte-1o4jdf5`,null,An,{"animate-scroll":A(At)>A(kt)}),O(jn,A(W).title),Nn=S(Mn,1,`scroll-container svelte-1o4jdf5`,null,Nn,{overflowing:A(Mt)>A(jt)}),h(Mn,`--scroll-dist: -${A(Mt)-A(jt)}px`),Fn=S(Pn,1,`track-artist scroll-text svelte-1o4jdf5`,null,Fn,{"animate-scroll":A(Mt)>A(jt)}),O(In,A(W).artist),Rn=S(Ln,1,`scroll-container svelte-1o4jdf5`,null,Rn,{overflowing:A(Pt)>A(Nt)}),h(Ln,`--scroll-dist: -${A(Pt)-A(Nt)}px`),Bn=S(zn,1,`track-album scroll-text svelte-1o4jdf5`,null,Bn,{"animate-scroll":A(Pt)>A(Nt)}),O(Vn,A(W).album),O(Gn,e),f(Jn,`max`,N.duration||100),ae(Jn,N.currentTime),O(Xn,t),$n=S(Qn,1,`ctrl ctrl-sm svelte-1o4jdf5`,null,$n,{"active-ctrl":N.isShuffled}),tr=S($,1,`ctrl ctrl-play svelte-1o4jdf5`,null,tr,{"ctrl-error":N.fetchErrors[A(W).id]}),f($,`aria-label`,N.isPlaying?`Pause`:`Play`),lr=S(cr,1,`ctrl ctrl-sm svelte-1o4jdf5`,null,lr,{"active-ctrl":N.repeatMode>0}),f(cr,`title`,N.repeatMode===1?`Repeat: all`:N.repeatMode===2?`Repeat: one`:N.repeatMode===3?`Stop after current track`:`Repeat: off`),gr=S(hr,1,`dj-crossfader svelte-1o4jdf5`,null,gr,{"fader-flash":A(Gt),"fader-fried":A(q)>=10}),vr=S(_r,1,`fader-label left-label flex items-center gap-1 svelte-1o4jdf5`,null,vr,{active:!N.isInstrumental}),xr=S(br,1,`dj-fader-knob svelte-1o4jdf5`,null,xr,{right:N.isInstrumental,"knob-jiggle":A(Wt),fried:A(q)>=10}),Cr=S(Sr,1,`fader-label right-label flex items-center gap-1 svelte-1o4jdf5`,null,Cr,{active:N.isInstrumental}),kr=S(Or,1,`ctrl ctrl-xs svelte-1o4jdf5`,null,kr,{"active-ctrl":A(L)}),S(Ar,1,`w-[90px] h-[20px] flex items-center justify-center rounded text-[9px] font-bold transition-all font-mono uppercase tracking-wider select-none cursor-pointer
                      ${A(L)?`bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/25 active:scale-95`:`bg-transparent border border-white/5 text-white/20 hover:text-white/40 hover:border-white/10`}`,`svelte-1o4jdf5`),f(Ar,`title`,A(L)?`Click to cycle presets`:`Click to enable visualizer`),O(jr,Be[A(R)].name),Rr=S(Lr,1,`tracklist-side svelte-1o4jdf5`,null,Rr,{"show-mobile":A(F)}),O(Gr,A(H).length)},[()=>Ht(N.currentTime),()=>Ht(N.duration)]),E(`click`,tn,function(...e){j.onClose?.apply(this,e)}),E(`click`,nn,e=>e.stopPropagation()),E(`click`,sn,()=>{N.isPlaying||window.dispatchEvent(new CustomEvent(`open-info-panel`))}),E(`click`,ln,function(...e){j.onClose?.apply(this,e)}),E(`click`,Cn,e=>Lt(e,A(W))),n(kn,`clientWidth`,e=>b(At,e)),n(Dn,`clientWidth`,e=>b(kt,e)),n(Pn,`clientWidth`,e=>b(Mt,e)),n(Mn,`clientWidth`,e=>b(jt,e)),n(zn,`clientWidth`,e=>b(Pt,e)),n(Ln,`clientWidth`,e=>b(Nt,e)),E(`input`,Jn,e=>{N.seek(parseFloat(e.target.value))}),E(`change`,Jn,e=>{N.isPlaying||N.play(parseFloat(e.target.value))}),E(`click`,Qn,()=>N.setShuffle(!N.isShuffled)),E(`click`,er,()=>N.prevTrack()),E(`click`,$,()=>N.togglePlay()),E(`click`,sr,()=>N.nextTrack()),E(`click`,cr,()=>{N.repeatMode=(N.repeatMode+1)%4}),E(`click`,hr,Vt),E(`click`,Or,()=>{b(L,!A(L))}),E(`click`,Ar,()=>{A(L)?b(R,(A(R)+1)%Be.length):b(L,!0)}),E(`click`,Nr,()=>{b(gt,!A(gt))}),E(`click`,Br,()=>{b(F,!1)}),Pe(qr,()=>A(P),e=>b(P,e)),ke(1,dn,()=>ue,()=>({duration:120,delay:120})),ke(2,dn,()=>ue,()=>({duration:120})),w(v,tn),m()}je([`click`,`input`,`change`]);export{ft as default};