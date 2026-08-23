(function(){
  var year='\u00a9 '+new Date().getFullYear()+' The Inn.Visible Foundation \u00b7 all rights reserved';
  var gift='<a href="donations.html" style="color:#5c6875;text-decoration:none">the forge runs on gifts \u00b7 keep the fire lit \u2197</a>';
  var f=document.querySelector('footer');
  if(f){
    var a=document.createElement('div'); a.textContent=year;
    a.style.cssText='margin-top:10px;font-size:10px;letter-spacing:.15em;color:#5c6875';
    var b=document.createElement('div'); b.innerHTML=gift;
    b.style.cssText='margin-top:6px;font-size:10px;letter-spacing:.15em';
    f.appendChild(a); f.appendChild(b);
  } else {
    var c=document.createElement('div');
    c.innerHTML='<div>'+year+'</div><div style="margin-top:4px">'+gift+'</div>';
    c.style.cssText='position:fixed;bottom:4px;left:10px;font:10px ui-monospace,Consolas,monospace;letter-spacing:.12em;color:#5c6875;opacity:.65;z-index:5';
    document.body.appendChild(c);
  }
})();
