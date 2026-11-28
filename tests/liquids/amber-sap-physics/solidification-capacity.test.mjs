import test from 'node:test';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {createSapCuring} from '../../../src/liquids/amber-sap/physics/curing.mjs';
import {createSapSolidification} from '../../../src/liquids/amber-sap/physics/solidification.mjs';
if(!process.env.LIQUID_ENGINE_MODULE)throw Error('Pinned Water A engine required');
const {createLiquidEngine}=await import(pathToFileURL(resolve(process.env.LIQUID_ENGINE_MODULE)).href);
const sap={id:'amber-sap',gravityLimit:1,lateralLimit:1};
const volume=s=>s.cells.reduce((sum,c)=>sum+c.units,0);
const trace=s=>s.cells.reduce((sum,c)=>sum+(c.quantities.trace??0),0);
function fixture(xs,{originCanDrain=false}={}){
  const config={definitions:[sap],maxCells:xs.length,maxVisits:16,isLoaded:()=>true,
    isOpen:(x,y,z)=>z===0&&xs.includes(x)&&(y===1||(y===0&&(x!==0||originCanDrain)))};
  const engine=createLiquidEngine(config);
  for(const x of xs)assert.equal(engine.insert(x,1,0,'amber-sap',8,x===0?{}:{trace:17}),true);
  assert.equal(engine.tick().moved,0);
  const curing=createSapCuring({engine,...config,enabled:true,dwellVisits:1,canCure:c=>c.x===0});
  curing.track(0,1,0);
  const proposal=curing.step().proposals[0];
  const adapter=createSapSolidification({createLiquidEngine,...config,enabled:true,canPlaceAmber:()=>true});
  return {engine,curing,config,stage:()=>adapter.stage({engine,curing,proposal,solid:{version:1,cells:[]},revision:0})};
}
test('solidification preserves remote dormant FIFO and capacity release resumes actual core flow after reload',()=>{
  const f=fixture([0,10,20]),before=f.engine.save();
  assert.deepEqual(before.capacityBlocked,[[10,1,0],[20,1,0]]);
  assert.equal(f.engine.tick().visited,0);
  const r=f.stage();assert.deepEqual(f.engine.save(),before);
  assert.deepEqual(r.resident.capacityBlocked,[[10,1,0],[20,1,0]]);
  assert.ok(Object.isFrozen(r.resident.capacityBlocked)&&r.resident.capacityBlocked.every(Object.isFrozen));
  assert.equal(volume(r.resident)+volume(r.solid),24);
  const restored=createLiquidEngine({...f.config,snapshot:JSON.parse(JSON.stringify(r.resident))});
  assert.equal(restored.tick(1).moved,1);
  assert.equal(restored.getCell(10,0,0).units,1);
  assert.equal(restored.getCell(20,0,0),null);
  assert.equal(trace(restored.save()),34);
  assert.equal(volume(restored.save())+volume(r.solid),24);
  assert.deepEqual(restored.save().capacityBlocked,[[20,1,0]]);
});
test('conversion removes its own dormant row and respects core promotion of adjacent dormant work',()=>{
  const f=fixture([0,1,10],{originCanDrain:true}),before=f.engine.save();
  assert.deepEqual(before.capacityBlocked,[[0,1,0],[1,1,0],[10,1,0]]);
  const r=f.stage();assert.deepEqual(f.engine.save(),before);
  assert.deepEqual(r.resident.capacityBlocked,[[10,1,0]]);
  assert.deepEqual(r.resident.pending,[[1,1,0]]);
  assert.equal(volume(r.resident)+volume(r.solid),24);
});
test('no dormant work after consuming the only blocked cell preserves legacy snapshot shape',()=>{
  const f=fixture([0],{originCanDrain:true});
  assert.deepEqual(f.engine.save().capacityBlocked,[[0,1,0]]);
  const r=f.stage();assert.deepEqual(r.resident,{version:1,cells:[],pending:[]});
  assert.equal(volume(r.solid),8);
});
