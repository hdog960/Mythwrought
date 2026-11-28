import test from 'node:test';
import assert from 'node:assert/strict';
import {planWaterFeature,describeWaterSurface} from '../../../src/liquids/water/content/features.mjs';
import {WATER_MATERIAL} from '../../../src/liquids/water/content/material.mjs';
const k=(...p)=>p.join(',');
function surface(cells,{closed=[],unloaded=[],unknown=[],foamStrength}={}){
  const records=new Map(cells.map(([x,y,z,id='water',units=8])=>[k(x,y,z),{x,y,z,id,units}]));
  return describeWaterSurface({engine:{getCell:(...p)=>{
    assert.ok(!unloaded.includes(k(...p))&&!closed.includes(k(...p)));
    return records.get(k(...p))??null;
  }},isLoaded:(...p)=>!unloaded.includes(k(...p)),isOpen:(...p)=>unknown.includes(k(...p))?undefined:!closed.includes(k(...p)),x:0,y:0,z:0,foamStrength});
}
test('pool layout is deterministic, finite, fractional and immutable',()=>{
  const p=planWaterFeature({kind:'pool',origin:[-2,256,-3],width:2,length:2,units:5});
  assert.equal(p.requiredUnits,20);
  assert.deepEqual(p.cells.map(c=>[c.x,c.y,c.z,c.units]),[[-2,256,-3,5],[-1,256,-3,5],[-2,256,-2,5],[-1,256,-2,5]]);
  assert.ok(Object.isFrozen(p)&&Object.isFrozen(p.cells)&&p.cells.every(Object.isFrozen));
});
test('river and waterfall paths have distinct physical topology',()=>{
  const path=[[15,19,0],[16,19,0],[16,19,1]];
  const river=planWaterFeature({kind:'river',path});assert.equal(river.requiredUnits,24);
  const p=planWaterFeature({kind:'waterfall',path:[[16,20,1],[16,19,1],[16,18,1]],units:3});
  assert.equal(p.requiredUnits,9);assert.deepEqual(p.cells.map(c=>c.y),[20,19,18]);
  path[0][0]=99;assert.equal(river.cells[0].x,15);
});
test('invalid paths, bounds, duplicates and budgets fail closed',()=>{
  for(const o of [{kind:'river',path:[[0,0,0],[1,-1,0]]},{kind:'river',path:[[0,0,0],[1,0,0],[0,0,0]]},
    {kind:'waterfall',path:[[0,0,0],[0,1,0]]},{kind:'waterfall',path:[[0,-210,0],[0,-211,0]]},
    {kind:'pool',origin:[Number.MAX_SAFE_INTEGER,0,0],width:2},{kind:'pool',origin:[0,0,0],width:17,length:16},
    {kind:'pool',origin:[0,0,0],units:0},{kind:'river',path:[[0,0,0],[2,0,0]]}])assert.throws(()=>planWaterFeature(o));
});
test('flat water surface uses provisional material and only actual solid shore',()=>{
  const r=surface([[0,0,0,'water',3]],{closed:['1,0,0'],unloaded:['0,0,1']});
  assert.equal(r.fill,3/8);assert.equal(r.material,WATER_MATERIAL);assert.equal(r.exposedTop,true);
  assert.deepEqual([r.shoreMask,r.fallMask,r.foamMask,r.foamStrength],[1,0,1,0.45]);
});
test('vertical stack and open drop produce directional falling-edge hints',()=>{
  const r=surface([[0,0,0],[0,-1,0],[0,0,1,'lava']],{closed:['-1,0,0','0,-1,-1'],foamStrength:0.2});
  assert.deepEqual([r.shoreMask,r.fallMask,r.foamMask,r.foamStrength],[4,1,5,0.2]);
});
test('covered and unloaded tops suppress foam; unknown edges never imply falls',()=>{
  const r=surface([[0,0,0],[0,1,0]],{unloaded:['1,-1,0','0,0,1'],closed:['-1,0,0']});
  assert.deepEqual([r.exposedTop,r.fallMask,r.foamMask,r.foamStrength],[false,8,0,0]);
  assert.equal(surface([[0,0,0]],{unloaded:['0,1,0']}).exposedTop,false);
  assert.equal(surface([[0,0,0]],{unknown:['1,0,0']}).shoreMask,0);
});
test('other liquid identities are not water; no read of unloaded origin',()=>{
  for(const id of ['lava','acid','amber-sap','liquid-resonance'])assert.equal(surface([[0,0,0,id]]),null);
  assert.equal(surface([[0,0,0]],{unloaded:['0,0,0']}),null);
  assert.equal(surface([[0,0,0]],{closed:['0,0,0']}),null);
});
test('malformed samples and invalid style policy reject',()=>{
  assert.throws(()=>surface([[0,0,0,'water',9]]));assert.throws(()=>surface([[0,0,0]],{foamStrength:2}));
});
