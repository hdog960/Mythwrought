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
import {M4_MINING_THIRD_SPECS,createM4MiningThirdVariant,createM4MiningThirdPool} from '../../../src/building-pool/roadmap-3a/m4-mining-third-variants.mjs';
import {createPreviewMesh} from './preview-mesh.mjs';
import {fitPreviewCamera} from './preview-camera.mjs';
const mined=createM4MiningThirdPool(),cells=b=>b.modules.flatMap(m=>m.cells),at=(x,y,z)=>x+','+y+','+z;
function baseline(){
 return [...createLegacyBlacksmithPool(),...createM1OriginalWorkshopPool(),...createM1RegionalPool(),
 ...createM1CompletionPool(),...createM2MetalworkPool(),...createM2ThirdVariantPool(),
 ...createM2FourthVariantPool(),...createM2FifthVariantPool(),...createM3CraftSecondPool(),
 ...createM3CraftThirdPool(),...createM3CraftFourthPool(),...createM3CarpenterFifthPool(),
 ...createM4MiningSecondPool()];
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
test('M4 third: 15 independently briefed source-assigned physical mining pit forums, five biomes and three sizes',()=>{
 assert.equal(M4_MINING_THIRD_SPECS.length,15);
 assert.equal(new Set(M4_MINING_THIRD_SPECS.map(x=>x.name)).size,15);
 assert.equal(validateAuthoredPool(mined).authored,15);
 for(const biome of BIOMES)for(const size of SIZES){
  const b=createM4MiningThirdVariant(biome,size);
  assert.equal(b.id,slotId('mining-workshop',biome,size,3));
  assert.equal(b.type,'mining-workshop');assert.equal(b.variant,3);
  assert.equal(b.status,'theoretical');assert.equal(b.worldPlaced,false);
  assert.equal(b.productionRegistered,false);
  assert.equal(b.architecture.trueUnroofedCourtCount,2);
  assert.equal(b.spaces.length,6);assert.equal(b.navigation.nodes.length,7);
  assert.equal(b.features.length,2);
  assert.ok(cells(b).length>8000,'Not original full 3D source architecture '+b.id);
 }
 assert.throws(()=>createM4MiningThirdVariant('lava','small'),RangeError);
 assert.throws(()=>createM4MiningThirdVariant('mountain','giant'),RangeError);
});
test('all genuine ring and pit bridges have physically empty courtyard voids, support cells and 2x3 clear circulation',()=>{
 let actualVoids=0;
 for(const b of mined){
  const occupied=new Set(cells(b).map(c=>c.slice(0,3).join(',')));
  assert.equal(validateBlueprint(b).coordinateCells,occupied.size);
  assert.equal(cells(b).length,occupied.size,'duplicate authored voxel');
  const roles=new Map(b.modules.map(m=>[m.role,m.cells]));
  for(const role of ['foundation','floor','wall','roof','roof-purlin','bearing-pier',
   'ore-quarantine-rack','hand-ore-grading-stand','cold-quartz-register','fixture'])
    assert.ok(roles.has(role),b.id+' missing genuine sourced role '+role);
  for(const c of b.clearances)for(let z=c.z;z<c.z+c.depth;z++)
   for(let x=c.x;x<c.x+c.width;x++){
    assert.ok(occupied.has(at(x,1,z)),b.id+' missing full floor '+x+','+z);
    for(let y=2;y<=4;y++)
     assert.ok(!occupied.has(at(x,y,z)),b.id+' occluded 2x3 source passage '+x+','+y+','+z);
   }
  const roof=new Set(roles.get('roof').map(c=>c[0]+','+c[2]));
  for(const [X,Z,W,D] of [b.architecture.originalWestCourt,b.architecture.originalEastCourt]){
   let voidCount=0,bridgeCount=0;
   for(let x=X;x<X+W;x++)for(let z=Z;z<Z+D;z++){
    if(!occupied.has(at(x,1,z)))voidCount++;
    else if(!roof.has(x+','+z))bridgeCount++;
   }
   assert.ok(voidCount>=25,'court needs genuine non-floor excavated source '+b.id);
   assert.ok(bridgeCount>=8,'pit bridge must be physically present and open to sky '+b.id);
   actualVoids+=voidCount;
  }
  assert.equal(roles.get('fixture').length,2);
  for(const c of roles.get('fixture')){
   assert.equal(c[4].orientation,'north');
   assert.ok(occupied.has(at(c[0],1,c[2])),'source fixture must stand on real floor');
  }
  assert.equal(b.architecture.structuralLoadApproved,false);
  assert.equal(b.architecture.weatherApproved,false);
 }
 assert.ok(actualVoids>3500);
});
test('15 mine double courts have zero missing sampled local bearing witnesses (not engineering span certification)',()=>{
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
 assert.ok(n>7000);assert.equal(missing,0,'local roof support witness regression');
 console.log('M4 third genuine-source roof witness count '+n+' missing '+missing);
});
test('all 330 real coordinate-authored Builder 3A blueprints are D4 3D unique, 15 source-original blacksmiths unchanged',()=>{
 const inherited=baseline(),old=createLegacyBlacksmithPool();
 const before=old.map(b=>[b.id,geometryFingerprint(b)]);
 assert.equal(inherited.length,315);
 const all=[...inherited,...mined];assert.equal(all.length,330);
 const seen=new Map(),ids=new Set();
 for(const b of all){
  assert.ok(!ids.has(b.id),'duplicate authored identity '+b.id);ids.add(b.id);
  const fp=exactD4(b);
  assert.ok(!seen.has(fp),'D4 rotated/mirrored full-voxel reskin '+b.id+' / '+seen.get(fp));
  seen.set(fp,b.id);
 }
 assert.deepEqual(createLegacyBlacksmithPool().map(b=>[b.id,geometryFingerprint(b)]),before);
});
test('180 D4-normalized physical-foot IoU scans reject reused mining first/second and third-variant peers <0.94',()=>{
 const earlier=baseline().filter(b=>b.type==='mining-workshop');
 assert.equal(earlier.length,30);
 const ious=[];
 for(const b of mined)for(const p of earlier.filter(x=>x.size===b.size)){
  const iou=d4FootIoU(b,p);
  assert.ok(iou<0.94,b.id+' duplicates older '+p.id+' IoU='+iou);
  ious.push(iou);
 }
 for(let i=0;i<mined.length;i++)for(let j=i+1;j<mined.length;j++)
  if(mined[i].size===mined[j].size){
   const iou=d4FootIoU(mined[i],mined[j]);
   assert.ok(iou<0.94,'third mining near-reskin '+mined[i].id+' '+mined[j].id+' IoU='+iou);
   ious.push(iou);
  }
 assert.equal(ious.length,180);
 console.log('M4 third physical-source D4 footprint 180 comparisons, max IoU '+Math.max(...ious).toFixed(6));
});
test('330/345 M4 remains draft only; ninety native camera calculations are not real browser screenshots',()=>{
 const all=[...baseline(),...mined],byType=Object.fromEntries(
 ['blacksmith','armorer','carpenter','stonemason','mining-workshop']
 .map(t=>[t,all.filter(b=>b.type===t).length]));
 assert.deepEqual(byType,{blacksmith:75,armorer:75,carpenter:75,stonemason:60,'mining-workshop':45});
 assert.equal(all.length,330);assert.equal(345-all.length,15);
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
