import assert from 'node:assert/strict';
import test from 'node:test';
import {surveySnowS4LegacyGrassIslands}
  from '../src/manual-biomes/snowy-s4-legacy-grass-islands.mjs';
const M7='mythwrought-five-surface-regions-v7';
const key=(x,y,z)=>x+','+y+','+z;
function fixture(grass=new Set(['15,2','16,2','15,3','16,3'])){
  const edits=new Map(),caves=new Map(),height=6;
  const plan=(x,z)=>grass.has(x+','+z)?new Map():new Map([[5,278],[6,272]]);
  const get=(x,y,z)=>edits.get(key(x,y,z))??caves.get(key(x,y,z))??
    (y===6?(grass.has(x+','+z)?1:272):y===5?278:y<5?3:0);
  const world={seed:179,generationProfile:{generator:M7},edits,
    environmentCaves:{get:(...p)=>caves.get(key(...p))},
    _columnPlan:plan,get,save:()=>({schema:1,seed:179,edits:[...edits]})};
  return {world,edits,caves,deps:{biomeAt:()=>({name:'snow',weight:1}),
    terrainHeight:()=>height}};
}
const rect={x:13,z:0,width:6,height:6};

test('original grass island measured, not painted; detects x=15/16 chunk seam',()=>{
  const {world,deps}=fixture(),before=JSON.stringify(world.save());
  const a=surveySnowS4LegacyGrassIslands(world,rect,deps);
  assert.equal(a.sampled,36);
  assert.equal(a.greenCells,4);
  assert.equal(a.components.length,1);
  const c=a.components[0];
  assert.deepEqual(c.bounds,[15,2,16,3]);
  assert.equal(c.cellCount,4);
  assert.equal(c.fillRatio,1);
  assert.equal(c.snowContactEdges,8);
  assert.equal(c.closedWithinSample,true);
  assert.equal(c.crossesOriginalChunkBoundary,true);
  assert.equal(a.crossChunkComponents,1);
  assert.equal(a.closedComponents,1);
  assert.equal(a.unknownExteriorEdges,0);
  assert.equal(c.disposition,'retain-original-until-proven-safe');
  assert.deepEqual(surveySnowS4LegacyGrassIslands(world,rect,deps),a);
  assert.equal(JSON.stringify(world.save()),before);
  assert.equal(world.get(15,6,2),1);
});

test('clipped green island stays open; no false claim of entire size',()=>{
  const grass=new Set(['13,2','13,3','14,3']);
  const {world,deps}=fixture(grass);
  const a=surveySnowS4LegacyGrassIslands(world,rect,deps);
  assert.equal(a.greenCells,3);
  assert.equal(a.components[0].fillRatio,.75);
  assert.equal(a.components[0].closedWithinSample,false);
  assert.ok(a.components[0].unknownExteriorEdges>=2);
  assert.equal(a.closedComponents,0);
});

test('original AIR cave and player edits veto grass provenance without removing',()=>{
  const {world,deps,edits,caves}=fixture();
  caves.set(key(15,6,2),0);
  edits.set(key(16,6,3),0);
  const a=surveySnowS4LegacyGrassIslands(world,rect,deps);
  assert.equal(a.greenCells,2);
  assert.equal(a.components.length,2);
  assert.ok(a.protectedNeighborEdges>=2);
  assert.equal(caves.get(key(15,6,2)),0);
  assert.equal(edits.get(key(16,6,3)),0);
});

test('disjoint components across negative coordinates are deterministic',()=>{
  const grass=new Set(['-17,2','-16,2','-13,4']);
  const {world,deps}=fixture(grass);
  const a=surveySnowS4LegacyGrassIslands(world,{x:-19,z:0,width:8,height:6},deps);
  assert.deepEqual(a.components.map(c=>c.cellCount),[2,1]);
  assert.equal(a.components[0].crossesOriginalChunkBoundary,true);
  assert.equal(a.components[1].closedWithinSample,true);
  assert.ok(Object.isFrozen(a.components[0].cells[0]));
});

test('source witness catches cave mutation outside schema-1 save',()=>{
  const {world,deps,caves}=fixture();
  let mutate=true;
  const injected={...deps,biomeAt:()=>{
    if(mutate){caves.set(key(18,8,4),0);mutate=false;}
    return {name:'snow',weight:1};
  }};
  assert.throws(()=>surveySnowS4LegacyGrassIslands(world,rect,injected),
    /cave, column or save source changed/);
});

test('rejects non-M7 sources, unbounded rectangles, missing read contract',()=>{
  const {world,deps}=fixture();
  for(const bad of [{...rect,width:17},{...rect,height:17},
    {...rect,width:1},{...rect,x:NaN},{...rect,z:100001}])
    assert.throws(()=>surveySnowS4LegacyGrassIslands(world,bad,deps),/2–128/);
  assert.throws(()=>surveySnowS4LegacyGrassIslands({...world,
    generationProfile:{generator:'legacy'}},rect,deps),/Original M7/);
  assert.throws(()=>surveySnowS4LegacyGrassIslands({...world,save:null},rect,deps),
    /schema-1/);
});
