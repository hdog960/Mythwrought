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
import {M3_CRAFT_FOURTH_SPECS,createM3CraftFourthPool,createM3CraftFourthVariant} from '../../../src/building-pool/roadmap-3a/m3-craft-fourth-variants.mjs';
import {createPreviewMesh} from './preview-mesh.mjs';
import {fitPreviewCamera} from './preview-camera.mjs';

const fourth=createM3CraftFourthPool();
const cells=b=>b.modules.flatMap(m=>m.cells);
const key=(x,y,z)=>x+','+y+','+z;
const placed=b=>new Set(cells(b).map(c=>key(c[0],c[1],c[2])));
function oldModels(){
 return [...createLegacyBlacksmithPool(),...createM1OriginalWorkshopPool(),
 ...createM1RegionalPool(),...createM1CompletionPool(),...createM2MetalworkPool(),
 ...createM2ThirdVariantPool(),...createM2FourthVariantPool(),...createM2FifthVariantPool(),
 ...createM3CraftSecondPool(),...createM3CraftThirdPool()];
}
function d4Shape(b){
 const xyz=cells(b).map(c=>c.slice(0,3));let minimum=null;
 for(let rot=0;rot<4;rot++)for(const mirror of [false,true]){
  const positions=xyz.map(([x,y,z])=>{
   if(mirror)x=-x;
   for(let i=0;i<rot;i++){const t=-z;z=x;x=t;}
   return [x,y,z];
  });
  const min=[0,1,2].map(i=>Math.min(...positions.map(p=>p[i])));
  const hash=createHash('sha256').update(positions.map(p=>p.map((v,i)=>v-min[i]).join(',')).sort().join('|')).digest('hex');
  if(minimum===null||hash<minimum)minimum=hash;
 }
 return minimum;
}
function ground(b){
 return b.modules.find(m=>m.role==='foundation').cells.map(([x,y,z])=>[x,z]);
}
function d4FootprintIoU(a,b){
 const A=ground(a),B=ground(b);
 const aaX=Math.min(...A.map(v=>v[0])),aaZ=Math.min(...A.map(v=>v[1]));
 const aa=new Set(A.map(([x,z])=>(x-aaX)+','+(z-aaZ)));
 let best=0;
 for(let rot=0;rot<4;rot++)for(const mirror of [false,true]){
  const p=B.map(([x,z])=>{
   if(mirror)x=-x;
   for(let k=0;k<rot;k++){const t=-z;z=x;x=t;}
   return [x,z];
  });
  const mx=Math.min(...p.map(v=>v[0])),mz=Math.min(...p.map(v=>v[1]));
  const bb=new Set(p.map(([x,z])=>(x-mx)+','+(z-mz)));
  let hit=0;for(const k of aa)if(bb.has(k))hit++;
  best=Math.max(best,hit/(aa.size+bb.size-hit));
 }
 return best;
}
test('Builder 3A M3 fourth-variant 30 precise original source slots and no owner spillover',()=>{
 assert.equal(M3_CRAFT_FOURTH_SPECS.length,30);
 assert.equal(new Set(M3_CRAFT_FOURTH_SPECS.map(s=>s.name)).size,30);
 assert.equal(validateAuthoredPool(fourth).authored,30);
 for(const type of ['carpenter','stonemason'])for(const biome of BIOMES)for(const size of SIZES){
  const b=createM3CraftFourthVariant(type,biome,size);
  assert.equal(b.id,slotId(type,biome,size,4));
  assert.equal(b.variant,4);
  assert.equal(b.status,'theoretical');assert.equal(b.worldPlaced,false);
  assert.equal(b.productionRegistered,false);
  assert.equal(b.features.length,2);
  assert.equal(b.spaces.length,5);
  assert.equal(b.architecture.trueUnroofedCarriageyard,true);
  assert.equal(b.architecture.distinctRoofMasses,4);
  assert.ok(cells(b).length>1000,b.id+' is only metadata');
 }
 assert.throws(()=>createM3CraftFourthVariant('blacksmith','snow','small'),RangeError);
 assert.throws(()=>createM3CraftFourthVariant('mining-workshop','desert','large'),RangeError);
});
test('true perimeter U-court footprints have genuinely empty sky courtyards, supported roofs and no collision or blocked 2x3 corridors',()=>{
 for(const b of fourth){
  const occupied=placed(b),byRole=new Map(b.modules.map(m=>[m.role,m.cells]));
  assert.equal(validateBlueprint(b).coordinateCells,occupied.size,b.id);
  assert.equal(cells(b).length,occupied.size,b.id+' voxel collision');
  for(const role of ['foundation','floor','wall','roof','roof-purlin','bearing-pier','fixture'])
   assert.ok(byRole.has(role),b.id+' missing sourced role '+role);
  assert.ok(byRole.has(b.type==='carpenter'?'dry-lumber-rack':'hand-carved-column-stock'));
  const n=b.navigation.nodes[0],x=n.x,d=b.envelope.depth,
        zCross=b.architecture.courtyardCrossingRows[0];
  // Entry -> rear hall is a real continuous 2-wide, 3-high path.
  for(let z=3;z<=d-3;z++)for(const xx of [x,x+1]){
   assert.ok(occupied.has(key(xx,1,z)),b.id+' missing courtyard path '+xx+','+z);
   for(let y=2;y<=4;y++)
    assert.ok(!occupied.has(key(xx,y,z)),b.id+' corridor occluded '+xx+','+y+','+z);
  }
  const left=b.navigation.nodes.find(v=>v.id==='wood-stock-or-quarry'),
        right=b.navigation.nodes.find(v=>v.id==='dressing-workshop');
  for(let z=3;z<d-6;z++)for(let xx=left.x;xx<left.x+2;xx++){
   assert.ok(occupied.has(key(xx,1,z)),b.id+' west aisle lacks deck');
   for(let y=2;y<=4;y++)assert.ok(!occupied.has(key(xx,y,z)),b.id+' west aisle blocked');
  }
  const rEnd=b.clearances.find(c=>c.x===right.x&&c.width===2&&c.depth>2);
  assert.ok(rEnd);
  for(let z=3;z<3+rEnd.depth;z++)for(let xx=right.x;xx<right.x+2;xx++){
   assert.ok(occupied.has(key(xx,1,z)),b.id+' east aisle lacks deck');
   for(let y=2;y<=4;y++)assert.ok(!occupied.has(key(xx,y,z)),b.id+' east aisle blocked');
  }
  const cross=b.clearances.find(c=>c.z===zCross&&c.depth===2);
  assert.ok(cross);
  for(let z=zCross;z<zCross+2;z++)for(let xx=cross.x;xx<cross.x+cross.width;xx++){
   assert.ok(occupied.has(key(xx,1,z)),b.id+' open court crossing unbuilt');
   for(let y=2;y<=4;y++)assert.ok(!occupied.has(key(xx,y,z)),b.id+' court crossing blocked');
  }
  // Actual unroofed courtyard is mostly empty: interior ground is NOT covered.
  const roofing=new Set(byRole.get('roof').map(c=>key(c[0],1,c[2])));
  const foundation=new Set(byRole.get('foundation').map(c=>key(c[0],1,c[2])));
  let empty=0,openPath=0;
  const minX=Math.floor(b.envelope.width/3),maxX=Math.floor(b.envelope.width*2/3);
  for(let xx=minX;xx<=maxX;xx++)for(let z=13;z<d-12;z++){
   if(!foundation.has(key(xx,1,z)))empty++;
   else if(!roofing.has(key(xx,1,z)))openPath++;
  }
  assert.ok(empty>50,b.id+' courtyard is not genuinely excavated');
  assert.ok(openPath>10,b.id+' courtyard crossing not open to the sky');
  // A locally witnessed roof support is NOT an engineering load certificate.
  const supports=new Set([...byRole.get('roof-purlin'),...byRole.get('bearing-pier'),...byRole.get('wall')]
   .map(c=>key(...c.slice(0,3))));
  let witnesses=0,samples=0;
  for(let i=0;i<byRole.get('roof').length;i+=7){
   const [px,py,pz]=byRole.get('roof')[i];samples++;
   let nearby=false;
   for(let dx=-3;dx<=3&&!nearby;dx++)for(let dz=-3;dz<=3&&!nearby;dz++)
    if(Math.abs(dx)+Math.abs(dz)<=3)
     for(let dy=1;dy<=3;dy++)if(supports.has(key(px+dx,py-dy,pz+dz))){nearby=true;break;}
   if(nearby)witnesses++;
  }
  assert.ok(witnesses/samples>0.94,b.id+' roof lacks nearby authored bearing witness '+witnesses+'/'+samples);
  assert.equal(b.architecture.structuralLoadApproved,false);
  assert.equal(b.architecture.weatherApproved,false);
  assert.equal(byRole.get('fixture').length,2);
  for(const c of byRole.get('fixture')){
   assert.equal(c.length,5);assert.equal(c[4].orientation,'north');
   assert.ok(occupied.has(key(c[0],1,c[2])),'unmounted fixture');
  }
 }
});
test('D4 full-voxel uniqueness across all 285 source-only blueprints; 15 legacy blacksmith originals unchanged',()=>{
 const legacy=createLegacyBlacksmithPool();
 const before=legacy.map(b=>[b.id,geometryFingerprint(b)]);
 const all=[...oldModels(),...fourth];
 assert.equal(all.length,285);
 const ids=new Set(),hashes=new Map();
 for(const b of all){
  assert.ok(!ids.has(b.id),'reused blueprint ID '+b.id);ids.add(b.id);
  const shape=d4Shape(b);
  assert.ok(!hashes.has(shape),'D4 voxel duplicate '+b.id+' / '+hashes.get(shape));
  hashes.set(shape,b.id);
 }
 assert.equal(ids.size,285);
 assert.deepEqual(createLegacyBlacksmithPool().map(b=>[b.id,geometryFingerprint(b)]),before);
});
test('D4 normalized ground IoU excludes near-reskins of second/third variants and peer biome-size courts',()=>{
 const second=createM3CraftSecondPool(),third=createM3CraftThirdPool();
 const readings=[];
 for(const current of fourth){
  for(const old of [...second,...third].filter(b=>
   b.type===current.type&&b.size===current.size)){
   const similarity=d4FootprintIoU(current,old);
   assert.ok(similarity<0.94,current.id+' old '+old.id+' nearly identical IoU='+similarity);
   readings.push(similarity);
  }
 }
 for(let i=0;i<fourth.length;i++)for(let j=i+1;j<fourth.length;j++){
  const a=fourth[i],b=fourth[j];
  if(a.type!==b.type||a.size!==b.size)continue;
  const similarity=d4FootprintIoU(a,b);
  assert.ok(similarity<0.94,'near-identical fourth-variant yard '+a.id+' / '+b.id+' IoU='+similarity);
  readings.push(similarity);
 }
 assert.ok(readings.length>=200);
 console.log('Builder 3A M3 fourth source D4 footprint comparisons '+readings.length+
 ' max IoU '+Math.max(...readings).toFixed(6));
});
test('honest fourth-variant source count 285/345, with 60 uncreated; camera projections are NOT Chromium screenshots',()=>{
 const all=[...oldModels(),...fourth];
 const counts=Object.fromEntries(['blacksmith','armorer','carpenter','stonemason','mining-workshop']
  .map(t=>[t,all.filter(b=>b.type===t).length]));
 assert.deepEqual(counts,{blacksmith:75,armorer:75,carpenter:60,stonemason:60,'mining-workshop':15});
 assert.equal(all.length,285);assert.equal(345-all.length,60);
 assert.ok(all.every(b=>b.status==='theoretical'&&!b.activated&&!b.productionRegistered&&!b.worldPlaced));
 let targets=0;
 for(const b of fourth)for(const cutaway of [false,true]){
  const mesh=createPreviewMesh(b,{cutaway});
  assert.equal(mesh.isDiagnosticEnvelope,true);
  assert.equal(mesh.notAssetShapeProof,true);
  assert.ok(mesh.vertices.length>1000&&mesh.vertices.every(Number.isFinite));
  for(const [w,h] of [[667,375],[844,390],[932,430]]){
   const camera=fitPreviewCamera(b.envelope,mesh.vertices,w,h);
   assert.ok(camera.projectedHalfWidth<1&&camera.projectedHalfHeight<1);
   targets++;
  }
 }
 assert.equal(targets,180); // Native projection; only explicit browser runner can certify captures.
});