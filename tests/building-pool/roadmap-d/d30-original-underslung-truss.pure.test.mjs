import test from 'node:test';
import assert from 'node:assert/strict';
import {inspectD30OriginalUnderslungCorridor}
 from '../../../src/building-pool/roadmap-d/d30-underslung-corridor-geometry.mjs';
const K=(x,y,z)=>`${x},${y},${z}`;
function fixture(){
 const map=new Map(),nav=new Set();
 for(let x=0;x<=14;x++){
  map.set(K(x,7,0),{role:'roof',feature:'weather-plane',asset:'live:wood'});
  map.set(K(x,0,0),{role:'foundation',asset:'live:stone'});
  map.set(K(x,1,0),{role:'floor',asset:'live:wood'});
  if(x===0||x===14)for(let y=2;y<=6;y++)map.set(K(x,y,0),{role:'wall',asset:'live:stone'});
  else nav.add(K(x,2,0));
 }
 const row={sourceOriginalStartBearing:[0,6,0],sourceOriginalEndBearing:[14,6,0],
  spanCells:13,clearance:{axis:'x',realRootedOriginalEndpoints:2,constructionAllowed:false},
  unratedScreen:{structuralReleaseAccepted:false,constructionAllowed:false},
  loadPathDraftOnly:true,longBayPhysicalLoadAcceptance:false};
 return {source:{get:(x,y,z)=>map.get(K(x,y,z)),nav},map,nav,row};
}
test('D30 source-cell underslung plane fits pure original-height corridor without inserting a Y2 pier',()=>{
 const {source,row}=fixture(),r=inspectD30OriginalUnderslungCorridor(source,row);
 assert.equal(r.exactOriginalY5Y6CourseFree,true);
 assert.equal(r.authoredY2WalkColumnsPreserved,13);
 assert.deepEqual(r.theoreticalCenterlineYRange,[5.5,6.5]);
 assert.equal(r.originalY7FullCubeWoodUnchanged,true);
 assert.equal(r.actualPhysicalEnvelopeClearanceCertified,false);
 assert.equal(r.canPlaceTruss,false);
});
test('D30 refuses colliding original Y5, missing WALK, false foundation, substituted Y7, forged admission',()=>{
 const {source,map,nav,row}=fixture();
 map.set(K(5,5,0),{role:'partition',asset:'live:wood'});
 nav.delete(K(5,2,0));
 let r=inspectD30OriginalUnderslungCorridor(source,row);
 assert.equal(r.exactOriginalY5Y6CourseFree,false);
 assert.equal(r.originalY5InteriorObstructedCells,1);
 map.delete(K(5,5,0));
 assert.throws(()=>inspectD30OriginalUnderslungCorridor(source,row),/lost its walk node/);
 nav.add(K(5,2,0));
 map.set(K(8,6,0),{role:'beam',asset:'live:wood'});
 assert.throws(()=>inspectD30OriginalUnderslungCorridor(source,row),/overlaps authored Y6/);
 map.delete(K(8,6,0));
 map.delete(K(0,0,0));
 assert.throws(()=>inspectD30OriginalUnderslungCorridor(source,row),/rooted Y5\/Y6/);
 map.set(K(0,0,0),{role:'foundation',asset:'live:stone'});
 map.set(K(8,7,0),{role:'roof',feature:'weather-plane',asset:'pack3:023'});
 assert.throws(()=>inspectD30OriginalUnderslungCorridor(source,row),/Y7 wood roof/);
 map.set(K(8,7,0),{role:'roof',feature:'weather-plane',asset:'live:wood'});
 assert.throws(()=>inspectD30OriginalUnderslungCorridor(source,{...row,loadPathDraftOnly:false}),/provenance/);
});
