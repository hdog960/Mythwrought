import test from 'node:test';
import assert from 'node:assert/strict';
import {completeBeastCandidateCatalog} from '../../src/mobs/age-of-beasts/complete-catalog.mjs';
import {APPROVED,BIOMES} from '../../src/mobs/age-of-beasts/roster-contract.mjs';
import {legacyIndex,CANDIDATE_LIMITS} from '../../src/mobs/age-of-beasts/catalog-index.mjs';
import {MobEngine} from '../../src/mobs/engine.mjs';
test('actual authored 100-record catalog retains all 40 original identities and rejects live admission',()=>{
 const c=completeBeastCandidateCatalog();assert.equal(c,completeBeastCandidateCatalog());assert.equal(c.index.size,100);
 assert.equal(c.candidates.length,60);assert.equal(new Set(c.index.records.map(r=>r.id)).size,100);
 for(const r of legacyIndex.records)assert.equal(c.index.get(r.id),r);
 for(const spec of APPROVED){const a=c.get(spec.id);assert.equal(a.record,c.index.get(spec.id));assert.equal(a.requirement,spec);}
 for(const b of BIOMES){const a=c.candidates.filter(x=>x.requirement.biome===b);assert.equal(a.filter(x=>x.record.classification==='passive').length,5);assert.equal(a.filter(x=>x.record.classification==='hostile').length,5);}
 assert.equal(CANDIDATE_LIMITS.activeEntities,8);assert.equal(CANDIDATE_LIMITS.liveEntities,32);
 assert.throws(()=>new MobEngine({volume:()=> 'clear',grounded:()=>true,residentAt:()=>true,revision:()=>1},179,{catalog:c.index}));
});
