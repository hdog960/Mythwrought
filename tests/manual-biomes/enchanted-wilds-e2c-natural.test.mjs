import test from 'node:test';
import assert from 'node:assert/strict';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {FourRegionWorld,fourRegionProfile,M8_MOUNTAIN_GENERATOR,ENCHANTED_P2_GENERATOR} from '../../src/manual-biomes/profile-world.mjs';
import {BLOCK,meshChunk} from '../../src/voxel.mjs';
import {ENVIRONMENT_GROUND as G} from '../../src/environment-ground.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {createWildsNaturalSession,restoreWildsNaturalSession,openWildsResearchSlot,saveWildsResearchSlot} from '../../src/manual-biomes/enchanted-wilds-natural-session.mjs';
import {worldSlotKey} from '../../src/seeds.mjs';
const previous=await import(pathToFileURL(resolve(process.env.WILDS_CURRENT_ROOT,'src/manual-biomes/profile-world.mjs')).href);
const previousVoxel=await import(pathToFileURL(resolve(process.env.WILDS_CURRENT_ROOT,'src/voxel.mjs')).href);
const seed=179,s=createWildsNaturalSession(seed),h=s.host;
const chunks=[];for(let cx=-5;cx<=-1;cx++)for(let cz=-35;cz<=-31;cz++)chunks.push([cx,cz]);
test('actual current Mountain/Snow historical generators and nonforest geometry stay exact',()=>{
 for(const generator of [M8_MOUNTAIN_GENERATOR,ENCHANTED_P2_GENERATOR]){
   const old=new previous.FourRegionWorld(seed,previous.fourRegionProfile(seed,generator));
   const current=new FourRegionWorld(seed,fourRegionProfile(seed,generator));
   for(const [cx,cz] of [[0,0],[32,0],[0,32],[-32,0],[-3,-33]]){
     for(let x=cx*16;x<cx*16+16;x+=3)for(let z=cz*16;z<cz*16+16;z+=3)
       for(let y=-3;y<=19;y++)assert.equal(current.get(x,y,z),old.get(x,y,z));
     assert.deepEqual(meshChunk(current,cx,cz),previousVoxel.meshChunk(old,cx,cz));
     if(generator===M8_MOUNTAIN_GENERATOR&&v6BiomeAt(cx*16+8,cz*16+8,seed)?.name!=='enchanted')
       assert.deepEqual(h.meshSurface(cx,cz),previousVoxel.meshChunk(old,cx,cz),'nonforest mesh');
   }
 }
 console.log('WILDS CURRENT COMPAT',JSON.stringify({historicalProfiles:2,originalMeshComparisons:10,nonforestMeshComparisons:4}));
});
test('deterministic actual natural forest towers, chunk-order independence, physical seam and bounded cache',()=>{
 const a=new Map(),origins=new Set();let upper=0,highest=-Infinity;
 for(const [cx,cz] of chunks){
   for(const p of s.source.origins(cx,cz))origins.add(p.join(','));
   for(const [key,id] of s.source.entries(cx,cz)){
     assert.ok(!a.has(key));a.set(key,id);
     const [x,y,z]=key.split(',').map(Number);
     assert.equal(h.world.get(x,y,z),id);
     assert.equal(v6BiomeAt(x,z,seed)?.name,'enchanted');
     if(y>19)upper++;highest=Math.max(highest,y);
   }
 }
 assert.ok(origins.size>=2&&upper>0&&highest>35,'multiple genuine natural towers');
 s.source.clear();
 const reverse=new Map();
 for(const [cx,cz] of chunks.slice().reverse())for(const [key,id] of s.source.entries(cx,cz))reverse.set(key,id);
 assert.deepEqual([...reverse].sort(),[...a].sort());
 const [x,y,z]=[...origins][0].split(',').map(Number);
 assert.equal(h.world.get(x,y+1,z),G.aetherBark);
 assert.equal(h.world.get(x,20,z),G.aetherBark);
 const visible=s.visibleUpper({x,feet:20,z});
 assert.ok(visible.length>0&&visible.length<=256);
 assert.ok(visible.some(r=>r.cx===Math.floor(x/16)&&r.cz===Math.floor(z/16)&&r.section===0));
 assert.ok(h.meshUpper(Math.floor(x/16),Math.floor(z/16),0).bytes>0);
 for(let i=0;i<80;i++)s.source.entries(1000+i,1000);
 assert.ok(s.source.stats().chunkCache<=64&&s.source.stats().siteCache<=128);
 assert.equal(h.world.get(x,20,z),G.aetherBark);
 console.log('WILDS NATURAL TOWERS',JSON.stringify({origins:origins.size,cells:a.size,upper,highest,visible:visible.length,cache:s.source.stats()}));
});
test('seed-only natural cold restore, source-owned mining, distinct storage and historical bytes',()=>{
 let root=null;for(const [cx,cz] of chunks){const p=s.source.origins(cx,cz)[0];if(p){root=p;break;}}
 assert.ok(root);const [x,,z]=root;
 const n=createWildsNaturalSession(seed);
 assert.equal(n.host.world.get(x,20,z),G.aetherBark);
 assert.equal(n.host.setPhysical(x,20,z,BLOCK.AIR),true);
 assert.equal(n.host.setPhysical(-10001,256,10003,BLOCK.STONE),true);
 const bytes=n.exportBytes();
 assert.equal(JSON.parse(bytes).sites,undefined);
 const cold=restoreWildsNaturalSession(bytes);
 assert.equal(cold.host.naturalAt(x,20,z),G.aetherBark);
 assert.equal(cold.host.world.get(x,20,z),BLOCK.AIR);
 assert.deepEqual(cold.host.meshUpper(Math.floor(x/16),Math.floor(z/16),0).vertices,n.host.meshUpper(Math.floor(x/16),Math.floor(z/16),0).vertices);
 const data=new Map([[worldSlotKey(seed),'historical bytes'],[worldSlotKey(seed)+'-four-biomes-profile-v1','historic profile']]);
 const storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v))};
 assert.equal(openWildsResearchSlot(storage,seed),null);
 const lease=saveWildsResearchSlot(storage,n);
 assert.equal(openWildsResearchSlot(storage,seed).session.exportBytes(),bytes);
 assert.throws(()=>saveWildsResearchSlot(storage,n),/stale/);
 assert.equal(n.host.setPhysical(x,20,z,G.aetherBark),true);
 saveWildsResearchSlot(storage,n,lease.expectedRecord);
 assert.equal(data.get(worldSlotKey(seed)),'historical bytes');
 assert.equal(data.get(worldSlotKey(seed)+'-four-biomes-profile-v1'),'historic profile');
 assert.throws(()=>n.host.save(),/not a durable/);
 console.log('WILDS NATURAL RESEARCH SLOT',JSON.stringify({bytes:bytes.length,naturalRowsStored:0,oldSlotsUnchanged:true}));
});
