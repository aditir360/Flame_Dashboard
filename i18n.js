
(function(){
 const LANGS={en:"English",es:"Español",fr:"Français",de:"Deutsch",zh:"中文",hi:"हिन्दी",ar:"العربية"};
 /* order: nav x6, h1, lede, cta1, cta2, h2 x5, build-briefing, reset */
 const SEL=["nav a[data-s=about]","nav a[data-s=dial-s]","nav a[data-s=explore]","nav a[data-s=coverage]","nav a[data-s=briefing]","nav a[data-s=ask]","#h1",".lede",".cta .btn:not(.g)",".cta .btn.g","#about h2","#explore","#coverage","#briefing","#ask","#rb","#rst"];
 const D={
 es:["Acerca de","Dial","Explorar","Cobertura","Mi informe","Pregunta a los datos","Todas las pruebas ardieron con un {m} % de oxígeno o menos.","Se espera que la base lunar opere con <b>30 % de oxígeno o más</b>. Cada punto del dial es una prueba real de la tabla BASS-II de la NASA (PSI-25). Gira el dial y mira cuánta evidencia existe cerca de ese aire.","Explorar las pruebas","Preguntar al analista","Un atlas del fuego en caída libre, hecho para quienes vivirán con él.","Cada prueba, filtrable","Dónde hay evidencia y dónde no","Crea tu propio informe","Pregunta a los datos","Crear mi informe","Restablecer filtros"],
 fr:["À propos","Cadran","Explorer","Couverture","Mon briefing","Interroger les données","Chaque essai a brûlé avec {m} % d’oxygène ou moins.","La base lunaire devrait fonctionner avec <b>30 % d’oxygène ou plus</b>. Chaque point du cadran est un vrai essai du tableau BASS-II de la NASA (PSI-25). Tournez le cadran pour voir combien de preuves existent près de cet air.","Explorer les essais","Demander à l’analyste","Un atlas du feu en apesanteur, conçu pour ceux qui vivront avec.","Chaque essai, filtrable","Où sont les preuves, et où elles manquent","Créez votre propre briefing","Interrogez les données","Créer mon briefing","Réinitialiser les filtres"],
 de:["Über uns","Regler","Erkunden","Abdeckung","Mein Briefing","Frag die Daten","Jeder Test brannte bei höchstens {m} % Sauerstoff.","Die Mondbasis soll mit <b>30 % Sauerstoff oder mehr</b> betrieben werden. Jeder Punkt auf dem Regler ist ein echter Test aus der BASS-II-Tabelle der NASA (PSI-25). Dreh am Regler und sieh, wie viele Belege es nahe dieser Luft gibt.","Tests erkunden","Analysten fragen","Ein Atlas des Feuers in der Schwerelosigkeit, für alle, die damit leben werden.","Jeder Test, filterbar","Wo es Belege gibt und wo nicht","Erstelle dein eigenes Briefing","Frag die Daten","Mein Briefing erstellen","Filter zurücksetzen"],
 zh:["关于","表盘","探索","覆盖范围","我的简报","询问数据","每项测试的氧气浓度都不超过{m}%。","月球基地预计将在<b>30%或更高的氧气浓度</b>下运行。表盘上的每个点都是NASA BASS-II表（PSI-25）中的真实测试。转动表盘，看看这种空气附近有多少证据。","探索测试","询问分析师","失重环境下的火焰图集，为将与之共处的人而作。","每项测试，随心筛选","证据在哪里，缺口在哪里","生成你的专属简报","询问数据","生成我的简报","重置筛选"],
 hi:["परिचय","डायल","खोजें","कवरेज","मेरी ब्रीफ़िंग","डेटा से पूछें","हर परीक्षण {m}% या उससे कम ऑक्सीजन पर जला।","चंद्र अड्डे के <b>30% या अधिक ऑक्सीजन</b> पर चलने की उम्मीद है। डायल का हर बिंदु NASA की BASS-II तालिका (PSI-25) का एक असली परीक्षण है। डायल घुमाएँ और देखें कि उस हवा के पास कितने प्रमाण हैं।","परीक्षण खोजें","विश्लेषक से पूछें","भारहीनता में आग का एक एटलस, उनके लिए जो उसके साथ रहेंगे।","हर परीक्षण, फ़िल्टर के साथ","प्रमाण कहाँ हैं, और कहाँ नहीं","अपनी ब्रीफ़िंग बनाएँ","डेटा से पूछें","मेरी ब्रीफ़िंग बनाएँ","फ़िल्टर रीसेट करें"],
 ar:["حول","القرص","استكشف","التغطية","موجزي","اسأل البيانات","احترق كل اختبار عند {m}% أكسجين أو أقل.","يُتوقع أن تعمل القاعدة القمرية عند <b>30% أكسجين أو أكثر</b>. كل نقطة على القرص هي اختبار حقيقي من جدول BASS-II التابع لناسا (PSI-25). أدر القرص وانظر كم من الأدلة يوجد قرب هذا الهواء.","استكشف الاختبارات","اسأل المحلل","أطلس للنار في انعدام الجاذبية، لمن سيعيشون معها.","كل اختبار، قابل للتصفية","أين الأدلة وأين لا توجد","أنشئ موجزك الخاص","اسأل البيانات","أنشئ موجزي","إعادة ضبط المرشحات"]};
 const E=SEL.map(s=>document.querySelector(s));
 E.forEach(e=>{if(e)e.dataset.o=e.innerHTML});
 const PH={es:["Busca pruebas, combustibles, investigadores…","Pregunta por combustibles, oxígeno, CO o una prueba como B13…"],fr:["Rechercher essais, combustibles, chercheurs…","Posez une question sur les combustibles, l’oxygène, le CO ou un essai comme B13…"],de:["Tests, Brennstoffe, Forschende suchen…","Frag nach Brennstoffen, Sauerstoff, CO oder einem Test wie B13…"],zh:["搜索测试、燃料、研究人员…","询问燃料、氧气、CO或类似B13的测试…"],hi:["परीक्षण, ईंधन, शोधकर्ता खोजें…","ईंधन, ऑक्सीजन, CO या B13 जैसे परीक्षण के बारे में पूछें…"],ar:["ابحث عن اختبارات ووقود وباحثين…","اسأل عن الوقود أو الأكسجين أو CO أو اختبار مثل B13…"]};
 const ph=[document.getElementById("sq"),document.getElementById("cq")];ph.forEach(p=>{if(p)p.dataset.o=p.placeholder});
 function apply(l){
  const d=D[l],m=["es","fr","de"].includes(l)?String(maxO).replace(".",","):String(maxO);
  E.forEach((e,i)=>{if(!e)return;let h=d?d[i].replace("{m}",m):e.dataset.o;
   if(d&&i==8)h+=' <span aria-hidden="true">↗</span>';e.innerHTML=h});
  ph.forEach((p,i)=>{if(p)p.placeholder=PH[l]?PH[l][i]:p.dataset.o});
  document.documentElement.lang=l;document.documentElement.dir=l=="ar"?"rtl":"ltr";
  try{localStorage.setItem("or-lang",l)}catch(e){}}
 let cur="en";try{cur=new URLSearchParams(location.search).get("lang")||localStorage.getItem("or-lang")||""}catch(e){}
 cur=(cur||navigator.language||"en").slice(0,2).toLowerCase();if(!LANGS[cur])cur="en";
 const sel=document.createElement("select");sel.setAttribute("aria-label","Language");
 sel.style.cssText="width:auto;margin-inline-start:8px;padding:5px 10px;font-size:12px;border-radius:99px;flex:none;cursor:pointer";
 sel.innerHTML=Object.keys(LANGS).map(k=>`<option value="${k}">${LANGS[k]}</option>`).join("");sel.value=cur;
 sel.onchange=()=>apply(sel.value);document.querySelector("nav").appendChild(sel);
 if(cur!="en")apply(cur);
})(); 
