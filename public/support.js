(function(){
"use strict";
var F=window.OOK_FUNDING;if(!F)return;
var es=(document.documentElement.lang||"").slice(0,2)==="es";
function T(en,s){return es?s:en;}
function f(o,k){return es&&o[k+"_es"]?o[k+"_es"]:o[k];}
function el(tag,attrs,text){var e=document.createElement(tag);for(var k in attrs)e.setAttribute(k,attrs[k]);if(text!=null)e.textContent=text;return e;}
function money(n){return "$"+(+n).toLocaleString(es?"es-US":"en-US",{minimumFractionDigits:n%1?2:0,maximumFractionDigits:2});}
var FAQ=es?"/es/faq#paid-for":"/faq#paid-for";
var L=F.links||{},links=[];
if(L.github)links.push(["GitHub Sponsors",L.github]);
if(L.kofi)links.push(["Ko-fi",L.kofi]);
if(!links.length)return; /* nothing to show until a support link is set */
var known=F.costs.every(function(c){return typeof c.amount==="number";});
var goal=known?F.costs.reduce(function(s,c){return s+c.amount;},0):0;
var got=Math.max(0,+F.received||0),funded=known&&goal>0&&got>=goal;
var today=new Date().toISOString().slice(0,10);
if(F.periodEnds&&today>F.periodEnds){funded=false;}
function bar(){var w=el("div",{"class":"fund-bar",role:"progressbar","aria-valuemin":"0","aria-valuemax":String(goal),"aria-valuenow":String(Math.min(got,goal)),"aria-label":T("Running costs covered","Gastos cubiertos")});
  var s=el("span");s.style.width=Math.min(100,goal?got/goal*100:0)+"%";w.appendChild(s);return w;}
function linkRow(p){links.forEach(function(x,i){if(i)p.appendChild(document.createTextNode(" · "));p.appendChild(el("a",{href:x[1],target:"_blank",rel:"noopener noreferrer"},x[0]));});}

/* Footer line on every page */
Array.prototype.forEach.call(document.querySelectorAll(".support-slot"),function(slot){
  slot.textContent="";slot.hidden=false;
  if(funded){slot.appendChild(document.createTextNode(T("This year's running costs are covered. Thank you to everyone who chipped in! ","Los gastos de este año están cubiertos. ¡Gracias a todos los que colaboraron! ")));
    slot.appendChild(el("a",{href:FAQ},T("How Opt Out Kit is paid for","Cómo se financia Opt Out Kit")));return;}
  slot.appendChild(document.createTextNode(T("Opt Out Kit is free and always will be. If it helped you, you can chip in to cover running costs: ","Opt Out Kit es gratis y siempre lo será. Si le sirvió, puede colaborar con los gastos: ")));
  linkRow(slot);
  if(known&&goal){slot.appendChild(document.createTextNode(T(". "+money(got)+" of "+money(goal)+" covered. ",". "+money(got)+" de "+money(goal)+" cubiertos. ")));}
  else slot.appendChild(document.createTextNode(". "));
  slot.appendChild(el("a",{href:FAQ},T("Details","Detalles")));
  if(known&&goal)slot.appendChild(bar());
});

/* FAQ detail */
var box=document.getElementById("support-faq");
if(box){
  box.textContent="";
  var d=document.getElementById("paid-for");if(d){d.hidden=false;if(location.hash==="#paid-for")d.open=true;}
  box.appendChild(el("p",{},T("Opt Out Kit is an independent project run by one person. It is not a registered nonprofit, so support isn't tax-deductible. It's free to use and always will be.",
    "Opt Out Kit es un proyecto independiente a cargo de una sola persona. No es una organización sin fines de lucro registrada, así que las contribuciones no son deducibles de impuestos. Su uso es gratis y siempre lo será.")));
  if(known){
    var t=el("table",{"class":"costs"}),tb=el("tbody");
    F.costs.forEach(function(c){var r=el("tr");r.appendChild(el("td",{},f(c,"item")));r.appendChild(el("td",{"class":"num"},money(c.amount)));tb.appendChild(r);});
    var r2=el("tr",{"class":"tot"});r2.appendChild(el("td",{},T("Total for ","Total de ")+f(F,"period")));r2.appendChild(el("td",{"class":"num"},money(goal)));tb.appendChild(r2);
    t.appendChild(tb);box.appendChild(t);
    if(F.note)box.appendChild(el("p",{"class":"small muted"},f(F,"note")));
    var up=new Date(F.updated+"T00:00:00").toLocaleDateString(es?"es-US":undefined,{month:"short",day:"numeric",year:"numeric"});
    box.appendChild(el("p",{},T(money(got)+" of "+money(goal)+" received so far (updated "+up+").",money(got)+" de "+money(goal)+" recibidos hasta ahora (actualizado el "+up+").")));
    box.appendChild(bar());
  }
  box.appendChild(el("p",{},T("We count only what actually arrives after payment fees, so the goal covers those fees too. Once costs are covered, we stop asking until the next period, and anything left over goes toward the following year's costs.",
    "Solo contamos lo que de verdad llega después de las comisiones de pago, así que la meta también cubre esas comisiones. Cuando los gastos están cubiertos, dejamos de pedir hasta el siguiente periodo, y lo que sobre se usa para los gastos del año siguiente.")));
  var p=el("p");
  if(funded)p.textContent=T("This period is covered, so support is closed for now. Thank you!","Este periodo está cubierto, así que por ahora no aceptamos contribuciones. ¡Gracias!");
  else{p.appendChild(document.createTextNode(T("If you'd like to help: ","Si quiere ayudar: ")));linkRow(p);p.appendChild(document.createTextNode("."));}
  box.appendChild(p);
}
})();
