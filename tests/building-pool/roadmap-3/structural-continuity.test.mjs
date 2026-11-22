import test from 'node:test';
import assert from 'node:assert/strict';
import {createM1Pool} from '../../../src/building-pool/roadmap-3/m1.mjs';

// Independent exact-grid 6-neighbor flood. Graph routes and two-wide paths can
// pass while an entire roof or chimney is structurally detached from the build.
const id=(x,y,z)=>`${x},${y},${z}`;
function countComponents(modules){
 const all=new Set(modules.flatMap(m=>m.cells.map(([x,y,z])=>id(x,y,z))));
 const visited=new Set();let components=0;
 for(const start of all){
  if(visited.has(start))continue;
  components++;visited.add(start);
  const pending=[start];
  for(let i=0;i<pending.length;i++){
   const [x,y,z]=pending[i].split(',').map(Number);
   for(const [nx,ny,nz] of [[x-1,y,z],[x+1,y,z],[x,y-1,z],[x,y+1,z],[x,y,z-1],[x,y,z+1]]){
    const neighbor=id(nx,ny,nz);
    if(all.has(neighbor)&&!visited.has(neighbor)){visited.add(neighbor);pending.push(neighbor);}
   }
  }
 }
 return {components,occupied:all.size};
}
const pool=createM1Pool();
test('all 30 authored voxel masses have a face-connected structural support path',()=>{
 for(const b of pool){
  const {components,occupied}=countComponents(b.modules);
  assert.equal(components,1,`${b.id} contains floating components`);
  assert.equal(occupied,b.architecture.physicalCellSlots,b.id);
 }
});
test('roof flue braces are necessary where the chimney has no adjacent roof support',()=>{
 for(const b of pool.filter(b=>b.type==='blacksmith'&&b.biome!=='temperate')){
  const braces=b.modules.find(m=>m.role==='flue-support');
  assert.equal(braces?.cells.length,1,`${b.id} needs exactly one lateral flue corbel`);
  const disconnected=b.modules.filter(m=>m.role!=='flue-support');
  assert.ok(countComponents(disconnected).components>1,`${b.id} connectivity test did not detect detached chimney`);
  const [x,y,z]=braces.cells[0];
  assert.equal(x,3,b.id);
  assert.ok(b.modules.some(m=>m.role==='roof'&&m.cells.some(c=>c[0]===x&&c[1]===y-1&&c[2]===z)),`${b.id} flue corbel not seated on a roof cell`);
 }
});
test('snow lookout roof steps are connected by actual sparse bearing risers, not thick infill',()=>{
 for(const b of pool.filter(b=>b.type==='watchtower'&&b.biome==='snow')){
  const braces=b.modules.find(m=>m.role==='roof-step-brace');
  assert.ok(braces?.cells.length>0,`${b.id} has no stair-stepped snow-roof connections`);
  assert.ok(braces.cells.length<b.modules.find(m=>m.role==='structure').cells.length*0.4,`${b.id} is thickly filled instead of braced`);
  const disconnected=b.modules.filter(m=>m.role!=='roof-step-brace');
  assert.ok(countComponents(disconnected).components>1,`${b.id} removal of roof risers failed to disconnect roof tiers`);
 }
});
