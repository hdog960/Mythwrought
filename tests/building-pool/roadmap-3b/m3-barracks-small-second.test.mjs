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
import {createWatchtowerVariant4FirstPool} from '../../../src/building-pool/roadmap-3b/m2-watchtower-variant4-first.mjs';
import {createWatchtowerVariant5FinalBlueprint,createWatchtowerVariant5FinalPool} from '../../../src/building-pool/roadmap-3b/m2-watchtower-variant5-final.mjs';
import {reviewWatchtowerVariant5FinalPhysicalDependencies} from '../../../src/building-pool/roadmap-3b/m2-watchtower-variant5-final-dependencies.mjs';
import {createM3BarracksSmallFirstPool} from '../../../src/building-pool/roadmap-3b/m3-barracks-small-first.mjs';
import {createM3BarracksSmallSecondBlueprint,createM3BarracksSmallSecondPool} from '../../../src/building-pool/roadmap-3b/m3-barracks-small-second.mjs';
import {reviewM3BarracksSmallSecondPhysicalDependencies} from '../../../src/building-pool/roadmap-3b/m3-barracks-small-second-dependencies.mjs';
const old=[...createLegacyWatchtowerPool(),...createM2IndustryPool(),...createRegionalIndustryPool(),...createFrontierIndustryPool(),...createHinterlandPool(),...createMissingSlotIndustryPool(),...createVariant2IndustryPool(),...createVariant2ExpansionPool(),...createVariant2CompletionPool(),...createVariant3FirstPool(),...createVariant3SecondPool(),...createVariant3FinalPool(),...createVariant4FirstPool(),...createVariant4CompletionPool(),...createWatchtowerVariant2FirstPool(),...createWatchtowerVariant2MediumLargePool(),...createWatchtowerVariant3FirstPool(),...createWatchtowerVariant4FirstPool(),...createWatchtowerVariant5FinalPool(),...createM3BarracksSmallFirstPool()];
const next=createM3BarracksSmallSecondPool(),all=[...old,...next];
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





