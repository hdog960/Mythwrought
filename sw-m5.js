// M5 isolated offline browser candidate. Scoped static game assets only.
// Not a world save/migration or a new generator; CacheStorage remains separate
// from original per-seed localStorage and IndexedDB records.
// BUMP THIS CACHE ID whenever ANY cached asset changes before incorporation.
const CACHE_PREFIX='mythwrought-m5-shell-';
const CACHE_NAME=CACHE_PREFIX+'20261119-v6-safe-refresh';
const ASSET_RELEASE='20261119-v6-safe-refresh';
const SOURCE_ASSETS=[
  "./",
  "./assets/icon.svg",
  "./index.html",
  "./manifest.webmanifest",
  "./src/auto-block-catalog/biome130/ancient-ruin-details.mjs",
  "./src/auto-block-catalog/biome130/ancient-ruin-foundations.mjs",
  "./src/auto-block-catalog/biome130/ancient-ruin-fragments.mjs",
  "./src/auto-block-catalog/biome130/architecture-091-093.mjs",
  "./src/auto-block-catalog/biome130/architecture-094-096.mjs",
  "./src/auto-block-catalog/biome130/architecture-097-100.mjs",
  "./src/auto-block-catalog/biome130/desert-organics.mjs",
  "./src/auto-block-catalog/biome130/desert.mjs",
  "./src/auto-block-catalog/biome130/dungeon-components-081-083.mjs",
  "./src/auto-block-catalog/biome130/dungeon-components-084-086.mjs",
  "./src/auto-block-catalog/biome130/dungeon-components-087-090.mjs",
  "./src/auto-block-catalog/biome130/enchanted-flora.mjs",
  "./src/auto-block-catalog/biome130/enchanted-geology.mjs",
  "./src/auto-block-catalog/biome130/enchanted-ground.mjs",
  "./src/auto-block-catalog/biome130/enchanted-roots.mjs",
  "./src/auto-block-catalog/biome130/enchanted-wood.mjs",
  "./src/auto-block-catalog/biome130/formations.mjs",
  "./src/auto-block-catalog/biome130/frozen-ice.mjs",
  "./src/auto-block-catalog/biome130/glacial-materials.mjs",
  "./src/auto-block-catalog/biome130/ice-formations.mjs",
  "./src/auto-block-catalog/biome130/mountain-cliff-surfaces.mjs",
  "./src/auto-block-catalog/biome130/mountain-final-geology.mjs",
  "./src/auto-block-catalog/biome130/mountain-foundations.mjs",
  "./src/auto-block-catalog/biome130/mountain-materials.mjs",
  "./src/auto-block-catalog/biome130/mountain-ore-geology.mjs",
  "./src/auto-block-catalog/biome130/natural-leaves-122-124.mjs",
  "./src/auto-block-catalog/biome130/natural-leaves-125-127.mjs",
  "./src/auto-block-catalog/biome130/natural-leaves-128-130.mjs",
  "./src/auto-block-catalog/biome130/raw-logs-113-115.mjs",
  "./src/auto-block-catalog/biome130/raw-logs-116-118.mjs",
  "./src/auto-block-catalog/biome130/raw-logs-119-121.mjs",
  "./src/auto-block-catalog/biome130/snow-foundations.mjs",
  "./src/auto-block-catalog/biome130/snow-organics.mjs",
  "./src/auto-block-catalog/biome130/stone-101-103.mjs",
  "./src/auto-block-catalog/biome130/stone-104-106.mjs",
  "./src/auto-block-catalog/biome130/stone-107-109.mjs",
  "./src/auto-block-catalog/biome130/stone-110-112.mjs",
  "./src/auto-block-catalog/biome130/underground-civilization-completion.mjs",
  "./src/auto-block-catalog/biome130/underground-civilization-details.mjs",
  "./src/auto-block-catalog/biome130/underground-civilization-foundations.mjs",
  "./src/biome130-registry.mjs",
  "./src/block-packs/pack-1/builder-handoff.mjs",
  "./src/block-packs/pack-1/construction-stress.mjs",
  "./src/block-packs/pack-1/core-masonry.mjs",
  "./src/block-packs/pack-1/fixture.mjs",
  "./src/block-packs/pack-1/floral-fixture.mjs",
  "./src/block-packs/pack-1/floral-forms.mjs",
  "./src/block-packs/pack-1/floral-gallery.mjs",
  "./src/block-packs/pack-1/foliage-fixture.mjs",
  "./src/block-packs/pack-1/foliage-gallery.mjs",
  "./src/block-packs/pack-1/gallery.mjs",
  "./src/block-packs/pack-1/garden-components.mjs",
  "./src/block-packs/pack-1/garden-fixture.mjs",
  "./src/block-packs/pack-1/garden-gallery.mjs",
  "./src/block-packs/pack-1/manifest.json",
  "./src/block-packs/pack-1/physical-foliage.mjs",
  "./src/block-packs/pack-1/stone-shape-fixture.mjs",
  "./src/block-packs/pack-1/stone-shape-gallery.mjs",
  "./src/block-packs/pack-1/stone-shapes.mjs",
  "./src/block-packs/pack-1/structure-handoff.mjs",
  "./src/block-packs/pack-1/webgl2-candidates.mjs",
  "./src/block-packs/pack-1/webgl2-preview.mjs",
  "./src/block-packs/pack-2/definitions.mjs",
  "./src/block-packs/pack-2/ground.mjs",
  "./src/block-packs/pack-2/infrastructure.mjs",
  "./src/block-packs/pack-2/joinery.mjs",
  "./src/block-packs/pack-2/manifest.json",
  "./src/block-packs/pack-2/water.mjs",
  "./src/block-packs/pack-3/catalog.mjs",
  "./src/block-packs/pack-3/fixture.mjs",
  "./src/block-packs/pack-3/fortified-fixture.mjs",
  "./src/block-packs/pack-3/fortified-pieces.mjs",
  "./src/block-packs/pack-3/manifest.mjs",
  "./src/block-packs/pack-3/monumental-fixture.mjs",
  "./src/block-packs/pack-3/monumental-pieces.mjs",
  "./src/block-packs/pack-3/ornamental-fixture.mjs",
  "./src/block-packs/pack-3/ornamental-pieces.mjs",
  "./src/block-packs/pack-3/roof-geometry-fixture.mjs",
  "./src/block-packs/pack-3/roof-geometry.mjs",
  "./src/block-packs/pack-3/roofing-materials.mjs",
  "./src/block-packs/pack-4/builder-handoff.mjs",
  "./src/block-packs/pack-4/fixture.mjs",
  "./src/block-packs/pack-4/furnishings.mjs",
  "./src/block-packs/pack-4/gpu-residency-budget.mjs",
  "./src/block-packs/pack-4/hearth-civic.mjs",
  "./src/block-packs/pack-4/interaction-handoff.mjs",
  "./src/block-packs/pack-4/lighting.mjs",
  "./src/block-packs/pack-4/manifest.json",
  "./src/block-packs/pack-4/preview-utils.mjs",
  "./src/block-packs/pack-4/windows.mjs",
  "./src/block-packs/pack-5/architectural-surfaces.mjs",
  "./src/block-packs/pack-5/civic-interiors.mjs",
  "./src/block-packs/pack-5/fixture.mjs",
  "./src/block-packs/pack-5/fortified-specialties.mjs",
  "./src/block-packs/pack-5/manifest.json",
  "./src/block-packs/pack-5/residential-furnishings.mjs",
  "./src/block-packs/pack-5/shop-workshop.mjs",
  "./src/block-packs/pack-5/workshop-fixtures.mjs",
  "./src/blocks.mjs",
  "./src/branched-cave-world.mjs",
  "./src/builder-assets/biome130.mjs",
  "./src/builder-assets/manual-five-pack-live.mjs",
  "./src/builder-assets/manual-five-pack.mjs",
  "./src/builder-assets/manual14-layer.mjs",
  "./src/builder-assets/manual14-mesh.mjs",
  "./src/builder-assets/pack2.mjs",
  "./src/builder-assets/pack3-live.mjs",
  "./src/builder-assets/pack3-palette.mjs",
  "./src/builder-assets/pack3-portable.mjs",
  "./src/builder-assets/pack3-runtime.mjs",
  "./src/builder-assets/pack3.mjs",
  "./src/camera.mjs",
  "./src/canopy-walkway.mjs",
  "./src/canopy.mjs",
  "./src/carved-masonry.mjs",
  "./src/carved-trim.mjs",
  "./src/cave-candidate-validation.mjs",
  "./src/cave-runes.mjs",
  "./src/cave-thresholds.mjs",
  "./src/chunks.mjs",
  "./src/crafted-timber.mjs",
  "./src/creative-integration/g2-control-state.mjs",
  "./src/creative-integration/g2-flight.mjs",
  "./src/creative-integration/g2-landing.mjs",
  "./src/creative-integration/g2-streaming.mjs",
  "./src/creative-integration/registry-snapshot.mjs",
  "./src/creative-integration/registry-validation.mjs",
  "./src/depth-mesh.mjs",
  "./src/depth.mjs",
  "./src/edit-echo.mjs",
  "./src/edit-feedback.mjs",
  "./src/experimental-cave-route.mjs",
  "./src/exploration-cues.mjs",
  "./src/exploration-map.mjs",
  "./src/fallen-giant.mjs",
  "./src/foreground.mjs",
  "./src/gpu-pipeline.mjs",
  "./src/gpu-recovery.mjs",
  "./src/grotto.mjs",
  "./src/grove.mjs",
  "./src/input.mjs",
  "./src/interactions/shape-edit-transaction.mjs",
  "./src/layout.mjs",
  "./src/live-voxel-world.mjs",
  "./src/app-update.mjs",
  "./src/gameplay-recorder.mjs",
  "./src/main.mjs",
  "./src/manual-biomes/desert-m3.mjs",
  "./src/manual-biomes/exploration-ink.mjs",
  "./src/manual-biomes/m2-runtime-bridge.mjs",
  "./src/manual-biomes/m5-offline-registration.mjs",
  "./src/manual-biomes/mountain-pass-v5.mjs",
  "./src/manual-biomes/v6-balanced-biomes.mjs",
  "./src/manual-biomes/overland-walk-m5.mjs",
  "./src/manual-biomes/profile-storage.mjs",
  "./src/manual-biomes/profile-world.mjs",
  "./src/manual-biomes/shoulder-traversal.mjs",
  "./src/manual-biomes/three-regions-m4.mjs",
  "./src/meadow.mjs",
  "./src/mirror.mjs",
  "./src/moonbells.mjs",
  "./src/natural-geology-kit.mjs",
  "./src/pack2-integration.mjs",
  "./src/pack2-world.mjs",
  "./src/pack5-integration/blueprint-handoff.mjs",
  "./src/pack5-integration/catalog.mjs",
  "./src/pack5-integration/construction-layer.mjs",
  "./src/pack5-integration/final-integration-handoff.json",
  "./src/pack5-integration/live-adapter.mjs",
  "./src/pack5-integration/placement-preflight.mjs",
  "./src/pack5-integration/sidecar-storage.mjs",
  "./src/pack5-integration/terrain-buffer.mjs",
  "./src/persistence.mjs",
  "./src/physical-construction-kit.mjs",
  "./src/physics.mjs",
  "./src/pilgrim-court-sites.mjs",
  "./src/preflight.mjs",
  "./src/render-budget.mjs",
  "./src/ridge-strata.mjs",
  "./src/rotunda-approach-stones.mjs",
  "./src/ruined-bridge.mjs",
  "./src/seeds.mjs",
  "./src/shape-prototypes.mjs",
  "./src/sky.mjs",
  "./src/south-gallery-cave.mjs",
  "./src/stone-rotunda-v2.mjs",
  "./src/stone-rotunda.mjs",
  "./src/storybook-materials.mjs",
  "./src/storybook-roof.mjs",
  "./src/surface-regions/regions.mjs",
  "./src/vault.mjs",
  "./src/voxel-canopy-gate.mjs",
  "./src/voxel-forest-twinwood.mjs",
  "./src/voxel-groves.mjs",
  "./src/voxel-landmarks.mjs",
  "./src/voxel-orientation-edit-guard.mjs",
  "./src/voxel-orientation-envelope.mjs",
  "./src/voxel-orientation-sidecar.mjs",
  "./src/voxel-pilgrim-court.mjs",
  "./src/voxel-ruined-arch.mjs",
  "./src/voxel-shape-fit.mjs",
  "./src/voxel-shape-interactions.mjs",
  "./src/voxel-trees.mjs",
  "./src/voxel-watchtower.mjs",
  "./src/voxel.mjs",
  "./src/west-gallery-world.mjs",
  "./src/world-atmosphere/canopy-bridges.mjs",
  "./styles.css",
  "./sw-m5.js"
];
const assetUrls=SOURCE_ASSETS.map(p=>new URL(p,self.registration.scope).href);
const allowed=new Set(assetUrls);

