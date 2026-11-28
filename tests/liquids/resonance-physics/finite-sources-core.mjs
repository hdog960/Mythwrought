import test from 'node:test';
import assert from 'node:assert/strict';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createResonanceSources} from '../../../src/liquids/liquid-resonance/physics/finite-sources.mjs';
import {RESONANCE_ID as id,ENERGY_KEY as key,RESONANCE_DEFINITION} from '../../../src/liquids/liquid-resonance/physics/definition.mjs';

// Explicit pinned peer dependency; Water A's engine is not copied into this lane.
if(!process.env.LIQUID_ENGINE_MODULE)throw Error('Set LIQUID_ENGINE_MODULE to pinned Water A engine.mjs');
const {createLiquidEngine}=await import(pathToFileURL(resolve(process.env.LIQUID_ENGINE_MODULE)).href);
const source=(x,units=4,energy=1024)=>({point:[x,0,0],rate:2,target:8,
  store:{version:1,id,storeId:'source-'+x,anchor:'anchor-'+x,capacity:8,units,energy,revision:0}});
const plainCore=snapshot=>createLiquidEngine({definitions:[RESONANCE_DEFINITION],
  isLoaded:()=>true,isOpen:()=>true,...(snapshot?{snapshot}:{})});
const options=(engine,sources,extra={})=>({engine,sources,authorize:()=>true,
  maxVisits:2,maxUnitsPerStep:4,...extra});

function fixture({stage='authorize',failureAt=1,reason=new Error('host fault'),onFault,
  sources=[source(0),source(10),source(20)],maxVisits=2,maxUnitsPerStep=4}={}){
  let armed=true,scheduler;
  const fail=(where,x)=>{
    if(armed&&where===stage&&x===sources[failureAt].point[0]){
      if(onFault)return onFault(scheduler);
      throw reason;
    }
  };
  // The insert fault comes from the actual core's pre-mutation host callback.
  const core=createLiquidEngine({definitions:[RESONANCE_DEFINITION],isLoaded:()=>true,
    isOpen:x=>{fail('insert',x);return true;}});
  const engine={getCell:(x,y,z)=>{fail('getCell',x);return core.getCell(x,y,z);},
    insert:(...args)=>core.insert(...args)};
  scheduler=createResonanceSources(options(engine,sources,{maxVisits,maxUnitsPerStep,
    authorize:d=>{fail('authorize',d.point[0]);return true;}}));
  return {core,scheduler,sources,maxVisits,maxUnitsPerStep,disarm:()=>{armed=false;}};
}
function interrupted(step){
  let error;
  try{step();}catch(cause){error=cause;}
  assert.ok(error instanceof Error,'step must throw an Error wrapper');
  assert.equal(error.message,'Liquid Resonance source step interrupted');
  assert.ok(Object.hasOwn(error,'cause'));
  return error;
}
function totals(core,scheduler){
  const cells=core.save().cells,stores=scheduler.save().stores;
  return [...cells,...stores].reduce(([u,e],s)=>[u+s.units,e+(s.energy??s.quantities?.[key]??0)],[0,0]);
}
function checkPrefix(f,error){
  assert.deepEqual(error.partial,{visited:1,units:2,energy:512,changed:[[0,0,0]]});
  assert.ok(Object.isFrozen(error.partial)&&Object.isFrozen(error.partial.changed));
  assert.ok(error.partial.changed.every(Object.isFrozen));
  assert.throws(()=>{error.partial.units=999;},TypeError);
  assert.throws(()=>{error.partial.changed[0][0]=999;},TypeError);
  const saved=f.scheduler.save();
  assert.equal(saved.cursor,1);
  assert.deepEqual(saved.stores.map(s=>[s.units,s.energy,s.revision]),[[2,512,1],[4,1024,0],[4,1024,0]]);
  assert.equal(f.core.getCell(0,0,0).units,2);
  assert.equal(f.core.getCell(0,0,0).quantities[key],512);
  assert.equal(f.core.getCell(10,0,0),null);
  assert.equal(f.core.getCell(20,0,0),null);
  assert.deepEqual(totals(f.core,f.scheduler),[12,3072]);
}
function resumePrefix(f,error){
  f.disarm();
  const resumed=f.scheduler.step();
  assert.deepEqual(resumed,{visited:2,units:4,energy:1024,changed:[[10,0,0],[20,0,0]]});
  // Retry starts at the failing outlet, not at the earlier acknowledged insert.
  assert.equal(f.core.getCell(0,0,0).units,2);
  assert.equal(f.scheduler.save().stores[0].revision,1);
  assert.deepEqual(totals(f.core,f.scheduler),[12,3072]);
  assert.deepEqual(error.partial,{visited:1,units:2,energy:512,changed:[[0,0,0]]});
}

