(function(){function e(t){"@babel/helpers - typeof";return e=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},e(t)}function t(e,t){return i(e)||r(e,t)||g(e,t)||n()}function n(){throw TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function r(e,t){var n=e==null?null:typeof Symbol<`u`&&e[Symbol.iterator]||e[`@@iterator`];if(n!=null){var r,i,a,o,s=[],c=!0,l=!1;try{if(a=(n=n.call(e)).next,t===0){if(Object(n)!==n)return;c=!1}else for(;!(c=(r=a.call(n)).done)&&(s.push(r.value),s.length!==t);c=!0);}catch(e){l=!0,i=e}finally{try{if(!c&&n.return!=null&&(o=n.return(),Object(o)!==o))return}finally{if(l)throw i}}return s}}function i(e){if(Array.isArray(e))return e}function a(e,t){if(!(e instanceof t))throw TypeError(`Cannot call a class as a function`)}function o(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,`value`in r&&(r.writable=!0),Object.defineProperty(e,c(r.key),r)}}function s(e,t,n){return t&&o(e.prototype,t),n&&o(e,n),Object.defineProperty(e,"prototype",{writable:!1}),e}function c(t){var n=l(t,`string`);return e(n)==`symbol`?n:n+``}function l(t,n){if(e(t)!=`object`||!t)return t;var r;if(typeof Symbol<`u`&&(r=t[Symbol.toPrimitive])!==void 0){var i=r.call(t,n||`default`);if(e(i)!=`object`)return i;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(n===`string`?String:Number)(t)}function u(){var e,t,n=typeof Symbol==`function`?Symbol:{},r=n.iterator||`@@iterator`,i=n.toStringTag||`@@toStringTag`;function a(n,r,i,a){var c=r&&r.prototype instanceof s?r:s,l=Object.create(c.prototype);return d(l,`_invoke`,function(n,r,i){var a,s,c,l=0,u=i||[],d=!1,f={p:0,n:0,v:e,a:p,f:p.bind(e,4),d:function(t,n){return a=t,s=0,c=e,f.n=n,o}};function p(n,r){for(s=n,c=r,t=0;!d&&l&&!i&&t<u.length;t++){var i,a=u[t],p=f.p,m=a[2];n>3?(i=m===r)&&(c=a[(s=a[4])?5:(s=3,3)],a[4]=a[5]=e):a[0]<=p&&((i=n<2&&p<a[1])?(s=0,f.v=r,f.n=a[1]):p<m&&(i=n<3||a[0]>r||r>m)&&(a[4]=n,a[5]=r,f.n=m,s=0))}if(i||n>1)return o;throw d=!0,r}return function(i,u,m){if(l>1)throw TypeError(`Generator is already running`);for(d&&u===1&&p(u,m),s=u,c=m;(t=s<2?e:c)||!d;){a||(s?s<3?(s>1&&(f.n=-1),p(s,c)):f.n=c:f.v=c);try{if(l=2,a){if(s||(i=`next`),t=a[i]){if(!(t=t.call(a,c)))throw TypeError(`iterator result is not an object`);if(!t.done)return t;c=t.value,s<2&&(s=0)}else s===1&&(t=a.return)&&t.call(a),s<2&&(c=TypeError(`The iterator does not provide a '`+i+`' method`),s=1);a=e}else if((t=(d=f.n<0)?c:n.call(r,f))!==o)break}catch(t){a=e,s=1,c=t}finally{l=1}}return{value:t,done:d}}}(n,i,a),!0),l}var o={};function s(){}function c(){}function l(){}t=Object.getPrototypeOf;var f=[][r]?t(t([][r]())):(d(t={},r,function(){return this}),t),p=l.prototype=s.prototype=Object.create(f);function m(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,l):(e.__proto__=l,d(e,i,`GeneratorFunction`)),e.prototype=Object.create(p),e}return c.prototype=l,d(p,`constructor`,l),d(l,`constructor`,c),c.displayName=`GeneratorFunction`,d(l,i,`GeneratorFunction`),d(p),d(p,i,`Generator`),d(p,r,function(){return this}),d(p,`toString`,function(){return`[object Generator]`}),(u=function(){return{w:a,m}})()}function d(e,t,n,r){var i=Object.defineProperty;try{i({},``,{})}catch(e){i=0}d=function(e,t,n,r){function a(t,n){d(e,t,function(e){return this._invoke(t,n,e)})}t?i?i(e,t,{value:n,enumerable:!r,configurable:!r,writable:!r}):e[t]=n:(a(`next`,0),a(`throw`,1),a(`return`,2))},d(e,t,n,r)}function f(e,t,n,r,i,a,o){try{var s=e[a](o),c=s.value}catch(e){n(e);return}s.done?t(c):Promise.resolve(c).then(r,i)}function p(e){return function(){var t=this,n=arguments;return new Promise(function(r,i){var a=e.apply(t,n);function o(e){f(a,r,i,o,s,`next`,e)}function s(e){f(a,r,i,o,s,`throw`,e)}o(void 0)})}}function m(e){return ee(e)||_(e)||g(e)||h()}function h(){throw TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function g(e,t){if(e){if(typeof e==`string`)return v(e,t);var n={}.toString.call(e).slice(8,-1);return n===`Object`&&e.constructor&&(n=e.constructor.name),n===`Map`||n===`Set`?Array.from(e):n===`Arguments`||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?v(e,t):void 0}}function _(e){if(typeof Symbol<`u`&&e[Symbol.iterator]!=null||e[`@@iterator`]!=null)return Array.from(e)}function ee(e){if(Array.isArray(e))return v(e)}function v(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function y(e,t){var n=typeof Symbol<`u`&&e[Symbol.iterator]||e[`@@iterator`];if(!n){if(Array.isArray(e)||(n=te(e))||t&&e&&typeof e.length==`number`){n&&(e=n);var r=0,i=function(){};return{s:i,n:function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}},e:function(e){throw e},f:i}}throw TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var a,o=!0,s=!1;return{s:function(){n=n.call(e)},n:function(){var e=n.next();return o=e.done,e},e:function(e){s=!0,a=e},f:function(){try{o||n.return==null||n.return()}finally{if(s)throw a}}}}function te(e,t){if(e){if(typeof e==`string`)return b(e,t);var n={}.toString.call(e).slice(8,-1);return n===`Object`&&e.constructor&&(n=e.constructor.name),n===`Map`||n===`Set`?Array.from(e):n===`Arguments`||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?b(e,t):void 0}}function b(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}System.register([`./rolldown-runtime-legacy-GvFEhjMu.js`,`./index-legacy-BwJkHKOv.js`,`./three-legacy-RJR1-iRG.js`,`./openDogsPage-legacy-B_CTwsT4.js`,`./TitlePage-legacy-DBdM_XaD.js`,`./skip-forward-legacy-D4MMYC4t.js`,`./volume-2-legacy-D5EQS0nu.js`,`./volume-x-legacy-mYD_ioNn.js`,`./shuffle-legacy-BH4lk5is.js`,`./list-legacy-CWUqci9a.js`,`./external-link-legacy-D0TK1-2j.js`,`./arrow-left-legacy-QX75DWfY.js`,`./waves-legacy-C1ioJoI6.js`,`./maximize-2-legacy-BOSUuO96.js`,`./share-2-legacy-tx4uOtZD.js`,`./download-legacy-DZRVfJzQ.js`,`./tether.svelte-legacy-DJGPwavg.js`,`./check-legacy-D_MNd2AP.js`,`./triangle-alert-legacy-B9WcLMKk.js`,`./doubleTap-legacy-TTFKgIZD.js`,`./DogsLogo-legacy-yWmSHHCm.js`,`./three-core-legacy-CtrKL6Gq.js`,`./timer-legacy-DzoF67r8.js`,`./search-legacy-COuk-7AZ.js`],function(e,n){var r,i,o,c,l,d,f,h,g,_,ee,v,te,b,x,S,ne,re,ie,C,ae,w,T,oe,E,se,D,O,ce,le,k,ue,A,j,M,de,fe,N,P,pe,F,me,I,he,L,R,ge,z,_e,ve,ye,B,be,V,H,U,W,G,xe,Se,Ce,we,Te,Ee,K,De,Oe,ke,Ae,je,Me,Ne,Pe,Fe,Ie,Le,Re,ze,Be,Ve,He,Ue,We,Ge,Ke,qe,Je,Ye,Xe,Ze,Qe,$e,et,tt,nt,rt,q,J,it,at,ot,st,ct,lt,ut,dt,ft,Y,pt,mt,ht,X,Z,gt,_t,vt,yt,bt,xt,St,Ct,wt,Tt,Et,Dt,Ot,kt,At,jt,Mt,Nt,Pt,Ft,It,Lt,Rt,zt,Bt,Vt,Ht,Ut,Wt,Gt,Kt,qt,Jt,Yt,Xt,Zt,Qt,$t,en,tn,nn,rn,an,on,sn,cn,ln,un;function dn(e,t){var n=k(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z`}]];Te(e,A({name:`diamond`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=i(),a=o(r);E(a,t,`default`,{},null),C(e,r)},$$slots:{default:!0}}))}function fn(e,t){var n=k(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`m11.9 12.1 4.514-4.514`}],[`path`,{d:`M20.1 2.3a1 1 0 0 0-1.4 0l-1.114 1.114A2 2 0 0 0 17 4.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 17.828 7h1.344a2 2 0 0 0 1.414-.586L21.7 5.3a1 1 0 0 0 0-1.4z`}],[`path`,{d:`m6 16 2 2`}],[`path`,{d:`M8.23 9.85A3 3 0 0 1 11 8a5 5 0 0 1 5 5 3 3 0 0 1-1.85 2.77l-.92.38A2 2 0 0 0 12 18a4 4 0 0 1-4 4 6 6 0 0 1-6-6 4 4 0 0 1 4-4 2 2 0 0 0 1.85-1.23z`}]];Te(e,A({name:`guitar`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=i(),a=o(r);E(a,t,`default`,{},null),C(e,r)},$$slots:{default:!0}}))}function pn(e,t){var n=k(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`m11 7.601-5.994 8.19a1 1 0 0 0 .1 1.298l.817.818a1 1 0 0 0 1.314.087L15.09 12`}],[`path`,{d:`M16.5 21.174C15.5 20.5 14.372 20 13 20c-2.058 0-3.928 2.356-6 2-2.072-.356-2.775-3.369-1.5-4.5`}],[`circle`,{cx:`16`,cy:`7`,r:`5`}]];Te(e,A({name:`mic-vocal`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=i(),a=o(r);E(a,t,`default`,{},null),C(e,r)},$$slots:{default:!0}}))}function mn(e,t){var n=k(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`m17 2 4 4-4 4`}],[`path`,{d:`M3 11v-1a4 4 0 0 1 4-4h14`}],[`path`,{d:`m7 22-4-4 4-4`}],[`path`,{d:`M21 13v1a4 4 0 0 1-4 4H3`}],[`path`,{d:`M11 10h1v4`}]];Te(e,A({name:`repeat-1`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=i(),a=o(r);E(a,t,`default`,{},null),C(e,r)},$$slots:{default:!0}}))}function hn(e,t){var n=k(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`m17 2 4 4-4 4`}],[`path`,{d:`M3 11v-1a4 4 0 0 1 4-4h14`}],[`path`,{d:`m7 22-4-4 4-4`}],[`path`,{d:`M21 13v1a4 4 0 0 1-4 4H3`}]];Te(e,A({name:`repeat`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=i(),a=o(r);E(a,t,`default`,{},null),C(e,r)},$$slots:{default:!0}}))}function gn(e,t){return e?e.artist===it&&!t&&e.src?{url:e.src,label:ot}:e.instrumental?{url:e.instrumental,label:at}:{url:e.src||``,label:st}:{url:``,label:st}}function _n(e,t){return typeof e!=`string`||e.length>pt?``:e.startsWith(`/`)&&!e.startsWith(`//`)?e:t?e.startsWith(`https://`)?e:``:ht.some(function(t){return e.startsWith(t)})?e:``}function vn(e){if(!e||typeof e.id!=`string`||!mt.test(e.id))return null;var t={id:e.id},n=y(X),r;try{for(n.s();!(r=n.n()).done;){var i=r.value;t[i]=typeof e[i]==`string`?e[i].slice(0,Y):``}}catch(e){n.e(e)}finally{n.f()}var a=y(Z),o;try{for(a.s();!(o=a.n()).done;){var s=o.value;t[s]=_n(e[s],gt.indexOf(s)!==-1)}}catch(e){a.e(e)}finally{a.f()}return!t.title||!t.artist||!t.src&&!t.instrumental?null:(t.attrib||delete t.attrib,t.year=Number.isFinite(e.year)?Math.round(e.year):new Date().getFullYear(),t.public=e.public!==!1,t)}function yn(e){if(!e||e.kind!==lt||!Array.isArray(e.tracks))return[];var t={},n=[],r=y(e.tracks.slice(0,ft)),i;try{for(r.s();!(i=r.n()).done;){var a=i.value,o=vn(a);o&&!t[o.id]&&(t[o.id]=!0,n.push(o))}}catch(e){r.e(e)}finally{r.f()}return n}function bn(e,t){if(!t||!t.length)return e;var n={},r=y(t),i;try{for(r.s();!(i=r.n()).done;){var a=i.value;n[a.id]=a}}catch(e){r.e(e)}finally{r.f()}return e.map(function(e){var t=n[e.id];return t?(delete n[e.id],t):e}).concat(t.filter(function(e){return n[e.id]}))}function xn(){try{var e=JSON.parse(localStorage.getItem(ut));if(e&&Array.isArray(e.tracks))return e}catch(e){}return{at:0,tracks:[]}}function Sn(e,t){return bn(e,t?yt.tracks:yt.tracks.filter(function(e){return e.public!==!1}))}function Cn(e,t){for(var n=e,r=0;r<kt&&n&&typeof n[t]!=`function`;r+=1)n=n.default;if(!n||typeof n[t]!=`function`)throw Error(`MilkDrop bundle has no `+t);return n}function wn(){if(typeof document>`u`||window.WebGL2RenderingContext===void 0)return!1;try{return!!document.createElement(`canvas`).getContext(Dt)}catch(e){return!1}}function Tn(e,t){ae(t,!1);var n=f(),r=f(),i=f(),a=120,o=30,s=L(t,`current`,8,``),c=L(t,`names`,24,function(){return[]}),u=L(t,`auto`,8,!0),d=L(t,`onPrevious`,8,function(){}),p=L(t,`onNext`,8,function(){}),m=L(t,`onRandom`,8,function(){}),h=L(t,`onToggleAuto`,8,function(){}),g=L(t,`onPick`,8,function(){}),_=f(``),ee=f(!1);W(function(){return j(_)},function(){b(n,j(_).trim().toLowerCase().split(/\s+/).filter(Boolean))}),W(function(){return j(n),B(c())},function(){b(r,j(n).length?c().filter(function(e){var t=e.toLowerCase();return j(n).every(function(e){return t.indexOf(e)!==-1})}):c())}),W(function(){return j(r)},function(){b(i,j(r).slice(0,a))}),w(),de();var y=Ft(),te=I(y),ne=function(e){var t=Pt(),n=I(t),a=I(n);q(a,{size:14,class:`shrink-0 text-white/40`});var o=S(a,2);l(o),N(n);var u=S(n,2),d=I(u);oe(d,1,function(){return j(i)},function(e){return e},function(e,t){var n=jt(),r=I(n),i=F(r,!0);N(n),H(function(){x(r,1,`block w-full truncate px-3 py-1.5 text-left font-mono text-[11px] transition-colors hover:bg-white/10 md:text-[12px] 2xl:py-2 2xl:text-[15px]
                ${j(t)===s()?`bg-white/15 text-white`:`text-white/60`}`,`svelte-6h1e9g`),V(r,`aria-current`,j(t)===s()?`true`:void 0),O(i,j(t))}),P(`click`,r,function(){return g()(j(t))}),C(e,n)});var f=S(d,2),p=function(e){var t=Mt(),n=F(t,!0);H(function(){return O(n,(B(c()),fe(function(){return c().length?`No preset matches that.`:`Loading presets…`})))}),C(e,t)},m=function(e){var t=Nt(),n=F(t);H(function(){var e;return O(n,`${(e=(j(r),j(i),fe(function(){return j(r).length-j(i).length})))==null?``:e} more. Search to narrow it down.`)}),C(e,t)};v(f,function(e){j(i),fe(function(){return!j(i).length})?e(p):(j(r),j(i),fe(function(){return j(r).length>j(i).length})&&e(m,1))}),N(u),N(t),H(function(){var e;return V(o,`placeholder`,`Search ${(e=(B(c()),fe(function(){return c().length})))==null?``:e} presets`)}),U(o,function(){return j(_)},function(e){return b(_,e)}),C(e,t)};v(te,function(e){j(ee)&&e(ne)});var re=S(te,2),ie=I(re),T=I(ie);Ce(T,{size:16}),N(ie);var E=S(ie,2),se=I(E);Ie(se,{size:14}),N(E);var D=S(E,2),le=I(D);De(le,{size:16}),N(D);var k=S(D,2),ue=F(k,!0),A=S(k,2),M;V(A,`aria-label`,`Change preset by itself every 30 seconds`);var pe=I(A);rt(pe,{size:14}),N(A),N(re),N(y),H(function(){V(k,`aria-expanded`,j(ee)),V(k,`title`,j(ee)?`Hide the preset list`:`Browse presets`),O(ue,s()||`Loading MilkDrop…`),M=x(A,1,`deck-btn svelte-6h1e9g`,null,M,{"deck-btn-on":u()}),V(A,`aria-pressed`,u()),V(A,`title`,u()?`A new preset every ${o} seconds: on`:`A new preset every ${o} seconds: off`)}),P(`click`,ie,function(){var e,t=[...arguments];(e=d())==null||e.apply(this,t)}),P(`click`,E,function(){var e,t=[...arguments];(e=m())==null||e.apply(this,t)}),P(`click`,D,function(){var e,t=[...arguments];(e=p())==null||e.apply(this,t)}),P(`click`,k,function(){return b(ee,!j(ee))}),P(`click`,A,function(){var e,t=[...arguments];(e=h())==null||e.apply(this,t)}),C(e,y),ce()}function En(e,t){ae(t,!0);var n=`/img/error_cover.png`,r=6e4;function a(e){e.target.src.endsWith(n)||(e.target.src=n)}var s=L(t,`isClosing`,3,!1),f=L(t,`initialTrackId`,3,null),_=Je(function(){return t.onClose()}),y=G(`default`),w=G(!1),E=G(!1),D=G(!1),k=G(null),A=z(function(){var e;return!!K.fetchErrors[(e=K.library[K.currentTrackIndex])==null?void 0:e.id]}),M=z(function(){return K.isPlaying&&!s()&&!j(A)}),de=`milkdrop`,he=`milkdrop`,R=`shader`,ve=wn()?[].concat(m(xt),[{id:de,name:`MilkDrop`}]):xt,B=G(!1),U=G(0),W=z(function(){return ve[j(U)].id===de}),Ce=G(ne([])),Te=G(``),De=G(!0),rt=G(!1),q=G(null),J=null,it=!1,at=G(!1),ot=G(!1),st=z(function(){var e=It.split(/`{5,}/);return{intro:e[0]||``,tos:e[1]||``,outro:e[2]||``}});function ct(e){if(!e)return``;var t=e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`);return t=t.replace(/(https?:\/\/[^\s]+)/g,`<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>`),t=t.replace(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/g,`<a href="mailto:$1">$1</a>`),t.replace(/\n/g,`<br>`)}var lt=z(function(){var e=j(Z);if(!e)return Array(60).fill(10);if(K.waveformPeaks[e.id])return K.waveformPeaks[e.id];for(var t=e.id,n=[],r=0,i=0;i<t.length;i++)r=(r<<5)-r+t.charCodeAt(i),r|=0;for(var a=Math.abs(r)%1e3,o=0;o<60;o++){var s=o/59,c=Math.sin(a+s*Math.PI*4),l=Math.cos(a*1.5+s*Math.PI*10)*.4,u=Math.sin(a*2.3+s*Math.PI*22)*.15,d=Math.abs(c+l+u)/1.55,f=Math.sin(s*Math.PI),p=(d*70+15)*f;n.push(Math.max(10,Math.round(p)))}return n});T(function(){window.innerWidth<=640&&j(B)&&j(U)===0&&fe(function(){return j(w)})&&b(w,!1)}),T(function(){K.isPlaying&&b(at,!0)});var ut=z(function(){return j(W)?null:!K.isPlaying&&!j(at)?St.fragmentShader:ve[j(U)].fragmentShader});T(function(){var e=K.analyser,t=j(W)?he:R;if(j(B)&&j(q)&&!s()&&j(q).dataset.engine===t){if(!j(W))J=new bt(j(q),e),J.init(j(ut)),J.start();else if(e&&K.audioCtx){var n=new At(j(q),e,K.audioCtx,{onPreset:function(e){return b(Te,e,!0)},onNames:function(e){return b(Ce,e,!0)}});n.auto=fe(function(){return j(De)}),J=n,n.start()}}return function(){J&&(J.destroy(),J=null)}}),T(function(){var e=j(ut);e&&J&&j(B)&&!j(W)&&(J.setPreset(e),J.start())}),T(function(){if(j(w)){var e;!((e=history.state)!=null&&e.tracklistOpen)&&!it&&(history.pushState({tracklistOpen:!0},``),it=!0)}else it&&(history.back(),it=!1)}),ge(function(){it&&(history.back(),it=!1)});function dt(e){var t;!((t=e.state)!=null&&t.tracklistOpen)&&j(w)&&(b(w,!1),it=!1)}function ft(e){j(D)&&j(k)&&!j(k).contains(e.target)&&!e.target.closest(`.vol-toggle-btn`)&&b(D,!1)}var Y=z(function(){return Sn(Se(we.unlocked),we.unlocked)}),pt=null;function mt(e){return e.src?e.src.split(`/`).pop():``}function ht(e){if(!e.dateAdded)return`Summer`;var t=new Date(e.dateAdded).getMonth();return t===11||t===0||t===1?`Winter`:t>=2&&t<=4?`Spring`:t>=5&&t<=7?`Summer`:`Fall`}var X=z(function(){var e=j(Y).filter(function(e){return!e.hidden});return j(y)===`artist`?e.sort(function(e,t){return e.artist.localeCompare(t.artist)}):j(y)===`album`?e.sort(function(e,t){return e.album.localeCompare(t.album)}):j(y)===`year`?e.sort(function(e,t){return(e.year||0)-(t.year||0)}):j(y)===`filename`?e.sort(function(e,t){return mt(e).localeCompare(mt(t))}):j(y)===`genre`?e.sort(function(e,t){return(e.genre||``).localeCompare(t.genre||``)}):j(y)===`season`&&e.sort(function(e,t){return ht(e).localeCompare(ht(t))}),e}),Z=z(function(){var e;return(e=j(Y)[K.currentTrackIndex])==null?j(Y)[0]:e});T(function(){var e,t=j(Y);if(K.library!==t&&K.library.length!==0){var n=(e=K.library[K.currentTrackIndex])==null?void 0:e.id;K.init(t);var r=pt?t.findIndex(function(e){return e.id===pt}):-1,i=t.findIndex(function(e){return e.id===n});r===-1?i===-1?(K.pause(),K.loadTrack(0,!1)):K.currentTrackIndex=i:(pt=null,K.loadTrack(r,!0))}});var gt=G(0),_t=G(0),vt=G(0),Ct=G(0),wt=G(0),Tt=G(0),Et=`This device is the remote: the sound is on the other one.`,Dt=`Both players are in step.`,Ot=`It stays on until you close this window, disconnect in Air Train, or nothing happens for 10 minutes.`,kt=G(!1),jt=z(function(){return`Tethered to ${Ge.peerName||`your other device`}. ${K.masterIsRemote?Et:Dt} ${Ot}`}),Mt=G(null),Nt=null;function Pt(e,t){e.stopPropagation();var n=`${window.location.origin}/music/${t.id}`;navigator.clipboard.writeText(n).then(function(){b(Mt,t.id,!0),Nt&&clearTimeout(Nt),Nt=setTimeout(function(){b(Mt,null)},2e3)}).catch(function(e){console.error(`Failed to copy share link:`,e)})}var Ft=G(null);function _n(e){var t;return gn(e,e.id===((t=K.library[K.currentTrackIndex])==null?void 0:t.id)?K.isInstrumental:K.userPrefersInstrumental)}function vn(e,t){return yn.apply(this,arguments)}function yn(){return yn=p(u().m(function e(t,n){var i,a,o,s,c,l;return u().w(function(e){for(;;)switch(e.p=e.n){case 0:if(t.stopPropagation(),i=_n(n).url,i&&!j(Ft)){e.n=1;break}return e.a(2);case 1:return b(Ft,n.id,!0),e.p=2,e.n=3,fetch(i,we.fetchOptionsFor(i));case 3:if(a=e.v,a.ok){e.n=4;break}throw Error(`Fetch failed with status ${a.status}`);case 4:return c=URL,e.n=5,a.blob();case 5:o=c.createObjectURL.call(c,e.v),s=document.createElement(`a`),s.href=o,s.download=decodeURIComponent(i.split(`/`).pop()||``)||`${n.id}.mp3`,document.body.appendChild(s),s.click(),s.remove(),setTimeout(function(){return URL.revokeObjectURL(o)},r),e.n=7;break;case 6:e.p=6,l=e.v,console.error(`Failed to download track:`,l);case 7:return e.p=7,b(Ft,null),e.f(7);case 8:return e.a(2)}},e,null,[[2,6,7,8]])})),yn.apply(this,arguments)}ge(function(){Nt&&clearTimeout(Nt)}),ee(function(){if(we.revalidate(),K.init(j(Y)),yt.refresh(),f()){var e=j(Y).findIndex(function(e){return e.id===f()});e===-1?pt=f():K.loadTrack(e,!0)}else if(!K.hasPickedRandomTrack){K.hasPickedRandomTrack=!0;var t=j(Y).filter(function(e){return!e.hidden}),n=t[Math.floor(Math.random()*t.length)];K.loadTrack(j(Y).indexOf(n),!1)}});var bn=G(null);function xn(){var e=document.querySelector(`.track-row[data-track-id="${j(bn)}"]`);e&&e.scrollIntoView({block:`nearest`,behavior:`smooth`})}function Cn(e){b(bn,e.id,!0);var t=j(Y).findIndex(function(t){return t.id===e.id});K.currentTrackIndex===t&&!K.fetchErrors[e.id]?K.togglePlay():K.loadTrack(t,!0)}function En(){window.innerWidth<=640?b(w,!0):b(B,!j(B))}function Dn(e){window.innerWidth>640||e.target.closest(`.scroll-container`)&&b(w,!0)}function On(){var e=!K.isInstrumental;K.setCrossfade(e)||(c(jn),j(Mn)||(b(Mn,!0),setTimeout(function(){b(Mn,!1)},300)),j(jn)===5?(Kn(),b(Nn,!0),setTimeout(function(){b(Nn,!1)},150)):j(jn)===10?Kn(35):j(jn)>5&&j(jn)<10?Kn(8):j(jn)>10&&Math.random()<.4&&Kn(3))}function kn(e){return!e||isNaN(e)?`0:00`:`${Math.floor(e/60)}:${Math.floor(e%60).toString().padStart(2,`0`)}`}function An(e){var t=document.activeElement;if(!t||t.tagName!==`INPUT`&&t.tagName!==`TEXTAREA`&&!t.isContentEditable){if(e.code===`Space`||e.key===` `)e.preventDefault(),K.togglePlay();else if(e.key===`ArrowDown`){if(j(X).length>0){e.preventDefault();var n=j(X).findIndex(function(e){return e.id===j(bn)});if(n===-1){var r=j(Y)[K.currentTrackIndex];n=j(X).findIndex(function(e){return e.id===(r==null?void 0:r.id)})}var i=(n+1)%j(X).length;b(bn,j(X)[i].id,!0),xn()}}else if(e.key===`ArrowUp`){if(j(X).length>0){e.preventDefault();var a=j(X).findIndex(function(e){return e.id===j(bn)});if(a===-1){var o=j(Y)[K.currentTrackIndex];a=j(X).findIndex(function(e){return e.id===(o==null?void 0:o.id)})}var s=(a-1+j(X).length)%j(X).length;b(bn,j(X)[s].id,!0),xn()}}else if(e.key===`Enter`&&j(bn)){e.preventDefault();var c=j(X).find(function(e){return e.id===j(bn)});c&&Cn(c)}}}var Q=G(null),jn=G(0),Mn=G(!1),Nn=G(!1),$,Pn,Fn,In=[],Ln=[],Rn,zn=G(!1);T(function(){return j(Q)&&Hn(),function(){var e;Rn&&cancelAnimationFrame(Rn),window.removeEventListener(`resize`,Un),(e=window.visualViewport)==null||e.removeEventListener(`resize`,Un),Fn&&(Fn.dispose(),Fn=null),$=null,Pn=null,In=[],Ln=[]}}),T(function(){if(K.currentTrackIndex,s(),b(jn,0),b(zn,!1),$){for(var e=0,t=In;e<t.length;e++){var n=t[e];$.remove(n.mesh)}for(var r=0,i=Ln;r<i.length;r++){var a=i[r];$.remove(a.mesh)}}In=[],Ln=[]});function Bn(){if(!j(Q))return{width:window.innerWidth,height:window.innerHeight};var e=j(Q).getBoundingClientRect();return{width:e.width||window.innerWidth,height:e.height||window.innerHeight}}function Vn(){var e=Bn(),t=e.width,n=e.height,r=document.querySelector(`.dj-fader-knob`);if(!r)return{x:t/2,y:n/2};var i=j(Q)?j(Q).getBoundingClientRect():{left:0,top:0},a=r.getBoundingClientRect();return{x:a.left+a.width/2-i.left,y:n-(a.top+a.height/2-i.top)}}function Hn(){var e;if(j(Q)){var t=Bn(),n=t.width,r=t.height;j(Q).width=n,j(Q).height=r,$=new $e,Pn=new Qe(0,n,r,0,-1,1),Fn=new xe({canvas:j(Q),alpha:!0,antialias:!0}),Fn.setSize(n,r,!1),Fn.setPixelRatio(Math.min(window.devicePixelRatio,2)),window.addEventListener(`resize`,Un),(e=window.visualViewport)==null||e.addEventListener(`resize`,Un),Wn()}}function Un(){if(j(Q)&&Fn&&Pn){var e=Bn(),t=e.width,n=e.height;j(Q).width=t,j(Q).height=n,Fn.setSize(t,n,!1),Pn.right=t,Pn.top=n,Pn.updateProjectionMatrix()}}function Wn(){if(Rn=requestAnimationFrame(Wn),$&&Pn&&Fn&&j(Q)){if(j(jn)>=10&&(b(zn,!0),Math.random()<.22)){var e=Vn();Gn(e.x,e.y)}for(var t=In.length-1;t>=0;t--){var n=In[t];n.x+=n.vx,n.y+=n.vy,n.vy+=n.ay,n.life-=n.decay,n.mesh.position.set(n.x,n.y,0),n.mesh.material.opacity=n.life,n.life<=0&&($.remove(n.mesh),n.mesh.geometry.dispose(),n.mesh.material.dispose(),In.splice(t,1))}for(var r=Ln.length-1;r>=0;r--){var i=Ln[r];i.x+=i.vx,i.y+=i.vy,i.life-=i.decay;var a=i.startScale+(1-i.life)*88;i.mesh.scale.set(a,a,1),i.mesh.position.set(i.x,i.y,0),i.mesh.material.opacity=i.life*.16,i.life<=0&&($.remove(i.mesh),i.mesh.geometry.dispose(),i.mesh.material.dispose(),Ln.splice(r,1))}Fn.render($,Pn)}}function Gn(e,t){if($){var n=new Ze(5,8),r=.85+Math.random()*.12,i=new tt({color:new et(r,r,r*1.01),transparent:!0,opacity:.06,blending:1}),a=new nt(n,i);a.position.set(e,t,0),$.add(a),Ln.push({mesh:a,x:e,y:t,vx:(Math.random()-.5)*.55+Math.sin(Date.now()*.001)*.22,vy:Math.random()*.7+1.25,startScale:1,life:1,decay:6e-4+Math.random()*4e-4})}}function Kn(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:25;if($&&j(Q))for(var t=Vn(),n=t.x,r=t.y,i=0;i<e;i++){var a=new Ze(1.3,4),o=new tt({color:new et(Math.random()<.4?16711765:16755200),transparent:!0,opacity:1,blending:2}),s=new nt(a,o);s.position.set(n,r,0),$.add(s);var c=Math.random()*Math.PI*2,l=Math.random()*4+2;In.push({mesh:s,x:n,y:r,vx:Math.cos(c)*l,vy:Math.sin(c)*l,ay:-.15,life:1,decay:.02+Math.random()*.02})}}var qn=un();ue(`keydown`,ie,An),ue(`popstate`,ie,dt),ue(`click`,ie,ft);var Jn=I(qn),Yn,Xn=I(Jn),Zn=I(Xn),Qn=I(Zn),$n=I(Qn);Xe($n,{size:`panel`}),N(Qn);var er=S(Qn,2);er.textContent=`MUSIC`,N(Zn);var tr=S(Zn,2),nr=I(tr);ze(nr,{size:20}),N(tr),N(Xn);var rr=S(Xn,2),ir=I(rr),ar=I(ir),or,sr=I(ar),cr,lr=I(sr),ur,dr=I(lr),fr=function(e){var t=zt(),n=I(t);h(n,function(){return j(W)},function(e){var t=Lt();le(t,function(e){return b(q,e)},function(){return j(q)}),H(function(){return V(t,`data-engine`,j(W)?he:R)}),C(e,t)});var r=S(n,2),i=function(e){var t=Rt();C(e,t)};v(r,function(e){!K.isPlaying&&!j(at)&&e(i)});var a=S(r,2),o=I(a);Ve(o,{size:16,class:`text-white/70`}),N(a),N(t),P(`click`,t,function(){b(rt,!0)}),C(e,t)},pr=function(e){var t=Bt(),n=I(t);Ve(n,{size:16,class:`text-white/20`}),N(t),C(e,t)},mr=function(e){var t=i(),r=o(t),s=function(e){var t=Vt(),r=I(t),i,o=S(I(r),8),s=I(o),c;N(o),_e(2),N(r);var l=S(r,2),u;N(t),H(function(){i=x(r,1,`vinyl-record svelte-1o4jdf5`,null,i,{spinning:j(M)}),V(s,`src`,K.fetchErrors[j(Z).id]||!j(Z).cover?n:j(Z).cover),V(s,`alt`,j(Z).album),c=x(s,1,`record-art svelte-1o4jdf5`,null,c,{loaded:j(E)}),u=x(l,1,`tonearm svelte-1o4jdf5`,null,u,{playing:j(M)})}),P(`click`,t,En),ue(`load`,s,function(){return b(E,!0)}),ue(`error`,s,a),ye(s),C(e,t)},c=function(e){var t=z(function(){return K.duration>0?(1-K.currentTime/K.duration)*.45+.25:.48}),n=z(function(){return K.duration>0?K.currentTime/K.duration*.45+.25:.48}),r=Ht(),i=I(r),a=I(i),o=I(a),s=F(o,!0);_e(2),N(a);var c=S(a,2),l=I(c),u,d=S(l,2),f,p=S(d,2),m,h=S(p,2),g;N(c),N(i),N(r),H(function(){O(s,j(Z).title),u=x(l,1,`spindle-left bg-zinc-900 svelte-1o4jdf5`,null,u,{spinning:j(M)}),f=x(d,1,`tape-roll-left bg-amber-950/70 svelte-1o4jdf5`,null,f,{spinning:j(M)}),pe(d,`width: ${j(t)*46}px; height: ${j(t)*46}px;`),m=x(p,1,`spindle-right bg-zinc-900 svelte-1o4jdf5`,null,m,{spinning:j(M)}),g=x(h,1,`tape-roll-right bg-amber-950/70 svelte-1o4jdf5`,null,g,{spinning:j(M)}),pe(h,`width: ${j(n)*46}px; height: ${j(n)*46}px;`)}),P(`click`,r,En),C(e,r)},l=function(e){var t=Ut(),n=I(t),r=S(I(n),4),i=S(I(r),4),a=I(i),o=F(a,!0),s=S(a,2),c=F(s,!0);N(i),N(r);var l=S(r,2),u=I(l),d,f=S(u,2),p=I(f),m;N(f),N(l);var h=S(l,2),g;N(n),N(t),H(function(){O(o,j(Z).title),O(c,j(Z).artist||`WEAREDOGS`),d=x(u,1,`floppy-shutter-slider bg-zinc-400 svelte-1o4jdf5`,null,d,{open:j(M)}),m=x(p,1,`floppy-magnetic-disc bg-zinc-900 svelte-1o4jdf5`,null,m,{spinning:j(M)}),g=x(h,1,`floppy-drive-led svelte-1o4jdf5`,null,g,{active:j(M)})}),P(`click`,t,En),C(e,t)},u=function(e){var t=Gt(),n=I(t),r=I(n),i,a=S(r,2),o=I(a),s=I(o),c,l=S(s,2),u;N(o);var d=S(o,2),f=I(d),p;N(d);var m=S(d,2);oe(m,20,function(){return Array(10)},se,function(e,t,n){var r=Wt(),i;H(function(e){return i=x(r,1,`comb-tooth svelte-1o4jdf5`,null,i,{vibrating:e})},[function(){return j(M)&&n%3==Math.floor(K.currentTime*4)%3}]),C(e,r)}),N(m),N(a),N(n),N(t),H(function(){i=x(r,1,`music-box-key svelte-1o4jdf5`,null,i,{spinning:j(M)}),c=x(s,1,`music-box-gear gear-1 svelte-1o4jdf5`,null,c,{spinning:j(M)}),u=x(l,1,`music-box-gear gear-2 svelte-1o4jdf5`,null,u,{spinning:j(M)}),p=x(f,1,`music-box-drum bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 svelte-1o4jdf5`,null,p,{spinning:j(M)})}),P(`click`,t,En),C(e,t)};v(r,function(e){je.musicDeckModel===`vinyl`?e(s):je.musicDeckModel===`cassette`?e(c,1):je.musicDeckModel===`floppy`?e(l,2):je.musicDeckModel===`musicbox`&&e(u,3)}),C(e,t)};v(dr,function(e){j(B)&&!j(rt)?e(fr):j(B)&&j(rt)?e(pr,1):e(mr,-1)}),N(lr);var hr=S(lr,2),gr=I(hr),_r=I(gr),vr=I(_r),yr=function(e){Ke(e,{size:12,class:`text-[#22c55e]`})},br=function(e){He(e,{size:12})};v(vr,function(e){j(Mt)===j(Z).id?e(yr):e(br,-1)}),N(_r);var xr=S(_r,2),Sr=function(e){var t=Kt(),n,r=I(t);Ue(r,{size:12}),N(t),H(function(e,r){n=x(t,1,`player-download-btn svelte-1o4jdf5`,null,n,{downloading:j(Ft)===j(Z).id}),V(t,`title`,e),V(t,`aria-label`,r)},[function(){return _n(j(Z)).label},function(){return _n(j(Z)).label}]),P(`click`,t,function(e){return vn(e,j(Z))}),C(e,t)};v(xr,function(e){(j(Z).instrumental||j(Z).src)&&e(Sr)});var Cr=S(xr,2),wr=function(e){var t=Jt(),n=I(t),r=I(n);We(r,{size:12}),N(n);var i=S(n,2),a=function(e){var t=qt(),n=F(t,!0);H(function(){return O(n,j(jt))}),C(e,t)};v(i,function(e){j(kt)&&e(a)}),N(t),H(function(){V(n,`title`,j(jt)),V(n,`aria-label`,j(jt)),V(n,`aria-expanded`,j(kt))}),P(`click`,n,function(e){e.stopPropagation(),b(kt,!j(kt))}),ue(`blur`,n,function(){return b(kt,!1)}),C(e,t)};v(Cr,function(e){Ge.linked&&e(wr)}),N(gr);var Tr=S(gr,2),Er,Dr=I(Tr),Or,kr=F(Dr,!0);N(Tr);var Ar=S(Tr,2),jr,Mr=I(Ar),Nr,Pr=F(Mr,!0);N(Ar);var Fr=S(Ar,2),Ir,Lr=I(Fr),Rr,zr=F(Lr,!0);N(Fr),N(hr),N(sr);var Br=S(sr,2),Vr=I(Br),Hr=I(Vr),Ur=F(Hr,!0),Wr=S(Hr,2),Gr=I(Wr);oe(Gr,21,function(){return j(lt)},se,function(e,t,n){var r=z(function(){return K.duration>0?K.currentTime/K.duration:0}),i=z(function(){return n/60}),a=Yt(),o;H(function(){var e;o=x(a,1,`waveform-bar transition-colors duration-100 rounded-full svelte-1o4jdf5`,null,o,{active:j(i)<=j(r)}),pe(a,`height: ${(e=j(t))==null?``:e}%; width: 3px;`)}),C(e,a)}),N(Gr);var Kr=S(Gr,2);l(Kr),N(Wr);var qr=S(Wr,2),Jr=F(qr,!0);N(Vr);var Yr=S(Vr,2),Xr=I(Yr),Zr,Qr=I(Xr);Ie(Qr,{size:15}),N(Xr);var $r=S(Xr,2),ei=I($r);Me(ei,{size:19}),N($r);var ti=S($r,2),ni,ri=I(ti),ii=function(e){qe(e,{size:22})},ai=function(e){var t=Xt();C(e,t)},oi=function(e){Ae(e,{size:22,fill:`currentColor`})},si=function(e){Ee(e,{size:22,fill:`currentColor`})};v(ri,function(e){K.fetchErrors[j(Z).id]?e(ii):K.isLoading?e(ai,1):K.isPlaying?e(oi,2):e(si,-1)}),N(ti);var ci=S(ti,2),li=I(ci);Ne(li,{size:19}),N(ci);var ui=S(ci,2),di,fi=I(ui),pi=function(e){mn(e,{size:15})},mi=function(e){dn(e,{size:15})},hi=function(e){hn(e,{size:15})};v(fi,function(e){K.repeatMode===2?e(pi):K.repeatMode===3?e(mi,1):e(hi,-1)}),N(ui),N(Yr);var gi=S(Yr,2),_i=I(gi),vi,yi=I(_i),bi;pn(I(yi),{size:12}),_e(2),N(yi);var xi=S(yi,2),Si=I(xi),Ci;N(xi);var wi=S(xi,2),Ti;fn(I(wi),{size:12}),_e(2),N(wi),N(_i),N(gi);var Ei=S(gi,2),Di=I(Ei),Oi=function(e){var t=Zt(),n=I(t),r=I(n),i=function(e){Fe(e,{size:12,class:`text-red-400`})},a=function(e){Pe(e,{size:12})};v(r,function(e){K.isMuted||K.volume===0?e(i):e(a,-1)}),N(n);var o=S(n,2);l(o);var s=S(o,2),c=F(s);N(t),le(t,function(e){return b(k,e)},function(){return j(k)}),H(function(e){d(o,K.volume),O(c,`${e==null?``:e}%`)},[function(){return Math.round(K.volume*100)}]),P(`click`,n,function(){return K.toggleMute()}),P(`input`,o,function(e){return K.setVolume(parseFloat(e.target.value))}),C(e,t)};v(Di,function(e){j(D)&&e(Oi)});var ki=S(Di,2),Ai=I(ki),ji,Mi=I(Ai);Be(Mi,{size:13}),N(Ai);var Ni=S(Ai,2),Pi=F(Ni,!0);N(ki);var Fi=S(ki,2),Ii=I(Fi),Li=I(Ii),Ri=function(e){Fe(e,{size:13,class:`text-red-400`})},zi=function(e){Pe(e,{size:13})};v(Li,function(e){K.isMuted||K.volume===0?e(Ri):e(zi,-1)}),N(Ii),N(Fi),N(Ei),N(Br),N(ar);var Bi=S(ar,2),Vi,Hi=I(Bi),Ui=S(I(Hi),2);N(Hi);var Wi=S(Hi,2),Gi=I(Wi),Ki=I(Gi);Le(Ki,{size:13});var qi=S(Ki,3),Ji=F(qi,!0);N(Gi);var Yi=S(Gi,2),Xi=S(I(Yi),2),Zi=I(Xi);Zi.value=Zi.__value=`default`;var Qi=S(Zi);Qi.value=Qi.__value=`artist`;var $i=S(Qi);$i.value=$i.__value=`album`;var ea=S($i);ea.value=ea.__value=`year`;var ta=S(ea);ta.value=ta.__value=`filename`;var na=S(ta);na.value=na.__value=`genre`;var ra=S(na);ra.value=ra.__value=`season`,N(Xi),me(Xi),N(Yi),N(Wi);var ia=S(Wi,2);oe(ia,21,function(){return j(X)},se,function(e,t,r){var i=an(),o,s=I(i),c=I(s),l=function(e){var t=Qt();C(e,t)},u=function(e){var t=$t();t.textContent=r+1,C(e,t)};v(c,function(e){j(Z).id===j(t).id&&K.isPlaying?e(l):e(u,-1)}),N(s);var d=S(s,2),f=S(d,2),p=I(f),m=I(p),h,g=F(m,!0),_=S(m,2),ee=function(e){var t=en(),n=I(t);qe(n,{size:10}),_e(),N(t),C(e,t)};v(_,function(e){K.fetchErrors[j(t).id]&&e(ee)}),N(p);var y=S(p,2),te=F(y);N(f);var ne=S(f,2),re=I(ne),ie=function(e){var n=rn(),r=I(n),i=function(e){var t=tn();P(`click`,t,function(e){e.stopPropagation(),b(ot,!0)}),C(e,t)},a=function(e){var n=nn();H(function(){return V(n,`href`,j(t).attrib)}),P(`click`,n,function(e){return e.stopPropagation()}),C(e,n)};v(r,function(e){j(t).id===`arigato`?e(i):e(a,-1)}),N(n),C(e,n)};v(re,function(e){j(t).attrib&&e(ie)});var ae=S(re,2),w=I(ae),T=function(e){Ke(e,{size:12,class:`text-[#22c55e]`})},oe=function(e){He(e,{size:12})};v(w,function(e){j(Mt)===j(t).id?e(T):e(oe,-1)}),N(ae);var E=S(ae,2),se=function(e){var n=Kt(),r,i=I(n);Ue(i,{size:12}),N(n),H(function(e,i){r=x(n,1,`tr-download-btn svelte-1o4jdf5`,null,r,{downloading:j(Ft)===j(t).id}),V(n,`title`,e),V(n,`aria-label`,i)},[function(){return _n(j(t)).label},function(){return _n(j(t)).label}]),P(`click`,n,function(e){return vn(e,j(t))}),C(e,n)};v(E,function(e){(j(t).instrumental||j(t).src)&&e(se)}),N(ne),N(i),H(function(){var e,r,a;o=x(i,1,`track-row svelte-1o4jdf5`,null,o,{active:j(Z).id===j(t).id,"kb-focused":j(bn)===j(t).id,"fetch-error":K.fetchErrors[j(t).id]}),V(i,`data-track-id`,j(t).id),V(d,`src`,K.fetchErrors[j(t).id]||!j(t).cover?n:j(t).cover),V(d,`alt`,j(t).album),h=x(m,1,`tr-title svelte-1o4jdf5`,null,h,{"line-through":K.fetchErrors[j(t).id],"opacity-50":K.fetchErrors[j(t).id]}),O(g,j(t).title),O(te,`${(e=j(t).artist)==null?``:e} · ${(r=j(t).album)==null?``:r} (${(a=j(t).year||``)==null?``:a})`)}),P(`click`,i,function(){return Cn(j(t))}),ue(`error`,d,a),ye(d),P(`click`,ae,function(e){return Pt(e,j(t))}),C(e,i)}),N(ia),N(Bi),N(ir),N(rr),_e(2),N(Jn);var aa=S(Jn,2),oa=function(e){var t=cn(),n=I(t);h(n,function(){return j(W)},function(e){var t=Lt();le(t,function(e){return b(q,e)},function(){return j(q)}),H(function(){return V(t,`data-engine`,j(W)?he:R)}),C(e,t)});var r=S(n,2),i=function(e){var t=on();C(e,t)};v(r,function(e){!K.isPlaying&&!j(at)&&e(i)});var a=S(r,2),o=I(a);oe(o,21,function(){return ve},se,function(e,t,n){var r=sn(),i=F(r,!0);H(function(){x(r,1,`px-2 py-1 rounded text-[9px] font-bold transition-all uppercase tracking-wider font-mono 2xl:px-3 2xl:py-2 2xl:text-[13px]
                ${j(U)===n?`bg-white text-black`:`text-white/40 hover:text-white/80`}`,`svelte-1o4jdf5`),O(i,j(t).name)}),P(`click`,r,function(){return b(U,n,!0)}),C(e,r)}),N(o);var s=S(o,2),c=function(e){Tn(e,{get current(){return j(Te)},get names(){return j(Ce)},get auto(){return j(De)},onPrevious:function(){var e,t;return(e=J)==null||(t=e.previous)==null?void 0:t.call(e)},onNext:function(){var e,t;return(e=J)==null||(t=e.next)==null?void 0:t.call(e)},onRandom:function(){var e,t;return(e=J)==null||(t=e.random)==null?void 0:t.call(e)},onPick:function(e){var t,n;return(t=J)==null||(n=t.loadPreset)==null?void 0:n.call(t,e)},onToggleAuto:function(){var e,t;b(De,!j(De)),(e=J)==null||(t=e.setAuto)==null||t.call(e,j(De))}})};v(s,function(e){j(W)&&e(c)}),N(a),N(t),P(`click`,t,function(e){e.stopPropagation(),b(rt,!1)}),P(`click`,a,function(e){return e.stopPropagation()}),C(e,t)};v(aa,function(e){j(B)&&j(rt)&&e(oa)});var sa=S(aa,2);le(sa,function(e){return b(Q,e)},function(){return j(Q)});var ca=S(sa,2),la=function(e){var t=ln(),n=I(t),r=I(n),i=S(I(r),2),a=I(i);ze(a,{size:16}),N(i),N(r);var o=S(r,2),s=I(o),c=I(s),l=I(c);Re(l,{size:14}),_e(),N(c),N(s);var u=S(s,2);g(u,function(){return ct(j(st).intro)},!0),N(u);var d=S(u,2),f=I(d);g(f,function(){return ct(j(st).tos)},!0),N(f),N(d);var p=S(d,2);g(p,function(){return ct(j(st).outro)},!0),N(p),N(o),N(n),N(t),P(`click`,t,function(){return b(ot,!1)}),P(`click`,n,function(e){return e.stopPropagation()}),P(`click`,i,function(){return b(ot,!1)}),te(3,t,function(){return Ye},function(){return{duration:150}}),C(e,t)};v(ca,function(e){j(ot)&&e(la)}),N(qn),H(function(e,t,n){Yn=x(Jn,1,`mp-container svelte-1o4jdf5`,null,Yn,{closing:s(),"theme-inst":K.isInstrumental}),pe(Jn,e),or=x(ar,1,`player-side svelte-1o4jdf5`,null,or,{"tracklist-open":j(w)}),cr=x(sr,1,`player-top-block transition-all duration-300 ease-in-out svelte-1o4jdf5`,null,cr,{"opacity-0":j(w),"scale-95":j(w),"pointer-events-none":j(w)}),ur=x(lr,1,`vinyl-wrapper relative overflow-hidden svelte-1o4jdf5`,null,ur,{"deck-glitch":j(A)}),Er=x(Tr,1,`scroll-container svelte-1o4jdf5`,null,Er,{overflowing:j(_t)>j(gt)}),pe(Tr,`--scroll-dist: -${j(_t)-j(gt)}px`),Or=x(Dr,1,`track-title scroll-text svelte-1o4jdf5`,null,Or,{"animate-scroll":j(_t)>j(gt)}),O(kr,j(Z).title),jr=x(Ar,1,`scroll-container svelte-1o4jdf5`,null,jr,{overflowing:j(Ct)>j(vt)}),pe(Ar,`--scroll-dist: -${j(Ct)-j(vt)}px`),Nr=x(Mr,1,`track-artist scroll-text svelte-1o4jdf5`,null,Nr,{"animate-scroll":j(Ct)>j(vt)}),O(Pr,j(Z).artist),Ir=x(Fr,1,`scroll-container svelte-1o4jdf5`,null,Ir,{overflowing:j(Tt)>j(wt)}),pe(Fr,`--scroll-dist: -${j(Tt)-j(wt)}px`),Rr=x(Lr,1,`track-album scroll-text svelte-1o4jdf5`,null,Rr,{"animate-scroll":j(Tt)>j(wt)}),O(zr,j(Z).album),O(Ur,t),V(Kr,`max`,K.duration||100),d(Kr,K.currentTime),O(Jr,n),Zr=x(Xr,1,`ctrl ctrl-sm svelte-1o4jdf5`,null,Zr,{"active-ctrl":K.isShuffled}),ni=x(ti,1,`ctrl ctrl-play svelte-1o4jdf5`,null,ni,{"ctrl-error":K.fetchErrors[j(Z).id]}),V(ti,`aria-label`,K.isPlaying?`Pause`:`Play`),di=x(ui,1,`ctrl ctrl-sm svelte-1o4jdf5`,null,di,{"active-ctrl":K.repeatMode>0}),V(ui,`title`,K.repeatMode===1?`Repeat: all`:K.repeatMode===2?`Repeat: one`:K.repeatMode===3?`Stop after current track`:`Repeat: off`),vi=x(_i,1,`dj-crossfader svelte-1o4jdf5`,null,vi,{"fader-flash":j(Nn),"fader-fried":j(jn)>=10}),bi=x(yi,1,`fader-label left-label flex items-center gap-1 svelte-1o4jdf5`,null,bi,{active:!K.isInstrumental}),Ci=x(Si,1,`dj-fader-knob svelte-1o4jdf5`,null,Ci,{right:K.isInstrumental,"knob-jiggle":j(Mn),fried:j(jn)>=10}),Ti=x(wi,1,`fader-label right-label flex items-center gap-1 svelte-1o4jdf5`,null,Ti,{active:K.isInstrumental}),ji=x(Ai,1,`ctrl ctrl-xs svelte-1o4jdf5`,null,ji,{"active-ctrl":j(B)}),x(Ni,1,`w-[90px] h-[20px] flex items-center justify-center rounded text-[9px] font-bold transition-all font-mono uppercase tracking-wider select-none cursor-pointer
                      ${j(B)?`bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/25 active:scale-95`:`bg-transparent border border-white/5 text-white/20 hover:text-white/40 hover:border-white/10`}`,`svelte-1o4jdf5`),V(Ni,`title`,j(B)?`Click to cycle presets`:`Click to enable visualizer`),O(Pi,ve[j(U)].name),Vi=x(Bi,1,`tracklist-side svelte-1o4jdf5`,null,Vi,{"show-mobile":j(w)}),O(Ji,j(X).length)},[function(){return Oe(je.musicPalette)},function(){return kn(K.currentTime)},function(){return kn(K.duration)}]),P(`click`,qn,_),P(`click`,Jn,function(e){return e.stopPropagation()}),P(`click`,Qn,function(){var e,t=[...arguments];(e=ke)==null||e.apply(this,t)}),P(`click`,tr,function(){var e,n=[...arguments];(e=t.onClose)==null||e.apply(this,n)}),P(`click`,hr,Dn),P(`click`,_r,function(e){return Pt(e,j(Z))}),be(Dr,`clientWidth`,function(e){return b(_t,e)}),be(Tr,`clientWidth`,function(e){return b(gt,e)}),be(Mr,`clientWidth`,function(e){return b(Ct,e)}),be(Ar,`clientWidth`,function(e){return b(vt,e)}),be(Lr,`clientWidth`,function(e){return b(Tt,e)}),be(Fr,`clientWidth`,function(e){return b(wt,e)}),P(`input`,Kr,function(e){K.seek(parseFloat(e.target.value))}),P(`change`,Kr,function(e){K.isPlaying||K.play(parseFloat(e.target.value))}),P(`click`,Xr,function(){return K.setShuffle(!K.isShuffled)}),P(`click`,$r,function(){return K.prevTrack()}),P(`click`,ti,function(){return K.togglePlay()}),P(`click`,ci,function(){return K.nextTrack()}),P(`click`,ui,function(){return K.cycleRepeat()}),P(`click`,_i,On),P(`click`,Ai,function(){b(B,!j(B))}),P(`click`,Ni,function(){j(B)?b(U,(j(U)+1)%ve.length):b(B,!0)}),P(`click`,Ii,function(){b(D,!j(D))}),P(`click`,Ui,function(){b(w,!1)}),re(Xi,function(){return j(y)},function(e){return b(y,e)}),te(1,ir,function(){return Ye},function(){return{duration:120,delay:120}}),te(2,ir,function(){return Ye},function(){return{duration:120}}),C(e,qn),ce()}return e(`default`,En),{setters:[function(e){r=e.o},function(e){i=e.$,o=e.At,c=e.Bt,l=e.C,d=e.D,f=e.Ft,h=e.G,g=e.H,_=e.Ht,ee=e.J,v=e.K,te=e.L,b=e.Lt,x=e.M,S=e.Mt,ne=e.Nt,re=e.O,ie=e.Ot,C=e.Q,ae=e.Qt,w=e.St,T=e.Tt,oe=e.U,E=e.V,se=e.W,D=e.Wt,O=e.X,ce=e.Zt,le=e._,k=e.a,ue=e.at,A=e.c,j=e.dt,M=e.et,de=e.h,fe=e.ht,N=e.in,P=e.it,pe=e.j,F=e.jt,me=e.k,I=e.kt,he=e.n,L=e.o,R=e.on,ge=e.q,z=e.qt,_e=e.rn,ve=e.rt,ye=e.st,B=e.ut,be=e.v,V=e.w,H=e.wt,U=e.x,W=e.xt,G=e.zt},function(e){xe=e.n},function(e){Se=e.a,Ce=e.c,we=e.i,Te=e.l,Ee=e.o,K=e.r,De=e.s},function(e){Oe=e.d,ke=e.f,Ae=e.m,je=e.s},function(e){Me=e.n,Ne=e.t},function(e){Pe=e.t},function(e){Fe=e.t},function(e){Ie=e.t},function(e){Le=e.t},function(e){Re=e.t},function(e){ze=e.t},function(e){Be=e.t},function(e){Ve=e.t},function(e){He=e.t},function(e){Ue=e.t},function(e){We=e.r,Ge=e.t},function(e){Ke=e.t},function(e){qe=e.t},function(e){Je=e.t},function(e){Ye=e.n,Xe=e.t},function(e){Ze=e.B,Qe=e.Er,$e=e.Qi,et=e.U,tt=e.ar,nt=e.ir},function(e){rt=e.t},function(e){q=e.t}],execute:function(){J=document.createElement(`style`),J.textContent=`@-webkit-keyframes svelte-6h1e9g-trophyFloat{0%{transform:translateY(0)scale(1)}to{transform:translateY(-3px)scale(1.04)}}@keyframes svelte-6h1e9g-trophyFloat{0%{transform:translateY(0)scale(1)}to{transform:translateY(-3px)scale(1.04)}}@-webkit-keyframes svelte-6h1e9g-pulseGlow{0%{box-shadow:0 0 4px rgba(239,68,68,.1)}to{box-shadow:0 0 12px rgba(239,68,68,.35)}}@keyframes svelte-6h1e9g-pulseGlow{0%{box-shadow:0 0 4px rgba(239,68,68,.1)}to{box-shadow:0 0 12px rgba(239,68,68,.35)}}@-webkit-keyframes svelte-6h1e9g-searchPulse{0%{border-color:rgba(var(--color-neon-gold,#e6b900), .4)}to{border-color:rgba(var(--color-neon-gold,#e6b900), .95)}}@keyframes svelte-6h1e9g-searchPulse{0%{border-color:rgba(var(--color-neon-gold,#e6b900), .4)}to{border-color:rgba(var(--color-neon-gold,#e6b900), .95)}}@-webkit-keyframes svelte-6h1e9g-flashGlow{0%,to{border-color:var(--border-light,rgba(255,255,255,.05));box-shadow:none}50%{border-color:rgba(var(--color-neon-red,#f34), .8);box-shadow:0 0 20px rgba(var(--color-neon-red,#f34), .35)}}@keyframes svelte-6h1e9g-flashGlow{0%,to{border-color:var(--border-light,rgba(255,255,255,.05));box-shadow:none}50%{border-color:rgba(var(--color-neon-red,#f34), .8);box-shadow:0 0 20px rgba(var(--color-neon-red,#f34), .35)}}.deck-btn.svelte-6h1e9g{color:rgba(255,255,255,.7);border-radius:6px;flex-shrink:0;justify-content:center;align-items:center;width:30px;height:30px;transition:background .15s,color .15s;display:flex}.deck-btn.svelte-6h1e9g:hover{color:#fff;background:rgba(255,255,255,.08)}.deck-btn.svelte-6h1e9g:focus-visible{color:#fff;background:rgba(255,255,255,.08)}.deck-btn-on.svelte-6h1e9g{color:var(--color-neon-green,#00d75f)}@media (min-width:1536px){.deck-btn.svelte-6h1e9g{width:44px;height:44px}}@-webkit-keyframes svelte-1o4jdf5-trophyFloat{0%{transform:translateY(0)scale(1)}to{transform:translateY(-3px)scale(1.04)}}@keyframes svelte-1o4jdf5-trophyFloat{0%{transform:translateY(0)scale(1)}to{transform:translateY(-3px)scale(1.04)}}@-webkit-keyframes svelte-1o4jdf5-pulseGlow{0%{box-shadow:0 0 4px rgba(239,68,68,.1)}to{box-shadow:0 0 12px rgba(239,68,68,.35)}}@keyframes svelte-1o4jdf5-pulseGlow{0%{box-shadow:0 0 4px rgba(239,68,68,.1)}to{box-shadow:0 0 12px rgba(239,68,68,.35)}}@-webkit-keyframes svelte-1o4jdf5-searchPulse{0%{border-color:rgba(var(--color-neon-gold,#e6b900), .4)}to{border-color:rgba(var(--color-neon-gold,#e6b900), .95)}}@keyframes svelte-1o4jdf5-searchPulse{0%{border-color:rgba(var(--color-neon-gold,#e6b900), .4)}to{border-color:rgba(var(--color-neon-gold,#e6b900), .95)}}@-webkit-keyframes svelte-1o4jdf5-flashGlow{0%,to{border-color:var(--border-light,rgba(255,255,255,.05));box-shadow:none}50%{border-color:rgba(var(--color-neon-red,#f34), .8);box-shadow:0 0 20px rgba(var(--color-neon-red,#f34), .35)}}@keyframes svelte-1o4jdf5-flashGlow{0%,to{border-color:var(--border-light,rgba(255,255,255,.05));box-shadow:none}50%{border-color:rgba(var(--color-neon-red,#f34), .8);box-shadow:0 0 20px rgba(var(--color-neon-red,#f34), .35)}}.mp-backdrop.svelte-1o4jdf5{z-index:1000;-webkit-backdrop-filter:blur(12px);background:rgba(0,0,0,.55);justify-content:center;align-items:center;display:flex;position:fixed;top:0;bottom:0;left:0;right:0}.mp-container.svelte-1o4jdf5{-webkit-backdrop-filter:blur(24px)saturate(180%);--mp-vox-rgb:230, 185, 0;--mp-ins-rgb:255, 236, 170;--mp-deep-rgb:255, 122, 0;--mp-ink-rgb:8, 8, 10;--mp-accent-rgb:var(--mp-vox-rgb);--glow-color:rgba(var(--mp-accent-rgb), .85);--glow-light:rgba(var(--mp-accent-rgb), .6);--badge-bg:rgba(var(--mp-accent-rgb), .13);--badge-border:rgba(var(--mp-accent-rgb), .28);--badge-text:rgba(var(--mp-accent-rgb), .9);--badge-bg-hover:rgba(var(--mp-accent-rgb), .22);--badge-border-hover:rgba(var(--mp-accent-rgb), .45);--active-row-bg:rgba(var(--mp-accent-rgb), .07);--active-btn-text:rgba(var(--mp-accent-rgb), .9);--active-title:rgba(var(--mp-accent-rgb), .95);--play-gradient-start:rgba(var(--mp-accent-rgb), .95);--play-gradient-end:rgba(var(--mp-deep-rgb), .95);--play-glow:rgba(var(--mp-accent-rgb), .4);--play-ink:rgb(var(--mp-ink-rgb));--progress-gradient-start:rgba(var(--mp-accent-rgb), .9);--progress-gradient-end:rgba(var(--mp-deep-rgb), .8);background:rgba(7,7,11,.94);border:1px solid rgba(255,255,255,.07);border-radius:22px;flex-direction:column;width:94vw;max-width:1080px;height:90vh;max-height:820px;-webkit-animation:.38s cubic-bezier(.16,1,.3,1) forwards svelte-1o4jdf5-mpIn;animation:.38s cubic-bezier(.16,1,.3,1) forwards svelte-1o4jdf5-mpIn;display:flex;overflow:hidden;box-shadow:0 40px 100px rgba(0,0,0,.9),inset 0 1px rgba(255,255,255,.06)}.mp-container.theme-inst.svelte-1o4jdf5{--mp-accent-rgb:var(--mp-ins-rgb)}.mp-container.closing.svelte-1o4jdf5{-webkit-animation:.3s cubic-bezier(.4,0,1,1) forwards svelte-1o4jdf5-mpOut;animation:.3s cubic-bezier(.4,0,1,1) forwards svelte-1o4jdf5-mpOut}@-webkit-keyframes svelte-1o4jdf5-mpIn{0%{opacity:0;transform:translateY(28px)scale(.97)}to{opacity:1;transform:none}}@keyframes svelte-1o4jdf5-mpIn{0%{opacity:0;transform:translateY(28px)scale(.97)}to{opacity:1;transform:none}}@-webkit-keyframes svelte-1o4jdf5-mpOut{0%{opacity:1;transform:none}to{opacity:0;transform:translateY(18px)scale(.97)}}@keyframes svelte-1o4jdf5-mpOut{0%{opacity:1;transform:none}to{opacity:0;transform:translateY(18px)scale(.97)}}.mp-body.svelte-1o4jdf5{flex:1;grid-template-rows:1fr;grid-template-columns:1fr;display:grid;overflow:hidden}.mp-body.svelte-1o4jdf5>:where(.svelte-1o4jdf5){grid-area:1/1;width:100%;min-width:0;height:100%;min-height:0}.songs-layout.svelte-1o4jdf5{height:100%;display:flex;overflow:hidden}.player-side.svelte-1o4jdf5{background:rgba(0,0,0,.12);border-right:1px solid rgba(255,255,255,.05);flex-direction:column;flex-shrink:0;align-items:center;gap:13px;width:320px;min-width:260px;padding:22px 18px 16px;display:flex;overflow-x:hidden;overflow-y:auto}.player-top-block.svelte-1o4jdf5{flex-direction:column;align-items:center;width:100%;min-width:0;display:flex}.vinyl-wrapper.svelte-1o4jdf5{flex-shrink:0;width:210px;height:210px;position:relative}.vinyl-record.svelte-1o4jdf5{background:repeating-radial-gradient(circle,rgba(255,255,255,.07) 0,rgba(255,255,255,.07) .6px,transparent .6px,transparent 2.4px),radial-gradient(circle,transparent 44%,#060607 44.4%,#060607 45.4%,transparent 45.8%,transparent 59%,#060607 59.4%,#060607 60.4%,transparent 60.8%,transparent 77%,#060607 77.4%,#060607 78.2%,transparent 78.6%),radial-gradient(circle,#060607 0%,#060607 24%,#19191c 25%,#19191c 95.5%,#060607 96.5%,#060607 100%);border-radius:50%;justify-content:center;align-items:center;width:210px;height:210px;-webkit-animation:2.6s linear infinite paused svelte-1o4jdf5-vspin;animation:2.6s linear infinite paused svelte-1o4jdf5-vspin;display:flex;position:relative;box-shadow:0 0 0 1px rgba(255,255,255,.06),0 10px 44px rgba(0,0,0,.9),inset 0 0 0 2px rgba(0,0,0,.6),inset 0 0 26px rgba(0,0,0,.55)}.vinyl-record.spinning.svelte-1o4jdf5{box-shadow:0 0 0 1px rgba(255,255,255,.06), 0 10px 44px rgba(0,0,0,.9), 0 0 46px -14px var(--glow-light,transparent), inset 0 0 0 2px rgba(0,0,0,.6), inset 0 0 26px rgba(0,0,0,.55);-webkit-animation-play-state:running;animation-play-state:running}.vinyl-record-clicker.svelte-1o4jdf5{position:relative}.vinyl-record-clicker.svelte-1o4jdf5:after{content:"";pointer-events:none;z-index:4;background:conic-gradient(from 28deg,transparent 0deg,rgba(255,255,255,.24) 16deg,transparent 40deg,transparent 180deg,rgba(255,255,255,.12) 198deg,transparent 222deg,transparent 360deg);border-radius:50%;position:absolute;top:0;bottom:0;left:0;right:0;-webkit-mask-image:radial-gradient(circle,transparent 24%,#000 25.5%,#000 96%,transparent 97%);mask-image:radial-gradient(circle,transparent 24%,#000 25.5%,#000 96%,transparent 97%)}@-webkit-keyframes svelte-1o4jdf5-vspin{to{transform:rotate(360deg)}}@keyframes svelte-1o4jdf5-vspin{to{transform:rotate(360deg)}}.vinyl-wrapper.deck-glitch.svelte-1o4jdf5>:where(.svelte-1o4jdf5){-webkit-animation:3.4s step-end infinite svelte-1o4jdf5-deck-glitch-jolt;animation:3.4s step-end infinite svelte-1o4jdf5-deck-glitch-jolt}.vinyl-wrapper.deck-glitch.svelte-1o4jdf5 .vinyl-record:where(.svelte-1o4jdf5){-webkit-animation:.42s steps(2,end) infinite svelte-1o4jdf5-deck-stuck;animation:.42s steps(2,end) infinite svelte-1o4jdf5-deck-stuck}.vinyl-wrapper.deck-glitch.svelte-1o4jdf5:after{content:"";z-index:20;pointer-events:none;mix-blend-mode:screen;background:linear-gradient(transparent 0,transparent 46%,rgba(255,40,80,.28) 46%,rgba(255,40,80,.28) 49%,transparent 49%),repeating-linear-gradient(0deg,rgba(0,0,0,.28) 0,rgba(0,0,0,.28) 1px,transparent 1px,transparent 3px);-webkit-animation:3.4s step-end infinite svelte-1o4jdf5-deck-glitch-tear;animation:3.4s step-end infinite svelte-1o4jdf5-deck-glitch-tear;position:absolute;top:0;bottom:0;left:0;right:0}@-webkit-keyframes svelte-1o4jdf5-deck-stuck{0%{transform:rotate(-3deg)}50%{transform:rotate(4deg)}}@keyframes svelte-1o4jdf5-deck-stuck{0%{transform:rotate(-3deg)}50%{transform:rotate(4deg)}}@-webkit-keyframes svelte-1o4jdf5-deck-glitch-jolt{0%{-webkit-filter:drop-shadow(5px 0 rgba(255,0,70,.75))drop-shadow(-5px 0 rgba(0,240,255,.75));filter:drop-shadow(5px 0 rgba(255,0,70,.75))drop-shadow(-5px 0 rgba(0,240,255,.75));transform:translate(-5px,1px)skew(-6deg)}3%{-webkit-filter:drop-shadow(-7px 0 rgba(255,0,70,.75))drop-shadow(7px 0 rgba(0,240,255,.75))saturate(2.2);filter:drop-shadow(-7px 0 rgba(255,0,70,.75))drop-shadow(7px 0 rgba(0,240,255,.75))saturate(2.2);transform:translate(6px,-2px)skew(9deg)}6%{-webkit-filter:drop-shadow(3px 0 rgba(255,0,70,.7))drop-shadow(-3px 0 rgba(0,240,255,.7))hue-rotate(80deg);filter:drop-shadow(3px 0 rgba(255,0,70,.7))drop-shadow(-3px 0 rgba(0,240,255,.7))hue-rotate(80deg);transform:translate(-3px,3px)scaleY(.94)}9%{-webkit-filter:drop-shadow(-4px 0 rgba(255,0,70,.75))drop-shadow(4px 0 rgba(0,240,255,.75))contrast(1.6);filter:drop-shadow(-4px 0 rgba(255,0,70,.75))drop-shadow(4px 0 rgba(0,240,255,.75))contrast(1.6);transform:translate(4px)skew(-12deg)}12%{-webkit-filter:drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6));filter:drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6));transform:translate(-2px,-1px)}15%{-webkit-filter:grayscale(.55)brightness(.8);filter:grayscale(.55)brightness(.8);transform:none}62%{-webkit-filter:drop-shadow(-4px 0 rgba(255,0,70,.7))drop-shadow(4px 0 rgba(0,240,255,.7));filter:drop-shadow(-4px 0 rgba(255,0,70,.7))drop-shadow(4px 0 rgba(0,240,255,.7));transform:translate(3px)skew(5deg)}65%{-webkit-filter:drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6))grayscale(.4);filter:drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6))grayscale(.4);transform:translate(-2px,1px)}68%,to{-webkit-filter:grayscale(.55)brightness(.8);filter:grayscale(.55)brightness(.8);transform:none}}@keyframes svelte-1o4jdf5-deck-glitch-jolt{0%{-webkit-filter:drop-shadow(5px 0 rgba(255,0,70,.75))drop-shadow(-5px 0 rgba(0,240,255,.75));filter:drop-shadow(5px 0 rgba(255,0,70,.75))drop-shadow(-5px 0 rgba(0,240,255,.75));transform:translate(-5px,1px)skew(-6deg)}3%{-webkit-filter:drop-shadow(-7px 0 rgba(255,0,70,.75))drop-shadow(7px 0 rgba(0,240,255,.75))saturate(2.2);filter:drop-shadow(-7px 0 rgba(255,0,70,.75))drop-shadow(7px 0 rgba(0,240,255,.75))saturate(2.2);transform:translate(6px,-2px)skew(9deg)}6%{-webkit-filter:drop-shadow(3px 0 rgba(255,0,70,.7))drop-shadow(-3px 0 rgba(0,240,255,.7))hue-rotate(80deg);filter:drop-shadow(3px 0 rgba(255,0,70,.7))drop-shadow(-3px 0 rgba(0,240,255,.7))hue-rotate(80deg);transform:translate(-3px,3px)scaleY(.94)}9%{-webkit-filter:drop-shadow(-4px 0 rgba(255,0,70,.75))drop-shadow(4px 0 rgba(0,240,255,.75))contrast(1.6);filter:drop-shadow(-4px 0 rgba(255,0,70,.75))drop-shadow(4px 0 rgba(0,240,255,.75))contrast(1.6);transform:translate(4px)skew(-12deg)}12%{-webkit-filter:drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6));filter:drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6));transform:translate(-2px,-1px)}15%{-webkit-filter:grayscale(.55)brightness(.8);filter:grayscale(.55)brightness(.8);transform:none}62%{-webkit-filter:drop-shadow(-4px 0 rgba(255,0,70,.7))drop-shadow(4px 0 rgba(0,240,255,.7));filter:drop-shadow(-4px 0 rgba(255,0,70,.7))drop-shadow(4px 0 rgba(0,240,255,.7));transform:translate(3px)skew(5deg)}65%{-webkit-filter:drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6))grayscale(.4);filter:drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6))grayscale(.4);transform:translate(-2px,1px)}68%,to{-webkit-filter:grayscale(.55)brightness(.8);filter:grayscale(.55)brightness(.8);transform:none}}@-webkit-keyframes svelte-1o4jdf5-deck-glitch-tear{0%{opacity:1;transform:translateY(-38%)}3%{transform:translateY(24%)}6%{transform:translateY(-12%)}9%{transform:translateY(36%)}12%{transform:translateY(4%)}15%{opacity:.25;transform:translateY(0)}62%{opacity:1;transform:translateY(-20%)}65%{transform:translateY(30%)}68%,to{opacity:.25;transform:translateY(0)}}@keyframes svelte-1o4jdf5-deck-glitch-tear{0%{opacity:1;transform:translateY(-38%)}3%{transform:translateY(24%)}6%{transform:translateY(-12%)}9%{transform:translateY(36%)}12%{transform:translateY(4%)}15%{opacity:.25;transform:translateY(0)}62%{opacity:1;transform:translateY(-20%)}65%{transform:translateY(30%)}68%,to{opacity:.25;transform:translateY(0)}}@media (prefers-reduced-motion:reduce){.vinyl-wrapper.deck-glitch.svelte-1o4jdf5:after{-webkit-animation:none;animation:none}.vinyl-wrapper.deck-glitch.svelte-1o4jdf5>:where(.svelte-1o4jdf5){-webkit-animation:none;animation:none}.vinyl-wrapper.deck-glitch.svelte-1o4jdf5 .vinyl-record:where(.svelte-1o4jdf5){-webkit-animation:none;animation:none}.vinyl-wrapper.deck-glitch.svelte-1o4jdf5>:where(.svelte-1o4jdf5){-webkit-filter:grayscale(.55)brightness(.8)drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6));filter:grayscale(.55)brightness(.8)drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6))}}.groove.svelte-1o4jdf5{pointer-events:none;border:1px solid rgba(255,255,255,.03);border-radius:50%;position:absolute}.g1.svelte-1o4jdf5{width:72%;height:72%}.g2.svelte-1o4jdf5{width:56%;height:56%}.g3.svelte-1o4jdf5{border-color:rgba(255,255,255,.024);width:40%;height:40%}.g4.svelte-1o4jdf5{border-color:rgba(255,255,255,.02);width:86%;height:86%}.record-label.svelte-1o4jdf5{z-index:2;width:88px;height:88px;box-shadow:0 0 0 1px rgba(0,0,0,.8), 0 0 0 3px var(--badge-border,transparent), 0 2px 14px rgba(0,0,0,.65);background:#111;border:2px solid rgba(255,255,255,.1);border-radius:50%;position:relative;overflow:hidden}.record-art.svelte-1o4jdf5{object-fit:cover;opacity:0;width:100%;height:100%;transition:opacity .4s}.record-art.loaded.svelte-1o4jdf5{opacity:1}.spindle.svelte-1o4jdf5{z-index:3;background:radial-gradient(circle at 35% 30%,#fff 0%,#999 35%,#333 100%);border-radius:50%;width:7px;height:7px;position:absolute;box-shadow:0 0 0 1.5px rgba(0,0,0,.85),0 1px 4px rgba(0,0,0,.8)}.tonearm.svelte-1o4jdf5{transform-origin:top;z-index:5;background:linear-gradient(#888 0%,#555 60%,#333 100%);border-radius:2px;width:4px;height:96px;transition:transform .9s cubic-bezier(.4,0,.2,1);position:absolute;top:6px;right:-6px;transform:rotate(-15deg);box-shadow:0 2px 8px rgba(0,0,0,.5)}.tonearm.svelte-1o4jdf5:after{content:"";background:var(--glow-color,rgba(230,185,0,.85));width:8px;height:8px;box-shadow:0 0 8px var(--glow-light,rgba(230,185,0,.6));border-radius:50%;position:absolute;bottom:-4px;left:-2px}.tonearm.playing.svelte-1o4jdf5{transform:rotate(22deg)}.track-info.svelte-1o4jdf5{text-align:center;width:100%;min-width:0;overflow:hidden}.scroll-container.svelte-1o4jdf5{white-space:nowrap;text-align:center;width:100%;overflow:hidden}.scroll-container.overflowing.svelte-1o4jdf5{text-align:left}.scroll-text.svelte-1o4jdf5{white-space:nowrap;display:inline-block}.scroll-text.animate-scroll.svelte-1o4jdf5{-webkit-animation:8s linear infinite alternate svelte-1o4jdf5-scroll-text;animation:8s linear infinite alternate svelte-1o4jdf5-scroll-text}@-webkit-keyframes svelte-1o4jdf5-scroll-text{0%,15%{transform:translate(0)}85%,to{transform:translateX(var(--scroll-dist))}}@keyframes svelte-1o4jdf5-scroll-text{0%,15%{transform:translate(0)}85%,to{transform:translateX(var(--scroll-dist))}}.track-title.svelte-1o4jdf5{letter-spacing:.06em;color:rgba(255,255,255,.94);margin:0 0 4px;font-family:Outfit,Inter,sans-serif;font-size:1.2rem;font-weight:800}.track-artist.svelte-1o4jdf5{color:rgba(255,255,255,.55);margin:0 0 2px;font-family:Inter,sans-serif;font-size:.82rem}.track-album.svelte-1o4jdf5{color:rgba(255,255,255,.28);text-transform:uppercase;letter-spacing:.06em;margin:0;font-family:Outfit,monospace;font-size:.68rem}.tr-share-btn.svelte-1o4jdf5,.tr-download-btn.svelte-1o4jdf5{color:rgba(255,255,255,.45);cursor:pointer;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:6px;flex-shrink:0;justify-content:center;align-items:center;width:24px;height:24px;transition:all .2s;display:flex}.tr-share-btn.svelte-1o4jdf5:hover,.tr-download-btn.svelte-1o4jdf5:hover{color:rgba(255,255,255,.9);background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.16)}.player-share-btn.svelte-1o4jdf5,.player-download-btn.svelte-1o4jdf5{background:var(--badge-bg,rgba(230,185,0,.13));border:1px solid var(--badge-border,rgba(230,185,0,.28));width:22px;height:22px;color:var(--badge-text,rgba(230,185,0,.9));cursor:pointer;border-radius:50%;flex-shrink:0;justify-content:center;align-items:center;transition:all .2s;display:flex}.player-share-btn.svelte-1o4jdf5:hover,.player-download-btn.svelte-1o4jdf5:hover{background:var(--badge-bg-hover,rgba(230,185,0,.22));color:rgb(var(--mp-accent-rgb,230, 185, 0));border-color:var(--badge-border-hover,rgba(230,185,0,.45))}.player-tether.svelte-1o4jdf5{flex-shrink:0;display:flex;position:relative}.player-tether-btn.svelte-1o4jdf5{background:var(--bg-input,rgba(255,255,255,.04));border:1px solid var(--color-neon-green,#00d75f);width:22px;height:22px;color:var(--color-neon-green,#00d75f);cursor:pointer;border-radius:50%;flex-shrink:0;justify-content:center;align-items:center;display:flex}.player-tether-hint.svelte-1o4jdf5{background:var(--bg-app,#050508);border:1px solid var(--color-neon-green,#00d75f);color:#fff;text-align:left;z-index:20;pointer-events:none;border-radius:8px;width:240px;max-width:70vw;padding:8px 10px;font-size:.7rem;line-height:1.4;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translate(-50%)}.tr-download-btn.downloading.svelte-1o4jdf5,.player-download-btn.downloading.svelte-1o4jdf5{pointer-events:none;-webkit-animation:1s ease-in-out infinite svelte-1o4jdf5-download-pulse;animation:1s ease-in-out infinite svelte-1o4jdf5-download-pulse}@-webkit-keyframes svelte-1o4jdf5-download-pulse{50%{opacity:.35}}@keyframes svelte-1o4jdf5-download-pulse{50%{opacity:.35}}.progress-row.svelte-1o4jdf5{align-items:center;gap:8px;width:100%;display:flex}.ptime.svelte-1o4jdf5{color:rgba(255,255,255,.3);text-align:center;min-width:28px;font-family:monospace;font-size:.65rem}.progress-wrap.svelte-1o4jdf5{cursor:pointer;background:rgba(255,255,255,.1);border-radius:3px;flex:1;height:3px;position:relative}.seek-input.svelte-1o4jdf5{opacity:0;cursor:pointer;width:100%;height:24px;margin:0;position:absolute;top:-10px;bottom:-10px;left:0;right:0}.controls-row.svelte-1o4jdf5{justify-content:center;align-items:center;gap:10px;width:100%;display:flex}.ctrl.svelte-1o4jdf5{color:rgba(255,255,255,.5);cursor:pointer;background:0 0;border:none;border-radius:50%;justify-content:center;align-items:center;padding:0;transition:all .15s;display:flex}.ctrl.svelte-1o4jdf5:hover{color:rgba(255,255,255,.9);transform:scale(1.1)}.ctrl.svelte-1o4jdf5:active{transform:scale(.95)}.ctrl-xs.svelte-1o4jdf5{width:26px;height:26px}.ctrl-sm.svelte-1o4jdf5{width:30px;height:30px}.ctrl-md.svelte-1o4jdf5{color:rgba(255,255,255,.72);width:38px;height:38px}.ctrl-md.svelte-1o4jdf5:hover{color:#fff}.ctrl-play.svelte-1o4jdf5{color:var(--play-ink,#fff);width:54px;height:54px;background:linear-gradient(135deg, var(--play-gradient-start,rgba(230,185,0,.92)) 0%, var(--play-gradient-end,rgba(255,122,0,.92)) 100%);box-shadow:0 4px 22px var(--play-glow,rgba(230,185,0,.5));border-radius:50%;transition:all .2s}.ctrl-play.ctrl-error.svelte-1o4jdf5{color:#050508;background:linear-gradient(135deg,#f59e0b 0%,#d97706 100%);box-shadow:0 4px 22px rgba(245,158,11,.5)}.ctrl-play.ctrl-error.svelte-1o4jdf5:hover{transform:scale(1.07);box-shadow:0 6px 30px rgba(245,158,11,.7)}.ctrl-play.svelte-1o4jdf5:active{transform:scale(.97)}.active-ctrl.svelte-1o4jdf5{color:var(--active-btn-text,rgba(230,185,0,.9))!important}.spin-ring.svelte-1o4jdf5{border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;width:18px;height:18px;-webkit-animation:.7s linear infinite svelte-1o4jdf5-sr;animation:.7s linear infinite svelte-1o4jdf5-sr}@-webkit-keyframes svelte-1o4jdf5-sr{to{transform:rotate(360deg)}}@keyframes svelte-1o4jdf5-sr{to{transform:rotate(360deg)}}.tracklist-side.svelte-1o4jdf5{flex-direction:column;flex:1;min-width:0;display:flex;overflow:hidden}.tl-header.svelte-1o4jdf5{letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.28);border-bottom:1px solid rgba(255,255,255,.05);flex-shrink:0;align-items:center;gap:7px;padding:14px 22px 10px;font-family:Outfit,monospace;font-size:.68rem;font-weight:700;display:flex}.tl-count.svelte-1o4jdf5{background:rgba(255,255,255,.07);border-radius:10px;margin-left:auto;padding:2px 8px;font-size:.62rem}.tracklist.svelte-1o4jdf5{flex:1;padding:6px 0;overflow-y:auto}.track-row.svelte-1o4jdf5{cursor:pointer;align-items:center;gap:12px;padding:10px 22px;transition:background .14s;display:flex;position:relative}.track-row.svelte-1o4jdf5:hover,.track-row.kb-focused.svelte-1o4jdf5{background:rgba(255,255,255,.04)}.track-row.kb-focused.svelte-1o4jdf5{outline-offset:-3px;outline:1px dashed rgba(255,255,255,.25)}.track-row.fetch-error.svelte-1o4jdf5{background:rgba(245,158,11,.03);border-left:3px solid rgba(245,158,11,.4)}.track-row.fetch-error.svelte-1o4jdf5:hover,.track-row.fetch-error.kb-focused.svelte-1o4jdf5{background:rgba(245,158,11,.06)}.track-row.fetch-error.svelte-1o4jdf5 .tr-title:where(.svelte-1o4jdf5){color:#f59e0b!important}.track-row.active.fetch-error.svelte-1o4jdf5{background:rgba(245,158,11,.1)!important}.track-row.active.fetch-error.svelte-1o4jdf5:before{background:#f59e0b!important}.track-row.active.svelte-1o4jdf5{background:var(--active-row-bg,rgba(230,185,0,.07))}.track-row.active.svelte-1o4jdf5:before{content:"";background:linear-gradient(to bottom, var(--glow-color,rgba(230,185,0,.9)), var(--progress-gradient-end,rgba(255,122,0,.7)));border-radius:0 2px 2px 0;width:3px;position:absolute;top:0;bottom:0;left:0}.tr-num.svelte-1o4jdf5{text-align:center;color:rgba(255,255,255,.28);flex-shrink:0;width:18px;font-family:monospace;font-size:.72rem}.tr-art.svelte-1o4jdf5{object-fit:cover;background:rgba(255,255,255,.05);border-radius:6px;flex-shrink:0;width:42px;height:42px}.tr-info.svelte-1o4jdf5{flex-direction:column;flex:1;gap:2px;min-width:0;display:flex}.tr-title.svelte-1o4jdf5{color:rgba(255,255,255,.86);white-space:nowrap;text-overflow:ellipsis;font-family:Outfit,Inter,sans-serif;font-size:.86rem;font-weight:600;overflow:hidden}.track-row.active.svelte-1o4jdf5 .tr-title:where(.svelte-1o4jdf5){color:var(--active-title,rgba(230,185,0,.95))}.tr-meta.svelte-1o4jdf5{color:rgba(255,255,255,.33);white-space:nowrap;text-overflow:ellipsis;font-family:Inter,sans-serif;font-size:.7rem;overflow:hidden}.inst-chip-link.svelte-1o4jdf5{letter-spacing:.1em;color:#22c55e;cursor:pointer;flex-shrink:0;padding:2px;font-size:.56rem;font-weight:700;text-decoration:underline;transition:color .2s}.inst-chip-link.svelte-1o4jdf5:hover{color:#16a34a}.eq.svelte-1o4jdf5{align-items:flex-end;gap:2px;height:15px;display:flex}.eq-b.svelte-1o4jdf5{background:var(--glow-color,rgba(230,185,0,.85));border-radius:1px;width:3px;-webkit-animation:.55s infinite alternate svelte-1o4jdf5-eq;animation:.55s infinite alternate svelte-1o4jdf5-eq}.eq-b.svelte-1o4jdf5:first-child{height:60%;-webkit-animation-delay:0s;animation-delay:0s}.eq-b.svelte-1o4jdf5:nth-child(2){height:100%;-webkit-animation-delay:.15s;animation-delay:.15s}.eq-b.svelte-1o4jdf5:nth-child(3){height:45%;-webkit-animation-delay:.3s;animation-delay:.3s}@-webkit-keyframes svelte-1o4jdf5-eq{0%{transform:scaleY(.35)}to{transform:scaleY(1)}}@keyframes svelte-1o4jdf5-eq{0%{transform:scaleY(.35)}to{transform:scaleY(1)}}.mp-footer.svelte-1o4jdf5{color:rgba(255,255,255,.22);letter-spacing:.06em;background:rgba(0,0,0,.22);border-top:1px solid rgba(255,255,255,.05);flex-shrink:0;justify-content:space-between;align-items:center;height:36px;padding:0 22px;font-family:monospace;font-size:.62rem;display:flex}.mp-status.svelte-1o4jdf5{align-items:center;gap:7px;display:flex}.mp-dot.svelte-1o4jdf5{background:#0f6;border-radius:50%;width:5px;height:5px;box-shadow:0 0 5px rgba(0,255,102,.55)}.scroll-y.svelte-1o4jdf5{overflow-x:hidden;overflow-y:auto}.scroll-y.svelte-1o4jdf5::-webkit-scrollbar{width:4px}.scroll-y.svelte-1o4jdf5::-webkit-scrollbar-track{background:0 0}.scroll-y.svelte-1o4jdf5::-webkit-scrollbar-thumb{background:rgba(255,255,255,.07);border-radius:2px}.scroll-y.svelte-1o4jdf5::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,.16)}@media (min-width:641px) and (max-height:780px){.mp-container.svelte-1o4jdf5{height:96vh}}@media (min-width:641px) and (max-height:760px){.player-side.svelte-1o4jdf5{gap:10px;padding:14px 16px 12px}.vinyl-wrapper.svelte-1o4jdf5,.vinyl-record.svelte-1o4jdf5{width:max(90px,min(96vh - 450px,210px));height:max(90px,min(96vh - 450px,210px))}.record-label.svelte-1o4jdf5{width:42%;height:42%}.tonearm.svelte-1o4jdf5{height:45%}.track-title.svelte-1o4jdf5{font-size:1.05rem}.track-artist.svelte-1o4jdf5,.track-album.svelte-1o4jdf5{font-size:.74rem}.progress-row.svelte-1o4jdf5 .progress-wrap:where(.svelte-1o4jdf5){height:28px}.ctrl-play.svelte-1o4jdf5{width:46px;height:46px}.player-controls-block.svelte-1o4jdf5>div:where(.svelte-1o4jdf5){margin-top:4px}}@media (min-width:641px) and (max-height:560px){.mp-footer.svelte-1o4jdf5{display:none}.player-side.svelte-1o4jdf5{gap:8px;padding:10px 14px 8px}.player-top-block.svelte-1o4jdf5{flex-direction:row;justify-content:center;align-items:center;gap:14px;width:100%}.vinyl-wrapper.svelte-1o4jdf5,.vinyl-record.svelte-1o4jdf5{width:96px;height:96px}.player-top-block.svelte-1o4jdf5 .track-info:where(.svelte-1o4jdf5){flex:1;min-width:0;margin-top:0}.progress-row.svelte-1o4jdf5 .progress-wrap:where(.svelte-1o4jdf5){height:28px}.controls-row.svelte-1o4jdf5{gap:8px}.ctrl-play.svelte-1o4jdf5{width:42px;height:42px}.ctrl-md.svelte-1o4jdf5{width:32px;height:32px}.player-controls-block.svelte-1o4jdf5>div:where(.svelte-1o4jdf5){margin-top:4px}}@media (max-width:640px){.mp-container.svelte-1o4jdf5{border-radius:0;width:100vw;height:100%;max-height:100%}.songs-layout.svelte-1o4jdf5{flex-direction:column;position:relative;overflow:hidden}.player-side.svelte-1o4jdf5{width:100%;min-width:unset;border-bottom:none;border-right:none;flex-direction:column;flex-shrink:0;justify-content:space-between;gap:8px;height:95%;max-height:none;padding:12px 14px;display:flex;overflow:hidden}.player-top-block.svelte-1o4jdf5{flex-direction:column;justify-content:center;align-items:center;height:62%;transition:transform .3s cubic-bezier(.16,1,.3,1),opacity .3s;display:flex}.player-controls-block.svelte-1o4jdf5{flex-direction:column;flex-shrink:0;justify-content:flex-end;gap:8px;height:38%;display:flex}.vinyl-wrapper.svelte-1o4jdf5,.vinyl-record.svelte-1o4jdf5{width:130px;height:130px}.record-label.svelte-1o4jdf5{width:52px;height:52px}.tonearm.svelte-1o4jdf5{height:70px}.tracklist-side.svelte-1o4jdf5{z-index:20;opacity:0;pointer-events:none;background:rgba(7,7,11,.98);border-bottom:1px solid rgba(255,255,255,.08);transition:transform .3s cubic-bezier(.16,1,.3,1),opacity .3s;position:absolute;top:0;left:0;right:0;transform:translateY(-100%);box-shadow:0 10px 30px rgba(0,0,0,.5);width:100%!important;height:62%!important;display:flex!important}.tracklist-side.show-mobile.svelte-1o4jdf5{opacity:1;pointer-events:auto;transform:translateY(0)}.mobile-close-bar.svelte-1o4jdf5{display:flex!important}.track-title.svelte-1o4jdf5{font-size:1rem}.track-artist.svelte-1o4jdf5,.track-album.svelte-1o4jdf5{font-size:.72rem}.track-info.svelte-1o4jdf5 .scroll-container:where(.svelte-1o4jdf5){cursor:pointer}.ctrl-play.svelte-1o4jdf5{width:46px;height:46px}}.panel-header.svelte-1o4jdf5{background:rgba(0,0,0,.2);border-bottom:1px solid rgba(255,255,255,.06);justify-content:space-between;align-items:center;height:64px;padding:0 24px;display:flex}.brand.svelte-1o4jdf5{align-items:center;gap:12px;display:flex}.brand.svelte-1o4jdf5 h1:where(.svelte-1o4jdf5){letter-spacing:.05em;text-transform:uppercase;color:rgba(255,255,255,.95);margin:0;font-family:Outfit,Inter,sans-serif;font-size:1.1rem;font-weight:700}.close-btn.svelte-1o4jdf5{color:rgba(255,255,255,.5);cursor:pointer;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.06);border-radius:50%;justify-content:center;align-items:center;width:32px;height:32px;transition:all .2s;display:flex}.close-btn.svelte-1o4jdf5:hover{color:#fff;background:rgba(255,255,255,.15);transform:translate(-4px)}.dj-crossfader.svelte-1o4jdf5{cursor:pointer;box-sizing:border-box;-webkit-user-select:none;user-select:none;background:linear-gradient(#1e1e24 0%,#121215 100%);border:1px solid rgba(255,255,255,.08);border-radius:8px;justify-content:space-between;align-items:center;gap:12px;width:100%;height:34px;padding:0 16px;display:flex;position:relative;box-shadow:inset 0 1px rgba(255,255,255,.05),0 8px 24px rgba(0,0,0,.5)}.fader-label.svelte-1o4jdf5{letter-spacing:.05em;color:rgba(255,255,255,.2);font-family:monospace;font-size:.65rem;font-weight:800;transition:color .2s}.fader-label.left-label.active.svelte-1o4jdf5{color:rgb(var(--mp-vox-rgb));text-shadow:0 0 8px rgba(var(--mp-vox-rgb), .4)}.fader-label.right-label.active.svelte-1o4jdf5{color:rgb(var(--mp-ins-rgb));text-shadow:0 0 8px rgba(var(--mp-ins-rgb), .4)}.dj-fader-slot.svelte-1o4jdf5{background:#000;border:1px solid rgba(255,255,255,.06);border-radius:2px;flex:1;height:4px;position:relative}.dj-fader-knob.svelte-1o4jdf5{background:linear-gradient(135deg,#666 0%,#333 50%,#222 100%);border:1px solid rgba(255,255,255,.25);border-radius:3px;justify-content:center;align-items:center;width:24px;height:18px;transition:left .18s cubic-bezier(.25,.8,.25,1);display:flex;position:absolute;top:50%;left:0%;transform:translateY(-50%);box-shadow:0 4px 10px rgba(0,0,0,.8),inset 0 1px rgba(255,255,255,.15)}.dj-fader-knob.svelte-1o4jdf5:after{content:"";background:#fff;width:2px;height:100%;box-shadow:0 0 3px rgba(255,255,255,.8)}.dj-fader-knob.right.svelte-1o4jdf5{left:calc(100% - 24px)}.volume-popover.svelte-1o4jdf5{z-index:50;pointer-events:auto;-webkit-backdrop-filter:blur(8px);background:rgba(15,15,20,.95);border:1px solid rgba(255,255,255,.1);border-radius:20px;align-items:center;gap:8px;min-width:150px;padding:6px 12px;display:flex;position:absolute;bottom:38px;left:50%;transform:translate(-50%);box-shadow:0 10px 25px rgba(0,0,0,.6)}.vol-slider-pop.svelte-1o4jdf5{height:3px;accent-color:rgb(var(--mp-accent-rgb));cursor:pointer;background:rgba(255,255,255,.1);border-radius:2px;outline:none;flex:1}.visualizer-container.svelte-1o4jdf5{background:#050508;border:1px solid rgba(255,255,255,.08);border-radius:50%;flex-direction:column;width:100%;height:100%;transition:border-radius .3s cubic-bezier(.25,.8,.25,1);display:flex;position:relative;overflow:hidden}.visualizer-canvas.svelte-1o4jdf5{z-index:1;width:100%;height:100%;display:block;position:absolute;top:0;bottom:0;left:0;right:0}.visualizer-overlay.svelte-1o4jdf5{z-index:10;justify-content:space-between;align-items:center;gap:8px;display:flex;position:absolute;bottom:16px;left:16px;right:16px}.visualizer-container.fullscreen.svelte-1o4jdf5{z-index:2000;border:none;width:100vw;height:100vh;position:fixed;top:0;bottom:0;left:0;right:0;border-radius:0!important}.visualizer-hover-overlay.svelte-1o4jdf5{opacity:0;background:rgba(0,0,0,.5);border-radius:50%;justify-content:center;align-items:center;transition:opacity .22s;display:flex;position:absolute;top:0;bottom:0;left:0;right:0}.visualizer-container.svelte-1o4jdf5:hover .visualizer-hover-overlay:where(.svelte-1o4jdf5){opacity:1}@-webkit-keyframes svelte-1o4jdf5-knob-wiggle{0%,to{transform:translateY(-50%)scale(1)}20%,60%{transform:translate(-3.5px,-50%)rotate(-4deg)}40%,80%{transform:translate(3.5px,-50%)rotate(4deg)}}@keyframes svelte-1o4jdf5-knob-wiggle{0%,to{transform:translateY(-50%)scale(1)}20%,60%{transform:translate(-3.5px,-50%)rotate(-4deg)}40%,80%{transform:translate(3.5px,-50%)rotate(4deg)}}.knob-jiggle.svelte-1o4jdf5{-webkit-animation:.3s ease-in-out svelte-1o4jdf5-knob-wiggle;animation:.3s ease-in-out svelte-1o4jdf5-knob-wiggle}.dj-fader-knob.fried.svelte-1o4jdf5{background:linear-gradient(135deg,#2c2222 0%,#1a1212 50%,#0f0505 100%)!important;border-color:rgba(239,68,68,.35)!important;box-shadow:0 4px 10px rgba(0,0,0,.9),0 0 8px rgba(239,68,68,.25)!important}.dj-fader-knob.fried.svelte-1o4jdf5:after{-webkit-animation:.15s infinite alternate svelte-1o4jdf5-fader-flicker;animation:.15s infinite alternate svelte-1o4jdf5-fader-flicker;background:#ef4444!important;box-shadow:0 0 5px #ef4444!important}@-webkit-keyframes svelte-1o4jdf5-fader-flicker{0%{opacity:.35}to{opacity:1}}@keyframes svelte-1o4jdf5-fader-flicker{0%{opacity:.35}to{opacity:1}}.dj-crossfader.fader-flash.svelte-1o4jdf5{-webkit-animation:.15s ease-out svelte-1o4jdf5-fader-flash-anim;animation:.15s ease-out svelte-1o4jdf5-fader-flash-anim}@-webkit-keyframes svelte-1o4jdf5-fader-flash-anim{0%{background:#f05;border-color:#fff;box-shadow:0 0 25px rgba(255,0,85,.8)}to{background:linear-gradient(#1e1e24 0%,#121215 100%);border-color:rgba(255,255,255,.08)}}@keyframes svelte-1o4jdf5-fader-flash-anim{0%{background:#f05;border-color:#fff;box-shadow:0 0 25px rgba(255,0,85,.8)}to{background:linear-gradient(#1e1e24 0%,#121215 100%);border-color:rgba(255,255,255,.08)}}.dj-crossfader.fader-fried.svelte-1o4jdf5{border-color:rgba(239,68,68,.25)!important;box-shadow:inset 0 0 8px rgba(239,68,68,.08),0 8px 24px rgba(0,0,0,.5)!important}.fader-fx-canvas.svelte-1o4jdf5{width:100vw;height:100vh;pointer-events:none;z-index:99999;height:100dvh;position:fixed;top:0;left:0}.cassette-tape.svelte-1o4jdf5{box-sizing:border-box;background:linear-gradient(135deg,#1f1f23 0%,#0d0d0f 100%);border:3px solid #2d2d34;border-radius:10px;flex-direction:column;justify-content:space-between;align-items:center;width:200px;height:125px;padding:10px;display:flex;position:relative;box-shadow:0 8px 24px rgba(0,0,0,.6)}@media (min-width:640px){.cassette-tape.svelte-1o4jdf5{border-width:4px;width:240px;height:150px;padding:12px}}.cassette-label.svelte-1o4jdf5{color:#fff;box-sizing:border-box;text-transform:uppercase;border-radius:4px;flex-direction:column;justify-content:center;align-items:center;width:100%;height:38px;padding:2px;font-family:monospace;font-weight:700;display:flex;box-shadow:inset 0 1px rgba(255,255,255,.1)}@media (min-width:640px){.cassette-label.svelte-1o4jdf5{height:46px}}.cassette-track-title.svelte-1o4jdf5{letter-spacing:.05em;white-space:nowrap;text-overflow:ellipsis;max-width:90%;font-size:9px;overflow:hidden}@media (min-width:640px){.cassette-track-title.svelte-1o4jdf5{font-size:11px}}.cassette-brand.svelte-1o4jdf5{opacity:.8;letter-spacing:.1em;margin-top:1px;font-size:7px}@media (min-width:640px){.cassette-brand.svelte-1o4jdf5{margin-top:2px;font-size:8px}}.cassette-window.svelte-1o4jdf5{border:2px solid #3f3f46;border-radius:5px;justify-content:space-around;align-items:center;width:110px;height:40px;margin-top:6px;display:flex;position:relative;overflow:hidden}@media (min-width:640px){.cassette-window.svelte-1o4jdf5{width:130px;height:48px;margin-top:8px}}.spindle-left.svelte-1o4jdf5,.spindle-right.svelte-1o4jdf5{box-sizing:border-box;z-index:5;border:3px dashed #71717a;border-radius:50%;width:18px;height:18px}@media (min-width:640px){.spindle-left.svelte-1o4jdf5,.spindle-right.svelte-1o4jdf5{border-width:4px;width:22px;height:22px}}.spindle-left.spinning.svelte-1o4jdf5,.spindle-right.spinning.svelte-1o4jdf5{-webkit-animation:4s linear infinite svelte-1o4jdf5-rotate-spindle;animation:4s linear infinite svelte-1o4jdf5-rotate-spindle}.tape-roll-left.svelte-1o4jdf5,.tape-roll-right.svelte-1o4jdf5{z-index:1;opacity:.85;border-radius:50%;position:absolute;top:50%;transform:translateY(-50%)}.tape-roll-left.spinning.svelte-1o4jdf5,.tape-roll-right.spinning.svelte-1o4jdf5{-webkit-animation:6s linear infinite svelte-1o4jdf5-rotate-spindle;animation:6s linear infinite svelte-1o4jdf5-rotate-spindle}.tape-roll-left.svelte-1o4jdf5{left:12px;transform:translateY(-50%)}@media (min-width:640px){.tape-roll-left.svelte-1o4jdf5{left:16px}}.tape-roll-right.svelte-1o4jdf5{right:12px;transform:translateY(-50%)}@media (min-width:640px){.tape-roll-right.svelte-1o4jdf5{right:16px}}@-webkit-keyframes svelte-1o4jdf5-rotate-spindle{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes svelte-1o4jdf5-rotate-spindle{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.waveform-slider-wrap.svelte-1o4jdf5{background:rgba(0,0,0,.45);border:1px solid rgba(255,255,255,.1);border-radius:6px;height:36px;transition:border-color .2s,background .2s}.waveform-slider-wrap.svelte-1o4jdf5 .seek-input:where(.svelte-1o4jdf5){margin:0;height:100%!important;top:0!important;bottom:0!important;left:0!important;right:0!important}.waveform-slider-wrap.svelte-1o4jdf5:hover{background:rgba(0,0,0,.55);border-color:rgba(255,255,255,.2)}.waveform-slider-wrap.svelte-1o4jdf5:hover .waveform-bar:where(.svelte-1o4jdf5):not(.active){background-color:rgba(255,255,255,.22)}.waveform-slider-wrap.svelte-1o4jdf5:hover .waveform-bar.active:where(.svelte-1o4jdf5){box-shadow:0 0 8px rgba(0,240,255,.6)}.waveform-bar.svelte-1o4jdf5{background-color:rgba(255,255,255,.12);border-radius:9999px;transition:background-color .2s,background .2s,box-shadow .2s}.waveform-bar.active.svelte-1o4jdf5{background:linear-gradient(#ff007f 0%,#00f0ff 100%);box-shadow:0 0 4px rgba(0,240,255,.4)}.floppy-disk.svelte-1o4jdf5{box-sizing:border-box;-webkit-clip-path:polygon(0 0,88% 0,100% 12%,100% 100%,0 100%);clip-path:polygon(0 0,88% 0,100% 12%,100% 100%,0 100%);background:linear-gradient(135deg,#1e293b 0%,#0f172a 100%);border:3px solid #334155;border-radius:8px;flex-direction:column;justify-content:space-between;width:160px;height:160px;padding:8px;display:flex;position:relative;box-shadow:0 8px 24px rgba(0,0,0,.65)}@media (min-width:640px){.floppy-disk.svelte-1o4jdf5{border-width:4px;width:190px;height:190px;padding:10px}}.floppy-corner.svelte-1o4jdf5{z-index:10;background:0 0;width:20px;height:20px;position:absolute;top:0;right:0}.floppy-write-protect.svelte-1o4jdf5{background:#020617;border:1px solid #334155;border-radius:1px;width:10px;height:10px;position:absolute;bottom:8px;left:8px}@media (min-width:640px){.floppy-write-protect.svelte-1o4jdf5{width:12px;height:12px;bottom:10px;left:10px}}.floppy-label.svelte-1o4jdf5{border-radius:4px;flex-direction:column;width:100%;height:65px;display:flex;position:relative;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,.3)}@media (min-width:640px){.floppy-label.svelte-1o4jdf5{height:80px}}.floppy-label-stripe.svelte-1o4jdf5{width:100%;height:6px}.floppy-label-stripe-blue.svelte-1o4jdf5{width:100%;height:3px}.floppy-label-content.svelte-1o4jdf5{background:#f8fafc;flex-direction:column;flex-grow:1;justify-content:center;align-items:center;padding:4px;display:flex}.floppy-song.svelte-1o4jdf5{color:#0f172a;text-align:center;text-transform:uppercase;width:90%;font-size:8px;font-weight:800}@media (min-width:640px){.floppy-song.svelte-1o4jdf5{font-size:10px}}.floppy-artist.svelte-1o4jdf5{color:#475569;text-align:center;text-transform:uppercase;width:90%;margin-top:1px;font-size:7px}@media (min-width:640px){.floppy-artist.svelte-1o4jdf5{margin-top:2px;font-size:8px}}.floppy-shutter-door.svelte-1o4jdf5{border:1px solid #1e293b;border-radius:3px;width:60px;height:40px;position:absolute;bottom:8px;left:50%;overflow:hidden;transform:translate(-50%)}@media (min-width:640px){.floppy-shutter-door.svelte-1o4jdf5{width:72px;height:48px;bottom:10px}}.floppy-shutter-slider.svelte-1o4jdf5{z-index:3;background:linear-gradient(90deg,#64748b 0%,#cbd5e1 50%,#64748b 100%);width:100%;height:100%;transition:transform .4s cubic-bezier(.16,1,.3,1);position:absolute;top:0;left:0}.floppy-shutter-slider.open.svelte-1o4jdf5{transform:translate(32px)}@media (min-width:640px){.floppy-shutter-slider.open.svelte-1o4jdf5{transform:translate(38px)}}.floppy-shutter-opening.svelte-1o4jdf5{z-index:1;border-radius:2px;justify-content:center;align-items:center;width:24px;height:32px;display:flex;position:absolute;top:4px;left:8px;overflow:hidden}@media (min-width:640px){.floppy-shutter-opening.svelte-1o4jdf5{width:28px;height:38px;top:5px;left:10px}}.floppy-magnetic-disc.svelte-1o4jdf5{border:2px dashed #475569;border-radius:50%;width:20px;height:20px}.floppy-magnetic-disc.spinning.svelte-1o4jdf5{-webkit-animation:2s linear infinite svelte-1o4jdf5-floppy-spin;animation:2s linear infinite svelte-1o4jdf5-floppy-spin}@media (min-width:640px){.floppy-magnetic-disc.svelte-1o4jdf5{width:24px;height:24px}}.floppy-drive-led.svelte-1o4jdf5{background:#dc2626;border-radius:50%;width:6px;height:6px;position:absolute;bottom:8px;right:8px;box-shadow:0 0 3px #dc2626}.floppy-drive-led.active.svelte-1o4jdf5{-webkit-animation:.4s ease-in-out infinite alternate svelte-1o4jdf5-floppy-led-blink;animation:.4s ease-in-out infinite alternate svelte-1o4jdf5-floppy-led-blink}@media (min-width:640px){.floppy-drive-led.svelte-1o4jdf5{width:7px;height:7px;bottom:10px;right:10px}}.music-box.svelte-1o4jdf5{box-sizing:border-box;background:linear-gradient(135deg,#78350f 0%,#451a03 100%);border:3px solid #d97706;border-radius:10px;justify-content:center;align-items:center;width:160px;height:110px;padding:6px;display:flex;position:relative;box-shadow:0 8px 24px rgba(0,0,0,.7)}@media (min-width:640px){.music-box.svelte-1o4jdf5{border-width:4px;width:190px;height:130px;padding:8px}}.music-box-key.svelte-1o4jdf5{z-index:-1;transform-origin:100%;align-items:center;width:15px;height:26px;display:flex;position:absolute;top:calc(50% - 13px);left:-18px}.music-box-key.svelte-1o4jdf5:before{content:"";border:2px .5 solid #f59e0b;background:0 0;border-radius:50%;width:12px;height:12px;position:absolute;left:-6px;box-shadow:0 0 4px rgba(245,158,11,.4)}.music-box-key.svelte-1o4jdf5:after{content:"";background:#b45309;width:12px;height:3px;position:absolute;right:0}.music-box-key.spinning.svelte-1o4jdf5{-webkit-animation:3s linear infinite svelte-1o4jdf5-key-spin;animation:3s linear infinite svelte-1o4jdf5-key-spin}@media (min-width:640px){.music-box-key.svelte-1o4jdf5{width:18px;height:30px;top:calc(50% - 15px);left:-22px}.music-box-key.svelte-1o4jdf5:before{border-width:3px;width:14px;height:14px;left:-8px}.music-box-key.svelte-1o4jdf5:after{width:14px;height:4px}}.music-box-interior.svelte-1o4jdf5{box-sizing:border-box;background:rgba(0,0,0,.55);border-radius:6px;flex-direction:column;justify-content:space-between;width:100%;height:100%;padding:6px;display:flex;position:relative;overflow:hidden}.music-box-gears.svelte-1o4jdf5{width:40px;height:40px;position:absolute;top:6px;left:6px}.music-box-gear.svelte-1o4jdf5{background:0 0;border:2px dashed #d97706;border-radius:50%;position:absolute}.music-box-gear.gear-1.svelte-1o4jdf5{width:22px;height:22px;top:2px;left:2px}.music-box-gear.gear-1.spinning.svelte-1o4jdf5{-webkit-animation:5s linear infinite svelte-1o4jdf5-gear-rotate;animation:5s linear infinite svelte-1o4jdf5-gear-rotate}.music-box-gear.gear-2.svelte-1o4jdf5{width:14px;height:14px;top:16px;left:18px}.music-box-gear.gear-2.spinning.svelte-1o4jdf5{-webkit-animation:4.2s linear infinite svelte-1o4jdf5-gear-rotate-reverse;animation:4.2s linear infinite svelte-1o4jdf5-gear-rotate-reverse}@media (min-width:640px){.music-box-gear.gear-1.svelte-1o4jdf5{width:26px;height:26px}.music-box-gear.gear-2.svelte-1o4jdf5{width:18px;height:18px;top:18px;left:22px}}.music-box-drum-wrap.svelte-1o4jdf5{align-items:center;width:70px;height:32px;display:flex;position:absolute;top:50%;right:14px;transform:translateY(-50%)}@media (min-width:640px){.music-box-drum-wrap.svelte-1o4jdf5{width:90px;height:38px;right:18px}}.music-box-drum.svelte-1o4jdf5{background:linear-gradient(#d97706 0%,#b45309 50%,#78350f 100%);border:1px solid #d97706;border-radius:6px;width:100%;height:12px;position:relative;overflow:hidden}.music-box-drum.svelte-1o4jdf5:after{content:"";background:repeating-linear-gradient(90deg,transparent,transparent 12px,#fef08a 14px,#f59e0b 15px,transparent 17px);width:200%;height:100%;position:absolute;top:0;left:-100%}@media (min-width:640px){.music-box-drum.svelte-1o4jdf5:after{background:repeating-linear-gradient(90deg,transparent,transparent 15px,#fef08a 17px,#f59e0b 18px,transparent 20px)}}.music-box-drum.spinning.svelte-1o4jdf5:after{-webkit-animation:2.2s linear infinite svelte-1o4jdf5-drum-roll;animation:2.2s linear infinite svelte-1o4jdf5-drum-roll}@media (min-width:640px){.music-box-drum.svelte-1o4jdf5{border-radius:8px;height:16px}}.music-box-comb.svelte-1o4jdf5{gap:2.5px;display:flex;position:absolute;bottom:6px;right:18px}@media (min-width:640px){.music-box-comb.svelte-1o4jdf5{gap:3.5px;bottom:8px;right:22px}}.comb-tooth.svelte-1o4jdf5{transform-origin:top;background:linear-gradient(#cbd5e1 0%,#475569 100%);border-radius:.5px;width:3px;height:18px}.comb-tooth.vibrating.svelte-1o4jdf5{-webkit-animation:.12s ease-in-out infinite alternate svelte-1o4jdf5-tooth-vibrate;animation:.12s ease-in-out infinite alternate svelte-1o4jdf5-tooth-vibrate}@media (min-width:640px){.comb-tooth.svelte-1o4jdf5{border-radius:1px;width:4px;height:24px}}@-webkit-keyframes svelte-1o4jdf5-floppy-spin{to{transform:rotate(360deg)}}@keyframes svelte-1o4jdf5-floppy-spin{to{transform:rotate(360deg)}}@-webkit-keyframes svelte-1o4jdf5-floppy-led-blink{0%{background:#22c55e;box-shadow:0 0 5px #22c55e}to{background:#166534;box-shadow:0 0 1px #166534}}@keyframes svelte-1o4jdf5-floppy-led-blink{0%{background:#22c55e;box-shadow:0 0 5px #22c55e}to{background:#166534;box-shadow:0 0 1px #166534}}@-webkit-keyframes svelte-1o4jdf5-key-spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes svelte-1o4jdf5-key-spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@-webkit-keyframes svelte-1o4jdf5-gear-rotate{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes svelte-1o4jdf5-gear-rotate{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@-webkit-keyframes svelte-1o4jdf5-gear-rotate-reverse{0%{transform:rotate(360deg)}to{transform:rotate(0)}}@keyframes svelte-1o4jdf5-gear-rotate-reverse{0%{transform:rotate(360deg)}to{transform:rotate(0)}}@-webkit-keyframes svelte-1o4jdf5-drum-roll{0%{transform:translate(0)}to{transform:translate(50%)}}@keyframes svelte-1o4jdf5-drum-roll{0%{transform:translate(0)}to{transform:translate(50%)}}@-webkit-keyframes svelte-1o4jdf5-tooth-vibrate{0%{transform:scaleY(1)}to{transform:scaleY(.85)skew(2deg)}}@keyframes svelte-1o4jdf5-tooth-vibrate{0%{transform:scaleY(1)}to{transform:scaleY(.85)skew(2deg)}}.arigato-modal-backdrop.svelte-1o4jdf5{z-index:2000;-webkit-backdrop-filter:blur(8px);background:rgba(0,0,0,.75);justify-content:center;align-items:center;width:100vw;height:100vh;display:flex;position:fixed;top:0;left:0}.arigato-modal-content.svelte-1o4jdf5{color:#e4e4e7;background:linear-gradient(135deg,#121214 0%,#0a0a0c 100%);border:1px solid rgba(239,68,68,.2);border-radius:16px;flex-direction:column;width:90vw;max-width:600px;height:80vh;font-family:monospace;display:flex;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,.8),inset 0 1px rgba(255,255,255,.05)}@media (max-width:640px){.arigato-modal-content.svelte-1o4jdf5{width:95vw;height:85vh}}.arigato-modal-header.svelte-1o4jdf5{background:rgba(255,255,255,.02);border-bottom:1px solid rgba(255,255,255,.08);justify-content:space-between;align-items:center;padding:16px 24px;display:flex}.arigato-modal-header.svelte-1o4jdf5 h2:where(.svelte-1o4jdf5){letter-spacing:.1em;color:#ef4444;text-transform:uppercase;margin:0;font-size:1rem;font-weight:700}.arigato-close-btn.svelte-1o4jdf5{color:rgba(255,255,255,.6);cursor:pointer;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:50%;justify-content:center;align-items:center;width:32px;height:32px;transition:all .2s;display:flex}.arigato-close-btn.svelte-1o4jdf5:hover{color:#fff;background:rgba(239,68,68,.2);border-color:rgba(239,68,68,.4);transform:translate(-2px)}.arigato-modal-body.svelte-1o4jdf5{color:#a1a1aa;flex:1;padding:24px;font-size:.85rem;line-height:1.5;overflow-y:auto}.arigato-modal-body.svelte-1o4jdf5 .intro-text:where(.svelte-1o4jdf5){white-space:pre-wrap;margin-bottom:16px}.arigato-modal-body.svelte-1o4jdf5 .outro-text:where(.svelte-1o4jdf5){white-space:pre-wrap;margin-bottom:16px}.arigato-modal-body.svelte-1o4jdf5 .intro-text:where(.svelte-1o4jdf5) a{color:#ef4444;text-decoration:underline}.arigato-modal-body.svelte-1o4jdf5 .outro-text:where(.svelte-1o4jdf5) a{color:#ef4444;text-decoration:underline}.arigato-modal-body.svelte-1o4jdf5 .intro-text:where(.svelte-1o4jdf5) a:hover{color:#fff}.arigato-modal-body.svelte-1o4jdf5 .outro-text:where(.svelte-1o4jdf5) a:hover{color:#fff}.arigato-modal-body.svelte-1o4jdf5 .tos-box:where(.svelte-1o4jdf5){background:rgba(0,0,0,.4);border:1px dashed rgba(255,255,255,.1);border-radius:8px;max-height:300px;margin:16px 0;padding:12px;overflow-y:auto}.arigato-modal-body.svelte-1o4jdf5 .tos-microtext:where(.svelte-1o4jdf5){letter-spacing:0;color:#71717a;word-break:break-all;white-space:pre-wrap;text-transform:none;font-family:monospace;font-size:5px;line-height:1.2}.arigato-modal-body.svelte-1o4jdf5 .tos-microtext:where(.svelte-1o4jdf5) a{color:#ef4444;text-decoration:underline}.arigato-modal-body.svelte-1o4jdf5 .tos-microtext:where(.svelte-1o4jdf5) a:hover{color:#fff}.merch-link-container.svelte-1o4jdf5{justify-content:center;margin-bottom:20px;display:flex}.merch-link-btn.svelte-1o4jdf5{color:#fff;text-transform:uppercase;letter-spacing:.08em;background:linear-gradient(135deg,#ef4444 0%,#b91c1c 100%);border-radius:9999px;align-items:center;gap:8px;padding:8px 18px;font-size:.7rem;font-weight:850;text-decoration:none;transition:all .2s;display:inline-flex;box-shadow:0 4px 12px rgba(239,68,68,.3)}.merch-link-btn.svelte-1o4jdf5:hover{color:#fff;background:linear-gradient(135deg,#ff6b6b 0%,#ef4444 100%);transform:translateY(-2px);box-shadow:0 6px 16px rgba(239,68,68,.4)}.merch-link-btn.svelte-1o4jdf5:active{transform:translateY(0)}
/*$vite$:1*/`,document.head.appendChild(J),it=`DOGS`,at=`Download instrumental`,ot=`Download vocal mix`,st=`Download track`,ct=`https://data.wearedogs.net/music/catalog.json`,lt=`dogs-music`,ut=`music_catalog_v1`,dt=3e5,ft=500,Y=200,pt=500,mt=/^[a-z0-9][a-z0-9-]{0,79}$/,ht=[`https://data.wearedogs.net/`,`https://wearedogs.net/`,`https://www.wearedogs.net/`,`https://dogs.red/`],X=[`title`,`artist`,`album`,`genre`,`dateAdded`],Z=[`cover`,`altCover`,`src`,`instrumental`,`attrib`],gt=[`attrib`],_t=new WeakMap,vt=function(){function e(){if(a(this,e),D(this,_t,G(ne([]))),R(this,`checkedAt`,0),R(this,`loading`,!1),typeof window<`u`){var t=xn();this.tracks=yn({kind:lt,tracks:t.tracks}),this.checkedAt=t.at||0}}return s(e,[{key:`tracks`,get:function(e){function t(){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}(function(){return j(_(_t,this))}),set:function(e){function t(t){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}(function(e){b(_(_t,this),e,!0)})},{key:`refresh`,value:function(){var e=p(u().m(function e(){var t,n;return u().w(function(e){for(;;)switch(e.p=e.n){case 0:if(!(this.loading||Date.now()-this.checkedAt<dt)){e.n=1;break}return e.a(2);case 1:return this.loading=!0,e.p=2,e.n=3,fetch(ct,{cache:`no-cache`});case 3:if(t=e.v,this.checkedAt=Date.now(),t.ok){e.n=4;break}return e.a(2);case 4:return n=yn,e.n=5,t.json();case 5:this.tracks=n(e.v),localStorage.setItem(ut,JSON.stringify({at:this.checkedAt,tracks:this.tracks})),e.n=7;break;case 6:e.p=6,e.v;case 7:return e.p=7,this.loading=!1,e.f(7);case 8:return e.a(2)}},e,this,[[2,6,7,8]])}));function t(){return e.apply(this,arguments)}return t}()}])}(),yt=new vt,bt=function(){function e(t,n){a(this,e),R(this,`canvas`,null),R(this,`gl`,null),R(this,`analyser`,null),R(this,`program`,null),R(this,`animationFrameId`,null),R(this,`startTime`,0),R(this,`vertexBuffer`,null),R(this,`audioTexture`,null),R(this,`uniforms`,{}),R(this,`frequencyBuffer`,null),this.canvas=t,this.analyser=n,this.frequencyBuffer=new Uint8Array(n?n.frequencyBinCount:128),this.gl=t.getContext(`webgl`)||t.getContext(`experimental-webgl`),this.gl||console.error(`WebGL not supported by this browser.`)}return s(e,[{key:`init`,value:function(e){if(this.gl){var t=this.gl;this.cleanupProgram();var n=this.compileShader(t.VERTEX_SHADER,`
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `),r=this.compileShader(t.FRAGMENT_SHADER,e);if(n&&r){if(this.program=t.createProgram(),t.attachShader(this.program,n),t.attachShader(this.program,r),t.linkProgram(this.program),!t.getProgramParameter(this.program,t.LINK_STATUS))console.error(`Shader program linking failed:`,t.getProgramInfoLog(this.program));else{t.useProgram(this.program);var i=new Float32Array([-1,-1,1,-1,-1,1,1,1]);this.vertexBuffer=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,this.vertexBuffer),t.bufferData(t.ARRAY_BUFFER,i,t.STATIC_DRAW);var a=t.getAttribLocation(this.program,`a_position`);t.enableVertexAttribArray(a),t.vertexAttribPointer(a,2,t.FLOAT,!1,0,0),this.audioTexture=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.audioTexture),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),this.uniforms={time:t.getUniformLocation(this.program,`u_time`),resolution:t.getUniformLocation(this.program,`u_resolution`),volume:t.getUniformLocation(this.program,`u_volume`),bass:t.getUniformLocation(this.program,`u_bass`),mid:t.getUniformLocation(this.program,`u_mid`),treble:t.getUniformLocation(this.program,`u_treble`),audioTexture:t.getUniformLocation(this.program,`u_audioTexture`)},this.startTime=performance.now(),this.resize()}}}}},{key:`setPreset`,value:function(e){this.init(e)}},{key:`compileShader`,value:function(e,t){if(!this.gl)return null;var n=this.gl,r=n.createShader(e);return n.shaderSource(r,t),n.compileShader(r),n.getShaderParameter(r,n.COMPILE_STATUS)?r:(console.error(`Shader compilation error (${e===n.VERTEX_SHADER?`VERTEX`:`FRAGMENT`}):`,n.getShaderInfoLog(r)),n.deleteShader(r),null)}},{key:`start`,value:function(){var e=this;this.stop();var t=function(){e.renderFrame(),e.animationFrameId=requestAnimationFrame(t)};this.animationFrameId=requestAnimationFrame(t)}},{key:`stop`,value:function(){this.animationFrameId&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null)}},{key:`resize`,value:function(){if(this.gl&&this.canvas){var e=this.gl,t=this.canvas.clientWidth,n=this.canvas.clientHeight;(this.canvas.width!==t||this.canvas.height!==n)&&(this.canvas.width=t,this.canvas.height=n,e.viewport(0,0,t,n))}}},{key:`renderFrame`,value:function(){if(this.gl&&this.program){var e=this.gl;this.resize(),e.useProgram(this.program),e.bindBuffer(e.ARRAY_BUFFER,this.vertexBuffer);var t=(performance.now()-this.startTime)/1e3,n=0,r=0,i=0,a=0;if(this.analyser){this.analyser.getByteFrequencyData(this.frequencyBuffer);for(var o=this.frequencyBuffer.length,s=0,c=0,l=0,u=0;u<o;u++){var d=this.frequencyBuffer[u];n+=d,u<12?(r+=d,s++):u<64?(i+=d,c++):(a+=d,l++)}n=n/o/255,r=s>0?r/s/255:0,i=c>0?i/c/255:0,a=l>0?a/l/255:0,e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.audioTexture),e.texImage2D(e.TEXTURE_2D,0,e.LUMINANCE,o,1,0,e.LUMINANCE,e.UNSIGNED_BYTE,this.frequencyBuffer)}e.uniform1f(this.uniforms.time,t),e.uniform2f(this.uniforms.resolution,this.canvas.width,this.canvas.height),e.uniform1f(this.uniforms.volume,n),e.uniform1f(this.uniforms.bass,r),e.uniform1f(this.uniforms.mid,i),e.uniform1f(this.uniforms.treble,a),e.uniform1i(this.uniforms.audioTexture,0),e.drawArrays(e.TRIANGLE_STRIP,0,4)}}},{key:`cleanupProgram`,value:function(){this.gl&&this.program&&(this.gl.deleteProgram(this.program),this.program=null)}},{key:`destroy`,value:function(){this.stop();var e=this.gl;e&&(this.cleanupProgram(),this.vertexBuffer&&(e.deleteBuffer(this.vertexBuffer),this.vertexBuffer=null),this.audioTexture&&(e.deleteTexture(this.audioTexture),this.audioTexture=null)),this.canvas=null,this.gl=null,this.analyser=null}}])}(),xt=[{id:`kaleidosync`,name:`Kaleidosync`,fragmentShader:`
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
    `}],St={id:`no-signal`,name:`No Signal`,fragmentShader:`
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
  `},Ct=2.7,wt=3e4,Tt=2,Et=50,Dt=`webgl2`,Ot=[function(){return he(function(){return n.import(`./butterchurnPresets.min-legacy-D-WJc89f.js`).then(function(e){return r(e.default,1)})},void 0)},function(){return he(function(){return n.import(`./butterchurnPresetsExtra.min-legacy-DFzk7CsG.js`).then(function(e){return r(e.default,1)})},void 0)},function(){return he(function(){return n.import(`./butterchurnPresetsExtra2.min-legacy-PGzIAHXH.js`).then(function(e){return r(e.default,1)})},void 0)},function(){return he(function(){return n.import(`./butterchurnPresetsMD1.min-legacy-DyPP2txR.js`).then(function(e){return r(e.default,1)})},void 0)}],kt=3,At=function(){function e(t,n,r){var i=arguments.length>3&&arguments[3]!==void 0?arguments[3]:{};a(this,e),R(this,`canvas`,null),R(this,`analyser`,null),R(this,`audioCtx`,null),R(this,`visualizer`,null),R(this,`animationFrameId`,null),R(this,`autoTimer`,null),R(this,`destroyed`,!1),R(this,`presets`,{}),R(this,`names`,[]),R(this,`current`,``),R(this,`history`,[]),R(this,`auto`,!0),R(this,`width`,0),R(this,`height`,0),this.canvas=t,this.analyser=n,this.audioCtx=r,this.onPreset=i.onPreset||function(){},this.onNames=i.onNames||function(){}}return s(e,[{key:`start`,value:function(){var e=p(u().m(function e(){var i,a,o,s,c;return u().w(function(e){for(;;)switch(e.p=e.n){case 0:return e.p=0,e.n=1,Promise.all([he(function(){return n.import(`./butterchurn.min-legacy-D5bem6x3.js`).then(function(e){return r(e.default,1)})},void 0),Ot[0]()]);case 1:if(i=e.v,a=t(i,2),o=a[0],s=a[1],!this.destroyed){e.n=2;break}return e.a(2);case 2:this.resize(),this.visualizer=Cn(o,`createVisualizer`).createVisualizer(this.audioCtx,this.canvas,{width:this.width,height:this.height,pixelRatio:1}),this.visualizer.connectAudio(this.analyser),this.addPack(s),this.random(0),this.draw(),this.loadRemainingPacks(),e.n=4;break;case 3:e.p=3,c=e.v,console.warn(`MilkDrop could not start:`,c);case 4:return e.a(2)}},e,this,[[0,3]])}));function i(){return e.apply(this,arguments)}return i}()},{key:`loadRemainingPacks`,value:function(){var e=p(u().m(function e(){var t,n,r,i,a;return u().w(function(e){for(;;)switch(e.p=e.n){case 0:t=y(Ot.slice(1)),e.p=1,t.s();case 2:if((n=t.n()).done){e.n=8;break}return r=n.value,e.p=3,e.n=4,r();case 4:if(i=e.v,!this.destroyed){e.n=5;break}return e.a(2);case 5:this.addPack(i),e.n=7;break;case 6:e.p=6,e.v;case 7:e.n=2;break;case 8:e.n=10;break;case 9:e.p=9,a=e.v,t.e(a);case 10:return e.p=10,t.f(),e.f(10);case 11:return e.a(2)}},e,this,[[3,6],[1,9,10,11]])}));function t(){return e.apply(this,arguments)}return t}()},{key:`addPack`,value:function(e){for(var t=Cn(e,`getPresets`).getPresets(),n=0,r=Object.keys(t);n<r.length;n++){var i=r[n];this.presets[i]=t[i]}this.names=Object.keys(this.presets).sort(function(e,t){return e.localeCompare(t)}),this.onNames(this.names)}},{key:`resize`,value:function(){var e=Math.min(window.devicePixelRatio||1,Tt),t=Math.max(1,Math.round(this.canvas.clientWidth*e)),n=Math.max(1,Math.round(this.canvas.clientHeight*e));(t!==this.width||n!==this.height)&&(this.width=t,this.height=n,this.canvas.width=t,this.canvas.height=n,this.visualizer&&this.visualizer.setRendererSize(t,n))}},{key:`draw`,value:function(){var e=this;this.destroyed||(this.resize(),this.visualizer.render(),this.animationFrameId=requestAnimationFrame(function(){return e.draw()}))}},{key:`loadPreset`,value:function(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:Ct,n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:!0,r=this.presets[e];r&&this.visualizer&&(n&&this.current&&(this.history.push(this.current),this.history.length>Et&&this.history.shift()),this.current=e,this.visualizer.loadPreset(r,t),this.onPreset(e),this.restartAuto())}},{key:`random`,value:function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:Ct;if(this.names.length){for(var t=this.current;t===this.current&&this.names.length>1;)t=this.names[Math.floor(Math.random()*this.names.length)];this.loadPreset(t||this.names[0],e)}}},{key:`next`,value:function(){if(this.names.length){var e=this.names.indexOf(this.current);this.loadPreset(this.names[(e+1)%this.names.length])}}},{key:`previous`,value:function(){if(this.names.length){var e=this.history.pop();if(e)this.loadPreset(e,Ct,!1);else{var t=this.names.indexOf(this.current);this.loadPreset(this.names[(t-1+this.names.length)%this.names.length],Ct,!1)}}}},{key:`setAuto`,value:function(e){this.auto=!!e,this.restartAuto()}},{key:`restartAuto`,value:function(){var e=this;clearTimeout(this.autoTimer),this.auto&&!this.destroyed&&(this.autoTimer=setTimeout(function(){return e.random()},wt))}},{key:`destroy`,value:function(){if(this.destroyed=!0,clearTimeout(this.autoTimer),this.animationFrameId&&cancelAnimationFrame(this.animationFrameId),this.visualizer)try{this.visualizer.disconnectAudio(this.analyser)}catch(e){}this.visualizer=null,this.presets={}}}])}(),jt=M(`<li class="svelte-6h1e9g"><button type="button"> </button></li>`),Mt=M(`<li class="px-3 py-2 font-mono text-[11px] text-white/40 2xl:text-[15px] svelte-6h1e9g"> </li>`),Nt=M(`<li class="px-3 py-2 font-mono text-[10px] text-white/30 2xl:text-[13px] svelte-6h1e9g"> </li>`),Pt=M(`<div class="flex max-h-[40vh] flex-col overflow-hidden rounded-lg border border-white/10 bg-black/75 backdrop-blur-md sm:max-h-[50vh] 2xl:max-h-[60vh] svelte-6h1e9g"><label class="flex items-center gap-2 border-b border-white/10 px-3 py-2 svelte-6h1e9g"><!> <input type="search" aria-label="Search MilkDrop presets" autocomplete="off" spellcheck="false" class="w-full min-w-0 bg-transparent font-mono text-[12px] text-white outline-none placeholder:text-white/30 2xl:text-[15px] svelte-6h1e9g"/></label> <ul class="min-h-0 flex-1 overflow-y-auto py-1 svelte-6h1e9g"><!> <!></ul></div>`),Ft=M(`<div class="milkdrop-deck flex w-full flex-col gap-2 sm:max-w-md md:max-w-lg xl:max-w-xl 2xl:max-w-3xl 2xl:gap-3 svelte-6h1e9g"><!> <div class="flex items-center gap-1 rounded-lg border border-white/10 bg-black/60 p-1 backdrop-blur-md svelte-6h1e9g"><button type="button" class="deck-btn svelte-6h1e9g" aria-label="Previous preset" title="Previous preset"><!></button> <button type="button" class="deck-btn svelte-6h1e9g" aria-label="Random preset" title="Random preset"><!></button> <button type="button" class="deck-btn svelte-6h1e9g" aria-label="Next preset" title="Next preset"><!></button> <button type="button" class="min-w-0 flex-1 truncate px-2 text-left font-mono text-[10px] uppercase tracking-wider text-white/80 hover:text-white md:text-[11px] 2xl:text-[14px] svelte-6h1e9g"> </button> <button type="button"><!></button></div></div>`),ve([`click`]),It=`I understand the creator of this sick beat Nxnja has a copyright notice on his music distribution website.\r
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
`,Lt=M(`<canvas class="visualizer-canvas svelte-1o4jdf5"></canvas>`),Rt=M(`<div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 animate-pulse svelte-1o4jdf5"><div class="bg-black/75 border border-red-500/30 px-3 py-1.5 rounded text-[10px] font-mono tracking-widest text-red-500 font-bold uppercase shadow-[0_0_15px_rgba(239,68,68,0.25)] select-none svelte-1o4jdf5">NO SIGNAL</div></div>`),zt=M(`<div class="visualizer-container cursor-pointer svelte-1o4jdf5"><!> <!> <div class="visualizer-hover-overlay svelte-1o4jdf5"><!></div></div>`),Bt=M(`<div class="visualizer-container bg-[#050508]/40 border border-white/5 flex items-center justify-center svelte-1o4jdf5"><!></div>`),Vt=M(`<div class="vinyl-record-clicker cursor-pointer w-full h-full svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div><div class="groove g1 svelte-1o4jdf5"></div> <div class="groove g2 svelte-1o4jdf5"></div> <div class="groove g3 svelte-1o4jdf5"></div> <div class="groove g4 svelte-1o4jdf5"></div> <div class="record-label svelte-1o4jdf5"><img loading="lazy"/></div> <div class="spindle svelte-1o4jdf5"></div></div> <div></div></div>`),Ht=M(`<div class="cassette-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="cassette-tape svelte-1o4jdf5"><div class="cassette-label bg-gradient-to-r from-purple-800 to-pink-700 svelte-1o4jdf5"><span class="cassette-track-title svelte-1o4jdf5"> </span> <span class="cassette-brand svelte-1o4jdf5">WEAREDOGS AUDIO</span></div> <div class="cassette-window bg-zinc-950/80 svelte-1o4jdf5"><div></div> <div></div> <div></div> <div></div></div></div></div>`),Ut=M(`<div class="floppy-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="floppy-disk svelte-1o4jdf5"><div class="floppy-corner svelte-1o4jdf5"></div> <div class="floppy-write-protect svelte-1o4jdf5"></div> <div class="floppy-label bg-slate-100 text-slate-900 svelte-1o4jdf5"><div class="floppy-label-stripe bg-red-600 svelte-1o4jdf5"></div> <div class="floppy-label-stripe-blue bg-blue-600 svelte-1o4jdf5"></div> <div class="floppy-label-content svelte-1o4jdf5"><div class="floppy-song truncate font-mono svelte-1o4jdf5"> </div> <div class="floppy-artist truncate font-mono svelte-1o4jdf5"> </div></div></div> <div class="floppy-shutter-door bg-zinc-700 svelte-1o4jdf5"><div></div> <div class="floppy-shutter-opening bg-zinc-950 svelte-1o4jdf5"><div></div></div></div> <div></div></div></div>`),Wt=M(`<div></div>`),Gt=M(`<div class="musicbox-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="music-box svelte-1o4jdf5"><div></div> <div class="music-box-interior border border-amber-900/40 svelte-1o4jdf5"><div class="music-box-gears svelte-1o4jdf5"><div></div> <div></div></div> <div class="music-box-drum-wrap svelte-1o4jdf5"><div><div class="music-box-pins svelte-1o4jdf5"><div class="pin pin-1 svelte-1o4jdf5"></div> <div class="pin pin-2 svelte-1o4jdf5"></div> <div class="pin pin-3 svelte-1o4jdf5"></div> <div class="pin pin-4 svelte-1o4jdf5"></div> <div class="pin pin-5 svelte-1o4jdf5"></div> <div class="pin pin-6 svelte-1o4jdf5"></div></div></div></div> <div class="music-box-comb svelte-1o4jdf5"></div></div></div></div>`),Kt=M(`<button><!></button>`),qt=M(`<span class="player-tether-hint svelte-1o4jdf5" role="status"> </span>`),Jt=M(`<span class="player-tether svelte-1o4jdf5"><button class="player-tether-btn svelte-1o4jdf5"><!></button> <!></span>`),Yt=M(`<span></span>`),Xt=M(`<div class="spin-ring svelte-1o4jdf5"></div>`),Zt=M(`<div class="volume-popover svelte-1o4jdf5"><button class="ctrl ctrl-xs mr-2 border border-white/10 rounded-full p-1 hover:bg-white/10 svelte-1o4jdf5" aria-label="Mute"><!></button> <input type="range" class="vol-slider-pop svelte-1o4jdf5" min="0" max="1" step="0.01" aria-label="Volume"/> <span class="text-[10px] font-bold text-white/60 min-w-[28px] text-right font-mono select-none svelte-1o4jdf5"> </span></div>`),Qt=M(`<div class="eq svelte-1o4jdf5"><div class="eq-b svelte-1o4jdf5"></div> <div class="eq-b svelte-1o4jdf5"></div> <div class="eq-b svelte-1o4jdf5"></div></div>`),$t=M(`<span class="svelte-1o4jdf5"></span>`),en=M(`<span class="text-amber-400 flex items-center gap-1 text-[9px] font-bold tracking-wider uppercase bg-amber-500/10 px-1.5 py-0.5 rounded flex-shrink-0 svelte-1o4jdf5" title="Failed to fetch music source from remote database"><!> Error Fetching</span>`),tn=M(`<button class="cursor-pointer svelte-1o4jdf5" style="background: none; border: none; padding: 0; color: inherit; font: inherit;">i</button>`),nn=M(`<a target="_blank" class="svelte-1o4jdf5">i</a>`),rn=M(`<span class="inst-chip-link svelte-1o4jdf5"><!></span>`),an=M(`<div><div class="tr-num svelte-1o4jdf5"><!></div> <img loading="lazy" class="tr-art svelte-1o4jdf5"/> <div class="tr-info svelte-1o4jdf5"><div class="flex items-center gap-1.5 min-w-0 svelte-1o4jdf5"><span> </span> <!></div> <span class="tr-meta svelte-1o4jdf5"> </span></div> <div class="flex items-center gap-2 flex-shrink-0 svelte-1o4jdf5"><!>  <button class="tr-share-btn svelte-1o4jdf5" title="Copy track link" aria-label="Share track"><!></button> <!></div></div>`),on=M(`<div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 animate-pulse svelte-1o4jdf5"><div class="bg-black/75 border border-red-500/30 px-4 py-2 rounded text-[12px] font-mono tracking-widest text-red-500 font-bold uppercase shadow-[0_0_20px_rgba(239,68,68,0.3)] select-none svelte-1o4jdf5">NO SIGNAL</div></div>`),sn=M(`<button> </button>`),cn=M(`<div class="visualizer-container fullscreen cursor-pointer svelte-1o4jdf5"><!> <!> <div class="visualizer-overlay flex-col items-stretch sm:flex-row sm:items-end svelte-1o4jdf5"><div class="flex items-center gap-1 self-start bg-black/60 backdrop-blur-md rounded-lg p-1 border border-white/10 sm:self-auto svelte-1o4jdf5"></div> <!></div></div>`),ln=M(`<div class="arigato-modal-backdrop svelte-1o4jdf5"><div class="arigato-modal-content svelte-1o4jdf5"><header class="arigato-modal-header svelte-1o4jdf5"><h2 class="svelte-1o4jdf5">ARIGATO INFO</h2> <button class="arigato-close-btn svelte-1o4jdf5"><!></button></header> <div class="arigato-modal-body scroll-y svelte-1o4jdf5"><div class="merch-link-container svelte-1o4jdf5"><a href="https://nxnjaa.beatstars.com/" target="_blank" rel="noopener noreferrer" class="merch-link-btn svelte-1o4jdf5"><!> NXNJA MERCH & MUSIC</a></div> <p class="intro-text svelte-1o4jdf5"></p> <div class="tos-box svelte-1o4jdf5"><div class="tos-microtext svelte-1o4jdf5"></div></div> <p class="outro-text svelte-1o4jdf5"></p></div></div></div>`),un=M(`<div class="mp-backdrop svelte-1o4jdf5"><div><header class="panel-header svelte-1o4jdf5"><div class="brand svelte-1o4jdf5"><button class="logo-btn svelte-1o4jdf5" aria-label="Go to the DOGS home page"><!></button> <h1 class="svelte-1o4jdf5"></h1></div> <button class="close-btn svelte-1o4jdf5" aria-label="Close panel"><!></button></header> <div class="mp-body svelte-1o4jdf5"><div class="songs-layout svelte-1o4jdf5"><div><div><div><!></div>  <div class="track-info mt-2 svelte-1o4jdf5"><div class="flex items-center justify-center gap-1.5 mb-1.5 svelte-1o4jdf5"><button class="player-share-btn svelte-1o4jdf5" title="Copy track link" aria-label="Share track"><!></button> <!> <!></div> <div><h2> </h2></div> <div><p> </p></div> <div><p> </p></div></div></div> <div class="player-controls-block svelte-1o4jdf5"><div class="progress-row svelte-1o4jdf5"><span class="ptime svelte-1o4jdf5"> </span> <div class="progress-wrap waveform-slider-wrap relative h-9 flex items-end svelte-1o4jdf5"><div class="waveform-bars flex items-end justify-between absolute inset-0 pointer-events-none px-1 h-full svelte-1o4jdf5"></div> <input type="range" class="seek-input absolute inset-0 opacity-0 cursor-pointer w-full h-full svelte-1o4jdf5" min="0" step="0.1" aria-label="Seek"/></div> <span class="ptime svelte-1o4jdf5"> </span></div> <div class="controls-row svelte-1o4jdf5"><button aria-label="Shuffle"><!></button> <button class="ctrl ctrl-md svelte-1o4jdf5" aria-label="Previous"><!></button> <button><!></button> <button class="ctrl ctrl-md svelte-1o4jdf5" aria-label="Next"><!></button> <button aria-label="Repeat"><!></button></div> <div class="w-full flex flex-col items-center gap-1.5 mt-2 px-1 svelte-1o4jdf5"><div><span><!> <span class="svelte-1o4jdf5">VOCAL</span></span> <div class="dj-fader-slot relative svelte-1o4jdf5"><div></div></div> <span><!> <span class="svelte-1o4jdf5">INST</span></span></div></div> <div class="relative flex justify-center items-center gap-3 mt-2 w-full svelte-1o4jdf5"><!> <div class="flex items-center gap-1.5 svelte-1o4jdf5"><button aria-label="Toggle Visualizer"><!></button> <button> </button></div> <div class="relative svelte-1o4jdf5"><button class="ctrl ctrl-xs vol-toggle-btn svelte-1o4jdf5" aria-label="Toggle volume slider"><!></button></div></div></div></div> <div><div class="mobile-close-bar hidden py-2 px-4 border-b border-white/5 flex items-center justify-between svelte-1o4jdf5"><span class="text-xs font-bold text-white/50 svelte-1o4jdf5">Track Library</span> <button class="px-3 py-1 bg-white/5 text-white/75 rounded-lg text-xs font-bold svelte-1o4jdf5">Back to player</button></div> <div class="tl-header flex justify-between items-center gap-3 svelte-1o4jdf5"><div class="flex items-center gap-2 svelte-1o4jdf5"><!><span class="svelte-1o4jdf5">TRACKS</span> <span class="tl-count svelte-1o4jdf5"> </span></div> <div class="flex items-center gap-1.5 ml-auto svelte-1o4jdf5"><span class="text-[9px] text-white/30 font-bold font-sans svelte-1o4jdf5">SORT BY:</span> <select class="bg-black/40 border border-white/10 rounded px-1.5 py-0.5 text-[10px] font-bold text-white/60 outline-none cursor-pointer hover:border-white/20 transition-all font-sans svelte-1o4jdf5"><option class="svelte-1o4jdf5">DEFAULT</option><option class="svelte-1o4jdf5">ARTIST</option><option class="svelte-1o4jdf5">ALBUM</option><option class="svelte-1o4jdf5">YEAR</option><option class="svelte-1o4jdf5">FILENAME</option><option class="svelte-1o4jdf5">GENRE</option><option class="svelte-1o4jdf5">SEASON</option></select></div></div> <div class="tracklist scroll-y svelte-1o4jdf5"></div></div></div></div> <footer class="mp-footer svelte-1o4jdf5"><div class="mp-status svelte-1o4jdf5"><span class="mp-dot svelte-1o4jdf5"></span><span class="svelte-1o4jdf5">🐕</span></div> <span class="svelte-1o4jdf5">MUSIC</span></footer></div> <!> <canvas class="fader-fx-canvas pointer-events-none svelte-1o4jdf5"></canvas> <!></div>`),ve([`click`,`input`,`change`])}}})})();