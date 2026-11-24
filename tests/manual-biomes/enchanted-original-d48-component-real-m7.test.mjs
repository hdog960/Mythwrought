import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR} from '../../src/manual-biomes/profile-world.mjs';
import {auditOriginalD48Component} from '../../src/manual-biomes/enchanted-original-d48-component-audit.mjs';
test('both original d48 alcove components exhaust all legal cardinal neighbor positions with unchanged author source',()=>{
 const seed=-88;
 const old=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
 const experimental=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR),{experimentalEnchantedTrees:true});
 const results=[];
 for(const name of ['upper24-windcut','upper24-hollowbend']){
  const a=auditOriginalD48Component(old,name),b=auditOriginalD48Component(experimental,name);
  assert.deepEqual(a,b);
  assert.equal(a.ok,true);
  assert.equal(a.edges,a.componentNodes*12);
  assert.equal(a.boundaryPositions,a.noOwnerSupport+a.ownerHeadMissing+a.physicalVeto+a.admittedBoundary);
  results.push(a);
 }
 console.log('ENCHANTED D48 FULL CARDINAL FRONTIER '+JSON.stringify(results));
 assert.deepEqual(old.save(),{schema:1,seed,edits:[]});
 assert.throws(()=>experimental.save(),/cannot be saved as historical M7/);
});
