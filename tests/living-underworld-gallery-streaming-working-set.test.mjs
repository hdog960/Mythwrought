import test from 'node:test';
import assert from 'node:assert/strict';
import {actualGallerySectionCosts,engineWantedSections,auditGalleryEngineWorkingSet}
 from '../src/living-underworld/gallery-streaming-working-set.mjs';
import {censusOriginal80GalleryCosts}
 from '../src/living-underworld/full-gallery-cost-census.mjs';
test('real section ownership uses legacy offset and retains adjacent face owners',()=>{
 const cuts=new Set(['15,-20,0','16,-19,0']);
 const rows=actualGallerySectionCosts(cuts,()=>3);
 assert.equal(rows.reduce((n,r)=>n+r.cuts,0),2);
 assert.equal(rows.find(r=>r.key==='0,0,-2').cuts,1);
 assert.equal(rows.find(r=>r.key==='1,0,-1').cuts,1);
 assert.equal(rows.reduce((n,r)=>n+r.delta,0),12);
 assert.ok(rows.some(r=>r.cuts===0&&r.faces>0));
 assert.equal(engineWantedSections(0,0,-2).length,27);
 assert.equal(engineWantedSections(0,0,0).length,25);
 assert.equal(engineWantedSections(0,0,0,true).length,34);
 assert.equal(engineWantedSections(0,0,-13).length,18);
});
test('staged dirty copies are charged alongside resident originals',()=>{
 const rows=[{key:'0,0,-2',cx:0,cz:0,s:-2,cuts:100,delta:1000,faces:1000},
  {key:'0,0,-1',cx:0,cz:0,s:-1,cuts:100,delta:900,faces:900}];
 const r=auditGalleryEngineWorkingSet(rows);
 assert.equal(r.maxResidentFaces,1900);
 assert.equal(r.maxEditStagedFaces,3800);
 assert.equal(r.maxEditStagedCuts,400);
 assert.equal(r.galleryResidentAndSingleEditWithinNumericLimits,false);
 assert.equal(r.constructionAdmission,false);
});
test('one native original 80-gallery exact section working-set audit',()=>{
 const r=censusOriginal80GalleryCosts({engineWorkingSet:true});
 assert.equal(r.sourceSafeGalleries,80);
 assert.equal(r.original.ownedCarves,91971);
 assert.equal(r.original.faceGrowth,140860);
 assert.equal(r.engineWorkingSet.globalCuts,91971);
 assert.ok(r.engineWorkingSet.windows>0);
 assert.equal(r.engineWorkingSet.constructionAdmission,false);
 assert.equal(r.engineWorkingSet.combinedFutureOverlaysQualified,false);
 assert.equal(r.engineWorkingSet.actualGPUQualified,false);
 assert.equal(r.noWorldWrites,true);
 console.log(JSON.stringify({sourceSafeGalleries:r.sourceSafeGalleries,
  original:r.original,originalRoleCalls:r.originalRoleCalls,engine:r.engineWorkingSet,limits:r.limits}));
});
