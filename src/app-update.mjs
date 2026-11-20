// Same-install PWA refresh support. No world storage, cache deletion, or worker replacement.
// Existing M5 registrations are checked across all world profiles; registration remains opt-in.
export const GAME_RELEASE='20261120-unified-environment-rc1';
export const GAME_REFRESH_PARAM='mw-refresh';
export const ASSET_RELEASE_PARAM='mw-release';

export function versionedGameUrl(input,release=GAME_RELEASE){
  const url=new URL(String(input));
  url.searchParams.set(GAME_REFRESH_PARAM,release);
  return url.href;
}

export function expectedGameShell(html,release=GAME_RELEASE){
  return typeof html==='string'&&
    html.includes('data-mw-release="'+release+'"')&&
    html.includes('id="captureToggle"')&&
    html.includes('src/main.mjs?'+ASSET_RELEASE_PARAM+'='+release);
}

export async function checkExistingRegistration({
  serviceWorker,scope,online=true
}){
  if(!serviceWorker?.getRegistration)return {status:'unsupported'};
  const registration=await serviceWorker.getRegistration(scope);
  if(!registration)return {status:'not-registered'};
  if(!online)return {status:'offline',registration};
  if(typeof registration.update!=='function')
    return {status:'not-updatable',registration};
  await registration.update();
  return {status:'checked',registration};
}

export function installGameUpdater({
  button,status,baseUrl,
  serviceWorker=globalThis.navigator?.serviceWorker,
  navigatorObject=globalThis.navigator,
  fetchLatest=globalThis.fetch?.bind(globalThis),
  locationObject=globalThis.location,
  hasUnsavedChanges=()=>false
}){
  if(!button||!status||!baseUrl)throw Error('Game updater UI missing');
  const root=new URL(baseUrl);
  let busy=false;
  const setStatus=value=>{status.textContent=value;};
  async function checkInBackground(){
    if(navigatorObject?.onLine===false||!serviceWorker)return;
    try{
      await checkExistingRegistration({
        serviceWorker,scope:root.href,online:true
      });
    }catch(_){/* Network checks are advisory; never affect world launch. */}
  }
  button.addEventListener('click',async()=>{
    if(busy)return;
    if(hasUnsavedChanges()){
      setStatus('Please SAVE your current edits before updating. Your world is not changed.');
      return;
    }
    if(navigatorObject?.onLine===false){
      setStatus('Offline: the current game remains available. Connect to the internet to update.');
      return;
    }
    if(typeof fetchLatest!=='function'||!locationObject?.assign){
      setStatus('Update check unavailable in this browser. Your world is unchanged.');
      return;
    }
    busy=true;button.disabled=true;
    setStatus('Checking the latest game files without touching your saved worlds…');
    try{
      // Old service workers intentionally bypass query-string requests. This
      // probe fetches the live release without touching CacheStorage or saves.
      const probe=new URL('index.html',root);
      probe.searchParams.set(GAME_REFRESH_PARAM,GAME_RELEASE);
      const response=await fetchLatest(probe.href,{cache:'no-store'});
      if(!response?.ok)throw Error('Current online game could not be reached');
      const html=await response.text();
      if(!expectedGameShell(html))
        throw Error('Live release did not match the expected game version');
      // Existing registration only. Never register a worker for legacy worlds.
      try{
        await checkExistingRegistration({
          serviceWorker,scope:root.href,online:true
        });
      }catch(_){/* URL-bypassed navigation still permits an online recovery. */}
      if(hasUnsavedChanges())throw Error('Unsaved game edits; SAVE and try again');
      setStatus('Game verified. Reloading this same app with the fresh release…');
      locationObject.assign(versionedGameUrl(locationObject.href));
    }catch(error){
      setStatus('Update not applied: '+String(error?.message||error)+
        '. Your saved worlds and installed app are unchanged.');
    }finally{busy=false;button.disabled=false;}
  });
  // A fresh app can update its existing worker even for a legacy world. No
  // new registration is created; this best-effort check never triggers reload.
  void checkInBackground();
  return Object.freeze({checkInBackground});
}
