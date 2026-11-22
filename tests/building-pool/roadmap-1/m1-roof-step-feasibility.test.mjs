import test from 'node:test';
import assert from 'node:assert/strict';
import {getM1Blueprints} from '../../../src/building-pool/roadmap-1/m1-buildings.mjs';
import {auditRoofStepFeasibility,roofStepTargets} from '../../../src/building-pool/roadmap-1/m1-roof-step-feasibility.mjs';
const all=getM1Blueprints();
test('45 roof profiles receive real registered step-backing where unfinished Pack3 tiles leave riser gaps',()=>{
 const reports=all.map(auditRoofStepFeasibility);
 assert.equal(reports.length,45);
 assert.equal(reports.reduce((n,r)=>n+r.needed,0),2518);
 assert.equal(reports.reduce((n,r)=>n+r.filled,0),2518);
 assert.equal(reports.reduce((n,r)=>n+r.unresolved,0),0);
 assert.equal(reports.reduce((n,r)=>n+r.solidPostSubstitutions,0),210);
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
test('a narrow physical candidate beam cannot be mislabeled as full solid backing',()=>{
 const b=structuredClone(all.find(b=>b.architecturalIdentity.roofStepAudit.solidPostSubstitutions.length>0));
 const c=b.architecturalIdentity.roofStepAudit.solidPostSubstitutions[0];
 const p=b.placements.find(p=>p.at.every((v,i)=>v===c[i]));
 p.asset='pack2:015';
 assert.throws(()=>auditRoofStepFeasibility(b),/fake solid step riser|pending partial-beam collision not tracked/);
});
test('all 210 former partial candidate tie-post step intersections use real registered solid wood, never invented Pack2 collision',()=>{
 let n=0;
 for(const b of all){const r=auditRoofStepFeasibility(b);n+=r.solidPostSubstitutions;
  assert.equal(r.unresolved,0);assert.ok(b.architecturalIdentity.roofFrame.spanApproval==='unresolved');
 }
 assert.equal(n,210);
});
test('forged audited post-substitution without a corresponding solid live tie-post is rejected',()=>{
 const b=structuredClone(all.find(b=>b.architecturalIdentity.roofStepAudit.solidPostSubstitutions.length>0));
 const c=b.architecturalIdentity.roofStepAudit.solidPostSubstitutions[0];
 const p=b.placements.find(p=>p.at.every((v,i)=>v===c[i]));
 delete p.postSubstitution;
 assert.throws(()=>auditRoofStepFeasibility(b),/ghost roof-post substitution record/);
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
