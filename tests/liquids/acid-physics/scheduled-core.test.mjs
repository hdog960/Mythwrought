import test from 'node:test';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {ACID_DEFINITION,ACID_SOLUTE,acidQuantities,readAcidStrength,createAcidWaterRule} from '../../../src/liquids/acid/physics/definition.mjs';
import {createAcidCorrosion} from '../../../src/liquids/acid/physics/corrosion.mjs';
import {createAcidReactionScheduler} from '../../../src/liquids/acid/physics/reaction-scheduler.mjs';
const corePath=process.env.LIQUID_ENGINE_MODULE;
if(!corePath)throw Error('LIQUID_ENGINE_MODULE must name the pinned shared engine');
const bytes=readFileSync(corePath);
assert.equal(createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex'),'ac9dfb9e85e99cce81ffc6a4aabe8b2f6f2b764b');
const {createLiquidEngine}=await import(pathToFileURL(resolve(corePath)).href);
const key=p=>p.join(',');
const a=[0,0,0],left=[-1,0,0],right=[1,0,0],top=[0,1,0],solid=[0,0,1];
function fixture(snapshot=null){
  const open=new Set([a,left,right,top].map(key)),unloaded=new Set();
  const isLoaded=(...p)=>!unloaded.has(key(p)),isOpen=(...p)=>open.has(key(p));
  const engine=createLiquidEngine({isLoaded,isOpen,definitions:[ACID_DEFINITION,{id:'water',gravityLimit:8,lateralLimit:4}],
    reactionRules:[createAcidWaterRule({allowSettlement:true})],snapshot:snapshot?.engine??null});
  const scheduler=createAcidReactionScheduler({engine,isLoaded,isOpen,enabled:true,policyId:'scheduler-core-v1',snapshot:snapshot?.scheduler??null});
  const corrosion=createAcidCorrosion({engine,isLoaded,isOpen,enabled:true,policyId:'scheduler-core-v1',
    readMaterial:(...p)=>key(p)===key(solid)?{id:'fixture-stone',revision:'r1',protected:false}:null,canDamage:()=>true,
    rules:[{material:'fixture-stone',minStrength:400,threshold:600}],snapshot:snapshot?.corrosion??null});
  const dirty=changed=>{assert.ok(scheduler.trackChanges(changed));assert.ok(corrosion.trackChanges(changed));};
  const save=()=>({engine:engine.save(),scheduler:scheduler.save(),corrosion:corrosion.save()});
  const commit=plan=>{const receipt=engine.commitReaction(plan);assert.ok(receipt);assert.deepEqual(receipt.productInputs,[]);dirty(receipt.changed);return receipt;};
  const insert=(p,id,n,q={})=>{assert.ok(engine.insert(...p,id,n,q));dirty([p]);};
  return {engine,scheduler,corrosion,unloaded,dirty,save,commit,insert};
}
const totals=e=>e.save().cells.reduce(([units,solute,trace],c)=>[units+c.units,solute+(c.quantities[ACID_SOLUTE]??0),trace+(c.quantities.trace??0)],[0,0,0]);
test('actual gravity dirty handoff schedules dilution and invalidates saturated corrosion',()=>{
  const f=fixture();f.insert(top,'acid',3,{...acidQuantities(3),trace:7});f.insert(left,'water',2);
  assert.equal(f.scheduler.step().plans.length,0);
  const delta=f.engine.tick(1);assert.equal(delta.moved,3);f.dirty(delta.changed);
  const p=f.corrosion.step().proposals[0];assert.ok(p);
  const before=f.engine.save(),batch=f.scheduler.step();assert.equal(batch.plans.length,1);assert.deepEqual(f.engine.save(),before);
  f.commit(batch.plans[0]);assert.equal(f.engine.getCell(...left),null);assert.equal(readAcidStrength(f.engine.getCell(...a)),360);
  assert.deepEqual(totals(f.engine),[5,1800,7]);assert.equal(f.corrosion.revalidateProposal(p),false);assert.equal(f.corrosion.step().pending,0);
});
test('actual shared-face contention rotates fairly across successful settlements and restores queue',()=>{
  const f=fixture();f.insert(a,'acid',3,acidQuantities(3));f.insert(left,'water',4);f.insert(right,'water',4);
  const first=f.scheduler.step();assert.equal(first.plans.length,1);assert.equal(first.deferred,1);
  const firstX=first.plans[0].proposal.b.x;f.commit(first.plans[0]);
  const g=fixture(JSON.parse(JSON.stringify(f.save()))),second=f.scheduler.step(),restored=g.scheduler.step();
  assert.equal(second.plans.length,1);assert.equal(second.plans[0].proposal.b.x,-firstX);assert.deepEqual(second,restored);
  assert.equal(g.engine.commitReaction(second.plans[0]),null);
  f.commit(second.plans[0]);g.commit(restored.plans[0]);assert.deepEqual(f.save(),g.save());
  const last=f.scheduler.step();assert.equal(last.plans.length,1);f.commit(last.plans[0]);assert.equal(f.engine.getCell(...a).units,8);
  assert.deepEqual(totals(f.engine),[11,1800,0]);assert.equal(f.scheduler.step().plans.length,0);
});
test('actual stale plan rejected on unload and fresh plan succeeds after reload',()=>{
  const f=fixture();f.insert(a,'acid',3,acidQuantities(3));f.insert(left,'water',2);
  const plan=f.scheduler.step().plans[0];f.unloaded.add(key(left));const before=f.engine.save();
  assert.equal(f.engine.commitReaction(plan),null);assert.deepEqual(f.engine.save(),before);
  assert.equal(f.scheduler.step().deferred,1);f.unloaded.clear();f.dirty([left]);
  f.commit(f.scheduler.step().plans[0]);assert.deepEqual(totals(f.engine),[5,1800,0]);
});
