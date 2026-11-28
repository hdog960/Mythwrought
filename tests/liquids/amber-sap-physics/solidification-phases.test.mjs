import test from 'node:test';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {createSapCuring} from '../../../src/liquids/amber-sap/physics/curing.mjs';
import {createSapSolidification} from '../../../src/liquids/amber-sap/physics/solidification.mjs';
if(!process.env.LIQUID_ENGINE_MODULE)throw Error('Pinned Water A engine required');
const {createLiquidEngine}=await import(pathToFileURL(resolve(process.env.LIQUID_ENGINE_MODULE)).href);
const sap={id:'amber-sap',gravityLimit:1,lateralLimit:1};
const water={id:'water',gravityLimit:8,lateralLimit:1};
const cell=(x,id,units,quantities={})=>({x,y:0,z:0,id,units,quantities});
const volume=s=>s.cells.reduce((n,c)=>n+c.units,0);
function fixture({phases=[[0,0,0,3],[10,0,0,1],[20,0,0,2]],lateralOrder='rotating',dormant=false}={}){
  const config={definitions:[sap,water],lateralOrder,maxCells:16,maxVisits:4,isLoaded:()=>true,
    isOpen:(x,y,z)=>y===0&&((z===0&&[0,10,11,20].includes(x))||(x===10&&z===1))};
  const snapshot={version:1,cells:[cell(0,'amber-sap',8),cell(10,'water',8,{trace:17}),cell(20,'water',2)],
    pending:[[10,0,0]],...(phases.length?{lateralPhases:phases}:{}),...(dormant?{capacityBlocked:[[20,0,0]]}:{})};
  const engine=createLiquidEngine({...config,snapshot});
  const curing=createSapCuring({engine,...config,enabled:true,dwellVisits:1,canCure:c=>c.x===0});
  curing.track(0,0,0);const proposal=curing.step().proposals[0];
  const adapter=createSapSolidification({createLiquidEngine,...config,enabled:true,canPlaceAmber:()=>true});
  return {config,engine,stage:()=>adapter.stage({engine,curing,proposal,solid:{version:1,cells:[]},revision:0})};
}
test('solidification retains unrelated phases in exact order, removes the consumed phase and resumes rotating flow',()=>{
  const f=fixture(),before=f.engine.save();
  const reference=createLiquidEngine({...f.config,snapshot:before});reference.extract(0,0,0,8);
  const r=f.stage();assert.deepEqual(f.engine.save(),before);
  assert.deepEqual(r.resident,reference.save());
  assert.deepEqual(r.resident.lateralPhases,[[10,0,0,1],[20,0,0,2]]);
  assert.ok(Object.isFrozen(r.resident.lateralPhases)&&r.resident.lateralPhases.every(Object.isFrozen));
  const restored=createLiquidEngine({...f.config,snapshot:JSON.parse(JSON.stringify(r.resident))});
  assert.deepEqual(restored.tick(1),reference.tick(1));assert.deepEqual(restored.save(),reference.save());
  assert.equal(restored.getCell(10,0,1).units,1);assert.equal(restored.getCell(11,0,0),null);
  assert.equal(volume(restored.save())+volume(r.solid),18);
  assert.equal(restored.save().cells.reduce((n,c)=>n+(c.quantities.trace??0),0),17);
});
test('fixed-mode reads retain dormant FIFO and rotating metadata for later opt-in',()=>{
  const f=fixture({lateralOrder:'fixed',dormant:true}),before=f.engine.save(),r=f.stage();
  assert.deepEqual(r.resident.capacityBlocked,[[20,0,0]]);
  assert.deepEqual(r.resident.lateralPhases,[[10,0,0,1],[20,0,0,2]]);
  assert.deepEqual(f.engine.save(),before);
  const restored=createLiquidEngine({...f.config,lateralOrder:'rotating',snapshot:JSON.parse(JSON.stringify(r.resident))});
  assert.deepEqual(restored.save(),r.resident);
});
test('consuming the only phase omits the optional field and legacy snapshots stay legacy',()=>{
  for(const phases of [[[0,0,0,3]],[]]){
    const f=fixture({phases}),r=f.stage();
    assert.equal(Object.hasOwn(r.resident,'lateralPhases'),false);
    assert.equal(volume(r.resident)+volume(r.solid),18);
  }
});
