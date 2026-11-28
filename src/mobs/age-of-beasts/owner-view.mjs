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
 // Cache only scalar collision source IDs within one synchronous fixture
 // advance. Residency, shapes, water, overlays and revisions remain checked
 // by the original query. Never cache unknown IDs or retain across advances.
 let scope=null;
 function withSourceReadScope(fn){
  if(typeof fn!=='function'||scope)throw TypeError('Invalid nested source scope');
  scope={revision:revision(),cells:new Map()};
  try{return fn();}finally{scope=null;}
 }
 const scopedReader={
  get(x,y,z){
   if(!scope)return reader.get(x,y,z);
   const rev=revision();
   if(scope.revision!==rev){scope.cells.clear();scope.revision=rev;}
   const key=x+','+y+','+z;
   if(scope.cells.has(key))return scope.cells.get(key);
   const id=reader.get(x,y,z);
   if(Number.isInteger(id)&&id>=0&&scope.cells.size<4096&&revision()===rev)scope.cells.set(key,id);
   return id;
  },
  get mobMountainShape(){return reader.mobMountainShape;},
  get getPack2State(){return typeof reader.getPack2State==='function'?reader.getPack2State.bind(reader):undefined;},
  get rotationAt(){return typeof reader.rotationAt==='function'?reader.rotationAt.bind(reader):undefined;},
  get pack3Runtime(){return reader.pack3Runtime;},
  get manual14Layer(){return reader.manual14Layer;},
  get manual14Collision(){return typeof reader.manual14Collision==='function'?reader.manual14Collision.bind(reader):undefined;},
  get pack5Collision(){return typeof reader.pack5Collision==='function'?reader.pack5Collision.bind(reader):undefined;}
 };
 const query=createExpansionWorldQuery(scopedReader,{resident,revision,observe,overlayRayHit,extraOverlayBlocked});
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
 return Object.freeze({query,materialAt,generatedMaterialAt,revision,withSourceReadScope});
}
