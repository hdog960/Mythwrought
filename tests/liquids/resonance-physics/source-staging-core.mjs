import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {stageResonanceSourceStep as stage} from '../../../src/liquids/liquid-resonance/physics/source-staging.mjs';
import {createResonanceSources} from '../../../src/liquids/liquid-resonance/physics/finite-sources.mjs';
import {RESONANCE_DEFINITION,RESONANCE_ID as id,ENERGY_KEY as key} from '../../../src/liquids/liquid-resonance/physics/definition.mjs';
// Exact engine blob unchanged at Water A adb84af65424f36f89ee3bb10c602338f71a3924.
if(!process.env.LIQUID_ENGINE_MODULE)throw Error('Set LIQUID_ENGINE_MODULE to pinned shared engine');
const file=resolve(process.env.LIQUID_ENGINE_MODULE),bytes=readFileSync(file);
assert.equal(createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex'),
  'ac9dfb9e85e99cce81ffc6a4aabe8b2f6f2b764b');
const {createLiquidEngine}=await import(pathToFileURL(file).href);
const clone=x=>JSON.parse(JSON.stringify(x));
const source=(x,energy=19)=>({point:[x,0,0],rate:2,target:8,
  store:{version:1,id,storeId:'s'+x,anchor:'a'+x,capacity:8,units:7,energy,revision:0}});
function fixture({engineOptions={},sourceOptions={}}={}){
  const eo={definitions:[RESONANCE_DEFINITION,{id:'water',gravityLimit:8,lateralLimit:4}],
    isLoaded:()=>true,isOpen:()=>true,...engineOptions};
  const so={sources:[source(0),source(1)],authorize:()=>true,...sourceOptions};
  const live=createLiquidEngine(eo),scheduler=createResonanceSources({...so,engine:live});
  return {live,scheduler,request:()=>({createLiquidEngine,engineOptions:eo,sourceOptions:so,
    resident:live.save(),sourceSnapshot:scheduler.save(),stateRevision:7,expectedRevision:7})};
}
const totals=(resident,stock)=>[...resident.cells.filter(c=>c.id===id),...stock.stores]
  .reduce(([u,e],c)=>[u+c.units,e+(c.energy??c.quantities?.[key]??0)],[0,0]);

test('private staging returns exact paired successor and no live writes',()=>{
  const f=fixture();f.live.insert(9,0,0,'water',5);const req=f.request(),before=clone(req.resident),stock=clone(req.sourceSnapshot);
  const p=stage(req);assert.deepEqual(p.receipt,{visited:2,units:4,energy:10,changed:[[0,0,0],[1,0,0]]});
  assert.equal(p.expectedRevision,7);assert.equal(p.stateRevision,8);
  assert.deepEqual(f.live.save(),before);assert.deepEqual(f.scheduler.save(),stock);
  assert.deepEqual(totals(p.resident,p.sourceSnapshot),[14,38]);
  assert.deepEqual(p.resident.cells.find(c=>c.id==='water'),before.cells[0]);
  assert.ok(Object.isFrozen(p)&&Object.isFrozen(p.resident.pending[0])&&Object.isFrozen(p.sourceSnapshot.stores));
});
test('stale or exhausted revisions reject before constructing or authorizing',()=>{
  const f=fixture(),req=f.request(),never=()=>{throw Error('unexpected host call');};
  assert.equal(stage({...req,expectedRevision:6,createLiquidEngine:never}),null);
  assert.throws(()=>stage({...req,stateRevision:Number.MAX_SAFE_INTEGER,expectedRevision:Number.MAX_SAFE_INTEGER,createLiquidEngine:never}),RangeError);
  assert.throws(()=>stage({...req,expectedRevision:-1,createLiquidEngine:never}),TypeError);
});
test('missing or incompatible source snapshot cannot silently refill',()=>{
  const f=fixture(),req=f.request();assert.throws(()=>stage({...req,sourceSnapshot:null}),TypeError);
  assert.throws(()=>stage({...req,sourceSnapshot:{...req.sourceSnapshot,signature:'different'}}),TypeError);
  assert.throws(()=>stage({...req,resident:null}),TypeError);
  assert.deepEqual(f.scheduler.save(),req.sourceSnapshot);assert.deepEqual(f.live.save(),req.resident);
});
test('interrupted private prefix is discarded, retry of unchanged pair has no duplication',()=>{
  const f=fixture(),req=f.request(),cause=Object.freeze(new Error('denied visit'));
  assert.throws(()=>stage({...req,sourceOptions:{...req.sourceOptions,authorize:d=>{if(d.point[0]===1)throw cause;return true;}}}),e=>{
    assert.equal(e.message,'Resonance source staging discarded');assert.equal(e.cause.cause,cause);
    assert.equal(e.partial,undefined);assert.deepEqual(e.cause.partial,{visited:1,units:2,energy:5,changed:[[0,0,0]]});return true;});
  assert.deepEqual(f.live.save(),req.resident);assert.deepEqual(f.scheduler.save(),req.sourceSnapshot);
  const p=stage(req);assert.equal(p.receipt.units,4);assert.deepEqual(totals(p.resident,p.sourceSnapshot),[14,38]);
});
test('blocked/unloaded and capacity rejection retain finite stock while cursor advances',()=>{
  const f=fixture({engineOptions:{maxCells:1,isLoaded:x=>x!==0,isOpen:x=>x!==1},sourceOptions:{maxVisits:1,sources:[source(0),source(1),source(2)]}});
  f.live.insert(9,0,0,'water',1);let req=f.request();const a=stage(req);assert.equal(a.receipt.units,0);assert.equal(a.sourceSnapshot.cursor,1);
  const b=stage({...req,resident:a.resident,sourceSnapshot:a.sourceSnapshot,stateRevision:8,expectedRevision:8});
  assert.equal(b.receipt.units,0);assert.equal(b.sourceSnapshot.cursor,2);
  const c=stage({...req,resident:b.resident,sourceSnapshot:b.sourceSnapshot,stateRevision:9,expectedRevision:9});
  assert.equal(c.receipt.units,0);assert.equal(c.sourceSnapshot.cursor,0);assert.deepEqual(c.resident,req.resident);
  assert.deepEqual(totals(c.resident,c.sourceSnapshot),[21,57]);
});
test('sequential paired JSON restoration conserves zero-energy and charged sources',()=>{
  const f=fixture({sourceOptions:{sources:[source(0,0),source(1)],maxVisits:1}});let req=f.request();
  for(let i=0;i<12;i++){
    const p=stage(req),next=clone(p);assert.deepEqual(totals(p.resident,p.sourceSnapshot),[14,19]);
    req={...req,resident:next.resident,sourceSnapshot:next.sourceSnapshot,stateRevision:next.stateRevision,expectedRevision:next.stateRevision};
  }
  assert.deepEqual(req.sourceSnapshot.stores.map(s=>[s.units,s.energy]),[[0,0],[0,0]]);
  assert.equal(req.resident.cells.find(c=>c.x===0).quantities[key],undefined);
  assert.deepEqual(f.scheduler.save().stores.map(s=>s.units),[7,7]);
});

test('resident staging cap refuses oversized policy before creating an engine',()=>{
  const f=fixture(),req=f.request();
  assert.throws(()=>stage({...req,engineOptions:{...req.engineOptions,maxCells:65537},
    createLiquidEngine:()=>{throw Error('unexpected constructor');}}),RangeError);
});
