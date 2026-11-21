// Additive CI-only real native 3B tests downstream of untouched source-only PR #364.
import {BIOME130_REGISTERED_SYMBOLS} from '../src/biome130-registry.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {createVariant3SecondBlueprint,createVariant3SecondPool} from '../src/building-pool/roadmap-3b/m2-variant3-second.mjs';
import {createVariant3FirstPool} from '../src/building-pool/roadmap-3b/m2-variant3-first.mjs';
import {createVariant2CompletionPool} from '../src/building-pool/roadmap-3b/m2-variant2-completion.mjs';
import {createVariant2ExpansionPool} from '../src/building-pool/roadmap-3b/m2-variant2-expansion.mjs';
import {BIOMES,SIZES} from '../src/building-pool/roadmap-3b/roster.mjs';
import {createVariant2IndustryPool} from '../src/building-pool/roadmap-3b/m2-variant2.mjs';
import {createLegacyWatchtowerPool} from '../src/building-pool/roadmap-3b/legacy-watchtowers.mjs';
import {createM2IndustryPool} from '../src/building-pool/roadmap-3b/m2-industry.mjs';
import {createRegionalIndustryPool} from '../src/building-pool/roadmap-3b/m2-regional.mjs';
import {createFrontierIndustryPool} from '../src/building-pool/roadmap-3b/m2-frontier.mjs';
import {createHinterlandPool} from '../src/building-pool/roadmap-3b/m2-hinterland.mjs';
import {createMissingSlotIndustryPool} from '../src/building-pool/roadmap-3b/m2-missing-sizes.mjs';
import {ASSET_CATALOG} from '../src/building-pool/roadmap-3b/assets.mjs';
import {validatePool,validateBlueprint,serializeBlueprint,geometryFingerprint} from '../src/building-pool/roadmap-3b/contract.mjs';
import {reviewVariant3SecondPhysicalDependencies} from '../src/building-pool/roadmap-3b/m2-variant3-second-dependencies.mjs';
import {createVariant3FinalBlueprint,createVariant3FinalPool} from '../src/building-pool/roadmap-3b/m2-variant3-final.mjs';
import {createVariant4FirstBlueprint,createVariant4FirstPool} from '../src/building-pool/roadmap-3b/m2-variant4-first.mjs';
import {reviewVariant4FirstPhysicalDependencies} from '../src/building-pool/roadmap-3b/m2-variant4-first-dependencies.mjs';
import {createVariant4CompletionBlueprint,createVariant4CompletionPool} from '../src/building-pool/roadmap-3b/m2-variant4-completion.mjs';
import {reviewVariant4CompletionPhysicalDependencies} from '../src/building-pool/roadmap-3b/m2-variant4-completion-dependencies.mjs';
import {createWatchtowerVariant2FirstBlueprint,createWatchtowerVariant2FirstPool} from '../src/building-pool/roadmap-3b/m2-watchtower-variant2-first.mjs';
import {reviewWatchtowerVariant2FirstPhysicalDependencies} from '../src/building-pool/roadmap-3b/m2-watchtower-variant2-first-dependencies.mjs';
import {createWatchtowerVariant2MediumLargeBlueprint,createWatchtowerVariant2MediumLargePool} from '../src/building-pool/roadmap-3b/m2-watchtower-variant2-medium-large.mjs';
import {reviewWatchtowerVariant2MediumLargePhysicalDependencies} from '../src/building-pool/roadmap-3b/m2-watchtower-variant2-medium-large-dependencies.mjs';
import {createWatchtowerVariant3FirstPool} from '../src/building-pool/roadmap-3b/m2-watchtower-variant3-first.mjs';
import {createWatchtowerVariant4FirstPool} from '../src/building-pool/roadmap-3b/m2-watchtower-variant4-first.mjs';
import {createWatchtowerVariant5FinalBlueprint,createWatchtowerVariant5FinalPool} from '../src/building-pool/roadmap-3b/m2-watchtower-variant5-final.mjs';
import {reviewWatchtowerVariant5FinalPhysicalDependencies} from '../src/building-pool/roadmap-3b/m2-watchtower-variant5-final-dependencies.mjs';
import {createM3BarracksSmallFirstPool} from '../src/building-pool/roadmap-3b/m3-barracks-small-first.mjs';
import {createM3BarracksSmallSecondBlueprint,createM3BarracksSmallSecondPool} from '../src/building-pool/roadmap-3b/m3-barracks-small-second.mjs';
import {reviewM3BarracksSmallSecondPhysicalDependencies} from '../src/building-pool/roadmap-3b/m3-barracks-small-second-dependencies.mjs';
import {createRoadmapC3BMediumBarracksPool} from '../src/building-pool/roadmap-3b/m3-barracks-medium-roadmap-c.mjs';
import {createRoadmapC3BWhitegaleMediumBarracksPool} from '../src/building-pool/roadmap-3b/m3-whitegale-medium-barracks-roadmap-c.mjs';
import {createRoadmapC3BSandglassMediumBarracksPool} from '../src/building-pool/roadmap-3b/m3-sandglass-medium-barracks-roadmap-c.mjs';
import {createRoadmapC3BGlimmerrootMediumBarracksPool} from '../src/building-pool/roadmap-3b/m3-glimmerroot-medium-barracks-roadmap-c.mjs';
import {createRoadmapC3BCragpassMediumBarracksPool} from '../src/building-pool/roadmap-3b/m3-cragpass-medium-barracks-roadmap-c.mjs';
import {createRoadmapC3BBoughgateLargeBarracksPool} from '../src/building-pool/roadmap-3b/m3-boughgate-large-barracks-roadmap-c.mjs';
import {reviewRoadmapC3BBoughgateLargeBarracksPhysicalDependencies} from '../src/building-pool/roadmap-3b/m3-boughgate-large-barracks-roadmap-c-dependencies.mjs';

