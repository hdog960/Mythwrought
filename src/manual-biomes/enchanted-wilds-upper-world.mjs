// E2A: physical upper-world research host. No live runtime, save, worker or island generator activation.
// Reuse the paused Island Dev's exact source mesher and section namespace.
import {BLOCK,collides,raycast,meshChunk} from '../voxel.mjs';
import {ENVIRONMENT_GROUND as G,environmentGround} from '../environment-ground.mjs';
import {biome130Block,isBiome130BlockId,biome130Color} from '../biome130-registry.mjs';
import {prototypeSurfaceMesh} from '../shape-prototypes.mjs';
import {v6BiomeAt} from './v6-balanced-biomes.mjs';
import {WORLD_MIN_Y,WORLD_MAX_Y} from '../depth.mjs';
import {SKY_ISLAND_MAX_Y,skyIslandSectionForY,skyIslandSectionBounds,
  skyIslandMeshKey,skyIslandBodyRegions} from '../floating-islands/sky-runtime-adapter.mjs';
import {createSkyOriginalMaterials,createSkyOriginalWorldView} from '../floating-islands/sky-original-core.mjs';
import {meshSkyIslandSection} from '../floating-islands/sky-source-mesh.mjs';
export const WILDS_PHYSICAL_MAX_Y=SKY_ISLAND_MAX_Y;
export const WILDS_PHYSICAL_MIN_Y=WORLD_MIN_Y;
const materials=createSkyOriginalMaterials({biome130Block,isBiome130BlockId,biome130Color,environmentGround,prototypeSurfaceMesh});
const key=(x,y,z)=>x+','+y+','+z;
const coords=(x,y,z)=>[x,y,z].every(Number.isSafeInteger);
const upperId=id=>Number.isInteger(id)&&(id>=0&&id<=8||!!environmentGround(id));
// A genuine physical prototype, not a final E3 family or a populated generator.
// Full connected trunk, supported radial branch beams, two separated crowns.
export function planWildsTowerPrototype(ground,x,z,{height=28}={}){
 if(!ground||typeof ground.get!=='function'||typeof ground._columnPlan!=='function'||
    !Number.isSafeInteger(x)||!Number.isSafeInteger(z)||!Number.isInteger(height)||height<22||height>36)
   throw Error('Invalid physical tower proposal');
 const column=ground._columnPlan(x,z);
 if(!column.size||v6BiomeAt(x,z,ground.seed)?.name!=='enchanted')return null;
 const floor=Math.max(...column.keys());
 if(ground.get(x,floor,z)!==column.get(floor)||ground.get(x,floor-1,z)===BLOCK.AIR||
    floor+height+2>WILDS_PHYSICAL_MAX_Y)return null;
 const cells=new Map();
 const put=(dx,dy,dz,id)=>{
   const a=x+dx,b=floor+dy,c=z+dz,k=key(a,b,c);
   if(cells.get(k)?.[3]===G.aetherBark)return;
   cells.set(k,[a,b,c,id]);
 };
 for(let dy=1;dy<=height;dy++)put(0,dy,0,G.aetherBark);
 for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   for(let d=1;d<=3;d++)put(dx*d,height-6,dz*d,G.aetherBark);
   put(dx*3,height-5,dz*3,G.aetherBark);
   for(let d=1;d<=2;d++)put(dx*d,height-2,dz*d,G.aetherBark);
 }
 for(const [dy,r] of [[height-5,4],[height-4,4],[height-3,3],[height-1,3],[height,2],[height+1,1],[height+2,0]]){
   for(let a=-r;a<=r;a++)for(let c=-r;c<=r;c++)
    if(Math.abs(a)+Math.abs(c)<=r+1)put(a,dy,c,dy>=height-1?G.moonLeaves:G.aetherLeaves);
 }
 const rows=[...cells.values()];
 // Whole plan must be inside actual Enchanted biome, clear of original terrain,
 // caves/structures/other trees. No silent clipping or clearing original voxels.
 if(rows.some(([a,b,c])=>v6BiomeAt(a,c,ground.seed)?.name!=='enchanted'||ground.get(a,b,c)!==BLOCK.AIR))return null;
 return Object.freeze({origin:Object.freeze([x,floor,z]),height,highestY:floor+height+2,
   cells:Object.freeze(rows.map(row=>Object.freeze(row)))});
}
// Read-only lower natural overlay and upper natural/explicit edit maps. All
// source identities and storage remain isolated; no historical save alias.
export function createWildsUpperResearchWorld(ground,plans=[]){
 if(!ground||typeof ground.get!=='function'||!Number.isInteger(ground.seed)||!Array.isArray(plans)||plans.length>8)
   throw Error('Invalid E2 physical ground source');
 const natural=new Map(),edits=new Map();
 for(const plan of plans)for(const [x,y,z,id] of plan.cells){
   const k=key(x,y,z);
   if(!coords(x,y,z)||y<0||y>WILDS_PHYSICAL_MAX_Y||!upperId(id)||id===0||
      natural.has(k)||ground.get(x,y,z)!==BLOCK.AIR)throw Error('Unsafe overlapping research tree');
   natural.set(k,id);
 }
 const readNatural=(x,y,z)=>natural.get(key(x,y,z))??(y<=WORLD_MAX_Y?ground.get(x,y,z):BLOCK.AIR);
 const lower={get:(x,y,z)=>readNatural(x,y,z),rotationAt:(...p)=>ground.rotationAt?.(...p)??0,
   get biomeCellCount(){return ground.biomeCellCount??0;},
   get pack2Cells(){return ground.pack2Cells;},get pack3Runtime(){return ground.pack3Runtime;},
   get manual14Layer(){return ground.manual14Layer;},getPack2State:(...p)=>ground.getPack2State?.(...p)};
 const view=createSkyOriginalWorldView({groundWorld:lower,skyGet:readNatural,skyEdits:edits,validateSkyId:materials.validateId});
 const world=Object.freeze({...view,seed:ground.seed,generationProfile:ground.generationProfile,base:ground,
   get: (x,y,z)=>{if(!coords(x,y,z))throw Error('Invalid research coordinate');return y<WILDS_PHYSICAL_MIN_Y||y>WILDS_PHYSICAL_MAX_Y?BLOCK.AIR:view.get(x,y,z);}});
 function setUpper(x,y,z,id){
   if(!coords(x,y,z)||y<=WORLD_MAX_Y||y>WILDS_PHYSICAL_MAX_Y||!upperId(id))return false;
   const k=key(x,y,z);
   if(id===readNatural(x,y,z))edits.delete(k);
   else{if(!edits.has(k)&&edits.size>=4096)return false;edits.set(k,id);}
   return true;
 }
 return Object.freeze({world,setUpper,
   naturalAt:readNatural,
   editRows:()=>[...edits].map(([k,id])=>[...k.split(',').map(Number),id]).sort((a,b)=>a[0]-b[0]||a[1]-b[1]||a[2]-b[2]),
   save(){throw Error('E2 upper-world research is not a durable world profile');},
   collides:(x,feet,z)=>collides(world,x,feet,z),
   raycast:(eye,direction,range=7)=>raycast(world,eye,direction,range),
   meshSurface:(cx,cz)=>meshChunk(world,cx,cz),
   meshUpper:(cx,cz,section)=>meshSkyIslandSection({source:world,cx,cz,section,
      shapeFor:materials.shapeFor,appearanceFor:materials.appearanceFor,
      surfaceMeshFor:materials.surfaceMeshFor,rotationFor:world.rotationAt}),
   bounds:section=>skyIslandSectionBounds(section),
   sectionForY:skyIslandSectionForY,meshKey:skyIslandMeshKey,bodyRegions:skyIslandBodyRegions
 });
}
