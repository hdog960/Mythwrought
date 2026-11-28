import test from 'node:test';
import assert from 'node:assert/strict';
import {createSapSources} from '../../../src/liquids/amber-sap/physics/sources.mjs';
import {createSapSource,AMBER_SAP_DEFINITION} from '../../../src/liquids/amber-sap/physics/definition.mjs';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
const source=(x,stock=5,extra={})=>({x,y:0,z:0,treeId:'tree:'+x,stock,rate:3,...extra});
const clone=v=>JSON.parse(JSON.stringify(v));
const key=(x,y,z)=>[x,y,z].join(',');
function fixture(){
  const cells=new Map(),blocked=new Set();
  return {cells,blocked,getCell(x,y,z){return cells.get(key(x,y,z))??null;},
    insert(x,y,z,id,n){const k=key(x,y,z),c=cells.get(k);if(blocked.has(k)||c&&c.id!==id||(c?.units??0)+n>8)return false;
      cells.set(k,Object.freeze({x,y,z,id,units:(c?.units??0)+n,quantities:{}}));return true;}};
}
const remaining=s=>s.save().sources.map(x=>x.remaining);
const make=(engine,sources,opts={})=>createSapSources({engine,sources,isTreeAvailable:()=>true,...opts});
test('single source honors explicit cap without changing snapshot identity',()=>{
  const e=fixture(),s=createSapSource(source(0));const signature=s.save().signature;
  assert.equal(s.collect(e,()=>true,0),0);assert.equal(s.collect(e,()=>true,1),1);
  assert.equal(s.save().signature,signature);assert.equal(s.save().remaining,4);
  assert.throws(()=>s.collect(e,()=>true,9));assert.equal(s.collect(e,()=>true),3);
});
test('duplicate tree and duplicate destination admission fail closed',()=>{
  const e=fixture();assert.throws(()=>make(e,[source(0),source(1,5,{treeId:'tree:0'})]));
  assert.throws(()=>make(e,[source(0),source(0,5,{treeId:'another'})]));
  assert.throws(()=>make(e,[source(0,Number.MAX_SAFE_INTEGER),source(1,1)]));
  assert.throws(()=>make(e,[,source(1)]));assert.equal(e.cells.size,0);
});
test('global injection budget smaller than individual rate rotates fairly',()=>{
  const e=fixture(),s=make(e,[source(0),source(1),source(2)],{maxUnitsPerStep:2});
  for(let i=0;i<3;i++)assert.deepEqual(s.step(),{visited:1,inserted:2,changed:[[i,0,0]],fault:null});
  assert.deepEqual(remaining(s),[3,3,3]);assert.equal(s.save().cursor,0);
});
test('tree unavailable, blocked and foreign destinations do not spend reserves',()=>{
  const e=fixture();e.blocked.add('1,0,0');e.insert(2,0,0,'water',1);
  const s=make(e,[source(0),source(1),source(2),source(3)],{isTreeAvailable:id=>id!=='tree:0'});
  assert.deepEqual(s.step(),{visited:4,inserted:3,changed:[[3,0,0]],fault:null});
  assert.deepEqual(remaining(s),[5,5,5,2]);
});
test('visit budget bounded including empty and exhausted entries',()=>{
  const e=fixture(),s=make(e,[source(0,0),source(1,1),source(2,1)],{maxVisits:1});
  assert.equal(s.step().inserted,0);assert.equal(s.step().inserted,1);assert.equal(s.step().inserted,1);
  assert.equal(s.step().visited,1);assert.deepEqual(remaining(s),[0,0,0]);
  assert.deepEqual(make(e,[]).step(),{visited:0,inserted:0,changed:[],fault:null});
});
test('snapshot restores exact fairness and rejects missing, reordered or reset state',()=>{
  const e=fixture(),cfg=[source(0),source(1)],opts={maxVisits:1};const a=make(e,cfg,opts);a.step();
  const saved=clone(a.save()),f=fixture();for(const [k,c] of e.cells)f.cells.set(k,c);
  const b=make(f,cfg,{...opts,snapshot:saved});
  for(let i=0;i<5;i++){assert.deepEqual(a.step(),b.step());assert.deepEqual(a.save(),b.save());}
  assert.throws(()=>make(e,cfg,{...opts,snapshot:{...saved,sources:[null,saved.sources[1]]}}));
  assert.throws(()=>make(e,[...cfg].reverse(),{...opts,snapshot:saved}));
  assert.throws(()=>make(e,cfg,{...opts,snapshot:{...saved,sources:[{...saved.sources[0],remaining:6},saved.sources[1]]}}));
});
test('host callback fault retains earlier receipts and failed cursor',()=>{
  const e=fixture();let fail=true;const s=make(e,[source(0),source(1)],{isTreeAvailable:id=>{if(fail&&id==='tree:1')throw Error('fixture fault');return true;}});
  const r=s.step();assert.equal(r.fault.treeId,'tree:1');assert.equal(r.fault.error.message,'fixture fault');
  assert.deepEqual([r.inserted,r.changed,s.save().cursor,remaining(s)],[3,[[0,0,0]],1,[2,5]]);
  fail=false;assert.equal(s.step().inserted,5);assert.deepEqual(remaining(s),[0,2]);
});
test('reentrant step or save fails without spending the active source',()=>{
  const e=fixture();let s;s=make(e,[source(0)],{isTreeAvailable:()=>s.step()});
  assert.ok(s.step().fault);assert.deepEqual(remaining(s),[5]);
  s=make(e,[source(0)],{isTreeAvailable:()=>s.save()});assert.ok(s.step().fault);assert.equal(e.cells.size,0);
});
const corePath=process.env.LIQUID_ENGINE_MODULE;
test('actual core: finite reserves conserve through flow, drainage and coordinated restore',{skip:!corePath},async()=>{
  const {createLiquidEngine}=await import(pathToFileURL(resolve(corePath)).href);
  let loaded=true;const cfg=[source(0,17),source(1,13)];
  const setup=(snapshot=null)=>createLiquidEngine({definitions:[AMBER_SAP_DEFINITION],isLoaded:()=>loaded,
    isOpen:(x,y,z)=>z===0&&x>=0&&x<=1&&y>=-3&&y<=0,snapshot});
  let e=setup(),s=make(e,cfg,{maxUnitsPerStep:2});let drained=0;
  for(let i=0;i<5;i++){s.step();e.tick();}
  loaded=false;assert.equal(s.step().inserted,0);const saved=clone({engine:e.save(),sources:s.save()});
  e=setup(saved.engine);s=make(e,cfg,{maxUnitsPerStep:2,snapshot:saved.sources});loaded=true;
  for(let i=0;i<60;i++){s.step();e.tick();for(const x of [0,1])drained+=e.extract(x,-3,0,8)?.units??0;}
  assert.equal(remaining(s).reduce((a,b)=>a+b,0),0);
  assert.equal(drained+e.save().cells.reduce((n,c)=>n+c.units,0),30);
});
