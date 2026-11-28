import test from 'node:test';
import {createLiquidEngine,LIQUID_IDS} from '../../../src/liquids/core/engine.mjs';
import {createLiquidOwnerHandoff} from '../../../src/liquids/core/owner-handoff.mjs';
import {createLiquidPersistence} from '../../../src/liquids/core/persistence.mjs';
import {createWaterPhaseTransitions} from '../../../src/liquids/water/physics/phase.mjs';
import {physicalRegionAt} from '../../../src/world-height.mjs';

const check=(v,msg='assertion failed')=>{if(!v)throw Error(msg);};
const eq=(a,b)=>check(JSON.stringify(a)===JSON.stringify(b),'Expected '+JSON.stringify(b)+', got '+JSON.stringify(a));
const throws=f=>{let ok=false;try{f();}catch{ok=true;}check(ok,'expected throw');};
const clone=o=>JSON.parse(JSON.stringify(o));
const definitions=LIQUID_IDS.map((id,i)=>({id,gravityLimit:0,lateralLimit:i===0?4:1}));
const faces=[[1,0,0],[0,0,1],[-1,0,0],[0,0,-1]];
const isOpen=(x,y,z)=>y===0&&Math.abs(x)+Math.abs(z)<=1;
const opts={definitions,isLoaded:()=>true,isOpen,maxCells:5,maxVisits:1};
function hub(id='water',over={}){
  const e=createLiquidEngine({...opts,lateralOrder:'rotating',...over});
  check(e.insert(0,0,0,id,8,{trace:83}));return e;
}
function cycle(e,id){
  const result=e.tick(1);eq(result.visited,1);check(result.changed.length<=5);
  const units=[],trace=[];
  for(const face of faces){const c=e.extract(...face,8);units.push(c?.units??0);trace.push(c?.quantities.trace??0);}
  const n=units.reduce((a,b)=>a+b,0),q=trace.reduce((a,b)=>a+b,0);
  eq(n,result.moved);if(n)check(e.insert(0,0,0,id,n,{trace:q}));
  eq(e.getCell(0,0,0).units,8);eq(e.getCell(0,0,0).quantities.trace,83);
  return units;
}
test('equal sustained drains rotate for all five identities and preserve quantities',()=>{
  for(const id of LIQUID_IDS){
    const e=hub(id),totals=[0,0,0,0],rate=id==='water'?4:1;
    for(let i=0;i<64;i++){const u=cycle(e,id);eq(u,faces.map((_,j)=>j===i%4?rate:0));u.forEach((n,j)=>totals[j]+=n);}
    eq(totals,[16*rate,16*rate,16*rate,16*rate]);
  }
});
test('fixed default keeps old behavior and old snapshots, rejects invalid policy',()=>{
  const e=createLiquidEngine(opts);e.insert(0,0,0,'water',8,{trace:83});
  for(let i=0;i<8;i++)eq(cycle(e,'water'),[4,0,0,0]);
  check(!Object.hasOwn(e.save(),'lateralPhases'));
  const old=clone(e.save()),r=createLiquidEngine({...opts,lateralOrder:'rotating',snapshot:old});
  eq(r.save(),old);eq(cycle(r,'water'),[4,0,0,0]);eq(cycle(r,'water'),[0,4,0,0]);
  throws(()=>createLiquidEngine({...opts,lateralOrder:'random'}));
});
test('phase replay survives JSON restore with exact order and volume',()=>{
  const a=hub();cycle(a,'water');cycle(a,'water');
  eq(a.save().lateralPhases,[[0,0,0,2]]);
  const b=createLiquidEngine({...opts,lateralOrder:'rotating',snapshot:clone(a.save())});
  for(let i=0;i<19;i++){eq(cycle(a,'water'),cycle(b,'water'));eq(a.save(),b.save());}
});
test('fixed mode preserves dormant phase for reversible policy switch',()=>{
  const a=hub();cycle(a,'water');
  const b=createLiquidEngine({...opts,snapshot:clone(a.save())});
  eq(cycle(b,'water'),[4,0,0,0]);eq(b.save().lateralPhases,[[0,0,0,1]]);
  const c=createLiquidEngine({...opts,lateralOrder:'rotating',snapshot:b.save()});
  eq(cycle(c,'water'),[0,4,0,0]);
});
test('blocked preferred face advances after actual service, not idle attempts',()=>{
  let open=false;const e=hub('water',{isOpen:(x,y,z)=>x===0&&y===0&&z===0||open&&y===0&&Math.abs(x)+Math.abs(z)===1&&x!==1});
  eq(e.tick(1).moved,0);check(!Object.hasOwn(e.save(),'lateralPhases'));
  open=true;e.wake(0,0,0);eq(cycle(e,'water'),[0,4,0,0]);eq(e.save().lateralPhases,[[0,0,0,2]]);
  eq(cycle(e,'water'),[0,0,4,0]);
});
test('resident cap retry retains phase and resumes next direction',()=>{
  const e=hub('water',{maxCells:2,isOpen:(x,y,z)=>isOpen(x,y,z)||x===9&&y===0&&z===0});
  cycle(e,'water');check(e.insert(9,0,0,'lava',1));
  eq(e.tick(1).moved,0);eq(e.save().capacityBlocked,[[0,0,0]]);eq(e.save().lateralPhases,[[0,0,0,1]]);
  e.tick(1);eq(e.tick(1).visited,0);check(e.extract(9,0,0,1));
  eq(cycle(e,'water'),[0,4,0,0]);
});
test('phase records are bounded, canonical, unique and reference occupied coordinates',()=>{
  const e=hub();cycle(e,'water');const s=e.save();
  for(const bad of [null,[[0,0,0,0]],[[0,0,0,4]],[[0,0,0,1.5]],[[1,0,0,1]],[[0,0,0,1],[0,0,0,2]],[[0,257,0,1]],[[0,0,0]]])
    throws(()=>createLiquidEngine({...opts,snapshot:{...s,lateralPhases:bad}}));
  e.extract(0,0,0,8);check(!Object.hasOwn(e.save(),'lateralPhases'));
  e.insert(0,0,0,'acid',8);check(!Object.hasOwn(e.save(),'lateralPhases'));
});
test('owner detach and attach preserve independent coordinate phase',()=>{
  let loaded=true;const ready=()=>loaded,owner=physicalRegionAt(0,0,0);
  const a=hub('water',{isLoaded:ready});cycle(a,'water');
  const h=createLiquidOwnerHandoff({...opts,isLoaded:ready,isOwnerLoaded:ready});
  loaded=false;const d=h.stage({state:{version:1,resident:a.save(),parked:[]},owner,mode:'detach'});
  check(d);check(!Object.hasOwn(d.state.resident,'lateralPhases'));
  eq(d.state.parked[0].snapshot.lateralPhases,[[0,0,0,1]]);
  check(Object.isFrozen(d.state.parked[0].snapshot.lateralPhases[0]));
  loaded=true;const r=h.stage({state:clone(d.state),owner,mode:'attach'});check(r);
  const b=createLiquidEngine({...opts,lateralOrder:'rotating',snapshot:r.state.resident});
  eq(cycle(b,'water'),[0,4,0,0]);
});
test('sidecar retains resident and parked phase and rejects malformed metadata',()=>{
  const a=hub();cycle(a,'water');const codec=createLiquidPersistence({definitions,worldId:'fixture',policyId:'rotate-v1'});
  const state=codec.migrateEngineSnapshot(a.save());
  const parked={owner:physicalRegionAt(16,0,0),snapshot:{version:1,cells:[{x:16,y:0,z:0,id:'acid',units:4,quantities:{}}],pending:[],lateralPhases:[[16,0,0,3]]}};
  const both={...state,parked:[parked]};const decoded=codec.decode(codec.encode(both));
  eq(decoded.resident.lateralPhases,[[0,0,0,1]]);
  eq(decoded.parked[0].snapshot.lateralPhases,[[16,0,0,3]]);
  throws(()=>codec.encode({...both,resident:{...both.resident,lateralPhases:[[0,0,0,4]]}}));
});
test('freeze removes phase at frozen coordinate and preserves unrelated resident phase',()=>{
  const a=hub();cycle(a,'water');
  const s=a.save();const other={x:8,y:0,z:0,id:'water',units:8,quantities:{trace:2}};
  const resident={...s,cells:[...s.cells,other],lateralPhases:[...s.lateralPhases,[8,0,0,2]]};
  let temp=0;const phase=createWaterPhaseTransitions({definitions,isLoaded:()=>true,isOpen:()=>true,temperatureAt:()=>temp,canFreeze:()=>true,canThaw:()=>true,allowFreeze:true,allowThaw:true});
  const f=phase.stage({state:{version:1,resident,frozen:[]},x:0,y:0,z:0,mode:'freeze'});check(f);
  eq(f.state.resident.lateralPhases,[[8,0,0,2]]);eq(f.water.quantities.trace,83);
  temp=3;const t=phase.stage({state:f.state,x:0,y:0,z:0,mode:'thaw'});check(t);
  eq(t.state.resident.lateralPhases,[[8,0,0,2]]);eq(t.state.resident.cells.reduce((n,c)=>n+c.units,0),16);
});
