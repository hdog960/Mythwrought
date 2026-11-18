// M5-only explicit opt-in to the versioned static-game offline cache.
// Never registers for legacy/v2/v3/v4, and never writes world or map storage.
let registrationPromise=null;
export function ensureM5OfflineCache(){
  if(!('serviceWorker' in navigator)||!globalThis.isSecureContext)
    return Promise.resolve({supported:false,reason:'Secure ServiceWorker unavailable'});
  if(registrationPromise)return registrationPromise;
  const worker=new URL('../../sw-m5.js',import.meta.url);
  const scope=new URL('../../',import.meta.url);
  registrationPromise=navigator.serviceWorker.register(worker.href,
    {scope:scope.pathname}).then(registration=>({supported:true,registration}))
    .catch(error=>({supported:false,reason:String(error)}));
  return registrationPromise;
}
