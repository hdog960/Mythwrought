import test from 'node:test';
import assert from 'node:assert/strict';
import {createWheatfieldBarn,createGlowglassConservatory,createReedhookPierLodge,
 createEstuaryHarborOffice,createHighpassLighthouse,getM1ServiceExemplars}
 from '../../../src/building-pool/roadmap-1b/m1-regional-services.mjs';
import {getInheritedStables} from '../../../src/building-pool/roadmap-1b/legacy-import.mjs';
import {get1BCandidates} from '../../../src/building-pool/roadmap-1b/candidates.mjs';
import {validateBlueprint,structuralFingerprint,stableBlueprintJSON} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
import {validateAllocation} from '../../../src/building-pool/roadmap-1b/schema.mjs';
const at=(a)=>a.join(',');
const roles=b=>new Set(b.placements.map(p=>p.role));
test('five unique category originals have full native 3D cells and circulation',()=>{
 const b=getM1ServiceExemplars(),names=b.map(x=>x.category);
 assert.deepEqual(names,['farm-barn','greenhouse','fishing-lodge','harbor-office','lighthouse']);
 assert.equal(new Set(b.map(x=>x.id)).size,5);
 assert.equal(new Set(b.map(x=>structuralFingerprint(x))).size,5);
 for(const x of b){
  assert.equal(validateBlueprint(x),true);
  assert.ok(x.placements.length>=700,'no shell-only candidate');
  assert.ok(x.walkable.length>=75);
  assert.ok(x.rooms.length>=2);
  assert.ok(x.portals.length>=2);
  assert.ok(roles(x).has('foundation'));
  assert.ok(roles(x).has('roof'));
  assert.ok(roles(x).has('window'));
  assert.equal(x.worldPlacement,false);assert.equal(x.liveIntegration,false);
  assert.equal(x.dependencies.length,1);
  assert.equal(x.dependencies[0].asset,'pack4:030');
  assert.ok(x.dependencies[0].requires.length>=3);
  const occupied=new Set(x.placements.map(p=>at(p.at)));
  for(const port of x.portals){
   assert.ok(!occupied.has(at(port.at)),'physical portal blocked '+x.id);
   assert.ok(!occupied.has(at([port.at[0],port.at[1]+1,port.at[2]])),'physical portal head blocked '+x.id);
   assert.ok(x.walkable.some(w=>at(w)===at(port.at)));
  }
  assert.equal(stableBlueprintJSON(x),stableBlueprintJSON(getM1ServiceExemplars().find(z=>z.id===x.id)));
 }
});
test('barn preserves actual 2-cell wagon gate, independent repair and grain bays',()=>{
 const x=createWheatfieldBarn(),occup=new Set(x.placements.map(p=>at(p.at)));
 assert.equal(x.rooms.length,3);assert.ok(x.placements.some(p=>p.purpose==='wagon-tackle'));
 for(const q of [[8,1,1],[9,1,1],[8,2,1],[9,2,1]])assert.ok(!occup.has(at(q)));
 assert.ok(x.portals.some(p=>p.opening==='two-cell-wide-wagon-gate'));
});
test('greenhouse has truly transparent roof, real noninteractive growing trays and central aisle',()=>{
 const x=createGlowglassConservatory();
 assert.ok(x.placements.filter(p=>p.role==='roof'&&p.asset==='pack4:030').length>=80);
 assert.ok(x.placements.filter(p=>p.purpose==='raised-growing-tray').length>=30);
 assert.ok(x.placements.some(p=>p.purpose==='decorative-potting-soil'));
 assert.ok(x.walkable.some(w=>at(w)==='7,1,12'));
 assert.equal(x.architecturalIdentity.actualGrowing,false);
 assert.equal(x.architecturalIdentity.actualGrowing===true,false);
});
test('fishing lodge dock is a real physical pier without inventing water physics',()=>{
 const x=createReedhookPierLodge(),walk=new Set(x.walkable.map(at));
 assert.ok(walk.has('7,1,22'));assert.ok(walk.has('7,1,16'));
 assert.ok(x.placements.some(p=>at(p.at)==='5,1,22'&&p.role==='support'));
 assert.equal(x.architecturalIdentity.simulatedWater,false);
 assert.equal(x.architecturalIdentity.boatSystem,false);
});
test('harbor office physically separates public lobby, chart and ledger rooms',()=>{
 const x=createEstuaryHarborOffice();
 assert.deepEqual(x.rooms.map(r=>r.id),['public-permit-lobby','charts-and-navigation','ledger-office']);
 assert.ok(x.placements.some(p=>p.purpose==='chart-table'));
 assert.ok(x.placements.some(p=>p.purpose==='records-cabinet'));
 assert.ok(x.portals.some(p=>p.from==='charts-and-navigation'&&p.to==='ledger-office'));
});
test('lighthouse has genuine circular tower, supported upper landings and vertically connected shaft',()=>{
 const x=createHighpassLighthouse(),walk=new Set(x.walkable.map(at));
 assert.equal(x.footprint.height,24);
 assert.ok(x.placements.filter(p=>p.role==='stair'&&p.purpose==='inner-climb-rung').length>=15);
 for(let y=1;y<=16;y++)assert.ok(walk.has('7,'+y+',7'),'missing vertical shaft cell '+y);
 assert.ok(walk.has('7,6,8'));assert.ok(walk.has('7,12,8'));
 assert.equal(x.architecturalIdentity.beaconLit,false);
 assert.equal(x.architecturalIdentity.climbMechanicApproved,false);
 assert.ok(x.placements.some(p=>p.purpose==='landing-underframe'));
});
test('M1 seven-category exemplars remain exact in expanding Builder 1B catalog',()=>{
 const original=getInheritedStables(),all=get1BCandidates(),counts=validateAllocation(all);
 assert.equal(original.length,15);assert.ok(all.length>=28);
 assert.equal(counts.authored,all.length);assert.equal(counts.remaining,435-all.length);
 assert.equal(new Set(all.map(x=>x.id)).size,all.length);
 for(const b of original){const next=all.find(x=>x.id===b.id);assert.ok(next);assert.equal(stableBlueprintJSON(next),stableBlueprintJSON(b));}
 const exemplars=getM1ServiceExemplars();assert.equal(exemplars.length,5);
 for(const b of exemplars){const next=all.find(x=>x.id===b.id);assert.ok(next);assert.equal(stableBlueprintJSON(next),stableBlueprintJSON(b));}
});