test('five uniquely authored four-room small barracks preserve all 195 previous geometric fingerprints and slot IDs',()=>{
 assert.equal(old.length,200);assert.equal(next.length,5);
 assert.deepEqual(next.map(b=>b.id),["r3:barracks:temperate:small:2","r3:barracks:desert:small:2","r3:barracks:snow:small:2","r3:barracks:enchanted-forest:small:2","r3:barracks:mountain:small:2"]);
 assert.deepEqual(validatePool(all,ASSET_CATALOG),{authored:205,remaining:155});
 assert.equal(new Set(all.map(b=>b.id)).size,205);
 assert.equal(new Set(all.map(geometryFingerprint)).size,205);
 assert.equal(all.filter(b=>b.type==='watchtower').length,75);
 assert.equal(all.filter(b=>b.type==='barracks').length,10);
});
test('five source-authored nonboxlike barracks have four separate walkable rooms and real two-wide paths',()=>{
 for(const b of next){
  assert.equal(b.type,'barracks');assert.equal(b.size,'small');assert.equal(b.variant,2);
  assert.equal(b.architecture.physicalFourRoomPlan,true);
  assert.equal(b.architecture.groundedTwoWideRoute,true);
  assert.equal(b.architecture.sourceRooms.length,4);
  assert.equal(b.spaces.filter(s=>['bunks','mess','armory','duty'].includes(s.kind)).length,4);
  assert.equal(b.navigation.nodes.length,10); // entry, muster, 4 junctions + 4 room nodes
  assert.ok(b.clearances.length>=9);
  const source=voxelMap(b),v=validateBlueprint(b,ASSET_CATALOG);
  assert.equal(v.cellCount,source.size);assert.equal(source.size,b.architecture.sourceCellCount);
  assert.equal(b.modules.find(m=>m.role==='foundation').cells.length,b.architecture.footprintCells);
  assert.ok(b.architecture.footprintCells/(b.envelope.width*b.envelope.depth)<.84,b.id+' rectangular overfill');
  assert.equal(b.architecture.worldPlaced,false);assert.equal(b.architecture.creatorApproved,false);
  assert.ok(b.modules.find(m=>m.role==='room-bulkhead')?.cells.length>30,b.id+' no real room separation walls');
  assert.ok(b.modules.find(m=>m.role==='source-bearing-roof-mass')?.cells.length>50,b.id+' no true pitched loft');
  assert.ok(b.modules.find(m=>m.role==='equipment-store')?.cells.filter(c=>c[3]==='pack4:057').length===4,b.id+' missing real pack4 source crates');
  assert.ok(reachable(b,source)>100,b.id+' physically disconnected rooms');
 }
});
test('all five barracks survive exact 6-neighbor from grounded foundation through eave trusses and all high roof cells',()=>{
 for(const b of next)assert.equal(foundationSupport(b,voxelMap(b)),b.architecture.sourceCellCount);
});
test('all 205 full-pool normalized 24x24 8-way D4 overlapping footprints strictly below 0.89',()=>{
 const fs=all.map(b=>footprint(b,24));let max=0,nearest='';
 for(let i=old.length;i<all.length;i++){
  let best=0,other='';
  for(let j=0;j<all.length;j++)if(i!==j)for(let op=0;op<8;op++){
   const score=jaccard(fs[i],transformD4(fs[j],24,op));
   if(score>best){best=score;other=all[j].id;}
  }
  assert.ok(best<.89,all[i].id+' rejected D4 near copy of '+other+' '+best);
  if(best>max){max=best;nearest=other;}
 }
 console.log('MYTHWROUGHT_3B_M3_BARRACKS_SMALL_SECOND_D4_MAX_JACCARD='+max.toFixed(6)+' nearest '+nearest);
});
test('each second-variation source coordinate room access route is physically backed and every fixture room is usable',()=>{
 for(const b of next){
  const map=voxelMap(b);
  const roomNodes=new Map(b.navigation.nodes.map(n=>[n.id,n]));
  for(const s of b.spaces){
   const n=roomNodes.get(s.accessNode);
   assert.ok(n,s.id+' missing real access node');
   assert.ok([n.x,n.x+1].every(x=>map.has(k(x,1,n.z))&&!map.has(k(x,2,n.z))&&!map.has(k(x,3,n.z))),b.id+' room headroom/floor inaccessible');
  }
  for(const r of b.architecture.sourceRooms){
   assert.equal(r.bridge[3]-r.bridge[2]+1,2);
   assert.ok(r.bridge[1]-r.bridge[0]>=3,b.id+' fake thin passage');
  }
 }
});
test('source coordinate determinism and explicit rejection of unbuilt slots',()=>{
 const again=createM3BarracksSmallSecondPool();
 for(let i=0;i<next.length;i++){
  assert.equal(serializeBlueprint(next[i]),serializeBlueprint(again[i]));
  assert.equal(geometryFingerprint(next[i]),geometryFingerprint(again[i]));
 }
 assert.throws(()=>createM3BarracksSmallSecondBlueprint('barracks','temperate','medium',1),/Only authored/);
 assert.throws(()=>createM3BarracksSmallSecondBlueprint('barracks','desert','small',3),/Only authored/);
 assert.throws(()=>createM3BarracksSmallSecondBlueprint('gatehouse','temperate','small',1),/Only authored/);
});
test('30 genuine-source cube mesh/camera-fit checks for real iPhone landscape-shaped viewports',()=>{
 let count=0;
 for(const b of next)for(const cutaway of [false,true]){
  const m=createPreviewMesh(b,{cutaway});
  assert.equal(m.isDiagnosticEnvelope,true);assert.equal(m.notAssetShapeProof,true);
  assert.ok(m.sourceCells>200&&m.triangleCount>200&&m.triangleCount<100000,b.id);
  if(cutaway)assert.ok(m.sourceCells<b.architecture.sourceCellCount);
  for(const[w,h]of[[667,375],[844,390],[932,430]]){
   const c=fitPreviewCamera(b.envelope,m.vertices,w-16,h-127);
   assert.ok(c.projectedHalfWidth<.87&&c.projectedHalfHeight<.87,b.id+' clipped '+w+'x'+h);count++;
  }
 }
 assert.equal(count,30);
});
test('read-only true physical Pack1-5 family source-cell audit retains unresolved yaw/AABB/collision approvals',()=>{
 const a=reviewM3BarracksSmallSecondPhysicalDependencies();
 assert.equal(a.authored,5);assert.equal(a.creatorApproved,0);assert.equal(a.worldIntegrated,0);
 assert.equal(a.occupiedConceptualPositions,next.reduce((n,b)=>n+b.architecture.sourceCellCount,0));
 assert.equal(a.families.families,96);assert.equal(a.families.numericVariants,106);
 assert.equal(a.productionReady,false);assert.equal(a.readOnly,true);
 for(const k of ['perCellNumericVariantSelected','perCellYawSelected','realSelectionAndCollisionCertified','realMountAndSupportCertified','multiVoxelReservationCertified'])assert.equal(a[k],false);
 for(const asset of a.assets){assert.ok(asset.used>0);assert.notEqual(asset.status,'not-live-registered');assert.equal(asset.physicalFinalApproved,false);}
 for(const pack of ['pack1:','pack2:','pack3:','pack4:','pack5:'])assert.ok(a.assets.some(x=>x.symbol.startsWith(pack)),pack+' physical source family never occupies a cell');
 console.log('MYTHWROUGHT_3B_M3_BARRACKS_SMALL_SECOND_COUNTS='+JSON.stringify(next.map(b=>({id:b.id,sourceCells:b.architecture.sourceCellCount,foundation:b.architecture.footprintCells,rooms:b.architecture.sourceRooms.length}))));
});

