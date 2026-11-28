import test from 'node:test';
import assert from 'node:assert/strict';
import {acidQuantities} from '../../../src/liquids/acid/physics/definition.mjs';
import {createAcidCorrosion as create} from '../../../src/liquids/acid/physics/corrosion.mjs';
const k=p=>p.join(',');
const acid=(p,units=4,strength=600)=>Object.freeze({x:p[0],y:p[1],z:p[2],id:'acid',units,quantities:acidQuantities(units,strength)});
function fixture(over={}){
  const cells=new Map(),materials=new Map(),unloaded=new Set();let permit=true;
  const opts={engine:{getCell:(...p)=>cells.get(k(p))??null},isLoaded:(...p)=>!unloaded.has(k(p)),
    isOpen:(...p)=>!materials.has(k(p)),readMaterial:(...p)=>materials.get(k(p)),canDamage:()=>permit,
    enabled:true,policyId:'fixture-v1',rules:[{material:'test-stone',minStrength:300,threshold:1200}],...over};
  const target=(p,revision='r1',protectedBuild=false,id='test-stone')=>materials.set(k(p),{id,revision,protected:protectedBuild});
  const liquid=(p,u,s)=>cells.set(k(p),acid(p,u,s));
  return {opts,cells,materials,unloaded,target,liquid,deny:()=>{permit=false;}};
}
function setup(over={}){const f=fixture(over);f.target([0,0,0]);f.liquid([1,0,0]);return {...f,s:create(f.opts)};}
test('default off, explicit opt-in, and empty allowlist never produce damage',()=>{
  const f=setup(),off=create({...f.opts,enabled:false});assert.equal(off.track(0,0,0),false);assert.equal(off.step().visited,0);
  const empty=create({...f.opts,rules:[]});empty.track(0,0,0);assert.equal(empty.step().proposals.length,0);
});
test('progress is concentration-based, proposals are read-only and threshold bounded',()=>{
  const f=setup();f.s.track(0,0,0);assert.equal(f.s.step().proposals.length,0);
  const p=f.s.step().proposals[0];assert.equal(p.progress,1200);assert.equal(p.peakStrength,600);
  assert.equal(p.expectedAcid[0],f.cells.get('1,0,0'));assert.equal(f.s.step().proposals[0].progress,1200);
  assert.equal(f.cells.get('1,0,0').quantities['acid-solute'],2400);assert.equal(f.materials.size,1);
});
test('protected, unknown protection, disallowed material and denied host all retire',()=>{
  for(const mode of ['protected','unknown','material','policy']){
    const f=setup();f.s.track(0,0,0);f.s.step();
    if(mode==='protected')f.target([0,0,0],'r1',true);
    if(mode==='unknown')delete f.materials.get('0,0,0').protected;
    if(mode==='material')f.target([0,0,0],'r1',false,'other');
    if(mode==='policy')f.deny();
    const r=f.s.step();assert.equal(r.retired,1);assert.equal(r.proposals.length,0);assert.equal(r.pending,0);
  }
});
test('target replacement or lost acid contact clears old progress',()=>{
  const f=setup();f.s.track(0,0,0);f.s.step();f.target([0,0,0],'r2');assert.equal(f.s.step().proposals.length,0);
  f.cells.clear();assert.equal(f.s.step().retired,1);f.liquid([1,0,0]);f.s.track(0,0,0);assert.equal(f.s.step().proposals.length,0);
});
test('partial liquid below cannot touch ceiling; full below or any above can',()=>{
  const f=fixture();f.target([0,0,0]);f.liquid([0,-1,0],7);const s=create(f.opts);s.track(0,0,0);assert.equal(s.step().retired,1);
  f.liquid([0,-1,0],8);s.track(0,0,0);assert.equal(s.step().retired,0);assert.equal(s.step().proposals.length,1);
  f.cells.clear();f.liquid([0,1,0],1);assert.equal(s.step().proposals.length,1);
});
test('low strength, unloaded acid and invalid coordinate identity cannot corrode',()=>{
  const f=setup();for(const mode of ['weak','unloaded','wrong']){
    f.unloaded.clear();f.liquid([1,0,0],4,mode==='weak'?299:600);
    if(mode==='unloaded')f.unloaded.add('1,0,0');if(mode==='wrong')f.cells.set('1,0,0',acid([2,0,0]));
    f.s.track(0,0,0);assert.equal(f.s.step().retired,1);
  }
});
test('unloaded target defers without accumulating and JSON resume preserves cursor',()=>{
  const f=setup({maxVisits:1});f.target([4,0,0]);f.liquid([5,0,0]);f.s.track(0,0,0);f.s.track(4,0,0);f.s.step();
  f.unloaded.add('0,0,0');f.s.step();assert.equal(f.s.step().deferred,1);const snap=JSON.parse(JSON.stringify(f.s.save()));
  const t=create({...f.opts,snapshot:snap});assert.deepEqual(t.save(),snap);f.unloaded.clear();
  for(let i=0;i<4;i++){assert.deepEqual(t.step(),f.s.step());assert.deepEqual(t.save(),f.s.save());}
});
test('budget, deduplication and physical bounds fail closed',()=>{
  const f=setup({maxTracked:1,maxVisits:1});assert.equal(f.s.track(0,0,0),true);assert.equal(f.s.track(0,0,0),true);
  assert.equal(f.s.track(1,256,0),false);assert.throws(()=>f.s.track(0,257,0));assert.throws(()=>f.s.track(0,-211,0));assert.throws(()=>f.s.step(2));
  f.cells.clear();f.s.step();assert.equal(f.s.track(0,-210,0),true);
});
test('snapshot rejects duplicates, changed policy and excess progress',()=>{
  const f=setup();f.s.track(0,0,0);f.s.step();const snap=f.s.save();
  assert.throws(()=>create({...f.opts,policyId:'changed',snapshot:snap}));
  assert.throws(()=>create({...f.opts,snapshot:{...snap,entries:[...snap.entries,...snap.entries]}}));
  assert.throws(()=>create({...f.opts,snapshot:{...snap,entries:[{...snap.entries[0],progress:1201}]}}));
});
test('callback failure or reentrancy preserves entire ledger',()=>{
  let s,fail=false;const f=setup({canDamage:x=>{if(fail&&x===4)s.track(9,0,0);return true;}});s=f.s;
  f.target([4,0,0]);f.liquid([5,0,0]);s.track(0,0,0);s.track(4,0,0);const before=s.save();fail=true;
  assert.throws(()=>s.step());assert.deepEqual(s.save(),before);fail=false;assert.equal(s.step().visited,2);
});
