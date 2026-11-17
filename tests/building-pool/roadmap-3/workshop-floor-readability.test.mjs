import test from 'node:test';
import assert from 'node:assert/strict';
import {createM1Pool} from '../../../src/building-pool/roadmap-3/m1.mjs';
import {createPreviewMesh} from './preview-mesh.mjs';

const pool=createM1Pool();
const k=(x,y,z)=>`${x},${y},${z}`;
const boundsContain=([x,y,z],b)=>x>=b.x&&x<b.x+b.width&&y>=b.y&&y<b.y+b.height&&z>=b.z&&z<b.z+b.depth;

test('all 15 blacksmiths have two physically authored, disjoint and correctly located workshop deck zones',()=>{
 for(const b of pool.filter(b=>b.type==='blacksmith')){
  const forge=b.spaces.find(s=>s.kind==='forge');
  const stock=b.spaces.find(s=>s.kind==='storage');
  const roles=[['forge-deck',forge],['stock-deck',stock]];
  const seen=new Set();
  for(const [role,space] of roles){
   const module=b.modules.find(m=>m.role===role);
   assert.ok(module?.cells.length>20,`${b.id}: ${role} has no substantive physical extent`);
   assert.equal(module.cells.length,space.bounds.width*space.bounds.depth,`${b.id}: ${role} extent mismatch`);
   for(const [x,y,z,ref] of module.cells){
    assert.equal(y,1,`${b.id}: ${role} is not a floor marking`);
    assert.ok(boundsContain([x,y+1,z],space.bounds),`${b.id}: ${role} outside its bay`);
    assert.ok(ref.startsWith('pack')||ref.startsWith('builtin:')||ref.startsWith('biome130:'),`${b.id}: unreserved floor ref`);
    assert.ok(!seen.has(k(x,y,z)),`${b.id}: overlapping workshop deck markings`);
    seen.add(k(x,y,z));
   }
  }
  const deckRef=b.modules.find(m=>m.role==='floor').cells[0][3];
  assert.ok(b.modules.filter(m=>['forge-deck','stock-deck'].includes(m.role))
   .every(m=>m.cells.every(c=>c[3]===deckRef)),`${b.id}: future block material changed`);
  const {width:w,depth:d}=b.envelope;
  const deckCells=b.modules.filter(m=>['floor','forge-deck','stock-deck'].includes(m.role)).reduce((n,m)=>n+m.cells.length,0);
  assert.equal(deckCells,w*d,`${b.id}: work-zone markings deleted or added floor`);
 }
});

test('all forge/stock deck roles survive in source-exact exterior and cutaway diagnostic meshes',()=>{
 for(const b of pool.filter(b=>b.type==='blacksmith')){
  for(const cutaway of [false,true]){
   const m=createPreviewMesh(b,{cutaway});
   assert.ok(m.facesByRole['forge-deck']>0,`${b.id}: forge hidden in ${cutaway?'cutaway':'exterior'}`);
   assert.ok(m.facesByRole['stock-deck']>0,`${b.id}: stock hidden in ${cutaway?'cutaway':'exterior'}`);
  }
 }
});

test('new workshop presentation leaves every authored coordinate and the 30 identities unchanged',()=>{
 assert.equal(pool.length,30);
 assert.equal(new Set(pool.map(b=>b.id)).size,30);
 assert.equal(pool.reduce((n,b)=>n+b.architecture.physicalCellSlots,0),71293);
 for(const b of pool.filter(x=>x.type==='watchtower')){
  assert.ok(!b.modules.some(m=>m.role==='forge-deck'||m.role==='stock-deck'),b.id);
 }
});
