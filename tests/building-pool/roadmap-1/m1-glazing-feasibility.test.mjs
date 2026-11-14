import test from 'node:test';
import assert from 'node:assert/strict';
import {getM1Blueprints} from '../../../src/building-pool/roadmap-1/m1-buildings.mjs';
import {auditCandidateGlazing,REGIONAL_GLAZING} from '../../../src/building-pool/roadmap-1/m1-glazing-feasibility.mjs';
const buildings=getM1Blueprints();
const clone=b=>structuredClone(b);
test('all 180 facade windows use actual transparent pane candidates rather than open frames or bare shutters',()=>{
 const reports=buildings.map(auditCandidateGlazing);
 assert.equal(reports.length,45);
 assert.equal(reports.reduce((s,r)=>s+r.perimeter,0),180);
 assert.ok(reports.every(r=>!r.windowSealApproved&&!r.rotationStateIntegrated));
 assert.deepEqual(Object.keys(REGIONAL_GLAZING).sort(),['desert','enchanted-forest','mountain','snow','temperate']);
});
test('all north/east/west/south planes of the facade have a matched physical Y-axis yaw',()=>{
 const seen=new Set();
 for(const b of buildings){for(const p of b.placements.filter(p=>p.role==='window'&&!p.roofLantern))seen.add(p.orientation);}
 assert.ok(seen.has('north')&&seen.has('east')&&seen.has('west'));
 assert.ok(!seen.has('up'));
});
test('three unsupported horizontal roof panes replaced by framed vertical rooftop lantern candidates',()=>{
 const lanterns=buildings.filter(b=>b.architecturalIdentity.feature==='skylight');
 assert.equal(lanterns.length,3);
 assert.ok(lanterns.every(b=>auditCandidateGlazing(b).roofLantern===1));
 assert.ok(lanterns.every(b=>b.placements.some(p=>p.roofLantern==='cap')));
});
test('horizontal up-rotation cannot sneak back into Pack4 pane cells',()=>{
 const b=clone(buildings[0]);b.placements.find(p=>p.role==='window').orientation='up';
 assert.throws(()=>auditCandidateGlazing(b),/pane yaw incompatible|illegal horizontal/);
});
test('hollow wooden frame or wall-mounted shutters alone cannot certify a glazed opening',()=>{
 for(const id of ['r1:house:desert:small:001','r1:house:snow:small:001']){
  const b=clone(buildings.find(x=>x.id===id));b.placements.find(p=>p.role==='window').asset=b.biome==='desert'?'pack4:032':'pack4:033';
  assert.throws(()=>auditCandidateGlazing(b),/unglazed frame\/shutter/);
 }
});
test('a raised lantern without supported side-post frame or cap is not accepted',()=>{
 const b=clone(buildings.find(b=>b.architecturalIdentity.feature==='skylight'));
 const i=b.placements.findIndex(p=>p.roofLantern==='side-post');b.placements.splice(i,1);
 assert.throws(()=>auditCandidateGlazing(b),/lacks physical vertical posts/);
});
