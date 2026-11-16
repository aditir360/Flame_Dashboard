
(function(){
 if(typeof T==="undefined"||!document.getElementById("briefing"))return;
 const NS="http://www.w3.org/2000/svg",DAY=864e5,CA="#6fd3ff",CB="#ffd166",g=id=>document.getElementById(id);
 const MET={oi:["Start O₂","%",1],dco:["CO rise"," ppm",0],dox:["O₂ drawdown"," pts",2],dco2:["CO₂ rise"," pts",2],fr:["Frames shot","",0]};
 const el=(n,a,p)=>{const e=document.createElementNS(NS,n);for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e};
 const med=a=>{a=a.filter(v=>v!=null&&!isNaN(v)).sort((x,y)=>x-y);if(!a.length)return null;const m=a.length>>1;return a.length%2?a[m]:(a[m-1]+a[m])/2};
 const f1=(v,d=1)=>v==null?"–":String(+v.toFixed(d));
 const fd=(ms,y)=>new Date(ms).toLocaleDateString("en-US",y?{month:"short",day:"numeric",year:"numeric"}:{month:"short",day:"numeric"});
 const sdv=a=>{a=a.filter(v=>v!=null);const m=a.reduce((s,v)=>s+v,0)/a.length;return Math.sqrt(a.reduce((s,v)=>s+(v-m)**2,0)/a.length)||1};
 const pear=(xs,ys)=>{const p=xs.map((x,i)=>[x,ys[i]]).filter(q=>q[0]!=null&&q[1]!=null);if(p.length<4)return null;const n=p.length,mx=p.reduce((s,q)=>s+q[0],0)/n,my=p.reduce((s,q)=>s+q[1],0)/n;let a=0,b=0,c=0;p.forEach(q=>{a+=(q[0]-mx)*(q[1]-my);b+=(q[0]-mx)**2;c+=(q[1]-my)**2});return b&&c?a/Math.sqrt(b*c):null};
 const RMo=matchMedia("(prefers-reduced-motion: reduce)").matches;
 let met="oi",all=false,act="A",P={A:null,B:null},upto=null,raf=null;

 /* ---------- styles + markup ---------- */
 const css=document.createElement("style");
 css.textContent=".te-tip{position:absolute;pointer-events:none;background:#07060f;border:1px solid var(--line);border-radius:10px;padding:8px 11px;font-size:13px;opacity:0;transform:translate(-50%,-120%);white-space:nowrap;z-index:3;transition:opacity .12s}.te-p{font:500 13.5px 'Hanken Grotesk',sans-serif;color:var(--tx);background:rgba(160,190,255,.055);border:1px solid rgba(160,190,255,.17);border-radius:99px;padding:7px 14px;cursor:pointer;display:inline-flex;gap:8px;align-items:center;transition:background .2s,border-color .2s,transform .15s}.te-p:hover{border-color:var(--mu)}.te-p:active{transform:scale(.96)}.te-p[aria-pressed=true]{background:var(--tx);color:#0b0a1a;border-color:var(--tx)}.te-p i{width:10px;height:10px;border-radius:50%}#te-s{touch-action:pan-y;cursor:crosshair;user-select:none}.te-c{padding:6px 22px 22px}.te-c h4{margin:18px 0 6px;font-size:15px}.te-c p,.te-c li{color:#d8d3ee;max-width:72ch}.te-c ul{margin:6px 0;padding-left:20px}.te-c td.a{color:"+CA+"}.te-c td.b{color:"+CB+"}.te-c th{position:static;cursor:default}";
 document.head.appendChild(css);
 const sec=document.createElement("div");sec.id="time-sec";
 sec.innerHTML=`<h2 id="time">When each test happened, and what changed.</h2><p class="sub">Every test on a timeline. Switch the measure, press play to watch the campaign unfold, then drag across the chart to pick two periods and compare their recorded conditions.</p>
 <div class="panel"><div class="bar"><small>Measure</small><span id="te-m" style="display:contents"></span></div>
 <div class="bar" style="padding-top:0"><button class="btn sm" id="te-play">▶ Play the campaign</button><span class="sp"></span><small>Drag on the chart to fill</small><button class="te-p" data-per="A" aria-pressed="true"><i style="background:${CA}"></i>Period A</button><button class="te-p" data-per="B" aria-pressed="false"><i style="background:${CB}"></i>Period B</button><button class="btn g sm" id="te-demo">Try: first vs last month</button><button class="btn g sm" id="te-clr">Clear</button></div>
 <div class="chartwrap" id="te-w"><svg id="te-s" viewBox="0 0 1000 360" role="img" aria-label="Timeline of BASS-II tests. Drag to select a period."></svg><div class="te-tip" id="te-t"></div></div>
 <div class="hd">Tests per month <small style="color:var(--mu);font-weight:400">Click a bar to assign that month to the active period</small></div>
 <div class="chartwrap"><svg id="te-b" viewBox="0 0 1000 170" role="img" aria-label="Tests per month, stacked by fuel group"></svg></div>
 <div class="te-c" id="te-c" style="border-top:1px solid var(--line)"></div></div>`;
 g("briefing").insertAdjacentElement("beforebegin",sec);
 const nl=document.querySelector("nav a[data-s=briefing]");if(nl){const a=document.createElement("a");a.href="#time";a.dataset.s="time";a.textContent="Time";nl.before(a)}

 /* ---------- helpers ---------- */
 const nOut=T.filter(t=>t.yr!=2014).length;
 const dom=()=>{const ts=all?T:T.filter(t=>t.yr==2014),m=ts.map(t=>+t.dt);return[Math.min(...m)-3*DAY,Math.max(...m)+3*DAY,ts]};
 const inP=p=>p?T.filter(t=>+t.dt>=p.a&&+t.dt<=p.b):[];
 const mLab=(yr,mo)=>new Date(yr,mo,1).toLocaleDateString("en-US",{month:"short"})+" ’"+String(yr).slice(2);
 function chips(){g("te-m").innerHTML=Object.keys(MET).map(k=>`<button class="te-p" data-m="${k}" aria-pressed="${k==met}">${MET[k][0]}</button>`).join("")+(nOut?`<button class="te-p" data-all="1" aria-pressed="${all}" title="These rows carry other years in the table, probably entry errors">Include ${nOut} rows dated 2016/2018</button>`:"")}
 function tip(t,c){const b=c.getBoundingClientRect(),p=g("te-w").getBoundingClientRect(),e=g("te-t");e.style.left=b.left-p.left+b.width/2+"px";e.style.top=b.top-p.top+"px";e.innerHTML=`<b>${t.id}</b> · ${FN[t.fam]} · ${fd(+t.dt,1)}<br>${MET[met][0]}: ${f1(t[met],2)}${MET[met][1]}`;e.style.opacity=1}

 /* ---------- main timeline ---------- */
 const W=1000,H=360,L=58,R=18,Tp=18,B=42;
 function draw(){
  const[d0,d1,ts]=dom(),s=g("te-s");s.innerHTML="";
  const X=v=>L+(v-d0)/(d1-d0)*(W-L-R),vals=ts.map(t=>t[met]).filter(v=>v!=null),lo0=Math.min(...vals),hi0=Math.max(...vals),pad=(hi0-lo0)*.1||1,lo=lo0-pad,hi=hi0+pad,Y=v=>H-B-(v-lo)/(hi-lo)*(H-B-Tp);
  for(let i=0;i<=4;i++){const v=lo+(hi-lo)*i/4,y=Y(v);el("line",{x1:L,x2:W-R,y1:y,y2:y,stroke:"rgba(255,255,255,.08)"},s);el("text",{x:L-8,y:y+4,"text-anchor":"end"},s).textContent=f1(v,MET[met][2])}
  el("text",{x:L,y:12},s).textContent=MET[met][0]+(MET[met][1]?" ("+MET[met][1].trim()+")":"");
  const nm=Math.round((d1-d0)/(30*DAY)),step=Math.max(1,Math.ceil(nm/10));let c=new Date(d0);c=new Date(c.getFullYear(),c.getMonth()+1,1);let k=0;
  while(+c<d1){const x=X(+c);el("line",{x1:x,x2:x,y1:Tp,y2:H-B,stroke:"rgba(255,255,255,.08)"},s);if(k++%step==0)el("text",{x,y:H-B+22,"text-anchor":"middle"},s).textContent=mLab(c.getFullYear(),c.getMonth());c=new Date(c.getFullYear(),c.getMonth()+1,1)}
  [["A",CA],["B",CB]].forEach(([n,col])=>{const p=P[n];if(!p)return;const a=Math.max(L,X(p.a)),b=Math.min(W-R,X(p.b));el("rect",{x:a,y:Tp,width:Math.max(2,b-a),height:H-B-Tp,fill:col,"fill-opacity":.13,stroke:col,"stroke-opacity":.6},s);el("text",{x:a+6,y:Tp+16,style:`fill:${col};font-weight:800`},s).textContent=n});
  let shown=0;
  ts.forEach(t=>{const v=t[met];if(v==null)return;const tm=+t.dt;if(upto!=null&&tm>upto)return;shown++;
   const iA=P.A&&tm>=P.A.a&&tm<=P.A.b,iB=P.B&&tm>=P.B.a&&tm<=P.B.b,sel=typeof st!=="undefined"&&st.sel==t.id;
   const ci=el("circle",{cx:X(tm)+(hash(t.id)-.5)*10,cy:Y(v),r:6,fill:FC[t.fam],"fill-opacity":.88,stroke:sel?"#fff":iA?CA:iB?CB:"#0b0a1a","stroke-width":sel||iA||iB?2.5:1,class:"dot",tabindex:0,role:"button","aria-label":`Test ${t.id}, ${FN[t.fam]}, ${fd(tm,1)}`},s);
   ci.addEventListener("pointerdown",e=>e.stopPropagation());ci.onmouseenter=ci.onfocus=()=>tip(t,ci);ci.onmouseleave=ci.onblur=()=>g("te-t").style.opacity=0;
   ci.onclick=()=>{typeof openTest==="function"&&openTest(t.id)};ci.onkeydown=e=>{if(e.key=="Enter"||e.key==" "){e.preventDefault();ci.onclick()}}});
  if(upto!=null){const x=X(upto);el("line",{x1:x,x2:x,y1:Tp,y2:H-B,stroke:"#ff875c","stroke-width":2},s);el("text",{x:Math.min(x+8,W-150),y:Tp+16,style:"fill:#ff875c;font-weight:700"},s).textContent=fd(upto,1)+" · "+shown+" tests"}
  FN.forEach((n,i)=>{el("circle",{cx:L+i*128+6,cy:H-6,r:4,fill:FC[i]},s);el("text",{x:L+i*128+14,y:H-2},s).textContent=n.replace(" (clear or black)","")})}

 /* brush */
 (function(){const s=g("te-s");let br=null;
  const tOf=e=>{const r=s.getBoundingClientRect(),vx=(e.clientX-r.left)/r.width*W,[d0,d1]=dom();return Math.min(d1,Math.max(d0,d0+(vx-L)/(W-L-R)*(d1-d0)))};
  s.addEventListener("pointerdown",e=>{br={a:tOf(e),x:e.clientX,m:false};s.setPointerCapture(e.pointerId)});
  s.addEventListener("pointermove",e=>{if(!br)return;if(Math.abs(e.clientX-br.x)>4)br.m=true;if(!br.m)return;const b=tOf(e);P[act]={a:Math.min(br.a,b),b:Math.max(br.a,b)};refresh()});
  s.addEventListener("pointerup",()=>{if(br&&!br.m){P[act]=null;refresh()}br=null});
  s.addEventListener("pointercancel",()=>{br=null})})();

 /* ---------- monthly bars ---------- */
 function bars(){
  const s=g("te-b");s.innerHTML="";const grp={};T.filter(t=>all||t.yr==2014).forEach(t=>{const k=t.dt.getFullYear()*100+t.dt.getMonth();(grp[k]=grp[k]||[]).push(t)});
  const ks=Object.keys(grp).sort(),mx=Math.max(...ks.map(k=>grp[k].length)),H2=170,bw=(W-L-R)/ks.length;
  [0,.5,1].forEach(f=>{const y=H2-34-f*(H2-62);el("line",{x1:L,x2:W-R,y1:y,y2:y,stroke:"rgba(255,255,255,.08)"},s);el("text",{x:L-8,y:y+4,"text-anchor":"end"},s).textContent=Math.round(mx*f)});
  ks.forEach((k,i)=>{const yr=Math.floor(k/100),mo=k%100,x=L+i*bw+bw*.15,w=bw*.7,a=+new Date(yr,mo,1),b=+new Date(yr,mo+1,1)-1;let y=H2-34;
   FN.forEach((n,f)=>{const c=grp[k].filter(t=>t.fam==f).length;if(!c)return;const h=c/mx*(H2-62);y-=h;el("rect",{x,y,width:w,height:Math.max(1,h-1),fill:FC[f],"fill-opacity":.88,rx:2},s)});
   el("text",{x:x+w/2,y:y-6,"text-anchor":"middle",style:"fill:#f6f3ff;font-weight:700"},s).textContent=grp[k].length;
   el("text",{x:x+w/2,y:H2-16,"text-anchor":"middle"},s).textContent=mLab(yr,mo);
   [["A",CA,0],["B",CB,1]].forEach(([n,col,o])=>{const p=P[n];if(p&&p.a<=b&&p.b>=a)el("rect",{x:x+o*w/2,y:H2-30,width:w/2,height:4,fill:col,rx:2},s)});
   const h=el("rect",{x:L+i*bw,y:0,width:bw,height:H2-8,fill:"transparent",style:"cursor:pointer",tabindex:0,role:"button","aria-label":`Assign ${mLab(yr,mo)} to period ${act}`},s);
   h.onclick=()=>{P[act]={a,b};refresh()};h.onkeydown=e=>{if(e.key=="Enter"||e.key==" "){e.preventDefault();h.onclick()}}})}

 /* ---------- compare + patterns ---------- */
 const topFam=ts=>{const c=FN.map((n,f)=>[n,ts.filter(t=>t.fam==f).length]).sort((a,b)=>b[1]-a[1])[0];return ts.length?`${c[0]} (${c[1]} of ${ts.length})`:"–"};
 const sm=ts=>({n:ts.length,oi:med(ts.map(t=>t.oi)),mx:ts.length?Math.max(...ts.map(t=>t.oi)):null,dco:med(ts.map(t=>t.dco)),dox:med(ts.map(t=>t.dox)),dco2:med(ts.map(t=>t.dco2)),fr:med(ts.map(t=>t.fr)),fam:topFam(ts),ev:ts.filter(t=>t.ev.length).length,pi:[...new Set(ts.map(t=>PN[t.pi]))].join(", ")||"–"});
 const lab=p=>p?`${fd(p.a,1)} – ${fd(p.b,1)}`:"not selected";
 const strength=r=>r==null?"too few values to say":Math.abs(r)<.2?"no clear link":(Math.abs(r)<.5?"a weak ":"a clear ")+(r>0?"positive":"negative")+" link";
 function cmp(){
  const A=sm(inP(P.A)),Bm=sm(inP(P.B)),both=P.A&&P.B&&A.n&&Bm.n;let h="";
  if(P.A||P.B){
   const row=(l,v,u,d)=>{const a=A[v],b=Bm[v],dl=a!=null&&b!=null?(b-a>0?"+":"")+f1(b-a,d):"–";return`<tr><td>${l}</td><td class="a">${a==null?"–":f1(a,d)+u}</td><td class="b">${b==null?"–":f1(b,d)+u}</td><td>${both?dl+u:"–"}</td></tr>`};
   h+=`<h4>Period comparison</h4><div class="tw" style="max-height:none"><table><tr><th>Measure (median)</th><th style="color:${CA}">Period A<br><small>${lab(P.A)}</small></th><th style="color:${CB}">Period B<br><small>${lab(P.B)}</small></th><th>B − A</th></tr>
   <tr><td>Tests</td><td class="a">${A.n}</td><td class="b">${Bm.n}</td><td>${both?(Bm.n-A.n>0?"+":"")+(Bm.n-A.n):"–"}</td></tr>${row("Start O₂","oi","%",1)}${row("Richest start O₂","mx","%",1)}${row("CO rise","dco"," ppm",0)}${row("O₂ drawdown","dox"," pts",2)}${row("CO₂ rise","dco2"," pts",2)}${row("Frames shot","fr","",0)}
   <tr><td>Most-tested fuel</td><td class="a">${A.fam}</td><td class="b">${Bm.fam}</td><td></td></tr><tr><td>Researchers</td><td class="a">${A.pi}</td><td class="b">${Bm.pi}</td><td></td></tr><tr><td>Rows noting extinction/blowoff</td><td class="a">${A.ev}</td><td class="b">${Bm.ev}</td><td></td></tr></table></div>`;
   if(both){const keys=["oi","dco","dox","dco2","fr"],sd={};keys.forEach(k=>sd[k]=sdv(T.map(t=>t[k])));
    const ins=keys.filter(k=>A[k]!=null&&Bm[k]!=null).map(k=>({k,z:(Bm[k]-A[k])/sd[k]})).sort((x,y)=>Math.abs(y.z)-Math.abs(x.z)).slice(0,3).filter(o=>Math.abs(o.z)>.15);
    h+=`<h4>What stands out</h4><ul>${ins.length?ins.map(o=>`<li><b>${MET[o.k][0]}</b> was ${o.z>0?"higher":"lower"} in period B: median ${f1(Bm[o.k],MET[o.k][2])} vs ${f1(A[o.k],MET[o.k][2])}${MET[o.k][1]}.</li>`).join(""):"<li>The two periods look similar on these measures.</li>"}${A.fam.split(" (")[0]!==Bm.fam.split(" (")[0]?`<li>The fuel mix shifted: ${A.fam.split(" (")[0]} led period A, ${Bm.fam.split(" (")[0]} led period B.</li>`:""}<li>Neither period reaches Moon base air: richest start was ${f1(Math.max(A.mx,Bm.mx))}%.</li></ul><p style="font-size:13px;color:var(--mu)">These are differences in recorded conditions, not cause and effect. Different fuels and set-ups were run in different weeks, so a change over time often reflects what was being tested.</p>`}
   else h+=`<p style="color:var(--mu)">Select ${P.A?"period B":"period A"} too, by switching the chip above and dragging on the chart or clicking a month.</p>`}
  else h+=`<p style="color:var(--mu);margin-top:16px">Drag across the timeline (or click a month bar) to fill period A, switch to period B and fill that, and the comparison appears here. Or press “Try: first vs last month”.</p>`;
  const ts=(all?T:T.filter(t=>t.yr==2014)),r1=pear(ts.map(t=>+t.dt),ts.map(t=>t.oi)),r2=pear(T.map(t=>t.oi),T.map(t=>t.dco)),day={};T.forEach(t=>(day[t.date]=day[t.date]||[]).push(t));const bd=Object.entries(day).sort((a,b)=>b[1].length-a[1].length)[0];
  h+=`<h4>Patterns across the whole timeline</h4><div class="kp"><div><b>${r1==null?"–":(r1>0?"+":"")+f1(r1,2)}</b><span>Start O₂ vs date: ${strength(r1)}</span></div><div><b>${r2==null?"–":(r2>0?"+":"")+f1(r2,2)}</b><span>Start O₂ vs CO rise: ${strength(r2)}</span></div><div><b>${bd[1].length}</b><span>tests on the busiest day, ${bd[0]}</span></div></div><p style="font-size:13px;color:var(--mu)">Correlations (Pearson r) describe this table only and say nothing about cause.${all?"":` ${nOut} rows dated 2016/2018 are left out of the timeline.`}</p>`;
  g("te-c").innerHTML=h}

 const refresh=()=>{draw();bars();cmp()};
 /* ---------- controls ---------- */
 g("te-m").addEventListener("click",e=>{const b=e.target.closest(".te-p");if(!b)return;if(b.dataset.m)met=b.dataset.m;else if(b.dataset.all)all=!all;P={A:null,B:null};chips();refresh()});
 sec.querySelectorAll("[data-per]").forEach(b=>b.onclick=()=>{act=b.dataset.per;sec.querySelectorAll("[data-per]").forEach(x=>x.setAttribute("aria-pressed",x==b))});
 g("te-clr").onclick=()=>{P={A:null,B:null};refresh()};
 g("te-demo").onclick=()=>{const ms={};T.filter(t=>t.yr==2014).forEach(t=>ms[t.dt.getMonth()]=1);const k=Object.keys(ms).map(Number).sort((a,b)=>a-b),mo=m=>({a:+new Date(2014,m,1),b:+new Date(2014,m+1,1)-1});P={A:mo(k[0]),B:mo(k[k.length-1])};refresh();g("te-c").scrollIntoView({behavior:RMo?"auto":"smooth",block:"nearest"})};
 function stop(){if(raf)cancelAnimationFrame(raf);raf=null;upto=null;g("te-play").textContent="▶ Play the campaign";draw()}
 g("te-play").onclick=()=>{if(raf){stop();return}if(RMo)return;const[d0,d1]=dom(),t0=performance.now(),dur=9000;g("te-play").textContent="■ Stop";
  const f=now=>{const x=Math.min(1,(now-t0)/dur);upto=d0+(d1-d0)*x;draw();if(x<1)raf=requestAnimationFrame(f);else stop()};raf=requestAnimationFrame(f)};
 chips();refresh();
})();
 
