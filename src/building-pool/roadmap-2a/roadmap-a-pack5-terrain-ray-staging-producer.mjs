/**
 * Roadmap A Pack5: read-only original indexed mesh -> true production nine-float
 * Float32 terrain buffer parity and ray hit crosswalk. No fake GPU invocation.
 *
 * The original WebGL2 stream uploads 9 floats per triangle vertex:
 * position(3), pigment(3), uv(2), source material ID(1).
 * This module checks the unchanged source mesh and packer in native Node;
 * arbitrary A5 material/yaw selection, source worlds and live rendering remain
 * specifically prohibited.
 */
import {resolvePack5BuilderAsset} from '../../pack5-integration/catalog.mjs';
import {resolveManualFivePackAsset} from '../../builder-assets/manual-five-pack.mjs';
import {makePack5Fixture} from '../../block-packs/pack-5/fixture.mjs';
import {PACK5_BUILDER_FAMILIES} from '../../pack5-integration/catalog.mjs';
import {pack5TerrainVertices,PACK5_GPU_PAGE_BYTES,
 PACK5_GPU_RESIDENT_BYTES,PACK5_GPU_MAX_PAGES} from '../../pack5-integration/terrain-buffer.mjs';
import {sourceRayTriangleDistance} from './roadmap-a-pack5-ray-selection-core.mjs';

const insist=(ok,why)=>{if(!ok)throw Error('Roadmap A Pack5 genuine terrain ray audit: '+why);};
const variants=Object.freeze(['hearth-running-bond','kiln-soldier-course']);
const yaws=Object.freeze([2,3]);
const coords=Object.freeze([0.01999995,0.02,0.02000005,0.97999995,0.98,0.98000005]);
const fractions=Object.freeze([0.1,0.5,0.9]);
const EPS=1e-10;
const validVec=v=>Array.isArray(v)&&v.length===3&&v.every(Number.isFinite);

