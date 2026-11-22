import assert from 'node:assert/strict';
import test from 'node:test';
import {proposedSnowTree} from '../src/manual-biomes/snowy-s3-tree-prototypes.mjs';
import {inspectSnowS3OriginalSceneClearance}
  from '../src/manual-biomes/snowy-s3-s5-original-scene-clearance.mjs';

const M7='mythwrought-five-surface-regions-v7';
function sample(x=15,z=-1){
  const floor=6,shape=proposedSnowTree('layered-spruce',x,floor,z);
  const candidate=Object.freeze({kind:'detached-s3-physically-checked-proposal',
    key:x+','+z,x,z,floor,style:'layered-spruce',
    voxelCount:shape.cells.length,
    cells:Object.freeze(shape.cells.map(v=>Object.freeze([...v])))});
  const edits=new Map(),world={seed:179,generationProfile:{generator:M7},edits,
    save:()=>({schema:1,seed:179,edits:[...edits]})};
  return {candidate,world,edits,floor,x,z};
}
function scene(sceneId,anchor,{min,max,colliders=[],supports}={}){
  const [x,y,z]=anchor;
  return {contract:'nonblock-object-v1',sceneId,seed:179,anchor,
    instanceKey:`nb1:${sceneId}:179:${x},${y},${z}:0`,
    min:min??[x+.3,y,z+.3],max:max??[x+.6,y+.6,z+.6],
    supports:supports??[[x,y-1,z]],colliders};
}
function deps(objects,locate=()=>true){
  return {planScenery:(world,cx,cz)=>objects.filter((o)=>locate(o,cx,cz))
    .map(o=>({sceneId:o.sceneId,anchor:[...o.anchor],variant:0,orientation:0})),
  describeScene:(seed,p)=>objects.find(o=>o.sceneId===p.sceneId&&
    o.anchor.join(',')===p.anchor.join(','))};
}

test('S3 preserves original winter scenery whose actual mesh occupies tree leaves despite a clear anchor',()=>{
  const {world,candidate}=sample();
  const foliage=candidate.cells.find(v=>v[3]===407);
  assert.ok(foliage);
  const [a,b,c]=foliage;
  // Source object's anchor is DIFFERENT from this tree voxel, so the old
  // anchor-only S5 check would have missed its extended geometry.
  const old=scene('nonblock:d:frost-fern',[a+1,b,c],{
    min:[a+.6,b+.1,c+.6],max:[a+1.2,b+.7,c+1.2]});
  assert.notDeepEqual(old.anchor,[a,b,c]);
  const r=inspectSnowS3OriginalSceneClearance(world,candidate,deps([old]));
  assert.equal(r.safe,false);
  assert.equal(r.reason,'overlaps-original-scene-mesh-bounds');
  assert.equal(r.sceneId,old.sceneId);
  assert.deepEqual(r.voxel,[a,b,c]);
  assert.equal(world.edits.size,0);
});

test('S3 rejects old world prop supports and collision boxes even when visible mesh does not overlap',()=>{
  const {world,candidate}=sample(-1,15);
  const target=candidate.cells.find(v=>v[3]===4);
  assert.ok(target);
  const [x,y,z]=target;
  const support=scene('scene36:freestanding-torch',[x+6,y,z],{
    min:[x+6,y,z],max:[x+6.4,y+.5,z+.4],supports:[[x,y,z]]});
  const r=inspectSnowS3OriginalSceneClearance(world,candidate,deps([support]));
  assert.equal(r.reason,'would-remove-original-scene-support');
  const collider=scene('scene36:freestanding-torch',[x+6,y,z],{
    min:[x+6,y,z],max:[x+6.4,y+.5,z+.4],supports:[[x+6,y-1,z]],
    colliders:[[x+.12,y+.12,z+.12,x+.88,y+.88,z+.88]]});
  const c=inspectSnowS3OriginalSceneClearance(world,candidate,deps([collider]));
  assert.equal(c.reason,'overlaps-original-scene-collider');
});

test('S3 checks 3x3 original chunk scene neighborhood consistently at positive and negative seams',()=>{
  for(const x of [-1,15]){
    const {world,candidate,z}=sample(x,0);
    const cx=Math.floor(x/16),cz=0;
    const o=scene('nonblock:d:snowgrass',[x+20,8,z+1]);
    const called=new Set();
    const dependencies=deps([o],(_,a,b)=>{
      called.add(a+','+b);return a===cx+1&&b===cz;
    });
    const r=inspectSnowS3OriginalSceneClearance(world,candidate,dependencies);
    assert.deepEqual(r,inspectSnowS3OriginalSceneClearance(world,candidate,dependencies));
    assert.equal(r.safe,true);
    assert.equal(r.reviewedScenes,1);
    assert.equal(r.inspectedChunks,9);
    assert.equal(called.size,9);
    assert.equal(r.reviewedCells,candidate.voxelCount);
    assert.equal(r.worldUnchanged,true);
  }
});

test('S3 fail closes missing original scene contract, oversized/malformed plan, and source mutation',()=>{
  const {world,candidate,edits}=sample();
  assert.equal(inspectSnowS3OriginalSceneClearance(world,candidate,{...deps([]),
    originalSceneBlob:'not-original'}).safe,false);
  assert.equal(inspectSnowS3OriginalSceneClearance({...world,generationProfile:{generator:'legacy'}},
    candidate,deps([])).safe,false);
  assert.equal(inspectSnowS3OriginalSceneClearance(world,candidate,{...deps([]),
    planScenery:()=>Array(49).fill({sceneId:'x',anchor:[0,0,0]})}).reason,
  'unbounded-original-scene-plan');
  const a=scene('nonblock:d:snowgrass',[15,8,0]);
  const wrong={...a,contract:'unknown'};
  assert.equal(inspectSnowS3OriginalSceneClearance(world,candidate,deps([wrong])).reason,
    'untrusted-original-scene-contract');
  assert.equal(inspectSnowS3OriginalSceneClearance(world,candidate,{...deps([]),
    planScenery:()=>{edits.set('1,8,1',0);return []}}).reason,
    'world-changed-during-read-only-scene-review');
});

test('S3 rejects inconsistent repeated source identities before any detached tree approval',()=>{
  const {world,candidate}=sample();
  const base=scene('nonblock:d:dwarf-juniper',[candidate.x+8,8,candidate.z]);
  let calls=0;
  const r=inspectSnowS3OriginalSceneClearance(world,candidate,{
    planScenery:()=>[{sceneId:base.sceneId,anchor:[...base.anchor]}],
    describeScene:()=>{
      const copy={...base,min:[...base.min],max:[...base.max]};
      if(calls++>0)copy.max[0]+=.05;
      return copy;
    }
  });
  assert.equal(r.safe,false);
  assert.equal(r.reason,'inconsistent-duplicate-original-scene-identity');
  assert.equal(world.edits.size,0);
});
