
(function(){
 const RM=matchMedia("(prefers-reduced-motion: reduce)").matches,H=190,E=108;
 const cv=document.createElement("canvas");cv.id="fireedge";cv.setAttribute("aria-hidden","true");
 cv.style.cssText="position:absolute;top:0;left:0;width:100%;height:"+H+"px;z-index:15;pointer-events:none;display:block";
 const pr=document.createElement("style");pr.textContent="@media print{#fireedge{display:none}}";document.head.appendChild(pr);
 const gl=cv.getContext("webgl",{premultipliedAlpha:true,alpha:true,antialias:false});
 if(!gl)return;
 document.body.prepend(cv);
 const VS="attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";
 const FS=`precision highp float;
 uniform vec2 res;uniform float t,k,E,dp,fo;
 float hs(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float nz(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hs(i),hs(i+vec2(1.,0.)),f.x),mix(hs(i+vec2(0.,1.)),hs(i+vec2(1.,1.)),f.x),f.y);}
 float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*nz(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
 vec3 fcol(float x){
  vec3 c=mix(vec3(.3,.03,0.),vec3(1.,.38,.04),smoothstep(0.,.45,x));
  c=mix(c,vec3(1.,.8,.25),smoothstep(.45,.95,x));
  c=mix(c,vec3(1.,.97,.8),smoothstep(.95,1.6,x));
  return c*smoothstep(0.,.1,x);}
 void main(){
  float px=gl_FragCoord.x/dp,py=(res.y-gl_FragCoord.y)/dp;
  float n=fbm(vec2(px/170.,t*.05));
  float n3=fbm(vec2(px/22.,py/22.));
  float b=(E-py)+(n-.5)*46.+(n3-.5)*7.;
  vec3 paper=vec3(.62,.46,.27)*(.5+.7*fbm(vec2(px/9.,py/9.)));
  paper=mix(paper,vec3(.035,.016,.006),smoothstep(34.,2.,b));
  float ember=smoothstep(7.,0.,b)*(.45+.9*n3);
  paper+=vec3(1.,.32,.05)*ember;
  float cov=smoothstep(-1.,1.5,b)*.95;
  float n2=fbm(vec2(px/16.,py/30.-t*1.9)+n*3.);
  float ext=(14.+58.*n2*n2*2.2*(.55+.9*fbm(vec2(px/55.,t*.35))))*fo;
  float f0=1.5*(.6+.7*n2);
  float hv=b>=0.?pow(clamp(1.-b/ext,0.,1.),1.5)*f0:f0*exp(b/7.);
  hv+=exp(-abs(b)/2.4)*(.6+.9*n3)*.8;
  float fa=clamp(hv*1.1,0.,1.);
  vec3 rgb=fcol(hv)*fa+paper*cov*(1.-fa);
  float a=fa+cov*(1.-fa);
  vec2 sp=vec2(px/18.,py/16.+t*1.1);vec2 ci=floor(sp),cf=fract(sp)-.5;float hh=hs(ci);
  float on=step(.965,hh)*step(0.,b)*smoothstep(95.,10.,b);
  float spk=on*smoothstep(.13,0.,length(cf-vec2(sin(t*2.+hh*40.)*.25,0.)));
  rgb+=vec3(1.,.72,.3)*spk;a=max(a,spk);
  gl_FragColor=vec4(min(rgb,vec3(a)),a)*k;}`;
 const sh=(ty,s)=>{const x=gl.createShader(ty);gl.shaderSource(x,s);gl.compileShader(x);return x};
 const pg=gl.createProgram();gl.attachShader(pg,sh(gl.VERTEX_SHADER,VS));gl.attachShader(pg,sh(gl.FRAGMENT_SHADER,FS));gl.linkProgram(pg);
 if(!gl.getProgramParameter(pg,gl.LINK_STATUS)){cv.remove();return}
 gl.useProgram(pg);gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
 const al=gl.getAttribLocation(pg,"a");gl.enableVertexAttribArray(al);gl.vertexAttribPointer(al,2,gl.FLOAT,false,0,0);
 const U=n=>gl.getUniformLocation(pg,n),uR=U("res"),uT=U("t"),uK=U("k"),uE=U("E"),uD=U("dp"),uF=U("fo");
 gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
 let dp=1;function size(){dp=Math.min(devicePixelRatio||1,1);cv.width=Math.round(innerWidth*dp);cv.height=Math.round(H*dp);gl.viewport(0,0,cv.width,cv.height)}
 size();addEventListener("resize",size);

 let vis=true,raf=null,on0=null,fo=1;const t0=performance.now();
 const target=()=>{const c=typeof st!=="undefined"&&st.cab!=null?st.cab:20.9;return .6+.9*Math.min(1,Math.max(0,(c-12)/22))}; /* bigger flames at richer oxygen */
 function draw(now,ts,k){
  gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
  gl.uniform2f(uR,cv.width,cv.height);gl.uniform1f(uT,ts);gl.uniform1f(uK,k);gl.uniform1f(uE,E);gl.uniform1f(uD,dp);gl.uniform1f(uF,fo);
  gl.drawArrays(gl.TRIANGLE_STRIP,0,4)}
 function frame(now){
  raf=null;if(!vis)return;
  if(!document.getElementById("burn")){if(on0==null)on0=now}else on0=null;     /* wait until the paper intro has burned away */
  const k=on0==null?0:Math.min(1,(now-on0)/2800),ek=k*k*(3-2*k);
  fo+=(target()-fo)*.06;
  draw(now,(now-t0)/1000,ek);
  raf=requestAnimationFrame(frame)}
 if(RM){fo=target();const go=()=>{if(document.getElementById("burn"))return setTimeout(go,300);draw(0,3,1)};go();addEventListener("resize",()=>draw(0,3,1));return}
 if("IntersectionObserver"in window)new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis&&!raf)raf=requestAnimationFrame(frame)}).observe(cv);
 raf=requestAnimationFrame(frame);
})();
