import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createAcidCreativeTransfer} from '../../../src/liquids/acid/content/creative-transfer.mjs';
async function pinned(env,sha){
  const path=resolve(process.env[env]??'');
  const data=readFileSync(path);
  assert.equal(createHash('sha1').update(`blob ${data.length}\0`).update(data).digest('hex'),sha);
  return import(pathToFileURL(path).href);
}
const {createLiquidEngine}=await pinned('LIQUID_ENGINE_MODULE','ac9dfb9e85e99cce81ffc6a4aabe8b2f6f2b764b');
const {ACID_DEFINITION,readAcidStrength}=await pinned('ACID_PHYSICS_MODULE','3fc22a876f07fe8965858d5187ddee1438b06e2d');
const p=[0,0,0],q=[1,0,0];
const acid=(units,quantities={})=>({id:'acid',units,quantities});
function fixture(options={},canEdit=()=>true){
  const engineOptions={isLoaded:()=>true,isOpen:()=>true,definitions:[ACID_DEFINITION,{id:'water',gravityLimit:8,lateralLimit:4}],...options};
  const engine=createLiquidEngine(engineOptions);
  const adapter=createAcidCreativeTransfer({createLiquidEngine,readAcidStrength,engineOptions,canEdit});
  const state=(canister=null)=>({version:1,liquid:engine.save(),canister});
  const stage=(state,action,point=p,units=8)=>adapter.stage({state,revision:4,action,point,units});
  const restore=s=>createLiquidEngine({...engineOptions,snapshot:s.liquid});
  return {engine,state,stage,restore,adapter};
}
const conserved=s=>[...s.liquid.cells,...(s.canister?[s.canister]:[])].reduce((a,c)=>[a[0]+c.units,a[1]+(c.quantities['acid-solute']??0),a[2]+(c.quantities.trace??0)],[0,0,0]);
test('partial collection uses actual core split and retains every remainder',()=>{
  const f=fixture();f.engine.insert(...p,'acid',7,{'acid-solute':4001,trace:13});
  const before=f.state(),bytes=JSON.stringify(before),r=f.stage(before,'collect',p,3);
  assert.deepEqual(r.state.canister,acid(3,{'acid-solute':1714,trace:5}));
  assert.deepEqual(f.restore(r.state).getCell(...p).quantities,{'acid-solute':2287,trace:8});
  assert.deepEqual(conserved(r.state),conserved(before));assert.equal(JSON.stringify(before),bytes);
  assert.deepEqual(f.engine.save(),before.liquid);assert.equal(r.expectedRevision,4);assert.deepEqual(r.changed,[p]);
});
test('whole canister placement and same-acid merge conserve all quantities',()=>{
  const f=fixture();f.engine.insert(...p,'acid',3,{'acid-solute':1700,trace:7});f.engine.insert(...q,'acid',2,{'acid-solute':700,trace:2});
  const before=f.state(),take=f.stage(before,'collect'),place=f.stage(take.state,'place',q);
  assert.equal(take.state.liquid.cells.length,1);assert.equal(place.state.canister,null);
  assert.deepEqual(f.restore(place.state).getCell(...q),{x:1,y:0,z:0,...acid(5,{'acid-solute':2400,trace:9})});
  assert.deepEqual(conserved(place.state),conserved(before));assert.deepEqual(place.changed,[q]);
  assert.equal(f.stage(place.state,'place',q),null);
});
test('blocked, unloaded and protected targets fail both operations without live writes',()=>{
  for(const kind of ['loaded','open','permission']){
    let allowed=true;const f=fixture({isLoaded:()=>kind!=='loaded'||allowed,isOpen:()=>kind!=='open'||allowed},()=>kind!=='permission'||allowed);
    f.engine.insert(...p,'acid',1,{'acid-solute':600});allowed=false;
    const s=f.state(),filled=f.state(acid(1,{'acid-solute':300}));
    assert.equal(f.stage(s,'collect'),null);assert.equal(f.stage(filled,'place'),null);assert.deepEqual(f.engine.save(),s.liquid);
  }
});
test('foreign liquid, empty collection and occupied canister are rejected',()=>{
  const f=fixture();f.engine.insert(...p,'water',2);const s=f.state(acid(1));
  assert.equal(f.stage(f.state(),'collect'),null);assert.equal(f.stage(f.state(),'collect',q),null);
  assert.equal(f.stage(s,'place'),null);assert.equal(f.stage(s,'collect'),null);
  assert.deepEqual(f.engine.save(),s.liquid);
});
test('volume, resident, quantity and key overflow leave payload intact',()=>{
  const cases=[{opts:{},cell:acid(8),slot:acid(1),point:p},{opts:{maxCells:1},cell:acid(1),slot:acid(1),point:q},
    {opts:{},cell:acid(1,{trace:2**40}),slot:acid(1,{trace:1}),point:p},
    {opts:{},cell:acid(1,{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1}),slot:acid(1,{i:1}),point:p}];
  for(const c of cases){const f=fixture(c.opts);f.engine.insert(...p,'acid',c.cell.units,c.cell.quantities);
    const s=f.state(c.slot),before=JSON.stringify(s);assert.equal(f.stage(s,'place',c.point),null);assert.equal(JSON.stringify(s),before);assert.deepEqual(f.engine.save(),s.liquid);}
});
test('malformed inventory and requests fail closed; invalid acid cannot be collected',()=>{
  const f=fixture();for(const c of [acid(0),acid(1,{'acid-solute':1001}),acid(1,{trace:-1}),acid(1,{trace:0}),{id:'water',units:1,quantities:{}}])
    assert.throws(()=>f.stage(f.state(c),'place'),TypeError);
  assert.throws(()=>f.stage(f.state(),'collect',[0,257,0]),TypeError);assert.throws(()=>f.stage(f.state(),'collect',p,9),TypeError);
  assert.throws(()=>f.stage(f.state(),'erase'),TypeError);assert.throws(()=>f.stage({...f.state(),version:2},'collect'),TypeError);
  f.engine.insert(...p,'acid',1,{'acid-solute':1001});assert.equal(f.stage(f.state(),'collect'),null);
});
test('zero-strength acid retains its identity and physical height edges',()=>{
  const f=fixture(),low=[-1,-210,0],high=[0,256,0];f.engine.insert(...low,'acid',2);
  const take=f.stage(f.state(),'collect',low),put=f.stage(take.state,'place',high);
  assert.deepEqual(take.state.canister,acid(2));assert.equal(f.restore(put.state).getCell(...high).id,'acid');
  assert.equal(readAcidStrength(f.restore(put.state).getCell(...high)),0);assert.deepEqual(put.changed,[high]);
});
test('staged output is immutable and roundtrips exact FIFO state',()=>{
  const f=fixture();f.engine.insert(...p,'acid',4);const r=f.stage(f.state(),'collect',p,1);
  assert.ok(Object.isFrozen(r.state.liquid.cells)&&Object.isFrozen(r.state.liquid.pending)&&Object.isFrozen(r.state.canister.quantities));
  assert.deepEqual(f.restore(JSON.parse(JSON.stringify(r.state))).save(),r.state.liquid);
  assert.throws(()=>r.state.liquid.pending.push(q),TypeError);
});
test('permission fault propagates without any live inventory or liquid change',()=>{
  const f=fixture({},()=>{throw Error('host permission failure');});f.engine.insert(...p,'acid',2);
  const s=f.state();assert.throws(()=>f.stage(s,'collect'),/host permission failure/);assert.deepEqual(f.engine.save(),s.liquid);assert.equal(s.canister,null);
});
