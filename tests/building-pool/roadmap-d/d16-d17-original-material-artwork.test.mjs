// Focused original 4B source-dependent PHYSICAL material art test.
// Uses real Pack 1 masonry pixels, Pack 3 material pieces and Pack 4 RGBA mesh.
import test from 'node:test';
import assert from 'node:assert/strict';
import {masonryTexture} from '../../../src/block-packs/pack-1/core-masonry.mjs';
import {resolvePack3BuilderAsset} from '../../../src/builder-assets/pack3.mjs';
import {resolveManualFivePackAsset} from '../../../src/builder-assets/manual-five-pack.mjs';
import {resolvePack2BuilderAsset} from '../../../src/builder-assets/pack2.mjs';
import {pack2WorldVertices} from '../../../src/pack2-integration.mjs';
import {pack4BuilderAsset} from '../../../src/block-packs/pack-4/builder-handoff.mjs';
import {ROADMAP_D_WAVE16_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave16.mjs';
import {ROADMAP_D_WAVE17_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave17.mjs';
import {createD16D17OriginalMaterialArtwork} from '../../../src/building-pool/roadmap-d/d16-d17-original-material-artwork.mjs';
const sourceBuildings=[...ROADMAP_D_WAVE16_BUILDINGS,...ROADMAP_D_WAVE17_BUILDINGS];
const resolvers={resolveManualAsset:resolveManualFivePackAsset,resolvePack4Asset:pack4BuilderAsset,
  resolvePack3BuilderAsset,masonryTexture,resolvePack2BuilderAsset,pack2WorldVertices};
test('all 16 W16+17 original buildings carry authentic Pack1 stone pixel art, Pack3 colored physical roof/crest/spire pieces and transparent Pack4 mesh',()=>{
 assert.equal(sourceBuildings.length,16);
 let texCount=0,coloredPieces=0,meshCount=0,translucent=0,facadeSampleTotal=0,woodCount=0;
 const signatures=new Map();
 for(const b of sourceBuildings){
   const originalLength=b.cells.length;
   const packet=createD16D17OriginalMaterialArtwork(b,resolvers);
   assert.equal(packet.blueprintId,b.id);
   assert.equal(packet.sampledOriginalPhysicalCells,40);
   assert.ok(packet.sourceOwnerPackIds.includes(3)&&packet.sourceOwnerPackIds.includes(4));
   assert.ok(packet.sourceOwnerPackIds.includes(1)||packet.sourceOwnerPackIds.includes(2));
   assert.ok([0,2].includes(packet.masonryFaceTextures.length));
   assert.equal(packet.masonryFaceTextures.length===2,packet.sourceOwnerPackIds.includes(1));
   for(const w of packet.originalPlanedWoodMeshes){
     assert.equal(w.sourcePack,2);assert.equal(w.originalNumericId,59);
     assert.ok(w.authoredWorldVertices instanceof Float32Array);
     assert.equal(w.stride,9);
     assert.ok(w.originalTriangles>0);
     assert.equal(w.originalTriangles,w.authoredWorldVertices.length/27);
     assert.equal(w.worldRegistered,false);woodCount++;
   }
   assert.ok(packet.originalPlanedWoodMeshes.length+packet.masonryFaceTextures.length>0);
   assert.equal(packet.originalPack3ColorParts.length,18);
   assert.equal(packet.originalPack4WorldMeshes.length,14);
   assert.equal(b.cells.length,originalLength,'material artwork must never modify original blueprint cells');
   for(const t of packet.masonryFaceTextures){
     assert.equal(t.width,24);assert.equal(t.height,24);
     assert.equal(t.pixels.length,24*24*4);
     assert.ok(/^[0-9a-f]{8}$/.test(t.hashFNV1a32));
     assert.equal(t.originalArtwork,true);
     signatures.set(t.id+':'+t.face,t.hashFNV1a32);
   }
   for(const source of packet.originalPack3ColorParts){
     assert.equal(source.sourceIsActualPack3Material,true);
     assert.ok(source.originalColoredParts.length>0);
     for(const p of source.originalColoredParts){
       assert.ok(p.sourceMaterialColor.length>0&&p.physicalWorldBox.length===6);
       assert.equal(p.physicalOriginalPart,true);
       coloredPieces++;
     }
   }
   for(const item of packet.originalPack4WorldMeshes){
     assert.equal(item.originalRealPack4WorldMesh.materialRGBAUnmodified,true);
     assert.equal(item.originalRealPack4WorldMesh.vertexNormalsUnmodified,true);
     assert.ok(item.originalRealPack4WorldMesh.opaqueTriangles+item.originalRealPack4WorldMesh.translucentTriangles>0);
     meshCount++;
   }
   translucent+=packet.originalPack4TriangleCounts.translucent;
   facadeSampleTotal+=packet.sampledOriginalPhysicalCells;
   texCount+=packet.masonryFaceTextures.length;
   assert.deepEqual([packet.worldPlacementAccepted,packet.transparencySortingAccepted,
      packet.iphoneRendererAccepted,packet.finalPhysicalArtworkAccepted,packet.notProductionRegistered],
      [false,false,false,false,true]);
 }
 assert.ok(texCount>=2&&texCount<=32&&texCount%2===0);
 assert.ok(woodCount>0,'source-authored timber facades lost original Pack2 physical grain');
 assert.equal(meshCount,224);
 assert.equal(facadeSampleTotal,640);
 assert.ok(coloredPieces>=288,'original Pack3 authored colored parts missing');
 assert.ok(translucent>0,'missing actual original Pack4 glass alpha triangles');
 assert.ok(signatures.size>=2&&signatures.size<=10,'Pack1 face pixel art census drift');
});
test('source authenticity fails closed for forged Pack1 textures or Pack3 color data',()=>{
 const b=sourceBuildings[0];
 const fakeTexture=()=>({id:14,face:'north',width:24,height:24,pixels:new Uint8Array(2304)});
 assert.throws(()=>createD16D17OriginalMaterialArtwork(b,{...resolvers,masonryTexture:fakeTexture}),/original Pack1|opaque alpha/);
 const fakeColor=()=>({symbol:'pack3:023',blockId:109,sourcePack:3,physical:true,worldRegistered:false,parts:[]});
 assert.throws(()=>createD16D17OriginalMaterialArtwork(b,{...resolvers,resolvePack3BuilderAsset:fakeColor}),/original Pack3|material parts/);
 assert.throws(()=>createD16D17OriginalMaterialArtwork(b,{...resolvers,resolvePack3BuilderAsset:null}),/required/);
});
