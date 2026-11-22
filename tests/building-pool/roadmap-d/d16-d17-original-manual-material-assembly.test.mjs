// Builder D W16/17 authentic Manual Packs 1/3/4 source geometry test.
// Focused NODE, no screenshot, WebGL, world spawn, save write or full repo suite.
import test from 'node:test';
import assert from 'node:assert/strict';
import {resolveManualFivePackAsset} from '../../../src/builder-assets/manual-five-pack.mjs';
import {pack4BuilderAsset} from '../../../src/block-packs/pack-4/builder-handoff.mjs';
import {ROADMAP_D_WAVE16_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave16.mjs';
import {ROADMAP_D_WAVE17_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave17.mjs';
import {assembleD16D17OriginalPhysicalPreview} from '../../../src/building-pool/roadmap-d/d16-d17-source-backed-material-assembly.mjs';
const originals=[...ROADMAP_D_WAVE16_BUILDINGS,...ROADMAP_D_WAVE17_BUILDINGS];
const truth=()=>({resolveManualAsset:resolveManualFivePackAsset,resolvePack4Asset:pack4BuilderAsset});
test('16 original W16/17 source buildings map to exactly bounded real Pack1 masonry, Pack3 material/shaped ridges/spires and Pack4 translucent mesh/glass/furniture',()=>{
 assert.equal(originals.length,16);
 let instances=0,meshWindows=0,corrected=0,masonry=0,shingles=0,ridge=0,spires=0,fixtures=0;
 for(const b of originals){
  const before=b.cells.length;
  const scene=assembleD16D17OriginalPhysicalPreview(b,truth());
  assert.equal(scene.sampledCount,40);
  assert.equal(scene.physicalSamples.length,40);
  assert.equal(scene.pack4MeshGlazingCount,12);
  assert.deepEqual(scene.sourcePacksUsed,[1,3,4]);
  assert.equal(scene.originalSourceCellCount,before);
  assert.equal(b.cells.length,before,'original source structure mutated');
  assert.equal(scene.sampleCounts['external-masonry'],8);
  assert.equal(scene.sampleCounts['original-weather-roof'],8);
  assert.equal(scene.sampleCounts['original-graded-ridge'],6);
  assert.equal(scene.sampleCounts['original-spire-crown'],4);
  assert.equal(scene.sampleCounts['physical-glazing-preview'],12);
  assert.equal(scene.sampleCounts['source-physical-furnishing-preview'],2);
  const kinds=scene.physicalSamples.reduce((o,x)=>(o[x.sourceOriginalPack]=(o[x.sourceOriginalPack]||0)+1,o),{});
  assert.deepEqual(kinds,{1:8,3:18,4:14});
  for(const p of scene.physicalSamples){
   assert.ok(p.sourceOriginalSymbol.startsWith('pack'+p.sourceOriginalPack+':'));
   assert.ok(p.renderablePhysicalBoxes.length>0);
   assert.ok(p.originalPhysicalSelectionBoxes>0);
   assert.equal(p.originalGeometryResolved,true);
   if(p.sourceOriginalPack===4){
    const mesh=p.originalRealPack4WorldMesh;
    assert.equal(mesh.source,'original-pack4-actual-preview-vertices');
    assert.equal(mesh.stride,10);
    assert.ok(mesh.opaqueWorldVertices instanceof Float32Array);
    assert.ok(mesh.translucentWorldVertices instanceof Float32Array);
    assert.ok(mesh.opaqueTriangles+mesh.translucentTriangles>0,'fake original Pack4 mesh');
    assert.equal(mesh.opaqueTriangles,mesh.opaqueWorldVertices.length/30);
    assert.equal(mesh.translucentTriangles,mesh.translucentWorldVertices.length/30);
    for(const group of [mesh.opaqueWorldVertices,mesh.translucentWorldVertices]){
     for(let i=0;i<group.length;i+=10){
      assert.ok(group[i]>=p.sourceAt[0]&&group[i]<=p.sourceAt[0]+1);
      assert.ok(group[i+1]>=p.sourceAt[1]&&group[i+1]<=p.sourceAt[1]+1);
      assert.ok(group[i+2]>=p.sourceAt[2]&&group[i+2]<=p.sourceAt[2]+1);
      assert.ok(group[i+9]>=0&&group[i+9]<=1);
     }
    }
    assert.equal(mesh.preSortedTransparency,false);
    assert.equal(mesh.worldRendererAcceptance,false);
   }
   assert.equal(p.materialPreviewOnly,true);
   assert.equal(p.worldPlaced,false);
   for(const box of p.renderablePhysicalBoxes)assert.ok(box.length===6&&box.every(Number.isFinite)&&
     box[0]>=p.sourceAt[0]&&box[1]>=p.sourceAt[1]&&box[2]>=p.sourceAt[2]&&
     box[3]<=p.sourceAt[0]+1&&box[4]<=p.sourceAt[1]+1&&box[5]<=p.sourceAt[2]+1);
  }
  assert.deepEqual([scene.completeWorldStructure,scene.fullManualFamilyArtworkAccepted,
    scene.worldSupportAndMountsAccepted,scene.worldPlaced,scene.iphonePerformanceValidated,
    scene.gameplayIntegrated],[false,false,false,false,false,false]);
  instances+=scene.sampledCount;meshWindows+=scene.pack4MeshGlazingCount;
  corrected+=scene.originalWindowFacadeCorrections;
  masonry+=scene.sampleCounts['external-masonry'];
  shingles+=scene.sampleCounts['original-weather-roof'];
  ridge+=scene.sampleCounts['original-graded-ridge'];spires+=scene.sampleCounts['original-spire-crown'];
  fixtures+=scene.sampleCounts['source-physical-furnishing-preview'];
 }
 assert.equal(instances,640);assert.equal(meshWindows,192);
 assert.deepEqual([masonry,shingles,ridge,spires,fixtures],[128,128,96,64,32]);
 assert.ok(corrected>=8,'original default-north glazing orientation wrongly trusted');
});
test('physical material build rejects synthesized/fraudulent source geometry and invalid cost budgets, no stale source accepted',()=>{
 const b=originals[0];
 assert.throws(()=>assembleD16D17OriginalPhysicalPreview(b),/resolvers/);
 assert.throws(()=>assembleD16D17OriginalPhysicalPreview(b,{...truth(),roofBudget:1000}),/budget/);
 assert.throws(()=>assembleD16D17OriginalPhysicalPreview({...b,worldPlaced:true},truth()),/unintegrated/);
 const fake=()=>({symbol:'pack1:002',sourcePack:1,numericId:10,physical:true,livePlaceable:false,saveWritten:false,
   visibleBoxes:[],selectionBoxes:[],collisionBoxes:[]});
 assert.throws(()=>assembleD16D17OriginalPhysicalPreview(b,{...truth(),resolveManualAsset:fake}),/owner contract|physical/);
});
