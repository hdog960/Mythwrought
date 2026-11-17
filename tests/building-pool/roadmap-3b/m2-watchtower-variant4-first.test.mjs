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
import {createWatchtowerVariant2FirstBlueprint,createWatchtowerVariant2FirstPool} from '../../../src/building-pool/roadmap-3b/m2-watchtower-variant2-first.mjs';
import {reviewWatchtowerVariant2FirstPhysicalDependencies} from '../../../src/building-pool/roadmap-3b/m2-watchtower-variant2-first-dependencies.mjs';
import {createWatchtowerVariant2MediumLargeBlueprint,createWatchtowerVariant2MediumLargePool} from '../../../src/building-pool/roadmap-3b/m2-watchtower-variant2-medium-large.mjs';
import {reviewWatchtowerVariant2MediumLargePhysicalDependencies} from '../../../src/building-pool/roadmap-3b/m2-watchtower-variant2-medium-large-dependencies.mjs';
import {createWatchtowerVariant3FirstPool} from '../../../src/building-pool/roadmap-3b/m2-watchtower-variant3-first.mjs';
import {createWatchtowerVariant4FirstBlueprint,createWatchtowerVariant4FirstPool} from '../../../src/building-pool/roadmap-3b/m2-watchtower-variant4-first.mjs';
import {reviewWatchtowerVariant4FirstPhysicalDependencies} from '../../../src/building-pool/roadmap-3b/m2-watchtower-variant4-first-dependencies.mjs';
const old=[...createLegacyWatchtowerPool(),...createM2IndustryPool(),...createRegionalIndustryPool(),...createFrontierIndustryPool(),...createHinterlandPool(),...createMissingSlotIndustryPool(),...createVariant2IndustryPool(),...createVariant2ExpansionPool(),...createVariant2CompletionPool(),...createVariant3FirstPool(),...createVariant3SecondPool(),...createVariant3FinalPool(),...createVariant4FirstPool(),...createVariant4CompletionPool(),...createWatchtowerVariant2FirstPool(),...createWatchtowerVariant2MediumLargePool(),...createWatchtowerVariant3FirstPool()];
const next=createWatchtowerVariant4FirstPool(),all=[...old,...next];
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




function physicallyReachableTower(b){
 const map=voxelMap(b),solid=new Set(map.keys()),stairCells=new Set(b.modules.filter(m=>m.role==='stair').flatMap(m=>m.cells.map(([x,y,z])=>k(x,y,z))));
 const walk=(x,y,z)=>{
  if(x<0||z<0||y<2||x+1>=b.envelope.width||z>=b.envelope.depth||y+1>=b.envelope.height)return false;
  return [x,x+1].every(xx=>solid.has(k(xx,y-1,z))&&!solid.has(k(xx,y,z))&&!solid.has(k(xx,y+1,z)));
 };
 const entry=b.navigation.nodes.find(n=>n.id===b.navigation.entry);
 assert.ok(walk(entry.x,entry.y,entry.z),b.id+' entry not grounded and clear');
 const q=[[entry.x,entry.y,entry.z]],seen=new Set([k(entry.x,entry.y,entry.z)]);
 for(let i=0;i<q.length;i++){
  const [x,y,z]=q[i];
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])for(const dy of [0,1,-1]){
   const xx=x+dx,yy=y+dy,zz=z+dz,key=k(xx,yy,zz);
   if(seen.has(key)||!walk(xx,yy,zz))continue;
   if(dy!==0&&![xx,xx+1].some(px=>stairCells.has(k(px,yy-1,zz))))continue;
   seen.add(key);q.push([xx,yy,zz]);
  }
 }
 for(const node of b.navigation.nodes)assert.ok(seen.has(k(node.x,node.y,node.z)),b.id+' physically inaccessible '+node.id);
 return seen.size;
}


