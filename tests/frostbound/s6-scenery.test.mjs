import test from 'node:test';
import assert from 'node:assert/strict';
import {FrostboundSceneryCandidate,SNOW_SCENERY} from '../../src/frostbound/s3-scenery.mjs';
import {describeCandidateObject,candidateVertices} from '../../src/nonblock/candidate-scene.mjs';
import {meshChunk} from '../../src/voxel.mjs';
import {FrostboundS3Candidate} from '../../src/frostbound/s3-ground.mjs';
test('actual source scenery census, contact, placement safety, deterministic bounded layouts',()=>{
 const counts={};let sites=0,placements=0,maxInstances=0,maxBytes=0;const witnesses=[];
 for(const seed of [179,2026,-77]){
  const w=new FrostboundSceneryCandidate(seed);let first,firstBerry;
  for(let cx=-16;cx<=16;cx++)for(let cz=17;cz<=46;cz++){
   sites++;const rows=w.sceneryChunk(cx,cz);for(const row of rows){placements++;counts[row.sceneId]=(counts[row.sceneId]??0)+1;const [x,y,z]=row.anchor,o=describeCandidateObject(seed,row);assert.equal(w.get(x,y,z),0);assert.ok([272,276,279].includes(w.get(x,y-1,z)));assert.equal(w.environmentCaves.get(x,y,z),undefined);assert.ok(Math.abs(o.min[1]-y)<1e-5);assert.equal(o.colliders.length,0);first??={cx,cz,rows,anchor:row.anchor};
    if(row.sceneId===SNOW_SCENERY.frostBerry){
     assert.deepEqual([x-cx*16,z-cz*16],[12,6]);
     assert.deepEqual(o.supports,[[x,y-1,z]]);
     assert.ok(o.materials.includes(3)&&o.materials.includes(4));
     firstBerry??={cx,cz,rows,anchor:row.anchor};
    }
   }
   if(cx%4===0&&cz%4===0){const layout=w.sceneryLayout(cx,cz),objects=w.sceneryScene(cx,cz).visible(),packed=candidateVertices(objects);assert.equal(objects.length,layout.length);assert.ok(layout.length<=27);assert.equal(new Set(layout.map(o=>o.anchor.join(','))).size,layout.length);assert.ok(packed.every(Number.isFinite));maxInstances=Math.max(maxInstances,objects.length);maxBytes=Math.max(maxBytes,packed.byteLength);}
  }
  assert.ok(first);assert.ok(w._snowScenery.size<=64);assert.deepEqual(w.sceneryChunk(first.cx,first.cz),first.rows);const scene=w.sceneryScene(first.cx,first.cz);const [x,y,z]=first.anchor;const before=scene.visible().find(o=>o.anchor.join(',')===first.anchor.join(','));assert.ok(before);const support=w.get(x,y-1,z);assert.ok(w.set(x,y-1,z,0));assert.ok(!scene.visible().some(o=>o.instanceKey===before.instanceKey));assert.ok(w.set(x,y-1,z,support));assert.equal(w.get(x,y-1,z),support);assert.equal(w.edits.size,0);assert.ok(scene.visible().some(o=>o.instanceKey===before.instanceKey));assert.ok(!w.sceneryScene(first.cx,first.cz,{occupied:(a,b,c)=>a===x&&b===y&&c===z}).visible().some(o=>o.instanceKey===before.instanceKey));
  assert.ok(firstBerry);
  assert.deepEqual(w.sceneryChunk(firstBerry.cx,firstBerry.cz),firstBerry.rows);
  assert.deepEqual(meshChunk(w,0,0),meshChunk(new FrostboundS3Candidate(seed),0,0));assert.throws(()=>w.save(),/not a registered/);witnesses.push({seed,anchor:first.anchor,frostBerry:firstBerry.anchor});
 }
 assert.equal(placements-counts[SNOW_SCENERY.frostBerry],5004);
 assert.equal(Object.keys(counts).length,Object.keys(SNOW_SCENERY).length);console.log('S6_SCENERY '+JSON.stringify({sites,placements,counts,maxInstances,maxBytes,witnesses}));
});
test('original scene selection and isolated tombstone round trip for a natural frost berry',()=>{
 const w=new FrostboundSceneryCandidate(179);let found;
 outer:for(let cx=-16;cx<=16;cx++)for(let cz=17;cz<=46;cz++){const scene=w.sceneryScene(cx,cz);for(const o of scene.visible()){
  if(o.sceneId!==SNOW_SCENERY.frostBerry)continue;
  for(let i=0;i<o.positions.length;i+=9){const p=o.positions,mid=[0,1,2].map(j=>(p[i+j]+p[i+3+j]+p[i+6+j])/3),origin=[mid[0],mid[1]+1,mid[2]],dir=[0,-1,0];const hit=scene.pick(origin,dir,3);if(hit?.instanceKey===o.instanceKey){found={cx,cz,o,origin,dir};break outer;}}
 }}assert.ok(found);const {cx,cz,o,origin,dir}=found;const map=new Map(),storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};const scene=w.sceneryScene(cx,cz,{storage}),hit=scene.pick(origin,dir,3);assert.equal(hit.instanceKey,o.instanceKey);assert.ok(scene.breakHit(hit,origin,dir));assert.ok(!w.sceneryScene(cx,cz,{storage}).visible().some(p=>p.instanceKey===o.instanceKey));assert.equal(map.size,2);console.log('S6_REMOVAL '+o.instanceKey);
});
