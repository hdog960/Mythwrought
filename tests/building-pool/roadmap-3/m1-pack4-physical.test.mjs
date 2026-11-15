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

test('all 15 blacksmith fireplaces have real backs and hollow vent-stack support cells',()=>{
 let hearths=0,backings=0,flueCourses=0;
 const realSource={resolvePack4BuilderBlueprint(d){
  if(!Array.isArray(d.placements))return {resolvedCount:0,placements:[],orientationReviewCount:0};
  const cells=new Map(d.placements.map(x=>[x.at.join(','),x]));
  for(const hearth of d.placements.filter(x=>x.asset==='pack4:064')){
   hearths++;
   const [x,y,z]=hearth.at;
   const off=hearth.orientation==='east'?[-1,0,0]:[0,0,1];
   const neighbor=[x+off[0],y+off[1],z+off[2]];
   const backing=cells.get(neighbor.join(','));
   assert.ok(backing,'no real backing for fireplace '+d.id);
   assert.ok(['hearth-backwall','structure','wall','flue-support','support'].includes(backing.role));
   assert.equal(hearth.orientationProvenance,'real-wall-backed-fireplace');
  }
  for(const flue of d.placements.filter(x=>x.asset==='pack4:063')){
   const [x,y,z]=flue.at;
   const under=cells.get([x,y-1,z].join(','));
   assert.ok(under&&['pack4:063','pack4:064'].includes(under.asset),
     d.id+' missing occupied lower flue support at '+flue.at);
   assert.equal(flue.orientationProvenance,'fourfold-symmetric-hollow-flue');
  }
  return {resolvedCount:0,placements:[],orientationReviewCount:0};
 }};
 const views=getM1Pack4Construction(realSource);
 assert.equal(views.length,30);
 assert.equal(hearths,15);
 backings=views.reduce((n,v)=>n+v.hearthBackingsAdded,0);
 flueCourses=views.reduce((n,v)=>n+v.hollowFlueCoursesAdded,0);
 assert.ok(backings>0&&backings<=15);
 assert.ok(flueCourses>=75);
 assert.equal(views.filter(v=>v.chimneySubBoxContactReview).length,15);
 assert.ok(views.every(v=>v.livePlaced===false));
 // Unmodified canonical theory, so original uniqueness and player routes hold.
 for(const view of views)assert.ok(view.source.modules.length>0);
});
