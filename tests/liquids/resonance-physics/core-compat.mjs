import test from 'node:test';
import assert from 'node:assert/strict';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {RESONANCE_ID as id,ENERGY_KEY as key,RESONANCE_DEFINITION,resonanceQuantities,readResonanceCell,resonanceExposure} from '../../../src/liquids/liquid-resonance/physics/definition.mjs';
import {planResonanceCellExchange as plan} from '../../../src/liquids/liquid-resonance/physics/cell-exchange.mjs';
// Explicit external pinned dependency; do not vendor Water A's engine.
if (!process.env.LIQUID_ENGINE_MODULE) throw Error('Set LIQUID_ENGINE_MODULE to pinned Water A engine.mjs');
const {createLiquidEngine}=await import(pathToFileURL(resolve(process.env.LIQUID_ENGINE_MODULE)).href);
const fixture=(over={})=>createLiquidEngine({isLoaded:()=>true,isOpen:(x,y,z)=>x>=-17&&x<=-14&&y>=254&&y<=256&&z===0,
  definitions:[RESONANCE_DEFINITION,{id:'water',gravityLimit:8,lateralLimit:4}],maxVisits:7,...over});
const totals=e=>e.save().cells.filter(c=>c.id===id).reduce(([u,q],c)=>{readResonanceCell(c);return [u+c.units,q+(c.quantities[key]??0)];},[0,0]);
test('actual core gravity moves three units with exact energy and distinct identity',()=>{
  const e=fixture();assert.ok(e.insert(-16,256,0,id,8,resonanceQuantities(8,37)));
  assert.equal(e.tick(1).moved,3);assert.equal(e.getCell(-16,255,0).quantities[key],13);
  assert.deepEqual(totals(e),[8,37]);assert.equal(e.insert(-16,255,0,'water',1),false);
});
test('actual core lateral transfer budget and 300 visits conserve valid density',()=>{
  const e=fixture({isOpen:(x,y,z)=>y===256&&z===0&&x>=-17&&x<=-14});
  e.insert(-16,256,0,id,8,resonanceQuantities(8,8191));
  assert.equal(e.tick(1).moved,5);
  for(let i=0;i<300;i++){assert.ok(e.tick().visited<=7);assert.deepEqual(totals(e),[8,8191]);}
});
test('actual core boundary unload defers flow and snapshot preserves exact replay',()=>{
  let loaded=false;const opts={isLoaded:x=>x<-16||loaded,isOpen:(x,y,z)=>y===256&&z===0&&(x===-17||x===-16)};
  const e=fixture(opts);e.insert(-17,256,0,id,8,resonanceQuantities(8,97));e.tick();
  assert.equal(e.getCell(-16,256,0),null);
  const f=fixture({...opts,snapshot:JSON.parse(JSON.stringify(e.save()))});loaded=true;
  e.wake(-16,256,0);f.wake(-16,256,0);
  for(let i=0;i<10;i++){assert.deepEqual(e.tick(),f.tick());assert.deepEqual(e.save(),f.save());}
  assert.deepEqual(totals(e),[8,97]);assert.equal(e.getCell(-16,256,0).units,4);
  assert.equal(resonanceExposure(e.samplePoint(-15.5,256.25,.5)).contact,true);
  loaded=false;assert.equal(resonanceExposure(e.samplePoint(-15.5,256.25,.5)).contact,false);
});
test('actual core extraction arithmetic agrees with pure collection proposal',()=>{
  const e=fixture();e.insert(-16,256,0,id,7,resonanceQuantities(7,19));
  const p=plan({direction:'collect',point:[-16,256,0],cell:e.getCell(-16,256,0),ownerKey:'fixture',cellRevision:'1',
    store:{version:1,id,storeId:'tank',anchor:'a',capacity:8,units:0,energy:0,revision:0},storeAnchor:'a',
    permitted:true,loaded:true,open:true,contained:true,requested:3,maxPerVisit:8});
  // Fixture only: not an atomic store/core runtime commit.
  const got=e.extract(-16,256,0,p.units);assert.equal(got.quantities[key],p.energy);
  assert.deepEqual(e.getCell(-16,256,0),p.nextCell);assert.deepEqual(totals(e),[4,11]);
});
