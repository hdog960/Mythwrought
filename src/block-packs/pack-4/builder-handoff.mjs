// Pack 4 physical construction adapter for isolated village/town/city builders.
// Provides exact original geometry (not just symbolic dependency IDs).
// No registration, writes, deployment, world placement or production save import.
import {PACK4_WINDOW_ASSETS,windowPreviewMesh} from './windows.mjs';
import {PACK4_LIGHT_ASSETS,lightingPreviewMesh} from './lighting.mjs';
import {PACK4_FURNISHING_ASSETS,furnishingPreviewMesh} from './furnishings.mjs';
import {PACK4_CIVIC_ASSETS,civicPreviewMesh} from './hearth-civic.mjs';
import {pack4Shape,pack4MountOffset} from './fixture.mjs';

const assets=Object.freeze([
 ...PACK4_WINDOW_ASSETS,...PACK4_LIGHT_ASSETS,
 ...PACK4_FURNISHING_ASSETS,...PACK4_CIVIC_ASSETS
].sort((a,b)=>a.id-b.id));
const refFor=roster=>'pack4:'+String(roster).padStart(3,'0');
const byId=new Map(assets.map(asset=>[asset.id,asset]));
const byFamily=new Map();
for(const asset of assets){
 const ref=refFor(asset.roster);
 if(!byFamily.has(ref))byFamily.set(ref,[]);
 byFamily.get(ref).push(asset);
}
if(assets.length!==23||byId.size!==23||byFamily.size!==22||
   assets.some((a,i)=>a.id!==159+i))
 throw Error('Pack 4 construction catalog does not match 23 unique candidate IDs');
