import test from 'node:test';
import assert from 'node:assert/strict';
import {PACK5_BUILDER_CATALOG} from '../../../src/pack5-integration/catalog.mjs';
import {resolveOriginalPack5SupportPreview,auditOriginalPack5PreviewPhysicalSupports} from '../../../src/building-pool/roadmap-2a/roadmap-a-physical-preview-support-producer.mjs';
const p=(symbol,variant,at,orientation=0)=>({previewFixtureOnly:true,symbol,variant,at,orientation});
test('real original two-variant Pack5 resolver supplies 24 preview supports/physical collider variants',()=>{
  let sampled=0;
  for(const symbol of ['pack5:079','pack5:080','pack5:081']){
    const family=PACK5_BUILDER_CATALOG.find(x=>x.symbolicId===symbol);
    assert.equal(family.variants.length,2);
    for(const variant of family.variants)for(let yaw=0;yaw<4;yaw++){
      const f=resolveOriginalPack5SupportPreview(p(symbol,variant,[yaw,0,0],yaw));
      assert.equal(f.selectedForRoadmapASource,false);
      assert.ok(f.collisionBoxes.length>0);
      assert.equal(f.supportPolicy,family.attachment);
      assert.equal(f.supportOffsets.length,symbol==='pack5:080'?0:1);
      if(symbol==='pack5:079')assert.deepEqual(f.supportOffsets,[
        [[0,0,-1]],[[1,0,0]],[[0,0,1]],[[-1,0,0]]][yaw]);
      sampled++;
    }
  }
  assert.equal(sampled,24);
});
test('source-authored brick full cube is an isolated candidate backing for original plaster and tile',()=>{
  const wall=auditOriginalPack5PreviewPhysicalSupports([
    p('pack5:079','chalk-lime',[0,0,0]),p('pack5:080','hearth-running-bond',[0,0,-1])]);
  assert.equal(wall.classificationTotals['source-only-full-face-collider-candidate'],1);
  assert.equal(wall.originalGameRuntimeAcceptance,false);
  const floor=auditOriginalPack5PreviewPhysicalSupports([
    p('pack5:081','sunburst-encaustic',[0,1,0]),p('pack5:080','hearth-running-bond',[0,0,0])]);
  assert.equal(floor.classificationTotals['source-only-full-face-collider-candidate'],1);
  assert.equal(floor.worldPhysicalStructuralLoadAcceptance,false);
});
test('original thin plaster and tile colliders are not full-face structural backing candidates',()=>{
  const wall=auditOriginalPack5PreviewPhysicalSupports([
    p('pack5:079','chalk-lime',[0,0,0]),p('pack5:079','hand-troweled',[0,0,-1])]);
  assert.equal(wall.classificationTotals['source-only-neighbor-partial-collider'],1);
  const tile=auditOriginalPack5PreviewPhysicalSupports([
    p('pack5:081','sunburst-encaustic',[0,1,0]),p('pack5:081','moonwoven-glaze',[0,0,0])]);
  assert.equal(tile.classificationTotals['source-only-neighbor-partial-collider'],1);
});
test('preview producer refuses arbitrary variants, inferred yaws and real A5 source building reference',()=>{
  for(const input of [p('pack5:079','unapproved',[0,0,0]),
    {...p('pack5:079','chalk-lime',[0,0,0]),buildingId:'r2:general-store:desert:large:05'},
    {...p('pack5:079','chalk-lime',[0,0,0]),orientation:undefined},
    p('pack5:096','chalk-lime',[0,0,0])])
      assert.throws(()=>resolveOriginalPack5SupportPreview(input),/Roadmap A original Pack5 support producer/);
});
