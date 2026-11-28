import test from 'node:test';
import assert from 'node:assert/strict';
import {acidQuantities} from '../../../src/liquids/acid/physics/definition.mjs';
import {createAcidCorrosion} from '../../../src/liquids/acid/physics/corrosion.mjs';
const key=p=>p.join(',');
function setup(over={}){
  const target=[0,0,0],side=[1,0,0],cells=new Map(),unloaded=new Set();
  let material={id:'test-stone',revision:'r1',protected:false},permit=true,fail=false;
  function fill(p=side,strength=600){cells.set(key(p),Object.freeze({x:p[0],y:p[1],z:p[2],id:'acid',units:4,quantities:acidQuantities(4,strength)}));}
  fill();
  const opts={engine:{getCell:(...p)=>cells.get(key(p))??null},isLoaded:(...p)=>!unloaded.has(key(p)),
    isOpen:(...p)=>key(p)!==key(target),readMaterial:()=>material,canDamage:()=>{if(fail)throw Error('host failure');return permit;},
    enabled:true,policyId:'revalidation-fixture',rules:[{material:'test-stone',minStrength:300,threshold:600}],...over};
  const s=createAcidCorrosion(opts);s.track(...target);
  const issue=()=>s.step().proposals[0];
  return {s,opts,target,side,cells,unloaded,fill,issue,replace:m=>{material={...material,...m};},deny:()=>{permit=false;},fail:()=>{fail=true;}};
}
test('fresh capability validates exactly once without changing ledger or world',()=>{
  const f=setup(),p=f.issue(),before=f.s.save(),cells=[...f.cells];
  assert.equal(f.s.revalidateProposal(p),true);assert.equal(f.s.revalidateProposal(p),false);
  assert.deepEqual(f.s.save(),before);assert.deepEqual([...f.cells],cells);
});
test('forged, foreign and snapshot-restored proposals fail closed',()=>{
  const f=setup(),p=f.issue(),g=createAcidCorrosion({...f.opts,snapshot:JSON.parse(JSON.stringify(f.s.save()))});
  for(const q of [null,undefined,{},JSON.parse(JSON.stringify(p)),{...p}])assert.equal(f.s.revalidateProposal(q),false);
  assert.equal(g.revalidateProposal(p),false);assert.equal(g.revalidateProposal(g.step().proposals[0]),true);
  assert.equal(f.s.revalidateProposal(p),true);
});
test('exact acid record replacement invalidates even identical concentration and volume',()=>{
  const f=setup(),p=f.issue();f.fill();assert.deepEqual(f.cells.get(key(f.side)),p.expectedAcid[0]);
  assert.equal(f.s.revalidateProposal(p),false);assert.equal(f.s.revalidateProposal(f.issue()),true);
});
test('changed face contacts or dilution reject old proposals',()=>{
  const f=setup(),p=f.issue();f.fill([-1,0,0]);assert.equal(f.s.revalidateProposal(p),false);
  const q=f.issue();f.fill(f.side,299);assert.equal(f.s.revalidateProposal(q),false);
  assert.equal(f.s.revalidateProposal(f.issue()),true);
});
test('material revision and current build permission are checked anew',()=>{
  for(const change of [f=>f.replace({revision:'r2'}),f=>f.replace({protected:true}),f=>f.replace({protected:undefined}),f=>f.replace({id:'other'}),f=>f.deny()]){
    const f=setup(),p=f.issue();change(f);const before=f.s.save();assert.equal(f.s.revalidateProposal(p),false);assert.deepEqual(f.s.save(),before);
  }
});
test('later corrosion visit supersedes prior proposal even at identical saturated progress',()=>{
  const f=setup(),a=f.issue(),b=f.issue();assert.deepEqual(a,b);
  assert.equal(f.s.revalidateProposal(a),false);assert.equal(f.s.revalidateProposal(b),true);
});
test('dirty boundary invalidates proposals without resetting unchanged progress',()=>{
  const f=setup(),p=f.issue(),before=f.s.save();f.s.trackChanges([f.side]);
  assert.deepEqual(f.s.save(),before);assert.equal(f.s.revalidateProposal(p),false);
  assert.equal(f.s.revalidateProposal(f.issue()),true);
});
test('unload and reload cannot revive old proposals after observed dirty or deferred visit',()=>{
  for(const visit of [f=>f.s.trackChanges([f.target]),f=>f.s.step()]){
    const f=setup(),p=f.issue();f.unloaded.add(key(f.target));visit(f);f.unloaded.clear();
    assert.equal(f.s.revalidateProposal(p),false);assert.equal(f.s.revalidateProposal(f.issue()),true);
  }
  const f=setup(),p=f.issue();f.unloaded.add(key(f.side));assert.equal(f.s.revalidateProposal(p),false);
});
test('dry interval invalidates old proposal even after original cell object returns',()=>{
  const f=setup(),p=f.issue(),old=f.cells.get(key(f.side));f.cells.clear();f.s.trackChanges([f.side]);
  f.cells.set(key(f.side),old);f.s.trackChanges([f.side]);assert.equal(f.s.revalidateProposal(p),false);
  assert.equal(f.s.revalidateProposal(f.issue()),true);
});
test('host callback failure consumes attempt but leaves durable ledger unchanged',()=>{
  const f=setup(),p=f.issue(),before=f.s.save();f.fail();assert.throws(()=>f.s.revalidateProposal(p),/host failure/);
  assert.deepEqual(f.s.save(),before);assert.equal(f.s.revalidateProposal(p),false);
});
