import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createResonanceSources} from '../../../src/liquids/liquid-resonance/physics/finite-sources.mjs';
import {RESONANCE_ID as id,ENERGY_KEY as key} from '../../../src/liquids/liquid-resonance/physics/definition.mjs';
const source=(x,units=7,energy=19)=>({point:[x,0,0],rate:2,target:8,
  store:{version:1,id,storeId:'s'+x,anchor:'a'+x,capacity:8,units,energy,revision:0}});
// Explicit contract test double: no claims of real engine qualification here.
function host(){
  const cells=new Map();let allow=true;
  return {cells,setAllow:v=>{allow=v;},getCell:(...p)=>cells.get(p.join(','))??null,
    insert(x,y,z,id,units,q){if(!allow)return false;const k=[x,y,z].join(','),c=cells.get(k);
      if(c&&c.id!==id||(c?.units??0)+units>8)return false;
      cells.set(k,{x,y,z,id,units:(c?.units??0)+units,quantities:{[key]:(c?.quantities[key]??0)+(q[key]??0)}});return true;}};
}
const opts=(engine,sources,extra={})=>({engine,sources,authorize:()=>true,...extra});
const total=(engine,s)=>[...engine.cells.values(),...s.save().stores].reduce((a,c)=>[a[0]+c.units,a[1]+(c.energy??c.quantities?.[key]??0)],[0,0]);
test('finite stock depletes with exact energy remainder and no refill',()=>{
  const e=host(),s=createResonanceSources(opts(e,[source(0)]));
  const steps=Array.from({length:6},()=>s.step());assert.deepEqual(steps.map(r=>[r.units,r.energy]),[[2,5],[2,5],[2,6],[1,3],[0,0],[0,0]]);
  assert.deepEqual(total(e,s),[7,19]);assert.equal(s.save().stores[0].revision,4);
});
test('blocked core, denied containment and foreign liquid spend nothing',()=>{
  const e=host();let permitted=false;const s=createResonanceSources(opts(e,[source(0)],{authorize:()=>permitted}));const before=s.save();
  assert.equal(s.step().units,0);permitted=true;e.setAllow(false);assert.equal(s.step().units,0);
  e.setAllow(true);e.cells.set('0,0,0',{x:0,y:0,z:0,id:'water',units:1,quantities:{}});assert.equal(s.step().units,0);assert.deepEqual(s.save(),before);
});
test('global budget, round robin and outlet target',()=>{
  const e=host(),sources=[0,1,2].map(x=>({...source(x),target:2}));
  const s=createResonanceSources(opts(e,sources,{maxVisits:2,maxUnitsPerStep:1}));
  for(let i=0;i<6;i++){const r=s.step();assert.equal(r.units,1);assert.deepEqual(r.changed,[[i%3,0,0]]);}
  assert.equal(s.step().units,0);assert.deepEqual(total(e,s),[21,57]);
});
test('save restores cursor and stock, refuses identity/config/stock growth',()=>{
  const e=host(),o=opts(e,[source(0),source(1)],{maxVisits:1});const s=createResonanceSources(o);s.step();
  const snap=JSON.parse(JSON.stringify(s.save())),f=host();for(const [k,v] of e.cells)f.cells.set(k,structuredClone(v));
  const r=createResonanceSources({...o,engine:f,snapshot:snap});
  for(let i=0;i<10;i++){assert.deepEqual(s.step(),r.step());assert.deepEqual(s.save(),r.save());}
  assert.throws(()=>createResonanceSources({...o,maxVisits:2,snapshot:snap}));
  for(const patch of [{units:8},{energy:30},{anchor:'wrong'},{revision:0}]){
    const bad=structuredClone(snap);Object.assign(bad.stores[0],patch);assert.throws(()=>createResonanceSources({...o,snapshot:bad}));
  }
});
test('duplicate inventory IDs, anchors, outlets and invalid physical height rejected',()=>{
  const e=host(),a=source(0),b=source(1);for(const bad of [{...b,store:{...b.store,storeId:a.store.storeId}},{...b,store:{...b.store,anchor:a.store.anchor}},{...b,point:a.point},{...b,point:[1,257,0]}])assert.throws(()=>createResonanceSources(opts(e,[a,bad])));
});
test('empty and zero-energy stores do not manufacture energy; no automatic source creation',()=>{
  const e=host(),empty=createResonanceSources(opts(e,[]));assert.deepEqual(empty.step(),{visited:0,units:0,energy:0,changed:[]});
  const s=createResonanceSources(opts(e,[source(0,3,0)]));s.step();s.step();assert.deepEqual(total(e,s),[3,0]);assert.equal(s.step().units,0);
});
test('reentrant authorization refuses nested writes and leaves current stock intact',()=>{
  const e=host();let s;s=createResonanceSources(opts(e,[source(0)],{authorize:()=>s.step()}));const before=s.save();assert.throws(()=>s.step(),/Reentrant/);assert.deepEqual(s.save(),before);assert.equal(e.cells.size,0);
});
