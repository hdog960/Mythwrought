// D27 exact original Node native source tests: no browser, no world editing.
import test from 'node:test';
import assert from 'node:assert/strict';
import {ROADMAP_D_WAVE16_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave16.mjs';
import {ROADMAP_D_WAVE17_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave17.mjs';
import {planD19SourceProvenRoofTrusses} from '../../../src/building-pool/roadmap-d/d19-original-supported-roof-truss-plan.mjs';
import {planD22SecondaryOriginalRoofTrusses} from '../../../src/building-pool/roadmap-d/d22-original-secondary-roof-trusses.mjs';
import {planD25OriginalLiveWoodRoofZones} from '../../../src/building-pool/roadmap-d/d25-original-livewood-roof-zones.mjs';
import {auditD27OriginalWoodLoadPaths,d27PreviewSourceCollider,d27PreviewColliderRay}
  from '../../../src/building-pool/roadmap-d/d27-original-wood-loadpath-audit.mjs';
import {FULL_CUBE,raycastShapes,validateShape} from '../../../src/voxel-shape-interactions.mjs';
import {inspectBodyFit} from '../../../src/voxel-shape-fit.mjs';
import {pack2ShapeOf,pack2RayHit,pack2BodyIntersects} from '../../../src/pack2-integration.mjs';
const ALL=[...ROADMAP_D_WAVE16_BUILDINGS,...ROADMAP_D_WAVE17_BUILDINGS];
const plans=b=>{const primary=planD19SourceProvenRoofTrusses(b),secondary=
  planD22SecondaryOriginalRoofTrusses(b,{existing:primary});
  return {primary,secondary,d25:planD25OriginalLiveWoodRoofZones(b,primary,secondary)};
};
test('original sixteen W16/W17 roofs: complete 224 supported source spans, 1698 provisional composite positions, no walking or material changes',()=>{
 assert.equal(ALL.length,16);
 const totals={buildings:0,spans:0,beams:0,sampleRay:0,zoneFar:0,zones:0};
 const bins=[];
 for(const b of ALL){
  const c0=b.cells[0],n0=b.navigation[0],cellN=b.cells.length,navN=b.navigation.length;
  const {primary,secondary,d25}=plans(b);
  const r=auditD27OriginalWoodLoadPaths(b,primary,secondary,d25,{sampleLimit:4});
  assert.equal(r.originalPack2BoxOwnerVerified,true);
  assert.ok(Math.abs(r.sourceRoofContactAreaPerConnector-.2116)<1e-9);
  assert.ok(Math.abs(r.sourceWallBeamEndContactAreaPerEnd-.36)<1e-9);
  assert.equal(r.sampledOriginalRayParity,r.sampledCompositeRayAndWoodParity);
  assert.equal(r.sampledBodyConflicts,0);
  assert.equal(r.remainingRoofBeyondProximity,d25.afterD25HypotheticalBeyondRadius);
  assert.equal(r.unresolvedLongBayZones,d25.unresolvedRoofZoneCount);
  assert.equal(r.gravityLoadStructuralCapacityUnknown,true);
  assert.equal(r.allRoofLoadsAccepted,false);
  assert.equal(r.originalBlueprintBindingNotRuntimeRegistered,true);
  assert.equal(r.sourceOnlyCompositeShapeNotInstalled,true);
  assert.equal(r.worldEdited,false);assert.equal(r.saveChanged,false);
  assert.equal(b.cells.length,cellN);assert.equal(b.navigation.length,navN);
  assert.strictEqual(b.cells[0],c0);assert.strictEqual(b.navigation[0],n0);
  totals.buildings++;totals.spans+=r.originalSpanCount;totals.beams+=r.originalBeamCount;
  totals.sampleRay+=r.sampledCompositeRayAndWoodParity;
  totals.zoneFar+=r.remainingRoofBeyondProximity;totals.zones+=r.unresolvedLongBayZones;
  bins.push({id:b.id,spans:r.originalSpanCount,beams:r.originalBeamCount,
    x:r.beamByAxis.x,z:r.beamByAxis.z,far:r.remainingRoofBeyondProximity,
    zones:r.unresolvedLongBayZones});
 }
 assert.deepEqual({buildings:totals.buildings,spans:totals.spans,beams:totals.beams,
  zoneFar:totals.zoneFar,zones:totals.zones},{buildings:16,spans:224,beams:1698,zoneFar:59412,zones:34});
 console.log('D27 original-source load path totals '+JSON.stringify(totals));
 console.log('D27 original-source load path sixteen bins '+JSON.stringify(bins));
});
test('original shared collider, ray and body-fit engine agree on derived uninstalled x/z Pack2 composite, without replacing legacy beam or WOOD cube',()=>{
 for(const axis of ['x','z']){
  const source=d27PreviewSourceCollider(axis),rot=axis==='x'?0:1;
  assert.ok(validateShape(source));assert.equal(source.colliderBoxCount,7);
  assert.deepEqual(source.boxes.slice(0,3),pack2ShapeOf(61,{rotation:rot}).boxes);
  const cell=[0,6,0],eye=[.5,7.5,.5],dir=[0,-1,0];
  const actual=d27PreviewColliderRay(axis,eye,dir,cell,4);
  assert.deepEqual(actual?.cell,cell);assert.equal(actual?.distance,.5);
  const direct=raycastShapes(eye,dir,(x,y,z)=>x===0&&y===6&&z===0?source:null,4);
  assert.deepEqual(actual,direct);
  const wood=raycastShapes([.5,8.5,.5],dir,(x,y,z)=>x===0&&y===7&&z===0?FULL_CUBE:null,4);
  assert.equal(wood.distance,.5);
  const baseline=pack2RayHit(61,{rotation:rot},[.5,6.5,-1],[0,0,1],cell,4);
  assert.equal(Boolean(baseline),true);
  assert.ok(inspectBodyFit([.2,2,.2,.8,3.8,.8],(x,y,z)=>y===6&&x===0&&z===0?source:null).fits);
  assert.equal(pack2BodyIntersects(61,{rotation:rot},cell,
    {x:.5,z:.5,feet:2,height:1.8,radius:.3}),false);
  assert.equal(source.liveGameInstalled,false);
 }
});
test('authentic original source protections reject changed roof, damaged wall support and deleted navigation after prior D25 planning',()=>{
 const b=ALL[0],{primary,secondary,d25}=plans(b);
 const roof=b.cells.find(c=>c.role==='roof'&&c.feature==='weather-plane');
 const editedRoof={...b,cells:b.cells.map(c=>c===roof?{...c,asset:'pack3:023'}:c)};
 assert.throws(()=>auditD27OriginalWoodLoadPaths(editedRoof,primary,secondary,d25),/roof material|live:wood/);
 const anchor=primary.proposedTrussSpans[0].bearingStart;
 const head=b.cells.find(c=>c.at.join(',')===anchor.join(','));
 const leaf={...b,cells:b.cells.map(c=>c===head?{...c,asset:'live:leaves'}:c)};
 assert.throws(()=>auditD27OriginalWoodLoadPaths(leaf,primary,secondary,d25),/bearing path/);
 const roofCoord=new Set(b.cells.filter(c=>c.at[1]===7&&c.feature==='weather-plane').map(c=>c.at[0]+','+c.at[2]));
 const n=b.navigation.find(n=>n.at[1]===2&&roofCoord.has(n.at[0]+','+n.at[2]));
 assert.ok(n);
 const missingNav={...b,navigation:b.navigation.filter(x=>x!==n)};
 assert.throws(()=>auditD27OriginalWoodLoadPaths(missingNav,primary,secondary,d25),/navigation changed/);
 assert.throws(()=>auditD27OriginalWoodLoadPaths(b,primary,secondary,d25,{sampleLimit:100}),/sample limit/);
});
