import test from 'node:test';
import assert from 'node:assert/strict';
import {M1_REGIONAL_PROFILES,M1_REGIONAL_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-regional-shops.mjs';
import {M1_GENERAL_STORES} from '../../../src/building-pool/roadmap-2a/m1-general-stores.mjs';
import {M1_SPECIALIST_EXEMPLARS} from '../../../src/building-pool/roadmap-2a/m1-specialist-exemplars.mjs';
import {M1_NEW_MERCHANTS} from '../../../src/building-pool/roadmap-2a/m1-additional-shops.mjs';
import {validateBlueprint,structuralFingerprint} from '../../../src/building-pool/roadmap-2a/schema.mjs';
const source=[...M1_GENERAL_STORES,...M1_SPECIALIST_EXEMPLARS,...M1_NEW_MERCHANTS,...M1_REGIONAL_SHOPS];
test('six region-specific physically authored roof silhouettes include distinct gabled/raised roof coordinate massing',()=>{
 assert.equal(M1_REGIONAL_PROFILES.length,6);assert.equal(new Set(source.map(x=>x.id)).size,32);assert.equal(new Set(source.map(structuralFingerprint)).size,32);
 const signatures=new Set();
 for(const [i,b] of M1_REGIONAL_SHOPS.entries()){
  const profile=M1_REGIONAL_PROFILES[i],map=new Map(b.voxels.map(v=>[[v.x,v.y,v.z].join(','),v]));
  assert(profile.roofMassing.length>=2);assert(profile.facadeGables.length>=1);
  const shaped=b.voxels.filter(v=>v.architecturalRole),added=shaped.filter(v=>v.roofBearing);
  assert(added.length>=10,b.id+' mere identical flat roof');
  assert(new Set(shaped.map(v=>v.architecturalRole)).size>=2,b.id+' no regional architectural articulation');
  for(const v of added){assert.equal(v.kind,'roof');assert.equal(map.get([v.x,v.y-1,v.z].join(','))?.kind,'roof',b.id+' unsupported raised conceptual roof');}
  signatures.add(JSON.stringify([...new Set(shaped.map(v=>v.architecturalRole))].sort())+':'+Math.max(...shaped.map(v=>v.y)));
  assert.equal(validateBlueprint(b).valid,true);
 }
 assert.equal(signatures.size,6);
});
test('all 15 inherited stores and first 11 original specialist plans remain outside optional roof massing mutation',()=>{
 for(const b of [...M1_GENERAL_STORES,...M1_SPECIALIST_EXEMPLARS,...M1_NEW_MERCHANTS])
  assert.equal(b.voxels.some(v=>v.roofBearing==='continuous-voxel-roof-below-not-final-physical-ABI'),false,b.id);
});
