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
    function legendHTML(md,pi,lpc,td,wk){
    return '<b style="color:#93a1b0">moon-day '+md+'.</b> the moon keeps a ~29\u00bd-day month, new moon to new moon. tonight is day '+md+' of it \u2014 day 1 is dark, day 15 or so is full.<br>'
      +'<b style="color:#93a1b0">'+NM[pi]+'.</b> the shape\u2019s name. waxing = growing toward full; waning = shrinking toward new. crescent = a sliver, quarter = half-lit, gibbous = more than half but not full.<br>'
      +'<b style="color:#93a1b0">'+lpc+'% lit.</b> how much of her face the sun is touching tonight.<br>'
      +'<b style="color:#93a1b0">'+td.n+'.</b> the year\u2019s wheel in eight marks: four sun-turns (two solstices, two equinoxes) and four old fire-fests between them. yule = midwinter, imbolc = spring\u2019s first stir, ostara = spring balance, beltane = summer\u2019s fire, litha = midsummer, lughnasadh = first harvest, mabon = autumn balance, samhain = winter\u2019s veil. the \u201ctide\u201d is the walking season between two marks.<br>'
      +'<b style="color:#93a1b0">'+td.days+' days to the turn.</b> the countdown to the next mark on the wheel.<br>'
      +'<b style="color:#93a1b0">week '+wk+'.</b> the year\u2019s numbered weeks, mondays first \u2014 the same count the rotas keeps.<br>'
      +'<b style="color:#93a1b0">the dots.</b> one per day of the moon\u2019s month: filled = lived, gold = tonight, hollow = still coming.';
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
        var lg=document.getElementById('moonlegend');
    if(lg) lg.innerHTML=legendHTML(md,pi,lit(age),td,wk);
  }
  function mount(){
    var od=document.getElementById('obsdeck');
    if(!od||document.getElementById('mooncal')) return;
    var box=document.createElement('div'); box.id='mooncal';
    box.style.cssText='padding:0 12px 14px;text-align:center;font-size:10px;letter-spacing:.12em;color:#5c6875';
    od.appendChild(box);
    var tg=document.createElement('button'); tg.id='moonwhy';
    tg.textContent='? the sky\u2019s tongue';
    tg.style.cssText='display:block;margin:8px auto 0;background:none;border:1px solid #223041;color:#5c6875;font:9px ui-monospace,Consolas,monospace;letter-spacing:.15em;padding:3px 10px;cursor:pointer';
    var lg=document.createElement('div'); lg.id='moonlegend';
    lg.style.cssText='display:none;margin:8px auto 0;max-width:600px;padding:10px 14px;border:1px dashed #223041;font-size:9.5px;line-height:1.9;color:#5c6875;text-align:left';
    lg.innerHTML='<b style="color:#93a1b0">moon-day 17.</b> the moon keeps a ~29\u00bd-day month, new moon to new moon. tonight is day 17 of it \u2014 day 1 is dark, day 15 or so is full.<br>'
      +'<b style="color:#93a1b0">waning gibbous.</b> the shape\u2019s name. waxing = growing toward full; waning = shrinking toward new. crescent = a sliver, quarter = half-lit, gibbous = more than half but not full.<br>'
      +'<b style="color:#93a1b0">97% lit.</b> how much of her face the sun is touching tonight.<br>'
      +'<b style="color:#93a1b0">mabon-tide.</b> the year\u2019s wheel in eight marks: four sun-turns (two solstices, two equinoxes) and four old fire-fests between them. yule = midwinter, imbolc = spring\u2019s first stir, ostara = spring balance, beltane = summer\u2019s fire, litha = midsummer, lughnasadh = first harvest, mabon = autumn balance, samhain = winter\u2019s veil. the \u201ctide\u201d is the walking season between two marks.<br>'
      +'<b style="color:#93a1b0">34 days to the turn.</b> the countdown to the next mark on the wheel.<br>'
      +'<b style="color:#93a1b0">week 40.</b> the year\u2019s numbered weeks, mondays first \u2014 the same count the rotas keeps.<br>'
      +'<b style="color:#93a1b0">the dots.</b> one per day of the moon\u2019s month: filled = lived, gold = tonight, hollow = still coming.';
    od.appendChild(tg); od.appendChild(lg);
    tg.onclick=function(){ var open=lg.style.display!=='none'; lg.style.display=open?'none':'block'; tg.textContent=open?'? the sky\u2019s tongue':'\u2715 close the tongue'; };
    draw();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',mount); else mount();
  setInterval(draw,60000);
})();

(function(){
  function keyed(){ return sessionStorage.getItem('hive_session')==='1' && !!localStorage.getItem('hive_access'); }
  var RES=['./core.html','./socials.json'];
  if(keyed() && localStorage.getItem('hive_resident_cache')!=='1' && 'caches' in window){
    caches.open('hive-core-v1').then(function(c){
      return Promise.all(RES.map(function(u){ return c.add(u).catch(function(){ return null; }); }));
    }).then(function(){ localStorage.setItem('hive_resident_cache','1'); }).catch(function(){});
  }
})();

