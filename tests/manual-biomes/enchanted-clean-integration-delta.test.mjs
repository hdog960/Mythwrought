// Clean integration delta against exact current production, not old research.
import test from 'node:test';
import assert from 'node:assert/strict';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {FourRegionWorld,fourRegionProfile,restoreFourRegionWorld,M7_ENVIRONMENT_GENERATOR,M6_BALANCED_GENERATOR} from '../../src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {BLOCK} from '../../src/voxel.mjs';
const base=await import(pathToFileURL(resolve(process.env.ENCHANTED_BASELINE_ROOT,'src/manual-biomes/profile-world.mjs')).href);
const fresh=(seed,experimental=false)=>new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR),{experimentalEnchantedTrees:experimental});
const old=seed=>new base.FourRegionWorld(seed,base.fourRegionProfile(seed,base.M7_ENVIRONMENT_GENERATOR));
const sites=[[179,-3,-33],[179,-3,-32],[-88,-17,-37],[-88,15,-38],[179,16,-2],[2026,14,1],[179,32,0],[179,0,32],[179,0,0]];
test('current-production historical M7 remains voxel-exact in nine forest, desert, snow and plains chunk samples',()=>{
 let checked=0;
 const records=[];
 for(const [seed,cx,cz] of sites){
  const a=old(seed),b=fresh(seed);
  for(let x=cx*16;x<cx*16+16;x++)for(let z=cz*16;z<cz*16+16;z++){
   assert.deepEqual(b._columnPlan(x,z),a._columnPlan(x,z));
   for(let y=-4;y<=19;y++){assert.equal(b.get(x,y,z),a.get(x,y,z),JSON.stringify([seed,x,y,z]));checked++;}
  }
  assert.deepEqual(b.save(),a.save());
  assert.equal(b.experimentalEnchantedTrees,false);
  assert.equal(b._environmentCandidateSiteBiomes,undefined);
  records.push({seed,cx,cz,climate:v6BiomeAt(cx*16+8,cz*16+8,seed)?.name??'plains'});
 }
 console.log('ENCHANTED CLEAN HISTORICAL PARITY '+JSON.stringify({checked,records}));
});
test('explicit forest opt-in yields real changed candidate tree cells but retains latest Desert exclusion and nonforest column plans',()=>{
 let changed=0,emitted=0,desertColumns=0,nonforest=0;const records=[];
 for(const [seed,cx,cz] of sites){
  const a=old(seed),b=fresh(seed,true);
  b._environmentTreeAt(cx*16,19,cz*16);
  const cells=b._environmentTreeChunks.get(cx+','+cz);
  for(const [k,id] of cells){
   const [x,y,z]=k.split(',').map(Number);
   assert.notEqual(v6BiomeAt(x,z,seed)?.name,'desert','Desert exclusion must not regress '+k);
   emitted++;
   if(b.get(x,y,z)===id&&a.get(x,y,z)!==id)changed++;
  }
  for(let x=cx*16;x<cx*16+16;x++)for(let z=cz*16;z<cz*16+16;z++){
   const name=v6BiomeAt(x,z,seed)?.name;
   if(name!=='enchanted'){
    assert.deepEqual(b._columnPlan(x,z),a._columnPlan(x,z));nonforest++;
   }
   if(name==='desert')desertColumns++;
  }
  records.push({seed,cx,cz,treeCells:cells.size});
  assert.throws(()=>b.save(),/cannot be saved as historical M7/);
 }
 assert.ok(changed>0&&emitted>0&&desertColumns>0&&nonforest>0);
 console.log('ENCHANTED CLEAN OPTIN DELTA '+JSON.stringify({changed,emitted,desertColumns,nonforest,records}));
});
test('historical save restore retains original edits and cannot opt in or mutate selection implicitly',()=>{
 const a=old(179),b=fresh(179);
 const p=[512,17,0];assert.equal(a.set(...p,BLOCK.WOOD),true);assert.equal(b.set(...p,BLOCK.WOOD),true);
 assert.deepEqual(a.save(),b.save());
 const restored=restoreFourRegionWorld(a.save(),fourRegionProfile(179,M7_ENVIRONMENT_GENERATOR));
 assert.equal(restored.get(...p),BLOCK.WOOD);
 assert.equal(restored.experimentalEnchantedTrees,false);
 assert.deepEqual(restored.save(),a.save());
 assert.throws(()=>{restored.experimentalEnchantedTrees=true},TypeError);
 assert.throws(()=>new FourRegionWorld(179,fourRegionProfile(179,M6_BALANCED_GENERATOR),{experimentalEnchantedTrees:true}),/explicit M7 opt-in/);
 assert.throws(()=>fresh(179,true).save(),/cannot be saved as historical M7/);
});
