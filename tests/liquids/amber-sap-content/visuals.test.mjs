import test from 'node:test';
import assert from 'node:assert/strict';
import {AMBER_SAP_MATERIAL,sampleAmberSapVisual,createAmberBasin} from '../../../src/liquids/amber-sap/content/visuals.mjs';
const host=(cells={},opts={})=>({engine:{getCell:(...p)=>cells[p.join(',')]??null},isLoaded:()=>true,isOpen:()=>true,x:0,y:0,z:0,...opts});
const sap=units=>({id:'amber-sap',units});
test('material is golden, translucent and non-emissive',()=>{
  assert.equal(AMBER_SAP_MATERIAL.shallow,'#f6c65b');assert.ok(AMBER_SAP_MATERIAL.opacity<1);assert.equal(AMBER_SAP_MATERIAL.emissive,0);
});
test('sample respects partial fill and physical surface',()=>{
  const r=sampleAmberSapVisual(host({'0,0,0':sap(3)}));assert.equal(r.fill,3/8);assert.equal(r.surfaceY,3/8);
});
test('unloaded, blocked and foreign cells never render',()=>{
  const cells={'0,0,0':sap(8)};assert.equal(sampleAmberSapVisual(host(cells,{isLoaded:()=>false})),null);
  assert.equal(sampleAmberSapVisual(host(cells,{isOpen:()=>false})),null);
  assert.equal(sampleAmberSapVisual(host({'0,0,0':{id:'water',units:8}})),null);
});
test('side cues use only eligible local neighbors',()=>{
  const r=sampleAmberSapVisual(host({'0,0,0':sap(8),'1,0,0':sap(4),'-1,0,0':{id:'acid',units:1}}, {isLoaded:(x,y,z)=>z!==1}));
  assert.deepEqual(r.sides,[0.5,0,0,1]);
});
test('drip is deterministic, bounded, periodic and not a physics update',()=>{
  const cells={'0,0,0':sap(2)},before=JSON.stringify(cells);const a=sampleAmberSapVisual(host(cells,{frame:5}));
  assert.deepEqual(a,sampleAmberSapVisual(host(cells,{frame:53})));assert.ok(a.drip.length<=a.fill);
  assert.equal(sampleAmberSapVisual(host(cells,{isOpen:(x,y)=>y!==-1})).drip,null);
  assert.equal(JSON.stringify(cells),before);
});
test('physical bottom never samples below world',()=>{
  const r=sampleAmberSapVisual(host({'0,-210,0':sap(8)},{y:-210,isLoaded:(x,y)=>{assert.ok(y>=-210);return true;}}));assert.equal(r.drip,null);
});
test('basin has full floor, four continuous walls, nine open interior cells',()=>{
  const b=createAmberBasin({x:-2,y:255,z:8});const s=new Set(b.solid.map(p=>p.join(',')));
  assert.equal(s.size,41);assert.equal(b.interior.length,9);assert.equal(b.capacityUnits,72);
  for(const [x,y,z] of b.interior){assert.ok(!s.has([x,y,z].join(',')));assert.ok(s.has([x,y-1,z].join(',')));}
  for(let i=0;i<5;i++)for(const p of [[-2+i,256,8],[-2+i,256,12],[-2,256,8+i],[2,256,8+i]])assert.ok(s.has(p.join(',')));
  assert.throws(()=>createAmberBasin({x:0,y:256,z:0}),RangeError);assert.throws(()=>createAmberBasin({x:Number.MAX_SAFE_INTEGER,y:0,z:0}),RangeError);
});