function checkMesh(mesh){
 insist(mesh&&ArrayBuffer.isView(mesh.positions)&&ArrayBuffer.isView(mesh.indices)&&
  ArrayBuffer.isView(mesh.colors)&&Number.isSafeInteger(mesh.vertexCount)&&
  Number.isSafeInteger(mesh.triangles)&&mesh.vertexCount>0&&
  mesh.vertexCount<=6144&&mesh.triangles>0&&mesh.triangles<=3072&&
  mesh.positions.length===3*mesh.vertexCount&&
  mesh.indices.length===3*mesh.triangles&&
  mesh.colors.length===4*mesh.vertexCount&&
  Array.from(mesh.positions).every(Number.isFinite)&&
  Array.from(mesh.indices).every(x=>Number.isSafeInteger(x)&&x>=0&&x<mesh.vertexCount),
 'expected genuine original indexed Pack5 Float32/typed triangle mesh');
}
export function compareOriginalIndexedPack5ToTerrainStaging(mesh,staged){
 checkMesh(mesh);
 insist(staged instanceof Float32Array&&staged.length===mesh.indices.length*9&&
  staged.byteLength<=PACK5_GPU_PAGE_BYTES,'genuine production nine-float staging cap');
 let vertexPositionsCompared=0,shaderMaterialZeros=0,uvCompared=0,colorCompared=0;
 const faces=mesh.indices.length/3;
 for(let i=0;i<mesh.indices.length;i++){
  const index=mesh.indices[i],o=i*9,p=index*3,c=index*4;
  for(let j=0;j<3;j++){
   insist(Object.is(staged[o+j],mesh.positions[p+j]),
    'original shader source world vertex drift at indexed vertex '+i+'/'+j);
   vertexPositionsCompared++;
   insist(Object.is(staged[o+3+j],Math.fround(Math.min(1,Math.max(0,mesh.colors[c+j])))),
    'original RGB pigment drift at indexed vertex '+i+'/'+j);
   colorCompared++;
  }
  const x=mesh.positions[p],z=mesh.positions[p+2];
  insist(Object.is(staged[o+6],Math.fround(x-Math.floor(x)))&&
   Object.is(staged[o+7],Math.fround(z-Math.floor(z))),
   'source authored terrain shader UV drift at indexed vertex '+i);
  uvCompared+=2;
  insist(staged[o+8]===0&&Number.isFinite(staged[o+8]),
   'source authored neutral material selection changed');
  shaderMaterialZeros++;
 }
 return {schema:'mythwrought.roadmap-a.pack5-production-mesh-float32-parity.v1',
  triangles:faces,indexedSourceVertices:mesh.indices.length,
  exactFloat32PositionValues:vertexPositionsCompared,
  exactOriginalRGBPigmentValues:colorCompared,
  exactSourceUVValues:uvCompared,neutralMaterialVertices:shaderMaterialZeros,
  authoredSourcePositionsByteIdenticalToProductionStaging:true,
  actualWebGL2PixelsRendered:false,sourceOnly:true};
}
function closestOriginalTriangle(origin,direction,mesh){
 const p=mesh.positions,indices=mesh.indices;
 let best=null;
 const v=n=>[p[n*3],p[n*3+1],p[n*3+2]];
 for(let i=0;i<indices.length;i+=3){
  const d=sourceRayTriangleDistance(origin,direction,
    v(indices[i]),v(indices[i+1]),v(indices[i+2]));
  if(d!==null&&(best===null||d<best))best=d;
 }
 return best;
}
function closestStagedTriangle(origin,direction,staged){
 let best=null;
 for(let i=0;i<staged.length;i+=27){
  const v=n=>[staged[i+n*9],staged[i+n*9+1],staged[i+n*9+2]];
  const d=sourceRayTriangleDistance(origin,direction,v(0),v(1),v(2));
  if(d!==null&&(best===null||d<best))best=d;
 }
 return best;
}
const rayMatch=(a,b)=>a===null&&b===null||
 a!==null&&b!==null&&Math.abs(a-b)<=EPS;

