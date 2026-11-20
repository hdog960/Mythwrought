import test from 'node:test';
import assert from 'node:assert/strict';
import {validateBlueprint,assertDistinctArchitecture} from '../../../src/building-pool/roadmap-2a/schema.mjs';
import {ROADMAP_A_VISUAL19_ALTERNATIVES,ROADMAP_A_VISUAL19_BASES,ROADMAP_A_SKYLINE_STYLES} from '../../../src/building-pool/roadmap-2a/roadmap-a-silhouette-study.mjs';
const k=v=>v.x+','+v.y+','+v.z;
test('Roadmap A visual19: 19 genuine alternative roof volumes with six source-specific skyline architectures',{timeout:240000},()=>{
 assert.equal(ROADMAP_A_VISUAL19_ALTERNATIVES.length,19);
 assert.equal(ROADMAP_A_VISUAL19_BASES.length,19);
 assert.equal(ROADMAP_A_SKYLINE_STYLES.length,6);
 const used=new Set();
 for(let i=0;i<19;i++){
  const base=ROADMAP_A_VISUAL19_BASES[i],b=ROADMAP_A_VISUAL19_ALTERNATIVES[i];
  assert.equal(b.id,base.id);
  assert.equal(validateBlueprint(b).valid,true,b.id);
  assert.equal(b.sourceVisualRevision.originalSourceGeometryPreserved,true);
  assert.equal(b.sourceVisualRevision.physicalPackMeshAccepted,false);
  assert.equal(b.sourceVisualRevision.creatorVisualApproval,false);
  assert.equal(b.worldPlaced,false);
  assert.equal(b.numericIdsAssigned,false);
  const before=new Map(base.voxels.map(v=>[k(v),v]));
  const after=new Map(b.voxels.map(v=>[k(v),v]));
  assert.equal(before.size,base.voxels.length);
  assert.equal(after.size,b.voxels.length);
  assert.equal(b.voxels.length-base.voxels.length,b.sourceVisualRevision.additiveRoofCells);
  for(const [position,old] of before)assert.deepEqual(after.get(position),old,'original protected voxel mutated '+b.id+' '+position);
  assert.ok(b.extents.y-base.extents.y>=6,'meaningful 3D skyline extension '+b.id);
  assert.ok(b.sourceVisualRevision.genuineRoofColumns>=32,b.id);
  const roofSource=new Set(base.voxels.filter(v=>v.kind==='roof').map(v=>v.material));
  for(const v of b.voxels)if(!before.has(k(v))){
   assert.equal(v.kind,'roof','visual experiment added a nonroof solid '+b.id);
   assert.ok(roofSource.has(v.material));
   assert.equal(after.get(v.x+','+(v.y-1)+','+v.z)?.kind,'roof','non-rooted skyline roof '+b.id+' '+k(v));
  }
  used.add(b.sourceVisualRevision.roofStyle);
 }
 assert.equal(used.size,6);
 assert.equal(assertDistinctArchitecture(ROADMAP_A_VISUAL19_ALTERNATIVES).distinctArchitectures,19);
});
test('Roadmap A visual19: no original source footprints or sky-open courtyards filled, no invented gameplay or PWA registration',{timeout:240000},()=>{
 for(let i=0;i<19;i++){
  const before=ROADMAP_A_VISUAL19_BASES[i],after=ROADMAP_A_VISUAL19_ALTERNATIVES[i];
  const oldXY=new Set(before.voxels.filter(v=>v.kind==='roof').map(v=>v.x+','+v.z));
  for(const v of after.voxels.filter(v=>v.architecturalRole==='reversible-source-only-skyline-study'))
   assert.ok(oldXY.has(v.x+','+v.z),'source courtyard accidentally roofed '+after.id);
  assert.deepEqual(after.courtyardGeometry,before.courtyardGeometry);
  assert.deepEqual(after.rooms,before.rooms);
  assert.deepEqual(after.openings,before.openings);
  assert.deepEqual(after.circulation,before.circulation);
  assert.deepEqual(after.unresolvedDependencies,before.unresolvedDependencies);
  assert.equal(after.status,'authored-candidate');
 }
});
