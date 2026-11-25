// E2A: physical upper-world research host. No live runtime, save, worker or island generator activation.
// Reuse the paused Island Dev's exact source mesher and section namespace.
import {BLOCK,collides,raycast,meshChunk} from '../voxel.mjs';
import {ENVIRONMENT_GROUND as G,environmentGround} from '../environment-ground.mjs';
import {biome130Block,isBiome130BlockId,biome130Color} from '../biome130-registry.mjs';
import {prototypeSurfaceMesh} from '../shape-prototypes.mjs';
import {v6BiomeAt} from './v6-balanced-biomes.mjs';
import {WORLD_MIN_Y,WORLD_MAX_Y,verticalEditSections,depthMeshKey} from '../depth.mjs';
import {mountainV8Material} from './mountain-v8-materials.mjs';
import {meshDepthSection} from '../depth-mesh.mjs';
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
export function createWildsUpperResearchWorld(ground,plans=[],{naturalSource=null}={}){
 if(!ground||typeof ground.get!=='function'||!Number.isInteger(ground.seed)||!Array.isArray(plans)||plans.length>8)
   throw Error('Invalid E2 physical ground source');
 if(naturalSource!==null&&(typeof naturalSource.get!=='function'||naturalSource.seed!==ground.seed||plans.length))throw Error('Invalid separate natural tower authority');
 const natural=new Map(),edits=new Map(),lowerEdits=new Map(),revisions=new Map();
 let revision=0;
 for(const plan of plans)for(const [x,y,z,id] of plan.cells){
   const k=key(x,y,z);
   if(!coords(x,y,z)||y<0||y>WILDS_PHYSICAL_MAX_Y||!upperId(id)||id===0||
      natural.has(k)||ground.get(x,y,z)!==BLOCK.AIR)throw Error('Unsafe overlapping research tree');
   natural.set(k,id);
 }
 const readNatural=(x,y,z)=>{
   const authored=natural.get(key(x,y,z));if(authored!==undefined)return authored;
   const base=y<=WORLD_MAX_Y?ground.get(x,y,z):BLOCK.AIR;
   // Only query lazy tree plans for actual air in the bounded tower band.
   return base===BLOCK.AIR&&naturalSource&&y>=1&&y<=57?naturalSource.get(x,y,z):base;
 };
 const lower={get:(x,y,z)=>lowerEdits.get(key(x,y,z))??readNatural(x,y,z),rotationAt:(...p)=>ground.rotationAt?.(...p)??0,
   get biomeCellCount(){return ground.biomeCellCount??0;},
   get pack2Cells(){return ground.pack2Cells;},get pack3Runtime(){return ground.pack3Runtime;},
   get manual14Layer(){return ground.manual14Layer;},getPack2State:(...p)=>ground.getPack2State?.(...p)};
 const view=createSkyOriginalWorldView({groundWorld:lower,skyGet:readNatural,skyEdits:edits,validateSkyId:materials.validateId});
 const world=Object.freeze({get rotationAt(){return view.rotationAt;},get biomeCellCount(){return view.biomeCellCount;},
   get pack2Cells(){return view.pack2Cells;},get pack3Runtime(){return view.pack3Runtime;},
   get manual14Layer(){return view.manual14Layer;},getPack2State:view.getPack2State,
   seed:ground.seed,generationProfile:ground.generationProfile,base:ground,
   edits:Object.freeze({has:k=>lowerEdits.has(k)||edits.has(k)}),
   get hasNaturalNonCubeShapes(){return ground.hasNaturalNonCubeShapes===true;},
   get: (x,y,z)=>{if(!coords(x,y,z))throw Error('Invalid research coordinate');return y<WILDS_PHYSICAL_MIN_Y||y>WILDS_PHYSICAL_MAX_Y?BLOCK.AIR:view.get(x,y,z);}});
 function affectedKeys(x,y,z){
   const horizontal=new Set();
   // Chebyshev halo also covers original surface RGB diagonal seam reads.
   for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++)horizontal.add(Math.floor((x+dx)/16)+','+Math.floor((z+dz)/16));
   const keys=new Set();
   for(const pos of horizontal){const [cx,cz]=pos.split(',').map(Number);
     if(y===20)keys.add(pos);
     if(y<=WORLD_MAX_Y)for(const section of verticalEditSections(y))keys.add(depthMeshKey(cx,cz,section));
     for(const dy of [-1,0,1]){const s=skyIslandSectionForY(y+dy);if(s!==null)keys.add(skyIslandMeshKey(cx,cz,s));}
   }
   return [...keys].sort();
 }
 function setPhysical(x,y,z,id){
   // Research admits only the already certified full-cube material subset.
   if(!coords(x,y,z)||Math.abs(x)>1e7||Math.abs(z)>1e7||y<WILDS_PHYSICAL_MIN_Y||y>WILDS_PHYSICAL_MAX_Y||!upperId(id))return false;
   const k=key(x,y,z),map=y>WORLD_MAX_Y?edits:lowerEdits;
   if(world.get(x,y,z)===id)return true;
   if(id===readNatural(x,y,z))map.delete(k);
   else{if(!map.has(k)&&edits.size+lowerEdits.size>=4096)return false;map.set(k,id);}
   revision++;
   for(const k of affectedKeys(x,y,z))revisions.set(k,revision);
   return true;
 }
 function setUpper(x,y,z,id){return y>WORLD_MAX_Y&&setPhysical(x,y,z,id);}
 return Object.freeze({world,setUpper,setPhysical,affectedKeys,
   get revision(){return revision;},regionRevision:k=>revisions.get(k)??0,
   naturalAt:readNatural,
   editRows:()=>[...lowerEdits,...edits].map(([k,id])=>[...k.split(',').map(Number),id]).sort((a,b)=>a[0]-b[0]||a[1]-b[1]||a[2]-b[2]),
   save(){throw Error('E2 upper-world research is not a durable world profile');},
   collides:(x,feet,z)=>collides(world,x,feet,z),
   raycast:(eye,direction,range=7)=>raycast(world,eye,direction,range),
   meshSurface:(cx,cz)=>meshChunk(world,cx,cz),
   meshDepth:(cx,cz,section)=>meshDepthSection(world,cx,cz,section),
   meshUpper:(cx,cz,section)=>meshSkyIslandSection({source:world,cx,cz,section,
      // Current M8 terrain can be a Y19 halo neighbor; its partial flora
      // cannot occlude a whole upper face. Upper edit IDs stay restricted.
      shapeFor:id=>{const m=mountainV8Material(id);return m?{cube:m.terrain,opaque:m.terrain}:materials.shapeFor(id);},appearanceFor:materials.appearanceFor,
      surfaceMeshFor:materials.surfaceMeshFor,rotationFor:world.rotationAt}),
   bounds:section=>skyIslandSectionBounds(section),
   sectionForY:skyIslandSectionForY,meshKey:skyIslandMeshKey,bodyRegions:skyIslandBodyRegions
 });
}
