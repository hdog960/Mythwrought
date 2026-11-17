import test from 'node:test';
import assert from 'node:assert/strict';
import {createM1Pool} from '../../../src/building-pool/roadmap-3/m1.mjs';
import {createPreviewMesh} from './preview-mesh.mjs';

const all=createM1Pool();
const within=(p,b)=>p.every((v,i)=>v>=b[['x','y','z'][i]]&&v<b[['x','y','z'][i]]+b[['width','height','depth'][i]]);
const overlap=(a,b)=>['x','y','z'].every((axis,i)=>{
 const span=['width','height','depth'][i];
 return Math.max(a[axis],b[axis]) < Math.min(a[axis]+a[span],b[axis]+b[span]);
});

test('all 15 blacksmith forge and storage bays are distinct nonoverlapping accessible areas',()=>{
 for(const b of all.filter(x=>x.type==='blacksmith')){
  const forge=b.spaces.find(x=>x.kind==='forge'),stock=b.spaces.find(x=>x.kind==='storage');
  assert.ok(forge&&stock,b.id);
  assert.equal(overlap(forge.bounds,stock.bounds),false,`${b.id}: overlapping forge/storage metadata`);
  const nodes=new Map(b.navigation.nodes.map(x=>[x.id,x]));
  for(const space of [forge,stock]){
   const node=nodes.get(space.accessNode);
   assert.ok(node&&within([node.x,node.y,node.z],space.bounds),`${b.id}: unreachable workflow bay ${space.id}`);
  }
  const features=new Map(b.features.map(x=>[x.name,x.position]));
  for(const n of ['forge-mouth','anvil'])assert.ok(within(features.get(n),forge.bounds),`${b.id}: ${n} outside forge zone`);
  assert.ok(within(features.get('non-operational bench'),stock.bounds),`${b.id}: bench outside stock zone`);
  assert.equal(b.architecture.physicalCellSlots,b.modules.reduce((sum,m)=>sum+m.cells.length,0));
 }
});

test('all 30 exterior galleries keep authored portal frames, while all cutaways remove unsupported floating doorway trim',()=>{
 for(const b of all){
  const outside=createPreviewMesh(b),inside=createPreviewMesh(b,{cutaway:true});
  assert.ok(outside.facesByRole['entry-frame']>0,`${b.id} exterior lacks framed entrance`);
  assert.equal(inside.facesByRole['entry-frame']||0,0,`${b.id} floating doorway frames in cutaway`);
  assert.ok(inside.sourceCells<outside.sourceCells,`${b.id} not cut away`);
 }
});

test('M1 geometry and unique slot allocation unchanged by room-boundary and cutaway corrections',()=>{
 assert.equal(all.length,30);
 assert.equal(all.reduce((n,b)=>n+b.architecture.physicalCellSlots,0),71293);
 assert.equal(new Set(all.map(b=>b.id)).size,30);
});
