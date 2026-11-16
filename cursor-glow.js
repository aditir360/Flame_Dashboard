/* Oxygen Runway cursor glow: a microgravity flame that follows the pointer.
   Replace <script src="fire-cursor.js"></script> with <script src="cursor-glow.js"></script> */
(function(){
"use strict";
if(matchMedia("(pointer:coarse)").matches||matchMedia("(prefers-reduced-motion: reduce)").matches)return;
if(document.getElementById("cursor-glow"))return;
var CFG={ice:[140,229,255],ember:[255,135,92],core:[255,236,200],size:1,follow:.2};
var css=document.createElement("style");
css.textContent="body::after{display:none!important}#cursor-glow{position:fixed;left:0;top:0;width:100%;height:100%;z-index:1002;pointer-events:none;mix-blend-mode:screen}";
document.head.appendChild(css);
var cv=document.createElement("canvas");cv.id="cursor-glow";cv.setAttribute("aria-hidden","true");document.body.appendChild(cv);
var g=cv.getContext("2d"),dpr=Math.min(window.devicePixelRatio||1,1.5),W=0,H=0;
function size(){W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;g.setTransform(dpr,0,0,dpr,0,0)}
size();addEventListener("resize",size);
function sprite(c,r,hard){var s=document.createElement("canvas");s.width=s.height=r*2;var x=s.getContext("2d"),gr=x.createRadialGradient(r,r,0,r,r,r),k=c[0]+","+c[1]+","+c[2];
 gr.addColorStop(0,"rgba("+k+",1)");gr.addColorStop(hard?.25:.18,"rgba("+k+","+(hard?.7:.45)+")");gr.addColorStop(.55,"rgba("+k+",.12)");gr.addColorStop(1,"rgba("+k+",0)");x.fillStyle=gr;x.fillRect(0,0,r*2,r*2);return s}
var S={ice:sprite(CFG.ice,128),ember:sprite(CFG.ember,128),core:sprite(CFG.core,128,true)};
var tx=-999,ty=-999,x=-999,y=-999,px=x,py=y,speed=0,hot=0,hotT=0,press=0,vis=0,visT=0,seen=false,P=[],rings=[];
var HOT="a,button,select,input,textarea,label,.dot,.dd,.hc.f,tr.r,.tc,.pill,.chip,[role=button],[role=slider],#dl";
addEventListener("pointermove",function(e){if(e.pointerType==="touch")return;tx=e.clientX;ty=e.clientY;visT=1;
 if(!seen){x=px=tx;y=py=ty;seen=true}
 hotT=e.target&&e.target.closest&&e.target.closest(HOT)?1:0},{passive:true});
document.addEventListener("mouseleave",function(){visT=0});
document.addEventListener("mouseenter",function(){visT=1});
addEventListener("blur",function(){visT=0});
addEventListener("pointerdown",function(e){if(e.pointerType==="touch")return;press=1;rings.push({x:e.clientX,y:e.clientY,r:8,l:1});
 for(var i=0;i<14;i++){var a=Math.random()*6.283,v=1+Math.random()*2.4;P.push({x:e.clientX,y:e.clientY,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:1,d:.018+Math.random()*.02,s:Math.random()<.7?S.ember:S.ice,r:10+Math.random()*10})}});
function spawn(n){for(var i=0;i<n;i++){var a=Math.random()*6.283,v=.15+Math.random()*.7;
 P.push({x:x+(Math.random()-.5)*10,y:y+(Math.random()-.5)*10,vx:Math.cos(a)*v+(px-x)*.04,vy:Math.sin(a)*v+(py-y)*.04,l:1,d:.012+Math.random()*.018,s:Math.random()<.65?S.ember:S.ice,r:8+Math.random()*10})}}
function img(s,cx,cy,r,a){if(a<=.003||r<1)return;g.globalAlpha=Math.min(1,a);g.drawImage(s,cx-r,cy-r,r*2,r*2)}
function frame(t){
 requestAnimationFrame(frame);if(document.hidden)return;
 g.globalCompositeOperation="source-over";g.globalAlpha=1;g.clearRect(0,0,W,H);
 vis+=(visT-vis)*.12;if(vis<.01&&!P.length&&!rings.length)return;
 px=x;py=y;x+=(tx-x)*CFG.follow;y+=(ty-y)*CFG.follow;
 var d=Math.hypot(x-px,y-py);speed+=(d-speed)*.15;hot+=(hotT-hot)*.14;press*=.9;
 var fl=1+.05*Math.sin(t/90)+.03*Math.sin(t/41),k=CFG.size,sp=Math.min(speed,40);
 if(vis>.05){spawn(sp>1.2?Math.min(3,1+(sp/9|0)):(Math.random()<.06?1:0))}
 g.globalCompositeOperation="lighter";
 img(S.ice,x,y,(105+hot*55+sp*1.6)*k*fl,(.2+hot*.12)*vis);
 img(S.ember,x,y,(62+hot*26+sp*.8)*k*fl,(.34+hot*.1)*vis);
 img(S.core,x,y,(20+hot*9+press*18)*k*fl,(.62+press*.3)*vis);
 for(var i=P.length-1;i>=0;i--){var p=P[i];p.x+=p.vx;p.y+=p.vy;p.vx*=.985;p.vy*=.985;p.l-=p.d;if(p.l<=0){P.splice(i,1);continue}
  img(p.s,p.x,p.y,p.r+(1-p.l)*26,p.l*p.l*.42)}
 if(P.length>260)P.splice(0,P.length-260);
 for(var j=rings.length-1;j>=0;j--){var q=rings[j];q.r+=(96-q.r)*.12+1.2;q.l-=.04;if(q.l<=0){rings.splice(j,1);continue}
  g.globalAlpha=q.l*.55;g.strokeStyle="rgb("+CFG.ice+")";g.lineWidth=2;g.beginPath();g.arc(q.x,q.y,q.r,0,6.283);g.stroke()}
 g.globalAlpha=1}
requestAnimationFrame(frame);
})();
