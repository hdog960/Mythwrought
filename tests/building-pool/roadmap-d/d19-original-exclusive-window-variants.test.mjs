// Builder D D19 real unchanged Pack4 original clear/sun/moon stained-glass choices.
// No same-cell multi-window overlays, no gameplay integration, native focused only.
import test from 'node:test';
import assert from 'node:assert/strict';
import {ROADMAP_D_WAVE16_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave16.mjs';
import {ROADMAP_D_WAVE17_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave17.mjs';
import {pack4BuilderAsset} from '../../../src/block-packs/pack-4/builder-handoff.mjs';
import {windowShape} from '../../../src/block-packs/pack-4/windows.mjs';
import {pack3OrnamentalById} from '../../../src/block-packs/pack-3/ornamental-pieces.mjs';
import {planD19ExclusiveOriginalWindowGlass} from '../../../src/building-pool/roadmap-d/d19-original-exclusive-window-variants.mjs';
const sources=[...ROADMAP_D_WAVE16_BUILDINGS,...ROADMAP_D_WAVE17_BUILDINGS],K=a=>a.join(',');
const turn=Object.freeze({north:0,east:1,south:2,west:3});
test('16 true 4B source buildings offer bounded mutually exclusive original physical glazing, no source edits or fake jamb/selection approval',()=>{
 assert.equal(sources.length,16);
 let count=0,stained=0,jambless=0,review=0,phys=0,changedDefault=0;
 const seenIds=new Set();
 for(const b of sources){
  assert.ok(!seenIds.has(b.id));seenIds.add(b.id);
  const before=b.cells.map(c=>K(c.at)+'|'+c.role+'|'+c.asset).join(';');
  const src=new Map(b.cells.map(c=>[K(c.at),c]));
  const result=planD19ExclusiveOriginalWindowGlass(b,{resolvePack4Asset:pack4BuilderAsset});
  assert.equal(result.originalWindowCount,b.openings.filter(o=>o.kind==='window').length);
  assert.equal(result.originalWindowCount,result.plannedOriginalWindowChoices.length);
  assert.equal(result.sourcePhysicalSamples.length,12);
  assert.equal(result.originalPack4CandidateGeometryResolved,true);
  assert.equal(result.glazingMutuallyExclusive,true);
  assert.equal(result.noSameCellWindowLayering,true);
  assert.equal(result.originalSourceFilesChanged,false);
  assert.equal(result.worldPlaced,false);
  assert.equal(result.sourceJambAndGlazingPhysicalAcceptance,false);
  assert.equal(result.worldMountsAccepted,false);
  assert.equal(result.userArtApproval,false);
  const unique=new Set();
  for(const g of result.plannedOriginalWindowChoices){
   assert.ok(!unique.has(K(g.at)),'duplicated window exclusive choice');unique.add(K(g.at));
   assert.equal(src.get(K(g.at)).role,'window');
   assert.equal(src.get(K(g.at)).asset,'pack4:030');
   assert.ok([159,160,161].includes(g.candidateId));
   assert.equal(g.candidateRef,g.candidateId===159?'pack4:030':'pack4:031');
   assert.equal(g.replacementOnly,true);assert.equal(g.neverOverlayOriginalGlass,true);
   assert.equal(g.originalCellRetained,true);
   assert.equal(g.sourceWindowRequiresRemediation,g.structuralJambCount<2);
   assert.equal(g.originalCompilerFacingIgnored,src.get(K(g.at)).facing!==g.authoritativeFacadeFacing);
   assert.equal(g.worldPlaced,false);assert.equal(g.creatorApproved,false);
   if(g.originalCompilerFacingIgnored)changedDefault++;
  }
  for(const p of result.sourcePhysicalSamples){
   assert.ok(unique.has(K(p.at)),'physical sample was not source-authored');
   const g=result.plannedOriginalWindowChoices.find(x=>K(x.at)===K(p.at));
   assert.equal(p.candidateId,g.candidateId);
   assert.equal(p.rotation,turn[g.authoritativeFacadeFacing]);
   assert.equal(p.originalSourcePack4Mesh,true);
   assert.ok(p.originalTranslucentTriangles>0);
   assert.ok(p.physicalVisibleParts>=1&&p.physicalCollisionParts>=1);
   assert.equal(p.worldRegistered,false);
   assert.equal(p.finalAlphaSorted,false);
  }
  assert.equal(b.cells.map(c=>K(c.at)+'|'+c.role+'|'+c.asset).join(';'),before,'source altered');
  count+=result.originalWindowCount;
  stained+=result.plannedStainedGlassCount;
  jambless+=result.noJambOriginalSources;
  review+=result.unframedOriginalSources.length;
  phys+=result.sourcePhysicalSamples.length;
 }
 assert.deepEqual({count,stained,jambless,review,phys},{count:1233,stained:243,jambless:63,review:193,phys:192});
 assert.ok(changedDefault>=100,'original default-north facade correction lost');
});
const intersect=(a,b)=>[0,1,2].every(i=>a[i]<b[i+3]-1e-6&&a[i+3]>b[i]+1e-6);
test('original Pack3 sculpted arch and Pack4 frames/shutters are NOT safe same-cell overlays on original clear glass in any of four rotations',()=>{
 for(let rot=0;rot<4;rot++){
  const glass=windowShape(159,rot).visible.map(x=>x.bounds);
  const arch=pack3OrnamentalById(121,rot);
  assert.equal(arch.parts.length,13);
  const archCross=arch.parts.reduce((n,p)=>n+glass.filter(g=>intersect(g,p.box)).length,0);
  assert.equal(archCross,24,'decorative arch may not be silently stacked with source clear glazing');
  for(const id of [160,161,162,163,164]){
   const candidate=windowShape(id,rot);
   const cross=candidate.visible.reduce((n,q)=>n+glass.filter(g=>intersect(g,q.bounds)).length,0);
   assert.ok(cross>0,'previous original glass/source window AABB co-occupancy gate changed '+id);
  }
 }
});
test('source original facade plan rejects fake Pack4 geometry, forbidden two-layer combinations and invalid per-device sample budgets',()=>{
 const b=sources[0];
 assert.throws(()=>planD19ExclusiveOriginalWindowGlass(b),/resolver mandatory/);
 for(const o of [{maxPhysicalSamples:999},{maxPhysicalSamples:0},{stainedModulo:2},{stainedModulo:9}])
  assert.throws(()=>planD19ExclusiveOriginalWindowGlass(b,{resolvePack4Asset:pack4BuilderAsset,...o}),/budget/);
 assert.throws(()=>planD19ExclusiveOriginalWindowGlass({...b,creatorApproved:true},{resolvePack4Asset:pack4BuilderAsset}),/theoretical/);
 const fake=(ref,{candidateId,rotation})=>({ref,id:candidateId,rotation:turn[rotation],hasRealPhysicalGeometry:true,registeredInLiveGame:false,
  visible:[],collision:[],selection:[],previewMesh:{stride:10,opaque:new Float32Array(),translucent:new Float32Array()}});
 assert.throws(()=>planD19ExclusiveOriginalWindowGlass(b,{resolvePack4Asset:fake}),/Missing original physical/);
});
