import {BIOME130_REGISTERED_SYMBOLS} from '../../../src/biome130-registry.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {createVariant2CompletionBlueprint,createVariant2CompletionPool} from '../../../src/building-pool/roadmap-3b/m2-variant2-completion.mjs';
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
import {reviewVariant2CompletionPhysicalDependencies} from '../../../src/building-pool/roadmap-3b/m2-variant2-completion-dependencies.mjs';

const old=[...createLegacyWatchtowerPool(),...createM2IndustryPool(),...createRegionalIndustryPool(),...createFrontierIndustryPool(),...createHinterlandPool(),...createMissingSlotIndustryPool(),...createVariant2IndustryPool(),...createVariant2ExpansionPool()];
const next=createVariant2CompletionPool(),all=[...old,...next];
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
test('all 16 exact original M2 variant-two missing biome-size slots complete the first two industry variations without touching the 59 predecessors',()=>{
 assert.equal(old.length,59);
 assert.equal(next.length,16);
 assert.deepEqual(next.map(b=>b.id),[
 'r3:lumberyard:temperate:large:2',
 'r3:lumberyard:desert:medium:2',
 'r3:lumberyard:snow:small:2',
 'r3:lumberyard:snow:medium:2',
 'r3:lumberyard:enchanted-forest:small:2',
 'r3:lumberyard:enchanted-forest:large:2',
 'r3:lumberyard:mountain:small:2',
 'r3:lumberyard:mountain:medium:2',
 'r3:mill:temperate:medium:2',
 'r3:mill:temperate:large:2',
 'r3:mill:desert:small:2',
 'r3:mill:desert:large:2',
 'r3:mill:snow:small:2',
 'r3:mill:snow:large:2',
 'r3:mill:enchanted-forest:small:2',
 'r3:mill:mountain:medium:2'
 ]);
 assert.deepEqual(validatePool(all,ASSET_CATALOG),{authored:75,remaining:285});
 assert.equal(new Set(all.map(b=>b.id)).size,75);
 assert.equal(new Set(all.map(geometryFingerprint)).size,75);
 assert.equal(all.filter(b=>b.type==='watchtower').length,15);
 assert.equal(all.filter(b=>b.type==='lumberyard').length,30);
 assert.equal(all.filter(b=>b.type==='mill').length,30);
 assert.ok(next.every(b=>b.variant===2&&!b.activated&&b.status==='theoretical'));
});
test('all 30 first-variation and 30 second-variation lumberyards/mills appear exactly once across all five biomes and three size classes',()=>{
 for(const type of ['lumberyard','mill'])for(const biome of BIOMES)for(const size of SIZES)for(const variation of [1,2])
  assert.equal(all.filter(b=>b.type===type&&b.biome===biome&&b.size===size&&b.variant===variation).length,1,
   'missing or duplicated variation '+[type,biome,size,variation].join(':'));
});
test('variant-2 objects have exact voxel-count signatures, nonrectangular truly authored footprints and roof-bay supports',()=>{
 const expected=[7187,3286,2925,4301,2353,8369,3530,6176,5685,9984,2865,7965,3391,8970,3056,6254];
 assert.deepEqual(next.map(b=>b.architecture.occupiedCoordinates),expected);
 assert.equal(expected.reduce((a,b)=>a+b,0),86297);
 assert.equal(new Set(next.map(b=>b.architecture.kind)).size,16);
 for(const b of next){
  const stat=validateBlueprint(b,ASSET_CATALOG),map=voxelMap(b);
  assert.equal(stat.cellCount,b.architecture.occupiedCoordinates);
  assert.equal(map.size,b.architecture.occupiedCoordinates);
  const foundation=b.modules.find(m=>m.role==='foundation').cells.length;
  assert.equal(foundation,b.architecture.footprintCells,b.id+' source mask/foundation mismatch');
  assert.ok(foundation<b.envelope.width*b.envelope.depth*.84,b.id+' must use original irregular footprint');
  assert.equal(b.architecture.openAirFreightCourt,true);
  assert.ok(b.architecture.roofProfiles.length>=2);
  assert.ok(b.modules.filter(m=>m.role.startsWith('roof-pier-')).reduce((n,m)=>n+m.cells.length,0)>60);
  assert.ok(b.modules.some(m=>m.role==='wall')&&b.modules.some(m=>m.role==='roof'),b.id);
  assert.equal(b.spaces.length,3);assert.equal(b.openings.length,1);
  assert.ok(b.features.some(f=>f.assetRef===null&&typeof f.unresolvedDependency==='string'));
  assert.equal(b.architecture.worldPlaced,false);
  assert.equal(b.architecture.creatorApproved,false);
  assert.equal(b.architecture.perCellVariantResolved,false);
  assert.equal(b.architecture.perCellYawResolved,false);
 }
});
test('D4 rotation/reflection and scale-normalized near-duplicate audit checks against all 74 other blueprints',()=>{
 const n=24,fp=all.map(b=>footprint(b,n));
 let overallMax=0;
 for(let i=old.length;i<all.length;i++){
  let best=0,nearest='';
  for(let j=0;j<all.length;j++)if(i!==j){
   for(let op=0;op<8;op++){
    const overlap=jaccard(fp[i],transformD4(fp[j],n,op));
    if(overlap>best){best=overlap;nearest=all[j].id;}
   }
  }
  assert.ok(best<.89,all[i].id+' is potentially copied/mirrored architecture from '+nearest+' J='+best);
  overallMax=Math.max(overallMax,best);
 }
 console.log('MYTHWROUGHT_3B_M2_VARIANT2_D4_MAX_JACCARD='+overallMax.toFixed(6));
});
test('all sixteen actual conceptual load-bearing roofs, racks and walls connect to actual source foundations',()=>{
 for(const b of next)assert.equal(foundationSupport(b,voxelMap(b)),b.architecture.occupiedCoordinates);
});
test('all named work areas are reachable via two-wide grounded head-clear freight circulation in the irregular plans',()=>{
 for(const b of next)assert.ok(reachable(b,voxelMap(b))>180,b.id);
});
test('sixteen source-authored regional variant-2 blueprints serialize deterministically and reject any unbuilt variant',()=>{
 const copy=createVariant2CompletionPool();
 for(let i=0;i<next.length;i++){
  assert.equal(serializeBlueprint(next[i]),serializeBlueprint(copy[i]));
  assert.equal(geometryFingerprint(next[i]),geometryFingerprint(copy[i]));
 }
 assert.throws(()=>createVariant2CompletionBlueprint('lumberyard','temperate','small',2),/Unwritten/);
 assert.throws(()=>createVariant2CompletionBlueprint('mill','snow','large',3),/Only specifically authored variant 2/);
});
test('96 native source geometry, exterior/cutaway voxel mesh and phone-landscape camera checks',()=>{
 let tested=0;
 for(const b of next)for(const cutaway of [false,true]){
  const mesh=createPreviewMesh(b,{cutaway});
  assert.equal(mesh.isDiagnosticEnvelope,true);
  assert.equal(mesh.notAssetShapeProof,true);
  assert.ok(mesh.sourceCells>400&&mesh.triangleCount>250,b.id);
  assert.ok(mesh.triangleCount<50000,b.id+' triangle budget exceeded for cube proxy');
  if(cutaway)assert.ok(mesh.sourceCells<b.architecture.occupiedCoordinates,b.id);
  for(const [w,h] of [[667,375],[844,390],[932,430]]){
   const camera=fitPreviewCamera(b.envelope,mesh.vertices,w-16,h-127);
   assert.ok(camera.projectedHalfWidth<.87&&camera.projectedHalfHeight<.87,b.id+' clipping '+w+'x'+h);
   tested++;
  }
 }
 assert.equal(tested,96);
});
test('read-only physical ABI handoff uses the actual integrated manual five-pack and biome registry but certifies no building placement',()=>{
 const report=reviewVariant2CompletionPhysicalDependencies();
 assert.equal(report.authored,16);
 assert.equal(report.occupiedConceptualPositions,86297);
 assert.equal(report.families.families,96);
 assert.equal(report.families.numericVariants,106);
 assert.equal(report.readOnly,true);
 assert.equal(report.productionReady,false);
 assert.equal(report.creatorApproved,0);
 assert.equal(report.worldIntegrated,0);
 assert.equal(report.perCellNumericVariantSelected,false);
 assert.equal(report.perCellYawSelected,false);
 assert.equal(report.realSelectionAndCollisionCertified,false);
 assert.equal(report.realMountAndSupportCertified,false);
 assert.equal(report.multiVoxelReservationCertified,false);
 for(const v of report.assets){
  assert.ok(v.used>0&&v.usedBy.length>0);
  assert.equal(v.physicalFinalApproved,false);
  assert.notEqual(v.status,'not-live-registered',v.symbol+' occupied asset family unregistered');
 }
 for(const symbol of ['biome130:094','biome130:096','biome130:098']){
  const s=report.symbolicDependencies.find(x=>x.symbol===symbol);
  assert.ok(s,symbol);
  assert.equal(s.registeredNow,BIOME130_REGISTERED_SYMBOLS.includes(symbol),symbol);
  assert.equal(s.placedAsBuiltVoxel,false,symbol);
 }
 console.log('MYTHWROUGHT_3B_M2_VARIANT2_COMPLETION_COUNTS='+JSON.stringify(next.map(b=>({
  id:b.id,cells:b.architecture.occupiedCoordinates,footprint:b.architecture.footprintCells,
  roofProfiles:b.architecture.roofProfiles,rooms:b.spaces.length
 }))));
});
