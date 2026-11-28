import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {BIOMES,SIZES,slotId} from '../../../src/building-pool/roadmap-3a/roster.mjs';
import {validateAuthoredPool,validateBlueprint} from '../../../src/building-pool/roadmap-3a/contract.mjs';
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
import {M3_CARPENTER_FIFTH_SPECS,createM3CarpenterFifthPool,createM3CarpenterFifthVariant} from '../../../src/building-pool/roadmap-3a/m3-carpenter-fifth-variants.mjs';
import {createPreviewMesh} from './preview-mesh.mjs';
import {fitPreviewCamera} from './preview-camera.mjs';

const newModels=createM3CarpenterFifthPool(),flat=b=>b.modules.flatMap(m=>m.cells);
const k=(x,y,z)=>[x,y,z].join(',');
function oldModels(){
 return [...createLegacyBlacksmithPool(),...createM1OriginalWorkshopPool(),...createM1RegionalPool(),...createM1CompletionPool(),
 ...createM2MetalworkPool(),...createM2ThirdVariantPool(),...createM2FourthVariantPool(),...createM2FifthVariantPool(),
 ...createM3CraftSecondPool(),...createM3CraftThirdPool(),...createM3CraftFourthPool()];
}
function d4Hash(b){
 const xyz=flat(b).map(c=>c.slice(0,3));let smallest=null;
 for(let rot=0;rot<4;rot++)for(const flip of [false,true]){
  const a=xyz.map(([x,y,z])=>{if(flip)x=-x;for(let i=0;i<rot;i++){const t=-z;z=x;x=t;}return [x,y,z];});
  const min=[0,1,2].map(i=>Math.min(...a.map(v=>v[i])));
  const hash=createHash('sha256').update(a.map(v=>v.map((n,i)=>n-min[i]).join(',')).sort().join('|')).digest('hex');
  if(smallest===null||hash<smallest)smallest=hash;
 }
 return smallest;
}
function footprint(b){
 const a=b.modules.find(m=>m.role==='foundation').cells.map(c=>[c[0],c[2]]);
 const x0=Math.min(...a.map(v=>v[0])),z0=Math.min(...a.map(v=>v[1]));
 return a.map(([x,z])=>[x-x0,z-z0]);
}
function d4IoU(a,b){
 const A=new Set(footprint(a).map(v=>v.join(','))),B=footprint(b);let best=0;
 for(let rot=0;rot<4;rot++)for(const mirror of [false,true]){
  const T=B.map(([x,z])=>{if(mirror)x=-x;for(let i=0;i<rot;i++){let t=-z;z=x;x=t;}return [x,z];});
  const mx=Math.min(...T.map(v=>v[0])),mz=Math.min(...T.map(v=>v[1]));
  const F=new Set(T.map(([x,z])=>[x-mx,z-mz].join(',')));
  let common=0;for(const v of A)if(F.has(v))common++;
  best=Math.max(best,common/(A.size+F.size-common));
 }
 return best;
}
test('M3 carpenter fifth covers 15 owned category/biome/size slots with 15 unique physical briefs',()=>{
 assert.equal(M3_CARPENTER_FIFTH_SPECS.length,15);
 assert.equal(new Set(M3_CARPENTER_FIFTH_SPECS.map(s=>s.name)).size,15);
 assert.equal(validateAuthoredPool(newModels).authored,15);
 for(const biome of BIOMES)for(const size of SIZES){
  const b=createM3CarpenterFifthVariant(biome,size);
  assert.equal(b.id,slotId('carpenter',biome,size,5));
  assert.equal(b.architecture.fiveDistinctWorkFingers,5);
  assert.equal(b.spaces.length,7);
  assert.equal(b.navigation.nodes.length,8);
  assert.equal(b.features.length,2);
  assert.equal(b.status,'theoretical');
  assert.equal(b.worldPlaced,false);assert.equal(b.productionRegistered,false);
  assert.ok(flat(b).length>5000,b.id);
 }
 assert.throws(()=>createM3CarpenterFifthVariant('bog','medium'),RangeError);
});
test('every independently authored five-finger sawmill has real 2x3 connected carpenter routes, roofs and fixtures',()=>{
 for(const b of newModels){
  const occ=new Set(flat(b).map(c=>c.slice(0,3).join(',')));
  assert.equal(validateBlueprint(b).coordinateCells,occ.size);
  assert.equal(flat(b).length,occ.size);
  const roles=new Map(b.modules.map(m=>[m.role,m.cells]));
  for(const role of ['foundation','floor','wall','roof','roof-purlin','bearing-pier','fixture',
    'hand-ripsaw-support','seasoning-gantry','frame-squaring-station','mortise-template-bench','fine-joinery-block'])
   assert.ok(roles.has(role),b.id+' missing physically authored '+role);
  for(const clearance of b.clearances){
   for(let x=clearance.x;x<clearance.x+clearance.width;x++)
    for(let z=clearance.z;z<clearance.z+clearance.depth;z++){
     assert.ok(occ.has(k(x,1,z)),b.id+' missing deck '+x+','+z);
     for(let y=2;y<=4;y++)assert.ok(!occ.has(k(x,y,z)),b.id+' blocked walking '+x+','+y+','+z);
    }
  }
  for(const fixture of roles.get('fixture')){
   assert.equal(fixture[4].orientation,'north');
   assert.ok(occ.has(k(fixture[0],1,fixture[2])),'no physical producer fixture supporting floor');
  }
  assert.equal(b.architecture.structuralLoadApproved,false);
  assert.equal(b.architecture.weatherApproved,false);
 }
});
test('all five-finger carpenters have actual adjacent roof-bearing witnesses without replacing engineering acceptance',()=>{
 let total=0,missing=0;
 for(const b of newModels){
  const roles=new Map(b.modules.map(m=>[m.role,m.cells]));
  const supports=new Set([...roles.get('roof-purlin'),...roles.get('wall'),...roles.get('bearing-pier')]
   .map(c=>k(...c.slice(0,3))));
  for(let i=0;i<roles.get('roof').length;i+=5){
   const [x,y,z]=roles.get('roof')[i];total++;let good=false;
   for(let dx=-3;dx<=3&&!good;dx++)for(let dz=-3;dz<=3&&!good;dz++)
    if(Math.abs(dx)+Math.abs(dz)<=3)for(let dy=0;dy<=2;dy++)
     if(supports.has(k(x+dx,y-dy,z+dz))){good=true;break;}
   if(!good)missing++;
  }
 }
 assert.ok(total>4000);
 assert.equal(missing,0,'fifth-variant roof bearing witness regression');
});
test('D4 full voxel signatures of 300 source blueprints unique; legacy PR122 originals remain intact',()=>{
 const legacy=createLegacyBlacksmithPool(),before=legacy.map(b=>[b.id,geometryFingerprint(b)]);
 const all=[...oldModels(),...newModels],seen=new Map(),ids=new Set();
 assert.equal(all.length,300);
 for(const b of all){
  assert.ok(!ids.has(b.id),'duplicate ID '+b.id);ids.add(b.id);
  const hash=d4Hash(b);
  assert.ok(!seen.has(hash),'D4 mirrored/rotated copy '+b.id+' vs '+seen.get(hash));
  seen.set(hash,b.id);
 }
 assert.deepEqual(createLegacyBlacksmithPool().map(b=>[b.id,geometryFingerprint(b)]),before);
});
test('five-finger floorplates reject near-reskins of every former M3 carpentry type and inter-biome peers',()=>{
 const prior=[...createM3CraftSecondPool(),...createM3CraftThirdPool(),...createM3CraftFourthPool()]
  .filter(b=>b.type==='carpenter');
 const comparisons=[];
 for(const b of newModels)for(const p of prior)if(b.size===p.size){
  const iou=d4IoU(b,p);
  assert.ok(iou<0.94,'near-duplicate carpenter geometry '+b.id+' '+p.id+' '+iou);
  comparisons.push(iou);
 }
 for(let i=0;i<newModels.length;i++)for(let j=i+1;j<newModels.length;j++)
  if(newModels[i].size===newModels[j].size){
   const iou=d4IoU(newModels[i],newModels[j]);
   assert.ok(iou<0.94,'near-duplicate fifth carpenter '+newModels[i].id+' '+newModels[j].id+' '+iou);
   comparisons.push(iou);
  }
 assert.equal(comparisons.length,255);
 console.log('M3 fifth carpenter physical D4 IoU pairs',comparisons.length,'peak',Math.max(...comparisons));
});
test('M3 300/345 candidate census is strictly theoretical; native camera projection does not fake WebGL2 capture',()=>{
 const all=[...oldModels(),...newModels],counts=Object.fromEntries(
 ['blacksmith','armorer','carpenter','stonemason','mining-workshop']
 .map(t=>[t,all.filter(b=>b.type===t).length]));
 assert.deepEqual(counts,{blacksmith:75,armorer:75,carpenter:75,stonemason:60,'mining-workshop':15});
 assert.equal(345-all.length,45);
 assert.ok(all.every(b=>b.status==='theoretical'&&!b.activated&&!b.productionRegistered&&!b.worldPlaced));
 let projections=0;
 for(const b of newModels)for(const cutaway of [false,true]){
  const mesh=createPreviewMesh(b,{cutaway});
  assert.ok(mesh.vertices.length>1000&&mesh.vertices.every(Number.isFinite));
  assert.equal(mesh.isDiagnosticEnvelope,true);
  for(const [w,h] of [[667,375],[844,390],[932,430]]){
   const camera=fitPreviewCamera(b.envelope,mesh.vertices,w,h);
   assert.ok(camera.projectedHalfWidth<1&&camera.projectedHalfHeight<1);
   projections++;
  }
 }
 assert.equal(projections,90);
});
