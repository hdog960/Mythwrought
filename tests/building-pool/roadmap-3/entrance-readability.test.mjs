import test from 'node:test';
import assert from 'node:assert/strict';
import {createM1Pool} from '../../../src/building-pool/roadmap-3/m1.mjs';
import {createPreviewMesh} from './preview-mesh.mjs';

const key=(x,y,z)=>`${x},${y},${z}`;
const pool=createM1Pool();
test('all 30 south entrances have physically contrasting connected jambs and lintels without blocking passage',()=>{
 for(const b of pool){
  const e=b.openings[0],frames=b.modules.find(m=>m.role==='entry-frame');
  assert.ok(frames,`${b.id} missing authored entrance frame`);
  assert.equal(frames.cells.length,16,`${b.id} entrance trim not fully built`);
  const placed=new Map(b.modules.flatMap(m=>m.cells.map(c=>[key(...c.slice(0,3)),c])));
  const trim=new Set(frames.cells.map(c=>key(...c.slice(0,3))));
  assert.equal(e.facing,'south',b.id);
  for(let y=2;y<=7;y++)for(const x of [e.x-1,e.x+2]){
   const k=key(x,y,e.z);
   if(y<=6)assert.ok(trim.has(k),`${b.id} missing jamb ${k}`);
  }
  for(let y=5;y<=7;y++)for(const x of [e.x,e.x+1])assert.ok(trim.has(key(x,y,e.z)),`${b.id} missing lintel`);
  for(let y=e.y;y<e.y+e.height;y++)for(let x=e.x;x<e.x+e.width;x++)
   assert.equal(placed.has(key(x,y,e.z)),false,`${b.id} door blocked`);
  for(const cell of frames.cells)assert.match(cell[3],/^(pack\d:|biome130:)/,b.id);
 }
});
test('entry-frame introduces a visible preview role without adding blueprint cells',()=>{
 const total=pool.reduce((sum,b)=>sum+b.architecture.physicalCellSlots,0);
 assert.equal(total,71293,'entrance framing must not alter exact authored occupancy');
 for(const b of pool){
  const mesh=createPreviewMesh(b);
  assert.ok(mesh.facesByRole['entry-frame']>0,`${b.id} entry trim invisible in mesh`);
 }
});
