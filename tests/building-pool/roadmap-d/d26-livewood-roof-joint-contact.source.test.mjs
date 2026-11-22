// Exact original source-only W16/W17 geometry and actual voxel runtime collision/raycast.
import test from 'node:test';
import assert from 'node:assert/strict';
import {ROADMAP_D_WAVE16_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave16.mjs';
import {ROADMAP_D_WAVE17_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave17.mjs';
import {planD19SourceProvenRoofTrusses} from '../../../src/building-pool/roadmap-d/d19-original-supported-roof-truss-plan.mjs';
import {planD22SecondaryOriginalRoofTrusses} from '../../../src/building-pool/roadmap-d/d22-original-secondary-roof-trusses.mjs';
import {planD25OriginalLiveWoodRoofZones} from '../../../src/building-pool/roadmap-d/d25-original-livewood-roof-zones.mjs';
import {auditD26OriginalWoodRoofJoints} from '../../../src/building-pool/roadmap-d/d26-livewood-roof-joint-contact.mjs';
import {BLOCK,raycast} from '../../../src/voxel.mjs';
import {pack2BodyIntersects,pack2RayHit} from '../../../src/pack2-integration.mjs';
const B=[...ROADMAP_D_WAVE16_BUILDINGS,...ROADMAP_D_WAVE17_BUILDINGS];
const key=p=>p.join(',');
test('authentic sixteen original sources: 224 two-foundation spans, 1698 Y6 beams, true Pack2/wood connector geometry; zero original edits',()=>{
 assert.equal(B.length,16);
 const count={buildings:0,roofs:0,spans19:0,spans22:0,spans25:0,
  beam19:0,beam22:0,beam25:0,geometricSites:0,rawBeamGaps:0,previewBytes:0};
 const bins=[];
 for(const b of B){
  const first=b.cells[0],navFirst=b.navigation[0],n=b.cells.length,walk=b.navigation.length;
  const p=planD19SourceProvenRoofTrusses(b),s=planD22SecondaryOriginalRoofTrusses(b,{existing:p});
  const d25=planD25OriginalLiveWoodRoofZones(b,p,s);
  const a=auditD26OriginalWoodRoofJoints(b,p,s,d25);
  assert.equal(a.originalRuntimeWoodBlockId,BLOCK.WOOD);
  assert.equal(a.originalRoofAsset,'live:wood');
  assert.equal(a.originalBeamCells.D19,p.proposedBeamCells.length);
  assert.equal(a.originalBeamCells.D22,s.proposedBeamCells.length);
  assert.equal(a.originalBeamCells.D25,d25.thirdLaneProposedCells.length);
  assert.equal(a.verifiedGeometricProposedSites,a.standaloneBeamHasGapAtSites);
  assert.equal(a.verifiedGeometricProposedSites,a.sourceGeometricJointPossible);
  assert.ok(a.proposedCutPostRoofFaceUnionAreaPerSite>.1);
  assert.equal(a.representativeY2BodyCollisions,0);
  assert.equal(a.materialInterfaceRegistered,false);
  assert.equal(a.realRuntimeInstalledSleeveCount,0);
  assert.equal(a.actualLiveWoodRoofGravityLoadsCertified,false);
  assert.equal(a.worldCellChanges,0);
  assert.equal(b.cells.length,n);assert.equal(b.navigation.length,walk);
  assert.equal(b.cells[0],first);assert.equal(b.navigation[0],navFirst);
  count.buildings++;count.roofs+=d25.originalRoofCells;
  count.spans19+=a.originalSpans.D19;count.spans22+=a.originalSpans.D22;
  count.spans25+=a.originalSpans.D25;
  count.beam19+=a.originalBeamCells.D19;count.beam22+=a.originalBeamCells.D22;
  count.beam25+=a.originalBeamCells.D25;
  count.geometricSites+=a.verifiedGeometricProposedSites;
  count.rawBeamGaps+=a.standaloneBeamHasGapAtSites;
  count.previewBytes+=a.sampledSourceMeshBytes;
  bins.push({id:b.id,spans:a.originalSpans,beams:a.originalBeamCells,
   geometricSites:a.verifiedGeometricProposedSites,postFaceArea:a.proposedCutPostRoofFaceUnionAreaPerSite,
   sampledMeshBytes:a.sampledSourceMeshBytes});
 }
 assert.deepEqual({buildings:count.buildings,roofs:count.roofs,
  spans19:count.spans19,spans22:count.spans22,spans25:count.spans25,
  beam19:count.beam19,beam22:count.beam22,beam25:count.beam25},
  {buildings:16,roofs:115894,spans19:90,spans22:91,spans25:43,
   beam19:676,beam22:594,beam25:428});
 assert.equal(count.geometricSites,1698);
 assert.equal(count.rawBeamGaps,1698);
 console.log('D26 genuine geometric source totals '+JSON.stringify(count));
 console.log('D26 genuine geometric source buildings '+JSON.stringify(bins));
});
test('original game actual selection and Pack2 collision geometry: Y7 normal wood cube versus Y6 original beam',()=>{
 assert.equal(BLOCK.WOOD,4);const b=B[0],p=planD19SourceProvenRoofTrusses(b);
 const c=p.proposedBeamCells[0],at=c.at;
 assert.equal(at[1],6);assert.equal(c.candidateId,61);
 assert.equal(pack2BodyIntersects(61,{rotation:0},at,
  {x:at[0]+.5,z:at[2]+.5,feet:2,radius:.3,height:1.8}),false);
 const physicalBeam=pack2RayHit(61,{rotation:0},
  [at[0]+.5,6.5,at[2]-1],[0,0,1],at,5);
 assert.ok(physicalBeam&&physicalBeam.distance>0);
 const world={pack2Cells:new Map([[key(at),{id:61}]]),biomeCellCount:0,
  get:(x,y,z)=>x===at[0]&&z===at[2]&&y===6?61:
   (x===at[0]&&z===at[2]&&y===7?BLOCK.WOOD:BLOCK.AIR),
  getPack2State:()=>({rotation:0})};
 const roofHit=raycast(world,[at[0]+.5,8.5,at[2]+.5],[0,-1,0],4);
 assert.deepEqual(roofHit?.hit,[at[0],7,at[2]]);
 const beamHit=raycast(world,[at[0]+.5,6.5,at[2]-1],[0,0,1],5);
 assert.deepEqual(beamHit?.hit,at);
});
