import test from 'node:test';
import assert from 'node:assert/strict';
import {FITTINGS,describeFitting,createFittingFixture} from '../src/nonblock-fittings36/fittings-phase1.mjs';
const mounts={ground:{below:true},ceiling:{above:true},wall:{behind:true},corner:{corner:true}};
const EPS=0.026;
test('all four rotations contain every real triangle in selection bounds and preserve world anchor',()=>{
 for(const [sceneId,family] of Object.entries(FITTINGS)){
  for(const orientation of [0,1,2,3]){
   const o=describeFitting({sceneId,seed:179,anchor:[17,-20,31],orientation,mount:mounts[family.attachment]});
   const a=o.selectionAabbs[0],p=o.render.mesh.positions;
   assert.equal(p.length,o.render.triangleCount*9);
   for(let i=0;i<p.length;i+=3)for(let k=0;k<3;k++){
    assert.ok(p[i+k]>=a.min[k]-EPS && p[i+k]<=a.max[k]+EPS,sceneId+' rotated pick coverage');
   }
   assert.ok(a.min[0]>15 && a.max[0]<19 && a.min[2]>29 && a.max[2]<33);
   assert.ok(a.min[1]>=-20.1 && a.max[1]<-17);
  }
 }
});
test('orientation rotates non-symmetric geometry and makes unique removal targets',()=>{
 for(const [sceneId,family] of Object.entries(FITTINGS)){
  const base={sceneId,seed:2026,anchor:[2,-5,7],mount:mounts[family.attachment]};
  const a=describeFitting({...base,orientation:0}),b=describeFitting({...base,orientation:1});
  assert.notEqual(a.instanceKey,b.instanceKey);
  assert.notDeepEqual([...a.render.mesh.positions],[...b.render.mesh.positions]);
  const fixture=createFittingFixture(2026,[a,b]);
  fixture.breakObject(a);assert.deepEqual(fixture.visible().map(o=>o.instanceKey),[b.instanceKey]);
  const restore=createFittingFixture(2026,[a,b]);restore.restore(fixture.snapshot());
  assert.deepEqual(restore.visible().map(o=>o.instanceKey),[b.instanceKey]);
 }
});
