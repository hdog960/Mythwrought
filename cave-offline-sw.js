// Mythwrought Roadmap #240: opt-in CAVE-ONLY offline service worker.
// Only registered after explicit new Cave World selection, not in the
// ordinary default game. Public code/assets only; NO private save data.
const CACHE='mythwrought-caves-v1-source-20261118';
const PREFIX='mythwrought-caves-v1-source-';
const SHELL=['index.html','styles.css','manifest.webmanifest','assets/icon.svg',
 'cave-offline-assets.json'];
const url=name=>new URL(name,self.registration.scope);
self.addEventListener('install',event=>{
 event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  for(const item of SHELL){
   const response=await fetch(url(item),{cache:'no-store'});
   if(!response.ok)throw Error('Offline shell missing '+item);
   await cache.put(url(item),response);
  }
  await self.skipWaiting();
 })());
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
  for(const name of await caches.keys())
   if(name.startsWith(PREFIX)&&name!==CACHE)await caches.delete(name);
  await self.clients.claim();
 })());
});
self.addEventListener('message',event=>{
 if(event.data?.type!=='MYTHWROUGHT_PREPARE_CAVE_OFFLINE')return;
 event.waitUntil((async()=>{
  try{
   const reply=event.source;
   const manifestResponse=await fetch(url('cave-offline-assets.json'),{cache:'no-store'});
   if(!manifestResponse.ok)throw Error('Cannot download offline asset manifest');
   const manifest=await manifestResponse.json();
   if(manifest?.kind!=='MYTHWROUGHT_CAVE_SOURCE_ASSETS_V1'||
      !Array.isArray(manifest.assets)||manifest.assets.length>300||
      manifest.assets.length<50)throw Error('Offline asset list invalid');
   const cache=await caches.open(CACHE);
   // Bounded network concurrency prevents a 200-module preflight from
   // starving actual mobile gameplay or allocating an unbounded request set.
   for(let i=0;i<manifest.assets.length;i+=6){
    const batch=manifest.assets.slice(i,i+6);
    await Promise.all(batch.map(async item=>{
     if(typeof item!=='string'||!/^([a-zA-Z0-9._-]+\/)*[a-zA-Z0-9._-]+$/.test(item))
      throw Error('Unsafe offline source path');
     const destination=url(item);
     if(destination.origin!==self.location.origin ||
        !destination.href.startsWith(self.registration.scope))
      throw Error('Off-scope offline source rejected');
     const response=await fetch(destination,{cache:'no-store'});
     if(!response.ok)throw Error('Offline source unavailable: '+item);
     await cache.put(destination,response);
    }));
   }
   const check=await Promise.all(manifest.assets.map(item=>cache.match(url(item))));
   if(check.some(x=>!x))throw Error('Offline cache not complete');
   await cache.put(url('cave-offline-ready.json'),
    new Response(JSON.stringify({sourceHead:manifest.sourceHead,
       count:manifest.assets.length,kind:manifest.kind}),
     {headers:{'Content-Type':'application/json'}}));
   reply?.postMessage({type:'MYTHWROUGHT_CAVE_OFFLINE_READY',
      sourceHead:manifest.sourceHead,assets:manifest.assets.length});
  }catch(error){
   event.source?.postMessage({type:'MYTHWROUGHT_CAVE_OFFLINE_FAILED',
      error:String(error.message||error)});
  }
 })());
});
self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET')return;
 const target=new URL(request.url);
 if(target.origin!==self.location.origin ||
    !target.href.startsWith(self.registration.scope))return;
 // No caching private user saves, POSTs, API calls or foreign resources.
 const allowed=/\.(html|css|mjs|js|json|svg|png|webmanifest)$/.test(target.pathname)||
  target.pathname===new URL('./',self.registration.scope).pathname;
 if(!allowed)return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  try{
   const fresh=await fetch(request);
   if(fresh.ok)await cache.put(request,fresh.clone());
   return fresh;
  }catch(error){
   const cached=await cache.match(request);
   if(cached)return cached;
   // Pages/iPhone Home Screen launches navigate to the DIRECTORY ROOT,
   // whereas install pre-caches /index.html. Give only same-origin, in-scope
   // navigations the exact verified app shell, never a fake success page.
   if(request.mode==='navigate'){
     const shell=await cache.match(url('index.html'));
     if(shell)return shell;
   }
   return Response.error();
  }
 })());
});
