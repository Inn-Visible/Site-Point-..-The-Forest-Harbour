/* sw.js · the house's offline hand · keep-list retired, dark shelf installed */
var TILES='hive-tiles-v1', KIT='hive-kit-v1', CORE='hive-core-v1';
var PAGES=['./','./index.html','./axiom.html','./eigen.html','./baseline.html',
  './keystone.html','./archive.html','./grid3d.html','./manifest.json','./radio.html','./rules.html','./shop.html','./slatekit.html','./sig.js'];

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
          }).catch(function(){ return hit; });
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
