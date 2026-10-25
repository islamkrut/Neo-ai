const CACHE='neo-ai-shell-v1';
const SHELL=['./','./index.html','./sw.js'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{for(const k of await caches.keys())if(k.startsWith('neo-ai-shell-')&&k!==CACHE)await caches.delete(k);await self.clients.claim();})());});
self.addEventListener('fetch',event=>{
 const req=event.request;if(req.method!=='GET')return;
 const url=new URL(req.url);
 // Model files are cached by Transformers.js in the browser cache, not duplicated here.
 if(/huggingface\.co|hf\.co|cdn-lfs|cas-bridge|xethub|mymemory|wikipedia/.test(url.hostname))return;
 if(url.origin===self.location.origin||url.hostname==='cdn.jsdelivr.net'){
  event.respondWith((async()=>{const cache=await caches.open(CACHE);const stored=await cache.match(req);if(stored)return stored;try{const response=await fetch(req);if(response.ok||response.type==='opaque')cache.put(req,response.clone()).catch(()=>{});return response;}catch(e){if(req.mode==='navigate')return await cache.match('./index.html')||Response.error();throw e;}})());
 }
});