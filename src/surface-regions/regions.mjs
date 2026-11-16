// :24 candidate surface composition. Pure, opt-in baseline sampler; no save writes.
// Integration seam: consult surfaceBiomeBlock before legacy baseline generation
// only for explicitly new-world-enabled regions. Do NOT alter existing saves.
import {biome130Block,isBiome130BlockId} from '../biome130-registry.mjs';
import {terrainHeight} from '../voxel.mjs';
import {WORLD_MAX_Y,LEGACY_WORLD_MIN_Y} from '../depth.mjs';
const REGIONS=Object.freeze([
  {name:'desert',x:512,z:0,surface:256,subsoil:258,rock:261,salt:259},
  {name:'snow',x:0,z:512,surface:271,subsoil:272,rock:274,salt:275},
  {name:'mountain',x:-512,z:0,surface:298,subsoil:299,rock:300,salt:301},
  {name:'enchanted',x:0,z:-512,surface:283,subsoil:284,rock:286,salt:287}
]);
const smooth=t=>t*t*(3-2*t);
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function hash(x,z,seed){
 let n=Math.imul(x|0,0x7feb352d)^Math.imul(z|0,0x846ca68b)^(seed|0);
 n=Math.imul(n^(n>>>16),0x45d9f3b);return ((n^(n>>>16))>>>0)/4294967295;
}
function valueNoise(x,z,seed){
 const a=Math.floor(x),b=Math.floor(z),u=smooth(x-a),v=smooth(z-b);
 const q=(i,j)=>hash(i,j,seed);
 return (q(a,b)*(1-u)+q(a+1,b)*u)*(1-v)+
        (q(a,b+1)*(1-u)+q(a+1,b+1)*u)*v;
}
export const SURFACE_BIOME_REGIONS=Object.freeze(REGIONS.map(r=>Object.freeze({...r})));
export function surfaceBiomeAt(x,z,seed=179){
 if(!Number.isFinite(x)||!Number.isFinite(z)||!Number.isInteger(seed))return null;
 let chosen=null,weight=0;
 for(const r of REGIONS){
   const distance=Math.hypot(x-r.x,z-r.z);
   const warped=distance+(valueNoise(x/64,z/64,seed+31)-.5)*34;
   const w=1-smooth(clamp((warped-96)/72,0,1));
   if(w>weight){weight=w;chosen=r;}
 }
 return weight>0?{name:chosen.name,weight,center:[chosen.x,chosen.z]}:null;
}
export function surfaceBiomeHeight(x,z,seed=179){
 const old=terrainHeight(x,z,seed),b=surfaceBiomeAt(x,z,seed);
 if(!b)return old;
 const n=valueNoise(x/24,z/24,seed+811);
 const ridges=1-Math.abs(2*valueNoise(x/47,z/47,seed+431)-1);
 const relief=b.name==='mountain'?Math.floor(4+8*ridges+2*n):
              b.name==='desert'?Math.floor(2+3*n):
              b.name==='snow'?Math.floor(2+3*n):
              Math.floor(1+2*n);
 // Blend over a 72-block shoulder, keeping the protected spawn unchanged.
 return clamp(Math.round(old+(relief-old+3)*b.weight),2,WORLD_MAX_Y-3);
}
export function surfaceBiomeBlock(x,y,z,seed=179,{enabled=false}={}){
 if(!enabled||![x,y,z].every(Number.isInteger)||y<LEGACY_WORLD_MIN_Y||
    y>WORLD_MAX_Y)return null;
 const b=surfaceBiomeAt(x,z,seed);
 if(!b||b.weight<.35)return null;
 const r=REGIONS.find(r=>r.name===b.name);
 const top=surfaceBiomeHeight(x,z,seed);
 if(y>top)return null; // Never erase existing legacy terrain or cave entrances.
 // Preserve original stone foundation, caves and deep substrate: caller must
 // apply only to unedited, previously solid topsoil and never to cave AIR.
 // Only offer a bounded surface veneer; never replace the cave-bearing foundation.
 if(y<top-2)return null;
 const id=y===top?r.surface:r.subsoil;
 if(!isBiome130BlockId(id)||!biome130Block(id).solid)
   throw Error('Unregistered or non-solid surface material '+id);
 return id;
}

