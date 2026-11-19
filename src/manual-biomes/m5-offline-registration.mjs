// M5-only explicit opt-in to the versioned static-game offline cache.
// Never registers for legacy/v2/v3/v4, and never writes world or map storage.
let registrationPromise=null;
export function ensureM5OfflineCache(){
  if(!('serviceWorker' in navigator)||!globalThis.isSecureContext)
    return Promise.resolve({supported:false,reason:'Secure ServiceWorker unavailable'});
  if(registrationPromise)return registrationPromise;
  const worker=new URL('../../sw-m5.js',import.meta.url);
  const scope=new URL('../../',import.meta.url);
  registrationPromise=(async()=>{
    // Re-registering on EVERY offline reload causes a network update check
    // for sw-m5.js even while an already installed worker controls the page.
    // Reuse the exact active script when offline; never fetch or silently
    // install a new worker from a non-existent connection.
    if(navigator.onLine===false){
      const existing=await navigator.serviceWorker.getRegistration(scope.href);
      if(existing?.active?.scriptURL===worker.href)
        return {supported:true,registration:existing,reusedOffline:true};
      return {supported:false,reason:'No matching active M5 worker while offline'};
    }
    const registration=await navigator.serviceWorker.register(worker.href,
      {scope:scope.pathname,updateViaCache:'all'});
    return {supported:true,registration,reusedOffline:false};
  })().catch(error=>({supported:false,reason:String(error)}));
  return registrationPromise;
}
