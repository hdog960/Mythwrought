import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {planFiniteSpring,createCreativeWaterStager} from '../../../src/liquids/water/content/creative-water.mjs';

const root=process.env.LIQUID_PEER_MODULES;
if(!root)throw Error('Set LIQUID_PEER_MODULES to directory of pinned Water A modules');
async function pinned(name,sha){
  const file=resolve(root,name),bytes=readFileSync(file);
  assert.equal(createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex'),sha);
  return import(pathToFileURL(file).href);
}
const {createLiquidEngine}=await pinned('engine.mjs','ac9dfb9e85e99cce81ffc6a4aabe8b2f6f2b764b');
const {WATER_DEFINITION}=await pinned('definition.mjs','78bb5be0317698b0a7e2c27ad69f13d58d2bb054');
const {createWaterSources}=await pinned('sources.mjs','61b63656d80ea30071f75423ad69b48a1000784a');
const p=[0,0,0],q=[1,0,0];
function fixture({isLoaded=()=>true,isOpen=()=>true,canEdit=()=>true,maxCells=8}={}){
  const createEngine=(snapshot=null)=>createLiquidEngine({snapshot,isLoaded,isOpen,maxCells,definitions:[WATER_DEFINITION,{id:'lava',gravityLimit:1,lateralLimit:1}]});
  const e=createEngine(),stager=createCreativeWaterStager({createEngine,isLoaded,isOpen,canEdit,maxCells});
  return {e,createEngine,stage:stager.stage};
}
const request=(state,mode,units,position=p,expectedRevision=state.revision)=>({state,mode,units,position,expectedRevision});
const state=(e,vessel=null)=>({revision:0,resident:e.save(),vessel});
const vessel=(units,quantities={})=>({id:'water',units,quantities});

test('finite spring uses actual source adapter and depletes exactly across restore',()=>{
  const {e,createEngine}=fixture();
  const plan=planFiniteSpring({id:'spring-a',position:[0,256,0],stock:11,rate:3,target:5});
  const cfg={sources:[plan.source]};let s=createWaterSources({engine:e,...cfg}),collected=0;
  for(let i=0;i<2;i++){s.step();collected+=e.extract(0,256,0,8).units;}
  const copy=createEngine(e.save());s=createWaterSources({engine:copy,...cfg,snapshot:s.save()});
  for(let i=0;i<4;i++){s.step();collected+=copy.extract(0,256,0,8)?.units??0;}
  assert.equal(collected,plan.requiredUnits);assert.deepEqual(s.save().remaining,[0]);
  assert.equal(s.step().inserted,0);assert.ok(Object.isFrozen(plan.source));
});
test('spring descriptor validates boundaries and never authorizes renewable stock',()=>{
  assert.equal(planFiniteSpring({id:'s',position:[-1,-210,0],stock:1}).source.mode,'finite');
  for(const bad of [{stock:0},{position:[0,257,0]},{id:'bad id'},{rate:9},{stock:Infinity}])
    assert.throws(()=>planFiniteSpring({id:'s',position:p,stock:1,...bad}));
});
test('collect then place moves exact volume and quantities without touching live engine',()=>{
  const {e,stage,createEngine}=fixture();e.insert(...p,'water',7,{solute:13,energy:19});
  const before=state(e),a=stage(request(before,'collect',3));
  assert.deepEqual(a.state.vessel,vessel(3,{energy:8,solute:5}));
  assert.deepEqual(e.save(),before.resident);assert.equal(a.state.revision,1);
  const b=stage(request(a.state,'place',3,q));assert.equal(b.state.vessel,null);
  const final=createEngine(b.state.resident);
  assert.equal(final.getCell(...p).units,4);assert.equal(final.getCell(...q).units,3);
  assert.deepEqual(final.getCell(...p).quantities,{energy:11,solute:8});
  assert.deepEqual(final.getCell(...q).quantities,{energy:8,solute:5});
  assert.deepEqual(b.changed,[q]);assert.ok(Object.isFrozen(b.state.resident.pending));
});
test('stale revision and nonempty collection or partial placement reject',()=>{
  const {e,stage}=fixture();e.insert(...p,'water',8);const s=state(e);
  assert.equal(stage(request(s,'collect',1,p,1)),null);
  const a=stage(request(s,'collect',4));
  assert.equal(stage(request(a.state,'collect',1)),null);
  assert.equal(stage(request(a.state,'place',2,q)),null);
  assert.equal(stage(request(a.state,'place',4,q,0)),null);
  assert.deepEqual(e.save(),s.resident);
});
test('loaded/open/permission checks reject both transfer directions',()=>{
  let ready=true,open=true,allowed=true;
  const {e,stage}=fixture({isLoaded:()=>ready,isOpen:()=>open,canEdit:()=>allowed});
  e.insert(...p,'water',5);const s=state(e),v=state(e,vessel(3));
  for(const set of [x=>ready=x,x=>open=x,x=>allowed=x]){
    set(false);assert.equal(stage(request(s,'collect',1)),null);assert.equal(stage(request(v,'place',3,q)),null);set(true);
  }
  assert.deepEqual(e.save(),s.resident);
});
test('foreign, insufficient, full and quantity-overflow cells reject atomically',()=>{
  const {e,stage}=fixture();e.insert(...p,'lava',5);e.insert(...q,'water',7,{energy:2**40});
  const s=state(e);assert.equal(stage(request(s,'collect',1)),null);
  assert.equal(stage(request(s,'collect',8,q)),null);
  for(const [v,pos] of [[vessel(1),p],[vessel(2),q],[vessel(1,{energy:1}),q]])
    assert.equal(stage(request(state(e,v),'place',v.units,pos)),null);
  assert.deepEqual(e.save(),s.resident);
});
test('resident capacity and malformed vessel or snapshot reject',()=>{
  const {e,stage}=fixture({maxCells:1});e.insert(...p,'water',1);const s=state(e,vessel(1));
  assert.equal(stage(request(s,'place',1,q)),null);
  assert.throws(()=>stage(request({...s,vessel:vessel(1,{bad:-1})},'place',1,q)));
  assert.throws(()=>stage(request({...s,resident:{...s.resident,version:9}},'place',1,q)));
  assert.throws(()=>stage(request(s,'place',1,[0,257,0])));
  assert.deepEqual(e.save(),s.resident);
});
test('full-cell collect retires pending and placement wakes new cell at physical bottom',()=>{
  const {e,stage,createEngine}=fixture();const low=[0,-210,0],high=[0,256,0];e.insert(...high,'water',8);
  const a=stage(request(state(e),'collect',8,high));assert.deepEqual(a.state.resident.pending,[]);
  const b=stage(request(a.state,'place',8,low));assert.deepEqual(b.state.resident.pending,[low]);
  assert.equal(createEngine(b.state.resident).samplePoint(.5,-209.5,.5).fill,1);
  assert.equal(e.getCell(...high).units,8);
});
