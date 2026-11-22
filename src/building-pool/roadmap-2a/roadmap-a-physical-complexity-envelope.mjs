/**
 * Original Pack5 producer read-only adapter. No variant selection or gameplay.
 * Uses real source-authored mesh triangles/vertices, not 3D cube proxies.
 */
import {auditRoadmapAAll79PackBacking} from './roadmap-a-all79-original-pack5-backing-census.mjs';
import {buildRoadmapAConditionalPack5GeometryEnvelope} from './roadmap-a-physical-complexity-envelope-core.mjs';
import {resolveManualFivePackAsset} from '../../builder-assets/manual-five-pack.mjs';
import {PACK5_BUILDER_CATALOG} from '../../pack5-integration/catalog.mjs';
import {getPack5Surface,surfaceBoxMesh} from '../../block-packs/pack-5/architectural-surfaces.mjs';
export function readRoadmapAOriginalPack5GeometryAlternatives(){
 const out={};
 for(const symbol of ['pack5:079','pack5:080','pack5:081']){
  const family=PACK5_BUILDER_CATALOG.find(v=>v.symbolicId===symbol);
  if(!family||family.variants.length!==2)throw Error('Original Manual Pack5 variant roster changed: '+symbol);
  const choices=[];
  for(const variant of family.variants){
   const originalSurface=getPack5Surface(symbol,variant);
   const originalMesh=surfaceBoxMesh(originalSurface,{rotation:0});
   const byYaw=[0,1,2,3].map(yaw=>resolveManualFivePackAsset(symbol,{variant,orientation:yaw}));
   if(byYaw.some(r=>r.livePlaceable!==false||r.saveWritten!==false||
       r.visibleBoxes.length!==originalSurface.art.length||
       r.collisionBoxes.length!==byYaw[0].collisionBoxes.length))
    throw Error('Original 4-yaw physical Pack5 mesh/placement contract changed: '+symbol+'/'+variant);
   if(originalMesh.vertexCount!==24*originalSurface.art.length||
      originalMesh.triangles!==12*originalSurface.art.length||
      originalMesh.positions.length!==3*originalMesh.vertexCount||
      originalMesh.indices.length!==3*originalMesh.triangles)
    throw Error('Actual authored physical mesh source does not match boxes: '+symbol+'/'+variant);
   choices.push({symbol,variant,visibleBoxCount:originalSurface.art.length,
    meshTriangleCount:originalMesh.triangles,meshVertexCount:originalMesh.vertexCount,
    collisionBoxCount:byYaw[0].collisionBoxes.length,supportPolicy:byYaw[0].supportPolicy,
    supportByYaw:byYaw.map(r=>r.supportOffsets.map(a=>[...a])),
    sampledFromActualPack5Surface:true,chosenForBlueprint:false});
  }
  out[symbol]=choices;
 }
 return out;
}
export function auditRoadmapAConditionalSourceGeometryCost(){
 return buildRoadmapAConditionalPack5GeometryEnvelope(
  auditRoadmapAAll79PackBacking(),readRoadmapAOriginalPack5GeometryAlternatives());
}
