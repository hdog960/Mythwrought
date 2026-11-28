import test from 'node:test';
import assert from 'node:assert/strict';
import {createLiquidEngine, LIQUID_IDS} from '../../../src/liquids/core/engine.mjs';
const p=[0,0,0], below=[0,-1,0], east=[1,0,0], north=[0,0,1];
const key=p=>p.join(',');
const room=(...points)=>{const set=new Set(points.map(key));return (...p)=>set.has(key(p));};
const engine=(opts={})=>createLiquidEngine({isLoaded:()=>true,isOpen:()=>true,definitions:LIQUID_IDS.map(id=>({id,gravityLimit:2,lateralLimit:1})),...opts});
const totals=e=>e.save().cells.reduce((a,c)=>{a.units+=c.units;for(const [k,v] of Object.entries(c.quantities))a[k]=(a[k]??0)+v;return a;},{units:0});
const unchanged=(e,fn)=>{const before=e.save();assert.equal(fn(),null);assert.deepEqual(e.save(),before);};

test('multiple destinations conserve volume and rounding remainder, no plan side effects',()=>{
  const e=engine({isOpen:room(p,below,east)});e.insert(...p,'liquid-resonance',8,{energy:37,trace:13});e.insert(...below,'liquid-resonance',5,{energy:10,trace:3});
  const before=e.save(),sum=totals(e),plan=e.planDisplacement(...p);assert.deepEqual(e.save(),before);
  assert.deepEqual(plan.moves.map(m=>m.units),[3,5]);assert.ok(Object.isFrozen(plan)&&Object.isFrozen(plan.moves)&&Object.isFrozen(plan.moves[0]));
  assert.deepEqual(e.commitDisplacement(plan),{moved:8,changed:[p,below,east]});assert.deepEqual(totals(e),sum);assert.equal(e.getCell(...p),null);
  assert.deepEqual(e.getCell(...below).quantities,{energy:23,trace:7});assert.deepEqual(e.getCell(...east).quantities,{energy:24,trace:9});
  assert.ok(e.save().pending.some(c=>key(c)===key(east)));unchanged(e,()=>e.commitDisplacement(plan));
});
test('sealed, full and foreign cells reject incomplete plan',()=>{
  const e=engine({isOpen:room(p,below,east)});e.insert(...p,'water',8);e.insert(...below,'water',7);e.insert(...east,'lava',1);unchanged(e,()=>e.planDisplacement(...p));
});
test('stale origin, destination and competing plans are rejected',()=>{
  const e=engine();e.insert(...p,'acid',8,{solute:55});let a=e.planDisplacement(...p);const c=e.extract(...p,8);e.insert(...p,c.id,c.units,c.quantities);unchanged(e,()=>e.commitDisplacement(a));
  a=e.planDisplacement(...p);e.insert(...below,'acid',1);unchanged(e,()=>e.commitDisplacement(a));
  a=e.planDisplacement(...p);const b=e.planDisplacement(...p);assert.ok(e.commitDisplacement(a));unchanged(e,()=>e.commitDisplacement(b));
});
test('unload and terrain closure between plan and commit preserve queue and cells',()=>{
  let loaded=true,blocked=false;const e=engine({isLoaded:(...c)=>key(c)===key(p)||loaded,isOpen:(...c)=>room(p,below,east)(...c)&&!(blocked&&key(c)===key(east))});
  e.insert(...p,'water',8);e.insert(...below,'water',5);let a=e.planDisplacement(...p);loaded=false;unchanged(e,()=>e.commitDisplacement(a));unchanged(e,()=>e.planDisplacement(...p));
  loaded=true;a=e.planDisplacement(...p);blocked=true;unchanged(e,()=>e.commitDisplacement(a));blocked=false;unchanged(e,()=>e.commitDisplacement(a));
});
test('whole-cell displacement works at resident cap',()=>{
  const e=engine({maxCells:1});e.insert(...p,'water',8);assert.ok(e.commitDisplacement(e.planDisplacement(...p)));assert.equal(e.save().cells.length,1);
});
test('resident cap recheck credits origin removal',()=>{
  const e=engine({maxCells:3,isOpen:room(p,below,east,north,[9,0,0])});
  // Quantity caps force separate recipients despite volume room in below.
  e.insert(...p,'water',8,{heat:8});e.insert(...below,'water',1,{heat:2**40-1});
  // The new recipient replaces the origin, so the full cap remains legal.
  const a=e.planDisplacement(...p);assert.deepEqual(a.moves.map(m=>m.units),[1,7]);e.insert(9,0,0,'water',1);assert.ok(e.commitDisplacement(a));assert.equal(e.save().cells.length,3);
});
test('quantity overflow and ninth key reject rather than truncate',()=>{
  const e=engine({isOpen:room(p,below)});e.insert(...p,'water',8,{heat:8});e.insert(...below,'water',1,{heat:2**40});unchanged(e,()=>e.planDisplacement(...p));
  const f=engine({isOpen:room(p,below)});f.insert(...p,'water',2,{i:2});f.insert(...below,'water',1,{a:1,b:1,c:1,d:1,e:1,f:1,g:1,h:1});unchanged(f,()=>f.planDisplacement(...p));
});
test('plans cannot be forged or reused across instances or restore',()=>{
  const e=engine();e.insert(...p,'water',8);const a=e.planDisplacement(...p),f=engine({snapshot:JSON.parse(JSON.stringify(e.save()))});unchanged(f,()=>f.commitDisplacement(a));unchanged(e,()=>e.commitDisplacement({...a}));assert.ok(e.commitDisplacement(a));
});
test('all five IDs conserve at both physical height boundaries',()=>{
  for(const id of LIQUID_IDS)for(const y of [-210,256]){
    const a=[0,y,0],b=[0,y===256?255:-209,0],e=engine({isOpen:room(a,b)});e.insert(...a,id,8,{trace:7});assert.ok(e.commitDisplacement(e.planDisplacement(...a)));assert.equal(e.getCell(...b).id,id);assert.deepEqual(totals(e),{units:8,trace:7});
    const f=engine({isOpen:room(a,b),snapshot:JSON.parse(JSON.stringify(e.save()))});assert.deepEqual(f.tick(1),e.tick(1));assert.deepEqual(f.save(),e.save());
  }
});
test('host callback exception before writes leaves exact state intact',()=>{
  let fail=false;const e=engine({isOpen:(...c)=>{if(fail&&key(c)===key(east))throw Error('host failure');return room(p,below,east)(...c);}});e.insert(...p,'water',8);e.insert(...below,'water',5);const a=e.planDisplacement(...p),before=e.save();fail=true;assert.throws(()=>e.commitDisplacement(a),/host failure/);assert.deepEqual(e.save(),before);
});
test('tight resident budget uses occupied compatible neighbors before empty slots',()=>{
  const e=engine({maxCells:2,isOpen:room(p,below,east,north)});e.insert(...p,'amber-sap',8,{trace:19});e.insert(...east,'amber-sap',4,{trace:2});
  const a=e.planDisplacement(...p);assert.deepEqual(a.moves.map(m=>[m.after.x,m.after.y,m.units]),[[1,0,4],[0,-1,4]]);
  assert.ok(e.commitDisplacement(a));assert.equal(e.save().cells.length,2);assert.deepEqual(totals(e),{units:12,trace:21});
});
test('empty or newly obstructed origin is refused without creating a source',()=>{
  let open=true;const e=engine({isOpen:(...c)=>key(c)!==key(p)||open});unchanged(e,()=>e.planDisplacement(...p));e.insert(...p,'water',4);open=false;unchanged(e,()=>e.planDisplacement(...p));
});