// Safe opt-in adapter for a future new-world terrain reader. Null means
// defer to the unchanged existing world; never manufacture AIR or erase edits.
// Caller supplies the exact pre-overlay natural/landmark voxel and edit status.
// Candidate-only, non-destructive veneer for *natural* legacy ground.
// Baseline AIR, ore, wood, landmarks, user edits, deepstone and stone are
// never converted. The integrator must additionally prove a cell is natural
// (not a structure) before invoking this function in a new-world reader.
export function surfaceBiomeOverlay(x,y,z,seed=179,{
  enabled=false,baseline,hasEdit=false,isNaturalGround=false
}={}){
  if(!enabled||hasEdit||!isNaturalGround||
     ![x,y,z].every(Number.isInteger)||!Number.isInteger(seed)||
     (baseline!==1&&baseline!==2))return null;
  const b=surfaceBiomeAt(x,z,seed);
  if(!b||b.weight<.35)return null;
  const legacyTop=terrainHeight(x,z,seed);
  if(y>legacyTop||y<legacyTop-2)return null;
  // Deterministic feathering across the biome boundary. This does not
  // introduce geometry, destroy legacy caves or alter terrain elevation.
  const coverage=clamp((b.weight-.35)/.4,0,1);
  if(hash(x,z,seed+907)>coverage)return null;
  const r=REGIONS.find(region=>region.name===b.name);
  const id=y===legacyTop?r.surface:r.subsoil;
  if(!isBiome130BlockId(id)||!biome130Block(id).solid)
    throw Error('Unregistered or non-solid surface material '+id);
  return id;
}

// Pure new-world elevation plan, deliberately separate from voxel placement.
// A manual integrator must first prove entire-column safety, then apply
// these bounded layers as a unit so no raised shelf floats over a cave.
export function surfaceBiomeElevationPlan(x,z,seed=179,{
  enabled=false,profileIsFresh=false,columnClear=false
}={}){
  if(!enabled||!profileIsFresh||!columnClear||
     ![x,z].every(Number.isInteger)||!Number.isInteger(seed))return null;
  const biome=surfaceBiomeAt(x,z,seed);
  if(!biome||biome.weight<.35)return null;
  const oldTop=terrainHeight(x,z,seed);
  const top=surfaceBiomeHeight(x,z,seed);
  if(top<=oldTop)return null;
  const material=REGIONS.find(r=>r.name===biome.name);
  if(![material.surface,material.subsoil,material.rock].every(id=>
    isBiome130BlockId(id)&&biome130Block(id).solid))return null;
  const layers=[];
  for(let y=oldTop+1;y<=top;y++)
    layers.push(Object.freeze({y,id:y===top?material.surface:
      y>=top-2?material.subsoil:material.rock}));
  return Object.freeze({name:biome.name,x,z,oldTop,top,
    layers:Object.freeze(layers)});
}


