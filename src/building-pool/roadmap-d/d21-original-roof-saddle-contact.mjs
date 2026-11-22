// MYTHWROUGHT Builder D21: original Pack2 ID61 beam + ID62 post connector.
// SOURCE ONLY, no full-world or renderer integration. The original ID61 beam
// ends ~.2 cells BELOW the proposed Pack3 roof underlay. This opt-in combined
// preview subtracts the original beam's occupied shape from a Pack2 ID62
// vertical post to create a non-overlapping source-derived roof-bearing sleeve.
// ID62 source geometry/colors and original Pack3 ID109–112 underlay are used;
// this is NOT a new registered block and never overwrites source building AIR.
const EPS=1e-6,MAX_TRI=320,STRIDE=10;
const K=p=>p.join(',');
const point=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isSafeInteger);
const valid=b=>Array.isArray(b)&&b.length===6&&b.every(Number.isFinite)&&
 [0,1,2].every(i=>b[i]>=0&&b[i]<b[i+3]&&b[i+3]<=1);
const vol=b=>(b[3]-b[0])*(b[4]-b[1])*(b[5]-b[2]);
function positive(a,b){return [0,1,2].every(i=>Math.min(a[i+3],b[i+3])-Math.max(a[i],b[i])>EPS)}
function connected(a,b){const d=[0,1,2].map(i=>Math.min(a[i+3],b[i+3])-Math.max(a[i],b[i]));
 return d.every(x=>x>=-EPS)&&d.filter(x=>x>EPS).length>=2}
