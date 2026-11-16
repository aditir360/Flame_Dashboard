/* Oxygen Runway deep-space background. Add <script src="space-bg.js"></script> before </body>. */
(function(){
"use strict";
if(document.getElementById("space-bg"))return;
var RM=matchMedia("(prefers-reduced-motion: reduce)").matches;
var css=document.createElement("style");
css.textContent="body{background:#04050d!important}body::after{display:none!important}#sky{display:none!important}#space-bg{position:fixed;left:0;top:0;width:100%;height:100%;z-index:0;pointer-events:none}";
document.head.appendChild(css);
var cv=document.createElement("canvas");cv.id="space-bg";cv.setAttribute("aria-hidden","true");document.body.insertBefore(cv,document.body.firstChild);
var g=cv.getContext("2d"),dpr=Math.min(window.devicePixelRatio||1,1.25),W,H,PAD=48,layer,stars=[],comets=[],mx=0,my=0,nextC=0;
function rng(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function gauss(R){return(R()+R()+R()+R()-2)/2}
function rgba(c,a){return"rgba("+c[0]+","+c[1]+","+c[2]+","+a+")"}

function build(){
 var w=W+PAD*2,h=H+PAD*2,m=Math.max(w,h),R=rng(11);
 layer=document.createElement("canvas");layer.width=Math.round(w*dpr);layer.height=Math.round(h*dpr);
 var x=layer.getContext("2d");x.scale(dpr,dpr);
 var bg=x.createLinearGradient(0,0,w*.4,h);bg.addColorStop(0,"#04050d");bg.addColorStop(.5,"#070719");bg.addColorStop(1,"#0b0622");x.fillStyle=bg;x.fillRect(0,0,w,h);
 /* nebula clouds */
 x.globalCompositeOperation="lighter";
 function cloud(cx,cy,s,c,a){for(var i=0;i<6;i++){var ox=(R()-.5)*s*.9,oy=(R()-.5)*s*.55,r=s*(.32+R()*.45),gr=x.createRadialGradient(cx+ox,cy+oy,0,cx+ox,cy+oy,r);
  gr.addColorStop(0,rgba(c,a));gr.addColorStop(.45,rgba(c,a*.42));gr.addColorStop(1,rgba(c,0));x.fillStyle=gr;x.fillRect(cx+ox-r,cy+oy-r,r*2,r*2)}}
 cloud(w*.16,h*.78,m*.52,[255,80,170],.1);cloud(w*.78,h*.22,m*.46,[30,225,185],.11);cloud(w*.5,h*.58,m*.4,[40,160,255],.1);
 cloud(w*.93,h*.06,m*.3,[255,110,170],.085);cloud(w*.08,h*.14,m*.34,[40,230,200],.08);cloud(w*.62,h*.92,m*.3,[140,90,255],.085);cloud(w*.36,h*.3,m*.26,[60,200,255],.06);
 /* milky way band */
 x.save();x.translate(w*.5,h*.46);x.rotate(-.42);var bh=m*.3;
 [[1,.1,[150,230,255]],[.55,.07,[255,225,200]],[.28,.05,[255,240,225]]].forEach(function(b){var gr=x.createLinearGradient(0,-bh*b[0]/2,0,bh*b[0]/2);gr.addColorStop(0,rgba(b[2],0));gr.addColorStop(.5,rgba(b[2],b[1]));gr.addColorStop(1,rgba(b[2],0));x.fillStyle=gr;x.fillRect(-m,-bh*b[0]/2,m*2,bh*b[0])});
 for(var i=0;i<1100;i++){var u=(R()-.5)*m*1.5,v=gauss(R)*bh*.34,a=.08+R()*.5,s=R()<.04?1.6:.7+R()*.5;x.fillStyle="rgba("+(200+R()*55|0)+","+(200+R()*55|0)+",255,"+a+")";x.fillRect(u,v,s,s)}
 x.globalCompositeOperation="source-over";
 for(var j=0;j<9;j++){var dx=(R()-.5)*m*1.1,dy=(R()-.5)*bh*.28,dr=m*(.04+R()*.07),dg=x.createRadialGradient(dx,dy,0,dx,dy,dr);dg.addColorStop(0,"rgba(3,4,12,.34)");dg.addColorStop(1,"rgba(3,4,12,0)");x.fillStyle=dg;x.fillRect(dx-dr,dy-dr,dr*2,dr*2)}
 x.restore();
 /* grain */
 for(var n=0;n<5000;n++){x.fillStyle="rgba(255,255,255,"+(R()*.035)+")";x.fillRect(R()*w,R()*h,1,1)}
}
var TINT=[[255,255,255],[255,255,255],[190,215,255],[170,200,255],[255,232,205],[215,195,255],[255,190,225],[170,255,235]];
function mkStars(){
 var R=rng(23),N=Math.round(W*H/4300),cfg=[[.55,.3,.75,.22,.55,.02,.02,6],[.33,.5,1.05,.4,.8,.05,.07,14],[.12,.8,1.7,.6,1,.1,.14,28]];stars=[];
 cfg.forEach(function(c,li){var n=Math.round(N*c[0]);for(var i=0;i<n;i++){var t=TINT[R()*TINT.length|0];
  stars.push({x:R()*W,y:R()*H,r:c[1]+R()*(c[2]-c[1]),a:c[3]+R()*(c[4]-c[3]),f:c[5],d:c[6],mp:c[7],ph:R()*6.283,sp:.6+R()*2.2,c:"rgba("+t[0]+","+t[1]+","+t[2]+",",big:li==2&&R()<.16,L:li})}})}
function size(){W=innerWidth;H=innerHeight;cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);g.setTransform(dpr,0,0,dpr,0,0);build();mkStars();if(RM)frame(0,true)}
addEventListener("resize",function(){clearTimeout(size.t);size.t=setTimeout(size,160)});
addEventListener("pointermove",function(e){mx=e.clientX/W-.5;my=e.clientY/H-.5},{passive:true});
var glow=(function(){var s=document.createElement("canvas");s.width=s.height=64;var x=s.getContext("2d"),gr=x.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,"rgba(255,255,255,.9)");gr.addColorStop(.2,"rgba(200,220,255,.35)");gr.addColorStop(1,"rgba(200,220,255,0)");x.fillStyle=gr;x.fillRect(0,0,64,64);return s})();
function comet(){var a=2.55+Math.random()*.25,sp=7+Math.random()*5;comets.push({x:W*(.35+Math.random()*.7),y:-30,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp*-1*-1,l:0,len:190+Math.random()*140})}
var last=0;
function frame(t,once){
 if(!once)requestAnimationFrame(frame);if(document.hidden&&!once)return;
 var sy=window.scrollY||0,warp=0;try{warp=typeof boost!=="undefined"?boost:0}catch(e){}
 g.clearRect(0,0,W,H);
 var lx=-PAD-mx*16,ly=-PAD-my*12-Math.min(PAD,sy*.02);
 g.globalAlpha=1;g.drawImage(layer,lx,ly,W+PAD*2,H+PAD*2);
 g.globalCompositeOperation="lighter";
 for(var i=0;i<stars.length;i++){var s=stars[i];
  if(!RM){s.x-=s.d*(1+warp*.8);if(s.x<-4)s.x+=W+8}
  var px=s.x-mx*s.mp,py=((s.y-sy*s.f-my*s.mp)%H+H)%H,a=s.a*(RM?1:.62+.38*Math.sin(t/1000*s.sp+s.ph));
  g.fillStyle=s.c+a+")";
  if(warp>1.2&&s.L>0)g.fillRect(px,py,s.r*warp*2.6,s.r);else g.fillRect(px,py,s.r*1.5,s.r*1.5);
  if(s.big){g.globalAlpha=a*.9;g.drawImage(glow,px-12,py-12,24,24);g.globalAlpha=a*.35;g.fillRect(px-9,py+.3,18,.6);g.fillRect(px+.3,py-9,.6,18);g.globalAlpha=1}}
 if(!RM){
  if(t>nextC&&comets.length<2){comet();nextC=t+7000+Math.random()*9000}
  for(var j=comets.length-1;j>=0;j--){var c=comets[j];c.x+=c.vx;c.y+=Math.abs(c.vy);c.l++;
   if(c.y>H+60||c.x<-300){comets.splice(j,1);continue}
   var m=Math.hypot(c.vx,c.vy),ux=c.vx/m,uy=Math.abs(c.vy)/m,gr=g.createLinearGradient(c.x,c.y,c.x-ux*c.len,c.y-uy*c.len);
   gr.addColorStop(0,"rgba(190,230,255,.75)");gr.addColorStop(.4,"rgba(110,170,255,.22)");gr.addColorStop(1,"rgba(110,170,255,0)");
   g.strokeStyle=gr;g.lineWidth=2;g.lineCap="round";g.beginPath();g.moveTo(c.x,c.y);g.lineTo(c.x-ux*c.len,c.y-uy*c.len);g.stroke();
   g.globalAlpha=.9;g.drawImage(glow,c.x-16,c.y-16,32,32);g.globalAlpha=1}}
 g.globalCompositeOperation="source-over"}
size();if(!RM){nextC=2500;requestAnimationFrame(frame)}
})();
