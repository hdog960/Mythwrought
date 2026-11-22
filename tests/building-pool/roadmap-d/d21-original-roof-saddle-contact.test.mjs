// Builder D21 targeted native original-source contact proof (NOT live world).
// Original Pack2 ID61/62 physical boxes + original Pack3 roof material underlay.
// The roof source mapping, combined block registration, player physics, save and
// in-game WebGL are explicitly not approved here.
import test from 'node:test';
import assert from 'node:assert/strict';
import {ROADMAP_D_WAVE16_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave16.mjs';
import {ROADMAP_D_WAVE17_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave17.mjs';
import {planD19SourceProvenRoofTrusses} from '../../../src/building-pool/roadmap-d/d19-original-supported-roof-truss-plan.mjs';
import {auditD21OriginalRoofSaddleContacts} from '../../../src/building-pool/roadmap-d/d21-original-roof-saddle-contact.mjs';
import {resolvePack2BuilderAsset} from '../../../src/builder-assets/pack2.mjs';
import {pack2Spec} from '../../../src/pack2-integration.mjs';
import {pack2Shape} from '../../../src/block-packs/pack-2/definitions.mjs';
import {pack3RoofById} from '../../../src/block-packs/pack-3/roofing-materials.mjs';
const originals=[...ROADMAP_D_WAVE16_BUILDINGS,...ROADMAP_D_WAVE17_BUILDINGS],K=a=>a.join(',');
const originalDeps=Object.freeze({resolvePack2Asset:resolvePack2BuilderAsset,
 resolvePack2RawShape:pack2Shape,resolveOriginalPostDefinition:pack2Spec,
 resolveOriginalRoofAsset:pack3RoofById});
const cross=(a,b)=>[0,1,2].every(i=>Math.min(a[i+3],b[i+3])-Math.max(a[i],b[i])>1e-6);
const positiveTouch=(a,b)=>{const d=[0,1,2].map(i=>Math.min(a[i+3],b[i+3])-Math.max(a[i],b[i]));
 return d.every(v=>v>=-1e-6)&&d.filter(v=>v>1e-6).length>=2};
const audit=b=>auditD21OriginalRoofSaddleContacts(b,planD19SourceProvenRoofTrusses(b),originalDeps);
test('all 90 genuine original two-foundation-bearing trusses have real 61/62 derived nonoverlapping beam-to-roof contact with original Pack3 materials',()=>{
 assert.equal(originals.length,16);
 let spans=0,cuffs=0,bytes=0,mappedRoofs=new Set(),ids=new Set();
 for(const b of originals){
  const originalSource=b.cells.map(c=>K(c.at)+'|'+c.role+'|'+c.asset).join(';');
  const source=new Map(b.cells.map(c=>[K(c.at),c]));
  const truss=planD19SourceProvenRoofTrusses(b),result=audit(b);
  assert.equal(result.blueprintId,b.id);
  assert.equal(result.provenTwoFoundationBearingSpans,truss.proposedSpanCount);
  assert.equal(result.sourceSampleCount,truss.proposedSpanCount,
    'D21 must audit EVERY real D19 grounded truss, not a partial sample');
  assert.ok(result.generatedSourcePostVertexBytes<=96*1024);
  assert.equal(result.originalWorldCellsUntouched,true);
  assert.equal(result.sourcePack2AndPack3Unchanged,true);
  assert.equal(result.derivedCompositeApprovedAsLiveBlock,false);
  assert.equal(result.originalRoofSourceReplacementNotMounted,true);
  assert.equal(result.fullStructuralLoadingAccepted,false);
  assert.equal(result.realPack2PostTextureRenderAccepted,false);
  assert.equal(result.realWebGL2Accepted,false);
  assert.equal(result.iPhonePwaAccepted,false);
  assert.equal(result.worldPlaced,false);
  assert.equal(result.originalBeamPostRoofContactSamples.length,truss.proposedSpanCount);
  for(const s of result.originalBeamPostRoofContactSamples){
   assert.equal(s.sourceBeamId,61);assert.equal(s.sourcePostId,62);
   ids.add(s.sourceBeamId);ids.add(s.sourcePostId);mappedRoofs.add(s.originalRoofId);
   assert.equal(source.get(K(s.at)),undefined,'D21 source cuff overwrites existing original voxel');
   assert.equal(source.get(K([s.at[0],7,s.at[2]]))?.role,'roof');
   assert.equal(s.originalPack2BeamNativeTriangles,156);
   assert.equal(s.originalPack2PostRawSourceBoxes,3);
   assert.equal(s.cutOriginalPostPhysicalPieces.length,4);
   assert.equal(s.derivedSleeveTriangles,48);
   assert.equal(s.sourceCombinedTriangleBudget,204);
   assert.equal(s.derivedPostPhysicalWorldVertices.length,48*30);
   assert.equal(s.derivedPostPhysicalWorldVertices.byteLength,48*30*4);
   assert.ok(s.sourcePartsContactingRealBeam>=2);
   assert.ok(s.sourcePack3RoofUnderlayContacts>=1);
   assert.ok(s.sourcePack3RoofUndersideContactArea>0.32);
   assert.equal(s.sourceContinuousBeamToProposedRoofUnderlay,true);
   assert.equal(s.noOriginalSourceCellOverlap,true);
   assert.equal(s.sourceCompositeNotProductionRegistered,true);
   assert.equal(s.originalRoofMaterialPreviewOnly,true);
   assert.equal(s.structuralLoadAndWeldAcceptance,false);
   assert.equal(s.realPlayerMovementUnaccepted,true);
   assert.equal(s.realWebGL2Unaccepted,true);
   assert.equal(s.worldPlaced,false);
   const beam=resolvePack2BuilderAsset('pack2:015',s.orientation);
   const roof=pack3RoofById(s.originalRoofId);
   assert.ok(beam?.shape.boxes?.length===3&&roof?.boxes.length>=7);
   const actualPost=pack2Shape(62,0).boxes;
   for(const piece of s.cutOriginalPostPhysicalPieces){
    assert.ok(actualPost.some(x=>x.every((v,j)=>Math.abs(v-piece.sourceOriginalPostBox[j])<1e-8)),
      'D21 physical sleeve introduces a synthetic non-Pack2 support post source');
    assert.ok(beam.shape.boxes.every(x=>!cross(x,piece.composedBox)),
      'original Pack2 support-post material collides with original true beam');
    assert.ok([0,1,2].every(j=>
      piece.composedBox[j]>=piece.sourceOriginalPostBox[j]-1e-8&&
      piece.composedBox[j+3]<=piece.sourceOriginalPostBox[j+3]+1e-8),
      'Pack2 derived support material extended beyond original post geometry');
   }
   assert.ok(s.cutOriginalPostPhysicalPieces.some(p=>
    beam.shape.boxes.some(x=>positiveTouch(x,p.composedBox))),
    'no actual physical connection to original source Pack2 beam');
   assert.ok(s.cutOriginalPostPhysicalPieces.some(p=>p.composedBox[4]===1&&
     roof.boxes.some(box=>box[1]===0&&
       Math.min(p.composedBox[3],box[3])-Math.max(p.composedBox[0],box[0])>1e-6&&
       Math.min(p.composedBox[5],box[5])-Math.max(p.composedBox[2],box[2])>1e-6)),
     'source-derived post cannot reach Pack3 roof underlay in Y7 cell');
   const originalPixels=s.derivedPostPhysicalWorldVertices;
   for(let i=0;i<originalPixels.length;i+=10){
    for(let j=0;j<3;j++)assert.ok(originalPixels[i+j]>=s.at[j]-1e-5&&
      originalPixels[i+j]<=s.at[j]+1+1e-5);
    assert.ok(Math.abs(Math.hypot(originalPixels[i+3],originalPixels[i+4],originalPixels[i+5])-1)<.001);
    for(let j=6;j<10;j++)assert.ok(originalPixels[i+j]>=0&&originalPixels[i+j]<=1);
   }
  }
  assert.equal(b.cells.map(c=>K(c.at)+'|'+c.role+'|'+c.asset).join(';'),originalSource);
  spans+=result.provenTwoFoundationBearingSpans;cuffs+=result.sourceSampleCount;
  bytes+=result.generatedSourcePostVertexBytes;
 }
 assert.deepEqual({spans,cuffs,bytes},{spans:90,cuffs:90,bytes:518400});
 assert.deepEqual([...ids].sort((a,b)=>a-b),[61,62]);
 assert.deepEqual([...mappedRoofs].sort((a,b)=>a-b),[109,110,111,112]);
});
test('D21 original post source must not overlap Pack2 beam, invent roof contact or incorrectly pass a fake source',()=>{
 const b=originals[0],q=planD19SourceProvenRoofTrusses(b);
 assert.throws(()=>auditD21OriginalRoofSaddleContacts(b,q),/resolvers required/);
 for(const opts of [{maxSites:13},{maxSites:0},{maxPreviewBytes:7000},{maxPreviewBytes:200000}])
  assert.throws(()=>auditD21OriginalRoofSaddleContacts(b,q,{...originalDeps,...opts}),/budget/);
 assert.throws(()=>auditD21OriginalRoofSaddleContacts(b,q,{
  ...originalDeps,maxPreviewBytes:8192}),/exceed bounded phone CPU preview/);
 const fakeRoof=id=>{const r=pack3RoofById(id);return {...r,boxes:r.boxes.map(x=>
  x[1]===0?[x[0],.05,x[2],x[3],x[4],x[5]]:x)}};
 assert.throws(()=>auditD21OriginalRoofSaddleContacts(b,q,{
  ...originalDeps,resolveOriginalRoofAsset:fakeRoof}),/lacks physical underside/);
 const wrongPost=(ref,orientation)=>{const x=resolvePack2BuilderAsset(ref,orientation);
  return ref==='pack2:022'?{...x,blockId:255}:x};
 assert.throws(()=>auditD21OriginalRoofSaddleContacts(b,q,{
  ...originalDeps,resolvePack2Asset:wrongPost}),/source changed/);
 const brokenTruss={...q,proposedTrussSpans:q.proposedTrussSpans.map((x,i)=>
  i===0?{...x,bothBearingsReachUnbrokenOriginalFoundation:false}:x)};
 assert.throws(()=>auditD21OriginalRoofSaddleContacts(b,brokenTruss,originalDeps),
  /two-foundation-bearing/);
});
