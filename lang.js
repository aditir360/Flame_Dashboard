/* Oxygen Runway language switcher. Add <script src="lang.js"></script> before </body>. */
(function(){
"use strict";
var LANGS=[["en","English"],["es","Español"],["fr","Français"],["de","Deutsch"],["zh","中文"],["hi","हिन्दी"],["ar","العربية"]];
var KEY="or-lang";
/* order: en, es, fr, de, zh, hi, ar */
var D={
nav0:["About","Acerca de","À propos","Info","关于","परिचय","حول"],
nav1:["Dial","Dial","Cadran","Skala","表盘","डायल","المؤشر"],
nav2:["Explore","Explorar","Explorer","Erkunden","探索","खोजें","استكشاف"],
nav3:["Coverage","Cobertura","Couverture","Abdeckung","覆盖范围","कवरेज","التغطية"],
nav4:["My briefing","Mi informe","Mon bilan","Mein Briefing","我的简报","मेरी ब्रीफ़िंग","ملخصي"],
nav5:["Ask the data","Pregunta a los datos","Interroger les données","Daten befragen","询问数据","डेटा से पूछें","اسأل البيانات"],
h1:["Every test burned at {x}% oxygen or less.","Todas las pruebas ardieron con {x} % de oxígeno o menos.","Chaque essai a brûlé à {x} % d’oxygène ou moins.","Jeder Test brannte bei {x} % Sauerstoff oder weniger.","每次试验的氧气浓度都不超过{x}%。","हर परीक्षण {x}% ऑक्सीजन या उससे कम पर जला।","اشتعل كل اختبار عند {x}% أكسجين أو أقل."],
lede:["The Moon base is expected to run at <b>30% oxygen or more</b>. Each dot on the dial is a real test from NASA’s BASS-II table (PSI-25). Turn the dial and see how much evidence exists near that air.",
"Se espera que la base lunar funcione con <b>30 % de oxígeno o más</b>. Cada punto del dial es una prueba real de la tabla BASS-II de la NASA (PSI-25). Gira el dial y mira cuánta evidencia existe cerca de ese aire.",
"La base lunaire devrait fonctionner avec <b>30 % d’oxygène ou plus</b>. Chaque point du cadran est un essai réel de la table BASS-II de la NASA (PSI-25). Tournez le cadran pour voir combien de preuves existent près de cet air.",
"Die Mondbasis soll mit <b>30 % Sauerstoff oder mehr</b> betrieben werden. Jeder Punkt auf der Skala ist ein echter Test aus der BASS-II-Tabelle der NASA (PSI-25). Drehe die Skala und sieh, wie viele Belege es in der Nähe dieser Luft gibt.",
"月球基地预计将运行在<b>30%或更高的氧气浓度</b>下。表盘上的每个点都是NASA BASS-II数据表（PSI-25）中的一次真实试验。转动表盘，看看这种空气附近有多少证据。",
"चंद्र अड्डा <b>30% या अधिक ऑक्सीजन</b> पर चलने की उम्मीद है। डायल पर हर बिंदु NASA की BASS-II तालिका (PSI-25) का एक वास्तविक परीक्षण है। डायल घुमाएँ और देखें कि उस हवा के पास कितने प्रमाण हैं।",
"يُتوقع أن تعمل القاعدة القمرية بنسبة <b>30% من الأكسجين أو أكثر</b>. كل نقطة على المؤشر هي اختبار حقيقي من جدول BASS-II التابع لناسا (PSI-25). أدر المؤشر وانظر كم من الأدلة يوجد قرب ذلك الهواء."],
cta1:["Explore the tests","Explorar las pruebas","Explorer les essais","Tests erkunden","探索试验","परीक्षण देखें","استكشف الاختبارات"],
cta2:["Ask the analyst","Pregunta al analista","Interroger l’analyste","Analysten fragen","询问分析员","विश्लेषक से पूछें","اسأل المحلل"],
scroll:["SCROLL TO INVESTIGATE","DESPLÁZATE PARA INVESTIGAR","FAITES DÉFILER POUR ENQUÊTER","SCROLLEN ZUM ERFORSCHEN","向下滚动探索","जाँच के लिए स्क्रॉल करें","مرّر للتحقيق"],
hs0:["tests","pruebas","essais","Tests","试验","परीक्षण","اختبارات"],
hs1:["researchers","investigadores","chercheurs","Forschende","研究人员","शोधकर्ता","باحثون"],
hs2:["starting oxygen","oxígeno inicial","oxygène initial","Start-Sauerstoff","初始氧气浓度","प्रारंभिक ऑक्सीजन","الأكسجين الابتدائي"],
hs3:["tests at 30% or more","pruebas con 30 % o más","essais à 30 % ou plus","Tests bei 30 % oder mehr","30%以上的试验","30% या अधिक वाले परीक्षण","اختبارات عند 30% أو أكثر"],
d0:["Earth air","Aire terrestre","Air terrestre","Erdluft","地球空气","पृथ्वी की हवा","هواء الأرض"],
d1:["Highest tested","Máximo probado","Maximum testé","Höchster Test","最高测试值","सर्वाधिक परीक्षित","أعلى قيمة مختبرة"],
d2:["Moon base","Base lunar","Base lunaire","Mondbasis","月球基地","चंद्र अड्डा","القاعدة القمرية"],
d3:["Spacesuits run 100%, far off this dial","Los trajes espaciales usan 100 %, muy lejos de este dial","Les combinaisons spatiales utilisent 100 %, bien au-delà de ce cadran","Raumanzüge nutzen 100 %, weit außerhalb dieser Skala","航天服使用100%，远超此表盘","स्पेससूट 100% पर चलते हैं, इस डायल से कहीं आगे","بدلات الفضاء تعمل بنسبة 100%، أبعد بكثير من هذا المؤشر"],
sg0:["The evidence has a ceiling.","La evidencia tiene un techo.","Les preuves ont un plafond.","Die Belege haben eine Obergrenze.","证据有上限。","प्रमाणों की एक सीमा है।","للأدلة سقف."],
sg1:["BASS-II RECORDS","REGISTROS BASS-II","ENREGISTREMENTS BASS-II","BASS-II-DATENSÄTZE","BASS-II记录","BASS-II रिकॉर्ड","سجلات BASS-II"],
sg2:["RICHEST START AIR","AIRE INICIAL MÁS RICO","AIR INITIAL LE PLUS RICHE","REICHSTE STARTLUFT","最高初始氧气","सबसे समृद्ध प्रारंभिक हवा","أغنى هواء ابتدائي"],
sg3:["MOON HABITAT TARGET","META DEL HÁBITAT LUNAR","CIBLE DE L’HABITAT LUNAIRE","ZIEL DES MONDHABITATS","月球栖息地目标","चंद्र आवास लक्ष्य","هدف الموئل القمري"],
h2a:["Every test, filterable","Cada prueba, filtrable","Chaque essai, filtrable","Jeder Test, filterbar","每次试验，均可筛选","हर परीक्षण, फ़िल्टर योग्य","كل اختبار، قابل للتصفية"],
h2b:["Where the evidence is, and isn’t","Dónde hay evidencia y dónde no","Où sont les preuves, et où elles manquent","Wo es Belege gibt und wo nicht","证据在哪里，缺口在哪里","प्रमाण कहाँ हैं, और कहाँ नहीं","أين توجد الأدلة وأين تغيب"],
h2c:["Build your own briefing","Crea tu propio informe","Créez votre propre bilan","Erstelle dein eigenes Briefing","生成你的专属简报","अपनी ब्रीफ़िंग बनाएँ","أنشئ ملخصك الخاص"]
};
/* [selector, key, mode, nth]  modes: t=text, h=html, l=last text node, c=button + arrow */
var RULES=[
["nav a[data-s=about]","nav0","t"],["nav a[data-s=dial-s]","nav1","t"],["nav a[data-s=explore]","nav2","t"],["nav a[data-s=coverage]","nav3","t"],["nav a[data-s=briefing]","nav4","t"],["nav a[data-s=ask]","nav5","t"],
["#h1","h1","t"],[".hero-copy .lede","lede","h"],[".cta a.btn:not(.g)","cta1","c"],[".cta a.btn.g","cta2","t"],[".hero-scroll","scroll","l"],
["#hs > div","hs0","l",0],["#hs > div","hs1","l",1],["#hs > div","hs2","l",2],["#hs > div","hs3","l",3],
['.pr [data-c="20.9"]',"d0","t"],["#pmax","d1","t"],['.pr [data-c="30"]',"d2","t"],[".pr > span","d3","t"],
[".signal-intro strong","sg0","t"],[".signal-metric .signal-label","sg1","t",0],[".signal-metric .signal-label","sg2","t",1],[".signal-metric .signal-label","sg3","t",2],
["h2#explore","h2a","t"],["h2#coverage","h2b","t"],["h2#briefing","h2c","t"],["h2#ask","nav5","t"]
];
function ix(code){for(var i=0;i<LANGS.length;i++)if(LANGS[i][0]===code)return i;return 0}
function maxO(){try{return typeof maxO_==="number"?maxO_:(typeof window.maxO==="number"?window.maxO:22.2)}catch(e){return 22.2}}
function apply(code){
 var i=ix(code),x;try{x=(new Function("return typeof maxO!=='undefined'?maxO:22.2"))()}catch(e){x=22.2}
 RULES.forEach(function(r){
  var els=[].slice.call(document.querySelectorAll(r[0]));if(r[3]!=null)els=els[r[3]]?[els[r[3]]]:[];
  var s=D[r[1]][i].replace("{x}",x);
  els.forEach(function(el){
   if(r[2]==="t")el.textContent=s;
   else if(r[2]==="h")el.innerHTML=s;
   else if(r[2]==="c")el.innerHTML=s+' <span aria-hidden="true">↗</span>';
   else{var ns=[].slice.call(el.childNodes).filter(function(n){return n.nodeType===3&&n.textContent.trim()}),n=ns[ns.length-1];
    if(n)n.textContent=(/^\s/.test(n.textContent)?" ":"")+s}})});
 var h=document.documentElement;h.lang=code;h.dir=code==="ar"?"rtl":"ltr";
 var sel=document.getElementById("langsel");if(sel&&sel.value!==code)sel.value=code}
function initial(){
 var c="";try{c=new URLSearchParams(location.search).get("lang")||localStorage.getItem(KEY)||""}catch(e){}
 c=(c||navigator.language||"en").slice(0,2).toLowerCase();return LANGS.some(function(l){return l[0]===c})?c:"en"}
var css=document.createElement("style");
css.textContent="#langbox{position:fixed;top:calc(8px + env(safe-area-inset-top,0px));right:14px;z-index:25;display:flex;align-items:center;gap:8px;height:36px;padding:0 6px 0 12px;border-radius:99px;background:rgba(7,10,24,.92);border:1px solid rgba(160,190,255,.3);box-shadow:0 8px 28px rgba(0,0,0,.35);backdrop-filter:blur(14px);color:#f6f3ff;font:700 12px 'Hanken Grotesk',system-ui,sans-serif;letter-spacing:.04em}"+
"#langbox:hover{border-color:#8ce5ff}#langbox svg{width:16px;height:16px;flex:none;stroke:#8ce5ff}"+
"#langsel{appearance:none;-webkit-appearance:none;background:transparent;border:0;color:#f6f3ff;font:600 14px 'Hanken Grotesk',system-ui,sans-serif;padding:6px 26px 6px 2px;cursor:pointer;min-width:92px;background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%238ce5ff' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E\");background-repeat:no-repeat;background-position:right 8px center}"+
"#langsel:focus-visible{outline:2px solid #a7edff;outline-offset:3px;border-radius:99px}#langsel option{background:#17142b;color:#f6f3ff}"+
"nav{padding-right:180px!important}@media(max-width:640px){nav{padding-right:150px!important}#langbox{right:10px;padding-left:9px}#langsel{min-width:78px}}"+
"[dir=rtl] .dw,[dir=rtl] .chartwrap,[dir=rtl] .hmw,[dir=rtl] .tw,[dir=rtl] .sc,[dir=rtl] .scl,[dir=rtl] .ml{direction:ltr}"+
"html[lang=ar] *,html[lang=hi] *,html[lang=zh] *{letter-spacing:0!important}html[lang=ar] .hero-kicker,html[lang=ar] .eyebrow{text-transform:none}";
document.head.appendChild(css);
var box=document.createElement("div");box.id="langbox";
box.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/></svg><label for="langsel" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">Language</label><select id="langsel" aria-label="Language">'+LANGS.map(function(l){return'<option value="'+l[0]+'" lang="'+l[0]+'">'+l[1]+'</option>'}).join("")+'</select>';
document.body.appendChild(box);
var sel=document.getElementById("langsel");
sel.onchange=function(){var c=sel.value;try{localStorage.setItem(KEY,c)}catch(e){}apply(c)};
var start=initial();sel.value=start;apply(start);
})();