import {createRoadmapC3BMorainewatchMediumBarracksPool} from '../src/building-pool/roadmap-3b/m3-morainewatch-medium-barracks-roadmap-c.mjs';
import {reviewRoadmapC3BMorainewatchMediumBarracksPhysicalDependencies} from '../src/building-pool/roadmap-3b/m3-morainewatch-medium-barracks-roadmap-c-dependencies.mjs';
const prior=[...createLegacyWatchtowerPool(),...createM2IndustryPool(),...createRegionalIndustryPool(),...createFrontierIndustryPool(),...createHinterlandPool(),...createMissingSlotIndustryPool(),...createVariant2IndustryPool(),...createVariant2ExpansionPool(),...createVariant2CompletionPool(),...createVariant3FirstPool(),...createVariant3SecondPool(),...createVariant3FinalPool(),...createVariant4FirstPool(),...createVariant4CompletionPool(),...createWatchtowerVariant2FirstPool(),...createWatchtowerVariant2MediumLargePool(),...createWatchtowerVariant3FirstPool(),...createWatchtowerVariant4FirstPool(),...createWatchtowerVariant5FinalPool(),...createM3BarracksSmallFirstPool(),...createM3BarracksSmallSecondPool(),...createRoadmapC3BMediumBarracksPool(),...createRoadmapC3BWhitegaleMediumBarracksPool(),...createRoadmapC3BSandglassMediumBarracksPool(),...createRoadmapC3BGlimmerrootMediumBarracksPool(),...createRoadmapC3BCragpassMediumBarracksPool()];
const historical=[...prior,...createRoadmapC3BBoughgateLargeBarracksPool()],candidate=createRoadmapC3BMorainewatchMediumBarracksPool(),all=[...historical,...candidate];
const key=(x,y,z)=>x+','+y+','+z;
const p24=b=>{const s=new Set();for(const mod of b.modules)if(mod.role==='foundation')for(const [x,y,z] of mod.cells)
 s.add(Math.round(x/(b.envelope.width-1)*23)+','+Math.round(z/(b.envelope.depth-1)*23));return s;};
const transform=(s,op)=>{const out=new Set();for(const v of s){let [x,z]=v.split(',').map(Number);
 if(op&1)x=23-x;if(op&2)z=23-z;if(op&4)[x,z]=[z,x];out.add(x+','+z);}return out;};
