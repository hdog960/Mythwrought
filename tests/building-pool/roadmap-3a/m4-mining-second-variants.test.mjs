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
import {M4_MINING_SECOND_SPECS,createM4MiningSecondPool,createM4MiningSecondVariant} from '../../../src/building-pool/roadmap-3a/m4-mining-second-variants.mjs';
import {createPreviewMesh} from './preview-mesh.mjs';
import {fitPreviewCamera} from './preview-camera.mjs';

const fresh=createM4MiningSecondPool(),cells=b=>b.modules.flatMap(m=>m.cells),
 key=(x,y,z)=>[x,y,z].join(',');
function inherited(){
 return [...createLegacyBlacksmithPool(),...createM1OriginalWorkshopPool(),
 ...createM1RegionalPool(),...createM1CompletionPool(),...createM2MetalworkPool(),
 ...createM2ThirdVariantPool(),...createM2FourthVariantPool(),...createM2FifthVariantPool(),
 ...createM3CraftSecondPool(),...createM3CraftThirdPool(),...createM3CraftFourthPool(),
 ...createM3CarpenterFifthPool()];
}
function d4Hash(b){
 const xyz=cells(b).map(c=>c.slice(0,3));let smallest=null;
 for(let rot=0;rot<4;rot++)for(const flip of [false,true]){
  const transformed=xyz.map(([x,y,z])=>{
   if(flip)x=-x;
   for(let j=0;j<rot;j++){const v=-z;z=x;x=v;}
   return [x,y,z];
  });
  const min=[0,1,2].map(i=>Math.min(...transformed.map(p=>p[i])));
  const hash=createHash('sha256').update(transformed.map(p=>p.map((v,i)=>v-min[i]).join(',')).sort().join('|')).digest('hex');
  if(smallest===null||hash<smallest)smallest=hash;
 }
 return smallest;
}
function normalizedMask(coords){
 const x0=Math.min(...coords.map(v=>v[0])),z0=Math.min(...coords.map(v=>v[1]));
 return new Set(coords.map(([x,z])=>[x-x0,z-z0].join(',')));
}
function foundation(b){return b.modules.find(m=>m.role==='foundation').cells.map(c=>[c[0],c[2]]);}
function d4IoU(a,b){
 const A=normalizedMask(foundation(a)),B=foundation(b);let best=0;
 for(let r=0;r<4;r++)for(const mirror of [false,true]){
  const transformed=B.map(([x,z])=>{
   if(mirror)x=-x;
   for(let k=0;k<r;k++){const t=-z;z=x;x=t;}
   return [x,z];
  });
  const M=normalizedMask(transformed);let hits=0;
  for(const v of A)if(M.has(v))hits++;
  best=Math.max(best,hits/(A.size+M.size-hits));
 }
 return best;
}
test('M4 exactly 15 genuinely sourced second-variant pithead mine workshop designs span all 5 biomes and 3 sizes',()=>{
 assert.equal(M4_MINING_SECOND_SPECS.length,15);
 assert.equal(new Set(M4_MINING_SECOND_SPECS.map(q=>q.name)).size,15);
 assert.equal(validateAuthoredPool(fresh).authored,15);
 for(const biome of BIOMES)for(const size of SIZES){
  const b=createM4MiningSecondVariant(biome,size);
  assert.equal(b.id,slotId('mining-workshop',biome,size,2));
  assert.equal(b.status,'theoretical');assert.equal(b.activated,false);
  assert.equal(b.worldPlaced,false);assert.equal(b.productionRegistered,false);
  assert.equal(b.architecture.physicalOreProcessingFingers,5);
  assert.equal(b.spaces.length,7);assert.equal(b.navigation.nodes.length,8);
  assert.equal(b.features.length,2);
  assert.ok(cells(b).length>5000,'Not acceptable: a metadata-only mining blueprint');
 }
 assert.throws(()=>createM4MiningSecondVariant('lava','small'),RangeError);
 assert.throws(()=>createM4MiningSecondVariant('mountain','gigantic'),RangeError);
});
test('15 original ore houses possess actual physical foundations, distinct cold workplaces, producer fixtures and two-wide / three-high source walks',()=>{
 for(const b of fresh){
  const occupied=new Set(cells(b).map(c=>c.slice(0,3).join(',')));
  assert.equal(validateBlueprint(b).coordinateCells,occupied.size,b.id);
  assert.equal(cells(b).length,occupied.size,b.id+' occupies a voxel twice');
  const roles=new Map(b.modules.map(m=>[m.role,m.cells]));
  for(const role of ['foundation','floor','wall','roof','roof-purlin','bearing-pier',
    'ore-tram-spur-support','raw-mineral-sorting-post','cold-tailings-rack',
    'hand-sample-grading-plinth','mineral-weighing-stand','fixture'])
   assert.ok(roles.has(role),b.id+' missing authored mining activity '+role);
  for(const p of b.clearances)for(let x=p.x;x<p.x+p.width;x++)for(let z=p.z;z<p.z+p.depth;z++){
   assert.ok(occupied.has(key(x,1,z)),b.id+' missing source floor '+x+','+z);
   for(let y=2;y<=4;y++)assert.ok(!occupied.has(key(x,y,z)),b.id+' mining route blocked '+x+','+y+','+z);
  }
  assert.equal(roles.get('fixture').length,2);
  assert.ok(roles.get('fixture').some(c=>c[3]==='pack4:057'));
  assert.ok(roles.get('fixture').some(c=>c[3]==='pack1:007'));
  for(const c of roles.get('fixture')){
   assert.equal(c.length,5);assert.equal(c[4].orientation,'north');
   assert.ok(occupied.has(key(c[0],1,c[2])),b.id+' fixture lacks physical standing floor');
  }
  assert.equal(b.architecture.structuralLoadApproved,false);
  assert.equal(b.architecture.weatherApproved,false);
 }
});
test('every M4 source roof has nearby actual bearing witness, without claiming engineered load capacity',()=>{
 let samples=0,missing=0;
 for(const b of fresh){
  const roles=new Map(b.modules.map(m=>[m.role,m.cells]));
  const bearing=new Set([...roles.get('roof-purlin'),...roles.get('wall'),...roles.get('bearing-pier')]
   .map(c=>c.slice(0,3).join(',')));
  for(let i=0;i<roles.get('roof').length;i+=5){
   const [x,y,z]=roles.get('roof')[i];samples++;let seen=false;
   for(let dx=-3;dx<=3&&!seen;dx++)for(let dz=-3;dz<=3&&!seen;dz++){
    if(Math.abs(dx)+Math.abs(dz)>3)continue;
    for(let dy=0;dy<=2;dy++)if(bearing.has(key(x+dx,y-dy,z+dz))){seen=true;break;}
   }
   if(!seen)missing++;
  }
 }
 assert.ok(samples>3900);
 assert.equal(missing,0);
 console.log('M4 second source roof positions '+samples+' nearby bearing warnings '+missing);
});
test('315 total original 3A authored models have globally unique full-voxel D4 forms and original legacy blacksmiths unchanged',()=>{
 const originals=createLegacyBlacksmithPool(),before=originals.map(b=>[b.id,geometryFingerprint(b)]);
 const all=[...inherited(),...fresh],seen=new Map(),ids=new Set();
 assert.equal(all.length,315);
 for(const b of all){
  assert.ok(!ids.has(b.id),'duplicated reserved identity '+b.id);ids.add(b.id);
  const fp=d4Hash(b);
  assert.ok(!seen.has(fp),'D4 mirrored/rotated full 3D duplicate '+b.id+' '+seen.get(fp));
  seen.set(fp,b.id);
 }
 assert.deepEqual(createLegacyBlacksmithPool().map(b=>[b.id,geometryFingerprint(b)]),before);
});
test('true ground-cell D4 IoU rejects mining second reskins against original mining and across same size/biomes, <0.94',()=>{
 const original=inherited().filter(x=>x.type==='mining-workshop'&&x.variant===1),pairs=[];
 assert.equal(original.length,15);
 for(const current of fresh)for(const other of original.filter(x=>x.size===current.size)){
  const similarity=d4IoU(current,other);
  assert.ok(similarity<0.94,current.id+' resembles prior mining '+other.id+' IoU '+similarity);
  pairs.push(similarity);
 }
 for(let i=0;i<fresh.length;i++)for(let j=i+1;j<fresh.length;j++)
  if(fresh[i].size===fresh[j].size){
   const similarity=d4IoU(fresh[i],fresh[j]);
   assert.ok(similarity<0.94,'mining M4 copies across biomes '+fresh[i].id+' '+fresh[j].id+' '+similarity);
   pairs.push(similarity);
  }
 assert.equal(pairs.length,105);
 console.log('M4 second mining exact physical ground D4 105 comparisons, highest IoU',Math.max(...pairs));
});
test('new source inventory 315/345 = 30 still unauthored; only 90 native projections, not pretend Chromium screenshots',()=>{
 const all=[...inherited(),...fresh];
 const byType=Object.fromEntries(['blacksmith','armorer','carpenter','stonemason','mining-workshop']
  .map(type=>[type,all.filter(b=>b.type===type).length]));
 assert.deepEqual(byType,{blacksmith:75,armorer:75,carpenter:75,stonemason:60,'mining-workshop':30});
 assert.equal(all.length,315);assert.equal(345-all.length,30);
 assert.ok(all.every(b=>b.status==='theoretical'&&!b.activated&&!b.worldPlaced&&!b.productionRegistered));
 let projections=0;
 for(const b of fresh)for(const cutaway of [false,true]){
  const m=createPreviewMesh(b,{cutaway});
  assert.equal(m.isDiagnosticEnvelope,true);
  assert.equal(m.notAssetShapeProof,true);
  assert.ok(m.vertices.length>1000&&m.vertices.every(Number.isFinite));
  for(const [w,h] of [[667,375],[844,390],[932,430]]){
   const c=fitPreviewCamera(b.envelope,m.vertices,w,h);
   assert.ok(c.projectedHalfWidth<1&&c.projectedHalfHeight<1);
   projections++;
  }
 }
 assert.equal(projections,90);
});
