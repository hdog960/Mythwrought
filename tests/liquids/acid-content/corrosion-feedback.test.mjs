import test from 'node:test';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {sampleAcidCorrosionFeedback as sample} from '../../../src/liquids/acid/content/corrosion-feedback.mjs';

// Actual pinned owner modules, not a duplicated corrosion algorithm.
const {createAcidCorrosion}=await import(pathToFileURL(resolve(process.env.ACID_CORROSION_MODULE)).href);
const {acidQuantities}=await import(pathToFileURL(resolve(process.env.ACID_PHYSICS_MODULE)).href);
const key=p=>p.join(',');
function fixture({target=[0,0,0],contacts=[[1,0,0,4]],threshold=600,enabled=true}={}){
  const cells=new Map(),unloaded=new Set(),solid=new Map();
  solid.set(key(target),{id:'fixture-ore',revision:'r1',protected:false});
  for(const [dx,dy,dz,units] of contacts){const [x,y,z]=target.map((v,i)=>v+[dx,dy,dz][i]);cells.set(key([x,y,z]),Object.freeze({x,y,z,id:'acid',units,quantities:acidQuantities(units)}));}
  const isLoaded=(...p)=>!unloaded.has(key(p)),isOpen=(...p)=>!solid.has(key(p)),readMaterial=(...p)=>solid.get(key(p));
  let reads=0,allowed=true,current=true;
  const engine={getCell:(...p)=>{reads++;return cells.get(key(p))??null;}};
  const owner=createAcidCorrosion({engine,isLoaded,isOpen,readMaterial,canDamage:()=>allowed,enabled,
    policyId:'fixture',rules:[{material:'fixture-ore',minStrength:1,threshold}]});
  owner.track(...target);
  const opts={engine,isLoaded,isOpen,readMaterial,isCurrentProposal:()=>current&&allowed,isFaceVisible:()=>true};
  return {owner,opts,cells,solid,unloaded,reads:()=>reads,setAllowed:v=>allowed=v,setCurrent:v=>current=v};
}
const cues=(f,receipt,over={})=>sample({...f.opts,receipt,...over}).cues;

test('actual owner emits no warning before threshold; saturated cue has physical side center',()=>{
  const f=fixture({threshold:1200});assert.deepEqual(cues(f,f.owner.step()),[]);
  const receipt=f.owner.step(),before=f.owner.save();const out=cues(f,receipt);
  assert.deepEqual(out,[{kind:'acid-corrosion-warning',target:[0,0,0],material:'fixture-ore',revision:'r1',normal:[1,0,0],center:[1,0.25,0.5],intensity:0.6}]);
  assert.deepEqual(f.owner.save(),before);assert.equal(f.cells.size,1);
  assert.ok(Object.isFrozen(out)&&Object.isFrozen(out[0])&&Object.isFrozen(out[0].center));
});
test('disabled and protected owner targets never emit warnings',()=>{
  const a=fixture({enabled:false});assert.deepEqual(cues(a,a.owner.step()),[]);
  const b=fixture();b.solid.get('0,0,0').protected=true;assert.deepEqual(cues(b,b.owner.step()),[]);
});
test('stale revision, protected target, owner rejection and dry/replaced contact suppress warning',()=>{
  const f=fixture(),r=f.owner.step();assert.equal(cues(f,r).length,1);
  const m=f.solid.get('0,0,0');m.revision='r2';assert.deepEqual(cues(f,r),[]);m.revision='r1';
  m.protected=true;assert.deepEqual(cues(f,r),[]);m.protected=false;
  f.setCurrent(false);assert.deepEqual(cues(f,r),[]);f.setCurrent(true);
  f.setAllowed(false);assert.deepEqual(cues(f,r),[]);f.setAllowed(true);
  const c=f.cells.get('1,0,0');f.cells.set('1,0,0',Object.freeze({...c}));assert.deepEqual(cues(f,r),[]);
  f.cells.delete('1,0,0');assert.deepEqual(cues(f,r),[]);
});
test('unloaded target or contact avoids liquid reads; obstructed contact suppresses',()=>{
  const f=fixture(),r=f.owner.step(),n=f.reads();f.unloaded.add('0,0,0');assert.deepEqual(cues(f,r),[]);assert.equal(f.reads(),n);
  f.unloaded.clear();f.unloaded.add('1,0,0');assert.deepEqual(cues(f,r),[]);assert.equal(f.reads(),n);
  f.unloaded.clear();f.solid.set('1,0,0',{});assert.deepEqual(cues(f,r),[]);assert.equal(f.reads(),n);
});
test('one visible face per target, deterministic fallback, all-contact freshness',()=>{
  const f=fixture({contacts:[[0,1,0,2],[1,0,0,8]]}),r=f.owner.step();
  assert.deepEqual(cues(f,r)[0].normal,[0,1,0]);assert.deepEqual(cues(f,r)[0].center,[0.5,1,0.5]);
  assert.deepEqual(cues(f,r,{isFaceVisible:(_t,n)=>n[0]===1})[0].normal,[1,0,0]);
  assert.deepEqual(cues(f,r,{isFaceVisible:()=>false}),[]);
  f.cells.delete('1,0,0');assert.deepEqual(cues(f,r),[]);
});
test('duplicate targets and explicit budgets bound output and reads',()=>{
  const f=fixture(),r=f.owner.step(),p=r.proposals[0],receipt={proposals:[p,p,p]};
  const one=sample({...f.opts,receipt,maxCues:1});assert.equal(one.inspected,1);assert.equal(one.uninspected,2);assert.equal(one.cues.length,1);
  assert.equal(cues(f,receipt).length,1);const n=f.reads();assert.deepEqual(cues(f,receipt,{maxCues:0}),[]);assert.equal(f.reads(),n);
  assert.throws(()=>cues(f,receipt,{maxProposals:2}),RangeError);
});
test('reject malformed batch before any reads even if cue limit is zero',()=>{
  const f=fixture(),r=f.owner.step(),p=r.proposals[0],n=f.reads();
  for(const bad of [{...p,target:[0,257,0]},{...p,expectedAcid:[p.expectedAcid[0],p.expectedAcid[0]]},{...p,product:'other'},{...p,peakStrength:1001}]){
    assert.throws(()=>cues(f,{proposals:[p,bad]},{maxCues:0}),TypeError);
  }assert.equal(f.reads(),n);
});
test('physical ceiling and far coordinates retain exact local center; full below contact',()=>{
  const f=fixture({target:[9007199254740990,256,0],contacts:[[0,-1,0,8]]}),r=f.owner.step();
  assert.deepEqual(cues(f,r)[0].normal,[0,-1,0]);assert.deepEqual(cues(f,r)[0].center,[0.5,0,0.5]);
  assert.equal(cues(f,r)[0].target[0],9007199254740990);
});
