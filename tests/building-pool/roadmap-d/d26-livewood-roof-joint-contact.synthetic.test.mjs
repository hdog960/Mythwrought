// D26 synthetic negative cases, not substitutes for original W16/W17 tests.
import test from 'node:test';
import assert from 'node:assert/strict';
import {planD25OriginalLiveWoodRoofZones} from '../../../src/building-pool/roadmap-d/d25-original-livewood-roof-zones.mjs';
import {auditD26OriginalWoodRoofJoints} from '../../../src/building-pool/roadmap-d/d26-livewood-roof-joint-contact.mjs';
const k=p=>p.join(',');
function fixture(){
 const cells=[],navigation=[];
 for(let z=0;z<8;z++)for(let x=0;x<16;x++){
  const wall=[0,6,12,15].includes(x);
  cells.push({at:[x,0,z],role:'foundation',asset:'live:stone'},
   {at:[x,1,z],role:'floor',asset:'live:wood'},
   {at:[x,7,z],role:'roof',feature:'weather-plane',asset:'live:wood'});
  if(wall)for(let y=2;y<=6;y++)cells.push({at:[x,y,z],role:'wall',asset:'live:stone'});
  else navigation.push({at:[x,2,z],mode:'walk'});
 }
 const b={id:'SYNTHETIC-D26-NOT-ORIGINAL',cells,navigation,worldPlaced:false,integrated:false,creatorApproved:false};
 const lane=z=>{const points=[1,2,3,4,5].map(x=>[x,6,z]);return {
  blueprintId:b.id,verifiedSourceBearingToFoundation:true,originalPrimaryAndNewBeamCellsDisjoint:true,
  proposedBeamCells:points.map(p=>({at:p,asset:'pack2:015',candidateId:61,orientation:'north'})),
  proposedTrussSpans:[{axis:'x',spanCells:points.length,points,
   bearingStart:[0,6,z],bearingEnd:[6,6,z],bothBearingsReachUnbrokenOriginalFoundation:true}]
 };};
 const primary=lane(0),secondary=lane(1);
 const d25=planD25OriginalLiveWoodRoofZones(b,primary,secondary,{maxNewSpans:2,maxNewBeamCells:24});
 return {b,primary,secondary,d25};
}
test('original Pack2 ID61/62 support is a geometrically feasible cut connector under unregistered full-cube WOOD, not a certified structure',()=>{
 const {b,primary,secondary,d25}=fixture(),before=b.cells.map(c=>k(c.at)).join(';');
 const r=auditD26OriginalWoodRoofJoints(b,primary,secondary,d25,{maxPreviewSites:3});
 assert.equal(r.originalRuntimeWoodBlockId,4);
 assert.equal(r.originalBeamCells.D19,5);assert.equal(r.originalBeamCells.D22,5);
 assert.equal(r.originalBeamCells.D25,d25.thirdLaneProposedCells.length);
 assert.equal(r.originalSpans.D25,d25.thirdLaneProposedSpans.length);
 assert.equal(r.verifiedGeometricProposedSites,r.standaloneBeamHasGapAtSites);
 assert.equal(r.sourceGeometricJointPossible,r.verifiedGeometricProposedSites);
 assert.ok(r.proposedCutPostRoofFaceUnionAreaPerSite>.1);
 assert.ok(r.proposedCutPostRoofFaceUnionAreaPerSite<.4);
 assert.equal(r.representativeY2BodyCollisions,0);
 assert.equal(r.sampledSourceMeshCount,3);
 assert.ok(r.sampledSourceMeshBytes>0);
 for(const sample of r.sampledSourceMeshBuffers){
  assert.ok(sample.vertices instanceof Float32Array);
  assert.equal(sample.vertices.byteLength,sample.bytes);
  assert.equal(sample.vertices.length%10,0);
  assert.ok(sample.vertices.every(Number.isFinite));
 }
 assert.equal(r.unregisteredBlueprintToRuntimeWoodBinding,false);
 assert.equal(r.materialInterfaceRegistered,false);
 assert.equal(r.actualPlayerPhysicsAndPickingUncertified,true);
 assert.equal(r.actualLiveWoodRoofGravityLoadsCertified,false);
 assert.equal(r.worldCellChanges,0);
 assert.equal(b.cells.map(c=>k(c.at)).join(';'),before);
});
test('D26 rejects forged source, roof replacement, overlapping channels and beam orientation tampering',()=>{
 const {b,primary,secondary,d25}=fixture();
 const oneRoof=b.cells.find(c=>c.role==='roof');
 const replaced={...b,cells:b.cells.map(c=>c===oneRoof?{...c,asset:'pack3:023'}:c)};
 assert.throws(()=>auditD26OriginalWoodRoofJoints(replaced,primary,secondary,d25),/roof material/);
 const overlap={...secondary,proposedBeamCells:secondary.proposedBeamCells.map((c,i)=>
  i===0?{...c,at:[...primary.proposedBeamCells[0].at]}:c)};
 assert.throws(()=>auditD26OriginalWoodRoofJoints(b,primary,overlap,d25),/duplicate beam|interrupted/);
 const orient={...primary,proposedBeamCells:primary.proposedBeamCells.map((c,i)=>
  i===0?{...c,orientation:'east'}:c)};
 assert.throws(()=>auditD26OriginalWoodRoofJoints(b,orient,secondary,d25),/interrupted/);
 const wrong={...primary,proposedTrussSpans:primary.proposedTrussSpans.map(s=>({...s,bearingEnd:[12,6,0]}))};
 assert.throws(()=>auditD26OriginalWoodRoofJoints(b,wrong,secondary,d25),/endpoint continuity/);
 assert.throws(()=>auditD26OriginalWoodRoofJoints({...b,worldPlaced:true},primary,secondary,d25),/unplaced/);
 assert.throws(()=>auditD26OriginalWoodRoofJoints(b,primary,secondary,d25,{maxPreviewSites:100}),/budget/);
});
