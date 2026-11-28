import {test} from 'node:test';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {createResonanceMaterialAdapter as create} from '../../../src/liquids/liquid-resonance/content/material-exchange.mjs';
const physics=await import(pathToFileURL(resolve(process.env.RESONANCE_PHYSICS_MODULE)).href);
const store=(id,units,energy)=>({version:1,id:physics.RESONANCE_ID,storeId:id,anchor:id,capacity:8,units,energy,revision:0});
function fixture(opts={}){
  let reads=0,allowed=true;
  const wrap=(kind,id,point,state)=>({kind,id,point,state,anchor:id,ownerKey:'owner',revision:'g0',loaded:true,permitted:true,contained:true,open:true});
  const endpoints=new Map([
    ['a',wrap('store','a',[0,0,0],store('a',7,3333))],
    ['b',wrap('store','b',[1,0,0],store('b',0,0))],
    ['c',wrap('cell','c',[0,256,0],{id:physics.RESONANCE_ID,x:0,y:256,z:0,units:3,quantities:physics.resonanceQuantities(3,77)})],
    ['m',wrap('mineral','m',[1,256,0],{version:1,mineralId:'m',material:'fixture-mineral',capacity:50,energy:10,revision:0})]
  ]);
  const adapter=create({physics,readEndpoint:(kind,id)=>{reads++;return endpoints.get(id);},authorize:()=>allowed,enableTransfer:true,enableInfusion:true,allowedMaterials:['fixture-mineral'],...opts});
  const transfer={kind:'transfer',actor:'operator',from:'a',to:'b',requested:2};
  const infusion={kind:'infusion',actor:'operator',from:'c',to:'m'};
  return {adapter,endpoints,transfer,infusion,reads:()=>reads,deny:()=>{allowed=false;}};
}
test('both features opt in; denied requests never read endpoint state',()=>{
  const f=fixture({enableTransfer:false,enableInfusion:false});
  assert.equal(f.adapter.plan(f.transfer),null);assert.equal(f.adapter.plan(f.infusion),null);assert.equal(f.reads(),0);
  const g=fixture();g.deny();assert.equal(g.adapter.plan(g.transfer),null);assert.equal(g.reads(),0);
});
test('machine transfer conserves exact finite units and energy with residue',()=>{
  const f=fixture(),p=f.adapter.plan(f.transfer),o=p.operation;
  assert.equal(o.units,2);assert.equal(o.energy,952);assert.equal(o.nextFrom.energy+o.nextTo.energy,3333);
  assert.equal(o.nextFrom.units+o.nextTo.units,7);assert.deepEqual(p.changed,[]);assert.deepEqual(p.changedEndpoints,['a','b']);
  assert.deepEqual(f.adapter.revalidate(p),p);assert.equal(f.endpoints.get('a').state.units,7);
  f.endpoints.get('a').state=o.nextFrom;f.endpoints.get('b').state=o.nextTo;
  assert.equal(f.adapter.revalidate(p),null);
});
test('partial transfer explicit and capacity bounded',()=>{
  const f=fixture();f.endpoints.get('b').state=store('b',7,0);
  assert.equal(f.adapter.plan(f.transfer),null);
  assert.equal(f.adapter.plan({...f.transfer,allowPartial:true}).operation.units,1);
});
test('infusion conserves energy and liquid volume, caps mineral capacity',()=>{
  const f=fixture(),p=f.adapter.plan(f.infusion),o=p.operation;
  assert.equal(o.transferredEnergy,40);assert.equal(o.nextCell.units,3);assert.equal(o.nextCell.quantities[physics.ENERGY_KEY],37);
  assert.equal(o.nextMineral.energy,50);assert.equal(37+50,77+10);assert.deepEqual(p.changed,[[0,256,0]]);
  assert.deepEqual(f.adapter.revalidate(p),p);f.endpoints.get('m').state=o.nextMineral;
  assert.equal(f.adapter.revalidate(p),null);
});
test('unapproved material, zero energy and exhausted mineral refuse',()=>{
  const f=fixture({allowedMaterials:[]});assert.equal(f.adapter.plan(f.infusion),null);
  const g=fixture();g.endpoints.get('c').state.quantities={};assert.equal(g.adapter.plan(g.infusion),null);
  const h=fixture();h.endpoints.get('m').state.energy=50;assert.equal(h.adapter.plan(h.infusion),null);
});
test('reject unloaded, uncontained, unauthorized, nonadjacent and mismatched endpoints',()=>{
  for(const patch of [{loaded:false},{contained:false},{permitted:false},{point:[2,0,0]},{point:[1,257,0]},{anchor:'wrong'},{kind:'cell'},{id:'other'}]){
    const f=fixture();Object.assign(f.endpoints.get('b'),patch);assert.equal(f.adapter.plan(f.transfer),null);
  }
  const f=fixture();f.endpoints.get('c').state.y=255;assert.equal(f.adapter.plan(f.infusion),null);
});
test('stale owner, generation, location and permission invalidate proposals',()=>{
  for(const patch of [{ownerKey:'new'},{revision:'g1'},{point:[0,0,1]},{permitted:false}]){
    const f=fixture(),p=f.adapter.plan(f.transfer);Object.assign(f.endpoints.get('b'),patch);assert.equal(f.adapter.revalidate(p),null);
  }
  const f=fixture(),p=f.adapter.plan(f.transfer);f.deny();assert.equal(f.adapter.revalidate(p),null);
});
test('alias, foreign liquid, malformed state and tampered receipts refuse',()=>{
  const f=fixture(),p=f.adapter.plan(f.transfer);
  assert.equal(f.adapter.revalidate({...p,changed:[[0,0,0]]}),null);
  f.endpoints.get('b').state.storeId='a';assert.equal(f.adapter.plan(f.transfer),null);
  const g=fixture();g.endpoints.get('a').state.id='water';assert.equal(g.adapter.plan(g.transfer),null);
  const h=fixture();h.endpoints.get('m').state.energy=-1;assert.equal(h.adapter.plan(h.infusion),null);
});
