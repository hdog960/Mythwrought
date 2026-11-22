// MYTHWROUGHT Floating Islands: physically grounded natural flora authority.
// Original biome130 registry is injected by an actual original-source host.
// No invented IDs, generated islands, saved edits or renderer changes.
import {planCertifiedSkyVegetation} from './sky-certified-flora.mjs';
const fail=s=>{throw new TypeError('Sky original flora authority: '+s);};
const legal=Number.isSafeInteger;
const FULL_CUBE=Object.freeze([0,0,0,1,1,1]);
const LEGACY_GROWTH_SURFACES=new Set([1,2,3,4,6,8]);
export function createOriginalSkyFloraAuthority({biome130Block,isBiome130BlockId,
  materials}={}){
  if(typeof biome130Block!=='function'||typeof isBiome130BlockId!=='function'||
     !materials||['assetFor','isPhysicalAsset','filterSupportedVegetation']
       .some(k=>typeof materials[k]!=='function'))
    fail('authentic source registry and approved flora roles required');
  const blockFor=id=>{
    if(!legal(id)||id<=0||id>65534)return null;
    if(LEGACY_GROWTH_SURFACES.has(id))
      return Object.freeze({solid:true,boxes:Object.freeze([FULL_CUBE])});
    // Cutout legacy leaves, crystal and AIR are not valid rooted soil.
    if(id<256||!isBiome130BlockId(id))return null;
    const b=biome130Block(id);
    if(!b||b.blockId!==id||typeof b.solid!=='boolean'||
       !Array.isArray(b.boxes)||!b.boxes.length)
      fail('source registry mismatched a physical block identity');
    return Object.freeze({solid:b.solid,boxes:b.boxes});
  };
  return Object.freeze({blockFor,
    assetFor:materials.assetFor,
    isPhysicalAsset:materials.isPhysicalAsset,
    filterSupportedVegetation:materials.filterSupportedVegetation});
}
// Bind to the ORIGINAL physical host's sky + AIR edits view: the caller cannot
// accidentally plan foliage using a stale separate sky-only read callback.
export function planOriginalSkyEcology({physicalHost,source,materials,seed,plan,
  maxCells=512}={}){
  if(!physicalHost?.world||typeof physicalHost.world.get!=='function'||
     !source||typeof source.readIdentity!=='function'||
     typeof source.readWorldRevision!=='function'||
     typeof source.sectionRevision!=='function'||
     typeof source.isProtectedCell!=='function'||
     typeof source.verifyCompleteIsland!=='function'||
     source.physicalWorld!==physicalHost.world)
    fail('actual merged original world and generator revision host required');
  const liveSource=Object.freeze({
    readIdentity:()=>source.readIdentity(),
    readWorldRevision:()=>source.readWorldRevision(),
    sectionRevision:key=>source.sectionRevision(key),
    isProtectedCell:(x,y,z)=>source.isProtectedCell(x,y,z),
    verifyCompleteIsland:plan=>source.verifyCompleteIsland(plan),
    get:(x,y,z)=>physicalHost.world.get(x,y,z)
  });
  return planCertifiedSkyVegetation({seed,plan,source:liveSource,materials,maxCells});
}
