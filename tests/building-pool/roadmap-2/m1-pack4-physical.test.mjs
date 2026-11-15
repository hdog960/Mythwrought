import test from 'node:test';
import assert from 'node:assert/strict';
import {getM1Pack4Construction,PACK4_CONSTRUCTION_SOURCE} from '../../../src/building-pool/roadmap-2/m1-pack4-physical.mjs';
const pseudo=Object.freeze({
  resolvePack4BuilderBlueprint(blueprint){
    const id=blueprint.id;
    return {blueprintId:id,resolvedCount:0,placements:[],orientationReviewCount:0};
  }
});
test('builder lane consumes an explicit physical Pack 4 adapter, never a symbolic-only implicit fallback',()=>{
 assert.throws(()=>getM1Pack4Construction(),/resolver required/);
 assert.throws(()=>getM1Pack4Construction({resolvePack4BuilderBlueprint(){return null}},{blueprints:[{id:'x'}]}),/invalid physical plan/);
 assert.equal(PACK4_CONSTRUCTION_SOURCE.pr,115);
 assert.equal(PACK4_CONSTRUCTION_SOURCE.variantCount,23);
 assert.equal(PACK4_CONSTRUCTION_SOURCE.productionRegistry,false);
});
test('all authored M1 roadmaps are routed through an explicit opt-in physical construction view',()=>{
 const rows=getM1Pack4Construction(pseudo);
 assert.equal(rows.length,30);
 assert.ok(rows.every(row=>row.physicalPlan.resolvedCount===0&&row.livePlaced===false));
 assert.equal(new Set(rows.map(x=>x.blueprintId)).size,30);
});
test('rejects fake shape records that lack the actual collision, selection or rendering mesh',()=>{
 const broken={resolvePack4BuilderBlueprint(){return {
  resolvedCount:1,placements:[{productionPlacement:false,
   physical:{hasRealPhysicalGeometry:true,visible:[{bounds:[0,0,0,1,1,1]}],
    collision:[],selection:[],previewMesh:{opaque:new Float32Array(),translucent:new Float32Array()}}}]
 }}};
 assert.throws(()=>getM1Pack4Construction(broken,{blueprints:[{id:'probe'}]}),/Physical Pack 4 candidate unavailable/);
});

test('unsupported elevated floor lanterns are never silently accepted; wall-backed opt-in sconces are source-preserving',()=>{
 let transformed=0,seen=0;
 const fake={resolvePack4BuilderBlueprint(b){
  const rows=b.placements??[];
  for(const p of rows.filter(p=>p.physicalAlternative)){
   seen++;
   assert.equal(p.asset,'pack4:036');
   assert.ok(['east','west','north','south'].includes(p.orientation));
  }
  return {resolvedCount:0,placements:[],orientationReviewCount:0};
 }};
 const designs=getM1Pack4Construction(fake);
 for(const d of designs){
  transformed+=d.physicalLanternAlternatives.length;
  for(const a of d.physicalLanternAlternatives){
   assert.notDeepEqual(a.supportRef,'pack4:037');
   assert.equal(a.requiresCreatorArtReview,true);
   const positions=new Set(d.source.voxels.map(v=>[v.x,v.y,v.z].join(',')));
   assert.ok(positions.has(a.from.join(',')));
  }
 }
 assert.ok(transformed>0,'builder geometry must repair at least one actual floating lantern');
 assert.equal(seen,transformed);
});
