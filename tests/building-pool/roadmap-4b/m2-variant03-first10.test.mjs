// Mythwrought 4B M2 variant-03: actual independent coordinate-backed healer/library architecture.
import test from 'node:test';
import assert from 'node:assert/strict';
import {M2_VARIANT03_FIRST10,M2_73_ALL,M2_73_CENSUS,M2_VARIANT03_NAMES} from '../../../src/building-pool/roadmap-4b/m2-variant03-first10.mjs';
import {M2_63_ALL} from '../../../src/building-pool/roadmap-4b/m2-variant02-completion.mjs';
import {validateBlueprint,validateCollection,geometrySignature,expectedIds,BIOMES,SIZES} from '../../../src/building-pool/roadmap-4b/schema.mjs';
const k=a=>a.join(',');
const base=b=>b.cells.filter(c=>c.role==='floor').map(c=>[c.at[0],c.at[2]]);
const normalized=(points,t)=>{
 const transformed=points.map(([x,z])=>{
  let a=t&1?-x:x,b=z;
  if(t&2)[a,b]=[b,a];
  if(t&4)b=-b;
  return [a,b];
 });
 const mx=Math.min(...transformed.map(p=>p[0])),mz=Math.min(...transformed.map(p=>p[1]));
 return new Set(transformed.map(([x,z])=>(x-mx)+','+(z-mz)));
};
const maxD4FloorIoU=(left,right)=>{
 const b=normalized(base(right),0);
 let best=0;
 for(let t=0;t<8;t++){
  const a=normalized(base(left),t);
  let cross=0;
  for(const key of a)if(b.has(key))cross++;
  best=Math.max(best,cross/(a.size+b.size-cross));
 }
 return best;
};
test('first ten genuine third variants preserve all 63 prior source designs and quota allocations',()=>{
 assert.equal(M2_VARIANT03_FIRST10.length,10);
 assert.equal(M2_73_CENSUS.authored,73);
 assert.equal(M2_73_CENSUS.remaining,212);
 assert.equal(M2_73_CENSUS.healers,35);
 assert.equal(M2_73_CENSUS.libraries,35);
 assert.equal(M2_73_CENSUS.fingerprints,73);
 assert.equal(M2_73_CENSUS.creatorApproved,0);assert.equal(M2_73_CENSUS.integrated,0);
 assert.equal(new Set(M2_VARIANT03_NAMES).size,10);
 assert.deepEqual(validateCollection(M2_73_ALL),{authored:73,remaining:212,creatorApproved:0,integrated:0});
 assert.ok(M2_63_ALL.every((b,i)=>M2_73_ALL[i]===b),'existing 63 geometry object identity must remain unchanged');
 for(const b of M2_VARIANT03_FIRST10){
  assert.equal(b.variant,3);assert.match(b.id,/:03$/);
  assert.ok(expectedIds().includes(b.id));
 }
 for(const category of ['healers-house','library'])
  for(const biome of BIOMES)for(const size of SIZES){
   const already=M2_63_ALL.filter(x=>x.type===category&&x.biome===biome&&x.size===size);
   assert.equal(already.length,2,'existing two variants must be preserved');
   const now=M2_73_ALL.filter(x=>x.type===category&&x.biome===biome&&x.size===size);
   assert.equal(now.length,2+M2_VARIANT03_FIRST10.filter(x=>x.type===category&&x.biome===biome&&x.size===size).length);
  }
});
for(const b of M2_VARIANT03_FIRST10)test(b.id+' has genuine supported physical coordinates, clear routes, differentiated roof and provisional assets',()=>{
 const report=validateBlueprint(b);
 assert.equal(report.id,b.id);
 const occupied=new Map(b.cells.map(x=>[k(x.at),x])),nav=new Set(b.navigation.map(x=>k(x.at)));
 assert.ok(b.cells.length>1000);
 assert.ok(b.spaces.length>=4);
 assert.ok(b.navigation.length>100);
 assert.equal(b.creatorApproved,false);assert.equal(b.integrated,false);assert.equal(b.worldPlaced,false);
 assert.ok(b.provenance.originalPlan&&b.provenance.roofProfile);
 const floors=b.cells.filter(x=>x.role==='floor'), foundations=b.cells.filter(x=>x.role==='foundation');
 assert.equal(floors.length,foundations.length);
 assert.equal(floors.length,b.cells.filter(x=>x.role==='roof'&&x.at[1]===7).length);
 for(const f of floors)assert.equal(occupied.get(k([f.at[0],7,f.at[2]]))?.role,'roof');
 const raised=b.cells.filter(x=>x.role==='roof'&&x.at[1]>7);
 assert.ok(raised.some(x=>x.at[1]===10));
 for(const r of raised)assert.ok(occupied.has(k([r.at[0],r.at[1]-1,r.at[2]])),'unsupported raised roof tier');
 const entry=b.openings.filter(x=>x.kind!=='window');
 assert.ok(entry.some(x=>x.kind==='entrance')&&entry.some(x=>x.kind==='door'));
 for(const o of entry){
  assert.ok(nav.has(k(o.at)),'unwalkable real doorway');
  assert.ok(!occupied.has(k(o.at))&&!occupied.has(k([o.at[0],o.at[1]+1,o.at[2]])),'blocked two-cell doorway');
 }
 for(const room of b.spaces){
  assert.ok(room.footprint.length>=4);
  assert.ok(nav.has(k(room.access)),'unreachable authored room');
  for(const [x,z] of room.footprint)assert.equal(occupied.get(k([x,1,z]))?.role,'floor');
 }
 assert.deepEqual(new Set(b.dependencies.map(d=>d.ref)),new Set(['pack4:030','pack4:058','pack4:059']));
 assert.ok(b.dependencies.every(d=>d.status==='catalog-provisional'&&d.unresolved.length>=2&&!Object.hasOwn(d,'numericId')));
 assert.ok(b.features.every(f=>f.active===false));
});
test('independent silhouettes reject floor near-duplicates across all previous and new designs at D4 IoU >= 0.89',()=>{
 let greatest=0;
 for(let i=63;i<M2_73_ALL.length;i++)for(let j=0;j<i;j++){
  const iou=maxD4FloorIoU(M2_73_ALL[i],M2_73_ALL[j]);
  greatest=Math.max(greatest,iou);
  assert.ok(iou<0.89,'near-duplicate original architecture '+M2_73_ALL[i].id+' and '+M2_73_ALL[j].id+' IoU '+iou);
 }
 assert.ok(greatest<0.89);
 assert.equal(new Set(M2_73_ALL.map(geometrySignature)).size,73);
});
