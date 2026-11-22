// MYTHWROUGHT Floating Islands: actual physical, source-fenced vegetation.
// Consumes a COMPLETE source-verified semantic island vegetation plan; never
// generates islands or changes original terrain, sky edits, saves or GPU state.
// Original biome130 asset IDs, solidity and box shapes are the only authority.
import {skyIslandSectionForY,skyIslandMeshKey,SKY_ISLAND_MIN_Y,SKY_ISLAND_MAX_Y}
  from './sky-runtime-adapter.mjs';
import {planPhysicalSkyVegetation} from './sky-vegetation-physical.mjs';

export const SKY_FLORA_MAX_REVISION_KEYS=512;
const safe=Number.isSafeInteger;
const token=s=>typeof s==='string'&&s.length>0&&s.length<=128;
const fail=s=>{throw new TypeError('Sky certified flora: '+s);};
const coords=p=>p&&[p.x,p.y,p.z].every(safe)&&Math.abs(p.x)<=10000000&&
  Math.abs(p.z)<=10000000&&p.y>=SKY_ISLAND_MIN_Y&&p.y<=SKY_ISLAND_MAX_Y;
const loc=(x,y,z)=>x+','+y+','+z;
const uniqueSorted=arr=>Object.freeze([...new Set(arr)].sort());
function readIdentity(source){
  const id=source.readIdentity();
  if(!id||!token(id.worldToken)||!token(id.generatorFingerprint)||
    !safe(id.epoch)||id.epoch<0||!safe(id.seed)||id.seed!==(id.seed|0))
    fail('invalid original world/generator identity');
  return Object.freeze({worldToken:id.worldToken,seed:id.seed,
    generatorFingerprint:id.generatorFingerprint,epoch:id.epoch});
}
const same=(a,b)=>a.worldToken===b.worldToken&&a.seed===b.seed&&
  a.generatorFingerprint===b.generatorFingerprint&&a.epoch===b.epoch;
function groundMaterialSupportsTree(id,physical){
  if(!safe(id)||id<=0||id>65534)return false;
  const material=physical.blockFor(id);
  if(!material||material.solid!==true||!Array.isArray(material.boxes))return false;
  // Real stable crown/trunk support must have an actual top face supporting
  // most of the rooted center; thin leaf sprays, crystal posts, and fake full
  // cubes are NOT accepted simply because their voxel ID is nonzero.
  for(const box of material.boxes)
    if(!Array.isArray(box)||box.length!==6||box.some(n=>typeof n!=='number'||
      !Number.isFinite(n)||n<0||n>1)||box[0]>=box[3]||box[1]>=box[4]||box[2]>=box[5])
      fail('invalid original physical support boxes');
  let supported=0;
  for(let ix=0;ix<4;ix++)for(let iz=0;iz<4;iz++){
    const x=.3125+ix*.125,z=.3125+iz*.125;
    if(material.boxes.some(b=>b[4]>=.999999&&x>=b[0]&&x<=b[3]&&z>=b[2]&&z<=b[5]))
      supported++;
  }
  return supported>=12;
}
function footprint(placements){
  const result=[];
  for(const p of placements){
    if(!coords(p))fail('invalid bounded original island anchor');
    const offsets=p.group==='canopy'?3:0,top=p.group==='canopy'?9:0;
    const minCx=Math.floor((p.x-offsets)/16),maxCx=Math.floor((p.x+offsets)/16);
    const minCz=Math.floor((p.z-offsets)/16),maxCz=Math.floor((p.z+offsets)/16);
    for(let cx=minCx;cx<=maxCx;cx++)for(let cz=minCz;cz<=maxCz;cz++)
      for(let y=Math.max(SKY_ISLAND_MIN_Y,p.y-1);y<=Math.min(SKY_ISLAND_MAX_Y,p.y+top);y+=16){
        const section=skyIslandSectionForY(y);
        if(section!==null)result.push(skyIslandMeshKey(cx,cz,section));
      }
    // The final endpoint may sit in another 16-high upper slice.
    const topSection=skyIslandSectionForY(Math.min(SKY_ISLAND_MAX_Y,p.y+top));
    if(topSection!==null)for(let cx=minCx;cx<=maxCx;cx++)
      for(let cz=minCz;cz<=maxCz;cz++)result.push(skyIslandMeshKey(cx,cz,topSection));
  }
  const keys=uniqueSorted(result);
  if(keys.length>SKY_FLORA_MAX_REVISION_KEYS)fail('vegetation revision halo exceeds budget');
  return keys;
}
function revision(source,keys){
  const entries=[];
  for(const key of keys){
    const rev=source.sectionRevision(key);
    if(!safe(rev)||rev<0)fail('physical sky section revision missing');
    entries.push(Object.freeze([key,rev]));
  }
  return Object.freeze(entries);
}
function identical(a,b){return a.length===b.length&&a.every((r,i)=>
  r[0]===b[i][0]&&r[1]===b[i][1]);}
