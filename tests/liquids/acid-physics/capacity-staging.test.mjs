import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {ACID_DEFINITION,ACID_SOLUTE,acidQuantities,readAcidStrength,createAcidWaterRule} from '../../../src/liquids/acid/physics/definition.mjs';
import {createAcidReactionScheduler} from '../../../src/liquids/acid/physics/reaction-scheduler.mjs';
import {createAcidCorrosion} from '../../../src/liquids/acid/physics/corrosion.mjs';
import {stageAcidBoundary} from '../../../src/liquids/acid/physics/staging.mjs';

// Water A capacity-retry extension, pinned independently of historical fixtures.
const path=process.env.LIQUID_ENGINE_MODULE;
if(!path)throw Error('LIQUID_ENGINE_MODULE must name the pinned shared engine');
const bytes=readFileSync(resolve(path));
assert.equal(createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex'),'48269883882fd04020bf3856ac1350a607f842a7');
const {createLiquidEngine}=await import(pathToFileURL(resolve(path)).href);
const dormant=[10,1,0],target=[0,0,1];
const same=(a,b)=>a.join(',')===b.join(',');
const isLoaded=()=>true;
const isOpen=(x,y,z)=>z===0&&((y===0&&(x===0||x===1))||(x===10&&(y===0||y===1)));
const engineOptions={isLoaded,isOpen,maxCells:3,definitions:[ACID_DEFINITION,{id:'water',gravityLimit:8,lateralLimit:4}],reactionRules:[createAcidWaterRule({allowSettlement:true})]};
const reactionOptions={enabled:true,policyId:'acid-capacity-test'};
const corrosionOptions={enabled:true,policyId:'acid-capacity-test',rules:[{material:'fixture',minStrength:500,threshold:1000}],readMaterial:(...p)=>same(p,target)?{id:'fixture',revision:'one',protected:false}:null,canDamage:()=>true};
const totals=e=>e.save().cells.reduce(([v,s],c)=>[v+c.units,s+(c.quantities[ACID_SOLUTE]??0)],[0,0]);
function fixture(waterUnits){
  const e=createLiquidEngine(engineOptions);
  assert.equal(e.insert(...dormant,'acid',8,acidQuantities(8)),true);
  assert.equal(e.insert(0,0,0,'acid',3,acidQuantities(3)),true);
  assert.equal(e.insert(1,0,0,'water',waterUnits),true);
  e.tick();
  assert.deepEqual(e.save().capacityBlocked,[dormant]);
  assert.equal(e.tick().visited,0);
  const scheduler=createAcidReactionScheduler({...reactionOptions,engine:e,isLoaded,isOpen});
  const corrosion=createAcidCorrosion({...corrosionOptions,engine:e,isLoaded,isOpen});
  assert.ok(scheduler.trackChanges([[0,0,0],[1,0,0]]));
  assert.ok(corrosion.trackChanges([[0,0,0]]));
  assert.equal(corrosion.step(1).proposals.length,0);
  const state={version:1,revision:4,engine:e.save(),scheduler:scheduler.save(),corrosion:corrosion.save()};
  assert.equal(state.corrosion.entries[0].progress,600);
  return {e,state};
}
function stage(state,over={}){
  return stageAcidBoundary({state,expectedRevision:4,readRevision:()=>4,createLiquidEngine,engineOptions,reactionOptions,corrosionOptions,reactionVisits:1,corrosionVisits:1,...over});
}

test('complete staged dilution frees a distant dormant acid cell without losing its FIFO or solute',()=>{
  const {e,state}=fixture(2),before=JSON.stringify(state);
  const result=stage(state);
  assert.equal(result.status,'staged');assert.equal(result.reactions,1);assert.equal(result.waterUnits,2);
  assert.deepEqual(result.next.engine.capacityBlocked,[dormant]);
  assert.deepEqual(result.next.corrosion.entries,[]);assert.deepEqual(result.corrosionPreviews,[]);
  assert.equal(JSON.stringify(state),before);assert.deepEqual(e.save(),state.engine);
  const restored=createLiquidEngine({...engineOptions,snapshot:JSON.parse(JSON.stringify(result.next.engine))});
  assert.equal(readAcidStrength(restored.getCell(0,0,0)),360);
  assert.equal(restored.getCell(1,0,0),null);assert.deepEqual(totals(restored),[13,6600]);
  const tick=restored.tick(1);
  assert.equal(tick.visited,1);assert.equal(tick.moved,6);
  assert.deepEqual(tick.changed,[dormant,[10,0,0]]);
  assert.equal(restored.getCell(10,0,0).units,6);assert.deepEqual(totals(restored),[13,6600]);
});

test('partial staged dilution leaves the resident cap full and remote dormant work intact',()=>{
  const {state}=fixture(3),result=stage(state);
  assert.equal(result.status,'staged');assert.equal(result.waterUnits,2);
  const restored=createLiquidEngine({...engineOptions,snapshot:result.next.engine});
  assert.equal(restored.getCell(1,0,0).units,1);assert.deepEqual(totals(restored),[14,6600]);
  for(let i=0;i<4;i++)assert.equal(restored.tick().moved,0);
  assert.equal(restored.tick().visited,0);assert.deepEqual(restored.save().capacityBlocked,[dormant]);
  assert.equal(restored.getCell(...dormant).units,8);
});

test('rejected staged dilution preserves both ledgers and the original dormant queue for retry',()=>{
  const {e,state}=fixture(2),before=JSON.stringify(state);
  const rejected=stage(state,{maxOutputChanged:1});
  assert.deepEqual(rejected,{status:'rejected',reason:'output-dirty-budget',expectedRevision:4});
  assert.equal(JSON.stringify(state),before);assert.deepEqual(e.save(),state.engine);
  assert.deepEqual(e.save().capacityBlocked,[dormant]);
  assert.deepEqual(stage(state),stage(JSON.parse(before)));
});
