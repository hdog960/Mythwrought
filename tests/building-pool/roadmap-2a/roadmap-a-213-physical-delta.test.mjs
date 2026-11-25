import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {auditRoadmapA213PhysicalDelta,verifyFinalSourceLedger,auditDeltaBuilding} from '../../../src/building-pool/roadmap-2a/roadmap-a-213-physical-delta.mjs';
let report;
test('new 213 original source candidates: exact accepted ledger and producer-backed delta, no placement authority',{timeout:300000},()=>{
 report=auditRoadmapA213PhysicalDelta();
 assert.equal(report.deltaCandidates,213);assert.equal(report.rows.length,213);
 assert.equal(report.priorHistorical+report.priorAuditedWaveCandidates+report.deltaCandidates,420);
 assert.equal(report.ledgerSHA256,'4a1d2896ef712149790ce88edb0ea49fc89d7fcc50f7b060d275893d0d3d5344');
 assert.equal(Object.keys(report.byCohort).length,18);assert.equal(report.byCohort.wave25,9);
 for(const row of report.rows){
  assert.equal(row.plasterHypotheticalYawSupport.length,4);
  assert.ok(row.risks.sourceCells>1000);assert.equal(row.worldPlacementAuthorized,false);
  assert.equal(row.variantOrYawAutoSelected,false);
  for(const f of row.fixtureOptions){assert.equal(f.orientationAssigned,false);assert.equal(f.yaws.length,4);}
 }
 for(const [k,v] of Object.entries(report.totals))assert.equal(v,report.rows.reduce((n,row)=>n+row.risks[k],0),k);
 assert.ok(report.totals.pack5MissingVariant>0);assert.ok(report.totals.plasterWholeWall>0);assert.ok(report.totals.brickRoof>0);
 assert.ok(report.producerOptions.every(x=>!x.selectedForBuilding&&x.variants.length===2&&x.variants.every(v=>v.yaws.length===4)));
 for(const k of ['physicalPackAccepted','structuralBearingCertified','realGameCollisionCertified','realGpuMeasured','creatorAccepted','iphoneAccepted','productionRegistered','worldPlacementAuthorized'])assert.equal(report[k],false,k);
 const folder='artifacts/roadmap-a-213-physical-delta';mkdirSync(folder,{recursive:true});
 const data=JSON.stringify(report,null,2)+'\n';writeFileSync(folder+'/ROADMAP_A_213_PHYSICAL_DELTA_HOLDS.json',data);
 console.log('ROADMAP_A_213_PHYSICAL_DELTA '+JSON.stringify({totals:report.totals,designs:report.rows.length,producerFamilies:report.producerOptions.length,sha256:createHash('sha256').update(data).digest('hex'),highestRisk:report.rows.slice(0,5).map(x=>({id:x.id,risks:x.risks})),physicalAcceptance:false}));
});
test('rejects wrong final ledger and unknown provenance before qualification',()=>{
 assert.throws(()=>verifyFinalSourceLedger({blueprints:[],remainingCanonicalIDs:[],sourceCandidates:420}),/420 source quota/);
 assert.throws(()=>auditDeltaBuilding({id:'not-authenticated'},null,'invalid','wave25'),/source provenance mismatch/);
});
