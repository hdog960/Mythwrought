import test from 'node:test';
import assert from 'node:assert/strict';
import {createLavaVents as create} from '../../../src/liquids/lava/physics/vents.mjs';
import {LAVA_DEFINITION,readLavaHeat} from '../../../src/liquids/lava/physics/definition.mjs';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
const {createLiquidEngine}=await import(pathToFileURL(resolve(process.env.LIQUID_ENGINE_MODULE)).href);
const world=(o={})=>createLiquidEngine({definitions:[LAVA_DEFINITION,{id:'water',gravityLimit:8,lateralLimit:4}],isLoaded:()=>true,isOpen:()=>true,...o});
const vent=(id,x,extra={})=>({id,x,y:0,z:0,rate:3,remaining:10,...extra});
const mass=e=>e.save().cells.reduce((n,c)=>n+c.units,0);
const heat=e=>e.save().cells.reduce((n,c)=>n+readLavaHeat(c),0);
const round=v=>JSON.parse(JSON.stringify(v));
test('global budget rotates fairly and keeps configured rates',()=>{
  const engine=world(),s=create({engine,vents:[vent('a',0),vent('b',1)],maxUnitsPerStep:2});
  for(let i=0;i<4;i++)assert.equal(s.step().inserted,2);
  assert.deepEqual(s.save().emitted,[4,4]);assert.equal(heat(engine),640);
  assert.equal(s.step().inserted,2);
});
test('partial final visit consumes only budget and next step starts at next vent',()=>{
  const engine=world(),s=create({engine,vents:[vent('a',0),vent('b',1),vent('c',2)],maxUnitsPerStep:4});
  assert.deepEqual(s.step(),{visited:2,finiteUnits:4,renewableUnits:0,inserted:4,heat:320,changed:[[0,0,0],[1,0,0]]});
  assert.equal(s.save().cursor,2);assert.deepEqual(s.step().changed,[[2,0,0],[0,0,0]]);
  assert.deepEqual(s.step().changed,[[1,0,0],[2,0,0]]);assert.deepEqual(s.save().emitted,[4,4,4]);
});
test('finite stock and heat conserve through actual gravity flow',()=>{
  const engine=world({isOpen:(x,y,z)=>z===0&&x>=0&&x<=1&&y>=-3&&y<=0});
  const s=create({engine,vents:[vent('a',0,{remaining:17,heatPerUnit:90}),vent('b',1,{remaining:15,heatPerUnit:50})]});
  for(let i=0;i<80;i++){s.step();engine.tick();}
  assert.deepEqual(s.save().emitted,[17,15]);assert.equal(mass(engine),32);assert.equal(heat(engine),2280);
});
test('renewable injection explicitly authorized, separate from finite and heat',()=>{
  const engine=world(),vents=[vent('a',0,{remaining:1}),vent('b',1,{renewable:true,remaining:null,heatPerUnit:50})];
  assert.throws(()=>create({engine,vents}));const s=create({engine,vents,allowRenewable:true});
  const r=s.step();assert.deepEqual([r.finiteUnits,r.renewableUnits,r.heat],[1,3,230]);
  assert.equal(s.step().finiteUnits,0);
});
test('blocked unloaded and foreign cells do not debit reserves',()=>{
  let loaded=false;const engine=world({isLoaded:x=>x!==1||loaded,isOpen:x=>x!==0});engine.insert(2,0,0,'water',1);
  const s=create({engine,vents:[vent('a',0),vent('b',1),vent('c',2)],maxVisits:3});
  assert.equal(s.step().inserted,0);assert.deepEqual(s.save().emitted,[0,0,0]);loaded=true;
  assert.deepEqual(s.step().changed,[[1,0,0]]);assert.deepEqual(s.save().emitted,[0,3,0]);
});
test('resident cap rejection preserves stock and rotation',()=>{
  const engine=world({maxCells:1}),s=create({engine,vents:[vent('a',0),vent('b',1)],maxVisits:1});
  assert.equal(s.step().inserted,3);assert.equal(s.step().inserted,0);assert.deepEqual(s.save().emitted,[3,0]);
});
test('snapshot resumes same cursor and ledger with exact engine state',()=>{
  const engine=world(),opts={vents:[vent('a',0),vent('b',1)],maxVisits:1},a=create({engine,...opts});a.step();
  const other=world({snapshot:round(engine.save())}),b=create({engine:other,...opts,snapshot:round(a.save())});
  for(let i=0;i<10;i++){assert.deepEqual(a.step(),b.step());assert.deepEqual(engine.save(),other.save());}
  assert.deepEqual(a.save(),b.save());
});
test('reject duplicate IDs and positions, invalid physical bounds and forged snapshot',()=>{
  const engine=world(),vents=[vent('a',0)],a=create({engine,vents}),snapshot=a.save();
  for(const list of [[...vents,vent('a',1)],[...vents,vent('b',0)],[vent('b',1,{y:257})],[vent('b',1,{y:-211})],[vent('b',1,{emitted:1})],Array(1)])assert.throws(()=>create({engine,vents:list}));
  assert.throws(()=>create({engine,vents,snapshot:{...snapshot,emitted:[11]}}));
  assert.throws(()=>create({engine,vents,snapshot:{...snapshot,emitted:Array(1)}}));
  assert.throws(()=>create({engine,vents,snapshot,maxVisits:1}));
});
test('interrupted step exposes exact committed prefix and resumes failed visit',()=>{
  let fail=true;const engine=world({isOpen:x=>{if(x===1&&fail)throw Error('host fault');return true;}});
  const s=create({engine,vents:[vent('a',0),vent('b',1)]});
  assert.throws(()=>s.step(),e=>e.cause.message==='host fault'&&e.partial.inserted===3&&e.partial.changed[0][0]===0);
  assert.deepEqual(s.save().emitted,[3,0]);assert.equal(s.save().cursor,1);assert.equal(mass(engine),3);
  fail=false;assert.deepEqual(s.step().changed,[[1,0,0],[0,0,0]]);assert.deepEqual(s.save().emitted,[6,3]);
});
test('empty default is inert; physical endpoints are accepted',()=>{
  const engine=world(),a=create({engine});assert.equal(a.step().visited,0);assert.equal(a.save().cursor,0);
  const b=create({engine,vents:[vent('floor',0,{y:-210}),vent('ceiling',0,{y:256})]});assert.equal(b.step().inserted,6);
});
test('reentrant step and snapshot during callbacks fail before mutation',()=>{
  let s;for(const method of ['save','step']){
    const engine=world({isOpen:()=>{s[method]();return true;}});s=create({engine,vents:[vent('a',0)]});
    assert.throws(()=>s.step(),e=>e.partial.inserted===0);assert.equal(mass(engine),0);assert.deepEqual(s.save().emitted,[0]);
  }
});
