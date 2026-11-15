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

// Explicit fresh-world column composer for a future guarded terrain-reader seam.
// Unlike the veneer, this can construct real mountain ridges and dune relief.
// The caller MUST gate this on a brand-new, unvisited world profile and check
// edits/landmarks before invoking. No global generator or save changes here.
export function surfaceBiomeNewWorldColumn(x,y,z,seed=179,{
  enabled=false,baseline,hasEdit=false,hasLandmark=false,profileIsFresh=false
}={}){
  if(!enabled||!profileIsFresh||hasEdit||hasLandmark||
     ![x,y,z].every(Number.isInteger)||!Number.isInteger(seed)||
     y<LEGACY_WORLD_MIN_Y||y>WORLD_MAX_Y)return null;
  const biome=surfaceBiomeAt(x,z,seed);
  if(!biome||biome.weight<.35)return null;
  const oldTop=terrainHeight(x,z,seed);
  const target=surfaceBiomeHeight(x,z,seed);
  // Never fill or erase a legacy cave/entrance or overwrite an authored cell.
  // Only construct above the original natural ground, with a stone/soil base.
  if(y>oldTop){
    if(baseline!==0||y>target||y>WORLD_MAX_Y-3)return null;
    // Raised terrain may bridge over an existing cave mouth. Require caller
    // to certify that this column is free of legacy openings and structures.
    return null;
  }
  return surfaceBiomeOverlay(x,y,z,seed,{
    enabled:true,baseline,hasEdit:false,isNaturalGround:baseline===1||baseline===2
  });
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
