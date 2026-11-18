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
import {createRoadmapC3BMediumBarracksPool} from '../../../src/building-pool/roadmap-3b/m3-barracks-medium-roadmap-c.mjs';
import {createRoadmapC3BWhitegaleMediumBarracksPool} from '../../../src/building-pool/roadmap-3b/m3-whitegale-medium-barracks-roadmap-c.mjs';
import {reviewRoadmapC3BWhitegaleMediumBarracksPhysicalDependencies} from '../../../src/building-pool/roadmap-3b/m3-whitegale-medium-barracks-roadmap-c-dependencies.mjs';
const prior=[...createLegacyWatchtowerPool(),...createM2IndustryPool(),...createRegionalIndustryPool(),...createFrontierIndustryPool(),...createHinterlandPool(),...createMissingSlotIndustryPool(),...createVariant2IndustryPool(),...createVariant2ExpansionPool(),...createVariant2CompletionPool(),...createVariant3FirstPool(),...createVariant3SecondPool(),...createVariant3FinalPool(),...createVariant4FirstPool(),...createVariant4CompletionPool(),...createWatchtowerVariant2FirstPool(),...createWatchtowerVariant2MediumLargePool(),...createWatchtowerVariant3FirstPool(),...createWatchtowerVariant4FirstPool(),...createWatchtowerVariant5FinalPool(),...createM3BarracksSmallFirstPool(),...createM3BarracksSmallSecondPool(),...createRoadmapC3BMediumBarracksPool()];
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

const fresh=createRoadmapC3BWhitegaleMediumBarracksPool(),all=[...prior,...fresh];
test('one original source-authored medium barracks preserves prior 206 3B sources and unique IDs',()=>{
 assert.equal(prior.length,206);assert.equal(fresh.length,1);assert.equal(fresh[0].id,'r3:barracks:snow:medium:1');
 assert.deepEqual(validatePool(all,ASSET_CATALOG),{authored:207,remaining:153});
 assert.equal(new Set(all.map(b=>b.id)).size,207);assert.equal(new Set(all.map(geometryFingerprint)).size,207);
 assert.equal(all.filter(b=>b.type==='watchtower').length,75);assert.equal(all.filter(b=>b.type==='barracks').length,12);
});
test('medium six-room Whitegale barracks carries genuine connected physical cells, open courts, and full support',()=>{
 const b=fresh[0],map=voxelMap(b),check=validateBlueprint(b,ASSET_CATALOG);
 assert.equal(check.cellCount,map.size);assert.equal(b.architecture.sourceCellCount,map.size);
 assert.deepEqual([b.type,b.biome,b.size,b.variant],['barracks','snow','medium',1]);
 assert.deepEqual(new Set(b.spaces.map(s=>s.kind)),new Set(['muster','bunks','mess','armory','duty','infirmary','drill']));
 assert.equal(b.architecture.sourceRooms.length,6);assert.equal(b.architecture.roofAxes.length,6);
 assert.ok(b.architecture.footprintCells>1500&&b.architecture.footprintCells/(58*61)<.84);
 assert.equal(b.architecture.openCourtyards,2);assert.ok(b.architecture.actualRemovedCourtyardCells>=36);
 assert.equal(b.modules.find(m=>m.role==='equipment-store').cells.filter(c=>c[3]==='pack4:057').length,6);
 assert.ok(b.modules.find(m=>m.role==='source-bearing-roof-mass')?.cells.length>100);
 assert.ok(reachable(b,map)>150);assert.equal(foundationSupport(b,map),map.size);
 for(const [a,c,d,e] of b.architecture.courtyardRects)for(let x=a;x<=c;x++)for(let z=d;z<=e;z++)for(let y=0;y<=15;y++)assert.ok(!map.has(k(x,y,z)),'open court contains a physical block');
 for(const [z,rise] of b.architecture.roofSpurs)for(const x of [30,31])for(const zz of [z,z+1]){
  assert.equal(map.get(k(x,0,zz))?.role,'foundation');assert.equal(map.get(k(x,7,zz))?.role,'roof');
  for(let y=8;y<=8+rise;y++)assert.ok(map.has(k(x,y,zz)),'spurious rooftop support gap');}
 assert.equal(b.architecture.creatorApproved,false);assert.equal(b.architecture.worldPlaced,false);
});
test('source-authored medium barracks D4 normalized 24x24 overlap stays strictly below .89 against all prior 206',()=>{
 const a=footprint(fresh[0],24);let max=0;
 for(const b of prior){const old=footprint(b,24);for(let op=0;op<8;op++){
   const v=jaccard(a,transformD4(old,24,op));max=Math.max(max,v);assert.ok(v<.89,'possible near-clone '+b.id+' '+v);
 }}assert.ok(max<.89);
});
test('real Pack1–5 producer source dependency report remains read-only and unfalsified',()=>{
 const audit=reviewRoadmapC3BWhitegaleMediumBarracksPhysicalDependencies();
 assert.equal(audit.authored,1);assert.deepEqual([audit.families.families,audit.families.numericVariants],[96,106]);
 assert.ok(audit.assets.some(x=>x.origin==='manual-five-pack'&&x.visibleBoxCount>0),'no producer source geometry witness');
 assert.ok(audit.occupiedConceptualPositions>1500);
 assert.equal(audit.productionReady,false);assert.equal(audit.realMountAndSupportCertified,false);
 assert.equal(audit.readOnly,true);assert.equal(audit.worldIntegrated,0);
});