const turns=Object.freeze({north:0,east:1,south:2,west:3});
const safeAt=at=>{
 if(!Array.isArray(at)||at.length!==3||!at.every(Number.isSafeInteger))
  throw TypeError('Pack4 builder location must be safe-integer [x,y,z]');
 return Object.freeze([...at]);
};
const rotationFor=value=>{
 if(typeof value==='string'&&Object.hasOwn(turns,value))return turns[value];
 if(Number.isInteger(value)&&value>=0&&value<4)return value;
 throw RangeError('Pack4 builder facing must be north/east/south/west or quarter-turn 0..3');
};
export const PACK4_BUILDER_CATALOG=Object.freeze(assets.map(a=>Object.freeze({
 ref:refFor(a.roster),id:a.id,roster:a.roster,key:a.key,name:a.name,
 mount:a.mount,availableRotations:Object.freeze([0,1,2,3]),
 kind:'physical-single-cell',hasRealPhysicalGeometry:true,
 usableForIsolatedConstruction:true,registeredInLiveGame:false,
 builderStatus:'verified-candidate',simulationEnabled:false
})));
export const PACK4_BUILDER_FAMILIES=Object.freeze(
 [...byFamily].map(([ref,variants])=>Object.freeze({
  ref,roster:variants[0].roster,defaultCandidateId:variants[0].id,
  variantIds:Object.freeze(variants.map(a=>a.id))
 }))
);
export function pack4BuildingVariants(ref){
 const variants=byFamily.get(ref);
 if(!variants)throw RangeError('Unrecognized Pack4 building family '+String(ref));
 return Object.freeze(variants.map(a=>PACK4_BUILDER_CATALOG[a.id-159]));
}
export function pack4BuilderAsset(ref,{candidateId=null,rotation=0}={}){
 const variants=byFamily.get(ref);
 if(!variants)throw RangeError('Unrecognized Pack4 building family '+String(ref));
 // One canonical default per symbolic family; stained glass supports explicit
 // 160/161 selection without inventing a second roster namespace.
 const id=candidateId===null?variants[0].id:candidateId;
 if(!variants.some(x=>x.id===id))throw RangeError('Candidate ID does not belong to '+ref);
 const turn=rotationFor(rotation);
 const source=byId.get(id);
 const shape=pack4Shape(id,turn);
 const mountOffset=pack4MountOffset(id,turn);
 const previewMesh=id<=164?windowPreviewMesh(id,turn):
   id<=168?lightingPreviewMesh(id,turn):
   id<=175?furnishingPreviewMesh(id,turn):civicPreviewMesh(id,turn);
 return Object.freeze({
  ref,id,roster:source.roster,key:source.key,name:source.name,
  rotation:turn,mount:source.mount,
  mountOffset:mountOffset?Object.freeze([...mountOffset]):null,
  visible:shape.visible,selection:shape.selection,collision:shape.collision,
  renderPass:shape.renderPass,occludesWholeCell:false,
  previewMesh, // original typed-vertex arrays, actual opaque and alpha groups
  singleCell:true,rotationInSidecar:true,
  hasRealPhysicalGeometry:true,usableForIsolatedConstruction:true,
  registeredInLiveGame:false,workingEffects:false
 });
}
export function pack4BuilderPlacement(item,{candidateId=null}={}){
 if(!item||typeof item!=='object')throw TypeError('Expected builder placement object');
 const at=safeAt(item.at);
 const ref=item.asset??item.ref;
 const id=item.candidateId??candidateId;
 const facing=item.orientation??item.facing??'north';
 const part=pack4BuilderAsset(ref,{candidateId:id,rotation:facing});
 const supportAt=part.mountOffset?at.map((v,i)=>v+part.mountOffset[i]):null;
 if(supportAt&&!supportAt.every(Number.isSafeInteger))
  throw RangeError('Pack4 support location overflows safe integer coordinates');
 return Object.freeze({
  at,asset:part.ref,candidateId:part.id,rotation:part.rotation,
  mount:part.mount,supportAt:supportAt?Object.freeze(supportAt):null,
  physical:part,
  state:Object.freeze({id:part.id,rotation:part.rotation}),
  productionPlacement:false
 });
}
const cellKey=at=>at.join(',');
export function resolvePack4BuilderBlueprint(blueprint,{
 variantByRef={},fixedSupportCells=[],requireSupport=false
}={}){
 // Four independently owned theoretical building roadmaps encode cell slots
 // differently. Normalize WITHOUT editing or claiming their schema is resolved.
 let rows=blueprint?.placements??blueprint?.cells;
 if(!Array.isArray(rows)&&Array.isArray(blueprint?.voxels)){
  const maxX=blueprint.extents?.x, maxZ=blueprint.extents?.z;
  rows=blueprint.voxels.map(v=>{
   let orientation='north',orientationProvenance='default-preview-only';
   if(v.kind==='window'){
    if(v.x===0){orientation='west';orientationProvenance='facade-derived';}
    else if(v.x===maxX-1){orientation='east';orientationProvenance='facade-derived';}
    else if(v.z===maxZ-1){orientation='south';orientationProvenance='facade-derived';}
    else if(v.z===0){orientation='north';orientationProvenance='facade-derived';}
   }
   return {at:[v.x,v.y,v.z],asset:v.material,orientation,orientationProvenance};
  });
 }
 if(!Array.isArray(rows)&&Array.isArray(blueprint?.modules))
  rows=blueprint.modules.flatMap(module=>(module.cells??[]).map(cell=>({
   at:cell.slice(0,3),asset:cell[3],orientation:'north',
   orientationProvenance:'default-preview-only'
  })));
 if(!Array.isArray(rows))
  throw TypeError('Expected Roadmap 1 placements, Roadmap 2 voxels, Roadmap 3 modules, or Roadmap 4 cells');
 if(!variantByRef||typeof variantByRef!=='object'||Array.isArray(variantByRef))
  throw TypeError('Invalid Pack4 variant choices');
 const fixed=new Set(fixedSupportCells.map(at=>cellKey(safeAt(at))));
 const used=new Set(),resolved=[];
 for(const row of rows){
  if(typeof row?.asset!=='string'||!row.asset.startsWith('pack4:'))continue;
  const placement=pack4BuilderPlacement(row,{
   candidateId:row.candidateId??variantByRef[row.asset]??null
  });
  const key=cellKey(placement.at);
  if(used.has(key))throw Error('Duplicate Pack4 construction cell '+key);
  used.add(key);
  const supported=placement.supportAt===null||
    fixed.has(cellKey(placement.supportAt));
  if(requireSupport&&!supported)
   throw Error('Missing real fixed support for Pack4 '+placement.asset+' at '+key);
  const provenance=row.orientationProvenance??
   (row.orientation!==undefined||row.facing!==undefined?
    'authored':'default-preview-only');
  resolved.push(Object.freeze({...placement,supportVerified:supported,
   orientationProvenance:provenance,
   orientationRequiresReview:provenance==='default-preview-only'}));
 }
 return Object.freeze({
  blueprintId:blueprint.id??null,
  resolvedCount:resolved.length,placements:Object.freeze(resolved),
  allMountsSupported:resolved.every(x=>x.supportVerified),
  orientationReviewCount:resolved.filter(x=>x.orientationRequiresReview).length,
  hasRealPhysicalGeometry:true,registeredInLiveGame:false,
  source:'Pack4 original geometry; zero symbolic-only substitutions'
 });
}
