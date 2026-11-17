import test from 'node:test';
import assert from 'node:assert/strict';
import {g2RegionKey,createG2PrefetchState,planG2Prefetch,settleG2Prefetch,
 cancelG2Prefetch,G2_MAX_NEW_PREFETCH,G2_MAX_PENDING_PREFETCH}
 from '../../src/creative-integration/g2-streaming.mjs';
import {createG2FlightState,armG2Flight} from '../../src/creative-integration/g2-flight.mjs';
import {inspectG2Landing,commitG2Landing,G2_MAX_LANDING_CANDIDATES}
 from '../../src/creative-integration/g2-landing.mjs';
const sectionForY=y=>y<0?-1:0;
const p=(x,y=6,z=0)=>({x,y,z});
const F=createG2PrefetchState('seed:179','east');
const plan=(state,points,opts={})=>planG2Prefetch(state,{worldToken:'seed:179',
 intentToken:'east',points,sectionForY,isRegionReady:()=>false,...opts});
const flight=()=>armG2Flight(createG2FlightState({position:p(0),heightBounds:{minFeet:-20,maxFeet:25},
 worldToken:'seed:179'}),{enabled:true,isRegionReady:()=>true,isBodyClear:()=>true});
const landingHost={worldToken:'seed:179',findGroundCandidates:()=>[p(0,4)],
 isRegionReady:()=>true,isBodyClear:()=>true,hasGroundSupport:()=>true,isSafeDescent:()=>true};
test('G2A region key uses 16-cell XZ and source-provided vertical section',()=>{
 assert.equal(g2RegionKey(p(16,-1,-1),sectionForY),'1,-1,-1');
 assert.equal(g2RegionKey(p(-1,5,16),sectionForY),'-1,1,0');
 assert.throws(()=>g2RegionKey(p(0),()=>null),/section/);
});
test('G2A prefetch plans at most two new unique requests per tick',()=>{
 const r=plan(F,[p(1),p(17),p(33),p(49)]);
 assert.equal(r.requests.length,G2_MAX_NEW_PREFETCH);
 assert.equal(r.state.pending.length,2);
 assert.deepEqual(r.cancelled,[]);
 const next=plan(r.state,[p(1),p(17),p(33)]);
 assert.equal(next.requests.length,1);
 assert.equal(next.state.pending.length,3);
});
test('G2A prefetch deduplicates repeated region positions',()=>{
 const out=plan(F,[p(1),p(2),p(3),p(4)]);
 assert.equal(out.requests.length,1);
 assert.equal(out.state.pending.length,1);
});
test('G2A prefetch never grows past six pending requests',()=>{
 let s=F;
 for(let i=0;i<12;i++)s=plan(s,[p(16*i),p(16*(i+1))]).state;
 assert.equal(s.pending.length,G2_MAX_PENDING_PREFETCH);
});
test('G2A direction/world changes produce cancellation plans, not world commands',()=>{
 const a=plan(F,[p(0),p(17)]);
 const changed=planG2Prefetch(a.state,{worldToken:'seed:179',intentToken:'west',
  points:[p(-17)],sectionForY,isRegionReady:()=>false});
 assert.equal(changed.cancelled.length,2);
 assert.equal(changed.state.pending.length,1);
 const switchWorld=planG2Prefetch(changed.state,{worldToken:'seed:180',intentToken:'west',
  points:[p(33)],sectionForY,isRegionReady:()=>false});
 assert.deepEqual(switchWorld.cancelled,[changed.state.pending[0].key]);
 assert.equal(switchWorld.state.worldToken,'seed:180');
});
test('G2A settling/cancelling queued plans never mutate prior immutable state',()=>{
 const a=plan(F,[p(0),p(17)]),done=settleG2Prefetch(a.state,[a.requests[0].key]);
 assert.equal(done.pending.length,1);assert.equal(a.state.pending.length,2);
 const cancel=cancelG2Prefetch(done);assert.equal(cancel.cancelled.length,1);
 assert.equal(cancel.state.pending.length,0);assert.ok(Object.isFrozen(done));
});
test('G2A prefetch rejects unsafe coordinates and missing real readiness',()=>{
 assert.throws(()=>plan(F,[p(Infinity)]),/non-finite/);
 assert.throws(()=>planG2Prefetch(F,{worldToken:'seed:179',intentToken:'east',points:[],
 sectionForY}),/planning/);
});
test('G2A finds a host-verified solid, clear, streamed landing',()=>{
 const assessment=inspectG2Landing(flight(),landingHost);
 assert.equal(assessment.canLand,true);assert.deepEqual(assessment.position,p(0,4));
 assert.equal(assessment.landed,false);
});
test('G2A landing fails closed on unloaded, unsupported, colliding or unsafe descent',()=>{
 for(const key of ['isRegionReady','isBodyClear','hasGroundSupport','isSafeDescent']){
  const h={...landingHost,[key]:()=>false};
  assert.equal(inspectG2Landing(flight(),h).canLand,false,key);
 }
 const other={...landingHost,worldToken:'seed:other'};
 assert.throws(()=>inspectG2Landing(flight(),other),/live flight state/);
});
test('G2A landing refuses distant, rising, out-of-height and overlarge searches',()=>{
 const source=flight();
 for(const candidate of [p(9,4),p(0,7),p(0,-40),p(Infinity,4)]){
  assert.equal(inspectG2Landing(source,{...landingHost,
    findGroundCandidates:()=>[candidate]}).canLand,false);
 }
 assert.throws(()=>inspectG2Landing(source,{...landingHost,
  findGroundCandidates:()=>Array(G2_MAX_LANDING_CANDIDATES+1).fill(p(0,4))}),/bounded budget/);
});
test('G2A does not force gravity when landing is missing or changes after approval',()=>{
 const s=flight();const assessed=inspectG2Landing(s,landingHost);
 const changed={...landingHost,hasGroundSupport:()=>false};
 const r=commitG2Landing(s,assessed,changed);
 assert.equal(r.landed,false);assert.equal(r.state.mode,'flight');
 assert.equal(r.restorePlayer,null);
});
test('G2A successful landing describes safe grounded restore without applying world changes',()=>{
 const s=flight(),check=inspectG2Landing(s,landingHost),r=commitG2Landing(s,check,landingHost);
 assert.equal(r.landed,true);assert.equal(r.state.mode,'off');
 assert.deepEqual(r.restorePlayer,{position:p(0,4),vX:0,vY:0,vZ:0,onGround:true});
 assert.equal(s.mode,'flight');assert.ok(Object.isFrozen(r.restorePlayer));
});
test('G2A refuses stale world landing authority even if candidate coordinates match',()=>{
 const s=flight(),v=inspectG2Landing(s,landingHost);
 assert.throws(()=>commitG2Landing(s,v,{...landingHost,worldToken:'seed:180'}),/live flight state/);
});
