import test from 'node:test';
import assert from 'node:assert/strict';
import {ACID_MATERIAL} from '../../../src/liquids/acid/content/material.mjs';
import {ACID_PRESENTATION_MATERIAL as material,sampleVisibleAcidEffects as sample} from '../../../src/liquids/acid/content/presentation.mjs';
const acid=(x,y=0,z=0,units=8)=>Object.freeze({id:'acid',x,y,z,units,quantities:Object.freeze({solute:8})});
const host=(records,opts={})=>{const map=new Map(records.map(c=>[[c.x,c.y,c.z].join(','),c]));return {engine:{getCell:(...p)=>map.get(p.join(','))??null},isLoaded:()=>true,isOpen:()=>true,cells:records.map(c=>[c.x,c.y,c.z]),...opts};};
const collect=o=>Array.from({length:64},(_,step)=>sample({...o,step}).effects).flat();
test('shared material preserves palette and transparent pass policy',()=>{
  assert.deepEqual(material.color,[146/255,200/255,62/255]);assert.equal(material.alpha,ACID_MATERIAL.opacity);
  assert.deepEqual([material.id,material.pass,material.depthTest,material.depthWrite,material.cull,material.blend,material.emissive],['acid','transparent',true,false,false,'straight-alpha',0]);
  assert.ok(Object.isFrozen(material)&&Object.isFrozen(material.color));
});
test('full surface effects require known air; partial surface remains physical',()=>{
  const lower=acid(0),upper=acid(0,1),partial=acid(2,0,0,3);
  const o=host([lower,upper,partial],{cells:[[0,0,0],[2,0,0]]});
  const effects=collect(o);assert.ok(effects.length>0);assert.ok(effects.every(e=>e.x>2&&e.y===3/8));
  assert.ok(collect(host([lower])).length>0);
  assert.equal(collect(host([lower],{isOpen:(x,y)=>y===0})).length,0);
  assert.equal(collect(host([lower],{isLoaded:(x,y)=>y===0})).length,0);
  assert.equal(collect(host([lower,{...upper,id:'lava'}],{cells:[[0,0,0]]})).length,0);
});
test('unloaded or obstructed selected cells are never read',()=>{
  const a=acid(0),b=acid(1),c=acid(2,0,0,4);let reads=0;
  const o=host([a,b,c],{isLoaded:x=>x!==0,isOpen:x=>x!==1,engine:{getCell(x){reads++;assert.equal(x,2);return c;}}});
  const r=sample(o);assert.equal(r.visited,3);assert.equal(reads,1);
});
test('bounded visits, deduplication and stable effects',()=>{
  const records=Array.from({length:40},(_,x)=>acid(x,0,0,4));const o=host(records,{cells:[[0,0,0],[0,0,0],...records.slice(1).map(c=>[c.x,c.y,c.z])],maxVisits:10,maxParticles:2});
  for(let step=0;step<64;step++){const r=sample({...o,step});assert.equal(r.visited,10);assert.ok(r.effects.length<=2);assert.deepEqual(r,sample({...o,step}));assert.equal(new Set(r.effects.map(e=>Math.floor(e.x))).size,r.effects.length);assert.ok(r.effects.every(e=>e.x<9));}
  assert.deepEqual(sample({...o,maxParticles:0}),{visited:0,effects:[]});
});
test('physical top and bottom stay within envelope',()=>{
  const upper=acid(0,256),lower=acid(1,-210,0,2);const o=host([upper,lower],{isLoaded:(x,y)=>{assert.ok(y>=-210&&y<=256);return true;}});
  const e=collect(o);assert.ok(e.length>0);assert.ok(e.every(p=>p.y===-209.75));
});
test('malformed records and coordinates fail closed without mutation',()=>{
  const c=acid(0),o=host([c]);const before=JSON.stringify(c);
  assert.throws(()=>sample({...o,cells:[[0,257,0]]}),RangeError);
  assert.throws(()=>sample({...o,engine:{getCell:()=>({...c,x:1})}}),TypeError);
  assert.throws(()=>sample({...o,maxVisits:1025}),TypeError);assert.throws(()=>sample({...o,step:-1}),TypeError);
  collect(o);assert.equal(JSON.stringify(c),before);
});
