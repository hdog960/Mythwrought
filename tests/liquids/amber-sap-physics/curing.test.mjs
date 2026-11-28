import test from 'node:test';
import assert from 'node:assert/strict';
import {createSapCuring} from '../../../src/liquids/amber-sap/physics/curing.mjs';
const cell=(x=0,units=8,quantities={})=>Object.freeze({x,y:0,z:0,id:'amber-sap',units,quantities:Object.freeze(quantities)});
function fixture(over={}){
  const cells=new Map([[0,cell()]]);
  const options={engine:{getCell:x=>cells.get(x)??null},isLoaded:()=>true,isOpen:()=>true,canCure:()=>true,enabled:true,dwellVisits:3,...over};
  return {cells,options,s:createSapCuring(options)};
}
const track=(s,x=0)=>s.track(x,0,0);
test('disabled by default, requires explicit host and bounded policy',()=>{
  const {options}=fixture();const s=createSapCuring({...options,enabled:undefined});track(s);
  assert.equal(s.step().visited,0);assert.equal(s.save().pending[0][3],0);
  assert.throws(()=>createSapCuring({...options,dwellVisits:0}));assert.throws(()=>createSapCuring({...options,canCure:null}));
});
test('full uninterrupted dwell creates conservative read-only proposal',()=>{
  const {s,cells}=fixture();const c=cells.get(0);track(s);
  assert.equal(s.step().proposals.length,0);assert.equal(s.step().proposals.length,0);
  const p=s.step().proposals[0];assert.deepEqual(p,{expected:c,consumeSap:8,solidUnits:8,product:'amber'});
  assert.ok(Object.isFrozen(p));assert.equal(s.isReady(p),true);assert.equal(cells.get(0),c);
  assert.equal(s.step().proposals.length,1);assert.equal(s.save().pending[0][3],3);
});
test('partial, foreign and unaccounted quantity cells never convert',()=>{
  const {s,cells}=fixture();cells.set(0,cell(0,7));cells.set(1,{...cell(1),id:'water'});cells.set(2,cell(2,8,{trace:1}));
  for(let x=0;x<3;x++)track(s,x);const r=s.step();assert.equal(r.retired,3);assert.equal(r.proposals.length,0);assert.equal(r.pending,0);
});
test('replacement identity and explicit invalidation reset dwell',()=>{
  const {s,cells}=fixture();track(s);s.step();s.step();cells.set(0,cell());assert.equal(s.step().proposals.length,0);
  s.step();const p=s.step().proposals[0];assert.equal(s.isReady(p),true);s.invalidate(0,0,0);assert.equal(s.isReady(p),false);assert.equal(s.step().proposals.length,0);
  s.step();const fresh=s.step().proposals[0];assert.equal(s.isReady(p),false);assert.equal(s.isReady(fresh),true);assert.equal(s.isReady({...fresh}),false);
});
test('unload and denied eligibility reset progress, no catch-up or core read unloaded',()=>{
  let loaded=true,allowed=true,reads=0;const c=cell();const {s}=fixture({engine:{getCell:()=>{reads++;return c;}},isLoaded:()=>loaded,canCure:()=>allowed});
  track(s);s.step();s.step();loaded=false;assert.equal(s.step().deferred,1);assert.equal(reads,2);loaded=true;
  assert.equal(s.step().proposals.length,0);allowed=false;s.step();allowed=true;s.step();s.step();assert.equal(s.step().proposals.length,1);
});
test('budget and FIFO fairness survive snapshot and reject malformed state',()=>{
  const {s,cells,options}=fixture({maxTracked:2,maxVisits:1});cells.set(1,cell(1));track(s);track(s,1);assert.equal(track(s,2),false);assert.equal(track(s),true);
  s.step();const snapshot=JSON.parse(JSON.stringify(s.save()));assert.deepEqual(snapshot.pending,[[1,0,0,0],[0,0,0,1]]);
  const t=createSapCuring({...options,snapshot});assert.deepEqual(t.save(),snapshot);for(let i=0;i<6;i++){assert.deepEqual(t.step(),s.step());assert.deepEqual(t.save(),s.save());}
  assert.throws(()=>s.step(2));assert.throws(()=>s.track(0,257,0));assert.throws(()=>s.track(0,-211,0));
  assert.throws(()=>createSapCuring({...options,snapshot:{...snapshot,pending:[[0,0,0,1],[0,0,0,1]]}}));
  assert.throws(()=>createSapCuring({...options,snapshot:{...snapshot,pending:[[0,0,0,4]]}}));
  assert.throws(()=>createSapCuring({...options,dwellVisits:4,snapshot}));
});
test('save drops stale dwell, readiness refuses closed terrain and changed cell',()=>{
  let open=true;const {s,cells}=fixture({isOpen:()=>open});track(s);s.step();s.step();const p=s.step().proposals[0];open=false;
  assert.equal(s.isReady(p),false);assert.equal(s.save().pending[0][3],0);open=true;cells.set(0,cell());assert.equal(s.isReady(p),false);assert.equal(s.save().pending[0][3],0);
});
test('callback failure preserves current entry and prevents reentrant mutation',()=>{
  let s,fail=true;({s}=fixture({canCure:()=>{if(fail)s.invalidate(0,0,0);return true;}}));track(s);
  assert.throws(()=>s.step(),/Reentrant/);fail=false;assert.equal(s.save().pending[0][3],0);assert.equal(s.step().visited,1);
});

