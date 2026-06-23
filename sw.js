var CACHE='guia-paris-v22';
var CORE=['./','./index.html','./roteiro-video.html','./manifest.webmanifest','./img/icon.svg'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(CORE);}).then(function(){return self.skipWaiting();}));});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.map(function(k){if(k!==CACHE)return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  var u=new URL(e.request.url);
  // mapas/links externos sempre pela rede
  if(u.origin!==location.origin)return;
  e.respondWith(
    caches.match(e.request).then(function(r){
      return r || fetch(e.request).then(function(resp){
        var cp=resp.clone();
        caches.open(CACHE).then(function(c){try{c.put(e.request,cp);}catch(err){}});
        return resp;
      }).catch(function(){return r;});
    })
  );
});
