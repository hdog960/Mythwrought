// Loopback-only scenery rehearsal using the existing installation's scope.
const workerUrl=new URL(self.location.href);
const staging=['localhost','127.0.0.1'].includes(workerUrl.hostname)&&
  workerUrl.searchParams.get('nonblock-staging')==='1';
const CACHE_PREFIX='mythwrought-nonblock-stage-shell-';
const STAGE_VERSION='20261124-v39-mountain09';
const STAGE_PREVIOUS_VERSION='20261124-v39';
const SITE_RELEASE='20261124-mountain-v8-candidate-09';
const CACHE_NAME=CACHE_PREFIX+STAGE_VERSION;
const scopeUrl=new URL(self.registration.scope);
const manifestUrl=new URL('./nonblock-stage-assets.json',scopeUrl).href;

function fresh(url){
  const versioned=new URL(url);
  versioned.searchParams.set('mw-cache-install',CACHE_NAME);
  return fetch(new Request(versioned.href,{cache:'reload',credentials:'same-origin'}));
}

async function populate(cache){
  const response=await fresh(manifestUrl);
  if(!response.ok)throw new Error('Staged asset manifest unavailable');
  const manifest=await response.clone().json();
  const entries=Object.entries(manifest?.assets??{});
  if(manifest?.version!==STAGE_VERSION||!manifest.assets?.['./']||
    !manifest.assets['./index.html']||!manifest.assets['./src/main.mjs']||
    !manifest.assets['./sw-nonblock-stage.js']||entries.some(([path,sha])=>
      !/^\.\/(?:[\w.-]+\/)*[\w.-]*$/.test(path)||path.split('/').slice(1).some(part=>part==='.'||part==='..')||
        !/^[a-f0-9]{64}$/.test(sha)))throw new Error('Invalid staged asset manifest');
  for(let i=0;i<entries.length;i+=6){
    const results=await Promise.allSettled(entries.slice(i,i+6).map(async ([path,expected])=>{
      const url=new URL(path,scopeUrl).href;
      const asset=await fresh(url);
      if(!asset.ok||asset.type==='opaque')throw new Error('Staged asset unavailable '+path);
      const bytes=await asset.clone().arrayBuffer();
      const sha=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))]
        .map(value=>value.toString(16).padStart(2,'0')).join('');
      if(sha!==expected)throw new Error('Staged asset changed '+path);
      await cache.put(url,asset);
    }));
    const failed=results.find(result=>result.status==='rejected');
    if(failed)throw failed.reason;
  }
  await cache.put(manifestUrl,response);
}

self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    if(!staging)throw new Error('Scenery rehearsal requires explicit loopback scope');
    const cache=await caches.open(CACHE_NAME);
    if(await cache.match(manifestUrl))throw new Error('Staged cache version already has a verified bank');
    try{
      await populate(cache);
      await self.skipWaiting();
    }catch(error){
      if(!await cache.match(manifestUrl))await caches.delete(CACHE_NAME);
      throw error;
    }
  })());
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>{
      if(!key.startsWith(CACHE_PREFIX)||key===CACHE_PREFIX+STAGE_PREVIOUS_VERSION)return false;
      const version=/^(\d{8})-v(\d+)$/.exec(key.slice(CACHE_PREFIX.length));
      const [date,serial]=STAGE_VERSION.split('-v');
      return version&&(version[1]<date||version[1]===date&&Number(version[2])<Number(serial));
    }).map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch',event=>{
  const request=event.request,url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==scopeUrl.origin||!url.pathname.startsWith(scopeUrl.pathname))return;
  const canonical=new URL(url.href);
  canonical.search='';
  const stageNavigation=request.mode==='navigate'&&canonical.href===scopeUrl.href&&
    url.searchParams.has('nonblock-stage')&&url.searchParams.get('nonblock-offline')==='1';
  const pinned=url.searchParams.size===1&&url.searchParams.get('mw-release')===SITE_RELEASE&&
    ['styles.css','src/main.mjs'].some(path=>canonical.href===new URL(path,scopeUrl).href);
  if(url.search&&!stageNavigation&&!pinned)return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE_NAME);
    return await cache.match(canonical.href)||fetch(request);
  })());
});
