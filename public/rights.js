(function(){
"use strict";
var S=window.OOK_STATES||[];
function $(id){return document.getElementById(id);}
function el(tag,attrs,text){var e=document.createElement(tag);for(var k in attrs)e.setAttribute(k,attrs[k]);if(text!=null)e.textContent=text;return e;}
function ext(href,text){return el("a",{href:href,target:"_blank",rel:"noopener noreferrer"},text);}
function today(){var d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}
function nice(s){var t=new Date(s+"T00:00:00");return t.toLocaleDateString(undefined,{month:"long",day:"numeric",year:"numeric"});}
function find(c){for(var i=0;i<S.length;i++)if(S[i].c===c)return S[i];return null;}
function lawName(st){return /'s /.test(st.law)?st.law:"the "+st.law;}

["st-pick","lt-state"].forEach(function(id){var sel=$(id);S.forEach(function(x){sel.appendChild(el("option",{value:x.c},x.n));});});
if(window.OOK_REVIEWED)$("reviewed").textContent=nice(window.OOK_REVIEWED);

/* ---------- Rights by state ---------- */
function p(parent,text){var e=el("p",{},text);parent.appendChild(e);return e;}
function showState(){
  var st=find($("st-pick").value),out=$("st-out");out.textContent="";
  if(!st){out.hidden=true;return;}
  out.hidden=false;
  var box=el("div",{"class":"stcard"});out.appendChild(box);
  var t=today();
  var live=!!st.law&&st.eff<=t;
  if(st.law&&live){
    box.appendChild(el("h3",{},st.law));
    p(box,"In effect since "+nice(st.eff)+".").className="muted";
    if(st.limited){
      p(box,"This law applies only to a small number of very large companies, so it doesn't cover most people-search sites. Use the opt-out links on the checklist, and consider asking your legislators for a broader law.");
    }else{
      p(box,"State privacy laws like this one generally let you ask a business to show you, correct and delete the personal data it holds about you, and to stop selling it or using it for targeted ads. Exactly which rights you get, and which companies must comply, varies by state.");
      p(box,"One important limit: most state laws exclude “publicly available” information such as government records, which many people-search sites rely on. So keep using the opt-out links on the checklist; a request under your state's law is a useful extra step, not a replacement.");
    }
    if(st.extra){var e=p(box,st.extra+" ");e.appendChild(ext(st.extraUrl,st.extraLabel));}
    else if(st.reg){p(box,st.n+" requires data brokers to register with the state, so its public registry is a good list of companies to send requests to.");}
    var ul=el("ul",{"class":"also"});box.appendChild(ul);
    if(!st.limited){
      var li=el("li");li.appendChild(el("strong",{},"Use it: "));
      li.appendChild(document.createTextNode("draft a deletion request citing "+lawName(st)+" with "));
      li.appendChild(el("a",{href:st.c==="CA"?"/#draft-CA":"/#draft-"+st.c},"the request tool"));li.appendChild(document.createTextNode("."));ul.appendChild(li);
    }
    var li2=el("li");li2.appendChild(el("strong",{},"If a company ignores you: "));
    if(st.agency){li2.appendChild(document.createTextNode("file a complaint with the "));li2.appendChild(ext(st.agencyUrl,st.agency));li2.appendChild(document.createTextNode(" or your "));}
    else li2.appendChild(document.createTextNode("contact your "));
    li2.appendChild(ext("https://www.naag.org/find-my-ag/","state attorney general"));li2.appendChild(document.createTextNode(", who enforces the law."));ul.appendChild(li2);
  }else{
    if(st.law){box.appendChild(el("h3",{},st.law));p(box,"Signed into law; takes effect "+nice(st.eff)+". Until then, "+st.n+" residents don't have these rights yet.").className="muted";}
    else box.appendChild(el("h3",{},st.n+" has no comprehensive privacy law yet"));
    p(box,"You can still use every opt-out on the checklist; most of those sites accept requests from anyone, wherever they live. You can also send any company the general opt-out draft from the request tool.");
    p(box,st.law?"Laws can be strengthened before they take effect, and residents' voices help. The letter below is a good place to start.":"Laws like this pass when residents ask for them. The letter below is a good place to start.");
    var ul2=el("ul",{"class":"also"});box.appendChild(ul2);
    var a=el("li");a.appendChild(el("strong",{},"Consumer complaints: "));a.appendChild(document.createTextNode("your "));a.appendChild(ext("https://www.naag.org/find-my-ag/","state attorney general"));a.appendChild(document.createTextNode(" handles consumer protection complaints."));ul2.appendChild(a);
  }
  if($("lt-state").value!==st.c){$("lt-state").value=st.c;letter();}
}
$("st-pick").addEventListener("change",showState);

/* ---------- Letter to representatives ---------- */
function v(id){return $(id).value.trim();}
function letter(){
  var to=v("lt-to"),st=find(v("lt-state")),name=v("lt-name")||"[Your name]",city=v("lt-city"),why=v("lt-why"),t=today();
  var where=(city?city+", ":"")+(st?st.n:"[your state]");
  var greet=to==="federal"?"Dear Senator or Representative,":"Dear Legislator,";
  var ask;
  if(to==="federal"){
    ask="I'm writing to ask you to support a national privacy law that gives every American the right to see and delete the personal data companies hold about them, including data brokers and people-search sites that publish home addresses, phone numbers and family members' names without consent. The law should include real enforcement, so these rights are more than words on paper.";
  }else if(st&&st.law&&!st.limited&&st.eff<=t){
    ask="Thank you for the privacy protections "+st.n+" already has under "+lawName(st)+". I'm writing to ask you to close the gaps that still leave residents exposed: make sure the law reaches data brokers and people-search sites, create a free one-step way to have every registered data broker delete your information, as California has done, and fund strong enforcement.";
  }else if(st&&st.law&&!st.limited){
    ask="Thank you for passing "+lawName(st)+", which takes effect "+nice(st.eff)+". I'm writing to ask you to make sure it delivers for residents: that it reaches data brokers and people-search sites, that there's a free one-step way to have every registered data broker delete your information, as California has done, and that enforcement is well funded.";
  }else{
    ask="I'm writing to ask you to support a comprehensive consumer privacy law for "+(st?st.n:"our state")+". Residents should have the right to see and delete the personal data companies hold about them, including data brokers and people-search sites that publish home addresses, phone numbers and family members' names without consent. A free, one-step way to have every data broker delete your information, like California's, would make that right practical.";
  }
  var body=greet+"\n\nI'm a constituent in "+where+". "+ask+(why?"\n\nThis matters to me personally: "+why:"")+
    "\n\nPrivacy shouldn't be a partisan issue, and it shouldn't require hours of opt-out forms to protect your own family. I'd appreciate knowing where you stand.\n\nSincerely,\n"+name+"\n"+where;
  $("lt-out").value=body;$("lt-status").textContent="";
}
["lt-to","lt-state","lt-name","lt-city","lt-why"].forEach(function(id){$(id).addEventListener("input",letter);$(id).addEventListener("change",letter);});
$("ltform").addEventListener("submit",function(e){e.preventDefault();});
$("lt-copy").addEventListener("click",function(){
  var ta=$("lt-out"),st=$("lt-status");
  function sel(){ta.select();st.textContent="Selected. Copy it with your device's copy command.";}
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(ta.value).then(function(){st.textContent="Copied. Paste it into an email or your representative's contact form.";},sel);else sel();
});
letter();
})();
