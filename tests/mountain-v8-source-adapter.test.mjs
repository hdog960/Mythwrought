import test from 'node:test';
import assert from 'node:assert/strict';
import {surveyMountainV8Column as survey} from '../src/manual-biomes/mountain-v8-source-adapter.mjs';
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
