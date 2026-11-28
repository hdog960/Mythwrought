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
const {createLiquidEngine}=await pinned('LIQUID_ENGINE_MODULE','b0ce6f804c111cc2a0a9cf6c835fc75fde45eaa5');
const {ACID_DEFINITION,readAcidStrength}=await pinned('ACID_PHYSICS_MODULE','3fc22a876f07fe8965858d5187ddee1438b06e2d');
const p=[20,0,0];
function fixture(){
  const options={isLoaded:()=>true,isOpen:(x,y,z)=>y===0&&((x>=0&&x<=1)||(x>=20&&x<=21))&&z>=0&&z<=1,
    lateralOrder:'rotating',definitions:[ACID_DEFINITION,{id:'water',gravityLimit:8,lateralLimit:4}]};
  const engine=createLiquidEngine(options);
  engine.insert(0,0,0,'water',8);engine.insert(...p,'acid',8,{'acid-solute':4800,trace:13});engine.tick(2);
  const state={version:1,liquid:engine.save(),canister:null};
  assert.deepEqual(state.liquid.lateralPhases,[[0,0,0,1],[20,0,0,1]]);
  const adapter=(opts={})=>createAcidCreativeTransfer({createLiquidEngine,readAcidStrength,engineOptions:options,canEdit:()=>true,...opts});
  const stage=(s,action,units=8,point=p,a=adapter())=>a.stage({state:s,revision:2,action,point,units});
  const restore=s=>createLiquidEngine({...options,snapshot:s.liquid});
  return {engine,state,options,adapter,stage,restore};
}
const totals=s=>[...s.liquid.cells,...(s.canister?[s.canister]:[])].reduce((a,c)=>[a[0]+c.units,a[1]+(c.quantities['acid-solute']??0),a[2]+(c.quantities.trace??0)],[0,0,0]);
test('partial collection preserves both phases, exact quantities and subsequent actual flow',()=>{
  const f=fixture(),before=JSON.stringify(f.state),reference=f.restore(f.state);
  reference.extract(...p,1);
  const take=f.stage(f.state,'collect',1);
  assert.deepEqual(take.state.liquid,reference.save());
  assert.ok(Object.isFrozen(take.state.liquid.lateralPhases)&&take.state.liquid.lateralPhases.every(Object.isFrozen));
  assert.deepEqual(totals(take.state),totals(f.state));
  const restored=f.restore(JSON.parse(JSON.stringify(take.state)));
  for(let i=0;i<6;i++){assert.deepEqual(restored.tick(1),reference.tick(1));assert.deepEqual(restored.save(),reference.save());}
  assert.equal(JSON.stringify(f.state),before);assert.deepEqual(f.engine.save(),f.state.liquid);
});
test('full collection removes only emptied phase; replacement starts at zero',()=>{
  const f=fixture(),take=f.stage(f.state,'collect');
  assert.deepEqual(take.state.liquid.lateralPhases,[[0,0,0,1]]);
  const put=f.stage(take.state,'place');
  assert.deepEqual(put.state.liquid.lateralPhases,[[0,0,0,1]]);
  assert.deepEqual(totals(put.state),totals(f.state));assert.deepEqual(f.restore(put.state).save(),put.state.liquid);
});
test('merge in fixed mode preserves existing phases for later rotation',()=>{
  const f=fixture(),a=f.adapter({engineOptions:{...f.options,lateralOrder:'fixed'}});
  const take=f.stage(f.state,'collect',1,p,a),put=f.stage(take.state,'place',8,p,a);
  assert.deepEqual(put.state.liquid.lateralPhases,f.state.liquid.lateralPhases);
  assert.deepEqual(totals(put.state),totals(f.state));
});
test('reader dropping or reordering phases rejected before host permission',()=>{
  const f=fixture();let calls=0;
  for(const change of [()=>[],rows=>[...rows].reverse()]){
    const factory=opts=>createLiquidEngine({...opts,snapshot:{...opts.snapshot,lateralPhases:change(opts.snapshot.lateralPhases)}});
    const a=f.adapter({createLiquidEngine:factory,canEdit:()=>{calls++;return true;}});
    assert.throws(()=>f.stage(f.state,'collect',1,p,a),/lateral phase/);
  }
  assert.equal(calls,0);assert.deepEqual(f.engine.save(),f.state.liquid);
});
test('malformed phases rejected and absent or empty phase metadata stays absent',()=>{
  const f=fixture();
  for(const rows of [null,[[20,0,0,0]],[[20,0,0,4]],[[20,257,0,1]],[[99,0,0,1]],[[20,0,0,1],[20,0,0,2]]]){
    assert.throws(()=>f.stage({...f.state,liquid:{...f.state.liquid,lateralPhases:rows}},'collect',1),TypeError);
  }
  const {lateralPhases,...legacy}=f.state.liquid;
  for(const liquid of [legacy,{...legacy,lateralPhases:[]}]){
    const r=f.stage({...f.state,liquid},'collect',1);
    assert.equal(Object.hasOwn(r.state.liquid,'lateralPhases'),false);
  }
});
test('both scheduler metadata fields survive one edit and exact retry resumption',()=>{
  const f=fixture(),options={...f.options,maxCells:5,isOpen:(x,y,z)=>f.options.isOpen(x,y,z)||(y===0&&z===0&&(x===40||x===41))};
  const engine=createLiquidEngine({...options,snapshot:f.state.liquid});
  assert.equal(engine.insert(40,0,0,'water',8),true);
  const initial=engine.save(),liquid={...initial,pending:[[40,0,0]],capacityBlocked:[]};
  const full=createLiquidEngine({...options,snapshot:liquid});
  assert.equal(full.tick(1).moved,0);assert.deepEqual(full.save().capacityBlocked,[[40,0,0]]);
  const state={version:1,liquid:full.save(),canister:null},reference=createLiquidEngine({...options,snapshot:state.liquid});
  reference.extract(...p,8);
  const a=f.adapter({engineOptions:options}),take=f.stage(state,'collect',8,p,a);
  assert.deepEqual(take.state.liquid,reference.save());
  const restored=createLiquidEngine({...options,snapshot:JSON.parse(JSON.stringify(take.state.liquid))});
  assert.deepEqual(restored.tick(1),reference.tick(1));assert.deepEqual(restored.save(),reference.save());
  assert.equal(restored.getCell(41,0,0).units,4);assert.deepEqual(totals(take.state),totals(state));
});
