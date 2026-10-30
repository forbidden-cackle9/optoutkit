(function(){
"use strict";
var KEY="optoutkit-v1";
var BROKERS=[
 {id:"beenverified",name:"BeenVerified",p:1,search:"",opt:"https://www.beenverified.com/app/optout/search",tip:"Also covers PeopleLooker and PeopleSmart. One opt-out per email address; confirm by the email link."},
 {id:"checkpeople",name:"CheckPeople",p:1,search:"",opt:"https://checkpeople.com/opt-out",tip:"Request your data first under Right to Know. The opt-out asks for birthdate and full legal name."},
 {id:"intelius",name:"Intelius / PeopleConnect",p:1,search:"",opt:"https://suppression.peopleconnect.us/login",tip:"Skip intelius.com, where searches are slow and end in a paid report. The opt-out page finds your record itself. One form covers Instant Checkmate, TruthFinder, US Search, ZabaSearch, Classmates and more."},
 {id:"mylife",name:"MyLife",p:1,search:"",opt:"https://www.mylife.com/privacyrequest",tip:"It may push you to make an account with ID. Emailing privacy@mylife.com with your profile link is an alternative."},
 {id:"nuwber",name:"Nuwber",p:1,search:"https://nuwber.com/",opt:"https://nuwber.com/removal/link",tip:"Filter by state to find your profile link, then paste it in the removal form. Skip the paid report."},
 {id:"smartbgc",name:"SmartBackgroundChecks",p:1,search:"",opt:"https://www.smartbackgroundchecks.com/optout",tip:"Usually removes you from PeopleFinders too."},
 {id:"spokeo",name:"Spokeo",p:1,search:"https://www.spokeo.com/search",opt:"https://www.spokeo.com/optout",tip:"Paste your profile link and email, then confirm by the email link."},
 {id:"thatsthem",name:"That's Them",p:1,search:"",opt:"https://thatsthem.com/optout",tip:"Ignore the identity-protection upsell links."},
 {id:"whitepages",name:"Whitepages",p:1,search:"https://www.whitepages.com/",opt:"https://www.whitepages.com/suppression_requests",tip:"Copy the link to your listing first, then paste it in the removal form. Verifies by phone call with a code. Also removes you from 411.com."},
 {id:"fastpeople",name:"FastPeopleSearch",p:1,search:"",opt:"https://www.fastpeoplesearch.com/optout",tip:"Expect a captcha. Ignore offers for full reports."},
 {id:"familytree",name:"FamilyTreeNow",p:1,search:"",opt:"https://www.familytreenow.com/optout",tip:""},
 {id:"usphonebook",name:"USPhoneBook",p:1,search:"",opt:"https://www.usphonebook.com/opt-out/",tip:"Search by your phone number. If the form hangs, email support+optout@usphonebook.com."},
 {id:"truepeople",name:"TruePeopleSearch",p:0,search:"",opt:"https://www.truepeoplesearch.com/removal",tip:"Several captchas."},
 {id:"cyberbgc",name:"Cyber Background Checks",p:0,search:"https://www.cyberbackgroundchecks.com/",opt:"https://www.cyberbackgroundchecks.com/removal",tip:"Copy the link to your listing first, then paste it in the removal form."},
 {id:"searchpeoplefree",name:"SearchPeopleFree",p:0,search:"",opt:"https://www.searchpeoplefree.com/opt-out",tip:"Search by name, phone, address and email separately."},
 {id:"peoplesearchnow",name:"PeopleSearchNow",p:0,search:"",opt:"https://www.peoplesearchnow.com/opt-out",tip:""},
 {id:"usapeople",name:"USA People Search",p:0,search:"",opt:"https://www.usa-people-search.com/removal",tip:""},
 {id:"acxiom",name:"Acxiom",p:0,search:"",opt:"https://www.acxiom.com/optout/",tip:"A marketing data broker with no public search. Opt out anyway."}
];
var STATUS=[["","Not checked"],["not-listed","Not listed"],["listed","Listed"],["sent","Opt-out sent"],["removed","Removed"]];
var state={};
function sel_label(v){for(var i=0;i<STATUS.length;i++)if(STATUS[i][0]===v)return "\u201c"+STATUS[i][1]+"\u201d";return "";}
var storageOK=true;
try{var raw=localStorage.getItem(KEY);if(raw)state=JSON.parse(raw)||{};}catch(e){storageOK=false;}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){storageOK=false;}
  if(!storageOK)document.getElementById("storenote").textContent="This browser isn't allowing the page to save, so your progress will be lost when you close it.";}