export function planCertifiedSkyVegetation({seed,plan,source,materials,
  maxCells=512}={}){
  if(!safe(seed)||!plan||!Array.isArray(plan.placements)||plan.placements.length>64||
     !source||typeof source.readIdentity!=='function'||
     typeof source.readWorldRevision!=='function'||
     typeof source.sectionRevision!=='function'||typeof source.get!=='function'||
     typeof source.isProtectedCell!=='function'||typeof source.verifyCompleteIsland!=='function'||
     !materials||typeof materials.blockFor!=='function'||
     typeof materials.filterSupportedVegetation!=='function'||
     typeof materials.assetFor!=='function'||typeof materials.isPhysicalAsset!=='function')
    fail('complete island physical source and original material registry required');
  const before=readIdentity(source),worldRevision=source.readWorldRevision();
  if(seed!==before.seed)fail('physical island seed differs from original world');
  if(!safe(worldRevision)||worldRevision<0)fail('missing original world edit revision');
  // Snapshot/freeze the full source-certified island descriptor so callbacks
  // cannot rewrite anchor coordinates after admission in this synchronous pass.
  const sourcePlan=Object.freeze({...plan,placements:Object.freeze(
    plan.placements.map(p=>Object.freeze({...p})))});
  // Surface certification must itself occur inside the source-identity fence.
  if(source.verifyCompleteIsland(sourcePlan)!==true)
    fail('incomplete or unverified original island surface');
  const registered=materials.filterSupportedVegetation(sourcePlan);
  if(!registered||!Array.isArray(registered.placements)||
     registered.placements.length>64||
     !safe(registered.omitted)||registered.omitted<0||
     registered.placements.length+registered.omitted!==plan.placements.length)
    fail('untrusted physical flora registration filter');
  const sectionKeys=footprint(registered.placements);
  const initialRevs=revision(source,sectionKeys);
  const valid=[],unsupported=[];
  for(const p of registered.placements){
    const supportY=p.y-1;
    const block=source.get(p.x,supportY,p.z);
    if(!safe(block)||block<0||block>65534)fail('invalid authentic root cell');
    if(source.isProtectedCell(p.x,supportY,p.z)||
       !groundMaterialSupportsTree(block,materials)){
      unsupported.push(Object.freeze({x:p.x,y:p.y,z:p.z,kind:p.kind}));
      continue;
    }
    valid.push(p);
  }
  const physical=planPhysicalSkyVegetation({seed,plan:{placements:valid},
    sourceGet:source.get,assetFor:materials.assetFor,
    isPhysicalAsset:materials.isPhysicalAsset,
    isProtectedCell:source.isProtectedCell,maxCells});
  // Revision checks run AFTER all potentially mutating source/shape callbacks.
  const after=readIdentity(source),worldAfter=source.readWorldRevision();
  const finalRevs=revision(source,sectionKeys);
  if(!same(before,after)||worldRevision!==worldAfter||
     !identical(initialRevs,finalRevs))
    fail('generator, source section or authored edit changed during foliage planning');
  return Object.freeze({
    candidate:physical,omittedUnregistered:registered.omitted,
    omittedUnsupportedRoots:Object.freeze(unsupported),
    sourceProof:Object.freeze({...before,worldRevision,
      sectionRevisions:initialRevs}),
    sourceCells:plan.placements.length,
    worldWrites:0,saveWrites:0,renderOnlyMeshes:0,
    shadowPasses:0
  });
}
