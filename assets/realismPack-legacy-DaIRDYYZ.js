(function(){System.register([],function(ee,te){var e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X,Z,Q,ne,re,ie,ae,oe,se,ce,le,ue,de,fe,pe,me,he,ge,_e,ve,ye,be,xe,Se,Ce,we,Te,Ee,De,Oe,ke,Ae,je,Me,Ne,Pe,Fe,Ie,Le,Re,ze,Be,Ve,He,Ue,We,Ge,Ke,qe,Je,Ye,Xe,Ze,Qe,$e,et,tt,nt,rt,it,at,ot,st,ct,lt,ut,dt,ft,pt,mt,ht,gt,_t,vt,yt,bt,xt,St,Ct,wt,Tt,Et,Dt,Ot,kt,At,jt,Mt,Nt,Pt,Ft,It,Lt,Rt,zt,Bt,Vt,Ht,Ut,Wt,Gt,Kt,qt,Jt,Yt,Xt,Zt,Qt,$t,en,tn,nn,rn,an,on,sn,cn,ln,un,dn,fn,pn,mn,hn,gn,_n,vn,yn,bn,xn,Sn,Cn,wn,Tn,En,Dn,On,kn,An,jn,Mn,Nn,Pn,Fn,In,Ln,Rn,zn,Bn,Vn,Hn,Un,Wn,Gn,Kn,qn,Jn,Yn,Xn,Zn,Qn,$n,er,tr,$,nr,rr,ir,ar,or,sr,cr,lr,ur,dr,fr,pr,mr,hr,gr,_r,vr,yr,br,xr,Sr,Cr,wr,Tr,Er,Dr,Or,kr,Ar,jr,Mr,Nr,Pr,Fr,Ir,Lr,Rr,zr,Br,Vr,Hr,Ur,Wr,Gr,Kr,qr,Jr,Yr,Xr,Zr,Qr,$r,ei,ti,ni,ri,ii,ai,oi,si,ci,li,ui,di,fi,pi,mi,hi,gi,_i,vi,yi,bi,xi,Si,Ci,wi,Ti,Ei,Di,Oi,ki,Ai,ji,Mi,Ni,Pi,Fi,Ii,Li,Ri,zi,Bi,Vi,Hi,Ui,Wi,Gi,Ki,qi,Ji,Yi,Xi,Zi,Qi,$i,ea,ta,na,ra,ia,aa,oa,sa,ca,la,ua,da,fa,pa,ma,ha,ga,_a,va,ya,ba,xa,Sa,Ca,wa,Ta,Ea,Da,Oa,ka,Aa,ja,Ma,Na,Pa,Fa,Ia,La,Ra,za,Ba,Va,Ha,Ua,Wa,Ga,Ka,qa,Ja,Ya,Xa,Za,Qa,$a,eo,to,no,ro,io,ao,oo;function so(){return oo}return ee(`getPresets`,so),{setters:[],execute:function(){e={rating:5,gammaadj:1.980001,decay:.96,echo_zoom:.99663,echo_alpha:.5,echo_orient:1,wave_mode:2,wave_dots:1,wave_brighten:0,wrap:0,darken:1,wave_a:.001,wave_scale:.011726,wave_smoothing:.9,warpanimspeed:.010284,warpscale:.01,warp:.01,wave_r:.5,wave_g:.4,wave_b:.3,ob_size:0,ob_r:.11,ob_b:.1,ib_size:0,ib_r:0,ib_g:0,ib_b:0,mv_x:64,mv_y:48,mv_l:5,mv_r:0,mv_g:0,mv_b:0,mv_a:0},t=[{baseVals:{enabled:1,sides:6,textured:1,y:.68,rad:.808142,tex_ang:1.193805,tex_zoom:1.040604,g:1,b:1,r2:.6,g2:.7,b2:1,border_a:0},init_eqs_str:``,frame_eqs_str:`a.ang=.1*a.time;`},{baseVals:{enabled:1,sides:6,additive:1,textured:1,y:.21,rad:.564831,tex_ang:1.193805,tex_zoom:1.040604,g:1,b:1,a:.15,r2:.6,g2:.7,b2:1,border_a:0},init_eqs_str:``,frame_eqs_str:`a.ang=.13*-a.time;a.x=.2*Math.sin(.29*a.time)+.5;`},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],n=[{baseVals:{enabled:1,thick:1,additive:1},init_eqs_str:`a.n=0;a.xp=0;a.tail=0;a.repeats=0;a.yp=0;a.q1=0;a.tmm=0;a.cycleto1=0;a.cycle=0;a.wavex=0;a.wavey=0;a.phs=0;a.sampcyc=0;a.tmc=0;a.head=0;a.samplerepeat=0;a.tm=0;a.rsample=0;a.variation=0;a.trailsize=0;a.swap=0;`,frame_eqs_str:``,point_eqs_str:`a.repeats=10;a.samplerepeat=a.sample*a.repeats;a.cycle=Math.floor(a.samplerepeat);a.sampcyc=a.samplerepeat-a.cycle;a.cycleto1=div(a.cycle,a.repeats);a.n=6.283*a.sampcyc;a.phs=a.sampcyc;a.tm=a.q1+a.phs+.1*a.cycleto1;a.tmm=a.time;a.rsample=2.2*(1-.9*a.sampcyc)*(a.cycleto1+1);a.a=a.sampcyc*below(a.sampcyc,.95);a.a*=a.a;a.tmc=a.tm+a.cycle-.2*a.phs;a.variation=9*Math.sin(6.283*a.cycleto1);a.swap=2*above(a.sample,.5)-1;a.wavex=Math.sin(a.tmc*(19+a.variation)*a.swap)*a.rsample*.04;
a.wavey=Math.cos(a.tmc*(19+a.variation)*a.swap)*a.rsample*.04;a.xp=.4*Math.sin(a.tm);a.yp=.4*Math.cos(a.tm);a.xp*=Math.sin(3*a.tm);a.yp*=Math.cos(2.6*a.tm);a.xp*=Math.sin(.43*a.tm);a.yp*=.5*Math.cos(1.79*a.tm)+.5;a.xp+=a.wavex;a.yp+=a.wavey;a.x=a.xp+.5;a.y=1.333*a.yp+.5;a.trailsize=.85;a.head=above(a.a,a.trailsize);a.tail=1-a.head;a.r=1*a.head+.5*a.tail;a.g=.8*a.head+.3*a.tail;a.b=.5*a.head;a.a*=.25;`},{baseVals:{enabled:1,thick:1},init_eqs_str:`a.n=0;a.xp=0;a.tail=0;a.repeats=0;a.yp=0;a.q1=0;a.tmm=0;a.cycleto1=0;a.cycle=0;a.wavex=0;a.wavey=0;a.phs=0;a.sampcyc=0;a.tmc=0;a.head=0;a.samplerepeat=0;a.tm=0;a.rsample=0;a.variation=0;a.trailsize=0;a.swap=0;`,frame_eqs_str:``,point_eqs_str:`a.repeats=8;a.samplerepeat=a.sample*a.repeats;a.cycle=Math.floor(a.samplerepeat);a.sampcyc=a.samplerepeat-a.cycle;a.cycleto1=div(a.cycle,a.repeats);a.n=6.283*a.sampcyc;a.phs=a.sampcyc+.15;a.tm=a.q1+a.phs+.1*a.cycleto1;a.tmm=a.time;a.rsample=1.5*(1-.9*a.sampcyc)*(a.cycleto1+1);a.a=a.sampcyc*below(a.sampcyc,.95);a.a*=a.a;a.tmc=a.tm+a.cycle-.2*a.phs;a.variation=9*Math.sin(6.283*a.cycleto1);a.swap=2*above(a.sample,.5)-1;a.wavex=Math.sin(a.tmc*(19+a.variation)*a.swap)*a.rsample*
.04;a.wavey=Math.cos(a.tmc*(19+a.variation)*a.swap)*a.rsample*.04;a.xp=.4*Math.sin(a.tm);a.yp=.4*Math.cos(a.tm);a.xp*=Math.sin(3*a.tm);a.yp*=Math.cos(2.6*a.tm);a.xp*=Math.sin(.43*a.tm);a.yp*=.5*Math.cos(1.79*a.tm)+.5;a.xp+=a.wavex;a.yp+=a.wavey;a.x=a.xp+.5;a.y=1.333*a.yp+.5;a.trailsize=.85;a.head=above(a.a,a.trailsize);a.tail=1-a.head;a.r=1*a.head+.5*a.tail;a.g=.8*a.head+.3*a.tail;a.b=.5*a.head;`},{baseVals:{enabled:1,thick:1},init_eqs_str:`a.n=0;a.xp=0;a.tail=0;a.repeats=0;a.yp=0;a.q1=0;a.tmm=0;a.cycleto1=0;a.cycle=0;a.wavex=0;a.wavey=0;a.phs=0;a.sampcyc=0;a.tmc=0;a.head=0;a.samplerepeat=0;a.tm=0;a.rsample=0;a.variation=0;a.trailsize=0;a.swap=0;`,frame_eqs_str:``,point_eqs_str:`a.repeats=6;a.samplerepeat=a.sample*a.repeats;a.cycle=Math.floor(a.samplerepeat);a.sampcyc=a.samplerepeat-a.cycle;a.cycleto1=div(a.cycle,a.repeats);a.n=6.283*a.sampcyc;a.phs=a.sampcyc+.25;a.tm=a.q1+a.phs+.1*a.cycleto1;a.tmm=a.time;a.rsample=1.5*(1-.9*a.sampcyc)*(a.cycleto1+1);a.a=a.sampcyc*below(a.sampcyc,.95);a.a*=a.a;a.tmc=a.tm+a.cycle-.2*a.phs;a.variation=9*Math.sin(6.283*a.cycleto1);a.swap=2*above(a.sample,.5)-1;a.wavex=Math.sin(a.tmc*(19+a.variation)*a.swap)*a.rsample*
.04;a.wavey=Math.cos(a.tmc*(19+a.variation)*a.swap)*a.rsample*.04;a.xp=.4*Math.sin(a.tm);a.yp=.4*Math.cos(a.tm);a.xp*=Math.sin(3*a.tm);a.yp*=Math.cos(2.6*a.tm);a.xp*=Math.sin(.43*a.tm);a.yp*=.5*Math.cos(1.79*a.tm)+.5;a.xp+=a.wavex;a.yp+=a.wavey;a.x=a.xp+.5;a.y=1.333*a.yp+.5;a.trailsize=.85;a.head=above(a.a,a.trailsize);a.tail=1-a.head;a.r=1*a.head+.5*a.tail;a.g=.8*a.head+.3*a.tail;a.b=.5*a.head;`},{baseVals:{enabled:0}}],r=`a.q1=0;a.mv_x=64;a.mv_y=48;a.nut=0;a.stp=0;a.stq=0;a.rtp=0;a.rtq=0;a.wvr=0;a.decay=0;a.dcsp=0;`,i=`a.decay=.98;a.zoom=1;a.q1=.4*a.time;`,a=`a.dx=Math.sin(14*a.y)*Math.sin(34*a.y+a.time)*.002;a.dy=Math.cos(19*a.x+a.time)*Math.cos(34*a.x)*.002;a.dy=a.dy;`,o={baseVals:e,shapes:t,waves:n,init_eqs_str:r,frame_eqs_str:i,pixel_eqs_str:a,warp:``,comp:``},s={rating:5,gammaadj:1.28,decay:.96,echo_zoom:.99663,echo_orient:1,wave_mode:2,wave_dots:1,wave_brighten:0,wrap:0,darken:1,wave_a:.001,wave_scale:.011726,wave_smoothing:.9,warpanimspeed:.037492,warpscale:.014889,warp:.033004,wave_r:.5,wave_g:.4,wave_b:.3,ob_size:0,ob_r:.11,ob_b:.1,ib_size:0,ib_r:0,ib_g:0,ib_b:0,mv_x:0,mv_y:1e-6,mv_l:1,mv_g:.91,mv_b:.71,mv_a:0},c=[{baseVals:{enabled:1,sides:100,textured:1,rad:.301767,tex_zoom:.451117,g:.7,b:.3,a:.7,g2:0,border_a:0},init_eqs_str:`a.tm=0;a.q1=0;a.flip=0;a.flip=0;a.flip=0;a.flip=0;a.flip=0;a.xp=0;a.yp=0;a.zp=0;a.tm=0;a.tm=0;a.sa=0;a.ca=0;a.xr=0;a.xp=0;a.sa=0;a.yp=0;a.ca=0;a.yr=0;a.xp=0;a.ca=0;a.yp=0;a.sa=0;a.zr=0;a.zp=0;a.xp=0;a.xr=0;a.yp=0;a.yr=0;a.tm=0;a.zp=0;a.zr=0;a.tm=0;a.xq=0;a.xp=0;a.sa=0;a.ca=0;a.yq=0;a.yp=0;a.sa=0;a.zp=0;a.ca=0;a.zq=0;a.yp=0;a.ca=0;a.zp=0;a.sa=0;a.tm=0;a.sa=0;a.ca=0;a.xp=0;a.xq=0;a.sa=0;a.yq=0;a.ca=0;a.yp=0;a.xq=0;a.ca=0;a.yq=0;a.sa=0;a.zp=0;a.zq=0;a.zp=0;a.zp=0;a.tm=0;a.xq=0;
a.xp=0;a.sa=0;a.ca=0;a.yq=0;a.yp=0;a.sa=0;a.zp=0;a.ca=0;a.zq=0;a.yp=0;a.ca=0;a.zp=0;a.sa=0;a.tm=0;a.xp=0;a.xq=0;a.sa=0;a.yq=0;a.ca=0;a.yp=0;a.xq=0;a.ca=0;a.yq=0;a.sa=0;a.zp=0;a.zq=0;a.zp=0;a.zp=0;a.tm=0;a.sa=0;a.ca=0;a.xq=0;a.xp=0;a.sa=0;a.zp=0;a.ca=0;a.yq=0;a.yp=0;a.zq=0;a.xp=0;a.ca=0;a.zp=0;a.sa=0;a.tm=0;a.xp=0;a.xq=0;a.sa=0;a.ca=0;a.yp=0;a.yq=0;a.ca=0;a.zq=0;a.sa=0;a.zp=0;a.yq=0;a.sa=0;a.zq=0;a.ca=0;a.zp=0;a.zp=0;a.xs=0;a.xp=0;a.zp=0;a.ys=0;a.yp=0;a.zp=0;a.xs=0;a.ys=0;`,frame_eqs_str:`a.tm=a.q1;a.flip+=1;a.flip*=below(a.flip,2);a.xp=0;a.yp=0;a.zp=0;a.ang=20*a.tm+.4*Math.sin(76*a.tm+4*a.time);a.sa=Math.sin(a.ang);a.ca=Math.cos(a.ang);a.xr=a.xp*a.sa+a.yp*a.ca;a.yr=a.xp*a.ca-a.yp*a.sa;a.zr=a.zp;a.xp=a.xr;a.yp=a.yr+.05+.2*(.5*Math.sin(a.tm)+.5)+.05;a.zp=a.zr;a.ang=Math.sin(2*a.tm);a.xq=a.xp;a.sa=Math.sin(a.ang);a.ca=Math.cos(a.ang);a.yq=a.yp*a.sa+a.zp*a.ca;a.zq=a.yp*a.ca-a.zp*a.sa;a.ang=8*a.tm;a.sa=Math.sin(a.ang);a.ca=Math.cos(a.ang);a.xp=a.xq*a.sa+a.yq*a.ca;
a.yp=a.xq*a.ca-a.yq*a.sa;a.zp=a.zq;a.zp-=.3;a.ang=3.14+2.5*Math.sin(2*a.tm-.5);a.xq=a.xp;a.sa=Math.sin(a.ang);a.ca=Math.cos(a.ang);a.yq=a.yp*a.sa+a.zp*a.ca;a.zq=a.yp*a.ca-a.zp*a.sa;a.ang=-1+Math.cos(3*a.tm+.5);a.xp=a.xq*a.sa+a.yq*a.ca;a.yp=a.xq*a.ca-a.yq*a.sa;a.zp=a.zq;a.zp-=.35;a.ang=1.75*Math.cos(1*a.tm)-1.05;a.sa=Math.sin(a.ang);a.ca=Math.cos(a.ang);a.xq=a.xp*a.sa+a.zp*a.ca;a.yq=a.yp;a.zq=a.xp*a.ca-a.zp*a.sa;a.ang=Math.cos(a.tm);a.xp=a.xq;a.sa=Math.sin(a.ang);a.ca=Math.cos(a.ang);a.yp=a.yq*a.ca-
a.zq*a.sa;a.zp=a.yq*a.sa+a.zq*a.ca;a.zp+=1.5;a.xs=div(a.xp,a.zp);a.ys=div(a.yp,a.zp);a.x=a.xs+.5;a.y=1.3*a.ys+.5;a.a=.7;`},{baseVals:{enabled:1,sides:100,textured:1,x:.61,y:.89,rad:.58324,tex_zoom:1.691361,g:1,b:1,r2:1,b2:1,border_a:0},init_eqs_str:`a.q1=0;a.q1=0;`,frame_eqs_str:`a.x+=.1*Math.sin(a.q1+2);a.ang+=.5*Math.sin(1.4*a.q1);`},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],l=[{baseVals:{enabled:1,usedots:1,thick:1,b:.7},init_eqs_str:`a.n=0;a.yq=0;a.xp=0;a.yr=0;a.xs=0;a.yp=0;a.xr=0;a.q1=0;a.xq=0;a.flip=0;a.ca=0;a.ys=0;a.sa=0;a.zq=0;a.phs=0;a.ang=0;a.tm=0;a.zp=0;a.zr=0;`,frame_eqs_str:``,point_eqs_str:`a.n=6.283*a.sample;a.phs=.2*-a.sample;a.tm=a.q1+4*a.phs;a.flip+=1;a.flip*=below(a.flip,2);a.xp=0;a.yp=(.1*a.flip-.05)*a.sample;a.zp=0;a.ang=20*a.tm+.4*Math.sin(76*a.tm+4*a.time);a.sa=Math.sin(a.ang);a.ca=Math.cos(a.ang);a.xr=a.xp*a.sa+a.yp*a.ca;a.yr=a.xp*a.ca-a.yp*a.sa;a.zr=a.zp;a.xp=a.xr;a.yp=a.yr+.05+.2*(.5*Math.sin(a.tm)+.5)+.05;a.zp=a.zr;a.ang=Math.sin(2*a.tm);a.xq=a.xp;a.sa=Math.sin(a.ang);a.ca=Math.cos(a.ang);a.yq=a.yp*a.sa+a.zp*a.ca;a.zq=a.yp*a.ca-a.zp*a.sa;a.ang=8*a.tm;
a.sa=Math.sin(a.ang);a.ca=Math.cos(a.ang);a.xp=a.xq*a.sa+a.yq*a.ca;a.yp=a.xq*a.ca-a.yq*a.sa;a.zp=a.zq;a.zp-=.3;a.ang=3.14+2.5*Math.sin(2*a.tm-.5);a.xq=a.xp;a.sa=Math.sin(a.ang);a.ca=Math.cos(a.ang);a.yq=a.yp*a.sa+a.zp*a.ca;a.zq=a.yp*a.ca-a.zp*a.sa;a.ang=-1+Math.cos(3*a.tm+.5);a.xp=a.xq*a.sa+a.yq*a.ca;a.yp=a.xq*a.ca-a.yq*a.sa;a.zp=a.zq;a.zp-=.35;a.ang=1.75*Math.cos(1*a.tm)-1.05;a.sa=Math.sin(a.ang);a.ca=Math.cos(a.ang);a.xq=a.xp*a.sa+a.zp*a.ca;a.yq=a.yp;a.zq=a.xp*a.ca-a.zp*a.sa;a.ang=Math.cos(a.tm);
a.xp=a.xq;a.sa=Math.sin(a.ang);a.ca=Math.cos(a.ang);a.yp=a.yq*a.ca-a.zq*a.sa;a.zp=a.yq*a.sa+a.zq*a.ca;a.zp+=1.5;a.xs=div(a.xp,a.zp);a.ys=div(a.yp,a.zp);a.x=a.xs+.5;a.y=1.3*a.ys+.5;a.a=1-a.sample;`},{baseVals:{enabled:1,usedots:1,thick:1,g:.9,b:.8},init_eqs_str:`a.n=0;a.yq=0;a.xp=0;a.yr=0;a.xs=0;a.yp=0;a.xr=0;a.q1=0;a.xq=0;a.flip=0;a.ca=0;a.ys=0;a.sa=0;a.zq=0;a.phs=0;a.ang=0;a.tm=0;a.zp=0;a.zr=0;`,frame_eqs_str:``,point_eqs_str:`a.n=6.283*a.sample;a.phs=.4*-a.sample;a.tm=a.q1+2*a.phs-.01;a.flip+=1;a.flip*=below(a.flip,2);a.xp=0;a.yp=(.2*a.flip-.1)*a.sample;a.zp=0;a.ang=29*-a.tm+.4*Math.sin(76*a.tm+4*a.time);a.sa=Math.sin(a.ang);a.ca=Math.cos(a.ang);a.xr=a.xp*a.sa+a.yp*a.ca;a.yr=a.xp*a.ca-a.yp*a.sa;a.zr=a.zp;a.xp=a.xr;a.yp=a.yr+.05+.2*(.5*Math.sin(a.tm)+.5)+.05;a.zp=a.zr;a.ang=Math.sin(2*a.tm);a.xq=a.xp;a.sa=Math.sin(a.ang);a.ca=Math.cos(a.ang);a.yq=a.yp*a.sa+a.zp*a.ca;a.zq=a.yp*a.ca-a.zp*a.sa;a.ang=
8*a.tm;a.sa=Math.sin(a.ang);a.ca=Math.cos(a.ang);a.xp=a.xq*a.sa+a.yq*a.ca;a.yp=a.xq*a.ca-a.yq*a.sa;a.zp=a.zq;a.zp-=.3;a.ang=3.14+2.5*Math.sin(2*a.tm-.5);a.xq=a.xp;a.sa=Math.sin(a.ang);a.ca=Math.cos(a.ang);a.yq=a.yp*a.sa+a.zp*a.ca;a.zq=a.yp*a.ca-a.zp*a.sa;a.ang=-1+Math.cos(3*a.tm+.5);a.xp=a.xq*a.sa+a.yq*a.ca;a.yp=a.xq*a.ca-a.yq*a.sa;a.zp=a.zq;a.zp-=.35;a.ang=1.75*Math.cos(1*a.tm)-1.05;a.sa=Math.sin(a.ang);a.ca=Math.cos(a.ang);a.xq=a.xp*a.sa+a.zp*a.ca;a.yq=a.yp;a.zq=a.xp*a.ca-a.zp*a.sa;a.ang=Math.cos(a.tm);
a.xp=a.xq;a.sa=Math.sin(a.ang);a.ca=Math.cos(a.ang);a.yp=a.yq*a.ca-a.zq*a.sa;a.zp=a.yq*a.sa+a.zq*a.ca;a.zp+=1.5;a.xs=div(a.xp,a.zp);a.ys=div(a.yp,a.zp);a.x=a.xs+.5;a.y=1.3*a.ys+.5;a.a=1-a.sample;`},{baseVals:{enabled:1,usedots:1,thick:1,g:.72,b:.1},init_eqs_str:`a.n=0;a.yq=0;a.xp=0;a.yr=0;a.xs=0;a.yp=0;a.xr=0;a.q1=0;a.xq=0;a.flip=0;a.ca=0;a.ys=0;a.sa=0;a.zq=0;a.phs=0;a.ang=0;a.tm=0;a.zp=0;a.zr=0;`,frame_eqs_str:``,point_eqs_str:`a.n=6.283*a.sample;a.phs=.4*-a.sample;a.tm=a.q1+2*a.phs-.02;a.flip+=1;a.flip*=below(a.flip,2);a.xp=0;a.yp=(.4*a.flip-.2)*a.sample;a.zp=0;a.ang=23*a.tm+.3*Math.sin(76*a.tm+4*a.time);a.sa=Math.sin(a.ang);a.ca=Math.cos(a.ang);a.xr=a.xp*a.sa+a.yp*a.ca;a.yr=a.xp*a.ca-a.yp*a.sa;a.zr=a.zp;a.xp=a.xr;a.yp=a.yr+.05+.2*(.5*Math.sin(a.tm)+.5)+.05;a.zp=a.zr;a.ang=Math.sin(2*a.tm);a.xq=a.xp;a.sa=Math.sin(a.ang);a.ca=Math.cos(a.ang);a.yq=a.yp*a.sa+a.zp*a.ca;a.zq=a.yp*a.ca-a.zp*a.sa;a.ang=
8*a.tm;a.sa=Math.sin(a.ang);a.ca=Math.cos(a.ang);a.xp=a.xq*a.sa+a.yq*a.ca;a.yp=a.xq*a.ca-a.yq*a.sa;a.zp=a.zq;a.zp-=.3;a.ang=3.14+2.5*Math.sin(2*a.tm-.5);a.xq=a.xp;a.sa=Math.sin(a.ang);a.ca=Math.cos(a.ang);a.yq=a.yp*a.sa+a.zp*a.ca;a.zq=a.yp*a.ca-a.zp*a.sa;a.ang=-1+Math.cos(3*a.tm+.5);a.xp=a.xq*a.sa+a.yq*a.ca;a.yp=a.xq*a.ca-a.yq*a.sa;a.zp=a.zq;a.zp-=.35;a.ang=1.75*Math.cos(1*a.tm)-1.05;a.sa=Math.sin(a.ang);a.ca=Math.cos(a.ang);a.xq=a.xp*a.sa+a.zp*a.ca;a.yq=a.yp;a.zq=a.xp*a.ca-a.zp*a.sa;a.ang=Math.cos(a.tm);
a.xp=a.xq;a.sa=Math.sin(a.ang);a.ca=Math.cos(a.ang);a.yp=a.yq*a.ca-a.zq*a.sa;a.zp=a.yq*a.sa+a.zq*a.ca;a.zp+=1.5;a.xs=div(a.xp,a.zp);a.ys=div(a.yp,a.zp);a.x=a.xs+.5;a.y=1.3*a.ys+.5;a.a=1-a.sample;`},{baseVals:{enabled:1,usedots:1,thick:1,g:.7,b:.5},init_eqs_str:`a.n=0;a.yq=0;a.xp=0;a.yr=0;a.xs=0;a.yp=0;a.xr=0;a.q1=0;a.xq=0;a.flip=0;a.ca=0;a.ys=0;a.sa=0;a.zq=0;a.phs=0;a.ang=0;a.tm=0;a.zp=0;a.zr=0;`,frame_eqs_str:``,point_eqs_str:`a.n=6.283*a.sample;a.phs=.4*-a.sample;a.tm=a.q1+2*a.phs-.03;a.flip+=1;a.flip*=below(a.flip,2);a.xp=0;a.yp=(.6*a.flip-.3)*a.sample;a.zp=0;a.ang=4*-a.tm+.2*Math.sin(76*a.tm+4*a.time);a.sa=Math.sin(a.ang);a.ca=Math.cos(a.ang);a.xr=a.xp*a.sa+a.yp*a.ca;a.yr=a.xp*a.ca-a.yp*a.sa;a.zr=a.zp;a.xp=a.xr;a.yp=a.yr+.05+.2*(.5*Math.sin(a.tm)+.5)+.05;a.zp=a.zr;a.ang=Math.sin(2*a.tm);a.xq=a.xp;a.sa=Math.sin(a.ang);a.ca=Math.cos(a.ang);a.yq=a.yp*a.sa+a.zp*a.ca;a.zq=a.yp*a.ca-a.zp*a.sa;a.ang=
8*a.tm;a.sa=Math.sin(a.ang);a.ca=Math.cos(a.ang);a.xp=a.xq*a.sa+a.yq*a.ca;a.yp=a.xq*a.ca-a.yq*a.sa;a.zp=a.zq;a.zp-=.3;a.ang=3.14+2.5*Math.sin(2*a.tm-.5);a.xq=a.xp;a.sa=Math.sin(a.ang);a.ca=Math.cos(a.ang);a.yq=a.yp*a.sa+a.zp*a.ca;a.zq=a.yp*a.ca-a.zp*a.sa;a.ang=-1+Math.cos(3*a.tm+.5);a.xp=a.xq*a.sa+a.yq*a.ca;a.yp=a.xq*a.ca-a.yq*a.sa;a.zp=a.zq;a.zp-=.35;a.ang=1.75*Math.cos(1*a.tm)-1.05;a.sa=Math.sin(a.ang);a.ca=Math.cos(a.ang);a.xq=a.xp*a.sa+a.zp*a.ca;a.yq=a.yp;a.zq=a.xp*a.ca-a.zp*a.sa;a.ang=Math.cos(a.tm);
a.xp=a.xq;a.sa=Math.sin(a.ang);a.ca=Math.cos(a.ang);a.yp=a.yq*a.ca-a.zq*a.sa;a.zp=a.yq*a.sa+a.zq*a.ca;a.zp+=1.5;a.xs=div(a.xp,a.zp);a.ys=div(a.yp,a.zp);a.x=a.xs+.5;a.y=1.3*a.ys+.5;a.a=1-a.sample;`}],u=`a.zm=0;a.dcsp=0;a.vol=0;a.mtime=0;a.q1=0;a.gamma=0;a.mv_x=64;a.mv_y=48;a.nut=0;a.stp=0;a.stq=0;a.rtp=0;a.rtq=0;a.wvr=0;a.decay=.8;a.dcsp=.4;`,d=`a.dcsp+=.01;a.decay=Math.min(a.dcsp,1);a.monitor=a.decay;a.vol=.25*(a.bass+a.mid+a.treb);a.vol*=a.vol;a.mtime+=.01*a.vol*div(70,a.fps);a.q1=.75*a.mtime;a.gamma=1+.7*Math.min(.8*a.vol,1);a.warp=.05*a.vol;`,f=`a.zm=1;a.sx=-a.zm;a.sy=a.zm;`,p={baseVals:s,shapes:c,waves:l,init_eqs_str:u,frame_eqs_str:d,pixel_eqs_str:f,warp:``,comp:``},m={rating:0,gammaadj:1,decay:1,echo_zoom:1,echo_orient:1,wave_thick:1,wave_brighten:0,wrap:0,brighten:1,wave_a:.401,wave_scale:3.177,wave_smoothing:0,wave_mystery:-.4,modwavealphastart:1,modwavealphaend:1,warpanimspeed:2.289,warpscale:5.472,zoomexp:.01,zoom:.9901,warp:1.8566,ob_size:.005,ob_a:1,ib_size:0,ib_r:1,ib_g:0,ib_b:0,ib_a:1,mv_x:64,mv_y:48,mv_l:0,mv_b:0,mv_a:0},h=[{baseVals:{enabled:1,sides:12,additive:1,num_inst:1024,y:.55,rad:.024,tex_zoom:.7345,r:0,g:1,g2:0,border_a:0},init_eqs_str:`a.d=0;a.zoom=0;a.w1=0;a.q3=0;a.w2=0;a.q4=0;a.w3=0;a.q5=0;a.i=0;a.my_x=0;a.i=0;a.my_y=0;a.i=0;a.my_z=0;a.x1=0;a.w1=0;a.my_x=0;a.w1=0;a.my_y=0;a.y1=0;a.w1=0;a.my_x=0;a.w1=0;a.my_y=0;a.z1=0;a.my_z=0;a.x2=0;a.w2=0;a.x1=0;a.w2=0;a.z1=0;a.z2=0;a.w2=0;a.x1=0;a.w2=0;a.z1=0;a.y2=0;a.y1=0;a.y3=0;a.w3=0;a.y2=0;a.w3=0;a.z2=0;a.z3=0;a.w3=0;a.y2=0;a.w3=0;a.z2=0;a.x3=0;a.x2=0;a.l=0;a.x3=0;a.x3=0;a.y3=0;a.y3=0;a.w=0;a.x3=0;a.y3=0;a.p=0;a.d=0;a.z3=0;a.l=0;a.d=0;a.x3=0;a.x3=0;a.y3=0;a.y3=0;a.z3=
0;a.d=0;a.z3=0;a.d=0;a.d=0;a.my_x=0;a.zoom=0;a.w=0;a.p=0;a.my_y=0;a.zoom=0;a.w=0;a.p=0;a.my_x=0;a.my_y=0;a.q2=0;a.q1=0;`,frame_eqs_str:`a.d=1.1;a.zoom=.7;a.w1=a.q3;a.w2=a.q4;a.w3=a.q5;a.i=a.instance+.001;a.my_x=div(mod(div(a.i,32),32),32)-.5;a.my_y=div(mod(a.i,32),32)-.5;a.my_z=0;a.x1=Math.cos(a.w1)*a.my_x+Math.sin(a.w1)*a.my_y;a.y1=-Math.sin(a.w1)*a.my_x+Math.cos(a.w1)*a.my_y;a.z1=a.my_z;a.x2=Math.cos(a.w2)*a.x1+Math.sin(a.w2)*a.z1;a.z2=-Math.sin(a.w2)*a.x1+Math.cos(a.w2)*a.z1;a.y2=a.y1;a.y3=Math.cos(a.w3)*a.y2+Math.sin(a.w3)*a.z2;a.z3=-Math.sin(a.w3)*a.y2+Math.cos(a.w3)*a.z2;a.x3=a.x2;a.l=sqrt(a.x3*a.x3+a.y3*
a.y3);a.w=Math.atan2(a.x3,a.y3);a.p=Math.tan(Math.asin(1)+Math.atan2(a.d+a.z3,a.l));a.d=sqrt(a.x3*a.x3+a.y3*a.y3+(a.z3+a.d)*(a.z3+a.d));a.rad=div(a.rad,a.d);a.my_x=a.zoom*Math.sin(a.w)*a.p;a.my_y=a.zoom*Math.cos(a.w)*a.p;a.x=.5+a.my_x;a.y=.5+a.my_y;a.x=.5+div(a.x-.5,a.q2);a.y=.5+div(a.y-.5,a.q1);`},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],g=[{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],_=`a.q1=0;a.q2=0;a.b=0;a.m=0;a.t=0;a.q3=0;a.q4=0;a.q5=0;`,v=`a.wave_a=0;a.q1=a.aspectx;a.q2=a.aspecty;a.b+=a.bass*a.bass*.5;a.m+=a.mid*a.mid*.5;a.t+=a.treb*a.treb*.5;a.q3=.012*a.b;a.q4=.012*a.m;a.q5=.012*a.t;`,y=`uniform sampler2D sampler_manyfish;
 shader_body { 
  vec2 tmpvar_1;
  tmpvar_1 = (texsize.zw * 4.0);
  vec2 tmpvar_2;
  tmpvar_2.x = (((texture (sampler_blur1, 
    (uv + (vec2(1.0, 0.0) * tmpvar_1))
  ).xyz * scale1) + bias1) - ((texture (sampler_blur1, 
    (uv - (vec2(1.0, 0.0) * tmpvar_1))
  ).xyz * scale1) + bias1)).y;
  tmpvar_2.y = (((texture (sampler_blur1, 
    (uv + (vec2(0.0, 1.0) * tmpvar_1))
  ).xyz * scale1) + bias1) - ((texture (sampler_blur1, 
    (uv - (vec2(0.0, 1.0) * tmpvar_1))
  ).xyz * scale1) + bias1)).y;
  vec4 tmpvar_3;
  tmpvar_3.w = 1.0;
  tmpvar_3.xyz = mix (texture (sampler_manyfish, (uv - (tmpvar_2 * 0.4))), vec4(0.0, 0.0, 0.4, 0.0), vec4((texture (sampler_main, uv).y * 0.7))).xyz;
  ret = tmpvar_3.xyz;
 }`,b={baseVals:m,shapes:h,waves:g,init_eqs_str:_,frame_eqs_str:v,pixel_eqs_str:``,pixel_eqs:``,warp:``,comp:y},x={rating:4,gammaadj:1.21,decay:1,echo_zoom:1,echo_alpha:.5,wave_thick:1,wave_brighten:0,wrap:0,wave_a:.004,wave_scale:.073,wave_smoothing:0,wave_mystery:-.44,modwavealphastart:1,modwavealphaend:1,warpanimspeed:.01,warpscale:100,zoomexp:.92178,fshader:1,zoom:.9901,warp:.01,wave_y:.04,ob_size:0,ob_a:1,ib_size:0,ib_r:0,ib_g:0,ib_b:0,ib_a:1,mv_x:64,mv_y:48,mv_l:.5,mv_r:0,mv_g:0,mv_b:0,mv_a:0},S=[{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],C=[{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:1,thick:1,additive:1,scaling:1.69136,smoothing:0,g:0,b:0},init_eqs_str:`a.d=0;a.xx=0;a.q6=0;a.q1=0;a.q5=0;a.q9=0;a.q10=0;a.yyy=0;a.xxx=0;a.dd=0;a.q4=0;a.q2=0;a.q3=0;a.yy=0;a.q7=0;a.q8=0;`,frame_eqs_str:``,point_eqs_str:`a.sample=1-a.sample;a.xxx=a.xx;a.yyy=a.yy;a.xx=pow(a.sample,5)*a.q1+5*pow(a.sample,4)*(1-a.sample)*a.q1+10*pow(a.sample,3)*sqr(1-a.sample)*a.q2+10*sqr(a.sample)*pow(1-a.sample,3)*a.q3+5*pow(1-a.sample,4)*a.sample*a.q4+pow(1-a.sample,5)*a.q4;a.yy=pow(a.sample,5)*a.q5+5*pow(a.sample,4)*(1-a.sample)*a.q5+10*pow(a.sample,3)*sqr(1-a.sample)*a.q6+10*sqr(a.sample)*pow(1-a.sample,3)*a.q7+5*pow(1-a.sample,4)*a.sample*a.q8+pow(1-a.sample,5)*a.q8;a.d=div(1,sqrt(sqr(a.xx-a.xxx)+sqr(a.yy-
a.yyy)));a.dd=a.sample*(1-a.sample)*Math.sin(180*a.sample)*a.d*.1;a.x=a.xx+(a.yy-a.yyy)*a.dd;a.y=a.yy-(a.xx-a.xxx)*a.dd;a.x=.5+(a.x-.5)*a.q9;a.y=.5+(a.y-.5)*a.q10;`},{baseVals:{enabled:0}}],w=`a.y3=0;a.y1=0;a.xx=0;a.q12=0;a.x1=0;a.vx3=0;a.q13=0;a.q6=0;a.dt=0;a.q1=0;a.q5=0;a.q9=0;a.d1=0;a.si1=0;a.vx4=0;a.x3=0;a.d2=0;a.q11=0;a.q10=0;a.xx2=0;a.q4=0;a.yy1=0;a.vy4=0;a.dir=0;a.x4=0;a.x2=0;a.vy2=0;a.y2=0;a.size=0;a.q2=0;a.q14=0;a.si2=0;a.vx2=0;a.q3=0;a.yy=0;a.y4=0;a.q7=0;a.vy3=0;a.strength=0;a.xx1=0;a.velocity=0;a.q8=0;a.x1=.9;a.y1=.5;a.x2=.5;a.y2=.5;a.x3=.5;a.y3=.5;a.x4=.5;a.y4=.5;`,T=`a.zoom=1;a.warp=0;a.wave_a=0;a.xx1=.9*a.xx1+.01*a.bass;a.xx2=.9*a.xx2+.01*a.treb;a.yy1=.94*a.yy1+.0075*(a.treb+a.bass);a.x1=.5+2*(a.xx1-a.xx2);a.y1=.4+1.5*a.yy1;a.dt=div(.03,a.fps);a.vx2=a.vx2*(1-2*a.dt)+10*a.dt*(a.x1+a.x3-2*a.x2);a.vy2=a.vy2*(1-2*a.dt)+a.dt*(10*(a.y1+a.y3-2*a.y2)-.5);a.vx3=a.vx3*(1-2*a.dt)+10*a.dt*(a.x2+a.x4-2*a.x3);a.vy3=a.vy3*(1-2*a.dt)+a.dt*(10*(a.y2+a.y4-2*a.y3)-.5);a.vx4=a.vx4*(1-2*a.dt)+10*a.dt*(a.x3-a.x4);a.vy4=a.vy4*(1-2*a.dt)+a.dt*(10*(a.y3-a.y4)-
.5);a.x2+=a.vx2;a.y2+=a.vy2;a.x3+=a.vx3;a.y3+=a.vy3;a.x4+=a.vx4;a.y4+=a.vy4;a.vx2=.00001<Math.abs(above(a.x2,0))?a.vx2:.5*Math.abs(a.vx2);a.vx2=.00001<Math.abs(below(a.x2,1))?a.vx2:.5*-Math.abs(a.vx2);a.vx3=.00001<Math.abs(above(a.x3,0))?a.vx3:.5*Math.abs(a.vx3);a.vx3=.00001<Math.abs(below(a.x3,1))?a.vx3:.5*-Math.abs(a.vx3);a.vx4=.00001<Math.abs(above(a.x4,0))?a.vx4:.5*Math.abs(a.vx4);a.vx4=.00001<Math.abs(below(a.x4,1))?a.vx4:.5*-Math.abs(a.vx4);a.vy2=.00001<Math.abs(above(a.y2,0))?a.vy2:.5*Math.abs(a.vy2);
a.vy2=.00001<Math.abs(below(a.y2,1))?a.vy2:.5*-Math.abs(a.vy2);a.vy3=.00001<Math.abs(above(a.y3,0))?a.vy3:.5*Math.abs(a.vy3);a.vy3=.00001<Math.abs(below(a.y3,1))?a.vy3:.5*-Math.abs(a.vy3);a.vy4=.00001<Math.abs(above(a.y4,0))?a.vy4:.5*Math.abs(a.vy4);a.vy4=.00001<Math.abs(below(a.y4,1))?a.vy4:.5*-Math.abs(a.vy4);a.q1=a.x1;a.q2=a.x2;a.q3=a.x3;a.q4=a.x4;a.q5=a.y1;a.q6=a.y2;a.q7=a.y3;a.q8=a.y4;a.q9=div(1,a.aspectx);a.q10=div(1,a.aspecty);a.q11=a.aspectx;a.q12=a.aspecty;a.q13=.8*sqrt(a.vx4*a.vx4+a.vy4*
a.vy4);a.q14=Math.atan2(a.vx4,a.vy4);`,E=`a.x=.5+(a.x-.5)*a.q11;a.y=.5+(a.y-.5)*a.q12;a.dir=-a.q14+Math.asin(1);a.velocity=a.q13;a.strength=100;a.size=.07;a.xx=a.q4;a.yy=1-a.q8;a.x1=a.xx+Math.cos(a.dir+1.5708)*a.size;a.y1=a.yy-Math.sin(a.dir+1.5708)*a.size;a.x2=a.xx-Math.cos(a.dir+1.5708)*a.size;a.y2=a.yy+Math.sin(a.dir+1.5708)*a.size;a.d1=sqrt((a.x1-a.x)*(a.x1-a.x)+(a.y1-a.y)*(a.y1-a.y))-2*a.size;a.si1=1-div(1,1+pow(2,100*-a.d1));a.d2=sqrt((a.x2-a.x)*(a.x2-a.x)+(a.y2-a.y)*(a.y2-a.y))-2*a.size;a.si2=1-div(1,1+pow(2,
100*-a.d2));a.dx=(a.si1*Math.sin(a.y1-a.y)*a.d1-a.si2*Math.sin(a.y2-a.y)*a.d2)*a.strength*a.velocity;a.dy=(-a.si1*Math.sin(a.x1-a.x)*a.d1+a.si2*Math.sin(a.x2-a.x)*a.d2)*a.strength*a.velocity;`,D=` shader_body { 
  vec3 ret_1;
  vec2 tmpvar_2;
  tmpvar_2 = ((uv * texsize.xy) * texsize_noise_lq.zw);
  vec2 tmpvar_3;
  tmpvar_3 = (texsize.zw * 4.0);
  vec2 tmpvar_4;
  tmpvar_4.x = (((2.0 * 
    ((texture (sampler_blur1, (uv + (vec2(1.0, 0.0) * tmpvar_3))).xyz * scale1) + bias1)
  ) - (2.0 * 
    ((texture (sampler_blur1, (uv - (vec2(1.0, 0.0) * tmpvar_3))).xyz * scale1) + bias1)
  )).y * 0.5);
  tmpvar_4.y = (((2.0 * 
    ((texture (sampler_blur1, (uv + (vec2(0.0, 1.0) * tmpvar_3))).xyz * scale1) + bias1)
  ) - (2.0 * 
    ((texture (sampler_blur1, (uv - (vec2(0.0, 1.0) * tmpvar_3))).xyz * scale1) + bias1)
  )).y * 0.5);
  ret_1.y = texture (sampler_fw_main, clamp ((uv + (
    (tmpvar_4 * texsize.zw)
   * 4.0)), 0.0, 1.0)).y;
  ret_1.y = (ret_1.y + ((
    (ret_1 - ((texture (sampler_blur1, uv).xyz * scale1) + bias1))
  .y * 0.025) + (-0.01 + 
    (texture (sampler_main, uv).x * 0.1)
  )));
  ret_1.y = (ret_1.y + ((texture (sampler_noise_lq, tmpvar_2).y - 0.5) * 0.02));
  vec2 tmpvar_5;
  tmpvar_5.x = (((2.0 * 
    ((texture (sampler_blur1, (uv + (vec2(1.0, 0.0) * tmpvar_3))).xyz * scale1) + bias1)
  ) - (2.0 * 
    ((texture (sampler_blur1, (uv - (vec2(1.0, 0.0) * tmpvar_3))).xyz * scale1) + bias1)
  )).z * 0.5);
  tmpvar_5.y = (((2.0 * 
    ((texture (sampler_blur1, (uv + (vec2(0.0, 1.0) * tmpvar_3))).xyz * scale1) + bias1)
  ) - (2.0 * 
    ((texture (sampler_blur1, (uv - (vec2(0.0, 1.0) * tmpvar_3))).xyz * scale1) + bias1)
  )).z * 0.5);
  ret_1.z = ((texture (sampler_main, (uv - 
    ((tmpvar_5 * texsize.zw) * 4.0)
  )).z - (ret_1.y * 0.01)) + 0.004);
  ret_1.z = (ret_1.z + ((texture (sampler_noise_lq, tmpvar_2).y - 0.5) * 0.01));
  vec4 tmpvar_6;
  tmpvar_6.w = 1.0;
  tmpvar_6.xyz = ret_1;
  ret = tmpvar_6.xyz;
 }`,O=` shader_body { 
  vec2 dz_1;
  vec2 d_2;
  vec3 ret_3;
  vec2 tmpvar_4;
  vec2 tmpvar_5;
  tmpvar_5 = (vec2(1.0, 0.0) * texsize.zw);
  tmpvar_4.x = (texture (sampler_main, (uv + tmpvar_5)).xyz - texture (sampler_main, (uv - tmpvar_5)).xyz).y;
  vec2 tmpvar_6;
  tmpvar_6 = (vec2(0.0, 1.0) * texsize.zw);
  tmpvar_4.y = (texture (sampler_main, (uv + tmpvar_6)).xyz - texture (sampler_main, (uv - tmpvar_6)).xyz).y;
  d_2 = (texsize.zw * 2.0);
  vec2 tmpvar_7;
  tmpvar_7.x = (((texture (sampler_blur1, 
    (uv + (vec2(1.0, 0.0) * d_2))
  ).xyz * scale1) + bias1) - ((texture (sampler_blur1, 
    (uv - (vec2(1.0, 0.0) * d_2))
  ).xyz * scale1) + bias1)).y;
  tmpvar_7.y = (((texture (sampler_blur1, 
    (uv + (vec2(0.0, 1.0) * d_2))
  ).xyz * scale1) + bias1) - ((texture (sampler_blur1, 
    (uv - (vec2(0.0, 1.0) * d_2))
  ).xyz * scale1) + bias1)).y;
  dz_1 = ((tmpvar_4 * 3.0) + tmpvar_7);
  ret_3 = (vec3(((
    pow ((sqrt(dot (dz_1, dz_1)) * 0.8), 0.7)
   + 
    (((texture (sampler_blur2, uv).xyz * scale2) + bias2).y * 0.4)
  ) - 0.1)) * vec3(0.4, 0.5, 0.7));
  vec2 tmpvar_8;
  tmpvar_8.x = q19;
  tmpvar_8.y = q20;
  vec3 tmpvar_9;
  tmpvar_9 = mix (mix (ret_3, vec3(1.0, 0.4, 0.0), texture (sampler_main, fract(
    ((0.5 + (uv - 0.5)) + (tmpvar_8 * vec2(-1.0, 1.0)))
  )).xxx), vec3(1.0, 1.0, 1.0), texture (sampler_main, uv).zzz);
  ret_3 = tmpvar_9;
  vec4 tmpvar_10;
  tmpvar_10.w = 1.0;
  tmpvar_10.xyz = tmpvar_9;
  ret = tmpvar_10.xyz;
 }`,k={baseVals:x,shapes:S,waves:C,init_eqs_str:w,frame_eqs_str:T,pixel_eqs_str:E,warp:D,comp:O},A={rating:5,gammaadj:1.56,decay:1,echo_zoom:.362,echo_orient:1,wave_thick:1,wave_brighten:0,darken:1,wave_a:.001,wave_scale:1.599,wave_smoothing:0,wave_mystery:-.5,modwavealphastart:2,modwavealphaend:2,warpscale:.107,zoomexp:.1584,fshader:1,warp:.01,wave_r:.51,wave_g:.5,ob_size:.05,ob_a:1,ib_r:1,ib_g:1,ib_b:1,ib_a:1,mv_x:64,mv_y:48,mv_l:.5,mv_r:0,mv_g:0,mv_b:0,mv_a:.05},j=[{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],M=[{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],N=`a.y3=0;a.y1=0;a.w2=0;a.ref_ang=0;a.x1=0;a.vx3=0;a.q6=0;a.q1=0;a.q5=0;a.vx1=0;a.vx4=0;a.x3=0;a.q4=0;a.vy4=0;a.bounce=0;a.x4=0;a.w1=0;a.r=0;a.x2=0;a.vy2=0;a.y2=0;a.vy1=0;a.q2=0;a.v1=0;a.vx2=0;a.q3=0;a.y4=0;a.q7=0;a.vy3=0;a.v2=0;a.q8=0;a.x1=.5;a.x2=.51;a.y2=.9;a.y1=.7;a.x3=.8;a.y3=.5;a.x4=.2;a.y4=.5;a.ax1=0;a.ay1=0;a.ax2=0;a.ay2=0;a.ax3=0;a.ay3=0;a.vx1=0;a.vx2=0;`,P=`a.wave_a=0;a.r=.04+.004*Math.max(a.bass_att,a.treb_att);a.bounce=below(a.y1,a.r);a.y1+=a.vy1;a.vy1=.00001<Math.abs(a.bounce)?.94*Math.abs(a.vy1)+.1*(a.r-a.y1):a.vy1-div(.006,a.fps);a.bounce=below(a.x1,a.r);a.x1+=a.vx1;a.vx1=.00001<Math.abs(a.bounce)?.94*Math.abs(a.vx1)+.1*(a.r-a.x1):a.vx1;a.bounce=above(a.x1,1-a.r);a.vx1=.00001<Math.abs(a.bounce)?.94*-Math.abs(a.vx1)+.04*(1-a.r-a.x1):a.vx1;a.bounce=below(a.y2,a.r);a.y2+=a.vy2;a.vy2=.00001<Math.abs(a.bounce)?.94*Math.abs(a.vy2)+
.1*(a.r-a.y2):a.vy2-div(.006,a.fps);a.bounce=below(a.x2,a.r);a.x2+=a.vx2;a.vx2=.00001<Math.abs(a.bounce)?.94*Math.abs(a.vx2)+.1*(a.r-a.x2):a.vx2;a.bounce=above(a.x2,1-a.r);a.vx2=.00001<Math.abs(a.bounce)?.94*-Math.abs(a.vx2)+.1*(1-a.r-a.x2):a.vx2;a.bounce=below(a.y3,a.r);a.y3+=a.vy3;a.vy3=.00001<Math.abs(a.bounce)?.94*Math.abs(a.vy3)+.1*(a.r-a.y3):a.vy3-div(.006,a.fps);a.bounce=below(a.x3,a.r);a.x3+=a.vx3;a.vx3=.00001<Math.abs(a.bounce)?.94*Math.abs(a.vx3)+.1*(a.r-a.x3):a.vx3;a.bounce=above(a.x3,
1-a.r);a.vx3=.00001<Math.abs(a.bounce)?.94*-Math.abs(a.vx3)+.1*(1-a.r-a.x3):a.vx3;a.bounce=below(a.y4,a.r);a.y4+=a.vy4;a.vy4=.00001<Math.abs(a.bounce)?.94*Math.abs(a.vy4)+.1*(a.r-a.y4):a.vy4-div(.006,a.fps);a.bounce=below(a.x4,a.r);a.x4+=a.vx4;a.vx4=.00001<Math.abs(a.bounce)?.94*Math.abs(a.vx4)+.1*(a.r-a.x4):a.vx4;a.bounce=above(a.x4,1-a.r);a.vx4=.00001<Math.abs(a.bounce)?.94*-Math.abs(a.vx4)+.1*(1-a.r-a.x4):a.vx4;a.bounce=below(sqrt(sqr(a.x1+a.vx1-a.x2-a.vx2)+sqr(a.y1+a.vy1-a.y2-a.vy2)),2*a.r);a.ref_ang=
Math.atan2(a.x2-a.x1,a.y2-a.y1)+Math.asin(1);a.v1=sqrt(a.vx1*a.vx1+a.vy1*a.vy1);a.v2=sqrt(a.vx2*a.vx2+a.vy2*a.vy2);a.w1=Math.atan2(a.vx1,a.vy1);a.w2=Math.atan2(a.vx2,a.vy2);a.vx1=.00001<Math.abs(a.bounce)?Math.sin(a.ref_ang)*a.v1*Math.cos(a.w1-a.ref_ang)+Math.sin(a.ref_ang+Math.asin(1))*a.v2*Math.cos(a.w2-a.ref_ang-Math.asin(1)):a.vx1;a.vy1=.00001<Math.abs(a.bounce)?Math.cos(a.ref_ang)*a.v1*Math.cos(a.w1-a.ref_ang)+Math.cos(a.ref_ang+Math.asin(1))*a.v2*Math.cos(a.w2-a.ref_ang-Math.asin(1)):a.vy1;
a.vx2=.00001<Math.abs(a.bounce)?Math.sin(a.ref_ang)*a.v2*Math.cos(a.w2-a.ref_ang)+Math.sin(a.ref_ang+Math.asin(1))*a.v1*Math.cos(a.w1-a.ref_ang-Math.asin(1)):a.vx2;a.vy2=.00001<Math.abs(a.bounce)?Math.cos(a.ref_ang)*a.v2*Math.cos(a.w2-a.ref_ang)+Math.cos(a.ref_ang+Math.asin(1))*a.v1*Math.cos(a.w1-a.ref_ang-Math.asin(1)):a.vy2;a.bounce=below(sqrt(sqr(a.x1+a.vx1-a.x3-a.vx3)+sqr(a.y1+a.vy1-a.y3-a.vy3)),2*a.r);a.ref_ang=Math.atan2(a.x3-a.x1,a.y3-a.y1)+Math.asin(1);a.v1=sqrt(a.vx1*a.vx1+a.vy1*a.vy1);a.v2=
sqrt(a.vx3*a.vx3+a.vy3*a.vy3);a.w1=Math.atan2(a.vx1,a.vy1);a.w2=Math.atan2(a.vx3,a.vy3);a.vx1=.00001<Math.abs(a.bounce)?Math.sin(a.ref_ang)*a.v1*Math.cos(a.w1-a.ref_ang)+Math.sin(a.ref_ang+Math.asin(1))*a.v2*Math.cos(a.w2-a.ref_ang-Math.asin(1)):a.vx1;a.vy1=.00001<Math.abs(a.bounce)?Math.cos(a.ref_ang)*a.v1*Math.cos(a.w1-a.ref_ang)+Math.cos(a.ref_ang+Math.asin(1))*a.v2*Math.cos(a.w2-a.ref_ang-Math.asin(1)):a.vy1;a.vx3=.00001<Math.abs(a.bounce)?Math.sin(a.ref_ang)*a.v2*Math.cos(a.w2-a.ref_ang)+Math.sin(a.ref_ang+
Math.asin(1))*a.v1*Math.cos(a.w1-a.ref_ang-Math.asin(1)):a.vx3;a.vy3=.00001<Math.abs(a.bounce)?Math.cos(a.ref_ang)*a.v2*Math.cos(a.w2-a.ref_ang)+Math.cos(a.ref_ang+Math.asin(1))*a.v1*Math.cos(a.w1-a.ref_ang-Math.asin(1)):a.vy3;a.bounce=below(sqrt(sqr(a.x2+a.vx2-a.x3-a.vx3)+sqr(a.y2+a.vy2-a.y3-a.vy3)),2*a.r);a.ref_ang=Math.atan2(a.x3-a.x2,a.y3-a.y2)+Math.asin(1);a.v1=sqrt(a.vx2*a.vx2+a.vy2*a.vy2);a.v2=sqrt(a.vx3*a.vx3+a.vy3*a.vy3);a.w1=Math.atan2(a.vx2,a.vy2);a.w2=Math.atan2(a.vx3,a.vy3);a.vx2=.00001<
Math.abs(a.bounce)?Math.sin(a.ref_ang)*a.v1*Math.cos(a.w1-a.ref_ang)+Math.sin(a.ref_ang+Math.asin(1))*a.v2*Math.cos(a.w2-a.ref_ang-Math.asin(1)):a.vx2;a.vy2=.00001<Math.abs(a.bounce)?Math.cos(a.ref_ang)*a.v1*Math.cos(a.w1-a.ref_ang)+Math.cos(a.ref_ang+Math.asin(1))*a.v2*Math.cos(a.w2-a.ref_ang-Math.asin(1)):a.vy2;a.vx3=.00001<Math.abs(a.bounce)?Math.sin(a.ref_ang)*a.v2*Math.cos(a.w2-a.ref_ang)+Math.sin(a.ref_ang+Math.asin(1))*a.v1*Math.cos(a.w1-a.ref_ang-Math.asin(1)):a.vx3;a.vy3=.00001<Math.abs(a.bounce)?
Math.cos(a.ref_ang)*a.v2*Math.cos(a.w2-a.ref_ang)+Math.cos(a.ref_ang+Math.asin(1))*a.v1*Math.cos(a.w1-a.ref_ang-Math.asin(1)):a.vy3;a.bounce=below(sqrt(sqr(a.x1+a.vx1-a.x4-a.vx4)+sqr(a.y1+a.vy1-a.y4-a.vy4)),2*a.r);a.ref_ang=Math.atan2(a.x4-a.x1,a.y4-a.y1)+Math.asin(1);a.v1=sqrt(a.vx1*a.vx1+a.vy1*a.vy1);a.v2=sqrt(a.vx4*a.vx4+a.vy4*a.vy4);a.w1=Math.atan2(a.vx1,a.vy1);a.w2=Math.atan2(a.vx4,a.vy4);a.vx1=.00001<Math.abs(a.bounce)?Math.sin(a.ref_ang)*a.v1*Math.cos(a.w1-a.ref_ang)+Math.sin(a.ref_ang+Math.asin(1))*
a.v2*Math.cos(a.w2-a.ref_ang-Math.asin(1)):a.vx1;a.vy1=.00001<Math.abs(a.bounce)?Math.cos(a.ref_ang)*a.v1*Math.cos(a.w1-a.ref_ang)+Math.cos(a.ref_ang+Math.asin(1))*a.v2*Math.cos(a.w2-a.ref_ang-Math.asin(1)):a.vy1;a.vx4=.00001<Math.abs(a.bounce)?Math.sin(a.ref_ang)*a.v2*Math.cos(a.w2-a.ref_ang)+Math.sin(a.ref_ang+Math.asin(1))*a.v1*Math.cos(a.w1-a.ref_ang-Math.asin(1)):a.vx4;a.vy4=.00001<Math.abs(a.bounce)?Math.cos(a.ref_ang)*a.v2*Math.cos(a.w2-a.ref_ang)+Math.cos(a.ref_ang+Math.asin(1))*a.v1*Math.cos(a.w1-
a.ref_ang-Math.asin(1)):a.vy4;a.bounce=below(sqrt(sqr(a.x2+a.vx2-a.x4-a.vx4)+sqr(a.y2+a.vy2-a.y4-a.vy4)),2*a.r);a.ref_ang=Math.atan2(a.x4-a.x2,a.y4-a.y2)+Math.asin(1);a.v1=sqrt(a.vx2*a.vx2+a.vy2*a.vy2);a.v2=sqrt(a.vx4*a.vx4+a.vy4*a.vy4);a.w1=Math.atan2(a.vx2,a.vy2);a.w2=Math.atan2(a.vx4,a.vy4);a.vx2=.00001<Math.abs(a.bounce)?Math.sin(a.ref_ang)*a.v1*Math.cos(a.w1-a.ref_ang)+Math.sin(a.ref_ang+Math.asin(1))*a.v2*Math.cos(a.w2-a.ref_ang-Math.asin(1)):a.vx2;a.vy2=.00001<Math.abs(a.bounce)?Math.cos(a.ref_ang)*
a.v1*Math.cos(a.w1-a.ref_ang)+Math.cos(a.ref_ang+Math.asin(1))*a.v2*Math.cos(a.w2-a.ref_ang-Math.asin(1)):a.vy2;a.vx4=.00001<Math.abs(a.bounce)?Math.sin(a.ref_ang)*a.v2*Math.cos(a.w2-a.ref_ang)+Math.sin(a.ref_ang+Math.asin(1))*a.v1*Math.cos(a.w1-a.ref_ang-Math.asin(1)):a.vx4;a.vy4=.00001<Math.abs(a.bounce)?Math.cos(a.ref_ang)*a.v2*Math.cos(a.w2-a.ref_ang)+Math.cos(a.ref_ang+Math.asin(1))*a.v1*Math.cos(a.w1-a.ref_ang-Math.asin(1)):a.vy4;a.bounce=below(sqrt(sqr(a.x3+a.vx3-a.x4-a.vx4)+sqr(a.y3+a.vy3-
a.y4-a.vy4)),2*a.r);a.ref_ang=Math.atan2(a.x4-a.x3,a.y4-a.y3)+Math.asin(1);a.v1=sqrt(a.vx3*a.vx3+a.vy3*a.vy3);a.v2=sqrt(a.vx4*a.vx4+a.vy4*a.vy4);a.w1=Math.atan2(a.vx3,a.vy3);a.w2=Math.atan2(a.vx4,a.vy4);a.vx3=.00001<Math.abs(a.bounce)?Math.sin(a.ref_ang)*a.v1*Math.cos(a.w1-a.ref_ang)+Math.sin(a.ref_ang+Math.asin(1))*a.v2*Math.cos(a.w2-a.ref_ang-Math.asin(1)):a.vx3;a.vy3=.00001<Math.abs(a.bounce)?Math.cos(a.ref_ang)*a.v1*Math.cos(a.w1-a.ref_ang)+Math.cos(a.ref_ang+Math.asin(1))*a.v2*Math.cos(a.w2-
a.ref_ang-Math.asin(1)):a.vy3;a.vx4=.00001<Math.abs(a.bounce)?Math.sin(a.ref_ang)*a.v2*Math.cos(a.w2-a.ref_ang)+Math.sin(a.ref_ang+Math.asin(1))*a.v1*Math.cos(a.w1-a.ref_ang-Math.asin(1)):a.vx4;a.vy4=.00001<Math.abs(a.bounce)?Math.cos(a.ref_ang)*a.v2*Math.cos(a.w2-a.ref_ang)+Math.cos(a.ref_ang+Math.asin(1))*a.v1*Math.cos(a.w1-a.ref_ang-Math.asin(1)):a.vy4;a.q1=.5-a.x1;a.q2=-.5+a.y1;a.q3=.5-a.x2;a.q4=-.5+a.y2;a.q5=.5-a.x3;a.q6=-.5+a.y3;a.q7=.5-a.x4;a.q8=-.5+a.y4;`,F=`vec2 xlat_mutablefactorA;
 shader_body { 
  vec2 uv_1;
  uv_1 = (uv - 0.5);
  vec2 tmpvar_2;
  tmpvar_2.x = q1;
  tmpvar_2.y = q2;
  xlat_mutablefactorA = (uv_1 + tmpvar_2);
  vec2 tmpvar_3;
  tmpvar_3 = (xlat_mutablefactorA * vec2(8.0, 8.0));
  vec2 tmpvar_4;
  tmpvar_4.x = q3;
  tmpvar_4.y = q4;
  xlat_mutablefactorA = (uv_1 + tmpvar_4);
  vec2 tmpvar_5;
  tmpvar_5 = (xlat_mutablefactorA * vec2(8.0, 8.0));
  vec2 tmpvar_6;
  tmpvar_6.x = q5;
  tmpvar_6.y = q6;
  xlat_mutablefactorA = (uv_1 + tmpvar_6);
  vec2 tmpvar_7;
  tmpvar_7 = (xlat_mutablefactorA * vec2(8.0, 8.0));
  vec2 tmpvar_8;
  tmpvar_8.x = q7;
  tmpvar_8.y = q8;
  xlat_mutablefactorA = (uv_1 + tmpvar_8);
  vec2 tmpvar_9;
  tmpvar_9 = (xlat_mutablefactorA * vec2(8.0, 8.0));
  vec2 tmpvar_10;
  tmpvar_10.x = ((tmpvar_3.x * tmpvar_5.x) - (tmpvar_3.y * tmpvar_5.y));
  tmpvar_10.y = ((tmpvar_3.x * tmpvar_5.y) + (tmpvar_3.y * tmpvar_5.x));
  vec2 tmpvar_11;
  tmpvar_11.x = ((tmpvar_7.x * tmpvar_9.x) - (tmpvar_7.y * tmpvar_9.y));
  tmpvar_11.y = ((tmpvar_7.x * tmpvar_9.y) + (tmpvar_7.y * tmpvar_9.x));
  xlat_mutablefactorA = tmpvar_10;
  vec2 tmpvar_12;
  tmpvar_12.x = ((tmpvar_10.x * tmpvar_11.x) - (tmpvar_10.y * tmpvar_11.y));
  tmpvar_12.y = ((tmpvar_10.x * tmpvar_11.y) + (tmpvar_10.y * tmpvar_11.x));
  vec2 tmpvar_13;
  tmpvar_13.x = tmpvar_12.x;
  tmpvar_13.y = -(tmpvar_12.y);
  uv_1 = ((tmpvar_13 / (
    (tmpvar_12.x * tmpvar_12.x)
   + 
    (tmpvar_12.y * tmpvar_12.y)
  )) * 48.0);
  uv_1 = (0.5 + ((1.0 - 
    abs(((fract(
      (uv_1 * 0.5)
    ) * 2.0) - 1.0))
  ) - 0.5));
  vec4 tmpvar_14;
  tmpvar_14.w = 1.0;
  tmpvar_14.xyz = (texture (sampler_main, fract(uv_1)) + 0.23).xyz;
  ret = tmpvar_14.xyz;
 }`,I=`uniform sampler2D sampler_sunrise;
vec2 xlat_mutablefactorA;
 shader_body { 
  vec2 uv_1;
  vec2 tmpvar_2;
  tmpvar_2 = (uv - 0.5);
  vec2 tmpvar_3;
  tmpvar_3.x = q1;
  tmpvar_3.y = q2;
  xlat_mutablefactorA = (tmpvar_2 + tmpvar_3);
  vec2 tmpvar_4;
  tmpvar_4 = (xlat_mutablefactorA * vec2(8.0, 8.0));
  vec2 tmpvar_5;
  tmpvar_5.x = q3;
  tmpvar_5.y = q4;
  xlat_mutablefactorA = (tmpvar_2 + tmpvar_5);
  vec2 tmpvar_6;
  tmpvar_6 = (xlat_mutablefactorA * vec2(8.0, 8.0));
  vec2 tmpvar_7;
  tmpvar_7.x = q5;
  tmpvar_7.y = q6;
  xlat_mutablefactorA = (tmpvar_2 + tmpvar_7);
  vec2 tmpvar_8;
  tmpvar_8 = (xlat_mutablefactorA * vec2(8.0, 8.0));
  vec2 tmpvar_9;
  tmpvar_9.x = q7;
  tmpvar_9.y = q8;
  xlat_mutablefactorA = (tmpvar_2 + tmpvar_9);
  vec2 tmpvar_10;
  tmpvar_10 = (xlat_mutablefactorA * vec2(8.0, 8.0));
  vec2 tmpvar_11;
  tmpvar_11.x = ((tmpvar_4.x * tmpvar_6.x) - (tmpvar_4.y * tmpvar_6.y));
  tmpvar_11.y = ((tmpvar_4.x * tmpvar_6.y) + (tmpvar_4.y * tmpvar_6.x));
  vec2 tmpvar_12;
  tmpvar_12.x = ((tmpvar_8.x * tmpvar_10.x) - (tmpvar_8.y * tmpvar_10.y));
  tmpvar_12.y = ((tmpvar_8.x * tmpvar_10.y) + (tmpvar_8.y * tmpvar_10.x));
  xlat_mutablefactorA = tmpvar_11;
  vec2 tmpvar_13;
  tmpvar_13.x = ((tmpvar_11.x * tmpvar_12.x) - (tmpvar_11.y * tmpvar_12.y));
  tmpvar_13.y = ((tmpvar_11.x * tmpvar_12.y) + (tmpvar_11.y * tmpvar_12.x));
  vec2 tmpvar_14;
  tmpvar_14.x = tmpvar_13.x;
  tmpvar_14.y = -(tmpvar_13.y);
  uv_1 = ((tmpvar_14 / (
    (tmpvar_13.x * tmpvar_13.x)
   + 
    (tmpvar_13.y * tmpvar_13.y)
  )) * 16.0);
  vec2 tmpvar_15;
  tmpvar_15 = mix ((0.5 + (tmpvar_2 * 
    (2.0 + ((bass_att - treb_att) * 0.02))
  )), (uv_1 + 0.5), vec2(0.5, 0.5));
  float tmpvar_16;
  vec2 x_17;
  x_17 = (tmpvar_15 - 0.5);
  tmpvar_16 = sqrt(dot (x_17, x_17));
  uv_1 = (0.5 + ((1.0 - 
    abs(((fract(
      (tmpvar_15 * 0.5)
    ) * 2.0) - 1.0))
  ) - 0.5));
  vec4 tmpvar_18;
  tmpvar_18 = texture (sampler_fc_main, uv_1);
  vec4 tmpvar_19;
  tmpvar_19.w = 0.0;
  tmpvar_19.xyz = (1.1 - tmpvar_18.xyz);
  vec4 tmpvar_20;
  tmpvar_20.w = 0.0;
  tmpvar_20.xyz = ((-(tmpvar_18.xyz) * 1.1) + 1.5);
  vec4 tmpvar_21;
  tmpvar_21.w = 1.0;
  tmpvar_21.xyz = (mix (tmpvar_19, clamp (
    (texture (sampler_sunrise, uv_1) - 0.1)
  , 0.0, 1.0), tmpvar_20) * clamp ((1.0 - 
    ((tmpvar_16 * tmpvar_16) * (tmpvar_16 * 0.001337))
  ), 0.0, 1.0)).xyz;
  ret = tmpvar_21.xyz;
 }`,L={baseVals:A,shapes:j,waves:M,init_eqs_str:N,frame_eqs_str:P,pixel_eqs_str:``,pixel_eqs:``,warp:F,comp:I},R={rating:5,gammaadj:1,decay:1,additivewave:1,wave_thick:1,modwavealphabyvolume:1,wave_a:.009,wave_scale:1.224,wave_smoothing:0,modwavealphastart:1.2,modwavealphaend:1.2,warpscale:1.772,zoomexp:5.00873,zoom:1.011,rot:.003,warp:0,wave_r:0,wave_g:0,ob_size:.005,ob_a:1,ib_size:0,mv_x:64,mv_y:48,mv_l:.85,mv_r:.5,mv_g:.5,mv_b:.5,mv_a:0,b1ed:0},z=[{baseVals:{enabled:1,sides:100,additive:1,thickoutline:1,x:.57,y:.41,rad:.09234,tex_zoom:.73458,g2:0,border_a:0},init_eqs_str:`a.vx=0;`,frame_eqs_str:``},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:1,sides:36,additive:1,rad:1.38306,r:0,g:.03,g2:0,border_a:0},init_eqs_str:``,frame_eqs_str:``}],B=[{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],V=`a.c_inv_i=0;a.translation_x=0;a.w=0;a.a_i=0;a.c_r=0;a.a_r=0;a.iangle=0;a.q18=0;a.q13=0;a.scale=0;a.q15=0;a.q6=0;a.ac_i=0;a.itranslation_u=0;a.q1=0;a.itranslation_v=0;a.q5=0;a.c_inv_r=0;a.d_i=0;a.angle=0;a.mu_i=0;a.bcad_r=0;a.iscale=0;a.q4=0;a.b_r=0;a.mu_r=0;a.q16=0;a.t=0;a.bcad_i=0;a.c_i=0;a.q19=0;a.q17=0;a.q2=0;a.q14=0;a.ac_r=0;a.translation_y=0;a.q3=0;a.b_i=0;a.q7=0;a.d_r=0;a.q8=0;`,H=`a.t=12.3*a.time;a.rot+=.03*(.6*Math.sin(.38*a.time)+.4*Math.sin(.54*a.time));a.dx+=.002*(.6*Math.sin(.434*a.time)+.4*Math.sin(.277*a.time));a.dy+=.002*(.6*Math.sin(.384*a.time)+.4*Math.sin(.477*a.time));a.w=.1*a.time;a.q13=Math.sin(a.w);a.q14=Math.cos(a.w);a.q15=.5;a.q16=.5;a.q17=1.1;a.q18=.5;a.q19=.5;a.scale=1;a.angle=.5*a.time;a.translation_x=0;a.translation_y=.1;a.iscale=1;a.iangle=.2;a.itranslation_u=0;a.itranslation_v=0;a.a_r=Math.cos(a.angle)*a.scale;a.a_i=Math.sin(a.angle)*
a.scale;a.b_r=a.translation_x;a.b_i=a.translation_y;a.c_r=-Math.cos(a.iangle)*a.iscale;a.c_i=-Math.sin(a.iangle)*a.iscale;a.d_r=a.itranslation_u;a.d_i=a.itranslation_v;a.c_inv_r=div(a.c_r,a.c_r*a.c_r+a.c_i*a.c_i);a.c_inv_i=div(a.c_i,a.c_r*a.c_r+a.c_i*a.c_i);a.ac_r=a.a_r*a.c_inv_r-a.a_i*a.c_inv_i;a.ac_i=a.a_r*a.c_inv_i-a.a_i*a.c_inv_r;a.bcad_r=a.b_r*a.c_r-a.b_i*a.c_i-(a.a_r*a.d_r-a.a_i*a.d_i);a.bcad_i=a.b_r*a.c_i-a.b_i*a.c_r-(a.a_r*a.d_i-a.a_i*a.d_r);a.mu_r=a.bcad_r*a.c_inv_r-a.bcad_i*a.c_inv_i;a.mu_i=
a.bcad_r*a.c_inv_i-a.bcad_i*a.c_inv_r;a.q1=a.ac_r;a.q2=a.ac_i;a.q3=a.mu_r;a.q4=a.mu_i;a.q5=a.c_r;a.q6=a.c_i;a.q7=a.d_r;a.q8=a.d_i;`,U=` shader_body { 
  vec2 my_uv2_1;
  vec2 d_2;
  vec3 ret_3;
  ret_3.y = texture (sampler_main, uv).y;
  ret_3.y = (ret_3.y + ((
    (ret_3.y - ((texture (sampler_blur1, uv).xyz * scale1) + bias1).y)
   * 0.1) - 0.015));
  ret_3.z = ((texture (sampler_main, (uv_orig + 
    ((uv_orig - uv) * 0.8)
  )).z * 0.94) - 0.004);
  vec2 tmpvar_4;
  tmpvar_4 = ((uv_orig - 0.5) * vec2(1.75, 1.75));
  vec2 tmpvar_5;
  tmpvar_5.x = ((tmpvar_4.x * tmpvar_4.x) - (tmpvar_4.y * tmpvar_4.y));
  tmpvar_5.y = ((2.0 * tmpvar_4.x) * tmpvar_4.y);
  my_uv2_1 = (tmpvar_5 + vec2(0.4, 0.74));
  d_2 = (texsize.zw * 8.0);
  vec2 tmpvar_6;
  tmpvar_6.x = (((texture (sampler_blur1, 
    (my_uv2_1 + (vec2(1.0, 0.0) * d_2))
  ).xyz * scale1) + bias1) - ((texture (sampler_blur1, 
    (my_uv2_1 - (vec2(1.0, 0.0) * d_2))
  ).xyz * scale1) + bias1)).x;
  tmpvar_6.y = (((texture (sampler_blur1, 
    (my_uv2_1 + (vec2(0.0, 1.0) * d_2))
  ).xyz * scale1) + bias1) - ((texture (sampler_blur1, 
    (my_uv2_1 - (vec2(0.0, 1.0) * d_2))
  ).xyz * scale1) + bias1)).x;
  ret_3.x = texture (sampler_fc_main, (my_uv2_1 + ((tmpvar_6 * texsize.zw) * 4.0))).x;
  vec4 tmpvar_7;
  tmpvar_7.w = 1.0;
  tmpvar_7.xyz = ret_3;
  ret = tmpvar_7.xyz;
 }`,W=`uniform sampler2D sampler_sunrise;
 shader_body { 
  vec2 d_1;
  vec2 tmpvar_2;
  tmpvar_2.x = q1;
  tmpvar_2.y = q2;
  vec2 tmpvar_3;
  tmpvar_3.x = q7;
  tmpvar_3.y = q8;
  vec2 tmpvar_4;
  tmpvar_4 = ((uv - 0.5) * aspect.wz);
  vec2 tmpvar_5;
  tmpvar_5.x = ((tmpvar_4.x * q5) - (tmpvar_4.y * q6));
  tmpvar_5.y = ((tmpvar_4.x * q6) - (tmpvar_4.y * q5));
  vec2 tmpvar_6;
  tmpvar_6 = ((tmpvar_5 * aspect.yx) + tmpvar_3);
  vec2 tmpvar_7;
  tmpvar_7.x = ((q3 * tmpvar_6.x) + (q4 * tmpvar_6.y));
  tmpvar_7.y = ((q4 * tmpvar_6.x) - (q3 * tmpvar_6.y));
  d_1 = (texsize.zw * 4.0);
  vec3 tmpvar_8;
  tmpvar_8 = (((texture (sampler_blur1, 
    (uv + (vec2(1.0, 0.0) * d_1))
  ).xyz * scale1) + bias1) - ((texture (sampler_blur1, 
    (uv - (vec2(1.0, 0.0) * d_1))
  ).xyz * scale1) + bias1));
  vec3 tmpvar_9;
  tmpvar_9 = (((texture (sampler_blur1, 
    (uv + (vec2(0.0, 1.0) * d_1))
  ).xyz * scale1) + bias1) - ((texture (sampler_blur1, 
    (uv - (vec2(0.0, 1.0) * d_1))
  ).xyz * scale1) + bias1));
  vec2 tmpvar_10;
  tmpvar_10.x = tmpvar_8.y;
  tmpvar_10.y = tmpvar_9.y;
  vec2 tmpvar_11;
  tmpvar_11.x = tmpvar_8.x;
  tmpvar_11.y = tmpvar_9.x;
  vec2 tmpvar_12;
  tmpvar_12.x = tmpvar_8.y;
  tmpvar_12.y = tmpvar_9.y;
  vec2 tmpvar_13;
  tmpvar_13.x = tmpvar_8.z;
  tmpvar_13.y = tmpvar_9.z;
  vec4 tmpvar_14;
  tmpvar_14.w = 1.0;
  tmpvar_14.xyz = mix (mix (mix (texture (sampler_sunrise, 
    fract((0.5 + ((
      (1.0 - abs(((
        fract((((
          ((tmpvar_7 / ((tmpvar_6.x * tmpvar_6.x) + (tmpvar_6.y * tmpvar_6.y))) + tmpvar_2)
         * 0.5) - (tmpvar_10 * 0.2)) + (tmpvar_11 * 0.1)))
       * 2.0) - 1.0)))
     - 0.5) * 0.99)))
  ).xyz, vec3(-2.0, -2.0, -2.0), vec3(
    (texture (sampler_main, (uv + (tmpvar_12 * 0.1))).x * 0.1)
  )), vec3(-1.0, -1.0, -1.0), vec3((texture (sampler_main, 
    (uv - (tmpvar_13 * 0.024))
  ).z * 0.4))), vec3(1.0, 1.0, 1.0), vec3(clamp ((texture (sampler_main, uv).y - 
    (((texture (sampler_blur3, uv).xyz * scale3) + bias3).y * 2.0)
  ), 0.0, 1.0)));
  ret = tmpvar_14.xyz;
 }`,G={baseVals:R,shapes:z,waves:B,init_eqs_str:V,frame_eqs_str:H,pixel_eqs_str:``,pixel_eqs:``,warp:U,comp:W},K={rating:0,gammaadj:1,decay:1,additivewave:1,wave_thick:1,modwavealphabyvolume:1,wave_a:.009,wave_scale:2.713,wave_smoothing:0,modwavealphastart:1.2,modwavealphaend:1.2,warpscale:1.772,zoomexp:5.00873,zoom:1.011,rot:.003,warp:0,wave_r:.12,wave_g:0,ob_size:0,ob_r:1,ob_a:1,ib_size:0,mv_x:64,mv_y:48,mv_l:.85,mv_r:.5,mv_g:.5,mv_b:.5,mv_a:0,b1ed:0},q=[{baseVals:{enabled:1,sides:12,additive:1,num_inst:2,x:.49,rad:.09902,tex_zoom:4.36077,g2:0,border_a:0},init_eqs_str:``,frame_eqs_str:`a.x=div(randint(1E3),1E3);a.y=div(randint(1E3),1E3);a.ang=div(randint(150),100);`},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:1,sides:36,additive:1,rad:1.38306,r:0,g:.03,g2:0,border_a:0},init_eqs_str:``,frame_eqs_str:``}],J=[{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],Y=`a.t=0;`,X=`a.t=12.3*a.time;a.rot+=.03*(.6*Math.sin(.38*a.time)+.4*Math.sin(.54*a.time));a.dx+=.002*(.6*Math.sin(.434*a.time)+.4*Math.sin(.277*a.time));a.dy+=.002*(.6*Math.sin(.384*a.time)+.4*Math.sin(.477*a.time));`,Z=` shader_body { 
  vec3 ret_1;
  vec2 tmpvar_2;
  tmpvar_2 = (texsize.zw * 12.0);
  vec2 tmpvar_3;
  tmpvar_3 = (((uv_orig * texsize.xy) * (texsize_noise_lq.zw * 0.8)) + rand_frame.xy);
  vec2 tmpvar_4;
  tmpvar_4.x = (((texture (sampler_blur1, 
    (uv + (vec2(1.0, 0.0) * tmpvar_2))
  ).xyz * scale1) + bias1) - ((texture (sampler_blur1, 
    (uv - (vec2(1.0, 0.0) * tmpvar_2))
  ).xyz * scale1) + bias1)).x;
  tmpvar_4.y = (((texture (sampler_blur1, 
    (uv + (vec2(0.0, 1.0) * tmpvar_2))
  ).xyz * scale1) + bias1) - ((texture (sampler_blur1, 
    (uv - (vec2(0.0, 1.0) * tmpvar_2))
  ).xyz * scale1) + bias1)).x;
  vec2 tmpvar_5;
  vec2 tmpvar_6;
  tmpvar_6 = (uv_orig - uv);
  tmpvar_5 = (((uv_orig - 
    (tmpvar_6 * 0.4)
  ) + (
    (tmpvar_4 * texsize.zw)
   * 2.0)) + ((
    (texture (sampler_noise_lq, tmpvar_3).xy - 0.5)
   * texsize.zw) * 4.0));
  ret_1.x = (((texture (sampler_main, tmpvar_5).x - 
    ((texture (sampler_main, tmpvar_5).x - ((texture (sampler_blur3, tmpvar_5).xyz * scale3) + bias3).x) * 0.02)
  ) - 0.008) + ((texture (sampler_noise_lq, tmpvar_3).x - 0.5) * 0.1));
  ret_1.y = texture (sampler_main, uv).y;
  ret_1.y = (ret_1.y + ((
    (ret_1.y - ((texture (sampler_blur1, uv).xyz * scale1) + bias1).y)
   * 0.1) - 0.015));
  ret_1.z = ((texture (sampler_main, (uv_orig + 
    (tmpvar_6 * 0.8)
  )).z * 0.94) - 0.004);
  vec4 tmpvar_7;
  tmpvar_7.w = 1.0;
  tmpvar_7.xyz = ret_1;
  ret = tmpvar_7.xyz;
 }`,Q=` shader_body { 
  vec2 tmpvar_1;
  tmpvar_1 = (texsize.zw * 4.0);
  vec2 tmpvar_2;
  tmpvar_2.x = (((texture (sampler_blur1, 
    (uv + (vec2(1.0, 0.0) * tmpvar_1))
  ).xyz * scale1) + bias1) - ((texture (sampler_blur1, 
    (uv - (vec2(1.0, 0.0) * tmpvar_1))
  ).xyz * scale1) + bias1)).y;
  tmpvar_2.y = (((texture (sampler_blur1, 
    (uv + (vec2(0.0, 1.0) * tmpvar_1))
  ).xyz * scale1) + bias1) - ((texture (sampler_blur1, 
    (uv - (vec2(0.0, 1.0) * tmpvar_1))
  ).xyz * scale1) + bias1)).y;
  vec4 tmpvar_3;
  tmpvar_3.w = 1.0;
  tmpvar_3.xyz = mix ((vec3(0.8, 0.6, 0.5) * texture (sampler_fc_main, (uv + 
    (tmpvar_2 * 0.4)
  )).x), mix (vec3(2.0, 1.2, 0.0), vec3(-1.0, 0.8, -1.0), texture (sampler_main, uv).zzz), vec3(((
    (texture (sampler_blur1, uv).xyz * scale1)
   + bias1).y * 0.35)));
  ret = tmpvar_3.xyz;
 }`,ne={baseVals:K,shapes:q,waves:J,init_eqs_str:Y,frame_eqs_str:X,pixel_eqs_str:``,pixel_eqs:``,warp:Z,comp:Q},re={rating:0,gammaadj:1,decay:.95,echo_zoom:.498,echo_orient:3,additivewave:1,wave_brighten:0,wave_a:.001,wave_scale:.01,wave_smoothing:.63,wave_mystery:-1,modwavealphastart:.71,modwavealphaend:1.3,warpscale:1.331,zoom:13.29089,dx:-.28,dy:-.32,warp:.00909,wave_r:.65,wave_g:.65,wave_b:.65,ob_size:0,ob_a:1,ib_size:0,ib_r:1,ib_g:0,ib_b:0,ib_a:1,mv_x:12.8,mv_y:9.6,mv_l:1,mv_g:.91,mv_b:.71,mv_a:0},ie=[{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],ae=[{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],oe=`a.c_inv_i=0;a.translation_x=0;a.a_i=0;a.c_r=0;a.a_r=0;a.iangle=0;a.scale=0;a.q6=0;a.ac_i=0;a.itranslation_u=0;a.q1=0;a.itranslation_v=0;a.q5=0;a.c_inv_r=0;a.d_i=0;a.angle=0;a.mu_i=0;a.bcad_r=0;a.iscale=0;a.q4=0;a.b_r=0;a.mu_r=0;a.bcad_i=0;a.c_i=0;a.q2=0;a.ac_r=0;a.translation_y=0;a.q3=0;a.b_i=0;a.q7=0;a.d_r=0;a.q8=0;a.zoom=1;a.xpos=0;a.ypos=0;`,se=`a.scale=1;a.angle=.2*a.time;a.translation_x=0;a.translation_y=.1;a.iscale=1;a.iangle=.2;a.itranslation_u=0;a.itranslation_v=0;a.a_r=Math.cos(a.angle)*a.scale;a.a_i=Math.sin(a.angle)*a.scale;a.b_r=a.translation_x;a.b_i=a.translation_y;a.c_r=-Math.cos(a.iangle)*a.iscale;a.c_i=-Math.sin(a.iangle)*a.iscale;a.d_r=a.itranslation_u;a.d_i=a.itranslation_v;a.c_inv_r=div(a.c_r,a.c_r*a.c_r+a.c_i*a.c_i);a.c_inv_i=div(a.c_i,a.c_r*a.c_r+a.c_i*a.c_i);a.ac_r=a.a_r*a.c_inv_r-a.a_i*a.c_inv_i;
a.ac_i=a.a_r*a.c_inv_i-a.a_i*a.c_inv_r;a.bcad_r=a.b_r*a.c_r-a.b_i*a.c_i-(a.a_r*a.d_r-a.a_i*a.d_i);a.bcad_i=a.b_r*a.c_i-a.b_i*a.c_r-(a.a_r*a.d_i-a.a_i*a.d_r);a.mu_r=a.bcad_r*a.c_inv_r-a.bcad_i*a.c_inv_i;a.mu_i=a.bcad_r*a.c_inv_i-a.bcad_i*a.c_inv_r;a.q1=a.ac_r;a.q2=a.ac_i;a.q3=a.mu_r;a.q4=a.mu_i;a.q5=a.c_r;a.q6=a.c_i;a.q7=a.d_r;a.q8=a.d_i;a.monitor=a.bcad_r;`,ce=`uniform sampler2D sampler_rand00;
 shader_body { 
  vec4 tmpvar_1;
  tmpvar_1.w = 1.0;
  tmpvar_1.xyz = texture (sampler_rand00, uv_orig).xyz;
  ret = tmpvar_1.xyz;
 }`,le=` shader_body { 
  vec2 tmpvar_1;
  tmpvar_1.x = q1;
  tmpvar_1.y = q2;
  vec2 tmpvar_2;
  tmpvar_2.x = q7;
  tmpvar_2.y = q8;
  vec2 tmpvar_3;
  tmpvar_3 = ((uv - 0.5) * aspect.wz);
  vec2 tmpvar_4;
  tmpvar_4.x = ((tmpvar_3.x * q5) - (tmpvar_3.y * q6));
  tmpvar_4.y = ((tmpvar_3.x * q6) - (tmpvar_3.y * q5));
  vec2 tmpvar_5;
  tmpvar_5 = ((tmpvar_4 * aspect.yx) + tmpvar_2);
  vec2 tmpvar_6;
  tmpvar_6.x = ((q3 * tmpvar_5.x) + (q4 * tmpvar_5.y));
  tmpvar_6.y = ((q4 * tmpvar_5.x) - (q3 * tmpvar_5.y));
  vec4 tmpvar_7;
  tmpvar_7.w = 1.0;
  tmpvar_7.xyz = texture (sampler_fc_main, (0.5 + ((
    (1.0 - abs(((
      fract((((tmpvar_6 / 
        ((tmpvar_5.x * tmpvar_5.x) + (tmpvar_5.y * tmpvar_5.y))
      ) + tmpvar_1) * 0.5))
     * 2.0) - 1.0)))
   - 0.5) * 0.99))).xyz;
  ret = tmpvar_7.xyz;
 }`,ue={baseVals:re,shapes:ie,waves:ae,init_eqs_str:oe,frame_eqs_str:se,pixel_eqs_str:``,pixel_eqs:``,warp:ce,comp:le},de={rating:3,gammaadj:1,decay:.5,echo_zoom:1,echo_orient:3,additivewave:1,wave_thick:1,modwavealphabyvolume:1,wave_a:.009,wave_scale:1.554,wave_smoothing:0,modwavealphastart:1.2,modwavealphaend:1.2,warpanimspeed:.01,warpscale:100,zoomexp:.19913,warp:.01359,wave_r:0,wave_b:.04,ob_size:.005,ob_a:1,ib_size:.5,ib_r:1,ib_g:1,ib_b:1,mv_x:64,mv_y:48,mv_l:.85,mv_r:.5,mv_g:.5,mv_b:.5,mv_a:0},fe=[{baseVals:{enabled:1,sides:100,additive:1,thickoutline:1,rad:.86644,g:.03,g2:0,border_a:0},init_eqs_str:``,frame_eqs_str:``},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],pe=[{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],me=`a.d=0;a.xx=0;a.w=0;a.cz=0;a.my=0;a.vx=0;a.vy=0;a.mx=0;a.yy=0;`,he=`a.vx=.5+.5*Math.cos(.2*a.time);a.vy=.5+.5*Math.sin(.2*a.time);a.x-=a.vx;a.y-=a.vy;a.d=.1*a.time;a.xx=Math.sin(a.d)*a.x+Math.cos(a.d)*a.y;a.yy=Math.cos(a.d)*a.x-Math.sin(a.d)*a.y;a.x=a.xx;a.y=a.yy;a.cz=.5;a.zoom=.33;a.w=div(1,a.zoom)*(1+sqrt(sqr(a.cz)+sqr(a.x-a.cx)+sqr(a.y-a.cy)));a.dx=(a.x-a.mx)*a.w;a.dy=(a.y-a.my)*a.w;`,ge=` shader_body { 
  vec2 uv_z_1;
  vec3 ret_2;
  vec2 tmpvar_3;
  tmpvar_3 = (1.0 - abs((
    (fract((uv * 0.5)) * 2.0)
   - 1.0)));
  ret_2.x = (texture (sampler_fc_main, tmpvar_3).x * 0.5);
  vec2 tmpvar_4;
  tmpvar_4 = (texsize.zw * 4.0);
  vec2 tmpvar_5;
  vec2 tmpvar_6;
  tmpvar_6 = (uv_orig - 0.5);
  tmpvar_5 = ((tmpvar_6 * 0.996) + 0.5);
  vec2 tmpvar_7;
  tmpvar_7.x = (((2.0 * 
    ((texture (sampler_blur1, (tmpvar_5 + (vec2(1.0, 0.0) * tmpvar_4))).xyz * scale1) + bias1)
  ) - (
    (texture (sampler_blur1, (tmpvar_5 - (vec2(1.0, 0.0) * tmpvar_4))).xyz * scale1)
   + bias1)) * 0.5).z;
  tmpvar_7.y = (((2.0 * 
    ((texture (sampler_blur1, (tmpvar_5 + (vec2(0.0, 1.0) * tmpvar_4))).xyz * scale1) + bias1)
  ) - (
    (texture (sampler_blur1, (tmpvar_5 - (vec2(0.0, 1.0) * tmpvar_4))).xyz * scale1)
   + bias1)) * 0.5).z;
  uv_z_1 = (tmpvar_5 - ((tmpvar_7 * texsize.zw) * 2.0));
  ret_2.z = max (((
    (texture (sampler_fc_main, tmpvar_3).x - 0.5)
   * 3.0) * clamp (
    (1.0 - (sqrt(dot (tmpvar_6, tmpvar_6)) * 3.2))
  , 0.0, 1.0)), texture (sampler_fc_main, uv_z_1).z);
  ret_2.z = (ret_2.z + ((
    (2.0 * texture (sampler_fc_main, uv_z_1).z)
   - 
    (2.0 * ((texture (sampler_blur1, clamp (uv_z_1, 0.0, 1.0)).xyz * scale1) + bias1).z)
  ) * 0.01));
  ret_2.y = (max (texture (sampler_fc_main, mix (uv, uv_orig, vec2(0.9996, 0.9996))).y, texture (sampler_fc_main, uv_orig).z) - 0.008);
  vec4 tmpvar_8;
  tmpvar_8.w = 1.0;
  tmpvar_8.xyz = ret_2;
  ret = tmpvar_8.xyz;
 }`,_e=`vec2 xlat_mutablefactorA;
 shader_body { 
  vec2 uv_1;
  vec2 dz_2;
  vec3 dy_3;
  vec3 dx_4;
  vec2 d_5;
  vec3 ret_6;
  xlat_mutablefactorA = (uv - vec2(0.5, 0.5));
  vec2 tmpvar_7;
  tmpvar_7.x = -((xlat_mutablefactorA.y * -1024.0));
  tmpvar_7.y = (xlat_mutablefactorA.x * -1024.0);
  vec2 tmpvar_8;
  tmpvar_8.x = tmpvar_7.x;
  tmpvar_8.y = -(tmpvar_7.y);
  uv_1 = (vec2(-100.0, 100.0) * (tmpvar_8 / (
    (tmpvar_7.x * tmpvar_7.x)
   + 
    (tmpvar_7.y * tmpvar_7.y)
  )).yx);
  uv_1 = (0.5 + ((
    (1.0 - abs(((
      fract((mix ((0.5 + 
        (((0.5 + (
          (uv - 0.5)
         * vec2(1.1, 0.81))) - 0.5) * 2.0)
      ), (uv_1 + 0.5), vec2(0.5, 0.5)) * 0.5))
     * 2.0) - 1.0)))
   - 0.5) * 0.98));
  vec2 tmpvar_9;
  vec2 tmpvar_10;
  tmpvar_10 = (vec2(1.0, 0.0) * texsize.zw);
  tmpvar_9.x = (texture (sampler_main, (uv_1 + tmpvar_10)).xyz - texture (sampler_main, (uv_1 - tmpvar_10)).xyz).y;
  vec2 tmpvar_11;
  tmpvar_11 = (vec2(0.0, 1.0) * texsize.zw);
  tmpvar_9.y = (texture (sampler_main, (uv_1 + tmpvar_11)).xyz - texture (sampler_main, (uv_1 - tmpvar_11)).xyz).y;
  d_5 = (texsize.zw * 2.0);
  dx_4 = (((2.0 * 
    ((texture (sampler_blur1, (uv_1 + (vec2(1.0, 0.0) * d_5))).xyz * scale1) + bias1)
  ) - (2.0 * 
    ((texture (sampler_blur1, (uv_1 - (vec2(1.0, 0.0) * d_5))).xyz * scale1) + bias1)
  )) * 0.5);
  dy_3 = (((2.0 * 
    ((texture (sampler_blur1, (uv_1 + (vec2(0.0, 1.0) * d_5))).xyz * scale1) + bias1)
  ) - (2.0 * 
    ((texture (sampler_blur1, (uv_1 - (vec2(0.0, 1.0) * d_5))).xyz * scale1) + bias1)
  )) * 0.5);
  vec2 tmpvar_12;
  tmpvar_12.x = dx_4.y;
  tmpvar_12.y = dy_3.y;
  dz_2 = ((tmpvar_9 * 3.0) + tmpvar_12);
  ret_6 = (vec3(((
    pow ((sqrt(dot (dz_2, dz_2)) * 0.8), 0.7)
   + 
    (((texture (sampler_blur2, uv_1).xyz * scale2) + bias2).y * 0.4)
  ) - 0.1)) * vec3(0.3, 0.5, 0.7));
  vec2 tmpvar_13;
  tmpvar_13.x = dx_4.x;
  tmpvar_13.y = dy_3.x;
  vec3 tmpvar_14;
  tmpvar_14 = mix (mix (ret_6, vec3(0.2, 0.1, 0.0), vec3((texture (sampler_main, 
    (uv_1 + ((tmpvar_13 * texsize.zw) * 18.0))
  ).x * 6.0))), vec3(1.0, 1.0, 1.0), texture (sampler_main, uv_1).zzz);
  ret_6 = tmpvar_14;
  vec4 tmpvar_15;
  tmpvar_15.w = 1.0;
  tmpvar_15.xyz = tmpvar_14;
  ret = tmpvar_15.xyz;
 }`,ve={baseVals:de,shapes:fe,waves:pe,init_eqs_str:me,frame_eqs_str:``,pixel_eqs_str:he,warp:ge,comp:_e},ye={rating:5,gammaadj:1,decay:1,echo_zoom:1,echo_alpha:1,echo_orient:2,wave_thick:1,wave_brighten:0,wrap:0,brighten:1,wave_a:.004,wave_scale:.01,wave_smoothing:0,wave_mystery:-.44,modwavealphastart:1,modwavealphaend:1,warpanimspeed:.01,warpscale:100,zoomexp:1.83149,zoom:.9901,warp:.01,wave_y:.04,ob_size:.005,ob_a:1,ib_size:0,ib_r:0,ib_g:0,ib_b:0,ib_a:1,mv_x:64,mv_y:48,mv_l:0,mv_b:0,mv_a:0},be=[{baseVals:{enabled:0}},{baseVals:{enabled:1,sides:100,additive:1,thickoutline:1,textured:1,y:.4,rad:.59958,ang:.81681,tex_zoom:.75683,g:1,b:1,r2:.8,g2:.4,b2:.2,a2:1,border_a:0},init_eqs_str:`a.x1=0;a.x2=0;a.ox=0;a.q2=0;a.y2=0;a.s=0;a.s=0;a.y2=0;a.s=0;a.s=0;a.x1=0;a.s=0;a.x2=0;a.xx=0;a.q1=0;a.ox=0;a.q4=0;a.vx=0;`,frame_eqs_str:`a.x1=.5;a.x2=.5+a.ox+.3*Math.sin(a.q2);a.y2=.78;a.s=.5;a.y=(1-a.s)*a.y2+a.s-.16;a.x=a.s*a.x1+(1-a.s)*a.x2-.12;a.xx=a.q1;a.ox=.2*(a.q4-.5);`},{baseVals:{enabled:1,sides:100,additive:1,thickoutline:1,textured:1,y:.4,rad:.59958,ang:5.46637,tex_zoom:.75683,g:1,b:1,r2:.4,g2:.8,b2:.2,a2:1,border_a:0},init_eqs_str:`a.x1=0;a.x2=0;a.ox=0;a.q2=0;a.y2=0;a.s=0;a.s=0;a.y2=0;a.s=0;a.s=0;a.x1=0;a.s=0;a.x2=0;a.xx=0;a.q1=0;a.ox=0;a.q4=0;a.vx=0;`,frame_eqs_str:`a.x1=.5;a.x2=.5+a.ox+.3*Math.sin(a.q2);a.y2=.78;a.s=.5;a.y=(1-a.s)*a.y2+a.s-.16;a.x=a.s*a.x1+(1-a.s)*a.x2+.12;a.xx=a.q1;a.ox=.2*(a.q4-.5);`},{baseVals:{enabled:1,sides:100,additive:1,thickoutline:1,textured:1,y:.4,rad:2.20775,tex_zoom:.35528,g:1,b:1,r2:1,b2:1,a2:1,border_a:.16},init_eqs_str:`a.q4=0;a.q2=0;a.vx=0;`,frame_eqs_str:`a.x=.5+.2*(a.q4-.5);a.ang=a.q2;`}],xe=[{baseVals:{enabled:0}},{baseVals:{enabled:1,thick:1,scaling:2.44415,smoothing:0,r:.5,g:.4,b:.14},init_eqs_str:`a.d=0;a.xx=0;a.x1=0;a.q1=0;a.t8=0;a.q11=0;a.q10=0;a.q4=0;a.x2=0;a.y2=0;a.q2=0;a.ox=0;a.t2=0;a.t3=0;a.t4=0;a.cl=0;`,frame_eqs_str:`a.t8=1;`,point_eqs_str:`a.t8=-a.t8;a.x1=.5;a.x2=.5+a.ox+.3*Math.sin(a.q2);a.y2=.79;a.d=a.t8*(.01*a.sample+.03);a.y=(1-a.sample)*a.y2+a.sample+a.d*(a.x2-a.x1)-.03;a.x=a.sample*a.x1+(1-a.sample)*a.x2+a.d*(1-a.y2);a.xx=a.q1;a.ox=.2*(a.q4-.5);a.x=.5+div(a.x-.5,a.q10);a.y=.5+div(a.y-.5,a.q11);`},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],Se=`a.y3=0;a.y1=0;a.spx3=0;a.x1=0;a.vx3=0;a.q6=0;a.spy2=0;a.dt=0;a.spy3=0;a.q1=0;a.q5=0;a.spx2=0;a.vx4=0;a.spx4=0;a.grav=0;a.x3=0;a.q11=0;a.q10=0;a.xx2=0;a.q4=0;a.spy4=0;a.yy1=0;a.vy4=0;a.bounce=0;a.x4=0;a.x2=0;a.vy2=0;a.y2=0;a.q2=0;a.spring=0;a.vx2=0;a.q3=0;a.resist=0;a.y4=0;a.q7=0;a.vy3=0;a.xx1=0;a.q8=0;a.x1=.9;a.y1=.5;a.x2=.5;a.y2=.5;a.x3=.5;a.y3=.5;a.x4=.5;a.y4=.5;`,Ce=`a.decay=0;a.xx1=.9*a.xx1+.01*a.bass;a.xx2=.9*a.xx2+.01*a.treb;a.yy1=.94*a.yy1+.0075*(a.treb+a.bass);a.x1=.5+3*(a.xx1-a.xx2);a.y1=1-.75*a.yy1;a.spring=20;a.grav=.65-.25*a.yy1;a.resist=.03;a.bounce=1;a.dt=.0005;a.spx2=(a.x1+a.x3-2*a.x2)*a.spring;a.spy2=(a.y1+a.y3-2*a.y2)*a.spring;a.spx3=(a.x2+a.x4-2*a.x3)*a.spring;a.spy3=(a.y2+a.y4-2*a.y3)*a.spring;a.spx4=(a.x3-a.x4)*a.spring;a.spy4=(a.y3-a.y4)*a.spring;a.vx2=a.vx2*(1-a.resist)+a.dt*a.spx2;a.vy2=a.vy2*(1-a.resist)+a.dt*(a.spy2-
a.grav);a.vx3=a.vx3*(1-a.resist)+a.dt*a.spx3;a.vy3=a.vy3*(1-a.resist)+a.dt*(a.spy3-1.5*a.grav);a.vx4=a.vx4*(1-a.resist)+a.dt*a.spx4;a.vy4=a.vy4*(1-a.resist)+a.dt*(a.spy4-4*a.grav);a.x2+=a.vx2;a.y2+=a.vy2;a.x3+=a.vx3;a.y3+=a.vy3;a.x4+=a.vx4;a.y4+=a.vy4;a.vx2=.00001<Math.abs(above(a.x2,0))?a.vx2:Math.abs(a.vx2)*a.bounce;a.vx2=.00001<Math.abs(below(a.x2,1))?a.vx2:-Math.abs(a.vx2)*a.bounce;a.vx3=.00001<Math.abs(above(a.x3,0))?a.vx3:Math.abs(a.vx3)*a.bounce;a.vx3=.00001<Math.abs(below(a.x3,1))?a.vx3:-Math.abs(a.vx3)*
a.bounce;a.vx4=.00001<Math.abs(above(a.x4,0))?a.vx4:Math.abs(a.vx4)*a.bounce;a.vx4=.00001<Math.abs(below(a.x4,1))?a.vx4:-Math.abs(a.vx4)*a.bounce;a.vy2=.00001<Math.abs(above(a.y2,0))?a.vy2:Math.abs(a.vy2)*a.bounce;a.vy2=.00001<Math.abs(below(a.y2,1))?a.vy2:-Math.abs(a.vy2)*a.bounce;a.vy3=.00001<Math.abs(above(a.y3,0))?a.vy3:Math.abs(a.vy3)*a.bounce;a.vy3=.00001<Math.abs(below(a.y3,1))?a.vy3:-Math.abs(a.vy3)*a.bounce;a.vy4=.00001<Math.abs(above(a.y4,0))?a.vy4:Math.abs(a.vy4)*a.bounce;a.vy4=.00001<
Math.abs(below(a.y4,1))?a.vy4:-Math.abs(a.vy4)*a.bounce;a.q1=a.x1;a.q2=a.x2;a.q3=a.x3;a.q4=a.x4;a.q5=a.y1;a.q6=a.y2;a.q7=a.y3;a.q8=a.y4;a.q2=.2*Math.sin(Math.atan2(a.x4-a.x3,a.y4-a.y3)-2*Math.asin(1));a.monitor=a.q2;a.zoom=1;a.q10=a.aspectx;a.q11=a.aspecty;a.wave_a=0;`,we={baseVals:ye,shapes:be,waves:xe,init_eqs_str:Se,frame_eqs_str:Ce,pixel_eqs_str:``,pixel_eqs:``,warp:``,comp:``},Te={rating:1,gammaadj:1.56,decay:1,echo_zoom:.362,echo_orient:1,wave_thick:1,wave_brighten:0,darken:1,wave_a:.001,wave_scale:1.599,wave_smoothing:0,wave_mystery:-.5,modwavealphastart:2,modwavealphaend:2,warpscale:.107,zoomexp:.1584,fshader:1,warp:.01,wave_r:.51,wave_g:.5,ob_size:0,ob_a:1,ib_r:0,ib_g:0,ib_b:0,ib_a:1,mv_x:64,mv_y:48,mv_l:.5,mv_r:0,mv_g:0,mv_b:0,mv_a:0},Ee=[{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],De=[{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],Oe=`a.q21=0;a.q22=0;a.q23=0;a.q24=0;a.q25=0;a.q26=0;a.q27=0;a.q21=div(1,Math.asin(1));`,ke=`a.q21=0;a.q22=-.5;a.q23=0;a.q24=.5;a.q25=div(.5,Math.asin(1));a.q26=.1*a.time;a.q27=.1*-a.time;`,Ae=`uniform sampler2D sampler_rand01;
 shader_body { 
  vec4 tmpvar_1;
  tmpvar_1.w = 1.0;
  tmpvar_1.xyz = texture (sampler_rand01, uv_orig).xyz;
  ret = tmpvar_1.xyz;
 }`,je=`vec2 xlat_mutabledenominator;
vec2 xlat_mutablenumerator;
 shader_body { 
  vec2 c_1;
  vec2 tmpvar_2;
  tmpvar_2 = (((uv - 0.5) * 2.0) * aspect.wz);
  vec2 tmpvar_3;
  tmpvar_3.x = q21;
  tmpvar_3.y = q22;
  xlat_mutablenumerator = ((tmpvar_2 + tmpvar_3) * 64.0);
  vec2 tmpvar_4;
  tmpvar_4.x = q23;
  tmpvar_4.y = q24;
  xlat_mutabledenominator = (tmpvar_2 + tmpvar_4);
  vec2 tmpvar_5;
  tmpvar_5.x = ((xlat_mutablenumerator.x * xlat_mutabledenominator.x) + (xlat_mutablenumerator.y * xlat_mutabledenominator.y));
  tmpvar_5.y = ((xlat_mutablenumerator.y * xlat_mutabledenominator.x) - (xlat_mutablenumerator.x * xlat_mutabledenominator.y));
  c_1 = ((tmpvar_5 / (
    (xlat_mutabledenominator.x * xlat_mutabledenominator.x)
   + 
    (xlat_mutabledenominator.y * xlat_mutabledenominator.y)
  )) - 0.5);
  float tmpvar_6;
  float tmpvar_7;
  tmpvar_7 = (min (abs(
    (c_1.x / c_1.y)
  ), 1.0) / max (abs(
    (c_1.x / c_1.y)
  ), 1.0));
  float tmpvar_8;
  tmpvar_8 = (tmpvar_7 * tmpvar_7);
  tmpvar_8 = (((
    ((((
      ((((-0.01213232 * tmpvar_8) + 0.05368138) * tmpvar_8) - 0.1173503)
     * tmpvar_8) + 0.1938925) * tmpvar_8) - 0.3326756)
   * tmpvar_8) + 0.9999793) * tmpvar_7);
  tmpvar_8 = (tmpvar_8 + (float(
    (abs((c_1.x / c_1.y)) > 1.0)
  ) * (
    (tmpvar_8 * -2.0)
   + 1.570796)));
  tmpvar_6 = (tmpvar_8 * sign((c_1.x / c_1.y)));
  if ((abs(c_1.y) > (1e-08 * abs(c_1.x)))) {
    if ((c_1.y < 0.0)) {
      if ((c_1.x >= 0.0)) {
        tmpvar_6 += 3.141593;
      } else {
        tmpvar_6 = (tmpvar_6 - 3.141593);
      };
    };
  } else {
    tmpvar_6 = (sign(c_1.x) * 1.570796);
  };
  float tmpvar_9;
  tmpvar_9 = -(tmpvar_6);
  vec2 tmpvar_10;
  tmpvar_10.x = ((tmpvar_9 * q25) + q26);
  tmpvar_10.y = (((
    (0.5 * aspect.w)
   * 
    log(sqrt(dot (c_1, c_1)))
  ) + (tmpvar_9 * q25)) + q27);
  vec4 tmpvar_11;
  tmpvar_11.w = 1.0;
  tmpvar_11.xyz = texture (sampler_main, (0.5 + ((0.5 - 
    abs(((fract(
      (tmpvar_10 * 0.5)
    ) * 2.0) - 1.0))
  ) * 0.97))).xyz;
  ret = tmpvar_11.xyz;
 }`,Me={baseVals:Te,shapes:Ee,waves:De,init_eqs_str:Oe,frame_eqs_str:ke,pixel_eqs_str:``,pixel_eqs:``,warp:Ae,comp:je},Ne={rating:0,gammaadj:1,decay:1,echo_zoom:1,wave_mode:7,wave_thick:1,wave_brighten:0,wrap:0,wave_a:.001,wave_scale:.01,wave_smoothing:.9,wave_mystery:1,modwavealphastart:.5,modwavealphaend:1,warpanimspeed:2.155,warpscale:.591,zoomexp:1.00016,dx:1e-5,dy:1e-5,warp:8.31106,wave_r:.5,wave_g:.5,wave_b:.5,wave_y:.6,ob_size:.005,ob_a:1,ib_size:.005,ib_r:0,ib_g:0,ib_b:0,ib_a:.1,mv_x:64,mv_y:48,mv_l:1.5,mv_r:0,mv_g:0,mv_b:0,mv_a:0,b1ed:1},Pe=[{baseVals:{enabled:1,textured:1,y:1.8},init_eqs_str:``,frame_eqs_str:``},{baseVals:{enabled:1,textured:1,y:1.8},init_eqs_str:``,frame_eqs_str:``},{baseVals:{enabled:1,textured:1,y:1.8},init_eqs_str:``,frame_eqs_str:``},{baseVals:{enabled:0}}],Fe=[{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],Ie=`a.c_inv_i=0;a.translation_x=0;a.q12=0;a.a_i=0;a.a_r=0;a.q18=0;a.q13=0;a.scale=0;a.q15=0;a.c_inv_r=0;a.angle=0;a.q11=0;a.bcad_r=0;a.b_r=0;a.q16=0;a.bcad_i=0;a.q17=0;a.q14=0;a.translation_y=0;a.translation_v=0;a.b_i=0;a.translation_u=0;`,Le=`a.scale=1;a.angle=.2*a.time;a.translation_x=0;a.translation_y=.12;a.a_r=Math.cos(a.angle)*a.scale;a.a_i=Math.sin(a.angle)*a.scale;a.b_r=a.translation_x;a.b_i=a.translation_y;a.scale=1;a.angle=.3*Math.sin(.1337*a.time);a.translation_u=0;a.translation_v=-.2;a.q15=Math.cos(a.angle)*a.scale;a.q16=Math.sin(a.angle)*a.scale;a.q17=a.translation_u;a.q18=a.translation_v;a.c_inv_r=div(a.q15,a.q15*a.q15+a.q16*a.q16);a.c_inv_i=div(a.q16,a.q15*a.q15+a.q16*a.q16);a.q11=a.a_r*a.c_inv_r-a.a_i*
a.c_inv_i;a.q12=a.a_r*a.c_inv_i-a.a_i*a.c_inv_r;a.bcad_r=a.b_r*a.q15-a.b_i*a.q16-(a.a_r*a.q17-a.a_i*a.q18);a.bcad_i=a.b_r*a.q16-a.b_i*a.q15-(a.a_r*a.q18-a.a_i*a.q17);a.q13=a.bcad_r*a.c_inv_r-a.bcad_i*a.c_inv_i;a.q14=a.bcad_r*a.c_inv_i-a.bcad_i*a.c_inv_r;`,Re=`uniform sampler2D sampler_sunrise;
 shader_body { 
  vec4 tmpvar_1;
  tmpvar_1.w = 1.0;
  tmpvar_1.xyz = texture (sampler_sunrise, clamp ((0.5 + (
    (uv - 0.5)
   * 0.85)), 0.0, 1.0)).xyz;
  ret = tmpvar_1.xyz;
 }`,ze=` shader_body { 
  vec2 tmpvar_1;
  tmpvar_1.x = q11;
  tmpvar_1.y = q12;
  vec2 tmpvar_2;
  tmpvar_2.x = q17;
  tmpvar_2.y = q18;
  vec2 tmpvar_3;
  tmpvar_3 = (uv - 0.5);
  vec2 tmpvar_4;
  tmpvar_4.x = ((tmpvar_3.x * q15) - (tmpvar_3.y * q16));
  tmpvar_4.y = ((tmpvar_3.x * q16) - (tmpvar_3.y * q15));
  vec2 tmpvar_5;
  tmpvar_5 = ((tmpvar_4 * aspect.yx) + tmpvar_2);
  vec2 tmpvar_6;
  tmpvar_6.x = ((q13 * tmpvar_5.x) + (q14 * tmpvar_5.y));
  tmpvar_6.y = ((q14 * tmpvar_5.x) - (q13 * tmpvar_5.y));
  vec4 tmpvar_7;
  tmpvar_7.w = 1.0;
  tmpvar_7.xyz = ((texture (sampler_blur1, (0.5 + 
    (((1.0 - abs(
      ((fract((
        ((tmpvar_6 / ((tmpvar_5.x * tmpvar_5.x) + (tmpvar_5.y * tmpvar_5.y))) + tmpvar_1)
       * 0.5)) * 2.0) - 1.0)
    )) - 0.5) * 0.99)
  )).xyz * scale1) + bias1);
  ret = tmpvar_7.xyz;
 }`,Be={baseVals:Ne,shapes:Pe,waves:Fe,init_eqs_str:Ie,frame_eqs_str:Le,pixel_eqs_str:``,pixel_eqs:``,warp:Re,comp:ze},Ve={rating:4,gammaadj:1,decay:.925,echo_zoom:1.007,echo_orient:3,wave_mode:2,wave_brighten:0,wrap:0,wave_a:3.222,wave_scale:.685,warpscale:5.921,zoom:1.0003,warp:.59124,sy:.99998,wave_r:.5,wave_g:.5,wave_b:.5,ob_size:0,ob_r:1,ob_g:.05,ob_b:.1,ob_a:1,ib_size:0,mv_x:64,mv_y:48,mv_l:0,b1x:.5},He=[{baseVals:{enabled:1,sides:100,additive:1,textured:1,rad:1.79142,tex_ang:.06283,g:1,b:1,a:.08,r2:1,b2:1,a2:.08,border_a:0},init_eqs_str:`a.q1=0;a.q1=0;a.q1=0;a.q1=0;`,frame_eqs_str:`a.additive=a.q1;a.a=.00001<Math.abs(a.q1)?1:a.a;a.a2=a.a;a.r=a.q1;a.r2=a.q1;a.tex_zoom=3-3*a.bass;`},{baseVals:{enabled:1,sides:100,additive:1,textured:1,rad:1.79142,tex_ang:.06283,b:1,a:.08,r2:1,a2:.08,border_a:0},init_eqs_str:`a.q1=0;a.q1=0;a.q1=0;a.q1=0;`,frame_eqs_str:`a.additive=a.q1;a.a=.00001<Math.abs(a.q1)?1:a.a;a.a2=a.a;a.r=a.q1;a.r2=a.q1;a.tex_zoom=3-2*a.bass;`},{baseVals:{enabled:1,sides:100,textured:1,rad:.91974,tex_ang:1.69646,tex_zoom:1.0303,g:1,b:1,r2:1,b2:1,border_a:0},init_eqs_str:`a.q1=0;a.q2=0;a.q2=0;`,frame_eqs_str:`a.tex_zoom=a.q1+a.tex_zoom-.01*a.q2;a.a2=1;a.tex_ang=.2*a.q2+Math.sin(.4*a.time);`},{baseVals:{enabled:0}}],Ue=[{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],We=`a.mq29=0;a.cthr=0;a.d=0;a.n=0;a.mq1=0;a.z=0;a.n2=0;a.tb=0;a.tg=0;a.q25=0;a.q12=0;a.w2=0;a.q22=0;a.q21=0;a.wzoom=0;a.q13=0;a.tr=0;a.q29=0;a.q6=0;a.j3=0;a.q1=0;a.mq31=0;a.q5=0;a.mq21=0;a.n1=0;a.mq24=0;a.bass_thresh=0;a.v=0;a.chng=0;a.mq28=0;a.w3=0;a.count=0;a.mq23=0;a.q31=0;a.q23=0;a.q24=0;a.q11=0;a.pi=0;a.q10=0;a.atime=0;a.ry=0;a.pi2inv=0;a.q4=0;a.rx=0;a.j2=0;a.q26=0;a.w1=0;a.tx=0;a.zz=0;a.mq27=0;a.mq25=0;a.mq22=0;a.vol=0;a.mq26=0;a.j1=0;a.q2=0;a.q27=0;a.maskangle=0;a.q3=0;a.q32=
0;a.q7=0;a.q28=0;a.ty=0;a.q30=0;a.rb=0;a.q20=0;a.mtime=0;`,Ge=`a.chng=Math.sin(.5*a.time);a.cthr=.9999;a.mq21=.00001<Math.abs(above(a.chng,a.cthr))?randint(3):a.mq21;a.mq22=.00001<Math.abs(above(a.chng,a.cthr))?randint(3):a.mq22;a.mq23=.00001<Math.abs(above(a.chng,a.cthr))?randint(3):a.mq23;a.mq24=.00001<Math.abs(above(a.chng,a.cthr))?randint(2):a.mq24;a.mq25=.00001<Math.abs(above(a.chng,a.cthr))?randint(2):a.mq25;a.mq26=.00001<Math.abs(above(a.chng,a.cthr))?randint(2):a.mq26;a.mq27=.00001<Math.abs(above(a.chng,a.cthr))?randint(1):a.mq27;
a.mq28=.00001<Math.abs(above(a.chng,a.cthr))?randint(1):a.mq28;a.mq29=.00001<Math.abs(above(a.chng,a.cthr))?.3*randint(1):a.mq29;a.mq31=.00001<Math.abs(above(a.chng,a.cthr))?.3*randint(1):a.mq31;a.monitor=a.chng;a.q21=a.mq21;a.q22=a.mq22;a.q23=a.mq23;a.q24=a.mq24;a.q25=a.mq25;a.q26=a.mq26;a.q27=a.mq27;a.q28=a.mq28;a.q29=a.mq29;a.q31=a.mq31;a.monitor=a.mq1;a.vol=a.bass+a.treb+a.mid;a.atime+=a.vol;a.q11=.4+.4*Math.sin(.006*a.atime);a.q12=.4+.4*Math.cos(.00613828348*a.atime);a.q13=.4+.4*Math.sin(.00598593455*
a.atime);a.monitor=a.q13;a.q4=Math.sin(.03*a.atime);a.q5=Math.cos(.030383824*a.atime);a.q6=Math.tan(.029384834*a.atime);a.wzoom=.18*Math.sin(a.time);a.q3=a.wzoom;a.q1=.8-.3*Math.sin(1.3*-a.time);a.q2=.8-.3*Math.cos(-a.time);a.monitor=a.fps;a.vol=.1*(9*a.vol+.333333*(a.bass_att+a.mid_att+a.treb_att));a.q20=a.vol;a.mtime+=.05*a.vol;a.rx=.3+.05*Math.sin(.3*a.mtime);a.ry=.5+.05*Math.sin(.4*a.mtime);a.q4=a.rx;a.q5=a.ry;a.tx=.5+.4*Math.sin(.18*a.mtime);a.ty=.5+1.3*Math.sin(.14*a.mtime);a.q6=a.tx;a.q7=a.ty;
a.tr=.5+.4*(.6*Math.sin(.64*a.mtime)+.4*Math.sin(.32*a.mtime));a.tb=.5+.4*(.6*Math.sin(.24*-a.mtime)+.4*Math.sin(.72*a.mtime));a.tg=.5+.4*(.6*Math.sin(.42*a.mtime)+.4*Math.cos(.5*a.mtime));a.q11=a.tr;a.q12=a.tg;a.q13=a.rb;a.bass_thresh=2*above(a.bass_att,a.bass_thresh)+(1-above(a.bass_att,a.bass_thresh))*(.96*(a.bass_thresh-1.3)+1.3);a.count=1*equal(a.bass_thresh,2)+(1-equal(a.bass_thresh,2))*a.count;a.count-=.02*above(a.count,.02);a.q10=a.count;a.d=20;a.z=.4;a.zz=10+2*a.bass_att;a.pi=2*Math.asin(1);
a.pi2inv=div(.5,a.pi);a.maskangle=Math.asin(div(1,a.d));a.q32=a.maskangle;a.q31=a.d;a.q30=a.z;a.q29=a.pi2inv;a.q28=a.pi;a.q27=div(1,a.zz);a.q26=a.time;a.v=.4;a.j1=.95*a.j1+sqr(4*a.bass)*a.v;a.j2=.95*a.j2+sqr(4*a.mid)*a.v;a.j3=.95*a.j3+sqr(4*a.treb)*a.v;a.n+=.0052*a.j1;a.n1+=.0052*a.j2;a.n2+=.0052*a.j3;a.w1=.01*a.n;a.w2=.01*a.n1;a.w3=.01*a.n2;a.q20=Math.cos(a.w1);a.q21=Math.sin(a.w1);a.q22=Math.cos(a.w2);a.q23=Math.sin(a.w2);a.q24=Math.cos(a.w3);a.q25=Math.sin(a.w3);`,Ke=` shader_body { 
  vec2 tmp_1;
  vec3 ret_2;
  tmp_1.x = (ang * 3.0);
  tmp_1.y = rad;
  vec3 tmpvar_3;
  tmpvar_3 = (texture (sampler_noise_lq, ((
    ((texsize.xy * texsize_noise_lq.zw).x * uv)
   / 2.0) + q23)) + 1.0).xyz;
  vec3 tmpvar_4;
  tmpvar_4 = (((texture (sampler_blur1, uv).xyz * scale1) + bias1) - 0.3);
  vec2 tmpvar_5;
  tmpvar_5.x = (0.3 * tmpvar_4.x);
  tmpvar_5.y = tmpvar_4.y;
  ret_2 = ((-0.4 * (
    ((texture (sampler_blur1, ((uv / 4.0) + (0.4 * tmpvar_5))).xyz * scale1) + bias1)
   - 
    (tmpvar_3 * 0.1)
  )) + (texture (sampler_main, (uv + 
    (tmpvar_4 * 0.01)
  .xy)).xyz + (tmpvar_3 * 0.1)));
  vec4 tmpvar_6;
  tmpvar_6 = texture (sampler_noisevol_hq, (((vec3(0.05, 0.05, 0.0) * tmp_1.xyy) * (
    (q27 * texsize.xyy)
   * texsize_noisevol_hq.zww)) + ((time * vec3(0.0, 0.0, 1.0)) * q29)));
  if (((ret_2.x > (q21 * q13)) && (ret_2.x <= (q24 * q11)))) {
    ret_2.y = (ret_2.y + (tmpvar_6.x * 0.5));
  };
  if (((ret_2.y > (q22 * q11)) && (ret_2.y <= (q25 * q12)))) {
    ret_2.z = (ret_2.z + (tmpvar_6.y * 0.5));
  };
  if (((ret_2.z > (q23 * q12)) && (ret_2.z <= (q26 * q13)))) {
    ret_2.x = (ret_2.x + (tmpvar_6.z * 0.5));
  };
  float tmpvar_7;
  tmpvar_7 = (1.0 - ((0.01 * q28) * (q28 * rad)));
  ret_2 = (ret_2 * (0.98 * (tmpvar_7 * tmpvar_7)));
  ret_2 = (ret_2 - 0.04);
  vec4 tmpvar_8;
  tmpvar_8.w = 1.0;
  tmpvar_8.xyz = ret_2;
  ret = tmpvar_8.xyz;
 }`,qe=` shader_body { 
  float dots_1;
  float dy_2;
  float dx_3;
  vec2 uv1_4;
  vec2 polar2_5;
  vec3 p_6;
  vec2 polar_7;
  vec2 c_8;
  vec3 ret_9;
  vec2 tmpvar_10;
  tmpvar_10 = ((q27 * (uv - 0.5)) * aspect.xy);
  c_8 = tmpvar_10;
  float tmpvar_11;
  tmpvar_11 = sqrt(dot (tmpvar_10, tmpvar_10));
  float tmpvar_12;
  float tmpvar_13;
  tmpvar_13 = (min (abs(
    (tmpvar_11 / q30)
  ), 1.0) / max (abs(
    (tmpvar_11 / q30)
  ), 1.0));
  float tmpvar_14;
  tmpvar_14 = (tmpvar_13 * tmpvar_13);
  tmpvar_14 = (((
    ((((
      ((((-0.01213232 * tmpvar_14) + 0.05368138) * tmpvar_14) - 0.1173503)
     * tmpvar_14) + 0.1938925) * tmpvar_14) - 0.3326756)
   * tmpvar_14) + 0.9999793) * tmpvar_13);
  tmpvar_14 = (tmpvar_14 + (float(
    (abs((tmpvar_11 / q30)) > 1.0)
  ) * (
    (tmpvar_14 * -2.0)
   + 1.570796)));
  tmpvar_12 = (tmpvar_14 * sign((tmpvar_11 / q30)));
  if ((abs(q30) > (1e-08 * abs(tmpvar_11)))) {
    if ((q30 < 0.0)) {
      if ((tmpvar_11 >= 0.0)) {
        tmpvar_12 += 3.141593;
      } else {
        tmpvar_12 = (tmpvar_12 - 3.141593);
      };
    };
  } else {
    tmpvar_12 = (sign(tmpvar_11) * 1.570796);
  };
  bool tmpvar_15;
  tmpvar_15 = (q32 >= tmpvar_12);
  float tmpvar_16;
  float tmpvar_17;
  tmpvar_17 = (min (abs(
    (tmpvar_10.x / tmpvar_10.y)
  ), 1.0) / max (abs(
    (tmpvar_10.x / tmpvar_10.y)
  ), 1.0));
  float tmpvar_18;
  tmpvar_18 = (tmpvar_17 * tmpvar_17);
  tmpvar_18 = (((
    ((((
      ((((-0.01213232 * tmpvar_18) + 0.05368138) * tmpvar_18) - 0.1173503)
     * tmpvar_18) + 0.1938925) * tmpvar_18) - 0.3326756)
   * tmpvar_18) + 0.9999793) * tmpvar_17);
  tmpvar_18 = (tmpvar_18 + (float(
    (abs((tmpvar_10.x / tmpvar_10.y)) > 1.0)
  ) * (
    (tmpvar_18 * -2.0)
   + 1.570796)));
  tmpvar_16 = (tmpvar_18 * sign((tmpvar_10.x / tmpvar_10.y)));
  if ((abs(tmpvar_10.y) > (1e-08 * abs(tmpvar_10.x)))) {
    if ((tmpvar_10.y < 0.0)) {
      if ((tmpvar_10.x >= 0.0)) {
        tmpvar_16 += 3.141593;
      } else {
        tmpvar_16 = (tmpvar_16 - 3.141593);
      };
    };
  } else {
    tmpvar_16 = (sign(tmpvar_10.x) * 1.570796);
  };
  float x_19;
  x_19 = (q31 * sin(tmpvar_12));
  vec2 tmpvar_20;
  tmpvar_20.x = tmpvar_16;
  tmpvar_20.y = ((q28 - tmpvar_12) + (sign(x_19) * (1.570796 - 
    (sqrt((1.0 - abs(x_19))) * (1.570796 + (abs(x_19) * (-0.2146018 + 
      (abs(x_19) * (0.08656672 + (abs(x_19) * -0.03102955)))
    ))))
  )));
  polar_7 = tmpvar_20;
  vec3 tmpvar_21;
  tmpvar_21.x = (sin(tmpvar_16) * sin(tmpvar_20.y));
  tmpvar_21.y = (cos(tmpvar_16) * sin(tmpvar_20.y));
  tmpvar_21.z = cos(tmpvar_20.y);
  vec2 tmpvar_22;
  tmpvar_22.x = ((tmpvar_21.z * q20) - (tmpvar_21.y * q21));
  tmpvar_22.y = ((tmpvar_21.z * q21) + (tmpvar_21.y * q20));
  vec2 tmpvar_23;
  tmpvar_23.x = ((tmpvar_22.x * q22) - (tmpvar_21.x * q23));
  tmpvar_23.y = ((tmpvar_22.x * q23) + (tmpvar_21.x * q22));
  p_6.z = tmpvar_23.x;
  vec2 tmpvar_24;
  tmpvar_24.x = ((tmpvar_22.y * q24) - (tmpvar_23.y * q25));
  tmpvar_24.y = ((tmpvar_22.y * q25) + (tmpvar_23.y * q24));
  p_6.xy = tmpvar_24.yx;
  float tmpvar_25;
  float tmpvar_26;
  tmpvar_26 = (min (abs(
    (tmpvar_23.x / tmpvar_24.y)
  ), 1.0) / max (abs(
    (tmpvar_23.x / tmpvar_24.y)
  ), 1.0));
  float tmpvar_27;
  tmpvar_27 = (tmpvar_26 * tmpvar_26);
  tmpvar_27 = (((
    ((((
      ((((-0.01213232 * tmpvar_27) + 0.05368138) * tmpvar_27) - 0.1173503)
     * tmpvar_27) + 0.1938925) * tmpvar_27) - 0.3326756)
   * tmpvar_27) + 0.9999793) * tmpvar_26);
  tmpvar_27 = (tmpvar_27 + (float(
    (abs((tmpvar_23.x / tmpvar_24.y)) > 1.0)
  ) * (
    (tmpvar_27 * -2.0)
   + 1.570796)));
  tmpvar_25 = (tmpvar_27 * sign((tmpvar_23.x / tmpvar_24.y)));
  if ((abs(tmpvar_24.y) > (1e-08 * abs(tmpvar_23.x)))) {
    if ((tmpvar_24.y < 0.0)) {
      if ((tmpvar_23.x >= 0.0)) {
        tmpvar_25 += 3.141593;
      } else {
        tmpvar_25 = (tmpvar_25 - 3.141593);
      };
    };
  } else {
    tmpvar_25 = (sign(tmpvar_23.x) * 1.570796);
  };
  float tmpvar_28;
  tmpvar_28 = sqrt(dot (p_6.xz, p_6.xz));
  float tmpvar_29;
  float tmpvar_30;
  tmpvar_30 = (min (abs(
    (tmpvar_24.x / tmpvar_28)
  ), 1.0) / max (abs(
    (tmpvar_24.x / tmpvar_28)
  ), 1.0));
  float tmpvar_31;
  tmpvar_31 = (tmpvar_30 * tmpvar_30);
  tmpvar_31 = (((
    ((((
      ((((-0.01213232 * tmpvar_31) + 0.05368138) * tmpvar_31) - 0.1173503)
     * tmpvar_31) + 0.1938925) * tmpvar_31) - 0.3326756)
   * tmpvar_31) + 0.9999793) * tmpvar_30);
  tmpvar_31 = (tmpvar_31 + (float(
    (abs((tmpvar_24.x / tmpvar_28)) > 1.0)
  ) * (
    (tmpvar_31 * -2.0)
   + 1.570796)));
  tmpvar_29 = (tmpvar_31 * sign((tmpvar_24.x / tmpvar_28)));
  if ((abs(tmpvar_28) > (1e-08 * abs(tmpvar_24.x)))) {
    if ((tmpvar_28 < 0.0)) {
      if ((tmpvar_24.x >= 0.0)) {
        tmpvar_29 += 3.141593;
      } else {
        tmpvar_29 = (tmpvar_29 - 3.141593);
      };
    };
  } else {
    tmpvar_29 = (sign(tmpvar_24.x) * 1.570796);
  };
  vec2 tmpvar_32;
  tmpvar_32.x = tmpvar_25;
  tmpvar_32.y = tmpvar_29;
  polar_7 = (((tmpvar_32 * q29) * vec2(1.0, 2.0)) + vec2(0.0, 0.5));
  vec2 tmpvar_33;
  tmpvar_33 = (1.0 - abs((
    (fract(polar_7) * 2.0)
   - 1.0)));
  polar2_5 = tmpvar_33;
  vec2 tmpvar_34;
  tmpvar_34.x = (tmpvar_33.x - q6);
  tmpvar_34.y = (tmpvar_33.y - q5);
  vec2 tmpvar_35;
  tmpvar_35.y = 0.0;
  tmpvar_35.x = texsize.z;
  vec2 tmpvar_36;
  tmpvar_36.x = 0.0;
  tmpvar_36.y = texsize.w;
  float tmpvar_37;
  tmpvar_37 = (texture (sampler_main, (tmpvar_33 - tmpvar_35)).xyz - texture (sampler_main, (tmpvar_33 + tmpvar_35)).xyz).x;
  dx_3 = tmpvar_37;
  float tmpvar_38;
  tmpvar_38 = (texture (sampler_main, (tmpvar_33 - tmpvar_36)).xyz - texture (sampler_main, (tmpvar_33 + tmpvar_36)).xyz).x;
  dy_2 = tmpvar_38;
  vec2 tmpvar_39;
  tmpvar_39.x = tmpvar_37;
  tmpvar_39.y = tmpvar_38;
  uv1_4 = ((0.3 * cos(
    (tmpvar_34 * 2.0)
  )) - tmpvar_39);
  float tmpvar_40;
  tmpvar_40 = clamp ((0.04 / sqrt(
    dot (uv1_4, uv1_4)
  )), 0.0, 1.0);
  uv1_4 = ((0.3 * cos(
    (uv1_4 * 12.0)
  )) - (9.0 * tmpvar_39));
  dots_1 = (tmpvar_40 - dot ((
    (texture (sampler_blur2, tmpvar_33).xyz * scale2)
   + bias2), vec3(0.32, 0.49, 0.29)));
  ret_9 = (dots_1 + ((texture (sampler_main, tmpvar_33).xyz * 12.0) * vec3(clamp (
    (0.04 / sqrt(dot (uv1_4, uv1_4)))
  , 0.0, 1.0))));
  c_8 = ((0.5 - uv) * aspect.xy);
  float tmpvar_41;
  float tmpvar_42;
  tmpvar_42 = (min (abs(
    (c_8.x / q30)
  ), 1.0) / max (abs(
    (c_8.x / q30)
  ), 1.0));
  float tmpvar_43;
  tmpvar_43 = (tmpvar_42 * tmpvar_42);
  tmpvar_43 = (((
    ((((
      ((((-0.01213232 * tmpvar_43) + 0.05368138) * tmpvar_43) - 0.1173503)
     * tmpvar_43) + 0.1938925) * tmpvar_43) - 0.3326756)
   * tmpvar_43) + 0.9999793) * tmpvar_42);
  tmpvar_43 = (tmpvar_43 + (float(
    (abs((c_8.x / q30)) > 1.0)
  ) * (
    (tmpvar_43 * -2.0)
   + 1.570796)));
  tmpvar_41 = (tmpvar_43 * sign((c_8.x / q30)));
  if ((abs(q30) > (1e-08 * abs(c_8.x)))) {
    if ((q30 < 0.0)) {
      if ((c_8.x >= 0.0)) {
        tmpvar_41 += 3.141593;
      } else {
        tmpvar_41 = (tmpvar_41 - 3.141593);
      };
    };
  } else {
    tmpvar_41 = (sign(c_8.x) * 1.570796);
  };
  float tmpvar_44;
  float tmpvar_45;
  tmpvar_45 = (min (abs(
    (c_8.y / q30)
  ), 1.0) / max (abs(
    (c_8.y / q30)
  ), 1.0));
  float tmpvar_46;
  tmpvar_46 = (tmpvar_45 * tmpvar_45);
  tmpvar_46 = (((
    ((((
      ((((-0.01213232 * tmpvar_46) + 0.05368138) * tmpvar_46) - 0.1173503)
     * tmpvar_46) + 0.1938925) * tmpvar_46) - 0.3326756)
   * tmpvar_46) + 0.9999793) * tmpvar_45);
  tmpvar_46 = (tmpvar_46 + (float(
    (abs((c_8.y / q30)) > 1.0)
  ) * (
    (tmpvar_46 * -2.0)
   + 1.570796)));
  tmpvar_44 = (tmpvar_46 * sign((c_8.y / q30)));
  if ((abs(q30) > (1e-08 * abs(c_8.y)))) {
    if ((q30 < 0.0)) {
      if ((c_8.y >= 0.0)) {
        tmpvar_44 += 3.141593;
      } else {
        tmpvar_44 = (tmpvar_44 - 3.141593);
      };
    };
  } else {
    tmpvar_44 = (sign(c_8.y) * 1.570796);
  };
  vec2 tmpvar_47;
  tmpvar_47.x = tmpvar_41;
  tmpvar_47.y = tmpvar_44;
  polar_7 = tmpvar_47;
  vec3 tmpvar_48;
  tmpvar_48.x = (sin(tmpvar_41) * cos(tmpvar_44));
  tmpvar_48.y = (sin(tmpvar_44) * cos(tmpvar_41));
  tmpvar_48.z = (cos(tmpvar_41) * cos(tmpvar_44));
  vec2 tmpvar_49;
  tmpvar_49.x = ((tmpvar_48.z * q20) - (tmpvar_48.y * q21));
  tmpvar_49.y = ((tmpvar_48.z * q21) + (tmpvar_48.y * q20));
  vec2 tmpvar_50;
  tmpvar_50.x = ((tmpvar_49.x * q22) - (tmpvar_48.x * q23));
  tmpvar_50.y = ((tmpvar_49.x * q23) + (tmpvar_48.x * q22));
  p_6.z = tmpvar_50.x;
  vec2 tmpvar_51;
  tmpvar_51.x = ((tmpvar_49.y * q24) - (tmpvar_50.y * q25));
  tmpvar_51.y = ((tmpvar_49.y * q25) + (tmpvar_50.y * q24));
  p_6.xy = tmpvar_51.yx;
  float tmpvar_52;
  float tmpvar_53;
  tmpvar_53 = (min (abs(
    (tmpvar_51.y / tmpvar_50.x)
  ), 1.0) / max (abs(
    (tmpvar_51.y / tmpvar_50.x)
  ), 1.0));
  float tmpvar_54;
  tmpvar_54 = (tmpvar_53 * tmpvar_53);
  tmpvar_54 = (((
    ((((
      ((((-0.01213232 * tmpvar_54) + 0.05368138) * tmpvar_54) - 0.1173503)
     * tmpvar_54) + 0.1938925) * tmpvar_54) - 0.3326756)
   * tmpvar_54) + 0.9999793) * tmpvar_53);
  tmpvar_54 = (tmpvar_54 + (float(
    (abs((tmpvar_51.y / tmpvar_50.x)) > 1.0)
  ) * (
    (tmpvar_54 * -2.0)
   + 1.570796)));
  tmpvar_52 = (tmpvar_54 * sign((tmpvar_51.y / tmpvar_50.x)));
  if ((abs(tmpvar_50.x) > (1e-08 * abs(tmpvar_51.y)))) {
    if ((tmpvar_50.x < 0.0)) {
      if ((tmpvar_51.y >= 0.0)) {
        tmpvar_52 += 3.141593;
      } else {
        tmpvar_52 = (tmpvar_52 - 3.141593);
      };
    };
  } else {
    tmpvar_52 = (sign(tmpvar_51.y) * 1.570796);
  };
  float tmpvar_55;
  tmpvar_55 = sqrt(dot (p_6.xz, p_6.xz));
  float tmpvar_56;
  float tmpvar_57;
  tmpvar_57 = (min (abs(
    (tmpvar_51.x / tmpvar_55)
  ), 1.0) / max (abs(
    (tmpvar_51.x / tmpvar_55)
  ), 1.0));
  float tmpvar_58;
  tmpvar_58 = (tmpvar_57 * tmpvar_57);
  tmpvar_58 = (((
    ((((
      ((((-0.01213232 * tmpvar_58) + 0.05368138) * tmpvar_58) - 0.1173503)
     * tmpvar_58) + 0.1938925) * tmpvar_58) - 0.3326756)
   * tmpvar_58) + 0.9999793) * tmpvar_57);
  tmpvar_58 = (tmpvar_58 + (float(
    (abs((tmpvar_51.x / tmpvar_55)) > 1.0)
  ) * (
    (tmpvar_58 * -2.0)
   + 1.570796)));
  tmpvar_56 = (tmpvar_58 * sign((tmpvar_51.x / tmpvar_55)));
  if ((abs(tmpvar_55) > (1e-08 * abs(tmpvar_51.x)))) {
    if ((tmpvar_55 < 0.0)) {
      if ((tmpvar_51.x >= 0.0)) {
        tmpvar_56 += 3.141593;
      } else {
        tmpvar_56 = (tmpvar_56 - 3.141593);
      };
    };
  } else {
    tmpvar_56 = (sign(tmpvar_51.x) * 1.570796);
  };
  vec2 tmpvar_59;
  tmpvar_59.x = tmpvar_52;
  tmpvar_59.y = (tmpvar_56 * 2.0);
  polar_7 = ((tmpvar_59 * q29) + vec2(0.0, 0.5));
  polar2_5 = (1.0 - abs((
    (fract(polar_7) * 2.0)
   - 1.0)));
  vec2 tmpvar_60;
  tmpvar_60.x = (polar2_5.x - q6);
  tmpvar_60.y = (polar2_5.y - q5);
  vec2 tmpvar_61;
  tmpvar_61.y = 0.0;
  tmpvar_61.x = texsize.z;
  vec2 tmpvar_62;
  tmpvar_62.x = 0.0;
  tmpvar_62.y = texsize.w;
  dx_3 = (texture (sampler_main, (polar2_5 - tmpvar_61)).xyz - texture (sampler_main, (polar2_5 + tmpvar_61)).xyz).x;
  dy_2 = (texture (sampler_main, (polar2_5 - tmpvar_62)).xyz - texture (sampler_main, (polar2_5 + tmpvar_62)).xyz).x;
  vec2 tmpvar_63;
  tmpvar_63.x = dx_3;
  tmpvar_63.y = dy_2;
  uv1_4 = ((0.3 * cos(
    (tmpvar_60 * 2.0)
  )) - tmpvar_63);
  float tmpvar_64;
  tmpvar_64 = clamp ((0.04 / sqrt(
    dot (uv1_4, uv1_4)
  )), 0.0, 1.0);
  uv1_4 = ((0.3 * cos(
    (uv1_4 * 12.0)
  )) - (9.0 * tmpvar_63));
  dots_1 = (tmpvar_64 - dot ((
    (texture (sampler_blur2, polar2_5).xyz * scale2)
   + bias2), vec3(0.32, 0.49, 0.29)));
  vec3 tmpvar_65;
  tmpvar_65 = mix (ret_9, pow ((dots_1 + 
    ((texture (sampler_main, polar2_5).xyz * 12.0) * vec3(clamp ((0.04 / sqrt(
      dot (uv1_4, uv1_4)
    )), 0.0, 1.0)))
  ), vec3(1.75, 1.75, 1.75)).yzx, vec3((1.0 - float(tmpvar_15))));
  ret_9 = tmpvar_65;
  vec4 tmpvar_66;
  tmpvar_66 = texture (sampler_noisevol_hq, (((vec3(0.05, 0.05, 0.0) * uv1_4.xyy) * (
    (q28 * texsize.xyy)
   * texsize_noisevol_hq.zww)) + ((time * vec3(0.0, 0.0, 1.0)) * q31)));
  if (((tmpvar_65.x > (q26 * q13)) && (tmpvar_65.x <= (q23 * q11)))) {
    ret_9.z = (tmpvar_65.z - (tmpvar_66.x * 0.5));
  };
  if (((tmpvar_65.y > (q25 * q11)) && (tmpvar_65.y <= (q22 * q12)))) {
    ret_9.x = (tmpvar_65.x - (tmpvar_66.y * 0.5));
  };
  if (((ret_9.z > (q24 * q12)) && (ret_9.z <= (q21 * q13)))) {
    ret_9.y = (tmpvar_65.y - (tmpvar_66.z * 0.5));
  };
  vec4 tmpvar_67;
  tmpvar_67.w = 1.0;
  tmpvar_67.xyz = ret_9;
  ret = tmpvar_67.xyz;
 }`,Je={baseVals:Ve,shapes:He,waves:Ue,init_eqs_str:We,frame_eqs_str:Ge,pixel_eqs_str:``,pixel_eqs:``,warp:Ke,comp:qe},Ye={rating:5,gammaadj:1,decay:1,additivewave:1,wave_thick:1,modwavealphabyvolume:1,wave_brighten:0,wave_a:.001,wave_scale:.545,wave_smoothing:0,modwavealphastart:1.1,modwavealphaend:1.1,zoom:1.14635,warp:.01605,wave_r:0,ob_size:.005,mv_x:64,mv_y:48,mv_l:1,mv_b:.9,mv_a:0,b1ed:0},Xe=[{baseVals:{enabled:0}},{baseVals:{enabled:1,sides:3,additive:1,thickoutline:1,num_inst:2,rad:1.2523,tex_ang:.25133,tex_zoom:1.136,r:.36,g2:0,border_r:0,border_g:0,border_b:.99,border_a:0},init_eqs_str:`a.q28=0;a.q29=0;a.q32=0;a.q30=0;a.q31=0;`,frame_eqs_str:`a.r=.05*Math.floor(randint(10))+.5;a.x=a.q28;a.y=a.q29;a.rad=a.q32;a.ang=.00001<Math.abs(equal(a.instance,0))?a.q30:a.q31;`},{baseVals:{enabled:1,sides:3,additive:1,thickoutline:1,num_inst:2,rad:1.25237,tex_ang:.25133,tex_zoom:1.136,r:.36,g2:0,border_r:0,border_g:0,border_b:.99,border_a:0},init_eqs_str:`a.q23=0;a.q24=0;a.q27=0;a.q25=0;a.q26=0;`,frame_eqs_str:`a.r=.05*Math.floor(randint(10))+.5;a.x=a.q23;a.y=a.q24;a.rad=a.q27;a.ang=.00001<Math.abs(equal(a.instance,0))?a.q25:a.q26;`},{baseVals:{enabled:0}}],Ze=[{baseVals:{enabled:0}},{baseVals:{enabled:1,samples:42,usedots:1,thick:1,additive:1,scaling:81.95444,smoothing:1,g:0,b:0},init_eqs_str:`a.wave_x=0;`,frame_eqs_str:`a.wave_x=1;`,point_eqs_str:`a.x=.001*Math.floor(randint(1E3));a.y=.001*Math.floor(randint(1E3));`},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],Qe=`a.q25=0;a.q29=0;a.q31=0;a.q23=0;a.q24=0;a.q26=0;a.q27=0;a.q32=0;a.q28=0;a.q30=0;`,$e=`a.zoom=.935*a.zoom+.04*(.6*Math.sin(.339*a.bass_att)+.1*Math.sin(.276*a.bass_att));a.rot+=.04*(.6*Math.sin(.381*a.time)+.4*Math.sin(.579*a.time));a.cx+=.003*(.6*Math.sin(.471*a.treb_att)+.4*Math.sin(.297*a.treb_att));a.cy+=.003*(.6*Math.sin(.379*a.mid_att)+.4*Math.sin(.351*a.mid_att));a.dx+=.003*(.6*Math.sin(.234*a.time)+.4*Math.sin(.277*a.time));a.rot+=.02*(Math.sin(2.134*a.time)+Math.sin(1.7134*a.time)+Math.sin(2.834*a.time));a.dx+=.01*(Math.sin(1.134*a.time)+Math.sin(.7134*
a.time)+Math.sin(2.334*a.time));a.dy+=.01*(Math.sin(1.8834*a.time)+Math.sin(1.0144*a.time)+Math.sin(1.334*a.time));a.q23=div(Math.floor(randint(1E3)),1E3);a.q24=div(Math.floor(randint(1E3)),1E3);a.q25=6.28*div(Math.floor(randint(1E3)),1E3);a.q26=a.q25-3.14;a.q27=div(Math.floor(randint(1E3)),12E3)+.1;a.q28=div(Math.floor(randint(1E3)),1E3);a.q29=div(Math.floor(randint(1E3)),1E3);a.q30=6.28*div(Math.floor(randint(1E3)),1E3);a.q31=a.q30-3.14;a.q32=div(Math.floor(randint(1E3)),14E3)+.1;`,et=` shader_body { 
  vec3 ret_1;
  vec2 tmpvar_2;
  tmpvar_2 = (texsize.zw * 12.0);
  vec3 tmpvar_3;
  tmpvar_3 = (((texture (sampler_blur1, 
    (uv + (vec2(1.0, 0.0) * tmpvar_2))
  ).xyz * scale1) + bias1) - ((texture (sampler_blur1, 
    (uv - (vec2(1.0, 0.0) * tmpvar_2))
  ).xyz * scale1) + bias1));
  vec3 tmpvar_4;
  tmpvar_4 = (((texture (sampler_blur1, 
    (uv + (vec2(0.0, 1.0) * tmpvar_2))
  ).xyz * scale1) + bias1) - ((texture (sampler_blur1, 
    (uv - (vec2(0.0, 1.0) * tmpvar_2))
  ).xyz * scale1) + bias1));
  vec2 tmpvar_5;
  tmpvar_5.x = tmpvar_3.y;
  tmpvar_5.y = tmpvar_4.y;
  vec2 tmpvar_6;
  vec2 tmpvar_7;
  tmpvar_7 = (uv_orig * texsize.xy);
  tmpvar_6 = (((tmpvar_7 * texsize_noise_lq.zw) * 0.8) + rand_frame.xy);
  vec2 tmpvar_8;
  tmpvar_8.x = tmpvar_3.x;
  tmpvar_8.y = tmpvar_4.x;
  vec2 tmpvar_9;
  vec2 tmpvar_10;
  tmpvar_10 = (uv_orig - uv);
  tmpvar_9 = (((uv_orig - 
    (tmpvar_10 * 0.4)
  ) + (
    (tmpvar_8 * texsize.zw)
   * 2.0)) + ((
    (texture (sampler_noise_lq, tmpvar_6).xy - 0.5)
   * texsize.zw) * 4.0));
  ret_1.x = (((texture (sampler_main, tmpvar_9).x - 
    ((texture (sampler_main, tmpvar_9).x - ((texture (sampler_blur3, tmpvar_9).xyz * scale3) + bias3).x) * 0.02)
  ) - 0.008) + ((texture (sampler_noise_lq, tmpvar_6).x - 0.5) * 0.1));
  ret_1.y = texture (sampler_main, (uv - (tmpvar_5 * texsize.zw))).y;
  ret_1.y = (ret_1.y + ((
    (ret_1.y - ((texture (sampler_blur1, uv).xyz * scale1) + bias1).y)
   * 0.2) - 0.004));
  ret_1.z = (texture (sampler_main, ((uv_orig - 
    (tmpvar_10 * 2.0)
  ) + (
    (texture (sampler_noise_lq, ((tmpvar_7 * texsize_noise_lq.zw) + rand_frame.xy)).xyz - 0.5)
  .xy * texsize.zw))).z - 0.004);
  vec4 tmpvar_11;
  tmpvar_11.w = 1.0;
  tmpvar_11.xyz = ret_1;
  ret = tmpvar_11.xyz;
 }`,tt=` shader_body { 
  vec2 tmpvar_1;
  tmpvar_1 = (texsize.zw * 4.0);
  vec2 tmpvar_2;
  tmpvar_2.x = (((texture (sampler_blur1, 
    (uv + (vec2(1.0, 0.0) * tmpvar_1))
  ).xyz * scale1) + bias1) - ((texture (sampler_blur1, 
    (uv - (vec2(1.0, 0.0) * tmpvar_1))
  ).xyz * scale1) + bias1)).y;
  tmpvar_2.y = (((texture (sampler_blur1, 
    (uv + (vec2(0.0, 1.0) * tmpvar_1))
  ).xyz * scale1) + bias1) - ((texture (sampler_blur1, 
    (uv - (vec2(0.0, 1.0) * tmpvar_1))
  ).xyz * scale1) + bias1)).y;
  vec4 tmpvar_3;
  tmpvar_3.w = 1.0;
  vec4 tmpvar_4;
  tmpvar_4 = texture (sampler_blur1, uv);
  tmpvar_3.xyz = (mix (mix (
    (vec3(1.0, 0.7, 0.0) * texture (sampler_fc_main, (uv - (tmpvar_2 * 0.4))).x)
  , vec3(0.8, 0.4, 1.0), vec3(
    (((tmpvar_4.xyz * scale1) + bias1).y * 0.5)
  )), vec3(1.0, 1.0, 1.0), vec3((texture (sampler_main, uv).z * 
    (1.0 - (((tmpvar_4.xyz * scale1) + bias1).y * 2.0))
  ))) - 0.1);
  ret = tmpvar_3.xyz;
 }`,nt={baseVals:Ye,shapes:Xe,waves:Ze,init_eqs_str:Qe,frame_eqs_str:$e,pixel_eqs_str:``,pixel_eqs:``,warp:et,comp:tt},rt={rating:2,gammaadj:1.998,echo_zoom:1.421,wave_mode:2,additivewave:1,wave_dots:1,wave_thick:1,modwavealphabyvolume:1,darken_center:1,wave_a:1.193,wave_scale:5.398,wave_smoothing:.9,modwavealphastart:.73,modwavealphaend:1.07,warpanimspeed:.248,warpscale:2.108,zoomexp:3.86996,zoom:1.06152,warp:.01,wave_g:.8,wave_b:.2,mv_a:0},it=[{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],at=[{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],ot=`a.t2=0;`,st=`a.wave_r+=.65*(.6*Math.sin(1.437*a.time)+.4*Math.sin(.97*a.time));a.wave_g+=.65*(.6*Math.sin(1.344*a.time)+.4*Math.sin(.841*a.time));a.wave_b+=.65*(.6*Math.sin(1.251*a.time)+.4*Math.sin(1.055*a.time));a.rot+=.02*(.6*Math.sin(.181*a.time)+.09*Math.sin(-.279*a.time));a.dx+=.001*(.6*Math.sin(.234*a.time)+.4*Math.sin(.277*a.time));a.dy+=.001*(.6*Math.sin(.284*a.time)+.4*Math.sin(.247*a.time));a.decay-=.01*equal(mod(a.frame,6),0);a.t2=6*a.time;a.wave_x=.5+.2*(.6*Math.sin(.374*a.t2)+
.4*Math.sin(.294*a.t2));a.wave_y=.5+.2*(.6*Math.sin(.393*a.t2)+.4*Math.sin(.223*a.t2));`,ct=` shader_body { 
  vec3 ret_1;
  vec4 tmpvar_2;
  tmpvar_2 = ((texture (sampler_noise_lq, (rand_frame.xy + 
    ((uv * texsize_noise_lq.zw) * texsize.xy)
  )) * 2.0) - 1.0);
  ret_1 = (texture (sampler_pw_main, (uv + (
    (tmpvar_2.zw * texsize.zw)
   * 0.5))).xyz + ((0.59 - 
    (0.2 * rad)
  ) * tmpvar_2.xyz));
  ret_1 = (clamp ((
    ((ret_1 - 0.5) * 3.0)
   + 0.25), 0.0, 1.0) * 1.45);
  vec4 tmpvar_3;
  tmpvar_3.w = 1.0;
  tmpvar_3.xyz = ret_1;
  ret = tmpvar_3.xyz;
 }`,lt=` shader_body { 
  vec3 ret_1;
  vec2 tmpvar_2;
  vec2 tmpvar_3;
  tmpvar_3 = (uv - 0.5);
  tmpvar_2 = ((tmpvar_3 * 0.8) + 0.5);
  vec2 tmpvar_4;
  tmpvar_4 = ((tmpvar_3 * 0.6) + 0.5);
  ret_1.x = texture (sampler_main, uv).x;
  ret_1.x = (ret_1.x + ((
    (texture (sampler_blur1, uv).xyz * scale1)
   + bias1).x * 1.5));
  ret_1.y = texture (sampler_main, tmpvar_2).y;
  ret_1.y = (ret_1.y + ((
    (texture (sampler_blur1, tmpvar_2).xyz * scale1)
   + bias1).y * 1.5));
  ret_1.z = texture (sampler_main, tmpvar_4).z;
  ret_1.z = (ret_1.z + ((
    (texture (sampler_blur1, tmpvar_4).xyz * scale1)
   + bias1).z * 1.5));
  ret_1 = (vec3(((
    (ret_1.x + ret_1.y)
   + ret_1.z) * 0.3)) * vec3(0.7, 1.1, 1.5));
  vec4 tmpvar_5;
  tmpvar_5.w = 1.0;
  tmpvar_5.xyz = ret_1;
  ret = tmpvar_5.xyz;
 }`,ut={baseVals:rt,shapes:it,waves:at,init_eqs_str:ot,frame_eqs_str:st,pixel_eqs_str:``,pixel_eqs:``,warp:ct,comp:lt},dt={rating:0,gammaadj:1.9,echo_zoom:1.16936,wave_mode:6,modwavealphabyvolume:1,wave_a:.550382,wave_scale:1.015009,wave_smoothing:.522,modwavealphastart:.83,modwavealphaend:1.31,warpscale:3.138,zoom:1.003,warp:536e-6,wave_r:.5,wave_g:.5,wave_b:.5,mv_a:0},ft=[{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],pt=[{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],mt=`a.dx_residual=0;a.dy_residual=0;a.bass_thresh=0;`,ht=`a.wave_r=.85+.25*Math.sin(.437*a.time+1);a.wave_g=.85+.25*Math.sin(.544*a.time+2);a.wave_b=.85+.25*Math.sin(.751*a.time+3);a.rot+=.01*(.6*Math.sin(.381*a.time)+.4*Math.sin(.579*a.time));a.cx+=.21*(.6*Math.sin(.374*a.time)+.4*Math.sin(.294*a.time));a.cy+=.21*(.6*Math.sin(.393*a.time)+.4*Math.sin(.223*a.time));a.dx+=.003*(.6*Math.sin(.234*a.time)+.4*Math.sin(.277*a.time));a.dy+=.003*(.6*Math.sin(.284*a.time)+.4*Math.sin(.247*a.time));a.decay-=.01*equal(mod(a.frame,6),0);a.dx+=
a.dx_residual;a.dy+=a.dy_residual;a.bass_thresh=2*above(a.bass_att,a.bass_thresh)+(1-above(a.bass_att,a.bass_thresh))*(.96*(a.bass_thresh-1.3)+1.3);a.dx_residual=.016*equal(a.bass_thresh,2.13)*Math.sin(7*a.time)+(1-equal(a.bass_thresh,2.13))*a.dx_residual;a.dy_residual=.012*equal(a.bass_thresh,2.13)*Math.sin(9*a.time)+(1-equal(a.bass_thresh,2.13))*a.dy_residual;a.wave_x-=7*a.dx_residual;a.wave_y-=7*a.dy_residual;a.wave_mystery=.03*a.time;`,gt=`uniform sampler2D sampler_prayerwheel;
 shader_body { 
  vec3 ret_1;
  ret_1 = (texture (sampler_main, uv).xyz + ((texture (sampler_noise_lq, 
    (((uv_orig * texsize.xy) * texsize_noise_lq.zw) + rand_frame.xy)
  ).xyz - 0.5) / 256.0));
  vec4 tmpvar_2;
  tmpvar_2 = texture (sampler_prayerwheel, uv_orig);
  vec2 x_3;
  x_3 = (uv - uv_orig);
  ret_1 = (mix (ret_1, tmpvar_2.xyz, vec3(clamp (
    (1.0 - (abs((
      dot (tmpvar_2.xyz, vec3(0.32, 0.49, 0.29))
     - 
      fract((time * 0.2))
    )) * 33.0))
  , 0.0, 1.0))) * (0.97 + (0.03 * 
    clamp ((sqrt(dot (x_3, x_3)) * 200.0), 0.0, 1.0)
  )));
  vec4 tmpvar_4;
  tmpvar_4.w = 1.0;
  tmpvar_4.xyz = ret_1;
  ret = tmpvar_4.xyz;
 }`,_t=` shader_body { 
  vec3 ret_1;
  vec4 tmpvar_2;
  tmpvar_2 = texture (sampler_main, uv);
  float tmpvar_3;
  tmpvar_3 = dot (tmpvar_2.xyz, vec3(0.3, 0.5, 0.2));
  ret_1 = (mix (vec3(tmpvar_3), tmpvar_2.xyz, vec3(1.7, 1.7, 1.7)) + (0.04 * cos(
    ((tmpvar_3 * 29.0) + 2.8)
  )));
  ret_1 = (ret_1 * 2.0);
  vec4 tmpvar_4;
  tmpvar_4.w = 1.0;
  tmpvar_4.xyz = ret_1;
  ret = tmpvar_4.xyz;
 }`,vt={baseVals:dt,shapes:ft,waves:pt,init_eqs_str:mt,frame_eqs_str:ht,pixel_eqs_str:``,pixel_eqs:``,warp:gt,comp:_t},yt={rating:0,gammaadj:1.9,echo_zoom:1.16936,wave_mode:5,additivewave:1,wave_dots:1,wave_a:3.299999,wave_scale:1.694,wave_smoothing:.9,warpscale:3.138,zoom:1.053,warp:.263,wave_r:.5,wave_g:.5,wave_b:.8,mv_a:0},bt=[{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],xt=[{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],St=`a.dx_residual=0;a.dy_residual=0;a.bass_thresh=0;`,Ct=`a.wave_r+=.65*(.6*Math.sin(1.437*a.time)+.4*Math.sin(.97*a.time));a.wave_g+=.65*(.6*Math.sin(1.344*a.time)+.4*Math.sin(.841*a.time));a.wave_b+=.65*(.6*Math.sin(1.251*a.time)+.4*Math.sin(1.055*a.time));a.rot+=.01*(.6*Math.sin(.381*a.time)+.4*Math.sin(.579*a.time));a.cx+=.21*(.6*Math.sin(.374*a.time)+.4*Math.sin(.294*a.time));a.cy+=.21*(.6*Math.sin(.393*a.time)+.4*Math.sin(.223*a.time));a.dx+=.01*(.6*Math.sin(.234*a.time)+.4*Math.sin(.277*a.time));a.dy+=.01*(.6*Math.sin(.284*
a.time)+.4*Math.sin(.247*a.time));a.decay-=.01*equal(mod(a.frame,6),0);a.dx+=a.dx_residual;a.dy+=a.dy_residual;a.bass_thresh=2*above(a.bass_att,a.bass_thresh)+(1-above(a.bass_att,a.bass_thresh))*(.96*(a.bass_thresh-1.3)+1.3);a.dx_residual=.4*(.016*equal(a.bass_thresh,2)*Math.sin(7*a.time)+(1-equal(a.bass_thresh,2))*a.dx_residual);a.dy_residual=.4*(.012*equal(a.bass_thresh,2)*Math.sin(9*a.time)+(1-equal(a.bass_thresh,2))*a.dy_residual);`,wt=` shader_body { 
  vec4 tmpvar_1;
  tmpvar_1.w = 1.0;
  tmpvar_1.xyz = (texture (sampler_main, uv).xyz - 0.004);
  ret = tmpvar_1.xyz;
 }`,Tt=`uniform sampler2D sampler_fw_clouds;
 shader_body { 
  vec3 ret_1;
  ret_1 = (texture (sampler_main, uv).xyz + ((texture (sampler_blur2, uv).xyz * scale2) + bias2));
  ret_1 = texture (sampler_fw_clouds, ((ret_1.xy * (0.1 + 
    ((0.7 * rand_preset.x) * rand_preset.y)
  )) + ((uv * vec2(1.0, -1.0)) * aspect.xy))).xyz;
  vec4 tmpvar_2;
  tmpvar_2.w = 1.0;
  tmpvar_2.xyz = ret_1;
  ret = tmpvar_2.xyz;
 }`,Et={baseVals:yt,shapes:bt,waves:xt,init_eqs_str:St,frame_eqs_str:Ct,pixel_eqs_str:``,pixel_eqs:``,warp:wt,comp:Tt},Dt={rating:5,gammaadj:1,wave_mode:7,modwavealphabyvolume:1,wave_a:8.2,wave_scale:3.228,wave_smoothing:.9,modwavealphastart:1.05,modwavealphaend:1.65,zoom:1.025,warp:.01605,wave_r:.8,wave_g:.8,wave_b:.8,mv_a:0},Ot=[{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],kt=[{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],At=`a.wave_r+=.3*(.9*Math.sin(1.753*a.time)+.4*Math.sin(1.315*a.time+1));a.wave_g+=.3*(.9*Math.sin(2.883*a.time+3)+.4*Math.sin(1.006*a.time+4));a.wave_b+=.3*(.9*Math.sin(1.393*a.time+5)+.4*Math.sin(2.733*a.time+2));a.zoom+=.013*(.6*Math.sin(.339*a.time)+.4*Math.sin(.276*a.time));a.rot+=.02*(.6*Math.sin(.381*a.time)+.4*Math.sin(.579*a.time));a.cx+=.003*(.6*Math.sin(.471*a.time)+.4*Math.sin(.297*a.time));a.cy+=.003*(.6*Math.sin(.379*a.time)+.4*Math.sin(.351*a.time));a.dx+=.001*(.6*
Math.sin(.234*a.time)+.4*Math.sin(.277*a.time));a.rot+=.02*(Math.sin(2.134*a.time)+Math.sin(1.7134*a.time)+Math.sin(2.834*a.time));a.dx+=.001*(Math.sin(1.134*a.time)+Math.sin(.7134*a.time)+Math.sin(2.334*a.time));a.dy+=.001*(Math.sin(1.8834*a.time)+Math.sin(1.0144*a.time)+Math.sin(1.334*a.time));`,jt=` shader_body { 
  vec3 ret_1;
  ret_1 = texture (sampler_main, uv).xyz;
  vec2 tmpvar_2;
  tmpvar_2 = (normalize((uv - uv_orig)) * texsize.zw);
  vec4 tmpvar_3;
  tmpvar_3.w = 0.0;
  tmpvar_3.xyz = ret_1;
  vec4 tmpvar_4;
  tmpvar_4.w = 0.0;
  tmpvar_4.xyz = max (tmpvar_3, (texture (sampler_main, (uv + tmpvar_2)) * 0.98)).xyz;
  vec4 tmpvar_5;
  tmpvar_5.w = 0.0;
  tmpvar_5.xyz = max (tmpvar_4, (texture (sampler_main, (uv - tmpvar_2)) * 0.98)).xyz;
  vec4 tmpvar_6;
  tmpvar_6.w = 0.0;
  tmpvar_6.xyz = max (tmpvar_5, (texture (sampler_main, (uv + 
    (tmpvar_2 * 2.0)
  )) * 0.95)).xyz;
  ret_1 = (max (tmpvar_6, (texture (sampler_main, 
    (uv - (tmpvar_2 * 2.0))
  ) * 0.95)).xyz * 0.99);
  vec4 tmpvar_7;
  tmpvar_7.w = 1.0;
  tmpvar_7.xyz = ret_1;
  ret = tmpvar_7.xyz;
 }`,Mt=` shader_body { 
  vec2 uv2_1;
  uv2_1 = (uv + (vec2(1.0, 0.0) * texsize.zw));
  float tmpvar_2;
  tmpvar_2 = texture (sampler_main, uv2_1).x;
  uv2_1 = (uv + (vec2(-1.0, 0.0) * texsize.zw));
  float tmpvar_3;
  tmpvar_3 = texture (sampler_main, uv2_1).x;
  uv2_1 = (uv + (vec2(0.0, 1.0) * texsize.zw));
  float tmpvar_4;
  tmpvar_4 = texture (sampler_main, uv2_1).x;
  uv2_1 = (uv + (vec2(0.0, -1.0) * texsize.zw));
  vec3 tmpvar_5;
  tmpvar_5.z = 0.1;
  tmpvar_5.x = (tmpvar_2 - tmpvar_3);
  tmpvar_5.y = (tmpvar_4 - texture (sampler_main, uv2_1).x);
  vec3 tmpvar_6;
  tmpvar_6 = normalize(tmpvar_5);
  vec4 tmpvar_7;
  tmpvar_7.w = 1.0;
  tmpvar_7.xyz = ((vec3(1.95, 1.35, 0.9) * clamp (
    dot (tmpvar_6, vec3(0.9070111, -0.3930381, 0.1511685))
  , 0.0, 1.0)) + (vec3(0.5, 0.7, 0.55) * clamp (
    dot (tmpvar_6, vec3(-0.554487, 0.8317305, 0.02772435))
  , 0.0, 1.0)));
  ret = tmpvar_7.xyz;
 }`,Nt={baseVals:Dt,shapes:Ot,waves:kt,init_eqs_str:``,frame_eqs_str:At,pixel_eqs_str:``,pixel_eqs:``,warp:jt,comp:Mt},Pt={rating:5,gammaadj:1.98,decay:.5,echo_zoom:1,echo_alpha:.5,echo_orient:3,wave_mode:7,additivewave:1,wave_thick:1,modwavealphabyvolume:1,wave_brighten:0,wrap:0,darken:1,wave_a:.001,wave_scale:.958,wave_smoothing:.45,modwavealphastart:0,modwavealphaend:1.32,warpanimspeed:1.459,warpscale:2.007,zoom:.9999,warp:.01,sx:.9999,wave_r:0,wave_g:0,wave_b:0,ob_size:.05,ob_g:.1,ob_b:1,ob_a:1,ib_size:0,ib_r:0,ib_g:0,ib_b:0,mv_x:25.6,mv_y:9.6,mv_l:0,mv_r:.5,mv_g:.5,mv_b:.5,mv_a:0,b1ed:0},Ft=[{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],It=[{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],Lt=`a.look=0;a.n=0;a.reg26=0;a.uvx0=0;a.reg34=0;a.reg28=0;a.reg23=0;a.q25=0;a.angchg=0;a.reg20=0;a.reg15=0;a.reg10=0;a.q12=0;a.v3=0;a.q22=0;a.q21=0;a.diry=0;a.q13=0;a.q6=0;a.posx=0;a.fps_=0;a.reg25=0;a.uvx=0;a.q1=0;a.travel=0;a.posz=0;a.q5=0;a.dirz=0;a.dec_s=0;a.reg16=0;a.slow=0;a.reg36=0;a.reg22=0;a.uvy=0;a.rotz=0;a.ly=0;a.dist_=0;a.q23=0;a.q24=0;a.reg24=0;a.cran0=0;a.ran2=0;a.q11=0;a.q10=0;a.reg14=0;a.posy=0;a.reg31=0;a.dirx=0;a.q4=0;a.start=0;a.reg12=0;a.reg13=0;a.c2=0;a.reg37=
0;a.s3=0;a.yslope=0;a.lampy=0;a.q16=0;a.xslope=0;a.q26=0;a.reg38=0;a.reg35=0;a.reg11=0;a.tx=0;a.avg=0;a.uvz=0;a.c3=0;a.uvy0=0;a.reg27=0;a.q19=0;a.beat=0;a.reg32=0;a.lx=0;a.reg21=0;a.uvz0=0;a.len=0;a.reg18=0;a.reg30=0;a.q2=0;a.q27=0;a.slen=0;a.q14=0;a.dist=0;a.reg17=0;a.v1=0;a.speed=0;a.s1=0;a.t0=0;a.s2=0;a.ran1=0;a.reg33=0;a.q7=0;a.ds=0;a.q28=0;a.lampx=0;a.ty=0;a.c1=0;a.v2=0;a.q20=0;a.q8=0;a.avg=.01;a.q7=.25;a.q8=randint(2)-1;a.q16=1+randint(2);a.q18=randint(.8)+.1;a.q30=1;a.q31=128;a.start=1;a.travel=
0;a.rotz=0;a.look=0;a.slow=0;a.t0=a.time+3;a.lampx=.5;a.lampy=.5;a.cran0=randint(1);for(var b=a.n=0;1E4>b;b++)a.gmegabuf[Math.floor(a.n)]=0,a.n+=1;for(b=a.n=0;1E4>b;b++)a.megabuf[Math.floor(a.n)]=0,a.n+=1;a.trelx=0;a.trely=0;a.trelz=0;a.reg20=1;a.reg21=0;a.reg22=0;a.reg23=0;a.reg24=1;a.reg25=0;a.reg26=0;a.reg27=0;a.reg28=1;b=0;do{b+=1;var c;a.ran1=div(randint(800),100);a.ran2=div(randint(800),100);a.ran3=div(randint(800),100);a.posx=randint(5)-2;a.posy=randint(5)-2;a.posz=randint(5)-2;a.c1=Math.cos(a.ran1);
a.c2=Math.cos(a.ran2);a.c3=Math.cos(a.ran3);a.s1=Math.sin(a.ran1);a.s2=Math.sin(a.ran2);a.s3=Math.sin(a.ran3);a.reg20=a.c2*a.c1;a.reg21=a.c2*a.s1;a.reg22=-a.s2;a.reg23=a.s3*a.s2*a.c1-a.c3*a.s1;a.reg24=a.s3*a.s2*a.s1+a.c3*a.c1;a.reg25=a.s3*a.c2;a.reg26=a.c3*a.s2*a.c1+a.s3*a.s1;a.reg27=a.c3*a.s2*a.s1-a.s3*a.c1;a.reg28=a.c3*a.c2;a.dist=.001;var d=0;do{d+=1;a.uvx=div(a.reg26*a.dist,a.q7);a.uvy=div(a.reg27*a.dist,a.q7);a.uvz=div(a.reg28*a.dist,a.q7);a.uvx+=a.posx;a.uvy+=a.posy;a.uvz+=a.posz;a.uvx=8*(div(a.uvx,
8)+30.5-Math.floor(div(a.uvx,8)+30.5)-.5);a.uvy=8*(div(a.uvy,8)+30.5-Math.floor(div(a.uvy,8)+30.5)-.5);a.uvz=8*(div(a.uvz,8)+30.5-Math.floor(div(a.uvz,8)+30.5)-.5);a.uvx0=a.uvx+a.q8;a.uvy0=a.uvy+a.q8;a.uvz0=a.uvz+a.q8;for(c=0;8>c;c++)a.uvx=.00001<Math.abs(1<a.uvx?1:0)?2-a.uvx:.00001<Math.abs(-1>a.uvx?1:0)?-2-a.uvx:a.uvx,a.uvy=.00001<Math.abs(1<a.uvy?1:0)?2-a.uvy:.00001<Math.abs(-1>a.uvy?1:0)?-2-a.uvy:a.uvy,a.uvz=.00001<Math.abs(1<a.uvz?1:0)?2-a.uvz:.00001<Math.abs(-1>a.uvz?1:0)?-2-a.uvz:a.uvz,a.slen=
a.uvx*a.uvx+a.uvy*a.uvy+a.uvz*a.uvz,a.uvx=2.6*(.00001<Math.abs(.25>a.slen?1:0)?4*a.uvx:.00001<Math.abs(1>a.slen?1:0)?div(a.uvx,a.slen):a.uvx)+a.uvx0,a.uvy=2.6*(.00001<Math.abs(.25>a.slen?1:0)?4*a.uvy:.00001<Math.abs(1>a.slen?1:0)?div(a.uvy,a.slen):a.uvy)+a.uvy0,a.uvz=2.6*(.00001<Math.abs(.25>a.slen?1:0)?4*a.uvz:.00001<Math.abs(1>a.slen?1:0)?div(a.uvz,a.slen):a.uvz)+a.uvz0;a.len=sqrt(a.uvx*a.uvx+a.uvy*a.uvy+a.uvz*a.uvz);a.dist*=1.05;c=(.6>a.dist?1:0)*(30<a.len?1:0)}while(.00001<Math.abs(c)&&1048576>
d);d=.06>a.dist?1:0}while(.00001<Math.abs(d)&&1048576>b);`,Rt=`a.fps_=0*a.fps_+1*(.00001<Math.abs(25>=a.fps?1:0)?a.fps:25+.5*(a.fps-25));a.dec_s=1-div(.06*30,a.fps_);a.beat=a.time>a.t0+3?1:0;a.t0=.00001<Math.abs(a.beat)?a.time:a.t0;a.speed=div(Math.min(.2,a.dist_-.02)*(1+2*a.avg)*(1-0*a.slow)*.7,a.q7);a.ds=a.ds*a.dec_s+div((1-a.dec_s)*a.speed*.25,a.fps_);a.rotz=.00001<Math.abs(.00001>Math.abs(a.rotz-0)?1:0)?a.beat*(randint(100)<20*a.travel?1:0)*(div(randint(10),10)-.3):bnot(a.beat*(30>randint(100)?1:0))*a.rotz;a.slow=.00001<Math.abs(bnot(a.slow))?
a.beat*(6>randint(1E3*a.avg)?1:0):bnot(a.beat*(50>randint(100)?1:0));a.look=.00001<Math.abs(bnot(a.look))?a.beat*(12>randint(1E3*a.speed)?1:0):bnot(a.beat*(50>randint(100)?1:0));a.lx=.00001<Math.abs(a.beat)?div(randint(150),200)+.15:a.lx;a.ly=.00001<Math.abs(a.beat)?div(randint(150),200)+.15:a.ly;a.lampx=a.lampx*a.dec_s+(1-a.dec_s)*(.00001<Math.abs(a.look)?a.lx:.5);a.lampy=a.lampy*a.dec_s+(1-a.dec_s)*(.00001<Math.abs(a.look)?a.ly:.5);a.q1=a.lampx;a.q2=a.lampy;a.dirx=a.reg26;a.diry=a.reg27;a.dirz=
a.reg28;a.posx+=a.ds*a.dirx;a.posy+=a.ds*a.diry;a.posz+=a.ds*a.dirz;a.q4=a.posx;a.q5=a.posy;a.q6=a.posz;a.angchg=(.2-a.dist_)*(.2>a.dist_?1:0)*2;a.travel=.00001<Math.abs(0<a.angchg?1:0)?0:a.travel+a.ds;a.v1=a.v1*a.dec_s+(1-a.dec_s)*a.rotz*a.ds;a.v2=a.v2*a.dec_s+div((1-a.dec_s)*a.angchg*a.xslope,a.fps_);a.v3=a.v3*a.dec_s+(1-a.dec_s)*(div(a.angchg*a.yslope,a.fps_)+2*a.v1*Math.sin(.1*a.time));a.reg30=a.reg20;a.reg31=a.reg21;a.reg32=a.reg22;a.reg33=a.reg23;a.reg34=a.reg24;a.reg35=a.reg25;a.reg36=a.reg26;
a.reg37=a.reg27;a.reg38=a.reg28;a.n=0;for(var b=a.avg=0;5>b;b++){a.n+=1;a.ran1=div(randint(100),100);a.ran2=div(randint(100),200)-.25;a.tx=Math.cos(1.57*a.n+a.ran2)*(4>=a.n?1:0)*a.ran1;a.ty=Math.sin(1.57*a.n+a.ran2)*(4>=a.n?1:0)*a.ran1;a.c1=Math.cos(a.v1);a.c2=Math.cos(a.v2+a.ty);a.c3=Math.cos(a.v3+a.tx);a.s1=Math.sin(a.v1);a.s2=Math.sin(a.v2+a.ty);a.s3=Math.sin(a.v3+a.tx);a.reg10=a.c2*a.c1;a.reg11=a.c2*a.s1;a.reg12=-a.s2;a.reg13=a.s3*a.s2*a.c1-a.c3*a.s1;a.reg14=a.s3*a.s2*a.s1+a.c3*a.c1;a.reg15=a.s3*
a.c2;a.reg16=a.c3*a.s2*a.c1+a.s3*a.s1;a.reg17=a.c3*a.s2*a.s1-a.s3*a.c1;a.reg18=a.c3*a.c2;a.reg20=a.reg30;a.reg21=a.reg31;a.reg22=a.reg32;a.reg23=a.reg33;a.reg24=a.reg34;a.reg25=a.reg35;a.reg26=a.reg36;a.reg27=a.reg37;a.reg28=a.reg38;a.q20=a.reg10*a.reg20+a.reg11*a.reg23+a.reg12*a.reg26;a.q21=a.reg10*a.reg21+a.reg11*a.reg24+a.reg12*a.reg27;a.q22=a.reg10*a.reg22+a.reg11*a.reg25+a.reg12*a.reg28;a.q23=a.reg13*a.reg20+a.reg14*a.reg23+a.reg15*a.reg26;a.q24=a.reg13*a.reg21+a.reg14*a.reg24+a.reg15*a.reg27;
a.q25=a.reg13*a.reg22+a.reg14*a.reg25+a.reg15*a.reg28;a.q26=a.reg16*a.reg20+a.reg17*a.reg23+a.reg18*a.reg26;a.q27=a.reg16*a.reg21+a.reg17*a.reg24+a.reg18*a.reg27;a.q28=a.reg16*a.reg22+a.reg17*a.reg25+a.reg18*a.reg28;a.reg20=a.q20;a.reg21=a.q21;a.reg22=a.q22;a.reg23=a.q23;a.reg24=a.q24;a.reg25=a.q25;a.reg26=a.q26;a.reg27=a.q27;a.reg28=a.q28;a.dist=.002;var c,d=0;do{d+=1;a.uvx=div(a.reg26*a.dist,a.q7);a.uvy=div(a.reg27*a.dist,a.q7);a.uvz=div(a.reg28*a.dist,a.q7);a.uvx+=a.posx;a.uvy+=a.posy;a.uvz+=a.posz;
a.uvx=8*(div(a.uvx,8)+30.5-Math.floor(div(a.uvx,8)+30.5)-.5);a.uvy=8*(div(a.uvy,8)+30.5-Math.floor(div(a.uvy,8)+30.5)-.5);a.uvz=8*(div(a.uvz,8)+30.5-Math.floor(div(a.uvz,8)+30.5)-.5);a.uvx0=a.uvx+a.q8;a.uvy0=a.uvy+a.q8;a.uvz0=a.uvz+a.q8;for(c=0;8>c;c++)a.uvx=.00001<Math.abs(1<a.uvx?1:0)?2-a.uvx:.00001<Math.abs(-1>a.uvx?1:0)?-2-a.uvx:a.uvx,a.uvy=.00001<Math.abs(1<a.uvy?1:0)?2-a.uvy:.00001<Math.abs(-1>a.uvy?1:0)?-2-a.uvy:a.uvy,a.uvz=.00001<Math.abs(1<a.uvz?1:0)?2-a.uvz:.00001<Math.abs(-1>a.uvz?1:0)?
-2-a.uvz:a.uvz,a.slen=a.uvx*a.uvx+a.uvy*a.uvy+a.uvz*a.uvz,a.uvx=2.6*(.00001<Math.abs(.25>a.slen?1:0)?4*a.uvx:.00001<Math.abs(1>a.slen?1:0)?div(a.uvx,a.slen):a.uvx)+a.uvx0,a.uvy=2.6*(.00001<Math.abs(.25>a.slen?1:0)?4*a.uvy:.00001<Math.abs(1>a.slen?1:0)?div(a.uvy,a.slen):a.uvy)+a.uvy0,a.uvz=2.6*(.00001<Math.abs(.25>a.slen?1:0)?4*a.uvz:.00001<Math.abs(1>a.slen?1:0)?div(a.uvz,a.slen):a.uvz)+a.uvz0;a.len=sqrt(a.uvx*a.uvx+a.uvy*a.uvy+a.uvz*a.uvz);a.dist*=1.1;c=(.6>a.dist?1:0)*(30<a.len?1:0)}while(.00001<
Math.abs(c)&&1048576>d);a.megabuf[Math.floor(a.n)]=a.megabuf[Math.floor(a.n)]*a.dec_s+(1-a.dec_s)*a.dist;a.avg+=Math.abs(div(a.megabuf[Math.floor(a.n)],5))}a.n=0;for(b=a.avg=0;5>b;b++)a.n+=1,a.avg+=Math.abs(div(a.megabuf[Math.floor(a.n)],5));a.xslope=Math.min(Math.max(div(2,a.avg)*(a.megabuf[1]-a.megabuf[3]),-3),3);a.yslope=Math.min(Math.max(div(2,a.avg)*(a.megabuf[4]-a.megabuf[2]),-3),3);a.monitor=a.avg;a.dist_=a.dist_*a.dec_s+(1-a.dec_s)*a.dist;a.q10=a.ds*a.q7;a.q14=Math.abs(a.ds)+2*(Math.abs(a.v1)+
Math.abs(a.v2)+Math.abs(a.v3))+div(1,255)+.05*a.start;a.q19=.6+.4*Math.sin(.02*a.time+6*a.cran0);a.start*=.9;a.q11=a.v1;a.q12=a.v2;a.q13=a.v3;a.monitor=a.q16;`,zt=`a.warp=0;a.zoom=1;a.dx=div(-a.q12,a.q16)*(1+0*pow(a.x-.5,2));a.dy=div(a.q13,a.q16)*(1+0*pow(a.y-.5,2));a.rot=a.q11;`,Bt=`float sustain;
float xlat_mutabledist;
float xlat_mutablestruc;
vec2 xlat_mutableuv1;
vec3 xlat_mutableuv2;
 shader_body { 
  mat3 tmpvar_1;
  tmpvar_1[uint(0)].x = q20;
  tmpvar_1[uint(0)].y = q23;
  tmpvar_1[uint(0)].z = q26;
  tmpvar_1[1u].x = q21;
  tmpvar_1[1u].y = q24;
  tmpvar_1[1u].z = q27;
  tmpvar_1[2u].x = q22;
  tmpvar_1[2u].y = q25;
  tmpvar_1[2u].z = q28;
  vec3 tmpvar_2;
  tmpvar_2.x = q4;
  tmpvar_2.y = q5;
  tmpvar_2.z = q6;
  sustain = (0.98 - q14);
  vec2 uv_3;
  vec3 ret_4;
  vec2 tmpvar_5;
  tmpvar_5 = (uv - 0.5);
  xlat_mutableuv1 = ((tmpvar_5 * aspect.xy) * q16);
  vec4 tmpvar_6;
  tmpvar_6 = texture (sampler_pc_main, uv);
  uv_3 = ((tmpvar_5 * (1.0 - 
    (q10 / (1.0 - ((tmpvar_6.z + 
      (0.003921569 * tmpvar_6.y)
    ) + (q10 * 0.7))))
  )) + 0.5);
  vec4 tmpvar_7;
  tmpvar_7 = fract((8.0 * texture (sampler_noise_lq, (uv_3 + rand_frame.yz))));
  xlat_mutabledist = tmpvar_7.x;
  if ((tmpvar_7.y > 0.2)) {
    vec3 tmpvar_8;
    tmpvar_8 = (tmpvar_7.xyz - vec3(0.4, 0.5, 0.5));
    vec2 uvi_9;
    uvi_9 = ((tmpvar_8.zy * 0.003) + uv_3);
    vec2 pix_10;
    vec4 nb2_11;
    vec4 nb_12;
    vec2 x_13;
    x_13 = (uvi_9 - 0.5);
    pix_10 = (texsize.zw * (1.0 + (
      sqrt(dot (x_13, x_13))
     * 8.0)));
    float tmpvar_14;
    tmpvar_14 = (q10 * 0.7);
    vec4 tmpvar_15;
    tmpvar_15 = texture (sampler_pc_main, (uvi_9 - pix_10));
    nb_12.x = (1.0 - ((tmpvar_15.z + 
      (0.003921569 * tmpvar_15.y)
    ) + tmpvar_14));
    vec4 tmpvar_16;
    tmpvar_16 = texture (sampler_pc_main, (uvi_9 + (pix_10 * vec2(1.0, -1.0))));
    nb_12.y = (1.0 - ((tmpvar_16.z + 
      (0.003921569 * tmpvar_16.y)
    ) + tmpvar_14));
    vec4 tmpvar_17;
    tmpvar_17 = texture (sampler_pc_main, (uvi_9 + pix_10));
    nb_12.z = (1.0 - ((tmpvar_17.z + 
      (0.003921569 * tmpvar_17.y)
    ) + tmpvar_14));
    vec4 tmpvar_18;
    tmpvar_18 = texture (sampler_pc_main, (uvi_9 + (pix_10 * vec2(-1.0, 1.0))));
    nb_12.w = (1.0 - ((tmpvar_18.z + 
      (0.003921569 * tmpvar_18.y)
    ) + tmpvar_14));
    vec4 tmpvar_19;
    tmpvar_19 = texture (sampler_pc_main, (uvi_9 + (pix_10 * vec2(0.0, -1.0))));
    nb2_11.x = (1.0 - ((tmpvar_19.z + 
      (0.003921569 * tmpvar_19.y)
    ) + tmpvar_14));
    vec4 tmpvar_20;
    tmpvar_20 = texture (sampler_pc_main, (uvi_9 + (pix_10 * vec2(1.0, 0.0))));
    nb2_11.y = (1.0 - ((tmpvar_20.z + 
      (0.003921569 * tmpvar_20.y)
    ) + tmpvar_14));
    vec4 tmpvar_21;
    tmpvar_21 = texture (sampler_pc_main, (uvi_9 + (pix_10 * vec2(0.0, 1.0))));
    nb2_11.z = (1.0 - ((tmpvar_21.z + 
      (0.003921569 * tmpvar_21.y)
    ) + tmpvar_14));
    vec4 tmpvar_22;
    tmpvar_22 = texture (sampler_pc_main, (uvi_9 + (pix_10 * vec2(-1.0, 0.0))));
    nb2_11.w = (1.0 - ((tmpvar_22.z + 
      (0.003921569 * tmpvar_22.y)
    ) + tmpvar_14));
    vec4 tmpvar_23;
    tmpvar_23 = min (nb_12, nb2_11);
    nb_12.zw = tmpvar_23.zw;
    nb_12.xy = min (tmpvar_23.xy, tmpvar_23.zw);
    xlat_mutabledist = (min (nb_12.x, nb_12.y) + ((0.008 * tmpvar_8.x) * abs(tmpvar_8.y)));
  };
  vec4 tmpvar_24;
  tmpvar_24 = texture (sampler_pc_main, uv_3);
  float tmpvar_25;
  tmpvar_25 = min (xlat_mutabledist, (1.0 - (
    (tmpvar_24.z + (0.003921569 * tmpvar_24.y))
   + 
    (q10 * 0.7)
  )));
  xlat_mutabledist = tmpvar_25;
  float tmpvar_26;
  tmpvar_26 = (tmpvar_25 + pow (tmpvar_25, 3.0));
  vec3 tmpvar_27;
  tmpvar_27.xy = (xlat_mutableuv1 * tmpvar_26);
  tmpvar_27.z = tmpvar_26;
  xlat_mutableuv2 = (((tmpvar_27 / q7) * tmpvar_1) + tmpvar_2);
  xlat_mutableuv2 = ((fract(
    ((xlat_mutableuv2 / 8.0) + 0.5)
  ) - 0.5) * 8.0);
  float li_28;
  vec3 zz0_29;
  vec3 zz_30;
  zz0_29 = (xlat_mutableuv2 + q8);
  li_28 = 0.0;
  zz_30 = ((2.0 * clamp (xlat_mutableuv2, vec3(-1.0, -1.0, -1.0), vec3(1.0, 1.0, 1.0))) - xlat_mutableuv2);
  float tmpvar_31;
  tmpvar_31 = dot (zz_30, zz_30);
  if ((tmpvar_31 <= 0.25)) {
    zz_30 = (zz_30 * 4.0);
    li_28 = 24.0;
  } else {
    if ((tmpvar_31 <= 1.0)) {
      zz_30 = (zz_30 / tmpvar_31);
    };
  };
  zz_30 = ((2.6 * zz_30) + zz0_29);
  zz_30 = ((2.0 * clamp (zz_30, vec3(-1.0, -1.0, -1.0), vec3(1.0, 1.0, 1.0))) - zz_30);
  float tmpvar_32;
  tmpvar_32 = dot (zz_30, zz_30);
  if ((tmpvar_32 <= 0.25)) {
    zz_30 = (zz_30 * 4.0);
    li_28 = 24.0;
  } else {
    if ((tmpvar_32 <= 1.0)) {
      zz_30 = (zz_30 / tmpvar_32);
    };
  };
  zz_30 = ((2.6 * zz_30) + zz0_29);
  zz_30 = ((2.0 * clamp (zz_30, vec3(-1.0, -1.0, -1.0), vec3(1.0, 1.0, 1.0))) - zz_30);
  float tmpvar_33;
  tmpvar_33 = dot (zz_30, zz_30);
  if ((tmpvar_33 <= 0.25)) {
    zz_30 = (zz_30 * 4.0);
    li_28 = 24.0;
  } else {
    if ((tmpvar_33 <= 1.0)) {
      zz_30 = (zz_30 / tmpvar_33);
    };
  };
  zz_30 = ((2.6 * zz_30) + zz0_29);
  zz_30 = ((2.0 * clamp (zz_30, vec3(-1.0, -1.0, -1.0), vec3(1.0, 1.0, 1.0))) - zz_30);
  float tmpvar_34;
  tmpvar_34 = dot (zz_30, zz_30);
  if ((tmpvar_34 <= 0.25)) {
    zz_30 = (zz_30 * 4.0);
    li_28 = 24.0;
  } else {
    if ((tmpvar_34 <= 1.0)) {
      zz_30 = (zz_30 / tmpvar_34);
    };
  };
  zz_30 = ((2.6 * zz_30) + zz0_29);
  zz_30 = ((2.0 * clamp (zz_30, vec3(-1.0, -1.0, -1.0), vec3(1.0, 1.0, 1.0))) - zz_30);
  float tmpvar_35;
  tmpvar_35 = dot (zz_30, zz_30);
  if ((tmpvar_35 <= 0.25)) {
    zz_30 = (zz_30 * 4.0);
    li_28 = 24.0;
  } else {
    if ((tmpvar_35 <= 1.0)) {
      zz_30 = (zz_30 / tmpvar_35);
    };
  };
  zz_30 = ((2.6 * zz_30) + zz0_29);
  zz_30 = ((2.0 * clamp (zz_30, vec3(-1.0, -1.0, -1.0), vec3(1.0, 1.0, 1.0))) - zz_30);
  float tmpvar_36;
  tmpvar_36 = dot (zz_30, zz_30);
  if ((tmpvar_36 <= 0.25)) {
    zz_30 = (zz_30 * 4.0);
    li_28 = 24.0;
  } else {
    if ((tmpvar_36 <= 1.0)) {
      zz_30 = (zz_30 / tmpvar_36);
    };
  };
  zz_30 = ((2.6 * zz_30) + zz0_29);
  zz_30 = ((2.0 * clamp (zz_30, vec3(-1.0, -1.0, -1.0), vec3(1.0, 1.0, 1.0))) - zz_30);
  float tmpvar_37;
  tmpvar_37 = dot (zz_30, zz_30);
  if ((tmpvar_37 <= 0.25)) {
    zz_30 = (zz_30 * 4.0);
    li_28 = 24.0;
  } else {
    if ((tmpvar_37 <= 1.0)) {
      zz_30 = (zz_30 / tmpvar_37);
    };
  };
  zz_30 = ((2.6 * zz_30) + zz0_29);
  zz_30 = ((2.0 * clamp (zz_30, vec3(-1.0, -1.0, -1.0), vec3(1.0, 1.0, 1.0))) - zz_30);
  float tmpvar_38;
  tmpvar_38 = dot (zz_30, zz_30);
  if ((tmpvar_38 <= 0.25)) {
    zz_30 = (zz_30 * 4.0);
    li_28 = 24.0;
  } else {
    if ((tmpvar_38 <= 1.0)) {
      zz_30 = (zz_30 / tmpvar_38);
    };
  };
  zz_30 = ((2.6 * zz_30) + zz0_29);
  vec4 tmpvar_39;
  tmpvar_39.xyz = zz_30;
  tmpvar_39.w = li_28;
  float tmpvar_40;
  tmpvar_40 = sqrt(dot (zz_30, zz_30));
  xlat_mutablestruc = (sqrt(dot (tmpvar_39.xyw, tmpvar_39.xyw)) / 24.0);
  vec4 tmpvar_41;
  tmpvar_41 = texture (sampler_pc_main, uv_3);
  float tmpvar_42;
  float tmpvar_43;
  tmpvar_43 = (q10 * 0.7);
  tmpvar_42 = ((log(
    (1.0 + (tmpvar_40 / 24.0))
  ) * 0.02) * (1.0 - (1.0 - 
    ((tmpvar_41.z + (0.003921569 * tmpvar_41.y)) + tmpvar_43)
  )));
  float tmpvar_44;
  vec4 tmpvar_45;
  tmpvar_45 = texture (sampler_pc_main, uv_3);
  tmpvar_44 = (1.0 - ((tmpvar_45.z + 
    (0.003921569 * tmpvar_45.y)
  ) + tmpvar_43));
  if ((((tmpvar_25 <= tmpvar_44) && (tmpvar_40 < 24.0)) && (tmpvar_25 > 0.005))) {
    ret_4.x = (((1.0 - sustain) * xlat_mutablestruc) + (sustain * mix (texture (sampler_main, uv_3).xyz, 
      ((texture (sampler_blur1, uv_3).xyz * scale1) + bias1)
    , vec3(
      (q14 * 4.0)
    )).x));
    float x_46;
    x_46 = ((1.0 - tmpvar_25) * 255.0);
    float ip_47;
    ip_47 = float(int(x_46));
    vec2 tmpvar_48;
    tmpvar_48.x = (x_46 - ip_47);
    tmpvar_48.y = (ip_47 / 255.0);
    ret_4.yz = tmpvar_48;
  } else {
    vec3 tmpvar_49;
    tmpvar_49.y = 0.0;
    tmpvar_49.x = sustain;
    tmpvar_49.z = (1.0 - tmpvar_42);
    vec3 tmpvar_50;
    tmpvar_50.xy = vec2(0.003921569, 0.0);
    tmpvar_50.z = (q14 / 6.0);
    ret_4 = ((texture (sampler_fc_main, uv_3).xyz * tmpvar_49) - tmpvar_50);
  };
  vec4 tmpvar_51;
  tmpvar_51.w = 1.0;
  tmpvar_51.xyz = ret_4;
  ret = tmpvar_51.xyz;
 }`,Vt=` shader_body { 
  vec3 tmpvar_1;
  tmpvar_1.x = q4;
  tmpvar_1.y = q5;
  tmpvar_1.z = q6;
  mat3 tmpvar_2;
  tmpvar_2[uint(0)].x = q20;
  tmpvar_2[uint(0)].y = q23;
  tmpvar_2[uint(0)].z = q26;
  tmpvar_2[1u].x = q21;
  tmpvar_2[1u].y = q24;
  tmpvar_2[1u].z = q27;
  tmpvar_2[2u].x = q22;
  tmpvar_2[2u].y = q25;
  tmpvar_2[2u].z = q28;
  vec2 tmpvar_3;
  tmpvar_3.x = q1;
  tmpvar_3.y = q2;
  vec2 uv_4;
  vec3 ret_5;
  uv_4 = (((uv - 0.5) * 0.9) + 0.5);
  vec3 tmpvar_6;
  tmpvar_6.xy = ((uv_4 - 0.5) * min ((1.0 - texture (sampler_main, uv_4).z), (1.0 - 
    ((texture (sampler_blur2, uv_4).xyz * scale2) + bias2)
  .z)));
  tmpvar_6.z = min ((1.0 - texture (sampler_main, uv_4).z), (1.0 - (
    (texture (sampler_blur2, uv_4).xyz * scale2)
   + bias2).z));
  float tmpvar_7;
  tmpvar_7 = clamp ((abs(
    ((1.0 - ((texture (sampler_blur2, uv_4).xyz * scale2) + bias2).z) - clamp ((1.0 - (
      (texture (sampler_blur2, tmpvar_3).xyz * scale2)
     + bias2).z), 0.1, 0.4))
  ) + 0.2), 0.0, 1.0);
  float tmpvar_8;
  tmpvar_8 = clamp (((1.0 - 
    exp(-(((texture (sampler_blur1, uv_4).xyz * scale1) + bias1).x))
  ) - 0.2), 0.0, 1.0);
  ret_5 = ((mix (texture (sampler_main, uv_4).xyz, 
    ((texture (sampler_blur1, uv_4).xyz * scale1) + bias1)
  , vec3(tmpvar_7)).x * (0.2 + 
    ((1.0 - tmpvar_7) * (1.0 - min ((1.0 - texture (sampler_main, uv_4).z), (1.0 - 
      ((texture (sampler_blur2, uv_4).xyz * scale2) + bias2)
    .z))))
  )) * (1.0 + (0.5 * 
    sin((((tmpvar_6 / q7) * tmpvar_2) + tmpvar_1))
  )));
  vec3 tmpvar_9;
  tmpvar_9.xy = vec2(0.0, 1.0);
  tmpvar_9.z = (tmpvar_8 * 3.0);
  ret_5 = (mix (ret_5, tmpvar_9, vec3(tmpvar_8)) + ((
    pow ((1.0 - mix (texture (sampler_main, uv_4).xyz, (
      (texture (sampler_blur1, uv_4).xyz * scale1)
     + bias1), vec3(0.8, 0.8, 0.8)).z), 3.0)
   * 
    (0.5 + (0.5 * slow_roam_cos))
  ) * q19).xyz);
  ret_5 = (1.0 - exp((-2.0 * ret_5)));
  ret_5 = (((
    ((ret_5.x * 0.3) + (ret_5.y * 0.5))
   + 
    (ret_5.z * 0.2)
  ) * 3.0) - vec3(0.0, 1.0, 2.0));
  vec4 tmpvar_10;
  tmpvar_10.w = 1.0;
  tmpvar_10.xyz = ret_5;
  ret = tmpvar_10.xyz;
 }`,Ht={baseVals:Pt,shapes:Ft,waves:It,init_eqs_str:Lt,frame_eqs_str:Rt,pixel_eqs_str:zt,warp:Bt,comp:Vt},Ut={rating:2,gammaadj:1.98,decay:.5,echo_zoom:1,echo_alpha:.5,echo_orient:3,wave_mode:6,additivewave:1,wave_thick:1,modwavealphabyvolume:1,wave_brighten:0,darken:1,wave_a:.312,wave_scale:1.229,wave_smoothing:0,wave_mystery:.2,modwavealphastart:.71,modwavealphaend:1.3,warpanimspeed:1.459,warpscale:2.007,zoom:.9999,warp:.01,sx:.9999,wave_r:0,wave_g:0,wave_b:0,ob_r:1,ob_g:1,ob_b:1,ib_size:.26,mv_x:12.8,mv_y:9.6,mv_l:.05,mv_b:.5,mv_a:0,b1ed:0},Wt=[{baseVals:{enabled:1,sides:16,additive:1,num_inst:69,rad:.01,tex_zoom:4.57482,r:0,b:1,g2:0,border_r:.8,border_g:0,border_a:0},init_eqs_str:`a.k1=0;a.oz=0;a.k1=0;a.oz=0;a.oz=0;a.oz=0;a.ox=0;a.k1=0;a.oy=0;a.k1=0;a.fov=0;a.oz=0;a.oz=0;a.oz=0;a.k2=0;a.fov=0;a.ox=0;a.oz=0;a.k2=0;a.fov=0;a.oy=0;a.oz=0;a.k2=0;a.oz=0;a.oz=0;a.oz=0;a.oz=0;`,frame_eqs_str:`a.k1=6.28*div(a.instance,a.num_inst);a.oz=a.k1+.04*a.time;a.oz=1+Math.floor(a.oz)-a.oz;a.ox=Math.sin(72*a.k1);a.oy=Math.cos(31*a.k1);a.fov=.02;a.oz*=a.oz;a.k2=0;a.x=div(a.fov*a.ox,a.oz+a.k2)+.5;a.y=div(2*a.fov*a.oy,a.oz+a.k2)+.5;a.rad=div(.04,a.oz);a.a=.5*above(a.oz,0)*Math.max(0,(1-pow(a.oz,2))*sqrt(a.oz));`},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],Gt=[{baseVals:{enabled:1,samples:193,usedots:1,additive:1,scaling:.89152,smoothing:.82,a:.6},init_eqs_str:`a.instance=0;a.t2=0;a.ang1=0;a.rad1=0;a.t1=0;a.t1=div(randint(100),300)+.5;a.t2=div(randint(100),100)+1;`,frame_eqs_str:``,point_eqs_str:`a.r=1;a.b=10;a.g=0;a.instance=a.sample*a.t2*21;a.ang1=16*Math.sin(26*a.t2*a.instance);a.rad1=a.sample;a.x=a.t1+.15*a.rad1*Math.cos(a.ang1);a.y=.5+.03*a.rad1*Math.sin(a.ang1);a.a=div(.3,a.rad1);`},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],Kt=`a.index2=0;a.index=0;a.dir2=0;a.q1=0;a.dec_med=0;a.dec_f=0;a.rott=0;a.is_beat=0;a.dec_slow=0;a.dir__=0;a.dir=0;a.dir_=0;a.p2=0;a.avg=0;a.trig=0;a.beat=0;a.p1=0;a.peak=0;a.q2=0;a.q3=0;a.t0=0;a.q30=0;a.q10=randint(1E3)+100;a.q11=.2+div(.5*randint(100),100);a.q12=12+randint(20);a.q13=div(4*randint(100),100);a.q14=div(randint(100),400)*a.q10;a.q15=div(randint(70),100)+.3;a.monitor=a.q15;a.q17=div(randint(100),200)+.5;a.q18=div(randint(100),200)+.5;a.q19=div(randint(100),200)+.5;
a.q20=above(a.q19+a.q18,2*a.q17);a.q21=div(randint(100),100)-.5;a.q22=div(randint(100),300);a.q23=div(randint(100),100)-.5;a.q24=div(randint(100),300);a.q25=div(randint(10),30);a.q26=div(randint(200),100)+1;a.q31=above(randint(100),30);`,qt=`a.dec_f=pow(.9,div(30,a.fps));a.dec_med=pow(.9,div(30,a.fps));a.dec_slow=pow(.97,div(30,a.fps));a.beat=a.bass+a.mid+a.treb;a.avg=a.avg*a.dec_slow+a.beat*(1-a.dec_slow);a.is_beat=above(a.beat,1*a.avg+a.peak)*above(a.time,a.t0+1);a.t0=a.is_beat*a.time+(1-a.is_beat)*a.t0;a.peak=a.is_beat*a.beat+(1-a.is_beat)*a.peak*a.dec_med;a.index=mod(a.index+a.is_beat,16);a.index2=mod(a.index2+a.is_beat*bnot(a.index),4);a.trig=a.is_beat*equal(mod(a.index,2),0);a.p1=a.trig*(a.p1+1)+(1-a.trig)*
a.p1;a.p2=a.dec_slow*a.p2+(1-a.dec_slow)*a.p1;a.rott=div(3.1416*a.p2,4);a.q1=Math.cos(a.rott);a.q2=Math.sin(a.rott);a.dec_slow=0;a.dir2=2*(div(randint(100),100)-.5);a.dir=.00001<Math.abs(a.trig*above(Math.abs(a.dir-a.dir2),.5))?a.dir2:a.dir;a.dir_=a.dir_*a.dec_slow+(1-a.dec_slow)*a.dir;a.dir__=a.dir__*a.dec_slow+(1-a.dec_slow)*a.dir_;a.q3=a.dir__;a.q30=.2*Math.sin(div(a.time,3));`,Jt=`a.warp=0;a.rot=0;a.zoom=1;a.dy=0;`,Yt=`vec2 xlat_mutableuv1;
vec2 xlat_mutableuv5;
 shader_body { 
  vec3 ret_1;
  xlat_mutableuv1 = (uv - 0.5);
  xlat_mutableuv5 = (xlat_mutableuv1 / 8.0);
  xlat_mutableuv5.x = (xlat_mutableuv5.x + ((0.003 * 
    sin((time + (xlat_mutableuv1.x * 6.28)))
  ) * abs(xlat_mutableuv1.y)));
  vec2 tmpvar_2;
  tmpvar_2.x = (xlat_mutableuv5.x / 4.0);
  tmpvar_2.y = 0.0;
  float tmpvar_3;
  tmpvar_3 = (texture (sampler_noise_lq, (tmpvar_2 * 8.0)).x - 0.5);
  vec2 tmpvar_4;
  tmpvar_4.x = (xlat_mutableuv5.x * 8.0);
  tmpvar_4.y = ((xlat_mutableuv5.y * 128.0) + (tmpvar_3 / 2.0));
  float tmpvar_5;
  tmpvar_5 = (texture (sampler_noise_lq, tmpvar_4).x - 0.5);
  vec2 tmpvar_6;
  tmpvar_6.x = (xlat_mutableuv5.x * 8.0);
  tmpvar_6.y = ((xlat_mutableuv5.y * 8.0) + (tmpvar_5 * 0.01));
  ret_1.y = clamp ((1.0 - (
    (((abs(
      (xlat_mutableuv5.y * 32.0)
    ) / 0.61) * (1.0 + tmpvar_3)) * (1.0 + tmpvar_5))
   * 
    (1.0 - (texture (sampler_noise_lq, (tmpvar_6 * 10.0)).x / 2.0))
  )), 0.0, 1.0);
  ret_1.x = (((
    (texture (sampler_blur1, uv).xyz * scale1)
   + bias1).x * 0.7) - 0.005);
  vec4 tmpvar_7;
  tmpvar_7.w = 1.0;
  tmpvar_7.xyz = ret_1;
  ret = tmpvar_7.xyz;
 }`,Xt=`float xlat_mutabledist;
float xlat_mutablefmask;
float xlat_mutablefog;
float xlat_mutableforest;
float xlat_mutablehill1;
vec2 xlat_mutablers;
vec2 xlat_mutablers0;
float xlat_mutablesmask;
float xlat_mutablesun;
vec2 xlat_mutableuv1;
vec2 xlat_mutableuv2;
vec2 xlat_mutableuv_stars;
vec2 xlat_mutableuv_wat;
vec3 xlat_mutablewater;
float xlat_mutablez;
 shader_body { 
  vec3 ret_1;
  vec2 tmpvar_2;
  tmpvar_2.y = 0.5;
  tmpvar_2.x = (0.5 + (0.5 * q3));
  xlat_mutableuv1 = ((uv - tmpvar_2) * aspect.xy);
  float tmpvar_3;
  tmpvar_3 = clamp ((128.0 * xlat_mutableuv1.y), 0.0, 1.0);
  xlat_mutabledist = (0.5 / xlat_mutableuv1.y);
  xlat_mutablers0.x = (xlat_mutableuv1.x * xlat_mutabledist);
  xlat_mutablers0.y = xlat_mutabledist;
  vec2 tmpvar_4;
  tmpvar_4.x = xlat_mutablers0.x;
  float tmpvar_5;
  tmpvar_5 = (time * 1.4);
  tmpvar_4.y = (xlat_mutabledist + tmpvar_5);
  xlat_mutablers = (tmpvar_4 * tmpvar_3);
  xlat_mutablewater = ((texture (sampler_noise_hq, xlat_mutablers) + texture (sampler_noise_hq, (xlat_mutablers / 3.0))).xyz - 1.1);
  vec2 tmpvar_6;
  tmpvar_6.x = xlat_mutableuv1.x;
  tmpvar_6.y = abs(xlat_mutableuv1.y);
  xlat_mutableuv_wat = (tmpvar_6 - ((
    (xlat_mutablewater * 0.1)
   * tmpvar_3) / xlat_mutabledist).xy);
  vec2 tmpvar_7;
  tmpvar_7.x = xlat_mutableuv1.x;
  tmpvar_7.y = abs(xlat_mutableuv1.y);
  xlat_mutableuv_stars = (tmpvar_7 - ((xlat_mutablewater * 0.01) * tmpvar_3).xy);
  vec2 x_8;
  x_8 = (xlat_mutableuv_wat - _qf.zw);
  xlat_mutablesun = (0.02 / sqrt(dot (x_8, x_8)));
  xlat_mutablehill1 = (q31 * clamp ((
    (16.0 + (16.0 * texture (sampler_noise_mq, vec2(((
      (xlat_mutableuv_wat.x * q10)
     / 2048.0) + rand_preset.x)))))
   - 
    (q10 * abs(xlat_mutableuv_wat.y))
  ), 0.0, 1.0)).x;
  xlat_mutableuv2 = (64.0 * xlat_mutableuv_stars);
  xlat_mutablesmask = (texture (sampler_pw_noise_lq, (xlat_mutableuv2 / 256.0)).z - 0.8);
  vec2 tmpvar_9;
  tmpvar_9 = abs((fract(xlat_mutableuv2) - 0.5));
  float tmpvar_10;
  tmpvar_10 = (clamp ((
    (0.2 / sqrt(dot (tmpvar_9, tmpvar_9)))
   * xlat_mutablesmask), 0.0, 1.0) * (1.0 - (xlat_mutablesmask * 8.0)));
  vec2 tmpvar_11;
  tmpvar_11 = (xlat_mutableuv_stars - _qf.xy);
  float tmpvar_12;
  tmpvar_12 = (q12 * sqrt(dot (tmpvar_11, tmpvar_11)));
  vec2 tmpvar_13;
  tmpvar_13 = ((sin(tmpvar_12) / cos(tmpvar_12)) * normalize(tmpvar_11));
  float tmpvar_14;
  tmpvar_14 = clamp ((100.0 - (71.0 * tmpvar_12)), 0.0, 1.0);
  vec2 tmpvar_15;
  tmpvar_15 = (_qf.zw - _qf.xy);
  xlat_mutablez = (q11 / xlat_mutableuv_wat.x);
  xlat_mutableuv2.x = (((
    abs(xlat_mutablez)
   / 2.0) + sign(xlat_mutablez)) + (0.056 * time));
  float tmpvar_16;
  tmpvar_16 = (texture (sampler_noise_hq, vec2((xlat_mutableuv2.x / 18.0))) + 0.1).x;
  xlat_mutableuv2.y = (((xlat_mutableuv_wat.y * xlat_mutablez) / tmpvar_16) - 0.5);
  xlat_mutablefmask = (float((xlat_mutableuv2.y <= 0.0)) * float((xlat_mutableuv2.y >= -1.0)));
  xlat_mutableforest = (clamp ((
    (texture (sampler_main, (xlat_mutableuv2 * xlat_mutablefmask)).xyz / abs(xlat_mutablez))
   * 2.0), 0.0, 1.0).y * xlat_mutablefmask);
  xlat_mutableuv2.x = (((
    abs(xlat_mutablez)
   / 2.0) + sign(xlat_mutablez)) + (0.049 * time));
  xlat_mutableuv2.y = (((xlat_mutableuv_wat.y * xlat_mutablez) / tmpvar_16) - 0.5);
  xlat_mutablefmask = (float((xlat_mutableuv2.y <= 0.0)) * float((xlat_mutableuv2.y >= -1.0)));
  xlat_mutableforest = (xlat_mutableforest + ((
    clamp (((texture (sampler_main, (xlat_mutableuv2 * xlat_mutablefmask)).xyz / abs(xlat_mutablez)) * 2.0), 0.0, 1.0)
  .y * xlat_mutablefmask) * 0.7));
  float tmpvar_17;
  tmpvar_17 = clamp ((1.0 - (xlat_mutableforest * 1.5)), 0.0, 1.0);
  xlat_mutablefmask = tmpvar_17;
  ret_1 = (((tmpvar_10 * 
    (tmpvar_10 * q26)
  ) * clamp (
    (1.0 - (4.0 * xlat_mutablesun))
  , 0.0, 1.0)) + (xlat_mutablesun * _qe.xyz));
  ret_1 = (ret_1 * (1.0 - tmpvar_14));
  ret_1 = (ret_1 + ((
    ((clamp ((-0.2 + 
      dot (((tmpvar_13 * (1.0 + 
        abs((texture (sampler_noise_hq, (tmpvar_13 / 2.0)) - 0.5))
      .x)) * tmpvar_14), tmpvar_15)
    ), 0.0, 1.0) / sqrt(dot (tmpvar_15, tmpvar_15))) / 2.0)
   * 
    (_qe.xyz + vec3(0.3, 0.4, 0.5))
  ) / 2.0));
  ret_1 = (ret_1 * (1.0 - xlat_mutablehill1));
  vec2 tmpvar_18;
  tmpvar_18.x = ((xlat_mutableuv_wat.x * 2.0) - 0.5);
  tmpvar_18.y = ((xlat_mutableuv_wat.y * 4.0) - 0.5);
  ret_1 = (ret_1 + ((texture (sampler_main, tmpvar_18).x * xlat_mutablehill1) * vec3(1.0, 0.8, 0.5)));
  ret_1 = (ret_1 + (clamp (
    (mix ((q13 * exp(
      (-(q14) * abs(xlat_mutableuv1.y))
    )), (0.5 - xlat_mutableuv1.y), q15) * vec3(0.3, 0.4, 0.5))
  , 0.0, 1.0) * vec3(0.3, 0.4, 0.5)));
  ret_1 = (ret_1 * tmpvar_17);
  vec2 tmpvar_19;
  tmpvar_19.x = (0.5 + (xlat_mutableuv1.x * 0.1));
  tmpvar_19.y = ((xlat_mutableuv1.y * 0.75) + 0.5);
  xlat_mutableuv2 = tmpvar_19;
  xlat_mutablefog = (((texture (sampler_blur2, 
    fract(tmpvar_19)
  ).xyz * scale2) + bias2).z * q25);
  ret_1 = ((ret_1 * clamp (
    (1.0 - xlat_mutablefog)
  , 0.0, 1.0)) + (xlat_mutablefog * (1.0 + _qe.xyz)));
  vec2 tmpvar_20;
  tmpvar_20.x = xlat_mutablers0.x;
  tmpvar_20.y = ((xlat_mutabledist + (tmpvar_5 * 0.8)) + (q30 * sin(
    (xlat_mutablers0.x * 4.0)
  )));
  xlat_mutablers = (tmpvar_20 * tmpvar_3);
  vec3 tmpvar_21;
  tmpvar_21 = ((texture (sampler_noise_hq, xlat_mutablers) + texture (sampler_noise_hq, (xlat_mutablers / 4.0))) - 1.0).xyz;
  xlat_mutablewater = tmpvar_21;
  ret_1 = (ret_1 + ((
    (((clamp (tmpvar_21.y, 0.0, 1.0) * tmpvar_3) * clamp ((xlat_mutablesun * 2.0), 0.0, 1.0)) * 4.0)
   / xlat_mutabledist) * q20));
  ret_1 = (1.0 - exp((
    (-(ret_1) * 2.0)
   + 0.1)));
  vec4 tmpvar_22;
  tmpvar_22.w = 1.0;
  tmpvar_22.xyz = ret_1;
  ret = tmpvar_22.xyz;
 }`,Zt={baseVals:Ut,shapes:Wt,waves:Gt,init_eqs_str:Kt,frame_eqs_str:qt,pixel_eqs_str:Jt,warp:Yt,comp:Xt},Qt={rating:0,gammaadj:1.980001,decay:.5,echo_zoom:.999998,echo_alpha:.5,echo_orient:3,wave_mode:5,wave_dots:1,modwavealphabyvolume:1,wave_brighten:0,darken:1,wave_a:.001,wave_scale:1.169162,wave_smoothing:0,wave_mystery:.08,modwavealphastart:0,modwavealphaend:1.32,warpanimspeed:1.4595,warpscale:2.0067,zoom:.9999,warp:.01,sx:.9999,wave_r:0,wave_g:.99,ob_r:1,ob_g:1,ob_b:1,ib_size:.26,mv_x:64,mv_y:48,mv_l:0,mv_r:.4999,mv_g:.4999,mv_b:.4999,mv_a:0,b1ed:0},$t=[{baseVals:{enabled:1,sides:53,rad:.024396,tex_ang:1.00531,tex_zoom:1.531168,r:.2,g:.7,g2:0,a2:.2,border_b:0,border_a:0},init_eqs_str:`a.q22=0;a.r0=0;a.q24=0;a.r0=0;a.q24=0;a.b0=0;a.q24=0;a.b0=0;a.q24=0;a.g0=0;a.q24=0;a.g0=0;a.q24=0;a.q22=0;`,frame_eqs_str:`a.a=a.q22;a.a2=a.a;a.r0=bnot(a.q24)*a.r0+div(a.q24*randint(10),10);a.b0=bnot(a.q24)*a.b0+div(a.q24*randint(10),10);a.g0=bnot(a.q24)*a.g0+div(a.q24*randint(10),10);a.rad=div(a.q22,40);a.r=0;a.b=1;a.g=.6;a.r2=0;a.b2=0;a.g2=0;`},{baseVals:{enabled:1,sides:44,textured:1,x:.7,rad:.2173,tex_ang:.628319,tex_zoom:1.633192,g:1,b:1,r2:.99,g2:.99,b2:1,a2:1,border_r:.5,border_g:.5,border_b:0,border_a:0},init_eqs_str:`a.rot0=0;a.rot0=0;a.q1=0;a.posx=0;a.q24=0;a.posx=0;a.q24=0;a.posy=0;a.q24=0;a.posy=0;a.q24=0;a.rad0=0;a.q24=0;a.rad0=0;a.q24=0;a.rad0=0;a.posx=0;a.posy=0;a.rot0=0;`,frame_eqs_str:`a.textured=1;a.rot0+=div(1,a.fps)*a.q1;a.posx=(1-a.q24)*a.posx+a.q24*(.3+div(randint(100),200));a.posy=(1-a.q24)*a.posy+a.q24*(.3+div(randint(100),200));a.rad0=(1-a.q24)*a.rad0+a.q24*(.05+div(randint(100),300));a.rad=a.rad0;a.x=a.posx;a.y=a.posy;a.ang=a.rot0;`},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],en=[{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],tn=`a.index=0;a.q22=0;a.q21=0;a.q1=0;a.dec_med=0;a.rott=0;a.is_beat=0;a.q23=0;a.k1=0;a.q24=0;a.dec_slow=0;a.q4=0;a.q26=0;a.p2=0;a.avg=0;a.beat=0;a.p1=0;a.peak=0;a.q2=0;a.q27=0;a.q3=0;a.t0=0;a.q32=0;a.q20=0;`,nn=`a.dec_med=pow(.9,div(30,a.fps));a.dec_slow=pow(.99,div(30,a.fps));a.beat=Math.max(Math.max(a.bass,a.mid),a.treb);a.avg=a.avg*a.dec_slow+a.beat*(1-a.dec_slow);a.is_beat=above(a.beat,.2+a.avg+a.peak)*above(a.time,a.t0+.2);a.t0=a.is_beat*a.time+(1-a.is_beat)*a.t0;a.peak=a.is_beat*a.beat+(1-a.is_beat)*a.peak*a.dec_med;a.index=mod(a.index+a.is_beat,8);a.q20=a.avg;a.q21=a.beat;a.q22=a.peak;a.q23=a.index;a.q24=a.is_beat;a.q26=a.bass+a.mid+a.treb;a.k1=a.is_beat*equal(a.index,0);a.p1=
a.k1*(a.p1+1)+(1-a.k1)*a.p1;a.p2=a.dec_med*a.p2+(1-a.dec_med)*a.p1;a.rott=div(3.1416*a.p2,2);a.q27=a.index+1;a.q1=Math.cos(a.rott);a.q2=Math.sin(a.rott);a.q3=-a.q2;a.q4=a.q1;a.zoom=1.01;a.rot=-0*a.index;a.q32=pow(.996,div(30,a.fps));`,rn=` shader_body { 
  vec2 uv_1;
  vec2 uv6_2;
  vec2 tmpvar_3;
  tmpvar_3 = ((uv_orig - 0.5) * aspect.xy);
  float tmpvar_4;
  tmpvar_4 = (((4.0 * 
    sqrt(dot (tmpvar_3, tmpvar_3))
  ) + (time / 2.0)) + q22);
  uv_1 = (uv_orig + (clamp (
    ((sin(tmpvar_4) / cos(tmpvar_4)) * normalize(tmpvar_3))
  , vec2(-8.0, -8.0), vec2(8.0, 8.0)) / 64.0));
  uv6_2 = (tmpvar_3 * 2.0);
  vec4 tmpvar_5;
  tmpvar_5.w = 1.0;
  tmpvar_5.xyz = (((
    (texture (sampler_main, uv_1).xyz - (((texture (sampler_blur1, 
      fract(uv_1)
    ).xyz * scale1) + bias1) * 0.04))
   + 
    (abs(vec3((0.2 / sqrt(
      (uv6_2.y - ((q22 * 0.04) * sin((q22 * 
        ((8.0 * uv6_2.x) + time)
      ))))
    )))) * vec3(0.06, 0.0504, 0.036))
  ) * 0.99) - 0.01);
  ret = tmpvar_5.xyz;
 }`,an=`vec3 xlat_mutablenoise;
vec2 xlat_mutablers;
 shader_body { 
  vec2 uv1_1;
  uv1_1 = (((uv - 0.5) * aspect.xy) * aspect.yx);
  float tmpvar_2;
  tmpvar_2 = ((3.0 + (q10 * 4.0)) / abs(uv1_1.y));
  xlat_mutablers.x = (uv1_1.x * tmpvar_2);
  xlat_mutablers.y = (tmpvar_2 + (time * 6.0));
  vec2 tmpvar_3;
  tmpvar_3 = sin(xlat_mutablers);
  vec3 tmpvar_4;
  tmpvar_4 = vec3((1.0 - sqrt(sqrt(
    dot (tmpvar_3, tmpvar_3)
  ))));
  xlat_mutablenoise = (tmpvar_4 * (vec3(
    greaterThanEqual (tmpvar_4, vec3(0.1, 0.1, 0.1))
  ) * clamp (
    (1.0 - (tmpvar_2 / 40.0))
  , 0.0, 1.0)));
  vec4 tmpvar_5;
  tmpvar_5.w = 1.0;
  tmpvar_5.xyz = ((texture (sampler_main, (uv + 
    (xlat_mutablenoise / 2.0)
  .xy)).xyz * 1.5) - (0.1 * xlat_mutablenoise));
  ret = tmpvar_5.xyz;
 }`,on={baseVals:Qt,shapes:$t,waves:en,init_eqs_str:tn,frame_eqs_str:nn,pixel_eqs_str:``,pixel_eqs:``,warp:rn,comp:an},sn={rating:0,gammaadj:1.980001,decay:.5,echo_zoom:.999998,echo_alpha:.5,echo_orient:3,wave_mode:6,additivewave:1,wave_thick:1,modwavealphabyvolume:1,wave_brighten:0,wrap:0,darken:1,wave_a:.001,wave_scale:2.103075,wave_smoothing:.54,wave_mystery:.38,modwavealphastart:.81,modwavealphaend:1.4,warpanimspeed:1.4595,warpscale:2.0067,zoom:.9999,warp:.01,sx:.9999,wave_r:0,wave_g:0,wave_b:0,ob_size:0,ob_b:1,ob_a:.3,ib_size:.26,mv_x:64,mv_y:48,mv_l:1.85,mv_r:.4999,mv_g:.4999,mv_b:.4999,mv_a:0,b1ed:0},cn=[{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],ln=[{baseVals:{enabled:1,samples:128,additive:1,scaling:.891519,smoothing:0,g:0,b:0},init_eqs_str:`a.q24=0;a.q27=0;a.t1=1+.3*(.01*randint(101)-.01*randint(101));a.t2=1+.3*(.01*randint(101)-.01*randint(101));a.t3=1+.3*(.01*randint(101)-.01*randint(101));a.t4=1+.3*(.01*randint(101)-.01*randint(101));a.t5=1+.3*(.01*randint(101)-.01*randint(101));a.t6=1+.3*(.01*randint(101)-.01*randint(101));a.t7=1+.3*(.01*randint(101)-.01*randint(101));a.t8=1+.3*(.01*randint(101)-.01*randint(101));`,frame_eqs_str:``,point_eqs_str:`a.x=.4+.2*a.sample;a.y=.5+.05*a.value2;a.a=1*a.q24*mod(a.q27+1,2);a.r=1;a.b=1;a.g=.5;`},{baseVals:{enabled:1,samples:128,scaling:.891519,smoothing:0,r:0,g:0,a:.1},init_eqs_str:`a.q24=0;a.q27=0;a.t;`,frame_eqs_str:``,point_eqs_str:`a.y=.4+.2*a.sample;a.x=.5+.05*a.value2;a.a=1*a.q24*mod(a.q27,2);a.r=1;a.b=1;a.g=.6;`},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],un=`a.trig2=0;a.p3z=0;a.index2=0;a.vtrig=0;a.index=0;a.q12=0;a.q18=0;a.q22=0;a.q21=0;a.hy=0;a.q13=0;a.q15=0;a.q6=0;a.q1=0;a.dec_med=0;a.q5=0;a.p2z=0;a.trel=0;a.q9=0;a.rott=0;a.p1z=0;a.is_beat=0;a.q23=0;a.q22slow=0;a.k1=0;a.q24=0;a.vx=0;a.dec_slow=0;a.q11=0;a.z0=0;a.q10=0;a.vy=0;a.q4=0;a.q16=0;a.q26=0;a.p2=0;a.avg=0;a.q19=0;a.beat=0;a.q17=0;a.vol=0;a.p1=0;a.peak=0;a.trig1=0;a.q2=0;a.q27=0;a.q14=0;a.trig3=0;a.speed=0;a.q3=0;a.t0=0;a.hx=0;a.q28=0;a.q20=0;a.prox=1;`,dn=`a.dec_med=pow(.8,div(30,a.fps));a.dec_slow=pow(.8,div(30,a.fps));a.beat=Math.max(Math.max(a.bass,a.mid),a.treb);a.avg=a.avg*a.dec_slow+a.beat*(1-a.dec_slow);a.is_beat=above(a.beat,a.avg+a.peak)*above(a.time,a.t0+.2);a.t0=a.is_beat*a.time+(1-a.is_beat)*a.t0;a.peak=a.is_beat*a.beat+(1-a.is_beat)*a.peak*a.dec_med;a.index=mod(a.index+a.is_beat,16);a.index2=mod(a.index2+a.is_beat*bnot(a.index),4);a.q22=a.peak;a.q22slow=a.q22slow*a.dec_slow+a.q22*(1-a.dec_slow);a.q23=a.q22slow;a.q24=
a.is_beat;a.q26=a.bass_att+a.mid_att+a.treb_att;a.vol=a.vol*a.dec_med+(1-a.dec_med)*a.q26;a.q27=a.index+1;a.q28=a.index2;a.k1=a.is_beat*equal(mod(a.index,2),0);a.p1=a.k1*(a.p1+1)+(1-a.k1)*a.p1;a.p2=a.dec_med*a.p2+(1-a.dec_med)*a.p1;a.rott+=div(16*a.q22*(1-a.dec_med),a.fps)*below(a.q27,6);a.q1=Math.cos(a.rott);a.q2=Math.sin(a.rott);a.q3=-a.q2;a.q4=a.q1;a.vtrig=a.is_beat*bnot(mod(a.index,2));a.vx=a.vx*bnot(a.vtrig)+a.vtrig*(div(randint(100),100)-.5);a.vy=a.vy*bnot(a.vtrig)+a.vtrig*(div(randint(100),
100)-.5);a.vx*=below(mod(a.index,15),15);a.vy*=below(mod(a.index,15),15);a.q5=5*a.vx;a.q6=5*a.vy;a.q21=div(1+Math.sin(div(a.time,12)),8)+.01;a.trig1=a.q24*bnot(mod(a.index,12));a.trig2=a.q24*bnot(mod(a.index+4,12));a.trig3=a.q24*bnot(mod(a.index+8,12));a.trel+=div(a.vol,a.fps);a.z0=1;a.speed=div(a.vol,2);a.hx=Math.sin(a.trel);a.hy=Math.cos(a.trel);a.p1z=bnot(a.trig1)*(a.p1z+div((5+a.p1z)*a.speed,a.fps))+a.trig1*a.z0;a.p1z=Math.max(a.p1z,.1);a.q9=div(a.hx,a.p1z);a.q10=div(a.hy,a.p1z);a.q11=a.p1z;a.q12=
.1+.02*a.q26*bnot(mod(a.index+2,3))*a.p1z*Math.exp(div(-a.p1z,100));a.p2z=bnot(a.trig2)*(a.p2z+div((5+a.p2z)*a.speed,a.fps))+a.trig2*a.z0;a.p2z=Math.max(a.p2z,.1);a.q13=div(2*a.hx,a.p2z);a.q14=div(-.5*a.hy,a.p2z);a.q15=a.p2z;a.q16=.1+.02*a.q26*bnot(mod(a.index+2,3))*a.p2z*Math.exp(div(-a.p2z,100));a.p3z=bnot(a.trig3)*(a.p3z+div((5+a.p3z)*a.speed,a.fps))+a.trig3*a.z0;a.p3z=Math.max(a.p3z,.1);a.q17=div(-1.4*a.hx,a.p3z);a.q18=div(2*a.hy,a.p3z);a.q19=a.p3z;a.q20=.1+.02*a.q26*bnot(mod(a.index+2,3))*a.p3z*
Math.exp(div(-a.p3z,100));`,fn=`a.zoom=1.2+.2*Math.sin(div(a.time,3));`,pn=` shader_body { 
  vec2 uv6_1;
  vec2 uv1_2;
  vec2 tmpvar_3;
  tmpvar_3 = (uv - 0.5);
  float x_4;
  x_4 = (abs(tmpvar_3.x) - abs(tmpvar_3.y));
  float tmpvar_5;
  tmpvar_5 = (12.0 * sqrt((x_4 * x_4)));
  uv1_2 = (tmpvar_3 - (clamp (
    ((sin(tmpvar_5) / cos(tmpvar_5)) * normalize(tmpvar_3))
  , vec2(-3.0, -3.0), vec2(3.0, 3.0)) / 40.0));
  uv6_1 = (0.4 * cos((
    (uv1_2 * 14.0)
   + time)));
  vec4 tmpvar_6;
  tmpvar_6.w = 1.0;
  tmpvar_6.xyz = (((texture (sampler_main, 
    ((uv1_2 * ((0.95 - 
      (q28 / 16.0)
    ) + (0.4 * tmpvar_5))) + 0.5)
  ).xyz + vec3(
    (0.004 / sqrt(dot (uv6_1, uv6_1)))
  )) * 0.99) - 0.03);
  ret = tmpvar_6.xyz;
 }`,mn=`vec3 xlat_mutableret2;
vec2 xlat_mutablerss;
vec2 xlat_mutablerss0;
 shader_body { 
  vec2 uv_1;
  vec3 dots_2;
  vec2 uv1_3;
  vec3 ret_4;
  uv_1 = (uv * aspect.xy);
  vec2 tmpvar_5;
  tmpvar_5.x = q5;
  tmpvar_5.y = q6;
  uv_1 = (uv_1 - (0.1 * tmpvar_5));
  mat2 tmpvar_6;
  tmpvar_6[uint(0)] = _qa.xy;
  tmpvar_6[1u] = _qa.zw;
  uv1_3 = ((uv_1 - 0.5) * tmpvar_6);
  float tmpvar_7;
  float tmpvar_8;
  tmpvar_8 = (min (abs(
    (uv1_3.x / uv1_3.y)
  ), 1.0) / max (abs(
    (uv1_3.x / uv1_3.y)
  ), 1.0));
  float tmpvar_9;
  tmpvar_9 = (tmpvar_8 * tmpvar_8);
  tmpvar_9 = (((
    ((((
      ((((-0.01213232 * tmpvar_9) + 0.05368138) * tmpvar_9) - 0.1173503)
     * tmpvar_9) + 0.1938925) * tmpvar_9) - 0.3326756)
   * tmpvar_9) + 0.9999793) * tmpvar_8);
  tmpvar_9 = (tmpvar_9 + (float(
    (abs((uv1_3.x / uv1_3.y)) > 1.0)
  ) * (
    (tmpvar_9 * -2.0)
   + 1.570796)));
  tmpvar_7 = (tmpvar_9 * sign((uv1_3.x / uv1_3.y)));
  if ((abs(uv1_3.y) > (1e-08 * abs(uv1_3.x)))) {
    if ((uv1_3.y < 0.0)) {
      if ((uv1_3.x >= 0.0)) {
        tmpvar_7 += 3.141593;
      } else {
        tmpvar_7 = (tmpvar_7 - 3.141593);
      };
    };
  } else {
    tmpvar_7 = (sign(uv1_3.x) * 1.570796);
  };
  xlat_mutablerss0.x = (tmpvar_7 / 3.1416);
  xlat_mutablerss0.y = (0.003 / sqrt(dot (uv1_3, uv1_3)));
  vec2 tmpvar_10;
  tmpvar_10.x = (xlat_mutablerss0.x + (q1 / 3.0));
  tmpvar_10.y = (xlat_mutablerss0.y + time);
  xlat_mutablerss = (tmpvar_10 * mat2(0.7, -0.7, 0.7, 0.7));
  vec4 tmpvar_11;
  tmpvar_11 = vec4(greaterThanEqual ((texture (sampler_pw_noise_lq, 
    (xlat_mutablerss / 32.0)
  ) - 0.5), vec4(0.0, 0.0, 0.0, 0.0)));
  vec2 tmpvar_12;
  tmpvar_12 = abs((fract(
    (xlat_mutablerss * 8.0)
  ) - 0.5));
  vec2 tmpvar_13;
  tmpvar_13.x = xlat_mutablerss0.x;
  tmpvar_13.y = (xlat_mutablerss0.y + (time / 4.0));
  xlat_mutablerss = (tmpvar_13 * mat2(0.7, -0.7, 0.7, 0.7));
  vec2 tmpvar_14;
  tmpvar_14 = abs((fract(
    (xlat_mutablerss * 8.0)
  ) - 0.5));
  dots_2 = (vec3((clamp (
    (0.04 / sqrt(dot (tmpvar_12, tmpvar_12)))
  , 0.0, 1.0) * tmpvar_11.x)) + (clamp (
    (0.02 / sqrt(dot (tmpvar_14, tmpvar_14)))
  , 0.0, 1.0) * vec4(
    greaterThanEqual ((texture (sampler_pw_noise_lq, (xlat_mutablerss / 32.0)) - 0.5), vec4(0.0, 0.0, 0.0, 0.0))
  ).x));
  dots_2 = (dots_2 * clamp ((0.2 / 
    abs(xlat_mutablerss0.y)
  ), 0.0, 1.0));
  dots_2 = (dots_2 * dots_2);
  xlat_mutableret2 = (clamp ((
    ((q22 * q21) / (sqrt(dot (uv1_3, uv1_3)) + 0.4))
   * texture (sampler_main, 
    ((uv1_3 * ((q22 * 
      (float(mod (q27, 2.0)))
    ) + 0.5)) + 0.5)
  )), 0.0, 1.0).xyz / (sqrt(
    dot (uv1_3, uv1_3)
  ) + 0.02));
  float tmpvar_15;
  tmpvar_15 = dot (xlat_mutableret2, vec3(0.32, 0.49, 0.29));
  vec3 tmpvar_16;
  tmpvar_16.x = 1.0;
  tmpvar_16.y = tmpvar_15;
  tmpvar_16.z = q22;
  ret_4 = (tmpvar_15 * tmpvar_16);
  float tmpvar_17;
  tmpvar_17 = dot (dots_2, vec3(0.32, 0.49, 0.29));
  vec3 tmpvar_18;
  tmpvar_18.x = (1.0 - (tmpvar_17 / 4.0));
  tmpvar_18.y = (tmpvar_17 / 2.0);
  tmpvar_18.z = tmpvar_17;
  ret_4 = (ret_4 + (tmpvar_17 * clamp (
    (q23 * tmpvar_18)
  , 0.0, 1.0)));
  vec4 tmpvar_19;
  tmpvar_19.w = 1.0;
  tmpvar_19.xyz = ret_4;
  ret = tmpvar_19.xyz;
 }`,hn={baseVals:sn,shapes:cn,waves:ln,init_eqs_str:un,frame_eqs_str:dn,pixel_eqs_str:fn,warp:pn,comp:mn},gn={rating:2,gammaadj:1.98,decay:.5,echo_zoom:1,echo_alpha:.5,echo_orient:3,wave_mode:7,additivewave:1,wave_thick:1,modwavealphabyvolume:1,wave_brighten:0,darken:1,wave_a:.001,wave_scale:.958,wave_smoothing:.45,modwavealphastart:0,modwavealphaend:1.32,warpanimspeed:1.459,warpscale:2.007,zoom:.9999,warp:.01,sx:.9999,ob_size:.015,ob_b:1,ib_size:.26,mv_x:64,mv_y:48,mv_l:1.85,mv_r:.5,mv_g:.5,mv_b:.5,mv_a:0,b1ed:0},_n=[{baseVals:{enabled:0}},{baseVals:{enabled:1,sides:100,additive:1,x:.26,y:.2,rad:.39317,tex_zoom:.9355,r:0,g:.55,b:.5,g2:.4,b2:.4,a2:.07,border_r:.3,border_g:.7,border_b:.8,border_a:0},init_eqs_str:`a.trig=0;a.q24=0;a.x0=0;a.x0=0;a.trig=0;a.trig=0;a.y0=0;a.y0=0;a.trig=0;a.trig=0;a.x0=0;a.x0=0;a.q1=0;a.q26=0;a.y0=0;a.y0=0;a.q2=0;a.q26=0;a.x0=0;a.x0=0;a.x0=0;a.y0=0;a.y0=0;a.y0=0;a.q1=0;a.q2=0;a.x0=0;a.y0=0;a.rad0=0;a.rad0=0;a.trig=0;a.trig=0;a.rad0=0;a.r0=0;a.trig=0;a.r0=0;a.trig=0;a.g0=0;a.trig=0;a.g0=0;a.trig=0;a.b0=0;a.trig=0;a.b0=0;a.trig=0;a.r0=0;a.b0=0;a.g0=0;`,frame_eqs_str:`a.trig=a.q24;a.x0=a.x0*bnot(a.trig)+a.trig*(.5+div(randint(100),200));a.y0=a.y0*bnot(a.trig)+a.trig*(.5+div(randint(100),200));a.x0+=div(.1*a.q1*(3+a.q26),a.fps);a.y0+=div(.1*a.q2*(3+a.q26),a.fps);a.x0-=Math.floor(a.x0);a.y0-=Math.floor(a.y0);a.tex_ang=a.time;a.tex_zoom=a.q1;a.ang=div(a.time,100)*a.q2;a.x=a.x0;a.y=a.y0;a.rad0=a.rad0*bnot(a.trig)+a.trig*(.04+div(randint(100),1E3));a.rad=a.rad0;a.r0=bnot(a.trig)*a.r0+div(a.trig*randint(10),10);a.g0=bnot(a.trig)*a.g0+div(a.trig*
randint(10),10);a.b0=bnot(a.trig)*a.b0+div(a.trig*randint(10),10);a.r=a.r0;a.b=a.b0;a.g=a.g0;a.r2=0;a.b2=0;a.g2=0;a.a=1;a.a2=.3;`},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],vn=[{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],yn=`a.dec_med=0;a.dec_slow=0;a.q1=0;a.q2=0;`,bn=`a.dec_med=pow(.7,div(30,a.fps));a.dec_slow=pow(.95,div(30,a.fps));a.q1=1;a.q2=0;`,xn=`a.zoom=1;`,Sn=` shader_body { 
  vec2 uv_1;
  vec2 uv6_2;
  vec2 tmpvar_3;
  tmpvar_3 = (uv - vec2(0.5, 0.5));
  float x_4;
  x_4 = (tmpvar_3.x * tmpvar_3.y);
  float tmpvar_5;
  tmpvar_5 = (64.0 * sqrt((x_4 * x_4)));
  vec2 tmpvar_6;
  tmpvar_6 = normalize(tmpvar_3);
  uv_1 = (uv + ((
    (q28 * -0.01)
   * tmpvar_6) * (1.0 - 
    ((1.0/(tmpvar_5)) * (q2 + 1.0))
  )));
  uv_1 = (uv_1 - ((
    clamp (((sin(tmpvar_5) / cos(tmpvar_5)) * tmpvar_6), vec2(-2.0, -2.0), vec2(2.0, 2.0))
   / 20.0) * rad));
  uv6_2 = (0.2 * cos((
    (uv_1 * 12.0)
   + 
    (rand_frame * 6.0)
  .xy)));
  vec4 tmpvar_7;
  tmpvar_7.w = 1.0;
  tmpvar_7.xyz = ((0.5 * (
    ((texture (sampler_main, ((
      (uv_1 - 0.5)
     * 
      (1.1 + (0.1 * tmpvar_5))
    ) + 0.5)).xyz + (vec3((
      (0.004 / sqrt(dot (uv6_2, uv6_2)))
     * 
      (1.0 - rad)
    )) * (1.0 + roam_cos).xyz)) * 0.96)
   - 0.01)) + (0.5 * texture (sampler_main, uv_orig).xyz));
  ret = tmpvar_7.xyz;
 }`,Cn=`vec2 xlat_mutablers0;
vec3 xlat_mutablesun;
vec2 xlat_mutableuv1;
vec2 xlat_mutableuv5;
vec2 xlat_mutableuv_wat;
float xlat_mutablez;
float xlat_mutablezc;
 shader_body { 
  vec3 ret_1;
  xlat_mutableuv1 = ((uv - vec2(0.5, 0.7)) * aspect.xy);
  float tmpvar_2;
  tmpvar_2 = clamp ((512.0 * xlat_mutableuv1.y), 0.0, 1.0);
  xlat_mutablez = (1.0/(xlat_mutableuv1.y));
  xlat_mutablers0.x = (xlat_mutableuv1.x * xlat_mutablez);
  xlat_mutablers0.y = xlat_mutablez;
  vec2 tmpvar_3;
  tmpvar_3.x = xlat_mutablers0.x;
  tmpvar_3.y = (xlat_mutablez + time);
  vec3 tmpvar_4;
  tmpvar_4 = ((texture (sampler_noise_hq, (tmpvar_3 * tmpvar_2)) + texture (sampler_noise_hq, (
    ((tmpvar_3 / 4.0) * tmpvar_2)
   + 
    (time / 8.0)
  ))) - 1.0).xyz;
  vec2 tmpvar_5;
  tmpvar_5.x = xlat_mutableuv1.x;
  tmpvar_5.y = abs(xlat_mutableuv1.y);
  xlat_mutableuv_wat = (tmpvar_5 - ((
    (tmpvar_4 / xlat_mutablez)
   * 0.25) * tmpvar_2).xy);
  vec2 x_6;
  x_6 = (xlat_mutableuv_wat - vec2(0.2, 0.08));
  xlat_mutablesun = (clamp ((0.01 / 
    sqrt(dot (x_6, x_6))
  ), 0.0, 1.0) * vec3(0.3, 0.5, 1.0));
  xlat_mutablezc = (0.7 / (xlat_mutableuv_wat.y + 0.5));
  vec2 tmpvar_7;
  tmpvar_7.x = (xlat_mutableuv_wat.x * xlat_mutablezc);
  tmpvar_7.y = (xlat_mutablezc + (time * 0.01));
  vec4 tmpvar_8;
  tmpvar_8 = texture (sampler_main, fract((tmpvar_7 + (rand_preset.xy - 0.5))));
  float tmpvar_9;
  tmpvar_9 = (0.9 * uv.x);
  xlat_mutableuv5 = ((xlat_mutableuv_wat / 8.0) / tmpvar_9);
  vec2 tmpvar_10;
  tmpvar_10.x = (((xlat_mutableuv5.x / 2.0) + (
    ((sin((
      (uv.x * 8.0)
     + time)) * (xlat_mutableuv1.y * xlat_mutableuv1.y)) * 0.004)
   / tmpvar_9)) + rand_preset.x);
  tmpvar_10.y = (0.04 * xlat_mutableuv5.y);
  float tmpvar_11;
  tmpvar_11 = (texture (sampler_noise_lq, (tmpvar_10 * 8.0)).x - 0.5);
  vec2 tmpvar_12;
  tmpvar_12.x = (xlat_mutableuv5.x * 8.0);
  tmpvar_12.y = ((xlat_mutableuv5.y * 128.0) - (tmpvar_11 / 2.0));
  vec3 tmpvar_13;
  tmpvar_13 = clamp ((1.0 - vec3((
    (abs(((xlat_mutableuv5.y * 32.0) / tmpvar_9)) * (1.0 + (0.5 * tmpvar_11)))
   * 
    (1.0 + (0.4 * texture (sampler_noise_lq, tmpvar_12).x))
  ))), 0.0, 1.0);
  vec3 v_14;
  v_14 = (tmpvar_13 * sqrt(xlat_mutablesun));
  ret_1 = ((xlat_mutablesun + (
    (vec3(0.09, 0.12, 0.15) * clamp ((0.5 - abs(xlat_mutableuv1.y)), 0.0, 1.0))
   * 
    clamp ((1.0 - (dot (tmpvar_8.xyz, vec3(0.32, 0.49, 0.29)) * 3.0)), 0.0, 1.0)
  )) + ((tmpvar_8.xyz * tmpvar_8.xyz) * 8.0));
  ret_1 = ((ret_1 * clamp (
    (1.0 - (tmpvar_13 * 8.0))
  , 0.0, 1.0)) + ((
    ((vec3(2.4, 8.0, 11.2) * (1.0 + tmpvar_11)) * tmpvar_9)
   * 
    (abs(dFdx(v_14)) + abs(dFdy(v_14)))
  ) * (1.0 - 
    (tmpvar_2 * 0.5)
  )));
  ret_1 = (ret_1 + ((
    (tmpvar_2 * texture (sampler_noise_lq, (tmpvar_2 * ((xlat_mutablers0 / 4.0) + (tmpvar_4 * 0.01).xy))).x)
   * 0.4) / xlat_mutablez));
  vec4 tmpvar_15;
  tmpvar_15.w = 1.0;
  tmpvar_15.xyz = ret_1;
  ret = tmpvar_15.xyz;
 }`,wn={baseVals:gn,shapes:_n,waves:vn,init_eqs_str:yn,frame_eqs_str:bn,pixel_eqs_str:xn,warp:Sn,comp:Cn},Tn={rating:0,gammaadj:1.980001,decay:.5,echo_zoom:.999998,echo_alpha:.5,echo_orient:3,additivewave:1,wave_thick:1,modwavealphabyvolume:1,wave_brighten:0,darken:1,wave_a:3.749209,wave_scale:2.466119,wave_smoothing:0,wave_mystery:.2,modwavealphastart:.71,modwavealphaend:1.3,warpanimspeed:1.4595,warpscale:2.0067,zoom:.9999,warp:.01,sx:.9999,wave_r:0,wave_g:0,wave_b:0,ob_r:1,ob_g:1,ob_b:1,ib_size:.11,mv_x:64,mv_y:48,mv_l:1.85,mv_r:.4999,mv_g:.4999,mv_b:.4999,mv_a:0,b1x:.6999,b1ed:0},En=[{baseVals:{enabled:1,sides:15,textured:1,rad:.72072,tex_zoom:1.242906,g:.4,b:.89,a:.8,r2:1,g2:0,b2:1,border_b:0,border_a:0},init_eqs_str:``,frame_eqs_str:`a.tex_ang=.7+.3*Math.sin(a.time);`},{baseVals:{enabled:1,sides:63,textured:1,x:.81,y:.3,rad:.397104,tex_ang:2.513274,tex_zoom:.907991,g:1,b:1,a:.6,r2:1,b2:1,a2:.47,border_r:.5,border_g:.5,border_b:.5,border_a:0},init_eqs_str:``,frame_eqs_str:``},{baseVals:{enabled:1,sides:63,x:.323,y:0,rad:.273185,tex_zoom:.499805,g:1,b:1,a:.7,r2:1,b2:1,border_r:0,border_a:0},init_eqs_str:``,frame_eqs_str:`a.x=div(randint(100),100);a.y=div(randint(100),100);a.a=.8;a.r=0;a.b=1;a.g=1;a.a2=1;a.r2=0;a.b2=0;a.g2=0;a.rad=.02;`},{baseVals:{enabled:0}}],Dn=[{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],On=`a.index2=0;a.index=0;a.q22=0;a.q21=0;a.q29=0;a.movex=0;a.q1=0;a.dec_med=0;a.index3=0;a.rott=0;a.is_beat=0;a.q31=0;a.q23=0;a.k1=0;a.q24=0;a.dec_slow=0;a.q4=0;a.q26=0;a.p2=0;a.avg=0;a.movez=0;a.crawl=0;a.beat=0;a.p1=0;a.peak=0;a.q2=0;a.q27=0;a.q3=0;a.t0=0;a.q32=0;a.q28=0;a.q30=0;a.q20=0;`,kn=`a.dec_med=pow(.9,div(30,a.fps));a.dec_slow=pow(.99,div(30,a.fps));a.beat=Math.max(Math.max(a.bass,a.mid),a.treb);a.avg=a.avg*a.dec_slow+a.beat*(1-a.dec_slow);a.is_beat=above(a.beat,.5+a.avg+a.peak)*above(a.time,a.t0+.2);a.t0=a.is_beat*a.time+(1-a.is_beat)*a.t0;a.peak=a.is_beat*a.beat+(1-a.is_beat)*a.peak*a.dec_med;a.index=mod(a.index+a.is_beat,8);a.index2=mod(a.index2+a.is_beat*bnot(a.index),8);a.index3=mod(a.index3+a.is_beat*bnot(a.index)*bnot(a.index2),3);a.q20=a.avg;a.q21=
a.beat;a.q22=a.peak;a.q23=a.index;a.q24=a.is_beat;a.q26=a.bass+a.mid+a.treb+1;a.q27=a.index+1;a.q28=a.index2+1;a.k1=a.is_beat*equal(mod(a.index,2),0);a.p1=a.k1*(a.p1+1)+(1-a.k1)*a.p1;a.p2=a.dec_med*a.p2+(1-a.dec_med)*a.p1;a.rott=div(3.1416*a.p2,4);a.q1=Math.cos(a.rott);a.q2=Math.sin(a.rott);a.q3=-a.q2;a.q4=a.q1;a.movex+=div(.03*30,a.fps);a.q29=a.movex;a.movez+=div(2.1,a.fps);a.q30=a.movez;a.crawl+=div(.03*(2+a.q22),a.fps);a.q31=a.crawl;a.q32=2+Math.sin(div(a.time,7));a.monitor=a.index2;`,An=`a.zoom=1;`,jn=` shader_body { 
  float rota_1;
  vec2 uv6_2;
  vec2 tmpvar_3;
  tmpvar_3 = (uv - 0.5);
  rota_1 = (dot (texture (sampler_noise_hq, (
    (tmpvar_3 / 5.0)
   + q31)), vec4(0.32, 0.49, 0.29, 0.0)) * 2.0);
  float tmpvar_4;
  tmpvar_4 = sin(rota_1);
  float tmpvar_5;
  tmpvar_5 = cos(rota_1);
  mat2 tmpvar_6;
  tmpvar_6[uint(0)].x = tmpvar_5;
  tmpvar_6[uint(0)].y = -(tmpvar_4);
  tmpvar_6[1u].x = tmpvar_4;
  tmpvar_6[1u].y = tmpvar_5;
  uv6_2 = (tmpvar_3 * tmpvar_6);
  float tmpvar_7;
  tmpvar_7 = (4.0 * sqrt(dot (uv6_2, uv6_2)));
  vec2 tmpvar_8;
  tmpvar_8 = normalize((uv6_2 * tmpvar_7));
  vec2 tmpvar_9;
  tmpvar_9 = (((20.0 * 
    (sin(tmpvar_7) / cos(tmpvar_7))
  ) * tmpvar_8) * tmpvar_8);
  vec4 tmpvar_10;
  tmpvar_10.w = 1.0;
  tmpvar_10.xyz = (((
    (vec3(clamp ((1.0 - abs(
      (tmpvar_9.y * tmpvar_9.x)
    )), 0.0, 1.0)) * vec3(1.0, 0.0, 0.0))
   * 
    (1.0 - (2.0 * rad))
  ) + (
    (texture (sampler_main, uv).xyz * (1.0 - (0.1 * pow (rad, 3.0))))
   * vec3(0.0, 1.0, 1.0))) - 0.004);
  ret = tmpvar_10.xyz;
 }`,Mn=`vec3 xlat_mutableret1;
vec2 xlat_mutablers2;
vec2 xlat_mutabletmp;
vec2 xlat_mutableuv2;
vec2 xlat_mutableuv3;
 shader_body { 
  vec3 dots_1;
  vec3 inten_3;
  float dist_4;
  dist_4 = 1.0;
  inten_3 = vec3(1.0, 1.0, 1.0);
  xlat_mutableret1 = vec3(0.0, 0.0, 0.0);
  xlat_mutabletmp = ((uv - 0.5) * aspect.xy);
  for (int n_2 = 0; n_2 <= 4; n_2++) {
    dist_4 = (1.0 - fract((
      (0.25 * float(n_2))
     + q29)));
    float tmpvar_5;
    tmpvar_5 = (float(mod (float(n_2), 2.0)));
    float tmpvar_6;
    tmpvar_6 = (float(mod (float((n_2 + 1)), 2.0)));
    xlat_mutableuv2.x = ((xlat_mutabletmp.x * tmpvar_5) - (xlat_mutabletmp.y * tmpvar_6));
    xlat_mutableuv2.y = ((xlat_mutabletmp.x * tmpvar_6) + (xlat_mutabletmp.y * tmpvar_5));
    xlat_mutableuv2 = (xlat_mutableuv2 * aspect.yx);
    inten_3.x = ((sqrt(dist_4) * (1.0 - 
      (dist_4 * dist_4)
    )) * 2.0);
    inten_3.y = 1.0;
    inten_3.z = 1.0;
    xlat_mutableuv3 = (((
      (4.0 * xlat_mutableuv2)
     * dist_4) + (0.7 * 
      float(n_2)
    )) + ((0.2 * q29) * tmpvar_5));
    xlat_mutableret1 = max (xlat_mutableret1, (texture (sampler_main, xlat_mutableuv3).xyz * inten_3));
  };
  vec2 tmpvar_7;
  tmpvar_7 = ((uv - 0.5) * aspect.xy);
  float tmpvar_8;
  tmpvar_8 = (1.0/(((6.0 * 
    sqrt(dot (tmpvar_7, tmpvar_7))
  ) + 0.1)));
  vec2 tmpvar_9;
  tmpvar_9.x = (ang / 2.0);
  tmpvar_9.y = tmpvar_8;
  xlat_mutableuv2.x = tmpvar_9.x;
  xlat_mutableuv2.y = (tmpvar_8 + q30);
  xlat_mutablers2 = (cos((xlat_mutableuv2 * 4.0)) + (xlat_mutableret1 * 12.0).xy);
  dots_1 = (clamp ((vec3(0.0, 0.05, 0.45) * tmpvar_8), 0.0, 1.0) + ((
    (0.5 + q22)
   * 
    (1.0 - rad)
  ) * clamp (
    (0.05 / sqrt(dot (xlat_mutablers2, xlat_mutablers2)))
  , 0.0, 1.0)));
  vec3 tmpvar_10;
  tmpvar_10.yz = vec2(0.6, 0.3);
  tmpvar_10.x = (q26 / 2.0);
  vec4 tmpvar_11;
  tmpvar_11.w = 1.0;
  tmpvar_11.xyz = (((xlat_mutableret1 * tmpvar_10) - (
    (2.0 * xlat_mutableret1.x)
   * 
    (1.0 - dots_1)
  )) + ((
    (0.4 * q32)
   * dots_1) * clamp (
    (1.0 - (2.0 * xlat_mutableret1.x))
  , 0.0, 1.0)));
  ret = tmpvar_11.xyz;
 }`,Nn={baseVals:Tn,shapes:En,waves:Dn,init_eqs_str:On,frame_eqs_str:kn,pixel_eqs_str:An,warp:jn,comp:Mn},Pn={rating:2,gammaadj:1.98,decay:.5,echo_zoom:1,echo_alpha:.5,echo_orient:3,wave_mode:7,additivewave:1,wave_thick:1,modwavealphabyvolume:1,wave_brighten:0,darken:1,wave_a:.001,wave_scale:.958,wave_smoothing:.45,modwavealphastart:0,modwavealphaend:1.32,warpanimspeed:1.459,warpscale:2.007,zoom:.9999,warp:.01,sx:.9999,wave_r:0,wave_g:0,wave_b:0,ob_size:0,ob_g:.1,ob_b:1,ob_a:1,ib_size:0,ib_r:0,ib_g:0,ib_b:0,mv_x:25.6,mv_y:9.6,mv_l:0,mv_r:.5,mv_g:.5,mv_b:.5,mv_a:0,b1ed:0},Fn=[{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],In=[{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],Ln=`a.q25=0;a.index=0;a.q12=0;a.q18=0;a.q15=0;a.q29=0;a.q6=0;a.q1=0;a.design=0;a.q5=0;a.trel=0;a.q9=0;a.dec_s=0;a.bright_=0;a.my=0;a.ca=0;a.ang1=0;a.k1=0;a.grad=0;a.sa=0;a.q10=0;a.lastset=0;a.dec_m=0;a.q4=0;a.start=0;a.bright=0;a.q16=0;a.q26=0;a.trig=0;a.mx=0;a.anz=0;a.q19=0;a.beat=0;a.set=0;a.q2=0;a.q27=0;a.q3=0;a.t0=0;a.q32=0;a.grad_=0;a.q7=0;a.q28=0;a.q30=0;a.change=0;a.q8=0;a.design=0;a.n=0;for(var b=a.anz=0;200>b;b++).00001<Math.abs(.00001>Math.abs(a.n-0)?1:0)?(a.anz+=1,a.x=
.09,a.y=.9,a.z=-.5,a.ax=-.11,a.ay=0,a.az=.5,a.zo=1.3,a.su=0,a.br=1,a.lim=4):0,.00001<Math.abs(.00001>Math.abs(a.n-1)?1:0)?(a.anz+=1,a.x=.08,a.y=.9,a.z=-.45,a.ax=-.12,a.ay=0,a.az=.5,a.zo=3,a.su=0,a.br=1.2,a.lim=4):0,.00001<Math.abs(.00001>Math.abs(a.n-2)?1:0)?(a.anz+=1,a.x=.08,a.y=.98,a.z=-.43,a.ax=-.12,a.ay=0,a.az=.5,a.zo=5,a.su=0,a.br=1.2,a.lim=4):0,.00001<Math.abs(.00001>Math.abs(a.n-3)?1:0)?(a.anz+=1,a.x=.08,a.y=.982,a.z=-.43,a.ax=-.12,a.ay=0,a.az=.5,a.zo=15,a.su=0,a.br=1,a.lim=3):0,.00001<Math.abs(.00001>
Math.abs(a.n-4)?1:0)?(a.anz+=1,a.x=.12,a.y=1.002,a.z=-.41,a.ax=-.12,a.ay=0,a.az=.5,a.zo=10,a.su=0,a.br=1,a.lim=4):0,.00001<Math.abs(.00001>Math.abs(a.n-5)?1:0)?(a.anz+=1,a.x=.124,a.y=.993,a.z=-.4,a.ax=-.12,a.ay=0,a.az=.5,a.zo=25,a.su=.95,a.br=.2,a.lim=28):0,.00001<Math.abs(.00001>Math.abs(a.n-6)?1:0)?(a.anz+=1,a.x=.1,a.y=.86,a.z=-.3,a.ax=-0,a.ay=.4,a.az=-0,a.zo=1,a.su=0,a.br=1,a.lim=1.5):0,.00001<Math.abs(.00001>Math.abs(a.n-7)?1:0)?(a.anz+=1,a.x=.1,a.y=.93,a.z=-.34,a.ax=-0,a.ay=.4,a.az=-0,a.zo=2,
a.su=0,a.br=1,a.lim=4):0,.00001<Math.abs(.00001>Math.abs(a.n-8)?1:0)?(a.anz+=1,a.x=.11,a.y=.93,a.z=-.28,a.ax=-0,a.ay=.4,a.az=-0,a.zo=2,a.su=0,a.br=1,a.lim=4):0,.00001<Math.abs(.00001>Math.abs(a.n-9)?1:0)?(a.anz+=1,a.x=0,a.y=.87,a.z=.26,a.ax=.4,a.ay=.04,a.az=-0,a.zo=1,a.su=0,a.br=1,a.lim=20):0,.00001<Math.abs(.00001>Math.abs(a.n-10)?1:0)?(a.anz+=1,a.x=.14,a.y=.87,a.z=.35,a.ax=.4,a.ay=.04,a.az=-0,a.zo=2,a.su=0,a.br=1,a.lim=4):0,.00001<Math.abs(.00001>Math.abs(a.n-11)?1:0)?(a.anz+=1,a.x=-.08,a.y=.87,
a.z=-.33,a.ax=.4,a.ay=.04,a.az=-0,a.zo=1,a.su=0,a.br=1,a.lim=4):0,.00001<Math.abs(.00001>Math.abs(a.n-12)?1:0)?(a.anz+=1,a.x=-.0865,a.y=.884,a.z=-.44,a.ax=.4,a.ay=.04,a.az=-0,a.zo=28,a.su=.3,a.br=.4,a.lim=4):0,.00001<Math.abs(.00001>Math.abs(a.n-13)?1:0)?(a.anz+=1,a.x=-.0842,a.y=.882,a.z=-.44,a.ax=.4,a.ay=.04,a.az=-0,a.zo=48,a.su=0,a.br=.8,a.lim=1.5):0,.00001<Math.abs(.00001>Math.abs(a.n-14)?1:0)?(a.anz+=1,a.x=-.17,a.y=1,a.z=-.08,a.ax=0,a.ay=.04,a.az=-0,a.zo=3,a.su=0,a.br=1,a.lim=4):0,.00001<Math.abs(.00001>
Math.abs(a.n-15)?1:0)?(a.anz+=1,a.x=-.17,a.y=1,a.z=-.06,a.ax=0,a.ay=.04,a.az=-0,a.zo=13,a.su=0,a.br=1,a.lim=1.2):0,.00001<Math.abs(.00001>Math.abs(a.n-16)?1:0)?(a.anz+=1,a.x=-.17,a.y=1,a.z=-.06,a.ax=0,a.ay=.04,a.az=-0,a.zo=23,a.su=0,a.br=1,a.lim=2):0,.00001<Math.abs(.00001>Math.abs(a.n-17)?1:0)?(a.anz+=1,a.x=-.17,a.y=1,a.z=-.056,a.ax=0,a.ay=.04,a.az=-0,a.zo=53,a.su=.82,a.br=1,a.lim=4):0,.00001<Math.abs(.00001>Math.abs(a.n-18)?1:0)?(a.anz+=1,a.x=-.1694,a.y=1,a.z=-.055,a.ax=0,a.ay=.04,a.az=-0,a.zo=
240,a.su=.86,a.br=1,a.lim=4):0,.00001<Math.abs(.00001>Math.abs(a.n-19)?1:0)?(a.anz+=1,a.x=-.12,a.y=1.06,a.z=-.049,a.ax=0,a.ay=.04,a.az=-0,a.zo=120,a.su=.86,a.br=1,a.lim=10):0,.00001<Math.abs(.00001>Math.abs(a.n-20)?1:0)?(a.anz+=1,a.x=.108,a.y=1.015,a.z=-.05,a.ax=0,a.ay=.04,a.az=-.03,a.zo=4,a.su=.2,a.br=.3,a.lim=.5):0,.00001<Math.abs(.00001>Math.abs(a.n-21)?1:0)?(a.anz+=1,a.x=.15,a.y=1,a.z=-.25,a.ax=0,a.ay=.2,a.az=.2,a.zo=1.5,a.su=.1,a.br=1.2,a.lim=3):0,a.gmegabuf[Math.floor(20*a.n)]=a.x,a.gmegabuf[Math.floor(20*
a.n+1)]=-a.y,a.gmegabuf[Math.floor(20*a.n+2)]=a.z,a.gmegabuf[Math.floor(20*a.n+3)]=-a.ax,a.gmegabuf[Math.floor(20*a.n+4)]=a.ay,a.gmegabuf[Math.floor(20*a.n+5)]=a.az,a.gmegabuf[Math.floor(20*a.n+6)]=a.zo,a.gmegabuf[Math.floor(20*a.n+7)]=a.su,a.gmegabuf[Math.floor(20*a.n+8)]=a.br,a.gmegabuf[Math.floor(20*a.n+9)]=a.lim,a.n+=1;a.start=1;a.index=Math.floor(randint(a.anz-1));a.lastset=a.anz-1;a.rseed=div(randint(100),100);a.t0=0;a.trel=0;`,Rn=`a.dec_m=pow(.8,div(30,a.fps));a.dec_s=pow(.97,div(30,a.fps));a.beat=Math.max(Math.max(a.bass,a.mid),a.treb);a.trel+=div(.04*a.beat,a.fps);a.trig=(a.trel>Math.floor(a.t0)+1||a.start)&&.00001>Math.abs(a.design-0)?1:0;a.index+=a.trig;.00001<Math.abs(a.trig)?a.t0=a.trel:0;a.change=Math.max(0,1-Math.abs(a.trel-Math.floor(a.trel)));a.change=1-2*Math.min(a.trel-Math.floor(a.trel),Math.floor(a.trel+1)-a.trel);a.change=pow(Math.max(0,5*a.change-4),2);a.q12=a.change;a.set=mod(a.index,
a.anz);.00001<Math.abs(a.design)?a.set=a.lastset:0;a.q4=a.gmegabuf[Math.floor(20*a.set)];a.q5=a.gmegabuf[Math.floor(20*a.set+1)];a.q6=a.gmegabuf[Math.floor(20*a.set+2)];a.q1=a.gmegabuf[Math.floor(20*a.set+3)];a.q2=a.gmegabuf[Math.floor(20*a.set+4)];a.q3=a.gmegabuf[Math.floor(20*a.set+5)];a.q7=a.gmegabuf[Math.floor(20*a.set+6)];a.q8=a.gmegabuf[Math.floor(20*a.set+7)];a.q9=a.gmegabuf[Math.floor(20*a.set+8)];a.q10=a.gmegabuf[Math.floor(20*a.set+9)];a.bright=.00001<Math.abs(a.trig)?div(randint(100),120):
a.bright;a.bright_=a.bright_*a.dec_s+(1-a.dec_s)*pow(a.bright,1);a.q18=a.bright_;a.grad=.00001<Math.abs(a.trig)?div(randint(100),100):a.grad;a.grad_=a.grad_*a.dec_s+(1-a.dec_s)*a.grad;a.q19=a.grad_;a.ang1=.00001<Math.abs(a.trig)?randint(100):a.ang1;a.ca=a.ca*a.dec_s+(1-a.dec_s)*Math.cos(a.ang1);a.sa=a.sa*a.dec_s+(1-a.dec_s)*Math.sin(1*a.ang1);a.q15=a.ca;a.q16=a.sa;a.mx=div(Math.sin(.00714*a.time),2);a.my=div(Math.sin(.00433*a.time),4)-.25;a.q25=a.mx;a.q26=a.my;a.q27=.4;a.q28=.55;a.q29=1;a.q30=a.design;
a.q32=Math.max(0,Math.sin(6*a.time));a.start=0;a.monitor=a.aspecty;`,zn=`a.k1=1;a.warp=0;a.zoom=1;a.dx=0;a.dy=0;a.rot=0;`,Bn=`float sustain;
float tic8;
float iter;
float xlat_mutabledist;
float xlat_mutablestruc;
vec2 xlat_mutableuv1;
vec3 xlat_mutableuv2;
 shader_body { 
  vec2 tmpvar_1;
  tmpvar_1.x = q15;
  tmpvar_1.y = q16;
  mat3 tmpvar_2;
  float tmpvar_3;
  tmpvar_3 = sin(q1);
  float tmpvar_4;
  tmpvar_4 = cos(q3);
  float tmpvar_5;
  tmpvar_5 = cos(q1);
  float tmpvar_6;
  tmpvar_6 = cos(q2);
  float tmpvar_7;
  tmpvar_7 = sin(q3);
  tmpvar_2[uint(0)].x = ((tmpvar_5 * tmpvar_4) - ((tmpvar_3 * tmpvar_6) * tmpvar_7));
  tmpvar_2[uint(0)].y = ((tmpvar_3 * tmpvar_4) + ((tmpvar_5 * tmpvar_6) * tmpvar_7));
  float tmpvar_8;
  tmpvar_8 = sin(q2);
  tmpvar_2[uint(0)].z = (tmpvar_8 * tmpvar_7);
  tmpvar_2[1u].x = ((-(tmpvar_5) * tmpvar_7) - ((tmpvar_3 * tmpvar_6) * tmpvar_4));
  tmpvar_2[1u].y = (((tmpvar_5 * tmpvar_6) * tmpvar_4) - (tmpvar_3 * tmpvar_7));
  tmpvar_2[1u].z = (tmpvar_8 * tmpvar_4);
  tmpvar_2[2u].x = (tmpvar_3 * tmpvar_8);
  tmpvar_2[2u].y = (-(tmpvar_5) * tmpvar_8);
  tmpvar_2[2u].z = tmpvar_6;
  vec3 tmpvar_9;
  tmpvar_9.x = q4;
  tmpvar_9.y = q5;
  tmpvar_9.z = q6;
  vec3 tmpvar_10;
  tmpvar_10 = cos((vec3(1.5708, 4.7124, 7.854) * q8));
  sustain = (0.985 - (q12 * 0.05));
  tic8 = (0.003921569 + (q12 * 0.02));
  iter = (6.0 + float((q7 >= 50.0)));
  vec3 ret_11;
  xlat_mutableuv1 = ((uv_orig - 0.5) * aspect.xy);
  vec4 tmpvar_12;
  tmpvar_12 = fract((8.0 * texture (sampler_noise_lq, (
    (4.0 * uv_orig)
   + rand_frame.yz))));
  vec3 tmpvar_13;
  tmpvar_13 = tmpvar_12.xyz;
  vec3 tmpvar_14;
  tmpvar_14 = (tmpvar_12.xyz - 0.5);
  float tmpvar_15;
  tmpvar_15 = float((tmpvar_12.y < 0.2));
  if (!(bool(tmpvar_15))) {
    vec2 pix_16;
    vec2 nb2_17;
    vec2 nb_18;
    pix_16 = (texsize.zw * ((2.0 * 
      vec4(greaterThanEqual (texture (sampler_pw_noise_lq, (uv_orig + rand_frame.xy)), vec4(0.5, 0.5, 0.5, 0.5)))
    ) - 1.0).xy);
    vec2 tmpvar_19;
    tmpvar_19 = (0.0078125 * floor((
      (128.0 * texture (sampler_pc_main, (uv_orig + pix_16)).yz)
     + vec2(0.5, 0.5))));
    nb_18.x = ((1.003945 - tmpvar_19.y) - (0.0078125 * tmpvar_19.x));
    vec2 tmpvar_20;
    tmpvar_20 = (0.0078125 * floor((
      (128.0 * texture (sampler_pc_main, (uv_orig + (pix_16 * vec2(1.0, -1.0)))).yz)
     + vec2(0.5, 0.5))));
    nb_18.y = ((1.003945 - tmpvar_20.y) - (0.0078125 * tmpvar_20.x));
    vec2 tmpvar_21;
    tmpvar_21 = (0.0078125 * floor((
      (128.0 * texture (sampler_pc_main, (uv_orig + (pix_16 * vec2(0.0, 1.0)))).yz)
     + vec2(0.5, 0.5))));
    nb2_17.x = ((1.003945 - tmpvar_21.y) - (0.0078125 * tmpvar_21.x));
    vec2 tmpvar_22;
    tmpvar_22 = (0.0078125 * floor((
      (128.0 * texture (sampler_pc_main, (uv_orig + (pix_16 * vec2(1.0, 0.0)))).yz)
     + vec2(0.5, 0.5))));
    nb2_17.y = ((1.003945 - tmpvar_22.y) - (0.0078125 * tmpvar_22.x));
    vec2 tmpvar_23;
    tmpvar_23 = min (nb_18, nb2_17);
    nb_18 = tmpvar_23;
    xlat_mutabledist = (min (tmpvar_23.x, tmpvar_23.y) + ((0.003 * tmpvar_14.x) * abs(tmpvar_14.y)));
  } else {
    xlat_mutabledist = tmpvar_13.x;
  };
  vec2 tmpvar_24;
  tmpvar_24 = (0.0078125 * floor((
    (128.0 * texture (sampler_pc_main, uv_orig).yz)
   + vec2(0.5, 0.5))));
  float tmpvar_25;
  tmpvar_25 = min (xlat_mutabledist, ((1.003945 - tmpvar_24.y) - (0.0078125 * tmpvar_24.x)));
  xlat_mutabledist = tmpvar_25;
  vec3 tmpvar_26;
  tmpvar_26.xy = (xlat_mutableuv1 * tmpvar_25);
  tmpvar_26.z = (tmpvar_25 - 0.25);
  xlat_mutableuv2 = ((tmpvar_26 / q7) + tmpvar_9);
  vec3 uvi_27;
  uvi_27 = xlat_mutableuv2;
  float rxy2_29;
  vec3 tmp_30;
  vec3 zz_31;
  zz_31 = (xlat_mutableuv2 * tmpvar_2);
  for (int n_28 = 1; float(n_28) <= iter; n_28++) {
    vec3 tmpvar_32;
    tmpvar_32 = (zz_31 * zz_31);
    vec3 tmpvar_33;
    tmpvar_33 = (tmpvar_32 * tmpvar_32);
    vec3 tmpvar_34;
    tmpvar_34 = pow (tmpvar_32, vec3(3.0, 3.0, 3.0));
    rxy2_29 = (tmpvar_32.x + tmpvar_32.y);
    float tmpvar_35;
    tmpvar_35 = (rxy2_29 * rxy2_29);
    float tmpvar_36;
    tmpvar_36 = pow (rxy2_29, 3.0);
    tmp_30.x = (((
      (-7.0 * tmpvar_34.y)
     + tmpvar_34.x) - (
      (21.0 * tmpvar_33.x)
     * tmpvar_32.y)) + ((35.0 * tmpvar_32.x) * tmpvar_33.y));
    tmp_30.y = (((
      -(tmpvar_34.y)
     + 
      (7.0 * tmpvar_34.x)
    ) - (
      (35.0 * tmpvar_33.x)
     * tmpvar_32.y)) + ((21.0 * tmpvar_32.x) * tmpvar_33.y));
    tmp_30.z = (((
      (-21.0 * tmpvar_33.z)
     * rxy2_29) + (
      (35.0 * tmpvar_32.z)
     * tmpvar_35)) - (7.0 * tmpvar_36));
    tmp_30.xy = (tmp_30.xy * (1.0 + (
      (((-7.0 * tmpvar_34.z) + ((35.0 * tmpvar_33.z) * rxy2_29)) - ((21.0 * tmpvar_32.z) * tmpvar_35))
     / tmpvar_36)));
    tmp_30 = (tmp_30 * zz_31);
    zz_31 = (tmp_30 + uvi_27);
  };
  float tmpvar_37;
  vec3 x_38;
  x_38 = (zz_31 * tmpvar_10);
  tmpvar_37 = sqrt(dot (x_38, x_38));
  vec2 x_39;
  x_39 = (zz_31.xy - zz_31.z);
  xlat_mutablestruc = ((sqrt(
    dot (x_39, x_39)
  ) / q10) * q9);
  vec2 tmpvar_40;
  tmpvar_40 = (0.1 * (xlat_mutableuv1 - tmpvar_1));
  vec2 tmpvar_41;
  tmpvar_41 = (0.0078125 * floor((
    (128.0 * texture (sampler_pc_main, ((uv_orig - tmpvar_40) + (0.005 * tmpvar_14).xy)).yz)
   + vec2(0.5, 0.5))));
  vec2 tmpvar_42;
  tmpvar_42 = (0.0078125 * floor((
    (128.0 * texture (sampler_pc_main, uv_orig).yz)
   + vec2(0.5, 0.5))));
  xlat_mutablestruc = (xlat_mutablestruc * (1.0 - (
    float((((1.003945 - tmpvar_41.y) - (0.0078125 * tmpvar_41.x)) < ((
      (1.003945 - tmpvar_42.y)
     - 
      (0.0078125 * tmpvar_42.x)
    ) - sqrt(
      dot (tmpvar_40, tmpvar_40)
    ))))
   * 0.75)));
  if ((tmpvar_37 <= (q10 + 0.1))) {
    ret_11.x = mix (xlat_mutablestruc, texture (sampler_main, uv_orig).x, sustain);
    vec2 tmpvar_43;
    tmpvar_43 = (0.0078125 * floor((
      (128.0 * vec2((1.0 - tmpvar_25)))
     + vec2(0.5, 0.5))));
    vec2 tmpvar_44;
    tmpvar_44.x = ((128.0 * (
      (1.0 - tmpvar_25)
     - tmpvar_43.x)) + 0.495);
    tmpvar_44.y = tmpvar_43.x;
    ret_11.yz = tmpvar_44;
  } else {
    ret_11 = ((texture (sampler_fc_main, uv_orig) * sustain).xyz - vec3(tic8));
  };
  if (bool(tmpvar_15)) {
    ret_11.x = texture (sampler_main, uv_orig).x;
  };
  vec4 tmpvar_45;
  tmpvar_45.w = 1.0;
  tmpvar_45.xyz = ret_11;
  ret = tmpvar_45.xyz;
 }`,Vn=` shader_body { 
  vec3 tmpvar_1;
  tmpvar_1.x = q27;
  tmpvar_1.y = q28;
  tmpvar_1.z = q29;
  vec2 tmpvar_2;
  tmpvar_2.x = q15;
  tmpvar_2.y = q16;
  float struc_3;
  vec3 ret_4;
  float tmpvar_5;
  vec2 tmpvar_6;
  tmpvar_6 = (0.0078125 * floor((
    (128.0 * texture (sampler_pc_main, uv).yz)
   + vec2(0.5, 0.5))));
  tmpvar_5 = ((1.003945 - tmpvar_6.y) - (0.0078125 * tmpvar_6.x));
  vec2 tmpvar_7;
  vec4 tmpvar_8;
  tmpvar_8 = texture (sampler_blur1, uv);
  tmpvar_7 = (0.0078125 * floor((
    (128.0 * ((tmpvar_8.xyz * scale1) + bias1).yz)
   + vec2(0.5, 0.5))));
  float tmpvar_9;
  tmpvar_9 = mix (((1.003945 - tmpvar_7.y) - (0.0078125 * tmpvar_7.x)), tmpvar_5, 0.5);
  vec2 tmpvar_10;
  tmpvar_10 = (0.0078125 * floor((
    (128.0 * ((tmpvar_8.xyz * scale1) + bias1).yz)
   + vec2(0.5, 0.5))));
  vec2 x_11;
  x_11 = (((uv - 0.5) * aspect.xy) - tmpvar_2);
  float tmpvar_12;
  tmpvar_12 = ((1.0 - (0.5 * 
    sqrt(dot (x_11, x_11))
  )) * (1.0 - (q12 * 0.75)));
  vec3 tmpvar_13;
  tmpvar_13.xy = uv;
  tmpvar_13.z = (0.2 * time);
  float tmpvar_14;
  bool tmpvar_15;
  tmpvar_15 = (q30 == 0.0);
  tmpvar_14 = (tmpvar_9 - ((texture (sampler_noisevol_hq, tmpvar_13) / 2.0) * float(tmpvar_15))).x;
  struc_3 = ((mix (texture (sampler_main, uv).x, 
    ((tmpvar_8.xyz * scale1) + bias1)
  .x, 
    (abs(((
      (1.003945 - tmpvar_10.y)
     - 
      (0.0078125 * tmpvar_10.x)
    ) - 0.25)) * (max (0.2, exp(
      (-5.0 / q7)
    )) * 1.5))
  ) * (1.0 - 
    (tmpvar_9 * 0.75)
  )) * ((
    pow (tmpvar_12, ((2.0 * float(tmpvar_15)) * (1.0 - tmpvar_14)))
   * 
    (1.0 - tmpvar_14)
  ) * (1.0 + 
    float(tmpvar_15)
  )));
  float tmpvar_16;
  tmpvar_16 = mix (uv.y, (1.0 - uv.x), q19);
  vec2 tmpvar_17;
  tmpvar_17.y = 0.0;
  tmpvar_17.x = (time * 0.01);
  vec3 tmpvar_18;
  tmpvar_18 = pow (vec3(struc_3), tmpvar_1);
  ret_4 = mix (tmpvar_18, ((
    (tmpvar_16 * (vec3(0.4, 0.6, 0.9) + (0.6 * (rand_preset - 0.5)).xyz))
   * q18) + (
    (0.2 * (tmpvar_16 * texture (sampler_noise_hq, ((uv * vec2(0.1, 0.5)) + tmpvar_17)).x))
   * q18)), vec3(pow (tmpvar_9, 1.6)));
  if ((q30 == 1.0)) {
    ret_4 = tmpvar_18;
  };
  if ((q30 == 2.0)) {
    vec3 tmpvar_19;
    tmpvar_19.x = tmpvar_5;
    tmpvar_19.y = abs((tmpvar_5 - 0.25));
    tmpvar_19.z = (1.0 - tmpvar_5);
    ret_4 = (vec3(mix (struc_3, 0.1, tmpvar_9)) * (0.6 + exp2(
      (-20.0 * tmpvar_19)
    )));
    ret_4 = (ret_4 + ((
      clamp ((0.002 / abs((rad - 0.1))), 0.0, 1.0)
     * 0.2) * q32));
  };
  if ((q30 == 0.0)) {
    ret_4 = (ret_4 + (pow (tmpvar_12, 4.0) * 0.5));
  };
  vec4 tmpvar_20;
  tmpvar_20.w = 1.0;
  tmpvar_20.xyz = ret_4;
  ret = tmpvar_20.xyz;
 }`,Hn={baseVals:Pn,shapes:Fn,waves:In,init_eqs_str:Ln,frame_eqs_str:Rn,pixel_eqs_str:zn,warp:Bn,comp:Vn},Un={rating:0,gammaadj:1.980001,decay:.5,echo_zoom:.999998,echo_alpha:.5,echo_orient:3,wave_mode:6,modwavealphabyvolume:1,darken:1,wave_a:.001,wave_scale:1.740853,wave_smoothing:.81,modwavealphastart:.37,modwavealphaend:1.32,warpanimspeed:1.4595,warpscale:2.0067,zoom:.9999,warp:.01,sx:.9999,wave_r:.8,wave_g:.59,wave_b:.5,ob_size:0,ob_r:1,ob_a:1,ib_size:.26,mv_x:64,mv_y:48,mv_l:1.85,mv_r:.4999,mv_g:.4999,mv_b:.4999,mv_a:0,b1ed:0},Wn=[{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],Gn=[{baseVals:{enabled:0}},{baseVals:{enabled:1,sep:20,spectrum:1,usedots:1,thick:1,additive:1,scaling:5.904606,smoothing:0,a:.1},init_eqs_str:`a.val=0;`,frame_eqs_str:``,point_eqs_str:`a.x=a.sample;a.val=a.value1;a.y=a.val*(.25-(a.sample-.5)*(a.sample-.5))+.5;a.r=.6;a.g=1;a.b=1;a.a=1;`},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],Kn=`a.index2=0;a.index4=0;a.index=0;a.q22=0;a.q21=0;a.q29=0;a.movex=0;a.q1=0;a.dec_med=0;a.q5=0;a.index3=0;a.rott=0;a.is_beat=0;a.q23=0;a.k1=0;a.q24=0;a.dec_slow=0;a.q4=0;a.q26=0;a.p2=0;a.avg=0;a.movez=0;a.beat=0;a.vol=0;a.p1=0;a.peak=0;a.q2=0;a.q27=0;a.p3=0;a.q3=0;a.t0=0;a.q28=0;a.q30=0;a.q20=0;`,qn=`a.dec_med=pow(.9,div(30,a.fps));a.dec_slow=pow(.94,div(30,a.fps));a.beat=Math.max(Math.max(a.bass,a.mid),a.treb);a.avg=a.avg*a.dec_slow+a.beat*(1-a.dec_slow);a.is_beat=above(a.beat,.5+a.avg+a.peak)*above(a.time,a.t0+.2);a.t0=a.is_beat*a.time+(1-a.is_beat)*a.t0;a.peak=a.is_beat*a.beat+(1-a.is_beat)*a.peak*a.dec_med;a.index=mod(a.index+a.is_beat,8);a.index2=mod(a.index2+a.is_beat*bnot(a.index),2);a.index3=mod(a.index3+a.is_beat*bnot(a.index)*bnot(a.index2),3);a.monitor=a.index4;
a.q20=a.avg;a.q21=a.beat;a.q22=a.peak;a.q23=a.index;a.q24=a.is_beat;a.vol=a.bass+a.mid+a.treb;a.q26=div(Math.max(a.peak,10),20);a.k1=a.is_beat*equal(a.index,0);a.p1=a.k1*(a.p1+1)+(1-a.k1)*a.p1;a.p2=a.dec_med*a.p2+(1-a.dec_med)*a.p1;a.p3=a.dec_slow*a.p3+(1-a.dec_slow)*a.p2;a.rott=div(3.14159265359*a.p3,4);a.q1=Math.cos(a.rott);a.q2=Math.sin(a.rott);a.q3=-a.q2;a.q4=a.q1;a.q27=8-a.index;a.q28=a.index2;a.movez+=div(.6,a.fps);a.q29=1*a.movez;a.movex+=div(.12,a.fps)*a.q1;a.q30=1*a.movex;a.q5=a.rott;a.zoom=
1;`,Jn=`a.rot=div(a.q22,4)-1;a.rot=0;a.zoom=1+.02*(1-a.rad);a.dy=.001;a.warp=.4*(1-a.rad);`,Yn=` shader_body { 
  vec2 zz_1;
  mat2 tmpvar_2;
  tmpvar_2[uint(0)] = _qa.xy;
  tmpvar_2[1u] = _qa.zw;
  zz_1 = (((
    (uv - vec2(0.5, 0.5))
   * texsize.xy) * 0.01) * tmpvar_2);
  zz_1 = zz_1.yx;
  vec4 tmpvar_3;
  tmpvar_3.w = 1.0;
  tmpvar_3.xyz = (texture (sampler_main, (uv + (
    (cos(zz_1) * texsize.zw)
   * 12.0))).xyz - 0.01);
  ret = tmpvar_3.xyz;
 }`,Xn=`vec2 xlat_mutabledz;
vec3 xlat_mutableret1;
vec2 xlat_mutableuv3;
vec2 xlat_mutableuv4;
 shader_body { 
  vec2 uv_1;
  float inten_2;
  float dist_3;
  vec2 ver_4;
  vec2 hor_5;
  vec3 ret_6;
  uv_1 = (uv - 0.5);
  vec2 tmpvar_7;
  tmpvar_7.y = 0.0;
  tmpvar_7.x = texsize.z;
  hor_5 = (tmpvar_7 / 2.0);
  vec2 tmpvar_8;
  tmpvar_8.x = 0.0;
  tmpvar_8.y = texsize.w;
  ver_4 = (tmpvar_8 / 2.0);
  float tmpvar_9;
  tmpvar_9 = (time / 2.0);
  dist_3 = (1.0 - fract(tmpvar_9));
  inten_2 = ((sqrt(dist_3) * (1.0 - 
    (dist_3 * dist_3)
  )) * 2.0);
  vec2 tmpvar_10;
  tmpvar_10.y = 0.0;
  tmpvar_10.x = q30;
  xlat_mutableuv3 = (((
    (2.0 * uv_1)
   * dist_3) + 0.35) + tmpvar_10);
  xlat_mutabledz.x = (inten_2 * (texture (sampler_main, (xlat_mutableuv3 + hor_5)).xyz - texture (sampler_main, (xlat_mutableuv3 - hor_5)).xyz)).x;
  xlat_mutabledz.y = (inten_2 * (texture (sampler_main, (xlat_mutableuv3 + ver_4)).xyz - texture (sampler_main, (xlat_mutableuv3 - ver_4)).xyz)).x;
  xlat_mutableret1 = max (vec3(0.0, 0.0, 0.0), (texture (sampler_main, xlat_mutableuv3).xyz * inten_2));
  dist_3 = (1.0 - fract((0.25 + tmpvar_9)));
  inten_2 = ((sqrt(dist_3) * (1.0 - 
    (dist_3 * dist_3)
  )) * 2.0);
  vec2 tmpvar_11;
  tmpvar_11.y = 0.0;
  tmpvar_11.x = q30;
  xlat_mutableuv3 = (((
    (2.0 * uv_1)
   * dist_3) + 0.35) + tmpvar_11);
  xlat_mutabledz.x = (xlat_mutabledz.x + (inten_2 * (texture (sampler_main, 
    (xlat_mutableuv3 + hor_5)
  ).xyz - texture (sampler_main, 
    (xlat_mutableuv3 - hor_5)
  ).xyz)).x);
  xlat_mutabledz.y = (xlat_mutabledz.y + (inten_2 * (texture (sampler_main, 
    (xlat_mutableuv3 + ver_4)
  ).xyz - texture (sampler_main, 
    (xlat_mutableuv3 - ver_4)
  ).xyz)).x);
  xlat_mutableret1 = max (xlat_mutableret1, (texture (sampler_main, xlat_mutableuv3).xyz * inten_2));
  dist_3 = (1.0 - fract((0.5 + tmpvar_9)));
  inten_2 = ((sqrt(dist_3) * (1.0 - 
    (dist_3 * dist_3)
  )) * 2.0);
  vec2 tmpvar_12;
  tmpvar_12.y = 0.0;
  tmpvar_12.x = q30;
  xlat_mutableuv3 = (((
    (2.0 * uv_1)
   * dist_3) + 0.35) + tmpvar_12);
  xlat_mutabledz.x = (xlat_mutabledz.x + (inten_2 * (texture (sampler_main, 
    (xlat_mutableuv3 + hor_5)
  ).xyz - texture (sampler_main, 
    (xlat_mutableuv3 - hor_5)
  ).xyz)).x);
  xlat_mutabledz.y = (xlat_mutabledz.y + (inten_2 * (texture (sampler_main, 
    (xlat_mutableuv3 + ver_4)
  ).xyz - texture (sampler_main, 
    (xlat_mutableuv3 - ver_4)
  ).xyz)).x);
  xlat_mutableret1 = max (xlat_mutableret1, (texture (sampler_main, xlat_mutableuv3).xyz * inten_2));
  dist_3 = (1.0 - fract((0.75 + tmpvar_9)));
  inten_2 = ((sqrt(dist_3) * (1.0 - 
    (dist_3 * dist_3)
  )) * 2.0);
  vec2 tmpvar_13;
  tmpvar_13.y = 0.0;
  tmpvar_13.x = q30;
  xlat_mutableuv3 = (((
    (2.0 * uv_1)
   * dist_3) + 0.35) + tmpvar_13);
  xlat_mutabledz.x = (xlat_mutabledz.x + (inten_2 * (texture (sampler_main, 
    (xlat_mutableuv3 + hor_5)
  ).xyz - texture (sampler_main, 
    (xlat_mutableuv3 - hor_5)
  ).xyz)).x);
  xlat_mutabledz.y = (xlat_mutabledz.y + (inten_2 * (texture (sampler_main, 
    (xlat_mutableuv3 + ver_4)
  ).xyz - texture (sampler_main, 
    (xlat_mutableuv3 - ver_4)
  ).xyz)).x);
  xlat_mutableret1 = max (xlat_mutableret1, (texture (sampler_main, xlat_mutableuv3).xyz * inten_2));
  dist_3 = (1.0 - fract((1.0 + tmpvar_9)));
  inten_2 = ((sqrt(dist_3) * (1.0 - 
    (dist_3 * dist_3)
  )) * 2.0);
  vec2 tmpvar_14;
  tmpvar_14.y = 0.0;
  tmpvar_14.x = q30;
  xlat_mutableuv3 = (((
    (2.0 * uv_1)
   * dist_3) + 0.35) + tmpvar_14);
  xlat_mutabledz.x = (xlat_mutabledz.x + (inten_2 * (texture (sampler_main, 
    (xlat_mutableuv3 + hor_5)
  ).xyz - texture (sampler_main, 
    (xlat_mutableuv3 - hor_5)
  ).xyz)).x);
  xlat_mutabledz.y = (xlat_mutabledz.y + (inten_2 * (texture (sampler_main, 
    (xlat_mutableuv3 + ver_4)
  ).xyz - texture (sampler_main, 
    (xlat_mutableuv3 - ver_4)
  ).xyz)).x);
  xlat_mutableret1 = max (xlat_mutableret1, (texture (sampler_main, xlat_mutableuv3).xyz * inten_2));
  uv_1 = (uv_1 + (xlat_mutabledz / 2.0));
  xlat_mutableuv4 = (uv_1 - vec2(0.2, -0.1));
  float tmpvar_15;
  tmpvar_15 = (0.5 * clamp ((1.0/(
    (abs(uv_1.y) + 0.1)
  )), 0.0, 12.0));
  vec2 tmpvar_16;
  tmpvar_16.x = (uv_1.x * tmpvar_15);
  tmpvar_16.y = tmpvar_15;
  vec3 tmpvar_17;
  tmpvar_17.xy = vec2(0.0, 0.0);
  tmpvar_17.z = clamp ((1.0 - (3.0 * uv_1.y)), 0.0, 1.0);
  ret_6 = (vec3(0.0, 0.03, 0.03) + (0.1 * tmpvar_17));
  ret_6 = (ret_6 + (vec3(dot (texture (sampler_noise_hq, 
    (tmpvar_16 + (0.04 * time))
  ), vec4(0.32, 0.49, 0.29, 0.0))) * (
    (clamp ((1.0 - (12.0 * uv_1.y)), 0.0, 1.0) * 0.1)
   / 
    (0.03 + sqrt(dot (xlat_mutableuv4, xlat_mutableuv4)))
  )));
  ret_6 = (ret_6 + ((0.1 * xlat_mutableret1) + (
    (0.2 * q21)
   * xlat_mutableret1)));
  vec4 tmpvar_18;
  tmpvar_18.w = 1.0;
  tmpvar_18.xyz = ret_6;
  ret = tmpvar_18.xyz;
 }`,Zn={baseVals:Un,shapes:Wn,waves:Gn,init_eqs_str:Kn,frame_eqs_str:qn,pixel_eqs_str:Jn,warp:Yn,comp:Xn},Qn={rating:0,gammaadj:1.980001,decay:.5,echo_zoom:.999998,echo_alpha:.5,echo_orient:3,wave_mode:1,additivewave:1,wave_thick:1,modwavealphabyvolume:1,wave_brighten:0,darken:1,wave_a:.001,wave_scale:.167975,wave_smoothing:0,wave_mystery:-.2,modwavealphastart:.71,modwavealphaend:1.3,warpanimspeed:1.4595,warpscale:2.0067,zoom:.9999,warp:.01,sx:.9999,wave_r:0,wave_g:0,wave_b:0,ob_size:0,ob_a:1,ib_size:.26,mv_x:31.999998,mv_y:24.000004,mv_l:.5,mv_r:.2999,mv_g:.4999,mv_b:.3999,mv_a:0,b1ed:.7},$n=[{baseVals:{enabled:1,sides:3,textured:1,y:.13,rad:1.504994,tex_zoom:.459514,r2:1,g2:0,border_r:.7,border_g:0,border_b:0,border_a:0},init_eqs_str:``,frame_eqs_str:``},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],er=[{baseVals:{enabled:1,samples:247,sep:9,usedots:1,additive:1,scaling:.067077,smoothing:.82,r:0,b:.5},init_eqs_str:`a.t1=0;a.t2=0;a.k1=0;a.k2=0;a.mod=0;a.t3=0;a.t1=1+.3*(.01*randint(101)-.01*randint(101));a.t2=1+.3*(.01*randint(101)-.01*randint(101));a.t3=1+.3*(.01*randint(101)-.01*randint(101));a.t4=1+.3*(.01*randint(101)-.01*randint(101));a.t5=1+.3*(.01*randint(101)-.01*randint(101));a.t6=1+.3*(.01*randint(101)-.01*randint(101));a.t7=1+.3*(.01*randint(101)-.01*randint(101));a.t8=1+.3*(.01*randint(101)-.01*randint(101));`,frame_eqs_str:`a.t1=1;a.t3=Math.sin(div(a.time,2));a.t3=Math.max(a.t3,0);a.t3=4.9*Math.min(a.t3,.2);`,point_eqs_str:`a.t1=mod(67*a.t1+37,4096);a.t2=div(a.t1,4096);a.k1=mod(100*a.sample+2*a.time,2);a.k2=mod(100*a.sample+5*a.time,2);a.x=.49+.48*Math.sin(31*a.sample+div(a.t2*a.time,27));a.y=.2*a.t2+.2*Math.sin(131*a.sample+div(a.t2*a.time,37));a.mod=Math.sin(600*a.sample+.4*a.time);a.mod=Math.max(a.mod,0);a.mod=3*Math.min(a.mod,.33);a.a=1;a.r=.02;a.b=.6*a.mod;a.g=a.mod*(.7+div(a.t2,4));`},{baseVals:{enabled:1,scaling:.891519,smoothing:.82,a:.1},init_eqs_str:`a.t1=0;a.px=0;a.t2=0;a.py=0;a.k1=0;`,frame_eqs_str:`a.t1=1;a.t2=7;`,point_eqs_str:`a.r=.31;a.b=0;a.g=0;a.a=1;a.t1=mod(67*a.t1+37,4096);a.px=div(a.t1-2047,4096);a.t2=mod(67*a.t2+37,4096);a.py=div(a.t2-0,4096);a.k1=mod(100*a.sample,8);a.y=div(a.py,3.5)+0;a.a=below(a.y,.2);a.x=.5+.4*Math.sin(26*a.sample);`},{baseVals:{enabled:1,samples:100,scaling:.01,smoothing:.82,a:.1},init_eqs_str:`a.t5=0;a.t1=0;a.bird=0;a.y0=0;a.dx=0;a.t3=0;a.ground=0;a.k1=0;a.t6=0;a.f1=0;a.trig=0;a.dy=0;a.t2=0;a.t4=0;`,frame_eqs_str:`a.t1=Math.sin(3*a.time);a.t2=Math.cos(3*a.time);a.t3=Math.sin(div(a.time,3));a.t4=Math.cos(div(a.time,3));a.t5=Math.cos(div(a.time,4));a.ground=below(a.t5,-.9);a.trig=below(randint(100),1);a.trig=a.trig*bnot(a.ground)*bnot(a.bird);a.bird*=bnot(a.ground);a.bird=bnot(a.bird)*a.trig;a.t6=a.bird;`,point_eqs_str:`a.r=1;a.g=0;a.b=0;a.k1=below(a.sample,.5);a.dx=.02*a.k1*Math.sin(50*a.sample);a.f1=sqr(a.dx);a.dy=20*a.f1*a.t1+div(a.t2,150);a.dy+=.004*(1-a.k1)*Math.sin(50*a.sample);a.x=a.dx+.5+.1*a.t3;a.dy+=.2*a.dx*a.t4;a.y0+=div(a.time,7);a.y0-=Math.floor(a.y0);a.y0=a.t5;a.y=a.dy+.7+div(a.y0,8);a.a=.04;`},{baseVals:{enabled:0}}],tr=`a.index=0;a.q22=0;a.q21=0;a.q29=0;a.dec_med=0;a.movz=0;a.movx=0;a.rott=0;a.is_beat=0;a.q23=0;a.k1=0;a.q24=0;a.dec_slow=0;a.q26=0;a.p2=0;a.avg=0;a.beat=0;a.p1=0;a.peak=0;a.q27=0;a.p3=0;a.t0=0;a.q28=0;a.q30=0;a.q20=0;a.q28=0;a.q29=0;a.p1=0;`,$=`a.dec_med=pow(.9,div(30,a.fps));a.dec_slow=pow(.99,div(30,a.fps));a.beat=Math.max(Math.max(a.bass,a.mid),a.treb);a.avg=a.avg*a.dec_slow+a.beat*(1-a.dec_slow);a.is_beat=above(a.beat,.5+a.avg+a.peak)*above(a.time,a.t0+.2);a.t0=a.is_beat*a.time+(1-a.is_beat)*a.t0;a.peak=a.is_beat*a.beat+(1-a.is_beat)*a.peak*a.dec_med;a.index=mod(a.index+a.is_beat,8);a.q20=a.avg;a.q21=a.beat;a.q22=a.peak;a.q23=a.index;a.q24=a.is_beat;a.q26=a.bass+a.mid+a.treb;a.k1=a.is_beat*equal(a.index,0);a.p1=
a.k1*(a.p1+1)+(1-a.k1)*a.p1;a.p2=a.dec_med*a.p2+(1-a.dec_med)*a.p1;a.p3=a.dec_med*a.p3+(1-a.dec_med)*a.p2;a.rott=div(3.1416*a.p3,2);a.q27=a.index+1;a.movz+=div(.18,a.fps)*(1.5+Math.sin(a.rott));a.q29=a.movz;a.movx+=div(.3,a.fps)*Math.sin(div(a.time,5));a.q28=a.movx;a.q30=Math.sin(div(a.time,9))+2;`,nr=`a.warp=.02;`,rr=` shader_body { 
  float k1_1;
  float ky_2;
  vec2 uv3_3;
  vec2 tmpvar_4;
  tmpvar_4 = ((uv - vec2(0.5, 0.5)) * aspect.xy);
  uv3_3 = (60.0 * tmpvar_4);
  float tmpvar_5;
  tmpvar_5 = dot (texture (sampler_noise_lq, uv), vec4(0.32, 0.49, 0.29, 0.0));
  ky_2 = clamp (((
    (-(uv3_3.y) / 50.0)
   + 
    ((tmpvar_5 / 8.0) * cos((16.0 * tmpvar_5)))
  ) + 0.2), 0.0, 1.0);
  float tmpvar_6;
  tmpvar_6 = (uv3_3.x * (2.0 - (0.3 * uv.y)));
  k1_1 = (tmpvar_6 - (sign(tmpvar_6) * 24.0));
  k1_1 = (k1_1 - (sign(k1_1) * 9.0));
  k1_1 = (k1_1 + ((2.0 * 
    (k1_1 - (6.0 * sign(k1_1)))
  ) * ky_2));
  ky_2 = clamp ((ky_2 - 0.1), 0.0, 1.0);
  k1_1 = (k1_1 + ((2.0 * 
    (k1_1 - (12.0 * sign(k1_1)))
  ) * ky_2));
  ky_2 = clamp ((ky_2 - 0.1), 0.0, 1.0);
  k1_1 = (k1_1 + ((2.0 * 
    (k1_1 - (18.0 * sign(k1_1)))
  ) * ky_2));
  ky_2 = clamp ((ky_2 - 0.1), 0.0, 1.0);
  k1_1 = (k1_1 + ((2.0 * 
    (k1_1 - (24.0 * sign(k1_1)))
  ) * ky_2));
  ky_2 = clamp ((ky_2 - 0.1), 0.0, 1.0);
  k1_1 = (k1_1 + ((2.0 * 
    (k1_1 - (30.0 * sign(k1_1)))
  ) * ky_2));
  ky_2 = clamp ((ky_2 - 0.1), 0.0, 1.0);
  float tmpvar_7;
  tmpvar_7 = clamp (k1_1, -1.6, 1.6);
  k1_1 = tmpvar_7;
  vec2 tmpvar_8;
  tmpvar_8.x = (sin(tmpvar_7) / cos(tmpvar_7));
  tmpvar_8.y = uv3_3.y;
  vec4 tmpvar_9;
  tmpvar_9.w = 1.0;
  tmpvar_9.xyz = ((texture (sampler_main, fract(uv)).xyz * 0.5) + ((
    cos(tmpvar_7)
   * 
    (vec3((dot (texture (sampler_noise_hq, (tmpvar_8 * 
      ((texsize.xy * texsize_noise_hq.zw) * 0.05)
    .x)), vec4(0.32, 0.49, 0.29, 0.0)) + 0.2)) * vec3(0.125, 0.02, 0.01))
  ) * clamp (
    (1.0 - pow ((2.4 * tmpvar_4.y), 6.0))
  , 0.0, 1.0)));
  ret = tmpvar_9.xyz;
 }`,ir=`float xlat_mutabledist;
float xlat_mutabledist2;
vec3 xlat_mutableglow;
float xlat_mutableinten;
float xlat_mutablem;
float xlat_mutablemask;
vec3 xlat_mutableret1;
vec2 xlat_mutableuv2;
vec2 xlat_mutableuv3;
vec2 xlat_mutableuv4;
 shader_body { 
  vec2 uv_1;
  vec3 ret_2;
  uv_1 = (uv - 0.5);
  uv_1 = (uv_1 * aspect.xy);
  int tmpvar_3;
  tmpvar_3 = int(q29);
  xlat_mutablem = (1.0 - float(tmpvar_3));
  float tmpvar_4;
  tmpvar_4 = -(q29);
  xlat_mutabledist = (1.0 - fract((0.3333333 - 
    (fract(tmpvar_4) / 3.0)
  )));
  xlat_mutabledist2 = (xlat_mutabledist * xlat_mutabledist);
  xlat_mutableinten = (1.0 - xlat_mutabledist2);
  xlat_mutableuv2 = (((q30 * xlat_mutabledist) * (uv_1 - 0.2)) - 0.2);
  xlat_mutablemask = (float((xlat_mutableuv2.y <= 0.0)) * float((xlat_mutableuv2.y >= -1.0)));
  xlat_mutableuv3 = (fract((xlat_mutableuv2 + 
    ((xlat_mutablem + q28) * vec2(0.3, 0.0))
  )) * xlat_mutablemask);
  xlat_mutableglow = (((texture (sampler_blur1, xlat_mutableuv3).xyz * scale1) + bias1) * vec3(0.6, 1.0, 1.0));
  xlat_mutableret1 = ((texture (sampler_main, xlat_mutableuv3).xyz + (2.0 * xlat_mutableglow)) * xlat_mutableinten);
  xlat_mutablem = (2.0 - float(tmpvar_3));
  xlat_mutabledist = (1.0 - fract((0.6666667 - 
    (fract(tmpvar_4) / 3.0)
  )));
  xlat_mutabledist2 = (xlat_mutabledist * xlat_mutabledist);
  xlat_mutableinten = (1.0 - xlat_mutabledist2);
  xlat_mutableuv2 = (((q30 * xlat_mutabledist) * (uv_1 - 0.2)) - 0.2);
  xlat_mutablemask = (float((xlat_mutableuv2.y <= 0.0)) * float((xlat_mutableuv2.y >= -1.0)));
  xlat_mutableuv3 = (fract((xlat_mutableuv2 + 
    ((xlat_mutablem + q28) * vec2(0.3, 0.0))
  )) * xlat_mutablemask);
  vec4 tmpvar_5;
  tmpvar_5 = texture (sampler_main, xlat_mutableuv3);
  xlat_mutableglow = (((texture (sampler_blur1, xlat_mutableuv3).xyz * scale1) + bias1) * vec3(0.6, 1.0, 1.0));
  xlat_mutablemask = (1.0 - clamp ((12.0 * tmpvar_5.xyz), 0.0, 1.0)).x;
  xlat_mutableret1 = ((xlat_mutableret1 * xlat_mutablemask) + ((tmpvar_5.xyz + 
    (2.0 * xlat_mutableglow)
  ) * xlat_mutableinten));
  xlat_mutablem = (3.0 - float(tmpvar_3));
  xlat_mutabledist = (1.0 - fract((1.0 - 
    (fract(tmpvar_4) / 3.0)
  )));
  xlat_mutabledist2 = (xlat_mutabledist * xlat_mutabledist);
  xlat_mutableinten = (1.0 - xlat_mutabledist2);
  xlat_mutableuv2 = (((q30 * xlat_mutabledist) * (uv_1 - 0.2)) - 0.2);
  xlat_mutablemask = (float((xlat_mutableuv2.y <= 0.0)) * float((xlat_mutableuv2.y >= -1.0)));
  xlat_mutableuv3 = (fract((xlat_mutableuv2 + 
    ((xlat_mutablem + q28) * vec2(0.3, 0.0))
  )) * xlat_mutablemask);
  vec4 tmpvar_6;
  tmpvar_6 = texture (sampler_main, xlat_mutableuv3);
  xlat_mutableglow = (((texture (sampler_blur1, xlat_mutableuv3).xyz * scale1) + bias1) * vec3(0.6, 1.0, 1.0));
  xlat_mutablemask = (1.0 - clamp ((12.0 * tmpvar_6.xyz), 0.0, 1.0)).x;
  xlat_mutableret1 = ((xlat_mutableret1 * xlat_mutablemask) + ((tmpvar_6.xyz + 
    (2.0 * xlat_mutableglow)
  ) * xlat_mutableinten));
  xlat_mutableuv4 = (uv_1 + vec2(-0.3, 0.1));
  float tmpvar_7;
  tmpvar_7 = (0.5 * clamp ((1.0/(
    (abs(uv_1.y) + 0.1)
  )), 0.0, 12.0));
  vec2 tmpvar_8;
  tmpvar_8.x = (uv_1.x * tmpvar_7);
  tmpvar_8.y = tmpvar_7;
  float tmpvar_9;
  tmpvar_9 = clamp ((1.0 - (8.0 * xlat_mutableret1.x)), 0.0, 1.0);
  vec3 tmpvar_10;
  tmpvar_10.x = (0.4 * clamp ((1.0 - 
    (4.0 * uv_1.y)
  ), 0.0, 1.0));
  tmpvar_10.y = (0.4 * clamp ((1.0 - 
    (2.0 * uv_1.y)
  ), 0.0, 1.0));
  tmpvar_10.z = clamp ((1.0 - (3.0 * uv_1.y)), 0.0, 1.0);
  ret_2 = ((xlat_mutableret1 * vec3(0.0, 1.0, 1.0)) + ((0.25 * tmpvar_10) * tmpvar_9));
  ret_2 = (ret_2 + ((vec3(
    dot (texture (sampler_noise_hq, (tmpvar_8 + (0.04 * time))), vec4(0.32, 0.49, 0.29, 0.0))
  ) * 
    ((clamp ((1.0 - 
      (16.0 * uv_1.y)
    ), 0.0, 1.0) * 0.02) / (0.01 + sqrt(dot (xlat_mutableuv4, xlat_mutableuv4))))
  ) * tmpvar_9));
  vec4 tmpvar_11;
  tmpvar_11.w = 1.0;
  tmpvar_11.xyz = ret_2;
  ret = tmpvar_11.xyz;
 }`,ar={baseVals:Qn,shapes:$n,waves:er,init_eqs_str:tr,frame_eqs_str:$,pixel_eqs_str:nr,warp:rr,comp:ir},or={rating:2,gammaadj:1.98,decay:.5,echo_zoom:1,echo_alpha:.5,echo_orient:3,wave_mode:1,additivewave:1,wave_thick:1,modwavealphabyvolume:1,wave_brighten:0,darken:1,wave_a:.001,wave_scale:.168,wave_smoothing:0,wave_mystery:-.2,modwavealphastart:.71,modwavealphaend:1.3,warpanimspeed:1.459,warpscale:2.007,zoom:.9999,warp:.01,sx:.9999,wave_r:0,wave_g:0,wave_b:0,ob_size:0,ob_a:1,ib_size:.26,mv_x:32,mv_y:24,mv_l:.5,mv_r:.3,mv_g:.5,mv_b:.4,mv_a:0,b1ed:.7},sr=[{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],cr=[{baseVals:{enabled:0}},{baseVals:{enabled:1,scaling:.89152,smoothing:.82,a:.1},init_eqs_str:`a.t1=0;a.px=0;a.t2=0;a.py=0;a.k1=0;`,frame_eqs_str:`a.t1=1;a.t2=7;`,point_eqs_str:`a.r=.31;a.b=0;a.g=0;a.a=1;a.t1=mod(67*a.t1+37,4096);a.px=div(a.t1-2047,4096);a.t2=mod(67*a.t2+37,4096);a.py=div(a.t2-0,4096);a.k1=mod(100*a.sample,8);a.y=div(a.py,5)+.1;a.a=below(a.py,.9);a.x=.5+.4*Math.sin(26*a.sample);`},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],lr=`a.index=0;a.q22=0;a.q21=0;a.q29=0;a.dec_med=0;a.movz=0;a.movx=0;a.rott=0;a.is_beat=0;a.q23=0;a.k1=0;a.q24=0;a.dec_slow=0;a.q10=0;a.bass_2=0;a.q26=0;a.p2=0;a.avg=0;a.beat=0;a.p1=0;a.peak=0;a.q27=0;a.p3=0;a.t0=0;a.q28=0;a.q30=0;a.q20=0;a.bass_=0;a.q28=0;a.q29=0;a.p1=0;`,ur=`a.dec_med=pow(.9,div(30,a.fps));a.dec_slow=pow(.99,div(30,a.fps));a.beat=Math.max(Math.max(a.bass,a.mid),a.treb);a.avg=a.avg*a.dec_slow+a.beat*(1-a.dec_slow);a.is_beat=above(a.beat,.5+a.avg+a.peak)*above(a.time,a.t0+.2);a.t0=a.is_beat*a.time+(1-a.is_beat)*a.t0;a.peak=a.is_beat*a.beat+(1-a.is_beat)*a.peak*a.dec_med;a.index=mod(a.index+a.is_beat,8);a.q20=a.avg;a.q21=a.beat;a.q22=a.peak;a.q23=a.index;a.q24=a.is_beat;a.q26=a.bass+a.mid+a.treb;a.k1=a.is_beat*equal(a.index,0);a.p1=
a.k1*(a.p1+1)+(1-a.k1)*a.p1;a.p2=a.dec_med*a.p2+(1-a.dec_med)*a.p1;a.p3=a.dec_med*a.p3+(1-a.dec_med)*a.p2;a.rott=div(3.1416*a.p3,2);a.q27=a.index+1;a.movz+=div(.18,a.fps)*(1.5+Math.sin(a.rott));a.q29=a.movz;a.movx+=div(.3,a.fps)*Math.sin(div(a.time,5));a.q28=a.movx;a.q30=Math.sin(div(a.time,9))+2;a.bass_=a.bass_*a.dec_slow+(1-a.dec_slow)*a.bass_att;a.bass_2=a.bass_2*a.dec_slow+(1-a.dec_slow)*a.bass_;a.q10=a.bass_2-a.bass_;a.q10=.005*-Math.sin(.5*a.time);`,dr=`a.warp=.02;`,fr=` shader_body { 
  float k1_1;
  float ky_2;
  vec2 uv3_3;
  vec2 tmpvar_4;
  tmpvar_4 = (uv - vec2(0.5, 0.5));
  uv3_3 = ((40.0 + (30.0 * rand_preset)).x * tmpvar_4);
  float tmpvar_5;
  tmpvar_5 = dot (texture (sampler_noise_lq, uv), vec4(0.32, 0.49, 0.29, 0.0));
  ky_2 = clamp (((
    (-(uv3_3.y) / 50.0)
   + 
    ((tmpvar_5 / (4.0 + (16.0 * rand_preset)).x) * cos((16.0 * tmpvar_5)))
  ) + 0.2), 0.0, 1.0);
  float tmpvar_6;
  tmpvar_6 = (uv3_3.x * 2.0);
  k1_1 = (tmpvar_6 - (sign(tmpvar_6) * 24.0));
  k1_1 = (k1_1 - (sign(k1_1) * 9.0));
  k1_1 = (k1_1 - (sign(k1_1) * 5.0));
  float tmpvar_7;
  tmpvar_7 = (6.0 * rand_preset.x);
  k1_1 = (k1_1 + ((2.0 * 
    (k1_1 - ((3.0 + tmpvar_7) * sign(k1_1)))
  ) * ky_2));
  ky_2 = clamp ((ky_2 - 0.1), 0.0, 1.0);
  k1_1 = (k1_1 + ((2.0 * 
    (k1_1 - (((3.0 + tmpvar_7) * 2.0) * sign(k1_1)))
  ) * ky_2));
  ky_2 = clamp ((ky_2 - 0.1), 0.0, 1.0);
  k1_1 = (k1_1 + ((2.0 * 
    (k1_1 - (((3.0 + tmpvar_7) * 3.0) * sign(k1_1)))
  ) * ky_2));
  ky_2 = clamp ((ky_2 - 0.1), 0.0, 1.0);
  k1_1 = (k1_1 + ((2.0 * 
    (k1_1 - (((3.0 + tmpvar_7) * 4.0) * sign(k1_1)))
  ) * ky_2));
  ky_2 = clamp ((ky_2 - 0.1), 0.0, 1.0);
  k1_1 = (k1_1 + ((2.0 * 
    (k1_1 - (((3.0 + tmpvar_7) * 5.0) * sign(k1_1)))
  ) * ky_2));
  ky_2 = clamp ((ky_2 - 0.1), 0.0, 1.0);
  float tmpvar_8;
  tmpvar_8 = clamp (k1_1, -1.6, 1.6);
  k1_1 = tmpvar_8;
  vec4 tmpvar_9;
  tmpvar_9.w = 1.0;
  tmpvar_9.xyz = clamp ((clamp (
    ((vec3((abs(
      cos(tmpvar_8)
    ) / 2.0)) * vec3(1.0, 0.0, 0.0)) * (1.0 - pow ((
      (3.0 * tmpvar_4.y)
     - 0.1), 4.0)))
  , 0.0, 1.0) + (vec3(0.5, 0.0, 0.0) * 
    pow ((2.0 * tmpvar_4.y), 6.0)
  )), 0.0, 1.0);
  ret = tmpvar_9.xyz;
 }`,pr=`float xlat_mutablecover;
float xlat_mutabledist;
float xlat_mutabledist2;
float xlat_mutableinten;
float xlat_mutablen;
vec3 xlat_mutableneu;
vec3 xlat_mutableret1;
vec2 xlat_mutableuv2;
vec2 xlat_mutableuv5;
 shader_body { 
  vec2 uv_1;
  vec3 clouds_2;
  vec2 sunpos_3;
  vec3 ret_4;
  vec2 tmpvar_5;
  tmpvar_5.y = -0.6;
  tmpvar_5.x = (rand_preset.x - 0.5);
  sunpos_3 = tmpvar_5;
  uv_1 = (uv - 0.5);
  uv_1 = (uv_1 * aspect.xy);
  uv_1.x = uv_1.x;
  clouds_2 = ((clamp (
    (uv.y * uv.y)
  , 0.0, 1.0) * (1.0 + rand_preset)).xyz + ((
    clamp ((1.0 - uv.y), 0.0, 1.0)
   * 
    (1.0 + (rand_preset * slow_roam_cos))
  ) / 2.0).xyz);
  xlat_mutablecover = 0.0;
  xlat_mutableret1 = vec3(0.0, 0.0, 0.0);
  xlat_mutablen = 1.0;
  while (true) {
    if ((xlat_mutablen > 6.0)) {
      break;
    };
    xlat_mutabledist = (1.0 - fract((
      (xlat_mutablen / 6.0)
     + 
      (0.02 * time)
    )));
    xlat_mutabledist2 = (1.0 - fract((
      (xlat_mutablen / 6.0)
     + 
      (0.01 * time)
    )));
    xlat_mutableinten = ((1.0 - xlat_mutabledist) * 2.0);
    xlat_mutableuv2.y = (uv_1.y - (0.2 * rand_preset.y));
    xlat_mutableuv2.x = (uv_1.x + ((rand_preset.z - 0.5) / 2.0));
    vec2 tmpvar_6;
    tmpvar_6.x = 0.5;
    tmpvar_6.y = ((0.25 + q10) + (0.1 * rand_preset.x));
    xlat_mutableuv2 = (((
      (1.0 + (2.0 * rand_preset.x))
     * xlat_mutabledist) * xlat_mutableuv2) - tmpvar_6);
    vec2 tmpvar_7;
    tmpvar_7 = fract(xlat_mutableuv2);
    xlat_mutableuv5 = ((normalize(
      (uv_1 - sunpos_3)
    ) * 0.2) + sunpos_3);
    xlat_mutablecover = (xlat_mutablecover + dot ((
      (texture (sampler_blur1, fract(((2.0 * xlat_mutableuv5) * xlat_mutabledist2))).xyz * scale1)
     + bias1), vec3(0.32, 0.49, 0.29)));
    xlat_mutableneu = ((texture (sampler_main, tmpvar_7).xyz + (
      (texture (sampler_blur1, tmpvar_7).xyz * scale1)
     + bias1)) / 4.0);
    xlat_mutableret1 = (xlat_mutableret1 + (xlat_mutableneu * xlat_mutableinten));
    xlat_mutablen += 1.0;
  };
  float tmpvar_8;
  tmpvar_8 = clamp ((xlat_mutablecover * 2.0), 0.0, 1.0);
  ret_4 = (clamp (clouds_2, 0.0, 1.0) * ((0.4 + 
    ((vec3(tmpvar_8) * vec3(tmpvar_8)) * 0.8)
  ) * 1.5));
  ret_4 = (ret_4 * clamp ((1.0 - 
    (xlat_mutableret1.x * 4.0)
  ), 0.0, 1.0));
  ret_4 = (ret_4 + ((
    ((vec3(tmpvar_8) * 0.1) * rand_preset.x)
   * 
    (1.0 + rand_preset)
  .xyz) * (uv_1.y + 0.5)));
  vec4 tmpvar_9;
  tmpvar_9.w = 1.0;
  tmpvar_9.xyz = ret_4;
  ret = tmpvar_9.xyz;
 }`,mr={baseVals:or,shapes:sr,waves:cr,init_eqs_str:lr,frame_eqs_str:ur,pixel_eqs_str:dr,warp:fr,comp:pr},hr={rating:4,gammaadj:1.98,decay:.5,echo_zoom:1,echo_alpha:.5,echo_orient:3,wave_mode:6,additivewave:1,wave_thick:1,modwavealphabyvolume:1,wave_brighten:0,darken:1,wave_a:.001,wave_scale:2.103,wave_smoothing:.54,wave_mystery:.38,modwavealphastart:.81,modwavealphaend:1.4,rot:-.02,dy:.02,warp:.11001,sx:.9999,wave_r:0,wave_g:0,wave_b:0,mv_x:64,mv_y:48,mv_l:1.85,mv_r:.5,mv_g:.5,mv_b:.5,mv_a:0,b1ed:0},gr=[{baseVals:{enabled:0}},{baseVals:{enabled:1,sides:34,num_inst:274,x:.6,rad:.02217,tex_zoom:60.80383,g:.6,b:1,a:.9,g2:0,border_g:.59,border_b:0,border_a:1},init_eqs_str:`a.aspect=0;a.q32=0;a.speed=0;a.trel=0;a.speed=0;a.speed=0;a.k1=0;a.dist=0;a.k1=0;a.dist=0;a.dist=0;a.dist=0;a.fov=0;a.arg=0;a.dist=0;a.posx=0;a.fov=0;a.dist=0;a.arg=0;a.dist=0;a.posy=0;a.fov=0;a.dist=0;a.arg=0;a.dist=0;a.posx=0;a.posy=0;a.aspect=0;a.radi=0;a.dist=0;a.z1=1;a.z2=23;a.rr1=0;a.rr2=0;`,frame_eqs_str:`a.aspect=a.q32;a.speed=.02;a.trel=Math.floor(a.time*a.speed)-a.time*a.speed+1;a.k1=1-div(a.instance,a.num_inst);a.dist=a.k1;a.dist-=Math.floor(a.dist);a.fov=.03;a.arg=a.dist+.2*a.time;a.posx=div(a.fov,a.dist)*(Math.sin(13*a.arg)+0*Math.sin(332*a.dist));a.posy=div(a.fov,a.dist)*(Math.cos(36*a.arg)+0*Math.sin(332*a.dist));a.x=.5+a.posx;a.y=.5+a.posy*a.aspect;a.a=1;a.border_a=Math.min(4*a.radi,1);a.a2=1;a.rad=div(.01,a.dist);`},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],_r=[{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],vr=`a.dy=0;a.dx=0;a.rot=0;a.zoom=1;`,yr=` shader_body { 
  vec4 tmpvar_1;
  tmpvar_1.w = 1.0;
  tmpvar_1.xyz = (texture (sampler_main, uv).xyz * 0.9);
  ret = tmpvar_1.xyz;
 }`,br=`vec2 xlat_mutablec;
vec2 xlat_mutablezz;
 shader_body { 
  int n_1;
  vec2 p0_2;
  float trap1_3;
  trap1_3 = 100.0;
  p0_2 = (vec2(0.5, 0.6) - (uv * 0.2));
  xlat_mutablec = (((
    (uv_orig - 0.5)
   * aspect.xy) / 10.0) + vec2(-0.5017, 0.6102));
  xlat_mutablezz = vec2(0.0, 0.0);
  n_1 = 0;
  while (true) {
    if ((n_1 > 60)) {
      break;
    };
    vec2 tmpvar_4;
    tmpvar_4.x = ((xlat_mutablezz.x * xlat_mutablezz.x) - (xlat_mutablezz.y * xlat_mutablezz.y));
    tmpvar_4.y = ((2.0 * xlat_mutablezz.x) * xlat_mutablezz.y);
    xlat_mutablezz = (tmpvar_4 + xlat_mutablec);
    float tmpvar_5;
    tmpvar_5 = dot (xlat_mutablezz, xlat_mutablezz);
    if ((tmpvar_5 > 4.0)) {
      n_1 = 1000;
    };
    vec2 x_6;
    x_6 = (xlat_mutablezz - p0_2);
    trap1_3 = min (trap1_3, sqrt(dot (x_6, x_6)));
    n_1++;
  };
  vec3 tmpvar_7;
  tmpvar_7.x = trap1_3;
  tmpvar_7.y = (1.0 - trap1_3);
  tmpvar_7.z = (1.0 - ((2.0 * trap1_3) * trap1_3));
  vec4 tmpvar_8;
  tmpvar_8.w = 1.0;
  tmpvar_8.xyz = pow (tmpvar_7, vec3(4.0, 4.0, 4.0));
  ret = tmpvar_8.xyz;
 }`,xr={baseVals:hr,shapes:gr,waves:_r,init_eqs_str:``,frame_eqs_str:vr,pixel_eqs_str:``,pixel_eqs:``,warp:yr,comp:br},Sr={rating:5,gammaadj:1.980001,decay:.5,echo_zoom:.999998,echo_alpha:.5,echo_orient:3,wave_mode:5,wave_dots:1,wave_thick:1,wave_brighten:0,darken:1,wave_a:.001,wave_scale:5.552,wave_smoothing:.504,wave_mystery:-1,modwavealphastart:.71,modwavealphaend:1.3,warpanimspeed:1.4595,warpscale:2.0067,zoom:.9999,warp:.01,sx:.9999,wave_g:0,wave_b:0,ob_r:1,ob_g:1,ob_b:1,ib_size:.26,mv_x:64,mv_y:48,mv_l:.85,mv_r:.5,mv_g:.5,mv_b:.5,mv_a:0,b1ed:0},Cr=[{baseVals:{enabled:1,sides:100,textured:1,x:.46,y:.38,rad:.267799,tex_zoom:1.051004,r:.8,g:1,b:.5,r2:.9,g2:.9,b2:1,a2:1,border_a:0},init_eqs_str:`a.q1=0;a.q2=0;a.q9=0;a.q10=0;`,frame_eqs_str:`a.x=.5+.1*a.q1;a.y=.5+.1*a.q2;a.x=.5-div(a.q9,5);a.y=.6+div(a.q10,5);`},{baseVals:{enabled:0}},{baseVals:{enabled:1,sides:5,additive:1,x:.9,rad:.22613,g:.2,b:.2,g2:0,border_b:0,border_a:0},init_eqs_str:``,frame_eqs_str:`a.x=.05+div(randint(900),1E3);a.y=.05+div(randint(900),1E3);a.ang=div(randint(320),100);a.a=.4;`},{baseVals:{enabled:0}}],wr=[{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],Tr=`a.index2=0;a.xk=0;a.kiss=0;a.sw=0;a.yk=0;a.index=0;a.q22=0;a.q21=0;a.q29=0;a.q6=0;a.dt=0;a.y0=0;a.q1=0;a.dec_med=0;a.q5=0;a.index3=0;a.q9=0;a.x0=0;a.ax=0;a.rott=0;a.is_beat=0;a.q23=0;a.k1=0;a.q24=0;a.vx=0;a.dec_slow=0;a.q10=0;a.vy=0;a.q4=0;a.k2=0;a.q26=0;a.ay=0;a.p2=0;a.avg=0;a.beat=0;a.vol=0;a.p1=0;a.peak=0;a.q2=0;a.q27=0;a.q3=0;a.t0=0;a.m=0;a.q7=0;a.q28=0;a.v2=0;a.q20=0;a.q8=0;a.vol=0;a.p1=0;a.vx=.2;a.vy=-.1;a.kx=0;a.ky=0;`,Er=`a.dec_med=pow(.96,div(30,a.fps));a.dec_slow=pow(.998,div(30,a.fps));a.beat=Math.max(Math.max(a.bass,a.mid),a.treb);a.avg=a.avg*a.dec_slow+a.beat*(1-a.dec_slow);a.is_beat=above(a.beat,.5+a.avg+a.peak)*above(a.time,a.t0+.2);a.t0=a.is_beat*a.time+(1-a.is_beat)*a.t0;a.peak=a.is_beat*a.beat+(1-a.is_beat)*a.peak*a.dec_med;a.index=mod(a.index+a.is_beat,8);a.index2=mod(a.index2+a.is_beat*bnot(a.index),2);a.index3=mod(a.index3+a.is_beat*bnot(a.index)*bnot(a.index2),2);a.q20=a.avg;a.q21=
a.beat;a.q22=a.peak;a.q23=a.index;a.q24=a.is_beat;a.vol=a.bass_att+a.treb_att;a.v2=a.v2*a.dec_med+a.vol*(1-a.dec_med);a.q26=Math.max(Math.atan(a.vol-a.v2),0);a.q27=a.index+1;a.sw=a.sw*a.dec_med+(1-a.dec_med)*mod(a.index2,2);a.q28=a.sw;a.kiss=a.kiss*a.dec_med+(1-a.dec_med)*bnot(a.index2)*below(a.index,4);a.q29=a.kiss;a.k1=a.is_beat*bnot(a.index);a.k2=a.is_beat*bnot(a.index);a.p1=a.k1*(a.p1+1)+(1-a.k1)*a.p1;a.p2=a.dec_med*a.p2+(1-a.dec_med)*a.p1;a.rott=div(3.1416*a.p2,2);a.monitor=a.k1;a.q1=Math.cos(a.rott);
a.q2=Math.sin(a.rott);a.q3=-a.q2;a.q4=a.q1;a.q5=Math.cos(div(a.time,4));a.q6=-Math.sin(div(a.time,4));a.q7=-a.q6;a.q8=a.q5;a.zoom=1;a.rot=-0;a.dt=div(3,a.fps);a.m=1;a.x0=0;a.y0=0;a.x0=div(a.q1,4);a.y0=div(a.q2,4);a.ax=-(a.xk-a.x0);a.ay=-(a.yk-a.y0);a.monitor=a.index3;a.vx=a.vx*a.dec_slow+a.ax*a.dt;a.vy=a.vy*a.dec_slow+a.ay*a.dt;a.xk+=a.vx*a.dt;a.yk+=a.vy*a.dt;a.q9=a.xk;a.q10=a.yk;`,Dr=`vec2 xlat_mutableball;
vec2 xlat_mutablers;
vec2 xlat_mutableuv1;
 shader_body { 
  vec2 uv_1;
  vec2 uv2_2;
  xlat_mutableuv1 = ((uv_orig - 0.5) * aspect.xy);
  float tmpvar_3;
  tmpvar_3 = ((18.0 * sqrt(
    dot (xlat_mutableuv1, xlat_mutableuv1)
  )) + time);
  xlat_mutablers = (clamp ((
    (sin(tmpvar_3) / cos(tmpvar_3))
   * 
    normalize(xlat_mutableuv1)
  ), vec2(-5.0, -5.0), vec2(5.0, 5.0)) / 2.0);
  float tmpvar_4;
  tmpvar_4 = ((q29 * 16.0) + 1.0);
  vec2 tmpvar_5;
  tmpvar_5.x = q9;
  tmpvar_5.y = q10;
  vec2 tmpvar_6;
  tmpvar_6 = (tmpvar_5 * sqrt(tmpvar_4));
  xlat_mutableball = (sin((xlat_mutableuv1 * tmpvar_4)) - tmpvar_6);
  float tmpvar_7;
  tmpvar_7 = (sqrt(dot (xlat_mutableball, xlat_mutableball)) / ((0.035 * 
    pow (tmpvar_4, 0.9)
  ) * (1.0 + 
    sqrt(dot (tmpvar_6, tmpvar_6))
  )));
  float tmpvar_8;
  tmpvar_8 = clamp ((sign(
    (1.0 - tmpvar_7)
  ) * sqrt(
    (1.0 - tmpvar_7)
  )), 0.0, 1.0);
  float tmpvar_9;
  tmpvar_9 = float((tmpvar_8 >= 0.001));
  xlat_mutablers = ((q28 * xlat_mutablers) + ((1.0 - q28) * xlat_mutablers.yx));
  uv_1 = (uv_orig + ((
    ((1.0 - tmpvar_9) * 0.03)
   * xlat_mutablers.yx) + (
    ((0.6 * tmpvar_9) * tmpvar_8)
   * 
    normalize(xlat_mutableball)
  )));
  mat2 tmpvar_10;
  tmpvar_10[uint(0)] = _qb.xy;
  tmpvar_10[1u] = _qb.zw;
  vec2 tmpvar_11;
  tmpvar_11.x = sin((xlat_mutableuv1.y * 16.0));
  tmpvar_11.y = sin((xlat_mutableuv1.x * 16.0));
  uv2_2 = (((0.7 * xlat_mutableuv1) + (0.3 * tmpvar_11)) * 0.2);
  vec4 tmpvar_12;
  tmpvar_12.w = 1.0;
  tmpvar_12.xyz = (((
    ((texture (sampler_main, uv_1).xyz - ((
      (texture (sampler_blur1, fract(uv_1)).xyz * scale1)
     + bias1) * 0.03)) + (vec3(1.0, 0.84, 0.6) * ((0.08 * 
      abs(vec3(((0.16 / (
        sqrt((xlat_mutableuv1 * tmpvar_10).x)
       + 0.002)) * rad)))
    ) - (tmpvar_8 * 
      (0.2 + (0.3 * slow_roam_cos.xyz))
    ))))
   + vec3(
    (q26 * clamp ((0.0015 / sqrt(
      dot (uv2_2, uv2_2)
    )), 0.0, 1.0))
  )) * 0.99) - 0.018);
  ret = tmpvar_12.xyz;
 }`,Or=` shader_body { 
  vec4 tmpvar_1;
  tmpvar_1.w = 1.0;
  tmpvar_1.xyz = (0.8 * (texture (sampler_main, uv).xyz + (
    (texture (sampler_blur1, uv).xyz * scale1)
   + bias1)));
  ret = tmpvar_1.xyz;
 }`,kr={baseVals:Sr,shapes:Cr,waves:wr,init_eqs_str:Tr,frame_eqs_str:Er,pixel_eqs_str:``,pixel_eqs:``,warp:Dr,comp:Or},Ar={rating:3,gammaadj:1.98,decay:.5,echo_zoom:1,echo_alpha:.5,echo_orient:3,wave_mode:4,additivewave:1,wave_thick:1,modwavealphabyvolume:1,wave_brighten:0,darken:1,wave_a:.001,wave_scale:.527,wave_smoothing:.45,modwavealphastart:0,modwavealphaend:1.32,warpanimspeed:1.459,warpscale:2.007,zoom:.9999,warp:.01,sx:.9999,wave_r:.8,wave_g:.49,ob_a:1,ib_size:.26,mv_x:64,mv_y:48,mv_l:1.85,mv_r:.5,mv_g:.5,mv_b:.5,mv_a:0,b2x:.3,b1ed:0},jr=[{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],Mr=[{baseVals:{enabled:1,samples:484,spectrum:1,thick:1,additive:1,scaling:1.95127,smoothing:0,a:.7},init_eqs_str:`a.n=0;a.reg00=0;a.m=0;a.reg01=0;a.q30=0;`,frame_eqs_str:``,point_eqs_str:`a.n=Math.floor((a.reg00+.5)*a.sample);a.m=30001+div(a.n,div(a.reg00,a.reg01));a.gmegabuf[Math.floor(a.m)]=a.gmegabuf[Math.floor(a.m)]*a.q30+div(1-a.q30,2)*(a.value1+a.value2);a.x=a.gmegabuf[Math.floor(1E4+a.n)];a.y=a.gmegabuf[Math.floor(15E3+a.n)];a.a=a.gmegabuf[Math.floor(2E4+a.n)];a.b=Math.min(Math.max(a.gmegabuf[Math.floor(25E3+a.n)],0),1);a.r=1-a.b;a.g=.5;`},{baseVals:{enabled:1,samples:484,thick:1,additive:1,scaling:.89152,smoothing:.82,a:.9},init_eqs_str:`a.n=0;a.reg00=0;`,frame_eqs_str:``,point_eqs_str:`a.n=Math.floor((a.reg00+.5)*a.sample)+a.reg00;a.x=a.gmegabuf[Math.floor(1E4+a.n)];a.y=a.gmegabuf[Math.floor(15E3+a.n)];a.a=a.gmegabuf[Math.floor(2E4+a.n)];a.b=Math.min(Math.max(a.gmegabuf[Math.floor(25E3+a.n)],0),1);a.r=1-a.b;a.g=.5;`},{baseVals:{enabled:1,samples:484,thick:1,additive:1,scaling:.89152,smoothing:.82},init_eqs_str:`a.n=0;a.reg00=0;`,frame_eqs_str:``,point_eqs_str:`a.n=Math.floor((a.reg00+.5)*a.sample)+2*a.reg00;a.x=a.gmegabuf[Math.floor(1E4+a.n)];a.y=a.gmegabuf[Math.floor(15E3+a.n)];a.a=a.gmegabuf[Math.floor(2E4+a.n)];a.b=Math.min(Math.max(a.gmegabuf[Math.floor(25E3+a.n)],0),1);a.r=1-a.b;a.g=.5;`},{baseVals:{enabled:1,samples:484,spectrum:1,thick:1,additive:1},init_eqs_str:`a.n=0;a.reg00=0;`,frame_eqs_str:``,point_eqs_str:`a.n=Math.floor((a.reg00-.5)*a.sample)+3*a.reg00;a.x=a.gmegabuf[Math.floor(1E4+a.n)];a.y=a.gmegabuf[Math.floor(15E3+a.n)];a.a=a.gmegabuf[Math.floor(2E4+a.n)];a.b=Math.min(Math.max(a.gmegabuf[Math.floor(25E3+a.n)],0),1);a.r=1-a.b;a.g=.5;`}],Nr=`a.xang=0;a.fov=0;a.index2=0;a.index=0;a.yang=0;a.q6=0;a.amp_=0;a.xlen=0;a.smooth=0;a.q1=0;a.dec_med=0;a.sum=0;a.q5=0;a.dec_f=0;a.flen=0;a.dec_s=0;a.reg01=0;a.my=0;a.oz=0;a.imag=0;a.yind=0;a.dec_slow=0;a.ind=0;a.ylen=0;a.real=0;a.q4=0;a.mz=0;a.oy0=0;a.amp=0;a.oy=0;a.mx=0;a.q2=0;a.zang=0;a.q3=0;a.reg00=0;a.q32=0;a.q30=0;a.ox=0;a.xind=0;for(var b=a.index=0;2E5>b;b++)a.megabuf[Math.floor(a.index)]=0,a.gmegabuf[Math.floor(a.index)]=0,a.index+=1;`,Pr=`a.xlen=44;a.ylen=44;a.flen=10;a.reg00=div(a.xlen*a.ylen,4);a.reg01=div(a.reg00,4);a.dec_med=pow(.94,div(30,a.fps));a.dec_slow=pow(.98,div(30,a.fps));a.dec_f=pow(.8,div(30,a.fps));a.monitor=a.smooth;a.q30=a.dec_s;a.smooth=Math.max(1,pow(6,div(a.fps,30))-2);a.ind=0;a.sum=0;a.amp=.01;for(var b=0;b<a.reg01;b++)a.sum+=div(a.gmegabuf[Math.floor(a.ind+3E4)],a.reg01),a.amp+=pow(a.gmegabuf[Math.floor(a.ind+3E4)],2),a.ind+=1;a.ind=0;a.amp_=a.amp_*a.dec_med+600*div((1-a.dec_med)*sqrt(a.amp),
a.reg01);for(b=0;b<a.reg01;b++)a.megabuf[Math.floor(a.ind+3E4)]=div(a.gmegabuf[Math.floor(a.ind+3E4)]-a.sum,a.amp_),a.ind+=1;for(b=a.index2=0;b<a.flen;b++){a.index=0;a.real=0;for(var c=a.imag=0;c<a.flen;c++)a.real+=Math.cos(6.28*div(a.index,a.flen)*a.index2)*a.megabuf[Math.floor(div(a.index*a.reg01,8)+30002)],a.imag+=Math.sin(6.28*div(a.index,a.flen)*a.index2)*a.megabuf[Math.floor(div(a.index*a.reg01,8)+30002)],a.index+=1;a.megabuf[Math.floor(1E4+a.index2)]=a.megabuf[Math.floor(1E4+a.index2)]*a.dec_f+
a.real;a.megabuf[Math.floor(15E3+a.index2)]=a.megabuf[Math.floor(15E3+a.index2)]*a.dec_f+a.imag;a.index2+=1}a.ind=1;for(b=0;b<div(a.flen,2);b++){a.cx=a.megabuf[Math.floor(1E4+a.ind)];a.cy=a.megabuf[Math.floor(15E3+a.ind)];a.yind=-1;for(c=0;3>c;c++){a.xind=-1;for(var d=0;3>d;d++)a.ox=mod((a.cx+.5)*a.xlen+a.xind,a.xlen),a.oy=mod((a.cy+.5)*a.ylen+a.yind,a.ylen),a.amp=a.cx*a.cx+a.cy*a.cy,a.megabuf[Math.floor(a.oy*a.ylen+a.ox)]-=div(div(60,a.fps)*sqrt(a.amp)*above(a.amp,.02),1+a.xind*a.xind+a.yind*a.yind),
a.xind+=1;a.yind+=1}a.ind+=1}for(b=a.yind=0;b<a.ylen;b++){for(c=a.xind=0;c<a.xlen;c++)a.megabuf[Math.floor(a.yind*a.ylen+a.xind+5E3)]=a.dec_med*(div(a.gmegabuf[Math.floor(a.yind*a.ylen+mod(a.xind+1,a.xlen))]+a.gmegabuf[Math.floor(a.yind*a.ylen+mod(a.xlen+a.xind-1,a.xlen))]+a.gmegabuf[Math.floor(mod(a.yind+1,a.ylen)*a.ylen+a.xind)]+a.gmegabuf[Math.floor(mod(a.yind+a.ylen-1,a.ylen)*a.ylen+a.xind)]+a.gmegabuf[Math.floor(a.yind*a.ylen+a.xind)]*a.smooth*4,2+2*a.smooth)-a.megabuf[Math.floor(a.yind*a.ylen+
a.xind)]),a.xind+=1;a.yind+=1}a.zang=-.2*Math.sin(div(a.time,9));a.xang=-.5-.2*Math.sin(div(a.time,6));a.yang=div(a.time,4);a.q1=Math.cos(a.xang);a.q2=Math.sin(a.xang);a.q3=Math.cos(a.yang);a.q4=Math.sin(a.yang);a.q5=Math.cos(a.zang);a.q6=Math.sin(a.zang);a.fov=.8;for(b=a.yind=0;b<a.ylen;b++){for(c=a.xind=0;c<a.xlen;c++)a.ind=a.yind*a.ylen+a.xind,a.megabuf[Math.floor(a.ind)]=a.gmegabuf[Math.floor(a.ind)],a.gmegabuf[Math.floor(a.ind)]=a.megabuf[Math.floor(a.ind+5E3)],a.oz=a.yind-div(a.ylen,2)+0*Math.sin(2*
a.time),a.ox=.00001<Math.abs(bnot(mod(a.yind,2)))?a.xind:a.xlen-a.xind-1,a.oy=a.gmegabuf[Math.floor(a.yind*a.ylen+a.ox)],a.oy0=a.oy,a.ox-=div(a.xlen,2),a.mx=a.ox*a.q5-a.oy*a.q6,a.my=a.ox*a.q6+a.oy*a.q5,a.ox=a.mx,a.oy=a.my,a.mx=a.ox*a.q3+a.oz*a.q4,a.mz=-a.ox*a.q4+a.oz*a.q3,a.ox=a.mx,a.oz=a.mz,a.my=a.oy*a.q1-a.oz*a.q2,a.mz=a.oy*a.q2+a.oz*a.q1,a.oy=a.my,a.oz=a.mz,a.gmegabuf[Math.floor(1E4+a.ind)]=div(a.fov*a.ox,a.oz+60*a.fov)+.5,a.gmegabuf[Math.floor(15E3+a.ind)]=div(a.fov*a.oy,a.oz+60*a.fov)+.6,a.gmegabuf[Math.floor(2E4+
a.ind)]=Math.max(Math.min(.5+div(a.oy0,4),1),0),a.gmegabuf[Math.floor(25E3+a.ind)]=div(a.oy0,16)+.5,a.xind+=1;a.yind+=1}a.q32=a.aspecty;`,Fr=`a.rot=0;a.zoom=1;a.warp=0;`,Ir=` shader_body { 
  vec4 tmpvar_1;
  tmpvar_1.w = 1.0;
  tmpvar_1.xyz = vec3(0.0, 0.0, 0.0);
  ret = tmpvar_1.xyz;
 }`,Lr=` shader_body { 
  vec3 ret_1;
  vec2 tmpvar_2;
  tmpvar_2.x = uv.x;
  tmpvar_2.y = (uv.y - 0.3);
  ret_1 = (mix (texture (sampler_main, uv).xyz, (2.0 * 
    ((texture (sampler_blur1, uv).xyz * scale1) + bias1)
  ), vec3(0.4, 0.4, 0.4)) * 1.5);
  ret_1 = (ret_1 + ((
    ((clamp (1.0, 0.0, 1.0) * clamp ((1.0 - 
      dot (ret_1, vec3(0.32, 0.49, 0.29))
    ), 0.0, 1.0)) * (1.0 - (dot (
      ((texture (sampler_blur2, fract(tmpvar_2)).xyz * scale2) + bias2)
    , vec3(0.32, 0.49, 0.29)) * 3.0)))
   * 0.2) * uv.y));
  vec4 tmpvar_3;
  tmpvar_3.w = 1.0;
  tmpvar_3.xyz = ret_1;
  ret = tmpvar_3.xyz;
 }`,Rr={baseVals:Ar,shapes:jr,waves:Mr,init_eqs_str:Nr,frame_eqs_str:Pr,pixel_eqs_str:Fr,warp:Ir,comp:Lr},zr={rating:4,gammaadj:1.98,decay:.5,echo_zoom:1,echo_alpha:.5,echo_orient:3,wave_mode:4,additivewave:1,wave_thick:1,modwavealphabyvolume:1,wave_brighten:0,darken:1,wave_a:.001,wave_scale:.527,wave_smoothing:.45,modwavealphastart:0,modwavealphaend:1.32,warpanimspeed:1.459,warpscale:2.007,zoom:.9999,warp:.01,sx:.9999,wave_r:.8,wave_g:.49,ob_size:.015,ob_a:1,ib_size:.26,mv_x:64,mv_y:48,mv_l:1.85,mv_r:.5,mv_g:.5,mv_b:.5,mv_a:0,b2x:.3,b1ed:0},Br=[{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],Vr=[{baseVals:{enabled:1,samples:506,sep:116,spectrum:1,thick:1,scaling:1.07408,smoothing:0,a:.7},init_eqs_str:`a.n=0;a.m=0;`,frame_eqs_str:``,point_eqs_str:`a.n=Math.floor((a.reg00+.5)*a.sample);a.m=30001+div(a.n,div(a.reg00,a.reg01));a.gmegabuf[Math.floor(a.m)]=a.value1+a.value2;a.x=a.gmegabuf[Math.floor(1E4+a.n)];a.y=a.gmegabuf[Math.floor(15E3+a.n)];a.a=a.gmegabuf[Math.floor(2E4+a.n)];a.b=Math.min(Math.max(a.gmegabuf[Math.floor(25E3+a.n)],0),1);a.r=1-a.b;a.g=.5;`},{baseVals:{enabled:1,samples:506,thick:1,scaling:.89152,smoothing:.82},init_eqs_str:`a.n=0;`,frame_eqs_str:``,point_eqs_str:`a.n=Math.floor((a.reg00+.5)*a.sample)+a.reg00;a.x=a.gmegabuf[Math.floor(1E4+a.n)];a.y=a.gmegabuf[Math.floor(15E3+a.n)];a.a=a.gmegabuf[Math.floor(2E4+a.n)];a.b=Math.min(Math.max(a.gmegabuf[Math.floor(25E3+a.n)],0),1);a.r=1-a.b;a.g=.5;`},{baseVals:{enabled:1,samples:506,thick:1,scaling:.89152,smoothing:.82},init_eqs_str:`a.n=0;`,frame_eqs_str:``,point_eqs_str:`a.n=Math.floor((a.reg00+.5)*a.sample)+2*a.reg00;a.x=a.gmegabuf[Math.floor(1E4+a.n)];a.y=a.gmegabuf[Math.floor(15E3+a.n)];a.a=a.gmegabuf[Math.floor(2E4+a.n)];a.b=Math.min(Math.max(a.gmegabuf[Math.floor(25E3+a.n)],0),1);a.r=1-a.b;a.g=.5;`},{baseVals:{enabled:1,samples:506,spectrum:1,thick:1},init_eqs_str:`a.n=0;`,frame_eqs_str:``,point_eqs_str:`a.n=Math.floor((a.reg00-.5)*a.sample)+3*a.reg00;a.x=a.gmegabuf[Math.floor(1E4+a.n)];a.y=a.gmegabuf[Math.floor(15E3+a.n)];a.a=a.gmegabuf[Math.floor(2E4+a.n)];a.b=Math.min(Math.max(a.gmegabuf[Math.floor(25E3+a.n)],0),1);a.r=1-a.b;a.g=.5;`}],Hr=`a.xang=0;a.fov=0;a.hell=0;a.cbeat=0;a.index2=0;a.bindex=0;a.ran4=0;a.index=0;a.dec_v=0;a.yang=0;a.q29=0;a.q6=0;a.amp_=0;a.xlen=0;a.smooth=0;a.q1=0;a.dec_med=0;a.sum=0;a.q5=0;a.dec_f=0;a.trely=0;a.flen=0;a.reg01=0;a.my=0;a.oz=0;a.imag=0;a.is_beat=0;a.yind=0;a.oy0a=0;a.dec_slow=0;a.ran2=0;a.ind=0;a.z0=0;a.ylen=0;a.real=0;a.ran4_=0;a.ran3=0;a.q4=0;a.mz=0;a.oy0=0;a.amp=0;a.tc0=0;a.oy=0;a.avg=0;a.mx=0;a.vol=0;a.ran2_=0;a.peak=0;a.decc=0;a.q2=0;a.bd_bt=0;a.zang=0;a.q3=0;a.reg00=0;
a.trelz=0;a.q32=0;a.ran3_=0;a.q28=0;a.trelx=0;a.q30=0;a.ox=0;a.xind=0;for(var b=a.index=0;7E4>b;b++)a.megabuf[Math.floor(a.index)]=0,a.gmegabuf[Math.floor(a.index)]=0,a.index+=1;a.zang=1;a.yang=0;a.zang=2;`,Ur=`a.xlen=45;a.ylen=45;a.flen=20;a.reg00=div(a.xlen*a.ylen,4);a.reg01=div(a.reg00,4);a.dec_med=1-div(.06*30,a.fps);a.dec_slow=1-div(.6,a.fps);a.dec_f=pow(.8,div(30,a.fps));a.q30=a.dec_slow;a.smooth=Math.max(1,pow(6,div(a.fps,30))-2);a.cbeat=a.bass+a.mid+a.treb;a.decc=.00001<Math.abs(a.vol>a.cbeat?1:0)?.8:a.dec_med;a.vol=a.vol*a.decc+(1-a.decc)*a.cbeat;a.avg=a.avg*a.dec_slow+a.cbeat*(1-a.dec_slow);a.is_beat=above(a.cbeat,1.5*a.avg)*above(a.time,a.tc0+.2);a.tc0=.00001<Math.abs(bor(a.is_beat,
a.bd_bt))?a.time:a.tc0;a.peak=.00001<Math.abs(a.is_beat)?a.cbeat:a.peak*a.dec_med;a.ind=0;a.sum=0;a.amp=.01;for(var b=0;b<a.reg01;b++)a.sum+=div(a.gmegabuf[Math.floor(a.ind+3E4)],a.reg01),a.amp+=pow(a.gmegabuf[Math.floor(a.ind+3E4)],2),a.ind+=1;a.ind=0;a.amp_=a.amp_*a.dec_med+600*div((1-a.dec_med)*sqrt(a.amp),a.reg01);for(b=0;b<a.reg01;b++)a.megabuf[Math.floor(a.ind+3E4)]=div(a.gmegabuf[Math.floor(a.ind+3E4)]-a.sum,a.amp_),a.ind+=1;for(b=a.index2=0;b<a.flen;b++){a.index=0;a.real=0;for(var c=a.imag=
0;c<a.flen;c++)a.real+=Math.cos(6.28*div(a.index,a.flen)*a.index2)*a.megabuf[Math.floor(div(a.index*a.reg01,8)+30002)],a.imag+=Math.sin(6.28*div(a.index,a.flen)*a.index2)*a.megabuf[Math.floor(div(a.index*a.reg01,8)+30002)],a.index+=1;a.megabuf[Math.floor(1E4+a.index2)]=a.megabuf[Math.floor(1E4+a.index2)]*a.dec_f+a.real;a.megabuf[Math.floor(15E3+a.index2)]=a.megabuf[Math.floor(15E3+a.index2)]*a.dec_f+a.imag;a.index2+=1}a.ind=1;for(b=0;b<div(a.flen,2);b++){a.cx=a.megabuf[Math.floor(1E4+a.ind)];a.cy=
a.megabuf[Math.floor(15E3+a.ind)];a.yind=-1;for(c=0;3>c;c++){a.xind=-1;for(var d=0;3>d;d++)a.ox=mod((a.cx+.5)*a.xlen+a.xind,a.xlen),a.oy=mod((a.cy+.5)*a.ylen+a.yind,a.ylen),a.amp=3*(a.cx*a.cx+a.cy*a.cy),a.megabuf[Math.floor(a.oy*a.ylen+a.ox)]-=div(div(60,a.fps)*sqrt(a.amp)*above(a.amp,.02),1+a.xind*a.xind+a.yind*a.yind),a.xind+=1;a.yind+=1}a.ind+=1}for(b=a.yind=0;b<a.ylen;b++){for(c=a.xind=0;c<a.xlen;c++)a.megabuf[Math.floor(a.yind*a.ylen+a.xind+5E3)]=a.dec_med*(div(a.gmegabuf[Math.floor(a.yind*a.ylen+
mod(a.xind+1,a.xlen))]+a.gmegabuf[Math.floor(a.yind*a.ylen+mod(a.xlen+a.xind-1,a.xlen))]+a.gmegabuf[Math.floor(mod(a.yind+1,a.ylen)*a.ylen+a.xind)]+a.gmegabuf[Math.floor(mod(a.yind+a.ylen-1,a.ylen)*a.ylen+a.xind)]+a.gmegabuf[Math.floor(a.yind*a.ylen+a.xind)]*a.smooth*4,2+2*a.smooth)-a.megabuf[Math.floor(a.yind*a.ylen+a.xind)]),a.xind+=1;a.yind+=1}a.bindex+=a.is_beat;.00001<Math.abs(a.is_beat&&.00001>Math.abs(mod(a.bindex,4)-0)?1:0)?a.ran2=div(randint(100)-50,50):0;.00001<Math.abs(a.is_beat&&.00001>
Math.abs(mod(a.bindex,4)-2)?1:0)?a.ran3=div(randint(100)-50,50):0;.00001<Math.abs(a.is_beat&&.00001>Math.abs(mod(a.bindex,6)-2)?1:0)?a.ran4=div(randint(100)-50,50):0;a.dec_v=Math.min(Math.max(0,1-div(8*a.vol,a.fps)),a.dec_slow);a.ran2_=a.ran2_*a.dec_v+(1-a.dec_v)*a.ran2;a.ran3_=a.ran3_*a.dec_v+(1-a.dec_v)*a.ran3;a.ran4_=a.ran4_*a.dec_v+(1-a.dec_v)*a.ran4;a.trelx+=div(div(a.ran2_,a.fps),7);a.trely+=div(div(a.ran3_,a.fps),2);a.trelz+=div(div(a.ran4_,a.fps),6);a.zang=6*Math.sin(a.trelz);a.xang=6*Math.sin(div(a.zang,
5)+a.trelx);a.yang=6*Math.sin(0*div(a.zang,3)+a.trely);a.q1=Math.cos(a.xang);a.q2=Math.sin(a.xang);a.q3=Math.cos(a.yang);a.q4=Math.sin(a.yang);a.q5=Math.cos(a.zang);a.q6=Math.sin(a.zang);a.fov=1;for(b=a.yind=0;b<a.ylen;b++){for(c=a.xind=0;c<a.xlen;c++)a.ind=a.yind*a.ylen+a.xind,a.megabuf[Math.floor(a.ind)]=a.gmegabuf[Math.floor(a.ind)],a.gmegabuf[Math.floor(a.ind)]=a.megabuf[Math.floor(a.ind+5E3)],a.oz=a.yind-div(a.ylen,2),a.ox=.00001<Math.abs(bnot(mod(a.yind,2)))?a.xind:a.xlen-a.xind-1,a.oy0a=div(a.oy0+
a.oy0a,2.5),a.oy=a.gmegabuf[Math.floor(a.yind*a.ylen+a.ox)],a.oy0=a.oy,a.ox-=div(a.xlen,2),a.mx=a.ox*a.q5-a.oy*a.q6,a.my=a.ox*a.q6+a.oy*a.q5,a.ox=a.mx,a.oy=a.my,a.mx=a.ox*a.q3+a.oz*a.q4,a.mz=-a.ox*a.q4+a.oz*a.q3,a.ox=a.mx,a.oz=a.mz,a.my=a.oy*a.q1-a.oz*a.q2,a.mz=a.oy*a.q2+a.oz*a.q1,a.z0=12+20*Math.sin(14*a.trelz),a.oy=a.my,a.oz=a.mz+a.z0,a.gmegabuf[Math.floor(1E4+a.ind)]=div(a.fov*a.ox,a.oz+60*a.fov)+.5,a.gmegabuf[Math.floor(15E3+a.ind)]=div(a.fov*a.oy,a.oz+60*a.fov)+.5,a.hell=Math.max(Math.min(.5+
div(a.oy0,4),1),.2),a.gmegabuf[Math.floor(2E4+a.ind)]=Math.max(Math.min(a.hell*(.5+.1*(a.oy0a-a.oy0)),1),.1),a.gmegabuf[Math.floor(25E3+a.ind)]=div(a.oy0,16)+.5,a.xind+=1;a.yind+=1}a.q29=div(20,a.z0+25);a.q32=a.aspecty;a.q28=Math.min(div(a.vol,3)-.25,1);a.monitor=a.dec_v;`,Wr=`a.rot=0;a.zoom=1.1;a.warp=0;a.dy=.02;`,Gr=` shader_body { 
  vec4 tmpvar_1;
  tmpvar_1.w = 1.0;
  tmpvar_1.xyz = vec3(0.0, 0.0, 0.0);
  ret = tmpvar_1.xyz;
 }`,Kr=`vec3 xlat_mutablecol;
 shader_body { 
  vec2 uv_1;
  uv_1 = uv;
  int iter_3;
  vec3 ret_4;
  ret_4 = texture (sampler_main, uv).xyz;
  iter_3 = int((clamp (q29, 0.0, 1.0) * 8.0));
  for (int n_2 = 1; n_2 < iter_3; n_2++) {
    vec2 tmpvar_5;
    tmpvar_5.y = 0.0;
    tmpvar_5.x = float(n_2);
    vec2 tmpvar_6;
    tmpvar_6.y = 0.0;
    tmpvar_6.x = float(n_2);
    ret_4 = max (max (ret_4, texture (sampler_main, (uv_1 - 
      (texsize.zw * tmpvar_5)
    )).xyz), texture (sampler_main, (uv_1 + (texsize.zw * tmpvar_6))).xyz);
  };
  float tmpvar_7;
  tmpvar_7 = clamp ((1.0 - (2.0 * 
    dot (ret_4, vec3(0.32, 0.49, 0.29))
  )), 0.0, 1.0);
  vec3 tmpvar_8;
  tmpvar_8.x = q2;
  tmpvar_8.y = q4;
  tmpvar_8.z = q6;
  xlat_mutablecol = (0.5 + (0.5 * tmpvar_8));
  vec3 x_9;
  x_9 = ((uv.x - (ret_4 * 4.0)) + 0.5);
  ret_4 = (ret_4 * (q28 + (
    ((6.0 * (0.05 / sqrt(
      dot (x_9, x_9)
    ))) * (1.0 + xlat_mutablecol))
   / 2.0)));
  float tmpvar_10;
  float tmpvar_11;
  tmpvar_11 = (uv.x - 0.5);
  tmpvar_10 = (0.5 / ((uv.y + 
    (tmpvar_11 * (q5 * q3))
  ) - 0.4));
  vec2 tmpvar_12;
  tmpvar_12.x = (tmpvar_10 * tmpvar_11);
  tmpvar_12.y = tmpvar_10;
  vec2 tmpvar_13;
  tmpvar_13.x = q1;
  tmpvar_13.y = (q3 + time);
  float tmpvar_14;
  tmpvar_14 = (((
    (texture (sampler_noise_lq, (tmpvar_12 + tmpvar_13)).x * tmpvar_7)
   * 
    float((tmpvar_10 > 0.0))
  ) * 0.2) * min (1.0, (1.0/(tmpvar_10))));
  ret_4 = (ret_4 + tmpvar_14);
  ret_4 = (ret_4 + ((
    ((sin((16.0 * q2)) * 2.0) * tmpvar_7)
   * tmpvar_14) * dot (
    (12.0 * ((texture (sampler_blur1, (tmpvar_12 - vec2(-0.5, 0.3))).xyz * scale1) + bias1))
  , vec3(0.32, 0.49, 0.29))));
  ret_4 = (ret_4 + ((
    ((0.5 / abs(tmpvar_10)) * normalize(xlat_mutablecol))
   * 
    float((tmpvar_10 < 0.0))
  ) * tmpvar_7));
  vec4 tmpvar_15;
  tmpvar_15.w = 1.0;
  tmpvar_15.xyz = ret_4;
  ret = tmpvar_15.xyz;
 }`,qr={baseVals:zr,shapes:Br,waves:Vr,init_eqs_str:Hr,frame_eqs_str:Ur,pixel_eqs_str:Wr,warp:Gr,comp:Kr},Jr={rating:0,gammaadj:1.980001,decay:.5,echo_zoom:.999998,echo_alpha:.5,echo_orient:3,wave_mode:1,additivewave:1,wave_thick:1,modwavealphabyvolume:1,darken:1,wave_a:.001,wave_scale:2.232543,wave_smoothing:.81,wave_mystery:-.12,modwavealphastart:.47,modwavealphaend:1.32,warpanimspeed:1.4595,warpscale:2.0067,zoom:.9999,warp:.01,sx:.9999,wave_r:0,wave_g:0,wave_b:.3,ob_r:1,ob_g:1,ob_b:1,ib_size:.26,mv_x:64,mv_y:48,mv_l:1.85,mv_r:.4999,mv_g:.4999,mv_b:.4999,mv_a:0,b1ed:.7},Yr=[{baseVals:{enabled:1,y:.06,rad:.981146,ang:.753982,tex_zoom:.33105,r:0,g:.7,b:.79,a:.08,g2:.5,b2:.69,a2:.03,border_b:0,border_a:0},init_eqs_str:``,frame_eqs_str:``},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],Xr=[{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],Zr=`a.index2=0;a.index4=0;a.index=0;a.q22=0;a.q21=0;a.q29=0;a.q1=0;a.dec_med=0;a.index3=0;a.rott=0;a.is_beat=0;a.q23=0;a.k1=0;a.q24=0;a.dec_slow=0;a.q4=0;a.q26=0;a.p2=0;a.avg=0;a.beat=0;a.p1=0;a.peak=0;a.q2=0;a.q27=0;a.q3=0;a.t0=0;a.q28=0;a.q20=0;`,Qr=`a.dec_med=pow(.9,div(30,a.fps));a.dec_slow=pow(.99,div(30,a.fps));a.beat=Math.max(Math.max(a.bass,a.mid),a.treb);a.avg=a.avg*a.dec_slow+a.beat*(1-a.dec_slow);a.is_beat=above(a.beat,.5+a.avg+a.peak)*above(a.time,a.t0+.2);a.t0=a.is_beat*a.time+(1-a.is_beat)*a.t0;a.peak=a.is_beat*a.beat+(1-a.is_beat)*a.peak*a.dec_med;a.index=mod(a.index+a.is_beat,8);a.index2=mod(a.index2+a.is_beat*bnot(a.index),5);a.index3=mod(a.index3+a.is_beat*bnot(a.index)*bnot(a.index2),3);a.q20=a.avg;a.q21=
a.beat;a.q22=a.peak;a.q23=a.index;a.q24=a.is_beat;a.q26=a.bass+a.mid+a.treb;a.k1=a.is_beat*equal(a.index,0);a.p1=a.k1*(a.p1+1)+(1-a.k1)*a.p1;a.p2=a.dec_slow*a.p2+(1-a.dec_slow)*a.p1;a.rott=div(3.14159265359*a.p2,2);a.q27=8-a.index;a.q28=a.index3;a.q29=a.index4;a.q1=Math.cos(a.rott);a.q2=Math.sin(a.rott);a.q3=-a.q2;a.q4=a.q1;a.warp=.3*Math.sin(6.28*div(a.index+a.index2,8));`,$r=`a.rot=-.04*a.q2*(1-a.rad);a.dx=0;a.zoom=1.002+.04*a.rad;`,ei=` shader_body { 
  vec2 dz_1;
  vec2 tmpvar_2;
  tmpvar_2.x = dot ((texture (sampler_main, (uv + vec2(0.002, 0.0))) - texture (sampler_main, (uv - vec2(0.002, 0.0)))), vec4(0.32, 0.49, 0.29, 0.0));
  tmpvar_2.y = dot ((texture (sampler_main, (uv + vec2(0.0, 0.002))) - texture (sampler_main, (uv - vec2(0.0, 0.002)))), vec4(0.32, 0.49, 0.29, 0.0));
  dz_1 = (sqrt(tmpvar_2) / 8.0);
  vec4 tmpvar_3;
  tmpvar_3.w = 1.0;
  tmpvar_3.xyz = ((texture (sampler_main, (
    (uv - (dz_1 * 0.01))
   + 
    ((((texture (sampler_blur1, uv).xyz * scale1) + bias1) * 0.01) * q22)
  .xy)).xyz - (
    sqrt(dot (dz_1, dz_1))
   * 0.5)) + ((0.02 * vec3(
    (dot (texture (sampler_noise_lq, uv), vec4(0.32, 0.49, 0.29, 0.0)) - 0.2)
  )) * (1.0 - rad)));
  ret = tmpvar_3.xyz;
 }`,ti=`vec3 xlat_mutableret1;
vec2 xlat_mutablers;
vec2 xlat_mutablers0;
vec2 xlat_mutableuv3;
 shader_body { 
  vec2 uv_1;
  uv_1.x = uv.x;
  float z_2;
  uv_1.y = (uv.y - 0.1);
  vec2 tmpvar_3;
  tmpvar_3 = ((uv_1 - 0.5) * aspect.xy);
  z_2 = (0.3 / tmpvar_3.y);
  xlat_mutablers0.x = (tmpvar_3.x * z_2);
  xlat_mutablers0.y = z_2;
  xlat_mutablers.x = (xlat_mutablers0.x + (time / 2.0));
  xlat_mutablers.y = (z_2 + time);
  float tmpvar_4;
  tmpvar_4 = clamp ((12.0 * tmpvar_3.y), 0.0, 1.0);
  vec2 tmpvar_5;
  tmpvar_5 = fract(((tmpvar_3 + 0.5) - (
    ((vec3(dot (texture (sampler_noise_hq, (xlat_mutablers / 2.0)), vec4(0.32, 0.49, 0.29, 0.0))) - 0.55) * 0.1)
   * tmpvar_4).xy));
  vec2 tmpvar_6;
  tmpvar_6.y = 0.0;
  tmpvar_6.x = texsize.z;
  vec2 tmpvar_7;
  tmpvar_7.x = 0.0;
  tmpvar_7.y = texsize.w;
  vec2 tmpvar_8;
  tmpvar_8.x = dot ((texture (sampler_main, (tmpvar_5 + tmpvar_6)).xyz - texture (sampler_main, (tmpvar_5 - tmpvar_6)).xyz), vec3(0.32, 0.49, 0.29));
  tmpvar_8.y = dot ((texture (sampler_main, (tmpvar_5 + tmpvar_7)).xyz - texture (sampler_main, (tmpvar_5 - tmpvar_7)).xyz), vec3(0.32, 0.49, 0.29));
  xlat_mutableuv3 = (tmpvar_5 + (tmpvar_8 * (1.0 - tmpvar_4)));
  vec2 x_9;
  x_9 = ((tmpvar_3 + 0.45) + (tmpvar_8 * 16.0));
  xlat_mutableret1 = (texture (sampler_main, fract(xlat_mutableuv3)).xyz * (1.0 - (tmpvar_4 / 2.0)));
  float tmpvar_10;
  tmpvar_10 = clamp ((1.0 - dot (
    (xlat_mutableret1 * 4.0)
  , vec3(0.32, 0.49, 0.29))), 0.0, 1.0);
  vec4 tmpvar_11;
  tmpvar_11.w = 1.0;
  tmpvar_11.xyz = (max ((xlat_mutableret1 + 
    ((vec3((0.02 / sqrt(
      dot (x_9, x_9)
    ))) * (1.0 - tmpvar_4)) * 2.0)
  ), vec3((
    (clamp ((1.0/((float(mod (
      ((uv.x * 3234224.0) * uv_1.y)
    , 22345.0))))), 0.0, 1.0) * (1.0 - tmpvar_4))
   * tmpvar_10))) + clamp ((
    (q22 * clamp (((
      (0.01 * abs((xlat_mutableuv3.x - 0.5)))
     / 
      abs((xlat_mutableuv3.y - 0.55))
    ) - (tmpvar_8 * 4.0)), 0.0, 1.0).x)
   * tmpvar_10), 0.0, 1.0));
  ret = tmpvar_11.xyz;
 }`,ni={baseVals:Jr,shapes:Yr,waves:Xr,init_eqs_str:Zr,frame_eqs_str:Qr,pixel_eqs_str:$r,warp:ei,comp:ti},ri={rating:3,gammaadj:1.98,decay:.5,echo_zoom:1,echo_alpha:.5,echo_orient:3,wave_mode:5,wave_dots:1,wave_thick:1,wave_brighten:0,darken:1,wave_a:.001,wave_scale:5.552,wave_smoothing:.504,wave_mystery:-1,modwavealphastart:.71,modwavealphaend:1.3,warpanimspeed:1.459,warpscale:2.007,zoom:.9999,warp:.01,sx:.9999,wave_g:0,wave_b:0,ob_r:1,ob_g:1,ob_b:1,ib_size:.26,mv_x:64,mv_y:48,mv_l:.85,mv_r:.5,mv_g:.5,mv_b:.5,mv_a:0,b1ed:0},ii=[{baseVals:{enabled:1,sides:100,textured:1,y:.39,rad:.5113,tex_zoom:.86135,g:1,b:1,r2:1,b2:1,a2:.5,border_a:0},init_eqs_str:``,frame_eqs_str:`a.tex_ang=div(a.time,8);a.x=.5+.1*Math.sin(div(a.time,23));a.y=.5+.1*Math.cos(div(a.time,16));`},{baseVals:{enabled:0}},{baseVals:{enabled:1,sides:5,additive:1,x:.9,rad:.22613,g:.6,g2:0,border_a:0},init_eqs_str:``,frame_eqs_str:`a.x=.05+div(randint(900),1E3);a.y=.05+div(randint(900),1E3);a.ang=div(randint(320),100);a.r=.5+.5*Math.sin(div(a.time,7));a.g=.5+.5*Math.sin(div(a.time,12));a.b=.5+.5*Math.sin(div(a.time,4));a.r2=.5+.5*Math.sin(div(a.time,4));a.g2=.5+.5*Math.sin(div(a.time,9));a.b2=.5+.5*Math.sin(div(a.time,17));`},{baseVals:{enabled:0}}],ai=[{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],oi=`a.index=0;a.q22=0;a.q21=0;a.q1=0;a.dec_med=0;a.rott=0;a.is_beat=0;a.q23=0;a.k1=0;a.q24=0;a.dec_slow=0;a.q4=0;a.q26=0;a.p2=0;a.avg=0;a.beat=0;a.p1=0;a.peak=0;a.q2=0;a.q27=0;a.q3=0;a.t0=0;a.q32=0;a.q20=0;`,si=`a.dec_med=pow(.9,div(30,a.fps));a.dec_slow=pow(.99,div(30,a.fps));a.beat=Math.max(Math.max(a.bass,a.mid),a.treb);a.avg=a.avg*a.dec_slow+a.beat*(1-a.dec_slow);a.is_beat=above(a.beat,.2+a.avg+a.peak)*above(a.time,a.t0+.2);a.t0=a.is_beat*a.time+(1-a.is_beat)*a.t0;a.peak=a.is_beat*a.beat+(1-a.is_beat)*a.peak*a.dec_med;a.index=mod(a.index+a.is_beat,8);a.q20=a.avg;a.q21=a.beat;a.q22=a.peak;a.q23=a.index;a.q24=a.is_beat;a.q26=a.bass+a.mid+a.treb;a.k1=a.is_beat*equal(a.index,0);a.p1=
a.k1*(a.p1+1)+(1-a.k1)*a.p1;a.p2=a.dec_med*a.p2+(1-a.dec_med)*a.p1;a.rott=div(3.1416*a.p2,2);a.q27=a.index+1;a.q1=Math.cos(a.rott);a.q2=Math.sin(a.rott);a.q3=-a.q2;a.q4=a.q1;a.zoom=1.01;a.rot=-0*a.index;a.q32=pow(.996,div(30,a.fps));`,ci=` shader_body { 
  vec2 tmpvar_1;
  tmpvar_1 = ((uv * texsize.xy) * 0.03);
  vec2 tmpvar_2;
  tmpvar_2.x = (cos((tmpvar_1.y * q1)) * sin(-(tmpvar_1.y)));
  tmpvar_2.y = (sin(tmpvar_1.x) * cos((tmpvar_1.y * q2)));
  vec4 tmpvar_3;
  tmpvar_3.w = 1.0;
  tmpvar_3.xyz = ((texture (sampler_main, (uv - 
    ((tmpvar_2 * texsize.zw) * 18.0)
  )).xyz * 0.99) - 0.01);
  ret = tmpvar_3.xyz;
 }`,li=`vec3 xlat_mutableret1;
vec2 xlat_mutablers;
vec2 xlat_mutableuv1;
float xlat_mutablez;
 shader_body { 
  xlat_mutableuv1 = (uv - 0.5);
  xlat_mutablez = (0.2 / abs((xlat_mutableuv1.y * xlat_mutableuv1.x)));
  xlat_mutablers.x = ((xlat_mutableuv1.x * xlat_mutablez) + (time * sign(xlat_mutableuv1.x)));
  xlat_mutablers.y = (xlat_mutablez / 2.0);
  vec4 tmpvar_1;
  tmpvar_1 = texture (sampler_noise_hq, xlat_mutablers);
  xlat_mutableret1 = ((tmpvar_1.xyz * vec3(
    greaterThanEqual (tmpvar_1.xyz, vec3(0.0, 0.0, 0.0))
  )) - 0.5);
  float tmpvar_2;
  tmpvar_2 = clamp ((64.0 * xlat_mutableuv1.y), 0.0, 1.0);
  vec2 tmpvar_3;
  tmpvar_3 = fract(((
    (xlat_mutableuv1 * (1.0 - abs(xlat_mutableuv1.x)))
   - 0.5) - (
    (xlat_mutableret1 * 0.05)
   * tmpvar_2).xy));
  vec2 tmpvar_4;
  tmpvar_4.x = (1.0 - tmpvar_3.x);
  tmpvar_4.y = tmpvar_3.y;
  vec3 tmpvar_5;
  tmpvar_5 = ((0.5 * texture (sampler_main, tmpvar_3)) + (0.5 * texture (sampler_main, tmpvar_4))).xyz;
  xlat_mutableret1 = tmpvar_5;
  float x_6;
  x_6 = (tmpvar_3.y - 0.52);
  xlat_mutableuv1 = (xlat_mutableuv1 * aspect.xy);
  vec2 tmpvar_7;
  tmpvar_7 = cos(((xlat_mutableuv1 * 2.0) + 2.0));
  vec4 tmpvar_8;
  tmpvar_8.w = 1.0;
  tmpvar_8.xyz = (((
    (tmpvar_5 * 2.0)
   + 
    (((0.03 * rand_preset) / (0.02 + sqrt(
      (x_6 * x_6)
    ))) * (1.0 - dot ((tmpvar_5 * 2.0), vec3(0.32, 0.49, 0.29))))
  .xyz) + clamp (
    (0.03 / sqrt(dot (tmpvar_7, tmpvar_7)))
  , 0.0, 1.0)) + ((
    ((rand_preset * clamp ((0.5 - uv.y), 0.0, 1.0)) * (1.0 + slow_roam_cos))
   / 4.0) * (1.0 - tmpvar_2)).xyz);
  ret = tmpvar_8.xyz;
 }`,ui={baseVals:ri,shapes:ii,waves:ai,init_eqs_str:oi,frame_eqs_str:si,pixel_eqs_str:``,pixel_eqs:``,warp:ci,comp:li},di={rating:5,gammaadj:1.980001,decay:.5,echo_zoom:.999998,echo_alpha:.5,echo_orient:3,wave_mode:2,modwavealphabyvolume:1,wave_brighten:0,darken:1,wave_a:.001,wave_scale:20.944651,wave_smoothing:0,wave_mystery:.08,modwavealphastart:0,modwavealphaend:1.32,warpanimspeed:1.4595,warpscale:2.0067,zoom:.9999,warp:.01,sx:.9999,wave_r:0,wave_g:.99,ob_size:.015,ob_b:1,ib_size:.26,mv_x:64,mv_y:48,mv_l:1.85,mv_r:.4999,mv_g:.4999,mv_b:.4999,mv_a:0,b1ed:0},fi=[{baseVals:{enabled:1,additive:1,rad:.059738,tex_ang:1.00531,tex_zoom:1.531168,r:.5,b:.7,g2:0,a2:1,border_r:0,border_b:0,border_a:0},init_eqs_str:`a.q24=0;a.q22=0;`,frame_eqs_str:`a.x=.5;a.y=.5;a.a=.3;a.a2=a.q24;a.b=.8;a.r=Math.min(1,div(a.q22,3)+.3);`},{baseVals:{enabled:0}},{baseVals:{enabled:1,sides:100,textured:1,rad:.210912,tex_zoom:.050685,g:1,b:1,a:.6,r2:1,b2:1,a2:.2999,border_a:0},init_eqs_str:`a.t_rel=0;a.t1=0;a.t_rel=0;a.t_rel=0;a.t1=0;`,frame_eqs_str:`a.t_rel=div(a.time,8);a.t1=a.t_rel-Math.floor(a.t_rel);a.tex_zoom=a.t1;`},{baseVals:{enabled:0}}],pi=[{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],mi=`a.index2=0;a.index=0;a.q22=0;a.q21=0;a.q6=0;a.q1=0;a.dec_med=0;a.q5=0;a.rott=0;a.is_beat=0;a.q31=0;a.q23=0;a.k1=0;a.q24=0;a.dec_slow=0;a.q10=0;a.q4=0;a.q26=0;a.p2=0;a.avg=0;a.beat=0;a.vol=0;a.p1=0;a.peak=0;a.q2=0;a.q27=0;a.p3=0;a.q3=0;a.t0=0;a.q7=0;a.q28=0;a.q30=0;a.q20=0;a.p4=0;a.step=0;a.step=0;`,hi=`a.dec_med=pow(.7,div(30,a.fps));a.dec_slow=pow(.99,div(30,a.fps));a.beat=Math.max(Math.max(a.bass,a.mid),a.treb);a.avg=a.avg*a.dec_slow+a.beat*(1-a.dec_slow);a.is_beat=above(a.beat,0+a.avg+a.peak)*above(a.time,a.t0+.2);a.t0=a.is_beat*a.time+(1-a.is_beat)*a.t0;a.peak=a.is_beat*a.beat+(1-a.is_beat)*a.peak*a.dec_med;a.index=mod(a.index+a.is_beat,16);a.index2=mod(a.index2+a.is_beat*bnot(a.index),2);a.q20=a.avg;a.q21=a.beat;a.q22=a.peak;a.q23=a.index;a.q24=a.is_beat;a.q26=a.bass_att+
a.mid_att+a.treb_att;a.q27=a.index+1;a.q28=a.index2;a.k1=a.is_beat*equal(mod(a.index,2),0);a.p1=a.k1*(a.p1+1)+(1-a.k1)*a.p1;a.p2=a.dec_med*a.p2+(1-a.dec_med)*a.p1;a.rott=div(3.1416*a.p2,8);a.q1=Math.cos(a.rott);a.q2=Math.sin(a.rott);a.q3=-a.q2;a.q4=a.q1;a.step+=a.q24;a.p3=a.p3*a.dec_slow+(1-a.dec_slow)*a.step;a.q30=a.step;a.p4=a.dec_slow*a.p4+(1-a.dec_slow)*a.q27;a.q31=a.p4;a.vol=a.bass+a.mid+a.treb;a.q5=2*div(a.bass_att,a.vol);a.q6=2*div(a.mid_att,a.vol);a.q7=2*div(a.treb_att,a.vol);a.q10=.3*Math.abs(Math.sin(div(a.time,
5)));a.zoom=1;a.rot=-.001;`,gi=`a.zoom=1;`,_i=`vec3 xlat_mutablemus;
 shader_body { 
  vec2 uv_1;
  uv_1 = uv;
  vec2 rs_2;
  vec2 uv6_3;
  vec2 tmpvar_4;
  tmpvar_4 = ((uv_orig - 0.5) * aspect.xy);
  uv6_3 = tmpvar_4;
  float theta_5;
  theta_5 = ((q1 * (
    (6.0 * q2)
   * 
    sqrt(dot (tmpvar_4, tmpvar_4))
  )) + q30);
  vec2 tmpvar_6;
  tmpvar_6 = clamp (((
    sin(theta_5)
   / 
    cos(theta_5)
  ) * -(
    normalize((1.0/(tmpvar_4)))
  )), vec2(-8.0, -8.0), vec2(8.0, 8.0));
  rs_2 = tmpvar_6;
  if ((q28 == 1.0)) {
    rs_2 = (tmpvar_6 * cos((
      (tmpvar_4.yx * 3.0)
     * q27)));
  };
  uv_1 = (uv + (rs_2 / 40.0));
  vec2 tmpvar_7;
  tmpvar_7.x = rad;
  tmpvar_7.y = sqrt(dot (tmpvar_4, tmpvar_4));
  uv6_3 = (0.5 * tmpvar_7);
  xlat_mutablemus = (vec3(clamp ((0.08 / 
    sqrt((uv6_3.y - q10))
  ), 0.0, 1.0)) * vec3(1.0, 0.84, 0.5));
  vec4 tmpvar_8;
  tmpvar_8.w = 1.0;
  tmpvar_8.xyz = (((
    (texture (sampler_main, uv_1).xyz - (((texture (sampler_blur1, 
      fract(uv_1)
    ).xyz * scale1) + bias1) * 0.04))
   + 
    (0.05 * xlat_mutablemus)
  ) * 0.98) - 0.006);
  ret = tmpvar_8.xyz;
 }`,vi=` shader_body { 
  vec2 uv1_1;
  vec3 tmpvar_2;
  tmpvar_2 = (texture (sampler_main, uv) * (1.0 - rad)).xyz;
  vec2 tmpvar_3;
  tmpvar_3.y = 0.0;
  tmpvar_3.x = texsize.z;
  vec2 tmpvar_4;
  tmpvar_4.x = 0.0;
  tmpvar_4.y = texsize.w;
  vec2 tmpvar_5;
  tmpvar_5.x = (texture (sampler_main, (uv - tmpvar_3)).xyz - texture (sampler_main, (uv + tmpvar_3)).xyz).x;
  tmpvar_5.y = (texture (sampler_main, (uv - tmpvar_4)).xyz - texture (sampler_main, (uv + tmpvar_4)).xyz).x;
  uv1_1 = ((0.3 * cos(
    ((uv - 0.5) * 2.0)
  )) - tmpvar_5);
  float tmpvar_6;
  tmpvar_6 = clamp ((0.04 / sqrt(
    dot (uv1_1, uv1_1)
  )), 0.0, 1.0);
  uv1_1 = ((0.3 * cos(
    (uv1_1 * 12.0)
  )) - (9.0 * tmpvar_5));
  vec4 tmpvar_7;
  tmpvar_7.w = 1.0;
  tmpvar_7.xyz = ((-(tmpvar_2) + tmpvar_6) + ((12.0 * vec3(
    clamp ((0.04 / sqrt(dot (uv1_1, uv1_1))), 0.0, 1.0)
  )) * sqrt(tmpvar_2)));
  ret = tmpvar_7.xyz;
 }`,yi={baseVals:di,shapes:fi,waves:pi,init_eqs_str:mi,frame_eqs_str:hi,pixel_eqs_str:gi,warp:_i,comp:vi},bi={rating:4,gammaadj:1.98,decay:.5,echo_zoom:.952,echo_alpha:.5,echo_orient:3,wave_mode:6,additivewave:1,wave_thick:1,modwavealphabyvolume:1,wave_brighten:0,darken:1,wave_a:.001,wave_scale:2.103,wave_smoothing:.54,wave_mystery:.38,modwavealphastart:.81,modwavealphaend:1.4,warpanimspeed:1.459,warpscale:2.007,zoom:.9999,warp:.01,sx:.9999,wave_r:0,wave_g:0,wave_b:0,ob_size:.015,ob_b:1,ib_size:.26,mv_x:64,mv_y:48,mv_l:1.85,mv_r:.5,mv_g:.5,mv_b:.5,mv_a:0,b1ed:0},xi=[{baseVals:{enabled:1,sides:16,thickoutline:1,textured:1,num_inst:3,x:.73,rad:.29466,tex_zoom:1.87511,r:.7,g:.7,b:1,g2:0,border_b:0,border_a:0},init_eqs_str:`a.trig=0;a.q25=0;a.trig=0;a.x0=0;a.x0=0;a.trig=0;a.trig=0;a.y0=0;a.y0=0;a.trig=0;a.trig=0;a.x0=0;a.y0=0;`,frame_eqs_str:`a.trig=a.q25;a.a=.8*a.trig;a.a2=0;a.x0=a.x0*bnot(a.trig)+div(a.trig*randint(100),100);a.y0=a.y0*bnot(a.trig)+div(a.trig*randint(100),100);a.tex_ang=randint(20);a.rad=.1+div(randint(10),8);a.x=a.x0;a.y=a.y0;a.r=.7+.3*Math.sin(div(a.time,12));a.b=.7+.3*Math.sin(div(a.time,15));a.g=.7+.3*Math.sin(div(a.time,8));a.r2=a.r;a.b2=a.b;a.g2=a.g;`},{baseVals:{enabled:1,sides:36,thickoutline:1,textured:1,num_inst:4,x:.3,rad:.05429,ang:1.25664,tex_ang:.37699,tex_zoom:1.02841,g:.7,b:.5,r2:1,g2:0,border_g:.59,border_b:0,border_a:0},init_eqs_str:`a.q31=0;a.q32=0;a.q30=0;`,frame_eqs_str:`a.x=a.q31;a.y=a.q32;a.rad=.06;a.tex_ang=a.time;a.a=a.q30;`},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],Si=[{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],Ci=`a.q25=0;a.index=0;a.q12=0;a.q22=0;a.q21=0;a.q15=0;a.q29=0;a.q6=0;a.dec_med=0;a.q5=0;a.mindev=0;a.trel=0;a.t0a=0;a.mov1=0;a.vis=0;a.is_beat=0;a.q31=0;a.q23=0;a.q24=0;a.dec_slow=0;a.q11=0;a.hpeak=0;a.q10=0;a.sdev=0;a.med=0;a.spb=0;a.dir=0;a.spb_=0;a.q16=0;a.rota=0;a.q19=0;a.vol=0;a.peak=0;a.trig1=0;a.wamp=0;a.speed=0;a.t0=0;a.vol_=0;a.q32=0;a.q7=0;a.wamp_=0;a.q30=0;a.q20=0;a.q8=0;a.t0a=a.time;a.t0=a.time+.5;a.spb_=.5;a.volb=.5;a.volx=.5;a.vol_=1;a.index=0;a.mov1=0;a.sdev=.1;a.wamp_=
.1;`,wi=`a.dec_med=pow(.8,div(30,a.fps));a.dec_slow=pow(.95,div(30,a.fps));a.vol=div(a.bass+a.med+a.treb,1.5);a.vol_=a.vol_*a.dec_slow+(1-a.dec_slow)*a.vol;a.is_beat=above(a.vol,a.vol_+2*a.peak)*above(a.time,a.t0+.45*a.spb_);a.t0a=.00001<Math.abs(a.is_beat)?a.t0:a.t0a;a.t0=.00001<Math.abs(a.is_beat)?a.time:a.t0;a.peak=.00001<Math.abs(a.is_beat)?a.vol:a.peak*a.dec_med;a.index=mod(a.index+a.is_beat,128);a.spb=Math.min(a.t0-a.t0a+.01,2);a.spb_=.00001<Math.abs(a.is_beat)?.9*a.spb_+.1*a.spb:
a.spb_;a.q20=a.vol_;a.q21=above(a.vol,2.7*a.vol_);a.q22=Math.max(0,a.peak-0)+.01;a.hpeak=a.hpeak*a.dec_med+(1-a.dec_med)*a.q21;a.q23=a.hpeak*(1+randint(8));a.q24=a.is_beat;a.q25=div(a.q22*(1+randint(8)),8);a.mindev=Math.min(Math.min(Math.abs(a.spb-a.spb_),Math.abs(2*a.spb-a.spb_)),Math.abs(a.spb-2*a.spb_));a.sdev=.00001<Math.abs(a.is_beat)?.8*a.sdev+.2*pow(a.mindev+.02,2):a.sdev;a.speed=div(div(1,a.fps),a.spb_);a.trel+=a.speed;a.q10=a.trel;a.wamp=Math.min(div(.001,a.sdev),.15);a.wamp_=a.wamp_*a.dec_slow+
(1-a.dec_slow)*a.wamp;a.q11=Math.sin(div(a.trel,2))*a.wamp_;a.q12=div(a.wamp_,2);a.rota=2*a.wamp_*Math.sin(div(a.trel,3));a.q5=Math.cos(a.rota);a.q6=Math.sin(a.rota);a.q7=-a.q6;a.q8=a.q5;a.q15=.05*-Math.sin(.5*a.trel);a.q16=div(Math.cos(a.trel)*a.wamp_,2);a.q19=.1*Math.sin(div(a.trel,12));a.trig1=bnot(a.vis)*bnot(randint(100*a.fps));a.vis=.00001<Math.abs(a.trig1)?1:a.vis*below(a.mov1,1);a.q30=a.vis;a.mov1=.00001<Math.abs(a.vis)?a.mov1+div(2*a.speed,a.fps):-1;a.dir=.00001<Math.abs(a.trig1)?randint(100):
a.dir;a.q31=.5+.5*Math.cos(a.dir)*a.mov1;a.q32=.5+.5*Math.sin(a.dir)*a.mov1;a.q29=2+Math.sin(div(a.time,17));a.monitor=a.wamp;`,Ti=`a.zoom=1+.02*a.rad*a.q20;a.dy=-0;a.warp=.1;a.dx=0;`,Ei=`mat2 ofs;
vec2 xlat_mutableuv2;
float xlat_mutablezv;
 shader_body { 
  mat2 tmpvar_1;
  tmpvar_1[uint(0)].x = texsize.z;
  tmpvar_1[uint(0)].y = 0.0;
  tmpvar_1[1u].x = 0.0;
  tmpvar_1[1u].y = texsize.w;
  ofs = (tmpvar_1 * 4.0);
  vec2 tmpvar_2;
  tmpvar_2.x = ((uv.x - 0.5) + q19);
  tmpvar_2.y = (uv.y - 0.5);
  vec2 v_3;
  v_3.x = ofs[0].x;
  v_3.y = ofs[1].x;
  vec2 v_4;
  v_4.x = ofs[0].x;
  v_4.y = ofs[1].x;
  vec2 v_5;
  v_5.x = ofs[0].y;
  v_5.y = ofs[1].y;
  vec2 v_6;
  v_6.x = ofs[0].y;
  v_6.y = ofs[1].y;
  vec2 tmpvar_7;
  tmpvar_7.x = (texture (sampler_main, (uv + v_3)) - texture (sampler_main, (uv - v_4))).z;
  tmpvar_7.y = (texture (sampler_main, (uv + v_5)) - texture (sampler_main, (uv - v_6))).z;
  xlat_mutablezv = (time * 0.08);
  vec2 tmpvar_8;
  tmpvar_8.x = (0.02 * time);
  tmpvar_8.y = (-0.05 * time);
  xlat_mutableuv2 = ((3.0 * tmpvar_2) + tmpvar_8);
  vec3 tmpvar_9;
  tmpvar_9.xy = xlat_mutableuv2;
  tmpvar_9.z = xlat_mutablezv;
  vec3 tmpvar_10;
  tmpvar_10.xy = (xlat_mutableuv2 * vec2(2.0, 2.0));
  tmpvar_10.z = (xlat_mutablezv * 2.0);
  vec3 tmpvar_11;
  tmpvar_11.xy = (xlat_mutableuv2 * vec2(4.0, 4.0));
  tmpvar_11.z = (xlat_mutablezv * 3.0);
  vec3 tmpvar_12;
  tmpvar_12.xy = (xlat_mutableuv2 * vec2(8.0, 8.0));
  tmpvar_12.z = (xlat_mutablezv * 7.0);
  xlat_mutableuv2 = (tmpvar_2 + ((
    (((texture (sampler_noisevol_hq, tmpvar_9).z + (texture (sampler_noisevol_hq, tmpvar_10).z / 2.0)) + (texture (sampler_noisevol_hq, tmpvar_11).z / 4.0)) + (texture (sampler_noisevol_hq, tmpvar_12).z / 8.0))
   - 1.0) * 0.1));
  vec4 tmpvar_13;
  tmpvar_13.w = 1.0;
  tmpvar_13.xyz = (((
    (((0.2 + (
      (((1.0 + bass_att) * 0.01) / sqrt(dot (xlat_mutableuv2, xlat_mutableuv2)))
     * 
      (1.0 + normalize(slow_roam_cos))
    .xyz)) + ((rand_preset.z - 0.5) * xlat_mutableuv2.y)) * 0.1)
   / 2.0) + (texture (sampler_main, 
    (uv - (0.02 * tmpvar_7))
  ).xyz * 0.9)) - 0.01);
  ret = tmpvar_13.xyz;
 }`,Di=`float xlat_mutablerain;
vec3 xlat_mutableret1;
vec2 xlat_mutablers;
vec2 xlat_mutablers0;
vec2 xlat_mutableuv1;
float xlat_mutablewater;
float xlat_mutablez;
 shader_body { 
  vec2 uv_1;
  mat2 tmpvar_2;
  tmpvar_2[uint(0)] = _qb.xy;
  tmpvar_2[1u] = _qb.zw;
  vec2 tmpvar_3;
  tmpvar_3.x = q15;
  tmpvar_3.y = q16;
  uv_1 = (((
    (((uv - 0.5) * tmpvar_2) * 0.7)
   * aspect.xy) + 0.5) + tmpvar_3);
  vec2 tmpvar_4;
  tmpvar_4.x = 0.5;
  tmpvar_4.y = ((q11 + 0.6) + (q12 * (
    sin(((uv_1.x * 6.0) + q10))
   * 
    cos(((uv_1.y * 8.0) + (time * 0.6)))
  )));
  vec2 tmpvar_5;
  tmpvar_5.x = (uv_1.x * 4.0);
  tmpvar_5.y = uv_1.y;
  vec2 tmpvar_6;
  tmpvar_6.x = (uv_1.x * 4.0);
  tmpvar_6.y = uv_1.y;
  xlat_mutablerain = (texture (sampler_noise_lq, ((tmpvar_5 * 0.2) - time)).x + texture (sampler_noise_lq, ((tmpvar_6 * 0.5) - time)).x);
  float tmpvar_7;
  tmpvar_7 = (time / 4.0);
  xlat_mutablerain = (xlat_mutablerain * clamp ((
    (q20 / 2.0)
   - 
    abs(sin(((uv.x / 4.0) - tmpvar_7)))
  ), 0.0, 1.0));
  xlat_mutableuv1 = ((uv_1 - tmpvar_4) + (xlat_mutablerain * 0.01));
  vec3 tmpvar_8;
  tmpvar_8.x = xlat_mutableuv1.y;
  tmpvar_8.y = (xlat_mutableuv1.x * 2.0);
  tmpvar_8.z = (time * 0.2);
  xlat_mutableuv1 = (xlat_mutableuv1 + ((texture (sampler_noisevol_hq, tmpvar_8) * 
    (0.5 - abs(xlat_mutableuv1.y))
  ).x * 0.05));
  float tmpvar_9;
  tmpvar_9 = clamp ((128.0 * xlat_mutableuv1.y), 0.0, 1.0);
  xlat_mutablez = (0.4 / xlat_mutableuv1.y);
  xlat_mutablers0.x = (xlat_mutableuv1.x * xlat_mutablez);
  xlat_mutablers0.y = xlat_mutablez;
  vec2 tmpvar_10;
  tmpvar_10.x = (xlat_mutablers0.x + tmpvar_7);
  tmpvar_10.y = (xlat_mutablez + (time * 4.0));
  xlat_mutablers = (tmpvar_10 * tmpvar_9);
  xlat_mutablewater = (texture (sampler_noise_hq, xlat_mutablers) + texture (sampler_noise_hq, ((xlat_mutablers / 4.0) - (time / 8.0)))).x;
  xlat_mutablewater = (xlat_mutablewater - 1.0);
  vec2 tmpvar_11;
  tmpvar_11.x = (xlat_mutableuv1.x + 0.5);
  tmpvar_11.y = abs((0.5 - xlat_mutableuv1.y));
  xlat_mutableret1 = (((texture (sampler_main, uv_1).xyz * 
    (1.0 - tmpvar_9)
  ) + (
    ((texture (sampler_main, (tmpvar_11 - (0.2 * xlat_mutablewater))).xyz * tmpvar_9) * pow ((1.0/(xlat_mutablez)), 0.2))
   * 
    (2.0 - rand_preset.y)
  )) + ((
    (((0.25 + rand_preset.y) * (1.0 + (rand_preset.x * xlat_mutablewater))) * tmpvar_9)
   / xlat_mutablez) * vec3(0.0, 0.1, 0.1)));
  xlat_mutableret1 = (xlat_mutableret1 + (0.06 * xlat_mutablerain));
  vec4 tmpvar_12;
  tmpvar_12.w = 1.0;
  tmpvar_12.xyz = (1.0 - exp((
    (-(pow (xlat_mutableret1, vec3(1.5, 1.5, 1.5))) * 8.0)
   * 
    (1.0 + (q23 * 4.0))
  )));
  ret = tmpvar_12.xyz;
 }`,Oi={baseVals:bi,shapes:xi,waves:Si,init_eqs_str:Ci,frame_eqs_str:wi,pixel_eqs_str:Ti,warp:Ei,comp:Di},ki={rating:2,gammaadj:1.980001,decay:.5,echo_zoom:.999998,echo_alpha:.5,echo_orient:3,wave_mode:4,additivewave:1,wave_thick:1,modwavealphabyvolume:1,wave_brighten:0,darken:1,wave_a:.001,wave_scale:.5274,wave_smoothing:.45,modwavealphastart:0,modwavealphaend:1.32,warpanimspeed:1.4595,warpscale:2.0067,zoom:.9999,warp:.01,sx:.9999,wave_r:.8,wave_g:.49,ob_size:.015,ob_b:1,ib_size:.26,mv_x:64,mv_y:48,mv_l:1.85,mv_r:.4999,mv_g:.4999,mv_b:.4999,mv_a:0,b1ed:0},Ai=[{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],ji=[{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],Mi=`a.index2=0;a.q25=0;a.index=0;a.q22=0;a.q21=0;a.q29=0;a.q1=0;a.dec_med=0;a.rott=0;a.is_beat=0;a.q31=0;a.q23=0;a.k1=0;a.q24=0;a.t_rel=0;a.dec_slow=0;a.q10=0;a.q4=0;a.q26=0;a.p2=0;a.avg=0;a.beat=0;a.p1=0;a.peak=0;a.q2=0;a.q27=0;a.p3=0;a.q3=0;a.t0=0;a.ds=0;a.q28=0;a.q30=0;a.q20=0;a.p4=0;a.indexa=0;`,Ni=`a.dec_med=pow(.7,div(30,a.fps));a.dec_slow=pow(.99,div(30,a.fps));a.beat=Math.max(Math.max(a.bass,a.mid),a.treb);a.beat=a.bass+a.mid+a.treb;a.beat*=a.beat;a.avg=a.avg*a.dec_slow+a.beat*(1-a.dec_slow);a.is_beat=above(a.beat,1.2*a.avg+a.peak)*above(a.time,a.t0+.2);a.t0=a.is_beat*a.time+(1-a.is_beat)*a.t0;a.peak=a.is_beat*a.beat+(1-a.is_beat)*a.peak*a.dec_med;a.index=mod(a.index+a.is_beat,8);a.indexa=mod(a.indexa+a.is_beat,5);a.index2=mod(a.index2+a.is_beat*bnot(a.index),2);a.q20=
a.avg;a.q21=a.beat;a.q22=a.peak;a.q23=a.index;a.q24=a.is_beat;a.q26=a.bass_att+a.mid_att+a.treb_att+1;a.q27=a.index+1;a.q28=-a.index2+div(a.indexa,5);a.q29=a.index2;a.monitor=a.q29;a.k1=a.is_beat*equal(mod(a.index,2),0);a.p1=a.k1*(a.p1+1)+(1-a.k1)*a.p1;a.p2=a.dec_med*a.p2+(1-a.dec_med)*a.p1;a.rott=div(3.1416*a.p2,4);a.q1=Math.cos(a.rott);a.q2=Math.sin(a.rott);a.q3=-a.q2;a.q4=a.q1;a.ds=a.ds*a.dec_med+a.q24*(1-a.dec_med);a.q25=a.q24;a.q10=above(a.q2,.5);a.t_rel=8*a.time;a.p3=a.p3*a.dec_med+(1-a.dec_med)*
(100*a.index+0*a.q26);a.q30=a.p3;a.p4=a.dec_med*a.p4+(1-a.dec_med)*a.q27;a.q31=a.p4;a.zoom=1;a.warp=0;`,Pi=` shader_body { 
  vec2 uv_1;
  vec2 uv6_2;
  vec2 tmpvar_3;
  tmpvar_3 = ((uv - 0.5) * aspect.xy);
  float tmpvar_4;
  tmpvar_4 = (((q29 * 2.0) * sqrt(
    dot (tmpvar_3, tmpvar_3)
  )) + (rand_frame * 64.0)).x;
  float tmpvar_5;
  tmpvar_5 = (0.5 + (rand_preset * 10.0)).x;
  uv_1 = (uv + (clamp (
    ((sin(tmpvar_4) / cos(tmpvar_4)) * normalize(tmpvar_3))
  , vec2(
    -(tmpvar_5)
  ), vec2(tmpvar_5)) / 20.0));
  uv6_2 = (0.4 * sin((tmpvar_3 * 22.0)));
  vec4 tmpvar_6;
  tmpvar_6.w = 1.0;
  tmpvar_6.xyz = (((q25 * 
    (((texture (sampler_main, uv_1).xyz - (
      ((texture (sampler_blur1, fract(uv_1)).xyz * scale1) + bias1)
     * 0.04)) + (0.15 * (vec3(
      (0.1 / sqrt(dot (uv6_2, uv6_2)))
    ) * roam_cos.xyz))) - 0.02)
  ) * 0.98) + ((1.0 - q25) * texture (sampler_main, uv_orig).xyz));
  ret = tmpvar_6.xyz;
 }`,Fi=`vec3 xlat_mutableret1;
vec2 xlat_mutablers;
vec2 xlat_mutablers0;
vec2 xlat_mutableuv2;
vec2 xlat_mutableuv3;
 shader_body { 
  vec2 uv_1;
  uv_1.x = uv.x;
  vec3 ret2_2;
  float z_3;
  uv_1.y = (uv.y - 0.1);
  vec2 tmpvar_4;
  tmpvar_4 = ((uv_1 - 0.5) * aspect.xy);
  z_3 = (0.3 / tmpvar_4.y);
  xlat_mutablers0.x = (tmpvar_4.x * z_3);
  xlat_mutablers0.y = z_3;
  float tmpvar_5;
  tmpvar_5 = (time / 2.0);
  xlat_mutablers.x = (xlat_mutablers0.x + tmpvar_5);
  xlat_mutablers.y = (z_3 + tmpvar_5);
  xlat_mutableret1 = (vec3(dot (texture (sampler_noise_hq, (xlat_mutablers / 2.0)), vec4(0.32, 0.49, 0.29, 0.0))) - 0.55);
  float tmpvar_6;
  tmpvar_6 = clamp ((24.0 * tmpvar_4.y), 0.0, 1.0);
  xlat_mutableuv2 = ((1.5 * tmpvar_4) * (q28 - abs(tmpvar_4.x)));
  xlat_mutableuv2 = (xlat_mutableuv2 * aspect.yx);
  vec2 tmpvar_7;
  tmpvar_7 = fract(((xlat_mutableuv2 - 
    (q27 / 2.0)
  ) - (
    (xlat_mutableret1 * 0.04)
   * tmpvar_6).xy));
  vec2 tmpvar_8;
  tmpvar_8.y = 0.0;
  tmpvar_8.x = texsize.z;
  vec2 tmpvar_9;
  tmpvar_9.x = 0.0;
  tmpvar_9.y = texsize.w;
  vec2 tmpvar_10;
  tmpvar_10.x = dot ((texture (sampler_main, (tmpvar_7 + tmpvar_8)).xyz - texture (sampler_main, (tmpvar_7 - tmpvar_8)).xyz), vec3(0.32, 0.49, 0.29));
  tmpvar_10.y = dot ((texture (sampler_main, (tmpvar_7 + tmpvar_9)).xyz - texture (sampler_main, (tmpvar_7 - tmpvar_9)).xyz), vec3(0.32, 0.49, 0.29));
  xlat_mutableuv3 = (tmpvar_7 + (0.1 * tmpvar_10));
  float tmpvar_11;
  float tmpvar_12;
  tmpvar_12 = (min (abs(
    (tmpvar_4.x / tmpvar_4.y)
  ), 1.0) / max (abs(
    (tmpvar_4.x / tmpvar_4.y)
  ), 1.0));
  float tmpvar_13;
  tmpvar_13 = (tmpvar_12 * tmpvar_12);
  tmpvar_13 = (((
    ((((
      ((((-0.01213232 * tmpvar_13) + 0.05368138) * tmpvar_13) - 0.1173503)
     * tmpvar_13) + 0.1938925) * tmpvar_13) - 0.3326756)
   * tmpvar_13) + 0.9999793) * tmpvar_12);
  tmpvar_13 = (tmpvar_13 + (float(
    (abs((tmpvar_4.x / tmpvar_4.y)) > 1.0)
  ) * (
    (tmpvar_13 * -2.0)
   + 1.570796)));
  tmpvar_11 = (tmpvar_13 * sign((tmpvar_4.x / tmpvar_4.y)));
  if ((abs(tmpvar_4.y) > (1e-08 * abs(tmpvar_4.x)))) {
    if ((tmpvar_4.y < 0.0)) {
      if ((tmpvar_4.x >= 0.0)) {
        tmpvar_11 += 3.141593;
      } else {
        tmpvar_11 = (tmpvar_11 - 3.141593);
      };
    };
  } else {
    tmpvar_11 = (sign(tmpvar_4.x) * 1.570796);
  };
  vec2 tmpvar_14;
  tmpvar_14.x = 0.5;
  tmpvar_14.y = tmpvar_11;
  ret2_2 = ((texture (sampler_main, fract(
    ((0.06 * bass_att) * tmpvar_14)
  )).xyz * roam_cos.xyz) + ((0.008 / 
    sqrt(dot (tmpvar_4, tmpvar_4))
  ) * roam_cos.xyz));
  ret2_2 = (ret2_2 * q10);
  xlat_mutableret1 = (((texture (sampler_blur1, 
    fract(xlat_mutableuv3)
  ).xyz * scale1) + bias1) + texture (sampler_main, xlat_mutableuv3).xyz);
  xlat_mutableret1 = (xlat_mutableret1 * (0.1 + (bass_att / 2.0)));
  vec2 tmpvar_15;
  tmpvar_15 = (0.1 * sin((
    (22.0 * uv_1)
   + 
    (tmpvar_10 * 30.0)
  )));
  float tmpvar_16;
  tmpvar_16 = ((0.02 / sqrt(
    dot (tmpvar_15, tmpvar_15)
  )) - 0.1);
  vec4 tmpvar_17;
  tmpvar_17.w = 1.0;
  tmpvar_17.xyz = (((xlat_mutableret1 * 
    (1.0 + tmpvar_16)
  ) + ret2_2) + ((tmpvar_16 * 
    (1.0 - tmpvar_6)
  ) * 0.3));
  ret = tmpvar_17.xyz;
 }`,Ii={baseVals:ki,shapes:Ai,waves:ji,init_eqs_str:Mi,frame_eqs_str:Ni,pixel_eqs_str:``,pixel_eqs:``,warp:Pi,comp:Fi},Li={rating:0,gammaadj:1.980001,decay:.5,echo_zoom:.999998,echo_alpha:.5,echo_orient:3,wave_mode:4,wave_dots:1,modwavealphabyvolume:1,wave_brighten:0,darken:1,wave_a:.001,wave_scale:1.05843,wave_smoothing:.45,wave_mystery:.08,modwavealphastart:0,modwavealphaend:1.32,warpanimspeed:1.4595,warpscale:2.0067,zoom:.9999,warp:.01,sx:.9999,wave_r:0,wave_g:0,wave_b:0,ob_size:.11,ib_size:.26,mv_x:31.999994,mv_y:24.000004,mv_l:1.85,mv_r:.4999,mv_g:.4999,mv_b:.4999,mv_a:0,b1ed:0},Ri=[{baseVals:{enabled:1,sides:34,rad:.026949,tex_ang:1.00531,tex_zoom:1.531168,r:.5,g:1,b:.9,r2:.83,g2:.93,b2:.8,a2:.3,border_b:0,border_a:0},init_eqs_str:`a.trel=0;a.q20=0;a.trel=0;a.trel=0;a.q26=0;`,frame_eqs_str:`a.trel=div(a.time,4)+a.q20;a.x=Math.sin(2*a.trel);a.y=Math.cos(1.3*a.trel);a.a=div(a.q26,4)+.2;a.a=1;a.a2=.2;`},{baseVals:{enabled:0}},{baseVals:{enabled:1,sides:100,x:.503,rad:.01,tex_zoom:.609857,g:.1,a:.9,r2:1,b2:1,border_r:.5,border_g:.5,border_b:.5,border_a:0},init_eqs_str:`a.q21=0;a.q31=0;`,frame_eqs_str:`a.x=div(randint(100),100);a.y=div(randint(100),100);a.ang=randint(6);a.r=div(randint(4),3);a.g=div(randint(4),3);a.b=div(randint(4),3);a.r2=a.b;a.g2=a.g;a.b2=a.r;a.a=Math.min(div(a.q21,2),.9);a.rad=div(a.a,9);a.a=Math.max(a.q31,.2);a.a2=.5*a.a;`},{baseVals:{enabled:0}}],zi=[{baseVals:{enabled:1,samples:36,usedots:1,additive:1,scaling:.01,smoothing:.82,a:.6},init_eqs_str:`a.ampl=0;a.t_rel=0;a.t1=0;a.t2=0;a.x1=0;a.q32=0;a.t1=1;a.t2=100;`,frame_eqs_str:`a.t1=1;a.t2=100;`,point_eqs_str:`a.ampl=.4*a.sample*Math.cos(2*a.time);a.x=.5+a.ampl*Math.sin(div(a.time,7)+13*a.sample);a.y=.5+a.ampl*Math.cos(div(a.time,12)+13*a.sample);a.t_rel=div(a.time,25)+div(a.sample,13);a.x=4*(a.t_rel-Math.floor(a.t_rel))+.2*Math.cos(140*a.t_rel);a.y=.6+.2*Math.sin(div(a.time,19))+.02*Math.sin(128*a.t_rel);a.t1=mod(65*a.t1+37,4096);a.t2=mod(65*a.t2+37,4096);a.x1=.5+div(div(a.t1,4096),1)+div(a.time,32);a.x=-Math.floor(a.x1)+a.x1;a.y=.5+div(div(a.t2,4096),2);a.a=div(a.q32,2);`},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],Bi=`a.index2=0;a.index4=0;a.index=0;a.q22=0;a.q21=0;a.q29=0;a.movex=0;a.q1=0;a.dec_med=0;a.index3=0;a.rott=0;a.is_beat=0;a.q31=0;a.q23=0;a.k1=0;a.q24=0;a.dec_slow=0;a.q4=0;a.q26=0;a.p2=0;a.avg=0;a.movez=0;a.beat=0;a.p1=0;a.peak=0;a.q2=0;a.q27=0;a.q3=0;a.t0=0;a.q32=0;a.q28=0;a.q30=0;a.q20=0;a.p1=randint(16);a.p2=a.p1;`,Vi=`a.dec_med=pow(.96,div(30,a.fps));a.dec_slow=pow(.99,div(30,a.fps));a.beat=Math.max(Math.max(a.bass,a.mid),a.treb);a.avg=a.avg*a.dec_slow+a.beat*(1-a.dec_slow);a.is_beat=above(a.beat,.4+a.avg+a.peak)*above(a.time,a.t0+.2);a.t0=a.is_beat*a.time+(1-a.is_beat)*a.t0;a.peak=a.is_beat*a.beat+(1-a.is_beat)*a.peak*a.dec_med;a.index=mod(a.index+a.is_beat,8);a.index2=mod(a.index2+a.is_beat*bnot(a.index),4);a.index3=mod(a.index3+a.is_beat*bnot(a.index)*bnot(a.index2),3);a.q20=a.avg;a.q21=
a.beat;a.q22=a.peak;a.q23=a.index;a.q24=a.is_beat;a.q26=a.bass+a.mid+a.treb;a.k1=a.is_beat*equal(a.index,0);a.p1=a.k1*(a.p1+1)+(1-a.k1)*a.p1;a.p2=a.dec_med*a.p2+(1-a.dec_med)*a.p1;a.rott=div(3.14159265359*a.p2,4);a.q27=8-a.index;a.q28=Math.sin(div(a.time,7));a.q29=a.index4;a.q1=Math.cos(a.rott);a.q2=Math.sin(a.rott);a.q3=-a.q2;a.q4=a.q1;a.mv_a=.5*a.q1;a.movez+=div(.3,a.fps);a.q29=a.movez;a.movex+=div(.09,a.fps)*a.q2;a.q30=a.movex;a.q31=sqr(Math.sin(div(a.time,17)));a.q32=sqr(Math.cos(div(a.time,17)));
a.zoom=1;a.rot=0;a.dx=0;a.warp=.2;`,Hi=` shader_body { 
  vec2 tmpvar_1;
  tmpvar_1 = ((uv * texsize.xy) * 0.04);
  vec2 tmpvar_2;
  tmpvar_2.x = (cos((tmpvar_1.y * q1)) * sin(-(tmpvar_1.y)));
  tmpvar_2.y = (sin(tmpvar_1.x) * cos((tmpvar_1.y * q2)));
  vec4 tmpvar_3;
  tmpvar_3.w = 1.0;
  tmpvar_3.xyz = ((texture (sampler_main, (uv - 
    ((tmpvar_2 * texsize.zw) * (24.0 * q28))
  )).xyz * 0.99) - 0.006);
  ret = tmpvar_3.xyz;
 }`,Ui=`vec2 xlat_mutabledz;
vec3 xlat_mutableret1;
vec2 xlat_mutableuv1;
vec2 xlat_mutableuv3;
 shader_body { 
  float ky_1;
  float k1_2;
  float inten_3;
  float dist_4;
  vec2 tmpvar_5;
  tmpvar_5.y = 0.0;
  tmpvar_5.x = texsize.z;
  vec2 tmpvar_6;
  tmpvar_6.x = 0.0;
  tmpvar_6.y = texsize.w;
  xlat_mutableuv1 = (uv - 0.5);
  xlat_mutableuv1 = (xlat_mutableuv1 * aspect.xy);
  dist_4 = (1.0 - fract(q29));
  inten_3 = ((dist_4 * (1.0 - 
    (dist_4 * dist_4)
  )) * 4.0);
  vec2 tmpvar_7;
  tmpvar_7.y = 0.5;
  tmpvar_7.x = q30;
  xlat_mutableuv3 = (((2.0 * xlat_mutableuv1) * dist_4) + tmpvar_7);
  xlat_mutableuv3 = (xlat_mutableuv3 * aspect.yx);
  xlat_mutabledz.x = (inten_3 * dot ((texture (sampler_main, 
    (xlat_mutableuv3 + tmpvar_5)
  ).xyz - texture (sampler_main, 
    (xlat_mutableuv3 - tmpvar_5)
  ).xyz), vec3(0.32, 0.49, 0.29)));
  xlat_mutabledz.y = (inten_3 * dot ((texture (sampler_main, 
    (xlat_mutableuv3 + tmpvar_6)
  ).xyz - texture (sampler_main, 
    (xlat_mutableuv3 - tmpvar_6)
  ).xyz), vec3(0.32, 0.49, 0.29)));
  xlat_mutableret1 = max (vec3(0.0, 0.0, 0.0), (texture (sampler_main, xlat_mutableuv3).xyz * inten_3));
  dist_4 = (1.0 - fract((0.3333333 + q29)));
  inten_3 = ((dist_4 * (1.0 - 
    (dist_4 * dist_4)
  )) * 4.0);
  vec2 tmpvar_8;
  tmpvar_8.y = 0.5;
  tmpvar_8.x = q30;
  xlat_mutableuv3 = (((2.0 * xlat_mutableuv1) * dist_4) + tmpvar_8);
  xlat_mutableuv3 = (xlat_mutableuv3 * aspect.yx);
  xlat_mutabledz.x = (xlat_mutabledz.x + (inten_3 * dot (
    (texture (sampler_main, (xlat_mutableuv3 + tmpvar_5)).xyz - texture (sampler_main, (xlat_mutableuv3 - tmpvar_5)).xyz)
  , vec3(0.32, 0.49, 0.29))));
  xlat_mutabledz.y = (xlat_mutabledz.y + (inten_3 * dot (
    (texture (sampler_main, (xlat_mutableuv3 + tmpvar_6)).xyz - texture (sampler_main, (xlat_mutableuv3 - tmpvar_6)).xyz)
  , vec3(0.32, 0.49, 0.29))));
  xlat_mutableret1 = max (xlat_mutableret1, (texture (sampler_main, xlat_mutableuv3).xyz * inten_3));
  dist_4 = (1.0 - fract((0.6666667 + q29)));
  inten_3 = ((dist_4 * (1.0 - 
    (dist_4 * dist_4)
  )) * 4.0);
  vec2 tmpvar_9;
  tmpvar_9.y = 0.5;
  tmpvar_9.x = q30;
  xlat_mutableuv3 = (((2.0 * xlat_mutableuv1) * dist_4) + tmpvar_9);
  xlat_mutableuv3 = (xlat_mutableuv3 * aspect.yx);
  xlat_mutabledz.x = (xlat_mutabledz.x + (inten_3 * dot (
    (texture (sampler_main, (xlat_mutableuv3 + tmpvar_5)).xyz - texture (sampler_main, (xlat_mutableuv3 - tmpvar_5)).xyz)
  , vec3(0.32, 0.49, 0.29))));
  xlat_mutabledz.y = (xlat_mutabledz.y + (inten_3 * dot (
    (texture (sampler_main, (xlat_mutableuv3 + tmpvar_6)).xyz - texture (sampler_main, (xlat_mutableuv3 - tmpvar_6)).xyz)
  , vec3(0.32, 0.49, 0.29))));
  xlat_mutableret1 = max (xlat_mutableret1, (texture (sampler_main, xlat_mutableuv3).xyz * inten_3));
  dist_4 = (1.0 - fract((1.0 + q29)));
  inten_3 = ((dist_4 * (1.0 - 
    (dist_4 * dist_4)
  )) * 4.0);
  vec2 tmpvar_10;
  tmpvar_10.y = 0.5;
  tmpvar_10.x = q30;
  xlat_mutableuv3 = (((2.0 * xlat_mutableuv1) * dist_4) + tmpvar_10);
  xlat_mutableuv3 = (xlat_mutableuv3 * aspect.yx);
  xlat_mutabledz.x = (xlat_mutabledz.x + (inten_3 * dot (
    (texture (sampler_main, (xlat_mutableuv3 + tmpvar_5)).xyz - texture (sampler_main, (xlat_mutableuv3 - tmpvar_5)).xyz)
  , vec3(0.32, 0.49, 0.29))));
  xlat_mutabledz.y = (xlat_mutabledz.y + (inten_3 * dot (
    (texture (sampler_main, (xlat_mutableuv3 + tmpvar_6)).xyz - texture (sampler_main, (xlat_mutableuv3 - tmpvar_6)).xyz)
  , vec3(0.32, 0.49, 0.29))));
  xlat_mutableret1 = max (xlat_mutableret1, (texture (sampler_main, xlat_mutableuv3).xyz * inten_3));
  xlat_mutableuv1 = (xlat_mutableuv1 + (xlat_mutabledz / 2.0));
  vec2 tmpvar_11;
  tmpvar_11 = sin(((3.0 * xlat_mutableuv1) + (
    (time / 18.0)
   * vec2(1.0, 0.9))));
  vec3 tmpvar_12;
  tmpvar_12.y = 0.2;
  tmpvar_12.x = uv.y;
  tmpvar_12.z = (1.5 - uv.y);
  k1_2 = (0.5 * (rand_preset - 0.5)).x;
  vec2 tmpvar_13;
  tmpvar_13.y = 0.05;
  tmpvar_13.x = k1_2;
  xlat_mutableuv3 = ((150.0 * (xlat_mutableuv1 - tmpvar_13)) + xlat_mutabledz);
  float tmpvar_14;
  tmpvar_14 = (0.3 * dot (texture (sampler_noise_lq, uv), vec4(0.32, 0.49, 0.29, 0.0)));
  ky_1 = clamp (((-0.01 * xlat_mutableuv3.y) + (tmpvar_14 * 
    cos((12.0 * tmpvar_14))
  )), 0.0, 1.0);
  k1_2 = (xlat_mutableuv3.x - (sign(xlat_mutableuv3.x) * 16.0));
  k1_2 = (k1_2 + ((2.0 * 
    (k1_2 - (6.0 * sign(k1_2)))
  ) * ky_1));
  ky_1 = clamp ((ky_1 - 0.08), 0.0, 1.0);
  k1_2 = (k1_2 + ((2.0 * 
    (k1_2 - (12.0 * sign(k1_2)))
  ) * ky_1));
  ky_1 = clamp ((ky_1 - 0.08), 0.0, 1.0);
  k1_2 = (k1_2 + ((2.0 * 
    (k1_2 - (18.0 * sign(k1_2)))
  ) * ky_1));
  ky_1 = clamp ((ky_1 - 0.08), 0.0, 1.0);
  k1_2 = (k1_2 + ((2.0 * 
    (k1_2 - (24.0 * sign(k1_2)))
  ) * ky_1));
  ky_1 = clamp ((ky_1 - 0.08), 0.0, 1.0);
  k1_2 = (k1_2 + ((2.0 * 
    (k1_2 - (30.0 * sign(k1_2)))
  ) * ky_1));
  ky_1 = clamp ((ky_1 - 0.08), 0.0, 1.0);
  float tmpvar_15;
  tmpvar_15 = clamp (k1_2, -1.6, 1.6);
  k1_2 = tmpvar_15;
  vec4 tmpvar_16;
  tmpvar_16.w = 1.0;
  tmpvar_16.xyz = ((0.1 + (
    (0.4 * rand_preset.x)
   * xlat_mutableret1)) + clamp ((
    ((vec3(((
      clamp ((4.0 * (0.25 - xlat_mutableuv1.y)), 0.0, 1.0)
     * 0.3) / sqrt(
      dot (tmpvar_11, tmpvar_11)
    ))) * (0.5 + (
      (0.5 * rand_preset)
    .xyz * vec3(1.0, 1.0, 0.3)))) * (0.5 + tmpvar_12))
   - vec3(
    ((2.0 * abs(cos(tmpvar_15))) * (uv.y * uv.y))
  )), 0.0, 1.0));
  ret = tmpvar_16.xyz;
 }`,Wi={baseVals:Li,shapes:Ri,waves:zi,init_eqs_str:Bi,frame_eqs_str:Vi,pixel_eqs_str:``,pixel_eqs:``,warp:Hi,comp:Ui},Gi={rating:0,gammaadj:1.980001,decay:.5,echo_zoom:.952379,echo_alpha:.5,echo_orient:3,wave_mode:7,additivewave:1,wave_thick:1,modwavealphabyvolume:1,darken:1,wave_a:.354492,wave_scale:5.466675,wave_smoothing:0,wave_mystery:.2,modwavealphastart:.71,modwavealphaend:1.3,warpanimspeed:1.4595,warpscale:2.0067,zoom:.9999,warp:.01,sx:.9999,wave_g:0,wave_b:0,ob_size:0,ob_b:.2,ob_a:1,ib_size:0,ib_r:0,ib_g:0,ib_a:1,mv_x:31.999998,mv_y:24.000004,mv_l:.05,mv_r:.2999,mv_g:.4999,mv_b:.3999,mv_a:0,b1ed:0},Ki=[{baseVals:{enabled:1,rad:.084012,tex_zoom:1.125186,r:.8,b:.8,g2:0,a2:.1,border_r:.7,border_g:0,border_b:0,border_a:1},init_eqs_str:``,frame_eqs_str:`a.x=.5+.5*Math.sin(div(a.time,1));a.y=.5+.5*Math.cos(div(a.time,1.5));a.r=.5+.3*Math.sin(div(a.time,3));a.g=.5+.3*Math.sin(div(a.time,4));a.b=.5+.3*Math.sin(div(a.time,7));a.rad=.2;`},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],qi=[{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],Ji=`a.index2=0;a.index4=0;a.index=0;a.q22=0;a.q21=0;a.q29=0;a.q1=0;a.dec_med=0;a.index3=0;a.rott=0;a.is_beat=0;a.q23=0;a.k1=0;a.q24=0;a.dec_slow=0;a.col=0;a.q4=0;a.q26=0;a.p2=0;a.avg=0;a.beat=0;a.p1=0;a.peak=0;a.q2=0;a.q27=0;a.q3=0;a.t0=0;a.q28=0;a.q30=0;a.c1=0;a.q20=0;`,Yi=`a.dec_med=pow(.8,div(30,a.fps));a.dec_slow=pow(.99,div(30,a.fps));a.beat=Math.max(Math.max(a.bass,a.mid),a.treb);a.avg=a.avg*a.dec_slow+a.beat*(1-a.dec_slow);a.is_beat=above(a.beat,0+a.avg+a.peak)*above(a.time,a.t0+.2);a.t0=a.is_beat*a.time+(1-a.is_beat)*a.t0;a.peak=a.is_beat*a.beat+(1-a.is_beat)*a.peak*a.dec_med;a.index=mod(a.index+a.is_beat,4);a.index2=mod(a.index2+a.is_beat*bnot(a.index),4);a.index3=mod(a.index3+a.is_beat*bnot(a.index)*bnot(a.index2),2);a.monitor=a.index4;
a.q20=a.avg;a.q21=a.beat;a.q22=a.peak;a.q23=a.index;a.q24=a.is_beat;a.q26=a.bass_att+a.mid_att+a.treb_att+3;a.k1=a.is_beat*equal(a.index,0);a.p1=a.k1*(a.p1+1)+(1-a.k1)*a.p1;a.p2=a.dec_med*a.p2+(1-a.dec_med)*a.p1;a.rott=div(3.14159265359*a.p2,4);a.q27=1+a.index;a.q28=2+4*(1+Math.sin(div(a.time,5)));a.c1=a.c1*a.dec_med+a.index2*(1-a.dec_med);a.q29=1+a.c1;a.col=a.dec_med*a.col+2*(1-a.dec_med)*(a.index3-.5)*mod(a.index,2);a.q30=a.col;a.q1=Math.cos(a.rott);a.q2=Math.sin(a.rott);a.q3=-a.q2;a.q4=a.q1;a.zoom=
.96+.05*a.q1;a.mv_x=64;a.mv_y=48;a.mv_a=0;`,Xi=` shader_body { 
  vec3 ret_1;
  vec3 tmpvar_2;
  tmpvar_2.z = 0.0;
  tmpvar_2.xy = clamp (((
    (texture (sampler_blur1, uv).xyz * scale1)
   + bias1) - 1.0), vec3(-0.1, -0.1, -0.1), vec3(0.1, 0.1, 0.1)).yx;
  ret_1 = (clamp (texture (sampler_main, (uv - 
    ((dot (tmpvar_2, vec3(0.32, 0.49, 0.29)) * 0.4) * sin((vec2(0.1, 0.1) * sin(
      (((uv - vec2(0.5, 0.5)) * aspect.xy) * vec2(127.0, 127.0))
    ))))
  )).xyz, 0.0, 1.0) * 0.99);
  ret_1 = (ret_1 - 0.005);
  vec4 tmpvar_3;
  tmpvar_3.w = 1.0;
  tmpvar_3.xyz = ret_1;
  ret = tmpvar_3.xyz;
 }`,Zi=`vec2 xlat_mutablers;
 shader_body { 
  vec2 uv1_1;
  vec2 tmpvar_2;
  tmpvar_2 = ((uv - 0.5) * aspect.xy);
  xlat_mutablers.x = ((ang / 3.14) / 2.0);
  xlat_mutablers.y = (((q28 * 0.01) / (0.05 + 
    sqrt(dot (tmpvar_2, tmpvar_2))
  )) + (time / 3.0));
  vec2 tmpvar_3;
  tmpvar_3 = fract(xlat_mutablers);
  vec2 tmpvar_4;
  tmpvar_4.y = 0.0;
  tmpvar_4.x = texsize.z;
  vec2 tmpvar_5;
  tmpvar_5.x = 0.0;
  tmpvar_5.y = texsize.w;
  vec2 tmpvar_6;
  tmpvar_6.x = (texture (sampler_main, (tmpvar_3 - tmpvar_4)).xyz - texture (sampler_main, (tmpvar_3 + tmpvar_4)).xyz).x;
  tmpvar_6.y = (texture (sampler_main, (tmpvar_3 - tmpvar_5)).xyz - texture (sampler_main, (tmpvar_3 + tmpvar_5)).xyz).x;
  uv1_1 = ((0.2 * cos(
    (fract(xlat_mutablers) * 16.0)
  )) - (8.0 * tmpvar_6));
  vec4 tmpvar_7;
  tmpvar_7.w = 1.0;
  tmpvar_7.xyz = (0.8 * ((
    (q30 * ((texture (sampler_blur1, tmpvar_3).xyz * scale1) + bias1))
   * 2.0) + (0.04 / 
    sqrt(dot (uv1_1, uv1_1))
  )));
  ret = tmpvar_7.xyz;
 }`,Qi={baseVals:Gi,shapes:Ki,waves:qi,init_eqs_str:Ji,frame_eqs_str:Yi,pixel_eqs_str:``,pixel_eqs:``,warp:Xi,comp:Zi},$i={rating:3,gammaadj:1.98,decay:.5,echo_zoom:1,echo_alpha:.5,echo_orient:3,wave_mode:6,additivewave:1,wave_thick:1,modwavealphabyvolume:1,wave_brighten:0,darken:1,wave_a:.001,wave_scale:2.103,wave_smoothing:.54,wave_mystery:.38,modwavealphastart:.81,modwavealphaend:1.4,warpanimspeed:1.459,warpscale:2.007,zoom:.9999,warp:.01,sx:.9999,wave_r:0,wave_g:0,wave_b:0,ob_r:1,ob_g:1,ob_b:1,ib_size:.26,mv_x:64,mv_y:48,mv_l:1.85,mv_r:.5,mv_g:.5,mv_b:.5,mv_a:0,b1x:.7,b1ed:0},ea=[{baseVals:{enabled:1,sides:64,thickoutline:1,textured:1,rad:.39712,tex_zoom:1.87512,r:0,g:1,b:1,a:.8,r2:1,b2:1,a2:1,border_b:0,border_a:.5},init_eqs_str:`a.vis=0;a.q10=0;a.vis=0;a.vis=0;a.vis=0;`,frame_eqs_str:`a.tex_ang=div(a.time,2);a.tex_zoom=2+Math.sin(div(a.time,5));a.vis=a.q10;a.a=a.vis;a.a2=.5*a.vis;a.border_a=a.vis;`},{baseVals:{enabled:1,additive:1,thickoutline:1,num_inst:12,x:.6,rad:.03301,tex_zoom:1.8315,g:.6,a:.9,g2:0,border_g:.59,border_b:0,border_a:0},init_eqs_str:`a.vis=0;a.vis=0;a.vis=0;a.vis=0;`,frame_eqs_str:`a.x=.5+.16*Math.cos(6.28*div(a.instance,12));a.y=.5+.16*Math.sin(6.28*div(a.instance,12));a.vis=1;a.a=a.vis;a.a2=1*a.vis;a.border_a=a.vis;a.r=.5*(1+Math.sin(div(a.time,12.3)));a.g=.5*(1+Math.sin(div(a.time,14.3)));a.b=.5*(1+Math.sin(div(a.time,9.3)));`},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],ta=[{baseVals:{enabled:1,samples:128,thick:1,additive:1,scaling:.89152,smoothing:0},init_eqs_str:``,frame_eqs_str:``,point_eqs_str:`a.x=a.sample;a.y=.5;a.r=.5+.5*Math.sin(div(a.time,7));a.g=.5+.5*Math.sin(div(a.time,11));a.b=.5+.5*Math.sin(div(a.time,5));`},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],na=`a.index2=0;a.kiss=0;a.sw=0;a.index=0;a.q22=0;a.q21=0;a.q29=0;a.q1=0;a.dec_med=0;a.rott=0;a.vis=0;a.is_beat=0;a.q31=0;a.q23=0;a.k1=0;a.q24=0;a.dec_slow=0;a.q10=0;a.q4=0;a.k2=0;a.q26=0;a.p2=0;a.avg=0;a.movez=0;a.beat=0;a.vol=0;a.p1=0;a.peak=0;a.q2=0;a.q27=0;a.q3=0;a.t0=0;a.q28=0;a.q30=0;a.v2=0;a.q20=0;a.vol=0;a.p1=0;a.vx=.2;a.vy=-.1;a.kx=0;a.ky=0;`,ra=`a.dec_med=pow(.96,div(30,a.fps));a.dec_slow=pow(.99,div(30,a.fps));a.beat=Math.max(Math.max(a.bass,a.mid),a.treb);a.avg=a.avg*a.dec_slow+a.beat*(1-a.dec_slow);a.is_beat=above(a.beat,.5+a.avg+a.peak)*above(a.time,a.t0+.2);a.t0=a.is_beat*a.time+(1-a.is_beat)*a.t0;a.peak=a.is_beat*a.beat+(1-a.is_beat)*a.peak*a.dec_med;a.index=mod(a.index+a.is_beat,8);a.index2=mod(a.index2+a.is_beat*bnot(a.index),7);a.q20=a.avg;a.q21=a.beat;a.q22=a.peak;a.q23=a.index;a.q24=a.is_beat;a.vol=a.bass_att+
a.treb_att;a.v2=a.v2*a.dec_med+a.vol*(1-a.dec_med);a.q26=Math.max(Math.atan(a.vol-a.v2),0)+.2;a.q27=a.index+1;a.sw=a.sw*a.dec_med+(1-a.dec_med)*mod(a.index2,2);a.q28=a.sw;a.kiss=a.kiss*a.dec_med+(1-a.dec_med)*bnot(a.index2)*below(a.index,4);a.q29=a.kiss;a.k1=a.is_beat*bnot(a.index);a.k2=a.is_beat*bnot(a.index);a.p1=a.k1*(a.p1+1)+(1-a.k1)*a.p1;a.p2=a.dec_med*a.p2+(1-a.dec_med)*a.p1;a.rott=div(3.1416*a.p2,2);a.monitor=a.k1;a.q1=Math.cos(a.rott);a.q2=Math.sin(a.rott);a.q3=-a.q2;a.q4=a.q1;a.vis=a.vis*
a.dec_med+(1-a.dec_med)*mod(a.index2,2);a.q10=a.vis;a.zoom=1;a.rot=-0;a.movez+=div(.3,a.fps);a.q30=a.movez;a.q31=Math.cos(div(a.time,32))*Math.cos(div(a.time,32));a.monitor=a.vis;`,ia=`a.warp=1.2;`,aa=` shader_body { 
  vec2 tmpvar_1;
  tmpvar_1 = ((uv * texsize.xy) * 0.03);
  vec2 tmpvar_2;
  tmpvar_2.x = (cos((tmpvar_1.y * q1)) * sin(-(tmpvar_1.y)));
  tmpvar_2.y = (sin(tmpvar_1.x) * cos((tmpvar_1.y * q2)));
  vec4 tmpvar_3;
  tmpvar_3.w = 1.0;
  tmpvar_3.xyz = ((texture (sampler_main, (uv - 
    ((tmpvar_2 * texsize.zw) * 16.0)
  )).xyz * 0.99) - 0.01);
  ret = tmpvar_3.xyz;
 }`,oa=`vec2 xlat_mutabledz;
vec3 xlat_mutableret1;
vec2 xlat_mutableuv3;
 shader_body { 
  vec2 uv_1;
  vec2 tmpvar_2;
  tmpvar_2 = ((uv - 0.5) * aspect.xy);
  vec2 tmpvar_3;
  tmpvar_3.y = 0.0;
  tmpvar_3.x = texsize.z;
  vec2 tmpvar_4;
  tmpvar_4.x = 0.0;
  tmpvar_4.y = texsize.w;
  uv_1 = (tmpvar_2 * aspect.yx);
  xlat_mutableuv3 = ((1.98 * uv_1) + -0.5);
  xlat_mutabledz.x = (0.03999996 * (dot (texture (sampler_main, 
    (xlat_mutableuv3 + tmpvar_3)
  ).xyz, vec3(0.32, 0.49, 0.29)) - dot (texture (sampler_main, 
    (xlat_mutableuv3 - tmpvar_3)
  ).xyz, vec3(0.32, 0.49, 0.29))));
  xlat_mutabledz.y = (0.03999996 * (dot (texture (sampler_main, 
    (xlat_mutableuv3 + tmpvar_4)
  ).xyz, vec3(0.32, 0.49, 0.29)) - dot (texture (sampler_main, 
    (xlat_mutableuv3 - tmpvar_4)
  ).xyz, vec3(0.32, 0.49, 0.29))));
  xlat_mutableret1 = max (vec3(0.0, 0.0, 0.0), (texture (sampler_main, (xlat_mutableuv3 + 
    (xlat_mutabledz * 0.01)
  )).xyz * 0.03999996));
  uv_1 = (tmpvar_2 * aspect.yx);
  xlat_mutableuv3 = ((1.313333 * uv_1) + -0.5);
  xlat_mutabledz.x = (xlat_mutabledz.x + (1.373333 * (
    dot (texture (sampler_main, (xlat_mutableuv3 + tmpvar_3)).xyz, vec3(0.32, 0.49, 0.29))
   - 
    dot (texture (sampler_main, (xlat_mutableuv3 - tmpvar_3)).xyz, vec3(0.32, 0.49, 0.29))
  )));
  xlat_mutabledz.y = (xlat_mutabledz.y + (1.373333 * (
    dot (texture (sampler_main, (xlat_mutableuv3 + tmpvar_4)).xyz, vec3(0.32, 0.49, 0.29))
   - 
    dot (texture (sampler_main, (xlat_mutableuv3 - tmpvar_4)).xyz, vec3(0.32, 0.49, 0.29))
  )));
  xlat_mutableret1 = max (xlat_mutableret1, (texture (sampler_main, (xlat_mutableuv3 + 
    (xlat_mutabledz * 0.01)
  )).xyz * 1.373333));
  uv_1 = (tmpvar_2 * aspect.yx);
  xlat_mutableuv3 = ((0.6466666 * uv_1) + -0.5);
  xlat_mutabledz.x = (xlat_mutabledz.x + (2.706667 * (
    dot (texture (sampler_main, (xlat_mutableuv3 + tmpvar_3)).xyz, vec3(0.32, 0.49, 0.29))
   - 
    dot (texture (sampler_main, (xlat_mutableuv3 - tmpvar_3)).xyz, vec3(0.32, 0.49, 0.29))
  )));
  xlat_mutabledz.y = (xlat_mutabledz.y + (2.706667 * (
    dot (texture (sampler_main, (xlat_mutableuv3 + tmpvar_4)).xyz, vec3(0.32, 0.49, 0.29))
   - 
    dot (texture (sampler_main, (xlat_mutableuv3 - tmpvar_4)).xyz, vec3(0.32, 0.49, 0.29))
  )));
  xlat_mutableret1 = max (xlat_mutableret1, (texture (sampler_main, (xlat_mutableuv3 + 
    (xlat_mutabledz * 0.01)
  )).xyz * 2.706667));
  uv_1 = (tmpvar_2 * aspect.yx);
  xlat_mutableuv3 = ((1.98 * uv_1) + -0.5);
  xlat_mutabledz.x = (xlat_mutabledz.x + (0.03999996 * (
    dot (texture (sampler_main, (xlat_mutableuv3 + tmpvar_3)).xyz, vec3(0.32, 0.49, 0.29))
   - 
    dot (texture (sampler_main, (xlat_mutableuv3 - tmpvar_3)).xyz, vec3(0.32, 0.49, 0.29))
  )));
  xlat_mutabledz.y = (xlat_mutabledz.y + (0.03999996 * (
    dot (texture (sampler_main, (xlat_mutableuv3 + tmpvar_4)).xyz, vec3(0.32, 0.49, 0.29))
   - 
    dot (texture (sampler_main, (xlat_mutableuv3 - tmpvar_4)).xyz, vec3(0.32, 0.49, 0.29))
  )));
  xlat_mutableret1 = max (xlat_mutableret1, (texture (sampler_main, (xlat_mutableuv3 + 
    (xlat_mutabledz * 0.01)
  )).xyz * 0.03999996));
  vec2 tmpvar_5;
  tmpvar_5 = (0.2 * sin((
    ((14.0 * tmpvar_2) + (xlat_mutabledz * 2.0))
   + 
    (time / 6.0)
  )));
  vec4 tmpvar_6;
  tmpvar_6.w = 1.0;
  tmpvar_6.xyz = ((sqrt(xlat_mutableret1) * (0.2 + 
    (8.0 * vec3((0.01 / sqrt(dot (tmpvar_5, tmpvar_5)))))
  )) / 1.5);
  ret = tmpvar_6.xyz;
 }`,sa={baseVals:$i,shapes:ea,waves:ta,init_eqs_str:na,frame_eqs_str:ra,pixel_eqs_str:ia,warp:aa,comp:oa},ca={rating:2,gammaadj:1.98,decay:.5,echo_zoom:1,echo_alpha:.5,echo_orient:3,wave_mode:4,additivewave:1,wave_thick:1,modwavealphabyvolume:1,wave_brighten:0,darken:1,wave_a:.001,wave_scale:.527,wave_smoothing:.45,modwavealphastart:0,modwavealphaend:1.32,warpanimspeed:.01,warpscale:.01,zoom:1.00183,dx:1,warp:.01,wave_r:.8,wave_g:.49,mv_x:64,mv_y:48,mv_l:1.85,mv_r:.5,mv_g:.5,mv_b:.5,mv_a:0,b1ed:0},la=[{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],ua=[{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],da=`a.rad=0;a.ready=0;a.index2=0;a.index=0;a.q22=0;a.q21=0;a.movex=0;a.q1=0;a.dec_med=0;a.rott=0;a.ly=0;a.is_beat=0;a.q23=0;a.k1=0;a.q24=0;a.dec_slow=0;a.q11=0;a.q10=0;a.q4=0;a.is_beat2=0;a.alt=0;a.q26=0;a.p2=0;a.avg=0;a.q19=0;a.beat=0;a.p1=0;a.lx=0;a.peak=0;a.q2=0;a.q27=0;a.q3=0;a.t0=0;a.q28=0;a.q30=0;a.q20=0;a.step=0;a.shift=0;a.step=0;`,fa=`a.dec_med=pow(.8,div(30,a.fps));a.dec_slow=pow(.99,div(30,a.fps));a.beat=Math.max(Math.max(a.bass,a.mid),a.treb);a.avg=a.avg*a.dec_slow+a.beat*(1-a.dec_slow);a.is_beat=above(a.beat,.4+a.avg+a.peak)*above(a.time,a.t0+.2);a.t0=a.is_beat*a.time+(1-a.is_beat)*a.t0;a.peak=a.is_beat*a.beat+(1-a.is_beat)*a.peak*a.dec_med;a.index=mod(a.index+a.is_beat,4);a.index2=mod(a.index2+a.is_beat*bnot(a.index),4);a.q20=a.avg;a.q21=a.beat;a.q22=a.peak;a.q23=a.index;a.q24=a.is_beat;a.q26=a.bass_att+
a.mid_att+a.treb_att;a.ready=a.is_beat*bnot(a.ready)+bnot(a.is_beat2)*a.ready;a.is_beat2=a.ready*above(a.time,a.t0+.2);a.q19=a.is_beat2;a.k1=a.is_beat*equal(a.index,0);a.p1=a.k1*(a.p1+1)+(1-a.k1)*a.p1;a.p2=a.dec_med*a.p2+(1-a.dec_med)*a.p1;a.rott=div(3.14159265359*a.p2,2);a.q27=a.index+1;a.q28=a.index2+1;a.q1=Math.cos(a.rott);a.q2=Math.sin(a.rott);a.q3=-a.q2;a.q4=a.q1;a.movex+=div(.06,a.fps);a.q30=a.movex;a.alt=a.alt*(1-a.dec_med)+a.q26*a.dec_med;a.q26-=a.alt;a.step=a.step+Math.max(a.q26,0)+a.q24-
Math.floor(a.step);a.q30=a.step;a.q30=a.movex;a.lx+=div(.03,a.fps);a.ly+=div(.3,a.fps)*a.q2;a.q10=a.lx;a.q11=0;a.zoom=1+0*a.rad;a.dx=0;a.dy=0;a.rot=.1*a.q1;`,pa=`float xlat_mutabledx;
float xlat_mutabledy;
vec2 xlat_mutableuv2;
vec2 xlat_mutablezz;
 shader_body { 
  vec2 uv_1;
  vec3 crisp_2;
  vec2 tmpvar_3;
  tmpvar_3.y = 0.0;
  tmpvar_3.x = texsize.w;
  vec2 tmpvar_4;
  tmpvar_4.x = 0.0;
  tmpvar_4.y = texsize.z;
  xlat_mutablezz = ((uv * texsize.xy) * 0.01);
  vec2 tmpvar_5;
  tmpvar_5.x = (cos((xlat_mutablezz.y * q1)) * sin(-(xlat_mutablezz.y)));
  tmpvar_5.y = (sin(xlat_mutablezz.x) * cos((xlat_mutablezz.y * q2)));
  uv_1 = (uv - ((tmpvar_5 * texsize.zw) * (8.0 + 
    (6.0 * q11)
  )));
  xlat_mutableuv2 = (((uv_1 / 2.0) * q27) / 4.0);
  xlat_mutabledx = dot ((texture (sampler_main, (xlat_mutableuv2 + tmpvar_3)).xyz - texture (sampler_main, (xlat_mutableuv2 - tmpvar_3)).xyz), vec3(0.32, 0.49, 0.29));
  xlat_mutabledy = dot ((texture (sampler_main, (xlat_mutableuv2 + tmpvar_4)).xyz - texture (sampler_main, (xlat_mutableuv2 - tmpvar_4)).xyz), vec3(0.32, 0.49, 0.29));
  float tmpvar_6;
  tmpvar_6 = (0.15 + (0.1 * q28));
  vec2 tmpvar_7;
  tmpvar_7 = (xlat_mutableuv2 + (time / 100.0));
  xlat_mutabledx = (xlat_mutabledx + (tmpvar_6 * (texture (sampler_noise_hq, tmpvar_7).x - 0.5)));
  xlat_mutabledy = (xlat_mutabledy + (tmpvar_6 * (texture (sampler_noise_hq, tmpvar_7).y - 0.5)));
  vec2 tmpvar_8;
  tmpvar_8.x = xlat_mutabledx;
  tmpvar_8.y = xlat_mutabledy;
  xlat_mutablezz = tmpvar_8;
  crisp_2 = (texture (sampler_main, (uv_1 + (tmpvar_8 * 0.04))).xyz + texture (sampler_main, uv_1).xyz);
  crisp_2 = (crisp_2 * 0.5);
  crisp_2 = (crisp_2 + ((0.05 * 
    (0.9 + (0.1 * roam_cos))
  .xyz) - (
    sqrt(dot (tmpvar_8, tmpvar_8))
   * 0.3)));
  vec4 tmpvar_9;
  tmpvar_9.w = 1.0;
  tmpvar_9.xyz = ((crisp_2 * 0.97) - 0.015);
  ret = tmpvar_9.xyz;
 }`,ma=`vec2 xlat_mutabledz;
vec3 xlat_mutableret1;
vec2 xlat_mutableuv3;
vec2 xlat_mutableuv4;
 shader_body { 
  vec2 uv_1;
  float inten_3;
  float dist_4;
  vec3 ret_5;
  uv_1 = (uv - 0.5);
  xlat_mutabledz = vec2(0.0, 0.0);
  dist_4 = 1.0;
  inten_3 = 1.0;
  xlat_mutableret1 = vec3(0.0, 0.0, 0.0);
  for (float n_2 = 0.0; n_2 <= 4.0; n_2 += 1.0) {
    dist_4 = (1.0 - fract((
      (0.2 * n_2)
     + 
      (time / 4.0)
    )));
    inten_3 = ((sqrt(dist_4) * (1.0 - dist_4)) * 2.0);
    vec2 tmpvar_6;
    tmpvar_6.y = 0.0;
    tmpvar_6.x = (time / 8.0);
    xlat_mutableuv3 = (((
      (2.0 * uv_1)
     * dist_4) + 0.4) + tmpvar_6);
    vec2 tmpvar_7;
    tmpvar_7.y = 0.0;
    tmpvar_7.x = texsize.z;
    vec2 tmpvar_8;
    tmpvar_8.y = 0.0;
    tmpvar_8.x = texsize.z;
    xlat_mutabledz.x = (xlat_mutabledz.x + (inten_3 * dot (
      (texture (sampler_main, (xlat_mutableuv3 + tmpvar_7)).xyz - texture (sampler_main, (xlat_mutableuv3 - tmpvar_8)).xyz)
    , vec3(0.32, 0.49, 0.29))));
    vec2 tmpvar_9;
    tmpvar_9.x = 0.0;
    tmpvar_9.y = texsize.w;
    vec2 tmpvar_10;
    tmpvar_10.x = 0.0;
    tmpvar_10.y = texsize.w;
    xlat_mutabledz.y = (xlat_mutabledz.y + (inten_3 * dot (
      (texture (sampler_main, (xlat_mutableuv3 + tmpvar_9)).xyz - texture (sampler_main, (xlat_mutableuv3 - tmpvar_10)).xyz)
    , vec3(0.32, 0.49, 0.29))));
    xlat_mutableret1 = max (xlat_mutableret1, (texture (sampler_main, xlat_mutableuv3).xyz * inten_3));
  };
  uv_1 = (uv_1 + (xlat_mutabledz * 14.0));
  xlat_mutableuv4 = (uv_1 - vec2(0.2, -0.1));
  float tmpvar_11;
  tmpvar_11 = (0.5 * clamp ((1.0/(
    (abs(uv_1.y) + 0.1)
  )), 0.0, 12.0));
  vec2 tmpvar_12;
  tmpvar_12.x = (uv_1.x * tmpvar_11);
  tmpvar_12.y = tmpvar_11;
  vec3 tmpvar_13;
  tmpvar_13.xy = vec2(0.0, 0.0);
  tmpvar_13.z = clamp ((1.0 - (3.0 * uv_1.y)), 0.0, 1.0);
  ret_5 = (vec3(0.0, 0.1, 0.1) + (0.1 * tmpvar_13));
  ret_5 = (ret_5 + (vec3(dot (texture (sampler_noise_hq, 
    (tmpvar_12 + (0.04 * time))
  ), vec4(0.32, 0.49, 0.29, 0.0))) * (
    (clamp ((1.0 - (12.0 * uv_1.y)), 0.0, 1.0) * 0.1)
   / 
    (0.03 + sqrt(dot (xlat_mutableuv4, xlat_mutableuv4)))
  )));
  ret_5 = (ret_5 + ((0.4 * xlat_mutableret1) + (
    (0.25 * q22)
   * xlat_mutableret1)));
  vec4 tmpvar_14;
  tmpvar_14.w = 1.0;
  tmpvar_14.xyz = ret_5;
  ret = tmpvar_14.xyz;
 }`,ha={baseVals:ca,shapes:la,waves:ua,init_eqs_str:da,frame_eqs_str:fa,pixel_eqs_str:``,pixel_eqs:``,warp:pa,comp:ma},ga={rating:0,gammaadj:2.960001,decay:.91,echo_zoom:1.029896,echo_alpha:.5,wave_mode:7,additivewave:1,modwavealphabyvolume:1,wave_brighten:0,wrap:0,darken_center:1,brighten:1,wave_a:.001,wave_scale:1.285751,wave_smoothing:.63,modwavealphastart:.71,modwavealphaend:1.3,warpscale:1.331,zoomexp:2.987792,zoom:1.000432,warp:.01,wave_r:.65,wave_g:.65,wave_b:.65,ob_size:0,ob_r:.01,ib_size:0,mv_a:0},_a=[{baseVals:{enabled:0}},{baseVals:{enabled:1,textured:1,rad:1.998627,tex_zoom:.670315,r:0,g:1,a2:1},init_eqs_str:`a.q1=0;a.ra=0;a.ti=0;a.q4=0;a.ra=0;a.ti=0;a.ti=0;a.h=0;a.ra=0;a.ra=0;a.ra=0;a.s=0;a.l=0;a.q5=0;a.tmpb=0;a.l=0;a.l=0;a.s=0;a.l=0;a.s=0;a.s=0;a.l=0;a.tmpa=0;a.l=0;a.tmpb=0;a.hvr=0;a.h=0;a.hvr=0;a.hvr=0;a.hvr=0;a.hvr=0;a.hvr=0;a.hvr=0;a.hvg=0;a.h=0;a.hvg=0;a.hvg=0;a.hvg=0;a.hvg=0;a.hvg=0;a.hvg=0;a.hvb=0;a.h=0;a.hvb=0;a.hvb=0;a.hvb=0;a.hvb=0;a.hvb=0;a.hvb=0;a.hvr=0;a.tmpa=0;a.tmpb=0;a.tmpa=0;a.hvr=0;a.hvr=0;a.tmpb=0;a.hvr=0;a.tmpa=0;a.tmpb=0;a.tmpa=0;a.hvr=0;a.tmpa=0;a.hvg=0;a.tmpa=
0;a.tmpb=0;a.tmpa=0;a.hvg=0;a.hvg=0;a.tmpb=0;a.hvg=0;a.tmpa=0;a.tmpb=0;a.tmpa=0;a.hvg=0;a.tmpa=0;a.hvb=0;a.tmpa=0;a.tmpb=0;a.tmpa=0;a.hvb=0;a.hvb=0;a.tmpb=0;a.hvb=0;a.tmpa=0;a.tmpb=0;a.tmpa=0;a.hvb=0;a.tmpa=0;`,frame_eqs_str:`a.g=.7;a.g2=a.g;a.a=a.q1;a.a2=a.a;a.ra=.001*randint(1001);a.ti=a.q4+.25;a.ra=a.ti-Math.floor(a.ti);a.tex_zoom=.55;a.h=.00001<Math.abs(above(a.ra,.15))?a.ra-.15:a.ra+.85;a.s=1;a.l=a.q5;a.tmpb=.00001<Math.abs(below(a.l,.5))?a.l*(1+a.s):a.l+a.s-a.s*a.l;a.tmpa=2*a.l-a.tmpb;a.hvr=a.h+.333333;a.hvr=.00001<Math.abs(below(a.hvr,0))?a.hvr+1:.00001<Math.abs(above(a.hvr,1))?a.hvr-1:a.hvr;a.hvg=a.h;a.hvg=.00001<Math.abs(below(a.hvg,0))?a.hvg+1:.00001<Math.abs(above(a.hvg,1))?a.hvg-1:a.hvg;
a.hvb=a.h-.333333;a.hvb=.00001<Math.abs(below(a.hvb,0))?a.hvb+1:.00001<Math.abs(above(a.hvb,1))?a.hvb-1:a.hvb;a.r=.00001<Math.abs(below(6*a.hvr,1))?a.tmpa+6*(a.tmpb-a.tmpa)*a.hvr:.00001<Math.abs(below(2*a.hvr,1))?a.tmpb:.00001<Math.abs(below(3*a.hvr,2))?a.tmpa+(a.tmpb-a.tmpa)*(.666666-a.hvr)*6:a.tmpa;a.g=.00001<Math.abs(below(6*a.hvg,1))?a.tmpa+6*(a.tmpb-a.tmpa)*a.hvg:.00001<Math.abs(below(2*a.hvg,1))?a.tmpb:.00001<Math.abs(below(3*a.hvg,2))?a.tmpa+(a.tmpb-a.tmpa)*(.666666-a.hvg)*6:a.tmpa;a.b=.00001<
Math.abs(below(6*a.hvb,1))?a.tmpa+6*(a.tmpb-a.tmpa)*a.hvb:.00001<Math.abs(below(2*a.hvb,1))?a.tmpb:.00001<Math.abs(below(3*a.hvb,2))?a.tmpa+(a.tmpb-a.tmpa)*(.666666-a.hvb)*6:a.tmpa;a.r2=a.r;a.g2=a.g;a.b2=a.b;`},{baseVals:{enabled:1,textured:1,rad:1.998627,tex_zoom:.670315,r:0,g:1,a2:1},init_eqs_str:`a.q1=0;a.ra=0;a.ti=0;a.q4=0;a.ra=0;a.ti=0;a.ti=0;a.h=0;a.ra=0;a.ra=0;a.ra=0;a.s=0;a.l=0;a.q5=0;a.tmpb=0;a.l=0;a.l=0;a.s=0;a.l=0;a.s=0;a.s=0;a.l=0;a.tmpa=0;a.l=0;a.tmpb=0;a.hvr=0;a.h=0;a.hvr=0;a.hvr=0;a.hvr=0;a.hvr=0;a.hvr=0;a.hvr=0;a.hvg=0;a.h=0;a.hvg=0;a.hvg=0;a.hvg=0;a.hvg=0;a.hvg=0;a.hvg=0;a.hvb=0;a.h=0;a.hvb=0;a.hvb=0;a.hvb=0;a.hvb=0;a.hvb=0;a.hvb=0;a.hvr=0;a.tmpa=0;a.tmpb=0;a.tmpa=0;a.hvr=0;a.hvr=0;a.tmpb=0;a.hvr=0;a.tmpa=0;a.tmpb=0;a.tmpa=0;a.hvr=0;a.tmpa=0;a.hvg=0;a.tmpa=
0;a.tmpb=0;a.tmpa=0;a.hvg=0;a.hvg=0;a.tmpb=0;a.hvg=0;a.tmpa=0;a.tmpb=0;a.tmpa=0;a.hvg=0;a.tmpa=0;a.hvb=0;a.tmpa=0;a.tmpb=0;a.tmpa=0;a.hvb=0;a.hvb=0;a.tmpb=0;a.hvb=0;a.tmpa=0;a.tmpb=0;a.tmpa=0;a.hvb=0;a.tmpa=0;`,frame_eqs_str:`a.g=.7;a.g2=a.g;a.a=2*a.q1;a.a2=a.a;a.ra=.001*randint(1001);a.ti=a.q4+.25;a.ra=a.ti-Math.floor(a.ti);a.tex_zoom=.45;a.h=.00001<Math.abs(above(a.ra,.15))?a.ra-.15:a.ra+.85;a.s=1;a.l=a.q5;a.tmpb=.00001<Math.abs(below(a.l,.5))?a.l*(1+a.s):a.l+a.s-a.s*a.l;a.tmpa=2*a.l-a.tmpb;a.hvr=a.h+.333333;a.hvr=.00001<Math.abs(below(a.hvr,0))?a.hvr+1:.00001<Math.abs(above(a.hvr,1))?a.hvr-1:a.hvr;a.hvg=a.h;a.hvg=.00001<Math.abs(below(a.hvg,0))?a.hvg+1:.00001<Math.abs(above(a.hvg,1))?a.hvg-1:
a.hvg;a.hvb=a.h-.333333;a.hvb=.00001<Math.abs(below(a.hvb,0))?a.hvb+1:.00001<Math.abs(above(a.hvb,1))?a.hvb-1:a.hvb;a.r=.00001<Math.abs(below(6*a.hvr,1))?a.tmpa+6*(a.tmpb-a.tmpa)*a.hvr:.00001<Math.abs(below(2*a.hvr,1))?a.tmpb:.00001<Math.abs(below(3*a.hvr,2))?a.tmpa+(a.tmpb-a.tmpa)*(.666666-a.hvr)*6:a.tmpa;a.g=.00001<Math.abs(below(6*a.hvg,1))?a.tmpa+6*(a.tmpb-a.tmpa)*a.hvg:.00001<Math.abs(below(2*a.hvg,1))?a.tmpb:.00001<Math.abs(below(3*a.hvg,2))?a.tmpa+(a.tmpb-a.tmpa)*(.666666-a.hvg)*6:a.tmpa;a.b=
.00001<Math.abs(below(6*a.hvb,1))?a.tmpa+6*(a.tmpb-a.tmpa)*a.hvb:.00001<Math.abs(below(2*a.hvb,1))?a.tmpb:.00001<Math.abs(below(3*a.hvb,2))?a.tmpa+(a.tmpb-a.tmpa)*(.666666-a.hvb)*6:a.tmpa;a.r2=a.r;a.g2=a.g;a.b2=a.b;`},{baseVals:{enabled:1,sides:3,textured:1,rad:.901615,tex_zoom:1.10242,g:1,b:1,a:0,r2:1,b2:1,a2:1,border_a:0},init_eqs_str:``,frame_eqs_str:`a.ang=.0062832*randint(1001);a.tex_ang=a.ang;`}],va=[{baseVals:{enabled:1,spectrum:1,usedots:1,thick:1,additive:1,smoothing:0,r:.7,g:.9},init_eqs_str:`a.xang=0;a.rm=0;a.fov=0;a.spm=0;a.t5=0;a.sam=0;a.rh=0;a.mo=0;a.ro=0;a.t1=0;a.rl=0;a.yang=0;a.rk=0;a.q6=0;a.it=0;a.rg=0;a.tme=0;a.rc=0;a.t8=0;a.wmod=0;a.rq=0;a.t3=0;a.my=0;a.oz=0;a.t6=0;a.rf=0;a.pi=0;a.ri=0;a.t7=0;a.mz=0;a.spb=0;a.spa=0;a.rd=0;a.oy=0;a.rj=0;a.mod=0;a.ra=0;a.mx=0;a.rp=0;a.t2=0;a.re=0;a.sp=0;a.q2=0;a.zang=0;a.cut=0;a.q3=0;a.rn=0;a.rr=0;a.t4=0;a.sm=0;a.q7=0;a.rb=0;a.ox=0;a.q8=0;`,frame_eqs_str:`a.ra=.00001<Math.abs(a.ra)?a.ra:2+.008*randint(1001);a.rb=.00001<Math.abs(a.rb)?a.rb:2+.008*randint(1001);a.rc=.00001<Math.abs(a.rc)?a.rc:2+.008*randint(1001);a.rd=.00001<Math.abs(a.rd)?a.rd:2+.008*randint(1001);a.re=.00001<Math.abs(a.re)?a.re:2+.008*randint(1001);a.rf=.00001<Math.abs(a.rf)?a.rf:2+.008*randint(1001);a.t1=6.2832*a.ra;a.t2=6.2832*a.rb;a.t3=6.2832*a.rc;a.t4=6.2832*a.rd;a.t5=6.2832*a.re;a.t6=6.2832*a.rf;a.rg=.00001<Math.abs(a.rg)?a.rg:.1+.0008*randint(1001);a.rh=
.00001<Math.abs(a.rh)?a.rh:.1+.0008*randint(1001);a.t7=a.rg;a.t8=a.rh;`,point_eqs_str:`a.ra=.00001<Math.abs(a.ra)?a.ra:2+.008*randint(1001);a.rb=.00001<Math.abs(a.rb)?a.rb:2+.008*randint(1001);a.rc=.00001<Math.abs(a.rc)?a.rc:2+.008*randint(1001);a.rd=.00001<Math.abs(a.rd)?a.rd:2+.008*randint(1001);a.re=.00001<Math.abs(a.re)?a.re:2+.008*randint(1001);a.rf=.00001<Math.abs(a.rf)?a.rf:2+.008*randint(1001);a.rg=.00001<Math.abs(a.rg)?a.rg:2+.008*randint(1001);a.rh=.00001<Math.abs(a.rh)?a.rh:2+.008*randint(1001);a.ri=.00001<Math.abs(a.ri)?a.ri:2+.008*randint(1001);a.rj=
.00001<Math.abs(a.rj)?a.rj:2+.008*randint(1001);a.rk=.00001<Math.abs(a.rk)?a.rk:2+.008*randint(1001);a.rl=.00001<Math.abs(a.rl)?a.rl:2+.008*randint(1001);a.rm=.00001<Math.abs(a.rm)?a.rm:2+.008*randint(1001);a.rn=.00001<Math.abs(a.rn)?a.rn:2+.008*randint(1001);a.ro=.00001<Math.abs(a.ro)?a.ro:2+.008*randint(1001);a.rp=.00001<Math.abs(a.rp)?a.rp:2+.008*randint(1001);a.rq=.00001<Math.abs(a.rq)?a.rq:2+.008*randint(1001);a.rr=.00001<Math.abs(a.rr)?a.rr:2+.008*randint(1001);a.it*=above(a.sample,0);a.it+=
1;a.pi=6.2813;a.sam=a.sample;a.spm=.5+.5*Math.sin(6.24*(a.q2-a.sam));a.a=Math.min((1-a.sam)*a.value2*3,1);a.r=pow(1-a.sam,1);a.g=pow(1-a.sam,1);a.b=pow(1-a.sam,1);a.sp=.15*a.q6-.2*a.sam;a.spa=.15*a.q7-.2*a.sam;a.spb=.15*a.q8-.2*a.sam;a.ox=a.sam*(.5*Math.sin(a.sp*a.ra*a.pi)+.5*Math.sin(a.sp*a.rd*a.pi));a.oy=a.sam*(.5*Math.sin(a.sp*a.rb*a.pi)+.5*Math.sin(a.sp*a.re*a.pi));a.oz=a.sam*(.5*Math.sin(a.sp*a.rc*a.pi)+.5*Math.sin(a.sp*a.rf*a.pi));a.cut=.2;a.sm=a.sam*above(a.sam,a.cut);a.mo=randint(2);a.ox+=
Math.max(0,a.sm-a.cut)*(.00001<Math.abs(a.mo)?Math.sin(a.spa*a.rg):Math.sin(a.spa*a.rh));a.oy+=Math.max(0,a.sm-a.cut)*(.00001<Math.abs(a.mo)?Math.sin(a.spa*a.ri):Math.sin(a.spa*a.rj));a.oz+=Math.max(0,a.sm-a.cut)*(.00001<Math.abs(a.mo)?Math.sin(a.spa*a.rk):Math.sin(a.spa*a.rl));a.cut=.4;a.sm*=above(a.sm,a.cut);a.mo=randint(2);a.ox+=Math.max(0,a.sm-a.cut)*(.00001<Math.abs(a.mo)?Math.sin(a.spb*a.rm):Math.sin(a.spb*a.rp));a.oy+=Math.max(0,a.sm-a.cut)*(.00001<Math.abs(a.mo)?Math.sin(a.spb*a.rn):Math.sin(a.spb*
a.rq));a.oz+=Math.max(0,a.sm-a.cut)*(.00001<Math.abs(a.mo)?Math.sin(a.spb*a.ro):Math.sin(a.spb*a.rr));a.xang=.1*a.q6;a.yang=.1*a.q7;a.zang=.1*a.q8;a.fov=.5;a.mx=a.ox*Math.cos(a.yang)+a.oz*Math.sin(a.yang);a.mz=-a.ox*Math.sin(a.yang)+a.oz*Math.cos(a.yang);a.ox=a.mx;a.oz=a.mz;a.mx=a.ox*Math.cos(a.zang)-a.oy*Math.sin(a.zang);a.my=a.ox*Math.sin(a.zang)+a.oy*Math.cos(a.zang);a.ox=a.mx;a.oy=a.my;a.my=a.oy*Math.cos(a.xang)-a.oz*Math.sin(a.xang);a.mz=a.oy*Math.sin(a.xang)+a.oz*Math.cos(a.xang);a.oy=a.my;
a.oz=a.mz;a.tme=2*(a.q6+a.q7+a.q8)-24.96*a.sam;a.mod=1-a.sam;a.wmod=1;a.ox=a.ox*(1-a.mod)+(.5*Math.sin(.33*a.tme)+.5*Math.cos(.542*a.tme))*a.mod;a.oy=a.oy*(1-a.mod)+(.5*Math.cos(.24*a.tme)+.5*Math.sin(.542*a.tme))*a.mod;a.oz=a.oz*(1-a.mod)+(.5*Math.sin(.11*a.tme)+.5*Math.cos(.542*a.tme))*a.mod;a.ox*=a.q3;a.oy*=a.q3;a.oz*=a.q3;a.oz-=2;a.x=div(a.ox*a.fov,a.oz)+.5;a.x=.75*(a.x-.5)+.5;a.y=div(a.oy*a.fov,a.oz)+.5;`},{baseVals:{enabled:1,spectrum:1,usedots:1,thick:1,additive:1,smoothing:0,r:.7,g:.9},init_eqs_str:`a.xang=0;a.rm=0;a.fov=0;a.spm=0;a.t5=0;a.sam=0;a.rh=0;a.mo=0;a.ro=0;a.t1=0;a.rl=0;a.yang=0;a.rk=0;a.q6=0;a.it=0;a.rg=0;a.tme=0;a.rc=0;a.t8=0;a.wmod=0;a.rq=0;a.t3=0;a.my=0;a.oz=0;a.t6=0;a.rf=0;a.pi=0;a.ri=0;a.t7=0;a.mz=0;a.spb=0;a.spa=0;a.rd=0;a.oy=0;a.rj=0;a.mod=0;a.ra=0;a.mx=0;a.rp=0;a.t2=0;a.re=0;a.sp=0;a.q2=0;a.zang=0;a.cut=0;a.q3=0;a.rn=0;a.rr=0;a.t4=0;a.sm=0;a.q7=0;a.rb=0;a.ox=0;a.q8=0;`,frame_eqs_str:`a.ra=.00001<Math.abs(a.ra)?a.ra:2+.008*randint(1001);a.rb=.00001<Math.abs(a.rb)?a.rb:2+.008*randint(1001);a.rc=.00001<Math.abs(a.rc)?a.rc:2+.008*randint(1001);a.rd=.00001<Math.abs(a.rd)?a.rd:2+.008*randint(1001);a.re=.00001<Math.abs(a.re)?a.re:2+.008*randint(1001);a.rf=.00001<Math.abs(a.rf)?a.rf:2+.008*randint(1001);a.t1=6.2832*a.ra;a.t2=6.2832*a.rb;a.t3=6.2832*a.rc;a.t4=6.2832*a.rd;a.t5=6.2832*a.re;a.t6=6.2832*a.rf;a.rg=.00001<Math.abs(a.rg)?a.rg:.1+.0008*randint(1001);a.rh=
.00001<Math.abs(a.rh)?a.rh:.1+.0008*randint(1001);a.t7=a.rg;a.t8=a.rh;`,point_eqs_str:`a.ra=.00001<Math.abs(a.ra)?a.ra:2+.008*randint(1001);a.rb=.00001<Math.abs(a.rb)?a.rb:2+.008*randint(1001);a.rc=.00001<Math.abs(a.rc)?a.rc:2+.008*randint(1001);a.rd=.00001<Math.abs(a.rd)?a.rd:2+.008*randint(1001);a.re=.00001<Math.abs(a.re)?a.re:2+.008*randint(1001);a.rf=.00001<Math.abs(a.rf)?a.rf:2+.008*randint(1001);a.rg=.00001<Math.abs(a.rg)?a.rg:2+.008*randint(1001);a.rh=.00001<Math.abs(a.rh)?a.rh:2+.008*randint(1001);a.ri=.00001<Math.abs(a.ri)?a.ri:2+.008*randint(1001);a.rj=
.00001<Math.abs(a.rj)?a.rj:2+.008*randint(1001);a.rk=.00001<Math.abs(a.rk)?a.rk:2+.008*randint(1001);a.rl=.00001<Math.abs(a.rl)?a.rl:2+.008*randint(1001);a.rm=.00001<Math.abs(a.rm)?a.rm:2+.008*randint(1001);a.rn=.00001<Math.abs(a.rn)?a.rn:2+.008*randint(1001);a.ro=.00001<Math.abs(a.ro)?a.ro:2+.008*randint(1001);a.rp=.00001<Math.abs(a.rp)?a.rp:2+.008*randint(1001);a.rq=.00001<Math.abs(a.rq)?a.rq:2+.008*randint(1001);a.rr=.00001<Math.abs(a.rr)?a.rr:2+.008*randint(1001);a.it*=above(a.sample,0);a.it+=
1;a.pi=6.2813;a.sam=a.sample;a.spm=.5+.5*Math.sin(6.24*(a.q2-a.sam));a.a=Math.min((1-a.sam)*a.value2*3,1);a.g=1;a.r=pow(1-a.sam,1);a.b=pow(1-a.sam,1);a.g=pow(1-a.sam,1);a.sp=.15*a.q6-.2*a.sam;a.spa=.15*a.q7-.2*a.sam;a.spb=.15*a.q8-.2*a.sam;a.ox=a.sam*(.5*Math.sin(a.sp*a.ra*a.pi)+.5*Math.sin(a.sp*a.rd*a.pi));a.oy=a.sam*(.5*Math.sin(a.sp*a.rb*a.pi)+.5*Math.sin(a.sp*a.re*a.pi));a.oz=a.sam*(.5*Math.sin(a.sp*a.rc*a.pi)+.5*Math.sin(a.sp*a.rf*a.pi));a.cut=.2;a.sm=a.sam*above(a.sam,a.cut);a.mo=randint(2);
a.ox+=Math.max(0,a.sm-a.cut)*(.00001<Math.abs(a.mo)?Math.sin(a.spa*a.rg):Math.sin(a.spa*a.rh));a.oy+=Math.max(0,a.sm-a.cut)*(.00001<Math.abs(a.mo)?Math.sin(a.spa*a.ri):Math.sin(a.spa*a.rj));a.oz+=Math.max(0,a.sm-a.cut)*(.00001<Math.abs(a.mo)?Math.sin(a.spa*a.rk):Math.sin(a.spa*a.rl));a.cut=.4;a.sm*=above(a.sm,a.cut);a.mo=randint(2);a.ox+=Math.max(0,a.sm-a.cut)*(.00001<Math.abs(a.mo)?Math.sin(a.spb*a.rm):Math.sin(a.spb*a.rp));a.oy+=Math.max(0,a.sm-a.cut)*(.00001<Math.abs(a.mo)?Math.sin(a.spb*a.rn):
Math.sin(a.spb*a.rq));a.oz+=Math.max(0,a.sm-a.cut)*(.00001<Math.abs(a.mo)?Math.sin(a.spb*a.ro):Math.sin(a.spb*a.rr));a.xang=.1*a.q6;a.yang=.1*a.q7;a.zang=.1*a.q8;a.fov=.5;a.mx=a.ox*Math.cos(a.yang)+a.oz*Math.sin(a.yang);a.mz=-a.ox*Math.sin(a.yang)+a.oz*Math.cos(a.yang);a.ox=a.mx;a.oz=a.mz;a.mx=a.ox*Math.cos(a.zang)-a.oy*Math.sin(a.zang);a.my=a.ox*Math.sin(a.zang)+a.oy*Math.cos(a.zang);a.ox=a.mx;a.oy=a.my;a.my=a.oy*Math.cos(a.xang)-a.oz*Math.sin(a.xang);a.mz=a.oy*Math.sin(a.xang)+a.oz*Math.cos(a.xang);
a.oy=a.my;a.oz=a.mz;a.tme=2*(a.q6+a.q7+a.q8)-24.96*a.sam;a.mod=1-a.sam;a.wmod=1;a.ox=a.ox*(1-a.mod)+(.5*Math.sin(.21*a.tme)+.5*Math.cos(.671*a.tme))*a.mod;a.oy=a.oy*(1-a.mod)+(.5*Math.cos(.14*a.tme)+.5*Math.sin(.236*a.tme))*a.mod;a.oz=a.oz*(1-a.mod)+(.5*Math.sin(.87*a.tme)+.5*Math.cos(.247*a.tme))*a.mod;a.ox*=a.q3;a.oy*=a.q3;a.oz*=a.q3;a.oz-=2;a.x=div(a.ox*a.fov,a.oz)+.5;a.x=.75*(a.x-.5)+.5;a.y=div(a.oy*a.fov,a.oz)+.5;`},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],ya=`a.tic=0;a.slide=0;a.toc=0;a.vt=0;a.q6=0;a.bt=0;a.q1=0;a.q5=0;a.mid_avg=0;a.tt=0;a.tin=0;a.bass_avg=0;a.vav=0;a.q4=0;a.mt=0;a.arot=0;a.ra=0;a.treb_avg=0;a.vol=0;a.sp=0;a.q2=0;a.vrt=0;a.q3=0;a.q7=0;a.q8=0;`,ba=`a.warp=0;a.arot=1.5708;a.decay=1;a.q1=.1;a.q5=.6;a.tic=Math.min(a.time-a.tin,.1);a.tin=a.time;a.vol=.333333*(a.bass_att+a.treb_att+a.mid_att);a.ra=10;a.treb_avg=a.tic*(a.treb_avg*(div(1,a.tic)-a.ra)+a.ra*a.treb);a.mid_avg=a.tic*(a.mid_avg*(div(1,a.tic)-a.ra)+a.ra*a.mid);a.bass_avg=a.tic*(a.bass_avg*(div(1,a.tic)-a.ra)+a.ra*a.bass);a.vav=a.tic*(a.vav*(div(1,a.tic)-a.ra)+a.ra*(a.bass+a.treb+a.mid)*.33333);a.tt+=a.tic*a.treb;a.mt+=a.tic*a.mid;a.bt+=a.tic*a.bass;a.vt+=a.tic*a.vav;
a.sp=.1*Math.abs(a.vav-a.slide);a.slide=(.00001<Math.abs(above(a.slide,a.vav))?a.slide-a.tic*a.sp:a.slide+a.tic*a.sp)+(1-a.toc)*a.vav*.2;a.toc=1;a.q6=a.bt;a.q7=a.mt;a.q8=a.tt;a.q3=a.slide;a.q2=.5*a.vt;a.vrt+=a.tic*Math.min(1,Math.max(.1,2-a.vav));a.q4=6*a.vrt;a.zoom=1+.2*pow(a.vav,4);a.monitor=a.vav;`,xa={baseVals:ga,shapes:_a,waves:va,init_eqs_str:ya,frame_eqs_str:ba,pixel_eqs_str:``,pixel_eqs:``,warp:``,comp:``},Sa={rating:0,gammaadj:1,decay:1,echo_zoom:.999797,echo_alpha:.5,wave_mode:7,wave_brighten:0,wave_a:.004538,wave_scale:.167026,wave_smoothing:0,wave_mystery:1e-6,modwavealphastart:1,modwavealphaend:1.000001,warpscale:.106584,zoomexp:4.100456,warp:.01,wave_x:.95,wave_y:1,ob_size:.005,ob_r:1,ob_g:1,ob_b:1,ib_size:0,ib_r:1,ib_g:1,ib_b:1,mv_x:64,mv_y:48,mv_l:0,mv_b:0,mv_a:0,b1ed:0},Ca=[{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:1,sides:84,additive:1,thickoutline:1,rad:.167768,tex_zoom:.503296,r:0,b:.2,a:.6,g2:0,border_a:0},init_eqs_str:`a.ti=0;a.ti=0;a.ti=0;a.ti=0;a.ti=0;a.ti=0;a.vx=0;a.vy=0;`,frame_eqs_str:`a.ti=.3*a.time;a.x=.5+.34*Math.sin(a.ti);a.y=.5+.34*Math.cos(a.ti);a.rad+=a.bass;a.ti=2.3*a.time;a.x+=.1*Math.sin(a.ti);a.y+=.1*Math.cos(a.ti);`},{baseVals:{enabled:0}}],wa=[{baseVals:{enabled:1,samples:41,usedots:1,additive:1,scaling:.01,smoothing:0,g:0},init_eqs_str:`a.t8=1;a.t1=a.q5;`,frame_eqs_str:``,point_eqs_str:`a.x=.001*randint(1001);a.y=.001*randint(1001);a.g=.5*above(.001*randint(1001),.9);a.b=0;a.r=0;`},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],Ta=`a.tic=0;a.sw=0;a.q12=0;a.meanbass_att=0;a.q1=0;a.q5=0;a.q9=0;a.tin=0;a.lastbeat=0;a.beatrate=0;a.q11=0;a.peakbass_att=0;a.q10=0;a.an=0;a.alt=0;a.volume=0;a.beat=0;a.vol=0;a.sp=0;a.q2=0;a.q7=0;a.q8=0;`,Ea=`a.volume=.3*(a.bass+a.mid);a.beatrate=equal(a.beatrate,0)+(1-equal(a.beatrate,0))*(below(a.volume,.01)+(1-below(a.volume,.01))*a.beatrate);a.lastbeat+=equal(a.lastbeat,0)*a.time;a.meanbass_att=.05*(19*a.meanbass_att+a.bass_att);a.peakbass_att=Math.max(a.bass_att,a.peakbass_att);a.beat=above(a.volume,.8)*below(a.peakbass_att-a.bass_att,.05*a.peakbass_att)*above(a.time-a.lastbeat,.1+.5*(a.beatrate-.1));a.beatrate=Math.max(.00001<Math.abs(a.beat)?.00001<Math.abs(below(a.time-a.lastbeat,
2*a.beatrate))?.1*(9*a.beatrate+a.time-a.lastbeat):a.beatrate:a.beatrate,.1);a.peakbass_att=a.beat*a.bass_att+(1-a.beat)*a.peakbass_att*(.96*above(a.time-a.lastbeat,2*a.beatrate)+.996*(1-above(a.time-a.lastbeat,2*a.beatrate)));a.lastbeat=a.beat*a.time+(1-a.beat)*a.lastbeat;a.peakbass_att=Math.max(a.peakbass_att,1.1*a.meanbass_att);a.zoom=1;a.decay=1;a.warp=0;a.wave_a=0;a.tic=Math.min(a.time-a.tin,.1);a.tin=a.time;a.q2=1;a.q1=1;a.vol+=(div(a.alt+a.bass+a.mid,3)-a.vol)*a.tic;a.q5=a.vol*a.vol*a.vol*
2;a.q8=.5*Math.sin(a.time);a.q9=.5*Math.sin(.75*a.time);a.sw=Math.abs(a.sw-a.beat);a.an+=.5*a.tic*(1-2*a.sw);a.q7=1+1*(pow(a.q8,2)+pow(a.q9,2));a.q10=Math.sin(a.an);a.q11=Math.cos(a.an);a.sp+=a.tic*a.vol*a.vol*.5;a.q12=a.sp;a.monitor=a.q12;`,Da=` shader_body { 
  float conway_1;
  vec3 ret_2;
  ret_2 = ((texture (sampler_main, uv_orig).xyz * vec3(0.97, 1.0, 0.97)) - vec3(0.03, 0.0, 0.03));
  vec4 tmpvar_3;
  tmpvar_3 = texture (sampler_blur1, uv_orig);
  ret_2.z = (ret_2.z + ((
    (tmpvar_3.xyz * scale1)
   + bias1).z * 0.45));
  vec4 tmpvar_4;
  tmpvar_4 = texture (sampler_blur3, uv_orig);
  ret_2.x = (ret_2.x + ((
    ((tmpvar_3.xyz * scale1) + bias1)
  .z * 0.05) + (
    ((tmpvar_4.xyz * scale3) + bias3)
  .z * 0.05)));
  ret_2.z = (ret_2.z - ret_2.x);
  vec4 tmpvar_5;
  tmpvar_5 = texture (sampler_pw_main, uv_orig);
  ret_2.y = clamp (tmpvar_5.y, 0.0, 1.0);
  conway_1 = (texture (sampler_pw_main, (uv_orig - texsize.zw)).y + texture (sampler_pw_main, (uv_orig + (vec2(0.0, -1.0) * texsize.zw))).y);
  conway_1 = (conway_1 + texture (sampler_pw_main, (uv_orig + (vec2(1.0, -1.0) * texsize.zw))).y);
  conway_1 = (conway_1 + texture (sampler_pw_main, (uv_orig + (vec2(-1.0, 0.0) * texsize.zw))).y);
  conway_1 = (conway_1 + texture (sampler_pw_main, (uv_orig + (vec2(1.0, 0.0) * texsize.zw))).y);
  conway_1 = (conway_1 + texture (sampler_pw_main, (uv_orig + (vec2(-1.0, 1.0) * texsize.zw))).y);
  conway_1 = (conway_1 + texture (sampler_pw_main, (uv_orig + (vec2(0.0, 1.0) * texsize.zw))).y);
  conway_1 = (conway_1 + texture (sampler_pw_main, (uv_orig + texsize.zw)).y);
  float tmpvar_6;
  tmpvar_6 = (((q5 * 
    (1.0 - ((tmpvar_3.xyz * scale1) + bias1).y)
  ) * (1.0 - 
    ((texture (sampler_blur2, uv_orig).xyz * scale2) + bias2)
  .y)) * (1.0 - (
    (tmpvar_4.xyz * scale3)
   + bias3).y));
  conway_1 = (conway_1 - tmpvar_5.x);
  if ((conway_1 > 0.0)) {
    float tmpvar_7;
    tmpvar_7 = clamp (ret_2.y, 0.0, 1.0);
    if ((tmpvar_7 == 0.0)) {
      ret_2.y = (floor((tmpvar_6 * 1.8)) * q1);
    };
  };
  ret_2.y = (ret_2.y - ret_2.x);
  ret_2 = (ret_2 - (1.0 - q2));
  vec4 tmpvar_8;
  tmpvar_8.w = 1.0;
  tmpvar_8.xyz = ret_2;
  ret = tmpvar_8.xyz;
 }`,Oa=` shader_body { 
  vec2 uv3_1;
  vec2 uvm_2;
  vec3 ret_3;
  uvm_2 = (((
    ((uv - 0.5) * q7)
   * 
    (1.0/((((1.0 - 
      (rad * 0.1)
    ) + (q9 * 
      (uv.x - 0.5)
    )) + (q8 * (uv.y - 0.5)))))
  ) + 0.5) - 0.5);
  uvm_2 = (((
    (q10 * uvm_2)
   + 
    ((vec2(1.0, -1.0) * q11) * uvm_2.yx)
  ) * aspect.zw) + 0.5);
  uvm_2 = (abs((
    fract(((uvm_2 + q12) * 0.5))
   - 0.5)) * 2.0);
  uv3_1 = (((texture (sampler_main, uvm_2).zz - 0.37) * 0.13) + uvm_2);
  ret_3 = texture (sampler_pw_main, uvm_2).yyy;
  ret_3 = (pow (mix (vec3(
    (((texture (sampler_blur1, uv3_1).xyz * scale1) + bias1).z + ((texture (sampler_blur3, uv3_1).xyz * scale3) + bias3).z)
  ), ret_3, ret_3), vec3(0.5, 1.0, 2.0)) - 0.25);
  ret_3 = (ret_3 * ((texture (sampler_blur3, uv3_1).xyz * scale3) + bias3).y);
  vec4 tmpvar_4;
  tmpvar_4.w = 1.0;
  tmpvar_4.xyz = ret_3;
  ret = tmpvar_4.xyz;
 }`,ka={baseVals:Sa,shapes:Ca,waves:wa,init_eqs_str:Ta,frame_eqs_str:Ea,pixel_eqs_str:``,pixel_eqs:``,warp:Da,comp:Oa},Aa={rating:0,gammaadj:1,decay:.94,echo_zoom:1.0529,echo_orient:3,additivewave:1,wave_brighten:0,wave_a:.001,wave_scale:.01,wave_smoothing:.63,wave_mystery:-1,modwavealphastart:.71,modwavealphaend:1.3,warpscale:1.331,zoomexp:.999998,zoom:13.290894,dx:-.28,dy:-.32,warp:.01,wave_r:.65,wave_g:.65,wave_b:.65,ob_size:.04,ob_a:1,ib_size:.5,ib_r:1,ib_g:0,ib_b:1,mv_x:64,mv_y:48,mv_l:.2,mv_g:0,mv_b:0,mv_a:0},ja=[{baseVals:{enabled:1,sides:100,rad:.491382,r:0,g:1,b:1,g2:0,b2:.1,a2:.06,border_a:0},init_eqs_str:`a.q7=0;a.q8=0;`,frame_eqs_str:`a.x=.5+a.q7;a.y=.5+a.q8;`},{baseVals:{enabled:0}},{baseVals:{enabled:1,sides:24,rad:.164463,tex_zoom:.136686,g:1,b:1,a:.6,r2:1,border_a:0},init_eqs_str:`a.q7=0;a.q8=0;`,frame_eqs_str:`a.x=.5+a.q7;a.y=.5+a.q8;`},{baseVals:{enabled:0}}],Ma=[{baseVals:{enabled:1,thick:1},init_eqs_str:`a.dc=0;a.tic=0;a.t1=0;a.tir=0;a.mixc=0;a.it=0;a.q1=0;a.t3=0;a.my=0;a.ly=0;a.mixa=0;a.mx=0;a.t2=0;a.mixb=0;a.lx=0;a.q2=0;a.q3=0;`,frame_eqs_str:`a.tic=a.time-a.tir;a.tir=a.time;a.mixa=(a.mixa+a.q1*a.tic)*below(a.mixa,1E4);a.t1=a.mixa-Math.floor(a.mixa);a.mixb=(a.mixb+a.q2*a.tic)*below(a.mixb,1E4);a.t2=a.mixb-Math.floor(a.mixb);a.mixc=(a.mixc+a.q3*a.tic)*below(a.mixc,1E4);a.t3=a.mixc-Math.floor(a.mixc);`,point_eqs_str:`a.it=(a.it+1)*above(a.sample,0);a.dc=(a.dc+equal(mod(a.it,48),0))*above(a.sample,0);a.lx=a.t1*equal(a.dc,0)+(1-a.t3)*(equal(a.dc,2)+equal(a.dc,1))+a.t2*equal(a.dc,3);a.ly=.975*(equal(a.dc,1)+equal(a.dc,3));a.mx=-.1*equal(mod(a.it+6,6),0)+-.1*equal(mod(a.it+1,6),0)+.1*equal(mod(a.it+4,6),0)+.1*equal(mod(a.it+3,6),0);a.my=(a.my+.01*equal(mod(a.it+3,6),0)+.01*equal(mod(a.it,6),0))*(above(a.sample,0)-equal(mod(.5*a.it,48),0));a.x=.00001<Math.abs(below(a.dc,2))?a.lx+.2*a.mx:a.ly+
.1*a.my;a.y=.00001<Math.abs(below(a.dc,2))?a.ly+.1*a.my:a.lx+.2*a.mx;a.b=1;a.r=.8*equal(a.mx,0);a.g=1*equal(a.mx,0);a.a=equal(a.mx,0)*below(a.dc,4);`},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],Na=`a.tic=0;a.q1=0;a.mid_avg=0;a.tin=0;a.bass_avg=0;a.vav=0;a.q4=0;a.rd=0;a.mt=0;a.ra=0;a.tm=0;a.treb_avg=0;a.q2=0;a.q3=0;a.q7=0;a.rb=0;a.q8=0;a.zoom=1;a.xpos=0;a.ypos=0;`,Pa=`a.decay=1;a.warp=0;a.tic=Math.min(a.time-a.tin,.1);a.tin=a.time;a.ra=10;a.treb_avg=a.tic*(a.treb_avg*(div(1,a.tic)-a.ra)+a.ra*a.treb);a.mid_avg=a.tic*(a.mid_avg*(div(1,a.tic)-a.ra)+a.ra*a.mid);a.bass_avg=a.tic*(a.bass_avg*(div(1,a.tic)-a.ra)+a.ra*a.bass);a.rb=1;a.vav=a.tic*(a.vav*(div(1,a.tic)-a.rb)+a.rb*(a.bass+a.treb+a.mid)*.33333);a.q1=a.treb_avg;a.q2=a.mid_avg;a.q3=a.bass_avg;a.q4=a.vav;a.mt=(a.mt+a.tic*a.vav*100)*below(a.mt,1E4);a.q7=.01*Math.sin(.02*a.mt);a.q8=.115*Math.sin(.01*
a.mt);a.dx=.07*Math.sin(.1*a.mt);a.dy=.07*Math.cos(.069*a.mt);a.monitor=a.mt;`,Fa=`a.rd=sqrt(sqr(a.x-.5-a.q7)+sqr(1.9*(a.y-.5+a.q8)));a.tm=a.time+a.rad;a.zoom=div(a.rad+Math.sin(a.rd-3.5),a.rad);a.rot=a.rd+div(a.tm,3);`,Ia={baseVals:Aa,shapes:ja,waves:Ma,init_eqs_str:Na,frame_eqs_str:Pa,pixel_eqs_str:Fa,warp:``,comp:``},La={rating:5,gammaadj:1.9,echo_zoom:1.169,additivewave:1,wave_thick:1,wave_a:.001,wave_scale:.325,wave_smoothing:.9,modwavealphastart:.88,modwavealphaend:1.98,zoom:1.135,warp:.01605,ob_size:.005,mv_x:64,mv_y:48,mv_l:1,mv_b:.9,mv_a:0},Ra=[{baseVals:{enabled:1,sides:16,thickoutline:1,textured:1,y:1.8,rad:.32544,ang:.1884,tex_ang:.62832,tex_zoom:.77829,g:1,b:1,a:.9,r2:1,b2:1,a2:.5,border_r:.59,border_g:.81,border_b:.69,border_a:0},init_eqs_str:``,frame_eqs_str:``},{baseVals:{enabled:1,sides:3,thickoutline:1,num_inst:2,rad:1.25237,tex_ang:.25133,tex_zoom:1.136,r:.36,g2:0,b2:.2,border_r:0,border_g:0,border_b:.99,border_a:0},init_eqs_str:`a.q28=0;a.q29=0;a.q32=0;a.q30=0;a.q31=0;`,frame_eqs_str:`a.r=.05*Math.floor(randint(10))+.5;a.g=a.r;a.b=a.r;a.x=a.q28;a.y=a.q29;a.rad=a.q32;a.ang=.00001<Math.abs(equal(a.instance,0))?a.q30:a.q31;`},{baseVals:{enabled:1,sides:3,thickoutline:1,num_inst:2,rad:1.25237,tex_ang:.25133,tex_zoom:1.136,r:.36,g2:0,b2:.2,border_r:0,border_g:0,border_b:.99,border_a:0},init_eqs_str:`a.q23=0;a.q24=0;a.q27=0;a.q25=0;a.q26=0;`,frame_eqs_str:`a.r=.05*Math.floor(randint(10))+.5;a.g=a.r;a.b=a.r;a.x=a.q23;a.y=a.q24;a.rad=a.q27;a.ang=.00001<Math.abs(equal(a.instance,0))?a.q25:a.q26;`},{baseVals:{enabled:1,sides:100,rad:.0369,tex_zoom:.18423,g:1,b:1,r2:1,b2:.9,a2:.1,border_a:0},init_eqs_str:``,frame_eqs_str:`a.rad=.04+.005*a.bass_att;`}],za=[{baseVals:{enabled:0}},{baseVals:{enabled:1,samples:42,usedots:1,thick:1,additive:1,scaling:81.95444,smoothing:1,g:.4,b:0},init_eqs_str:`a.wave_x=0;`,frame_eqs_str:`a.wave_x=1;`,point_eqs_str:`a.x=.001*Math.floor(randint(1E3));a.y=.001*Math.floor(randint(1E3));a.r=.9;a.g=1;a.b=1;`},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],Ba=`a.q25=0;a.q29=0;a.q31=0;a.q23=0;a.q24=0;a.q26=0;a.q27=0;a.q32=0;a.q28=0;a.q30=0;`,Va=`a.zoom=.935*a.zoom+.04*(.6*Math.sin(.339*a.bass_att)+.1*Math.sin(.276*a.bass_att));a.rot+=.04*(.6*Math.sin(.381*a.time)+.4*Math.sin(.579*a.time));a.cx+=.003*(.6*Math.sin(.471*a.treb_att)+.4*Math.sin(.297*a.treb_att));a.cy+=.003*(.6*Math.sin(.379*a.mid_att)+.4*Math.sin(.351*a.mid_att));a.dx+=.003*(.6*Math.sin(.234*a.time)+.4*Math.sin(.277*a.time));a.rot+=.02*(Math.sin(2.134*a.time)+Math.sin(1.7134*a.time)+Math.sin(2.834*a.time));a.dx+=.01*(Math.sin(1.134*a.time)+Math.sin(.7134*
a.time)+Math.sin(2.334*a.time));a.dy+=.01*(Math.sin(1.8834*a.time)+Math.sin(1.0144*a.time)+Math.sin(1.334*a.time));a.q23=div(Math.floor(randint(1E3)),1E3);a.q24=div(Math.floor(randint(1E3)),1E3);a.q25=6.28*div(Math.floor(randint(1E3)),1E3);a.q26=a.q25-3.14;a.q27=div(Math.floor(randint(1E3)),12E3)+.1;a.q28=div(Math.floor(randint(1E3)),1E3);a.q29=div(Math.floor(randint(1E3)),1E3);a.q30=6.28*div(Math.floor(randint(1E3)),1E3);a.q31=a.q30-3.14;a.q32=div(Math.floor(randint(1E3)),14E3)+.1;`,Ha=` shader_body { 
  vec4 tmpvar_1;
  tmpvar_1.w = 1.0;
  tmpvar_1.xyz = (texture (sampler_main, uv).xyz * 0.98);
  ret = tmpvar_1.xyz;
 }`,Ua=` shader_body { 
  vec2 uv_1;
  vec3 ret_2;
  uv_1 = (0.05 + (0.9 * uv));
  ret_2 = ((texture (sampler_blur1, uv_1).xyz * scale1) + bias1);
  vec2 x_3;
  x_3 = (3.0 * ret_2.yx);
  uv_1 = (uv_1 + ((
    (-0.05 * (sign(x_3) * (1.570796 - (
      sqrt((1.0 - abs(x_3)))
     * 
      (1.570796 + (abs(x_3) * (-0.2146018 + (
        abs(x_3)
       * 
        (0.08656672 + (abs(x_3) * -0.03102955))
      ))))
    ))))
   + 
    (0.05 * cos((2.0 * ret_2.zz)))
  ) - 0.025));
  ret_2 = (texture (sampler_main, uv_1).xyz + ((texture (sampler_blur1, uv_1).xyz * scale1) + bias1));
  vec3 tmpvar_4;
  tmpvar_4 = clamp (ret_2, 0.0, 1.0);
  ret_2 = (tmpvar_4 * tmpvar_4);
  vec4 tmpvar_5;
  tmpvar_5.w = 1.0;
  tmpvar_5.xyz = ret_2;
  ret = tmpvar_5.xyz;
 }`,Wa={baseVals:La,shapes:Ra,waves:za,init_eqs_str:Ba,frame_eqs_str:Va,pixel_eqs_str:``,pixel_eqs:``,warp:Ha,comp:Ua},Ga={rating:0,decay:.88,echo_zoom:1.007,echo_alpha:.5,echo_orient:3,wave_dots:1,wave_thick:1,wrap:0,darken:1,wave_a:100,wave_scale:.59,wave_smoothing:0,wave_mystery:.7,zoomexp:.42,fshader:1,warp:.01,ob_a:1,mv_x:64,mv_y:48,mv_l:5,mv_r:0,mv_g:0,mv_b:0,mv_a:0},Ka=[{baseVals:{enabled:1,sides:100,rad:71.13834,r:.5,g:.5,b:.5,a:.02,r2:.5,g2:.5,b2:.5,a2:.02,border_a:0},init_eqs_str:``,frame_eqs_str:``},{baseVals:{enabled:0}},{baseVals:{enabled:1,sides:100,rad:.0303,r:.8,g:.8,b:.8,a:.6,r2:.7,g2:.7,b2:.7,border_a:0},init_eqs_str:``,frame_eqs_str:``},{baseVals:{enabled:0}}],qa=[{baseVals:{enabled:0}},{baseVals:{enabled:1,samples:462,usedots:1,thick:1,additive:1,smoothing:0,a:.8},init_eqs_str:`a.amplitude=0;a.turns=0;a.centerx=0;a.centery=0;a.size=0;a.speed=0;`,frame_eqs_str:`a.r=.5+.4*Math.sin(.5*(1.13*a.time+a.bass));a.g=.5+.4*Math.cos(.5*(1.23*a.time+a.treb));a.b=.5+.4*Math.sin(.5*(1.33*a.time+a.mid));`,point_eqs_str:`a.amplitude=.075+.025*a.bass_att;a.turns=7;a.centerx=.5+.015*Math.sin(a.time)+.015*Math.cos(3.28+.01*a.time);a.centery=.5+.015*Math.cos(a.time)+.015*Math.sin(3.14+.01*a.time);a.size=.28;a.speed=1.25;a.x=a.centerx+(a.size-a.size*a.sample)*Math.sin(3.14*a.speed*a.time+6.28*a.sample*a.turns)*(1+a.amplitude*(a.value1+a.value2));a.y=a.centery+(a.size-a.size*a.sample)*Math.cos(3.14*a.speed*a.time+6.28*a.sample*a.turns)*(1+a.amplitude*(a.value1+a.value2));`},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],Ja=`a.zoom=1+.025*Math.max(a.bass_att,a.treb_att);`,Ya=` shader_body { 
  vec4 lums2_1;
  vec4 lums_2;
  vec3 tmpvar_3;
  tmpvar_3.z = 0.0;
  tmpvar_3.xy = texsize.zw;
  vec3 tmpvar_4;
  tmpvar_4 = (tmpvar_3 * 8.0);
  lums_2.x = dot (texture (sampler_main, (uv + (texsize.zw * tmpvar_4.xz))).xyz, vec3(0.32, 0.49, 0.29));
  lums_2.y = dot (texture (sampler_main, (uv - (texsize.zw * tmpvar_4.xz))).xyz, vec3(0.32, 0.49, 0.29));
  lums_2.z = dot (texture (sampler_main, (uv + (texsize.zw * tmpvar_4.zy))).xyz, vec3(0.32, 0.49, 0.29));
  lums_2.w = dot (texture (sampler_main, (uv - (texsize.zw * tmpvar_4.zy))).xyz, vec3(0.32, 0.49, 0.29));
  vec2 tmpvar_5;
  tmpvar_5.x = (lums_2.x - lums_2.y);
  tmpvar_5.y = (lums_2.z - lums_2.w);
  vec2 tmpvar_6;
  tmpvar_6 = ((0.5 - uv) + 0.5);
  lums2_1.x = dot (texture (sampler_main, (tmpvar_6 + (texsize.zw * tmpvar_4.xz))).xyz, vec3(0.32, 0.49, 0.29));
  lums2_1.y = dot (texture (sampler_main, (tmpvar_6 - (texsize.zw * tmpvar_4.xz))).xyz, vec3(0.32, 0.49, 0.29));
  lums2_1.z = dot (texture (sampler_main, (tmpvar_6 + (texsize.zw * tmpvar_4.zy))).xyz, vec3(0.32, 0.49, 0.29));
  lums2_1.w = dot (texture (sampler_main, (tmpvar_6 - (texsize.zw * tmpvar_4.zy))).xyz, vec3(0.32, 0.49, 0.29));
  vec2 tmpvar_7;
  tmpvar_7.x = (lums2_1.x - lums2_1.y);
  tmpvar_7.y = (lums2_1.z - lums2_1.w);
  vec4 tmpvar_8;
  tmpvar_8.w = 1.0;
  tmpvar_8.xyz = (mix (texture (sampler_fc_main, (uv + 
    ((((
      clamp ((((
        (4000.0 * tmpvar_5)
       / 8.0) * 0.5) + 0.5), 0.0, 1.0)
     * 2.0) - 1.0) * 1.4) * texsize.zw)
  )).xyz, texture (sampler_fc_main, (tmpvar_6 + 
    ((((
      clamp ((((
        (4000.0 * tmpvar_7)
       / 8.0) * 0.5) + 0.5), 0.0, 1.0)
     * 2.0) - 1.0) * 1.4) * texsize.zw)
  )).xyz, vec3(0.5, 0.5, 0.5)) * 0.93);
  ret = tmpvar_8.xyz;
 }`,Xa=` shader_body { 
  vec2 uv1_1;
  vec3 tmpvar_2;
  tmpvar_2 = texture (sampler_main, uv).xyz;
  vec2 tmpvar_3;
  tmpvar_3.y = 0.0;
  tmpvar_3.x = texsize.z;
  vec2 tmpvar_4;
  tmpvar_4.x = 0.0;
  tmpvar_4.y = texsize.w;
  vec2 tmpvar_5;
  tmpvar_5.x = (texture (sampler_main, (uv - tmpvar_3)).xyz - texture (sampler_main, (uv + tmpvar_3)).xyz).x;
  tmpvar_5.y = (texture (sampler_main, (uv - tmpvar_4)).xyz - texture (sampler_main, (uv + tmpvar_4)).xyz).x;
  uv1_1 = ((0.3 * cos(
    (((uv - 0.5) * 2.0) + 1.7)
  )) - (2.0 * tmpvar_5));
  vec4 tmpvar_6;
  tmpvar_6.w = 1.0;
  tmpvar_6.xyz = ((-(tmpvar_2) / 4.0) + ((6.0 * vec3(
    clamp ((0.03 / sqrt(dot (uv1_1, uv1_1))), 0.0, 1.0)
  )) * (-0.08 + tmpvar_2)));
  ret = tmpvar_6.xyz;
 }`,Za={baseVals:Ga,shapes:Ka,waves:qa,init_eqs_str:``,frame_eqs_str:Ja,pixel_eqs_str:``,pixel_eqs:``,warp:Ya,comp:Xa},Qa={rating:4,gammaadj:2.7,decay:.99,echo_zoom:1.216,echo_alpha:.8,invert:1,wave_a:.001,dx:1e-5,dy:1e-5,warp:.01,ob_size:.005,ob_g:1,ob_a:1,ib_size:.1,ib_r:1,ib_g:0,ib_b:0,ib_a:.1,mv_a:0},$a=[{baseVals:{enabled:1,thickoutline:1,num_inst:13,r:0,b:1,a:.6,g2:0,b2:.5,a2:.5,border_a:.6},init_eqs_str:`a.q1=0;a.q2=0;`,frame_eqs_str:`a.x=a.q1+Math.floor(randint(15))*a.bass_att*.02;a.y=a.q2+Math.floor(randint(15))*a.mid_att*.02;a.rad=.076+.004*Math.floor(randint(11));a.b=.35+.2*Math.sin(.73*a.time)+.001*Math.floor(randint(100));a.b2=.35+.2*Math.sin(.73*a.time)+.001*Math.floor(randint(100));a.g=.55+.125*Math.sin(.43*a.time)+.001*Math.floor(randint(100));a.g2=.55+.125*Math.sin(.43*a.time)+.001*Math.floor(randint(100));`},{baseVals:{enabled:1,thickoutline:1,num_inst:14,rad:.0999,r:0,a:.6,g2:0,a2:.5,border_a:.6},init_eqs_str:`a.q2=0;a.q1=0;`,frame_eqs_str:`a.x=a.q2+Math.floor(randint(15))*a.mid_att*.02;a.y=1-a.q1+Math.floor(randint(15))*a.treb_att*.02;a.rad=.076+.004*Math.floor(randint(11));a.r=.4+.2*Math.sin(.53*a.time)+.001*Math.floor(randint(100));a.r2=.4+.2*Math.sin(.53*a.time)+.001*Math.floor(randint(100));a.b=.55+.12*Math.sin(.63*a.time)+.001*Math.floor(randint(100));a.b2=.55+.12*Math.sin(.63*a.time)+.001*Math.floor(randint(100));`},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],eo=[{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}},{baseVals:{enabled:0}}],to=`a.wave_r-=.4*a.bass;a.wave_b-=.4*a.treb;a.wave_g-=.4*a.mid;a.mv_l+=.2*a.bass;a.mv_r+=.7*a.wave_r;a.mv_b+=.7*a.wave_b;a.mv_g+=.7*a.wave_g;a.rot+=.8*a.bass*Math.min(.07*sqr(div(a.zoom,a.treb_att)),.07*sqr(div(a.zoom,a.bass_att)));`,no=`a.zoom=a.zoom+.019+.3*Math.min((.55-a.rad)*Math.max(a.bass_att,a.bass),.3*(.55-a.rad)*Math.sin(a.bass));`,ro=` shader_body { 
  vec3 ret_1;
  ret_1 = (texture (sampler_main, uv).xyz + ((
    (texture (sampler_noise_lq, (((uv_orig * texsize.xy) * texsize_noise_lq.zw) + rand_frame.xy)).xyz - 0.5)
   / 256.0) * 3.0));
  vec3 tmpvar_2;
  tmpvar_2 = fract((ret_1 - 0.005));
  ret_1 = tmpvar_2;
  vec4 tmpvar_3;
  tmpvar_3.w = 1.0;
  tmpvar_3.xyz = tmpvar_2;
  ret = tmpvar_3.xyz;
 }`,io=` shader_body { 
  vec3 tmpvar_1;
  tmpvar_1 = texture (sampler_main, uv).xxx;
  vec4 tmpvar_2;
  tmpvar_2.w = 1.0;
  tmpvar_2.xyz = ((pow (
    mix (vec3((((texture (sampler_blur1, uv).xyz * scale1) + bias1).x + ((texture (sampler_blur3, uv).xyz * scale3) + bias3).x)), tmpvar_1, pow (tmpvar_1, vec3(0.5, 0.5, 0.5)))
  , vec3(0.5, 1.2, 8.0)) * 1.25) - 0.25);
  ret = tmpvar_2.xyz;
 }`,ao={baseVals:Qa,shapes:$a,waves:eo,init_eqs_str:``,frame_eqs_str:to,pixel_eqs_str:no,warp:ro,comp:io},oo={"Eo.S. - nematodes E daemon":o,"Eo.S. + Phat - chasers 11 sentinel C_poltergeist_mix response daemon":p,"flexi - 3d mosaic glass test - mash0000 - 9d tuscan slop ram":b,"flexi - alien canvas":k,"flexi - black holes [sucking fractals for breakfast]":L,"Flexi - dawn has broken":G,"Flexi - gold plated maelstrom of chaos":ne,"flexi - moebius transformation [random texture mix]":ue,"Flexi - multiverse":ve,"Flexi - oldschool tree":we,"flexi - what to do with the inside of a torus [easily customizable moebius spiral template]":Me,"Flexi - when monopolies were the future [simple warp + non-reactive moebius]":Be,"flexi + cope - i blew you a soap bubble now what - feel the projection you are, connected to it all nz+":Je,"flexi + stahlregen - a car crash you can′t defocus_2":nt,"Geiss - Artifact Plasma":ut,"Geiss - Chromatexture Paint-In 2":vt,"Geiss - Chrome":Et,"Geiss - Motion Blur 2 (Relief Mix)":Nt,"geiss + martin - mandelbox explorer - high speed demo version (fire mix)":Ht,"martin - blue mountains":Zt,"martin - golden mirror":on,"martin - hardcore mix 1":hn,"martin - invasion":wn,"martin - jellyfish dance":Nn,"martin - mandelbulb slideshow":Hn,"martin - moonlight splash":Zn,"martin - night in the forest":ar,"martin - on silent paths":mr,"martin - orbit trap playground":xr,"martin - pendulum in brass ps3":kr,"Martin - QBikal - Surface Turbulence":Rr,"Martin - QBikal - Surface Turbulence II":qr,"martin - rogue wave -ps3":ni,"martin - royal waterfall":ui,"martin - silversmith":yi,"martin - stormy sea":Oi,"martin - the Dome ps3":Ii,"martin - this beautiful planet":Wi,"martin - tiling the tube":Qi,"martin - timeless":sa,"martin + stahlregen - martin in da mash 11":ha,"shifter - glassworms flare":xa,"shifter - liquid circuitry":ka,"shifter + Eo.S + Phat - Blob":Ia,"Stahlregen & bdrv + fiSHbRAiN + flexi + Geiss + shifter - Starcraft (Distorted)":Wa,"Stahlregen + Geiss + Martin - Ouboros (Metal Finish 2)":Za,"suksma - sick star bloat":ao}}}})})();