(function(){
  function keyed(){ return sessionStorage.getItem('hive_session')==='1' && !!localStorage.getItem('hive_access'); }
  var SRC=[['hive_bench_baseline','baseline'],['hive_bench_axiom','axiom'],['hive_workbench','axiom'],['hive_rotas','keystone']];
  function bank(){
    if(!keyed()) return;
    var LOCAL=[]; try{ LOCAL=JSON.parse(localStorage.getItem('arc.local')||'[]'); }catch(e){}
    var n=0;
    SRC.forEach(function(s){
      var v=localStorage.getItem(s[0]); if(!v||!v.trim()) return;
      if(localStorage.getItem('hive_bank_last_'+s[0])===v) return;
      LOCAL.unshift({id:'bank-'+s[0]+'-'+Date.now(), pillar:s[1], date:new Date().toISOString().slice(0,10),
        title:'offline bank \u00b7 '+s[0].replace('hive_',''), body:v, tags:['auto-bank'], local:true});
      localStorage.setItem('hive_bank_last_'+s[0],v); n++;
    });
    if(n){ localStorage.setItem('arc.local',JSON.stringify(LOCAL)); localStorage.setItem('hive_offline_bank',String(Date.now())); }
    localStorage.setItem('hive_offline_since',String(Date.now()));
  }
  addEventListener('offline',bank);
  addEventListener('pagehide',bank);
  addEventListener('online',function(){ bank(); localStorage.removeItem('hive_offline_since'); });
})();

(function(){
  /* stranger arm · consumed once · burns on exit house-wide */
  try{
    if(localStorage.getItem('hive_stranger_arm')!=='1') return;
    localStorage.removeItem('hive_stranger_arm');
    sessionStorage.setItem('hive_glass','stranger');
    var last=Date.now();
    ['click','keydown','touchstart','pointermove'].forEach(function(ev){ addEventListener(ev,function(){ last=Date.now(); },{passive:true}); });
    function burn(){ try{
      localStorage.removeItem('hive_access'); sessionStorage.removeItem('hive_session'); sessionStorage.removeItem('hive_glass');
      ['hive_patron','hive_user','hive_member','hive_word','hive_pillar','hive_name','hive_tier'].forEach(function(k){ localStorage.removeItem(k); });
      localStorage.setItem('hive_burnbox','1');
    }catch(e){} }
    addEventListener('pagehide',burn);
    setInterval(function(){ if(Date.now()-last>600000){ burn(); location.reload(); } },30000);
  }catch(e){}
})();

(function(){
  /* autofill dampener · the house does not offer your words back to strangers */
  function damp(){
    var fs=document.querySelectorAll('form');
    for(var i=0;i<fs.length;i++) fs[i].setAttribute('autocomplete','off');
    var ps=document.querySelectorAll('input');
    for(var j=0;j<ps.length;j++){
      var el=ps[j], h=((el.placeholder||'')+' '+(el.id||'')+' '+(el.name||'')).toLowerCase();
      if(el.type==='password'){
        if(!el.getAttribute('data-ro')){
          el.setAttribute('data-ro','1'); el.setAttribute('readonly','readonly');
          setTimeout(function(){ el.removeAttribute('readonly'); },60);
          el.addEventListener('focus',function(){ this.removeAttribute('readonly'); },{once:true});
        }
        el.autocomplete='new-password';
      } else if(/name|alias|word|who|knock|title/.test(h)) el.autocomplete='off';
    }
  }
  damp(); setInterval(damp,1200);
})();

(function(){
  /* the dusk vignette · the house dims its own lights when the wire dies */
  var on=navigator.onLine;
  var v=document.createElement('div');
  v.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:997;opacity:0;transition:opacity .8s;background:radial-gradient(ellipse at 50% 60%, rgba(217,168,58,0.06), rgba(3,4,7,0.55) 75%)';
  document.body.appendChild(v);
  function paint(){ v.style.opacity=on?'0':'1'; }
  addEventListener('offline',function(){ on=false; paint(); });
  addEventListener('online',function(){ on=true; paint(); });
  paint();
})();

(function(){
  /* wind-glyphs house-wide · every arrow wears a winding (edge-match) */
  function glyph(dir){
    var d=dir>0?'M 9 23 A 11 11 0 1 1 23 9':'M 23 9 A 11 11 0 1 0 9 23';
    var h=dir>0?'M 23 9 l -6 -1.5 M 23 9 l -1.5 6':'M 9 23 l 6 1.5 M 9 23 l 1.5 -6';
    return '<svg viewBox="0 0 32 32" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="vertical-align:middle;margin:0 2px"><path d="'+d+'"/><path d="'+h+'"/></svg>';
  }
  function dirOf(ch){ return (ch==='\u2039'||ch==='\u2190'||ch==='\u2196'||ch==='\u2199')?-1:1; }
  function esc(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function scan(){
    var els=document.querySelectorAll('button,a,span');
    for(var i=0;i<els.length;i++){
      var el=els[i];
      if(el.getAttribute('data-wind')) continue;
      if(el.children.length) continue; /* text-only labels, never touch nested markup */
      var t=el.textContent||'';
      var lead=/^\s*([\u2039\u203a\u2190\u2192\u2196\u2197\u2198\u2199])/.exec(t);
      var trail=/([\u2039\u203a\u2190\u2192\u2196\u2197\u2198\u2199])\s*$/.exec(t);
      if(!lead&&!trail) continue;
      el.setAttribute('data-wind','1');
      var body=t, pre='', post='';
      if(lead){ pre=glyph(dirOf(lead[1])); body=body.slice(lead[0].length); }
      if(trail){ post=glyph(dirOf(trail[1])); body=body.slice(0,body.length-trail[0].length); }
      el.innerHTML=pre+esc(body.trim())+post;
    }
  }
  scan(); setInterval(scan,1500);
})();
