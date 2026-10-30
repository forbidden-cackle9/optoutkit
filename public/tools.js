(function(){
"use strict";
var O=window.OOK,el=O.el,link=O.link,today=O.today;
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
/* Deep link from the rights page: /tools#draft-XX preselects a state-law request */
(function(){var m=/^#draft-([A-Z]{2})$/.exec(location.hash||"");if(!m)return;
  var t=document.getElementById("dr-type"),s=document.getElementById("dr-state");
  document.getElementById("dr-to").value="other";
  if(m[1]==="CA")t.value="ccpa";else{t.value="state";s.value=m[1];if(s.value!==m[1])t.value="optout";}
  draft();var sec=document.querySelector('section[aria-labelledby="dr-h"]');if(sec)sec.scrollIntoView();})();
})();
