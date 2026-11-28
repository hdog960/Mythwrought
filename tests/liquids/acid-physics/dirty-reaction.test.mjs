import test from 'node:test';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {ACID_DEFINITION,ACID_SOLUTE,acidQuantities,readAcidStrength,createAcidWaterRule} from '../../../src/liquids/acid/physics/definition.mjs';
import {createAcidCorrosion} from '../../../src/liquids/acid/physics/corrosion.mjs';
// Explicit exact peer module; never vendor the shared engine into this branch.
const corePath=process.env.LIQUID_ENGINE_MODULE;
if(!corePath)throw Error('LIQUID_ENGINE_MODULE must name the pinned shared engine');
const {createLiquidEngine}=await import(pathToFileURL(resolve(corePath)).href);
const key=p=>p.join(',');
const p=[0,0,0], w=[-1,0,0], target=[1,0,0], high=[0,1,0];
function fixture({allowSettlement=true,maxTracked=16,maxVisits=4,minStrength=400,threshold=1200,snapshot=null,materialRead=null,enabled=true}={}){
  const spaces=new Set([p,w,high].map(key)),unloaded=new Set();
  const materials=new Map([[key(target),{id:'fixture-stone',revision:'r1',protected:false}]]);
  const isLoaded=(...q)=>!unloaded.has(key(q)),isOpen=(...q)=>spaces.has(key(q))&&!materials.has(key(q));
  const engine=createLiquidEngine({isLoaded,isOpen,definitions:[ACID_DEFINITION,{id:'water',gravityLimit:8,lateralLimit:4}],reactionRules:[createAcidWaterRule({allowSettlement})],snapshot:snapshot?.engine??null});
  const opts={engine,isLoaded,isOpen,readMaterial:(...q)=>{materialRead?.(q);return materials.get(key(q));},canDamage:()=>true,
    enabled,policyId:'dirty-fixture-v1',rules:[{material:'fixture-stone',minStrength,threshold}],maxTracked,maxVisits};
  const ledger=createAcidCorrosion({...opts,snapshot:snapshot?.ledger??null});
  const insert=(q,units,strength=600)=>assert.equal(engine.insert(...q,'acid',units,acidQuantities(units,strength)),true);
  return {engine,ledger,opts,insert,spaces,materials,unloaded};
}
const total=(engine,quantity)=>engine.save().cells.reduce((n,c)=>n+(quantity?(c.quantities[quantity]??0):c.units),0);
test('actual gravity dirty handoff discovers new contact without a scan or mutation',()=>{
  const {engine,ledger,insert}=fixture();insert(high,4);
  assert.equal(ledger.trackChanges([high]).admitted,0);
  const delta=engine.tick(1);assert.equal(delta.moved,4);
  const before=engine.save();assert.equal(ledger.trackChanges(delta.changed).admitted,1);
  assert.equal(ledger.save().entries[0].progress,0);assert.equal(ledger.step().proposals.length,0);
  const proposal=ledger.step().proposals[0];assert.deepEqual(proposal.target,target);
  assert.equal(proposal.expectedAcid[0],engine.getCell(...p));assert.deepEqual(engine.save(),before);
});
test('dry change between visits retires progress; reinsertion starts fresh',()=>{
  const {engine,ledger,insert}=fixture();insert(p,4);
  ledger.trackChanges([p,p]);ledger.step();assert.equal(ledger.save().entries[0].progress,600);
  engine.extract(...p,4);assert.equal(ledger.trackChanges([p]).retired,1);
  insert(p,4);assert.equal(ledger.trackChanges([p]).admitted,1);assert.equal(ledger.step().proposals.length,0);
  assert.equal(ledger.save().entries[0].progress,600);
});
test('duplicate changes do not accrue work or reorder FIFO; target revision resets',()=>{
  const {ledger,insert,materials}=fixture();insert(p,4);ledger.trackChanges([p]);ledger.step();
  const before=ledger.save();ledger.trackChanges([p,target,p]);assert.deepEqual(ledger.save(),before);
  materials.set(key(target),{id:'fixture-stone',revision:'r2',protected:false});
  assert.equal(ledger.trackChanges([target]).reset,1);assert.equal(ledger.save().entries[0].progress,0);
  materials.set(key(target),{id:'fixture-stone',revision:'r3',protected:true});
  assert.equal(ledger.trackChanges([target]).retired,1);assert.equal(ledger.step().pending,0);
});
test('unloaded target never read; reload reconciles before stepping',()=>{
  const f=fixture({materialRead:q=>{if(f.unloaded.has(key(q)))throw Error('unloaded read');}});
  f.insert(p,4);f.ledger.trackChanges([p]);f.ledger.step();const before=f.ledger.save();
  f.unloaded.add(key(target));f.ledger.trackChanges([target]);assert.deepEqual(f.ledger.save(),before);
  assert.equal(f.ledger.step().deferred,1);f.unloaded.delete(key(target));
  f.materials.set(key(target),{id:'fixture-stone',revision:'r2',protected:false});
  assert.equal(f.ledger.trackChanges([target]).reset,1);
  assert.equal(f.ledger.step().proposals.length,0);
});
test('capacity rejection is atomic; net retirement permits replacement',()=>{
  const f=fixture({maxTracked:1});f.insert(p,4);f.ledger.trackChanges([p]);f.ledger.step();
  const q=[10,0,0],t=[11,0,0];f.spaces.add(key(q));f.materials.set(key(t),{id:'fixture-stone',revision:'r1',protected:false});f.insert(q,4);
  const before=f.ledger.save();assert.equal(f.ledger.trackChanges([q]),null);assert.deepEqual(f.ledger.save(),before);
  f.engine.extract(...p,4);const r=f.ledger.trackChanges([q,p]);assert.deepEqual([r.admitted,r.retired,r.pending],[1,1,1]);
  assert.deepEqual(f.ledger.save().entries[0].p,t);
});
test('dirty bounds and malformed inputs reject before host callbacks',()=>{
  let reads=0;const f=fixture({materialRead:()=>reads++});f.insert(p,4);const before=f.ledger.save();
  assert.throws(()=>f.ledger.trackChanges([p,[0,257,0]]));assert.throws(()=>f.ledger.trackChanges([p,p],{maxChanged:1}));
  assert.equal(reads,0);assert.deepEqual(f.ledger.save(),before);
  assert.equal(f.ledger.trackChanges([[0,-210,0],[0,256,0]]).candidates,12);
});
test('dirty callback failure leaves entire queue unchanged, including staged retirement',()=>{
  let fail=false;const f=fixture({materialRead:q=>{if(fail&&q[0]===11)throw Error('fixture callback');}});
  f.insert(p,4);f.ledger.trackChanges([p]);f.ledger.step();f.engine.extract(...p,4);
  const q=[10,0,0];f.spaces.add(key(q));f.materials.set('11,0,0',{id:'fixture-stone',revision:'r1',protected:false});f.insert(q,4);
  const before=f.ledger.save();fail=true;assert.throws(()=>f.ledger.trackChanges([p,q]));assert.deepEqual(f.ledger.save(),before);
});
test('disabled dirty handoff does not call the host',()=>{
  const f=fixture({enabled:false,materialRead:()=>{throw Error('unexpected read');}});f.insert(p,4);
  assert.deepEqual(f.ledger.trackChanges([p]),{candidates:0,admitted:0,retired:0,reset:0,pending:0});
});
test('opt-in neutral dilution moves water into acid, preserves payloads, and retires weak contact',()=>{
  const f=fixture();const {engine:e,ledger:s}=f;
  assert.ok(e.insert(...p,'acid',3,{[ACID_SOLUTE]:1800,trace:7}));assert.ok(e.insert(...w,'water',2));
  s.trackChanges([p,w]);s.step();const before=e.save();
  const plan=e.planReaction(...w,...p);assert.equal(plan.routeB,'a');assert.deepEqual(plan.productInputs,[]);assert.deepEqual(e.save(),before);
  const result=e.commitReaction(plan);assert.deepEqual(result.productInputs,[]);assert.equal(e.getCell(...w),null);
  assert.equal(readAcidStrength(e.getCell(...p)),360);assert.equal(total(e),5);assert.equal(total(e,ACID_SOLUTE),1800);assert.equal(total(e,'trace'),7);
  assert.equal(s.trackChanges(result.changed).retired,1);assert.equal(s.step().proposals.length,0);assert.equal(e.commitReaction(plan),null);
});
test('proposal-only default, foreign water payload and stale/unloaded plans fail closed',()=>{
  const off=fixture({allowSettlement:false});off.insert(p,3);off.engine.insert(...w,'water',2);
  assert.ok(off.engine.proposeReaction(...p,...w));assert.equal(off.engine.planReaction(...p,...w),null);
  const f=fixture();f.insert(p,3);f.engine.insert(...w,'water',2,{trace:1});assert.equal(f.engine.planReaction(...p,...w),null);
  f.engine.extract(...w,2);f.engine.insert(...w,'water',2);const plan=f.engine.planReaction(...p,...w);
  f.unloaded.add(key(w));const before=f.engine.save();assert.equal(f.engine.commitReaction(plan),null);assert.deepEqual(f.engine.save(),before);
  f.unloaded.clear();const fresh=f.engine.planReaction(...p,...w);f.engine.extract(...w,1);const changed=f.engine.save();
  assert.equal(f.engine.commitReaction(fresh),null);assert.deepEqual(f.engine.save(),changed);
  assert.throws(()=>createAcidWaterRule({allowSettlement:'yes'}),TypeError);
});
test('real core and corrosion snapshot restore preserves progress and next proposal',()=>{
  const f=fixture();f.insert(p,4);f.ledger.trackChanges([p]);f.ledger.step();
  const snapshot=JSON.parse(JSON.stringify({engine:f.engine.save(),ledger:f.ledger.save()}));
  const g=fixture({snapshot});assert.deepEqual(g.ledger.save(),f.ledger.save());
  assert.deepEqual(g.ledger.step(),f.ledger.step());assert.deepEqual(g.engine.save(),f.engine.save());
});
