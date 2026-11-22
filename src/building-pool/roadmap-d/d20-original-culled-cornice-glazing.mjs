// MYTHWROUGHT D20 — original physical Pack3/Pack4 NON-OVERLAPPING window-cornice proposal.
// Isolated read-only candidate; preserves every original source voxel, Pack asset and save.
// The original Pack3 cornice (ID120) as a FULL asset overlaps Pack4 glazing. Only source
// parts which do not touch the original Pack4 visible/selection/collision volumes
// may be selected; that is a NEW composite preview, NOT an unmodified Pack3 live block.
const name='mythwrought.builder-d.d20.source-authentic-exclusive-glazing-cornice.v1';
const allFacings=Object.freeze({north:0,east:1,south:2,west:3});
const solid=new Set(['wall','beam','foundation','floor','partition','column']);
const K=a=>a.join(',');
const validAt=a=>Array.isArray(a)&&a.length===3&&a.every(Number.isSafeInteger);
function goodBox(b){
 return Array.isArray(b)&&b.length===6&&b.every(Number.isFinite)&&
  [0,1,2].every(i=>b[i]>=0&&b[i]<b[i+3]&&b[i+3]<=1);
}
function intersect(a,b){return [0,1,2].every(i=>Math.min(a[i+3],b[i+3])-Math.max(a[i],b[i])>1e-6)}
function partsFromOriginal(original,glass){
 if(!original||original.id!==120||!Array.isArray(original.parts)||original.parts.length!==15||
    !original.colors||!glass||![159,160,161].includes(glass.id)||
    !Array.isArray(glass.visible)||!glass.visible.length||
    !Array.isArray(glass.collision)||!Array.isArray(glass.selection))
   throw Error('Original physical Pack3 cornice and Pack4 glazing sources are mandatory');
 const masks=[...glass.visible.map(x=>x.bounds),...glass.collision,...glass.selection];
 if(masks.some(x=>!goodBox(x)))throw Error('Invalid original Pack4 glazed physical selection bounds');
 let rejected=0;const kept=[];
 for(const part of original.parts){
  if(!goodBox(part.box)||typeof part.tone!=='string')throw Error('Invalid original Pack3 cornice physical parts');
  const col=original.colors[part.tone];
  if(typeof col!=='string'||!/^#[a-fA-F0-9]{6}$/.test(col))throw Error('Original Pack3 source colors missing');
  if(masks.some(x=>intersect(part.box,x))){rejected++;continue}
  kept.push(Object.freeze({sourceTone:part.tone,sourceHex:col,
    localAabb:Object.freeze([...part.box]),sourceOriginalId120:true}));
 }
 // True original corner/molding geometry survives; all-source visual boxes
 // remain intact, but overlapping full-block Pack3 source pieces are culled.
 if(kept.length<8||kept.length>15||rejected<1)throw Error('Nonoverlapping physical cornice cannot be composed safely');
 const pieces=kept.length*12,glazeTriangles=(glass.glazingTriangles??0);
 if(pieces>192)throw Error('Cornice physical candidate exceeds iPhone bounded geometry');
 return Object.freeze({parts:Object.freeze(kept),original15Pieces:original.parts.length,
  sourcePiecesRejected:rejected,corniceVisibleTriangles:pieces});
}
export function planD20SourceSafeWindowCornices(blueprint,originalGlazingPlan,{
 resolvePack3Ornamental,resolvePack4WindowShape,resolvePack4Asset,maxSites=8,maxPreviewBytes=256*1024
}={}){
 if(!blueprint||blueprint.worldPlaced!==false||blueprint.integrated!==false||
    blueprint.creatorApproved!==false||!Array.isArray(blueprint.cells)||
    !Array.isArray(blueprint.openings))throw Error('Original unregistered 4B source required');
 if(!originalGlazingPlan||originalGlazingPlan.blueprintId!==blueprint.id||
    originalGlazingPlan.glazingMutuallyExclusive!==true||
    originalGlazingPlan.noSameCellWindowLayering!==true||
    !Array.isArray(originalGlazingPlan.plannedOriginalWindowChoices))
   throw Error('Genuine D19 single-candidate window source plans required');
 if(typeof resolvePack3Ornamental!=='function'||typeof resolvePack4WindowShape!=='function'||
    typeof resolvePack4Asset!=='function')throw TypeError('Original Pack3 and Pack4 physical resolvers required');
 if(!Number.isSafeInteger(maxSites)||maxSites<1||maxSites>12||
    !Number.isSafeInteger(maxPreviewBytes)||maxPreviewBytes<4096||maxPreviewBytes>256*1024)
   throw RangeError('D20 physical cornice preview budget invalid');
 const source=new Map();
 for(const c of blueprint.cells){
  if(!validAt(c.at)||source.has(K(c.at)))throw Error('Duplicate original 4B source voxel');
  source.set(K(c.at),c);
 }
 const windows=new Map(blueprint.openings.filter(o=>o.kind==='window').map(o=>[K(o.at),o]));
 if(windows.size!==originalGlazingPlan.plannedOriginalWindowChoices.length)
   throw Error('Original authored window count differs from D19 retained selection');
 const flagged=[];
 for(const choice of originalGlazingPlan.plannedOriginalWindowChoices){
  if(!validAt(choice.at)||!windows.has(K(choice.at))||
     !Object.hasOwn(allFacings,choice.authoritativeFacadeFacing)||
     ![159,160,161].includes(choice.candidateId)||
     choice.candidateRef!==(choice.candidateId===159?'pack4:030':'pack4:031')||
     choice.neverOverlayOriginalGlass!==true||choice.originalCellRetained!==true)
   throw Error('D20 refuses inconsistent or stacked source window selection');
  const old=source.get(K(choice.at)),op=windows.get(K(choice.at));
  if(!old||old.role!=='window'||old.asset!=='pack4:030'||
     op.facing!==choice.authoritativeFacadeFacing)
   throw Error('D20 would replace non-original window cell');
  const [x,y,z]=choice.at,side=['north','south'].includes(op.facing)?
    [[x-1,y,z],[x+1,y,z]]:[[x,y,z-1],[x,y,z+1]];
  const jambCount=side.filter(a=>solid.has(source.get(K(a))?.role)).length;
  if(jambCount!==choice.structuralJambCount||
     choice.sourceWindowRequiresRemediation!==(jambCount<2))
   throw Error('Window jamb provenance does not match real original 4B geometry');
  const bottom=source.get(K([x,y-1,z])),upper=source.get(K([x,y+1,z]));
  if(jambCount<2){
   if(y!==3||!bottom||bottom.role!=='wall'||!upper||upper.role!=='beam')
    throw Error('Missing original wall/lintel above and below window; no physical cornice proposal');
   flagged.push(choice);
  }
 }
 if(!flagged.length)throw Error('No genuine deficient original window corner to review');
 const physical=[];
 const selectedCount=Math.min(flagged.length,maxSites);
 let bytes=0;
 for(let i=0;i<selectedCount;i++){
  const choice=flagged[Math.floor(i*flagged.length/selectedCount)],rot=allFacings[choice.authoritativeFacadeFacing];
  const arch=resolvePack3Ornamental(120,rot),glass=resolvePack4WindowShape(choice.candidateId,rot);
  const actual=resolvePack4Asset(choice.candidateRef,{
    candidateId:choice.candidateId,rotation:choice.authoritativeFacadeFacing});
  if(!actual||actual.ref!==choice.candidateRef||actual.id!==choice.candidateId||
     actual.rotation!==rot||actual.hasRealPhysicalGeometry!==true||
     actual.registeredInLiveGame!==false||
     actual.previewMesh?.stride!==10||
     !(actual.previewMesh.opaque instanceof Float32Array)||
     !(actual.previewMesh.translucent instanceof Float32Array))
   throw Error('Original Pack4 genuine translucent physical mesh unavailable');
  const pack4Triangles=(actual.previewMesh.opaque.length+actual.previewMesh.translucent.length)/30;
  if(!Number.isSafeInteger(pack4Triangles)||pack4Triangles<1||pack4Triangles>320)
   throw Error('Pack4 real glazing triangle budget invalid');
  const physicalCornice=partsFromOriginal(arch,glass);
  const actualSourceBytes=(physicalCornice.corniceVisibleTriangles+pack4Triangles)*3*10*4;
  bytes+=actualSourceBytes;
  if(bytes>maxPreviewBytes)throw Error('D20 bounded source-only physical preview memory exceeded');
  const sourcePoints=physicalCornice.parts.map(p=>Object.freeze({
   sourceAt:Object.freeze([...choice.at]),sourceTone:p.sourceTone,sourceHex:p.sourceHex,
   originalPartAabb:p.localAabb,
   worldPartAabb:Object.freeze(p.localAabb.map((v,j)=>v+choice.at[j%3]))}));
  physical.push(Object.freeze({at:Object.freeze([...choice.at]),facing:choice.authoritativeFacadeFacing,
   originalGlazingId:choice.candidateId,originalGlazingRef:choice.candidateRef,
   originalPack3CorniceId:120,sourcePack3PartCount:15,
   retainedOriginalPack3Parts:physicalCornice.parts.length,
   culledOverlappingSourceParts:physicalCornice.sourcePiecesRejected,
   originalPhysicalWindowTriangles:pack4Triangles,
   originalPhysicalCorniceTriangles:physicalCornice.corniceVisibleTriangles,
   originalRenderPreviewBytes:actualSourceBytes,
   originalMaterialBoxes:Object.freeze(sourcePoints),
   hasNoVisibleSelectionCollisionOverlapsWithGlass:true,
   noGlassRemovedOrResized:true,notAnUnmodifiedLivePack3Block:true,
   originalWallLintelRetained:true,sideJambsStillNeedStructuralReview:true,
   loadBearingAccepted:false,renderedInOriginalGame:false,worldPlaced:false}));
 }
 return Object.freeze({format:name,blueprintId:blueprint.id,
  originalWindowCount:windows.size,structurallyDeficientWindows:flagged.length,
  sourcePreviewCount:physical.length,originalCulledCorniceSamples:Object.freeze(physical),
  originalPreviewVertexBytes:bytes,previewByteBudget:maxPreviewBytes,
  noOriginalVoxelEdits:true,noNewOccupiedWorldCells:true,
  noOriginalGlassPhysicalOverlap:true,notPack3FullBlockPlacement:true,
  loadBearingAccepted:false,selectionCollisionGameplayAcceptance:false,
  originalGameWebGL2Accepted:false,iphonePwaAccepted:false,
  creaturePassageAcceptance:false,creatorArtApproved:false,worldPlaced:false});
}
