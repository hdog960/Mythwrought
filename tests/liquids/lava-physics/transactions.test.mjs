import test from 'node:test';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {LAVA_DEFINITION,WATER_LAVA_REACTION,lavaQuantities,readLavaHeat,proposeLavaCooling} from '../../../src/liquids/lava/physics/definition.mjs';
import {WATER_LAVA_SETTLEMENT_RULE,describeQuenchReceipt,describeCoolingTransaction} from '../../../src/liquids/lava/physics/transactions.mjs';

if(!process.env.LIQUID_ENGINE_MODULE)throw Error('Set LIQUID_ENGINE_MODULE to the pinned Water A engine');
const {createLiquidEngine}=await import(pathToFileURL(resolve(process.env.LIQUID_ENGINE_MODULE)).href);
const a=[0,0,0],b=[1,0,0];
const water={id:'water',gravityLimit:8,lateralLimit:4};
const world=(opts={})=>createLiquidEngine({isLoaded:()=>true,isOpen:()=>true,
  definitions:[water,LAVA_DEFINITION],reactionRules:[WATER_LAVA_SETTLEMENT_RULE],...opts});
function fill(e,n=3,m=7,h=503){assert.equal(e.insert(...a,'water',n),true);assert.equal(e.insert(...b,'lava',m,{'lava-heat':h}),true);}
const plan=e=>e.planReaction(...b,...a);
const sum=(e,id)=>e.save().cells.filter(c=>c.id===id).reduce((s,c)=>s+c.units,0);
const heat=e=>e.save().cells.filter(c=>c.id==='lava').reduce((s,c)=>s+readLavaHeat(c),0);

test('explicit settlement is opt-in; original rule remains proposal-only',()=>{
  const e=world({reactionRules:[WATER_LAVA_REACTION]});fill(e);const before=e.save();
  assert.ok(e.proposeReaction(...a,...b));assert.equal(plan(e),null);assert.deepEqual(e.save(),before);
});
test('actual core commits all 64 volume pairs with integer heat and product conservation',()=>{
  for(let n=1;n<=8;n++)for(let m=1;m<=8;m++){
    const e=world(),h=m*79-1,k=Math.min(n,m);fill(e,n,m,h);const before=e.save(),p=plan(e);
    assert.deepEqual(e.save(),before);assert.equal(p.routeA,'product');assert.equal(p.routeB,'product');
    const predicted=describeQuenchReceipt(p);assert.ok(predicted);
    const r=e.commitReaction(p),l=describeQuenchReceipt(r);assert.deepEqual(l,predicted);
    assert.equal(l.steamUnits,k);assert.equal(l.solidUnits,k);assert.equal(l.releasedHeat,Math.floor(h*k/m));
    assert.equal(sum(e,'water')+l.steamUnits,n);assert.equal(sum(e,'lava')+l.solidUnits,m);
    assert.equal(heat(e)+l.releasedHeat,h);assert.equal(l.fullVoxelCandidate,k===8);
    assert.deepEqual(l.at,b);assert.equal(e.commitReaction(p),null);
  }
});
test('foreign extensive quantities refuse settlement instead of losing data',()=>{
  const e=world();e.insert(...a,'water',3,{trace:1});e.insert(...b,'lava',3,lavaQuantities(3));
  const before=e.save();assert.equal(plan(e),null);assert.deepEqual(e.save(),before);
  const f=world();f.insert(...a,'water',3);f.insert(...b,'lava',3,{'lava-heat':100,trace:1});
  const s=f.save();assert.equal(plan(f),null);assert.deepEqual(f.save(),s);
});
test('stale or unloaded quench cannot consume inputs',()=>{
  let loaded=true;const e=world({isLoaded:x=>x!==1||loaded});fill(e);let p=plan(e);loaded=false;
  const before=e.save();assert.equal(e.commitReaction(p),null);assert.deepEqual(e.save(),before);loaded=true;
  p=plan(e);e.extract(...b,1);const next=e.save();assert.equal(e.commitReaction(p),null);assert.deepEqual(e.save(),next);
});
test('receipt ledger rejects wrong pair, mismatch, wrong location and unknown product',()=>{
  const e=world();fill(e);const r=e.commitReaction(plan(e)),[w,l]=r.productInputs;
  for(const bad of [{...r,product:'other'},{...r,productInputs:[l,w]},
    {...r,productInputs:[w,{...l,units:2}]},{...r,productInputs:[w,{...l,x:2}]},
    {...r,changed:[a,a]},{...r,productInputs:[w,{...l,quantities:{'lava-heat':301}}]}])assert.equal(describeQuenchReceipt(bad),null);
  assert.ok(Object.isFrozen(describeQuenchReceipt(r)));assert.ok(Object.isFrozen(describeQuenchReceipt(r).at));
});
test('staged state and receipt can be saved together; active engine stays untouched',()=>{
  const active=world();fill(active);const before=active.save(),staged=world({snapshot:JSON.parse(JSON.stringify(before))});
  const r=staged.commitReaction(plan(staged));const persisted=JSON.parse(JSON.stringify({liquid:staged.save(),receipt:r}));
  const restored=world({snapshot:persisted.liquid});assert.deepEqual(active.save(),before);
  const ledger=describeQuenchReceipt(persisted.receipt);assert.equal(sum(restored,'lava')+ledger.solidUnits,7);
  assert.equal(heat(restored)+ledger.releasedHeat,503);assert.equal(plan(restored),null);
});
const host=(e,opts={})=>({engine:e,isLoaded:()=>true,isOpen:()=>true,canCool:()=>true,...opts});
test('cooling ledger preserves volume and exact residual heat without modifying engine',()=>{
  const e=world();e.insert(...b,'lava',7,{'lava-heat':503});const c=e.getCell(...b),p=proposeLavaCooling(c),before=e.save();
  const tx=describeCoolingTransaction(host(e),p);assert.equal(tx.before,c);assert.equal(tx.after.units,7);
  assert.equal(readLavaHeat(tx.after)+tx.ledger.releasedHeat,503);assert.equal(tx.ledger.solidUnits,0);
  assert.deepEqual(e.save(),before);assert.ok(Object.isFrozen(tx.after.quantities));
});
test('cold partial mass never authorizes a full voxel; full mass only a candidate',()=>{
  for(const n of [1,3,8]){const e=world();e.insert(...b,'lava',n,lavaQuantities(n,2));const c=e.getCell(...b);
    const tx=describeCoolingTransaction(host(e),proposeLavaCooling(c));assert.equal(tx.after,null);
    assert.equal(tx.ledger.solidUnits,n);assert.equal(tx.ledger.releasedHeat,2*n);
    assert.equal(tx.ledger.fullVoxelCandidate,n===8);assert.equal(e.getCell(...b),c);}
});
test('cooling declines changed cell, host eligibility or forged policy',()=>{
  const e=world();e.insert(...b,'lava',4,lavaQuantities(4));const p=proposeLavaCooling(e.getCell(...b));
  for(const cb of ['isLoaded','isOpen','canCool'])assert.equal(describeCoolingTransaction(host(e,{[cb]:()=>false}),p),null);
  assert.equal(describeCoolingTransaction(host(e),{...p,releasedHeat:17}),null);
  assert.equal(describeCoolingTransaction(host(e),p,{lossPerUnit:1}),null);
  const before=e.save();assert.equal(describeCoolingTransaction(host(world({snapshot:before})),p),null);
  e.extract(...b,1);assert.equal(describeCoolingTransaction(host(e),p),null);
});
