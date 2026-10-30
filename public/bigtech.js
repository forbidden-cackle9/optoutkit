(function(){
"use strict";
/* Each step links to the company's own directions. Reviewed 2026-10-30. */
var CO=[
 {id:"google",name:"Google",intro:"Search, Gmail, Maps, YouTube and Android. Google also sees much of the wider web through its ads and analytics on other sites.",steps:[
  {id:"g-dl",t:"See what Google has",d:"Download a copy of everything in your account with Google Takeout. It can take hours to prepare.",u:"https://support.google.com/accounts/answer/3024190"},
  {id:"g-auto",t:"Auto-delete or pause your activity",d:"Set Web & App Activity and YouTube history to delete automatically after 3 months, or turn them off.",u:"https://support.google.com/accounts/answer/6139018"},
  {id:"g-old",t:"Delete past activity",d:"Erase searches, YouTube history and other activity already saved.",u:"https://support.google.com/accounts/answer/465"},
  {id:"g-loc",t:"Check your location Timeline",d:"Timeline is now stored on your phone. Confirm it's off, or set it to auto-delete.",u:"https://support.google.com/maps/answer/6258979"},
  {id:"g-ads",t:"Turn off personalized ads",d:"In My Ad Center, stop Google using your activity to target ads.",u:"https://support.google.com/My-Ad-Center-Help/answer/12156161"}]},
 {id:"amazon",name:"Amazon",intro:"Shopping, Alexa, Ring, Kindle and Prime Video. Your purchase history stays with your account.",steps:[
  {id:"a-dl",t:"Request your data",d:"Ask Amazon for a copy of the personal information it holds. It arrives by email, sometimes after several days.",u:"https://www.amazon.com/gp/help/customer/display.html?nodeId=TP1zlemejtTn6pwYKS"},
  {id:"a-alexa",t:"Auto-delete Alexa recordings",d:"Set voice recordings to delete automatically, and delete the ones already saved.",u:"https://www.amazon.com/gp/help/customer/display.html?nodeId=G68KUKTXN92WY3C3"},
  {id:"a-ads",t:"Opt out of interest-based ads",d:"Stop Amazon targeting ads on and off Amazon based on what you browse and buy.",u:"https://www.amazon.com/gp/help/customer/display.html?nodeId=GLVB9XDF9M8MU7UZ"}]},
 {id:"meta",name:"Meta",intro:"Facebook, Instagram, Messenger and WhatsApp. Meta also receives data from other apps and websites you use.",steps:[
  {id:"m-dl",t:"Download your information",d:"Get a copy of what Meta has stored from your Facebook and Instagram accounts.",u:"https://www.facebook.com/help/212802592074644"},
  {id:"m-off",t:"Disconnect activity from other sites",d:"Clear and stop the history other businesses send Meta about your visits and purchases.",u:"https://www.facebook.com/help/2207256696182627"},
  {id:"m-ads",t:"Review ad preferences",d:"Limit the data used to show you ads, in Accounts Center.",u:"https://accountscenter.facebook.com/ad_preferences"}]},
 {id:"microsoft",name:"Microsoft",intro:"Windows, Bing, Edge, Outlook and Xbox, all tied to your Microsoft account.",steps:[
  {id:"ms-dash",t:"View and clear your data",d:"Use the privacy dashboard to see and delete search, browsing and location history.",u:"https://support.microsoft.com/windows/03d3e27f-1981-5ff4-ba1c-d6b1031ae433"},
  {id:"ms-edge",t:"Stop Edge browsing data being used for ads",d:"Turn off the setting that personalizes ads from your Edge browsing.",u:"https://support.microsoft.com/help/4532583"}]},
 {id:"apple",name:"Apple",intro:"iPhone, iCloud and the App Store. Apple collects less for advertising than most, but the controls are still worth setting.",steps:[
  {id:"ap-dl",t:"Get a copy of your data",d:"Request your data, or deactivate or delete your account, at Apple's Data and Privacy site.",u:"https://support.apple.com/en-us/102283"},
  {id:"ap-ads",t:"Turn off personalized ads",d:"Stop Apple using your activity to target ads in the App Store, News and Stocks.",u:"https://support.apple.com/en-us/105131"},
  {id:"ap-track",t:"Stop apps tracking you",d:"Turn off “Allow apps to request to track” so other apps can't follow you across apps and websites.",u:"https://support.apple.com/en-us/102420"}]}
];
window.OOK_BIGTECH=CO;
var KEY="optoutkit-bigtech-v1",st={};
try{st=JSON.parse(localStorage.getItem(KEY)||"{}")||{};}catch(e){st={};}
function save(){try{localStorage.setItem(KEY,JSON.stringify(st));}catch(e){}}
function el(tag,attrs,text){var e=document.createElement(tag);for(var k in attrs)e.setAttribute(k,attrs[k]);if(text!=null)e.textContent=text;return e;}
function today(){var d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}
function nice(s){return new Date(s+"T00:00:00").toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"});}
var root=document.getElementById("companies");if(!root)return;
var total=0;
CO.forEach(function(c){
  var sec=el("section",{"aria-labelledby":"h-"+c.id});
  var head=el("div");head.appendChild(el("span",{"class":"label",id:"n-"+c.id},""));head.appendChild(el("h2",{id:"h-"+c.id},c.name));sec.appendChild(head);
  sec.appendChild(el("p",{"class":"muted"},c.intro));
  var ul=el("ul",{"class":"steps"});
  c.steps.forEach(function(s){total++;
    var li=el("li",{"class":"step",id:"s-"+s.id});
    var lab=el("label",{"class":"chk"});var cb=el("input",{type:"checkbox",id:"c-"+s.id});lab.appendChild(cb);lab.appendChild(el("span",{"class":"vh"},"Done: "+s.t));
    var body=el("div",{"class":"sbody"});body.appendChild(el("h3",{},s.t));body.appendChild(el("p",{"class":"small"},s.d));
    var row=el("div",{"class":"links"});row.appendChild(el("a",{href:s.u,target:"_blank",rel:"noopener noreferrer"},"Directions from "+c.name));body.appendChild(row);
    body.appendChild(el("span",{"class":"when",id:"w-"+s.id}));
    li.appendChild(lab);li.appendChild(body);ul.appendChild(li);
    cb.addEventListener("change",function(){if(cb.checked)st[s.id]=today();else delete st[s.id];save();render();});
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
  document.getElementById("bt-note").textContent="done · "+done+" of "+total+" steps";
  var f=document.getElementById("bt-fill");f.style.width=pct+"%";
  var tr=document.getElementById("bt-track");tr.setAttribute("aria-valuenow",pct);tr.setAttribute("aria-valuetext",pct+"% done");
}
render();
document.getElementById("bt-reset").addEventListener("click",function(){if(window.confirm("Clear all checkmarks on this page?")){st={};save();render();}});
})();
