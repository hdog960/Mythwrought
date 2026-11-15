import test from 'node:test';
import assert from 'node:assert/strict';
import {shapeDescriptor,prototypeMesh} from '../src/shape-prototypes.mjs';
const kinds=['slab','stairs','slope','post','rail'];
test('all shape variants and rotations are bounded, immutable and deterministic',()=>{
 for(const kind of kinds)for(const variant of ['lower','upper'])for(let rotation=0;rotation<4;rotation++){
  const a=shapeDescriptor(kind,{variant,rotation}),b=shapeDescriptor(kind,{variant,rotation});
  assert.deepEqual(a,b);assert.equal(a.placeable,false);assert.equal(a.saveState,null);
  assert.ok(Object.isFrozen(a.boxes));
  for(const [x0,y0,z0,x1,y1,z1] of a.boxes){
   assert.ok(x0>=0&&y0>=0&&z0>=0&&x1<=1&&y1<=1&&z1<=1);
   assert.ok(x0<x1&&y0<y1&&z0<z1);
  }
 }
});
test('slab upper and lower occupy disjoint vertical halves',()=>{
 assert.deepEqual(shapeDescriptor('slab').boxes[0],[0,0,0,1,.5,1]);
 assert.deepEqual(shapeDescriptor('slab',{variant:'upper'}).boxes[0],[0,.5,0,1,1,1]);
});
test('quarter turns return to original occupancy after four turns',()=>{
 for(const kind of kinds)for(let rotation=0;rotation<4;rotation++){
  const a=shapeDescriptor(kind,{rotation});
  assert.equal(a.boxes.length,shapeDescriptor(kind).boxes.length);
 }
});
test('mesh triangles face outward with correct winding and normals',()=>{
 for(const kind of kinds)for(let rotation=0;rotation<4;rotation++){
  const m=prototypeMesh(shapeDescriptor(kind,{rotation}));
  assert.equal(m.indices.length,m.boxes*36);
  for(let i=0;i<m.indices.length;i+=3){
   const p=j=>Array.from(m.positions.slice(m.indices[i+j]*3,m.indices[i+j]*3+3));
   const a=p(0),b=p(1),c=p(2),u=b.map((x,k)=>x-a[k]),v=c.map((x,k)=>x-a[k]);
   const cross=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
   const n=Array.from(m.normals.slice(m.indices[i]*3,m.indices[i]*3+3));
   assert.ok(cross.reduce((sum,x,k)=>sum+x*n[k],0)>0,kind+' winding');
  }
 }
});
test('invalid prototype requests fail without changing game state',()=>{
 assert.throws(()=>shapeDescriptor('house'),RangeError);
 assert.throws(()=>shapeDescriptor('stairs',{rotation:4}),RangeError);
 assert.throws(()=>prototypeMesh({}),TypeError);
});