// Prepare an all-or-nothing new-world column write set. The integrator may
// commit these writes only after verifying that the chunk has never been
// generated or persisted. A missing callback is fail-closed, not permission.
// This deliberately leaves the underlying voxel reader and save format alone.
export function surfaceBiomeFreshColumn(x,z,seed=179,{
  enabled=false,profileIsFresh=false,readBaseline=null,hasEdit=null,
  isProtected=null
}={}){
  if(!enabled||!profileIsFresh||typeof readBaseline!=='function'||
     typeof hasEdit!=='function'||typeof isProtected!=='function'||
     !Number.isInteger(x)||!Number.isInteger(z)||!Number.isInteger(seed))
    return null;
  const b=surfaceBiomeAt(x,z,seed);
  if(!b||b.weight<.35)return null;
  const oldTop=terrainHeight(x,z,seed);
  // Never lower an existing natural surface; preserve its physical height.
  const newTop=Math.max(oldTop,surfaceBiomeHeight(x,z,seed));
  const r=REGIONS.find(region=>region.name===b.name);
  const writes=[];
  // Real legacy terrain includes STONE (3) beneath the dirt veneer.\n  // Its inclusion is safe only for fresh, unedited, unprotected columns;\n  // AIR and non-natural landmark materials remain hard blockers.\n  // Entire changed envelope is checked before a single write is returned.
  // Protect a headroom cell above the new surface, including landmarks.
  for(let y=oldTop-2;y<=newTop+1;y++){
    const baseline=readBaseline(x,y,z);
    if(!Number.isInteger(baseline)||hasEdit(x,y,z)||isProtected(x,y,z))
      return null;
    if(y>oldTop&&baseline!==0)return null;
    if(y<=oldTop&&baseline!==1&&baseline!==2&&baseline!==3)return null;
  }
  const coverage=clamp((b.weight-.35)/.4,0,1);
  for(let y=oldTop-2;y<=newTop;y++){
    const baseline=readBaseline(x,y,z);
    let id=null;
    if(y>oldTop){
      id=y===newTop?r.surface:y>=newTop-2?r.subsoil:r.rock;
    }else if(hash(x,z,seed+907)<=coverage){
      id=y===newTop?r.surface:y>=newTop-2?r.subsoil:r.rock;
    }
    if(id===null||id===baseline)continue;
    if(!isBiome130BlockId(id)||!biome130Block(id).solid)return null;
    writes.push(Object.freeze({x,y,z,from:baseline,to:id}));
  }
  return Object.freeze({name:b.name,x,z,oldTop,top:newTop,
    writes:Object.freeze(writes)});
}


// A renderable VoxelWorld-compatible view for a *new, explicitly opted-in*
// world profile. The underlying world, its edits and schema-1 save remain
// untouched. The manual integrator can pass this view to meshChunk and the
// collision/raycast readers only after selecting a fresh-world profile.
// Never infer freshness from an empty edits map: an explored save can be empty.
export function createSurfaceBiomeWorldView(world,{
  enabled=false,profileIsFresh=false,isProtected=null,maxCachedColumns=1024
}={}){
  if(!enabled||!profileIsFresh||!world||
     typeof world.naturalAndLandmarkBlock!=='function'||
     typeof world.get!=='function'||typeof isProtected!=='function'||
     !Number.isInteger(maxCachedColumns)||maxCachedColumns<1||
     maxCachedColumns>4096||!Number.isInteger(world.seed)||
     !(world.edits instanceof Map)||world.edits.size!==0||
     !(world.rotations instanceof Map)||world.rotations.size!==0)return null;
  const cache=new Map();
  // The fresh-profile eligibility gate is checked only when the view is
  // constructed. Later edits must not remove already visible natural terrain.
  // Individual edited cells always defer to the authoritative world reader.
  // Persistence of the opt-in profile flag remains a manual integrator gate.
  const planAt=(x,z)=>{
    const key=x+','+z;
    if(cache.has(key))return cache.get(key);
    const plan=surfaceBiomeFreshColumn(x,z,world.seed,{
      enabled:true,profileIsFresh:true,
      readBaseline:(cx,y,cz)=>world.naturalAndLandmarkBlock(cx,y,cz),
      // The baseline is immutable for a fresh profile. Post-creation edits\n      // are masked per-cell by get(), not used to invalidate a column.\n      hasEdit:()=>false,
      isProtected
    });
    const byY=plan?new Map(plan.writes.map(w=>[w.y,w.to])):null;
    cache.set(key,byY);
    if(cache.size>maxCachedColumns)cache.delete(cache.keys().next().value);
    return byY;
  };
  return Object.freeze({
    seed:world.seed,
    get(x,y,z){
      const original=world.get(x,y,z);
      if(![x,y,z].every(Number.isInteger)||world.edits.has(x+','+y+','+z)||world.rotations.has(x+','+y+','+z))
        return original;
      return planAt(x,z)?.get(y)??original;
    },
    rotationAt(x,y,z){return world.rotationAt?.(x,y,z)??0;},
    // No set/save/restore methods: the view is deliberately read-only.
    get cachedColumns(){return cache.size;},
    get active(){return true;}
  });
}
