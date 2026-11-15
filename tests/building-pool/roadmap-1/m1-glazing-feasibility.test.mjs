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

test('all three roof lanterns have truly open uninterrupted daylight shafts to an occupiable interior',()=>{
 const lanterns=buildings.filter(b=>b.architecturalIdentity.feature==='skylight');
 assert.equal(lanterns.length,3);
 for(const b of lanterns){
  const opening=b.architecturalIdentity.daylightOpening;
  assert.ok(opening&&!opening.daylightApproved&&!opening.weatherSealApproved,b.id);
  const [x,y,z]=opening.cell;
  const occ=new Set(b.placements.map(p=>p.at.join(',')));
  for(let level=1;level<=y;level++)assert.ok(!occ.has([x,level,z].join(',')),b.id+': non-open skylight at '+level);
  assert.ok(b.placements.some(p=>p.roofLantern==='vertical-glazing'&&p.at[0]===x&&p.at[1]===y+1&&p.at[2]===z));
  assert.equal(auditCandidateGlazing(b).roofLantern,1);
 }
});
test('a fake sunlight aperture with its original roofing reinserted is rejected',()=>{
 const b=clone(buildings.find(b=>b.architecturalIdentity.feature==='skylight'));
 b.placements.push({at:[...b.architecturalIdentity.daylightOpening.cell],role:'roof',asset:'pack3:023',orientation:'none',occupancy:{kind:'unresolved',bounds:null,reason:'candidate'}});
 assert.throws(()=>auditCandidateGlazing(b),/false skylight has a solid roof tile blocking daylight/);
});
test('a beam inserted across a daylight shaft is detected even if the upper glazed pane is unchanged',()=>{
 const b=clone(buildings.find(b=>b.architecturalIdentity.feature==='skylight'));
 const [x,y,z]=b.architecturalIdentity.daylightOpening.cell;
 b.placements.push({at:[x,Math.max(2,y-2),z],role:'support',asset:'live:wood',orientation:'none',occupancy:{kind:'full-cell',bounds:[0,0,0,1,1,1]}});
 assert.throws(()=>auditCandidateGlazing(b),/roof shaft blocked by a beam or support/);
});
