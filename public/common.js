/* Shared helpers for every page, including the English/Spanish switch. */
(function(){
"use strict";
function pad(n){return String(n).padStart(2,"0");}
var lang=(document.documentElement.lang||"en").slice(0,2)==="es"?"es":"en";
var O=window.OOK={
  lang:lang,
  /* t("English","Español") picks the text for the page language */
  t:function(en,es){return lang==="es"&&es!=null?es:en;},
  /* f(obj,"name") reads obj.name_es on Spanish pages when it exists */
  f:function(obj,key){return lang==="es"&&obj&&obj[key+"_es"]?obj[key+"_es"]:obj&&obj[key];},
  /* p("/remove") gives the same page in the current language */
  p:function(path){if(lang!=="es")return path;var h=path.indexOf("#"),base=h<0?path:path.slice(0,h),hash=h<0?"":path.slice(h);return (base==="/"?"/es/":"/es"+base)+hash;},
  el:function(tag,attrs,text){var e=document.createElement(tag);for(var k in attrs)e.setAttribute(k,attrs[k]);if(text!=null)e.textContent=text;return e;},
  link:function(href,text){return O.el("a",{href:href,target:"_blank",rel:"noopener noreferrer"},text);},
  today:function(){var d=new Date();return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());},
  nice:function(s,long){var t=new Date(s+"T00:00:00");return isNaN(t)?s:t.toLocaleDateString(lang==="es"?"es-US":undefined,{month:long?"long":"short",day:"numeric",year:"numeric"});},
  addDays:function(s,n){var t=new Date(s+"T00:00:00");t.setDate(t.getDate()+n);return t.getFullYear()+"-"+pad(t.getMonth()+1)+"-"+pad(t.getDate());},
  daysSince:function(s){if(!s)return 0;var t=Date.parse(s+"T00:00:00");return isNaN(t)?0:Math.floor((Date.now()-t)/864e5);},
  num:function(n){return Number(n).toLocaleString(lang==="es"?"es-US":"en-US");},
  KEYS:{brokers:"optoutkit-v1",lockdown:"optoutkit-lockdown-v1",bigtech:"optoutkit-bigtech-v1",lang:"optoutkit-lang"},
  ok:true,
  load:function(key){try{return JSON.parse(localStorage.getItem(key)||"{}")||{};}catch(e){O.ok=false;return {};}},
  save:function(key,obj){try{localStorage.setItem(key,JSON.stringify(obj));}catch(e){O.ok=false;}return O.ok;},
  copy:function(text,done,fail){
    function fb(){var a=O.el("textarea");a.value=text;a.setAttribute("readonly","");a.className="vh";document.body.appendChild(a);a.select();var ok=false;try{ok=document.execCommand("copy");}catch(e){}document.body.removeChild(a);(ok?done:fail)();}
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(text).then(done,fb);else fb();
  }
};

/* Remember a language the visitor picks, and offer Spanish once to Spanish-language browsers */
function remember(v){try{localStorage.setItem(O.KEYS.lang,v);}catch(e){}}
Array.prototype.forEach.call(document.querySelectorAll("a.lang"),function(a){a.addEventListener("click",function(){remember(a.getAttribute("hreflang"));});});
var pref=null;try{pref=localStorage.getItem(O.KEYS.lang);}catch(e){}
var browserEs=(navigator.languages||[navigator.language||""]).some(function(l){return /^es\b/i.test(l||"");});
var sw=document.querySelector("a.lang");
if(lang==="en"&&browserEs&&!pref&&sw){
  var bar=O.el("p",{"class":"langbar",lang:"es"});
  var go=O.el("a",{href:sw.getAttribute("href"),hreflang:"es"},"Ver esta página en español");
  go.addEventListener("click",function(){remember("es");});
  var x=O.el("button",{type:"button","class":"ghost small","aria-label":"No, thanks / No, gracias"},"No, gracias");
  x.addEventListener("click",function(){remember("en");bar.remove();});
  bar.appendChild(go);bar.appendChild(x);
  var hd=document.querySelector("header");if(hd)hd.insertBefore(bar,hd.firstChild);
}
})();
