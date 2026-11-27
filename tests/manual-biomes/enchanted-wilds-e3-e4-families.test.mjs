import test from 'node:test';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {BLOCK,meshChunk,raycast,collides} from '../../src/voxel.mjs';
import {ENVIRONMENT_GROUND as G} from '../../src/environment-ground.mjs';
import {FourRegionWorld,fourRegionProfile,M8_MOUNTAIN_GENERATOR} from '../../src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {WILDS_FAMILIES,WILDS_MAX_CELLS,buildWildsFamily} from '../../src/manual-biomes/enchanted-wilds-families.mjs';
import {WildsFamilyResearchWorld,wildsRegionAt,WILDS_REGIONS} from '../../src/manual-biomes/enchanted-wilds-family-source.mjs';
import {upperOccupancy,physicalRegionAt,PHYSICAL_MAX_Y} from '../../src/world-height.mjs';
import {validateUpperSectionGeometry} from '../../src/world-height-budget.mjs';
const key=(x,y,z)=>[x,y,z].join(',');
const previous=await import(pathToFileURL(resolve(process.env.WILDS_CURRENT_ROOT,'src/manual-biomes/profile-world.mjs')).href);
const previousVoxel=await import(pathToFileURL(resolve(process.env.WILDS_CURRENT_ROOT,'src/voxel.mjs')).href);
test('ten distinct physical silhouettes, four deterministic variants each, bounded and face-connected',()=>{
 const summaries=[];
 for(const f of WILDS_FAMILIES){
  for(let v=0;v<4;v++){
   const p=buildWildsFamily(f.id,-64,10,-544,179,v);
   assert.deepEqual(p,buildWildsFamily(f.id,-64,10,-544,179,v));
   assert.ok(p.cells.length<=WILDS_MAX_CELLS&&p.cells.length>100);
   assert.ok(p.height>=f.height[0]&&p.height<=f.height[1]);
   const cells=new Set(p.cells.map(([x,y,z])=>key(x,y,z)));
   assert.equal(cells.size,p.cells.length);
   const todo=[[-64,11,-544]],seen=new Set([key(...todo[0])]);
   while(todo.length){const [x,y,z]=todo.pop();for(const [dx,dy,dz] of [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]]){
    const a=[x+dx,y+dy,z+dz],k=key(...a);if(cells.has(k)&&!seen.has(k)){seen.add(k);todo.push(a);}
   }}
   assert.equal(seen.size,cells.size,f.name+' disconnected physical cells');
   assert.ok(p.cells.every(([,y,,id])=>y>10&&y<=PHYSICAL_MAX_Y&&[G.aetherBark,G.aetherLeaves,G.moonLeaves,BLOCK.CRYSTAL].includes(id)));
   if(v===0)summaries.push({family:f.name,height:p.height,cells:p.cells.length});
  }
 }
 assert.equal(WILDS_FAMILIES.length,10);
 assert.equal(buildWildsFamily(2,0,240,0,179),null);
 console.log('WILDS 40 FAMILY VARIANTS',JSON.stringify(summaries));
});
test('actual current source natural trees and fungi, versioned occupancy, original mesh and mining',()=>{
 const w=new WildsFamilyResearchWorld(179),plans=new Map(),regions=new Set(),keys=new Set();let count=0,upper=0;
 for(let cx=-8;cx<=3;cx++)for(let cz=-38;cz<=-28;cz++){
   const r=wildsRegionAt(cx*16+8,cz*16+8,179);if(r!==null)regions.add(WILDS_REGIONS[r]);
   for(const p of w.wildsSource.plans(cx,cz))plans.set(p.origin.join(','),p);
   for(const [k,id] of w.wildsSource.entries(cx,cz)){
    const [x,y,z]=k.split(',').map(Number);
    assert.equal(w.get(x,y,z),id);assert.equal(v6BiomeAt(x,z,179)?.name,'enchanted');count++;
    if(y>19){upper++;const region=physicalRegionAt(x,y,z);keys.add(region.key);assert.equal(upperOccupancy(w,region.key),true);}
   }
 }
 assert.ok(plans.size>=3&&upper>0);assert.ok([...plans.values()].some(p=>p.id<5));assert.ok([...plans.values()].some(p=>p.id>=5));
 const p=[...plans.values()][0],[x,floor,z]=p.origin;
 assert.ok(floor<19);assert.equal(w.get(x,20,z),G.aetherBark);
 const cx=Math.floor(x/16),cz=Math.floor(z/16),before=meshChunk(w,cx,cz,1);
 assert.ok(before.length>0);validateUpperSectionGeometry(before,new Float32Array());
 assert.equal(collides(w,x+.5,20,z+.5),true);
 assert.deepEqual(raycast(w,[x+.5,20.5,z-2],[0,0,1],7)?.hit,[x,20,z]);
 assert.equal(w.set(x,20,z,BLOCK.AIR),true);assert.equal(w.get(x,20,z),BLOCK.AIR);assert.equal(w.naturalAndLandmarkBlock(x,20,z),G.aetherBark);
 const edited=meshChunk(w,cx,cz,1);assert.notDeepEqual(edited,before);
 const cold=new WildsFamilyResearchWorld(179);assert.equal(cold.get(x,20,z),G.aetherBark);assert.equal(cold.set(x,20,z,BLOCK.AIR),true);assert.deepEqual(meshChunk(cold,cx,cz,1),edited);
 assert.throws(()=>w.save(),/historical M8/);
 assert.ok(w.wildsSource.stats().sites<=128&&w.wildsSource.stats().chunks<=64);
 console.log('WILDS NATURAL FAMILY SOURCE',JSON.stringify({plans:plans.size,families:[...new Set([...plans.values()].map(p=>p.family))],regions:[...regions],count,upper,keys:keys.size,before:before.byteLength,edited:edited.byteLength}));
});
test('current historical M8 and nonforest natural meshes exactly preserved',()=>{
 const seed=179,prior=new previous.FourRegionWorld(seed,previous.fourRegionProfile(seed,M8_MOUNTAIN_GENERATOR));
 const current=new FourRegionWorld(seed,fourRegionProfile(seed,M8_MOUNTAIN_GENERATOR));
 const wilds=new WildsFamilyResearchWorld(seed);
 for(const [cx,cz] of [[0,0],[32,0],[0,32],[-32,0],[-3,-33]]){
  assert.deepEqual(meshChunk(current,cx,cz),previousVoxel.meshChunk(prior,cx,cz));
  if(v6BiomeAt(cx*16+8,cz*16+8,seed)?.name!=='enchanted')assert.deepEqual(meshChunk(wilds,cx,cz),previousVoxel.meshChunk(prior,cx,cz));
 }
 assert.deepEqual(current.save(),prior.save());
 console.log('WILDS HISTORICAL CURRENT MAIN PARITY 5 mesh stations');
});
