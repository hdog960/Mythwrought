import test from 'node:test';
import assert from 'node:assert/strict';
import {createAmberBasin,AMBER_SAP_MATERIAL} from '../../../src/liquids/amber-sap/content/visuals.mjs';
import {AMBER_SAP_RENDER_MATERIAL,planAmberTap,inspectAmberBasin,planAmberDeposit} from '../../../src/liquids/amber-sap/content/sites.mjs';
const origin=[0,0,0], basin=createAmberBasin({x:0,y:0,z:0});
const k=p=>p.join(',');
function fixture(){
  const shell=new Set(basin.solid.map(k)),cells=new Map();
  const host={origin,engine:{getCell:(...p)=>cells.get(k(p))??null},isLoaded:()=>true,
    isOpen:(...p)=>!shell.has(k(p)),isLiner:(...p)=>shell.has(k(p)),canDeposit:()=>true,
    stockId:'stock-1',stockRevision:2,availableUnits:100,units:72};
  const put=(p,units,id='amber-sap')=>cells.set(k(p),Object.freeze({x:p[0],y:p[1],z:p[2],id,units,quantities:Object.freeze({})}));
  return {host,cells,shell,put};
}
const tap={treeId:'tree:17',anchor:[3,10,4],face:[1,0],stock:13,isLoaded:()=>true,
  isOpen:()=>true,isTreeAnchor:()=>true,canAttach:()=>true};
test('material matches presentation v1 transparent pass and original alpha',()=>{
  const m=AMBER_SAP_RENDER_MATERIAL;
  assert.deepEqual(m.color,[246/255,198/255,91/255]);assert.equal(m.alpha,AMBER_SAP_MATERIAL.opacity);
  assert.deepEqual([m.pass,m.depthTest,m.depthWrite,m.cull,m.blend,m.emissive],['transparent',true,false,false,'straight-alpha',0]);
  assert.ok(Object.isFrozen(m)&&Object.isFrozen(m.color));
});
test('tap is a finite physics descriptor, not a stock mutation',()=>{
  const p=planAmberTap(tap);
  assert.deepEqual(p.source,{x:4,y:10,z:4,treeId:'tree:17',stock:13,rate:1,target:8});
  assert.deepEqual(p.anchor,[3,10,4]);assert.ok(Object.isFrozen(p.source)&&Object.isFrozen(p.outlet));
  assert.equal(tap.stock,13);
});
test('tap refuses missing tree, protection, obstruction, unload and unsafe edges',()=>{
  for(const name of ['isTreeAnchor','canAttach','isOpen','isLoaded'])assert.equal(planAmberTap({...tap,[name]:()=>false}),null);
  assert.equal(planAmberTap({...tap,anchor:[Number.MAX_SAFE_INTEGER,10,0]}),null);
  assert.throws(()=>planAmberTap({...tap,face:[1,1]}));assert.throws(()=>planAmberTap({...tap,stock:-1}));
  assert.throws(()=>planAmberTap({...tap,anchor:[0,257,0]}));
  assert.ok(planAmberTap({...tap,anchor:[0,-210,0]}));
});
test('physical basin inspection counts partial fill, preserves exact cell identity',()=>{
  const {host,put,cells}=fixture();put([1,1,1],3);
  const b=inspectAmberBasin(host);assert.equal(b.freeUnits,69);assert.equal(b.slots.length,9);
  assert.equal(b.slots[0].expected,cells.get('1,1,1'));assert.equal(b.slots[0].room,5);
});
test('missing liner, hidden liquid, unloaded interior or foreign liquid rejects basin',()=>{
  const {host,shell,cells,put}=fixture();shell.delete('0,0,0');assert.equal(inspectAmberBasin(host),null);
  shell.add('0,0,0');put([0,0,0],1);assert.equal(inspectAmberBasin(host),null);cells.clear();
  assert.equal(inspectAmberBasin({...host,isLoaded:(x,y,z)=>k([x,y,z])!=='1,1,1'}),null);
  put([1,1,1],1,'water');assert.equal(inspectAmberBasin(host),null);
});
test('deposit balances exact finite debit, deterministic 9-cell capacity, no writes',()=>{
  const {host,cells}=fixture();const a=planAmberDeposit(host),b=planAmberDeposit(host);
  assert.deepEqual(a,b);assert.equal(a.stock.debit,72);assert.equal(a.stock.expectedUnits,100);
  assert.equal(a.inserts.length,9);assert.equal(a.inserts.reduce((n,i)=>n+i.units,0),72);
  assert.equal(cells.size,0);assert.ok(Object.isFrozen(a.inserts)&&Object.isFrozen(a.stock));
  assert.deepEqual(a.inserts[0].position,[1,1,1]);assert.deepEqual(a.inserts[8].position,[3,1,3]);
});
test('partial and protected destinations use only eligible capacity; reject shortfall',()=>{
  const {host,put,cells}=fixture();put([1,1,1],7);
  const h={...host,units:9,canDeposit:(x,y,z)=>k([x,y,z])!=='2,1,1'};
  const p=planAmberDeposit(h);assert.deepEqual(p.inserts.map(i=>[i.position,i.units]),[[[1,1,1],1],[[3,1,1],8]]);
  assert.equal(p.inserts[0].expected,cells.get('1,1,1'));
  assert.equal(planAmberDeposit({...h,units:58}),null);assert.equal(planAmberDeposit({...h,availableUnits:8}),null);
  assert.equal(cells.size,1);
});
test('invalid stock revision and oversized requests fail closed',()=>{
  const {host}=fixture();assert.throws(()=>planAmberDeposit({...host,stockRevision:-1}));
  assert.throws(()=>planAmberDeposit({...host,units:73}));assert.throws(()=>planAmberDeposit({...host,units:0}));
  assert.throws(()=>inspectAmberBasin({...host,origin:[0,256,0]}));
});
