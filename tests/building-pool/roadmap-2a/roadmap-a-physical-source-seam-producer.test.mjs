import test from 'node:test';
import assert from 'node:assert/strict';
import {resolveExplicitPack5PreviewFixture,auditExplicitPack5SourcePreviewSeams} from '../../../src/building-pool/roadmap-2a/roadmap-a-physical-source-seam-producer.mjs';
import {PACK5_BUILDER_CATALOG} from '../../../src/pack5-integration/catalog.mjs';
const preview=(symbol,variant,at,orientation=0)=>({previewFixtureOnly:true,symbol,variant,at,orientation});
test('original six authored Pack5 producer meshes reconstruct exact physical box palettes without any commerce source assignment',()=>{
 for(const [symbol,count] of [['pack5:079',[8,12]],['pack5:080',[42,53]],['pack5:081',[17,15]]]){
  const row=PACK5_BUILDER_CATALOG.find(x=>x.symbolicId===symbol);
  assert.equal(row.variants.length,2);
  for(const [i,variant] of row.variants.entries())for(const orientation of [0,1,2,3]){
   const v=resolveExplicitPack5PreviewFixture(preview(symbol,variant,[i+orientation*3,0,0],orientation));
   assert.equal(v.symbol,symbol);
   assert.equal(v.variant,variant);
   assert.equal(v.art.length,count[i]);
   assert.ok(v.art.every(p=>p.color.length===4&&p.color[3]===1&&p.bounds.length===6));
   assert.equal(v.previewFixtureOnly,true);
   assert.equal(Object.hasOwn(v,'buildingId'),false);
  }
 }
});
test('actual Pack5 ceramic grout contains conservative exact matching opaque seams, but no renderer/GPU/save change',()=>{
 const x=auditExplicitPack5SourcePreviewSeams([
  preview('pack5:081','sunburst-encaustic',[0,0,0]),
  preview('pack5:081','sunburst-encaustic',[1,0,0])
 ]);
 assert.equal(x.inputExplicitTestFixtures,2);
 assert.equal(x.sourceAuthoredPhysicalBoxes,34);
 assert.ok(x.exactOpaqueOppositeFacePairs>=1);
 assert.ok(x.hypotheticalRemainingTriangles<x.originalSourceTriangles);
 assert.equal(x.originalSourceAuthoredPack5MeshesChecked,true);
 assert.equal(x.allVariantsAndOrientationsExplicitlySuppliedByPreviewCaller,true);
 assert.equal(x.appliedToActualRenderer,false);
 assert.equal(x.acceptedForInstalledPackRenderer,false);
 assert.equal(x.acceptedForAnyRoadmapABuilding,false);
 assert.equal(x.actualWebGL2OrIPhonePerformanceMeasured,false);
 assert.equal(x.worldPlaced,false);
 assert.equal(x.saveWritten,false);
});
test('real Pack5 variants are unassigned; mismatched original choices cannot be silently seam-merged',()=>{
 const x=auditExplicitPack5SourcePreviewSeams([
  preview('pack5:081','sunburst-encaustic',[0,0,0]),
  preview('pack5:081','moonwoven-glaze',[1,0,0])
 ]);
 assert.equal(x.exactOpaqueOppositeFacePairs,0);
 assert.equal(x.sourceVariantsAutomaticallyChosen,false);
});
test('no arbitrary variants, source blueprint IDs, inferred yaws, or invalid Pack5 fixtures accepted',()=>{
 for(const v of [
  preview('pack5:081','made-up-glaze',[0,0,0]),
  {...preview('pack5:081','sunburst-encaustic',[0,0,0]),sourceBlueprintId:'r2:general-store:desert:large:05'},
  {...preview('pack5:081','sunburst-encaustic',[0,0,0]),orientation:undefined},
  {...preview('pack5:081','sunburst-encaustic',[0,0,0]),previewFixtureOnly:false},
  preview('pack5:094','hearth-running-bond',[0,0,0])
 ])assert.throws(()=>resolveExplicitPack5PreviewFixture(v),/authentic Pack5 preview|Unknown/);
 assert.throws(()=>auditExplicitPack5SourcePreviewSeams([]),/preview fixture count/);
});
