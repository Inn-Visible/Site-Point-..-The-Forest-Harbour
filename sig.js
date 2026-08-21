(function(){
 var t='\u00a9 '+new Date().getFullYear()+' The Inn.Visible Foundation \u00b7 all rights reserved \u00b7 Know Thyself; Do No Harm; Hold The Truth.';
  var el=document.createElement('div'); el.textContent=t;
  var f=document.querySelector('footer');
  if(f){ el.style.cssText='margin-top:10px;font-size:10px;letter-spacing:.15em;color:#5c6875';
    f.appendChild(el); }
  else{ el.style.cssText='position:fixed;bottom:4px;left:10px;font:10px ui-monospace,Consolas,monospace;letter-spacing:.12em;color:#5c6875;opacity:.6;pointer-events:none;z-index:5';
    document.body.appendChild(el); }
})();
