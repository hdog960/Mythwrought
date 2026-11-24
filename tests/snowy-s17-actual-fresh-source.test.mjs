import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,ENCHANTED_P2_GENERATOR,M7_ENVIRONMENT_GENERATOR} from '../src/manual-biomes/profile-world.mjs';
import {ExperimentalSnowS17World} from '../src/manual-biomes/snowy-s17-experimental-world.mjs';
import {VoxelWorld,BLOCK,meshChunk,collides,terrainHeight} from '../src/voxel.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {stepPlayer} from '../src/physics.mjs';
import {FourRegionWorld as OriginalWorld,fourRegionProfile as originalProfile} from '../current-readonly/src/manual-biomes/profile-world.mjs';
import {meshChunk as originalMesh} from '../current-readonly/src/voxel.mjs';
const key=(x,y,z)=>x+','+y+','+z;
const bytes=a=>Buffer.from(a.buffer,a.byteOffset,a.byteLength);
const chunkKey=(x,z)=>x+','+z;
const chunkCells=(w,cx,cz)=>{
 w._environmentTreeAt(cx*16,19,cz*16);
 return w._environmentTreeChunks.get(chunkKey(cx,cz));
};
const top=p=>p.size?Math.max(...p.keys()):null;
test('Current production old profiles stay exact and Snow remains unregistered',()=>{
 let n=0,b=0;
 for(const generator of [M7_ENVIRONMENT_GENERATOR,ENCHANTED_P2_GENERATOR]){
  const w=new FourRegionWorld(179,fourRegionProfile(179,generator));
  const o=new OriginalWorld(179,originalProfile(179,generator));
  for(const [cx,cz] of [[-2,32],[-3,-33],[20,-114]]){
   const a=meshChunk(w,cx,cz),old=originalMesh(o,cx,cz);
   assert.deepEqual(bytes(a),bytes(old));n++;b+=a.byteLength;
  }
  assert.deepEqual(w.save(),o.save());
 }
 assert.throws(()=>fourRegionProfile(179,'mythwrought-five-surface-regions-v7-snow-test-only'),/Unknown biome generator/);
 console.log('SNOW_S17_OLD_PROFILE_BYTES '+JSON.stringify({meshes:n,bytes:b}));
});
test('Actual current-source generated Snow replaces canonical trees and preserves original AIR, caves and legacy blocks',()=>{
 let totalNeedles=0,totalRemoved=0,totalAdded=0;
 for(const seed of [179,2026]){
  const old=new FourRegionWorld(seed,fourRegionProfile(seed,ENCHANTED_P2_GENERATOR));
  const w=new ExperimentalSnowS17World(seed),reverse=new ExperimentalSnowS17World(seed);
  const coords=[];
  for(let cx=-3;cx<=1;cx++)for(let cz=31;cz<=34;cz++)coords.push([cx,cz]);
  for(const [cx,cz] of [...coords].reverse())chunkCells(reverse,cx,cz);
  let needles=0,added=0,removed=0,wood=0,oldCells=0,newCells=0,changedChunks=0,meshBytes=0;
  let mine=null;
  for(const [cx,cz] of coords){
   const a=chunkCells(old,cx,cz),b=chunkCells(w,cx,cz);
   assert.deepEqual([...b].sort(),[...chunkCells(reverse,cx,cz)].sort(),'Chunk build order changed physical trees');
   oldCells+=a.size;newCells+=b.size;
   let changed=false;
   for(const [k,id] of b){
    const [x,y,z]=k.split(',').map(Number);
    assert.equal(w.get(x,y,z),id);
    assert.equal(w.environmentCaves.get(x,y,z),undefined);
    if(a.get(k)!==id){added++;changed=true;}
    if(w.snowS17NaturalNeedleAt(x,y,z)===407){
     needles++;assert.equal(id,407);
     assert.equal(v6BiomeAt(x,z,seed)?.name,'snow');
     assert.equal(VoxelWorld.prototype.naturalAndLandmarkBlock.call(w,x,y,z),BLOCK.AIR);
     assert.ok(v6BiomeAt(x,z,seed).weight>=.65);
     mine??=[x,y,z];
    }
    if(id===BLOCK.WOOD)wood++;
   }
   for(const [k,id] of a)if(b.get(k)!==id){removed++;changed=true;}
   if(changed){
    changedChunks++;
    const m=meshChunk(w,cx,cz);assert.ok(m instanceof Float32Array&&m.length%9===0);meshBytes+=m.byteLength;
   }
  }
  assert.ok(needles>0&&wood>0&&added>0&&removed>0,'Actual replacement not merely extra fixed overlay');
  // Exact original non-Snow trees, terrain, and meshes on actual Enchanted
  // and Desert regions from current source. No old-profile rendering change.
  for(const [cx,cz] of [[-3,-33],[20,-114+3],[32,0]]){
   if(v6BiomeAt(cx*16+8,cz*16+8,seed)?.name==='snow')continue;
   assert.deepEqual([...chunkCells(w,cx,cz)].sort(),[...chunkCells(old,cx,cz)].sort());
   assert.deepEqual(bytes(meshChunk(w,cx,cz)),bytes(meshChunk(old,cx,cz)));
  }
  assert.ok(w.snowS17CacheSizes.trees<=64&&w.snowS17CacheSizes.needles<=64&&w.snowS17CacheSizes.columns<=1024);
  assert.throws(()=>w.save(),/cannot save/);
  assert.equal(w.set(...mine,BLOCK.AIR),true);assert.equal(w.get(...mine),BLOCK.AIR);
  assert.equal(w.snowS17NaturalNeedleAt(...mine),undefined);
  assert.equal(w.edits.get(key(...mine)),BLOCK.AIR);
  assert.equal(w.set(...mine,407),true);assert.equal(w.edits.has(key(...mine)),false);
  assert.equal(w.snowS17NaturalNeedleAt(...mine),407);
  totalNeedles+=needles;totalRemoved+=removed;totalAdded+=added;
  console.log('SNOW_S17_ACTUAL_REPLACEMENT '+JSON.stringify({seed,consumerChunks:coords.length,oldCells,newCells,wood,needles,added,removed,changedChunks,meshBytes,mine,cache:w.snowS17CacheSizes,unsavable:true}));
 }
 assert.ok(totalNeedles>0&&totalRemoved>0&&totalAdded>0);
});
test('Original terrain transects: physical cap/shelf changes never touch protected hardpan/scree, cave or legacy geometry',()=>{
 const windows=[
 [179,640,-1283,0,1],[179,-1812,-768,-1,0],
 [2026,320,-1805,0,-1],[2026,281,-2048,1,0],
 [179,0,256,0,1],[2026,0,256,0,1]
 ];
 let totalCaps=0,totalTapers=0,totalProtected=0;
 for(const [seed,x0,z0,dx,dz] of windows){
  const old=new FourRegionWorld(seed,fourRegionProfile(seed,ENCHANTED_P2_GENERATOR)),w=new ExperimentalSnowS17World(seed);
  let caps=0,tapers=0,protectedCaps=0,snowColumns=0;
  const witnesses=[];
  for(let d=-16;d<=60;d++)for(let k=-4;k<=4;k++){
   const x=x0+dx*d-dz*k,z=z0+dz*d+dx*k;
   const a=old._columnPlan(x,z),b=w._columnPlan(x,z),at=top(a),bt=top(b);
   const climate=v6BiomeAt(x,z,seed);
   if(climate?.name==='snow')snowColumns++;
   if(at!==null&&[258,401].includes(a.get(at))){protectedCaps++;assert.deepEqual(a,b);}
   if(JSON.stringify([...a])===JSON.stringify([...b]))continue;
   assert.equal(climate?.name,'snow');
   const h=terrainHeight(x,z,seed);
   if(a.size===0){
    caps++;assert.equal(b.size,1);assert.equal(bt,h);assert.ok([272,279].includes(b.get(h)));
    assert.equal(VoxelWorld.prototype.naturalAndLandmarkBlock.call(w,x,h,z),BLOCK.GRASS);
    assert.equal(w.get(x,h,z),b.get(h));
   }else{
    tapers++;assert.equal(bt,at-1);assert.ok(bt>=h);assert.equal(b.get(bt),a.get(at));
    assert.equal(VoxelWorld.prototype.naturalAndLandmarkBlock.call(w,x,at,z),BLOCK.AIR);
    assert.equal(w.get(x,at,z),BLOCK.AIR);
    for(const [y,id] of a)if(y<bt)assert.equal(b.get(y),id);
   }
   for(const y of [bt,bt-1])assert.equal(w.environmentCaves.get(x,y,z),undefined);
   if(witnesses.length<4)witnesses.push({x,z,oldTop:at,newTop:bt,cap:b.get(bt),weight:climate.weight});
  }
  totalCaps+=caps;totalTapers+=tapers;totalProtected+=protectedCaps;
  console.log('SNOW_S17_PHYSICAL_TRANSITION '+JSON.stringify({seed,origin:[x0,z0],sampled:77*9,snowColumns,caps,tapers,protectedCaps,witnesses}));
 }
 assert.ok(totalCaps+totalTapers>0&&totalProtected>0,'No genuine source transition change witnessed');
});
test('Actual generated Snow physics preserves the original border routes',()=>{
 const starts={179:[[-16,512.5,7],[-16,514.5,7],[0,512.5,9],[0,514.5,11]],
 2026:[[-16,512.5,7],[-16,516.5,7],[0,512.5,10],[0,514.5,12]]};
 for(const seed of [179,2026]){
  const w=new ExperimentalSnowS17World(seed),routes=[];
  for(const [border,z,feet] of starts[seed]){
   const p={x:border-2.5,z,feet,vX:0,vY:0,vZ:0,yaw:Math.PI/2,pitch:0,onGround:true,coyote:.09,jumpBuffer:0};
   assert.equal(collides(w,p.x,p.feet,p.z),false);
   let first=null;
   for(let i=0;i<132;i++){
    stepPlayer(w,p,{forward:1,strafe:0,jump:false},1/60);
    assert.equal(collides(w,p.x,p.feet,p.z),false);
    if(first===null&&p.x>=border+.75)first=i+1;
   }
   assert.ok(first!==null,'Actual new source severed previously verified route '+seed+' '+border+' '+z);
   routes.push({border,z,first,frames:132,end:[p.x,p.feet,p.z]});
  }
  console.log('SNOW_S17_ACTUAL_WALK '+JSON.stringify({seed,routes}));
 }
});
