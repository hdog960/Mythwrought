import test from 'node:test';
import assert from 'node:assert/strict';
import {M1_REGIONAL_SHOPS,M1_REGIONAL_PROFILES} from '../../../src/building-pool/roadmap-2a/m1-regional-shops.mjs';
import {M1_BIOME_EXPANSION,M1_BIOME_EXPANSION_PROFILES} from '../../../src/building-pool/roadmap-2a/m1-biome-expansion.mjs';
import {M1_CATEGORY_ARCADES,M1_CATEGORY_ARCADES_PROFILES} from '../../../src/building-pool/roadmap-2a/m1-category-arcades.mjs';
import {M1_GENERAL_STORES} from '../../../src/building-pool/roadmap-2a/m1-general-stores.mjs';
import {M1_SPECIALIST_EXEMPLARS} from '../../../src/building-pool/roadmap-2a/m1-specialist-exemplars.mjs';
import {M1_NEW_MERCHANTS} from '../../../src/building-pool/roadmap-2a/m1-additional-shops.mjs';
import {structuralFingerprint,validateBlueprint} from '../../../src/building-pool/roadmap-2a/schema.mjs';
const modern=[...M1_REGIONAL_SHOPS,...M1_BIOME_EXPANSION,...M1_CATEGORY_ARCADES];
const profiles=[...M1_REGIONAL_PROFILES,...M1_BIOME_EXPANSION_PROFILES,...M1_CATEGORY_ARCADES_PROFILES];
const original=[...M1_GENERAL_STORES,...M1_SPECIALIST_EXEMPLARS,...M1_NEW_MERCHANTS];
const at=(x,y,z)=>[x,y,z].join(',');
test('18 individual architect-authored two-wide porticoes are genuine two/three-cell deep recessed structural spaces',()=>{
 assert.equal(modern.length,18);assert.equal(profiles.length,18);
 assert.equal(new Set([...original,...modern].map(x=>x.id)).size,44);
 assert.equal(new Set([...original,...modern].map(structuralFingerprint)).size,44);
 for(const [i,b] of modern.entries()){
  assert(validateBlueprint(b).valid);
  const p=profiles[i],m=new Map(b.voxels.map(v=>[at(v.x,v.y,v.z),v]));
  assert.equal(p.frontPorticoes.length,1);const [left,right,depth,role]=p.frontPorticoes[0];
  assert([2,3].includes(depth));assert(right-left>=4);
  for(const x of [left,right])for(let y=2;y<=4;y++)assert.equal(m.get(at(x,y,0))?.architecturalRole,role+'-bearing-pier');
  for(let x=left+1;x<right;x++)for(let y=2;y<=4;y++){
   assert(!m.has(at(x,y,0)),b.id+' exterior not recessed');
   if(x!==p.entry&&x!==p.entry+1)
    assert.equal(m.get(at(x,y,depth))?.architecturalRole,role+'-deep-inset');
  }
  for(const x of [p.entry,p.entry+1])for(const z of [0,depth])for(let y=2;y<=4;y++)
   assert(!m.has(at(x,y,z)),b.id+' failed to clear true double-height inner/outer access');
  for(let x=left;x<=right;x++){
   const span=m.get(at(x,5,0));assert(span?.structuralSpanUnverified,b.id+' unsafe spandrel certification');
  }
  for(const type of ['outer-secondary','inner-primary','inner-secondary']){
   assert(b.openings.some(o=>o.role===role+'-'+type&&o.clearHeightCells===3),b.id+' missing actual portal record '+type);
  }
 }
});
test('protected 15 legacy and preceding 11 specialists do not receive any new portico geometry',()=>{
 assert.equal(original.length,26);
 for(const b of original){assert(!b.voxels.some(v=>v.portico));assert(!b.openings.some(o=>o.role?.includes('-portico-')));}
});
