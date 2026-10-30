(function(){
"use strict";
var O=window.OOK,el=O.el,link=O.link,today=O.today,nice=O.nice,daysSince=O.daysSince;
var BROKERS=window.OOK_BROKERS,STATUS=window.OOK_STATUS,KEY=O.KEYS.brokers;
var state=O.load(KEY);
function sel_label(v){for(var i=0;i<STATUS.length;i++)if(STATUS[i][0]===v)return "\u201c"+STATUS[i][1]+"\u201d";return "";}
function save(){if(!O.save(KEY,state))document.getElementById("storenote").textContent="This browser isn't allowing the page to save, so your progress will be lost when you close it.";}
var list=document.getElementById("brokers");
BROKERS.forEach(function(b){
  var li=el("li",{"class":"broker",id:"b-"+b.id});
  var info=el("div",{"class":"info"});
  var h=el("h3");var nm=el("span",{"class":"name"},b.name);h.appendChild(nm);
  if(b.p){h.appendChild(el("span",{"class":"tag"},"Priority"));}
  info.appendChild(h);
  if(b.tip)info.appendChild(el("p",{"class":"small muted"},b.tip));
  var links=el("div",{"class":"links"});
  if(b.search)links.appendChild(link(b.search,"Find your profile"));
  links.appendChild(link(b.opt,"Opt out"));
  info.appendChild(links);
  var when=el("span",{"class":"when",id:"w-"+b.id});when.hidden=true;info.appendChild(when);
  var flag=el("span",{"class":"flag",id:"f-"+b.id});flag.hidden=true;info.appendChild(flag);
  var ctl=el("div",{"class":"ctl"});
  var sel=el("select",{id:"s-"+b.id,"aria-label":"Status for "+b.name});
  STATUS.forEach(function(s){var o=el("option",{value:s[0]},s[1]);sel.appendChild(o);});
  var date=el("input",{type:"date",id:"d-"+b.id,"aria-label":"Date opt-out sent for "+b.name});
  ctl.appendChild(sel);ctl.appendChild(date);
  li.appendChild(info);li.appendChild(ctl);list.appendChild(li);
  sel.addEventListener("change",function(){
    var r=state[b.id]||{};r.s=sel.value;r.t=today();
    if(sel.value==="sent" && !r.d){r.d=today();}
    state[b.id]=r;save();render();});
  date.addEventListener("change",function(){var r=state[b.id]||{};r.d=date.value;state[b.id]=r;save();render();});
});

function render(){
  var done=0,listed=0,sent=0,removed=0,recheck=0;
  BROKERS.forEach(function(b){
    var r=state[b.id]||{},s=r.s||"";
    var li=document.getElementById("b-"+b.id);
    li.className="broker"+(s?" st-"+s:"");
    document.getElementById("s-"+b.id).value=s;
    var d=document.getElementById("d-"+b.id);d.value=r.d||"";
    d.hidden=!(s==="sent"||s==="removed");
    var w=document.getElementById("w-"+b.id);
    if(s && r.t){w.hidden=false;w.textContent="Marked "+sel_label(s)+" on "+nice(r.t);}else w.hidden=true;
    var f=document.getElementById("f-"+b.id);
    var age=daysSince(r.d);
    if((s==="sent"||s==="removed") && age>60){f.hidden=false;f.textContent="Opt-out was "+age+" days ago. Search again to make sure you haven't been relisted.";recheck++;}
    else if(s==="listed"){f.hidden=false;f.textContent="You're listed here. Use the opt-out link, then set the status to Opt-out sent.";}
    else f.hidden=true;
    if(s && s!=="listed")done++;
    if(s==="listed")listed++;if(s==="sent")sent++;if(s==="removed")removed++;
  });
  var notl=0;BROKERS.forEach(function(b){if((state[b.id]||{}).s==="not-listed")notl++;});
  var N=BROKERS.length,pct=Math.round(done/N*100);
  document.getElementById("pct").textContent=pct+"%";
  document.getElementById("pctnote").textContent="done \u00b7 "+done+" of "+N+" sites handled"+(pct===100?". Nice work.":"");
  [["removed",removed],["sent",sent],["not",notl],["listed",listed]].forEach(function(x){document.getElementById("seg-"+x[0]).style.width=(x[1]/N*100)+"%";});
  var tr=document.getElementById("track");tr.setAttribute("aria-valuenow",pct);tr.setAttribute("aria-valuetext",pct+"% done");
  var c=document.getElementById("counts");c.textContent="";
  [["removed",removed+" removed"],["sent",sent+(sent===1?" opt-out":" opt-outs")+" pending"],["not",notl+" not listed"],["listed",listed+" listed, needing opt-out"]].forEach(function(x){
    var sp=el("span");sp.appendChild(el("span",{"class":"dot dot-"+x[0],"aria-hidden":"true"}));sp.appendChild(document.createTextNode(x[1]));c.appendChild(sp);});
  if(recheck)c.appendChild(el("span",{"class":"flag"},recheck+" due for re-check"));
}
render();

var reset=document.getElementById("reset"),ask=document.getElementById("resetask");
reset.addEventListener("click",function(){ask.hidden=false;reset.hidden=true;});
document.getElementById("resetno").addEventListener("click",function(){ask.hidden=true;reset.hidden=false;});
document.getElementById("resetyes").addEventListener("click",function(){state={};save();render();ask.hidden=true;reset.hidden=false;});
})();
