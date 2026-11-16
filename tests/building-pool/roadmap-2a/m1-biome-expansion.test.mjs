import test from 'node:test';
import assert from 'node:assert/strict';
import {M1_BIOME_EXPANSION} from '../../../src/building-pool/roadmap-2a/m1-biome-expansion.mjs';
import {M1_GENERAL_STORES} from '../../../src/building-pool/roadmap-2a/m1-general-stores.mjs';
import {M1_SPECIALIST_EXEMPLARS} from '../../../src/building-pool/roadmap-2a/m1-specialist-exemplars.mjs';
import {M1_NEW_MERCHANTS} from '../../../src/building-pool/roadmap-2a/m1-additional-shops.mjs';
import {M1_REGIONAL_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-regional-shops.mjs';
import {inventory,plannedSlots} from '../../../src/building-pool/roadmap-2a/catalog.mjs';
import {validateBlueprint,structuralFingerprint} from '../../../src/building-pool/roadmap-2a/schema.mjs';
const all=[...M1_GENERAL_STORES,...M1_SPECIALIST_EXEMPLARS,...M1_NEW_MERCHANTS,...M1_REGIONAL_SHOPS,...M1_BIOME_EXPANSION];
const cells=b=>new Map(b.voxels.map(v=>[[v.x,v.y,v.z].join(','),v]));
function reachable(b){
 const m=cells(b),e=b.openings.find(o=>o.type==='entrance'),q=[[e.x,1]],seen=new Set();
 for(let i=0;i<q.length;i++){
  const [x,z]=q[i],k=x+','+z;
  if(seen.has(k)||x<1||z<1||x>=b.extents.x-1||z>=b.extents.z-1||
     m.get(x+',1,'+z)?.kind!=='floor'||[2,3,4].some(y=>m.has(x+','+y+','+z)))continue;
  seen.add(k);for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])q.push([x+dx,z+dz]);
 }
 return seen;
}
test('six new source-authored regional structures make 38 genuine, unique, bounded 2A plans',()=>{
 assert.equal(M1_BIOME_EXPANSION.length,6);assert.equal(all.length,38);
 assert.equal(new Set(all.map(b=>b.id)).size,38);assert.equal(new Set(all.map(structuralFingerprint)).size,38);
 assert.equal(plannedSlots().filter(x=>x.authoredHere).length,86);
 assert.equal(inventory().target,420);assert.equal(inventory().authoredCandidateTotal,86);
 assert.equal(inventory().unwrittenNewCandidates,334);
 assert(all.some(b=>b.id==='r2:general-store:mountain:large:01'));
 assert(all.some(b=>b.id==='r2:general-store:mountain:large:02'));
 for(const b of M1_BIOME_EXPANSION){assert(validateBlueprint(b).valid);assert(plannedSlots().some(x=>x.id===b.id&&x.authoredHere));assert(b.voxels.length>=1500&&b.rooms.length>=3);assert(!b.worldPlaced&&!b.numericIdsAssigned);}
});
test('all new rooms connect by real 3-high open aisles; windows have material-specific source voxels',()=>{
 for(const b of M1_BIOME_EXPANSION){
  const m=cells(b),reachableCells=reachable(b);
  for(const r of b.rooms)assert(reachableCells.has(r.access.join(',')),b.id+' inaccessible '+r.name);
  for(const o of b.openings.filter(o=>['entrance','internal-doorway'].includes(o.type)))
   for(let d=0;d<3;d++)assert(!m.has([o.x,o.y+d,o.z].join(',')),b.id+' blocked portal');
  const windows=b.openings.filter(o=>o.type==='window');
  assert.equal(windows.length,b.voxels.filter(v=>v.kind==='window').length);
  for(const w of windows)assert.equal(m.get([w.x,w.y,w.z].join(','))?.material,w.material);
 }
});
test('each new building has physically stacked but regionally distinct source roof gable and ridge cells',()=>{
 const shapes=new Set();
 for(const b of M1_BIOME_EXPANSION){
  const m=cells(b),raised=b.voxels.filter(v=>v.roofBearing);
  assert(raised.length>100,b.id);
  for(const v of raised)assert.equal(m.get([v.x,v.y-1,v.z].join(','))?.kind,'roof',b.id+' unsupported added roof');
  shapes.add(JSON.stringify([...new Set(raised.map(v=>v.architecturalRole))].sort()));
 }
 assert.equal(shapes.size,6);
});
test('real two-cell oak display anchors and snow bank vaulted double door do not invent single-cell footprints',()=>{
 const pet=M1_BIOME_EXPANSION.find(x=>x.category==='pet-shop'),
   rails=pet.voxels.filter(v=>v.physicalVariant==='oak-stall-divider'),used=new Set();
 assert.equal(rails.length,4);
 for(const v of rails){
  assert(['north','west'].includes(v.intendedFacing));
  for(const [dx,dz] of(v.intendedFacing==='west'?[[0,0],[1,0]]:[[0,0],[0,1]])){
   const key=[v.x+dx,v.y,v.z+dz].join(',');assert(!used.has(key));used.add(key);
  }
 }
 assert.equal(used.size,8);
 const bank=M1_BIOME_EXPANSION.find(x=>x.category==='bank'),
   gate=bank.openings.find(o=>o.role==='vault-threshold'),
   mate=bank.openings.find(o=>o.role==='vault-wide-secondary');
 assert(gate&&mate);assert.equal(gate.doorSymbol,'pack5:094');
 assert.equal(gate.physicalVariant,'citadel-ironbound-leaves');assert.equal(gate.intendedFacing,'north');
 assert.deepEqual([mate.x,mate.y,mate.z],[gate.x+1,gate.y,gate.z]);
});
