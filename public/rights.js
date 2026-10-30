(function(){
"use strict";
var O=window.OOK,T=O.t,el=O.el,ext=O.link,today=O.today;
var S=window.OOK_STATES||[];
function $(id){return document.getElementById(id);}
function nice(s){return O.nice(s,true);}
function find(c){for(var i=0;i<S.length;i++)if(S[i].c===c)return S[i];return null;}
function nm(st){return O.f(st,"n");}
function lawName(st){return /'s /.test(st.law)?st.law:"the "+st.law;}
function lawNameEs(st){return "la ley "+st.law;}

["st-pick","lt-state"].forEach(function(id){var sel=$(id);S.forEach(function(x){sel.appendChild(el("option",{value:x.c},nm(x)));});});
if(window.OOK_REVIEWED&&$("reviewed"))$("reviewed").textContent=nice(window.OOK_REVIEWED);

/* ---------- Rights by state ---------- */
function p(parent,text){var e=el("p",{},text);parent.appendChild(e);return e;}
function li(ul,strong){var x=el("li");x.appendChild(el("strong",{},strong));ul.appendChild(x);return x;}
function txt(node,s){node.appendChild(document.createTextNode(s));}
var AG="https://www.naag.org/find-my-ag/";
function showState(){
  var st=find($("st-pick").value),out=$("st-out");out.textContent="";
  if(!st){out.hidden=true;return;}
  out.hidden=false;
  var box=el("div",{"class":"stcard"});out.appendChild(box);
  var t=today(),n=nm(st);
  var live=!!st.law&&st.eff<=t;
  if(st.law&&live){
    box.appendChild(el("h3",{},st.law));
    p(box,T("In effect since "+nice(st.eff)+".","Vigente desde el "+nice(st.eff)+".")).className="muted";
    if(st.limited){
      p(box,T("This law applies only to a small number of very large companies, so it doesn't cover most people-search sites. Use the opt-out links on the checklist, and consider asking your legislators for a broader law.",
              "Esta ley solo se aplica a unas pocas empresas muy grandes, así que no cubre la mayoría de los sitios de búsqueda de personas. Use los enlaces de la lista para darse de baja y considere pedir a sus legisladores una ley más amplia."));
    }else{
      p(box,T("State privacy laws like this one generally let you ask a business to show you, correct and delete the personal data it holds about you, and to stop selling it or using it for targeted ads. Exactly which rights you get, and which companies must comply, varies by state.",
              "Las leyes estatales de privacidad como esta suelen permitirle pedir a una empresa que le muestre, corrija y borre los datos personales que tiene sobre usted, y que deje de venderlos o de usarlos para anuncios dirigidos. Los derechos exactos, y qué empresas deben cumplir, varían según el estado."));
      p(box,T("One important limit: most state laws exclude “publicly available” information such as government records, which many people-search sites rely on. So keep using the opt-out links on the checklist; a request under your state's law is a useful extra step, not a replacement.",
              "Un límite importante: la mayoría de las leyes estatales excluyen la información “públicamente disponible”, como los registros del gobierno, en la que se basan muchos sitios de búsqueda de personas. Así que siga usando los enlaces de la lista; una solicitud bajo la ley de su estado es un paso extra útil, no un reemplazo."));
    }
    if(st.extra){var e=p(box,O.f(st,"extra")+" ");e.appendChild(ext(st.extraUrl,O.f(st,"extraLabel")));}
    else if(st.reg){p(box,T(n+" requires data brokers to register with the state, so its public registry is a good list of companies to send requests to.",
                            n+" exige que los corredores de datos se registren con el estado, así que su registro público es una buena lista de empresas a las que enviar solicitudes."));}
    var ul=el("ul",{"class":"also"});box.appendChild(ul);
    if(!st.limited){
      var a=li(ul,T("Use it: ","Úsela: "));
      txt(a,T("draft a deletion request citing "+lawName(st)+" with ","redacte una solicitud de eliminación que cite "+lawNameEs(st)+" con "));
      a.appendChild(el("a",{href:O.p("/tools")+"#draft-"+st.c},T("the request tool","la herramienta de solicitudes")));txt(a,".");
    }
    var b=li(ul,T("If a company ignores you: ","Si una empresa no le responde: "));
    if(st.agency){txt(b,T("file a complaint with the ","presente una queja ante la "));b.appendChild(ext(st.agencyUrl,O.f(st,"agency")));txt(b,T(" or your "," o ante la oficina del "));}
    else txt(b,T("contact your ","comuníquese con la oficina del "));
    b.appendChild(ext(AG,T("state attorney general","fiscal general de su estado")));txt(b,T(", who enforces the law.",", que hace cumplir la ley."));
  }else{
    if(st.law){box.appendChild(el("h3",{},st.law));p(box,T("Signed into law; takes effect "+nice(st.eff)+". Until then, "+n+" residents don't have these rights yet.","Ya se aprobó; entra en vigor el "+nice(st.eff)+". Hasta entonces, los residentes de "+n+" todavía no tienen estos derechos.")).className="muted";}
    else box.appendChild(el("h3",{},T(n+" has no comprehensive privacy law yet",n+" todavía no tiene una ley integral de privacidad")));
    p(box,T("You can still use every opt-out on the checklist; most of those sites accept requests from anyone, wherever they live. You can also send any company the general opt-out draft from the request tool.",
            "Aun así puede usar todas las bajas de la lista; la mayoría de esos sitios aceptan solicitudes de cualquier persona, viva donde viva. También puede enviar a cualquier empresa el borrador general de la herramienta de solicitudes."));
    p(box,st.law?T("Laws can be strengthened before they take effect, and residents' voices help. The letter below is a good place to start.","Las leyes se pueden reforzar antes de entrar en vigor, y la voz de los residentes ayuda. La carta de abajo es un buen comienzo."):
                 T("Laws like this pass when residents ask for them. The letter below is a good place to start.","Leyes como esta se aprueban cuando los residentes las piden. La carta de abajo es un buen comienzo."));
    var ul2=el("ul",{"class":"also"});box.appendChild(ul2);
    var c=li(ul2,T("Consumer complaints: ","Quejas de consumidores: "));txt(c,T("your ","la oficina del "));c.appendChild(ext(AG,T("state attorney general","fiscal general de su estado")));txt(c,T(" handles consumer protection complaints."," atiende las quejas de protección al consumidor."));
  }
  breakdown(box,st.c);
  if($("lt-state").value!==st.c){$("lt-state").value=st.c;letter();}
}
$("st-pick").addEventListener("change",showState);

/* ---------- Scores, heat map and ranking ---------- */
var SC=window.OOK_SCORES||{criteria:[],scores:{}},CR=SC.criteria;
var MAXC=0,MAXG=0;CR.forEach(function(c){if(c.group==="Consumer")MAXC+=3*c.weight;else MAXG+=3*c.weight;});
function totals(code){var r=SC.scores[code];if(!r)return null;var c=0,g=0;
  CR.forEach(function(k,i){if(k.group==="Consumer")c+=r.s[i]*k.weight;else g+=r.s[i]*k.weight;});return {c:c,g:g,pct:MAXC?c/MAXC:0};}
var ORDER=S.map(function(x){return x.c;}).filter(function(c){return SC.scores[c];});
var RANK={};(function(){var t=ORDER.map(function(c){return [c,totals(c).c];}).sort(function(a,b){return b[1]-a[1];});
  t.forEach(function(x,i){RANK[x[0]]=(i>0&&x[1]===t[i-1][1])?RANK[t[i-1][0]]:i+1;});})();
function mix(a,b,t){var x=parseInt(a,16),y=parseInt(b,16);function ch(s){return [(s>>16)&255,(s>>8)&255,s&255];}
  var p=ch(x),q=ch(y);return "#"+p.map(function(v,i){return Math.round(v+(q[i]-v)*t).toString(16).padStart(2,"0");}).join("");}
function heat(f){f=Math.max(0,Math.min(1,f));return f<.5?mix("F4F1E8","E9C46A",f/.5):mix("E9C46A","2E9E5B",(f-.5)/.5);}
function inkOn(f){return f>0.7?"#ffffff":"#1d2a1f";}
var GRID={AK:[0,0],ME:[10,0],VT:[9,1],NH:[10,1],WA:[0,2],ID:[1,2],MT:[2,2],ND:[3,2],MN:[4,2],IL:[5,2],WI:[6,2],MI:[7,2],NY:[8,2],RI:[9,2],MA:[10,2],
 OR:[0,3],NV:[1,3],WY:[2,3],SD:[3,3],IA:[4,3],IN:[5,3],OH:[6,3],PA:[7,3],NJ:[8,3],CT:[9,3],
 CA:[0,4],UT:[1,4],CO:[2,4],NE:[3,4],MO:[4,4],KY:[5,4],WV:[6,4],VA:[7,4],MD:[8,4],DE:[9,4],
 AZ:[1,5],NM:[2,5],KS:[3,5],AR:[4,5],TN:[5,5],NC:[6,5],SC:[7,5],DC:[8,5],
 OK:[3,6],LA:[4,6],MS:[5,6],AL:[6,6],GA:[7,6],HI:[0,7],TX:[3,7],FL:[8,7],
 GU:[0,9],MP:[1,9],AS:[2,9],PR:[8,9],VI:[9,9]};
var NS="http://www.w3.org/2000/svg";
function sv(tag,attrs,text){var e=document.createElementNS(NS,tag);for(var k in attrs)e.setAttribute(k,attrs[k]);if(text!=null)e.textContent=text;return e;}
(function(){
  var W=40,svg=sv("svg",{viewBox:"0 0 440 400",role:"group","aria-label":T("Map of states and territories colored by privacy protection","Mapa de estados y territorios coloreado según su protección de la privacidad")});
  svg.appendChild(sv("text",{x:0,y:8*W+26,"class":"cap"},T("Territories","Territorios")));
  ORDER.forEach(function(c){var g=GRID[c];if(!g)return;var t=totals(c),st=find(c),f=t.pct/0.85,fill=heat(f);
    var a=sv("g",{"class":"tile",tabindex:"0",role:"button","data-c":c,"aria-label":nm(st)+T(": consumer score "+t.c+" of "+MAXC+", rank "+RANK[c],": puntaje de consumidor "+t.c+" de "+MAXC+", puesto "+RANK[c])});
    a.appendChild(sv("title",{},nm(st)+" — "+t.c+"/"+MAXC));
    a.appendChild(sv("rect",{x:g[0]*W+1,y:g[1]*W+1+(g[1]>=9?-8:0),width:W-2,height:W-2,rx:5,fill:fill}));
    a.appendChild(sv("text",{x:g[0]*W+W/2,y:g[1]*W+W/2+5+(g[1]>=9?-8:0),"text-anchor":"middle",fill:inkOn(f)},c));
    function go(){pick(c,true);}
    a.addEventListener("click",go);a.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();go();}});
    svg.appendChild(a);});
  $("map").appendChild(svg);
})();
function pick(c,scroll){$("st-pick").value=c;showState();if(scroll){var o=$("st-out");if(o.scrollIntoView)o.scrollIntoView({block:"nearest",behavior:"smooth"});}}
function breakdown(box,code){
  var t=totals(code),r=SC.scores[code];if(!t)return;
  var line=el("div",{"class":"scoreline"});
  line.appendChild(el("span",{"class":"big"},t.c+"/"+MAXC));
  line.appendChild(el("span",{},T("consumer score · rank "+RANK[code]+" of "+ORDER.length,"puntaje de consumidor · puesto "+RANK[code]+" de "+ORDER.length)));
  line.appendChild(el("span",{"class":"muted"},T("Government ","Gobierno ")+t.g+"/"+MAXG));
  box.appendChild(line);
  var bars=el("div",{"class":"bars"}),last="";
  CR.forEach(function(k,i){
    if(k.group!==last){bars.appendChild(el("div",{"class":"grp"},k.group==="Consumer"?T("Protection from companies","Protección frente a empresas"):T("Protection from government","Protección frente al gobierno")));last=k.group;}
    bars.appendChild(el("span",{},O.f(k,"name")+(k.weight>1?" (×"+k.weight+")":"")));
    var b=el("div",{"class":"bar","aria-hidden":"true"}),f=el("span");f.style.width=(r.s[i]/3*100)+"%";f.style.background=heat(r.s[i]/3);b.appendChild(f);bars.appendChild(b);
    bars.appendChild(el("span",{"aria-label":r.s[i]+T(" of 3"," de 3")},String(r.s[i])));
  });
  box.appendChild(bars);
  var note=O.f(r,"note");if(note)p(box,note).className="small muted";
  var m=el("p",{"class":"small"});var a=el("a",{href:"#method"},T("How we scored this","Cómo calculamos el puntaje"));a.addEventListener("click",function(){$("method").open=true;});m.appendChild(a);box.appendChild(m);
  Array.prototype.forEach.call(document.querySelectorAll(".map .tile"),function(n){n.classList.toggle("on",n.getAttribute("data-c")===code);});
}
/* Ranking table */
var sortK="rank",sortDir=1;
function drawTable(){
  var tb=document.querySelector("#rank tbody");tb.textContent="";
  var list=ORDER.slice().sort(function(a,b){var x,y;
    if(sortK==="name"){x=nm(find(a));y=nm(find(b));return x.localeCompare(y,O.lang)*sortDir;}
    if(sortK==="gov"){x=totals(a).g;y=totals(b).g;}else if(sortK==="cons"){x=totals(a).c;y=totals(b).c;}else{x=RANK[a];y=RANK[b];}
    return (x-y)*sortDir||(RANK[a]-RANK[b]);});
  list.forEach(function(c){var t=totals(c),tr=el("tr",{tabindex:"0"});
    tr.appendChild(el("td",{},String(RANK[c])));tr.appendChild(el("td",{"class":"n"},nm(find(c))));
    var td=el("td"),ch=el("span",{"class":"chip-s"},t.c+"/"+MAXC);var f=t.pct/0.85;ch.style.background=heat(f);ch.style.color=inkOn(f);td.appendChild(ch);tr.appendChild(td);
    tr.appendChild(el("td",{},t.g+"/"+MAXG));
    function go(){pick(c,false);var s=document.querySelector('section[aria-labelledby="st-h"]');if(s.scrollIntoView)s.scrollIntoView({behavior:"smooth"});}
    tr.addEventListener("click",go);tr.addEventListener("keydown",function(e){if(e.key==="Enter"){go();}});
    tb.appendChild(tr);});
  Array.prototype.forEach.call(document.querySelectorAll("#rank th"),function(th){var k=th.firstChild.getAttribute("data-k");
    if(k===sortK)th.setAttribute("aria-sort",sortDir>0?"ascending":"descending");else th.removeAttribute("aria-sort");});
}
Array.prototype.forEach.call(document.querySelectorAll("#rank th button"),function(b){b.addEventListener("click",function(){
  var k=b.getAttribute("data-k");if(k===sortK)sortDir=-sortDir;else{sortK=k;sortDir=(k==="cons"||k==="gov")?-1:1;}drawTable();});});
