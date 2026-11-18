import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createLegacyBlacksmithPool} from '../../../src/building-pool/roadmap-3a/legacy-blacksmiths.mjs';
import {createM2ThirdVariantPool} from '../../../src/building-pool/roadmap-3a/m2-metalwork-third-variants.mjs';
import {auditA3SourceSpecificBlockerLocations} from '../../../src/building-pool/roadmap-3a/a3-source-specific-physical-ledger.mjs';
const sha=b=>createHash('sha256').update(JSON.stringify(b.modules)).digest('hex');
test('A3 per-coordinate ledger preserves all original legacy/M2 third fingerprints and four separate work queues',()=>{
 const old=createLegacyBlacksmithPool().map(b=>[b.id,sha(b)]);
 const previous=createM2ThirdVariantPool().map(b=>[b.id,sha(b)]);
 const a=auditA3SourceSpecificBlockerLocations(),c=a.counts;
 assert.deepEqual(c,{original3ADesigns:345,legacyFireplaceMounts:15,legacyChimneyMounts:15,
 sampledRoofWitnessGaps:274,unplacedBeamOptions:156,physicalSupportsInstalled:0,originalSourcesChanged:0});
 assert.equal(a.roofCohorts.length,4);
 assert.deepEqual(a.roofCohorts.map(x=>x.witnessGaps),[33,118,83,40]);
 assert.equal(new Set(a.roofWitnessRecords.map(x=>x.cohort+':'+x.id+':'+x.at.join(','))).size,274);
 assert.equal(new Set(a.unplacedBeamRecords.map(x=>x.id+':'+x.proposedBeam.join(','))).size,156);
 assert.ok(a.legacyFireplaceMounts.every(x=>x.family==='pack4:064'&&x.sourceCellOccupied===false&&x.sourceUnchanged));
 assert.ok(a.legacyChimneyMounts.every(x=>x.family==='pack4:063'&&x.sourceCellOccupied===false&&x.sourceUnchanged));
 assert.ok(a.roofWitnessRecords.every(x=>x.sampledNearbyBearingWitness===false&&x.confirmedEngineeringLoadFailure===false));
 assert.ok(a.unplacedBeamRecords.every(x=>x.installed===false&&x.structurallyApproved===false&&x.producerOrientationCertified===false));
 assert.ok(a.unplacedBeamRecords.every(x=>!x.inFunctionalFlueColumn||x.classification==='BLOCKED_WITHOUT_AUTHOR_REDESIGN'));
 assert.ok(a.unplacedBeamRecords.every(x=>!x.reservedWalkwayConflict||x.classification==='BLOCKED_WITHOUT_AUTHOR_REDESIGN'));
 assert.equal(a.gameRegistration,false);assert.equal(a.sourceModifications,0);
 assert.deepEqual(createLegacyBlacksmithPool().map(b=>[b.id,sha(b)]),old);
 assert.deepEqual(createM2ThirdVariantPool().map(b=>[b.id,sha(b)]),previous);
 console.log('A3_PER_COORDINATE_PHYSICAL_QUEUE '+JSON.stringify({
 mounts:[c.legacyFireplaceMounts,c.legacyChimneyMounts],roof:c.sampledRoofWitnessGaps,
 beams:c.unplacedBeamOptions,flueRejections:a.unplacedBeamRecords.filter(x=>x.inFunctionalFlueColumn).length,
 walkwayRejections:a.unplacedBeamRecords.filter(x=>x.reservedWalkwayConflict).length,
 noImmediateBearing:a.unplacedBeamRecords.filter(x=>!x.authoredBearingImmediatelyBelow).length}));
});
