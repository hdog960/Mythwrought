// MYTHWROUGHT Builder D21: original-source anchored exterior arch GLASS COMPOSITE.
// Read-only isolated preview, NOT a live block, placement or settlement generator.
// Original Pack3 ID121 authored arch is sliced ONLY in depth to the exterior of
// the original Pack4 159/160/161 physical glass. There are no fake cube proxies.
// This is a DERIVED composed visual, not unmodified Pack3 ID121 registration.
const FOUR=Object.freeze({north:0,east:1,south:2,west:3});
const E=1e-6,GAP=1/1024,MAX_TRI=320,STRIDE=10;
const K=a=>a.join(',');
const xyz=a=>Array.isArray(a)&&a.length===3&&a.every(Number.isSafeInteger);
const b6=b=>Array.isArray(b)&&b.length===6&&b.every(Number.isFinite)&&
 [0,1,2].every(i=>b[i]>=0&&b[i]<b[i+3]&&b[i+3]<=1);
const cross=(a,b)=>[0,1,2].every(i=>Math.min(a[i+3],b[i+3])-Math.max(a[i],b[i])>E);
const connected=(a,b)=>{const v=[0,1,2].map(i=>Math.min(a[i+3],b[i+3])-Math.max(a[i],b[i]));
 return v.every(x=>x>=-E)&&v.filter(x=>x>E).length>=2};
