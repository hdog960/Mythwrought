// :24 four-region surface composition. Opt-in for NEW worlds only until
// creator-approved runtime wiring; never silently reroll existing schema-1 saves.
import {BLOCK,terrainHeight,worldKey} from './voxel.mjs';
import {WORLD_MAX_Y,LEGACY_WORLD_MIN_Y} from './depth.mjs';
import {biome130Block} from './biome130-registry.mjs';
export const SURFACE_REGIONS=Object.freeze([
  Object.freeze({name:'desert',x:192,z:0,radius:82,top:256,sub:258,rock:261}),
  Object.freeze({name:'snow',x:-192,z:0,radius:82,top:272,sub:272,rock:273}),
  Object.freeze({name:'mountain',x:0,z:192,radius:82,top:302,sub:303,rock:304}),
  Object.freeze({name:'enchanted',x:0,z:-192,radius:82,top:286,sub:286,rock:290})
]);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function jitter(x,z,seed){let n=Math.imul((x|0)+seed,374761393)^Math.imul((z|0)-seed,668265263);
 n=Math.imul(n^(n>>>13),1274126177);return ((n^(n>>>16))>>>0)/4294967295;}
function smooth(t){return t*t*(3-2*t);}
function field(x,z,seed){const X=x/28,Z=z/28,a=Math.floor(X),b=Math.floor(Z),u=smooth(X-a),v=smooth(Z-b);
 const p=jitter(a,b,seed)*(1-u)+jitter(a+1,b,seed)*u;
 const q=jitter(a,b+1,seed)*(1-u)+jitter(a+1,b+1,seed)*u;
 return p*(1-v)+q*v;}
export function surfaceRegionAt(x,z,seed=179){
 if(![x,z,seed].every(Number.isFinite))throw Error('Invalid region coordinates');
 const offset=(field(x,z,seed+701)-.5)*16;
 let best=null;
 for(const region of SURFACE_REGIONS){
  const distance=Math.hypot(x-region.x,z-region.z);
  const strength=clamp((region.radius+offset-distance)/20,0,1);
  if(strength>(best?.strength??0))best={name:region.name,strength,region};
 }
 return best??{name:'temperate',strength:0,region:null};
}
export function surfaceHeightAt(x,z,seed=179){
 const base=terrainHeight(x,z,seed),{name,strength}=surfaceRegionAt(x,z,seed);
 const wave=field(x,z,seed+1601),fine=field(x*2,z*2,seed+1701);
 let change=0;
 if(name==='desert')change=Math.round((wave-.5)*5*strength);
 if(name==='snow')change=Math.round((wave-.5)*3*strength);
 if(name==='enchanted')change=Math.round((wave-.5)*2*strength);
 if(name==='mountain')change=Math.round((2+wave*5+fine*2)*strength);
 return clamp(base+change,2,WORLD_MAX_Y-3);
}
export function surfaceRegionBlock(x,y,z,seed,original){
 const {name,strength,region}=surfaceRegionAt(x,z,seed);
 if(!region||strength<.25||y<LEGACY_WORLD_MIN_Y||y>WORLD_MAX_Y)return original;
 const h=surfaceHeightAt(x,z,seed),old=terrainHeight(x,z,seed);
 // Transition rim retains the original substrate. Full material change is
 // restricted to the strong interior, preserving gradual landscape edges.
 if(y>h)return y>old?original:BLOCK.AIR;
 if(y<old-5)return original;
 if(strength<.7)return y>old?BLOCK.STONE:original;
 if(y===h)return region.top;
 if(y>=h-2)return region.sub;
 if(y>=h-5)return region.rock;
 return original;
}
export function surfaceRegionWorld(world,{newWorld=false}={}){
 if(!world||typeof world.get!=='function'||!Number.isInteger(world.seed))
  throw Error('Expected a seeded voxel world');
 if(newWorld!==true)throw Error('Surface regions require explicit new-world opt-in');
 for(const region of SURFACE_REGIONS)for(const id of [region.top,region.sub,region.rock])
  biome130Block(id); // fail closed if materials have not been incorporated
 return {seed:world.seed,edits:world.edits,rotations:world.rotations,
  get(x,y,z){
   const original=world.get(x,y,z);
   if(![x,y,z].every(Number.isInteger)||world.edits?.has(worldKey(x,y,z)))return original;
   return surfaceRegionBlock(x,y,z,world.seed,original);
  },
  rotationAt:(x,y,z)=>world.rotationAt?.(x,y,z)??0
 };
}
