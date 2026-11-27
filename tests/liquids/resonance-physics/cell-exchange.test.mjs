import test from 'node:test';
import assert from 'node:assert/strict';
import {RESONANCE_ID as id,ENERGY_KEY as key,resonanceQuantities} from '../../../src/liquids/liquid-resonance/physics/definition.mjs';
import {planResonanceCellExchange as plan,revalidateResonanceCellExchange as validate} from '../../../src/liquids/liquid-resonance/physics/cell-exchange.mjs';
const cell=(units,energy,extra={})=>({x:-16,y:256,z:0,id,units,quantities:resonanceQuantities(units,energy),...extra});
const store=(units=0,energy=0,extra={})=>({version:1,id,storeId:'tank',anchor:'anchor',capacity:32,units,energy,revision:0,...extra});
const input=(extra={})=>({direction:'collect',point:[-16,256,0],cell:cell(7,19),ownerKey:'owner',cellRevision:'epoch-1',store:store(),storeAnchor:'anchor',permitted:true,loaded:true,open:true,contained:true,requested:3,maxPerVisit:8,...extra});
const amount=c=>c?.units??0,energy=c=>c?.quantities[key]??0;
test('collection preserves exact residue and input state',()=>{
  const a=input(),before=JSON.stringify(a),p=plan(a);
  assert.deepEqual([p.units,p.energy,p.nextCell.units,energy(p.nextCell),p.nextStore.units,p.nextStore.energy],[3,8,4,11,3,8]);
  assert.equal(JSON.stringify(a),before);assert.equal(p.nextStore.revision,1);
  assert.ok(Object.isFrozen(p)&&Object.isFrozen(p.point)&&Object.isFrozen(p.nextCell.quantities));
});
test('injection into empty or existing cell binds destination identity',()=>{
  const a=input({direction:'inject',cell:null,store:store(7,19)}),p=plan(a);
  assert.deepEqual([p.nextCell.units,energy(p.nextCell),p.nextStore.units,p.nextStore.energy],[3,8,4,11]);
  const q=plan({...a,cell:cell(7,10)});assert.deepEqual([q.units,q.nextCell.units,energy(q.nextCell)],[1,8,12]);
  assert.equal(plan({...a,cell:cell(7,10,{x:-15})}),null);
  assert.equal(plan({...a,cell:cell(7,10,{id:'water'})}),null);
  assert.equal(plan({...a,cell:undefined}),null);
});
test('explicit host eligibility, finite capacity and revision exhaustion',()=>{
  for(const k of ['permitted','loaded','open','contained'])assert.equal(plan(input({[k]:false})),null);
  assert.equal(plan(input({storeAnchor:'other'})),null);assert.equal(plan(input({cell:null})),null);
  assert.equal(plan(input({store:store(32,0)})),null);
  assert.equal(plan(input({store:store(0,0,{revision:Number.MAX_SAFE_INTEGER})})),null);
  assert.equal(plan(input({maxPerVisit:0})),null);
  assert.equal(plan(input({store:store(31,0)})).units,1);
  assert.throws(()=>plan(input({point:[0,257,0]})));assert.throws(()=>plan(input({cellRevision:''})));
});
test('fresh validation rejects stale owner, coordinate, generation, store or policy',()=>{
  const a=input(),p=plan(a);assert.deepEqual(validate(p,a),p);
  for(const delta of [{ownerKey:'other'},{cellRevision:'epoch-2'},{point:[-15,256,0]},
    {store:store(0,0,{revision:1})},{store:store(0,0,{storeId:'other'})},{store:store(1,1)},
    {cell:cell(7,20)},{loaded:false},{contained:false},{maxPerVisit:2},{requested:1}])
    assert.equal(validate(p,{...a,...delta}),null);
  assert.equal(validate({...p,nextStore:store(3,999)},a),null);
});
test('100 round trips with monotonic host revisions cannot replay or mint energy',()=>{
  let c=cell(7,19),s=store(),rev=0;
  for(let i=0;i<100;i++)for(const direction of ['collect','inject']){
    const a=input({direction,cell:c,store:s,cellRevision:String(rev)}),p=plan(a);
    assert.ok(validate(p,a));c=p.nextCell;s=p.nextStore;rev++;
    assert.equal(validate(p,{...a,cell:c,store:s,cellRevision:String(rev)}),null);
    assert.equal(amount(c)+s.units,7);assert.equal(energy(c)+s.energy,19);
  }
  assert.equal(c.units,7);assert.equal(energy(c),19);assert.equal(s.units,0);assert.equal(s.energy,0);
});
test('full extraction returns absent cell and zero-energy material stays distinct',()=>{
  const p=plan(input({cell:cell(2,0)}));assert.equal(p.nextCell,null);assert.equal(p.nextStore.id,id);
  const q=plan(input({direction:'inject',cell:null,store:p.nextStore}));
  assert.equal(q.nextCell.id,id);assert.deepEqual(q.nextCell.quantities,{});
});
