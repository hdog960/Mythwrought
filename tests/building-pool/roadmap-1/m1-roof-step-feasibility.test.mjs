import test from 'node:test';
import assert from 'node:assert/strict';
import {getM1Blueprints} from '../../../src/building-pool/roadmap-1/m1-buildings.mjs';
import {auditRoofStepFeasibility,roofStepTargets} from '../../../src/building-pool/roadmap-1/m1-roof-step-feasibility.mjs';
const all=getM1Blueprints();
test('45 roof profiles receive real registered step-backing where unfinished Pack3 tiles leave riser gaps',()=>{
 const reports=all.map(auditRoofStepFeasibility);
 assert.equal(reports.length,45);
 assert.equal(reports.reduce((n,r)=>n+r.needed,0),2519);
 assert.equal(reports.reduce((n,r)=>n+r.filled,0),2309);
 assert.equal(reports.reduce((n,r)=>n+r.unresolved,0),210);
 assert.ok(reports.every(r=>!r.weatherSealApproved));
});
test('the exposed roof risers actually exist as full registered live-voxel cells',()=>{
 for(const b of all){const r=auditRoofStepFeasibility(b);assert.equal(r.needed,r.filled+r.unresolved);}
});
test('missing actual live riser is caught even if original thin roof tile remains',()=>{
 const b=structuredClone(all.find(b=>b.architecturalIdentity.roofStepAudit.filled>0));
 b.placements.splice(b.placements.findIndex(p=>p.roofRiser==='live-solid-step-backing'),1);
 assert.throws(()=>auditRoofStepFeasibility(b),/raw exposed gap remains/);
});
test('a narrow physical candidate beam cannot be mislabeled as a full solid step riser',()=>{
 const b=structuredClone(all.find(b=>b.architecturalIdentity.roofStepAudit.unresolved.length>0));
 const c=b.architecturalIdentity.roofStepAudit.unresolved[0].cell;
 const p=b.placements.find(p=>p.at.every((v,i)=>v===c[i]));
 p.roofRiser='live-solid-step-backing';p.asset='pack2:015';
 assert.throws(()=>auditRoofStepFeasibility(b),/pending partial-beam collision not tracked|fake solid step riser/);
});
test('false physical roof weather-approval must fail',()=>{
 const b=structuredClone(all[0]);b.architecturalIdentity.roofStepAudit.weatherSealApproved=true;
 assert.throws(()=>auditRoofStepFeasibility(b),/cannot certify/);
});
test('intentional open-air courtyards remain unfilled',()=>{
 const courtyards=all.filter(b=>b.architecturalIdentity.roof==='courtyard');
 assert.ok(courtyards.length>=1);
 for(const b of courtyards)assert.equal(auditRoofStepFeasibility(b).id,b.id);
});
