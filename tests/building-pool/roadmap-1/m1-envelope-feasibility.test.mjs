import test from 'node:test';
import assert from 'node:assert/strict';
import {getM1Blueprints} from '../../../src/building-pool/roadmap-1/m1-buildings.mjs';
import {WALL_CORE,WALL_SOURCE_EVIDENCE,auditExteriorEnvelope} from '../../../src/building-pool/roadmap-1/m1-envelope-feasibility.mjs';
const pool=getM1Blueprints();
test('all 45 exterior wall shells use actually full-volume candidate cores and preserve openings as unresolved',()=>{
 assert.equal(pool.length,45);
 const reports=pool.map(auditExteriorEnvelope);
 assert.ok(reports.every(x=>x.solidCandidateWallCells>40&&x.windowCells>=3&&x.unresolvedDoorCells>=1));
 assert.ok(reports.every(x=>!x.weatherSealApproved&&!x.windowSealApproved&&!x.doorSweepApproved));
 assert.equal(new Set(reports.map(x=>x.id)).size,45);
});
test('isolated asset evidence distinguishes complete masonry/plank from thin plaster/partial timber',()=>{
 assert.equal(WALL_CORE.desert,'pack5:080');
 assert.equal(WALL_CORE.snow,'live:wood');
 assert.equal(WALL_CORE['enchanted-forest'],'pack2:013');
 assert.equal(WALL_SOURCE_EVIDENCE['pack5:080'].candidateOnly,true);
 assert.equal(WALL_SOURCE_EVIDENCE['live:wood'].candidateOnly,false);
});
test('reject partially occupied beam, log or plaster inserted into any exterior structural wall',()=>{
 for(const [biome,wrong] of [['desert','pack5:079'],['snow','pack2:014'],['enchanted-forest','pack2:015']]){
  const b=structuredClone(pool.find(q=>q.biome===biome));
  b.placements.find(p=>p.role==='wall').asset=wrong;
  assert.throws(()=>auditExteriorEnvelope(b),/partial\/false structural wall core/);
 }
});
test('reject accidental weather-hole in facade, even if logical room portal graph still connects',()=>{
 const b=structuredClone(pool.find(q=>q.category==='tavern'));
 const idx=b.placements.findIndex(p=>p.role==='wall'&&p.at[2]===1);
 b.placements.splice(idx,1);
 assert.throws(()=>auditExteriorEnvelope(b),/unscheduled hole in outer wall/);
});
test('reject decoration masquerading as structural exterior wall',()=>{
 const b=structuredClone(pool[0]),p=b.placements.find(p=>p.role==='wall');p.role='decoration';
 assert.throws(()=>auditExteriorEnvelope(b),/nonstructural facade element/);
});
