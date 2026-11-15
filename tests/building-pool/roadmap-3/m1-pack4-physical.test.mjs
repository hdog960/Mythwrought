import test from 'node:test';
import assert from 'node:assert/strict';
import {getM1Pack4Construction,PACK4_CONSTRUCTION_SOURCE} from '../../../src/building-pool/roadmap-3/m1-pack4-physical.mjs';
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

test('only real authored west-wall backing allows a fireplace to rotate east',()=>{
 let anchored=0,unanchored=0;
 const proxy={resolvePack4BuilderBlueprint(b){
  const cells=new Map(b.placements.map(p=>[p.at.join(','),p]));
  for(const p of b.placements.filter(p=>p.asset==='pack4:064')){
   if(p.orientationProvenance==='supported-wall-sidecar'){
    anchored++;
    assert.equal(p.orientation,'east');
    assert.ok(['structure','wall','flue-support','support'].includes(
     cells.get([p.at[0]-1,p.at[1],p.at[2]].join(','))?.role));
   }else{
    unanchored++;assert.equal(p.orientation,'north');
    assert.equal(p.orientationProvenance,'default-preview-only');
   }
  }
  return {resolvedCount:0,placements:[],orientationReviewCount:0};
 }};
 getM1Pack4Construction(proxy);
 assert.equal(anchored+unanchored,15);
 assert.ok(anchored>=1&&unanchored>=1);
});
