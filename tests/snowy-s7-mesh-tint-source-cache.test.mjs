import test from 'node:test';
import assert from 'node:assert/strict';
import {createSnowS7MeshTintReview as review}
  from '../src/manual-biomes/snowy-s7-mesh-tint-source-cache.mjs';
import {previewSnowS6WinterTone as reference}
  from '../src/manual-biomes/snowy-s6-winter-tone-proposal.mjs';
const M7='mythwrought-five-surface-regions-v7';
const k=(x,y,z)=>x+','+y+','+z;
function fixture(seed=179){
 const edits=new Map(),cave=new Map(),blocks=new Map(),plans=new Map();
 let biomeCount=0,planCount=0;
 const world={seed,generationProfile:{generator:M7},edits,
  environmentCaves:{get:(...a)=>cave.get(k(...a))},
  _columnPlan(x,z){planCount++;return plans.get(x+','+z)??new Map([[5,278],[6,272]])},
  get(x,y,z){return edits.get(k(x,y,z))??blocks.get(k(x,y,z))??
    (y===6?272:y===5?278:y<=4?3:0)},
  save(){return {schema:1,seed,edits:[...edits]}},
 };
 const deps={biomeAt(x,z,s){biomeCount++;return {name:'snow',weight:.94}}};
 return {world,deps,edits,cave,blocks,plans,biomeCount:()=>biomeCount,
  planCount:()=>planCount};
}
test('one column, 200 requests, ONE original climate and ONE S6 color computation',()=>{
 const v=fixture(),t=review(v.world,0,0,v.deps);
 const before=JSON.stringify(v.world.save());
 const original=reference(179,0,0,272,.94).proposedLinearRgb;
 for(let i=0;i<200;i++)assert.deepEqual(t.colorFor(0,6,0,272),original);
 assert.equal(t.stats().requests,200);
 assert.equal(t.stats().misses,1);
 assert.equal(t.stats().climateReads,1);
 assert.equal(t.stats().cachedColumns,1);
 assert.equal(t.stats().approved,1);
 assert.equal(v.biomeCount(),1);
 assert.equal(t.writerEnabled,undefined);
 assert.equal(t.noSaveWrites,true);
 assert.equal(JSON.stringify(v.world.save()),before);
});
test('all three original snow caps keep source IDs and exact S6 reference tint',()=>{
 for(const id of [272,276,279]){
  const v=fixture();
  v.plans.set('0,0',new Map([[5,278],[6,id]]));
  v.blocks.set(k(0,6,0),id);
  const t=review(v.world,0,0,v.deps);
  assert.deepEqual(t.colorFor(0,6,0,id),
    reference(179,0,0,id,.94).proposedLinearRgb);
  assert.equal(t.colorFor(0,6,0,1),undefined);
  assert.equal(t.colorFor(0,5,0,id),undefined);
  assert.equal(v.biomeCount(),1);
 }
});
test('source cap veto stops grass, stone, original wood and leaves BEFORE climate',()=>{
 for(const cap of [1,3,4,7,401,405]){
  const v=fixture();
  v.plans.set('0,0',new Map([[5,278],[6,cap]]));
  v.blocks.set(k(0,6,0),cap);
  const t=review(v.world,0,0,v.deps);
  assert.equal(t.colorFor(0,6,0,272),undefined);
  assert.equal(t.stats().climateReads,0);
  assert.equal(t.stats().protected,1);
 }
});
test('real source support, cave AIR and saved edits each veto before color',()=>{
 for(const mode of ['caveTop','caveBelow','airSupport','editTop','editBelow',
   'overhead','mismatchedTop']){
  const v=fixture();
  if(mode==='caveTop')v.cave.set(k(0,6,0),0);
  if(mode==='caveBelow')v.cave.set(k(0,5,0),0);
  if(mode==='airSupport')v.blocks.set(k(0,5,0),0);
  if(mode==='editTop')v.edits.set(k(0,6,0),272);
  if(mode==='editBelow')v.edits.set(k(0,5,0),278);
  if(mode==='overhead')v.blocks.set(k(0,7,0),7);
  if(mode==='mismatchedTop')v.blocks.set(k(0,6,0),7);
  const t=review(v.world,0,0,v.deps);
  assert.equal(t.colorFor(0,6,0,272),undefined,mode);
  assert.equal(t.stats().climateReads,0,mode);
 }
});
test('late edit, cave, added overhead or changed top invalidates cached shade',()=>{
 for(const mode of ['edit','cave','overhead','material']){
  const v=fixture(),t=review(v.world,0,0,v.deps);
  assert.ok(t.colorFor(0,6,0,272));
  if(mode==='edit')v.edits.set(k(0,6,0),272);
  if(mode==='cave')v.cave.set(k(0,5,0),0);
  if(mode==='overhead')v.blocks.set(k(0,7,0),7);
  if(mode==='material')v.blocks.set(k(0,6,0),3);
  assert.equal(t.colorFor(0,6,0,272),undefined,mode);
  assert.equal(t.stats().climateReads,1);
 }
});
test('missing snow climate and low/nonfinite weight cannot tint original terrain',()=>{
 for(const region of [null,{name:'plains',weight:1},{name:'desert',weight:.92},
   {name:'mountain',weight:.92},{name:'snow',weight:NaN},
   {name:'snow',weight:-1},{name:'snow',weight:1.1}]){
  const v=fixture();v.deps.biomeAt=()=>region;
  const t=review(v.world,0,0,v.deps);
  assert.equal(t.colorFor(0,6,0,272),undefined);
  assert.equal(t.stats().climateReads,1);
 }
});
test('negative owner border and one-cell halo provide equal shared absolute tint',()=>{
 const v=fixture();
 const a=review(v.world,-1,32,v.deps,{halo:1});
 const b=review(v.world,0,32,v.deps,{halo:1});
 const left=a.colorFor(0,6,512,272),right=b.colorFor(0,6,512,272);
 assert.deepEqual(left,right);
 assert.deepEqual(left,reference(179,0,512,272,.94).proposedLinearRgb);
 assert.equal(a.colorFor(1,6,512,272),undefined);
 assert.equal(b.colorFor(-2,6,512,272),undefined);
 assert.equal(a.colorFor(-1,6,512,272)!==undefined,true);
 assert.equal(b.colorFor(-1,6,512,272)!==undefined,true);
});
test('whole 18x18 halo remains strictly bounded to 324 original columns',()=>{
 const v=fixture(),t=review(v.world,0,0,v.deps,{halo:1});
 for(let z=-1;z<=16;z++)for(let x=-1;x<=16;x++)assert.ok(t.colorFor(x,6,z,272));
 assert.equal(t.stats().cachedColumns,324);
 assert.equal(t.stats().climateReads,324);
 assert.equal(t.cacheBound,324);
 assert.equal(t.colorFor(17,6,0,272),undefined);
 assert.equal(t.stats().cachedColumns,324);
});
test('each separate mesh rebuild owns a new cache and observes changed climate',()=>{
 const v=fixture();
 const a=review(v.world,0,0,v.deps);
 const first=a.colorFor(0,6,0,272);
 v.deps.biomeAt=()=>({name:'snow',weight:.51});
 const b=review(v.world,0,0,v.deps);
 const second=b.colorFor(0,6,0,272);
 assert.notDeepEqual(first,second);
 assert.equal(a.stats().cachedColumns,1);
 assert.equal(b.stats().cachedColumns,1);
});
test('wrong M7 profile, bad reader, out-of-range chunk and malformed halo deny all',()=>{
 const v=fixture();
 for(const args of [
  [{...v.world,generationProfile:{generator:'mythwrought-five-surface-regions-v8-snow-optin-research'}},0,0,v.deps],
  [v.world,100001,0,v.deps],[v.world,-1.5,32,v.deps],
  [v.world,0,0,{biomeAt:null}],[v.world,0,0,v.deps,{halo:2}],
  [{...v.world,edits:[]},0,0,v.deps]
 ])assert.throws(()=>review(...args),/(exact untouched|coordinate limit)/);
});
test('callback mutating original world during source review cannot yield color',()=>{
 const v=fixture();
 v.deps.biomeAt=()=>{v.edits.set(k(0,6,0),272);
  return {name:'snow',weight:.9}};
 const t=review(v.world,0,0,v.deps);
 assert.equal(t.colorFor(0,6,0,272),undefined);
 assert.equal(v.edits.size,1);
});
