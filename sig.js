(function(){
  /* ---- the october clock \u00b7 house-wide \u00b7 free-word guests only ---- */
  var OCT = new Date().getMonth() === 9;
  var freeWord = (localStorage.getItem('hive_word') || '').toLowerCase() === 'foxwolf7';
  if (!OCT && freeWord) {
    localStorage.removeItem('hive_access');
    sessionStorage.removeItem('hive_session');
  }
})();

(function(){
  var year='\u00a9 '+new Date().getFullYear()+' The Inn.Visible Foundation \u00b7 all rights reserved';
  var gift=' <a href="donations.html" style="color:#5c6875;text-decoration:none">the forge runs on gifts \u00b7 keep the fire lit \u2197</a> \u00b7 <a href="ferry.html" style="color:#5c6875;text-decoration:none">the ferry carries files between glasses \u26f4 \u2197</a>';
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
    var inner='<path d="M 9 23 A 11 11 0 1 1 23 9"/><path d="M 23 9 l -6 -1.5 M 23 9 l -1.5 6"/>';
    var body=dir>0? inner : '<g transform="translate(32,0) scale(-1,1)">'+inner+'</g>';
    var col=dir>0?'rgba(217,168,58,.9)':'rgba(63,127,193,.9)';
    return '<svg viewBox="0 0 32 32" width="11" height="11" fill="none" stroke="'+col+'" stroke-width="2.4" stroke-linecap="round" style="vertical-align:middle;margin:0 2px">'+body+'</svg>';
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

(function(){
  /* ---- the flock escort \u00b7 the welcome carries through the door ---- */
  if (sessionStorage.getItem('hive_egg') !== '1') return;
  sessionStorage.removeItem('hive_egg');
  function go(){
    var cl = document.querySelector('.cluster'); if (!cl) return;
    var grid = document.getElementById('introGrid');
    if (grid) { grid.style.opacity = '0'; grid.style.transition = 'opacity 1.1s ease'; setTimeout(function(){ grid.style.opacity = '1'; }, 250); }
    var B = 'M96,0 C78,-4 66,-6 54,-4 C40,-26 22,-38 4,-42 C14,-26 24,-14 38,-6 C20,-2 8,6 0,18 C16,10 30,6 44,6 C58,8 76,6 96,0 Z';
    for (var i = 0; i < 3; i++) {
      var s = document.createElement('span');
      s.style.cssText = 'position:fixed;left:' + (16 + i * 10) + '%;bottom:' + (28 + i * 7) + '%;z-index:66;pointer-events:none;opacity:.85;animation:eggglide 1.6s ease-in forwards;animation-delay:' + (i * 0.12) + 's';
      s.innerHTML = '<svg width="22" height="19" viewBox="0 -45 100 90"><path d="' + B + '" fill="#e8e4d8" stroke="#b070e8" stroke-width="6"/></svg>';
      document.body.appendChild(s);
      s.addEventListener('animationend', function(){ this.remove(); });
    }
    var st = document.createElement('style');
    st.textContent = '@keyframes eggglide{to{transform:translate(46vw,-46vh) scale(.55);opacity:0}}';
    document.head.appendChild(st);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();

(function(){
  /* ---- the gyro hand III \u00b7 one clean instrument: level, tape, equations ---- */
  var btn=document.getElementById('coastBtn'); if(!btn) return;
  var hasHud=!!document.getElementById('hud');
  document.addEventListener('click',function(){ try{ if(typeof DeviceOrientationEvent!=='undefined'&&DeviceOrientationEvent.requestPermission) DeviceOrientationEvent.requestPermission().then(function(){}).catch(function(){}); }catch(e){} },{once:true});
  var HOME={lat:43.9,lon:-79.0}, LAT=HOME.lat, LON=HOME.lon;
  if(navigator.geolocation) navigator.geolocation.getCurrentPosition(function(p){ LAT=p.coords.latitude; LON=p.coords.longitude; },function(){},{timeout:5000,maximumAge:600000});
  var beta=0,gamma=0,haveTilt=false,hT=0,hC=0,haveH=false;
  function onOri(e){
    if(e.beta!=null||e.gamma!=null){ beta=e.beta||0; gamma=e.gamma||0; haveTilt=true; }
    var h=null;
    if(typeof e.webkitCompassHeading==='number') h=e.webkitCompassHeading;
    else if(e.alpha!=null&&e.absolute) h=360-e.alpha;
    if(h!=null&&!isNaN(h)){ hT=h; haveH=true; }
  }
  if('ondeviceorientationabsolute' in window) addEventListener('deviceorientationabsolute',onOri,true);
  addEventListener('deviceorientation',onOri,true);
  var hud=hasHud?document.getElementById('hud'):null;
  if(!hud){
    hud=document.createElement('div'); hud.id='gyroHud';
    hud.style.cssText='position:fixed;left:50%;bottom:52px;transform:translateX(-50%);z-index:70;text-align:center;font:10px ui-monospace,Consolas,monospace;color:#5c6875;letter-spacing:.12em;pointer-events:none;display:none';
    hud.innerHTML='<canvas id="gtape" width="280" height="42" style="display:block;margin:0 auto"></canvas><div id="ghdg" style="color:#d9a83a;font-size:12px;margin-top:2px"></div>';
    document.body.appendChild(hud);
    var st0=document.createElement('style'); st0.textContent='body.coasting > #gyroHud{display:block!important}';
    document.head.appendChild(st0);
  }
  var panel=document.createElement('div');
  panel.style.cssText='margin-top:10px;display:flex;flex-direction:column;gap:8px;align-items:center;max-width:94vw';
  var lv=document.createElement('canvas'); lv.width=120; lv.height=92; lv.style.cssText='display:block;width:120px;height:92px';
  panel.appendChild(lv);
  var eq=document.createElement('div'); eq.style.cssText='font-size:9px;line-height:1.6;text-align:center';
  panel.appendChild(eq);
  hud.appendChild(panel);
  var mq=document.createElement('style');
  mq.textContent='@media(max-width:700px){#hud,#gyroHud{bottom:64px!important}#tape,#gtape{width:min(280px,92vw)!important;height:auto!important}#hud>div>div:last-child,#gyroHud>div>div:last-child{font-size:8px!important}}';
  document.head.appendChild(mq);
  var lg=lv.getContext('2d');
  var gt=document.getElementById('gtape'), gg=gt?gt.getContext('2d'):null, gh=document.getElementById('ghdg');
  var C16=['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
  function tape(h){
    gg.clearRect(0,0,280,42); gg.font='9px monospace'; gg.textAlign='center';
    var s0=Math.floor((h-64)/5)*5;
    for(var d0=s0;d0<=h+64;d0+=5){
      var x=140+(d0-h)*2.2, m=((Math.round(d0)%360)+360)%360;
      var len=m%45===0?10:m%15===0?7:4;
      gg.strokeStyle=m%45===0?'rgba(147,161,176,.9)':'rgba(92,104,117,.6)';
      gg.beginPath(); gg.moveTo(x,26); gg.lineTo(x,26-len); gg.stroke();
      if(m%45===0){ gg.fillStyle='#93a1b0'; gg.fillText(['N','NE','E','SE','S','SW','W','NW'][m/45],x,38); }
    }
    gg.strokeStyle='#d9a83a'; gg.beginPath(); gg.moveTo(140,4); gg.lineTo(140,26); gg.stroke();
    gg.fillStyle='#d9a83a'; gg.beginPath(); gg.moveTo(140,28); gg.lineTo(136,34); gg.lineTo(144,34); gg.closePath(); gg.fill();
  }
  function level(){
    lg.clearRect(0,0,lv.width,lv.height); /* the WHOLE frame, every frame \u2014 no ghosts */
    var cx=60,cy=40,R=32;
    if(!haveTilt){
      lg.strokeStyle='rgba(147,161,176,.55)'; lg.lineWidth=2;
      lg.beginPath(); lg.arc(cx,cy,R,0,7); lg.stroke();
      lg.fillStyle='#93a1b0'; lg.font='9px monospace'; lg.textAlign='center';
      lg.fillText('no gyro', cx, cy+R+12);
      return;
    }
    var flat=Math.abs(gamma)<3&&Math.abs(beta)<3;
    lg.strokeStyle=flat?'#d9a83a':'rgba(147,161,176,.9)'; lg.lineWidth=2;
    lg.beginPath(); lg.arc(cx,cy,R,0,7); lg.stroke();
    lg.strokeStyle=flat?'rgba(217,168,58,.6)':'rgba(147,161,176,.5)'; lg.lineWidth=1;
    lg.beginPath(); lg.arc(cx,cy,5,0,7); lg.stroke();
    lg.beginPath(); lg.moveTo(cx-R,cy); lg.lineTo(cx-R+7,cy); lg.moveTo(cx+R-7,cy); lg.lineTo(cx+R,cy);
    lg.moveTo(cx,cy-R); lg.lineTo(cx,cy-R+7); lg.moveTo(cx,cy+R-7); lg.lineTo(cx,cy+R); lg.stroke();
    var bx=cx+Math.max(-1,Math.min(1,gamma/30))*(R-9), by=cy+Math.max(-1,Math.min(1,beta/30))*(R-9);
    lg.fillStyle=flat?'#d9a83a':'#e8e4d8';
    lg.beginPath(); lg.arc(bx,by,6,0,7); lg.fill();
    lg.fillStyle=flat?'#d9a83a':'#93a1b0'; lg.font='9px monospace'; lg.textAlign='center';
    lg.fillText(flat?'level':Math.round(Math.max(Math.abs(gamma),Math.abs(beta)))+'\u00b0', cx, cy+R+12);
  }
  /* ---- equations \u00b7 all local \u00b7 clock + sensor only ---- */
  function rad(d){ return d*Math.PI/180; } function deg(r){ return r*180/Math.PI; }
  function lst(){ var d=Date.now()/86400000+2440587.5-2451545.0;
    return ((280.46061837+360.98564736629*d+LON)%360+360)%360; }
  function usdst(d){ var m=d.getMonth(), y=d.getFullYear(), dd=d.getDate();
    if(m>2&&m<10) return true; if(m<2||m>10) return false;
    if(m===2){ var s=1+((7-new Date(y,2,1).getDay())%7); return dd>=s+7; }
    return dd<1+((7-new Date(y,10,1).getDay())%7); }
  function sunEq(){ var d=new Date(), jan=new Date(d.getFullYear(),0,0);
    var N=Math.floor((d-jan)/86400000);
    var dec=-23.44*Math.cos(rad(360/365*(N+10)));
    var sol=d.getHours()+d.getMinutes()/60+d.getSeconds()/3600-(usdst(d)?1:0)+(LON+75)/15;
    var HA=rad((sol-12)*15), la=rad(LAT), de=rad(dec);
    var alt=deg(Math.asin(Math.sin(la)*Math.sin(de)+Math.cos(la)*Math.cos(de)*Math.cos(HA)));
    var az=(deg(Math.atan2(Math.sin(HA), Math.cos(HA)*Math.sin(la)-Math.tan(de)*Math.cos(la))+180)+360)%360;
    return {alt:alt,az:az}; }
  var SYN=29.530588853, EPOCH=Date.UTC(2000,0,6,18,14,0);
  var NM=['new','waxing crescent','first quarter','waxing gibbous','full','waning gibbous','last quarter','waning crescent'];
  function moonEq(){ var age=((Date.now()-EPOCH)/86400000)%SYN; if(age<0) age+=SYN;
    return {age:age, name:NM[Math.floor((age/SYN)*8+0.5)%8]}; }
  function houseCC(){ var doy=Math.floor((Date.now()-new Date(new Date().getFullYear(),0,0))/864e5);
    return Math.max(0,Math.min(100,Math.round(38+26*Math.sin(doy/5.3)+12*Math.sin(doy/1.7)))); }
  function seedCC(){ if(!navigator.onLine){ try{ localStorage.setItem('hive_wx_cc',String(houseCC())); }catch(e){} } }
  seedCC(); setInterval(seedCC,600000);
  /* ---- loop \u00b7 parallax only touches oversized skies (no jutting edges) ---- */
  var SK=null;
  setTimeout(function(){ SK=[]; var cs=document.querySelectorAll('body > canvas');
    for(var i=0;i<cs.length;i++){ var s=cs[i].style;
      if(s.position==='fixed'&&s.zIndex==='-1'&&cs[i].width>innerWidth+8&&cs[i].id!=='skycloud') SK.push(cs[i]); } },800);
  var lastEq=0;
  function loop(now){
    var on=document.body.classList.contains('coasting');
    if(haveH){ var d=((hT-hC+540)%360)-180; hC=(hC+d*0.12+360)%360; }
    if(!hasHud&&on&&gg){
      if(haveH){ tape(hC); gh.textContent=Math.round(hC)%360+'\u00b0 \u00b7 '+C16[Math.round(hC/22.5)%16]; }
      else { gg.clearRect(0,0,280,42); gg.fillStyle='#5c6875'; gg.font='9px monospace'; gg.textAlign='center'; gg.fillText('north is up \u00b7 no sensor on this glass',140,24); gh.textContent=''; }
    }
    if(on) level();
    if(on&&now-lastEq>500){ lastEq=now;
      var s=sunEq(), m=moonEq(), L=lst();
      var lh=Math.floor(L/15), lm=Math.floor((L/15-lh)*60);
      var dc=new Date(), pp=function(n){ return String(n).padStart(2,'0'); };
      eq.innerHTML='t '+pp(dc.getHours())+':'+pp(dc.getMinutes())+':'+pp(dc.getSeconds())+' \u00b7 lst '+lh+'h'+String(lm).padStart(2,'0')+' \u00b7 sun '+(s.alt>=0?'+':'')+Math.round(s.alt)+'\u00b0/'+Math.round(s.az)+'\u00b0 \u00b7 moon day '+Math.floor(m.age)+' \u00b7 '+m.name
        +'<br><span style="color:'+(navigator.onLine?'#58a36a':'#d9a83a')+'">\u25cf</span> '+(navigator.onLine?'wire idle':'no wire')+' \u00b7 clock+sensor only \u00b7 the sky needs no wire';
    }
    if(on&&haveTilt&&SK){ var tx=Math.max(-8,Math.min(8,gamma*0.25)), ty=Math.max(-8,Math.min(8,beta*0.25));
      for(var i=0;i<SK.length;i++){ try{ SK[i].style.translate=tx.toFixed(1)+'px '+ty.toFixed(1)+'px'; }catch(e){} } }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();


(function(){
/* ---- the chibi radio \u00b7 the dial's own voice, carried house-wide \u00b7 v2 ---- */
var KEY='hive_radio';
var onBase=/baseline\.html(\?|#|$)/.test(location.href);
function keyed(){ return sessionStorage.getItem('hive_session')==='1' && !!localStorage.getItem('hive_access'); }
var NOCHIBI=['index.html','kit.html','donations.html','wicket.html']; /* the four logged-out faces · edit names here if the house calls them otherwise */
var pg=(location.pathname.split('/').pop()||'');
if(!keyed() || NOCHIBI.indexOf(pg)>-1){ return; } /* no chibi, no hooks, no hum · the block ends here, silently */
  function st(){ try{ return JSON.parse(sessionStorage.getItem(KEY))||null; }catch(e){ return null; } }
function set(s){ try{ sessionStorage.setItem(KEY,JSON.stringify(s)); }catch(e){} }
function hostName(src){ try{ var h=(new URL(src)).hostname.replace(/^www\./,'');
  if(/somafm/.test(h)) return 'somafm'; if(/radioparadise/.test(h)) return 'radio paradise';
  if(/fip|radiofrance/.test(h)) return 'fip'; return h; }catch(e){ return 'stream'; } }
var medias=[], pendingTitle='';
function attach(a){
  a.addEventListener('play',function(){ var s=st()||{}; s.src=a.currentSrc||a.src||s.src; s.on=true; s.vol=a.volume;
    if(onBase&&pendingTitle) s.title=pendingTitle; if(!s.title&&s.src) s.title=hostName(s.src); set(s); paint(); });
  a.addEventListener('pause',function(){ var s=st()||{}; s.on=false; set(s); paint(); });
  a.addEventListener('ended',function(){ var s=st()||{}; s.on=false; set(s); paint(); });
  a.addEventListener('volumechange',function(){ var s=st()||{}; s.vol=a.volume; set(s); }); }
function reg(a){ if(a&&medias.indexOf(a)<0){ medias.push(a); attach(a); } }
try{
  var OP=HTMLMediaElement.prototype.play, OZ=HTMLMediaElement.prototype.pause;
  HTMLMediaElement.prototype.play=function(){ reg(this); return OP.apply(this,arguments); };
  HTMLMediaElement.prototype.pause=function(){ reg(this); return OZ.apply(this,arguments); };
  var OA=window.Audio; window.Audio=function(src){ var a=src?new OA(src):new OA(); reg(a); return a; };
  window.Audio.prototype=OA.prototype;
  var ODC=document.createElement.bind(document);
  document.createElement=function(t){ var el=ODC(String(t)); if(String(t).toLowerCase()==='audio') reg(el); return el; };
}catch(e){}
function activeMedia(){ for(var i=medias.length-1;i>=0;i--){ if(!medias[i].paused) return medias[i]; }
  return medias.length?medias[medias.length-1]:null; }
if(onBase){
  document.addEventListener('click',function(e){
    var t=e.target, b=t&&t.closest? t.closest('button'):null;
    if(b){ var tx=(b.textContent||'').trim(); if(tx&&tx.length<40) pendingTitle=tx; } },true);
  addEventListener('pagehide',function(){ var m=activeMedia(); if(m&&!m.paused){ var s=st()||{}; s.on=true; s.src=m.currentSrc||m.src; set(s); } });
}
var au=null;
function ensure(){ if(au) return au; au=new Audio(); au.preload='none';
  au.addEventListener('error',function(){ var s=st()||{}; s.on=false; set(s); paint(); msg('the stream went dark'); });
  return au; }
var wrap=document.createElement('div'); wrap.id='chibiRadio';
wrap.style.cssText='position:fixed;right:14px;bottom:14px;z-index:80;cursor:pointer;user-select:none;text-align:center';
wrap.innerHTML='<svg width="40" height="40" viewBox="0 0 40 40" style="display:block;filter:drop-shadow(0 2px 5px rgba(0,0,0,.55))">'
 +'<line x1="29" y1="9" x2="35" y2="3" stroke="#93a1b0" stroke-width="1.6"/>'
 +'<rect x="4" y="9" width="32" height="24" rx="5" fill="#10161f" stroke="#3f7fc1" stroke-width="1.6"/>'
 +'<circle id="chibiLamp" cx="10.5" cy="15" r="2.1" fill="#5c6875"/>'
 +'<circle cx="27" cy="21" r="6" fill="#0a0d12" stroke="#d9a83a" stroke-width="1.4"/>'
 +'<line id="chibiNeedle" x1="27" y1="21" x2="30.5" y2="17.5" stroke="#d9a83a" stroke-width="1.4"/>'
 +'<g stroke="#223041" stroke-width="1.4"><line x1="9" y1="21" x2="18" y2="21"/><line x1="9" y1="24.5" x2="18" y2="24.5"/><line x1="9" y1="28" x2="18" y2="28"/></g></svg>'
 +'<div id="chibiTag" style="font:8.5px ui-monospace,Consolas,monospace;letter-spacing:.1em;color:#5c6875;margin-top:2px;max-width:92px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis"></div>';
document.body.appendChild(wrap);
var stx=document.createElement('style');
stx.textContent='#chibiRadio svg *{transform-origin:center;transform-box:fill-box}'
 +'#chibiRadio.on #chibiLamp{fill:#d9a83a;filter:drop-shadow(0 0 4px rgba(217,168,58,.9))}'
 +'#chibiRadio.on #chibiNeedle{animation:chibiSway 2.4s infinite alternate}'
 +'@keyframes chibiSway{from{transform:rotate(-14deg)}to{transform:rotate(18deg)}}';
document.head.appendChild(stx);
function playing(){ if(onBase){ var m=activeMedia(); if(m) return !m.paused; }
  if(!onBase&&au) return !au.paused; return !!(st()&&st().on); }
function msg(t){ var g=wrap.querySelector('#chibiTag'); if(g){ g.textContent=t; setTimeout(paint,2200); } }
function paint(){ var s=st(), on=playing();
  wrap.classList.toggle('on',on);
  var g=wrap.querySelector('#chibiTag'); if(!g) return;
  g.textContent = on? '\u266b '+((s&&s.title)||'the dial')
    : (onBase? 'dial \u00b7 dark' : (s&&s.src? '\u2016 '+((s&&s.title)||'the dial') : 'radio \u00b7 quiet'));
  wrap.title = on? 'tap \u00b7 tune out' : (s&&s.src? 'tap \u00b7 keep listening' : 'the radio lives in baseline'); }
function pulse(){ wrap.style.transform='scale(.94)'; setTimeout(function(){ wrap.style.transform=''; },180); }
wrap.addEventListener('click',function(){
  if(onBase){ var m=activeMedia();
    if(m){ if(m.paused){ m.play().catch(function(){}); } else { m.pause(); } return; }
    pulse(); msg('press PWR \u00b7 the dial is yours'); return; }
  var s=st();
  if(!s||!s.src){ pulse(); msg('the radio lives in baseline'); return; }
  var a=ensure();
  if(!a.paused){ a.pause(); return; }
  if(a.getAttribute('data-src')!==s.src){ a.src=s.src; a.setAttribute('data-src',s.src); }
  if(typeof s.vol==='number'){ try{ a.volume=s.vol; }catch(e){} }
  a.play().catch(function(){ msg('the stream refused \u00b7 tap again'); }); });
addEventListener('pagehide',function(){ if(!onBase&&au&&!au.paused){ var s=st()||{}; s.on=true; set(s); } });
function dodge(){
  var r=wrap.getBoundingClientRect(), hit=null;
  var cands=[document.getElementById('coastBtn'),document.getElementById('hud'),document.getElementById('gyroHud')];
  for(var i=0;i<cands.length;i++){ var el=cands[i]; if(!el) continue;
    var cs=getComputedStyle(el); if(cs.display==='none'||cs.visibility==='hidden') continue;
    var b=el.getBoundingClientRect(); if(!b.width&&!b.height) continue;
    if(r.left<b.right&&r.right>b.left&&r.top<b.bottom&&r.bottom>b.top){ hit=b; break; } }
  if(hit){ wrap.style.bottom=Math.max(14, innerHeight-hit.top+10)+'px'; }
  else { wrap.style.bottom='14px'; }
}
setInterval(dodge,1500); addEventListener('resize',dodge); setTimeout(dodge,600);
  setInterval(paint,1500); paint();
})();

(function(){
/* ---- the chibi perch v2 \u00b7 drag that works on glass \u00b7 own spot on core \u00b7 no more jumping ---- */
var KEY='hive_chibi_pos';
var PERCH={ 'core.html':{top:'64px',right:'14px'}, 'index.html':{top:'64px',right:'14px'} };
function saved(){ try{ return JSON.parse(localStorage.getItem(KEY))||null; }catch(e){ return null; } }
function place(w,p){
  var bw=w.offsetWidth||46, bh=w.offsetHeight||64;
  w.style.left=Math.max(4,Math.min(innerWidth-bw-4,p.x))+'px';
  w.style.top=Math.max(4,Math.min(innerHeight-bh-4,p.y))+'px';
  w.style.right='auto'; w.style.bottom='auto';
}
function perch(w){
  var pg=(location.pathname.split('/').pop()||'');
  var p=PERCH[pg]||{bottom:'14px',right:'14px'};
  w.style.top=p.top||'auto'; w.style.bottom=p.bottom||'auto';
  w.style.left=p.left||'auto'; w.style.right=p.right||'auto';
}
function init(){
  var w=document.getElementById('chibiRadio'); if(!w||w.getAttribute('data-drag')) return;
  w.setAttribute('data-drag','1');
  w.style.touchAction='none';
  w.style.padding='6px';
  var s=saved(); if(s) place(w,s); else perch(w);
  var userPlaced=!!s, sx=0, sy=0, ox=0, oy=0, dragging=false, moved=false;
  w.addEventListener('pointerdown',function(e){
    dragging=true; moved=false; sx=e.clientX; sy=e.clientY;
    var r=w.getBoundingClientRect(); ox=r.left; oy=r.top;
    try{ w.setPointerCapture(e.pointerId); }catch(err){} },true);
  w.addEventListener('pointermove',function(e){
    if(!dragging) return;
    var dx=e.clientX-sx, dy=e.clientY-sy;
    if(!moved&&Math.hypot(dx,dy)<8) return;
    if(!moved){ moved=true; w.style.cursor='grabbing'; }
    e.preventDefault();
    place(w,{x:ox+dx,y:oy+dy}); },{capture:true,passive:false});
  function endDrag(){
    if(!dragging) return; dragging=false; w.style.cursor='';
    if(moved){ userPlaced=true;
      var r=w.getBoundingClientRect();
      try{ localStorage.setItem(KEY,JSON.stringify({x:r.left,y:r.top})); }catch(e){}
      window.__chibiJustDragged=Date.now(); } }
  w.addEventListener('pointerup',endDrag,true);
  w.addEventListener('pointercancel',endDrag,true);
  addEventListener('click',function(e){
    if(window.__chibiJustDragged&&Date.now()-window.__chibiJustDragged<400){
      window.__chibiJustDragged=0; e.stopPropagation(); e.preventDefault(); } },true);
  w.addEventListener('dblclick',function(){ try{ localStorage.removeItem(KEY); }catch(e){}
    userPlaced=false; perch(w); },true);
  addEventListener('resize',function(){ var s2=saved(); if(s2) place(w,s2); });
}
if(document.readyState==='loading') addEventListener('DOMContentLoaded',function(){ setTimeout(init,400); });
else setTimeout(init,400);
})();

(function(){
/* ---- the killa loading screen v2 \u00b7 pillar-dynamic \u00b7 tap to skip \u00b7 six-second cap ---- */
if(window.__innLoader) return; window.__innLoader=1;
var reduce=false; try{ reduce=matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){}
if(/(slate|slatekit|grid3d|wheel|ferry)\.html(\?|#|$)/.test(location.href)) return;
  var P=(localStorage.getItem('hive_pillar')||'').toLowerCase();
if(!P){ var mm=(location.pathname.split('/').pop()||'').replace(/\.html.*$/,'');
  if(['axiom','eigen','baseline','keystone'].indexOf(mm)>-1) P=mm; }
var TH={
 axiom:{col:'#d8dde3',name:'AXIOM INDUSTRIES',anim:'innSpin 9s linear infinite',
  sig:'<circle cx="32" cy="32" r="6"/><line x1="32" y1="26" x2="32" y2="14"/><line x1="38" y1="32" x2="50" y2="32"/><line x1="32" y1="38" x2="32" y2="50"/><line x1="26" y1="32" x2="14" y2="32"/><circle cx="32" cy="10" r="4"/><circle cx="54" cy="32" r="4"/><circle cx="32" cy="54" r="4"/><circle cx="10" cy="32" r="4"/>',
  lines:['waking the obs deck','counting the bonds','torquing the supply chain','polishing the ledger specs','seating the matter','verifying the teardown']},
 eigen:{col:'#58a36a',name:'EIGEN DYNAMICS',anim:'innSway 3.4s ease-in-out infinite alternate',
  sig:'<path d="M20 50 Q18 26 46 12 Q44 40 26 52 Z"/><path d="M20 50 Q30 34 46 12"/>',
  lines:['watering the garden','sharpening the quill','counting the tags','jumbling the solarium','pressing the leaves','whispering to the tablet']},
 baseline:{col:'#3f7fc1',name:'BASELINE EVOLUTIONS',anim:'innMarch 2.2s linear infinite',
  sig:'<path d="M6 32 Q13 16 20 32 T34 32 T48 32 T62 32"/><path d="M6 40 Q13 28 20 40 T34 40 T48 40 T62 40" opacity=".45"/>',
  lines:['tuning the low end','winding the frets','warming the studio','docking the protocol','spooling the honey tapes','asking the neck for a song']},
 keystone:{col:'#d9a83a',name:'KEYSTONE SOLUTIONS',anim:'innPulse 2.6s ease-in-out infinite',
  sig:'<path d="M14 52 V30 A18 18 0 0 1 50 30 V52"/><path d="M27 14 L37 14 L34 24 L30 24 Z"/>',
  lines:['setting the keystone','balancing the books','grinding the glyph','quieting the math','promising the promises','opening the archive']}};
var T=TH[P]||{col:'#d9a83a',name:'INN.VISIBLE',anim:'innSpin 6s linear infinite',
  sig:'<path d="M16 40 L24 16 L44 16 L36 40 Z"/><line x1="10" y1="46" x2="44" y2="12"/><circle cx="28" cy="8" r="2"/><circle cx="48" cy="28" r="2"/><circle cx="28" cy="48" r="2"/><circle cx="8" cy="28" r="2"/>',
  lines:['waking the obs deck','tuning the low end','counting the moon-days','oiling the xenofolders','polishing the gold dot','asking the sky its tongue']};
var ov=document.createElement('div'); ov.id='innLoad'; ov.setAttribute('data-p',P||'house');
ov.style.cssText='position:fixed;inset:0;z-index:999;background:#0a0d12;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:13px;cursor:pointer;transition:opacity .5s ease;font-family:ui-monospace,Consolas,monospace';
ov.innerHTML=
 '<svg id="innSig" width="66" height="66" viewBox="0 0 64 64" fill="none" stroke="'+T.col+'" stroke-width="2" stroke-linecap="round" style="animation:'+(reduce?'none':T.anim)+';transform-origin:center">'+T.sig+'</svg>'
 +'<div style="font-size:12px;letter-spacing:.5em;color:#e8e4d8;transition:letter-spacing .6s ease" id="innWord">INN.VISIBLE</div>'
 +'<div style="font-size:9px;letter-spacing:.34em;color:'+T.col+';opacity:.85">'+T.name+'</div>'
 +'<div style="width:min(320px,70vw);height:3px;background:#223041;position:relative;overflow:hidden"><i id="innBar" style="position:absolute;left:0;top:0;bottom:0;width:0%;background-color:'+T.col+';background-image:repeating-linear-gradient(45deg,rgba(255,255,255,.16) 0 6px,transparent 6px 12px);transition:width .25s ease"></i></div>'
 +'<div id="innLine" style="font-size:9px;letter-spacing:.18em;color:#5c6875;min-height:14px;text-align:center;padding:0 12px"></div>'
 +'<div id="innPct" style="font-size:9px;letter-spacing:.2em;color:#3a4a5c">0%</div>';
var st=document.createElement('style');
st.textContent='@keyframes innSpin{from{transform:rotate(0)}to{transform:rotate(360deg)}}'
 +'@keyframes innSway{from{transform:rotate(-7deg)}to{transform:rotate(7deg)}}'
 +'@keyframes innMarch{from{stroke-dashoffset:0}to{stroke-dashoffset:-32}}'
 +'@keyframes innPulse{0%,100%{opacity:.55;transform:scale(.97)}50%{opacity:1;transform:scale(1.03)}}'
 +'#innLoad[data-p="baseline"] svg path{stroke-dasharray:10 6}'
 +'#innLoad.bye{opacity:0;pointer-events:none}';
document.head.appendChild(st);
(document.body||document.documentElement).appendChild(ov);
var li=0, pct=0, done=false;
var bar=ov.querySelector('#innBar'), line=ov.querySelector('#innLine'), pctl=ov.querySelector('#innPct'), word=ov.querySelector('#innWord');
var tick=setInterval(function(){
  if(done) return;
  li=(li+1)%T.lines.length;
  line.textContent=T.lines[li]+' \u00b7';
  pct=Math.min(92, pct+(92-pct)*0.12+1.2);
  bar.style.width=pct+'%'; pctl.textContent=Math.round(pct)+'%';
}, reduce?900:420);
function finish(){
  if(done) return; done=true; clearInterval(tick);
  pct=100; bar.style.width='100%'; pctl.textContent='100%';
  line.textContent='the house is awake \u00b7 welcome home, '+T.name.toLowerCase();
  word.style.letterSpacing='.34em';
  setTimeout(function(){ ov.classList.add('bye');
    setTimeout(function(){ if(ov.parentNode) ov.parentNode.removeChild(ov); },600); }, reduce?80:420);
}
if(document.readyState==='complete') setTimeout(finish,120);
else addEventListener('load',function(){ setTimeout(finish,150); });
setTimeout(finish,6000);
ov.addEventListener('click',finish);
})();

  
(function(){
/* ---- the ferry orbit v2 \u00b7 finds the cluster wherever she lives \u00b7 scrolls with her ---- */
if(window.__ferryOrbit) return; window.__ferryOrbit=1;
var ov=null, tries=0, host=null;
function styleOnce(){
  if(document.getElementById('foStyle')) return;
  var st=document.createElement('style'); st.id='foStyle';
  st.textContent='@keyframes foSpin{from{transform:rotate(0)}to{transform:rotate(360deg)}}'
   +'@keyframes foSpinR{from{transform:translate(-50%,-50%) rotate(0)}to{transform:translate(-50%,-50%) rotate(-360deg)}}'
   +'#foDot:hover{box-shadow:0 0 18px rgba(217,168,58,.85)}';
  document.head.appendChild(st);
}
function place(){
  if(!ov) return;
  var cx, cy, size;
  if(host&&host.getBoundingClientRect){
    var r=host.getBoundingClientRect();
    cx=r.left+r.width/2+window.scrollX; cy=r.top+r.height/2+window.scrollY;
    size=Math.max(r.width,r.height)*1.42;
  } else { cx=window.scrollX+innerWidth/2; cy=window.scrollY+innerHeight*0.45; size=Math.min(innerWidth*0.8,580); }
  size=Math.max(240,size);
  ov.style.left=cx+'px'; ov.style.top=cy+'px';
  ov.style.width=size+'px'; ov.style.height=size+'px';
}
function build(cl){
  host=cl||null;
  styleOnce();
  ov=document.createElement('div'); ov.id='ferryOrbit';
  ov.style.cssText='position:absolute;transform:translate(-50%,-50%);z-index:6;pointer-events:none';
  ov.innerHTML='<svg viewBox="0 0 100 100" style="position:absolute;inset:0;width:100%;height:100%">'
   +'<circle cx="50" cy="50" r="48" fill="none" stroke="rgba(217,168,58,.45)" stroke-width="0.7" stroke-dasharray="0.5 3.2" stroke-linecap="round"/></svg>'
   +'<div style="position:absolute;inset:0;animation:foSpin 26s linear infinite">'
   +'<a id="foDot" href="ferry.html" title="the ferry \u00b7 file carrying between glasses" style="position:absolute;left:50%;top:0;transform:translate(-50%,-50%);width:28px;height:28px;border-radius:50%;background:#0a0d12;border:1px solid #d9a83a;display:flex;align-items:center;justify-content:center;pointer-events:auto;text-decoration:none;box-shadow:0 0 10px rgba(217,168,58,.45);animation:foSpinR 26s linear infinite">'
   +'<span style="font-size:12px;color:#d9a83a">\u26f4</span></a></div>'
   +'<div style="position:absolute;left:50%;bottom:-16px;transform:translateX(-50%);font:9px ui-monospace,Consolas,monospace;letter-spacing:.22em;color:#5c6875;white-space:nowrap">the ferry orbits \u00b7 tap the gold dot</div>';
  document.body.appendChild(ov);
  place();
}
function mount(){
  if(ov||tries++>40) return;
  var cl=document.querySelector('.cluster')||document.getElementById('introGrid')||document.querySelector('[class*="cluster"]');
  var porch=/((core|index)\.html)(\?|#|$)/.test(location.href);
  if(!cl&&!porch) return;
  if(porch&&!cl&&document.readyState!=='complete') return; /* wait for the rings to exist */
  build(cl);
}
setInterval(mount,500); setTimeout(mount,400);
addEventListener('resize',place);
addEventListener('load',function(){ setTimeout(place,300); });
})();



