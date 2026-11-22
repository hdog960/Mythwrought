import assert from 'node:assert/strict';
import test from 'node:test';
import {surveySnowS4ChunkSeams}
  from '../src/manual-biomes/snowy-s4-seam-evidence.mjs';
const key=(x,y,z)=>`${x},${y},${z}`;
const M7='mythwrought-five-surface-regions-v7';
function make(){
  const edits=new Map(),caves=new Map(),soil=new Map();
  const top=(x,z)=>x===16&&z===0?8:6;
  const material=(x,z)=>x<=15?272:x===16?276:279;
  const ground=(x,y,z)=>y===top(x,z)?material(x,z):
    y>=5&&y<top(x,z)?278:0;
  const world={seed:179,generationProfile:{generator:M7},edits,
    _columnPlan:(x,z)=>new Map([[5,278],[top(x,z),material(x,z)]]),
    environmentCaves:{get:(...p)=>caves.get(key(...p))},
    get:(...p)=>edits.get(key(...p))??soil.get(key(...p))??ground(...p),
    save:()=>({schema:1,seed:179,edits:[...edits]})};
  const deps={biomeAt:()=>({name:'snow',weight:1}),terrainHeight:()=>5};
  return {world,edits,caves,soil,deps};
}

test('S4 read-only source exposes snow→ice/rime material transitions across 16x16 chunk seam',()=>{
  const {world,deps}=make(),before=JSON.stringify(world.save());
  const a=surveySnowS4ChunkSeams(world,{x:13,z:0,width:6,height:2},deps);
  assert.deepEqual(surveySnowS4ChunkSeams(world,{x:13,z:0,width:6,height:2},deps),a);
  assert.equal(a.sampled,12);
  assert.equal(a.counts.adjacencies,16);
  assert.equal(a.counts.originalChunkBoundaries,2);
  assert.ok(a.counts.materialChanges>=4);
  assert.ok(a.counts.chunkBoundaryHeightChanges>=1);
  assert.ok(a.evidence.some(r=>r.originalChunkBoundary&&r.notableHeightChange&&r.materialChange));
  assert.equal(a.state,'read-only-no-generator-activation');
  assert.equal(JSON.stringify(world.save()),before);
  assert.ok(Object.isFrozen(a.evidence));
});

test('S4 preserves cave, edited and protected original neighbors as incomparable evidence',()=>{
  const {world,deps,caves,edits}=make();
  caves.set(key(17,6,0),0);
  edits.set(key(16,6,1),0);
  const r=surveySnowS4ChunkSeams(world,{x:13,z:0,width:6,height:2},deps);
  assert.ok(r.counts.protectedOrUnchangedBoundaries>0);
  assert.ok(r.counts.caveOrEditedBoundaries>0);
  assert.ok(r.evidence.some(p=>p.protectedUnchanged&&p.sourceStatuses.includes('protected-cave')));
  assert.ok(r.evidence.some(p=>p.sourceStatuses.includes('edited-surface')));
  assert.equal(world.edits.get(key(16,6,1)),0);
});

test('S4 bounds prevent giant scans, invalid world and coordinate overflow',()=>{
  const {world,deps}=make();
  for(const rect of [
    {x:0,z:0,width:17,height:3},
    {x:0,z:0,width:16,height:9},
    {x:0,z:0,width:1,height:2},
    {x:1.5,z:0,width:4,height:4}
  ])assert.throws(()=>surveySnowS4ChunkSeams(world,rect,deps),/bounded/);
  assert.throws(()=>surveySnowS4ChunkSeams({...world,generationProfile:{generator:'legacy'}},
    {x:0,z:0,width:4,height:4},deps),/Original M7/);
});
