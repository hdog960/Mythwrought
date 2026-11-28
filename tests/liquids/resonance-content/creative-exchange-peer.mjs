import test from 'node:test';
import assert from 'node:assert/strict';
import {createResonanceCreativeAdapter} from '../../../src/liquids/liquid-resonance/content/creative-exchange.mjs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const load=p=>import(pathToFileURL(resolve(p)).href);
const physics=await load(process.env.RESONANCE_PHYSICS_MODULE);
const exchange=await load(process.env.RESONANCE_EXCHANGE_MODULE);
const point=[0,256,0];
function fixture(over={}){
  const state={allowed:true,reads:0,slot:{actor:'builder',slot:'selected',anchor:'slot-anchor',revision:'s0',loaded:true,permitted:true,
    store:{version:1,id:physics.RESONANCE_ID,storeId:'vessel',anchor:'slot-anchor',capacity:8,units:0,energy:0,revision:0}},
    target:{point,ownerKey:'upper-owner',cellRevision:'c0',loaded:true,open:true,contained:true,permitted:true,
      cell:{x:0,y:256,z:0,id:physics.RESONANCE_ID,units:7,quantities:physics.resonanceQuantities(7,3333)}}};
  const adapter=createResonanceCreativeAdapter({physics,exchange,authorize:()=>state.allowed,
    readSlot:()=>{state.reads++;return state.slot;},readTarget:()=>{state.reads++;return state.target;},...over});
  const request={direction:'collect',actor:'builder',slot:'selected',point,requested:2};
  function accept(candidate){const p=adapter.revalidate(candidate);if(!p)return false;
    // Fixture-only atomic state replacement, not a production host executor.
    const n=state.slot.store.revision+1;state.slot={...state.slot,revision:'s'+n,store:p.transfer.nextStore};
    state.target={...state.target,cellRevision:'c'+n,cell:p.transfer.nextCell};return true;}
  return {state,adapter,request,accept};
}
test('collection is pure, bounded and round trips conserve finite volume and energy',()=>{
  const {state,adapter,request,accept}=fixture();const before=JSON.stringify([state.slot,state.target]);
  const p=adapter.plan(request);assert.equal(JSON.stringify([state.slot,state.target]),before);
  assert.equal(p.transfer.units,2);assert.deepEqual(p.changed,[point]);assert.ok(Object.isFrozen(p.request.point));
  assert.equal(accept(p),true);assert.equal(accept(p),false);
  const q=adapter.plan({...request,direction:'inject'});assert.equal(accept(q),true);
  assert.equal(state.slot.store.units,0);assert.equal(state.slot.store.energy,0);
  assert.equal(state.target.cell.units,7);assert.equal(state.target.cell.quantities[physics.ENERGY_KEY],3333);
});
test('no creative permission means no inventory or world reads',()=>{
  const {state,adapter,request}=fixture();state.allowed=false;assert.equal(adapter.plan(request),null);assert.equal(state.reads,0);
});
test('partial is opt-in and action budgets are explicit',()=>{
  const {adapter,request}=fixture();assert.equal(adapter.plan({...request,requested:8}),null);
  assert.equal(adapter.plan({...request,requested:8,allowPartial:true}).transfer.units,2);
});
test('foreign, unloaded, obstructed or uncontained cells are rejected',()=>{
  for(const patch of [{loaded:false},{open:false},{contained:false},{permitted:false},{point:[1,256,0]},
    {cell:{id:'water'}},{cell:undefined},{ownerKey:''},{cellRevision:''}]){
    const {state,adapter,request}=fixture();Object.assign(state.target,patch);assert.equal(adapter.plan(request),null);}
});
test('slot identity, anchor, permission and finite state are enforced',()=>{
  for(const patch of [{actor:'other'},{slot:'other'},{anchor:'other'},{revision:''},{loaded:false},{permitted:false},
    {store:{id:'water'}},{store:{id:physics.RESONANCE_ID}}]){
    const {state,adapter,request}=fixture();Object.assign(state.slot,patch);assert.equal(adapter.plan(request),null);}
});
test('stale owner, cell, slot and permission invalidate exact candidate',()=>{
  for(const change of [s=>s.target.ownerKey='other',s=>s.target.cellRevision='new',s=>s.slot.revision='new',s=>s.allowed=false,
    s=>s.slot.store={...s.slot.store,revision:1},s=>s.target.cell={...s.target.cell,units:6}]){
    const {state,adapter,request}=fixture();const p=adapter.plan(request);change(state);assert.equal(adapter.revalidate(p),null);}
});
test('tampered proposal and invalid physical coordinates are refused',()=>{
  const {adapter,request}=fixture();const p=adapter.plan(request);
  assert.equal(adapter.revalidate({...p,changed:[[2,256,0]]}),null);
  assert.equal(adapter.revalidate({...p,transfer:{...p.transfer,energy:999}}),null);
  for(const q of [[0,257,0],[0,-211,0],[0,0.5,0],[Infinity,0,0]])assert.equal(adapter.plan({...request,point:q}),null);
});
test('empty store cannot inject free material; zero energy remains resonance',()=>{
  const {state,adapter,request,accept}=fixture();assert.equal(adapter.plan({...request,direction:'inject'}),null);
  state.target.cell={...state.target.cell,quantities:{}};assert.ok(accept(adapter.plan(request)));
  assert.equal(state.slot.store.id,physics.RESONANCE_ID);assert.equal(state.slot.store.energy,0);
  assert.ok(accept(adapter.plan({...request,direction:'inject'})));assert.equal(state.target.cell.id,physics.RESONANCE_ID);
});
