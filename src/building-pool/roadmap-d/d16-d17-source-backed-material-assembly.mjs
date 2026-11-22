// MYTHWROUGHT Builder D W16–17: original Manual Packs 1/3/4 PHYSICAL source geometry.
// READ-ONLY diagnostic material assembly. No terrain, saves, live IDs, world placement,
// other builder assets, shader or compiler edits. Creator art/integration NOT approved.
// Sampling bounds prevent massive full-structure allocations on iPhone hardware.
import {inspectD16D17Pack4PhysicalSamples} from './d16-d17-source-backed-pack4-preview.mjs';
const profile=Object.freeze({
  temperate:Object.freeze({masonry:['pack1:002',10],roof:['pack3:023',109]}),
  desert:Object.freeze({masonry:['pack1:006',14],roof:['pack3:024',110]}),
  snow:Object.freeze({masonry:['pack1:005',13],roof:['pack3:025',111]}),
  'enchanted-forest':Object.freeze({masonry:['pack1:003',11],roof:['pack3:026',112]}),
  mountain:Object.freeze({masonry:['pack1:004',12],roof:['pack3:025',111]})
});
const key=at=>at.join(',');
const validAt=at=>Array.isArray(at)&&at.length===3&&at.every(Number.isSafeInteger);
const roleOk=new Set(['wall','roof','column','trim']);
function sampled(rows,count){
 if(!Number.isInteger(count)||count<1||count>48)throw RangeError('bounded original physical sample count required');
 const output=[];for(let i=0;i<Math.min(count,rows.length);i++)output.push(rows[Math.floor(i*rows.length/Math.min(count,rows.length))]);
 return output;
}
function boxes(v,name){
 if(!Array.isArray(v)||!v.length||v.length>32||
    v.some(b=>!Array.isArray(b)||b.length!==6||b.some(x=>!Number.isFinite(x))||
    b[0]<0||b[1]<0||b[2]<0||b[3]>1||b[4]>1||b[5]>1||
    b[0]>=b[3]||b[1]>=b[4]||b[2]>=b[5]))
  throw Error('Invalid ORIGINAL Manual physical '+name+' local shape boxes');
 return v;
}
function physicalAt(cell,symbol,id,orientation,pack,resolveManualAsset,tag){
 if(!validAt(cell.at))throw Error('original source coordinate invalid');
 const asset=resolveManualAsset(symbol,{numericId:id,orientation});
 if(!asset||asset.symbol!==symbol||asset.sourcePack!==pack||asset.numericId!==id||
    asset.physical!==true||asset.livePlaceable!==false||asset.saveWritten!==false)
   throw Error('Pack '+pack+' original physical source owner contract mismatch: '+symbol);
 const visible=boxes(asset.visibleBoxes,'visible'),target=boxes(asset.selectionBoxes,'target');
 const collision=asset.collisionBoxes;
 if(!Array.isArray(collision))throw Error('Missing original physical collision shape set: '+symbol);
 const worldBoxes=visible.map(b=>Object.freeze(b.map((v,i)=>v+cell.at[i%3])));
 return Object.freeze({
   sourceAt:Object.freeze([...cell.at]),sourceRole:cell.role,
   materialPreviewOnly:true,sourceOriginalSymbol:symbol,sourceOriginalPack:pack,sourceNumericId:id,
   sourceOrientation:orientation,originalPhysicalSelectionBoxes:target.length,
   originalPhysicalCollisionBoxes:collision.length,
   originalPhysicalVisibleBoxes:visible.length,
   renderablePhysicalBoxes:Object.freeze(worldBoxes.map(x=>Object.freeze(x))),
   sourceCellReplaced:false,worldPlaced:false,originalGeometryResolved:true,
   sampleKind:tag
 });
}
// Preserve actual original Pack4 typed RGBA mesh vertices instead of substituting
// box-shaped fake glazing. The original format is position xyz, normal xyz,
// diffuse rgba (10 floats per vertex, three vertices per triangle).
function originalPack4WorldMesh(cell,asset){
 if(!asset||asset.hasRealPhysicalGeometry!==true||asset.registeredInLiveGame!==false)
   throw Error('Pack4 physical producer authenticity failed');
 const mesh=asset.previewMesh,stride=mesh?.stride;
 if(stride!==10||!(mesh.opaque instanceof Float32Array)||
    !(mesh.translucent instanceof Float32Array))
   throw Error('Original Pack4 mesh has no typed 10-float source layout');
 const translate=group=>{
   if(group.length%(stride*3)!==0)throw Error('Pack4 source buffer is not complete triangles');
   const transformed=new Float32Array(group);
   for(let i=0;i<transformed.length;i+=stride){
     for(let j=0;j<3;j++)transformed[i+j]+=cell.at[j];
     for(let j=0;j<stride;j++)if(!Number.isFinite(transformed[i+j]))
       throw Error('Invalid original Pack4 RGBA source vertex');
     for(let j=6;j<10;j++)if(transformed[i+j]<0||transformed[i+j]>1)
       throw Error('Invalid original Pack4 physical material alpha or color');
   }
   return transformed;
 };
 const opaque=translate(mesh.opaque),translucent=translate(mesh.translucent);
 if(!opaque.length&&!translucent.length)throw Error('Empty original Pack4 visible source mesh');
 return Object.freeze({
   source:'original-pack4-actual-preview-vertices',stride,
   opaqueWorldVertices:opaque,translucentWorldVertices:translucent,
   opaqueTriangles:opaque.length/(stride*3),translucentTriangles:translucent.length/(stride*3),
   materialRGBAUnmodified:true,vertexNormalsUnmodified:true,sourceCellUnmodified:true,
   preSortedTransparency:false,worldRendererAcceptance:false
 });
}