test('two literal open-air courtyards (three in mountain) are genuine absent source ground/roof and remain unoccupied by passages',()=>{
 for(const b of next){
  const m=voxelMap(b),courts=b.architecture.courtyardRects;
  assert.ok(courts.length>=2&&courts.length<=3,b.id+' courtyard census');
  assert.ok(b.architecture.actualRemovedCourtyardCells>=16,b.id+' undercut real source ground');
  for(const [a,c,e,g] of courts)for(let x=a;x<=c;x++)for(let z=e;z<=g;z++){
   assert.ok(!m.has(k(x,0,z)),b.id+' false courtyard/foundation remains '+[x,z]);
   assert.ok(!m.has(k(x,7,z)),b.id+' roof obscures open-air courtyard '+[x,z]);
  }
 }
});
test('nonboxlike high-pitched roof silhouettes and two supported distinct raised watch spurs exist as real 3D source voxels',()=>{
 for(const b of next){
  assert.equal(b.architecture.roofSpurs.length,2,b.id+' absent asymmetric spurs');
  assert.equal(b.architecture.roofAxes.length,4,b.id+' authored room ridge axes');
  const m=voxelMap(b),sp=b.modules.find(x=>x.role==='roof-watch-spur');
  assert.ok(sp?.cells.length>20,b.id+' unsupported roof watch mass');
  const yvals=new Set(sp.cells.map(c=>c[1]));
  assert.ok(yvals.size>=5,b.id+' fake short roof tower');
  for(const [z,rise]of b.architecture.roofSpurs){
   for(let x=b.navigation.entry?b.navigation.nodes.find(n=>n.id==='entry').x+3:0;x<=b.navigation.nodes.find(n=>n.id==='entry').x+4;x++){
    assert.ok(m.has(k(x,7,z)),b.id+' missing true roof carrier');
    assert.ok(m.has(k(x,8,z)),b.id+' floating roof-tower first cell');
   }
  }
  assert.ok(b.modules.find(x=>x.role==='source-bearing-roof-mass').cells.length>100,b.id+' missing layered roof profile');
 }
});
