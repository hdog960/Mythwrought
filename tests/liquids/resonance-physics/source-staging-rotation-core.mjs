import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {stageResonanceSourceStep} from '../../../src/liquids/liquid-resonance/physics/source-staging.mjs';
import {createResonanceSources} from '../../../src/liquids/liquid-resonance/physics/finite-sources.mjs';
import {RESONANCE_ID,RESONANCE_DEFINITION,ENERGY_KEY,resonanceQuantities} from '../../../src/liquids/liquid-resonance/physics/definition.mjs';

// Exact Water A 3936971ba797862bfef2ac596c46966f1911e81a engine.
if(!process.env.LIQUID_ENGINE_MODULE)throw new Error('Set LIQUID_ENGINE_MODULE to pinned Water A engine');
const path=resolve(process.env.LIQUID_ENGINE_MODULE),bytes=readFileSync(path);
assert.equal(createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex'),'b0ce6f804c111cc2a0a9cf6c835fc75fde45eaa5');
const {createLiquidEngine}=await import(pathToFileURL(path).href);
const clone=x=>JSON.parse(JSON.stringify(x));
function fixture(authorize=()=>true){
  const engineOptions={definitions:[RESONANCE_DEFINITION],lateralOrder:'rotating',maxCells:16,
    isLoaded:()=>true,isOpen:(x,y,z)=>y===0&&z===0&&[0,1,16,17,32].includes(x)};
  const live=createLiquidEngine(engineOptions);
  for(const x of [0,16])assert.equal(live.insert(x,0,0,RESONANCE_ID,8,resonanceQuantities(8,19)),true);
  live.tick(2);
  assert.deepEqual(live.save().lateralPhases,[[0,0,0,1],[16,0,0,1]]);
  const sourceOptions={authorize,sources:[{point:[0,0,0],rate:2,target:8,store:{version:1,id:RESONANCE_ID,
    storeId:'reservoir',anchor:'anchor-reservoir',capacity:8,units:3,energy:11,revision:0}}]};
  const sourceSnapshot=createResonanceSources({...sourceOptions,engine:live}).save();
  const input={createLiquidEngine,engineOptions,sourceOptions,sourceSnapshot,resident:live.save(),stateRevision:0,expectedRevision:0};
  return {live,input};
}
const totals=(s,stock)=>[s.cells.reduce((n,c)=>n+c.units,0)+stock.stores.reduce((n,c)=>n+c.units,0),
  s.cells.reduce((n,c)=>n+(c.quantities[ENERGY_KEY]??0),0)+stock.stores.reduce((n,c)=>n+c.energy,0)];
test('rotating phase rows are immutable in staged source result and preserve live state',()=>{
  const {live,input}=fixture(),before=clone(input.resident),next=stageResonanceSourceStep(input);
  assert.deepEqual(next.receipt,{visited:1,units:2,energy:7,changed:[[0,0,0]]});
  assert.deepEqual(next.resident.lateralPhases,before.lateralPhases);
  assert.ok(Object.isFrozen(next.resident.lateralPhases));
  assert.ok(next.resident.lateralPhases.every(Object.isFrozen));
  assert.throws(()=>next.resident.lateralPhases.pop(),TypeError);
  assert.throws(()=>{next.resident.lateralPhases[0][3]=3;},TypeError);
  assert.deepEqual(live.save(),before);
  assert.deepEqual(input.resident,before);
  assert.deepEqual(totals(next.resident,next.sourceSnapshot),[19,49]);
});
test('rotating metadata and exact future flow survive serial source adoption',()=>{
  const {input}=fixture(),next=stageResonanceSourceStep(input);
  const a=createLiquidEngine({...input.engineOptions,snapshot:next.resident});
  const b=createLiquidEngine({...input.engineOptions,snapshot:clone(next.resident)});
  for(let i=0;i<12;i++){assert.deepEqual(a.tick(1),b.tick(1));assert.deepEqual(a.save(),b.save());}
  assert.deepEqual(totals(b.save(),next.sourceSnapshot),[19,49]);
});
test('fixed mode preserves existing phase and empty legacy snapshots omit it',()=>{
  const {input}=fixture(()=>false);
  const fixed=stageResonanceSourceStep({...input,engineOptions:{...input.engineOptions,lateralOrder:'fixed'}});
  assert.deepEqual(fixed.resident.lateralPhases,input.resident.lateralPhases);
  const empty=stageResonanceSourceStep({...input,resident:{version:1,cells:[],pending:[]}});
  assert.equal(Object.hasOwn(empty.resident,'lateralPhases'),false);
});
test('invalid phase metadata and authorization faults cannot mutate live inventory or queue',()=>{
  const {input,live}=fixture(()=>{throw new Error('fixture');}),before=clone(input.resident),stock=clone(input.sourceSnapshot);
  assert.throws(()=>stageResonanceSourceStep({...input,resident:{...before,lateralPhases:[[0,0,0,4]]}}));
  assert.throws(()=>stageResonanceSourceStep(input),e=>e.cause.cause.message==='fixture'&&e.cause.partial.units===0);
  assert.deepEqual(live.save(),before);assert.deepEqual(input.sourceSnapshot,stock);
});