const BOX=Object.freeze([
 Object.freeze({axis:0,max:false,normal:[-1,0,0],corners:[0,4,7,3]}),
 Object.freeze({axis:0,max:true,normal:[1,0,0],corners:[1,2,6,5]}),
 Object.freeze({axis:1,max:false,normal:[0,-1,0],corners:[0,1,5,4]}),
 Object.freeze({axis:1,max:true,normal:[0,1,0],corners:[3,7,6,2]}),
 Object.freeze({axis:2,max:false,normal:[0,0,-1],corners:[0,3,2,1]}),
 Object.freeze({axis:2,max:true,normal:[0,0,1],corners:[4,5,6,7]})
]);
function shapeEqual(a,b){
 return Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&
 a.every((box,i)=>b6(box)&&b6(b[i])&&box.every((v,j)=>Math.abs(v-b[i][j])<=1e-7));
}
function exteriorSlice(arch,glass,facet){
 if(!arch||arch.id!==121||arch.parts?.length!==13||
   !shapeEqual(arch.parts.map(x=>x.box),arch.boxes)||!arch.colors)
   throw Error('Original Pack3 ID121 arch source part geometry changed');
 if(!glass||!Array.isArray(glass.visible)||!Array.isArray(glass.collision)||
   !Array.isArray(glass.selection))throw Error('Original Pack4 glass physical source absent');
 const masks=[...glass.visible.map(x=>x.bounds),...glass.collision,...glass.selection];
 if(!masks.length||masks.some(x=>!b6(x)))throw Error('Original Pack4 physical glass masks invalid');
 const axis=facet==='north'||facet==='south'?2:0;
 const towardMin=facet==='north'||facet==='west';
 const pane=towardMin?Math.min(...masks.map(x=>x[axis])):
   Math.max(...masks.map(x=>x[axis+3]));
 // The extra 1/1024 physical gap avoids original glass coplanar z-fighting.
 const edge=pane+(towardMin?-GAP:GAP);
 const parts=[];
 for(let i=0;i<arch.parts.length;i++){
  const src=arch.parts[i],clip=[...src.box];
  if(towardMin)clip[axis+3]=Math.min(clip[axis+3],edge);
  else clip[axis]=Math.max(clip[axis],edge);
  if(clip[axis+3]-clip[axis]<=E)continue;
  const tone=src.tone,hex=arch.colors[tone];
  if(typeof hex!=='string'||!/^#[a-fA-F0-9]{6}$/.test(hex)||!b6(clip))
   throw Error('Original Pack3 source colors or composed physical AABB invalid');
  if(masks.some(q=>cross(clip,q)))
   throw Error('Original front-facing Pack3 shell still intersects Pack4 glass');
  parts.push(Object.freeze({index:i,originalBox:Object.freeze([...src.box]),
   sourceBox:Object.freeze(clip),tone,color:hex,originalPack3Id121:true}));
 }
 if(parts.length!==13)throw Error('Original arch exterior clipping lost authored sculpture');
 const seen=new Set(),stack=[0];while(stack.length){
  const i=stack.pop();if(seen.has(i))continue;seen.add(i);
  for(let j=0;j<parts.length;j++)if(!seen.has(j)&&connected(parts[i].sourceBox,parts[j].sourceBox))stack.push(j);
 }
 if(seen.size!==parts.length)throw Error('Original exterior arch shell has unsupported disconnected parts');
 const anchors=parts.filter(x=>x.sourceBox[1]<=E);
 const groundedArea=anchors.reduce((n,p)=>n+
  (p.sourceBox[3]-p.sourceBox[0])*(p.sourceBox[5]-p.sourceBox[2]),0);
 if(anchors.length<2||groundedArea<=E)
   throw Error('Original exterior window frame has no positive-area masonry sill contact');
 return Object.freeze({parts:Object.freeze(parts),sourceMaskCount:masks.length,
  authoritativeOriginalExterior:facet,glassDepthPlane:pane,frontClipPlane:edge,
  connectedAuthoredSourceParts:seen.size,wallSillContactParts:anchors.length,
  masonryWallContactArea:groundedArea});
}
function faceHidden(parts,i,face){
 const a=parts[i].sourceBox,axis=face.axis,v=a[axis+(face.max?3:0)];
 const side=[0,1,2].filter(j=>j!==axis);
 return parts.some((other,j)=>{
  if(i===j)return false;
  const b=other.sourceBox;
  if(!(face.max?b[axis]<=v+E&&b[axis+3]>v+E:b[axis]<v-E&&b[axis+3]>=v-E))return false;
  return side.every(k=>b[k]<=a[k]+E&&b[k+3]>=a[k+3]-E);
 });
}
function countFaces(parts){
 let hidden=0;const keep=[];
 for(let i=0;i<parts.length;i++)for(const f of BOX){
  if(faceHidden(parts,i,f)){hidden++;continue}
  keep.push({part:i,face:f});
 }
 if(hidden<2||keep.length>13*6-2)
  throw Error('Original Pack3 arch material has no certifiable fully hidden bracket faces');
 return Object.freeze({keep:Object.freeze(keep),hidden,triangles:keep.length*2});
}
const corners=b=>{const [x,y,z,X,Y,Z]=b;
 return [[x,y,z],[X,y,z],[X,Y,z],[x,Y,z],[x,y,Z],[X,y,Z],[X,Y,Z],[x,Y,Z]]};
const rgba=h=>[parseInt(h.slice(1,3),16)/255,parseInt(h.slice(3,5),16)/255,
 parseInt(h.slice(5,7),16)/255,1];
function worldArchVertices(at,parts,faces){
 const buf=new Float32Array(faces.keep.length*6*STRIDE);let cursor=0;
 for(const item of faces.keep){
  const p=parts[item.part],verts=corners(p.sourceBox),f=item.face,[a,b,c,d]=f.corners;
  const col=rgba(p.color);
  for(const k of [a,b,c,a,c,d]){
   const v=verts[k];
   for(let j=0;j<3;j++)buf[cursor++]=v[j]+at[j];
   for(const n of f.normal)buf[cursor++]=n;
   for(const x of col)buf[cursor++]=x;
  }
 }
 if(cursor!==buf.length)throw Error('Original Pack3 source face mesh stride mismatch');
 return buf;
}
function translatePack4(at,group){
 if(!(group instanceof Float32Array)||group.length%30!==0||group.length>MAX_TRI*30)
  throw Error('Original Pack4 source mesh malformed or unbounded');
 const buf=new Float32Array(group);
 for(let i=0;i<group.length;i+=STRIDE){
  for(let j=0;j<3;j++){
   if(!Number.isFinite(group[i+j])||group[i+j]<-E||group[i+j]>1+E)
    throw Error('Original Pack4 glazing physical vertex outside source cell');
   buf[i+j]=group[i+j]+at[j];
  }
  const n=Math.hypot(...group.subarray(i+3,i+6));
  if(!Number.isFinite(n)||Math.abs(n-1)>0.001)
   throw Error('Original Pack4 glazing normal invalid');
  for(let j=6;j<10;j++)if(!Number.isFinite(group[i+j])||group[i+j]<0||group[i+j]>1)
   throw Error('Original Pack4 physical RGBA invalid');
 }
 return buf;
}
export function buildD21OriginalExteriorArchSourceAt(choice,resolvers){
 const facet=choice.authoritativeFacadeFacing,rotation=FOUR[facet];
 const sourceArch=resolvers.resolvePack3Ornamental(121,rotation);
 const physicalGlass=resolvers.resolvePack4WindowShape(choice.candidateId,rotation);
 const actual=resolvers.resolvePack4Asset(choice.candidateRef,
  {candidateId:choice.candidateId,rotation:facet});
 if(!actual||actual.ref!==choice.candidateRef||actual.id!==choice.candidateId||
    actual.rotation!==rotation||actual.hasRealPhysicalGeometry!==true||
    actual.registeredInLiveGame!==false||actual.previewMesh?.stride!==10||
    !(actual.previewMesh.opaque instanceof Float32Array)||
    !(actual.previewMesh.translucent instanceof Float32Array)||
    !physicalGlass||physicalGlass.id!==actual.id||physicalGlass.rotation!==rotation||
    !shapeEqual(physicalGlass.visible?.map(x=>x.bounds),actual.visible?.map(x=>x.bounds))||
    !shapeEqual(physicalGlass.selection,actual.selection)||
    !shapeEqual(physicalGlass.collision,actual.collision))
  throw Error('Original Pack4 physical geometry and independent asset resolver disagree');
 const shell=exteriorSlice(sourceArch,physicalGlass,facet),faces=countFaces(shell.parts);
 const glassTri=(actual.previewMesh.opaque.length+actual.previewMesh.translucent.length)/30;
 if(!Number.isSafeInteger(glassTri)||glassTri<=0||glassTri>MAX_TRI)
  throw Error('Original Pack4 window physical triangle census invalid');
 const total=glassTri+faces.triangles;
 if(total>MAX_TRI)throw Error('Original window/shell exceeded bounded 320 triangle envelope');
 const bytes=total*30*4;
 const arch=worldArchVertices(choice.at,shell.parts,faces);
 const opaque=translatePack4(choice.at,actual.previewMesh.opaque);
 const translucent=translatePack4(choice.at,actual.previewMesh.translucent);
 if(arch.byteLength+opaque.byteLength+translucent.byteLength!==bytes)
  throw Error('Original composed window typed mesh byte census invalid');
 return Object.freeze({at:Object.freeze([...choice.at]),facing:facet,originalGlazingId:actual.id,
  originalPack3SourceId:121,originalSourcePartCount:13,groundedArchParts:shell.parts.length,
  sourceShapeParts:shell.parts,sourceMaskCount:shell.sourceMaskCount,
  trueGroundedSillContactArea:shell.masonryWallContactArea,
  originalSillContactParts:shell.wallSillContactParts,
  sourceConnectedParts:shell.connectedAuthoredSourceParts,
  sourceHiddenFaceCount:faces.hidden,originalArchTriangles:faces.triangles,
  originalGlassTriangles:glassTri,composedTriangles:total,
  originalWorldArchOpaque:arch,originalWorldGlassOpaque:opaque,
  originalWorldGlassTranslucent:translucent,
  worldSourceVertexBytes:bytes,sourcePack3ColorsPreserved:true,
  originalPack4RGBAUnchanged:true,originalPhysicalSourceAuthored:true,
  originalGlassNoIntersection:true,exteriorFrontOnly:true,
  positiveAreaOriginalWallSillContact:true,
  originalWindowSourceUnmodified:true,
  derivedNonRegisteredVisual:true,notUnmodifiedPack3Block:true,
  noRoofLoadClaim:true,worldCollisionAndSelectionUnaccepted:true,
  transparentDepthOrderUnaccepted:true,iphoneRenderingUnaccepted:true,
  worldPlaced:false});
}
export function planD21GroundedExteriorWindowArches(blueprint,originalGlazingPlan,{
 resolvePack3Ornamental,resolvePack4WindowShape,resolvePack4Asset,
 maxSites=6,maxPreviewBytes=256*1024
}={}){
 if(!blueprint||blueprint.worldPlaced!==false||blueprint.creatorApproved!==false||
    blueprint.integrated!==false||!Array.isArray(blueprint.cells)||!Array.isArray(blueprint.openings))
   throw Error('Original 4B source-only unregistered blueprint required');
 if(!originalGlazingPlan||originalGlazingPlan.blueprintId!==blueprint.id||
    originalGlazingPlan.glazingMutuallyExclusive!==true||
    originalGlazingPlan.noSameCellWindowLayering!==true||
    !Array.isArray(originalGlazingPlan.plannedOriginalWindowChoices))
   throw Error('Original D19 mutually exclusive Pack4 glazing source required');
 if(typeof resolvePack3Ornamental!=='function'||typeof resolvePack4WindowShape!=='function'||
    typeof resolvePack4Asset!=='function')
   throw TypeError('Genuine Pack3/4 original physical source resolvers required');
 if(!Number.isSafeInteger(maxSites)||maxSites<1||maxSites>6||
    !Number.isSafeInteger(maxPreviewBytes)||maxPreviewBytes<8192||maxPreviewBytes>256*1024)
   throw RangeError('D21 exterior-arch bounded iPhone preview budget violation');
 const cells=new Map();
 for(const c of blueprint.cells){
  if(!xyz(c.at)||cells.has(K(c.at)))throw Error('Duplicate/invalid original 4B source voxels');
  cells.set(K(c.at),c);
 }
 const originalWindows=new Map(blueprint.openings.filter(o=>o.kind==='window').map(o=>[K(o.at),o]));
 if(originalWindows.size!==originalGlazingPlan.plannedOriginalWindowChoices.length)
   throw Error('D19 original-glazing inventory disagrees with true source windows');
 const bad=[];
 for(const v of originalGlazingPlan.plannedOriginalWindowChoices){
  const source=cells.get(K(v.at)),opening=originalWindows.get(K(v.at));
  if(!source||!opening||source.role!=='window'||source.asset!=='pack4:030'||
     opening.facing!==v.authoritativeFacadeFacing||!Object.hasOwn(FOUR,v.authoritativeFacadeFacing)||
     ![159,160,161].includes(v.candidateId)||v.candidateRef!==(v.candidateId===159?'pack4:030':'pack4:031')||
     v.originalCellRetained!==true||v.neverOverlayOriginalGlass!==true)
    throw Error('D21 refuses non-original, altered or multilayered Pack4 source glazing');
  if(v.structuralJambCount<2){
   const [x,y,z]=v.at;
   if(y!==3||cells.get(K([x,y-1,z]))?.role!=='wall'||
      cells.get(K([x,y+1,z]))?.role!=='beam'||
      v.sourceWindowRequiresRemediation!==true)
    throw Error('Original window has no structural masonry wall below its exterior arch');
   bad.push(v);
  }
 }
 if(!bad.length)throw Error('No genuine structurally deficient original window sites');
 const samples=[],count=Math.min(bad.length,maxSites);let bytes=0;
 for(let i=0;i<count;i++){
  const c=bad[Math.floor(i*bad.length/count)];
  const mesh=buildD21OriginalExteriorArchSourceAt(c,{resolvePack3Ornamental,resolvePack4WindowShape,resolvePack4Asset});
  bytes+=mesh.worldSourceVertexBytes;
  if(bytes>maxPreviewBytes)throw Error('D21 original exterior arch iPhone sample memory cap exceeded');
  samples.push(mesh);
 }
 return Object.freeze({format:'mythwrought.builder-d.d21.grounded-source-exterior-arch.v1',
  blueprintId:blueprint.id,originalWindows:originalWindows.size,
  originalWindowsNeedingJambRemediation:bad.length,
  supportedExteriorDecorativeSamples:Object.freeze(samples),sampleCount:samples.length,
  sourcePreviewByteCount:bytes,perBuildingByteCap:maxPreviewBytes,
  originalWallSillContactVerifiedOnSampledSite:true,
  fullHistoricWindowRemediation:false,
  sourceTrussRoofBearingUnchanged:true,
  noOriginalSourceVoxelsEdited:true,noPack2Or3Or4SourceOwnerEdits:true,
  noWorldOccupiedCellAdded:true,creatorApproval:false,
  actualStructuralJambAcceptance:false,originalGameWebGL2Acceptance:false,
  iPhoneHomeScreenPwaAcceptance:false,worldPlaced:false,saveWritten:false
 });
}
