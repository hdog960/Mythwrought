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
import {createVariant4FirstBlueprint,createVariant4FirstPool} from '../../../src/building-pool/roadmap-3b/m2-variant4-first.mjs';
import {reviewVariant4FirstPhysicalDependencies} from '../../../src/building-pool/roadmap-3b/m2-variant4-first-dependencies.mjs';
import {createVariant4CompletionBlueprint,createVariant4CompletionPool} from '../../../src/building-pool/roadmap-3b/m2-variant4-completion.mjs';
import {reviewVariant4CompletionPhysicalDependencies} from '../../../src/building-pool/roadmap-3b/m2-variant4-completion-dependencies.mjs';
const old=[...createLegacyWatchtowerPool(),...createM2IndustryPool(),...createRegionalIndustryPool(),...createFrontierIndustryPool(),...createHinterlandPool(),...createMissingSlotIndustryPool(),...createVariant2IndustryPool(),...createVariant2ExpansionPool(),...createVariant2CompletionPool(),...createVariant3FirstPool(),...createVariant3SecondPool(),...createVariant3FinalPool(),...createVariant4FirstPool()];
const next=createVariant4CompletionPool(),all=[...old,...next];
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



test('complete fourth-variation industry adds twenty true coordinate-authored designs and preserves 115 earlier authored sources',()=>{
 assert.equal(old.length,115);assert.equal(next.length,20);
 assert.deepEqual(next.map(b=>b.id),["r3:lumberyard:temperate:medium:4","r3:lumberyard:temperate:large:4","r3:lumberyard:desert:small:4","r3:lumberyard:desert:medium:4","r3:lumberyard:snow:small:4","r3:lumberyard:snow:large:4","r3:lumberyard:enchanted-forest:medium:4","r3:lumberyard:enchanted-forest:large:4","r3:lumberyard:mountain:small:4","r3:lumberyard:mountain:medium:4","r3:mill:temperate:small:4","r3:mill:temperate:large:4","r3:mill:desert:medium:4","r3:mill:desert:large:4","r3:mill:snow:small:4","r3:mill:snow:medium:4","r3:mill:enchanted-forest:small:4","r3:mill:enchanted-forest:large:4","r3:mill:mountain:medium:4","r3:mill:mountain:large:4"]);
 assert.deepEqual(validatePool(all,ASSET_CATALOG),{authored:135,remaining:225});
 assert.equal(new Set(all.map(b=>b.id)).size,135);
 assert.equal(new Set(all.map(geometryFingerprint)).size,135);
 assert.deepEqual(['lumberyard','mill','watchtower'].map(t=>all.filter(b=>b.type===t).length),[60,60,15]);
 for(const type of ['lumberyard','mill'])for(const biome of BIOMES)for(const size of SIZES)
  assert.equal(all.filter(b=>b.type===type&&b.biome===biome&&b.size===size&&b.variant===4).length,1);
});
test('all twenty irregular masks, differentiated roofs, source pier modules, rooms and source coordinates are real',()=>{
 const titles=new Set();
 for(const b of next){
  const map=voxelMap(b),valid=validateBlueprint(b,ASSET_CATALOG);
  assert.equal(valid.cellCount,map.size);
  assert.equal(map.size,b.architecture.occupiedCoordinates);
  const f=b.modules.find(m=>m.role==='foundation').cells.length;
  assert.equal(f,b.architecture.footprintCells);
  assert.ok(f/(b.envelope.width*b.envelope.depth)<.84,b.id+' exceeds 84% site coverage');
  assert.equal(b.architecture.roofProfiles.length,4);
  assert.ok(b.modules.some(m=>m.role.startsWith('roof-pier-')));
  assert.equal(b.spaces.length,3);assert.equal(b.openings.length,1);
  assert.equal(b.architecture.creatorApproved,false);assert.equal(b.architecture.worldPlaced,false);
  assert.equal(b.architecture.perCellYawResolved,false);assert.equal(b.architecture.perCellVariantResolved,false);
  assert.ok(!titles.has(b.architecture.kind));titles.add(b.architecture.kind);
 }
});
test('8-way D4 rotated and mirrored strict normalized near-duplicate rejection against all 135, hard limit 0.89',()=>{
 const n=24,fp=all.map(b=>footprint(b,n));let worst=0,nearest='';
 for(let i=old.length;i<all.length;i++){
  let best=0,near='';
  for(let j=0;j<all.length;j++)if(i!==j)for(let op=0;op<8;op++){
   const v=jaccard(fp[i],transformD4(fp[j],n,op));if(v>best){best=v;near=all[j].id;}
  }
  assert.ok(best<.89,all[i].id+' D4 near duplicate '+near+' J='+best);
  if(best>worst){worst=best;nearest=near;}
 }
 console.log('MYTHWROUGHT_3B_M2_VARIANT4_COMPLETION_D4_MAX_JACCARD='+worst.toFixed(6)+' nearest '+nearest);
});
test('all twenty original building roof/cargo/partition voxels face-connected to real grounded foundation',()=>{
 for(const b of next)assert.equal(foundationSupport(b,voxelMap(b)),b.architecture.occupiedCoordinates);
});
test('all source workspaces reachable through fully unobstructed physically grounded two-wide routes',()=>{
 for(const b of next)assert.ok(reachable(b,voxelMap(b))>125,b.id);
});
test('twenty source programs serialize repeatably and unbuilt fortifications and wrong variants fail closed',()=>{
 const copy=createVariant4CompletionPool();
 for(let i=0;i<next.length;i++){
  assert.equal(serializeBlueprint(next[i]),serializeBlueprint(copy[i]));
  assert.equal(geometryFingerprint(next[i]),geometryFingerprint(copy[i]));
 }
 assert.throws(()=>createVariant4CompletionBlueprint('watchtower','snow','medium',4),/Unwritten/);
 assert.throws(()=>createVariant4CompletionBlueprint('mill','snow','medium',3),/Only specifically authored variant 4/);
});
test('120 genuine source-cell proxy mesh/camera native checks over specified iPhone landscape sizes',()=>{
 let total=0;
 for(const b of next)for(const cutaway of [false,true]){
  const m=createPreviewMesh(b,{cutaway});
  assert.equal(m.isDiagnosticEnvelope,true);assert.equal(m.notAssetShapeProof,true);
  assert.ok(m.sourceCells>200&&m.triangleCount>200&&m.triangleCount<50000,b.id);
  if(cutaway)assert.ok(m.sourceCells<b.architecture.occupiedCoordinates);
  for(const[w,h]of[[667,375],[844,390],[932,430]]){
   const c=fitPreviewCamera(b.envelope,m.vertices,w-16,h-127);
   assert.ok(c.projectedHalfWidth<.87&&c.projectedHalfHeight<.87,b.id+' clipped '+w+'x'+h);total++;
  }
 }
 assert.equal(total,120);
});
test('actual integrated Pack1–5 physical producer source cells; symbolic biome130 unresolved and no placement claims',()=>{
 const report=reviewVariant4CompletionPhysicalDependencies();
 assert.equal(report.authored,20);
 assert.equal(report.occupiedConceptualPositions,next.reduce((n,b)=>n+b.architecture.occupiedCoordinates,0));
 assert.equal(report.families.families,96);assert.equal(report.families.numericVariants,106);
 assert.equal(report.readOnly,true);assert.equal(report.productionReady,false);
 assert.equal(report.creatorApproved,0);assert.equal(report.worldIntegrated,0);
 for(const x of ['perCellNumericVariantSelected','perCellYawSelected','realSelectionAndCollisionCertified','realMountAndSupportCertified','multiVoxelReservationCertified'])
  assert.equal(report[x],false);
 for(const v of report.assets){assert.ok(v.used>0);assert.notEqual(v.status,'not-live-registered');assert.equal(v.physicalFinalApproved,false);}
 for(const pack of ['pack1:','pack2:','pack3:','pack4:','pack5:'])
  assert.ok(report.assets.some(v=>v.symbol.startsWith(pack)),pack+' missing real occupied source cell');
 for(const symbol of ['biome130:094','biome130:096','biome130:098']){
  const v=report.symbolicDependencies.find(x=>x.symbol===symbol);
  assert.ok(v,symbol+' must be explicitly audited');
  assert.equal(v.registeredNow,BIOME130_REGISTERED_SYMBOLS.includes(symbol));assert.equal(v.placedAsBuiltVoxel,false);
 }
 console.log('MYTHWROUGHT_3B_M2_VARIANT4_COMPLETION_COUNTS='+JSON.stringify(next.map(b=>({id:b.id,cells:b.architecture.occupiedCoordinates,footprint:b.architecture.footprintCells}))));
});
