import test from 'node:test';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {planResonanceContainment as plan,revalidateResonanceContainment as valid} from '../../../src/liquids/liquid-resonance/content/containment.mjs';
if(!process.env.RESONANCE_PHYSICS_MODULE)throw Error('Set RESONANCE_PHYSICS_MODULE to pinned A definition');
const physics=await import(pathToFileURL(resolve(process.env.RESONANCE_PHYSICS_MODULE)).href);
const store={version:1,id:physics.RESONANCE_ID,storeId:'fixture-stock',anchor:'fixture-anchor',capacity:200,units:100,energy:54321,revision:7};
const opts={origin:[0,0,0],fill:4,physics,store,canDraw:()=>true,inspect:()=>({loaded:true,empty:true,permitted:true,owner:'fixture',generation:'g1'})};
test('actual A proposals debit exactly 84 units and conserve all energy including rounding',()=>{
  const p=plan(opts);assert.equal(p.deposits.length,21);
  assert.equal(p.nextStore.units,16);assert.equal(p.nextStore.revision,28);
  let u=0,e=0;for(const d of p.deposits){
    const c=physics.readResonanceCell({...d.cell,...d.output});u+=c.units;e+=c.quantities[physics.ENERGY_KEY]??0;
  }
  assert.equal(u+p.nextStore.units,store.units);assert.equal(e+p.nextStore.energy,store.energy);
  assert.equal(store.units,100);assert.equal(store.revision,7);assert(valid(p,opts));
});
test('actual A refuses short stock, denied permission and revision exhaustion',()=>{
  assert.equal(plan({...opts,store:{...store,units:83,energy:40000}}),null);
  assert.equal(plan({...opts,canDraw:()=>false}),null);
  assert.equal(plan({...opts,store:{...store,revision:Number.MAX_SAFE_INTEGER-20}}),null);
});
test('wet plan replay fails after debit, source change or identity change',()=>{
  const p=plan(opts);
  assert(!valid(p,{...opts,store:p.nextStore}));
  assert(!valid(p,{...opts,store:{...store,revision:8}}));
  assert(!valid(p,{...opts,store:{...store,storeId:'different'}}));
  assert(!valid({...p,nextStore:{...p.nextStore,energy:0}},opts));
});
