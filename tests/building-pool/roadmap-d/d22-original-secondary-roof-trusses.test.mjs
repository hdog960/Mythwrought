// Builder D22 targeted NATIVE Node tests for authentic original-source roof stages.
// Until run in a complete checkout: V8 test-body checks are NOT native CI.
// D22 is only a plan; no gameplay block placement, structural load or roof approval.
import test from 'node:test';
import assert from 'node:assert/strict';
import {ROADMAP_D_WAVE16_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave16.mjs';
import {ROADMAP_D_WAVE17_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave17.mjs';
import {planD19SourceProvenRoofTrusses} from '../../../src/building-pool/roadmap-d/d19-original-supported-roof-truss-plan.mjs';
import {planD22SecondaryOriginalRoofTrusses,auditD22OriginalRoofPlaneReach}
 from '../../../src/building-pool/roadmap-d/d22-original-secondary-roof-trusses.mjs';
import {auditD21OriginalRoofSaddleContacts}
 from '../../../src/building-pool/roadmap-d/d21-original-roof-saddle-contact.mjs';
import {resolvePack2BuilderAsset} from '../../../src/builder-assets/pack2.mjs';
import {pack2Shape} from '../../../src/block-packs/pack-2/definitions.mjs';
import {pack2Spec} from '../../../src/pack2-integration.mjs';
import {pack3RoofById} from '../../../src/block-packs/pack-3/roofing-materials.mjs';
const all=[...ROADMAP_D_WAVE16_BUILDINGS,...ROADMAP_D_WAVE17_BUILDINGS];
const deps=Object.freeze({resolvePack2Asset:resolvePack2BuilderAsset,
 resolvePack2RawShape:pack2Shape,resolveOriginalPostDefinition:pack2Spec,
 resolveOriginalRoofAsset:pack3RoofById});
const K=a=>a.join(',');
const vertical=new Set(['foundation','floor','wall','beam','partition','column']);
test('D22 supplementary lane: original 16 buildings preserve 90/676 primary and add exactly 91/594 disjoint true two-foundation beams',()=>{
 assert.equal(all.length,16);
 let primarySpans=0,primaryBeams=0,extraSpans=0,extraBeams=0,veto=0;
 for(const b of all){
  const source=b.cells.map(c=>K(c.at)+'|'+c.role+'|'+c.asset).join(';');
  const at=new Map(b.cells.map(c=>[K(c.at),c]));
  const base=planD19SourceProvenRoofTrusses(b);
  const extra=planD22SecondaryOriginalRoofTrusses(b,{existing:base});
  assert.equal(extra.blueprintId,b.id);
  assert.equal(extra.originalPrimaryTrussSpansUnmodified,base.proposedSpanCount);
  assert.equal(extra.originalPrimaryBeamCellsUnmodified,base.proposedBeamCount);
  assert.equal(extra.verifiedSourceBearingToFoundation,true);
  assert.equal(extra.noExistingVoxelOverwrites,true);
  assert.equal(extra.originalPrimaryAndNewBeamCellsDisjoint,true);
  assert.equal(extra.originalWorldCellsUnchanged,true);
  assert.equal(extra.originalSaveUntouched,true);
  assert.equal(extra.phase2GeometryOnly,true);
  assert.equal(extra.fullRoofLoadAccepted,false);
  assert.equal(extra.exactOriginalPlayerCollisionUnaccepted,true);
  assert.equal(extra.worldPlaced,false);
  assert.equal(extra.proposedSpanCount,extra.proposedTrussSpans.length);
  assert.equal(extra.proposedBeamCount,extra.proposedBeamCells.length);
  assert.ok(extra.proposedSpanCount>=1&&extra.proposedSpanCount<=12);
  assert.ok(extra.proposedBeamCount>=2&&extra.proposedBeamCount<=72);
  const primary=new Set(base.proposedBeamCells.map(x=>K(x.at))),next=new Set();
  for(const span of extra.proposedTrussSpans){
   assert.equal(span.sourceFromDenseD19ClearanceZero,true);
   assert.equal(span.bothBearingsReachUnbrokenOriginalFoundation,true);
   assert.equal(span.originalRoofAboveEveryProposedCell,true);
   assert.equal(span.originalRoofLoadAcceptance,false);
   assert.equal(span.points.length,span.spanCells);
   assert.equal(span.orientation,span.axis==='x'?'north':'east');
   for(const anchor of [span.bearingStart,span.bearingEnd]){
    for(let y=6;y>=0;y--){
     const c=at.get(K([anchor[0],y,anchor[2]]));
     assert.ok(c&&vertical.has(c.role),
       'unproven original full Y6-to-foundation structural bearing on alternate span');
    }
   }
   for(const p of span.points){
    assert.equal(p[1],6);
    assert.equal(at.get(K(p)),undefined);
    assert.equal(at.get(K([p[0],7,p[2]]))?.feature,'weather-plane');
    assert.ok(!primary.has(K(p))&&!next.has(K(p)),'secondary/primary original source beam collision');
    next.add(K(p));
   }
  }
  assert.equal(next.size,extra.proposedBeamCount);
  assert.equal(b.cells.map(c=>K(c.at)+'|'+c.role+'|'+c.asset).join(';'),source);
  primarySpans+=base.proposedSpanCount;primaryBeams+=base.proposedBeamCount;
  extraSpans+=extra.proposedSpanCount;extraBeams+=extra.proposedBeamCount;
  veto+=extra.rejectedOverlapsWithPrimaryOrSecondary;
 }
 assert.deepEqual({primarySpans,primaryBeams,extraSpans,extraBeams},
  {primarySpans:90,primaryBeams:676,extraSpans:91,extraBeams:594});
 assert.ok(veto>0,'false acceptance: D22 should detect real overlapping dense candidate spans');
});
test('every 91 D22 new original-source anchors accept true Pack2 beam/post-contact sleeve against original Pack3 candidate roofing',()=>{
 let originalSpans=0,sleeves=0,bytes=0,roofIds=new Set();
 for(const b of all){
  const pri=planD19SourceProvenRoofTrusses(b);
  const sec=planD22SecondaryOriginalRoofTrusses(b,{existing:pri});
  const actual=auditD21OriginalRoofSaddleContacts(b,sec,deps);
  assert.equal(actual.provenTwoFoundationBearingSpans,sec.proposedSpanCount);
  assert.equal(actual.sourceSampleCount,sec.proposedSpanCount);
  assert.ok(actual.generatedSourcePostVertexBytes<=96*1024);
  assert.equal(actual.originalWorldCellsUntouched,true);
  assert.equal(actual.derivedCompositeApprovedAsLiveBlock,false);
  assert.equal(actual.fullStructuralLoadingAccepted,false);
  assert.equal(actual.originalRoofSourceReplacementNotMounted,true);
  assert.equal(actual.realWebGL2Accepted,false);
  assert.equal(actual.worldPlaced,false);
  for(const sample of actual.originalBeamPostRoofContactSamples){
   assert.equal(sample.sourceBeamId,61);
   assert.equal(sample.sourcePostId,62);
   assert.equal(sample.originalPack2BeamNativeTriangles,156);
   assert.equal(sample.derivedSleeveTriangles,48);
   assert.equal(sample.sourceCombinedTriangleBudget,204);
   assert.equal(sample.cutOriginalPostPhysicalPieces.length,4);
   assert.ok(sample.sourcePartsContactingRealBeam>=2);
   assert.ok(sample.sourcePack3RoofUnderlayContacts>=1);
   assert.ok(sample.sourcePack3RoofUndersideContactArea>.32);
   assert.equal(sample.sourceContinuousBeamToProposedRoofUnderlay,true);
   assert.equal(sample.noOriginalSourceCellOverlap,true);
   assert.equal(sample.structuralLoadAndWeldAcceptance,false);
   assert.equal(sample.worldPlaced,false);
   roofIds.add(sample.originalRoofId);
  }
  originalSpans+=sec.proposedSpanCount;sleeves+=actual.sourceSampleCount;
  bytes+=actual.generatedSourcePostVertexBytes;
 }
 assert.deepEqual({originalSpans,sleeves,bytes},{originalSpans:91,sleeves:91,bytes:524160});
 assert.deepEqual([...roofIds].sort((a,b)=>a-b),[109,110,111,112]);
});
test('authentic 115894-cell original roof distance audit is honest: 91 new sleeves do not falsely close deep unsupported gaps',()=>{
 let roof=0,nearBefore=0,nearAfter=0,unreached=0,maxDistance=0,foundationSeeds=0;
 for(const b of all){
  const p=planD19SourceProvenRoofTrusses(b);
  const e=planD22SecondaryOriginalRoofTrusses(b,{existing:p});
  const before=auditD22OriginalRoofPlaneReach(b,p,null,{radius:8});
  const after=auditD22OriginalRoofPlaneReach(b,p,e,{radius:8});
  assert.equal(before.blueprintId,b.id);
  assert.equal(before.sourcePlaneCellsUnreachable,0);
  assert.equal(after.sourcePlaneCellsUnreachable,0);
  assert.equal(before.authoredPlaneCellCount,after.authoredPlaneCellCount);
  assert.equal(before.directFullFoundationWallRoofCells,after.directFullFoundationWallRoofCells);
  assert.ok(after.cellsWithinRadius>=before.cellsWithinRadius);
  assert.ok(after.cellsBeyondRadius>0);
  assert.equal(after.roofPlaneAdjacencyNotStructuralLoadProof,true);
  assert.equal(after.originalFullRoofLoadAcceptance,false);
  assert.equal(after.worldPlaced,false);
  roof+=after.authoredPlaneCellCount;
  nearBefore+=before.cellsWithinRadius;nearAfter+=after.cellsWithinRadius;
  unreached+=after.sourcePlaneCellsUnreachable;
  foundationSeeds+=after.directFullFoundationWallRoofCells;
  maxDistance=Math.max(maxDistance,after.farthestSourceHorizontalSteps);
 }
 assert.deepEqual({roof,nearBefore,nearAfter,unreached,maxDistance},
  {roof:115894,nearBefore:56424,nearAfter:56449,unreached:0,maxDistance:48});
 assert.ok(foundationSeeds>5000);
});
test('D22 rejects forged original primary source, overlap, duplicate original authored geometry and nonbounded source proximity options',()=>{
 const b=all[0],base=planD19SourceProvenRoofTrusses(b),extra=planD22SecondaryOriginalRoofTrusses(b,{existing:base});
 assert.throws(()=>planD22SecondaryOriginalRoofTrusses(b,{existing:{...base,verifiedSourceBearingToFoundation:false}}),/source/);
 for(const o of [{maxNewSpans:0},{maxNewSpans:13},{maxNewBeamCells:0},{maxNewBeamCells:73}])
  assert.throws(()=>planD22SecondaryOriginalRoofTrusses(b,{...o,existing:base}),/budget/);
 const duplicated={...b,cells:[...b.cells,{...b.cells[0],at:[...b.cells[0].at]}]};
 assert.throws(()=>planD22SecondaryOriginalRoofTrusses(duplicated),/Duplicate/);
 for(const radius of [0,17,Infinity])
  assert.throws(()=>auditD22OriginalRoofPlaneReach(b,base,null,{radius}),/radius/);
 assert.throws(()=>auditD22OriginalRoofPlaneReach(b,base,
   {...extra,originalPrimaryAndNewBeamCellsDisjoint:false}),/secondary/);
 const forged={...base,proposedTrussSpans:base.proposedTrussSpans.map((s,i)=>
  i===0?{...s,bothBearingsReachUnbrokenOriginalFoundation:false}:s)};
 assert.throws(()=>auditD22OriginalRoofPlaneReach(b,forged),/foundation paths/);
});
