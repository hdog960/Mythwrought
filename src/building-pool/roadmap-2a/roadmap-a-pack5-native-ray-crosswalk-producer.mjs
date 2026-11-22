/**
 * Source-only Roadmap A: compare the UNMODIFIED original Pack5 fixture raycast,
 * canonical voxel-shape FULL-CUBE COLLIDER raycast, and original physical source triangle geometry.
 * Fixed grazing inputs are test-only. No player, world edit, GPU, saved structure
 * or A5 material/rotation assignment is constructed.
 */
import {makePack5Fixture} from '../../block-packs/pack-5/fixture.mjs';
import {PACK5_BUILDER_FAMILIES,resolvePack5BuilderAsset} from '../../pack5-integration/catalog.mjs';
import {resolveManualFivePackAsset} from '../../builder-assets/manual-five-pack.mjs';
import {getPack5Surface,surfaceBoxMesh} from '../../block-packs/pack-5/architectural-surfaces.mjs';
import {raycastShapes,validateShape} from '../../voxel-shape-interactions.mjs';
import {sourceRayTriangleDistance} from './roadmap-a-pack5-ray-selection-core.mjs';

const deny=(ok,reason)=>{if(!ok)throw Error('Roadmap A native ray crosswalk denied: '+reason);};
const validVariant=Object.freeze(['hearth-running-bond','kiln-soldier-course']);
const yawTests=Object.freeze([2,3]);
const edgeCoordinates=Object.freeze([0.01999995,0.02,0.02000005,0.97999995,0.98,0.98000005]);
const stable=v=>v===null?null:Math.round(v*1000000000)/1000000000;
const equalDistance=(a,b)=>a===null&&b===null||
 a!==null&&b!==null&&Math.abs(a-b)<=0.0000001;
const triangleNearest=(mesh,origin,direction)=>{
 let closest=null,hitCount=0;
 const pos=mesh.positions,indices=mesh.indices;
 const xyz=i=>[pos[3*i],pos[3*i+1],pos[3*i+2]];
 for(let i=0;i<indices.length;i+=3){
  const d=sourceRayTriangleDistance(origin,direction,
   xyz(indices[i]),xyz(indices[i+1]),xyz(indices[i+2]));
  if(d===null)continue;
  hitCount++;
  if(closest===null||d<closest)closest=d;
 }
 return {distance:closest,triangleIntersections:hitCount};
};
const geometryKey=(variant,yaw)=>variant+'|'+yaw;
const shapeFor=(cell,boxes)=>cell.every(x=>x===0)?{boxes}:null;

