import {BIOME130_REGISTERED_SYMBOLS} from '../../../src/biome130-registry.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {createVariant3SecondBlueprint,createVariant3SecondPool} from '../../../src/building-pool/roadmap-3b/m2-variant3-second.mjs';
import {createVariant3FirstPool} from '../../../src/building-pool/roadmap-3b/m2-variant3-first.mjs';
import {createVariant2CompletionPool} from '../../../src/building-pool/roadmap-3b/m2-variant2-completion.mjs';
import {createVariant2ExpansionPool} from '../../../src/building-pool/roadmap-3b/m2-variant2-expansion.mjs';
import {BIOMES,SIZES} from '../../../src/building-pool/roadmap-3b/roster.mjs';
import {createVariant2IndustryPool} from '../../../src/building-pool/roadmap-3b/m2-variant2.mjs';
import {createLegacyWatchtowerPool} from '../../../src/building-pool/roadmap-3b/legacy-watchtowers.mjs';
import {createM2IndustryPool} from '../../../src/building-pool/roadmap-3b/m2-industry.mjs';
import {createRegionalIndustryPool} from '../../../src/building-pool/roadmap-3b/m2-regional.mjs';
import {createFrontierIndustryPool} from '../../../src/building-pool/roadmap-3b/m2-frontier.mjs';
import {createHinterlandPool} from '../../../src/building-pool/roadmap-3b/m2-hinterland.mjs';
import {createMissingSlotIndustryPool} from '../../../src/building-pool/roadmap-3b/m2-missing-sizes.mjs';
import {ASSET_CATALOG} from '../../../src/building-pool/roadmap-3b/assets.mjs';
import {validatePool,validateBlueprint,serializeBlueprint,geometryFingerprint} from '../../../src/building-pool/roadmap-3b/contract.mjs';
import {createPreviewMesh} from './preview-mesh.mjs';
import {fitPreviewCamera} from './preview-camera.mjs';
import {reviewVariant3SecondPhysicalDependencies} from '../../../src/building-pool/roadmap-3b/m2-variant3-second-dependencies.mjs';

import {createVariant3FinalBlueprint,createVariant3FinalPool} from '../../../src/building-pool/roadmap-3b/m2-variant3-final.mjs';
const old=[...createLegacyWatchtowerPool(),...createM2IndustryPool(),...createRegionalIndustryPool(),...createFrontierIndustryPool(),...createHinterlandPool(),...createMissingSlotIndustryPool(),...createVariant2IndustryPool(),...createVariant2ExpansionPool(),...createVariant2CompletionPool(),...createVariant3FirstPool(),...createVariant3SecondPool()];
const next=createVariant3FinalPool(),all=[...old,...next];
const k=(x,y,z)=>x+','+y+','+z;
function voxelMap(b){
 const map=new Map();
 for(const m of b.modules)for(const c of m.cells){
  const key=k(c[0],c[1],c[2]);
  assert.ok(!map.has(key),b.id+' repeated source voxel '+key);
  map.set(key,{role:m.role,c});
 }
 return map;
}
function foundationSupport(b,map){
 const seen=new Set(),q=[];
 for(const [key,v] of map)if(v.role==='foundation'){seen.add(key);q.push(v.c);}
 assert.ok(q.length>250,b.id+' no connected real foundation');
 for(let i=0;i<q.length;i++){
  const [x,y,z]=q[i];
  for(const [dx,dy,dz] of [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]]){
   const p=k(x+dx,y+dy,z+dz);
   if(map.has(p)&&!seen.has(p)){seen.add(p);q.push(map.get(p).c);}
  }
 }
 assert.equal(seen.size,map.size,b.id+' orphan roof cell/unsupported decoration');
 return q.length;
}
function reachable(b,map){
 const walk=(x,y,z)=>x>=0&&x+1<b.envelope.width&&z>=0&&z<b.envelope.depth&&y>=2&&
  [x,x+1].every(xx=>map.has(k(xx,y-1,z))&&!map.has(k(xx,y,z))&&!map.has(k(xx,y+1,z)));
 const from=b.navigation.nodes.find(x=>x.id===b.navigation.entry);
 assert.ok(walk(from.x,from.y,from.z),b.id+' entry blocked');
 const seen=new Set([k(from.x,from.y,from.z)]),q=[[from.x,from.y,from.z]];
 for(let i=0;i<q.length;i++){
  const [x,y,z]=q[i];
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const nx=x+dx,nz=z+dz,key=k(nx,y,nz);
   if(!seen.has(key)&&walk(nx,y,nz)){seen.add(key);q.push([nx,y,nz]);}
  }
 }
 for(const node of b.navigation.nodes)assert.ok(seen.has(k(node.x,node.y,node.z)),b.id+' unreachable '+node.id);
 for(const r of b.clearances)for(let x=r.x;x<r.x+r.width;x++)
  for(let y=r.y;y<r.y+r.height;y++)for(let z=r.z;z<r.z+r.depth;z++)
   assert.ok(!map.has(k(x,y,z)),b.id+' obstructed two-wide corridor '+[x,y,z]);
 return seen.size;
}
// A scale-normalized, palette-independent footprint. Reflect and rotate all
// eight D4 presentations before asking whether an architectural variant is
// a reskin, mirror, quarter-turn or near-copy of an inherited/earlier design.
function footprint(b,n=24){
 const set=new Set();
 for(const m of b.modules)if(m.role==='foundation')for(const [x,y,z] of m.cells)
  set.add(Math.round(x/(b.envelope.width-1)*(n-1))+','+Math.round(z/(b.envelope.depth-1)*(n-1)));
 return set;
}
function transformD4(set,n,op){
 const out=new Set();
 for(const key of set){
  let [x,z]=key.split(',').map(Number);
  if(op&1)x=n-1-x;
  if(op&2)z=n-1-z;
  if(op&4){const t=x;x=z;z=t;}
  out.add(x+','+z);
 }
 return out;
}
function jaccard(a,b){
 let intersection=0;for(const v of a)if(b.has(v))intersection++;
 return intersection/(a.size+b.size-intersection);
}
import {reviewVariant3FinalPhysicalDependencies} from '../../../src/building-pool/roadmap-3b/m2-variant3-final-dependencies.mjs';

