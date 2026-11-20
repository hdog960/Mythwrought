import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
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
import {M3_CRAFT_THIRD_SPECS,createM3CraftThirdPool,createM3CraftThirdVariant} from '../../../src/building-pool/roadmap-3a/m3-craft-third-variants.mjs';
import {createPreviewMesh} from './preview-mesh.mjs';
import {fitPreviewCamera} from './preview-camera.mjs';
const third=createM3CraftThirdPool();
const cells=b=>b.modules.flatMap(m=>m.cells);
const place=(x,y,z)=>[x,y,z].join(',');
const placed=b=>new Set(cells(b).map(c=>place(...c.slice(0,3))));
const oldModels=()=>[...createLegacyBlacksmithPool(),...createM1OriginalWorkshopPool(),
 ...createM1RegionalPool(),...createM1CompletionPool(),...createM2MetalworkPool(),
 ...createM2ThirdVariantPool(),...createM2FourthVariantPool(),
 ...createM2FifthVariantPool(),...createM3CraftSecondPool()];
function canonicalD4(b){
 const xyz=cells(b).map(c=>c.slice(0,3)),hashes=[];
 for(let rot=0;rot<4;rot++)for(const mirrored of [false,true]){
  const transformed=xyz.map(([x,y,z])=>{
   if(mirrored)x=-x;
   for(let i=0;i<rot;i++){const t=-z;z=x;x=t;}
   return [x,y,z];
  });
  const minima=[0,1,2].map(i=>Math.min(...transformed.map(v=>v[i])));
  hashes.push(createHash('sha256').update(transformed.map(v=>v.map((n,i)=>n-minima[i]).join(',')).sort().join('|')).digest('hex'));
 }
 return hashes.sort()[0];
}
function ground(b){return b.modules.find(m=>m.role==='foundation').cells.map(c=>[c[0],c[2]]);}
function floorIoU(a,b){
 const A=ground(a),B=ground(b);
 const mA=[Math.min(...A.map(v=>v[0])),Math.min(...A.map(v=>v[1]))],
       as=new Set(A.map(v=>[v[0]-mA[0],v[1]-mA[1]].join(',')));
 let best=0;
 for(let rot=0;rot<4;rot++)for(const mirror of [false,true]){
  const transformed=B.map(([x,z])=>{
   if(mirror)x=-x;
   for(let i=0;i<rot;i++){const t=-z;z=x;x=t;}
   return [x,z];
  });
  const min=[Math.min(...transformed.map(v=>v[0])),Math.min(...transformed.map(v=>v[1]))];
  const bs=new Set(transformed.map(v=>[v[0]-min[0],v[1]-min[1]].join(',')));
  let intersection=0;
  for(const k of as)if(bs.has(k))intersection++;
  best=Math.max(best,intersection/(as.size+bs.size-intersection));
 }
 return best;
}
test('M3 next thirty true third-variant craft blueprints cover every biome and size with unique original briefs',()=>{
 assert.equal(M3_CRAFT_THIRD_SPECS.length,30);
 assert.equal(third.length,30);
 assert.equal(validateAuthoredPool(third).authored,30);
 assert.equal(new Set(M3_CRAFT_THIRD_SPECS.map(x=>x.name)).size,30);
 for(const type of ['carpenter','stonemason'])for(const biome of BIOMES)for(const size of SIZES){
  const b=createM3CraftThirdVariant(type,biome,size);
  assert.equal(b.id,slotId(type,biome,size,3));
  assert.equal(b.variant,3);
  assert.equal(b.status,'theoretical');
  assert.equal(b.activated,false);assert.equal(b.worldPlaced,false);
  assert.equal(b.productionRegistered,false);
  assert.equal(b.architecture.realSeparateWorkRooms,4);
  assert.equal(b.architecture.centralNaveWidth,12);
  assert.equal(b.architecture.separateRoofVolumes,3);
  assert.ok(cells(b).length>1100);
 }
 assert.throws(()=>createM3CraftThirdVariant('blacksmith','snow','small'),RangeError);
 assert.throws(()=>createM3CraftThirdVariant('mining-workshop','desert','large'),RangeError);
});
test('30 physical-source craft halls have complete supports, proper trade-specific fixtures, real compartments and no coordinate overlaps',()=>{
 for(const b of third){
  const occ=placed(b),roles=new Set(b.modules.map(m=>m.role));
  assert.equal(validateBlueprint(b).coordinateCells,occ.size);
  assert.equal(occ.size,cells(b).length);
  for(const role of ['foundation','floor','wall','roof','roof-purlin','bearing-pier','workflow-divider','fixture'])
   assert.ok(roles.has(role),b.id+' missing genuine source role '+role);
  assert.ok(roles.has(b.type==='carpenter'?'angled-seasoning-rack':'sculptural-column-block'),b.id+' missing original trade work role');
  assert.equal(b.spaces.length,4);assert.equal(b.navigation.nodes.length,5);
  assert.equal(b.navigation.edges.length,4);assert.equal(b.features.length,2);
  assert.ok(b.architecture.actuallyOpenEastCourtyard.length===2);
  assert.equal(b.architecture.structuralLoadApproved,false);
  assert.equal(b.architecture.weatherApproved,false);
 }
});
test('source-supported straight two-wide main aisle and both staggered cross-workshop routes clear to three-high',()=>{
 for(const b of third){
  const occ=placed(b),{width:w,depth:d}=b.envelope;
  const entry=b.navigation.nodes.find(n=>n.id==='entry').x;
  for(let z=2;z<d;z++)for(const x of [entry,entry+1]){
   assert.ok(occ.has(place(x,1,z)),b.id+' central source deck missing '+[x,z]);
   for(let y=2;y<=4;y++)assert.ok(!occ.has(place(x,y,z)),b.id+' central access obstructed '+[x,y,z]);
  }
  for(const side of ['west-trade-wing','east-court']){
   const n=b.navigation.nodes.find(v=>v.id===side);
   assert.ok(n&&n.width>=2&&n.headroom>=3);
   for(let z=n.z;z<n.z+2;z++){
    const x0=side==='west-trade-wing'?4:entry+1;
    const x1=side==='west-trade-wing'?entry:w-5;
    for(let x=x0;x<=x1;x++){
     assert.ok(occ.has(place(x,1,z)),b.id+' crosswing floor missing '+[x,z]);
     for(let y=2;y<=4;y++)
      assert.ok(!occ.has(place(x,y,z)),b.id+' crosswing aisle blocked '+[x,y,z]);
    }
   }
  }
  const stock=b.modules.find(m=>m.role==='fixture').cells;
  assert.equal(stock.length,2);
  assert.ok(stock.some(c=>c[3]==='pack4:057'));
  for(const c of stock){
   assert.equal(c.length,5);assert.equal(c[4].orientation,'north');
   assert.ok(occ.has(place(c[0],1,c[2])),'fixture floor bearing missing');
  }
 }
});
test('195 pre-existing source-authored blueprints remain byte-equivalent and all 255 physically distinct under eight D4 transformations',()=>{
 const legacy=createLegacyBlacksmithPool(),parity=legacy.map(b=>[b.id,geometryFingerprint(b)]);
 const all=[...oldModels(),...third];
 assert.equal(all.length,255);
 const idSet=new Set(),shapes=new Map();
 for(const b of all){
  assert.ok(!idSet.has(b.id),'reused blueprint ID '+b.id);idSet.add(b.id);
  const fingerprint=canonicalD4(b);
  assert.ok(!shapes.has(fingerprint),'D4 copy '+b.id+' of '+shapes.get(fingerprint));
  shapes.set(fingerprint,b.id);
 }
 assert.equal(shapes.size,255);
 assert.deepEqual(createLegacyBlacksmithPool().map(b=>[b.id,geometryFingerprint(b)]),parity);
});
test('new third-variant craft footprints reject near duplicates against the earlier second variant and among matching trade/size across biomes',()=>{
 const prior=createM3CraftSecondPool(),comparisons=[];
 for(const current of third){
  const previous=prior.find(b=>b.type===current.type&&b.biome===current.biome&&b.size===current.size);
  assert.ok(previous);
  const iou=floorIoU(current,previous);
  comparisons.push({a:current.id,b:previous.id,iou});
  assert.ok(iou<0.94,'similar prior craft footprint '+current.id+' iou='+iou);
 }
 for(let i=0;i<third.length;i++)for(let j=i+1;j<third.length;j++){
  const a=third[i],b=third[j];if(a.type!==b.type||a.size!==b.size)continue;
  const iou=floorIoU(a,b);comparisons.push({a:a.id,b:b.id,iou});
  assert.ok(iou<0.94,'near-duplicate third craft floorplates '+a.id+' '+b.id+' iou='+iou);
 }
 assert.ok(comparisons.length>=80);
 const dir=join(process.cwd(),'artifacts/building-roadmap-3a-m3-third');
 mkdirSync(dir,{recursive:true});
 writeFileSync(join(dir,'M3_THIRD_D4_NEAR_DUPLICATES.json'),
  JSON.stringify({thresholdExclusive:0.94,compared:comparisons.length,maxSimilarity:Math.max(...comparisons.map(c=>c.iou)),comparisons},null,2)+'\n');
});
test('real authored geometry yields 180 native exterior/cutaway camera projections for three phone landscape sizes',()=>{
 let total=0;
 for(const b of third)for(const cutaway of [false,true]){
  const m=createPreviewMesh(b,{cutaway});
  assert.equal(m.isDiagnosticEnvelope,true);assert.equal(m.notAssetShapeProof,true);
  assert.ok(m.vertices.length>1000&&m.vertices.every(Number.isFinite));
  for(const [w,h] of [[667,375],[844,390],[932,430]]){
   const c=fitPreviewCamera(b.envelope,m.vertices,w,h);
   assert.ok(c.projectedHalfWidth<1&&c.projectedHalfHeight<1);
   total++;
  }
 }
 assert.equal(total,180);
});
test('M3 honest 255/345 source-only inventory leaves 90 uncreated; 0 creator approved and 0 integrated',()=>{
 const all=[...oldModels(),...third];assert.equal(all.length,255);
 const typeCounts=Object.fromEntries(['blacksmith','armorer','carpenter','stonemason','mining-workshop'].map(t=>[t,all.filter(b=>b.type===t).length]));
 assert.deepEqual(typeCounts,{blacksmith:75,armorer:75,carpenter:45,stonemason:45,'mining-workshop':15});
 assert.equal(345-all.length,90);
 assert.ok(all.every(b=>b.status==='theoretical'&&!b.activated&&b.worldPlaced!==true));
 const totalCells=all.reduce((n,b)=>n+cells(b).length,0);
 const dir=join(process.cwd(),'artifacts/building-roadmap-3a-m3-third');mkdirSync(dir,{recursive:true});
 writeFileSync(join(dir,'SOURCE_CENSUS_255.json'),JSON.stringify({schema:'mythwrought.3a.m3.third-census-v1',
  authored:255,added:30,unauthored:90,approved:0,integrated:0,
  coordinateCells:totalCells,byType:typeCounts,
  designs:all.map(b=>({id:b.id,type:b.type,biome:b.biome,size:b.size,
   variant:b.variant,physicalSourceCells:cells(b).length,approved:false,worldPlaced:false}))
 },null,2)+'\n');
 console.log('Builder 3A M3 source census: 255/345, 90 unauthored, '+totalCells+' integer source voxel cells; 0 accepted 0 integrated');
});
