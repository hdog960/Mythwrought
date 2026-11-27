import test from 'node:test';
import assert from 'node:assert/strict';
import {ACID_MATERIAL,describeAcidSurface,sampleAcidEffects} from '../../../src/liquids/acid/content/material.mjs';
const cell=(x=0,units=8,y=0,id='acid')=>Object.freeze({x,y,z:0,id,units,quantities:Object.freeze({})});
const opts={isExposed:()=>true};
const cells=Array.from({length:128},(_,i)=>cell(i));
test('distinct acid palette and physical fractional surface',()=>{
  const c=cell(0,3,-210),s=describeAcidSurface(c,{exposed:true});
  assert.equal(s.material,ACID_MATERIAL);assert.equal(s.fill,3/8);assert.equal(s.surfaceY,-210+3/8);
  assert.equal(s.hazardCue,'acid');assert.equal(s.surfaceEffects,true);assert.ok(Object.isFrozen(s));
});
test('reject foreign liquids and malformed physical records',()=>{
  for(const c of [null,cell(0,8,0,'water'),cell(0,9),cell(0,0),cell(0,8,257),cell(0,8,-211),cell(0.5)])assert.equal(describeAcidSurface(c),null);
  assert.equal(describeAcidSurface(cell(0,8,256)).surfaceEffects,false);
});
test('deterministic bounded particles stay on visible physical surfaces',()=>{
  const a=sampleAcidEffects(cells,{...opts,step:11,maxParticles:5});
  assert.deepEqual(a,sampleAcidEffects(cells,{...opts,step:11,maxParticles:5}));assert.equal(a.effects.length,5);
  for(const p of a.effects){assert.equal(p.y,1);assert.ok(p.x%1>=0.19&&p.x%1<=0.81);assert.ok(p.opacity<=0.48);assert.ok(Object.isFrozen(p));}
});
test('occluded and foreign cells produce no effects; strict boolean eligibility',()=>{
  assert.equal(sampleAcidEffects(cells,{isExposed:()=>false}).effects.length,0);
  assert.equal(sampleAcidEffects(cells,{isExposed:()=>1}).effects.length,0);
  assert.equal(sampleAcidEffects([cell(0,8,0,'lava')],opts).effects.length,0);
});
test('visit cap, zero budget and duplicate suppression',()=>{
  assert.equal(sampleAcidEffects(cells,{...opts,maxVisits:3}).visited,3);
  assert.deepEqual(sampleAcidEffects(cells,{...opts,maxParticles:0}),{visited:0,effects:[]});
  let checks=0;sampleAcidEffects(Array(20).fill(cell()),{isExposed:()=>{checks++;return true;}});assert.equal(checks,1);
});
test('invalid budgets fail closed and source cells remain unchanged',()=>{
  for(const o of [{maxVisits:1025},{maxParticles:65},{step:-1},{isExposed:null}])assert.throws(()=>sampleAcidEffects(cells,{...opts,...o}),TypeError);
  const before=JSON.stringify(cells);sampleAcidEffects(cells,opts);assert.equal(JSON.stringify(cells),before);
});
