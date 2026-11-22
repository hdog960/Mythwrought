// MYTHWROUGHT Builder D22: two original-Pack2-derived jamb splices IN each
// existing 4B window cell, using original ID62 support-post shape/palette and
// original Pack4 clear/sun/moon glazing visible/selection/collision geometry.
// Nothing writes world voxels or schema-1 saves. This is an ALTERNATIVE to the
// D21 decorative exterior arch, NOT an approved stacked physical combination.
// No extra cells, unsupported neighboring pillars, or altered Pack owners.
const R=Object.freeze({north:0,east:1,south:2,west:3});
const EPS=1e-6,GAP=1/1024;
const K=p=>p.join(',');
const validPoint=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isSafeInteger);
const box=b=>Array.isArray(b)&&b.length===6&&b.every(Number.isFinite)&&
  [0,1,2].every(i=>b[i]>=0&&b[i]<b[i+3]&&b[i+3]<=1);
const overlap=(a,b)=>[0,1,2].every(i=>Math.min(a[i+3],b[i+3])-Math.max(a[i],b[i])>EPS);
const joining=(a,b)=>{const v=[0,1,2].map(i=>Math.min(a[i+3],b[i+3])-Math.max(a[i],b[i]));
 return v.every(n=>n>=-EPS)&&v.filter(n=>n>EPS).length>=2;};
const F=Object.freeze([
 Object.freeze({norm:[-1,0,0],v:[0,4,7,3]}),
 Object.freeze({norm:[1,0,0],v:[1,2,6,5]}),
 Object.freeze({norm:[0,-1,0],v:[0,1,5,4]}),
 Object.freeze({norm:[0,1,0],v:[3,7,6,2]}),
 Object.freeze({norm:[0,0,-1],v:[0,3,2,1]}),
 Object.freeze({norm:[0,0,1],v:[4,5,6,7]})
]);
const eqBoxes=(a,b)=>Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&
  a.every((v,i)=>box(v)&&box(b[i])&&v.every((x,j)=>Math.abs(x-b[i][j])<=1e-7));
