import assert from 'node:assert/strict';
import test from 'node:test';
import {auditSnowS6CrossOwnerForest as audit}
  from '../src/manual-biomes/snowy-s6-cross-owner-forest-audit.mjs';
import {proposedSnowTree} from '../src/manual-biomes/snowy-s3-tree-prototypes.mjs';
const M7='mythwrought-five-surface-regions-v7';
const key=(x,y,z)=>x+','+y+','+z;
function fixture(seed=179){
  const edits=new Map(),rotations=new Map(),caves=new Map(),additional=new Map();
  const get=(x,y,z)=>edits.get(key(x,y,z))??additional.get(key(x,y,z))??
    (y===6?272:y===5?278:y<5?3:0);
  const world={seed,generationProfile:{generator:M7},edits,rotations,
    environmentCaves:{get:(...p)=>caves.get(key(...p))},
    _columnPlan:()=>new Map([[5,278],[6,272]]),
    _environmentBaseline:get,naturalAndLandmarkBlock:get,get,
    save:()=>({schema:1,seed,edits:[...edits]})};
  const collides=(w,x,feet,z)=>{
    const r=.28,h=1.78,e=1e-5;
    for(let bx=Math.floor(x-r+e);bx<=Math.floor(x+r-e);bx++)
      for(let bz=Math.floor(z-r+e);bz<=Math.floor(z+r-e);bz++)
        for(let by=Math.floor(feet+e);by<=Math.floor(feet+h-e);by++)
          if(w.get(bx,by,bz)!==0)return true;
    return false;
  };
  const deps={biomeAt:()=>({name:'snow',weight:.96}),terrainHeight:()=>5,
    legacyNatural:()=>0,proposedSnowTree,
    planScenery:()=>[],describeScene:()=>null,collides};
  return {world,deps,caves,edits,additional};
}
test('negative/positive 2x2 canonical forest reconstructs real style voxels and saves',()=>{
  const v=fixture(),before=JSON.stringify(v.world.save());
  const a=audit(v.world,-1,32,v.deps);
  assert.equal(a.safe,true,a.reason);
  assert.equal(a.distinctAcceptedTrees,a.trees.length);
  assert.ok(a.distinctAcceptedTrees>=1,'genuine deterministic S3 fixture must contain a tree');
  assert.ok(a.physicalCells>0);
  assert.equal(a.chunks.length,4);
  assert.ok(a.chunks.every(c=>c.physicalCells<=640));
  assert.equal(Object.values(a.styleCounts).reduce((x,y)=>x+y,0),
    a.distinctAcceptedTrees);
  assert.ok(Object.keys(a.styleCounts).every(s=>
    ['compact-fir','layered-spruce','highland-pine','windswept-alpine'].includes(s)));
  assert.ok(a.protectedDirectedPortalPairs>=0);
  assert.equal(a.writerEnabled,false);
  assert.equal(a.noWholeWorldApproval,true);
  assert.equal(JSON.stringify(v.world.save()),before);
  assert.equal(v.edits.size,0);
  assert.ok(Object.isFrozen(a.trees)&&Object.isFrozen(a.styleCounts));
});
test('consumer chunk request order cannot change owner, style, physics or cells',()=>{
  for(const seed of [179,2026]){
    const v=fixture(seed);
    const a=audit(v.world,-1,32,v.deps);
    const b=audit(v.world,-1,32,v.deps,{reverse:true});
    assert.equal(a.safe,true,a.reason);
    assert.deepEqual(b,a);
    assert.equal(v.world.edits.size,0);
  }
});
test('an edited or cave-protected source tree is never accepted by both owners',()=>{
  const v=fixture();
  const good=audit(v.world,-1,32,v.deps);
  assert.equal(good.safe,true);
  const target=good.trees[0];
  const original=proposedSnowTree(target.style,target.x,target.floor,target.z,
    {wind:target.x===-999?1:1});
  assert.ok(original?.cells?.length);
  const [x,y,z]=original.cells[0];
  v.caves.set(key(x,y,z),0);
  const c=audit(v.world,-1,32,v.deps);
  assert.equal(c.safe,true,c.reason);
  assert.ok(c.distinctAcceptedTrees<=good.distinctAcceptedTrees);
  v.caves.clear();v.edits.set(key(x,y,z),0);
  const e=audit(v.world,-1,32,v.deps);
  assert.equal(e.safe,true,e.reason);
  assert.ok(e.distinctAcceptedTrees<=good.distinctAcceptedTrees);
  assert.equal(v.edits.get(key(x,y,z)),0);
});
test('invalid callback does not create a false original-player-body acceptance',()=>{
  const v=fixture();
  const r=audit(v.world,-1,32,{...v.deps,collides:()=>undefined});
  assert.equal(r.safe,false);
  assert.match(r.reason,/canonical-consumer|owner-reconstruction|original-body|callback/);
  assert.equal(v.world.edits.size,0);
});
test('wrong world profile, coordinate limits and malformed options fail closed',()=>{
  const v=fixture();
  assert.equal(audit({...v.world,generationProfile:{generator:'legacy'}},-1,32,v.deps).safe,false);
  assert.equal(audit(v.world,100001,32,v.deps).safe,false);
  assert.equal(audit(v.world,1.2,32,v.deps).safe,false);
  assert.equal(audit(v.world,-1,32,v.deps,{reverse:'yes'}).safe,false);
});
test('original saved edits and negative owner chunks remain read only',()=>{
  const v=fixture(2026);
  v.edits.set('31,6,512',0);
  const old=JSON.stringify(v.world.save());
  const a=audit(v.world,-1,32,v.deps);
  assert.equal(a.safe,true,a.reason);
  assert.equal(JSON.stringify(v.world.save()),old);
  assert.ok(a.trees.every(t=>t.owner.includes(',')));
});