test('fifteen source-authored fourth-variation watchtowers preserve all 150 earlier geometry fingerprints',()=>{
 assert.equal(old.length,165);assert.equal(next.length,15);
 assert.deepEqual(next.map(b=>b.id),["r3:watchtower:temperate:small:4","r3:watchtower:desert:small:4","r3:watchtower:snow:small:4","r3:watchtower:enchanted-forest:small:4","r3:watchtower:mountain:small:4","r3:watchtower:temperate:medium:4","r3:watchtower:desert:medium:4","r3:watchtower:snow:medium:4","r3:watchtower:enchanted-forest:medium:4","r3:watchtower:mountain:medium:4","r3:watchtower:temperate:large:4","r3:watchtower:desert:large:4","r3:watchtower:snow:large:4","r3:watchtower:enchanted-forest:large:4","r3:watchtower:mountain:large:4"]);
 assert.deepEqual(validatePool(all,ASSET_CATALOG),{authored:180,remaining:180});
 assert.equal(new Set(all.map(b=>b.id)).size,180);
 assert.equal(new Set(all.map(geometryFingerprint)).size,180);
 assert.deepEqual(['lumberyard','mill','watchtower'].map(t=>all.filter(b=>b.type===t).length),[60,60,60]);
 assert.deepEqual(['small','medium','large'].map(sz=>next.filter(b=>b.size===sz).length),[5,5,5]);
});
test('fifteen original nonrectangular floorplans have source-backed stairs, elevated asymmetric crowns and two real turrets',()=>{
 const names=new Set();
 for(const b of next){
  const a=validateBlueprint(b,ASSET_CATALOG),map=voxelMap(b);
  assert.equal(a.cellCount,map.size);assert.equal(map.size,b.architecture.occupiedCoordinates);
  const foundation=b.modules.find(m=>m.role==='foundation').cells.length;
  assert.equal(foundation,b.architecture.footprintCells);
  assert.ok(foundation/(b.envelope.width*b.envelope.depth)<.84,b.id+' unrealistic full-site rectangle');
  const risers=b.architecture.stairSteps;
  assert.equal(b.modules.find(m=>m.role==='stair').cells.length,risers*2,b.id+' missing double treads');
  assert.equal(b.modules.find(m=>m.role==='stair-support').cells.length,risers*(risers-1),b.id+' missing real bearings');
  assert.ok(b.modules.find(m=>m.role==='bearing-pitched-annex')?.cells.length>20,b.id+' no staggered lower gables');
  assert.ok(b.modules.find(m=>m.role==='turret-ground-bearing')?.cells.length>40,b.id+' no source-grounded turret carriers');
  assert.ok(b.modules.find(m=>m.role==='turret-high-wall')?.cells.length>40,b.id+' no original upper turret');
  assert.ok(b.modules.find(m=>m.role==='turret-tiered-cap')?.cells.length>20,b.id+' no tiered turret roof');
  assert.ok(b.modules.find(m=>m.role==='turret-signal-finial')?.cells.length>0,b.id+' no attached signal finial');
  assert.ok(b.modules.find(m=>m.role==='canopy-bearing')?.cells.length>0&&b.modules.find(m=>m.role==='canopy-roof')?.cells.length>0);
  assert.equal(b.architecture.observationAccess,true);assert.equal(b.architecture.creatorApproved,false);assert.equal(b.architecture.worldPlaced,false);
  assert.ok(!names.has(b.architecture.kind),b.id+' reused title');names.add(b.architecture.kind);
 }
});
test('full 165-way strict normalized 24x24 D4 mirror/rotate hard IoU <0.89 for each fourth-variation tower',()=>{
 const fs=all.map(b=>footprint(b,24));let maximum=0,near='';
 for(let i=old.length;i<all.length;i++){
  let closest=0,label='';
  for(let j=0;j<all.length;j++)if(i!==j)for(let op=0;op<8;op++){
   const v=jaccard(fs[i],transformD4(fs[j],24,op));
   if(v>closest){closest=v;label=all[j].id;}
  }
  assert.ok(closest<.89,all[i].id+' hard D4 copy against '+label+' J='+closest);
  if(closest>maximum){maximum=closest;near=label;}
 }
 console.log('MYTHWROUGHT_3B_WATCHTOWER_VARIANT4_FIRST_D4_MAX_JACCARD='+maximum.toFixed(6)+' nearest '+near);
});
test('15 twin crown, physical four-corner load columns and annex roof regions remain 6-neighbor connected to real ground',()=>{
 for(const b of next)assert.equal(foundationSupport(b,voxelMap(b)),b.architecture.occupiedCoordinates);
});
test('all 15 actual two-wide supported rising stairs connect entrance to unobstructed upper observation deck',()=>{
 for(const b of next)assert.ok(physicallyReachableTower(b)>75,b.id+' no reachable upper terrace');
});
test('source-exact reproducibility, unchanged prior identities and zero fabricated variant-3 slots',()=>{
 const retry=createWatchtowerVariant4FirstPool();
 for(let i=0;i<next.length;i++){
  assert.equal(serializeBlueprint(next[i]),serializeBlueprint(retry[i]));
  assert.equal(geometryFingerprint(next[i]),geometryFingerprint(retry[i]));
 }
 assert.throws(()=>createWatchtowerVariant4FirstBlueprint('watchtower','temperate','medium',3),/Only specifically authored/);
 assert.throws(()=>createWatchtowerVariant4FirstBlueprint('barracks','temperate','medium',3),/Only specifically authored/);
 assert.throws(()=>createWatchtowerVariant4FirstBlueprint('watchtower','desert','huge',3),/Only specifically authored/);
});
test('90 source-specific dual-view camera-fit inspections at three iPhone landscape sizes',()=>{
 let total=0;
 for(const b of next)for(const cutaway of [false,true]){
  const mesh=createPreviewMesh(b,{cutaway});
  assert.equal(mesh.isDiagnosticEnvelope,true);assert.equal(mesh.notAssetShapeProof,true);
  assert.ok(mesh.sourceCells>200&&mesh.triangleCount>200&&mesh.triangleCount<90000,b.id+' proxy geometry overflow');
  if(cutaway)assert.ok(mesh.sourceCells<b.architecture.occupiedCoordinates);
  for(const[w,h]of[[667,375],[844,390],[932,430]]){
   const c=fitPreviewCamera(b.envelope,mesh.vertices,w-16,h-127);
   assert.ok(c.projectedHalfWidth<.87&&c.projectedHalfHeight<.87,b.id+' visual clipped '+w+'x'+h);total++;
  }
 }assert.equal(total,90);
});
test('real producer Pack 1-5 source family cells, biome130 deferred symbols and no false physical readiness',()=>{
 const p=reviewWatchtowerVariant4FirstPhysicalDependencies();
 assert.equal(p.authored,15);assert.equal(p.creatorApproved,0);assert.equal(p.worldIntegrated,0);
 assert.equal(p.occupiedConceptualPositions,next.reduce((n,b)=>n+b.architecture.occupiedCoordinates,0));
 assert.equal(p.families.families,96);assert.equal(p.families.numericVariants,106);
 assert.equal(p.productionReady,false);assert.equal(p.readOnly,true);
 for(const k of ['perCellNumericVariantSelected','perCellYawSelected','realSelectionAndCollisionCertified','realMountAndSupportCertified','multiVoxelReservationCertified'])assert.equal(p[k],false);
 for(const asset of p.assets){assert.ok(asset.used>0);assert.notEqual(asset.status,'not-live-registered');assert.equal(asset.physicalFinalApproved,false);}
 for(const pack of ['pack1:','pack2:','pack3:','pack4:','pack5:'])assert.ok(p.assets.some(a=>a.symbol.startsWith(pack)),pack+' not in placed source cells');
 for(const symbol of ['biome130:094','biome130:096','biome130:098']){
  const s=p.symbolicDependencies.find(x=>x.symbol===symbol);
  assert.ok(s,symbol+' dependency missing');assert.equal(s.registeredNow,BIOME130_REGISTERED_SYMBOLS.includes(symbol));assert.equal(s.placedAsBuiltVoxel,false);
 }
 console.log('MYTHWROUGHT_3B_WATCHTOWER_VARIANT4_FIRST_COUNTS='+JSON.stringify(next.map(b=>({id:b.id,cells:b.architecture.occupiedCoordinates,foundation:b.architecture.footprintCells,risers:b.architecture.stairSteps}))));
});

