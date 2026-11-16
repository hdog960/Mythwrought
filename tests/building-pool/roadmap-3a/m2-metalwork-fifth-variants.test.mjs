import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {BIOMES,SIZES,slotId} from '../../../src/building-pool/roadmap-3a/roster.mjs';
import {createLegacyBlacksmithPool} from '../../../src/building-pool/roadmap-3a/legacy-blacksmiths.mjs';
import {geometryFingerprint} from '../../../src/building-pool/roadmap-3a/legacy-validation.mjs';
import {createM1OriginalWorkshopPool} from '../../../src/building-pool/roadmap-3a/m1-workshop-exemplars.mjs';
import {createM1RegionalPool} from '../../../src/building-pool/roadmap-3a/m1-regional-workshops.mjs';
import {createM1CompletionPool} from '../../../src/building-pool/roadmap-3a/m1-coverage-workshops.mjs';
import {createM2MetalworkPool} from '../../../src/building-pool/roadmap-3a/m2-metalwork-second-variants.mjs';
import {createM2ThirdVariantPool} from '../../../src/building-pool/roadmap-3a/m2-metalwork-third-variants.mjs';
import {createM2FourthVariantPool} from '../../../src/building-pool/roadmap-3a/m2-metalwork-fourth-variants.mjs';
import {createM2FifthVariantPool,createM2FifthVariant,M2_FIFTH_VARIANT_SPECS} from '../../../src/building-pool/roadmap-3a/m2-metalwork-fifth-variants.mjs';
import {validateAuthoredPool,validateBlueprint} from '../../../src/building-pool/roadmap-3a/contract.mjs';
import {createPreviewMesh} from './preview-mesh.mjs';
import {fitPreviewCamera} from './preview-camera.mjs';
const fifth=createM2FifthVariantPool();
const voxels=b=>b.modules.flatMap(m=>m.cells);
const pos=(x,y,z)=>[x,y,z].join(',');
const occupied=b=>new Set(voxels(b).map(c=>pos(...c.slice(0,3))));
function canonicalMass(b){
 const source=voxels(b).map(c=>c.slice(0,3)),hashes=[];
 for(let r=0;r<4;r++)for(const reflection of [false,true]){
  const rotated=source.map(([x,y,z])=>{
   if(reflection)x=-x;
   for(let k=0;k<r;k++){const v=-z;z=x;x=v;}
   return [x,y,z];
  });
  const min=[0,1,2].map(i=>Math.min(...rotated.map(v=>v[i])));
  hashes.push(createHash('sha256').update(rotated.map(v=>v.map((n,i)=>n-min[i]).join(',')).sort().join('|')).digest('hex'));
 }
 return hashes.sort()[0];
}
test('final 30 metalworking fifth variants have actual original spatial programs, 5 biomes x 3 sizes, owned ID 5',()=>{
 assert.equal(M2_FIFTH_VARIANT_SPECS.length,30);
 assert.equal(fifth.length,30);
 assert.equal(validateAuthoredPool(fifth).authored,30);
 assert.equal(new Set(M2_FIFTH_VARIANT_SPECS.map(q=>q.name)).size,30);
 for(const kind of ['blacksmith','armorer'])for(const biome of BIOMES)for(const size of SIZES){
  const b=createM2FifthVariant(kind,biome,size);
  assert.equal(b.id,slotId(kind,biome,size,5));
  assert.equal(b.variant,5);assert.equal(b.status,'theoretical');
  assert.equal(b.activated,false);assert.equal(b.worldPlaced,false);
  assert.equal(b.productionRegistered,false);
  assert.equal(b.architecture.sourceAccessibleWorkRooms,4);
  assert.equal(b.architecture.physicalRoofVolumeCount,3);
  assert.ok(b.architecture.trueEastRoofOpenCourt[1]>b.architecture.trueEastRoofOpenCourt[0]);
  assert.ok(voxels(b).length>1500);
 }
 assert.throws(()=>createM2FifthVariant('watchtower','snow','large'),RangeError);
});
test('all 30 real accessible source geometries: two-wide main hall, both side aisles, four connected named work zones',()=>{
 for(const b of fifth){
  const occ=occupied(b),{width:w,depth:d}=b.envelope;
  const e=b.navigation.nodes.find(n=>n.id==='gate');
  assert.equal(occ.size,voxels(b).length,'duplicate source voxel '+b.id);
  assert.equal(validateBlueprint(b).coordinateCells,occ.size);
  assert.equal(b.spaces.length,4);
  assert.equal(b.navigation.nodes.length,5);
  assert.equal(b.navigation.edges.length,4);
  for(let z=2;z<d;z++)for(const x of [e.x,e.x+1]){
   assert.ok(occ.has(pos(x,1,z)),b.id+' floorless central aisle '+[x,z]);
   for(let y=2;y<=4;y++)assert.ok(!occ.has(pos(x,y,z)),b.id+' blocked 2-wide corridor '+[x,y,z]);
  }
  for(const direction of ['west-cold-work','east-open-court']){
   const node=b.navigation.nodes.find(n=>n.id===direction);
   const start=direction==='west-cold-work'?3:e.x+1,stop=direction==='west-cold-work'?e.x:w-4;
   for(let z=node.z;z<node.z+2;z++)for(let x=start;x<=stop;x++){
    assert.ok(occ.has(pos(x,1,z)),b.id+' missing side walkable deck '+[x,z]);
    for(let y=2;y<=4;y++)assert.ok(!occ.has(pos(x,y,z)),b.id+' blocked side connection '+[x,y,z]);
   }
  }
  for(const role of ['foundation','floor','wall','roof','support-pier','roof-purlin','room-divider','fixture'])
   assert.ok(b.modules.find(m=>m.role===role)?.cells.length>0,b.id+' missing physical '+role);
  assert.ok(voxels(b).some(c=>c[0]===1)&&voxels(b).some(c=>c[0]===w-2));
  assert.equal(b.architecture.roofLoadCertified,false);
  assert.equal(b.architecture.weatherproofCourtyardApproved,false);
 }
});
test('all fifteen new smiths have open-to-air 3 x 3 masonry flue shafts, typed cold fireplace and no fabricated cap',()=>{
 for(const b of fifth.filter(b=>b.type==='blacksmith')){
  const occ=occupied(b),f=b.architecture.sourceHollowColdFlue;
  assert.ok(f);
  const fire=voxels(b).find(c=>c[3]==='pack4:064');
  assert.ok(fire);
  assert.deepEqual(fire.slice(0,3),[f.x,2,f.z]);
  assert.equal(fire[4].orientation,'north');
  assert.ok(occ.has(pos(f.x,2,f.z+1)),'source rear face masonry missing');
  for(let y=f.openFromY;y<=f.openThroughY;y++){
   assert.ok(!occ.has(pos(f.x,y,f.z)),b.id+' sealed source smoke passage '+y);
   for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++)if(dx||dz)
    assert.ok(occ.has(pos(f.x+dx,y,f.z+dz)),b.id+' missing 3x3 hollow shaft ring '+[dx,y,dz]);
  }
  assert.equal(voxels(b).filter(c=>c[3]==='pack4:063').length,0);
  assert.equal(b.architecture.noCapInstalled,true);
  assert.equal(b.architecture.physicalHeatApproved,false);
 }
});
test('all 195 source coordinate shapes distinct under normalized D4 mirror/rotation/translation, legacy fingerprint parity untouched',()=>{
 const legacy=createLegacyBlacksmithPool(),originalHashes=legacy.map(b=>[b.id,geometryFingerprint(b)]);
 const all=[...legacy,...createM1OriginalWorkshopPool(),...createM1RegionalPool(),
 ...createM1CompletionPool(),...createM2MetalworkPool(),...createM2ThirdVariantPool(),
 ...createM2FourthVariantPool(),...fifth];
 assert.equal(all.length,195);
 const signatures=new Map(),ids=new Set();
 for(const b of all){
  assert.ok(!ids.has(b.id),'duplicate source ID '+b.id);
  ids.add(b.id);
  const sig=canonicalMass(b);
  assert.ok(!signatures.has(sig),'D4 duplicate source architecture '+b.id+' / '+signatures.get(sig));
  signatures.set(sig,b.id);
 }
 assert.equal(signatures.size,195);
 assert.deepEqual(createLegacyBlacksmithPool().map(b=>[b.id,geometryFingerprint(b)]),originalHashes);
});
test('180 source-backed cube preview/camera samples remain visibly projected at actual 3 iPhone landscape viewports',()=>{
 let n=0;
 for(const b of fifth)for(const cutaway of [false,true]){
  const m=createPreviewMesh(b,{cutaway});
  assert.equal(m.isDiagnosticEnvelope,true);
  assert.equal(m.notAssetShapeProof,true);
  assert.ok(m.vertices.length>1000);
  assert.ok(m.vertices.every(Number.isFinite));
  for(const [w,h] of [[667,375],[844,390],[932,430]]){
   const camera=fitPreviewCamera(b.envelope,m.vertices,w,h);
   assert.ok(camera.projectedHalfWidth<1&&camera.projectedHalfHeight<1);
   n++;
  }
 }
 assert.equal(n,180);
});
test('honest fifth-variant census 195/345, blacksmith and armorer 75/75, 150 other architectures still unauthored',()=>{
 const all=[...createLegacyBlacksmithPool(),...createM1OriginalWorkshopPool(),
 ...createM1RegionalPool(),...createM1CompletionPool(),...createM2MetalworkPool(),
 ...createM2ThirdVariantPool(),...createM2FourthVariantPool(),...fifth];
 assert.equal(all.length,195);assert.equal(345-all.length,150);
 const types=['blacksmith','armorer','carpenter','stonemason','mining-workshop'];
 const counts=Object.fromEntries(types.map(t=>[t,all.filter(b=>b.type===t).length]));
 assert.deepEqual(counts,{blacksmith:75,armorer:75,carpenter:15,stonemason:15,'mining-workshop':15});
 assert.ok(all.every(b=>b.status==='theoretical'&&!b.activated&&!b.worldPlaced));
 const coordCount=all.reduce((n,b)=>n+voxels(b).length,0);
 const dir=join(process.cwd(),'artifacts/building-roadmap-3a-m2-fifth');
 mkdirSync(dir,{recursive:true});
 writeFileSync(join(dir,'SOURCE_CENSUS_195.json'),JSON.stringify({
  schema:'mythwrought.3a.m2.fifth-census.v1',authored:195,newFifthVariants:30,
  stillUnauthored:150,creatorApproved:0,worldIntegrated:0,
  sourceVoxelCells:coordCount,types:counts,
  blueprints:all.map(b=>({id:b.id,type:b.type,biome:b.biome,size:b.size,
    variant:b.variant,sourceCoordinateCells:voxels(b).length,
    sourceMassSha256:canonicalMass(b),worldPlaced:false}))
 },null,2)+'\n');
 console.log('Builder 3A M2 fifth-variant source census: 195/345; '+coordCount+
  ' authored voxel coordinates; 150 still unauthored; creator approved 0, integrated 0');
});
