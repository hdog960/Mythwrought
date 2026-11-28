import test from 'node:test';
import assert from 'node:assert/strict';
import {createAcidReactionScheduler} from '../../../src/liquids/acid/physics/reaction-scheduler.mjs';
const key=p=>p.join(',');
const a=[0,0,0],b=[1,0,0],c=[-1,0,0],d=[10,0,0],e=[11,0,0];
function fixture(opts={}){
  const cells=new Map(),unloaded=new Set(),blocked=new Set();let reads=0,fail=false,bad=false;
  const put=(p,id,units=3)=>cells.set(key(p),Object.freeze({x:p[0],y:p[1],z:p[2],id,units,quantities:Object.freeze({})}));
  const getCell=(...p)=>{reads++;if(unloaded.has(key(p)))throw Error('unloaded read');return cells.get(key(p))??null;};
  const engine={getCell,planReaction:(...p)=>{
    if(fail)throw Error('fixture callback');const x=getCell(...p.slice(0,3)),y=getCell(...p.slice(3));
    if(x.units===8)return null;
    return Object.freeze({proposal:{a:x,b:y,consumeA:0,consumeB:Math.min(2,y.units,8-x.units),product:'acid-dilution'},
      product:'acid-dilution',routeA:null,routeB:bad?'product':'a',productInputs:[]});
  }};
  const config={engine,isLoaded:(...p)=>!unloaded.has(key(p)),isOpen:(...p)=>!blocked.has(key(p)),enabled:true,policyId:'test',...opts};
  return {s:createAcidReactionScheduler(config),config,cells,put,unloaded,blocked,reads:()=>reads,fail:()=>{fail=true;},bad:()=>{bad=true;}};
}
test('duplicate reversed dirty contact admits one pair, without engine mutation',()=>{
  const f=fixture();f.put(a,'acid');f.put(b,'water');
  assert.equal(f.s.trackChanges([a,b,a]).admitted,1);const before=f.s.save();
  assert.equal(f.s.trackChanges([b]).admitted,0);assert.deepEqual(f.s.save(),before);
  const r=f.s.step();assert.equal(r.plans.length,1);assert.equal(r.plans[0].proposal.a,f.cells.get(key(a)));
  assert.equal(f.cells.size,2);assert.equal(r.pending,1);
});
test('bounded FIFO rotates competing contacts and disjoint pairs',()=>{
  const f=fixture({maxVisits:3});f.put(a,'acid');f.put(b,'water');f.put(c,'water');f.put(d,'acid');f.put(e,'water');
  f.s.trackChanges([a,d]);const r=f.s.step();assert.equal(r.visited,3);assert.equal(r.deferred,1);assert.equal(r.plans.length,2);
  const t=f.s.step();assert.equal(t.plans.length,2);assert.notEqual(t.plans[0].proposal.b,r.plans[0].proposal.b);
  assert.throws(()=>f.s.step(4));
});
test('capacity rejection retains exact queue; net retirement admits replacement',()=>{
  const f=fixture({maxPairs:1});f.put(a,'acid');f.put(b,'water');f.s.trackChanges([a]);
  f.put(d,'acid');f.put(e,'water');const before=f.s.save();assert.equal(f.s.trackChanges([d]),null);assert.deepEqual(f.s.save(),before);
  f.cells.delete(key(b));const r=f.s.trackChanges([d,b]);assert.deepEqual([r.admitted,r.retired,r.pending],[1,1,1]);
});
test('unloaded pairs defer without retained cell reads and resume on reload',()=>{
  const f=fixture();f.put(a,'acid');f.put(b,'water');f.s.trackChanges([a]);f.unloaded.add(key(b));
  const n=f.reads();assert.equal(f.s.step().deferred,1);assert.equal(f.reads(),n);
  f.unloaded.clear();assert.equal(f.s.step().plans.length,1);f.blocked.add(key(b));assert.equal(f.s.step().retired,1);
});
test('full acid retires, later dirty capacity readmits',()=>{
  const f=fixture();f.put(a,'acid',8);f.put(b,'water');f.s.trackChanges([a]);assert.equal(f.s.step().retired,1);
  f.put(a,'acid',7);f.s.trackChanges([a]);assert.equal(f.s.step().plans[0].proposal.consumeB,1);
});
test('invalid input and disabled scheduler never read host',()=>{
  const f=fixture({enabled:false,maxChanged:2});assert.throws(()=>f.s.trackChanges([a,[0,257,0]]));
  assert.throws(()=>f.s.trackChanges([a,b,c]));assert.equal(f.s.trackChanges([a]).pending,0);assert.equal(f.reads(),0);
});
test('snapshot preserves FIFO, rejects changed config and malformed pairs',()=>{
  const f=fixture({maxVisits:1});f.put(a,'acid');f.put(b,'water');f.put(c,'water');f.s.trackChanges([a]);f.s.step();
  const snapshot=JSON.parse(JSON.stringify(f.s.save()));const g=createAcidReactionScheduler({...f.config,snapshot});
  assert.deepEqual(g.save(),snapshot);assert.deepEqual(g.step(),f.s.step());assert.deepEqual(g.save(),f.s.save());
  assert.throws(()=>createAcidReactionScheduler({...f.config,maxVisits:2,snapshot}));
  assert.throws(()=>createAcidReactionScheduler({...f.config,snapshot:{...snapshot,pairs:[[a,d]]}}));
  assert.throws(()=>createAcidReactionScheduler({...f.config,snapshot:{...snapshot,pairs:[snapshot.pairs[0],snapshot.pairs[0]]}}));
});
test('host or unexpected routing exception does not rotate or retire queue',()=>{
  for(const mode of ['fail','bad']){const f=fixture();f.put(a,'acid');f.put(b,'water');f.s.trackChanges([a]);const before=f.s.save();
    f[mode]();assert.throws(()=>f.s.step());assert.deepEqual(f.s.save(),before);}
});
test('physical envelope clips neighbors, no foreign-liquid reaction scheduling',()=>{
  const f=fixture();f.put(a,'acid');f.put(b,'lava');assert.equal(f.s.trackChanges([a]).admitted,0);
  assert.equal(f.s.trackChanges([[0,-210,0],[0,256,0]]).candidates,10);
});
