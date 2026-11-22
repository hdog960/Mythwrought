import test from 'node:test';
import assert from 'node:assert/strict';
import {sourceRayBoxDistance,sourceRayTriangleDistance,
 auditSourceOnlyPack5AxisRayFidelity}
 from '../../../src/building-pool/roadmap-2a/roadmap-a-pack5-ray-selection-core.mjs';
const cube=[0,0,0,1,1,1];
const inset=[.1,.1,.1,.9,.9,.9];
const faces=[
 [[1,0,0],[1,1,0],[1,1,1],[1,0,1]],
 [[0,0,1],[0,1,1],[0,1,0],[0,0,0]],
 [[0,1,1],[1,1,1],[1,1,0],[0,1,0]],
 [[0,0,0],[1,0,0],[1,0,1],[0,0,1]],
 [[1,0,1],[1,1,1],[0,1,1],[0,0,1]],
 [[0,0,0],[0,1,0],[1,1,0],[1,0,0]]
];
function boxMesh(b){
 const p=[],indices=[];let v=0;
 for(const face of faces){
  for(const x of face)for(let k=0;k<3;k++)p.push(x[k]?b[k+3]:b[k]);
  indices.push(v,v+1,v+2,v,v+2,v+3);v+=4;
 }
 return {positions:Float32Array.from(p),indices:Uint16Array.from(indices),
  vertexCount:v,triangles:indices.length/3};
}
const fixture=(selectionBoxes=[cube],collisionBoxes=[cube],mesh=boxMesh(cube))=>({
 previewFixtureOnly:true,selectedForRoadmapASource:false,
 symbol:'pack5:080',variant:'hearth-running-bond',orientation:0,
 selectionBoxes,collisionBoxes,mesh,
 livePlaceable:false,saveWritten:false,worldPlaced:false,creatorAccepted:false
});
test('source AABB analytical ray intersections distinguish exact source collision misses',()=>{
 assert.equal(sourceRayBoxDistance([-.5,.5,.5],[1,0,0],cube),.5);
 assert.equal(sourceRayBoxDistance([-.5,1.1,.5],[1,0,0],cube),null);
 assert.equal(sourceRayBoxDistance([2,.5,.5],[-1,0,0],cube),1);
});
test('original-source triangle intersection is a double-sided geometric witness, not GPU occlusion',()=>{
 const a=[0,0,0],b=[1,0,0],c=[0,1,0];
 assert.equal(sourceRayTriangleDistance([.2,.2,1],[0,0,-1],a,b,c),1);
 assert.equal(sourceRayTriangleDistance([.2,.2,-1],[0,0,1],a,b,c),1);
 assert.equal(sourceRayTriangleDistance([.9,.9,1],[0,0,-1],a,b,c),null);
});
test('full cube selection, source mesh and collider agree across every 150 face ray',()=>{
 const r=auditSourceOnlyPack5AxisRayFidelity(fixture());
 assert.equal(r.raySummary.sampleRays,150);
 assert.equal(r.raySummary.collisionHits,150);
 assert.equal(r.raySummary.selectionHits,150);
 assert.equal(r.raySummary.authoredTriangleHits,150);
 assert.equal(r.raySummary.selectionAndColliderCoincident,150);
 assert.equal(r.raySummary.selectionTriangleMismatch,0);
 assert.equal(r.raySummary.colliderWithoutSelection,0);
 assert.equal(r.actualGPUShaderOrPixelVisibilityMeasured,false);
});
test('full collider plus inset selection reveals 96 collision-only rays and 54 recessed face rays',()=>{
 const r=auditSourceOnlyPack5AxisRayFidelity(fixture([inset],[cube],boxMesh(inset)));
 assert.equal(r.raySummary.sampleRays,150);
 assert.equal(r.raySummary.colliderWithoutSelection,96);
 assert.equal(r.raySummary.selectionRecessedBehindCollider,54);
 assert.equal(r.raySummary.selectionHits,54);
 assert.equal(r.raySummary.selectionTriangleMismatch,0);
 assert.ok(r.firstBoundedWitnesses.length>0);
 assert.ok(r.firstBoundedWitnesses.length<=32);
});
test('art protruding farther than collider is differentiated without changing physical blocks',()=>{
 const r=auditSourceOnlyPack5AxisRayFidelity(fixture([cube],[inset],boxMesh(cube)));
 assert.equal(r.raySummary.selectionWithoutCollider,96);
 assert.equal(r.raySummary.selectionAheadOfCollider,54);
 assert.equal(r.raySummary.selectionTriangleMismatch,0);
 assert.equal(r.realWorldCollisionOrTargetingAccepted,false);
});
test('source-authored triangle versus selection discrepancy cannot be treated as proof of visibility',()=>{
 const r=auditSourceOnlyPack5AxisRayFidelity(fixture([inset],[cube],boxMesh(cube)));
 assert.ok(r.raySummary.selectionTriangleMismatch>0);
 assert.ok(r.raySummary.interiorTriangleSelectionDisagreements>0);
 assert.equal(r.raySummary.selectionTriangleMismatch,
  r.raySummary.sourceBoundaryGrazingRayDisagreements+
  r.raySummary.interiorTriangleSelectionDisagreements);
 assert.equal(r.raySummary.authoredTriangleHits,150);
 assert.equal(r.originalA5SourceVariantOrYawChosen,false);
});
test('Float32 versus Float64 near-authored edge grazing is reported separately, never hidden',()=>{
 const nearFloat=[.020000000000000018,0,0,1,1,1];
 const x=auditSourceOnlyPack5AxisRayFidelity(fixture([nearFloat],[cube],boxMesh([.02,0,0,1,1,1])));
 assert.ok(x.raySummary.selectionTriangleMismatch>0);
 assert.ok(x.raySummary.sourceBoundaryGrazingRayDisagreements>0);
 assert.equal(x.raySummary.selectionTriangleMismatch,
  x.raySummary.sourceBoundaryGrazingRayDisagreements+
  x.raySummary.interiorTriangleSelectionDisagreements);
 assert.equal(x.boundaryGrazingIsNumericalUncertaintyNotExoneration,true);
});
test('exactly six original face directions and fixed 5x5 sampling, with bounded examples',()=>{
 const r=auditSourceOnlyPack5AxisRayFidelity(fixture([inset],[cube],boxMesh(inset)));
 assert.deepEqual(r.sampleGrid,[.02,.1,.5,.9,.98]);
 assert.equal(r.faceResults.length,6);
 assert.ok(r.faceResults.every(f=>f.rays===25));
 assert.deepEqual(r.faceResults.map(f=>[f.axis,f.side]),
  [[0,'-'],[0,'+'],[1,'-'],[1,'+'],[2,'-'],[2,'+']]);
 assert.equal(r.sourceOnly,true);
 assert.equal(r.readyForWorldPlacement,false);
});
test('unsupported variants, implicit orientation and source A5 references fail closed',()=>{
 const x=fixture();
 for(const bad of [
  {...x,variant:'invented'},
  {...x,orientation:undefined},
  {...x,sourceBlueprintId:'r2:shop:desert:large:05'},
  {...x,buildingId:'example'},
  {...x,previewFixtureOnly:false},
  {...x,creatorAccepted:true},
  {...x,livePlaceable:true}
 ])assert.throws(()=>auditSourceOnlyPack5AxisRayFidelity(bad),/source-only|denied|unapproved/);
});
test('malformed source mesh, indices, collision volumes and rays cannot spoof parity',()=>{
 const x=fixture();
 assert.throws(()=>auditSourceOnlyPack5AxisRayFidelity({...x,
  mesh:{...x.mesh,indices:Uint16Array.from([8888,0,1]),triangles:1}}),/geometry missing/);
 assert.throws(()=>auditSourceOnlyPack5AxisRayFidelity({...x,selectionBoxes:[[-.01,0,0,1,1,1]]}),/geometry missing/);
 assert.throws(()=>sourceRayBoxDistance([0,0,0],[0,0,0],cube),/bounded original/);
 assert.throws(()=>sourceRayTriangleDistance([0,0,0],[0,0,0],[0,0,0],[1,0,0],[0,1,0]),/finite original/);
});
