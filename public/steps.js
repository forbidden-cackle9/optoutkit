(function(){
"use strict";
var O=window.OOK,el=O.el,today=O.today,nice=O.nice;
var root=document.getElementById("companies");if(!root)return;
var set=root.getAttribute("data-set"),CO=window["OOK_"+set.toUpperCase()],KEY=O.KEYS[set];
var st=O.load(KEY),total=0;
CO.forEach(function(c){
  var sec=el("section",{"aria-labelledby":"h-"+c.id});
  var head=el("div");head.appendChild(el("span",{"class":"label",id:"n-"+c.id},""));head.appendChild(el("h2",{id:"h-"+c.id},c.name));sec.appendChild(head);
  sec.appendChild(el("p",{"class":"muted"},c.intro));
  var ul=el("ul",{"class":"steps"});
  c.steps.forEach(function(s){total++;
    var li=el("li",{"class":"step",id:"s-"+s.id});
    var lab=el("label",{"class":"chk"});var cb=el("input",{type:"checkbox",id:"c-"+s.id});lab.appendChild(cb);lab.appendChild(el("span",{"class":"vh"},"Done: "+s.t));
    var body=el("div",{"class":"sbody"});body.appendChild(el("h3",{},s.t));body.appendChild(el("p",{"class":"small"},s.d));
    var row=el("div",{"class":"links"});row.appendChild(O.link(s.u,s.label||(set==="bigtech"?"Directions from "+c.name:"Go to the official page")));body.appendChild(row);
    body.appendChild(el("span",{"class":"when",id:"w-"+s.id}));
    li.appendChild(lab);li.appendChild(body);ul.appendChild(li);
    cb.addEventListener("change",function(){if(cb.checked)st[s.id]=today();else delete st[s.id];O.save(KEY,st);render();});
  });
  sec.appendChild(ul);root.appendChild(sec);
});
function render(){
  var done=0;
  CO.forEach(function(c){var n=0;c.steps.forEach(function(s){var d=st[s.id];document.getElementById("c-"+s.id).checked=!!d;
    var w=document.getElementById("w-"+s.id);w.textContent=d?"Done on "+nice(d):"";w.hidden=!d;
    document.getElementById("s-"+s.id).classList.toggle("done",!!d);if(d){n++;done++;}});
    document.getElementById("n-"+c.id).textContent=n+" of "+c.steps.length+" done";});
  var pct=Math.round(done/total*100);
  document.getElementById("bt-pct").textContent=pct+"%";
  document.getElementById("bt-note").textContent="done \u00b7 "+done+" of "+total+" steps";
  document.getElementById("bt-fill").style.width=pct+"%";
  var tr=document.getElementById("bt-track");tr.setAttribute("aria-valuenow",pct);tr.setAttribute("aria-valuetext",pct+"% done");
}
render();
document.getElementById("bt-reset").addEventListener("click",function(){if(window.confirm("Clear all checkmarks on this page?")){st={};O.save(KEY,st);render();}});
})();
