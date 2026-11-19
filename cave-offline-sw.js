// Mythwrought Roadmap #240: opt-in CAVE-ONLY offline service worker.
// Only registered after explicit new Cave World selection, not in the
// ordinary default game. Public code/assets only; NO private save data.
const PREFIX='mythwrought-caves-v1-source-';
const REVISION='9b521c08ddcb0328';
const CACHE=PREFIX+REVISION;
const READY_NAME='cave-offline-ready.json';
const SELF_FILES=new Set(['cave-offline-assets.json','cave-offline-sw.js']);
async function gitBlobSha1(response){
 const data=new Uint8Array(await response.clone().arrayBuffer());
 const head=new TextEncoder().encode('blob '+data.byteLength+'\0');
 const input=new Uint8Array(head.byteLength+data.byteLength);
 input.set(head);input.set(data,head.byteLength);
 const digest=new Uint8Array(await crypto.subtle.digest('SHA-1',input));
 return [...digest].map(b=>b.toString(16).padStart(2,'0')).join('');
}
async function readCompleteCache(){
 const current=await caches.open(CACHE);
 if(await current.match(url(READY_NAME)))return current;
 // Keep the last verified release as a cohesive fallback if a new
 // app/worker update was interrupted before the full asset set was ready.
 const names=(await caches.keys()).filter(name=>name.startsWith(PREFIX)&&name!==CACHE);
 for(const name of names.reverse()){
  const old=await caches.open(name);
  if(await old.match(url(READY_NAME)))return old;
 }
 return null;
}
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
 // Never purge the previous *verified* release before the new full source
 // cache has completed. A failed update must remain reversible offline.
 event.waitUntil(self.clients.claim());
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
      manifest.assets.length<50||manifest.cacheRevision!==REVISION||
      !/^[0-9a-f]{40}$/.test(manifest.sourceHead||''))
     throw Error('Offline source revision or asset list invalid');
   const tracked=manifest.sourceBlobSha1;
   if(!tracked||typeof tracked!=='object'||Array.isArray(tracked)||
     Object.keys(tracked).length!==manifest.assets.length-SELF_FILES.size)
     throw Error('Offline source integrity table incomplete');
   for(const item of manifest.assets){
     if(!SELF_FILES.has(item)&&!/^[0-9a-f]{40}$/.test(tracked[item]||''))
       throw Error('Unverified source identity: '+item);
   }
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
     if(!SELF_FILES.has(item)){
       const actual=await gitBlobSha1(response);
       if(actual!==tracked[item])
         throw Error('Mismatched source blob for '+item+'; refuse mixed offline build');
     }
     await cache.put(destination,response);
    }));
   }
   const check=await Promise.all(manifest.assets.map(item=>cache.match(url(item))));
   if(check.some(x=>!x))throw Error('Offline cache not complete');
   await cache.put(url(READY_NAME),
    new Response(JSON.stringify({sourceHead:manifest.sourceHead,
       cacheRevision:REVISION,verifiedBlobs:Object.keys(tracked).length,
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
   // IMPORTANT: use only ONE complete release cache for an offline page.
   // A new incomplete cache must never mix its index and JS modules with
   // an older edition, even if both are individually valid responses.
   const complete=await readCompleteCache();
   if(!complete)return Response.error();
   const cached=await complete.match(request);
   if(cached)return cached;
   if(request.mode==='navigate'){
     const shell=await complete.match(url('index.html'));
     if(shell)return shell;
   }
   return Response.error();
  }
 })());
});
