// Builder D D16–17: read-only physical Pack 4 candidate-preview handoff.
// No runtime registration, world/save writes, Manual Pack source edits or assumption
// that a cube-only source screenshot is equivalent to final physical-family art.
// The caller must inject the ORIGINAL source-backed Pack 4 builder resolver.
// Original compiler cell.facing is an all-north placeholder for windows; authentic
// exterior-facing directions live in blueprint.openings and MUST override it here.
const dir=new Set(['north','east','south','west']);
const key=at=>at.join(',');
const families=Object.freeze({'pack4:030':159,'pack4:058':171,'pack4:059':172});
function validCell(c){return c&&Array.isArray(c.at)&&c.at.length===3&&c.at.every(Number.isSafeInteger)}
function checkedPhysical(resolve,ref,rotation){
 const numericId=families[ref];if(!numericId)throw Error('unrecognized original Pack4 source '+ref);
 const a=resolve(ref,{candidateId:numericId,rotation});
 if(!a||a.ref!==ref||a.id!==numericId||a.hasRealPhysicalGeometry!==true||a.registeredInLiveGame!==false||
    !Array.isArray(a.visible)||!a.visible.length||!Array.isArray(a.selection)||!a.selection.length||!a.previewMesh)
  throw Error('Pack4 original source did not return legitimate preview geometry: '+ref);
 return a;
}
export function inspectD16D17Pack4PhysicalSamples(blueprint,{resolvePack4Asset,maxWindows=12}={}){
 if(!blueprint||!Array.isArray(blueprint.cells)||!Array.isArray(blueprint.openings)||
   blueprint.worldPlaced!==false||blueprint.creatorApproved!==false||blueprint.integrated!==false)
  throw Error('Requires unregistered, theoretical original Builder D 4B blueprint');
 if(typeof resolvePack4Asset!=='function')throw TypeError('Original Pack4 physical source resolver is mandatory');
 if(!Number.isSafeInteger(maxWindows)||maxWindows<1||maxWindows>48)throw RangeError('bounded genuine facade samples required');
 const cells=new Map();for(const c of blueprint.cells){if(!validCell(c)||cells.has(key(c.at)))throw Error('invalid or duplicated source voxel');cells.set(key(c.at),c)}
 const windowOpenings=blueprint.openings.filter(o=>o.kind==='window');
 if(windowOpenings.length<8)throw Error('source lacks genuine physical candidate window positions');
 const selected=[];
 // Spread the quota across the complete TRUE source window inventory; no fake positions.
 for(let i=0;i<Math.min(windowOpenings.length,maxWindows);i++){
   const at=Math.floor(i*windowOpenings.length/Math.min(windowOpenings.length,maxWindows));
   selected.push(windowOpenings[at]);
 }
 const result=[],orientationSet=new Set();
 for(const o of selected){
   if(!validCell(o)||!dir.has(o.facing))throw Error('missing authoritative source facade orientation');
   const src=cells.get(key(o.at));if(!src||src.role!=='window'||src.asset!=='pack4:030')
    throw Error('opening has no original Pack4 glazing source voxel: '+key(o.at));
   const shape=checkedPhysical(resolvePack4Asset,src.asset,o.facing);
   orientationSet.add(o.facing);
   const supportAt=shape.mountOffset?o.at.map((n,i)=>n+shape.mountOffset[i]):null;
   result.push(Object.freeze({at:Object.freeze([...o.at]),kind:'physical-glazing-preview',asset:src.asset,
     originalNumericId:shape.id,rotation:shape.rotation,facadeFacing:o.facing,
     sourceCellFacingIgnored:src.facing!==o.facing,
     physicalVisibleBoxes:shape.visible.length,physicalSelectionBoxes:shape.selection.length,
     sourceOwner:'original-pack-4',mountSupportAt:supportAt?Object.freeze(supportAt):null,
     sourceMountCandidatePresent:supportAt?cells.has(key(supportAt)):true,
     renderableOriginalMesh:true,livePlaceable:false}));
 }
 const furniture=[];
 for(const c of blueprint.cells){
  if(c.role!=='fixture'||!(c.asset==='pack4:058'||c.asset==='pack4:059'))continue;
  if(!validCell(c))throw Error('invalid source furnishing location');
  const facing=dir.has(c.facing)?c.facing:'north';
  const shape=checkedPhysical(resolvePack4Asset,c.asset,facing);
  const supportAt=shape.mountOffset?c.at.map((n,i)=>n+shape.mountOffset[i]):null;
  furniture.push(Object.freeze({at:Object.freeze([...c.at]),kind:'source-physical-furnishing-preview',asset:c.asset,
    originalNumericId:shape.id,rotation:shape.rotation,physicalVisibleBoxes:shape.visible.length,
    renderableOriginalMesh:true,mountSupportAt:supportAt?Object.freeze(supportAt):null,
    sourceMountCandidatePresent:supportAt?cells.has(key(supportAt)):true,
    livePlaceable:false}));
 }
 if(furniture.length!==2||new Set(furniture.map(x=>x.asset)).size!==2)
   throw Error('missing original authored bench and work-table source furniture');
 return Object.freeze({format:'mythwrought.builder-d.source-pack4-physical-samples.v1',
   blueprintId:blueprint.id,totalOriginalWindowOpenings:windowOpenings.length,
   sampledPhysicalWindows:Object.freeze(result),sampledFacings:Object.freeze([...orientationSet].sort()),
   sampledPhysicalFurniture:Object.freeze(furniture),exactPack4OriginalCandidateGeometry:true,
   sourceSamplesOnly:true,fullFacadePhysicalMeshesAccepted:false,worldMountsVerified:false,
   creatorArtApproved:false,iphoneHomeScreenAccepted:false,productionRegistered:false,
   originalSourceCellsMutated:false});
}
