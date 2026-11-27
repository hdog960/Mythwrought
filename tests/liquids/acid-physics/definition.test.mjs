import test from 'node:test';
import assert from 'node:assert/strict';
import {ACID_DEFINITION,ACID_SOLUTE,acidQuantities,createAcidDefinition,readAcidStrength,planAcidDilution,createAcidWaterRule,sampleAcidExposure} from '../../../src/liquids/acid/physics/definition.mjs';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
const cell=(id,x,units,quantities={})=>Object.freeze({id,x,y:0,z:0,units,quantities:Object.freeze(quantities)});
const acid=(units,strength=600)=>cell('acid',0,units,acidQuantities(units,strength));
const water=(units,q={})=>cell('water',1,units,q);
test('flow descriptor and bounded concentration input',()=>{
  assert.deepEqual(ACID_DEFINITION,{id:'acid',gravityLimit:6,lateralLimit:3});
  assert.equal(createAcidDefinition({gravityLimit:0}).gravityLimit,0);
  assert.throws(()=>createAcidDefinition({lateralLimit:9}),RangeError);
  assert.throws(()=>acidQuantities(9),RangeError);assert.throws(()=>acidQuantities(1,1001),RangeError);
  assert.equal(readAcidStrength(acid(8,1000)),1000);assert.equal(readAcidStrength(acid(1,0)),0);
  assert.equal(readAcidStrength(cell('acid',0,1,{[ACID_SOLUTE]:1001})),null);
  assert.equal(readAcidStrength(water(1)),null);
});
test('dilution increases acid volume and preserves solute and other payloads',()=>{
  const a=cell('acid',0,3,{[ACID_SOLUTE]:1800,trace:7}),w=water(4),p=planAcidDilution(a,w);
  assert.equal(p.acidAfter.units,5);assert.equal(p.waterAfter.units,2);
  assert.deepEqual(p.acidAfter.quantities,a.quantities);assert.equal(readAcidStrength(p.acidAfter),360);
  assert.equal(p.acidAfter.units+p.waterAfter.units,a.units+w.units);
  assert.equal(p.acidBefore,a);assert.equal(p.waterBefore,w);assert.equal(a.units,3);
  assert.ok(Object.isFrozen(p)&&Object.isFrozen(p.acidAfter.quantities));
});
test('full cells, foreign payloads, invalid strength and nonadjacency fail closed',()=>{
  assert.equal(planAcidDilution(acid(8),water(1)),null);
  assert.equal(planAcidDilution(acid(3),water(1,{trace:1})),null);
  assert.equal(planAcidDilution(acid(3),cell('water',2,1)),null);
  assert.equal(planAcidDilution(cell('acid',0,1,{[ACID_SOLUTE]:-1}),water(1)),null);
  assert.equal(planAcidDilution(acid(7),water(1)).waterAfter,null);
  assert.throws(()=>createAcidWaterRule({maxWaterUnits:0}),RangeError);
});
test('bounded repeated dilution never loses solvent or solute',()=>{
  let a=acid(1,997),w=water(7);
  for(let i=0;i<7;i++){const p=planAcidDilution(a,w,{maxWaterUnits:1});a=p.acidAfter;w=p.waterAfter;}
  assert.equal(a.units,8);assert.equal(w,null);assert.equal(a.quantities[ACID_SOLUTE],997);
  assert.equal(readAcidStrength(a),124);
});
test('exposure samples are bounded and use peak rather than stacking damage',()=>{
  let calls=0;const e={samplePoint:x=>{calls++;return x===0?{cell:acid(3,600)}:null;}};
  assert.deepEqual(sampleAcidExposure(e,[[0,0,0],[1,0,0],[0,0,0]]),{samples:3,contacts:2,peakStrength:600});
  assert.throws(()=>sampleAcidExposure(e,[[0,0,0],[1,0,0]],{maxPoints:1}));
  assert.throws(()=>sampleAcidExposure(e,[[0,0,0],[NaN,0,0]]));assert.equal(calls,3);
});
const core=process.env.LIQUID_ENGINE_MODULE?await import(pathToFileURL(resolve(process.env.LIQUID_ENGINE_MODULE)).href):null;
const engine=(opts={})=>core.createLiquidEngine({isLoaded:()=>true,isOpen:(x,y,z)=>Math.abs(x)<=3&&y>=-2&&y<=2&&Math.abs(z)<=3,definitions:[ACID_DEFINITION,{id:'water',gravityLimit:8,lateralLimit:4}],reactionRules:[createAcidWaterRule()],...opts});
test('actual core: flow and extraction conserve extensive solute', {skip:!core},()=>{
  const e=engine({maxVisits:7});e.insert(0,2,0,'acid',8,acidQuantities(8,799));
  e.insert(1,2,0,'acid',3,acidQuantities(3,101));
  for(let i=0;i<100;i++)assert.ok(e.tick().visited<=7);
  const cells=e.save().cells;assert.equal(cells.reduce((n,c)=>n+c.units,0),11);
  assert.equal(cells.reduce((n,c)=>n+(c.quantities[ACID_SOLUTE]??0),0),6695);
  assert.ok(cells.every(c=>readAcidStrength(c)!==null));
  const c=cells[0],removed=e.extract(c.x,c.y,c.z,1);
  assert.equal(e.save().cells.reduce((n,v)=>n+(v.quantities[ACID_SOLUTE]??0),0)+(removed.quantities[ACID_SOLUTE]??0),6695);
});
test('actual core: symmetric read-only dispatch, water remains unchanged', {skip:!core},()=>{
  const e=engine();e.insert(0,0,0,'acid',3,acidQuantities(3));e.insert(1,0,0,'water',4);
  const before=e.save(),a=e.proposeReaction(0,0,0,1,0,0),b=e.proposeReaction(1,0,0,0,0,0);
  assert.deepEqual(a,b);assert.equal(a.consumeA,0);assert.equal(a.consumeB,2);assert.equal(a.product,'acid-dilution');
  assert.deepEqual(e.save(),before);
});
test('actual core: physical exposure excludes unloaded and above-fill samples', {skip:!core},()=>{
  let loaded=true;const e=engine({isLoaded:()=>loaded});e.insert(0,0,0,'acid',4,acidQuantities(4,500));
  assert.deepEqual(sampleAcidExposure(e,[[.5,.49,.5],[.5,.5,.5]]),{samples:2,contacts:1,peakStrength:500});
  loaded=false;assert.equal(sampleAcidExposure(e,[[.5,.1,.5]]).contacts,0);
});
test('actual core: sparse snapshot preserves concentration and deterministic flow', {skip:!core},()=>{
  const e=engine();e.insert(0,2,0,'acid',7,acidQuantities(7,333));e.tick(1);
  const f=engine({snapshot:JSON.parse(JSON.stringify(e.save()))});
  for(let i=0;i<20;i++){assert.deepEqual(f.tick(2),e.tick(2));assert.deepEqual(f.save(),e.save());}
  assert.equal(f.save().cells.reduce((n,c)=>n+(c.quantities[ACID_SOLUTE]??0),0),2331);
});
