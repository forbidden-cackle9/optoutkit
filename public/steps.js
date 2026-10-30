(function(){
"use strict";
var O=window.OOK,el=O.el,today=O.today,nice=O.nice,T=O.t;
var root=document.getElementById("companies");if(!root)return;
var set=root.getAttribute("data-set"),CO=window["OOK_"+set.toUpperCase()],KEY=O.KEYS[set];
var st=O.load(KEY),total=0;
CO.forEach(function(c){
  var cname=O.f(c,"name");
  var sec=el("section",{"aria-labelledby":"h-"+c.id});
  var head=el("div");head.appendChild(el("span",{"class":"label",id:"n-"+c.id},""));head.appendChild(el("h2",{id:"h-"+c.id},cname));sec.appendChild(head);
  sec.appendChild(el("p",{"class":"muted"},O.f(c,"intro")));
  var ul=el("ul",{"class":"steps"});
  c.steps.forEach(function(s){total++;
    var title=O.f(s,"t");
    var li=el("li",{"class":"step",id:"s-"+s.id});
    var lab=el("label",{"class":"chk"});var cb=el("input",{type:"checkbox",id:"c-"+s.id});lab.appendChild(cb);lab.appendChild(el("span",{"class":"vh"},T("Done: ","Hecho: ")+title));
    var body=el("div",{"class":"sbody"});body.appendChild(el("h3",{},title));body.appendChild(el("p",{"class":"small"},O.f(s,"d")));
    var row=el("div",{"class":"links"});
    var text=set==="bigtech"?T("Directions from "+cname,"Instrucciones de "+cname):T("Go to the official page","Ir a la página oficial");
    row.appendChild(O.link(O.f(s,"u"),text));
    if(O.lang==="es"&&!s.u_es)row.appendChild(el("span",{"class":"small muted"},"(en inglés)"));
    body.appendChild(row);
    body.appendChild(el("span",{"class":"when",id:"w-"+s.id}));
    li.appendChild(lab);li.appendChild(body);ul.appendChild(li);
    cb.addEventListener("change",function(){if(cb.checked)st[s.id]=today();else delete st[s.id];O.save(KEY,st);render();});
  });
  sec.appendChild(ul);root.appendChild(sec);
});
function render(){
  var done=0;
  CO.forEach(function(c){var n=0;c.steps.forEach(function(s){var d=st[s.id];document.getElementById("c-"+s.id).checked=!!d;
    var w=document.getElementById("w-"+s.id);w.textContent=d?T("Done on ","Hecho el ")+nice(d):"";w.hidden=!d;
    document.getElementById("s-"+s.id).classList.toggle("done",!!d);if(d){n++;done++;}});
    document.getElementById("n-"+c.id).textContent=T(n+" of "+c.steps.length+" done",n+" de "+c.steps.length+" hechos");});
  var pct=Math.round(done/total*100);
  document.getElementById("bt-pct").textContent=pct+"%";
  document.getElementById("bt-note").textContent=T("done · "+done+" of "+total+" steps","hecho · "+done+" de "+total+" pasos");
  document.getElementById("bt-fill").style.width=pct+"%";
  var tr=document.getElementById("bt-track");tr.setAttribute("aria-valuenow",pct);tr.setAttribute("aria-valuetext",pct+T("% done","% hecho"));
}
render();
document.getElementById("bt-reset").addEventListener("click",function(){if(window.confirm(T("Clear all checkmarks on this page?","¿Borrar todas las marcas de esta página?"))){st={};O.save(KEY,st);render();}});
})();
