(function(){function e(t){"@babel/helpers - typeof";return e=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},e(t)}function t(e,t){return o(e)||a(e,t)||r(e,t)||n()}function n(){throw TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function r(e,t){if(e){if(typeof e==`string`)return i(e,t);var n={}.toString.call(e).slice(8,-1);return n===`Object`&&e.constructor&&(n=e.constructor.name),n===`Map`||n===`Set`?Array.from(e):n===`Arguments`||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?i(e,t):void 0}}function i(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function a(e,t){var n=e==null?null:typeof Symbol<`u`&&e[Symbol.iterator]||e[`@@iterator`];if(n!=null){var r,i,a,o,s=[],c=!0,l=!1;try{if(a=(n=n.call(e)).next,t===0){if(Object(n)!==n)return;c=!1}else for(;!(c=(r=a.call(n)).done)&&(s.push(r.value),s.length!==t);c=!0);}catch(e){l=!0,i=e}finally{try{if(!c&&n.return!=null&&(o=n.return(),Object(o)!==o))return}finally{if(l)throw i}}return s}}function o(e){if(Array.isArray(e))return e}function s(e,t){if(!(e instanceof t))throw TypeError(`Cannot call a class as a function`)}function c(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,`value`in r&&(r.writable=!0),Object.defineProperty(e,ne(r.key),r)}}function l(e,t,n){return t&&c(e.prototype,t),n&&c(e,n),Object.defineProperty(e,"prototype",{writable:!1}),e}function u(){var e,t,n=typeof Symbol==`function`?Symbol:{},r=n.iterator||`@@iterator`,i=n.toStringTag||`@@toStringTag`;function a(n,r,i,a){var c=r&&r.prototype instanceof s?r:s,l=Object.create(c.prototype);return d(l,`_invoke`,function(n,r,i){var a,s,c,l=0,u=i||[],d=!1,f={p:0,n:0,v:e,a:p,f:p.bind(e,4),d:function(t,n){return a=t,s=0,c=e,f.n=n,o}};function p(n,r){for(s=n,c=r,t=0;!d&&l&&!i&&t<u.length;t++){var i,a=u[t],p=f.p,m=a[2];n>3?(i=m===r)&&(c=a[(s=a[4])?5:(s=3,3)],a[4]=a[5]=e):a[0]<=p&&((i=n<2&&p<a[1])?(s=0,f.v=r,f.n=a[1]):p<m&&(i=n<3||a[0]>r||r>m)&&(a[4]=n,a[5]=r,f.n=m,s=0))}if(i||n>1)return o;throw d=!0,r}return function(i,u,m){if(l>1)throw TypeError(`Generator is already running`);for(d&&u===1&&p(u,m),s=u,c=m;(t=s<2?e:c)||!d;){a||(s?s<3?(s>1&&(f.n=-1),p(s,c)):f.n=c:f.v=c);try{if(l=2,a){if(s||(i=`next`),t=a[i]){if(!(t=t.call(a,c)))throw TypeError(`iterator result is not an object`);if(!t.done)return t;c=t.value,s<2&&(s=0)}else s===1&&(t=a.return)&&t.call(a),s<2&&(c=TypeError(`The iterator does not provide a '`+i+`' method`),s=1);a=e}else if((t=(d=f.n<0)?c:n.call(r,f))!==o)break}catch(t){a=e,s=1,c=t}finally{l=1}}return{value:t,done:d}}}(n,i,a),!0),l}var o={};function s(){}function c(){}function l(){}t=Object.getPrototypeOf;var f=[][r]?t(t([][r]())):(d(t={},r,function(){return this}),t),p=l.prototype=s.prototype=Object.create(f);function m(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,l):(e.__proto__=l,d(e,i,`GeneratorFunction`)),e.prototype=Object.create(p),e}return c.prototype=l,d(p,`constructor`,l),d(l,`constructor`,c),c.displayName=`GeneratorFunction`,d(l,i,`GeneratorFunction`),d(p),d(p,i,`Generator`),d(p,r,function(){return this}),d(p,`toString`,function(){return`[object Generator]`}),(u=function(){return{w:a,m}})()}function d(e,t,n,r){var i=Object.defineProperty;try{i({},``,{})}catch(e){i=0}d=function(e,t,n,r){function a(t,n){d(e,t,function(e){return this._invoke(t,n,e)})}t?i?i(e,t,{value:n,enumerable:!r,configurable:!r,writable:!r}):e[t]=n:(a(`next`,0),a(`throw`,1),a(`return`,2))},d(e,t,n,r)}function f(e,t){var n=typeof Symbol<`u`&&e[Symbol.iterator]||e[`@@iterator`];if(!n){if(Array.isArray(e)||(n=p(e))||t&&e&&typeof e.length==`number`){n&&(e=n);var r=0,i=function(){};return{s:i,n:function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}},e:function(e){throw e},f:i}}throw TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var a,o=!0,s=!1;return{s:function(){n=n.call(e)},n:function(){var e=n.next();return o=e.done,e},e:function(e){s=!0,a=e},f:function(){try{o||n.return==null||n.return()}finally{if(s)throw a}}}}function p(e,t){if(e){if(typeof e==`string`)return m(e,t);var n={}.toString.call(e).slice(8,-1);return n===`Object`&&e.constructor&&(n=e.constructor.name),n===`Map`||n===`Set`?Array.from(e):n===`Arguments`||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?m(e,t):void 0}}function m(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function h(e,t,n,r,i,a,o){try{var s=e[a](o),c=s.value}catch(e){n(e);return}s.done?t(c):Promise.resolve(c).then(r,i)}function g(e){return function(){var t=this,n=arguments;return new Promise(function(r,i){var a=e.apply(t,n);function o(e){h(a,r,i,o,s,`next`,e)}function s(e){h(a,r,i,o,s,`throw`,e)}o(void 0)})}}function ee(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function te(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t];t%2?ee(Object(n),!0).forEach(function(t){_(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):ee(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function _(e,t,n){return(t=ne(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function ne(t){var n=v(t,`string`);return e(n)==`symbol`?n:n+``}function v(t,n){if(e(t)!=`object`||!t)return t;var r;if(typeof Symbol<`u`&&(r=t[Symbol.toPrimitive])!==void 0){var i=r.call(t,n||`default`);if(e(i)!=`object`)return i;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(n===`string`?String:Number)(t)}System.register(`./rolldown-runtime-legacy-GvFEhjMu.js,./index-legacy-CRqZvxIc.js,./three-legacy-RJR1-iRG.js,./play-legacy-BrYbOe_V.js,./TitlePage-legacy-CPsdc_5n.js,./tv-legacy-BqxzDD8-.js,./volume-2-legacy-D7jXXDv-.js,./volume-x-legacy-Bl1Y0jUs.js,./shuffle-legacy-BRWfUqzO.js,./openDogsPage-legacy-DEA3H4Vc.js,./list-legacy-BARPTl39.js,./external-link-legacy-VLzZ-7XB.js,./arrow-left-legacy-BhA2zri7.js,./share-2-legacy-IOq4b3kR.js,./download-legacy-CRcBAtlK.js,./cable-legacy-B7PgSVIv.js,./check-legacy-D9t9ZNWk.js,./triangle-alert-legacy-jc7e3cyo.js,./AudioCore.svelte-legacy-CkyPOUD1.js,./doubleTap-legacy-TTFKgIZD.js,./musicCatalog.svelte-legacy-CP5682qc.js,./tether.svelte-legacy-C5jpr8s2.js,./homeOrigin-legacy-DYqyXGoy.js,./DogsLogo-legacy-9Jw0UiPw.js,./list-music-legacy-C109ujrI.js,./three-core-legacy-CtrKL6Gq.js,./search-legacy-B0oe1Cdd.js,./lyrics.svelte-legacy-BjAxep74.js,./lyricsFormat-legacy-BdVt-V3o.js,./volume-1-legacy-iWTBtvCy.js,./arrow-up-to-line-legacy-LNB3xRLM.js,./transition-legacy-g3lDOAZu.js`.split(`,`),function(e,n){var r,i,a,o,c,d,p,m,h,ee,_,ne,v,y,b,x,re,ie,S,ae,C,oe,w,T,E,se,ce,le,D,ue,O,k,A,de,j,M,fe,N,pe,P,me,he,ge,F,_e,I,ve,ye,be,xe,Se,L,R,z,B,Ce,we,Te,Ee,De,Oe,ke,Ae,je,Me,Ne,Pe,Fe,Ie,Le,Re,ze,V,Be,Ve,He,Ue,We,Ge,Ke,qe,Je,Ye,Xe,H,Ze,Qe,$e,U,W,et,tt,nt,rt,it,at,ot,st,ct,lt,G,ut,dt,ft,pt,mt,ht,gt,_t,vt,yt,bt,xt,St,Ct,wt,Tt,K,Et,Dt,Ot,kt,At,jt,Mt,q,J,Nt,Pt,Ft,It,Lt,Rt,zt,Bt,Vt,Ht,Ut,Wt,Gt,Kt,qt,Jt,Y,Yt,Xt,Zt,Qt,$t,en,tn,nn,rn,an,on,sn,cn,ln,un,dn,fn,pn,mn,hn,gn,_n,vn,yn,bn,xn,Sn,Cn,wn,Tn;function En(e,t){var n=D(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`M8 2v4`}],[`path`,{d:`M16 2v4`}],[`rect`,{width:`18`,height:`18`,x:`3`,y:`4`,rx:`2`}],[`path`,{d:`M3 10h18`}],[`path`,{d:`M8 14h.01`}],[`path`,{d:`M12 14h.01`}],[`path`,{d:`M16 14h.01`}],[`path`,{d:`M8 18h.01`}],[`path`,{d:`M12 18h.01`}],[`path`,{d:`M16 18h.01`}]];V(e,O({name:`calendar-days`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=i(),o=a(r);w(o,t,`default`,{},null),S(e,r)},$$slots:{default:!0}}))}function Dn(e,t){var n=D(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z`}]];V(e,O({name:`diamond`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=i(),o=a(r);w(o,t,`default`,{},null),S(e,r)},$$slots:{default:!0}}))}function On(e,t){var n=D(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`M12 22v-6`}],[`path`,{d:`M12 8V2`}],[`path`,{d:`M4 12H2`}],[`path`,{d:`M10 12H8`}],[`path`,{d:`M16 12h-2`}],[`path`,{d:`M22 12h-2`}],[`path`,{d:`m15 19-3-3-3 3`}],[`path`,{d:`m15 5-3 3-3-3`}]];V(e,O({name:`fold-vertical`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=i(),o=a(r);w(o,t,`default`,{},null),S(e,r)},$$slots:{default:!0}}))}function kn(e,t){var n=D(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`m11.9 12.1 4.514-4.514`}],[`path`,{d:`M20.1 2.3a1 1 0 0 0-1.4 0l-1.114 1.114A2 2 0 0 0 17 4.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 17.828 7h1.344a2 2 0 0 0 1.414-.586L21.7 5.3a1 1 0 0 0 0-1.4z`}],[`path`,{d:`m6 16 2 2`}],[`path`,{d:`M8.23 9.85A3 3 0 0 1 11 8a5 5 0 0 1 5 5 3 3 0 0 1-1.85 2.77l-.92.38A2 2 0 0 0 12 18a4 4 0 0 1-4 4 6 6 0 0 1-6-6 4 4 0 0 1 4-4 2 2 0 0 0 1.85-1.23z`}]];V(e,O({name:`guitar`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=i(),o=a(r);w(o,t,`default`,{},null),S(e,r)},$$slots:{default:!0}}))}function X(e,t){var n=D(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5`}]];V(e,O({name:`heart`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=i(),o=a(r);w(o,t,`default`,{},null),S(e,r)},$$slots:{default:!0}}))}function Z(e,t){var n=D(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z`}],[`path`,{d:`M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12`}]];V(e,O({name:`leaf`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=i(),o=a(r);w(o,t,`default`,{},null),S(e,r)},$$slots:{default:!0}}))}function An(e,t){var n=D(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`M11 5h10`}],[`path`,{d:`M11 12h10`}],[`path`,{d:`M11 19h10`}],[`path`,{d:`M4 4h1v5`}],[`path`,{d:`M4 9h2`}],[`path`,{d:`M6.5 20H3.4c0-1 2.6-1.925 2.6-3.5a1.5 1.5 0 0 0-2.6-1.02`}]];V(e,O({name:`list-ordered`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=i(),o=a(r);w(o,t,`default`,{},null),S(e,r)},$$slots:{default:!0}}))}function jn(e,t){var n=D(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`m11 7.601-5.994 8.19a1 1 0 0 0 .1 1.298l.817.818a1 1 0 0 0 1.314.087L15.09 12`}],[`path`,{d:`M16.5 21.174C15.5 20.5 14.372 20 13 20c-2.058 0-3.928 2.356-6 2-2.072-.356-2.775-3.369-1.5-4.5`}],[`circle`,{cx:`16`,cy:`7`,r:`5`}]];V(e,O({name:`mic-vocal`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=i(),o=a(r);w(o,t,`default`,{},null),S(e,r)},$$slots:{default:!0}}))}function Mn(e,t){var n=D(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`M8 3v3a2 2 0 0 1-2 2H3`}],[`path`,{d:`M21 8h-3a2 2 0 0 1-2-2V3`}],[`path`,{d:`M3 16h3a2 2 0 0 1 2 2v3`}],[`path`,{d:`M16 21v-3a2 2 0 0 1 2-2h3`}]];V(e,O({name:`minimize`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=i(),o=a(r);w(o,t,`default`,{},null),S(e,r)},$$slots:{default:!0}}))}function Nn(e,t){var n=D(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`m17 2 4 4-4 4`}],[`path`,{d:`M3 11v-1a4 4 0 0 1 4-4h14`}],[`path`,{d:`m7 22-4-4 4-4`}],[`path`,{d:`M21 13v1a4 4 0 0 1-4 4H3`}],[`path`,{d:`M11 10h1v4`}]];V(e,O({name:`repeat-1`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=i(),o=a(r);w(o,t,`default`,{},null),S(e,r)},$$slots:{default:!0}}))}function Pn(e,t){var n=D(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`m17 2 4 4-4 4`}],[`path`,{d:`M3 11v-1a4 4 0 0 1 4-4h14`}],[`path`,{d:`m7 22-4-4 4-4`}],[`path`,{d:`M21 13v1a4 4 0 0 1-4 4H3`}]];V(e,O({name:`repeat`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=i(),o=a(r);w(o,t,`default`,{},null),S(e,r)},$$slots:{default:!0}}))}function Fn(e,t){var n=D(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`M8.8 20v-4.1l1.9.2a2.3 2.3 0 0 0 2.164-2.1V8.3A5.37 5.37 0 0 0 2 8.25c0 2.8.656 3.054 1 4.55a5.77 5.77 0 0 1 .029 2.758L2 20`}],[`path`,{d:`M19.8 17.8a7.5 7.5 0 0 0 .003-10.603`}],[`path`,{d:`M17 15a3.5 3.5 0 0 0-.025-4.975`}]];V(e,O({name:`speech`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=i(),o=a(r);w(o,t,`default`,{},null),S(e,r)},$$slots:{default:!0}}))}function In(e,t){var n=D(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`M13.172 2a2 2 0 0 1 1.414.586l6.71 6.71a2.4 2.4 0 0 1 0 3.408l-4.592 4.592a2.4 2.4 0 0 1-3.408 0l-6.71-6.71A2 2 0 0 1 6 9.172V3a1 1 0 0 1 1-1z`}],[`path`,{d:`M2 7v6.172a2 2 0 0 0 .586 1.414l6.71 6.71a2.4 2.4 0 0 0 3.191.193`}],[`circle`,{cx:`10.5`,cy:`6.5`,r:`.5`,fill:`currentColor`}]];V(e,O({name:`tags`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=i(),o=a(r);w(o,t,`default`,{},null),S(e,r)},$$slots:{default:!0}}))}function Ln(e,t){var n=D(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`m19 5 3-3`}],[`path`,{d:`m2 22 3-3`}],[`path`,{d:`M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z`}],[`path`,{d:`M7.5 13.5 10 11`}],[`path`,{d:`M10.5 16.5 13 14`}],[`path`,{d:`m12 6 6 6 2.3-2.3a2.4 2.4 0 0 0 0-3.4l-2.6-2.6a2.4 2.4 0 0 0-3.4 0Z`}]];V(e,O({name:`unplug`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=i(),o=a(r);w(o,t,`default`,{},null),S(e,r)},$$slots:{default:!0}}))}function Rn(e,t){return e?e.artist===yt&&!t&&e.src?{url:e.src,label:xt}:e.instrumental?{url:e.instrumental,label:bt}:{url:e.src||``,label:St}:{url:``,label:St}}function zn(){if(typeof document>`u`)return!1;try{var e=document.createElement(`canvas`);return!!(e.getContext(`webgl`)||e.getContext(`experimental-webgl`))}catch(e){return!1}}function Bn(e,t){for(var n=e,r=0;r<jt&&n&&typeof n[t]!=`function`;r+=1)n=n.default;if(!n||typeof n[t]!=`function`)throw Error(`MilkDrop bundle has no `+t);return n}function Vn(){if(typeof document>`u`||window.WebGL2RenderingContext===void 0)return!1;try{return!!document.createElement(`canvas`).getContext(kt)}catch(e){return!1}}function Hn(e,t){ae(t,!0);var n=120,r=`all`,i=`hearts`,a=B(``),o=B(r),s=I(function(){return k(o)===i?U.favorites:U.names}),c=I(function(){return k(a).trim().toLowerCase().split(/\s+/).filter(Boolean)}),l=I(function(){return k(c).length?k(s).filter(function(e){return k(c).every(function(t){return e.toLowerCase().indexOf(t)!==-1})}):k(s)}),u=I(function(){return k(l).slice(0,n)}),f=I(function(){return k(o)===i&&!U.favorites.length?`No hearts yet. Tap the heart on a preset you love.`:U.names.length?`No preset matches that.`:`Presets arrive when the visualizer starts. Press play.`}),p=Pt(),m=P(p),h=P(m);lt(h,{size:14,class:`shrink-0 text-white/40`});var g=b(h,2);d(g);var ee=b(g,2),te=P(ee),ne,x=b(te,2),re,ie=P(x);X(ie,{size:10});var C=b(ie);j(x),j(ee),j(m);var w=b(m,2),T=P(w);oe(T,16,function(){return k(u)},function(e){return e},function(e,t){var n=q(),r=P(n),i=N(r,!0),a=b(r,2),o,s=P(a),c=I(function(){return U.isFavorite(t)?`currentColor`:`none`});X(s,{size:13,get fill(){return k(c)}}),j(a),j(n),R(function(e,n,s){y(r,1,`min-w-0 flex-1 truncate px-3 py-1.5 text-left font-mono text-[11px] transition-colors hover:bg-white/10 md:px-4 md:text-[12px] 2xl:px-5 2xl:py-2 2xl:text-[15px]
            ${t===U.current?`bg-white/15 text-white`:`text-white/60`}`,`svelte-80frst`),L(r,`aria-current`,t===U.current?`true`:void 0),r.disabled=!U.names.length,E(i,t),o=y(a,1,`heart-btn svelte-80frst`,null,o,{hearted:e}),L(a,`aria-pressed`,n),L(a,`aria-label`,s)},[function(){return U.isFavorite(t)},function(){return U.isFavorite(t)},function(){return U.isFavorite(t)?`Take the heart off ${t}`:`Heart ${t}`}]),M(`click`,r,function(){return U.pick(t)}),M(`click`,a,function(){return U.toggleFavorite(t)}),S(e,n)});var se=b(T,2),le=function(e){var t=J(),n=N(t,!0);R(function(){return E(n,k(f))}),S(e,t)},D=function(e){var t=Nt(),n=N(t);R(function(){return E(n,`${k(l).length-k(u).length} more. Search to narrow it down.`)}),S(e,t)};_(se,function(e){k(u).length?k(l).length>k(u).length&&e(D,1):e(le)}),j(w),j(p),R(function(){var e,t;L(g,`placeholder`,`Search ${(e=k(s).length)==null?``:e} presets`),ne=y(te,1,`filter-btn svelte-80frst`,null,ne,{"filter-on":k(o)===r}),L(te,`aria-pressed`,k(o)===r),re=y(x,1,`filter-btn svelte-80frst`,null,re,{"filter-on":k(o)===i}),L(x,`aria-pressed`,k(o)===i),E(C,` ${(t=U.favorites.length)==null?``:t}`)}),z(g,function(){return k(a)},function(e){return v(a,e)}),M(`click`,te,function(){return v(o,r)}),M(`click`,x,function(){return v(o,i)}),S(e,p),ce()}function Un(e,t){ae(t,!0);var n=Et/1e3,r=B(!1),i=I(function(){return U.isFavorite(U.current)}),a=Lt(),o=P(a),s=function(e){var t=Ft();Hn(P(t),{}),j(t),S(e,t)};_(o,function(e){k(r)&&e(s)});var c=b(o,2),l=P(c),u=P(l);Te(u,{size:16}),j(l);var d=b(l,2),f=P(d);we(f,{size:16}),j(d);var p=b(d,2),h=N(p,!0),g=b(p,2),ee,te=P(g),ne=I(function(){return k(i)?`currentColor`:`none`});X(te,{size:14,get fill(){return k(ne)}}),j(g);var x=b(g,2),re,ie=P(x);nt(ie,{size:14}),j(x);var C=b(x,2),oe,w=P(C);ze(w,{size:14}),j(C);var T=b(C,2),se,le=P(T);m(le,function(){return U.current},function(e){var t=It(),n;R(function(){var e;n=y(t,0,`deck-timer svelte-6h1e9g`,null,n,{"deck-timer-running":U.auto}),fe(t,`--auto-ms: ${(e=3e4)==null?``:e}ms`)}),S(e,t)}),j(T),j(c),j(a),R(function(){L(p,`aria-expanded`,k(r)),L(p,`title`,k(r)?`Hide the preset list`:`Browse presets`),E(h,U.current||`Loading MilkDrop…`),ee=y(g,1,`deck-btn deck-heart svelte-6h1e9g`,null,ee,{"deck-hearted":k(i)}),L(g,`aria-pressed`,k(i)),L(g,`aria-label`,k(i)?`Take the heart off this preset`:`Heart this preset`),L(g,`title`,k(i)?`In your hearts. Tap to take it out.`:`Heart this preset`),re=y(x,1,`deck-btn svelte-6h1e9g`,null,re,{"deck-btn-on":U.favoritesOnly}),L(x,`aria-pressed`,U.favoritesOnly),L(x,`title`,U.favoritesOnly?`Playing only your hearts`:`Play only your hearts`),oe=y(C,1,`deck-btn svelte-6h1e9g`,null,oe,{"deck-btn-on":U.shuffle}),L(C,`aria-pressed`,U.shuffle),L(C,`title`,U.shuffle?`Shuffle: on`:`Shuffle: off, presets go in order`),se=y(T,1,`deck-btn svelte-6h1e9g`,null,se,{"deck-btn-on":U.auto}),L(T,`aria-pressed`,U.auto),L(T,`aria-label`,`Change preset by itself every ${n} seconds`),L(T,`title`,U.auto?`A new preset every ${n} seconds: on`:`A new preset every ${n} seconds: off`)}),M(`click`,l,function(){return U.previous()}),M(`click`,d,function(){return U.next()}),M(`click`,p,function(){return v(r,!k(r))}),M(`click`,g,function(){return U.toggleFavorite()}),M(`click`,x,function(){return U.setFavoritesOnly(!U.favoritesOnly)}),M(`click`,C,function(){return U.setShuffle(!U.shuffle)}),M(`click`,T,function(){return U.setAuto(!U.auto)}),S(e,a),ce()}function Wn(e,t){ae(t,!0);var n=1e3,r=`sung`,o=`stage`,s=ge(t,`variant`,3,`slot`),c=B(-1),l=B(null),u=B(null),d=B(1),f=I(function(){return G.shown&&G.current?G.current.lines:null}),p=I(function(){return k(f)&&k(c)>=0?k(f)[k(c)]:null}),h=I(function(){return ft.find(function(e){return e.id===G.font}).stack}),g=I(function(){return s()===o?dt.find(function(e){return e.id===G.size}).scale:1}),ee=0,te=0;C(function(){ee=H.currentTime,te=performance.now()});function ne(){var e=H.primaryAudio();return e&&e.src&&!e.paused?e.currentTime:H.isPlaying?ee+(performance.now()-te)/n:H.currentTime}var b=0;C(function(){var e=k(f);if(v(c,-1),b=0,e){var t=0,n=function(){t=requestAnimationFrame(n);var i=ne(),a=pt(e,i);if(a!==k(c))v(c,a,!0),b=0;else if(!(a<0||!k(u))){for(var o=e[a].w,s=0;s<o.length&&o[s][0]<=i;)s++;if(s!==b){for(var l=k(u).children,d=Math.min(s,b);d<Math.max(s,b)&&d<l.length;d++)l[d].classList.toggle(r,d<s);b=s}}};return t=requestAnimationFrame(n),function(){return cancelAnimationFrame(t)}}}),C(function(){k(p),k(h),k(g),v(d,1),me().then(function(){k(u)&&k(l)&&k(u).scrollWidth&&v(d,Math.min(1,k(l).clientWidth/k(u).scrollWidth),!0)})});var x=Bt(),re=P(x),ie=function(e){var t=i(),n=a(t);m(n,function(){return k(c)},function(e){var t=zt();oe(t,21,function(){return k(p).w},T,function(e,t){var n=Rt(),r=N(n,!0);R(function(){return E(r,k(t)[1])}),S(e,n)}),j(t),le(t,function(e){return v(u,e)},function(){return k(u)}),S(e,t)}),S(e,t)};_(re,function(e){k(p)&&e(ie)}),j(x),le(x,function(e){return v(l,e)},function(){return k(l)}),R(function(){var e,t,n,r,i;y(x,1,`lyric-line lyric-${(e=s())==null?``:e} lyric-at-${(t=G.place)==null?``:t}`,`svelte-4gkonh`),fe(x,`--lyric-font: ${(n=k(h))==null?``:n}; --lyric-scale: ${(r=k(g))==null?``:r}; --lyric-fit: ${(i=k(d))==null?``:i};`)}),S(e,x),ce()}function Gn(e,t){var n=ge(t,`dim`,3,!1),r=ge(t,`accent`,3,!1),i=ge(t,`class`,3,``),a=Vt(),o,s=P(a);se(s,function(){return t.children}),ve(2),j(a),R(function(){var e;o=y(a,1,`strike-toggle ${(e=i())==null?``:e}`,`svelte-btbnk2`,o,{"is-off":!t.on,"is-accent":t.on&&r()&&!n(),"is-dim":t.on&&n()}),L(a,`aria-pressed`,t.on),L(a,`aria-label`,t.label),L(a,`title`,t.label)}),M(`click`,a,function(){var e,n=[...arguments];(e=t.onclick)==null||e.apply(this,n)}),S(e,a)}function Kn(e,t){ae(t,!0);var n=ge(t,`class`,3,``),r=I(function(){return Math.max(0,Ht.findIndex(function(e){return e.id===t.value}))}),i=I(function(){return Ht[k(r)]}),a=I(function(){return Ht[(k(r)+1)%Ht.length]}),s=Wt(),c=P(s);m(c,function(){return k(i).id},function(e){var t=Ut(),n=P(t);o(n,function(){return k(i).icon},function(e,t){t(e,{size:13})}),j(t),S(e,t)}),j(s),R(function(){var e,t,r,o,c;y(s,1,`sort-cycler sort-${(e=k(i).id)==null?``:e} ${(t=n())==null?``:t}`,`svelte-1ly12po`),L(s,`aria-label`,`Sorted by ${(r=k(i).name)==null?``:r}. Tap to sort by ${(o=k(a).name)==null?``:o}.`),L(s,`title`,`Sorted by ${(c=k(i).name)==null?``:c}`)}),M(`click`,s,function(){return t.onchange(k(a).id)}),S(e,s),ce()}function qn(e,t){ae(t,!0);var n=`This song plays only where it is unlocked`,r=I(function(){return W.soundHere}),i=I(function(){return W.soundCanMove}),a=I(function(){return k(i)?k(r)?`Sound: this device. Tap to play it on `+(W.peerName||`the other device`):`Sound: `+(W.peerName||`the other device`)+`. Tap to play it here`:n}),o=Gt(),s,c=P(o),l=P(c);mt(l,{size:14}),j(c),j(o),R(function(){s=y(o,1,`sound-switch svelte-1vwnx9r`,null,s,{"sound-away":!k(r)}),o.disabled=!k(i),L(o,`aria-pressed`,!k(r)),L(o,`aria-label`,k(a)),L(o,`title`,k(a))}),M(`click`,o,function(){return W.moveSound()}),S(e,o),ce()}function Jn(e,t){ae(t,!0);var n={top:gt,middle:On,bottom:ht},r=I(function(){return ft.find(function(e){return e.id===G.font})}),i=I(function(){return dt.find(function(e){return e.id===G.size})}),s=I(function(){return n[G.place]});function c(e,t){return e[(e.indexOf(t)+1)%e.length]}var l=qt(),u=P(l);Mn(P(u),{size:15}),j(u);var d=b(u,2),f=I(function(){return!t.hasLyrics}),p=I(function(){return G.shown?t.hasLyrics?`Lyrics: on`:`Lyrics: on. This song has none yet.`:`Lyrics: off`});Gn(d,{class:`stage-btn`,get on(){return G.shown},get dim(){return k(f)},get label(){return k(p)},onclick:function(){return G.setPrefs({shown:!G.shown})},children:function(e,t){Fn(e,{size:15})},$$slots:{default:!0}});var m=b(d,2),h=function(e){var t=Kt(),n=a(t),l=P(n);o(l,function(){return k(s)},function(e,t){t(e,{size:15})}),j(n);var u=b(n,2),d=N(u,!0),f=b(u,2),p=N(f,!0);R(function(e){var t,a,o,s,c,l,m;L(n,`aria-label`,`Lyrics sit at the ${(t=G.place)==null?``:t}. Tap to move them.`),L(n,`title`,`Lyrics sit at the ${(a=G.place)==null?``:a}. Tap to move them.`),fe(u,`font-family: ${(o=k(r).stack)==null?``:o}`),L(u,`aria-label`,`Lyric font: ${(s=k(r).name)==null?``:s}. Tap for the next one.`),L(u,`title`,`Lyric font: ${(c=k(r).name)==null?``:c}. Tap for the next one.`),E(d,k(r).name),L(f,`aria-label`,`Lyric size: ${(l=k(i).name)==null?``:l}. Tap to change it.`),L(f,`title`,`Lyric size: ${(m=k(i).name)==null?``:m}. Tap to change it.`),E(p,e)},[function(){return k(i).id.toUpperCase()}]),M(`click`,n,function(){return G.setPrefs({place:c(ut,G.place)})}),M(`click`,u,function(){return G.setPrefs({font:c(ft,k(r)).id})}),M(`click`,f,function(){return G.setPrefs({size:c(dt,k(i)).id})}),S(e,t)};_(m,function(e){G.shown&&e(h)}),j(l),M(`click`,u,function(){var e,n=[...arguments];(e=t.onExit)==null||e.apply(this,n)}),S(e,l),ce()}function Yn(e){var t=Jt.includes(e.artist),n=Yt.exec((t?e.dateAdded:e.released)||``),r=n?Y[Number(n[2])-1]:``;return r?`${r} ${n[1]}`:e.year?String(e.year):``}function Xn(e,t){ae(t,!0);var n=`/img/error_cover.png`,r=6e4,o=5;function s(e){e.target.src.endsWith(n)||(e.target.src=n)}var l=ge(t,`isClosing`,3,!1),w=ge(t,`initialTrackId`,15,null),se=ge(t,`depth`,15,1),D=Ze(function(){return t.onClose()}),O=B(`default`),A=B(!1),he=B(!1),F=B(!1),ye=B(null),xe=I(function(){var e;return!!H.fetchErrors[(e=H.library[H.currentTrackIndex])==null?void 0:e.id]}),z=I(function(){return H.isPlaying&&!l()&&!k(xe)}),we=`milkdrop`,Te=`milkdrop`,Fe=`shader`,Re=Vn(),V=Re?[{id:we,name:`MilkDrop`}]:wt,nt=Re||zn(),lt=`music_tv_v1`,ut=`on`,dt=`off`,ft=300,pt=3200,mt=`tracks`,ht=`presets`,gt=`music`,vt=2,yt=640;function bt(){try{return localStorage.getItem(lt)!==dt}catch(e){return!0}}var xt=B(x(bt())),St=B(0),K=I(function(){return V[k(St)].id===we}),Et=B(!1),Dt=B(null),Ot=B(null),kt=B(!1),At=null,jt=null,q=B(mt),J=null,Nt=!1,Pt=B(!1),Ft=I(function(){return nt&&k(xt)&&(k(K)?!!H.analyser:k(Pt))});function It(e){v(xt,e,!0);try{localStorage.setItem(lt,e?ut:dt)}catch(e){}}var Lt=B(!1),Rt=I(function(){var e=Xt.split(/`{5,}/);return{intro:e[0]||``,tos:e[1]||``,outro:e[2]||``}});function zt(e){if(!e)return``;var t=e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`);return t=t.replace(/(https?:\/\/[^\s]+)/g,`<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>`),t=t.replace(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/g,`<a href="mailto:$1">$1</a>`),t.replace(/\n/g,`<br>`)}var Bt=I(function(){var e=k(Z);if(!e)return Array(60).fill(10);if(H.waveformPeaks[e.id])return H.waveformPeaks[e.id];for(var t=e.id,n=[],r=0,i=0;i<t.length;i++)r=(r<<5)-r+t.charCodeAt(i),r|=0;for(var a=Math.abs(r)%1e3,o=0;o<60;o++){var s=o/59,c=Math.sin(a+s*Math.PI*4),l=Math.cos(a*1.5+s*Math.PI*10)*.4,u=Math.sin(a*2.3+s*Math.PI*22)*.15,d=Math.abs(c+l+u)/1.55,f=Math.sin(s*Math.PI),p=(d*70+15)*f;n.push(Math.max(10,Math.round(p)))}return n});C(function(){H.isPlaying&&v(Pt,!0)});var Vt=I(function(){return k(K)?null:!H.isPlaying&&!k(Pt)?Tt.fragmentShader:V[k(St)].fragmentShader});C(function(){var e=H.analyser,t=k(K)?Te:Fe;if(k(Ft)&&k(Dt)&&!l()&&k(Dt).dataset.engine===t){if(!k(K))J=new Ct(k(Dt),e),J.init(k(Vt)),J.start();else if(e&&H.audioCtx){var n=new Mt(k(Dt),e,H.audioCtx,U.listeners());de(function(){return U.attach(n)}),J=n,n.start()}}return function(){J&&(U.detach(J),J.destroy(),J=null)}}),C(function(){G.load(k(Z)?k(Z).id:null)}),C(function(){var e=k(Vt);e&&J&&k(Ft)&&!k(K)&&(J.setPreset(e),J.start())}),C(function(){var e=k(A)||k(Et);e!==Nt&&(Nt=e,e?(history.pushState(te(te({},history.state||{}),{},{view:gt,depth:vt,musicOverlay:!0}),``),se(vt)):history.back())});function Ht(e){var t;!Nt||(t=e.state)!=null&&t.musicOverlay||(Nt=!1,v(A,!1),v(Et,!1))}function Ut(){v(kt,!1),clearTimeout(At),At=setTimeout(function(){return v(kt,!0)},pt)}function Wt(){It(!0),kr(),v(Et,!0)}function Gt(){k(Ot)&&document.fullscreenElement===k(Ot)?document.exitFullscreen().catch(function(){return v(Et,!1)}):v(Et,!1)}var Kt=Ze(Gt);function qt(e){e.stopPropagation(),Kt(e)}C(function(){var e=k(Ot);if(e){Ut(),e.requestFullscreen&&e.requestFullscreen().catch(function(){});var t=function(){document.fullscreenElement||v(Et,!1)};return document.addEventListener(`fullscreenchange`,t),function(){document.removeEventListener(`fullscreenchange`,t),clearTimeout(At),document.fullscreenElement===e&&document.exitFullscreen().catch(function(){})}}});function Jt(e){k(F)&&k(ye)&&!k(ye).contains(e.target)&&!e.target.closest(`.vol-toggle-btn`)&&v(F,!1)}var Y=I(function(){return $e(Ye(Xe.unlocked),Xe.unlocked)}),Yt=null;function En(e){return e.src?e.src.split(`/`).pop():``}function On(e){if(!e.dateAdded)return`Summer`;var t=new Date(e.dateAdded).getMonth();return t===11||t===0||t===1?`Winter`:t>=2&&t<=4?`Spring`:t>=5&&t<=7?`Summer`:`Fall`}var X=I(function(){var e=k(Y).filter(function(e){return!e.hidden});return k(O)===`artist`?e.sort(function(e,t){return e.artist.localeCompare(t.artist)}):k(O)===`album`?e.sort(function(e,t){return e.album.localeCompare(t.album)}):k(O)===`year`?e.sort(function(e,t){return(e.year||0)-(t.year||0)}):k(O)===`filename`?e.sort(function(e,t){return En(e).localeCompare(En(t))}):k(O)===`genre`?e.sort(function(e,t){return(e.genre||``).localeCompare(t.genre||``)}):k(O)===`season`&&e.sort(function(e,t){return On(e).localeCompare(On(t))}),e}),Z=I(function(){var e;return(e=k(Y)[H.currentTrackIndex])==null?k(Y)[0]:e});C(function(){var e=k(Y);if(H.library!==e&&H.library.length!==0){var t=H.library[H.currentTrackIndex],n=t==null?void 0:t.id;H.init(e);var r=Yt?e.findIndex(function(e){return e.id===Yt}):-1,i=e.findIndex(function(e){return e.id===n});if(r!==-1)Yt=null,H.loadTrack(r,!0);else if(i!==-1){H.currentTrackIndex=i;var a=e[i],s=a.src!==t.src||a.instrumental!==t.instrumental,c=H.masterTabId&&H.masterTabId!==H.tabId,l=!H.isPlaying||H.currentTime<o;s&&l&&!c&&H.loadTrack(i,H.isPlaying)}else H.pause(),H.loadTrack(0,!1)}});var An=B(0),Mn=B(0),In=B(0),Bn=B(0),Xn=B(0),Zn=B(0),Qn=`This device is the remote: the sound is on the other one.`,$n=`Both players are in step.`,er=`It stays on until you close this window, disconnect in Air Train, or nothing happens for 10 minutes.`,tr=`The tether dropped: a screen turned off, or the network changed. This player is on its own until the devices find each other again, which they do by themselves.`,nr=B(!1),rr=I(function(){return W.holding?tr:`Tethered to ${W.peerName||`your other device`}. ${H.masterIsRemote?Qn:$n} ${er}`}),ir=B(null),ar=null;function or(e,t){e.stopPropagation();var n=`${et()}/music/${t.id}`;navigator.clipboard.writeText(n).then(function(){v(ir,t.id,!0),ar&&clearTimeout(ar),ar=setTimeout(function(){v(ir,null)},2e3)}).catch(function(e){console.error(`Failed to copy share link:`,e)})}var sr=B(null);function cr(e){var t;return Rn(e,e.id===((t=H.library[H.currentTrackIndex])==null?void 0:t.id)?H.isInstrumental:H.userPrefersInstrumental)}function lr(e,t){return ur.apply(this,arguments)}function ur(){return ur=g(u().m(function e(t,n){var i,a,o,s,c,l;return u().w(function(e){for(;;)switch(e.p=e.n){case 0:if(t.stopPropagation(),i=cr(n).url,i&&!k(sr)){e.n=1;break}return e.a(2);case 1:return v(sr,n.id,!0),e.p=2,e.n=3,fetch(i,Xe.fetchOptionsFor(i));case 3:if(a=e.v,a.ok){e.n=4;break}throw Error(`Fetch failed with status ${a.status}`);case 4:return c=URL,e.n=5,a.blob();case 5:o=c.createObjectURL.call(c,e.v),s=document.createElement(`a`),s.href=o,s.download=decodeURIComponent(i.split(`/`).pop()||``)||`${n.id}.mp3`,document.body.appendChild(s),s.click(),s.remove(),setTimeout(function(){return URL.revokeObjectURL(o)},r),e.n=7;break;case 6:e.p=6,l=e.v,console.error(`Failed to download track:`,l);case 7:return e.p=7,v(sr,null),e.f(7);case 8:return e.a(2)}},e,null,[[2,6,7,8]])})),ur.apply(this,arguments)}_e(function(){ar&&clearTimeout(ar)}),ee(function(){Xe.revalidate(),H.init(k(Y)),Qe.refresh(),G.refreshList();var e=Je(w());if(w(null),e){var t=k(Y).findIndex(function(t){return t.id===e});t===-1?Yt=e:H.loadTrack(t,!0)}else if(!H.hasPickedRandomTrack){H.hasPickedRandomTrack=!0;var n=k(Y).filter(function(e){return!e.hidden}),r=n[Math.floor(Math.random()*n.length)];H.loadTrack(k(Y).indexOf(r),!1)}});var dr=B(null);function fr(){var e=document.querySelector(`.track-row[data-track-id="${k(dr)}"]`);e&&e.scrollIntoView({block:`nearest`,behavior:`smooth`})}function pr(e){v(dr,e.id,!0);var t=k(Y).findIndex(function(t){return t.id===e.id});H.currentTrackIndex===t&&!H.fetchErrors[e.id]?H.togglePlay():H.loadTrack(t,!0)}function mr(){jt?(clearTimeout(jt),jt=null,Wt()):jt=setTimeout(function(){jt=null,hr()},ft)}function hr(){v(q,mt),window.innerWidth<=yt?v(A,!0):(v(dr,k(Z).id,!0),me().then(fr))}function gr(e){e.target.closest(`.scroll-container`)&&hr()}function _r(){var e=!H.isInstrumental;H.setCrossfade(e)||(c(br),k(xr)||(v(xr,!0),setTimeout(function(){v(xr,!1)},300)),k(br)===5?(Ir(),v(Sr,!0),setTimeout(function(){v(Sr,!1)},150)):k(br)===10?Ir(35):k(br)>5&&k(br)<10?Ir(8):k(br)>10&&Math.random()<.4&&Ir(3))}function vr(e){return!e||isNaN(e)?`0:00`:`${Math.floor(e/60)}:${Math.floor(e%60).toString().padStart(2,`0`)}`}function yr(e){var t=document.activeElement;if(!t||t.tagName!==`INPUT`&&t.tagName!==`TEXTAREA`&&!t.isContentEditable){if(e.code===`Space`||e.key===` `)e.preventDefault(),H.togglePlay();else if(e.key===`ArrowDown`){if(k(X).length>0){e.preventDefault();var n=k(X).findIndex(function(e){return e.id===k(dr)});if(n===-1){var r=k(Y)[H.currentTrackIndex];n=k(X).findIndex(function(e){return e.id===(r==null?void 0:r.id)})}var i=(n+1)%k(X).length;v(dr,k(X)[i].id,!0),fr()}}else if(e.key===`ArrowUp`){if(k(X).length>0){e.preventDefault();var a=k(X).findIndex(function(e){return e.id===k(dr)});if(a===-1){var o=k(Y)[H.currentTrackIndex];a=k(X).findIndex(function(e){return e.id===(o==null?void 0:o.id)})}var s=(a-1+k(X).length)%k(X).length;v(dr,k(X)[s].id,!0),fr()}}else if(e.key===`Enter`&&k(dr)){e.preventDefault();var c=k(X).find(function(e){return e.id===k(dr)});c&&pr(c)}}}var Q=B(null),br=B(0),xr=B(!1),Sr=B(!1),$,Cr,wr,Tr=[],Er=[],Dr,Or=B(!1);C(function(){return k(Q)&&Mr(),function(){var e;Dr&&cancelAnimationFrame(Dr),window.removeEventListener(`resize`,Nr),(e=window.visualViewport)==null||e.removeEventListener(`resize`,Nr),wr&&(wr.dispose(),wr=null),$=null,Cr=null,Tr=[],Er=[]}});function kr(){if(v(br,0),v(Or,!1),$){var e=f(Tr),t;try{for(e.s();!(t=e.n()).done;){var n=t.value;$.remove(n.mesh)}}catch(t){e.e(t)}finally{e.f()}var r=f(Er),i;try{for(r.s();!(i=r.n()).done;){var a=i.value;$.remove(a.mesh)}}catch(e){r.e(e)}finally{r.f()}}Tr=[],Er=[]}C(function(){H.currentTrackIndex,l(),kr()});function Ar(){if(!k(Q))return{width:window.innerWidth,height:window.innerHeight};var e=k(Q).getBoundingClientRect();return{width:e.width||window.innerWidth,height:e.height||window.innerHeight}}function jr(){var e=Ar(),t=e.width,n=e.height,r=document.querySelector(`.dj-fader-knob`);if(!r)return{x:t/2,y:n/2};var i=k(Q)?k(Q).getBoundingClientRect():{left:0,top:0},a=r.getBoundingClientRect();return{x:a.left+a.width/2-i.left,y:n-(a.top+a.height/2-i.top)}}function Mr(){var e;if(k(Q)){var t=Ar(),n=t.width,r=t.height;k(Q).width=n,k(Q).height=r,$=new at,Cr=new it(0,n,r,0,-1,1),wr=new Ce({canvas:k(Q),alpha:!0,antialias:!0}),wr.setSize(n,r,!1),wr.setPixelRatio(Math.min(window.devicePixelRatio,2)),window.addEventListener(`resize`,Nr),(e=window.visualViewport)==null||e.addEventListener(`resize`,Nr),Pr()}}function Nr(){if(k(Q)&&wr&&Cr){var e=Ar(),t=e.width,n=e.height;k(Q).width=t,k(Q).height=n,wr.setSize(t,n,!1),Cr.right=t,Cr.top=n,Cr.updateProjectionMatrix()}}function Pr(){if(Dr=requestAnimationFrame(Pr),$&&Cr&&wr&&k(Q)){if(k(br)>=10&&(v(Or,!0),Math.random()<.22)){var e=jr();Fr(e.x,e.y)}for(var t=Tr.length-1;t>=0;t--){var n=Tr[t];n.x+=n.vx,n.y+=n.vy,n.vy+=n.ay,n.life-=n.decay,n.mesh.position.set(n.x,n.y,0),n.mesh.material.opacity=n.life,n.life<=0&&($.remove(n.mesh),n.mesh.geometry.dispose(),n.mesh.material.dispose(),Tr.splice(t,1))}for(var r=Er.length-1;r>=0;r--){var i=Er[r];i.x+=i.vx,i.y+=i.vy,i.life-=i.decay;var a=i.startScale+(1-i.life)*88;i.mesh.scale.set(a,a,1),i.mesh.position.set(i.x,i.y,0),i.mesh.material.opacity=i.life*.16,i.life<=0&&($.remove(i.mesh),i.mesh.geometry.dispose(),i.mesh.material.dispose(),Er.splice(r,1))}wr.render($,Cr)}}function Fr(e,t){if($){var n=new rt(5,8),r=.85+Math.random()*.12,i=new st({color:new ot(r,r,r*1.01),transparent:!0,opacity:.06,blending:1}),a=new ct(n,i);a.position.set(e,t,0),$.add(a),Er.push({mesh:a,x:e,y:t,vx:(Math.random()-.5)*.55+Math.sin(Date.now()*.001)*.22,vy:Math.random()*.7+1.25,startScale:1,life:1,decay:6e-4+Math.random()*4e-4})}}function Ir(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:25;if($&&k(Q))for(var t=jr(),n=t.x,r=t.y,i=0;i<e;i++){var a=new rt(1.3,4),o=new st({color:new ot(Math.random()<.4?16711765:16755200),transparent:!0,opacity:1,blending:2}),s=new ct(a,o);s.position.set(n,r,0),$.add(s);var c=Math.random()*Math.PI*2,l=Math.random()*4+2;Tr.push({mesh:s,x:n,y:r,vx:Math.cos(c)*l,vy:Math.sin(c)*l,ay:-.15,life:1,decay:.02+Math.random()*.02})}}var Lr=Tn();ue(`keydown`,ie,yr),ue(`popstate`,ie,Ht),ue(`click`,ie,Jt);var Rr=P(Lr),zr,Br=P(Rr),Vr=P(Br),Hr=P(Vr),Ur=P(Hr);tt(Ur,{size:`panel`}),j(Hr);var Wr=b(Hr,2);Wr.textContent=`MUSIC`,j(Vr);var Gr=b(Vr,2),Kr=P(Gr);He(Kr,{size:20}),j(Gr),j(Br);var qr=b(Br,2),Jr=P(qr),Yr=P(Jr),Xr,Zr=P(Yr),Qr,$r=P(Zr),ei,ti=P($r),ni=function(e){var t=Qt(),r=P(t),o=function(e){var t=i(),n=a(t);m(n,function(){return k(K)},function(e){var t=Zt();le(t,function(e){return v(Dt,e)},function(){return k(Dt)}),R(function(){return L(t,`data-engine`,k(K)?Te:Fe)}),S(e,t)}),S(e,t)};_(r,function(e){k(Et)||e(o)});var c=b(r,2),l,u=N(c);ve(2),j(t),R(function(){l=y(c,1,`viz-label svelte-1o4jdf5`,null,l,{spinning:k(z)}),L(u,`src`,H.fetchErrors[k(Z).id]||!k(Z).cover?n:k(Z).cover),L(u,`alt`,k(Z).album)}),M(`click`,t,mr),ue(`error`,u,s),be(u),S(e,t)},ri=function(e){var t=i(),r=a(t),o=function(e){var t=$t(),r=P(t),i,a=b(P(r),8),o=P(a),c;j(a),ve(2),j(r);var l=b(r,2),u;j(t),R(function(){i=y(r,1,`vinyl-record svelte-1o4jdf5`,null,i,{spinning:k(z)}),L(o,`src`,H.fetchErrors[k(Z).id]||!k(Z).cover?n:k(Z).cover),L(o,`alt`,k(Z).album),c=y(o,1,`record-art svelte-1o4jdf5`,null,c,{loaded:k(he)}),u=y(l,1,`tonearm svelte-1o4jdf5`,null,u,{playing:k(z)})}),M(`click`,t,mr),ue(`load`,o,function(){return v(he,!0)}),ue(`error`,o,s),be(o),S(e,t)},c=function(e){var t=I(function(){return H.duration>0?(1-H.currentTime/H.duration)*.45+.25:.48}),n=I(function(){return H.duration>0?H.currentTime/H.duration*.45+.25:.48}),r=en(),i=P(r),a=P(i),o=P(a),s=N(o,!0);ve(2),j(a);var c=b(a,2),l=P(c),u,d=b(l,2),f,p=b(d,2),m,h=b(p,2),g;j(c),j(i),j(r),R(function(){E(s,k(Z).title),u=y(l,1,`spindle-left bg-zinc-900 svelte-1o4jdf5`,null,u,{spinning:k(z)}),f=y(d,1,`tape-roll-left bg-amber-950/70 svelte-1o4jdf5`,null,f,{spinning:k(z)}),fe(d,`width: ${k(t)*46}px; height: ${k(t)*46}px;`),m=y(p,1,`spindle-right bg-zinc-900 svelte-1o4jdf5`,null,m,{spinning:k(z)}),g=y(h,1,`tape-roll-right bg-amber-950/70 svelte-1o4jdf5`,null,g,{spinning:k(z)}),fe(h,`width: ${k(n)*46}px; height: ${k(n)*46}px;`)}),M(`click`,r,mr),S(e,r)},l=function(e){var t=tn(),n=P(t),r=b(P(n),4),i=b(P(r),4),a=P(i),o=N(a,!0),s=b(a,2),c=N(s,!0);j(i),j(r);var l=b(r,2),u=P(l),d,f=b(u,2),p=P(f),m;j(f),j(l);var h=b(l,2),g;j(n),j(t),R(function(){E(o,k(Z).title),E(c,k(Z).artist||`WEAREDOGS`),d=y(u,1,`floppy-shutter-slider bg-zinc-400 svelte-1o4jdf5`,null,d,{open:k(z)}),m=y(p,1,`floppy-magnetic-disc bg-zinc-900 svelte-1o4jdf5`,null,m,{spinning:k(z)}),g=y(h,1,`floppy-drive-led svelte-1o4jdf5`,null,g,{active:k(z)})}),M(`click`,t,mr),S(e,t)},u=function(e){var t=rn(),n=P(t),r=P(n),i,a=b(r,2),o=P(a),s=P(o),c,l=b(s,2),u;j(o);var d=b(o,2),f=P(d),p;j(d);var m=b(d,2);oe(m,20,function(){return Array(10)},T,function(e,t,n){var r=nn(),i;R(function(e){return i=y(r,1,`comb-tooth svelte-1o4jdf5`,null,i,{vibrating:e})},[function(){return k(z)&&n%3==Math.floor(H.currentTime*4)%3}]),S(e,r)}),j(m),j(a),j(n),j(t),R(function(){i=y(r,1,`music-box-key svelte-1o4jdf5`,null,i,{spinning:k(z)}),c=y(s,1,`music-box-gear gear-1 svelte-1o4jdf5`,null,c,{spinning:k(z)}),u=y(l,1,`music-box-gear gear-2 svelte-1o4jdf5`,null,u,{spinning:k(z)}),p=y(f,1,`music-box-drum bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 svelte-1o4jdf5`,null,p,{spinning:k(z)})}),M(`click`,t,mr),S(e,t)};_(r,function(e){Ae.musicDeckModel===`vinyl`?e(o):Ae.musicDeckModel===`cassette`?e(c,1):Ae.musicDeckModel===`floppy`?e(l,2):Ae.musicDeckModel===`musicbox`&&e(u,3)}),S(e,t)};_(ti,function(e){k(Ft)?e(ni):e(ri,-1)}),j($r);var ii=b($r,2),ai=P(ii),oi=P(ai),si=P(oi),ci=function(e){Ke(e,{size:12,class:`text-[#22c55e]`})},li=function(e){Ue(e,{size:12})};_(si,function(e){k(ir)===k(Z).id?e(ci):e(li,-1)}),j(oi);var ui=b(oi,2),di=function(e){var t=an(),n,r=P(t);We(r,{size:12}),j(t),R(function(e,r){n=y(t,1,`player-download-btn svelte-1o4jdf5`,null,n,{downloading:k(sr)===k(Z).id}),L(t,`title`,e),L(t,`aria-label`,r)},[function(){return cr(k(Z)).label},function(){return cr(k(Z)).label}]),M(`click`,t,function(e){return lr(e,k(Z))}),S(e,t)};_(ui,function(e){(k(Z).instrumental||k(Z).src)&&e(di)});var fi=b(ui,2),pi=function(e){var t=sn(),n=P(t),r,i=P(n),a=function(e){Ln(e,{size:12})},o=function(e){Ge(e,{size:12})};_(i,function(e){W.holding?e(a):e(o,-1)}),j(n);var s=b(n,2),c=function(e){var t=on(),n=N(t,!0);R(function(){return E(n,k(rr))}),S(e,t)};_(s,function(e){k(nr)&&e(c)}),j(t),R(function(){r=y(n,1,`player-tether-btn svelte-1o4jdf5`,null,r,{"player-tether-lost":W.holding}),L(n,`title`,k(rr)),L(n,`aria-label`,k(rr)),L(n,`aria-expanded`,k(nr))}),M(`click`,n,function(e){e.stopPropagation(),v(nr,!k(nr))}),ue(`blur`,n,function(){return v(nr,!1)}),S(e,t)};_(fi,function(e){(W.linked||W.holding)&&e(pi)}),j(ai);var mi=b(ai,2),hi,gi=P(mi),_i,vi=N(gi,!0);j(mi);var yi=b(mi,2),bi,xi=P(yi),Si,Ci=N(xi,!0);j(yi);var wi=b(yi,2),Ti,Ei=P(wi),Di,Oi=N(Ei,!0);j(wi),j(ii),j(Zr);var ki=b(Zr,2),Ai=P(ki);Wn(Ai,{});var ji=b(Ai,2),Mi=P(ji),Ni=N(Mi,!0),Pi=b(Mi,2),Fi=P(Pi);oe(Fi,21,function(){return k(Bt)},T,function(e,t,n){var r=I(function(){return H.duration>0?H.currentTime/H.duration:0}),i=I(function(){return n/60}),a=cn(),o;R(function(){var e;o=y(a,1,`waveform-bar transition-colors duration-100 rounded-full svelte-1o4jdf5`,null,o,{active:k(i)<=k(r)}),fe(a,`height: ${(e=k(t))==null?``:e}%; width: 3px;`)}),S(e,a)}),j(Fi);var Ii=b(Fi,2);d(Ii),j(Pi);var Li=b(Pi,2),Ri=N(Li,!0);j(ji);var zi=b(ji,2),Bi=P(zi),Vi,Hi=P(Bi);ze(Hi,{size:15}),j(Bi);var Ui=b(Bi,2),Wi=P(Ui);Ne(Wi,{size:19}),j(Ui);var Gi=b(Ui,2),Ki,qi=P(Gi),Ji=function(e){qe(e,{size:22})},Yi=function(e){var t=ln();S(e,t)},Xi=function(e){ke(e,{size:22,fill:`currentColor`})},Zi=function(e){Ee(e,{size:22,fill:`currentColor`})};_(qi,function(e){H.fetchErrors[k(Z).id]?e(Ji):H.isLoading?e(Yi,1):H.isPlaying?e(Xi,2):e(Zi,-1)}),j(Gi);var Qi=b(Gi,2),$i=P(Qi);Me($i,{size:19}),j(Qi);var ea=b(Qi,2),ta,na=P(ea),ra=function(e){Nn(e,{size:15})},ia=function(e){Dn(e,{size:15})},aa=function(e){Pn(e,{size:15})};_(na,function(e){H.repeatMode===2?e(ra):H.repeatMode===3?e(ia,1):e(aa,-1)}),j(ea),j(zi);var oa=b(zi,2),sa=P(oa),ca,la=P(sa),ua;jn(P(la),{size:12}),ve(2),j(la);var da=b(la,2),fa=P(da),pa;j(da);var ma=b(da,2),ha;kn(P(ma),{size:12}),ve(2),j(ma),j(sa),j(oa);var ga=b(oa,2),_a=P(ga),va=function(e){var t=un(),n=P(t),r=P(n),i=function(e){Le(e,{size:12,class:`text-red-400`})},a=function(e){Ie(e,{size:12})};_(r,function(e){H.isMuted||H.volume===0?e(i):e(a,-1)}),j(n);var o=b(n,2);d(o);var s=b(o,2),c=N(s);j(t),le(t,function(e){return v(ye,e)},function(){return k(ye)}),R(function(e){p(o,H.volume),E(c,`${e==null?``:e}%`)},[function(){return Math.round(H.volume*100)}]),M(`click`,n,function(){return H.toggleMute()}),M(`input`,o,function(e){return H.setVolume(parseFloat(e.target.value))}),S(e,t)};_(_a,function(e){k(F)&&e(va)});var ya=b(_a,2),ba=function(e){var t=I(function(){return k(xt)?`Visualizer: on`:`Visualizer: off`});Gn(e,{get on(){return k(xt)},accent:!0,get label(){return k(t)},onclick:function(){return It(!k(xt))},children:function(e,t){Pe(e,{size:14})},$$slots:{default:!0}})};_(ya,function(e){nt&&e(ba)});var xa=b(ya,2),Sa=P(xa);je(Sa,{size:14}),j(xa);var Ca=b(xa,2),wa=I(function(){return!G.has(k(Z).id)}),Ta=I(function(){return G.shown?G.has(k(Z).id)?`Lyrics: on`:`Lyrics: on. This song has none yet.`:`Lyrics: off`});Gn(Ca,{get on(){return G.shown},accent:!0,get dim(){return k(wa)},get label(){return k(Ta)},onclick:function(){return G.setPrefs({shown:!G.shown})},children:function(e,t){Fn(e,{size:14})},$$slots:{default:!0}});var Ea=b(Ca,2),Da=function(e){qn(e,{})};_(Ea,function(e){W.linked&&e(Da)});var Oa=b(Ea,2),ka=P(Oa),Aa=P(ka),ja=function(e){Le(e,{size:13,class:`text-red-400`})},Ma=function(e){Ie(e,{size:13})};_(Aa,function(e){H.isMuted||H.volume===0?e(ja):e(Ma,-1)}),j(ka),j(Oa),j(ga),j(ki),j(Yr);var Na=b(Yr,2),Pa,Fa=P(Na),Ia=b(P(Fa),2);j(Fa);var La=b(Fa,2),Ra=P(La),za=P(Ra),Ba,Va=P(za);Be(Va,{size:13});var Ha=b(Va,3),Ua=N(Ha,!0);j(za);var Wa=b(za,2),Ga=function(e){var t=fn(),n,r=P(t);Pe(r,{size:13});var i=b(r,3),a=function(e){var t=dn(),n=N(t,!0);R(function(){return E(n,U.names.length)}),S(e,t)};_(i,function(e){U.names.length&&e(a)}),j(t),R(function(){n=y(t,1,`tl-tab svelte-1o4jdf5`,null,n,{"tl-tab-on":k(q)===ht}),L(t,`aria-selected`,k(q)===ht)}),M(`click`,t,function(){return v(q,ht)}),S(e,t)};_(Wa,function(e){k(K)&&e(Ga)}),j(Ra);var Ka=b(Ra,2),qa=function(e){Kn(e,{class:`tl-sort-cycler sm:hidden`,get value(){return k(O)},onchange:function(e){return v(O,e,!0)}})};_(Ka,function(e){k(q)===mt&&e(qa)});var Ja=b(Ka,2),Ya,Xa=b(P(Ja),2),Za=P(Xa);Za.value=Za.__value=`default`;var Qa=b(Za);Qa.value=Qa.__value=`artist`;var $a=b(Qa);$a.value=$a.__value=`album`;var eo=b($a);eo.value=eo.__value=`year`;var to=b(eo);to.value=to.__value=`filename`;var no=b(to);no.value=no.__value=`genre`;var ro=b(no);ro.value=ro.__value=`season`,j(Xa),pe(Xa),j(Ja),j(La);var io=b(La,2),ao=function(e){Hn(e,{})};_(io,function(e){k(q)===ht&&e(ao)});var oo=b(io,2),so;oe(oo,21,function(){return k(X)},T,function(e,t,r){var i=yn(),a,o=P(i),c=P(o),l=function(e){var t=pn();S(e,t)},u=function(e){var t=mn();t.textContent=r+1,S(e,t)};_(c,function(e){k(Z).id===k(t).id&&H.isPlaying?e(l):e(u,-1)}),j(o);var d=b(o,2),f=b(d,2),p=P(f),m=P(p),h,g=N(m,!0),ee=b(m,2),te=function(e){var t=hn(),n=P(t);qe(n,{size:10}),ve(),j(t),S(e,t)};_(ee,function(e){H.fetchErrors[k(t).id]&&e(te)}),j(p);var ne=b(p,2),x=N(ne);j(f);var re=b(f,2),ie=P(re),ae=function(e){var n=vn(),r=P(n),i=function(e){var t=gn();M(`click`,t,function(e){e.stopPropagation(),v(Lt,!0)}),S(e,t)},a=function(e){var n=_n();R(function(){return L(n,`href`,k(t).attrib)}),M(`click`,n,function(e){return e.stopPropagation()}),S(e,n)};_(r,function(e){k(t).id===`arigato`?e(i):e(a,-1)}),j(n),S(e,n)};_(ie,function(e){k(t).attrib&&e(ae)});var C=b(ie,2),oe=P(C),w=function(e){Ke(e,{size:12,class:`text-[#22c55e]`})},T=function(e){Ue(e,{size:12})};_(oe,function(e){k(ir)===k(t).id?e(w):e(T,-1)}),j(C);var se=b(C,2),ce=function(e){var n=an(),r,i=P(n);We(i,{size:12}),j(n),R(function(e,i){r=y(n,1,`tr-download-btn svelte-1o4jdf5`,null,r,{downloading:k(sr)===k(t).id}),L(n,`title`,e),L(n,`aria-label`,i)},[function(){return cr(k(t)).label},function(){return cr(k(t)).label}]),M(`click`,n,function(e){return lr(e,k(t))}),S(e,n)};_(se,function(e){(k(t).instrumental||k(t).src)&&e(ce)}),j(re),j(i),R(function(e){var r,o;a=y(i,1,`track-row svelte-1o4jdf5`,null,a,{active:k(Z).id===k(t).id,"kb-focused":k(dr)===k(t).id,"fetch-error":H.fetchErrors[k(t).id]}),L(i,`data-track-id`,k(t).id),L(d,`src`,H.fetchErrors[k(t).id]||!k(t).cover?n:k(t).cover),L(d,`alt`,k(t).album),h=y(m,1,`tr-title svelte-1o4jdf5`,null,h,{"line-through":H.fetchErrors[k(t).id],"opacity-50":H.fetchErrors[k(t).id]}),E(g,k(t).title),E(x,`${(r=k(t).artist)==null?``:r} · ${(o=k(t).album)==null?``:o}${e==null?``:e}`)},[function(){return Yn(k(t))?` (${Yn(k(t))})`:``}]),M(`click`,i,function(){return pr(k(t))}),ue(`error`,d,s),be(d),M(`click`,C,function(e){return or(e,k(t))}),S(e,i)}),j(oo),j(Na),j(Jr),j(qr),ve(2),j(Rr);var co=b(Rr,2),lo=function(e){var t=Cn(),r,o=P(t),c=P(o),l=function(e){var t=i(),n=a(t);m(n,function(){return k(K)},function(e){var t=Zt();le(t,function(e){return v(Dt,e)},function(){return k(Dt)}),R(function(){return L(t,`data-engine`,k(K)?Te:Fe)}),S(e,t)}),S(e,t)},u=function(e){var t=bn();R(function(){return L(t,`src`,k(Z).cover||n)}),ue(`error`,t,s),be(t),S(e,t)};_(c,function(e){k(Ft)?e(l):e(u,-1)}),Wn(b(c,2),{variant:`stage`}),j(o);var d=b(o,2),f=P(d),p=I(function(){return G.has(k(Z).id)});Jn(f,{get hasLyrics(){return k(p)},onExit:Gt});var h=b(f,2),g=function(e){var t=Sn();oe(t,21,function(){return V},T,function(e,t,n){var r=xn(),i=N(r,!0);R(function(){y(r,1,`px-2 py-1 rounded text-[9px] font-bold transition-all uppercase tracking-wider font-mono 2xl:px-3 2xl:py-2 2xl:text-[13px]
                ${k(St)===n?`bg-white text-black`:`text-white/40 hover:text-white/80`}`,`svelte-1o4jdf5`),E(i,k(t).name)}),M(`click`,r,function(){return v(St,n,!0)}),S(e,r)}),j(t),S(e,t)};_(h,function(e){V.length>1&&e(g)});var ee=b(h,2),te=function(e){Un(e,{})};_(ee,function(e){k(K)&&e(te)}),j(d),j(t),le(t,function(e){return v(Ot,e)},function(){return k(Ot)}),R(function(){return r=y(t,1,`visualizer-container fullscreen svelte-1o4jdf5`,null,r,{"stage-idle":k(kt)})}),M(`click`,t,qt),M(`pointerdown`,t,Ut),M(`pointermove`,t,Ut),M(`click`,d,function(e){return e.stopPropagation()}),S(e,t)};_(co,function(e){k(Et)&&e(lo)});var uo=b(co,2);le(uo,function(e){return v(Q,e)},function(){return k(Q)});var fo=b(uo,2),po=function(e){var t=wn(),n=P(t),r=P(n),i=b(P(r),2),a=P(i);He(a,{size:16}),j(i),j(r);var o=b(r,2),s=P(o),c=P(s),l=P(c);Ve(l,{size:14}),ve(),j(c),j(s);var u=b(s,2);h(u,function(){return zt(k(Rt).intro)},!0),j(u);var d=b(u,2),f=P(d);h(f,function(){return zt(k(Rt).tos)},!0),j(f),j(d);var p=b(d,2);h(p,function(){return zt(k(Rt).outro)},!0),j(p),j(o),j(n),j(t),M(`click`,t,function(){return v(Lt,!1)}),M(`click`,n,function(e){return e.stopPropagation()}),M(`click`,i,function(){return v(Lt,!1)}),ne(3,t,function(){return _t},function(){return{duration:150}}),S(e,t)};_(fo,function(e){k(Lt)&&e(po)}),j(Lr),R(function(e,t,n){zr=y(Rr,1,`mp-container svelte-1o4jdf5`,null,zr,{closing:l(),"theme-inst":H.isInstrumental}),fe(Rr,e),Xr=y(Yr,1,`player-side svelte-1o4jdf5`,null,Xr,{"tracklist-open":k(A)}),Qr=y(Zr,1,`player-top-block transition-all duration-300 ease-in-out svelte-1o4jdf5`,null,Qr,{"opacity-0":k(A),"scale-95":k(A),"pointer-events-none":k(A)}),ei=y($r,1,`vinyl-wrapper relative overflow-hidden svelte-1o4jdf5`,null,ei,{"deck-glitch":k(xe)}),hi=y(mi,1,`scroll-container svelte-1o4jdf5`,null,hi,{overflowing:k(Mn)>k(An)}),fe(mi,`--scroll-dist: -${k(Mn)-k(An)}px`),_i=y(gi,1,`track-title scroll-text svelte-1o4jdf5`,null,_i,{"animate-scroll":k(Mn)>k(An)}),E(vi,k(Z).title),bi=y(yi,1,`scroll-container svelte-1o4jdf5`,null,bi,{overflowing:k(Bn)>k(In)}),fe(yi,`--scroll-dist: -${k(Bn)-k(In)}px`),Si=y(xi,1,`track-artist scroll-text svelte-1o4jdf5`,null,Si,{"animate-scroll":k(Bn)>k(In)}),E(Ci,k(Z).artist),Ti=y(wi,1,`scroll-container svelte-1o4jdf5`,null,Ti,{overflowing:k(Zn)>k(Xn)}),fe(wi,`--scroll-dist: -${k(Zn)-k(Xn)}px`),Di=y(Ei,1,`track-album scroll-text svelte-1o4jdf5`,null,Di,{"animate-scroll":k(Zn)>k(Xn)}),E(Oi,k(Z).album),E(Ni,t),L(Ii,`max`,H.duration||100),p(Ii,H.currentTime),E(Ri,n),Vi=y(Bi,1,`ctrl ctrl-sm svelte-1o4jdf5`,null,Vi,{"active-ctrl":H.isShuffled}),Ki=y(Gi,1,`ctrl ctrl-play svelte-1o4jdf5`,null,Ki,{"ctrl-error":H.fetchErrors[k(Z).id]}),L(Gi,`aria-label`,H.isPlaying?`Pause`:`Play`),ta=y(ea,1,`ctrl ctrl-sm svelte-1o4jdf5`,null,ta,{"active-ctrl":H.repeatMode>0}),L(ea,`title`,H.repeatMode===1?`Repeat: all`:H.repeatMode===2?`Repeat: one`:H.repeatMode===3?`Stop after current track`:`Repeat: off`),ca=y(sa,1,`dj-crossfader svelte-1o4jdf5`,null,ca,{"fader-flash":k(Sr),"fader-fried":k(br)>=10}),ua=y(la,1,`fader-label left-label flex items-center gap-1 svelte-1o4jdf5`,null,ua,{active:!H.isInstrumental}),pa=y(fa,1,`dj-fader-knob svelte-1o4jdf5`,null,pa,{right:H.isInstrumental,"knob-jiggle":k(xr),fried:k(br)>=10}),ha=y(ma,1,`fader-label right-label flex items-center gap-1 svelte-1o4jdf5`,null,ha,{active:H.isInstrumental}),Pa=y(Na,1,`tracklist-side svelte-1o4jdf5`,null,Pa,{"show-mobile":k(A)}),Ba=y(za,1,`tl-tab svelte-1o4jdf5`,null,Ba,{"tl-tab-on":k(q)===mt}),L(za,`aria-selected`,k(q)===mt),E(Ua,k(X).length),Ya=y(Ja,1,`hidden sm:flex items-center gap-1.5 ml-auto svelte-1o4jdf5`,null,Ya,{invisible:k(q)!==mt}),so=y(oo,1,`tracklist scroll-y svelte-1o4jdf5`,null,so,{hidden:k(q)!==mt})},[function(){return De(Ae.musicPalette)},function(){return vr(H.currentTime)},function(){return vr(H.duration)}]),M(`click`,Lr,D),M(`click`,Rr,function(e){return e.stopPropagation()}),M(`click`,Hr,function(){var e,t=[...arguments];(e=Oe)==null||e.apply(this,t)}),M(`click`,Gr,function(){var e,n=[...arguments];(e=t.onClose)==null||e.apply(this,n)}),M(`click`,ii,gr),M(`click`,oi,function(e){return or(e,k(Z))}),Se(gi,`clientWidth`,function(e){return v(Mn,e)}),Se(mi,`clientWidth`,function(e){return v(An,e)}),Se(xi,`clientWidth`,function(e){return v(Bn,e)}),Se(yi,`clientWidth`,function(e){return v(In,e)}),Se(Ei,`clientWidth`,function(e){return v(Zn,e)}),Se(wi,`clientWidth`,function(e){return v(Xn,e)}),M(`input`,Ii,function(e){H.seek(parseFloat(e.target.value))}),M(`change`,Ii,function(e){H.isPlaying||H.play(parseFloat(e.target.value))}),M(`click`,Bi,function(){return H.setShuffle(!H.isShuffled)}),M(`click`,Ui,function(){return H.prevTrack()}),M(`click`,Gi,function(){return H.togglePlay()}),M(`click`,Qi,function(){return H.nextTrack()}),M(`click`,ea,function(){return H.cycleRepeat()}),M(`click`,sa,_r),M(`click`,xa,Wt),M(`click`,ka,function(){v(F,!k(F))}),M(`click`,Ia,function(){v(A,!1)}),M(`click`,za,function(){return v(q,mt)}),re(Xa,function(){return k(O)},function(e){return v(O,e)}),ne(1,Jr,function(){return _t},function(){return{duration:120,delay:120}}),ne(2,Jr,function(){return _t},function(){return{duration:120}}),S(e,Lr),ce()}return e(`default`,Xn),{setters:[function(e){r=e.o},function(e){i=e.$,a=e.At,o=e.B,c=e.Bt,d=e.C,p=e.D,m=e.G,h=e.H,ee=e.J,_=e.K,ne=e.L,v=e.Lt,y=e.M,b=e.Mt,x=e.Nt,re=e.O,ie=e.Ot,S=e.Q,ae=e.Qt,C=e.Tt,oe=e.U,w=e.V,T=e.W,E=e.X,se=e.Y,ce=e.Zt,le=e._,D=e.a,ue=e.at,O=e.c,k=e.dt,A=e.et,de=e.ht,j=e.in,M=e.it,fe=e.j,N=e.jt,pe=e.k,P=e.kt,me=e.mt,he=e.n,ge=e.o,F=e.on,_e=e.q,I=e.qt,ve=e.rn,ye=e.rt,be=e.st,xe=e.tt,Se=e.v,L=e.w,R=e.wt,z=e.x,B=e.zt},function(e){Ce=e.n},function(e){we=e.n,Te=e.r,Ee=e.t},function(e){De=e.d,Oe=e.f,ke=e.m,Ae=e.s},function(e){je=e.i,Me=e.n,Ne=e.r,Pe=e.t},function(e){Fe=e.n,Ie=e.t},function(e){Le=e.t},function(e){Re=e.n,ze=e.t},function(e){V=e.r},function(e){Be=e.t},function(e){Ve=e.t},function(e){He=e.t},function(e){Ue=e.t},function(e){We=e.t},function(e){Ge=e.t},function(e){Ke=e.t},function(e){qe=e.t},function(e){Je=e.i,Ye=e.o,Xe=e.r,H=e.t},function(e){Ze=e.t},function(e){Qe=e.n,$e=e.t},function(e){U=e.h,W=e.t},function(e){et=e.t},function(e){tt=e.t},function(e){nt=e.t},function(e){rt=e.B,it=e.Er,at=e.Qi,ot=e.U,st=e.ar,ct=e.ir},function(e){lt=e.t},function(e){G=e.i,ut=e.n,dt=e.r,ft=e.t},function(e){pt=e.n},function(e){mt=e.t},function(e){ht=e.n,gt=e.t},function(e){_t=e.t}],execute:function(){vt=document.createElement(`style`),vt.textContent=`@-webkit-keyframes svelte-80frst-trophyFloat{0%{transform:translateY(0)scale(1)}to{transform:translateY(-3px)scale(1.04)}}@keyframes svelte-80frst-trophyFloat{0%{transform:translateY(0)scale(1)}to{transform:translateY(-3px)scale(1.04)}}@-webkit-keyframes svelte-80frst-pulseGlow{0%{box-shadow:0 0 4px rgba(239,68,68,.1)}to{box-shadow:0 0 12px rgba(239,68,68,.35)}}@keyframes svelte-80frst-pulseGlow{0%{box-shadow:0 0 4px rgba(239,68,68,.1)}to{box-shadow:0 0 12px rgba(239,68,68,.35)}}@-webkit-keyframes svelte-80frst-searchPulse{0%{border-color:rgba(var(--color-neon-gold,#e6b900), .4)}to{border-color:rgba(var(--color-neon-gold,#e6b900), .95)}}@keyframes svelte-80frst-searchPulse{0%{border-color:rgba(var(--color-neon-gold,#e6b900), .4)}to{border-color:rgba(var(--color-neon-gold,#e6b900), .95)}}@-webkit-keyframes svelte-80frst-flashGlow{0%,to{border-color:var(--border-light,rgba(255,255,255,.05));box-shadow:none}50%{border-color:rgba(var(--color-neon-red,#f34), .8);box-shadow:0 0 20px rgba(var(--color-neon-red,#f34), .35)}}@keyframes svelte-80frst-flashGlow{0%,to{border-color:var(--border-light,rgba(255,255,255,.05));box-shadow:none}50%{border-color:rgba(var(--color-neon-red,#f34), .8);box-shadow:0 0 20px rgba(var(--color-neon-red,#f34), .35)}}.filter-btn.svelte-80frst{letter-spacing:.06em;text-transform:uppercase;color:rgba(255,255,255,.7);border-radius:4px;align-items:center;gap:3px;padding:2px 7px;font-size:10px;font-weight:700;transition:background .15s,color .15s;display:flex}.filter-on.svelte-80frst{color:#fff;background:rgba(255,255,255,.08)}.heart-btn.svelte-80frst{color:rgba(255,255,255,.7);opacity:.45;flex-shrink:0;justify-content:center;align-items:center;width:34px;height:30px;transition:opacity .15s,color .15s,transform .15s;display:flex}.heart-btn.svelte-80frst:hover{opacity:1}.heart-btn.svelte-80frst:focus-visible{opacity:1}.heart-btn.svelte-80frst:active{transform:scale(.85)}.hearted.svelte-80frst{opacity:1;color:var(--color-neon-red,#f34)}@media (min-width:1536px){.filter-btn.svelte-80frst{padding:4px 10px;font-size:13px}.heart-btn.svelte-80frst{width:48px;height:44px}}@-webkit-keyframes svelte-6h1e9g-trophyFloat{0%{transform:translateY(0)scale(1)}to{transform:translateY(-3px)scale(1.04)}}@keyframes svelte-6h1e9g-trophyFloat{0%{transform:translateY(0)scale(1)}to{transform:translateY(-3px)scale(1.04)}}@-webkit-keyframes svelte-6h1e9g-pulseGlow{0%{box-shadow:0 0 4px rgba(239,68,68,.1)}to{box-shadow:0 0 12px rgba(239,68,68,.35)}}@keyframes svelte-6h1e9g-pulseGlow{0%{box-shadow:0 0 4px rgba(239,68,68,.1)}to{box-shadow:0 0 12px rgba(239,68,68,.35)}}@-webkit-keyframes svelte-6h1e9g-searchPulse{0%{border-color:rgba(var(--color-neon-gold,#e6b900), .4)}to{border-color:rgba(var(--color-neon-gold,#e6b900), .95)}}@keyframes svelte-6h1e9g-searchPulse{0%{border-color:rgba(var(--color-neon-gold,#e6b900), .4)}to{border-color:rgba(var(--color-neon-gold,#e6b900), .95)}}@-webkit-keyframes svelte-6h1e9g-flashGlow{0%,to{border-color:var(--border-light,rgba(255,255,255,.05));box-shadow:none}50%{border-color:rgba(var(--color-neon-red,#f34), .8);box-shadow:0 0 20px rgba(var(--color-neon-red,#f34), .35)}}@keyframes svelte-6h1e9g-flashGlow{0%,to{border-color:var(--border-light,rgba(255,255,255,.05));box-shadow:none}50%{border-color:rgba(var(--color-neon-red,#f34), .8);box-shadow:0 0 20px rgba(var(--color-neon-red,#f34), .35)}}.deck-btn.svelte-6h1e9g{color:rgba(255,255,255,.7);border-radius:6px;flex-shrink:0;justify-content:center;align-items:center;width:30px;height:30px;transition:background .15s,color .15s,transform .15s;display:flex}.deck-btn.svelte-6h1e9g:hover{color:#fff;background:rgba(255,255,255,.08)}.deck-btn.svelte-6h1e9g:focus-visible{color:#fff;background:rgba(255,255,255,.08)}.deck-btn.svelte-6h1e9g:active{transform:scale(.88)}.deck-btn-on.svelte-6h1e9g{color:var(--color-neon-green,#00d75f)}.deck-hearted.svelte-6h1e9g{color:var(--color-neon-red,#f34)}.deck-timer-hand.svelte-6h1e9g{transform-box:view-box;transform-origin:12px 14px}.deck-timer-running.svelte-6h1e9g{-webkit-animation:.35s ease-out svelte-6h1e9g-deck-timer-kick;animation:.35s ease-out svelte-6h1e9g-deck-timer-kick}.deck-timer-running.svelte-6h1e9g .deck-timer-hand:where(.svelte-6h1e9g){-webkit-animation:svelte-6h1e9g-deck-timer-sweep var(--auto-ms) linear forwards;animation:svelte-6h1e9g-deck-timer-sweep var(--auto-ms) linear forwards}@-webkit-keyframes svelte-6h1e9g-deck-timer-sweep{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes svelte-6h1e9g-deck-timer-sweep{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@-webkit-keyframes svelte-6h1e9g-deck-timer-kick{0%{transform:scale(1.3)}to{transform:none}}@keyframes svelte-6h1e9g-deck-timer-kick{0%{transform:scale(1.3)}to{transform:none}}@media (prefers-reduced-motion:reduce){.deck-timer-running.svelte-6h1e9g{-webkit-animation:none;animation:none}.deck-timer-running.svelte-6h1e9g .deck-timer-hand:where(.svelte-6h1e9g){-webkit-animation:none;animation:none}}@media (min-width:1536px){.deck-btn.svelte-6h1e9g{width:44px;height:44px}}.lyric-line.svelte-4gkonh{white-space:nowrap;pointer-events:none;font-family:var(--lyric-font);-webkit-user-select:none;user-select:none;overflow:hidden}.lyric-row.svelte-4gkonh{transform:scale(var(--lyric-fit));display:inline-block}.lyric-word.svelte-4gkonh{opacity:0;margin-right:.3em;display:inline-block}.lyric-word.svelte-4gkonh.sung{opacity:1;-webkit-animation:.32s ease-out svelte-4gkonh-lyric-flash;animation:.32s ease-out svelte-4gkonh-lyric-flash}.lyric-slot.svelte-4gkonh{text-align:left;letter-spacing:.01em;width:100%;height:1.25rem;color:rgba(var(--mp-ink-rgb,255, 255, 255), .92);flex-shrink:0;font-size:.8125rem;font-weight:700;line-height:1.25rem}.lyric-slot.svelte-4gkonh .lyric-row:where(.svelte-4gkonh){transform-origin:0}.lyric-stage.svelte-4gkonh{z-index:15;text-align:center;font-size:calc(clamp(1rem, min(5.2vw, 12vh), 6rem) * var(--lyric-scale));font-size:calc(clamp(1rem, min(5.2cqw, 12cqh), 6rem) * var(--lyric-scale));color:rgb(var(--mp-ink-rgb,255, 255, 255));text-shadow:0 0 .5em rgba(0,0,0,.85),0 .06em .12em rgba(0,0,0,.9);font-weight:800;line-height:1.3;position:absolute;left:4%;right:4%}.lyric-stage.svelte-4gkonh .lyric-row:where(.svelte-4gkonh){transform-origin:50%}.lyric-stage.lyric-at-top.svelte-4gkonh{top:9%}.lyric-stage.lyric-at-middle.svelte-4gkonh{margin-top:-.65em;top:50%}.lyric-stage.lyric-at-bottom.svelte-4gkonh{bottom:16%}@-webkit-keyframes svelte-4gkonh-lyric-flash{0%{opacity:0;-webkit-filter:brightness(2.2);filter:brightness(2.2);transform:translateY(.18em)scale(1.18)}45%{opacity:1;-webkit-filter:brightness(1.8);filter:brightness(1.8)}to{opacity:1;-webkit-filter:none;filter:none;transform:none}}@keyframes svelte-4gkonh-lyric-flash{0%{opacity:0;-webkit-filter:brightness(2.2);filter:brightness(2.2);transform:translateY(.18em)scale(1.18)}45%{opacity:1;-webkit-filter:brightness(1.8);filter:brightness(1.8)}to{opacity:1;-webkit-filter:none;filter:none;transform:none}}@media (max-height:700px){.lyric-slot.svelte-4gkonh{height:.875rem;font-size:.75rem;line-height:.875rem}}@media (max-height:500px){.lyric-stage.lyric-at-bottom.svelte-4gkonh{bottom:26%}}@media (prefers-reduced-motion:reduce){.lyric-word.svelte-4gkonh.sung{-webkit-animation:none;animation:none}}.strike-toggle.svelte-btbnk2{color:rgba(255,255,255,.5);cursor:pointer;background:0 0;border:none;border-radius:50%;flex-shrink:0;justify-content:center;align-items:center;width:26px;height:26px;padding:0;transition:color .2s,opacity .2s,transform .15s cubic-bezier(.34,1.56,.64,1);display:flex;position:relative}.strike-toggle.svelte-btbnk2:hover{color:rgba(255,255,255,.9);transform:scale(1.1)}.strike-toggle.svelte-btbnk2:active{transform:scale(.88)}.is-accent.svelte-btbnk2,.is-accent.svelte-btbnk2:hover{color:rgb(var(--mp-accent-rgb,255, 255, 255))}.is-off.svelte-btbnk2{opacity:.7}.is-dim.svelte-btbnk2{opacity:.75}.strike.svelte-btbnk2{pointer-events:none;background:currentColor;border-radius:1px;width:22px;height:2px;margin:-1px 0 0 -11px;transition:transform .26s cubic-bezier(.34,1.56,.64,1);position:absolute;top:50%;left:50%;transform:rotate(-45deg)scaleX(0);box-shadow:0 0 0 1.5px rgba(5,5,8,.9)}.is-off.svelte-btbnk2 .strike:where(.svelte-btbnk2){transform:rotate(-45deg)scaleX(1)}@media (prefers-reduced-motion:reduce){.strike.svelte-btbnk2,.strike-toggle.svelte-btbnk2{transition:none}}@-webkit-keyframes svelte-1ly12po-trophyFloat{0%{transform:translateY(0)scale(1)}to{transform:translateY(-3px)scale(1.04)}}@keyframes svelte-1ly12po-trophyFloat{0%{transform:translateY(0)scale(1)}to{transform:translateY(-3px)scale(1.04)}}@-webkit-keyframes svelte-1ly12po-pulseGlow{0%{box-shadow:0 0 4px rgba(239,68,68,.1)}to{box-shadow:0 0 12px rgba(239,68,68,.35)}}@keyframes svelte-1ly12po-pulseGlow{0%{box-shadow:0 0 4px rgba(239,68,68,.1)}to{box-shadow:0 0 12px rgba(239,68,68,.35)}}@-webkit-keyframes svelte-1ly12po-searchPulse{0%{border-color:rgba(var(--color-neon-gold,#e6b900), .4)}to{border-color:rgba(var(--color-neon-gold,#e6b900), .95)}}@keyframes svelte-1ly12po-searchPulse{0%{border-color:rgba(var(--color-neon-gold,#e6b900), .4)}to{border-color:rgba(var(--color-neon-gold,#e6b900), .95)}}@-webkit-keyframes svelte-1ly12po-flashGlow{0%,to{border-color:var(--border-light,rgba(255,255,255,.05));box-shadow:none}50%{border-color:rgba(var(--color-neon-red,#f34), .8);box-shadow:0 0 20px rgba(var(--color-neon-red,#f34), .35)}}@keyframes svelte-1ly12po-flashGlow{0%,to{border-color:var(--border-light,rgba(255,255,255,.05));box-shadow:none}50%{border-color:rgba(var(--color-neon-red,#f34), .8);box-shadow:0 0 20px rgba(var(--color-neon-red,#f34), .35)}}.sort-cycler.svelte-1ly12po{cursor:pointer;background:0 0;border:1px solid;border-radius:6px;justify-content:center;align-items:center;width:36px;height:24px;padding:0;transition:color .2s,transform .15s cubic-bezier(.34,1.56,.64,1);display:flex}.sort-cycler.svelte-1ly12po:active{transform:scale(.88)}.sort-icon.svelte-1ly12po{-webkit-animation:.25s ease-out svelte-1ly12po-sort-swap;animation:.25s ease-out svelte-1ly12po-sort-swap;display:flex}.sort-default.svelte-1ly12po{color:rgba(255,255,255,.75)}.sort-artist.svelte-1ly12po{color:var(--color-neon-red,#f34)}.sort-album.svelte-1ly12po{color:var(--color-doc-sky,#38bdf8)}.sort-year.svelte-1ly12po{color:var(--color-neon-gold,#e6b900)}.sort-filename.svelte-1ly12po{color:var(--color-neon-green,#00d75f)}.sort-genre.svelte-1ly12po{color:rgba(180,85,255,.95)}.sort-season.svelte-1ly12po{color:var(--color-image-orange,#ff5e00)}@-webkit-keyframes svelte-1ly12po-sort-swap{0%{opacity:0;transform:rotate(-90deg)scale(.6)}to{opacity:1;transform:none}}@keyframes svelte-1ly12po-sort-swap{0%{opacity:0;transform:rotate(-90deg)scale(.6)}to{opacity:1;transform:none}}@media (prefers-reduced-motion:reduce){.sort-icon.svelte-1ly12po{-webkit-animation:none;animation:none}}.sound-switch.svelte-1vwnx9r{width:26px;height:26px;color:rgb(var(--mp-accent-rgb,255, 255, 255));cursor:pointer;background:0 0;border:none;border-radius:50%;flex-shrink:0;justify-content:center;align-items:center;padding:0;transition:transform .15s cubic-bezier(.34,1.56,.64,1);display:flex}.sound-switch.svelte-1vwnx9r:hover:not(:disabled){transform:scale(1.1)}.sound-switch.svelte-1vwnx9r:active:not(:disabled){transform:scale(.88)}.sound-switch.svelte-1vwnx9r:disabled{opacity:.35;cursor:not-allowed}.sound-icon.svelte-1vwnx9r{transition:transform .35s cubic-bezier(.34,1.56,.64,1);display:flex}.sound-away.svelte-1vwnx9r .sound-icon:where(.svelte-1vwnx9r){transform:scaleX(-1)}@media (prefers-reduced-motion:reduce){.sound-icon.svelte-1vwnx9r{transition:none}}@-webkit-keyframes svelte-chvcxl-trophyFloat{0%{transform:translateY(0)scale(1)}to{transform:translateY(-3px)scale(1.04)}}@keyframes svelte-chvcxl-trophyFloat{0%{transform:translateY(0)scale(1)}to{transform:translateY(-3px)scale(1.04)}}@-webkit-keyframes svelte-chvcxl-pulseGlow{0%{box-shadow:0 0 4px rgba(239,68,68,.1)}to{box-shadow:0 0 12px rgba(239,68,68,.35)}}@keyframes svelte-chvcxl-pulseGlow{0%{box-shadow:0 0 4px rgba(239,68,68,.1)}to{box-shadow:0 0 12px rgba(239,68,68,.35)}}@-webkit-keyframes svelte-chvcxl-searchPulse{0%{border-color:rgba(var(--color-neon-gold,#e6b900), .4)}to{border-color:rgba(var(--color-neon-gold,#e6b900), .95)}}@keyframes svelte-chvcxl-searchPulse{0%{border-color:rgba(var(--color-neon-gold,#e6b900), .4)}to{border-color:rgba(var(--color-neon-gold,#e6b900), .95)}}@-webkit-keyframes svelte-chvcxl-flashGlow{0%,to{border-color:var(--border-light,rgba(255,255,255,.05));box-shadow:none}50%{border-color:rgba(var(--color-neon-red,#f34), .8);box-shadow:0 0 20px rgba(var(--color-neon-red,#f34), .35)}}@keyframes svelte-chvcxl-flashGlow{0%,to{border-color:var(--border-light,rgba(255,255,255,.05));box-shadow:none}50%{border-color:rgba(var(--color-neon-red,#f34), .8);box-shadow:0 0 20px rgba(var(--color-neon-red,#f34), .35)}}div.svelte-chvcxl .stage-btn{color:rgba(255,255,255,.7);border-radius:6px;flex-shrink:0;justify-content:center;align-items:center;min-width:30px;height:30px;font-size:11px;font-weight:700;transition:background .15s,color .15s;display:flex}div.svelte-chvcxl .stage-btn:hover{color:#fff;background:rgba(255,255,255,.08)}div.svelte-chvcxl .stage-btn:focus-visible{color:#fff;background:rgba(255,255,255,.08)}.stage-btn-wide.svelte-chvcxl{min-width:52px;padding:0 8px}@media (min-width:1536px){div.svelte-chvcxl .stage-btn{min-width:44px;height:44px;font-size:14px}.stage-btn-wide.svelte-chvcxl{min-width:76px}}@-webkit-keyframes svelte-1o4jdf5-trophyFloat{0%{transform:translateY(0)scale(1)}to{transform:translateY(-3px)scale(1.04)}}@keyframes svelte-1o4jdf5-trophyFloat{0%{transform:translateY(0)scale(1)}to{transform:translateY(-3px)scale(1.04)}}@-webkit-keyframes svelte-1o4jdf5-pulseGlow{0%{box-shadow:0 0 4px rgba(239,68,68,.1)}to{box-shadow:0 0 12px rgba(239,68,68,.35)}}@keyframes svelte-1o4jdf5-pulseGlow{0%{box-shadow:0 0 4px rgba(239,68,68,.1)}to{box-shadow:0 0 12px rgba(239,68,68,.35)}}@-webkit-keyframes svelte-1o4jdf5-searchPulse{0%{border-color:rgba(var(--color-neon-gold,#e6b900), .4)}to{border-color:rgba(var(--color-neon-gold,#e6b900), .95)}}@keyframes svelte-1o4jdf5-searchPulse{0%{border-color:rgba(var(--color-neon-gold,#e6b900), .4)}to{border-color:rgba(var(--color-neon-gold,#e6b900), .95)}}@-webkit-keyframes svelte-1o4jdf5-flashGlow{0%,to{border-color:var(--border-light,rgba(255,255,255,.05));box-shadow:none}50%{border-color:rgba(var(--color-neon-red,#f34), .8);box-shadow:0 0 20px rgba(var(--color-neon-red,#f34), .35)}}@keyframes svelte-1o4jdf5-flashGlow{0%,to{border-color:var(--border-light,rgba(255,255,255,.05));box-shadow:none}50%{border-color:rgba(var(--color-neon-red,#f34), .8);box-shadow:0 0 20px rgba(var(--color-neon-red,#f34), .35)}}.mp-backdrop.svelte-1o4jdf5{z-index:1000;-webkit-backdrop-filter:blur(12px);background:rgba(0,0,0,.55);justify-content:center;align-items:center;display:flex;position:fixed;top:0;bottom:0;left:0;right:0}.mp-container.svelte-1o4jdf5{-webkit-backdrop-filter:blur(24px)saturate(180%);--mp-vox-rgb:230, 185, 0;--mp-ins-rgb:255, 236, 170;--mp-deep-rgb:255, 122, 0;--mp-ink-rgb:8, 8, 10;--mp-accent-rgb:var(--mp-vox-rgb);--glow-color:rgba(var(--mp-accent-rgb), .85);--glow-light:rgba(var(--mp-accent-rgb), .6);--badge-bg:rgba(var(--mp-accent-rgb), .13);--badge-border:rgba(var(--mp-accent-rgb), .28);--badge-text:rgba(var(--mp-accent-rgb), .9);--badge-bg-hover:rgba(var(--mp-accent-rgb), .22);--badge-border-hover:rgba(var(--mp-accent-rgb), .45);--active-row-bg:rgba(var(--mp-accent-rgb), .07);--active-btn-text:rgba(var(--mp-accent-rgb), .9);--active-title:rgba(var(--mp-accent-rgb), .95);--play-gradient-start:rgba(var(--mp-accent-rgb), .95);--play-gradient-end:rgba(var(--mp-deep-rgb), .95);--play-glow:rgba(var(--mp-accent-rgb), .4);--play-ink:rgb(var(--mp-ink-rgb));--progress-gradient-start:rgba(var(--mp-accent-rgb), .9);--progress-gradient-end:rgba(var(--mp-deep-rgb), .8);background:rgba(7,7,11,.94);border:1px solid rgba(255,255,255,.07);border-radius:22px;flex-direction:column;width:94vw;max-width:1080px;height:90vh;max-height:820px;-webkit-animation:.38s cubic-bezier(.16,1,.3,1) forwards svelte-1o4jdf5-mpIn;animation:.38s cubic-bezier(.16,1,.3,1) forwards svelte-1o4jdf5-mpIn;display:flex;overflow:hidden;box-shadow:0 40px 100px rgba(0,0,0,.9),inset 0 1px rgba(255,255,255,.06)}.mp-container.theme-inst.svelte-1o4jdf5{--mp-accent-rgb:var(--mp-ins-rgb)}.mp-container.closing.svelte-1o4jdf5{-webkit-animation:.3s cubic-bezier(.4,0,1,1) forwards svelte-1o4jdf5-mpOut;animation:.3s cubic-bezier(.4,0,1,1) forwards svelte-1o4jdf5-mpOut}@-webkit-keyframes svelte-1o4jdf5-mpIn{0%{opacity:0;transform:translateY(28px)scale(.97)}to{opacity:1;transform:none}}@keyframes svelte-1o4jdf5-mpIn{0%{opacity:0;transform:translateY(28px)scale(.97)}to{opacity:1;transform:none}}@-webkit-keyframes svelte-1o4jdf5-mpOut{0%{opacity:1;transform:none}to{opacity:0;transform:translateY(18px)scale(.97)}}@keyframes svelte-1o4jdf5-mpOut{0%{opacity:1;transform:none}to{opacity:0;transform:translateY(18px)scale(.97)}}.mp-body.svelte-1o4jdf5{flex:1;grid-template-rows:1fr;grid-template-columns:1fr;display:grid;overflow:hidden}.mp-body.svelte-1o4jdf5>:where(.svelte-1o4jdf5){grid-area:1/1;width:100%;min-width:0;height:100%;min-height:0}.songs-layout.svelte-1o4jdf5{height:100%;display:flex;overflow:hidden}.player-side.svelte-1o4jdf5{background:rgba(0,0,0,.12);border-right:1px solid rgba(255,255,255,.05);flex-direction:column;flex-shrink:0;align-items:center;gap:13px;width:320px;min-width:260px;padding:22px 18px 16px;display:flex;overflow-x:hidden;overflow-y:auto}.player-top-block.svelte-1o4jdf5{flex-direction:column;align-items:center;width:100%;min-width:0;display:flex}.vinyl-wrapper.svelte-1o4jdf5{flex-shrink:0;width:210px;height:210px;position:relative}.vinyl-record.svelte-1o4jdf5{background:repeating-radial-gradient(circle,rgba(255,255,255,.07) 0,rgba(255,255,255,.07) .6px,transparent .6px,transparent 2.4px),radial-gradient(circle,transparent 44%,#060607 44.4%,#060607 45.4%,transparent 45.8%,transparent 59%,#060607 59.4%,#060607 60.4%,transparent 60.8%,transparent 77%,#060607 77.4%,#060607 78.2%,transparent 78.6%),radial-gradient(circle,#060607 0%,#060607 24%,#19191c 25%,#19191c 95.5%,#060607 96.5%,#060607 100%);border-radius:50%;justify-content:center;align-items:center;width:210px;height:210px;-webkit-animation:2.6s linear infinite paused svelte-1o4jdf5-vspin;animation:2.6s linear infinite paused svelte-1o4jdf5-vspin;display:flex;position:relative;box-shadow:0 0 0 1px rgba(255,255,255,.06),0 10px 44px rgba(0,0,0,.9),inset 0 0 0 2px rgba(0,0,0,.6),inset 0 0 26px rgba(0,0,0,.55)}.vinyl-record.spinning.svelte-1o4jdf5{box-shadow:0 0 0 1px rgba(255,255,255,.06), 0 10px 44px rgba(0,0,0,.9), 0 0 46px -14px var(--glow-light,transparent), inset 0 0 0 2px rgba(0,0,0,.6), inset 0 0 26px rgba(0,0,0,.55);-webkit-animation-play-state:running;animation-play-state:running}.vinyl-record-clicker.svelte-1o4jdf5{position:relative}.vinyl-record-clicker.svelte-1o4jdf5:after{content:"";pointer-events:none;z-index:4;background:conic-gradient(from 28deg,transparent 0deg,rgba(255,255,255,.24) 16deg,transparent 40deg,transparent 180deg,rgba(255,255,255,.12) 198deg,transparent 222deg,transparent 360deg);border-radius:50%;position:absolute;top:0;bottom:0;left:0;right:0;-webkit-mask-image:radial-gradient(circle,transparent 24%,#000 25.5%,#000 96%,transparent 97%);mask-image:radial-gradient(circle,transparent 24%,#000 25.5%,#000 96%,transparent 97%)}@-webkit-keyframes svelte-1o4jdf5-vspin{to{transform:rotate(360deg)}}@keyframes svelte-1o4jdf5-vspin{to{transform:rotate(360deg)}}.vinyl-wrapper.deck-glitch.svelte-1o4jdf5>:where(.svelte-1o4jdf5){-webkit-animation:3.4s step-end infinite svelte-1o4jdf5-deck-glitch-jolt;animation:3.4s step-end infinite svelte-1o4jdf5-deck-glitch-jolt}.vinyl-wrapper.deck-glitch.svelte-1o4jdf5 .vinyl-record:where(.svelte-1o4jdf5){-webkit-animation:.42s steps(2,end) infinite svelte-1o4jdf5-deck-stuck;animation:.42s steps(2,end) infinite svelte-1o4jdf5-deck-stuck}.vinyl-wrapper.deck-glitch.svelte-1o4jdf5:after{content:"";z-index:20;pointer-events:none;mix-blend-mode:screen;background:linear-gradient(transparent 0,transparent 46%,rgba(255,40,80,.28) 46%,rgba(255,40,80,.28) 49%,transparent 49%),repeating-linear-gradient(0deg,rgba(0,0,0,.28) 0,rgba(0,0,0,.28) 1px,transparent 1px,transparent 3px);-webkit-animation:3.4s step-end infinite svelte-1o4jdf5-deck-glitch-tear;animation:3.4s step-end infinite svelte-1o4jdf5-deck-glitch-tear;position:absolute;top:0;bottom:0;left:0;right:0}@-webkit-keyframes svelte-1o4jdf5-deck-stuck{0%{transform:rotate(-3deg)}50%{transform:rotate(4deg)}}@keyframes svelte-1o4jdf5-deck-stuck{0%{transform:rotate(-3deg)}50%{transform:rotate(4deg)}}@-webkit-keyframes svelte-1o4jdf5-deck-glitch-jolt{0%{-webkit-filter:drop-shadow(5px 0 rgba(255,0,70,.75))drop-shadow(-5px 0 rgba(0,240,255,.75));filter:drop-shadow(5px 0 rgba(255,0,70,.75))drop-shadow(-5px 0 rgba(0,240,255,.75));transform:translate(-5px,1px)skew(-6deg)}3%{-webkit-filter:drop-shadow(-7px 0 rgba(255,0,70,.75))drop-shadow(7px 0 rgba(0,240,255,.75))saturate(2.2);filter:drop-shadow(-7px 0 rgba(255,0,70,.75))drop-shadow(7px 0 rgba(0,240,255,.75))saturate(2.2);transform:translate(6px,-2px)skew(9deg)}6%{-webkit-filter:drop-shadow(3px 0 rgba(255,0,70,.7))drop-shadow(-3px 0 rgba(0,240,255,.7))hue-rotate(80deg);filter:drop-shadow(3px 0 rgba(255,0,70,.7))drop-shadow(-3px 0 rgba(0,240,255,.7))hue-rotate(80deg);transform:translate(-3px,3px)scaleY(.94)}9%{-webkit-filter:drop-shadow(-4px 0 rgba(255,0,70,.75))drop-shadow(4px 0 rgba(0,240,255,.75))contrast(1.6);filter:drop-shadow(-4px 0 rgba(255,0,70,.75))drop-shadow(4px 0 rgba(0,240,255,.75))contrast(1.6);transform:translate(4px)skew(-12deg)}12%{-webkit-filter:drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6));filter:drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6));transform:translate(-2px,-1px)}15%{-webkit-filter:grayscale(.55)brightness(.8);filter:grayscale(.55)brightness(.8);transform:none}62%{-webkit-filter:drop-shadow(-4px 0 rgba(255,0,70,.7))drop-shadow(4px 0 rgba(0,240,255,.7));filter:drop-shadow(-4px 0 rgba(255,0,70,.7))drop-shadow(4px 0 rgba(0,240,255,.7));transform:translate(3px)skew(5deg)}65%{-webkit-filter:drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6))grayscale(.4);filter:drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6))grayscale(.4);transform:translate(-2px,1px)}68%,to{-webkit-filter:grayscale(.55)brightness(.8);filter:grayscale(.55)brightness(.8);transform:none}}@keyframes svelte-1o4jdf5-deck-glitch-jolt{0%{-webkit-filter:drop-shadow(5px 0 rgba(255,0,70,.75))drop-shadow(-5px 0 rgba(0,240,255,.75));filter:drop-shadow(5px 0 rgba(255,0,70,.75))drop-shadow(-5px 0 rgba(0,240,255,.75));transform:translate(-5px,1px)skew(-6deg)}3%{-webkit-filter:drop-shadow(-7px 0 rgba(255,0,70,.75))drop-shadow(7px 0 rgba(0,240,255,.75))saturate(2.2);filter:drop-shadow(-7px 0 rgba(255,0,70,.75))drop-shadow(7px 0 rgba(0,240,255,.75))saturate(2.2);transform:translate(6px,-2px)skew(9deg)}6%{-webkit-filter:drop-shadow(3px 0 rgba(255,0,70,.7))drop-shadow(-3px 0 rgba(0,240,255,.7))hue-rotate(80deg);filter:drop-shadow(3px 0 rgba(255,0,70,.7))drop-shadow(-3px 0 rgba(0,240,255,.7))hue-rotate(80deg);transform:translate(-3px,3px)scaleY(.94)}9%{-webkit-filter:drop-shadow(-4px 0 rgba(255,0,70,.75))drop-shadow(4px 0 rgba(0,240,255,.75))contrast(1.6);filter:drop-shadow(-4px 0 rgba(255,0,70,.75))drop-shadow(4px 0 rgba(0,240,255,.75))contrast(1.6);transform:translate(4px)skew(-12deg)}12%{-webkit-filter:drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6));filter:drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6));transform:translate(-2px,-1px)}15%{-webkit-filter:grayscale(.55)brightness(.8);filter:grayscale(.55)brightness(.8);transform:none}62%{-webkit-filter:drop-shadow(-4px 0 rgba(255,0,70,.7))drop-shadow(4px 0 rgba(0,240,255,.7));filter:drop-shadow(-4px 0 rgba(255,0,70,.7))drop-shadow(4px 0 rgba(0,240,255,.7));transform:translate(3px)skew(5deg)}65%{-webkit-filter:drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6))grayscale(.4);filter:drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6))grayscale(.4);transform:translate(-2px,1px)}68%,to{-webkit-filter:grayscale(.55)brightness(.8);filter:grayscale(.55)brightness(.8);transform:none}}@-webkit-keyframes svelte-1o4jdf5-deck-glitch-tear{0%{opacity:1;transform:translateY(-38%)}3%{transform:translateY(24%)}6%{transform:translateY(-12%)}9%{transform:translateY(36%)}12%{transform:translateY(4%)}15%{opacity:.25;transform:translateY(0)}62%{opacity:1;transform:translateY(-20%)}65%{transform:translateY(30%)}68%,to{opacity:.25;transform:translateY(0)}}@keyframes svelte-1o4jdf5-deck-glitch-tear{0%{opacity:1;transform:translateY(-38%)}3%{transform:translateY(24%)}6%{transform:translateY(-12%)}9%{transform:translateY(36%)}12%{transform:translateY(4%)}15%{opacity:.25;transform:translateY(0)}62%{opacity:1;transform:translateY(-20%)}65%{transform:translateY(30%)}68%,to{opacity:.25;transform:translateY(0)}}@media (prefers-reduced-motion:reduce){.vinyl-wrapper.deck-glitch.svelte-1o4jdf5:after{-webkit-animation:none;animation:none}.vinyl-wrapper.deck-glitch.svelte-1o4jdf5>:where(.svelte-1o4jdf5){-webkit-animation:none;animation:none}.vinyl-wrapper.deck-glitch.svelte-1o4jdf5 .vinyl-record:where(.svelte-1o4jdf5){-webkit-animation:none;animation:none}.vinyl-wrapper.deck-glitch.svelte-1o4jdf5>:where(.svelte-1o4jdf5){-webkit-filter:grayscale(.55)brightness(.8)drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6));filter:grayscale(.55)brightness(.8)drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6))}}.groove.svelte-1o4jdf5{pointer-events:none;border:1px solid rgba(255,255,255,.03);border-radius:50%;position:absolute}.g1.svelte-1o4jdf5{width:72%;height:72%}.g2.svelte-1o4jdf5{width:56%;height:56%}.g3.svelte-1o4jdf5{border-color:rgba(255,255,255,.024);width:40%;height:40%}.g4.svelte-1o4jdf5{border-color:rgba(255,255,255,.02);width:86%;height:86%}.record-label.svelte-1o4jdf5{z-index:2;width:88px;height:88px;box-shadow:0 0 0 1px rgba(0,0,0,.8), 0 0 0 3px var(--badge-border,transparent), 0 2px 14px rgba(0,0,0,.65);background:#111;border:2px solid rgba(255,255,255,.1);border-radius:50%;position:relative;overflow:hidden}.record-art.svelte-1o4jdf5{object-fit:cover;opacity:0;width:100%;height:100%;transition:opacity .4s}.record-art.loaded.svelte-1o4jdf5{opacity:1}.spindle.svelte-1o4jdf5{z-index:3;background:radial-gradient(circle at 35% 30%,#fff 0%,#999 35%,#333 100%);border-radius:50%;width:7px;height:7px;position:absolute;box-shadow:0 0 0 1.5px rgba(0,0,0,.85),0 1px 4px rgba(0,0,0,.8)}.tonearm.svelte-1o4jdf5{transform-origin:top;z-index:5;background:linear-gradient(#888 0%,#555 60%,#333 100%);border-radius:2px;width:4px;height:96px;transition:transform .9s cubic-bezier(.4,0,.2,1);position:absolute;top:6px;right:-6px;transform:rotate(-15deg);box-shadow:0 2px 8px rgba(0,0,0,.5)}.tonearm.svelte-1o4jdf5:after{content:"";background:var(--glow-color,rgba(230,185,0,.85));width:8px;height:8px;box-shadow:0 0 8px var(--glow-light,rgba(230,185,0,.6));border-radius:50%;position:absolute;bottom:-4px;left:-2px}.tonearm.playing.svelte-1o4jdf5{transform:rotate(22deg)}.track-info.svelte-1o4jdf5{text-align:center;width:100%;min-width:0;overflow:hidden}.scroll-container.svelte-1o4jdf5{white-space:nowrap;text-align:center;width:100%;overflow:hidden}.scroll-container.overflowing.svelte-1o4jdf5{text-align:left}.scroll-text.svelte-1o4jdf5{white-space:nowrap;display:inline-block}.scroll-text.animate-scroll.svelte-1o4jdf5{-webkit-animation:8s linear infinite alternate svelte-1o4jdf5-scroll-text;animation:8s linear infinite alternate svelte-1o4jdf5-scroll-text}@-webkit-keyframes svelte-1o4jdf5-scroll-text{0%,15%{transform:translate(0)}85%,to{transform:translateX(var(--scroll-dist))}}@keyframes svelte-1o4jdf5-scroll-text{0%,15%{transform:translate(0)}85%,to{transform:translateX(var(--scroll-dist))}}.track-title.svelte-1o4jdf5{letter-spacing:.06em;color:rgba(255,255,255,.94);margin:0 0 4px;font-family:Outfit,Inter,sans-serif;font-size:1.2rem;font-weight:800}.track-artist.svelte-1o4jdf5{color:rgba(255,255,255,.55);margin:0 0 2px;font-family:Inter,sans-serif;font-size:.82rem}.track-album.svelte-1o4jdf5{color:rgba(255,255,255,.28);text-transform:uppercase;letter-spacing:.06em;margin:0;font-family:Outfit,monospace;font-size:.68rem}.tr-share-btn.svelte-1o4jdf5,.tr-download-btn.svelte-1o4jdf5{color:rgba(255,255,255,.45);cursor:pointer;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:6px;flex-shrink:0;justify-content:center;align-items:center;width:24px;height:24px;transition:all .2s;display:flex}.tr-share-btn.svelte-1o4jdf5:hover,.tr-download-btn.svelte-1o4jdf5:hover{color:rgba(255,255,255,.9);background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.16)}.player-share-btn.svelte-1o4jdf5,.player-download-btn.svelte-1o4jdf5{background:var(--badge-bg,rgba(230,185,0,.13));border:1px solid var(--badge-border,rgba(230,185,0,.28));width:22px;height:22px;color:var(--badge-text,rgba(230,185,0,.9));cursor:pointer;border-radius:50%;flex-shrink:0;justify-content:center;align-items:center;transition:all .2s;display:flex}.player-share-btn.svelte-1o4jdf5:hover,.player-download-btn.svelte-1o4jdf5:hover{background:var(--badge-bg-hover,rgba(230,185,0,.22));color:rgb(var(--mp-accent-rgb,230, 185, 0));border-color:var(--badge-border-hover,rgba(230,185,0,.45))}.player-tether.svelte-1o4jdf5{flex-shrink:0;display:flex;position:relative}.player-tether-btn.svelte-1o4jdf5{background:var(--bg-input,rgba(255,255,255,.04));border:1px solid var(--color-neon-green,#00d75f);width:22px;height:22px;color:var(--color-neon-green,#00d75f);cursor:pointer;border-radius:50%;flex-shrink:0;justify-content:center;align-items:center;display:flex}.player-tether-lost.svelte-1o4jdf5{border-color:var(--color-neon-gold,#e6b900);color:var(--color-neon-gold,#e6b900);-webkit-animation:1.6s ease-in-out infinite svelte-1o4jdf5-player-tether-wait;animation:1.6s ease-in-out infinite svelte-1o4jdf5-player-tether-wait}@-webkit-keyframes svelte-1o4jdf5-player-tether-wait{50%{opacity:.35}}@keyframes svelte-1o4jdf5-player-tether-wait{50%{opacity:.35}}.player-tether-hint.svelte-1o4jdf5{background:var(--bg-app,#050508);border:1px solid var(--color-neon-green,#00d75f);color:#fff;text-align:left;z-index:20;pointer-events:none;border-radius:8px;width:240px;max-width:70vw;padding:8px 10px;font-size:.7rem;line-height:1.4;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translate(-50%)}.tr-download-btn.downloading.svelte-1o4jdf5,.player-download-btn.downloading.svelte-1o4jdf5{pointer-events:none;-webkit-animation:1s ease-in-out infinite svelte-1o4jdf5-download-pulse;animation:1s ease-in-out infinite svelte-1o4jdf5-download-pulse}@-webkit-keyframes svelte-1o4jdf5-download-pulse{50%{opacity:.35}}@keyframes svelte-1o4jdf5-download-pulse{50%{opacity:.35}}.progress-row.svelte-1o4jdf5{align-items:center;gap:8px;width:100%;display:flex}.ptime.svelte-1o4jdf5{color:rgba(255,255,255,.3);text-align:center;min-width:28px;font-family:monospace;font-size:.65rem}.progress-wrap.svelte-1o4jdf5{cursor:pointer;background:rgba(255,255,255,.1);border-radius:3px;flex:1;height:3px;position:relative}.seek-input.svelte-1o4jdf5{opacity:0;cursor:pointer;width:100%;height:24px;margin:0;position:absolute;top:-10px;bottom:-10px;left:0;right:0}.controls-row.svelte-1o4jdf5{justify-content:center;align-items:center;gap:10px;width:100%;margin-top:10px;margin-bottom:6px;display:flex}.ctrl.svelte-1o4jdf5{color:rgba(255,255,255,.5);cursor:pointer;background:0 0;border:none;border-radius:50%;justify-content:center;align-items:center;padding:0;transition:all .15s;display:flex}.ctrl.svelte-1o4jdf5:hover{color:rgba(255,255,255,.9);transform:scale(1.1)}.ctrl.svelte-1o4jdf5:active{transform:scale(.95)}.ctrl-xs.svelte-1o4jdf5{width:26px;height:26px}.ctrl-sm.svelte-1o4jdf5{width:30px;height:30px}.ctrl-md.svelte-1o4jdf5{color:rgba(255,255,255,.72);width:38px;height:38px}.ctrl-md.svelte-1o4jdf5:hover{color:#fff}.ctrl-play.svelte-1o4jdf5{color:var(--play-ink,#fff);width:54px;height:54px;background:linear-gradient(135deg, var(--play-gradient-start,rgba(230,185,0,.92)) 0%, var(--play-gradient-end,rgba(255,122,0,.92)) 100%);box-shadow:0 4px 22px var(--play-glow,rgba(230,185,0,.5));border-radius:50%;transition:all .2s}.ctrl-play.ctrl-error.svelte-1o4jdf5{color:#050508;background:linear-gradient(135deg,#f59e0b 0%,#d97706 100%);box-shadow:0 4px 22px rgba(245,158,11,.5)}.ctrl-play.ctrl-error.svelte-1o4jdf5:hover{transform:scale(1.07);box-shadow:0 6px 30px rgba(245,158,11,.7)}.ctrl-play.svelte-1o4jdf5:active{transform:scale(.97)}.active-ctrl.svelte-1o4jdf5{color:var(--active-btn-text,rgba(230,185,0,.9))!important}.spin-ring.svelte-1o4jdf5{border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;width:18px;height:18px;-webkit-animation:.7s linear infinite svelte-1o4jdf5-sr;animation:.7s linear infinite svelte-1o4jdf5-sr}@-webkit-keyframes svelte-1o4jdf5-sr{to{transform:rotate(360deg)}}@keyframes svelte-1o4jdf5-sr{to{transform:rotate(360deg)}}.tracklist-side.svelte-1o4jdf5{flex-direction:column;flex:1;min-width:0;display:flex;overflow:hidden}.tl-header.svelte-1o4jdf5{letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.28);border-bottom:1px solid rgba(255,255,255,.05);flex-shrink:0;align-items:center;gap:7px;padding:14px 22px 10px;font-family:Outfit,monospace;font-size:.68rem;font-weight:700;display:flex}.tl-count.svelte-1o4jdf5{background:rgba(255,255,255,.07);border-radius:10px;margin-left:auto;padding:2px 8px;font-size:.62rem}.tracklist.svelte-1o4jdf5{flex:1;padding:6px 0;overflow-y:auto}.track-row.svelte-1o4jdf5{cursor:pointer;align-items:center;gap:12px;padding:10px 22px;transition:background .14s;display:flex;position:relative}.track-row.svelte-1o4jdf5:hover,.track-row.kb-focused.svelte-1o4jdf5{background:rgba(255,255,255,.04)}.track-row.kb-focused.svelte-1o4jdf5{outline-offset:-3px;outline:1px dashed rgba(255,255,255,.25)}.track-row.fetch-error.svelte-1o4jdf5{background:rgba(245,158,11,.03);border-left:3px solid rgba(245,158,11,.4)}.track-row.fetch-error.svelte-1o4jdf5:hover,.track-row.fetch-error.kb-focused.svelte-1o4jdf5{background:rgba(245,158,11,.06)}.track-row.fetch-error.svelte-1o4jdf5 .tr-title:where(.svelte-1o4jdf5){color:#f59e0b!important}.track-row.active.fetch-error.svelte-1o4jdf5{background:rgba(245,158,11,.1)!important}.track-row.active.fetch-error.svelte-1o4jdf5:before{background:#f59e0b!important}.track-row.active.svelte-1o4jdf5{background:var(--active-row-bg,rgba(230,185,0,.07))}.track-row.active.svelte-1o4jdf5:before{content:"";background:linear-gradient(to bottom, var(--glow-color,rgba(230,185,0,.9)), var(--progress-gradient-end,rgba(255,122,0,.7)));border-radius:0 2px 2px 0;width:3px;position:absolute;top:0;bottom:0;left:0}.tr-num.svelte-1o4jdf5{text-align:center;color:rgba(255,255,255,.28);flex-shrink:0;width:18px;font-family:monospace;font-size:.72rem}.tr-art.svelte-1o4jdf5{object-fit:cover;background:rgba(255,255,255,.05);border-radius:6px;flex-shrink:0;width:42px;height:42px}.tr-info.svelte-1o4jdf5{flex-direction:column;flex:1;gap:2px;min-width:0;display:flex}.tr-title.svelte-1o4jdf5{color:rgba(255,255,255,.86);white-space:nowrap;text-overflow:ellipsis;font-family:Outfit,Inter,sans-serif;font-size:.86rem;font-weight:600;overflow:hidden}.track-row.active.svelte-1o4jdf5 .tr-title:where(.svelte-1o4jdf5){color:var(--active-title,rgba(230,185,0,.95))}.tr-meta.svelte-1o4jdf5{color:rgba(255,255,255,.33);white-space:nowrap;text-overflow:ellipsis;font-family:Inter,sans-serif;font-size:.7rem;overflow:hidden}.inst-chip-link.svelte-1o4jdf5{letter-spacing:.1em;color:#22c55e;cursor:pointer;flex-shrink:0;padding:2px;font-size:.56rem;font-weight:700;text-decoration:underline;transition:color .2s}.inst-chip-link.svelte-1o4jdf5:hover{color:#16a34a}.eq.svelte-1o4jdf5{align-items:flex-end;gap:2px;height:15px;display:flex}.eq-b.svelte-1o4jdf5{background:var(--glow-color,rgba(230,185,0,.85));border-radius:1px;width:3px;-webkit-animation:.55s infinite alternate svelte-1o4jdf5-eq;animation:.55s infinite alternate svelte-1o4jdf5-eq}.eq-b.svelte-1o4jdf5:first-child{height:60%;-webkit-animation-delay:0s;animation-delay:0s}.eq-b.svelte-1o4jdf5:nth-child(2){height:100%;-webkit-animation-delay:.15s;animation-delay:.15s}.eq-b.svelte-1o4jdf5:nth-child(3){height:45%;-webkit-animation-delay:.3s;animation-delay:.3s}@-webkit-keyframes svelte-1o4jdf5-eq{0%{transform:scaleY(.35)}to{transform:scaleY(1)}}@keyframes svelte-1o4jdf5-eq{0%{transform:scaleY(.35)}to{transform:scaleY(1)}}.mp-footer.svelte-1o4jdf5{color:rgba(255,255,255,.22);letter-spacing:.06em;background:rgba(0,0,0,.22);border-top:1px solid rgba(255,255,255,.05);flex-shrink:0;justify-content:space-between;align-items:center;height:36px;padding:0 22px;font-family:monospace;font-size:.62rem;display:flex}.mp-status.svelte-1o4jdf5{align-items:center;gap:7px;display:flex}.mp-dot.svelte-1o4jdf5{background:#0f6;border-radius:50%;width:5px;height:5px;box-shadow:0 0 5px rgba(0,255,102,.55)}.scroll-y.svelte-1o4jdf5{overflow-x:hidden;overflow-y:auto}.scroll-y.svelte-1o4jdf5::-webkit-scrollbar{width:4px}.scroll-y.svelte-1o4jdf5::-webkit-scrollbar-track{background:0 0}.scroll-y.svelte-1o4jdf5::-webkit-scrollbar-thumb{background:rgba(255,255,255,.07);border-radius:2px}.scroll-y.svelte-1o4jdf5::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,.16)}@media (min-width:641px) and (max-height:780px){.mp-container.svelte-1o4jdf5{height:96vh}}@media (min-width:641px) and (max-height:760px){.player-side.svelte-1o4jdf5{gap:10px;padding:14px 16px 12px}.vinyl-wrapper.svelte-1o4jdf5,.vinyl-record.svelte-1o4jdf5{width:max(90px,min(96vh - 450px,210px));height:max(90px,min(96vh - 450px,210px))}.record-label.svelte-1o4jdf5{width:42%;height:42%}.tonearm.svelte-1o4jdf5{height:45%}.track-title.svelte-1o4jdf5{font-size:1.05rem}.track-artist.svelte-1o4jdf5,.track-album.svelte-1o4jdf5{font-size:.74rem}.progress-row.svelte-1o4jdf5 .progress-wrap:where(.svelte-1o4jdf5){height:28px}.ctrl-play.svelte-1o4jdf5{width:46px;height:46px}.player-controls-block.svelte-1o4jdf5>div:where(.svelte-1o4jdf5){margin-top:4px}}@media (min-width:641px) and (max-height:560px){.mp-footer.svelte-1o4jdf5{display:none}.player-side.svelte-1o4jdf5{gap:8px;padding:10px 14px 8px}.player-top-block.svelte-1o4jdf5{flex-direction:row;justify-content:center;align-items:center;gap:14px;width:100%}.vinyl-wrapper.svelte-1o4jdf5,.vinyl-record.svelte-1o4jdf5{width:96px;height:96px}.player-top-block.svelte-1o4jdf5 .track-info:where(.svelte-1o4jdf5){flex:1;min-width:0;margin-top:0}.progress-row.svelte-1o4jdf5 .progress-wrap:where(.svelte-1o4jdf5){height:28px}.controls-row.svelte-1o4jdf5{gap:8px;margin-bottom:0}.ctrl-play.svelte-1o4jdf5{width:42px;height:42px}.ctrl-md.svelte-1o4jdf5{width:32px;height:32px}.player-controls-block.svelte-1o4jdf5>div:where(.svelte-1o4jdf5){margin-top:4px}}@media (max-width:640px){.mp-container.svelte-1o4jdf5{border-radius:0;width:100vw;height:100%;max-height:100%}.songs-layout.svelte-1o4jdf5{flex-direction:column;position:relative;overflow:hidden}.player-side.svelte-1o4jdf5{width:100%;min-width:unset;border-bottom:none;border-right:none;flex-direction:column;flex-shrink:0;justify-content:space-between;gap:8px;height:95%;max-height:none;padding:12px 14px;display:flex;overflow:hidden}.player-top-block.svelte-1o4jdf5{flex-direction:column;justify-content:center;align-items:center;height:62%;transition:transform .3s cubic-bezier(.16,1,.3,1),opacity .3s;display:flex}.player-controls-block.svelte-1o4jdf5{flex-direction:column;flex-shrink:0;justify-content:flex-end;gap:8px;height:38%;display:flex}.vinyl-wrapper.svelte-1o4jdf5,.vinyl-record.svelte-1o4jdf5{width:130px;height:130px}.record-label.svelte-1o4jdf5{width:52px;height:52px}.tonearm.svelte-1o4jdf5{height:70px}.tracklist-side.svelte-1o4jdf5{z-index:20;opacity:0;pointer-events:none;background:rgba(7,7,11,.98);border-bottom:1px solid rgba(255,255,255,.08);transition:transform .3s cubic-bezier(.16,1,.3,1),opacity .3s;position:absolute;top:0;left:0;right:0;transform:translateY(-100%);box-shadow:0 10px 30px rgba(0,0,0,.5);width:100%!important;height:62%!important;display:flex!important}.tracklist-side.show-mobile.svelte-1o4jdf5{opacity:1;pointer-events:auto;transform:translateY(0)}.mobile-close-bar.svelte-1o4jdf5{display:flex!important}.track-title.svelte-1o4jdf5{font-size:1rem}.track-artist.svelte-1o4jdf5,.track-album.svelte-1o4jdf5{font-size:.72rem}.track-info.svelte-1o4jdf5 .scroll-container:where(.svelte-1o4jdf5){cursor:pointer}.ctrl-play.svelte-1o4jdf5{width:46px;height:46px}}@media (max-width:640px) and (max-height:700px){.controls-row.svelte-1o4jdf5{margin-top:0;margin-bottom:0}.player-top-block.svelte-1o4jdf5{flex:1;height:auto;min-height:0}.player-controls-block.svelte-1o4jdf5{height:auto}.vinyl-wrapper.svelte-1o4jdf5,.vinyl-record.svelte-1o4jdf5{width:104px;height:104px}.record-label.svelte-1o4jdf5{width:42px;height:42px}}.panel-header.svelte-1o4jdf5{background:rgba(0,0,0,.2);border-bottom:1px solid rgba(255,255,255,.06);justify-content:space-between;align-items:center;height:64px;padding:0 24px;display:flex}.brand.svelte-1o4jdf5{align-items:center;gap:12px;display:flex}.brand.svelte-1o4jdf5 h1:where(.svelte-1o4jdf5){letter-spacing:.05em;text-transform:uppercase;color:rgba(255,255,255,.95);margin:0;font-family:Outfit,Inter,sans-serif;font-size:1.1rem;font-weight:700}.close-btn.svelte-1o4jdf5{color:rgba(255,255,255,.5);cursor:pointer;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.06);border-radius:50%;justify-content:center;align-items:center;width:32px;height:32px;transition:all .2s;display:flex}.close-btn.svelte-1o4jdf5:hover{color:#fff;background:rgba(255,255,255,.15);transform:translate(-4px)}.dj-crossfader.svelte-1o4jdf5{cursor:pointer;box-sizing:border-box;-webkit-user-select:none;user-select:none;background:linear-gradient(#1e1e24 0%,#121215 100%);border:1px solid rgba(255,255,255,.08);border-radius:8px;justify-content:space-between;align-items:center;gap:12px;width:100%;height:34px;padding:0 16px;display:flex;position:relative;box-shadow:inset 0 1px rgba(255,255,255,.05),0 8px 24px rgba(0,0,0,.5)}.fader-label.svelte-1o4jdf5{letter-spacing:.05em;color:rgba(255,255,255,.2);font-family:monospace;font-size:.65rem;font-weight:800;transition:color .2s}.fader-label.left-label.active.svelte-1o4jdf5{color:rgb(var(--mp-vox-rgb));text-shadow:0 0 8px rgba(var(--mp-vox-rgb), .4)}.fader-label.right-label.active.svelte-1o4jdf5{color:rgb(var(--mp-ins-rgb));text-shadow:0 0 8px rgba(var(--mp-ins-rgb), .4)}.dj-fader-slot.svelte-1o4jdf5{background:#000;border:1px solid rgba(255,255,255,.06);border-radius:2px;flex:1;height:4px;position:relative}.dj-fader-knob.svelte-1o4jdf5{background:linear-gradient(135deg,#666 0%,#333 50%,#222 100%);border:1px solid rgba(255,255,255,.25);border-radius:3px;justify-content:center;align-items:center;width:24px;height:18px;transition:left .18s cubic-bezier(.25,.8,.25,1);display:flex;position:absolute;top:50%;left:0%;transform:translateY(-50%);box-shadow:0 4px 10px rgba(0,0,0,.8),inset 0 1px rgba(255,255,255,.15)}.dj-fader-knob.svelte-1o4jdf5:after{content:"";background:#fff;width:2px;height:100%;box-shadow:0 0 3px rgba(255,255,255,.8)}.dj-fader-knob.right.svelte-1o4jdf5{left:calc(100% - 24px)}.volume-popover.svelte-1o4jdf5{z-index:50;pointer-events:auto;-webkit-backdrop-filter:blur(8px);background:rgba(15,15,20,.95);border:1px solid rgba(255,255,255,.1);border-radius:20px;align-items:center;gap:8px;min-width:150px;padding:6px 12px;display:flex;position:absolute;bottom:38px;left:50%;transform:translate(-50%);box-shadow:0 10px 25px rgba(0,0,0,.6)}.vol-slider-pop.svelte-1o4jdf5{height:3px;accent-color:rgb(var(--mp-accent-rgb));cursor:pointer;background:rgba(255,255,255,.1);border-radius:2px;outline:none;flex:1}.visualizer-container.svelte-1o4jdf5{background:#050508;border:1px solid rgba(255,255,255,.08);border-radius:50%;flex-direction:column;width:100%;height:100%;transition:border-radius .3s cubic-bezier(.25,.8,.25,1);display:flex;position:relative;overflow:hidden}.visualizer-canvas.svelte-1o4jdf5{z-index:1;width:100%;height:100%;display:block;position:absolute;top:0;bottom:0;left:0;right:0}.visualizer-overlay.svelte-1o4jdf5{z-index:10;justify-content:center;align-items:center;gap:8px;display:flex;position:absolute;bottom:16px;left:16px;right:16px}.visualizer-container.fullscreen.svelte-1o4jdf5{z-index:2000;border:none;width:100vw;height:100vh;position:fixed;top:0;bottom:0;left:0;right:0;border-radius:0!important}.visualizer-overlay.svelte-1o4jdf5{transition:opacity .45s}.visualizer-container.stage-idle.svelte-1o4jdf5{cursor:none}.visualizer-container.stage-idle.svelte-1o4jdf5 .visualizer-overlay:where(.svelte-1o4jdf5){opacity:0;pointer-events:none}.stage-frame.svelte-1o4jdf5{position:absolute;top:0;bottom:0;left:0;right:0;overflow:hidden;container-type:size}.stage-cover.svelte-1o4jdf5{object-fit:cover;-webkit-filter:blur(28px)brightness(.5);filter:blur(28px)brightness(.5);width:100%;height:100%;position:absolute;top:0;bottom:0;left:0;right:0;transform:scale(1.15)}.viz-label.svelte-1o4jdf5{z-index:2;border:2px solid rgba(255,255,255,.14);border-radius:50%;width:24%;height:24%;margin:-12% 0 0 -12%;-webkit-animation:5s linear infinite paused svelte-1o4jdf5-viz-label-spin;animation:5s linear infinite paused svelte-1o4jdf5-viz-label-spin;position:absolute;top:50%;left:50%;overflow:hidden;box-shadow:0 0 0 1px rgba(0,0,0,.8),0 2px 14px rgba(0,0,0,.65)}.viz-label.spinning.svelte-1o4jdf5{-webkit-animation-play-state:running;animation-play-state:running}.viz-art.svelte-1o4jdf5{object-fit:cover;width:100%;height:100%;display:block}.viz-spindle.svelte-1o4jdf5{z-index:3;background:rgba(5,5,8,.92);border-radius:50%;width:7px;height:7px;margin:-3.5px 0 0 -3.5px;position:absolute;top:50%;left:50%;box-shadow:0 0 0 1px rgba(255,255,255,.28)}@-webkit-keyframes svelte-1o4jdf5-viz-label-spin{to{transform:rotate(360deg)}}@keyframes svelte-1o4jdf5-viz-label-spin{to{transform:rotate(360deg)}}.tl-tab.svelte-1o4jdf5{font:inherit;letter-spacing:inherit;text-transform:inherit;color:rgba(255,255,255,.28);cursor:pointer;border-radius:6px;align-items:center;gap:6px;padding:4px 8px;transition:color .15s,background .15s;display:flex}.tl-tab.svelte-1o4jdf5:hover{color:rgba(255,255,255,.6)}.tl-tab-on.svelte-1o4jdf5,.tl-tab-on.svelte-1o4jdf5:hover{color:rgba(255,255,255,.85);background:rgba(255,255,255,.06)}.tl-tab.svelte-1o4jdf5 .tl-count:where(.svelte-1o4jdf5){margin-left:0}.tl-header.svelte-1o4jdf5 .tl-sort-cycler{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}.tl-header.svelte-1o4jdf5 .tl-sort-cycler:active{transform:translate(-50%,-50%)scale(.88)}@media (prefers-reduced-motion:reduce){.viz-label.svelte-1o4jdf5{-webkit-animation:none;animation:none}}@-webkit-keyframes svelte-1o4jdf5-knob-wiggle{0%,to{transform:translateY(-50%)scale(1)}20%,60%{transform:translate(-3.5px,-50%)rotate(-4deg)}40%,80%{transform:translate(3.5px,-50%)rotate(4deg)}}@keyframes svelte-1o4jdf5-knob-wiggle{0%,to{transform:translateY(-50%)scale(1)}20%,60%{transform:translate(-3.5px,-50%)rotate(-4deg)}40%,80%{transform:translate(3.5px,-50%)rotate(4deg)}}.knob-jiggle.svelte-1o4jdf5{-webkit-animation:.3s ease-in-out svelte-1o4jdf5-knob-wiggle;animation:.3s ease-in-out svelte-1o4jdf5-knob-wiggle}.dj-fader-knob.fried.svelte-1o4jdf5{background:linear-gradient(135deg,#2c2222 0%,#1a1212 50%,#0f0505 100%)!important;border-color:rgba(239,68,68,.35)!important;box-shadow:0 4px 10px rgba(0,0,0,.9),0 0 8px rgba(239,68,68,.25)!important}.dj-fader-knob.fried.svelte-1o4jdf5:after{-webkit-animation:.15s infinite alternate svelte-1o4jdf5-fader-flicker;animation:.15s infinite alternate svelte-1o4jdf5-fader-flicker;background:#ef4444!important;box-shadow:0 0 5px #ef4444!important}@-webkit-keyframes svelte-1o4jdf5-fader-flicker{0%{opacity:.35}to{opacity:1}}@keyframes svelte-1o4jdf5-fader-flicker{0%{opacity:.35}to{opacity:1}}.dj-crossfader.fader-flash.svelte-1o4jdf5{-webkit-animation:.15s ease-out svelte-1o4jdf5-fader-flash-anim;animation:.15s ease-out svelte-1o4jdf5-fader-flash-anim}@-webkit-keyframes svelte-1o4jdf5-fader-flash-anim{0%{background:#f05;border-color:#fff;box-shadow:0 0 25px rgba(255,0,85,.8)}to{background:linear-gradient(#1e1e24 0%,#121215 100%);border-color:rgba(255,255,255,.08)}}@keyframes svelte-1o4jdf5-fader-flash-anim{0%{background:#f05;border-color:#fff;box-shadow:0 0 25px rgba(255,0,85,.8)}to{background:linear-gradient(#1e1e24 0%,#121215 100%);border-color:rgba(255,255,255,.08)}}.dj-crossfader.fader-fried.svelte-1o4jdf5{border-color:rgba(239,68,68,.25)!important;box-shadow:inset 0 0 8px rgba(239,68,68,.08),0 8px 24px rgba(0,0,0,.5)!important}.fader-fx-canvas.svelte-1o4jdf5{width:100vw;height:100vh;pointer-events:none;z-index:99999;height:100dvh;position:fixed;top:0;left:0}.cassette-tape.svelte-1o4jdf5{box-sizing:border-box;background:linear-gradient(135deg,#1f1f23 0%,#0d0d0f 100%);border:3px solid #2d2d34;border-radius:10px;flex-direction:column;justify-content:space-between;align-items:center;width:200px;height:125px;padding:10px;display:flex;position:relative;box-shadow:0 8px 24px rgba(0,0,0,.6)}@media (min-width:640px){.cassette-tape.svelte-1o4jdf5{border-width:4px;width:240px;height:150px;padding:12px}}.cassette-label.svelte-1o4jdf5{color:#fff;box-sizing:border-box;text-transform:uppercase;border-radius:4px;flex-direction:column;justify-content:center;align-items:center;width:100%;height:38px;padding:2px;font-family:monospace;font-weight:700;display:flex;box-shadow:inset 0 1px rgba(255,255,255,.1)}@media (min-width:640px){.cassette-label.svelte-1o4jdf5{height:46px}}.cassette-track-title.svelte-1o4jdf5{letter-spacing:.05em;white-space:nowrap;text-overflow:ellipsis;max-width:90%;font-size:9px;overflow:hidden}@media (min-width:640px){.cassette-track-title.svelte-1o4jdf5{font-size:11px}}.cassette-brand.svelte-1o4jdf5{opacity:.8;letter-spacing:.1em;margin-top:1px;font-size:7px}@media (min-width:640px){.cassette-brand.svelte-1o4jdf5{margin-top:2px;font-size:8px}}.cassette-window.svelte-1o4jdf5{border:2px solid #3f3f46;border-radius:5px;justify-content:space-around;align-items:center;width:110px;height:40px;margin-top:6px;display:flex;position:relative;overflow:hidden}@media (min-width:640px){.cassette-window.svelte-1o4jdf5{width:130px;height:48px;margin-top:8px}}.spindle-left.svelte-1o4jdf5,.spindle-right.svelte-1o4jdf5{box-sizing:border-box;z-index:5;border:3px dashed #71717a;border-radius:50%;width:18px;height:18px}@media (min-width:640px){.spindle-left.svelte-1o4jdf5,.spindle-right.svelte-1o4jdf5{border-width:4px;width:22px;height:22px}}.spindle-left.spinning.svelte-1o4jdf5,.spindle-right.spinning.svelte-1o4jdf5{-webkit-animation:4s linear infinite svelte-1o4jdf5-rotate-spindle;animation:4s linear infinite svelte-1o4jdf5-rotate-spindle}.tape-roll-left.svelte-1o4jdf5,.tape-roll-right.svelte-1o4jdf5{z-index:1;opacity:.85;border-radius:50%;position:absolute;top:50%;transform:translateY(-50%)}.tape-roll-left.spinning.svelte-1o4jdf5,.tape-roll-right.spinning.svelte-1o4jdf5{-webkit-animation:6s linear infinite svelte-1o4jdf5-rotate-spindle;animation:6s linear infinite svelte-1o4jdf5-rotate-spindle}.tape-roll-left.svelte-1o4jdf5{left:12px;transform:translateY(-50%)}@media (min-width:640px){.tape-roll-left.svelte-1o4jdf5{left:16px}}.tape-roll-right.svelte-1o4jdf5{right:12px;transform:translateY(-50%)}@media (min-width:640px){.tape-roll-right.svelte-1o4jdf5{right:16px}}@-webkit-keyframes svelte-1o4jdf5-rotate-spindle{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes svelte-1o4jdf5-rotate-spindle{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.waveform-slider-wrap.svelte-1o4jdf5{background:rgba(0,0,0,.45);border:1px solid rgba(255,255,255,.1);border-radius:6px;height:36px;transition:border-color .2s,background .2s}.waveform-slider-wrap.svelte-1o4jdf5 .seek-input:where(.svelte-1o4jdf5){margin:0;height:100%!important;top:0!important;bottom:0!important;left:0!important;right:0!important}.waveform-slider-wrap.svelte-1o4jdf5:hover{background:rgba(0,0,0,.55);border-color:rgba(255,255,255,.2)}.waveform-slider-wrap.svelte-1o4jdf5:hover .waveform-bar:where(.svelte-1o4jdf5):not(.active){background-color:rgba(255,255,255,.22)}.waveform-slider-wrap.svelte-1o4jdf5:hover .waveform-bar.active:where(.svelte-1o4jdf5){box-shadow:0 0 8px rgba(0,240,255,.6)}.waveform-bar.svelte-1o4jdf5{background-color:rgba(255,255,255,.12);border-radius:9999px;transition:background-color .2s,background .2s,box-shadow .2s}.waveform-bar.active.svelte-1o4jdf5{background:linear-gradient(#ff007f 0%,#00f0ff 100%);box-shadow:0 0 4px rgba(0,240,255,.4)}.floppy-disk.svelte-1o4jdf5{box-sizing:border-box;-webkit-clip-path:polygon(0 0,88% 0,100% 12%,100% 100%,0 100%);clip-path:polygon(0 0,88% 0,100% 12%,100% 100%,0 100%);background:linear-gradient(135deg,#1e293b 0%,#0f172a 100%);border:3px solid #334155;border-radius:8px;flex-direction:column;justify-content:space-between;width:160px;height:160px;padding:8px;display:flex;position:relative;box-shadow:0 8px 24px rgba(0,0,0,.65)}@media (min-width:640px){.floppy-disk.svelte-1o4jdf5{border-width:4px;width:190px;height:190px;padding:10px}}.floppy-corner.svelte-1o4jdf5{z-index:10;background:0 0;width:20px;height:20px;position:absolute;top:0;right:0}.floppy-write-protect.svelte-1o4jdf5{background:#020617;border:1px solid #334155;border-radius:1px;width:10px;height:10px;position:absolute;bottom:8px;left:8px}@media (min-width:640px){.floppy-write-protect.svelte-1o4jdf5{width:12px;height:12px;bottom:10px;left:10px}}.floppy-label.svelte-1o4jdf5{border-radius:4px;flex-direction:column;width:100%;height:65px;display:flex;position:relative;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,.3)}@media (min-width:640px){.floppy-label.svelte-1o4jdf5{height:80px}}.floppy-label-stripe.svelte-1o4jdf5{width:100%;height:6px}.floppy-label-stripe-blue.svelte-1o4jdf5{width:100%;height:3px}.floppy-label-content.svelte-1o4jdf5{background:#f8fafc;flex-direction:column;flex-grow:1;justify-content:center;align-items:center;padding:4px;display:flex}.floppy-song.svelte-1o4jdf5{color:#0f172a;text-align:center;text-transform:uppercase;width:90%;font-size:8px;font-weight:800}@media (min-width:640px){.floppy-song.svelte-1o4jdf5{font-size:10px}}.floppy-artist.svelte-1o4jdf5{color:#475569;text-align:center;text-transform:uppercase;width:90%;margin-top:1px;font-size:7px}@media (min-width:640px){.floppy-artist.svelte-1o4jdf5{margin-top:2px;font-size:8px}}.floppy-shutter-door.svelte-1o4jdf5{border:1px solid #1e293b;border-radius:3px;width:60px;height:40px;position:absolute;bottom:8px;left:50%;overflow:hidden;transform:translate(-50%)}@media (min-width:640px){.floppy-shutter-door.svelte-1o4jdf5{width:72px;height:48px;bottom:10px}}.floppy-shutter-slider.svelte-1o4jdf5{z-index:3;background:linear-gradient(90deg,#64748b 0%,#cbd5e1 50%,#64748b 100%);width:100%;height:100%;transition:transform .4s cubic-bezier(.16,1,.3,1);position:absolute;top:0;left:0}.floppy-shutter-slider.open.svelte-1o4jdf5{transform:translate(32px)}@media (min-width:640px){.floppy-shutter-slider.open.svelte-1o4jdf5{transform:translate(38px)}}.floppy-shutter-opening.svelte-1o4jdf5{z-index:1;border-radius:2px;justify-content:center;align-items:center;width:24px;height:32px;display:flex;position:absolute;top:4px;left:8px;overflow:hidden}@media (min-width:640px){.floppy-shutter-opening.svelte-1o4jdf5{width:28px;height:38px;top:5px;left:10px}}.floppy-magnetic-disc.svelte-1o4jdf5{border:2px dashed #475569;border-radius:50%;width:20px;height:20px}.floppy-magnetic-disc.spinning.svelte-1o4jdf5{-webkit-animation:2s linear infinite svelte-1o4jdf5-floppy-spin;animation:2s linear infinite svelte-1o4jdf5-floppy-spin}@media (min-width:640px){.floppy-magnetic-disc.svelte-1o4jdf5{width:24px;height:24px}}.floppy-drive-led.svelte-1o4jdf5{background:#dc2626;border-radius:50%;width:6px;height:6px;position:absolute;bottom:8px;right:8px;box-shadow:0 0 3px #dc2626}.floppy-drive-led.active.svelte-1o4jdf5{-webkit-animation:.4s ease-in-out infinite alternate svelte-1o4jdf5-floppy-led-blink;animation:.4s ease-in-out infinite alternate svelte-1o4jdf5-floppy-led-blink}@media (min-width:640px){.floppy-drive-led.svelte-1o4jdf5{width:7px;height:7px;bottom:10px;right:10px}}.music-box.svelte-1o4jdf5{box-sizing:border-box;background:linear-gradient(135deg,#78350f 0%,#451a03 100%);border:3px solid #d97706;border-radius:10px;justify-content:center;align-items:center;width:160px;height:110px;padding:6px;display:flex;position:relative;box-shadow:0 8px 24px rgba(0,0,0,.7)}@media (min-width:640px){.music-box.svelte-1o4jdf5{border-width:4px;width:190px;height:130px;padding:8px}}.music-box-key.svelte-1o4jdf5{z-index:-1;transform-origin:100%;align-items:center;width:15px;height:26px;display:flex;position:absolute;top:calc(50% - 13px);left:-18px}.music-box-key.svelte-1o4jdf5:before{content:"";border:2px .5 solid #f59e0b;background:0 0;border-radius:50%;width:12px;height:12px;position:absolute;left:-6px;box-shadow:0 0 4px rgba(245,158,11,.4)}.music-box-key.svelte-1o4jdf5:after{content:"";background:#b45309;width:12px;height:3px;position:absolute;right:0}.music-box-key.spinning.svelte-1o4jdf5{-webkit-animation:3s linear infinite svelte-1o4jdf5-key-spin;animation:3s linear infinite svelte-1o4jdf5-key-spin}@media (min-width:640px){.music-box-key.svelte-1o4jdf5{width:18px;height:30px;top:calc(50% - 15px);left:-22px}.music-box-key.svelte-1o4jdf5:before{border-width:3px;width:14px;height:14px;left:-8px}.music-box-key.svelte-1o4jdf5:after{width:14px;height:4px}}.music-box-interior.svelte-1o4jdf5{box-sizing:border-box;background:rgba(0,0,0,.55);border-radius:6px;flex-direction:column;justify-content:space-between;width:100%;height:100%;padding:6px;display:flex;position:relative;overflow:hidden}.music-box-gears.svelte-1o4jdf5{width:40px;height:40px;position:absolute;top:6px;left:6px}.music-box-gear.svelte-1o4jdf5{background:0 0;border:2px dashed #d97706;border-radius:50%;position:absolute}.music-box-gear.gear-1.svelte-1o4jdf5{width:22px;height:22px;top:2px;left:2px}.music-box-gear.gear-1.spinning.svelte-1o4jdf5{-webkit-animation:5s linear infinite svelte-1o4jdf5-gear-rotate;animation:5s linear infinite svelte-1o4jdf5-gear-rotate}.music-box-gear.gear-2.svelte-1o4jdf5{width:14px;height:14px;top:16px;left:18px}.music-box-gear.gear-2.spinning.svelte-1o4jdf5{-webkit-animation:4.2s linear infinite svelte-1o4jdf5-gear-rotate-reverse;animation:4.2s linear infinite svelte-1o4jdf5-gear-rotate-reverse}@media (min-width:640px){.music-box-gear.gear-1.svelte-1o4jdf5{width:26px;height:26px}.music-box-gear.gear-2.svelte-1o4jdf5{width:18px;height:18px;top:18px;left:22px}}.music-box-drum-wrap.svelte-1o4jdf5{align-items:center;width:70px;height:32px;display:flex;position:absolute;top:50%;right:14px;transform:translateY(-50%)}@media (min-width:640px){.music-box-drum-wrap.svelte-1o4jdf5{width:90px;height:38px;right:18px}}.music-box-drum.svelte-1o4jdf5{background:linear-gradient(#d97706 0%,#b45309 50%,#78350f 100%);border:1px solid #d97706;border-radius:6px;width:100%;height:12px;position:relative;overflow:hidden}.music-box-drum.svelte-1o4jdf5:after{content:"";background:repeating-linear-gradient(90deg,transparent,transparent 12px,#fef08a 14px,#f59e0b 15px,transparent 17px);width:200%;height:100%;position:absolute;top:0;left:-100%}@media (min-width:640px){.music-box-drum.svelte-1o4jdf5:after{background:repeating-linear-gradient(90deg,transparent,transparent 15px,#fef08a 17px,#f59e0b 18px,transparent 20px)}}.music-box-drum.spinning.svelte-1o4jdf5:after{-webkit-animation:2.2s linear infinite svelte-1o4jdf5-drum-roll;animation:2.2s linear infinite svelte-1o4jdf5-drum-roll}@media (min-width:640px){.music-box-drum.svelte-1o4jdf5{border-radius:8px;height:16px}}.music-box-comb.svelte-1o4jdf5{gap:2.5px;display:flex;position:absolute;bottom:6px;right:18px}@media (min-width:640px){.music-box-comb.svelte-1o4jdf5{gap:3.5px;bottom:8px;right:22px}}.comb-tooth.svelte-1o4jdf5{transform-origin:top;background:linear-gradient(#cbd5e1 0%,#475569 100%);border-radius:.5px;width:3px;height:18px}.comb-tooth.vibrating.svelte-1o4jdf5{-webkit-animation:.12s ease-in-out infinite alternate svelte-1o4jdf5-tooth-vibrate;animation:.12s ease-in-out infinite alternate svelte-1o4jdf5-tooth-vibrate}@media (min-width:640px){.comb-tooth.svelte-1o4jdf5{border-radius:1px;width:4px;height:24px}}@-webkit-keyframes svelte-1o4jdf5-floppy-spin{to{transform:rotate(360deg)}}@keyframes svelte-1o4jdf5-floppy-spin{to{transform:rotate(360deg)}}@-webkit-keyframes svelte-1o4jdf5-floppy-led-blink{0%{background:#22c55e;box-shadow:0 0 5px #22c55e}to{background:#166534;box-shadow:0 0 1px #166534}}@keyframes svelte-1o4jdf5-floppy-led-blink{0%{background:#22c55e;box-shadow:0 0 5px #22c55e}to{background:#166534;box-shadow:0 0 1px #166534}}@-webkit-keyframes svelte-1o4jdf5-key-spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes svelte-1o4jdf5-key-spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@-webkit-keyframes svelte-1o4jdf5-gear-rotate{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes svelte-1o4jdf5-gear-rotate{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@-webkit-keyframes svelte-1o4jdf5-gear-rotate-reverse{0%{transform:rotate(360deg)}to{transform:rotate(0)}}@keyframes svelte-1o4jdf5-gear-rotate-reverse{0%{transform:rotate(360deg)}to{transform:rotate(0)}}@-webkit-keyframes svelte-1o4jdf5-drum-roll{0%{transform:translate(0)}to{transform:translate(50%)}}@keyframes svelte-1o4jdf5-drum-roll{0%{transform:translate(0)}to{transform:translate(50%)}}@-webkit-keyframes svelte-1o4jdf5-tooth-vibrate{0%{transform:scaleY(1)}to{transform:scaleY(.85)skew(2deg)}}@keyframes svelte-1o4jdf5-tooth-vibrate{0%{transform:scaleY(1)}to{transform:scaleY(.85)skew(2deg)}}.arigato-modal-backdrop.svelte-1o4jdf5{z-index:2000;-webkit-backdrop-filter:blur(8px);background:rgba(0,0,0,.75);justify-content:center;align-items:center;width:100vw;height:100vh;display:flex;position:fixed;top:0;left:0}.arigato-modal-content.svelte-1o4jdf5{color:#e4e4e7;background:linear-gradient(135deg,#121214 0%,#0a0a0c 100%);border:1px solid rgba(239,68,68,.2);border-radius:16px;flex-direction:column;width:90vw;max-width:600px;height:80vh;font-family:monospace;display:flex;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,.8),inset 0 1px rgba(255,255,255,.05)}@media (max-width:640px){.arigato-modal-content.svelte-1o4jdf5{width:95vw;height:85vh}}.arigato-modal-header.svelte-1o4jdf5{background:rgba(255,255,255,.02);border-bottom:1px solid rgba(255,255,255,.08);justify-content:space-between;align-items:center;padding:16px 24px;display:flex}.arigato-modal-header.svelte-1o4jdf5 h2:where(.svelte-1o4jdf5){letter-spacing:.1em;color:#ef4444;text-transform:uppercase;margin:0;font-size:1rem;font-weight:700}.arigato-close-btn.svelte-1o4jdf5{color:rgba(255,255,255,.6);cursor:pointer;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:50%;justify-content:center;align-items:center;width:32px;height:32px;transition:all .2s;display:flex}.arigato-close-btn.svelte-1o4jdf5:hover{color:#fff;background:rgba(239,68,68,.2);border-color:rgba(239,68,68,.4);transform:translate(-2px)}.arigato-modal-body.svelte-1o4jdf5{color:#a1a1aa;flex:1;padding:24px;font-size:.85rem;line-height:1.5;overflow-y:auto}.arigato-modal-body.svelte-1o4jdf5 .intro-text:where(.svelte-1o4jdf5){white-space:pre-wrap;margin-bottom:16px}.arigato-modal-body.svelte-1o4jdf5 .outro-text:where(.svelte-1o4jdf5){white-space:pre-wrap;margin-bottom:16px}.arigato-modal-body.svelte-1o4jdf5 .intro-text:where(.svelte-1o4jdf5) a{color:#ef4444;text-decoration:underline}.arigato-modal-body.svelte-1o4jdf5 .outro-text:where(.svelte-1o4jdf5) a{color:#ef4444;text-decoration:underline}.arigato-modal-body.svelte-1o4jdf5 .intro-text:where(.svelte-1o4jdf5) a:hover{color:#fff}.arigato-modal-body.svelte-1o4jdf5 .outro-text:where(.svelte-1o4jdf5) a:hover{color:#fff}.arigato-modal-body.svelte-1o4jdf5 .tos-box:where(.svelte-1o4jdf5){background:rgba(0,0,0,.4);border:1px dashed rgba(255,255,255,.1);border-radius:8px;max-height:300px;margin:16px 0;padding:12px;overflow-y:auto}.arigato-modal-body.svelte-1o4jdf5 .tos-microtext:where(.svelte-1o4jdf5){letter-spacing:0;color:#71717a;word-break:break-all;white-space:pre-wrap;text-transform:none;font-family:monospace;font-size:5px;line-height:1.2}.arigato-modal-body.svelte-1o4jdf5 .tos-microtext:where(.svelte-1o4jdf5) a{color:#ef4444;text-decoration:underline}.arigato-modal-body.svelte-1o4jdf5 .tos-microtext:where(.svelte-1o4jdf5) a:hover{color:#fff}.merch-link-container.svelte-1o4jdf5{justify-content:center;margin-bottom:20px;display:flex}.merch-link-btn.svelte-1o4jdf5{color:#fff;text-transform:uppercase;letter-spacing:.08em;background:linear-gradient(135deg,#ef4444 0%,#b91c1c 100%);border-radius:9999px;align-items:center;gap:8px;padding:8px 18px;font-size:.7rem;font-weight:850;text-decoration:none;transition:all .2s;display:inline-flex;box-shadow:0 4px 12px rgba(239,68,68,.3)}.merch-link-btn.svelte-1o4jdf5:hover{color:#fff;background:linear-gradient(135deg,#ff6b6b 0%,#ef4444 100%);transform:translateY(-2px);box-shadow:0 6px 16px rgba(239,68,68,.4)}.merch-link-btn.svelte-1o4jdf5:active{transform:translateY(0)}
/*$vite$:1*/`,document.head.appendChild(vt),yt=`DOGS`,bt=`Download instrumental`,xt=`Download vocal mix`,St=`Download track`,Ct=function(){function e(t,n){s(this,e),F(this,`canvas`,null),F(this,`gl`,null),F(this,`analyser`,null),F(this,`program`,null),F(this,`animationFrameId`,null),F(this,`startTime`,0),F(this,`vertexBuffer`,null),F(this,`audioTexture`,null),F(this,`uniforms`,{}),F(this,`frequencyBuffer`,null),this.canvas=t,this.analyser=n,this.frequencyBuffer=new Uint8Array(n?n.frequencyBinCount:128),this.gl=t.getContext(`webgl`)||t.getContext(`experimental-webgl`),this.gl||console.error(`WebGL not supported by this browser.`)}return l(e,[{key:`init`,value:function(e){if(this.gl){var t=this.gl;this.cleanupProgram();var n=this.compileShader(t.VERTEX_SHADER,`
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `),r=this.compileShader(t.FRAGMENT_SHADER,e);if(n&&r){if(this.program=t.createProgram(),t.attachShader(this.program,n),t.attachShader(this.program,r),t.linkProgram(this.program),!t.getProgramParameter(this.program,t.LINK_STATUS))console.error(`Shader program linking failed:`,t.getProgramInfoLog(this.program));else{t.useProgram(this.program);var i=new Float32Array([-1,-1,1,-1,-1,1,1,1]);this.vertexBuffer=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,this.vertexBuffer),t.bufferData(t.ARRAY_BUFFER,i,t.STATIC_DRAW);var a=t.getAttribLocation(this.program,`a_position`);t.enableVertexAttribArray(a),t.vertexAttribPointer(a,2,t.FLOAT,!1,0,0),this.audioTexture=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.audioTexture),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),this.uniforms={time:t.getUniformLocation(this.program,`u_time`),resolution:t.getUniformLocation(this.program,`u_resolution`),volume:t.getUniformLocation(this.program,`u_volume`),bass:t.getUniformLocation(this.program,`u_bass`),mid:t.getUniformLocation(this.program,`u_mid`),treble:t.getUniformLocation(this.program,`u_treble`),audioTexture:t.getUniformLocation(this.program,`u_audioTexture`)},this.startTime=performance.now(),this.resize()}}}}},{key:`setPreset`,value:function(e){this.init(e)}},{key:`compileShader`,value:function(e,t){if(!this.gl)return null;var n=this.gl,r=n.createShader(e);return n.shaderSource(r,t),n.compileShader(r),n.getShaderParameter(r,n.COMPILE_STATUS)?r:(console.error(`Shader compilation error (${e===n.VERTEX_SHADER?`VERTEX`:`FRAGMENT`}):`,n.getShaderInfoLog(r)),n.deleteShader(r),null)}},{key:`start`,value:function(){var e=this;this.stop();var t=function(e){function t(){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}(function(){e.renderFrame(),e.animationFrameId=requestAnimationFrame(t)});this.animationFrameId=requestAnimationFrame(t)}},{key:`stop`,value:function(){this.animationFrameId&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null)}},{key:`resize`,value:function(){if(this.gl&&this.canvas){var e=this.gl,t=this.canvas.clientWidth,n=this.canvas.clientHeight;(this.canvas.width!==t||this.canvas.height!==n)&&(this.canvas.width=t,this.canvas.height=n,e.viewport(0,0,t,n))}}},{key:`renderFrame`,value:function(){if(this.gl&&this.program){var e=this.gl;this.resize(),e.useProgram(this.program),e.bindBuffer(e.ARRAY_BUFFER,this.vertexBuffer);var t=(performance.now()-this.startTime)/1e3,n=0,r=0,i=0,a=0;if(this.analyser){this.analyser.getByteFrequencyData(this.frequencyBuffer);for(var o=this.frequencyBuffer.length,s=0,c=0,l=0,u=0;u<o;u++){var d=this.frequencyBuffer[u];n+=d,u<12?(r+=d,s++):u<64?(i+=d,c++):(a+=d,l++)}n=n/o/255,r=s>0?r/s/255:0,i=c>0?i/c/255:0,a=l>0?a/l/255:0,e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.audioTexture),e.texImage2D(e.TEXTURE_2D,0,e.LUMINANCE,o,1,0,e.LUMINANCE,e.UNSIGNED_BYTE,this.frequencyBuffer)}e.uniform1f(this.uniforms.time,t),e.uniform2f(this.uniforms.resolution,this.canvas.width,this.canvas.height),e.uniform1f(this.uniforms.volume,n),e.uniform1f(this.uniforms.bass,r),e.uniform1f(this.uniforms.mid,i),e.uniform1f(this.uniforms.treble,a),e.uniform1i(this.uniforms.audioTexture,0),e.drawArrays(e.TRIANGLE_STRIP,0,4)}}},{key:`cleanupProgram`,value:function(){this.gl&&this.program&&(this.gl.deleteProgram(this.program),this.program=null)}},{key:`destroy`,value:function(){this.stop();var e=this.gl;e&&(this.cleanupProgram(),this.vertexBuffer&&(e.deleteBuffer(this.vertexBuffer),this.vertexBuffer=null),this.audioTexture&&(e.deleteTexture(this.audioTexture),this.audioTexture=null)),this.canvas=null,this.gl=null,this.analyser=null}}])}(),wt=[{id:`kaleidosync`,name:`Kaleidosync`,fragmentShader:`
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
    `}],Tt={id:`no-signal`,name:`No Signal`,fragmentShader:`
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
  `},K=2.7,Et=3e4,Dt=2,Ot=50,kt=`webgl2`,At=[function(){return he(function(){return n.import(`./butterchurnPresets.min-legacy-D-WJc89f.js`).then(function(e){return r(e.default,1)})},void 0)},function(){return he(function(){return n.import(`./butterchurnPresetsExtra.min-legacy-DFzk7CsG.js`).then(function(e){return r(e.default,1)})},void 0)},function(){return he(function(){return n.import(`./butterchurnPresetsExtra2.min-legacy-PGzIAHXH.js`).then(function(e){return r(e.default,1)})},void 0)},function(){return he(function(){return n.import(`./butterchurnPresetsMD1.min-legacy-DyPP2txR.js`).then(function(e){return r(e.default,1)})},void 0)}],jt=3,Mt=function(){function e(t,n,r){var i=arguments.length>3&&arguments[3]!==void 0?arguments[3]:{};s(this,e),F(this,`canvas`,null),F(this,`analyser`,null),F(this,`audioCtx`,null),F(this,`visualizer`,null),F(this,`animationFrameId`,null),F(this,`autoTimer`,null),F(this,`destroyed`,!1),F(this,`presets`,{}),F(this,`names`,[]),F(this,`current`,``),F(this,`history`,[]),F(this,`auto`,!0),F(this,`shuffle`,!0),F(this,`pool`,null),F(this,`resume`,``),F(this,`canAdvance`,null),F(this,`width`,0),F(this,`height`,0),this.canvas=t,this.analyser=n,this.audioCtx=r,this.onPreset=i.onPreset||function(){},this.onNames=i.onNames||function(){}}return l(e,[{key:`start`,value:function(){var e=g(u().m(function e(){var i,a,o,s,c;return u().w(function(e){for(;;)switch(e.p=e.n){case 0:return e.p=0,e.n=1,Promise.all([he(function(){return n.import(`./butterchurn.min-legacy-D5bem6x3.js`).then(function(e){return r(e.default,1)})},void 0),At[0]()]);case 1:if(i=e.v,a=t(i,2),o=a[0],s=a[1],!this.destroyed){e.n=2;break}return e.a(2);case 2:this.resize(),this.visualizer=Bn(o,`createVisualizer`).createVisualizer(this.audioCtx,this.canvas,{width:this.width,height:this.height,pixelRatio:1}),this.visualizer.connectAudio(this.analyser),this.addPack(s),this.resumePreset()||this.random(0),this.draw(),this.loadRemainingPacks(),e.n=4;break;case 3:e.p=3,c=e.v,console.warn(`MilkDrop could not start:`,c);case 4:return e.a(2)}},e,this,[[0,3]])}));function i(){return e.apply(this,arguments)}return i}()},{key:`loadRemainingPacks`,value:function(){var e=g(u().m(function e(){var t,n,r,i,a;return u().w(function(e){for(;;)switch(e.p=e.n){case 0:t=f(At.slice(1)),e.p=1,t.s();case 2:if((n=t.n()).done){e.n=8;break}return r=n.value,e.p=3,e.n=4,r();case 4:if(i=e.v,!this.destroyed){e.n=5;break}return e.a(2);case 5:this.addPack(i),this.resumePreset(),e.n=7;break;case 6:e.p=6,e.v;case 7:e.n=2;break;case 8:e.n=10;break;case 9:e.p=9,a=e.v,t.e(a);case 10:return e.p=10,t.f(),e.f(10);case 11:return e.a(2)}},e,this,[[3,6],[1,9,10,11]])}));function t(){return e.apply(this,arguments)}return t}()},{key:`addPack`,value:function(e){for(var t=Bn(e,`getPresets`).getPresets(),n=0,r=Object.keys(t);n<r.length;n++){var i=r[n];this.presets[i]=t[i]}this.names=Object.keys(this.presets).sort(function(e,t){return e.localeCompare(t)}),this.onNames(this.names)}},{key:`resumePreset`,value:function(){var e=this.resume;return!e||!this.presets[e]?!1:(this.resume=``,this.loadPreset(e,0,!1),!0)}},{key:`resize`,value:function(){var e=Math.min(window.devicePixelRatio||1,Dt),t=Math.max(1,Math.round(this.canvas.clientWidth*e)),n=Math.max(1,Math.round(this.canvas.clientHeight*e));(t!==this.width||n!==this.height)&&(this.width=t,this.height=n,this.canvas.width=t,this.canvas.height=n,this.visualizer&&this.visualizer.setRendererSize(t,n))}},{key:`draw`,value:function(){var e=this;this.destroyed||(this.resize(),this.visualizer.render(),this.animationFrameId=requestAnimationFrame(function(){return e.draw()}))}},{key:`loadPreset`,value:function(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:K,n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:!0,r=this.presets[e];r&&this.visualizer&&(n&&this.current&&(this.history.push(this.current),this.history.length>Ot&&this.history.shift()),this.current=e,this.visualizer.loadPreset(r,t),this.onPreset(e),this.restartAuto())}},{key:`setPool`,value:function(e){this.pool=e&&e.length?e:null}},{key:`list`,value:function(){var e=this;if(!this.pool)return this.names;var t=this.pool.filter(function(t){return e.presets[t]});return t.length?t:this.names}},{key:`random`,value:function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:K,t=this.list();if(t.length){for(var n=this.current;n===this.current&&t.length>1;)n=t[Math.floor(Math.random()*t.length)];this.loadPreset(t.indexOf(n)===-1?t[0]:n,e)}}},{key:`next`,value:function(){var e=this.list();e.length&&this.loadPreset(e[(e.indexOf(this.current)+1)%e.length])}},{key:`advance`,value:function(){this.shuffle?this.random():this.next()}},{key:`previous`,value:function(){var e=this.list();if(e.length){var t=this.history.pop();if(t)this.loadPreset(t,K,!1);else{var n=Math.max(0,e.indexOf(this.current));this.loadPreset(e[(n-1+e.length)%e.length],K,!1)}}}},{key:`setAuto`,value:function(e){this.auto=!!e,this.restartAuto()}},{key:`restartAuto`,value:function(){var e=this;clearTimeout(this.autoTimer),this.auto&&!this.destroyed&&(this.autoTimer=setTimeout(function(){e.canAdvance&&!e.canAdvance()?e.restartAuto():e.advance()},Et))}},{key:`destroy`,value:function(){if(this.destroyed=!0,clearTimeout(this.autoTimer),this.animationFrameId&&cancelAnimationFrame(this.animationFrameId),this.visualizer)try{this.visualizer.disconnectAudio(this.analyser)}catch(e){}this.visualizer=null,this.presets={}}}])}(),q=A(`<li class="flex items-center svelte-80frst"><button type="button"> </button> <button type="button"><!></button></li>`),J=A(`<li class="px-3 py-3 font-mono text-[11px] text-white/40 md:px-4 2xl:px-5 2xl:text-[15px] svelte-80frst"> </li>`),Nt=A(`<li class="px-3 py-2 font-mono text-[10px] text-white/30 md:px-4 2xl:px-5 2xl:text-[13px] svelte-80frst"> </li>`),Pt=A(`<div class="preset-list flex min-h-0 flex-1 flex-col svelte-80frst"><div class="flex items-center gap-2 border-b border-white/10 px-3 py-2 sm:py-1.5 md:px-4 2xl:px-5 2xl:py-3 svelte-80frst"><!> <input type="search" aria-label="Search MilkDrop presets" autocomplete="off" spellcheck="false" class="w-full min-w-0 bg-transparent font-mono text-[12px] text-white outline-none placeholder:text-white/30 2xl:text-[15px] svelte-80frst"/> <div class="flex shrink-0 items-center gap-1 rounded-md border border-white/10 p-0.5 svelte-80frst" role="group" aria-label="Which presets to list"><button type="button">All</button> <button type="button"><!> </button></div></div> <ul class="preset-rows min-h-0 flex-1 overflow-y-auto py-1 svelte-80frst"><!> <!></ul></div>`),ye([`click`]),Ft=A(`<div class="flex max-h-[40vh] flex-col overflow-hidden rounded-lg border border-white/10 bg-black/75 backdrop-blur-md sm:max-h-[50vh] 2xl:max-h-[60vh] svelte-6h1e9g"><!></div>`),It=xe(`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="10" x2="14" y1="2" y2="2" class="svelte-6h1e9g"></line><circle cx="12" cy="14" r="8" class="svelte-6h1e9g"></circle><line class="deck-timer-hand svelte-6h1e9g" x1="12" y1="14" x2="12" y2="8.5"></line></svg>`),Lt=A(`<div class="milkdrop-deck flex w-full flex-col gap-2 sm:max-w-md md:max-w-lg xl:max-w-xl 2xl:max-w-3xl 2xl:gap-3 svelte-6h1e9g"><!> <div class="flex items-center gap-1 rounded-lg border border-white/10 bg-black/60 p-1 backdrop-blur-md svelte-6h1e9g"><button type="button" class="deck-btn svelte-6h1e9g" aria-label="Previous preset" title="Previous preset"><!></button> <button type="button" class="deck-btn svelte-6h1e9g" aria-label="Next preset" title="Next preset"><!></button> <button type="button" class="min-w-0 flex-1 truncate px-2 text-left font-mono text-[10px] uppercase tracking-wider text-white/80 hover:text-white md:text-[11px] 2xl:text-[14px] svelte-6h1e9g"> </button> <button type="button"><!></button> <button type="button" aria-label="Play only my hearted presets"><!></button> <button type="button" aria-label="Shuffle presets"><!></button> <button type="button"><!></button></div></div>`),ye([`click`]),Rt=A(`<span class="lyric-word svelte-4gkonh"> </span>`),zt=A(`<span class="lyric-row svelte-4gkonh"></span>`),Bt=A(`<div aria-hidden="true"><!></div>`),Vt=A(`<button type="button"><!> <span class="strike svelte-btbnk2" aria-hidden="true"></span></button>`),ye([`click`]),Ht=[{id:`default`,name:`Default order`,icon:An},{id:`artist`,name:`Artist`,icon:jn},{id:`album`,name:`Album`,icon:Re},{id:`year`,name:`Year`,icon:En},{id:`filename`,name:`File name`,icon:Fe},{id:`genre`,name:`Genre`,icon:In},{id:`season`,name:`Season`,icon:Z}],Ut=A(`<span class="sort-icon svelte-1ly12po"><!></span>`),Wt=A(`<button type="button"><!></button>`),ye([`click`]),Gt=A(`<button type="button"><span class="sound-icon svelte-1vwnx9r"><!></span></button>`),ye([`click`]),Kt=A(`<button type="button" class="stage-btn svelte-chvcxl"><!></button> <button type="button" class="stage-btn stage-btn-wide svelte-chvcxl"> </button> <button type="button" class="stage-btn svelte-chvcxl"> </button>`,1),qt=A(`<div class="flex items-center gap-1 rounded-lg border border-white/10 bg-black/60 p-1 backdrop-blur-md svelte-chvcxl"><button type="button" class="stage-btn svelte-chvcxl" aria-label="Leave full screen" title="Leave full screen"><!></button> <!> <!></div>`),ye([`click`]),Jt=[`DOGS`,`DOG BLOG`],Y=[`JAN`,`FEB`,`MAR`,`APR`,`MAY`,`JUN`,`JUL`,`AUG`,`SEP`,`OCT`,`NOV`,`DEC`],Yt=/^(\d{4})-(\d{2})/,Xt=`I understand the creator of this sick beat Nxnja has a copyright notice on his music distribution website.\r
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
`,Zt=A(`<canvas class="visualizer-canvas svelte-1o4jdf5"></canvas>`),Qt=A(`<div class="visualizer-container viz-disc cursor-pointer svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open the song list. Double tap for full screen."><!> <div><img class="viz-art svelte-1o4jdf5"/></div> <div class="viz-spindle svelte-1o4jdf5"></div></div>`),$t=A(`<div class="vinyl-record-clicker cursor-pointer w-full h-full svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div><div class="groove g1 svelte-1o4jdf5"></div> <div class="groove g2 svelte-1o4jdf5"></div> <div class="groove g3 svelte-1o4jdf5"></div> <div class="groove g4 svelte-1o4jdf5"></div> <div class="record-label svelte-1o4jdf5"><img loading="lazy"/></div> <div class="spindle svelte-1o4jdf5"></div></div> <div></div></div>`),en=A(`<div class="cassette-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="cassette-tape svelte-1o4jdf5"><div class="cassette-label bg-gradient-to-r from-purple-800 to-pink-700 svelte-1o4jdf5"><span class="cassette-track-title svelte-1o4jdf5"> </span> <span class="cassette-brand svelte-1o4jdf5">WEAREDOGS AUDIO</span></div> <div class="cassette-window bg-zinc-950/80 svelte-1o4jdf5"><div></div> <div></div> <div></div> <div></div></div></div></div>`),tn=A(`<div class="floppy-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="floppy-disk svelte-1o4jdf5"><div class="floppy-corner svelte-1o4jdf5"></div> <div class="floppy-write-protect svelte-1o4jdf5"></div> <div class="floppy-label bg-slate-100 text-slate-900 svelte-1o4jdf5"><div class="floppy-label-stripe bg-red-600 svelte-1o4jdf5"></div> <div class="floppy-label-stripe-blue bg-blue-600 svelte-1o4jdf5"></div> <div class="floppy-label-content svelte-1o4jdf5"><div class="floppy-song truncate font-mono svelte-1o4jdf5"> </div> <div class="floppy-artist truncate font-mono svelte-1o4jdf5"> </div></div></div> <div class="floppy-shutter-door bg-zinc-700 svelte-1o4jdf5"><div></div> <div class="floppy-shutter-opening bg-zinc-950 svelte-1o4jdf5"><div></div></div></div> <div></div></div></div>`),nn=A(`<div></div>`),rn=A(`<div class="musicbox-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="music-box svelte-1o4jdf5"><div></div> <div class="music-box-interior border border-amber-900/40 svelte-1o4jdf5"><div class="music-box-gears svelte-1o4jdf5"><div></div> <div></div></div> <div class="music-box-drum-wrap svelte-1o4jdf5"><div><div class="music-box-pins svelte-1o4jdf5"><div class="pin pin-1 svelte-1o4jdf5"></div> <div class="pin pin-2 svelte-1o4jdf5"></div> <div class="pin pin-3 svelte-1o4jdf5"></div> <div class="pin pin-4 svelte-1o4jdf5"></div> <div class="pin pin-5 svelte-1o4jdf5"></div> <div class="pin pin-6 svelte-1o4jdf5"></div></div></div></div> <div class="music-box-comb svelte-1o4jdf5"></div></div></div></div>`),an=A(`<button><!></button>`),on=A(`<span class="player-tether-hint svelte-1o4jdf5" role="status"> </span>`),sn=A(`<span class="player-tether svelte-1o4jdf5"><button><!></button> <!></span>`),cn=A(`<span></span>`),ln=A(`<div class="spin-ring svelte-1o4jdf5"></div>`),un=A(`<div class="volume-popover svelte-1o4jdf5"><button class="ctrl ctrl-xs mr-2 border border-white/10 rounded-full p-1 hover:bg-white/10 svelte-1o4jdf5" aria-label="Mute"><!></button> <input type="range" class="vol-slider-pop svelte-1o4jdf5" min="0" max="1" step="0.01" aria-label="Volume"/> <span class="text-[10px] font-bold text-white/60 min-w-[28px] text-right font-mono select-none svelte-1o4jdf5"> </span></div>`),dn=A(`<span class="tl-count hidden sm:inline svelte-1o4jdf5"> </span>`),fn=A(`<button role="tab"><!><span class="svelte-1o4jdf5">PRESETS</span> <!></button>`),pn=A(`<div class="eq svelte-1o4jdf5"><div class="eq-b svelte-1o4jdf5"></div> <div class="eq-b svelte-1o4jdf5"></div> <div class="eq-b svelte-1o4jdf5"></div></div>`),mn=A(`<span class="svelte-1o4jdf5"></span>`),hn=A(`<span class="text-amber-400 flex items-center gap-1 text-[9px] font-bold tracking-wider uppercase bg-amber-500/10 px-1.5 py-0.5 rounded flex-shrink-0 svelte-1o4jdf5" title="Failed to fetch music source from remote database"><!> Error Fetching</span>`),gn=A(`<button class="cursor-pointer svelte-1o4jdf5" style="background: none; border: none; padding: 0; color: inherit; font: inherit;">i</button>`),_n=A(`<a target="_blank" class="svelte-1o4jdf5">i</a>`),vn=A(`<span class="inst-chip-link svelte-1o4jdf5"><!></span>`),yn=A(`<div><div class="tr-num svelte-1o4jdf5"><!></div> <img loading="lazy" class="tr-art svelte-1o4jdf5"/> <div class="tr-info svelte-1o4jdf5"><div class="flex items-center gap-1.5 min-w-0 svelte-1o4jdf5"><span> </span> <!></div> <span class="tr-meta svelte-1o4jdf5"> </span></div> <div class="flex items-center gap-2 flex-shrink-0 svelte-1o4jdf5"><!>  <button class="tr-share-btn svelte-1o4jdf5" title="Copy track link" aria-label="Share track"><!></button> <!></div></div>`),bn=A(`<img alt="" class="stage-cover svelte-1o4jdf5"/>`),xn=A(`<button> </button>`),Sn=A(`<div class="flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-lg p-1 border border-white/10 svelte-1o4jdf5"></div>`),Cn=A(`<div><div class="stage-frame svelte-1o4jdf5"><!> <!></div> <div class="visualizer-overlay flex-col items-center sm:flex-row sm:items-end svelte-1o4jdf5"><!> <!> <!></div></div>`),wn=A(`<div class="arigato-modal-backdrop svelte-1o4jdf5"><div class="arigato-modal-content svelte-1o4jdf5"><header class="arigato-modal-header svelte-1o4jdf5"><h2 class="svelte-1o4jdf5">ARIGATO INFO</h2> <button class="arigato-close-btn svelte-1o4jdf5"><!></button></header> <div class="arigato-modal-body scroll-y svelte-1o4jdf5"><div class="merch-link-container svelte-1o4jdf5"><a href="https://nxnjaa.beatstars.com/" target="_blank" rel="noopener noreferrer" class="merch-link-btn svelte-1o4jdf5"><!> NXNJA MERCH & MUSIC</a></div> <p class="intro-text svelte-1o4jdf5"></p> <div class="tos-box svelte-1o4jdf5"><div class="tos-microtext svelte-1o4jdf5"></div></div> <p class="outro-text svelte-1o4jdf5"></p></div></div></div>`),Tn=A(`<div class="mp-backdrop svelte-1o4jdf5"><div><header class="panel-header svelte-1o4jdf5"><div class="brand svelte-1o4jdf5"><button class="logo-btn svelte-1o4jdf5" aria-label="Go to the DOGS home page"><!></button> <h1 class="svelte-1o4jdf5"></h1></div> <button class="close-btn svelte-1o4jdf5" aria-label="Close panel"><!></button></header> <div class="mp-body svelte-1o4jdf5"><div class="songs-layout svelte-1o4jdf5"><div><div><div><!></div>  <div class="track-info mt-2 svelte-1o4jdf5"><div class="flex items-center justify-center gap-1.5 mb-1.5 svelte-1o4jdf5"><button class="player-share-btn svelte-1o4jdf5" title="Copy track link" aria-label="Share track"><!></button> <!> <!></div> <div><h2> </h2></div> <div><p> </p></div> <div><p> </p></div></div></div> <div class="player-controls-block svelte-1o4jdf5"><!> <div class="progress-row svelte-1o4jdf5"><span class="ptime svelte-1o4jdf5"> </span> <div class="progress-wrap waveform-slider-wrap relative h-9 flex items-end svelte-1o4jdf5"><div class="waveform-bars flex items-end justify-between absolute inset-0 pointer-events-none px-1 h-full svelte-1o4jdf5"></div> <input type="range" class="seek-input absolute inset-0 opacity-0 cursor-pointer w-full h-full svelte-1o4jdf5" min="0" step="0.1" aria-label="Seek"/></div> <span class="ptime svelte-1o4jdf5"> </span></div> <div class="controls-row svelte-1o4jdf5"><button aria-label="Shuffle"><!></button> <button class="ctrl ctrl-md svelte-1o4jdf5" aria-label="Previous"><!></button> <button><!></button> <button class="ctrl ctrl-md svelte-1o4jdf5" aria-label="Next"><!></button> <button aria-label="Repeat"><!></button></div> <div class="w-full flex flex-col items-center gap-1.5 mt-2 px-1 svelte-1o4jdf5"><div><span><!> <span class="svelte-1o4jdf5">VOCAL</span></span> <div class="dj-fader-slot relative svelte-1o4jdf5"><div></div></div> <span><!> <span class="svelte-1o4jdf5">INST</span></span></div></div> <div class="relative flex justify-center items-center gap-3 mt-2 w-full svelte-1o4jdf5"><!> <!> <button class="ctrl ctrl-xs svelte-1o4jdf5" aria-label="Full screen" title="Full screen"><!></button> <!> <!> <div class="relative svelte-1o4jdf5"><button class="ctrl ctrl-xs vol-toggle-btn svelte-1o4jdf5" aria-label="Toggle volume slider"><!></button></div></div></div></div> <div><div class="mobile-close-bar hidden py-2 px-4 border-b border-white/5 flex items-center justify-between svelte-1o4jdf5"><span class="text-xs font-bold text-white/50 svelte-1o4jdf5">Track Library</span> <button class="px-3 py-1 bg-white/5 text-white/75 rounded-lg text-xs font-bold svelte-1o4jdf5">Back to player</button></div> <div class="tl-header relative flex justify-between items-center gap-3 svelte-1o4jdf5"><div class="flex flex-1 items-center justify-between gap-1 sm:flex-none sm:justify-start svelte-1o4jdf5" role="tablist" aria-label="Songs or visualizer presets"><button role="tab"><!><span class="svelte-1o4jdf5">TRACKS</span> <span class="tl-count hidden sm:inline svelte-1o4jdf5"> </span></button> <!></div> <!> <div><span class="text-[9px] text-white/30 font-bold font-sans svelte-1o4jdf5">SORT BY:</span> <select class="bg-black/40 border border-white/10 rounded px-1.5 py-0.5 text-[10px] font-bold text-white/60 outline-none cursor-pointer hover:border-white/20 transition-all font-sans svelte-1o4jdf5"><option class="svelte-1o4jdf5">DEFAULT</option><option class="svelte-1o4jdf5">ARTIST</option><option class="svelte-1o4jdf5">ALBUM</option><option class="svelte-1o4jdf5">YEAR</option><option class="svelte-1o4jdf5">FILENAME</option><option class="svelte-1o4jdf5">GENRE</option><option class="svelte-1o4jdf5">SEASON</option></select></div></div> <!> <div></div></div></div></div> <footer class="mp-footer svelte-1o4jdf5"><div class="mp-status svelte-1o4jdf5"><span class="mp-dot svelte-1o4jdf5"></span><span class="svelte-1o4jdf5">🐕</span></div> <span class="svelte-1o4jdf5">MUSIC</span></footer></div> <!> <canvas class="fader-fx-canvas pointer-events-none svelte-1o4jdf5"></canvas> <!></div>`),ye([`click`,`input`,`change`,`pointerdown`,`pointermove`])}}})})();