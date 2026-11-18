import test from 'node:test';
import assert from 'node:assert/strict';
import {makeEnvironmentObject,validateEnvironmentObject,environmentRayPick,createEnvironmentSession,COMPATIBILITY} from '../../src/nonblock-environments24/interaction.mjs';
const seed=179,anchor={x:4,y:-12,z:8};
const make=(family,variant=0,a=anchor)=>makeEnvironmentObject(family,{seed,anchor:a,variant});
const families=['stalagmite','stalactite','crystal','icicle','agave'];
const support=(x,y,z)=>y===-13||y===-11?1:0;
const edit=()=>false,occupied=()=>false;
test('all five source meshes and eight variants fit selection volumes and budgets',()=>{
 for(const family of families)for(let variant=0;variant<8;variant++)assert.equal(validateEnvironmentObject(make(family,variant)),true);
 assert.equal(COMPATIBILITY.status,'proposal-only');
});
test('ray picking resolves nearest anchored object, range and removal state',()=>{
 const objects=[make('stalagmite',0,{x:4,y:-12,z:8}),make('crystal',1,{x:7,y:-12,z:8})];
 const session=createEnvironmentSession({seed,objects,blockAt:(x,y,z)=>y===-13?1:0,editedAt:edit,occupiedAt:occupied});
 assert.equal(session.visible().length,2);
 const hit=session.pick([4,-11.4,4],[0,0,1],6);
 assert.equal(hit.instanceKey,objects[0].instanceKey);
 assert.equal(session.breakByKey(hit.instanceKey),true);
 assert.equal(session.breakByKey(hit.instanceKey),false);
 assert.equal(session.pick([4,-11.4,4],[0,0,1],6),null);
 const saved=JSON.parse(JSON.stringify(session.snapshot()));
 const reload=createEnvironmentSession({seed,objects,blockAt:(x,y,z)=>y===-13?1:0,editedAt:edit,occupiedAt:occupied,snapshot:saved});
 assert.equal(reload.visible().length,1);
 assert.equal(reload.visible()[0].instanceKey,objects[1].instanceKey);
 assert.throws(()=>createEnvironmentSession({seed:1,objects,blockAt:support,editedAt:edit,occupiedAt:occupied}));
 assert.throws(()=>createEnvironmentSession({seed,objects,blockAt:support,editedAt:edit,occupiedAt:occupied,snapshot:{...saved,tombstones:['invented']}}));
});
test('support, edited headroom and occupancy prevent picking and breaking',()=>{
 const o=make('stalagmite');
 for(const change of [
  {blockAt:()=>0,editedAt:edit,occupiedAt:occupied},
  {blockAt:(x,y)=>y===-13?1:0,editedAt:(x,y)=>y===-13,occupiedAt:occupied},
  {blockAt:(x,y)=>y===-13?1:0,editedAt:edit,occupiedAt:(x,y)=>y===-12}
 ]){
  const session=createEnvironmentSession({seed,objects:[o],...change});
  assert.equal(session.visible().length,0);
  assert.equal(session.pick([4,-11,6],[0,0,1]),null);
  assert.equal(session.breakByKey(o.instanceKey),false);
 }
});
test('malformed geometry and invalid rays fail closed',()=>{
 const o=make('agave');
 assert.throws(()=>validateEnvironmentObject({...o,mesh:{...o.mesh,positions:[Infinity,0,0]}}));
 assert.throws(()=>environmentRayPick([o],[0,0,0],[0,0,0]));
 assert.throws(()=>environmentRayPick([o],[0,0,0],[0,0,1],-1));
});