drawTable();
(function(){var ul=$("crit-list");CR.forEach(function(k){var x=el("li");x.appendChild(el("strong",{},O.f(k,"name")+(k.weight>1?T(" (counts double)"," (cuenta doble)"):"")+": "));
  x.appendChild(document.createTextNode(O.f(k,"what")+". "+O.f(k,"guide")+"."));ul.appendChild(x);});
  Array.prototype.forEach.call(document.querySelectorAll(".rev"),function(n){n.textContent=nice(SC.reviewed||window.OOK_REVIEWED);});})();

/* ---------- Letter to representatives ---------- */
function v(id){var e=$(id);return e?e.value.trim():"";}
function letterEn(to,st,name,city,why,t){
  var where=(city?city+", ":"")+(st?st.n:"[your state]"),ask;
  var greet=to==="federal"?"Dear Senator or Representative,":"Dear Legislator,";
  if(to==="federal"){
    ask="I'm writing to ask you to support a national privacy law that gives every American the right to see and delete the personal data companies hold about them, including data brokers and people-search sites that publish home addresses, phone numbers and family members' names without consent. The law should include real enforcement, so these rights are more than words on paper.";
  }else if(st&&st.law&&!st.limited&&st.eff<=t){
    ask="Thank you for the privacy protections "+st.n+" already has under "+lawName(st)+". I'm writing to ask you to close the gaps that still leave residents exposed: make sure the law reaches data brokers and people-search sites, create a free one-step way to have every registered data broker delete your information, as California has done, and fund strong enforcement.";
  }else if(st&&st.law&&!st.limited){
    ask="Thank you for passing "+lawName(st)+", which takes effect "+new Date(st.eff+"T00:00:00").toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})+". I'm writing to ask you to make sure it delivers for residents: that it reaches data brokers and people-search sites, that there's a free one-step way to have every registered data broker delete your information, as California has done, and that enforcement is well funded.";
  }else{
    ask="I'm writing to ask you to support a comprehensive consumer privacy law for "+(st?st.n:"our state")+". Residents should have the right to see and delete the personal data companies hold about them, including data brokers and people-search sites that publish home addresses, phone numbers and family members' names without consent. A free, one-step way to have every data broker delete your information, like California's, would make that right practical.";
  }
  return greet+"\n\nI'm a constituent in "+where+". "+ask+(why?"\n\nThis matters to me personally: "+why:"")+
    "\n\nPrivacy shouldn't be a partisan issue, and it shouldn't require hours of opt-out forms to protect your own family. I'd appreciate knowing where you stand.\n\nSincerely,\n"+(name||"[Your name]")+"\n"+where;
}
function letterEs(to,st,name,city,why,t){
  var sn=st?nm(st):"[su estado]",where=(city?city+", ":"")+sn,ask;
  var greet=to==="federal"?"Estimado senador o representante:":"Estimado legislador:";
  if(to==="federal"){
    ask="Le escribo para pedirle que apoye una ley nacional de privacidad que dé a todos los estadounidenses el derecho de ver y borrar los datos personales que las empresas tienen sobre ellos, incluidos los corredores de datos y los sitios de búsqueda de personas que publican direcciones, números de teléfono y nombres de familiares sin consentimiento. La ley debe incluir una aplicación real, para que estos derechos no se queden en el papel.";
  }else if(st&&st.law&&!st.limited&&st.eff<=t){
    ask="Gracias por las protecciones de privacidad que "+sn+" ya tiene bajo "+lawNameEs(st)+". Le escribo para pedirle que cierre las brechas que todavía dejan expuestos a los residentes: que la ley alcance a los corredores de datos y a los sitios de búsqueda de personas, que exista una forma gratuita y de un solo paso para que todos los corredores registrados borren nuestra información, como ya hizo California, y que se financie una aplicación firme de la ley.";
  }else if(st&&st.law&&!st.limited){
    ask="Gracias por aprobar "+lawNameEs(st)+", que entra en vigor el "+nice(st.eff)+". Le escribo para pedirle que se asegure de que cumpla con los residentes: que alcance a los corredores de datos y a los sitios de búsqueda de personas, que exista una forma gratuita y de un solo paso para que todos los corredores registrados borren nuestra información, como ya hizo California, y que la aplicación de la ley tenga fondos suficientes.";
  }else{
    ask="Le escribo para pedirle que apoye una ley integral de privacidad del consumidor para "+(st?sn:"nuestro estado")+". Los residentes deberíamos tener derecho a ver y borrar los datos personales que las empresas tienen sobre nosotros, incluidos los corredores de datos y los sitios de búsqueda de personas que publican direcciones, números de teléfono y nombres de familiares sin consentimiento. Una forma gratuita y de un solo paso para que todos los corredores borren nuestra información, como la de California, haría práctico ese derecho.";
  }
  return greet+"\n\nSoy residente de su distrito en "+where+". "+ask+(why?"\n\nEsto me importa personalmente: "+why:"")+
    "\n\nLa privacidad no debería ser un tema partidista, y proteger a la propia familia no debería requerir horas de formularios. Le agradecería saber cuál es su postura.\n\nAtentamente,\n"+(name||"[Su nombre]")+"\n"+where;
}
function letter(){
  var to=v("lt-to"),st=find(v("lt-state")),name=v("lt-name"),city=v("lt-city"),why=v("lt-why"),t=today();
  var inEs=O.lang==="es"&&v("lt-lang")!=="en";
  $("lt-out").value=inEs?letterEs(to,st,name,city,why,t):letterEn(to,st,name,city,why,t);$("lt-status").textContent="";
}
["lt-to","lt-state","lt-name","lt-city","lt-why","lt-lang"].forEach(function(id){var e=$(id);if(!e)return;e.addEventListener("input",letter);e.addEventListener("change",letter);});
$("ltform").addEventListener("submit",function(e){e.preventDefault();});
$("lt-copy").addEventListener("click",function(){
  var ta=$("lt-out"),st=$("lt-status");
  O.copy(ta.value,function(){st.textContent=T("Copied. Paste it into an email or your representative's contact form.","Copiado. Péguelo en un correo o en el formulario de contacto de su representante.");},
    function(){ta.select();st.textContent=T("Selected. Copy it with your device's copy command.","Seleccionado. Cópielo con la función de copiar de su dispositivo.");});
});
letter();
})();