test('M1 genuine four distinct structural roof profiles show backed height progression',()=>{
 const items=getM1ServiceExemplars(),expected=new Map([
  ['farm-barn','two-slope-stepped-gable'],
  ['greenhouse','glazed-double-pitched-roof'],
  ['fishing-lodge','shore-lean-to'],
  ['harbor-office','four-way-hip']
 ]);
 for(const b of items){
  if(!expected.has(b.category))continue;
  const roof=b.placements.filter(p=>p.role==='roof');
  const levels=[...new Set(roof.map(p=>p.at[1]))].sort((x,y)=>x-y);
  assert.ok(levels.length>=4,'Roof is a falsely flat capped box: '+b.category);
  const profiles=new Set(roof.map(p=>p.roofProfile));
  assert.deepEqual([...profiles],[expected.get(b.category)],'Wrong physical roof profile: '+b.category);
  assert.ok(b.placements.some(p=>p.role==='support'&&(p.purlinBearingApproved===false||p.roofBearingApproved===false)),
   'Missing physically placed under-roof bearing candidates: '+b.category);
 }
 const greenhouse=items.find(b=>b.category==='greenhouse');
 assert.ok(greenhouse.placements.filter(p=>p.role==='roof'&&p.asset==='pack4:030').length>50);
 assert.ok(greenhouse.placements.every(p=>p.asset!=='pack5:090'),'No oven/range can be a greenhouse planter');
});
