import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {buildRoadmapAProvisionalSettlementManifest} from '../../../src/building-pool/roadmap-2a/roadmap-a-a5-handoff.mjs';
import {buildRoadmapAExpandedProvisionalSettlementManifest} from '../../../src/building-pool/roadmap-2a/roadmap-a-a5-expanded-handoff.mjs';
test('Roadmap A5 v2 preserves every prior 147 A5 record and extends to 171 without duplicates',{timeout:240000},()=>{
 const prior=buildRoadmapAProvisionalSettlementManifest();
 const manifest=buildRoadmapAExpandedProvisionalSettlementManifest();
 assert.equal(manifest.blueprints.length,171);
 assert.equal(manifest.sourceCandidates,171);
 assert.equal(manifest.remainingCanonicalIDs.length,249);
 assert.equal(new Set(manifest.blueprints.map(b=>b.id)).size,171);
 assert.equal(manifest.protected128,128);
 assert.equal(manifest.wave01,10);assert.equal(manifest.wave02,9);
 assert.equal(manifest.wave03,12);assert.equal(manifest.wave04,12);
 for(const b of prior.blueprints)assert.deepEqual(manifest.blueprints.find(x=>x.id===b.id),b,b.id);
 assert.equal(manifest.productionGameRegistration,false);
 assert.equal(manifest.schema1SaveMutation,false);
});
test('Roadmap A5 v2: new 24 source records carry auditable plot/entry/source/physical-dependency and unfinished gate details',{timeout:240000},()=>{
 const manifest=buildRoadmapAExpandedProvisionalSettlementManifest();
 const fresh=manifest.blueprints.filter(b=>['wave03','wave04'].includes(b.sourceProvenance.cohort));
 assert.equal(fresh.length,24);
 for(const b of fresh){
  assert.match(b.sourceProvenance.fileSHA256,/^[a-f0-9]{64}$/,b.id);
  assert.match(b.sourceProvenance.geometrySHA256,/^[a-f0-9]{64}$/,b.id);
  assert.ok(b.occupiedGeometry.voxelCount>1000,b.id);
  assert.ok(b.plot.reservedEnvelopeCells.width>20,b.id);
  assert.ok(b.plot.groundedFloorCells>400,b.id);
  assert.ok(b.publicEntrances.length>=2,b.id);
  assert.equal(b.publicEntrances[0].localFacing,'local-negative-z',b.id);
  assert.equal(b.interiorRooms.length,4,b.id);
  assert.ok(b.windows.length>=6,b.id);
  assert.equal(b.screenshotEvidence.actualSourceSpecificScreenshotAccepted,false,b.id);
  assert.equal(b.acceptance.productionRegistered,false,b.id);
  assert.equal(b.roof.installedBearingLoadAndClimateUnverified,true,b.id);
  assert.ok(b.physicalDependencies.length>=3,b.id);
 }
});
test('Roadmap A5 v2: emit source-only 171-record artifact with no game registration',{timeout:240000},()=>{
 const manifest=buildRoadmapAExpandedProvisionalSettlementManifest();
 const path=join(process.cwd(),'artifacts','roadmap-a-a5');
 mkdirSync(path,{recursive:true});
 writeFileSync(join(path,'A5_SETTLEMENT_HANDOFF_171_PROVISIONAL.json'),JSON.stringify(manifest,null,2)+'\n');
 console.log('ROADMAP_A5_EXTENDED '+JSON.stringify({records:manifest.sourceCandidates,remaining:manifest.remainingCanonicalIDs.length,registration:false}));
});
