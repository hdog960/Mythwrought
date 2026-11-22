// Read-only integration entrypoint bound directly to REAL Mythwrought modules.
// Kept isolated until Codex's upper generator, save sidecar and source tests
// become available. Never imported by src/main.mjs at this checkpoint.
import {biome130Block,isBiome130BlockId,biome130Color} from '../biome130-registry.mjs';
import {prototypeSurfaceMesh} from '../shape-prototypes.mjs';
import {environmentGround} from '../environment-ground.mjs';
import {collides,raycast} from '../voxel.mjs';
import {meshSkyIslandSection} from './sky-source-mesh.mjs';
import {planPhysicalSkyVegetation} from './sky-vegetation-physical.mjs';
import {createSkyOriginalMaterials,createSkyOriginalWorldView,
  createSkyOriginalPhysicalQueries} from './sky-original-core.mjs';
export const originalSkyMaterials=createSkyOriginalMaterials({
  biome130Block,isBiome130BlockId,biome130Color,environmentGround,prototypeSurfaceMesh
});
export function createOriginalSkyPhysicalHost({groundWorld,skyGet,skyRotationAt,
  skyEdits,skyRotations}={}){
  const world=createSkyOriginalWorldView({groundWorld,skyGet,skyRotationAt,
    skyEdits,skyRotations,validateSkyId:originalSkyMaterials.validateId});
  const physical=createSkyOriginalPhysicalQueries(world,{collides,raycast});
  const meshSection=(cx,cz,section,{maxVertices}={})=>meshSkyIslandSection({
    source:world,cx,cz,section,shapeFor:originalSkyMaterials.shapeFor,
    surfaceMeshFor:originalSkyMaterials.surfaceMeshFor,
    appearanceFor:originalSkyMaterials.appearanceFor,
    rotationFor:world.rotationAt,maxVertices});
  const planPhysicalFoliage=(seed,vegetationPlan,{isProtectedCell,maxCells}={})=>{
    const verified=originalSkyMaterials.filterSupportedVegetation(vegetationPlan);
    const proposed=planPhysicalSkyVegetation({seed,plan:verified,
      sourceGet:world.get,assetFor:originalSkyMaterials.assetFor,
      isPhysicalAsset:originalSkyMaterials.isPhysicalAsset,isProtectedCell,maxCells});
    return Object.freeze({proposed,omittedUnregistered:verified.omitted});
  };
  return Object.freeze({world,physical,materials:originalSkyMaterials,
    meshSection,planPhysicalFoliage});
}
