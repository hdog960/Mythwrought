import test from 'node:test';
import assert from 'node:assert/strict';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {researchP0TileSite} from '../src/manual-biomes/forgotten-sands-tile-site-policy.mjs';
const root=process.env.P0_CURRENT_SOURCE;if(!root)throw Error('Exact current source required');
const load=p=>import(pathToFileURL(resolve(root,p)).href);
const [P,V,F,H]=await Promise.all(['src/manual-biomes/profile-world.mjs','src/voxel.mjs','src/physics.mjs','src/world-height.mjs'].map(load));
const make=seed=>new P.FourRegionWorld(seed,P.fourRegionProfile(seed,P.M8_MOUNTAIN_GENERATOR));
test('fresh ordinary M8 seeds admit deterministic bounded tile sites using actual source and current walking',async()=>{
 let admitted=0;
 for(const seed of [42,-741,10301]){
  let epoch='detached-tile-r1';const w=make(seed),before=JSON.stringify(w.save()),opts={P,V,F,H,reserved:()=>false,revision:()=>epoch};
  const a=await researchP0TileSite(w,1,0,opts);
  if(a.accepted){
   admitted++;const b=await researchP0TileSite(make(seed),1,0,opts);assert.equal(b.accepted,true);assert.deepEqual(b.identity,a.identity);assert.deepEqual(b.walk,a.walk);
   assert.ok(a.identity.cells>0&&a.identity.site.size>=15);assert.equal(a.placementAuthority,false);
   epoch='detached-tile-r2';assert.throws(()=>a.get(a.identity.site.x,20,a.identity.site.z),/Stale/);
  }
  assert.equal(JSON.stringify(w.save()),before);
  console.log('P0 TILE POLICY',JSON.stringify({seed,accepted:a.accepted,identity:a.identity,walk:a.walk,upperOwners:a.upperOwners,upperCells:a.upperCells,sourceReads:a.sourceReads,attempts:a.attempts.length,reason:a.reason}));
 }
 assert.ok(admitted>=1,'No fresh seed site admitted within bounded policy');
});
test('non-desert, edited source and unknown reservation fail closed',async()=>{
 const w=make(42),opts={P,V,F,H,reserved:()=>undefined,revision:()=>'r1'};
 assert.equal((await researchP0TileSite(w,0,0,opts)).reason,'not-desert-macrotile');
 const deny=await researchP0TileSite(w,1,0,opts);assert.equal(deny.accepted,false);assert.equal(deny.attempts.length,50);
 assert.equal(w.set(512,-210,0,0),true);assert.equal((await researchP0TileSite(w,1,0,opts)).reason,'not-fresh-or-unversioned-source');
});
