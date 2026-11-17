import test from 'node:test';
import assert from 'node:assert/strict';
import {createM1Pool} from '../../../src/building-pool/roadmap-3/m1.mjs';
import {createPreviewMesh,collectPreviewCells} from './preview-mesh.mjs';
const pool=createM1Pool(),key=(x,y,z)=>`${x},${y},${z}`;
const flat=b=>new Map(b.modules.flatMap(m=>m.cells.map(c=>[key(...c.slice(0,3)),{role:m.role,ref:c[3]}])));
test('all 30 buildings retain two open side windows, each edged by six physical regional trim cells',()=>{
 assert.equal(pool.length,30);
 for(const b of pool){
  const w=b.envelope.width,d=b.envelope.depth,s=flat(b);
  const surround=b.modules.find(m=>m.role==='window-trim');
  assert.equal(surround?.cells.length,12,`${b.id} missing complete lateral framing`);
  const door=b.modules.find(m=>m.role==='entry-frame');
  const trimRef=door.cells[0][3];
  for(const [x,z] of (b.type==='watchtower'
   ?[[0,Math.floor(d/2)],[w-1,Math.floor(d/3)]]
   :[[0,Math.floor(d/3)],[w-1,d-5]])){
   for(let y=4;y<=5;y++)assert.equal(s.has(key(x,y,z)),false,`${b.id} sealed open side-window at ${x},${y},${z}`);
   const frameCells=[[x,3,z],[x,6,z],...[4,5].flatMap(y=>[[x,y,z-1],[x,y,z+1]])];
   for(const [a,y,c] of frameCells){
    const cell=s.get(key(a,y,c));
    assert.equal(cell?.role,'window-trim',`${b.id} missing physical window trim at ${a},${y},${c}`);
    assert.equal(cell.ref,trimRef,`${b.id} window frame is not the existing biome-specific trim family`);
   }
  }
 }
});
test('all exterior previews show real window-trim faces, and cutaways hide trim with the removed east facade',()=>{
 for(const b of pool){
  const exterior=createPreviewMesh(b);const cutaway=collectPreviewCells(b,{cutaway:true});
  assert.ok((exterior.facesByRole['window-trim']||0)>0,`${b.id} invisible exterior surround`);
  assert.ok(!cutaway.cells.some(c=>c.role==='window-trim'&&c.x===b.envelope.width-1),`${b.id} orphaned east window frame after facade removal`);
  assert.ok(cutaway.cells.some(c=>c.role==='window-trim'&&c.x===0),`${b.id} west frame unexpectedly hidden`);
 }
});
test('window surrounds do not invent block families, occupy window apertures or change M1 physical geometry',()=>{
 assert.equal(pool.reduce((n,b)=>n+b.architecture.physicalCellSlots,0),71293);
 assert.equal(new Set(pool.map(b=>b.id)).size,30);
 for(const b of pool){
  const trim=b.modules.find(m=>m.role==='window-trim').cells;
  assert.ok(trim.every(c=>/^pack\d+:\d+$/.test(c[3])||/^biome130:\d+$/.test(c[3])),b.id);
  assert.equal(b.modules.reduce((n,m)=>n+m.cells.length,0),b.architecture.physicalCellSlots,b.id);
 }
});