const jaccard=(a,b)=>{let hit=0;for(const k of a)if(b.has(k))hit++;return hit/(a.size+b.size-hit);};
test('Morainewatch uses original 3B native compiler/contract and preserves all 211 accepted originals',()=>{
 assert.equal(historical.length,211);assert.equal(candidate.length,1);
 const b=candidate[0];assert.equal(b.id,'r3:barracks:snow:medium:2');
 const valid=validateBlueprint(b,ASSET_CATALOG);assert.ok(valid.cellCount>2000);
 const result=validatePool(all,ASSET_CATALOG);
 assert.deepEqual([result.authored,result.remaining],[212,148]);
 assert.equal(new Set(all.map(v=>v.id)).size,212);
 assert.equal(new Set(all.map(geometryFingerprint)).size,212);
 assert.ok(historical.every((v,i)=>v===all[i]));
 assert.equal(b.activated,false);assert.equal(b.architecture.worldPlaced,false);
});
test('Morainewatch six original rooms accessible via actual two-wide physical cells, two open courts and continuous roofs',()=>{
 const b=candidate[0],vox=new Map();
 for(const m of b.modules)for(const p of m.cells){const k=key(...p.slice(0,3));
 assert.ok(!vox.has(k),'duplicate voxel '+k);vox.set(k,{role:m.role,point:p});}
 assert.equal(vox.size,b.architecture.sourceCellCount);
 assert.equal(b.architecture.sourceRooms.length,6);
 assert.equal(b.architecture.openCourtyards,2);
 assert.ok(b.architecture.actualRemovedCourtyardCells>=20);
 assert.ok(b.architecture.footprintCells>2400);
 for(const [a,x1,z0,z1] of b.architecture.courtyardRects)
  for(let x=a;x<=x1;x++)for(let z=z0;z<=z1;z++)for(let y=0;y<16;y++)
   assert.ok(!vox.has(key(x,y,z)),'fake sky court '+[x,y,z]);
 const starts=b.navigation.nodes.find(n=>n.id===b.navigation.entry);
 const validWalk=(x,y,z)=>x>=0&&x+1<b.envelope.width&&z>=0&&z<b.envelope.depth&&
  [x,x+1].every(xx=>vox.has(key(xx,y-1,z))&&!vox.has(key(xx,y,z))&&!vox.has(key(xx,y+1,z)));
 assert.ok(validWalk(starts.x,starts.y,starts.z));
 const q=[[starts.x,starts.y,starts.z]],seen=new Set([key(...q[0])]);
 for(let i=0;i<q.length;i++){const [x,y,z]=q[i];for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
 const n=[x+dx,y,z+dz],k=key(...n);if(!seen.has(k)&&validWalk(...n)){seen.add(k);q.push(n);}
 }}
 for(const n of b.navigation.nodes)assert.ok(seen.has(key(n.x,n.y,n.z)),'unreachable physical room junction '+n.id);
 for(const c of b.clearances)for(let x=c.x;x<c.x+c.width;x++)for(let y=c.y;y<c.y+c.height;y++)for(let z=c.z;z<c.z+c.depth;z++)
 assert.ok(!vox.has(key(x,y,z)),'two-wide passage obstructed');
 const roots=[...vox].filter(([k,v])=>v.role==='foundation').map(([k])=>k),reachable=new Set(roots),stack=[...roots];
 while(stack.length){const s=stack.pop(),[x,y,z]=s.split(',').map(Number);
 for(const [dx,dy,dz] of [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]]){
 const k=key(x+dx,y+dy,z+dz);if(vox.has(k)&&!reachable.has(k)){reachable.add(k);stack.push(k);}}}
 assert.equal(reachable.size,vox.size,'disconnected source roof/support voxel');
 assert.ok(b.modules.some(m=>m.role==='source-bearing-roof-mass'&&m.cells.length>100));
});
test('Morainewatch full 211-history true 8-way normalized D4 footprint uniqueness threshold <.89',()=>{
 const fresh=p24(candidate[0]);let high=0;
 for(const old of historical){const b=p24(old);for(let i=0;i<8;i++){const v=jaccard(fresh,transform(b,i));
 high=Math.max(high,v);assert.ok(v<.89,'near-clone '+old.id+' IoU '+v);}}
 assert.ok(high<.89);
});
test('Morainewatch read-only real Manual Five Pack source AABB ledger remains non-certified',()=>{
 const a=reviewRoadmapC3BMorainewatchMediumBarracksPhysicalDependencies();
 assert.equal(a.authored,1);assert.deepEqual([a.families.families,a.families.numericVariants],[96,106]);
 assert.ok(a.assets.some(v=>v.origin==='manual-five-pack'&&v.visibleBoxCount>0));
 assert.equal(a.productionReady,false);assert.equal(a.realMountAndSupportCertified,false);
 assert.equal(a.readOnly,true);assert.equal(a.worldIntegrated,0);
});
