import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {createLavaCreativeTransfer} from '../../../src/liquids/lava/content/creative-transfer.mjs';

// Peer files are supplied from pinned checkouts, never copied into this lane.
async function pinned(env,sha){
  assert.ok(process.env[env],`Missing ${env}`);
  const path=resolve(process.env[env]),bytes=readFileSync(path);
  const actual=createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
  assert.equal(actual,sha,`Unexpected ${env} Git blob`);
  return import(pathToFileURL(path).href);
}
const {createLiquidEngine}=await pinned('LIQUID_CORE_MODULE','ac9dfb9e85e99cce81ffc6a4aabe8b2f6f2b764b');
const {LAVA_DEFINITION,readLavaHeat}=await pinned('LAVA_PHYSICS_MODULE','93f6559d51ec1c1b6b2ac9aa4776129903fc3e96');
const definitions=[LAVA_DEFINITION,{id:'water',gravityLimit:8,lateralLimit:4}];
const heat=c=>c.quantities['lava-heat']??0;
function fixture(over={}){
  const host={loaded:true,open:true,protected:false,permitted:true,terrain:'air',revision:'terrain-1'};
  const options={createLiquidEngine,readLavaHeat,definitions,isLoaded:()=>host.loaded,isOpen:()=>host.open,
    inspect:()=>({...host}),canTransfer:()=>host.permitted,allowCreative:true,...over};
  const adapter=createLavaCreativeTransfer(options);
  const engine=createLiquidEngine(options);
  const stage=(mode,units,x=0,y=0,z=0,cargo=adapter.emptyCargo(),resident=engine.save(),revision='state-1')=>
    adapter.stage({mode,units,x,y,z,cargo,resident,revision});
  return {host,adapter,engine,stage};
}
const held=(units,h)=>({version:1,id:'lava',units,quantities:h?{'lava-heat':h}:{}});
const totals=p=>[p.cargo.units+p.resident.cells.filter(c=>c.id==='lava').reduce((s,c)=>s+c.units,0),
  heat(p.cargo)+p.resident.cells.filter(c=>c.id==='lava').reduce((s,c)=>s+heat(c),0)];

