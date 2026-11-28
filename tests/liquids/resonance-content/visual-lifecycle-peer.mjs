import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {createResonancePresentation} from '../../../src/liquids/liquid-resonance/content/presentation.mjs';
import {createResonanceMaterialAdapter} from '../../../src/liquids/liquid-resonance/content/material-exchange.mjs';

// Exact peer inputs, not copies in this branch. Authenticate transitive imports.
function pin(root,file,sha){
  const p=resolve(root,file),b=readFileSync(p);
  assert.equal(createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex'),sha,file);
  return pathToFileURL(p).href;
}
const root=process.env.LIQUID_PRESENTATION_ROOT??'';
pin(root,'mesh.mjs','6eec04c065623b7046750e28fdb34cfc4908ec9a');
const {createLiquidMeshCache}=await import(pin(root,'mesh-cache.mjs','32656e651fbdd7b5e3201a39763477a615510335'));
const {invalidateLiquidChanges}=await import(pin(root,'dirty-bridge.mjs','aadb734e572c1bbc35ca866d7bbeb259bae8764b'));
const {createLiquidEngine}=await import(pin(process.env.LIQUID_CORE_ROOT??'','engine.mjs','ac9dfb9e85e99cce81ffc6a4aabe8b2f6f2b764b'));
const physics=await import(pin(process.env.RESONANCE_PHYSICS_ROOT??'','definition.mjs','9bc356d7335ec65a64786876e8b8094643a26fcb'));
const {RESONANCE_ID:id,ENERGY_KEY:energyKey}=physics;
const a=[15,20,0],b=[16,20,0],coords={a,b};
const totals=e=>e.save().cells.reduce(([u,q],c)=>[u+c.units,q+(c.quantities[energyKey]??0)],[0,0]);

// Explicit two-batch fixture host, not a production owner registry or host transaction.
function fixture({left=4,right=4,leftEnergy=4096,rightEnergy=0,maxFaces=2560}={}){
  let epoch=1,loadedB=true,mapping=true,side=false,retry=null;
  const ready=new Map(),owner=x=>x<16?'a':'b';
  const isLoaded=x=>x<16||loadedB;
  const isOpen=(x,y,z)=>(x===15||x===16)&&((z===0&&(y===20||y===21))||(side&&x===15&&y===20&&z===1));
  const options={isLoaded,isOpen,definitions:[physics.RESONANCE_DEFINITION]};
  const engine=createLiquidEngine(options);
  if(left)assert.equal(engine.insert(...a,id,left,physics.resonanceQuantities(left,leftEnergy)),true);
  if(right)assert.equal(engine.insert(...b,id,right,physics.resonanceQuantities(right,rightEnergy)),true);
  const cache=createLiquidMeshCache({engine,isLoaded,isOpen,maxFaces,maxBatches:2,
    describeBatch:key=>key==='b'&&!loadedB?null:{origin:coords[key],cells:[coords[key]]}});
  const presentation=createResonancePresentation({physics,readCell:engine.getCell,isLoaded,isOpen,getBatch:cache.get,
    isBatchReady:(key,rev)=>!retry&&ready.get(key)===rev&&(key!=='b'||loadedB),
    ownsCell:(key,x,y,z)=>coords[key]?.join(',')===[x,y,z].join(','),readEpoch:()=>epoch});
  function dirty(changed){
    epoch++;
    const r=invalidateLiquidChanges({cache,changed,maxBatchIds:2,
      batchesForCell:x=>mapping?(owner(x)==='b'&&!loadedB?[]:[owner(x)]):null});
    if(r.accepted){retry=null;for(const key of r.ids)ready.delete(key);}
    else retry=changed;
    return r;
  }
  function publish(){
    const result=cache.step();
    for(const row of result.published){if(row.empty)ready.delete(row.id);else ready.set(row.id,row.revision);}
    return result;
  }
  function build(){
    const selection=Object.entries(coords).filter(([key])=>key!=='b'||loadedB)
      .map(([key,p])=>({batch:cache.get(key),cells:[p]})).filter(row=>row.batch);
    return presentation.build({selection,origin:a,phase:.25});
  }
  assert.equal(dirty([a,b]).accepted,true);publish();
  return {engine,cache,presentation,dirty,publish,build,options,
    setMapping:v=>{mapping=v;},retry:()=>dirty(retry),
    unload:()=>{loadedB=false;epoch++;ready.delete('b');},
    retire:()=>cache.drop('b'),reload:()=>{loadedB=true;epoch++;engine.wake(...b);return dirty([b]);},
    setSide:v=>{side=v;return dirty([a]);}};
}

test('actual core flow crosses batch boundary; stale effects cannot survive dirty publication',()=>{
  const f=fixture({left:8,right:0,leftEnergy:8192}),old=f.build();
  assert.equal(old.effects.cells,1);assert.equal(f.cache.get('b'),null);
  const tick=f.engine.tick(1);assert.equal(tick.moved,4);assert.deepEqual(tick.changed,[a,b]);
  assert.equal(f.dirty(tick.changed).accepted,true);
  assert.equal(f.presentation.isCurrent(old),false);assert.equal(f.build(),null);
  assert.equal(f.publish().published.length,2);
  const next=f.build();assert.equal(next.effects.cells,2);assert.equal(next.effects.segmentCount,16);
  assert.equal(next.effects.particleCount,4);assert.equal(next.allocatedBytes,25344);
  assert.deepEqual(totals(f.engine),[8,8192]);assert.ok(f.presentation.isCurrent(next));
});

test('actual infusion proposal changes emission without changing surface geometry or volume',()=>{
  const f=fixture({leftEnergy:64}),old=f.build(),surface=f.cache.get('a').mesh.groups[0];
  let mineral={version:1,mineralId:'m',material:'fixture-mineral',capacity:100,energy:0,revision:0};
  let revision=0;
  const adapter=createResonanceMaterialAdapter({physics,enableInfusion:true,allowedMaterials:['fixture-mineral'],
    authorize:()=>true,readEndpoint:(kind,key)=>({kind,id:key,point:kind==='cell'?a:[15,20,1],anchor:key,
      ownerKey:'a',revision:String(revision),loaded:true,permitted:true,contained:true,open:true,
      state:kind==='cell'?f.engine.getCell(...a):mineral})});
  const plan=adapter.plan({kind:'infusion',actor:'fixture',from:'c',to:'m'});
  assert.ok(plan);assert.deepEqual(adapter.revalidate(plan),plan);assert.equal(plan.operation.transferredEnergy,64);
  // Test-only synchronous application on a private fixture engine; not host atomic adoption.
  const before=f.engine.extract(...a,8);assert.deepEqual(before,plan.operation.expectedCell);
  const c=plan.operation.nextCell;assert.equal(f.engine.insert(...a,c.id,c.units,c.quantities),true);
  mineral=plan.operation.nextMineral;revision++;
  assert.equal(adapter.revalidate(plan),null);
  assert.equal(f.dirty(plan.changed).accepted,true);assert.equal(f.presentation.isCurrent(old),false);
  f.publish();const next=f.build(),after=f.cache.get('a').mesh.groups[0];
  assert.deepEqual(after.positions,surface.positions);assert.deepEqual(after.indices,surface.indices);
  assert.deepEqual(after.normals,surface.normals);assert.equal(old.effects.particleCount,1);
  assert.equal(next.effects.particleCount,0);assert.ok(next.effects.segments[6]<old.effects.segments[6]);
  assert.deepEqual(totals(f.engine),[8,0]);assert.equal(mineral.energy,64);
});

test('rejected dirty routing keeps previous-good cache but blocks effects until explicit retry',()=>{
  const f=fixture(),old=f.build(),batch=f.cache.get('a');
  f.engine.extract(...a,1);f.setMapping(false);
  assert.equal(f.dirty([a]).reason,'mapping-unavailable');assert.equal(f.cache.get('a'),batch);
  assert.equal(f.cache.stats().pending,0);assert.equal(f.presentation.isCurrent(old),false);assert.equal(f.build(),null);
  f.setMapping(true);assert.equal(f.retry().accepted,true);assert.equal(f.build(),null);
  f.publish();assert.ok(f.build());assert.notEqual(f.cache.get('a'),batch);
});

test('unload, retire and reload discard old revision even with retained core cells',()=>{
  const f=fixture(),old=f.build(),prior=f.cache.get('b');
  f.unload();assert.equal(f.presentation.isCurrent(old),false);assert.equal(f.cache.get('b'),prior);
  assert.ok(f.retire());assert.equal(f.cache.get('b'),null);assert.equal(f.engine.getCell(...b).units,4);
  assert.equal(f.dirty([b]).accepted,true);f.publish();const reduced=f.build();assert.equal(reduced.effects.cells,1);
  assert.ok(f.presentation.isCurrent(reduced));assert.equal(f.reload().accepted,true);
  assert.equal(f.presentation.isCurrent(reduced),false);f.publish();
  const restored=f.build();assert.equal(restored.effects.cells,2);assert.ok(f.cache.get('b').revision>prior.revision);
  assert.deepEqual(totals(f.engine),[8,4096]);assert.equal(f.presentation.isCurrent(old),false);
});

test('empty publication removes old mesh and repopulation receives new revision',()=>{
  const f=fixture(),old=f.build(),prior=f.cache.get('b'),taken=f.engine.extract(...b,8);
  assert.equal(f.dirty([b]).accepted,true);const result=f.publish();
  assert.ok(result.published.some(r=>r.id==='b'&&r.empty));assert.equal(f.cache.get('b'),null);
  assert.equal(f.build().effects.cells,1);assert.equal(f.presentation.isCurrent(old),false);
  assert.equal(f.engine.insert(...b,taken.id,taken.units,taken.quantities),true);
  f.dirty([b]);f.publish();assert.equal(f.build().effects.cells,2);
  assert.ok(f.cache.get('b').revision>prior.revision);assert.deepEqual(totals(f.engine),[8,4096]);
});

test('actual mesh face-budget rejection retains prior-good but cannot publish stale effects',()=>{
  const f=fixture({maxFaces:1}),old=f.build(),prior=f.cache.get('a');
  assert.ok(old);assert.equal(prior.mesh.faceCount,1);
  f.setSide(true);const failed=f.publish();assert.ok(failed.deferred.some(r=>r.id==='a'&&r.reason==='build-rejected'));
  assert.equal(f.cache.get('a'),prior);assert.equal(f.presentation.isCurrent(old),false);assert.equal(f.build(),null);
  f.setSide(false);f.publish();assert.ok(f.build());assert.notEqual(f.cache.get('a'),prior);
});
