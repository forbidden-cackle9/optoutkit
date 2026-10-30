(function(){
"use strict";
var F=window.OOK_FUNDING;if(!F)return;
function el(tag,attrs,text){var e=document.createElement(tag);for(var k in attrs)e.setAttribute(k,attrs[k]);if(text!=null)e.textContent=text;return e;}
function money(n){return "$"+Math.round(n).toLocaleString("en-US");}
var L=F.links||{},links=[];
if(L.github)links.push(["GitHub Sponsors",L.github]);
if(L.kofi)links.push(["Ko-fi",L.kofi]);
if(!links.length)return; /* nothing to show until a support link is set */
var known=F.costs.every(function(c){return typeof c.amount==="number";});
var goal=known?F.costs.reduce(function(s,c){return s+c.amount;},0):0;
var got=Math.max(0,+F.received||0),funded=known&&goal>0&&got>=goal;
var today=new Date().toISOString().slice(0,10);
if(F.periodEnds&&today>F.periodEnds){funded=false;}
function bar(){var w=el("div",{"class":"fund-bar",role:"progressbar","aria-valuemin":"0","aria-valuemax":String(goal),"aria-valuenow":String(Math.min(got,goal)),"aria-label":"Running costs covered"});
  var f=el("span");f.style.width=Math.min(100,goal?got/goal*100:0)+"%";w.appendChild(f);return w;}
function linkRow(p){links.forEach(function(x,i){if(i)p.appendChild(document.createTextNode(" · "));p.appendChild(el("a",{href:x[1],target:"_blank",rel:"noopener noreferrer"},x[0]));});}

/* Footer line on every page */
Array.prototype.forEach.call(document.querySelectorAll(".support-slot"),function(slot){
  slot.textContent="";slot.hidden=false;
  if(funded){slot.appendChild(document.createTextNode("This year's running costs are covered. Thank you to everyone who chipped in! "));
    slot.appendChild(el("a",{href:"/faq#paid-for"},"How Opt Out Kit is paid for"));return;}
  slot.appendChild(document.createTextNode("Opt Out Kit is free and always will be. If it helped you, you can chip in to cover running costs: "));
  linkRow(slot);
  if(known&&goal){slot.appendChild(document.createTextNode(". "+money(got)+" of "+money(goal)+" covered. "));}
  else slot.appendChild(document.createTextNode(". "));
  slot.appendChild(el("a",{href:"/faq#paid-for"},"Details"));
  if(known&&goal)slot.appendChild(bar());
});

/* FAQ detail */
var box=document.getElementById("support-faq");
if(box){
  box.textContent="";
  var d=document.getElementById("paid-for");if(d){d.hidden=false;if(location.hash==="#paid-for")d.open=true;}
  box.appendChild(el("p",{},"Opt Out Kit is an independent project run by one person. It is not a registered nonprofit, so support isn't tax-deductible. It's free to use and always will be."));
  if(known){
    var t=el("table",{"class":"costs"}),tb=el("tbody");
    F.costs.forEach(function(c){var r=el("tr");r.appendChild(el("td",{},c.item));r.appendChild(el("td",{"class":"num"},money(c.amount)));tb.appendChild(r);});
    var r2=el("tr",{"class":"tot"});r2.appendChild(el("td",{},"Total for "+F.period));r2.appendChild(el("td",{"class":"num"},money(goal)));tb.appendChild(r2);
    t.appendChild(tb);box.appendChild(t);
    if(F.note)box.appendChild(el("p",{"class":"small muted"},F.note));
    var pr=el("p",{},money(got)+" of "+money(goal)+" received so far (updated "+new Date(F.updated+"T00:00:00").toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"})+")."); box.appendChild(pr);
    box.appendChild(bar());
  }
  box.appendChild(el("p",{},"We count only what actually arrives after payment fees, so the goal covers those fees too. Once costs are covered, we stop asking until the next period, and anything left over goes toward the following year's costs."));
  var p=el("p");
  if(funded)p.textContent="This period is covered, so support is closed for now. Thank you!";
  else{p.appendChild(document.createTextNode("If you'd like to help: "));linkRow(p);p.appendChild(document.createTextNode("."));}
  box.appendChild(p);
}
})();