function inferRidgeAxis(c,all){
 // The W16/17 authored p.ridges remain actual source voxel courses. Determine
 // axis only from adjacent exact-y graded/roof source neighbors; never infer
 // from a default north-facing compiler cell.
 const [x,y,z]=c.at;
 const same=at=>{const n=all.get(key(at));return n&&n.feature===c.feature&&n.role===c.role};
 const xNeighbors=Number(!!same([x-1,y,z]))+Number(!!same([x+1,y,z]));
 const zNeighbors=Number(!!same([x,y,z-1]))+Number(!!same([x,y,z+1]));
 if(!xNeighbors&&!zNeighbors)return 'north';
 return xNeighbors>zNeighbors?'east':'north';
}
export function assembleD16D17OriginalPhysicalPreview(blueprint,{
 resolveManualAsset,resolvePack4Asset,windowBudget=12,facadeBudget=8,roofBudget=8,ridgeBudget=6,towerBudget=4
}={}){
 if(!blueprint||!profile[blueprint.biome]||
    blueprint.integrated!==false||blueprint.worldPlaced!==false||blueprint.creatorApproved!==false||
    !Array.isArray(blueprint.cells))throw Error('Requires unintegrated original W16/W17 4B source');
 if(typeof resolveManualAsset!=='function'||typeof resolvePack4Asset!=='function')
   throw TypeError('Original Manual1/3 and Pack4 source-backed resolvers required');
 for(const n of [facadeBudget,roofBudget,ridgeBudget,towerBudget])if(!Number.isInteger(n)||n<1||n>48)
   throw RangeError('Original physical sample budget outside bounded 1..48');
 const occupancy=new Map();
 for(const c of blueprint.cells){if(!validAt(c.at)||occupancy.has(key(c.at)))throw Error('overlapping source original cells');occupancy.set(key(c.at),c)}
 const [masonryRef,masonryId]=profile[blueprint.biome].masonry;
 const [roofRef,roofId]=profile[blueprint.biome].roof;
 const exterior=blueprint.cells.filter(c=>c.role==='wall'&&c.asset.startsWith('live:')&&
   [[-1,0],[1,0],[0,-1],[0,1]].some(([dx,dz])=>!occupancy.has(key([c.at[0]+dx,c.at[1],c.at[2]+dz]))));
 const weather=blueprint.cells.filter(c=>c.role==='roof'&&c.feature==='weather-plane');
 const ridges=blueprint.cells.filter(c=>roleOk.has(c.role)&&c.feature?.startsWith('graded-')&&c.at[1]>7);
 const crowns=blueprint.cells.filter(c=>c.role==='trim'&&c.feature?.startsWith('tower-')&&c.at[1]>8);
 for(const [n,rows] of [['wall',exterior],['roof',weather],['graded ridge',ridges],['tower crown',crowns]])
   if(rows.length<8)throw Error('No genuinely authored physical '+n+' original positions');
 const samples=[];
 // Preserve original wood/stone authoring intent: wood is ACTUAL Pack2 planks,
 // not recolored Pack1 masonry. Prefer both physical material families when the
 // source really has both; no invented wood positions in stone-only structures.
 const stone=exterior.filter(c=>c.asset!=='live:wood'),timber=exterior.filter(c=>c.asset==='live:wood');
 let selected;
 if(stone.length&&timber.length&&facadeBudget>=2){
   const nWood=Math.max(1,Math.min(facadeBudget-1,Math.round(facadeBudget*timber.length/exterior.length)));
   selected=[...sampled(stone,facadeBudget-nWood),...sampled(timber,nWood)];
 }else selected=sampled(exterior,facadeBudget);
 for(const c of selected){
   const wood=c.asset==='live:wood';
   samples.push(physicalAt(c,wood?'pack2:013':masonryRef,wood?59:masonryId,
      'north',wood?2:1,resolveManualAsset,wood?'original-planed-wood-facade':'external-masonry'));
 }
 for(const c of sampled(weather,roofBudget))samples.push(physicalAt(c,roofRef,roofId,'north',3,resolveManualAsset,'original-weather-roof'));
 for(const c of sampled(ridges,ridgeBudget))samples.push(physicalAt(c,'pack3:029',115,inferRidgeAxis(c,occupancy),3,resolveManualAsset,'original-graded-ridge'));
 for(const c of sampled(crowns,towerBudget))samples.push(physicalAt(c,'pack3:077',124,'north',3,resolveManualAsset,'original-spire-crown'));
 // All glazing/furniture shapes come from actual original Pack4 candidate mesh/shape
 // resolver. These are samples, not fabricated complete physical structures.
 const glazing=inspectD16D17Pack4PhysicalSamples(blueprint,{resolvePack4Asset,maxWindows:windowBudget});
 for(const g of [...glazing.sampledPhysicalWindows,...glazing.sampledPhysicalFurniture]){
   const c=occupancy.get(key(g.at));
   if(!c||!c.asset?.startsWith('pack4:'))throw Error('Lost original Pack4 source at '+key(g.at));
   const orientation=g.facadeFacing??'north';
   const originalPack4=resolvePack4Asset(c.asset,{candidateId:g.originalNumericId,rotation:orientation});
   const physicallyResolved=physicalAt(c,c.asset,g.originalNumericId,orientation,4,resolveManualAsset,g.kind);
   samples.push(Object.freeze({...physicallyResolved,
     originalRealPack4WorldMesh:originalPack4WorldMesh(c,originalPack4)}));
 }
 if(samples.length>facadeBudget+roofBudget+ridgeBudget+towerBudget+windowBudget+2)
   throw Error('Unbounded physical sample packet');
 const counts=Object.freeze(samples.reduce((o,row)=>(o[row.sampleKind]=(o[row.sampleKind]||0)+1,o),{}));
 return Object.freeze({format:'mythwrought.builder-d.w16-w17.manual-physical-assembly.v1',
  blueprintId:blueprint.id,biome:blueprint.biome,originalSourceCellCount:blueprint.cells.length,
  sampledCount:samples.length,sampleCounts:counts,physicalSamples:Object.freeze(samples),
  pack4MeshGlazingCount:glazing.sampledPhysicalWindows.length,
  originalWindowFacadeCorrections:glazing.sampledPhysicalWindows.filter(x=>x.sourceCellFacingIgnored).length,
  underlyingSourceCellsMutated:false,completeWorldStructure:false,
  fullManualFamilyArtworkAccepted:false,worldSupportAndMountsAccepted:false,
  sourcePacksUsed:Object.freeze([...new Set(samples.map(p=>p.sourceOriginalPack))].sort()),sourceOnly:true,worldPlaced:false,
  creatorArtApproved:false,iphonePerformanceValidated:false,gameplayIntegrated:false
 });
}
