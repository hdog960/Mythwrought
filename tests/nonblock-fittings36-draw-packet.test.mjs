import test from 'node:test';
import assert from 'node:assert/strict';
import {describeFitting,FITTINGS} from '../src/nonblock-fittings36/fittings-phase1.mjs';
import {compileFittingDrawPackets} from '../src/nonblock-fittings36/draw-packet-compiler.mjs';
const mounts={ground:{below:true},ceiling:{above:true},wall:{behind:true},corner:{corner:true}};
const make=(sceneId,orientation=0,anchor=[12,0,7])=>describeFitting({
 sceneId,seed:179,anchor,variant:1,orientation,mount:mounts[FITTINGS[sceneId].attachment]
});
test('five canonical family meshes compile across all four orientations',()=>{
 for(const sceneId of Object.keys(FITTINGS)){
  const objects=[0,1,2,3].map(r=>make(sceneId,r,[12+r*5,0,7]));
  const plan=compileFittingDrawPackets(objects);
  assert.equal(plan.objectCount,4);
  assert.equal(plan.packets.length,1);
  assert.equal(plan.packets[0].instances.length,4);
  assert.deepEqual(plan.packets[0].instances.map(x=>x.quarterTurnsY),[0,1,2,3]);
  assert.equal(plan.packets[0].positions.length,objects[0].render.localMesh.positions.length);
 }
});
test('separate families never share a draw packet',()=>{
 const plan=compileFittingDrawPackets(Object.keys(FITTINGS).map((s,i)=>make(s,0,[i*5,0,0])));
 assert.equal(plan.objectCount,5);
 assert.equal(plan.packets.length,5);
});
test('tampered world-space triangles are rejected even with valid canonical mesh',()=>{
 const o=make('scene36:signpost');
 o.render.mesh.positions[0]+=0.125;
 assert.throws(()=>compileFittingDrawPackets([o]),/transform mismatch/);
});
test('mutated canonical geometry is rejected if instances differ',()=>{
 const a=make('scene36:signpost',0,[0,0,0]),b=make('scene36:signpost',1,[5,0,0]);
 b.render.localMesh.positions[0]+=0.1;
 assert.throws(()=>compileFittingDrawPackets([a,b]),/incompatible instanced geometry|noncanonical/);
});
test('draw packets do not alias mutable source mesh buffers',()=>{
 const o=make('scene36:rope-coil');
 const plan=compileFittingDrawPackets([o]),before=plan.packets[0].positions[0];
 o.render.localMesh.positions[0]+=0.25;
 assert.equal(plan.packets[0].positions[0],before);
});
test('global budget remains fail closed',()=>{
 const objects=[0,1,2].map(i=>make('scene36:signpost',0,[i*5,0,0]));
 assert.throws(()=>compileFittingDrawPackets(objects,{maxObjects:2}),/budget exceeded/);
});
