(function(){function e(t){"@babel/helpers - typeof";return e=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},e(t)}function t(e,t){if(!(e instanceof t))throw TypeError(`Cannot call a class as a function`)}function n(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,`value`in r&&(r.writable=!0),Object.defineProperty(e,m(r.key),r)}}function r(e,t,r){return t&&n(e.prototype,t),r&&n(e,r),Object.defineProperty(e,"prototype",{writable:!1}),e}function i(){var e,t,n=typeof Symbol==`function`?Symbol:{},r=n.iterator||`@@iterator`,o=n.toStringTag||`@@toStringTag`;function s(n,r,i,o){var s=r&&r.prototype instanceof l?r:l,u=Object.create(s.prototype);return a(u,`_invoke`,function(n,r,i){var a,o,s,l=0,u=i||[],d=!1,f={p:0,n:0,v:e,a:p,f:p.bind(e,4),d:function(t,n){return a=t,o=0,s=e,f.n=n,c}};function p(n,r){for(o=n,s=r,t=0;!d&&l&&!i&&t<u.length;t++){var i,a=u[t],p=f.p,m=a[2];n>3?(i=m===r)&&(s=a[(o=a[4])?5:(o=3,3)],a[4]=a[5]=e):a[0]<=p&&((i=n<2&&p<a[1])?(o=0,f.v=r,f.n=a[1]):p<m&&(i=n<3||a[0]>r||r>m)&&(a[4]=n,a[5]=r,f.n=m,o=0))}if(i||n>1)return c;throw d=!0,r}return function(i,u,m){if(l>1)throw TypeError(`Generator is already running`);for(d&&u===1&&p(u,m),o=u,s=m;(t=o<2?e:s)||!d;){a||(o?o<3?(o>1&&(f.n=-1),p(o,s)):f.n=s:f.v=s);try{if(l=2,a){if(o||(i=`next`),t=a[i]){if(!(t=t.call(a,s)))throw TypeError(`iterator result is not an object`);if(!t.done)return t;s=t.value,o<2&&(o=0)}else o===1&&(t=a.return)&&t.call(a),o<2&&(s=TypeError(`The iterator does not provide a '`+i+`' method`),o=1);a=e}else if((t=(d=f.n<0)?s:n.call(r,f))!==c)break}catch(t){a=e,o=1,s=t}finally{l=1}}return{value:t,done:d}}}(n,i,o),!0),u}var c={};function l(){}function u(){}function d(){}t=Object.getPrototypeOf;var f=[][r]?t(t([][r]())):(a(t={},r,function(){return this}),t),p=d.prototype=l.prototype=Object.create(f);function m(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,d):(e.__proto__=d,a(e,o,`GeneratorFunction`)),e.prototype=Object.create(p),e}return u.prototype=d,a(p,`constructor`,d),a(d,`constructor`,u),u.displayName=`GeneratorFunction`,a(d,o,`GeneratorFunction`),a(p),a(p,o,`Generator`),a(p,r,function(){return this}),a(p,`toString`,function(){return`[object Generator]`}),(i=function(){return{w:s,m}})()}function a(e,t,n,r){var i=Object.defineProperty;try{i({},``,{})}catch(e){i=0}a=function(e,t,n,r){function o(t,n){a(e,t,function(e){return this._invoke(t,n,e)})}t?i?i(e,t,{value:n,enumerable:!r,configurable:!r,writable:!r}):e[t]=n:(o(`next`,0),o(`throw`,1),o(`return`,2))},a(e,t,n,r)}function o(e,t){var n=typeof Symbol<`u`&&e[Symbol.iterator]||e[`@@iterator`];if(!n){if(Array.isArray(e)||(n=s(e))||t&&e&&typeof e.length==`number`){n&&(e=n);var r=0,i=function(){};return{s:i,n:function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}},e:function(e){throw e},f:i}}throw TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var a,o=!0,c=!1;return{s:function(){n=n.call(e)},n:function(){var e=n.next();return o=e.done,e},e:function(e){c=!0,a=e},f:function(){try{o||n.return==null||n.return()}finally{if(c)throw a}}}}function s(e,t){if(e){if(typeof e==`string`)return c(e,t);var n={}.toString.call(e).slice(8,-1);return n===`Object`&&e.constructor&&(n=e.constructor.name),n===`Map`||n===`Set`?Array.from(e):n===`Arguments`||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?c(e,t):void 0}}function c(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function l(e,t,n,r,i,a,o){try{var s=e[a](o),c=s.value}catch(e){n(e);return}s.done?t(c):Promise.resolve(c).then(r,i)}function u(e){return function(){var t=this,n=arguments;return new Promise(function(r,i){var a=e.apply(t,n);function o(e){l(a,r,i,o,s,`next`,e)}function s(e){l(a,r,i,o,s,`throw`,e)}o(void 0)})}}function d(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function f(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t];t%2?d(Object(n),!0).forEach(function(t){p(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):d(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function p(e,t,n){return(t=m(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function m(t){var n=h(t,`string`);return e(n)==`symbol`?n:n+``}function h(t,n){if(e(t)!=`object`||!t)return t;var r;if(typeof Symbol<`u`&&(r=t[Symbol.toPrimitive])!==void 0){var i=r.call(t,n||`default`);if(e(i)!=`object`)return i;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(n===`string`?String:Number)(t)}System.register(`./index-legacy-FXupPm0L.js,./three-legacy-RJR1-iRG.js,./play-legacy-BJ3zJG46.js,./TitlePage-legacy-D0zPzwGP.js,./skip-forward-legacy-zJrl6E9D.js,./volume-2-legacy-CCxz3L02.js,./volume-x-legacy-DB6VKoU5.js,./shuffle-legacy-DTHr_l3n.js,./openDogsPage-legacy-TgUTJl3m.js,./list-legacy-zaJMfXxn.js,./external-link-legacy-B62ZOp7w.js,./TetherIcon-legacy-BAVtcfSE.js,./tv-legacy-0zSKhXwr.js,./share-2-legacy-B0c0eu_J.js,./download-legacy-CJispJfV.js,./check-legacy-BupIMb5w.js,./triangle-alert-legacy-DICxJ0nl.js,./AudioCore.svelte-legacy-CF0CgwMF.js,./doubleTap-legacy-TTFKgIZD.js,./musicCatalog.svelte-legacy-BC_Vv4MS.js,./tether.svelte-legacy-BscW4Y0A.js,./homeOrigin-legacy-DYqyXGoy.js,./DogsLogo-legacy-BAxCH6uQ.js,./MilkdropEngine-legacy-DKx0T7Hs.js,./list-music-legacy-4z1YBLSw.js,./presetDeck.svelte-legacy-K7lMJsnL.js,./search-legacy-DecdytbN.js,./three-core-legacy-CtrKL6Gq.js,./lyrics.svelte-legacy-DzCcNzmG.js,./lyricsFormat-legacy-BdVt-V3o.js,./volume-1-legacy-fdm55PK9.js,./arrow-up-to-line-legacy-BHBs5lr2.js,./transition-legacy-CX7xR-pf.js`.split(`,`),function(e,n){var a,s,c,l,d,p,m,h,g,_,v,y,b,x,ee,S,C,te,w,T,E,ne,D,O,re,ie,k,A,j,M,N,ae,P,F,oe,I,L,se,ce,R,le,z,ue,B,de,fe,pe,V,H,me,U,he,ge,_e,ve,ye,be,xe,Se,Ce,we,Te,Ee,De,W,Oe,ke,Ae,je,G,Me,Ne,Pe,Fe,Ie,Le,Re,ze,Be,Ve,He,Ue,We,Ge,Ke,K,qe,Je,Ye,q,Xe,Ze,Qe,$e,et,tt,nt,rt,J,it,at,ot,st,ct,lt,ut,Y,dt,ft,pt,mt,ht,gt,_t,vt,yt,bt,xt,St,Ct,wt,Tt,Et,Dt,X,Ot,kt,At,jt,Mt,Nt,Pt,Ft,It,Lt,Rt,zt,Bt,Vt,Ht,Ut,Wt,Gt,Kt,qt,Jt,Yt,Xt,Zt,Qt,$t,en,tn,nn,rn,an,on,sn,cn,ln,un,dn,fn,pn,mn,hn,gn,_n,vn,yn,bn,xn;function Sn(e,t){var n=k(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`M8 2v4`}],[`path`,{d:`M16 2v4`}],[`rect`,{width:`18`,height:`18`,x:`3`,y:`4`,rx:`2`}],[`path`,{d:`M3 10h18`}],[`path`,{d:`M8 14h.01`}],[`path`,{d:`M12 14h.01`}],[`path`,{d:`M16 14h.01`}],[`path`,{d:`M8 18h.01`}],[`path`,{d:`M12 18h.01`}],[`path`,{d:`M16 18h.01`}]];G(e,j({name:`calendar-days`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=a(),i=s(r);E(i,t,`default`,{},null),C(e,r)},$$slots:{default:!0}}))}function Cn(e,t){var n=k(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z`}]];G(e,j({name:`diamond`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=a(),i=s(r);E(i,t,`default`,{},null),C(e,r)},$$slots:{default:!0}}))}function wn(e,t){var n=k(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`M12 22v-6`}],[`path`,{d:`M12 8V2`}],[`path`,{d:`M4 12H2`}],[`path`,{d:`M10 12H8`}],[`path`,{d:`M16 12h-2`}],[`path`,{d:`M22 12h-2`}],[`path`,{d:`m15 19-3-3-3 3`}],[`path`,{d:`m15 5-3 3-3-3`}]];G(e,j({name:`fold-vertical`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=a(),i=s(r);E(i,t,`default`,{},null),C(e,r)},$$slots:{default:!0}}))}function Tn(e,t){var n=k(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`m11.9 12.1 4.514-4.514`}],[`path`,{d:`M20.1 2.3a1 1 0 0 0-1.4 0l-1.114 1.114A2 2 0 0 0 17 4.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 17.828 7h1.344a2 2 0 0 0 1.414-.586L21.7 5.3a1 1 0 0 0 0-1.4z`}],[`path`,{d:`m6 16 2 2`}],[`path`,{d:`M8.23 9.85A3 3 0 0 1 11 8a5 5 0 0 1 5 5 3 3 0 0 1-1.85 2.77l-.92.38A2 2 0 0 0 12 18a4 4 0 0 1-4 4 6 6 0 0 1-6-6 4 4 0 0 1 4-4 2 2 0 0 0 1.85-1.23z`}]];G(e,j({name:`guitar`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=a(),i=s(r);E(i,t,`default`,{},null),C(e,r)},$$slots:{default:!0}}))}function En(e,t){var n=k(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5`}]];G(e,j({name:`heart`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=a(),i=s(r);E(i,t,`default`,{},null),C(e,r)},$$slots:{default:!0}}))}function Dn(e,t){var n=k(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z`}],[`path`,{d:`M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12`}]];G(e,j({name:`leaf`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=a(),i=s(r);E(i,t,`default`,{},null),C(e,r)},$$slots:{default:!0}}))}function On(e,t){var n=k(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`M11 5h10`}],[`path`,{d:`M11 12h10`}],[`path`,{d:`M11 19h10`}],[`path`,{d:`M4 4h1v5`}],[`path`,{d:`M4 9h2`}],[`path`,{d:`M6.5 20H3.4c0-1 2.6-1.925 2.6-3.5a1.5 1.5 0 0 0-2.6-1.02`}]];G(e,j({name:`list-ordered`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=a(),i=s(r);E(i,t,`default`,{},null),C(e,r)},$$slots:{default:!0}}))}function kn(e,t){var n=k(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`m11 7.601-5.994 8.19a1 1 0 0 0 .1 1.298l.817.818a1 1 0 0 0 1.314.087L15.09 12`}],[`path`,{d:`M16.5 21.174C15.5 20.5 14.372 20 13 20c-2.058 0-3.928 2.356-6 2-2.072-.356-2.775-3.369-1.5-4.5`}],[`circle`,{cx:`16`,cy:`7`,r:`5`}]];G(e,j({name:`mic-vocal`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=a(),i=s(r);E(i,t,`default`,{},null),C(e,r)},$$slots:{default:!0}}))}function An(e,t){var n=k(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`m17 2 4 4-4 4`}],[`path`,{d:`M3 11v-1a4 4 0 0 1 4-4h14`}],[`path`,{d:`m7 22-4-4 4-4`}],[`path`,{d:`M21 13v1a4 4 0 0 1-4 4H3`}],[`path`,{d:`M11 10h1v4`}]];G(e,j({name:`repeat-1`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=a(),i=s(r);E(i,t,`default`,{},null),C(e,r)},$$slots:{default:!0}}))}function jn(e,t){var n=k(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`m17 2 4 4-4 4`}],[`path`,{d:`M3 11v-1a4 4 0 0 1 4-4h14`}],[`path`,{d:`m7 22-4-4 4-4`}],[`path`,{d:`M21 13v1a4 4 0 0 1-4 4H3`}]];G(e,j({name:`repeat`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=a(),i=s(r);E(i,t,`default`,{},null),C(e,r)},$$slots:{default:!0}}))}function Mn(e,t){var n=k(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`M8.8 20v-4.1l1.9.2a2.3 2.3 0 0 0 2.164-2.1V8.3A5.37 5.37 0 0 0 2 8.25c0 2.8.656 3.054 1 4.55a5.77 5.77 0 0 1 .029 2.758L2 20`}],[`path`,{d:`M19.8 17.8a7.5 7.5 0 0 0 .003-10.603`}],[`path`,{d:`M17 15a3.5 3.5 0 0 0-.025-4.975`}]];G(e,j({name:`speech`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=a(),i=s(r);E(i,t,`default`,{},null),C(e,r)},$$slots:{default:!0}}))}function Nn(e,t){var n=k(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`M13.172 2a2 2 0 0 1 1.414.586l6.71 6.71a2.4 2.4 0 0 1 0 3.408l-4.592 4.592a2.4 2.4 0 0 1-3.408 0l-6.71-6.71A2 2 0 0 1 6 9.172V3a1 1 0 0 1 1-1z`}],[`path`,{d:`M2 7v6.172a2 2 0 0 0 .586 1.414l6.71 6.71a2.4 2.4 0 0 0 3.191.193`}],[`circle`,{cx:`10.5`,cy:`6.5`,r:`.5`,fill:`currentColor`}]];G(e,j({name:`tags`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=a(),i=s(r);E(i,t,`default`,{},null),C(e,r)},$$slots:{default:!0}}))}function Pn(e,t){var n=k(t,[`children`,`$$slots`,`$$events`,`$$legacy`]),r=[[`path`,{d:`M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z`}],[`path`,{d:`M17 14V2`}]];G(e,j({name:`thumbs-down`},function(){return n},{get iconNode(){return r},children:function(e,n){var r=a(),i=s(r);E(i,t,`default`,{},null),C(e,r)},$$slots:{default:!0}}))}function Fn(e,t){return e?e.artist===bt&&!t&&e.src?{url:e.src,label:St}:e.instrumental?{url:e.instrumental,label:xt}:{url:e.src||``,label:Ct}:{url:``,label:Ct}}function In(){if(typeof document>`u`)return!1;try{var e=document.createElement(`canvas`);return!!(e.getContext(`webgl`)||e.getContext(`experimental-webgl`))}catch(e){return!1}}function Ln(e,t){te(t,!0);var n=120,r=`all`,i=`hearts`,a=`disliked`,o=U(``),s=U(r),c=z(function(){if(M(s)===i)return J.favorites;if(M(s)===a)return J.disliked;if(!J.disliked.length)return J.names;var e=new Set(J.disliked);return J.names.filter(function(t){return!e.has(t)})}),l=z(function(){return M(o).trim().toLowerCase().split(/\s+/).filter(Boolean)}),u=z(function(){return M(l).length?M(c).filter(function(e){return M(l).every(function(t){return e.toLowerCase().indexOf(t)!==-1})}):M(c)}),f=z(function(){return M(u).slice(0,n)}),p=z(function(){return M(s)===i&&!J.favorites.length?`No hearts yet. Tap the heart on a preset you love.`:M(s)===a&&!J.disliked.length?`Nothing turned down. Tap the thumbs-down on a preset you never want to see again.`:J.names.length?`No preset matches that.`:`Presets arrive when the visualizer starts. Press play.`}),m=kt(),h=L(m),g=L(h);it(g,{size:14,class:`shrink-0 text-white/40`});var v=x(g,2);d(v);var ee=x(v,2),S=L(ee),w,E=x(S,2),ne,O=L(E);En(O,{size:10});var ie=x(O);P(E);var k=x(E,2),A,j=L(k);Pn(j,{size:10});var N=x(j);P(k),P(ee),P(h);var ae=x(h,2),oe=L(ae);T(oe,16,function(){return M(f)},function(e){return e},function(e,t){var n=Dt(),r=L(n),i=I(r,!0),a=x(r,2),o,s=L(a),c=z(function(){return J.isFavorite(t)?`currentColor`:`none`});En(s,{size:13,get fill(){return M(c)}}),P(a);var l=x(a,2),u,d=L(l),f=z(function(){return J.isDisliked(t)?`currentColor`:`none`});Pn(d,{size:13,get fill(){return M(f)}}),P(l),P(n),H(function(e,n,s,c,d,f,p){b(r,1,`min-w-0 flex-1 truncate px-3 py-1.5 text-left font-mono text-[11px] transition-colors hover:bg-white/10 md:px-4 md:text-[12px] 2xl:px-5 2xl:py-2 2xl:text-[15px]
            ${t===J.current?`bg-white/15 text-white`:`text-white/60`}`,`svelte-80frst`),V(r,`aria-current`,t===J.current?`true`:void 0),r.disabled=!J.names.length,D(i,t),o=b(a,1,`heart-btn svelte-80frst`,null,o,{hearted:e}),V(a,`aria-pressed`,n),V(a,`aria-label`,s),u=b(l,1,`heart-btn svelte-80frst`,null,u,{disliked:c}),V(l,`aria-pressed`,d),V(l,`aria-label`,f),V(l,`title`,p)},[function(){return J.isFavorite(t)},function(){return J.isFavorite(t)},function(){return J.isFavorite(t)?`Take the heart off ${t}`:`Heart ${t}`},function(){return J.isDisliked(t)},function(){return J.isDisliked(t)},function(){return J.isDisliked(t)?`Bring back ${t}`:`Never show ${t} again`},function(){return J.isDisliked(t)?`Turned down. Tap to bring it back.`:`Never show this preset again`}]),F(`click`,r,function(){return J.pick(t)}),F(`click`,a,function(){return J.toggleFavorite(t)}),F(`click`,l,function(){return J.toggleDislike(t)}),C(e,n)});var se=x(oe,2),ce=function(e){var t=X(),n=I(t,!0);H(function(){return D(n,M(p))}),C(e,t)},R=function(e){var t=Ot(),n=I(t);H(function(){return D(n,`${M(u).length-M(f).length} more. Search to narrow it down.`)}),C(e,t)};_(se,function(e){M(f).length?M(u).length>M(f).length&&e(R,1):e(ce)}),P(ae),P(m),H(function(){var e,t,n;V(v,`placeholder`,`Search ${(e=M(c).length)==null?``:e} presets`),w=b(S,1,`filter-btn svelte-80frst`,null,w,{"filter-on":M(s)===r}),V(S,`aria-pressed`,M(s)===r),ne=b(E,1,`filter-btn svelte-80frst`,null,ne,{"filter-on":M(s)===i}),V(E,`aria-pressed`,M(s)===i),D(ie,` ${(t=J.favorites.length)==null?``:t}`),A=b(k,1,`filter-btn svelte-80frst`,null,A,{"filter-on":M(s)===a}),V(k,`aria-pressed`,M(s)===a),D(N,` ${(n=J.disliked.length)==null?``:n}`)}),me(v,function(){return M(o)},function(e){return y(o,e)}),F(`click`,S,function(){return y(s,r)}),F(`click`,E,function(){return y(s,i)}),F(`click`,k,function(){return y(s,a)}),C(e,m),re()}function Rn(e,t){te(t,!0);var n=nt/1e3,r=U(!1),i=z(function(){return J.isFavorite(J.current)}),a=Mt(),o=L(a),s=function(e){var t=At();Ln(L(t),{}),P(t),C(e,t)};_(o,function(e){M(r)&&e(s)});var c=x(o,2),l=L(c),u=L(l);_e(u,{size:16}),P(l);var d=x(l,2),f=L(d);ge(f,{size:16}),P(d);var p=x(d,2),h=I(p,!0),g=x(p,2),v,ee=L(g),S=z(function(){return M(i)?`currentColor`:`none`});En(ee,{size:14,get fill(){return M(S)}}),P(g);var w=x(g,2);Pn(L(w),{size:14}),P(w);var T=x(w,2),E,ne=L(T);rt(ne,{size:14}),P(T);var O=x(T,2),ie,k=L(O);je(k,{size:14}),P(O);var A=x(O,2),j,N=L(A);m(N,function(){return J.current},function(e){var t=jt(),n;H(function(){var e;n=b(t,0,`deck-timer svelte-6h1e9g`,null,n,{"deck-timer-running":J.auto}),oe(t,`--auto-ms: ${(e=3e4)==null?``:e}ms`)}),C(e,t)}),P(A),P(c),P(a),H(function(){V(p,`aria-expanded`,M(r)),V(p,`title`,M(r)?`Hide the preset list`:`Browse presets`),D(h,J.current||`Loading MilkDrop…`),v=b(g,1,`deck-btn deck-heart svelte-6h1e9g`,null,v,{"deck-hearted":M(i)}),V(g,`aria-pressed`,M(i)),V(g,`aria-label`,M(i)?`Take the heart off this preset`:`Heart this preset`),V(g,`title`,M(i)?`In your hearts. Tap to take it out.`:`Heart this preset`),w.disabled=!J.current,E=b(T,1,`deck-btn svelte-6h1e9g`,null,E,{"deck-btn-on":J.favoritesOnly}),V(T,`aria-pressed`,J.favoritesOnly),V(T,`title`,J.favoritesOnly?`Playing only your hearts`:`Play only your hearts`),ie=b(O,1,`deck-btn svelte-6h1e9g`,null,ie,{"deck-btn-on":J.shuffle}),V(O,`aria-pressed`,J.shuffle),V(O,`title`,J.shuffle?`Shuffle: on`:`Shuffle: off, presets go in order`),j=b(A,1,`deck-btn svelte-6h1e9g`,null,j,{"deck-btn-on":J.auto}),V(A,`aria-pressed`,J.auto),V(A,`aria-label`,`Change preset by itself every ${n} seconds`),V(A,`title`,J.auto?`A new preset every ${n} seconds: on`:`A new preset every ${n} seconds: off`)}),F(`click`,l,function(){return J.previous()}),F(`click`,d,function(){return J.next()}),F(`click`,p,function(){return y(r,!M(r))}),F(`click`,g,function(){return J.toggleFavorite()}),F(`click`,w,function(){return J.toggleDislike()}),F(`click`,T,function(){return J.setFavoritesOnly(!J.favoritesOnly)}),F(`click`,O,function(){return J.setShuffle(!J.shuffle)}),F(`click`,A,function(){return J.setAuto(!J.auto)}),C(e,a),re()}function zn(e,t){te(t,!0);var n=1e3,r=`sung`,i=`stage`,o=ce(t,`variant`,3,`slot`),c=U(-1),l=U(null),u=U(null),d=U(1),f=z(function(){return Y.shown&&Y.current?Y.current.lines:null}),p=z(function(){return M(f)&&M(c)>=0?M(f)[M(c)]:null}),h=z(function(){return pt.find(function(e){return e.id===Y.font}).stack}),g=z(function(){return o()===i?ft.find(function(e){return e.id===Y.size}).scale:1}),v=0,x=0;w(function(){v=K.currentTime,x=performance.now()});function ee(){var e=K.primaryAudio();return e&&e.src&&!e.paused?e.currentTime:K.isPlaying?v+(performance.now()-x)/n:K.currentTime}var S=0;w(function(){var e=M(f);if(y(c,-1),S=0,e){var t=0,n=function(){t=requestAnimationFrame(n);var i=ee(),a=mt(e,i);if(a!==M(c))y(c,a,!0),S=0;else if(!(a<0||!M(u))){for(var o=e[a].w,s=0;s<o.length&&o[s][0]<=i;)s++;if(s!==S){for(var l=M(u).children,d=Math.min(s,S);d<Math.max(s,S)&&d<l.length;d++)l[d].classList.toggle(r,d<s);S=s}}};return t=requestAnimationFrame(n),function(){return cancelAnimationFrame(t)}}}),w(function(){M(p),M(h),M(g),y(d,1),se().then(function(){M(u)&&M(l)&&M(u).scrollWidth&&y(d,Math.min(1,M(l).clientWidth/M(u).scrollWidth),!0)})});var E=Ft(),O=L(E),k=function(e){var t=a(),n=s(t);m(n,function(){return M(c)},function(e){var t=Pt();T(t,21,function(){return M(p).w},ne,function(e,t){var n=Nt(),r=I(n,!0);H(function(){return D(r,M(t)[1])}),C(e,n)}),P(t),ie(t,function(e){return y(u,e)},function(){return M(u)}),C(e,t)}),C(e,t)};_(O,function(e){M(p)&&e(k)}),P(E),ie(E,function(e){return y(l,e)},function(){return M(l)}),H(function(){var e,t,n,r,i;b(E,1,`lyric-line lyric-${(e=o())==null?``:e} lyric-at-${(t=Y.place)==null?``:t}`,`svelte-4gkonh`),oe(E,`--lyric-font: ${(n=M(h))==null?``:n}; --lyric-scale: ${(r=M(g))==null?``:r}; --lyric-fit: ${(i=M(d))==null?``:i};`)}),C(e,E),re()}function Bn(e,t){var n=ce(t,`dim`,3,!1),r=ce(t,`accent`,3,!1),i=ce(t,`class`,3,``),a=It(),o,s=L(a);O(s,function(){return t.children}),ue(2),P(a),H(function(){var e;o=b(a,1,`strike-toggle ${(e=i())==null?``:e}`,`svelte-btbnk2`,o,{"is-off":!t.on,"is-accent":t.on&&r()&&!n(),"is-dim":t.on&&n()}),V(a,`aria-pressed`,t.on),V(a,`aria-label`,t.label),V(a,`title`,t.label)}),F(`click`,a,function(){var e,n=[...arguments];(e=t.onclick)==null||e.apply(this,n)}),C(e,a)}function Vn(e,t){te(t,!0);var n=ce(t,`class`,3,``),r=z(function(){return Math.max(0,Lt.findIndex(function(e){return e.id===t.value}))}),i=z(function(){return Lt[M(r)]}),a=z(function(){return Lt[(M(r)+1)%Lt.length]}),o=zt(),l=L(o);m(l,function(){return M(i).id},function(e){var t=Rt(),n=s(t),r=L(n);c(r,function(){return M(i).icon},function(e,t){t(e,{size:13})}),P(n);var a=x(n,2),o=I(a,!0);H(function(){return D(o,M(i).label||M(i).name)}),C(e,t)}),P(o),H(function(){var e,t,r,s,c;b(o,1,`sort-cycler sort-${(e=M(i).id)==null?``:e} ${(t=n())==null?``:t}`,`svelte-1ly12po`),V(o,`aria-label`,`Sorted by ${(r=M(i).name)==null?``:r}. Tap to sort by ${(s=M(a).name)==null?``:s}.`),V(o,`title`,`Sorted by ${(c=M(i).name)==null?``:c}`)}),F(`click`,o,function(){return t.onchange(M(a).id)}),C(e,o),re()}function Hn(e,t){te(t,!0);var n=`This song plays only where it is unlocked`,r=z(function(){return q.soundHere}),i=z(function(){return q.soundCanMove}),a=z(function(){return M(i)?M(r)?`Sound: this device. Tap to play it on `+(q.peerName||`the other device`):`Sound: `+(q.peerName||`the other device`)+`. Tap to play it here`:n}),o=Bt(),s,c=L(o),l=L(c);ht(l,{size:14}),P(c),P(o),H(function(){s=b(o,1,`sound-switch svelte-1vwnx9r`,null,s,{"sound-away":!M(r)}),o.disabled=!M(i),V(o,`aria-pressed`,!M(r)),V(o,`aria-label`,M(a)),V(o,`title`,M(a))}),F(`click`,o,function(){return q.moveSound()}),C(e,o),re()}function Un(e,t){te(t,!0);var n={top:_t,middle:wn,bottom:gt},r=z(function(){return pt.find(function(e){return e.id===Y.font})}),i=z(function(){return ft.find(function(e){return e.id===Y.size})}),a=z(function(){return n[Y.place]});function o(e,t){return e[(e.indexOf(t)+1)%e.length]}var l=Ht(),u=L(l),d=L(u);$e(d,{size:15}),P(u);var f=x(u,2),p=z(function(){return!t.hasLyrics}),m=z(function(){return Y.shown?t.hasLyrics?`Lyrics: on`:`Lyrics: on. This song has none yet.`:`Lyrics: off`});Bn(f,{class:`stage-btn`,get on(){return Y.shown},get dim(){return M(p)},get label(){return M(m)},onclick:function(){return Y.setPrefs({shown:!Y.shown})},children:function(e,t){Mn(e,{size:15})},$$slots:{default:!0}});var h=x(f,2),g=function(e){var t=Vt(),n=s(t),l=L(n);c(l,function(){return M(a)},function(e,t){t(e,{size:15})}),P(n);var u=x(n,2),d=I(u,!0),f=x(u,2),p=I(f,!0);H(function(e){var t,a,o,s,c,l,m;V(n,`aria-label`,`Lyrics sit at the ${(t=Y.place)==null?``:t}. Tap to move them.`),V(n,`title`,`Lyrics sit at the ${(a=Y.place)==null?``:a}. Tap to move them.`),oe(u,`font-family: ${(o=M(r).stack)==null?``:o}`),V(u,`aria-label`,`Lyric font: ${(s=M(r).name)==null?``:s}. Tap for the next one.`),V(u,`title`,`Lyric font: ${(c=M(r).name)==null?``:c}. Tap for the next one.`),D(d,M(r).name),V(f,`aria-label`,`Lyric size: ${(l=M(i).name)==null?``:l}. Tap to change it.`),V(f,`title`,`Lyric size: ${(m=M(i).name)==null?``:m}. Tap to change it.`),D(p,e)},[function(){return M(i).id.toUpperCase()}]),F(`click`,n,function(){return Y.setPrefs({place:o(dt,Y.place)})}),F(`click`,u,function(){return Y.setPrefs({font:o(pt,M(r)).id})}),F(`click`,f,function(){return Y.setPrefs({size:o(ft,M(i)).id})}),C(e,t)};_(h,function(e){Y.shown&&e(g)}),P(l),F(`click`,u,function(){var e,n=[...arguments];(e=t.onExit)==null||e.apply(this,n)}),C(e,l),re()}function Wn(e){var t=Ut.includes(e.artist),n=Gt.exec((t?e.dateAdded:e.released)||``),r=n?Wt[Number(n[2])-1]:``;return r?`${r} ${n[1]}`:e.year?String(e.year):``}function Gn(e,t){te(t,!0);var n=`/img/error_cover.png`,r=6e4,c=5;function E(e){e.target.src.endsWith(n)||(e.target.src=n)}var O=ce(t,`isClosing`,3,!1),k=ce(t,`initialTrackId`,15,null),j=ce(t,`depth`,15,1),N=qe(function(){return t.onClose()}),R=U(`default`),B=U(!1),fe=U(!1),me=U(!1),ge=U(null),_e=z(function(){var e;return!!K.fetchErrors[(e=K.library[K.currentTrackIndex])==null?void 0:e.id]}),W=z(function(){return K.isPlaying&&!O()&&!M(_e)}),Ae=`milkdrop`,G=`milkdrop`,$e=`shader`,nt=tt(),rt=nt?[{id:Ae,name:`MilkDrop`}]:Tt,it=nt||In(),dt=`music_tv_v1`,ft=`on`,pt=`off`,mt=300,ht=3200,gt=`tracks`,_t=`presets`,yt=`music`,bt=2,xt=640;function St(){try{return localStorage.getItem(dt)!==pt}catch(e){return!0}}var Ct=U(ee(St())),Dt=U(0),X=z(function(){return rt[M(Dt)].id===Ae}),Ot=U(!1),kt=U(null),At=U(null),jt=U(!1),Mt=null,Nt=null,Pt=U(gt),Ft=null,It=!1,Lt=U(!1),Rt=z(function(){return it&&M(Ct)&&M(X)&&q.linked&&K.masterIsRemote}),zt=z(function(){return M(Rt)&&Xe.analyser?Xe.analyser:K.analyser}),Bt=z(function(){return it&&M(Ct)&&(M(X)?!!M(zt):M(Lt))});w(function(){return Xe.setWanted(M(Rt)),function(){return Xe.setWanted(!1)}});function Vt(e){y(Ct,e,!0);try{localStorage.setItem(dt,e?ft:pt)}catch(e){}}var Ht=U(!1),Ut=z(function(){var e=Kt.split(/`{5,}/);return{intro:e[0]||``,tos:e[1]||``,outro:e[2]||``}});function Wt(e){if(!e)return``;var t=e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`);return t=t.replace(/(https?:\/\/[^\s]+)/g,`<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>`),t=t.replace(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/g,`<a href="mailto:$1">$1</a>`),t.replace(/\n/g,`<br>`)}var Gt=z(function(){var e=M(Q);if(!e)return Array(60).fill(10);if(K.waveformPeaks[e.id])return K.waveformPeaks[e.id];for(var t=e.id,n=[],r=0,i=0;i<t.length;i++)r=(r<<5)-r+t.charCodeAt(i),r|=0;for(var a=Math.abs(r)%1e3,o=0;o<60;o++){var s=o/59,c=Math.sin(a+s*Math.PI*4),l=Math.cos(a*1.5+s*Math.PI*10)*.4,u=Math.sin(a*2.3+s*Math.PI*22)*.15,d=Math.abs(c+l+u)/1.55,f=Math.sin(s*Math.PI),p=(d*70+15)*f;n.push(Math.max(10,Math.round(p)))}return n});w(function(){K.isPlaying&&y(Lt,!0)});var Sn=z(function(){return M(X)?null:!K.isPlaying&&!M(Lt)?Et.fragmentShader:rt[M(Dt)].fragmentShader});w(function(){var e=M(X)?M(zt):K.analyser,t=M(X)?G:$e;if(M(Bt)&&M(kt)&&!O()&&M(kt).dataset.engine===t){if(!M(X))Ft=new wt(M(kt),e),Ft.init(M(Sn)),Ft.start();else if(e&&K.audioCtx){var n=new et(M(kt),e,K.audioCtx,J.listeners());ae(function(){return J.attach(n)}),Ft=n,n.start()}}return function(){Ft&&(J.detach(Ft),Ft.destroy(),Ft=null)}}),w(function(){Y.load(M(Q)?M(Q).id:null)}),w(function(){var e=M(Sn);e&&Ft&&M(Bt)&&!M(X)&&(Ft.setPreset(e),Ft.start())}),w(function(){var e=M(B)||M(Ot);e!==It&&(It=e,e?(history.pushState(f(f({},history.state||{}),{},{view:yt,depth:bt,musicOverlay:!0}),``),j(bt)):history.back())});function wn(e){var t;!It||(t=e.state)!=null&&t.musicOverlay||(It=!1,y(B,!1),y(Ot,!1))}function En(){y(jt,!1),clearTimeout(Mt),Mt=setTimeout(function(){return y(jt,!0)},ht)}function Dn(){Vt(!0),Fr(),y(Ot,!0)}function On(){M(At)&&document.fullscreenElement===M(At)?document.exitFullscreen().catch(function(){return y(Ot,!1)}):y(Ot,!1)}var Nn=qe(On);function Pn(e){e.stopPropagation(),Nn(e)}w(function(){var e=M(At);if(e){En(),e.requestFullscreen&&e.requestFullscreen().catch(function(){});var t=function(){document.fullscreenElement||y(Ot,!1)};return document.addEventListener(`fullscreenchange`,t),function(){document.removeEventListener(`fullscreenchange`,t),clearTimeout(Mt),document.fullscreenElement===e&&document.exitFullscreen().catch(function(){})}}});function Gn(e){M(me)&&M(ge)&&!M(ge).contains(e.target)&&!e.target.closest(`.vol-toggle-btn`)&&y(me,!1)}var Kn=z(function(){return Ye(Ge(Ke.unlocked),Ke.unlocked)}),qn=null;function Jn(e){return e.src?e.src.split(`/`).pop():``}function Yn(e){if(!e.dateAdded)return`Summer`;var t=new Date(e.dateAdded).getMonth();return t===11||t===0||t===1?`Winter`:t>=2&&t<=4?`Spring`:t>=5&&t<=7?`Summer`:`Fall`}var Z=z(function(){var e=M(Kn).filter(function(e){return!e.hidden});return M(R)===`artist`?e.sort(function(e,t){return e.artist.localeCompare(t.artist)}):M(R)===`album`?e.sort(function(e,t){return e.album.localeCompare(t.album)}):M(R)===`year`?e.sort(function(e,t){return(e.year||0)-(t.year||0)}):M(R)===`filename`?e.sort(function(e,t){return Jn(e).localeCompare(Jn(t))}):M(R)===`genre`?e.sort(function(e,t){return(e.genre||``).localeCompare(t.genre||``)}):M(R)===`season`&&e.sort(function(e,t){return Yn(e).localeCompare(Yn(t))}),e}),Q=z(function(){var e;return(e=M(Kn)[K.currentTrackIndex])==null?M(Kn)[0]:e});w(function(){var e=M(Kn);if(K.library!==e&&K.library.length!==0){var t=K.library[K.currentTrackIndex],n=t==null?void 0:t.id;K.init(e);var r=qn?e.findIndex(function(e){return e.id===qn}):-1,i=e.findIndex(function(e){return e.id===n});if(r!==-1)qn=null,K.loadTrack(r,!0);else if(i!==-1){K.currentTrackIndex=i;var a=e[i],o=a.src!==t.src||a.instrumental!==t.instrumental,s=K.masterTabId&&K.masterTabId!==K.tabId,l=!K.isPlaying||K.currentTime<c;o&&l&&!s&&K.loadTrack(i,K.isPlaying)}else K.pause(),K.loadTrack(0,!1)}});var Xn=U(0),Zn=U(0),Qn=U(0),$n=U(0),er=U(0),tr=U(0),nr=`This device is the remote: the sound is on the other one.`,rr=`Both players are in step.`,ir=`It stays on until you close this window, disconnect in Air Train, or nothing happens for 10 minutes.`,ar=`The tether dropped: a screen turned off, or the network changed. This player is on its own until the devices find each other again, which they do by themselves.`,or=U(!1),sr=z(function(){return q.holding?ar:`Tethered to ${q.peerName||`your other device`}. ${K.masterIsRemote?nr:rr} ${ir}`}),cr=U(null),lr=null;function ur(e,t){e.stopPropagation();var n=`${Ze()}/music/${t.id}`;navigator.clipboard.writeText(n).then(function(){y(cr,t.id,!0),lr&&clearTimeout(lr),lr=setTimeout(function(){y(cr,null)},2e3)}).catch(function(e){console.error(`Failed to copy share link:`,e)})}var dr=U(null);function fr(e){var t;return Fn(e,e.id===((t=K.library[K.currentTrackIndex])==null?void 0:t.id)?K.isInstrumental:K.userPrefersInstrumental)}function pr(e,t){return mr.apply(this,arguments)}function mr(){return mr=u(i().m(function e(t,n){var a,o,s,c,l,u;return i().w(function(e){for(;;)switch(e.p=e.n){case 0:if(t.stopPropagation(),a=fr(n).url,a&&!M(dr)){e.n=1;break}return e.a(2);case 1:return y(dr,n.id,!0),e.p=2,e.n=3,fetch(a,Ke.fetchOptionsFor(a));case 3:if(o=e.v,o.ok){e.n=4;break}throw Error(`Fetch failed with status ${o.status}`);case 4:return l=URL,e.n=5,o.blob();case 5:s=l.createObjectURL.call(l,e.v),c=document.createElement(`a`),c.href=s,c.download=decodeURIComponent(a.split(`/`).pop()||``)||`${n.id}.mp3`,document.body.appendChild(c),c.click(),c.remove(),setTimeout(function(){return URL.revokeObjectURL(s)},r),e.n=7;break;case 6:e.p=6,u=e.v,console.error(`Failed to download track:`,u);case 7:return e.p=7,y(dr,null),e.f(7);case 8:return e.a(2)}},e,null,[[2,6,7,8]])})),mr.apply(this,arguments)}le(function(){lr&&clearTimeout(lr)}),g(function(){Ke.revalidate(),K.init(M(Kn)),Je.refresh(),Y.refreshList();var e=We(k());if(k(null),e){var t=M(Kn).findIndex(function(t){return t.id===e});t===-1?qn=e:K.loadTrack(t,!0)}else if(!K.hasPickedRandomTrack){K.hasPickedRandomTrack=!0;var n=M(Kn).filter(function(e){return!e.hidden}),r=n[Math.floor(Math.random()*n.length)];K.loadTrack(M(Kn).indexOf(r),!1)}});var hr=U(null);function gr(){var e=document.querySelector(`.track-row[data-track-id="${M(hr)}"]`);e&&e.scrollIntoView({block:`nearest`,behavior:`smooth`})}function _r(e){y(hr,e.id,!0);var t=M(Kn).findIndex(function(t){return t.id===e.id});K.currentTrackIndex===t&&!K.fetchErrors[e.id]?K.togglePlay():K.loadTrack(t,!0)}function vr(){Nt?(clearTimeout(Nt),Nt=null,Dn()):Nt=setTimeout(function(){Nt=null,yr()},mt)}function yr(){y(Pt,gt),window.innerWidth<=xt?y(B,!0):(y(hr,M(Q).id,!0),se().then(gr))}function br(e){e.target.closest(`.scroll-container`)&&yr()}function xr(){var e=!K.isInstrumental;K.setCrossfade(e)||(l(Tr),M(Er)||(y(Er,!0),setTimeout(function(){y(Er,!1)},300)),M(Tr)===5?(Hr(),y(Dr,!0),setTimeout(function(){y(Dr,!1)},150)):M(Tr)===10?Hr(35):M(Tr)>5&&M(Tr)<10?Hr(8):M(Tr)>10&&Math.random()<.4&&Hr(3))}function Sr(e){return!e||isNaN(e)?`0:00`:`${Math.floor(e/60)}:${Math.floor(e%60).toString().padStart(2,`0`)}`}function Cr(e){En(),M(X)?e>0?J.next():J.previous():y(Dt,(M(Dt)+e+rt.length)%rt.length)}function wr(e){var t=document.activeElement;if(!t||t.tagName!==`INPUT`&&t.tagName!==`TEXTAREA`&&!t.isContentEditable){if(M(Ot)&&(e.key===`ArrowRight`||e.key===`ArrowLeft`))e.preventDefault(),Cr(e.key===`ArrowRight`?1:-1);else if(e.code===`Space`||e.key===` `)e.preventDefault(),K.togglePlay();else if(e.key===`ArrowDown`){if(M(Z).length>0){e.preventDefault();var n=M(Z).findIndex(function(e){return e.id===M(hr)});if(n===-1){var r=M(Kn)[K.currentTrackIndex];n=M(Z).findIndex(function(e){return e.id===(r==null?void 0:r.id)})}var i=(n+1)%M(Z).length;y(hr,M(Z)[i].id,!0),gr()}}else if(e.key===`ArrowUp`){if(M(Z).length>0){e.preventDefault();var a=M(Z).findIndex(function(e){return e.id===M(hr)});if(a===-1){var o=M(Kn)[K.currentTrackIndex];a=M(Z).findIndex(function(e){return e.id===(o==null?void 0:o.id)})}var s=(a-1+M(Z).length)%M(Z).length;y(hr,M(Z)[s].id,!0),gr()}}else if(e.key===`Enter`&&M(hr)){e.preventDefault();var c=M(Z).find(function(e){return e.id===M(hr)});c&&_r(c)}}}var $=U(null),Tr=U(0),Er=U(!1),Dr=U(!1),Or,kr,Ar,jr=[],Mr=[],Nr,Pr=U(!1);w(function(){return M($)&&Rr(),function(){var e;Nr&&cancelAnimationFrame(Nr),window.removeEventListener(`resize`,zr),(e=window.visualViewport)==null||e.removeEventListener(`resize`,zr),Ar&&(Ar.dispose(),Ar=null),Or=null,kr=null,jr=[],Mr=[]}});function Fr(){if(y(Tr,0),y(Pr,!1),Or){var e=o(jr),t;try{for(e.s();!(t=e.n()).done;){var n=t.value;Or.remove(n.mesh)}}catch(t){e.e(t)}finally{e.f()}var r=o(Mr),i;try{for(r.s();!(i=r.n()).done;){var a=i.value;Or.remove(a.mesh)}}catch(e){r.e(e)}finally{r.f()}}jr=[],Mr=[]}w(function(){K.currentTrackIndex,O(),Fr()});function Ir(){if(!M($))return{width:window.innerWidth,height:window.innerHeight};var e=M($).getBoundingClientRect();return{width:e.width||window.innerWidth,height:e.height||window.innerHeight}}function Lr(){var e=Ir(),t=e.width,n=e.height,r=document.querySelector(`.dj-fader-knob`);if(!r)return{x:t/2,y:n/2};var i=M($)?M($).getBoundingClientRect():{left:0,top:0},a=r.getBoundingClientRect();return{x:a.left+a.width/2-i.left,y:n-(a.top+a.height/2-i.top)}}function Rr(){var e;if(M($)){var t=Ir(),n=t.width,r=t.height;M($).width=n,M($).height=r,Or=new st,kr=new ot(0,n,r,0,-1,1),Ar=new he({canvas:M($),alpha:!0,antialias:!0}),Ar.setSize(n,r,!1),Ar.setPixelRatio(Math.min(window.devicePixelRatio,2)),window.addEventListener(`resize`,zr),(e=window.visualViewport)==null||e.addEventListener(`resize`,zr),Br()}}function zr(){if(M($)&&Ar&&kr){var e=Ir(),t=e.width,n=e.height;M($).width=t,M($).height=n,Ar.setSize(t,n,!1),kr.right=t,kr.top=n,kr.updateProjectionMatrix()}}function Br(){if(Nr=requestAnimationFrame(Br),Or&&kr&&Ar&&M($)){if(M(Tr)>=10&&(y(Pr,!0),Math.random()<.22)){var e=Lr();Vr(e.x,e.y)}for(var t=jr.length-1;t>=0;t--){var n=jr[t];n.x+=n.vx,n.y+=n.vy,n.vy+=n.ay,n.life-=n.decay,n.mesh.position.set(n.x,n.y,0),n.mesh.material.opacity=n.life,n.life<=0&&(Or.remove(n.mesh),n.mesh.geometry.dispose(),n.mesh.material.dispose(),jr.splice(t,1))}for(var r=Mr.length-1;r>=0;r--){var i=Mr[r];i.x+=i.vx,i.y+=i.vy,i.life-=i.decay;var a=i.startScale+(1-i.life)*88;i.mesh.scale.set(a,a,1),i.mesh.position.set(i.x,i.y,0),i.mesh.material.opacity=i.life*.16,i.life<=0&&(Or.remove(i.mesh),i.mesh.geometry.dispose(),i.mesh.material.dispose(),Mr.splice(r,1))}Ar.render(Or,kr)}}function Vr(e,t){if(Or){var n=new at(5,8),r=.85+Math.random()*.12,i=new lt({color:new ct(r,r,r*1.01),transparent:!0,opacity:.06,blending:1}),a=new ut(n,i);a.position.set(e,t,0),Or.add(a),Mr.push({mesh:a,x:e,y:t,vx:(Math.random()-.5)*.55+Math.sin(Date.now()*.001)*.22,vy:Math.random()*.7+1.25,startScale:1,life:1,decay:6e-4+Math.random()*4e-4})}}function Hr(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:25;if(Or&&M($))for(var t=Lr(),n=t.x,r=t.y,i=0;i<e;i++){var a=new at(1.3,4),o=new lt({color:new ct(Math.random()<.4?16711765:16755200),transparent:!0,opacity:1,blending:2}),s=new ut(a,o);s.position.set(n,r,0),Or.add(s);var c=Math.random()*Math.PI*2,l=Math.random()*4+2;jr.push({mesh:s,x:n,y:r,vx:Math.cos(c)*l,vy:Math.sin(c)*l,ay:-.15,life:1,decay:.02+Math.random()*.02})}}var Ur=xn();A(`keydown`,S,wr),A(`popstate`,S,wn),A(`click`,S,Gn);var Wr=L(Ur),Gr,Kr=L(Wr),qr=L(Kr),Jr=L(qr),Yr=L(Jr);Qe(Yr,{size:`panel`}),P(Jr);var Xr=x(Jr,2);Xr.textContent=`MUSIC`,P(qr);var Zr=x(qr,2),Qr=L(Zr);Le(Qr,{});var $r=x(Qr,2),ei=L($r);Pe(ei,{size:20}),P($r),P(Zr),P(Kr);var ti=x(Kr,2),ni=L(ti),ri=L(ni),ii,ai=L(ri),oi,si=L(ai),ci,li=L(si),ui=function(e){var t=Jt(),r=L(t),i=function(e){var t=a(),n=s(t);m(n,function(){return M(X)},function(e){var t=qt();ie(t,function(e){return y(kt,e)},function(){return M(kt)}),H(function(){return V(t,`data-engine`,M(X)?G:$e)}),C(e,t)}),C(e,t)};_(r,function(e){M(Ot)||e(i)});var o=x(r,2),c,l=I(o);ue(2),P(t),H(function(){c=b(o,1,`viz-label svelte-1o4jdf5`,null,c,{spinning:M(W)}),V(l,`src`,K.fetchErrors[M(Q).id]||!M(Q).cover?n:M(Q).cover),V(l,`alt`,M(Q).album)}),F(`click`,t,vr),A(`error`,l,E),de(l),C(e,t)},di=function(e){var t=a(),r=s(t),i=function(e){var t=Yt(),r=L(t),i,a=x(L(r),8),o=L(a),s;P(a),ue(2),P(r);var c=x(r,2),l;P(t),H(function(){i=b(r,1,`vinyl-record svelte-1o4jdf5`,null,i,{spinning:M(W)}),V(o,`src`,K.fetchErrors[M(Q).id]||!M(Q).cover?n:M(Q).cover),V(o,`alt`,M(Q).album),s=b(o,1,`record-art svelte-1o4jdf5`,null,s,{loaded:M(fe)}),l=b(c,1,`tonearm svelte-1o4jdf5`,null,l,{playing:M(W)})}),F(`click`,t,vr),A(`load`,o,function(){return y(fe,!0)}),A(`error`,o,E),de(o),C(e,t)},o=function(e){var t=z(function(){return K.duration>0?(1-K.currentTime/K.duration)*.45+.25:.48}),n=z(function(){return K.duration>0?K.currentTime/K.duration*.45+.25:.48}),r=Xt(),i=L(r),a=L(i),o=L(a),s=I(o,!0);ue(2),P(a);var c=x(a,2),l=L(c),u,d=x(l,2),f,p=x(d,2),m,h=x(p,2),g;P(c),P(i),P(r),H(function(){D(s,M(Q).title),u=b(l,1,`spindle-left bg-zinc-900 svelte-1o4jdf5`,null,u,{spinning:M(W)}),f=b(d,1,`tape-roll-left bg-amber-950/70 svelte-1o4jdf5`,null,f,{spinning:M(W)}),oe(d,`width: ${M(t)*46}px; height: ${M(t)*46}px;`),m=b(p,1,`spindle-right bg-zinc-900 svelte-1o4jdf5`,null,m,{spinning:M(W)}),g=b(h,1,`tape-roll-right bg-amber-950/70 svelte-1o4jdf5`,null,g,{spinning:M(W)}),oe(h,`width: ${M(n)*46}px; height: ${M(n)*46}px;`)}),F(`click`,r,vr),C(e,r)},c=function(e){var t=Zt(),n=L(t),r=x(L(n),4),i=x(L(r),4),a=L(i),o=I(a,!0),s=x(a,2),c=I(s,!0);P(i),P(r);var l=x(r,2),u=L(l),d,f=x(u,2),p=L(f),m;P(f),P(l);var h=x(l,2),g;P(n),P(t),H(function(){D(o,M(Q).title),D(c,M(Q).artist||`WEAREDOGS`),d=b(u,1,`floppy-shutter-slider bg-zinc-400 svelte-1o4jdf5`,null,d,{open:M(W)}),m=b(p,1,`floppy-magnetic-disc bg-zinc-900 svelte-1o4jdf5`,null,m,{spinning:M(W)}),g=b(h,1,`floppy-drive-led svelte-1o4jdf5`,null,g,{active:M(W)})}),F(`click`,t,vr),C(e,t)},l=function(e){var t=$t(),n=L(t),r=L(n),i,a=x(r,2),o=L(a),s=L(o),c,l=x(s,2),u;P(o);var d=x(o,2),f=L(d),p;P(d);var m=x(d,2);T(m,20,function(){return Array(10)},ne,function(e,t,n){var r=Qt(),i;H(function(e){return i=b(r,1,`comb-tooth svelte-1o4jdf5`,null,i,{vibrating:e})},[function(){return M(W)&&n%3==Math.floor(K.currentTime*4)%3}]),C(e,r)}),P(m),P(a),P(n),P(t),H(function(){i=b(r,1,`music-box-key svelte-1o4jdf5`,null,i,{spinning:M(W)}),c=b(s,1,`music-box-gear gear-1 svelte-1o4jdf5`,null,c,{spinning:M(W)}),u=b(l,1,`music-box-gear gear-2 svelte-1o4jdf5`,null,u,{spinning:M(W)}),p=b(f,1,`music-box-drum bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 svelte-1o4jdf5`,null,p,{spinning:M(W)})}),F(`click`,t,vr),C(e,t)};_(r,function(e){Te.musicDeckModel===`vinyl`?e(i):Te.musicDeckModel===`cassette`?e(o,1):Te.musicDeckModel===`floppy`?e(c,2):Te.musicDeckModel===`musicbox`&&e(l,3)}),C(e,t)};_(li,function(e){M(Bt)?e(ui):e(di,-1)}),P(si);var fi=x(si,2),pi=L(fi),mi=L(pi),hi=L(mi),gi=function(e){He(e,{size:12,class:`text-[#22c55e]`})},_i=function(e){Be(e,{size:12})};_(hi,function(e){M(cr)===M(Q).id?e(gi):e(_i,-1)}),P(mi);var vi=x(mi,2),yi=function(e){var t=en(),n,r=L(t);Ve(r,{size:12}),P(t),H(function(e,r){n=b(t,1,`player-download-btn svelte-1o4jdf5`,null,n,{downloading:M(dr)===M(Q).id}),V(t,`title`,e),V(t,`aria-label`,r)},[function(){return fr(M(Q)).label},function(){return fr(M(Q)).label}]),F(`click`,t,function(e){return pr(e,M(Q))}),C(e,t)};_(vi,function(e){(M(Q).instrumental||M(Q).src)&&e(yi)});var bi=x(vi,2),xi=L(bi);Se(xi,{size:15}),P(bi);var Si=x(bi,2),Ci=function(e){var t=nn(),n=L(t),r,i=L(n),a=function(e){Fe(e,{size:12})},o=function(e){Ie(e,{size:12})};_(i,function(e){q.holding?e(a):e(o,-1)}),P(n);var s=x(n,2),c=function(e){var t=tn(),n=I(t,!0);H(function(){return D(n,M(sr))}),C(e,t)};_(s,function(e){M(or)&&e(c)}),P(t),H(function(){r=b(n,1,`player-tether-btn svelte-1o4jdf5`,null,r,{"player-tether-lost":q.holding}),V(n,`title`,M(sr)),V(n,`aria-label`,M(sr)),V(n,`aria-expanded`,M(or))}),F(`click`,n,function(e){e.stopPropagation(),y(or,!M(or))}),A(`blur`,n,function(){return y(or,!1)}),C(e,t)};_(Si,function(e){(q.linked||q.holding)&&e(Ci)}),P(pi);var wi=x(pi,2),Ti,Ei=L(wi),Di,Oi=I(Ei,!0);P(wi);var ki=x(wi,2),Ai,ji=L(ki),Mi,Ni=I(ji,!0);P(ki);var Pi=x(ki,2),Fi,Ii=L(Pi),Li,Ri=I(Ii,!0);P(Pi),P(fi),P(ai);var zi=x(ai,2),Bi=L(zi);zn(Bi,{});var Vi=x(Bi,2),Hi=L(Vi),Ui=I(Hi,!0),Wi=x(Hi,2),Gi=L(Wi);T(Gi,21,function(){return M(Gt)},ne,function(e,t,n){var r=z(function(){return K.duration>0?K.currentTime/K.duration:0}),i=z(function(){return n/60}),a=rn(),o;H(function(){var e;o=b(a,1,`waveform-bar transition-colors duration-100 rounded-full svelte-1o4jdf5`,null,o,{active:M(i)<=M(r)}),oe(a,`height: ${(e=M(t))==null?``:e}%; width: 3px;`)}),C(e,a)}),P(Gi);var Ki=x(Gi,2);d(Ki),P(Wi);var qi=x(Wi,2),Ji=I(qi,!0);P(Vi);var Yi=x(Vi,2),Xi=L(Yi),Zi,Qi=L(Xi);je(Qi,{size:15}),P(Xi);var $i=x(Xi,2),ea=L($i);Ee(ea,{size:19}),P($i);var ta=x($i,2),na,ra=L(ta),ia=function(e){Ue(e,{size:22})},aa=function(e){var t=an();C(e,t)},oa=function(e){ye(e,{size:22,fill:`currentColor`})},sa=function(e){ve(e,{size:22,fill:`currentColor`})};_(ra,function(e){K.fetchErrors[M(Q).id]?e(ia):K.isLoading?e(aa,1):K.isPlaying?e(oa,2):e(sa,-1)}),P(ta);var ca=x(ta,2),la=L(ca);De(la,{size:19}),P(ca);var ua=x(ca,2),da,fa=L(ua),pa=function(e){An(e,{size:15})},ma=function(e){Cn(e,{size:15})},ha=function(e){jn(e,{size:15})};_(fa,function(e){K.repeatMode===2?e(pa):K.repeatMode===3?e(ma,1):e(ha,-1)}),P(ua),P(Yi);var ga=x(Yi,2),_a=L(ga),va,ya=L(_a),ba;kn(L(ya),{size:12}),ue(2),P(ya);var xa=x(ya,2),Sa=L(xa),Ca;P(xa);var wa=x(xa,2),Ta;Tn(L(wa),{size:12}),ue(2),P(wa),P(_a),P(ga);var Ea=x(ga,2),Da=L(Ea),Oa=function(e){var t=on(),n=L(t),r=L(n),i=function(e){ke(e,{size:12,class:`text-red-400`})},a=function(e){Oe(e,{size:12})};_(r,function(e){K.isMuted||K.volume===0?e(i):e(a,-1)}),P(n);var o=x(n,2);d(o);var s=x(o,2),c=I(s);P(t),ie(t,function(e){return y(ge,e)},function(){return M(ge)}),H(function(e){p(o,K.volume),D(c,`${e==null?``:e}%`)},[function(){return Math.round(K.volume*100)}]),F(`click`,n,function(){return K.toggleMute()}),F(`input`,o,function(e){return K.setVolume(parseFloat(e.target.value))}),C(e,t)};_(Da,function(e){M(me)&&e(Oa)});var ka=x(Da,2),Aa=function(e){var t=z(function(){return M(Ct)?`Visualizer: on`:`Visualizer: off`});Bn(e,{get on(){return M(Ct)},accent:!0,get label(){return M(t)},onclick:function(){return Vt(!M(Ct))},children:function(e,t){ze(e,{size:14})},$$slots:{default:!0}})};_(ka,function(e){it&&e(Aa)});var ja=x(ka,2),Ma=L(ja);Re(Ma,{size:14}),P(ja);var Na=x(ja,2),Pa=z(function(){return!Y.has(M(Q).id)}),Fa=z(function(){return Y.shown?Y.has(M(Q).id)?`Lyrics: on`:`Lyrics: on. This song has none yet.`:`Lyrics: off`});Bn(Na,{get on(){return Y.shown},accent:!0,get dim(){return M(Pa)},get label(){return M(Fa)},onclick:function(){return Y.setPrefs({shown:!Y.shown})},children:function(e,t){Mn(e,{size:14})},$$slots:{default:!0}});var Ia=x(Na,2),La=function(e){Hn(e,{})};_(Ia,function(e){q.linked&&e(La)});var Ra=x(Ia,2),za=L(Ra),Ba=L(za),Va=function(e){ke(e,{size:13,class:`text-red-400`})},Ha=function(e){Oe(e,{size:13})};_(Ba,function(e){K.isMuted||K.volume===0?e(Va):e(Ha,-1)}),P(za),P(Ra),P(Ea),P(zi),P(ri);var Ua=x(ri,2),Wa,Ga=L(Ua),Ka=x(L(Ga),2);P(Ga);var qa=x(Ga,2),Ja=L(qa),Ya=L(Ja),Xa,Za=L(Ya);Me(Za,{size:13});var Qa=x(Za,3),$a=I(Qa,!0);P(Ya);var eo=x(Ya,2),to=function(e){var t=cn(),n,r=L(t);ze(r,{size:13});var i=x(r,3),a=function(e){var t=sn(),n=I(t,!0);H(function(){return D(n,J.names.length)}),C(e,t)};_(i,function(e){J.names.length&&e(a)}),P(t),H(function(){n=b(t,1,`tl-tab svelte-1o4jdf5`,null,n,{"tl-tab-on":M(Pt)===_t}),V(t,`aria-selected`,M(Pt)===_t)}),F(`click`,t,function(){return y(Pt,_t)}),C(e,t)};_(eo,function(e){M(X)&&e(to)}),P(Ja);var no=x(Ja,2),ro=function(e){Vn(e,{class:`tl-sort-cycler`,get value(){return M(R)},onchange:function(e){return y(R,e,!0)}})};_(no,function(e){M(Pt)===gt&&e(ro)}),P(qa);var io=x(qa,2),ao=function(e){Ln(e,{})};_(io,function(e){M(Pt)===_t&&e(ao)});var oo=x(io,2),so;T(oo,21,function(){return M(Z)},ne,function(e,t,r){var i=hn(),a,o=L(i),s=L(o),c=function(e){var t=ln();C(e,t)},l=function(e){var t=un();t.textContent=r+1,C(e,t)};_(s,function(e){M(Q).id===M(t).id&&K.isPlaying?e(c):e(l,-1)}),P(o);var u=x(o,2),d=x(u,2),f=L(d),p=L(f),m,h=I(p,!0),g=x(p,2),v=function(e){var t=dn(),n=L(t);Ue(n,{size:10}),ue(),P(t),C(e,t)};_(g,function(e){K.fetchErrors[M(t).id]&&e(v)}),P(f);var ee=x(f,2),S=I(ee);P(d);var te=x(d,2),w=L(te),T=function(e){var n=mn(),r=L(n),i=function(e){var t=fn();F(`click`,t,function(e){e.stopPropagation(),y(Ht,!0)}),C(e,t)},a=function(e){var n=pn();H(function(){return V(n,`href`,M(t).attrib)}),F(`click`,n,function(e){return e.stopPropagation()}),C(e,n)};_(r,function(e){M(t).id===`arigato`?e(i):e(a,-1)}),P(n),C(e,n)};_(w,function(e){M(t).attrib&&e(T)});var ne=x(w,2),O=L(ne),re=function(e){He(e,{size:12,class:`text-[#22c55e]`})},ie=function(e){Be(e,{size:12})};_(O,function(e){M(cr)===M(t).id?e(re):e(ie,-1)}),P(ne);var k=x(ne,2),j=function(e){var n=en(),r,i=L(n);Ve(i,{size:12}),P(n),H(function(e,i){r=b(n,1,`tr-download-btn svelte-1o4jdf5`,null,r,{downloading:M(dr)===M(t).id}),V(n,`title`,e),V(n,`aria-label`,i)},[function(){return fr(M(t)).label},function(){return fr(M(t)).label}]),F(`click`,n,function(e){return pr(e,M(t))}),C(e,n)};_(k,function(e){(M(t).instrumental||M(t).src)&&e(j)}),P(te),P(i),H(function(e){var r,o;a=b(i,1,`track-row svelte-1o4jdf5`,null,a,{active:M(Q).id===M(t).id,"kb-focused":M(hr)===M(t).id,"fetch-error":K.fetchErrors[M(t).id]}),V(i,`data-track-id`,M(t).id),V(u,`src`,K.fetchErrors[M(t).id]||!M(t).cover?n:M(t).cover),V(u,`alt`,M(t).album),m=b(p,1,`tr-title svelte-1o4jdf5`,null,m,{"line-through":K.fetchErrors[M(t).id],"opacity-50":K.fetchErrors[M(t).id]}),D(h,M(t).title),D(S,`${(r=M(t).artist)==null?``:r} · ${(o=M(t).album)==null?``:o}${e==null?``:e}`)},[function(){return Wn(M(t))?` (${Wn(M(t))})`:``}]),F(`click`,i,function(){return _r(M(t))}),A(`error`,u,E),de(u),F(`click`,ne,function(e){return ur(e,M(t))}),C(e,i)}),P(oo),P(Ua),P(ni),P(ti),ue(2),P(Wr);var co=x(Wr,2),lo=function(e){var t=yn(),r,i=L(t),o=L(i),c=function(e){var t=a(),n=s(t);m(n,function(){return M(X)},function(e){var t=qt();ie(t,function(e){return y(kt,e)},function(){return M(kt)}),H(function(){return V(t,`data-engine`,M(X)?G:$e)}),C(e,t)}),C(e,t)},l=function(e){var t=gn();H(function(){return V(t,`src`,M(Q).cover||n)}),A(`error`,t,E),de(t),C(e,t)};_(o,function(e){M(Bt)?e(c):e(l,-1)}),zn(x(o,2),{variant:`stage`}),P(i);var u=x(i,2),d=L(u),f=z(function(){return Y.has(M(Q).id)});Un(d,{get hasLyrics(){return M(f)},onExit:On});var p=x(d,2),h=function(e){var t=vn();T(t,21,function(){return rt},ne,function(e,t,n){var r=_n(),i=I(r,!0);H(function(){b(r,1,`px-2 py-1 rounded text-[9px] font-bold transition-all uppercase tracking-wider font-mono 2xl:px-3 2xl:py-2 2xl:text-[13px]
                ${M(Dt)===n?`bg-white text-black`:`text-white/40 hover:text-white/80`}`,`svelte-1o4jdf5`),D(i,M(t).name)}),F(`click`,r,function(){return y(Dt,n,!0)}),C(e,r)}),P(t),C(e,t)};_(p,function(e){rt.length>1&&e(h)});var g=x(p,2),v=function(e){Rn(e,{})};_(g,function(e){M(X)&&e(v)}),P(u),P(t),ie(t,function(e){return y(At,e)},function(){return M(At)}),H(function(){return r=b(t,1,`visualizer-container fullscreen svelte-1o4jdf5`,null,r,{"stage-idle":M(jt)})}),F(`click`,t,Pn),F(`pointerdown`,t,En),F(`pointermove`,t,En),F(`click`,u,function(e){return e.stopPropagation()}),C(e,t)};_(co,function(e){M(Ot)&&e(lo)});var uo=x(co,2);ie(uo,function(e){return y($,e)},function(){return M($)});var fo=x(uo,2),po=function(e){var t=bn(),n=L(t),r=L(n),i=x(L(r),2),a=L(i);Pe(a,{size:16}),P(i),P(r);var o=x(r,2),s=L(o),c=L(s),l=L(c);Ne(l,{size:14}),ue(),P(c),P(s);var u=x(s,2);h(u,function(){return Wt(M(Ut).intro)},!0),P(u);var d=x(u,2),f=L(d);h(f,function(){return Wt(M(Ut).tos)},!0),P(f),P(d);var p=x(d,2);h(p,function(){return Wt(M(Ut).outro)},!0),P(p),P(o),P(n),P(t),F(`click`,t,function(){return y(Ht,!1)}),F(`click`,n,function(e){return e.stopPropagation()}),F(`click`,i,function(){return y(Ht,!1)}),v(3,t,function(){return vt},function(){return{duration:150}}),C(e,t)};_(fo,function(e){M(Ht)&&e(po)}),P(Ur),H(function(e,t,n){Gr=b(Wr,1,`mp-container svelte-1o4jdf5`,null,Gr,{closing:O(),"theme-inst":K.isInstrumental}),oe(Wr,e),ii=b(ri,1,`player-side svelte-1o4jdf5`,null,ii,{"tracklist-open":M(B)}),oi=b(ai,1,`player-top-block transition-all duration-300 ease-in-out svelte-1o4jdf5`,null,oi,{"opacity-0":M(B),"scale-95":M(B),"pointer-events-none":M(B)}),ci=b(si,1,`vinyl-wrapper relative overflow-hidden svelte-1o4jdf5`,null,ci,{"deck-glitch":M(_e)}),V(bi,`href`,be),V(bi,`title`,we),V(bi,`aria-label`,we),Ti=b(wi,1,`scroll-container svelte-1o4jdf5`,null,Ti,{overflowing:M(Zn)>M(Xn)}),oe(wi,`--scroll-dist: -${M(Zn)-M(Xn)}px`),Di=b(Ei,1,`track-title scroll-text svelte-1o4jdf5`,null,Di,{"animate-scroll":M(Zn)>M(Xn)}),D(Oi,M(Q).title),Ai=b(ki,1,`scroll-container svelte-1o4jdf5`,null,Ai,{overflowing:M($n)>M(Qn)}),oe(ki,`--scroll-dist: -${M($n)-M(Qn)}px`),Mi=b(ji,1,`track-artist scroll-text svelte-1o4jdf5`,null,Mi,{"animate-scroll":M($n)>M(Qn)}),D(Ni,M(Q).artist),Fi=b(Pi,1,`scroll-container svelte-1o4jdf5`,null,Fi,{overflowing:M(tr)>M(er)}),oe(Pi,`--scroll-dist: -${M(tr)-M(er)}px`),Li=b(Ii,1,`track-album scroll-text svelte-1o4jdf5`,null,Li,{"animate-scroll":M(tr)>M(er)}),D(Ri,M(Q).album),D(Ui,t),V(Ki,`max`,K.duration||100),p(Ki,K.currentTime),D(Ji,n),Zi=b(Xi,1,`ctrl ctrl-sm svelte-1o4jdf5`,null,Zi,{"active-ctrl":K.isShuffled}),na=b(ta,1,`ctrl ctrl-play svelte-1o4jdf5`,null,na,{"ctrl-error":K.fetchErrors[M(Q).id]}),V(ta,`aria-label`,K.isPlaying?`Pause`:`Play`),da=b(ua,1,`ctrl ctrl-sm svelte-1o4jdf5`,null,da,{"active-ctrl":K.repeatMode>0}),V(ua,`title`,K.repeatMode===1?`Repeat: all`:K.repeatMode===2?`Repeat: one`:K.repeatMode===3?`Stop after current track`:`Repeat: off`),va=b(_a,1,`dj-crossfader svelte-1o4jdf5`,null,va,{"fader-flash":M(Dr),"fader-fried":M(Tr)>=10}),ba=b(ya,1,`fader-label left-label flex items-center gap-1 svelte-1o4jdf5`,null,ba,{active:!K.isInstrumental}),Ca=b(Sa,1,`dj-fader-knob svelte-1o4jdf5`,null,Ca,{right:K.isInstrumental,"knob-jiggle":M(Er),fried:M(Tr)>=10}),Ta=b(wa,1,`fader-label right-label flex items-center gap-1 svelte-1o4jdf5`,null,Ta,{active:K.isInstrumental}),Wa=b(Ua,1,`tracklist-side svelte-1o4jdf5`,null,Wa,{"show-mobile":M(B)}),Xa=b(Ya,1,`tl-tab svelte-1o4jdf5`,null,Xa,{"tl-tab-on":M(Pt)===gt}),V(Ya,`aria-selected`,M(Pt)===gt),D($a,M(Z).length),so=b(oo,1,`tracklist scroll-y svelte-1o4jdf5`,null,so,{hidden:M(Pt)!==gt})},[function(){return Ce(Te.musicPalette)},function(){return Sr(K.currentTime)},function(){return Sr(K.duration)}]),F(`click`,Ur,N),F(`click`,Wr,function(e){return e.stopPropagation()}),F(`click`,Jr,function(){var e,t=[...arguments];(e=xe)==null||e.apply(this,t)}),F(`click`,$r,function(){var e,n=[...arguments];(e=t.onClose)==null||e.apply(this,n)}),F(`click`,fi,br),F(`click`,mi,function(e){return ur(e,M(Q))}),F(`click`,bi,function(e){return e.stopPropagation()}),pe(Ei,`clientWidth`,function(e){return y(Zn,e)}),pe(wi,`clientWidth`,function(e){return y(Xn,e)}),pe(ji,`clientWidth`,function(e){return y($n,e)}),pe(ki,`clientWidth`,function(e){return y(Qn,e)}),pe(Ii,`clientWidth`,function(e){return y(tr,e)}),pe(Pi,`clientWidth`,function(e){return y(er,e)}),F(`input`,Ki,function(e){K.seek(parseFloat(e.target.value))}),F(`change`,Ki,function(e){K.isPlaying||K.play(parseFloat(e.target.value))}),F(`click`,Xi,function(){return K.setShuffle(!K.isShuffled)}),F(`click`,$i,function(){return K.prevTrack()}),F(`click`,ta,function(){return K.togglePlay()}),F(`click`,ca,function(){return K.nextTrack()}),F(`click`,ua,function(){return K.cycleRepeat()}),F(`click`,_a,xr),F(`click`,ja,Dn),F(`click`,za,function(){y(me,!M(me))}),F(`click`,Ka,function(){y(B,!1)}),F(`click`,Ya,function(){return y(Pt,gt)}),v(1,ni,function(){return vt},function(){return{duration:120,delay:120}}),v(2,ni,function(){return vt},function(){return{duration:120}}),C(e,Ur),re()}return e(`default`,Gn),{setters:[function(e){a=e.$,s=e.At,c=e.B,l=e.Bt,d=e.C,p=e.D,m=e.G,h=e.H,g=e.J,_=e.K,v=e.L,y=e.Lt,b=e.M,x=e.Mt,ee=e.Nt,S=e.Ot,C=e.Q,te=e.Qt,w=e.Tt,T=e.U,E=e.V,ne=e.W,D=e.X,O=e.Y,re=e.Zt,ie=e._,k=e.a,A=e.at,j=e.c,M=e.dt,N=e.et,ae=e.ht,P=e.in,F=e.it,oe=e.j,I=e.jt,L=e.kt,se=e.mt,ce=e.o,R=e.on,le=e.q,z=e.qt,ue=e.rn,B=e.rt,de=e.st,fe=e.tt,pe=e.v,V=e.w,H=e.wt,me=e.x,U=e.zt},function(e){he=e.n},function(e){ge=e.n,_e=e.r,ve=e.t},function(e){ye=e._,be=e.c,xe=e.h,Se=e.l,Ce=e.m,we=e.s,Te=e.u},function(e){Ee=e.n,De=e.t},function(e){W=e.n,Oe=e.t},function(e){ke=e.t},function(e){Ae=e.n,je=e.t},function(e){G=e.r},function(e){Me=e.t},function(e){Ne=e.t},function(e){Pe=e.i,Fe=e.n,Ie=e.r,Le=e.t},function(e){Re=e.n,ze=e.t},function(e){Be=e.t},function(e){Ve=e.t},function(e){He=e.t},function(e){Ue=e.t},function(e){We=e.i,Ge=e.o,Ke=e.r,K=e.t},function(e){qe=e.t},function(e){Je=e.n,Ye=e.t},function(e){q=e.t,Xe=e.y},function(e){Ze=e.t},function(e){Qe=e.t},function(e){$e=e.i,et=e.n,tt=e.r,nt=e.t},function(e){rt=e.t},function(e){J=e.t},function(e){it=e.t},function(e){at=e.B,ot=e.Er,st=e.Qi,ct=e.U,lt=e.ar,ut=e.ir},function(e){Y=e.i,dt=e.n,ft=e.r,pt=e.t},function(e){mt=e.n},function(e){ht=e.t},function(e){gt=e.n,_t=e.t},function(e){vt=e.t}],execute:function(){yt=document.createElement(`style`),yt.textContent=`@-webkit-keyframes svelte-80frst-trophyFloat{0%{transform:translateY(0)scale(1)}to{transform:translateY(-3px)scale(1.04)}}@keyframes svelte-80frst-trophyFloat{0%{transform:translateY(0)scale(1)}to{transform:translateY(-3px)scale(1.04)}}@-webkit-keyframes svelte-80frst-pulseGlow{0%{box-shadow:0 0 4px rgba(239,68,68,.1)}to{box-shadow:0 0 12px rgba(239,68,68,.35)}}@keyframes svelte-80frst-pulseGlow{0%{box-shadow:0 0 4px rgba(239,68,68,.1)}to{box-shadow:0 0 12px rgba(239,68,68,.35)}}@-webkit-keyframes svelte-80frst-searchPulse{0%{border-color:rgba(var(--color-neon-gold,#e6b900), .4)}to{border-color:rgba(var(--color-neon-gold,#e6b900), .95)}}@keyframes svelte-80frst-searchPulse{0%{border-color:rgba(var(--color-neon-gold,#e6b900), .4)}to{border-color:rgba(var(--color-neon-gold,#e6b900), .95)}}@-webkit-keyframes svelte-80frst-flashGlow{0%,to{border-color:var(--border-light,rgba(255,255,255,.05));box-shadow:none}50%{border-color:rgba(var(--color-neon-red,#f34), .8);box-shadow:0 0 20px rgba(var(--color-neon-red,#f34), .35)}}@keyframes svelte-80frst-flashGlow{0%,to{border-color:var(--border-light,rgba(255,255,255,.05));box-shadow:none}50%{border-color:rgba(var(--color-neon-red,#f34), .8);box-shadow:0 0 20px rgba(var(--color-neon-red,#f34), .35)}}.filter-btn.svelte-80frst{letter-spacing:.06em;text-transform:uppercase;color:rgba(255,255,255,.7);border-radius:4px;align-items:center;gap:3px;padding:2px 7px;font-size:10px;font-weight:700;transition:background .15s,color .15s;display:flex}.filter-on.svelte-80frst{color:#fff;background:rgba(255,255,255,.08)}.heart-btn.svelte-80frst{color:rgba(255,255,255,.7);opacity:.45;flex-shrink:0;justify-content:center;align-items:center;width:34px;height:30px;transition:opacity .15s,color .15s,transform .15s;display:flex}.heart-btn.svelte-80frst:hover{opacity:1}.heart-btn.svelte-80frst:focus-visible{opacity:1}.heart-btn.svelte-80frst:active{transform:scale(.85)}.hearted.svelte-80frst{opacity:1;color:var(--color-neon-red,#f34)}.disliked.svelte-80frst{opacity:1;color:#fff}@media (min-width:1536px){.filter-btn.svelte-80frst{padding:4px 10px;font-size:13px}.heart-btn.svelte-80frst{width:48px;height:44px}}@-webkit-keyframes svelte-6h1e9g-trophyFloat{0%{transform:translateY(0)scale(1)}to{transform:translateY(-3px)scale(1.04)}}@keyframes svelte-6h1e9g-trophyFloat{0%{transform:translateY(0)scale(1)}to{transform:translateY(-3px)scale(1.04)}}@-webkit-keyframes svelte-6h1e9g-pulseGlow{0%{box-shadow:0 0 4px rgba(239,68,68,.1)}to{box-shadow:0 0 12px rgba(239,68,68,.35)}}@keyframes svelte-6h1e9g-pulseGlow{0%{box-shadow:0 0 4px rgba(239,68,68,.1)}to{box-shadow:0 0 12px rgba(239,68,68,.35)}}@-webkit-keyframes svelte-6h1e9g-searchPulse{0%{border-color:rgba(var(--color-neon-gold,#e6b900), .4)}to{border-color:rgba(var(--color-neon-gold,#e6b900), .95)}}@keyframes svelte-6h1e9g-searchPulse{0%{border-color:rgba(var(--color-neon-gold,#e6b900), .4)}to{border-color:rgba(var(--color-neon-gold,#e6b900), .95)}}@-webkit-keyframes svelte-6h1e9g-flashGlow{0%,to{border-color:var(--border-light,rgba(255,255,255,.05));box-shadow:none}50%{border-color:rgba(var(--color-neon-red,#f34), .8);box-shadow:0 0 20px rgba(var(--color-neon-red,#f34), .35)}}@keyframes svelte-6h1e9g-flashGlow{0%,to{border-color:var(--border-light,rgba(255,255,255,.05));box-shadow:none}50%{border-color:rgba(var(--color-neon-red,#f34), .8);box-shadow:0 0 20px rgba(var(--color-neon-red,#f34), .35)}}.deck-btn.svelte-6h1e9g{color:rgba(255,255,255,.7);border-radius:6px;flex-shrink:0;justify-content:center;align-items:center;width:30px;height:30px;transition:background .15s,color .15s,transform .15s;display:flex}.deck-btn.svelte-6h1e9g:hover{color:#fff;background:rgba(255,255,255,.08)}.deck-btn.svelte-6h1e9g:focus-visible{color:#fff;background:rgba(255,255,255,.08)}.deck-btn.svelte-6h1e9g:active{transform:scale(.88)}.deck-btn-on.svelte-6h1e9g{color:var(--color-neon-green,#00d75f)}.deck-hearted.svelte-6h1e9g{color:var(--color-neon-red,#f34)}.deck-timer-hand.svelte-6h1e9g{transform-box:view-box;transform-origin:12px 14px}.deck-timer-running.svelte-6h1e9g{-webkit-animation:.35s ease-out svelte-6h1e9g-deck-timer-kick;animation:.35s ease-out svelte-6h1e9g-deck-timer-kick}.deck-timer-running.svelte-6h1e9g .deck-timer-hand:where(.svelte-6h1e9g){-webkit-animation:svelte-6h1e9g-deck-timer-sweep var(--auto-ms) linear forwards;animation:svelte-6h1e9g-deck-timer-sweep var(--auto-ms) linear forwards}@-webkit-keyframes svelte-6h1e9g-deck-timer-sweep{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes svelte-6h1e9g-deck-timer-sweep{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@-webkit-keyframes svelte-6h1e9g-deck-timer-kick{0%{transform:scale(1.3)}to{transform:none}}@keyframes svelte-6h1e9g-deck-timer-kick{0%{transform:scale(1.3)}to{transform:none}}@media (prefers-reduced-motion:reduce){.deck-timer-running.svelte-6h1e9g{-webkit-animation:none;animation:none}.deck-timer-running.svelte-6h1e9g .deck-timer-hand:where(.svelte-6h1e9g){-webkit-animation:none;animation:none}}@media (min-width:1536px){.deck-btn.svelte-6h1e9g{width:44px;height:44px}}.lyric-line.svelte-4gkonh{white-space:nowrap;pointer-events:none;font-family:var(--lyric-font);-webkit-user-select:none;user-select:none;overflow:hidden}.lyric-row.svelte-4gkonh{transform:scale(var(--lyric-fit));display:inline-block}.lyric-word.svelte-4gkonh{opacity:0;margin-right:.3em;display:inline-block}.lyric-word.svelte-4gkonh.sung{opacity:1;-webkit-animation:.32s ease-out svelte-4gkonh-lyric-flash;animation:.32s ease-out svelte-4gkonh-lyric-flash}.lyric-slot.svelte-4gkonh{text-align:left;letter-spacing:.01em;width:100%;height:1.25rem;color:rgba(var(--mp-ink-rgb,255, 255, 255), .92);flex-shrink:0;font-size:.8125rem;font-weight:700;line-height:1.25rem}.lyric-slot.svelte-4gkonh .lyric-row:where(.svelte-4gkonh){transform-origin:0}.lyric-stage.svelte-4gkonh{z-index:15;text-align:center;font-size:calc(clamp(1rem, min(5.2vw, 12vh), 6rem) * var(--lyric-scale));font-size:calc(clamp(1rem, min(5.2cqw, 12cqh), 6rem) * var(--lyric-scale));color:rgb(var(--mp-ink-rgb,255, 255, 255));text-shadow:0 0 .5em rgba(0,0,0,.85),0 .06em .12em rgba(0,0,0,.9);font-weight:800;line-height:1.3;position:absolute;left:4%;right:4%}.lyric-stage.svelte-4gkonh .lyric-row:where(.svelte-4gkonh){transform-origin:50%}.lyric-stage.lyric-at-top.svelte-4gkonh{top:9%}.lyric-stage.lyric-at-middle.svelte-4gkonh{margin-top:-.65em;top:50%}.lyric-stage.lyric-at-bottom.svelte-4gkonh{bottom:16%}@-webkit-keyframes svelte-4gkonh-lyric-flash{0%{opacity:0;-webkit-filter:brightness(2.2);filter:brightness(2.2);transform:translateY(.18em)scale(1.18)}45%{opacity:1;-webkit-filter:brightness(1.8);filter:brightness(1.8)}to{opacity:1;-webkit-filter:none;filter:none;transform:none}}@keyframes svelte-4gkonh-lyric-flash{0%{opacity:0;-webkit-filter:brightness(2.2);filter:brightness(2.2);transform:translateY(.18em)scale(1.18)}45%{opacity:1;-webkit-filter:brightness(1.8);filter:brightness(1.8)}to{opacity:1;-webkit-filter:none;filter:none;transform:none}}@media (max-height:700px){.lyric-slot.svelte-4gkonh{height:.875rem;font-size:.75rem;line-height:.875rem}}@media (max-height:500px){.lyric-stage.lyric-at-bottom.svelte-4gkonh{bottom:26%}}@media (prefers-reduced-motion:reduce){.lyric-word.svelte-4gkonh.sung{-webkit-animation:none;animation:none}}.strike-toggle.svelte-btbnk2{color:rgba(255,255,255,.5);cursor:pointer;background:0 0;border:none;border-radius:50%;flex-shrink:0;justify-content:center;align-items:center;width:26px;height:26px;padding:0;transition:color .2s,opacity .2s,transform .15s cubic-bezier(.34,1.56,.64,1);display:flex;position:relative}.strike-toggle.svelte-btbnk2:hover{color:rgba(255,255,255,.9);transform:scale(1.1)}.strike-toggle.svelte-btbnk2:active{transform:scale(.88)}.is-accent.svelte-btbnk2,.is-accent.svelte-btbnk2:hover{color:rgb(var(--mp-accent-rgb,255, 255, 255))}.is-off.svelte-btbnk2{opacity:.7}.is-dim.svelte-btbnk2{opacity:.75}.strike.svelte-btbnk2{pointer-events:none;background:currentColor;border-radius:1px;width:22px;height:2px;margin:-1px 0 0 -11px;transition:transform .26s cubic-bezier(.34,1.56,.64,1);position:absolute;top:50%;left:50%;transform:rotate(-45deg)scaleX(0);box-shadow:0 0 0 1.5px rgba(5,5,8,.9)}.is-off.svelte-btbnk2 .strike:where(.svelte-btbnk2){transform:rotate(-45deg)scaleX(1)}@media (prefers-reduced-motion:reduce){.strike.svelte-btbnk2,.strike-toggle.svelte-btbnk2{transition:none}}@-webkit-keyframes svelte-1ly12po-trophyFloat{0%{transform:translateY(0)scale(1)}to{transform:translateY(-3px)scale(1.04)}}@keyframes svelte-1ly12po-trophyFloat{0%{transform:translateY(0)scale(1)}to{transform:translateY(-3px)scale(1.04)}}@-webkit-keyframes svelte-1ly12po-pulseGlow{0%{box-shadow:0 0 4px rgba(239,68,68,.1)}to{box-shadow:0 0 12px rgba(239,68,68,.35)}}@keyframes svelte-1ly12po-pulseGlow{0%{box-shadow:0 0 4px rgba(239,68,68,.1)}to{box-shadow:0 0 12px rgba(239,68,68,.35)}}@-webkit-keyframes svelte-1ly12po-searchPulse{0%{border-color:rgba(var(--color-neon-gold,#e6b900), .4)}to{border-color:rgba(var(--color-neon-gold,#e6b900), .95)}}@keyframes svelte-1ly12po-searchPulse{0%{border-color:rgba(var(--color-neon-gold,#e6b900), .4)}to{border-color:rgba(var(--color-neon-gold,#e6b900), .95)}}@-webkit-keyframes svelte-1ly12po-flashGlow{0%,to{border-color:var(--border-light,rgba(255,255,255,.05));box-shadow:none}50%{border-color:rgba(var(--color-neon-red,#f34), .8);box-shadow:0 0 20px rgba(var(--color-neon-red,#f34), .35)}}@keyframes svelte-1ly12po-flashGlow{0%,to{border-color:var(--border-light,rgba(255,255,255,.05));box-shadow:none}50%{border-color:rgba(var(--color-neon-red,#f34), .8);box-shadow:0 0 20px rgba(var(--color-neon-red,#f34), .35)}}.sort-cycler.svelte-1ly12po{min-width:40px;min-height:28px;font:inherit;letter-spacing:inherit;text-transform:inherit;white-space:nowrap;cursor:pointer;background:rgba(255,255,255,.06);border:1px solid;border-radius:6px;justify-content:center;align-items:center;gap:6px;padding:4px 10px;transition:color .2s,transform .15s cubic-bezier(.34,1.56,.64,1);display:flex}.sort-cycler.svelte-1ly12po:active{transform:scale(.88)}.sort-icon.svelte-1ly12po{-webkit-animation:.25s ease-out svelte-1ly12po-sort-swap;animation:.25s ease-out svelte-1ly12po-sort-swap;display:flex}.sort-name.svelte-1ly12po{-webkit-animation:.25s ease-out svelte-1ly12po-sort-name-in;animation:.25s ease-out svelte-1ly12po-sort-name-in}@-webkit-keyframes svelte-1ly12po-sort-name-in{0%{opacity:0}}@keyframes svelte-1ly12po-sort-name-in{0%{opacity:0}}.sort-default.svelte-1ly12po{color:rgba(255,255,255,.75)}.sort-artist.svelte-1ly12po{color:var(--color-neon-red,#f34)}.sort-album.svelte-1ly12po{color:var(--color-doc-sky,#38bdf8)}.sort-year.svelte-1ly12po{color:var(--color-neon-gold,#e6b900)}.sort-filename.svelte-1ly12po{color:var(--color-neon-green,#00d75f)}.sort-genre.svelte-1ly12po{color:rgba(180,85,255,.95)}.sort-season.svelte-1ly12po{color:var(--color-image-orange,#ff5e00)}@-webkit-keyframes svelte-1ly12po-sort-swap{0%{opacity:0;transform:rotate(-90deg)scale(.6)}to{opacity:1;transform:none}}@keyframes svelte-1ly12po-sort-swap{0%{opacity:0;transform:rotate(-90deg)scale(.6)}to{opacity:1;transform:none}}@media (prefers-reduced-motion:reduce){.sort-icon.svelte-1ly12po,.sort-name.svelte-1ly12po{-webkit-animation:none;animation:none}}.sound-switch.svelte-1vwnx9r{width:26px;height:26px;color:rgb(var(--mp-accent-rgb,255, 255, 255));cursor:pointer;background:0 0;border:none;border-radius:50%;flex-shrink:0;justify-content:center;align-items:center;padding:0;transition:transform .15s cubic-bezier(.34,1.56,.64,1);display:flex}.sound-switch.svelte-1vwnx9r:hover:not(:disabled){transform:scale(1.1)}.sound-switch.svelte-1vwnx9r:active:not(:disabled){transform:scale(.88)}.sound-switch.svelte-1vwnx9r:disabled{opacity:.35;cursor:not-allowed}.sound-icon.svelte-1vwnx9r{transition:transform .35s cubic-bezier(.34,1.56,.64,1);display:flex}.sound-away.svelte-1vwnx9r .sound-icon:where(.svelte-1vwnx9r){transform:scaleX(-1)}@media (prefers-reduced-motion:reduce){.sound-icon.svelte-1vwnx9r{transition:none}}@-webkit-keyframes svelte-chvcxl-trophyFloat{0%{transform:translateY(0)scale(1)}to{transform:translateY(-3px)scale(1.04)}}@keyframes svelte-chvcxl-trophyFloat{0%{transform:translateY(0)scale(1)}to{transform:translateY(-3px)scale(1.04)}}@-webkit-keyframes svelte-chvcxl-pulseGlow{0%{box-shadow:0 0 4px rgba(239,68,68,.1)}to{box-shadow:0 0 12px rgba(239,68,68,.35)}}@keyframes svelte-chvcxl-pulseGlow{0%{box-shadow:0 0 4px rgba(239,68,68,.1)}to{box-shadow:0 0 12px rgba(239,68,68,.35)}}@-webkit-keyframes svelte-chvcxl-searchPulse{0%{border-color:rgba(var(--color-neon-gold,#e6b900), .4)}to{border-color:rgba(var(--color-neon-gold,#e6b900), .95)}}@keyframes svelte-chvcxl-searchPulse{0%{border-color:rgba(var(--color-neon-gold,#e6b900), .4)}to{border-color:rgba(var(--color-neon-gold,#e6b900), .95)}}@-webkit-keyframes svelte-chvcxl-flashGlow{0%,to{border-color:var(--border-light,rgba(255,255,255,.05));box-shadow:none}50%{border-color:rgba(var(--color-neon-red,#f34), .8);box-shadow:0 0 20px rgba(var(--color-neon-red,#f34), .35)}}@keyframes svelte-chvcxl-flashGlow{0%,to{border-color:var(--border-light,rgba(255,255,255,.05));box-shadow:none}50%{border-color:rgba(var(--color-neon-red,#f34), .8);box-shadow:0 0 20px rgba(var(--color-neon-red,#f34), .35)}}div.svelte-chvcxl .stage-btn{color:rgba(255,255,255,.7);border-radius:6px;flex-shrink:0;justify-content:center;align-items:center;min-width:30px;height:30px;font-size:11px;font-weight:700;transition:background .15s,color .15s;display:flex}div.svelte-chvcxl .stage-btn:hover{color:#fff;background:rgba(255,255,255,.08)}div.svelte-chvcxl .stage-btn:focus-visible{color:#fff;background:rgba(255,255,255,.08)}.stage-btn-wide.svelte-chvcxl{min-width:52px;padding:0 8px}@media (min-width:1536px){div.svelte-chvcxl .stage-btn{min-width:44px;height:44px;font-size:14px}.stage-btn-wide.svelte-chvcxl{min-width:76px}}@-webkit-keyframes svelte-1o4jdf5-trophyFloat{0%{transform:translateY(0)scale(1)}to{transform:translateY(-3px)scale(1.04)}}@keyframes svelte-1o4jdf5-trophyFloat{0%{transform:translateY(0)scale(1)}to{transform:translateY(-3px)scale(1.04)}}@-webkit-keyframes svelte-1o4jdf5-pulseGlow{0%{box-shadow:0 0 4px rgba(239,68,68,.1)}to{box-shadow:0 0 12px rgba(239,68,68,.35)}}@keyframes svelte-1o4jdf5-pulseGlow{0%{box-shadow:0 0 4px rgba(239,68,68,.1)}to{box-shadow:0 0 12px rgba(239,68,68,.35)}}@-webkit-keyframes svelte-1o4jdf5-searchPulse{0%{border-color:rgba(var(--color-neon-gold,#e6b900), .4)}to{border-color:rgba(var(--color-neon-gold,#e6b900), .95)}}@keyframes svelte-1o4jdf5-searchPulse{0%{border-color:rgba(var(--color-neon-gold,#e6b900), .4)}to{border-color:rgba(var(--color-neon-gold,#e6b900), .95)}}@-webkit-keyframes svelte-1o4jdf5-flashGlow{0%,to{border-color:var(--border-light,rgba(255,255,255,.05));box-shadow:none}50%{border-color:rgba(var(--color-neon-red,#f34), .8);box-shadow:0 0 20px rgba(var(--color-neon-red,#f34), .35)}}@keyframes svelte-1o4jdf5-flashGlow{0%,to{border-color:var(--border-light,rgba(255,255,255,.05));box-shadow:none}50%{border-color:rgba(var(--color-neon-red,#f34), .8);box-shadow:0 0 20px rgba(var(--color-neon-red,#f34), .35)}}.mp-backdrop.svelte-1o4jdf5{z-index:1000;-webkit-backdrop-filter:blur(12px);background:rgba(0,0,0,.55);justify-content:center;align-items:center;display:flex;position:fixed;top:0;bottom:0;left:0;right:0}.mp-container.svelte-1o4jdf5{-webkit-backdrop-filter:blur(24px)saturate(180%);--mp-vox-rgb:230, 185, 0;--mp-ins-rgb:255, 236, 170;--mp-deep-rgb:255, 122, 0;--mp-ink-rgb:8, 8, 10;--mp-accent-rgb:var(--mp-vox-rgb);--glow-color:rgba(var(--mp-accent-rgb), .85);--glow-light:rgba(var(--mp-accent-rgb), .6);--badge-bg:rgba(var(--mp-accent-rgb), .13);--badge-border:rgba(var(--mp-accent-rgb), .28);--badge-text:rgba(var(--mp-accent-rgb), .9);--badge-bg-hover:rgba(var(--mp-accent-rgb), .22);--badge-border-hover:rgba(var(--mp-accent-rgb), .45);--active-row-bg:rgba(var(--mp-accent-rgb), .07);--active-btn-text:rgba(var(--mp-accent-rgb), .9);--active-title:rgba(var(--mp-accent-rgb), .95);--play-gradient-start:rgba(var(--mp-accent-rgb), .95);--play-gradient-end:rgba(var(--mp-deep-rgb), .95);--play-glow:rgba(var(--mp-accent-rgb), .4);--play-ink:rgb(var(--mp-ink-rgb));--progress-gradient-start:rgba(var(--mp-accent-rgb), .9);--progress-gradient-end:rgba(var(--mp-deep-rgb), .8);background:rgba(7,7,11,.94);border:1px solid rgba(255,255,255,.07);border-radius:22px;flex-direction:column;width:94vw;max-width:1080px;height:90vh;max-height:820px;-webkit-animation:.38s cubic-bezier(.16,1,.3,1) forwards svelte-1o4jdf5-mpIn;animation:.38s cubic-bezier(.16,1,.3,1) forwards svelte-1o4jdf5-mpIn;display:flex;overflow:hidden;box-shadow:0 40px 100px rgba(0,0,0,.9),inset 0 1px rgba(255,255,255,.06)}.mp-container.theme-inst.svelte-1o4jdf5{--mp-accent-rgb:var(--mp-ins-rgb)}.mp-container.closing.svelte-1o4jdf5{-webkit-animation:.3s cubic-bezier(.4,0,1,1) forwards svelte-1o4jdf5-mpOut;animation:.3s cubic-bezier(.4,0,1,1) forwards svelte-1o4jdf5-mpOut}@-webkit-keyframes svelte-1o4jdf5-mpIn{0%{opacity:0;transform:translateY(28px)scale(.97)}to{opacity:1;transform:none}}@keyframes svelte-1o4jdf5-mpIn{0%{opacity:0;transform:translateY(28px)scale(.97)}to{opacity:1;transform:none}}@-webkit-keyframes svelte-1o4jdf5-mpOut{0%{opacity:1;transform:none}to{opacity:0;transform:translateY(18px)scale(.97)}}@keyframes svelte-1o4jdf5-mpOut{0%{opacity:1;transform:none}to{opacity:0;transform:translateY(18px)scale(.97)}}.mp-body.svelte-1o4jdf5{flex:1;grid-template-rows:1fr;grid-template-columns:1fr;display:grid;overflow:hidden}.mp-body.svelte-1o4jdf5>:where(.svelte-1o4jdf5){grid-area:1/1;width:100%;min-width:0;height:100%;min-height:0}.songs-layout.svelte-1o4jdf5{height:100%;display:flex;overflow:hidden}.player-side.svelte-1o4jdf5{background:rgba(0,0,0,.12);border-right:1px solid rgba(255,255,255,.05);flex-direction:column;flex-shrink:0;align-items:center;gap:13px;width:320px;min-width:260px;padding:22px 18px 16px;display:flex;overflow-x:hidden;overflow-y:auto}.player-top-block.svelte-1o4jdf5{flex-direction:column;align-items:center;width:100%;min-width:0;display:flex}.vinyl-wrapper.svelte-1o4jdf5{flex-shrink:0;width:210px;height:210px;position:relative}.vinyl-record.svelte-1o4jdf5{background:repeating-radial-gradient(circle,rgba(255,255,255,.07) 0,rgba(255,255,255,.07) .6px,transparent .6px,transparent 2.4px),radial-gradient(circle,transparent 44%,#060607 44.4%,#060607 45.4%,transparent 45.8%,transparent 59%,#060607 59.4%,#060607 60.4%,transparent 60.8%,transparent 77%,#060607 77.4%,#060607 78.2%,transparent 78.6%),radial-gradient(circle,#060607 0%,#060607 24%,#19191c 25%,#19191c 95.5%,#060607 96.5%,#060607 100%);border-radius:50%;justify-content:center;align-items:center;width:210px;height:210px;-webkit-animation:2.6s linear infinite paused svelte-1o4jdf5-vspin;animation:2.6s linear infinite paused svelte-1o4jdf5-vspin;display:flex;position:relative;box-shadow:0 0 0 1px rgba(255,255,255,.06),0 10px 44px rgba(0,0,0,.9),inset 0 0 0 2px rgba(0,0,0,.6),inset 0 0 26px rgba(0,0,0,.55)}.vinyl-record.spinning.svelte-1o4jdf5{box-shadow:0 0 0 1px rgba(255,255,255,.06), 0 10px 44px rgba(0,0,0,.9), 0 0 46px -14px var(--glow-light,transparent), inset 0 0 0 2px rgba(0,0,0,.6), inset 0 0 26px rgba(0,0,0,.55);-webkit-animation-play-state:running;animation-play-state:running}.vinyl-record-clicker.svelte-1o4jdf5{position:relative}.vinyl-record-clicker.svelte-1o4jdf5:after{content:"";pointer-events:none;z-index:4;background:conic-gradient(from 28deg,transparent 0deg,rgba(255,255,255,.24) 16deg,transparent 40deg,transparent 180deg,rgba(255,255,255,.12) 198deg,transparent 222deg,transparent 360deg);border-radius:50%;position:absolute;top:0;bottom:0;left:0;right:0;-webkit-mask-image:radial-gradient(circle,transparent 24%,#000 25.5%,#000 96%,transparent 97%);mask-image:radial-gradient(circle,transparent 24%,#000 25.5%,#000 96%,transparent 97%)}@-webkit-keyframes svelte-1o4jdf5-vspin{to{transform:rotate(360deg)}}@keyframes svelte-1o4jdf5-vspin{to{transform:rotate(360deg)}}.vinyl-wrapper.deck-glitch.svelte-1o4jdf5>:where(.svelte-1o4jdf5){-webkit-animation:3.4s step-end infinite svelte-1o4jdf5-deck-glitch-jolt;animation:3.4s step-end infinite svelte-1o4jdf5-deck-glitch-jolt}.vinyl-wrapper.deck-glitch.svelte-1o4jdf5 .vinyl-record:where(.svelte-1o4jdf5){-webkit-animation:.42s steps(2,end) infinite svelte-1o4jdf5-deck-stuck;animation:.42s steps(2,end) infinite svelte-1o4jdf5-deck-stuck}.vinyl-wrapper.deck-glitch.svelte-1o4jdf5:after{content:"";z-index:20;pointer-events:none;mix-blend-mode:screen;background:linear-gradient(transparent 0,transparent 46%,rgba(255,40,80,.28) 46%,rgba(255,40,80,.28) 49%,transparent 49%),repeating-linear-gradient(0deg,rgba(0,0,0,.28) 0,rgba(0,0,0,.28) 1px,transparent 1px,transparent 3px);-webkit-animation:3.4s step-end infinite svelte-1o4jdf5-deck-glitch-tear;animation:3.4s step-end infinite svelte-1o4jdf5-deck-glitch-tear;position:absolute;top:0;bottom:0;left:0;right:0}@-webkit-keyframes svelte-1o4jdf5-deck-stuck{0%{transform:rotate(-3deg)}50%{transform:rotate(4deg)}}@keyframes svelte-1o4jdf5-deck-stuck{0%{transform:rotate(-3deg)}50%{transform:rotate(4deg)}}@-webkit-keyframes svelte-1o4jdf5-deck-glitch-jolt{0%{-webkit-filter:drop-shadow(5px 0 rgba(255,0,70,.75))drop-shadow(-5px 0 rgba(0,240,255,.75));filter:drop-shadow(5px 0 rgba(255,0,70,.75))drop-shadow(-5px 0 rgba(0,240,255,.75));transform:translate(-5px,1px)skew(-6deg)}3%{-webkit-filter:drop-shadow(-7px 0 rgba(255,0,70,.75))drop-shadow(7px 0 rgba(0,240,255,.75))saturate(2.2);filter:drop-shadow(-7px 0 rgba(255,0,70,.75))drop-shadow(7px 0 rgba(0,240,255,.75))saturate(2.2);transform:translate(6px,-2px)skew(9deg)}6%{-webkit-filter:drop-shadow(3px 0 rgba(255,0,70,.7))drop-shadow(-3px 0 rgba(0,240,255,.7))hue-rotate(80deg);filter:drop-shadow(3px 0 rgba(255,0,70,.7))drop-shadow(-3px 0 rgba(0,240,255,.7))hue-rotate(80deg);transform:translate(-3px,3px)scaleY(.94)}9%{-webkit-filter:drop-shadow(-4px 0 rgba(255,0,70,.75))drop-shadow(4px 0 rgba(0,240,255,.75))contrast(1.6);filter:drop-shadow(-4px 0 rgba(255,0,70,.75))drop-shadow(4px 0 rgba(0,240,255,.75))contrast(1.6);transform:translate(4px)skew(-12deg)}12%{-webkit-filter:drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6));filter:drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6));transform:translate(-2px,-1px)}15%{-webkit-filter:grayscale(.55)brightness(.8);filter:grayscale(.55)brightness(.8);transform:none}62%{-webkit-filter:drop-shadow(-4px 0 rgba(255,0,70,.7))drop-shadow(4px 0 rgba(0,240,255,.7));filter:drop-shadow(-4px 0 rgba(255,0,70,.7))drop-shadow(4px 0 rgba(0,240,255,.7));transform:translate(3px)skew(5deg)}65%{-webkit-filter:drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6))grayscale(.4);filter:drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6))grayscale(.4);transform:translate(-2px,1px)}68%,to{-webkit-filter:grayscale(.55)brightness(.8);filter:grayscale(.55)brightness(.8);transform:none}}@keyframes svelte-1o4jdf5-deck-glitch-jolt{0%{-webkit-filter:drop-shadow(5px 0 rgba(255,0,70,.75))drop-shadow(-5px 0 rgba(0,240,255,.75));filter:drop-shadow(5px 0 rgba(255,0,70,.75))drop-shadow(-5px 0 rgba(0,240,255,.75));transform:translate(-5px,1px)skew(-6deg)}3%{-webkit-filter:drop-shadow(-7px 0 rgba(255,0,70,.75))drop-shadow(7px 0 rgba(0,240,255,.75))saturate(2.2);filter:drop-shadow(-7px 0 rgba(255,0,70,.75))drop-shadow(7px 0 rgba(0,240,255,.75))saturate(2.2);transform:translate(6px,-2px)skew(9deg)}6%{-webkit-filter:drop-shadow(3px 0 rgba(255,0,70,.7))drop-shadow(-3px 0 rgba(0,240,255,.7))hue-rotate(80deg);filter:drop-shadow(3px 0 rgba(255,0,70,.7))drop-shadow(-3px 0 rgba(0,240,255,.7))hue-rotate(80deg);transform:translate(-3px,3px)scaleY(.94)}9%{-webkit-filter:drop-shadow(-4px 0 rgba(255,0,70,.75))drop-shadow(4px 0 rgba(0,240,255,.75))contrast(1.6);filter:drop-shadow(-4px 0 rgba(255,0,70,.75))drop-shadow(4px 0 rgba(0,240,255,.75))contrast(1.6);transform:translate(4px)skew(-12deg)}12%{-webkit-filter:drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6));filter:drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6));transform:translate(-2px,-1px)}15%{-webkit-filter:grayscale(.55)brightness(.8);filter:grayscale(.55)brightness(.8);transform:none}62%{-webkit-filter:drop-shadow(-4px 0 rgba(255,0,70,.7))drop-shadow(4px 0 rgba(0,240,255,.7));filter:drop-shadow(-4px 0 rgba(255,0,70,.7))drop-shadow(4px 0 rgba(0,240,255,.7));transform:translate(3px)skew(5deg)}65%{-webkit-filter:drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6))grayscale(.4);filter:drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6))grayscale(.4);transform:translate(-2px,1px)}68%,to{-webkit-filter:grayscale(.55)brightness(.8);filter:grayscale(.55)brightness(.8);transform:none}}@-webkit-keyframes svelte-1o4jdf5-deck-glitch-tear{0%{opacity:1;transform:translateY(-38%)}3%{transform:translateY(24%)}6%{transform:translateY(-12%)}9%{transform:translateY(36%)}12%{transform:translateY(4%)}15%{opacity:.25;transform:translateY(0)}62%{opacity:1;transform:translateY(-20%)}65%{transform:translateY(30%)}68%,to{opacity:.25;transform:translateY(0)}}@keyframes svelte-1o4jdf5-deck-glitch-tear{0%{opacity:1;transform:translateY(-38%)}3%{transform:translateY(24%)}6%{transform:translateY(-12%)}9%{transform:translateY(36%)}12%{transform:translateY(4%)}15%{opacity:.25;transform:translateY(0)}62%{opacity:1;transform:translateY(-20%)}65%{transform:translateY(30%)}68%,to{opacity:.25;transform:translateY(0)}}@media (prefers-reduced-motion:reduce){.vinyl-wrapper.deck-glitch.svelte-1o4jdf5:after{-webkit-animation:none;animation:none}.vinyl-wrapper.deck-glitch.svelte-1o4jdf5>:where(.svelte-1o4jdf5){-webkit-animation:none;animation:none}.vinyl-wrapper.deck-glitch.svelte-1o4jdf5 .vinyl-record:where(.svelte-1o4jdf5){-webkit-animation:none;animation:none}.vinyl-wrapper.deck-glitch.svelte-1o4jdf5>:where(.svelte-1o4jdf5){-webkit-filter:grayscale(.55)brightness(.8)drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6));filter:grayscale(.55)brightness(.8)drop-shadow(2px 0 rgba(255,0,70,.6))drop-shadow(-2px 0 rgba(0,240,255,.6))}}.groove.svelte-1o4jdf5{pointer-events:none;border:1px solid rgba(255,255,255,.03);border-radius:50%;position:absolute}.g1.svelte-1o4jdf5{width:72%;height:72%}.g2.svelte-1o4jdf5{width:56%;height:56%}.g3.svelte-1o4jdf5{border-color:rgba(255,255,255,.024);width:40%;height:40%}.g4.svelte-1o4jdf5{border-color:rgba(255,255,255,.02);width:86%;height:86%}.record-label.svelte-1o4jdf5{z-index:2;width:88px;height:88px;box-shadow:0 0 0 1px rgba(0,0,0,.8), 0 0 0 3px var(--badge-border,transparent), 0 2px 14px rgba(0,0,0,.65);background:#111;border:2px solid rgba(255,255,255,.1);border-radius:50%;position:relative;overflow:hidden}.record-art.svelte-1o4jdf5{object-fit:cover;opacity:0;width:100%;height:100%;transition:opacity .4s}.record-art.loaded.svelte-1o4jdf5{opacity:1}.spindle.svelte-1o4jdf5{z-index:3;background:radial-gradient(circle at 35% 30%,#fff 0%,#999 35%,#333 100%);border-radius:50%;width:7px;height:7px;position:absolute;box-shadow:0 0 0 1.5px rgba(0,0,0,.85),0 1px 4px rgba(0,0,0,.8)}.tonearm.svelte-1o4jdf5{transform-origin:top;z-index:5;background:linear-gradient(#888 0%,#555 60%,#333 100%);border-radius:2px;width:4px;height:96px;transition:transform .9s cubic-bezier(.4,0,.2,1);position:absolute;top:6px;right:-6px;transform:rotate(-15deg);box-shadow:0 2px 8px rgba(0,0,0,.5)}.tonearm.svelte-1o4jdf5:after{content:"";background:var(--glow-color,rgba(230,185,0,.85));width:8px;height:8px;box-shadow:0 0 8px var(--glow-light,rgba(230,185,0,.6));border-radius:50%;position:absolute;bottom:-4px;left:-2px}.tonearm.playing.svelte-1o4jdf5{transform:rotate(22deg)}.track-info.svelte-1o4jdf5{text-align:center;width:100%;min-width:0;overflow:hidden}.scroll-container.svelte-1o4jdf5{white-space:nowrap;text-align:center;width:100%;overflow:hidden}.scroll-container.overflowing.svelte-1o4jdf5{text-align:left}.scroll-text.svelte-1o4jdf5{white-space:nowrap;display:inline-block}.scroll-text.animate-scroll.svelte-1o4jdf5{-webkit-animation:8s linear infinite alternate svelte-1o4jdf5-scroll-text;animation:8s linear infinite alternate svelte-1o4jdf5-scroll-text}@-webkit-keyframes svelte-1o4jdf5-scroll-text{0%,15%{transform:translate(0)}85%,to{transform:translateX(var(--scroll-dist))}}@keyframes svelte-1o4jdf5-scroll-text{0%,15%{transform:translate(0)}85%,to{transform:translateX(var(--scroll-dist))}}.track-title.svelte-1o4jdf5{letter-spacing:.06em;color:rgba(255,255,255,.94);margin:0 0 4px;font-family:Outfit,Inter,sans-serif;font-size:1.2rem;font-weight:800}.track-artist.svelte-1o4jdf5{color:rgba(255,255,255,.55);margin:0 0 2px;font-family:Inter,sans-serif;font-size:.82rem}.track-album.svelte-1o4jdf5{color:rgba(255,255,255,.28);text-transform:uppercase;letter-spacing:.06em;margin:0;font-family:Outfit,monospace;font-size:.68rem}.tr-share-btn.svelte-1o4jdf5,.tr-download-btn.svelte-1o4jdf5{color:rgba(255,255,255,.45);cursor:pointer;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:6px;flex-shrink:0;justify-content:center;align-items:center;width:24px;height:24px;transition:all .2s;display:flex}.tr-share-btn.svelte-1o4jdf5:hover,.tr-download-btn.svelte-1o4jdf5:hover{color:rgba(255,255,255,.9);background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.16)}.player-share-btn.svelte-1o4jdf5,.player-download-btn.svelte-1o4jdf5,.player-tip-btn.svelte-1o4jdf5{background:var(--badge-bg,rgba(230,185,0,.13));border:1px solid var(--badge-border,rgba(230,185,0,.28));width:22px;height:22px;color:var(--badge-text,rgba(230,185,0,.9));cursor:pointer;border-radius:50%;flex-shrink:0;justify-content:center;align-items:center;transition:all .2s;display:flex}.player-share-btn.svelte-1o4jdf5:hover,.player-download-btn.svelte-1o4jdf5:hover,.player-tip-btn.svelte-1o4jdf5:hover{background:var(--badge-bg-hover,rgba(230,185,0,.22));color:rgb(var(--mp-accent-rgb,230, 185, 0));border-color:var(--badge-border-hover,rgba(230,185,0,.45))}.player-tip-btn.svelte-1o4jdf5{box-sizing:border-box;text-decoration:none}.player-tether.svelte-1o4jdf5{flex-shrink:0;display:flex;position:relative}.player-tether-btn.svelte-1o4jdf5{background:var(--bg-input,rgba(255,255,255,.04));border:1px solid var(--color-neon-green,#00d75f);width:22px;height:22px;color:var(--color-neon-green,#00d75f);cursor:pointer;border-radius:50%;flex-shrink:0;justify-content:center;align-items:center;display:flex}.player-tether-lost.svelte-1o4jdf5{border-color:var(--color-neon-gold,#e6b900);color:var(--color-neon-gold,#e6b900);-webkit-animation:1.6s ease-in-out infinite svelte-1o4jdf5-player-tether-wait;animation:1.6s ease-in-out infinite svelte-1o4jdf5-player-tether-wait}@-webkit-keyframes svelte-1o4jdf5-player-tether-wait{50%{opacity:.35}}@keyframes svelte-1o4jdf5-player-tether-wait{50%{opacity:.35}}.player-tether-hint.svelte-1o4jdf5{background:var(--bg-app,#050508);border:1px solid var(--color-neon-green,#00d75f);color:#fff;text-align:left;z-index:20;pointer-events:none;border-radius:8px;width:240px;max-width:70vw;padding:8px 10px;font-size:.7rem;line-height:1.4;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translate(-50%)}.tr-download-btn.downloading.svelte-1o4jdf5,.player-download-btn.downloading.svelte-1o4jdf5{pointer-events:none;-webkit-animation:1s ease-in-out infinite svelte-1o4jdf5-download-pulse;animation:1s ease-in-out infinite svelte-1o4jdf5-download-pulse}@-webkit-keyframes svelte-1o4jdf5-download-pulse{50%{opacity:.35}}@keyframes svelte-1o4jdf5-download-pulse{50%{opacity:.35}}.progress-row.svelte-1o4jdf5{align-items:center;gap:8px;width:100%;display:flex}.ptime.svelte-1o4jdf5{color:rgba(255,255,255,.3);text-align:center;min-width:28px;font-family:monospace;font-size:.65rem}.progress-wrap.svelte-1o4jdf5{cursor:pointer;background:rgba(255,255,255,.1);border-radius:3px;flex:1;height:3px;position:relative}.seek-input.svelte-1o4jdf5{opacity:0;cursor:pointer;width:100%;height:24px;margin:0;position:absolute;top:-10px;bottom:-10px;left:0;right:0}.controls-row.svelte-1o4jdf5{justify-content:center;align-items:center;gap:10px;width:100%;margin-top:10px;margin-bottom:6px;display:flex}.ctrl.svelte-1o4jdf5{color:rgba(255,255,255,.5);cursor:pointer;background:0 0;border:none;border-radius:50%;justify-content:center;align-items:center;padding:0;transition:all .15s;display:flex}.ctrl.svelte-1o4jdf5:hover{color:rgba(255,255,255,.9);transform:scale(1.1)}.ctrl.svelte-1o4jdf5:active{transform:scale(.95)}.ctrl-xs.svelte-1o4jdf5{width:26px;height:26px}.ctrl-sm.svelte-1o4jdf5{width:30px;height:30px}.ctrl-md.svelte-1o4jdf5{color:rgba(255,255,255,.72);width:38px;height:38px}.ctrl-md.svelte-1o4jdf5:hover{color:#fff}.ctrl-play.svelte-1o4jdf5{color:var(--play-ink,#fff);width:54px;height:54px;background:linear-gradient(135deg, var(--play-gradient-start,rgba(230,185,0,.92)) 0%, var(--play-gradient-end,rgba(255,122,0,.92)) 100%);box-shadow:0 4px 22px var(--play-glow,rgba(230,185,0,.5));border-radius:50%;transition:all .2s}.ctrl-play.ctrl-error.svelte-1o4jdf5{color:#050508;background:linear-gradient(135deg,#f59e0b 0%,#d97706 100%);box-shadow:0 4px 22px rgba(245,158,11,.5)}.ctrl-play.ctrl-error.svelte-1o4jdf5:hover{transform:scale(1.07);box-shadow:0 6px 30px rgba(245,158,11,.7)}.ctrl-play.svelte-1o4jdf5:active{transform:scale(.97)}.active-ctrl.svelte-1o4jdf5{color:var(--active-btn-text,rgba(230,185,0,.9))!important}.spin-ring.svelte-1o4jdf5{border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;width:18px;height:18px;-webkit-animation:.7s linear infinite svelte-1o4jdf5-sr;animation:.7s linear infinite svelte-1o4jdf5-sr}@-webkit-keyframes svelte-1o4jdf5-sr{to{transform:rotate(360deg)}}@keyframes svelte-1o4jdf5-sr{to{transform:rotate(360deg)}}.tracklist-side.svelte-1o4jdf5{flex-direction:column;flex:1;min-width:0;display:flex;overflow:hidden}.tl-header.svelte-1o4jdf5{letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.28);border-bottom:1px solid rgba(255,255,255,.05);flex-shrink:0;align-items:center;gap:7px;padding:14px 22px 10px;font-family:Outfit,monospace;font-size:.68rem;font-weight:700;display:flex}.tl-count.svelte-1o4jdf5{background:rgba(255,255,255,.07);border-radius:10px;margin-left:auto;padding:2px 8px;font-size:.62rem}.tracklist.svelte-1o4jdf5{flex:1;padding:6px 0;overflow-y:auto}.track-row.svelte-1o4jdf5{cursor:pointer;align-items:center;gap:12px;padding:10px 22px;transition:background .14s;display:flex;position:relative}.track-row.svelte-1o4jdf5:hover,.track-row.kb-focused.svelte-1o4jdf5{background:rgba(255,255,255,.04)}.track-row.kb-focused.svelte-1o4jdf5{outline-offset:-3px;outline:1px dashed rgba(255,255,255,.25)}.track-row.fetch-error.svelte-1o4jdf5{background:rgba(245,158,11,.03);border-left:3px solid rgba(245,158,11,.4)}.track-row.fetch-error.svelte-1o4jdf5:hover,.track-row.fetch-error.kb-focused.svelte-1o4jdf5{background:rgba(245,158,11,.06)}.track-row.fetch-error.svelte-1o4jdf5 .tr-title:where(.svelte-1o4jdf5){color:#f59e0b!important}.track-row.active.fetch-error.svelte-1o4jdf5{background:rgba(245,158,11,.1)!important}.track-row.active.fetch-error.svelte-1o4jdf5:before{background:#f59e0b!important}.track-row.active.svelte-1o4jdf5{background:var(--active-row-bg,rgba(230,185,0,.07))}.track-row.active.svelte-1o4jdf5:before{content:"";background:linear-gradient(to bottom, var(--glow-color,rgba(230,185,0,.9)), var(--progress-gradient-end,rgba(255,122,0,.7)));border-radius:0 2px 2px 0;width:3px;position:absolute;top:0;bottom:0;left:0}.tr-num.svelte-1o4jdf5{text-align:center;color:rgba(255,255,255,.28);flex-shrink:0;width:18px;font-family:monospace;font-size:.72rem}.tr-art.svelte-1o4jdf5{object-fit:cover;background:rgba(255,255,255,.05);border-radius:6px;flex-shrink:0;width:42px;height:42px}.tr-info.svelte-1o4jdf5{flex-direction:column;flex:1;gap:2px;min-width:0;display:flex}.tr-title.svelte-1o4jdf5{color:rgba(255,255,255,.86);white-space:nowrap;text-overflow:ellipsis;font-family:Outfit,Inter,sans-serif;font-size:.86rem;font-weight:600;overflow:hidden}.track-row.active.svelte-1o4jdf5 .tr-title:where(.svelte-1o4jdf5){color:var(--active-title,rgba(230,185,0,.95))}.tr-meta.svelte-1o4jdf5{color:rgba(255,255,255,.33);white-space:nowrap;text-overflow:ellipsis;font-family:Inter,sans-serif;font-size:.7rem;overflow:hidden}.inst-chip-link.svelte-1o4jdf5{letter-spacing:.1em;color:#22c55e;cursor:pointer;flex-shrink:0;padding:2px;font-size:.56rem;font-weight:700;text-decoration:underline;transition:color .2s}.inst-chip-link.svelte-1o4jdf5:hover{color:#16a34a}.eq.svelte-1o4jdf5{align-items:flex-end;gap:2px;height:15px;display:flex}.eq-b.svelte-1o4jdf5{background:var(--glow-color,rgba(230,185,0,.85));border-radius:1px;width:3px;-webkit-animation:.55s infinite alternate svelte-1o4jdf5-eq;animation:.55s infinite alternate svelte-1o4jdf5-eq}.eq-b.svelte-1o4jdf5:first-child{height:60%;-webkit-animation-delay:0s;animation-delay:0s}.eq-b.svelte-1o4jdf5:nth-child(2){height:100%;-webkit-animation-delay:.15s;animation-delay:.15s}.eq-b.svelte-1o4jdf5:nth-child(3){height:45%;-webkit-animation-delay:.3s;animation-delay:.3s}@-webkit-keyframes svelte-1o4jdf5-eq{0%{transform:scaleY(.35)}to{transform:scaleY(1)}}@keyframes svelte-1o4jdf5-eq{0%{transform:scaleY(.35)}to{transform:scaleY(1)}}.mp-footer.svelte-1o4jdf5{color:rgba(255,255,255,.22);letter-spacing:.06em;background:rgba(0,0,0,.22);border-top:1px solid rgba(255,255,255,.05);flex-shrink:0;justify-content:space-between;align-items:center;height:36px;padding:0 22px;font-family:monospace;font-size:.62rem;display:flex}.mp-status.svelte-1o4jdf5{align-items:center;gap:7px;display:flex}.mp-dot.svelte-1o4jdf5{background:#0f6;border-radius:50%;width:5px;height:5px;box-shadow:0 0 5px rgba(0,255,102,.55)}.scroll-y.svelte-1o4jdf5{overflow-x:hidden;overflow-y:auto}.scroll-y.svelte-1o4jdf5::-webkit-scrollbar{width:4px}.scroll-y.svelte-1o4jdf5::-webkit-scrollbar-track{background:0 0}.scroll-y.svelte-1o4jdf5::-webkit-scrollbar-thumb{background:rgba(255,255,255,.07);border-radius:2px}.scroll-y.svelte-1o4jdf5::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,.16)}@media (min-width:641px) and (max-height:780px){.mp-container.svelte-1o4jdf5{height:96vh}}@media (min-width:641px) and (max-height:760px){.player-side.svelte-1o4jdf5{gap:10px;padding:14px 16px 12px}.vinyl-wrapper.svelte-1o4jdf5,.vinyl-record.svelte-1o4jdf5{width:max(90px,min(96vh - 450px,210px));height:max(90px,min(96vh - 450px,210px))}.record-label.svelte-1o4jdf5{width:42%;height:42%}.tonearm.svelte-1o4jdf5{height:45%}.track-title.svelte-1o4jdf5{font-size:1.05rem}.track-artist.svelte-1o4jdf5,.track-album.svelte-1o4jdf5{font-size:.74rem}.progress-row.svelte-1o4jdf5 .progress-wrap:where(.svelte-1o4jdf5){height:28px}.ctrl-play.svelte-1o4jdf5{width:46px;height:46px}.player-controls-block.svelte-1o4jdf5>div:where(.svelte-1o4jdf5){margin-top:4px}}@media (min-width:641px) and (max-height:560px){.mp-footer.svelte-1o4jdf5{display:none}.player-side.svelte-1o4jdf5{gap:8px;padding:10px 14px 8px}.player-top-block.svelte-1o4jdf5{flex-direction:row;justify-content:center;align-items:center;gap:14px;width:100%}.vinyl-wrapper.svelte-1o4jdf5,.vinyl-record.svelte-1o4jdf5{width:96px;height:96px}.player-top-block.svelte-1o4jdf5 .track-info:where(.svelte-1o4jdf5){flex:1;min-width:0;margin-top:0}.progress-row.svelte-1o4jdf5 .progress-wrap:where(.svelte-1o4jdf5){height:28px}.controls-row.svelte-1o4jdf5{gap:8px;margin-bottom:0}.ctrl-play.svelte-1o4jdf5{width:42px;height:42px}.ctrl-md.svelte-1o4jdf5{width:32px;height:32px}.player-controls-block.svelte-1o4jdf5>div:where(.svelte-1o4jdf5){margin-top:4px}}@media (max-width:640px){.mp-container.svelte-1o4jdf5{border-radius:0;width:100vw;height:100%;max-height:100%}.songs-layout.svelte-1o4jdf5{flex-direction:column;position:relative;overflow:hidden}.player-side.svelte-1o4jdf5{width:100%;min-width:unset;border-bottom:none;border-right:none;flex-direction:column;flex-shrink:0;justify-content:space-between;gap:8px;height:95%;max-height:none;padding:12px 14px;display:flex;overflow:hidden}.player-top-block.svelte-1o4jdf5{flex-direction:column;justify-content:center;align-items:center;height:62%;transition:transform .3s cubic-bezier(.16,1,.3,1),opacity .3s;display:flex}.player-controls-block.svelte-1o4jdf5{flex-direction:column;flex-shrink:0;justify-content:flex-end;gap:8px;height:38%;display:flex}.vinyl-wrapper.svelte-1o4jdf5,.vinyl-record.svelte-1o4jdf5{width:130px;height:130px}.record-label.svelte-1o4jdf5{width:52px;height:52px}.tonearm.svelte-1o4jdf5{height:70px}.tracklist-side.svelte-1o4jdf5{z-index:20;opacity:0;pointer-events:none;background:rgba(7,7,11,.98);border-bottom:1px solid rgba(255,255,255,.08);transition:transform .3s cubic-bezier(.16,1,.3,1),opacity .3s;position:absolute;top:0;left:0;right:0;transform:translateY(-100%);box-shadow:0 10px 30px rgba(0,0,0,.5);width:100%!important;height:62%!important;display:flex!important}.tracklist-side.show-mobile.svelte-1o4jdf5{opacity:1;pointer-events:auto;transform:translateY(0)}.mobile-close-bar.svelte-1o4jdf5{display:flex!important}.track-title.svelte-1o4jdf5{font-size:1rem}.track-artist.svelte-1o4jdf5,.track-album.svelte-1o4jdf5{font-size:.72rem}.track-info.svelte-1o4jdf5 .scroll-container:where(.svelte-1o4jdf5){cursor:pointer}.ctrl-play.svelte-1o4jdf5{width:46px;height:46px}}@media (max-width:640px) and (max-height:700px){.controls-row.svelte-1o4jdf5{margin-top:0;margin-bottom:0}.player-top-block.svelte-1o4jdf5{flex:1;height:auto;min-height:0}.player-controls-block.svelte-1o4jdf5{height:auto}.vinyl-wrapper.svelte-1o4jdf5,.vinyl-record.svelte-1o4jdf5{width:104px;height:104px}.record-label.svelte-1o4jdf5{width:42px;height:42px}}.panel-header.svelte-1o4jdf5{background:rgba(0,0,0,.2);border-bottom:1px solid rgba(255,255,255,.06);justify-content:space-between;align-items:center;height:64px;padding:0 24px;display:flex}.brand.svelte-1o4jdf5{align-items:center;gap:12px;display:flex}.brand.svelte-1o4jdf5 h1:where(.svelte-1o4jdf5){letter-spacing:.05em;text-transform:uppercase;color:rgba(255,255,255,.95);margin:0;font-family:Outfit,Inter,sans-serif;font-size:1.1rem;font-weight:700}.close-btn.svelte-1o4jdf5{color:rgba(255,255,255,.5);cursor:pointer;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.06);border-radius:50%;justify-content:center;align-items:center;width:32px;height:32px;transition:all .2s;display:flex}.close-btn.svelte-1o4jdf5:hover{color:#fff;background:rgba(255,255,255,.15);transform:translate(-4px)}.dj-crossfader.svelte-1o4jdf5{cursor:pointer;box-sizing:border-box;-webkit-user-select:none;user-select:none;background:linear-gradient(#1e1e24 0%,#121215 100%);border:1px solid rgba(255,255,255,.08);border-radius:8px;justify-content:space-between;align-items:center;gap:12px;width:100%;height:34px;padding:0 16px;display:flex;position:relative;box-shadow:inset 0 1px rgba(255,255,255,.05),0 8px 24px rgba(0,0,0,.5)}.fader-label.svelte-1o4jdf5{letter-spacing:.05em;color:rgba(255,255,255,.2);font-family:monospace;font-size:.65rem;font-weight:800;transition:color .2s}.fader-label.left-label.active.svelte-1o4jdf5{color:rgb(var(--mp-vox-rgb));text-shadow:0 0 8px rgba(var(--mp-vox-rgb), .4)}.fader-label.right-label.active.svelte-1o4jdf5{color:rgb(var(--mp-ins-rgb));text-shadow:0 0 8px rgba(var(--mp-ins-rgb), .4)}.dj-fader-slot.svelte-1o4jdf5{background:#000;border:1px solid rgba(255,255,255,.06);border-radius:2px;flex:1;height:4px;position:relative}.dj-fader-knob.svelte-1o4jdf5{background:linear-gradient(135deg,#666 0%,#333 50%,#222 100%);border:1px solid rgba(255,255,255,.25);border-radius:3px;justify-content:center;align-items:center;width:24px;height:18px;transition:left .18s cubic-bezier(.25,.8,.25,1);display:flex;position:absolute;top:50%;left:0%;transform:translateY(-50%);box-shadow:0 4px 10px rgba(0,0,0,.8),inset 0 1px rgba(255,255,255,.15)}.dj-fader-knob.svelte-1o4jdf5:after{content:"";background:#fff;width:2px;height:100%;box-shadow:0 0 3px rgba(255,255,255,.8)}.dj-fader-knob.right.svelte-1o4jdf5{left:calc(100% - 24px)}.volume-popover.svelte-1o4jdf5{z-index:50;pointer-events:auto;-webkit-backdrop-filter:blur(8px);background:rgba(15,15,20,.95);border:1px solid rgba(255,255,255,.1);border-radius:20px;align-items:center;gap:8px;min-width:150px;padding:6px 12px;display:flex;position:absolute;bottom:38px;left:50%;transform:translate(-50%);box-shadow:0 10px 25px rgba(0,0,0,.6)}.vol-slider-pop.svelte-1o4jdf5{height:3px;accent-color:rgb(var(--mp-accent-rgb));cursor:pointer;background:rgba(255,255,255,.1);border-radius:2px;outline:none;flex:1}.visualizer-container.svelte-1o4jdf5{background:#050508;border:1px solid rgba(255,255,255,.08);border-radius:50%;flex-direction:column;width:100%;height:100%;transition:border-radius .3s cubic-bezier(.25,.8,.25,1);display:flex;position:relative;overflow:hidden}.visualizer-canvas.svelte-1o4jdf5{z-index:1;width:100%;height:100%;display:block;position:absolute;top:0;bottom:0;left:0;right:0}.visualizer-overlay.svelte-1o4jdf5{z-index:10;justify-content:center;align-items:center;gap:8px;display:flex;position:absolute;bottom:16px;left:16px;right:16px}.visualizer-container.fullscreen.svelte-1o4jdf5{z-index:2000;border:none;width:100vw;height:100vh;position:fixed;top:0;bottom:0;left:0;right:0;border-radius:0!important}.visualizer-overlay.svelte-1o4jdf5{transition:opacity .45s}.visualizer-container.stage-idle.svelte-1o4jdf5{cursor:none}.visualizer-container.stage-idle.svelte-1o4jdf5 .visualizer-overlay:where(.svelte-1o4jdf5){opacity:0;pointer-events:none}.stage-frame.svelte-1o4jdf5{position:absolute;top:0;bottom:0;left:0;right:0;overflow:hidden;container-type:size}.stage-cover.svelte-1o4jdf5{object-fit:cover;-webkit-filter:blur(28px)brightness(.5);filter:blur(28px)brightness(.5);width:100%;height:100%;position:absolute;top:0;bottom:0;left:0;right:0;transform:scale(1.15)}.viz-label.svelte-1o4jdf5{z-index:2;border:2px solid rgba(255,255,255,.14);border-radius:50%;width:24%;height:24%;margin:-12% 0 0 -12%;-webkit-animation:5s linear infinite paused svelte-1o4jdf5-viz-label-spin;animation:5s linear infinite paused svelte-1o4jdf5-viz-label-spin;position:absolute;top:50%;left:50%;overflow:hidden;box-shadow:0 0 0 1px rgba(0,0,0,.8),0 2px 14px rgba(0,0,0,.65)}.viz-label.spinning.svelte-1o4jdf5{-webkit-animation-play-state:running;animation-play-state:running}.viz-art.svelte-1o4jdf5{object-fit:cover;width:100%;height:100%;display:block}.viz-spindle.svelte-1o4jdf5{z-index:3;background:rgba(5,5,8,.92);border-radius:50%;width:7px;height:7px;margin:-3.5px 0 0 -3.5px;position:absolute;top:50%;left:50%;box-shadow:0 0 0 1px rgba(255,255,255,.28)}@-webkit-keyframes svelte-1o4jdf5-viz-label-spin{to{transform:rotate(360deg)}}@keyframes svelte-1o4jdf5-viz-label-spin{to{transform:rotate(360deg)}}.tl-tab.svelte-1o4jdf5{min-height:28px;font:inherit;letter-spacing:inherit;text-transform:inherit;color:rgba(255,255,255,.28);cursor:pointer;border-radius:6px;align-items:center;gap:6px;padding:4px 8px;transition:color .15s,background .15s;display:flex}.tl-tab.svelte-1o4jdf5:hover{color:rgba(255,255,255,.6)}.tl-tab-on.svelte-1o4jdf5,.tl-tab-on.svelte-1o4jdf5:hover{color:rgba(255,255,255,.85);background:rgba(255,255,255,.06)}.tl-tab.svelte-1o4jdf5 .tl-count:where(.svelte-1o4jdf5){margin-left:0}.tl-header.svelte-1o4jdf5 .tl-sort-cycler{position:absolute;top:calc(50% + 2px);left:50%;transform:translate(-50%,-50%)}.tl-header.svelte-1o4jdf5 .tl-sort-cycler:active{transform:translate(-50%,-50%)scale(.88)}@media (prefers-reduced-motion:reduce){.viz-label.svelte-1o4jdf5{-webkit-animation:none;animation:none}}@-webkit-keyframes svelte-1o4jdf5-knob-wiggle{0%,to{transform:translateY(-50%)scale(1)}20%,60%{transform:translate(-3.5px,-50%)rotate(-4deg)}40%,80%{transform:translate(3.5px,-50%)rotate(4deg)}}@keyframes svelte-1o4jdf5-knob-wiggle{0%,to{transform:translateY(-50%)scale(1)}20%,60%{transform:translate(-3.5px,-50%)rotate(-4deg)}40%,80%{transform:translate(3.5px,-50%)rotate(4deg)}}.knob-jiggle.svelte-1o4jdf5{-webkit-animation:.3s ease-in-out svelte-1o4jdf5-knob-wiggle;animation:.3s ease-in-out svelte-1o4jdf5-knob-wiggle}.dj-fader-knob.fried.svelte-1o4jdf5{background:linear-gradient(135deg,#2c2222 0%,#1a1212 50%,#0f0505 100%)!important;border-color:rgba(239,68,68,.35)!important;box-shadow:0 4px 10px rgba(0,0,0,.9),0 0 8px rgba(239,68,68,.25)!important}.dj-fader-knob.fried.svelte-1o4jdf5:after{-webkit-animation:.15s infinite alternate svelte-1o4jdf5-fader-flicker;animation:.15s infinite alternate svelte-1o4jdf5-fader-flicker;background:#ef4444!important;box-shadow:0 0 5px #ef4444!important}@-webkit-keyframes svelte-1o4jdf5-fader-flicker{0%{opacity:.35}to{opacity:1}}@keyframes svelte-1o4jdf5-fader-flicker{0%{opacity:.35}to{opacity:1}}.dj-crossfader.fader-flash.svelte-1o4jdf5{-webkit-animation:.15s ease-out svelte-1o4jdf5-fader-flash-anim;animation:.15s ease-out svelte-1o4jdf5-fader-flash-anim}@-webkit-keyframes svelte-1o4jdf5-fader-flash-anim{0%{background:#f05;border-color:#fff;box-shadow:0 0 25px rgba(255,0,85,.8)}to{background:linear-gradient(#1e1e24 0%,#121215 100%);border-color:rgba(255,255,255,.08)}}@keyframes svelte-1o4jdf5-fader-flash-anim{0%{background:#f05;border-color:#fff;box-shadow:0 0 25px rgba(255,0,85,.8)}to{background:linear-gradient(#1e1e24 0%,#121215 100%);border-color:rgba(255,255,255,.08)}}.dj-crossfader.fader-fried.svelte-1o4jdf5{border-color:rgba(239,68,68,.25)!important;box-shadow:inset 0 0 8px rgba(239,68,68,.08),0 8px 24px rgba(0,0,0,.5)!important}.fader-fx-canvas.svelte-1o4jdf5{width:100vw;height:100vh;pointer-events:none;z-index:99999;height:100dvh;position:fixed;top:0;left:0}.cassette-tape.svelte-1o4jdf5{box-sizing:border-box;background:linear-gradient(135deg,#1f1f23 0%,#0d0d0f 100%);border:3px solid #2d2d34;border-radius:10px;flex-direction:column;justify-content:space-between;align-items:center;width:200px;height:125px;padding:10px;display:flex;position:relative;box-shadow:0 8px 24px rgba(0,0,0,.6)}@media (min-width:640px){.cassette-tape.svelte-1o4jdf5{border-width:4px;width:240px;height:150px;padding:12px}}.cassette-label.svelte-1o4jdf5{color:#fff;box-sizing:border-box;text-transform:uppercase;border-radius:4px;flex-direction:column;justify-content:center;align-items:center;width:100%;height:38px;padding:2px;font-family:monospace;font-weight:700;display:flex;box-shadow:inset 0 1px rgba(255,255,255,.1)}@media (min-width:640px){.cassette-label.svelte-1o4jdf5{height:46px}}.cassette-track-title.svelte-1o4jdf5{letter-spacing:.05em;white-space:nowrap;text-overflow:ellipsis;max-width:90%;font-size:9px;overflow:hidden}@media (min-width:640px){.cassette-track-title.svelte-1o4jdf5{font-size:11px}}.cassette-brand.svelte-1o4jdf5{opacity:.8;letter-spacing:.1em;margin-top:1px;font-size:7px}@media (min-width:640px){.cassette-brand.svelte-1o4jdf5{margin-top:2px;font-size:8px}}.cassette-window.svelte-1o4jdf5{border:2px solid #3f3f46;border-radius:5px;justify-content:space-around;align-items:center;width:110px;height:40px;margin-top:6px;display:flex;position:relative;overflow:hidden}@media (min-width:640px){.cassette-window.svelte-1o4jdf5{width:130px;height:48px;margin-top:8px}}.spindle-left.svelte-1o4jdf5,.spindle-right.svelte-1o4jdf5{box-sizing:border-box;z-index:5;border:3px dashed #71717a;border-radius:50%;width:18px;height:18px}@media (min-width:640px){.spindle-left.svelte-1o4jdf5,.spindle-right.svelte-1o4jdf5{border-width:4px;width:22px;height:22px}}.spindle-left.spinning.svelte-1o4jdf5,.spindle-right.spinning.svelte-1o4jdf5{-webkit-animation:4s linear infinite svelte-1o4jdf5-rotate-spindle;animation:4s linear infinite svelte-1o4jdf5-rotate-spindle}.tape-roll-left.svelte-1o4jdf5,.tape-roll-right.svelte-1o4jdf5{z-index:1;opacity:.85;border-radius:50%;position:absolute;top:50%;transform:translateY(-50%)}.tape-roll-left.spinning.svelte-1o4jdf5,.tape-roll-right.spinning.svelte-1o4jdf5{-webkit-animation:6s linear infinite svelte-1o4jdf5-rotate-spindle;animation:6s linear infinite svelte-1o4jdf5-rotate-spindle}.tape-roll-left.svelte-1o4jdf5{left:12px;transform:translateY(-50%)}@media (min-width:640px){.tape-roll-left.svelte-1o4jdf5{left:16px}}.tape-roll-right.svelte-1o4jdf5{right:12px;transform:translateY(-50%)}@media (min-width:640px){.tape-roll-right.svelte-1o4jdf5{right:16px}}@-webkit-keyframes svelte-1o4jdf5-rotate-spindle{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes svelte-1o4jdf5-rotate-spindle{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.waveform-slider-wrap.svelte-1o4jdf5{background:rgba(0,0,0,.45);border:1px solid rgba(255,255,255,.1);border-radius:6px;height:36px;transition:border-color .2s,background .2s}.waveform-slider-wrap.svelte-1o4jdf5 .seek-input:where(.svelte-1o4jdf5){margin:0;height:100%!important;top:0!important;bottom:0!important;left:0!important;right:0!important}.waveform-slider-wrap.svelte-1o4jdf5:hover{background:rgba(0,0,0,.55);border-color:rgba(255,255,255,.2)}.waveform-slider-wrap.svelte-1o4jdf5:hover .waveform-bar:where(.svelte-1o4jdf5):not(.active){background-color:rgba(255,255,255,.22)}.waveform-slider-wrap.svelte-1o4jdf5:hover .waveform-bar.active:where(.svelte-1o4jdf5){box-shadow:0 0 8px rgba(0,240,255,.6)}.waveform-bar.svelte-1o4jdf5{background-color:rgba(255,255,255,.12);border-radius:9999px;transition:background-color .2s,background .2s,box-shadow .2s}.waveform-bar.active.svelte-1o4jdf5{background:linear-gradient(#ff007f 0%,#00f0ff 100%);box-shadow:0 0 4px rgba(0,240,255,.4)}.floppy-disk.svelte-1o4jdf5{box-sizing:border-box;-webkit-clip-path:polygon(0 0,88% 0,100% 12%,100% 100%,0 100%);clip-path:polygon(0 0,88% 0,100% 12%,100% 100%,0 100%);background:linear-gradient(135deg,#1e293b 0%,#0f172a 100%);border:3px solid #334155;border-radius:8px;flex-direction:column;justify-content:space-between;width:160px;height:160px;padding:8px;display:flex;position:relative;box-shadow:0 8px 24px rgba(0,0,0,.65)}@media (min-width:640px){.floppy-disk.svelte-1o4jdf5{border-width:4px;width:190px;height:190px;padding:10px}}.floppy-corner.svelte-1o4jdf5{z-index:10;background:0 0;width:20px;height:20px;position:absolute;top:0;right:0}.floppy-write-protect.svelte-1o4jdf5{background:#020617;border:1px solid #334155;border-radius:1px;width:10px;height:10px;position:absolute;bottom:8px;left:8px}@media (min-width:640px){.floppy-write-protect.svelte-1o4jdf5{width:12px;height:12px;bottom:10px;left:10px}}.floppy-label.svelte-1o4jdf5{border-radius:4px;flex-direction:column;width:100%;height:65px;display:flex;position:relative;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,.3)}@media (min-width:640px){.floppy-label.svelte-1o4jdf5{height:80px}}.floppy-label-stripe.svelte-1o4jdf5{width:100%;height:6px}.floppy-label-stripe-blue.svelte-1o4jdf5{width:100%;height:3px}.floppy-label-content.svelte-1o4jdf5{background:#f8fafc;flex-direction:column;flex-grow:1;justify-content:center;align-items:center;padding:4px;display:flex}.floppy-song.svelte-1o4jdf5{color:#0f172a;text-align:center;text-transform:uppercase;width:90%;font-size:8px;font-weight:800}@media (min-width:640px){.floppy-song.svelte-1o4jdf5{font-size:10px}}.floppy-artist.svelte-1o4jdf5{color:#475569;text-align:center;text-transform:uppercase;width:90%;margin-top:1px;font-size:7px}@media (min-width:640px){.floppy-artist.svelte-1o4jdf5{margin-top:2px;font-size:8px}}.floppy-shutter-door.svelte-1o4jdf5{border:1px solid #1e293b;border-radius:3px;width:60px;height:40px;position:absolute;bottom:8px;left:50%;overflow:hidden;transform:translate(-50%)}@media (min-width:640px){.floppy-shutter-door.svelte-1o4jdf5{width:72px;height:48px;bottom:10px}}.floppy-shutter-slider.svelte-1o4jdf5{z-index:3;background:linear-gradient(90deg,#64748b 0%,#cbd5e1 50%,#64748b 100%);width:100%;height:100%;transition:transform .4s cubic-bezier(.16,1,.3,1);position:absolute;top:0;left:0}.floppy-shutter-slider.open.svelte-1o4jdf5{transform:translate(32px)}@media (min-width:640px){.floppy-shutter-slider.open.svelte-1o4jdf5{transform:translate(38px)}}.floppy-shutter-opening.svelte-1o4jdf5{z-index:1;border-radius:2px;justify-content:center;align-items:center;width:24px;height:32px;display:flex;position:absolute;top:4px;left:8px;overflow:hidden}@media (min-width:640px){.floppy-shutter-opening.svelte-1o4jdf5{width:28px;height:38px;top:5px;left:10px}}.floppy-magnetic-disc.svelte-1o4jdf5{border:2px dashed #475569;border-radius:50%;width:20px;height:20px}.floppy-magnetic-disc.spinning.svelte-1o4jdf5{-webkit-animation:2s linear infinite svelte-1o4jdf5-floppy-spin;animation:2s linear infinite svelte-1o4jdf5-floppy-spin}@media (min-width:640px){.floppy-magnetic-disc.svelte-1o4jdf5{width:24px;height:24px}}.floppy-drive-led.svelte-1o4jdf5{background:#dc2626;border-radius:50%;width:6px;height:6px;position:absolute;bottom:8px;right:8px;box-shadow:0 0 3px #dc2626}.floppy-drive-led.active.svelte-1o4jdf5{-webkit-animation:.4s ease-in-out infinite alternate svelte-1o4jdf5-floppy-led-blink;animation:.4s ease-in-out infinite alternate svelte-1o4jdf5-floppy-led-blink}@media (min-width:640px){.floppy-drive-led.svelte-1o4jdf5{width:7px;height:7px;bottom:10px;right:10px}}.music-box.svelte-1o4jdf5{box-sizing:border-box;background:linear-gradient(135deg,#78350f 0%,#451a03 100%);border:3px solid #d97706;border-radius:10px;justify-content:center;align-items:center;width:160px;height:110px;padding:6px;display:flex;position:relative;box-shadow:0 8px 24px rgba(0,0,0,.7)}@media (min-width:640px){.music-box.svelte-1o4jdf5{border-width:4px;width:190px;height:130px;padding:8px}}.music-box-key.svelte-1o4jdf5{z-index:-1;transform-origin:100%;align-items:center;width:15px;height:26px;display:flex;position:absolute;top:calc(50% - 13px);left:-18px}.music-box-key.svelte-1o4jdf5:before{content:"";border:2px .5 solid #f59e0b;background:0 0;border-radius:50%;width:12px;height:12px;position:absolute;left:-6px;box-shadow:0 0 4px rgba(245,158,11,.4)}.music-box-key.svelte-1o4jdf5:after{content:"";background:#b45309;width:12px;height:3px;position:absolute;right:0}.music-box-key.spinning.svelte-1o4jdf5{-webkit-animation:3s linear infinite svelte-1o4jdf5-key-spin;animation:3s linear infinite svelte-1o4jdf5-key-spin}@media (min-width:640px){.music-box-key.svelte-1o4jdf5{width:18px;height:30px;top:calc(50% - 15px);left:-22px}.music-box-key.svelte-1o4jdf5:before{border-width:3px;width:14px;height:14px;left:-8px}.music-box-key.svelte-1o4jdf5:after{width:14px;height:4px}}.music-box-interior.svelte-1o4jdf5{box-sizing:border-box;background:rgba(0,0,0,.55);border-radius:6px;flex-direction:column;justify-content:space-between;width:100%;height:100%;padding:6px;display:flex;position:relative;overflow:hidden}.music-box-gears.svelte-1o4jdf5{width:40px;height:40px;position:absolute;top:6px;left:6px}.music-box-gear.svelte-1o4jdf5{background:0 0;border:2px dashed #d97706;border-radius:50%;position:absolute}.music-box-gear.gear-1.svelte-1o4jdf5{width:22px;height:22px;top:2px;left:2px}.music-box-gear.gear-1.spinning.svelte-1o4jdf5{-webkit-animation:5s linear infinite svelte-1o4jdf5-gear-rotate;animation:5s linear infinite svelte-1o4jdf5-gear-rotate}.music-box-gear.gear-2.svelte-1o4jdf5{width:14px;height:14px;top:16px;left:18px}.music-box-gear.gear-2.spinning.svelte-1o4jdf5{-webkit-animation:4.2s linear infinite svelte-1o4jdf5-gear-rotate-reverse;animation:4.2s linear infinite svelte-1o4jdf5-gear-rotate-reverse}@media (min-width:640px){.music-box-gear.gear-1.svelte-1o4jdf5{width:26px;height:26px}.music-box-gear.gear-2.svelte-1o4jdf5{width:18px;height:18px;top:18px;left:22px}}.music-box-drum-wrap.svelte-1o4jdf5{align-items:center;width:70px;height:32px;display:flex;position:absolute;top:50%;right:14px;transform:translateY(-50%)}@media (min-width:640px){.music-box-drum-wrap.svelte-1o4jdf5{width:90px;height:38px;right:18px}}.music-box-drum.svelte-1o4jdf5{background:linear-gradient(#d97706 0%,#b45309 50%,#78350f 100%);border:1px solid #d97706;border-radius:6px;width:100%;height:12px;position:relative;overflow:hidden}.music-box-drum.svelte-1o4jdf5:after{content:"";background:repeating-linear-gradient(90deg,transparent,transparent 12px,#fef08a 14px,#f59e0b 15px,transparent 17px);width:200%;height:100%;position:absolute;top:0;left:-100%}@media (min-width:640px){.music-box-drum.svelte-1o4jdf5:after{background:repeating-linear-gradient(90deg,transparent,transparent 15px,#fef08a 17px,#f59e0b 18px,transparent 20px)}}.music-box-drum.spinning.svelte-1o4jdf5:after{-webkit-animation:2.2s linear infinite svelte-1o4jdf5-drum-roll;animation:2.2s linear infinite svelte-1o4jdf5-drum-roll}@media (min-width:640px){.music-box-drum.svelte-1o4jdf5{border-radius:8px;height:16px}}.music-box-comb.svelte-1o4jdf5{gap:2.5px;display:flex;position:absolute;bottom:6px;right:18px}@media (min-width:640px){.music-box-comb.svelte-1o4jdf5{gap:3.5px;bottom:8px;right:22px}}.comb-tooth.svelte-1o4jdf5{transform-origin:top;background:linear-gradient(#cbd5e1 0%,#475569 100%);border-radius:.5px;width:3px;height:18px}.comb-tooth.vibrating.svelte-1o4jdf5{-webkit-animation:.12s ease-in-out infinite alternate svelte-1o4jdf5-tooth-vibrate;animation:.12s ease-in-out infinite alternate svelte-1o4jdf5-tooth-vibrate}@media (min-width:640px){.comb-tooth.svelte-1o4jdf5{border-radius:1px;width:4px;height:24px}}@-webkit-keyframes svelte-1o4jdf5-floppy-spin{to{transform:rotate(360deg)}}@keyframes svelte-1o4jdf5-floppy-spin{to{transform:rotate(360deg)}}@-webkit-keyframes svelte-1o4jdf5-floppy-led-blink{0%{background:#22c55e;box-shadow:0 0 5px #22c55e}to{background:#166534;box-shadow:0 0 1px #166534}}@keyframes svelte-1o4jdf5-floppy-led-blink{0%{background:#22c55e;box-shadow:0 0 5px #22c55e}to{background:#166534;box-shadow:0 0 1px #166534}}@-webkit-keyframes svelte-1o4jdf5-key-spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes svelte-1o4jdf5-key-spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@-webkit-keyframes svelte-1o4jdf5-gear-rotate{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes svelte-1o4jdf5-gear-rotate{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@-webkit-keyframes svelte-1o4jdf5-gear-rotate-reverse{0%{transform:rotate(360deg)}to{transform:rotate(0)}}@keyframes svelte-1o4jdf5-gear-rotate-reverse{0%{transform:rotate(360deg)}to{transform:rotate(0)}}@-webkit-keyframes svelte-1o4jdf5-drum-roll{0%{transform:translate(0)}to{transform:translate(50%)}}@keyframes svelte-1o4jdf5-drum-roll{0%{transform:translate(0)}to{transform:translate(50%)}}@-webkit-keyframes svelte-1o4jdf5-tooth-vibrate{0%{transform:scaleY(1)}to{transform:scaleY(.85)skew(2deg)}}@keyframes svelte-1o4jdf5-tooth-vibrate{0%{transform:scaleY(1)}to{transform:scaleY(.85)skew(2deg)}}.arigato-modal-backdrop.svelte-1o4jdf5{z-index:2000;-webkit-backdrop-filter:blur(8px);background:rgba(0,0,0,.75);justify-content:center;align-items:center;width:100vw;height:100vh;display:flex;position:fixed;top:0;left:0}.arigato-modal-content.svelte-1o4jdf5{color:#e4e4e7;background:linear-gradient(135deg,#121214 0%,#0a0a0c 100%);border:1px solid rgba(239,68,68,.2);border-radius:16px;flex-direction:column;width:90vw;max-width:600px;height:80vh;font-family:monospace;display:flex;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,.8),inset 0 1px rgba(255,255,255,.05)}@media (max-width:640px){.arigato-modal-content.svelte-1o4jdf5{width:95vw;height:85vh}}.arigato-modal-header.svelte-1o4jdf5{background:rgba(255,255,255,.02);border-bottom:1px solid rgba(255,255,255,.08);justify-content:space-between;align-items:center;padding:16px 24px;display:flex}.arigato-modal-header.svelte-1o4jdf5 h2:where(.svelte-1o4jdf5){letter-spacing:.1em;color:#ef4444;text-transform:uppercase;margin:0;font-size:1rem;font-weight:700}.arigato-close-btn.svelte-1o4jdf5{color:rgba(255,255,255,.6);cursor:pointer;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:50%;justify-content:center;align-items:center;width:32px;height:32px;transition:all .2s;display:flex}.arigato-close-btn.svelte-1o4jdf5:hover{color:#fff;background:rgba(239,68,68,.2);border-color:rgba(239,68,68,.4);transform:translate(-2px)}.arigato-modal-body.svelte-1o4jdf5{color:#a1a1aa;flex:1;padding:24px;font-size:.85rem;line-height:1.5;overflow-y:auto}.arigato-modal-body.svelte-1o4jdf5 .intro-text:where(.svelte-1o4jdf5){white-space:pre-wrap;margin-bottom:16px}.arigato-modal-body.svelte-1o4jdf5 .outro-text:where(.svelte-1o4jdf5){white-space:pre-wrap;margin-bottom:16px}.arigato-modal-body.svelte-1o4jdf5 .intro-text:where(.svelte-1o4jdf5) a{color:#ef4444;text-decoration:underline}.arigato-modal-body.svelte-1o4jdf5 .outro-text:where(.svelte-1o4jdf5) a{color:#ef4444;text-decoration:underline}.arigato-modal-body.svelte-1o4jdf5 .intro-text:where(.svelte-1o4jdf5) a:hover{color:#fff}.arigato-modal-body.svelte-1o4jdf5 .outro-text:where(.svelte-1o4jdf5) a:hover{color:#fff}.arigato-modal-body.svelte-1o4jdf5 .tos-box:where(.svelte-1o4jdf5){background:rgba(0,0,0,.4);border:1px dashed rgba(255,255,255,.1);border-radius:8px;max-height:300px;margin:16px 0;padding:12px;overflow-y:auto}.arigato-modal-body.svelte-1o4jdf5 .tos-microtext:where(.svelte-1o4jdf5){letter-spacing:0;color:#71717a;word-break:break-all;white-space:pre-wrap;text-transform:none;font-family:monospace;font-size:5px;line-height:1.2}.arigato-modal-body.svelte-1o4jdf5 .tos-microtext:where(.svelte-1o4jdf5) a{color:#ef4444;text-decoration:underline}.arigato-modal-body.svelte-1o4jdf5 .tos-microtext:where(.svelte-1o4jdf5) a:hover{color:#fff}.merch-link-container.svelte-1o4jdf5{justify-content:center;margin-bottom:20px;display:flex}.merch-link-btn.svelte-1o4jdf5{color:#fff;text-transform:uppercase;letter-spacing:.08em;background:linear-gradient(135deg,#ef4444 0%,#b91c1c 100%);border-radius:9999px;align-items:center;gap:8px;padding:8px 18px;font-size:.7rem;font-weight:850;text-decoration:none;transition:all .2s;display:inline-flex;box-shadow:0 4px 12px rgba(239,68,68,.3)}.merch-link-btn.svelte-1o4jdf5:hover{color:#fff;background:linear-gradient(135deg,#ff6b6b 0%,#ef4444 100%);transform:translateY(-2px);box-shadow:0 6px 16px rgba(239,68,68,.4)}.merch-link-btn.svelte-1o4jdf5:active{transform:translateY(0)}
/*$vite$:1*/`,document.head.appendChild(yt),bt=`DOGS`,xt=`Download instrumental`,St=`Download vocal mix`,Ct=`Download track`,wt=function(){function e(n,r){t(this,e),R(this,`canvas`,null),R(this,`gl`,null),R(this,`analyser`,null),R(this,`program`,null),R(this,`animationFrameId`,null),R(this,`startTime`,0),R(this,`vertexBuffer`,null),R(this,`audioTexture`,null),R(this,`uniforms`,{}),R(this,`frequencyBuffer`,null),this.canvas=n,this.analyser=r,this.frequencyBuffer=new Uint8Array(r?r.frequencyBinCount:128),this.gl=n.getContext(`webgl`)||n.getContext(`experimental-webgl`),this.gl||console.error(`WebGL not supported by this browser.`)}return r(e,[{key:`init`,value:function(e){if(this.gl){var t=this.gl;this.cleanupProgram();var n=this.compileShader(t.VERTEX_SHADER,`
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `),r=this.compileShader(t.FRAGMENT_SHADER,e);if(n&&r){if(this.program=t.createProgram(),t.attachShader(this.program,n),t.attachShader(this.program,r),t.linkProgram(this.program),!t.getProgramParameter(this.program,t.LINK_STATUS))console.error(`Shader program linking failed:`,t.getProgramInfoLog(this.program));else{t.useProgram(this.program);var i=new Float32Array([-1,-1,1,-1,-1,1,1,1]);this.vertexBuffer=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,this.vertexBuffer),t.bufferData(t.ARRAY_BUFFER,i,t.STATIC_DRAW);var a=t.getAttribLocation(this.program,`a_position`);t.enableVertexAttribArray(a),t.vertexAttribPointer(a,2,t.FLOAT,!1,0,0),this.audioTexture=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.audioTexture),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),this.uniforms={time:t.getUniformLocation(this.program,`u_time`),resolution:t.getUniformLocation(this.program,`u_resolution`),volume:t.getUniformLocation(this.program,`u_volume`),bass:t.getUniformLocation(this.program,`u_bass`),mid:t.getUniformLocation(this.program,`u_mid`),treble:t.getUniformLocation(this.program,`u_treble`),audioTexture:t.getUniformLocation(this.program,`u_audioTexture`)},this.startTime=performance.now(),this.resize()}}}}},{key:`setPreset`,value:function(e){this.init(e)}},{key:`compileShader`,value:function(e,t){if(!this.gl)return null;var n=this.gl,r=n.createShader(e);return n.shaderSource(r,t),n.compileShader(r),n.getShaderParameter(r,n.COMPILE_STATUS)?r:(console.error(`Shader compilation error (${e===n.VERTEX_SHADER?`VERTEX`:`FRAGMENT`}):`,n.getShaderInfoLog(r)),n.deleteShader(r),null)}},{key:`start`,value:function(){var e=this;this.stop();var t=function(e){function t(){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}(function(){e.renderFrame(),e.animationFrameId=requestAnimationFrame(t)});this.animationFrameId=requestAnimationFrame(t)}},{key:`stop`,value:function(){this.animationFrameId&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null)}},{key:`resize`,value:function(){if(this.gl&&this.canvas){var e=this.gl,t=this.canvas.clientWidth,n=this.canvas.clientHeight;(this.canvas.width!==t||this.canvas.height!==n)&&(this.canvas.width=t,this.canvas.height=n,e.viewport(0,0,t,n))}}},{key:`renderFrame`,value:function(){if(this.gl&&this.program){var e=this.gl;this.resize(),e.useProgram(this.program),e.bindBuffer(e.ARRAY_BUFFER,this.vertexBuffer);var t=(performance.now()-this.startTime)/1e3,n=0,r=0,i=0,a=0;if(this.analyser){this.analyser.getByteFrequencyData(this.frequencyBuffer);for(var o=this.frequencyBuffer.length,s=0,c=0,l=0,u=0;u<o;u++){var d=this.frequencyBuffer[u];n+=d,u<12?(r+=d,s++):u<64?(i+=d,c++):(a+=d,l++)}n=n/o/255,r=s>0?r/s/255:0,i=c>0?i/c/255:0,a=l>0?a/l/255:0,e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.audioTexture),e.texImage2D(e.TEXTURE_2D,0,e.LUMINANCE,o,1,0,e.LUMINANCE,e.UNSIGNED_BYTE,this.frequencyBuffer)}e.uniform1f(this.uniforms.time,t),e.uniform2f(this.uniforms.resolution,this.canvas.width,this.canvas.height),e.uniform1f(this.uniforms.volume,n),e.uniform1f(this.uniforms.bass,r),e.uniform1f(this.uniforms.mid,i),e.uniform1f(this.uniforms.treble,a),e.uniform1i(this.uniforms.audioTexture,0),e.drawArrays(e.TRIANGLE_STRIP,0,4)}}},{key:`cleanupProgram`,value:function(){this.gl&&this.program&&(this.gl.deleteProgram(this.program),this.program=null)}},{key:`destroy`,value:function(){this.stop();var e=this.gl;e&&(this.cleanupProgram(),this.vertexBuffer&&(e.deleteBuffer(this.vertexBuffer),this.vertexBuffer=null),this.audioTexture&&(e.deleteTexture(this.audioTexture),this.audioTexture=null)),this.canvas=null,this.gl=null,this.analyser=null}}])}(),Tt=[{id:`kaleidosync`,name:`Kaleidosync`,fragmentShader:`
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
    `}],Et={id:`no-signal`,name:`No Signal`,fragmentShader:`
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
  `},Dt=N(`<li class="flex items-center svelte-80frst"><button type="button"> </button> <button type="button"><!></button> <button type="button"><!></button></li>`),X=N(`<li class="px-3 py-3 font-mono text-[11px] text-white/40 md:px-4 2xl:px-5 2xl:text-[15px] svelte-80frst"> </li>`),Ot=N(`<li class="px-3 py-2 font-mono text-[10px] text-white/30 md:px-4 2xl:px-5 2xl:text-[13px] svelte-80frst"> </li>`),kt=N(`<div class="preset-list flex min-h-0 flex-1 flex-col svelte-80frst"><div class="flex items-center gap-2 border-b border-white/10 px-3 py-2 sm:py-1.5 md:px-4 2xl:px-5 2xl:py-3 svelte-80frst"><!> <input type="search" aria-label="Search MilkDrop presets" autocomplete="off" spellcheck="false" class="w-full min-w-0 bg-transparent font-mono text-[12px] text-white outline-none placeholder:text-white/30 2xl:text-[15px] svelte-80frst"/> <div class="flex shrink-0 items-center gap-1 rounded-md border border-white/10 p-0.5 svelte-80frst" role="group" aria-label="Which presets to list"><button type="button">All</button> <button type="button"><!> </button> <button type="button" aria-label="Presets I turned down"><!> </button></div></div> <ul class="preset-rows min-h-0 flex-1 overflow-y-auto py-1 svelte-80frst"><!> <!></ul></div>`),B([`click`]),At=N(`<div class="flex max-h-[40vh] flex-col overflow-hidden rounded-lg border border-white/10 bg-black/75 backdrop-blur-md sm:max-h-[50vh] 2xl:max-h-[60vh] svelte-6h1e9g"><!></div>`),jt=fe(`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="10" x2="14" y1="2" y2="2" class="svelte-6h1e9g"></line><circle cx="12" cy="14" r="8" class="svelte-6h1e9g"></circle><line class="deck-timer-hand svelte-6h1e9g" x1="12" y1="14" x2="12" y2="8.5"></line></svg>`),Mt=N(`<div class="milkdrop-deck flex w-full flex-col gap-2 sm:max-w-md md:max-w-lg xl:max-w-xl 2xl:max-w-3xl 2xl:gap-3 svelte-6h1e9g"><!> <div class="flex items-center gap-1 rounded-lg border border-white/10 bg-black/60 p-1 backdrop-blur-md svelte-6h1e9g"><button type="button" class="deck-btn svelte-6h1e9g" aria-label="Previous preset" title="Previous preset"><!></button> <button type="button" class="deck-btn svelte-6h1e9g" aria-label="Next preset" title="Next preset"><!></button> <button type="button" class="min-w-0 flex-1 truncate px-2 text-left font-mono text-[10px] uppercase tracking-wider text-white/80 hover:text-white md:text-[11px] 2xl:text-[14px] svelte-6h1e9g"> </button> <button type="button"><!></button> <button type="button" class="deck-btn svelte-6h1e9g" aria-label="Never show this preset again" title="Never show this preset again (the PRESETS list keeps it, to bring back)"><!></button> <button type="button" aria-label="Play only my hearted presets"><!></button> <button type="button" aria-label="Shuffle presets"><!></button> <button type="button"><!></button></div></div>`),B([`click`]),Nt=N(`<span class="lyric-word svelte-4gkonh"> </span>`),Pt=N(`<span class="lyric-row svelte-4gkonh"></span>`),Ft=N(`<div aria-hidden="true"><!></div>`),It=N(`<button type="button"><!> <span class="strike svelte-btbnk2" aria-hidden="true"></span></button>`),B([`click`]),Lt=[{id:`default`,name:`Default order`,label:`Default`,icon:On},{id:`artist`,name:`Artist`,icon:kn},{id:`album`,name:`Album`,icon:Ae},{id:`year`,name:`Year`,icon:Sn},{id:`filename`,name:`File name`,icon:W},{id:`genre`,name:`Genre`,icon:Nn},{id:`season`,name:`Season`,icon:Dn}],Rt=N(`<span class="sort-icon svelte-1ly12po"><!></span> <span class="sort-name hidden sm:inline svelte-1ly12po"> </span>`,1),zt=N(`<button type="button"><!></button>`),B([`click`]),Bt=N(`<button type="button"><span class="sound-icon svelte-1vwnx9r"><!></span></button>`),B([`click`]),Vt=N(`<button type="button" class="stage-btn svelte-chvcxl"><!></button> <button type="button" class="stage-btn stage-btn-wide svelte-chvcxl"> </button> <button type="button" class="stage-btn svelte-chvcxl"> </button>`,1),Ht=N(`<div class="flex items-center gap-1 rounded-lg border border-white/10 bg-black/60 p-1 backdrop-blur-md svelte-chvcxl"><button type="button" class="stage-btn svelte-chvcxl" aria-label="Leave full screen" title="Leave full screen"><!></button> <!> <!></div>`),B([`click`]),Ut=[`DOGS`,`DOG BLOG`],Wt=[`JAN`,`FEB`,`MAR`,`APR`,`MAY`,`JUN`,`JUL`,`AUG`,`SEP`,`OCT`,`NOV`,`DEC`],Gt=/^(\d{4})-(\d{2})/,Kt=`I understand the creator of this sick beat Nxnja has a copyright notice on his music distribution website.\r
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
`,qt=N(`<canvas class="visualizer-canvas svelte-1o4jdf5"></canvas>`),Jt=N(`<div class="visualizer-container viz-disc cursor-pointer svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open the song list. Double tap for full screen."><!> <div><img class="viz-art svelte-1o4jdf5"/></div> <div class="viz-spindle svelte-1o4jdf5"></div></div>`),Yt=N(`<div class="vinyl-record-clicker cursor-pointer w-full h-full svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div><div class="groove g1 svelte-1o4jdf5"></div> <div class="groove g2 svelte-1o4jdf5"></div> <div class="groove g3 svelte-1o4jdf5"></div> <div class="groove g4 svelte-1o4jdf5"></div> <div class="record-label svelte-1o4jdf5"><img loading="lazy"/></div> <div class="spindle svelte-1o4jdf5"></div></div> <div></div></div>`),Xt=N(`<div class="cassette-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="cassette-tape svelte-1o4jdf5"><div class="cassette-label bg-gradient-to-r from-purple-800 to-pink-700 svelte-1o4jdf5"><span class="cassette-track-title svelte-1o4jdf5"> </span> <span class="cassette-brand svelte-1o4jdf5">WEAREDOGS AUDIO</span></div> <div class="cassette-window bg-zinc-950/80 svelte-1o4jdf5"><div></div> <div></div> <div></div> <div></div></div></div></div>`),Zt=N(`<div class="floppy-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="floppy-disk svelte-1o4jdf5"><div class="floppy-corner svelte-1o4jdf5"></div> <div class="floppy-write-protect svelte-1o4jdf5"></div> <div class="floppy-label bg-slate-100 text-slate-900 svelte-1o4jdf5"><div class="floppy-label-stripe bg-red-600 svelte-1o4jdf5"></div> <div class="floppy-label-stripe-blue bg-blue-600 svelte-1o4jdf5"></div> <div class="floppy-label-content svelte-1o4jdf5"><div class="floppy-song truncate font-mono svelte-1o4jdf5"> </div> <div class="floppy-artist truncate font-mono svelte-1o4jdf5"> </div></div></div> <div class="floppy-shutter-door bg-zinc-700 svelte-1o4jdf5"><div></div> <div class="floppy-shutter-opening bg-zinc-950 svelte-1o4jdf5"><div></div></div></div> <div></div></div></div>`),Qt=N(`<div></div>`),$t=N(`<div class="musicbox-container-clicker cursor-pointer w-full h-full flex items-center justify-center p-4 relative svelte-1o4jdf5" role="button" tabindex="0" aria-label="Open tracklist"><div class="music-box svelte-1o4jdf5"><div></div> <div class="music-box-interior border border-amber-900/40 svelte-1o4jdf5"><div class="music-box-gears svelte-1o4jdf5"><div></div> <div></div></div> <div class="music-box-drum-wrap svelte-1o4jdf5"><div><div class="music-box-pins svelte-1o4jdf5"><div class="pin pin-1 svelte-1o4jdf5"></div> <div class="pin pin-2 svelte-1o4jdf5"></div> <div class="pin pin-3 svelte-1o4jdf5"></div> <div class="pin pin-4 svelte-1o4jdf5"></div> <div class="pin pin-5 svelte-1o4jdf5"></div> <div class="pin pin-6 svelte-1o4jdf5"></div></div></div></div> <div class="music-box-comb svelte-1o4jdf5"></div></div></div></div>`),en=N(`<button><!></button>`),tn=N(`<span class="player-tether-hint svelte-1o4jdf5" role="status"> </span>`),nn=N(`<span class="player-tether svelte-1o4jdf5"><button><!></button> <!></span>`),rn=N(`<span></span>`),an=N(`<div class="spin-ring svelte-1o4jdf5"></div>`),on=N(`<div class="volume-popover svelte-1o4jdf5"><button class="ctrl ctrl-xs mr-2 border border-white/10 rounded-full p-1 hover:bg-white/10 svelte-1o4jdf5" aria-label="Mute"><!></button> <input type="range" class="vol-slider-pop svelte-1o4jdf5" min="0" max="1" step="0.01" aria-label="Volume"/> <span class="text-[10px] font-bold text-white/60 min-w-[28px] text-right font-mono select-none svelte-1o4jdf5"> </span></div>`),sn=N(`<span class="tl-count hidden sm:inline svelte-1o4jdf5"> </span>`),cn=N(`<button role="tab"><!><span class="svelte-1o4jdf5">PRESETS</span> <!></button>`),ln=N(`<div class="eq svelte-1o4jdf5"><div class="eq-b svelte-1o4jdf5"></div> <div class="eq-b svelte-1o4jdf5"></div> <div class="eq-b svelte-1o4jdf5"></div></div>`),un=N(`<span class="svelte-1o4jdf5"></span>`),dn=N(`<span class="text-amber-400 flex items-center gap-1 text-[9px] font-bold tracking-wider uppercase bg-amber-500/10 px-1.5 py-0.5 rounded flex-shrink-0 svelte-1o4jdf5" title="Failed to fetch music source from remote database"><!> Error Fetching</span>`),fn=N(`<button class="cursor-pointer svelte-1o4jdf5" style="background: none; border: none; padding: 0; color: inherit; font: inherit;">i</button>`),pn=N(`<a target="_blank" class="svelte-1o4jdf5">i</a>`),mn=N(`<span class="inst-chip-link svelte-1o4jdf5"><!></span>`),hn=N(`<div><div class="tr-num svelte-1o4jdf5"><!></div> <img loading="lazy" class="tr-art svelte-1o4jdf5"/> <div class="tr-info svelte-1o4jdf5"><div class="flex items-center gap-1.5 min-w-0 svelte-1o4jdf5"><span> </span> <!></div> <span class="tr-meta svelte-1o4jdf5"> </span></div> <div class="flex items-center gap-2 flex-shrink-0 svelte-1o4jdf5"><!>  <button class="tr-share-btn svelte-1o4jdf5" title="Copy track link" aria-label="Share track"><!></button> <!></div></div>`),gn=N(`<img alt="" class="stage-cover svelte-1o4jdf5"/>`),_n=N(`<button> </button>`),vn=N(`<div class="flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-lg p-1 border border-white/10 svelte-1o4jdf5"></div>`),yn=N(`<div><div class="stage-frame svelte-1o4jdf5"><!> <!></div> <div class="visualizer-overlay flex-col items-center sm:flex-row sm:items-end svelte-1o4jdf5"><!> <!> <!></div></div>`),bn=N(`<div class="arigato-modal-backdrop svelte-1o4jdf5"><div class="arigato-modal-content svelte-1o4jdf5"><header class="arigato-modal-header svelte-1o4jdf5"><h2 class="svelte-1o4jdf5">ARIGATO INFO</h2> <button class="arigato-close-btn svelte-1o4jdf5"><!></button></header> <div class="arigato-modal-body scroll-y svelte-1o4jdf5"><div class="merch-link-container svelte-1o4jdf5"><a href="https://nxnjaa.beatstars.com/" target="_blank" rel="noopener noreferrer" class="merch-link-btn svelte-1o4jdf5"><!> NXNJA MERCH & MUSIC</a></div> <p class="intro-text svelte-1o4jdf5"></p> <div class="tos-box svelte-1o4jdf5"><div class="tos-microtext svelte-1o4jdf5"></div></div> <p class="outro-text svelte-1o4jdf5"></p></div></div></div>`),xn=N(`<div class="mp-backdrop svelte-1o4jdf5"><div><header class="panel-header svelte-1o4jdf5"><div class="brand svelte-1o4jdf5"><button class="logo-btn svelte-1o4jdf5" aria-label="Go to the DOGS home page"><!></button> <h1 class="svelte-1o4jdf5"></h1></div> <div class="header-end flex items-center gap-1 md:gap-2 svelte-1o4jdf5"><!> <button class="close-btn svelte-1o4jdf5" aria-label="Close panel"><!></button></div></header> <div class="mp-body svelte-1o4jdf5"><div class="songs-layout svelte-1o4jdf5"><div><div><div><!></div>  <div class="track-info mt-2 svelte-1o4jdf5"><div class="flex items-center justify-center gap-1.5 mb-1.5 svelte-1o4jdf5"><button class="player-share-btn svelte-1o4jdf5" title="Copy track link" aria-label="Share track"><!></button> <!> <a class="player-tip-btn svelte-1o4jdf5" target="_blank" rel="noopener noreferrer"><!></a> <!></div> <div><h2> </h2></div> <div><p> </p></div> <div><p> </p></div></div></div> <div class="player-controls-block svelte-1o4jdf5"><!> <div class="progress-row svelte-1o4jdf5"><span class="ptime svelte-1o4jdf5"> </span> <div class="progress-wrap waveform-slider-wrap relative h-9 flex items-end svelte-1o4jdf5"><div class="waveform-bars flex items-end justify-between absolute inset-0 pointer-events-none px-1 h-full svelte-1o4jdf5"></div> <input type="range" class="seek-input absolute inset-0 opacity-0 cursor-pointer w-full h-full svelte-1o4jdf5" min="0" step="0.1" aria-label="Seek"/></div> <span class="ptime svelte-1o4jdf5"> </span></div> <div class="controls-row svelte-1o4jdf5"><button aria-label="Shuffle"><!></button> <button class="ctrl ctrl-md svelte-1o4jdf5" aria-label="Previous"><!></button> <button><!></button> <button class="ctrl ctrl-md svelte-1o4jdf5" aria-label="Next"><!></button> <button aria-label="Repeat"><!></button></div> <div class="w-full flex flex-col items-center gap-1.5 mt-2 px-1 svelte-1o4jdf5"><div><span><!> <span class="svelte-1o4jdf5">VOCAL</span></span> <div class="dj-fader-slot relative svelte-1o4jdf5"><div></div></div> <span><!> <span class="svelte-1o4jdf5">INST</span></span></div></div> <div class="relative flex justify-center items-center gap-3 mt-2 w-full svelte-1o4jdf5"><!> <!> <button class="ctrl ctrl-xs svelte-1o4jdf5" aria-label="Full screen" title="Full screen"><!></button> <!> <!> <div class="relative svelte-1o4jdf5"><button class="ctrl ctrl-xs vol-toggle-btn svelte-1o4jdf5" aria-label="Toggle volume slider"><!></button></div></div></div></div> <div><div class="mobile-close-bar hidden py-2 px-4 border-b border-white/5 flex items-center justify-between svelte-1o4jdf5"><span class="text-xs font-bold text-white/50 svelte-1o4jdf5">Track Library</span> <button class="px-3 py-1 bg-white/5 text-white/75 rounded-lg text-xs font-bold svelte-1o4jdf5">Back to player</button></div> <div class="tl-header relative flex justify-between items-center gap-3 svelte-1o4jdf5"><div class="flex flex-1 items-center justify-between gap-1 svelte-1o4jdf5" role="tablist" aria-label="Songs or visualizer presets"><button role="tab"><!><span class="svelte-1o4jdf5">TRACKS</span> <span class="tl-count hidden sm:inline svelte-1o4jdf5"> </span></button> <!></div> <!></div> <!> <div></div></div></div></div> <footer class="mp-footer svelte-1o4jdf5"><div class="mp-status svelte-1o4jdf5"><span class="mp-dot svelte-1o4jdf5"></span><span class="svelte-1o4jdf5">🐕</span></div> <span class="svelte-1o4jdf5">MUSIC</span></footer></div> <!> <canvas class="fader-fx-canvas pointer-events-none svelte-1o4jdf5"></canvas> <!></div>`),B([`click`,`input`,`change`,`pointerdown`,`pointermove`])}}})})();