self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE_NAME);
    try {
      // Fetch all assets from a query-versioned origin URL. An older active
      // cache-first worker can otherwise serve OLD index.html/main.mjs to this
      // new install. Old workers deliberately bypass any query request.
      // Cache under CANONICAL query-free URLs for genuine offline operation.
      // Fail atomically if even one source is missing; preserve previous-good.
      for(let i=0;i<assetUrls.length;i+=12){
        const batch=await Promise.all(assetUrls.slice(i,i+12).map(async url=>{
          try {
            const freshUrl=new URL(url);
            freshUrl.searchParams.set('mw-cache-install',CACHE_NAME);
            const response=await fetch(new Request(freshUrl.href,{
              cache:'reload',credentials:'same-origin'
            }));
            if(!response.ok||response.type==='opaque')
              throw Error('HTTP '+response.status);
            return {url,response};
          }catch(error){
            throw Error('Fresh source unavailable '+url+': '+String(error));
          }
        }));
        // Wait for ALL writes before a failure can delete the candidate cache.
        // Other in-flight writes must never leave a partial cache behind.
        const written=await Promise.allSettled(batch.map(({url,response})=>
          cache.put(url,response).catch(error=>{
            throw Error('Cannot cache '+url+': '+String(error));
          })));
        const failed=written.find(result=>result.status==='rejected');
        if(failed)throw failed.reason;
      }
      // Cache existence is not installation success. Prove the entire atomic
      // shell, including authentic REC and same-install release marker, first.
      const files=await cache.keys();
      const index=await cache.match(new URL('index.html',self.registration.scope).href);
      const html=index?await index.text():'';
      if(files.length!==allowed.size||
          !html.includes('data-mw-release="'+ASSET_RELEASE+'"')||
          !html.includes('id="captureToggle"'))
        throw Error('Incomplete/mismatched PWA shell: cached='+
          files.length+' expected='+allowed.size+
          ' index='+Boolean(index));
      // Only a fully verified new shell can replace the previous-good worker.
      await self.skipWaiting();
    }catch(error){
      console.error('MYTHWROUGHT PWA ATOMIC INSTALL FAILED',String(error));
      await caches.delete(CACHE_NAME);
      throw error;
    }
  })());
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>
      k.startsWith(CACHE_PREFIX)&&k!==CACHE_NAME).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch',event=>{
  const req=event.request,url=new URL(req.url);
  if(req.method!=='GET'||url.origin!==self.location.origin||
      !url.href.startsWith(self.registration.scope))return;
  const root=new URL('./',self.registration.scope);
  const index=new URL('index.html',root);
  const canonical=new URL(url.href);
  canonical.search='';canonical.hash='';
  // Ordinary Home Screen boot uses ONLY the atomically verified cache;
  // never attempt a network request during an offline M5 reload.
  // Explicit user-initiated ?mw-refresh=release is online-first.
  if(req.mode==='navigate'&&(canonical.href===root.href||
      canonical.href===index.href)){
    const explicitRefresh=url.searchParams.size===1&&
      url.searchParams.get('mw-refresh')===ASSET_RELEASE;
    event.respondWith((async()=>{
      const cache=await caches.open(CACHE_NAME);
      const cached=async()=>await cache.match(index.href)||
        await cache.match(root.href)||Response.error();
      if(explicitRefresh){
        if(self.navigator.onLine===false)return cached();
        try{
          const fresh=await fetch(req,{cache:'no-store'});
          if(fresh.ok&&fresh.type!=='opaque')return fresh;
        }catch(_){}
      }
      return await cached();
    })());return;
  }
  // Only exact release-pinned module/CSS URLs are mapped to cached source
  // for offline use; other query requests bypass this worker.
  const pinned=url.searchParams.size===1&&
    url.searchParams.get('mw-release')===ASSET_RELEASE&&
    (canonical.href===new URL('styles.css',root).href||
      canonical.href===new URL('src/main.mjs',root).href);
  if(url.search&&!pinned)return;
  if(!allowed.has(canonical.href))return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE_NAME);
    return await cache.match(canonical.href,{ignoreVary:false})||fetch(req);
  })());
});
