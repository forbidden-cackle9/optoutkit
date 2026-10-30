(function(){
"use strict";
var O=window.OOK,T=O.t,el=O.el;
function $(id){return document.getElementById(id);}

/* Leave quickly: replace this page in history, so Back doesn't return here */
var EXIT="https://www.google.com/search?q="+encodeURIComponent(T("weather","clima"));
function leave(){try{document.body.textContent="";}catch(e){}location.replace(EXIT);}
Array.prototype.forEach.call(document.querySelectorAll(".exit"),function(b){b.addEventListener("click",function(e){e.preventDefault();leave();});});
document.addEventListener("keydown",function(e){if(e.key==="Escape")leave();});

/* Clear everything this site saved on this device */
var clr=$("clear"),ask=$("clearask"),done=$("cleardone");
if(clr){
  clr.addEventListener("click",function(){ask.hidden=false;clr.hidden=true;done.textContent="";});
  $("clearno").addEventListener("click",function(){ask.hidden=true;clr.hidden=false;});
  $("clearyes").addEventListener("click",function(){
    var n=0;try{Object.keys(O.KEYS).forEach(function(k){if(localStorage.getItem(O.KEYS[k])!==null){localStorage.removeItem(O.KEYS[k]);n++;}});}catch(e){}
    ask.hidden=true;clr.hidden=false;
    done.textContent=T("Done. Nothing from Opt Out Kit is saved on this device now. Your browser's history may still show you visited; see the tips above.","Listo. Ya no queda nada de Opt Out Kit guardado en este dispositivo. El historial del navegador puede seguir mostrando que lo visitó; vea los consejos de arriba.");
  });
}

/* Address confidentiality program finder */
var S=window.OOK_STATES||[],ACP=window.OOK_ACP||{},DIR=window.OOK_ACP_DIRECTORY;
var sel=$("acp-pick"),out=$("acp-out");
if(sel){
  S.forEach(function(x){sel.appendChild(el("option",{value:x.c},O.f(x,"n")));});
  sel.addEventListener("change",function(){
    var c=sel.value,st=null;S.forEach(function(x){if(x.c===c)st=x;});
    out.textContent="";if(!st){out.hidden=true;return;}
    out.hidden=false;
    var a=ACP[c],box=el("div",{"class":"stcard"}),n=O.f(st,"n");out.appendChild(box);
    function p(t){var e=el("p",{},t);box.appendChild(e);return e;}
    if(a&&a.n){
      box.appendChild(el("h3",{},n+": "+a.n));
      p(T("This program can give you a substitute address to use on government records, such as your driver's license and voter registration, so your real address stays out of the records data brokers copy.",
          "Este programa puede darle una dirección sustituta para usar en registros del gobierno, como su licencia de conducir y su inscripción para votar, para que su dirección real no aparezca en los registros que copian los corredores de datos."));
      p(T("Who qualifies and what it covers vary. Many programs ask you to apply with a victim advocate, who can also help with a safety plan.",
          "Quién puede inscribirse y qué cubre varían. Muchos programas piden que presente la solicitud con un defensor de víctimas, que también puede ayudarle con un plan de seguridad."));
      var q=el("p");box.appendChild(q);
      if(a.u)q.appendChild(O.link(a.u,T("Go to the official program page","Ir a la página oficial del programa")));
      else{q.appendChild(document.createTextNode(T("Find the contact details in the ","Busque los datos de contacto en el ")));q.appendChild(O.link(DIR,T("official directory of state programs","directorio oficial de programas estatales")));q.appendChild(document.createTextNode("."));}
      if(O.lang==="es")q.appendChild(el("span",{"class":"small muted"}," (puede estar solo en inglés)"));
    }else if(a&&a.none){
      box.appendChild(el("h3",{},T(n+" has no address confidentiality program",n+" no tiene un programa de confidencialidad de domicilio")));
      p(T("A local domestic violence program or the hotlines above can tell you what other protections are available, such as keeping your address off court records or a protective order.",
          "Un programa local contra la violencia doméstica o las líneas de ayuda de arriba pueden decirle qué otras protecciones existen, como mantener su dirección fuera de los expedientes judiciales o una orden de protección."));
      p(T("If you move to another state, its program may be able to help.","Si se muda a otro estado, el programa de ese estado podría ayudarle."));
    }else{
      box.appendChild(el("h3",{},n));
      p(T("We couldn't confirm a program here. Ask the hotlines above or a local victim services office what protections are available.",
          "No pudimos confirmar un programa aquí. Pregunte en las líneas de ayuda de arriba o en una oficina local de servicios a víctimas qué protecciones existen."));
    }
  });
}
})();
