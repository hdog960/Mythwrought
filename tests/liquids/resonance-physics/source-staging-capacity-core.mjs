import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {stageResonanceSourceStep} from '../../../src/liquids/liquid-resonance/physics/source-staging.mjs';
import {createResonanceSources} from '../../../src/liquids/liquid-resonance/physics/finite-sources.mjs';
import {RESONANCE_ID,RESONANCE_DEFINITION,ENERGY_KEY,resonanceQuantities} from '../../../src/liquids/liquid-resonance/physics/definition.mjs';

// Exact Water A 45cda7744f477de8a2d43459878e5884807aed1b engine.
if(!process.env.LIQUID_ENGINE_MODULE)throw new Error('Set LIQUID_ENGINE_MODULE to pinned Water A engine');
const path=resolve(process.env.LIQUID_ENGINE_MODULE),bytes=readFileSync(path);
assert.equal(createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex'),'48269883882fd04020bf3856ac1350a607f842a7');
const {createLiquidEngine}=await import(pathToFileURL(path).href);
const clone=x=>JSON.parse(JSON.stringify(x));
const sum=(resident,stock)=>[resident.cells.reduce((n,c)=>n+c.units,0)+stock.stores.reduce((n,s)=>n+s.units,0),
  resident.cells.reduce((n,c)=>n+(c.quantities[ENERGY_KEY]??0),0)+stock.stores.reduce((n,s)=>n+s.energy,0)];
function fixture(outlet,authorize=()=>true){
  const engineOptions={definitions:[RESONANCE_DEFINITION],maxCells:3,isLoaded:()=>true,isOpen:(x,y,z)=>z===0&&
    (([0,16].includes(x)&&(y===0||y===1))||(x===40&&y===0)||(x===48&&y===0))};
  const live=createLiquidEngine(engineOptions);
  for(const [x,y,units,energy] of [[0,1,4,13],[16,1,4,17],[40,0,1,2]])
    assert.equal(live.insert(x,y,0,RESONANCE_ID,units,resonanceQuantities(units,energy)),true);
  live.tick(3);
  assert.deepEqual(live.save().capacityBlocked,[[0,1,0],[16,1,0]]);
  assert.equal(live.tick().visited,0);
  const sourceOptions={authorize,sources:[{point:outlet,rate:2,target:8,store:{version:1,id:RESONANCE_ID,
    storeId:'reservoir',anchor:'anchor-reservoir',capacity:8,units:3,energy:11,revision:0}}]};
  const sourceSnapshot=createResonanceSources({...sourceOptions,engine:live}).save();
  const input={createLiquidEngine,engineOptions,sourceOptions,sourceSnapshot,resident:live.save(),stateRevision:0,expectedRevision:0};
  return {live,input};
}

test('capacity-blocked FIFO is deeply immutable in private source proposal, including coordinates',()=>{
  const {input,live}=fixture([40,0,0]);const before=clone(input.resident);
  const next=stageResonanceSourceStep(input);
  assert.deepEqual(next.receipt,{visited:1,units:2,energy:7,changed:[[40,0,0]]});
  assert.deepEqual(next.resident.capacityBlocked,before.capacityBlocked);
  assert.ok(Object.isFrozen(next.resident.capacityBlocked));
  assert.ok(next.resident.capacityBlocked.every(Object.isFrozen));
  assert.throws(()=>next.resident.capacityBlocked.pop(),TypeError);
  assert.throws(()=>{next.resident.capacityBlocked[0][0]=99;},TypeError);
  assert.deepEqual(sum(next.resident,next.sourceSnapshot),[12,43]);
  assert.deepEqual(live.save(),before);assert.deepEqual(input.resident,before);
});

test('full-cap rejected injection retains exact dormant FIFO and finite stock across serialized restore',()=>{
  const {input}=fixture([48,0,0]);const before=clone(input.resident);
  const next=stageResonanceSourceStep(input);
  assert.deepEqual(next.receipt,{visited:1,units:0,energy:0,changed:[]});
  assert.deepEqual(next.resident,before);assert.deepEqual(next.sourceSnapshot,input.sourceSnapshot);
  const restored=createLiquidEngine({...input.engineOptions,snapshot:clone(next.resident)});
  assert.equal(restored.tick().visited,0);
  const extracted=restored.extract(40,0,0,1);
  assert.equal(restored.tick(1).moved,3);
  assert.equal(restored.getCell(0,0,0).units,3);
  assert.equal(restored.getCell(16,0,0),null);
  const totals=sum(restored.save(),next.sourceSnapshot);
  assert.deepEqual([totals[0]+extracted.units,totals[1]+extracted.quantities[ENERGY_KEY]],[12,43]);
});

test('source into a dormant cell wakes only its own work, preserving unrelated FIFO and energy',()=>{
  const {input}=fixture([0,1,0]);const next=stageResonanceSourceStep(input);
  assert.deepEqual(next.resident.capacityBlocked,[[16,1,0]]);
  assert.deepEqual(next.resident.pending,[[0,1,0]]);
  assert.deepEqual(sum(next.resident,next.sourceSnapshot),[12,43]);
  const resumed=stageResonanceSourceStep({...input,resident:clone(next.resident),sourceSnapshot:clone(next.sourceSnapshot),stateRevision:1,expectedRevision:1});
  assert.deepEqual(resumed.receipt,{visited:1,units:1,energy:4,changed:[[0,1,0]]});
  assert.deepEqual(resumed.resident.capacityBlocked,[[16,1,0]]);
  assert.deepEqual(sum(resumed.resident,resumed.sourceSnapshot),[12,43]);
  assert.equal(resumed.sourceSnapshot.stores[0].units,0);
});

test('old empty snapshot keeps optional capacity queue absent and fault leaves live state untouched',()=>{
  const {input,live}=fixture([40,0,0],()=>{throw new Error('fixture');});
  const before=clone(input.resident);
  assert.throws(()=>stageResonanceSourceStep(input),e=>e.cause.cause.message==='fixture'&&e.cause.partial.units===0);
  assert.deepEqual(live.save(),before);
  const empty=stageResonanceSourceStep({...input,resident:{version:1,cells:[],pending:[]},sourceOptions:{...input.sourceOptions,authorize:()=>false}});
  assert.equal(Object.hasOwn(empty.resident,'capacityBlocked'),false);
});
