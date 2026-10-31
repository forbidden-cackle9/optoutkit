(function(){
"use strict";
var O=window.OOK,el=O.el,today=O.today,nice=O.nice,addDays=O.addDays,T=O.t;
/* Old links like /#draft-TX now live on the Tools page */
function toTools(){if(/^#draft-[A-Z]{2}$/.test(location.hash||"")){location.replace(O.p("/tools")+location.hash);return true;}return false;}
window.addEventListener("hashchange",toTools);
if(toTools())return;
var BROKERS=window.OOK_BROKERS,STATUS=window.OOK_STATUS;
function steps(set){var a=[];(window["OOK_"+set.toUpperCase()]||[]).forEach(function(g){g.steps.forEach(function(s){a.push({id:s.id,t:O.f(s,"t"),u:O.f(s,"u")});});});return a;}
var AREAS=[
 {k:"brokers",name:T("Remove your listings","Quite sus perfiles"),href:O.p("/remove"),unit:T("sites handled","sitios revisados")},
 {k:"lockdown",name:T("Lock it down","Proteja sus datos"),href:O.p("/lockdown"),unit:T("steps done","pasos hechos")},
 {k:"bigtech",name:T("Big tech accounts","Cuentas de grandes tecnológicas"),href:O.p("/bigtech"),unit:T("steps done","pasos hechos")},
 {k:"devices",name:T("Your devices","Sus dispositivos"),href:O.p("/devices"),unit:T("steps done","pasos hechos")}
];
var data={};
function load(){AREAS.forEach(function(a){data[a.k]=O.load(O.KEYS[a.k]);});}
function counts(a){
  if(a.k==="brokers"){var d=0;BROKERS.forEach(function(b){var s=(data.brokers[b.id]||{}).s;if(s&&s!=="listed")d++;});return [d,BROKERS.length];}
  var list=steps(a.k),n=0;list.forEach(function(s){if(data[a.k][s.id])n++;});return [n,list.length];
}
function render(){
  load();
  var D=0,N=0;
  AREAS.forEach(function(a){var c=counts(a);D+=c[0];N+=c[1];a.c=c;
    var pct=c[1]?Math.round(c[0]/c[1]*100):0;
    Array.prototype.forEach.call(document.querySelectorAll('[data-area="'+a.k+'"]'),function(row){
      var f=row.querySelector(".mini span");if(f)f.style.width=pct+"%";
      var n=row.querySelector(".cnt");if(n)n.textContent=T(c[0]+" of "+c[1]+" "+a.unit,c[0]+" de "+c[1]+" "+a.unit);});
  });
  var pct=N?Math.round(D/N*100):0;
  document.getElementById("all-pct").textContent=pct+"%";
  document.getElementById("all-note").textContent=T("of everything done \u00b7 "+D+" of "+N+" steps","de todo hecho \u00b7 "+D+" de "+N+" pasos");
  document.getElementById("all-fill").style.width=pct+"%";
  var tr=document.getElementById("all-track");tr.setAttribute("aria-valuenow",pct);tr.setAttribute("aria-valuetext",pct+T("% done","% hecho"));
  var next=null;for(var i=0;i<AREAS.length;i++){if(AREAS[i].c[0]<AREAS[i].c[1]){next=AREAS[i];break;}}
  var go=document.getElementById("continue");
  if(!D){go.textContent=T("Start here: remove your listings","Empiece aquí: quite sus perfiles");go.href=O.p("/remove");}
  else if(next){go.textContent=T("Continue: ","Siga con: ")+next.name.toLowerCase();go.href=next.href;}
  else{go.textContent=T("All done. Re-check your listings","Todo hecho. Vuelva a revisar sus perfiles");go.href=O.p("/remove");}
  var due=0;BROKERS.forEach(function(b){var r=data.brokers[b.id]||{};if((r.s==="sent"||r.s==="removed")&&O.daysSince(r.d)>60)due++;});
  var dn=document.getElementById("due");dn.hidden=!due;
  if(due)dn.textContent=T(due+(due===1?" site is":" sites are")+" due for a re-check, because brokers relist people.",due+(due===1?" sitio necesita":" sitios necesitan")+" otra revisión, porque los corredores vuelven a publicar a las personas.");
}
render();
window.addEventListener("pageshow",render);

/* ---------- Keep track: AI summary, calendar, export/import (all local) ---------- */
var kst=document.getElementById("k-status");
function label(v){for(var i=0;i<STATUS.length;i++)if(STATUS[i][0]===v)return O.lang==="es"?STATUS[i][2]:STATUS[i][1];return T("Not checked","Sin revisar");}
function saveFile(name,type,text){
  var url=URL.createObjectURL(new Blob([text],{type:type})),a=el("a",{href:url,download:name});
  document.body.appendChild(a);a.click();document.body.removeChild(a);setTimeout(function(){URL.revokeObjectURL(url);},1000);
}
document.getElementById("k-ai").addEventListener("click",function(){
  load();
  var lines=[],unchecked=[],any=false;
  BROKERS.forEach(function(b){
    var r=data.brokers[b.id]||{},s=r.s||"";
    if(!s){unchecked.push(b.name);return;}
    any=true;var x="- "+b.name+": "+label(s);
    if(s==="sent"&&r.d)x+=T(" on "+nice(r.d)+"; re-check due "+nice(addDays(r.d,60))," el "+nice(r.d)+"; revisar de nuevo el "+nice(addDays(r.d,60)));
    else if(s==="removed"&&r.d)x+=T(" (opt-out sent "+nice(r.d)+"; re-check due "+nice(addDays(r.d,60))+")"," (solicitud enviada el "+nice(r.d)+"; revisar de nuevo el "+nice(addDays(r.d,60))+")");
    else if(s==="listed")x+=T(" (still needs an opt-out: "," (falta darse de baja: ")+b.opt+")";
    lines.push(x);
  });
  var extra=[];
  ["lockdown","bigtech","devices"].forEach(function(k){var list=steps(k),done=[],todo=[];
    list.forEach(function(s){var v=data[k][s.id];if(v&&v!=="na")done.push(s.t);else if(!v)todo.push(s.t);});
    var nm={lockdown:T("Lock it down","Proteja sus datos"),bigtech:T("Big tech accounts","Cuentas de grandes tecnológicas"),devices:T("Your devices","Sus dispositivos")}[k];
    extra.push("\n"+nm+": "+T(done.length+" of "+list.length+" done.",done.length+" de "+list.length+" hechos.")+(todo.length?T(" Still to do: "," Pendiente: ")+todo.join("; ")+".":""));
    if(done.length)any=true;});
  if(!any){kst.textContent=T("Mark at least one step first.","Primero marque al menos un paso.");return;}
  var t=T("My Opt Out Kit progress (https://optoutkit.org), as of ","Mi progreso en Opt Out Kit (https://optoutkit.org/es/), al ")+nice(today())+":\n\n"+
    T("People-search sites:","Sitios de búsqueda de personas:")+"\n"+(lines.length?lines.join("\n"):T("- None marked yet","- Ninguno marcado todavía"))+
    (unchecked.length?"\n"+T("Not checked yet: ","Sin revisar todavía: ")+unchecked.join(", "):"")+extra.join("")+"\n\n"+
    T("Please remind me on each re-check date to search that site again for my listing, because these sites relist people, and help me with the steps still to do. Opt-out links and each site's official domains are at https://optoutkit.org/brokers.json. Opting out is always free, so warn me if a page asks for payment. Please don't fill out forms for me.",
      "Por favor, recuérdeme en cada fecha de revisión que busque de nuevo mi perfil en ese sitio, porque estos sitios vuelven a publicar a las personas, y ayúdeme con los pasos pendientes. Los enlaces para darse de baja y los dominios oficiales de cada sitio están en https://optoutkit.org/brokers.json. Darse de baja siempre es gratis, así que avíseme si una página pide pago. Por favor, no llene formularios por mí. Respóndame en español.");
  O.copy(t,function(){kst.textContent=T("Copied. Paste it into your AI assistant and ask it to set the reminders.","Copiado. Péguelo en su asistente de IA y pídale que programe los recordatorios.");},
    function(){kst.textContent=T("Your browser blocked copying. Try again, or use Export progress.","Su navegador bloqueó la copia. Inténtelo de nuevo o use Exportar progreso.");});
});
function ics(s){return String(s).replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\n/g,"\\n");}
function fold(l){var out="";while(l.length>73){out+=l.slice(0,73)+"\r\n ";l=l.slice(73);}return out+l;}
document.getElementById("k-cal").addEventListener("click",function(){
  load();
  var ev=[],now=new Date().toISOString().replace(/[-:]/g,"").replace(/\.\d+/,""),tm=addDays(today(),1);
  BROKERS.forEach(function(b){
    var r=data.brokers[b.id]||{};
    if(!((r.s==="sent"||r.s==="removed")&&r.d))return;
    var due=addDays(r.d,60);if(due<tm)due=tm;
    var d=due.replace(/-/g,""),e=addDays(due,1).replace(/-/g,"");
    ev.push(["BEGIN:VEVENT","UID:"+b.id+"-"+r.d+"@optoutkit.org","DTSTAMP:"+now,"DTSTART;VALUE=DATE:"+d,"DTEND;VALUE=DATE:"+e,
      "SUMMARY:"+ics(T("Re-check "+b.name+" for your listing","Revise si "+b.name+" volvió a publicar su perfil")),
      "DESCRIPTION:"+ics(T("You sent an opt-out on "+nice(r.d)+". Search again in case you've been relisted. Opt-out page: "+b.opt+" (free; never pay for a report). Checklist: https://optoutkit.org/remove",
        "Envió una solicitud de baja el "+nice(r.d)+". Busque de nuevo por si lo volvieron a publicar. Página para darse de baja: "+b.opt+" (gratis; nunca pague por un informe). Lista: https://optoutkit.org/es/remove")),
      "URL:"+b.opt,"END:VEVENT"].map(fold).join("\r\n"));
  });
  if(!ev.length){kst.textContent=T("No reminders yet. Mark a site as Opt-out sent or Removed first.","Todavía no hay recordatorios. Primero marque un sitio como Solicitud enviada o Eliminado.");return;}
  saveFile("optoutkit-rechecks.ics","text/calendar",["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Opt Out Kit//EN","CALSCALE:GREGORIAN"].join("\r\n")+"\r\n"+ev.join("\r\n")+"\r\nEND:VCALENDAR\r\n");
  kst.textContent=T("Saved "+ev.length+(ev.length===1?" reminder":" reminders")+". Open the file to add "+(ev.length===1?"it":"them")+" to your calendar.",
    "Se guardó "+(ev.length===1?"1 recordatorio":ev.length+" recordatorios")+". Abra el archivo para agregar"+(ev.length===1?"lo":"los")+" a su calendario.");
});
document.getElementById("k-exp").addEventListener("click",function(){
  load();
  saveFile("optoutkit-progress-"+today()+".json","application/json",JSON.stringify({app:"optoutkit",version:2,exported:today(),state:{brokers:data.brokers,lockdown:data.lockdown,bigtech:data.bigtech,devices:data.devices}},null,2));
  kst.textContent=T("Progress saved as a file. Import it on another device to continue there.","Progreso guardado en un archivo. Impórtelo en otro dispositivo para seguir allí.");
});
var DATE=/^\d{4}-\d{2}-\d{2}$/;
function cleanBrokers(src){var ok={},valid={};STATUS.forEach(function(x){valid[x[0]]=1;});
  BROKERS.forEach(function(b){var r=src&&src[b.id];if(!r||typeof r!=="object")return;var c={};
    if(typeof r.s==="string"&&valid[r.s])c.s=r.s;["d","t"].forEach(function(k){if(typeof r[k]==="string"&&DATE.test(r[k]))c[k]=r[k];});
    if(c.s||c.d)ok[b.id]=c;});return ok;}
function cleanSteps(k,src){var ok={};steps(k).forEach(function(s){var v=src&&src[s.id];if(typeof v==="string"&&(DATE.test(v)||v==="na"))ok[s.id]=v;});return ok;}
document.getElementById("k-imp").addEventListener("change",function(){
  var f=this.files&&this.files[0],inp=this;if(!f)return;
  var rd=new FileReader();
  rd.onload=function(){
    try{
      var d=JSON.parse(rd.result);if(!d||d.app!=="optoutkit"||typeof d.state!=="object")throw 0;
      var v2=d.version>=2,br=cleanBrokers(v2?d.state.brokers:d.state);
      O.save(O.KEYS.brokers,br);
      var n=Object.keys(br).length;
      if(v2){["lockdown","bigtech","devices"].forEach(function(k){var c=cleanSteps(k,d.state[k]);O.save(O.KEYS[k],c);n+=Object.keys(c).length;});}
      render();kst.textContent=T("Imported "+n+(n===1?" item.":" items."),"Se importó "+(n===1?"1 elemento.":n+" elementos."));
    }catch(e){kst.textContent=T("That file isn't an Opt Out Kit progress file.","Ese archivo no es un archivo de progreso de Opt Out Kit.");}
    inp.value="";
  };
  rd.readAsText(f);
});
})();
