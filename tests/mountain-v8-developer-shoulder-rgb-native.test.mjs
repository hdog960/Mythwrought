import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {BLOCK,meshChunk,terrainHeight} from '../src/voxel.mjs';
import {FourRegionWorld,fourRegionProfile,M8_MOUNTAIN_GENERATOR,M7_ENVIRONMENT_GENERATOR} from '../src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {desertSeamEditAffectedChunks} from '../src/manual-biomes/desert-seam-invalidation.mjs';
const root=process.env.MOUNTAIN_V8_PREVIOUS_ROOT;
assert.ok(root);
const old=await import(pathToFileURL(path.join(root,'src/manual-biomes/profile-world.mjs')).href);
const oldVoxel=await import(pathToFileURL(path.join(root,'src/voxel.mjs')).href);
const seed=179;
function worlds(generator=M8_MOUNTAIN_GENERATOR){
 return [new FourRegionWorld(seed,fourRegionProfile(seed,generator)),
 new old.FourRegionWorld(seed,old.fourRegionProfile(seed,generator))];
}
function compare(a,b){
 assert.equal(a.length,b.length);
 assert.equal(a.length%9,0);
 let changed=0;
 for(let i=0;i<a.length;i+=9){
  for(const j of [0,1,2,6,7,8])assert.equal(a[i+j],b[i+j],'geometry, UV or material changed at '+(i+j));
  if(a[i+3]!==b[i+3]||a[i+4]!==b[i+4]||a[i+5]!==b[i+5]){
   changed++;
   for(const j of [3,4,5])assert.ok(Number.isFinite(a[i+j])&&a[i+j]>=0&&a[i+j]<=1);
  }
 }
 return changed;
}
test('actual V8 west shoulder meshes change RGB only, across negative horizontal chunk edges',()=>{
 const [w,p]=worlds();
 let changed=0,bytes=0,vertices=0;
 for(const [cx,cz] of [[-17,-12],[-17,-11],[-18,-11],[-17,-10],[-18,-10],[-17,-9]]){
  const a=meshChunk(w,cx,cz),b=oldVoxel.meshChunk(p,cx,cz);
  changed+=compare(a,b);bytes+=a.byteLength;vertices+=a.length/9;
 }
 console.log('V8 shoulder RGB census',JSON.stringify({chunks:6,changed,bytes,vertices}));
 assert.ok(changed>0);
 assert.deepEqual(w.save(),p.save());
});
test('V8 interior natural conifer mesh and nonmountain Desert mesh retain exact prior bytes',()=>{
 const [w,p]=worlds();
 for(const [cx,cz] of [[-30,0],[-50,-112],[0,0]]){
  const a=meshChunk(w,cx,cz),b=oldVoxel.meshChunk(p,cx,cz);
  assert.equal(compare(a,b),0);
 }
});
test('historical M7 original Desert RGB and Mountain mesh bytes unchanged',()=>{
 const [w,p]=worlds(M7_ENVIRONMENT_GENERATOR);
 for(const [cx,cz] of [[-17,-12],[-50,-112]])assert.equal(compare(meshChunk(w,cx,cz),oldVoxel.meshChunk(p,cx,cz)),0);
 assert.ok(desertSeamEditAffectedChunks(w,-786,-1774,4).some(c=>c.cx===-50&&c.cz===-112));
});
test('actual edited source cap retains original untinted RGB and geometry, with no new halo',()=>{
 const [w,p]=worlds();
 let site=null;
 for(let x=-272;x<=-257&&!site;x++)for(let z=-192;z<=-177&&!site;z++){
  const r=v6BiomeAt(x,z,seed);
  if(r?.name!=='mountain'||r.weight>=.93)continue;
  const plan=w._columnPlan(x,z);
  if(!plan.size)continue;
  const y=Math.max(...plan.keys()),id=plan.get(y);
  if(![1,3,400,401,402].includes(id)||w.get(x,y+1,z)!==BLOCK.AIR)continue;
  site={x,y,z,id};
 }
 assert.ok(site);
 const {x,y,z,id}=site,placed=id===BLOCK.GRASS?BLOCK.STONE:BLOCK.GRASS;
 assert.equal(w.set(x,y,z,placed),true);assert.equal(p.set(x,y,z,placed),true);
 const cx=Math.floor(x/16),cz=Math.floor(z/16),a=meshChunk(w,cx,cz),b=oldVoxel.meshChunk(p,cx,cz);
 compare(a,b);
 // Legacy full-cube top emits six consecutive vertices. Require whole
 // top face coverage, not ambiguous shared corner vertices of other cells.
 let faces=0;
 for(let i=0;i<a.length;i+=54){
  const v=Array.from({length:6},(_,j)=>a.subarray(i+j*9,i+j*9+9));
  if(v.some(q=>q.length!==9))continue;
  if(v.every(q=>q[1]===y+1&&q[0]>=x&&q[0]<=x+1&&q[2]>=z&&q[2]<=z+1&&q[8]===placed)&&
    new Set(v.map(q=>q[0]+','+q[2])).size===4){
    faces++;assert.deepEqual(a.slice(i,i+54),b.slice(i,i+54));
  }
 }
 // Packed noncube triangles before the edited face can offset the
 // quad alignment. If needed find the exact six-vertex face at any stride.
 if(!faces)for(let i=0;i+54<=a.length;i+=9){
  const v=Array.from({length:6},(_,j)=>a.subarray(i+j*9,i+j*9+9));
  if(v.every(q=>q[1]===y+1&&q[0]>=x&&q[0]<=x+1&&q[2]>=z&&q[2]<=z+1&&q[8]===placed)&&
    new Set(v.map(q=>q[0]+','+q[2])).size===4){
    faces++;assert.deepEqual(a.slice(i,i+54),b.slice(i,i+54));
  }
 }
 assert.ok(faces>0,JSON.stringify(site));
 assert.deepEqual(w.save(),p.save());
 assert.ok(!desertSeamEditAffectedChunks(w,-786,-1774,4).some(c=>c.cx===-50&&c.cz===-112));
 console.log('V8 edited cap unchanged',JSON.stringify({...site,placed,faces}));
});
