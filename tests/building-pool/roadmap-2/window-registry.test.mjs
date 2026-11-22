import test from 'node:test';
import assert from 'node:assert/strict';
import {M1_REPRESENTATIVES} from '../../../src/building-pool/roadmap-2/m1-representatives.mjs';
import {TEMPERATE_SMALL_GENERAL_STORE} from '../../../src/building-pool/roadmap-2/temperate-store.mjs';
import {validateBlueprint} from '../../../src/building-pool/roadmap-2/schema.mjs';
const key=({x,y,z})=>`${x},${y},${z}`;

test('all 394 actual glazing and frame voxels have exact material-specific opening records',()=>{
 let physical=0,records=0;
 assert.equal(M1_REPRESENTATIVES.length,30);
 for(const bp of M1_REPRESENTATIVES){
  const panes=new Map(bp.voxels.filter(v=>v.kind==='window').map(v=>[key(v),v.material]));
  const openings=bp.openings.filter(o=>o.type==='window');
  physical+=panes.size;records+=openings.length;
  assert.equal(openings.length,panes.size,`incomplete window registry: ${bp.id}`);
  assert.equal(new Set(openings.map(key)).size,openings.length,`duplicate window opening: ${bp.id}`);
  for(const o of openings)assert.equal(o.material,panes.get(key(o)),`incorrect window material: ${bp.id} ${key(o)}`);
  assert.equal(validateBlueprint(bp).valid,true);
 }
 assert.equal(physical,394);assert.equal(records,394);
});

test('validator rejects missing, phantom, duplicated and falsely materialized windows',()=>{
 for(const bp of [TEMPERATE_SMALL_GENERAL_STORE,...M1_REPRESENTATIVES.filter(b=>b.category==='temple'&&b.size==='large')]){
  const o=bp.openings.find(x=>x.type==='window');
  assert(o,`no window to audit: ${bp.id}`);
  assert.throws(()=>validateBlueprint({...bp,openings:bp.openings.filter(x=>x!==o)}),/unregistered physical window cells/);
  assert.throws(()=>validateBlueprint({...bp,openings:[...bp.openings,{...o,x:Math.floor(bp.extents.x/2),z:1}]}),/window metadata without actual window voxel/);
  assert.throws(()=>validateBlueprint({...bp,openings:[...bp.openings,{...o}]}),/duplicate window opening metadata/);
  assert.throws(()=>validateBlueprint({...bp,openings:bp.openings.map(x=>x===o?{...x,material:'pack2:013'}:x)}),/window material mismatch/);
 }
});

test('window registry includes all physically glazed side facades and high temple belfries',()=>{
 for(const bp of M1_REPRESENTATIVES){
  const sides=bp.openings.filter(o=>o.type==='window'&&(o.x===0||o.x===bp.extents.x-1));
  assert(sides.length>=4,`missing side glazing registration: ${bp.id}`);
  if(bp.category==='temple'){
   const high=bp.openings.filter(o=>o.type==='window'&&o.y>=bp.extents.y-5);
   assert(high.length>=2,`missing high belfry window registration: ${bp.id}`);
  }
 }
});
