// MYTHWROUGHT — Builder D authentic 1/3/4 physical material preview ART.
// Standalone read-only source handoff. Uses original Pack1 procedural face pixels,
// original Pack3 geometry colored parts and actual Pack4 translucent RGBA triangles.
// No live world, physical family integration, shader, settlement or save mutation.
import {assembleD16D17OriginalPhysicalPreview} from './d16-d17-source-backed-material-assembly.mjs';
const validAt=at=>Array.isArray(at)&&at.length===3&&at.every(Number.isSafeInteger);
function verifyTexture(texture,id,face){
 if(!texture||texture.id!==id||texture.face!==face||texture.width!==24||texture.height!==24||
    !(texture.pixels instanceof Uint8Array)||texture.pixels.length!==24*24*4)
   throw Error('Missing original Pack1 masonry pixel-art texture '+id+' '+face);
 const pixels=new Uint8Array(texture.pixels);
 let seen=0;const distinct=new Set();
 for(let i=0;i<pixels.length;i+=4){
   if(pixels[i+3]!==255)throw Error('Pack1 masonry artwork missing opaque alpha');
   if(i%12===0)distinct.add(pixels[i]+','+pixels[i+1]+','+pixels[i+2]);seen++;
 }
 if(seen!==576||distinct.size<8)throw Error('Suspicious flat-colored Pack1 material substitution');
 let digest=2166136261;
 for(const value of pixels){digest^=value;digest=Math.imul(digest,16777619)}
 return Object.freeze({id,face,width:24,height:24,pixels,sourcePack:1,source:'original-pack1-masonry-rgba',
    hashFNV1a32:(digest>>>0).toString(16).padStart(8,'0'),originalArtwork:true});
}
function originalRoofPaint(sample,resolvePack3BuilderAsset){
 const part=resolvePack3BuilderAsset(sample.sourceOriginalSymbol,sample.sourceOrientation);
 if(!part||part.symbol!==sample.sourceOriginalSymbol||part.blockId!==sample.sourceNumericId||
   part.sourcePack!==3||part.physical!==true||part.worldRegistered!==false||
   !Array.isArray(part.parts)||!part.parts.length)throw Error('Missing original Pack3 physical material parts');
 const world=part.parts.map(piece=>{
   if(!piece||typeof piece.tone!=='string'||typeof piece.color!=='string'||!piece.color||
     !Array.isArray(piece.box)||piece.box.length!==6||piece.box.some(n=>!Number.isFinite(n))||
     !validAt(sample.sourceAt))throw Error('Fake Pack3 original part or material color');
   const box=piece.box.map((v,i)=>v+sample.sourceAt[i%3]);
   return Object.freeze({sourceMaterialTone:piece.tone,sourceMaterialColor:piece.color,
      physicalWorldBox:Object.freeze(box),physicalOriginalPart:true});
 });
 return Object.freeze({sourceAt:sample.sourceAt,sourceOriginalSymbol:sample.sourceOriginalSymbol,
    originalBlockId:part.blockId,rotation:part.yaw,sourcePack:3,originalColoredParts:Object.freeze(world),
    sourceIsActualPack3Material:true,renderedInLiveGame:false});
}
export function createD16D17OriginalMaterialArtwork(blueprint,{
 resolveManualAsset,resolvePack4Asset,resolvePack3BuilderAsset,masonryTexture,...budgets
}={}){
 if(typeof resolvePack3BuilderAsset!=='function'||typeof masonryTexture!=='function')
   throw TypeError('Original Pack1 masonryTexture + Pack3 physical materials required, no palette simulation');
 const scene=assembleD16D17OriginalPhysicalPreview(blueprint,{
   resolveManualAsset,resolvePack4Asset,...budgets
 });
 const wall=scene.physicalSamples.find(s=>s.sampleKind==='external-masonry');
 if(!wall||wall.sourceOriginalPack!==1)throw Error('Missing original stonewall texture owner');
 const wallTextures=Object.freeze(['north','top'].map(face=>verifyTexture(
   masonryTexture(wall.sourceNumericId,face,24),wall.sourceNumericId,face)));
 const roofs=Object.freeze(scene.physicalSamples.filter(x=>x.sourceOriginalPack===3)
   .map(sample=>originalRoofPaint(sample,resolvePack3BuilderAsset)));
 const meshes=scene.physicalSamples.filter(x=>x.sourceOriginalPack===4);
 if(!meshes.length||meshes.some(x=>!x.originalRealPack4WorldMesh))
   throw Error('Original Pack4 transparent and opaque source art missing');
 const triangles=Object.freeze({
    opaque:meshes.reduce((n,x)=>n+x.originalRealPack4WorldMesh.opaqueTriangles,0),
    translucent:meshes.reduce((n,x)=>n+x.originalRealPack4WorldMesh.translucentTriangles,0)
 });
 if(triangles.opaque+triangles.translucent<=0)throw Error('No original Pack4 physical RGBA vertices');
 return Object.freeze({format:'mythwrought.builder-d.original-manual-material-artwork.v1',
   blueprintId:scene.blueprintId,biome:scene.biome,
   masonryFaceTextures:wallTextures,originalPack3ColorParts:roofs,
   originalPack4TriangleCounts:triangles,originalPack4WorldMeshes:Object.freeze(meshes),
   sampledOriginalPhysicalCells:scene.sampledCount,sourceOwnerPackIds:Object.freeze([1,3,4]),
   sourcePack2AndPack5ArtNotApplied:true,originalPack3ColorsPreserved:true,
   originalPack4TransparencyPreserved:true,originalPack1PixelArtPreserved:true,
   originalSourceCellsUnchanged:true,worldPlacementAccepted:false,transparencySortingAccepted:false,
   iphoneRendererAccepted:false,finalPhysicalArtworkAccepted:false,
   creatorSourceApprovalPending:true,notProductionRegistered:true});
}
