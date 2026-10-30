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
      li.appendChild(el("a",{href:"/tools#draft-"+st.c},"the request tool"));li.appendChild(document.createTextNode("."));ul.appendChild(li);
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
  breakdown(box,st.c);
  if($("lt-state").value!==st.c){$("lt-state").value=st.c;letter();}
}
$("st-pick").addEventListener("change",showState);

/* ---------- Scores, heat map and ranking ---------- */
var SC=window.OOK_SCORES||{criteria:[],scores:{}},CR=SC.criteria;
var MAXC=0,MAXG=0;CR.forEach(function(c){if(c.group==="Consumer")MAXC+=3*c.weight;else MAXG+=3*c.weight;});
function totals(code){var r=SC.scores[code];if(!r)return null;var c=0,g=0;
  CR.forEach(function(k,i){if(k.group==="Consumer")c+=r.s[i]*k.weight;else g+=r.s[i]*k.weight;});return {c:c,g:g,pct:MAXC?c/MAXC:0};}
var ORDER=S.map(function(x){return x.c;}).filter(function(c){return SC.scores[c];});
var RANK={};(function(){var t=ORDER.map(function(c){return [c,totals(c).c];}).sort(function(a,b){return b[1]-a[1];});
  t.forEach(function(x,i){RANK[x[0]]=(i>0&&x[1]===t[i-1][1])?RANK[t[i-1][0]]:i+1;});})();
function mix(a,b,t){var x=parseInt(a,16),y=parseInt(b,16);function ch(s){return [(s>>16)&255,(s>>8)&255,s&255];}
  var p=ch(x),q=ch(y);return "#"+p.map(function(v,i){return Math.round(v+(q[i]-v)*t).toString(16).padStart(2,"0");}).join("");}
function heat(f){f=Math.max(0,Math.min(1,f));return f<.5?mix("F4F1E8","E9C46A",f/.5):mix("E9C46A","2E9E5B",(f-.5)/.5);}
function heatPct(p){return heat(p/0.85);}
function inkOn(f){return f>0.7?"#ffffff":"#1d2a1f";}
var GRID={AK:[0,0],ME:[10,0],VT:[9,1],NH:[10,1],WA:[0,2],ID:[1,2],MT:[2,2],ND:[3,2],MN:[4,2],IL:[5,2],WI:[6,2],MI:[7,2],NY:[8,2],RI:[9,2],MA:[10,2],
 OR:[0,3],NV:[1,3],WY:[2,3],SD:[3,3],IA:[4,3],IN:[5,3],OH:[6,3],PA:[7,3],NJ:[8,3],CT:[9,3],
 CA:[0,4],UT:[1,4],CO:[2,4],NE:[3,4],MO:[4,4],KY:[5,4],WV:[6,4],VA:[7,4],MD:[8,4],DE:[9,4],
 AZ:[1,5],NM:[2,5],KS:[3,5],AR:[4,5],TN:[5,5],NC:[6,5],SC:[7,5],DC:[8,5],
 OK:[3,6],LA:[4,6],MS:[5,6],AL:[6,6],GA:[7,6],HI:[0,7],TX:[3,7],FL:[8,7],
 GU:[0,9],MP:[1,9],AS:[2,9],PR:[8,9],VI:[9,9]};
