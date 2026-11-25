(function(){function e(t){"@babel/helpers - typeof";return e=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},e(t)}function t(e,t){if(!(e instanceof t))throw TypeError(`Cannot call a class as a function`)}function n(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,`value`in r&&(r.writable=!0),Object.defineProperty(e,i(r.key),r)}}function r(e,t,r){return t&&n(e.prototype,t),r&&n(e,r),Object.defineProperty(e,"prototype",{writable:!1}),e}function i(t){var n=a(t,`string`);return e(n)==`symbol`?n:n+``}function a(t,n){if(e(t)!=`object`||!t)return t;var r;if(typeof Symbol<`u`&&(r=t[Symbol.toPrimitive])!==void 0){var i=r.call(t,n||`default`);if(e(i)!=`object`)return i;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(n===`string`?String:Number)(t)}function o(){var e,t,n=typeof Symbol==`function`?Symbol:{},r=n.iterator||`@@iterator`,i=n.toStringTag||`@@toStringTag`;function a(n,r,i,a){var o=r&&r.prototype instanceof l?r:l,u=Object.create(o.prototype);return s(u,`_invoke`,function(n,r,i){var a,o,s,l=0,u=i||[],d=!1,f={p:0,n:0,v:e,a:p,f:p.bind(e,4),d:function(t,n){return a=t,o=0,s=e,f.n=n,c}};function p(n,r){for(o=n,s=r,t=0;!d&&l&&!i&&t<u.length;t++){var i,a=u[t],p=f.p,m=a[2];n>3?(i=m===r)&&(s=a[(o=a[4])?5:(o=3,3)],a[4]=a[5]=e):a[0]<=p&&((i=n<2&&p<a[1])?(o=0,f.v=r,f.n=a[1]):p<m&&(i=n<3||a[0]>r||r>m)&&(a[4]=n,a[5]=r,f.n=m,o=0))}if(i||n>1)return c;throw d=!0,r}return function(i,u,m){if(l>1)throw TypeError(`Generator is already running`);for(d&&u===1&&p(u,m),o=u,s=m;(t=o<2?e:s)||!d;){a||(o?o<3?(o>1&&(f.n=-1),p(o,s)):f.n=s:f.v=s);try{if(l=2,a){if(o||(i=`next`),t=a[i]){if(!(t=t.call(a,s)))throw TypeError(`iterator result is not an object`);if(!t.done)return t;s=t.value,o<2&&(o=0)}else o===1&&(t=a.return)&&t.call(a),o<2&&(s=TypeError(`The iterator does not provide a '`+i+`' method`),o=1);a=e}else if((t=(d=f.n<0)?s:n.call(r,f))!==c)break}catch(t){a=e,o=1,s=t}finally{l=1}}return{value:t,done:d}}}(n,i,a),!0),u}var c={};function l(){}function u(){}function d(){}t=Object.getPrototypeOf;var f=[][r]?t(t([][r]())):(s(t={},r,function(){return this}),t),p=d.prototype=l.prototype=Object.create(f);function m(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,d):(e.__proto__=d,s(e,i,`GeneratorFunction`)),e.prototype=Object.create(p),e}return u.prototype=d,s(p,`constructor`,d),s(d,`constructor`,u),u.displayName=`GeneratorFunction`,s(d,i,`GeneratorFunction`),s(p),s(p,i,`Generator`),s(p,r,function(){return this}),s(p,`toString`,function(){return`[object Generator]`}),(o=function(){return{w:a,m}})()}function s(e,t,n,r){var i=Object.defineProperty;try{i({},``,{})}catch(e){i=0}s=function(e,t,n,r){function a(t,n){s(e,t,function(e){return this._invoke(t,n,e)})}t?i?i(e,t,{value:n,enumerable:!r,configurable:!r,writable:!r}):e[t]=n:(a(`next`,0),a(`throw`,1),a(`return`,2))},s(e,t,n,r)}function c(e,t,n,r,i,a,o){try{var s=e[a](o),c=s.value}catch(e){n(e);return}s.done?t(c):Promise.resolve(c).then(r,i)}function l(e){return function(){var t=this,n=arguments;return new Promise(function(r,i){var a=e.apply(t,n);function o(e){c(a,r,i,o,s,`next`,e)}function s(e){c(a,r,i,o,s,`throw`,e)}o(void 0)})}}System.register([`./index-legacy-BbpU7suH.js`,`./three-legacy-RJR1-iRG.js`,`./openDogsPage-legacy-bVkcoS45.js`,`./TitlePage-legacy-DYuBqXex.js`,`./skip-forward-legacy-ClnYD-CS.js`,`./volume-2-legacy-B1FrV4sE.js`,`./volume-x-legacy-xR4msDVt.js`,`./shuffle-legacy-DdYmeHm1.js`,`./list-legacy-DqRmoZ9G.js`,`./external-link-legacy-QXfDgTpp.js`,`./arrow-left-legacy-pXh52UbL.js`,`./waves-legacy-BNJrIsVs.js`,`./maximize-2-legacy-QCN2RFEN.js`,`./share-2-legacy-NLpAn00z.js`,`./download-legacy-D41x67F6.js`,`./check-legacy-D5h2c9_L.js`,`./triangle-alert-legacy-da440iRG.js`,`./three-core-legacy-CtrKL6Gq.js`,`./doubleTap-legacy-TTFKgIZD.js`,`./DogsLogo-legacy-BiatkTq1.js`],function(e,n){var i,a,s,c,u,d,f,p,m,h,g,_,v,y,b,ee,x,S,C,te,ne,re,ie,w,T,ae,E,oe,D,se,O,ce,k,A,j,le,M,N,ue,de,P,F,I,L,R,fe,pe,me,he,z,ge,B,_e,ve,ye,be,xe,Se,Ce,we,Te,Ee,De,Oe,ke,Ae,je,Me,Ne,Pe,Fe,Ie,Le,Re,ze,Be,Ve,He,V,Ue,We,Ge,Ke,qe,Je,Ye,Xe,Ze,Qe,$e,et,tt,nt,rt,it,at,ot,st,ct,lt,ut,dt,ft,pt,mt,ht,gt;function _t(e,t){var n=O(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z`}]];z(e,I({name:`diamond`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=S(),i=j(r);c(i,t,`default`,{},null),T(e,r)},$$slots:{default:!0}}))}function vt(e,t){var n=O(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`m11.9 12.1 4.514-4.514`}],[`path`,{d:`M20.1 2.3a1 1 0 0 0-1.4 0l-1.114 1.114A2 2 0 0 0 17 4.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 17.828 7h1.344a2 2 0 0 0 1.414-.586L21.7 5.3a1 1 0 0 0 0-1.4z`}],[`path`,{d:`m6 16 2 2`}],[`path`,{d:`M8.23 9.85A3 3 0 0 1 11 8a5 5 0 0 1 5 5 3 3 0 0 1-1.85 2.77l-.92.38A2 2 0 0 0 12 18a4 4 0 0 1-4 4 6 6 0 0 1-6-6 4 4 0 0 1 4-4 2 2 0 0 0 1.85-1.23z`}]];z(e,I({name:`guitar`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=S(),i=j(r);c(i,t,`default`,{},null),T(e,r)},$$slots:{default:!0}}))}function yt(e,t){var n=O(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`m11 7.601-5.994 8.19a1 1 0 0 0 .1 1.298l.817.818a1 1 0 0 0 1.314.087L15.09 12`}],[`path`,{d:`M16.5 21.174C15.5 20.5 14.372 20 13 20c-2.058 0-3.928 2.356-6 2-2.072-.356-2.775-3.369-1.5-4.5`}],[`circle`,{cx:`16`,cy:`7`,r:`5`}]];z(e,I({name:`mic-vocal`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=S(),i=j(r);c(i,t,`default`,{},null),T(e,r)},$$slots:{default:!0}}))}function bt(e,t){var n=O(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`m17 2 4 4-4 4`}],[`path`,{d:`M3 11v-1a4 4 0 0 1 4-4h14`}],[`path`,{d:`m7 22-4-4 4-4`}],[`path`,{d:`M21 13v1a4 4 0 0 1-4 4H3`}],[`path`,{d:`M11 10h1v4`}]];z(e,I({name:`repeat-1`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=S(),i=j(r);c(i,t,`default`,{},null),T(e,r)},$$slots:{default:!0}}))}function xt(e,t){var n=O(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`m17 2 4 4-4 4`}],[`path`,{d:`M3 11v-1a4 4 0 0 1 4-4h14`}],[`path`,{d:`m7 22-4-4 4-4`}],[`path`,{d:`M21 13v1a4 4 0 0 1-4 4H3`}]];z(e,I({name:`repeat`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=S(),i=j(r);c(i,t,`default`,{},null),T(e,r)},$$slots:{default:!0}}))}function St(e,t){ae(t,!0);var n=`/img/error_cover.png`,r=6e4;function i(e){e.target.src.endsWith(n)||(e.target.src=n)}var c=oe(t,`isClosing`,3,!1),D=oe(t,`initialTrackId`,3,null),O=Be(function(){return t.onClose()}),N=C(`default`),I=C(!1),z=C(!1),V=C(!1),St=C(null),Ct=b(function(){var e;return!!B.fetchErrors[(e=B.library[B.currentTrackIndex])==null?void 0:e.id]}),H=b(function(){return B.isPlaying&&!c()&&!L(Ct)}),U=C(!1),wt=C(0),Tt=C(!1),Et=C(null),W=null,Dt=!1,Ot=C(!1),kt=C(!1),At=b(function(){var e=Ke.split(/`{5,}/);return{intro:e[0]||``,tos:e[1]||``,outro:e[2]||``}});function jt(e){if(!e)return``;var t=e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`);return t=t.replace(/(https?:\/\/[^\s]+)/g,`<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>`),t=t.replace(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/g,`<a href="mailto:$1">$1</a>`),t.replace(/\n/g,`<br>`)}var Mt=b(function(){var e=L(q);if(!e)return Array(60).fill(10);if(B.waveformPeaks[e.id])return B.waveformPeaks[e.id];for(var t=e.id,n=[],r=0,i=0;i<t.length;i++)r=(r<<5)-r+t.charCodeAt(i),r|=0;for(var a=Math.abs(r)%1e3,o=0;o<60;o++){var s=o/59,c=Math.sin(a+s*Math.PI*4),l=Math.cos(a*1.5+s*Math.PI*10)*.4,u=Math.sin(a*2.3+s*Math.PI*22)*.15,d=Math.abs(c+l+u)/1.55,f=Math.sin(s*Math.PI),p=(d*70+15)*f;n.push(Math.max(10,Math.round(p)))}return n});R(function(){window.innerWidth<=640&&L(U)&&L(wt)===0&&le(function(){return L(I)})&&v(I,!1)}),R(function(){B.isPlaying&&v(Ot,!0)});var Nt=b(function(){return!B.isPlaying&&!L(Ot)?Ge.fragmentShader:We[L(wt)].fragmentShader});R(function(){var e=B.analyser;return L(U)&&L(Et)&&!c()&&(W=new Ue(L(Et),e),W.init(L(Nt)),W.start()),function(){W&&(W.destroy(),W=null)}}),R(function(){var e=L(Nt);W&&L(U)&&(W.setPreset(e),W.start())}),R(function(){if(L(I)){var e;!((e=history.state)!=null&&e.tracklistOpen)&&!Dt&&(history.pushState({tracklistOpen:!0},``),Dt=!0)}else Dt&&(history.back(),Dt=!1)}),y(function(){Dt&&(history.back(),Dt=!1)});function Pt(e){var t;!((t=e.state)!=null&&t.tracklistOpen)&&L(I)&&(v(I,!1),Dt=!1)}function Ft(e){L(V)&&L(St)&&!L(St).contains(e.target)&&!e.target.closest(`.vol-toggle-btn`)&&v(V,!1)}var G=b(function(){return me(he.unlocked)});function It(e){return e.src?e.src.split(`/`).pop():``}function Lt(e){if(!e.dateAdded)return`Summer`;var t=new Date(e.dateAdded).getMonth();return t===11||t===0||t===1?`Winter`:t>=2&&t<=4?`Spring`:t>=5&&t<=7?`Summer`:`Fall`}var K=b(function(){var e=L(G).filter(function(e){return!e.hidden});return L(N)===`artist`?e.sort(function(e,t){return e.artist.localeCompare(t.artist)}):L(N)===`album`?e.sort(function(e,t){return e.album.localeCompare(t.album)}):L(N)===`year`?e.sort(function(e,t){return(e.year||0)-(t.year||0)}):L(N)===`filename`?e.sort(function(e,t){return It(e).localeCompare(It(t))}):L(N)===`genre`?e.sort(function(e,t){return(e.genre||``).localeCompare(t.genre||``)}):L(N)===`season`&&e.sort(function(e,t){return Lt(e).localeCompare(Lt(t))}),e}),q=b(function(){var e;return(e=L(G)[B.currentTrackIndex])==null?L(G)[0]:e});R(function(){var e,t=L(G);if(B.library!==t&&B.library.length!==0){var n=(e=B.library[B.currentTrackIndex])==null?void 0:e.id;B.init(t);var r=t.findIndex(function(e){return e.id===n});r===-1?(B.pause(),B.loadTrack(0,!1)):B.currentTrackIndex=r}});var Rt=C(0),zt=C(0),Bt=C(0),Vt=C(0),Ht=C(0),Ut=C(0),Wt=C(null),Gt=null;function Kt(e,t){e.stopPropagation();var n=`${window.location.origin}/music/${t.id}`;navigator.clipboard.writeText(n).then(function(){v(Wt,t.id,!0),Gt&&clearTimeout(Gt),Gt=setTimeout(function(){v(Wt,null)},2e3)}).catch(function(e){console.error(`Failed to copy share link:`,e)})}var qt=C(null);function Jt(e,t){return Yt.apply(this,arguments)}function Yt(){return Yt=l(o().m(function e(t,n){var i,a,s,c,l,u;return o().w(function(e){for(;;)switch(e.p=e.n){case 0:if(t.stopPropagation(),i=n.instrumental||n.src,i&&!L(qt)){e.n=1;break}return e.a(2);case 1:return v(qt,n.id,!0),e.p=2,e.n=3,fetch(i,he.fetchOptionsFor(i));case 3:if(a=e.v,a.ok){e.n=4;break}throw Error(`Fetch failed with status ${a.status}`);case 4:return l=URL,e.n=5,a.blob();case 5:s=l.createObjectURL.call(l,e.v),c=document.createElement(`a`),c.href=s,c.download=decodeURIComponent(i.split(`/`).pop()||``)||`${n.id}.mp3`,document.body.appendChild(c),c.click(),c.remove(),setTimeout(function(){return URL.revokeObjectURL(s)},r),e.n=7;break;case 6:e.p=6,u=e.v,console.error(`Failed to download track:`,u);case 7:return e.p=7,v(qt,null),e.f(7);case 8:return e.a(2)}},e,null,[[2,6,7,8]])})),Yt.apply(this,arguments)}y(function(){Gt&&clearTimeout(Gt)}),de(function(){if(he.revalidate(),B.init(L(G)),D()){var e=L(G).findIndex(function(e){return e.id===D()});e!==-1&&B.loadTrack(e,!0)}else if(!B.hasPickedRandomTrack){B.hasPickedRandomTrack=!0;var t=L(G).filter(function(e){return!e.hidden}),n=t[Math.floor(Math.random()*t.length)];B.loadTrack(L(G).indexOf(n),!1)}});var J=C(null);function Xt(){var e=document.querySelector(`.track-row[data-track-id="${L(J)}"]`);e&&e.scrollIntoView({block:`nearest`,behavior:`smooth`})}function Zt(e){v(J,e.id,!0);var t=L(G).findIndex(function(t){return t.id===e.id});B.currentTrackIndex===t&&!B.fetchErrors[e.id]?B.togglePlay():B.loadTrack(t,!0)}function Qt(){window.innerWidth<=640?v(I,!0):v(U,!L(U))}function $t(e){window.innerWidth>640||e.target.closest(`.scroll-container`)&&v(I,!0)}function en(){var e=!B.isInstrumental;B.setCrossfade(e)||(fe(X),L(rn)||(v(rn,!0),setTimeout(function(){v(rn,!1)},300)),L(X)===5?(gn(),v(an,!0),setTimeout(function(){v(an,!1)},150)):L(X)===10?gn(35):L(X)>5&&L(X)<10?gn(8):L(X)>10&&Math.random()<.4&&gn(3))}function tn(e){return!e||isNaN(e)?`0:00`:`${Math.floor(e/60)}:${Math.floor(e%60).toString().padStart(2,`0`)}`}function nn(e){var t=document.activeElement;if(!t||t.tagName!==`INPUT`&&t.tagName!==`TEXTAREA`&&!t.isContentEditable){if(e.code===`Space`||e.key===` `)e.preventDefault(),B.togglePlay();else if(e.key===`ArrowDown`){if(L(K).length>0){e.preventDefault();var n=L(K).findIndex(function(e){return e.id===L(J)});if(n===-1){var r=L(G)[B.currentTrackIndex];n=L(K).findIndex(function(e){return e.id===(r==null?void 0:r.id)})}var i=(n+1)%L(K).length;v(J,L(K)[i].id,!0),Xt()}}else if(e.key===`ArrowUp`){if(L(K).length>0){e.preventDefault();var a=L(K).findIndex(function(e){return e.id===L(J)});if(a===-1){var o=L(G)[B.currentTrackIndex];a=L(K).findIndex(function(e){return e.id===(o==null?void 0:o.id)})}var s=(a-1+L(K).length)%L(K).length;v(J,L(K)[s].id,!0),Xt()}}else if(e.key===`Enter`&&L(J)){e.preventDefault();var c=L(K).find(function(e){return e.id===L(J)});c&&Zt(c)}}}var Y=C(null),X=C(0),rn=C(!1),an=C(!1),Z,Q,$,on=[],sn=[],cn,ln=C(!1);R(function(){return L(Y)&&fn(),function(){var e;cn&&cancelAnimationFrame(cn),window.removeEventListener(`resize`,pn),(e=window.visualViewport)==null||e.removeEventListener(`resize`,pn),$&&($.dispose(),$=null),Z=null,Q=null,on=[],sn=[]}}),R(function(){if(B.currentTrackIndex,c(),v(X,0),v(ln,!1),Z){for(var e=0,t=on;e<t.length;e++){var n=t[e];Z.remove(n.mesh)}for(var r=0,i=sn;r<i.length;r++){var a=i[r];Z.remove(a.mesh)}}on=[],sn=[]});function un(){if(!L(Y))return{width:window.innerWidth,height:window.innerHeight};var e=L(Y).getBoundingClientRect();return{width:e.width||window.innerWidth,height:e.height||window.innerHeight}}function dn(){var e=un(),t=e.width,n=e.height,r=document.querySelector(`.dj-fader-knob`);if(!r)return{x:t/2,y:n/2};var i=L(Y)?L(Y).getBoundingClientRect():{left:0,top:0},a=r.getBoundingClientRect();return{x:a.left+a.width/2-i.left,y:n-(a.top+a.height/2-i.top)}}function fn(){var e;if(L(Y)){var t=un(),n=t.width,r=t.height;L(Y).width=n,L(Y).height=r,Z=new Ie,Q=new Fe(0,n,r,0,-1,1),$=new pe({canvas:L(Y),alpha:!0,antialias:!0}),$.setSize(n,r,!1),$.setPixelRatio(Math.min(window.devicePixelRatio,2)),window.addEventListener(`resize`,pn),(e=window.visualViewport)==null||e.addEventListener(`resize`,pn),mn()}}function pn(){if(L(Y)&&$&&Q){var e=un(),t=e.width,n=e.height;L(Y).width=t,L(Y).height=n,$.setSize(t,n,!1),Q.right=t,Q.top=n,Q.updateProjectionMatrix()}}function mn(){if(cn=requestAnimationFrame(mn),Z&&Q&&$&&L(Y)){if(L(X)>=10&&(v(ln,!0),Math.random()<.22)){var e=dn();hn(e.x,e.y)}for(var t=on.length-1;t>=0;t--){var n=on[t];n.x+=n.vx,n.y+=n.vy,n.vy+=n.ay,n.life-=n.decay,n.mesh.position.set(n.x,n.y,0),n.mesh.material.opacity=n.life,n.life<=0&&(Z.remove(n.mesh),n.mesh.geometry.dispose(),n.mesh.material.dispose(),on.splice(t,1))}for(var r=sn.length-1;r>=0;r--){var i=sn[r];i.x+=i.vx,i.y+=i.vy,i.life-=i.decay;var a=i.startScale+(1-i.life)*88;i.mesh.scale.set(a,a,1),i.mesh.position.set(i.x,i.y,0),i.mesh.material.opacity=i.life*.16,i.life<=0&&(Z.remove(i.mesh),i.mesh.geometry.dispose(),i.mesh.material.dispose(),sn.splice(r,1))}$.render(Z,Q)}}function hn(e,t){if(Z){var n=new Pe(5,8),r=.85+Math.random()*.12,i=new Re({color:new Le(r,r,r*1.01),transparent:!0,opacity:.06,blending:1}),a=new ze(n,i);a.position.set(e,t,0),Z.add(a),sn.push({mesh:a,x:e,y:t,vx:(Math.random()-.5)*.55+Math.sin(Date.now()*.001)*.22,vy:Math.random()*.7+1.25,startScale:1,life:1,decay:6e-4+Math.random()*4e-4})}}function gn(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:25;if(Z&&L(Y))for(var t=dn(),n=t.x,r=t.y,i=0;i<e;i++){var a=new Pe(1.3,4),o=new Re({color:new Le(Math.random()<.4?16711765:16755200),transparent:!0,opacity:1,blending:2}),s=new ze(a,o);s.position.set(n,r,0),Z.add(s);var c=Math.random()*Math.PI*2,l=Math.random()*4+2;on.push({mesh:s,x:n,y:r,vx:Math.cos(c)*l,vy:Math.sin(c)*l,ay:-.15,life:1,decay:.02+Math.random()*.02})}}var _n=gt();ce(`keydown`,p,nn),ce(`popstate`,p,Pt),ce(`click`,p,Ft);var vn=x(_n),yn,bn=x(vn),xn=x(bn),Sn=x(xn),Cn=x(Sn);He(Cn,{size:`panel`}),P(Sn);var wn=A(Sn,2);wn.textContent=`MUSIC`,P(xn);var Tn=A(xn,2),En=x(Tn);De(En,{size:20}),P(Tn),P(bn);var Dn=A(bn,2),On=x(Dn),kn=x(On),An,jn=x(kn),Mn,Nn=x(jn),Pn,Fn=x(Nn),In=function(e){var t=Je(),n=x(t);se(n,function(e){return v(Et,e)},function(){return L(Et)});var r=A(n,2),i=function(e){var t=qe();T(e,t)};h(r,function(e){!B.isPlaying&&!L(Ot)&&e(i)});var a=A(r,2),o=x(a);ke(o,{size:16,class:`text-white/70`}),P(a),P(t),F(`click`,t,function(){v(Tt,!0)}),T(e,t)},Ln=function(e){var t=Ye(),n=x(t);ke(n,{size:16,class:`text-white/20`}),P(t),T(e,t)},Rn=function(e){var t=S(),r=j(t),o=function(e){var t=Xe(),r=x(t),a,o=A(x(r),8),s=x(o),c;P(o),M(2),P(r);var l=A(r,2),f;P(t),d(function(){a=k(r,1,`vinyl-record svelte-1o4jdf5`,null,a,{spinning:L(H)}),u(s,`src`,B.fetchErrors[L(q).id]||!L(q).cover?n:L(q).cover),u(s,`alt`,L(q).album),c=k(s,1,`record-art svelte-1o4jdf5`,null,c,{loaded:L(z)}),f=k(l,1,`tonearm svelte-1o4jdf5`,null,f,{playing:L(H)})}),F(`click`,t,Qt),ce(`load`,s,function(){return v(z,!0)}),ce(`error`,s,i),ue(s),T(e,t)},c=function(e){var t=b(function(){return B.duration>0?(1-B.currentTime/B.duration)*.45+.25:.48}),n=b(function(){return B.duration>0?B.currentTime/B.duration*.45+.25:.48}),r=Ze(),i=x(r),o=x(i),c=x(o),l=s(c,!0);M(2),P(o);var u=A(o,2),f=x(u),p,m=A(f,2),h,g=A(m,2),_,v=A(g,2),y;P(u),P(i),P(r),d(function(){w(l,L(q).title),p=k(f,1,`spindle-left bg-zinc-900 svelte-1o4jdf5`,null,p,{spinning:L(H)}),h=k(m,1,`tape-roll-left bg-amber-950/70 svelte-1o4jdf5`,null,h,{spinning:L(H)}),a(m,`width: ${L(t)*46}px; height: ${L(t)*46}px;`),_=k(g,1,`spindle-right bg-zinc-900 svelte-1o4jdf5`,null,_,{spinning:L(H)}),y=k(v,1,`tape-roll-right bg-amber-950/70 svelte-1o4jdf5`,null,y,{spinning:L(H)}),a(v,`width: ${L(n)*46}px; height: ${L(n)*46}px;`)}),F(`click`,r,Qt),T(e,r)},l=function(e){var t=Qe(),n=x(t),r=A(x(n),4),i=A(x(r),4),a=x(i),o=s(a,!0),c=A(a,2),l=s(c,!0);P(i),P(r);var u=A(r,2),f=x(u),p,m=A(f,2),h=x(m),g;P(m),P(u);var _=A(u,2),v;P(n),P(t),d(function(){w(o,L(q).title),w(l,L(q).artist||`WEAREDOGS`),p=k(f,1,`floppy-shutter-slider bg-zinc-400 svelte-1o4jdf5`,null,p,{open:L(H)}),g=k(h,1,`floppy-magnetic-disc bg-zinc-900 svelte-1o4jdf5`,null,g,{spinning:L(H)}),v=k(_,1,`floppy-drive-led svelte-1o4jdf5`,null,v,{active:L(H)})}),F(`click`,t,Qt),T(e,t)},f=function(e){var t=et(),n=x(t),r=x(n),i,a=A(r,2),o=x(a),s=x(o),c,l=A(s,2),u;P(o);var f=A(o,2),p=x(f),m;P(f);var h=A(f,2);g(h,20,function(){return Array(10)},ne,function(e,t,n){var r=$e(),i;d(function(e){return i=k(r,1,`comb-tooth svelte-1o4jdf5`,null,i,{vibrating:e})},[function(){return L(H)&&n%3==Math.floor(B.currentTime*4)%3}]),T(e,r)}),P(h),P(a),P(n),P(t),d(function(){i=k(r,1,`music-box-key svelte-1o4jdf5`,null,i,{spinning:L(H)}),c=k(s,1,`music-box-gear gear-1 svelte-1o4jdf5`,null,c,{spinning:L(H)}),u=k(l,1,`music-box-gear gear-2 svelte-1o4jdf5`,null,u,{spinning:L(H)}),m=k(p,1,`music-box-drum bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 svelte-1o4jdf5`,null,m,{spinning:L(H)})}),F(`click`,t,Qt),T(e,t)};h(r,function(e){ve.musicDeckModel===`vinyl`?e(o):ve.musicDeckModel===`cassette`?e(c,1):ve.musicDeckModel===`floppy`?e(l,2):ve.musicDeckModel===`musicbox`&&e(f,3)}),T(e,t)};h(Fn,function(e){L(U)&&!L(Tt)?e(In):L(U)&&L(Tt)?e(Ln,1):e(Rn,-1)}),P(Nn);var zn=A(Nn,2),Bn=x(zn),Vn=x(Bn),Hn=x(Vn),Un=function(e){Me(e,{size:12,class:`text-[#22c55e]`})},Wn=function(e){Ae(e,{size:12})};h(Hn,function(e){L(Wt)===L(q).id?e(Un):e(Wn,-1)}),P(Vn);var Gn=A(Vn,2),Kn=function(e){var t=tt(),n,r=x(t);je(r,{size:12}),P(t),d(function(){n=k(t,1,`player-download-btn svelte-1o4jdf5`,null,n,{downloading:L(qt)===L(q).id}),u(t,`title`,L(q).instrumental?`Download instrumental`:`Download track`)}),F(`click`,t,function(e){return Jt(e,L(q))}),T(e,t)};h(Gn,function(e){(L(q).instrumental||L(q).src)&&e(Kn)}),P(Bn);var qn=A(Bn,2),Jn,Yn=x(qn),Xn,Zn=s(Yn,!0);P(qn);var Qn=A(qn,2),$n,er=x(Qn),tr,nr=s(er,!0);P(Qn);var rr=A(Qn,2),ir,ar=x(rr),or,sr=s(ar,!0);P(rr),P(zn),P(jn);var cr=A(jn,2),lr=x(cr),ur=x(lr),dr=s(ur,!0),fr=A(ur,2),pr=x(fr);g(pr,21,function(){return L(Mt)},ne,function(e,t,n){var r=b(function(){return B.duration>0?B.currentTime/B.duration:0}),i=b(function(){return n/60}),o=nt(),s;d(function(){var e;s=k(o,1,`waveform-bar transition-colors duration-100 rounded-full svelte-1o4jdf5`,null,s,{active:L(i)<=L(r)}),a(o,`height: ${(e=L(t))==null?``:e}%; width: 3px;`)}),T(e,o)}),P(pr);var mr=A(pr,2);te(mr),P(fr);var hr=A(fr,2),gr=s(hr,!0);P(lr);var _r=A(lr,2),vr=x(_r),yr,br=x(vr);we(br,{size:15}),P(vr);var xr=A(vr,2),Sr=x(xr);be(Sr,{size:19}),P(xr);var Cr=A(xr,2),wr,Tr=x(Cr),Er=function(e){Ne(e,{size:22})},Dr=function(e){var t=rt();T(e,t)},Or=function(e){_e(e,{size:22,fill:`currentColor`})},kr=function(e){ge(e,{size:22,fill:`currentColor`})};h(Tr,function(e){B.fetchErrors[L(q).id]?e(Er):B.isLoading?e(Dr,1):B.isPlaying?e(Or,2):e(kr,-1)}),P(Cr);var Ar=A(Cr,2),jr=x(Ar);xe(jr,{size:19}),P(Ar);var Mr=A(Ar,2),Nr,Pr=x(Mr),Fr=function(e){bt(e,{size:15})},Ir=function(e){_t(e,{size:15})},Lr=function(e){xt(e,{size:15})};h(Pr,function(e){B.repeatMode===2?e(Fr):B.repeatMode===3?e(Ir,1):e(Lr,-1)}),P(Mr),P(_r);var Rr=A(_r,2),zr=x(Rr),Br,Vr=x(zr),Hr;yt(x(Vr),{size:12}),M(2),P(Vr);var Ur=A(Vr,2),Wr=x(Ur),Gr;P(Ur);var Kr=A(Ur,2),qr;vt(x(Kr),{size:12}),M(2),P(Kr),P(zr),P(Rr);var Jr=A(Rr,2),Yr=x(Jr),Xr=function(e){var t=it(),n=x(t),r=x(n),i=function(e){Ce(e,{size:12,class:`text-red-400`})},a=function(e){Se(e,{size:12})};h(r,function(e){B.isMuted||B.volume===0?e(i):e(a,-1)}),P(n);var o=A(n,2);te(o);var c=A(o,2),l=s(c);P(t),se(t,function(e){return v(St,e)},function(){return L(St)}),d(function(e){m(o,B.volume),w(l,`${e==null?``:e}%`)},[function(){return Math.round(B.volume*100)}]),F(`click`,n,function(){return B.toggleMute()}),F(`input`,o,function(e){return B.setVolume(parseFloat(e.target.value))}),T(e,t)};h(Yr,function(e){L(V)&&e(Xr)});var Zr=A(Yr,2),Qr=x(Zr),$r,ei=x(Qr);Oe(ei,{size:13}),P(Qr);var ti=A(Qr,2),ni=s(ti,!0);P(Zr);var ri=A(Zr,2),ii=x(ri),ai=x(ii),oi=function(e){Ce(e,{size:13,class:`text-red-400`})},si=function(e){Se(e,{size:13})};h(ai,function(e){B.isMuted||B.volume===0?e(oi):e(si,-1)}),P(ii),P(ri),P(Jr),P(cr),P(kn);var ci=A(kn,2),li,ui=x(ci),di=A(x(ui),2);P(ui);var fi=A(ui,2),pi=x(fi),mi=x(pi);Te(mi,{size:13});var hi=A(mi,3),gi=s(hi,!0);P(pi);var _i=A(pi,2),vi=A(x(_i),2),yi=x(vi);yi.value=yi.__value=`default`;var bi=A(yi);bi.value=bi.__value=`artist`;var xi=A(bi);xi.value=xi.__value=`album`;var Si=A(xi);Si.value=Si.__value=`year`;var Ci=A(Si);Ci.value=Ci.__value=`filename`;var wi=A(Ci);wi.value=wi.__value=`genre`;var Ti=A(wi);Ti.value=Ti.__value=`season`,P(vi),ee(vi),P(_i),P(fi);var Ei=A(fi,2);g(Ei,21,function(){return L(K)},ne,function(e,t,r){var a=dt(),o,c=x(a),l=x(c),f=function(e){var t=at();T(e,t)},p=function(e){var t=ot();t.textContent=r+1,T(e,t)};h(l,function(e){L(q).id===L(t).id&&B.isPlaying?e(f):e(p,-1)}),P(c);var m=A(c,2),g=A(m,2),_=x(g),y=x(_),b,ee=s(y,!0),S=A(y,2),C=function(e){var t=st(),n=x(t);Ne(n,{size:10}),M(),P(t),T(e,t)};h(S,function(e){B.fetchErrors[L(t).id]&&e(C)}),P(_);var te=A(_,2),ne=s(te);P(g);var re=A(g,2),ie=x(re),ae=function(e){var n=ut(),r=x(n),i=function(e){var t=ct();F(`click`,t,function(e){e.stopPropagation(),v(kt,!0)}),T(e,t)},a=function(e){var n=lt();d(function(){return u(n,`href`,L(t).attrib)}),F(`click`,n,function(e){return e.stopPropagation()}),T(e,n)};h(r,function(e){L(t).id===`arigato`?e(i):e(a,-1)}),P(n),T(e,n)};h(ie,function(e){L(t).attrib&&e(ae)});var E=A(ie,2),oe=x(E),D=function(e){Me(e,{size:12,class:`text-[#22c55e]`})},se=function(e){Ae(e,{size:12})};h(oe,function(e){L(Wt)===L(t).id?e(D):e(se,-1)}),P(E);var O=A(E,2),j=function(e){var n=tt(),r,i=x(n);je(i,{size:12}),P(n),d(function(){r=k(n,1,`tr-download-btn svelte-1o4jdf5`,null,r,{downloading:L(qt)===L(t).id}),u(n,`title`,L(t).instrumental?`Download instrumental`:`Download track`)}),F(`click`,n,function(e){return Jt(e,L(t))}),T(e,n)};h(O,function(e){(L(t).instrumental||L(t).src)&&e(j)}),P(re),P(a),d(function(){var e,r,i;o=k(a,1,`track-row svelte-1o4jdf5`,null,o,{active:L(q).id===L(t).id,"kb-focused":L(J)===L(t).id,"fetch-error":B.fetchErrors[L(t).id]}),u(a,`data-track-id`,L(t).id),u(m,`src`,B.fetchErrors[L(t).id]||!L(t).cover?n:L(t).cover),u(m,`alt`,L(t).album),b=k(y,1,`tr-title svelte-1o4jdf5`,null,b,{"line-through":B.fetchErrors[L(t).id],"opacity-50":B.fetchErrors[L(t).id]}),w(ee,L(t).title),w(ne,`${(e=L(t).artist)==null?``:e} · ${(r=L(t).album)==null?``:r} (${(i=L(t).year||``)==null?``:i})`)}),F(`click`,a,function(){return Zt(L(t))}),ce(`error`,m,i),ue(m),F(`click`,E,function(e){return Kt(e,L(t))}),T(e,a)}),P(Ei),P(ci),P(On),P(Dn),M(2),P(vn);var Di=A(vn,2),Oi=function(e){var t=mt(),n=x(t);se(n,function(e){return v(Et,e)},function(){return L(Et)});var r=A(n,2),i=function(e){var t=ft();T(e,t)};h(r,function(e){!B.isPlaying&&!L(Ot)&&e(i)});var a=A(r,2),o=x(a);g(o,21,function(){return We},ne,function(e,t,n){var r=pt(),i=s(r,!0);d(function(){k(r,1,`px-2 py-1 rounded text-[9px] font-bold transition-all uppercase tracking-wider font-mono
                ${L(wt)===n?`bg-purple-600 text-white`:`text-white/40 hover:text-white/80`}`,`svelte-1o4jdf5`),w(i,L(t).name)}),F(`click`,r,function(){return v(wt,n,!0)}),T(e,r)}),P(o),P(a),P(t),F(`click`,t,function(e){e.stopPropagation(),v(Tt,!1)}),F(`click`,a,function(e){return e.stopPropagation()}),T(e,t)};h(Di,function(e){L(U)&&L(Tt)&&e(Oi)});var ki=A(Di,2);se(ki,function(e){return v(Y,e)},function(){return L(Y)});var Ai=A(ki,2),ji=function(e){var t=ht(),n=x(t),r=x(n),i=A(x(r),2),a=x(i);De(a,{size:16}),P(i),P(r);var o=A(r,2),s=x(o),c=x(s),l=x(c);Ee(l,{size:14}),M(),P(c),P(s);var u=A(s,2);re(u,function(){return jt(L(At).intro)},!0),P(u);var d=A(u,2),f=x(d);re(f,function(){return jt(L(At).tos)},!0),P(f),P(d);var p=A(d,2);re(p,function(){return jt(L(At).outro)},!0),P(p),P(o),P(n),P(t),F(`click`,t,function(){return v(kt,!1)}),F(`click`,n,function(e){return e.stopPropagation()}),F(`click`,i,function(){return v(kt,!1)}),_(3,t,function(){return Ve},function(){return{duration:150}}),T(e,t)};h(Ai,function(e){L(kt)&&e(ji)}),P(_n),d(function(e,t){yn=k(vn,1,`mp-container svelte-1o4jdf5`,null,yn,{closing:c(),"theme-inst":B.isInstrumental}),An=k(kn,1,`player-side svelte-1o4jdf5`,null,An,{"tracklist-open":L(I)}),Mn=k(jn,1,`player-top-block transition-all duration-300 ease-in-out svelte-1o4jdf5`,null,Mn,{"opacity-0":L(I),"scale-95":L(I),"pointer-events-none":L(I)}),Pn=k(Nn,1,`vinyl-wrapper relative overflow-hidden svelte-1o4jdf5`,null,Pn,{"deck-glitch":L(Ct)}),Jn=k(qn,1,`scroll-container svelte-1o4jdf5`,null,Jn,{overflowing:L(zt)>L(Rt)}),a(qn,`--scroll-dist: -${L(zt)-L(Rt)}px`),Xn=k(Yn,1,`track-title scroll-text svelte-1o4jdf5`,null,Xn,{"animate-scroll":L(zt)>L(Rt)}),w(Zn,L(q).title),$n=k(Qn,1,`scroll-container svelte-1o4jdf5`,null,$n,{overflowing:L(Vt)>L(Bt)}),a(Qn,`--scroll-dist: -${L(Vt)-L(Bt)}px`),tr=k(er,1,`track-artist scroll-text svelte-1o4jdf5`,null,tr,{"animate-scroll":L(Vt)>L(Bt)}),w(nr,L(q).artist),ir=k(rr,1,`scroll-container svelte-1o4jdf5`,null,ir,{overflowing:L(Ut)>L(Ht)}),a(rr,`--scroll-dist: -${L(Ut)-L(Ht)}px`),or=k(ar,1,`track-album scroll-text svelte-1o4jdf5`,null,or,{"animate-scroll":L(Ut)>L(Ht)}),w(sr,L(q).album),w(dr,e),u(mr,`max`,B.duration||100),m(mr,B.currentTime),w(gr,t),yr=k(vr,1,`ctrl ctrl-sm svelte-1o4jdf5`,null,yr,{"active-ctrl":B.isShuffled}),wr=k(Cr,1,`ctrl ctrl-play svelte-1o4jdf5`,null,wr,{"ctrl-error":B.fetchErrors[L(q).id]}),u(Cr,`aria-label`,B.isPlaying?`Pause`:`Play`),Nr=k(Mr,1,`ctrl ctrl-sm svelte-1o4jdf5`,null,Nr,{"active-ctrl":B.repeatMode>0}),u(Mr,`title`,B.repeatMode===1?`Repeat: all`:B.repeatMode===2?`Repeat: one`:B.repeatMode===3?`Stop after current track`:`Repeat: off`),Br=k(zr,1,`dj-crossfader svelte-1o4jdf5`,null,Br,{"fader-flash":L(an),"fader-fried":L(X)>=10}),Hr=k(Vr,1,`fader-label left-label flex items-center gap-1 svelte-1o4jdf5`,null,Hr,{active:!B.isInstrumental}),Gr=k(Wr,1,`dj-fader-knob svelte-1o4jdf5`,null,Gr,{right:B.isInstrumental,"knob-jiggle":L(rn),fried:L(X)>=10}),qr=k(Kr,1,`fader-label right-label flex items-center gap-1 svelte-1o4jdf5`,null,qr,{active:B.isInstrumental}),$r=k(Qr,1,`ctrl ctrl-xs svelte-1o4jdf5`,null,$r,{"active-ctrl":L(U)}),k(ti,1,`w-[90px] h-[20px] flex items-center justify-center rounded text-[9px] font-bold transition-all font-mono uppercase tracking-wider select-none cursor-pointer
                      ${L(U)?`bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/25 active:scale-95`:`bg-transparent border border-white/5 text-white/20 hover:text-white/40 hover:border-white/10`}`,`svelte-1o4jdf5`),u(ti,`title`,L(U)?`Click to cycle presets`:`Click to enable visualizer`),w(ni,We[L(wt)].name),li=k(ci,1,`tracklist-side svelte-1o4jdf5`,null,li,{"show-mobile":L(I)}),w(gi,L(K).length)},[function(){return tn(B.currentTime)},function(){return tn(B.duration)}]),F(`click`,_n,O),F(`click`,vn,function(e){return e.stopPropagation()}),F(`click`,Sn,function(){var e,t=[...arguments];(e=ye)==null||e.apply(this,t)}),F(`click`,Tn,function(){var e,n=[...arguments];(e=t.onClose)==null||e.apply(this,n)}),F(`click`,zn,$t),F(`click`,Vn,function(e){return Kt(e,L(q))}),E(Yn,`clientWidth`,function(e){return v(zt,e)}),E(qn,`clientWidth`,function(e){return v(Rt,e)}),E(er,`clientWidth`,function(e){return v(Vt,e)}),E(Qn,`clientWidth`,function(e){return v(Bt,e)}),E(ar,`clientWidth`,function(e){return v(Ut,e)}),E(rr,`clientWidth`,function(e){return v(Ht,e)}),F(`input`,mr,function(e){B.seek(parseFloat(e.target.value))}),F(`change`,mr,function(e){B.isPlaying||B.play(parseFloat(e.target.value))}),F(`click`,vr,function(){return B.setShuffle(!B.isShuffled)}),F(`click`,xr,function(){return B.prevTrack()}),F(`click`,Cr,function(){return B.togglePlay()}),F(`click`,Ar,function(){return B.nextTrack()}),F(`click`,Mr,function(){B.repeatMode=(B.repeatMode+1)%4}),F(`click`,zr,en),F(`click`,Qr,function(){v(U,!L(U))}),F(`click`,ti,function(){L(U)?v(wt,(L(wt)+1)%We.length):v(U,!0)}),F(`click`,ii,function(){v(V,!L(V))}),F(`click`,di,function(){v(I,!1)}),f(vi,function(){return L(N)},function(e){return v(N,e)}),_(1,On,function(){return Ve},function(){return{duration:120,delay:120}}),_(2,On,function(){return Ve},function(){return{duration:120}}),T(e,_n),ie()}return e(`default`,St),{setters:[function(e){i=e.$,a=e.A,s=e.At,c=e.B,u=e.C,d=e.Ct,f=e.D,p=e.Dt,m=e.E,h=e.G,g=e.H,_=e.I,v=e.It,y=e.K,b=e.Kt,ee=e.O,x=e.Ot,S=e.Q,C=e.Rt,te=e.S,ne=e.U,re=e.V,ie=e.Xt,w=e.Y,T=e.Z,ae=e.Zt,E=e._,oe=e.a,D=e.an,se=e.g,O=e.i,ce=e.it,k=e.j,A=e.jt,j=e.kt,le=e.mt,M=e.nn,N=e.nt,ue=e.ot,de=e.q,P=e.rn,F=e.rt,I=e.s,L=e.ut,R=e.wt,fe=e.zt},function(e){pe=e.n},function(e){me=e.a,he=e.i,z=e.l,ge=e.o,B=e.r},function(e){_e=e.f,ve=e.s,ye=e.u},function(e){be=e.n,xe=e.t},function(e){Se=e.t},function(e){Ce=e.t},function(e){we=e.t},function(e){Te=e.t},function(e){Ee=e.t},function(e){De=e.t},function(e){Oe=e.t},function(e){ke=e.t},function(e){Ae=e.t},function(e){je=e.t},function(e){Me=e.t},function(e){Ne=e.t},function(e){Pe=e.B,Fe=e.Er,Ie=e.Qi,Le=e.U,Re=e.ar,ze=e.ir},function(e){Be=e.t},function(e){Ve=e.n,He=e.t}],execute:function(){V=document.createElement(`style`),V.textContent=`@-webkit-keyframes svelte-1o4jdf5-trophyFloat{0%{transform:translateY(0)scale(1)}to{transform:translateY(-3px)scale(1.04)}}@keyframes svelte-1o4jdf5-trophyFloat{0%{transform:translateY(0)scale(1)}to{transform:translateY(-3px)scale(1.04)}}@-webkit-keyframes svelte-1o4jdf5-pulseGlow{0%{box-shadow:0 0 4px rgba(239,68,68,.1)}to{box-shadow:0 0 12px rgba(239,68,68,.35)}}@keyframes svelte-1o4jdf5-pulseGlow{0%{box-shadow:0 0 4px rgba(239,68,68,.1)}to{box-shadow:0 0 12px rgba(239,68,68,.35)}}@-webkit-keyframes svelte-1o4jdf5-searchPulse{0%{border-color:rgba(var(--color-neon-gold,#e6b900), .4)}to{border-color:rgba(var(--color-neon-gold,#e6b900), .95)}}@keyframes svelte-1o4jdf5-searchPulse{0%{border-color:rgba(var(--color-neon-gold,#e6b900), .4)}to{border-color:rgba(var(--color-neon-gold,#e6b900), .95)}}@-webkit-keyframes svelte-1o4jdf5-flashGlow{0%,to{border-color:var(--border-light,rgba(255,255,255,.05));box-shadow:none}50%{border-color:rgba(var(--color-neon-red,#f34), .8);box-shadow:0 0 20px rgba(var(--color-neon-red,#f34), .35)}}@keyframes svelte-1o4jdf5-flashGlow{0%,to{border-color:var(--border-light,rgba(255,255,255,.05));box-shadow:none}50%{border-color:rgba(var(--color-neon-red,#f34), .8);box-shadow:0 0 20px rgba(var(--color-neon-red,#f34), .35)}}.mp-backdrop.svelte-1o4jdf5{z-index:1000;-webkit-backdrop-filter:blur(12px);background:rgba(0,0,0,.55);justify-content:center;align-items:center;display:flex;position:fixed;top:0;bottom:0;left:0;right:0}.mp-container.svelte-1o4jdf5{-webkit-backdrop-filter:blur(24px)saturate(180%);--glow-color:rgba(170,90,255,.85);--glow-light:rgba(170,90,255,.6);--badge-bg:rgba(170,90,255,.13);--badge-border:rgba(170,90,255,.28);--badge-text:rgba(180,110,255,.9);--badge-bg-hover:rgba(170,90,255,.22);--badge-border-hover:rgba(170,90,255,.45);--active-row-bg:rgba(170,90,255,.07);--active-btn-text:rgba(170,90,255,.9);--play-gradient-start:rgba(170,90,255,.92);--play-gradient-end:rgba(90,130,255,.92);--play-glow:rgba(140,80,255,.5);--progress-gradient-start:rgba(170,90,255,.9);--progress-gradient-end:rgba(90,180,255,.8);background:rgba(7,7,11,.94);border:1px solid rgba(255,255,255,.07);border-radius:22px;flex-direction:column;width:94vw;max-width:1080px;height:90vh;max-height:820px;-webkit-animation:.38s cubic-bezier(.16,1,.3,1) forwards svelte-1o4jdf5-mpIn;animation:.38s cubic-bezier(.16,1,.3,1) forwards svelte-1o4jdf5-mpIn;display:flex;overflow:hidden;box-shadow:0 40px 100px rgba(0,0,0,.9),inset 0 1px rgba(255,255,255,.06)}.mp-container.theme-inst.svelte-1o4jdf5{--glow-color:rgba(90,210,255,.85);--glow-light:rgba(90,210,255,.6);--badge-bg:rgba(90,210,255,.13);--badge-border:rgba(90,210,255,.28);--badge-text:rgba(90,210,255,.9);--badge-bg-hover:rgba(90,210,255,.22);--badge-border-hover:rgba(90,210,255,.45);--active-row-bg:rgba(90,210,255,.07);--active-btn-text:rgba(90,210,255,.9);--play-gradient-start:rgba(90,210,255,.92);--play-gradient-end:rgba(90,130,255,.92);--play-glow:rgba(90,210,255,.5);--progress-gradient-start:rgba(90,210,255,.9);--progress-gradient-end:rgba(90,180,255,.8)}.mp-container.closing.svelte-1o4jdf5{-webkit-animation:.3s cubic-bezier(.4,0,1,1) forwards svelte-1o4jdf5-mpOut;animation:.3s cubic-bezier(.4,0,1,1) forwards svelte-1o4jdf5-mpOut}@-webkit-keyframes svelte-1o4jdf5-mpIn{0%{opacity:0;transform:translateY(28px)scale(.97)}to{opacity:1;transform:none}}@keyframes svelte-1o4jdf5-mpIn{0%{opacity:0;transform:translateY(28px)scale(.97)}to{opacity:1;transform:none}}@-webkit-keyframes svelte-1o4jdf5-mpOut{0%{opacity:1;transform:none}to{opacity:0;transform:translateY(18px)scale(.97)}}@keyframes svelte-1o4jdf5-mpOut{0%{opacity:1;transform:none}to{opacity:0;transform:translateY(18px)scale(.97)}}.mp-body.svelte-1o4jdf5{flex:1;grid-template-rows:1fr;grid-template-columns:1fr;display:grid;overflow:hidden}.mp-body.svelte-1o4jdf5>:where(.svelte-1o4jdf5){grid-area:1/1;width:100%;min-width:0;height:100%;min-height:0}.songs-layout.svelte-1o4jdf5{height:100%;display:flex;overflow:hidden}.player-side.svelte-1o4jdf5{background:rgba(0,0,0,.12);border-right:1px solid rgba(255,255,255,.05);flex-direction:column;flex-shrink:0;align-items:center;gap:13px;width:320px;min-width:260px;padding:22px 18px 16px;display:flex;overflow-x:hidden;overflow-y:auto}.player-top-block.svelte-1o4jdf5{flex-direction:column;align-items:center;width:100%;min-width:0;display:flex}.vinyl-wrapper.svelte-1o4jdf5{flex-shrink:0;width:210px;height:210px;position:relative}.vinyl-record.svelte-1o4jdf5{background:radial-gradient(circle,#1a1a1a 0%,#111 17%,#0d0d0d 18.5%,#1a1a1a 20%,#0d0d0d 22%,#1c1c1c 38%,#0d0d0d 39%,#1c1c1c 55%,#0d0d0d 56%,#1c1c1c 70%,#0a0a0a 100%);border-radius:50%;justify-content:center;align-items:center;width:210px;height:210px;-webkit-animation:2.6s linear infinite paused svelte-1o4jdf5-vspin;animation:2.6s linear infinite paused svelte-1o4jdf5-vspin;display:flex;position:relative;box-shadow:0 0 0 1.5px rgba(255,255,255,.03),0 8px 40px rgba(0,0,0,.85),inset 0 0 24px rgba(0,0,0,.5)}.vinyl-record.spinning.svelte-1o4jdf5{-webkit-animation-play-state:running;animation-play-state:running}@-webkit-keyframes svelte-1o4jdf5-vspin{to{transform:rotate(360deg)}}@keyframes svelte-1o4jdf5-vspin{to{transform:rotate(360deg)}}.vinyl-wrapper.deck-glitch.svelte-1o4jdf5>:where(.svelte-1o4jdf5){-webkit-animation:3.4s step-end infinite svelte-1o4jdf5-deck-glitch-jolt;animation:3.4s step-end infinite svelte-1o4jdf5-deck-glitch-jolt}.vinyl-wrapper.deck-glitch.svelte-1o4jdf5 .vinyl-record:where(.svelte-1o4jdf5){-webkit-animation:.42s steps(2,end) infinite svelte-1o4jdf5-deck-stuck;animation:.42s steps(2,end) infinite svelte-1o4jdf5-deck-stuck}.vinyl-wrapper.deck-glitch.svelte-1o4jdf5:after{content:"";z-index:20;pointer-events:none;mix-blend-mode:screen;background:linear-gradient(transparent 0,transparent 46%,rgba(255,40,80,.28) 46%,rgba(255,40,80,.28) 49%,transparent 49%),repeating-linear-gradient(0deg,rgba(0,0,0,.28) 0,rgba(0,0,0,.28) 1px,transparent 1px,transparent 3px);-webkit-animation:3.4s step-end infinite svelte-1o4jdf5-deck-glitch-tear;animation:3.4s step-end infinite svelte-1o4jdf5-deck-glitch-tear;position:absolute;top:0;bottom:0;left:0;right:0}@-webkit-keyframes svelte-1o4jdf5-deck-stuck{0%{transform:rotate(-3deg)}50%{transform:rotate(4deg)}}@keyframes svelte-1o4jdf5-deck-stuck{0%{transform:rotate(-3deg)}50%{transform:rotate(4deg)}}@-webkit-keyframes svelte-1o4jdf5-deck-glitch-jolt{0%{-webkit-filter:drop-shadow(5px 0 rgba(255,0,70,.75))drop-shadow(-5px 0 rgba(0,240,255,.75));filter:drop-shadow(5px 0 rgba(255,0,70,.75))drop-shadow(-5px 0 rgba(0,240,255,.75));transform:translate(-5px,1px)skew(-6deg)}3%{-webkit-filter:drop-shadow(-7px 0 rgba(255,0,70,.75))drop-shadow(7px 0 rgba(0,240,255,.75))saturate(2.2);filter:drop-shadow(-7px 0 rgba(255,0,70,.75))drop-shadow(7px 0 rgba(0,240,255,.75))saturate(2.2);transform:translate(6px,-2px)skew(9deg)}6%{-webkit-filter:drop-shadow(3px 0 rgba(255,0,70,.7))drop-shadow(-3px 0 rgba(0,240,255,.7))hue-rotate(80deg);filter:drop-shadow(3px 0 rgba(255,0,70,.7))drop-shadow(-3px 0 rgba(0,240,255,.7))hue-rotate(80deg);transform:translate(-3px,3px)scaleY(.94)}9%{-webkit-filter:drop-shadow(-4px 0 rgba(255,0,70,.75))drop-shadow(4px 0 rgba(0,240,255,.75))contrast(1.6);filter:drop-shadow(-4px 0 rgba(255,0,70,.75))drop-shadow(4px 0 rgba(0,240,255,.75))contrast(1.6);transform:translate(4px)skew(-12deg)}12%{-webkit-filter:drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6));filter:drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6));transform:translate(-2px,-1px)}15%{-webkit-filter:grayscale(.55)brightness(.8);filter:grayscale(.55)brightness(.8);transform:none}62%{-webkit-filter:drop-shadow(-4px 0 rgba(255,0,70,.7))drop-shadow(4px 0 rgba(0,240,255,.7));filter:drop-shadow(-4px 0 rgba(255,0,70,.7))drop-shadow(4px 0 rgba(0,240,255,.7));transform:translate(3px)skew(5deg)}65%{-webkit-filter:drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6))grayscale(.4);filter:drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6))grayscale(.4);transform:translate(-2px,1px)}68%,to{-webkit-filter:grayscale(.55)brightness(.8);filter:grayscale(.55)brightness(.8);transform:none}}@keyframes svelte-1o4jdf5-deck-glitch-jolt{0%{-webkit-filter:drop-shadow(5px 0 rgba(255,0,70,.75))drop-shadow(-5px 0 rgba(0,240,255,.75));filter:drop-shadow(5px 0 rgba(255,0,70,.75))drop-shadow(-5px 0 rgba(0,240,255,.75));transform:translate(-5px,1px)skew(-6deg)}3%{-webkit-filter:drop-shadow(-7px 0 rgba(255,0,70,.75))drop-shadow(7px 0 rgba(0,240,255,.75))saturate(2.2);filter:drop-shadow(-7px 0 rgba(255,0,70,.75))drop-shadow(7px 0 rgba(0,240,255,.75))saturate(2.2);transform:translate(6px,-2px)skew(9deg)}6%{-webkit-filter:drop-shadow(3px 0 rgba(255,0,70,.7))drop-shadow(-3px 0 rgba(0,240,255,.7))hue-rotate(80deg);filter:drop-shadow(3px 0 rgba(255,0,70,.7))drop-shadow(-3px 0 rgba(0,240,255,.7))hue-rotate(80deg);transform:translate(-3px,3px)scaleY(.94)}9%{-webkit-filter:drop-shadow(-4px 0 rgba(255,0,70,.75))drop-shadow(4px 0 rgba(0,240,255,.75))contrast(1.6);filter:drop-shadow(-4px 0 rgba(255,0,70,.75))drop-shadow(4px 0 rgba(0,240,255,.75))contrast(1.6);transform:translate(4px)skew(-12deg)}12%{-webkit-filter:drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6));filter:drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6));transform:translate(-2px,-1px)}15%{-webkit-filter:grayscale(.55)brightness(.8);filter:grayscale(.55)brightness(.8);transform:none}62%{-webkit-filter:drop-shadow(-4px 0 rgba(255,0,70,.7))drop-shadow(4px 0 rgba(0,240,255,.7));filter:drop-shadow(-4px 0 rgba(255,0,70,.7))drop-shadow(4px 0 rgba(0,240,255,.7));transform:translate(3px)skew(5deg)}65%{-webkit-filter:drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6))grayscale(.4);filter:drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6))grayscale(.4);transform:translate(-2px,1px)}68%,to{-webkit-filter:grayscale(.55)brightness(.8);filter:grayscale(.55)brightness(.8);transform:none}}@-webkit-keyframes svelte-1o4jdf5-deck-glitch-tear{0%{opacity:1;transform:translateY(-38%)}3%{transform:translateY(24%)}6%{transform:translateY(-12%)}9%{transform:translateY(36%)}12%{transform:translateY(4%)}15%{opacity:.25;transform:translateY(0)}62%{opacity:1;transform:translateY(-20%)}65%{transform:translateY(30%)}68%,to{opacity:.25;transform:translateY(0)}}@keyframes svelte-1o4jdf5-deck-glitch-tear{0%{opacity:1;transform:translateY(-38%)}3%{transform:translateY(24%)}6%{transform:translateY(-12%)}9%{transform:translateY(36%)}12%{transform:translateY(4%)}15%{opacity:.25;transform:translateY(0)}62%{opacity:1;transform:translateY(-20%)}65%{transform:translateY(30%)}68%,to{opacity:.25;transform:translateY(0)}}@media (prefers-reduced-motion:reduce){.vinyl-wrapper.deck-glitch.svelte-1o4jdf5:after{-webkit-animation:none;animation:none}.vinyl-wrapper.deck-glitch.svelte-1o4jdf5>:where(.svelte-1o4jdf5){-webkit-animation:none;animation:none}.vinyl-wrapper.deck-glitch.svelte-1o4jdf5 .vinyl-record:where(.svelte-1o4jdf5){-webkit-animation:none;animation:none}.vinyl-wrapper.deck-glitch.svelte-1o4jdf5>:where(.svelte-1o4jdf5){-webkit-filter:grayscale(.55)brightness(.8)drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6));filter:grayscale(.55)brightness(.8)drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6))}}.groove.svelte-1o4jdf5{pointer-events:none;border:1px solid rgba(255,255,255,.03);border-radius:50%;position:absolute}.g1.svelte-1o4jdf5{width:72%;height:72%}.g2.svelte-1o4jdf5{width:56%;height:56%}.g3.svelte-1o4jdf5{border-color:rgba(255,255,255,.024);width:40%;height:40%}.g4.svelte-1o4jdf5{border-color:rgba(255,255,255,.02);width:86%;height:86%}.record-label.svelte-1o4jdf5{z-index:2;background:#111;border:2px solid rgba(255,255,255,.1);border-radius:50%;width:88px;height:88px;position:relative;overflow:hidden;box-shadow:0 2px 14px rgba(0,0,0,.65)}.record-art.svelte-1o4jdf5{object-fit:cover;opacity:0;width:100%;height:100%;transition:opacity .4s}.record-art.loaded.svelte-1o4jdf5{opacity:1}.spindle.svelte-1o4jdf5{z-index:3;background:radial-gradient(circle,#777 0%,#333 100%);border-radius:50%;width:7px;height:7px;position:absolute;box-shadow:0 0 4px rgba(0,0,0,.8)}.tonearm.svelte-1o4jdf5{transform-origin:top;z-index:5;background:linear-gradient(#888 0%,#555 60%,#333 100%);border-radius:2px;width:4px;height:96px;transition:transform .9s cubic-bezier(.4,0,.2,1);position:absolute;top:6px;right:-6px;transform:rotate(-15deg);box-shadow:0 2px 8px rgba(0,0,0,.5)}.tonearm.svelte-1o4jdf5:after{content:"";background:var(--glow-color,rgba(170,90,255,.85));width:8px;height:8px;box-shadow:0 0 8px var(--glow-light,rgba(170,90,255,.6));border-radius:50%;position:absolute;bottom:-4px;left:-2px}.tonearm.playing.svelte-1o4jdf5{transform:rotate(22deg)}.track-info.svelte-1o4jdf5{text-align:center;width:100%;min-width:0;overflow:hidden}.scroll-container.svelte-1o4jdf5{white-space:nowrap;text-align:center;width:100%;overflow:hidden}.scroll-container.overflowing.svelte-1o4jdf5{text-align:left}.scroll-text.svelte-1o4jdf5{white-space:nowrap;display:inline-block}.scroll-text.animate-scroll.svelte-1o4jdf5{-webkit-animation:8s linear infinite alternate svelte-1o4jdf5-scroll-text;animation:8s linear infinite alternate svelte-1o4jdf5-scroll-text}@-webkit-keyframes svelte-1o4jdf5-scroll-text{0%,15%{transform:translate(0)}85%,to{transform:translateX(var(--scroll-dist))}}@keyframes svelte-1o4jdf5-scroll-text{0%,15%{transform:translate(0)}85%,to{transform:translateX(var(--scroll-dist))}}.track-title.svelte-1o4jdf5{letter-spacing:.06em;color:rgba(255,255,255,.94);margin:0 0 4px;font-family:Outfit,Inter,sans-serif;font-size:1.2rem;font-weight:800}.track-artist.svelte-1o4jdf5{color:rgba(255,255,255,.55);margin:0 0 2px;font-family:Inter,sans-serif;font-size:.82rem}.track-album.svelte-1o4jdf5{color:rgba(255,255,255,.28);text-transform:uppercase;letter-spacing:.06em;margin:0;font-family:Outfit,monospace;font-size:.68rem}.tr-share-btn.svelte-1o4jdf5,.tr-download-btn.svelte-1o4jdf5{color:rgba(255,255,255,.45);cursor:pointer;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:6px;flex-shrink:0;justify-content:center;align-items:center;width:24px;height:24px;transition:all .2s;display:flex}.tr-share-btn.svelte-1o4jdf5:hover,.tr-download-btn.svelte-1o4jdf5:hover{color:rgba(255,255,255,.9);background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.16)}.player-share-btn.svelte-1o4jdf5,.player-download-btn.svelte-1o4jdf5{background:var(--badge-bg,rgba(170,90,255,.13));border:1px solid var(--badge-border,rgba(170,90,255,.28));width:22px;height:22px;color:var(--badge-text,rgba(180,110,255,.9));cursor:pointer;border-radius:50%;flex-shrink:0;justify-content:center;align-items:center;transition:all .2s;display:flex}.player-share-btn.svelte-1o4jdf5:hover,.player-download-btn.svelte-1o4jdf5:hover{background:var(--badge-bg-hover,rgba(170,90,255,.22));color:#c89bff;border-color:var(--badge-border-hover,rgba(170,90,255,.45))}.tr-download-btn.downloading.svelte-1o4jdf5,.player-download-btn.downloading.svelte-1o4jdf5{pointer-events:none;-webkit-animation:1s ease-in-out infinite svelte-1o4jdf5-download-pulse;animation:1s ease-in-out infinite svelte-1o4jdf5-download-pulse}@-webkit-keyframes svelte-1o4jdf5-download-pulse{50%{opacity:.35}}@keyframes svelte-1o4jdf5-download-pulse{50%{opacity:.35}}.progress-row.svelte-1o4jdf5{align-items:center;gap:8px;width:100%;display:flex}.ptime.svelte-1o4jdf5{color:rgba(255,255,255,.3);text-align:center;min-width:28px;font-family:monospace;font-size:.65rem}.progress-wrap.svelte-1o4jdf5{cursor:pointer;background:rgba(255,255,255,.1);border-radius:3px;flex:1;height:3px;position:relative}.seek-input.svelte-1o4jdf5{opacity:0;cursor:pointer;width:100%;height:24px;margin:0;position:absolute;top:-10px;bottom:-10px;left:0;right:0}.controls-row.svelte-1o4jdf5{justify-content:center;align-items:center;gap:10px;width:100%;display:flex}.ctrl.svelte-1o4jdf5{color:rgba(255,255,255,.5);cursor:pointer;background:0 0;border:none;border-radius:50%;justify-content:center;align-items:center;padding:0;transition:all .15s;display:flex}.ctrl.svelte-1o4jdf5:hover{color:rgba(255,255,255,.9);transform:scale(1.1)}.ctrl.svelte-1o4jdf5:active{transform:scale(.95)}.ctrl-xs.svelte-1o4jdf5{width:26px;height:26px}.ctrl-sm.svelte-1o4jdf5{width:30px;height:30px}.ctrl-md.svelte-1o4jdf5{color:rgba(255,255,255,.72);width:38px;height:38px}.ctrl-md.svelte-1o4jdf5:hover{color:#fff}.ctrl-play.svelte-1o4jdf5{color:#fff;background:linear-gradient(135deg, var(--play-gradient-start,rgba(170,90,255,.92)) 0%, var(--play-gradient-end,rgba(90,130,255,.92)) 100%);width:54px;height:54px;box-shadow:0 4px 22px var(--play-glow,rgba(140,80,255,.5));border-radius:50%;transition:all .2s}.ctrl-play.ctrl-error.svelte-1o4jdf5{color:#050508;background:linear-gradient(135deg,#f59e0b 0%,#d97706 100%);box-shadow:0 4px 22px rgba(245,158,11,.5)}.ctrl-play.ctrl-error.svelte-1o4jdf5:hover{transform:scale(1.07);box-shadow:0 6px 30px rgba(245,158,11,.7)}.ctrl-play.svelte-1o4jdf5:active{transform:scale(.97)}.active-ctrl.svelte-1o4jdf5{color:var(--active-btn-text,rgba(170,90,255,.9))!important}.spin-ring.svelte-1o4jdf5{border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;width:18px;height:18px;-webkit-animation:.7s linear infinite svelte-1o4jdf5-sr;animation:.7s linear infinite svelte-1o4jdf5-sr}@-webkit-keyframes svelte-1o4jdf5-sr{to{transform:rotate(360deg)}}@keyframes svelte-1o4jdf5-sr{to{transform:rotate(360deg)}}.tracklist-side.svelte-1o4jdf5{flex-direction:column;flex:1;min-width:0;display:flex;overflow:hidden}.tl-header.svelte-1o4jdf5{letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.28);border-bottom:1px solid rgba(255,255,255,.05);flex-shrink:0;align-items:center;gap:7px;padding:14px 22px 10px;font-family:Outfit,monospace;font-size:.68rem;font-weight:700;display:flex}.tl-count.svelte-1o4jdf5{background:rgba(255,255,255,.07);border-radius:10px;margin-left:auto;padding:2px 8px;font-size:.62rem}.tracklist.svelte-1o4jdf5{flex:1;padding:6px 0;overflow-y:auto}.track-row.svelte-1o4jdf5{cursor:pointer;align-items:center;gap:12px;padding:10px 22px;transition:background .14s;display:flex;position:relative}.track-row.svelte-1o4jdf5:hover,.track-row.kb-focused.svelte-1o4jdf5{background:rgba(255,255,255,.04)}.track-row.kb-focused.svelte-1o4jdf5{outline-offset:-3px;outline:1px dashed rgba(255,255,255,.25)}.track-row.fetch-error.svelte-1o4jdf5{background:rgba(245,158,11,.03);border-left:3px solid rgba(245,158,11,.4)}.track-row.fetch-error.svelte-1o4jdf5:hover,.track-row.fetch-error.kb-focused.svelte-1o4jdf5{background:rgba(245,158,11,.06)}.track-row.fetch-error.svelte-1o4jdf5 .tr-title:where(.svelte-1o4jdf5){color:#f59e0b!important}.track-row.active.fetch-error.svelte-1o4jdf5{background:rgba(245,158,11,.1)!important}.track-row.active.fetch-error.svelte-1o4jdf5:before{background:#f59e0b!important}.track-row.active.svelte-1o4jdf5{background:var(--active-row-bg,rgba(170,90,255,.07))}.track-row.active.svelte-1o4jdf5:before{content:"";background:linear-gradient(to bottom, var(--glow-color,rgba(170,90,255,.9)), rgba(90,150,255,.7));border-radius:0 2px 2px 0;width:3px;position:absolute;top:0;bottom:0;left:0}.tr-num.svelte-1o4jdf5{text-align:center;color:rgba(255,255,255,.28);flex-shrink:0;width:18px;font-family:monospace;font-size:.72rem}.tr-art.svelte-1o4jdf5{object-fit:cover;background:rgba(255,255,255,.05);border-radius:6px;flex-shrink:0;width:42px;height:42px}.tr-info.svelte-1o4jdf5{flex-direction:column;flex:1;gap:2px;min-width:0;display:flex}.tr-title.svelte-1o4jdf5{color:rgba(255,255,255,.86);white-space:nowrap;text-overflow:ellipsis;font-family:Outfit,Inter,sans-serif;font-size:.86rem;font-weight:600;overflow:hidden}.track-row.active.svelte-1o4jdf5 .tr-title:where(.svelte-1o4jdf5){color:rgba(200,155,255,.95)}.tr-meta.svelte-1o4jdf5{color:rgba(255,255,255,.33);white-space:nowrap;text-overflow:ellipsis;font-family:Inter,sans-serif;font-size:.7rem;overflow:hidden}.inst-chip-link.svelte-1o4jdf5{letter-spacing:.1em;color:#22c55e;cursor:pointer;flex-shrink:0;padding:2px;font-size:.56rem;font-weight:700;text-decoration:underline;transition:color .2s}.inst-chip-link.svelte-1o4jdf5:hover{color:#16a34a}.eq.svelte-1o4jdf5{align-items:flex-end;gap:2px;height:15px;display:flex}.eq-b.svelte-1o4jdf5{background:var(--glow-color,rgba(170,90,255,.85));border-radius:1px;width:3px;-webkit-animation:.55s infinite alternate svelte-1o4jdf5-eq;animation:.55s infinite alternate svelte-1o4jdf5-eq}.eq-b.svelte-1o4jdf5:first-child{height:60%;-webkit-animation-delay:0s;animation-delay:0s}.eq-b.svelte-1o4jdf5:nth-child(2){height:100%;-webkit-animation-delay:.15s;animation-delay:.15s}.eq-b.svelte-1o4jdf5:nth-child(3){height:45%;-webkit-animation-delay:.3s;animation-delay:.3s}@-webkit-keyframes svelte-1o4jdf5-eq{0%{transform:scaleY(.35)}to{transform:scaleY(1)}}@keyframes svelte-1o4jdf5-eq{0%{transform:scaleY(.35)}to{transform:scaleY(1)}}.mp-footer.svelte-1o4jdf5{color:rgba(255,255,255,.22);letter-spacing:.06em;background:rgba(0,0,0,.22);border-top:1px solid rgba(255,255,255,.05);flex-shrink:0;justify-content:space-between;align-items:center;height:36px;padding:0 22px;font-family:monospace;font-size:.62rem;display:flex}.mp-status.svelte-1o4jdf5{align-items:center;gap:7px;display:flex}.mp-dot.svelte-1o4jdf5{background:#0f6;border-radius:50%;width:5px;height:5px;box-shadow:0 0 5px rgba(0,255,102,.55)}.scroll-y.svelte-1o4jdf5{overflow-x:hidden;overflow-y:auto}.scroll-y.svelte-1o4jdf5::-webkit-scrollbar{width:4px}.scroll-y.svelte-1o4jdf5::-webkit-scrollbar-track{background:0 0}.scroll-y.svelte-1o4jdf5::-webkit-scrollbar-thumb{background:rgba(255,255,255,.07);border-radius:2px}.scroll-y.svelte-1o4jdf5::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,.16)}@media (min-width:641px) and (max-height:780px){.mp-container.svelte-1o4jdf5{height:96vh}}@media (min-width:641px) and (max-height:760px){.player-side.svelte-1o4jdf5{gap:10px;padding:14px 16px 12px}.vinyl-wrapper.svelte-1o4jdf5,.vinyl-record.svelte-1o4jdf5{width:max(90px,min(96vh - 450px,210px));height:max(90px,min(96vh - 450px,210px))}.record-label.svelte-1o4jdf5{width:42%;height:42%}.tonearm.svelte-1o4jdf5{height:45%}.track-title.svelte-1o4jdf5{font-size:1.05rem}.track-artist.svelte-1o4jdf5,.track-album.svelte-1o4jdf5{font-size:.74rem}.progress-row.svelte-1o4jdf5 .progress-wrap:where(.svelte-1o4jdf5){height:28px}.ctrl-play.svelte-1o4jdf5{width:46px;height:46px}.player-controls-block.svelte-1o4jdf5>div:where(.svelte-1o4jdf5){margin-top:4px}}@media (min-width:641px) and (max-height:560px){.mp-footer.svelte-1o4jdf5{display:none}.player-side.svelte-1o4jdf5{gap:8px;padding:10px 14px 8px}.player-top-block.svelte-1o4jdf5{flex-direction:row;justify-content:center;align-items:center;gap:14px;width:100%}.vinyl-wrapper.svelte-1o4jdf5,.vinyl-record.svelte-1o4jdf5{width:96px;height:96px}.player-top-block.svelte-1o4jdf5 .track-info:where(.svelte-1o4jdf5){flex:1;min-width:0;margin-top:0}.progress-row.svelte-1o4jdf5 .progress-wrap:where(.svelte-1o4jdf5){height:28px}.controls-row.svelte-1o4jdf5{gap:8px}.ctrl-play.svelte-1o4jdf5{width:42px;height:42px}.ctrl-md.svelte-1o4jdf5{width:32px;height:32px}.player-controls-block.svelte-1o4jdf5>div:where(.svelte-1o4jdf5){margin-top:4px}}@media (max-width:640px){.mp-container.svelte-1o4jdf5{border-radius:0;width:100vw;height:100%;max-height:100%}.songs-layout.svelte-1o4jdf5{flex-direction:column;position:relative;overflow:hidden}.player-side.svelte-1o4jdf5{width:100%;min-width:unset;border-bottom:none;border-right:none;flex-direction:column;flex-shrink:0;justify-content:space-between;gap:8px;height:95%;max-height:none;padding:12px 14px;display:flex;overflow:hidden}.player-top-block.svelte-1o4jdf5{flex-direction:column;justify-content:center;align-items:center;height:62%;transition:transform .3s cubic-bezier(.16,1,.3,1),opacity .3s;display:flex}.player-controls-block.svelte-1o4jdf5{flex-direction:column;flex-shrink:0;justify-content:flex-end;gap:8px;height:38%;display:flex}.vinyl-wrapper.svelte-1o4jdf5,.vinyl-record.svelte-1o4jdf5{width:130px;height:130px}.record-label.svelte-1o4jdf5{width:52px;height:52px}.tonearm.svelte-1o4jdf5{height:70px}.tracklist-side.svelte-1o4jdf5{z-index:20;opacity:0;pointer-events:none;background:rgba(7,7,11,.98);border-bottom:1px solid rgba(255,255,255,.08);transition:transform .3s cubic-bezier(.16,1,.3,1),opacity .3s;position:absolute;top:0;left:0;right:0;transform:translateY(-100%);box-shadow:0 10px 30px rgba(0,0,0,.5);width:100%!important;height:62%!important;display:flex!important}.tracklist-side.show-mobile.svelte-1o4jdf5{opacity:1;pointer-events:auto;transform:translateY(0)}.mobile-close-bar.svelte-1o4jdf5{display:flex!important}.track-title.svelte-1o4jdf5{font-size:1rem}.track-artist.svelte-1o4jdf5,.track-album.svelte-1o4jdf5{font-size:.72rem}.track-info.svelte-1o4jdf5 .scroll-container:where(.svelte-1o4jdf5){cursor:pointer}.ctrl-play.svelte-1o4jdf5{width:46px;height:46px}}.panel-header.svelte-1o4jdf5{background:rgba(0,0,0,.2);border-bottom:1px solid rgba(255,255,255,.06);justify-content:space-between;align-items:center;height:64px;padding:0 24px;display:flex}.brand.svelte-1o4jdf5{align-items:center;gap:12px;display:flex}.brand.svelte-1o4jdf5 h1:where(.svelte-1o4jdf5){letter-spacing:.05em;text-transform:uppercase;color:rgba(255,255,255,.95);margin:0;font-family:Outfit,Inter,sans-serif;font-size:1.1rem;font-weight:700}.close-btn.svelte-1o4jdf5{color:rgba(255,255,255,.5);cursor:pointer;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.06);border-radius:50%;justify-content:center;align-items:center;width:32px;height:32px;transition:all .2s;display:flex}.close-btn.svelte-1o4jdf5:hover{color:#fff;background:rgba(255,255,255,.15);transform:translate(-4px)}.dj-crossfader.svelte-1o4jdf5{cursor:pointer;box-sizing:border-box;-webkit-user-select:none;user-select:none;background:linear-gradient(#1e1e24 0%,#121215 100%);border:1px solid rgba(255,255,255,.08);border-radius:8px;justify-content:space-between;align-items:center;gap:12px;width:100%;height:34px;padding:0 16px;display:flex;position:relative;box-shadow:inset 0 1px rgba(255,255,255,.05),0 8px 24px rgba(0,0,0,.5)}.fader-label.svelte-1o4jdf5{letter-spacing:.05em;color:rgba(255,255,255,.2);font-family:monospace;font-size:.65rem;font-weight:800;transition:color .2s}.fader-label.left-label.active.svelte-1o4jdf5{color:#a855f7;text-shadow:0 0 8px rgba(168,85,247,.4)}.fader-label.right-label.active.svelte-1o4jdf5{color:#06b6d4;text-shadow:0 0 8px rgba(6,182,212,.4)}.dj-fader-slot.svelte-1o4jdf5{background:#000;border:1px solid rgba(255,255,255,.06);border-radius:2px;flex:1;height:4px;position:relative}.dj-fader-knob.svelte-1o4jdf5{background:linear-gradient(135deg,#666 0%,#333 50%,#222 100%);border:1px solid rgba(255,255,255,.25);border-radius:3px;justify-content:center;align-items:center;width:24px;height:18px;transition:left .18s cubic-bezier(.25,.8,.25,1);display:flex;position:absolute;top:50%;left:0%;transform:translateY(-50%);box-shadow:0 4px 10px rgba(0,0,0,.8),inset 0 1px rgba(255,255,255,.15)}.dj-fader-knob.svelte-1o4jdf5:after{content:"";background:#fff;width:2px;height:100%;box-shadow:0 0 3px rgba(255,255,255,.8)}.dj-fader-knob.right.svelte-1o4jdf5{left:calc(100% - 24px)}.volume-popover.svelte-1o4jdf5{z-index:50;pointer-events:auto;-webkit-backdrop-filter:blur(8px);background:rgba(15,15,20,.95);border:1px solid rgba(255,255,255,.1);border-radius:20px;align-items:center;gap:8px;min-width:150px;padding:6px 12px;display:flex;position:absolute;bottom:38px;left:50%;transform:translate(-50%);box-shadow:0 10px 25px rgba(0,0,0,.6)}.vol-slider-pop.svelte-1o4jdf5{accent-color:#a855f7;cursor:pointer;background:rgba(255,255,255,.1);border-radius:2px;outline:none;flex:1;height:3px}.visualizer-container.svelte-1o4jdf5{background:#050508;border:1px solid rgba(255,255,255,.08);border-radius:50%;flex-direction:column;width:100%;height:100%;transition:border-radius .3s cubic-bezier(.25,.8,.25,1);display:flex;position:relative;overflow:hidden}.visualizer-canvas.svelte-1o4jdf5{z-index:1;width:100%;height:100%;display:block;position:absolute;top:0;bottom:0;left:0;right:0}.visualizer-overlay.svelte-1o4jdf5{z-index:10;justify-content:space-between;align-items:center;gap:8px;display:flex;position:absolute;bottom:16px;left:16px;right:16px}.visualizer-container.fullscreen.svelte-1o4jdf5{z-index:2000;border:none;width:100vw;height:100vh;position:fixed;top:0;bottom:0;left:0;right:0;border-radius:0!important}.visualizer-hover-overlay.svelte-1o4jdf5{opacity:0;background:rgba(0,0,0,.5);border-radius:50%;justify-content:center;align-items:center;transition:opacity .22s;display:flex;position:absolute;top:0;bottom:0;left:0;right:0}.visualizer-container.svelte-1o4jdf5:hover .visualizer-hover-overlay:where(.svelte-1o4jdf5){opacity:1}@-webkit-keyframes svelte-1o4jdf5-knob-wiggle{0%,to{transform:translateY(-50%)scale(1)}20%,60%{transform:translate(-3.5px,-50%)rotate(-4deg)}40%,80%{transform:translate(3.5px,-50%)rotate(4deg)}}@keyframes svelte-1o4jdf5-knob-wiggle{0%,to{transform:translateY(-50%)scale(1)}20%,60%{transform:translate(-3.5px,-50%)rotate(-4deg)}40%,80%{transform:translate(3.5px,-50%)rotate(4deg)}}.knob-jiggle.svelte-1o4jdf5{-webkit-animation:.3s ease-in-out svelte-1o4jdf5-knob-wiggle;animation:.3s ease-in-out svelte-1o4jdf5-knob-wiggle}.dj-fader-knob.fried.svelte-1o4jdf5{background:linear-gradient(135deg,#2c2222 0%,#1a1212 50%,#0f0505 100%)!important;border-color:rgba(239,68,68,.35)!important;box-shadow:0 4px 10px rgba(0,0,0,.9),0 0 8px rgba(239,68,68,.25)!important}.dj-fader-knob.fried.svelte-1o4jdf5:after{-webkit-animation:.15s infinite alternate svelte-1o4jdf5-fader-flicker;animation:.15s infinite alternate svelte-1o4jdf5-fader-flicker;background:#ef4444!important;box-shadow:0 0 5px #ef4444!important}@-webkit-keyframes svelte-1o4jdf5-fader-flicker{0%{opacity:.35}to{opacity:1}}@keyframes svelte-1o4jdf5-fader-flicker{0%{opacity:.35}to{opacity:1}}.dj-crossfader.fader-flash.svelte-1o4jdf5{-webkit-animation:.15s ease-out svelte-1o4jdf5-fader-flash-anim;animation:.15s ease-out svelte-1o4jdf5-fader-flash-anim}@-webkit-keyframes svelte-1o4jdf5-fader-flash-anim{0%{background:#f05;border-color:#fff;box-shadow:0 0 25px rgba(255,0,85,.8)}to{background:linear-gradient(#1e1e24 0%,#121215 100%);border-color:rgba(255,255,255,.08)}}@keyframes svelte-1o4jdf5-fader-flash-anim{0%{background:#f05;border-color:#fff;box-shadow:0 0 25px rgba(255,0,85,.8)}to{background:linear-gradient(#1e1e24 0%,#121215 100%);border-color:rgba(255,255,255,.08)}}.dj-crossfader.fader-fried.svelte-1o4jdf5{border-color:rgba(239,68,68,.25)!important;box-shadow:inset 0 0 8px rgba(239,68,68,.08),0 8px 24px rgba(0,0,0,.5)!important}.fader-fx-canvas.svelte-1o4jdf5{width:100vw;height:100vh;pointer-events:none;z-index:99999;height:100dvh;position:fixed;top:0;left:0}.cassette-tape.svelte-1o4jdf5{box-sizing:border-box;background:linear-gradient(135deg,#1f1f23 0%,#0d0d0f 100%);border:3px solid #2d2d34;border-radius:10px;flex-direction:column;justify-content:space-between;align-items:center;width:200px;height:125px;padding:10px;display:flex;position:relative;box-shadow:0 8px 24px rgba(0,0,0,.6)}@media (min-width:640px){.cassette-tape.svelte-1o4jdf5{border-width:4px;width:240px;height:150px;padding:12px}}.cassette-label.svelte-1o4jdf5{color:#fff;box-sizing:border-box;text-transform:uppercase;border-radius:4px;flex-direction:column;justify-content:center;align-items:center;width:100%;height:38px;padding:2px;font-family:monospace;font-weight:700;display:flex;box-shadow:inset 0 1px rgba(255,255,255,.1)}@media (min-width:640px){.cassette-label.svelte-1o4jdf5{height:46px}}.cassette-track-title.svelte-1o4jdf5{letter-spacing:.05em;white-space:nowrap;text-overflow:ellipsis;max-width:90%;font-size:9px;overflow:hidden}@media (min-width:640px){.cassette-track-title.svelte-1o4jdf5{font-size:11px}}.cassette-brand.svelte-1o4jdf5{opacity:.8;letter-spacing:.1em;margin-top:1px;font-size:7px}@media (min-width:640px){.cassette-brand.svelte-1o4jdf5{margin-top:2px;font-size:8px}}.cassette-window.svelte-1o4jdf5{border:2px solid #3f3f46;border-radius:5px;justify-content:space-around;align-items:center;width:110px;height:40px;margin-top:6px;display:flex;position:relative;overflow:hidden}@media (min-width:640px){.cassette-window.svelte-1o4jdf5{width:130px;height:48px;margin-top:8px}}.spindle-left.svelte-1o4jdf5,.spindle-right.svelte-1o4jdf5{box-sizing:border-box;z-index:5;border:3px dashed #71717a;border-radius:50%;width:18px;height:18px}@media (min-width:640px){.spindle-left.svelte-1o4jdf5,.spindle-right.svelte-1o4jdf5{border-width:4px;width:22px;height:22px}}.spindle-left.spinning.svelte-1o4jdf5,.spindle-right.spinning.svelte-1o4jdf5{-webkit-animation:4s linear infinite svelte-1o4jdf5-rotate-spindle;animation:4s linear infinite svelte-1o4jdf5-rotate-spindle}.tape-roll-left.svelte-1o4jdf5,.tape-roll-right.svelte-1o4jdf5{z-index:1;opacity:.85;border-radius:50%;position:absolute;top:50%;transform:translateY(-50%)}.tape-roll-left.spinning.svelte-1o4jdf5,.tape-roll-right.spinning.svelte-1o4jdf5{-webkit-animation:6s linear infinite svelte-1o4jdf5-rotate-spindle;animation:6s linear infinite svelte-1o4jdf5-rotate-spindle}.tape-roll-left.svelte-1o4jdf5{left:12px;transform:translateY(-50%)}@media (min-width:640px){.tape-roll-left.svelte-1o4jdf5{left:16px}}.tape-roll-right.svelte-1o4jdf5{right:12px;transform:translateY(-50%)}@media (min-width:640px){.tape-roll-right.svelte-1o4jdf5{right:16px}}@-webkit-keyframes svelte-1o4jdf5-rotate-spindle{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes svelte-1o4jdf5-rotate-spindle{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.waveform-slider-wrap.svelte-1o4jdf5{background:rgba(0,0,0,.45);border:1px solid rgba(255,255,255,.1);border-radius:6px;height:36px;transition:border-color .2s,background .2s}.waveform-slider-wrap.svelte-1o4jdf5 .seek-input:where(.svelte-1o4jdf5){margin:0;height:100%!important;top:0!important;bottom:0!important;left:0!important;right:0!important}.waveform-slider-wrap.svelte-1o4jdf5:hover{background:rgba(0,0,0,.55);border-color:rgba(255,255,255,.2)}.waveform-slider-wrap.svelte-1o4jdf5:hover .waveform-bar:where(.svelte-1o4jdf5):not(.active){background-color:rgba(255,255,255,.22)}.waveform-slider-wrap.svelte-1o4jdf5:hover .waveform-bar.active:where(.svelte-1o4jdf5){box-shadow:0 0 8px rgba(0,240,255,.6)}.waveform-bar.svelte-1o4jdf5{background-color:rgba(255,255,255,.12);border-radius:9999px;transition:background-color .2s,background .2s,box-shadow .2s}.waveform-bar.active.svelte-1o4jdf5{background:linear-gradient(#ff007f 0%,#00f0ff 100%);box-shadow:0 0 4px rgba(0,240,255,.4)}.floppy-disk.svelte-1o4jdf5{box-sizing:border-box;-webkit-clip-path:polygon(0 0,88% 0,100% 12%,100% 100%,0 100%);clip-path:polygon(0 0,88% 0,100% 12%,100% 100%,0 100%);background:linear-gradient(135deg,#1e293b 0%,#0f172a 100%);border:3px solid #334155;border-radius:8px;flex-direction:column;justify-content:space-between;width:160px;height:160px;padding:8px;display:flex;position:relative;box-shadow:0 8px 24px rgba(0,0,0,.65)}@media (min-width:640px){.floppy-disk.svelte-1o4jdf5{border-width:4px;width:190px;height:190px;padding:10px}}.floppy-corner.svelte-1o4jdf5{z-index:10;background:0 0;width:20px;height:20px;position:absolute;top:0;right:0}.floppy-write-protect.svelte-1o4jdf5{background:#020617;border:1px solid #334155;border-radius:1px;width:10px;height:10px;position:absolute;bottom:8px;left:8px}@media (min-width:640px){.floppy-write-protect.svelte-1o4jdf5{width:12px;height:12px;bottom:10px;left:10px}}.floppy-label.svelte-1o4jdf5{border-radius:4px;flex-direction:column;width:100%;height:65px;display:flex;position:relative;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,.3)}@media (min-width:640px){.floppy-label.svelte-1o4jdf5{height:80px}}.floppy-label-stripe.svelte-1o4jdf5{width:100%;height:6px}.floppy-label-stripe-blue.svelte-1o4jdf5{width:100%;height:3px}.floppy-label-content.svelte-1o4jdf5{background:#f8fafc;flex-direction:column;flex-grow:1;justify-content:center;align-items:center;padding:4px;display:flex}.floppy-song.svelte-1o4jdf5{color:#0f172a;text-align:center;text-transform:uppercase;width:90%;font-size:8px;font-weight:800}@media (min-width:640px){.floppy-song.svelte-1o4jdf5{font-size:10px}}.floppy-artist.svelte-1o4jdf5{color:#475569;text-align:center;text-transform:uppercase;width:90%;margin-top:1px;font-size:7px}@media (min-width:640px){.floppy-artist.svelte-1o4jdf5{margin-top:2px;font-size:8px}}.floppy-shutter-door.svelte-1o4jdf5{border:1px solid #1e293b;border-radius:3px;width:60px;height:40px;position:absolute;bottom:8px;left:50%;overflow:hidden;transform:translate(-50%)}@media (min-width:640px){.floppy-shutter-door.svelte-1o4jdf5{width:72px;height:48px;bottom:10px}}.floppy-shutter-slider.svelte-1o4jdf5{z-index:3;background:linear-gradient(90deg,#64748b 0%,#cbd5e1 50%,#64748b 100%);width:100%;height:100%;transition:transform .4s cubic-bezier(.16,1,.3,1);position:absolute;top:0;left:0}.floppy-shutter-slider.open.svelte-1o4jdf5{transform:translate(32px)}@media (min-width:640px){.floppy-shutter-slider.open.svelte-1o4jdf5{transform:translate(38px)}}.floppy-shutter-opening.svelte-1o4jdf5{z-index:1;border-radius:2px;justify-content:center;align-items:center;width:24px;height:32px;display:flex;position:absolute;top:4px;left:8px;overflow:hidden}@media (min-width:640px){.floppy-shutter-opening.svelte-1o4jdf5{width:28px;height:38px;top:5px;left:10px}}.floppy-magnetic-disc.svelte-1o4jdf5{border:2px dashed #475569;border-radius:50%;width:20px;height:20px}.floppy-magnetic-disc.spinning.svelte-1o4jdf5{-webkit-animation:2s linear infinite svelte-1o4jdf5-floppy-spin;animation:2s linear infinite svelte-1o4jdf5-floppy-spin}@media (min-width:640px){.floppy-magnetic-disc.svelte-1o4jdf5{width:24px;height:24px}}.floppy-drive-led.svelte-1o4jdf5{background:#dc2626;border-radius:50%;width:6px;height:6px;position:absolute;bottom:8px;right:8px;box-shadow:0 0 3px #dc2626}.floppy-drive-led.active.svelte-1o4jdf5{-webkit-animation:.4s ease-in-out infinite alternate svelte-1o4jdf5-floppy-led-blink;animation:.4s ease-in-out infinite alternate svelte-1o4jdf5-floppy-led-blink}@media (min-width:640px){.floppy-drive-led.svelte-1o4jdf5{width:7px;height:7px;bottom:10px;right:10px}}.music-box.svelte-1o4jdf5{box-sizing:border-box;background:linear-gradient(135deg,#78350f 0%,#451a03 100%);border:3px solid #d97706;border-radius:10px;justify-content:center;align-items:center;width:160px;height:110px;padding:6px;display:flex;position:relative;box-shadow:0 8px 24px rgba(0,0,0,.7)}@media (min-width:640px){.music-box.svelte-1o4jdf5{border-width:4px;width:190px;height:130px;padding:8px}}.music-box-key.svelte-1o4jdf5{z-index:-1;transform-origin:100%;align-items:center;width:15px;height:26px;display:flex;position:absolute;top:calc(50% - 13px);left:-18px}.music-box-key.svelte-1o4jdf5:before{content:"";border:2px .5 solid #f59e0b;background:0 0;border-radius:50%;width:12px;height:12px;position:absolute;left:-6px;box-shadow:0 0 4px rgba(245,158,11,.4)}.music-box-key.svelte-1o4jdf5:after{content:"";background:#b45309;width:12px;height:3px;position:absolute;right:0}.music-box-key.spinning.svelte-1o4jdf5{-webkit-animation:3s linear infinite svelte-1o4jdf5-key-spin;animation:3s linear infinite svelte-1o4jdf5-key-spin}@media (min-width:640px){.music-box-key.svelte-1o4jdf5{width:18px;height:30px;top:calc(50% - 15px);left:-22px}.music-box-key.svelte-1o4jdf5:before{border-width:3px;width:14px;height:14px;left:-8px}.music-box-key.svelte-1o4jdf5:after{width:14px;height:4px}}.music-box-interior.svelte-1o4jdf5{box-sizing:border-box;background:rgba(0,0,0,.55);border-radius:6px;flex-direction:column;justify-content:space-between;width:100%;height:100%;padding:6px;display:flex;position:relative;overflow:hidden}.music-box-gears.svelte-1o4jdf5{width:40px;height:40px;position:absolute;top:6px;left:6px}.music-box-gear.svelte-1o4jdf5{background:0 0;border:2px dashed #d97706;border-radius:50%;position:absolute}.music-box-gear.gear-1.svelte-1o4jdf5{width:22px;height:22px;top:2px;left:2px}.music-box-gear.gear-1.spinning.svelte-1o4jdf5{-webkit-animation:5s linear infinite svelte-1o4jdf5-gear-rotate;animation:5s linear infinite svelte-1o4jdf5-gear-rotate}.music-box-gear.gear-2.svelte-1o4jdf5{width:14px;height:14px;top:16px;left:18px}.music-box-gear.gear-2.spinning.svelte-1o4jdf5{-webkit-animation:4.2s linear infinite svelte-1o4jdf5-gear-rotate-reverse;animation:4.2s linear infinite svelte-1o4jdf5-gear-rotate-reverse}@media (min-width:640px){.music-box-gear.gear-1.svelte-1o4jdf5{width:26px;height:26px}.music-box-gear.gear-2.svelte-1o4jdf5{width:18px;height:18px;top:18px;left:22px}}.music-box-drum-wrap.svelte-1o4jdf5{align-items:center;width:70px;height:32px;display:flex;position:absolute;top:50%;right:14px;transform:translateY(-50%)}@media (min-width:640px){.music-box-drum-wrap.svelte-1o4jdf5{width:90px;height:38px;right:18px}}.music-box-drum.svelte-1o4jdf5{background:linear-gradient(#d97706 0%,#b45309 50%,#78350f 100%);border:1px solid #d97706;border-radius:6px;width:100%;height:12px;position:relative;overflow:hidden}.music-box-drum.svelte-1o4jdf5:after{content:"";background:repeating-linear-gradient(90deg,transparent,transparent 12px,#fef08a 14px,#f59e0b 15px,transparent 17px);width:200%;height:100%;position:absolute;top:0;left:-100%}@media (min-width:640px){.music-box-drum.svelte-1o4jdf5:after{background:repeating-linear-gradient(90deg,transparent,transparent 15px,#fef08a 17px,#f59e0b 18px,transparent 20px)}}.music-box-drum.spinning.svelte-1o4jdf5:after{-webkit-animation:2.2s linear infinite svelte-1o4jdf5-drum-roll;animation:2.2s linear infinite svelte-1o4jdf5-drum-roll}@media (min-width:640px){.music-box-drum.svelte-1o4jdf5{border-radius:8px;height:16px}}.music-box-comb.svelte-1o4jdf5{gap:2.5px;display:flex;position:absolute;bottom:6px;right:18px}@media (min-width:640px){.music-box-comb.svelte-1o4jdf5{gap:3.5px;bottom:8px;right:22px}}.comb-tooth.svelte-1o4jdf5{transform-origin:top;background:linear-gradient(#cbd5e1 0%,#475569 100%);border-radius:.5px;width:3px;height:18px}.comb-tooth.vibrating.svelte-1o4jdf5{-webkit-animation:.12s ease-in-out infinite alternate svelte-1o4jdf5-tooth-vibrate;animation:.12s ease-in-out infinite alternate svelte-1o4jdf5-tooth-vibrate}@media (min-width:640px){.comb-tooth.svelte-1o4jdf5{border-radius:1px;width:4px;height:24px}}@-webkit-keyframes svelte-1o4jdf5-floppy-spin{to{transform:rotate(360deg)}}@keyframes svelte-1o4jdf5-floppy-spin{to{transform:rotate(360deg)}}@-webkit-keyframes svelte-1o4jdf5-floppy-led-blink{0%{background:#22c55e;box-shadow:0 0 5px #22c55e}to{background:#166534;box-shadow:0 0 1px #166534}}@keyframes svelte-1o4jdf5-floppy-led-blink{0%{background:#22c55e;box-shadow:0 0 5px #22c55e}to{background:#166534;box-shadow:0 0 1px #166534}}@-webkit-keyframes svelte-1o4jdf5-key-spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes svelte-1o4jdf5-key-spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@-webkit-keyframes svelte-1o4jdf5-gear-rotate{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes svelte-1o4jdf5-gear-rotate{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@-webkit-keyframes svelte-1o4jdf5-gear-rotate-reverse{0%{transform:rotate(360deg)}to{transform:rotate(0)}}@keyframes svelte-1o4jdf5-gear-rotate-reverse{0%{transform:rotate(360deg)}to{transform:rotate(0)}}@-webkit-keyframes svelte-1o4jdf5-drum-roll{0%{transform:translate(0)}to{transform:translate(50%)}}@keyframes svelte-1o4jdf5-drum-roll{0%{transform:translate(0)}to{transform:translate(50%)}}@-webkit-keyframes svelte-1o4jdf5-tooth-vibrate{0%{transform:scaleY(1)}to{transform:scaleY(.85)skew(2deg)}}@keyframes svelte-1o4jdf5-tooth-vibrate{0%{transform:scaleY(1)}to{transform:scaleY(.85)skew(2deg)}}.arigato-modal-backdrop.svelte-1o4jdf5{z-index:2000;-webkit-backdrop-filter:blur(8px);background:rgba(0,0,0,.75);justify-content:center;align-items:center;width:100vw;height:100vh;display:flex;position:fixed;top:0;left:0}.arigato-modal-content.svelte-1o4jdf5{color:#e4e4e7;background:linear-gradient(135deg,#121214 0%,#0a0a0c 100%);border:1px solid rgba(239,68,68,.2);border-radius:16px;flex-direction:column;width:90vw;max-width:600px;height:80vh;font-family:monospace;display:flex;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,.8),inset 0 1px rgba(255,255,255,.05)}@media (max-width:640px){.arigato-modal-content.svelte-1o4jdf5{width:95vw;height:85vh}}.arigato-modal-header.svelte-1o4jdf5{background:rgba(255,255,255,.02);border-bottom:1px solid rgba(255,255,255,.08);justify-content:space-between;align-items:center;padding:16px 24px;display:flex}.arigato-modal-header.svelte-1o4jdf5 h2:where(.svelte-1o4jdf5){letter-spacing:.1em;color:#ef4444;text-transform:uppercase;margin:0;font-size:1rem;font-weight:700}.arigato-close-btn.svelte-1o4jdf5{color:rgba(255,255,255,.6);cursor:pointer;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:50%;justify-content:center;align-items:center;width:32px;height:32px;transition:all .2s;display:flex}.arigato-close-btn.svelte-1o4jdf5:hover{color:#fff;background:rgba(239,68,68,.2);border-color:rgba(239,68,68,.4);transform:translate(-2px)}.arigato-modal-body.svelte-1o4jdf5{color:#a1a1aa;flex:1;padding:24px;font-size:.85rem;line-height:1.5;overflow-y:auto}.arigato-modal-body.svelte-1o4jdf5 .intro-text:where(.svelte-1o4jdf5){white-space:pre-wrap;margin-bottom:16px}.arigato-modal-body.svelte-1o4jdf5 .outro-text:where(.svelte-1o4jdf5){white-space:pre-wrap;margin-bottom:16px}.arigato-modal-body.svelte-1o4jdf5 .intro-text:where(.svelte-1o4jdf5) a{color:#ef4444;text-decoration:underline}.arigato-modal-body.svelte-1o4jdf5 .outro-text:where(.svelte-1o4jdf5) a{color:#ef4444;text-decoration:underline}.arigato-modal-body.svelte-1o4jdf5 .intro-text:where(.svelte-1o4jdf5) a:hover{color:#fff}.arigato-modal-body.svelte-1o4jdf5 .outro-text:where(.svelte-1o4jdf5) a:hover{color:#fff}.arigato-modal-body.svelte-1o4jdf5 .tos-box:where(.svelte-1o4jdf5){background:rgba(0,0,0,.4);border:1px dashed rgba(255,255,255,.1);border-radius:8px;max-height:300px;margin:16px 0;padding:12px;overflow-y:auto}.arigato-modal-body.svelte-1o4jdf5 .tos-microtext:where(.svelte-1o4jdf5){letter-spacing:0;color:#71717a;word-break:break-all;white-space:pre-wrap;text-transform:none;font-family:monospace;font-size:5px;line-height:1.2}.arigato-modal-body.svelte-1o4jdf5 .tos-microtext:where(.svelte-1o4jdf5) a{color:#ef4444;text-decoration:underline}.arigato-modal-body.svelte-1o4jdf5 .tos-microtext:where(.svelte-1o4jdf5) a:hover{color:#fff}.merch-link-container.svelte-1o4jdf5{justify-content:center;margin-bottom:20px;display:flex}.merch-link-btn.svelte-1o4jdf5{color:#fff;text-transform:uppercase;letter-spacing:.08em;background:linear-gradient(135deg,#ef4444 0%,#b91c1c 100%);border-radius:9999px;align-items:center;gap:8px;padding:8px 18px;font-size:.7rem;font-weight:850;text-decoration:none;transition:all .2s;display:inline-flex;box-shadow:0 4px 12px rgba(239,68,68,.3)}.merch-link-btn.svelte-1o4jdf5:hover{color:#fff;background:linear-gradient(135deg,#ff6b6b 0%,#ef4444 100%);transform:translateY(-2px);box-shadow:0 6px 16px rgba(239,68,68,.4)}.merch-link-btn.svelte-1o4jdf5:active{transform:translateY(0)}
/*$vite$:1*/`,document.head.appendChild(V),Ue=function(){function e(n,r){t(this,e),D(this,`canvas`,null),D(this,`gl`,null),D(this,`analyser`,null),D(this,`program`,null),D(this,`animationFrameId`,null),D(this,`startTime`,0),D(this,`vertexBuffer`,null),D(this,`audioTexture`,null),D(this,`uniforms`,{}),D(this,`frequencyBuffer`,null),this.canvas=n,this.analyser=r,this.frequencyBuffer=new Uint8Array(r?r.frequencyBinCount:128),this.gl=n.getContext(`webgl`)||n.getContext(`experimental-webgl`),this.gl||console.error(`WebGL not supported by this browser.`)}return r(e,[{key:`init`,value:function(e){if(this.gl){var t=this.gl;this.cleanupProgram();var n=this.compileShader(t.VERTEX_SHADER,`
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `),r=this.compileShader(t.FRAGMENT_SHADER,e);if(n&&r){if(this.program=t.createProgram(),t.attachShader(this.program,n),t.attachShader(this.program,r),t.linkProgram(this.program),!t.getProgramParameter(this.program,t.LINK_STATUS))console.error(`Shader program linking failed:`,t.getProgramInfoLog(this.program));else{t.useProgram(this.program);var i=new Float32Array([-1,-1,1,-1,-1,1,1,1]);this.vertexBuffer=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,this.vertexBuffer),t.bufferData(t.ARRAY_BUFFER,i,t.STATIC_DRAW);var a=t.getAttribLocation(this.program,`a_position`);t.enableVertexAttribArray(a),t.vertexAttribPointer(a,2,t.FLOAT,!1,0,0),this.audioTexture=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.audioTexture),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),this.uniforms={time:t.getUniformLocation(this.program,`u_time`),resolution:t.getUniformLocation(this.program,`u_resolution`),volume:t.getUniformLocation(this.program,`u_volume`),bass:t.getUniformLocation(this.program,`u_bass`),mid:t.getUniformLocation(this.program,`u_mid`),treble:t.getUniformLocation(this.program,`u_treble`),audioTexture:t.getUniformLocation(this.program,`u_audioTexture`)},this.startTime=performance.now(),this.resize()}}}}},{key:`setPreset`,value:function(e){this.init(e)}},{key:`compileShader`,value:function(e,t){if(!this.gl)return null;var n=this.gl,r=n.createShader(e);return n.shaderSource(r,t),n.compileShader(r),n.getShaderParameter(r,n.COMPILE_STATUS)?r:(console.error(`Shader compilation error (${e===n.VERTEX_SHADER?`VERTEX`:`FRAGMENT`}):`,n.getShaderInfoLog(r)),n.deleteShader(r),null)}},{key:`start`,value:function(){var e=this;this.stop();var t=function(){e.renderFrame(),e.animationFrameId=requestAnimationFrame(t)};this.animationFrameId=requestAnimationFrame(t)}},{key:`stop`,value:function(){this.animationFrameId&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null)}},{key:`resize`,value:function(){if(this.gl&&this.canvas){var e=this.gl,t=this.canvas.clientWidth,n=this.canvas.clientHeight;(this.canvas.width!==t||this.canvas.height!==n)&&(this.canvas.width=t,this.canvas.height=n,e.viewport(0,0,t,n))}}},{key:`renderFrame`,value:function(){if(this.gl&&this.program){var e=this.gl;this.resize(),e.useProgram(this.program),e.bindBuffer(e.ARRAY_BUFFER,this.vertexBuffer);var t=(performance.now()-this.startTime)/1e3,n=0,r=0,i=0,a=0;if(this.analyser){this.analyser.getByteFrequencyData(this.frequencyBuffer);for(var o=this.frequencyBuffer.length,s=0,c=0,l=0,u=0;u<o;u++){var d=this.frequencyBuffer[u];n+=d,u<12?(r+=d,s++):u<64?(i+=d,c++):(a+=d,l++)}n=n/o/255,r=s>0?r/s/255:0,i=c>0?i/c/255:0,a=l>0?a/l/255:0,e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.audioTexture),e.texImage2D(e.TEXTURE_2D,0,e.LUMINANCE,o,1,0,e.LUMINANCE,e.UNSIGNED_BYTE,this.frequencyBuffer)}e.uniform1f(this.uniforms.time,t),e.uniform2f(this.uniforms.resolution,this.canvas.width,this.canvas.height),e.uniform1f(this.uniforms.volume,n),e.uniform1f(this.uniforms.bass,r),e.uniform1f(this.uniforms.mid,i),e.uniform1f(this.uniforms.treble,a),e.uniform1i(this.uniforms.audioTexture,0),e.drawArrays(e.TRIANGLE_STRIP,0,4)}}},{key:`cleanupProgram`,value:function(){this.gl&&this.program&&(this.gl.deleteProgram(this.program),this.program=null)}},{key:`destroy`,value:function(){this.stop();var e=this.gl;e&&(this.cleanupProgram(),this.vertexBuffer&&(e.deleteBuffer(this.vertexBuffer),this.vertexBuffer=null),this.audioTexture&&(e.deleteTexture(this.audioTexture),this.audioTexture=null)),this.canvas=null,this.gl=null,this.analyser=null}}])}(),We=[{id:`kaleidosync`,name:`Kaleidosync`,fragmentShader:`
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
`,qe=i(`<div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 animate-pulse svelte-1o4jdf5"><div class="bg-black/75 border border-red-500/30 px-3 py-1.5 rounded text-[10px] font-mono tracking-widest text-red-500 font-bold uppercase shadow-[0_0_15px_rgba(239,68,68,0.25)] select-none svelte-1o4jdf5">NO SIGNAL</div></div>`),Je=i(`<div class="visualizer-container cursor-pointer svelte-1o4jdf5"><canvas class="visualizer-canvas svelte-1o4jdf5"></canvas> <!> <div class="visualizer-hover-overlay svelte-1o4jdf5"><!></div></div>`),Ye=i(`<div class="visualizer-container bg-[#050508]/40 border border-white/5 flex items-center justify-center svelte-1o4jdf5"><!></div>`),Xe=i(`<div class="vinyl-record-clicker cursor-pointer w-full h-full svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div><div class="groove g1 svelte-1o4jdf5"></div> <div class="groove g2 svelte-1o4jdf5"></div> <div class="groove g3 svelte-1o4jdf5"></div> <div class="groove g4 svelte-1o4jdf5"></div> <div class="record-label svelte-1o4jdf5"><img loading="lazy"/></div> <div class="spindle svelte-1o4jdf5"></div></div> <div></div></div>`),Ze=i(`<div class="cassette-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="cassette-tape svelte-1o4jdf5"><div class="cassette-label bg-gradient-to-r from-purple-800 to-pink-700 svelte-1o4jdf5"><span class="cassette-track-title svelte-1o4jdf5"> </span> <span class="cassette-brand svelte-1o4jdf5">WEAREDOGS AUDIO</span></div> <div class="cassette-window bg-zinc-950/80 svelte-1o4jdf5"><div></div> <div></div> <div></div> <div></div></div></div></div>`),Qe=i(`<div class="floppy-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="floppy-disk svelte-1o4jdf5"><div class="floppy-corner svelte-1o4jdf5"></div> <div class="floppy-write-protect svelte-1o4jdf5"></div> <div class="floppy-label bg-slate-100 text-slate-900 svelte-1o4jdf5"><div class="floppy-label-stripe bg-red-600 svelte-1o4jdf5"></div> <div class="floppy-label-stripe-blue bg-blue-600 svelte-1o4jdf5"></div> <div class="floppy-label-content svelte-1o4jdf5"><div class="floppy-song truncate font-mono svelte-1o4jdf5"> </div> <div class="floppy-artist truncate font-mono svelte-1o4jdf5"> </div></div></div> <div class="floppy-shutter-door bg-zinc-700 svelte-1o4jdf5"><div></div> <div class="floppy-shutter-opening bg-zinc-950 svelte-1o4jdf5"><div></div></div></div> <div></div></div></div>`),$e=i(`<div></div>`),et=i(`<div class="musicbox-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="music-box svelte-1o4jdf5"><div></div> <div class="music-box-interior border border-amber-900/40 svelte-1o4jdf5"><div class="music-box-gears svelte-1o4jdf5"><div></div> <div></div></div> <div class="music-box-drum-wrap svelte-1o4jdf5"><div><div class="music-box-pins svelte-1o4jdf5"><div class="pin pin-1 svelte-1o4jdf5"></div> <div class="pin pin-2 svelte-1o4jdf5"></div> <div class="pin pin-3 svelte-1o4jdf5"></div> <div class="pin pin-4 svelte-1o4jdf5"></div> <div class="pin pin-5 svelte-1o4jdf5"></div> <div class="pin pin-6 svelte-1o4jdf5"></div></div></div></div> <div class="music-box-comb svelte-1o4jdf5"></div></div></div></div>`),tt=i(`<button aria-label="Download track"><!></button>`),nt=i(`<span></span>`),rt=i(`<div class="spin-ring svelte-1o4jdf5"></div>`),it=i(`<div class="volume-popover svelte-1o4jdf5"><button class="ctrl ctrl-xs mr-2 border border-white/10 rounded-full p-1 hover:bg-white/10 svelte-1o4jdf5" aria-label="Mute"><!></button> <input type="range" class="vol-slider-pop svelte-1o4jdf5" min="0" max="1" step="0.01" aria-label="Volume"/> <span class="text-[10px] font-bold text-white/60 min-w-[28px] text-right font-mono select-none svelte-1o4jdf5"> </span></div>`),at=i(`<div class="eq svelte-1o4jdf5"><div class="eq-b svelte-1o4jdf5"></div> <div class="eq-b svelte-1o4jdf5"></div> <div class="eq-b svelte-1o4jdf5"></div></div>`),ot=i(`<span class="svelte-1o4jdf5"></span>`),st=i(`<span class="text-amber-400 flex items-center gap-1 text-[9px] font-bold tracking-wider uppercase bg-amber-500/10 px-1.5 py-0.5 rounded flex-shrink-0 svelte-1o4jdf5" title="Failed to fetch music source from remote database"><!> Error Fetching</span>`),ct=i(`<button class="cursor-pointer svelte-1o4jdf5" style="background: none; border: none; padding: 0; color: inherit; font: inherit;">i</button>`),lt=i(`<a target="_blank" class="svelte-1o4jdf5">i</a>`),ut=i(`<span class="inst-chip-link svelte-1o4jdf5"><!></span>`),dt=i(`<div><div class="tr-num svelte-1o4jdf5"><!></div> <img loading="lazy" class="tr-art svelte-1o4jdf5"/> <div class="tr-info svelte-1o4jdf5"><div class="flex items-center gap-1.5 min-w-0 svelte-1o4jdf5"><span> </span> <!></div> <span class="tr-meta svelte-1o4jdf5"> </span></div> <div class="flex items-center gap-2 flex-shrink-0 svelte-1o4jdf5"><!>  <button class="tr-share-btn svelte-1o4jdf5" title="Copy track link" aria-label="Share track"><!></button> <!></div></div>`),ft=i(`<div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 animate-pulse svelte-1o4jdf5"><div class="bg-black/75 border border-red-500/30 px-4 py-2 rounded text-[12px] font-mono tracking-widest text-red-500 font-bold uppercase shadow-[0_0_20px_rgba(239,68,68,0.3)] select-none svelte-1o4jdf5">NO SIGNAL</div></div>`),pt=i(`<button> </button>`),mt=i(`<div class="visualizer-container fullscreen cursor-pointer svelte-1o4jdf5"><canvas class="visualizer-canvas svelte-1o4jdf5"></canvas> <!> <div class="visualizer-overlay svelte-1o4jdf5"><div class="flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-lg p-1 border border-white/10 svelte-1o4jdf5"></div></div></div>`),ht=i(`<div class="arigato-modal-backdrop svelte-1o4jdf5"><div class="arigato-modal-content svelte-1o4jdf5"><header class="arigato-modal-header svelte-1o4jdf5"><h2 class="svelte-1o4jdf5">ARIGATO INFO</h2> <button class="arigato-close-btn svelte-1o4jdf5"><!></button></header> <div class="arigato-modal-body scroll-y svelte-1o4jdf5"><div class="merch-link-container svelte-1o4jdf5"><a href="https://nxnjaa.beatstars.com/" target="_blank" rel="noopener noreferrer" class="merch-link-btn svelte-1o4jdf5"><!> NXNJA MERCH & MUSIC</a></div> <p class="intro-text svelte-1o4jdf5"></p> <div class="tos-box svelte-1o4jdf5"><div class="tos-microtext svelte-1o4jdf5"></div></div> <p class="outro-text svelte-1o4jdf5"></p></div></div></div>`),gt=i(`<div class="mp-backdrop svelte-1o4jdf5"><div><header class="panel-header svelte-1o4jdf5"><div class="brand svelte-1o4jdf5"><button class="logo-btn svelte-1o4jdf5" aria-label="Go to the DOGS home page"><!></button> <h1 class="svelte-1o4jdf5"></h1></div> <button class="close-btn svelte-1o4jdf5" aria-label="Close panel"><!></button></header> <div class="mp-body svelte-1o4jdf5"><div class="songs-layout svelte-1o4jdf5"><div><div><div><!></div>  <div class="track-info mt-2 svelte-1o4jdf5"><div class="flex items-center justify-center gap-1.5 mb-1.5 svelte-1o4jdf5"><button class="player-share-btn svelte-1o4jdf5" title="Copy track link" aria-label="Share track"><!></button> <!></div> <div><h2> </h2></div> <div><p> </p></div> <div><p> </p></div></div></div> <div class="player-controls-block svelte-1o4jdf5"><div class="progress-row svelte-1o4jdf5"><span class="ptime svelte-1o4jdf5"> </span> <div class="progress-wrap waveform-slider-wrap relative h-9 flex items-end svelte-1o4jdf5"><div class="waveform-bars flex items-end justify-between absolute inset-0 pointer-events-none px-1 h-full svelte-1o4jdf5"></div> <input type="range" class="seek-input absolute inset-0 opacity-0 cursor-pointer w-full h-full svelte-1o4jdf5" min="0" step="0.1" aria-label="Seek"/></div> <span class="ptime svelte-1o4jdf5"> </span></div> <div class="controls-row svelte-1o4jdf5"><button aria-label="Shuffle"><!></button> <button class="ctrl ctrl-md svelte-1o4jdf5" aria-label="Previous"><!></button> <button><!></button> <button class="ctrl ctrl-md svelte-1o4jdf5" aria-label="Next"><!></button> <button aria-label="Repeat"><!></button></div> <div class="w-full flex flex-col items-center gap-1.5 mt-2 px-1 svelte-1o4jdf5"><div><span><!> <span class="svelte-1o4jdf5">VOCAL</span></span> <div class="dj-fader-slot relative svelte-1o4jdf5"><div></div></div> <span><!> <span class="svelte-1o4jdf5">INST</span></span></div></div> <div class="relative flex justify-center items-center gap-3 mt-2 w-full svelte-1o4jdf5"><!> <div class="flex items-center gap-1.5 svelte-1o4jdf5"><button aria-label="Toggle Visualizer"><!></button> <button> </button></div> <div class="relative svelte-1o4jdf5"><button class="ctrl ctrl-xs vol-toggle-btn svelte-1o4jdf5" aria-label="Toggle volume slider"><!></button></div></div></div></div> <div><div class="mobile-close-bar hidden py-2 px-4 border-b border-white/5 flex items-center justify-between svelte-1o4jdf5"><span class="text-xs font-bold text-white/50 svelte-1o4jdf5">Track Library</span> <button class="px-3 py-1 bg-white/5 text-white/75 rounded-lg text-xs font-bold svelte-1o4jdf5">Back to player</button></div> <div class="tl-header flex justify-between items-center gap-3 svelte-1o4jdf5"><div class="flex items-center gap-2 svelte-1o4jdf5"><!><span class="svelte-1o4jdf5">TRACKS</span> <span class="tl-count svelte-1o4jdf5"> </span></div> <div class="flex items-center gap-1.5 ml-auto svelte-1o4jdf5"><span class="text-[9px] text-white/30 font-bold font-sans svelte-1o4jdf5">SORT BY:</span> <select class="bg-black/40 border border-white/10 rounded px-1.5 py-0.5 text-[10px] font-bold text-white/60 outline-none cursor-pointer hover:border-white/20 transition-all font-sans svelte-1o4jdf5"><option class="svelte-1o4jdf5">DEFAULT</option><option class="svelte-1o4jdf5">ARTIST</option><option class="svelte-1o4jdf5">ALBUM</option><option class="svelte-1o4jdf5">YEAR</option><option class="svelte-1o4jdf5">FILENAME</option><option class="svelte-1o4jdf5">GENRE</option><option class="svelte-1o4jdf5">SEASON</option></select></div></div> <div class="tracklist scroll-y svelte-1o4jdf5"></div></div></div></div> <footer class="mp-footer svelte-1o4jdf5"><div class="mp-status svelte-1o4jdf5"><span class="mp-dot svelte-1o4jdf5"></span><span class="svelte-1o4jdf5">🐕</span></div> <span class="svelte-1o4jdf5">MUSIC</span></footer></div> <!> <canvas class="fader-fx-canvas pointer-events-none svelte-1o4jdf5"></canvas> <!></div>`),N([`click`,`input`,`change`])}}})})();