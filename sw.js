/* sw.js · the house's offline hand · keep-list retired, dark shelf installed */
var TILES='hive-tiles-v1', KIT='hive-kit-v1', CORE='hive-core-v1';
var PAGES=['./','./index.html','./axiom.html','./eigen.html','./baseline.html',
  './keystone.html','./archive.html','./grid3d.html','./manifest.json','./radio.html','./rules.html','./shop.html','./slatekit.html','./sig.js','./homage.html'];

/* the candle shell · last-resort page, lives in this file's own source */
var SHELL='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>the house is dark</title><style>body{margin:0;background:#0a0d12;color:#93a1b0;font:12px ui-monospace,Consolas,monospace;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center;letter-spacing:.12em}a{color:#3f7fc1;text-decoration:none}i{font-style:normal;font-size:44px;display:block;margin-bottom:12px}</style></head><body><div><i>\ud83d\udd6f</i>the house is dark \u00b7 the rooms are still here<div style="margin-top:14px;line-height:2.1"><a href="index.html">entrance</a> \u00b7 <a href="core.html">core</a> \u00b7 <a href="parlor.html">parlor</a> \u00b7 <a href="donations.html">hearth</a> \u00b7 <a href="slate.html">slate</a> \u00b7 <a href="keystone.html">keystone</a></div><div style="margin-top:12px;color:#5c6875;font-size:10px">offline \u00b7 everything already below the glass still works</div></div></body></html>';
function shellRes(){ return new Response(SHELL,{headers:{'Content-Type':'text/html; charset=utf-8'}}); }
function matchAnywhere(req){
  return caches.keys().then(function(ks){
    var out=Promise.resolve(null);
    ks.forEach(function(k){ out=out.then(function(hit){ if(hit) return hit; return caches.open(k).then(function(c){ return c.match(req); }).catch(function(){ return null; }); }); });
    return out;
  });
}

