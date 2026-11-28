import test from 'node:test';
import assert from 'node:assert/strict';
import {FrostboundSceneryCandidate,SNOW_SCENERY} from '../../src/frostbound/s3-scenery.mjs';
import {describeCandidateObject,candidateVertices} from '../../src/nonblock/candidate-scene.mjs';
import {meshChunk} from '../../src/voxel.mjs';
import {FrostboundS3Candidate} from '../../src/frostbound/s3-ground.mjs';
const newScenery=new Map([
 [SNOW_SCENERY.frostBerry,{offset:[12,6],materials:[3,4]}],
 [SNOW_SCENERY.exposedRoot,{offset:[6,12],materials:[0,1],wood:true}],
 [SNOW_SCENERY.fallenBranch,{offset:[11,10],materials:[0,1,2],wood:true}],
 [SNOW_SCENERY.fallenLog,{offset:[5,5],materials:[0,1,2,3],solid:true}],
]);
test('a cold Frostbound scene reads a log tombstone outside the snow region',()=>{
 const id=SNOW_SCENERY.fallenLog,worldId='frostbound-scenery-research',seed=179;
 const key=`mythwrought:nonblock-stage:v1:${worldId}:${seed}`;
 const record=JSON.stringify({version:'mythwrought-nonblock-removals-v1',worldId,seed,
  tombstones:[`nb1:${encodeURIComponent(id)}:${seed}:-203,8,309:3`]});
 const scene=new FrostboundSceneryCandidate(seed).sceneryScene(0,0,{storage:{getItem:k=>k===key?record:null}});
 assert.deepEqual(scene.visible(),[]);
 assert.equal(scene.recovered,false);
});
test('actual source scenery census, contact, placement safety, deterministic bounded layouts',()=>{
 const counts={};let sites=0,placements=0,maxInstances=0,maxBytes=0;const witnesses=[];
 for(const seed of [179,2026,-77]){
  const w=new FrostboundSceneryCandidate(seed),firstByFamily=new Map(),logVariants=new Set();let first;
  for(let cx=-16;cx<=16;cx++)for(let cz=17;cz<=46;cz++){
   sites++;const rows=w.sceneryChunk(cx,cz);for(const row of rows){placements++;counts[row.sceneId]=(counts[row.sceneId]??0)+1;const [x,y,z]=row.anchor,o=describeCandidateObject(seed,row);assert.equal(w.get(x,y,z),0);assert.ok([272,276,279].includes(w.get(x,y-1,z)));assert.equal(w.environmentCaves.get(x,y,z),undefined);assert.ok(Math.abs(o.min[1]-y)<1e-5);first??={cx,cz,rows,anchor:row.anchor};
    const family=newScenery.get(row.sceneId);
    assert.equal(Boolean(o.colliders.length),family?.solid===true);
    if(family){
     assert.deepEqual([x-cx*16,z-cz*16],family.offset);
     assert.deepEqual(o.supports,[[x,y-1,z]]);
     assert.ok(family.materials.every(material=>o.materials.includes(material)));
     if(family.solid){
      logVariants.add(row.variant);
      const acrossZ=row.variant%2===1,dx=Number(!acrossZ),dz=Number(acrossZ),axis=acrossZ?2:0;
      assert.ok(o.max[axis]-o.min[axis]>2&&o.max[axis]-o.min[axis]<3);
      assert.ok(o.min[0]>=x-dx&&o.max[0]<=x+1+dx&&o.min[2]>=z-dz&&o.max[2]<=z+1+dz);
      for(const side of [-1,1]){
       const a=x+side*dx,b=z+side*dz;
       assert.ok([272,276,279].includes(w.get(a,y-1,b)));
       assert.equal(w.get(a,y,b),0);
       for(const height of [y-2,y-1,y,y+1])assert.equal(w.environmentCaves.get(a,height,b),undefined);
      }
      assert.ok(o.colliders.some(([x0,y0,z0,x1,,z1])=>y0===y&&x0<x+.5&&x1>x+.5&&z0<z+.5&&z1>z+.5));
     }else assert.ok(o.min[0]>=x&&o.max[0]<=x+1&&o.min[2]>=z&&o.max[2]<=z+1);
     if(family.wood){
      assert.ok(Math.max(o.max[0]-o.min[0],o.max[2]-o.min[2])>.6);
      assert.ok(o.max[1]-y<.35);
     }
     if(!firstByFamily.has(row.sceneId))firstByFamily.set(row.sceneId,{cx,cz,rows,anchor:row.anchor});
    }
   }
   if(cx%4===0&&cz%4===0){const layout=w.sceneryLayout(cx,cz),objects=w.sceneryScene(cx,cz).visible(),packed=candidateVertices(objects);assert.equal(objects.length,layout.length);assert.ok(layout.length<=27);assert.equal(new Set(layout.map(o=>o.anchor.join(','))).size,layout.length);assert.ok(packed.every(Number.isFinite));maxInstances=Math.max(maxInstances,objects.length);maxBytes=Math.max(maxBytes,packed.byteLength);}
  }
  assert.ok(first);assert.ok(w._snowScenery.size<=64);assert.deepEqual(w.sceneryChunk(first.cx,first.cz),first.rows);const scene=w.sceneryScene(first.cx,first.cz);const [x,y,z]=first.anchor;const before=scene.visible().find(o=>o.anchor.join(',')===first.anchor.join(','));assert.ok(before);const support=w.get(x,y-1,z);assert.ok(w.set(x,y-1,z,0));assert.ok(!scene.visible().some(o=>o.instanceKey===before.instanceKey));assert.ok(w.set(x,y-1,z,support));assert.equal(w.get(x,y-1,z),support);assert.equal(w.edits.size,0);assert.ok(scene.visible().some(o=>o.instanceKey===before.instanceKey));assert.ok(!w.sceneryScene(first.cx,first.cz,{occupied:(a,b,c)=>a===x&&b===y&&c===z}).visible().some(o=>o.instanceKey===before.instanceKey));
  assert.equal(firstByFamily.size,newScenery.size);
  assert.equal(logVariants.size,4);
  for(const {cx,cz,rows} of firstByFamily.values())assert.deepEqual(w.sceneryChunk(cx,cz),rows);
  assert.deepEqual(meshChunk(w,0,0),meshChunk(new FrostboundS3Candidate(seed),0,0));assert.throws(()=>w.save(),/not a registered/);witnesses.push({seed,anchor:first.anchor,...Object.fromEntries([...firstByFamily].map(([id,row])=>[id,row.anchor]))});
 }
 assert.equal(placements-[...newScenery.keys()].reduce((sum,id)=>sum+counts[id],0),5004);
 assert.equal(counts[SNOW_SCENERY.frostBerry],547);
 assert.equal(counts[SNOW_SCENERY.exposedRoot],287);
 assert.equal(counts[SNOW_SCENERY.fallenBranch],231);
 assert.equal(Object.keys(counts).length,Object.keys(SNOW_SCENERY).length);console.log('S6_SCENERY '+JSON.stringify({sites,placements,counts,maxInstances,maxBytes,witnesses}));
});
test('original scene selection and isolated tombstone round trips for Frostbound scenery',()=>{
 const w=new FrostboundSceneryCandidate(179),witnesses=new Map();
 outer:for(let cx=-16;cx<=16;cx++)for(let cz=17;cz<=46;cz++){
  const scene=w.sceneryScene(cx,cz);
  for(const o of scene.visible()){
   if(!newScenery.has(o.sceneId)||witnesses.has(o.sceneId))continue;
   for(let i=0;i<o.positions.length;i+=9){
    const p=o.positions,mid=[0,1,2].map(j=>(p[i+j]+p[i+3+j]+p[i+6+j])/3),origin=[mid[0],mid[1]+1,mid[2]],dir=[0,-1,0];
    if(scene.pick(origin,dir,3)?.instanceKey!==o.instanceKey)continue;
    witnesses.set(o.sceneId,{cx,cz,o,origin,dir});
    if(witnesses.size===newScenery.size)break outer;
    break;
   }
  }
 }
 assert.equal(witnesses.size,newScenery.size);
 for(const {cx,cz,o,origin,dir} of witnesses.values()){
  const map=new Map(),storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};
  const scene=w.sceneryScene(cx,cz,{storage}),hit=scene.pick(origin,dir,3);
  assert.equal(hit.instanceKey,o.instanceKey);
  const originalCount=scene.visible().length;
  const [x,y,z]=o.anchor;
  const body=[x+.42,y+.02,z+.42,x+.58,y+.40,z+.58];
  if(o.sceneId===SNOW_SCENERY.fallenLog){
   assert.ok(scene.bodyIntersects(body));
   const support=w.get(x,y-1,z);
   assert.ok(w.set(x,y-1,z,0));
   assert.ok(!scene.bodyIntersects(body));
   assert.ok(w.set(x,y-1,z,support));
   assert.ok(scene.bodyIntersects(body));
   const alongZ=o.variant%2===1;
   const side=[x+Number(!alongZ),y,z+Number(alongZ)];
   const blocked=w.sceneryScene(cx,cz,{occupied:(...point)=>point.every((n,j)=>n===side[j])});
   assert.ok(!blocked.visible().some(row=>row.instanceKey===o.instanceKey));
  }
  assert.ok(scene.breakHit(hit,origin,dir));
  const reopened=w.sceneryScene(cx,cz,{storage}),visible=reopened.visible();
  assert.ok(!visible.some(p=>p.instanceKey===o.instanceKey));
  if(o.sceneId===SNOW_SCENERY.fallenLog)assert.ok(!reopened.bodyIntersects(body));
  assert.equal(visible.length,originalCount-1);
  assert.equal(map.size,2);
  console.log('S6_REMOVAL '+o.instanceKey);
 }
});
