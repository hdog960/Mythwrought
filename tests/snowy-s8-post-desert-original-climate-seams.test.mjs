// SNOW S8 SOURCE-EXACT CLIMATE SEAM REVIEW. The true Desert Phase 3
// production world is checked out as production-readonly, not modified.
// No Snow M7 generator, old cave AIR/stone, or player edits are rewritten.
import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR,
  restoreFourRegionWorld} from '../production-readonly/src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../production-readonly/src/manual-biomes/v6-balanced-biomes.mjs';
import {createSnowS7MeshTintReview}
 from '../src/manual-biomes/snowy-s7-mesh-tint-source-cache.mjs';
const WINTER=new Set([272,276,279]);
const BIOMES=['desert','mountain'];
const nameOf=(x,z,seed)=>v6BiomeAt(x,z,seed)?.name??'plains';
const asPair=(a,b,target)=>
 (a==='snow'&&b===target)||(a===target&&b==='snow');
const planTop=p=>{
 if(!(p instanceof Map))throw Error('Unexpected real original source plan');
 let y=-Infinity,id=null;
 for(const [py,pid] of p)if(py>y){y=py;id=pid;}
 return {y,id};
};
function locateOriginalClimateSeams(seed){
 const needed=new Set(BIOMES),result=new Map();
 // 128x128 bounded source-only V6 probes, stop as soon as genuine
 // adjacent snow+desert and snow+mountain crossings are discovered.
 for(let z=-2048;z<=2048&&needed.size;z+=32)
  for(let x=-2048;x<=2048&&needed.size;x+=32){
   const here=nameOf(x,z,seed);
   for(const [dx,dz] of [[32,0],[0,32]]){
    const end=nameOf(x+dx,z+dz,seed);
    for(const target of [...needed]){
     if(!asPair(here,end,target))continue;
     let oldName=here;
     for(let i=1;i<=32;i++){
      const ax=x+Math.sign(dx)*i,az=z+Math.sign(dz)*i;
      const next=nameOf(ax,az,seed);
      if(asPair(oldName,next,target)){
       result.set(target,{target,a:[ax-Math.sign(dx),az-Math.sign(dz)],
         b:[ax,az],axis:dx?'x':'z',sampleSeed:seed});
       needed.delete(target);break;
      }
      oldName=next;
     }
    }
   }
  }
 return result;
}
test('authentic new Desert production: both snow-desert and snow-mountain 1-cell seams remain source-safe',()=>{
 for(const seed of [179,2026]){
  const profile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR);
  const world=new FourRegionWorld(seed,profile),before=JSON.stringify(world.save());
  const seams=locateOriginalClimateSeams(seed);
  assert.equal(seams.size,2,
    'Source search must find BOTH real 1-cell Snow–Desert and Snow–Mountain boundaries');
  for(const target of BIOMES){
   const edge=seams.get(target);
   assert.ok(edge);
   const pair=[nameOf(...edge.a,seed),nameOf(...edge.b,seed)];
   assert.ok(asPair(...pair,target),
     'Original V6 seam must be genuine adjacent winter and '+target);
   assert.equal(Math.abs(edge.a[0]-edge.b[0])+Math.abs(edge.a[1]-edge.b[1]),1);
   const caches=new Map(),sourceCounts={snow:0,desert:0,mountain:0,plains:0},
     tintCounts={snow:0,desert:0,mountain:0,plains:0},
     snowCaps=new Set(),nonSnowCaps=new Set();
   // 12x12 across genuine seam, including real original source material
   // rather than abstract biome-only sampling. Bounded to 144 cells.
   const [x0,z0]=edge.a;
   for(let across=-5;across<=6;across++)
    for(let parallel=-5;parallel<=6;parallel++){
     const x=x0+(edge.axis==='x'?across:parallel);
     const z=z0+(edge.axis==='z'?across:parallel);
     const climate=nameOf(x,z,seed);
     sourceCounts[climate]=(sourceCounts[climate]??0)+1;
     const chunkX=Math.floor(x/16),chunkZ=Math.floor(z/16);
     const key=chunkX+','+chunkZ;
     if(!caches.has(key))caches.set(key,
       createSnowS7MeshTintReview(world,chunkX,chunkZ,{biomeAt:v6BiomeAt}));
     const {y,id}=planTop(world._columnPlan(x,z));
     const color=caches.get(key).colorFor(x,y,z,id);
     if(climate!=='snow'){
      assert.equal(color,undefined,
       'Never recolor original Desert / Mountain / Plains even on 1-cell source seam');
      if(id!==null)nonSnowCaps.add(id);
     }
     if(color){
      assert.equal(climate,'snow');
      assert.ok(WINTER.has(id));
      assert.equal(world.get(x,y,z),id);
      assert.equal(world.environmentCaves.get(x,y,z),undefined);
      assert.equal(world.edits.has(x+','+y+','+z),false);
      assert.equal(world.edits.has(x+','+(y-1)+','+z),false);
      snowCaps.add(id);
      tintCounts[climate]++;
     }
   }
   assert.ok(sourceCounts.snow>0);
   assert.ok(sourceCounts[target]>0);
   assert.equal(tintCounts.desert,0);
   assert.equal(tintCounts.mountain,0);
   assert.equal(tintCounts.plains,0);
   for(const cache of caches.values()){
    const stats=cache.stats();
    assert.ok(stats.cachedColumns<=256);
    assert.ok(stats.climateReads<=stats.cachedColumns);
   }
   assert.equal(JSON.stringify(world.save()),before);
   console.log('SNOW_S8_REAL_POST_DESERT_CLIMATE_SEAM '+JSON.stringify({
    seed,target,edge,realSampledCells:144,physicalSourceCounts:sourceCounts,
    nativeTintCounts:tintCounts,
    originalSnowCapIds:[...snowCaps].sort((a,b)=>a-b),
    untouchedNonSnowMaterialIds:[...nonSnowCaps].sort((a,b)=>a-b),
    cacheOwnerChunks:caches.size,
    caveAndOriginalSaveUnchanged:true,
    winterVoxelEdits:0,
    actualWebGL2SeamVisualAcceptance:false}));
  }
  assert.deepEqual(restoreFourRegionWorld(world.save(),profile).save(),world.save());
 }
});
