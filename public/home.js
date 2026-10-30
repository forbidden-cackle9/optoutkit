(function(){
"use strict";
/* Old links like /#draft-TX now live on the Tools page */
function toTools(){if(/^#draft-[A-Z]{2}$/.test(location.hash||"")){location.replace("/tools"+location.hash);return true;}return false;}
window.addEventListener("hashchange",toTools);
if(toTools())return;
var O=window.OOK,el=O.el,today=O.today,nice=O.nice,addDays=O.addDays;
var BROKERS=window.OOK_BROKERS,STATUS=window.OOK_STATUS;
function steps(set){var a=[];(window["OOK_"+set.toUpperCase()]||[]).forEach(function(g){g.steps.forEach(function(s){a.push({id:s.id,t:s.t,g:g.name,u:s.u});});});return a;}
var AREAS=[
 {k:"brokers",name:"Remove your listings",href:"/remove",unit:"sites handled"},
 {k:"lockdown",name:"Lock it down",href:"/lockdown",unit:"steps done"},
 {k:"bigtech",name:"Big tech accounts",href:"/bigtech",unit:"steps done"}
];
var data={};
function load(){AREAS.forEach(function(a){data[a.k]=O.load(O.KEYS[a.k]);});}
function counts(a){
  if(a.k==="brokers"){var d=0;BROKERS.forEach(function(b){var s=(data.brokers[b.id]||{}).s;if(s&&s!=="listed")d++;});return [d,BROKERS.length];}
  var list=steps(a.k),n=0;list.forEach(function(s){if(data[a.k][s.id])n++;});return [n,list.length];
}
function render(){
  load();
  var D=0,T=0;
  AREAS.forEach(function(a){var c=counts(a);D+=c[0];T+=c[1];a.c=c;
    var pct=c[1]?Math.round(c[0]/c[1]*100):0;
    Array.prototype.forEach.call(document.querySelectorAll('[data-area="'+a.k+'"]'),function(row){
      var f=row.querySelector(".mini span");if(f)f.style.width=pct+"%";
      var n=row.querySelector(".cnt");if(n)n.textContent=c[0]+" of "+c[1]+" "+a.unit;});
  });
  var pct=T?Math.round(D/T*100):0;
  document.getElementById("all-pct").textContent=pct+"%";
  document.getElementById("all-note").textContent="of everything done \u00b7 "+D+" of "+T+" steps";
  document.getElementById("all-fill").style.width=pct+"%";
  var tr=document.getElementById("all-track");tr.setAttribute("aria-valuenow",pct);tr.setAttribute("aria-valuetext",pct+"% done");
  var next=null;for(var i=0;i<AREAS.length;i++){if(AREAS[i].c[0]<AREAS[i].c[1]){next=AREAS[i];break;}}
  var go=document.getElementById("continue");
  if(!D){go.textContent="Start here: remove your listings";go.href="/remove";}
  else if(next){go.textContent="Continue: "+next.name.toLowerCase();go.href=next.href;}
  else{go.textContent="All done. Re-check your listings";go.href="/remove";}
  var due=0;BROKERS.forEach(function(b){var r=data.brokers[b.id]||{};if((r.s==="sent"||r.s==="removed")&&O.daysSince(r.d)>60)due++;});
  var dn=document.getElementById("due");dn.hidden=!due;
  if(due)dn.textContent=due+(due===1?" site is":" sites are")+" due for a re-check, because brokers relist people.";
}
render();
window.addEventListener("pageshow",render);

/* ---------- Keep track: AI summary, calendar, export/import (all local) ---------- */
var kst=document.getElementById("k-status");
function label(v){for(var i=0;i<STATUS.length;i++)if(STATUS[i][0]===v)return STATUS[i][1];return "Not checked";}
function copyText(t,msg){
  function fb(){var a=el("textarea");a.value=t;a.setAttribute("readonly","");a.className="vh";document.body.appendChild(a);a.select();var ok=false;try{ok=document.execCommand("copy");}catch(e){}document.body.removeChild(a);kst.textContent=ok?msg:"Your browser blocked copying. Try again, or use Export progress.";}
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(function(){kst.textContent=msg;},fb);else fb();
}
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
    if(s==="sent"&&r.d)x+=" on "+nice(r.d)+"; re-check due "+nice(addDays(r.d,60));
    else if(s==="removed"&&r.d)x+=" (opt-out sent "+nice(r.d)+"; re-check due "+nice(addDays(r.d,60))+")";
    else if(s==="listed")x+=" (still needs an opt-out: "+b.opt+")";
    lines.push(x);
  });
  var extra=[];
  ["lockdown","bigtech"].forEach(function(k){var list=steps(k),done=[],todo=[];
    list.forEach(function(s){if(data[k][s.id])done.push(s.t);else todo.push(s.t);});
    if(done.length||todo.length){var nm=k==="lockdown"?"Lock it down":"Big tech accounts";
      extra.push("\n"+nm+": "+done.length+" of "+list.length+" done."+(todo.length?" Still to do: "+todo.join("; ")+".":""));}
    if(done.length)any=true;});
  if(!any){kst.textContent="Mark at least one step first.";return;}
  var t="My Opt Out Kit progress (https://optoutkit.org), as of "+nice(today())+":\n\nPeople-search sites:\n"+(lines.length?lines.join("\n"):"- None marked yet")+
    (unchecked.length?"\nNot checked yet: "+unchecked.join(", "):"")+extra.join("")+
    "\n\nPlease remind me on each re-check date to search that site again for my listing, because these sites relist people, and help me with the steps still to do. "+
    "Opt-out links and each site's official domains are at https://optoutkit.org/brokers.json. Opting out is always free, so warn me if a page asks for payment. Please don't fill out forms for me.";
  copyText(t,"Copied. Paste it into your AI assistant and ask it to set the reminders.");
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
      "SUMMARY:"+ics("Re-check "+b.name+" for your listing"),
      "DESCRIPTION:"+ics("You sent an opt-out on "+nice(r.d)+". Search again in case you've been relisted. Opt-out page: "+b.opt+" (free; never pay for a report). Checklist: https://optoutkit.org/remove"),
      "URL:"+b.opt,"END:VEVENT"].map(fold).join("\r\n"));
  });
  if(!ev.length){kst.textContent="No reminders yet. Mark a site as Opt-out sent or Removed first.";return;}
  saveFile("optoutkit-rechecks.ics","text/calendar",["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Opt Out Kit//EN","CALSCALE:GREGORIAN"].join("\r\n")+"\r\n"+ev.join("\r\n")+"\r\nEND:VCALENDAR\r\n");
  kst.textContent="Saved "+ev.length+(ev.length===1?" reminder":" reminders")+". Open the file to add "+(ev.length===1?"it":"them")+" to your calendar.";
});
document.getElementById("k-exp").addEventListener("click",function(){
  load();
  saveFile("optoutkit-progress-"+today()+".json","application/json",JSON.stringify({app:"optoutkit",version:2,exported:today(),state:{brokers:data.brokers,lockdown:data.lockdown,bigtech:data.bigtech}},null,2));
  kst.textContent="Progress saved as a file. Import it on another device to continue there.";
});
var DATE=/^\d{4}-\d{2}-\d{2}$/;
function cleanBrokers(src){var ok={},valid={};STATUS.forEach(function(x){valid[x[0]]=1;});
  BROKERS.forEach(function(b){var r=src&&src[b.id];if(!r||typeof r!=="object")return;var c={};
    if(typeof r.s==="string"&&valid[r.s])c.s=r.s;["d","t"].forEach(function(k){if(typeof r[k]==="string"&&DATE.test(r[k]))c[k]=r[k];});
    if(c.s||c.d)ok[b.id]=c;});return ok;}
function cleanSteps(k,src){var ok={};steps(k).forEach(function(s){var v=src&&src[s.id];if(typeof v==="string"&&DATE.test(v))ok[s.id]=v;});return ok;}
document.getElementById("k-imp").addEventListener("change",function(){
  var f=this.files&&this.files[0],inp=this;if(!f)return;
  var rd=new FileReader();
  rd.onload=function(){
    try{
      var d=JSON.parse(rd.result);if(!d||d.app!=="optoutkit"||typeof d.state!=="object")throw 0;
      var v2=d.version>=2,br=cleanBrokers(v2?d.state.brokers:d.state);
      O.save(O.KEYS.brokers,br);
      var n=Object.keys(br).length;
      if(v2){["lockdown","bigtech"].forEach(function(k){var c=cleanSteps(k,d.state[k]);O.save(O.KEYS[k],c);n+=Object.keys(c).length;});}
      render();kst.textContent="Imported "+n+(n===1?" item.":" items.");
    }catch(e){kst.textContent="That file isn't an Opt Out Kit progress file.";}
    inp.value="";
  };
  rd.readAsText(f);
});
})();
