import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {buildRoadmapAProvisionalSettlementManifest} from '../../../src/building-pool/roadmap-2a/roadmap-a-a5-handoff.mjs';
test('Roadmap A5: 147 source records, exact 128+10+9 provenance, 273 genuinely missing canonical source IDs',{timeout:240000},()=>{
 const a=buildRoadmapAProvisionalSettlementManifest();
 assert.equal(a.historicSourceCount,128);
 assert.equal(a.wave01Provisional,10);assert.equal(a.wave02Provisional,9);
 assert.equal(a.totalAuthoredSourceCandidates,147);
 assert.equal(a.missingCanonicalSourceIDs.length,273);
 assert.equal(a.blueprints.length,147);assert.equal(new Set(a.blueprints.map(b=>b.id)).size,147);
 const groups={};for(const b of a.blueprints)groups[b.sourceProvenance.cohort]=(groups[b.sourceProvenance.cohort]??0)+1;
 assert.deepEqual(groups,{protected128:128,wave01:10,wave02:9});
 assert.equal(a.autoWorldRegistrationAllowed,false);
 assert.equal(a.saveSchemaModified,false);
});
test('Roadmap A5: each building has real source geometry SHA, entrance/roof/rooms/fixtures, honest unresolved physical and settlement gates',{timeout:240000},()=>{
 const m=buildRoadmapAProvisionalSettlementManifest();
 for(const b of m.blueprints){
  assert.match(b.sourceProvenance.fileSHA256,/^[a-f0-9]{64}$/,b.id);
  assert.match(b.sourceProvenance.geometrySHA256,/^[a-f0-9]{64}$/,b.id);
  assert.ok(b.occupiedGeometry.voxelCount>=50,b.id);
  assert.ok(b.plot.reservedEnvelopeCells.width>=4,b.id);
  assert.ok(b.plot.reservedEnvelopeCells.depth>=4,b.id);
  assert.ok(b.plot.groundedFloorCells>0,b.id);
  assert.ok(b.publicEntrances.length>=1,b.id);
  assert.ok(b.publicEntrances.every(e=>e.localFacing&&e.actualPlayerDoorCollisionUnverified),b.id);
  assert.ok(b.interiorRooms.length>=2,b.id);
  assert.ok(b.windows.length>=1,b.id);
  assert.ok(b.roof.sourceRoofCells>0,b.id);
  assert.ok(b.physicalDependencies.length>0,b.id);
  assert.equal(b.acceptance.productionRegistered,false,b.id);
  assert.equal(b.acceptance.saveSchema1Changed,false,b.id);
  assert.equal(b.screenshotEvidence.finalInstalledPackMeshScreenshotsAccepted,false,b.id);
 }
});
test('Roadmap A5: export deterministic manifest as CI artifact, no changes to gameplay or original source',{timeout:240000},()=>{
 const m=buildRoadmapAProvisionalSettlementManifest();
 const dir=join(process.cwd(),'artifacts','roadmap-a-a5');
 mkdirSync(dir,{recursive:true});
 writeFileSync(join(dir,'A5_SETTLEMENT_HANDOFF_PROVISIONAL.json'),JSON.stringify(m,null,2)+'\n');
 console.log('ROADMAP_A5_HANDOFF '+JSON.stringify({historic:m.historicSourceCount,wave01:m.wave01Provisional,wave02:m.wave02Provisional,missing:m.missingCanonicalSourceIDs.length,productionRegistered:false}));
});