for(const stage of ['authorize','getCell','insert']){
  test('actual core: '+stage+' fault exposes committed prefix and resumes at unspent outlet',()=>{
    const reason=Object.freeze(new Error(stage+' failure'));
    const f=fixture({stage,reason}),error=interrupted(()=>f.scheduler.step());
    assert.equal(error.cause,reason);
    assert.equal(Object.hasOwn(reason,'partial'),false);
    checkPrefix(f,error);
    resumePrefix(f,error);
  });
}

test('failure before the first insertion leaves core, stock and cursor unchanged',()=>{
  for(const stage of ['authorize','getCell','insert']){
    const f=fixture({stage,failureAt:0}),beforeCore=f.core.save(),beforeSources=f.scheduler.save();
    const error=interrupted(()=>f.scheduler.step());
    assert.deepEqual(error.partial,{visited:0,units:0,energy:0,changed:[]});
    assert.deepEqual(f.core.save(),beforeCore);
    assert.deepEqual(f.scheduler.save(),beforeSources);
    f.disarm();
    assert.deepEqual(f.scheduler.step(),{visited:2,units:4,energy:1024,changed:[[0,0,0],[10,0,0]]});
    assert.deepEqual(totals(f.core,f.scheduler),[12,3072]);
  }
});

test('frozen and non-Error thrown values retain identity without losing partial results',()=>{
  for(const reason of [Object.freeze({code:'E_HOST'}),'host unavailable',null,undefined]){
    const f=fixture({onFault:()=>{throw reason;}}),error=interrupted(()=>f.scheduler.step());
    // Undefined is deliberately thrown too, not mistaken for no error.
    assert.equal(error.cause,reason);
    checkPrefix(f,error);
  }
});

test('reentrant step/save during a later authorization preserves only the outer committed prefix',()=>{
  for(const method of ['step','save']){
    const f=fixture({onFault:s=>s[method]()}),error=interrupted(()=>f.scheduler.step());
    assert.match(error.cause.message,method==='step'?/Reentrant source step/:/Cannot save during source step/);
    checkPrefix(f,error);
    resumePrefix(f,error);
  }
});

test('partial visited includes completed empty visits and changed includes only successful inserts',()=>{
  const f=fixture({sources:[source(0,0,0),source(10),source(20)],failureAt:2,
    maxVisits:3,maxUnitsPerStep:6});
  const error=interrupted(()=>f.scheduler.step());
  assert.deepEqual(error.partial,{visited:2,units:2,energy:512,changed:[[10,0,0]]});
  assert.equal(f.scheduler.save().cursor,2);
  assert.deepEqual(totals(f.core,f.scheduler),[8,2048]);
});

test('visit and volume budgets stop before an unvisited faulting outlet',()=>{
  for(const budgets of [{maxVisits:2,maxUnitsPerStep:6},{maxVisits:3,maxUnitsPerStep:4}]){
    const f=fixture({failureAt:2,...budgets});
    assert.deepEqual(f.scheduler.step(),{visited:2,units:4,energy:1024,changed:[[0,0,0],[10,0,0]]});
    const beforeCore=f.core.save(),beforeSources=f.scheduler.save();
    const error=interrupted(()=>f.scheduler.step());
    assert.deepEqual(error.partial,{visited:0,units:0,energy:0,changed:[]});
    assert.deepEqual(f.core.save(),beforeCore);
    assert.deepEqual(f.scheduler.save(),beforeSources);
  }
});

test('paired actual-core and source snapshots after failure restore the same bounded continuation',()=>{
  const f=fixture(),error=interrupted(()=>f.scheduler.step());
  const core=plainCore(JSON.parse(JSON.stringify(f.core.save())));
  const scheduler=createResonanceSources(options(core,f.sources,
    {snapshot:JSON.parse(JSON.stringify(f.scheduler.save()))}));
  f.disarm();
  for(let i=0;i<5;i++){
    const expected=f.scheduler.step(),actual=scheduler.step();
    assert.deepEqual(actual,expected);
    assert.deepEqual(core.save(),f.core.save());
    assert.deepEqual(scheduler.save(),f.scheduler.save());
    assert.deepEqual(totals(core,scheduler),[12,3072]);
  }
  assert.equal(core.save().cells.reduce((n,c)=>n+c.units,0),12);
  assert.ok(scheduler.save().stores.every(s=>s.units===0&&s.energy===0));
  assert.deepEqual(error.partial,{visited:1,units:2,energy:512,changed:[[0,0,0]]});
});
