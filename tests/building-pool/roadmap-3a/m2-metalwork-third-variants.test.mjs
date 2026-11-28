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
import {M2_THIRD_VARIANT_SPECS,createM2ThirdVariant,createM2ThirdVariantPool} from '../../../src/building-pool/roadmap-3a/m2-metalwork-third-variants.mjs';
import {validateAuthoredPool,validateBlueprint} from '../../../src/building-pool/roadmap-3a/contract.mjs';
import {resolveManualFivePackAsset} from '../../../src/builder-assets/manual-five-pack.mjs';
import {createPreviewMesh} from './preview-mesh.mjs';
import {fitPreviewCamera} from './preview-camera.mjs';
const third=createM2ThirdVariantPool();
const cells=b=>b.modules.flatMap(m=>m.cells);
const pos=(x,y,z)=>[x,y,z].join(',');
const occupancy=b=>new Set(cells(b).map(c=>pos(...c.slice(0,3))));
function canonicalOccupiedMass(b){
 const points=cells(b).map(c=>c.slice(0,3)),signatures=[];
 for(let rotation=0;rotation<4;rotation++)for(const reflection of [false,true]){
  const changed=points.map(([x,y,z])=>{
   if(reflection)x=-x;
   for(let i=0;i<rotation;i++){const old=-z;z=x;x=old;}
   return [x,y,z];
  });
  const minima=[0,1,2].map(i=>Math.min(...changed.map(v=>v[i])));
  signatures.push(createHash('sha256').update(changed.map(v=>v.map((n,i)=>n-minima[i]).join(',')).sort().join('|')).digest('hex'));
 }
 return signatures.sort()[0];
}
test('M2 third variants: thirty fully-authored unique category × biome × size IDs',()=>{
 assert.equal(M2_THIRD_VARIANT_SPECS.length,30);
 assert.equal(third.length,30);
 assert.equal(validateAuthoredPool(third).authored,30);
 assert.equal(new Set(M2_THIRD_VARIANT_SPECS.map(x=>x.name)).size,30);
 for(const type of ['blacksmith','armorer'])for(const biome of BIOMES)for(const size of SIZES){
  const b=createM2ThirdVariant(type,biome,size);
  assert.equal(b.id,slotId(type,biome,size,3));
  assert.ok(third.some(x=>x.id===b.id));
  assert.equal(b.variant,3);assert.equal(b.status,'theoretical');
  assert.equal(b.activated,false);assert.equal(b.worldPlaced,false);
  assert.equal(b.architecture.threeIndependentRoofVolumes,true);
  assert.ok(b.architecture.wingSegments.west[0]>1);
  assert.ok(b.architecture.wingSegments.east[1]<b.envelope.depth);
  assert.ok(cells(b).length>1100);
 }
 assert.throws(()=>createM2ThirdVariant('watchtower','snow','medium'),RangeError);
});
test('real physical two-wide three-high access, roof, structural pier+truss, and no cell duplicates',()=>{
 for(const b of third){
  const placed=occupancy(b),width=b.envelope.width,depth=b.envelope.depth;
  assert.equal(placed.size,cells(b).length,'physical collision '+b.id);
  assert.equal(validateBlueprint(b).coordinateCells,placed.size);
  assert.equal(b.spaces.length,2);assert.equal(b.features.length,b.type==='blacksmith'?3:2);
  const start=b.navigation.nodes[0].x;
  for(let z=2;z<depth;z++)for(const x of [start,start+1]){
   assert.ok(placed.has(pos(x,1,z)),'floor absent '+b.id);
   for(let y=2;y<=4;y++)
    assert.ok(!placed.has(pos(x,y,z)),'two-wide aisle obstructed '+b.id+' '+pos(x,y,z));
  }
  for(const role of ['foundation','floor','wall','roof','support-pier','roof-purlin','work-zone-divider','fixture'])
   assert.ok(b.modules.find(m=>m.role===role)?.cells.length>20*(role==='fixture'?0:1),b.id+' missing '+role);
  assert.ok(b.spaces.every(s=>b.navigation.nodes.some(n=>n.id===s.accessNode)));
  assert.ok(b.architecture.structuralLoadApproved===false&&b.architecture.weatherApproved===false);
  assert.ok(cells(b).some(c=>c[0]<6)&&cells(b).some(c=>c[0]>=width-6));
 }
});
test('15 NEW forge chimneys: hollow vertical passage through actual roof and authored masonry backing, no fictional cap',()=>{
 for(const b of third.filter(b=>b.type==='blacksmith')){
  const placed=occupancy(b),flue=b.architecture.coldHollowFlue;
  assert.ok(flue&&flue.x===8);
  assert.equal(flue.openFromY,3);assert.equal(flue.openThroughY,22);
  for(let y=3;y<=22;y++){
   assert.ok(!placed.has(pos(flue.x,y,flue.z)),b.id+' chimney seals flue '+y);
   for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++)if(dx||dz)
    assert.ok(placed.has(pos(flue.x+dx,y,flue.z+dz)),b.id+' hollow masonry shell missing '+[dx,y,dz]);
  }
  const fireplace=cells(b).find(c=>c[3]==='pack4:064');
  assert.ok(fireplace&&fireplace[4].orientation==='north');
  assert.deepEqual(fireplace.slice(0,3),[flue.x,2,flue.z]);
  assert.ok(placed.has(pos(flue.x,2,flue.z+1)),'cold fireplace masonry rear bearing');
  assert.ok(!cells(b).some(c=>c[3]==='pack4:063'),'unapproved chimney physical cap was installed');
  assert.equal(b.architecture.chimneyCapInstalled,false);
 }
});
test('source producer AABB, occupied offsets, real cardinal variant and support offsets for all 30 fixtures',()=>{
 for(const b of third){
  const placed=occupancy(b);
  const fixtures=cells(b).filter(c=>['pack4:064','pack4:057','pack5:088'].includes(c[3]));
  assert.equal(fixtures.length,b.type==='blacksmith'?3:2);
  for(const c of fixtures){
   const metadata=c[4];
   assert.equal(metadata.orientation,'north');
   const a=resolveManualFivePackAsset(c[3],metadata.variant?
    {variant:metadata.variant,orientation:metadata.orientation}:
    {orientation:metadata.orientation});
   assert.equal(a.builderResolvable,true);assert.equal(a.livePlaceable,false);
   assert.ok(a.visibleBoxes.length>=1&&a.selectionBoxes.length>=1);
   assert.ok(a.visibleBoxes.flat().every(Number.isFinite));
   assert.ok(a.collisionBoxes.flat().every(Number.isFinite));
   for(const [dx,dy,dz] of a.occupiedOffsets){
    if(dx===0&&dy===0&&dz===0)continue;
    assert.ok(!placed.has(pos(c[0]+dx,c[1]+dy,c[2]+dz)),b.id+' multipiece offset blocked');
   }
   for(const [dx,dy,dz] of a.supportOffsets){
    assert.ok(placed.has(pos(c[0]+dx,c[1]+dy,c[2]+dz)),b.id+' missing authored shape support '+c[3]);
   }
  }
 }
});
test('135 candidate architecture masses unique under all cardinal rotations and mirrors; original fifteen byte geometries intact',()=>{
 const old=createLegacyBlacksmithPool(),preserved=old.map(b=>[b.id,geometryFingerprint(b)]);
 const all=[...old,...createM1OriginalWorkshopPool(),...createM1RegionalPool(),
 ...createM1CompletionPool(),...createM2MetalworkPool(),...third];
 assert.equal(all.length,135);
 const identifiers=new Set(),geometry=new Map();
 for(const b of all){
  assert.ok(!identifiers.has(b.id),'duplicate blueprint '+b.id);identifiers.add(b.id);
  const signature=canonicalOccupiedMass(b);
  assert.ok(!geometry.has(signature),'mirrored, translated or rotated architecture '+b.id+' / '+geometry.get(signature));
  geometry.set(signature,b.id);
 }
 assert.equal(geometry.size,135);
 assert.deepEqual(createLegacyBlacksmithPool().map(b=>[b.id,geometryFingerprint(b)]),preserved);
});
test('180 real-source diagnostic camera projections: 30 × exterior/cutaway × 3 mobile landscape sizes',()=>{
 let count=0;
 for(const b of third)for(const cutaway of [false,true]){
  const mesh=createPreviewMesh(b,{cutaway});
  assert.equal(mesh.isDiagnosticEnvelope,true);assert.equal(mesh.notAssetShapeProof,true);
  assert.ok(mesh.vertices.length>2000&&mesh.vertices.every(Number.isFinite));
  for(const [w,h] of [[667,375],[844,390],[932,430]]){
   const camera=fitPreviewCamera(b.envelope,mesh.vertices,w,h);
   assert.ok(camera.projectedHalfWidth<1&&camera.projectedHalfHeight<1);count++;
  }
 }
 assert.equal(count,180);
});
test('M2 135/345 source-only census, exact physical positions, 0 creator-approved or integrated',()=>{
 const all=[...createLegacyBlacksmithPool(),...createM1OriginalWorkshopPool(),...createM1RegionalPool(),
 ...createM1CompletionPool(),...createM2MetalworkPool(),...third];
 assert.equal(all.length,135);assert.equal(345-all.length,210);
 const byType=Object.fromEntries(['blacksmith','armorer','carpenter','stonemason','mining-workshop'].map(t=>[t,all.filter(b=>b.type===t).length]));
 assert.deepEqual(byType,{blacksmith:45,armorer:45,carpenter:15,stonemason:15,'mining-workshop':15});
 const coordCount=all.reduce((n,b)=>n+cells(b).length,0);
 assert.ok(all.every(b=>b.status==='theoretical'&&b.activated===false&&b.worldPlaced!==true));
 const dir=join(process.cwd(),'artifacts/building-roadmap-3a-m2-third');mkdirSync(dir,{recursive:true});
 writeFileSync(join(dir,'SOURCE_CENSUS_135.json'),JSON.stringify({
  schema:'mythwrought.builder3a.m2.third-census-v1',authored:135,newThirdVariants:30,
  originalLegacy15:15,unauthored:210,creatorApproved:0,integrated:0,coordinateCells:coordCount,
  byType,blueprints:all.map(b=>({id:b.id,type:b.type,biome:b.biome,size:b.size,
   variant:b.variant,coordinates:cells(b).length,massSha256:canonicalOccupiedMass(b),worldPlaced:false}))
 },null,2)+'\n');
 console.log('Builder 3A M2 third-variant source census: 135/345, 210 unauthored; '+coordCount+' integer voxel coordinates; creator-accepted 0 integrated 0');
});
