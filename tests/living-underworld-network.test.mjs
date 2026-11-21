import test from 'node:test';
import assert from 'node:assert/strict';
import {planUnderworldRegion,networkAirAt,auditUnderworldRegionGraph,UNDERWORLD_LEVELS,UNDERWORLD_REGION_SIDE}
  from '../src/living-underworld/worldwide-network.mjs';

test('every region joins all four neighbors on every depth layer',()=>{
 for(const seed of [179,-987,2026])for(const [rx,rz] of [[0,0],[-1,0],[1,-2],[30,-30],[-301,201]]){
   const report=auditUnderworldRegionGraph(seed,rx,rz);
   assert.equal(report.passed,true);
   assert.equal(report.joins.length,4);
   assert.equal(report.caveMouthConnectedToSurface,false);
 }
});
test('physical AIR crosses east and south region boundaries at all four levels',()=>{
 for(const seed of [179,2026])for(const [rx,rz] of [[0,0],[-2,-3],[128,-128]]){
   const plan=planUnderworldRegion(seed,rx,rz);
   for(const level of plan.layers){
     const east=level.portals.east,south=level.portals.south;
     for(let d=-3;d<=3;d++){
       assert.ok(networkAirAt(seed,east.x+d,east.y,east.z),
         'sealed east seam '+JSON.stringify({seed,rx,rz,level:level.name,d}));
       assert.ok(networkAirAt(seed,south.x,south.y,south.z+d),
         'sealed south seam '+JSON.stringify({seed,rx,rz,level:level.name,d}));
     }
   }
 }
});
test('region hubs connect to physical underground air at four full depths',()=>{
 for(const seed of [179,-17])for(const [rx,rz] of [[0,0],[70,-90],[-91,74]]){
   const plan=planUnderworldRegion(seed,rx,rz);
   assert.equal(plan.layers.length,UNDERWORLD_LEVELS.length);
   for(const l of plan.layers)assert.equal(networkAirAt(seed,l.hub.x,l.hub.y,l.hub.z),true);
   assert.equal(networkAirAt(seed,plan.surfaceSocket.x,-4,plan.surfaceSocket.z),true);
   assert.equal(networkAirAt(seed,plan.surfaceSocket.x,0,plan.surfaceSocket.z),false);
 }
});
test('world-region plans deterministic at signed far coordinates regardless of cache churn',()=>{
 const seed=314159,rx=-1234,rz=2345;
 const before=JSON.stringify(planUnderworldRegion(seed,rx,rz));
 for(let i=0;i<60;i++)planUnderworldRegion(seed,i,-i);
 const after=JSON.stringify(planUnderworldRegion(seed,rx,rz));
 assert.equal(after,before);
 assert.equal(UNDERWORLD_REGION_SIDE,256);
 assert.throws(()=>planUnderworldRegion(seed,1.5,0),/Invalid/);
 assert.throws(()=>networkAirAt(seed,1.25,-27,0),/Invalid/);
});
test('provisional city geometry exists repeatedly and occupies air near its center',()=>{
 let sites=0;
 for(let rx=-7;rx<=7;rx++)for(let rz=-7;rz<=7;rz++){
   const candidate=planUnderworldRegion(179,rx,rz).cityCandidate;
   if(!candidate)continue;
   sites++;
   assert.ok(candidate.rx>=100&&candidate.rz>=100);
   assert.ok(candidate.rx*2>=200);
   assert.equal(candidate.status,'geometry-candidate-only');
   assert.equal(networkAirAt(179,candidate.x,candidate.y,candidate.z),true);
 }
 assert.ok(sites>=4&&sites<=60,'city candidate density is unexpectedly degenerate: '+sites);
});
