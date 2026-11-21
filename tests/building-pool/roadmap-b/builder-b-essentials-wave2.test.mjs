import test from 'node:test';
import assert from 'node:assert/strict';
import {buildAlderglassTrellisConservatory,ALDERGLASS_GREENHOUSE_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave2.mjs';
import {getBuilderBServiceOwnership} from '../../../src/building-pool/roadmap-b/ownership-1b.mjs';
import {validateAllocation} from '../../../src/building-pool/roadmap-1b/schema.mjs';
test('Alderglass greenhouse is original Builder B ID, not historical or Builder D owned',()=>{
 const b=buildAlderglassTrellisConservatory(),ownership=getBuilderBServiceOwnership();
 assert.equal(b.id,ALDERGLASS_GREENHOUSE_ID);
 assert.ok(ownership.builderBIds.includes(b.id));
 assert.ok(!ownership.builderDAvailableIds.includes(b.id));
 assert.equal(validateAllocation([b]).authored,1);
 assert.equal(b.worldPlacement,false);
});
test('Alderglass true cardinal upright greenhouse glazing, supported opaque roof and accessible growing rooms',()=>{
 const b=buildAlderglassTrellisConservatory(),K=p=>p.join(','),grid=new Set(b.placements.map(x=>K(x.at)));
 assert.equal(b.rooms.length,6);assert.equal(b.portals.length,8);
 assert.ok(b.walkable.length>=650);
 for(let x=19;x<=24;x++)for(let z=18;z<=24;z++){
  assert.ok(!b.placements.some(p=>p.at[0]===x&&p.at[2]===z),'garden must be genuine sky-open absent foundation');
 }
 const roof=b.placements.filter(p=>p.role==='roof'),
  glass=b.placements.filter(p=>p.role==='window'&&p.originalGlazing===true);
 assert.ok(glass.length>=300,'original 300+ translucent source surfaces must not disappear');
 assert.equal(glass.length,371,'exact original 371 transparent source panes were not preserved');
 assert.equal(b.placements.filter(p=>p.asset==='pack4:030').length,383,
  'original twelve ground windows and all 371 new upright windows must be preserved');
 assert.equal(roof.length,1097,'original source roof silhouette changed');
 assert.ok(roof.filter(p=>p.asset==='pack3:026').length>=350,
  'original at-least-350 opaque ribs must not disappear');
 assert.ok(roof.every(p=>p.asset==='pack3:026'&&p.glazed!==true),
  'Pack4:030 upright opening-window cannot be assigned as a roof tile');
 for(const p of roof)
  assert.ok(grid.has(K([p.at[0],p.at[1]-1,p.at[2]])),'unsupported original roof '+K(p.at));
 assert.equal(b.architecturalIdentity.glassRoofPanels,0,'false horizontal glass roof claim');
 assert.equal(b.architecturalIdentity.sourceUprightGlazingPanels,371);
 assert.equal(b.architecturalIdentity.opaqueRoofSourceCells,1097);
 assert.ok(b.placements.filter(p=>p.role==='support').length>=250);
 for(const p of b.portals){
  assert.ok(!grid.has(K(p.at)),'blocked passage');
  assert.ok(!grid.has(K([p.at[0],p.at[1]+1,p.at[2]])),'blocked 2-high portal');
 }
 assert.equal(b.liveIntegration,false);
});
