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
const old=[...createLegacyWatchtowerPool(),...createM2IndustryPool(),...createRegionalIndustryPool(),...createFrontierIndustryPool(),...createHinterlandPool(),...createMissingSlotIndustryPool(),...createVariant2IndustryPool(),...createVariant2ExpansionPool(),...createVariant2CompletionPool(),...createVariant3FirstPool(),...createVariant3SecondPool(),...createVariant3FinalPool(),...createVariant4FirstPool(),...createVariant4CompletionPool(),...createWatchtowerVariant2FirstPool()];
const next=createWatchtowerVariant2MediumLargePool(),all=[...old,...next];
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

test('ten medium/large original towers preserve all existing 140 source geometries',()=>{
 assert.equal(old.length,140);assert.equal(next.length,10);
 assert.deepEqual(next.map(b=>b.id),["r3:watchtower:temperate:medium:2","r3:watchtower:desert:medium:2","r3:watchtower:snow:medium:2","r3:watchtower:enchanted-forest:medium:2","r3:watchtower:mountain:medium:2","r3:watchtower:temperate:large:2","r3:watchtower:desert:large:2","r3:watchtower:snow:large:2","r3:watchtower:enchanted-forest:large:2","r3:watchtower:mountain:large:2"]);
 assert.deepEqual(validatePool(all,ASSET_CATALOG),{authored:150,remaining:210});
 assert.equal(new Set(all.map(b=>b.id)).size,150);assert.equal(new Set(all.map(geometryFingerprint)).size,150);
 assert.deepEqual(['lumberyard','mill','watchtower'].map(t=>all.filter(b=>b.type===t).length),[60,60,30]);
 assert.deepEqual(['medium','large'].map(size=>next.filter(b=>b.size===size).length),[5,5]);
});
test('ten original irregular tower footprints, physical stair and differentiated bearing roofs',()=>{
 const kinds=new Set();
 for(const b of next){
  const v=validateBlueprint(b,ASSET_CATALOG),map=voxelMap(b);
  assert.equal(v.cellCount,map.size);assert.equal(map.size,b.architecture.occupiedCoordinates);
  const f=b.modules.find(m=>m.role==='foundation').cells.length;
  assert.equal(f,b.architecture.footprintCells);
  assert.ok(f/(b.envelope.width*b.envelope.depth)<.84,b.id+' overfilled');
  const steps=b.architecture.stairSteps;
  assert.equal(b.modules.find(m=>m.role==='stair').cells.length,steps*2,b.id);
  assert.equal(b.modules.find(m=>m.role==='stair-support').cells.length,steps*(steps-1),b.id);
  assert.ok(b.modules.some(m=>m.role==='bearing-pitched-annex'&&m.cells.length>25),b.id+' no original annex ridgeline');
  assert.ok(b.modules.some(m=>m.role==='canopy-bearing')&&b.modules.some(m=>m.role==='canopy-roof'));
  assert.equal(b.architecture.observationAccess,true);
  assert.equal(b.architecture.creatorApproved,false);assert.equal(b.architecture.worldPlaced,false);
  assert.ok(!kinds.has(b.architecture.kind),b.id+' identical title');kinds.add(b.architecture.kind);
 }
});
test('all new tower footprints pass full 150-way exact 8-orientation 24×24 D4 IoU <0.89',()=>{
 const fs=all.map(b=>footprint(b,24));let max=0,nearest='';
 for(let i=old.length;i<all.length;i++){
  let best=0,near='';
  for(let j=0;j<all.length;j++)if(i!==j)for(let op=0;op<8;op++){
   const v=jaccard(fs[i],transformD4(fs[j],24,op));
   if(v>best){best=v;near=all[j].id;}
  }
  assert.ok(best<.89,all[i].id+' D4 mirrored or rotated copy '+near+' '+best);
  if(best>max){max=best;nearest=near;}
 }
 console.log('MYTHWROUGHT_3B_WATCHTOWER_VARIANT2_MEDIUM_LARGE_D4_MAX_JACCARD='+max.toFixed(6)+' nearest '+nearest);
});
test('all ten raised roof ridge cells and upper signal canopies physically join the true foundation',()=>{
 for(const b of next)assert.equal(foundationSupport(b,voxelMap(b)),b.architecture.occupiedCoordinates);
});
test('ten actual grounded 2-wide continuous stairs reach the observation terrace without virtual navigation',()=>{
 for(const b of next)assert.ok(physicallyReachableTower(b)>100,b.id);
});
test('stable original medium/large coordinate serialization and fail-closed unwritten tower slots',()=>{
 const copy=createWatchtowerVariant2MediumLargePool();
 for(let i=0;i<next.length;i++){
  assert.equal(serializeBlueprint(next[i]),serializeBlueprint(copy[i]));
  assert.equal(geometryFingerprint(next[i]),geometryFingerprint(copy[i]));
 }
 assert.throws(()=>createWatchtowerVariant2MediumLargeBlueprint('watchtower','temperate','small',2),/Only specifically authored/);
 assert.throws(()=>createWatchtowerVariant2MediumLargeBlueprint('watchtower','temperate','medium',3),/Only specifically authored/);
 assert.throws(()=>createWatchtowerVariant2MediumLargeBlueprint('barracks','temperate','medium',2),/Only specifically authored/);
});
test('60 real source-cube mesh/camera fits at all three physical-iPhone-shaped landscape profiles',()=>{
 let checked=0;
 for(const b of next)for(const cutaway of[false,true]){
  const mesh=createPreviewMesh(b,{cutaway});
  assert.equal(mesh.isDiagnosticEnvelope,true);assert.equal(mesh.notAssetShapeProof,true);
  assert.ok(mesh.sourceCells>250&&mesh.triangleCount>200&&mesh.triangleCount<50000,b.id);
  if(cutaway)assert.ok(mesh.sourceCells<b.architecture.occupiedCoordinates);
  for(const[w,h]of[[667,375],[844,390],[932,430]]){
   const camera=fitPreviewCamera(b.envelope,mesh.vertices,w-16,h-127);
   assert.ok(camera.projectedHalfWidth<.87&&camera.projectedHalfHeight<.87,b.id+' clipping at '+w+'x'+h);checked++;
  }
 }assert.equal(checked,60);
});
test('actual occupied source Pack1–5 physical assets, unplaced symbolic biomes and unresolved production AABB',()=>{
 const r=reviewWatchtowerVariant2MediumLargePhysicalDependencies();
 assert.equal(r.authored,10);assert.equal(r.creatorApproved,0);assert.equal(r.worldIntegrated,0);
 assert.equal(r.occupiedConceptualPositions,next.reduce((n,b)=>n+b.architecture.occupiedCoordinates,0));
 assert.equal(r.families.families,96);assert.equal(r.families.numericVariants,106);
 assert.equal(r.productionReady,false);assert.equal(r.readOnly,true);
 for(const key of ['perCellNumericVariantSelected','perCellYawSelected','realSelectionAndCollisionCertified','realMountAndSupportCertified','multiVoxelReservationCertified'])assert.equal(r[key],false);
 for(const v of r.assets){assert.ok(v.used>0);assert.notEqual(v.status,'not-live-registered');assert.equal(v.physicalFinalApproved,false);}
 for(const pack of ['pack1:','pack2:','pack3:','pack4:','pack5:'])
  assert.ok(r.assets.some(v=>v.symbol.startsWith(pack)),pack+' lacks physical source cell');
 for(const symbol of ['biome130:094','biome130:096','biome130:098']){
  const s=r.symbolicDependencies.find(x=>x.symbol===symbol);
  assert.ok(s,symbol+' missing symbolic deferred dependency');
  assert.equal(s.registeredNow,BIOME130_REGISTERED_SYMBOLS.includes(symbol));assert.equal(s.placedAsBuiltVoxel,false);
 }
 console.log('MYTHWROUGHT_3B_WATCHTOWER_VARIANT2_MEDIUM_LARGE_COUNTS='+JSON.stringify(next.map(b=>({id:b.id,cells:b.architecture.occupiedCoordinates,foundation:b.architecture.footprintCells,stairSteps:b.architecture.stairSteps}))));
});
