// MYTHWROUGHT Snow S9 isolated, single-visible-voxel natural pigment gate.
// This is a PURE decision helper for a future single synchronous meshChunk;
// the original production mesh itself is not edited or registered.
// Caller MUST supply values from EXISTING original mesh caches:
// originalSurface(), blockAt(), hasEdit() and genuine source cave overrides.
// No new _columnPlan, no repeat world.get/biome lookups, no mesh/schema write.
import {previewSnowS6WinterTone} from './snowy-s6-winter-tone-proposal.mjs';
export const SNOW_S9_ELIGIBLE_CAPS=Object.freeze([272,276,279]);
const ids=new Set(SNOW_S9_ELIGIBLE_CAPS);
const safe=n=>Number.isSafeInteger(n)&&Math.abs(n)<=100000;
export function snowS9PigmentAtVisibleOriginalCap(witness){
  if(!witness||typeof witness!=='object'||!safe(witness.seed)||
     witness.seed!==(witness.seed|0)||!safe(witness.x)||!safe(witness.z)||
     !Number.isSafeInteger(witness.y)||witness.y<2||witness.y>19||
     !Number.isSafeInteger(witness.id)||typeof witness.biomeAt!=='function')
    throw new TypeError('S9 requires exact bounded original M7 visible-source witness');
  const {x,y,z,id,sourceSurface,observed,below,above,
    editedCap,editedSupport,caveCap,caveSupport,seed,biomeAt}=witness;
  // Return undefined (unchanged ORIGINAL color) for all ineligible cells.
  // These are source attestations, not rules to generate new cells.
  if(!ids.has(id)||!sourceSurface||
     sourceSurface.top!==y||sourceSurface.id!==id||
     observed!==id||below===0||above!==0||
     editedCap!==false||editedSupport!==false||
     caveCap!==undefined||caveSupport!==undefined)
    return undefined;
  const region=biomeAt(x,z,seed);
  if(region?.name!=='snow'||!Number.isFinite(region.weight)||
     region.weight<0||region.weight>1)return undefined;
  return previewSnowS6WinterTone(seed,x,z,id,region.weight)
    .proposedLinearRgb;
}
// Do not confuse S9 RGB-only acceptance with a source material/UV change.
// Original vMat/terrainArtMaterial, face lighting and vertex count stay owned
// exclusively by the existing production meshChunk/biome130 path.
export const SNOW_S9_RESEARCH_CONTRACT=Object.freeze({
  originalM7Only:true,pigmentRgbOnly:true,
  noNewColumnCache:true,noWorldWrites:true,
  noPlayerAuthoredIceTint:true,unregistered:true,
  oldGeometryUvMaterialOwnedByOriginal:true,
  iPhoneAcceptanceNotRun:true
});
