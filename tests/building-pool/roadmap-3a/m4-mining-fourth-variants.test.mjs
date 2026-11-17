import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {BIOMES,SIZES,slotId} from '../../../src/building-pool/roadmap-3a/roster.mjs';
import {validateBlueprint,validateAuthoredPool} from '../../../src/building-pool/roadmap-3a/contract.mjs';
import {createLegacyBlacksmithPool} from '../../../src/building-pool/roadmap-3a/legacy-blacksmiths.mjs';
import {geometryFingerprint} from '../../../src/building-pool/roadmap-3a/legacy-validation.mjs';
import {createM1OriginalWorkshopPool} from '../../../src/building-pool/roadmap-3a/m1-workshop-exemplars.mjs';
import {createM1RegionalPool} from '../../../src/building-pool/roadmap-3a/m1-regional-workshops.mjs';
import {createM1CompletionPool} from '../../../src/building-pool/roadmap-3a/m1-coverage-workshops.mjs';
import {createM2MetalworkPool} from '../../../src/building-pool/roadmap-3a/m2-metalwork-second-variants.mjs';
import {createM2ThirdVariantPool} from '../../../src/building-pool/roadmap-3a/m2-metalwork-third-variants.mjs';
import {createM2FourthVariantPool} from '../../../src/building-pool/roadmap-3a/m2-metalwork-fourth-variants.mjs';
import {createM2FifthVariantPool} from '../../../src/building-pool/roadmap-3a/m2-metalwork-fifth-variants.mjs';
import {createM3CraftSecondPool} from '../../../src/building-pool/roadmap-3a/m3-craft-second-variants.mjs';
import {createM3CraftThirdPool} from '../../../src/building-pool/roadmap-3a/m3-craft-third-variants.mjs';
import {createM3CraftFourthPool} from '../../../src/building-pool/roadmap-3a/m3-craft-fourth-variants.mjs';
import {createM3CarpenterFifthPool} from '../../../src/building-pool/roadmap-3a/m3-carpenter-fifth-variants.mjs';
import {createM4MiningSecondPool} from '../../../src/building-pool/roadmap-3a/m4-mining-second-variants.mjs';
import {createM4MiningThirdPool} from '../../../src/building-pool/roadmap-3a/m4-mining-third-variants.mjs';
import {M4_MINING_FOURTH_SPECS,createM4MiningFourthVariant,createM4MiningFourthPool} from '../../../src/building-pool/roadmap-3a/m4-mining-fourth-variants.mjs';
import {createPreviewMesh} from './preview-mesh.mjs';
import {fitPreviewCamera} from './preview-camera.mjs';
const mined=createM4MiningFourthPool(),cells=b=>b.modules.flatMap(m=>m.cells),at=(x,y,z)=>x+','+y+','+z;
function baseline(){
 return [...createLegacyBlacksmithPool(),...createM1OriginalWorkshopPool(),...createM1RegionalPool(),
 ...createM1CompletionPool(),...createM2MetalworkPool(),...createM2ThirdVariantPool(),
 ...createM2FourthVariantPool(),...createM2FifthVariantPool(),...createM3CraftSecondPool(),
 ...createM3CraftThirdPool(),...createM3CraftFourthPool(),...createM3CarpenterFifthPool(),
 ...createM4MiningSecondPool(),...createM4MiningThirdPool()];
}
function exactD4(b){
 const coords=cells(b).map(c=>c.slice(0,3));let smallest=null;
 for(let turn=0;turn<4;turn++)for(const mirror of [false,true]){
  const transformed=coords.map(([x,y,z])=>{
   if(mirror)x=-x;
   for(let i=0;i<turn;i++){const t=-z;z=x;x=t;}
   return [x,y,z];
  });
  const min=[0,1,2].map(i=>Math.min(...transformed.map(c=>c[i])));
  const h=createHash('sha256').update(transformed.map(c=>c.map((v,i)=>v-min[i]).join(',')).sort().join('|')).digest('hex');
  if(smallest===null||h<smallest)smallest=h;
 }
 return smallest;
}
function normalizedFoot(coords){
 const X=Math.min(...coords.map(v=>v[0])),Z=Math.min(...coords.map(v=>v[1]));
 return new Set(coords.map(([x,z])=>(x-X)+','+(z-Z)));
}
function foundation(b){return b.modules.find(m=>m.role==='foundation').cells.map(c=>[c[0],c[2]]);}
function d4FootIoU(a,b){
 const A=normalizedFoot(foundation(a)),B=foundation(b);let best=0;
 for(let r=0;r<4;r++)for(const flip of [false,true]){
  const transformed=B.map(([x,z])=>{
   if(flip)x=-x;
   for(let i=0;i<r;i++){const t=-z;z=x;x=t;}
   return [x,z];
  });
  const M=normalizedFoot(transformed);let hit=0;
  for(const key of A)if(M.has(key))hit++;
  best=Math.max(best,hit/(A.size+M.size-hit));
 }
 return best;
}
test('M4 fourth: 15 independently briefed four-chevron radial mining headhouses, five biomes and three sizes',()=>{
 assert.equal(M4_MINING_FOURTH_SPECS.length,15);
 assert.equal(new Set(M4_MINING_FOURTH_SPECS.map(x=>x.name)).size,15);
 assert.equal(validateAuthoredPool(mined).authored,15);
 for(const biome of BIOMES)for(const size of SIZES){
  const b=createM4MiningFourthVariant(biome,size);
  assert.equal(b.id,slotId('mining-workshop',biome,size,4));
  assert.equal(b.type,'mining-workshop');assert.equal(b.variant,4);
  assert.equal(b.status,'theoretical');assert.equal(b.worldPlaced,false);
  assert.equal(b.productionRegistered,false);
  assert.equal(b.architecture.wingCount,4);
  if(b.size==='large'){
   const filled=new Set(cells(b).map(c=>c.slice(0,3).join(',')));
   // Regress the demonstrated large southeast visual wedge defect using
   // physical authored foundation, not a mock preview image or plan label.
   const s=M4_MINING_FOURTH_SPECS.find(v=>v.biome===b.biome&&v.size===b.size);
   const xCenter=Math.floor(b.envelope.width/2)-1;
   for(const z of [s.southeastZ+1,s.southeastZ+s.southeastLen-2])
    for(let x=xCenter+6;x<=xCenter+20;x++){
     assert.ok(filled.has(at(x,0,z)),b.id+' large southeast annex missing grounded masonry at '+x+','+z);
     assert.ok(filled.has(at(x,1,z)),b.id+' large southeast annex missing real stone deck at '+x+','+z);
    }
   // Real camera projection has screen-right at high X and LOW Z, hence
   // northeast -- the former pointed wing, not the southeast bay above.
   // Require an actual rectangular source foundation, accessible stone
   // deck, roof closure and perimeter masonry at EVERY original north-wing
   // Z, rather than trusting a programme flag or rendered screenshot.
   const sourceEastReach=Math.max(16,s.eastReach+1-(s.northeastLen%3));
   const facadeX=xCenter+6+sourceEastReach;
   const roofs=new Set(b.modules.find(m=>m.role==='roof').cells.map(c=>c[0]+','+c[2]));
   for(let z=s.northeastZ;z<s.northeastZ+s.northeastLen;z++){
    for(let x=xCenter+10;x<=facadeX;x++){
     assert.ok(filled.has(at(x,0,z)),b.id+' far-right camera-facing NE wing floats at '+x+','+z);
     assert.ok(filled.has(at(x,1,z)),b.id+' far-right NE annex has no source deck at '+x+','+z);
     assert.ok(roofs.has(x+','+z),b.id+' roofless far-right NE trading hall '+x+','+z);
    }
    assert.ok(filled.has(at(facadeX,2,z)),b.id+' missing grounded perimeter masonry facade at '+facadeX+','+z);
   }
   // The far-right screen wedge was actually the NORTH grading hall, not
   // the northeast diagonal chevron. Its exposed outer wall must bear the
   // actual roof across every authored north Z. Preserve the deliberate
   // two-wide / three-high aisle aperture at z=3..4, under masonry lintels.
   const northEdgeX=xCenter+17;
   const heightByXZ=new Map(b.modules.find(m=>m.role==='roof').cells
    .map(c=>[c[0]+','+c[2],c[1]]));
   for(let z=2;z<=s.north;z++){
    const roofHeight=heightByXZ.get(northEdgeX+','+z);
    assert.ok(Number.isInteger(roofHeight)&&roofHeight>15,b.id+' north hall roof missing '+z);
    for(let y=2;y<roofHeight;y++){
     if((z===3||z===4)&&y<=5){
      assert.ok(!filled.has(at(northEdgeX,y,z)),b.id+' arcade passage blocked by added masonry');
     }else{
      assert.ok(filled.has(at(northEdgeX,y,z)),b.id+' floating north roof: missing under-roof wall at '+northEdgeX+','+y+','+z);
     }
    }
   }
  }

  assert.equal(b.spaces.length,7);assert.equal(b.navigation.nodes.length,8);
  assert.equal(b.features.length,2);
  assert.ok(cells(b).length>7500,'Not original full 3D source architecture '+b.id);
 }
 assert.throws(()=>createM4MiningFourthVariant('lava','small'),RangeError);
 assert.throws(()=>createM4MiningFourthVariant('mountain','giant'),RangeError);
});
test('all four radial orework chevrons have source floors, hoist posts, mining work roles and genuinely clear 2x3 routes',()=>{
 let authored=0,wagonColumns=0;
 for(const b of mined){
  const filled=new Set(cells(b).map(c=>c.slice(0,3).join(',')));
  assert.equal(validateBlueprint(b).coordinateCells,filled.size);
  assert.equal(cells(b).length,filled.size,'Source overlap forbidden');
  const roles=new Map(b.modules.map(m=>[m.role,m.cells]));
  for(const role of ['foundation','floor','wall','roof','roof-purlin','bearing-pier',
   'ore-wagon-bay-column','stationary-mineral-grade-table','sampling-index-plinth',
   'hoist-tower-post','fixture'])
   assert.ok(roles.has(role),b.id+' missing physical authored '+role);
  for(const route of b.clearances)for(let z=route.z;z<route.z+route.depth;z++)
   for(let x=route.x;x<route.x+route.width;x++){
    assert.ok(filled.has(at(x,1,z)),b.id+' unfloored corridor '+x+','+z);
    for(let y=2;y<=4;y++)assert.ok(!filled.has(at(x,y,z)),b.id+' blocked 2×3 route '+x+','+y+','+z);
   }
  assert.equal(roles.get('fixture').length,2);
  for(const c of roles.get('fixture')){
   assert.equal(c[4].orientation,'north');
   assert.ok(filled.has(at(c[0],1,c[2])),'physical floor for Pack fixture missing');
  }
  // Hoist roof-lightwell must be an actual source-empty 2×2 roof opening,
  // not a claimed architecture flag or a hidden fake cutaway texture.
  const roofPlan=new Set(roles.get('roof').map(c=>c[0]+','+c[2]));
  const mid=Math.floor(b.envelope.width/2)-1,zMid=Math.floor(b.envelope.depth/2);
  for(let x=mid+2;x<=mid+3;x++)for(let z=zMid-1;z<=zMid;z++){
   assert.ok(filled.has(at(x,1,z)),'real hoist skylight requires a grounded source-floor');
   assert.ok(!roofPlan.has(x+','+z),b.id+' hoist skylight is not physically open');
  }
  assert.equal(b.architecture.originalHoistRoofAperture,true);
  assert.equal(b.architecture.radialConnected2WidePasses,true);
  assert.equal(b.architecture.wingCount,4);
  assert.equal(b.architecture.structuralLoadApproved,false);
  assert.equal(b.architecture.weatherApproved,false);
  const tower=roles.get('hoist-tower-post');
  assert.ok(tower.some(c=>c[1]>=22),'hoist gallery must actually rise higher than ore wings');
  authored+=cells(b).length;wagonColumns+=roles.get('ore-wagon-bay-column').length;
 }
 assert.ok(authored>130000);
 assert.ok(wagonColumns>200);
});
test('15 original four-chevron radial workshops have zero missing sampled local bearing witnesses (not engineering span certification)',()=>{
 let n=0,missing=0;
 for(const b of mined){
  const roles=new Map(b.modules.map(m=>[m.role,m.cells]));
  const support=new Set([...roles.get('roof-purlin'),...roles.get('bearing-pier'),...roles.get('wall')]
   .map(c=>c.slice(0,3).join(',')));
  for(let i=0;i<roles.get('roof').length;i+=5){
   const [x,y,z]=roles.get('roof')[i];n++;let seen=false;
   for(let dx=-3;dx<=3&&!seen;dx++)for(let dz=-3;dz<=3&&!seen;dz++)
    if(Math.abs(dx)+Math.abs(dz)<=3)for(let dy=0;dy<=2;dy++)
     if(support.has(at(x+dx,y-dy,z+dz))){seen=true;break;}
   if(!seen)missing++;
  }
 }
 assert.ok(n>5000);assert.equal(missing,0,'local roof support witness regression');
 console.log('M4 fourth genuine-source roof witness count '+n+' missing '+missing);
});
test('all 345 real coordinate-authored Builder 3A blueprints are D4 3D unique, 15 source-original blacksmiths unchanged',()=>{
 const inherited=baseline(),old=createLegacyBlacksmithPool();
 const before=old.map(b=>[b.id,geometryFingerprint(b)]);
 assert.equal(inherited.length,330);
 const all=[...inherited,...mined];assert.equal(all.length,345);
 const seen=new Map(),ids=new Set();
 for(const b of all){
  assert.ok(!ids.has(b.id),'duplicate authored identity '+b.id);ids.add(b.id);
  const fp=exactD4(b);
  assert.ok(!seen.has(fp),'D4 rotated/mirrored full-voxel reskin '+b.id+' / '+seen.get(fp));
  seen.set(fp,b.id);
 }
 assert.deepEqual(createLegacyBlacksmithPool().map(b=>[b.id,geometryFingerprint(b)]),before);
});
test('255 D4-normalized physical-foot IoU scans reject mining variants 1/2/3 and fourth-biome peers <0.94',()=>{
 const earlier=baseline().filter(b=>b.type==='mining-workshop');
 assert.equal(earlier.length,45);
 const ious=[];
 for(const b of mined)for(const p of earlier.filter(x=>x.size===b.size)){
  const iou=d4FootIoU(b,p);
  assert.ok(iou<0.94,b.id+' duplicates older '+p.id+' IoU='+iou);
  ious.push(iou);
 }
 for(let i=0;i<mined.length;i++)for(let j=i+1;j<mined.length;j++)
  if(mined[i].size===mined[j].size){
   const iou=d4FootIoU(mined[i],mined[j]);
   assert.ok(iou<0.94,'fourth mining near-reskin '+mined[i].id+' '+mined[j].id+' IoU='+iou);
   ious.push(iou);
  }
 assert.equal(ious.length,255);
 console.log('M4 fourth physical-source D4 footprint 255 comparisons, max IoU '+Math.max(...ious).toFixed(6));
});
test('345/345 M4 remains draft only; ninety native camera calculations are not real browser screenshots',()=>{
 const all=[...baseline(),...mined],byType=Object.fromEntries(
 ['blacksmith','armorer','carpenter','stonemason','mining-workshop']
 .map(t=>[t,all.filter(b=>b.type===t).length]));
 assert.deepEqual(byType,{blacksmith:75,armorer:75,carpenter:75,stonemason:60,'mining-workshop':60});
 assert.equal(all.length,345);assert.equal(345-all.length,0);
 assert.ok(all.every(b=>b.status==='theoretical'&&!b.activated&&!b.worldPlaced&&!b.productionRegistered));
 let nativeProjectionCount=0;
 for(const b of mined)for(const cutaway of [false,true]){
  const mesh=createPreviewMesh(b,{cutaway});
  assert.equal(mesh.isDiagnosticEnvelope,true);assert.equal(mesh.notAssetShapeProof,true);
  assert.ok(mesh.vertices.length>1000&&mesh.vertices.every(Number.isFinite));
  for(const [w,h] of [[667,375],[844,390],[932,430]]){
   const camera=fitPreviewCamera(b.envelope,mesh.vertices,w,h);
   assert.ok(camera.projectedHalfWidth<1&&camera.projectedHalfHeight<1);
   nativeProjectionCount++;
  }
 }
 assert.equal(nativeProjectionCount,90);
});
