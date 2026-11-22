import test from 'node:test';
import assert from 'node:assert/strict';
import {inspectD29OriginalRaisedRoute} from '../../../src/building-pool/roadmap-d/d29-raised-route-geometry.mjs';
const K=(x,y,z)=>`${x},${y},${z}`;
function fixture(){
 const cells=new Map(),nav=new Set(),floorXZ=new Set();
 for(let x=0;x<=14;x++){
  cells.set(K(x,7,0),{role:'roof',feature:'weather-plane',asset:'live:wood'});
  cells.set(K(x,0,0),{role:'foundation',asset:'live:stone'});
  if(x===0||x===14){
   for(let y=1;y<=6;y++)cells.set(K(x,y,0),{role:y===1?'floor':'wall',asset:'live:stone'});
  }else nav.add(K(x,2,0));
  floorXZ.add(x+',0');
 }
 const source={get:(x,y,z)=>cells.get(K(x,y,z)),nav,floorXZ};
 const span={originalStartBearing:[0,6,0],originalEndBearing:[14,6,0],
  sourceMidpoint:[7,6,0],axis:'x',Y6UnoccupiedOriginalColumns:13,
  originalRoofY8OrY9OccupiedColumns:0,constructionApproved:false,ratedLongSpan:false};
 return {source,span,cells,nav};
}
test('D29 exact rooted 14-cell source corridor can be examined with Y8 and Y9 empty without claiming support',()=>{
 const {source,span}=fixture();const r=inspectD29OriginalRaisedRoute(source,span);
 assert.equal(r.realRootedOriginalEndpoints,2);
 assert.equal(r.bothRaisedCoursesVacant,true);
 assert.equal(r.continuousVacantOriginalY8Route,true);
 assert.equal(r.constructionAllowed,false);
 assert.equal(r.entirelySourceVacantOutsideFoundationSites.length,2);
 assert.equal(r.exteriorSiteIsUnbuiltAndTerrainUnverified,true);
});
test('D29 roof tiers, forged bearing, missing WALKing or wood immediately veto route claims',()=>{
 const {source,span,cells,nav}=fixture();
 cells.set(K(5,8,0),{role:'roof',asset:'live:stone'});
 assert.throws(()=>inspectD29OriginalRaisedRoute(source,span),/obstruction evidence/);
 const occupied=inspectD29OriginalRaisedRoute(source,{...span,originalRoofY8OrY9OccupiedColumns:1});
 assert.equal(occupied.continuousVacantOriginalY8Route,false);
 assert.equal(occupied.continuousVacantOriginalY9Route,true);
 cells.delete(K(5,8,0));
 nav.delete(K(7,2,0));
 assert.throws(()=>inspectD29OriginalRaisedRoute(source,span),/missing original Y2 WALK/);
 nav.add(K(7,2,0));
 cells.delete(K(0,0,0));
 assert.throws(()=>inspectD29OriginalRaisedRoute(source,span),/rooted bearing/);
 cells.set(K(0,0,0),{role:'foundation',asset:'live:stone'});
 cells.set(K(8,7,0),{role:'roof',feature:'weather-plane',asset:'pack3:023'});
 assert.throws(()=>inspectD29OriginalRaisedRoute(source,span),/live:wood/);
 assert.throws(()=>inspectD29OriginalRaisedRoute(source,{...span,constructionApproved:true}),/unapproved/);
});
