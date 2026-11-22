// Builder D D19: actual immutable 4B source roof-bearing and window-jamb audit.
// This is a targeted original-source NATIVE Node test; never a live world write.
// No claim of full roof load approval, Pack2 final mesh placement, or iPhone acceptance.
import test from 'node:test';
import assert from 'node:assert/strict';
import {ROADMAP_D_WAVE16_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave16.mjs';
import {ROADMAP_D_WAVE17_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave17.mjs';
import {resolvePack2BuilderAsset} from '../../../src/builder-assets/pack2.mjs';
import {planD19SourceProvenRoofTrusses} from '../../../src/building-pool/roadmap-d/d19-original-supported-roof-truss-plan.mjs';
const sources=[...ROADMAP_D_WAVE16_BUILDINGS,...ROADMAP_D_WAVE17_BUILDINGS];
const K=a=>a.join(',');
const roots=new Set(['wall','column','partition']);
test('all 16 canonical sources produce real bounded short two-bearing truss spans with zero original-cell edits and complete original window-jamb census',()=>{
 assert.equal(sources.length,16);
 let spans=0,beams=0,windows=0,none=0,one=0,both=0;
 for(const b of sources){
  const original=b.cells.map(c=>K(c.at)+'|'+c.role+'|'+c.asset).join(';');
  const originalSource=new Map(b.cells.map(c=>[K(c.at),c]));
  const p=planD19SourceProvenRoofTrusses(b);
  assert.equal(p.blueprintId,b.id);
  assert.equal(p.sourceCellCount,b.cells.length);
  assert.ok(p.proposedSpanCount>=1&&p.proposedSpanCount<=12);
  assert.ok(p.proposedBeamCount>=3&&p.proposedBeamCount<=72);
  assert.equal(p.proposedBeamCells.length,p.proposedBeamCount);
  assert.equal(p.proposedTrussSpans.length,p.proposedSpanCount);
  assert.equal(p.originalWindowSourceCount,b.openings.filter(o=>o.kind==='window').length);
  assert.ok(p.originalWeatherPlaneCellsWithoutVerticalBearing>0);
  assert.equal(p.originalWindowJambCensus.both+p.originalWindowJambCensus.one+
    p.originalWindowJambCensus.none,p.originalWindowSourceCount);
  assert.equal(p.physicalWindowFrameReviewCandidates.length,
    p.originalWindowJambCensus.none+p.originalWindowJambCensus.one);
  const locations=new Set();
  for(const span of p.proposedTrussSpans){
   assert.ok(span.spanCells>=2&&span.spanCells<=12);
   assert.equal(span.spanCells,span.points.length);
   assert.ok(roots.has(originalSource.get(K(span.bearingStart))?.role));
   assert.ok(roots.has(originalSource.get(K(span.bearingEnd))?.role));
   assert.equal(span.authoredRoofAboveEveryCell,true);
   assert.equal(span.originalRoofLoadAcceptance,false);
   assert.equal(span.jointContinuityNeedsOriginalPhysicalReview,true);
   for(const at of span.points){
    assert.ok(!originalSource.has(K(at)),'proposed beam overwrites original source voxel '+K(at));
    assert.equal(at[1],6);
    assert.equal(originalSource.get(K([at[0],7,at[2]]))?.role,'roof');
    assert.ok(!locations.has(K(at)),'proposed beam crossed another proposed truss');
    locations.add(K(at));
   }
  }
  assert.equal(locations.size,p.proposedBeamCells.length);
  for(const q of p.proposedBeamCells){
   assert.equal(q.asset,'pack2:015');assert.equal(q.candidateId,61);
   assert.equal(q.role,'roof-cross-beam');assert.ok(['east','north'].includes(q.orientation));
   assert.equal(q.worldPlaced,false);assert.equal(q.creatorApproved,false);
  }
  assert.deepEqual([
   p.noExistingVoxelOverwrites,p.originalGeometryUnmodified,
   p.fullRoofStructuralAcceptance,p.allWindowSurroundsAccepted,
   p.gameplayIntegrated,p.saveWritten,p.worldPlaced
  ],[true,true,false,false,false,false,false]);
  assert.equal(b.cells.map(c=>K(c.at)+'|'+c.role+'|'+c.asset).join(';'),original);
  spans+=p.proposedSpanCount;beams+=p.proposedBeamCount;windows+=p.originalWindowSourceCount;
  none+=p.originalWindowJambCensus.none;one+=p.originalWindowJambCensus.one;
  both+=p.originalWindowJambCensus.both;
 }
 assert.deepEqual({spans,beams,windows,none,one,both},
  {spans:95,beams:695,windows:1233,none:63,one:130,both:1040},
  'source original 16-building D19 structural census changed; review true source, never lower checks');
});
test('all proposed original-roster timber beams resolve as Pack2 real authored geometry; no fake replacement cube or remapped ID',()=>{
 const orientations=new Set(sources.flatMap(b=>
  planD19SourceProvenRoofTrusses(b).proposedBeamCells.map(q=>q.orientation)));
 assert.deepEqual([...orientations].sort(),['east','north']);
 for(const facing of orientations){
  const p=resolvePack2BuilderAsset('pack2:015',facing);
  assert.equal(p.blockId,61);assert.equal(p.symbol,'pack2:015');
  assert.equal(p.physical,true);assert.equal(p.livePlaceable,false);
  assert.equal(p.triangleCount,156);
  assert.equal(p.shape.boxes.length,3);
  assert.equal(p.yaw,facing==='east'?1:0);
 }
});
test('original roof-bearing proposal rejects tampered source, unapproved sizes and already registered live world structures',()=>{
 const b=sources[0];
 assert.throws(()=>planD19SourceProvenRoofTrusses({...b,integrated:true}),/unintegrated/);
 for(const a of [{maxSpans:99},{maxSpan:13},{maxBeamCells:73},{clearance:4},{maxSpans:0}])
  assert.throws(()=>planD19SourceProvenRoofTrusses(b,a),/bounds|cost/i);
 const first=b.cells[0];
 const duplicate={...b,cells:[...b.cells,{...first,at:[...first.at]}]};
 assert.throws(()=>planD19SourceProvenRoofTrusses(duplicate),/duplicate/);
 const invalid={...b,cells:b.cells.filter(x=>!(x.role==='roof'&&x.feature==='weather-plane'))};
 assert.throws(()=>planD19SourceProvenRoofTrusses(invalid),/source roof census/);
});