test('actual core collection and placement preserve exact volume and heat including rounding',()=>{
  const {engine,stage,adapter}=fixture();engine.insert(0,0,0,'lava',7,{'lava-heat':503});
  const original=engine.save();const a=stage('collect',3);
  assert.equal(a.movedHeat,215);assert.deepEqual(a.cargo,held(3,215));assert.deepEqual(totals(a),[7,503]);
  assert.deepEqual(engine.save(),original);assert.equal(adapter.validate(a,'state-1'),true);
  const b=stage('place',2,1,0,0,a.cargo,a.resident,'state-2');
  assert.equal(b.movedHeat,143);assert.deepEqual(b.cargo,held(1,72));assert.deepEqual(totals(b),[7,503]);
  assert.deepEqual(b.changed,[[1,0,0]]);assert.ok(b.resident.pending.some(p=>p.join(',')==='1,0,0'));
  const c=stage('place',1,1,0,0,b.cargo,b.resident,'state-3');
  assert.deepEqual(c.cargo,adapter.emptyCargo());assert.deepEqual(totals(c),[7,503]);
  assert.equal(heat(c.resident.cells.find(c=>c.x===1)),215);assert.deepEqual(engine.save(),original);
});
test('full collection retires the cell, then placement restores exactly at a height boundary',()=>{
  const {engine,stage}=fixture();engine.insert(0,-210,0,'lava',8,{'lava-heat':800});
  const a=stage('collect',8,0,-210);assert.deepEqual(a.resident.cells,[]);assert.deepEqual(a.resident.pending,[]);
  const b=stage('place',8,1,256,0,a.cargo,a.resident);assert.deepEqual(totals(b),[8,800]);
  assert.equal(b.resident.cells[0].y,256);assert.equal(b.resident.cells[0].units,8);
});
test('creative transfer defaults disabled and never creates lava from empty cargo',()=>{
  const disabled=fixture({allowCreative:false});disabled.engine.insert(0,0,0,'lava',8);
  assert.equal(disabled.stage('collect',1),null);assert.equal(disabled.stage('place',1,1,0,0,held(1,80)),null);
  const f=fixture();assert.equal(f.stage('place',1),null);
});
test('blocked, protected, unloaded or unauthorized target leaves source and cargo untouched',()=>{
  const {engine,stage,host}=fixture();engine.insert(0,0,0,'lava',4);const saved=engine.save(),cargo=held(2,99);
  for(const [key,bad] of [['loaded',false],['open',false],['protected',true],['permitted',false],['terrain','solid']]){
    const old=host[key];host[key]=bad;assert.equal(stage('collect',1,0,0,0,cargo),null);
    assert.equal(stage('place',1,0,0,0,cargo),null);host[key]=old;
  }
  assert.deepEqual(engine.save(),saved);assert.deepEqual(cargo,held(2,99));
});
test('foreign liquid, invalid lava quantity and insufficient exact volume reject rather than mix or clamp',()=>{
  const {engine,stage}=fixture();engine.insert(0,0,0,'water',1);engine.insert(1,0,0,'lava',4,{'lava-heat':401});
  engine.insert(2,0,0,'lava',4,{'lava-heat':160});const saved=engine.save();
  for(const x of [0,1]){assert.equal(stage('collect',1,x),null);assert.equal(stage('place',1,x,0,0,held(1,80)),null);}
  assert.equal(stage('collect',5,2),null);assert.equal(stage('collect',4,2,0,0,held(5,100)),null);
  assert.equal(stage('place',5,2,0,0,held(5,400)),null);assert.equal(stage('place',2,2,0,0,held(1,50)),null);
  assert.deepEqual(engine.save(),saved);
});
test('resident cap rejection cannot spend held lava; compatible existing cell can receive it',()=>{
  const {engine,stage}=fixture({maxCells:1});engine.insert(0,0,0,'lava',4,{'lava-heat':100});
  const cargo=held(2,121),saved=engine.save();assert.equal(stage('place',2,1,0,0,cargo),null);
  assert.deepEqual(engine.save(),saved);assert.deepEqual(cargo,held(2,121));
  const p=stage('place',2,0,0,0,cargo);assert.deepEqual(totals(p),[6,221]);
});
test('single-use validation rejects stale state, terrain and permission, forged or foreign plans',()=>{
  const {engine,stage,host,adapter}=fixture();engine.insert(0,0,0,'lava',4);
  const a=stage('collect',1),b=stage('collect',1),c=stage('collect',1),d=stage('collect',1);
  assert.equal(adapter.validate(a,'state-2'),false);assert.equal(adapter.validate(a,'state-1'),false);
  host.revision='terrain-2';assert.equal(adapter.validate(b,'state-1'),false);host.revision='terrain-1';
  host.permitted=false;assert.equal(adapter.validate(c,'state-1'),false);host.permitted=true;
  assert.equal(adapter.validate({...d},'state-1'),false);assert.equal(fixture().adapter.validate(d,'state-1'),false);
  assert.equal(adapter.validate(d,'state-1'),true);assert.equal(adapter.validate(d,'state-1'),false);
});
test('invalid cargo, height, request and snapshot fail closed',()=>{
  const {stage,adapter,engine}=fixture();const saved=engine.save();
  for(const c of [held(0,1),held(1,101),held(9,0),{...held(1,0),id:'water'},
    {...held(1,0),quantities:{other:1}},{...held(1,0),quantities:{'lava-heat':null}}])assert.throws(()=>adapter.validateCargo(c));
  for(const y of [-211,257])assert.throws(()=>stage('place',1,0,y,0,held(1,1)));
  assert.throws(()=>stage('place',0));assert.throws(()=>stage('duplicate',1));
  assert.throws(()=>stage('place',1,0,0,0,held(1,1),{...saved,version:2}));
  assert.deepEqual(engine.save(),saved);
});
test('staged successor is immutable, serializable and retains unrelated liquid state',()=>{
  const {engine,stage}=fixture();engine.insert(0,0,0,'lava',3,{'lava-heat':77});engine.insert(3,0,0,'water',7);
  const p=stage('collect',1);const restored=JSON.parse(JSON.stringify(p.resident));
  assert.deepEqual(restored,p.resident);assert.equal(restored.cells.find(c=>c.id==='water').units,7);
  assert.ok(Object.isFrozen(p)&&Object.isFrozen(p.cargo.quantities)&&Object.isFrozen(p.resident.cells)&&Object.isFrozen(p.resident.pending[0]));
  assert.throws(()=>p.resident.cells.push({}));assert.throws(()=>p.cargo.quantities['lava-heat']=0);
});