test('fourth-variation structural voids truly remove source-foundation and roof positions and produce supported elevated nonboxlike masses',()=>{
 const titles=new Set();
 for(const b of next){
  const v=validateBlueprint(b,ASSET_CATALOG),map=voxelMap(b);
  assert.equal(v.cellCount,map.size);assert.equal(map.size,b.architecture.occupiedCoordinates);
  assert.equal(b.architecture.actualKeepVoids,2,b.id+' missing structural 3D void');
  assert.equal(b.architecture.independentSteppedLofts,2,b.id+' no upper structural terrace masses');
  assert.equal(b.modules.find(m=>m.role==='foundation').cells.length,b.architecture.footprintCells);
  assert.ok(b.architecture.footprintCells/(b.envelope.width*b.envelope.depth)<.83,b.id+' still flat rectangle');
  assert.ok(b.modules.find(m=>m.role==='stepped-upper-keep-bearing')?.cells.length>20,b.id+' upper structural bearing absent');
  assert.ok(b.modules.find(m=>m.role==='stepped-upper-keep-roof')?.cells.length>10,b.id+' multi-height roof absent');
  assert.equal(b.architecture.worldPlaced,false);assert.equal(b.architecture.creatorApproved,false);
  assert.ok(!titles.has(b.architecture.kind),b.id+' duplicate structure theme');titles.add(b.architecture.kind);
 }
});

test('each authored keep cut actually removes source foundation voxels and cannot be an ineffective visual label',()=>{
 for(const b of next){
  const fp=new Set(b.modules.find(m=>m.role==='foundation').cells.map(([x,y,z])=>x+','+z));
  assert.equal(b.architecture.authoredCutVolumes.length,2);
  assert.ok(b.architecture.realRemovedKeepCells>8,b.id+' source volume cut too small');
  for(const[a,x1,c,z1]of b.architecture.authoredCutVolumes){
   assert.ok(a>=0&&c>=0&&a<=x1&&c<=z1&&x1<b.envelope.width&&z1<b.envelope.depth,b.id+' invalid cut');
   for(let x=a;x<=x1;x++)for(let z=c;z<=z1;z++)assert.ok(!fp.has(x+','+z),b.id+' fake roof-only notch '+[x,z]);
  }
 }
});
