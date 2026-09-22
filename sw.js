var TILES='hive-tiles-v1', KIT='hive-kit-v1';

self.addEventListener('install',function(e){
  e.waitUntil(caches.open(KIT).then(function(c){
      return Promise.all(['./kit.html','./parlor.html','./donations.html','./board.html'].map(function(u){
      return c.add(u).catch(function(){ return null; });
    }));
  }));
  self.skipWaiting();
});

self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){
    var keep=[TILES,KIT];
    return Promise.all(ks.filter(function(k){ return keep.indexOf(k)===-1; })
      .map(function(k){ return caches.delete(k); }));
  }));
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
  /* kit.html — network-first with cache fallback */
  if(/\/kit\.html(\?|$)/.test(u) || u.endsWith('sw.js')){
    e.respondWith(
      fetch(e.request).then(function(r){
        if(r.ok){ var cl=r.clone(); caches.open(KIT).then(function(c){ c.put(e.request,cl); }); }
        return r;
      }).catch(function(){ return caches.match(e.request); })
    );
    return;
  }
});
