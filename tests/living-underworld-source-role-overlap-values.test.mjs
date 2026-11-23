import test from 'node:test';
import assert from 'node:assert/strict';
import {createUnderpassSourceOverlapValueWitness as make}
 from '../src/living-underworld/source-role-overlap-values.mjs';
const P=(x,y,z)=>({x,y,z});
const roles=['naturalAt','authoredAt','editedAt','protectedAt'];
const value=role=>role==='naturalAt'?1:role==='authoredAt'?undefined:false;
const observe=(w,stage,xyz,overrides={})=>{
 for(const {x,y,z} of xyz)for(const role of roles)
  w.observe(stage,role,x,y,z,role in overrides?overrides[role]:value(role));
};
const run=(bridge,pad,modifier=()=>{})=>{
 const w=make({bridgeCoordinates:bridge.map(p=>p.x+','+p.y+','+p.z),
  padCoordinates:pad.map(p=>p.x+','+p.y+','+p.z)});
 observe(w,'bridge',bridge);w.enterPad();modifier(w);
 observe(w,'pad',pad);return w.audit();
};
test('identical four original reader values at bridge/pad overlap pass without extra calls',()=>{
 const result=run([P(0,-20,0),P(1,-20,0)],[P(1,-20,0),P(2,-20,0)]);
 assert.equal(result.ok,true);
 assert.equal(result.independentSharedVoxels,1);
 assert.deepEqual(result.overlapComparisonsByRole,
  {naturalAt:1,authoredAt:1,editedAt:1,protectedAt:1});
 assert.equal(result.comparedSourceValues,4);
 assert.equal(result.originalM7WorldTested,false);
 assert.equal(result.noWorldWrites,true);
});
test('naturalAt changing between two allowed geology IDs is independently refused',()=>{
 const shared=P(0,-20,0),w=make({bridgeCoordinates:['0,-20,0'],padCoordinates:['0,-20,0']});
 observe(w,'bridge',[shared]);w.enterPad();observe(w,'pad',[shared],{naturalAt:2});
 const result=w.audit();assert.equal(result.ok,false);
 assert.equal(result.reason,'OVERLAP_SOURCE_ROLE_VALUE_CHANGED');
 assert.deepEqual(result.firstMismatch,{stage:'pad',role:'naturalAt',coordinate:'0,-20,0'});
});
test('authoredAt disappearing or changing ownership between stages refuses',()=>{
 const w=make({bridgeCoordinates:['0,-20,0'],padCoordinates:['0,-20,0']});
 observe(w,'bridge',[P(0,-20,0)]);w.enterPad();
 observe(w,'pad',[P(0,-20,0)],{authoredAt:0});
 assert.equal(w.audit().reason,'OVERLAP_SOURCE_ROLE_VALUE_CHANGED');
});
test('changing protectedAt and editedAt on a shared cell refuses independently',()=>{
 for(const role of ['protectedAt','editedAt']){
  const w=make({bridgeCoordinates:['0,-20,0'],padCoordinates:['0,-20,0']});
  observe(w,'bridge',[P(0,-20,0)]);w.enterPad();
  observe(w,'pad',[P(0,-20,0)],{[role]:true});
  const result=w.audit();assert.equal(result.ok,false);
  assert.equal(result.firstMismatch.role,role);
 }
});
test('zero bridge-to-pad shared coordinates pass with zero comparison counts',()=>{
 const result=run([P(0,-20,0)],[P(1,-20,0)]);
 assert.equal(result.ok,true);assert.equal(result.independentSharedVoxels,0);
 assert.equal(result.comparedSourceValues,0);
});
test('two shared cells compare exactly eight role values, not source-visit totals',()=>{
 const result=run([P(0,-20,0),P(1,-20,0),P(2,-20,0)],
  [P(1,-20,0),P(2,-20,0),P(3,-20,0)]);
 assert.equal(result.ok,true);assert.equal(result.independentSharedVoxels,2);
 assert.equal(result.comparedSourceValues,8);
});
test('missing a pad read for just one role refuses despite available matching values',()=>{
 const w=make({bridgeCoordinates:['0,-20,0'],padCoordinates:['0,-20,0']});
 observe(w,'bridge',[P(0,-20,0)]);w.enterPad();
 for(const role of roles.filter(x=>x!=='naturalAt'))
  w.observe('pad',role,0,-20,0,value(role));
 const result=w.audit();assert.equal(result.ok,false);
 assert.equal(result.reason,'OVERLAP_VALUE_SOURCE_COVERAGE_REFUSED');
 assert.equal(result.overlapComparisonsByRole.naturalAt,0);
});
test('duplicate stage observations cannot be used to forge complete source coverage',()=>{
 const w=make({bridgeCoordinates:['0,-20,0'],padCoordinates:['0,-20,0']});
 observe(w,'bridge',[P(0,-20,0)]);
 w.observe('bridge','naturalAt',0,-20,0,1);
 w.enterPad();observe(w,'pad',[P(0,-20,0)]);
 assert.equal(w.audit().reason,'OVERLAP_VALUE_SOURCE_COVERAGE_REFUSED');
});
test('invalid stage, source role, values, or unapproved coordinates throw before admission',()=>{
 const w=make({bridgeCoordinates:['0,-20,0'],padCoordinates:['0,-20,0']});
 assert.throws(()=>w.observe('pad','naturalAt',0,-20,0,1),/Invalid.*observation/);
 assert.throws(()=>w.observe('bridge','wrong',0,-20,0,1),/Invalid.*observation/);
 assert.throws(()=>w.observe('bridge','naturalAt',1,-20,0,1),/Invalid.*observation/);
 assert.throws(()=>w.observe('bridge','naturalAt',0,-20,0,NaN),/Invalid.*role value/);
 assert.throws(()=>w.observe('bridge','editedAt',0,-20,0,1),/Invalid.*role value/);
});
test('mutable caller input manifests are copied before original reader calls',()=>{
 const b=['0,-20,0'],p=['0,-20,0'];const w=make({bridgeCoordinates:b,padCoordinates:p});
 b[0]='999,-20,0';p.push('1,-20,0');
 observe(w,'bridge',[P(0,-20,0)]);w.enterPad();
 observe(w,'pad',[P(0,-20,0)]);
 assert.equal(w.audit().ok,true);
});
test('malformed manifests, duplicate keys and impossible bounds fail before any reads',()=>{
 for(const x of [null,[],['0,-20,0','0,-20,0'],['0.5,-20,0'],['0,-20,NaN']])
  assert.throws(()=>make({bridgeCoordinates:x,padCoordinates:['0,-20,0']}),
   /Invalid.*manifest|Duplicate.*coordinate/);
 assert.throws(()=>make({bridgeCoordinates:['0,-20,0'],padCoordinates:['0,-20,0'],
  maxCells:20001}),/witness budget/);
});
test('only one transition and one immutable audit are allowed; no hidden world mutation',()=>{
 const w=make({bridgeCoordinates:['0,-20,0'],padCoordinates:['0,-20,0']});
 assert.throws(()=>w.audit(),/Invalid completed/);
 observe(w,'bridge',[P(0,-20,0)]);w.enterPad();
 assert.throws(()=>w.enterPad(),/Invalid.*stage transition/);
 observe(w,'pad',[P(0,-20,0)]);const result=w.audit();
 assert.equal(Object.isFrozen(result),true);
 assert.equal(Object.isFrozen(result.overlapComparisonsByRole),true);
 assert.throws(()=>w.audit(),/Invalid completed/);
 assert.throws(()=>w.observe('pad','naturalAt',0,-20,0,1),/Invalid.*observation/);
 assert.equal(result.worldChanged,false);
});
