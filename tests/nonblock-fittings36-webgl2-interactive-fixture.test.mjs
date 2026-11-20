import test from 'node:test';
import assert from 'node:assert/strict';
import {describeFitting,FITTINGS} from '../src/nonblock-fittings36/fittings-phase1.mjs';
import {flattenFittingTriangles,createFittingsWebGL2Fixture} from '../src/nonblock-fittings36/webgl2-interactive-fixture.mjs';

const mounts={ground:{below:true},ceiling:{above:true},wall:{behind:true},corner:{corner:true}};
const make=(sceneId,orientation=0,anchor=[0,0,0])=>describeFitting({
 sceneId,seed:179,orientation,anchor,mount:mounts[FITTINGS[sceneId].attachment]
});
test('all five real non-cubic meshes compile into finite, bounded WebGL2 vertices',()=>{
 for(const sceneId of Object.keys(FITTINGS)){
  const object=make(sceneId),data=flattenFittingTriangles([object]);
  assert.ok(data.triangleCount>0);
  assert.equal(data.positions.length,data.triangleCount*9);
  assert.equal(data.rgb.length,data.positions.length);
  assert.ok(data.positions.every(Number.isFinite));
  assert.ok(data.uploadBytes<=4*1024*1024);
  assert.equal(data.instanceCount,1);
 }
});
test('authored geometry follows cardinal rotation and anchor translation without losing triangles',()=>{
 const a=flattenFittingTriangles([make('scene36:signpost',0)]);
 const b=flattenFittingTriangles([make('scene36:signpost',1,[4,0,3])]);
 assert.equal(a.triangleCount,b.triangleCount);
 for(let i=0;i<a.positions.length;i+=3){
  assert.ok(Math.abs(b.positions[i]-(4-a.positions[i+2]))<0.00001);
  assert.ok(Math.abs(b.positions[i+1]-a.positions[i+1])<0.00001);
  assert.ok(Math.abs(b.positions[i+2]-(3+a.positions[i]))<0.00001);
 }
});
test('WebGL2 fixture refuses missing real browser context instead of fake screenshots',()=>{
 assert.throws(()=>createFittingsWebGL2Fixture({getContext:()=>null}),/real WebGL2 required/);
 assert.throws(()=>createFittingsWebGL2Fixture(null),/real WebGL2 required/);
});
test('zero visible objects produce zero triangles after authorized removal',()=>{
 const object=make('scene36:rope-coil');
 assert.ok(flattenFittingTriangles([object]).triangleCount>0);
 const empty=flattenFittingTriangles([]);
 assert.equal(empty.triangleCount,0);
 assert.equal(empty.uploadBytes,0);
});