test('ten final variation-3 source plans preserve all 95 earlier authored designs and exact 15 legacy watchtowers',()=>{
 assert.equal(old.length,95);assert.equal(next.length,10);
 assert.deepEqual(next.map(b=>b.id),["r3:lumberyard:temperate:large:3","r3:lumberyard:desert:medium:3","r3:lumberyard:snow:small:3","r3:lumberyard:enchanted-forest:medium:3","r3:lumberyard:mountain:medium:3","r3:mill:temperate:large:3","r3:mill:desert:large:3","r3:mill:snow:small:3","r3:mill:enchanted-forest:small:3","r3:mill:mountain:medium:3"]);
 assert.deepEqual(validatePool(all,ASSET_CATALOG),{authored:105,remaining:255});
 assert.equal(new Set(all.map(b=>b.id)).size,105);
 assert.equal(new Set(all.map(geometryFingerprint)).size,105);
 assert.deepEqual([all.filter(b=>b.type==='lumberyard').length,all.filter(b=>b.type==='mill').length,all.filter(b=>b.type==='watchtower').length],[45,45,15]);
});
test('all fifteen per-biome/size third-variation lumberyard and mill slots now have actually authored unique source',()=>{
 for(const type of ['lumberyard','mill'])for(const biome of BIOMES)for(const size of SIZES){
  assert.equal(all.filter(b=>b.type===type&&b.biome===biome&&b.size===size&&b.variant===3).length,1);
 }
 for(const b of next)assert.equal(b.status,'theoretical');
});
test('ten original nonrectangular masks, split roofs, physical supports and distinct work areas are source-authored',()=>{
 for(const b of next){
  const m=voxelMap(b),valid=validateBlueprint(b,ASSET_CATALOG);
  assert.equal(valid.cellCount,b.architecture.occupiedCoordinates);
  assert.equal(m.size,b.architecture.occupiedCoordinates);
  const footing=b.modules.find(x=>x.role==='foundation').cells.length;
  assert.equal(footing,b.architecture.footprintCells);
  assert.ok(footing<b.envelope.width*b.envelope.depth*.84,b.id+' site coverage');
  assert.ok(b.architecture.roofProfiles.length>=3);
  assert.ok(b.modules.filter(x=>x.role.startsWith('roof-pier-')).reduce((n,x)=>n+x.cells.length,0)>35);
  assert.equal(b.spaces.length,3);assert.equal(b.openings.length,1);
  assert.ok(b.features.some(x=>x.assetRef===null&&x.unresolvedDependency));
  assert.equal(b.architecture.worldPlaced,false);assert.equal(b.architecture.creatorApproved,false);
  assert.equal(b.architecture.perCellVariantResolved,false);assert.equal(b.architecture.perCellYawResolved,false);
 }
});
test('new cohort rejects exact geometry, normalized D4 mirrors/rotations and >=0.89 footprint similarity against the complete prior pool',()=>{
 const n=24,fp=all.map(b=>footprint(b,n));
 let maximum=0;
 for(let i=old.length;i<all.length;i++){
  let best=0,near='';
  for(let j=0;j<all.length;j++)if(i!==j)for(let op=0;op<8;op++){
    const v=jaccard(fp[i],transformD4(fp[j],n,op));
    if(v>best){best=v;near=all[j].id;}
  }
  assert.ok(best<.89,all[i].id+' near-duplicates '+near+' with J='+best);
  maximum=Math.max(maximum,best);
 }
 console.log('MYTHWROUGHT_3B_M2_VARIANT3_FINAL_D4_MAX_JACCARD='+maximum.toFixed(6));
});
test('all ten final third-variation source roofs, interior partitions and material racks have grounded face connectivity',()=>{
 for(const b of next)assert.equal(foundationSupport(b,voxelMap(b)),b.architecture.occupiedCoordinates);
});
test('all ten final new workrooms have physically empty two-wide walking routes and ground support',()=>{
 for(const b of next)assert.ok(reachable(b,voxelMap(b))>140,b.id);
});
test('deterministic per-cell source serialization and no fantasy unwritten slots',()=>{
 const repeat=createVariant3FinalPool();
 for(let i=0;i<next.length;i++){
  assert.equal(serializeBlueprint(next[i]),serializeBlueprint(repeat[i]));
  assert.equal(geometryFingerprint(next[i]),geometryFingerprint(repeat[i]));
 }
 assert.throws(()=>createVariant3FinalBlueprint('mill','desert','small',3),/Unwritten/);
 assert.throws(()=>createVariant3FinalBlueprint('mill','desert','large',4),/Only specifically authored variant 3/);
});
test('60 native genuine source-cell preview-mesh and fitted mobile landscape diagnostic camera checks',()=>{
 let checked=0;
 for(const b of next)for(const cutaway of [false,true]){
  const mesh=createPreviewMesh(b,{cutaway});
  assert.equal(mesh.isDiagnosticEnvelope,true);assert.equal(mesh.notAssetShapeProof,true);
  assert.ok(mesh.sourceCells>300&&mesh.triangleCount>200);
  assert.ok(mesh.triangleCount<50000,b.id+' diagnostic triangle budget exceeded');
  if(cutaway)assert.ok(mesh.sourceCells<b.architecture.occupiedCoordinates);
  for(const[w,h]of[[667,375],[844,390],[932,430]]){
   const cam=fitPreviewCamera(b.envelope,mesh.vertices,w-16,h-127);
   assert.ok(cam.projectedHalfWidth<.87&&cam.projectedHalfHeight<.87,b.id+' visual clipped '+w+'x'+h);checked++;
  }
 }
 assert.equal(checked,60);
});
test('actual integrated five-pack and biome130 read-only source physical ABI, without claiming runtime readiness',()=>{
 const report=reviewVariant3FinalPhysicalDependencies();
 assert.equal(report.authored,10);
 assert.equal(report.occupiedConceptualPositions,next.reduce((n,b)=>n+b.architecture.occupiedCoordinates,0));
 assert.equal(report.families.families,96);assert.equal(report.families.numericVariants,106);
 assert.equal(report.readOnly,true);assert.equal(report.productionReady,false);
 assert.equal(report.creatorApproved,0);assert.equal(report.worldIntegrated,0);
 for(const x of ['perCellNumericVariantSelected','perCellYawSelected','realSelectionAndCollisionCertified','realMountAndSupportCertified','multiVoxelReservationCertified'])
  assert.equal(report[x],false,x);
 for(const a of report.assets){assert.ok(a.used>0);assert.notEqual(a.status,'not-live-registered');assert.equal(a.physicalFinalApproved,false);}
 for(const symbol of ['biome130:094','biome130:096','biome130:098']){
  const item=report.symbolicDependencies.find(s=>s.symbol===symbol);
  assert.ok(item,symbol+' must be explicitly tracked');
  assert.equal(item.registeredNow,BIOME130_REGISTERED_SYMBOLS.includes(symbol),symbol+' must not be misreported as live');
  assert.equal(item.placedAsBuiltVoxel,false,symbol+' must not be occupied as a built cell');
 }
 const pack5Areas=["r3:lumberyard:desert:medium:3","r3:lumberyard:snow:small:3","r3:lumberyard:mountain:medium:3","r3:mill:temperate:large:3","r3:mill:desert:large:3","r3:mill:enchanted-forest:small:3"];
 for(const id of pack5Areas){
  assert.ok(report.assets.some(a=>a.symbol.startsWith('pack5:')&&a.usedBy.includes(id)),id+' has no real Pack5 occupied source cell');
 }
 for(const pack of ['pack1:','pack2:','pack3:','pack4:','pack5:']){
  assert.ok(report.assets.some(a=>a.symbol.startsWith(pack)),pack+' must have real authored source-cell use');
 }
 console.log('MYTHWROUGHT_3B_M2_VARIANT3_FINAL_COUNTS='+JSON.stringify(next.map(b=>({id:b.id,cells:b.architecture.occupiedCoordinates,footprint:b.architecture.footprintCells}))));
});
