import test from 'node:test';
import assert from 'node:assert/strict';
import {createLiquidEngine} from '../../../src/liquids/core/engine.mjs';

// Synthetic owner policies exercise neutral routing; no gameplay chemistry is defined here.
const points=[0,0,0,1,0,0];
const proposal=()=>({consumeA:2,consumeB:3,product:'fixture-output'});
const product=()=>({routeA:'product',routeB:'product'});
const rule={a:'water',b:'lava',propose:proposal,settle:product};
function world(r=rule,opts={}){
  return createLiquidEngine({isLoaded:()=>true,isOpen:(x,y,z)=>y===0&&z===0&&(x===0||x===1),
    definitions:['water','lava','acid','amber-sap','liquid-resonance'].map(id=>({id,gravityLimit:0,lateralLimit:0})),
    reactionRules:[r],...opts});
}
function seed(e,a=5,b=7,qa={trace:13},qb={heat:101}){
  assert.equal(e.insert(0,0,0,'water',a,qa),true);
  assert.equal(e.insert(1,0,0,'lava',b,qb),true);
  return e;
}
function sums(cells){
  const q={};let units=0;
  for(const c of cells){units+=c.units;for(const [k,v] of Object.entries(c.quantities))q[k]=(q[k]??0)+v;}
  return {units,q};
}
test('legacy proposal alone remains read-only, with no implicit consumption',()=>{
  const e=seed(world({a:rule.a,b:rule.b,propose:proposal})),before=e.save();
  assert.equal(e.proposeReaction(...points).product,'fixture-output');
  assert.equal(e.planReaction(...points),null);e.tick();
  assert.deepEqual(e.save().cells,before.cells);
});
test('partial product routing conserves integer quantities and makes a frozen receipt',()=>{
  const e=seed(world()),before=e.save(),p=e.planReaction(1,0,0,0,0,0);
  assert.deepEqual(e.save(),before);assert.equal(p.proposal.a.id,'water');
  assert.deepEqual(p.takenA.quantities,{trace:5});assert.deepEqual(p.takenB.quantities,{heat:43});
  assert.deepEqual(p.afterA.quantities,{trace:8});assert.deepEqual(p.afterB.quantities,{heat:58});
  const r=e.commitReaction(p);assert.deepEqual(r.changed,[[0,0,0],[1,0,0]]);
  assert.deepEqual(sums([...e.save().cells,...r.productInputs]),sums(before.cells));
  assert.ok(Object.isFrozen(p)&&Object.isFrozen(r)&&Object.isFrozen(r.productInputs)&&Object.isFrozen(r.productInputs[0].quantities));
  assert.equal(e.commitReaction(p),null);
});
test('one-sided transfer increases recipient volume without a phantom product',()=>{
  const e=seed(world({...rule,propose:()=>({consumeA:0,consumeB:3,product:'fixture-transfer'}),settle:()=>({routeA:null,routeB:'a'})})),before=e.save();
  const p=e.planReaction(...points);assert.equal(p.takenA,null);
  assert.equal(p.afterA.units,8);assert.equal(p.afterA.id,'water');assert.deepEqual(p.afterA.quantities,{heat:43,trace:13});
  const r=e.commitReaction(p);assert.deepEqual(r.productInputs,[]);assert.deepEqual(sums(e.save().cells),sums(before.cells));
});
test('full consumption removes both cells and their pending references',()=>{
  const e=seed(world({...rule,propose:(a,b)=>({consumeA:a.units,consumeB:b.units,product:'fixture-output'})}));
  const before=e.save(),r=e.commitReaction(e.planReaction(...points));
  assert.deepEqual(e.save(),{version:1,cells:[],pending:[]});assert.deepEqual(sums(r.productInputs),sums(before.cells));
});
test('volume, quantity overflow and ninth extensive key reject entire transfer',()=>{
  const transfer={...rule,propose:()=>({consumeA:0,consumeB:1,product:'fixture-transfer'}),settle:()=>({routeA:null,routeB:'a'})};
  for(const e of [seed(world(transfer),8,1),seed(world(transfer),1,1,{heat:2**40},{heat:1}),seed(world(transfer),1,1,{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1},{i:1})]){
    const before=e.save();assert.equal(e.planReaction(...points),null);assert.deepEqual(e.save(),before);
  }
});
test('missing, invalid or explicitly refused owner routing fails closed',()=>{
  assert.throws(()=>world({...rule,settle:true}),TypeError);
  for(const routing of [undefined,{routeA:'a',routeB:'product'},{routeA:null,routeB:'product'},{routeA:'product',routeB:'discard'}]){
    const e=seed(world({...rule,settle:()=>routing})),before=e.save();
    assert.throws(()=>e.planReaction(...points),RangeError);assert.deepEqual(e.save(),before);
  }
  const e=seed(world({...rule,settle:()=>null}));assert.equal(e.planReaction(...points),null);
});
test('stale identity and competing plans reject without modifying cells or FIFO',()=>{
  const e=seed(world()),p=e.planReaction(...points),c=e.extract(0,0,0,5);e.insert(c.x,c.y,c.z,c.id,c.units,c.quantities);
  const before=e.save();assert.equal(e.commitReaction(p),null);assert.deepEqual(e.save(),before);
  const a=e.planReaction(...points),b=e.planReaction(...points);assert.ok(e.commitReaction(a));
  const after=e.save();assert.equal(e.commitReaction(b),null);assert.deepEqual(e.save(),after);
});
test('unload, terrain obstruction and changed owner policy reject on commit',()=>{
  let loaded=true,open=true,policy=product();
  const e=seed(world({...rule,settle:()=>policy},{isLoaded:x=>x===0||loaded,isOpen:x=>x===0||open}));
  for(const invalidate of [()=>{loaded=false;},()=>{open=false;},()=>{policy={routeA:'b',routeB:'a'};}]){
    loaded=true;open=true;policy=product();const p=e.planReaction(...points),before=e.save();invalidate();
    assert.equal(e.commitReaction(p),null);assert.deepEqual(e.save(),before);
  }
});
test('host callback exception precedes writes; failed attempt is not replayable',()=>{
  let fail=false;const e=seed(world({...rule,settle:()=>{if(fail)throw Error('policy failure');return product();}}));
  const p=e.planReaction(...points),before=e.save();fail=true;
  assert.throws(()=>e.commitReaction(p),/policy failure/);assert.deepEqual(e.save(),before);fail=false;
  assert.equal(e.commitReaction(p),null);
});
test('forged, cross-instance and restored-instance plans cannot execute',()=>{
  const e=seed(world()),p=e.planReaction(...points),f=world(rule,{snapshot:JSON.parse(JSON.stringify(e.save()))});
  const before=f.save();assert.equal(f.commitReaction(p),null);assert.deepEqual(f.save(),before);
  assert.equal(e.commitReaction({...p}),null);assert.equal(e.commitReaction(null),null);assert.ok(e.commitReaction(p));
});
test('unchanged participant identity is retained and neighbors wake normally',()=>{
  const e=seed(world({...rule,propose:()=>({consumeA:0,consumeB:1,product:'fixture-output'}),settle:()=>({routeA:null,routeB:'product'})}));
  e.tick();const a=e.getCell(0,0,0),r=e.commitReaction(e.planReaction(...points));
  assert.equal(e.getCell(0,0,0),a);assert.deepEqual(r.changed,[[1,0,0]]);
  assert.deepEqual(e.save().pending,[[1,0,0],[0,0,0]]);
});
test('registered unlike pairs at physical bounds work; diagonal and out-of-range do not',()=>{
  const r={a:'amber-sap',b:'liquid-resonance',propose:()=>({consumeA:1,consumeB:1,product:'fixture-output'}),settle:product};
  for(const y of [-210,256]){
    const e=world(r,{isOpen:()=>true});e.insert(0,y,0,r.a,1,{trace:7});e.insert(1,y,0,r.b,1,{energy:11});
    assert.equal(e.planReaction(0,y,0,1,y,1),null);assert.equal(e.planReaction(0,y,0,0,257,0),null);
    const p=e.planReaction(0,y,0,1,y,0);assert.equal(e.commitReaction(p).productInputs.length,2);
  }
});
