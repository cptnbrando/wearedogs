(function(){function e(t){"@babel/helpers - typeof";return e=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},e(t)}function t(e,t){return o(e)||a(e,t)||r(e,t)||n()}function n(){throw TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function r(e,t){if(e){if(typeof e==`string`)return i(e,t);var n={}.toString.call(e).slice(8,-1);return n===`Object`&&e.constructor&&(n=e.constructor.name),n===`Map`||n===`Set`?Array.from(e):n===`Arguments`||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?i(e,t):void 0}}function i(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function a(e,t){var n=e==null?null:typeof Symbol<`u`&&e[Symbol.iterator]||e[`@@iterator`];if(n!=null){var r,i,a,o,s=[],c=!0,l=!1;try{if(a=(n=n.call(e)).next,t===0){if(Object(n)!==n)return;c=!1}else for(;!(c=(r=a.call(n)).done)&&(s.push(r.value),s.length!==t);c=!0);}catch(e){l=!0,i=e}finally{try{if(!c&&n.return!=null&&(o=n.return(),Object(o)!==o))return}finally{if(l)throw i}}return s}}function o(e){if(Array.isArray(e))return e}function s(e,t){if(!(e instanceof t))throw TypeError(`Cannot call a class as a function`)}function c(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,`value`in r&&(r.writable=!0),Object.defineProperty(e,te(r.key),r)}}function l(e,t,n){return t&&c(e.prototype,t),n&&c(e,n),Object.defineProperty(e,"prototype",{writable:!1}),e}function u(){var e,t,n=typeof Symbol==`function`?Symbol:{},r=n.iterator||`@@iterator`,i=n.toStringTag||`@@toStringTag`;function a(n,r,i,a){var c=r&&r.prototype instanceof s?r:s,l=Object.create(c.prototype);return d(l,`_invoke`,function(n,r,i){var a,s,c,l=0,u=i||[],d=!1,f={p:0,n:0,v:e,a:p,f:p.bind(e,4),d:function(t,n){return a=t,s=0,c=e,f.n=n,o}};function p(n,r){for(s=n,c=r,t=0;!d&&l&&!i&&t<u.length;t++){var i,a=u[t],p=f.p,m=a[2];n>3?(i=m===r)&&(c=a[(s=a[4])?5:(s=3,3)],a[4]=a[5]=e):a[0]<=p&&((i=n<2&&p<a[1])?(s=0,f.v=r,f.n=a[1]):p<m&&(i=n<3||a[0]>r||r>m)&&(a[4]=n,a[5]=r,f.n=m,s=0))}if(i||n>1)return o;throw d=!0,r}return function(i,u,m){if(l>1)throw TypeError(`Generator is already running`);for(d&&u===1&&p(u,m),s=u,c=m;(t=s<2?e:c)||!d;){a||(s?s<3?(s>1&&(f.n=-1),p(s,c)):f.n=c:f.v=c);try{if(l=2,a){if(s||(i=`next`),t=a[i]){if(!(t=t.call(a,c)))throw TypeError(`iterator result is not an object`);if(!t.done)return t;c=t.value,s<2&&(s=0)}else s===1&&(t=a.return)&&t.call(a),s<2&&(c=TypeError(`The iterator does not provide a '`+i+`' method`),s=1);a=e}else if((t=(d=f.n<0)?c:n.call(r,f))!==o)break}catch(t){a=e,s=1,c=t}finally{l=1}}return{value:t,done:d}}}(n,i,a),!0),l}var o={};function s(){}function c(){}function l(){}t=Object.getPrototypeOf;var f=[][r]?t(t([][r]())):(d(t={},r,function(){return this}),t),p=l.prototype=s.prototype=Object.create(f);function m(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,l):(e.__proto__=l,d(e,i,`GeneratorFunction`)),e.prototype=Object.create(p),e}return c.prototype=l,d(p,`constructor`,l),d(l,`constructor`,c),c.displayName=`GeneratorFunction`,d(l,i,`GeneratorFunction`),d(p),d(p,i,`Generator`),d(p,r,function(){return this}),d(p,`toString`,function(){return`[object Generator]`}),(u=function(){return{w:a,m}})()}function d(e,t,n,r){var i=Object.defineProperty;try{i({},``,{})}catch(e){i=0}d=function(e,t,n,r){function a(t,n){d(e,t,function(e){return this._invoke(t,n,e)})}t?i?i(e,t,{value:n,enumerable:!r,configurable:!r,writable:!r}):e[t]=n:(a(`next`,0),a(`throw`,1),a(`return`,2))},d(e,t,n,r)}function f(e,t){var n=typeof Symbol<`u`&&e[Symbol.iterator]||e[`@@iterator`];if(!n){if(Array.isArray(e)||(n=p(e))||t&&e&&typeof e.length==`number`){n&&(e=n);var r=0,i=function(){};return{s:i,n:function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}},e:function(e){throw e},f:i}}throw TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var a,o=!0,s=!1;return{s:function(){n=n.call(e)},n:function(){var e=n.next();return o=e.done,e},e:function(e){s=!0,a=e},f:function(){try{o||n.return==null||n.return()}finally{if(s)throw a}}}}function p(e,t){if(e){if(typeof e==`string`)return m(e,t);var n={}.toString.call(e).slice(8,-1);return n===`Object`&&e.constructor&&(n=e.constructor.name),n===`Map`||n===`Set`?Array.from(e):n===`Arguments`||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?m(e,t):void 0}}function m(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function h(e,t,n,r,i,a,o){try{var s=e[a](o),c=s.value}catch(e){n(e);return}s.done?t(c):Promise.resolve(c).then(r,i)}function g(e){return function(){var t=this,n=arguments;return new Promise(function(r,i){var a=e.apply(t,n);function o(e){h(a,r,i,o,s,`next`,e)}function s(e){h(a,r,i,o,s,`throw`,e)}o(void 0)})}}function _(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function ee(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t];t%2?_(Object(n),!0).forEach(function(t){v(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):_(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function v(e,t,n){return(t=te(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function te(t){var n=y(t,`string`);return e(n)==`symbol`?n:n+``}function y(t,n){if(e(t)!=`object`||!t)return t;var r;if(typeof Symbol<`u`&&(r=t[Symbol.toPrimitive])!==void 0){var i=r.call(t,n||`default`);if(e(i)!=`object`)return i;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(n===`string`?String:Number)(t)}System.register(`./rolldown-runtime-legacy-GvFEhjMu.js,./index-legacy-D3TJ08g_.js,./three-legacy-RJR1-iRG.js,./play-legacy-BdQ74FSJ.js,./TitlePage-legacy-CpKqnFqy.js,./tv-legacy-qYZSSEQ-.js,./volume-2-legacy-Bq7GMTcT.js,./volume-x-legacy-Tt2-CHaf.js,./shuffle-legacy-6qO5ycId.js,./openDogsPage-legacy-CqtvmwRW.js,./list-legacy-EbXc0SYj.js,./external-link-legacy-CJFuslx9.js,./TetherIcon-legacy-BBBNqsr0.js,./share-2-legacy-Bth_RaeG.js,./download-legacy-DHquo-V2.js,./check-legacy-CrDxXGjh.js,./triangle-alert-legacy-DKouFxKH.js,./AudioCore.svelte-legacy-B3ZIoKPh.js,./doubleTap-legacy-TTFKgIZD.js,./musicCatalog.svelte-legacy-B1aFNkx2.js,./tether.svelte-legacy-CiqLKTNA.js,./homeOrigin-legacy-DYqyXGoy.js,./DogsLogo-legacy-hFbuxOwS.js,./list-music-legacy-743kDKeN.js,./search-legacy-85avr_Ne.js,./three-core-legacy-CtrKL6Gq.js,./lyrics.svelte-legacy-jd9ImOCB.js,./lyricsFormat-legacy-BdVt-V3o.js,./volume-1-legacy-BjNtEtu0.js,./arrow-up-to-line-legacy-Z_YWpeqx.js,./transition-legacy-DkdU3NLA.js`.split(`,`),function(e,n){var r,i,a,o,c,d,p,m,h,_,v,te,y,b,x,S,ne,C,re,w,T,E,ie,D,O,ae,oe,k,se,A,j,M,ce,N,P,le,F,I,ue,de,fe,L,pe,R,me,he,ge,_e,ve,z,B,V,H,ye,be,xe,Se,Ce,we,Te,Ee,De,Oe,ke,Ae,je,Me,Ne,Pe,Fe,U,Ie,Le,Re,ze,Be,Ve,He,Ue,We,Ge,Ke,qe,Je,W,Ye,Xe,Ze,G,K,Qe,$e,et,tt,nt,rt,it,at,ot,st,ct,q,lt,ut,dt,ft,pt,mt,ht,gt,_t,vt,yt,bt,xt,St,Ct,wt,J,Tt,Et,Dt,Ot,kt,At,jt,Mt,Y,Nt,Pt,Ft,It,Lt,Rt,zt,Bt,Vt,Ht,Ut,Wt,Gt,Kt,qt,Jt,Yt,Xt,Zt,Qt,$t,en,tn,nn,rn,an,on,sn,cn,ln,un,dn,fn,pn,mn,hn,gn,_n,vn,yn,bn,xn,Sn,Cn,wn,Tn,En;function Dn(e,t){var n=k(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`M8 2v4`}],[`path`,{d:`M16 2v4`}],[`rect`,{width:`18`,height:`18`,x:`3`,y:`4`,rx:`2`}],[`path`,{d:`M3 10h18`}],[`path`,{d:`M8 14h.01`}],[`path`,{d:`M12 14h.01`}],[`path`,{d:`M16 14h.01`}],[`path`,{d:`M8 18h.01`}],[`path`,{d:`M12 18h.01`}],[`path`,{d:`M16 18h.01`}]];U(e,A({name:`calendar-days`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=i(),o=a(r);E(o,t,`default`,{},null),C(e,r)},$$slots:{default:!0}}))}function On(e,t){var n=k(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z`}]];U(e,A({name:`diamond`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=i(),o=a(r);E(o,t,`default`,{},null),C(e,r)},$$slots:{default:!0}}))}function kn(e,t){var n=k(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`M12 22v-6`}],[`path`,{d:`M12 8V2`}],[`path`,{d:`M4 12H2`}],[`path`,{d:`M10 12H8`}],[`path`,{d:`M16 12h-2`}],[`path`,{d:`M22 12h-2`}],[`path`,{d:`m15 19-3-3-3 3`}],[`path`,{d:`m15 5-3 3-3-3`}]];U(e,A({name:`fold-vertical`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=i(),o=a(r);E(o,t,`default`,{},null),C(e,r)},$$slots:{default:!0}}))}function An(e,t){var n=k(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`m11.9 12.1 4.514-4.514`}],[`path`,{d:`M20.1 2.3a1 1 0 0 0-1.4 0l-1.114 1.114A2 2 0 0 0 17 4.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 17.828 7h1.344a2 2 0 0 0 1.414-.586L21.7 5.3a1 1 0 0 0 0-1.4z`}],[`path`,{d:`m6 16 2 2`}],[`path`,{d:`M8.23 9.85A3 3 0 0 1 11 8a5 5 0 0 1 5 5 3 3 0 0 1-1.85 2.77l-.92.38A2 2 0 0 0 12 18a4 4 0 0 1-4 4 6 6 0 0 1-6-6 4 4 0 0 1 4-4 2 2 0 0 0 1.85-1.23z`}]];U(e,A({name:`guitar`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=i(),o=a(r);E(o,t,`default`,{},null),C(e,r)},$$slots:{default:!0}}))}function jn(e,t){var n=k(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5`}]];U(e,A({name:`heart`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=i(),o=a(r);E(o,t,`default`,{},null),C(e,r)},$$slots:{default:!0}}))}function Mn(e,t){var n=k(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z`}],[`path`,{d:`M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12`}]];U(e,A({name:`leaf`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=i(),o=a(r);E(o,t,`default`,{},null),C(e,r)},$$slots:{default:!0}}))}function X(e,t){var n=k(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`M11 5h10`}],[`path`,{d:`M11 12h10`}],[`path`,{d:`M11 19h10`}],[`path`,{d:`M4 4h1v5`}],[`path`,{d:`M4 9h2`}],[`path`,{d:`M6.5 20H3.4c0-1 2.6-1.925 2.6-3.5a1.5 1.5 0 0 0-2.6-1.02`}]];U(e,A({name:`list-ordered`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=i(),o=a(r);E(o,t,`default`,{},null),C(e,r)},$$slots:{default:!0}}))}function Nn(e,t){var n=k(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`m11 7.601-5.994 8.19a1 1 0 0 0 .1 1.298l.817.818a1 1 0 0 0 1.314.087L15.09 12`}],[`path`,{d:`M16.5 21.174C15.5 20.5 14.372 20 13 20c-2.058 0-3.928 2.356-6 2-2.072-.356-2.775-3.369-1.5-4.5`}],[`circle`,{cx:`16`,cy:`7`,r:`5`}]];U(e,A({name:`mic-vocal`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=i(),o=a(r);E(o,t,`default`,{},null),C(e,r)},$$slots:{default:!0}}))}function Z(e,t){var n=k(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`M8 3v3a2 2 0 0 1-2 2H3`}],[`path`,{d:`M21 8h-3a2 2 0 0 1-2-2V3`}],[`path`,{d:`M3 16h3a2 2 0 0 1 2 2v3`}],[`path`,{d:`M16 21v-3a2 2 0 0 1 2-2h3`}]];U(e,A({name:`minimize`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=i(),o=a(r);E(o,t,`default`,{},null),C(e,r)},$$slots:{default:!0}}))}function Pn(e,t){var n=k(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`m17 2 4 4-4 4`}],[`path`,{d:`M3 11v-1a4 4 0 0 1 4-4h14`}],[`path`,{d:`m7 22-4-4 4-4`}],[`path`,{d:`M21 13v1a4 4 0 0 1-4 4H3`}],[`path`,{d:`M11 10h1v4`}]];U(e,A({name:`repeat-1`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=i(),o=a(r);E(o,t,`default`,{},null),C(e,r)},$$slots:{default:!0}}))}function Fn(e,t){var n=k(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`m17 2 4 4-4 4`}],[`path`,{d:`M3 11v-1a4 4 0 0 1 4-4h14`}],[`path`,{d:`m7 22-4-4 4-4`}],[`path`,{d:`M21 13v1a4 4 0 0 1-4 4H3`}]];U(e,A({name:`repeat`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=i(),o=a(r);E(o,t,`default`,{},null),C(e,r)},$$slots:{default:!0}}))}function In(e,t){var n=k(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`M8.8 20v-4.1l1.9.2a2.3 2.3 0 0 0 2.164-2.1V8.3A5.37 5.37 0 0 0 2 8.25c0 2.8.656 3.054 1 4.55a5.77 5.77 0 0 1 .029 2.758L2 20`}],[`path`,{d:`M19.8 17.8a7.5 7.5 0 0 0 .003-10.603`}],[`path`,{d:`M17 15a3.5 3.5 0 0 0-.025-4.975`}]];U(e,A({name:`speech`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=i(),o=a(r);E(o,t,`default`,{},null),C(e,r)},$$slots:{default:!0}}))}function Ln(e,t){var n=k(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`M13.172 2a2 2 0 0 1 1.414.586l6.71 6.71a2.4 2.4 0 0 1 0 3.408l-4.592 4.592a2.4 2.4 0 0 1-3.408 0l-6.71-6.71A2 2 0 0 1 6 9.172V3a1 1 0 0 1 1-1z`}],[`path`,{d:`M2 7v6.172a2 2 0 0 0 .586 1.414l6.71 6.71a2.4 2.4 0 0 0 3.191.193`}],[`circle`,{cx:`10.5`,cy:`6.5`,r:`.5`,fill:`currentColor`}]];U(e,A({name:`tags`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=i(),o=a(r);E(o,t,`default`,{},null),C(e,r)},$$slots:{default:!0}}))}function Rn(e,t){return e?e.artist===vt&&!t&&e.src?{url:e.src,label:bt}:e.instrumental?{url:e.instrumental,label:yt}:{url:e.src||``,label:xt}:{url:``,label:xt}}function zn(){if(typeof document>`u`)return!1;try{var e=document.createElement(`canvas`);return!!(e.getContext(`webgl`)||e.getContext(`experimental-webgl`))}catch(e){return!1}}function Bn(e,t){for(var n=e,r=0;r<At&&n&&typeof n[t]!=`function`;r+=1)n=n.default;if(!n||typeof n[t]!=`function`)throw Error(`MilkDrop bundle has no `+t);return n}function Vn(){if(typeof document>`u`||window.WebGL2RenderingContext===void 0)return!1;try{return!!document.createElement(`canvas`).getContext(Ot)}catch(e){return!1}}function Hn(e,t){re(t,!0);var n=120,r=`all`,i=`hearts`,a=H(``),o=H(r),s=R(function(){return j(o)===i?G.favorites:G.names}),c=R(function(){return j(a).trim().toLowerCase().split(/\s+/).filter(Boolean)}),l=R(function(){return j(c).length?j(s).filter(function(e){return j(c).every(function(t){return e.toLowerCase().indexOf(t)!==-1})}):j(s)}),u=R(function(){return j(l).slice(0,n)}),f=R(function(){return j(o)===i&&!G.favorites.length?`No hearts yet. Tap the heart on a preset you love.`:G.names.length?`No preset matches that.`:`Presets arrive when the visualizer starts. Press play.`}),p=Pt(),m=I(p),h=I(m);nt(h,{size:14,class:`shrink-0 text-white/40`});var g=x(h,2);d(g);var _=x(g,2),ee=I(_),te,S=x(ee,2),ne,w=I(S);jn(w,{size:10});var E=x(w);N(S),N(_),N(m);var ie=x(m,2),O=I(ie);T(O,16,function(){return j(u)},function(e){return e},function(e,t){var n=Mt(),r=I(n),i=F(r,!0),a=x(r,2),o,s=I(a),c=R(function(){return G.isFavorite(t)?`currentColor`:`none`});jn(s,{size:13,get fill(){return j(c)}}),N(a),N(n),B(function(e,n,s){b(r,1,`min-w-0 flex-1 truncate px-3 py-1.5 text-left font-mono text-[11px] transition-colors hover:bg-white/10 md:px-4 md:text-[12px] 2xl:px-5 2xl:py-2 2xl:text-[15px]
            ${t===G.current?`bg-white/15 text-white`:`text-white/60`}`,`svelte-80frst`),z(r,`aria-current`,t===G.current?`true`:void 0),r.disabled=!G.names.length,D(i,t),o=b(a,1,`heart-btn svelte-80frst`,null,o,{hearted:e}),z(a,`aria-pressed`,n),z(a,`aria-label`,s)},[function(){return G.isFavorite(t)},function(){return G.isFavorite(t)},function(){return G.isFavorite(t)?`Take the heart off ${t}`:`Heart ${t}`}]),P(`click`,r,function(){return G.pick(t)}),P(`click`,a,function(){return G.toggleFavorite(t)}),C(e,n)});var oe=x(O,2),k=function(e){var t=Y(),n=F(t,!0);B(function(){return D(n,j(f))}),C(e,t)},se=function(e){var t=Nt(),n=F(t);B(function(){return D(n,`${j(l).length-j(u).length} more. Search to narrow it down.`)}),C(e,t)};v(oe,function(e){j(u).length?j(l).length>j(u).length&&e(se,1):e(k)}),N(ie),N(p),B(function(){var e,t;z(g,`placeholder`,`Search ${(e=j(s).length)==null?``:e} presets`),te=b(ee,1,`filter-btn svelte-80frst`,null,te,{"filter-on":j(o)===r}),z(ee,`aria-pressed`,j(o)===r),ne=b(S,1,`filter-btn svelte-80frst`,null,ne,{"filter-on":j(o)===i}),z(S,`aria-pressed`,j(o)===i),D(E,` ${(t=G.favorites.length)==null?``:t}`)}),V(g,function(){return j(a)},function(e){return y(a,e)}),P(`click`,ee,function(){return y(o,r)}),P(`click`,S,function(){return y(o,i)}),C(e,p),ae()}function Un(e,t){re(t,!0);var n=Tt/1e3,r=H(!1),i=R(function(){return G.isFavorite(G.current)}),a=Lt(),o=I(a),s=function(e){var t=Ft();Hn(I(t),{}),N(t),C(e,t)};v(o,function(e){j(r)&&e(s)});var c=x(o,2),l=I(c),u=I(l);xe(u,{size:16}),N(l);var d=x(l,2),f=I(d);be(f,{size:16}),N(d);var p=x(d,2),h=F(p,!0),g=x(p,2),_,ee=I(g),te=R(function(){return j(i)?`currentColor`:`none`});jn(ee,{size:14,get fill(){return j(te)}}),N(g);var S=x(g,2),ne,w=I(S);tt(w,{size:14}),N(S);var T=x(S,2),E,ie=I(T);Fe(ie,{size:14}),N(T);var O=x(T,2),oe,k=I(O);m(k,function(){return G.current},function(e){var t=It(),n;B(function(){var e;n=b(t,0,`deck-timer svelte-6h1e9g`,null,n,{"deck-timer-running":G.auto}),le(t,`--auto-ms: ${(e=3e4)==null?``:e}ms`)}),C(e,t)}),N(O),N(c),N(a),B(function(){z(p,`aria-expanded`,j(r)),z(p,`title`,j(r)?`Hide the preset list`:`Browse presets`),D(h,G.current||`Loading MilkDrop…`),_=b(g,1,`deck-btn deck-heart svelte-6h1e9g`,null,_,{"deck-hearted":j(i)}),z(g,`aria-pressed`,j(i)),z(g,`aria-label`,j(i)?`Take the heart off this preset`:`Heart this preset`),z(g,`title`,j(i)?`In your hearts. Tap to take it out.`:`Heart this preset`),ne=b(S,1,`deck-btn svelte-6h1e9g`,null,ne,{"deck-btn-on":G.favoritesOnly}),z(S,`aria-pressed`,G.favoritesOnly),z(S,`title`,G.favoritesOnly?`Playing only your hearts`:`Play only your hearts`),E=b(T,1,`deck-btn svelte-6h1e9g`,null,E,{"deck-btn-on":G.shuffle}),z(T,`aria-pressed`,G.shuffle),z(T,`title`,G.shuffle?`Shuffle: on`:`Shuffle: off, presets go in order`),oe=b(O,1,`deck-btn svelte-6h1e9g`,null,oe,{"deck-btn-on":G.auto}),z(O,`aria-pressed`,G.auto),z(O,`aria-label`,`Change preset by itself every ${n} seconds`),z(O,`title`,G.auto?`A new preset every ${n} seconds: on`:`A new preset every ${n} seconds: off`)}),P(`click`,l,function(){return G.previous()}),P(`click`,d,function(){return G.next()}),P(`click`,p,function(){return y(r,!j(r))}),P(`click`,g,function(){return G.toggleFavorite()}),P(`click`,S,function(){return G.setFavoritesOnly(!G.favoritesOnly)}),P(`click`,T,function(){return G.setShuffle(!G.shuffle)}),P(`click`,O,function(){return G.setAuto(!G.auto)}),C(e,a),ae()}function Wn(e,t){re(t,!0);var n=1e3,r=`sung`,o=`stage`,s=fe(t,`variant`,3,`slot`),c=H(-1),l=H(null),u=H(null),d=H(1),f=R(function(){return q.shown&&q.current?q.current.lines:null}),p=R(function(){return j(f)&&j(c)>=0?j(f)[j(c)]:null}),h=R(function(){return dt.find(function(e){return e.id===q.font}).stack}),g=R(function(){return s()===o?ut.find(function(e){return e.id===q.size}).scale:1}),_=0,ee=0;w(function(){_=W.currentTime,ee=performance.now()});function te(){var e=W.primaryAudio();return e&&e.src&&!e.paused?e.currentTime:W.isPlaying?_+(performance.now()-ee)/n:W.currentTime}var x=0;w(function(){var e=j(f);if(y(c,-1),x=0,e){var t=0,n=function(){t=requestAnimationFrame(n);var i=te(),a=ft(e,i);if(a!==j(c))y(c,a,!0),x=0;else if(!(a<0||!j(u))){for(var o=e[a].w,s=0;s<o.length&&o[s][0]<=i;)s++;if(s!==x){for(var l=j(u).children,d=Math.min(s,x);d<Math.max(s,x)&&d<l.length;d++)l[d].classList.toggle(r,d<s);x=s}}};return t=requestAnimationFrame(n),function(){return cancelAnimationFrame(t)}}}),w(function(){j(p),j(h),j(g),y(d,1),ue().then(function(){j(u)&&j(l)&&j(u).scrollWidth&&y(d,Math.min(1,j(l).clientWidth/j(u).scrollWidth),!0)})});var S=Bt(),ne=I(S),E=function(e){var t=i(),n=a(t);m(n,function(){return j(c)},function(e){var t=zt();T(t,21,function(){return j(p).w},ie,function(e,t){var n=Rt(),r=F(n,!0);B(function(){return D(r,j(t)[1])}),C(e,n)}),N(t),oe(t,function(e){return y(u,e)},function(){return j(u)}),C(e,t)}),C(e,t)};v(ne,function(e){j(p)&&e(E)}),N(S),oe(S,function(e){return y(l,e)},function(){return j(l)}),B(function(){var e,t,n,r,i;b(S,1,`lyric-line lyric-${(e=s())==null?``:e} lyric-at-${(t=q.place)==null?``:t}`,`svelte-4gkonh`),le(S,`--lyric-font: ${(n=j(h))==null?``:n}; --lyric-scale: ${(r=j(g))==null?``:r}; --lyric-fit: ${(i=j(d))==null?``:i};`)}),C(e,S),ae()}function Gn(e,t){var n=fe(t,`dim`,3,!1),r=fe(t,`accent`,3,!1),i=fe(t,`class`,3,``),a=Vt(),o,s=I(a);O(s,function(){return t.children}),me(2),N(a),B(function(){var e;o=b(a,1,`strike-toggle ${(e=i())==null?``:e}`,`svelte-btbnk2`,o,{"is-off":!t.on,"is-accent":t.on&&r()&&!n(),"is-dim":t.on&&n()}),z(a,`aria-pressed`,t.on),z(a,`aria-label`,t.label),z(a,`title`,t.label)}),P(`click`,a,function(){var e,n=[...arguments];(e=t.onclick)==null||e.apply(this,n)}),C(e,a)}function Kn(e,t){re(t,!0);var n=fe(t,`class`,3,``),r=R(function(){return Math.max(0,Ht.findIndex(function(e){return e.id===t.value}))}),i=R(function(){return Ht[j(r)]}),s=R(function(){return Ht[(j(r)+1)%Ht.length]}),c=Wt(),l=I(c);m(l,function(){return j(i).id},function(e){var t=Ut(),n=a(t),r=I(n);o(r,function(){return j(i).icon},function(e,t){t(e,{size:13})}),N(n);var s=x(n,2),c=F(s,!0);B(function(){return D(c,j(i).label||j(i).name)}),C(e,t)}),N(c),B(function(){var e,t,r,a,o;b(c,1,`sort-cycler sort-${(e=j(i).id)==null?``:e} ${(t=n())==null?``:t}`,`svelte-1ly12po`),z(c,`aria-label`,`Sorted by ${(r=j(i).name)==null?``:r}. Tap to sort by ${(a=j(s).name)==null?``:a}.`),z(c,`title`,`Sorted by ${(o=j(i).name)==null?``:o}`)}),P(`click`,c,function(){return t.onchange(j(s).id)}),C(e,c),ae()}function qn(e,t){re(t,!0);var n=`This song plays only where it is unlocked`,r=R(function(){return K.soundHere}),i=R(function(){return K.soundCanMove}),a=R(function(){return j(i)?j(r)?`Sound: this device. Tap to play it on `+(K.peerName||`the other device`):`Sound: `+(K.peerName||`the other device`)+`. Tap to play it here`:n}),o=Gt(),s,c=I(o),l=I(c);pt(l,{size:14}),N(c),N(o),B(function(){s=b(o,1,`sound-switch svelte-1vwnx9r`,null,s,{"sound-away":!j(r)}),o.disabled=!j(i),z(o,`aria-pressed`,!j(r)),z(o,`aria-label`,j(a)),z(o,`title`,j(a))}),P(`click`,o,function(){return K.moveSound()}),C(e,o),ae()}function Jn(e,t){re(t,!0);var n={top:ht,middle:kn,bottom:mt},r=R(function(){return dt.find(function(e){return e.id===q.font})}),i=R(function(){return ut.find(function(e){return e.id===q.size})}),s=R(function(){return n[q.place]});function c(e,t){return e[(e.indexOf(t)+1)%e.length]}var l=qt(),u=I(l);Z(I(u),{size:15}),N(u);var d=x(u,2),f=R(function(){return!t.hasLyrics}),p=R(function(){return q.shown?t.hasLyrics?`Lyrics: on`:`Lyrics: on. This song has none yet.`:`Lyrics: off`});Gn(d,{class:`stage-btn`,get on(){return q.shown},get dim(){return j(f)},get label(){return j(p)},onclick:function(){return q.setPrefs({shown:!q.shown})},children:function(e,t){In(e,{size:15})},$$slots:{default:!0}});var m=x(d,2),h=function(e){var t=Kt(),n=a(t),l=I(n);o(l,function(){return j(s)},function(e,t){t(e,{size:15})}),N(n);var u=x(n,2),d=F(u,!0),f=x(u,2),p=F(f,!0);B(function(e){var t,a,o,s,c,l,m;z(n,`aria-label`,`Lyrics sit at the ${(t=q.place)==null?``:t}. Tap to move them.`),z(n,`title`,`Lyrics sit at the ${(a=q.place)==null?``:a}. Tap to move them.`),le(u,`font-family: ${(o=j(r).stack)==null?``:o}`),z(u,`aria-label`,`Lyric font: ${(s=j(r).name)==null?``:s}. Tap for the next one.`),z(u,`title`,`Lyric font: ${(c=j(r).name)==null?``:c}. Tap for the next one.`),D(d,j(r).name),z(f,`aria-label`,`Lyric size: ${(l=j(i).name)==null?``:l}. Tap to change it.`),z(f,`title`,`Lyric size: ${(m=j(i).name)==null?``:m}. Tap to change it.`),D(p,e)},[function(){return j(i).id.toUpperCase()}]),P(`click`,n,function(){return q.setPrefs({place:c(lt,q.place)})}),P(`click`,u,function(){return q.setPrefs({font:c(dt,j(r)).id})}),P(`click`,f,function(){return q.setPrefs({size:c(ut,j(i)).id})}),C(e,t)};v(m,function(e){q.shown&&e(h)}),N(l),P(`click`,u,function(){var e,n=[...arguments];(e=t.onExit)==null||e.apply(this,n)}),C(e,l),ae()}function Yn(e){var t=Jt.includes(e.artist),n=Xt.exec((t?e.dateAdded:e.released)||``),r=n?Yt[Number(n[2])-1]:``;return r?`${r} ${n[1]}`:e.year?String(e.year):``}function Xn(e,t){re(t,!0);var n=`/img/error_cover.png`,r=6e4,o=5;function s(e){e.target.src.endsWith(n)||(e.target.src=n)}var l=fe(t,`isClosing`,3,!1),E=fe(t,`initialTrackId`,15,null),O=fe(t,`depth`,15,1),k=Ye(function(){return t.onClose()}),A=H(`default`),M=H(!1),de=H(!1),L=H(!1),he=H(null),_e=R(function(){var e;return!!W.fetchErrors[(e=W.library[W.currentTrackIndex])==null?void 0:e.id]}),V=R(function(){return W.isPlaying&&!l()&&!j(_e)}),be=`milkdrop`,xe=`milkdrop`,je=`shader`,Pe=Vn(),U=Pe?[{id:be,name:`MilkDrop`}]:Ct,tt=Pe||zn(),nt=`music_tv_v1`,lt=`on`,ut=`off`,dt=300,ft=3200,pt=`tracks`,mt=`presets`,ht=`music`,_t=2,vt=640;function yt(){try{return localStorage.getItem(nt)!==ut}catch(e){return!0}}var bt=H(S(yt())),xt=H(0),J=R(function(){return U[j(xt)].id===be}),Tt=H(!1),Et=H(null),Dt=H(null),Ot=H(!1),kt=null,At=null,Mt=H(pt),Y=null,Nt=!1,Pt=H(!1),Ft=R(function(){return tt&&j(bt)&&j(J)&&K.linked&&W.masterIsRemote}),It=R(function(){return j(Ft)&&Qe.analyser?Qe.analyser:W.analyser}),Lt=R(function(){return tt&&j(bt)&&(j(J)?!!j(It):j(Pt))});w(function(){return Qe.setWanted(j(Ft)),function(){return Qe.setWanted(!1)}});function Rt(e){y(bt,e,!0);try{localStorage.setItem(nt,e?lt:ut)}catch(e){}}var zt=H(!1),Bt=R(function(){var e=Zt.split(/`{5,}/);return{intro:e[0]||``,tos:e[1]||``,outro:e[2]||``}});function Vt(e){if(!e)return``;var t=e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`);return t=t.replace(/(https?:\/\/[^\s]+)/g,`<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>`),t=t.replace(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/g,`<a href="mailto:$1">$1</a>`),t.replace(/\n/g,`<br>`)}var Ht=R(function(){var e=j(Z);if(!e)return Array(60).fill(10);if(W.waveformPeaks[e.id])return W.waveformPeaks[e.id];for(var t=e.id,n=[],r=0,i=0;i<t.length;i++)r=(r<<5)-r+t.charCodeAt(i),r|=0;for(var a=Math.abs(r)%1e3,o=0;o<60;o++){var s=o/59,c=Math.sin(a+s*Math.PI*4),l=Math.cos(a*1.5+s*Math.PI*10)*.4,u=Math.sin(a*2.3+s*Math.PI*22)*.15,d=Math.abs(c+l+u)/1.55,f=Math.sin(s*Math.PI),p=(d*70+15)*f;n.push(Math.max(10,Math.round(p)))}return n});w(function(){W.isPlaying&&y(Pt,!0)});var Ut=R(function(){return j(J)?null:!W.isPlaying&&!j(Pt)?wt.fragmentShader:U[j(xt)].fragmentShader});w(function(){var e=j(J)?j(It):W.analyser,t=j(J)?xe:je;if(j(Lt)&&j(Et)&&!l()&&j(Et).dataset.engine===t){if(!j(J))Y=new St(j(Et),e),Y.init(j(Ut)),Y.start();else if(e&&W.audioCtx){var n=new jt(j(Et),e,W.audioCtx,G.listeners());ce(function(){return G.attach(n)}),Y=n,n.start()}}return function(){Y&&(G.detach(Y),Y.destroy(),Y=null)}}),w(function(){q.load(j(Z)?j(Z).id:null)}),w(function(){var e=j(Ut);e&&Y&&j(Lt)&&!j(J)&&(Y.setPreset(e),Y.start())}),w(function(){var e=j(M)||j(Tt);e!==Nt&&(Nt=e,e?(history.pushState(ee(ee({},history.state||{}),{},{view:ht,depth:_t,musicOverlay:!0}),``),O(_t)):history.back())});function Wt(e){var t;!Nt||(t=e.state)!=null&&t.musicOverlay||(Nt=!1,y(M,!1),y(Tt,!1))}function Gt(){y(Ot,!1),clearTimeout(kt),kt=setTimeout(function(){return y(Ot,!0)},ft)}function Kt(){Rt(!0),jr(),y(Tt,!0)}function qt(){j(Dt)&&document.fullscreenElement===j(Dt)?document.exitFullscreen().catch(function(){return y(Tt,!1)}):y(Tt,!1)}var Jt=Ye(qt);function Yt(e){e.stopPropagation(),Jt(e)}w(function(){var e=j(Dt);if(e){Gt(),e.requestFullscreen&&e.requestFullscreen().catch(function(){});var t=function(){document.fullscreenElement||y(Tt,!1)};return document.addEventListener(`fullscreenchange`,t),function(){document.removeEventListener(`fullscreenchange`,t),clearTimeout(kt),document.fullscreenElement===e&&document.exitFullscreen().catch(function(){})}}});function Xt(e){j(L)&&j(he)&&!j(he).contains(e.target)&&!e.target.closest(`.vol-toggle-btn`)&&y(L,!1)}var Dn=R(function(){return Ze(qe(Je.unlocked),Je.unlocked)}),kn=null;function jn(e){return e.src?e.src.split(`/`).pop():``}function Mn(e){if(!e.dateAdded)return`Summer`;var t=new Date(e.dateAdded).getMonth();return t===11||t===0||t===1?`Winter`:t>=2&&t<=4?`Spring`:t>=5&&t<=7?`Summer`:`Fall`}var X=R(function(){var e=j(Dn).filter(function(e){return!e.hidden});return j(A)===`artist`?e.sort(function(e,t){return e.artist.localeCompare(t.artist)}):j(A)===`album`?e.sort(function(e,t){return e.album.localeCompare(t.album)}):j(A)===`year`?e.sort(function(e,t){return(e.year||0)-(t.year||0)}):j(A)===`filename`?e.sort(function(e,t){return jn(e).localeCompare(jn(t))}):j(A)===`genre`?e.sort(function(e,t){return(e.genre||``).localeCompare(t.genre||``)}):j(A)===`season`&&e.sort(function(e,t){return Mn(e).localeCompare(Mn(t))}),e}),Z=R(function(){var e;return(e=j(Dn)[W.currentTrackIndex])==null?j(Dn)[0]:e});w(function(){var e=j(Dn);if(W.library!==e&&W.library.length!==0){var t=W.library[W.currentTrackIndex],n=t==null?void 0:t.id;W.init(e);var r=kn?e.findIndex(function(e){return e.id===kn}):-1,i=e.findIndex(function(e){return e.id===n});if(r!==-1)kn=null,W.loadTrack(r,!0);else if(i!==-1){W.currentTrackIndex=i;var a=e[i],s=a.src!==t.src||a.instrumental!==t.instrumental,c=W.masterTabId&&W.masterTabId!==W.tabId,l=!W.isPlaying||W.currentTime<o;s&&l&&!c&&W.loadTrack(i,W.isPlaying)}else W.pause(),W.loadTrack(0,!1)}});var Ln=H(0),Bn=H(0),Xn=H(0),Zn=H(0),Qn=H(0),$n=H(0),er=`This device is the remote: the sound is on the other one.`,tr=`Both players are in step.`,nr=`It stays on until you close this window, disconnect in Air Train, or nothing happens for 10 minutes.`,rr=`The tether dropped: a screen turned off, or the network changed. This player is on its own until the devices find each other again, which they do by themselves.`,ir=H(!1),ar=R(function(){return K.holding?rr:`Tethered to ${K.peerName||`your other device`}. ${W.masterIsRemote?er:tr} ${nr}`}),or=H(null),sr=null;function cr(e,t){e.stopPropagation();var n=`${$e()}/music/${t.id}`;navigator.clipboard.writeText(n).then(function(){y(or,t.id,!0),sr&&clearTimeout(sr),sr=setTimeout(function(){y(or,null)},2e3)}).catch(function(e){console.error(`Failed to copy share link:`,e)})}var lr=H(null);function ur(e){var t;return Rn(e,e.id===((t=W.library[W.currentTrackIndex])==null?void 0:t.id)?W.isInstrumental:W.userPrefersInstrumental)}function dr(e,t){return fr.apply(this,arguments)}function fr(){return fr=g(u().m(function e(t,n){var i,a,o,s,c,l;return u().w(function(e){for(;;)switch(e.p=e.n){case 0:if(t.stopPropagation(),i=ur(n).url,i&&!j(lr)){e.n=1;break}return e.a(2);case 1:return y(lr,n.id,!0),e.p=2,e.n=3,fetch(i,Je.fetchOptionsFor(i));case 3:if(a=e.v,a.ok){e.n=4;break}throw Error(`Fetch failed with status ${a.status}`);case 4:return c=URL,e.n=5,a.blob();case 5:o=c.createObjectURL.call(c,e.v),s=document.createElement(`a`),s.href=o,s.download=decodeURIComponent(i.split(`/`).pop()||``)||`${n.id}.mp3`,document.body.appendChild(s),s.click(),s.remove(),setTimeout(function(){return URL.revokeObjectURL(o)},r),e.n=7;break;case 6:e.p=6,l=e.v,console.error(`Failed to download track:`,l);case 7:return e.p=7,y(lr,null),e.f(7);case 8:return e.a(2)}},e,null,[[2,6,7,8]])})),fr.apply(this,arguments)}pe(function(){sr&&clearTimeout(sr)}),_(function(){Je.revalidate(),W.init(j(Dn)),Xe.refresh(),q.refreshList();var e=Ke(E());if(E(null),e){var t=j(Dn).findIndex(function(t){return t.id===e});t===-1?kn=e:W.loadTrack(t,!0)}else if(!W.hasPickedRandomTrack){W.hasPickedRandomTrack=!0;var n=j(Dn).filter(function(e){return!e.hidden}),r=n[Math.floor(Math.random()*n.length)];W.loadTrack(j(Dn).indexOf(r),!1)}});var pr=H(null);function mr(){var e=document.querySelector(`.track-row[data-track-id="${j(pr)}"]`);e&&e.scrollIntoView({block:`nearest`,behavior:`smooth`})}function hr(e){y(pr,e.id,!0);var t=j(Dn).findIndex(function(t){return t.id===e.id});W.currentTrackIndex===t&&!W.fetchErrors[e.id]?W.togglePlay():W.loadTrack(t,!0)}function gr(){At?(clearTimeout(At),At=null,Kt()):At=setTimeout(function(){At=null,_r()},dt)}function _r(){y(Mt,pt),window.innerWidth<=vt?y(M,!0):(y(pr,j(Z).id,!0),ue().then(mr))}function vr(e){e.target.closest(`.scroll-container`)&&_r()}function yr(){var e=!W.isInstrumental;W.setCrossfade(e)||(c(Sr),j(Cr)||(y(Cr,!0),setTimeout(function(){y(Cr,!1)},300)),j(Sr)===5?(Rr(),y(wr,!0),setTimeout(function(){y(wr,!1)},150)):j(Sr)===10?Rr(35):j(Sr)>5&&j(Sr)<10?Rr(8):j(Sr)>10&&Math.random()<.4&&Rr(3))}function br(e){return!e||isNaN(e)?`0:00`:`${Math.floor(e/60)}:${Math.floor(e%60).toString().padStart(2,`0`)}`}function xr(e){var t=document.activeElement;if(!t||t.tagName!==`INPUT`&&t.tagName!==`TEXTAREA`&&!t.isContentEditable){if(e.code===`Space`||e.key===` `)e.preventDefault(),W.togglePlay();else if(e.key===`ArrowDown`){if(j(X).length>0){e.preventDefault();var n=j(X).findIndex(function(e){return e.id===j(pr)});if(n===-1){var r=j(Dn)[W.currentTrackIndex];n=j(X).findIndex(function(e){return e.id===(r==null?void 0:r.id)})}var i=(n+1)%j(X).length;y(pr,j(X)[i].id,!0),mr()}}else if(e.key===`ArrowUp`){if(j(X).length>0){e.preventDefault();var a=j(X).findIndex(function(e){return e.id===j(pr)});if(a===-1){var o=j(Dn)[W.currentTrackIndex];a=j(X).findIndex(function(e){return e.id===(o==null?void 0:o.id)})}var s=(a-1+j(X).length)%j(X).length;y(pr,j(X)[s].id,!0),mr()}}else if(e.key===`Enter`&&j(pr)){e.preventDefault();var c=j(X).find(function(e){return e.id===j(pr)});c&&hr(c)}}}var Q=H(null),Sr=H(0),Cr=H(!1),wr=H(!1),$,Tr,Er,Dr=[],Or=[],kr,Ar=H(!1);w(function(){return j(Q)&&Pr(),function(){var e;kr&&cancelAnimationFrame(kr),window.removeEventListener(`resize`,Fr),(e=window.visualViewport)==null||e.removeEventListener(`resize`,Fr),Er&&(Er.dispose(),Er=null),$=null,Tr=null,Dr=[],Or=[]}});function jr(){if(y(Sr,0),y(Ar,!1),$){var e=f(Dr),t;try{for(e.s();!(t=e.n()).done;){var n=t.value;$.remove(n.mesh)}}catch(t){e.e(t)}finally{e.f()}var r=f(Or),i;try{for(r.s();!(i=r.n()).done;){var a=i.value;$.remove(a.mesh)}}catch(e){r.e(e)}finally{r.f()}}Dr=[],Or=[]}w(function(){W.currentTrackIndex,l(),jr()});function Mr(){if(!j(Q))return{width:window.innerWidth,height:window.innerHeight};var e=j(Q).getBoundingClientRect();return{width:e.width||window.innerWidth,height:e.height||window.innerHeight}}function Nr(){var e=Mr(),t=e.width,n=e.height,r=document.querySelector(`.dj-fader-knob`);if(!r)return{x:t/2,y:n/2};var i=j(Q)?j(Q).getBoundingClientRect():{left:0,top:0},a=r.getBoundingClientRect();return{x:a.left+a.width/2-i.left,y:n-(a.top+a.height/2-i.top)}}function Pr(){var e;if(j(Q)){var t=Mr(),n=t.width,r=t.height;j(Q).width=n,j(Q).height=r,$=new at,Tr=new it(0,n,r,0,-1,1),Er=new ye({canvas:j(Q),alpha:!0,antialias:!0}),Er.setSize(n,r,!1),Er.setPixelRatio(Math.min(window.devicePixelRatio,2)),window.addEventListener(`resize`,Fr),(e=window.visualViewport)==null||e.addEventListener(`resize`,Fr),Ir()}}function Fr(){if(j(Q)&&Er&&Tr){var e=Mr(),t=e.width,n=e.height;j(Q).width=t,j(Q).height=n,Er.setSize(t,n,!1),Tr.right=t,Tr.top=n,Tr.updateProjectionMatrix()}}function Ir(){if(kr=requestAnimationFrame(Ir),$&&Tr&&Er&&j(Q)){if(j(Sr)>=10&&(y(Ar,!0),Math.random()<.22)){var e=Nr();Lr(e.x,e.y)}for(var t=Dr.length-1;t>=0;t--){var n=Dr[t];n.x+=n.vx,n.y+=n.vy,n.vy+=n.ay,n.life-=n.decay,n.mesh.position.set(n.x,n.y,0),n.mesh.material.opacity=n.life,n.life<=0&&($.remove(n.mesh),n.mesh.geometry.dispose(),n.mesh.material.dispose(),Dr.splice(t,1))}for(var r=Or.length-1;r>=0;r--){var i=Or[r];i.x+=i.vx,i.y+=i.vy,i.life-=i.decay;var a=i.startScale+(1-i.life)*88;i.mesh.scale.set(a,a,1),i.mesh.position.set(i.x,i.y,0),i.mesh.material.opacity=i.life*.16,i.life<=0&&($.remove(i.mesh),i.mesh.geometry.dispose(),i.mesh.material.dispose(),Or.splice(r,1))}Er.render($,Tr)}}function Lr(e,t){if($){var n=new rt(5,8),r=.85+Math.random()*.12,i=new st({color:new ot(r,r,r*1.01),transparent:!0,opacity:.06,blending:1}),a=new ct(n,i);a.position.set(e,t,0),$.add(a),Or.push({mesh:a,x:e,y:t,vx:(Math.random()-.5)*.55+Math.sin(Date.now()*.001)*.22,vy:Math.random()*.7+1.25,startScale:1,life:1,decay:6e-4+Math.random()*4e-4})}}function Rr(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:25;if($&&j(Q))for(var t=Nr(),n=t.x,r=t.y,i=0;i<e;i++){var a=new rt(1.3,4),o=new st({color:new ot(Math.random()<.4?16711765:16755200),transparent:!0,opacity:1,blending:2}),s=new ct(a,o);s.position.set(n,r,0),$.add(s);var c=Math.random()*Math.PI*2,l=Math.random()*4+2;Dr.push({mesh:s,x:n,y:r,vx:Math.cos(c)*l,vy:Math.sin(c)*l,ay:-.15,life:1,decay:.02+Math.random()*.02})}}var zr=En();se(`keydown`,ne,xr),se(`popstate`,ne,Wt),se(`click`,ne,Xt);var Br=I(zr),Vr,Hr=I(Br),Ur=I(Hr),Wr=I(Ur),Gr=I(Wr);et(Gr,{size:`panel`}),N(Wr);var Kr=x(Wr,2);Kr.textContent=`MUSIC`,N(Ur);var qr=x(Ur,2),Jr=I(qr);Ve(Jr,{});var Yr=x(Jr,2),Xr=I(Yr);Re(Xr,{size:20}),N(Yr),N(qr),N(Hr);var Zr=x(Hr,2),Qr=I(Zr),$r=I(Qr),ei,ti=I($r),ni,ri=I(ti),ii,ai=I(ri),oi=function(e){var t=$t(),r=I(t),o=function(e){var t=i(),n=a(t);m(n,function(){return j(J)},function(e){var t=Qt();oe(t,function(e){return y(Et,e)},function(){return j(Et)}),B(function(){return z(t,`data-engine`,j(J)?xe:je)}),C(e,t)}),C(e,t)};v(r,function(e){j(Tt)||e(o)});var c=x(r,2),l,u=F(c);me(2),N(t),B(function(){l=b(c,1,`viz-label svelte-1o4jdf5`,null,l,{spinning:j(V)}),z(u,`src`,W.fetchErrors[j(Z).id]||!j(Z).cover?n:j(Z).cover),z(u,`alt`,j(Z).album)}),P(`click`,t,gr),se(`error`,u,s),ge(u),C(e,t)},si=function(e){var t=i(),r=a(t),o=function(e){var t=en(),r=I(t),i,a=x(I(r),8),o=I(a),c;N(a),me(2),N(r);var l=x(r,2),u;N(t),B(function(){i=b(r,1,`vinyl-record svelte-1o4jdf5`,null,i,{spinning:j(V)}),z(o,`src`,W.fetchErrors[j(Z).id]||!j(Z).cover?n:j(Z).cover),z(o,`alt`,j(Z).album),c=b(o,1,`record-art svelte-1o4jdf5`,null,c,{loaded:j(de)}),u=b(l,1,`tonearm svelte-1o4jdf5`,null,u,{playing:j(V)})}),P(`click`,t,gr),se(`load`,o,function(){return y(de,!0)}),se(`error`,o,s),ge(o),C(e,t)},c=function(e){var t=R(function(){return W.duration>0?(1-W.currentTime/W.duration)*.45+.25:.48}),n=R(function(){return W.duration>0?W.currentTime/W.duration*.45+.25:.48}),r=tn(),i=I(r),a=I(i),o=I(a),s=F(o,!0);me(2),N(a);var c=x(a,2),l=I(c),u,d=x(l,2),f,p=x(d,2),m,h=x(p,2),g;N(c),N(i),N(r),B(function(){D(s,j(Z).title),u=b(l,1,`spindle-left bg-zinc-900 svelte-1o4jdf5`,null,u,{spinning:j(V)}),f=b(d,1,`tape-roll-left bg-amber-950/70 svelte-1o4jdf5`,null,f,{spinning:j(V)}),le(d,`width: ${j(t)*46}px; height: ${j(t)*46}px;`),m=b(p,1,`spindle-right bg-zinc-900 svelte-1o4jdf5`,null,m,{spinning:j(V)}),g=b(h,1,`tape-roll-right bg-amber-950/70 svelte-1o4jdf5`,null,g,{spinning:j(V)}),le(h,`width: ${j(n)*46}px; height: ${j(n)*46}px;`)}),P(`click`,r,gr),C(e,r)},l=function(e){var t=nn(),n=I(t),r=x(I(n),4),i=x(I(r),4),a=I(i),o=F(a,!0),s=x(a,2),c=F(s,!0);N(i),N(r);var l=x(r,2),u=I(l),d,f=x(u,2),p=I(f),m;N(f),N(l);var h=x(l,2),g;N(n),N(t),B(function(){D(o,j(Z).title),D(c,j(Z).artist||`WEAREDOGS`),d=b(u,1,`floppy-shutter-slider bg-zinc-400 svelte-1o4jdf5`,null,d,{open:j(V)}),m=b(p,1,`floppy-magnetic-disc bg-zinc-900 svelte-1o4jdf5`,null,m,{spinning:j(V)}),g=b(h,1,`floppy-drive-led svelte-1o4jdf5`,null,g,{active:j(V)})}),P(`click`,t,gr),C(e,t)},u=function(e){var t=an(),n=I(t),r=I(n),i,a=x(r,2),o=I(a),s=I(o),c,l=x(s,2),u;N(o);var d=x(o,2),f=I(d),p;N(d);var m=x(d,2);T(m,20,function(){return Array(10)},ie,function(e,t,n){var r=rn(),i;B(function(e){return i=b(r,1,`comb-tooth svelte-1o4jdf5`,null,i,{vibrating:e})},[function(){return j(V)&&n%3==Math.floor(W.currentTime*4)%3}]),C(e,r)}),N(m),N(a),N(n),N(t),B(function(){i=b(r,1,`music-box-key svelte-1o4jdf5`,null,i,{spinning:j(V)}),c=b(s,1,`music-box-gear gear-1 svelte-1o4jdf5`,null,c,{spinning:j(V)}),u=b(l,1,`music-box-gear gear-2 svelte-1o4jdf5`,null,u,{spinning:j(V)}),p=b(f,1,`music-box-drum bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 svelte-1o4jdf5`,null,p,{spinning:j(V)})}),P(`click`,t,gr),C(e,t)};v(r,function(e){Ee.musicDeckModel===`vinyl`?e(o):Ee.musicDeckModel===`cassette`?e(c,1):Ee.musicDeckModel===`floppy`?e(l,2):Ee.musicDeckModel===`musicbox`&&e(u,3)}),C(e,t)};v(ai,function(e){j(Lt)?e(oi):e(si,-1)}),N(ri);var ci=x(ri,2),li=I(ci),ui=I(li),di=I(ui),fi=function(e){We(e,{size:12,class:`text-[#22c55e]`})},pi=function(e){He(e,{size:12})};v(di,function(e){j(or)===j(Z).id?e(fi):e(pi,-1)}),N(ui);var mi=x(ui,2),hi=function(e){var t=on(),n,r=I(t);Ue(r,{size:12}),N(t),B(function(e,r){n=b(t,1,`player-download-btn svelte-1o4jdf5`,null,n,{downloading:j(lr)===j(Z).id}),z(t,`title`,e),z(t,`aria-label`,r)},[function(){return ur(j(Z)).label},function(){return ur(j(Z)).label}]),P(`click`,t,function(e){return dr(e,j(Z))}),C(e,t)};v(mi,function(e){(j(Z).instrumental||j(Z).src)&&e(hi)});var gi=x(mi,2),_i=function(e){var t=cn(),n=I(t),r,i=I(n),a=function(e){ze(e,{size:12})},o=function(e){Be(e,{size:12})};v(i,function(e){K.holding?e(a):e(o,-1)}),N(n);var s=x(n,2),c=function(e){var t=sn(),n=F(t,!0);B(function(){return D(n,j(ar))}),C(e,t)};v(s,function(e){j(ir)&&e(c)}),N(t),B(function(){r=b(n,1,`player-tether-btn svelte-1o4jdf5`,null,r,{"player-tether-lost":K.holding}),z(n,`title`,j(ar)),z(n,`aria-label`,j(ar)),z(n,`aria-expanded`,j(ir))}),P(`click`,n,function(e){e.stopPropagation(),y(ir,!j(ir))}),se(`blur`,n,function(){return y(ir,!1)}),C(e,t)};v(gi,function(e){(K.linked||K.holding)&&e(_i)}),N(li);var vi=x(li,2),yi,bi=I(vi),xi,Si=F(bi,!0);N(vi);var Ci=x(vi,2),wi,Ti=I(Ci),Ei,Di=F(Ti,!0);N(Ci);var Oi=x(Ci,2),ki,Ai=I(Oi),ji,Mi=F(Ai,!0);N(Oi),N(ci),N(ti);var Ni=x(ti,2),Pi=I(Ni);Wn(Pi,{});var Fi=x(Pi,2),Ii=I(Fi),Li=F(Ii,!0),Ri=x(Ii,2),zi=I(Ri);T(zi,21,function(){return j(Ht)},ie,function(e,t,n){var r=R(function(){return W.duration>0?W.currentTime/W.duration:0}),i=R(function(){return n/60}),a=ln(),o;B(function(){var e;o=b(a,1,`waveform-bar transition-colors duration-100 rounded-full svelte-1o4jdf5`,null,o,{active:j(i)<=j(r)}),le(a,`height: ${(e=j(t))==null?``:e}%; width: 3px;`)}),C(e,a)}),N(zi);var Bi=x(zi,2);d(Bi),N(Ri);var Vi=x(Ri,2),Hi=F(Vi,!0);N(Fi);var Ui=x(Fi,2),Wi=I(Ui),Gi,Ki=I(Wi);Fe(Ki,{size:15}),N(Wi);var qi=x(Wi,2),Ji=I(qi);ke(Ji,{size:19}),N(qi);var Yi=x(qi,2),Xi,Zi=I(Yi),Qi=function(e){Ge(e,{size:22})},$i=function(e){var t=un();C(e,t)},ea=function(e){Te(e,{size:22,fill:`currentColor`})},ta=function(e){Se(e,{size:22,fill:`currentColor`})};v(Zi,function(e){W.fetchErrors[j(Z).id]?e(Qi):W.isLoading?e($i,1):W.isPlaying?e(ea,2):e(ta,-1)}),N(Yi);var na=x(Yi,2),ra=I(na);Oe(ra,{size:19}),N(na);var ia=x(na,2),aa,oa=I(ia),sa=function(e){Pn(e,{size:15})},ca=function(e){On(e,{size:15})},la=function(e){Fn(e,{size:15})};v(oa,function(e){W.repeatMode===2?e(sa):W.repeatMode===3?e(ca,1):e(la,-1)}),N(ia),N(Ui);var ua=x(Ui,2),da=I(ua),fa,pa=I(da),ma;Nn(I(pa),{size:12}),me(2),N(pa);var ha=x(pa,2),ga=I(ha),_a;N(ha);var va=x(ha,2),ya;An(I(va),{size:12}),me(2),N(va),N(da),N(ua);var ba=x(ua,2),xa=I(ba),Sa=function(e){var t=dn(),n=I(t),r=I(n),i=function(e){Ne(e,{size:12,class:`text-red-400`})},a=function(e){Me(e,{size:12})};v(r,function(e){W.isMuted||W.volume===0?e(i):e(a,-1)}),N(n);var o=x(n,2);d(o);var s=x(o,2),c=F(s);N(t),oe(t,function(e){return y(he,e)},function(){return j(he)}),B(function(e){p(o,W.volume),D(c,`${e==null?``:e}%`)},[function(){return Math.round(W.volume*100)}]),P(`click`,n,function(){return W.toggleMute()}),P(`input`,o,function(e){return W.setVolume(parseFloat(e.target.value))}),C(e,t)};v(xa,function(e){j(L)&&e(Sa)});var Ca=x(xa,2),wa=function(e){var t=R(function(){return j(bt)?`Visualizer: on`:`Visualizer: off`});Gn(e,{get on(){return j(bt)},accent:!0,get label(){return j(t)},onclick:function(){return Rt(!j(bt))},children:function(e,t){Ae(e,{size:14})},$$slots:{default:!0}})};v(Ca,function(e){tt&&e(wa)});var Ta=x(Ca,2),Ea=I(Ta);De(Ea,{size:14}),N(Ta);var Da=x(Ta,2),Oa=R(function(){return!q.has(j(Z).id)}),ka=R(function(){return q.shown?q.has(j(Z).id)?`Lyrics: on`:`Lyrics: on. This song has none yet.`:`Lyrics: off`});Gn(Da,{get on(){return q.shown},accent:!0,get dim(){return j(Oa)},get label(){return j(ka)},onclick:function(){return q.setPrefs({shown:!q.shown})},children:function(e,t){In(e,{size:14})},$$slots:{default:!0}});var Aa=x(Da,2),ja=function(e){qn(e,{})};v(Aa,function(e){K.linked&&e(ja)});var Ma=x(Aa,2),Na=I(Ma),Pa=I(Na),Fa=function(e){Ne(e,{size:13,class:`text-red-400`})},Ia=function(e){Me(e,{size:13})};v(Pa,function(e){W.isMuted||W.volume===0?e(Fa):e(Ia,-1)}),N(Na),N(Ma),N(ba),N(Ni),N($r);var La=x($r,2),Ra,za=I(La),Ba=x(I(za),2);N(za);var Va=x(za,2),Ha=I(Va),Ua=I(Ha),Wa,Ga=I(Ua);Ie(Ga,{size:13});var Ka=x(Ga,3),qa=F(Ka,!0);N(Ua);var Ja=x(Ua,2),Ya=function(e){var t=pn(),n,r=I(t);Ae(r,{size:13});var i=x(r,3),a=function(e){var t=fn(),n=F(t,!0);B(function(){return D(n,G.names.length)}),C(e,t)};v(i,function(e){G.names.length&&e(a)}),N(t),B(function(){n=b(t,1,`tl-tab svelte-1o4jdf5`,null,n,{"tl-tab-on":j(Mt)===mt}),z(t,`aria-selected`,j(Mt)===mt)}),P(`click`,t,function(){return y(Mt,mt)}),C(e,t)};v(Ja,function(e){j(J)&&e(Ya)}),N(Ha);var Xa=x(Ha,2),Za=function(e){Kn(e,{class:`tl-sort-cycler`,get value(){return j(A)},onchange:function(e){return y(A,e,!0)}})};v(Xa,function(e){j(Mt)===pt&&e(Za)}),N(Va);var Qa=x(Va,2),$a=function(e){Hn(e,{})};v(Qa,function(e){j(Mt)===mt&&e($a)});var eo=x(Qa,2),to;T(eo,21,function(){return j(X)},ie,function(e,t,r){var i=bn(),a,o=I(i),c=I(o),l=function(e){var t=mn();C(e,t)},u=function(e){var t=hn();t.textContent=r+1,C(e,t)};v(c,function(e){j(Z).id===j(t).id&&W.isPlaying?e(l):e(u,-1)}),N(o);var d=x(o,2),f=x(d,2),p=I(f),m=I(p),h,g=F(m,!0),_=x(m,2),ee=function(e){var t=gn(),n=I(t);Ge(n,{size:10}),me(),N(t),C(e,t)};v(_,function(e){W.fetchErrors[j(t).id]&&e(ee)}),N(p);var te=x(p,2),S=F(te);N(f);var ne=x(f,2),re=I(ne),w=function(e){var n=yn(),r=I(n),i=function(e){var t=_n();P(`click`,t,function(e){e.stopPropagation(),y(zt,!0)}),C(e,t)},a=function(e){var n=vn();B(function(){return z(n,`href`,j(t).attrib)}),P(`click`,n,function(e){return e.stopPropagation()}),C(e,n)};v(r,function(e){j(t).id===`arigato`?e(i):e(a,-1)}),N(n),C(e,n)};v(re,function(e){j(t).attrib&&e(w)});var T=x(re,2),E=I(T),ie=function(e){We(e,{size:12,class:`text-[#22c55e]`})},O=function(e){He(e,{size:12})};v(E,function(e){j(or)===j(t).id?e(ie):e(O,-1)}),N(T);var ae=x(T,2),oe=function(e){var n=on(),r,i=I(n);Ue(i,{size:12}),N(n),B(function(e,i){r=b(n,1,`tr-download-btn svelte-1o4jdf5`,null,r,{downloading:j(lr)===j(t).id}),z(n,`title`,e),z(n,`aria-label`,i)},[function(){return ur(j(t)).label},function(){return ur(j(t)).label}]),P(`click`,n,function(e){return dr(e,j(t))}),C(e,n)};v(ae,function(e){(j(t).instrumental||j(t).src)&&e(oe)}),N(ne),N(i),B(function(e){var r,o;a=b(i,1,`track-row svelte-1o4jdf5`,null,a,{active:j(Z).id===j(t).id,"kb-focused":j(pr)===j(t).id,"fetch-error":W.fetchErrors[j(t).id]}),z(i,`data-track-id`,j(t).id),z(d,`src`,W.fetchErrors[j(t).id]||!j(t).cover?n:j(t).cover),z(d,`alt`,j(t).album),h=b(m,1,`tr-title svelte-1o4jdf5`,null,h,{"line-through":W.fetchErrors[j(t).id],"opacity-50":W.fetchErrors[j(t).id]}),D(g,j(t).title),D(S,`${(r=j(t).artist)==null?``:r} · ${(o=j(t).album)==null?``:o}${e==null?``:e}`)},[function(){return Yn(j(t))?` (${Yn(j(t))})`:``}]),P(`click`,i,function(){return hr(j(t))}),se(`error`,d,s),ge(d),P(`click`,T,function(e){return cr(e,j(t))}),C(e,i)}),N(eo),N(La),N(Qr),N(Zr),me(2),N(Br);var no=x(Br,2),ro=function(e){var t=wn(),r,o=I(t),c=I(o),l=function(e){var t=i(),n=a(t);m(n,function(){return j(J)},function(e){var t=Qt();oe(t,function(e){return y(Et,e)},function(){return j(Et)}),B(function(){return z(t,`data-engine`,j(J)?xe:je)}),C(e,t)}),C(e,t)},u=function(e){var t=xn();B(function(){return z(t,`src`,j(Z).cover||n)}),se(`error`,t,s),ge(t),C(e,t)};v(c,function(e){j(Lt)?e(l):e(u,-1)}),Wn(x(c,2),{variant:`stage`}),N(o);var d=x(o,2),f=I(d),p=R(function(){return q.has(j(Z).id)});Jn(f,{get hasLyrics(){return j(p)},onExit:qt});var h=x(f,2),g=function(e){var t=Cn();T(t,21,function(){return U},ie,function(e,t,n){var r=Sn(),i=F(r,!0);B(function(){b(r,1,`px-2 py-1 rounded text-[9px] font-bold transition-all uppercase tracking-wider font-mono 2xl:px-3 2xl:py-2 2xl:text-[13px]
                ${j(xt)===n?`bg-white text-black`:`text-white/40 hover:text-white/80`}`,`svelte-1o4jdf5`),D(i,j(t).name)}),P(`click`,r,function(){return y(xt,n,!0)}),C(e,r)}),N(t),C(e,t)};v(h,function(e){U.length>1&&e(g)});var _=x(h,2),ee=function(e){Un(e,{})};v(_,function(e){j(J)&&e(ee)}),N(d),N(t),oe(t,function(e){return y(Dt,e)},function(){return j(Dt)}),B(function(){return r=b(t,1,`visualizer-container fullscreen svelte-1o4jdf5`,null,r,{"stage-idle":j(Ot)})}),P(`click`,t,Yt),P(`pointerdown`,t,Gt),P(`pointermove`,t,Gt),P(`click`,d,function(e){return e.stopPropagation()}),C(e,t)};v(no,function(e){j(Tt)&&e(ro)});var io=x(no,2);oe(io,function(e){return y(Q,e)},function(){return j(Q)});var ao=x(io,2),oo=function(e){var t=Tn(),n=I(t),r=I(n),i=x(I(r),2),a=I(i);Re(a,{size:16}),N(i),N(r);var o=x(r,2),s=I(o),c=I(s),l=I(c);Le(l,{size:14}),me(),N(c),N(s);var u=x(s,2);h(u,function(){return Vt(j(Bt).intro)},!0),N(u);var d=x(u,2),f=I(d);h(f,function(){return Vt(j(Bt).tos)},!0),N(f),N(d);var p=x(d,2);h(p,function(){return Vt(j(Bt).outro)},!0),N(p),N(o),N(n),N(t),P(`click`,t,function(){return y(zt,!1)}),P(`click`,n,function(e){return e.stopPropagation()}),P(`click`,i,function(){return y(zt,!1)}),te(3,t,function(){return gt},function(){return{duration:150}}),C(e,t)};v(ao,function(e){j(zt)&&e(oo)}),N(zr),B(function(e,t,n){Vr=b(Br,1,`mp-container svelte-1o4jdf5`,null,Vr,{closing:l(),"theme-inst":W.isInstrumental}),le(Br,e),ei=b($r,1,`player-side svelte-1o4jdf5`,null,ei,{"tracklist-open":j(M)}),ni=b(ti,1,`player-top-block transition-all duration-300 ease-in-out svelte-1o4jdf5`,null,ni,{"opacity-0":j(M),"scale-95":j(M),"pointer-events-none":j(M)}),ii=b(ri,1,`vinyl-wrapper relative overflow-hidden svelte-1o4jdf5`,null,ii,{"deck-glitch":j(_e)}),yi=b(vi,1,`scroll-container svelte-1o4jdf5`,null,yi,{overflowing:j(Bn)>j(Ln)}),le(vi,`--scroll-dist: -${j(Bn)-j(Ln)}px`),xi=b(bi,1,`track-title scroll-text svelte-1o4jdf5`,null,xi,{"animate-scroll":j(Bn)>j(Ln)}),D(Si,j(Z).title),wi=b(Ci,1,`scroll-container svelte-1o4jdf5`,null,wi,{overflowing:j(Zn)>j(Xn)}),le(Ci,`--scroll-dist: -${j(Zn)-j(Xn)}px`),Ei=b(Ti,1,`track-artist scroll-text svelte-1o4jdf5`,null,Ei,{"animate-scroll":j(Zn)>j(Xn)}),D(Di,j(Z).artist),ki=b(Oi,1,`scroll-container svelte-1o4jdf5`,null,ki,{overflowing:j($n)>j(Qn)}),le(Oi,`--scroll-dist: -${j($n)-j(Qn)}px`),ji=b(Ai,1,`track-album scroll-text svelte-1o4jdf5`,null,ji,{"animate-scroll":j($n)>j(Qn)}),D(Mi,j(Z).album),D(Li,t),z(Bi,`max`,W.duration||100),p(Bi,W.currentTime),D(Hi,n),Gi=b(Wi,1,`ctrl ctrl-sm svelte-1o4jdf5`,null,Gi,{"active-ctrl":W.isShuffled}),Xi=b(Yi,1,`ctrl ctrl-play svelte-1o4jdf5`,null,Xi,{"ctrl-error":W.fetchErrors[j(Z).id]}),z(Yi,`aria-label`,W.isPlaying?`Pause`:`Play`),aa=b(ia,1,`ctrl ctrl-sm svelte-1o4jdf5`,null,aa,{"active-ctrl":W.repeatMode>0}),z(ia,`title`,W.repeatMode===1?`Repeat: all`:W.repeatMode===2?`Repeat: one`:W.repeatMode===3?`Stop after current track`:`Repeat: off`),fa=b(da,1,`dj-crossfader svelte-1o4jdf5`,null,fa,{"fader-flash":j(wr),"fader-fried":j(Sr)>=10}),ma=b(pa,1,`fader-label left-label flex items-center gap-1 svelte-1o4jdf5`,null,ma,{active:!W.isInstrumental}),_a=b(ga,1,`dj-fader-knob svelte-1o4jdf5`,null,_a,{right:W.isInstrumental,"knob-jiggle":j(Cr),fried:j(Sr)>=10}),ya=b(va,1,`fader-label right-label flex items-center gap-1 svelte-1o4jdf5`,null,ya,{active:W.isInstrumental}),Ra=b(La,1,`tracklist-side svelte-1o4jdf5`,null,Ra,{"show-mobile":j(M)}),Wa=b(Ua,1,`tl-tab svelte-1o4jdf5`,null,Wa,{"tl-tab-on":j(Mt)===pt}),z(Ua,`aria-selected`,j(Mt)===pt),D(qa,j(X).length),to=b(eo,1,`tracklist scroll-y svelte-1o4jdf5`,null,to,{hidden:j(Mt)!==pt})},[function(){return Ce(Ee.musicPalette)},function(){return br(W.currentTime)},function(){return br(W.duration)}]),P(`click`,zr,k),P(`click`,Br,function(e){return e.stopPropagation()}),P(`click`,Wr,function(){var e,t=[...arguments];(e=we)==null||e.apply(this,t)}),P(`click`,Yr,function(){var e,n=[...arguments];(e=t.onClose)==null||e.apply(this,n)}),P(`click`,ci,vr),P(`click`,ui,function(e){return cr(e,j(Z))}),ve(bi,`clientWidth`,function(e){return y(Bn,e)}),ve(vi,`clientWidth`,function(e){return y(Ln,e)}),ve(Ti,`clientWidth`,function(e){return y(Zn,e)}),ve(Ci,`clientWidth`,function(e){return y(Xn,e)}),ve(Ai,`clientWidth`,function(e){return y($n,e)}),ve(Oi,`clientWidth`,function(e){return y(Qn,e)}),P(`input`,Bi,function(e){W.seek(parseFloat(e.target.value))}),P(`change`,Bi,function(e){W.isPlaying||W.play(parseFloat(e.target.value))}),P(`click`,Wi,function(){return W.setShuffle(!W.isShuffled)}),P(`click`,qi,function(){return W.prevTrack()}),P(`click`,Yi,function(){return W.togglePlay()}),P(`click`,na,function(){return W.nextTrack()}),P(`click`,ia,function(){return W.cycleRepeat()}),P(`click`,da,yr),P(`click`,Ta,Kt),P(`click`,Na,function(){y(L,!j(L))}),P(`click`,Ba,function(){y(M,!1)}),P(`click`,Ua,function(){return y(Mt,pt)}),te(1,Qr,function(){return gt},function(){return{duration:120,delay:120}}),te(2,Qr,function(){return gt},function(){return{duration:120}}),C(e,zr),ae()}return e(`default`,Xn),{setters:[function(e){r=e.o},function(e){i=e.$,a=e.At,o=e.B,c=e.Bt,d=e.C,p=e.D,m=e.G,h=e.H,_=e.J,v=e.K,te=e.L,y=e.Lt,b=e.M,x=e.Mt,S=e.Nt,ne=e.Ot,C=e.Q,re=e.Qt,w=e.Tt,T=e.U,E=e.V,ie=e.W,D=e.X,O=e.Y,ae=e.Zt,oe=e._,k=e.a,se=e.at,A=e.c,j=e.dt,M=e.et,ce=e.ht,N=e.in,P=e.it,le=e.j,F=e.jt,I=e.kt,ue=e.mt,de=e.n,fe=e.o,L=e.on,pe=e.q,R=e.qt,me=e.rn,he=e.rt,ge=e.st,_e=e.tt,ve=e.v,z=e.w,B=e.wt,V=e.x,H=e.zt},function(e){ye=e.n},function(e){be=e.n,xe=e.r,Se=e.t},function(e){Ce=e.d,we=e.f,Te=e.m,Ee=e.s},function(e){De=e.i,Oe=e.n,ke=e.r,Ae=e.t},function(e){je=e.n,Me=e.t},function(e){Ne=e.t},function(e){Pe=e.n,Fe=e.t},function(e){U=e.r},function(e){Ie=e.t},function(e){Le=e.t},function(e){Re=e.i,ze=e.n,Be=e.r,Ve=e.t},function(e){He=e.t},function(e){Ue=e.t},function(e){We=e.t},function(e){Ge=e.t},function(e){Ke=e.i,qe=e.o,Je=e.r,W=e.t},function(e){Ye=e.t},function(e){Xe=e.n,Ze=e.t},function(e){G=e.b,K=e.t,Qe=e.y},function(e){$e=e.t},function(e){et=e.t},function(e){tt=e.t},function(e){nt=e.t},function(e){rt=e.B,it=e.Er,at=e.Qi,ot=e.U,st=e.ar,ct=e.ir},function(e){q=e.i,lt=e.n,ut=e.r,dt=e.t},function(e){ft=e.n},function(e){pt=e.t},function(e){mt=e.n,ht=e.t},function(e){gt=e.t}],execute:function(){_t=document.createElement(`style`),_t.textContent=`@-webkit-keyframes svelte-80frst-trophyFloat{0%{transform:translateY(0)scale(1)}to{transform:translateY(-3px)scale(1.04)}}@keyframes svelte-80frst-trophyFloat{0%{transform:translateY(0)scale(1)}to{transform:translateY(-3px)scale(1.04)}}@-webkit-keyframes svelte-80frst-pulseGlow{0%{box-shadow:0 0 4px rgba(239,68,68,.1)}to{box-shadow:0 0 12px rgba(239,68,68,.35)}}@keyframes svelte-80frst-pulseGlow{0%{box-shadow:0 0 4px rgba(239,68,68,.1)}to{box-shadow:0 0 12px rgba(239,68,68,.35)}}@-webkit-keyframes svelte-80frst-searchPulse{0%{border-color:rgba(var(--color-neon-gold,#e6b900), .4)}to{border-color:rgba(var(--color-neon-gold,#e6b900), .95)}}@keyframes svelte-80frst-searchPulse{0%{border-color:rgba(var(--color-neon-gold,#e6b900), .4)}to{border-color:rgba(var(--color-neon-gold,#e6b900), .95)}}@-webkit-keyframes svelte-80frst-flashGlow{0%,to{border-color:var(--border-light,rgba(255,255,255,.05));box-shadow:none}50%{border-color:rgba(var(--color-neon-red,#f34), .8);box-shadow:0 0 20px rgba(var(--color-neon-red,#f34), .35)}}@keyframes svelte-80frst-flashGlow{0%,to{border-color:var(--border-light,rgba(255,255,255,.05));box-shadow:none}50%{border-color:rgba(var(--color-neon-red,#f34), .8);box-shadow:0 0 20px rgba(var(--color-neon-red,#f34), .35)}}.filter-btn.svelte-80frst{letter-spacing:.06em;text-transform:uppercase;color:rgba(255,255,255,.7);border-radius:4px;align-items:center;gap:3px;padding:2px 7px;font-size:10px;font-weight:700;transition:background .15s,color .15s;display:flex}.filter-on.svelte-80frst{color:#fff;background:rgba(255,255,255,.08)}.heart-btn.svelte-80frst{color:rgba(255,255,255,.7);opacity:.45;flex-shrink:0;justify-content:center;align-items:center;width:34px;height:30px;transition:opacity .15s,color .15s,transform .15s;display:flex}.heart-btn.svelte-80frst:hover{opacity:1}.heart-btn.svelte-80frst:focus-visible{opacity:1}.heart-btn.svelte-80frst:active{transform:scale(.85)}.hearted.svelte-80frst{opacity:1;color:var(--color-neon-red,#f34)}@media (min-width:1536px){.filter-btn.svelte-80frst{padding:4px 10px;font-size:13px}.heart-btn.svelte-80frst{width:48px;height:44px}}@-webkit-keyframes svelte-6h1e9g-trophyFloat{0%{transform:translateY(0)scale(1)}to{transform:translateY(-3px)scale(1.04)}}@keyframes svelte-6h1e9g-trophyFloat{0%{transform:translateY(0)scale(1)}to{transform:translateY(-3px)scale(1.04)}}@-webkit-keyframes svelte-6h1e9g-pulseGlow{0%{box-shadow:0 0 4px rgba(239,68,68,.1)}to{box-shadow:0 0 12px rgba(239,68,68,.35)}}@keyframes svelte-6h1e9g-pulseGlow{0%{box-shadow:0 0 4px rgba(239,68,68,.1)}to{box-shadow:0 0 12px rgba(239,68,68,.35)}}@-webkit-keyframes svelte-6h1e9g-searchPulse{0%{border-color:rgba(var(--color-neon-gold,#e6b900), .4)}to{border-color:rgba(var(--color-neon-gold,#e6b900), .95)}}@keyframes svelte-6h1e9g-searchPulse{0%{border-color:rgba(var(--color-neon-gold,#e6b900), .4)}to{border-color:rgba(var(--color-neon-gold,#e6b900), .95)}}@-webkit-keyframes svelte-6h1e9g-flashGlow{0%,to{border-color:var(--border-light,rgba(255,255,255,.05));box-shadow:none}50%{border-color:rgba(var(--color-neon-red,#f34), .8);box-shadow:0 0 20px rgba(var(--color-neon-red,#f34), .35)}}@keyframes svelte-6h1e9g-flashGlow{0%,to{border-color:var(--border-light,rgba(255,255,255,.05));box-shadow:none}50%{border-color:rgba(var(--color-neon-red,#f34), .8);box-shadow:0 0 20px rgba(var(--color-neon-red,#f34), .35)}}.deck-btn.svelte-6h1e9g{color:rgba(255,255,255,.7);border-radius:6px;flex-shrink:0;justify-content:center;align-items:center;width:30px;height:30px;transition:background .15s,color .15s,transform .15s;display:flex}.deck-btn.svelte-6h1e9g:hover{color:#fff;background:rgba(255,255,255,.08)}.deck-btn.svelte-6h1e9g:focus-visible{color:#fff;background:rgba(255,255,255,.08)}.deck-btn.svelte-6h1e9g:active{transform:scale(.88)}.deck-btn-on.svelte-6h1e9g{color:var(--color-neon-green,#00d75f)}.deck-hearted.svelte-6h1e9g{color:var(--color-neon-red,#f34)}.deck-timer-hand.svelte-6h1e9g{transform-box:view-box;transform-origin:12px 14px}.deck-timer-running.svelte-6h1e9g{-webkit-animation:.35s ease-out svelte-6h1e9g-deck-timer-kick;animation:.35s ease-out svelte-6h1e9g-deck-timer-kick}.deck-timer-running.svelte-6h1e9g .deck-timer-hand:where(.svelte-6h1e9g){-webkit-animation:svelte-6h1e9g-deck-timer-sweep var(--auto-ms) linear forwards;animation:svelte-6h1e9g-deck-timer-sweep var(--auto-ms) linear forwards}@-webkit-keyframes svelte-6h1e9g-deck-timer-sweep{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes svelte-6h1e9g-deck-timer-sweep{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@-webkit-keyframes svelte-6h1e9g-deck-timer-kick{0%{transform:scale(1.3)}to{transform:none}}@keyframes svelte-6h1e9g-deck-timer-kick{0%{transform:scale(1.3)}to{transform:none}}@media (prefers-reduced-motion:reduce){.deck-timer-running.svelte-6h1e9g{-webkit-animation:none;animation:none}.deck-timer-running.svelte-6h1e9g .deck-timer-hand:where(.svelte-6h1e9g){-webkit-animation:none;animation:none}}@media (min-width:1536px){.deck-btn.svelte-6h1e9g{width:44px;height:44px}}.lyric-line.svelte-4gkonh{white-space:nowrap;pointer-events:none;font-family:var(--lyric-font);-webkit-user-select:none;user-select:none;overflow:hidden}.lyric-row.svelte-4gkonh{transform:scale(var(--lyric-fit));display:inline-block}.lyric-word.svelte-4gkonh{opacity:0;margin-right:.3em;display:inline-block}.lyric-word.svelte-4gkonh.sung{opacity:1;-webkit-animation:.32s ease-out svelte-4gkonh-lyric-flash;animation:.32s ease-out svelte-4gkonh-lyric-flash}.lyric-slot.svelte-4gkonh{text-align:left;letter-spacing:.01em;width:100%;height:1.25rem;color:rgba(var(--mp-ink-rgb,255, 255, 255), .92);flex-shrink:0;font-size:.8125rem;font-weight:700;line-height:1.25rem}.lyric-slot.svelte-4gkonh .lyric-row:where(.svelte-4gkonh){transform-origin:0}.lyric-stage.svelte-4gkonh{z-index:15;text-align:center;font-size:calc(clamp(1rem, min(5.2vw, 12vh), 6rem) * var(--lyric-scale));font-size:calc(clamp(1rem, min(5.2cqw, 12cqh), 6rem) * var(--lyric-scale));color:rgb(var(--mp-ink-rgb,255, 255, 255));text-shadow:0 0 .5em rgba(0,0,0,.85),0 .06em .12em rgba(0,0,0,.9);font-weight:800;line-height:1.3;position:absolute;left:4%;right:4%}.lyric-stage.svelte-4gkonh .lyric-row:where(.svelte-4gkonh){transform-origin:50%}.lyric-stage.lyric-at-top.svelte-4gkonh{top:9%}.lyric-stage.lyric-at-middle.svelte-4gkonh{margin-top:-.65em;top:50%}.lyric-stage.lyric-at-bottom.svelte-4gkonh{bottom:16%}@-webkit-keyframes svelte-4gkonh-lyric-flash{0%{opacity:0;-webkit-filter:brightness(2.2);filter:brightness(2.2);transform:translateY(.18em)scale(1.18)}45%{opacity:1;-webkit-filter:brightness(1.8);filter:brightness(1.8)}to{opacity:1;-webkit-filter:none;filter:none;transform:none}}@keyframes svelte-4gkonh-lyric-flash{0%{opacity:0;-webkit-filter:brightness(2.2);filter:brightness(2.2);transform:translateY(.18em)scale(1.18)}45%{opacity:1;-webkit-filter:brightness(1.8);filter:brightness(1.8)}to{opacity:1;-webkit-filter:none;filter:none;transform:none}}@media (max-height:700px){.lyric-slot.svelte-4gkonh{height:.875rem;font-size:.75rem;line-height:.875rem}}@media (max-height:500px){.lyric-stage.lyric-at-bottom.svelte-4gkonh{bottom:26%}}@media (prefers-reduced-motion:reduce){.lyric-word.svelte-4gkonh.sung{-webkit-animation:none;animation:none}}.strike-toggle.svelte-btbnk2{color:rgba(255,255,255,.5);cursor:pointer;background:0 0;border:none;border-radius:50%;flex-shrink:0;justify-content:center;align-items:center;width:26px;height:26px;padding:0;transition:color .2s,opacity .2s,transform .15s cubic-bezier(.34,1.56,.64,1);display:flex;position:relative}.strike-toggle.svelte-btbnk2:hover{color:rgba(255,255,255,.9);transform:scale(1.1)}.strike-toggle.svelte-btbnk2:active{transform:scale(.88)}.is-accent.svelte-btbnk2,.is-accent.svelte-btbnk2:hover{color:rgb(var(--mp-accent-rgb,255, 255, 255))}.is-off.svelte-btbnk2{opacity:.7}.is-dim.svelte-btbnk2{opacity:.75}.strike.svelte-btbnk2{pointer-events:none;background:currentColor;border-radius:1px;width:22px;height:2px;margin:-1px 0 0 -11px;transition:transform .26s cubic-bezier(.34,1.56,.64,1);position:absolute;top:50%;left:50%;transform:rotate(-45deg)scaleX(0);box-shadow:0 0 0 1.5px rgba(5,5,8,.9)}.is-off.svelte-btbnk2 .strike:where(.svelte-btbnk2){transform:rotate(-45deg)scaleX(1)}@media (prefers-reduced-motion:reduce){.strike.svelte-btbnk2,.strike-toggle.svelte-btbnk2{transition:none}}@-webkit-keyframes svelte-1ly12po-trophyFloat{0%{transform:translateY(0)scale(1)}to{transform:translateY(-3px)scale(1.04)}}@keyframes svelte-1ly12po-trophyFloat{0%{transform:translateY(0)scale(1)}to{transform:translateY(-3px)scale(1.04)}}@-webkit-keyframes svelte-1ly12po-pulseGlow{0%{box-shadow:0 0 4px rgba(239,68,68,.1)}to{box-shadow:0 0 12px rgba(239,68,68,.35)}}@keyframes svelte-1ly12po-pulseGlow{0%{box-shadow:0 0 4px rgba(239,68,68,.1)}to{box-shadow:0 0 12px rgba(239,68,68,.35)}}@-webkit-keyframes svelte-1ly12po-searchPulse{0%{border-color:rgba(var(--color-neon-gold,#e6b900), .4)}to{border-color:rgba(var(--color-neon-gold,#e6b900), .95)}}@keyframes svelte-1ly12po-searchPulse{0%{border-color:rgba(var(--color-neon-gold,#e6b900), .4)}to{border-color:rgba(var(--color-neon-gold,#e6b900), .95)}}@-webkit-keyframes svelte-1ly12po-flashGlow{0%,to{border-color:var(--border-light,rgba(255,255,255,.05));box-shadow:none}50%{border-color:rgba(var(--color-neon-red,#f34), .8);box-shadow:0 0 20px rgba(var(--color-neon-red,#f34), .35)}}@keyframes svelte-1ly12po-flashGlow{0%,to{border-color:var(--border-light,rgba(255,255,255,.05));box-shadow:none}50%{border-color:rgba(var(--color-neon-red,#f34), .8);box-shadow:0 0 20px rgba(var(--color-neon-red,#f34), .35)}}.sort-cycler.svelte-1ly12po{min-width:40px;min-height:28px;font:inherit;letter-spacing:inherit;text-transform:inherit;white-space:nowrap;cursor:pointer;background:rgba(255,255,255,.06);border:1px solid;border-radius:6px;justify-content:center;align-items:center;gap:6px;padding:4px 10px;transition:color .2s,transform .15s cubic-bezier(.34,1.56,.64,1);display:flex}.sort-cycler.svelte-1ly12po:active{transform:scale(.88)}.sort-icon.svelte-1ly12po{-webkit-animation:.25s ease-out svelte-1ly12po-sort-swap;animation:.25s ease-out svelte-1ly12po-sort-swap;display:flex}.sort-name.svelte-1ly12po{-webkit-animation:.25s ease-out svelte-1ly12po-sort-name-in;animation:.25s ease-out svelte-1ly12po-sort-name-in}@-webkit-keyframes svelte-1ly12po-sort-name-in{0%{opacity:0}}@keyframes svelte-1ly12po-sort-name-in{0%{opacity:0}}.sort-default.svelte-1ly12po{color:rgba(255,255,255,.75)}.sort-artist.svelte-1ly12po{color:var(--color-neon-red,#f34)}.sort-album.svelte-1ly12po{color:var(--color-doc-sky,#38bdf8)}.sort-year.svelte-1ly12po{color:var(--color-neon-gold,#e6b900)}.sort-filename.svelte-1ly12po{color:var(--color-neon-green,#00d75f)}.sort-genre.svelte-1ly12po{color:rgba(180,85,255,.95)}.sort-season.svelte-1ly12po{color:var(--color-image-orange,#ff5e00)}@-webkit-keyframes svelte-1ly12po-sort-swap{0%{opacity:0;transform:rotate(-90deg)scale(.6)}to{opacity:1;transform:none}}@keyframes svelte-1ly12po-sort-swap{0%{opacity:0;transform:rotate(-90deg)scale(.6)}to{opacity:1;transform:none}}@media (prefers-reduced-motion:reduce){.sort-icon.svelte-1ly12po,.sort-name.svelte-1ly12po{-webkit-animation:none;animation:none}}.sound-switch.svelte-1vwnx9r{width:26px;height:26px;color:rgb(var(--mp-accent-rgb,255, 255, 255));cursor:pointer;background:0 0;border:none;border-radius:50%;flex-shrink:0;justify-content:center;align-items:center;padding:0;transition:transform .15s cubic-bezier(.34,1.56,.64,1);display:flex}.sound-switch.svelte-1vwnx9r:hover:not(:disabled){transform:scale(1.1)}.sound-switch.svelte-1vwnx9r:active:not(:disabled){transform:scale(.88)}.sound-switch.svelte-1vwnx9r:disabled{opacity:.35;cursor:not-allowed}.sound-icon.svelte-1vwnx9r{transition:transform .35s cubic-bezier(.34,1.56,.64,1);display:flex}.sound-away.svelte-1vwnx9r .sound-icon:where(.svelte-1vwnx9r){transform:scaleX(-1)}@media (prefers-reduced-motion:reduce){.sound-icon.svelte-1vwnx9r{transition:none}}@-webkit-keyframes svelte-chvcxl-trophyFloat{0%{transform:translateY(0)scale(1)}to{transform:translateY(-3px)scale(1.04)}}@keyframes svelte-chvcxl-trophyFloat{0%{transform:translateY(0)scale(1)}to{transform:translateY(-3px)scale(1.04)}}@-webkit-keyframes svelte-chvcxl-pulseGlow{0%{box-shadow:0 0 4px rgba(239,68,68,.1)}to{box-shadow:0 0 12px rgba(239,68,68,.35)}}@keyframes svelte-chvcxl-pulseGlow{0%{box-shadow:0 0 4px rgba(239,68,68,.1)}to{box-shadow:0 0 12px rgba(239,68,68,.35)}}@-webkit-keyframes svelte-chvcxl-searchPulse{0%{border-color:rgba(var(--color-neon-gold,#e6b900), .4)}to{border-color:rgba(var(--color-neon-gold,#e6b900), .95)}}@keyframes svelte-chvcxl-searchPulse{0%{border-color:rgba(var(--color-neon-gold,#e6b900), .4)}to{border-color:rgba(var(--color-neon-gold,#e6b900), .95)}}@-webkit-keyframes svelte-chvcxl-flashGlow{0%,to{border-color:var(--border-light,rgba(255,255,255,.05));box-shadow:none}50%{border-color:rgba(var(--color-neon-red,#f34), .8);box-shadow:0 0 20px rgba(var(--color-neon-red,#f34), .35)}}@keyframes svelte-chvcxl-flashGlow{0%,to{border-color:var(--border-light,rgba(255,255,255,.05));box-shadow:none}50%{border-color:rgba(var(--color-neon-red,#f34), .8);box-shadow:0 0 20px rgba(var(--color-neon-red,#f34), .35)}}div.svelte-chvcxl .stage-btn{color:rgba(255,255,255,.7);border-radius:6px;flex-shrink:0;justify-content:center;align-items:center;min-width:30px;height:30px;font-size:11px;font-weight:700;transition:background .15s,color .15s;display:flex}div.svelte-chvcxl .stage-btn:hover{color:#fff;background:rgba(255,255,255,.08)}div.svelte-chvcxl .stage-btn:focus-visible{color:#fff;background:rgba(255,255,255,.08)}.stage-btn-wide.svelte-chvcxl{min-width:52px;padding:0 8px}@media (min-width:1536px){div.svelte-chvcxl .stage-btn{min-width:44px;height:44px;font-size:14px}.stage-btn-wide.svelte-chvcxl{min-width:76px}}@-webkit-keyframes svelte-1o4jdf5-trophyFloat{0%{transform:translateY(0)scale(1)}to{transform:translateY(-3px)scale(1.04)}}@keyframes svelte-1o4jdf5-trophyFloat{0%{transform:translateY(0)scale(1)}to{transform:translateY(-3px)scale(1.04)}}@-webkit-keyframes svelte-1o4jdf5-pulseGlow{0%{box-shadow:0 0 4px rgba(239,68,68,.1)}to{box-shadow:0 0 12px rgba(239,68,68,.35)}}@keyframes svelte-1o4jdf5-pulseGlow{0%{box-shadow:0 0 4px rgba(239,68,68,.1)}to{box-shadow:0 0 12px rgba(239,68,68,.35)}}@-webkit-keyframes svelte-1o4jdf5-searchPulse{0%{border-color:rgba(var(--color-neon-gold,#e6b900), .4)}to{border-color:rgba(var(--color-neon-gold,#e6b900), .95)}}@keyframes svelte-1o4jdf5-searchPulse{0%{border-color:rgba(var(--color-neon-gold,#e6b900), .4)}to{border-color:rgba(var(--color-neon-gold,#e6b900), .95)}}@-webkit-keyframes svelte-1o4jdf5-flashGlow{0%,to{border-color:var(--border-light,rgba(255,255,255,.05));box-shadow:none}50%{border-color:rgba(var(--color-neon-red,#f34), .8);box-shadow:0 0 20px rgba(var(--color-neon-red,#f34), .35)}}@keyframes svelte-1o4jdf5-flashGlow{0%,to{border-color:var(--border-light,rgba(255,255,255,.05));box-shadow:none}50%{border-color:rgba(var(--color-neon-red,#f34), .8);box-shadow:0 0 20px rgba(var(--color-neon-red,#f34), .35)}}.mp-backdrop.svelte-1o4jdf5{z-index:1000;-webkit-backdrop-filter:blur(12px);background:rgba(0,0,0,.55);justify-content:center;align-items:center;display:flex;position:fixed;top:0;bottom:0;left:0;right:0}.mp-container.svelte-1o4jdf5{-webkit-backdrop-filter:blur(24px)saturate(180%);--mp-vox-rgb:230, 185, 0;--mp-ins-rgb:255, 236, 170;--mp-deep-rgb:255, 122, 0;--mp-ink-rgb:8, 8, 10;--mp-accent-rgb:var(--mp-vox-rgb);--glow-color:rgba(var(--mp-accent-rgb), .85);--glow-light:rgba(var(--mp-accent-rgb), .6);--badge-bg:rgba(var(--mp-accent-rgb), .13);--badge-border:rgba(var(--mp-accent-rgb), .28);--badge-text:rgba(var(--mp-accent-rgb), .9);--badge-bg-hover:rgba(var(--mp-accent-rgb), .22);--badge-border-hover:rgba(var(--mp-accent-rgb), .45);--active-row-bg:rgba(var(--mp-accent-rgb), .07);--active-btn-text:rgba(var(--mp-accent-rgb), .9);--active-title:rgba(var(--mp-accent-rgb), .95);--play-gradient-start:rgba(var(--mp-accent-rgb), .95);--play-gradient-end:rgba(var(--mp-deep-rgb), .95);--play-glow:rgba(var(--mp-accent-rgb), .4);--play-ink:rgb(var(--mp-ink-rgb));--progress-gradient-start:rgba(var(--mp-accent-rgb), .9);--progress-gradient-end:rgba(var(--mp-deep-rgb), .8);background:rgba(7,7,11,.94);border:1px solid rgba(255,255,255,.07);border-radius:22px;flex-direction:column;width:94vw;max-width:1080px;height:90vh;max-height:820px;-webkit-animation:.38s cubic-bezier(.16,1,.3,1) forwards svelte-1o4jdf5-mpIn;animation:.38s cubic-bezier(.16,1,.3,1) forwards svelte-1o4jdf5-mpIn;display:flex;overflow:hidden;box-shadow:0 40px 100px rgba(0,0,0,.9),inset 0 1px rgba(255,255,255,.06)}.mp-container.theme-inst.svelte-1o4jdf5{--mp-accent-rgb:var(--mp-ins-rgb)}.mp-container.closing.svelte-1o4jdf5{-webkit-animation:.3s cubic-bezier(.4,0,1,1) forwards svelte-1o4jdf5-mpOut;animation:.3s cubic-bezier(.4,0,1,1) forwards svelte-1o4jdf5-mpOut}@-webkit-keyframes svelte-1o4jdf5-mpIn{0%{opacity:0;transform:translateY(28px)scale(.97)}to{opacity:1;transform:none}}@keyframes svelte-1o4jdf5-mpIn{0%{opacity:0;transform:translateY(28px)scale(.97)}to{opacity:1;transform:none}}@-webkit-keyframes svelte-1o4jdf5-mpOut{0%{opacity:1;transform:none}to{opacity:0;transform:translateY(18px)scale(.97)}}@keyframes svelte-1o4jdf5-mpOut{0%{opacity:1;transform:none}to{opacity:0;transform:translateY(18px)scale(.97)}}.mp-body.svelte-1o4jdf5{flex:1;grid-template-rows:1fr;grid-template-columns:1fr;display:grid;overflow:hidden}.mp-body.svelte-1o4jdf5>:where(.svelte-1o4jdf5){grid-area:1/1;width:100%;min-width:0;height:100%;min-height:0}.songs-layout.svelte-1o4jdf5{height:100%;display:flex;overflow:hidden}.player-side.svelte-1o4jdf5{background:rgba(0,0,0,.12);border-right:1px solid rgba(255,255,255,.05);flex-direction:column;flex-shrink:0;align-items:center;gap:13px;width:320px;min-width:260px;padding:22px 18px 16px;display:flex;overflow-x:hidden;overflow-y:auto}.player-top-block.svelte-1o4jdf5{flex-direction:column;align-items:center;width:100%;min-width:0;display:flex}.vinyl-wrapper.svelte-1o4jdf5{flex-shrink:0;width:210px;height:210px;position:relative}.vinyl-record.svelte-1o4jdf5{background:repeating-radial-gradient(circle,rgba(255,255,255,.07) 0,rgba(255,255,255,.07) .6px,transparent .6px,transparent 2.4px),radial-gradient(circle,transparent 44%,#060607 44.4%,#060607 45.4%,transparent 45.8%,transparent 59%,#060607 59.4%,#060607 60.4%,transparent 60.8%,transparent 77%,#060607 77.4%,#060607 78.2%,transparent 78.6%),radial-gradient(circle,#060607 0%,#060607 24%,#19191c 25%,#19191c 95.5%,#060607 96.5%,#060607 100%);border-radius:50%;justify-content:center;align-items:center;width:210px;height:210px;-webkit-animation:2.6s linear infinite paused svelte-1o4jdf5-vspin;animation:2.6s linear infinite paused svelte-1o4jdf5-vspin;display:flex;position:relative;box-shadow:0 0 0 1px rgba(255,255,255,.06),0 10px 44px rgba(0,0,0,.9),inset 0 0 0 2px rgba(0,0,0,.6),inset 0 0 26px rgba(0,0,0,.55)}.vinyl-record.spinning.svelte-1o4jdf5{box-shadow:0 0 0 1px rgba(255,255,255,.06), 0 10px 44px rgba(0,0,0,.9), 0 0 46px -14px var(--glow-light,transparent), inset 0 0 0 2px rgba(0,0,0,.6), inset 0 0 26px rgba(0,0,0,.55);-webkit-animation-play-state:running;animation-play-state:running}.vinyl-record-clicker.svelte-1o4jdf5{position:relative}.vinyl-record-clicker.svelte-1o4jdf5:after{content:"";pointer-events:none;z-index:4;background:conic-gradient(from 28deg,transparent 0deg,rgba(255,255,255,.24) 16deg,transparent 40deg,transparent 180deg,rgba(255,255,255,.12) 198deg,transparent 222deg,transparent 360deg);border-radius:50%;position:absolute;top:0;bottom:0;left:0;right:0;-webkit-mask-image:radial-gradient(circle,transparent 24%,#000 25.5%,#000 96%,transparent 97%);mask-image:radial-gradient(circle,transparent 24%,#000 25.5%,#000 96%,transparent 97%)}@-webkit-keyframes svelte-1o4jdf5-vspin{to{transform:rotate(360deg)}}@keyframes svelte-1o4jdf5-vspin{to{transform:rotate(360deg)}}.vinyl-wrapper.deck-glitch.svelte-1o4jdf5>:where(.svelte-1o4jdf5){-webkit-animation:3.4s step-end infinite svelte-1o4jdf5-deck-glitch-jolt;animation:3.4s step-end infinite svelte-1o4jdf5-deck-glitch-jolt}.vinyl-wrapper.deck-glitch.svelte-1o4jdf5 .vinyl-record:where(.svelte-1o4jdf5){-webkit-animation:.42s steps(2,end) infinite svelte-1o4jdf5-deck-stuck;animation:.42s steps(2,end) infinite svelte-1o4jdf5-deck-stuck}.vinyl-wrapper.deck-glitch.svelte-1o4jdf5:after{content:"";z-index:20;pointer-events:none;mix-blend-mode:screen;background:linear-gradient(transparent 0,transparent 46%,rgba(255,40,80,.28) 46%,rgba(255,40,80,.28) 49%,transparent 49%),repeating-linear-gradient(0deg,rgba(0,0,0,.28) 0,rgba(0,0,0,.28) 1px,transparent 1px,transparent 3px);-webkit-animation:3.4s step-end infinite svelte-1o4jdf5-deck-glitch-tear;animation:3.4s step-end infinite svelte-1o4jdf5-deck-glitch-tear;position:absolute;top:0;bottom:0;left:0;right:0}@-webkit-keyframes svelte-1o4jdf5-deck-stuck{0%{transform:rotate(-3deg)}50%{transform:rotate(4deg)}}@keyframes svelte-1o4jdf5-deck-stuck{0%{transform:rotate(-3deg)}50%{transform:rotate(4deg)}}@-webkit-keyframes svelte-1o4jdf5-deck-glitch-jolt{0%{-webkit-filter:drop-shadow(5px 0 rgba(255,0,70,.75))drop-shadow(-5px 0 rgba(0,240,255,.75));filter:drop-shadow(5px 0 rgba(255,0,70,.75))drop-shadow(-5px 0 rgba(0,240,255,.75));transform:translate(-5px,1px)skew(-6deg)}3%{-webkit-filter:drop-shadow(-7px 0 rgba(255,0,70,.75))drop-shadow(7px 0 rgba(0,240,255,.75))saturate(2.2);filter:drop-shadow(-7px 0 rgba(255,0,70,.75))drop-shadow(7px 0 rgba(0,240,255,.75))saturate(2.2);transform:translate(6px,-2px)skew(9deg)}6%{-webkit-filter:drop-shadow(3px 0 rgba(255,0,70,.7))drop-shadow(-3px 0 rgba(0,240,255,.7))hue-rotate(80deg);filter:drop-shadow(3px 0 rgba(255,0,70,.7))drop-shadow(-3px 0 rgba(0,240,255,.7))hue-rotate(80deg);transform:translate(-3px,3px)scaleY(.94)}9%{-webkit-filter:drop-shadow(-4px 0 rgba(255,0,70,.75))drop-shadow(4px 0 rgba(0,240,255,.75))contrast(1.6);filter:drop-shadow(-4px 0 rgba(255,0,70,.75))drop-shadow(4px 0 rgba(0,240,255,.75))contrast(1.6);transform:translate(4px)skew(-12deg)}12%{-webkit-filter:drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6));filter:drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6));transform:translate(-2px,-1px)}15%{-webkit-filter:grayscale(.55)brightness(.8);filter:grayscale(.55)brightness(.8);transform:none}62%{-webkit-filter:drop-shadow(-4px 0 rgba(255,0,70,.7))drop-shadow(4px 0 rgba(0,240,255,.7));filter:drop-shadow(-4px 0 rgba(255,0,70,.7))drop-shadow(4px 0 rgba(0,240,255,.7));transform:translate(3px)skew(5deg)}65%{-webkit-filter:drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6))grayscale(.4);filter:drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6))grayscale(.4);transform:translate(-2px,1px)}68%,to{-webkit-filter:grayscale(.55)brightness(.8);filter:grayscale(.55)brightness(.8);transform:none}}@keyframes svelte-1o4jdf5-deck-glitch-jolt{0%{-webkit-filter:drop-shadow(5px 0 rgba(255,0,70,.75))drop-shadow(-5px 0 rgba(0,240,255,.75));filter:drop-shadow(5px 0 rgba(255,0,70,.75))drop-shadow(-5px 0 rgba(0,240,255,.75));transform:translate(-5px,1px)skew(-6deg)}3%{-webkit-filter:drop-shadow(-7px 0 rgba(255,0,70,.75))drop-shadow(7px 0 rgba(0,240,255,.75))saturate(2.2);filter:drop-shadow(-7px 0 rgba(255,0,70,.75))drop-shadow(7px 0 rgba(0,240,255,.75))saturate(2.2);transform:translate(6px,-2px)skew(9deg)}6%{-webkit-filter:drop-shadow(3px 0 rgba(255,0,70,.7))drop-shadow(-3px 0 rgba(0,240,255,.7))hue-rotate(80deg);filter:drop-shadow(3px 0 rgba(255,0,70,.7))drop-shadow(-3px 0 rgba(0,240,255,.7))hue-rotate(80deg);transform:translate(-3px,3px)scaleY(.94)}9%{-webkit-filter:drop-shadow(-4px 0 rgba(255,0,70,.75))drop-shadow(4px 0 rgba(0,240,255,.75))contrast(1.6);filter:drop-shadow(-4px 0 rgba(255,0,70,.75))drop-shadow(4px 0 rgba(0,240,255,.75))contrast(1.6);transform:translate(4px)skew(-12deg)}12%{-webkit-filter:drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6));filter:drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6));transform:translate(-2px,-1px)}15%{-webkit-filter:grayscale(.55)brightness(.8);filter:grayscale(.55)brightness(.8);transform:none}62%{-webkit-filter:drop-shadow(-4px 0 rgba(255,0,70,.7))drop-shadow(4px 0 rgba(0,240,255,.7));filter:drop-shadow(-4px 0 rgba(255,0,70,.7))drop-shadow(4px 0 rgba(0,240,255,.7));transform:translate(3px)skew(5deg)}65%{-webkit-filter:drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6))grayscale(.4);filter:drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6))grayscale(.4);transform:translate(-2px,1px)}68%,to{-webkit-filter:grayscale(.55)brightness(.8);filter:grayscale(.55)brightness(.8);transform:none}}@-webkit-keyframes svelte-1o4jdf5-deck-glitch-tear{0%{opacity:1;transform:translateY(-38%)}3%{transform:translateY(24%)}6%{transform:translateY(-12%)}9%{transform:translateY(36%)}12%{transform:translateY(4%)}15%{opacity:.25;transform:translateY(0)}62%{opacity:1;transform:translateY(-20%)}65%{transform:translateY(30%)}68%,to{opacity:.25;transform:translateY(0)}}@keyframes svelte-1o4jdf5-deck-glitch-tear{0%{opacity:1;transform:translateY(-38%)}3%{transform:translateY(24%)}6%{transform:translateY(-12%)}9%{transform:translateY(36%)}12%{transform:translateY(4%)}15%{opacity:.25;transform:translateY(0)}62%{opacity:1;transform:translateY(-20%)}65%{transform:translateY(30%)}68%,to{opacity:.25;transform:translateY(0)}}@media (prefers-reduced-motion:reduce){.vinyl-wrapper.deck-glitch.svelte-1o4jdf5:after{-webkit-animation:none;animation:none}.vinyl-wrapper.deck-glitch.svelte-1o4jdf5>:where(.svelte-1o4jdf5){-webkit-animation:none;animation:none}.vinyl-wrapper.deck-glitch.svelte-1o4jdf5 .vinyl-record:where(.svelte-1o4jdf5){-webkit-animation:none;animation:none}.vinyl-wrapper.deck-glitch.svelte-1o4jdf5>:where(.svelte-1o4jdf5){-webkit-filter:grayscale(.55)brightness(.8)drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6));filter:grayscale(.55)brightness(.8)drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6))}}.groove.svelte-1o4jdf5{pointer-events:none;border:1px solid rgba(255,255,255,.03);border-radius:50%;position:absolute}.g1.svelte-1o4jdf5{width:72%;height:72%}.g2.svelte-1o4jdf5{width:56%;height:56%}.g3.svelte-1o4jdf5{border-color:rgba(255,255,255,.024);width:40%;height:40%}.g4.svelte-1o4jdf5{border-color:rgba(255,255,255,.02);width:86%;height:86%}.record-label.svelte-1o4jdf5{z-index:2;width:88px;height:88px;box-shadow:0 0 0 1px rgba(0,0,0,.8), 0 0 0 3px var(--badge-border,transparent), 0 2px 14px rgba(0,0,0,.65);background:#111;border:2px solid rgba(255,255,255,.1);border-radius:50%;position:relative;overflow:hidden}.record-art.svelte-1o4jdf5{object-fit:cover;opacity:0;width:100%;height:100%;transition:opacity .4s}.record-art.loaded.svelte-1o4jdf5{opacity:1}.spindle.svelte-1o4jdf5{z-index:3;background:radial-gradient(circle at 35% 30%,#fff 0%,#999 35%,#333 100%);border-radius:50%;width:7px;height:7px;position:absolute;box-shadow:0 0 0 1.5px rgba(0,0,0,.85),0 1px 4px rgba(0,0,0,.8)}.tonearm.svelte-1o4jdf5{transform-origin:top;z-index:5;background:linear-gradient(#888 0%,#555 60%,#333 100%);border-radius:2px;width:4px;height:96px;transition:transform .9s cubic-bezier(.4,0,.2,1);position:absolute;top:6px;right:-6px;transform:rotate(-15deg);box-shadow:0 2px 8px rgba(0,0,0,.5)}.tonearm.svelte-1o4jdf5:after{content:"";background:var(--glow-color,rgba(230,185,0,.85));width:8px;height:8px;box-shadow:0 0 8px var(--glow-light,rgba(230,185,0,.6));border-radius:50%;position:absolute;bottom:-4px;left:-2px}.tonearm.playing.svelte-1o4jdf5{transform:rotate(22deg)}.track-info.svelte-1o4jdf5{text-align:center;width:100%;min-width:0;overflow:hidden}.scroll-container.svelte-1o4jdf5{white-space:nowrap;text-align:center;width:100%;overflow:hidden}.scroll-container.overflowing.svelte-1o4jdf5{text-align:left}.scroll-text.svelte-1o4jdf5{white-space:nowrap;display:inline-block}.scroll-text.animate-scroll.svelte-1o4jdf5{-webkit-animation:8s linear infinite alternate svelte-1o4jdf5-scroll-text;animation:8s linear infinite alternate svelte-1o4jdf5-scroll-text}@-webkit-keyframes svelte-1o4jdf5-scroll-text{0%,15%{transform:translate(0)}85%,to{transform:translateX(var(--scroll-dist))}}@keyframes svelte-1o4jdf5-scroll-text{0%,15%{transform:translate(0)}85%,to{transform:translateX(var(--scroll-dist))}}.track-title.svelte-1o4jdf5{letter-spacing:.06em;color:rgba(255,255,255,.94);margin:0 0 4px;font-family:Outfit,Inter,sans-serif;font-size:1.2rem;font-weight:800}.track-artist.svelte-1o4jdf5{color:rgba(255,255,255,.55);margin:0 0 2px;font-family:Inter,sans-serif;font-size:.82rem}.track-album.svelte-1o4jdf5{color:rgba(255,255,255,.28);text-transform:uppercase;letter-spacing:.06em;margin:0;font-family:Outfit,monospace;font-size:.68rem}.tr-share-btn.svelte-1o4jdf5,.tr-download-btn.svelte-1o4jdf5{color:rgba(255,255,255,.45);cursor:pointer;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:6px;flex-shrink:0;justify-content:center;align-items:center;width:24px;height:24px;transition:all .2s;display:flex}.tr-share-btn.svelte-1o4jdf5:hover,.tr-download-btn.svelte-1o4jdf5:hover{color:rgba(255,255,255,.9);background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.16)}.player-share-btn.svelte-1o4jdf5,.player-download-btn.svelte-1o4jdf5{background:var(--badge-bg,rgba(230,185,0,.13));border:1px solid var(--badge-border,rgba(230,185,0,.28));width:22px;height:22px;color:var(--badge-text,rgba(230,185,0,.9));cursor:pointer;border-radius:50%;flex-shrink:0;justify-content:center;align-items:center;transition:all .2s;display:flex}.player-share-btn.svelte-1o4jdf5:hover,.player-download-btn.svelte-1o4jdf5:hover{background:var(--badge-bg-hover,rgba(230,185,0,.22));color:rgb(var(--mp-accent-rgb,230, 185, 0));border-color:var(--badge-border-hover,rgba(230,185,0,.45))}.player-tether.svelte-1o4jdf5{flex-shrink:0;display:flex;position:relative}.player-tether-btn.svelte-1o4jdf5{background:var(--bg-input,rgba(255,255,255,.04));border:1px solid var(--color-neon-green,#00d75f);width:22px;height:22px;color:var(--color-neon-green,#00d75f);cursor:pointer;border-radius:50%;flex-shrink:0;justify-content:center;align-items:center;display:flex}.player-tether-lost.svelte-1o4jdf5{border-color:var(--color-neon-gold,#e6b900);color:var(--color-neon-gold,#e6b900);-webkit-animation:1.6s ease-in-out infinite svelte-1o4jdf5-player-tether-wait;animation:1.6s ease-in-out infinite svelte-1o4jdf5-player-tether-wait}@-webkit-keyframes svelte-1o4jdf5-player-tether-wait{50%{opacity:.35}}@keyframes svelte-1o4jdf5-player-tether-wait{50%{opacity:.35}}.player-tether-hint.svelte-1o4jdf5{background:var(--bg-app,#050508);border:1px solid var(--color-neon-green,#00d75f);color:#fff;text-align:left;z-index:20;pointer-events:none;border-radius:8px;width:240px;max-width:70vw;padding:8px 10px;font-size:.7rem;line-height:1.4;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translate(-50%)}.tr-download-btn.downloading.svelte-1o4jdf5,.player-download-btn.downloading.svelte-1o4jdf5{pointer-events:none;-webkit-animation:1s ease-in-out infinite svelte-1o4jdf5-download-pulse;animation:1s ease-in-out infinite svelte-1o4jdf5-download-pulse}@-webkit-keyframes svelte-1o4jdf5-download-pulse{50%{opacity:.35}}@keyframes svelte-1o4jdf5-download-pulse{50%{opacity:.35}}.progress-row.svelte-1o4jdf5{align-items:center;gap:8px;width:100%;display:flex}.ptime.svelte-1o4jdf5{color:rgba(255,255,255,.3);text-align:center;min-width:28px;font-family:monospace;font-size:.65rem}.progress-wrap.svelte-1o4jdf5{cursor:pointer;background:rgba(255,255,255,.1);border-radius:3px;flex:1;height:3px;position:relative}.seek-input.svelte-1o4jdf5{opacity:0;cursor:pointer;width:100%;height:24px;margin:0;position:absolute;top:-10px;bottom:-10px;left:0;right:0}.controls-row.svelte-1o4jdf5{justify-content:center;align-items:center;gap:10px;width:100%;margin-top:10px;margin-bottom:6px;display:flex}.ctrl.svelte-1o4jdf5{color:rgba(255,255,255,.5);cursor:pointer;background:0 0;border:none;border-radius:50%;justify-content:center;align-items:center;padding:0;transition:all .15s;display:flex}.ctrl.svelte-1o4jdf5:hover{color:rgba(255,255,255,.9);transform:scale(1.1)}.ctrl.svelte-1o4jdf5:active{transform:scale(.95)}.ctrl-xs.svelte-1o4jdf5{width:26px;height:26px}.ctrl-sm.svelte-1o4jdf5{width:30px;height:30px}.ctrl-md.svelte-1o4jdf5{color:rgba(255,255,255,.72);width:38px;height:38px}.ctrl-md.svelte-1o4jdf5:hover{color:#fff}.ctrl-play.svelte-1o4jdf5{color:var(--play-ink,#fff);width:54px;height:54px;background:linear-gradient(135deg, var(--play-gradient-start,rgba(230,185,0,.92)) 0%, var(--play-gradient-end,rgba(255,122,0,.92)) 100%);box-shadow:0 4px 22px var(--play-glow,rgba(230,185,0,.5));border-radius:50%;transition:all .2s}.ctrl-play.ctrl-error.svelte-1o4jdf5{color:#050508;background:linear-gradient(135deg,#f59e0b 0%,#d97706 100%);box-shadow:0 4px 22px rgba(245,158,11,.5)}.ctrl-play.ctrl-error.svelte-1o4jdf5:hover{transform:scale(1.07);box-shadow:0 6px 30px rgba(245,158,11,.7)}.ctrl-play.svelte-1o4jdf5:active{transform:scale(.97)}.active-ctrl.svelte-1o4jdf5{color:var(--active-btn-text,rgba(230,185,0,.9))!important}.spin-ring.svelte-1o4jdf5{border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;width:18px;height:18px;-webkit-animation:.7s linear infinite svelte-1o4jdf5-sr;animation:.7s linear infinite svelte-1o4jdf5-sr}@-webkit-keyframes svelte-1o4jdf5-sr{to{transform:rotate(360deg)}}@keyframes svelte-1o4jdf5-sr{to{transform:rotate(360deg)}}.tracklist-side.svelte-1o4jdf5{flex-direction:column;flex:1;min-width:0;display:flex;overflow:hidden}.tl-header.svelte-1o4jdf5{letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.28);border-bottom:1px solid rgba(255,255,255,.05);flex-shrink:0;align-items:center;gap:7px;padding:14px 22px 10px;font-family:Outfit,monospace;font-size:.68rem;font-weight:700;display:flex}.tl-count.svelte-1o4jdf5{background:rgba(255,255,255,.07);border-radius:10px;margin-left:auto;padding:2px 8px;font-size:.62rem}.tracklist.svelte-1o4jdf5{flex:1;padding:6px 0;overflow-y:auto}.track-row.svelte-1o4jdf5{cursor:pointer;align-items:center;gap:12px;padding:10px 22px;transition:background .14s;display:flex;position:relative}.track-row.svelte-1o4jdf5:hover,.track-row.kb-focused.svelte-1o4jdf5{background:rgba(255,255,255,.04)}.track-row.kb-focused.svelte-1o4jdf5{outline-offset:-3px;outline:1px dashed rgba(255,255,255,.25)}.track-row.fetch-error.svelte-1o4jdf5{background:rgba(245,158,11,.03);border-left:3px solid rgba(245,158,11,.4)}.track-row.fetch-error.svelte-1o4jdf5:hover,.track-row.fetch-error.kb-focused.svelte-1o4jdf5{background:rgba(245,158,11,.06)}.track-row.fetch-error.svelte-1o4jdf5 .tr-title:where(.svelte-1o4jdf5){color:#f59e0b!important}.track-row.active.fetch-error.svelte-1o4jdf5{background:rgba(245,158,11,.1)!important}.track-row.active.fetch-error.svelte-1o4jdf5:before{background:#f59e0b!important}.track-row.active.svelte-1o4jdf5{background:var(--active-row-bg,rgba(230,185,0,.07))}.track-row.active.svelte-1o4jdf5:before{content:"";background:linear-gradient(to bottom, var(--glow-color,rgba(230,185,0,.9)), var(--progress-gradient-end,rgba(255,122,0,.7)));border-radius:0 2px 2px 0;width:3px;position:absolute;top:0;bottom:0;left:0}.tr-num.svelte-1o4jdf5{text-align:center;color:rgba(255,255,255,.28);flex-shrink:0;width:18px;font-family:monospace;font-size:.72rem}.tr-art.svelte-1o4jdf5{object-fit:cover;background:rgba(255,255,255,.05);border-radius:6px;flex-shrink:0;width:42px;height:42px}.tr-info.svelte-1o4jdf5{flex-direction:column;flex:1;gap:2px;min-width:0;display:flex}.tr-title.svelte-1o4jdf5{color:rgba(255,255,255,.86);white-space:nowrap;text-overflow:ellipsis;font-family:Outfit,Inter,sans-serif;font-size:.86rem;font-weight:600;overflow:hidden}.track-row.active.svelte-1o4jdf5 .tr-title:where(.svelte-1o4jdf5){color:var(--active-title,rgba(230,185,0,.95))}.tr-meta.svelte-1o4jdf5{color:rgba(255,255,255,.33);white-space:nowrap;text-overflow:ellipsis;font-family:Inter,sans-serif;font-size:.7rem;overflow:hidden}.inst-chip-link.svelte-1o4jdf5{letter-spacing:.1em;color:#22c55e;cursor:pointer;flex-shrink:0;padding:2px;font-size:.56rem;font-weight:700;text-decoration:underline;transition:color .2s}.inst-chip-link.svelte-1o4jdf5:hover{color:#16a34a}.eq.svelte-1o4jdf5{align-items:flex-end;gap:2px;height:15px;display:flex}.eq-b.svelte-1o4jdf5{background:var(--glow-color,rgba(230,185,0,.85));border-radius:1px;width:3px;-webkit-animation:.55s infinite alternate svelte-1o4jdf5-eq;animation:.55s infinite alternate svelte-1o4jdf5-eq}.eq-b.svelte-1o4jdf5:first-child{height:60%;-webkit-animation-delay:0s;animation-delay:0s}.eq-b.svelte-1o4jdf5:nth-child(2){height:100%;-webkit-animation-delay:.15s;animation-delay:.15s}.eq-b.svelte-1o4jdf5:nth-child(3){height:45%;-webkit-animation-delay:.3s;animation-delay:.3s}@-webkit-keyframes svelte-1o4jdf5-eq{0%{transform:scaleY(.35)}to{transform:scaleY(1)}}@keyframes svelte-1o4jdf5-eq{0%{transform:scaleY(.35)}to{transform:scaleY(1)}}.mp-footer.svelte-1o4jdf5{color:rgba(255,255,255,.22);letter-spacing:.06em;background:rgba(0,0,0,.22);border-top:1px solid rgba(255,255,255,.05);flex-shrink:0;justify-content:space-between;align-items:center;height:36px;padding:0 22px;font-family:monospace;font-size:.62rem;display:flex}.mp-status.svelte-1o4jdf5{align-items:center;gap:7px;display:flex}.mp-dot.svelte-1o4jdf5{background:#0f6;border-radius:50%;width:5px;height:5px;box-shadow:0 0 5px rgba(0,255,102,.55)}.scroll-y.svelte-1o4jdf5{overflow-x:hidden;overflow-y:auto}.scroll-y.svelte-1o4jdf5::-webkit-scrollbar{width:4px}.scroll-y.svelte-1o4jdf5::-webkit-scrollbar-track{background:0 0}.scroll-y.svelte-1o4jdf5::-webkit-scrollbar-thumb{background:rgba(255,255,255,.07);border-radius:2px}.scroll-y.svelte-1o4jdf5::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,.16)}@media (min-width:641px) and (max-height:780px){.mp-container.svelte-1o4jdf5{height:96vh}}@media (min-width:641px) and (max-height:760px){.player-side.svelte-1o4jdf5{gap:10px;padding:14px 16px 12px}.vinyl-wrapper.svelte-1o4jdf5,.vinyl-record.svelte-1o4jdf5{width:max(90px,min(96vh - 450px,210px));height:max(90px,min(96vh - 450px,210px))}.record-label.svelte-1o4jdf5{width:42%;height:42%}.tonearm.svelte-1o4jdf5{height:45%}.track-title.svelte-1o4jdf5{font-size:1.05rem}.track-artist.svelte-1o4jdf5,.track-album.svelte-1o4jdf5{font-size:.74rem}.progress-row.svelte-1o4jdf5 .progress-wrap:where(.svelte-1o4jdf5){height:28px}.ctrl-play.svelte-1o4jdf5{width:46px;height:46px}.player-controls-block.svelte-1o4jdf5>div:where(.svelte-1o4jdf5){margin-top:4px}}@media (min-width:641px) and (max-height:560px){.mp-footer.svelte-1o4jdf5{display:none}.player-side.svelte-1o4jdf5{gap:8px;padding:10px 14px 8px}.player-top-block.svelte-1o4jdf5{flex-direction:row;justify-content:center;align-items:center;gap:14px;width:100%}.vinyl-wrapper.svelte-1o4jdf5,.vinyl-record.svelte-1o4jdf5{width:96px;height:96px}.player-top-block.svelte-1o4jdf5 .track-info:where(.svelte-1o4jdf5){flex:1;min-width:0;margin-top:0}.progress-row.svelte-1o4jdf5 .progress-wrap:where(.svelte-1o4jdf5){height:28px}.controls-row.svelte-1o4jdf5{gap:8px;margin-bottom:0}.ctrl-play.svelte-1o4jdf5{width:42px;height:42px}.ctrl-md.svelte-1o4jdf5{width:32px;height:32px}.player-controls-block.svelte-1o4jdf5>div:where(.svelte-1o4jdf5){margin-top:4px}}@media (max-width:640px){.mp-container.svelte-1o4jdf5{border-radius:0;width:100vw;height:100%;max-height:100%}.songs-layout.svelte-1o4jdf5{flex-direction:column;position:relative;overflow:hidden}.player-side.svelte-1o4jdf5{width:100%;min-width:unset;border-bottom:none;border-right:none;flex-direction:column;flex-shrink:0;justify-content:space-between;gap:8px;height:95%;max-height:none;padding:12px 14px;display:flex;overflow:hidden}.player-top-block.svelte-1o4jdf5{flex-direction:column;justify-content:center;align-items:center;height:62%;transition:transform .3s cubic-bezier(.16,1,.3,1),opacity .3s;display:flex}.player-controls-block.svelte-1o4jdf5{flex-direction:column;flex-shrink:0;justify-content:flex-end;gap:8px;height:38%;display:flex}.vinyl-wrapper.svelte-1o4jdf5,.vinyl-record.svelte-1o4jdf5{width:130px;height:130px}.record-label.svelte-1o4jdf5{width:52px;height:52px}.tonearm.svelte-1o4jdf5{height:70px}.tracklist-side.svelte-1o4jdf5{z-index:20;opacity:0;pointer-events:none;background:rgba(7,7,11,.98);border-bottom:1px solid rgba(255,255,255,.08);transition:transform .3s cubic-bezier(.16,1,.3,1),opacity .3s;position:absolute;top:0;left:0;right:0;transform:translateY(-100%);box-shadow:0 10px 30px rgba(0,0,0,.5);width:100%!important;height:62%!important;display:flex!important}.tracklist-side.show-mobile.svelte-1o4jdf5{opacity:1;pointer-events:auto;transform:translateY(0)}.mobile-close-bar.svelte-1o4jdf5{display:flex!important}.track-title.svelte-1o4jdf5{font-size:1rem}.track-artist.svelte-1o4jdf5,.track-album.svelte-1o4jdf5{font-size:.72rem}.track-info.svelte-1o4jdf5 .scroll-container:where(.svelte-1o4jdf5){cursor:pointer}.ctrl-play.svelte-1o4jdf5{width:46px;height:46px}}@media (max-width:640px) and (max-height:700px){.controls-row.svelte-1o4jdf5{margin-top:0;margin-bottom:0}.player-top-block.svelte-1o4jdf5{flex:1;height:auto;min-height:0}.player-controls-block.svelte-1o4jdf5{height:auto}.vinyl-wrapper.svelte-1o4jdf5,.vinyl-record.svelte-1o4jdf5{width:104px;height:104px}.record-label.svelte-1o4jdf5{width:42px;height:42px}}.panel-header.svelte-1o4jdf5{background:rgba(0,0,0,.2);border-bottom:1px solid rgba(255,255,255,.06);justify-content:space-between;align-items:center;height:64px;padding:0 24px;display:flex}.brand.svelte-1o4jdf5{align-items:center;gap:12px;display:flex}.brand.svelte-1o4jdf5 h1:where(.svelte-1o4jdf5){letter-spacing:.05em;text-transform:uppercase;color:rgba(255,255,255,.95);margin:0;font-family:Outfit,Inter,sans-serif;font-size:1.1rem;font-weight:700}.close-btn.svelte-1o4jdf5{color:rgba(255,255,255,.5);cursor:pointer;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.06);border-radius:50%;justify-content:center;align-items:center;width:32px;height:32px;transition:all .2s;display:flex}.close-btn.svelte-1o4jdf5:hover{color:#fff;background:rgba(255,255,255,.15);transform:translate(-4px)}.dj-crossfader.svelte-1o4jdf5{cursor:pointer;box-sizing:border-box;-webkit-user-select:none;user-select:none;background:linear-gradient(#1e1e24 0%,#121215 100%);border:1px solid rgba(255,255,255,.08);border-radius:8px;justify-content:space-between;align-items:center;gap:12px;width:100%;height:34px;padding:0 16px;display:flex;position:relative;box-shadow:inset 0 1px rgba(255,255,255,.05),0 8px 24px rgba(0,0,0,.5)}.fader-label.svelte-1o4jdf5{letter-spacing:.05em;color:rgba(255,255,255,.2);font-family:monospace;font-size:.65rem;font-weight:800;transition:color .2s}.fader-label.left-label.active.svelte-1o4jdf5{color:rgb(var(--mp-vox-rgb));text-shadow:0 0 8px rgba(var(--mp-vox-rgb), .4)}.fader-label.right-label.active.svelte-1o4jdf5{color:rgb(var(--mp-ins-rgb));text-shadow:0 0 8px rgba(var(--mp-ins-rgb), .4)}.dj-fader-slot.svelte-1o4jdf5{background:#000;border:1px solid rgba(255,255,255,.06);border-radius:2px;flex:1;height:4px;position:relative}.dj-fader-knob.svelte-1o4jdf5{background:linear-gradient(135deg,#666 0%,#333 50%,#222 100%);border:1px solid rgba(255,255,255,.25);border-radius:3px;justify-content:center;align-items:center;width:24px;height:18px;transition:left .18s cubic-bezier(.25,.8,.25,1);display:flex;position:absolute;top:50%;left:0%;transform:translateY(-50%);box-shadow:0 4px 10px rgba(0,0,0,.8),inset 0 1px rgba(255,255,255,.15)}.dj-fader-knob.svelte-1o4jdf5:after{content:"";background:#fff;width:2px;height:100%;box-shadow:0 0 3px rgba(255,255,255,.8)}.dj-fader-knob.right.svelte-1o4jdf5{left:calc(100% - 24px)}.volume-popover.svelte-1o4jdf5{z-index:50;pointer-events:auto;-webkit-backdrop-filter:blur(8px);background:rgba(15,15,20,.95);border:1px solid rgba(255,255,255,.1);border-radius:20px;align-items:center;gap:8px;min-width:150px;padding:6px 12px;display:flex;position:absolute;bottom:38px;left:50%;transform:translate(-50%);box-shadow:0 10px 25px rgba(0,0,0,.6)}.vol-slider-pop.svelte-1o4jdf5{height:3px;accent-color:rgb(var(--mp-accent-rgb));cursor:pointer;background:rgba(255,255,255,.1);border-radius:2px;outline:none;flex:1}.visualizer-container.svelte-1o4jdf5{background:#050508;border:1px solid rgba(255,255,255,.08);border-radius:50%;flex-direction:column;width:100%;height:100%;transition:border-radius .3s cubic-bezier(.25,.8,.25,1);display:flex;position:relative;overflow:hidden}.visualizer-canvas.svelte-1o4jdf5{z-index:1;width:100%;height:100%;display:block;position:absolute;top:0;bottom:0;left:0;right:0}.visualizer-overlay.svelte-1o4jdf5{z-index:10;justify-content:center;align-items:center;gap:8px;display:flex;position:absolute;bottom:16px;left:16px;right:16px}.visualizer-container.fullscreen.svelte-1o4jdf5{z-index:2000;border:none;width:100vw;height:100vh;position:fixed;top:0;bottom:0;left:0;right:0;border-radius:0!important}.visualizer-overlay.svelte-1o4jdf5{transition:opacity .45s}.visualizer-container.stage-idle.svelte-1o4jdf5{cursor:none}.visualizer-container.stage-idle.svelte-1o4jdf5 .visualizer-overlay:where(.svelte-1o4jdf5){opacity:0;pointer-events:none}.stage-frame.svelte-1o4jdf5{position:absolute;top:0;bottom:0;left:0;right:0;overflow:hidden;container-type:size}.stage-cover.svelte-1o4jdf5{object-fit:cover;-webkit-filter:blur(28px)brightness(.5);filter:blur(28px)brightness(.5);width:100%;height:100%;position:absolute;top:0;bottom:0;left:0;right:0;transform:scale(1.15)}.viz-label.svelte-1o4jdf5{z-index:2;border:2px solid rgba(255,255,255,.14);border-radius:50%;width:24%;height:24%;margin:-12% 0 0 -12%;-webkit-animation:5s linear infinite paused svelte-1o4jdf5-viz-label-spin;animation:5s linear infinite paused svelte-1o4jdf5-viz-label-spin;position:absolute;top:50%;left:50%;overflow:hidden;box-shadow:0 0 0 1px rgba(0,0,0,.8),0 2px 14px rgba(0,0,0,.65)}.viz-label.spinning.svelte-1o4jdf5{-webkit-animation-play-state:running;animation-play-state:running}.viz-art.svelte-1o4jdf5{object-fit:cover;width:100%;height:100%;display:block}.viz-spindle.svelte-1o4jdf5{z-index:3;background:rgba(5,5,8,.92);border-radius:50%;width:7px;height:7px;margin:-3.5px 0 0 -3.5px;position:absolute;top:50%;left:50%;box-shadow:0 0 0 1px rgba(255,255,255,.28)}@-webkit-keyframes svelte-1o4jdf5-viz-label-spin{to{transform:rotate(360deg)}}@keyframes svelte-1o4jdf5-viz-label-spin{to{transform:rotate(360deg)}}.tl-tab.svelte-1o4jdf5{min-height:28px;font:inherit;letter-spacing:inherit;text-transform:inherit;color:rgba(255,255,255,.28);cursor:pointer;border-radius:6px;align-items:center;gap:6px;padding:4px 8px;transition:color .15s,background .15s;display:flex}.tl-tab.svelte-1o4jdf5:hover{color:rgba(255,255,255,.6)}.tl-tab-on.svelte-1o4jdf5,.tl-tab-on.svelte-1o4jdf5:hover{color:rgba(255,255,255,.85);background:rgba(255,255,255,.06)}.tl-tab.svelte-1o4jdf5 .tl-count:where(.svelte-1o4jdf5){margin-left:0}.tl-header.svelte-1o4jdf5 .tl-sort-cycler{position:absolute;top:calc(50% + 2px);left:50%;transform:translate(-50%,-50%)}.tl-header.svelte-1o4jdf5 .tl-sort-cycler:active{transform:translate(-50%,-50%)scale(.88)}@media (prefers-reduced-motion:reduce){.viz-label.svelte-1o4jdf5{-webkit-animation:none;animation:none}}@-webkit-keyframes svelte-1o4jdf5-knob-wiggle{0%,to{transform:translateY(-50%)scale(1)}20%,60%{transform:translate(-3.5px,-50%)rotate(-4deg)}40%,80%{transform:translate(3.5px,-50%)rotate(4deg)}}@keyframes svelte-1o4jdf5-knob-wiggle{0%,to{transform:translateY(-50%)scale(1)}20%,60%{transform:translate(-3.5px,-50%)rotate(-4deg)}40%,80%{transform:translate(3.5px,-50%)rotate(4deg)}}.knob-jiggle.svelte-1o4jdf5{-webkit-animation:.3s ease-in-out svelte-1o4jdf5-knob-wiggle;animation:.3s ease-in-out svelte-1o4jdf5-knob-wiggle}.dj-fader-knob.fried.svelte-1o4jdf5{background:linear-gradient(135deg,#2c2222 0%,#1a1212 50%,#0f0505 100%)!important;border-color:rgba(239,68,68,.35)!important;box-shadow:0 4px 10px rgba(0,0,0,.9),0 0 8px rgba(239,68,68,.25)!important}.dj-fader-knob.fried.svelte-1o4jdf5:after{-webkit-animation:.15s infinite alternate svelte-1o4jdf5-fader-flicker;animation:.15s infinite alternate svelte-1o4jdf5-fader-flicker;background:#ef4444!important;box-shadow:0 0 5px #ef4444!important}@-webkit-keyframes svelte-1o4jdf5-fader-flicker{0%{opacity:.35}to{opacity:1}}@keyframes svelte-1o4jdf5-fader-flicker{0%{opacity:.35}to{opacity:1}}.dj-crossfader.fader-flash.svelte-1o4jdf5{-webkit-animation:.15s ease-out svelte-1o4jdf5-fader-flash-anim;animation:.15s ease-out svelte-1o4jdf5-fader-flash-anim}@-webkit-keyframes svelte-1o4jdf5-fader-flash-anim{0%{background:#f05;border-color:#fff;box-shadow:0 0 25px rgba(255,0,85,.8)}to{background:linear-gradient(#1e1e24 0%,#121215 100%);border-color:rgba(255,255,255,.08)}}@keyframes svelte-1o4jdf5-fader-flash-anim{0%{background:#f05;border-color:#fff;box-shadow:0 0 25px rgba(255,0,85,.8)}to{background:linear-gradient(#1e1e24 0%,#121215 100%);border-color:rgba(255,255,255,.08)}}.dj-crossfader.fader-fried.svelte-1o4jdf5{border-color:rgba(239,68,68,.25)!important;box-shadow:inset 0 0 8px rgba(239,68,68,.08),0 8px 24px rgba(0,0,0,.5)!important}.fader-fx-canvas.svelte-1o4jdf5{width:100vw;height:100vh;pointer-events:none;z-index:99999;height:100dvh;position:fixed;top:0;left:0}.cassette-tape.svelte-1o4jdf5{box-sizing:border-box;background:linear-gradient(135deg,#1f1f23 0%,#0d0d0f 100%);border:3px solid #2d2d34;border-radius:10px;flex-direction:column;justify-content:space-between;align-items:center;width:200px;height:125px;padding:10px;display:flex;position:relative;box-shadow:0 8px 24px rgba(0,0,0,.6)}@media (min-width:640px){.cassette-tape.svelte-1o4jdf5{border-width:4px;width:240px;height:150px;padding:12px}}.cassette-label.svelte-1o4jdf5{color:#fff;box-sizing:border-box;text-transform:uppercase;border-radius:4px;flex-direction:column;justify-content:center;align-items:center;width:100%;height:38px;padding:2px;font-family:monospace;font-weight:700;display:flex;box-shadow:inset 0 1px rgba(255,255,255,.1)}@media (min-width:640px){.cassette-label.svelte-1o4jdf5{height:46px}}.cassette-track-title.svelte-1o4jdf5{letter-spacing:.05em;white-space:nowrap;text-overflow:ellipsis;max-width:90%;font-size:9px;overflow:hidden}@media (min-width:640px){.cassette-track-title.svelte-1o4jdf5{font-size:11px}}.cassette-brand.svelte-1o4jdf5{opacity:.8;letter-spacing:.1em;margin-top:1px;font-size:7px}@media (min-width:640px){.cassette-brand.svelte-1o4jdf5{margin-top:2px;font-size:8px}}.cassette-window.svelte-1o4jdf5{border:2px solid #3f3f46;border-radius:5px;justify-content:space-around;align-items:center;width:110px;height:40px;margin-top:6px;display:flex;position:relative;overflow:hidden}@media (min-width:640px){.cassette-window.svelte-1o4jdf5{width:130px;height:48px;margin-top:8px}}.spindle-left.svelte-1o4jdf5,.spindle-right.svelte-1o4jdf5{box-sizing:border-box;z-index:5;border:3px dashed #71717a;border-radius:50%;width:18px;height:18px}@media (min-width:640px){.spindle-left.svelte-1o4jdf5,.spindle-right.svelte-1o4jdf5{border-width:4px;width:22px;height:22px}}.spindle-left.spinning.svelte-1o4jdf5,.spindle-right.spinning.svelte-1o4jdf5{-webkit-animation:4s linear infinite svelte-1o4jdf5-rotate-spindle;animation:4s linear infinite svelte-1o4jdf5-rotate-spindle}.tape-roll-left.svelte-1o4jdf5,.tape-roll-right.svelte-1o4jdf5{z-index:1;opacity:.85;border-radius:50%;position:absolute;top:50%;transform:translateY(-50%)}.tape-roll-left.spinning.svelte-1o4jdf5,.tape-roll-right.spinning.svelte-1o4jdf5{-webkit-animation:6s linear infinite svelte-1o4jdf5-rotate-spindle;animation:6s linear infinite svelte-1o4jdf5-rotate-spindle}.tape-roll-left.svelte-1o4jdf5{left:12px;transform:translateY(-50%)}@media (min-width:640px){.tape-roll-left.svelte-1o4jdf5{left:16px}}.tape-roll-right.svelte-1o4jdf5{right:12px;transform:translateY(-50%)}@media (min-width:640px){.tape-roll-right.svelte-1o4jdf5{right:16px}}@-webkit-keyframes svelte-1o4jdf5-rotate-spindle{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes svelte-1o4jdf5-rotate-spindle{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.waveform-slider-wrap.svelte-1o4jdf5{background:rgba(0,0,0,.45);border:1px solid rgba(255,255,255,.1);border-radius:6px;height:36px;transition:border-color .2s,background .2s}.waveform-slider-wrap.svelte-1o4jdf5 .seek-input:where(.svelte-1o4jdf5){margin:0;height:100%!important;top:0!important;bottom:0!important;left:0!important;right:0!important}.waveform-slider-wrap.svelte-1o4jdf5:hover{background:rgba(0,0,0,.55);border-color:rgba(255,255,255,.2)}.waveform-slider-wrap.svelte-1o4jdf5:hover .waveform-bar:where(.svelte-1o4jdf5):not(.active){background-color:rgba(255,255,255,.22)}.waveform-slider-wrap.svelte-1o4jdf5:hover .waveform-bar.active:where(.svelte-1o4jdf5){box-shadow:0 0 8px rgba(0,240,255,.6)}.waveform-bar.svelte-1o4jdf5{background-color:rgba(255,255,255,.12);border-radius:9999px;transition:background-color .2s,background .2s,box-shadow .2s}.waveform-bar.active.svelte-1o4jdf5{background:linear-gradient(#ff007f 0%,#00f0ff 100%);box-shadow:0 0 4px rgba(0,240,255,.4)}.floppy-disk.svelte-1o4jdf5{box-sizing:border-box;-webkit-clip-path:polygon(0 0,88% 0,100% 12%,100% 100%,0 100%);clip-path:polygon(0 0,88% 0,100% 12%,100% 100%,0 100%);background:linear-gradient(135deg,#1e293b 0%,#0f172a 100%);border:3px solid #334155;border-radius:8px;flex-direction:column;justify-content:space-between;width:160px;height:160px;padding:8px;display:flex;position:relative;box-shadow:0 8px 24px rgba(0,0,0,.65)}@media (min-width:640px){.floppy-disk.svelte-1o4jdf5{border-width:4px;width:190px;height:190px;padding:10px}}.floppy-corner.svelte-1o4jdf5{z-index:10;background:0 0;width:20px;height:20px;position:absolute;top:0;right:0}.floppy-write-protect.svelte-1o4jdf5{background:#020617;border:1px solid #334155;border-radius:1px;width:10px;height:10px;position:absolute;bottom:8px;left:8px}@media (min-width:640px){.floppy-write-protect.svelte-1o4jdf5{width:12px;height:12px;bottom:10px;left:10px}}.floppy-label.svelte-1o4jdf5{border-radius:4px;flex-direction:column;width:100%;height:65px;display:flex;position:relative;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,.3)}@media (min-width:640px){.floppy-label.svelte-1o4jdf5{height:80px}}.floppy-label-stripe.svelte-1o4jdf5{width:100%;height:6px}.floppy-label-stripe-blue.svelte-1o4jdf5{width:100%;height:3px}.floppy-label-content.svelte-1o4jdf5{background:#f8fafc;flex-direction:column;flex-grow:1;justify-content:center;align-items:center;padding:4px;display:flex}.floppy-song.svelte-1o4jdf5{color:#0f172a;text-align:center;text-transform:uppercase;width:90%;font-size:8px;font-weight:800}@media (min-width:640px){.floppy-song.svelte-1o4jdf5{font-size:10px}}.floppy-artist.svelte-1o4jdf5{color:#475569;text-align:center;text-transform:uppercase;width:90%;margin-top:1px;font-size:7px}@media (min-width:640px){.floppy-artist.svelte-1o4jdf5{margin-top:2px;font-size:8px}}.floppy-shutter-door.svelte-1o4jdf5{border:1px solid #1e293b;border-radius:3px;width:60px;height:40px;position:absolute;bottom:8px;left:50%;overflow:hidden;transform:translate(-50%)}@media (min-width:640px){.floppy-shutter-door.svelte-1o4jdf5{width:72px;height:48px;bottom:10px}}.floppy-shutter-slider.svelte-1o4jdf5{z-index:3;background:linear-gradient(90deg,#64748b 0%,#cbd5e1 50%,#64748b 100%);width:100%;height:100%;transition:transform .4s cubic-bezier(.16,1,.3,1);position:absolute;top:0;left:0}.floppy-shutter-slider.open.svelte-1o4jdf5{transform:translate(32px)}@media (min-width:640px){.floppy-shutter-slider.open.svelte-1o4jdf5{transform:translate(38px)}}.floppy-shutter-opening.svelte-1o4jdf5{z-index:1;border-radius:2px;justify-content:center;align-items:center;width:24px;height:32px;display:flex;position:absolute;top:4px;left:8px;overflow:hidden}@media (min-width:640px){.floppy-shutter-opening.svelte-1o4jdf5{width:28px;height:38px;top:5px;left:10px}}.floppy-magnetic-disc.svelte-1o4jdf5{border:2px dashed #475569;border-radius:50%;width:20px;height:20px}.floppy-magnetic-disc.spinning.svelte-1o4jdf5{-webkit-animation:2s linear infinite svelte-1o4jdf5-floppy-spin;animation:2s linear infinite svelte-1o4jdf5-floppy-spin}@media (min-width:640px){.floppy-magnetic-disc.svelte-1o4jdf5{width:24px;height:24px}}.floppy-drive-led.svelte-1o4jdf5{background:#dc2626;border-radius:50%;width:6px;height:6px;position:absolute;bottom:8px;right:8px;box-shadow:0 0 3px #dc2626}.floppy-drive-led.active.svelte-1o4jdf5{-webkit-animation:.4s ease-in-out infinite alternate svelte-1o4jdf5-floppy-led-blink;animation:.4s ease-in-out infinite alternate svelte-1o4jdf5-floppy-led-blink}@media (min-width:640px){.floppy-drive-led.svelte-1o4jdf5{width:7px;height:7px;bottom:10px;right:10px}}.music-box.svelte-1o4jdf5{box-sizing:border-box;background:linear-gradient(135deg,#78350f 0%,#451a03 100%);border:3px solid #d97706;border-radius:10px;justify-content:center;align-items:center;width:160px;height:110px;padding:6px;display:flex;position:relative;box-shadow:0 8px 24px rgba(0,0,0,.7)}@media (min-width:640px){.music-box.svelte-1o4jdf5{border-width:4px;width:190px;height:130px;padding:8px}}.music-box-key.svelte-1o4jdf5{z-index:-1;transform-origin:100%;align-items:center;width:15px;height:26px;display:flex;position:absolute;top:calc(50% - 13px);left:-18px}.music-box-key.svelte-1o4jdf5:before{content:"";border:2px .5 solid #f59e0b;background:0 0;border-radius:50%;width:12px;height:12px;position:absolute;left:-6px;box-shadow:0 0 4px rgba(245,158,11,.4)}.music-box-key.svelte-1o4jdf5:after{content:"";background:#b45309;width:12px;height:3px;position:absolute;right:0}.music-box-key.spinning.svelte-1o4jdf5{-webkit-animation:3s linear infinite svelte-1o4jdf5-key-spin;animation:3s linear infinite svelte-1o4jdf5-key-spin}@media (min-width:640px){.music-box-key.svelte-1o4jdf5{width:18px;height:30px;top:calc(50% - 15px);left:-22px}.music-box-key.svelte-1o4jdf5:before{border-width:3px;width:14px;height:14px;left:-8px}.music-box-key.svelte-1o4jdf5:after{width:14px;height:4px}}.music-box-interior.svelte-1o4jdf5{box-sizing:border-box;background:rgba(0,0,0,.55);border-radius:6px;flex-direction:column;justify-content:space-between;width:100%;height:100%;padding:6px;display:flex;position:relative;overflow:hidden}.music-box-gears.svelte-1o4jdf5{width:40px;height:40px;position:absolute;top:6px;left:6px}.music-box-gear.svelte-1o4jdf5{background:0 0;border:2px dashed #d97706;border-radius:50%;position:absolute}.music-box-gear.gear-1.svelte-1o4jdf5{width:22px;height:22px;top:2px;left:2px}.music-box-gear.gear-1.spinning.svelte-1o4jdf5{-webkit-animation:5s linear infinite svelte-1o4jdf5-gear-rotate;animation:5s linear infinite svelte-1o4jdf5-gear-rotate}.music-box-gear.gear-2.svelte-1o4jdf5{width:14px;height:14px;top:16px;left:18px}.music-box-gear.gear-2.spinning.svelte-1o4jdf5{-webkit-animation:4.2s linear infinite svelte-1o4jdf5-gear-rotate-reverse;animation:4.2s linear infinite svelte-1o4jdf5-gear-rotate-reverse}@media (min-width:640px){.music-box-gear.gear-1.svelte-1o4jdf5{width:26px;height:26px}.music-box-gear.gear-2.svelte-1o4jdf5{width:18px;height:18px;top:18px;left:22px}}.music-box-drum-wrap.svelte-1o4jdf5{align-items:center;width:70px;height:32px;display:flex;position:absolute;top:50%;right:14px;transform:translateY(-50%)}@media (min-width:640px){.music-box-drum-wrap.svelte-1o4jdf5{width:90px;height:38px;right:18px}}.music-box-drum.svelte-1o4jdf5{background:linear-gradient(#d97706 0%,#b45309 50%,#78350f 100%);border:1px solid #d97706;border-radius:6px;width:100%;height:12px;position:relative;overflow:hidden}.music-box-drum.svelte-1o4jdf5:after{content:"";background:repeating-linear-gradient(90deg,transparent,transparent 12px,#fef08a 14px,#f59e0b 15px,transparent 17px);width:200%;height:100%;position:absolute;top:0;left:-100%}@media (min-width:640px){.music-box-drum.svelte-1o4jdf5:after{background:repeating-linear-gradient(90deg,transparent,transparent 15px,#fef08a 17px,#f59e0b 18px,transparent 20px)}}.music-box-drum.spinning.svelte-1o4jdf5:after{-webkit-animation:2.2s linear infinite svelte-1o4jdf5-drum-roll;animation:2.2s linear infinite svelte-1o4jdf5-drum-roll}@media (min-width:640px){.music-box-drum.svelte-1o4jdf5{border-radius:8px;height:16px}}.music-box-comb.svelte-1o4jdf5{gap:2.5px;display:flex;position:absolute;bottom:6px;right:18px}@media (min-width:640px){.music-box-comb.svelte-1o4jdf5{gap:3.5px;bottom:8px;right:22px}}.comb-tooth.svelte-1o4jdf5{transform-origin:top;background:linear-gradient(#cbd5e1 0%,#475569 100%);border-radius:.5px;width:3px;height:18px}.comb-tooth.vibrating.svelte-1o4jdf5{-webkit-animation:.12s ease-in-out infinite alternate svelte-1o4jdf5-tooth-vibrate;animation:.12s ease-in-out infinite alternate svelte-1o4jdf5-tooth-vibrate}@media (min-width:640px){.comb-tooth.svelte-1o4jdf5{border-radius:1px;width:4px;height:24px}}@-webkit-keyframes svelte-1o4jdf5-floppy-spin{to{transform:rotate(360deg)}}@keyframes svelte-1o4jdf5-floppy-spin{to{transform:rotate(360deg)}}@-webkit-keyframes svelte-1o4jdf5-floppy-led-blink{0%{background:#22c55e;box-shadow:0 0 5px #22c55e}to{background:#166534;box-shadow:0 0 1px #166534}}@keyframes svelte-1o4jdf5-floppy-led-blink{0%{background:#22c55e;box-shadow:0 0 5px #22c55e}to{background:#166534;box-shadow:0 0 1px #166534}}@-webkit-keyframes svelte-1o4jdf5-key-spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes svelte-1o4jdf5-key-spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@-webkit-keyframes svelte-1o4jdf5-gear-rotate{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes svelte-1o4jdf5-gear-rotate{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@-webkit-keyframes svelte-1o4jdf5-gear-rotate-reverse{0%{transform:rotate(360deg)}to{transform:rotate(0)}}@keyframes svelte-1o4jdf5-gear-rotate-reverse{0%{transform:rotate(360deg)}to{transform:rotate(0)}}@-webkit-keyframes svelte-1o4jdf5-drum-roll{0%{transform:translate(0)}to{transform:translate(50%)}}@keyframes svelte-1o4jdf5-drum-roll{0%{transform:translate(0)}to{transform:translate(50%)}}@-webkit-keyframes svelte-1o4jdf5-tooth-vibrate{0%{transform:scaleY(1)}to{transform:scaleY(.85)skew(2deg)}}@keyframes svelte-1o4jdf5-tooth-vibrate{0%{transform:scaleY(1)}to{transform:scaleY(.85)skew(2deg)}}.arigato-modal-backdrop.svelte-1o4jdf5{z-index:2000;-webkit-backdrop-filter:blur(8px);background:rgba(0,0,0,.75);justify-content:center;align-items:center;width:100vw;height:100vh;display:flex;position:fixed;top:0;left:0}.arigato-modal-content.svelte-1o4jdf5{color:#e4e4e7;background:linear-gradient(135deg,#121214 0%,#0a0a0c 100%);border:1px solid rgba(239,68,68,.2);border-radius:16px;flex-direction:column;width:90vw;max-width:600px;height:80vh;font-family:monospace;display:flex;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,.8),inset 0 1px rgba(255,255,255,.05)}@media (max-width:640px){.arigato-modal-content.svelte-1o4jdf5{width:95vw;height:85vh}}.arigato-modal-header.svelte-1o4jdf5{background:rgba(255,255,255,.02);border-bottom:1px solid rgba(255,255,255,.08);justify-content:space-between;align-items:center;padding:16px 24px;display:flex}.arigato-modal-header.svelte-1o4jdf5 h2:where(.svelte-1o4jdf5){letter-spacing:.1em;color:#ef4444;text-transform:uppercase;margin:0;font-size:1rem;font-weight:700}.arigato-close-btn.svelte-1o4jdf5{color:rgba(255,255,255,.6);cursor:pointer;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:50%;justify-content:center;align-items:center;width:32px;height:32px;transition:all .2s;display:flex}.arigato-close-btn.svelte-1o4jdf5:hover{color:#fff;background:rgba(239,68,68,.2);border-color:rgba(239,68,68,.4);transform:translate(-2px)}.arigato-modal-body.svelte-1o4jdf5{color:#a1a1aa;flex:1;padding:24px;font-size:.85rem;line-height:1.5;overflow-y:auto}.arigato-modal-body.svelte-1o4jdf5 .intro-text:where(.svelte-1o4jdf5){white-space:pre-wrap;margin-bottom:16px}.arigato-modal-body.svelte-1o4jdf5 .outro-text:where(.svelte-1o4jdf5){white-space:pre-wrap;margin-bottom:16px}.arigato-modal-body.svelte-1o4jdf5 .intro-text:where(.svelte-1o4jdf5) a{color:#ef4444;text-decoration:underline}.arigato-modal-body.svelte-1o4jdf5 .outro-text:where(.svelte-1o4jdf5) a{color:#ef4444;text-decoration:underline}.arigato-modal-body.svelte-1o4jdf5 .intro-text:where(.svelte-1o4jdf5) a:hover{color:#fff}.arigato-modal-body.svelte-1o4jdf5 .outro-text:where(.svelte-1o4jdf5) a:hover{color:#fff}.arigato-modal-body.svelte-1o4jdf5 .tos-box:where(.svelte-1o4jdf5){background:rgba(0,0,0,.4);border:1px dashed rgba(255,255,255,.1);border-radius:8px;max-height:300px;margin:16px 0;padding:12px;overflow-y:auto}.arigato-modal-body.svelte-1o4jdf5 .tos-microtext:where(.svelte-1o4jdf5){letter-spacing:0;color:#71717a;word-break:break-all;white-space:pre-wrap;text-transform:none;font-family:monospace;font-size:5px;line-height:1.2}.arigato-modal-body.svelte-1o4jdf5 .tos-microtext:where(.svelte-1o4jdf5) a{color:#ef4444;text-decoration:underline}.arigato-modal-body.svelte-1o4jdf5 .tos-microtext:where(.svelte-1o4jdf5) a:hover{color:#fff}.merch-link-container.svelte-1o4jdf5{justify-content:center;margin-bottom:20px;display:flex}.merch-link-btn.svelte-1o4jdf5{color:#fff;text-transform:uppercase;letter-spacing:.08em;background:linear-gradient(135deg,#ef4444 0%,#b91c1c 100%);border-radius:9999px;align-items:center;gap:8px;padding:8px 18px;font-size:.7rem;font-weight:850;text-decoration:none;transition:all .2s;display:inline-flex;box-shadow:0 4px 12px rgba(239,68,68,.3)}.merch-link-btn.svelte-1o4jdf5:hover{color:#fff;background:linear-gradient(135deg,#ff6b6b 0%,#ef4444 100%);transform:translateY(-2px);box-shadow:0 6px 16px rgba(239,68,68,.4)}.merch-link-btn.svelte-1o4jdf5:active{transform:translateY(0)}
/*$vite$:1*/`,document.head.appendChild(_t),vt=`DOGS`,yt=`Download instrumental`,bt=`Download vocal mix`,xt=`Download track`,St=function(){function e(t,n){s(this,e),L(this,`canvas`,null),L(this,`gl`,null),L(this,`analyser`,null),L(this,`program`,null),L(this,`animationFrameId`,null),L(this,`startTime`,0),L(this,`vertexBuffer`,null),L(this,`audioTexture`,null),L(this,`uniforms`,{}),L(this,`frequencyBuffer`,null),this.canvas=t,this.analyser=n,this.frequencyBuffer=new Uint8Array(n?n.frequencyBinCount:128),this.gl=t.getContext(`webgl`)||t.getContext(`experimental-webgl`),this.gl||console.error(`WebGL not supported by this browser.`)}return l(e,[{key:`init`,value:function(e){if(this.gl){var t=this.gl;this.cleanupProgram();var n=this.compileShader(t.VERTEX_SHADER,`
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `),r=this.compileShader(t.FRAGMENT_SHADER,e);if(n&&r){if(this.program=t.createProgram(),t.attachShader(this.program,n),t.attachShader(this.program,r),t.linkProgram(this.program),!t.getProgramParameter(this.program,t.LINK_STATUS))console.error(`Shader program linking failed:`,t.getProgramInfoLog(this.program));else{t.useProgram(this.program);var i=new Float32Array([-1,-1,1,-1,-1,1,1,1]);this.vertexBuffer=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,this.vertexBuffer),t.bufferData(t.ARRAY_BUFFER,i,t.STATIC_DRAW);var a=t.getAttribLocation(this.program,`a_position`);t.enableVertexAttribArray(a),t.vertexAttribPointer(a,2,t.FLOAT,!1,0,0),this.audioTexture=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.audioTexture),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),this.uniforms={time:t.getUniformLocation(this.program,`u_time`),resolution:t.getUniformLocation(this.program,`u_resolution`),volume:t.getUniformLocation(this.program,`u_volume`),bass:t.getUniformLocation(this.program,`u_bass`),mid:t.getUniformLocation(this.program,`u_mid`),treble:t.getUniformLocation(this.program,`u_treble`),audioTexture:t.getUniformLocation(this.program,`u_audioTexture`)},this.startTime=performance.now(),this.resize()}}}}},{key:`setPreset`,value:function(e){this.init(e)}},{key:`compileShader`,value:function(e,t){if(!this.gl)return null;var n=this.gl,r=n.createShader(e);return n.shaderSource(r,t),n.compileShader(r),n.getShaderParameter(r,n.COMPILE_STATUS)?r:(console.error(`Shader compilation error (${e===n.VERTEX_SHADER?`VERTEX`:`FRAGMENT`}):`,n.getShaderInfoLog(r)),n.deleteShader(r),null)}},{key:`start`,value:function(){var e=this;this.stop();var t=function(e){function t(){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}(function(){e.renderFrame(),e.animationFrameId=requestAnimationFrame(t)});this.animationFrameId=requestAnimationFrame(t)}},{key:`stop`,value:function(){this.animationFrameId&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null)}},{key:`resize`,value:function(){if(this.gl&&this.canvas){var e=this.gl,t=this.canvas.clientWidth,n=this.canvas.clientHeight;(this.canvas.width!==t||this.canvas.height!==n)&&(this.canvas.width=t,this.canvas.height=n,e.viewport(0,0,t,n))}}},{key:`renderFrame`,value:function(){if(this.gl&&this.program){var e=this.gl;this.resize(),e.useProgram(this.program),e.bindBuffer(e.ARRAY_BUFFER,this.vertexBuffer);var t=(performance.now()-this.startTime)/1e3,n=0,r=0,i=0,a=0;if(this.analyser){this.analyser.getByteFrequencyData(this.frequencyBuffer);for(var o=this.frequencyBuffer.length,s=0,c=0,l=0,u=0;u<o;u++){var d=this.frequencyBuffer[u];n+=d,u<12?(r+=d,s++):u<64?(i+=d,c++):(a+=d,l++)}n=n/o/255,r=s>0?r/s/255:0,i=c>0?i/c/255:0,a=l>0?a/l/255:0,e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.audioTexture),e.texImage2D(e.TEXTURE_2D,0,e.LUMINANCE,o,1,0,e.LUMINANCE,e.UNSIGNED_BYTE,this.frequencyBuffer)}e.uniform1f(this.uniforms.time,t),e.uniform2f(this.uniforms.resolution,this.canvas.width,this.canvas.height),e.uniform1f(this.uniforms.volume,n),e.uniform1f(this.uniforms.bass,r),e.uniform1f(this.uniforms.mid,i),e.uniform1f(this.uniforms.treble,a),e.uniform1i(this.uniforms.audioTexture,0),e.drawArrays(e.TRIANGLE_STRIP,0,4)}}},{key:`cleanupProgram`,value:function(){this.gl&&this.program&&(this.gl.deleteProgram(this.program),this.program=null)}},{key:`destroy`,value:function(){this.stop();var e=this.gl;e&&(this.cleanupProgram(),this.vertexBuffer&&(e.deleteBuffer(this.vertexBuffer),this.vertexBuffer=null),this.audioTexture&&(e.deleteTexture(this.audioTexture),this.audioTexture=null)),this.canvas=null,this.gl=null,this.analyser=null}}])}(),Ct=[{id:`kaleidosync`,name:`Kaleidosync`,fragmentShader:`
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
    `}],wt={id:`no-signal`,name:`No Signal`,fragmentShader:`
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
  `},J=2.7,Tt=3e4,Et=2,Dt=50,Ot=`webgl2`,kt=[function(){return de(function(){return n.import(`./butterchurnPresets.min-legacy-D-WJc89f.js`).then(function(e){return r(e.default,1)})},void 0)},function(){return de(function(){return n.import(`./butterchurnPresetsExtra.min-legacy-DFzk7CsG.js`).then(function(e){return r(e.default,1)})},void 0)},function(){return de(function(){return n.import(`./butterchurnPresetsExtra2.min-legacy-PGzIAHXH.js`).then(function(e){return r(e.default,1)})},void 0)},function(){return de(function(){return n.import(`./butterchurnPresetsMD1.min-legacy-DyPP2txR.js`).then(function(e){return r(e.default,1)})},void 0)}],At=3,jt=function(){function e(t,n,r){var i=arguments.length>3&&arguments[3]!==void 0?arguments[3]:{};s(this,e),L(this,`canvas`,null),L(this,`analyser`,null),L(this,`audioCtx`,null),L(this,`visualizer`,null),L(this,`animationFrameId`,null),L(this,`autoTimer`,null),L(this,`destroyed`,!1),L(this,`presets`,{}),L(this,`names`,[]),L(this,`current`,``),L(this,`history`,[]),L(this,`auto`,!0),L(this,`shuffle`,!0),L(this,`pool`,null),L(this,`resume`,``),L(this,`canAdvance`,null),L(this,`width`,0),L(this,`height`,0),this.canvas=t,this.analyser=n,this.audioCtx=r,this.onPreset=i.onPreset||function(){},this.onNames=i.onNames||function(){}}return l(e,[{key:`start`,value:function(){var e=g(u().m(function e(){var i,a,o,s,c;return u().w(function(e){for(;;)switch(e.p=e.n){case 0:return e.p=0,e.n=1,Promise.all([de(function(){return n.import(`./butterchurn.min-legacy-D5bem6x3.js`).then(function(e){return r(e.default,1)})},void 0),kt[0]()]);case 1:if(i=e.v,a=t(i,2),o=a[0],s=a[1],!this.destroyed){e.n=2;break}return e.a(2);case 2:this.resize(),this.visualizer=Bn(o,`createVisualizer`).createVisualizer(this.audioCtx,this.canvas,{width:this.width,height:this.height,pixelRatio:1}),this.visualizer.connectAudio(this.analyser),this.addPack(s),this.resumePreset()||this.random(0),this.draw(),this.loadRemainingPacks(),e.n=4;break;case 3:e.p=3,c=e.v,console.warn(`MilkDrop could not start:`,c);case 4:return e.a(2)}},e,this,[[0,3]])}));function i(){return e.apply(this,arguments)}return i}()},{key:`loadRemainingPacks`,value:function(){var e=g(u().m(function e(){var t,n,r,i,a;return u().w(function(e){for(;;)switch(e.p=e.n){case 0:t=f(kt.slice(1)),e.p=1,t.s();case 2:if((n=t.n()).done){e.n=8;break}return r=n.value,e.p=3,e.n=4,r();case 4:if(i=e.v,!this.destroyed){e.n=5;break}return e.a(2);case 5:this.addPack(i),this.resumePreset(),e.n=7;break;case 6:e.p=6,e.v;case 7:e.n=2;break;case 8:e.n=10;break;case 9:e.p=9,a=e.v,t.e(a);case 10:return e.p=10,t.f(),e.f(10);case 11:return e.a(2)}},e,this,[[3,6],[1,9,10,11]])}));function t(){return e.apply(this,arguments)}return t}()},{key:`addPack`,value:function(e){for(var t=Bn(e,`getPresets`).getPresets(),n=0,r=Object.keys(t);n<r.length;n++){var i=r[n];this.presets[i]=t[i]}this.names=Object.keys(this.presets).sort(function(e,t){return e.localeCompare(t)}),this.onNames(this.names)}},{key:`resumePreset`,value:function(){var e=this.resume;return!e||!this.presets[e]?!1:(this.resume=``,this.loadPreset(e,0,!1),!0)}},{key:`resize`,value:function(){var e=Math.min(window.devicePixelRatio||1,Et),t=Math.max(1,Math.round(this.canvas.clientWidth*e)),n=Math.max(1,Math.round(this.canvas.clientHeight*e));(t!==this.width||n!==this.height)&&(this.width=t,this.height=n,this.canvas.width=t,this.canvas.height=n,this.visualizer&&this.visualizer.setRendererSize(t,n))}},{key:`draw`,value:function(){var e=this;this.destroyed||(this.resize(),this.visualizer.render(),this.animationFrameId=requestAnimationFrame(function(){return e.draw()}))}},{key:`loadPreset`,value:function(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:J,n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:!0,r=this.presets[e];r&&this.visualizer&&(n&&this.current&&(this.history.push(this.current),this.history.length>Dt&&this.history.shift()),this.current=e,this.visualizer.loadPreset(r,t),this.onPreset(e),this.restartAuto())}},{key:`setPool`,value:function(e){this.pool=e&&e.length?e:null}},{key:`list`,value:function(){var e=this;if(!this.pool)return this.names;var t=this.pool.filter(function(t){return e.presets[t]});return t.length?t:this.names}},{key:`random`,value:function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:J,t=this.list();if(t.length){for(var n=this.current;n===this.current&&t.length>1;)n=t[Math.floor(Math.random()*t.length)];this.loadPreset(t.indexOf(n)===-1?t[0]:n,e)}}},{key:`next`,value:function(){var e=this.list();e.length&&this.loadPreset(e[(e.indexOf(this.current)+1)%e.length])}},{key:`advance`,value:function(){this.shuffle?this.random():this.next()}},{key:`previous`,value:function(){var e=this.list();if(e.length){var t=this.history.pop();if(t)this.loadPreset(t,J,!1);else{var n=Math.max(0,e.indexOf(this.current));this.loadPreset(e[(n-1+e.length)%e.length],J,!1)}}}},{key:`setAuto`,value:function(e){this.auto=!!e,this.restartAuto()}},{key:`restartAuto`,value:function(){var e=this;clearTimeout(this.autoTimer),this.auto&&!this.destroyed&&(this.autoTimer=setTimeout(function(){e.canAdvance&&!e.canAdvance()?e.restartAuto():e.advance()},Tt))}},{key:`destroy`,value:function(){if(this.destroyed=!0,clearTimeout(this.autoTimer),this.animationFrameId&&cancelAnimationFrame(this.animationFrameId),this.visualizer)try{this.visualizer.disconnectAudio(this.analyser)}catch(e){}this.visualizer=null,this.presets={}}}])}(),Mt=M(`<li class="flex items-center svelte-80frst"><button type="button"> </button> <button type="button"><!></button></li>`),Y=M(`<li class="px-3 py-3 font-mono text-[11px] text-white/40 md:px-4 2xl:px-5 2xl:text-[15px] svelte-80frst"> </li>`),Nt=M(`<li class="px-3 py-2 font-mono text-[10px] text-white/30 md:px-4 2xl:px-5 2xl:text-[13px] svelte-80frst"> </li>`),Pt=M(`<div class="preset-list flex min-h-0 flex-1 flex-col svelte-80frst"><div class="flex items-center gap-2 border-b border-white/10 px-3 py-2 sm:py-1.5 md:px-4 2xl:px-5 2xl:py-3 svelte-80frst"><!> <input type="search" aria-label="Search MilkDrop presets" autocomplete="off" spellcheck="false" class="w-full min-w-0 bg-transparent font-mono text-[12px] text-white outline-none placeholder:text-white/30 2xl:text-[15px] svelte-80frst"/> <div class="flex shrink-0 items-center gap-1 rounded-md border border-white/10 p-0.5 svelte-80frst" role="group" aria-label="Which presets to list"><button type="button">All</button> <button type="button"><!> </button></div></div> <ul class="preset-rows min-h-0 flex-1 overflow-y-auto py-1 svelte-80frst"><!> <!></ul></div>`),he([`click`]),Ft=M(`<div class="flex max-h-[40vh] flex-col overflow-hidden rounded-lg border border-white/10 bg-black/75 backdrop-blur-md sm:max-h-[50vh] 2xl:max-h-[60vh] svelte-6h1e9g"><!></div>`),It=_e(`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="10" x2="14" y1="2" y2="2" class="svelte-6h1e9g"></line><circle cx="12" cy="14" r="8" class="svelte-6h1e9g"></circle><line class="deck-timer-hand svelte-6h1e9g" x1="12" y1="14" x2="12" y2="8.5"></line></svg>`),Lt=M(`<div class="milkdrop-deck flex w-full flex-col gap-2 sm:max-w-md md:max-w-lg xl:max-w-xl 2xl:max-w-3xl 2xl:gap-3 svelte-6h1e9g"><!> <div class="flex items-center gap-1 rounded-lg border border-white/10 bg-black/60 p-1 backdrop-blur-md svelte-6h1e9g"><button type="button" class="deck-btn svelte-6h1e9g" aria-label="Previous preset" title="Previous preset"><!></button> <button type="button" class="deck-btn svelte-6h1e9g" aria-label="Next preset" title="Next preset"><!></button> <button type="button" class="min-w-0 flex-1 truncate px-2 text-left font-mono text-[10px] uppercase tracking-wider text-white/80 hover:text-white md:text-[11px] 2xl:text-[14px] svelte-6h1e9g"> </button> <button type="button"><!></button> <button type="button" aria-label="Play only my hearted presets"><!></button> <button type="button" aria-label="Shuffle presets"><!></button> <button type="button"><!></button></div></div>`),he([`click`]),Rt=M(`<span class="lyric-word svelte-4gkonh"> </span>`),zt=M(`<span class="lyric-row svelte-4gkonh"></span>`),Bt=M(`<div aria-hidden="true"><!></div>`),Vt=M(`<button type="button"><!> <span class="strike svelte-btbnk2" aria-hidden="true"></span></button>`),he([`click`]),Ht=[{id:`default`,name:`Default order`,label:`Default`,icon:X},{id:`artist`,name:`Artist`,icon:Nn},{id:`album`,name:`Album`,icon:Pe},{id:`year`,name:`Year`,icon:Dn},{id:`filename`,name:`File name`,icon:je},{id:`genre`,name:`Genre`,icon:Ln},{id:`season`,name:`Season`,icon:Mn}],Ut=M(`<span class="sort-icon svelte-1ly12po"><!></span> <span class="sort-name hidden sm:inline svelte-1ly12po"> </span>`,1),Wt=M(`<button type="button"><!></button>`),he([`click`]),Gt=M(`<button type="button"><span class="sound-icon svelte-1vwnx9r"><!></span></button>`),he([`click`]),Kt=M(`<button type="button" class="stage-btn svelte-chvcxl"><!></button> <button type="button" class="stage-btn stage-btn-wide svelte-chvcxl"> </button> <button type="button" class="stage-btn svelte-chvcxl"> </button>`,1),qt=M(`<div class="flex items-center gap-1 rounded-lg border border-white/10 bg-black/60 p-1 backdrop-blur-md svelte-chvcxl"><button type="button" class="stage-btn svelte-chvcxl" aria-label="Leave full screen" title="Leave full screen"><!></button> <!> <!></div>`),he([`click`]),Jt=[`DOGS`,`DOG BLOG`],Yt=[`JAN`,`FEB`,`MAR`,`APR`,`MAY`,`JUN`,`JUL`,`AUG`,`SEP`,`OCT`,`NOV`,`DEC`],Xt=/^(\d{4})-(\d{2})/,Zt=`I understand the creator of this sick beat Nxnja has a copyright notice on his music distribution website.\r
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
`,Qt=M(`<canvas class="visualizer-canvas svelte-1o4jdf5"></canvas>`),$t=M(`<div class="visualizer-container viz-disc cursor-pointer svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open the song list. Double tap for full screen."><!> <div><img class="viz-art svelte-1o4jdf5"/></div> <div class="viz-spindle svelte-1o4jdf5"></div></div>`),en=M(`<div class="vinyl-record-clicker cursor-pointer w-full h-full svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div><div class="groove g1 svelte-1o4jdf5"></div> <div class="groove g2 svelte-1o4jdf5"></div> <div class="groove g3 svelte-1o4jdf5"></div> <div class="groove g4 svelte-1o4jdf5"></div> <div class="record-label svelte-1o4jdf5"><img loading="lazy"/></div> <div class="spindle svelte-1o4jdf5"></div></div> <div></div></div>`),tn=M(`<div class="cassette-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="cassette-tape svelte-1o4jdf5"><div class="cassette-label bg-gradient-to-r from-purple-800 to-pink-700 svelte-1o4jdf5"><span class="cassette-track-title svelte-1o4jdf5"> </span> <span class="cassette-brand svelte-1o4jdf5">WEAREDOGS AUDIO</span></div> <div class="cassette-window bg-zinc-950/80 svelte-1o4jdf5"><div></div> <div></div> <div></div> <div></div></div></div></div>`),nn=M(`<div class="floppy-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="floppy-disk svelte-1o4jdf5"><div class="floppy-corner svelte-1o4jdf5"></div> <div class="floppy-write-protect svelte-1o4jdf5"></div> <div class="floppy-label bg-slate-100 text-slate-900 svelte-1o4jdf5"><div class="floppy-label-stripe bg-red-600 svelte-1o4jdf5"></div> <div class="floppy-label-stripe-blue bg-blue-600 svelte-1o4jdf5"></div> <div class="floppy-label-content svelte-1o4jdf5"><div class="floppy-song truncate font-mono svelte-1o4jdf5"> </div> <div class="floppy-artist truncate font-mono svelte-1o4jdf5"> </div></div></div> <div class="floppy-shutter-door bg-zinc-700 svelte-1o4jdf5"><div></div> <div class="floppy-shutter-opening bg-zinc-950 svelte-1o4jdf5"><div></div></div></div> <div></div></div></div>`),rn=M(`<div></div>`),an=M(`<div class="musicbox-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="music-box svelte-1o4jdf5"><div></div> <div class="music-box-interior border border-amber-900/40 svelte-1o4jdf5"><div class="music-box-gears svelte-1o4jdf5"><div></div> <div></div></div> <div class="music-box-drum-wrap svelte-1o4jdf5"><div><div class="music-box-pins svelte-1o4jdf5"><div class="pin pin-1 svelte-1o4jdf5"></div> <div class="pin pin-2 svelte-1o4jdf5"></div> <div class="pin pin-3 svelte-1o4jdf5"></div> <div class="pin pin-4 svelte-1o4jdf5"></div> <div class="pin pin-5 svelte-1o4jdf5"></div> <div class="pin pin-6 svelte-1o4jdf5"></div></div></div></div> <div class="music-box-comb svelte-1o4jdf5"></div></div></div></div>`),on=M(`<button><!></button>`),sn=M(`<span class="player-tether-hint svelte-1o4jdf5" role="status"> </span>`),cn=M(`<span class="player-tether svelte-1o4jdf5"><button><!></button> <!></span>`),ln=M(`<span></span>`),un=M(`<div class="spin-ring svelte-1o4jdf5"></div>`),dn=M(`<div class="volume-popover svelte-1o4jdf5"><button class="ctrl ctrl-xs mr-2 border border-white/10 rounded-full p-1 hover:bg-white/10 svelte-1o4jdf5" aria-label="Mute"><!></button> <input type="range" class="vol-slider-pop svelte-1o4jdf5" min="0" max="1" step="0.01" aria-label="Volume"/> <span class="text-[10px] font-bold text-white/60 min-w-[28px] text-right font-mono select-none svelte-1o4jdf5"> </span></div>`),fn=M(`<span class="tl-count hidden sm:inline svelte-1o4jdf5"> </span>`),pn=M(`<button role="tab"><!><span class="svelte-1o4jdf5">PRESETS</span> <!></button>`),mn=M(`<div class="eq svelte-1o4jdf5"><div class="eq-b svelte-1o4jdf5"></div> <div class="eq-b svelte-1o4jdf5"></div> <div class="eq-b svelte-1o4jdf5"></div></div>`),hn=M(`<span class="svelte-1o4jdf5"></span>`),gn=M(`<span class="text-amber-400 flex items-center gap-1 text-[9px] font-bold tracking-wider uppercase bg-amber-500/10 px-1.5 py-0.5 rounded flex-shrink-0 svelte-1o4jdf5" title="Failed to fetch music source from remote database"><!> Error Fetching</span>`),_n=M(`<button class="cursor-pointer svelte-1o4jdf5" style="background: none; border: none; padding: 0; color: inherit; font: inherit;">i</button>`),vn=M(`<a target="_blank" class="svelte-1o4jdf5">i</a>`),yn=M(`<span class="inst-chip-link svelte-1o4jdf5"><!></span>`),bn=M(`<div><div class="tr-num svelte-1o4jdf5"><!></div> <img loading="lazy" class="tr-art svelte-1o4jdf5"/> <div class="tr-info svelte-1o4jdf5"><div class="flex items-center gap-1.5 min-w-0 svelte-1o4jdf5"><span> </span> <!></div> <span class="tr-meta svelte-1o4jdf5"> </span></div> <div class="flex items-center gap-2 flex-shrink-0 svelte-1o4jdf5"><!>  <button class="tr-share-btn svelte-1o4jdf5" title="Copy track link" aria-label="Share track"><!></button> <!></div></div>`),xn=M(`<img alt="" class="stage-cover svelte-1o4jdf5"/>`),Sn=M(`<button> </button>`),Cn=M(`<div class="flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-lg p-1 border border-white/10 svelte-1o4jdf5"></div>`),wn=M(`<div><div class="stage-frame svelte-1o4jdf5"><!> <!></div> <div class="visualizer-overlay flex-col items-center sm:flex-row sm:items-end svelte-1o4jdf5"><!> <!> <!></div></div>`),Tn=M(`<div class="arigato-modal-backdrop svelte-1o4jdf5"><div class="arigato-modal-content svelte-1o4jdf5"><header class="arigato-modal-header svelte-1o4jdf5"><h2 class="svelte-1o4jdf5">ARIGATO INFO</h2> <button class="arigato-close-btn svelte-1o4jdf5"><!></button></header> <div class="arigato-modal-body scroll-y svelte-1o4jdf5"><div class="merch-link-container svelte-1o4jdf5"><a href="https://nxnjaa.beatstars.com/" target="_blank" rel="noopener noreferrer" class="merch-link-btn svelte-1o4jdf5"><!> NXNJA MERCH & MUSIC</a></div> <p class="intro-text svelte-1o4jdf5"></p> <div class="tos-box svelte-1o4jdf5"><div class="tos-microtext svelte-1o4jdf5"></div></div> <p class="outro-text svelte-1o4jdf5"></p></div></div></div>`),En=M(`<div class="mp-backdrop svelte-1o4jdf5"><div><header class="panel-header svelte-1o4jdf5"><div class="brand svelte-1o4jdf5"><button class="logo-btn svelte-1o4jdf5" aria-label="Go to the DOGS home page"><!></button> <h1 class="svelte-1o4jdf5"></h1></div> <div class="header-end flex items-center gap-1 md:gap-2 svelte-1o4jdf5"><!> <button class="close-btn svelte-1o4jdf5" aria-label="Close panel"><!></button></div></header> <div class="mp-body svelte-1o4jdf5"><div class="songs-layout svelte-1o4jdf5"><div><div><div><!></div>  <div class="track-info mt-2 svelte-1o4jdf5"><div class="flex items-center justify-center gap-1.5 mb-1.5 svelte-1o4jdf5"><button class="player-share-btn svelte-1o4jdf5" title="Copy track link" aria-label="Share track"><!></button> <!> <!></div> <div><h2> </h2></div> <div><p> </p></div> <div><p> </p></div></div></div> <div class="player-controls-block svelte-1o4jdf5"><!> <div class="progress-row svelte-1o4jdf5"><span class="ptime svelte-1o4jdf5"> </span> <div class="progress-wrap waveform-slider-wrap relative h-9 flex items-end svelte-1o4jdf5"><div class="waveform-bars flex items-end justify-between absolute inset-0 pointer-events-none px-1 h-full svelte-1o4jdf5"></div> <input type="range" class="seek-input absolute inset-0 opacity-0 cursor-pointer w-full h-full svelte-1o4jdf5" min="0" step="0.1" aria-label="Seek"/></div> <span class="ptime svelte-1o4jdf5"> </span></div> <div class="controls-row svelte-1o4jdf5"><button aria-label="Shuffle"><!></button> <button class="ctrl ctrl-md svelte-1o4jdf5" aria-label="Previous"><!></button> <button><!></button> <button class="ctrl ctrl-md svelte-1o4jdf5" aria-label="Next"><!></button> <button aria-label="Repeat"><!></button></div> <div class="w-full flex flex-col items-center gap-1.5 mt-2 px-1 svelte-1o4jdf5"><div><span><!> <span class="svelte-1o4jdf5">VOCAL</span></span> <div class="dj-fader-slot relative svelte-1o4jdf5"><div></div></div> <span><!> <span class="svelte-1o4jdf5">INST</span></span></div></div> <div class="relative flex justify-center items-center gap-3 mt-2 w-full svelte-1o4jdf5"><!> <!> <button class="ctrl ctrl-xs svelte-1o4jdf5" aria-label="Full screen" title="Full screen"><!></button> <!> <!> <div class="relative svelte-1o4jdf5"><button class="ctrl ctrl-xs vol-toggle-btn svelte-1o4jdf5" aria-label="Toggle volume slider"><!></button></div></div></div></div> <div><div class="mobile-close-bar hidden py-2 px-4 border-b border-white/5 flex items-center justify-between svelte-1o4jdf5"><span class="text-xs font-bold text-white/50 svelte-1o4jdf5">Track Library</span> <button class="px-3 py-1 bg-white/5 text-white/75 rounded-lg text-xs font-bold svelte-1o4jdf5">Back to player</button></div> <div class="tl-header relative flex justify-between items-center gap-3 svelte-1o4jdf5"><div class="flex flex-1 items-center justify-between gap-1 svelte-1o4jdf5" role="tablist" aria-label="Songs or visualizer presets"><button role="tab"><!><span class="svelte-1o4jdf5">TRACKS</span> <span class="tl-count hidden sm:inline svelte-1o4jdf5"> </span></button> <!></div> <!></div> <!> <div></div></div></div></div> <footer class="mp-footer svelte-1o4jdf5"><div class="mp-status svelte-1o4jdf5"><span class="mp-dot svelte-1o4jdf5"></span><span class="svelte-1o4jdf5">🐕</span></div> <span class="svelte-1o4jdf5">MUSIC</span></footer></div> <!> <canvas class="fader-fx-canvas pointer-events-none svelte-1o4jdf5"></canvas> <!></div>`),he([`click`,`input`,`change`,`pointerdown`,`pointermove`])}}})})();