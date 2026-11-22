import test from 'node:test';
import assert from 'node:assert/strict';
import {planMountainV8PlantCells as plant,MOUNTAIN_V8_PLANT_CELL_LIMIT as MAX}
  from '../src/manual-biomes/mountain-v8-vegetation-cells.mjs';
import {surveyMountainV8Column as survey}
  from '../src/manual-biomes/mountain-v8-source-adapter.mjs';
const ids={AIR:0,GRASS:1,DIRT:2,STONE:3};
const options={worldMaxY:19,airId:0,readOriginalBlock:()=>0,
  protectedAt:()=>false,mountainAt:()=>true,
  proposedSurfaceAt:()=>10};
const proposal=(kind='dwarf-conifer')=>({x:7,z:7,top:10,cap:'alpine-grass',
  snowy:false,cliff:false,slope:.1,vegetation:kind,
  vegetationSite:{chosen:true},safeToIntegrate:false,
  generatorIdentityRequired:'v8-new-opt-in'});
test('physical proposals never exceed budget or emit duplicate cells',()=>{
  assert.equal(MAX,18);
  for(const kind of ['dwarf-conifer','alpine-flower','low-heather']){
    const p=plant(proposal(kind),options);assert.ok(p);
    assert.ok(p.cells.length<=MAX);
    assert.equal(p.cells.length,p.estimatedCells);
    assert.equal(new Set(p.cells.map(c=>c.x+','+c.y+','+c.z)).size,p.cells.length);
    assert.ok(p.cells.every(c=>c.y>10&&c.y<=19));
    assert.equal(p.safeToIntegrate,false);
  }
});
test('original-world protections, biome edges and sky ceiling reject atomically',()=>{
  for(const patch of [
    {protectedAt:(x,y,z)=>y===12&&x===7},
    {readOriginalBlock:(x,y,z)=>y===13?4:0},
    {mountainAt:(x,z)=>x!==8},
    {worldMaxY:13}
  ])assert.equal(plant(proposal(),{...options,...patch}),null);
});
test('only one owner location per eight-by-eight tile may plan vegetation',()=>{
  let owners=0,plants=0;
  for(let z=0;z<8;z++)for(let x=0;x<8;x++){
    const source=survey({x,z,seed:179,worldMaxY:30,ids,
      biomeAt:()=>({name:'mountain',weight:1}),
      heightAt:()=>5,readBlock:(a,y,b)=>y>5?0:y===5?1:2});
    assert.ok(source);
    if(source.vegetationSite.chosen)owners++;
    if(source.vegetation)plants++;
  }
  assert.equal(owners,1);
  assert.ok(plants<=1);
});
test('never consume mutable source edits or register an unapproved material',()=>{
  const a=proposal('alpine-flower');
  const before=structuredClone(a);
  const cells=plant(a,options);assert.deepEqual(a,before);
  assert.equal(cells.needsApprovedV8MaterialRegistry,true);
  assert.equal(plant({...a,vegetation:'unknown'},options),null);
  assert.equal(plant({...a,cap:'slate'},options),null);
  assert.equal(plant({...a,vegetationSite:{chosen:false}},options),null);
  assert.equal(plant({...a,safeToIntegrate:true},options),null);
});

test('plant never embeds any cell in neighboring proposed V8 raised slopes',()=>{
  const p=proposal();
  assert.ok(plant(p,options));
  assert.equal(plant(p,{...options,proposedSurfaceAt:(x,z)=>x===8?12:10}),null);
  assert.equal(plant(p,{...options,proposedSurfaceAt:()=>null}),null);
  assert.equal(plant(p,{...options,proposedSurfaceAt:undefined}),null);
});
