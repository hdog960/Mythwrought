import test from 'node:test';
import assert from 'node:assert/strict';
import {M1_CATEGORY_ARCADES,M1_CATEGORY_ARCADES_PROFILES} from '../../../src/building-pool/roadmap-2a/m1-category-arcades.mjs';
import {M1_GENERAL_STORES} from '../../../src/building-pool/roadmap-2a/m1-general-stores.mjs';
import {M1_SPECIALIST_EXEMPLARS} from '../../../src/building-pool/roadmap-2a/m1-specialist-exemplars.mjs';
import {M1_NEW_MERCHANTS} from '../../../src/building-pool/roadmap-2a/m1-additional-shops.mjs';
import {M1_REGIONAL_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-regional-shops.mjs';
import {M1_BIOME_EXPANSION} from '../../../src/building-pool/roadmap-2a/m1-biome-expansion.mjs';
import {plannedSlots,inventory} from '../../../src/building-pool/roadmap-2a/catalog.mjs';
import {validateBlueprint,structuralFingerprint} from '../../../src/building-pool/roadmap-2a/schema.mjs';
import {resolveManualFivePackAsset} from '../../../src/builder-assets/manual-five-pack.mjs';
const models=[...M1_GENERAL_STORES,...M1_SPECIALIST_EXEMPLARS,...M1_NEW_MERCHANTS,...M1_REGIONAL_SHOPS,...M1_BIOME_EXPANSION,...M1_CATEGORY_ARCADES];
const point=(x,y,z)=>[x,y,z].join(',');
const cells=b=>new Map(b.voxels.map(v=>[point(v.x,v.y,v.z),v]));
function reachable(b){
 const c=cells(b),start=b.openings.find(o=>o.type==='entrance'),queue=[[start.x,1]],seen=new Set();
 for(let i=0;i<queue.length;i++){
  const [x,z]=queue[i],key=x+','+z;
  if(seen.has(key)||x<1||z<1||x>=b.extents.x-1||z>=b.extents.z-1||
    c.get(point(x,1,z))?.kind!=='floor'||[2,3,4].some(y=>c.has(point(x,y,z))))continue;
  seen.add(key);for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])queue.push([x+dx,z+dz]);
 }
 return seen;
}
test('six distinctly authored categories increase real 2A to 44/420 with 376 unauthored and zero deployment',()=>{
 assert.equal(M1_CATEGORY_ARCADES.length,6);assert.equal(models.length,44);
 assert.equal(new Set(models.map(x=>x.id)).size,44);
 assert.equal(new Set(models.map(structuralFingerprint)).size,44);
 assert.equal(plannedSlots().filter(x=>x.authoredHere).length,74);
 assert.equal(inventory().target,420);assert.equal(inventory().authoredCandidateTotal,74);
 assert.equal(inventory().unwrittenNewCandidates,346);assert.equal(inventory().newlyAuthored,59);
 assert.equal(inventory().creatorApproved,0);assert.equal(inventory().integratedIntoGame,0);
 assert.deepEqual(M1_CATEGORY_ARCADES.map(x=>x.category),
  ['general-store','pet-shop','magic-shop','potion-shop','bakery','bank']);
 for(const b of M1_CATEGORY_ARCADES){
  assert(validateBlueprint(b).valid);assert(plannedSlots().some(s=>s.id===b.id&&s.authoredHere));
  assert(b.voxels.length>1200&&b.rooms.length===3);
  assert.equal(b.worldPlaced,false);assert.equal(b.numericIdsAssigned,false);
 }
});
test('all six new structures have source-exact windows, three-high doors, and accessible category rooms',()=>{
 for(const b of M1_CATEGORY_ARCADES){
  const c=cells(b),seen=reachable(b);
  for(const room of b.rooms)assert(seen.has(room.access.join(',')),b.id+' inaccessible '+room.name);
  for(const o of b.openings.filter(o=>o.type==='entrance'||o.type==='internal-doorway'))
   for(let dy=0;dy<3;dy++)assert(!c.has(point(o.x,o.y+dy,o.z)),b.id+' three-high doorway blocked');
  const windows=b.openings.filter(o=>o.type==='window');
  assert.equal(windows.length,b.voxels.filter(v=>v.kind==='window').length);
  for(const w of windows)assert.equal(c.get(point(w.x,w.y,w.z))?.material,w.material);
 }
});
test('each original merchant architecture has authored facade depth, bearing piers and large distinct regional roof masses',()=>{
 const sig=new Set();
 for(const [i,b] of M1_CATEGORY_ARCADES.entries()){
  const p=M1_CATEGORY_ARCADES_PROFILES[i],c=cells(b);
  const roof=b.voxels.filter(v=>v.roofBearing),spans=b.voxels.filter(v=>v.structuralSpanUnverified);
  assert(roof.length>=50&&spans.length>0,b.id+' architecture only nominal');
  for(const v of roof)assert.equal(c.get(point(v.x,v.y-1,v.z))?.kind,'roof',b.id+' disconnected mass');
  for(const [x0,x1,z,role] of p.facadeRecesses){
   for(const x of [x0,x1])assert.equal(c.get(point(x,2,z))?.architecturalRole,role+'-bearing-pier');
   for(let x=x0+1;x<x1;x++)for(let y=2;y<=4;y++){
    assert(!c.has(point(x,y,z)),b.id+' not genuinely recessed');
    assert.equal(c.get(point(x,y,z-1))?.architecturalRole,role+'-inset-panel');
   }
  }
  sig.add(JSON.stringify([...new Set(roof.map(v=>v.architecturalRole))].sort()));
 }
 assert.equal(sig.size,6);
});
test('real Pack5 producer confirms two-cell mountain pen parts and temperate bank ironbound gate orientation',()=>{
 const pet=M1_CATEGORY_ARCADES.find(x=>x.category==='pet-shop');
 const anchors=pet.voxels.filter(v=>v.physicalVariant==='oak-stall-divider'),footprints=new Set();
 assert.equal(anchors.length,2);
 for(const v of anchors){
  const physical=resolveManualFivePackAsset(v.material,{variant:v.physicalVariant,orientation:v.intendedFacing});
  assert.equal(physical.occupiedOffsets.length,2);
  for(const [x,y,z] of physical.occupiedOffsets){
   const key=point(v.x+x,v.y+y,v.z+z);assert(!footprints.has(key),'overlapping physical pen');footprints.add(key);
  }
 }
 assert.equal(footprints.size,4);
 const bank=M1_CATEGORY_ARCADES.find(x=>x.category==='bank');
 const gate=bank.openings.find(o=>o.role==='vault-threshold'),second=bank.openings.find(o=>o.role==='vault-wide-secondary');
 assert(gate&&second);assert.equal(gate.doorSymbol,'pack5:094');
 assert.equal(gate.intendedFacing,'north');assert.equal(gate.physicalVariant,'citadel-ironbound-leaves');
 const physical=resolveManualFivePackAsset(gate.doorSymbol,{variant:gate.physicalVariant,orientation:gate.intendedFacing});
 assert.equal(physical.occupiedOffsets.length,2);
 const used=physical.occupiedOffsets.map(([x,y,z])=>point(gate.x+x,gate.y+y,gate.z+z));
 assert(used.includes(point(gate.x,gate.y,gate.z)));
 assert(used.includes(point(second.x,second.y,second.z)));
 const c=cells(bank);
 for(const [x,y,z] of physical.occupiedOffsets)for(let dy=0;dy<3;dy++)
  assert(!c.has(point(gate.x+x,gate.y+y+dy,gate.z+z)),'blocked physical gate');
});
