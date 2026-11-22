// MYTHWROUGHT Builder D — W16/W17 original source-material evidence (READ ONLY).
// Consumes the separately audited 44-slot physical assembly, not an in-game world.
// Uses unmodified original Manual Pack 1 actual six-face pixel textures, Pack 2
// physically authored beam meshes, Pack 3 colored shaped roof parts and Pack 4
// genuinely triangulated RGBA mesh. Does not synthesize final artwork approval.
const faceNames=Object.freeze(['north','south','east','west','top','bottom']);
const boxKey=b=>b.map(v=>Math.round(v*1000000)).join(',');
function requireBoxes(rows,at,source){
 if(!Array.isArray(rows)||!rows.length||rows.some(b=>!Array.isArray(b)||b.length!==6||
    b.some(Number.isFinite) || b.some(x=>!Number.isFinite(x))))
   throw Error('Original '+source+' physical boxes were not certified');
 // Keep original box order; no hidden shell/cube substitution or simplification.
 return rows.map(b=>b.map((v,i)=>v+at[i%3]));
}
function equalWorldBoxes(original,fromResolver,at,source){
 if(original.length!==fromResolver.length)throw Error('Physical part count drift '+source);
 for(let i=0;i<original.length;i++)if(boxKey(original[i])!==boxKey(fromResolver[i]))
   throw Error('Physical geometry provenance drift '+source+' part '+i);
}
function physicalRGBA(part,source){
 if(!part||!Array.isArray(part.box)||part.box.length!==6||
    typeof part.color!=='string'||!/^#[a-fA-F0-9]{6}$/.test(part.color))
   throw Error('Source-authored roof color or shape missing '+source);
 return Object.freeze([
  parseInt(part.color.slice(1,3),16),parseInt(part.color.slice(3,5),16),
  parseInt(part.color.slice(5,7),16),255
 ]);
}
function sourcePixelArtwork(getTexture,id,res){
 if(!Number.isSafeInteger(res)||res<8||res>32)throw RangeError('Bounded material atlas 8..32px only');
 const faces={};
 let unique=new Set();
 for(const face of faceNames){
  const rgba=getTexture(id,face,res);
  if(!(rgba instanceof Uint8Array)||rgba.length!==res*res*4)
    throw Error('Missing original Pack1 RGBA face artwork '+id+':'+face);
  for(let i=0;i<rgba.length;i+=4){
   if(rgba[i+3]!==255)throw Error('Pack1 wall material source unexpectedly transparent');
   unique.add(rgba[i]+','+rgba[i+1]+','+rgba[i+2]);
  }
  // Preserve all source-authored pixels, never approximate a flat palette.
  faces[face]=new Uint8Array(rgba);
 }
 if(unique.size<16)throw Error('Pack1 original masonry texture lost authored details');
 return Object.freeze({numericId:id,size:res,faceRGBA:Object.freeze(faces),distinctPixelColors:unique.size,
  byteCount:faceNames.length*res*res*4,originalPixelArt:true,notRuntimeUploaded:true});
}
export function auditD16D17OriginalSurfaceEvidence(scene,{
 masonryTexture,resolvePack2Asset,resolvePack3Asset,textureSize=24
}={}){
 if(!scene||scene.format!=='mythwrought.builder-d.w16-w17.manual-physical-assembly.v1'||
    scene.worldPlaced!==false||scene.gameplayIntegrated!==false||
    scene.sampledCount!==44||!Array.isArray(scene.physicalSamples)||
    scene.physicalSamples.length!==44)
   throw Error('Requires exact original 44-instance read-only physical preview');
 if(typeof masonryTexture!=='function'||typeof resolvePack2Asset!=='function'||
    typeof resolvePack3Asset!=='function')throw TypeError('All original source material resolvers are mandatory');
 const textures=new Map(),realRoofParts=[],beams=[],genuineP4=[];
 let originalRoofPartCount=0,totalPack2Triangles=0,totalPack4Triangles=0;
 for(const p of scene.physicalSamples){
  if(!Array.isArray(p.sourceAt)||p.sourceAt.length!==3||p.sourceAt.some(x=>!Number.isSafeInteger(x))||
     p.originalGeometryResolved!==true||p.worldPlaced!==false)
    throw Error('Source physical instance provenance invalid');
  const symbol=p.sourceOriginalSymbol,id=p.sourceNumericId;
  if(p.sourceOriginalPack===1){
   if(!/^pack1:\d{3}$/.test(symbol)||id<10||id>14)
     throw Error('Unowned Pack1 masonry surface');
   if(!textures.has(id))textures.set(id,sourcePixelArtwork(masonryTexture,id,textureSize));
  }else if(p.sourceOriginalPack===2){
   const original=resolvePack2Asset(symbol,p.sourceOrientation);
   if(!original||original.symbol!==symbol||original.blockId!==id||
      !original.physical||original.livePlaceable!==false||
      !Number.isSafeInteger(original.triangleCount)||original.triangleCount<=0)
     throw Error('Original Pack2 authored timber mesh missing '+symbol);
   const world=requireBoxes(original.shape.boxes,p.sourceAt,symbol);
   equalWorldBoxes(p.renderablePhysicalBoxes,world,p.sourceAt,symbol);
   totalPack2Triangles+=original.triangleCount;
   beams.push(Object.freeze({at:p.sourceAt,id,physicalSourceTriangles:original.triangleCount,
     authoredMesh:true,supportPlacementNotValidated:true}));
  }else if(p.sourceOriginalPack===3){
   const original=resolvePack3Asset(symbol,p.sourceOrientation);
   if(!original||original.symbol!==symbol||original.blockId!==id||!original.physical||
      !Array.isArray(original.parts)||original.parts.length!==p.originalPhysicalVisibleBoxes)
     throw Error('Original Pack3 roof material source missing '+symbol);
   const world=requireBoxes(original.parts.map(x=>x.box),p.sourceAt,symbol);
   equalWorldBoxes(p.renderablePhysicalBoxes,world,p.sourceAt,symbol);
   const colored=Object.freeze(original.parts.map(part=>Object.freeze({tone:part.tone,
     rgba:physicalRGBA(part,symbol)})));
   originalRoofPartCount+=colored.length;
   realRoofParts.push(Object.freeze({at:p.sourceAt,id,sourcePartColors:colored,
     authoredOriginalRoofParts:true,notRenderedToGame:true}));
  }else if(p.sourceOriginalPack===4){
   const mesh=p.originalRealPack4WorldMesh;
   if(!mesh||mesh.source!=='original-pack4-actual-preview-vertices'||
      !(mesh.opaqueWorldVertices instanceof Float32Array)||
      !(mesh.translucentWorldVertices instanceof Float32Array)||
      mesh.stride!==10||mesh.worldRendererAcceptance!==false)
     throw Error('Missing genuine original Pack4 RGBA mesh');
   const triangles=(mesh.opaqueWorldVertices.length+mesh.translucentWorldVertices.length)/30;
   if(!Number.isSafeInteger(triangles)||triangles<=0||triangles>320)
     throw Error('Original Pack4 mesh exceeds source-bounded triangle budget');
   totalPack4Triangles+=triangles;
   genuineP4.push(Object.freeze({at:p.sourceAt,id,triangles,
     originalTranslucentTriangles:mesh.translucentWorldVertices.length/30,
     transparentSortPending:true,originalAlphaPreserved:true}));
  }else throw Error('Unowned Pack source in Builder D physical preview');
 }
 if(textures.size!==1||beams.length!==4||realRoofParts.length!==18||genuineP4.length!==14||
    originalRoofPartCount<=18||totalPack4Triangles<=14||totalPack2Triangles<=4)
   throw Error('Physical-material sample source census drift');
 return Object.freeze({
  format:'mythwrought.builder-d.w16-w17.actual-material-source-evidence.v1',
  blueprintId:scene.blueprintId,biome:scene.biome,
  originalPack1Atlas:Object.freeze([...textures.values()]),
  pack2AuthoredBeamSamples:Object.freeze(beams),
  pack3ColoredRoofSamples:Object.freeze(realRoofParts),
  pack4OriginalRgbaMeshSamples:Object.freeze(genuineP4),
  totalNativeMaterialSamples:scene.sampledCount,
  originalRoofColoredParts:originalRoofPartCount,
  originalPack2AuthoredTriangles:totalPack2Triangles,
  originalPack4SourceTriangles:totalPack4Triangles,
  originalTextureRgbaBytes:[...textures.values()].reduce((n,x)=>n+x.byteCount,0),
  originalAssetSourcesOnly:true,liveRendererAccepted:false,
  finalMaterialArtworkApproved:false,worldSupportAccepted:false,
  iphonePwaApproved:false,worldPlaced:false,gameplayIntegrated:false
 });
}