var NS="http://www.w3.org/2000/svg";
function sv(tag,attrs,text){var e=document.createElementNS(NS,tag);for(var k in attrs)e.setAttribute(k,attrs[k]);if(text!=null)e.textContent=text;return e;}
(function(){
  var T=40,svg=sv("svg",{viewBox:"0 0 440 400",role:"group","aria-label":"Map of states and territories colored by privacy protection"});
  svg.appendChild(sv("text",{x:0,y:8*T+26,"class":"cap"},"Territories"));
  ORDER.forEach(function(c){var g=GRID[c];if(!g)return;var t=totals(c),st=find(c),f=t.pct/0.85,fill=heat(f);
    var a=sv("g",{"class":"tile",tabindex:"0",role:"button","data-c":c,"aria-label":st.n+": consumer score "+t.c+" of "+MAXC+", rank "+RANK[c]});
    a.appendChild(sv("title",{},st.n+" — "+t.c+"/"+MAXC));
    a.appendChild(sv("rect",{x:g[0]*T+1,y:g[1]*T+1+(g[1]>=9?-8:0),width:T-2,height:T-2,rx:5,fill:fill}));
    a.appendChild(sv("text",{x:g[0]*T+T/2,y:g[1]*T+T/2+5+(g[1]>=9?-8:0),"text-anchor":"middle",fill:inkOn(f)},c));
    function go(){pick(c,true);}
    a.addEventListener("click",go);a.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();go();}});
    svg.appendChild(a);});
  $("map").appendChild(svg);
})();
function pick(c,scroll){$("st-pick").value=c;showState();if(scroll){var o=$("st-out");if(o.scrollIntoView)o.scrollIntoView({block:"nearest",behavior:"smooth"});}}
function breakdown(box,code){
  var t=totals(code),r=SC.scores[code];if(!t)return;
  var line=el("div",{"class":"scoreline"});
  var big=el("span",{"class":"big"},t.c+"/"+MAXC);line.appendChild(big);
  line.appendChild(el("span",{},"consumer score · rank "+RANK[code]+" of "+ORDER.length));
  line.appendChild(el("span",{"class":"muted"},"Government "+t.g+"/"+MAXG));
  box.appendChild(line);
  var bars=el("div",{"class":"bars"}),last="";
  CR.forEach(function(k,i){
    if(k.group!==last){bars.appendChild(el("div",{"class":"grp"},k.group==="Consumer"?"Protection from companies":"Protection from government"));last=k.group;}
    bars.appendChild(el("span",{},k.name+(k.weight>1?" (×"+k.weight+")":"")));
    var b=el("div",{"class":"bar","aria-hidden":"true"}),f=el("span");f.style.width=(r.s[i]/3*100)+"%";f.style.background=heat(r.s[i]/3);b.appendChild(f);bars.appendChild(b);
    bars.appendChild(el("span",{"aria-label":r.s[i]+" of 3"},String(r.s[i])));
  });
  box.appendChild(bars);
  if(r.note)p(box,r.note).className="small muted";
  var m=el("p",{"class":"small"});var a=el("a",{href:"#method"},"How we scored this");a.addEventListener("click",function(){$("method").open=true;});m.appendChild(a);box.appendChild(m);
  Array.prototype.forEach.call(document.querySelectorAll(".map .tile"),function(n){n.classList.toggle("on",n.getAttribute("data-c")===code);});
}
/* Ranking table */
var sortK="rank",sortDir=1;
function drawTable(){
  var tb=document.querySelector("#rank tbody");tb.textContent="";
  var list=ORDER.slice().sort(function(a,b){var x,y;
    if(sortK==="name"){x=find(a).n;y=find(b).n;return x<y?-sortDir:x>y?sortDir:0;}
    if(sortK==="gov"){x=totals(a).g;y=totals(b).g;}else if(sortK==="cons"){x=totals(a).c;y=totals(b).c;}else{x=RANK[a];y=RANK[b];}
    return (x-y)*sortDir||(RANK[a]-RANK[b]);});
  list.forEach(function(c){var t=totals(c),tr=el("tr",{tabindex:"0"});
    tr.appendChild(el("td",{},String(RANK[c])));tr.appendChild(el("td",{"class":"n"},find(c).n));
    var td=el("td"),ch=el("span",{"class":"chip-s"},t.c+"/"+MAXC);var f=t.pct/0.85;ch.style.background=heat(f);ch.style.color=inkOn(f);td.appendChild(ch);tr.appendChild(td);
    tr.appendChild(el("td",{},t.g+"/"+MAXG));
    function go(){pick(c,false);var s=document.querySelector('section[aria-labelledby="st-h"]');if(s.scrollIntoView)s.scrollIntoView({behavior:"smooth"});}
    tr.addEventListener("click",go);tr.addEventListener("keydown",function(e){if(e.key==="Enter"){go();}});
    tb.appendChild(tr);});
  Array.prototype.forEach.call(document.querySelectorAll("#rank th"),function(th){var k=th.firstChild.getAttribute("data-k");
    if(k===sortK)th.setAttribute("aria-sort",sortDir>0?"ascending":"descending");else th.removeAttribute("aria-sort");});
}
Array.prototype.forEach.call(document.querySelectorAll("#rank th button"),function(b){b.addEventListener("click",function(){
  var k=b.getAttribute("data-k");if(k===sortK)sortDir=-sortDir;else{sortK=k;sortDir=(k==="cons"||k==="gov")?-1:1;}drawTable();});});
drawTable();
(function(){var ul=$("crit-list");CR.forEach(function(k){var li=el("li");li.appendChild(el("strong",{},k.name+(k.weight>1?" (counts double)":"")+": "));
  li.appendChild(document.createTextNode(k.what+". "+k.guide+"."));ul.appendChild(li);});
  Array.prototype.forEach.call(document.querySelectorAll(".rev"),function(n){n.textContent=nice(SC.reviewed||window.OOK_REVIEWED);});})();


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
