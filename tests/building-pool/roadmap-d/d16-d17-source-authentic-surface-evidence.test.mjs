// Builder D focused native test for REAL original 1/2/3/4 material-source handoff.
// This is NOT a game renderer, screenshot, world placement or final artwork approval.
import test from 'node:test';
import assert from 'node:assert/strict';
import {masonryTexture} from '../../../src/block-packs/pack-1/core-masonry.mjs';
import {resolvePack2BuilderAsset} from '../../../src/builder-assets/pack2.mjs';
import {resolvePack3BuilderAsset} from '../../../src/builder-assets/pack3.mjs';
import {resolveManualFivePackAsset} from '../../../src/builder-assets/manual-five-pack.mjs';
import {pack4BuilderAsset} from '../../../src/block-packs/pack-4/builder-handoff.mjs';
import {ROADMAP_D_WAVE16_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave16.mjs';
import {ROADMAP_D_WAVE17_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave17.mjs';
import {assembleD16D17OriginalPhysicalPreview} from '../../../src/building-pool/roadmap-d/d16-d17-source-backed-material-assembly.mjs';
import {auditD16D17OriginalSurfaceEvidence} from '../../../src/building-pool/roadmap-d/d16-d17-source-authentic-surface-evidence.mjs';
const all=[...ROADMAP_D_WAVE16_BUILDINGS,...ROADMAP_D_WAVE17_BUILDINGS];
const actualPhysical=b=>assembleD16D17OriginalPhysicalPreview(b,{
 resolveManualAsset:resolveManualFivePackAsset,resolvePack4Asset:pack4BuilderAsset
});
const realOpts={masonryTexture,resolvePack2Asset:resolvePack2BuilderAsset,
 resolvePack3Asset:resolvePack3BuilderAsset};
test('all 16 genuinely compiled buildings retain six original hand-authored Pack1 RGBA face textures and original Pack2/3/4 material provenance',()=>{
 assert.equal(all.length,16);
 const distinctMasonry=new Set(),distinctBiomes=new Set();
 let atlases=0,roofParts=0,beamTriangles=0,pack4Triangles=0;
 for(const b of all){
  const physical=actualPhysical(b),evidence=auditD16D17OriginalSurfaceEvidence(physical,realOpts);
  assert.equal(evidence.blueprintId,b.id);
  assert.equal(evidence.totalNativeMaterialSamples,44);
  assert.equal(evidence.originalPack1Atlas.length,1);
  const atlas=evidence.originalPack1Atlas[0];
  assert.equal(atlas.size,24);
  assert.equal(atlas.byteCount,13824);
  assert.equal(Object.keys(atlas.faceRGBA).length,6);
  assert.ok(atlas.distinctPixelColors>=16,'missing source-authentic painted masonry variation');
  const faceHashes=new Set();
  for(const [face,rgba] of Object.entries(atlas.faceRGBA)){
   assert.ok(['north','south','east','west','top','bottom'].includes(face));
   assert.ok(rgba instanceof Uint8Array);
   assert.equal(rgba.length,24*24*4);
   for(let i=3;i<rgba.length;i+=4)assert.equal(rgba[i],255,'Pack1 painted original masonry must be opaque');
   faceHashes.add(rgba.reduce((n,x)=>(Math.imul(n,16777619)^x)>>>0,2166136261));
  }
  assert.ok(faceHashes.size>=2,'original six-face masonry texture lost surface-specific artwork');
  assert.equal(evidence.pack2AuthoredBeamSamples.length,4);
  assert.equal(evidence.pack3ColoredRoofSamples.length,18);
  assert.equal(evidence.pack4OriginalRgbaMeshSamples.length,14);
  assert.equal(evidence.originalPack4SourceTriangles,12*60+156+228,'original Pack4 glass/bench/table triangles mismatched');
  assert.ok(evidence.originalPack2AuthoredTriangles>0);
  for(const piece of evidence.pack3ColoredRoofSamples){
   assert.ok(piece.sourcePartColors.length>=1);
   for(const part of piece.sourcePartColors){
    assert.match(part.tone,/\S/);
    assert.equal(part.rgba.length,4);
    assert.equal(part.rgba[3],255);
    assert.ok(part.rgba.every(v=>Number.isSafeInteger(v)&&v>=0&&v<=255));
   }
  }
  assert.deepEqual([evidence.originalAssetSourcesOnly,evidence.liveRendererAccepted,
   evidence.finalMaterialArtworkApproved,evidence.worldSupportAccepted,evidence.iphonePwaApproved,
   evidence.worldPlaced,evidence.gameplayIntegrated],[true,false,false,false,false,false,false]);
  distinctMasonry.add(atlas.numericId);
  distinctBiomes.add(evidence.biome);
  atlases++;roofParts+=evidence.originalRoofColoredParts;
  beamTriangles+=evidence.originalPack2AuthoredTriangles;
  pack4Triangles+=evidence.originalPack4SourceTriangles;
 }
 assert.equal(atlases,16);
 assert.deepEqual([...distinctMasonry].sort((a,b)=>a-b),[10,11,12,13,14]);
 assert.equal(distinctBiomes.size,5);
 assert.equal(pack4Triangles,16*(12*60+156+228));
 assert.ok(beamTriangles>=64&&roofParts>=16*18);
});
test('source-artwork preview rejects forged flat textures, unsupported roof part colors, and overwritten original shape identity',()=>{
 const actual=actualPhysical(all[0]);
 assert.throws(()=>auditD16D17OriginalSurfaceEvidence(actual),/resolvers/);
 const flat=(id,face,size)=>{const x=new Uint8Array(size*size*4);for(let i=0;i<x.length;i+=4){x[i]=80;x[i+1]=80;x[i+2]=80;x[i+3]=255}return x};
 assert.throws(()=>auditD16D17OriginalSurfaceEvidence(actual,{...realOpts,masonryTexture:flat}),/lost authored details/);
 const falseRoof=(symbol,orientation)=>{
  const a=resolvePack3BuilderAsset(symbol,orientation);
  return {...a,parts:a.parts.map((p,i)=>({...p,color:i===0?'not-a-color':p.color}))};
 };
 assert.throws(()=>auditD16D17OriginalSurfaceEvidence(actual,{...realOpts,resolvePack3Asset:falseRoof}),/color|shape/);
 const tampered={...actual,physicalSamples:actual.physicalSamples.map(p=>p.sourceOriginalPack===3?
   {...p,renderablePhysicalBoxes:p.renderablePhysicalBoxes.map(box=>box.map((v,i)=>i===0?v+.2:v))}:p)};
 assert.throws(()=>auditD16D17OriginalSurfaceEvidence(tampered,realOpts),/provenance drift/);
 assert.throws(()=>auditD16D17OriginalSurfaceEvidence(actual,{...realOpts,textureSize:128}),/atlas/);
});
