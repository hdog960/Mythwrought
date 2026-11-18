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

test('adjacent-cell edits and occupied voxels fail closed across full pick envelope',()=>{
 const o=make('crystal',7);
 const base=(x,y,z)=>y===-13?1:0;
 const clear=createEnvironmentSession({seed,objects:[o],blockAt:base,editedAt:edit,occupiedAt:occupied});
 assert.equal(clear.visible().length,1);
 const sideEdited=createEnvironmentSession({seed,objects:[o],blockAt:base,
  editedAt:(x,y,z)=>x===3&&y===-12&&z===8,occupiedAt:occupied});
 assert.equal(sideEdited.visible().length,0);
 assert.equal(sideEdited.breakByKey(o.instanceKey),false);
 const sideOccupied=createEnvironmentSession({seed,objects:[o],blockAt:base,
  editedAt:edit,occupiedAt:(x,y,z)=>x===3&&y===-12&&z===8});
 assert.equal(sideOccupied.visible().length,0);
 const sideSolid=createEnvironmentSession({seed,objects:[o],
  blockAt:(x,y,z)=>base(x,y,z)||(x===3&&y===-12&&z===8?1:0),
  editedAt:edit,occupiedAt:occupied});
 assert.equal(sideSolid.visible().length,0);
 assert.deepEqual(sideSolid.snapshot().tombstones,[]);
});

test('overlapping objects reserve one deterministic footprint, even after break and reload',()=>{
 const a=make('stalagmite',0),b=make('crystal',1);
 const world={seed,blockAt:(x,y,z)=>y===-13?1:0,editedAt:edit,occupiedAt:occupied};
 const forward=createEnvironmentSession({...world,objects:[a,b]});
 const reverse=createEnvironmentSession({...world,objects:[b,a]});
 assert.equal(forward.visible().length,1);
 assert.deepEqual(forward.visible().map(o=>o.instanceKey),reverse.visible().map(o=>o.instanceKey));
 const winner=forward.visible()[0].instanceKey;
 assert.equal(forward.breakByKey(winner),true);
 assert.equal(forward.visible().length,0,'breaking does not reveal overlapping rejected object');
 const restored=createEnvironmentSession({...world,objects:[b,a],snapshot:forward.snapshot()});
 assert.equal(restored.visible().length,0);
 assert.equal(restored.breakByKey(b.instanceKey===winner?a.instanceKey:b.instanceKey),false);
});
test('non-overlapping placements survive deterministic reservation',()=>{
 const a=make('stalagmite',0),b=make('crystal',1,{x:8,y:-12,z:8});
 const session=createEnvironmentSession({seed,objects:[b,a],blockAt:(x,y,z)=>y===-13?1:0,editedAt:edit,occupiedAt:occupied});
 assert.equal(session.visible().length,2);
});


test('full safe-integer seed and anchor identity never alias via 32-bit truncation',()=>{
 const largeSeed=179+2**32;
 const largeX=4+2**32;
 const base=makeEnvironmentObject('stalagmite',{seed:179,anchor,variant:0});
 const differentSeed=makeEnvironmentObject('stalagmite',{seed:largeSeed,anchor,variant:0});
 const differentAnchor=makeEnvironmentObject('stalagmite',{seed:179,anchor:{...anchor,x:largeX},variant:0});
 assert.notEqual(base.instanceKey,differentSeed.instanceKey);
 assert.notEqual(base.instanceKey,differentAnchor.instanceKey);
 assert.equal(differentSeed.seed,largeSeed);
 assert.equal(differentAnchor.anchor.x,largeX);
 assert.equal(validateEnvironmentObject(differentSeed),true);
 assert.throws(()=>makeEnvironmentObject('stalagmite',{seed:Number.MAX_SAFE_INTEGER+1,anchor}));
 assert.throws(()=>makeEnvironmentObject('stalagmite',{seed:179,anchor:{...anchor,x:Number.MAX_SAFE_INTEGER+1}}));
 const session=createEnvironmentSession({seed:largeSeed,objects:[differentSeed],blockAt:(x,y,z)=>y===-13?1:0,editedAt:edit,occupiedAt:occupied});
 assert.equal(session.visible().length,1);
 const saved=session.snapshot();
 assert.equal(saved.seed,largeSeed);
 assert.equal(createEnvironmentSession({seed:largeSeed,objects:[differentSeed],blockAt:(x,y,z)=>y===-13?1:0,editedAt:edit,occupiedAt:occupied,snapshot:saved}).visible().length,1);
 assert.throws(()=>createEnvironmentSession({seed:179,objects:[differentSeed],blockAt:support,editedAt:edit,occupiedAt:occupied}));
});