const area=(b)=>(b[3]-b[0])*(b[5]-b[2]);
function spliceParts(facing,id,post,window){
 if(!Object.hasOwn(R,facing)||![159,160,161].includes(id)||
    !Array.isArray(post)||post.length!==3||post.some(b=>!box(b))||
    window?.id!==id||window?.rotation!==R[facing]||
    !Array.isArray(window.visible)||!window.visible.length||
    !Array.isArray(window.selection)||!Array.isArray(window.collision))
   throw Error('D22 requires original Pack2 support post and real Pack4 glass source geometry');
 const masks=[...window.visible.map(v=>v.bounds),...window.selection,...window.collision];
 if(masks.some(v=>!box(v)))throw Error('Original Pack4 targeting or glass source box invalid');
 const depth=facing==='north'||facing==='south'?2:0,side=depth===2?0:2;
 const front=facing==='north'||facing==='west';
 const pane=front?Math.min(...masks.map(x=>x[depth])):Math.max(...masks.map(x=>x[depth+3]));
 const limit=pane+(front?-GAP:GAP);
 const groups=[],all=[];
 for(const [sideIndex,shift] of [-.5,.5].entries()){
  const pieces=[];
  for(let sourcePart=0;sourcePart<3;sourcePart++){
   const b=[...post[sourcePart]];
   b[side]=Math.max(0,b[side]+shift);
   b[side+3]=Math.min(1,b[side+3]+shift);
   if(front)b[depth+3]=Math.min(b[depth+3],limit);
   else b[depth]=Math.max(b[depth],limit);
   if([0,1,2].some(i=>b[i+3]-b[i]<=EPS))continue;
   if(masks.some(m=>overlap(m,b)))
    throw Error('Original Pack2 side-post geometry intersects original Pack4 glass/selection');
   pieces.push(Object.freeze({sourcePart,sideIndex,authenticPostSourceBox:Object.freeze([...post[sourcePart]]),
     physicalJambAabb:Object.freeze(b),originalPack2Id62:true,physicalSourceCutOnly:true}));
  }
  if(pieces.length!==3)throw Error('Genuine source Pack2 post fragment was removed by window glass');
  const seen=new Set(),stack=[0];while(stack.length){
   const v=stack.pop();if(seen.has(v))continue;seen.add(v);
   for(let j=0;j<pieces.length;j++)if(!seen.has(j)&&joining(pieces[v].physicalJambAabb,pieces[j].physicalJambAabb))stack.push(j);
  }
  if(seen.size!==3)throw Error('A proposed original side jamb has a disconnected support part');
  const y0=pieces.filter(x=>x.physicalJambAabb[1]<=EPS).reduce((a,x)=>a+area(x.physicalJambAabb),0);
  const y1=pieces.filter(x=>x.physicalJambAabb[4]>=1-EPS).reduce((a,x)=>a+area(x.physicalJambAabb),0);
  if(y0<=.02||y1<=.02)throw Error('Original post cannot make positive masonry sill AND lintel contact');
  groups.push(Object.freeze({sideIndex,sourcePartCount:pieces.length,connectedParts:seen.size,
    originalMasonrySillContactArea:y0,originalUpperBeamContactArea:y1,
    geometryContactsBothOriginalNeighborCellFaces:true}));
  all.push(...pieces);
 }
 // The two independently anchored side columns occupy disjoint side intervals.
 if(all.slice(0,3).some(a=>all.slice(3).some(b=>overlap(a.physicalJambAabb,b.physicalJambAabb))))
  throw Error('Original opposed window support-jamb source columns intersect each other');
 return Object.freeze({originalPostPieces:Object.freeze(all),sideGroups:Object.freeze(groups),
  exteriorClippingAxis:depth,sideJambAxis:side,glassPlane:pane,sourceExteriorLimit:limit,
  totalRealSourceJambTriangles:all.length*12,
  realOriginalPostParts:3,
  originalGlazingId:id,noGlassPositiveVolumeOverlap:true,
  eachSideTouchesOriginalWallAndLintel:true});
}
function postVertexBuffer(at,parts,sourcePalette){
 const tones=[sourcePalette.base,sourcePalette.edge,sourcePalette.grain];
 if(tones.some(t=>!Array.isArray(t)||t.length!==3||t.some(x=>!Number.isFinite(x)||x<0||x>1)))
  throw Error('Original Pack2 ID62 physical material palette invalid');
 const buffer=new Float32Array(parts.length*12*3*10);let i=0;
 for(const p of parts){
  const [x,y,z,X,Y,Z]=p.physicalJambAabb;
  const corners=[[x,y,z],[X,y,z],[X,Y,z],[x,Y,z],[x,y,Z],[X,y,Z],[X,Y,Z],[x,Y,Z]];
  for(const face of F){
   const [a,b,c,d]=face.v;
   for(const index of [a,b,c,a,c,d]){
    for(let k=0;k<3;k++)buffer[i++]=corners[index][k]+at[k];
    for(const n of face.norm)buffer[i++]=n;
    for(const v of tones[p.sourcePart])buffer[i++]=v;
    buffer[i++]=1;
   }
  }
 }
 if(i!==buffer.length)throw Error('Original Pack2 ID62 jamb composite vertex count drift');
 return buffer;
}
function pack4World(at,source){
 if(!(source instanceof Float32Array)||source.length%30!==0||source.length>320*30)
  throw Error('Original Pack4 source triangles invalid or excessive');
 const v=new Float32Array(source);
 for(let i=0;i<v.length;i+=10){
  for(let k=0;k<3;k++){
   if(!Number.isFinite(source[i+k])||source[i+k]<-EPS||source[i+k]>1+EPS)
    throw Error('Original Pack4 source vertex out of cell');
   v[i+k]=source[i+k]+at[k];
  }
  const n=Math.hypot(source[i+3],source[i+4],source[i+5]);
  if(!Number.isFinite(n)||Math.abs(n-1)>.001)throw Error('Original Pack4 source normal invalid');
  for(let k=6;k<10;k++)if(!Number.isFinite(source[i+k])||source[i+k]<0||source[i+k]>1)
   throw Error('Original Pack4 RGBA material invalid');
 }
 return v;
}
export function planD22OriginalInCellWindowJambs(blueprint,exclusiveGlass,{
 originalPack2PostDefinition,originalPack2PostShape,resolvePack4WindowShape,
 resolvePack4Asset,maxMeshSamples=6,maxMeshBytes=192*1024
}={}){
 if(!blueprint||blueprint.creatorApproved!==false||blueprint.worldPlaced!==false||
    blueprint.integrated!==false||!Array.isArray(blueprint.cells)||!Array.isArray(blueprint.openings)||
    !exclusiveGlass||exclusiveGlass.blueprintId!==blueprint.id||
    exclusiveGlass.glazingMutuallyExclusive!==true||
    exclusiveGlass.noSameCellWindowLayering!==true||
    !Array.isArray(exclusiveGlass.plannedOriginalWindowChoices))
   throw Error('D22 must consume an original unapproved 4B source with exclusive Pack4 window plan');
 if(typeof originalPack2PostDefinition!=='function'||typeof originalPack2PostShape!=='function'||
    typeof resolvePack4WindowShape!=='function'||typeof resolvePack4Asset!=='function')
   throw TypeError('Exact original Pack2 and Pack4 source owner resolvers required');
 if(!Number.isSafeInteger(maxMeshSamples)||maxMeshSamples<1||maxMeshSamples>6||
    !Number.isSafeInteger(maxMeshBytes)||maxMeshBytes<8192||maxMeshBytes>192*1024)
   throw RangeError('D22 bounded iPhone CPU preview budget invalid');
 const post=originalPack2PostDefinition(62),shape=originalPack2PostShape(62,0);
 if(!post||post.id!==62||post.roster!==22||post.family!=='wooden-support-posts'||
    !shape||shape.id!==62||!eqBoxes(shape.boxes,post.boxes))
   throw Error('Original Pack2 ID62 support post material or source physical shape changed');
 const cell=new Map();
 for(const c of blueprint.cells){
  if(!validPoint(c.at)||cell.has(K(c.at)))throw Error('Original W16/W17 source has invalid/duplicate voxel');
  cell.set(K(c.at),c);
 }
 const openings=new Map(blueprint.openings.filter(o=>o.kind==='window').map(o=>[K(o.at),o]));
 if(openings.size!==exclusiveGlass.plannedOriginalWindowChoices.length)
   throw Error('Original 4B authoring and exclusive Pack4 window census mismatch');
 const pending=[],all=[];let rawGlass=0;
 for(const choice of exclusiveGlass.plannedOriginalWindowChoices){
  if(!validPoint(choice.at)||!Object.hasOwn(R,choice.authoritativeFacadeFacing)||
     choice.neverOverlayOriginalGlass!==true||choice.originalCellRetained!==true||
     ![159,160,161].includes(choice.candidateId)||
     choice.candidateRef!==(choice.candidateId===159?'pack4:030':'pack4:031'))
   throw Error('D22 received unowned original-glazing physical source choice');
  const o=openings.get(K(choice.at)),source=cell.get(K(choice.at));
  if(!o||!source||source.asset!=='pack4:030'||source.role!=='window'||
     o.facing!==choice.authoritativeFacadeFacing)
   throw Error('D22 cannot replace nonexistent original source window voxel');
  rawGlass++;
  if(choice.structuralJambCount===2)continue;
  if(choice.structuralJambCount!==1&&choice.structuralJambCount!==0)
   throw Error('D22 has invalid source original jamb count');
  const [x,y,z]=choice.at,lower=cell.get(K([x,y-1,z])),upper=cell.get(K([x,y+1,z]));
  if(y!==3||lower?.role!=='wall'||upper?.role!=='beam'||
     choice.sourceWindowRequiresRemediation!==true)
   throw Error('D22 original window lacks authored wall sill or upper lintel');
  const gl=resolvePack4WindowShape(choice.candidateId,R[choice.authoritativeFacadeFacing]);
  const asset=resolvePack4Asset(choice.candidateRef,{
   candidateId:choice.candidateId,rotation:choice.authoritativeFacadeFacing});
  if(!asset||asset.id!==choice.candidateId||asset.ref!==choice.candidateRef||
     asset.rotation!==R[choice.authoritativeFacadeFacing]||
     asset.registeredInLiveGame!==false||asset.hasRealPhysicalGeometry!==true||
     asset.previewMesh?.stride!==10||
     !(asset.previewMesh.opaque instanceof Float32Array)||
     !(asset.previewMesh.translucent instanceof Float32Array)||
     gl?.id!==asset.id||gl?.rotation!==asset.rotation||
     !eqBoxes(gl.visible?.map(v=>v.bounds),asset.visible?.map(v=>v.bounds))||
     !eqBoxes(gl.selection,asset.selection)||!eqBoxes(gl.collision,asset.collision))
   throw Error('Original Pack4 shape and physical builder source disagree');
  const physical=spliceParts(choice.authoritativeFacadeFacing,choice.candidateId,shape.boxes,gl);
  const item=Object.freeze({at:Object.freeze([...choice.at]),facing:choice.authoritativeFacadeFacing,
   originalWindowAsset:'pack4:030',candidateGlazingId:choice.candidateId,
   candidateGlazingRef:choice.candidateRef,originalSourceJambCount:choice.structuralJambCount,
   originalPack2PostId:62,originalPostSourceParts:3,sideSplices:physical.sideGroups,
   sourceParts:physical.originalPostPieces,sourceActualJambTriangles:physical.totalRealSourceJambTriangles,
   noGlassPositiveVolumeOverlap:true,originalWallSillAndLintelCellBoundaryContact:true,
   candidateReplacesNotLayersOriginalGlazing:true,notTheD21DecorativeArch:true,
   sourceWorldVoxelUnchanged:true,realStructureLoadTestUnexecuted:true,
   liveNavigationColliderUnaccepted:true,interiorVisualQualityUnaccepted:true,
   addedWorldCellCount:0,worldPlaced:false});
  pending.push(item);
  if(pending.length<=maxMeshSamples){
   const genuineGlassTris=(asset.previewMesh.opaque.length+asset.previewMesh.translucent.length)/30;
   const total=physical.totalRealSourceJambTriangles+genuineGlassTris;
   if(!Number.isSafeInteger(total)||total>320)throw Error('D22 original Pack2/4 composite triangle budget exceeded');
   const bytes=total*3*10*4;
   all.push({item,asset,previewBytes:bytes,totalTriangles:total});
  }
 }
 if(rawGlass!==openings.size||!pending.length)
   throw Error('D22 original source windows absent or no weak jambs found');
 let byteCount=0;const meshSamples=[];
 for(const it of all){
  byteCount+=it.previewBytes;
  if(byteCount>maxMeshBytes)throw Error('D22 original Pack2/4 combined material sample memory exceeded');
  const truePost=postVertexBuffer(it.item.at,it.item.sourceParts,post.palette);
  const trueGlassOpaque=pack4World(it.item.at,it.asset.previewMesh.opaque);
  const trueGlassTranslucent=pack4World(it.item.at,it.asset.previewMesh.translucent);
  if(truePost.byteLength+trueGlassOpaque.byteLength+trueGlassTranslucent.byteLength!==it.previewBytes)
   throw Error('Original authored Pack2/4 jamb mesh byte count mismatch');
  meshSamples.push(Object.freeze({originalAt:it.item.at,originalPack2OpaqueWorldVertices:truePost,
   originalPack4OpaqueWorldVertices:trueGlassOpaque,
   originalPack4TranslucentWorldVertices:trueGlassTranslucent,
   originalSourceTriangleCount:it.totalTriangles,originalSourceVertexBytes:it.previewBytes,
   actualOriginalPostSourcePalette:true,
   originalPack4WindowMeshPreserved:true,noNewWorldCell:true,
   realWorldWebGL2Accepted:false,realPhysicsColliderAccepted:false}));
 }
 return Object.freeze({format:'mythwrought.builder-d.d22.source-derived-window-jamb-cell.v1',
  blueprintId:blueprint.id,originalWindows:rawGlass,
  originalWeakSideJambs:pending.length,
  sourceDerivedJambCandidates:Object.freeze(pending),
  originalPhysicalMeshSamples:Object.freeze(meshSamples),
  sourceMeshSampleCount:meshSamples.length,sourceMeshCpuBytes:byteCount,
  perBuildingCpuByteBudget:maxMeshBytes,
  originalSourceId62ShapeIntact:true,originalGlassPreserved:true,
  sourceGeometricWallAndLintelContact:true,zeroOriginal4BCellOverwrites:true,
  noAdjacentNavigationCellEntered:true,
  alternativeToOriginalD21ExteriorArch:true,
  fullStructuralLoadAcceptance:false,
  originalGameCollisionAndTargetingAcceptance:false,
  originalGameWebGL2Acceptance:false,iphonePwaAcceptance:false,
  newLiveBlocksRegistered:false,originalWorldSaved:false,worldPlaced:false});
}
