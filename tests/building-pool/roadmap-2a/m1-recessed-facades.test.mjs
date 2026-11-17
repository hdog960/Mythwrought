import test from 'node:test';
import assert from 'node:assert/strict';
import {M1_REGIONAL_SHOPS,M1_REGIONAL_PROFILES} from '../../../src/building-pool/roadmap-2a/m1-regional-shops.mjs';
import {M1_BIOME_EXPANSION,M1_BIOME_EXPANSION_PROFILES} from '../../../src/building-pool/roadmap-2a/m1-biome-expansion.mjs';
import {M1_GENERAL_STORES} from '../../../src/building-pool/roadmap-2a/m1-general-stores.mjs';
import {M1_SPECIALIST_EXEMPLARS} from '../../../src/building-pool/roadmap-2a/m1-specialist-exemplars.mjs';
import {M1_NEW_MERCHANTS} from '../../../src/building-pool/roadmap-2a/m1-additional-shops.mjs';
import {validateBlueprint,structuralFingerprint} from '../../../src/building-pool/roadmap-2a/schema.mjs';
const modern=[...M1_REGIONAL_SHOPS,...M1_BIOME_EXPANSION],profiles=[...M1_REGIONAL_PROFILES,...M1_BIOME_EXPANSION_PROFILES];
const older=[...M1_GENERAL_STORES,...M1_SPECIALIST_EXEMPLARS,...M1_NEW_MERCHANTS];
test('twelve physically carved rear facade bay configurations are distinct solid backed insets, not nominal cosmetic tags',()=>{
 assert.equal(modern.length,12);assert.equal(new Set([...modern,...older].map(x=>x.id)).size,38);
 assert.equal(new Set([...modern,...older].map(structuralFingerprint)).size,38);
 for(const [i,b] of modern.entries()){
  const prof=profiles[i],map=new Map(b.voxels.map(v=>[[v.x,v.y,v.z].join(','),v]));
  assert(prof.facadeRecesses.length>=1);assert(validateBlueprint(b).valid);
  for(const [x0,x1,z,role] of prof.facadeRecesses){
   assert(x1-x0>=3&&x1-x0<=6);
   for(const x of [x0,x1])for(let y=2;y<=4;y++)
    assert.equal(map.get([x,y,z].join(','))?.architecturalRole,role+'-bearing-pier',b.id+' no side support');
   for(let x=x0+1;x<x1;x++)for(let y=2;y<=4;y++){
    assert(!map.has([x,y,z].join(',')),b.id+' facade was NOT recessed');
    const inset=map.get([x,y,z-1].join(','));
    assert.equal(inset?.architecturalRole,role+'-inset-panel');
    assert.equal(map.get([x,1,z-1].join(','))?.kind,'floor');
   }
   for(let x=x0;x<=x1;x++){
    assert.equal(map.get([x,5,z].join(','))?.architecturalRole,role+'-spandrel');
    assert.equal(map.get([x,5,z].join(','))?.structuralSpanUnverified,true);
   }
  }
 }
});
test('the 15 legacy stores and first 11 specialists receive zero post-source facade mutations',()=>{
 assert.equal(older.length,26);
 for(const b of older)assert(!b.voxels.some(v=>v.facadeDepth||v.structuralSpanUnverified),b.id);
});
