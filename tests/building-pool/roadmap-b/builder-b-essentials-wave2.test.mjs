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
test('Alderglass truly glazed roof, grounded timber and accessible growing rooms',()=>{
 const b=buildAlderglassTrellisConservatory(),K=p=>p.join(','),grid=new Set(b.placements.map(x=>K(x.at)));
 assert.equal(b.rooms.length,6);assert.equal(b.portals.length,8);
 assert.ok(b.walkable.length>=650);
 for(let x=19;x<=24;x++)for(let z=18;z<=24;z++){
  assert.ok(!b.placements.some(p=>p.at[0]===x&&p.at[2]===z),'garden must be genuine sky-open absent foundation');
 }
 const roof=b.placements.filter(p=>p.role==='roof'),
 glass=roof.filter(p=>p.glazed);
 assert.ok(glass.length>=250,'not enough genuine glazed roof surface');
 assert.ok(b.placements.filter(p=>p.role==='window').length>=12,'missing vertical greenhouse glazing');
 for(const p of roof.filter(p=>!p.glazed))
  assert.ok(grid.has(K([p.at[0],p.at[1]-1,p.at[2]])),'unsupported non-glazed roof '+K(p.at));
 assert.ok(b.placements.filter(p=>p.role==='support').length>=250);
 for(const p of b.portals){
  assert.ok(!grid.has(K(p.at)),'blocked passage');
  assert.ok(!grid.has(K([p.at[0],p.at[1]+1,p.at[2]])),'blocked 2-high portal');
 }
 assert.equal(b.liveIntegration,false);
});