function today(){var d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}
function nice(s){var t=new Date(s+"T00:00:00");return isNaN(t)?s:t.toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"});}
function daysSince(s){if(!s)return 0;var t=Date.parse(s+"T00:00:00");return isNaN(t)?0:Math.floor((Date.now()-t)/864e5);}

var list=document.getElementById("brokers");
function el(tag,attrs,text){var e=document.createElement(tag);for(var k in attrs)e.setAttribute(k,attrs[k]);if(text!=null)e.textContent=text;return e;}
function link(href,text){return el("a",{href:href,target:"_blank",rel:"noopener noreferrer"},text);}

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

/* ---------- Password check (k-anonymity) ---------- */
var pw=document.getElementById("pw"),view=document.getElementById("hashview"),out=document.getElementById("pwresult");
function sha1hex(str){
  return crypto.subtle.digest("SHA-1",new TextEncoder().encode(str)).then(function(buf){
    return Array.from(new Uint8Array(buf)).map(function(x){return x.toString(16).padStart(2,"0");}).join("").toUpperCase();});
}
function showPrefix(prefix){
  view.textContent="";
  if(!prefix){view.appendChild(el("span",{"class":"sent"},"5BAA6"));view.appendChild(el("span",{"class":"kept"},"·".repeat(35)));view.appendChild(document.createTextNode(" "));view.appendChild(el("span",{"class":"muted small"},'(example: the word "password")'));return;}
  view.appendChild(el("span",{"class":"sent"},prefix));
  view.appendChild(el("span",{"class":"kept"},"·".repeat(35)));
  view.appendChild(document.createTextNode(" "));
  view.appendChild(el("span",{"class":"muted small"},"Only the highlighted 5 characters leave your device. The other 35 stay here."));
}
var seq=0;
pw.addEventListener("input",function(){
  out.hidden=true;var my=++seq;
  if(!pw.value){showPrefix("");return;}
  sha1hex(pw.value).then(function(h){if(my===seq)showPrefix(h.slice(0,5));});
});
/* Parse HIBP range response: lines of SUFFIX:COUNT */
function countFor(body,suffix){
  var lines=body.split(/\r?\n/);
  for(var i=0;i<lines.length;i++){var p=lines[i].split(":");if(p.length===2 && p[0].trim().toUpperCase()===suffix){return parseInt(p[1],10)||0;}}
  return 0;
}
window.__countFor=countFor;
function result(kind,title,body,linkHref,linkText){
  out.hidden=false;out.className="result "+kind;out.textContent="";
  out.appendChild(document.createTextNode(title));
  var p=el("p");p.textContent=body;
  if(linkHref){p.appendChild(document.createTextNode(" "));p.appendChild(link(linkHref,linkText));}
  out.appendChild(p);
}
document.getElementById("pwform").addEventListener("submit",function(ev){
  ev.preventDefault();
  if(!pw.value){result("warn","Type a password first.","");return;}
  var go=document.getElementById("pwgo");go.disabled=true;go.textContent="Checking…";
  sha1hex(pw.value).then(function(h){
    var prefix=h.slice(0,5),suffix=h.slice(5);
    return fetch("https://api.pwnedpasswords.com/range/"+prefix,{headers:{"Add-Padding":"true"},referrerPolicy:"no-referrer",credentials:"omit"})
      .then(function(r){if(!r.ok)throw new Error("HTTP "+r.status);return r.text();})
      .then(function(body){
        var n=countFor(body,suffix);
        if(n>0)result("bad","Found in "+n.toLocaleString()+" leaked passwords.","Stop using it anywhere. Attackers try leaked passwords first. A password manager makes unique passwords easy.");
        else result("ok","Not found in known breaches.","That's good, but not a guarantee. Use it on only one site.");
      });
  }).catch(function(){
    result("warn","Couldn't reach the breach database from here.","This preview blocks outside connections. Once the page is on its own website, the check runs here. For now, use Have I Been Pwned's own checker, which works the same private way:","https://haveibeenpwned.com/Passwords","Check on Have I Been Pwned");
  }).then(function(){go.disabled=false;go.textContent="Check";});
});
document.getElementById("pwclear").addEventListener("click",function(){pw.value="";seq++;showPrefix("");out.hidden=true;pw.focus();});
var showBtn=document.getElementById("pwshow");
showBtn.addEventListener("click",function(){var on=pw.type==="password";pw.type=on?"text":"password";showBtn.textContent=on?"Hide":"Show";showBtn.setAttribute("aria-pressed",String(on));});


/* ---------- Keep track: AI summary, calendar, export/import (all local) ---------- */
var kst=document.getElementById("k-status");
function addDays(s,n){var t=new Date(s+"T00:00:00");t.setDate(t.getDate()+n);return t.getFullYear()+"-"+String(t.getMonth()+1).padStart(2,"0")+"-"+String(t.getDate()).padStart(2,"0");}
function label(v){for(var i=0;i<STATUS.length;i++)if(STATUS[i][0]===v)return STATUS[i][1];return "Not checked";}
function copyText(t,msg){
  function fb(){var a=el("textarea");a.value=t;a.setAttribute("readonly","");a.className="vh";document.body.appendChild(a);a.select();var ok=false;try{ok=document.execCommand("copy");}catch(e){}document.body.removeChild(a);kst.textContent=ok?msg:"Your browser blocked copying. Try again, or use Export progress.";}
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(function(){kst.textContent=msg;},fb);else fb();
}
function save_file(name,type,text){
  var url=URL.createObjectURL(new Blob([text],{type:type})),a=el("a",{href:url,download:name});
  document.body.appendChild(a);a.click();document.body.removeChild(a);setTimeout(function(){URL.revokeObjectURL(url);},1000);
}
document.getElementById("k-ai").addEventListener("click",function(){
  var lines=[],unchecked=[],any=false;
  BROKERS.forEach(function(b){
    var r=state[b.id]||{},s=r.s||"";
    if(!s){unchecked.push(b.name);return;}
    any=true;var x="- "+b.name+": "+label(s);
    if((s==="sent"||s==="removed")&&r.d)x+=(s==="sent"?" on ":" (opt-out sent ")+nice(r.d)+(s==="sent"?"; re-check due ":"; re-check due ")+nice(addDays(r.d,60))+(s==="sent"?"":")");
    else if(s==="listed")x+=" (still needs an opt-out: "+b.opt+")";
    lines.push(x);
  });
  if(!any){kst.textContent="Mark at least one site first.";return;}
  var t="My Opt Out Kit progress (https://optoutkit.org), as of "+nice(today())+":\n"+lines.join("\n")+
    (unchecked.length?"\nNot checked yet: "+unchecked.join(", "):"")+
    "\n\nPlease remind me on each re-check date to search that site again for my listing, because these sites relist people. "+
    "Opt-out links and each site's official domains are at https://optoutkit.org/brokers.json. Opting out is always free, so warn me if a page asks for payment. Please don't fill out forms for me.";
  copyText(t,"Copied. Paste it into your AI assistant and ask it to set the reminders.");
});
function ics(s){return String(s).replace(/\\/g,"\\\\").replace(/;/g,"\;").replace(/,/g,"\\,").replace(/\n/g,"\\n");}
function fold(l){var out="";while(l.length>73){out+=l.slice(0,73)+"\r\n ";l=l.slice(73);}return out+l;}
document.getElementById("k-cal").addEventListener("click",function(){
  var ev=[],now=new Date().toISOString().replace(/[-:]/g,"").replace(/\.\d+/,""),tm=addDays(today(),1);
  BROKERS.forEach(function(b){
    var r=state[b.id]||{};
    if(!((r.s==="sent"||r.s==="removed")&&r.d))return;
    var due=addDays(r.d,60);if(due<tm)due=tm;
    var d=due.replace(/-/g,""),e=addDays(due,1).replace(/-/g,"");
    ev.push(["BEGIN:VEVENT","UID:"+b.id+"-"+r.d+"@optoutkit.org","DTSTAMP:"+now,"DTSTART;VALUE=DATE:"+d,"DTEND;VALUE=DATE:"+e,
      "SUMMARY:"+ics("Re-check "+b.name+" for your listing"),
      "DESCRIPTION:"+ics("You sent an opt-out on "+nice(r.d)+". Search again in case you've been relisted. Opt-out page: "+b.opt+" (free; never pay for a report). Checklist: https://optoutkit.org/"),
      "URL:"+b.opt,"END:VEVENT"].map(fold).join("\r\n"));
  });
  if(!ev.length){kst.textContent="No reminders yet. Mark a site as Opt-out sent or Removed first.";return;}
  save_file("optoutkit-rechecks.ics","text/calendar",["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Opt Out Kit//EN","CALSCALE:GREGORIAN"].join("\r\n")+"\r\n"+ev.join("\r\n")+"\r\nEND:VCALENDAR\r\n");
  kst.textContent="Saved "+ev.length+(ev.length===1?" reminder":" reminders")+". Open the file to add "+(ev.length===1?"it":"them")+" to your calendar.";
});
document.getElementById("k-exp").addEventListener("click",function(){
  save_file("optoutkit-progress-"+today()+".json","application/json",JSON.stringify({app:"optoutkit",version:1,exported:today(),state:state},null,2));
  kst.textContent="Progress saved as a file. Import it on another device to continue there.";
});
document.getElementById("k-imp").addEventListener("change",function(){
  var f=this.files&&this.files[0],inp=this;if(!f)return;
  var rd=new FileReader();
  rd.onload=function(){
    try{
      var d=JSON.parse(rd.result);if(!d||d.app!=="optoutkit"||typeof d.state!=="object")throw 0;
      var ok={},n=0,valid={};STATUS.forEach(function(x){valid[x[0]]=1;});
      BROKERS.forEach(function(b){var r=d.state[b.id];if(!r||typeof r!=="object")return;var c={};
        if(typeof r.s==="string"&&valid[r.s])c.s=r.s;["d","t"].forEach(function(k){if(typeof r[k]==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(r[k]))c[k]=r[k];});
        if(c.s||c.d){ok[b.id]=c;n++;}});
      state=ok;save();render();kst.textContent="Imported progress for "+n+(n===1?" site.":" sites.");
    }catch(e){kst.textContent="That file isn't an Opt Out Kit progress file.";}
    inp.value="";
  };
  rd.readAsText(f);
});

/* ---------- Removal request drafts (nothing stored or sent) ---------- */
var DR={mylife:{co:"MyLife",addr:"privacy@mylife.com"},usphonebook:{co:"USPhoneBook",addr:"support+optout@usphonebook.com"}};
function v(id){return document.getElementById(id).value.trim();}
function draft(){
  var to=v("dr-to"),type=v("dr-type"),co,addr;
  document.getElementById("dr-other-wrap").hidden=(to!=="other");
  if(to==="other"){co=v("dr-co")||"[Company name]";addr=v("dr-addr");}else{co=DR[to].co;addr=DR[to].addr;}
  document.getElementById("dr-state-wrap").hidden=(type!=="state");
  var name=v("dr-name")||"[Your full name]",place=v("dr-place"),lnk=v("dr-link");
  var who="Name: "+name+(place?"\nLocation: "+place:"")+(lnk?"\nListing: "+lnk:"");
  var subj,body;
  if(type==="optout"){
    subj="Opt-out request: please remove my listing";
    body="Hello,\n\nPlease remove my personal information from "+co+" and any affiliated sites, and suppress it so it isn't republished.\n\n"+who+"\n\nPlease confirm by reply when this is done.\n\nThank you,\n"+name;
  }else if(type==="ccpa"){
    subj="California Consumer Privacy Act request to delete personal information";
    body="Hello,\n\nI am a California resident. Under the California Consumer Privacy Act (Cal. Civ. Code § 1798.105), I request that "+co+" delete all personal information it holds about me, and direct any service providers and contractors to do the same.\n\n"+who+"\n\nPlease confirm the deletion in writing. The law requires a response within 45 days of receiving this request. If you need to verify my identity, contact me at this email address; please don't ask for more information than verification requires.\n\nThank you,\n"+name;
  }else if(type==="state"){
    var st=null;(window.OOK_STATES||[]).forEach(function(x){if(x.c===v("dr-state"))st=x;});
    var lawn=st?(/'s /.test(st.law)?st.law:"the "+st.law):"my state's consumer privacy law";
    subj="Request to delete my personal data";
    body="Hello,\n\nI am a resident of "+(st?st.n:"[your state]")+". Under "+lawn+", I request that "+co+" delete the personal data it holds about me, and that you confirm when this is done.\n\n"+who+"\n\nPlease respond within the time the law requires. If you need to verify my identity, contact me at this email address; please don't ask for more information than verification requires.\n\nThank you,\n"+name;
  }else{
    subj="Request for erasure of personal data (Article 17 GDPR)";
    body="Hello,\n\nUnder Article 17 of the General Data Protection Regulation (and the UK GDPR, where it applies), I request that "+co+" erase all personal data it holds about me without undue delay, and stop any further processing, including sale or sharing with third parties.\n\n"+who+"\n\nPlease confirm the erasure in writing within one month of receiving this request, as Article 12(3) requires. If you need to verify my identity, contact me at this email address.\n\nThank you,\n"+name;
  }
  document.getElementById("dr-out").value="Subject: "+subj+"\n\n"+body;
  var m=document.getElementById("dr-mail");
  if(addr){m.href="mailto:"+addr.replace(/[^A-Za-z0-9.+_@-]/g,"")+"?subject="+encodeURIComponent(subj)+"&body="+encodeURIComponent(body);m.removeAttribute("aria-disabled");}
  else{m.href="#";m.setAttribute("aria-disabled","true");}
  document.getElementById("dr-status").textContent="";
}
(function(){var sel=document.getElementById("dr-state"),t=today();
  (window.OOK_STATES||[]).forEach(function(x){if(x.law&&x.eff<=t&&x.c!=="CA"){var o=el("option",{value:x.c},x.n);sel.appendChild(o);}});})();
["dr-to","dr-type","dr-state","dr-co","dr-addr","dr-name","dr-place","dr-link"].forEach(function(id){var e=document.getElementById(id);e.addEventListener("input",draft);e.addEventListener("change",draft);});
document.getElementById("drform").addEventListener("submit",function(e){e.preventDefault();});
document.getElementById("dr-mail").addEventListener("click",function(e){if(this.getAttribute("aria-disabled")){e.preventDefault();document.getElementById("dr-status").textContent="Add the company's email address first.";}});
document.getElementById("dr-copy").addEventListener("click",function(){
  var t=document.getElementById("dr-out"),st=document.getElementById("dr-status");
  function ok(){st.textContent="Copied.";}
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t.value).then(ok,function(){t.select();st.textContent="Selected. Copy it with your device's copy command.";});}
  else{t.select();st.textContent="Selected. Copy it with your device's copy command.";}
});
draft();
/* Deep link from the rights page: /#draft-XX preselects a state-law request */
(function(){var m=/^#draft-([A-Z]{2})$/.exec(location.hash||"");if(!m)return;
  var t=document.getElementById("dr-type"),s=document.getElementById("dr-state");
  document.getElementById("dr-to").value="other";
  if(m[1]==="CA")t.value="ccpa";else{t.value="state";s.value=m[1];if(s.value!==m[1])t.value="optout";}
  draft();var sec=document.querySelector('section[aria-labelledby="dr-h"]');if(sec)sec.scrollIntoView();})();
})();
