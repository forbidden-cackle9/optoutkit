/* Shared helpers for every page. */
(function(){
"use strict";
function pad(n){return String(n).padStart(2,"0");}
var O=window.OOK={
  el:function(tag,attrs,text){var e=document.createElement(tag);for(var k in attrs)e.setAttribute(k,attrs[k]);if(text!=null)e.textContent=text;return e;},
  link:function(href,text){return O.el("a",{href:href,target:"_blank",rel:"noopener noreferrer"},text);},
  today:function(){var d=new Date();return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());},
  nice:function(s){var t=new Date(s+"T00:00:00");return isNaN(t)?s:t.toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"});},
  addDays:function(s,n){var t=new Date(s+"T00:00:00");t.setDate(t.getDate()+n);return t.getFullYear()+"-"+pad(t.getMonth()+1)+"-"+pad(t.getDate());},
  daysSince:function(s){if(!s)return 0;var t=Date.parse(s+"T00:00:00");return isNaN(t)?0:Math.floor((Date.now()-t)/864e5);},
  KEYS:{brokers:"optoutkit-v1",lockdown:"optoutkit-lockdown-v1",bigtech:"optoutkit-bigtech-v1"},
  ok:true,
  load:function(key){try{return JSON.parse(localStorage.getItem(key)||"{}")||{};}catch(e){O.ok=false;return {};}},
  save:function(key,obj){try{localStorage.setItem(key,JSON.stringify(obj));}catch(e){O.ok=false;}return O.ok;}
};
})();