// Exact peer module supplied by the operator; no duplicate engine in the branch.
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {AMBER_SAP_DEFINITION,createSapSource} from '../../../src/liquids/amber-sap/physics/definition.mjs';
const core=process.env.LIQUID_ENGINE_MODULE?await import(pathToFileURL(resolve(process.env.LIQUID_ENGINE_MODULE)).href):null;
const native=(name,fn)=>test(name,{skip:!core},fn);
native('actual core: slow flow invalidates a ready full-cell proposal',()=>{
  let drain=false;const isLoaded=()=>true,isOpen=(x,y,z)=>x===0&&z===0&&(y===1||drain&&y===0);
  const engine=core.createLiquidEngine({isLoaded,isOpen,definitions:[AMBER_SAP_DEFINITION]});
  engine.insert(0,1,0,'amber-sap',8);const s=createSapCuring({engine,isLoaded,isOpen,canCure:()=>true,enabled:true,dwellVisits:1});
  s.track(0,1,0);const p=s.step().proposals[0];assert.equal(s.isReady(p),true);
  drain=true;engine.wake(0,0,0);const delta=engine.tick(1);assert.equal(delta.moved,1);
  for(const point of delta.changed){s.invalidate(...point);s.track(...point);}
  assert.equal(s.isReady(p),false);assert.equal(s.step().proposals.length,0);
  assert.equal(engine.save().cells.reduce((n,c)=>n+c.units,0),8);
});
native('actual core: finite source and paired curing snapshot retain mass and progress',()=>{
  const isLoaded=()=>true,isOpen=(x,y,z)=>x===0&&y===256&&z===0;
  const config={isLoaded,isOpen,definitions:[AMBER_SAP_DEFINITION]};
  const tree={x:0,y:256,z:0,treeId:'fixture',stock:8,rate:2};
  let engine=core.createLiquidEngine(config),source=createSapSource(tree);
  for(let i=0;i<4;i++)assert.equal(source.collect(engine,()=>true),2);
  const options={isLoaded,isOpen,canCure:()=>true,enabled:true,dwellVisits:3};
  let s=createSapCuring({engine,...options});s.track(0,256,0);s.step();s.step();
  const saved=JSON.parse(JSON.stringify({liquid:engine.save(),source:source.save(),curing:s.save()}));
  engine=core.createLiquidEngine({...config,snapshot:saved.liquid});source=createSapSource({...tree,snapshot:saved.source});
  s=createSapCuring({engine,...options,snapshot:saved.curing});assert.equal(source.collect(engine,()=>true),0);
  const before=engine.save(),p=s.step().proposals[0];assert.equal(s.isReady(p),true);assert.equal(p.solidUnits,8);
  assert.deepEqual(engine.save(),before);assert.equal(source.save().remaining+engine.getCell(0,256,0).units,8);
});
