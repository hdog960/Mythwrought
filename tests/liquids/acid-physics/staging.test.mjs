import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {ACID_DEFINITION,acidQuantities,readAcidStrength} from '../../../src/liquids/acid/physics/definition.mjs';
import {createAcidWaterRule} from '../../../src/liquids/acid/physics/definition.mjs';
import {createAcidReactionScheduler} from '../../../src/liquids/acid/physics/reaction-scheduler.mjs';
import {createAcidCorrosion} from '../../../src/liquids/acid/physics/corrosion.mjs';
import {stageAcidBoundary} from '../../../src/liquids/acid/physics/staging.mjs';
const corePath=process.env.LIQUID_ENGINE_MODULE;
if(!corePath)throw Error('LIQUID_ENGINE_MODULE must name the pinned shared engine');
const bytes=readFileSync(corePath);
assert.equal(createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex'),'ac9dfb9e85e99cce81ffc6a4aabe8b2f6f2b764b');
const {createLiquidEngine}=await import(pathToFileURL(resolve(corePath)).href);
const key=p=>p.join(','),a=[0,0,0],b=[1,0,0],c=[-1,0,0],stone=[0,0,1],stone2=[0,0,-1];
const copy=v=>JSON.parse(JSON.stringify(v));
function fixture({water=2,otherWater=0,enabled=true,maxPairs=1024,maxTracked=1024,extraStone=false}={}){
  let revision=7,protectedBuild=false,failRead=false;
  const isLoaded=()=>true,isOpen=(...p)=>[a,b,c].some(q=>key(q)===key(p));
  const engineOptions={isLoaded,isOpen,definitions:[ACID_DEFINITION,{id:'water',gravityLimit:8,lateralLimit:4}],
    reactionRules:[createAcidWaterRule({allowSettlement:enabled})]};
  const engine=createLiquidEngine(engineOptions);
  assert.ok(engine.insert(...a,'acid',3,{...acidQuantities(3),trace:7}));
  if(water)assert.ok(engine.insert(...b,'water',water));
  if(otherWater)assert.ok(engine.insert(...c,'water',otherWater));
  const reactionOptions={enabled,policyId:'acid-stage-fixture',maxPairs};
  const corrosionOptions={enabled,policyId:'acid-stage-fixture',maxTracked,
    rules:[{material:'fixture-stone',minStrength:400,threshold:600}],
    readMaterial:(...p)=>{if(failRead)throw Error('read fault');return key(p)===key(stone)||extraStone&&key(p)===key(stone2)?
      {id:'fixture-stone',revision:'r1',protected:protectedBuild}:null;},canDamage:()=>true};
  const scheduler=createAcidReactionScheduler({...reactionOptions,engine,isLoaded,isOpen});
  const corrosion=createAcidCorrosion({...corrosionOptions,engine,isLoaded,isOpen});
  const state={version:1,revision,engine:engine.save(),scheduler:scheduler.save(),corrosion:corrosion.save()};
  const opts={state,expectedRevision:revision,readRevision:()=>revision,createLiquidEngine,engineOptions,reactionOptions,corrosionOptions,changed:[a],reactionVisits:2,corrosionVisits:2};
  return {state,engine,opts,revision:n=>revision=n,protect:()=>protectedBuild=true,fail:()=>failRead=true};
}
function totals(s){return s.cells.reduce(([u,q,t],c)=>[u+c.units,q+(c.quantities['acid-solute']??0),t+(c.quantities.trace??0)],[0,0,0]);}
test('actual staged dilution reconciles both ledgers before corrosion; original state untouched',()=>{
  const f=fixture(),before=copy(f.state),r=stageAcidBoundary(f.opts);
  assert.equal(r.status,'staged');assert.equal(r.next.revision,8);assert.equal(r.reactions,1);assert.equal(r.waterUnits,2);
  assert.deepEqual(r.changed,[a,b]);assert.deepEqual(r.corrosionPreviews,[]);
  assert.deepEqual(r.next.scheduler.pairs,[]);assert.deepEqual(r.next.corrosion.entries,[]);
  assert.deepEqual(totals(r.next.engine),[5,1800,7]);assert.equal(readAcidStrength(r.next.engine.cells[0]),360);
  assert.deepEqual(f.state,before);assert.deepEqual(f.engine.save(),before.engine);
  assert.ok(Object.isFrozen(r.next)&&Object.isFrozen(r.next.engine.cells)&&Object.isFrozen(r.changed[0]));
});
test('reaction admission overflow rejects without advancing either ledger',()=>{
  const f=fixture({otherWater:2,maxPairs:1}),before=copy(f.state);
  assert.equal(stageAcidBoundary(f.opts).reason,'reaction-backpressure');assert.deepEqual(f.state,before);
});
test('corrosion admission overflow rolls back already staged reaction admission',()=>{
  const f=fixture({extraStone:true,maxTracked:1}),before=copy(f.state);
  assert.equal(stageAcidBoundary(f.opts).reason,'corrosion-backpressure');assert.deepEqual(f.state,before);
});
test('output capacity rejection after actual settlement leaves no adopted partial state',()=>{
  const f=fixture(),before=copy(f.state),r=stageAcidBoundary({...f.opts,maxOutputChanged:1});
  assert.deepEqual(r,{status:'rejected',reason:'output-dirty-budget',expectedRevision:7});
  assert.deepEqual(f.state,before);assert.deepEqual(f.engine.save(),before.engine);
});
test('stale revision rejects before host reads and after staged work',()=>{
  const f=fixture(),before=copy(f.state);f.revision(8);f.fail();
  assert.equal(stageAcidBoundary(f.opts).reason,'stale-revision');
  f.revision(7);let reads=0;
  const g=fixture(),r=stageAcidBoundary({...g.opts,readRevision:()=>++reads===1?7:8});
  assert.equal(r.reason,'stale-revision');assert.deepEqual(g.state,before);
});
test('faults and incomplete or mismatched ledgers fail closed',()=>{
  const f=fixture(),before=copy(f.state);f.fail();assert.throws(()=>stageAcidBoundary(f.opts),/read fault/);
  assert.deepEqual(f.state,before);
  assert.throws(()=>stageAcidBoundary({...f.opts,state:{...f.state,corrosion:null}}),TypeError);
  assert.throws(()=>stageAcidBoundary({...f.opts,reactionOptions:{...f.opts.reactionOptions,policyId:'changed'}}),TypeError);
  assert.throws(()=>stageAcidBoundary({...f.opts,state:{...f.state,parked:[]}}),TypeError);
  assert.equal(stageAcidBoundary({...f.opts,maxStageCells:1}).reason,'resident-staging-budget');
});
test('changed owner settlement rejects the entire candidate on actual core',()=>{
  const f=fixture(),before=copy(f.state),rule=createAcidWaterRule({allowSettlement:true});let calls=0;
  const engineOptions={...f.opts.engineOptions,reactionRules:[{...rule,settle:p=>++calls===1?rule.settle(p):null}]};
  assert.equal(stageAcidBoundary({...f.opts,engineOptions}).reason,'stale-reaction');
  assert.deepEqual(f.state,before);assert.deepEqual(f.engine.save(),before.engine);
});
test('corrosion previews are read-only and never carry proposal capabilities',()=>{
  const f=fixture({water:0}),r=stageAcidBoundary(f.opts);
  assert.equal(r.status,'staged');assert.equal(r.corrosionPreviews.length,1);
  assert.deepEqual(r.corrosionPreviews[0],{target:stone,material:'fixture-stone',revision:'r1',progress:600,peakStrength:600});
  assert.equal(r.next.corrosion.entries[0].progress,600);assert.deepEqual(r.next.engine,f.state.engine);
  f.protect();const protectedResult=stageAcidBoundary(f.opts);assert.deepEqual(protectedResult.corrosionPreviews,[]);
});
test('competing contacts resume deterministically across JSON state adoption',()=>{
  const f=fixture({water:4,otherWater:4}),r=stageAcidBoundary(f.opts);
  assert.equal(r.reactions,1);f.revision(8);
  const opts={...f.opts,state:r.next,expectedRevision:8,changed:[]};
  const next=stageAcidBoundary(opts),restored=stageAcidBoundary({...opts,state:copy(r.next)});
  assert.deepEqual(next,restored);assert.equal(next.reactions,1);assert.deepEqual(totals(next.next.engine),[11,1800,7]);
});
test('disabled policies do not schedule dilution or corrosion; zero visits only tracks',()=>{
  const f=fixture({enabled:false}),r=stageAcidBoundary(f.opts);
  assert.equal(r.reactions,0);assert.deepEqual(r.corrosionPreviews,[]);assert.deepEqual(r.next.engine,f.state.engine);
  const g=fixture(),q=stageAcidBoundary({...g.opts,reactionVisits:0,corrosionVisits:0});
  assert.equal(q.reactions,0);assert.equal(q.next.scheduler.pairs.length,1);assert.equal(q.next.corrosion.entries[0].progress,0);
});
