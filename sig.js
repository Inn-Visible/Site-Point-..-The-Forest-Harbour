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

(function(){
  var SYN=29.530588853, EPOCH=Date.UTC(2000,0,6,18,14,0);
  var GL=['\ud83c\udf11','\ud83c\udf12','\ud83c\udf13','\ud83c\udf14','\ud83c\udf15','\ud83c\udf16','\ud83c\udf17','\ud83c\udf18'];
  var NM=['new moon','waxing crescent','first quarter','waxing gibbous','full moon','waning gibbous','last quarter','waning crescent'];
  var TIDES=[[11,21,'yule-tide','the long night turns'],[1,1,'imbolc-tide','first quickening'],[2,20,'ostara-tide','balance, then light'],[4,1,'beltane-tide','the green fire'],[5,21,'litha-tide','the tall sun'],[7,1,'lughnasadh-tide','first harvest'],[8,22,'mabon-tide','the second balance'],[10,1,'samhain-tide','the veil thins']];
  function moon(d){ var age=((d.getTime()-EPOCH)/86400000)%SYN; if(age<0)age+=SYN; return age; }
  function phase(age){
    var q=SYN/4;
    if(age<1.0||age>SYN-1.0) return 0;
    if(Math.abs(age-q)<1.0) return 2;
    if(Math.abs(age-2*q)<1.0) return 4;
    if(Math.abs(age-3*q)<1.0) return 6;
    return (age<q)?1:(age<2*q)?3:(age<3*q)?5:7;
  }
  function lit(age){ return Math.round((1-Math.cos(2*Math.PI*age/SYN))/2*100); }
  function tide(d){
    var cand=[];
    for(var yy=d.getFullYear()-1; yy<=d.getFullYear()+1; yy++){
      TIDES.forEach(function(t){ cand.push({dt:new Date(yy,t[0],t[1]), n:t[2], g:t[3]}); });
    }
    cand.sort(function(a,b){ return a.dt-b.dt; });
    var cur=cand[0], nxt=cand[1];
    for(var i=0;i<cand.length;i++){ if(cand[i].dt<=d){ cur=cand[i]; nxt=cand[i+1]||cand[0]; } }
    return {n:cur.n, g:cur.g, days:Math.max(0,Math.ceil((nxt.dt-d)/86400000))};
  }
  function isoweek(d){
    var t=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));
    var dn=(t.getUTCDay()+6)%7; t.setUTCDate(t.getUTCDate()-dn+3);
    var fy=new Date(Date.UTC(t.getUTCFullYear(),0,4));
    var fdn=(fy.getUTCDay()+6)%7; fy.setUTCDate(fy.getUTCDate()-fdn+3);
    return 1+Math.round((t-fy)/604800000);
  }
  function draw(){
    var box=document.getElementById('mooncal'); if(!box) return;
    var d=new Date(), age=moon(d), pi=phase(age), md=Math.floor(age)+1;
    var td=tide(d), wk=isoweek(d);
    var dots='';
    for(var i=1;i<=30;i++){
      var st=(i===md)?'background:#d9a83a;border-color:#d9a83a;box-shadow:0 0 8px rgba(217,168,58,.8)':((i<md)?'background:#5c6875;border-color:#5c6875':'');
      dots+='<i style="display:inline-block;width:5px;height:5px;margin:0 1px;border:1px solid #5c6875;border-radius:50%;vertical-align:middle;'+st+'"></i>';
    }
    box.innerHTML='<span style="font-size:13px;vertical-align:middle">'+GL[pi]+'</span> <b style="color:#93a1b0">'+NM[pi]+'</b> \u00b7 moon-day '+md+' \u00b7 '+lit(age)+'% lit \u00b7 <span style="color:#93a1b0">'+td.n+'</span> \u00b7 '+td.g+' \u00b7 '+td.days+' days to the turn \u00b7 week '+wk
      +'<div style="margin-top:6px">'+dots+'</div>';
  }
  function mount(){
    var od=document.getElementById('obsdeck');
    if(!od||document.getElementById('mooncal')) return;
    var box=document.createElement('div'); box.id='mooncal';
    box.style.cssText='padding:0 12px 14px;text-align:center;font-size:10px;letter-spacing:.12em;color:#5c6875';
    od.appendChild(box);
    draw();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',mount); else mount();
  setInterval(draw,60000);
})();
