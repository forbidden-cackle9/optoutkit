(function(){
"use strict";
var O=window.OOK,el=O.el,link=O.link,today=O.today,nice=O.nice,daysSince=O.daysSince,T=O.t;
var BROKERS=window.OOK_BROKERS,STATUS=window.OOK_STATUS,KEY=O.KEYS.brokers;
var state=O.load(KEY);
function lab(s){return O.lang==="es"?s[2]:s[1];}
function sel_label(v){for(var i=0;i<STATUS.length;i++)if(STATUS[i][0]===v)return "“"+lab(STATUS[i])+"”";return "";}
function save(){if(!O.save(KEY,state))document.getElementById("storenote").textContent=T("This browser isn't allowing the page to save, so your progress will be lost when you close it.","Este navegador no permite que la página guarde datos, así que perderá su progreso al cerrarla.");}
var list=document.getElementById("brokers");
BROKERS.forEach(function(b){
  var li=el("li",{"class":"broker",id:"b-"+b.id});
  var info=el("div",{"class":"info"});
  var h=el("h3");var nm=el("span",{"class":"name"},b.name);h.appendChild(nm);
  if(b.p){h.appendChild(el("span",{"class":"tag"},T("Priority","Prioridad")));}
  info.appendChild(h);
  var tip=O.f(b,"tip");if(tip)info.appendChild(el("p",{"class":"small muted"},tip));
  var links=el("div",{"class":"links"});
  if(b.search)links.appendChild(link(b.search,T("Find your profile","Buscar su perfil")));
  links.appendChild(link(b.opt,T("Opt out","Darse de baja")));
  info.appendChild(links);
  var when=el("span",{"class":"when",id:"w-"+b.id});when.hidden=true;info.appendChild(when);
  var flag=el("span",{"class":"flag",id:"f-"+b.id});flag.hidden=true;info.appendChild(flag);
  var ctl=el("div",{"class":"ctl"});
  var sel=el("select",{id:"s-"+b.id,"aria-label":T("Status for ","Estado de ")+b.name});
  STATUS.forEach(function(s){sel.appendChild(el("option",{value:s[0]},lab(s)));});
  var date=el("input",{type:"date",id:"d-"+b.id,"aria-label":T("Date opt-out sent for ","Fecha en que envió la solicitud a ")+b.name});
  ctl.appendChild(sel);ctl.appendChild(date);
  li.appendChild(info);li.appendChild(ctl);list.appendChild(li);
  sel.addEventListener("change",function(){
    var r=state[b.id]||{};r.s=sel.value;r.t=today();
    if(sel.value==="sent" && !r.d){r.d=today();}
    state[b.id]=r;save();render();});
  date.addEventListener("change",function(){var r=state[b.id]||{};r.d=date.value;state[b.id]=r;save();render();});
});

function render(){
  var done=0,listed=0,sent=0,removed=0,recheck=0,notl=0;
  BROKERS.forEach(function(b){
    var r=state[b.id]||{},s=r.s||"";
    document.getElementById("b-"+b.id).className="broker"+(s?" st-"+s:"");
    document.getElementById("s-"+b.id).value=s;
    var d=document.getElementById("d-"+b.id);d.value=r.d||"";
    d.hidden=!(s==="sent"||s==="removed");
    var w=document.getElementById("w-"+b.id);
    if(s && r.t){w.hidden=false;w.textContent=T("Marked ","Marcado como ")+sel_label(s)+T(" on "," el ")+nice(r.t);}else w.hidden=true;
    var f=document.getElementById("f-"+b.id);
    var age=daysSince(r.d);
    if((s==="sent"||s==="removed") && age>60){f.hidden=false;f.textContent=T("Opt-out was "+age+" days ago. Search again to make sure you haven't been relisted.","La solicitud fue hace "+age+" días. Busque de nuevo para asegurarse de que no lo hayan vuelto a publicar.");recheck++;}
    else if(s==="listed"){f.hidden=false;f.textContent=T("You're listed here. Use the opt-out link, then set the status to Opt-out sent.","Usted aparece aquí. Use el enlace para darse de baja y luego cambie el estado a Solicitud enviada.");}
    else f.hidden=true;
    if(s && s!=="listed")done++;
    if(s==="listed")listed++;if(s==="sent")sent++;if(s==="removed")removed++;if(s==="not-listed")notl++;
  });
  var N=BROKERS.length,pct=Math.round(done/N*100);
  document.getElementById("pct").textContent=pct+"%";
  document.getElementById("pctnote").textContent=T("done · "+done+" of "+N+" sites handled"+(pct===100?". Nice work.":""),"hecho · "+done+" de "+N+" sitios revisados"+(pct===100?". ¡Bien hecho!":""));
  [["removed",removed],["sent",sent],["not",notl],["listed",listed]].forEach(function(x){document.getElementById("seg-"+x[0]).style.width=(x[1]/N*100)+"%";});
  var tr=document.getElementById("track");tr.setAttribute("aria-valuenow",pct);tr.setAttribute("aria-valuetext",pct+T("% done","% hecho"));
  var c=document.getElementById("counts");c.textContent="";
  [["removed",T(removed+" removed",removed+(removed===1?" eliminado":" eliminados"))],
   ["sent",T(sent+(sent===1?" opt-out":" opt-outs")+" pending",sent+(sent===1?" solicitud pendiente":" solicitudes pendientes"))],
   ["not",T(notl+" not listed",notl+" no aparece"+(notl===1?"":"n"))],
   ["listed",T(listed+" listed, needing opt-out",listed+" aparece"+(listed===1?"":"n")+", falta darse de baja")]].forEach(function(x){
    var sp=el("span");sp.appendChild(el("span",{"class":"dot dot-"+x[0],"aria-hidden":"true"}));sp.appendChild(document.createTextNode(x[1]));c.appendChild(sp);});
  if(recheck)c.appendChild(el("span",{"class":"flag"},T(recheck+" due for re-check",recheck+" por volver a revisar")));
}
render();

var reset=document.getElementById("reset"),ask=document.getElementById("resetask");
reset.addEventListener("click",function(){ask.hidden=false;reset.hidden=true;});
document.getElementById("resetno").addEventListener("click",function(){ask.hidden=true;reset.hidden=false;});
document.getElementById("resetyes").addEventListener("click",function(){state={};save();render();ask.hidden=true;reset.hidden=false;});
})();