function cutBox(box,blade){
 if(!positive(box,blade))return [box];
 const I=[0,1,2].map(i=>[Math.max(box[i],blade[i]),Math.min(box[i+3],blade[i+3])]);
 const c=[...box],pieces=[];
 const add=q=>{if(q.every(Number.isFinite)&&[0,1,2].every(i=>q[i+3]-q[i]>EPS))pieces.push(q)};
 for(const axis of [0,1,2]){
  if(c[axis]<I[axis][0]-EPS){
   const q=[...c];q[axis+3]=I[axis][0];add(q);c[axis]=I[axis][0];
  }
  if(c[axis+3]>I[axis][1]+EPS){
   const q=[...c];q[axis]=I[axis][1];add(q);c[axis+3]=I[axis][1];
  }
 }
 return pieces;
}
const FACE=Object.freeze([
 Object.freeze({normal:[-1,0,0],verts:[0,4,7,3]}),
 Object.freeze({normal:[1,0,0],verts:[1,2,6,5]}),
 Object.freeze({normal:[0,-1,0],verts:[0,1,5,4]}),
 Object.freeze({normal:[0,1,0],verts:[3,7,6,2]}),
 Object.freeze({normal:[0,0,-1],verts:[0,3,2,1]}),
 Object.freeze({normal:[0,0,1],verts:[4,5,6,7]})
]);
function makeSleeve(shape,post,roof){
 if(!Array.isArray(shape)||shape.length!==3||shape.some(x=>!valid(x))||
    !Array.isArray(post)||post.length!==3||post.some(x=>!valid(x))||
    !Array.isArray(roof)||!roof.length||roof.some(x=>!valid(x)))
    throw Error('Original Pack2/Pack3 source shapes not exact authored physical unions');
 const cut=[];
 for(let i=0;i<post.length;i++){
  let pieces=[[...post[i]]];
  for(const beam of shape)pieces=pieces.flatMap(p=>cutBox(p,beam));
  for(const p of pieces)cut.push(Object.freeze({originalSourcePostPart:i,
   sourceOriginalPostBox:Object.freeze([...post[i]]),
   composedBox:Object.freeze(p),volume:vol(p)}));
 }
 if(cut.length<3||cut.length>15||cut.some(p=>shape.some(b=>positive(p.composedBox,b))))
   throw Error('Pack2 original sleeve cannot be geometrically separated from the beam');
 // All sleeve pieces must connect physically to original source beam, another
 // sleeve piece, and eventually the verified original Pack2 beam. Do not allow
 // isolated floating post fragments or fake just-near geometry.
 const combined=[...shape.map(b=>({box:b,beam:true})),...cut.map(p=>({box:p.composedBox,beam:false}))];
 const seen=new Set(),stack=[0];
 while(stack.length){const i=stack.pop();if(seen.has(i))continue;seen.add(i);
  for(let j=0;j<combined.length;j++)if(!seen.has(j)&&connected(combined[i].box,combined[j].box))
    stack.push(j);
 }
 if(seen.size!==combined.length)throw Error('Original Pack2 derived sleeve disconnected from true beam');
 // Pack3 underlays use a source-authored 0...0.125 material in the cell ABOVE.
 const roofBase=roof.filter(b=>Math.abs(b[1])<=EPS);
 if(!roofBase.length)throw Error('Original Pack3 roof candidate lacks physical underside at Y0');
 let roofContact=0,roofContactArea=0;
 for(const p of cut)if(Math.abs(p.composedBox[4]-1)<=EPS)for(const tile of roofBase){
  const x=Math.min(p.composedBox[3],tile[3])-Math.max(p.composedBox[0],tile[0]);
  const z=Math.min(p.composedBox[5],tile[5])-Math.max(p.composedBox[2],tile[2]);
  if(x>EPS&&z>EPS){roofContact++;roofContactArea+=x*z;}
 }
 if(roofContact<1||roofContactArea<=EPS)
   throw Error('Original Pack2 roof saddle cannot touch authentic Pack3 underlay');
 const touched=cut.filter(p=>shape.some(b=>connected(p.composedBox,b))).length;
 if(touched<2)throw Error('Original Pack2 sleeve cannot transfer contact to actual beam');
 return Object.freeze({pieces:Object.freeze(cut),originalPostSourceBoxes:post.length,
   sourceBeamBoxes:shape.length,originalSourcePartContactWithBeam:touched,
   originalRoofUnderlayPositiveAreaContact:roofContactArea,
   sourceRoofFaceContacts:roofContact,
   sourceContinuousBeamSleeveToRoof:true,composedVisibleBoxes:cut.length+shape.length,
   noPositiveVolumeIntersectionsWithOriginalBeam:true});
}
function generatePostVertices(at,pieces,palette){
 if(!Array.isArray(palette?.base)||!Array.isArray(palette?.edge)||
    !Array.isArray(palette?.grain))throw Error('Original Pack2 post source tonal palette missing');
 const cols=[palette.base,palette.edge,palette.grain];
 const dst=new Float32Array(pieces.length*12*3*STRIDE);let o=0;
 for(const part of pieces){
  const b=part.composedBox,[x,y,z,X,Y,Z]=b;
  const corners=[[x,y,z],[X,y,z],[X,Y,z],[x,Y,z],[x,y,Z],[X,y,Z],[X,Y,Z],[x,Y,Z]];
  const col=cols[part.originalSourcePostPart];
  if(!Array.isArray(col)||col.length!==3||col.some(v=>!Number.isFinite(v)||v<0||v>1))
   throw Error('Original Pack2 palette values invalid');
  for(const face of FACE){
   const [a,b,c,d]=face.verts;
   for(const j of [a,b,c,a,c,d]){
    for(let i=0;i<3;i++)dst[o++]=corners[j][i]+at[i];
    for(const norm of face.normal)dst[o++]=norm;
    for(const v of col)dst[o++]=v;
    dst[o++]=1;
   }
  }
 }
 if(o!==dst.length)throw Error('Original Pack2 derived source post mesh count drift');
 return dst;
}
export function auditD21OriginalRoofSaddleContacts(blueprint,d19,{
 resolvePack2Asset,resolvePack2RawShape,resolveOriginalPostDefinition,
 resolveOriginalRoofAsset,maxSites=6,maxPreviewBytes=96*1024
}={}){
 if(!blueprint||blueprint.integrated!==false||blueprint.worldPlaced!==false||
    blueprint.creatorApproved!==false||!Array.isArray(blueprint.cells)||
    !d19||d19.blueprintId!==blueprint.id||d19.verifiedSourceBearingToFoundation!==true||
    d19.noExistingVoxelOverwrites!==true||!Array.isArray(d19.proposedTrussSpans))
   throw Error('D21 needs exact original unfused source and foundation-proven D19 truss proposal');
 if(typeof resolvePack2Asset!=='function'||typeof resolvePack2RawShape!=='function'||
    typeof resolveOriginalPostDefinition!=='function'||typeof resolveOriginalRoofAsset!=='function')
   throw TypeError('Original Manual Pack2/3 source shape and palette resolvers required');
 if(!Number.isSafeInteger(maxSites)||maxSites<1||maxSites>6||
    !Number.isSafeInteger(maxPreviewBytes)||maxPreviewBytes<8192||maxPreviewBytes>96*1024)
   throw RangeError('D21 original Pack2 roof-contact bounded sample budget invalid');
 const biome=Object.freeze({temperate:109,desert:110,snow:111,
  'enchanted-forest':112,mountain:111});
 const roofId=biome[blueprint.biome];
 if(!roofId)throw Error('No original authored biome mapping for Pack3 preview material');
 const roof=resolveOriginalRoofAsset(roofId);
 if(!roof||roof.id!==roofId||!Array.isArray(roof.parts)||!roof.parts.length||
    !Array.isArray(roof.boxes)||roof.boxes.length!==roof.parts.length)
   throw Error('Original Pack3 roof candidate source missing');
 const original=new Map();
 for(const c of blueprint.cells){
  if(!point(c.at)||original.has(K(c.at)))throw Error('Duplicate original 4B source voxel');
  original.set(K(c.at),c);
 }
 const post=resolveOriginalPostDefinition(62);
 if(!post||post.id!==62||post.roster!==22||post.family!=='wooden-support-posts')
   throw Error('Original Pack2 ID62 support-post definition has changed');
 const sourcePost=resolvePack2RawShape(62,0);
 if(!sourcePost||sourcePost.id!==62||!Array.isArray(sourcePost.boxes))
   throw Error('No original Pack2 post shape');
 const seen=new Set(),samples=[];let bytes=0,siteCount=0;
 for(const span of d19.proposedTrussSpans){
  if(!span.bothBearingsReachUnbrokenOriginalFoundation||
    !Array.isArray(span.points)||span.points.length!==span.spanCells||
    !['x','z'].includes(span.axis))
   throw Error('Roof saddle requires actual original two-foundation-bearing truss');
  const center=span.points[Math.floor(span.points.length/2)];
  if(!point(center)||seen.has(K(center))||original.has(K(center))||
     original.get(K([center[0],7,center[2]]))?.role!=='roof')
   throw Error('Roof saddle conflicts with original source cell or original roof');
  seen.add(K(center));siteCount++;
  const orientation=span.axis==='x'?'north':'east';
  if(span.orientation!==orientation)
   throw Error('Pack2 original beam horizontal source axis mis-rotated');
  if(samples.length>=maxSites)continue;
  const beam=resolvePack2Asset('pack2:015',orientation);
  const support=resolvePack2Asset('pack2:022','north');
  if(!beam||beam.blockId!==61||beam.triangleCount!==156||
     !support||support.blockId!==62||support.physical!==true||
     !Array.isArray(beam.shape?.boxes)||!Array.isArray(support.shape?.boxes))
   throw Error('Original Pack2 physical beam or post source changed');
  const shape=makeSleeve(beam.shape.boxes,support.shape.boxes,roof.boxes);
  if(shape.pieces.some(p=>original.has(K(center))))
   throw Error('Derived Pack2 roof sleeve overlaps original building source');
  const triangles=shape.pieces.length*12;
  if(triangles+beam.triangleCount>MAX_TRI)
   throw Error('Pack2 real original beam+derived sleeve exceeds source triangle envelope');
  const payload=triangles*3*STRIDE*4;
  bytes+=payload;if(bytes>maxPreviewBytes)
   throw Error('D21 source roof sleeve preview bytes exceed bounded phone CPU preview');
  const vertices=generatePostVertices(center,shape.pieces,post.palette);
  if(vertices.byteLength!==payload)throw Error('Original Pack2 source sleeve RGBA stride mismatch');
  samples.push(Object.freeze({at:Object.freeze([...center]),spanId:span.spanId,
    axis:span.axis,orientation,sourceBeamId:61,sourcePostId:62,originalRoofId:roofId,
    originalPack2BeamNativeTriangles:beam.triangleCount,
    derivedSleeveTriangles:triangles,sourceCombinedTriangleBudget:triangles+beam.triangleCount,
    originalPack2PostRawSourceBoxes:shape.originalPostSourceBoxes,
    cutOriginalPostPhysicalPieces:shape.pieces,
    sourcePartsContactingRealBeam:shape.originalSourcePartContactWithBeam,
    sourcePack3RoofUndersideContactArea:shape.originalRoofUnderlayPositiveAreaContact,
    sourcePack3RoofUnderlayContacts:shape.sourceRoofFaceContacts,
    derivedPostPhysicalWorldVertices:vertices,
    derivedPostSourcePaletteUnmodified:true,
    sourceContinuousBeamToProposedRoofUnderlay:true,
    noOriginalSourceCellOverlap:true,sourceCompositeNotProductionRegistered:true,
    beamOriginalMeshNotRegenerated:true,originalRoofMaterialPreviewOnly:true,
    structuralLoadAndWeldAcceptance:false,realPlayerMovementUnaccepted:true,
    realWebGL2Unaccepted:true,worldPlaced:false}));
 }
 if(!samples.length||siteCount!==d19.proposedTrussSpans.length)
   throw Error('No original source roof truss supports available');
 return Object.freeze({format:'mythwrought.builder-d.d21.original-beam-post-roof-contact.v1',
  blueprintId:blueprint.id,provenTwoFoundationBearingSpans:siteCount,
  originalRoofCandidateId:roofId,sourceSampleCount:samples.length,
  originalBeamPostRoofContactSamples:Object.freeze(samples),
  generatedSourcePostVertexBytes:bytes,maximumSourcePostVertexBytes:maxPreviewBytes,
  originalWorldCellsUntouched:true,sourcePack2AndPack3Unchanged:true,
  derivedCompositeApprovedAsLiveBlock:false,
  originalRoofSourceReplacementNotMounted:true,
  fullStructuralLoadingAccepted:false,realPack2PostTextureRenderAccepted:false,
  realWebGL2Accepted:false,originalPlayerCollisionAccepted:false,
  iPhonePwaAccepted:false,worldPlaced:false});
}
