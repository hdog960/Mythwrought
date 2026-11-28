import test from 'node:test';
import assert from 'node:assert/strict';
import {describeLavaFormation as describe,createLavaFormationPlanner as planner,LAVA_FORMATION_KINDS} from '../../../src/liquids/lava/content/formations.mjs';
const origin={x:-17,y:-40,z:15};
const pos=p=>`${p.x},${p.y},${p.z}`;
const observation=(over={})=>({loaded:true,protected:false,liquid:null,terrain:'air',revision:'a',...over});
const host=(over={})=>({inspect:()=>observation(),canSeed:()=>true,canPlaceLining:()=>true,isSuitableLining:()=>true,...over});

test('all footprints have unique editable physical cells, supported floor and sealed face rim',()=>{
  for(const [kind,count] of [['vent',1],['pool',13],['channel',11]]){
    const g=describe({kind,...origin}),s=new Set(g.solids.map(pos)),l=new Set(g.seeds.map(pos));
    assert.equal(g.seeds.length,count);assert.equal(s.size,g.solids.length);assert.equal(l.size,count);
    for(const p of g.seeds){assert(!s.has(pos(p)));assert(s.has(pos({...p,y:p.y-1})));
      for(const [dx,dz] of [[1,0],[0,1],[-1,0],[0,-1]]){const n={...p,x:p.x+dx,z:p.z+dz};if(!l.has(pos(n))){assert(s.has(pos(n)));assert(s.has(pos({...n,y:n.y-1})));}}}
    assert(g.solids.length+g.seeds.length<=64);assert(Object.isFrozen(g)&&Object.isFrozen(g.seeds)&&Object.isFrozen(g.seeds[0]));
  }
});
test('each footprint is connected and deterministic across negative owner seams',()=>{
  for(const kind of LAVA_FORMATION_KINDS){const g=describe({kind,...origin}),cells=new Set(g.seeds.map(pos)),seen=new Set(),queue=[g.seeds[0]];
    while(queue.length){const p=queue.pop(),k=pos(p);if(seen.has(k))continue;seen.add(k);for(const [dx,dz] of [[1,0],[0,1],[-1,0],[0,-1]]){const n={...p,x:p.x+dx,z:p.z+dz};if(cells.has(pos(n))&&!seen.has(pos(n)))queue.push(n);}}
    assert.equal(seen.size,cells.size);assert.deepEqual(g,describe({kind,...origin}));}
});
test('explicit initial volume and finite vent reserve are independently accounted',()=>{
  const g=describe({kind:'vent',...origin,initialUnits:3,ventStock:21,heatPerUnit:72,ventRate:2});
  assert.equal(g.initialVolume,3);assert.equal(g.totalVolume,24);assert.deepEqual(g.vent,{...origin,rate:2,heatPerUnit:72,remaining:21,renewable:false});
  assert.equal(g.seeds[0].heatPerUnit,72);assert.equal(describe({kind:'vent',...origin}).vent,null);
  assert.throws(()=>describe({kind:'pool',...origin,ventStock:1}),RangeError);
});
test('physical height and integer coordinate edges reject the whole formation',()=>{
  assert.throws(()=>describe({kind:'vent',...origin,y:-210}),RangeError);
  assert.throws(()=>describe({kind:'vent',...origin,y:257}),RangeError);
  assert.throws(()=>describe({kind:'pool',...origin,x:Number.MAX_SAFE_INTEGER}),RangeError);
  assert.equal(describe({kind:'vent',...origin,y:-209}).solids[0].y,-210);
  assert.equal(describe({kind:'vent',...origin,y:256}).seeds[0].y,256);
  for(const o of [{initialUnits:0},{initialUnits:9},{ventStock:4097},{heatPerUnit:101},{ventRate:0}])assert.throws(()=>describe({kind:'vent',...origin,...o}),RangeError);
});
test('suitable existing floor is retained; only air becomes lining',()=>{
  const p=planner(host({inspect:(x,y,z)=>observation({terrain:y===origin.y-1?'solid':'air'})}));
  const a=p.plan({kind:'pool',...origin});assert(a);assert(a.terrainWrites.every(c=>c.role==='rim'));
  assert(a.checks.length>a.terrainWrites.length+a.geometry.seeds.length);assert(p.validate(a));assert(!p.validate(a));
});
test('unloaded, protected, occupied, unsuitable or unauthorized cells reject atomically',()=>{
  for(const over of [{loaded:false},{protected:true},{liquid:{id:'water'}},{liquid:{id:'lava'}},{terrain:'unknown'},{revision:''}]){
    const p=planner(host({inspect:(x,y,z)=>observation(x===origin.x&&y===origin.y&&z===origin.z?over:{})}));assert.equal(p.plan({kind:'vent',...origin}),null);}
  for(const cb of ['canSeed','canPlaceLining'])assert.equal(planner(host({[cb]:()=>false})).plan({kind:'vent',...origin}),null);
  assert.equal(planner(host({inspect:()=>observation({terrain:'solid'}),isSuitableLining:()=>false})).plan({kind:'vent',...origin}),null);
  assert.equal(planner(host({inspect:()=>observation({terrain:'solid'})})).plan({kind:'vent',...origin}),null);
});
test('stale revisions, changed permissions and foreign or forged plans cannot validate',()=>{
  let revision='a',allowed=true;
  const p=planner(host({inspect:()=>observation({revision}),canSeed:()=>allowed}));
  let a=p.plan({kind:'channel',...origin});assert(a);revision='b';assert(!p.validate(a));
  a=p.plan({kind:'channel',...origin});allowed=false;assert(!p.validate(a));allowed=true;
  a=p.plan({kind:'channel',...origin});assert(!planner(host()).validate(a));assert(!p.validate({...a}));assert(p.validate(a));
});
test('pure planning reads only explicit bounded cells and never writes host state',()=>{
  const read=[];const frozen=Object.freeze(observation());const p=planner(host({inspect:(x,y,z)=>{read.push(pos({x,y,z}));return frozen;}}));
  const a=p.plan({kind:'channel',...origin});assert(a);assert.equal(read.length,a.checks.length);assert.equal(new Set(read).size,read.length);assert(read.length<=64);assert(p.validate(a));assert.equal(read.length,2*a.checks.length);
});
