import test from 'node:test';
import assert from 'node:assert/strict';
import {auditExplicitPack5PreviewSupports as audit} from '../../../src/building-pool/roadmap-2a/roadmap-a-physical-preview-support-core.mjs';
const full=[0,0,0,1,1,1];
const fx=(symbol,at,additional={})=>({previewFixtureOnly:true,selectedForRoadmapASource:false,
  symbol,variant:symbol==='pack5:079'?'chalk-lime':symbol==='pack5:080'?'hearth-running-bond':'sunburst-encaustic',
  orientation:0,at,occupiedOffsets:[[0,0,0]],
  supportOffsets:symbol==='pack5:079'?[[0,0,-1]]:symbol==='pack5:081'?[[0,-1,0]]:[],
  supportPolicy:symbol==='pack5:079'?'wall':symbol==='pack5:081'?'floor':'none',
  collisionBoxes:symbol==='pack5:080'?[full]:symbol==='pack5:079'?[[.025,.025,.025,.975,.975,.141]]:[[0,.015,0,1,.15,1]],
  ...additional});
test('full-cube original brick collision can be a preview backing candidate for mounted plaster',()=>{
  const r=audit([fx('pack5:079',[0,0,0]),fx('pack5:080',[0,0,-1])]);
  assert.equal(r.attachmentRequirements,1);
  assert.equal(r.classificationTotals['source-only-full-face-collider-candidate'],1);
  assert.equal(r.details[0].neighborPreviewPhysicalAsset,'pack5:080');
  assert.equal(r.details[0].physicalLoadBearingCertified,false);
  assert.equal(r.readyForWorldPlacement,false);
});
test('floor ceramic tile preview requires a full source collision backing cell beneath',()=>{
  const covered=audit([fx('pack5:081',[0,1,0]),fx('pack5:080',[0,0,0])]);
  assert.equal(covered.classificationTotals['source-only-full-face-collider-candidate'],1);
  const absent=audit([fx('pack5:081',[0,1,0])]);
  assert.equal(absent.classificationTotals['no-explicit-preview-neighbor'],1);
});
test('real wall plaster and thin tile colliders cannot certify full-cell face backing',()=>{
  const r=audit([fx('pack5:079',[0,0,0]),fx('pack5:079',[0,0,-1])]);
  assert.equal(r.classificationTotals['source-only-neighbor-partial-collider'],1);
  assert.equal(r.classificationTotals['no-explicit-preview-neighbor'],1);
  const tile=audit([fx('pack5:081',[0,1,0]),fx('pack5:081',[0,0,0])]);
  assert.equal(tile.classificationTotals['source-only-neighbor-partial-collider'],1);
});
test('submicrometer partial full-face collider never counts as exact full support',()=>{
  const face=fx('pack5:080',[0,0,-1],{collisionBoxes:[[0,0,0,1,1,0.9999997]]});
  const r=audit([fx('pack5:079',[0,0,0]),face]);
  assert.equal(r.classificationTotals['source-only-neighbor-partial-collider'],1);
});
test('four real wall yaw supports use explicit original neighboring cells, but no world acceptance',()=>{
  const cases=[[[0,0,-1],[0,0,-1]],[[1,0,0],[1,0,0]],[[0,0,1],[0,0,1]],[[-1,0,0],[-1,0,0]]];
  for(let yaw=0;yaw<4;yaw++){
    const [offset,brickAt]=cases[yaw];
    const r=audit([fx('pack5:079',[0,0,0],{orientation:yaw,supportOffsets:[offset]}),fx('pack5:080',brickAt)]);
    assert.equal(r.classificationTotals['source-only-full-face-collider-candidate'],1);
    assert.equal(r.physicalLoadBearingCertified,false);
  }
});
test('source building IDs, unchosen original variants, overlapping anchors, invalid policy and collider overflow fail closed',()=>{
  const valid=fx('pack5:080',[0,0,0]);
  for(const bad of [fx('pack5:079',[0,0,0],{buildingId:'r2:bank:snow:medium:03'}),
   fx('pack5:079',[0,0,0],{variant:null}),
   fx('pack5:079',[0,0,0],{variant:'invented-variant'}),
   fx('pack5:079',[0,0,0],{supportOffsets:[[1,0,0]]}),
   fx('pack5:079',[0,0,0],{supportOffsets:[]}),
   fx('pack5:081',[0,0,0],{supportOffsets:[[0,0,-1]]}),
   fx('pack5:080',[0,0,0],{collisionBoxes:[[0,0,0,1,1,1.000001]]}),
   fx('pack5:079',[0,0,0],{selectedForRoadmapASource:true})])
    assert.throws(()=>audit([bad]),/Roadmap A preview support/);
  assert.throws(()=>audit([valid,valid]),/overlap/);
  assert.throws(()=>audit([valid],{maxBoxes:0}),/invalid collider budget/);
});