export function auditPack5ActualProducerTriangleRayStaging(){
 const results=[],examples=[],totals={originalPreviewAlternatives:0,rays:0,
  pureSourceTriangleHits:0,productionStagedTriangleHits:0,
  originalVisibleSelectionHits:0,selectionVersusStagedDisagreements:0,
  originalSourceTriangleVersusProductionStagedDisagreements:0,
  allOriginalVertexPositionsCompared:0,allOriginalMaterialsNeutral:0};
 for(const variant of variants)for(const yaw of yaws){
  const original=resolveManualFivePackAsset('pack5:080',{variant,orientation:yaw});
  const {descriptor,mesh:meshBuilder}=resolvePack5BuilderAsset('pack5:080',variant);
  insist(original.livePlaceable===false&&original.saveWritten===false&&
   original.sourcePack===5&&original.selectionBoxes.length>32&&
   original.collisionBoxes.length===1&&
   JSON.stringify(original.collisionBoxes[0])==='[0,0,0,1,1,1]',
   'actual original pack5:080 source/collider/preview was changed');
  const mesh=meshBuilder(descriptor,{rotation:yaw});
  const staged=pack5TerrainVertices(mesh);
  const parity=compareOriginalIndexedPack5ToTerrainStaging(mesh,staged);
  const ephemeral=makePack5Fixture(PACK5_BUILDER_FAMILIES);
  insist(ephemeral.place('pack5:080',[0,0,0],yaw,variant).ok===true,
    'temporary test-only source fixture not created');
  const row={symbol:'pack5:080',explicitPreviewOnlyVariant:variant,
   explicitPreviewOnlyYaw:yaw,originalSourceTriangles:mesh.triangles,
   originalSourceSelectionBoxes:original.selectionBoxes.length,
   sourceShaderStagingBytes:staged.byteLength,
   exactFloat32CoordinatesCompared:parity.exactFloat32PositionValues,
   sourceRayProbes:0,originalSourceTriangleHits:0,
   originalStagedTriangleHits:0,originalFixtureSelectionHits:0,
   sourceVsStagedRayDisagreements:0,selectionVsStagedRayDisagreements:0,
   noRoadmapASourceChosen:true,actualGpuExecuted:false};
  // 4 alternatives x 6 faces x 6 near-boundary coordinates x
  // 3 fixed other-axis coordinates = 432 source-only ray comparisons.
  for(let axis=0;axis<3;axis++)for(const positive of [false,true]){
   const other=[0,1,2].filter(i=>i!==axis);
   for(const u of coords)for(const v of fractions){
    const origin=[0,0,0],direction=[0,0,0];
    origin[axis]=positive?2:-1;
    origin[other[0]]=u;origin[other[1]]=v;
    direction[axis]=positive?-1:1;
    insist(validVec(origin)&&validVec(direction),'bounded source ray missing');
    const sourceHit=closestOriginalTriangle(origin,direction,mesh);
    const stagedHit=closestStagedTriangle(origin,direction,staged);
    const selected=ephemeral.raycast(origin,direction,6)?.distance??null;
    totals.rays++;row.sourceRayProbes++;
    if(sourceHit!==null){row.originalSourceTriangleHits++;totals.pureSourceTriangleHits++;}
    if(stagedHit!==null){row.originalStagedTriangleHits++;totals.productionStagedTriangleHits++;}
    if(selected!==null){row.originalFixtureSelectionHits++;totals.originalVisibleSelectionHits++;}
    if(!rayMatch(sourceHit,stagedHit)){
     totals.originalSourceTriangleVersusProductionStagedDisagreements++;
     row.sourceVsStagedRayDisagreements++;
    }
    if(!rayMatch(selected,stagedHit)){
     totals.selectionVersusStagedDisagreements++;
     row.selectionVsStagedRayDisagreements++;
     if(examples.length<24)examples.push({variant,yaw,axis,positive,u,v,
      originalSelectionDistance:selected,actualStagedTriangleDistance:stagedHit,
      originalSourceTriangleDistance:sourceHit});
    }
   }
  }
  insist(row.sourceRayProbes===108&&row.sourceVsStagedRayDisagreements===0,
   'source-authentic producer mesh loses ray fidelity when packed for actual terrain shader');
  results.push(row);
  totals.originalPreviewAlternatives++;
  totals.allOriginalVertexPositionsCompared+=parity.exactFloat32PositionValues;
  totals.allOriginalMaterialsNeutral+=parity.neutralMaterialVertices;
 }
 insist(results.length===4&&totals.rays===432&&
  totals.originalSourceTriangleVersusProductionStagedDisagreements===0&&
  totals.selectionVersusStagedDisagreements>=0&&
  totals.selectionVersusStagedDisagreements<=432,
  'original 432 source shader ray census truncated or lost staging geometry');
 return {schema:'mythwrought.roadmap-a.pack5-actual-terrain-ray-staging-v1',
  ...totals,sourceRows:results,boundedSelectionAgainstStagedWarnings:examples,
  originalProductionPageBytes:PACK5_GPU_PAGE_BYTES,
  originalProductionResidentBytes:PACK5_GPU_RESIDENT_BYTES,
  originalProductionMaxPages:PACK5_GPU_MAX_PAGES,
  originalMeshAndProductionPackedTrianglesRaysAgree:true,
  originalSelectionAndActualMeshCanDifferAtGrazingEdges:true,
  sourceOnlyOriginalProducersNotModified:true,
  actualGameWebGLOrIphoneExecuted:false,originalSourceA5MaterialYawAssigned:false,
  originalWorldOrSavedSidecarWritten:false,structuralSupportApproved:false,
  realGameVisualPickabilityAccepted:false};
}
