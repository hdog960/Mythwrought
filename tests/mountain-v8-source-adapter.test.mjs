import test from 'node:test';
import assert from 'node:assert/strict';
import {surveyMountainV8Column as survey,mountainV8TileRoot as tileRoot}
 from '../src/manual-biomes/mountain-v8-source-adapter.mjs';
const ids={AIR:0,GRASS:1,DIRT:2,STONE:3};
const make=(patch={})=>({x:8,z:8,seed:179,worldMaxY:30,ids,
 biomeAt:()=>({name:'mountain',weight:1}),heightAt:()=>5,
 readBlock:(x,y,z)=>y>5?ids.AIR:y===5?ids.GRASS:ids.DIRT,
 ...patch});
test('read-only original-world source adapter is deterministic with four real neighbor heights',()=>{
 const a=make(),before=structuredClone({x:a.x,z:a.z,seed:a.seed,ids:a.ids});
 const first=survey(a);assert.ok(first);assert.deepEqual(first,survey(a));
 assert.deepEqual(first.sourceProvenance.neighborTops,[5,5,5,5]);
 assert.equal(first.safeToIntegrate,false);assert.deepEqual({x:a.x,z:a.z,seed:a.seed,ids:a.ids},before);
});
test('never bridge protected caves, structures, nonmountain seams or foreign material',()=>{
 for(const p of [
  {protectedAt:(x,y,z)=>x===12&&y===6},
  {readBlock:(x,y,z)=>y===5&&x===12?0:y>5?0:y===5?1:2},
  {readBlock:(x,y,z)=>y===8&&x===8?4:y>5?0:y===5?1:2},
  {biomeAt:(x,z)=>x===12?{name:'snow',weight:1}:{name:'mountain',weight:1}},
  {heightAt:()=>undefined}
 ])assert.equal(survey(make(p)),null);
});
test('vegetation only on gentle alpine grass and never added to rocks, snow, or cliffs',()=>{
 for(let z=-64;z<=64;z+=4)for(let x=-64;x<=64;x+=4){
  const v=survey(make({x,z}));assert.ok(v);
  assert.ok(v.estimatedExtraCells<=18);
  if(v.vegetation)assert.equal(v.cap,'alpine-grass');
  if(v.cliff||v.snowy||v.cap!=='alpine-grass')assert.equal(v.vegetation,null);
 }
});
test('honors bounded numeric input and baseline reader, no writes or generated blocks',()=>{
 let read=0;const opts=make({readBlock:(x,y,z)=>{read++;return y>5?0:y===5?1:2;}});
 const v=survey(opts);assert.ok(v);assert.ok(read>5&&read<300);
 assert.equal(survey(make({x:NaN})),null);
 assert.equal(survey(make({ids:{AIR:0,GRASS:0,DIRT:2,STONE:3}})),null);
 assert.equal(v.generatorIdentityRequired,'v8-new-opt-in');
});

test('sparse root remains inside its exact tile and refuses overflow/aliases',()=>{
 for(const tileX of [-100000,-2,-1,0,1,20000])
  for(const tileZ of [-30000,-1,0,1,28000]){
   const root=tileRoot(tileX,tileZ,179);
   assert.ok(root);
   assert.equal(Math.floor(root.rootX/8),tileX);
   assert.equal(Math.floor(root.rootZ/8),tileZ);
   assert.ok(Number.isSafeInteger(root.rootX)&&Number.isSafeInteger(root.rootZ));
  }
 assert.equal(tileRoot(Number.MAX_SAFE_INTEGER,0,179),null);
 assert.equal(tileRoot(0,Number.MIN_SAFE_INTEGER,179),null);
 assert.equal(tileRoot(Infinity,0,179),null);
});

test('all five source probes reject buried cave, foreign ore and protected underlay',()=>{
 const original=(x,y,z)=>y>5?ids.AIR:y===5?ids.GRASS:ids.DIRT;
 for(const patch of [
  {readBlock:(x,y,z)=>x===12&&y===2?ids.AIR:original(x,y,z)},
  {readBlock:(x,y,z)=>z===4&&y===3?6:original(x,y,z)},
  {readBlock:(x,y,z)=>x===8&&z===8&&y===2?4:original(x,y,z)},
  {protectedAt:(x,y,z)=>x===8&&z===12&&y===3}
 ])assert.equal(survey(make(patch)),null);
 assert.ok(survey(make()));
});

test('original-source veto diagnostics report cave, foreign substrate and biome exactly once',()=>{
 const natural=(x,y,z)=>y>5?ids.AIR:y===5?ids.GRASS:ids.DIRT;
 const probes=[
  [{readBlock:(x,y,z)=>x===12&&y===2?ids.AIR:natural(x,y,z)},'cave-air'],
  [{readBlock:(x,y,z)=>z===4&&y===3?6:natural(x,y,z)},'foreign-substrate'],
  [{biomeAt:(x,z)=>x===12?{name:'snow',weight:1}:{name:'mountain',weight:1}},'biome-boundary'],
  [{readBlock:(x,y,z)=>x===8&&y===6?4:natural(x,y,z)},'occupied-uplift'],
  [{protectedAt:(x,y,z)=>x===8&&z===12&&y===3},'protected-substrate']
 ];
 for(const [patch,reason] of probes){
  const observed=[];
  assert.equal(survey(make({...patch,onVeto:issue=>observed.push(issue)})),null);
  assert.equal(observed.length,1);
  assert.equal(observed[0].reason,reason);
  assert.ok(Number.isInteger(observed[0].x));
  assert.ok(Number.isInteger(observed[0].z));
 }
 const events=[];
 assert.ok(survey(make({onVeto:issue=>events.push(issue)})));
 assert.deepEqual(events,[]);
});
