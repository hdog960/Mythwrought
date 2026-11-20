import test from 'node:test';
import assert from 'node:assert/strict';
import {buildBriarfordSwitchwingBarn,BRIARFORD_BARN_ID} from '../../../src/building-pool/roadmap-b/builder-b-essentials-wave1.mjs';
import {getBuilderBServiceOwnership} from '../../../src/building-pool/roadmap-b/ownership-1b.mjs';
import {validateAllocation} from '../../../src/building-pool/roadmap-1b/schema.mjs';
test('Briarford original farm barn is reserved to Builder B, not accepted history or Builder D',()=>{
 const ledger=getBuilderBServiceOwnership();
 const b=buildBriarfordSwitchwingBarn();
 assert.equal(b.id,BRIARFORD_BARN_ID);
 assert.ok(ledger.builderBIds.includes(b.id),'candidate ID not in exact B reservation');
 assert.ok(!ledger.builderDAvailableIds.includes(b.id),'Builder D reservation breach');
 assert.deepEqual([validateAllocation([b]).authored,validateAllocation([b]).target],[1,435]);
 assert.equal(b.worldPlacement,false);
});
test('Briarford true source roof backing, open sky court, physically connected rooms, access and inert fixtures',()=>{
 const b=buildBriarfordSwitchwingBarn(),grid=new Set(b.placements.map(p=>p.at.join(',')));
 assert.equal(b.rooms.length,5);assert.equal(b.portals.length,7);
 assert.ok(b.walkable.length>=500);
 const exteriorCourt=(x,z)=>x>=20&&x<=26&&z>=16&&z<=23;
 for(const p of b.placements)assert.ok(!exteriorCourt(p.at[0],p.at[2]),'painted over real absent-ground courtyard '+p.at.join(','));
 for(const p of b.placements.filter(p=>p.role==='roof'))
  assert.ok(grid.has([p.at[0],p.at[1]-1,p.at[2]].join(',')),'unsupported literal source roof '+p.at.join(','));
 for(const portal of b.portals){
  assert.ok(!grid.has(portal.at.join(',')),'blocked two-high physical portal '+portal.at.join(','));
  assert.ok(!grid.has([portal.at[0],portal.at[1]+1,portal.at[2]].join(',')),'blocked door headroom');
 }
 const roomIds=new Set(b.rooms.map(r=>r.id));
 assert.ok(b.portals.every(p=>(p.from==='outside'||roomIds.has(p.from))&&roomIds.has(p.to)));
 assert.ok(!b.liveIntegration);
});
