// MYTHWROUGHT Builder D23: keep the original 1040 structurally side-framed
// windows decorative without ever stacking D21's arch onto D22's Pack2 jambs.
// Reuses unchanged genuine original Pack3 ID121 + Pack4 physical source producer.
// The other 193 original windows remain EXCLUSIVELY D22 paired post candidates.
// Pure unregistered source preview, no live placements/saves or unapproved merges.
import {buildD21OriginalExteriorArchSourceAt} from './d21-original-grounded-exterior-arch-shell.mjs';
const K=p=>p.join(',');
const R=Object.freeze({north:0,east:1,south:2,west:3});
const valid=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isSafeInteger);
const originalWall=c=>c?.role==='wall'&&c.asset==='live:stone';
const faceContacts=(parts,axis,min)=>parts.filter(p=>{
 const b=p.sourceBox,coord=b[axis+(min?0:3)];
 return Math.abs(coord-(min?0:1))<=1e-6&&
   b[1]<b[4]&&b[axis===0?2:0]<b[axis===0?5:3];
}).length;
export function planD23ExteriorArchesOnlyOnOriginalFullJambWindows(blueprint,exclusive,{
 resolvePack3Ornamental,resolvePack4WindowShape,resolvePack4Asset,
 maxSamples=6,maxCpuBytes=256*1024
}={}){
 if(!blueprint||blueprint.worldPlaced!==false||blueprint.integrated!==false||
    blueprint.creatorApproved!==false||!Array.isArray(blueprint.cells)||
    !Array.isArray(blueprint.openings)||
    !exclusive||exclusive.blueprintId!==blueprint.id||
    exclusive.glazingMutuallyExclusive!==true||
    !Array.isArray(exclusive.plannedOriginalWindowChoices))
   throw Error('D23 original framed-window source and exclusive glazing required');
 if(typeof resolvePack3Ornamental!=='function'||typeof resolvePack4WindowShape!=='function'||
    typeof resolvePack4Asset!=='function')throw TypeError('D23 genuine Pack3/4 producers required');
 if(!Number.isSafeInteger(maxSamples)||maxSamples<1||maxSamples>6||
    !Number.isSafeInteger(maxCpuBytes)||maxCpuBytes<8192||maxCpuBytes>256*1024)
   throw RangeError('D23 bounded original exterior sample CPU policy exceeded');
 const cells=new Map();
 for(const c of blueprint.cells){if(!valid(c.at)||cells.has(K(c.at)))
   throw Error('D23 duplicate or invalid original source cell');cells.set(K(c.at),c)}
 const openings=new Map(blueprint.openings.filter(o=>o.kind==='window').map(o=>[K(o.at),o]));
 if(openings.size!==exclusive.plannedOriginalWindowChoices.length)
   throw Error('D23 original auth-window count inconsistent with source choices');
 const framed=[],weak=[];
 for(const c of exclusive.plannedOriginalWindowChoices){
  if(!valid(c.at)||!Object.hasOwn(R,c.authoritativeFacadeFacing)||
     ![159,160,161].includes(c.candidateId)||
     c.candidateRef!==(c.candidateId===159?'pack4:030':'pack4:031')||
     c.originalCellRetained!==true||c.neverOverlayOriginalGlass!==true)
   throw Error('D23 source glazing is not original mutually exclusive Pack4');
  const o=openings.get(K(c.at)),src=cells.get(K(c.at));
  if(!o||!src||src.role!=='window'||src.asset!=='pack4:030'||
     o.facing!==c.authoritativeFacadeFacing)throw Error('D23 original facade material differs from source');
  const [x,y,z]=c.at,between=c.authoritativeFacadeFacing;
  const offsets=between==='north'||between==='south'?[[1,0],[-1,0]]:[[0,1],[0,-1]];
  const sides=offsets.map(([dx,dz])=>[
    cells.get(K([x+dx,y,z+dz])),cells.get(K([x+dx,y-1,z+dz]))
  ]);
  const originalSideCount=sides.filter(pair=>originalWall(pair[0])).length;
  if(originalSideCount!==c.structuralJambCount)
   throw Error('D23 genuine source side-jamb census mismatch');
  if(c.structuralJambCount<2){weak.push(c);continue}
  if(c.structuralJambCount!==2||
     sides.some(pair=>!originalWall(pair[0])||!originalWall(pair[1]))||
     !originalWall(cells.get(K([x,y-1,z])))||
     cells.get(K([x,y+1,z]))?.role!=='beam'||
     cells.get(K([x,y+1,z]))?.asset!=='live:wood')
   throw Error('D23 original full masonry and lintel support not proven');
  framed.push(c);
 }
 if(framed.length<6||weak.length<1)throw Error('D23 framed-versus-weak policy has no actual original sources');
 const previews=[];let bytes=0;const count=Math.min(framed.length,maxSamples);
 for(let i=0;i<count;i++){
  const c=framed[Math.floor(i*framed.length/count)];
  const geometry=buildD21OriginalExteriorArchSourceAt(c,{
   resolvePack3Ornamental,resolvePack4WindowShape,resolvePack4Asset});
  if(geometry.at.some((v,k)=>v!==c.at[k])||geometry.originalGlazingId!==c.candidateId||
     geometry.sourceConnectedParts!==13||geometry.originalSillContactParts<2||
     !geometry.originalGlassNoIntersection||geometry.composedTriangles>320)
    throw Error('D23 authentic framed-window sculpture failed actual original Pack3/4 source');
  // Its original ID121 stone physically contacts BOTH adjacent original
  // stone jamb cells at their shared x/z cell face, not only the floor below.
  const axis=(c.authoritativeFacadeFacing==='north'||c.authoritativeFacadeFacing==='south')?0:2;
  const left=faceContacts(geometry.sourceShapeParts,axis,true);
  const right=faceContacts(geometry.sourceShapeParts,axis,false);
  if(left<1||right<1)throw Error('D23 original full-side masonry cannot touch actual decorative original Pack3 arch');
  bytes+=geometry.worldSourceVertexBytes;
  if(bytes>maxCpuBytes)throw Error('D23 original exterior framed preview memory budget exceeded');
  previews.push(Object.freeze({at:Object.freeze([...c.at]),facing:c.authoritativeFacadeFacing,
   originalGlazingId:c.candidateId,trueOriginalStoneSideJambCount:2,
   realOriginalStoneFaceContactCountLeft:left,realOriginalStoneFaceContactCountRight:right,
   sourceDecorativeGeometry:geometry,
   decorativeArchDerivedFromOriginalPack3Id121:true,
   onlyOriginalPack4GlassPresent:true,proposedPack2D22JambNotAtThisSite:true,
   originalSourceCellsUnchanged:true,
   mechanicalLoadAcceptance:false,actualWebGL2Accepted:false,
   sourceOriginalNavigationUnchanged:true,worldPlaced:false}));
 }
 return Object.freeze({format:'mythwrought.builder-d.d23.original-framed-window-decoration-only.v1',
  blueprintId:blueprint.id,allAuthoredOriginalWindows:openings.size,
  alreadyFramedOriginalWindowCount:framed.length,
  physicallyDeficientWindowsHeldForExclusivePack2Jamb:weak.length,
  originalFramedWindowSourceChoices:Object.freeze(framed.map(c=>Object.freeze({
   at:Object.freeze([...c.at]),facing:c.authoritativeFacadeFacing,
   exclusivePack4GlazingId:c.candidateId,
   sourceExistingTwoSideMasonryAtY3:true,
   sourceExistingTwoSideMasonryBelowY3:true,
   originalSourceUnmodified:true,decorativeNotLive:true
  }))),
  actualSourceDecorativeSamples:Object.freeze(previews),
  sourcePreviewCount:previews.length,sourcePreviewBytes:bytes,
  noWeakJambSiteDecorativePreview:true,
  noPack2SourceJambAndPack3ArchOverlay:true,
  originalPack3AndPack4Preserved:true,
  originalGamePhysicsAndPickingUnaccepted:true,
  originalGameWebGL2Unaccepted:true,
  iphoneHomeScreenPwaUnaccepted:true,
  newWorldCellsAdded:0,worldPlaced:false,saveWritten:false});
}