self.addEventListener('install',function(e){
  e.waitUntil(
    caches.open(KIT).then(function(c){
      return Promise.all(['./kit.html','./parlor.html','./donations.html','./board.html'].map(function(u){
        return c.add(u).catch(function(){ return null; });
      }));
    }).then(function(){
      return caches.open(CORE).then(function(c){
        return Promise.all(PAGES.map(function(u){
          return c.add(u).catch(function(){ return null; });
        }));
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate',function(e){
  /* the keep-list is dead · no cache dies on this watch again */
  self.clients.claim();
});

self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET') return;
  var u=e.request.url;
  /* tile urls (ground map) — cache forever, network-first */
  
  if(/arcgisonline\.com|openstreetmap\.org|opentopomap|basemaps\.cartocdn|tile\.openstreetmap/.test(u)){
    e.respondWith(
      caches.open(TILES).then(function(c){
        return c.match(u).then(function(hit){
          return hit || fetch(e.request).then(function(r){
            if(r.ok) c.put(u,r.clone()); return r;
           }).catch(function(){ return hit || gisChart(new URL(u)); });
        });
      })
    );
    return;
  }
  /* kit.html + sw.js — network-first with cache fallback */
  if(/\/kit\.html(\?|$)/.test(u) || u.endsWith('sw.js')){
    e.respondWith(
      fetch(e.request).then(function(r){
        if(r.ok){ var cl=r.clone(); caches.open(KIT).then(function(c){ c.put(e.request,cl); }); }
        return r;
      }).catch(function(){ return caches.match(e.request); })
    );
    return;
  }
  /* same-origin · network-first, refill the box, dark shelf underneath */
  if(u.indexOf(location.origin)===0){
    if(e.request.mode==='navigate'){
      e.respondWith(
        fetch(e.request).then(function(r){
          if(r.ok){ var cl=r.clone(); caches.open(CORE).then(function(c){ c.put(e.request,cl); }); }
          return r;
        }).catch(function(){
          return matchAnywhere(e.request).then(function(hit){ return hit || shellRes(); });
        })
      );
      return;
    }
    e.respondWith(
      fetch(e.request).then(function(r){
        if(r.ok){ var cl=r.clone(); caches.open(CORE).then(function(c){ c.put(e.request,cl); }); }
        return r;
      }).catch(function(){
        return matchAnywhere(e.request).then(function(hit){ return hit || new Response('',{status:404,statusText:'offline'}); });
      })
    );
    return;
  }
});

/* ==== offline gis \u00b7 esri tile cache + the house chart ==== */
var GISCACHE = 'hive-gis-tiles-v1';
function gisIsTile(url){
  return url.hostname.indexOf('arcgisonline') > -1 || /\/tile\/\d+\/\d+\/\d+/.test(url.pathname);
}
function gisFlow(req, url){
  return caches.open(GISCACHE).then(function(cache){
    return cache.match(req).then(function(hit){
      if (hit) return hit;
      return fetch(req).then(function(res){
        if (res && (res.ok || res.type === 'opaque')) {
          cache.put(req, res.clone());
          cache.keys().then(function(k){ if (k.length > 900) { for (var i = 0; i < k.length - 900; i++) cache.delete(k[i]); } });
        }
        return res;
      }).catch(function(){ return gisChart(url); });
    });
  });
}
var LAND = [
 [[-168,66],[-160,70],[-140,70],[-125,72],[-110,73],[-95,72],[-85,70],[-75,62],[-65,60],[-60,55],[-65,45],[-70,42],[-75,35],[-80,30],[-82,25],[-85,30],[-90,29],[-95,26],[-97,20],[-92,15],[-85,12],[-80,8],[-78,7],[-83,10],[-90,13],[-97,16],[-105,20],[-110,24],[-115,30],[-120,34],[-125,40],[-125,48],[-130,55],[-140,60],[-150,60],[-158,58],[-165,60]],
 [[-45,60],[-52,64],[-55,70],[-50,76],[-40,78],[-30,76],[-22,70],[-25,65],[-35,62]],
 [[-78,7],[-72,10],[-62,10],[-52,5],[-45,0],[-35,-5],[-35,-10],[-40,-20],[-48,-25],[-53,-32],[-58,-38],[-65,-45],[-68,-52],[-72,-54],[-75,-50],[-73,-40],[-70,-30],[-70,-18],[-75,-14],[-80,-5],[-80,0]],
 [[-10,35],[0,37],[10,37],[20,32],[30,31],[35,28],[43,12],[51,12],[48,5],[42,-2],[40,-10],[35,-20],[32,-28],[25,-34],[18,-34],[15,-28],[12,-18],[9,-5],[9,4],[5,5],[-5,5],[-10,6],[-17,12],[-17,20],[-13,28]],
 [[-10,36],[-9,43],[-2,48],[-5,50],[0,52],[5,58],[10,62],[15,68],[25,70],[35,68],[45,68],[60,70],[75,72],[90,74],[105,75],[120,73],[135,72],[150,70],[160,68],[170,66],[178,65],[175,60],[162,58],[155,52],[142,45],[135,40],[128,35],[122,30],[115,22],[108,15],[105,10],[100,8],[98,12],[92,15],[88,22],[85,20],[80,15],[77,8],[73,15],[70,20],[65,25],[58,25],[52,25],[48,28],[44,30],[36,36],[28,36],[20,36],[12,38],[5,36],[0,36]],
 [[-5,50],[-3,55],[-5,58],[-2,57],[0,53],[1,51]],
 [[114,-22],[114,-30],[118,-35],[125,-32],[130,-32],[135,-35],[140,-38],[147,-38],[150,-35],[153,-28],[150,-22],[145,-15],[140,-17],[135,-12],[130,-13],[125,-14],[120,-18]],
 [[44,-12],[50,-15],[48,-25],[45,-25],[43,-20]],
 [[167,-45],[174,-40],[178,-38],[175,-42],[170,-47]]
];
function gisChart(url){
  var m = url.pathname.match(/\/tile\/(\d+)\/(\d+)\/(\d+)/);
  var z, x, y;
  if (m) { z = +m[1]; y = +m[2]; x = +m[3]; }
  else { var m2 = url.pathname.match(/\/(\d+)\/(\d+)\/(\d+)\.(png|jpe?g)/); if (!m2) return gisSea(); z = +m2[1]; x = +m2[2]; y = +m2[3]; }
  if (z >= 7) return gisUncharted(z, x, y);
  var n = Math.pow(2, z);
  function P(lon, lat){
    var wx = (lon + 180) / 360;
    var wy = (1 - Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360)) / Math.PI) / 2;
    return [(wx * n - x) * 256, (wy * n - y) * 256];
  }
  var s = '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">';
  s += '<rect width="256" height="256" fill="#0b1016"/>';
  var step = z < 3 ? 30 : (z < 6 ? 10 : 5), gp = '';
  for (var lon = -180; lon <= 180; lon += step) { var gx = P(lon, 0)[0]; if (gx > -2 && gx < 258) gp += 'M' + gx.toFixed(1) + ' 0V256'; }
  for (var lat = -80; lat <= 80; lat += step) { var gy = P(0, lat)[1]; if (gy > -2 && gy < 258) gp += 'M0 ' + gy.toFixed(1) + 'H256'; }
  s += '<path d="' + gp + '" stroke="rgba(92,104,117,.22)" fill="none"/>';
  var lp = '';
  LAND.forEach(function(poly){ lp += 'M' + poly.map(function(p){ var q = P(p[0], p[1]); return q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join('L') + 'Z'; });
  s += '<path d="' + lp + '" fill="none" stroke="rgba(217,168,58,.16)" stroke-width="4" stroke-linejoin="round"/>';
  s += '<path d="' + lp + '" fill="#141c26" stroke="rgba(217,168,58,.5)" stroke-width="1" stroke-linejoin="round" stroke-linecap="round"/>';
  var ay = P(0, -70)[1];
  if (ay < 256) { var top = Math.max(0, ay); s += '<rect y="' + top.toFixed(1) + '" width="256" height="' + (256 - top).toFixed(1) + '" fill="#141c26"/><line x1="0" y1="' + top.toFixed(1) + '" x2="256" y2="' + top.toFixed(1) + '" stroke="rgba(217,168,58,.5)"/>'; }
  var NAMES = ['NORTH AMERICA','GREENLAND','SOUTH AMERICA','AFRICA','EURASIA','BRITAIN','AUSTRALIA','MADAGASCAR','NEW ZEALAND'];
  var fs = z <= 2 ? 9 : (z <= 4 ? 11 : 8);
  LAND.forEach(function(poly, i){
    var cl = [0, 0]; poly.forEach(function(p){ cl[0] += p[0]; cl[1] += p[1]; });
    cl = [cl[0] / poly.length, cl[1] / poly.length];
    var q = P(cl[0], cl[1]);
    if (q[0] > -40 && q[0] < 296 && q[1] > -10 && q[1] < 266) {
      s += '<text x="' + q[0].toFixed(1) + '" y="' + q[1].toFixed(1) + '" font-family="Georgia,serif" font-style="italic" font-size="' + fs + '" fill="rgba(217,168,58,.55)" text-anchor="middle" letter-spacing="2">' + NAMES[i] + '</text>';
    }
  });
  s += '</svg>';
  return new Response(s, { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-store' } });
}
function gisUncharted(z, x, y){
  var dpt = 360 / Math.pow(2, z);
  var steps = [10,5,2,1,0.5,0.2,0.1,0.05,0.02,0.01,0.005];
  var step = steps[steps.length - 1];
  for (var i = 0; i < steps.length; i++){ if (steps[i] <= dpt / 3){ step = steps[i]; break; } }
  var n = Math.pow(2, z);
  function P(lon, lat){
    var wx = (lon + 180) / 360;
    var wy = (1 - Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360)) / Math.PI) / 2;
    return [(wx * n - x) * 256, (wy * n - y) * 256];
  }
  function latOf(wy){ return (2 * Math.atan(Math.exp(Math.PI * (1 - 2 * wy))) - Math.PI / 2) * 180 / Math.PI; }
  var lon0 = x / n * 360 - 180, lon1 = (x + 1) / n * 360 - 180;
  var latTop = latOf(y / n), latBot = latOf((y + 1) / n);
  var s = '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">';
  s += '<rect width="256" height="256" fill="#0b1016"/>';
  s += '<path d="M0 64H256M0 128H256M0 192H256M64 0V256M128 0V256M192 0V256" stroke="rgba(92,104,117,.06)"/>';
  var gp = '';
  for (var lon = Math.ceil(lon0 / step) * step; lon <= lon1; lon += step){ var gx = P(lon, 0)[0]; if (gx > -2 && gx < 258) gp += 'M' + gx.toFixed(1) + ' 0V256'; }
  for (var lat = Math.ceil(latBot / step) * step; lat <= latTop; lat += step){ var gy = P(0, lat)[1]; if (gy > -2 && gy < 258) gp += 'M0 ' + gy.toFixed(1) + 'H256'; }
  s += '<path d="' + gp + '" stroke="rgba(92,104,117,.2)" fill="none"/>';
  var h = (x * 73856093) ^ (y * 19349663) ^ (z * 83492791);
  function rnd(){ h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return (h >>> 0) / 4294967296; }
  for (var k = 0; k < 6; k++){
    var dx = 18 + rnd() * 220, dy = 18 + rnd() * 220, dep = (8 + rnd() * 170).toFixed(1);
    s += '<circle cx="' + dx.toFixed(1) + '" cy="' + dy.toFixed(1) + '" r="0.9" fill="rgba(147,161,176,.4)"/>'
       + '<text x="' + (dx + 4).toFixed(1) + '" y="' + (dy + 3).toFixed(1) + '" font-size="8" font-style="italic" font-family="Georgia,serif" fill="rgba(147,161,176,.38)">' + dep + '</text>';
  }
  if ((x + y) % 4 === 0) s += '<text x="10" y="246" font-size="8" font-family="monospace" fill="rgba(92,104,117,.55)" letter-spacing="2">UNCHARTED \u00b7 THE CACHE ENDS HERE</text>';
  s += '</svg>';
  return new Response(s, { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-store' } });
}
function gisSea(){
  return new Response('<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="256" height="256" fill="#0b1016"/></svg>', { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-store' } });
}
