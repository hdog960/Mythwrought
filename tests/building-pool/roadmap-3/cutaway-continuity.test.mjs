import test from 'node:test';
import assert from 'node:assert/strict';
import {createM1Pool} from '../../../src/building-pool/roadmap-3/m1.mjs';
import {collectPreviewCells,createPreviewMesh} from './preview-mesh.mjs';

const key=(c)=>`${c.x},${c.y},${c.z}`;
function connectedCount(cells){
 const all=new Map(cells.map(c=>[key(c),c]));
 if(all.size!==cells.length)throw new Error('duplicate cutaway coordinates');
 const base=cells.find(c=>c.role==='foundation');
 assert.ok(base,'missing physical foundation');
 const queue=[base],seen=new Set([key(base)]);
 for(let i=0;i<queue.length;i++){
  const {x,y,z}=queue[i];
  for(const [dx,dy,dz] of [[-1,0,0],[1,0,0],[0,-1,0],[0,1,0],[0,0,-1],[0,0,1]]){
   const k=`${x+dx},${y+dy},${z+dz}`,next=all.get(k);
   if(next&&!seen.has(k)){seen.add(k);queue.push(next);}
  }
 }
 return seen.size;
}
const pool=createM1Pool();
test('all 30 exterior physical candidates remain unchanged and fully rendered',()=>{
 for(const b of pool){
  const exterior=collectPreviewCells(b),mesh=createPreviewMesh(b);
  assert.equal(exterior.removedUnsupportedCells,0,b.id);
  assert.equal(exterior.cells.length,b.architecture.physicalCellSlots,b.id);
  assert.equal(mesh.sourceCells,exterior.cells.length,b.id);
  assert.equal(mesh.removedUnsupportedCells,0,b.id);
 }
});
test('every cutaway discards orphaned voxels while retaining one foundation-connected volume',()=>{
 let repaired=0,hidden=0;
 for(const b of pool){
  const preview=collectPreviewCells(b,{cutaway:true});
  const mesh=createPreviewMesh(b,{cutaway:true});
  assert.equal(preview.cells.length,connectedCount(preview.cells),b.id);
  assert.equal(mesh.sourceCells,preview.cells.length,b.id);
  assert.equal(mesh.removedUnsupportedCells,preview.removedUnsupportedCells,b.id);
  assert.ok(preview.removedUnsupportedCells>0,`${b.id}: cutaway should suppress floating sections`);
  assert.ok(preview.cells.some(c=>c.role==='foundation'),b.id);
  assert.ok(preview.cells.some(c=>c.role==='fixture'||c.role==='stair'),b.id);
  repaired++;hidden+=preview.removedUnsupportedCells;
 }
 assert.equal(repaired,30);
 assert.ok(hidden>180,'expected meaningful correction across both workshop and fortification cutaways');
});
test('cutaway fix preserves authored 71,293 voxel slots and candidate identity',()=>{
 assert.equal(pool.length,30);
 assert.equal(new Set(pool.map(b=>b.id)).size,30);
 assert.equal(pool.reduce((sum,b)=>sum+b.modules.reduce((n,m)=>n+m.cells.length,0),0),71293);
});
