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
  /* ---- the gyro hand II \u00b7 level, equations, offline-true ---- */
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
  var lv=document.createElement('canvas'); lv.width=76; lv.height=76; lv.style.cssText='display:block;margin:6px auto 0';
  hud.appendChild(lv);
  var eq=document.createElement('div'); eq.style.cssText='margin-top:4px;font-size:9px;line-height:1.6';
  hud.appendChild(eq);
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
    lg.clearRect(0,0,76,76);
    var cx=38,cy=38,R=30;
    if(!haveTilt){
      lg.strokeStyle='rgba(92,104,117,.4)'; lg.lineWidth=1.5;
      lg.beginPath(); lg.arc(cx,cy,R,0,7); lg.stroke();
      lg.fillStyle='#5c6875'; lg.font='8px monospace'; lg.textAlign='center';
      lg.fillText('no gyro on this glass', cx, cy+R+10);
      return;
    }
    var flat=Math.abs(gamma)<3&&Math.abs(beta)<3;
    lg.strokeStyle=flat?'#d9a83a':'rgba(92,104,117,.7)'; lg.lineWidth=1.5;
    lg.beginPath(); lg.arc(cx,cy,R,0,7); lg.stroke();
    lg.strokeStyle='rgba(92,104,117,.5)'; lg.lineWidth=1;
    lg.beginPath(); lg.arc(cx,cy,4,0,7); lg.stroke();
    lg.beginPath(); lg.moveTo(cx-R,cy); lg.lineTo(cx-R+6,cy); lg.moveTo(cx+R-6,cy); lg.lineTo(cx+R,cy);
    lg.moveTo(cx,cy-R); lg.lineTo(cx,cy-R+6); lg.moveTo(cx,cy+R-6); lg.lineTo(cx,cy+R); lg.stroke();
    var bx=cx+Math.max(-1,Math.min(1,gamma/30))*(R-8), by=cy+Math.max(-1,Math.min(1,beta/30))*(R-8);
    lg.fillStyle=flat?'#d9a83a':'#93a1b0';
    lg.beginPath(); lg.arc(bx,by,5,0,7); lg.fill();
    lg.fillStyle=flat?'#d9a83a':'#5c6875'; lg.font='8px monospace'; lg.textAlign='center';
    lg.fillText(flat?'level':Math.round(Math.max(Math.abs(gamma),Math.abs(beta)))+'\u00b0', cx, cy+R+10);
  }
  /* ---- equations \u00b7 all local \u00b7 clock + sensor only ---- */
  function rad(d){ return d*Math.PI/180; } function deg(r){ return r*180/Math.PI; }
  function lst(){ var d=Date.now()/86400000+2440587.5-2451545.0;
    return ((280.46061837+360.98564736629*d+LON)%360+360)%360; }
  function sunEq(){ var d=new Date(), jan=new Date(d.getFullYear(),0,0);
    var N=Math.floor((d-jan)/86400000);
    var dec=-23.44*Math.cos(rad(360/365*(N+10)));
    var dst=(function(d){ var m=d.getMonth(), y=d.getFullYear(), dd=d.getDate();       if(m>2&&m<10) return true; if(m<2||m>10) return false;       if(m===2){ var s=1+((7-new Date(y,2,1).getDay())%7); return dd>=s+7; }       return dd<1+((7-new Date(y,10,1).getDay())%7); })(d);
    var sol=d.getHours()+d.getMinutes()/60+d.getSeconds()/3600-(dst?1:0)+(LON+75)/15;
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
  /* ---- loop ---- */
  var SK=null; setTimeout(function(){ SK=[]; var cs=document.querySelectorAll('body > canvas');
    for(var i=0;i<cs.length;i++){ var s=cs[i].style; if(s.position==='fixed'&&s.zIndex==='-1') SK.push(cs[i]); } },800);
  var lastEq=0;
  function loop(now){
    var on=document.body.classList.contains('coasting');
    if(haveH){ var d=((hT-hC+540)%360)-180; hC=(hC+d*0.12+360)%360; }
    if(!hasHud&&on&&gg){ tape(hC); gh.textContent=Math.round(hC)%360+'\u00b0 \u00b7 '+C16[Math.round(hC/22.5)%16]; }
    if(on) level();
    if(on&&now-lastEq>500){ lastEq=now;
      var s=sunEq(), m=moonEq(), L=lst();
      var lh=Math.floor(L/15), lm=Math.floor((L/15-lh)*60);
      var dc=new Date(), pp=function(n){ return String(n).padStart(2,'0'); };       eq.innerHTML='t '+pp(dc.getHours())+':'+pp(dc.getMinutes())+':'+pp(dc.getSeconds())+' \u00b7 lst '+lh+'h'+String(lm).padStart(2,'0')+' \u00b7 sun '+(s.alt>=0?'+':'')+Math.round(s.alt)+'\u00b0/'+Math.round(s.az)+'\u00b0 \u00b7 moon day '+Math.floor(m.age)+' \u00b7 '+m.name
        +'<br><span style="color:'+(navigator.onLine?'#58a36a':'#d9a83a')+'">\u25cf</span> '+(navigator.onLine?'wire idle':'no wire')+' \u00b7 clock+sensor only \u00b7 the sky needs no wire';
    }
    if(on&&haveTilt&&SK){ var tx=Math.max(-8,Math.min(8,gamma*0.25)), ty=Math.max(-8,Math.min(8,beta*0.25));
      for(var i=0;i<SK.length;i++){ try{ SK[i].style.translate=tx.toFixed(1)+'px '+ty.toFixed(1)+'px'; }catch(e){} } }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
