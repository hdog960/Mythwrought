import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {auditM2ThirdPhysicalFamilyFit} from '../../../src/building-pool/roadmap-3a/m2-third-physical-aabb-audit.mjs';
test('all thirty source models audited against actual producer collision and occupancy AABBs; no live-placement claim',()=>{
 const r=auditM2ThirdPhysicalFamilyFit();
 assert.equal(r.newCandidateModels,30);
 assert.equal(r.originalFifteenChanged,false);
 assert.equal(r.legacyBlacksmithMountBlockers,30);
 assert.equal(r.productionPlacements,0);
 assert.equal(r.realPhysicalFamilyAudit,true);
 assert.equal(r.preciseWorldCollisionCertified,false);
 assert.equal(r.measuredPhysicalIPhone,false);
 assert.ok(r.models.every(b=>b.sampledRoofTiles>30));
 assert.ok(r.models.every(b=>b.fixtures.length=== (b.category==='blacksmith'?3:2)));
 assert.equal(r.models.filter(b=>b.hollowFlueUnobstructed).length,15);
 assert.ok(r.models.every(b=>b.productionStructuralApproval===false));
 assert.equal(r.missingSourceSupportOffsets,0);
 assert.equal(r.physicalReservationsBlocked,0);
 assert.ok(Number.isSafeInteger(r.fixtureAABBIntersections)&&r.fixtureAABBIntersections>=0);
 assert.ok(Number.isSafeInteger(r.uncertifiedRoofSamples)&&r.uncertifiedRoofSamples>=0);
 const out=join(process.cwd(),'artifacts/building-roadmap-3a-m2-third');
 mkdirSync(out,{recursive:true});
 writeFileSync(join(out,'SOURCE_PHYSICAL_AABB_DIAGNOSTICS.json'),JSON.stringify(r,null,2)+'\n');
 console.log('3A 30 genuine producer-derived physical AABB layouts: clashes '+r.fixtureAABBIntersections+
  ' sampled roof bearing outstanding '+r.uncertifiedRoofSamples+
  '; legacy supports unresolved '+r.legacyBlacksmithMountBlockers);
});
test('every fixture is a selected original producer source variant with actual collision boxes/support offsets',()=>{
 const r=auditM2ThirdPhysicalFamilyFit();
 for(const m of r.models)for(const f of m.fixtures){
  assert.ok(f.sourceSelectable);
  assert.equal(f.livePlaceable,false);
  assert.ok(f.visibleBoxes>0&&f.collisionBoxes>=0);
  assert.ok(Number.isInteger(f.sourceNumericId));
  assert.equal(f.rotation,'north');
  if(f.family==='pack5:088')assert.equal(f.actualSelectedVariant,'blackiron-horn');
  assert.ok(f.supportOffsets.every(s=>s.present));
  assert.deepEqual(f.overlappingReservedCoordinates,[]);
 }
});