export function auditOriginalPack5GrazingRayEngineCrosswalk(){
 const witnesses=[],perOriginalVariantYaw=[],totals={
  originalSourceCases:0,testOnlyInMemoryFixtures:0,analyticalRays:0,
  originalFixtureHits:0,canonicalCollisionShapeHits:0,originalMeshTriangleHits:0,
  originalFixtureVersusCanonicalColliderDisagreements:0,
  canonicalSelectionShapeCapExceededCases:0,
  originalFixtureVersusTriangleDisagreements:0,
  canonicalColliderVersusTriangleDisagreements:0,
  exactProbeCoordinateEvents:0,perturbedProbeCoordinateEvents:0
 };
 for(const variant of validVariant)for(const yaw of yawTests){
  // This is the original isolated test fixture. No VoxelWorld, source blueprint,
  // save, live rendering, runtime instance pool or real building is created.
  const fixture=makePack5Fixture(PACK5_BUILDER_FAMILIES);
  const original=resolveManualFivePackAsset('pack5:080',{variant,orientation:yaw});
  const {descriptor,mesh:meshFn}=resolvePack5BuilderAsset('pack5:080',variant);
  const result=fixture.place('pack5:080',[0,0,0],yaw,variant);
  deny(result?.ok===true&&fixture.count()===1,'original ephemeral source fixture refuses selected brick');
  const boxParts=original.selectionBoxes;
  deny(original.livePlaceable===false&&original.saveWritten===false&&
   original.sourcePack===5&&original.supportPolicy==='none'&&
   original.selectionBoxes.length===original.visibleBoxes.length&&
   boxParts.length===descriptor.parts[0].boxes.length,
   'original immutable Manual Pack5 selection/source provenance drift');
  const selectionAdmitted=validateShape({boxes:boxParts});
  deny(validateShape({boxes:original.collisionBoxes}),
   'original full-cube brick collider violates canonical shape descriptor');
  if(!selectionAdmitted)totals.canonicalSelectionShapeCapExceededCases++;
  const mesh=meshFn(descriptor,{rotation:yaw});
  const separateMesh=surfaceBoxMesh(getPack5Surface('pack5:080',variant),{rotation:yaw});
  deny(mesh.vertexCount===separateMesh.vertexCount&&mesh.triangles===separateMesh.triangles&&
   mesh.indices.length===separateMesh.indices.length&&
   mesh.positions.length===separateMesh.positions.length,
   'original independent source mesh producer differs in shape');
  const row={symbol:'pack5:080',explicitTestOnlyVariant:variant,explicitTestOnlyYaw:yaw,
   sourceBoxCount:boxParts.length,meshTriangleCount:mesh.triangles,
   testOnlyFixturePlaced:true,actualBuildingOrWorldPlacement:false,
   rays:0,originalFixtureHits:0,canonicalCollisionShapeHits:0,originalTriangleHits:0,
   fixtureVsCollider:0,fixtureVsTriangles:0,colliderVsTriangles:0,
   firstDisagreementSamples:[]};
  // Intentionally select *only* brick yaw 2/3, where the previous independently
  // measured 88 original 5x5 rays showed source-coordinate boundary ambiguity.
  // Vary one tangential coordinate by +/-5e-8 source block units around 0.02
  // and 0.98, with another coordinate held on one of three interior positions.
  for(let axis=0;axis<3;axis++)for(const positive of [false,true]){
   const tangential=[0,1,2].filter(i=>i!==axis);
   for(const edge of edgeCoordinates)for(const cross of [0.1,0.5,0.9]){
    const origin=[0,0,0],direction=[0,0,0];
    origin[axis]=positive?2:-1;
    origin[tangential[0]]=edge;
    origin[tangential[1]]=cross;
    direction[axis]=positive?-1:1;
    const fixtureResult=fixture.raycast(origin,direction,6);
    const shapeResult=raycastShapes(origin,direction,
     (x,y,z)=>shapeFor([x,y,z],original.collisionBoxes),6);
    const triangles=triangleNearest(mesh,origin,direction);
    const fd=fixtureResult?.distance??null;
    const sd=shapeResult?.distance??null;
    const td=triangles.distance;
    const fs=equalDistance(fd,sd),ft=equalDistance(fd,td),st=equalDistance(sd,td);
    row.rays++;totals.analyticalRays++;
    if(fd!==null){row.originalFixtureHits++;totals.originalFixtureHits++;}
    if(sd!==null){row.canonicalCollisionShapeHits++;totals.canonicalCollisionShapeHits++;}
    if(td!==null){row.originalTriangleHits++;totals.originalMeshTriangleHits++;}
    if(!fs){row.fixtureVsCollider++;totals.originalFixtureVersusCanonicalColliderDisagreements++;}
    if(!ft){row.fixtureVsTriangles++;totals.originalFixtureVersusTriangleDisagreements++;}
    if(!st){row.colliderVsTriangles++;totals.canonicalColliderVersusTriangleDisagreements++;}
    const exact=edge===0.02||edge===0.98;
    if(exact)totals.exactProbeCoordinateEvents++;
    else totals.perturbedProbeCoordinateEvents++;
    if(!(fs&&ft&&st)){
     const item={axis,positive,edgeCoordinate:edge,otherCoordinate:cross,
      fixtureDistanceBlockUnits:stable(fd),canonicalFullColliderDistanceBlockUnits:stable(sd),
      sourceTriangleDistanceBlockUnits:stable(td),
      differsOriginalFixtureVsCanonicalCollider:!fs,differsOriginalFixtureVsTriangle:!ft,
      differsCanonicalColliderVsTriangle:!st};
     if(row.firstDisagreementSamples.length<12)row.firstDisagreementSamples.push(item);
     if(witnesses.length<36)witnesses.push({...item,variant,yaw});
    }
   }
  }
  deny(row.rays===108,'lost bounded brick yaw2/yaw3 edge-perturbation rays');
  row.originalSelectionFitsCanonicalShapeRegistry=selectionAdmitted;
  perOriginalVariantYaw.push(row);
  totals.originalSourceCases++;
  totals.testOnlyInMemoryFixtures++;
 }
 deny(totals.originalSourceCases===4&&totals.analyticalRays===432&&
  totals.exactProbeCoordinateEvents===144&&totals.perturbedProbeCoordinateEvents===288,
  'bounded original source ray census incomplete');
 deny(totals.originalFixtureHits>=0&&totals.originalFixtureHits<=432&&
  totals.canonicalCollisionShapeHits>=0&&totals.canonicalCollisionShapeHits<=432&&
  totals.originalMeshTriangleHits>=0&&totals.originalMeshTriangleHits<=432&&
  totals.originalFixtureVersusCanonicalColliderDisagreements<=432&&
  totals.originalFixtureVersusTriangleDisagreements<=432&&
  totals.canonicalColliderVersusTriangleDisagreements<=432,
  'source ray mismatch census invalid');
 return {schema:'mythwrought.roadmap-a.pack5-native-engine-ray-edge-crosswalk.v1',
  ...totals,perOriginalVariantYaw,witnesses,
  originalFixtureAndCanonicalColliderRaycastersExecuted:true,
  canonicalRaycasterComparedOriginalFullCubeColliderNotManyBoxSelection:true,
  originalComplexSelectionNotRegisteredAsOrdinaryVoxelShape:true,
  originalAuthoredMeshTrianglesRayTested:true,
  originalPack5VariantYawChoicesForA5:false,
  actualLiveGameWorldConstructed:false,originalSourceA5DesignsChanged:false,
  sourceOnlyReadOnly:true,realGamePlayerRaycastTested:false,
  currentCameraOrTouchControlsTested:false,WebGL2OrIphoneMeasured:false,
  sourceBoundaryDisagreementIsNotVerifiedGameplayBug:true,
  permittedToPlaceActualWorldBlocks:false,structuralBackingCertified:false,
  saveOrPwaModified:false,creatorApproved:false};
}
