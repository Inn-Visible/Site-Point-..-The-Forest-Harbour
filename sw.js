const CACHE='outflow-v16';
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(['donations.html','board.html']);}));
  self.skipWaiting();
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
  }).then(function(){return clients.claim();}));
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  e.respondWith(
    fetch(e.request).then(function(res){
      if(res&&res.ok){
        const copy=res.clone();
        caches.open(CACHE).then(function(c){return c.put(e.request,copy);});
      }
      return res;
    }).catch(function(){
      return caches.match(e.request).then(function(hit){
        return hit||caches.match('donations.html');
      });
    })
  );
});
