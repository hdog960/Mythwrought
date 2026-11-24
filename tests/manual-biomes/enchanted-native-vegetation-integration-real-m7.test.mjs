// Native integration evidence: original mesh + live scenery planner,
// mixed-biome windows, edited tree/scenery supports and actual cache eviction.
// No browser, driver, device or release claim.
import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,restoreFourRegionWorld,M7_ENVIRONMENT_GENERATOR} from '../../src/manual-biomes/profile-world.mjs';
import {BLOCK,worldKey,chunkCoord} from '../../src/voxel.mjs';
import {ENVIRONMENT_GROUND as G} from '../../src/environment-ground.mjs';
import {measureOriginalM7SurfaceWindow,originalM7SurfaceScene} from '../../src/manual-biomes/enchanted-native-vegetation-integration.mjs';
const create=(seed,experimental=false)=>new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR),{experimentalEnchantedTrees:experimental});
test('original native terrain meshes and nonblock vegetation coexist across actual enchanted/plains boundary windows',()=>{
 const seed=-88,old=create(seed),candidate=create(seed,true),records=[];
 // Previously authenticated negative/positive Enchanted-Plains boundary
 // neighborhoods, plus true seed179 candidate tree sites sampled separately.
 for(const [cx,cz] of [[-18,-37],[-17,-37],[-16,-37],[15,-38],[16,-38],[17,-38]]){
  const a=measureOriginalM7SurfaceWindow(old,cx,cz),b=measureOriginalM7SurfaceWindow(candidate,cx,cz);
  assert.equal(a.climate,b.climate);
  assert.ok(a.native.bytes>0&&b.native.bytes>0);
  records.push({chunk:a.chunk,climate:a.climate,
   original:{mesh:a.native.bytes,scenery:a.scenery.bytes,visible:a.visible.length},
   candidate:{mesh:b.native.bytes,scenery:b.scenery.bytes,visible:b.visible.length}});
 }
 assert.ok(records.some(r=>r.climate==='enchanted'));
 assert.ok(records.some(r=>r.climate==='plains'));
 assert.ok(records.some(r=>r.candidate.visible>0));
 assert.deepEqual(old.save(),{schema:1,seed,edits:[]});
 assert.throws(()=>candidate.save(),/cannot be saved as historical M7/);
 console.log('ENCHANTED NATIVE MIXED SURFACE WINDOWS '+JSON.stringify(records));
});
test('original mined candidate tree and nonblock support stay edited after real source cache eviction; restore historical edit against historical generator',()=>{
 const seed=179,w=create(seed,true),historical=create(seed);
 const windows=[[-3,-33],[-3,-32],[-2,-33],[-2,-32],[1,-33],[1,-32]];
 let tree=null,sceneSample=null;
 for(const [cx,cz] of windows){
  w._environmentTreeAt(cx*16,19,cz*16);
  const cells=w._environmentTreeChunks.get(cx+','+cz);
  for(const [k,id] of cells??[]){
   const p=k.split(',').map(Number);
   if(!tree&&[G.aetherBark,G.moonLeaves,G.aetherLeaves].includes(id)&&w.get(...p)===id&&historical.get(...p)!==id)
    tree={p,id,cx,cz};
  }
  const {scene}=originalM7SurfaceScene(w,cx,cz);
  for(const o of scene.visible()){
   const p=o.supports[0];
   if(!sceneSample&&p&&w.get(...p)!==BLOCK.AIR&&(!tree||p.join(',')!==tree.p.join(',')))
    sceneSample={p:[...p],key:o.instanceKey,cx,cz,id:w.get(...p)};
  }
 }
 assert.ok(tree,'real naturally generated changed tree required');
 assert.ok(sceneSample,'real naturally mounted scenery required');
 const {p,cx,cz}=tree;
 const before=measureOriginalM7SurfaceWindow(w,cx,cz);
 assert.equal(w.set(...p,BLOCK.AIR),true);
 assert.equal(w.get(...p),BLOCK.AIR);
 assert.ok(w.edits.has(worldKey(...p)));
 const support=sceneSample.p;
 assert.equal(w.set(...support,BLOCK.AIR),true);
 assert.equal(w.get(...support),BLOCK.AIR);
 const edited=measureOriginalM7SurfaceWindow(w,cx,cz);
 assert.notEqual(edited.native.sha256,before.native.sha256,'real edit must change native mesh');
 const afterSupport=originalM7SurfaceScene(w,sceneSample.cx,sceneSample.cz).scene.visible();
 assert.ok(!afterSupport.some(o=>o.instanceKey===sceneSample.key),'edited original support must retire scenery');
 // 66 actual original tree-chunk cache requests, not artificial deletion.
 for(let i=0;i<66;i++)w._environmentTreeAt((100+i)*16,19,-512);
 assert.equal(w._environmentTreeChunks.size,64);
 assert.equal(w._environmentTreeChunks.has(cx+','+cz),false);
 assert.ok(w._environmentCandidateSiteBiomes.size<=128);
 const rebuilt=measureOriginalM7SurfaceWindow(w,cx,cz);
 assert.deepEqual(rebuilt,edited,'real native mesh/scenery must return byte-exact after cache eviction');
 assert.equal(w.get(...p),BLOCK.AIR);
 assert.equal(w.get(...support),BLOCK.AIR);
 assert.ok(!originalM7SurfaceScene(w,sceneSample.cx,sceneSample.cz).scene.visible().some(o=>o.instanceKey===sceneSample.key));
 assert.throws(()=>w.save(),/cannot be saved as historical M7/);
 // Independent original historical save round trip with an actual natural
 // non-air block edit; candidate geometry never enters old schema.
 const h=[support[0],support[1],support[2]];
 if(historical.get(...h)===BLOCK.AIR)h[1]=0;
 assert.notEqual(historical.get(...h),BLOCK.AIR);
 assert.equal(historical.set(...h,BLOCK.AIR),true);
 const payload=historical.save(),restored=restoreFourRegionWorld(payload,historical.generationProfile);
 assert.deepEqual(restored.save(),payload);
 assert.equal(restored.get(...h),BLOCK.AIR);
 assert.equal(restored.experimentalEnchantedTrees,false);
 console.log('ENCHANTED NATIVE EDIT EVICTION '+JSON.stringify({tree,sceneSample,before:before.native,edited:edited.native,rebuilt:rebuilt.native,
  sceneryBytesAfter:rebuilt.scenery.bytes,cacheEntries:w._environmentTreeChunks.size,
  siteCacheEntries:w._environmentCandidateSiteBiomes.size,historicalEdit:h,experimentalSaveDenied:true}));
});
