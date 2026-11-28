// AB2 isolated owner bridge. Callers must provide the actual resident mesh
// inventory and environmental/overlay revision; no production host mounting.
import {createExpansionWorldQuery} from './physical-query.mjs';
import {runtimeMeshKey,LEGACY_GENERATION_MAX_Y} from '../../world-height.mjs';
import {createMobSourceRevision} from '../source-edit-epoch.mjs';
import {createM7MobCollisionReader} from '../ecosystem-world-geometry.mjs';
import {isEnvironmentGenerator} from '../../manual-biomes/profile-world.mjs';
export function createExpansionOwnerView(world,{hasOwner,observe,overlayEpoch,overlayRayHit}={}){
 if(typeof world?.get!=='function'||![hasOwner,observe,overlayEpoch].every(x=>typeof x==='function'))
  throw TypeError('Explicit resident owner, environmental and overlay authority required');
 const generator=world.base?.generationProfile?.generator??world.generationProfile?.generator;
 const reader=isEnvironmentGenerator(generator)?createM7MobCollisionReader(world):world;
 const baseRevision=createMobSourceRevision(world);
 let epoch=0,lastBase=baseRevision(),lastOverlay=overlayEpoch();
 if(!Number.isSafeInteger(lastOverlay)||lastOverlay<0)throw TypeError('Invalid overlay epoch');
 const revision=()=>{
  const a=baseRevision(),b=overlayEpoch();
  if(!Number.isSafeInteger(b)||b<0||b<lastOverlay)throw TypeError('Invalid overlay epoch');
  if(a!==lastBase||b!==lastOverlay){if(epoch===Number.MAX_SAFE_INTEGER)throw RangeError('Epoch exhausted');epoch++;lastBase=a;lastOverlay=b;}
  return epoch;
 };
 const resident=(cx,cz,section)=>hasOwner(runtimeMeshKey(cx,cz,section))===true;
 const extraOverlayBlocked=bounds=>{
  if(world.stagedNonblockCollision===undefined)return false;
  if(typeof world.stagedNonblockCollision!=='function')return undefined;
  const hit=world.stagedNonblockCollision(bounds);
  return typeof hit==='boolean'?hit:undefined;
 };
 const query=createExpansionWorldQuery(reader,{resident,revision,observe,overlayRayHit,extraOverlayBlocked});
 // The canonical collision reader maps M7 terrain to stone. Preserve original
 // source material identity for habitat classification; no mutable world API.
 const materialAt=(x,y,z)=>{
  if(![x,y,z].every(Number.isSafeInteger)||!query.residentAt([x,y,z]))return undefined;
  const id=world.get(x,y,z);
  return Number.isInteger(id)&&id>=0?id:undefined;
 };
 // Read the original generated/landmark source only, excluding player edits
 // and placed Pack2 cells. Above the historical natural ceiling is not
 // evidence of a natural provider; the future owner must supply that seam.
 const generatedMaterialAt=(x,y,z)=>{
  const source=world.base??world,key=x+','+y+','+z;
  if(y>LEGACY_GENERATION_MAX_Y||typeof source.naturalAndLandmarkBlock!=='function'||
     typeof source.edits?.has!=='function'||source.edits.has(key)||world.pack2Cells?.has(key))return undefined;
  const rev=revision(),actual=materialAt(x,y,z);
  if(actual===undefined)return undefined;
  const generated=source.naturalAndLandmarkBlock(x,y,z);
  return actual===generated&&query.residentAt([x,y,z])&&revision()===rev?actual:undefined;
 };
 return Object.freeze({query,materialAt,generatedMaterialAt,revision});
}
