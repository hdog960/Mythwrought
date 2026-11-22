import test from 'node:test';
import assert from 'node:assert/strict';
import {getM1Pack4Construction,PACK4_CONSTRUCTION_SOURCE} from '../../../src/building-pool/roadmap-1/m1-pack4-physical.mjs';
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
 assert.equal(rows.length,45);
 assert.ok(rows.every(row=>row.physicalPlan.resolvedCount===0&&row.livePlaced===false));
 assert.equal(new Set(rows.map(x=>x.blueprintId)).size,45);
});
test('rejects fake shape records that lack the actual collision, selection or rendering mesh',()=>{
 const broken={resolvePack4BuilderBlueprint(){return {
  resolvedCount:1,placements:[{productionPlacement:false,
   physical:{hasRealPhysicalGeometry:true,visible:[{bounds:[0,0,0,1,1,1]}],
    collision:[],selection:[],previewMesh:{opaque:new Float32Array(),translucent:new Float32Array()}}}]
 }}};
 assert.throws(()=>getM1Pack4Construction(broken,{blueprints:[{id:'probe'}]}),/Physical Pack 4 candidate unavailable/);
});

test('fifteen fireplaces turn toward their exact existing west wall instead of missing +Z mounting',()=>{
 let corrected=0;
 const adapter={resolvePack4BuilderBlueprint(b){
  const cells=new Map(b.placements.map(p=>[p.at.join(','),p]));
  for(const p of b.placements.filter(p=>p.asset==='pack4:064')){
   corrected++;
   assert.equal(p.orientation,'east');
   assert.equal(p.orientationProvenance,'supported-wall-sidecar');
   const backing=[p.at[0]-1,p.at[1],p.at[2]].join(',');
   assert.ok(['wall','partition'].includes(cells.get(backing)?.role),
    'fireplace needs an authored wall or solid partition backing');
  }
  return {resolvedCount:0,placements:[],orientationReviewCount:0};
 }};
 getM1Pack4Construction(adapter);
 assert.equal(corrected,15);
});

test('all twenty-one four-sided hollow chimneys receive real symmetry-aware construction yaw',()=>{
 let chimney=0;
 const resolver={resolvePack4BuilderBlueprint(draft){
  for(const p of draft.placements??[]){
   if(p.asset==='pack4:063'){
    chimney++;
    assert.equal(p.orientation,'north');
    assert.equal(p.orientationProvenance,'fourfold-symmetric-hollow-flue');
   }
  }
  return {resolvedCount:0,placements:[],orientationReviewCount:0};
 }};
 getM1Pack4Construction(resolver);
 assert.equal(chimney,21);
});
